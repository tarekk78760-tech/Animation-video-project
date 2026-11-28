// ===== Character + prop library (pure SVG strings) =====
const C = {
  ink: '#14213D', ink2: '#1D2E52', paper: '#F6EFE4', paper2: '#EDE3D3',
  amber: '#F4A93B', amberD: '#D98A1F', coral: '#E85D4A', teal: '#2A9D8F',
  wood: '#7A5233', woodD: '#5E3D25', text: '#1B2236', mute: '#8A8F9C'
};

function clamp(v, a = 0, b = 1) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function eo(t) { t = clamp(t); return 1 - Math.pow(1 - t, 3); }          // ease out cubic
function eio(t) { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function back(t) { t = clamp(t); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
function prog(t, a, d) { return clamp((t - a) / d); }
function pop(t, a, d = .35) { return back(prog(t, a, d)); }
const BN = '০১২৩৪৫৬৭৮৯';
function bn(s) { return String(s).replace(/[0-9]/g, d => BN[d]); }

// blink: returns 0..1 for a given time + seed
function blinkAt(t, seed = 0) {
  const period = 3.1 + (seed % 3) * 0.7;
  const p = ((t + seed * 1.37) % period);
  return p < 0.14 ? Math.sin(p / 0.14 * Math.PI) : 0;
}

// ---------- Person (front bust). Head centre at (0,0), torso to y≈430 ----------
function person(o) {
  const k = o.kind || 'rafiq';
  const R = k === 'rafiq';
  const skin = R ? '#B9794F' : '#F0C6A2', shade = R ? '#9E6340' : '#DDA986';
  const hair = R ? '#1F1A19' : '#D7D7DC';
  const mouth = clamp(o.mouth || 0), expr = o.expr || 'neutral';
  const lx = (o.look ? o.look[0] : 0) * 7, ly = (o.look ? o.look[1] : 0) * 6;
  const bl = clamp(o.blink || 0);
  const nod = o.nod || 0, tilt = o.tilt || 0;
  let s = '';
  // ---- torso ----
  if (R) {
    s += `<path d="M-215,440 C-215,262 -160,196 -62,176 L62,176 C160,196 215,262 215,440 Z" fill="#EFE6D3"/>`;
    s += `<path d="M-215,440 C-215,262 -160,196 -62,176 L-8,330 L-18,440 Z" fill="#6B4A2E"/>`;
    s += `<path d="M215,440 C215,262 160,196 62,176 L8,330 L18,440 Z" fill="#6B4A2E"/>`;
    s += `<path d="M-215,440 C-215,300 -190,240 -150,215 C-170,290 -175,360 -170,440Z" fill="#5A3D25" opacity=".55"/>`;
    s += `<circle cx="-12" cy="360" r="6" fill="#3E2A18"/><circle cx="-14" cy="405" r="6" fill="#3E2A18"/>`;
    s += `<rect x="-130" y="300" width="58" height="8" rx="4" fill="#5A3D25"/>`;
  } else {
    s += `<path d="M-220,440 C-220,262 -165,196 -62,176 L62,176 C165,196 220,262 220,440 Z" fill="#3A4052"/>`;
    s += `<path d="M-60,176 L0,300 L60,176 Z" fill="#F7F7F4"/>`;
    s += `<path d="M-12,215 L12,215 L20,330 L0,360 L-20,330 Z" fill="${C.teal}"/><path d="M-12,200 L12,200 L9,218 L-9,218Z" fill="#23867A"/>`;
    s += `<path d="M-62,176 L-8,320 L-40,440 L-80,440 L-110,250 Z" fill="#2F3443"/><path d="M62,176 L8,320 L40,440 L80,440 L110,250 Z" fill="#2F3443"/>`;
    s += `<path d="M-150,270 L-100,265 L-102,280 L-150,284Z" fill="#F7F7F4" opacity=".9"/>`;
  }
  // neck
  s += `<path d="M-38,80 L38,80 L42,190 L-42,190 Z" fill="${shade}"/>`;
  // collar
  if (R) s += `<path d="M-62,176 L-40,150 L-2,214 L-30,226Z" fill="#FBF6EA"/><path d="M62,176 L40,150 L2,214 L30,226Z" fill="#FBF6EA"/>`;
  else s += `<path d="M-58,178 L-40,152 L-4,212 L-26,222Z" fill="#fff"/><path d="M58,178 L40,152 L4,212 L26,222Z" fill="#fff"/>`;
  // ---- head group ----
  let h = '';
  h += `<ellipse cx="-92" cy="8" rx="17" ry="26" fill="${shade}"/><ellipse cx="92" cy="8" rx="17" ry="26" fill="${shade}"/>`;
  h += `<path d="M-90,-30 C-92,-110 -50,-128 0,-128 C50,-128 92,-110 90,-30 C90,40 70,108 0,116 C-70,108 -90,40 -90,-30Z" fill="${skin}"/>`;
  h += `<path d="M60,-90 C88,-60 92,10 70,70 C82,20 80,-40 60,-90Z" fill="${shade}" opacity=".45"/>`;
  if (R) {
    h += `<path d="M-96,-6 C-104,-96 -60,-142 4,-140 C70,-138 104,-96 96,-8 C90,-52 80,-70 60,-82 C20,-70 -30,-92 -66,-70 C-82,-58 -90,-36 -96,-6Z" fill="${hair}"/>`;
    h += `<path d="M-96,-6 C-98,-30 -94,-44 -88,-54 L-84,-6Z" fill="#7C7470"/><path d="M96,-8 C98,-30 94,-44 88,-54 L84,-8Z" fill="#7C7470"/>`;
  } else {
    h += `<path d="M-94,-20 C-100,-104 -50,-146 10,-142 C76,-138 104,-92 94,-20 C88,-64 70,-88 30,-96 C-20,-104 -70,-80 -84,-46 C-90,-36 -92,-28 -94,-20Z" fill="${hair}"/>`;
    h += `<path d="M-30,-118 C10,-140 60,-126 80,-100 C40,-118 0,-118 -30,-118Z" fill="#B9B9C2"/>`;
    // beard
    h += `<path d="M-86,20 C-80,90 -40,124 0,124 C40,124 80,90 86,20 C76,60 52,80 30,72 C10,66 -10,66 -30,72 C-52,80 -76,60 -86,20Z" fill="#C9C9D0"/>`;
  }
  // brows
  const bw = R ? 10 : 8, bc = R ? hair : '#A9A9B2';
  let bi = 0, bo = 0;            // inner / outer y offsets
  if (expr === 'worried' || expr === 'sad') { bi = -10; bo = 4; }
  if (expr === 'smile' || expr === 'laugh') { bi = -6; bo = -6; }
  if (expr === 'stern') { bi = 6; bo = -2; }
  h += `<path d="M-60,${-44 + bo} Q-40,${-56 + (bo + bi) / 2} -18,${-46 + bi}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  h += `<path d="M60,${-44 + bo} Q40,${-56 + (bo + bi) / 2} 18,${-46 + bi}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  // eyes
  const happyClosed = expr === 'laugh';
  for (const ex of [-38, 38]) {
    if (happyClosed) { h += `<path d="M${ex - 15},-8 Q${ex},-24 ${ex + 15},-8" stroke="#2B1D14" stroke-width="7" fill="none" stroke-linecap="round"/>`; continue; }
    const ry = 15 * (1 - bl);
    if (ry < 3) { h += `<path d="M${ex - 16},-6 Q${ex},0 ${ex + 16},-6" stroke="#2B1D14" stroke-width="6" fill="none" stroke-linecap="round"/>`; continue; }
    h += `<ellipse cx="${ex}" cy="-8" rx="17" ry="${ry}" fill="#fff"/>`;
    h += `<clipPath id="ec${k}${ex}"><ellipse cx="${ex}" cy="-8" rx="17" ry="${ry}"/></clipPath>`;
    h += `<g clip-path="url(#ec${k}${ex})"><circle cx="${ex + lx}" cy="${-7 + ly}" r="9.5" fill="#2B1D14"/><circle cx="${ex + lx + 3}" cy="${-11 + ly}" r="3" fill="#fff"/></g>`;
    if (expr === 'worried' || expr === 'sad') h += `<path d="M${ex - 18},${-8 - ry + 2} L${ex + 18},${-8 - ry + 2}" stroke="${skin}" stroke-width="6"/>`;
  }
  if (!R) { // glasses
    h += `<circle cx="-38" cy="-8" r="27" fill="#fff" fill-opacity=".08" stroke="#2C2C34" stroke-width="5"/><circle cx="38" cy="-8" r="27" fill="#fff" fill-opacity=".08" stroke="#2C2C34" stroke-width="5"/><path d="M-11,-10 Q0,-16 11,-10" stroke="#2C2C34" stroke-width="5" fill="none"/>`;
  }
  // nose
  h += `<path d="M2,4 Q12,34 0,40 Q-8,42 -14,37" stroke="${shade}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  // cheeks
  if (expr === 'smile' || expr === 'laugh') h += `<ellipse cx="-56" cy="34" rx="16" ry="9" fill="#E2735E" opacity=".35"/><ellipse cx="56" cy="34" rx="16" ry="9" fill="#E2735E" opacity=".35"/>`;
  // mouth
  const my = 70;
  if (mouth > 0.08) {
    const ry = 4 + mouth * 17, rx = 17 + mouth * 3;
    if (expr === 'smile' || expr === 'laugh') {
      h += `<path d="M${-rx - 4},${my - 4} Q0,${my - 8} ${rx + 4},${my - 4} Q${rx},${my + ry * 1.6} 0,${my + ry * 1.7} Q${-rx},${my + ry * 1.6} ${-rx - 4},${my - 4}Z" fill="#5A1F1C"/>`;
      h += `<path d="M${-rx + 2},${my - 3} L${rx - 2},${my - 3} L${rx - 6},${my + 3} L${-rx + 6},${my + 3}Z" fill="#fff"/>`;
    } else {
      h += `<ellipse cx="0" cy="${my + ry * .4}" rx="${rx}" ry="${ry}" fill="#5A1F1C"/>`;
      h += `<ellipse cx="0" cy="${my + ry * 1.0}" rx="${rx * .6}" ry="${ry * .4}" fill="#C65B52"/>`;
      if (mouth > .4) h += `<rect x="${-rx * .7}" y="${my + ry * .4 - ry}" width="${rx * 1.4}" height="5" rx="2" fill="#fff"/>`;
    }
  } else {
    const c = { smile: 12, laugh: 14, neutral: 2, sad: -10, worried: -6, stern: -3 }[expr] ?? 2;
    h += `<path d="M-22,${my} Q0,${my + c} 22,${my}" stroke="#5A1F1C" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  if (R) h += `<path d="M-40,58 Q-20,40 0,48 Q20,40 40,58 Q22,54 0,56 Q-22,54 -40,58Z" fill="${hair}"/>`;
  // sweat
  if (o.sweat) {
    const sy = -70 + ((o.t || 0) * 26 % 60);
    h += `<g opacity="${clamp(o.sweat)}"><path d="M74,${sy - 18} C82,${sy - 4} 88,${sy + 6} 74,${sy + 12} C60,${sy + 6} 66,${sy - 4} 74,${sy - 18}Z" fill="#9BD8F2" stroke="#fff" stroke-width="3"/></g>`;
    h += `<g opacity="${clamp(o.sweat) * .8}"><path d="M-80,-60 C-76,-52 -72,-46 -80,-42 C-88,-46 -84,-52 -80,-60Z" fill="#9BD8F2" stroke="#fff" stroke-width="2"/></g>`;
  }
  s += `<g transform="translate(0,${nod * 6}) rotate(${tilt + nod * 0.6})">${h}</g>`;
  const sc = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.flip ? -sc : sc},${sc})">${s}</g>`;
}

// ---------- props ----------
function waveform(cx, cy, w, amp, t, color, sw = 8, phase = 0) {
  let d = '';
  const n = 90;
  for (let i = 0; i <= n; i++) {
    const x = cx - w / 2 + w * i / n;
    const env = Math.sin(Math.PI * i / n);
    const y = cy + amp * env * (Math.sin(i * .55 + t * 9 + phase) * .6 + Math.sin(i * .23 - t * 5) * .4);
    d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return `<path d="${d}" stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function bubble(x, y, w, h, fill, stroke, tail = 'left', dash = false) {
  const tx = tail === 'left' ? x + 40 : x + w - 40;
  const td = tail === 'left' ? -1 : 1;
  return `<path d="M${x + 24},${y} H${x + w - 24} Q${x + w},${y} ${x + w},${y + 24} V${y + h - 24} Q${x + w},${y + h} ${x + w - 24},${y + h} H${tx + 18} L${tx + td * 6},${y + h + 26} L${tx - 14},${y + h} H${x + 24} Q${x},${y + h} ${x},${y + h - 24} V${y + 24} Q${x},${y} ${x + 24},${y}Z" fill="${fill}" stroke="${stroke}" stroke-width="5" ${dash ? 'stroke-dasharray="14 10"' : ''}/>`;
}
function grain(op = .06) { return `<rect width="1080" height="1920" filter="url(#grain)" opacity="${op}"/>`; }
function vignette(op = .35) { return `<rect width="1080" height="1920" fill="url(#vig)" opacity="${op}"/>`; }
function moneyNote(x, y, r, s = 1) {
  return `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})"><rect x="-80" y="-40" width="160" height="80" rx="8" fill="#7FB77E" stroke="#4E8A4D" stroke-width="4"/><circle cx="0" cy="0" r="22" fill="none" stroke="#4E8A4D" stroke-width="4"/><text x="0" y="12" font-size="34" font-weight="700" text-anchor="middle" fill="#3D6E3C">৳</text></g>`;
}
function priceTag(x, y, s, label, sub, strike = []) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<path d="M-40,-70 H190 Q210,-70 210,-50 V50 Q210,70 190,70 H-40 L-110,0Z" fill="#FFF8EC" stroke="${C.ink}" stroke-width="6"/><circle cx="-62" cy="0" r="12" fill="${C.ink}"/>`;
  g += `<text x="60" y="18" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">${label}</text>`;
  if (sub) g += `<text x="60" y="58" text-anchor="middle" font-size="24" font-weight="600" fill="${C.mute}">${sub}</text>`;
  return g + '</g>';
}
function clockFace(x, y, r, t) {
  let g = `<g transform="translate(${x},${y})"><circle r="${r}" fill="#FFFBF3" stroke="${C.ink}" stroke-width="${r * .09}"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, l = i % 5 ? r * .05 : r * .12;
    g += `<line x1="${Math.sin(a) * (r * .86)}" y1="${-Math.cos(a) * (r * .86)}" x2="${Math.sin(a) * (r * .86 - l)}" y2="${-Math.cos(a) * (r * .86 - l)}" stroke="${C.ink}" stroke-width="${i % 5 ? 2 : 5}"/>`;
  }
  const sa = Math.floor(t * 1) * 6 + 120;
  g += `<line x1="0" y1="0" x2="${Math.sin(1.1) * r * .5}" y2="${-Math.cos(1.1) * r * .5}" stroke="${C.ink}" stroke-width="${r * .06}" stroke-linecap="round"/>`;
  g += `<line x1="0" y1="0" x2="${Math.sin(4.6) * r * .7}" y2="${-Math.cos(4.6) * r * .7}" stroke="${C.ink}" stroke-width="${r * .045}" stroke-linecap="round"/>`;
  g += `<line x1="0" y1="${r * .15}" x2="${Math.sin(sa * Math.PI / 180) * r * .78}" y2="${-Math.cos(sa * Math.PI / 180) * r * .78}" stroke="${C.coral}" stroke-width="${r * .02}" stroke-linecap="round"/><circle r="${r * .05}" fill="${C.coral}"/>`;
  return g + '</g>';
}
function plant(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 C-30,-60 -70,-90 -90,-140 C-40,-120 -10,-70 0,0Z" fill="#3F7D5C"/><path d="M0,0 C20,-80 60,-110 70,-170 C20,-140 0,-90 0,0Z" fill="#4E9470"/><path d="M0,0 C-5,-70 -20,-120 -10,-190 C10,-130 10,-70 0,0Z" fill="#356B4E"/><path d="M-40,0 H40 L30,70 H-30Z" fill="#C8693F"/></g>`;
}
function factory(x, y, s, big = 0) {
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<rect x="-300" y="-40" width="600" height="240" fill="#E8DCC8"/>`;
  g += `<path d="M-300,-40 L-300,-120 L-200,-40 L-200,-120 L-100,-40 L-100,-120 L0,-40 L0,-120 L100,-40 L100,-120 L200,-40 L200,-120 L300,-40Z" fill="#C9B79A"/>`;
  g += `<rect x="190" y="-260" width="50" height="220" fill="#A99577"/><rect x="186" y="-270" width="58" height="18" fill="#8E7B5E"/>`;
  for (let i = 0; i < 5; i++) g += `<rect x="${-270 + i * 110}" y="20" width="70" height="60" rx="6" fill="#8FB8C9" stroke="#6D5B44" stroke-width="5"/>`;
  g += `<rect x="-60" y="110" width="120" height="90" fill="#6D5B44"/><rect x="-200" y="-15" width="400" height="0" fill="none"/>`;
  g += `<rect x="-170" y="-110" width="340" height="56" rx="10" fill="${C.ink}" transform="translate(0,-40)"/><text x="0" y="-108" text-anchor="middle" font-size="36" font-weight="700" fill="${C.amber}">রফিক গার্মেন্টস</text>`;
  return g + '</g>';
}
function smoke(x, y, t, s = 1) {
  let g = '';
  for (let i = 0; i < 4; i++) {
    const p = ((t * .4 + i / 4) % 1);
    g += `<circle cx="${x + p * 60 * s}" cy="${y - p * 220 * s}" r="${(20 + p * 40) * s}" fill="#fff" opacity="${.7 * (1 - p)}"/>`;
  }
  return g;
}
function tshirt(x, y, s, col = C.teal) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60,-70 L-25,-85 Q0,-65 25,-85 L60,-70 L95,-30 L65,-5 L55,-20 L55,85 L-55,85 L-55,-20 L-65,-5 L-95,-30Z" fill="${col}"/><path d="M-25,-85 Q0,-65 25,-85" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none"/></g>`;
}
function stamp(x, y, s, txt, col, rot = -12) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-190" y="-62" width="380" height="124" rx="18" fill="none" stroke="${col}" stroke-width="10"/><rect x="-176" y="-48" width="352" height="96" rx="12" fill="none" stroke="${col}" stroke-width="3"/><text x="0" y="20" text-anchor="middle" font-size="58" font-weight="700" fill="${col}">${txt}</text></g>`;
}
