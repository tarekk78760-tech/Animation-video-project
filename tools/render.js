// Render index.html frame-by-frame to MP4 segments (parallel workers), export SFX cue list.
// usage: node tools/render.js <outdir> [fps=30] [workers=3]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const out = path.resolve(process.argv[2] || 'build');
const FPS = +(process.argv[3] || 30), WORKERS = +(process.argv[4] || 3);
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.resolve(__dirname, '../index.html');

async function open(browser) {
  const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(url);
  await p.evaluate(() => window.READY);
  return p;
}

(async () => {
  const browser = await chromium.launch();
  const p0 = await open(browser);
  const { dur, sfx } = await p0.evaluate(() => ({ dur: window.DURATION, sfx: window.SFX }));
  fs.writeFileSync(path.join(out, 'sfx.json'), JSON.stringify(sfx, null, 1));
  await p0.close();
  const total = Math.ceil(dur * FPS);
  const per = Math.ceil(total / WORKERS);
  console.log(`duration ${dur.toFixed(2)}s, ${total} frames, ${WORKERS} workers`);
  const t0 = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const a = w * per, b = Math.min(total, a + per);
    const page = await open(browser);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), path.join(out, `seg${w}.mp4`)],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = a; f < b; f++) {
      await page.evaluate(t => window.seek(t), f / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (w === 0 && f % 150 === 0) console.log(`frame ${f}/${b} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    await page.close();
  }));
  fs.writeFileSync(path.join(out, 'segs.txt'), Array.from({ length: WORKERS }, (_, w) => `file 'seg${w}.mp4'`).join('\n') + '\n');
  await browser.close();
  console.log('done in', ((Date.now() - t0) / 1000).toFixed(0), 's');
})();
