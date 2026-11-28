#!/usr/bin/env python3
"""Arif sound design: playful pluck score turning gloomy, + comic/story SFX, mixed under the voiceover.
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
def pluck(m, dur=.8, vel=1.0, bright=.5):  # Karplus-Strong (ukulele / pizzicato feel)
    f = note_hz(m); n = int(dur * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p) * vel; out = np.zeros(n); k = 0
    for i in range(n):
        out[i] = buf[k]; nk = (k + 1) % p; buf[k] = (buf[k] + buf[nk]) * (.498 + bright * .0015); k = nk
    return lpf(out, 5000) * env_ad(n, .002, dur) * .5
music = np.zeros(N)
def section(t0, t1, fn):
    seg = np.zeros(int((t1 - t0 + 2) * SR)); fn(seg, t1 - t0)
    fade = np.ones(len(seg)); k = int(.6 * SR)
    fade[:k] = np.linspace(0, 1, k); e = int((t1 - t0) * SR); fade[e:e + k] = np.linspace(1, 0, k); fade[e + k:] = 0
    add(music, seg * fade, t0)
PLAY = [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]]       # C Am F G
GLOOM = [[57, 60, 64], [53, 57, 60], [55, 58, 62], [52, 56, 59]]      # Am F Gm E
HOPE = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]       # D Bm G A
def playful(seg, dur, bpm=112):
    beat = 60 / bpm; t = 0; bar = 0
    while t < dur:
        ch = PLAY[bar % 4]
        for k, m in enumerate([ch[0], ch[2], ch[1], ch[2], ch[0] + 12, ch[2], ch[1], ch[2]]): add(seg, pluck(m, .7, .8 if k % 2 == 0 else .55), t + k * beat / 2)
        add(seg, bass(ch[0] - 24, beat * 1.6), t, .7); add(seg, bass(ch[0] - 17, beat * 1.6), t + beat * 2, .5)
        mel = [ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 12 + 2]
        for k in range(4): add(seg, pluck(mel[k], 1.0, .45), t + k * beat + beat * .5)
        t += beat * 4; bar += 1
def gloomy(seg, dur):
    t = 0; k = 0
    while t < dur:
        ch = GLOOM[k % 4]; add(seg, pad([c - 12 for c in ch], 3.4, .8, 900), t)
        for j, m in enumerate([ch[0], ch[2], ch[1]]): add(seg, pluck(m, 1.6, .5), t + j * 1.0)
        t += 3; k += 1
def lesson(seg, dur):
    t = 0; k = 0
    while t < dur:
        ch = (GLOOM if t < dur * .45 else HOPE)[k % 4]; add(seg, pad(ch, 3.4, .7, 1600), t)
        for j in range(6): add(seg, pluck(ch[j % 3] + 12, .9, .45), t + j * .5)
        add(seg, bass(ch[0] - 24, 3), t, .5); t += 3; k += 1
def bright(seg, dur):
    for k, ch in enumerate([HOPE[0], HOPE[2], HOPE[3], HOPE[0]]):
        add(seg, pad(ch, 2.2, .8, 2400), k * 1.4)
        for j in range(4): add(seg, pluck(ch[j % 3] + 12, .9, .6), k * 1.4 + j * .35)

TENDER = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [52, 55, 59]]     # Am F C Em
def tender(seg, dur):
    t = 0; k = 0
    while t < dur:
        ch = TENDER[k % 4]; add(seg, pad(ch, 4.4, .7, 1400), t)
        for j, m in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[2] + 12]): add(seg, pluck(m, 1.8, .45, .2), t + j * 1.0)
        t += 4; k += 1
def rising(seg, dur, bpm=96):
    beat = 60 / bpm; t = 0; bar = 0
    while t < dur:
        ch = HOPE[bar % 4]; add(seg, pad(ch, beat * 4 + .3, .6, 2000), t)
        for k in range(8): add(seg, pluck(ch[k % 3] + 12 * (k >= 4), .6, .55 if k % 2 == 0 else .4), t + k * beat / 2)
        for k in range(4): add(seg, timpani(.3, 70, .18), t + k * beat)
        add(seg, bass(ch[0] - 24, beat * 3.5), t, .6); t += beat * 4; bar += 1
section(0, ls(11) - .1, playful)
section(ls(11), le(16) + .4, tender)
section(ls(17) - .2, le(26) + .3, rising)
section(ls(27) - .2, le(39) + .3, lesson)
section(ls(40) - .2, DUR, bright)

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

def shatter():
    n = int(1.2 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for _ in range(60):
        i = int(rng.uniform(0, .5) * SR); f = rng.uniform(2500, 7000); k = int(.25 * SR)
        seg = np.sin(2 * np.pi * f * np.arange(k) / SR) * np.exp(-np.arange(k) / SR * 18) * rng.uniform(.05, .2); j = min(n, i + k); x[i:j] += seg[:j - i]
    x += hpf(rng.standard_normal(n), 3000) * np.exp(-t * 6) * .25
    return x * .7
def horns(d=3.0):
    out = np.zeros(int(d * SR))
    for st, f in ((.3, 420), (1.4, 520), (2.2, 380)):
        nn = int(.35 * SR); tt = np.arange(nn) / SR; add(out, (np.sign(np.sin(2 * np.pi * f * tt)) * .5 + np.sin(4 * np.pi * f * tt) * .3) * np.minimum(1, tt / .02) * np.minimum(1, (tt[-1] - tt) / .05) * .05, st)
    return lpf(out + bp(rng.standard_normal(len(out)), 150, 900) * .03, 3000)
def notif():
    out = np.zeros(int(.4 * SR))
    for k, f in enumerate((1320, 1760)): nn = int(.12 * SR); tt = np.arange(nn) / SR; add(out, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 25) * .2, k * .09)
    return out
def rumble(d=1.6):
    n = int(d * SR); t = np.arange(n) / SR; return lpf(rng.standard_normal(n), 120) * np.sin(np.pi * t / d) * .9
def ding():
    nn = int(1.2 * SR); tt = np.arange(nn) / SR; return (np.sin(2 * np.pi * 1568 * tt) + .4 * np.sin(2 * np.pi * 3136 * tt)) * np.exp(-tt * 4) * .14
def slide_down(d=1.2):
    n = int(d * SR); t = np.arange(n) / SR; f = 700 * (1 - .6 * t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / .05) * np.exp(-t * 1.2) * .12
def wahwah():
    out = np.zeros(int(2.4 * SR))
    for k, m in enumerate([58, 57, 56, 55]):
        dd = .45 if k < 3 else 1.1; nn = int(dd * SR); tt = np.arange(nn) / SR; f = note_hz(m) * (1 + .03 * np.sin(2 * np.pi * 6 * tt) * (k == 3))
        x = sum(np.sin(2 * np.pi * np.cumsum(f * h) / SR) / h for h in range(1, 7)); x = lpf(x, 1100) * (0.55 + .45 * np.abs(np.sin(np.pi * tt / dd))) * np.minimum(1, tt / .03) * np.minimum(1, (dd - tt) / .08) * .1
        add(out, x, k * .45)
    return out
def scribble(d=1.5):
    n = int(d * SR); x = bp(rng.standard_normal(n), 2000, 6000); m = (np.sin(2 * np.pi * 9 * np.arange(n) / SR) > -.2).astype(float)
    return x * m * .05
def flip(): return paper(.35)

def steps(d=3.0, rate=.45):
    out = np.zeros(int(d * SR))
    for k in np.arange(0, d - .2, rate): add(out, lpf(rng.standard_normal(int(.08 * SR)), 900) * np.exp(-np.arange(int(.08 * SR)) / SR * 40) * .25, k)
    return out
def alarm_beeps(d=1.2):
    out = np.zeros(int(d * SR))
    for k in np.arange(0, d - .1, .18): nn = int(.09 * SR); tt = np.arange(nn) / SR; add(out, np.sign(np.sin(2 * np.pi * 2100 * tt)) * .05, k)
    return out
def coin():
    nn = int(.6 * SR); tt = np.arange(nn) / SR; return (np.sin(2 * np.pi * 2400 * tt) + .6 * np.sin(2 * np.pi * 3500 * tt)) * np.exp(-tt * 9) * .1
def buzzer():
    nn = int(.4 * SR); tt = np.arange(nn) / SR; return lpf(np.sign(np.sin(2 * np.pi * 140 * tt)), 1200) * np.minimum(1, (tt[-1] - tt) / .05) * .08
def kids(d=2.5): return murmur(d, 1.4) + applause(d, .6)
def creak():
    nn = int(.9 * SR); tt = np.arange(nn) / SR; f = 300 + 200 * np.sin(2 * np.pi * 1.5 * tt)
    return bp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (rng.random(nn) > .3), 400, 2500) * np.sin(np.pi * tt / tt[-1]) * .05
def sadsting():
    out = np.zeros(int(2.5 * SR))
    for k, m in enumerate([69, 65, 64]): add(out, pluck(m, 2.0, .6, .1), k * .35)
    return out
def crickets(d=4.0):
    out = np.zeros(int(d * SR))
    for k in np.arange(0, d - .2, .55):
        for j in range(3): nn = int(.03 * SR); tt = np.arange(nn) / SR; add(out, np.sin(2 * np.pi * 4300 * tt) * np.sin(np.pi * tt / tt[-1]) * .03, k + j * .05)
    return out
def ping(f=1760):
    nn = int(.5 * SR); tt = np.arange(nn) / SR; return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 8) * .08
def chink():
    nn = int(.4 * SR); tt = np.arange(nn) / SR; return (bp(rng.standard_normal(nn), 1500, 4000) * np.exp(-tt * 30) * .3 + np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 20) * .1)

def S(fn, t, g=1.0): add(sfx, fn() if callable(fn) else fn, t, g)
S(whoosh, ls(1) - .2, .5); S(pop, lp(1, .55))
S(whoosh, ls(2) - .3); S(thud(.8), lp(2, .45) + .1)
S(horns(2.5), ls(3) - .2, .6); S(steps(1.5, .45), ls(3), .7)
S(applause(1.8, .5), lp(4, .45)); S(murmur(2, 1.1), lp(4, .45)); S(steps(1.2, .25), ls(4), .6); S(pop, lp(4, .5)); S(pop, lp(4, .65))
S(murmur(1.5, .8), ls(5)); S(pop, lp(5, .5))
S(pop, ls(6) + .1)
for f in (.05, .25, .45): S(alarm_beeps(1.2), lp(7, f), .9)
[S(tick, ls(8) + k * .25, .7) for k in range(int((le(8) - ls(8)) / .25))]
for k in range(5): S(coin, ls(9) + .2 + k * .22, .8)
for k in range(3): S(buzzer, ls(10) + k * .15, .7)
S(kids(2.5), ls(11), 1.0)
S(steps(1.6, .22), ls(12), .9); S(sadsting, lp(12, .5), .7)
S(creak, ls(13) + .2, .9)
S(pop, ls(14), .4)
S(pop, ls(15) + .05, .6); S(pop, lp(15, .5), .6)
S(sadsting, lp(16, .4), .9)
S(crickets(le(19) - ls(17)), ls(17), .9)
S(scratch(1.2), ls(18) + .6, .9)
S(shimmer, lp(19, .3), .6)
S(thud(.5), ls(20) + .6); S(thud(.4), ls(20) + 1.0); S(ping(1568), ls(21) + .1)
S(creak, ls(22), .6); S(steps(1.6, .45), ls(23), .8); S(ping(1760), ls(23) + .1)
for k in range(10): S(ping(1568 if k % 4 else 880), ls(24) + k * .45, .5)
S(riser(1.6), ls(25) + .3, .5)
S(murmur(2.5, .6), ls(26)); S(pop, lp(26, .45))
S(whoosh, ls(27) - .3); S(thud(.6), ls(27) + .2); S(pop, lp(27, .6))
S(pop, ls(28) + .1); S(paper(.4), ls(29) + .2)
S(pop, lp(30, .3), .6); S(pop, lp(31, .3), .6); S(buzzer, ls(31) + .2, .4)
S(shimmer, lp(32, .4), .7)
for i in range(4): S(chink, ls(33) + .4 + i * .9 + .85, .8)
S(riser(1.4), ls(34) + .2, .5); S(pop, lp(34, .55))
S(ding, ls(35) + .3)
S(pop, lp(36, .5))
S(shimmer, lp(37, .4), .6)
S(ping(1760), ls(38) + .8)
S(shimmer, lp(39, .5), .8)
S(whoosh, ls(40) - .3); S(pop, ls(41) - .1); S(click, ls(41) + .6)
S(pop, ls(42) + .05); S(pop, ls(42) + .7); S(click, ls(42) + 1.5); S(shimmer, ls(42) + 1.6, .6)

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
mix = vo * 1.0 + music * .2 * duck + sfx * .36
mix = mix / max(1.0, np.max(np.abs(mix)) / .97)
def write(p, x):
    st = np.stack([x, x], 1); a = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(p, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())
write('audio/music.wav', music * .5); write('audio/sfx.wav', sfx * .5); write('audio/mix_raw.wav', mix)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', 'audio/mix.wav'], check=True)
print('ok', round(DUR, 2))
