"""Renders the vertical (1080x1920) explainer video frame by frame and pipes it to ffmpeg.

usage: python3 src/render.py [--preview t1,t2,...]   (preview writes PNG stills only)
"""
import math
import os
import subprocess
import sys
from functools import lru_cache
from multiprocessing import Pool

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

sys.path.insert(0, os.path.dirname(__file__))
from timeline import CHUNKS, DURATION, SCENES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, "assets", *p)  # noqa: E731
WIDE = os.environ.get("VIDEO_FORMAT") == "wide"
W, H, FPS = (1920, 1080, 30) if WIDE else (1080, 1920, 30)
XFADE = 0.4

# palette
NAVY = (12, 22, 38)
WHITE = (255, 255, 255)
GOLD = (255, 196, 46)
RED = (230, 57, 70)
FLAG_GREEN = (0, 106, 78)
FLAG_RED = (244, 42, 65)
SKY = (82, 170, 255)
GRAY = (190, 198, 210)

BN = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")


def bn_money(n):
    s = str(int(n))
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        parts = []
        while len(head) > 2:
            parts.insert(0, head[-2:])
            head = head[:-2]
        if head:
            parts.insert(0, head)
        s = ",".join(parts + [tail])
    return s.translate(BN)


# ---------------------------------------------------------------- easing / timing
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_io(x):
    x = clamp(x)
    return 3 * x * x - 2 * x * x * x


def ease_back(x):
    x = clamp(x)
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def prog(t, t0, d=0.45):
    return ease_out((t - t0) / d)


# ---------------------------------------------------------------- text
@lru_cache(None)
def font(weight, size):
    return ImageFont.truetype(A("fonts", f"HindSiliguri-{weight}.ttf"), size,
                              layout_engine=ImageFont.Layout.RAQM)


_probe = ImageDraw.Draw(Image.new("L", (8, 8)))


def text_w(text, size, weight="Bold"):
    b = _probe.textbbox((0, 0), text, font=font(weight, size), language="bn")
    return b[2] - b[0]


@lru_cache(4096)
def text_img(text, size, weight="Bold", color=WHITE, shadow=True):
    f = font(weight, size)
    b = _probe.textbbox((0, 0), text, font=f, language="bn")
    pad = int(size * 0.45)
    w, h = b[2] - b[0] + 2 * pad, int(size * 1.25) + 2 * pad
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    # vertical position from font metrics so lines share a baseline
    asc, desc = f.getmetrics()
    y = pad + (int(size * 1.25) - (asc + desc)) // 2
    d = ImageDraw.Draw(im)
    d.text((pad - b[0], y), text, font=f, fill=color + (255,), language="bn")
    if shadow:
        a = im.getchannel("A").filter(ImageFilter.GaussianBlur(max(2, size // 12)))
        sh = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        sh.putalpha(a.point(lambda v: int(v * 0.85)))
        sh = Image.alpha_composite(sh, Image.new("RGBA", (w, h), (0, 0, 0, 0)))
        out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        out.alpha_composite(sh, (0, 0))
        out.alpha_composite(sh, (0, 0))
        out.alpha_composite(im)
        return out
    return im


def wrap(text, size, weight, maxw):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if text_w(trial, size, weight) <= maxw or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def put(frame, im, cx, cy, alpha=1.0, scale=1.0):
    """Composite RGBA `im` centred at (cx, cy) with opacity and scale."""
    if alpha <= 0.003 or scale <= 0.01:
        return
    if abs(scale - 1) > 0.002:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))),
                       Image.BICUBIC)
    if alpha < 0.997:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: int(v * alpha)))
    x, y = int(round(cx - im.width / 2)), int(round(cy - im.height / 2))
    sx, sy = max(0, -x), max(0, -y)
    ex, ey = min(im.width, frame.width - x), min(im.height, frame.height - y)
    if ex <= sx or ey <= sy:
        return
    if (sx, sy, ex, ey) != (0, 0, im.width, im.height):
        im = im.crop((sx, sy, ex, ey))
    frame.alpha_composite(im, (x + sx, y + sy))


def text(frame, s, cx, cy, size, weight="Bold", color=WHITE, alpha=1.0, scale=1.0, rise=0.0):
    put(frame, text_img(s, size, weight, color), cx, cy + rise, alpha, scale)


def reveal(frame, t, t0, s, cx, cy, size, weight="Bold", color=WHITE, d=0.45, t_out=None):
    """Fade + rise-in text, optionally fading out at t_out."""
    p = prog(t, t0, d)
    a = p
    if t_out is not None:
        a *= 1 - clamp((t - t_out) / 0.3)
    text(frame, s, cx, cy, size, weight, color, a, rise=(1 - p) * 40)


# ---------------------------------------------------------------- shapes
def rrect(size, radius, fill, outline=None, width=0, ss=2):
    w, h = size
    im = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, w * ss - 1, h * ss - 1), radius * ss, fill=fill,
                                         outline=outline, width=width * ss)
    return im.resize((w, h), Image.LANCZOS)


@lru_cache(256)
def chip(label, size, bg, fg=WHITE, padx=34, pady=14, weight="Bold", icon=None):
    t = text_img(label, size, weight, fg, shadow=False)
    f = font(weight, size)
    b = _probe.textbbox((0, 0), label, font=f, language="bn")
    tw = b[2] - b[0]
    iw = int(size * 1.1) if icon else 0
    w = tw + 2 * padx + iw
    h = int(size * 1.35) + 2 * pady
    im = rrect((w, h), h // 2, bg)
    if icon:
        ic = icon_img(icon, int(size * 0.9), fg)
        im.alpha_composite(ic, (padx - 6, (h - ic.height) // 2))
    tx = padx + iw + tw // 2
    put(im, t, tx, h // 2 + int(size * 0.02))
    return im


# simple vector icons drawn at 4x then downsampled for anti-aliasing
@lru_cache(64)
def icon_img(name, size, color=WHITE):
    S = 4
    s = size * S
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = color + (255,)
    lw = max(2, s // 14)
    if name == "house":
        d.polygon([(s * .5, s * .08), (s * .95, s * .48), (s * .05, s * .48)], fill=c)
        d.rectangle((s * .17, s * .45, s * .83, s * .92), fill=c)
        d.rectangle((s * .42, s * .6, s * .58, s * .92), fill=(0, 0, 0, 0))
    elif name == "rice":
        d.chord((s * .08, s * .2, s * .92, s * .9), 0, 180, fill=c)
        for i, x in enumerate((.3, .45, .6, .72)):
            d.ellipse((s * x - s * .07, s * (.42 - .05 * (i % 2)) - s * .06,
                       s * x + s * .07, s * (.42 - .05 * (i % 2)) + s * .06), fill=c)
        d.rectangle((s * .1, s * .52, s * .9, s * .56), fill=c)
    elif name == "book":
        d.polygon([(s * .05, s * .2), (s * .48, s * .28), (s * .48, s * .88), (s * .05, s * .8)], fill=c)
        d.polygon([(s * .95, s * .2), (s * .52, s * .28), (s * .52, s * .88), (s * .95, s * .8)], fill=c)
    elif name == "medical":
        d.rounded_rectangle((s * .08, s * .08, s * .92, s * .92), s * .14, fill=c)
        d.rectangle((s * .42, s * .22, s * .58, s * .78), fill=(0, 0, 0, 0))
        d.rectangle((s * .22, s * .42, s * .78, s * .58), fill=(0, 0, 0, 0))
    elif name == "pin":
        d.ellipse((s * .18, s * .04, s * .82, s * .68), fill=c)
        d.polygon([(s * .22, s * .48), (s * .78, s * .48), (s * .5, s * .97)], fill=c)
        d.ellipse((s * .37, s * .2, s * .63, s * .46), fill=(0, 0, 0, 0))
    elif name == "warn":
        d.polygon([(s * .5, s * .06), (s * .96, s * .9), (s * .04, s * .9)], fill=c)
        d.rectangle((s * .45, s * .32, s * .55, s * .64), fill=(0, 0, 0, 0))
        d.ellipse((s * .44, s * .7, s * .56, s * .82), fill=(0, 0, 0, 0))
    elif name == "bolt":
        d.polygon([(s * .58, s * .02), (s * .15, s * .58), (s * .45, s * .58), (s * .35, s * .98),
                   (s * .85, s * .4), (s * .55, s * .4)], fill=c)
    elif name == "gear":
        cx = cy = s / 2
        for k in range(8):
            a = k * math.pi / 4
            x, y = cx + math.cos(a) * s * .36, cy + math.sin(a) * s * .36
            d.ellipse((x - s * .1, y - s * .1, x + s * .1, y + s * .1), fill=c)
        d.ellipse((s * .18, s * .18, s * .82, s * .82), fill=c)
        d.ellipse((s * .38, s * .38, s * .62, s * .62), fill=(0, 0, 0, 0))
    elif name == "fist":
        d.rounded_rectangle((s * .22, s * .3, s * .8, s * .72), s * .08, fill=c)
        for k in range(4):
            x = s * (.22 + k * .145)
            d.rounded_rectangle((x, s * .14, x + s * .13, s * .42), s * .06, fill=c)
        d.rectangle((s * .34, s * .7, s * .7, s * .96), fill=c)
    elif name == "shirt":
        d.polygon([(s * .32, s * .08), (s * .05, s * .25), (s * .16, s * .45), (s * .25, s * .4),
                   (s * .25, s * .94), (s * .75, s * .94), (s * .75, s * .4), (s * .84, s * .45),
                   (s * .95, s * .25), (s * .68, s * .08), (s * .58, s * .16), (s * .42, s * .16)],
                  fill=c)
    elif name == "globe":
        d.ellipse((s * .05, s * .05, s * .95, s * .95), outline=c, width=lw)
        d.ellipse((s * .3, s * .05, s * .7, s * .95), outline=c, width=lw)
        d.line((s * .05, s * .5, s * .95, s * .5), fill=c, width=lw)
        d.line((s * .12, s * .28, s * .88, s * .28), fill=c, width=lw)
        d.line((s * .12, s * .72, s * .88, s * .72), fill=c, width=lw)
    return im.resize((size, size), Image.LANCZOS)


# ---------------------------------------------------------------- photos
def grade(im, kind):
    im = im.convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(1.12)
    tints = {
        "warm": ((255, 170, 90), 0.10, 1.0),
        "red": ((200, 30, 40), 0.16, 0.95),
        "cool": ((40, 90, 160), 0.18, 0.8),
        "gray": ((40, 50, 70), 0.15, 0.0),
        "sepia": ((140, 90, 40), 0.22, 0.25),
        "neutral": ((0, 0, 0), 0.0, 1.0),
    }
    col, amt, sat = tints[kind]
    im = ImageEnhance.Color(im).enhance(sat)
    if amt:
        im = Image.blend(im, Image.new("RGB", im.size, col), amt)
    return im


class Photo:
    def __init__(self, fname, kind, crop=None):
        im = Image.open(A("images", fname)).convert("RGB")
        if crop:
            im = im.crop(crop)
        self.src = grade(im, kind)
        self._bg = None

    def view(self, w, h, z=1.0, fx=0.5, fy=0.5):
        sw, sh = self.src.size
        asp = w / h
        if sw / sh > asp:
            ch, cw = sh, sh * asp
        else:
            cw, ch = sw, sw / asp
        cw, ch = cw / z, ch / z
        x0 = clamp(fx * sw - cw / 2, 0, sw - cw)
        y0 = clamp(fy * sh - ch / 2, 0, sh - ch)
        return self.src.resize((w, h), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))

    def bg(self):
        if self._bg is None:
            small = self.view(W // 10, H // 10).filter(ImageFilter.GaussianBlur(5))
            big = small.resize((W, H), Image.BICUBIC)
            big = ImageEnhance.Brightness(big).enhance(0.32).convert("RGBA")
            self._bg = Image.alpha_composite(big, GRAD)
        return self._bg


def make_grad(side=None):
    """Darkening overlay. Vertical: top + bottom bands. Wide: bottom band plus an
    optional dark side ('left' / 'right') where the headline text sits."""
    sw, sh = W // 8, H // 8
    g = Image.new("L", (sw, sh))
    for y in range(sh):
        for x in range(sw):
            fy, fx = y / sh, x / sw
            if WIDE:
                v = 0.75 * clamp((fy - 0.62) / 0.38)
                if side:
                    d = fx if side == "left" else 1 - fx
                    v = max(v, 0.88 * (1 - clamp(d / 0.62)) ** 1.3)
            else:
                v = 0.55 * (1 - clamp(fy * H / 520)) + 0.6 * clamp((fy * H - 1300) / 620)
            g.putpixel((x, y), int(255 * clamp(v)))
    g = g.resize((W, H), Image.BICUBIC)
    im = Image.new("RGBA", (W, H), NAVY + (0,))
    im.putalpha(g)
    return im


def make_vignette():
    s = 64
    m = Image.new("L", (s, s))
    for y in range(s):
        for x in range(s):
            dx, dy = (x - s / 2) / (s / 2), (y - s / 2) / (s / 2)
            m.putpixel((x, y), int(255 * clamp((math.hypot(dx * 0.9, dy * 0.75) - 0.55) * 0.9)))
    m = m.resize((W, H), Image.BICUBIC)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    im.putalpha(m)
    return im


@lru_cache(16)
def fade_mask(w, h, edge=110):
    m = Image.new("L", (1, h))
    for y in range(h):
        m.putpixel((0, y), int(255 * ease_io(min(y, h - 1 - y) / edge)))
    return m.resize((w, h))


GRAD = make_grad()
VIGN = make_vignette()

PH = {
    "garment": Photo("garment_worker.jpg", "warm", crop=(0, 60, 750, 560)),
    "garment_gray": Photo("garment_worker.jpg", "gray", crop=(0, 60, 750, 560)),
    "march": Photo("march.webp", "red"),
    "police": Photo("police.jpg", "cool"),
    "women": Photo("women_protest.jpg", "warm"),
    "factory": Photo("factory_floor.jpg", "neutral"),
    "factory_cool": Photo("factory_floor.jpg", "cool"),
    "jute": Photo("jute_worker.webp", "sepia"),
}


def panel(frame, key, y0, h, lt, dur, z0=1.04, z1=1.16, fx0=0.5, fx1=0.5, fy=0.5, edge=110, dim=0.0):
    p = ease_io(lt / max(dur, 0.1))
    im = PH[key].view(W, h, z0 + (z1 - z0) * p, fx0 + (fx1 - fx0) * p, fy)
    if dim:
        im = ImageEnhance.Brightness(im).enhance(1 - dim)
    im = im.convert("RGBA")
    im.putalpha(fade_mask(W, h, edge))
    frame.alpha_composite(im, (0, y0))


def base(key):
    return PH[key].bg().copy()


def solid(col):
    return Image.new("RGBA", (W, H), col + (255,))


# ---------------------------------------------------------------- subtitles
SUB_Y = 1520


def subtitles(frame, t, y=None, maxw=920, size=50):
    y = SUB_Y if y is None else y
    for (s, e, txt, show) in CHUNKS:
        if not show or not (s - 0.1 <= t <= e + 0.35):
            continue
        a = clamp((t - s + 0.1) / 0.2) * (1 - clamp((t - e - 0.1) / 0.25))
        lines = wrap(txt, size, "SemiBold", maxw)
        lh = int(size * 1.4)
        boxh = lh * len(lines) + 40
        boxw = max(text_w(l, size, "SemiBold") for l in lines) + 70
        box = rrect((boxw, boxh), 22, (8, 12, 22, 175))
        put(frame, box, W / 2, y, a)
        for i, l in enumerate(lines):
            text(frame, l, W / 2, y - (len(lines) - 1) * lh / 2 + i * lh, size, "SemiBold", WHITE, a)


# ---------------------------------------------------------------- scenes
def scene1(t):  # sweat -> garments sold abroad
    f = base("garment")
    panel(f, "garment", 520, 900, t, 5.4, 1.0, 1.15, 0.5, 0.42, 0.45)
    reveal(f, t, 0.15, "শ্রমিকের ঘামে তৈরি পোশাক", W / 2, 300, 74)
    reveal(f, t, 1.6, "বিদেশে বিক্রি হয় লাখ লাখ টাকায়", W / 2, 400, 60, color=GOLD)
    # shirt + price tag badge
    p = ease_back((t - 1.9) / 0.6)
    if p > 0:
        bob = math.sin(t * 3) * 6
        badge = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
        badge.alpha_composite(rrect((300, 300), 150, (255, 196, 46, 235)))
        put(badge, icon_img("shirt", 150, NAVY), 150, 120)
        put(badge, text_img("৳ লাখ লাখ", 44, "Bold", NAVY, shadow=False), 150, 225)
        put(f, badge, 860, 1250 + bob, clamp(p * 2), 0.2 + 0.8 * p)
        g = prog(t, 2.2, 0.5)
        put(f, icon_img("globe", 110, WHITE), 860 - 170, 1150, g * 0.9)
    return f


def scene2(t):  # monthly wage 12,500 — can a family survive?
    f = solid(NAVY)
    bgp = PH["garment_gray"].view(W, H, 1.1)
    bgp = ImageEnhance.Brightness(bgp).enhance(0.22).convert("RGBA")
    f.alpha_composite(bgp)
    f.alpha_composite(GRAD)
    lt = t - 4.92
    reveal(f, t, 4.95, "সেই শ্রমিকের", W / 2, 300, 62, color=GRAY)
    reveal(f, t, 5.25, "মাসিক বেতন", W / 2, 390, 84)
    # number moves up once the family question starts
    mv = ease_io((t - 9.2) / 0.6)
    ny = 800 - 230 * mv
    ns = 1 - 0.32 * mv
    a = prog(t, 6.87, 0.3)
    text(f, "মাত্র", W / 2, ny - 175 * ns, int(64), "SemiBold", GOLD, a * (1 - mv))
    cnt = ease_out((t - 6.95) / 1.1) * 12500
    cnt = round(cnt / 100) * 100 if cnt < 12500 else 12500
    pulse = 1 + 0.06 * math.sin(clamp((t - 8.1) / 0.5) * math.pi)
    col = RED if t > 8.05 else WHITE
    text(f, "৳ " + bn_money(cnt), W / 2, ny, 190, "Bold", col, a, ns * pulse)
    text(f, "টাকা", W / 2, ny + 150 * ns, 58, "SemiBold", GRAY, a * (1 - mv))
    # family needs
    items = [("house", "ঘরভাড়া"), ("rice", "খাবার"), ("book", "সন্তানের পড়াশোনা"), ("medical", "চিকিৎসা")]
    for i, (ic, lab) in enumerate(items):
        p = ease_back((t - 9.45 - i * 0.28) / 0.5)
        if p <= 0:
            continue
        cx = 300 + (i % 2) * 480
        cy = 900 + (i // 2) * 300
        card = rrect((430, 260), 30, (255, 255, 255, 30), outline=(255, 255, 255, 70), width=2)
        put(card, icon_img(ic, 100, GOLD), 215, 95)
        put(card, text_img(lab, 42, "SemiBold", WHITE, shadow=False), 215, 200)
        put(f, card, cx, cy, clamp(p * 2), 0.6 + 0.4 * p)
    q = ease_back((t - 10.6) / 0.5)
    if q > 0:
        qb = rrect((150, 150), 75, RED + (255,))
        put(qb, text_img("?", 110, "Bold", WHITE, shadow=False), 75, 72)
        put(f, qb, 540, 1050, 1, q)
    return f


def scene3(t):  # demand: minimum wage 30,000
    lt = t - 12.38
    f = base("march")
    panel(f, "march", 560, 860, lt, 8.5, 1.02, 1.2, 0.5, 0.55, 0.5)
    reveal(f, t, 12.45, "ন্যূনতম মজুরির দাবি", W / 2, 250, 72)
    # wage bars
    full = 560
    for i, (lab, val, col, t0) in enumerate([("বর্তমান", 12500, RED, 12.7), ("দাবি", 30000, (46, 204, 113), 13.5)]):
        y = 370 + i * 95
        a = prog(t, t0, 0.35)
        text(f, lab, 165, y, 42, "SemiBold", WHITE, a)
        g = ease_out((t - t0 - 0.1) / 1.0)
        bw = int(full * val / 30000 * g)
        if bw > 4:
            put(f, rrect((bw, 58), 14, col + (255,)), 260 + bw / 2, y, a)
            put(f, text_img("৳ " + bn_money(val * g if g < 1 else val), 40, "Bold", WHITE), 260 + bw + 95, y, a)
    c = ease_back((t - 16.2) / 0.5)
    if c > 0:
        put(f, chip("পোশাকশ্রমিকদের আন্দোলন", 44, RED + (240,), icon="fist"), W / 2, 1330, clamp(c * 2), 0.7 + 0.3 * c)
    return f


def scene4(t):  # unrest in Gazipur and other industrial zones
    lt = t - 20.21
    f = base("police")
    panel(f, "police", 560, 860, lt, 8.0, 1.05, 1.22, 0.38, 0.6, 0.55)
    p = ease_back((t - 20.3) / 0.5)
    put(f, icon_img("pin", 80, RED), 200, 245, clamp(p * 2), max(0.01, p))
    reveal(f, t, 20.4, "গাজীপুরসহ শিল্পাঞ্চলে", 590, 245, 64)
    chips = [("উত্তেজনা", (243, 156, 18), "warn", 22.3), ("সংঘর্ষ", RED, "bolt", 23.0),
             ("উৎপাদন ব্যাহত", (90, 100, 120), "gear", 24.0)]
    imgs = [chip(l, 40, c + (245,), icon=ic) for l, c, ic, _ in chips]
    total = sum(i.width for i in imgs) + 24 * (len(imgs) - 1)
    x = (W - total) / 2
    for im, (_, _, _, t0) in zip(imgs, chips):
        p = ease_back((t - t0) / 0.45)
        put(f, im, x + im.width / 2, 395, clamp(p * 2), 0.5 + 0.5 * p)
        x += im.width + 24
    # "news" tag with blinking dot
    a = prog(t, 20.5, 0.3)
    tag = chip("সংবাদ", 34, (200, 20, 30, 235))
    put(f, tag, 40 + tag.width / 2, 640, a)
    if int(t * 2) % 2 == 0:
        put(f, rrect((18, 18), 9, (255, 255, 255, 255)), 40 + tag.width + 22, 640, a)
    return f


SCALE_CACHE = {}


def scale_icon(angle_deg, size=300):
    S = 2
    s = size * S
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = (255, 255, 255, 255)
    cx, cy = s / 2, s * 0.3
    d.polygon([(cx, cy), (cx - s * .12, s * .9), (cx + s * .12, s * .9)], fill=c)
    d.rectangle((cx - s * .22, s * .88, cx + s * .22, s * .94), fill=c)
    a = math.radians(angle_deg)
    L = s * 0.4
    lx, ly = cx - L * math.cos(a), cy - L * math.sin(a)
    rx, ry = cx + L * math.cos(a), cy + L * math.sin(a)
    d.line((lx, ly, rx, ry), fill=c, width=int(s * .035))
    d.ellipse((cx - s * .04, cy - s * .04, cx + s * .04, cy + s * .04), fill=GOLD + (255,))
    for (px, py, col) in ((lx, ly, RED), (rx, ry, SKY)):
        d.line((px, py, px - s * .1, py + s * .2), fill=c, width=int(s * .012))
        d.line((px, py, px + s * .1, py + s * .2), fill=c, width=int(s * .012))
        d.chord((px - s * .13, py + s * .1, px + s * .13, py + s * .3), 0, 180, fill=col + (255,))
    return im.resize((size, size), Image.LANCZOS)


def scene5(t):  # workers vs owners — the balance
    lt = t - 27.93
    f = solid(NAVY)
    on2 = ease_io((t - 30.75) / 0.5)
    panel(f, "women", 130, 600, lt, 9.5, 1.04, 1.14, 0.5, 0.5, 0.45, edge=70)
    panel(f, "factory_cool", 800, 600, lt, 9.5, 1.12, 1.02, 0.4, 0.6, 0.5, edge=70, dim=0.6 * (1 - on2))
    # labels
    a = prog(t, 28.0, 0.4)
    put(f, chip("শ্রমিক", 46, RED + (245,), icon="fist"), 190, 545, a)
    reveal(f, t, 28.3, "ন্যায্য মজুরির দাবি", 680, 545, 54)
    b = prog(t, 30.8, 0.4)
    put(f, chip("মালিক", 46, (40, 110, 200, 245), icon="gear"), 190, 1200, b)
    reveal(f, t, 31.5, "উৎপাদন খরচ", 640, 1170, 46)
    reveal(f, t, 32.6, "আন্তর্জাতিক বাজারে প্রতিযোগিতা", 640, 1245, 40, color=GOLD)
    # balance scale in the middle, swinging between the two sides
    ang = 14 * math.sin((t - 28) * 1.6) * (0.5 + 0.5 * clamp((t - 28) / 2))
    if t < 30.75:
        ang = -10 + 4 * math.sin(t * 3)
    key = round(ang * 2) / 2
    if key not in SCALE_CACHE:
        SCALE_CACHE[key] = scale_icon(key)
    disc = rrect((250, 250), 125, (12, 22, 38, 230), outline=(255, 255, 255, 120), width=3)
    put(f, disc, W / 2, 745, prog(t, 28.1, 0.4))
    put(f, SCALE_CACHE[key], W / 2, 745, prog(t, 28.1, 0.4), 0.72)
    return f


def scene6(t):  # the big question
    f = solid((8, 10, 18))
    bgp = PH["garment_gray"].view(W, H, 1.15 + 0.05 * clamp((t - 37.46) / 6))
    bgp = ImageEnhance.Brightness(bgp).enhance(0.28).convert("RGBA")
    f.alpha_composite(bgp)
    out = 40.4
    reveal(f, t, 37.5, "কিন্তু এই দ্বন্দ্বের মাঝে", W / 2, 640, 56, "SemiBold", GRAY)
    reveal(f, t, 38.4, "সবচেয়ে বড় প্রশ্ন", W / 2, 740, 76, color=GOLD)
    p = ease_out((t - 40.0) / 0.5)
    # line under the heading
    if p > 0:
        lw = int(520 * p)
        put(f, rrect((max(lw, 2), 6), 3, GOLD + (255,)), W / 2, 820, 1)
    reveal(f, t, 40.7, "শ্রমিকের জীবনমানের", W / 2, 990, 88)
    reveal(f, t, 41.2, "দায়িত্ব নেবে", W / 2, 1105, 88)
    k = ease_back((t - 41.75) / 0.55)
    if k > 0:
        text(f, "কে?", W / 2, 1320, 230, "Bold", RED, clamp(k * 2), 0.4 + 0.6 * k)
    del out
    return f


def scene7(t):  # garments matter to the economy
    lt = t - 43.56
    f = base("factory")
    panel(f, "factory", 560, 860, lt, 4.5, 1.0, 1.15, 0.45, 0.55, 0.5)
    reveal(f, t, 43.65, "বাংলাদেশের অর্থনীতিতে", W / 2, 260, 62, "SemiBold", GRAY)
    reveal(f, t, 44.1, "পোশাকশিল্পের অবদান বিশাল", W / 2, 370, 72, color=GOLD)
    # rising bars + arrow
    card_a = prog(t, 44.3, 0.4)
    if card_a > 0:
        card = Image.new("RGBA", (420, 330), (0, 0, 0, 0))
        card.alpha_composite(rrect((420, 330), 28, (10, 16, 30, 215)))
        d = ImageDraw.Draw(card)
        for i in range(5):
            g = ease_out((t - 44.5 - i * 0.18) / 0.6)
            bh = int((60 + i * 45) * g)
            x0 = 50 + i * 68
            if bh > 0:
                d.rounded_rectangle((x0, 290 - bh, x0 + 48, 290), 8, fill=GOLD + (255,))
        ar = ease_out((t - 45.5) / 0.6)
        if ar > 0:
            x1, y1 = 40 + 330 * ar, 250 - 200 * ar
            d.line((40, 250, x1, y1), fill=(46, 204, 113, 255), width=10)
            if ar > 0.95:
                d.polygon([(x1 + 22, y1 - 20), (x1 - 22, y1 - 8), (x1 + 6, y1 + 22)], fill=(46, 204, 113, 255))
        put(f, card, W - 250, 1240, card_a)
    return f


def scene8(t):  # whose hands hold the industry up
    lt = t - 47.49
    f = base("jute")
    panel(f, "jute", 520, 900, lt, 8.6, 1.02, 1.18, 0.55, 0.68, 0.45)
    reveal(f, t, 47.6, "যে শ্রমিকের হাতে", W / 2, 260, 64, "SemiBold", GRAY)
    reveal(f, t, 48.2, "দাঁড়িয়ে আছে এই শিল্প", W / 2, 370, 76)
    c = ease_back((t - 50.75) / 0.5)
    if c > 0:
        put(f, chip("তার জীবনই অনিশ্চিত", 48, RED + (240,), icon="warn"), W / 2, 1330, clamp(c * 2), 0.6 + 0.4 * c)
    # final question replaces subtitles
    reveal(f, t, 52.95, "তাহলে সেই উন্নয়ন", W / 2, 1480, 64, "SemiBold")
    reveal(f, t, 53.5, "কতটা অর্থবহ?", W / 2, 1590, 96, color=GOLD)
    return f


def scene9(t):  # closing message in flag colours
    f = solid(FLAG_GREEN)
    # soft crowd texture
    tex = PH["march"].view(W, H, 1.0 + 0.04 * clamp((t - 55.7) / 8)).convert("L")
    tex = ImageOps.colorize(tex, (0, 60, 44), (0, 150, 110)).convert("RGBA")
    tex.putalpha(46)
    f.alpha_composite(tex)
    r = 330 * ease_back((t - 55.8) / 0.9)
    if r > 2:
        put(f, rrect((int(2 * r), int(2 * r)), int(r), FLAG_RED + (255,)), W / 2, 860, 1)
    reveal(f, t, 55.72, "মনে রাখবেন,", W / 2, 360, 66, "SemiBold")
    reveal(f, t, 56.7, "শ্রমিক বাঁচলে", W / 2, 800, 96)
    reveal(f, t, 57.3, "শিল্প বাঁচবে", W / 2, 920, 96)
    reveal(f, t, 59.0, "আর শিল্প বাঁচলেই", W / 2, 1340, 72, "SemiBold")
    k = ease_back((t - 59.7) / 0.6)
    if k > 0:
        text(f, "বাঁচবে বাংলাদেশ", W / 2, 1470, 108, "Bold", GOLD, clamp(k * 2), 0.6 + 0.4 * k)
    return f


SCENE_FUNCS = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9]


def scene_at(i, t):
    f = SCENE_FUNCS[i](t)
    f.alpha_composite(VIGN)
    return f


def frame_at(t):
    i = max(k for k, s in enumerate(SCENES) if s <= t)
    f = scene_at(i, t)
    if i > 0 and t - SCENES[i] < XFADE:
        prev = scene_at(i - 1, t)
        f = Image.blend(prev, f, ease_io((t - SCENES[i]) / XFADE))
    subtitles(f, t)
    # fade in / out
    k = clamp(t / 0.4) * (1 - clamp((t - (DURATION - 1.3)) / 1.2))
    if k < 1:
        f = Image.blend(Image.new("RGBA", (W, H), (0, 0, 0, 255)), f, k)
    return f.convert("RGB")


FRAME_FN = None  # set by main(); read by pool workers (fork)


def render_index(n):
    return FRAME_FN(n / FPS).tobytes()


def main(frame_fn=None, name="shromik_bachle_shilpo_bachbe_9x16.mp4"):
    global FRAME_FN
    FRAME_FN = frame_fn or frame_at
    if len(sys.argv) > 2 and sys.argv[1] == "--preview":
        out = os.path.join(ROOT, "output", "preview")
        os.makedirs(out, exist_ok=True)
        for ts in sys.argv[2].split(","):
            FRAME_FN(float(ts)).save(os.path.join(out, f"{'w' if WIDE else 't'}{float(ts):05.2f}.png"))
        return
    music = os.path.join(ROOT, "output", "music.wav")
    if not os.path.exists(music):
        subprocess.check_call([sys.executable, os.path.join(ROOT, "src", "make_music.py"), music])
    dst = os.path.join(ROOT, "output", name)
    n = int(DURATION * FPS)
    cmd = ["ffmpeg", "-y", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", A("audio", "voiceover.mp3"), "-i", music,
           "-filter_complex",
           "[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,asplit=2[vo1][vo2];"
           "[2:a]aresample=48000,volume=0.9[mu];"
           "[mu][vo1]sidechaincompress=threshold=0.04:ratio=4:attack=20:release=400[md];"
           "[vo2][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95[a]",
           "-map", "0:v", "-map", "[a]", "-t", str(DURATION),
           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", dst]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(os.cpu_count()) as pool:
        for k, buf in enumerate(pool.imap(render_index, range(n), chunksize=6)):
            ff.stdin.write(buf)
            if k % 150 == 0:
                print(f"frame {k}/{n}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("wrote", dst)


if __name__ == "__main__":
    main()
