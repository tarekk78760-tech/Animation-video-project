"""Synthesize sound effects (no samples needed) and mix them with the voiceover.
usage: python3 tools/sfx.py sfx.json voiceover.mp3 duration out.wav"""
import sys, json, subprocess
import numpy as np

SR = 48000
rs = np.random.default_rng(3)

def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

def noise(n): return rs.standard_normal(n)

def lp(x, k):  # simple one-pole low-pass, k in (0,1]
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += k * (v - acc); y[i] = acc
    return y

def sweep(f0, f1, dur, shape='sine'):
    n = int(SR * dur); f = np.geomspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) if shape == 'sine' else np.sign(np.sin(ph))

def tone(f, dur): return np.sin(2 * np.pi * f * np.arange(int(SR * dur)) / SR)

def bandnoise_sweep(dur, f0, f1, q=0.15):
    """noise through a moving resonant filter -> whoosh"""
    n = int(SR * dur); x = noise(n); y = np.zeros(n); low = band = 0.0
    fs = np.geomspace(f0, f1, n)
    for i in range(n):
        f = 2 * np.sin(np.pi * fs[i] / SR)
        low += f * band; high = x[i] - low - q * band; band += f * high; y[i] = band
    return y / (np.abs(y).max() + 1e-9)

def make(kind):
    if kind == 'whoosh':
        d = 0.42; x = bandnoise_sweep(d, 300, 4000, 0.5); n = len(x); t = np.linspace(0, 1, n)
        return x * np.sin(np.pi * t) ** 1.5 * 0.8
    if kind == 'swoosh':
        d = 0.25; x = bandnoise_sweep(d, 1500, 6000, 0.6); t = np.linspace(0, 1, len(x))
        return x * np.sin(np.pi * t) ** 2 * 0.6
    if kind == 'pop':
        d = 0.12; return sweep(900, 260, d) * env(int(SR * d), 0.002, 0.03) * 0.9
    if kind == 'pop3':
        out = np.zeros(int(SR * 0.4))
        for i, f in enumerate([700, 880, 1050]):
            s = sweep(f, f * 0.4, 0.1) * env(int(SR * 0.1), 0.002, 0.025); o = int(SR * 0.1 * i); out[o:o + len(s)] += s * 0.7
        return out
    if kind == 'tick':
        d = 0.05; return tone(2200, d) * env(int(SR * d), 0.001, 0.008) * 0.6
    if kind == 'ding':
        d = 1.0; n = int(SR * d)
        return (tone(1318.5, d) + 0.6 * tone(1975.5, d) + 0.3 * tone(2637, d)) * env(n, 0.002, 0.28) * 0.35
    if kind == 'beep':
        d = 0.5; n = int(SR * d); x = np.zeros(n)
        for o in (0, 0.18):
            s = tone(1600, 0.11) * env(int(SR * .11), .003, .2); i = int(SR * o); x[i:i + len(s)] += s
        return x * 0.35
    if kind == 'kaching':
        d = 1.0; n = int(SR * d); x = np.zeros(n)
        c = noise(int(SR * .06)) * env(int(SR * .06), .001, .015); x[:len(c)] += c * .5
        b = (tone(2093, .9) + .7 * tone(2637, .9) + .5 * tone(3136, .9)) * env(int(SR * .9), .002, .25)
        i = int(SR * .07); x[i:i + len(b)] += b * .3
        return x
    if kind == 'coin':
        d = 0.6; n = int(SR * d)
        return (tone(1800, d) * (1 + 0.5 * np.sin(2 * np.pi * 18 * np.arange(n) / SR))) * env(n, .002, .15) * .3
    if kind == 'boom':
        d = 1.4; n = int(SR * d)
        sub = sweep(110, 38, d) * env(n, 0.003, 0.45)
        hit = lp(noise(n), 0.08) * env(n, 0.001, 0.08) * 3
        return np.tanh((sub + hit) * 1.4) * 0.9
    if kind == 'hit':
        d = 0.5; n = int(SR * d)
        return np.tanh((sweep(180, 50, d) * env(n, .002, .12) + lp(noise(n), .2) * env(n, .001, .03) * 2) * 1.5) * .75
    if kind == 'stamp':
        d = 0.5; n = int(SR * d)
        thud = sweep(140, 55, d) * env(n, .001, .07)
        slap = lp(noise(n), .35) * env(n, .0005, .02) * 2.5
        return np.tanh((thud + slap) * 1.6) * .85
    if kind == 'buzz':
        d = 0.45; n = int(SR * d); x = np.zeros(n)
        for o in (0, .2):
            s = sweep(160, 150, .2, 'sq') * env(int(SR * .2), .003, .5) * (np.arange(int(SR * .2)) < SR * .17); i = int(SR * o); x[i:i + len(s)] += s
        return lp(x, .25) * .35
    if kind == 'alert':
        d = 0.6; n = int(SR * d); x = np.zeros(n)
        for k, f in enumerate([880, 660]):
            s = tone(f, .14) * env(int(SR * .14), .003, .3); i = int(SR * .15 * k); x[i:i + len(s)] += s
        return x * .35
    if kind == 'fall':
        d = 0.9; n = int(SR * d); x = sweep(900, 120, .6) * env(int(SR * .6), .01, .5) * .35
        y = np.zeros(n); y[:len(x)] += x
        th = make('stamp'); i = int(SR * .55); y[i:i + len(th)] += th[:n - i] * .8
        return y
    raise ValueError(kind)

def main():
    cues, voice, dur, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).astype(np.float64)
    N = int(SR * dur) + SR
    mix_v = np.zeros(N); mix_v[:len(v)] = v[:N]
    fx = np.zeros(N); cache = {}
    for c in json.load(open(cues)):
        k = c['type']
        if k not in cache: cache[k] = make(k)
        s = cache[k] * c.get('vol', 1); i = int(max(0, c['t']) * SR)
        if i >= N: continue
        fx[i:i + len(s)] += s[:N - i]
    # soft background bed: low pad + gentle pulse
    t = np.arange(N) / SR
    pad = sum(np.sin(2 * np.pi * f * t + p) for f, p in [(55, 0), (82.4, 1), (110, 2), (164.8, .5)]) / 4
    pad *= 0.5 + 0.5 * np.sin(2 * np.pi * t / 8) ** 2
    beat = np.zeros(N); bp = 60 / 96
    k = sweep(120, 45, .25) * env(int(SR * .25), .002, .08)
    for j in range(int(dur / bp)):
        i = int(j * bp * SR); beat[i:i + len(k)] += k[:N - i]
    bed = pad * 0.035 + beat * 0.05
    bed *= np.clip((dur + 0.3 - t) / 1.2, 0, 1)  # fade out at end
    # duck sfx/bed slightly under voice
    venv = np.convolve(np.abs(mix_v), np.ones(2400) / 2400, 'same')
    duck = 1 - 0.35 * np.clip(venv / 0.05, 0, 1)
    mix = mix_v * 1.0 + fx * 0.55 * (0.6 + 0.4 * duck) + bed * duck
    mix = mix[:int(SR * dur)]
    mix = np.tanh(mix / 0.98 * 1.05) * 0.95  # gentle limiter
    pcm = (mix * 32767).astype(np.int16)
    import wave
    with wave.open(out, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print('wrote', out, f'{dur:.2f}s')

if __name__ == '__main__':
    main()
