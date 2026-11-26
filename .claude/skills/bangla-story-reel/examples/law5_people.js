// ===== Law 5 cast (pro shading pass): Jamal Saheb, rude customer, waiter boy, daughter =====
// person({kind, x, y, s, expr, mouth, look:[x,y], blink, sweat, anger, nod, tilt, flip, t})
// expr: neutral|smile|laugh|sad|worried|stern|angry|shout|calm|smirk
const KINDS = {
  jamal:    { skin: '#B07548', lite: '#C98D5E', dark: '#8A5532', lip: '#7A3B2C', iris: '#4A2C1A', rx: 100, jaw: 1.0 },
  customer: { skin: '#C58A5C', lite: '#DBA273', dark: '#9E673E', lip: '#8C4636', iris: '#3A2414', rx: 90, jaw: .95 },
  waiter:   { skin: '#8F5B3A', lite: '#A8714B', dark: '#6E4229', lip: '#6B3328', iris: '#2E1B10', rx: 84, jaw: .9 },
  daughter: { skin: '#C68C62', lite: '#DDA67B', dark: '#A26C45', lip: '#B4574D', iris: '#3B2416', rx: 86, jaw: .88 }
};
let _pid = 0;

function person(o) {
  const k = o.kind || 'jamal', K = KINDS[k], id = 'p' + (_pid++);
  const { skin, lite, dark, lip, iris, rx } = K;
  const ry = 118;
  const mouth = clamp(o.mouth || 0), expr = o.expr || 'neutral';
  const lx = (o.look ? o.look[0] : 0) * 7, ly = (o.look ? o.look[1] : 0) * 6;
  const bl = clamp(o.blink || 0), nod = o.nod || 0, tilt = o.tilt || 0;
  const angry = expr === 'angry' || expr === 'shout';
  let s = `<defs>
    <radialGradient id="${id}sk" cx="38%" cy="35%" r="75%"><stop offset="0" stop-color="${lite}"/><stop offset=".55" stop-color="${skin}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
    <linearGradient id="${id}nk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${skin}"/></linearGradient>
    <linearGradient id="${id}cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  </defs>`;

  // ================= BODY =================
  const torso = (col, w = 220) => `<path d="M${-w},450 C${-w},300 ${-w + 30},212 -64,180 L64,180 C${w - 30},212 ${w},300 ${w},450 Z" fill="${col}"/>`;
  const sleeves = (col, w = 220) => `<path d="M${-w},450 C${-w},330 ${-w + 14},262 ${-w + 46},232 C${-w + 70},300 ${-w + 80},380 ${-w + 76},450Z" fill="${col}"/><path d="M${w},450 C${w},330 ${w - 14},262 ${w - 46},232 C${w - 70},300 ${w - 80},380 ${w - 76},450Z" fill="${col}"/>`;
  const SW = { jamal: 230, customer: 218, waiter: 205, daughter: 205 }[k];
  const shade = `<path d="M${-SW},450 C${-SW},300 ${-SW + 30},212 -64,180 L64,180 C${SW - 30},212 ${SW},300 ${SW},450 Z" fill="url(#${id}cl)"/>`;
  if (k === 'daughter') {
    // hair mass behind shoulders
    s += `<path d="M-108,-40 C-130,60 -134,170 -116,250 Q-104,276 -74,268 L74,268 Q104,276 116,250 C134,170 130,60 108,-40Z" fill="#17110F"/>`;
    s += `<path d="M-100,40 C-112,120 -110,190 -96,240" stroke="#3A2A24" stroke-width="5" fill="none" opacity=".7"/><path d="M100,40 C112,120 110,190 96,240" stroke="#3A2A24" stroke-width="5" fill="none" opacity=".7"/>`;
  }
  if (k === 'jamal') {
    s += torso('#F3EFE6', 230) + sleeves('#E4DED1', 230);
    s += `<path d="M-120,300 C-110,360 -112,410 -118,450 M110,300 C104,360 108,410 112,450 M-60,330 Q-40,380 -56,450" stroke="#D6CFBF" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M-8,186 L8,186 L10,340 L-10,340Z" fill="#E2DBCB"/>` + [228, 272, 316].map(y => `<circle cx="0" cy="${y}" r="6" fill="#BDB29C"/><circle cx="-1.5" cy="${y - 1.5}" r="2" fill="#fff" opacity=".7"/>`).join('');
    s += `<rect x="-150" y="290" width="60" height="70" rx="6" fill="none" stroke="#D6CFBF" stroke-width="5"/>`;
    s += shade;
    // gamchha: plaid with shading
    s += `<clipPath id="${id}g"><path d="M56,180 C124,184 176,204 196,256 L162,450 L96,450 L124,268 C104,226 82,208 46,198Z"/></clipPath>`;
    s += `<g clip-path="url(#${id}g)"><rect x="40" y="170" width="170" height="290" fill="#2E8A66"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="${40 + i * 20}" y="170" width="7" height="290" fill="#F2C94C" opacity=".55"/><rect x="40" y="${176 + i * 32}" width="170" height="7" fill="#F2C94C" opacity=".45"/><rect x="${48 + i * 20}" y="170" width="3" height="290" fill="#D9473B" opacity=".5"/>`;
    s += `<rect x="40" y="170" width="170" height="290" fill="url(#${id}cl)"/></g>`;
    s += `<path d="M120,262 C142,320 140,390 130,450" stroke="#1F6B4E" stroke-width="5" fill="none" opacity=".6"/>`;
  } else if (k === 'customer') {
    s += torso('#8B1F33', 218) + sleeves('#741629', 218);
    s += `<path d="M-64,180 L-4,262 L-4,450 L4,450 L4,262 L64,180 L44,170 L0,226 L-44,170Z" fill="#6A1424"/>`;
    s += `<path d="M-34,180 L0,258 L34,180Z" fill="url(#${id}nk)"/>`;
    s += `<path d="M-40,196 Q0,270 40,196" stroke="#E8B94A" stroke-width="7" fill="none"/><path d="M-40,196 Q0,270 40,196" stroke="#FFF1B8" stroke-width="2" fill="none" stroke-dasharray="4 8"/><circle cx="0" cy="238" r="9" fill="#E8B94A"/>`;
    s += `<path d="M-120,300 C-110,350 -114,410 -120,450 M118,300 C112,350 116,410 120,450" stroke="#6A1424" stroke-width="5" fill="none"/>`;
    s += `<rect x="70" y="290" width="60" height="64" rx="6" fill="none" stroke="#6A1424" stroke-width="5"/>`;
    s += shade;
  } else if (k === 'waiter') {
    s += torso('#FBFBF8', 205) + sleeves('#ECECE6', 205);
    s += `<path d="M-205,450 C-205,300 -176,212 -64,180 L-14,330 L-22,450Z" fill="#202634"/><path d="M205,450 C205,300 176,212 64,180 L14,330 L22,450Z" fill="#202634"/>`;
    s += `<path d="M-160,240 C-140,320 -130,400 -132,450 M160,240 C140,320 130,400 132,450" stroke="#2C3446" stroke-width="5" fill="none"/>`;
    s += [350, 400].map(y => `<circle cx="-18" cy="${y}" r="6" fill="#B9A06A"/>`).join('');
    s += `<path d="M-14,188 L14,188 L0,214Z" fill="#202634"/>`;
    s += shade;
    s += `<path d="M-150,206 C-110,190 -70,186 -46,192 L-78,340 C-100,346 -130,344 -150,336Z" fill="#EFE7D6"/><path d="M-146,250 Q-110,244 -70,250 M-148,296 Q-110,290 -74,296" stroke="#CDBE9F" stroke-width="5" fill="none"/>`;
  } else if (k === 'daughter') {
    s += torso('#E3A23A', 205) + sleeves('#C98A26', 205);
    for (let i = 0; i < 5; i++) s += `<circle cx="${-120 + i * 60}" cy="${390 - (i % 2) * 30}" r="9" fill="#F8D27A" opacity=".8"/>`; // print dots
    s += `<path d="M-44,180 Q0,240 44,180" fill="url(#${id}nk)"/><path d="M-44,180 Q0,240 44,180" stroke="#C98A26" stroke-width="5" fill="none"/>`;
    s += shade;
    // orna (dupatta) draped: over left shoulder across chest
    s += `<path d="M-205,330 C-140,290 -60,320 20,292 C100,262 150,280 205,262 L205,350 C150,372 100,350 20,380 C-60,410 -140,372 -205,412Z" fill="#2A9D8F"/>`;
    s += `<path d="M-205,330 C-140,290 -60,320 20,292 C100,262 150,280 205,262" stroke="#58C2B4" stroke-width="5" fill="none"/>`;
    s += `<path d="M100,182 C160,200 196,248 205,300 L176,312 C164,262 142,224 96,204Z" fill="#23857A"/>`;
    s += `<path d="M-205,370 C-120,350 -40,370 40,345" stroke="#1E7A6F" stroke-width="4" fill="none" opacity=".7"/>`;
  }
  // neck with jaw shadow
  s += `<path d="M-36,78 L36,78 L40,192 Q0,206 -40,192 Z" fill="url(#${id}nk)"/>`;
  s += `<path d="M-38,96 Q0,140 38,96 L38,120 Q0,150 -38,120Z" fill="${dark}" opacity=".55"/>`;
  if (k === 'jamal') s += `<path d="M-52,184 Q0,220 52,184 L46,172 Q0,204 -46,172Z" fill="#E6E0D2"/>`;
  if (k === 'waiter') s += `<path d="M-58,184 L-38,156 L-2,210 L-28,220Z" fill="#fff"/><path d="M58,184 L38,156 L2,210 L28,220Z" fill="#fff"/><path d="M-58,184 L-28,220 M58,184 L28,220" stroke="#DADAD2" stroke-width="3"/>`;
  if (k === 'customer') s += `<path d="M-64,182 L-46,150 L-6,206 L-32,218Z" fill="#A12C42"/><path d="M64,182 L46,150 L6,206 L32,218Z" fill="#A12C42"/>`;

  // ================= HEAD =================
  let h = '';
  // ears
  for (const sx of [-1, 1]) h += `<g transform="translate(${sx * rx},8) scale(${sx},1)"><ellipse rx="17" ry="26" fill="${skin}"/><path d="M-4,-14 Q8,-6 2,10" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  if (k === 'daughter') h += `<g fill="#E8B94A"><circle cx="${-rx - 2}" cy="38" r="7"/><circle cx="${rx + 2}" cy="38" r="7"/><path d="M${-rx - 2},45 l-6,16 h12z M${rx + 2},45 l-6,16 h12z"/></g>`;
  // face
  const jw = K.jaw;
  h += `<path d="M${-rx + 2},-28 C${-rx},${-ry} -52,${-ry - 12} 0,${-ry - 12} C52,${-ry - 12} ${rx},${-ry} ${rx - 2},-28 C${rx - 2},34 ${rx * .8 * jw},${ry - 14} 14,${ry} Q0,${ry + 3} -14,${ry} C${-rx * .8 * jw},${ry - 14} ${-rx + 2},34 ${-rx + 2},-28Z" fill="url(#${id}sk)"/>`;
  // rim shade right side + cheekbone light
  h += `<path d="M${rx * .7},-96 C${rx * .98},-56 ${rx},14 ${rx * .74},74 C${rx * .86},20 ${rx * .84},-44 ${rx * .7},-96Z" fill="${dark}" opacity=".4"/>`;
  h += `<ellipse cx="-46" cy="22" rx="22" ry="12" fill="#fff" opacity=".08"/>`;
  // ---- hair ----
  if (k === 'jamal') {
    h += `<path d="M${-rx - 5},-2 C${-rx - 10},-58 ${-rx + 6},-98 -52,-110 C-44,-84 -70,-60 ${-rx + 14},-18Z" fill="#5E5856"/><path d="M${rx + 5},-2 C${rx + 10},-58 ${rx - 6},-98 52,-110 C44,-84 70,-60 ${rx - 14},-18Z" fill="#5E5856"/>`;
    h += `<path d="M${-rx - 2},-30 C${-rx - 2},-60 -84,-80 -66,-92 M${rx + 2},-30 C${rx + 2},-60 84,-80 66,-92" stroke="#9B9592" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    h += `<path d="M-40,-124 C-10,-134 22,-134 46,-124 C20,-128 -10,-128 -40,-124Z" fill="#5E5856" opacity=".5"/>`;
    h += `<ellipse cx="-30" cy="-100" rx="28" ry="10" fill="#fff" opacity=".22" transform="rotate(-10 -30 -100)"/>`;
  } else if (k === 'customer') {
    h += `<path d="M${-rx - 6},-6 C${-rx - 14},-100 -62,-152 2,-152 C36,-172 96,-160 104,-118 C${rx + 14},-78 ${rx + 4},-40 ${rx + 4},-6 C${rx - 6},-60 72,-86 40,-92 C0,-98 -52,-82 ${-rx + 6},-38Z" fill="#141112"/>`;
    h += `<path d="M-6,-150 C24,-182 76,-178 100,-140 C66,-162 32,-160 -6,-150Z" fill="#141112"/><path d="M-40,-128 C-10,-150 40,-156 80,-136" stroke="#3B3436" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-60,-104 C-40,-124 0,-132 30,-128" stroke="#3B3436" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    h += `<g transform="translate(0,-114)"><rect x="-76" y="-18" width="64" height="34" rx="15" fill="#15161B"/><rect x="12" y="-18" width="64" height="34" rx="15" fill="#15161B"/><path d="M-12,-6 h24" stroke="#15161B" stroke-width="6"/><path d="M-66,-10 l22,0 M22,-10 l22,0" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/></g>`;
  } else if (k === 'waiter') {
    h += `<path d="M${-rx - 6},4 C${-rx - 12},-90 -50,-134 0,-132 C60,-134 ${rx + 12},-90 ${rx + 6},4 C${rx},-38 72,-70 52,-76 L42,-56 L30,-80 L12,-58 L0,-84 L-16,-58 L-32,-82 L-46,-56 L-58,-76 C-72,-60 ${-rx},-38 ${-rx - 6},4Z" fill="#191514"/>`;
    h += `<path d="M-50,-112 C-20,-128 30,-128 60,-108" stroke="#3A302C" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  } else if (k === 'daughter') {
    h += `<path d="M${-rx - 12},44 C${-rx - 22},-90 -52,-142 0,-140 C52,-142 ${rx + 22},-90 ${rx + 12},44 C${rx + 2},-20 ${rx - 8},-72 42,-94 C22,-82 6,-98 0,-106 C-6,-98 -22,-82 -42,-94 C${-rx + 8},-72 ${-rx - 2},-20 ${-rx - 12},44Z" fill="#17110F"/>`;
    h += `<path d="M-6,-128 C-40,-120 -70,-90 -82,-40 M6,-128 C40,-120 70,-90 82,-40" stroke="#4A3A33" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
  }
  // ---- brows ----
  let bi = 0, bo = 0;
  if (expr === 'worried' || expr === 'sad') { bi = -11; bo = 5; }
  if (expr === 'smile' || expr === 'laugh') { bi = -6; bo = -6; }
  if (expr === 'stern' || expr === 'calm') { bi = 4; bo = -2; }
  if (expr === 'smirk') { bi = 2; bo = -4; }
  if (angry) { bi = 15; bo = -8; }
  const bw = k === 'daughter' ? 7 : k === 'jamal' ? 12 : 10;
  const bc = k === 'jamal' ? '#4A4442' : '#1A1414';
  for (const sx of [-1, 1]) h += `<path d="M${sx * 62},${-44 + bo} Q${sx * 40},${-58 + (bo + bi) / 2} ${sx * 17},${-47 + bi}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  // ---- eyes ----
  const closed = expr === 'laugh';
  for (const ex of [-37, 37]) {
    if (closed) { h += `<path d="M${ex - 16},-8 Q${ex},-25 ${ex + 16},-8" stroke="#2A1A12" stroke-width="7" fill="none" stroke-linecap="round"/>`; continue; }
    const er = angry ? 12 : 15, ery = er * (1 - bl);
    if (ery < 3) { h += `<path d="M${ex - 17},-6 Q${ex},1 ${ex + 17},-6" stroke="#2A1A12" stroke-width="6" fill="none" stroke-linecap="round"/>`; continue; }
    const cid = `${id}e${ex}`;
    h += `<path d="M${ex - 22},-24 Q${ex},-34 ${ex + 22},-24" stroke="${dark}" stroke-width="4" fill="none" opacity=".6"/>`;          // crease
    h += `<ellipse cx="${ex}" cy="-8" rx="18" ry="${ery}" fill="#FBF8F3"/>`;
    h += `<clipPath id="${cid}"><ellipse cx="${ex}" cy="-8" rx="18" ry="${ery}"/></clipPath>`;
    h += `<g clip-path="url(#${cid})"><circle cx="${ex + lx}" cy="${-6 + ly}" r="11" fill="${iris}"/><circle cx="${ex + lx}" cy="${-6 + ly}" r="11" fill="none" stroke="#120A06" stroke-width="2.5"/><circle cx="${ex + lx}" cy="${-6 + ly}" r="5.5" fill="#0B0604"/><circle cx="${ex + lx + 4}" cy="${-11 + ly}" r="3.4" fill="#fff"/><circle cx="${ex + lx - 4}" cy="${-2 + ly}" r="1.6" fill="#fff" opacity=".8"/>`;
    h += `<rect x="${ex - 20}" y="${-8 - ery - 2}" width="40" height="5" fill="${dark}" opacity=".35"/></g>`;                // lid shadow
    h += `<path d="M${ex - 19},-8 Q${ex - 18},${-8 - ery - 1} ${ex},${-8 - ery - 1} Q${ex + 18},${-8 - ery - 1} ${ex + 19},-8" stroke="#1C110B" stroke-width="${k === 'daughter' ? 5 : 4}" fill="none" stroke-linecap="round"/>`; // lash line
    h += `<path d="M${ex - 12},${-8 + ery} Q${ex},${-8 + ery + 3} ${ex + 12},${-8 + ery}" stroke="${dark}" stroke-width="2.5" fill="none" opacity=".6"/>`;
    if (k === 'daughter') h += `<path d="M${ex + (ex < 0 ? -18 : 18)},-12 l${ex < 0 ? -9 : 9},-7 M${ex + (ex < 0 ? -14 : 14)},${-8 - ery} l${ex < 0 ? -6 : 6},-7" stroke="#1C110B" stroke-width="3.5" stroke-linecap="round"/>`;
    if (expr === 'worried' || expr === 'sad') h += `<path d="M${ex - 20},${-8 - ery + 1} L${ex + 20},${-8 - ery + 1}" stroke="${skin}" stroke-width="5"/>`;
    if (angry) h += `<path d="M${ex - 22},${-8 - ery + (ex < 0 ? -3 : 9)} L${ex + 22},${-8 - ery + (ex < 0 ? 9 : -3)}" stroke="${skin}" stroke-width="9"/>`;
  }
  // ---- nose ----
  if (k === 'daughter') h += `<path d="M3,10 Q10,28 2,34 Q-4,36 -8,33" stroke="${dark}" stroke-width="4.5" fill="none" stroke-linecap="round"/><ellipse cx="6" cy="22" rx="4" ry="9" fill="#fff" opacity=".12"/>`;
  else {
    const nw = k === 'jamal' ? 1.2 : 1;
    h += `<path d="M6,-6 Q${14 * nw},26 ${10 * nw},36 Q0,46 -${10 * nw},38" fill="${dark}" opacity=".35"/>`;
    h += `<path d="M2,2 Q${14 * nw},32 2,42 Q-8,44 -15,38" stroke="${dark}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
    h += `<ellipse cx="-8" cy="40" rx="5" ry="3" fill="#2A140C" opacity=".5"/><ellipse cx="12" cy="40" rx="5" ry="3" fill="#2A140C" opacity=".5"/>`;
  }
  // cheeks
  if (expr === 'smile' || expr === 'laugh' || k === 'daughter') h += `<ellipse cx="-56" cy="34" rx="16" ry="9" fill="#E2735E" opacity="${k === 'daughter' ? .3 : .32}"/><ellipse cx="56" cy="34" rx="16" ry="9" fill="#E2735E" opacity="${k === 'daughter' ? .3 : .32}"/>`;
  if (angry) h += `<ellipse cx="-56" cy="28" rx="20" ry="11" fill="#D8483A" opacity=".32"/><ellipse cx="56" cy="28" rx="20" ry="11" fill="#D8483A" opacity=".32"/><path d="M-10,-40 l4,10 M10,-40 l-4,10" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>`;
  // ---- mouth ----
  const my = 72, mo = expr === 'shout' ? Math.max(mouth, .75) : mouth;
  if (mo > 0.08) {
    const big = expr === 'shout';
    const mry = 4 + mo * (big ? 24 : 16), mrx = 17 + mo * (big ? 9 : 3);
    if (expr === 'smile' || expr === 'laugh') {
      h += `<path d="M${-mrx - 5},${my - 4} Q0,${my - 9} ${mrx + 5},${my - 4} Q${mrx},${my + mry * 1.6} 0,${my + mry * 1.7} Q${-mrx},${my + mry * 1.6} ${-mrx - 5},${my - 4}Z" fill="#4E1916"/>`;
      h += `<path d="M${-mrx + 2},${my - 3} L${mrx - 2},${my - 3} L${mrx - 6},${my + 4} L${-mrx + 6},${my + 4}Z" fill="#fff"/><ellipse cx="0" cy="${my + mry * 1.25}" rx="${mrx * .55}" ry="${mry * .35}" fill="#C65B52"/>`;
    } else if (angry) {
      h += `<path d="M${-mrx},${my} Q0,${my - 12} ${mrx},${my} Q${mrx * .9},${my + mry * 2} 0,${my + mry * 2.1} Q${-mrx * .9},${my + mry * 2} ${-mrx},${my}Z" fill="#4E1916"/>`;
      h += `<path d="M${-mrx + 4},${my - 3} L${mrx - 4},${my - 3} L${mrx - 8},${my + 6} L${-mrx + 8},${my + 6}Z" fill="#fff"/><path d="M${-mrx * .6},${my + mry * 1.9} L${mrx * .6},${my + mry * 1.9} L${mrx * .5},${my + mry * 1.6} L${-mrx * .5},${my + mry * 1.6}Z" fill="#fff" opacity=".9"/>`;
      h += `<ellipse cx="0" cy="${my + mry * 1.5}" rx="${mrx * .5}" ry="${mry * .35}" fill="#C65B52"/>`;
    } else {
      h += `<ellipse cx="0" cy="${my + mry * .4}" rx="${mrx}" ry="${mry}" fill="#4E1916"/>`;
      h += `<ellipse cx="0" cy="${my + mry}" rx="${mrx * .6}" ry="${mry * .4}" fill="#C65B52"/>`;
      if (mo > .4) h += `<rect x="${-mrx * .7}" y="${my + mry * .4 - mry}" width="${mrx * 1.4}" height="5" rx="2" fill="#fff"/>`;
    }
  } else {
    const c = { smile: 12, laugh: 14, neutral: 2, calm: 5, sad: -10, worried: -6, stern: -3, angry: -9, smirk: 6 }[expr] ?? 2;
    if (expr === 'smirk') h += `<path d="M-18,${my + 2} Q4,${my + 4} 22,${my - 8}" stroke="${lip}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    else {
      h += `<path d="M-21,${my} Q0,${my + c} 21,${my}" stroke="${k === 'daughter' ? lip : '#4E1916'}" stroke-width="${k === 'daughter' ? 7 : 6}" fill="none" stroke-linecap="round"/>`;
      h += `<path d="M-10,${my + 10 + Math.max(0, c) * .5} Q0,${my + 14 + Math.max(0, c) * .5} 10,${my + 10 + Math.max(0, c) * .5}" stroke="${dark}" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>`; // lower lip shadow
    }
  }
  // ---- facial hair ----
  if (k === 'jamal') {
    h += `<path d="M${-rx + 8},26 C${-rx + 14},96 -40,${ry + 6} 0,${ry + 8} C40,${ry + 6} ${rx - 14},96 ${rx - 8},26 C${rx - 22},68 50,88 24,${mo > .08 ? 98 + mo * 30 : 94} L-24,${mo > .08 ? 98 + mo * 30 : 94} C-50,88 ${-rx + 22},68 ${-rx + 8},26Z" fill="#4F4846" opacity=".45"/>`;
    h += `<path d="M-50,60 Q-26,36 0,48 Q26,36 50,60 Q32,58 22,66 Q0,56 -22,66 Q-32,58 -50,60Z" fill="#4A4442"/><path d="M-36,54 Q-20,46 -6,50 M36,54 Q20,46 6,50" stroke="#8A8381" stroke-width="3" fill="none"/>`;
  }
  if (k === 'customer') h += `<path d="M-32,56 Q0,44 32,56" stroke="#141112" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-6,${my + 30} q6,8 12,0" stroke="#141112" stroke-width="5" fill="none"/>`;
  // ---- FX ----
  if (o.sweat) {
    const sy = -70 + ((o.t || 0) * 26 % 60);
    h += `<g opacity="${clamp(o.sweat)}"><path d="M${rx - 20},${sy - 18} C${rx - 12},${sy - 4} ${rx - 6},${sy + 6} ${rx - 20},${sy + 12} C${rx - 34},${sy + 6} ${rx - 28},${sy - 4} ${rx - 20},${sy - 18}Z" fill="#9BD8F2" stroke="#fff" stroke-width="3"/></g>`;
  }
  if (o.anger) h += `<g transform="translate(${-rx + 6},-112) scale(${.85 + .2 * Math.sin((o.t || 0) * 12)})" opacity="${clamp(o.anger)}"><path d="M-24,-8 Q-6,-6 -8,-24 M8,-24 Q6,-6 24,-8 M24,8 Q6,6 8,24 M-8,24 Q-6,6 -24,8" stroke="${C.coral}" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
  s += `<g transform="translate(0,${nod * 6}) rotate(${tilt + nod * .6})">${h}</g>`;
  const sc = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.flip ? -sc : sc},${sc})">${s}</g>`;
}
