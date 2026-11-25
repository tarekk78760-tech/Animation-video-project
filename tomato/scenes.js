// Tomato price documentary — 1080x1920, blue theme, box animation.
// render(t) rebuilds the whole frame for time t (seconds). Times come from the
// voiceover (silence detection + word timestamps).
const W = 1080, H = 1920, DURATION = 80.0;
const C = {
  bg: '#0a1a36', bg2: '#0f2a55', blue: '#1e6fd9', sky: '#5fb4ff', pale: '#e8f2ff', ink: '#061226',
  yellow: '#ffc83d', red: '#e2462c', green: '#2fae66', white: '#ffffff', grey: '#b8c6dd',
};
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = x => 1 - Math.pow(1 - cl(x), 3);
const eio = x => { x = cl(x); return x * x * (3 - 2 * x); };
const eb = x => { x = cl(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const P = (t, t0, d = 0.45) => eo((t - t0) / d);
const BN = s => String(s).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);

// ---------- subtitles (voice phrases) ----------
const SUBS = [
  [0.00, 2.71, 'কৃষক যে টমেটো বিক্রি করেন ২০ টাকায়,'],
  [3.00, 6.09, 'সেই টমেটো বাজারে গিয়ে ৬০ টাকা হয় কীভাবে?'],
  [7.15, 10.68, 'একদিকে কৃষক তার উৎপাদিত পণ্যের ন্যায্য দাম পাচ্ছেন না।'],
  [11.06, 16.89, 'অন্যদিকে বাজারে গিয়ে সেই পণ্য কিনতে সাধারণ মানুষকে গুনতে হচ্ছে কয়েক গুণ বেশি টাকা।'],
  [33.78, 40.69, 'পণ্য উৎপাদনের পর কৃষকের হাত থেকে তা যায় স্থানীয় ব্যবসায়ী, পাইকার, আড়তদার এবং খুচরা বিক্রেতার কাছে।'],
  [41.06, 47.48, 'প্রতিটি ধাপে যোগ হয় পরিবহন খরচ, শ্রমিকের মজুরি, সংরক্ষণ খরচ এবং ব্যবসায়িক মুনাফা।'],
  [47.97, 53.37, 'কিন্তু কোথাও যদি অস্বাভাবিক মুনাফা, বাজার নিয়ন্ত্রণ কিংবা কৃত্রিম সংকট তৈরি হয়,'],
  [53.75, 56.49, 'তাহলে তার বোঝা গিয়ে পড়ে সাধারণ ক্রেতার পকেটে।'],
  [66.13, 71.10, 'বাজার ব্যবস্থায় স্বচ্ছতা নিশ্চিত করা না গেলে এই সমস্যার সমাধান কঠিন।'],
  [71.72, 77.00, 'কারণ বাজারে শুধু পণ্যের দাম বাড়ে না, বাড়ে সাধারণ মানুষের বেঁচে থাকার খরচও।'],
];

// ---------- building blocks ----------
function div(x, y, w, h, inner = '', style = '') {
  return `<div style="position:absolute;left:${x}px;top:${y}px;${w != null ? `width:${w}px;` : ''}${h != null ? `height:${h}px;` : ''}${style}">${inner}</div>`;
}
function sym(id, x, y, w, h, style = '', slice = false) {
  return `<svg style="position:absolute;left:${x}px;top:${y}px;overflow:visible;${style}" width="${w}" height="${h}"${slice ? ' preserveAspectRatio="xMidYMid slice"' : ''}><use href="#${id}" width="100%" height="100%"${slice ? ' preserveAspectRatio="xMidYMid slice"' : ''}/></svg>`;
}
// text block; x,w define the line box; align center by default
function txt(x, y, w, s, o = {}) {
  const { size = 56, color = C.white, weight = 700, align = 'center', op = 1, dy = 0, scale = 1, rot = 0, shadow = false, lh = 1.3 } = o;
  if (op <= 0.001) return '';
  return div(x, y, w, null, s, `font-size:${size}px;color:${color};font-weight:${weight};text-align:${align};line-height:${lh};opacity:${op};transform:translateY(${dy}px) scale(${scale}) rotate(${rot}deg);transform-origin:center;${shadow ? 'text-shadow:0 4px 14px rgba(0,0,0,.45);' : ''}`);
}
function rev(t, t0, x, y, w, s, o = {}) { // fade + rise
  const p = P(t, t0, o.d || 0.45);
  if (p <= 0) return '';
  return txt(x, y, w, s, { ...o, op: p * (o.op ?? 1), dy: (1 - p) * 36 });
}
function pop(t, t0, x, y, w, s, o = {}) { // bounce in
  const p = eb((t - t0) / (o.d || 0.5));
  if (t < t0) return '';
  return txt(x, y, w, s, { ...o, op: cl(p * 2), scale: 0.3 + 0.7 * p });
}
// the signature "box": thick ink border + hard offset shadow, revealed by a wipe from `dir`
function box(t, t0, x, y, w, h, inner, o = {}) {
  if (t < t0) return '';
  const { bg = C.pale, dir = 'l', d = 0.55, shadow = C.sky, radius = 22, rot = 0, glow = 0, border = C.ink } = o;
  const p = eo((t - t0) / d), q = eo((t - t0 - 0.12) / (d + 0.2));
  const S = 16, ww = w + S, hh = h + S, r = (1 - p) * 100;
  const clip = { l: `inset(0 ${r}% 0 0)`, r: `inset(0 0 0 ${r}%)`, t: `inset(0 0 ${r}% 0)`, b: `inset(${r}% 0 0 0)` }[dir];
  const off = { l: [-60, 0], r: [60, 0], t: [0, -60], b: [0, 60] }[dir];
  const g = glow ? `box-shadow:0 0 ${30 + 25 * glow}px ${8 + 10 * glow}px rgba(255,200,61,${0.35 + 0.35 * glow});` : '';
  return div(x, y, ww, hh,
    div(S, S, w, h, '', `background:${shadow};border-radius:${radius}px;`) +
    div(0, 0, w, h, div(0, 0, w, h, inner, `transform:translate(${off[0] * (1 - q)}px,${off[1] * (1 - q)}px);`),
      `background:${bg};border:6px solid ${border};border-radius:${radius}px;overflow:hidden;box-sizing:border-box;${g}`),
    `clip-path:${clip};transform:rotate(${rot}deg);`);
}
function pill(t, t0, cx, y, s, o = {}) {
  const { bg = C.red, color = C.white, size = 40 } = o;
  const p = eb((t - t0) / 0.45);
  if (t < t0) return '';
  return div(cx - 400, y, 800, null,
    `<span style="display:inline-block;background:${bg};color:${color};font-size:${size}px;font-weight:700;padding:6px 34px 10px;border:5px solid ${C.ink};border-radius:60px;box-shadow:6px 6px 0 ${C.ink};">${s}</span>`,
    `text-align:center;opacity:${cl(p * 2)};transform:scale(${0.4 + 0.6 * p});`);
}
// question mark badge
function qmark(x, y, s, t, o = {}) {
  const wob = Math.sin(t * 5 + (o.ph || 0)) * 8;
  return div(x, y, s, s, `<span style="font-size:${s * 0.72}px;font-weight:700;color:${o.color || C.ink};line-height:1">?</span>`,
    `background:${o.bg || C.yellow};border:5px solid ${C.ink};border-radius:50%;display:flex;align-items:center;justify-content:center;transform:rotate(${wob}deg);box-shadow:5px 5px 0 ${C.ink};${o.op != null ? `opacity:${o.op};` : ''}`);
}
// price tag
function tag(x, y, s, t, t0, o = {}) {
  if (t < t0) return '';
  const p = eb((t - t0) / 0.55), sw = Math.sin((t - t0) * 4) * 5 * Math.exp(-(t - t0));
  return div(x, y, null, null,
    `<div style="position:relative;background:${o.bg || C.white};border:6px solid ${C.ink};border-radius:18px 18px 18px 18px;padding:4px 30px 10px 54px;font-size:${o.size || 80}px;font-weight:700;color:${o.color || C.red};box-shadow:8px 8px 0 ${C.ink};white-space:nowrap">
       <span style="position:absolute;left:16px;top:50%;width:22px;height:22px;margin-top:-11px;border-radius:50%;background:${C.bg};border:4px solid ${C.ink}"></span>${s}</div>`,
    `transform-origin:0 50%;transform:scale(${p}) rotate(${(o.rot || -6) + sw}deg);opacity:${cl(p * 2)};`);
}
function arrowSvg(x, y, w, h, dir, color, p = 1) { // simple block arrow, dir up/down/right
  const len = p;
  const path = dir === 'down' ? `M${w * .3} 0 H${w * .7} V${h * .6} H${w} L${w / 2} ${h} L0 ${h * .6} H${w * .3} Z`
    : dir === 'up' ? `M${w * .3} ${h} H${w * .7} V${h * .4} H${w} L${w / 2} 0 L0 ${h * .4} H${w * .3} Z`
      : `M0 ${h * .3} V${h * .7} H${w * .6} V${h} L${w} ${h / 2} L${w * .6} 0 V${h * .3} Z`;
  return `<svg style="position:absolute;left:${x}px;top:${y}px;overflow:visible;transform:scale(${len});transform-origin:${dir === 'up' ? '50% 100%' : dir === 'down' ? '50% 0' : '0 50%'}" width="${w}" height="${h}"><path d="${path}" fill="${color}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/></svg>`;
}
// word-by-word reveal for questions; words spread evenly between t0 and t1
function words(t, t0, t1, str, hiFrom = 1e9, hiColor = C.red) {
  const ws = str.split(' ');
  return ws.map((w, i) => {
    const tw = t0 + (t1 - t0) * i / Math.max(1, ws.length - 1);
    const p = eo((t - tw) / 0.3);
    const col = i >= hiFrom ? hiColor : 'inherit';
    return `<span style="display:inline-block;opacity:${0.12 + 0.88 * p};transform:translateY(${(1 - p) * 14}px);color:${col};margin:0 .14em">${w}</span>`;
  }).join(' ');
}

// ---------- narrator (drawn after the channel owner) ----------
let MOUTH = [];
function mouthAt(t) { const i = Math.round(t * 30); return MOUTH[i] || 0; }
function narrator(t, t0, x, y, w, pose = 'clasp', o = {}) {
  if (t < t0) return '';
  const p = eb((t - t0) / 0.6);
  const h = w * 430 / 300;
  const blink = (t % 3.3) < 0.12 ? 1 : 0;
  return div(x, y + (1 - p) * 500, w, h, host({ mouth: mouthAt(t), pose, brow: o.brow || 0, blink, t }),
    `opacity:${cl(p * 3)};${o.flip ? 'transform:scaleX(-1);' : ''}`);
}

// ---------- background ----------
function background(t) {
  const gx = 540 + Math.sin(t * 0.25) * 300, gy = 700 + Math.cos(t * 0.2) * 300;
  return div(0, 0, W, H, '', `background:radial-gradient(900px 900px at ${gx}px ${gy}px, ${C.bg2}, ${C.bg} 70%);`) +
    div(0, 0, W, H, '', `background-image:linear-gradient(rgba(95,180,255,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(95,180,255,.06) 2px,transparent 2px);background-size:90px 90px;background-position:0 ${(t * 12) % 90}px;`);
}

// ---------- scenes ----------
function sHook(t) {
  let h = '';
  // box A: the farmer's price
  h += box(t, 0.05, 60, 200, 960, 560,
    sym('field', 0, 0, 948, 548, '', true) + sym('farmerStand', 70, 150, 200, 390) + sym('crate', 300, 350, 240, 175) +
    div(24, 22, null, null, `<span style="background:${C.ink};color:#fff;font-size:38px;font-weight:700;padding:4px 22px 8px;border-radius:40px">কৃষকের কাছে</span>`),
    { bg: '#cfe8c0', dir: 'l' });
  // narrator peeking from behind box B
  h += narrator(t, 0.4, 790, 560, 240, 'point');
  // box B: the market price
  h += box(t, 2.95, 60, 840, 960, 560,
    sym('marketBg', 0, 0, 948, 548, '', true) + sym('vendor', 560, 150, 300, 346) + sym('basket', 470, 360, 380, 248) +
    div(24, 22, null, null, `<span style="background:${C.ink};color:#fff;font-size:38px;font-weight:700;padding:4px 22px 8px;border-radius:40px">বাজারে</span>`),
    { bg: '#f1dcc0', dir: 'r' });
  // price tags (outside boxes so they can overlap edges)
  h += tag(600, 420, '৳ ২০', t, 1.0, { color: C.green, size: 96, rot: -6 });
  h += tag(110, 960, '৳ ৬০', t, 3.9, { color: C.red, size: 120, rot: 6 });
  // the hook question — highlighted
  if (t >= 4.85) {
    const p = eb((t - 4.85) / 0.5), gl = 0.5 + 0.5 * Math.sin(t * 8);
    h += div(80, 1200, 560, 180,
      `<span style="font-size:96px;font-weight:700;color:${C.ink}">কীভাবে</span><span style="font-size:116px;font-weight:700;color:${C.red}">?</span>`,
      `background:${C.yellow};border:7px solid ${C.ink};border-radius:26px;display:flex;align-items:center;justify-content:center;
       box-shadow:12px 12px 0 ${C.ink},0 0 ${40 + 30 * gl}px ${10 + 10 * gl}px rgba(255,200,61,.55);transform:scale(${p}) rotate(-4deg);opacity:${cl(p * 2)}`);
    h += qmark(590, 1150, 100, t, { op: cl(p), bg: C.red, color: '#fff' });
  }
  return h;
}

function sReality(t) {
  let h = '';
  // farmer not getting a fair price
  h += box(t, 7.1, 60, 190, 960, 620,
    sym('field', 0, 0, 948, 608, '', true) + sym('farmerSad', 540, 200, 360, 432) +
    div(30, 30, 500, null, `<div style="font-size:44px;font-weight:600;color:${C.ink}">একদিকে কৃষক</div><div style="font-size:70px;font-weight:700;color:${C.ink};line-height:1.15">ন্যায্য দাম</div><div style="font-size:76px;font-weight:700;color:${C.red};line-height:1.15">পাচ্ছেন না</div>`, 'background:rgba(255,255,255,.88);border:4px solid #061226;border-radius:18px;padding:8px 20px 14px;box-sizing:border-box;') +
    (t > 8.6 ? arrowSvg(190, 360 + Math.sin(t * 5) * 10, 140, 190, 'down', C.red, eb((t - 8.6) / 0.5)) : ''),
    { bg: '#cfe8c0', dir: 'l' });
  // buyer paying several times more
  if (t >= 11.0) {
    let notes = '';
    for (let i = 0; i < 4; i++) {
      const k = ((t - 12.2) * 0.7 + i * 0.25) % 1;
      if (t > 12.2) notes += sym('note', 640 + k * 150 + i * 10, 360 - k * 260, 130, 68, `opacity:${1 - k};transform:rotate(${-20 + i * 12 + k * 40}deg)`);
    }
    h += box(t, 11.0, 60, 880, 960, 620,
      sym('marketBg', 0, 0, 948, 608, '', true) + sym('buyer', 60, 150, 250, 448) + sym('wallet', 620, 380, 230, 184) + notes +
      div(330, 90, 590, null, `<div style="font-size:44px;font-weight:600;color:${C.ink}">অন্যদিকে ক্রেতাকে গুনতে হয়</div><div style="font-size:76px;font-weight:700;color:${C.red};line-height:1.2">কয়েক গুণ বেশি</div>`, 'background:rgba(255,255,255,.9);border:4px solid #061226;border-radius:18px;padding:8px 20px 14px;box-sizing:border-box;text-align:center') +
      (t > 15.2 ? arrowSvg(420, 300, 120, 170, 'up', C.red, eb((t - 15.2) / 0.5)) : ''),
      { bg: '#f1dcc0', dir: 'r' });
  }
  return h;
}

function sMiddle(t) { // "তাহলে মাঝখানে ঘটছে কী?" — question highlight
  let h = '';
  h += pill(t, 17.6, 540, 220, 'প্রশ্ন');
  h += box(t, 17.65, 60, 360, 300, 380, sym('field', 0, 0, 288, 368, '', true) + sym('farmerStand', 60, 40, 170, 330), { bg: '#cfe8c0', dir: 'b' });
  h += box(t, 17.8, 720, 360, 300, 380, sym('marketBg', 0, 0, 288, 368, '', true) + sym('buyer', 50, 20, 190, 340), { bg: '#f1dcc0', dir: 'b' });
  if (t > 18.0) {
    const p = eb((t - 18.0) / 0.5), pu = 1 + 0.06 * Math.sin(t * 9);
    h += div(400, 420, 280, 280, `<span style="font-size:230px;font-weight:700;color:${C.yellow};line-height:1">?</span>`,
      `background:${C.ink};border:7px solid ${C.yellow};border-radius:24px;display:flex;align-items:center;justify-content:center;transform:scale(${p * pu});box-shadow:0 0 50px 10px rgba(255,200,61,.4)`);
    h += arrowSvg(360, 535, 50, 50, 'right', C.yellow, p) + arrowSvg(675, 535, 50, 50, 'right', C.yellow, p);
  }
  h += box(t, 18.2, 60, 850, 960, 300,
    div(0, 40, 948, null, `<div style="font-size:66px;font-weight:600;color:${C.ink}">তাহলে মাঝখানে</div><div style="font-size:110px;font-weight:700;color:${C.red};line-height:1.15">ঘটছে কী?</div>`, 'text-align:center'),
    { bg: C.yellow, dir: 'l', glow: 0.5 + 0.5 * Math.sin(t * 7) });
  h += narrator(t, 18.3, 380, 1300, 330, 'shrug', { brow: 1 });
  return h;
}

const OPTIONS = [
  ['ক', 'কৃষক', 'farmerStand', 27.80], ['খ', 'আড়তদার', 'depot', 28.61],
  ['গ', 'পাইকার', 'truck', 29.55], ['ঘ', 'খুচরা ব্যবসায়ী', 'stall', 30.34],
];
function sAsk(t) { // audience question — strongest highlight
  let h = '';
  h += pill(t, 20.3, 540, 170, 'আপনার মতামত', { bg: C.yellow, color: C.ink, size: 42 });
  h += rev(t, 20.46, 40, 255, 1000, 'আপনি কী মনে করেন?', { size: 80 });
  // the question itself
  h += box(t, 21.6, 50, 400, 980, 380,
    div(30, 34, 908, null, words(t, 21.74, 26.9, 'কৃষক থেকে ভোক্তার কাছে পৌঁছানোর মাঝখানে অতিরিক্ত দামের জন্য সবচেয়ে বেশি দায়ী কে?', 11),
      `font-size:58px;font-weight:700;color:${C.ink};text-align:center;line-height:1.35`),
    { bg: C.yellow, dir: 'l', glow: t > 21.6 ? 0.5 + 0.5 * Math.sin(t * 6) : 0 });
  h += qmark(950, 360, 110, t, { bg: C.red, color: '#fff', op: P(t, 22, 0.4) });
  // answer options
  OPTIONS.forEach(([b, label, icon, t0], i) => {
    const x = 50 + (i % 2) * 505, y = 860 + Math.floor(i / 2) * 230;
    const act = cl(1 - (t - t0 - 0.2) / 0.8) * (t >= t0 ? 1 : 0);
    h += box(t, t0 - 0.05, x, y, 470, 200,
      div(20, 25, 150, 150, sym(icon, 0, 0, 150, 150), `background:${C.pale};border:4px solid ${C.ink};border-radius:16px;`) +
      div(185, 0, 260, 188, `<span style="font-size:${label.length > 8 ? 44 : 54}px;font-weight:700;color:${C.ink};line-height:1.15">${label}</span>`, 'display:flex;align-items:center;'),
      { bg: '#fff', dir: i % 2 ? 'r' : 'l', d: 0.4, glow: act });
    if (t >= t0) {
      const p = eb((t - t0) / 0.4);
      h += div(x - 18, y - 22, 64, 64, `<span style="font-size:38px;font-weight:700;color:${C.ink};line-height:1">${b}</span>`,
        `background:${C.yellow};border:5px solid ${C.ink};border-radius:50%;display:flex;align-items:center;justify-content:center;transform:scale(${p})`);
    }
  });
  // comment call-to-action
  if (t >= 31.55) {
    const bounce = Math.abs(Math.sin((t - 31.55) * 5)) * 16;
    h += box(t, 31.55, 50, 1360, 600, 210,
      sym('bubble', 20, 30, 150, 132) +
      div(180, 26, 400, null, `<div style="font-size:46px;font-weight:600;color:#fff">আপনার উত্তর</div><div style="font-size:64px;font-weight:700;color:${C.yellow};line-height:1.1">কমেন্টে জানান</div>`),
      { bg: C.blue, dir: 'l' });
    h += arrowSvg(300, 1600 + bounce, 70, 90, 'down', C.yellow, 1);
  }
  h += narrator(t, 20.5, 690, 1340, 360, t < 27.6 ? 'point' : 'shrug');
  return h;
}

const CHAIN = [
  ['কৃষক', 'farmerStand', 34.9], ['স্থানীয় ব্যবসায়ী', 'vendor', 36.45], ['পাইকার', 'truck', 37.8],
  ['আড়তদার', 'depot', 38.55], ['খুচরা বিক্রেতা', 'stall', 39.5],
];
function sChain(t) {
  let h = '';
  h += pill(t, 33.75, 540, 150, 'পণ্যের যাত্রা', { bg: C.blue });
  const y0 = 260, step = 240, bh = 175;
  CHAIN.forEach(([label, icon, t0], i) => {
    const y = y0 + i * step;
    if (i > 0 && t >= t0 - 0.1) h += arrowSvg(500, y - 62, 70, 60, 'down', C.yellow, eb((t - t0 + 0.1) / 0.35));
    h += box(t, t0 - 0.15, 170, y, 760, bh,
      div(18, 14, 140, 140, sym(icon, 5, 5, 130, 130), `background:${C.pale};border:4px solid ${C.ink};border-radius:16px;`) +
      div(185, 0, 540, bh - 12, `<span style="font-size:58px;font-weight:700;color:${C.ink}">${label}</span>`, 'display:flex;align-items:center;'),
      { bg: '#fff', dir: i % 2 ? 'r' : 'l', d: 0.4 });
    if (t >= t0 - 0.15) h += div(78, y + 50, 70, 70, `<span style="font-size:40px;font-weight:700;color:${C.ink}">${BN(i + 1)}</span>`,
      `background:${C.yellow};border:5px solid ${C.ink};border-radius:50%;display:flex;align-items:center;justify-content:center;transform:scale(${eb((t - t0 + 0.15) / 0.4)})`);
  });
  // a tomato travelling down the chain
  const times = CHAIN.map(c => c[2]);
  let k = 0;
  for (let i = 0; i < times.length - 1; i++) if (t >= times[i]) k = i + eio((t - times[i] - 0.1) / 0.6) * (t >= times[i + 1] ? 1 : 0);
  if (t >= times[0]) {
    const ty = y0 + k * step + 40;
    h += sym('tomato', 880, ty + Math.sin(t * 6) * 5, 100, 100);
  }
  return h;
}

const COSTS = [
  ['পরিবহন খরচ', 'truck', '#3d8bfd', 42.6], ['শ্রমিকের মজুরি', 'crate', '#8a63d2', 43.84],
  ['সংরক্ষণ খরচ', 'depot', '#f08c2e', 45.12], ['ব্যবসায়িক মুনাফা', 'wallet', C.red, 46.58],
];
function sCosts(t) {
  let h = '';
  h += rev(t, 41.06, 40, 160, 1000, 'প্রতিটি ধাপে যোগ হয়', { size: 70 });
  const x = 170, w = 600, base = 1440, bh = 165;
  // farmer's price at the base
  h += box(t, 41.2, x, base - 190, w, 190,
    div(0, 0, w - 12, 178, `<div style="font-size:44px;font-weight:600;color:#fff">কৃষকের দাম</div><div style="font-size:72px;font-weight:700;color:#fff;line-height:1.05">৳ ২০</div>`, 'display:flex;flex-direction:column;align-items:center;justify-content:center'),
    { bg: C.green, dir: 'b' });
  COSTS.forEach(([label, icon, col, t0], i) => {
    if (t < t0 - 0.35) return;
    const target = base - 190 - (i + 1) * bh;
    const p = eb((t - t0 + 0.35) / 0.55);
    const y = -200 + (target + 200) * p;
    h += div(x, y, w + 16, bh + 16,
      div(16, 16, w, bh - 8, '', `background:${C.ink};border-radius:18px;`) +
      div(0, 0, w, bh - 8, sym(icon, 22, 18, 120, 120) +
        div(150, 0, w - 170, bh - 20, `<span style="font-size:52px;font-weight:700;color:#fff">${label}</span>`, 'display:flex;align-items:center;'),
        `background:${col};border:6px solid ${C.ink};border-radius:18px;box-sizing:border-box;`));
  });
  // market price on top
  h += tag(330, 340, 'বাজারে ৳ ৬০', t, 47.0, { color: C.red, size: 74, rot: -3 });
  // growth arrow at the side
  if (t > 42.4) {
    const g = eio((t - 42.4) / 5.0), top = 1300 - g * 760;
    h += div(860, top, 40, 1300 - top, '', `background:linear-gradient(${C.red},${C.yellow});border:5px solid ${C.ink};border-radius:10px;`);
    h += arrowSvg(835, top - 70, 90, 90, 'up', C.red, 1);
  }
  return h;
}

const WARN = [['অস্বাভাবিক মুনাফা', 49.0], ['বাজার নিয়ন্ত্রণ', 50.66], ['কৃত্রিম সংকট', 51.94]];
function warnIcon() {
  return `<svg width="90" height="80" style="position:absolute;left:30px;top:28px"><path d="M45 4 L86 76 H4 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/><rect x="41" y="26" width="8" height="28" fill="${C.ink}"/><circle cx="45" cy="64" r="5" fill="${C.ink}"/></svg>`;
}
function sBurden(t) {
  let h = '';
  h += rev(t, 47.97, 40, 160, 1000, 'কিন্তু কোথাও যদি…', { size: 66 });
  WARN.forEach(([label, t0], i) => {
    if (t < t0 - 0.1) return;
    const p = eo((t - t0 + 0.1) / 0.35), shake = Math.sin((t - t0) * 40) * 6 * Math.exp(-(t - t0) * 5);
    h += div(100, 280 + i * 190, 880, 150, warnIcon() +
      div(140, 0, 720, 150, `<span style="font-size:60px;font-weight:700;color:#fff">${label}</span>`, 'display:flex;align-items:center;'),
      `background:#c62f2f;border:6px solid ${C.ink};border-radius:20px;box-shadow:12px 12px 0 ${C.ink};box-sizing:border-box;
       transform:translateX(${shake}px) scale(${1.5 - 0.5 * p}) rotate(${(1 - p) * -8}deg);opacity:${p}`);
  });
  // weight falls into the buyer's pocket
  if (t >= 53.6) {
    const land = 54.9;
    const fp = eio((t - 54.1) / (land - 54.1));
    const squash = t > land ? 1 - 0.12 * Math.exp(-(t - land) * 6) * Math.abs(Math.cos((t - land) * 18)) : 1;
    h += box(t, 53.6, 190, 900, 700, 580,
      div(0, 300, 688, 268, sym('pocket', 214, 0, 260, 250), `transform-origin:50% 100%;transform:scaleY(${squash})`) +
      div(0, 500 - 470, 688, null, t > 55.7 ? `<span style="font-size:46px;font-weight:700;color:${C.ink};background:${C.yellow};padding:4px 22px 8px;border-radius:14px;border:4px solid ${C.ink}">সাধারণ ক্রেতার পকেটে</span>` : '', 'text-align:center') +
      (t > 54.1 ? div(254, -260 + fp * 410, 180, 164, sym('weight', 0, 0, 180, 164) +
        div(0, 70, 180, null, '<span style="font-size:46px;font-weight:700;color:#fff">বোঝা</span>', 'text-align:center'), '') : ''),
      { bg: '#fff', dir: 'b' });
  }
  return h;
}

function sFinalQ(t) { // closing questions — highlighted
  let h = '';
  const pulse = 1 + 0.05 * Math.sin(t * 7);
  if (t >= 56.6) h += div(0, 140, W, null, `<span style="display:inline-block;background:${C.red};color:#fff;font-size:52px;font-weight:700;padding:6px 40px 12px;border:6px solid ${C.ink};border-radius:60px;box-shadow:8px 8px 0 ${C.ink};transform:scale(${eb((t - 56.6) / 0.45) * pulse})">প্রশ্ন হচ্ছে</span>`, 'text-align:center');
  h += box(t, 57.0, 50, 280, 980, 560,
    sym('field', 0, 0, 968, 548, 'opacity:.35', true) + sym('farmerSad', 10, 150, 340, 408) +
    div(350, 40, 600, 480, words(t, 58.3, 61.0, 'যে কৃষক ফসল ফলান, তিনিই কেন ন্যায্য দাম পান না?', 5),
      `font-size:60px;font-weight:700;color:${C.ink};line-height:1.35;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;text-align:center`),
    { bg: C.yellow, dir: 'l', glow: t < 61.7 ? 0.5 + 0.5 * Math.sin(t * 6) : 0.1 });
  h += box(t, 61.75, 50, 910, 980, 560,
    sym('marketBg', 0, 0, 968, 548, 'opacity:.35', true) + sym('buyer', 700, 100, 250, 448) +
    div(30, 40, 650, 480, words(t, 61.9, 65.4, 'আর যে মানুষ বাজার থেকে খাবার কেনেন, তাকেই কেন বাড়তি দাম দিতে হয়?', 9),
      `font-size:58px;font-weight:700;color:${C.ink};line-height:1.35;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;text-align:center`),
    { bg: C.yellow, dir: 'r', glow: t > 61.75 ? 0.5 + 0.5 * Math.sin(t * 6) : 0 });
  if (t > 57.3) h += qmark(940, 240, 110, t, { bg: C.red, color: '#fff' });
  if (t > 62.0) h += qmark(20, 870, 100, t, { bg: C.red, color: '#fff', ph: 2 });
  h += narrator(t, 57.2, 760, 1500, 280, 'shrug', { brow: 1 });
  return h;
}

function sEnd(t) {
  let h = '';
  // transparency: magnifier sweeping a mini supply chain
  const icons = ['farmerStand', 'truck', 'depot', 'stall', 'buyer'];
  h += box(t, 65.9, 60, 180, 960, 560,
    div(0, 26, 948, null, `<span style="font-size:58px;font-weight:700;color:${C.ink}">বাজার ব্যবস্থায় </span><span style="font-size:64px;font-weight:700;color:${C.blue}">স্বচ্ছতা</span>`, 'text-align:center') +
    icons.map((ic, i) => sym(ic, 30 + i * 182, 220, 160, 200)).join('') +
    icons.slice(0, 4).map((_, i) => arrowSvg(172 + i * 182, 300, 34, 34, 'right', C.blue, 1)).join('') +
    (t > 66.4 ? sym('magnifier', -60 + eio((t - 66.4) / 4) * 860, 150 + Math.sin(t * 3) * 20, 230, 230) : ''),
    { bg: C.pale, dir: 'l' });
  h += rev(t, 68.9, 40, 780, 1000, `নিশ্চিত না হলে সমাধান <span style="color:${C.red}">কঠিন</span>`, { size: 60 });
  // living cost rising
  if (t >= 71.6) {
    const g = eio((t - 72.2) / 3.6);
    const pts = [[380, 380], [470, 340], [560, 360], [650, 280], [740, 230], [830, 140]];
    const n = 1 + g * (pts.length - 1), seg = [];
    for (let i = 0; i < Math.floor(n); i++) seg.push(pts[i]);
    const fi = Math.floor(n), fr = n - fi;
    if (fi < pts.length && fi > 0) seg.push([pts[fi - 1][0] + (pts[fi][0] - pts[fi - 1][0]) * fr, pts[fi - 1][1] + (pts[fi][1] - pts[fi - 1][1]) * fr]);
    const d = seg.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
    const last = seg[seg.length - 1];
    h += box(t, 71.6, 60, 900, 960, 580,
      div(0, 24, 948, null, `<span style="font-size:52px;font-weight:600;color:${C.ink}">শুধু পণ্যের দাম নয়</span>`, 'text-align:center') +
      sym('house', 50, 200, 280, 254) +
      `<svg style="position:absolute;left:0;top:0;overflow:visible" width="948" height="568"><path d="${d}" stroke="${C.ink}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${C.red}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${g > 0 ? `<circle cx="${last[0]}" cy="${last[1]}" r="16" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/>` : ''}</svg>` +
      (t > 74.5 ? div(0, 470, 948, null, `<span style="font-size:58px;font-weight:700;color:${C.red}">বাড়ে বেঁচে থাকার খরচও</span>`, `text-align:center;opacity:${P(t, 74.5)};`) : ''),
      { bg: '#fff', dir: 'b' });
  }
  return h;
}

function sOutro(t) {
  let h = '';
  const p = eb((t - 77.3) / 0.6);
  h += div(0, 330, W, null, `<div style="font-size:64px;font-weight:600;color:${C.grey}">ধন্যবাদ</div>`, `text-align:center;opacity:${P(t, 77.4)}`);
  h += div(90, 470, 900, 220, `<span style="font-size:104px;font-weight:700;color:#fff;letter-spacing:1px">TR Universe <span style="color:${C.yellow}">0.1</span></span>`,
    `display:flex;align-items:center;justify-content:center;background:${C.blue};border:7px solid ${C.ink};border-radius:28px;box-shadow:14px 14px 0 ${C.sky};transform:scale(${p});opacity:${cl(p * 2)}`);
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + t * 0.6, r = 430;
    h += sym('tomato', 490 + Math.cos(a) * r, 560 + Math.sin(a) * r * 0.45 + 420, 100, 100, `opacity:${P(t, 77.6 + i * 0.08)}`);
  }
  h += narrator(t, 77.5, 330, 1060, 420, 'wave');
  return h;
}

const SCENES = [
  [0, sHook], [6.6, sReality], [17.45, sMiddle], [20.2, sAsk], [33.55, sChain],
  [40.9, sCosts], [47.75, sBurden], [56.5, sFinalQ], [65.8, sEnd], [77.25, sOutro],
];

function subtitle(t) {
  for (const [s, e, str] of SUBS) {
    if (t < s - 0.1 || t > e + 0.3) continue;
    const a = cl((t - s + 0.1) / 0.2) * (1 - cl((t - e - 0.05) / 0.25));
    return div(70, 1590, 940, null,
      `<span style="display:inline-block;background:rgba(6,18,38,.86);border:4px solid ${C.sky};border-radius:20px;padding:10px 30px 16px;font-size:44px;font-weight:600;color:#fff;line-height:1.4">${str}</span>`,
      `text-align:center;opacity:${a}`);
  }
  return '';
}

function watermark() {
  return div(0, 60, 1040, null,
    `<span style="display:inline-flex;align-items:center;gap:12px;background:rgba(6,18,38,.55);border:3px solid rgba(95,180,255,.7);border-radius:40px;padding:4px 22px 6px 8px;">
       <span style="display:inline-flex;width:46px;height:46px;border-radius:50%;background:${C.blue};color:#fff;font-size:22px;font-weight:700;align-items:center;justify-content:center;border:3px solid #fff">TR</span>
       <span style="font-size:30px;font-weight:600;color:#fff;letter-spacing:.5px">TR Universe 0.1</span></span>`,
    'text-align:right;opacity:.85');
}

function wipe(t) { // box-wipe transition band at each scene change
  for (const [s] of SCENES.slice(1)) {
    const k = (t - (s - 0.32)) / 0.64;
    if (k < 0 || k > 1) continue;
    const x = 1300 - eio(k) * 3000;
    return div(x, -200, 1500, H + 400, '', `background:${C.blue};transform:skewX(-14deg);border-left:30px solid ${C.yellow};border-right:30px solid ${C.sky};box-shadow:0 0 0 8px ${C.ink}`);
  }
  return '';
}

window.render = function (t) {
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i][0]) idx = i;
  let h = background(t) + SCENES[idx][1](t);
  h += subtitle(t) + watermark() + wipe(t);
  const fade = cl(t / 0.4) * (1 - cl((t - (DURATION - 0.9)) / 0.9));
  if (fade < 1) h += div(0, 0, W, H, '', `background:#000;opacity:${1 - fade}`);
  document.getElementById('stage').innerHTML = h;
};
window.setMouth = m => { MOUTH = m; };
