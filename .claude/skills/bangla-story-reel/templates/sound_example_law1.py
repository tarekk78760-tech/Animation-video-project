#!/usr/bin/env python3
"""Law 1 sound design: synthesized baroque-style score + SFX, mixed under the voiceover.
usage: python3 -I sound.py   (run inside law1/) -> audio/music.wav, audio/sfx.wav, audio/mix.wav
Everything is generated from scratch (numpy/scipy) — no third-party samples.
"""
import json, wave, subprocess, numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(7)
L = json.load(open('data/lines.json'))
DUR = L[-1]['e'] + 1.6
N = int(DUR * SR) + SR
def ls(i): return L[i - 1]['s']
def le(i): return L[i - 1]['e']
def lp(i, f): return ls(i) + (le(i) - ls(i)) * f

def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)
def lpf(x, hi, order=2): return sosfilt(butter(order, hi, 'low', fs=SR, output='sos'), x)
def hpf(x, lo, order=2): return sosfilt(butter(order, lo, 'high', fs=SR, output='sos'), x)
def env_ad(n, a, d): # attack/decay seconds
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(d, 1e-4)); return e
def add(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * g
def note_hz(m): return 440 * 2 ** ((m - 69) / 12)

# ================= INSTRUMENTS =================
def harpsichord(m, dur=1.2, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = note_hz(m)
    x = np.zeros(n)
    for h in range(1, 12):
        if f * h > 12000: break
        x += np.sin(2 * np.pi * f * h * t * (1 + .0007 * h) + rng.random() * 6) * (1 / h ** .9) * np.exp(-t * (2.2 + h * .55))
    x += np.sin(2 * np.pi * f * 1.003 * t) * .3 * np.exp(-t * 2.5)
    return x * env_ad(n, .002, dur) * vel * .22
def pad(m_list, dur, vel=1.0, bright=1800):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in m_list:
        f = note_hz(m)
        for d in (-.12, .0, .12):
            ph = rng.random() * 6
            for h in range(1, 8): x += np.sin(2 * np.pi * f * h * t * 2 ** (d / 12) + ph * h) / h
    x = lpf(x, bright)
    a = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
    return x * a / (len(m_list) * 6) * vel
def bass(m, dur, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = note_hz(m)
    x = np.sin(2 * np.pi * f * t) + .4 * np.sin(4 * np.pi * f * t) + .15 * np.sin(6 * np.pi * f * t)
    return x * env_ad(n, .01, dur * .7) * vel * .35
def timpani(dur=1.6, f=65, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t * (1 + .3 * np.exp(-t * 20))) * np.exp(-t * 3) + lpf(rng.standard_normal(n), 300) * np.exp(-t * 15) * .6
    return x * vel * .6
def bell(m, dur=2.0, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = note_hz(m); x = np.zeros(n)
    for r, a in ((1, 1), (2.76, .5), (5.4, .25), (8.9, .12)): x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * (1.5 + r * .6))
    return x * vel * .18

# ================= SCORE =================
music = np.zeros(N)
def section(t0, t1, fn):
    seg = np.zeros(int((t1 - t0 + 2) * SR)); fn(seg, t1 - t0)
    fade = np.ones(len(seg)); k = int(.8 * SR)
    fade[:k] = np.linspace(0, 1, k); e = int((t1 - t0) * SR); fade[e:e + k] = np.linspace(1, 0, k); fade[e + k:] = 0
    add(music, seg * fade, t0)

# chord tables (MIDI)
D, A, Bm, Fm, G = [62, 66, 69], [57, 61, 64], [59, 62, 66], [54, 57, 61], [55, 59, 62]
CANON = [D, A, Bm, Fm, G, D, G, A]                    # festive baroque progression (D major)
TENSE = [[62, 65, 69], [58, 62, 65], [55, 58, 62], [57, 61, 64]]   # Dm Bb Gm A
LESSON = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]  # D Bm G A

def festive(seg, dur, bpm=100, start=0.0):
    beat = 60 / bpm; t = 0; bar = 0
    while t < dur:
        ch = CANON[bar % 8]
        add(seg, bass(ch[0] - 24, beat * 2), t, .9); add(seg, bass(ch[0] - 24, beat * 2), t + beat * 2, .7)
        arp = [ch[0], ch[1], ch[2], ch[1] + 12 - 12, ch[0] + 12, ch[2], ch[1], ch[2] + 12 - 12]
        for k in range(8): add(seg, harpsichord(arp[k] + (12 if k in (4,) else 0), .9, .8 if k % 2 == 0 else .6), t + k * beat / 2)
        # melody on top (simple stepwise line)
        mel = [ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12]
        for k in range(4): add(seg, harpsichord(mel[k], 1.0, .55), t + k * beat)
        t += beat * 4; bar += 1
def tension(seg, dur):
    t = 0; k = 0
    while t < dur:
        ch = TENSE[k % 4]; add(seg, pad([c - 12 for c in ch], 4.4, .9, 900), t); add(seg, bass(ch[0] - 24, 4), t, .6)
        t += 4; k += 1
    for b in np.arange(0, dur, 1.0): add(seg, timpani(.6, 55, .25), b)   # slow pulse
def mystery(seg, dur):
    t = 0; k = 0
    while t < dur:
        ch = TENSE[k % 4]; add(seg, pad([c - 12 for c in ch], 4.4, .7, 1200), t)
        for j, m in enumerate([ch[0], ch[2], ch[1] + 12, ch[2]]): add(seg, harpsichord(m, 1.4, .45), t + j * 1.0)
        t += 4; k += 1
def lesson(seg, dur):
    t = 0; k = 0; beat = 60 / 84
    while t < dur:
        ch = LESSON[k % 4]; add(seg, pad(ch, 4 * beat * 2 + .4, .7, 2000), t)
        for j in range(8): add(seg, harpsichord([ch[0], ch[1], ch[2], ch[1] + 12][j % 4] + 12 * (j >= 4), 1.0, .5), t + j * beat)
        add(seg, bass(ch[0] - 24, beat * 8), t, .5)
        t += beat * 8; k += 1
def finale(seg, dur):
    t = 0; k = 0
    for k, ch in enumerate([D, G, A, D]):
        add(seg, pad(ch, 2.4, .8, 2400), k * 1.8)
        for j in range(4): add(seg, harpsichord(ch[j % 3] + 12, 1.2, .55), k * 1.8 + j * .45)
    add(seg, bell(74, 3, .8), 0); add(seg, bell(78, 3, .6), 1.8 * 3)

section(0, ls(14) - .1, festive)
section(ls(14), le(20) + .4, tension)
section(ls(21), le(26) + .3, mystery)
section(ls(27), le(36) + .3, lesson)
section(ls(37), DUR, finale)
add(music, timpani(2.2, 50, 1.2), ls(14))                  # the king is not smiling: hit
add(music, timpani(2.0, 45, 1.3), ls(18))                  # arrest hit
add(music, timpani(1.8, 60, .8), ls(2) + .9)               # hook: jail

# ================= SFX =================
sfx = np.zeros(N)
def noise(d): return rng.standard_normal(int(d * SR))
def whoosh(d=.55, up=True):
    x = noise(d); t = np.arange(len(x)) / SR; e = np.sin(np.pi * t / d) ** 2
    lo = np.linspace(300 if up else 2500, 2500 if up else 300, len(x))
    y = bp(x, 400, 3000) * e
    return y * .25
def pop():
    n = int(.09 * SR); t = np.arange(n) / SR; f = 520 + 900 * t / .09
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40) * .35
def click():
    n = int(.03 * SR); return hpf(noise(.03), 2000) * np.exp(-np.arange(n) / SR * 200) * .4
def firework():
    whistle_d = .55; n = int(whistle_d * SR); t = np.arange(n) / SR
    w = np.sin(2 * np.pi * np.cumsum(900 + 1800 * t / whistle_d) / SR) * (t / whistle_d) * .06
    bn = int(1.6 * SR); tb = np.arange(bn) / SR
    boom = lpf(noise(1.6), 500) * np.exp(-tb * 4) * .9 + np.sin(2 * np.pi * 55 * tb) * np.exp(-tb * 6) * .5
    cr = np.zeros(bn)
    for _ in range(90):
        i = int(rng.uniform(.15, 1.4) * SR); k = int(.004 * SR); cr[i:i + k] += rng.standard_normal(k) * rng.uniform(.2, .6)
    cr = hpf(cr, 2500) * .5
    out = np.zeros(n + bn); out[:n] += w; out[n:] += boom * .55 + cr
    return out
def applause(d=3.0, g=1.0):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(d * 260)):
        i = rng.integers(0, n - 600); k = rng.integers(150, 500); x[i:i + k] += rng.standard_normal(k) * np.exp(-np.arange(k) / 80)
    t = np.arange(n) / SR; e = np.minimum(1, t / .4) * np.minimum(1, (d - t) / 1.0)
    return bp(x, 700, 6000) * e * .12 * g
def murmur(d=3.0, g=1.0):
    n = int(d * SR); x = bp(noise(d), 200, 900) * (0.6 + .4 * np.sin(2 * np.pi * 3.1 * np.arange(n) / SR + rng.random()))
    t = np.arange(n) / SR; e = np.minimum(1, t / .6) * np.minimum(1, (d - t) / .6)
    return x * e * .12 * g
def clink():
    n = int(.9 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2650 * t) + .6 * np.sin(2 * np.pi * 3900 * t) + .3 * np.sin(2 * np.pi * 5300 * t)) * np.exp(-t * 7) * .12
def water(d=2.0):
    n = int(d * SR); t = np.arange(n) / SR; e = np.minimum(1, t / .4) * np.minimum(1, (d - t) / .4)
    return hpf(noise(d), 1800) * (0.7 + .3 * rng.random(n)) * e * .05
def clang():
    n = int(2.2 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f, a, dk in ((196, 1, 2.0), (467, .7, 3), (781, .5, 4), (1243, .35, 5), (1870, .2, 7)): x += a * np.sin(2 * np.pi * f * t) * np.exp(-t * dk)
    x += lpf(noise(2.2), 400) * np.exp(-t * 18) * 1.2
    return x * .35
def thud(g=1.0):
    n = int(.5 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 70 * t * (1 + np.exp(-t * 30))) * np.exp(-t * 12) + lpf(noise(.5), 250) * np.exp(-t * 25)) * .5 * g
def tick():
    n = int(.04 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 150)) * .25
def paper(d=.6):
    n = int(d * SR); t = np.arange(n) / SR; e = np.sin(np.pi * t / d)
    return bp(noise(d), 1500, 7000) * e * (0.5 + .5 * (rng.random(n) > .6)) * .12
def scratch(d=1.2):
    n = int(d * SR); x = bp(noise(d), 2500, 6000); m = (np.sin(2 * np.pi * 7 * np.arange(n) / SR) > 0).astype(float)
    return x * m * .06
def whisper(d=2.0):
    n = int(d * SR); t = np.arange(n) / SR; x = bp(noise(d), 1800, 5000) * (0.5 + .5 * np.sin(2 * np.pi * 4.5 * t) ** 2)
    return x * np.minimum(1, t / .3) * np.minimum(1, (d - t) / .3) * .07
def fire(d=2.2):
    n = int(d * SR); t = np.arange(n) / SR; x = lpf(noise(d), 900) * .25
    for _ in range(int(d * 40)):
        i = rng.integers(0, n - 300); k = rng.integers(40, 200); x[i:i + k] += rng.standard_normal(k) * rng.uniform(.3, 1)
    return x * np.minimum(1, t / .5) * np.minimum(1, (d - t) / .5) * .14
def riser(d=1.4):
    n = int(d * SR); t = np.arange(n) / SR
    return (bp(noise(d), 500, 4000) * (t / d) ** 2 * .2 + np.sin(2 * np.pi * np.cumsum(200 + 600 * t / d) / SR) * (t / d) * .06)
def shimmer():
    out = np.zeros(int(1.6 * SR))
    for k, m in enumerate([86, 90, 93, 98]): add(out, bell(m, 1.2, .6), k * .07)
    return out
def coins():
    out = np.zeros(int(1.4 * SR))
    for k in range(9): add(out, clink() * .6, k * .09 + rng.uniform(0, .04))
    return out
def boots():
    out = np.zeros(int(1.6 * SR))
    for k in range(3): add(out, thud(.6), k * .45)
    return out
def heartbeat(d):
    out = np.zeros(int(d * SR))
    for b in np.arange(0, d - .4, .9): add(out, thud(.5), b); add(out, thud(.35), b + .22)
    return out

def S(fn, t, g=1.0): add(sfx, fn() if callable(fn) else fn, t, g)
# --- hook ---
for k, tt in enumerate([.3, .95, 1.6, 2.4]): S(firework, tt - .55, .9)
S(murmur(4.2), .1)
S(whoosh, ls(2) - .3); S(clang, ls(2) - .08 + 1.05); S(pop, ls(2) + .05)
# --- setup ---
S(whoosh, ls(3) - .3); S(paper(1.0), ls(3) + .05)
S(pop, ls(4) + .15); S(coins, ls(4) + .3, .5)
for f in (0, .3, .6): S(pop, lp(5, f))
S(whoosh, ls(6) - .3); S(pop, ls(6) + .2); S(pop, lp(6, .55))
S(whoosh, ls(7) - .3); S(shimmer, ls(7) + .3, .8)
S(paper(.8), ls(8)); S(thud(.5), ls(8) + .6)
# --- party ---
S(firework, ls(9) - .4, .8); S(firework, ls(9) + .3, .7); S(murmur(2.5), ls(9))
S(water(lp(10, .62) - ls(10)), ls(10)); S(pop, lp(10, .02)); S(pop, lp(10, .32)); S(clink, lp(10, .62) + .1); S(pop, lp(10, .62) + .05)
S(whoosh, ls(11)); S(applause(1.4, .7), ls(11) + .2)
for k in range(4): S(firework, lp(11, .45) - .5 + k * .32, .8)
S(applause(2.6, 1.2), ls(12) - .1); S(murmur(2.5, 1.2), ls(12))
for k in range(7): S(pop, ls(13) + .1 + k * .14, .8)
S(murmur(2.2, .8), ls(13))
# --- turn ---
S(whoosh(.8, False), ls(14) - .4)
S(whoosh, ls(15) - .3); S(shimmer, lp(15, .5), .7)
S(whoosh, ls(16) - .3); S(riser(1.2), ls(16) + .2, .6)
S(applause(2.5, .6), ls(17)); [S(pop, lp(17, .4) + k * .15, .6) for k in range(4)]
# --- fall ---
S(boots, ls(18) + .1); S(paper(.8), ls(18) + .25)
S(coins, ls(19) + .1, .6)
S(clang, ls(20) - .05, .8)
for k in range(int((le(20) - ls(20) - .3) / .25)): S(tick, ls(20) + .3 + k * .25)
S(paper(.6), ls(21)); S(scratch(1.6), ls(21) + .3)
S(whisper(2.4), ls(22) + .1)
S(thud(.7), ls(23) + .1)
S(fire(2.6), ls(24) + .1); S(whoosh, ls(24) + .1)
S(shimmer, lp(25, .35), .6)
S(riser(1.6), ls(26) + .2, .7)
# --- lesson ---
S(whoosh, ls(27) - .3); S(thud(.5), ls(27) + .3); S(pop, ls(28) + .2)
S(thud(.8), ls(29) + .05); S(shimmer, ls(29) + .5, .7)
S(pop, ls(30) + .1); S(pop, lp(30, .45))
S(heartbeat(le(31) - ls(31)), ls(31), .9)
S(riser(1.2), ls(32)); S(thud(.9), ls(33) + .05)
S(whoosh, ls(34) - .3); S(pop, lp(34, .45))
S(whoosh(.7), ls(35) + .3, .6); S(pop, lp(35, .65))
S(pop, ls(36) + .05)
S(whoosh, ls(37) - .3); S(pop, ls(38) - .1); S(click, ls(38) + .65)
S(pop, ls(39) + .05); S(pop, ls(39) + .7); S(click, ls(39) + 1.55); S(shimmer, ls(39) + 1.6, .6)

# ================= MIX =================
def readwav(p):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(r, np.int16).astype(np.float64) / 32768
vo = readwav('audio/voiceover.mp3'); vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
# ducking envelope from voice
k = int(.05 * SR); v = np.sqrt(np.convolve(vo ** 2, np.ones(k) / k, 'same'))
duck = 1 - .55 * np.clip(v / (np.percentile(v, 90) + 1e-9), 0, 1)
duck = np.convolve(duck, np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
def norm(x, peak): m = np.max(np.abs(x)) + 1e-9; return x / m * peak
music = norm(music, .9); sfx = norm(sfx, .9)
mix = vo * 1.0 + music * .16 * duck + sfx * .33
mix = mix / max(1.0, np.max(np.abs(mix)) / .97)
def write(p, x):
    st = np.stack([x, x], 1); a = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(p, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())
write('audio/music.wav', music * .5); write('audio/sfx.wav', sfx * .5); write('audio/mix_raw.wav', mix)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', 'audio/mix.wav'], check=True)
print('ok', round(DUR, 2))
