// ===== Law 1 cast: Nicolas Fouquet, Louis XIV, musketeer guard, modern boss & employee =====
// person({kind, x, y, s, expr, mouth, look:[x,y], blink, sweat, nod, tilt, flip, t})
// expr: neutral|smile|laugh|sad|worried|stern|angry|cold|proud|smirk
const KINDS = {
  fouquet:  { skin: '#E6B892', lite: '#F4CDA9', dark: '#C99470', iris: '#4A3020', rx: 88, hair: '#4A2E1E', hairL: '#7A5236' },
  louis:    { skin: '#EDC3A0', lite: '#F8D8BA', dark: '#D1A07C', iris: '#2E2016', rx: 86, hair: '#1E1612', hairL: '#4A3A30' },
  guard:    { skin: '#D9A47C', lite: '#EAB993', dark: '#B9845E', iris: '#3A2414', rx: 90, hair: '#2B1E16', hairL: '#4E3A2C' },
  boss:     { skin: '#B07548', lite: '#C98D5E', dark: '#8A5532', iris: '#3A2414', rx: 94, hair: '#3A3433', hairL: '#8A8381' },
  lady:     { skin: '#F0C8A6', lite: '#FADCC0', dark: '#D6A887', iris: '#3A5A7A', rx: 82, hair: '#8A5A2E', hairL: '#B98250' },
  courtier: { skin: '#E0B08A', lite: '#EEC6A2', dark: '#C08E6A', iris: '#2A1A10', rx: 86, hair: '#2A2420', hairL: '#55493F' },
  employee: { skin: '#B8805A', lite: '#D09A72', dark: '#946042', iris: '#2E1B10', rx: 86, hair: '#17110F', hairL: '#3A2A24' }
};
let _pid = 0;
function curls(pts, r, col, hl) { // chain of curls along points
  let s = '';
  pts.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`; });
  pts.forEach(([x, y], i) => { s += `<path d="M${x - r * .5},${y - r * .2} a${r * .5},${r * .5} 0 1 1 ${r * .7},${r * .5}" stroke="${hl}" stroke-width="${r * .18}" fill="none" stroke-linecap="round" opacity=".8"/>`; });
  return s;
}
function wigSide(sx, top, bottom, w, col, hl, r = 26) {
  const pts = [];
  for (let y = top; y <= bottom; y += r * 1.15) for (let c = 0; c < w; c++) pts.push([sx * (96 + c * r * 1.2 + ((y / r) % 2) * 6), y]);
  return curls(pts, r, col, hl);
}

function person(o) {
  const k = o.kind || 'fouquet', K = KINDS[k], id = 'p' + (_pid++);
  const { skin, lite, dark, iris, rx, hair, hairL } = K;
  const ry = 116, mouth = clamp(o.mouth || 0), expr = o.expr || 'neutral';
  const lx = (o.look ? o.look[0] : 0) * 7, ly = (o.look ? o.look[1] : 0) * 6;
  const bl = clamp(o.blink || 0), nod = o.nod || 0, tilt = o.tilt || 0;
  const angry = expr === 'angry';
  let s = `<defs>
    <radialGradient id="${id}sk" cx="38%" cy="35%" r="75%"><stop offset="0" stop-color="${lite}"/><stop offset=".55" stop-color="${skin}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
    <linearGradient id="${id}nk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${skin}"/></linearGradient>
    <linearGradient id="${id}cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
  </defs>`;
  const torso = (col, w = 220) => `<path d="M${-w},450 C${-w},300 ${-w + 30},212 -64,180 L64,180 C${w - 30},212 ${w},300 ${w},450 Z" fill="${col}"/>`;
  const shade = (w = 220) => `<path d="M${-w},450 C${-w},300 ${-w + 30},212 -64,180 L64,180 C${w - 30},212 ${w},300 ${w},450 Z" fill="url(#${id}cl)"/>`;
  const wig = k === 'fouquet' || k === 'louis';
  // ---------- wig back mass ----------
  if (wig) {
    const len = k === 'louis' ? 300 : 250, wd = k === 'louis' ? 3 : 2;
    s += wigSide(-1, -40, len, wd, hair, hairL, k === 'louis' ? 28 : 25) + wigSide(1, -40, len, wd, hair, hairL, k === 'louis' ? 28 : 25);
  }
  // ---------- body ----------
  if (k === 'fouquet') {
    s += torso('#5E1A2B', 225);
    s += `<path d="M-225,450 C-225,300 -195,212 -64,180 L-20,450Z" fill="#4C1422"/><path d="M225,450 C225,300 195,212 64,180 L20,450Z" fill="#4C1422"/>`;
    // gold embroidery
    for (const sx of [-1, 1]) s += `<path d="M${sx * 40},200 C${sx * 60},280 ${sx * 50},360 ${sx * 30},450" stroke="#D9A441" stroke-width="7" fill="none"/><path d="M${sx * 56},230 q${sx * 22},10 ${sx * 10},30 q${sx * -14},14 0,30 q${sx * 18},10 ${sx * 6},34" stroke="#D9A441" stroke-width="4" fill="none"/>` + [260, 320, 380, 430].map(y => `<circle cx="${sx * 36}" cy="${y}" r="7" fill="#F2C94C"/>`).join('');
    s += shade(225);
    // lace jabot
    s += `<path d="M-44,180 Q-56,230 -34,262 Q-50,290 -26,316 Q0,330 26,316 Q50,290 34,262 Q56,230 44,180Z" fill="#FBF8F0"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${-40 + i * 4},${210 + i * 30} Q0,${226 + i * 30} ${40 - i * 4},${210 + i * 30}" stroke="#D8D2C2" stroke-width="3" fill="none"/>`;
  } else if (k === 'louis') {
    s += torso('#1F3C88', 230);
    for (let i = 0; i < 14; i++) { const x = -170 + (i % 5) * 85 + (Math.floor(i / 5) % 2) * 40, y = 260 + Math.floor(i / 5) * 70; s += fleur(x, y, .5, '#E8B94A'); }
    s += shade(230);
    // ermine cape over shoulders
    s += `<path d="M-232,450 C-236,300 -210,220 -120,196 C-100,240 -110,330 -150,450Z" fill="#F7F4EE"/><path d="M232,450 C236,300 210,220 120,196 C100,240 110,330 150,450Z" fill="#F7F4EE"/>`;
    for (let i = 0; i < 10; i++) { const sx = i % 2 ? 1 : -1, y = 240 + Math.floor(i / 2) * 44; s += `<path d="M${sx * (170 - (i % 3) * 14)},${y} l-5,16 l5,-4 l5,4z" fill="#1A1A1A"/>`; }
    s += `<path d="M-120,196 C-60,190 60,190 120,196" stroke="#E8B94A" stroke-width="10" fill="none"/>`;
    s += `<path d="M-40,180 Q-52,226 -30,256 Q0,270 30,256 Q52,226 40,180Z" fill="#FBF8F0"/><path d="M-36,214 Q0,230 36,214 M-30,240 Q0,254 30,240" stroke="#D8D2C2" stroke-width="3" fill="none"/>`;
    s += `<rect x="-14" y="300" width="28" height="28" rx="4" fill="#E8B94A" transform="rotate(45 0 314)"/>`; // order medal
  } else if (k === 'guard') {
    s += torso('#2C3E7A', 225);
    s += `<path d="M-130,190 L130,190 L120,450 L-120,450Z" fill="#2F56B0"/><path d="M-20,210 h40 v80 h70 v40 h-70 v120 h-40 v-120 h-70 v-40 h70z" fill="#F4F1E8"/>`;
    s += `<path d="M-130,190 L130,190 L120,450 L-120,450Z" fill="none" stroke="#C9A646" stroke-width="8"/>`;
    s += shade(225);
    s += `<path d="M-50,180 Q0,214 50,180 L44,170 Q0,200 -44,170Z" fill="#F4F1E8"/>`;
  } else if (k === 'boss') {
    s += torso('#4A4F5C', 228);
    s += `<path d="M-62,180 L0,310 L62,180Z" fill="#F7F7F4"/><path d="M-12,214 L12,214 L20,330 L0,360 L-20,330Z" fill="#8C2A3A"/><path d="M-12,198 L12,198 L9,216 L-9,216Z" fill="#6E1F2D"/>`;
    s += `<path d="M-64,180 L-8,330 L-44,450 L-84,450 L-112,250Z" fill="#3E4350"/><path d="M64,180 L8,330 L44,450 L84,450 L112,250Z" fill="#3E4350"/>`;
    s += shade(228);
  } else if (k === 'lady') {
    s += torso('#D97A8E', 200);
    s += `<path d="M-200,450 C-200,320 -170,236 -70,196 Q0,250 70,196 C170,236 200,320 200,450Z" fill="#C4627A"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${-150 + i * 60},300 q10,20 0,40 q-10,20 0,40" stroke="#F4C3CE" stroke-width="5" fill="none" opacity=".7"/>`;
    s += shade(200);
    s += `<path d="M-70,196 Q0,250 70,196" stroke="#FBF8F0" stroke-width="16" fill="none"/>`;
    s += [-36, -18, 0, 18, 36].map((x, i) => `<circle cx="${x}" cy="${206 + Math.abs(x) * -.3 + 22}" r="8" fill="#FFF8EA" stroke="#E0D6C2" stroke-width="2"/>`).join('');
  } else if (k === 'courtier') {
    s += torso('#1E1E24', 222);
    s += `<path d="M-222,450 C-222,300 -192,212 -64,180 L-16,450Z" fill="#17171C"/>`;
    s += shade(222);
    s += `<path d="M-110,186 Q0,236 110,186 L96,226 Q0,268 -96,226Z" fill="#F4F1E8"/><path d="M0,236 v40" stroke="#D8D2C2" stroke-width="4"/>`;
    s += [300, 360, 420].map(y => `<circle cx="0" cy="${y}" r="6" fill="#55493F"/>`).join('');
  } else if (k === 'employee') {
    s += torso('#9CC3E0', 210);
    s += `<path d="M-8,190 L8,190 L8,450 L-8,450Z" fill="#88B2D2"/>` + [240, 300, 360, 420].map(y => `<circle cx="0" cy="${y}" r="5" fill="#fff"/>`).join('');
    s += `<path d="M-50,186 L-24,330 M50,186 L24,330" stroke="${C.teal}" stroke-width="7"/><rect x="-36" y="330" width="72" height="90" rx="8" fill="#fff" stroke="${C.teal}" stroke-width="5"/><rect x="-24" y="346" width="48" height="10" rx="5" fill="${C.teal}"/><circle cx="0" cy="388" r="14" fill="#CFD8E3"/>`;
    s += shade(210);
  }
  // neck
  s += `<path d="M-34,78 L34,78 L38,190 Q0,204 -38,190 Z" fill="url(#${id}nk)"/><path d="M-36,94 Q0,138 36,94 L36,118 Q0,148 -36,118Z" fill="${dark}" opacity=".5"/>`;
  if (k === 'boss') s += `<path d="M-62,182 L-42,152 L-4,208 L-28,218Z" fill="#fff"/><path d="M62,182 L42,152 L4,208 L28,218Z" fill="#fff"/>`;
  if (k === 'employee') s += `<path d="M-58,184 L-38,154 L-2,206 L-28,216Z" fill="#B5D3EA"/><path d="M58,184 L38,154 L2,206 L28,216Z" fill="#B5D3EA"/>`;
  if (k === 'fouquet' || k === 'louis') s += `<path d="M-46,176 Q0,206 46,176 L46,192 Q0,224 -46,192Z" fill="#FBF8F0"/>`;

  // ---------- head ----------
  let h = '';
  for (const sx of [-1, 1]) if (!wig && k !== 'lady') h += `<g transform="translate(${sx * rx},8) scale(${sx},1)"><ellipse rx="16" ry="25" fill="${skin}"/><path d="M-4,-14 Q8,-6 2,10" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  h += `<path d="M${-rx + 2},-28 C${-rx},${-ry} -52,${-ry - 12} 0,${-ry - 12} C52,${-ry - 12} ${rx},${-ry} ${rx - 2},-28 C${rx - 2},34 ${rx * .78},${ry - 14} 14,${ry} Q0,${ry + 3} -14,${ry} C${-rx * .78},${ry - 14} ${-rx + 2},34 ${-rx + 2},-28Z" fill="url(#${id}sk)"/>`;
  h += `<path d="M${rx * .7},-96 C${rx * .98},-56 ${rx},14 ${rx * .74},74 C${rx * .86},20 ${rx * .84},-44 ${rx * .7},-96Z" fill="${dark}" opacity=".38"/>`;
  // hair / wig top
  if (wig) {
    const R = k === 'louis' ? 30 : 27;
    const top = [];
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; top.push([Math.cos(a) * (rx + 10), -30 + Math.sin(a) * (ry + 6)]); }
    if (k === 'louis') for (let i = 1; i < 8; i++) { const a = Math.PI + i * Math.PI / 8; top.push([Math.cos(a) * (rx + 34), -40 + Math.sin(a) * (ry + 36)]); }
    h += `<path d="M${-rx - 4},-10 C${-rx - 10},-110 -50,-${ry + 30} 0,-${ry + 30} C50,-${ry + 30} ${rx + 10},-110 ${rx + 4},-10 C${rx - 10},-60 60,-92 0,-96 C-60,-92 ${-rx + 10},-60 ${-rx - 4},-10Z" fill="${hair}"/>`;
    h += curls(top, R, hair, hairL);
    h += `<path d="M-6,-${ry + 14} C-30,-100 -50,-90 -70,-60" stroke="${hairL}" stroke-width="5" fill="none" opacity=".7"/>`;
  } else if (k === 'lady') {
    h += `<path d="M${-rx - 6},20 C${-rx - 14},-90 -50,-${ry + 20} 0,-${ry + 20} C50,-${ry + 20} ${rx + 14},-90 ${rx + 6},20 C${rx},-40 70,-80 0,-86 C-70,-80 ${-rx},-40 ${-rx - 6},20Z" fill="${hair}"/>`;
    h += curls([[-60, -150], [-20, -170], [20, -170], [60, -150], [-40, -195], [0, -205], [40, -195]], 26, hair, hairL);
    h += curls([[-rx - 6, 10], [-rx - 2, 50], [rx + 6, 10], [rx + 2, 50]], 18, hair, hairL);
    h += `<path d="M-70,-150 Q0,-120 70,-150" stroke="#2A9D8F" stroke-width="10" fill="none"/><circle cx="70" cy="-150" r="12" fill="#2A9D8F"/><circle cx="0" cy="-212" r="10" fill="#FFF8EA"/>`;
    h += `<circle cx="${-rx + 2}" cy="40" r="8" fill="#FFF8EA"/><circle cx="${rx - 2}" cy="40" r="8" fill="#FFF8EA"/>`;
  } else if (k === 'courtier') {
    h += `<path d="M${-rx - 8},60 C${-rx - 14},-80 -50,-${ry + 14} 0,-${ry + 14} C50,-${ry + 14} ${rx + 14},-80 ${rx + 8},60 C${rx},0 ${rx - 10},-60 30,-86 C0,-90 -40,-80 ${-rx + 10},-50 C${-rx},-10 ${-rx - 4},30 ${-rx - 8},60Z" fill="${hair}"/>`;
    h += `<path d="M-20,-${ry + 10} C-50,-90 -76,-60 -86,0 M20,-${ry + 10} C50,-90 76,-60 86,0" stroke="${hairL}" stroke-width="5" fill="none"/>`;
  } else if (k === 'guard') {
    h += `<path d="M${-rx - 4},0 C${-rx - 8},-80 -50,-120 0,-120 C50,-120 ${rx + 8},-80 ${rx + 4},0 C${rx - 10},-50 60,-74 0,-78 C-60,-74 ${-rx + 10},-50 ${-rx - 4},0Z" fill="${hair}"/>`;
    // plumed wide hat
    h += `<ellipse cx="0" cy="-104" rx="190" ry="34" fill="#1B1B22"/><path d="M-100,-104 C-100,-180 100,-180 100,-104Z" fill="#23232C"/><rect x="-100" y="-122" width="200" height="16" fill="#C9A646"/>`;
    h += `<path d="M60,-150 C140,-230 220,-170 200,-110 C180,-150 120,-170 60,-150Z" fill="#F4F1E8"/><path d="M80,-150 C140,-200 190,-170 190,-130" stroke="#D8D2C2" stroke-width="4" fill="none"/>`;
  } else if (k === 'boss') {
    h += `<path d="M${-rx - 4},-6 C${-rx - 8},-90 -50,-${ry + 16} 0,-${ry + 16} C50,-${ry + 16} ${rx + 8},-90 ${rx + 4},-6 C${rx - 4},-56 76,-80 30,-88 C-10,-94 -60,-76 ${-rx + 8},-40Z" fill="${hair}"/>`;
    h += `<path d="M${-rx - 2},-20 C${-rx - 4},-50 -84,-70 -70,-84 M${rx + 2},-20 C${rx + 4},-50 84,-70 70,-84" stroke="${hairL}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  } else if (k === 'employee') {
    h += `<path d="M${-rx - 6},0 C${-rx - 12},-92 -50,-136 4,-134 C64,-134 ${rx + 12},-90 ${rx + 6},0 C${rx},-44 74,-76 40,-86 C10,-70 -30,-96 -60,-80 C-76,-66 ${-rx},-40 ${-rx - 6},0Z" fill="${hair}"/><path d="M-40,-112 C0,-130 40,-128 70,-104" stroke="${hairL}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  // brows
  let bi = 0, bo = 0;
  if (expr === 'worried' || expr === 'sad') { bi = -11; bo = 5; }
  if (expr === 'smile' || expr === 'laugh' || expr === 'proud') { bi = -6; bo = -6; }
  if (expr === 'stern' || expr === 'cold') { bi = 7; bo = -2; }
  if (expr === 'smirk') { bi = 2; bo = -4; }
  if (angry) { bi = 15; bo = -8; }
  const bc = k === 'boss' ? '#4A4442' : k === 'lady' ? '#6E4524' : hair;
  for (const sx of [-1, 1]) h += `<path d="M${sx * 60},${-44 + bo} Q${sx * 40},${-57 + (bo + bi) / 2} ${sx * 17},${-47 + bi}" stroke="${bc}" stroke-width="${wig ? 8 : 10}" fill="none" stroke-linecap="round"/>`;
  // eyes
  const closed = expr === 'laugh';
  for (const ex of [-36, 36]) {
    if (closed) { h += `<path d="M${ex - 16},-8 Q${ex},-25 ${ex + 16},-8" stroke="#2A1A12" stroke-width="7" fill="none" stroke-linecap="round"/>`; continue; }
    const er = (angry || expr === 'cold') ? 11 : expr === 'proud' ? 12 : 15, ery = er * (1 - bl);
    if (ery < 3) { h += `<path d="M${ex - 17},-6 Q${ex},1 ${ex + 17},-6" stroke="#2A1A12" stroke-width="6" fill="none" stroke-linecap="round"/>`; continue; }
    const cid = `${id}e${ex}`;
    h += `<path d="M${ex - 22},-24 Q${ex},-34 ${ex + 22},-24" stroke="${dark}" stroke-width="4" fill="none" opacity=".6"/>`;
    h += `<ellipse cx="${ex}" cy="-8" rx="18" ry="${ery}" fill="#FBF8F3"/><clipPath id="${cid}"><ellipse cx="${ex}" cy="-8" rx="18" ry="${ery}"/></clipPath>`;
    h += `<g clip-path="url(#${cid})"><circle cx="${ex + lx}" cy="${-6 + ly}" r="11" fill="${iris}"/><circle cx="${ex + lx}" cy="${-6 + ly}" r="11" fill="none" stroke="#120A06" stroke-width="2.5"/><circle cx="${ex + lx}" cy="${-6 + ly}" r="5.5" fill="#0B0604"/><circle cx="${ex + lx + 4}" cy="${-11 + ly}" r="3.4" fill="#fff"/><circle cx="${ex + lx - 4}" cy="${-2 + ly}" r="1.6" fill="#fff" opacity=".8"/><rect x="${ex - 20}" y="${-8 - ery - 2}" width="40" height="5" fill="${dark}" opacity=".35"/></g>`;
    h += `<path d="M${ex - 19},-8 Q${ex - 18},${-8 - ery - 1} ${ex},${-8 - ery - 1} Q${ex + 18},${-8 - ery - 1} ${ex + 19},-8" stroke="#1C110B" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    h += `<path d="M${ex - 12},${-8 + ery} Q${ex},${-8 + ery + 3} ${ex + 12},${-8 + ery}" stroke="${dark}" stroke-width="2.5" fill="none" opacity=".6"/>`;
    if (expr === 'worried' || expr === 'sad') h += `<path d="M${ex - 20},${-8 - ery + 1} L${ex + 20},${-8 - ery + 1}" stroke="${skin}" stroke-width="5"/>`;
    if (angry || expr === 'cold') h += `<path d="M${ex - 22},${-8 - ery + (ex < 0 ? -3 : 7)} L${ex + 22},${-8 - ery + (ex < 0 ? 7 : -3)}" stroke="${skin}" stroke-width="${angry ? 9 : 6}"/>`;
  }
  if (k === 'boss') h += `<rect x="-62" y="-30" width="50" height="40" rx="10" fill="#fff" fill-opacity=".08" stroke="#2C2C34" stroke-width="5"/><rect x="12" y="-30" width="50" height="40" rx="10" fill="#fff" fill-opacity=".08" stroke="#2C2C34" stroke-width="5"/><path d="M-12,-14 h24" stroke="#2C2C34" stroke-width="5"/>`;
  // nose
  h += `<path d="M6,-6 Q14,26 10,36 Q0,46 -10,38" fill="${dark}" opacity=".32"/><path d="M2,2 Q14,32 2,42 Q-8,44 -15,38" stroke="${dark}" stroke-width="5.5" fill="none" stroke-linecap="round"/><ellipse cx="-8" cy="40" rx="5" ry="3" fill="#2A140C" opacity=".45"/><ellipse cx="12" cy="40" rx="5" ry="3" fill="#2A140C" opacity=".45"/>`;
  if (expr === 'smile' || expr === 'laugh' || expr === 'proud') h += `<ellipse cx="-54" cy="34" rx="16" ry="9" fill="#E2735E" opacity=".3"/><ellipse cx="54" cy="34" rx="16" ry="9" fill="#E2735E" opacity=".3"/>`;
  if (angry) h += `<ellipse cx="-54" cy="28" rx="20" ry="11" fill="#D8483A" opacity=".3"/><ellipse cx="54" cy="28" rx="20" ry="11" fill="#D8483A" opacity=".3"/>`;
  // mouth
  const my = 72;
  if (mouth > .08) {
    const mry = 4 + mouth * 16, mrx = 17 + mouth * 3;
    if (expr === 'smile' || expr === 'laugh' || expr === 'proud') {
      h += `<path d="M${-mrx - 5},${my - 4} Q0,${my - 9} ${mrx + 5},${my - 4} Q${mrx},${my + mry * 1.6} 0,${my + mry * 1.7} Q${-mrx},${my + mry * 1.6} ${-mrx - 5},${my - 4}Z" fill="#4E1916"/><path d="M${-mrx + 2},${my - 3} L${mrx - 2},${my - 3} L${mrx - 6},${my + 4} L${-mrx + 6},${my + 4}Z" fill="#fff"/><ellipse cx="0" cy="${my + mry * 1.25}" rx="${mrx * .55}" ry="${mry * .35}" fill="#C65B52"/>`;
    } else {
      h += `<ellipse cx="0" cy="${my + mry * .4}" rx="${mrx}" ry="${mry}" fill="#4E1916"/><ellipse cx="0" cy="${my + mry}" rx="${mrx * .6}" ry="${mry * .4}" fill="#C65B52"/>`;
      if (mouth > .4) h += `<rect x="${-mrx * .7}" y="${my + mry * .4 - mry}" width="${mrx * 1.4}" height="5" rx="2" fill="#fff"/>`;
    }
  } else {
    const c = { smile: 12, laugh: 14, proud: 10, neutral: 2, sad: -10, worried: -6, stern: -3, cold: -4, angry: -9, smirk: 6 }[expr] ?? 2;
    if (expr === 'smirk' || expr === 'proud') h += `<path d="M-20,${my + 2} Q4,${my + 8} 24,${my - 8}" stroke="#5A1F1C" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    else h += `<path d="M-21,${my} Q0,${my + c} 21,${my}" stroke="#4E1916" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    h += `<path d="M-10,${my + 12 + Math.max(0, c) * .5} Q0,${my + 16 + Math.max(0, c) * .5} 10,${my + 12 + Math.max(0, c) * .5}" stroke="${dark}" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>`;
  }
  // facial hair
  if (k === 'fouquet') h += `<path d="M-30,56 Q-16,48 -2,54 M30,56 Q16,48 2,54" stroke="${hair}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-6,${my + 22} q6,12 12,0" fill="${hair}"/>`;
  if (k === 'louis') h += `<path d="M-24,56 Q-12,50 -2,54 M24,56 Q12,50 2,54" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (k === 'courtier') h += `<path d="M-30,56 Q-14,50 -2,56 M30,56 Q14,50 2,56" stroke="${hair}" stroke-width="5" fill="none"/><path d="M-8,${my + 20} L0,${my + 40} L8,${my + 20}Z" fill="${hair}"/>`;
  if (k === 'lady') h += `<circle cx="34" cy="40" r="3" fill="#3A2416"/>`;
  if (k === 'guard') h += `<path d="M-44,58 Q-22,40 0,50 Q22,40 44,58 Q24,56 0,58 Q-24,56 -44,58Z" fill="${hair}"/><path d="M-12,${my + 20} L0,${my + 46} L12,${my + 20}Z" fill="${hair}"/>`;
  if (o.sweat) { const sy = -70 + ((o.t || 0) * 26 % 60); h += `<g opacity="${clamp(o.sweat)}"><path d="M${rx - 20},${sy - 18} C${rx - 12},${sy - 4} ${rx - 6},${sy + 6} ${rx - 20},${sy + 12} C${rx - 34},${sy + 6} ${rx - 28},${sy - 4} ${rx - 20},${sy - 18}Z" fill="#9BD8F2" stroke="#fff" stroke-width="3"/></g>`; }
  // front wig locks over shoulders
  if (wig) { const len = k === 'louis' ? 300 : 240; h += curls([[-rx - 6, 30], [-rx - 4, 80], [-rx + 2, 130], [-rx + 8, 180], [rx + 6, 30], [rx + 4, 80], [rx - 2, 130], [rx - 8, 180]].filter(p => p[1] < len), k === 'louis' ? 26 : 23, hair, hairL); }
  if (k === 'louis' && o.crown !== false) h += crown(0, -ry - 52, .8);
  s += `<g transform="translate(0,${nod * 6}) rotate(${tilt + nod * .6})">${h}</g>`;
  const sc = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.flip ? -sc : sc},${sc})">${s}</g>`;
}
function fleur(x, y, s, col) {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${col}"><path d="M0,-34 C14,-20 14,-4 0,10 C-14,-4 -14,-20 0,-34Z"/><path d="M-6,4 C-30,-10 -40,10 -24,20 C-18,10 -12,8 -6,10Z"/><path d="M6,4 C30,-10 40,10 24,20 C18,10 12,8 6,10Z"/><rect x="-18" y="12" width="36" height="7" rx="3"/><path d="M-4,19 L4,19 L0,34Z"/></g>`;
}
function crown(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70,30 L-80,-30 L-40,0 L0,-46 L40,0 L80,-30 L70,30Z" fill="#E8B94A" stroke="#B8862B" stroke-width="5"/><rect x="-72" y="22" width="144" height="22" rx="6" fill="#D9A441"/><circle cx="0" cy="-46" r="9" fill="#E85D4A"/><circle cx="-80" cy="-30" r="7" fill="#2A9D8F"/><circle cx="80" cy="-30" r="7" fill="#2A9D8F"/><circle cx="0" cy="33" r="7" fill="#2A9D8F"/></g>`;
}
