// usage: node tools/snap.js out_dir t1 t2 ...   -> PNG frames at given times (for checking)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../index.html'));
  await p.evaluate(() => window.READY);
  for (const t of ts) { await p.evaluate(t => seek(+t), t); await p.screenshot({ path: `${out}/s_${t}.png` }); }
  if (errs.length) console.log(errs.join('\n'));
  await b.close();
})();
