// ===== Law 10 props: Dhaka mess building & room, beds, desk, books, gray despair cloud, virus, calendar, meters =====
function messBuilding(x, y, s, t, o = {}) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<rect x="-380" y="-1100" width="760" height="1100" fill="#C9B79A"/><rect x="-380" y="-1100" width="760" height="1100" fill="url(#gGrime)"/>`;
  for (let f = 0; f < 4; f++) {
    const fy = -1060 + f * 260;
    for (let c = 0; c < 3; c++) {
      const wx = -310 + c * 230;
      const lit = o.night ? ((f + c) % 3 !== 1) : false;
      g += `<rect x="${wx}" y="${fy}" width="160" height="150" fill="${lit ? '#FFD983' : '#3E4A52'}"/>`;
      for (let b = 0; b < 6; b++) g += `<rect x="${wx + 10 + b * 26}" y="${fy}" width="6" height="150" fill="#5A4E40"/>`;   // grill
      g += `<rect x="${wx - 16}" y="${fy + 150}" width="192" height="16" fill="#9C8A6C"/>`;
    }
    // balcony with drying clothes
    g += `<path d="M-370,${fy + 205} H370" stroke="#4A4036" stroke-width="4"/>`;
    for (let k = 0; k < 4; k++) { const cx = -300 + k * 170 + (f % 2) * 60, sw = Math.sin(t * 2 + k + f) * 4; g += `<path d="M${cx},${fy + 205} l${-30 + sw},70 h${60},0 l${-30 - sw},-70z" fill="${['#E85D4A', '#4A7BB8', '#F2C94C', '#6E9E5A'][(k + f) % 4]}" opacity=".9"/>`; }
  }
  g += `<rect x="-60" y="-160" width="120" height="160" fill="#4A3A2C"/><rect x="-80" y="-240" width="160" height="50" rx="6" fill="#2A9D8F"/><text y="-205" text-anchor="middle" font-size="30" font-weight="700" fill="#fff">ছাত্র মেস</text>`;
  g += `<path d="M-420,-1110 H420" stroke="#8C7A5E" stroke-width="16"/>`;
  return g + '</g>';
}
function dhakaStreet(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="url(#${o.night ? 'gNightL' : 'gSkyL'})"/>`;
  g += `<rect x="-40" y="500" width="260" height="900" fill="#B8A88C"/><rect x="860" y="420" width="260" height="980" fill="#A99A80"/>`;
  g += `<path d="M-20,620 Q540,720 1100,600 M-20,660 Q540,780 1100,650" stroke="#2A2A2A" stroke-width="4" fill="none"/>`;
  g += messBuilding(540, 1400, .95, t, o);
  g += `<rect y="1400" width="${W}" height="80" fill="#9A958A"/><rect y="1480" width="${W}" height="${H - 1480}" fill="#6E6A62"/>`;
  return g;
}
function messRoom(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="#9DBFAE"/>`;                                     // pale green mess wall
  g += `<rect width="${W}" height="${H}" fill="url(#gWallStain)"/>`;
  g += `<rect y="0" width="${W}" height="70" fill="#E9E4D8"/>`;
  // ceiling fan
  const a = (o.fanSpeed ?? 6) * t;
  g += `<rect x="536" y="70" width="8" height="90" fill="#5A5A5A"/><g transform="translate(540,170)">${[0, 120, 240].map(d => `<ellipse rx="190" ry="15" cx="95" fill="#7A7A7A" transform="rotate(${d + a * 57.3})"/>`).join('')}<circle r="26" fill="#5A5A5A"/></g>`;
  // window with grill + light
  g += `<rect x="640" y="330" width="330" height="380" fill="${o.night ? '#1E2A44' : '#CFE6F0'}"/>`;
  if (o.night) g += `<circle cx="880" cy="420" r="34" fill="#F4F1E0"/>`;
  for (let i = 0; i < 7; i++) g += `<rect x="${650 + i * 46}" y="330" width="8" height="380" fill="#3E4A44"/>`;
  g += `<rect x="630" y="320" width="350" height="20" fill="#6E5A44"/><rect x="630" y="700" width="350" height="20" fill="#6E5A44"/>`;
  if (!o.night) g += `<path d="M640,720 L970,720 L860,1500 L420,1500Z" fill="#FFF6D6" opacity=".12"/>`;
  // clothesline across the room
  g += `<path d="M0,260 Q540,320 1080,250" stroke="#4A4036" stroke-width="4" fill="none"/>`;
  [[120, '#E85D4A', 'shirt'], [300, '#4A7BB8', 'lungi'], [470, '#F2EADB', 'gamchha']].forEach(([cx, col, kind], i) => {
    const sw = Math.sin(t * 1.5 + i) * 3, y0 = 268 + cx * .055;
    g += kind === 'lungi' ? `<path d="M${cx - 70},${y0} h140 l${sw},230 h-140z" fill="${col}"/>` + [0, 1, 2].map(j => `<path d="M${cx - 70},${y0 + 50 + j * 60} h140" stroke="#2E5E99" stroke-width="10"/>`).join('')
      : kind === 'shirt' ? `<path d="M${cx - 60},${y0} h120 l20,40 l-20,10 v150 h-120 v-150 l-20,-10z" fill="${col}"/>`
      : `<path d="M${cx - 40},${y0} h80 v200 h-80z" fill="${col}"/><path d="M${cx - 40},${y0 + 40} h80 M${cx - 40},${y0 + 160} h80" stroke="#2A9D8F" stroke-width="8"/>`;
  });
  // calendar on wall
  g += `<g transform="translate(160,620)"><rect x="-70" y="-80" width="140" height="160" fill="#fff"/><rect x="-70" y="-80" width="140" height="36" fill="#E85D4A"/>${[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3].map(c => `<rect x="${-56 + c * 30}" y="${-30 + r * 20}" width="20" height="12" fill="#D9D2C4"/>`).join('')).join('')}</g>`;
  g += `<rect y="1250" width="${W}" height="${H - 1250}" fill="#B9A890"/>`;
  for (let i = 0; i < 8; i++) g += `<rect x="${i * 140}" y="1250" width="136" height="${H - 1250}" fill="#A89880" opacity="${i % 2 ? .5 : 0}"/>`;
  return g;
}
function bed(x, y, s, sheet = '#D9C9A8') { // wooden chouki with mattress, side view
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-40" width="600" height="40" fill="#7A5233"/><rect x="-290" y="0" width="24" height="120" fill="#5E3D25"/><rect x="266" y="0" width="24" height="120" fill="#5E3D25"/><rect x="-300" y="-80" width="600" height="44" rx="14" fill="${sheet}"/><path d="M-280,-60 q40,-12 80,0 q40,12 80,0 q40,-12 80,0 q40,12 80,0 q40,-12 80,0 q40,12 80,0 q40,-12 80,0" stroke="#fff" stroke-opacity=".3" stroke-width="5" fill="none"/></g>`;
}
function desk(x, y, s, t, o = {}) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="34" width="26" height="300" fill="#6E5236"/><rect x="274" y="34" width="26" height="300" fill="#6E5236"/>`;
  if (o.panel !== false) {   // front modesty panel with a drawer
    g += `<rect x="-306" y="30" width="612" height="268" fill="#7A5A3C"/><rect x="-306" y="30" width="612" height="268" fill="url(#gPanel)"/>`;
    g += `<rect x="-280" y="56" width="260" height="84" rx="6" fill="none" stroke="#5E4329" stroke-width="5"/><rect x="-120" y="92" width="50" height="12" rx="6" fill="#C9A646"/>`;
    g += `<rect x="20" y="56" width="260" height="216" rx="6" fill="none" stroke="#5E4329" stroke-width="5"/><rect x="-280" y="156" width="260" height="116" rx="6" fill="none" stroke="#5E4329" stroke-width="5"/>`;
    g += `<rect x="-306" y="30" width="612" height="10" fill="#000" opacity=".18"/>`;
  }
  g += `<rect x="-320" y="0" width="640" height="34" fill="#8A6A48"/><rect x="-320" y="0" width="640" height="8" fill="#A07E58"/>`;
  // book stack
  const cols = ['#E85D4A', '#2A9D8F', '#F2C94C', '#4A7BB8', '#8E7DBE'];
  for (let i = 0; i < (o.books ?? 5); i++) g += `<rect x="${-280 + (i % 2) * 8}" y="${-36 - i * 30}" width="190" height="28" rx="4" fill="${cols[i % 5]}"/><rect x="${-270 + (i % 2) * 8}" y="${-30 - i * 30}" width="170" height="4" fill="#fff" opacity=".4"/>`;
  if (o.label) g += `<text x="${-184}" y="${-36 - (o.books ?? 5) * 30 + 22}" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">${o.label}</text>`;
  // desk lamp on the right, arm bent toward Sakib, shade pointing DOWN onto the open book
  g += `<path d="M240,0 h90 l-18,-16 h-54z" fill="#2E3440"/>`;
  g += `<path d="M285,-16 L268,-160 L170,-196" stroke="#2E3440" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="268" cy="-160" r="10" fill="#4A5060"/>`;
  g += `<g transform="translate(170,-196) rotate(-24) scale(.9)"><path d="M-60,40 L-24,-20 L24,-20 L60,40Z" fill="#F2C94C"/><path d="M-60,40 L60,40" stroke="#D9A42F" stroke-width="8"/><ellipse cx="0" cy="40" rx="56" ry="10" fill="${o.lampOn !== false ? '#FFF6D6' : '#8A8A80'}"/></g>`;
  if (o.lampOn !== false) g += `<path d="M118,-160 L196,-186 L190,-6 L-60,-6Z" fill="#FFF3C4" opacity=".22"/><ellipse cx="60" cy="-6" rx="150" ry="16" fill="#FFF3C4" opacity=".35"/>`;
  // open book
  if (o.openBook !== false) g += `<path d="M-60,-6 C-20,-26 30,-26 60,-10 L60,0 C30,-14 -20,-14 -60,4Z" fill="#FBF6E8"/><path d="M60,-10 C90,-26 140,-26 180,-6 L180,4 C140,-14 90,-14 60,0Z" fill="#FFFDF6"/>`;
  if (o.dust) for (let i = 0; i < 14; i++) g += `<circle cx="${-270 + (i * 13) % 180}" cy="${-40 - (i * 37) % ((o.books ?? 5) * 30)}" r="3" fill="#BFB8A8" opacity=".8"/>`;
  return g + '</g>';
}
function alarmClock(x, y, s, t) {
  const a = t * 60;
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="50" fill="#E85D4A"/><circle r="40" fill="#FFFDF5"/><line x1="0" y1="0" x2="${Math.sin(a * .0174) * 30}" y2="${-Math.cos(a * .0174) * 30}" stroke="#14213D" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="${Math.sin(a * .00145) * 20}" y2="${-Math.cos(a * .00145) * 20}" stroke="#14213D" stroke-width="7" stroke-linecap="round"/><circle cx="-38" cy="-44" r="14" fill="#E85D4A"/><circle cx="38" cy="-44" r="14" fill="#E85D4A"/></g>`;
}
function phoneHand(x, y, s, glow = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-50" y="-90" width="100" height="180" rx="16" fill="#1B1F2A"/><rect x="-42" y="-80" width="84" height="160" rx="10" fill="#7FB3D5" opacity="${glow}"/><rect x="-34" y="-60" width="68" height="40" rx="6" fill="#fff" opacity=".7"/><rect x="-34" y="-10" width="68" height="10" rx="5" fill="#fff" opacity=".5"/><rect x="-34" y="10" width="50" height="10" rx="5" fill="#fff" opacity=".5"/></g>`;
}
// gray despair cloud with drizzle; strength 0..1
function grayCloud(x, y, s, t, strength = 1) {
  let g = `<g transform="translate(${x},${y + Math.sin(t * 1.4) * 6}) scale(${s})" opacity="${strength}">`;
  g += `<g fill="#5E6470"><circle cx="-90" cy="0" r="60"/><circle cx="-20" cy="-36" r="80"/><circle cx="70" cy="-10" r="66"/><circle cx="120" cy="20" r="46"/><rect x="-150" y="0" width="290" height="60" rx="30"/></g>`;
  g += `<g fill="#7A808C"><circle cx="-40" cy="-40" r="40"/><circle cx="40" cy="-30" r="34"/></g>`;
  for (let i = 0; i < 10; i++) { const q = (t * 1.6 + i / 10) % 1; g += `<path d="M${-120 + i * 26},${60 + q * 150} l-6,24" stroke="#8A94A6" stroke-width="5" stroke-linecap="round" opacity="${1 - q}"/>`; }
  return g + '</g>';
}
function virus(x, y, r, col = '#6E7480', op = 1, rot = 0) {
  let g = `<g transform="translate(${x},${y}) rotate(${rot})" opacity="${op}"><circle r="${r}" fill="${col}"/>`;
  for (let i = 0; i < 8; i++) { const a = i * 45 * Math.PI / 180; g += `<line x1="${Math.cos(a) * r}" y1="${Math.sin(a) * r}" x2="${Math.cos(a) * r * 1.5}" y2="${Math.sin(a) * r * 1.5}" stroke="${col}" stroke-width="${r * .18}"/><circle cx="${Math.cos(a) * r * 1.55}" cy="${Math.sin(a) * r * 1.55}" r="${r * .2}" fill="${col}"/>`; }
  return g + '</g>';
}
function dreamBubble(x, y, s, t, crack = 0) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><circle cx="-140" cy="230" r="18" fill="#fff" opacity=".9"/><circle cx="-110" cy="180" r="28" fill="#fff" opacity=".9"/><ellipse rx="260" ry="190" fill="#fff"/>`;
  // job offer / ID card inside
  g += `<g transform="rotate(-4)"><rect x="-170" y="-110" width="340" height="220" rx="18" fill="#EAF2FB" stroke="#4A7BB8" stroke-width="6"/><rect x="-170" y="-110" width="340" height="50" rx="18" fill="#4A7BB8"/><text y="-74" text-anchor="middle" font-size="30" font-weight="700" fill="#fff">সরকারি চাকরি</text><circle cx="-90" cy="20" r="46" fill="#B8805A"/><path d="M-136,4 C-136,-40 -44,-40 -44,4 C-60,-14 -120,-14 -136,4Z" fill="#17110F"/>${[0, 1, 2].map(i => `<rect x="-20" y="${-10 + i * 30}" width="${150 - i * 30}" height="14" rx="7" fill="#B9C8DA"/>`).join('')}</g>`;
  if (crack > 0) g += `<path d="M-60,-190 L-20,-60 L-80,0 L10,80 L-30,190" stroke="#14213D" stroke-width="10" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(crack * 2)}"/><path d="M-20,-60 L120,-110 M-80,0 L-220,30 M10,80 L180,120" stroke="#14213D" stroke-width="7" opacity="${clamp(crack * 2 - .4)}"/>`;
  return g + '</g>';
}
function meter(x, y, w, v, label, col) {
  return `<g transform="translate(${x},${y})"><text y="-18" font-size="36" font-weight="700" fill="#14213D">${label}</text><rect width="${w}" height="36" rx="18" fill="#00000022"/><rect width="${w * clamp(v)}" height="36" rx="18" fill="${col}"/></g>`;
}
function calendarPage(x, y, s, big, small, col = '#E85D4A') {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-130" y="-150" width="260" height="300" rx="16" fill="#fff" filter="url(#shadow)"/><rect x="-130" y="-150" width="260" height="76" rx="16" fill="${col}"/><rect x="-130" y="-100" width="260" height="26" fill="${col}"/><circle cx="-70" cy="-150" r="12" fill="#14213D"/><circle cx="70" cy="-150" r="12" fill="#14213D"/><text y="40" text-anchor="middle" font-size="110" font-weight="700" fill="#14213D">${big}</text><text y="110" text-anchor="middle" font-size="40" font-weight="700" fill="#5A6070">${small}</text></g>`;
}
function silhouetteP(x, y, s, col) {
  return `<g transform="translate(${x},${y}) scale(${s})"><circle cy="-170" r="70" fill="${col}"/><path d="M-120,200 C-120,20 -80,-80 0,-80 C80,-80 120,20 120,200Z" fill="${col}"/></g>`;
}
// Mithu lying on the chouki, scrolling the phone (side view, head on the left)
function lyingMithu(x, y, s, t, o = {}) {
  const br = Math.sin(t * 1.8) * 3;
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += bed(0, 120, 1, '#C9B48E');
  g += `<ellipse cx="-215" cy="20" rx="90" ry="34" fill="#F2EADB"/><path d="M-290,30 q75,-16 150,0" stroke="#D8CDB8" stroke-width="5" fill="none"/>`;   // pillow
  // body under the blanket first (so the blanket hides the torso)
  g += `<g transform="translate(-205,${-34 + br * .2}) rotate(-80)"><clipPath id="lmc"><rect x="-80" y="-90" width="160" height="160"/></clipPath><g clip-path="url(#lmc)">${person({ kind: 'mithu', x: 0, y: 0, s: .46, expr: o.expr || 'bored', mouth: o.mouth || 0, look: o.look || [-.2, -1], blink: o.blink || 0 })}</g></g>`;
  g += `<path d="M-150,${44} C-150,${-40 + br} -60,${-58 + br} 40,${-52 + br} C140,${-46 + br} 230,-20 280,20 L290,44Z" fill="#3E6E8C"/>`;
  g += [0, 1, 2, 3].map(i => `<path d="M${-90 + i * 90},${-48 + br + Math.abs(i - 1.5) * 4} l16,88" stroke="#2E5670" stroke-width="12"/>`).join('');
  g += `<path d="M-150,${-20 + br} C-60,${-50 + br} 120,${-46 + br} 270,0" stroke="#5B8DAF" stroke-width="6" fill="none" opacity=".6"/>`;
  // arm up holding the phone above the face
  g += `<path d="M-150,${-30 + br} C-160,-90 -170,-130 -178,-168" stroke="#9A9A92" stroke-width="40" stroke-linecap="round" fill="none"/><path d="M-176,-160 C-180,-200 -184,-226 -186,-250" stroke="#A26A44" stroke-width="30" stroke-linecap="round" fill="none"/>`;
  g += `<g transform="translate(-196,-300) rotate(165)">${phoneHand(0, 0, .8, o.glow ?? 1)}</g>`;
  g += `<path d="M-200,-250 L-280,-30 L-150,-30Z" fill="#7FB3D5" opacity=".14"/>`;
  return g + '</g>';
}
// Sakib seated on a wooden chair at the desk (front view): chair back, torso, lap, legs and feet under the desk
function studySakib(x, y, s, t, o = {}) {
  const br = Math.sin(t * 1.6) * 2, nod = o.nod ?? Math.sin(t * .8) * .4;
  const pant = o.pant || '#2E3440', pantD = '#232832', skin = '#B8805A', wood = '#8A5A36', woodD = '#6B4423';
  const foot = Math.sin(t * 2.2) * (o.tap ? 6 : 0);
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  // chair back posts + top rail behind the torso
  g += `<rect x="-190" y="-330" width="30" height="430" rx="8" fill="${woodD}"/><rect x="160" y="-330" width="30" height="430" rx="8" fill="${woodD}"/><rect x="-200" y="-350" width="400" height="40" rx="14" fill="${wood}"/><rect x="-170" y="-230" width="340" height="22" rx="8" fill="${woodD}"/>`;
  // torso + head (breathing, slight nod)
  g += `<g transform="translate(0,${br})">${person({ kind: 'sakib', x: 0, y: -330, s: .9, expr: o.expr || 'neutral', mouth: o.mouth || 0, look: o.look || [0, .9], blink: o.blink || 0, nod, tear: o.tear, t })}</g>`;
  // chair seat edge visible at both sides of the hips
  g += `<rect x="-230" y="58" width="460" height="34" rx="10" fill="${wood}"/><rect x="-230" y="86" width="460" height="10" fill="${woodD}"/>`;
  // lap (thighs foreshortened toward the viewer)
  g += `<path d="M-160,40 L160,40 L150,128 L20,128 Q0,122 -20,128 L-150,128Z" fill="${pant}"/><path d="M-150,120 Q-90,134 -20,126 M150,120 Q90,134 20,126" stroke="${pantD}" stroke-width="5" fill="none"/><path d="M0,44 L0,128" stroke="${pantD}" stroke-width="6"/>`;
  // chair legs to the floor (behind the shins)
  g += `<rect x="-222" y="96" width="24" height="290" fill="${woodD}"/><rect x="198" y="96" width="24" height="290" fill="${woodD}"/>`;
  // shins down to the floor + feet in sandals
  for (const sx of [-1, 1]) {
    const kx = sx * 85, fx = sx * 100 + (sx > 0 ? foot : 0);
    g += `<path d="M${kx - 52},125 L${kx + 52},125 L${fx + 44},360 L${fx - 44},360Z" fill="${pant}"/><path d="M${kx + sx * 30},130 L${fx + sx * 30},355" stroke="${pantD}" stroke-width="5" opacity=".7"/>`;
    g += `<ellipse cx="${fx + sx * 10}" cy="378" rx="62" ry="20" fill="${skin}"/><path d="M${fx - 40},372 q${50},-30 ${100},0" stroke="#5A3A22" stroke-width="10" fill="none"/><rect x="${fx - 56}" y="384" width="${124}" height="10" rx="5" fill="#5A3A22"/>`;
  }
  g += `<ellipse cx="0" cy="398" rx="320" ry="22" fill="#000" opacity=".18"/>`;
  // upper arms down the sides (behind the desk top)
  for (const sx of [-1, 1]) g += `<path d="M${sx * 168},${-160 + br} C${sx * 186},-110 ${sx * 196},-56 ${sx * 196},-14" stroke="#5B8DC9" stroke-width="48" stroke-linecap="round" fill="none"/><path d="M${sx * 176},${-150 + br} C${sx * 190},-110 ${sx * 198},-60 ${sx * 198},-20" stroke="#4A7BB8" stroke-width="8" fill="none" opacity=".5"/>`;
  // desk in front (top + legs; legs and feet remain visible underneath)
  g += desk(0, 0, 1.15, t, o);
  // forearms resting on the desk, hands on the book (right hand holds a pen)
  const wr = o.write ? Math.sin(t * 9) * 4 : 0;
  g += `<path d="M-196,-14 L-70,-22" stroke="#5B8DC9" stroke-width="40" stroke-linecap="round"/><path d="M-205,-14 L-70,-22" stroke="#4A7BB8" stroke-width="8" stroke-linecap="round" opacity=".6"/>`;
  g += `<rect x="-84" y="-34" width="16" height="24" rx="5" fill="#F4F6F8"/><ellipse cx="-56" cy="-22" rx="32" ry="18" fill="${skin}"/>`;
  g += `<path d="M196,-14 L${120 + wr},-24" stroke="#5B8DC9" stroke-width="40" stroke-linecap="round"/><ellipse cx="${108 + wr}" cy="-26" rx="30" ry="18" fill="${skin}"/>`;
  if (o.pen !== false) g += `<path d="M${100 + wr},-30 L${70 + wr},-74" stroke="#14213D" stroke-width="8" stroke-linecap="round"/>`;
  return g + '</g>';
}

// ================= ARIF props =================
function wallClock(x, y, s, t, o = {}) {
  const mins = o.min ?? (t * 8), hrs = o.hr ?? 9;
  const ma = mins * 6, ha = hrs * 30 + mins * .5;
  let g = `<g transform="translate(${x},${y}) scale(${s})"><circle r="92" fill="#FFFDF5" stroke="#14213D" stroke-width="10"/>`;
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; g += `<line x1="${Math.sin(a) * 70}" y1="${-Math.cos(a) * 70}" x2="${Math.sin(a) * 82}" y2="${-Math.cos(a) * 82}" stroke="#14213D" stroke-width="${i % 3 ? 3 : 6}"/>`; }
  g += `<line x1="0" y1="0" x2="${Math.sin(ha * .0174) * 44}" y2="${-Math.cos(ha * .0174) * 44}" stroke="#14213D" stroke-width="9" stroke-linecap="round"/><line x1="0" y1="0" x2="${Math.sin(ma * .0174) * 66}" y2="${-Math.cos(ma * .0174) * 66}" stroke="#14213D" stroke-width="6" stroke-linecap="round"/><circle r="8" fill="#E85D4A"/>`;
  if (o.badge) g += `<g transform="translate(78,-78)"><circle r="40" fill="#E85D4A"/><text y="12" text-anchor="middle" font-size="32" font-weight="700" fill="#fff">${o.badge}</text></g>`;
  return g + '</g>';
}
function officeRoom(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="#E7ECF1"/><rect y="0" width="${W}" height="90" fill="#D6DDE5"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${90 + i * 250}" y="140" width="160" height="16" rx="8" fill="#FFFFF4"/>`;    // tube lights
  g += `<rect x="70" y="280" width="420" height="440" rx="10" fill="#CFE3EE" stroke="#fff" stroke-width="14"/>`;
  for (let i = 0; i < 7; i++) g += `<rect x="70" y="${300 + i * 62}" width="420" height="24" fill="#fff" opacity=".5"/>`;
  g += wallClock(790, 420, 1.05, t, o.clock || {});
  g += `<rect x="620" y="560" width="340" height="140" rx="10" fill="#fff" stroke="#14213D" stroke-width="6"/><text x="790" y="645" text-anchor="middle" font-size="40" font-weight="700" fill="#2A9D8F">অফিস</text>`;
  g += `<rect y="1240" width="${W}" height="${H - 1240}" fill="#A9B4C2"/>` + plant(1000, 1240, 1.1);
  return g;
}
function officeDesk(y, t) {
  return `<rect x="-40" y="${y}" width="1160" height="40" fill="#8A6A48"/><rect x="-40" y="${y + 40}" width="1160" height="460" fill="#6E5236"/><rect x="-40" y="${y}" width="1160" height="8" fill="#A07E58"/><rect x="420" y="${y - 150}" width="240" height="150" rx="10" fill="#2E3440"/><rect x="432" y="${y - 140}" width="216" height="120" rx="6" fill="#7FB3D5"/><rect x="520" y="${y - 10}" width="40" height="12" fill="#2E3440"/>`;
}
function bedroom(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="${o.night ? '#2A3150' : '#D9C7E8'}"/>`;
  g += `<rect x="640" y="300" width="320" height="380" fill="${o.night ? '#121A33' : '#FFE9B8'}"/>`;
  for (let i = 0; i < 6; i++) g += `<rect x="${650 + i * 54}" y="300" width="8" height="380" fill="#4A4060"/>`;
  g += `<path d="M620,290 h360 v30 h-360z" fill="#8E6BB4"/><path d="M620,320 q60,200 0,400 M980,320 q-60,200 0,400" fill="#B48ED4" opacity=".8"/>`;
  if (o.night) g += `<circle cx="880" cy="400" r="40" fill="#F4F1E0"/>`; else g += `<path d="M640,680 L960,680 L860,1500 L420,1500Z" fill="#FFF6D6" opacity=".14"/>`;
  g += `<rect y="1250" width="${W}" height="${H - 1250}" fill="#B89A7A"/>`;
  return g;
}
function lyingArif(x, y, s, t, o = {}) { // sleeping under a blanket
  const br = Math.sin(t * 1.4) * 3;
  let g = `<g transform="translate(${x},${y}) scale(${s})">` + bed(0, 120, 1, '#E8D8F2');
  g += `<ellipse cx="-215" cy="20" rx="90" ry="34" fill="#FFFFFF"/>`;
  g += `<g transform="translate(-205,${-34 + br * .2}) rotate(-80)"><clipPath id="lac"><rect x="-80" y="-90" width="160" height="160"/></clipPath><g clip-path="url(#lac)">${person({ kind: 'arif', x: 0, y: 0, s: .46, expr: o.expr || 'neutral', blink: o.blink ?? 1, look: [0, -1] })}</g></g>`;
  g += `<path d="M-150,44 C-150,${-40 + br} -60,${-58 + br} 40,${-52 + br} C140,${-46 + br} 230,-20 280,20 L290,44Z" fill="#8E6BB4"/><path d="M-150,${-20 + br} C-60,${-50 + br} 120,${-46 + br} 270,0" stroke="#B48ED4" stroke-width="6" fill="none"/>`;
  if (o.zzz) for (let i = 0; i < 3; i++) { const q = (t * .6 + i / 3) % 1; g += `<text x="${-160 + q * 80}" y="${-140 - q * 140}" font-size="${40 + q * 30}" font-weight="700" fill="#6E5A8E" opacity="${1 - q}">z</text>`; }
  return g + '</g>';
}
function ringingAlarm(x, y, s, t, on = true) {
  const sh = on ? Math.sin(t * 60) * 6 : 0;
  let g = `<g transform="translate(${x + sh},${y}) rotate(${on ? Math.sin(t * 50) * 6 : 0})">${alarmClock(0, 0, s, t)}</g>`;
  if (on) for (let i = 0; i < 2; i++) g += `<path d="M${x - 70 * s - i * 16},${y - 30} q-14,30 0,60 M${x + 70 * s + i * 16},${y - 30} q14,30 0,60" stroke="#E85D4A" stroke-width="5" fill="none" opacity="${.5 + .5 * Math.sin(t * 20)}"/>`;
  return g;
}
function fineJar(x, y, s, n) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><rect x="-90" y="-150" width="180" height="200" rx="30" fill="#E6F2F8" fill-opacity=".5" stroke="#9CC0D0" stroke-width="6"/><rect x="-70" y="-176" width="140" height="30" rx="8" fill="#8A6A48"/>`;
  for (let i = 0; i < n; i++) g += `<rect x="${-70 + (i % 3) * 46}" y="${20 - Math.floor(i / 3) * 26}" width="44" height="22" rx="4" fill="#7FB77E" stroke="#4E8A4D" stroke-width="3"/>`;
  g += `<rect x="-80" y="-80" width="160" height="50" rx="8" fill="#fff"/><text y="-46" text-anchor="middle" font-size="30" font-weight="700" fill="#E85D4A">জরিমানা</text>`;
  return g + '</g>';
}
function schoolHall(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="#F3E3C8"/>`;
  g += `<rect x="120" y="300" width="840" height="140" rx="16" fill="#2A9D8F"/><text x="540" y="390" text-anchor="middle" font-size="64" font-weight="700" fill="#fff">বার্ষিক অনুষ্ঠান</text>`;
  for (let i = 0; i < 12; i++) g += `<path d="M${60 + i * 88},250 l44,60 l44,-60z" fill="${['#E85D4A', '#F2C94C', '#4A7BB8', '#6E9E5A'][i % 4]}"/>`;
  g += `<path d="M40,250 H1040" stroke="#5A4A3A" stroke-width="4"/>`;
  [[110, 540, '#E85D4A'], [970, 520, '#F2C94C'], [80, 700, '#4A7BB8']].forEach(([bx, by, c], i) => g += `<ellipse cx="${bx}" cy="${by + Math.sin(t * 2 + i) * 8}" rx="44" ry="54" fill="${c}"/><path d="M${bx},${by + 54} q10,60 -6,120" stroke="#5A4A3A" stroke-width="3" fill="none"/>`);
  g += `<rect x="180" y="640" width="720" height="40" fill="#8A5A36"/><rect x="180" y="680" width="720" height="300" fill="#6E4428"/>`;  // stage
  g += `<rect y="1000" width="${W}" height="${H - 1000}" fill="#C9A984"/>`;
  // chairs (stacked/empty if over)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const cx = 160 + c * 190, cy = 1120 + r * 130; g += o.empty ? `<g opacity=".9"><rect x="${cx - 40}" y="${cy - 60}" width="80" height="60" rx="8" fill="#4A7BB8"/><rect x="${cx - 44}" y="${cy}" width="88" height="16" rx="6" fill="#3E6AA0"/><rect x="${cx - 40}" y="${cy + 16}" width="8" height="50" fill="#2E3440"/><rect x="${cx + 32}" y="${cy + 16}" width="8" height="50" fill="#2E3440"/></g>` : ''; }
  return g;
}
function doorFrame(x, y, s, open = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-640" width="340" height="640" fill="#2E2418"/><rect x="-150" y="-620" width="300" height="620" fill="#FFF3D6" opacity=".9"/><rect x="${-150 + 300 * (1 - (1 - open) * .0)}" y="-620" width="${-300 * open * .55}" height="620" fill="#8A6A48"/><rect x="-170" y="-660" width="340" height="30" fill="#5A4430"/></g>`;
}
function shoesBag(x, y, s, t, o = {}) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<rect x="-260" y="40" width="520" height="24" rx="8" fill="#8A6A48"/><rect x="-250" y="64" width="20" height="90" fill="#6E5236"/><rect x="230" y="64" width="20" height="90" fill="#6E5236"/>`;   // shoe rack
  for (const sx of [-1, 1]) g += `<path d="M${sx * 60 - 80},38 C${sx * 60 - 80},0 ${sx * 60 - 40},-10 ${sx * 60 + 10},-6 C${sx * 60 + 50},-2 ${sx * 60 + 70},20 ${sx * 60 + 70},38Z" fill="#2E2418"/><path d="M${sx * 60 - 70},30 h140" stroke="#5A4430" stroke-width="5"/>`;
  g += `<g transform="translate(0,-170)"><rect x="-150" y="-120" width="300" height="200" rx="24" fill="#3E4A5C"/><rect x="-150" y="-120" width="300" height="60" rx="24" fill="#4A576A"/><path d="M-70,-120 C-70,-190 70,-190 70,-120" stroke="#2E3440" stroke-width="16" fill="none"/><rect x="-30" y="-90" width="60" height="16" rx="6" fill="#C9A646"/></g>`;   // office bag
  if (o.check) g += `<g transform="translate(220,-260)"><circle r="44" fill="#2A9D8F"/><path d="M-20,0 L-6,16 L22,-16" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  return g + '</g>';
}
function calendarGrid(x, y, s, n, marks) { // marks: array of 1 (✓) / 0 (✗)
  let g = `<g transform="translate(${x},${y}) scale(${s})"><rect x="-400" y="-300" width="800" height="600" rx="24" fill="#fff" filter="url(#shadow)"/><rect x="-400" y="-300" width="800" height="80" rx="24" fill="#4A7BB8"/><text y="-245" text-anchor="middle" font-size="40" font-weight="700" fill="#fff">ক্যালেন্ডার</text>`;
  for (let i = 0; i < 28; i++) { const cx = -340 + (i % 7) * 113, cy = -170 + Math.floor(i / 7) * 120; g += `<rect x="${cx - 46}" y="${cy - 46}" width="92" height="92" rx="12" fill="#F1F4F8"/>`; if (i < n) g += marks[i] ? `<path d="M${cx - 24},${cy} L${cx - 6},${cy + 20} L${cx + 26},${cy - 20}" stroke="#2A9D8F" stroke-width="10" fill="none" stroke-linecap="round"/>` : `<path d="M${cx - 18},${cy - 18} L${cx + 18},${cy + 18} M${cx + 18},${cy - 18} L${cx - 18},${cy + 18}" stroke="#E85D4A" stroke-width="10" stroke-linecap="round"/>`; }
  return g + '</g>';
}
function cigarettePack(x, y, s, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-60" y="-80" width="120" height="160" rx="10" fill="#C0392B"/><rect x="-60" y="-20" width="120" height="60" fill="#fff"/>${[0, 1, 2].map(i => `<rect x="${-40 + i * 30}" y="-120" width="20" height="60" fill="#F4F1E8"/><rect x="${-40 + i * 30}" y="-120" width="20" height="16" fill="#E8B07A"/>`).join('')}</g>`;
}
function ballotBox(x, y, s, n) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><path d="M-220,-160 L220,-160 L260,-120 L260,180 L-180,180 L-220,140Z" fill="#2E5E99"/><path d="M-220,-160 L220,-160 L260,-120 L-180,-120Z" fill="#4A7BB8"/><rect x="-80" y="-148" width="200" height="16" rx="8" fill="#14213D"/>`;
  g += `<text x="20" y="40" text-anchor="middle" font-size="44" font-weight="700" fill="#fff">ভোট</text><text x="20" y="100" text-anchor="middle" font-size="40" font-weight="700" fill="#F2C94C">${bn(n)}</text>`;
  return g + '</g>';
}
function voteCard(x, y, s, txt, col = '#2A9D8F', rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-150" y="-60" width="300" height="120" rx="14" fill="#fff" stroke="${col}" stroke-width="6"/><path d="M-110,0 L-90,22 L-56,-22" stroke="${col}" stroke-width="10" fill="none" stroke-linecap="round"/><text x="30" y="14" text-anchor="middle" font-size="34" font-weight="700" fill="#14213D">${txt}</text></g>`;
}
function genericBook(x, y, sc, op, rot, title, sub, author) {
  return `<g transform="translate(${x},${y}) scale(${sc}) rotate(${rot})" opacity="${op}"><rect x="-250" y="-340" width="500" height="680" rx="14" fill="#F4F1E8"/><rect x="-250" y="-340" width="40" height="680" rx="8" fill="#D9D2C2"/><rect x="-190" y="-120" width="400" height="10" fill="#14213D"/>
  <text x="10" y="-200" text-anchor="middle" font-size="34" font-weight="600" fill="#14213D" letter-spacing="6">${author}</text><text x="10" y="-20" text-anchor="middle" font-size="86" font-weight="700" fill="#14213D">${title[0]}</text><text x="10" y="80" text-anchor="middle" font-size="86" font-weight="700" fill="#14213D">${title[1]}</text><text x="10" y="200" text-anchor="middle" font-size="34" font-weight="600" fill="#E85D4A">${sub}</text>${[0, 1, 2, 3].map(i => `<circle cx="${-90 + i * 66}" cy="270" r="${10 + i * 6}" fill="#F2C94C"/>`).join('')}</g>`;
}

function walkerJ(x, y, s, t, o = {}) {
  const ph = t * 6 + (o.seed || 0), lg = Math.sin(ph) * 22, col = o.col || '#F6F2EA', skin = o.skin || '#B07A52';
  return `<g transform="translate(${x},${y + Math.abs(Math.sin(ph)) * -4}) scale(${o.flip ? -s : s},${s})">
    <path d="M-10,-120 L${-10 + lg},0" stroke="#3A3A44" stroke-width="22" stroke-linecap="round"/><path d="M10,-120 L${10 - lg},0" stroke="#4A4A55" stroke-width="22" stroke-linecap="round"/>
    <path d="M-50,-110 C-56,-220 -40,-300 0,-310 C40,-300 56,-220 50,-110Z" fill="${col}"/><path d="M20,-290 L${40 + lg * .6},-170" stroke="${col}" stroke-width="24" stroke-linecap="round"/>
    <circle cx="0" cy="-350" r="38" fill="${skin}"/><path d="M-38,-360 C-40,-400 40,-400 38,-360Z" fill="#fff"/><path d="M-30,-340 C-26,-300 26,-300 34,-340 C20,-326 -20,-326 -30,-340Z" fill="${o.beard || '#1B1513'}"/></g>`;
}

// Arif walking/running in office clothes with a bag (side view, facing right)
function walkingArif(x, y, s, t, o = {}) {
  const sp = o.run ? 11 : 6, ph = t * sp, lg = Math.sin(ph) * (o.run ? 34 : 22), bob = Math.abs(Math.sin(ph)) * (o.run ? -10 : -4);
  let g = `<g transform="translate(${x},${y + bob}) scale(${o.flip ? -s : s},${s})">`;
  g += `<path d="M-6,-150 L${-6 + lg},0" stroke="#3A3F4B" stroke-width="30" stroke-linecap="round"/><path d="M8,-150 L${8 - lg},0" stroke="#2E3440" stroke-width="30" stroke-linecap="round"/>`;
  g += `<path d="M${-6 + lg - 10},6 h44" stroke="#1B1B22" stroke-width="16" stroke-linecap="round"/><path d="M${8 - lg - 10},6 h44" stroke="#1B1B22" stroke-width="16" stroke-linecap="round"/>`;
  g += `<path d="M-56,-140 C-62,-260 -40,-340 4,-350 C48,-340 62,-260 56,-140Z" fill="#B9A6D6"/><path d="M-2,-330 L4,-230 L12,-330Z" fill="#8C2A3A"/>`;
  g += `<g transform="translate(-40,-210)"><rect x="-44" y="-40" width="70" height="90" rx="14" fill="#3E4A5C"/></g>`;            // bag on the back
  g += `<path d="M14,-320 L${40 - lg * .7},-200" stroke="#A592C4" stroke-width="26" stroke-linecap="round"/><circle cx="${40 - lg * .7}" cy="-196" r="14" fill="#B07548"/>`;
  g += `<circle cx="6" cy="-392" r="44" fill="#B07548"/><path d="M-40,-404 C-42,-450 46,-452 50,-404 C30,-420 -20,-424 -40,-404Z" fill="#1E1816"/><path d="M22,-376 q14,-4 24,2" stroke="#1E1816" stroke-width="6" fill="none"/><circle cx="26" cy="-398" r="5" fill="#1B1513"/>`;
  if (o.run) for (let i = 0; i < 3; i++) g += `<path d="M${-90 - i * 30},${-300 + i * 70} h-${40 + i * 10}" stroke="#9AA6BF" stroke-width="6" stroke-linecap="round" opacity=".6"/>`;
  return g + '</g>';
}
