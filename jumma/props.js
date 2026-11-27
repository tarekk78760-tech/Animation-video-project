// ===== Jumma props: mosque (outside/inside), god rays, sajdah rows, seated dua, walkers, Quran, tasbih, hourglass, doors =====
const GOLD = '#E8B45A', GOLDL = '#FFE3A3', CARPET = '#9B2C2C', CARPET2 = '#7E1F24', STONE = '#C9AE86', STONED = '#8A7356';

function lightRays(x, y, n, spread, len, op, t) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const a = (-spread / 2 + spread * i / (n - 1)) * Math.PI / 180, w = 40 + (i % 3) * 30, fl = op * (.75 + .25 * Math.sin(t * .8 + i));
    const x2 = x + Math.sin(a) * len, y2 = y + Math.cos(a) * len;
    g += `<path d="M${x - w / 4},${y} L${x + w / 4},${y} L${x2 + w},${y2} L${x2 - w},${y2}Z" fill="url(#gRay)" opacity="${fl}"/>`;
  }
  return g;
}
function dust(t, n = 40, area = [0, 300, 1080, 1300]) {
  let g = '';
  for (let i = 0; i < n; i++) { const x = area[0] + ((i * 211 + t * 12 * (i % 3 + 1)) % area[2]), y = area[1] + ((i * 337 + t * 8 * ((i % 2) + 1)) % area[3]); g += `<circle cx="${x}" cy="${y}" r="${1.5 + (i % 3)}" fill="${GOLDL}" opacity="${.25 + .35 * Math.abs(Math.sin(t + i))}"/>`; }
  return g;
}
function latticeWindow(x, y, w, h, glow = 1) {
  let g = `<g transform="translate(${x},${y})"><path d="M${-w / 2},${h / 2} V${-h / 2 + w / 2} Q${-w / 2},${-h / 2} 0,${-h / 2 - w * .15} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + w / 2} V${h / 2}Z" fill="#3A2614"/>`;
  g += `<clipPath id="lw${Math.round(x)}${Math.round(y)}"><path d="M${-w / 2 + 14},${h / 2 - 10} V${-h / 2 + w / 2} Q${-w / 2 + 14},${-h / 2 + 14} 0,${-h / 2 - w * .15 + 18} Q${w / 2 - 14},${-h / 2 + 14} ${w / 2 - 14},${-h / 2 + w / 2} V${h / 2 - 10}Z"/></clipPath><g clip-path="url(#lw${Math.round(x)}${Math.round(y)})"><rect x="${-w}" y="${-h}" width="${w * 2}" height="${h * 2}" fill="${GOLDL}" opacity="${glow}"/>`;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) { const cx = -w / 2 + 30 + c * (w - 60) / 3, cy = -h / 2 + 40 + r * h / 7; g += `<g transform="translate(${cx},${cy})" fill="#5A3A1E"><circle cx="0" cy="-16" r="11"/><circle cx="0" cy="16" r="11"/><circle cx="-16" cy="0" r="11"/><circle cx="16" cy="0" r="11"/></g><circle cx="${cx}" cy="${cy}" r="7" fill="${GOLDL}"/>`; }
  g += `</g></g>`;
  return g;
}
function hangingLamp(x, y, s, t) {
  const f = .8 + .2 * Math.sin(t * 6 + x);
  return `<g transform="translate(${x},${y}) scale(${s})"><line x1="0" y1="-600" x2="0" y2="-30" stroke="#3A2614" stroke-width="3"/><circle r="70" fill="${GOLDL}" opacity="${.18 * f}"/><path d="M-22,-30 h44 l14,40 q-36,30 -72,0z" fill="${GOLD}"/><path d="M-14,10 h28 l-14,26z" fill="${GOLD}"/><circle cy="-6" r="12" fill="#FFF6D8" opacity="${f}"/></g>`;
}
// ---------- mosque exterior ----------
function mosque(x, y, s, o = {}) {
  const lit = o.lit !== false, wall = o.dusk ? '#E9D5B0' : '#F2E6CF', dome = o.domeCol || '#E8EDF0';
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  for (const sx of [-1, 1]) { // minarets
    const mx = sx * 380;
    g += `<rect x="${mx - 34}" y="-900" width="68" height="900" fill="${wall}"/><rect x="${mx - 34}" y="-900" width="20" height="900" fill="#000" opacity=".06"/>`;
    g += `<rect x="${mx - 56}" y="-620" width="112" height="24" rx="6" fill="${STONE}"/><rect x="${mx - 56}" y="-850" width="112" height="24" rx="6" fill="${STONE}"/>`;
    g += `<path d="M${mx - 40},-900 Q${mx},-1060 ${mx + 40},-900Z" fill="${dome}"/><rect x="${mx - 3}" y="-1100" width="6" height="60" fill="${GOLD}"/>${crescent(mx, -1115, .5)}`;
    for (let i = 0; i < 3; i++) g += `<rect x="${mx - 12}" y="${-560 + i * 150}" width="24" height="60" rx="12" fill="${lit ? GOLDL : '#9CB3C0'}"/>`;
  }
  g += `<rect x="-300" y="-420" width="600" height="420" fill="${wall}"/>`;
  g += `<path d="M-250,-420 C-250,-760 250,-760 250,-420Z" fill="${dome}"/><path d="M-170,-520 C-150,-650 -60,-700 -10,-704" stroke="#fff" stroke-width="16" fill="none" opacity=".5"/>`;
  g += `<rect x="-260" y="-440" width="520" height="30" rx="6" fill="${STONE}"/><rect x="-5" y="-830" width="10" height="90" fill="${GOLD}"/>${crescent(0, -850, .8)}`;
  for (const sx of [-1, 1]) g += `<path d="M${sx * 300 - 90},-300 C${sx * 300 - 90},-420 ${sx * 300 + 90},-420 ${sx * 300 + 90},-300Z" fill="${dome}"/>`;
  for (let i = 0; i < 5; i++) { const ax = -240 + i * 120; g += `<path d="M${ax - 40},0 V-200 Q${ax},-270 ${ax + 40},-200 V0Z" fill="${lit ? GOLDL : '#7FA0B0'}" stroke="${STONE}" stroke-width="8"/>`; }
  g += `<rect x="-320" y="0" width="640" height="30" fill="${STONE}"/>`;
  if (lit) g += `<ellipse cx="0" cy="-200" rx="520" ry="320" fill="${GOLDL}" opacity=".12"/>`;
  return g + '</g>';
}
function crescent(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M10,-40 A40,40 0 1 0 10,40 A32,32 0 1 1 10,-40Z" fill="${GOLD}"/></g>`; }
function skyDawn(t) {
  let g = `<rect width="${W}" height="${H}" fill="url(#gDawn)"/>`;
  g += `<circle cx="540" cy="1150" r="260" fill="#FFD27A" opacity=".55"/><circle cx="540" cy="1150" r="420" fill="#FFB86B" opacity=".18"/>`;
  for (let i = 0; i < 4; i++) { const cx = ((i * 330 + t * 10) % 1400) - 160; g += `<ellipse cx="${cx}" cy="${360 + i * 120}" rx="${160 + i * 20}" ry="26" fill="#fff" opacity=".18"/>`; }
  return g;
}
function skyNight(t) {
  let g = `<rect width="${W}" height="${H}" fill="url(#gNightJ)"/>`;
  for (let i = 0; i < 60; i++) g += `<circle cx="${(i * 397) % W}" cy="${(i * 613) % 1300}" r="${1 + (i % 3) * .8}" fill="#fff" opacity="${.3 + .4 * Math.abs(Math.sin(t * .9 + i))}"/>`;
  g += crescent(820, 300, 1.4).replace(`fill="${GOLD}"`, 'fill="#FFF3C4"') + `<circle cx="820" cy="300" r="120" fill="#FFF3C4" opacity=".08"/>`;
  return g;
}
// ---------- mosque interior with god rays ----------
function mosqueInterior(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="#2A1C12"/>`;
  g += `<rect width="${W}" height="1150" fill="url(#gWall)"/>`;
  // arches
  for (let i = 0; i < 3; i++) { const ax = 180 + i * 360; g += `<path d="M${ax - 170},1150 V420 Q${ax},180 ${ax + 170},420 V1150" fill="none" stroke="#5A3E24" stroke-width="22"/>`; }
  g += latticeWindow(180, 620, 210, 380) + latticeWindow(540, 560, 240, 440) + latticeWindow(900, 620, 210, 380);
  // floor carpet in perspective
  g += `<rect y="1150" width="${W}" height="${H - 1150}" fill="${CARPET}"/>`;
  for (let r = 0; r < 9; r++) { const y = 1150 + Math.pow(r / 9, 1.6) * (H - 1150); g += `<rect y="${y}" width="${W}" height="${6 + r * 2}" fill="${GOLD}" opacity=".35"/>`; }
  for (let i = 0; i < 14; i++) g += `<path d="M${540 + (i - 6.5) * 30},1150 L${540 + (i - 6.5) * 260},${H}" stroke="${CARPET2}" stroke-width="4"/>`;
  if (o.rays !== false) g += lightRays(540, 600, 5, 34, 1400, .55, t) + lightRays(180, 650, 3, 26, 1200, .35, t) + lightRays(900, 650, 3, 26, 1200, .35, t);
  if (o.lamps) for (let i = 0; i < 7; i++) g += hangingLamp(90 + i * 150, 300 + (i % 2) * 60, .9, t);
  g += dust(t, 36);
  return g;
}
// ---------- sajdah (prostration), side view, facing left. origin = knee on floor ----------
function sajdah(x, y, s, o = {}) {
  const robe = o.col || '#F4F1E8', robeD = o.colD || '#D9D2C2', pant = o.pant || '#E6E1D6', skin = o.skin || '#A8714A', cap = o.cap || '#FFFFFF';
  let g = `<g transform="translate(${x},${y}) scale(${o.flip ? -s : s},${s})">`;
  g += `<ellipse cx="-40" cy="4" rx="${o.shadow === false ? 0 : 230}" ry="16" fill="#000" opacity=".22"/>`;
  // lower legs on floor + feet upright on toes
  g += `<path d="M0,-16 L96,-16" stroke="${pant}" stroke-width="34" stroke-linecap="round"/>`;
  g += `<path d="M96,-2 C104,-30 110,-58 112,-72 C120,-74 126,-66 124,-56 L118,-2Z" fill="${skin}"/><path d="M98,-2 h26" stroke="#7A4A2C" stroke-width="5" stroke-linecap="round"/>`;
  // thigh (knee -> hip)
  g += `<path d="M-8,-30 L44,-150" stroke="${robeD}" stroke-width="66" stroke-linecap="round"/>`;
  // torso: hip high, sloping down to the shoulders
  g += `<path d="M78,-150 C70,-206 10,-210 -40,-178 C-90,-148 -140,-112 -168,-70 L-150,-36 C-110,-66 -60,-92 -10,-104 C30,-112 70,-116 78,-150Z" fill="${robe}"/>`;
  g += `<path d="M78,-150 C70,-206 10,-210 -40,-178 C-90,-148 -140,-112 -168,-70" stroke="#fff" stroke-opacity=".5" stroke-width="10" fill="none"/>`;
  g += `<path d="M-6,-104 C30,-112 70,-116 78,-150 C80,-120 60,-80 20,-60 L-12,-40Z" fill="${robeD}"/>`;           // robe hem over thigh
  // upper arm (shoulder -> raised elbow) + forearm flat on floor + palm by the head
  g += `<path d="M-150,-80 L-182,-36" stroke="${robeD}" stroke-width="34" stroke-linecap="round"/><path d="M-182,-30 L-258,-10" stroke="${robe}" stroke-width="28" stroke-linecap="round"/>`;
  g += `<path d="M-262,-2 C-282,-4 -300,-6 -306,-12 C-300,-20 -280,-22 -258,-20Z" fill="${skin}"/>`;
  // head: forehead & nose on the floor
  g += `<path d="M-196,-6 C-236,-4 -250,-34 -238,-62 C-224,-90 -184,-92 -166,-66 C-156,-48 -164,-16 -196,-6Z" fill="${skin}"/>`;
  g += `<path d="M-238,-58 C-226,-92 -180,-96 -164,-66 C-178,-70 -214,-70 -238,-58Z" fill="${cap}"/>`;            // cap on the back of the head
  if (o.beard !== false) g += `<path d="M-200,-8 C-214,-2 -226,-6 -232,-16 C-218,-18 -206,-22 -198,-28Z" fill="${o.beardCol || '#1B1513'}"/>`;
  return g + '</g>';
}
function sajdahRows(t, o = {}) { // congregation in sajdah: rows receding toward the qibla wall
  let g = `<rect width="${W}" height="${H}" fill="#2A1C12"/><rect width="${W}" height="520" fill="url(#gWall)"/>`;
  g += latticeWindow(200, 300, 150, 260, .9) + latticeWindow(540, 270, 170, 300, .95) + latticeWindow(880, 300, 150, 260, .9);
  g += `<rect y="500" width="${W}" height="${H - 500}" fill="${CARPET}"/>`;
  const robes = [['#F4F1E8', '#D9D2C2'], ['#3A4256', '#2C3344'], ['#FFFFFF', '#E1DBCF'], ['#5C6B80', '#4A576A'], ['#E8E0CF', '#CFC5B0'], ['#2E3440', '#232832'], ['#EDE6F2', '#D2C8DC']];
  const skins = ['#A8714A', '#8F5B3A', '#B8805A', '#C68C62'];
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const p = r / (rows - 1), y = 560 + Math.pow(p, 1.35) * 1280, sc = .26 + p * .62;
    g += `<rect y="${y - 6}" width="${W}" height="${8 + p * 10}" fill="${GOLD}" opacity=".28"/>`;                  // saf line on carpet
    const step = 300 * sc + 10, n = Math.ceil(W / step) + 2, off = (r % 2) * step * .5;
    for (let c = -1; c < n; c++) { const rb = robes[(r * 5 + c * 3 + 70) % robes.length]; g += sajdah(c * step + off + 120 * sc, y, sc, { col: rb[0], colD: rb[1], pant: rb[1], skin: skins[(r + c + 8) % 4], beardCol: (r + c) % 4 === 0 ? '#D9D6D0' : '#1B1513' }); }
  }
  if (o.lamps !== false) for (let i = 0; i < 9; i++) g += hangingLamp(70 + i * 120, 470 + (i % 3) * 70, .75, t);
  g += lightRays(540, 300, 5, 40, 1700, .28, t) + dust(t, 30, [0, 300, 1080, 1500]);
  g += `<rect width="${W}" height="${H}" fill="url(#gTopDark)"/>`;
  return g;
}
// ---------- seated dua (sitting on the heels), side view, facing right. origin = floor under hips ----------
function seatedDua(x, y, s, t, o = {}) {
  const skin = '#B07A52', dark = '#8C5A38', robe = '#F6F2EA', robeD = '#DCD4C4', robeS = '#C9C0AE', br = Math.sin(t * 1.6) * 2;
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<ellipse cx="60" cy="6" rx="300" ry="26" fill="#000" opacity=".28"/>`;
  // folded legs: shins on the floor under the thighs, feet behind
  g += `<path d="M-120,-22 L190,-22" stroke="${robeS}" stroke-width="44" stroke-linecap="round"/>`;
  g += `<path d="M-150,-4 C-170,-6 -186,-14 -188,-30 C-170,-34 -150,-30 -130,-20Z" fill="${dark}"/>`;            // sole/heel behind
  // robe skirt pooled on the floor + thighs forward to the knee
  g += `<path d="M-150,0 C-160,-60 -120,-110 -60,-118 L170,-96 C214,-90 232,-56 226,0Z" fill="${robeD}"/>`;
  g += `<path d="M-110,-20 C-100,-80 -60,-106 0,-108 L180,-88 C206,-80 214,-50 206,-20" fill="${robe}"/>`;
  g += `<path d="M-40,-60 C30,-70 120,-66 190,-44 M-20,-30 C60,-36 130,-30 196,-14" stroke="${robeS}" stroke-width="4" fill="none" opacity=".7"/>`;
  // upright torso (slight forward lean), with breathing
  g += `<g transform="translate(0,${br})">`;
  g += `<path d="M-100,-100 C-120,-220 -100,-330 -40,-370 C0,-392 50,-386 70,-350 C90,-300 86,-200 80,-100Z" fill="${robe}"/>`;
  g += `<path d="M-100,-100 C-120,-220 -100,-330 -40,-370" stroke="${robeS}" stroke-width="12" fill="none" opacity=".6"/><path d="M40,-360 C60,-300 62,-200 60,-110" stroke="${robeS}" stroke-width="5" fill="none" opacity=".5"/>`;
  // upper arm down to elbow, forearm forward-up, cupped hands palms up
  g += `<path d="M20,-340 C40,-300 50,-250 56,-214" stroke="${robeD}" stroke-width="46" stroke-linecap="round" fill="none"/>`;
  g += `<path d="M56,-214 C90,-226 120,-246 146,-262" stroke="${robe}" stroke-width="38" stroke-linecap="round" fill="none"/>`;
  const palm = (dx, dy, c1) => `<g transform="translate(${dx},${dy})"><path d="M146,-300 C190,-312 228,-298 238,-274 C228,-252 192,-244 154,-252 C140,-264 138,-288 146,-300Z" fill="${c1}"/>${[0, 1, 2, 3].map(i => `<path d="M${192 + i * 10},${-306 + i * 3} q16,6 18,24" stroke="${dark}" stroke-width="3" fill="none" opacity=".5"/>`).join('')}<path d="M154,-252 C190,-242 224,-248 238,-270" stroke="${dark}" stroke-width="5" fill="none"/></g>`;
  g += palm(-14, -10, dark) + palm(0, 0, skin);
  // neck + head in profile, facing right, eyes closed, slight upward tilt
  g += `<path d="M-2,-372 L38,-372 L40,-400 L0,-402Z" fill="${dark}"/>`;
  g += `<g transform="translate(18,-450) rotate(-8) scale(.8)"><path d="M-56,-10 C-62,-70 -20,-104 26,-96 C66,-88 82,-56 80,-24 L94,-2 L80,4 C82,26 70,44 46,48 L-20,50 C-46,40 -56,16 -56,-10Z" fill="${skin}"/>`;
  g += `<path d="M-50,12 C-44,60 -8,92 40,86 C68,82 84,58 82,30 C60,44 26,46 -8,30Z" fill="#1B1513"/>`;                // full beard
  g += `<path d="M34,-26 q14,-4 24,4" stroke="#1B1513" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M50,-50 q12,-6 24,0" stroke="#1B1513" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M-16,-20 C-20,-30 -10,-36 -4,-28" stroke="${dark}" stroke-width="5" fill="none"/>`;                // ear
  if (o.tear) { const ty = (t * 20) % 60; g += `<path d="M56,${-12 + ty} c6,9 8,16 0,20 c-8,-4 -6,-11 0,-20z" fill="#CFEFFF" stroke="#fff" stroke-width="2"/>`; }
  // turban
  g += `<path d="M-68,-20 C-80,-110 -10,-140 50,-120 C84,-108 92,-80 84,-56 Q10,-80 -68,-20Z" fill="#FBFAF6"/>` + [0, 1, 2].map(i => `<path d="M-62,${-34 - i * 26} Q10,${-80 - i * 22} 84,${-62 - i * 18}" stroke="#DCD6C8" stroke-width="5" fill="none"/>`).join('');
  g += `</g></g></g>`;
  if (o.tasbih) g += tasbih(x + 330 * s, y - 12 * s, s * .85);
  return g;
}
function tasbih(x, y, s) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  for (let i = 0; i < 33; i++) { const a = i / 33 * Math.PI * 2; g += `<circle cx="${Math.cos(a) * 90}" cy="${Math.sin(a) * 30}" r="10" fill="${i % 11 === 0 ? '#3A2414' : '#6B4423'}"/><circle cx="${Math.cos(a) * 90 - 3}" cy="${Math.sin(a) * 30 - 3}" r="3" fill="#fff" opacity=".35"/>`; }
  g += `<path d="M90,0 q20,30 10,70" stroke="#6B4423" stroke-width="6" fill="none"/><path d="M96,70 l-10,30 h24z" fill="#3A2414"/>`;
  return g + '</g>';
}
// ---------- walking worshipper (full body, side) ----------
function walker(x, y, s, t, o = {}) {
  const ph = t * 6 + (o.seed || 0), lg = Math.sin(ph) * 22, col = o.col || '#F6F2EA', skin = o.skin || '#B07A52';
  return `<g transform="translate(${x},${y + Math.abs(Math.sin(ph)) * -4}) scale(${o.flip ? -s : s},${s})">
    <path d="M-10,-120 L${-10 + lg},0" stroke="#3A3A44" stroke-width="22" stroke-linecap="round"/><path d="M10,-120 L${10 - lg},0" stroke="#4A4A55" stroke-width="22" stroke-linecap="round"/>
    <path d="M-50,-110 C-56,-220 -40,-300 0,-310 C40,-300 56,-220 50,-110Z" fill="${col}"/><path d="M20,-290 L${40 + lg * .6},-170" stroke="${col}" stroke-width="24" stroke-linecap="round"/>
    <circle cx="0" cy="-350" r="38" fill="${skin}"/><path d="M-38,-360 C-40,-400 40,-400 38,-360Z" fill="#fff"/><path d="M-30,-340 C-26,-300 26,-300 34,-340 C20,-326 -20,-326 -30,-340Z" fill="${o.beard || '#1B1513'}"/></g>`;
}
function duaHands(x, y, s, skin = '#B07A52', dark = '#8C5A38') { // two open palms raised, facing viewer
  const hand = (sx) => {
    let g = `<g transform="scale(${sx},1) rotate(-10)">`;
    g += `<path d="M10,260 L20,60 C22,10 40,-20 80,-24 C130,-26 160,0 160,60 L150,260Z" fill="${skin}"/>`;           // palm + wrist
    const fx = [30, 68, 106, 140], fl = [150, 175, 165, 130];
    fx.forEach((f, i) => g += `<rect x="${f - 2}" y="${-24 - fl[i]}" width="34" height="${fl[i] + 40}" rx="17" fill="${skin}"/><path d="M${f + 15},${-24 - fl[i] + 50} h8 M${f + 13},${-24 - fl[i] + 100} h10" stroke="${dark}" stroke-width="3" opacity=".45"/>`);
    g += `<path d="M18,120 C-30,90 -50,40 -40,10 C-30,-6 -10,0 0,20 L30,90Z" fill="${skin}"/>`;                         // thumb
    g += `<path d="M40,150 Q90,110 140,140 M50,90 Q90,60 140,80" stroke="${dark}" stroke-width="5" fill="none" opacity=".4"/>`; // palm lines
    g += `<path d="M10,260 L150,260 L150,420 L10,420Z" fill="#F6F2EA"/><path d="M10,262 h140" stroke="#DCD4C4" stroke-width="8"/>`;
    return g + '</g>';
  };
  return `<g transform="translate(${x},${y}) scale(${s})"><g transform="translate(-20,0)">${hand(-1)}</g><g transform="translate(20,0)">${hand(1)}</g></g>`;
}
function quranRehal(x, y, s, t) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-220,120 L0,-40 L220,120 L190,140 L0,10 L-190,140Z" fill="#6B4423"/><path d="M-160,140 L160,-60 M160,140 L-160,-60" stroke="#5A381C" stroke-width="20"/>
    <path d="M-10,-30 C-80,-70 -170,-60 -230,-20 L-230,40 C-170,0 -80,-10 -10,30Z" fill="#FBF6E8"/><path d="M10,-30 C80,-70 170,-60 230,-20 L230,40 C170,0 80,-10 10,30Z" fill="#FFFDF6"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M-200,${-28 + i * 12} Q-110,${-54 + i * 12} -30,${-18 + i * 12}" stroke="#B8A27A" stroke-width="3" fill="none"/><path d="M30,${-18 + i * 12} Q110,${-54 + i * 12} 200,${-28 + i * 12}" stroke="#B8A27A" stroke-width="3" fill="none"/>`).join('')}
    <path d="M-230,-20 L-230,40 M230,-20 L230,40" stroke="${GOLD}" stroke-width="8"/><circle cx="0" cy="-60" r="${90 + 8 * Math.sin(t * 2)}" fill="${GOLDL}" opacity=".15"/></g>`;
}
function hourglass(x, y, s, p, t) { // p = fraction of sand fallen
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-130" y="-240" width="260" height="30" rx="10" fill="#6B4423"/><rect x="-130" y="210" width="260" height="30" rx="10" fill="#6B4423"/>
    <path d="M-100,-210 C-100,-60 -14,-30 -14,0 C-14,30 -100,60 -100,210 L100,210 C100,60 14,30 14,0 C14,-30 100,-60 100,-210Z" fill="#E6F2F8" fill-opacity=".25" stroke="#CFE3EC" stroke-width="6"/>
    <path d="M${-90 * (1 - p)},${-200 + 190 * p} Q0,${-180 + 190 * p} ${90 * (1 - p)},${-200 + 190 * p} L12,-6 L-12,-6Z" fill="${GOLD}"/>
    <path d="M-92,206 Q0,${206 - 160 * p} 92,206Z" fill="${GOLD}"/><line x1="0" y1="0" x2="0" y2="${200 - 150 * p}" stroke="${GOLD}" stroke-width="4" opacity="${p < 1 ? .9 : 0}" stroke-dasharray="6 6" stroke-dashoffset="${-t * 40}"/></g>`;
}
function door(x, y, s, close) { // close 0 open .. 1 shut
  const w = 150 * close;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-420" width="340" height="440" fill="#FFE9B8"/><path d="M-170,-420 h340 v440 h-340z" fill="none" stroke="#3A2614" stroke-width="20"/>
    <rect x="-160" y="-410" width="${w + 10}" height="420" fill="#5A3A22"/><rect x="${160 - w - 10}" y="-410" width="${w + 10}" height="420" fill="#4E3220"/>
    ${close > .95 ? `<circle cx="-20" cy="-190" r="10" fill="${GOLD}"/><circle cx="20" cy="-190" r="10" fill="${GOLD}"/>` : ''}</g>`;
}
function geoPattern(op = .06, col = '#E8B45A') { // subtle 8-point star pattern
  let g = `<g opacity="${op}">`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 7; c++) { const x = c * 180 + (r % 2) * 90, y = r * 170; g += `<g transform="translate(${x},${y})"><rect x="-40" y="-40" width="80" height="80" fill="none" stroke="${col}" stroke-width="4"/><rect x="-40" y="-40" width="80" height="80" fill="none" stroke="${col}" stroke-width="4" transform="rotate(45)"/></g>`; }
  return g + '</g>';
}
