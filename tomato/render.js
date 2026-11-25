// Renders the tomato documentary (1080x1920, 30 fps) with headless Chromium + ffmpeg.
// usage: node tomato/render.js                -> output/tomato_dam_keno_bare_9x16.mp4
//        node tomato/render.js --preview 3,25  -> tomato/preview/f*.png
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = __dirname, ROOT = path.dirname(DIR);
const FPS = 30, W = 1080, H = 1920, DURATION = 80.0, WORKERS = 4;
const VOICE = path.join(DIR, 'assets', 'voiceover.mp3');

function mouthEnvelope() {
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', VOICE, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  const s = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
  const hop = 16000 / FPS, n = Math.ceil(DURATION * FPS), rms = [];
  for (let i = 0; i < n; i++) {
    let a = 0, c = 0;
    for (let j = Math.floor(i * hop); j < Math.min(s.length, (i + 1) * hop); j++) { a += s[j] * s[j]; c++; }
    rms.push(c ? Math.sqrt(a / c) : 0);
  }
  const sorted = [...rms].sort((a, b) => a - b), ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
  return rms.map((v, i) => {
    const x = Math.min(1, Math.max(0, (v / ref - 0.12) / 0.75));
    return +(x * (0.75 + 0.25 * Math.sin(i * 1.7))).toFixed(3); // a little flutter so vowels read
  });
}

function buildPage() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:'Hind Siliguri';font-weight:400;src:url('../../assets/fonts/HindSiliguri-Regular.ttf')}
    @font-face{font-family:'Hind Siliguri';font-weight:500;src:url('../../assets/fonts/HindSiliguri-Medium.ttf')}
    @font-face{font-family:'Hind Siliguri';font-weight:600;src:url('../../assets/fonts/HindSiliguri-SemiBold.ttf')}
    @font-face{font-family:'Hind Siliguri';font-weight:700;src:url('../../assets/fonts/HindSiliguri-Bold.ttf')}
    html,body{margin:0;padding:0;background:#0a1a36}
    #stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:'Hind Siliguri',sans-serif}
  </style></head><body>
  ${fs.readFileSync(path.join(DIR, 'art.svg'), 'utf8')}
  <div id="stage"></div>
  <div style="position:absolute;opacity:0;font-family:'Hind Siliguri'"><b>আ</b><span style="font-weight:600">আ</span><span style="font-weight:400">আ</span></div>
  <script>${fs.readFileSync(path.join(DIR, 'host.js'), 'utf8')}</script>
  <script>${fs.readFileSync(path.join(DIR, 'scenes.js'), 'utf8')}</script>
  </body></html>`;
  const out = path.join(DIR, 'build');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'page.html'), html);
  return 'file://' + path.join(out, 'page.html');
}

async function openPages(browser, url, mouth, n) {
  const pages = [];
  for (let i = 0; i < n; i++) {
    const p = await browser.newPage({ viewport: { width: W, height: H } });
    await p.goto(url);
    await p.evaluate(m => { setMouth(m); return document.fonts.ready; }, mouth);
    await p.evaluate(() => document.fonts.load("700 40px 'Hind Siliguri'"));
    pages.push(p);
  }
  return pages;
}

async function shot(page, t, type = 'jpeg') {
  await page.evaluate(tt => render(tt), t);
  return page.screenshot(type === 'jpeg' ? { type: 'jpeg', quality: 93 } : { type: 'png' });
}

(async () => {
  const url = buildPage();
  const mouth = mouthEnvelope();
  const browser = await chromium.launch();
  const args = process.argv.slice(2);
  if (args[0] === '--preview') {
    const [page] = await openPages(browser, url, mouth, 1);
    fs.mkdirSync(path.join(DIR, 'preview'), { recursive: true });
    for (const ts of args[1].split(',')) {
      fs.writeFileSync(path.join(DIR, 'preview', `f${(+ts).toFixed(2).padStart(5, '0')}.png`), await shot(page, +ts, 'png'));
    }
    await browser.close();
    return;
  }
  const music = path.join(ROOT, 'output', 'tomato_music.wav');
  if (!fs.existsSync(music)) execFileSync('python3', [path.join(ROOT, 'src', 'make_music.py'), music, String(DURATION)], { stdio: 'inherit' });
  const dst = path.join(ROOT, 'output', 'tomato_dam_keno_bare_9x16.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', VOICE, '-i', music,
    '-filter_complex',
    '[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,asplit=2[vo1][vo2];' +
    '[2:a]aresample=48000,volume=0.9[mu];' +
    '[mu][vo1]sidechaincompress=threshold=0.04:ratio=4:attack=20:release=400[md];' +
    '[vo2][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95[a]',
    '-map', '0:v', '-map', '[a]', '-t', String(DURATION),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], { stdio: ['pipe', 'inherit', 'inherit'] });
  const pages = await openPages(browser, url, mouth, WORKERS);
  const n = Math.round(DURATION * FPS);
  for (let i = 0; i < n; i += WORKERS) {
    const batch = await Promise.all(pages.map((p, k) => (i + k < n ? shot(p, (i + k) / FPS) : null)));
    for (const b of batch) if (b && !ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('wrote', dst);
})();
