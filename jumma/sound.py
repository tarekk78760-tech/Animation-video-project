#!/usr/bin/env python3
"""Jumma sound design: instrument-free vocal (nasheed-style) score + soft SFX, mixed under the voiceover.
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

# ================= VOCAL (instrument-free, nasheed-style) =================
VOW = {'aa': [(730, 1.0, 90), (1090, .55, 110), (2440, .25, 160)], 'oo': [(300, 1.0, 70), (870, .45, 100), (2240, .15, 150)], 'mm': [(250, 1.0, 60), (1000, .12, 100), (2500, .05, 150)]}
def voice(m, dur, vowel='aa', vel=1.0, vib=.012):
    n = int(dur * SR); t = np.arange(n) / SR; f0 = note_hz(m)
    ph = 2 * np.pi * np.cumsum(f0 * (1 + vib * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / .6))) / SR
    x = np.zeros(n)
    for h in range(1, 30):
        fh = f0 * h
        if fh > 5000: break
        amp = sum(a * np.exp(-((fh - F) / bw) ** 2 / 2) for F, a, bw in VOW[vowel]) + .02
        x += amp * np.sin(h * ph) / h ** .3
    breath = bp(rng.standard_normal(n), 1500, 5000) * .01
    e = np.minimum(1, t / .5) * np.minimum(1, (dur - t) / .7)
    return (x / 6 + breath) * e * vel
def choir(ms, dur, vowel='aa', vel=1.0):
    out = np.zeros(int(dur * SR))
    for m in ms:
        for d in (-.07, .06):
            v = voice(m + d, dur, vowel, vel / len(ms), .010 + rng.random() * .006); out[:len(v)] += v
    return lpf(out, 3500)
def drone(m, dur, vel=1.0):
    return choir([m - 12, m - 5], dur, 'mm', vel * 1.2)

music = np.zeros(N)
def section(t0, t1, fn):
    seg = np.zeros(int((t1 - t0 + 3) * SR)); fn(seg, t1 - t0)
    fade = np.ones(len(seg)); k = int(1.2 * SR)
    fade[:k] = np.linspace(0, 1, k); e = int((t1 - t0) * SR); fade[e:e + k] = np.linspace(1, 0, k); fade[e + k:] = 0
    add(music, seg * fade, t0)
# D minor / Bayati-flavoured, slow and soft
CH_SAD = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]]      # Dm Bb Gm A
CH_HOPE = [[50, 54, 57], [47, 50, 54], [43, 47, 50], [45, 49, 52]]     # D Bm G A
MEL = [62, 63, 65, 63, 62, 60, 62, 58, 57, 58, 60, 62]               # D Eb F Eb D C D Bb A Bb C D
def hum_melody(seg, t0, dur, base=0, vowel='oo', vel=.55):
    t = t0; i = 0
    while t < dur - 1.5:
        d = 1.6 if i % 4 != 3 else 2.4
        v = voice(MEL[i % len(MEL)] + base, d + .4, vowel, vel); add(seg, v, t); t += d; i += 1
def sec_intro(seg, dur):
    add(seg, drone(50, dur + 1, .9), 0)
def sec_emotion(seg, dur):
    t = 0; k = 0
    while t < dur: add(seg, choir(CH_SAD[k % 4], 6.4, 'aa', .9), t); t += 6; k += 1
    add(seg, drone(50, dur + 1, .6), 0); hum_melody(seg, 2.0, dur)
def sec_reminder(seg, dur):
    t = 0; k = 0
    while t < dur: add(seg, choir(CH_HOPE[k % 4], 6.4, 'oo', .8), t); t += 6; k += 1
    add(seg, drone(50, dur + 1, .5), 0); hum_melody(seg, 1.0, dur, 0, 'aa', .45)
def sec_question(seg, dur):
    add(seg, drone(50, dur + 1, .8), 0)
    t = 0; k = 0
    while t < dur: add(seg, choir(CH_SAD[(k * 2) % 4], 6.4, 'mm', .6), t); t += 6; k += 1
def sec_ending(seg, dur):
    t = 0; k = 0
    while t < dur: add(seg, choir(CH_HOPE[k % 4], 6.4, 'aa', 1.0), t); t += 6; k += 1
    add(seg, drone(50, dur + 1, .6), 0); hum_melody(seg, 1.5, dur, 0, 'oo', .5)
section(0, ls(4) - .2, sec_intro)
section(ls(4) - .4, le(9) + .3, sec_emotion)
section(ls(10) - .3, le(13) + .3, sec_reminder)
section(ls(14) - .3, le(18) + .3, sec_question)
section(ls(19) - .3, DUR, sec_ending)

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
def shimmer(): return softchime()
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

def wind(d=3.0, g=1.0):
    n = int(d * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 200, 1200) * (0.6 + .4 * np.sin(2 * np.pi * .35 * t + 1))
    return x * np.minimum(1, t / 1) * np.minimum(1, (d - t) / 1) * .08 * g
def birds(d=3.0):
    out = np.zeros(int(d * SR))
    for _ in range(int(d * 2.2)):
        st = rng.uniform(0, d - .5); nn = int(rng.uniform(.06, .14) * SR); tt = np.arange(nn) / SR
        f = rng.uniform(2800, 4200) + 900 * np.sin(2 * np.pi * rng.uniform(15, 30) * tt)
        add(out, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / tt[-1]) * .05, st)
    return out
def steps(d=3.0, rate=.45):
    out = np.zeros(int(d * SR))
    for k in np.arange(0, d - .2, rate): add(out, lpf(rng.standard_normal(int(.08 * SR)), 900) * np.exp(-np.arange(int(.08 * SR)) / SR * 40) * .25, k)
    return out
def rain(d=3.0):
    n = int(d * SR); t = np.arange(n) / SR; x = hpf(rng.standard_normal(n), 1500) * .04
    for _ in range(int(d * 120)):
        i = rng.integers(0, n - 200); x[i:i + 60] += rng.standard_normal(60) * .08
    return x * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8)
def beads(n=6):
    out = np.zeros(int((n * .35 + .5) * SR))
    for k in range(n): add(out, bp(rng.standard_normal(int(.03 * SR)), 1500, 4000) * np.exp(-np.arange(int(.03 * SR)) / SR * 150) * .3, k * .35)
    return out
def softchime():
    out = np.zeros(int(2.2 * SR))
    for k, m in enumerate([74, 77, 81]):
        n = int(2.0 * SR); t = np.arange(n) / SR; add(out, np.sin(2 * np.pi * note_hz(m) * t) * np.exp(-t * 2.2) * .08, k * .12)
    return out

def S(fn, t, g=1.0): add(sfx, fn() if callable(fn) else fn, t, g)
S(wind(4.5), 0); S(steps(1.2, .4), .1, .8); S(thud(.7), lp(1, .45))
S(heartbeat(le(2) - ls(2) + .3), ls(2), .9); [S(tick, ls(2) + k * .5, .7) for k in range(int((le(2) - ls(2)) / .5))]
S(birds(6), ls(3)); S(wind(5, .6), ls(3)); S(softchime, ls(4) + .1, .8); S(birds(5), ls(4) + .5)
S(steps(le(5) - ls(5), .5), ls(5), .9); S(birds(4), ls(5))
for f in (0, .33, .62): S(whoosh(.6), lp(6, f) - .1, .35)
S(wind(5, .5), ls(7)); S(softchime, ls(7) + .2, .6)
S(wind(6, .6), ls(8)); S(softchime, lp(8, .5), .7)
S(beads(10), ls(9) + .5, .6)
[S(tick, ls(10) + k * .3, .7) for k in range(int((le(10) - ls(10)) / .3))]; S(paper(.6), ls(10) + .4)
S(softchime, lp(11, 0), .5); S(beads(5), lp(11, .42), .8); S(paper(.9), lp(11, .76), .9)
S(wind(3, .5), ls(12))
S(rain(le(13) - ls(13) + 1), ls(13), 1.0); S(softchime, lp(13, .25), .7)
S(whoosh(.7), ls(14)); for_doors = [S(thud(1.0), lp(15, f) + .45) for f in (.05, .25, .45)]
S(wind(4, .7), ls(15))
S(softchime, lp(16, .38), .6)
S(pop, ls(18), .6); S(pop, lp(18, .4), .6); S(click, le(18) - .3)
S(heartbeat(le(19) - ls(19)), ls(19), .7); S(wind(5, .6), ls(19))
S(birds(6), ls(20)); S(steps(le(20) - ls(20), .55), ls(20), .7)
S(beads(10), ls(21) + .4, .5)
S(softchime, ls(22), .9); S(softchime, ls(23) + .1, .8); S(click, ls(23) + 1.5)

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
mix = vo * 1.0 + music * .11 * duck + sfx * .24
mix = mix / max(1.0, np.max(np.abs(mix)) / .97)
def write(p, x):
    st = np.stack([x, x], 1); a = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(p, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())
write('audio/music.wav', music * .5); write('audio/sfx.wav', sfx * .5); write('audio/mix_raw.wav', mix)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', 'audio/mix.wav'], check=True)
print('ok', round(DUR, 2))
