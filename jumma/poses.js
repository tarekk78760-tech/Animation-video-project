// ===== Anatomical prayer poses (forward kinematics, real proportions) =====
// Unit: head height U. Male ≈ 7.5 heads tall. Ground is y = 0. Side views.
const PROP = { torso: 2.9, neck: .35, thigh: 1.95, shin: 1.9, foot: 1.05, uarm: 1.5, farm: 1.25, hand: .75 };

function seg(a, b, wa, wb, col, op = 1) { // tapered limb with round ends
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const p = [[a[0] + nx * wa / 2, a[1] + ny * wa / 2], [b[0] + nx * wb / 2, b[1] + ny * wb / 2], [b[0] - nx * wb / 2, b[1] - ny * wb / 2], [a[0] - nx * wa / 2, a[1] - ny * wa / 2]];
  return `<g opacity="${op}"><path d="M${p[0]} L${p[1]} L${p[2]} L${p[3]}Z" fill="${col}"/><circle cx="${a[0]}" cy="${a[1]}" r="${wa / 2}" fill="${col}"/><circle cx="${b[0]}" cy="${b[1]}" r="${wb / 2}" fill="${col}"/></g>`;
}
function hi(a, b, w, col = '#fff', op = .25, side = 1) { // highlight line along a limb (top side)
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * side, ny = dx / L * side;
  return `<path d="M${a[0] + nx * w * .3},${a[1] + ny * w * .3} L${b[0] + nx * w * .3},${b[1] + ny * w * .3}" stroke="${col}" stroke-opacity="${op}" stroke-width="${w * .22}" stroke-linecap="round"/>`;
}
function pt(p, ang, len) { const r = ang * Math.PI / 180; return [p[0] + Math.cos(r) * len, p[1] - Math.sin(r) * len]; } // ang: 0=right, 90=up
function ik(s, w, l1, l2, bendUp = true) { // elbow/knee position from two ends
  const dx = w[0] - s[0], dy = w[1] - s[1], d = Math.min(Math.hypot(dx, dy), l1 + l2 - .01);
  const a = Math.atan2(dy, dx), b = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const ang = a + (bendUp ? -b : b);
  return [s[0] + Math.cos(ang) * l1, s[1] + Math.sin(ang) * l1];
}

// ---------- profile head (facing left when dir=-1, right when dir=1) ----------
function profileHead(c, U, dir, rot, o) {
  const skin = o.skin, dark = o.skinD, r = U * .5;
  let g = `<g transform="translate(${c[0]},${c[1]}) rotate(${rot}) scale(${dir},1)">`;
  g += `<ellipse cx="0" cy="0" rx="${r * .92}" ry="${r}" fill="${skin}"/>`;
  g += `<path d="M${r * .7},${-r * .35} Q${r * 1.12},${-r * .05} ${r * 1.0},${r * .12} L${r * .84},${r * .2}" fill="${skin}"/>`;              // nose
  g += `<path d="M${r * .78},${r * .3} Q${r * .9},${r * .62} ${r * .55},${r * .95} L${r * .1},${r * .9} Z" fill="${skin}"/>`;             // jaw/chin
  g += `<ellipse cx="${-r * .12}" cy="${r * .05}" rx="${r * .16}" ry="${r * .24}" fill="${dark}"/>`;                                      // ear
  g += `<path d="M${r * .42},${-r * .2} q${r * .14},${r * .06} ${r * .26},0" stroke="#1B1513" stroke-width="${U * .045}" fill="none" stroke-linecap="round"/>`; // closed eye
  g += `<path d="M${r * .36},${-r * .42} q${r * .18},${-r * .08} ${r * .34},${-r * .02}" stroke="#1B1513" stroke-width="${U * .05}" fill="none" stroke-linecap="round"/>`; // brow
  if (o.beard !== false) g += `<path d="M${-r * .25},${r * .2} C${-r * .2},${r * 1.0} ${r * .3},${r * 1.32} ${r * .66},${r * 1.08} C${r * .9},${r * .9} ${r * .96},${r * .5} ${r * .86},${r * .32} C${r * .6},${r * .48} ${r * .3},${r * .5} 0,${r * .3}Z" fill="${o.beardCol || '#1B1513'}"/>`;
  g += `<path d="M${r * .58},${r * .4} q${r * .2},${-r * .06} ${r * .32},${r * .02}" stroke="${o.beardCol || '#1B1513'}" stroke-width="${U * .06}" fill="none" stroke-linecap="round"/>`; // moustache
  if (o.turban) { g += `<path d="M${-r * 1.0},${-r * .05} C${-r * 1.12},${-r * 1.15} ${r * .2},${-r * 1.45} ${r * .86},${-r * .62} Q${r * .1},${-r * .52} ${-r * 1.0},${-r * .05}Z" fill="#FBFAF6"/>` + [0, 1, 2].map(i => `<path d="M${-r * .95},${-r * (.2 + i * .28)} Q${r * .1},${-r * (.7 + i * .25)} ${r * .8},${-r * (.68 + i * .14)}" stroke="#DCD6C8" stroke-width="${U * .05}" fill="none"/>`).join(''); }
  else g += `<path d="M${-r * .92},${-r * .25} C${-r * .9},${-r * 1.02} ${r * .5},${-r * 1.12} ${r * .7},${-r * .5} Q${-r * .1},${-r * .62} ${-r * .92},${-r * .25}Z" fill="${o.cap || '#FFFFFF'}"/>`;
  if (o.tear) { const ty = ((o.t || 0) * .6 % 1) * r * .9; g += `<path d="M${r * .5},${-r * .1 + ty} c${r * .08},${r * .12} ${r * .1},${r * .22} 0,${r * .26} c${-r * .1},${-r * .04} ${-r * .08},${-r * .14} 0,${-r * .26}z" fill="#CFEFFF" stroke="#fff" stroke-width="2"/>`; }
  return g + '</g>';
}

// ---------- SAJDAH (facing left). origin = point on floor under the knees ----------
function sajdahReal(x, y, U, o = {}) {
  const P = PROP, robe = o.robe || '#F4F1E8', robeD = o.robeD || '#D8D0BF', pant = o.pant || '#E2DCCF', skin = o.skin || '#A8714A', skinD = o.skinD || '#86553A';
  const K = [0, -U * .28];                                   // knee (resting on floor)
  const Toe = [P.shin * U + U * .35, 0];                     // toes on floor behind
  const A = [Toe[0] - U * .12, -U * .62];                    // ankle raised (foot upright)
  const Hp = pt(K, 97, P.thigh * U);                         // hip almost straight above knee
  const S = pt(Hp, 203, P.torso * U * .92);                  // shoulder: torso slopes down-forward ~23°
  const Hc = [S[0] - U * .5, -U * .46];                      // head: forehead/nose on floor
  const Wr = [Hc[0] - U * .05, -U * .12];                     // wrist beside the head
  const Fing = [Wr[0] - P.hand * U, -U * .06];
  const E = ik(S, Wr, P.uarm * U, P.farm * U, false);        // elbow raised off the floor
  let g = `<g transform="translate(${x},${y})${o.flip ? ' scale(-1,1)' : ''}">`;
  if (o.shadow !== false) g += `<ellipse cx="${-U * 1.2}" cy="${U * .05}" rx="${U * 4.6}" ry="${U * .28}" fill="#000" opacity=".22"/>`;
  // far-side limbs (darker)
  g += seg([U * .3, -U * .26], [A[0] + U * .2, A[1] + U * .1], U * .56, U * .4, robeD, .9);
  g += seg([S[0] + U * .2, S[1] - U * .05], [E[0] + U * .3, E[1] - U * .05], U * .5, U * .42, robeD, .9);
  // shin + foot (near side)
  g += seg(K, A, U * .6, U * .38, pant) + hi(K, A, U * .6, '#fff', .2, 1);
  g += `<path d="M${A[0] - U * .16},${A[1]} L${A[0] + U * .2},${A[1] - U * .06} L${Toe[0] + U * .16},${-U * .1} L${Toe[0] - U * .3},${0} Z" fill="${skin}"/><path d="M${Toe[0] - U * .36},0 h${U * .55}" stroke="${skinD}" stroke-width="${U * .1}" stroke-linecap="round"/>`;
  // robe: thigh + torso as one garment (curved back sloping down to the shoulders)
  g += seg(K, Hp, U * .82, U * 1.0, robeD);
  const M = [(Hp[0] + S[0]) / 2, (Hp[1] + S[1]) / 2];
  g += `<path d="M${K[0] + U * .42},${K[1] + U * .12} L${Hp[0] + U * .5},${Hp[1] + U * .05} C${Hp[0] + U * .45},${Hp[1] - U * .55} ${M[0] + U * .2},${M[1] - U * .78} ${M[0] - U * .3},${M[1] - U * .5} C${S[0] + U * .3},${S[1] - U * .5} ${S[0] - U * .1},${S[1] - U * .36} ${S[0] - U * .3},${S[1] - U * .1} L${S[0] - U * .05},${S[1] + U * .45} C${M[0]},${M[1] + U * .42} ${Hp[0] - U * .3},${Hp[1] + U * .55} ${K[0] - U * .3},${K[1] + U * .1}Z" fill="${robe}"/>`;
  g += `<path d="M${Hp[0] + U * .45},${Hp[1] - U * .1} C${Hp[0] + U * .4},${Hp[1] - U * .55} ${M[0] + U * .2},${M[1] - U * .72} ${M[0] - U * .3},${M[1] - U * .46}" stroke="#fff" stroke-opacity=".45" stroke-width="${U * .12}" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M${Hp[0] - U * .1},${Hp[1] + U * .4} C${Hp[0] - U * .3},${Hp[1] + U * .9} ${K[0] - U * .1},${K[1] - U * .5} ${K[0] - U * .2},${K[1]}" stroke="${robeD}" stroke-width="${U * .07}" fill="none"/>`;
  g += `<path d="M${M[0] - U * .1},${M[1] - U * .2} C${M[0] - U * .2},${M[1] + U * .1} ${M[0] - U * .5},${M[1] + U * .25} ${S[0] + U * .1},${S[1] + U * .2}" stroke="${robeD}" stroke-width="${U * .06}" fill="none" opacity=".8"/>`;
  // neck
  g += seg([S[0] - U * .1, S[1] + U * .05], [Hc[0] + U * .3, Hc[1] - U * .05], U * .38, U * .34, skinD);
  // head, face down: forehead and nose on the floor
  g += profileHead(Hc, U, -1, -68, { skin, skinD, cap: o.cap, beard: o.beard, beardCol: o.beardCol });
  // near arm in front: sleeve to the raised elbow, forearm down, palm flat beside the head
  g += seg(S, E, U * .5, U * .42, robe) + hi(S, E, U * .5, '#fff', .3, -1);
  g += seg(E, Wr, U * .42, U * .3, robe);
  g += `<path d="M${Wr[0] + U * .1},${Wr[1] - U * .12} L${Fing[0] + U * .1},${-U * .12} Q${Fing[0] - U * .05},${-U * .02} ${Fing[0] + U * .1},0 L${Wr[0] + U * .14},0Z" fill="${skin}"/>`;
  return g + '</g>';
}

// ---------- SEATED DUA, iftirash (facing right). origin = floor under the hips ----------
function seatedDuaReal(x, y, U, t, o = {}) {
  const P = PROP, robe = o.robe || '#F6F2EA', robeD = o.robeD || '#DCD4C4', robeS = '#C9C0AE', skin = o.skin || '#B07A52', skinD = o.skinD || '#8C5A38';
  const br = Math.sin((t || 0) * 1.6) * U * .03;
  const Hp = [0, -U * 1.0];                                  // sitting on the heels
  const K = [P.thigh * U * .98, -U * .3];                    // knee on the floor in front
  const A = [-U * .1, -U * .3];                              // ankle under the hips
  const S = pt(Hp, 86, P.torso * U);                         // upright torso, tiny forward lean
  S[1] += br;
  const Hc = pt(S, 80, P.neck * U + U * .55);
  const E = [S[0] + U * .55, S[1] + P.uarm * U * .9];        // elbows close to the sides
  const Wr = pt(E, 32, P.farm * U);                          // forearms forward and up
  let g = `<g transform="translate(${x},${y})${o.flip ? ' scale(-1,1)' : ''}">`;
  g += `<ellipse cx="${U * .9}" cy="${U * .05}" rx="${U * 3.2}" ry="${U * .26}" fill="#000" opacity=".26"/>`;
  // shins folded on the floor + upright right foot behind
  g += seg(K, A, U * .58, U * .42, robeS);
  g += `<path d="M${A[0] - U * .2},${-U * .08} L${A[0] - U * .55},${-U * .02} L${A[0] - U * .62},${-U * .7} L${A[0] - U * .42},${-U * .74}Z" fill="${skinD}"/><path d="M${A[0] - U * .62},0 h${U * .5}" stroke="${skinD}" stroke-width="${U * .1}" stroke-linecap="round"/>`;
  // robe skirt over thighs, pooling on the floor
  g += `<path d="M${Hp[0] - U * .9},0 C${Hp[0] - U * 1.05},${-U * .7} ${Hp[0] - U * .7},${Hp[1] - U * .3} ${Hp[0]},${Hp[1] - U * .35} L${K[0] - U * .1},${K[1] - U * .45} C${K[0] + U * .4},${K[1] - U * .35} ${K[0] + U * .55},${-U * .2} ${K[0] + U * .5},0Z" fill="${robeD}"/>`;
  g += `<path d="M${Hp[0] - U * .6},${-U * .1} C${Hp[0] - U * .7},${-U * .7} ${Hp[0] - U * .4},${Hp[1] - U * .2} ${Hp[0] + U * .1},${Hp[1] - U * .28} L${K[0] - U * .2},${K[1] - U * .4} C${K[0] + U * .25},${K[1] - U * .28} ${K[0] + U * .3},${-U * .25} ${K[0] + U * .3},${-U * .1}Z" fill="${robe}"/>`;
  g += `<path d="M${Hp[0] + U * .2},${Hp[1] + U * .05} C${U * 1.0},${Hp[1] + U * .1} ${U * 1.5},${-U * .5} ${K[0]},${-U * .4} M${Hp[0] + U * .1},${-U * .4} C${U * .8},${-U * .35} ${U * 1.4},${-U * .2} ${K[0] + U * .1},${-U * .15}" stroke="${robeS}" stroke-width="${U * .05}" fill="none" opacity=".8"/>`;
  // torso (thobe)
  g += `<path d="M${Hp[0] - U * .62},${Hp[1] + U * .2} C${Hp[0] - U * .72},${(Hp[1] + S[1]) / 2} ${S[0] - U * .66},${S[1] + U * .3} ${S[0] - U * .42},${S[1] - U * .06} Q${S[0]},${S[1] - U * .3} ${S[0] + U * .4},${S[1] - U * .02} C${S[0] + U * .56},${S[1] + U * .6} ${Hp[0] + U * .66},${(Hp[1] + S[1]) / 2 + U * .4} ${Hp[0] + U * .6},${Hp[1] + U * .1}Z" fill="${robe}"/>`;
  g += `<path d="M${Hp[0] - U * .55},${Hp[1]} C${Hp[0] - U * .64},${(Hp[1] + S[1]) / 2} ${S[0] - U * .6},${S[1] + U * .3} ${S[0] - U * .42},${S[1] - U * .02}" stroke="${robeS}" stroke-width="${U * .12}" fill="none" opacity=".55"/>`;
  g += `<path d="M${S[0] + U * .22},${S[1] + U * .1} L${S[0] + U * .2},${S[1] + U * 1.2}" stroke="${robeS}" stroke-width="${U * .04}" opacity=".7"/>`;
  // far arm + hand (slightly behind, darker)
  g += seg([S[0] - U * .05, S[1] + U * .2], [E[0] - U * .15, E[1] - U * .08], U * .48, U * .4, robeD) + seg([E[0] - U * .15, E[1] - U * .08], [Wr[0] - U * .18, Wr[1] - U * .1], U * .4, U * .3, robeD);
  g += palmUp([Wr[0] - U * .18, Wr[1] - U * .1], U, skinD, skinD);
  // neck + head (tilted slightly up)
  g += seg([S[0], S[1] - U * .02], [Hc[0] - U * .05, Hc[1] + U * .35], U * .36, U * .34, skinD);
  g += profileHead(Hc, U, 1, -10, { skin, skinD, turban: o.turban !== false, cap: o.cap, beardCol: o.beardCol, tear: o.tear, t });
  // near arm: sleeve to elbow, forearm, cupped hand palm-up
  g += seg([S[0] + U * .05, S[1] + U * .25], E, U * .52, U * .42, robe) + hi([S[0] + U * .05, S[1] + U * .25], E, U * .52, '#fff', .35, 1);
  g += seg(E, Wr, U * .42, U * .32, robe);
  g += palmUp(Wr, U, skin, skinD);
  g += `</g>`;
  if (o.tasbih) g += tasbih(x + U * 4.2, y - U * .12, U / 95);
  return g;
}
function palmUp(w, U, skin, dark) { // cupped hand seen from the side, palm facing up
  return `<path d="M${w[0] - U * .05},${w[1] - U * .12} C${w[0] + U * .3},${w[1] - U * .28} ${w[0] + U * .72},${w[1] - U * .22} ${w[0] + U * .82},${w[1] - U * .02} C${w[0] + U * .7},${w[1] + U * .18} ${w[0] + U * .25},${w[1] + U * .2} ${w[0] - U * .04},${w[1] + U * .12}Z" fill="${skin}"/><path d="M${w[0] + U * .78},${w[1] - U * .06} q${U * .08},${-U * .1} ${U * .02},${-U * .2}" stroke="${skin}" stroke-width="${U * .1}" stroke-linecap="round" fill="none"/><path d="M${w[0] + U * .1},${w[1] + U * .1} C${w[0] + U * .4},${w[1] + U * .14} ${w[0] + U * .66},${w[1] + U * .1} ${w[0] + U * .8},${w[1] - U * .02}" stroke="${dark}" stroke-width="${U * .05}" fill="none"/>`;
}

// ---------- congregation in sajdah ----------
function sajdahRowsReal(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="#2A1C12"/><rect width="${W}" height="520" fill="url(#gWall)"/>`;
  g += latticeWindow(200, 300, 150, 260, .9) + latticeWindow(540, 270, 170, 300, .95) + latticeWindow(880, 300, 150, 260, .9);
  g += `<rect y="500" width="${W}" height="${H - 500}" fill="${CARPET}"/>`;
  const robes = [['#F4F1E8', '#D9D2C2', '#E2DCCF'], ['#3A4256', '#2C3344', '#2C3344'], ['#FFFFFF', '#E1DBCF', '#EAE5DA'], ['#5C6B80', '#4A576A', '#3E4A5C'], ['#E8E0CF', '#CFC5B0', '#D8CFBC'], ['#2E3440', '#232832', '#232832'], ['#EDE6F2', '#D2C8DC', '#D9D0E2']];
  const skins = [['#A8714A', '#86553A'], ['#8F5B3A', '#6E4229'], ['#B8805A', '#946042'], ['#C68C62', '#A26C45']];
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const p = r / (rows - 1), y = 600 + Math.pow(p, 1.3) * 1220, U = 22 + p * 62;
    g += `<rect y="${y - 4}" width="${W}" height="${6 + p * 10}" fill="${GOLD}" opacity=".3"/>`;
    const step = U * 7.4, n = Math.ceil(W / step) + 2, off = (r % 2) * step * .5;
    for (let c = -1; c < n; c++) { const rb = robes[(r * 5 + c * 3 + 70) % robes.length], sk = skins[(r + c + 8) % 4]; g += sajdahReal(c * step + off + U * 3, y, U, { robe: rb[0], robeD: rb[1], pant: rb[2], skin: sk[0], skinD: sk[1], beardCol: (r + c) % 4 === 0 ? '#D9D6D0' : '#1B1513' }); }
  }
  if (o.lamps !== false) for (let i = 0; i < 9; i++) g += hangingLamp(70 + i * 120, 470 + (i % 3) * 70, .75, t);
  g += lightRays(540, 300, 5, 40, 1700, .28, t) + dust(t, 30, [0, 300, 1080, 1500]);
  g += `<rect width="${W}" height="${H}" fill="url(#gTopDark)"/>`;
  return g;
}
