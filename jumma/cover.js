// Cover for the Jumma reel. usage: node cover.js out_dir
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const out = path.resolve(process.argv[2] || 'output'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => { window.LINES = [{ s: 0, e: 1, text: '' }]; window.ENV = []; window.FPS = 30; });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    _pid = 0; const t = 1.3;
    const ph = 1080 * 726 / 1284, top = 880 - ph / 2;
    let s = `<image href="assets/dua.jpg" x="-300" y="-100" width="1680" height="2120" preserveAspectRatio="xMidYMid slice" filter="url(#cblur)"/>`;
    s += `<rect width="${W}" height="${H}" fill="#140C06" opacity=".62"/>${geoPattern(.07)}`;
    // hanging lamps + crescent
    for (let i = 0; i < 6; i++) s += hangingLamp(110 + i * 172, 250 + (i % 2) * 60, .9, t + i);
    s += `<g transform="translate(900,250)">${crescent(0, 0, 1.2)}<circle r="110" fill="${GOLDL}" opacity=".1"/></g>`;
    // small hook line above photo
    s += `<text x="540" y="470" text-anchor="middle" font-size="54" font-weight="700" fill="#FFF3D6" stroke="#140C06" stroke-width="6" paint-order="stroke">হে মুসলিম! একটু থামুন…</text>`;
    // framed photo with gold border + glow
    s += `<rect x="20" y="${top - 14}" width="1040" height="${ph + 28}" rx="26" fill="none" stroke="${GOLD}" stroke-width="6" opacity=".9"/>`;
    s += `<rect x="34" y="${top}" width="1012" height="${ph}" rx="18" fill="${GOLDL}" opacity=".12" filter="url(#cglow)"/>`;
    s += `<clipPath id="cph"><rect x="34" y="${top}" width="1012" height="${ph}" rx="18"/></clipPath><g clip-path="url(#cph)"><image href="assets/dua.jpg" x="20" y="${top - 30}" width="1100" height="${ph + 60}" preserveAspectRatio="xMidYMid slice"/><rect x="0" y="${top}" width="1080" height="${ph}" fill="#F2A65A" opacity=".08"/></g>`;
    s += lightRays(560, top + 40, 4, 30, 700, .22, t) + dust(t, 40, [0, top, 1080, ph + 300]);
    // headline
    s += `<rect y="1210" width="${W}" height="${H - 1210}" fill="url(#cBottom)"/>`;
    s += `<text x="540" y="1350" text-anchor="middle" font-size="150" font-weight="700" fill="${GOLD}" stroke="#140C06" stroke-width="12" paint-order="stroke">জুমা মোবারক</text>`;
    s += `<text x="540" y="1460" text-anchor="middle" font-size="58" font-weight="700" fill="#FFF3D6" stroke="#140C06" stroke-width="8" paint-order="stroke">আরেকটি শুক্রবার হয়তো <tspan fill="#FF8A70">আর আসবে না!</tspan></text>`;
    // bottom
    s += `<rect x="340" y="1530" width="400" height="6" rx="3" fill="${GOLD}" opacity=".8"/>`;
    s += `<text x="540" y="1630" text-anchor="middle" font-size="42" font-weight="600" fill="#FFF3D6cc">পবিত্র জুমার দিনের রিমাইন্ডার</text>`;
    s += `<g transform="translate(540,1760)"><rect x="-230" y="-50" width="460" height="100" rx="50" fill="#2A1C12" stroke="${GOLD}" stroke-width="4"/><text y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${GOLD}">${BRAND}</text></g>`;
    const defs = DEFS.replace('</defs>', `<filter id="cblur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="30"/></filter><filter id="cglow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="18"/></filter><linearGradient id="cBottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140C06" stop-opacity="0"/><stop offset=".25" stop-color="#140C06" stop-opacity=".75"/><stop offset="1" stop-color="#140C06" stop-opacity=".92"/></linearGradient></defs>`);
    document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${defs}${s}${vignette(.5)}${grain(.05)}${brandTag(true)}</svg>`;
    document.getElementById('sub').style.opacity = 0;
  });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/Jumma_cover_1080x1920.png` });
  await p.screenshot({ path: `${out}/Jumma_cover_grid_1080x1440.png`, clip: { x: 0, y: 240, width: 1080, height: 1440 } });
  await p.screenshot({ path: `${out}/Jumma_cover_grid_1080x1080.png`, clip: { x: 0, y: 420, width: 1080, height: 1080 } });
  await b.close(); console.log('ok');
})();
