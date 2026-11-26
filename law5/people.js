// ===== Law 5 cast: Jamal Saheb, rude customer, waiter boy, daughter =====
// Redefines person(); same options as before:
// {kind, x, y, s, expr: neutral|smile|laugh|sad|worried|stern|angry|shout|calm, mouth 0..1, look:[x,y], blink, sweat, nod, tilt, flip, t}
const KINDS = {
  jamal:    { skin: '#A96E46', shade: '#8C5634', hair: '#2E2A29', brow: '#3A3433', rx: 98, ry: 118 },
  customer: { skin: '#C68B5E', shade: '#A87048', hair: '#141212', brow: '#141212', rx: 88, ry: 116 },
  waiter:   { skin: '#94603D', shade: '#7A4C2F', hair: '#1B1716', brow: '#1B1716', rx: 82, ry: 108 },
  daughter: { skin: '#C48A60', shade: '#A9714B', hair: '#1A1514', brow: '#2A201C', rx: 84, ry: 110 }
};

function person(o) {
  const k = o.kind || 'jamal', K = KINDS[k];
  const { skin, shade, hair, brow, rx, ry } = K;
  const mouth = clamp(o.mouth || 0), expr = o.expr || 'neutral';
  const lx = (o.look ? o.look[0] : 0) * 7, ly = (o.look ? o.look[1] : 0) * 6;
  const bl = clamp(o.blink || 0), nod = o.nod || 0, tilt = o.tilt || 0;
  let s = '';

  // ---------------- torso ----------------
  if (k === 'daughter') s += `<path d="M-104,-40 C-122,60 -124,160 -108,236 Q-96,256 -70,250 L70,250 Q96,256 108,236 C124,160 122,60 104,-40Z" fill="${hair}"/>`; // long hair behind, ends at shoulders
  if (k === 'jamal') {
    s += `<path d="M-225,440 C-225,258 -165,192 -62,176 L62,176 C165,192 225,258 225,440 Z" fill="#F2EEE4"/>`;          // fatua
    s += `<path d="M-6,180 L6,180 L6,330 L-6,330Z" fill="#DCD5C6"/><circle cx="0" cy="235" r="6" fill="#B9AF9C"/><circle cx="0" cy="290" r="6" fill="#B9AF9C"/>`;
    // green check gamchha on shoulder
    s += `<path d="M60,176 C120,182 170,200 190,250 L150,440 L95,440 L120,260 C100,220 80,205 50,196Z" fill="#2F8F6B"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${60 + i * 22},${180 + i * 6} L${150 - i * 6},${440}" stroke="#E9C46A" stroke-width="5" opacity=".55"/>`;
    s += `<path d="M150,250 L190,250 M130,320 L172,320 M118,390 L160,390" stroke="#E85D4A" stroke-width="6" opacity=".6"/>`;
  } else if (k === 'customer') {
    s += `<path d="M-215,440 C-215,258 -160,194 -62,176 L62,176 C160,194 215,258 215,440 Z" fill="#8E2236"/>`;            // maroon shirt
    s += `<path d="M-62,176 L0,250 L62,176 L40,168 L0,215 L-40,168Z" fill="#6E1828"/><path d="M-30,176 L0,250 L30,176Z" fill="${shade}"/>`;
    s += `<path d="M-34,190 Q0,262 34,190" stroke="#E8B94A" stroke-width="7" fill="none"/>`;                                  // gold chain
    s += `<path d="M-215,440 C-215,300 -190,240 -150,215 C-170,290 -175,360 -170,440Z" fill="#000" opacity=".15"/>`;
  } else if (k === 'waiter') {
    s += `<path d="M-200,440 C-200,262 -150,198 -58,178 L58,178 C150,198 200,262 200,440 Z" fill="#FFFFFF"/>`;
    s += `<path d="M-200,440 C-200,262 -150,198 -58,178 L-16,330 L-24,440 Z" fill="#232A38"/><path d="M200,440 C200,262 150,198 58,178 L16,330 L24,440 Z" fill="#232A38"/>`;
    s += `<path d="M-12,190 L12,190 L0,212Z" fill="#232A38"/>`;
    s += `<path d="M-120,200 C-90,190 -60,186 -40,190 L-70,330 L-120,330Z" fill="#E9E1CF"/><path d="M-120,250 h50 M-120,290 h50" stroke="#C9BBA0" stroke-width="5"/>`; // towel
  } else if (k === 'daughter') {
    s += `<path d="M-205,440 C-205,262 -150,198 -58,178 L58,178 C150,198 205,262 205,440 Z" fill="#E0A13A"/>`;              // kameez
    s += `<path d="M-40,178 Q0,236 40,178" fill="${shade}"/>`;
    s += `<path d="M-205,300 C-120,250 -40,300 40,260 C120,220 170,250 205,230 L205,330 C150,350 110,320 40,350 C-40,380 -120,340 -205,380Z" fill="${C.teal}"/>`; // orna
    s += `<path d="M120,178 C170,200 200,250 205,300 L170,300 C160,250 140,215 100,190Z" fill="${C.teal}"/>`;
  }
  // neck + collar
  s += `<path d="M-36,80 L36,80 L40,190 L-40,190 Z" fill="${shade}"/>`;
  if (k === 'jamal') s += `<path d="M-50,180 Q0,214 50,180 L44,170 Q0,200 -44,170Z" fill="#E2DCCD"/>`;
  if (k === 'waiter') s += `<path d="M-56,180 L-36,154 L-2,206 L-26,216Z" fill="#fff" stroke="#E6E6E6" stroke-width="2"/><path d="M56,180 L36,154 L2,206 L26,216Z" fill="#fff" stroke="#E6E6E6" stroke-width="2"/>`;
  if (k === 'customer') s += `<path d="M-62,178 L-44,150 L-6,204 L-30,214Z" fill="#A32C42"/><path d="M62,178 L44,150 L6,204 L30,214Z" fill="#A32C42"/>`;

  // ---------------- head ----------------
  let h = '';
  h += `<ellipse cx="${-rx}" cy="8" rx="16" ry="25" fill="${shade}"/><ellipse cx="${rx}" cy="8" rx="16" ry="25" fill="${shade}"/>`;
  if (k === 'daughter') h += `<circle cx="${-rx}" cy="36" r="7" fill="#E8B94A"/><circle cx="${rx}" cy="36" r="7" fill="#E8B94A"/>`;
  h += `<path d="M${-rx + 2},-30 C${-rx},${-ry} -50,${-ry - 10} 0,${-ry - 10} C50,${-ry - 10} ${rx},${-ry} ${rx - 2},-30 C${rx - 2},40 ${rx * .76},${ry - 6} 0,${ry} C${-rx * .76},${ry - 6} ${-rx + 2},40 ${-rx + 2},-30Z" fill="${skin}"/>`;
  h += `<path d="M${rx * .66},-90 C${rx * .95},-60 ${rx},10 ${rx * .76},70 C${rx * .88},20 ${rx * .86},-40 ${rx * .66},-90Z" fill="${shade}" opacity=".45"/>`;
  // hair
  if (k === 'jamal') {
    h += `<path d="M${-rx - 4},-4 C${-rx - 8},-60 ${-rx + 10},-96 -50,-108 C-40,-84 -66,-60 ${-rx + 12},-20Z" fill="#6E6764"/>`;
    h += `<path d="M${rx + 4},-4 C${rx + 8},-60 ${rx - 10},-96 50,-108 C40,-84 66,-60 ${rx - 12},-20Z" fill="#6E6764"/>`;
    h += `<path d="M-40,-122 C-10,-132 20,-132 44,-122 C20,-126 -10,-126 -40,-122Z" fill="#6E6764" opacity=".6"/>`;
    h += `<ellipse cx="-30" cy="-100" rx="22" ry="8" fill="#fff" opacity=".18"/>`;                     // bald shine
  } else if (k === 'customer') {
    h += `<path d="M${-rx - 6},-10 C${-rx - 14},-100 -60,-150 0,-150 C30,-168 90,-160 100,-120 C${rx + 14},-80 ${rx + 4},-40 ${rx + 4},-10 C${rx - 6},-60 70,-84 40,-90 C0,-96 -50,-80 ${-rx + 6},-40Z" fill="${hair}"/>`;
    h += `<path d="M-10,-150 C20,-180 70,-176 96,-140 C60,-160 30,-160 -10,-150Z" fill="${hair}"/>`;
    h += `<g transform="translate(0,-112)"><rect x="-74" y="-16" width="62" height="32" rx="14" fill="#1E1E24"/><rect x="12" y="-16" width="62" height="32" rx="14" fill="#1E1E24"/><path d="M-12,-4 h24" stroke="#1E1E24" stroke-width="6"/><rect x="-64" y="-10" width="18" height="6" rx="3" fill="#fff" opacity=".35"/></g>`; // sunglasses on head
  } else if (k === 'waiter') {
    h += `<path d="M${-rx - 6},0 C${-rx - 12},-90 -50,-132 0,-130 C60,-132 ${rx + 12},-90 ${rx + 6},0 C${rx},-40 70,-70 50,-74 L40,-56 L28,-78 L10,-60 L0,-82 L-16,-60 L-30,-80 L-44,-58 L-56,-76 C-70,-60 ${-rx},-40 ${-rx - 6},0Z" fill="${hair}"/>`;
  } else if (k === 'daughter') {
    h += `<path d="M${-rx - 10},40 C${-rx - 20},-90 -50,-140 0,-138 C50,-140 ${rx + 20},-90 ${rx + 10},40 C${rx},-20 ${rx - 10},-70 40,-92 C20,-80 6,-96 0,-104 C-6,-96 -20,-80 -40,-92 C${-rx + 10},-70 ${-rx},-20 ${-rx - 10},40Z" fill="${hair}"/>`;
  }
  // brows
  let bi = 0, bo = 0;
  if (expr === 'worried' || expr === 'sad') { bi = -10; bo = 4; }
  if (expr === 'smile' || expr === 'laugh') { bi = -6; bo = -6; }
  if (expr === 'stern' || expr === 'calm') { bi = 4; bo = -2; }
  if (expr === 'angry' || expr === 'shout') { bi = 14; bo = -8; }
  const bw = k === 'daughter' ? 6 : k === 'jamal' ? 11 : 9;
  const bc = k === 'jamal' ? '#4A4442' : brow;
  h += `<path d="M-60,${-44 + bo} Q-40,${-56 + (bo + bi) / 2} -18,${-46 + bi}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  h += `<path d="M60,${-44 + bo} Q40,${-56 + (bo + bi) / 2} 18,${-46 + bi}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  // eyes
  const closed = expr === 'laugh';
  for (const ex of [-37, 37]) {
    if (closed) { h += `<path d="M${ex - 15},-8 Q${ex},-24 ${ex + 15},-8" stroke="#2B1D14" stroke-width="7" fill="none" stroke-linecap="round"/>`; continue; }
    const er = (expr === 'angry' || expr === 'shout') ? 13 : 15;
    const ery = er * (1 - bl);
    if (ery < 3) { h += `<path d="M${ex - 16},-6 Q${ex},0 ${ex + 16},-6" stroke="#2B1D14" stroke-width="6" fill="none" stroke-linecap="round"/>`; continue; }
    h += `<ellipse cx="${ex}" cy="-8" rx="17" ry="${ery}" fill="#fff"/>`;
    h += `<clipPath id="ec${k}${ex}"><ellipse cx="${ex}" cy="-8" rx="17" ry="${ery}"/></clipPath>`;
    h += `<g clip-path="url(#ec${k}${ex})"><circle cx="${ex + lx}" cy="${-7 + ly}" r="9.5" fill="#2B1D14"/><circle cx="${ex + lx + 3}" cy="${-11 + ly}" r="3" fill="#fff"/></g>`;
    if (expr === 'worried' || expr === 'sad') h += `<path d="M${ex - 18},${-8 - ery + 2} L${ex + 18},${-8 - ery + 2}" stroke="${skin}" stroke-width="6"/>`;
    if (expr === 'angry' || expr === 'shout') h += `<path d="M${ex - 20},${-8 - ery + (ex < 0 ? -2 : 8)} L${ex + 20},${-8 - ery + (ex < 0 ? 8 : -2)}" stroke="${skin}" stroke-width="9"/>`;
    if (k === 'daughter') h += `<path d="M${ex + (ex < 0 ? -17 : 17)},-12 l${ex < 0 ? -9 : 9},-7" stroke="#2B1D14" stroke-width="4" stroke-linecap="round"/>`;
  }
  // nose
  h += k === 'daughter' ? `<path d="M2,12 Q9,30 0,34" stroke="${shade}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M2,4 Q${k === 'jamal' ? 16 : 12},36 0,42 Q-8,44 -14,38" stroke="${shade}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (expr === 'smile' || expr === 'laugh' || k === 'daughter') h += `<ellipse cx="-54" cy="34" rx="15" ry="8" fill="#E2735E" opacity="${k === 'daughter' ? .28 : .35}"/><ellipse cx="54" cy="34" rx="15" ry="8" fill="#E2735E" opacity="${k === 'daughter' ? .28 : .35}"/>`;
  if (expr === 'angry' || expr === 'shout') h += `<ellipse cx="-54" cy="30" rx="18" ry="10" fill="#D8483A" opacity=".3"/><ellipse cx="54" cy="30" rx="18" ry="10" fill="#D8483A" opacity=".3"/>`;
  // mouth
  const my = 70;
  const mo = expr === 'shout' ? Math.max(mouth, .75) : mouth;
  if (mo > 0.08) {
    const mry = 4 + mo * (expr === 'shout' ? 24 : 17), mrx = 17 + mo * (expr === 'shout' ? 8 : 3);
    if (expr === 'smile' || expr === 'laugh') {
      h += `<path d="M${-mrx - 4},${my - 4} Q0,${my - 8} ${mrx + 4},${my - 4} Q${mrx},${my + mry * 1.6} 0,${my + mry * 1.7} Q${-mrx},${my + mry * 1.6} ${-mrx - 4},${my - 4}Z" fill="#5A1F1C"/>`;
      h += `<path d="M${-mrx + 2},${my - 3} L${mrx - 2},${my - 3} L${mrx - 6},${my + 3} L${-mrx + 6},${my + 3}Z" fill="#fff"/>`;
    } else if (expr === 'shout' || expr === 'angry') {
      h += `<path d="M${-mrx},${my} Q0,${my - 10} ${mrx},${my} Q${mrx * .9},${my + mry * 2} 0,${my + mry * 2.1} Q${-mrx * .9},${my + mry * 2} ${-mrx},${my}Z" fill="#5A1F1C"/>`;
      h += `<path d="M${-mrx + 4},${my - 2} L${mrx - 4},${my - 2} L${mrx - 8},${my + 6} L${-mrx + 8},${my + 6}Z" fill="#fff"/>`;
      h += `<ellipse cx="0" cy="${my + mry * 1.6}" rx="${mrx * .55}" ry="${mry * .4}" fill="#C65B52"/>`;
    } else {
      h += `<ellipse cx="0" cy="${my + mry * .4}" rx="${mrx}" ry="${mry}" fill="#5A1F1C"/>`;
      h += `<ellipse cx="0" cy="${my + mry}" rx="${mrx * .6}" ry="${mry * .4}" fill="#C65B52"/>`;
      if (mo > .4) h += `<rect x="${-mrx * .7}" y="${my + mry * .4 - mry}" width="${mrx * 1.4}" height="5" rx="2" fill="#fff"/>`;
    }
  } else {
    const c = { smile: 12, laugh: 14, neutral: 2, calm: 4, sad: -10, worried: -6, stern: -3, angry: -9 }[expr] ?? 2;
    const lip = k === 'daughter' ? '#B5524A' : '#5A1F1C';
    h += `<path d="M-20,${my} Q0,${my + c} 20,${my}" stroke="${lip}" stroke-width="${k === 'daughter' ? 7 : 6}" fill="none" stroke-linecap="round"/>`;
  }
  // facial hair
  if (k === 'jamal') {
    h += `<path d="M-46,60 Q-24,38 0,48 Q24,38 46,60 Q30,58 22,64 Q0,54 -22,64 Q-30,58 -46,60Z" fill="#5E5856"/>`;     // thick grey-black mustache
    h += `<path d="M${-rx + 6},30 C${-rx + 14},96 -40,${ry + 4} 0,${ry + 6} C40,${ry + 4} ${rx - 14},96 ${rx - 6},30 C${rx - 20},70 50,88 24,${mo > .08 ? 96 + mo * 30 : 92} L-24,${mo > .08 ? 96 + mo * 30 : 92} C-50,88 ${-rx + 20},70 ${-rx + 6},30Z" fill="#6E6764" opacity=".55"/>`; // short stubble beard
  }
  if (k === 'customer') h += `<path d="M-30,56 Q0,46 30,56" stroke="${hair}" stroke-width="5" fill="none"/>`;            // thin mustache
  // sweat / anger mark
  if (o.sweat) {
    const sy = -70 + ((o.t || 0) * 26 % 60);
    h += `<g opacity="${clamp(o.sweat)}"><path d="M${rx - 20},${sy - 18} C${rx - 12},${sy - 4} ${rx - 6},${sy + 6} ${rx - 20},${sy + 12} C${rx - 34},${sy + 6} ${rx - 28},${sy - 4} ${rx - 20},${sy - 18}Z" fill="#9BD8F2" stroke="#fff" stroke-width="3"/></g>`;
  }
  if (o.anger) h += `<g transform="translate(${-rx + 10},-110) scale(${.8 + .2 * Math.sin((o.t || 0) * 12)})" opacity="${clamp(o.anger)}"><path d="M-22,-8 Q-6,-6 -8,-22 M8,-22 Q6,-6 22,-8 M22,8 Q6,6 8,22 M-8,22 Q-6,6 -22,8" stroke="${C.coral}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  s += `<g transform="translate(0,${nod * 6}) rotate(${tilt + nod * .6})">${h}</g>`;
  const sc = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.flip ? -sc : sc},${sc})">${s}</g>`;
}
