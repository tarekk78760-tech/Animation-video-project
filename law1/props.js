// ===== Law 1 locations & props: 1661 France — Fouquet's château, gardens, banquet, theatre, fireworks, arrest, prison =====

// ---------- Fouquet's new château (Vaux-like): dome, wings, steps. centre-bottom at (x,y) ----------
function chateau(x, y, s, o = {}) {
  const night = !!o.night, wall = night ? '#B9A98E' : '#EFE3C8', roof = night ? '#2A3550' : '#4A5878', win = night ? '#FFD983' : '#9CC0D0';
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  // wings
  for (const sx of [-1, 1]) {
    g += `<rect x="${sx > 0 ? 160 : -480}" y="-300" width="320" height="300" fill="${wall}"/><path d="M${sx > 0 ? 150 : -490},-300 L${sx > 0 ? 490 : -150},-300 L${sx > 0 ? 460 : -180},-380 L${sx > 0 ? 180 : -460},-380Z" fill="${roof}"/>`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) g += `<rect x="${(sx > 0 ? 180 : -460) + c * 76}" y="${-270 + r * 130}" width="44" height="90" rx="22" fill="${win}" stroke="#C9B48E" stroke-width="5"/>`;
    g += `<rect x="${sx > 0 ? 160 : -480}" y="-160" width="320" height="10" fill="#D9C8A6"/>`;
  }
  // central pavilion
  g += `<rect x="-180" y="-420" width="360" height="420" fill="${wall}"/>`;
  g += `<path d="M-200,-420 L200,-420 L0,-500Z" fill="${night ? '#C8B796' : '#E2D3B4'}" stroke="#C9B48E" stroke-width="5"/>`;
  // dome
  g += `<path d="M-150,-500 C-150,-660 150,-660 150,-500Z" fill="${roof}"/><path d="M-100,-560 C-90,-630 -30,-648 0,-650" stroke="#fff" stroke-opacity=".25" stroke-width="10" fill="none"/>`;
  g += `<rect x="-24" y="-700" width="48" height="60" fill="${wall}"/><path d="M-34,-700 C-34,-740 34,-740 34,-700Z" fill="${roof}"/><rect x="-4" y="-770" width="8" height="40" fill="#D9A441"/>`;
  // columns + arched windows
  for (let i = 0; i < 6; i++) g += `<rect x="${-160 + i * 60}" y="-400" width="18" height="380" fill="#E9DCC0" stroke="#C9B48E" stroke-width="3"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="${-120 + i * 90}" y="-360" width="60" height="140" rx="30" fill="${win}" stroke="#C9B48E" stroke-width="5"/>`;
  g += `<rect x="-60" y="-170" width="120" height="170" rx="60" fill="${night ? '#FFE3A0' : '#6B5238'}"/>`;
  g += `<path d="M-240,0 L240,0 L210,40 L-210,40Z" fill="#D9C8A6"/><path d="M-210,40 L210,40 L190,70 L-190,70Z" fill="#CDBB96"/>`;
  if (night) g += `<ellipse cx="0" cy="-200" rx="560" ry="300" fill="#FFD983" opacity=".12"/>`;
  return g + '</g>';
}
// ---------- the king's (older, plainer) palace ----------
function kingPalace(x, y, s, o = {}) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<rect x="-360" y="-300" width="720" height="300" fill="#CBBFA8"/><path d="M-380,-300 L380,-300 L340,-360 L-340,-360Z" fill="#5A5F6E"/>`;
  for (const sx of [-1, 1]) g += `<rect x="${sx > 0 ? 300 : -400}" y="-420" width="100" height="420" fill="#BFB29A"/><path d="M${sx > 0 ? 290 : -410},-420 L${sx > 0 ? 410 : -290},-420 L${sx > 0 ? 350 : -350},-500Z" fill="#5A5F6E"/>`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) g += `<rect x="${-300 + c * 88}" y="${-270 + r * 130}" width="40" height="80" fill="#8FA6B2" stroke="#A89C84" stroke-width="4"/>`;
  g += `<rect x="-40" y="-120" width="80" height="120" fill="#6B5238"/>`;
  return g + '</g>';
}
// ---------- formal French garden with parterres + fountains ----------
function frenchGarden(t, o = {}) {
  const night = !!o.night;
  let g = `<rect y="1050" width="${W}" height="${H - 1050}" fill="${night ? '#22392E' : '#7FAE6E'}"/>`;
  // perspective paths
  g += `<path d="M470,1050 L610,1050 L900,${H} L180,${H}Z" fill="${night ? '#5A5446' : '#E5D9BC'}"/>`;
  // parterre hedges (embroidery pattern)
  for (const sx of [-1, 1]) for (let r = 0; r < 4; r++) {
    const y = 1100 + r * 170 + r * r * 20, w = 120 + r * 70, cx = 540 + sx * (150 + r * 140);
    g += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${90 + r * 20}" rx="20" fill="${night ? '#2F5240' : '#4E8A55'}"/><path d="M${cx - w / 3},${y + 40 + r * 10} q${w / 6},-30 ${w / 3},0 q${w / 6},30 ${w / 3},0" stroke="${night ? '#5C8A6A' : '#A9D18E'}" stroke-width="6" fill="none"/>`;
  }
  // topiary cones
  for (let i = 0; i < 6; i++) { const sx = i % 2 ? 1 : -1, r = Math.floor(i / 2), x = 540 + sx * (90 + r * 110), y = 1120 + r * 210; g += `<path d="M${x},${y - 80 - r * 30} L${x + 26 + r * 8},${y} L${x - 26 - r * 8},${y}Z" fill="${night ? '#1F3D2E' : '#3E7A48'}"/>`; }
  return g;
}
function fountain(x, y, s, t, night) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="200" ry="44" fill="${night ? '#5A6A7A' : '#BFB29A'}"/><ellipse cx="0" cy="-6" rx="180" ry="36" fill="${night ? '#2B4A6A' : '#7FC3D9'}"/>`;
  g += `<rect x="-16" y="-120" width="32" height="114" fill="${night ? '#7A7468' : '#D9CBB0'}"/><ellipse cx="0" cy="-120" rx="60" ry="14" fill="${night ? '#7A7468' : '#D9CBB0'}"/>`;
  for (let i = 0; i < 7; i++) { const a = (i - 3) * .32, ph = (t * 1.2 + i * .13) % 1; g += `<path d="M0,-130 Q${Math.sin(a) * 160},${-330} ${Math.sin(a) * 200},-20" stroke="#CFEFFF" stroke-width="7" fill="none" opacity=".75" stroke-dasharray="30 18" stroke-dashoffset="${-ph * 96}"/>`; }
  g += `<path d="M-8,-130 Q0,-300 8,-130" stroke="#E6F8FF" stroke-width="12" fill="none" opacity=".85"/>`;
  return g + '</g>';
}
// ---------- fireworks ----------
function firework(x, y, r, p, col) { // p 0..1 life
  if (p <= 0 || p >= 1) return '';
  let g = '';
  const rr = r * eo(p), op = 1 - p * p;
  for (let i = 0; i < 18; i++) { const a = i * 20 * Math.PI / 180; g += `<line x1="${x + Math.cos(a) * rr * .35}" y1="${y + Math.sin(a) * rr * .35 + p * p * 30}" x2="${x + Math.cos(a) * rr}" y2="${y + Math.sin(a) * rr + p * p * 60}" stroke="${col}" stroke-width="6" stroke-linecap="round" opacity="${op}"/><circle cx="${x + Math.cos(a) * rr}" cy="${y + Math.sin(a) * rr + p * p * 60}" r="5" fill="#fff" opacity="${op}"/>`; }
  g += `<circle cx="${x}" cy="${y}" r="${30 * (1 - p)}" fill="#fff" opacity="${op * .8}"/>`;
  return g;
}
function fireworksSky(t, t0, n = 7) {
  const cols = ['#F4A93B', '#E85D4A', '#7FD1C5', '#F7E28B', '#C7A6FF', '#FF9EC4'];
  let g = '';
  for (let i = 0; i < n; i++) { const st = t0 + i * .32, p = (t - st) / 1.4; const pp = ((p % 1) + 1) % 1; if (t < st) continue; g += firework(150 + (i * 263) % 800, 220 + (i * 157) % 420, 150 + (i % 3) * 40, pp, cols[i % cols.length]); }
  return g;
}
// ---------- banquet ----------
function chandelier(x, y, s, t) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><line x1="0" y1="-300" x2="0" y2="-40" stroke="#B8862B" stroke-width="6"/>`;
  g += `<ellipse cx="0" cy="0" rx="160" ry="30" fill="none" stroke="#D9A441" stroke-width="10"/><ellipse cx="0" cy="-40" rx="90" ry="18" fill="none" stroke="#D9A441" stroke-width="8"/>`;
  for (let i = 0; i < 7; i++) { const x2 = -150 + i * 50; const f = 1 + Math.sin(t * 12 + i) * .1; g += `<rect x="${x2 - 6}" y="-34" width="12" height="34" fill="#FFF8EA"/><g transform="translate(${x2},-40) scale(1,${f})"><path d="M0,-22 C8,-10 8,0 0,4 C-8,0 -8,-10 0,-22Z" fill="#FFC857"/></g><circle cx="${x2}" cy="-46" r="26" fill="#FFE29A" opacity=".25"/>`; }
  for (let i = 0; i < 9; i++) g += `<path d="M${-140 + i * 35},14 l0,30" stroke="#E6F2FF" stroke-width="4" opacity=".8"/><circle cx="${-140 + i * 35}" cy="48" r="6" fill="#E6F2FF" opacity=".9"/>`;
  return g + '</g>';
}
function banquetHall(t) {
  let g = `<rect width="${W}" height="${H}" fill="#5A2230"/>`;
  // panelled walls with gold trim
  for (let i = 0; i < 4; i++) g += `<rect x="${40 + i * 260}" y="260" width="220" height="620" rx="12" fill="#6E2A3A" stroke="#D9A441" stroke-width="6"/><rect x="${70 + i * 260}" y="300" width="160" height="240" rx="80" fill="#3E1622" stroke="#D9A441" stroke-width="4"/>`;
  g += `<rect y="0" width="${W}" height="200" fill="#4A1A26"/><path d="M0,200 h${W}" stroke="#D9A441" stroke-width="10"/>`;
  // ceiling fresco hint
  g += `<ellipse cx="540" cy="100" rx="420" ry="80" fill="#8FB8D9" opacity=".35"/>`;
  g += chandelier(300, 330, .9, t) + chandelier(800, 300, .8, t);
  g += `<rect y="880" width="${W}" height="${H - 880}" fill="#3A1A16"/>`;
  for (let i = 0; i < 9; i++) g += `<path d="M${i * 140 - 80},${H} L${540 + (i - 4) * 60},880" stroke="#4E2620" stroke-width="4"/>`;
  return g;
}
function banquetTable(y, t) {
  let g = `<rect x="-40" y="${y}" width="1160" height="40" fill="#F8F2E4"/><rect x="-40" y="${y + 40}" width="1160" height="300" fill="#EFE6D2"/><path d="M-40,${y + 40} ${Array.from({ length: 13 }, (_, i) => `Q${-40 + i * 90 + 45},${y + 80} ${-40 + (i + 1) * 90},${y + 40}`).join(' ')}" stroke="#D9C9A8" stroke-width="5" fill="none"/>`;
  // food: roast, fruit pyramid, cake, goblets, candelabra
  g += `<g transform="translate(250,${y})"><ellipse rx="130" ry="26" fill="#D9A441"/><ellipse cy="-30" rx="90" ry="44" fill="#9A4E24"/><ellipse cx="-20" cy="-50" rx="40" ry="14" fill="#C6743E" opacity=".7"/><path d="M60,-40 l40,-30" stroke="#F8F2E4" stroke-width="12" stroke-linecap="round"/></g>`;
  g += `<g transform="translate(540,${y})"><ellipse rx="100" ry="20" fill="#D9A441"/>${[[0, -26], [-30, -26], [30, -26], [-15, -52], [15, -52], [0, -78], [-45, -26], [45, -26], [-30, -52], [30, -52]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="18" fill="${['#E85D4A', '#F4A93B', '#8BC34A', '#B565A7'][i % 4]}"/>`).join('')}</g>`;
  g += `<g transform="translate(830,${y})"><ellipse rx="110" ry="22" fill="#D9A441"/><rect x="-80" y="-70" width="160" height="70" rx="10" fill="#F6E1C3"/><rect x="-60" y="-120" width="120" height="50" rx="10" fill="#F9ECD8"/><path d="M-80,-50 q20,16 40,0 q20,16 40,0 q20,16 40,0 q20,16 40,0" stroke="#E85D4A" stroke-width="6" fill="none"/><circle cy="-130" r="12" fill="#E85D4A"/></g>`;
  for (const gx of [100, 400, 690, 980]) g += `<g transform="translate(${gx},${y - 4})"><path d="M-18,-70 h36 l-6,40 q-12,10 -24,0z" fill="#D9A441"/><rect x="-3" y="-30" width="6" height="26" fill="#D9A441"/><ellipse rx="16" ry="5" fill="#D9A441"/><path d="M-14,-62 h28" stroke="#8C1C2E" stroke-width="8"/></g>`;
  return g;
}
// ---------- theatre stage ----------
function theatreStage(t, open = 1) {
  let g = `<rect width="${W}" height="${H}" fill="#2A1420"/>`;
  g += `<rect x="90" y="420" width="900" height="700" fill="#F2D9A6"/><rect x="90" y="420" width="900" height="700" fill="url(#gStage)"/>`;
  // painted backdrop: garden arch
  g += `<path d="M300,1120 L300,700 Q540,520 780,700 L780,1120" fill="none" stroke="#7FAE6E" stroke-width="40"/>`;
  // actors (silhouettes in costume)
  const bob = Math.sin(t * 3) * 6;
  g += `<g transform="translate(420,${1060 + bob})"><circle cy="-260" r="50" fill="#3A2A44"/><path d="M-80,0 C-80,-140 -50,-210 0,-210 C50,-210 80,-140 80,0Z" fill="#3A2A44"/><path d="M60,-180 l110,-60" stroke="#3A2A44" stroke-width="22" stroke-linecap="round"/></g>`;
  g += `<g transform="translate(680,${1060 - bob})"><circle cy="-250" r="46" fill="#4A2A3A"/><path d="M-110,0 C-90,-140 -50,-200 0,-200 C50,-200 90,-140 110,0Z" fill="#4A2A3A"/></g>`;
  // curtains
  const cw = 450 * (1 - open * .62);
  g += `<path d="M60,360 L${60 + cw},360 Q${60 + cw - 40},800 ${60 + cw},1160 L60,1160Z" fill="#9B1B30"/><path d="M1020,360 L${1020 - cw},360 Q${1020 - cw + 40},800 ${1020 - cw},1160 L1020,1160Z" fill="#9B1B30"/>`;
  for (let i = 0; i < 5; i++) g += `<path d="M${80 + i * cw / 5},370 Q${70 + i * cw / 5},800 ${80 + i * cw / 5},1150" stroke="#7A1426" stroke-width="8" fill="none"/><path d="M${1000 - i * cw / 5},370 Q${1010 - i * cw / 5},800 ${1000 - i * cw / 5},1150" stroke="#7A1426" stroke-width="8" fill="none"/>`;
  g += `<path d="M40,300 H1040 V420 Q960,470 880,420 Q800,470 720,420 Q640,470 560,420 Q480,470 400,420 Q320,470 240,420 Q160,470 40,420Z" fill="#8A1628"/><path d="M40,300 H1040" stroke="#D9A441" stroke-width="16"/>`;
  g += `<rect x="40" y="1140" width="1000" height="40" fill="#5A3020"/><rect x="40" y="1180" width="1000" height="${H - 1180}" fill="#1A0E14"/>`;
  // spotlights
  g += `<path d="M540,300 L300,1140 L780,1140Z" fill="#FFF3C4" opacity=".1"/>`;
  return g;
}
// ---------- royal order with wax seal ----------
function royalOrder(x, y, s, o = {}) {
  let g = `<g transform="translate(${x},${y}) scale(${s}) rotate(${o.rot || 0})">`;
  g += `<rect x="-300" y="-380" width="600" height="760" fill="#F3E6C4"/><rect x="-300" y="-380" width="600" height="760" fill="url(#gParch)"/>`;
  g += `<ellipse cx="0" cy="-400" rx="320" ry="40" fill="#E2D1A6"/><ellipse cx="0" cy="400" rx="320" ry="40" fill="#E2D1A6"/>`;
  g += fleur(0, -290, 1.3, '#B8862B');
  g += `<text x="0" y="-170" text-anchor="middle" font-size="54" font-weight="700" fill="#5A2A16">${o.title || 'রাজকীয় আদেশ'}</text>`;
  for (let i = 0; i < 6; i++) g += `<rect x="-230" y="${-110 + i * 50}" width="${i === 5 ? 260 : 460}" height="12" rx="6" fill="#C9B48E"/>`;
  if (o.line) g += `<text x="0" y="250" text-anchor="middle" font-size="46" font-weight="700" fill="#8C1C2E">${o.line}</text>`;
  g += `<g transform="translate(180,320)"><circle r="60" fill="#A8202E"/><circle r="44" fill="none" stroke="#7A1420" stroke-width="5"/>${fleur(0, 0, .8, '#7A1420')}<path d="M-20,50 l-20,70 l24,-14 l10,24z M20,50 l20,70 l-24,-14 l-10,24z" fill="#A8202E"/></g>`;
  return g + '</g>';
}
// ---------- prison cell ----------
function prisonCell(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="#2B2A30"/>`;
  for (let r = 0; r < 16; r++) for (let c = 0; c < 6; c++) g += `<rect x="${c * 190 - (r % 2) * 95 + 4}" y="${r * 90 + 4}" width="182" height="82" rx="10" fill="${['#3A3940', '#35343B', '#403F46'][(r + c) % 3]}"/>`;
  // barred window with moonlight
  g += `<rect x="640" y="300" width="260" height="220" fill="#1A2A44"/><circle cx="820" cy="370" r="40" fill="#E8EEF5" opacity=".9"/>`;
  for (let i = 0; i < 5; i++) g += `<rect x="${650 + i * 56}" y="300" width="12" height="220" fill="#15151A"/>`;
  g += `<rect x="630" y="290" width="280" height="20" fill="#15151A"/><rect x="630" y="510" width="280" height="20" fill="#15151A"/>`;
  g += `<path d="M640,520 L900,520 L1080,1500 L360,1500Z" fill="#CFE0F5" opacity=".08"/>`;
  // chains on wall
  g += `<g transform="translate(200,500)">${Array.from({ length: 6 }, (_, i) => `<ellipse cx="0" cy="${i * 34}" rx="14" ry="20" fill="none" stroke="#6E6E78" stroke-width="7"/>`).join('')}<circle cy="210" r="30" fill="none" stroke="#6E6E78" stroke-width="10"/></g>`;
  g += `<rect y="1320" width="${W}" height="${H - 1320}" fill="#1E1D22"/>`;
  for (let i = 0; i < 20; i++) g += `<path d="M${100 + i * 30},${1360 + (i % 3) * 8} l${18 + (i % 4) * 4},-14" stroke="#B89A5A" stroke-width="5" opacity=".8"/>`;  // straw
  // candle
  const f = 1 + Math.sin(t * 13) * .08;
  g += `<rect x="880" y="1250" width="30" height="70" fill="#EFE6D2"/><g transform="translate(895,1240) scale(${f},${2 - f})"><path d="M0,-30 C12,-12 12,0 0,6 C-12,0 -12,-12 0,-30Z" fill="#FFC857"/></g><circle cx="895" cy="1230" r="120" fill="#FFC857" opacity=".1"/>`;
  return g;
}
function cellBars(op = 1) {
  let g = '';
  for (let i = 0; i < 9; i++) g += `<rect x="${30 + i * 128}" y="0" width="26" height="${H}" fill="#121216" opacity="${op}"/><rect x="${34 + i * 128}" y="0" width="6" height="${H}" fill="#4A4A55" opacity="${op}"/>`;
  g += `<rect y="260" width="${W}" height="26" fill="#121216" opacity="${op}"/><rect y="1500" width="${W}" height="26" fill="#121216" opacity="${op}"/>`;
  return g;
}
function quill(x, y, s, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M0,0 C30,-120 90,-220 160,-280 C120,-180 80,-90 10,10Z" fill="#F4F1E8"/><path d="M0,0 L150,-270" stroke="#C9C2B0" stroke-width="4"/><path d="M0,0 l-14,40" stroke="#3A2A20" stroke-width="6"/></g>`;
}
function oldBook(x, y, s, col, title) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-30" width="300" height="60" rx="6" fill="${col}"/><rect x="-140" y="-22" width="280" height="44" fill="#F3E6C4" opacity=".25"/><path d="M-150,-30 v60" stroke="#D9A441" stroke-width="10"/>${title ? `<text x="10" y="12" text-anchor="middle" font-size="26" font-weight="700" fill="#F3E6C4">${title}</text>` : ''}</g>`;
}
function flame(x, y, s, t) {
  const f = 1 + Math.sin(t * 10) * .06;
  return `<g transform="translate(${x},${y}) scale(${s * f},${s * (2 - f)})"><path d="M0,-200 C80,-120 110,-40 80,30 C60,80 -60,80 -80,30 C-110,-40 -60,-90 -30,-150 C-20,-100 0,-90 10,-110 C20,-140 10,-170 0,-200Z" fill="#E85D4A"/><path d="M0,-110 C40,-60 50,-10 30,30 C15,55 -25,55 -35,30 C-50,-10 -20,-50 0,-110Z" fill="#F4A93B"/><path d="M0,-40 C16,-16 18,8 8,24 C0,32 -12,30 -16,20 C-22,4 -10,-16 0,-40Z" fill="#FFF0B8"/></g>`;
}
// noble guest (small, full figure) for crowds
function guest(x, y, s, kind, t, i = 0) {
  const sway = Math.sin(t * 2 + i) * 3;
  if (kind === 'lady') return `<g transform="translate(${x},${y + sway}) scale(${s})"><path d="M-100,260 C-90,120 -50,40 0,40 C50,40 90,120 100,260Z" fill="${['#D97A8E', '#7FB3D5', '#F4C17A', '#B5A1E0'][i % 4]}"/><rect x="-36" y="20" width="72" height="50" rx="20" fill="${['#C4627A', '#5E95BD', '#E0A453', '#9A84CC'][i % 4]}"/><circle cy="-10" r="40" fill="#F0C8A6"/><circle cy="-62" r="30" fill="#8A5A2E"/><circle cx="-34" cy="-30" r="18" fill="#8A5A2E"/><circle cx="34" cy="-30" r="18" fill="#8A5A2E"/><path d="M40,60 l60,-40 l10,30z" fill="#F7F4EE"/></g>`;
  return `<g transform="translate(${x},${y + sway}) scale(${s})"><path d="M-80,260 C-80,110 -50,40 0,40 C50,40 80,110 80,260Z" fill="${['#2F5240', '#5E1A2B', '#1F3C88', '#4A3A5A'][i % 4]}"/><path d="M-26,40 Q0,70 26,40 L20,90 Q0,100 -20,90Z" fill="#FBF8F0"/><circle cy="-10" r="38" fill="#E6B892"/>${[[-40, -20], [-44, 20], [40, -20], [44, 20], [-28, -46], [0, -54], [28, -46]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="20" fill="#5A3A22"/>`).join('')}</g>`;
}
