// Cover for the Law 10 reel. usage: node cover.js out_dir
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const out = path.resolve(process.argv[2] || 'output'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => { window.LINES = [{ s: 0, e: 1, text: '' }]; window.ENV = []; window.FPS = 30; });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    _pid = 0; const t = 1.2;
    const bx = 70, by = 520, bw = 940, bh = 700;
    let s = bgInk(t) + `<circle cx="540" cy="860" r="620" fill="#E85D4A" opacity=".06"/>`;
    // top
    s += `<g transform="translate(540,250)"><rect x="-170" y="-58" width="340" height="116" rx="58" fill="${C.amber}"/><text y="26" text-anchor="middle" font-size="74" font-weight="700" fill="${C.ink}">LAW 10</text></g>`;
    s += `<text x="540" y="470" text-anchor="middle" font-size="54" font-weight="700" fill="#E6EAF2" stroke="#0E1730" stroke-width="6" paint-order="stroke">সাকিবের কোনো শত্রু ছিল না…</text>`;
    // the room inside a framed box (scene drawn at 1080x1920, scaled into the box)
    const sc = bw / 1080, scene = `<g transform="translate(${bx},${by - 760 * sc}) scale(${sc})">${messRoom(t)}${lyingMithu(300, 1330, 1.0, t, { expr: 'bored' })}${studySakib(800, 1290, .74, t, { expr: 'worried', label: 'চাকরি', look: [-.6, .2] })}</g>`;
    s += `<rect x="${bx - 14}" y="${by - 14}" width="${bw + 28}" height="${bh + 28}" rx="34" fill="none" stroke="${C.amber}" stroke-width="8"/>`;
    s += `<clipPath id="cb"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="24"/></clipPath><g clip-path="url(#cb)">`;
    s += `<g filter="url(#sat1)">${scene}</g>`;                                                     // gray version (whole room)
    s += `<clipPath id="half"><path d="M${bx + bw * .52},${by} C${bx + bw * .46},${by + bh * .35} ${bx + bw * .6},${by + bh * .6} ${bx + bw * .5},${by + bh} L${bx + bw},${by + bh} L${bx + bw},${by}Z"/></clipPath><g clip-path="url(#half)">${scene}</g>`;   // Sakib's side still in colour
    s += grayCloud(bx + bw * .26, by + 110, .85, t, 1);
    for (let i = 0; i < 5; i++) s += virus(bx + bw * (.38 + i * .06), by + 200 + Math.sin(i * 1.7) * 50, 14 + (i % 2) * 5, '#7A808C', .9, i * 30);
    s += `<path d="M${bx + bw * .52},${by} C${bx + bw * .46},${by + bh * .35} ${bx + bw * .6},${by + bh * .6} ${bx + bw * .5},${by + bh}" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none" stroke-dasharray="14 12"/>`;
    s += `</g>`;
    // headline
    s += `<text x="540" y="1350" text-anchor="middle" font-size="112" font-weight="700" fill="#fff" stroke="#0E1730" stroke-width="10" paint-order="stroke">স্বপ্ন শেষ করল <tspan fill="${C.coral}">রুমমেট!</tspan></text>`;
    s += `<text x="540" y="1450" text-anchor="middle" font-size="58" font-weight="700" fill="${C.amber}" stroke="#0E1730" stroke-width="7" paint-order="stroke">একটাও খারাপ কাজ না করে</text>`;
    s += `<rect x="340" y="1510" width="400" height="6" rx="3" fill="${C.amber}" opacity=".85"/>`;
    s += `<text x="540" y="1610" text-anchor="middle" font-size="42" font-weight="600" fill="#C9D1E0">Infection: Avoid the Unhappy and Unlucky</text>`;
    s += `<g transform="translate(540,1750)"><rect x="-230" y="-50" width="460" height="100" rx="50" fill="#14213Dcc" stroke="${C.amber}" stroke-width="4"/><text y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${C.amber}">${BRAND}</text></g>`;
    document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${DEFS}${s}<rect width="${W}" height="${H}" fill="url(#gGrade)"/>${vignette(.45)}${grain(.045)}${brandTag(true)}</svg>`;
    document.getElementById('sub').style.opacity = 0;
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/Law10_cover_1080x1920.png` });
  await p.screenshot({ path: `${out}/Law10_cover_grid_1080x1440.png`, clip: { x: 0, y: 240, width: 1080, height: 1440 } });
  await p.screenshot({ path: `${out}/Law10_cover_grid_1080x1080.png`, clip: { x: 0, y: 420, width: 1080, height: 1080 } });
  await b.close(); console.log('ok');
})();
