"""Soft, uplifting ambient bed (original, generated). Usage: python3 music.py out.wav seconds"""
import sys, wave
import numpy as np

SR = 44100
out, dur = sys.argv[1], float(sys.argv[2])
n = int(SR * dur)
t = np.arange(n) / SR
mix = np.zeros(n)

def hz(m): return 440 * 2 ** ((m - 69) / 12)
# I - vi - IV - V in C, 4 s per chord (60 bpm, 4 beats)
chords = [[48, 55, 60, 64, 67], [45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62]]
bar = 4.0

def env(length, a, r):
    e = np.ones(length); ai = int(a * SR); ri = int(r * SR)
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] *= np.linspace(1, 0, ri); return e

i = 0; start = 0.0
while start < dur:
    ch = chords[i % 4]
    s0 = int(start * SR); L = min(int((bar + 1.5) * SR), n - s0)
    tt = np.arange(L) / SR
    e = env(L, 1.2, 1.6)
    for m in ch:  # warm pad: detuned sines
        f = hz(m)
        mix[s0:s0 + L] += 0.05 * e * (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.003 * tt) + 0.2 * np.sin(2 * np.pi * 2 * f * tt))
    # soft plucked arpeggio, 8th notes
    arp = [ch[2], ch[3], ch[4], ch[3] + 12 if ch[3] + 12 < 80 else ch[3], ch[4], ch[3], ch[2], ch[3]]
    for k, m in enumerate(arp):
        ps = start + k * 0.5
        if ps >= dur: break
        p0 = int(ps * SR); pl = min(int(1.4 * SR), n - p0); pt = np.arange(pl) / SR; f = hz(m + 12)
        pe = np.exp(-pt * 3.2) * np.minimum(1, pt * 200)
        mix[p0:p0 + pl] += 0.07 * pe * (np.sin(2 * np.pi * f * pt) + 0.3 * np.sin(2 * np.pi * 2 * f * pt) + 0.1 * np.sin(2 * np.pi * 3 * f * pt))
    # sub bass
    f = hz(ch[0] - 12); L2 = min(int(bar * SR), n - s0); tb = np.arange(L2) / SR
    mix[s0:s0 + L2] += 0.06 * env(L2, 0.3, 0.8) * np.sin(2 * np.pi * f * tb)
    start += bar; i += 1

# simple lowpass smoothing + fades
k = np.ones(6) / 6; mix = np.convolve(mix, k, mode='same')
fade = np.ones(n); fi = int(1.5 * SR); fo = int(2.5 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.8
# stereo: slight delay on right for width
d = int(0.012 * SR); right = np.concatenate([np.zeros(d), mix[:-d]])
st = (np.stack([mix, right], 1) * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
