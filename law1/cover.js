// Cover / thumbnail for the Law 1 reel. usage: node cover.js out_dir
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const out = path.resolve(process.argv[2] || 'output'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => { window.LINES = [{ s: 0, e: 1, text: '' }]; window.ENV = []; window.FPS = 30; });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    _pid = 0; const t = 1.15;
    let s = `<rect width="${W}" height="${H}" fill="url(#gNight)"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 397) % W}" cy="${(i * 613) % 1000}" r="${1.5 + (i % 3)}" fill="#fff" opacity=".5"/>`;
    // fireworks frozen at a nice moment
    [[170, 330, 170, .45, '#F4A93B'], [930, 280, 150, .5, '#E85D4A'], [560, 210, 120, .6, '#F7E28B'], [80, 640, 110, .55, '#7FD1C5'], [1010, 620, 120, .5, '#FF9EC4']].forEach(f => s += firework(...f));
    s += `<g opacity=".95">${chateau(540, 1260, .95, { night: true })}</g><rect y="1260" width="${W}" height="${H - 1260}" fill="#162A22"/>`;
    // the king looming behind, cold, red rim light
    s += `<rect width="${W}" height="${H}" fill="#0B0A18" opacity=".35"/>`;
    s += `<ellipse cx="770" cy="760" rx="380" ry="520" fill="#E85D4A" opacity=".18"/>`;
    s += person({ kind: 'louis', x: 770, y: 760, s: 1.55, expr: 'cold', look: [-.9, .2] });
    s += `<rect x="440" y="300" width="640" height="1100" fill="url(#gSideR)"/>`;
    // Fouquet in front, proud, goblet; prison bars over his right half
    s += `<ellipse cx="300" cy="1180" rx="320" ry="440" fill="#FFD983" opacity=".2"/>`;
    s += person({ kind: 'fouquet', x: 290, y: 1130, s: 1.45, expr: 'proud', look: [.3, 0] });
    s += `<g transform="translate(90,1230) rotate(14) scale(1.15)"><path d="M-28,-100 h56 l-10,62 q-18,14 -36,0z" fill="#D9A441"/><rect x="-5" y="-38" width="10" height="50" fill="#D9A441"/><ellipse cy="12" rx="26" ry="8" fill="#D9A441"/><path d="M-22,-88 h44" stroke="#8C1C2E" stroke-width="12"/></g>`;
    s += `<clipPath id="barsClip"><rect x="300" y="820" width="330" height="900"/></clipPath><g clip-path="url(#barsClip)">${[0, 1, 2].map(i => `<rect x="${310 + i * 105}" y="700" width="30" height="1000" fill="#15151A"/><rect x="${355 + i * 100}" y="700" width="7" height="1000" fill="#5A5A66"/>`).join('')}<rect x="300" y="930" width="330" height="30" fill="#15151A"/></g>`;
    // bottom dark band for text
    s += `<rect y="1110" width="${W}" height="${H - 1110}" fill="url(#gBottom)"/>`;
    // top badge
    s += `<g transform="translate(540,250)"><rect x="-150" y="-58" width="300" height="116" rx="58" fill="${C.amber}"/><text y="26" text-anchor="middle" font-size="76" font-weight="700" fill="${C.ink}">LAW 1</text></g>`;
    // headline
    s += `<text x="540" y="1300" text-anchor="middle" font-size="94" font-weight="700" fill="#fff" stroke="#0B0A18" stroke-width="10" paint-order="stroke">রাজাকে খুশি করতে</text>`;
    s += `<text x="540" y="1425" text-anchor="middle" font-size="108" font-weight="700" fill="#fff" stroke="#0B0A18" stroke-width="10" paint-order="stroke">পার্টি দিয়ে <tspan fill="${C.coral}">জেলে!</tspan></text>`;
    s += `<rect x="290" y="1478" width="500" height="8" rx="4" fill="${C.amber}"/>`;
    s += `<text x="540" y="1580" text-anchor="middle" font-size="48" font-weight="700" fill="${C.amber}" letter-spacing="1">Never Outshine the Master</text>`;
    s += `<text x="540" y="1645" text-anchor="middle" font-size="34" font-weight="500" fill="#ffffffbb">ফুকে ও রাজা চতুর্দশ লুই · ১৬৬১</text>`;
    const defs = DEFS.replace('</defs>', `<linearGradient id="gSideR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0B0A18" stop-opacity=".0"/><stop offset=".55" stop-color="#0B0A18" stop-opacity=".1"/><stop offset="1" stop-color="#0B0A18" stop-opacity=".55"/></linearGradient><linearGradient id="gBottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B0A18" stop-opacity="0"/><stop offset=".22" stop-color="#0B0A18" stop-opacity=".88"/><stop offset="1" stop-color="#0B0A18" stop-opacity=".97"/></linearGradient></defs>`);
    document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${defs}${s}${vignette(.45)}${grain(.05)}${brandTag(true)}</svg>`;
    document.getElementById('sub').style.opacity = 0;
  });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/Law1_cover_1080x1920.png` });
  await p.screenshot({ path: `${out}/Law1_cover_grid_1080x1080.png`, clip: { x: 0, y: 420, width: 1080, height: 1080 } });
  await p.screenshot({ path: `${out}/Law1_cover_grid_1080x1440.png`, clip: { x: 0, y: 240, width: 1080, height: 1440 } });
  await b.close(); console.log('ok');
})();
