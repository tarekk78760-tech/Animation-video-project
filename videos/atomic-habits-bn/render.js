// node render.js frames <out.mp4> [fps]       -> silent video, every frame
// node render.js stills <outdir> t1 t2 ...    -> PNG previews at given seconds
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');

(async () => {
  const [mode, out, ...rest] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => window.ready);
  const grab = async t => Buffer.from((await page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t)).split(',')[1], 'base64');

  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const s of rest) {
      const png = (await page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/png'); }, +s)).split(',')[1];
      fs.writeFileSync(path.join(out, `t${(+s).toFixed(1).padStart(5, '0')}.png`), Buffer.from(png, 'base64'));
    }
  } else {
    const fps = +(rest[0] || 30), dur = await page.evaluate(() => DUR), n = Math.ceil(dur * fps);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      const buf = await grab(i / fps);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
