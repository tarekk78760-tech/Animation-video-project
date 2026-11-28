// ===== Law 5 cast (pro shading pass): Jamal Saheb, rude customer, waiter boy, daughter =====
// person({kind, x, y, s, expr, mouth, look:[x,y], blink, sweat, anger, nod, tilt, flip, t})
// expr: neutral|smile|laugh|sad|worried|stern|angry|shout|calm|smirk
const KINDS = {
  arif:     { skin: '#B07548', lite: '#C98D5E', dark: '#8A5532', lip: '#7A3B2C', iris: '#2E1B10', rx: 90, jaw: .96 },
  girl:     { skin: '#BF865C', lite: '#D8A07A', dark: '#9C6640', lip: '#C0605A', iris: '#2A1A10', rx: 92, jaw: .82 },
  girl2:    { skin: '#C9946A', lite: '#E0AE86', dark: '#A8744E', lip: '#C0605A', iris: '#2A1A10', rx: 92, jaw: .82 },
  sakib:    { skin: '#B8805A', lite: '#D09A72', dark: '#946042', lip: '#7A3B2C', iris: '#2E1B10', rx: 86, jaw: .9 },
  mithu:    { skin: '#A26A44', lite: '#BC845C', dark: '#80502F', lip: '#6B3328', iris: '#2E1B10', rx: 94, jaw: 1.02 },
  musalli:  { skin: '#B07A52', lite: '#C9946A', dark: '#8C5A38', lip: '#7A3B2C', iris: '#3A2414', rx: 88, jaw: .95 },
  elder:    { skin: '#A8714A', lite: '#C08A62', dark: '#865434', lip: '#7A3B2C', iris: '#3A2414', rx: 92, jaw: 1.0 },
  poor:     { skin: '#8E5A38', lite: '#A6704C', dark: '#6C4026', lip: '#6B3328', iris: '#2E1B10', rx: 82, jaw: .88 },
  sad:      { skin: '#B8805A', lite: '#D09A72', dark: '#946042', lip: '#7A3B2C', iris: '#2E1B10', rx: 86, jaw: .9 },
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
  const SW = { arif: 222, girl: 175, girl2: 175, sakib: 210, mithu: 230, jamal: 230, customer: 218, waiter: 205, daughter: 205, musalli: 225, elder: 225, poor: 205, sad: 210 }[k];
  const shade = `<path d="M${-SW},450 C${-SW},300 ${-SW + 30},212 -64,180 L64,180 C${SW - 30},212 ${SW},300 ${SW},450 Z" fill="url(#${id}cl)"/>`;
  if (k === 'daughter') {
    // hair mass behind shoulders
    s += `<path d="M-108,-40 C-130,60 -134,170 -116,250 Q-104,276 -74,268 L74,268 Q104,276 116,250 C134,170 130,60 108,-40Z" fill="#17110F"/>`;
    s += `<path d="M-100,40 C-112,120 -110,190 -96,240" stroke="#3A2A24" stroke-width="5" fill="none" opacity=".7"/><path d="M100,40 C112,120 110,190 96,240" stroke="#3A2A24" stroke-width="5" fill="none" opacity=".7"/>`;
  }
  if (k === 'arif') {
    s += torso('#B9A6D6', 222);
    s += `<path d="M-6,190 L6,190 L6,450 L-6,450Z" fill="#A592C4"/>` + [250, 310, 370, 430].map(y => `<circle cx="0" cy="${y}" r="5" fill="#F4F2F8"/>`).join('');
    s += `<path d="M-14,206 L14,206 L24,300 L4,340 L-16,300Z" fill="#8C2A3A" transform="rotate(6 0 206)"/><path d="M-12,192 L12,192 L10,210 L-10,210Z" fill="#6E1F2D"/>`;
    s += `<path d="M-120,300 C-110,360 -112,410 -118,450 M110,300 C104,360 108,410 112,450" stroke="#A592C4" stroke-width="5" fill="none"/><rect x="72" y="280" width="58" height="62" rx="6" fill="none" stroke="#A592C4" stroke-width="5"/>`;
    s += shade;
  } else if (k === 'girl' || k === 'girl2') {
    s += torso('#FBFBF8', 175);
    s += `<path d="M-120,300 L120,300 L150,450 L-150,450Z" fill="#2E5E99"/><path d="M-90,300 L-110,190 M90,300 L110,190" stroke="#2E5E99" stroke-width="22" stroke-linecap="round"/>`;
    s += `<path d="M-46,184 L0,214 L46,184 L40,174 L0,202 L-40,174Z" fill="#2E5E99"/><path d="M-8,206 L8,206 L12,270 L0,286 L-12,270Z" fill="#C0392B"/>`;
    s += `<rect x="50" y="330" width="46" height="34" rx="6" fill="#F2C94C"/><text x="73" y="354" text-anchor="middle" font-size="18" font-weight="700" fill="#2E5E99">স্কুল</text>`;
    s += shade;
  } else if (k === 'sakib') {
    s += torso('#5B8DC9', 210);
    s += `<clipPath id="${id}ck"><path d="M-210,450 C-210,300 -180,212 -64,180 L64,180 C180,212 210,300 210,450 Z"/></clipPath><g clip-path="url(#${id}ck)" opacity=".35">`;
    for (let i = -6; i < 7; i++) s += `<rect x="${i * 36}" y="170" width="10" height="290" fill="#2E5E99"/><rect x="-220" y="${190 + (i + 6) * 36}" width="440" height="10" fill="#2E5E99"/>`;
    s += `</g><path d="M-6,190 L6,190 L6,450 L-6,450Z" fill="#4A7BB8"/>` + [240, 300, 360, 420].map(y => `<circle cx="0" cy="${y}" r="5" fill="#fff"/>`).join('');
    s += `<rect x="70" y="270" width="60" height="64" rx="6" fill="none" stroke="#2E5E99" stroke-width="5"/><rect x="88" y="252" width="8" height="40" rx="3" fill="#E85D4A"/>`;
    s += shade;
  } else if (k === 'mithu') {
    s += torso('#9A9A92', 230);
    s += `<path d="M-60,180 Q0,230 60,180" fill="url(#${id}nk)"/><path d="M-60,180 Q0,230 60,180" stroke="#86867E" stroke-width="8" fill="none"/>`;
    s += `<path d="M-230,450 C-230,330 -215,262 -180,232 C-160,300 -150,380 -152,450Z" fill="#8A8A82"/><path d="M230,450 C230,330 215,262 180,232 C160,300 150,380 152,450Z" fill="#8A8A82"/>`;
    s += `<g transform="translate(0,330)" opacity=".85"><circle r="52" fill="none" stroke="#E85D4A" stroke-width="10"/><path d="M-30,10 L0,-26 L30,10" stroke="#F2C94C" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
    s += `<ellipse cx="-90" cy="400" rx="20" ry="13" fill="#7E7E76" opacity=".5"/>`;
    s += `<path d="M-120,300 C-110,360 -112,410 -118,450 M110,300 C104,360 108,410 112,450" stroke="#86867E" stroke-width="5" fill="none"/>`;
    s += shade;
  } else if (k === 'musalli' || k === 'elder') {
    const pc = k === 'elder' ? '#F1EADB' : '#FBFAF6';
    s += torso(pc, 225);
    s += `<path d="M-8,186 L8,186 L10,330 L-10,330Z" fill="#E6E1D4"/>` + [226, 266, 306].map(y => `<circle cx="0" cy="${y}" r="5" fill="#C9BFA8"/>`).join('');
    s += `<path d="M-120,300 C-110,360 -112,410 -118,450 M110,300 C104,360 108,410 112,450" stroke="#DAD3C3" stroke-width="5" fill="none"/>`;
    s += `<path d="M-46,182 L-46,228 M46,182 L46,228" stroke="#DAD3C3" stroke-width="4"/>`;
    if (k === 'elder') { s += `<path d="M-225,450 C-225,300 -195,212 -64,180 L-30,450Z" fill="#8C6A4E"/><path d="M225,450 C225,300 195,212 64,180 L30,450Z" fill="#8C6A4E"/>`; for (let i = 0; i < 6; i++) s += `<path d="M${-200 + i * 18},${300 + i * 20} l20,-14 M${200 - i * 18},${300 + i * 20} l-20,-14" stroke="#A88A6C" stroke-width="4"/>`; }
    s += shade;
  } else if (k === 'poor') {
    s += torso('#A89A80', 205);
    s += `<rect x="-140" y="290" width="60" height="54" fill="#8E7F66" transform="rotate(-6 -110 317)"/><path d="M-140,290 l60,0 M-140,344 l60,0" stroke="#6E604A" stroke-width="3" stroke-dasharray="6 5" transform="rotate(-6 -110 317)"/>`;
    s += `<rect x="70" y="350" width="54" height="48" fill="#B5A688" transform="rotate(8 97 374)"/><path d="M70,350 l54,0 M70,398 l54,0" stroke="#6E604A" stroke-width="3" stroke-dasharray="6 5" transform="rotate(8 97 374)"/>`;
    s += `<path d="M-40,186 L-30,250 M30,190 L40,240" stroke="#8E7F66" stroke-width="4"/>`;
    s += shade;
  } else if (k === 'sad') {
    s += torso('#5C6B80', 210);
    s += `<path d="M-6,190 L6,190 L6,450 L-6,450Z" fill="#4E5C70"/>` + [240, 300, 360, 420].map(y => `<circle cx="0" cy="${y}" r="5" fill="#C9D1DC"/>`).join('');
    s += shade;
  } else if (k === 'jamal') {
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
  if (k === 'arif') s += `<path d="M-58,184 L-38,154 L-2,206 L-28,216Z" fill="#CDBDE6"/><path d="M58,184 L38,154 L2,206 L28,216Z" fill="#CDBDE6"/>`;
  if (k === 'sakib') s += `<path d="M-58,184 L-38,154 L-2,206 L-28,216Z" fill="#6E9CD4"/><path d="M58,184 L38,154 L2,206 L28,216Z" fill="#6E9CD4"/>`;
  if (k === 'musalli' || k === 'elder') s += `<path d="M-48,184 Q0,214 48,184 L42,172 Q0,200 -42,172Z" fill="#ECE6D8"/>`;
  if (k === 'sad') s += `<path d="M-58,184 L-38,154 L-2,206 L-28,216Z" fill="#6E7D92"/><path d="M58,184 L38,154 L2,206 L28,216Z" fill="#6E7D92"/>`;
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
  if (k === 'arif') {
    h += `<path d="M${-rx - 6},0 C${-rx - 12},-92 -50,-138 6,-136 C66,-136 ${rx + 12},-92 ${rx + 6},0 C${rx},-46 72,-80 34,-92 C0,-100 -50,-86 -66,-62 C-78,-46 ${-rx},-28 ${-rx - 6},0Z" fill="#1E1816"/>`;
    h += `<path d="M-66,-62 C-30,-104 34,-116 84,-92" stroke="#3E342E" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${-rx - 4},-10 C${-rx - 6},-30 -88,-46 -80,-56" stroke="#6E6460" stroke-width="5" fill="none"/>`;
  } else if (k === 'girl' || k === 'girl2') {
    const hc = '#17110F';
    h += `<path d="M${-rx - 8},30 C${-rx - 18},-96 -50,-146 0,-144 C50,-146 ${rx + 18},-96 ${rx + 8},30 C${rx},-30 ${rx - 12},-76 40,-96 C20,-84 6,-100 0,-108 C-6,-100 -20,-84 -40,-96 C${-rx + 12},-76 ${-rx},-30 ${-rx - 8},30Z" fill="${hc}"/>`;
    if (k === 'girl') { // two braids with red ribbons
      for (const sx of [-1, 1]) { h += `<path d="M${sx * (rx + 4)},10 C${sx * (rx + 18)},80 ${sx * (rx + 8)},150 ${sx * (rx - 4)},200" stroke="${hc}" stroke-width="30" fill="none" stroke-linecap="round"/>` + [40, 90, 140].map(y => `<path d="M${sx * (rx + 2) - 14},${y} q14,12 28,0" stroke="#3A2A24" stroke-width="4" fill="none"/>`).join('') + `<g transform="translate(${sx * (rx - 2)},206)"><path d="M0,0 l-26,-16 l0,32z M0,0 l26,-16 l0,32z" fill="#E85D4A"/><circle r="8" fill="#C0392B"/></g>`; }
    } else { h += `<path d="M${-rx - 8},30 C${-rx - 12},60 ${-rx + 6},80 ${-rx + 20},70 M${rx + 8},30 C${rx + 12},60 ${rx - 6},80 ${rx - 20},70" stroke="${hc}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-80,-96 Q0,-138 80,-96" stroke="#F2C94C" stroke-width="12" fill="none"/>`; }
  } else if (k === 'sakib') {
    h += `<path d="M${-rx - 6},0 C${-rx - 12},-92 -50,-136 4,-134 C64,-134 ${rx + 12},-90 ${rx + 6},0 C${rx},-50 70,-84 30,-90 C-10,-96 -40,-80 -60,-60 C-74,-46 ${-rx},-30 ${-rx - 6},0Z" fill="#17110F"/>`;
    h += `<path d="M-60,-60 C-30,-110 30,-120 80,-96" stroke="#3A2A24" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-20,-128 C10,-104 40,-96 80,-96" stroke="#17110F" stroke-width="14" fill="none"/>`;
  } else if (k === 'mithu') {
    h += `<path d="M${-rx - 8},10 C${-rx - 20},-90 -60,-150 0,-146 C70,-150 ${rx + 20},-90 ${rx + 8},10 C${rx},-30 ${rx - 20},-60 60,-70 L50,-46 L40,-80 L20,-54 L6,-90 L-12,-56 L-30,-88 L-44,-52 L-62,-80 C${-rx + 10},-60 ${-rx},-30 ${-rx - 8},10Z" fill="#1B1514"/>`;
    h += `<path d="M-96,-80 L-110,-120 L-76,-112 L-80,-156 L-44,-134 L-30,-176 L-4,-140 L20,-178 L34,-138 L66,-164 L66,-122 L104,-128 L92,-88 Z" fill="#1B1514"/><path d="M-60,-130 l10,-20 M0,-150 l6,-18 M50,-140 l12,-16" stroke="#3A302C" stroke-width="5" stroke-linecap="round"/>`;
  } else if (k === 'musalli' || k === 'elder') {
    const hc = k === 'elder' ? '#D9D6D0' : '#17110F';
    h += `<path d="M${-rx - 4},10 C${-rx - 8},-50 ${-rx + 4},-80 -60,-88 L${-rx + 10},10Z" fill="${hc}"/><path d="M${rx + 4},10 C${rx + 8},-50 ${rx - 4},-80 60,-88 L${rx - 10},10Z" fill="${hc}"/>`;
    if (o.turban) { h += `<path d="M${-rx - 8},-50 C${-rx - 14},-150 -50,-176 0,-176 C50,-176 ${rx + 14},-150 ${rx + 8},-50 Q0,-74 ${-rx - 8},-50Z" fill="#FBFAF6"/>` + [0, 1, 2, 3].map(i => `<path d="M${-rx + 4},${-70 - i * 26} Q0,${-96 - i * 26} ${rx - 4},${-70 - i * 26}" stroke="#DCD6C8" stroke-width="5" fill="none"/>`).join(''); } else {
    // tupi (prayer cap) with embroidery
    h += `<path d="M${-rx - 2},-62 C${-rx + 4},-140 -50,-150 0,-150 C50,-150 ${rx - 4},-140 ${rx + 2},-62 Q0,-80 ${-rx - 2},-62Z" fill="#FFFFFF"/>`;
    h += `<path d="M${-rx + 4},-70 Q0,-88 ${rx - 4},-70" stroke="#D8D2C2" stroke-width="4" fill="none"/>`;
    for (let i = 0; i < 7; i++) h += `<circle cx="${-60 + i * 20}" cy="${-118 + Math.abs(i - 3) * 5}" r="4" fill="#C9C2B0"/>`;
    h += `<path d="M-30,-140 Q0,-150 30,-140" stroke="#E6E1D4" stroke-width="5" fill="none"/>`; }
  } else if (k === 'poor') {
    h += `<path d="M${-rx - 6},4 C${-rx - 12},-90 -50,-130 0,-128 C60,-130 ${rx + 12},-90 ${rx + 6},4 C${rx},-40 70,-72 46,-76 L34,-58 L20,-80 L4,-60 L-10,-82 L-26,-60 L-42,-78 C-66,-62 ${-rx},-40 ${-rx - 6},4Z" fill="#1E1816"/>`;
    h += `<path d="M${-rx - 10},-40 C${-rx},-120 ${rx},-120 ${rx + 10},-40 L${rx + 4},-30 C${rx - 20},-90 ${-rx + 20},-90 ${-rx - 4},-30Z" fill="#B8432F" opacity=".9"/>`;
  } else if (k === 'sad') {
    h += `<path d="M${-rx - 6},0 C${-rx - 12},-92 -50,-136 4,-134 C64,-134 ${rx + 12},-90 ${rx + 6},0 C${rx},-44 74,-76 40,-86 C10,-70 -30,-96 -60,-80 C-76,-66 ${-rx},-40 ${-rx - 6},0Z" fill="#17110F"/><path d="M-40,-112 C0,-130 40,-128 70,-104" stroke="#3A2A24" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  } else if (k === 'jamal') {
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
    if (expr === 'bored') h += `<rect x="${ex - 20}" y="${-8 - ery - 2}" width="40" height="${ery + 2}" fill="${skin}"/><path d="M${ex - 19},-8 L${ex + 19},-8" stroke="#1C110B" stroke-width="4"/>`;
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
    const c = { bored: -4, smile: 12, laugh: 14, neutral: 2, calm: 5, sad: -10, worried: -6, stern: -3, angry: -9, smirk: 6 }[expr] ?? 2;
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
  if (k === 'musalli' || k === 'elder' || k === 'poor') {
    const bc2 = k === 'elder' ? '#E4E1DB' : k === 'poor' ? '#2A2220' : '#1B1513';
    const len = k === 'elder' ? 70 : k === 'poor' ? 18 : 40;
    h += `<path d="M${-rx + 6},20 C${-rx + 10},${90 + len * .6} -44,${ry + len} 0,${ry + len + 6} C44,${ry + len} ${rx - 10},${90 + len * .6} ${rx - 6},20 C${rx - 18},64 52,86 26,${mo > .08 ? 96 + mo * 30 : 92} L-26,${mo > .08 ? 96 + mo * 30 : 92} C-52,86 ${-rx + 18},64 ${-rx + 6},20Z" fill="${bc2}" opacity="${k === 'poor' ? .55 : 1}"/>`;
    if (k !== 'poor') h += `<path d="M-42,60 Q-20,44 0,52 Q20,44 42,60 Q24,58 0,62 Q-24,58 -42,60Z" fill="${bc2}"/>` + [-30, -10, 10, 30].map(x => `<path d="M${x},${ry - 4} q4,${len * .5} 0,${len}" stroke="${k === 'elder' ? '#C9C5BE' : '#3A302C'}" stroke-width="3" fill="none" opacity=".6"/>`).join('');
  }
  if (k === 'customer') h += `<path d="M-32,56 Q0,44 32,56" stroke="#141112" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-6,${my + 30} q6,8 12,0" stroke="#141112" stroke-width="5" fill="none"/>`;
  // ---- FX ----
  if (o.sweat) {
    const sy = -70 + ((o.t || 0) * 26 % 60);
    h += `<g opacity="${clamp(o.sweat)}"><path d="M${rx - 20},${sy - 18} C${rx - 12},${sy - 4} ${rx - 6},${sy + 6} ${rx - 20},${sy + 12} C${rx - 34},${sy + 6} ${rx - 28},${sy - 4} ${rx - 20},${sy - 18}Z" fill="#9BD8F2" stroke="#fff" stroke-width="3"/></g>`;
  }
  if (k === 'arif') h += `<path d="M-34,56 Q-16,46 0,52 Q16,46 34,56 Q16,54 0,58 Q-16,54 -34,56Z" fill="#1E1816"/>`;
  if (k === 'girl' || k === 'girl2') h += `<ellipse cx="-54" cy="34" rx="16" ry="9" fill="#E2735E" opacity=".3"/><ellipse cx="54" cy="34" rx="16" ry="9" fill="#E2735E" opacity=".3"/>`;
  if (k === 'sakib') h += `<rect x="-62" y="-30" width="50" height="42" rx="12" fill="#fff" fill-opacity=".08" stroke="#2C2C34" stroke-width="5"/><rect x="12" y="-30" width="50" height="42" rx="12" fill="#fff" fill-opacity=".08" stroke="#2C2C34" stroke-width="5"/><path d="M-12,-14 h24 M-62,-14 l-24,-6 M62,-14 l24,-6" stroke="#2C2C34" stroke-width="5"/>`;
  if (k === 'mithu') { h += `<path d="M${-rx + 8},26 C${-rx + 14},96 -40,${ry + 6} 0,${ry + 8} C40,${ry + 6} ${rx - 14},96 ${rx - 8},26 C${rx - 22},68 50,88 24,${mo > .08 ? 98 + mo * 30 : 94} L-24,${mo > .08 ? 98 + mo * 30 : 94} C-50,88 ${-rx + 22},68 ${-rx + 8},26Z" fill="#2A2220" opacity=".4"/>`; h += `<ellipse cx="-38" cy="6" rx="22" ry="7" fill="${dark}" opacity=".45"/><ellipse cx="38" cy="6" rx="22" ry="7" fill="${dark}" opacity=".45"/>`; }
  if (o.tear) { const ty = ((o.t || 0) * 22) % 90; h += `<path d="M-46,4 Q-50,${20 + ty * .5} -48,${10 + ty}" stroke="#BFE6FA" stroke-width="5" fill="none" opacity="${.6 * clamp(o.tear)}"/><path d="M-48,${4 + ty} c7,10 9,18 0,22 c-9,-4 -7,-12 0,-22z" fill="#CFEFFF" stroke="#fff" stroke-width="2" opacity="${clamp(o.tear)}"/>`; }
  if (o.anger) h += `<g transform="translate(${-rx + 6},-112) scale(${.85 + .2 * Math.sin((o.t || 0) * 12)})" opacity="${clamp(o.anger)}"><path d="M-24,-8 Q-6,-6 -8,-24 M8,-24 Q6,-6 24,-8 M24,8 Q6,6 8,24 M-8,24 Q-6,6 -24,8" stroke="${C.coral}" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
  s += `<g transform="translate(0,${nod * 6}) rotate(${tilt + nod * .6})">${h}</g>`;
  const sc = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.flip ? -sc : sc},${sc})">${s}</g>`;
}
