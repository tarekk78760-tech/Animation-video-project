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
