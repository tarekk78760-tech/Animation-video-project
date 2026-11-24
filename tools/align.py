"""Align known script words to voiceover using silence gaps (no ASR model needed).
Usage: python3 align.py voice.mp3 script.txt out.json"""
import sys, re, json, math, subprocess
audio, script, out = sys.argv[1:4]
anch_file = sys.argv[4] if len(sys.argv) > 4 else None
log = subprocess.run(["ffmpeg","-v","info","-i",audio,"-af","silencedetect=noise=-33dB:d=0.08","-f","null","-"],
                     capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", log).group(3)) + 60*int(re.search(r"Duration: (\d+):(\d+)", log).group(2))
pauses = [(0.0, 0.0)] + [(s, e) for s, e in zip(st, en) if s > 0.05] 
if pauses[-1][1] < dur - 0.3: pauses.append((dur, dur))
words = open(script, encoding="utf8").read().split()
SPECIAL = {"QR": 2, "MDR": 3, "২০২৬": 5, "১": 3, "QR-এর": 3}
def L(w):
    w = re.sub(r"[,!?।\.]", "", w)
    if w in SPECIAL: return SPECIAL[w] + 0.3
    n = 0
    for k, ch in enumerate(w):
        o = ord(ch); nxt = ord(w[k+1]) if k+1 < len(w) else 0
        if 0x0985 <= o <= 0x0994: n += 1
        elif 0x09BE <= o <= 0x09CC: n += 1
        elif (0x0995 <= o <= 0x09B9 or 0x09DC <= o <= 0x09DF):
            if not (0x09BE <= nxt <= 0x09CD) and k+1 < len(w): n += 1
    return max(n, 1) + 0.3
def punct(w): return 3 if re.search(r"[।!?]$", w) else (2 if w.endswith(",") else 0)
anch = {}
if anch_file:
    for w, occ, t in json.load(open(anch_file, encoding="utf8")):
        idx = [k for k, x in enumerate(words) if x == w][occ-1]; anch[idx] = t
anch_times = set(anch.values())
def ok(i2, j2):
    e = pauses[j2][1]
    if i2 in anch: return abs(e - anch[i2]) < 0.06
    return not any(abs(e - t) < 0.06 for t in anch_times)
speech = sum(pauses[k+1][0]-pauses[k][1] for k in range(len(pauses)-1))
rate = speech / sum(L(w) for w in words)
N, P = len(words), len(pauses)
INF = 1e18
cost = [[INF]*P for _ in range(N+1)]; back = {}
cost[0][0] = 0
pre = [0]
for w in words: pre.append(pre[-1]+L(w))
for i in range(N):
    for j in range(P):
        c0 = cost[i][j]
        if c0 >= INF: continue
        for i2 in range(i+1, min(N, i+40)+1):
            exp = (pre[i2]-pre[i]) * rate
            skipped = 0.0
            for j2 in range(j+1, P):
                a, b = pauses[j][1], pauses[j2][0]
                if b - a > exp*3 + 3: break
                act = max(b - a - skipped, 0.05)
                c = c0 + 4*math.log(act/exp)**2
                c += 6*skipped  # unused long pauses are unlikely
                if i2 < N: c += 0.4 if punct(words[i2-1]) == 0 else -0.3*punct(words[i2-1])
                if i2 == N and j2 != P-1: c += 50
                if i2 < N and not ok(i2, j2): c += 1000
                if c < cost[i2][j2]:
                    cost[i2][j2] = c; back[(i2, j2)] = (i, j)
                skipped += pauses[j2][1]-pauses[j2][0]
i, j = N, P-1; groups = []
while (i, j) != (0, 0):
    pi, pj = back[(i, j)]; groups.append((pi, i, pauses[pj][1], pauses[j][0], pj, j)); i, j = pi, pj
groups.reverse(); res = []
for a, b, t0, t1, pj, j2 in groups:
    inner = [p for p in pauses[pj+1:j2]]
    # map cumulative char position to time, skipping interior pauses
    segs = []; cur = t0
    for s, e in inner: segs.append((cur, s)); cur = e
    segs.append((cur, t1)); tot = sum(y-x for x, y in segs)
    def at(f):
        r = f*tot
        for x, y in segs:
            if r <= y-x: return x+r
            r -= y-x
        return t1
    tl = pre[b]-pre[a]
    for k in range(a, b):
        res.append({"w": words[k], "s": round(at((pre[k]-pre[a])/tl),3), "e": round(at((pre[k+1]-pre[a])/tl),3)})
json.dump({"duration": dur, "words": res}, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=0)
for g in groups: print(f"{g[2]:6.2f}-{g[3]:6.2f} ", " ".join(words[g[0]:g[1]]))
