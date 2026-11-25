"""Generates a soft, sombre ambient pad (no samples, pure synthesis) as WAV.
usage: python3 src/make_music.py out.wav [duration_seconds]"""
import sys
import wave

import numpy as np

sys.path.insert(0, __import__("os").path.dirname(__file__))
from timeline import DURATION  # noqa: E402

if len(sys.argv) > 2:
    DURATION = float(sys.argv[2])

SR = 48000
n = int(DURATION * SR)
t = np.arange(n) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# A minor progression (Am - F - C - G), 4 s per chord; brighter voicing for the finale
PROG = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 60, 64, 67], [55, 59, 62, 67]]
BASS = [45, 41, 48, 43]
CH = 4.0
out = np.zeros(n)
rng = np.random.default_rng(7)

for k in range(int(DURATION / CH) + 1):
    t0 = k * CH
    s0 = int(max(0, (t0 - 1.5)) * SR)
    s1 = min(n, int((t0 + CH + 1.5) * SR))
    if s0 >= n:
        break
    tt = t[s0:s1]
    loc = tt - (t0 - 1.5)
    L = CH + 3.0
    env = np.clip(np.minimum(loc / 1.8, (L - loc) / 1.8), 0, 1) ** 1.5
    notes = PROG[k % 4]
    lift = 12 if t0 >= 55.5 else 0
    seg = np.zeros_like(tt)
    for m in notes:
        f = hz(m + lift)
        for det in (-0.12, 0.0, 0.11):
            ph = rng.uniform(0, 2 * np.pi)
            seg += np.sin(2 * np.pi * f * (1 + det / 100) * tt + ph) * 0.6
            seg += np.sin(2 * np.pi * 2 * f * (1 + det / 100) * tt + ph) * 0.12
    seg += np.sin(2 * np.pi * hz(BASS[k % 4]) * tt) * 1.6
    out[s0:s1] += seg * env

# slow tremolo / breath, intro and outro fades
out *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.12 * t)
out *= np.clip(t / 2.5, 0, 1) * np.clip((DURATION - t) / 3.0, 0, 1)
# swell into the closing message
out *= 1 + 0.5 * np.clip((t - 55.5) / 3, 0, 1)
# gentle low-pass (one-pole) to soften
y = np.zeros_like(out)
a = 0.08
acc = 0.0
for i in range(0, n, SR):  # vectorised per-second via lfilter-like cumulative approach
    chunk = out[i:i + SR]
    res = np.empty_like(chunk)
    for j, v in enumerate(chunk):
        acc += a * (v - acc)
        res[j] = acc
    y[i:i + SR] = res
y = y / np.max(np.abs(y)) * 0.16

pcm = (np.stack([y, y], axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("music written", sys.argv[1])
