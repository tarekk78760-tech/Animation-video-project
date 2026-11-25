// Atomic Habits (Bangla) — TR Universe 0.1
// Everything is drawn in a 720x1280 logical space, rendered at 1080x1920.
const W = 720, H = 1280, SCALE = 1.5, DUR = 58.28;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#1e1a16', FLOOR = 1000;
const FONT = 'HS, "Hind Siliguri", sans-serif';

// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const P = (t, a, b) => clamp((t - a) / (b - a));
const sm = x => x * x * (3 - 2 * x);
const eo = x => 1 - Math.pow(1 - x, 3);
const back = x => { const c1 = 1.9, c3 = c1 + 1; return x <= 0 ? 0 : x >= 1 ? 1 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function line(pts, w = 5, c = INK) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke(); }
function circ(x, y, r, fill, stroke, w = 5) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = w; ctx.strokeStyle = stroke; ctx.stroke(); } }
function txt(s, x, y, size, color, o = {}) {
  ctx.save();
  ctx.font = `${o.weight || 700} ${size}px ${FONT}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.sw || size * 0.18; ctx.strokeStyle = o.stroke; ctx.strokeText(s, x, y); }
  ctx.fillStyle = color; ctx.fillText(s, x, y);
  ctx.restore();
}
// pop-in title: scale with overshoot, fades out at t1
function pop(t, t0, t1, fn, x, y) {
  if (t < t0 || t > t1 + 0.35) return;
  const k = back(P(t, t0, t0 + 0.45)), out = 1 - P(t, t1, t1 + 0.35);
  ctx.save(); ctx.globalAlpha *= clamp(P(t, t0, t0 + 0.2)) * out;
  ctx.translate(x, y); ctx.scale(lerp(0.4, 1, k), lerp(0.4, 1, k)); fn(); ctx.restore();
}
function star(x, y, r, c) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
function check(x, y, s, c = '#2e9e5b', w = 7) { line([[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], w, c); }
function cross(x, y, s, c = '#e04848', w = 10) { line([[x - s, y - s], [x + s, y + s]], w, c); line([[x + s, y - s], [x - s, y + s]], w, c); }
function arrow(x1, y1, x2, y2, c = INK, w = 5, dash) {
  ctx.save(); if (dash) ctx.setLineDash(dash); line([[x1, y1], [x2, y2]], w, c); ctx.restore();
  const a = Math.atan2(y2 - y1, x2 - x1), h = 16;
  line([[x2 - Math.cos(a - 0.5) * h, y2 - Math.sin(a - 0.5) * h], [x2, y2], [x2 - Math.cos(a + 0.5) * h, y2 - Math.sin(a + 0.5) * h]], w, c);
}

// ---------- character ----------
function ik(a, b, l1, l2, bend) {
  let dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  const L = l1 + l2 - 0.5;
  if (d > L) { b = [a[0] + dx / d * L, a[1] + dy / d * L]; d = L; }
  const ang = Math.atan2(dy, dx) + bend * Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  return [[a[0] + Math.cos(ang) * l1, a[1] + Math.sin(ang) * l1], b];
}
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

// o: {x,y hip pos, s scale, lean, face(-1..1), look:[x,y], mood, hands:[[x,y] near,[x,y] far] (local, hip-relative),
//     feet:[near,far] local, kneeBend, elbowBend:[n,f], dir (-1 left/+1 right), t, headphones, seed}
function drawChar(o) {
  const t = o.t || 0, dir = o.dir || -1, lean = o.lean || 0;
  const breath = Math.sin(t * 2.4 + (o.seed || 0)) * 2;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(o.s || 1, o.s || 1);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const neck = rot(0, -150 - breath, lean), head = rot(0, -150 - 56 - breath, lean);
  const sh = rot(0, -118 - breath, lean);
  const hip = [0, 6];
  const kb = o.kneeBend ?? (dir < 0 ? 1 : -1);
  const eb = o.elbowBend || [dir < 0 ? -1 : 1, dir < 0 ? -1 : 1];
  const leg = (f) => { const [k, e] = ik(hip, f, 88, 100, kb); line([hip, k, e], 5.5); ctx.beginPath(); ctx.ellipse(e[0] + dir * 9, e[1] + 2, 21, 10, 0, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); };
  const arm = (h, b) => { const [el, e] = ik(sh, h, 72, 70, b); line([sh, el, e], 5); circ(e[0], e[1], 12, '#fff', INK, 3.5); };
  // far limbs
  leg(o.feet[1]); arm(o.hands[1], eb[1]);
  leg(o.feet[0]);
  // torso (bean)
  ctx.save(); ctx.rotate(lean);
  ctx.beginPath(); ctx.moveTo(-25, 0);
  ctx.bezierCurveTo(-30, -60, -24, -120, -16, -150 - breath);
  ctx.quadraticCurveTo(0, -164 - breath, 16, -150 - breath);
  ctx.bezierCurveTo(24, -120, 30, -60, 25, 0);
  ctx.quadraticCurveTo(0, 26, -25, 0); ctx.closePath();
  const g = ctx.createLinearGradient(-25, 0, 25, 0); g.addColorStop(0, '#fff'); g.addColorStop(1, '#e4e4e4');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  line([[dir * 8, -62], [dir * 12, -56]], 3); line([[dir * 6, -48], [dir * 11, -43]], 3);
  ctx.restore();
  // near arm
  arm(o.hands[0], eb[0]);
  // head
  const [hx, hy] = head, R = 60;
  const hg = ctx.createRadialGradient(hx - 18, hy - 22, 10, hx, hy, R);
  hg.addColorStop(0, '#ffffff'); hg.addColorStop(0.7, '#f3f3f3'); hg.addColorStop(1, '#d6d6d6');
  circ(hx, hy, R, hg, INK, 6);
  if (o.headphones) {
    ctx.beginPath(); ctx.arc(hx, hy, R + 8, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 9; ctx.strokeStyle = '#e2574c'; ctx.stroke();
    rr(hx - R - 16, hy - 20, 20, 42, 8); ctx.fillStyle = '#e2574c'; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke();
    rr(hx + R - 4, hy - 20, 20, 42, 8); ctx.fill(); ctx.stroke();
  }
  drawFace(hx + (o.face ?? dir * 0.45) * 18 + (o.look ? o.look[0] * 6 : 0), hy + (o.look ? o.look[1] * 7 : 0), o.mood || 'neutral', t, o.seed || 0);
  ctx.restore();
}
function drawFace(x, y, mood, t, seed) {
  const ex = 19, ey = y - 6;
  const blink = ((t + seed * 0.7) % 3.4) < 0.11 ? 0.12 : 1;
  ctx.fillStyle = INK;
  if (mood === 'joy' || mood === 'proud') {
    // closed happy eyes ^ ^
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * ex, ey + 4, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.stroke(); }
  } else {
    const ry = mood === 'wow' ? 10 : 8;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * ex, ey, mood === 'wow' ? 7 : 5.5, ry * blink, 0, 0, Math.PI * 2); ctx.fill(); }
    if (blink === 1) { ctx.fillStyle = '#fff'; for (const s of [-1, 1]) circ(x + s * ex + 1.5, ey - 3, 1.8, '#fff'); }
  }
  ctx.lineWidth = 4; ctx.strokeStyle = INK;
  const brow = (a, b) => line([a, b], 4);
  const by = ey - 19;
  if (mood === 'sad' || mood === 'worried') { brow([x - ex - 9, by + 4], [x - ex + 8, by - 3]); brow([x + ex - 8, by - 3], [x + ex + 9, by + 4]); }
  else if (mood === 'focus') { brow([x - ex - 9, by - 3], [x - ex + 8, by + 3]); brow([x + ex - 8, by + 3], [x + ex + 9, by - 3]); }
  else if (mood === 'wow') { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * ex, by + 2, 9, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } }
  else { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * ex, by + 6, 9, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); } }
  const my = y + 24;
  ctx.beginPath();
  if (mood === 'sad') { ctx.arc(x, my + 12, 13, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
  else if (mood === 'worried') { ctx.moveTo(x - 12, my + 2); ctx.quadraticCurveTo(x - 6, my - 4, x, my + 1); ctx.quadraticCurveTo(x + 6, my + 6, x + 12, my); ctx.stroke(); }
  else if (mood === 'neutral' || mood === 'focus') { ctx.moveTo(x - 9, my); ctx.lineTo(x + 9, my); ctx.stroke(); }
  else if (mood === 'wow') { ctx.ellipse(x, my + 2, 7, 9, 0, 0, Math.PI * 2); ctx.fillStyle = '#3b2020'; ctx.fill(); }
  else if (mood === 'happy') { ctx.arc(x, my - 8, 15, Math.PI * 0.18, Math.PI * 0.82); ctx.stroke(); }
  else { // joy / proud: open smile
    ctx.moveTo(x - 17, my - 4); ctx.quadraticCurveTo(x, my + 26, x + 17, my - 4); ctx.closePath();
    ctx.fillStyle = '#4a2222'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, my + 8, 7, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#e8837a'; ctx.fill();
  }
}

// standard poses (hip-relative, character facing left)
const SIT = { feet: [[-82, 150], [-64, 152]], lap: [[-62, 22], [-48, 18]], desk: [[-120, -68], [-104, -72]] };
const STAND = { feet: [[-14, 186], [14, 186]], down: [[-38, -24], [30, -26]] };
function sitChar(t, o) { // seated at the chair to the right of the desk
  drawChar(Object.assign({ x: 525, y: 832, s: 1.1, t, dir: -1, lean: -0.08, feet: SIT.feet, hands: SIT.desk, mood: 'neutral' }, o));
}

// ---------- room ----------
const NOTE_COLORS = ['#f6e27a', '#f7b6b0', '#a8e0c8', '#a9cdf0', '#f9c98a'];
const NOTES = (() => { const r = rng(7), a = []; for (let i = 0; i < 46; i++) a.push({ x: 60 + r() * 340, y: 190 + r() * 330, c: NOTE_COLORS[i % 5], a: (r() - 0.5) * 0.35, s: 0.8 + r() * 0.4 }); return a; })();
function wall(top = '#f1e6d6', bot = '#e3d3bf') { const g = ctx.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, FLOOR); }
function floor() {
  const g = ctx.createLinearGradient(0, FLOOR, 0, H); g.addColorStop(0, '#caa27a'); g.addColorStop(1, '#a87f58');
  ctx.fillStyle = g; ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.strokeStyle = 'rgba(80,50,25,0.25)'; ctx.lineWidth = 2;
  for (let i = 1; i < 6; i++) { const y = FLOOR + i * i * 9; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  line([[0, FLOOR], [W, FLOOR]], 5, '#7b5536');
}
function clock(x, y, r, t) {
  circ(x, y, r, '#fbf8f2', INK, 5);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line([[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.88, y + Math.sin(a) * r * 0.88]], 3); }
  const m = t * 0.9, hA = -Math.PI / 2 + (10 + m / 12) * Math.PI / 6, mA = -Math.PI / 2 + m * Math.PI / 30 * 6;
  line([[x, y], [x + Math.cos(hA) * r * 0.45, y + Math.sin(hA) * r * 0.45]], 5);
  line([[x, y], [x + Math.cos(mA) * r * 0.7, y + Math.sin(mA) * r * 0.7]], 3.5);
  circ(x, y, 4, INK);
}
function plant(x, y, s = 1, grow = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const [a, l] of [[-0.6, 60], [-0.2, 75], [0.25, 70], [0.65, 55], [0, 50]]) {
    ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -l * 0.55 * grow, 12 * grow, l * 0.5 * grow, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#6f9a5c'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3d5a30'; ctx.stroke(); ctx.restore();
  }
  ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(20, 44); ctx.lineTo(-20, 44); ctx.closePath();
  ctx.fillStyle = '#c56b46'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
function shelf(top = 430) {
  rr(598, top, 116, FLOOR - top, 6); ctx.fillStyle = '#8a5a36'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  const r = rng(3), cols = ['#c0584a', '#4f7ca8', '#d9a441', '#6b9a6a', '#8c6bb0', '#e08b5a'];
  for (let y = top + 14; y < FLOOR - 90; y += 112) {
    let x = 608;
    while (x < 700) { const w = 10 + r() * 9, h = 64 + r() * 26; ctx.fillStyle = cols[Math.floor(r() * 6)]; ctx.fillRect(x, y + 92 - h, w, h); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y + 92 - h, w, h); x += w + 2; }
    line([[600, y + 94], [712, y + 94]], 5, '#5e3a20');
  }
}
function desk(t, items = {}) {
  // lamp glow
  const lg = ctx.createRadialGradient(150, 690, 10, 150, 690, 330);
  lg.addColorStop(0, 'rgba(255,214,140,0.55)'); lg.addColorStop(1, 'rgba(255,214,140,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, 360, 520, 640);
  // legs + top
  ctx.fillStyle = '#6b4329'; ctx.fillRect(48, 780, 20, FLOOR - 780); ctx.fillRect(398, 780, 20, FLOOR - 780);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(48, 780, 20, FLOOR - 780); ctx.strokeRect(398, 780, 20, FLOOR - 780);
  rr(26, 756, 414, 28, 6); ctx.fillStyle = '#8a5634'; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
  rr(70, 784, 326, 42, 4); ctx.fillStyle = '#7a4a2c'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke(); circ(233, 805, 5, '#d9b27a', INK, 2);
  // lamp
  line([[96, 756], [96, 748]], 6); rr(70, 742, 56, 12, 5); ctx.fillStyle = '#5f8d6a'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke();
  line([[98, 744], [120, 680], [160, 652]], 6, '#4d7558');
  ctx.save(); ctx.translate(165, 655); ctx.rotate(0.5); ctx.beginPath(); ctx.moveTo(-26, -6); ctx.lineTo(26, -6); ctx.lineTo(38, 30); ctx.lineTo(-38, 30); ctx.closePath(); ctx.fillStyle = '#6a9b74'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  // notebook + pen cup
  if (items.notebook !== false) { rr(196, 736, 110, 20, 3); ctx.fillStyle = '#f4efe4'; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke(); line([[200, 746], [300, 746]], 2, '#9b8f7d'); }
  if (items.cup !== false) { rr(330, 712, 34, 44, 5); ctx.fillStyle = '#d98b5f'; ctx.fill(); ctx.lineWidth = 3.5; ctx.stroke(); line([[338, 712], [334, 690]], 3, '#3a6fb0'); line([[350, 712], [354, 686]], 3, '#c94b4b'); }
}
function chair() {
  ctx.fillStyle = '#9a6640'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  const R = (x, y, w, h) => { ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h); };
  R(588, 610, 16, FLOOR - 610); R(470, 850, 14, FLOOR - 850);
  rr(456, 836, 150, 18, 5); ctx.fill(); ctx.stroke();
  R(586, 640, 24, 14); R(586, 700, 24, 14);
}
function corkboard(x, y, w, h, label = 'GOALS') {
  rr(x, y, w, h, 8); ctx.fillStyle = '#6d4628'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  rr(x + 14, y + 14, w - 28, h - 28, 4); ctx.fillStyle = '#c99b68'; ctx.fill();
  // little speckle
  const r = rng(11); ctx.fillStyle = 'rgba(110,70,35,.25)'; for (let i = 0; i < 90; i++) ctx.fillRect(x + 16 + r() * (w - 32), y + 16 + r() * (h - 32), 2, 2);
  rr(x + w / 2 - 95, y - 46, 190, 58, 6); ctx.fillStyle = '#fbf7ef'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  txt(label, x + w / 2, y - 16, 40, INK, { weight: 700 });
}
function note(n, alpha = 1, k = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(n.x, n.y); ctx.rotate(n.a); ctx.scale(n.s * k, n.s * k);
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(-22, -20, 48, 48);
  ctx.fillStyle = n.c; ctx.fillRect(-25, -25, 48, 48); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5; ctx.strokeRect(-25, -25, 48, 48);
  ctx.strokeStyle = 'rgba(60,40,20,.45)'; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-17, -12 + i * 11); ctx.lineTo(14 - i * 5, -12 + i * 11); ctx.stroke(); }
  circ(0, -21, 4, '#d84a4a');
  ctx.restore();
}
function room(t, o = {}) {
  wall(); floor();
  if (o.clock !== false) clock(o.clockX || 640, o.clockY || 130, 46, t);
  if (o.shelf !== false) { shelf(o.shelfTop || 430); plant(656, o.shelfTop || 430, 0.75); }
  if (o.desk !== false) { desk(t, o.items || {}); chair(); }
}
function bookObj(x, y, w, h, color, title, sub, a = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  rr(-w / 2 + 10, -h / 2 + 8, w, h, 8); ctx.fillStyle = '#efe7d6'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  rr(-w / 2, -h / 2, w, h, 8); ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
  line([[-w / 2 + 20, -h / 2 + 4], [-w / 2 + 20, h / 2 - 4]], 3, 'rgba(0,0,0,.35)');
  if (title) {
    // small cube motif (original design, not the real cover)
    const cs = w * 0.11;
    for (let i = 0; i < 3; i++) { rr(-cs * 1.6 + i * cs * 1.1, -h * 0.28 - (i === 1 ? cs * 0.6 : 0), cs, cs, 3); ctx.fillStyle = '#f4c64e'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
    txt(title[0], 10, h * 0.0, w * 0.16, '#fff', { weight: 700 });
    txt(title[1], 10, h * 0.14, w * 0.16, '#f4c64e', { weight: 700 });
    line([[-w * 0.25, h * 0.25], [w * 0.35, h * 0.25]], 3, 'rgba(255,255,255,.6)');
    txt(sub, 10, h * 0.34, w * 0.09, '#fff', { weight: 600 });
  }
  ctx.restore();
}
function glow(x, y, r, c = '255,220,120', a = 0.6) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function rays(x, y, r, t, c = 'rgba(255,230,150,0.35)', n = 14) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.25); ctx.fillStyle = c;
  for (let i = 0; i < n; i++) { ctx.rotate(Math.PI * 2 / n); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, -r * 0.12); ctx.lineTo(r, r * 0.12); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function cam(z, cx, cy, fn) { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }

// ---------- scenes ----------
function sceneHook(t) {
  const calm = P(t, 4.3, 5.4);
  cam(lerp(1, 1.05, sm(P(t, 0, 9))), 360, 700, () => {
    room(t, { shelfTop: 430 });
    corkboard(36, 170, 420, 400);
    const n = Math.floor(lerp(16, NOTES.length, eo(P(t, 0, 3.4))));
    for (let i = 0; i < n; i++) note(NOTES[i], 1 - calm * 0.75, i >= 16 ? back(P(t, 0.07 * (i - 16), 0.07 * (i - 16) + 0.3)) : 1);
    // notes falling off the overflowing board
    for (let i = 0; i < 6; i++) { const t0 = 1.6 + i * 0.35, k = P(t, t0, t0 + 1.4); if (k <= 0 || k >= 1) continue; const nn = NOTES[i * 7]; note({ ...nn, x: nn.x + Math.sin(k * 6 + i) * 30, y: lerp(nn.y, 960, eo(k)), a: nn.a + k * 3 }, 1 - calm); }
    const despair = P(t, 1.0, 1.6) * (1 - P(t, 4.3, 4.9));
    const up = P(t, 4.6, 5.3);
    const handsHead = [[-64, -190], [52, -192]];
    let hands = [L2(SIT.desk[0], handsHead[0], despair), L2(SIT.desk[1], handsHead[1], despair)];
    if (up > 0) hands[0] = L2(hands[0], [-140, -230], back(up) * (1 - P(t, 7.6, 8.4)));
    const mood = t < 4.4 ? (despair > 0.5 ? 'worried' : 'sad') : t < 5.2 ? 'wow' : 'joy';
    sitChar(t, { mood, look: t < 4.4 ? [0, 0.4] : [-0.8, -1], lean: -0.08 + despair * 0.12, hands, seed: 1 });
  });
  // "বিশাল কিছু?" overwhelm, struck out
  pop(t, 0.6, 3.9, () => {
    rr(-190, -52, 380, 104, 22); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    txt('বিশাল কিছু?', 0, 2, 62, '#d8453b');
    const k = P(t, 2.4, 2.8); if (k > 0) line([[-160, 6], [lerp(-160, 160, k), -4]], 9, INK);
  }, 250, 360);
  pop(t, 2.8, 3.9, () => { txt('প্রয়োজন নেই!', 0, 0, 48, '#2e9e5b', { stroke: '#fff', sw: 10 }); }, 250, 450);
  // glowing 1%
  if (t > 4.3) {
    const k = back(P(t, 4.3, 5.0)), out = 1 - P(t, 8.7, 9.2);
    ctx.save(); ctx.globalAlpha = out;
    const ox = 250, oy = 380 + Math.sin(t * 2) * 6;
    glow(ox, oy, 260 * k, '255,210,110', 0.7); rays(ox, oy, 240 * k, t);
    circ(ox, oy, 92 * k, '#ffc93c', INK, 6);
    txt('১%', ox, oy + 4, 84 * k, INK);
    // path going far
    const pk = P(t, 6.0, 8.2);
    if (pk > 0) {
      ctx.save(); ctx.setLineDash([4, 14]); ctx.lineDashOffset = -t * 40;
      ctx.beginPath(); ctx.moveTo(ox + 70, oy - 60);
      const ex = lerp(ox + 70, 620, pk), ey = lerp(oy - 60, 120, pk);
      ctx.quadraticCurveTo(lerp(ox + 70, 560, pk), lerp(oy - 60, 330, pk), ex, ey);
      ctx.lineWidth = 6; ctx.strokeStyle = '#d8453b'; ctx.stroke(); ctx.restore();
      if (pk > 0.95) { pop(t, 8.0, 9.0, () => { line([[0, 0], [0, -70]], 5); ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(46, -56); ctx.lineTo(0, -42); ctx.closePath(); ctx.fillStyle = '#d8453b'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); }, 620, 130); }
    }
    ctx.restore();
    pop(t, 5.0, 8.7, () => { rr(-170, -36, 340, 72, 36); ctx.fillStyle = INK; ctx.fill(); txt('মাত্র ১% উন্নতি', 0, 2, 40, '#ffd54a'); }, 250, 530);
  }
}

function sceneBook(t) {
  room(t, {});
  ctx.fillStyle = 'rgba(40,24,12,0.38)'; ctx.fillRect(0, 0, W, H);
  const k2 = sm(P(t, 12.9, 13.6));
  const bx = lerp(330, 360, k2), by = lerp(440, 250, k2), bs = lerp(1, 0.62, k2);
  const kin = back(P(t, 9.1, 9.8));
  glow(bx, by, 300 * bs * kin, '255,215,120', 0.55); rays(bx, by, 300 * bs * kin, t, 'rgba(255,225,150,0.18)');
  bookObj(bx, by + Math.sin(t * 2) * 6, 250 * bs * kin, 350 * bs * kin, '#22324b', ['ATOMIC', 'HABITS'], 'JAMES CLEAR', Math.sin(t * 1.3) * 0.04);
  pop(t, 9.9, 12.9, () => { rr(-110, -28, 220, 56, 28); ctx.fillStyle = '#ffd54a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); star(-80, 0, 13, '#fff'); txt('বিখ্যাত বই', 14, 2, 32, INK); }, 330, 660);
  // small habits -> big change
  if (t > 13.1) {
    const base = 700;
    pop(t, 13.2, 16.9, () => { rr(-28, -28, 56, 56, 8); ctx.fillStyle = '#f4c64e'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }, 70, base - 28);
    pop(t, 13.4, 16.9, () => txt('ছোট অভ্যাস', 0, 0, 26, '#fff', { stroke: INK, sw: 7 }), 78, base + 30);
    if (t > 14.0) arrow(108, base - 30, lerp(108, 160, eo(P(t, 14.0, 14.5))), base - 30, '#fff', 6);
    let i = 0;
    for (let c = 0; c < 4; c++) for (let r = 0; r <= c; r++) {
      const t0 = 14.3 + i * 0.16, kk = back(P(t, t0, t0 + 0.35)); i++;
      if (kk <= 0) continue;
      const x = 175 + c * 64, y = base - 28 - r * 60 - (1 - kk) * 60;
      ctx.save(); ctx.globalAlpha = clamp(kk); rr(x, y - 28, 56, 56, 8); ctx.fillStyle = ['#f4c64e', '#f29b4b', '#e2574c', '#7cc39a'][c]; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    }
    pop(t, 15.6, 16.9, () => txt('বড় পরিবর্তন', 0, 0, 30, '#ffd54a', { stroke: INK, sw: 8 }), 300, base + 30);
  }
  sitChar(t, { mood: t < 13 ? 'wow' : 'joy', look: [-0.6, -1], hands: t > 9.6 && t < 12.6 ? [[-150, -200], SIT.desk[1]] : SIT.desk, seed: 2 });
}

const RULES = ['চোখে পড়ার মতো করুন', 'আনন্দদায়ক করুন', 'খুব ছোট শুরু করুন', 'অগ্রগতি অনুভব করুন'];
const RULE_T = [20.38, 24.08, 27.24, 30.05];
const BN = ['১', '২', '৩', '৪'];
function whiteboard(t) {
  rr(30, 92, 660, 400, 12); ctx.fillStyle = '#8a8f96'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  rr(44, 106, 632, 372, 6); ctx.fillStyle = '#fbfbf8'; ctx.fill();
  const tk = P(t, 16.9, 17.8);
  ctx.save(); ctx.beginPath(); ctx.rect(44, 106, 632 * tk, 90); ctx.clip();
  txt('ভালো অভ্যাস গড়ার ৪টি নিয়ম', 360, 152, 42, INK); ctx.restore();
  line([[90, 192], [lerp(90, 630, tk), 192]], 4, '#e2574c');
  RULES.forEach((r, i) => {
    const y = 236 + i * 64, t0 = RULE_T[i];
    const active = t >= t0 && (i === 3 || t < RULE_T[i + 1]);
    const k = back(P(t, t0 - 0.3, t0 + 0.1));
    if (active) { rr(60, y - 28, 600, 56, 12); ctx.fillStyle = 'rgba(255,213,74,.45)'; ctx.fill(); }
    ctx.save(); ctx.translate(100, y); ctx.scale(lerp(0.6, 1, k) || 0.6, lerp(0.6, 1, k) || 0.6);
    circ(0, 0, 24, t >= t0 - 0.3 ? '#e2574c' : '#ddd', INK, 4); txt(BN[i], 0, 2, 30, '#fff'); ctx.restore();
    const wk = P(t, t0, t0 + 0.8);
    ctx.save(); ctx.beginPath(); ctx.rect(136, y - 32, 480 * wk, 64); ctx.clip();
    txt(r, 140, y + 2, 36, INK, { align: 'left', weight: 600 }); ctx.restore();
    const done = i < 3 ? RULE_T[i + 1] - 0.2 : 33.6;
    if (t > done) { const ck = P(t, done, done + 0.3); ctx.save(); ctx.globalAlpha = ck; check(630, y, 14); ctx.restore(); }
  });
}
function sceneRules(t) {
  room(t, { clock: false, shelfTop: 520 });
  whiteboard(t);
  let mood = 'happy', look = [-0.4, -0.9], hands = SIT.desk, headphones = false, lean = -0.08;
  if (t < 20.3) { look = [-0.5, -1]; hands = [[-150, -190], SIT.desk[1]]; mood = 'happy'; }
  // rule 1: make it obvious
  if (t >= 20.3 && t < 24.0) {
    const k = back(P(t, 20.5, 21.0));
    glow(250, 720, 140 * k, '255,220,100', 0.8);
    bookObj(250, 726, 120 * k, 34 * k, '#e2574c', null, null, 0);
    const bob = Math.sin(t * 7) * 8;
    arrow(250, 610 + bob, 250, 670 + bob, '#e2574c', 7);
    pop(t, 21.0, 23.9, () => { ctx.save(); ctx.rotate(-0.08); ctx.fillStyle = '#f6e27a'; ctx.fillRect(-55, -40, 110, 80); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.strokeRect(-55, -40, 110, 80); txt('পড়ো!', 0, 2, 34, INK); ctx.restore(); }, 120, 640);
    pop(t, 20.6, 23.9, () => { ctx.beginPath(); ctx.ellipse(0, 0, 56, 32, 0, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); circ(Math.sin(t * 2) * 10, 0, 18, '#4f7ca8', INK, 3); circ(Math.sin(t * 2) * 10, 0, 8, INK); }, 380, 590);
    mood = 'wow'; look = [-0.9, 0.3];
  }
  // rule 2: make it attractive
  if (t >= 24.0 && t < 27.2) {
    headphones = true; mood = 'joy'; lean = -0.08 + Math.sin(t * 6) * 0.05;
    for (let i = 0; i < 5; i++) {
      const ph = ((t - 24 + i * 0.6) % 2.4) / 2.4; const x = 470 + i * 22 + Math.sin(ph * 8 + i) * 16, y = 560 - ph * 220;
      ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * clamp(P(t, 24.1, 24.5)); ctx.fillStyle = ['#e2574c', '#4f7ca8', '#7cc39a'][i % 3];
      ctx.beginPath(); ctx.ellipse(x, y, 10, 7, -0.4, 0, Math.PI * 2); ctx.fill(); line([[x + 9, y], [x + 9, y - 34], [x + 20, y - 28]], 4, ctx.fillStyle); ctx.restore();
    }
    pop(t, 24.3, 27.1, () => {
      rr(-24, -30, 48, 54, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.arc(26, -4, 13, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 12, -40); ctx.bezierCurveTo(i * 12 - 8, -55, i * 12 + 8, -62, i * 12, -78 - Math.sin(t * 4 + i) * 4); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(120,120,120,.7)'; ctx.stroke(); }
    }, 300, 726);
    bookObj(200, 740, 110, 26, '#4f7ca8');
    hands = [[-130, -86], [-118, -90]];
  }
  // rule 3: start small (seedling sprouting)
  if (t >= 27.2 && t < 30.0) {
    const g = sm(P(t, 27.5, 29.5));
    ctx.save(); ctx.translate(250, 712);
    rr(-34, 0, 68, 44, 6); ctx.fillStyle = '#c56b46'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    line([[0, 0], [0, -60 * g]], 5, '#3d7a3a');
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 18 * g, -60 * g + 4, 18 * g, 9 * g, s * -0.5, 0, Math.PI * 2); ctx.fillStyle = '#7cc39a'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#3d5a30'; ctx.stroke(); }
    ctx.restore();
    pop(t, 27.5, 29.9, () => { rr(-90, -30, 180, 60, 30); ctx.fillStyle = '#7cc39a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); txt('ছোট শুরু', 0, 2, 32, INK); }, 250, 590);
    mood = 'happy'; look = [-0.9, 0.4];
  }
  // rule 4: feel progress
  if (t >= 30.0 && t < 34.6) {
    const cx = 130, cy = 596;
    pop(t, 30.1, 34.6, () => {
      rr(-110, -70, 220, 160, 10); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
      rr(-110, -70, 220, 34, 10); ctx.fillStyle = '#e2574c'; ctx.fill(); ctx.stroke();
      txt('৭ দিন', 0, -52, 22, '#fff');
      for (let i = 0; i < 7; i++) {
        const x = -90 + (i % 4) * 54, y = -14 + Math.floor(i / 4) * 54;
        rr(x, y, 44, 44, 6); ctx.lineWidth = 3; ctx.strokeStyle = '#999'; ctx.stroke();
        const ck = P(t, 30.6 + i * 0.35, 30.8 + i * 0.35); if (ck > 0) { ctx.save(); ctx.globalAlpha = ck; check(x + 22, y + 22, 13, '#2e9e5b', 6); ctx.restore(); }
      }
    }, cx, cy);
    // progress bar
    const pk = eo(P(t, 30.6, 33.2));
    rr(80, 690, 300, 30, 15); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    if (pk > 0.02) { rr(84, 694, 292 * pk, 22, 11); ctx.fillStyle = '#2e9e5b'; ctx.fill(); }
    txt(Math.round(pk * 100).toLocaleString('bn-BD') + '%', 300, 640, 30, INK, { stroke: '#fff', sw: 7 });
    mood = t > 32 ? 'joy' : 'happy'; look = [-0.8, 0];
    if (t > 32) hands = [[-40, -170 - Math.abs(Math.sin(t * 8)) * 14], SIT.desk[1]];
  }
  sitChar(t, { mood, look, hands, headphones, lean, seed: 3 });
}

function sceneExample(t) {
  room(t, { desk: false, shelfTop: 470 });
  // big stack of 50 pages (left)
  const k = back(P(t, 34.5, 35.2)), wob = Math.sin(t * 9) * 0.04 * (1 - P(t, 37.0, 37.3));
  ctx.save(); ctx.translate(150, FLOOR); ctx.rotate(wob); ctx.scale(k, k);
  const cols = ['#c0584a', '#4f7ca8', '#d9a441', '#6b9a6a', '#8c6bb0'];
  for (let i = 0; i < 11; i++) { rr(-80 + (i % 2) * 8, -42 - i * 42, 160, 40, 6); ctx.fillStyle = cols[i % 5]; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); line([[-60 + (i % 2) * 8, -22 - i * 42], [60 + (i % 2) * 8, -22 - i * 42]], 2, 'rgba(255,255,255,.6)'); }
  ctx.restore();
  pop(t, 34.8, 40.4, () => { rr(-80, -32, 160, 64, 14); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); txt('৫০ পৃষ্ঠা', 0, 2, 34, INK); }, 150, 470);
  if (t > 36.6) { ctx.save(); ctx.globalAlpha = P(t, 36.6, 36.9); cross(150, 760, lerp(30, 110, back(P(t, 36.6, 37.0))), '#e04848', 16); ctx.restore(); }
  // 2 pages (right)
  const k2 = back(P(t, 37.6, 38.2));
  if (k2 > 0) {
    glow(560, 860, 160 * k2, '160,240,170', 0.6);
    ctx.save(); ctx.translate(560, 880); ctx.scale(k2, k2);
    rr(-60, 70, 120, 12, 4); ctx.fillStyle = '#8a5634'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); line([[0, 82], [0, 120]], 8, '#6b4329');
    ctx.beginPath(); ctx.moveTo(0, 60); ctx.quadraticCurveTo(-40, 40, -78, 52); ctx.lineTo(-78, 0); ctx.quadraticCurveTo(-40, -12, 0, 8); ctx.quadraticCurveTo(40, -12, 78, 0); ctx.lineTo(78, 52); ctx.quadraticCurveTo(40, 40, 0, 60); ctx.closePath();
    ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.stroke(); line([[0, 8], [0, 60]], 3);
    ctx.restore();
    pop(t, 37.9, 40.4, () => { rr(-80, -32, 160, 64, 14); ctx.fillStyle = '#7cc39a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); txt('২ পৃষ্ঠা', 0, 2, 34, INK); }, 560, 720);
    if (t > 38.4) { ctx.save(); ctx.globalAlpha = P(t, 38.4, 38.7); circ(650, 640, 34, '#2e9e5b', INK, 4); check(650, 642, 16, '#fff', 7); ctx.restore(); }
  }
  const lookRight = t > 37.6;
  const shrug = t > 35.4 && t < 37.4;
  drawChar({ x: 380, y: FLOOR - 190, t, dir: lookRight ? 1 : -1, feet: STAND.feet, s: 1,
    hands: lookRight ? (t > 38.4 ? [[60, -200], [-40, -24]] : [[44, -26], [-30, -24]]) : (shrug ? [[-70, -150], [70, -150]] : STAND.down),
    mood: lookRight ? (t > 38.4 ? 'joy' : 'happy') : (t > 35.4 ? 'worried' : 'neutral'),
    look: lookRight ? [0.8, 0] : [-0.8, -0.6], face: lookRight ? 0.5 : -0.5, seed: 4 });
}

// staircase climb
const STEP = { x0: 20, w: 74, h: 68, n: 8 };
const stepTop = i => [STEP.x0 + STEP.w * i + STEP.w / 2, FLOOR - STEP.h * (i + 1)];
function sceneClimb(t) {
  const g = ctx.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, '#f6dcc0'); g.addColorStop(1, '#efe3d3'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, FLOOR); floor();
  // faint rising graph
  ctx.save(); ctx.globalAlpha = 0.25; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = 20 + i * 17, y = 900 - Math.pow(i / 40, 2.2) * 700 + Math.sin(i * 1.7) * 12; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 6; ctx.strokeStyle = '#2e9e5b'; ctx.stroke(); ctx.restore();
  for (let i = 0; i < STEP.n; i++) {
    const x = STEP.x0 + STEP.w * i, y = FLOOR - STEP.h * (i + 1);
    rr(x, y, STEP.w, FLOOR - y, 4); ctx.fillStyle = i % 2 ? '#c9a27a' : '#d6b089'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    txt(BN[i] || ['৫', '৬', '৭', '৮'][i - 4], x + STEP.w / 2, y + 36, 28, 'rgba(60,35,15,.75)');
  }
  // flag + trophy at top
  const [fx, fy] = stepTop(7);
  glow(fx + 10, fy - 80, 170, '255,215,100', 0.35 + 0.35 * P(t, 47.3, 48));
  line([[fx + 52, fy], [fx + 52, fy - 150]], 5);
  ctx.beginPath(); ctx.moveTo(fx + 52, fy - 150); ctx.lineTo(fx + 52 + 66, fy - 132 + Math.sin(t * 5) * 4); ctx.lineTo(fx + 52, fy - 114); ctx.closePath(); ctx.fillStyle = '#e2574c'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  // climbing: one step per hop from 41.2 to 47.4
  const hopDur = (47.4 - 41.2) / 7, prog = clamp((t - 41.2) / hopDur, 0, 7);
  const i0 = Math.floor(prog), f = prog - i0;
  const a = stepTop(Math.min(i0, 7)), b = stepTop(Math.min(i0 + 1, 7));
  const moving = i0 < 7;
  const hf = moving ? sm(clamp(f * 1.4)) : 0;
  const foot = moving ? L2(a, b, hf) : a;
  const lift = moving ? Math.sin(Math.PI * clamp(f * 1.4)) * 40 : 0;
  const s = 0.72, hipY = foot[1] - 186 * s - lift * 0.6;
  const lead = moving ? L2(a, b, sm(clamp(f * 1.6))) : a, trail = moving ? L2(a, b, sm(clamp(f * 1.6 - 0.5))) : a;
  const leadLift = moving ? Math.sin(Math.PI * clamp(f * 1.6)) * 46 : 0, trailLift = moving ? Math.sin(Math.PI * clamp(f * 1.6 - 0.5)) * 40 : 0;
  const hx = foot[0];
  const win = t > 47.4;
  drawChar({ x: hx, y: hipY, s, t, dir: 1, face: 0.35,
    feet: [[(lead[0] - hx) / s + 8, (lead[1] - leadLift - hipY) / s], [(trail[0] - hx) / s - 8, (trail[1] - trailLift - hipY) / s]],
    hands: win ? [[60, -230], [-60, -230]] : [[46 + Math.sin(t * 9) * 16, -30], [-36 - Math.sin(t * 9) * 16, -30]],
    mood: win ? 'joy' : t > 43.5 ? 'happy' : 'focus', look: [0.6, -0.5], seed: 5 });
  pop(t, 40.4, 43.3, () => { rr(-250, -42, 500, 84, 20); ctx.fillStyle = INK; ctx.fill(); txt('সফলতা একদিনে আসে না', 0, 2, 44, '#fff'); }, 360, 200);
  pop(t, 41.2, 43.3, () => {
    // flipping calendar page
    rr(-46, -50, 92, 100, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    rr(-46, -50, 92, 26, 8); ctx.fillStyle = '#e2574c'; ctx.fill(); ctx.stroke();
    txt(String(1 + Math.floor((t - 41.2) * 4) % 30).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]), 0, 14, 40, INK);
  }, 620, 330);
  pop(t, 44.6, 48.6, () => { rr(-130, -36, 260, 72, 36); ctx.fillStyle = '#ffd54a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); txt('বড় সাফল্য', 0, 2, 40, INK); }, 200, 360);
}

function sceneHabit(t) {
  wall('#efe6d8', '#e5d6c3'); floor();
  // target (goal)
  const tx = 175, ty = 430, tk = back(P(t, 48.4, 49.0));
  const hit = P(t, 51.75, 51.85), wob = hit > 0 ? Math.sin((t - 51.8) * 30) * 0.06 * (1 - P(t, 51.8, 52.6)) : 0;
  ctx.save(); ctx.translate(tx, ty); ctx.rotate(wob); ctx.scale(tk, tk);
  line([[-50, 110], [-80, 330]], 6, '#6b4329'); line([[50, 110], [80, 330]], 6, '#6b4329');
  [[120, '#e2574c'], [92, '#fff'], [64, '#e2574c'], [36, '#fff'], [14, '#e2574c']].forEach(([r, c]) => circ(0, 0, r, c, INK, 4));
  ctx.restore();
  pop(t, 48.6, 53.0, () => { rr(-80, -30, 160, 60, 14); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); txt('লক্ষ্য', 0, 2, 36, INK); }, tx, 250);
  // habit calendar
  const cx = 530, cy = 430;
  pop(t, 50.4, 53.0, () => {
    rr(-130, -120, 260, 240, 12); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    rr(-130, -120, 260, 44, 12); ctx.fillStyle = '#2e9e5b'; ctx.fill(); ctx.stroke();
    txt('প্রতিদিন', 0, -97, 28, '#fff');
    for (let i = 0; i < 12; i++) { const x = -108 + (i % 4) * 56, y = -62 + Math.floor(i / 4) * 58; rr(x, y, 46, 46, 6); ctx.lineWidth = 3; ctx.strokeStyle = '#aaa'; ctx.stroke(); const ck = P(t, 50.7 + i * 0.08, 50.85 + i * 0.08); if (ck > 0) { ctx.save(); ctx.globalAlpha = ck; check(x + 23, y + 23, 13, '#2e9e5b', 6); ctx.restore(); } }
  }, cx, cy);
  pop(t, 50.6, 53.0, () => { rr(-100, -30, 200, 60, 14); ctx.fillStyle = '#ffd54a'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); txt('অভ্যাস', 0, 2, 36, INK); }, cx, 250);
  // arrow flies from habits into the bullseye
  const ak = P(t, 51.3, 51.8);
  if (ak > 0) {
    const x = lerp(cx - 140, tx + 10, eo(ak)), y = ty - Math.sin(ak * Math.PI) * 60;
    line([[x, y], [x + 70, y - 4]], 6, '#6b4329'); ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x + 4, y - 9); ctx.lineTo(x + 4, y + 9); ctx.closePath(); ctx.fillStyle = INK; ctx.fill();
    ctx.fillStyle = '#4f7ca8'; ctx.fillRect(x + 60, y - 12, 14, 22);
  }
  if (hit > 0) pop(t, 51.85, 53, () => { for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r = 60 + (t - 51.85) * 120; circ(Math.cos(a) * r, Math.sin(a) * r, 6, ['#ffd54a', '#e2574c', '#7cc39a'][i % 3]); } }, tx, ty);
  const lookR = t > 50.4;
  drawChar({ x: 360, y: FLOOR - 190, t, dir: lookR ? 1 : -1, feet: STAND.feet,
    hands: lookR ? [[110, -150], [-34, -24]] : (t > 49.2 ? [[-64, -140], [64, -140]] : STAND.down),
    mood: t > 51.8 ? 'joy' : lookR ? 'happy' : 'neutral', look: lookR ? [0.8, -0.3] : [-0.8, -0.3], face: lookR ? 0.5 : -0.5, seed: 6 });
}

function sceneFinal(t) {
  const sunUp = eo(P(t, 52.8, 55.0));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f7b267'); g.addColorStop(0.55, '#fbd38d'); g.addColorStop(1, '#fdebc8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sx = 360, sy = lerp(980, 720, sunUp);
  rays(sx, sy, 900, t, 'rgba(255,255,255,0.16)', 18);
  glow(sx, sy, 380, '255,240,190', 0.8);
  circ(sx, sy, 150, '#ffe08a', null);
  // hills
  ctx.beginPath(); ctx.moveTo(0, 940); ctx.quadraticCurveTo(200, 880, 360, 900); ctx.quadraticCurveTo(540, 920, 720, 870); ctx.lineTo(720, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = '#9cc28a'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 1060); ctx.quadraticCurveTo(300, 1000, 720, 1080); ctx.lineTo(720, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = '#7fae6e'; ctx.fill(); ctx.stroke();
  plant(110, 900, 0.6); plant(610, 875, 0.5);
  const jump = Math.max(0, Math.sin((t - 53) * 5)) * 18 * P(t, 53, 53.4) * (1 - P(t, 56, 56.5));
  drawChar({ x: 360, y: 900 - 186 - jump, t, dir: 1, face: 0, feet: STAND.feet,
    hands: [[70, -236 + Math.sin(t * 6) * 6], [-70, -236 - Math.sin(t * 6) * 6]], mood: 'joy', look: [0, -0.4], seed: 7 });
  pop(t, 52.85, 58.6, () => txt('আজ থেকেই শুরু করুন', 0, 0, 62, '#fff', { stroke: '#c0392b', sw: 12 }), 360, 200);
  pop(t, 54.6, 58.6, () => {
    rr(-300, -46, 600, 92, 46); ctx.fillStyle = 'rgba(30,26,22,.85)'; ctx.fill();
    txt('ছোট পরিবর্তন', -140, 2, 38, '#fff'); arrow(-30, 0, 30, 0, '#ffd54a', 6); txt('বড় ইতিহাস', 150, 2, 40, '#ffd54a');
  }, 360, 320);
}

const SCENES = [[0, sceneHook], [9.0, sceneBook], [16.8, sceneRules], [34.4, sceneExample], [40.3, sceneClimb], [48.4, sceneHabit], [52.8, sceneFinal]];
const XF = 0.4;

// ---------- subtitles ----------
const SUBS = [
  [0.0, 3.8, 'আপনার জীবন বদলাতে প্রতিদিন *বিশাল* *কিছু* করার প্রয়োজন নেই!'],
  [4.3, 8.7, 'মাত্র *১%* *উন্নতিই* একদিন আপনাকে অনেক দূর এগিয়ে দিতে পারে।'],
  [9.18, 12.68, 'James Clear-এর বিখ্যাত বই *Atomic* *Habits* আমাদের শেখায়,'],
  [13.13, 16.33, '*ছোট* *ছোট* *অভ্যাসই* পারে জীবনে *বড়* *পরিবর্তন* আনতে।'],
  [16.81, 19.96, 'বইটিতে ভালো অভ্যাস গড়ার *চারটি* *নিয়ম* বলা হয়েছে।'],
  [20.38, 23.72, '১. অভ্যাসকে সহজে *চোখে* *পড়ার* *মতো* করুন।'],
  [24.08, 26.82, '২. অভ্যাসটিকে *আনন্দদায়ক* করুন।'],
  [27.24, 29.66, '৩. শুরুটা *খুব* *ছোট* রাখুন।'],
  [30.05, 33.94, '৪. অভ্যাস সম্পন্ন করে নিজের *অগ্রগতি* অনুভব করুন।'],
  [34.39, 39.77, 'যেমন, প্রতিদিন *৫০* *পৃষ্ঠা* পড়ার লক্ষ্য না রেখে মাত্র *২* *পৃষ্ঠা* দিয়ে শুরু করুন।'],
  [40.29, 42.96, 'মনে রাখবেন, সফলতা *একদিনে* আসে না।'],
  [43.52, 47.96, 'প্রতিদিনের ছোট ছোট ভালো অভ্যাসই একসময় *বড়* *সাফল্য* তৈরি করে।'],
  [48.42, 52.30, 'লক্ষ্য শুধু ঠিক করলেই হবে না, প্রতিদিনের *অভ্যাসও* বদলাতে হবে।'],
  [52.79, 54.04, '*আজ* *থেকেই* শুরু করুন।'],
  [54.52, 57.9, 'কারণ *ছোট* *পরিবর্তনই* একদিন *বড়* *ইতিহাস* তৈরি করে!'],
];
const subLayout = new Map();
function layoutSub(s, size) {
  if (subLayout.has(s)) return subLayout.get(s);
  ctx.font = `700 ${size}px ${FONT}`;
  const words = s.split(' ').map(w => ({ w: w.replace(/\*/g, ''), key: w.startsWith('*') }));
  const space = ctx.measureText(' ').width, maxW = 620, lines = [[]]; let lw = 0;
  for (const w of words) { w.width = ctx.measureText(w.w).width; if (lw + w.width > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(w); lw += w.width + space; }
  const total = words.reduce((a, w) => a + w.w.length, 0);
  let acc = 0; for (const w of words) { w.at = acc / total; acc += w.w.length; }
  const res = { lines, space }; subLayout.set(s, res); return res;
}
function subtitles(t) {
  const i = SUBS.findIndex((s, k) => t >= s[0] && t < (SUBS[k + 1] ? Math.min(SUBS[k + 1][0] - 0.05, s[1] + 0.45) : s[1] + 0.6));
  if (i < 0) return;
  const [a, b, s] = SUBS[i], size = 40, lh = 58;
  const { lines, space } = layoutSub(s, size);
  const y0 = 1140 - (lines.length - 1) * lh / 2;
  const inK = eo(P(t, a, a + 0.25));
  ctx.save(); ctx.globalAlpha = inK; ctx.translate(0, (1 - inK) * 20);
  const maxLine = Math.max(...lines.map(l => l.reduce((x, w) => x + w.width, 0) + space * (l.length - 1)));
  rr(360 - maxLine / 2 - 26, y0 - lh / 2 - 8, maxLine + 52, lines.length * lh + 16, 22);
  ctx.fillStyle = 'rgba(20,16,12,0.62)'; ctx.fill();
  ctx.font = `700 ${size}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const spoken = P(t, a, b);
  lines.forEach((l, li) => {
    const lwid = l.reduce((x, w) => x + w.width, 0) + space * (l.length - 1);
    let x = 360 - lwid / 2; const y = y0 + li * lh;
    for (const w of l) {
      const on = spoken >= w.at * 0.95;
      ctx.globalAlpha = inK * (on ? 1 : 0.45);
      ctx.lineJoin = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(w.w, x, y);
      ctx.fillStyle = w.key ? '#ffd54a' : '#ffffff'; ctx.fillText(w.w, x, y);
      x += w.width + space;
    }
  });
  ctx.restore();
}

// ---------- overlays ----------
const grain = (() => { const c = document.createElement('canvas'); c.width = 360; c.height = 640; const g = c.getContext('2d'), d = g.createImageData(360, 640); const r = rng(99); for (let i = 0; i < d.data.length; i += 4) { const v = 110 + r() * 145; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
function overlays(t) {
  // paper grain (shifts at 12fps for a hand-drawn feel)
  ctx.save(); ctx.globalAlpha = 0.07; ctx.globalCompositeOperation = 'multiply';
  const f = Math.floor(t * 12), ox = (f * 37) % 180, oy = (f * 53) % 320;
  ctx.drawImage(grain, -ox, -oy, 720 + 360, 1280 + 640); ctx.restore();
  // vignette
  const v = ctx.createRadialGradient(360, 640, 380, 360, 640, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,20,5,0.35)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  // watermark (top-right)
  ctx.save(); ctx.font = `600 22px ${FONT}`; const tw = ctx.measureText('TR Universe 0.1').width;
  rr(W - tw - 70, 24, tw + 52, 40, 20); ctx.fillStyle = 'rgba(20,16,12,0.45)'; ctx.fill();
  circ(W - tw - 48, 44, 11, '#ffd54a'); txt('TR', W - tw - 48, 45, 11, INK, { weight: 700 });
  ctx.globalAlpha = 0.92; txt('TR Universe 0.1', W - 30, 45, 22, '#fff', { weight: 600, align: 'right' }); ctx.restore();
}

// ---------- main ----------
function render(t) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i][0]) k = i;
  const [start, fn] = SCENES[k];
  ctx.save(); fn(t); ctx.restore();
  if (k > 0 && t < start + XF) { // crossfade: previous scene fading out on top
    ctx.save(); ctx.globalAlpha = 1 - P(t, start, start + XF); SCENES[k - 1][1](t); ctx.restore(); ctx.globalAlpha = 1;
  }
  subtitles(t);
  overlays(t);
  if (t < 0.25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; ctx.fillRect(0, 0, W, H); }
  if (t > DUR - 0.5) { ctx.fillStyle = `rgba(0,0,0,${P(t, DUR - 0.5, DUR)})`; ctx.fillRect(0, 0, W, H); }
}
window.render = render; window.DUR = DUR;
