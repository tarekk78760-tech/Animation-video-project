"""16:9 (1920x1080) version of the video. Same timing, voice, music and assets as the
vertical cut; layouts redesigned for landscape: full-screen photos with the headline
column on the side away from the subject.

usage: python3 src/render_wide.py [--preview t1,t2,...]
"""
import math
import os
import sys

os.environ["VIDEO_FORMAT"] = "wide"
sys.path.insert(0, os.path.dirname(__file__))
import render as r  # noqa: E402
from render import (FLAG_GREEN, FLAG_RED, GOLD, GRAY, NAVY, RED, WHITE, W, H,  # noqa: E402
                    chip, clamp, ease_back, ease_io, ease_out, icon_img, prog, put,
                    reveal, rrect, text, text_img, bn_money)
from PIL import Image, ImageDraw, ImageEnhance, ImageOps  # noqa: E402

assert (W, H) == (1920, 1080)

GL = r.make_grad("left")
GR = r.make_grad("right")
GN = r.make_grad(None)
LX, RX = 560, 1360  # centre of the left / right text column
SUB_Y = 985


def photo(key, lt, dur, z0=1.03, z1=1.14, fx0=0.5, fx1=0.5, fy=0.5, grad=GL):
    p = ease_io(lt / max(dur, 0.1))
    f = r.PH[key].view(W, H, z0 + (z1 - z0) * p, fx0 + (fx1 - fx0) * p, fy).convert("RGBA")
    f.alpha_composite(grad)
    return f


def scene1(t):
    f = photo("garment", t, 5.4, 1.0, 1.12, 0.38, 0.33, 0.45, GR)
    reveal(f, t, 0.15, "শ্রমিকের ঘামে তৈরি পোশাক", RX, 300, 76)
    reveal(f, t, 1.6, "বিদেশে বিক্রি হয় লাখ লাখ টাকায়", RX, 405, 58, color=GOLD)
    p = ease_back((t - 1.9) / 0.6)
    if p > 0:
        bob = math.sin(t * 3) * 6
        badge = Image.new("RGBA", (280, 280), (0, 0, 0, 0))
        badge.alpha_composite(rrect((280, 280), 140, (255, 196, 46, 235)))
        put(badge, icon_img("shirt", 140, NAVY), 140, 112)
        put(badge, text_img("৳ লাখ লাখ", 42, "Bold", NAVY, shadow=False), 140, 210)
        put(f, badge, RX + 90, 650 + bob, clamp(p * 2), 0.2 + 0.8 * p)
        put(f, icon_img("globe", 100, WHITE), RX - 150, 600, prog(t, 2.2, 0.5) * 0.9)
    return f


def scene2(t):
    f = Image.new("RGBA", (W, H), NAVY + (255,))
    bgp = r.PH["garment_gray"].view(W, H, 1.1)
    f.alpha_composite(ImageEnhance.Brightness(bgp).enhance(0.22).convert("RGBA"))
    reveal(f, t, 4.95, "সেই শ্রমিকের", LX, 200, 60, color=GRAY)
    reveal(f, t, 5.25, "মাসিক বেতন", LX, 290, 84)
    a = prog(t, 6.87, 0.3)
    text(f, "মাত্র", LX, 430, 62, "SemiBold", GOLD, a)
    cnt = ease_out((t - 6.95) / 1.1) * 12500
    cnt = round(cnt / 100) * 100 if cnt < 12500 else 12500
    pulse = 1 + 0.06 * math.sin(clamp((t - 8.1) / 0.5) * math.pi)
    text(f, "৳ " + bn_money(cnt), LX, 590, 190, "Bold", RED if t > 8.05 else WHITE, a, pulse)
    text(f, "টাকা", LX, 740, 58, "SemiBold", GRAY, a)
    items = [("house", "ঘরভাড়া"), ("rice", "খাবার"), ("book", "সন্তানের পড়াশোনা"), ("medical", "চিকিৎসা")]
    for i, (ic, lab) in enumerate(items):
        p = ease_back((t - 9.45 - i * 0.28) / 0.5)
        if p <= 0:
            continue
        card = rrect((400, 250), 30, (255, 255, 255, 30), outline=(255, 255, 255, 70), width=2)
        put(card, icon_img(ic, 96, GOLD), 200, 92)
        put(card, text_img(lab, 40, "SemiBold", WHITE, shadow=False), 200, 192)
        put(f, card, 1200 + (i % 2) * 440, 330 + (i // 2) * 290, clamp(p * 2), 0.6 + 0.4 * p)
    q = ease_back((t - 10.6) / 0.5)
    if q > 0:
        qb = rrect((150, 150), 75, RED + (255,))
        put(qb, text_img("?", 110, "Bold", WHITE, shadow=False), 75, 72)
        put(f, qb, 1420, 475, 1, q)
    return f


def scene3(t):
    f = photo("march", t - 12.38, 8.5, 1.02, 1.15, 0.55, 0.6, 0.5, GL)
    reveal(f, t, 12.45, "ন্যূনতম মজুরির দাবি", LX, 230, 76)
    full = 500
    for i, (lab, val, col, t0) in enumerate([("বর্তমান", 12500, RED, 12.7),
                                             ("দাবি", 30000, (46, 204, 113), 13.5)]):
        y = 370 + i * 100
        a = prog(t, t0, 0.35)
        text(f, lab, 190, y, 44, "SemiBold", WHITE, a)
        g = ease_out((t - t0 - 0.1) / 1.0)
        bw = int(full * val / 30000 * g)
        if bw > 4:
            put(f, rrect((bw, 60), 14, col + (255,)), 300 + bw / 2, y, a)
            put(f, text_img("৳ " + bn_money(val * g if g < 1 else val), 42, "Bold", WHITE),
                300 + bw + 100, y, a)
    c = ease_back((t - 16.2) / 0.5)
    if c > 0:
        put(f, chip("পোশাকশ্রমিকদের আন্দোলন", 46, RED + (240,), icon="fist"), LX, 640,
            clamp(c * 2), 0.7 + 0.3 * c)
    return f


def scene4(t):
    f = photo("police", t - 20.21, 8.0, 1.03, 1.15, 0.55, 0.62, 0.5, GL)
    p = ease_back((t - 20.3) / 0.5)
    put(f, icon_img("pin", 78, RED), 150, 270, clamp(p * 2), max(0.01, p))
    reveal(f, t, 20.4, "গাজীপুরসহ শিল্পাঞ্চলে", 520, 270, 68)
    chips = [("উত্তেজনা", (243, 156, 18), "warn", 22.3), ("সংঘর্ষ", RED, "bolt", 23.0),
             ("উৎপাদন ব্যাহত", (90, 100, 120), "gear", 24.0)]
    for k, (lab, col, ic, t0) in enumerate(chips):
        im = chip(lab, 46, col + (245,), icon=ic)
        p = ease_back((t - t0) / 0.45)
        put(f, im, 120 + im.width / 2 + (1 - clamp(p)) * -60, 410 + k * 115, clamp(p * 2))
    a = prog(t, 20.5, 0.3)
    tag = chip("সংবাদ", 34, (200, 20, 30, 235))
    put(f, tag, 120 + tag.width / 2, 120, a)
    if int(t * 2) % 2 == 0:
        put(f, rrect((18, 18), 9, (255, 255, 255, 255)), 120 + tag.width + 24, 120, a)
    return f


SCALES = {}


def scene5(t):
    lt = t - 27.93
    f = Image.new("RGBA", (W, H), NAVY + (255,))
    p = ease_io(lt / 9.5)
    on2 = ease_io((t - 30.75) / 0.5)
    left = r.PH["women"].view(954, H, 1.04 + 0.1 * p, 0.5, 0.45)
    right = r.PH["factory_cool"].view(954, H, 1.12 - 0.1 * p, 0.45 + 0.1 * p, 0.5)
    right = ImageEnhance.Brightness(right).enhance(1 - 0.6 * (1 - on2))
    f.paste(left, (0, 0))
    f.paste(right, (966, 0))
    f.alpha_composite(GN)
    a = prog(t, 28.0, 0.4)
    put(f, chip("শ্রমিক", 48, RED + (245,), icon="fist"), 477, 600, a)
    reveal(f, t, 28.3, "ন্যায্য মজুরির দাবি", 477, 710, 60)
    b = prog(t, 30.8, 0.4)
    put(f, chip("মালিক", 48, (40, 110, 200, 245), icon="gear"), 1443, 600, b)
    reveal(f, t, 31.5, "উৎপাদন খরচ", 1443, 710, 54)
    reveal(f, t, 32.6, "আন্তর্জাতিক বাজারে প্রতিযোগিতা", 1443, 790, 44, color=GOLD)
    ang = 14 * math.sin((t - 28) * 1.6) * (0.5 + 0.5 * clamp((t - 28) / 2))
    if t < 30.75:
        ang = -10 + 4 * math.sin(t * 3)
    key = round(ang * 2) / 2
    if key not in SCALES:
        SCALES[key] = r.scale_icon(key)
    disc = rrect((260, 260), 130, (12, 22, 38, 235), outline=(255, 255, 255, 120), width=3)
    put(f, disc, W / 2, 330, prog(t, 28.1, 0.4))
    put(f, SCALES[key], W / 2, 330, prog(t, 28.1, 0.4), 0.75)
    return f


def scene6(t):
    f = Image.new("RGBA", (W, H), (8, 10, 18, 255))
    bgp = r.PH["garment_gray"].view(W, H, 1.1 + 0.05 * clamp((t - 37.46) / 6))
    f.alpha_composite(ImageEnhance.Brightness(bgp).enhance(0.26).convert("RGBA"))
    reveal(f, t, 37.5, "কিন্তু এই দ্বন্দ্বের মাঝে", W / 2, 230, 54, "SemiBold", GRAY)
    reveal(f, t, 38.4, "সবচেয়ে বড় প্রশ্ন", W / 2, 325, 74, color=GOLD)
    p = ease_out((t - 40.0) / 0.5)
    if p > 0:
        put(f, rrect((max(int(520 * p), 2), 6), 3, GOLD + (255,)), W / 2, 400, 1)
    reveal(f, t, 40.7, "শ্রমিকের জীবনমানের দায়িত্ব নেবে", W / 2, 560, 90)
    k = ease_back((t - 41.75) / 0.55)
    if k > 0:
        text(f, "কে?", W / 2, 790, 230, "Bold", RED, clamp(k * 2), 0.4 + 0.6 * k)
    return f


def scene7(t):
    f = photo("factory", t - 43.56, 4.5, 1.0, 1.12, 0.6, 0.66, 0.5, GL)
    reveal(f, t, 43.65, "বাংলাদেশের অর্থনীতিতে", LX, 250, 62, "SemiBold", GRAY)
    reveal(f, t, 44.1, "পোশাকশিল্পের অবদান বিশাল", LX, 355, 74, color=GOLD)
    ca = prog(t, 44.3, 0.4)
    if ca > 0:
        card = Image.new("RGBA", (420, 330), (0, 0, 0, 0))
        card.alpha_composite(rrect((420, 330), 28, (10, 16, 30, 215)))
        d = ImageDraw.Draw(card)
        for i in range(5):
            g = ease_out((t - 44.5 - i * 0.18) / 0.6)
            bh = int((60 + i * 45) * g)
            if bh > 0:
                x0 = 50 + i * 68
                d.rounded_rectangle((x0, 290 - bh, x0 + 48, 290), 8, fill=GOLD + (255,))
        ar = ease_out((t - 45.5) / 0.6)
        if ar > 0:
            x1, y1 = 40 + 330 * ar, 250 - 200 * ar
            d.line((40, 250, x1, y1), fill=(46, 204, 113, 255), width=10)
            if ar > 0.95:
                d.polygon([(x1 + 22, y1 - 20), (x1 - 22, y1 - 8), (x1 + 6, y1 + 22)],
                          fill=(46, 204, 113, 255))
        put(f, card, LX, 640, ca)
    return f


def scene8(t):
    f = photo("jute", t - 47.49, 8.6, 1.02, 1.14, 0.6, 0.66, 0.45, GL)
    reveal(f, t, 47.6, "যে শ্রমিকের হাতে", LX, 220, 62, "SemiBold", GRAY)
    reveal(f, t, 48.2, "দাঁড়িয়ে আছে এই শিল্প", LX, 320, 76)
    c = ease_back((t - 50.75) / 0.5)
    if c > 0:
        put(f, chip("তার জীবনই অনিশ্চিত", 48, RED + (240,), icon="warn"), LX, 470,
            clamp(c * 2), 0.6 + 0.4 * c)
    reveal(f, t, 52.95, "তাহলে সেই উন্নয়ন", LX, 650, 62, "SemiBold")
    reveal(f, t, 53.5, "কতটা অর্থবহ?", LX, 770, 100, color=GOLD)
    return f


def scene9(t):
    f = Image.new("RGBA", (W, H), FLAG_GREEN + (255,))
    tex = r.PH["march"].view(W, H, 1.0 + 0.04 * clamp((t - 55.7) / 8)).convert("L")
    tex = ImageOps.colorize(tex, (0, 60, 44), (0, 150, 110)).convert("RGBA")
    tex.putalpha(46)
    f.alpha_composite(tex)
    rad = 290 * ease_back((t - 55.8) / 0.9)
    if rad > 2:
        put(f, rrect((int(2 * rad), int(2 * rad)), int(rad), FLAG_RED + (255,)), 600, 500, 1)
    reveal(f, t, 55.72, "মনে রাখবেন,", 600, 120, 60, "SemiBold")
    reveal(f, t, 56.7, "শ্রমিক বাঁচলে", 600, 445, 90)
    reveal(f, t, 57.3, "শিল্প বাঁচবে", 600, 560, 90)
    reveal(f, t, 59.0, "আর শিল্প বাঁচলেই", 1390, 430, 70, "SemiBold")
    k = ease_back((t - 59.7) / 0.6)
    if k > 0:
        text(f, "বাঁচবে", 1390, 560, 110, "Bold", GOLD, clamp(k * 2), 0.6 + 0.4 * k)
        text(f, "বাংলাদেশ", 1390, 700, 120, "Bold", GOLD, clamp(k * 2), 0.6 + 0.4 * k)
    return f


SCENES_W = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9]


def scene_at(i, t):
    f = SCENES_W[i](t)
    f.alpha_composite(r.VIGN)
    return f


def frame_wide(t):
    i = max(k for k, s in enumerate(r.SCENES) if s <= t)
    f = scene_at(i, t)
    if i > 0 and t - r.SCENES[i] < r.XFADE:
        f = Image.blend(scene_at(i - 1, t), f, ease_io((t - r.SCENES[i]) / r.XFADE))
    r.subtitles(f, t, SUB_Y, 1500, 46)
    k = clamp(t / 0.4) * (1 - clamp((t - (r.DURATION - 1.3)) / 1.2))
    if k < 1:
        f = Image.blend(Image.new("RGBA", (W, H), (0, 0, 0, 255)), f, k)
    return f.convert("RGB")


if __name__ == "__main__":
    r.main(frame_wide, "shromik_bachle_shilpo_bachbe_16x9.mp4")
