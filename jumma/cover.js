// Cover for the Jumma reel. usage: node cover.js out_dir
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const out = path.resolve(process.argv[2] || 'output'); const FULL = process.argv.includes('--full'); const BOX = process.argv.includes('--box'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => { window.LINES = [{ s: 0, e: 1, text: '' }]; window.ENV = []; window.FPS = 30; });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(([f, bx]) => { window.__FULL = f; window.__BOX = bx; }, [FULL, BOX]);
  await p.evaluate(() => {
    _pid = 0; const t = 1.3;
    if (window.__BOX) {
      const bx = 200, by = 560, bw = 680, bh = 640;
      let s = `<image href="assets/dua_vertical.jpg" x="-200" y="-100" width="1480" height="2120" preserveAspectRatio="xMidYMid slice" filter="url(#cblur)"/>`;
      s += `<rect width="${W}" height="${H}" fill="#140C06" opacity=".66"/>${geoPattern(.07)}`;
      for (let i = 0; i < 6; i++) s += hangingLamp(110 + i * 172, 230 + (i % 2) * 50, .85, t + i);
      s += `<g transform="translate(540,330)">${crescent(0, 0, .9)}</g>`;
      s += `<text x="540" y="486" text-anchor="middle" font-size="54" font-weight="700" fill="#FFF3D6" stroke="#140C06" stroke-width="7" paint-order="stroke">হে মুসলিম! একটু থামুন…</text>`;
      // portrait box: arched top like a mihrab, gold double frame
      const arch = (x, y, w, h, r) => `M${x},${y + h} V${y + r} Q${x},${y} ${x + w / 2},${y - r * .35} Q${x + w},${y} ${x + w},${y + r} V${y + h}Z`;
      s += `<path d="${arch(bx - 22, by - 22, bw + 44, bh + 44, 150)}" fill="${GOLDL}" opacity=".14" filter="url(#cglow)"/>`;
      s += `<path d="${arch(bx - 16, by - 16, bw + 32, bh + 32, 150)}" fill="none" stroke="${GOLD}" stroke-width="8"/>`;
      s += `<clipPath id="cbox"><path d="${arch(bx, by, bw, bh, 130)}"/></clipPath><g clip-path="url(#cbox)"><image href="assets/dua_vertical.jpg" x="${bx - 60}" y="${by - 280}" width="${bw + 120}" height="${(bw + 120) * 1920 / 1080}" preserveAspectRatio="xMidYMid slice"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#F2A65A" opacity=".07"/></g>`;
      s += `<path d="${arch(bx + 12, by + 12, bw - 24, bh - 24, 130)}" fill="none" stroke="${GOLD}" stroke-width="3" opacity=".7"/>`;
      s += dust(t, 36, [bx, by, bw, bh]);
      s += `<text x="540" y="1340" text-anchor="middle" font-size="140" font-weight="700" fill="${GOLD}" stroke="#140C06" stroke-width="12" paint-order="stroke">জুমা মোবারক</text>`;
      s += `<text x="540" y="1440" text-anchor="middle" font-size="54" font-weight="700" fill="#FFF3D6" stroke="#140C06" stroke-width="8" paint-order="stroke">আরেকটি শুক্রবার হয়তো <tspan fill="#FF8A70">আর আসবে না!</tspan></text>`;
      s += `<rect x="340" y="1530" width="400" height="6" rx="3" fill="${GOLD}" opacity=".85"/>`;
      s += `<text x="540" y="1640" text-anchor="middle" font-size="40" font-weight="600" fill="#FFF3D6dd">পবিত্র জুমার দিনের রিমাইন্ডার</text>`;
      s += `<g transform="translate(540,1770)"><rect x="-230" y="-50" width="460" height="100" rx="50" fill="#2A1C12cc" stroke="${GOLD}" stroke-width="4"/><text y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${GOLD}">${BRAND}</text></g>`;
      const defs = DEFS.replace('</defs>', `<filter id="cblur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="30"/></filter><filter id="cglow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="18"/></filter></defs>`);
      document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${defs}${s}${vignette(.45)}${grain(.05)}${brandTag(true)}</svg>`;
      document.getElementById('sub').style.opacity = 0; return;
    }
    if (window.__FULL) {
      let s = `<image href="assets/dua_vertical.jpg" x="0" y="0" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>`;
      s += `<rect width="${W}" height="${H}" fill="#F2A65A" opacity=".06"/>` + lightRays(620, 200, 4, 30, 1300, .16, t) + dust(t, 50, [0, 200, 1080, 1500]);
      s += `<rect width="${W}" height="620" fill="url(#cTop)"/><rect y="1180" width="${W}" height="740" fill="url(#cBottom)"/>`;
      s += `<g transform="translate(900,250)">${crescent(0, 0, 1.1)}<circle r="100" fill="${GOLDL}" opacity=".12"/></g>`;
      s += `<text x="540" y="330" text-anchor="middle" font-size="60" font-weight="700" fill="#FFF3D6" stroke="#140C06" stroke-width="7" paint-order="stroke">হে মুসলিম! একটু থামুন…</text>`;
      s += `<text x="540" y="1350" text-anchor="middle" font-size="156" font-weight="700" fill="${GOLD}" stroke="#140C06" stroke-width="12" paint-order="stroke">জুমা মোবারক</text>`;
      s += `<text x="540" y="1460" text-anchor="middle" font-size="58" font-weight="700" fill="#FFF3D6" stroke="#140C06" stroke-width="8" paint-order="stroke">আরেকটি শুক্রবার হয়তো <tspan fill="#FF8A70">আর আসবে না!</tspan></text>`;
      s += `<rect x="340" y="1530" width="400" height="6" rx="3" fill="${GOLD}" opacity=".85"/>`;
      s += `<text x="540" y="1630" text-anchor="middle" font-size="42" font-weight="600" fill="#FFF3D6dd">পবিত্র জুমার দিনের রিমাইন্ডার</text>`;
      s += `<g transform="translate(540,1760)"><rect x="-230" y="-50" width="460" height="100" rx="50" fill="#2A1C12cc" stroke="${GOLD}" stroke-width="4"/><text y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${GOLD}">${BRAND}</text></g>`;
      const defs = DEFS.replace('</defs>', `<linearGradient id="cTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140C06" stop-opacity=".85"/><stop offset="1" stop-color="#140C06" stop-opacity="0"/></linearGradient><linearGradient id="cBottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140C06" stop-opacity="0"/><stop offset=".3" stop-color="#140C06" stop-opacity=".78"/><stop offset="1" stop-color="#140C06" stop-opacity=".94"/></linearGradient></defs>`);
      document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${defs}${s}${vignette(.45)}${grain(.05)}${brandTag(true)}</svg>`;
      document.getElementById('sub').style.opacity = 0; return;
    }
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
  const tag = BOX ? '_box' : FULL ? '_vertical' : '';
  await p.screenshot({ path: `${out}/Jumma_cover${tag}_1080x1920.png` });
  await p.screenshot({ path: `${out}/Jumma_cover${tag}_grid_1080x1440.png`, clip: { x: 0, y: 240, width: 1080, height: 1440 } });
  await p.screenshot({ path: `${out}/Jumma_cover${tag}_grid_1080x1080.png`, clip: { x: 0, y: 420, width: 1080, height: 1080 } });
  await b.close(); console.log('ok');
})();
