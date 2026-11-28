// ===== Atomic Habits – Identity-Based Habits: Arif (TR Universe 0.1) =====
const W = 1080, H = 1920;
const BRAND = 'TR Universe 0.1';
const SUB = [
  'মেয়ের একটা কথা শুনে আরিফ বুঝল,|দেরি করাটা আর তার *অভ্যাস* নেই।',
  'ওটা তার ~পরিচয়~ হয়ে গেছে।',
  '*ঢাকার* আরিফ।',
  'অফিসে সবাই তাকে ডাকে ~“লেট লতিফ”~।',
  'আরিফ নিজেও হেসে বলে, ~“আমি তো এমনই।”~',
  'চেষ্টা *কম করেনি*।',
  '*তিনটা অ্যালার্ম*।',
  'ঘড়ি *দশ মিনিট এগিয়ে* রাখা।',
  'দেরি হলে নিজেকে *জরিমানা*।',
  '~কিছুই টেকেনি~।',
  'একদিন মেয়ের *স্কুলে অনুষ্ঠান*।',
  'আরিফ পৌঁছাল অনুষ্ঠান ~শেষ হওয়ার পর~।',
  'দরজায় দাঁড়িয়ে শুনল,|মেয়ে বান্ধবীকে বলছে,',
  '“আমার বাবা তো ~সবসময় দেরি~ করে।”',
  'কোনো রাগ নেই, অভিযোগ নেই।',
  'এমনভাবে বলল, যেন এটাই ~স্বাভাবিক~।',
  'সেই রাতে আরিফ *একটা জিনিস* বদলাল।',
  '~“দেরি না করার চেষ্টা”~ বাদ দিল।',
  'নিজেকে প্রশ্ন করল,|*“যে মানুষ কথা রাখে, সে এখন কী করত?”*',
  'সে রাতেই *জুতা আর ব্যাগ* গুছিয়ে রাখত।',
  'আরিফ *রাখল*।',
  'সে *দশ মিনিট আগে* বের হতো।',
  'আরিফ *বের হলো*।',
  'কোনোদিন পারল, কোনোদিন পারল না।',
  'কিন্তু *সময়মতো পৌঁছানোর*|দিন বাড়তেই থাকল।',
  '*ছয় মাস পর* অফিসে কেউ আর|তাকে লেট লতিফ ডাকে না।',
  '*James Clear* তাঁর *Atomic Habits* বইয়ে|এটাকে বলেছেন *Identity-Based Habits*।',
  'তিনি একটা উদাহরণ দেন।',
  'দুইজনকে সিগারেট সাধা হলো।',
  'একজন বলল, “না, ~ছাড়ার চেষ্টা~ করছি।”',
  'আরেকজন বলল, “না, *আমি সিগারেট খাই না*।”',
  'দ্বিতীয়জন নিজেকে আর *ধূমপায়ী ভাবে না*।',
  'বইয়ের ভাষায়, প্রতিটা কাজ হলো আপনি|যে মানুষ হতে চান, তার পক্ষে *একটা ভোট*।',
  'আর জিততে সব ভোট লাগে না,|*বেশিরভাগ* হলেই চলে।',
  'আজ *একটা কাজ* করুন।',
  'যে অভ্যাসটা বদলাতে চান,|সেটা নিয়ে নিজেকে একটা প্রশ্ন করুন:',
  '*“যে মানুষ হতে চাই, সে এখন কী করত?”*',
  'তারপর শুধু *পরের কাজটা* সেভাবে করুন।',
  'নিজেকে দেখার চোখ বদলালে|*অভ্যাসও বদলায়*।',
  'আপনি নিজের সম্পর্কে কোন|~“আমি তো এমনই”~ কথাটা বদলাতে চান?',
  '*কমেন্টে* লিখুন।',
  'আর এমন গল্প পেতে *ফলো* করে রাখুন।'
];
const HIDE_SUB = new Set([37, 40, 41, 42]);
const L = i => LINES[i - 1];
const lp = (i, f) => L(i).s + (L(i).e - L(i).s) * f;
function speakMouth(t, idxs, gain = 1.3) { for (const i of idxs) { const l = L(i); if (t >= l.s - .03 && t <= l.e + .05) { const f = Math.round(t * FPS); const e = ((ENV[f - 1] || 0) + (ENV[f] || 0) * 2 + (ENV[f + 1] || 0)) / 4; return clamp((e - .1) * gain * 1.4); } } return 0; }
function subHTML(i) { return SUB[i - 1].split('|').map(r => r.replace(/\*(.+?)\*/g, '<b class="a">$1</b>').replace(/~(.+?)~/g, '<b class="c">$1</b>')).join('<br>'); }
function pill(x, y, txt, bg, fg, sc = 1, fs = 44) { const w = txt.length * fs * .52 + 70; return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}"><rect x="${-w / 2}" y="${-fs * .95}" width="${w}" height="${fs * 1.9}" rx="${fs * .95}" fill="${bg}"/><text y="${fs * .36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${fg}">${txt}</text></g>`; }
function zoomG(cx, cy, z, inner) { return `<g transform="translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})">${inner}</g>`; }
function bigText(y, txt, fs, col, op, dy = 0, stroke = '#14213D') { return `<text x="540" y="${y + dy}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}" opacity="${op}" stroke="${stroke}" stroke-width="${fs * .07}" paint-order="stroke">${txt}</text>`; }
function cursor() { return `<path d="M0,0 L0,80 L20,62 L36,98 L52,90 L36,56 L62,56Z" fill="#fff" stroke="#14213D" stroke-width="5" stroke-linejoin="round"/>`; }
function orbitLogo(t, r) { const a = t * 1.4; return `<circle r="${r * .42}" fill="${C.amber}"/><ellipse rx="${r}" ry="${r * .36}" fill="none" stroke="#fff" stroke-width="${r * .06}" transform="rotate(-24)"/><circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r * .36}" r="${r * .1}" fill="${C.teal}" transform="rotate(-24)"/><text y="${r * .15}" text-anchor="middle" font-size="${r * .38}" font-weight="700" fill="#14213D">TR</text>`; }
function brandTag(dark) { return `<g transform="translate(60,96)" opacity=".92"><g transform="translate(26,-12)">${orbitLogo(0, 26).replace(/<text.*<\/text>/, '')}</g><text x="70" y="0" font-size="34" font-weight="700" fill="${dark ? '#ffffffe6' : '#14213D'}" stroke="${dark ? '#00000055' : '#ffffff88'}" stroke-width="3" paint-order="stroke">${BRAND}</text></g>`; }
function heartIcon(x, y, s, col) { return `<path transform="translate(${x},${y}) scale(${s})" d="M0,12 C-22,-6 -30,-22 -16,-30 C-8,-35 0,-28 0,-22 C0,-28 8,-35 16,-30 C30,-22 22,-6 0,12Z" fill="${col}"/>`; }
function crossIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="${col}"/><path d="M-16,-16 L16,16 M16,-16 L-16,16" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>`; }
function shieldIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,-90 L74,-60 C74,10 46,60 0,90 C-46,60 -74,10 -74,-60Z" fill="${col}"/><path d="M-30,0 L-8,24 L34,-24" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
function bubbleT(x, y, w, txt, col, sc, fs = 50, tail = 'left') { return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}">${bubble(-w / 2, -70, w, 130, '#fff', col, tail)}<text y="12" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}">${txt}</text></g>`; }
function satWrap(sat, inner) { const k = Math.round(clamp(sat) * 10); return k >= 10 ? inner : `<g filter="url(#sat${k})">${inner}</g>`; }
function bgInk(t) { let s = `<rect width="${W}" height="${H}" fill="url(#gInk)"/>`; for (let i = 0; i < 26; i++) s += `<circle cx="${(i * 397) % W}" cy="${(i * 613) % H}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${.25 + .25 * Math.sin(t * 1.4 + i)}"/>`; return s; }
function bgPaper(t) { return `<rect width="${W}" height="${H}" fill="${C.paper}"/><circle cx="${880 + Math.sin(t * .3) * 20}" cy="380" r="420" fill="${C.amber}" opacity=".08"/><circle cx="160" cy="1560" r="360" fill="${C.teal}" opacity=".07"/>`; }
const ROOM = (t, o) => messRoom(t, o);


const SCENES = [
  { from: 1, draw(t, lt) { // the daughter's words → habit becomes identity
      let s = bgPaper(t);
      s += person({ kind: 'arif', x: 540, y: 1020, s: 1.25, expr: 'sad', look: [0, .5], blink: blinkAt(t, 1) });
      const p = pop(t, lp(1, .55), .4);
      s += `<g transform="translate(540,470) scale(${p})" opacity="${clamp(p)}"><rect x="-200" y="-56" width="400" height="112" rx="56" fill="#fff" stroke="#9AA6BF" stroke-width="5"/><text y="18" text-anchor="middle" font-size="54" font-weight="700" fill="#5A6070">অভ্যাস</text></g>`;
      return s;
  } },
  { from: 2, draw(t, lt) { // it became his identity (ID card with "LATE")
      let s = bgPaper(t);
      const p = eo(prog(lt, 0, .5));
      s += `<g transform="translate(540,${lerp(1300, 900, p)}) rotate(${lerp(10, -4, p)})" opacity="${p}"><rect x="-300" y="-190" width="600" height="380" rx="26" fill="#fff" filter="url(#shadow)"/><rect x="-300" y="-190" width="600" height="80" rx="26" fill="#E85D4A"/><text y="-136" text-anchor="middle" font-size="40" font-weight="700" fill="#fff">পরিচয়পত্র</text>`;
      s += `<clipPath id="idc"><rect x="-270" y="-90" width="190" height="230" rx="14"/></clipPath><rect x="-270" y="-90" width="190" height="230" rx="14" fill="#E7ECF1"/><g clip-path="url(#idc)">${person({ kind: 'arif', x: -175, y: 10, s: .55, expr: 'laugh', mouth: .4 })}</g>`;
      s += `<text x="-40" y="-30" font-size="40" font-weight="700" fill="#14213D">আরিফ</text><text x="-40" y="30" font-size="30" font-weight="600" fill="#5A6070">পরিচয়:</text><text x="-40" y="100" font-size="58" font-weight="700" fill="#E85D4A">দেরি</text></g>`;
      const st = prog(t, lp(2, .45), .22);
      if (st > 0) s += `<g opacity="${clamp(st * 2)}">${stamp(720, 1120, lerp(1.6, .9, eo(st)), 'পরিচয়', C.coral, -12)}</g>`;
      return s;
  } },
  { from: 3, xf: true, draw(t, lt) { // Arif from Dhaka
      let s = `<rect width="${W}" height="${H}" fill="url(#gSkyL)"/><rect x="-40" y="600" width="300" height="900" fill="#B8A88C"/><rect x="820" y="500" width="300" height="1000" fill="#A99A80"/><rect x="300" y="760" width="480" height="740" fill="#C9B79A"/>`;
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) s += `<rect x="${340 + c * 150}" y="${800 + r * 110}" width="90" height="70" fill="#7FA9B8"/>`;
      s += `<rect y="1500" width="${W}" height="${H - 1500}" fill="#6E6A62"/>`;
      s += walkingArif(lerp(-100, 540, eo(prog(lt, 0, 1.0))), 1720, 1.15, t);
      s += pill(540, 400, 'ঢাকার আরিফ', C.ink, '#fff', pop(lt, .2, .4), 50);
      return s;
  } },
  { from: 4, draw(t, lt) { // office calls him "Late Latif"
      let s = officeRoom(t, { clock: { hr: 10, min: 25, badge: 'লেট' } });
      s += person({ kind: 'sakib', x: 220, y: 1100, s: .82, expr: 'laugh', mouth: .3 + .25 * Math.abs(Math.sin(t * 8)), look: [1, 0] });
      s += person({ kind: 'jamal', x: 860, y: 1110, s: .82, expr: 'laugh', mouth: .3 + .25 * Math.abs(Math.sin(t * 7)), look: [-1, 0] });
      s += walkingArif(lerp(1250, 560, eo(prog(lt, 0, .8))), 1500, 1.0, t, { flip: true, run: true });
      s += bubbleT(260, 760, 420, 'লেট লতিফ!', C.coral, pop(t, lp(4, .5), .3), 54);
      s += bubbleT(820, 640, 420, 'লেট লতিফ!', C.coral, pop(t, lp(4, .65), .3), 54, 'right');
      return s;
  } },
  { from: 5, draw(t, lt) { // "I'm just like this"
      let s = officeRoom(t, { clock: { hr: 10, min: 30 } });
      s += person({ kind: 'arif', x: 540, y: 1060, s: 1.35, expr: 'laugh', mouth: Math.max(speakMouth(t, [5]), t < lp(5, .45) ? .35 + .25 * Math.abs(Math.sin(t * 9)) : 0), blink: 0 });
      s += bubbleT(560, 480, 480, 'আমি তো এমনই!', '#5A6070', pop(t, lp(5, .5), .3), 54);
      return s;
  } },
  { from: 6, draw(t, lt) { // he did try
      let s = bgPaper(t);
      s += person({ kind: 'arif', x: 540, y: 1040, s: 1.2, expr: 'stern', look: [0, -.4], blink: blinkAt(t, 2) });
      s += pill(540, 460, 'চেষ্টা', C.teal, '#fff', pop(lt, .1, .4), 60);
      return s;
  } },
  { from: 7, draw(t, lt) { // three alarms
      let s = bedroom(t);
      s += lyingArif(540, 1360, 1.05, t, { zzz: true });
      [[220, 1080, .05], [540, 1000, .25], [860, 1080, .45]].forEach(([x, y, f]) => { if (t > lp(7, f)) s += ringingAlarm(x, y, 1.1, t); });
      s += pill(540, 380, '৩টা অ্যালার্ম', C.coral, '#fff', pop(lt, .05, .4), 50);
      return s;
  } },
  { from: 8, draw(t, lt) { // clock 10 minutes fast
      let s = bgPaper(t);
      const m = lerp(0, 10, eio(prog(lt, .2, .8)));
      s += wallClock(540, 860, 2.6, t, { hr: 8, min: m });
      s += pill(540, 1340, '+১০ মিনিট', C.amber, C.ink, pop(lt, .6, .4), 56);
      return s;
  } },
  { from: 9, draw(t, lt) { // fine for being late
      let s = bgPaper(t);
      const n = Math.min(9, Math.floor(prog(lt, .1, 1.2) * 9));
      s += fineJar(540, 980, 2.2, n);
      const p = eo(prog(lt, .2, .5));
      s += `<g transform="translate(${lerp(900, 640, p)},${lerp(500, 700, p)}) rotate(${lerp(30, 0, p)})" opacity="${p < 1 ? p : 1 - prog(lt, .9, .3)}">${moneyNote(0, 0, 0, 1.1)}</g>`;
      return s;
  } },
  { from: 10, draw(t, lt) { // nothing stuck
      let s = bgPaper(t);
      [[220, ringingAlarm(0, 0, 1, t, false)], [540, wallClock(0, 0, .9, t, { hr: 8, min: 10 })], [860, fineJar(0, 0, .9, 6)]].forEach(([x, g], i) => {
        s += `<g transform="translate(${x},860)">${g}</g>`;
        const p = pop(t, L(10).s + i * .15, .3);
        s += `<g transform="translate(${x},860) scale(${p})" opacity="${clamp(p)}">${crossIcon(0, 0, 2.2, C.coral)}</g>`;
      });
      return s;
  } },
  { from: 11, xf: true, draw(t, lt) { // school function
      let s = schoolHall(t);
      for (let i = 0; i < 4; i++) s += person({ kind: i % 2 ? 'girl2' : 'girl', x: 300 + i * 160, y: 560 + Math.sin(t * 3 + i) * 6, s: .4, expr: 'smile', mouth: .2 + .2 * Math.abs(Math.sin(t * 6 + i)) });
      s += `<rect x="180" y="640" width="720" height="40" fill="#8A5A36"/>`;
      return s;
  } },
  { from: 12, draw(t, lt) { // he arrived after it ended
      let s = schoolHall(t, { empty: true }) + `<rect width="${W}" height="${H}" fill="#3A3F4B" opacity=".18"/>`;
      s += walkingArif(lerp(1250, 760, eo(prog(lt, 0, 1))), 1640, 1.1, t, { flip: true, run: lt < 1 });
      s += pill(540, 900, 'অনুষ্ঠান শেষ', C.coral, '#fff', pop(t, lp(12, .5), .4), 54);
      return s;
  } },
  { from: 13, xf: true, draw(t, lt) { // at the door he heard his daughter tell her friend
      let s = schoolHall(t, { empty: true });
      s += person({ kind: 'girl', x: 400, y: 1120, s: .75, expr: 'neutral', look: [1, 0], blink: blinkAt(t, 4), mouth: speakMouth(t, [14]) });
      s += person({ kind: 'girl2', x: 700, y: 1130, s: .72, expr: 'neutral', look: [-1, 0], blink: blinkAt(t, 5) });
      s += `<g opacity=".95">${doorFrame(950, 1500, .9)}${walkingArif(940, 1490, .9, 0, { flip: true })}</g>`;
      return s;
  } },
  { from: 14, draw(t, lt) { // "my father is always late"
      let s = schoolHall(t, { empty: true });
      s += zoomG(470, 1000, 1.25, person({ kind: 'girl', x: 470, y: 1060, s: .95, expr: 'calm', look: [.8, 0], blink: blinkAt(t, 4), mouth: speakMouth(t, [14]) }) + person({ kind: 'girl2', x: 820, y: 1100, s: .8, expr: 'neutral', look: [-1, 0] }));
      s += bubbleT(500, 470, 760, 'আমার বাবা তো সবসময় দেরি করে।', '#5A6070', pop(t, L(14).s, .3), 42);
      return s;
  } },
  { from: 15, draw(t, lt) { // no anger, no complaint
      let s = bgPaper(t);
      s += person({ kind: 'girl', x: 540, y: 1060, s: 1.2, expr: 'calm', blink: blinkAt(t, 4), tilt: Math.sin(t * 1.6) * 2 });
      const a = pop(t, L(15).s + .05, .4), b = pop(t, lp(15, .5), .4);
      s += `<g transform="translate(320,460) scale(${a})" opacity="${clamp(a)}"><rect x="-170" y="-56" width="340" height="112" rx="56" fill="#fff" filter="url(#shadow)"/><text x="20" y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${C.ink}">রাগ</text>${crossIcon(-110, 0, .7, C.coral)}</g>`;
      s += `<g transform="translate(760,460) scale(${b})" opacity="${clamp(b)}"><rect x="-200" y="-56" width="400" height="112" rx="56" fill="#fff" filter="url(#shadow)"/><text x="30" y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${C.ink}">অভিযোগ</text>${crossIcon(-140, 0, .7, C.coral)}</g>`;
      return s;
  } },
  { from: 16, draw(t, lt) { // as if it was normal — Arif heartbroken
      let s = `<rect width="${W}" height="${H}" fill="#2E3446"/>`;
      s += zoomG(540, 950, 1 + lt * .05, person({ kind: 'arif', x: 540, y: 1000, s: 1.5, expr: 'sad', look: [0, .6], blink: blinkAt(t, 2), tear: t > lp(16, .4) ? 1 : 0, t }));
      s += pill(540, 400, 'স্বাভাবিক?', '#fff', C.coral, pop(t, lp(16, .5), .4), 54);
      return s;
  } },
  { from: 17, xf: true, dark: true, draw(t, lt) { // that night he changed one thing
      let s = bedroom(t, { night: true });
      s += person({ kind: 'arif', x: 540, y: 1100, s: 1.15, expr: 'stern', look: [.5, -.3], blink: blinkAt(t, 2) });
      s += wallClock(220, 560, .8, t, { hr: 23, min: 40 });
      return s;
  } },
  { from: 18, dark: true, draw(t, lt) { // dropped "trying not to be late"
      let s = bedroom(t, { night: true }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
      const p = eo(prog(lt, .05, .4));
      s += `<g transform="translate(540,880) rotate(-3)" opacity="${p}"><rect x="-400" y="-150" width="800" height="300" fill="#FFF7D6"/><rect x="-60" y="-170" width="120" height="40" fill="#F2C94C" opacity=".8"/><text y="20" text-anchor="middle" font-size="62" font-weight="700" fill="#5A6070">দেরি না করার চেষ্টা</text>`;
      const c = eo(prog(lt, .6, .5));
      s += `<path d="M-360,10 L${-360 + 720 * c},-10" stroke="${C.coral}" stroke-width="16" stroke-linecap="round"/></g>`;
      return s;
  } },
  { from: 19, dark: true, draw(t, lt) { // "what would someone who keeps their word do?"
      let s = `<rect width="${W}" height="${H}" fill="url(#gInk)"/>`;
      s += person({ kind: 'arif', x: 360, y: 1180, s: 1.0, expr: 'calm', look: [1, -.6], blink: blinkAt(t, 2), mouth: speakMouth(t, [19]) * .8 });
      const p = pop(t, lp(19, .3), .5);
      s += `<g transform="translate(720,650) scale(${p})" opacity="${clamp(p)}"><ellipse rx="300" ry="240" fill="#fff"/><circle cx="-210" cy="230" r="28" fill="#fff"/><circle cx="-260" cy="290" r="16" fill="#fff"/><circle r="${120 + 8 * Math.sin(t * 3)}" fill="#FFE29A" opacity=".5"/>${silhouetteP(0, 60, .7, '#F2C94C')}<text y="200" text-anchor="middle" font-size="38" font-weight="700" fill="${C.ink}">কথা রাখা মানুষ</text></g>`;
      return s;
  } },
  { from: 20, xf: true, dark: true, draw(t, lt) { // he'd prepare shoes and bag at night
      let s = `<rect width="${W}" height="${H}" fill="#2A3150"/><rect y="1400" width="${W}" height="${H - 1400}" fill="#3A3048"/>`;
      s += wallClock(540, 520, 1.0, t, { hr: 22, min: 30 });
      s += shoesBag(540, 1300, 1.4, t, { check: t > L(21).s });
      if (t > L(21).s) s += pill(540, 900, 'আরিফ রাখল ✓', C.teal, '#fff', pop(t, L(21).s, .4), 50);
      return s;
  } },
  { from: 22, xf: true, draw(t, lt) { // he'd leave 10 minutes early — Arif left
      let s = `<rect width="${W}" height="${H}" fill="url(#gSkyL)"/><rect y="1500" width="${W}" height="${H - 1500}" fill="#9A958A"/>`;
      s += wallClock(830, 520, .9, t, { hr: 8, min: 50, badge: '-১০' });
      s += doorFrame(260, 1500, .9);
      const go = eo(prog(t, L(23).s, 1.2));
      s += walkingArif(lerp(300, 1150, go), 1700, 1.1, t);
      if (t > L(23).s) s += pill(540, 1000, 'আরিফ বের হলো ✓', C.teal, '#fff', pop(t, L(23).s + .1, .4), 50);
      return s;
  } },
  { from: 24, xf: true, draw(t, lt) { // some days yes, some days no
      let s = bgPaper(t);
      const marks = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1];
      const n = Math.floor(clamp(lt / (L(25).e - L(24).s)) * 28);
      s += calendarGrid(540, 820, 1.1, n, marks);
      if (t > L(25).s) { const v = clamp((t - L(25).s) / (L(25).e - L(25).s)); s += meter(140, 1300, 800, .3 + v * .6, 'সময়মতো পৌঁছানো', C.teal); }
      return s;
  } },
  { from: 26, xf: true, draw(t, lt) { // six months later nobody calls him Late Latif
      let s = officeRoom(t, { clock: { hr: 8, min: 55 } });
      s += person({ kind: 'sakib', x: 210, y: 1100, s: .8, expr: 'smile', look: [1, 0] }) + person({ kind: 'jamal', x: 870, y: 1110, s: .8, expr: 'smile', look: [-1, 0] });
      s += person({ kind: 'arif', x: 540, y: 1080, s: 1.0, expr: 'smile', blink: blinkAt(t, 1) });
      s += calendarPage(200, 450, .7, '৬', 'মাস পর', C.teal);
      const p = pop(t, lp(26, .45), .4);
      s += `<g transform="translate(700,620) scale(${p})" opacity="${clamp(p)}"><rect x="-210" y="-56" width="420" height="112" rx="56" fill="#fff" filter="url(#shadow)"/><text x="30" y="16" text-anchor="middle" font-size="48" font-weight="700" fill="${C.ink}">লেট লতিফ</text>${crossIcon(-150, 0, .7, C.coral)}</g>`;
      return s;
  } },
  { from: 27, xf: true, dark: true, draw(t, lt) { // Atomic Habits — identity-based habits
      let s = bgInk(t);
      const bp = eo(prog(lt, .1, .7)), up = eo(prog(t, lp(27, .55), .6));
      s += genericBook(540, lerp(880, 560, up), lerp(1, .62, up), bp, lerp(-6, 0, bp), ['Atomic', 'Habits'], '', 'JAMES CLEAR');
      const p = pop(t, lp(27, .6), .45);
      s += `<g transform="translate(540,1180) scale(${p})" opacity="${clamp(p)}"><rect x="-370" y="-70" width="740" height="140" rx="36" fill="${C.amber}"/><text y="22" text-anchor="middle" font-size="58" font-weight="700" fill="${C.ink}">Identity-Based Habits</text></g>`;
      return s;
  } },
  { from: 28, xf: true, draw(t, lt) { // an example: two people offered a cigarette
      let s = bgPaper(t);
      s += person({ kind: 'customer', x: 280, y: 1060, s: .95, expr: 'neutral', look: [.5, 0], blink: blinkAt(t, 3) });
      s += person({ kind: 'sad', x: 800, y: 1060, s: .95, expr: 'neutral', look: [-.5, 0], blink: blinkAt(t, 4) });
      const p = eo(prog(t, L(29).s + .1, .6));
      s += `<g transform="translate(540,${lerp(1700, 1250, p)})"><path d="M-60,300 L-40,40 L40,40 L60,300Z" fill="#4A576A"/>${cigarettePack(0, -20, 1.1)}</g>`;
      s += pill(540, 420, 'উদাহরণ', C.ink, '#fff', pop(lt, .1, .4), 50);
      return s;
  } },
  { from: 30, draw(t, lt) { // "No, I'm trying to quit"
      let s = bgPaper(t);
      s += person({ kind: 'customer', x: 360, y: 1060, s: 1.2, expr: 'worried', look: [.6, 0], mouth: speakMouth(t, [30]), blink: blinkAt(t, 3) });
      s += cigarettePack(820, 1180, 1.0, -15);
      s += bubbleT(560, 470, 640, 'না, ছাড়ার চেষ্টা করছি।', '#5A6070', pop(t, lp(30, .3), .3), 46);
      return s;
  } },
  { from: 31, draw(t, lt) { // "No, I don't smoke"
      let s = bgPaper(t);
      s += person({ kind: 'sad', x: 720, y: 1060, s: 1.2, expr: 'smile', look: [-.6, 0], mouth: speakMouth(t, [31]), blink: blinkAt(t, 4) });
      s += `<g opacity=".6">${cigarettePack(260, 1180, 1.0, 15)}</g>${crossIcon(260, 1150, 1.6, C.coral)}`;
      s += bubbleT(540, 470, 640, 'না, আমি সিগারেট খাই না।', C.teal, pop(t, lp(31, .3), .3), 46, 'right');
      return s;
  } },
  { from: 32, draw(t, lt) { // the second no longer sees himself as a smoker
      let s = bgPaper(t);
      s += `<ellipse cx="540" cy="1000" rx="${300 + 10 * Math.sin(t * 3)}" ry="440" fill="#FFE29A" opacity=".25"/>`;
      s += person({ kind: 'sad', x: 540, y: 1060, s: 1.3, expr: 'smile', blink: blinkAt(t, 4) });
      const p = pop(t, lp(32, .4), .4);
      s += `<g transform="translate(540,450) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-60" width="520" height="120" rx="60" fill="${C.teal}"/><text y="18" text-anchor="middle" font-size="50" font-weight="700" fill="#fff">ধূমপায়ী নই</text></g>`;
      return s;
  } },
  { from: 33, xf: true, draw(t, lt) { // every action is a vote for who you want to be
      let s = bgPaper(t);
      const n = Math.floor(clamp(lt / (L(33).e - L(33).s)) * 6);
      s += ballotBox(540, 1180, 1.3, n);
      const acts = ['সময়মতো', 'ব্যাগ গোছানো', 'আগে বের হওয়া', 'কথা রাখা'];
      acts.forEach((a, i) => { const q = prog(lt, .4 + i * .9, .9); if (q <= 0 || q >= 1) return; s += voteCard(lerp(540 + (i % 2 ? 260 : -260), 560, eio(q)), lerp(520, 1000, eio(q)), lerp(1, .5, q), a, C.teal, lerp(i % 2 ? 12 : -12, 0, q)); });
      s += pill(540, 380, 'প্রতিটা কাজ = একটা ভোট', C.ink, '#fff', pop(lt, .2, .4), 44);
      return s;
  } },
  { from: 34, draw(t, lt) { // you don't need every vote, just the majority
      let s = bgPaper(t);
      const v = eo(prog(lt, .2, 1.4));
      s += `<g transform="translate(540,900)"><rect x="-420" y="-60" width="840" height="120" rx="60" fill="#E8E1D3"/><rect x="-420" y="-60" width="${840 * .7 * v}" height="120" rx="60" fill="${C.teal}"/><rect x="${-420 + 840 * .7 * v}" y="-60" width="${840 * .3 * v}" height="120" rx="0" fill="${C.coral}" opacity=".85"/><line x1="0" y1="-100" x2="0" y2="100" stroke="${C.ink}" stroke-width="6" stroke-dasharray="12 10"/>
        <text x="-420" y="-90" font-size="40" font-weight="700" fill="${C.teal}">✓ ৭০%</text><text x="420" y="-90" text-anchor="end" font-size="40" font-weight="700" fill="${C.coral}">✗ ৩০%</text></g>`;
      s += pill(540, 1180, 'বেশিরভাগ = জয়', C.amber, C.ink, pop(t, lp(34, .55), .4), 50);
      return s;
  } },
  { from: 35, xf: true, draw(t, lt) { // do one thing today
      let s = bgPaper(t);
      s += bigText(760, 'আজ একটা কাজ', 110, C.ink, eo(prog(lt, 0, .4)), 0, '#ffffff00');
      s += `<g transform="translate(540,1000) scale(${pop(lt, .3, .4)})">${checkIconL(0, 0, 2, C.teal)}</g>`;
      return s;
  } },
  { from: 36, draw(t, lt) { // pick the habit you want to change; ask yourself
      let s = bgPaper(t);
      s += person({ kind: 'arif', x: 540, y: 1100, s: 1.15, expr: 'calm', look: [0, -.4], blink: blinkAt(t, 2) });
      s += `<g transform="translate(540,500) scale(${pop(t, lp(36, .5), .4)})"><circle r="120" fill="${C.amber}"/><text y="70" text-anchor="middle" font-size="200" font-weight="700" fill="${C.ink}">?</text></g>`;
      return s;
  } },
  { from: 37, dark: true, draw(t, lt) { // "what would the person I want to be do now?"
      let s = bgInk(t);
      const a = eo(prog(lt, 0, .5)), b = eo(prog(lt, .7, .5));
      s += `<g opacity="${a}"><text x="540" y="760" text-anchor="middle" font-size="76" font-weight="700" fill="#fff">“যে মানুষ হতে চাই,</text></g><g opacity="${b}"><text x="540" y="870" text-anchor="middle" font-size="76" font-weight="700" fill="${C.amber}">সে এখন কী করত?”</text></g>`;
      s += `<g opacity="${b}">${silhouetteP(540, 1350, .9, '#F2C94C')}<circle cx="540" cy="1180" r="${190 + 10 * Math.sin(t * 3)}" fill="#FFE29A" opacity=".18"/></g>`;
      return s;
  } },
  { from: 38, xf: true, draw(t, lt) { // then just do the next action that way
      let s = `<rect width="${W}" height="${H}" fill="#2A3150"/><rect y="1400" width="${W}" height="${H - 1400}" fill="#3A3048"/>`;
      s += shoesBag(540, 1300, 1.3, t, { check: lt > .8 });
      s += pill(540, 600, 'পরের কাজটা', C.teal, '#fff', pop(lt, .2, .4), 54);
      return s;
  } },
  { from: 39, xf: true, draw(t, lt) { // change how you see yourself → habits change
      let s = bgPaper(t);
      s += `<rect x="290" y="420" width="500" height="900" rx="250" fill="#DDE8F2" stroke="#C9A646" stroke-width="14"/>`;
      const c = eo(prog(lt, .6, 1));
      s += `<clipPath id="mir"><rect x="296" y="426" width="488" height="888" rx="244"/></clipPath><g clip-path="url(#mir)">${person({ kind: 'arif', x: 540, y: 980, s: 1.0, expr: c > .5 ? 'smile' : 'neutral', blink: blinkAt(t, 1) })}<rect x="296" y="426" width="488" height="888" fill="#FFE29A" opacity="${c * .2}"/></g>`;
      s += `<g opacity="${c}">${pill(540, 1440, 'আমি সময় মানি', C.teal, '#fff', 1, 50)}</g>`;
      return s;
  } },
  { from: 40, xf: true, draw(t, lt) { // which "I'm just like this" do you want to change?
      let s = bgPaper(t);
      const a = eo(prog(lt, .05, .5));
      s += `<g opacity="${a}"><text x="540" y="390" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">আপনি নিজের সম্পর্কে কোন</text><text x="540" y="490" text-anchor="middle" font-size="64" font-weight="700" fill="${C.coral}">“আমি তো এমনই”</text><text x="540" y="590" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">কথাটা বদলাতে চান?</text></g>`;
      s += person({ kind: 'arif', x: 540, y: 1200, s: 1.1, expr: 'smile', blink: blinkAt(t, 1) });
      const p = pop(t, L(41).s - .1, .4);
      s += `<g transform="translate(540,760) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-58" width="520" height="116" rx="58" fill="${C.teal}"/><path d="M-200,-22 h60 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-34 l-16,14 v-14 h-10 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12z" fill="#fff"/><text x="30" y="18" text-anchor="middle" font-size="50" font-weight="700" fill="#fff">কমেন্টে লিখুন</text></g>`;
      const k = eo(prog(t, L(41).s + .2, .4)); if (k > 0) s += `<g transform="translate(${lerp(820, 660, k)},${lerp(960, 800, k)})">${cursor()}</g>`;
      return s;
  } },
  { from: 42, dark: true, draw(t, lt) { // end card
      let s = bgInk(t);
      s += `<g transform="translate(540,760) scale(${pop(lt, .05, .5)})">${orbitLogo(t, 120)}</g>`;
      const b = eo(prog(lt, .3, .5));
      s += `<g opacity="${b}"><text x="540" y="1020" text-anchor="middle" font-size="96" font-weight="700" fill="#fff">${BRAND}</text><text x="540" y="1100" text-anchor="middle" font-size="40" font-weight="500" fill="#ffffffaa">গল্পে গল্পে জীবনের কৌশল</text></g>`;
      const p = pop(lt, .7, .45), clicked = lt > 1.6;
      s += `<g transform="translate(540,1280) scale(${p * (lt > 1.45 && lt < 1.6 ? .92 : 1)})" opacity="${clamp(p)}"><rect x="${clicked ? -290 : -210}" y="-62" width="${clicked ? 580 : 420}" height="124" rx="62" fill="${clicked ? '#fff' : C.amber}"/><text y="20" text-anchor="middle" font-size="54" font-weight="700" fill="${C.ink}">${clicked ? '✓ ফলো করা হয়েছে' : '+ ফলো করুন'}</text></g>`;
      const k = eo(prog(lt, .9, .5)); if (k > 0) s += `<g transform="translate(${lerp(820, 600, k)},${lerp(1500, 1300, k)})">${cursor()}</g>`;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${eo(prog(t, LINES[LINES.length - 1].e + 1.0, .6))}"/>`;
      return s;
  } }
];
function checkIconL(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="60" fill="${col}"/><path d="M-26,0 L-8,20 L28,-20" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }

function sceneStart(i) { return i === 0 ? 0 : Math.max(0, L(SCENES[i].from).s - .08); }
function sceneAt(t) { let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= sceneStart(i)) k = i; return k; }
const DEFS = `<defs>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0"/></filter>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="58%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".6"/></radialGradient>
${Array.from({ length: 10 }, (_, k) => `<filter id="sat${k}"><feColorMatrix type="saturate" values="${(k / 10).toFixed(2)}"/></filter>`).join('')}
<linearGradient id="gInk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2B50"/><stop offset="1" stop-color="#0E1730"/></linearGradient>
<linearGradient id="gSkyL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EC3E6"/><stop offset="1" stop-color="#F7E2BE"/></linearGradient>
<linearGradient id="gNightL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1530"/><stop offset="1" stop-color="#2E2A50"/></linearGradient>
<linearGradient id="gGrime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3A2A1A" stop-opacity=".35"/></linearGradient>
<linearGradient id="gWallStain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#3A3020" stop-opacity=".25"/></linearGradient>
<linearGradient id="gPanel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<linearGradient id="gGrade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB86B" stop-opacity=".10"/><stop offset=".55" stop-color="#FFB86B" stop-opacity="0"/><stop offset="1" stop-color="#1E5A6E" stop-opacity=".16"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#14213D" flood-opacity=".2"/></filter>
</defs>`;
function frameSVG(t) {
  _pid = 0;
  const k = sceneAt(t), sc = SCENES[k], st = sceneStart(k);
  let body = sc.draw(t, t - st);
  if (sc.xf && k > 0 && t - st < .35) { const pv = SCENES[k - 1]; body = pv.draw(st, st - sceneStart(k - 1)) + `<g opacity="${eio((t - st) / .35)}">${body}</g>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${DEFS}${body}<rect width="${W}" height="${H}" fill="url(#gGrade)"/>${vignette(sc.dark ? .5 : .3)}${grain(.045)}${brandTag(sc.dark)}</svg>`;
}
function subAt(t) {
  for (let i = 1; i <= LINES.length; i++) {
    const l = L(i), next = LINES[i] ? LINES[i].s : l.e + .4, end = Math.min(next - .02, l.e + .35);
    if (t >= l.s - .05 && t < end) return HIDE_SUB.has(i) ? null : { i, p: clamp((t - l.s + .05) / .18) };
  }
  return null;
}
function renderFrame(t) {
  document.getElementById('stage').innerHTML = frameSVG(t);
  const sb = document.getElementById('sub'), s = subAt(t);
  if (!s) { sb.style.opacity = 0; return; }
  if (sb.dataset.i != s.i) { sb.innerHTML = subHTML(s.i); sb.dataset.i = s.i; }
  sb.style.opacity = s.p; sb.style.transform = `translateX(-50%) scale(${.94 + .06 * eo(s.p)})`;
}
