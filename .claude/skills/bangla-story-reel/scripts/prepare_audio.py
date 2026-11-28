#!/usr/bin/env python3
"""Voiceover + SRT  ->  data/lines.json (per-line timing aligned to the real audio) + data/env.json (per-frame amplitude for lip-sync).

usage: python3 -I prepare_audio.py voiceover.mp3 script.srt OUT_DATA_DIR [fps=30]

Why: Whisper can't transcribe Bangla reliably (it returns garbage), so the
SRT times are fitted to the real pauses (silences) in the voice. Each line's
expected duration is proportional to its character count; a DP picks the
best pause for each line boundary.
"""
import sys, os, re, json, subprocess
import numpy as np

vo, srt_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
FPS = int(sys.argv[4]) if len(sys.argv) > 4 else 30
os.makedirs(out, exist_ok=True)
SR = 16000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vo, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768

# ---- parse SRT ----
blocks = open(srt_path, encoding='utf8').read().replace('\r', '').strip().split('\n\n')
L = []
for b in blocks:
    ls = b.strip().split('\n')
    if len(ls) >= 3 and '-->' in ls[1]:
        L.append('\n'.join(ls[2:]))

# ---- silence runs (10 ms hop) ----
n = len(x) // 160
db = 20 * np.log10(np.sqrt((x[:n * 160].reshape(n, 160) ** 2).mean(1) + 1e-12))
sil = db < -38
runs, i = [], 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        if j - i >= 7: runs.append((i / 100, j / 100))
        i = j
    else:
        i += 1
sp = np.where(~sil)[0]; st, en = sp[0] / 100, sp[-1] / 100
runs = [r for r in runs if r[0] > st and r[1] < en]

# ---- DP: assign line boundaries to pauses ----
ch = [len(re.sub(r'[\s\.,।"“”?!:\-…]', '', t)) for t in L]
M, K = len(runs), len(L)
pos = [st] + [(a + b) / 2 for a, b in runs] + [en]
wid = [0] + [b - a for a, b in runs] + [0]
speech = en - st - sum(b - a for a, b in runs) * 0.6
r = speech / sum(ch)
INF = 1e18
dp = np.full((K + 1, M + 2), INF); dp[0, 0] = 0; bk = np.zeros((K + 1, M + 2), int)
for k in range(1, K + 1):
    for m in range(1, M + 2):
        if (k == K) != (m == M + 1): continue
        best, bi = INF, 0
        for p in range(max(0, m - 25), m):
            if dp[k - 1, p] >= INF: continue
            d = pos[m] - pos[p]; exp = r * ch[k - 1] + 0.35
            c = dp[k - 1, p] + ((d - exp) / max(exp, 0.6)) ** 2 * 4 - (min(wid[m], .5) * 3 if m <= M else 0)
            if c < best: best, bi = c, p
        dp[k, m] = best; bk[k, m] = bi
m, bd = M + 1, []
for k in range(K, 0, -1):
    bd.append(m); m = bk[k, m]
bd = bd[::-1]
lines, prev = [], 0
for k in range(K):
    s = st if prev == 0 else runs[prev - 1][1]
    e = en if bd[k] == M + 1 else runs[bd[k] - 1][0]
    lines.append(dict(s=round(s, 2), e=round(e, 2), text=L[k])); prev = bd[k]
json.dump(lines, open(f'{out}/lines.json', 'w'), ensure_ascii=False, indent=1)

# ---- per-frame envelope for lip-sync ----
f = int(len(x) / SR * FPS) + 1
env = np.array([np.sqrt((x[int(i / FPS * SR):int((i + 1) / FPS * SR)] ** 2).mean()) if int(i / FPS * SR) < len(x) else 0 for i in range(f)])
env = np.clip(env / np.percentile(env, 95), 0, 1)
json.dump([round(float(v), 3) for v in env], open(f'{out}/env.json', 'w'))

for k, l in enumerate(lines):
    print(f"{k+1:>2} {l['s']:7.2f} {l['e']:7.2f} {l['e']-l['s']:5.2f}s  {l['text'][:40].replace(chr(10),' / ')}")
print(f'audio {len(x)/SR:.2f}s  lines {K}  frames {f}')
