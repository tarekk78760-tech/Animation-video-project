// ===== Law 5 props & locations: Mirpur rice hotel, CCTV, phone, social feed, crowd =====

// ---- Hotel front (street view). Centre bottom at (x,y) ----
function hotelFront(x, y, s, t, o = {}) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  // building
  g += `<rect x="-420" y="-860" width="840" height="860" fill="#E4D3B8"/><rect x="-420" y="-860" width="840" height="40" fill="#CDB896"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="${-340 + i * 250}" y="-790" width="170" height="150" rx="6" fill="#7FA9B8" stroke="#9C8566" stroke-width="10"/><path d="M${-340 + i * 250},-715 h170" stroke="#9C8566" stroke-width="6"/>`;
  // signboard
  g += `<rect x="-400" y="-600" width="800" height="150" rx="12" fill="#C0392B"/><rect x="-386" y="-586" width="772" height="122" rx="8" fill="none" stroke="#F4D35E" stroke-width="4"/>`;
  g += `<text x="0" y="-522" text-anchor="middle" font-size="74" font-weight="700" fill="#FFF3C4">জামাল হোটেল</text>`;
  g += `<text x="0" y="-478" text-anchor="middle" font-size="32" font-weight="600" fill="#F4D35E">ভাত · মাছ · মাংস · ডাল</text>`;
  // tin awning (striped)
  for (let i = 0; i < 10; i++) g += `<path d="M${-420 + i * 84},-450 h84 l-10,70 h-84z" fill="${i % 2 ? '#2A9D8F' : '#F6EFE4'}"/>`;
  // shop opening
  g += `<rect x="-400" y="-380" width="800" height="380" fill="#4A3426"/><rect x="-400" y="-380" width="800" height="380" fill="url(#gShop)"/>`;
  // tube light
  g += `<rect x="-120" y="-366" width="240" height="14" rx="7" fill="#FFFDF0"/><rect x="-140" y="-380" width="280" height="60" fill="#FFFDF0" opacity="${.12 + .03 * Math.sin(t * 20)}"/>`;
  // inside: rice pot + counter
  g += deg(-250, -120, .9, t) + `<rect x="-400" y="-110" width="330" height="110" fill="#B5835A"/><rect x="-400" y="-110" width="330" height="12" fill="#C99A70"/>`;
  // steel tables + stools
  for (const tx of [40, 250]) g += `<rect x="${tx - 80}" y="-150" width="160" height="14" rx="4" fill="#C9D1D6"/><rect x="${tx - 70}" y="-136" width="8" height="120" fill="#A9B3BA"/><rect x="${tx + 62}" y="-136" width="8" height="120" fill="#A9B3BA"/><ellipse cx="${tx}" cy="-160" rx="40" ry="10" fill="#fff"/>`;
  // menu board on wall
  g += menuBoard(250, -300, .55);
  // CCTV on corner
  g += cctv(370, -430, .8, t, o.cctvHi);
  // crowd / queue optional
  if (o.empty) g += `<rect x="-400" y="-380" width="800" height="380" fill="#000" opacity=".25"/>`;
  g += `</g>`;
  return g;
}
function deg(x, y, s, t) { // big rice degchi with steam
  let g = `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-60" rx="110" ry="24" fill="#8C959C"/><path d="M-110,-60 C-120,40 -80,70 0,70 C80,70 120,40 110,-60Z" fill="#AEB7BE"/><ellipse cx="0" cy="-60" rx="96" ry="18" fill="#F7F3EA"/>`;
  for (let i = 0; i < 3; i++) { const p = (t * .5 + i / 3) % 1; g += `<path d="M${-40 + i * 40},${-80 - p * 120} q15,-20 0,-40 q-15,-20 0,-40" stroke="#fff" stroke-width="8" fill="none" opacity="${.6 * (1 - p)}" stroke-linecap="round"/>`; }
  return g + '</g>';
}
function menuBoard(x, y, s) {
  const items = [['ভাত', '১০'], ['ডাল', '১৫'], ['মাছ', '৬০'], ['মুরগি', '৮০']];
  let g = `<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-130" width="340" height="300" rx="12" fill="#1F3A2E" stroke="#8C6A45" stroke-width="12"/>
  <text x="0" y="-78" text-anchor="middle" font-size="40" font-weight="700" fill="#F4D35E">মেনু</text>`;
  items.forEach(([n, p], i) => g += `<text x="-130" y="${-20 + i * 52}" font-size="38" font-weight="600" fill="#fff">${n}</text><text x="130" y="${-20 + i * 52}" text-anchor="end" font-size="38" font-weight="700" fill="#F4D35E">৳${p}</text>`);
  return g + '</g>';
}
function cctv(x, y, s, t, hi) {
  const blink = Math.sin(t * 6) > 0;
  return `<g transform="translate(${x},${y}) scale(${s})">${hi ? `<circle r="120" fill="${C.amber}" opacity=".25"/>` : ''}<rect x="-8" y="-40" width="16" height="40" fill="#5C6670"/><g transform="rotate(20)"><rect x="-70" y="-6" width="110" height="52" rx="12" fill="#ECEFF1" stroke="#5C6670" stroke-width="5"/><circle cx="-68" cy="20" r="18" fill="#263238"/><circle cx="-68" cy="20" r="8" fill="#4FC3F7"/></g><circle cx="30" cy="20" r="6" fill="${blink ? '#E53935' : '#7B1F1F'}"/></g>`;
}
// ---- Hotel interior wide (background for incident scenes) ----
function hotelInterior(t, o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#EAD9BF"/><rect y="0" width="${W}" height="120" fill="#D8C3A2"/>`;
  s += `<rect x="0" y="1180" width="${W}" height="${H - 1180}" fill="#B9A386"/>`;
  for (let i = 0; i < 12; i++) s += `<rect x="${i * 100}" y="1180" width="96" height="${H - 1180}" fill="#C2AE91" opacity="${i % 2 ? .4 : 0}"/>`;
  s += `<rect x="340" y="150" width="400" height="16" rx="8" fill="#FFFDF0"/><rect x="300" y="160" width="480" height="140" fill="#FFFDF0" opacity=".14"/>`;
  s += menuBoard(170, 470, .9);
  s += `<g transform="translate(700,330)"><rect x="-150" y="-60" width="300" height="120" rx="10" fill="#C0392B"/><text y="16" text-anchor="middle" font-size="44" font-weight="700" fill="#FFF3C4">জামাল হোটেল</text></g>`;
  s += cctv(960, 230, 1, t, o.cctvHi);
  s += `<rect x="0" y="880" width="${W}" height="40" fill="#C9D1D6" opacity=".9"/>`; // counter rail
  return s;
}
function steelTable(y = 1250) {
  return `<rect x="-40" y="${y}" width="1160" height="40" rx="6" fill="#C9D1D6"/><rect x="-40" y="${y + 40}" width="1160" height="500" fill="#AEB7BE"/><rect x="-40" y="${y}" width="1160" height="8" fill="#E6EBEE"/>`;
}
function plate(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="120" ry="34" fill="#E6EBEE" stroke="#AEB7BE" stroke-width="5"/><ellipse cx="-20" cy="-6" rx="60" ry="18" fill="#FFFDF5"/><ellipse cx="45" cy="0" rx="28" ry="12" fill="#E2A33A"/></g>`;
}

// ---- Phone with content ----
function phone(x, y, s, inner, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-190" y="-380" width="380" height="760" rx="48" fill="#1B1F2A"/><rect x="-172" y="-350" width="344" height="700" rx="30" fill="#fff"/>
  <clipPath id="ph${Math.round(x)}${Math.round(y)}"><rect x="-172" y="-350" width="344" height="700" rx="30"/></clipPath><g clip-path="url(#ph${Math.round(x)}${Math.round(y)})">${inner}</g>
  <rect x="-40" y="-366" width="80" height="12" rx="6" fill="#333"/></g>`;
}
function hand(x, y, s, rot = 0, skin = '#B9794F') {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-60,0 C-80,80 -60,200 -20,320 L120,320 C120,200 110,80 80,0Z" fill="#4A6FA5"/><path d="M-70,-40 C-90,-10 -80,40 -40,50 L90,50 C110,20 100,-30 80,-50 Z" fill="${skin}"/><path d="M-80,-90 q-30,10 -20,50 l40,0z" fill="${skin}"/></g>`;
}
function recDot(x, y, t) {
  return `<g transform="translate(${x},${y})"><circle r="14" fill="#E53935" opacity="${Math.sin(t * 6) > 0 ? 1 : .3}"/><text x="26" y="12" font-size="34" font-weight="700" fill="#fff">REC</text></g>`;
}
// Facebook-like feed card (generic, no real brand marks)
function feedCard(x, y, s, o) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><rect x="-440" y="-330" width="880" height="660" rx="30" fill="#fff" filter="url(#shadow)"/>`;
  g += `<circle cx="-370" cy="-260" r="34" fill="#9AA6BF"/><rect x="-320" y="-284" width="220" height="20" rx="10" fill="#CFD5E1"/><rect x="-320" y="-250" width="140" height="16" rx="8" fill="#E3E7EF"/>`;
  g += `<rect x="-410" y="-200" width="820" height="400" rx="16" fill="#263238"/>${o.thumb || ''}`;
  g += `<g transform="translate(0,0)"><circle r="56" fill="#fff" opacity=".85"/><path d="M-18,-28 L30,0 L-18,28Z" fill="#263238"/></g>`;
  g += `<text x="-410" y="270" font-size="40" font-weight="700" fill="${C.ink}">${o.views || ''}</text>`;
  g += `<text x="410" y="270" text-anchor="end" font-size="34" font-weight="600" fill="${C.mute}">${o.meta || ''}</text>`;
  return g + '</g>';
}
function commentRow(x, y, s, avatarCol, name, text, o = {}) {
  return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="-380" cy="0" r="40" fill="${avatarCol}"/><circle cx="-380" cy="-10" r="14" fill="#fff" opacity=".7"/><path d="M-404,26 q24,-22 48,0" fill="#fff" opacity=".7"/>
  <rect x="-320" y="-56" width="${o.w || 700}" height="112" rx="40" fill="${o.bg || '#F0F2F5'}"/>
  <text x="-286" y="-12" font-size="28" font-weight="700" fill="${o.nameCol || C.ink}">${name}</text>
  <text x="-286" y="34" font-size="38" font-weight="600" fill="${o.textCol || C.text}">${text}</text></g>`;
}
function eyeIcon(x, y, s, col = '#fff') {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40,0 Q0,-34 40,0 Q0,34 -40,0Z" fill="none" stroke="${col}" stroke-width="7"/><circle r="12" fill="${col}"/></g>`;
}
// simple crowd person (body + head) for queue
function crowdPerson(x, y, s, col, skin = '#B07A50', hairCol = '#1E1A19') {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70,220 C-70,90 -40,40 0,40 C40,40 70,90 70,220Z" fill="${col}"/><rect x="-14" y="10" width="28" height="40" fill="${skin}"/><circle cy="-20" r="52" fill="${skin}"/><path d="M-54,-22 C-58,-80 54,-84 54,-22 C40,-52 -40,-52 -54,-22Z" fill="${hairCol}"/></g>`;
}
// video timeline bar (15s clip vs 3 min footage)
function clipBar(x, y, w, frac, label, col) {
  return `<g transform="translate(${x},${y})"><rect width="${w}" height="34" rx="17" fill="#E8E1D3"/><rect width="${w * frac}" height="34" rx="17" fill="${col}"/><text y="-18" font-size="34" font-weight="700" fill="${C.ink}">${label}</text></g>`;
}
