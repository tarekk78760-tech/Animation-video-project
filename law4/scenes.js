// ===== Scenes for "Law 4 – Say Less" reel (TR Universe 0.1) =====
// Globals expected: LINES (array {s,e,text}), ENV (per-frame amplitude 0..1), FPS
const W = 1080, H = 1920;
const BRAND = 'TR Universe 0.1';

// Subtitle text with markup: *amber*  ~coral~   (| = line break)
const SUB = [
  'কেউ যদি আপনার সামনে|হঠাৎ *চুপ* করে যায়,',
  '~ভুলেও~ এই কাজটা করবেন না।',
  '*রফিক সাহেব* করেছিলেন।',
  'আর তার দাম দিয়েছিলেন|~লাখ লাখ টাকা~।',
  '*গাজীপুরে* রফিক সাহেবের|ছোট একটা গার্মেন্টস কারখানা।',
  'বহু বছরের চেষ্টার পর *প্রথমবার*',
  '*ইউরোপের* এক বড় বায়ার এসেছেন।',
  'অর্ডারটা পেলে কারখানার|*চেহারাই* বদলে যাবে।',
  'মিটিংয়ে রফিক সাহেব *দাম* বললেন।',
  'প্রতি পিস *চার ডলার*।',
  'বায়ার *কিছু বললেন না*।',
  'শুধু ফাইলের দিকে তাকিয়ে রইলেন।',
  '*দশ সেকেন্ড।* *পনেরো সেকেন্ড।*',
  'রফিক সাহেব আর ~থাকতে পারলেন না~।',
  '“মানে... অর্ডার বড় হলে|~সাড়ে তিন ডলারেও~ করা যায়।”',
  'বায়ার তখনও *চুপ*।',
  '“আসলে আমাদের কাপড়ের|খরচ একটু কম,',
  'তাই... ~তিন ডলার বিশ সেন্টেও~ পারব।”',
  'বায়ার এবার *মাথা নাড়লেন*।',
  '*চুক্তি* হয়ে গেল।',
  'মাসখানেক পর এক ডিনারে',
  'সেই বায়ার *হাসতে হাসতে* বললেন,',
  '“আপনার *প্রথম দামটাই*|আমাদের বাজেটের মধ্যে ছিল।',
  'আমি তো শুধু মনে মনে|*হিসাব মেলাচ্ছিলাম*।”',
  'রফিক সাহেবকে *কেউ ঠকায়নি*।',
  'তিনি ~নিজেই নিজেকে~ ঠকিয়েছেন।',
  'শুধু *নীরবতা* সহ্য করতে না পেরে।',
  'মানুষ চুপ থাকাকে ~ভয়~ পায়।',
  'মনে হয়, অন্যজন ~বিরক্ত~, ~রাজি না~।',
  'তাই আমরা *ফাঁকা জায়গাটা*|কথা দিয়ে ভরাতে থাকি।',
  'আর যত বেশি বলি, তত বেশি|নিজের ~দুর্বলতা~ দেখিয়ে ফেলি।',
  '*Robert Greene* তাঁর|*The 48 Laws of Power* বইয়ে|এটাকেই বলেছেন,',
  'Law 4: Always Say Less Than Necessary.',
  'প্রয়োজনের চেয়ে সবসময় *কম বলো*।',
  'যে *কম বলে*, তাকে মানুষ|পুরোপুরি বুঝতে পারে না।',
  'আর যাকে বোঝা যায় না, তার সামনে|মানুষ *নিজেই নিজেকে খুলে দেয়*।',
  'তাই পরের বার কেউ আপনার|সামনে *চুপ* করে গেলে,',
  '~তাড়াহুড়ো~ করে সেই নীরবতা|ভাঙতে যাবেন না।',
  '*চুপ থাকুন।*',
  'নীরবতাটা *তাকেই* ভাঙতে দিন।',
  'আপনি কি কখনো বেশি কথা বলে|নিজের ~ক্ষতি~ করেছেন?',
  '*কমেন্টে* লিখুন।',
  'আর এমন গল্প পেতে *ফলো* করে রাখুন।'
];
const HIDE_SUB = new Set([13, 33, 34, 39, 40, 41, 42, 43]); // text already on screen

const L = i => LINES[i - 1];
function speakMouth(t, lineIdxs, gain = 1.25) {
  for (const i of lineIdxs) {
    const l = L(i);
    if (t >= l.s - 0.03 && t <= l.e + 0.05) {
      const f = Math.round(t * FPS);
      const e = ((ENV[f - 1] || 0) + (ENV[f] || 0) * 2 + (ENV[f + 1] || 0)) / 4;
      return clamp((e - 0.1) * gain * 1.4);
    }
  }
  return 0;
}
function subHTML(i) {
  return SUB[i - 1].split('|').map(row =>
    row.replace(/\*(.+?)\*/g, '<b class="a">$1</b>').replace(/~(.+?)~/g, '<b class="c">$1</b>')
  ).join('<br>');
}

// ---------- shared background pieces ----------
function bgPaper(t) {
  return `<rect width="${W}" height="${H}" fill="${C.paper}"/>
  <circle cx="${880 + Math.sin(t * .3) * 20}" cy="380" r="420" fill="${C.amber}" opacity=".07"/>
  <circle cx="160" cy="${1560 + Math.cos(t * .25) * 20}" r="360" fill="${C.teal}" opacity=".06"/>`;
}
function bgInk(t) {
  let s = `<rect width="${W}" height="${H}" fill="url(#gInk)"/>`;
  for (let i = 0; i < 28; i++) {
    const x = (i * 397) % W, y = (i * 613) % H, tw = .25 + .25 * Math.sin(t * 1.4 + i);
    s += `<circle cx="${x}" cy="${y}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${tw}"/>`;
  }
  return s;
}
function silencePill(x, y, t0, t, dark) {
  const secs = Math.max(0, Math.floor(t - t0));
  return `<g transform="translate(${x},${y})"><rect x="-170" y="-42" width="340" height="84" rx="42" fill="${dark ? '#ffffff18' : '#fff'}" stroke="${dark ? '#ffffff33' : '#00000010'}" stroke-width="2"/>
  <circle cx="-128" cy="0" r="10" fill="${C.coral}" opacity="${.5 + .5 * Math.sin(t * 6)}"/>
  <line x1="-100" y1="0" x2="10" y2="0" stroke="${C.amber}" stroke-width="6" stroke-linecap="round"/>
  <text x="96" y="12" text-anchor="middle" font-size="34" font-weight="700" fill="${dark ? '#fff' : C.ink}">০০:${bn(String(secs).padStart(2, '0'))}</text></g>`;
}
function room(t) {      // meeting room wide background
  let s = `<rect width="${W}" height="${H}" fill="#E9DFCF"/>
  <rect x="0" y="1180" width="${W}" height="${H - 1180}" fill="#D9CBB5"/>
  <g transform="translate(120,380)"><rect width="300" height="420" rx="10" fill="#CFE3EA" stroke="#fff" stroke-width="14"/>`;
  for (let i = 0; i < 9; i++) s += `<rect x="0" y="${i * 46 + 10}" width="300" height="20" fill="#fff" opacity=".55"/>`;
  s += `</g><g transform="translate(640,420)"><rect width="300" height="220" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="10"/><circle cx="90" cy="90" r="40" fill="${C.amber}"/><path d="M20,200 L120,110 L190,170 L230,130 L290,200Z" fill="${C.teal}"/></g>`;
  s += plant(980, 1110, 1.3);
  return s;
}
function table(y = 1240) {
  return `<path d="M-40,${y} L1120,${y} L1120,${y + 60} L-40,${y + 60}Z" fill="${C.wood}"/><rect x="-40" y="${y + 60}" width="1160" height="400" fill="${C.woodD}"/>
  <rect x="-40" y="${y}" width="1160" height="10" fill="#93683F"/>`;
}

// ---------- scene definitions ----------
// each: {from: firstLine, dark, xf (crossfade in), draw(t, lt)}  t = absolute, lt = time since scene start
const SCENES = [
  { // 1 — hook: a voice that goes silent
    from: 1, dark: true, draw(t, lt) {
      const l = L(1), fl = eo(prog(t, l.s + (l.e - l.s) * .55, .7));
      let s = bgInk(t);
      s += `<g opacity="${1 - fl * .2}">${waveform(540, 860, 820, 150 * (1 - fl), t, C.amber, 12)}</g>`;
      s += `<circle cx="${540 - 410}" cy="860" r="14" fill="${C.amber}"/><circle cx="${540 + 410}" cy="860" r="14" fill="${C.amber}"/>`;
      const p = pop(t, l.s + (l.e - l.s) * .7, .4);
      s += `<g transform="translate(540,640) scale(${p})" opacity="${clamp(p)}"><rect x="-150" y="-50" width="300" height="100" rx="50" fill="${C.amber}"/><text y="20" text-anchor="middle" font-size="56" font-weight="700" fill="${C.ink}">নীরবতা</text></g>`;
      return s;
    }
  },
  { // 2 — "don't do this": words rush to fill, then a big stop sign
    from: 2, dark: true, draw(t, lt) {
      const l = L(2);
      let s = bgInk(t);
      s += `<line x1="130" y1="860" x2="950" y2="860" stroke="${C.amber}" stroke-width="12" stroke-linecap="round" opacity=".5"/>`;
      const words = ['মানে...', 'আসলে...', 'ঠিক আছে...', 'কমাতে পারি...'];
      words.forEach((w, i) => {
        const p = eo(prog(lt, i * .16, .45));
        const x = lerp(1300, [300, 640, 380, 720][i], p), y = [700, 640, 1010, 1080][i];
        s += `<g transform="translate(${x},${y})" opacity="${p}">${bubble(-150, -60, 300, 110, '#fff', '#fff', i % 2 ? 'right' : 'left')}<text y="12" text-anchor="middle" font-size="44" font-weight="600" fill="${C.ink}">${w}</text></g>`;
      });
      const p = pop(t, l.s + .55, .4);
      s += `<g transform="translate(540,860) scale(${p})" opacity="${clamp(p * 1.2)}"><circle r="260" fill="none" stroke="${C.coral}" stroke-width="34"/><line x1="-184" y1="184" x2="184" y2="-184" stroke="${C.coral}" stroke-width="34" stroke-linecap="round"/></g>`;
      return s;
    }
  },
  { // 3 — meet Rafiq; money flies away
    from: 3, xf: true, draw(t, lt) {
      const l3 = L(3), l4 = L(4);
      const sad = t > l4.s;
      let s = bgPaper(t);
      const z = 1 + lt * .015;
      s += `<g transform="translate(540,1000) scale(${z}) translate(-540,-1000)">`;
      if (sad) for (let i = 0; i < 9; i++) {
        const p = prog(t, l4.s + i * .18, 1.6);
        if (p <= 0) continue;
        const x = 540 + Math.sin(i * 2.1) * 120 + (i % 2 ? 1 : -1) * p * (250 + i * 30);
        const y = 1250 - p * 1300;
        s += `<g opacity="${1 - p * .6}">${moneyNote(x, y, Math.sin(i + p * 6) * 40, .9)}</g>`;
      }
      s += person({ kind: 'rafiq', x: 540, y: 960, s: 1.55, expr: sad ? 'sad' : 'neutral', blink: blinkAt(t, 1), look: sad ? [0, .6] : [0, 0] });
      s += `</g>`;
      const p = pop(t, l3.s + .1, .45);
      s += `<g transform="translate(540,470) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-80" width="520" height="160" rx="30" fill="#fff" filter="url(#shadow)"/><rect x="-260" y="-80" width="16" height="160" rx="8" fill="${C.amber}"/>
        <text x="0" y="-6" text-anchor="middle" font-size="58" font-weight="700" fill="${C.ink}">রফিক সাহেব</text><text x="0" y="48" text-anchor="middle" font-size="32" font-weight="500" fill="${C.mute}">গার্মেন্টস ব্যবসায়ী</text></g>`;
      if (sad) {
        const q = pop(t, l4.s + .9, .4);
        s += `<g transform="translate(540,690) scale(${q})" opacity="${clamp(q)}"><rect x="-200" y="-46" width="400" height="92" rx="46" fill="${C.coral}"/><text y="16" text-anchor="middle" font-size="46" font-weight="700" fill="#fff">− ৳ লাখ লাখ</text></g>`;
      }
      return s;
    }
  },
  { // 4 — the factory in Gazipur
    from: 5, draw(t, lt) {
      let s = `<rect width="${W}" height="${H}" fill="url(#gSky)"/>`;
      s += `<circle cx="820" cy="420" r="90" fill="${C.amber}" opacity=".85"/>`;
      s += `<path d="M0,1250 Q270,1180 540,1230 T1080,1210 V1920 H0Z" fill="#9CC59A"/><path d="M0,1330 Q300,1280 600,1320 T1080,1300 V1920 H0Z" fill="#7FB07E"/>`;
      const z = 1.02 + lt * .02;
      s += `<g transform="translate(540,1100) scale(${z}) translate(-540,-1100)">`;
      s += smoke(740, 780, t, 1.1) + factory(540, 1080, 1.25);
      s += `</g>`;
      const p = eo(prog(lt, .3, .5));
      s += `<g transform="translate(300,${lerp(300, 620, p)})" opacity="${p}"><path d="M0,0 C-60,-60 -60,-150 0,-150 C60,-150 60,-60 0,0Z" fill="${C.coral}"/><circle cy="-100" r="22" fill="#fff"/></g>`;
      const q = pop(lt, .7, .4);
      s += `<g transform="translate(300,690) scale(${q})" opacity="${clamp(q)}"><rect x="-120" y="-38" width="240" height="76" rx="38" fill="${C.ink}"/><text y="14" text-anchor="middle" font-size="40" font-weight="700" fill="#fff">গাজীপুর</text></g>`;
      return s;
    }
  },
  { // 5 — first time, a big European buyer
    from: 6, dark: true, draw(t, lt) {
      const l7 = L(7);
      let s = bgInk(t);
      // abstract globe
      s += `<circle cx="540" cy="860" r="380" fill="#ffffff08" stroke="#ffffff22" stroke-width="3"/>`;
      for (let i = 1; i < 4; i++) s += `<ellipse cx="540" cy="860" rx="${380 * i / 4}" ry="380" fill="none" stroke="#ffffff14" stroke-width="2"/><ellipse cx="540" cy="860" rx="380" ry="${380 * i / 4}" fill="none" stroke="#ffffff14" stroke-width="2"/>`;
      const A = [300, 640], B = [800, 1040], Cc = [470, 380];
      const p = eio(prog(t, L(6).s + .2, 2.6));
      // dashed arc drawn progressively
      s += `<path d="M${A} Q${Cc} ${B}" fill="none" stroke="${C.amber}" stroke-width="7" stroke-dasharray="18 14" pathLength="1000" style="stroke-dasharray:18 14"/>`;
      s += `<path d="M${A} Q${Cc} ${B}" fill="none" stroke="#1A2A4C" stroke-width="12" pathLength="1000" stroke-dasharray="1000" stroke-dashoffset="${-p * 1000}"/>`;
      const bx = (1 - p) ** 2 * A[0] + 2 * (1 - p) * p * Cc[0] + p * p * B[0], by = (1 - p) ** 2 * A[1] + 2 * (1 - p) * p * Cc[1] + p * p * B[1];
      const dx = 2 * (1 - p) * (Cc[0] - A[0]) + 2 * p * (B[0] - Cc[0]), dy = 2 * (1 - p) * (Cc[1] - A[1]) + 2 * p * (B[1] - Cc[1]);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      s += `<circle cx="${A[0]}" cy="${A[1]}" r="16" fill="#fff"/><text x="${A[0]}" y="${A[1] - 40}" text-anchor="middle" font-size="40" font-weight="700" fill="#fff">ইউরোপ</text>`;
      s += `<circle cx="${B[0]}" cy="${B[1]}" r="16" fill="${C.amber}"/><text x="${B[0]}" y="${B[1] + 70}" text-anchor="middle" font-size="40" font-weight="700" fill="${C.amber}">বাংলাদেশ</text>`;
      s += `<g transform="translate(${bx},${by}) rotate(${ang})"><path d="M30,0 L-20,-24 L-10,0 L-20,24Z" fill="#fff"/></g>`;
      const q = pop(t, l7.s + .3, .5);
      s += `<g transform="translate(540,1330) scale(${q})" opacity="${clamp(q)}"><circle r="190" fill="${C.paper}" stroke="${C.amber}" stroke-width="10"/><clipPath id="bc"><circle r="185"/></clipPath><g clip-path="url(#bc)">${person({ kind: 'buyer', x: 0, y: 10, s: .95, expr: 'smile', blink: blinkAt(t, 2) })}</g>
        <rect x="-170" y="160" width="340" height="70" rx="35" fill="${C.amber}"/><text y="208" text-anchor="middle" font-size="38" font-weight="700" fill="${C.ink}">বড় বায়ার</text></g>`;
      return s;
    }
  },
  { // 6 — the order would transform the factory
    from: 8, draw(t, lt) {
      let s = `<rect width="${W}" height="${H}" fill="url(#gSky)"/><path d="M0,1250 Q270,1180 540,1230 T1080,1210 V1920 H0Z" fill="#9CC59A"/>`;
      const p = eo(prog(lt, .3, 1.4));
      // new buildings rising
      s += `<clipPath id="gr"><rect x="0" y="0" width="${W}" height="1240"/></clipPath><g clip-path="url(#gr)">`;
      s += `<g transform="translate(0,${(1 - p) * 520})"><rect x="40" y="760" width="230" height="480" fill="#D7C6AA"/><rect x="810" y="700" width="240" height="540" fill="#D7C6AA"/>`;
      for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) { s += `<rect x="${70 + c * 100}" y="${800 + r * 70}" width="60" height="40" fill="#8FB8C9"/><rect x="${840 + c * 110}" y="${740 + r * 80}" width="70" height="44" fill="#8FB8C9"/>`; }
      s += `</g></g>`;
      s += smoke(740, 860, t) + factory(540, 1120, 1.0);
      // growth chart card
      const q = pop(lt, .2, .45);
      s += `<g transform="translate(540,470) scale(${q})" opacity="${clamp(q)}"><rect x="-260" y="-170" width="520" height="300" rx="30" fill="#fff" filter="url(#shadow)"/>`;
      [.3, .45, .7, 1].forEach((h, i) => { const hh = 200 * h * eo(prog(lt, .5 + i * .15, .5)); s += `<rect x="${-190 + i * 100}" y="${100 - hh}" width="64" height="${hh}" rx="10" fill="${i === 3 ? C.amber : C.teal}"/>`; });
      const a = eo(prog(lt, 1.1, .5));
      s += `<path d="M-200,60 L-90,20 L10,-20 L180,-130" stroke="${C.coral}" stroke-width="10" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - a}"/>`;
      s += `<path d="M150,-140 L190,-136 L176,-100" stroke="${C.coral}" stroke-width="10" fill="none" stroke-linecap="round" opacity="${a}"/></g>`;
      return s;
    }
  },
  { // 7 — the meeting, price $4
    from: 9, xf: true, draw(t, lt) {
      const l10 = L(10);
      let s = room(t);
      const z = 1 + lt * .012;
      s += `<g transform="translate(540,1100) scale(${z}) translate(-540,-1100)">`;
      s += person({ kind: 'rafiq', x: 270, y: 930, s: .95, look: [1, 0], blink: blinkAt(t, 1), mouth: speakMouth(t, [10]), expr: 'neutral' });
      s += person({ kind: 'buyer', x: 810, y: 930, s: .95, look: [-1, 0], blink: blinkAt(t, 2), expr: 'neutral' });
      s += table(1240);
      s += `<rect x="640" y="1210" width="200" height="40" rx="4" fill="#E9E2D4" transform="rotate(-4 740 1230)"/><path d="M200,1200 h70 v45 h-70z" fill="#fff" opacity=".9"/><circle cx="235" cy="1198" r="34" fill="none" stroke="#fff" stroke-width="7"/>`;
      s += `</g>`;
      const p = pop(t, l10.s + .1, .45);
      s += `<g opacity="${clamp(p)}">${priceTag(470, 600, p * 1.15, '$' + bn('4.00'), 'প্রতি পিস')}${tshirt(170, 600, p * .9)}</g>`;
      return s;
    }
  },
  { // 8 — buyer stays silent, looks at file
    from: 11, draw(t, lt) {
      let s = room(t);
      s += `<rect width="${W}" height="${H}" fill="#E9DFCF" opacity=".55"/>`;
      const z = 1 + lt * .03;
      s += `<g transform="translate(540,1000) scale(${z}) translate(-540,-1000)">`;
      s += person({ kind: 'buyer', x: 540, y: 900, s: 1.75, look: [-.2, 1], blink: blinkAt(t, 3) * .5, expr: 'stern' });
      s += `<g transform="translate(540,1300) rotate(-3)"><rect x="-330" y="-90" width="660" height="300" rx="14" fill="#E0B565"/><rect x="-300" y="-120" width="600" height="300" rx="10" fill="#FFFDF7"/>`;
      for (let i = 0; i < 6; i++) s += `<rect x="-250" y="${-80 + i * 34}" width="${i % 3 === 2 ? 300 : 500}" height="12" rx="6" fill="#D9D2C4"/>`;
      s += `</g></g>`;
      s += silencePill(840, 220, L(11).s, t, false);
      return s;
    }
  },
  { // 9 — 10 seconds… 15 seconds (stopwatch)
    from: 13, dark: true, draw(t, lt) {
      const l = L(13), mid = l.s + (l.e - l.s) * .5;
      const fifteen = t >= mid;
      let s = bgInk(t);
      const pr = fifteen ? lerp(10, 15, eo(prog(t, mid, .35))) / 60 : lerp(0, 10, eo(prog(lt, 0, .35))) / 60;
      const R = 320;
      s += `<circle cx="540" cy="880" r="${R}" fill="none" stroke="#ffffff1c" stroke-width="40"/>`;
      s += `<circle cx="540" cy="880" r="${R}" fill="none" stroke="${C.amber}" stroke-width="40" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - pr}" transform="rotate(-90 540 880)"/>`;
      s += `<rect x="500" y="480" width="80" height="50" rx="10" fill="${C.amber}"/>`;
      const num = fifteen ? '১৫' : '১০';
      const sc = pop(t, fifteen ? mid : l.s, .35);
      s += `<g transform="translate(540,920) scale(${sc})"><text text-anchor="middle" y="40" font-size="280" font-weight="700" fill="#fff">${num}</text></g>`;
      s += `<text x="540" y="1090" text-anchor="middle" font-size="64" font-weight="600" fill="${C.amber}">সেকেন্ড</text>`;
      s += `<text x="540" y="1400" text-anchor="middle" font-size="52" font-weight="500" fill="#ffffffaa">বায়ার তখনও চুপ...</text>`;
      return s;
    }
  },
  { // 10 — Rafiq can't hold it (ECU, sweat)
    from: 14, draw(t, lt) {
      let s = `<rect width="${W}" height="${H}" fill="#F1E3D3"/>`;
      const sh = Math.sin(t * 40) * 3 * clamp(lt);
      const z = 1 + lt * .05;
      s += `<g transform="translate(${540 + sh},950) scale(${z}) translate(-540,-950)">`;
      s += person({ kind: 'rafiq', x: 540, y: 880, s: 2.6, expr: 'worried', look: [Math.sin(t * 2.6) > 0 ? .9 : -.9, 0], blink: blinkAt(t, 4), sweat: 1, t });
      s += `</g>`;
      s += silencePill(840, 220, L(11).s, t, false);
      return s;
    }
  },
  { // 11 — "maybe $3.50"
    from: 15, draw(t, lt) {
      const l = L(15);
      let s = room(t) + `<rect width="${W}" height="${H}" fill="#E9DFCF" opacity=".5"/>`;
      s += person({ kind: 'rafiq', x: 540, y: 1000, s: 1.75, expr: 'worried', mouth: speakMouth(t, [15]), look: [.6, 0], blink: blinkAt(t, 5), sweat: .8, t });
      s += priceStack(t, [[l.s + .2, '$' + bn('4.00')], [l.s + (l.e - l.s) * .7, '$' + bn('3.50')]]);
      return s;
    }
  },
  { // 12 — buyer still silent
    from: 16, draw(t, lt) {
      let s = room(t) + `<rect width="${W}" height="${H}" fill="#E9DFCF" opacity=".55"/>`;
      const z = 1.05 + lt * .04;
      s += `<g transform="translate(540,900) scale(${z}) translate(-540,-900)">`;
      s += person({ kind: 'buyer', x: 540, y: 900, s: 1.75, look: [-.2, 1], blink: 0, expr: 'stern' });
      s += `</g>`;
      s += silencePill(840, 220, L(11).s, t, false);
      return s;
    }
  },
  { // 13 — "even $3.20"
    from: 17, draw(t, lt) {
      const l18 = L(18);
      let s = room(t) + `<rect width="${W}" height="${H}" fill="#E9DFCF" opacity=".5"/>`;
      s += person({ kind: 'rafiq', x: 540, y: 1000, s: 1.75, expr: 'worried', mouth: speakMouth(t, [17, 18]), look: [.6, .2], blink: blinkAt(t, 6), sweat: 1, t });
      s += priceStack(t, [[0, '$' + bn('4.00')], [0, '$' + bn('3.50')], [l18.s + (l18.e - l18.s) * .45, '$' + bn('3.20')]]);
      return s;
    }
  },
  { // 14 — buyer nods; deal stamped
    from: 19, draw(t, lt) {
      const l20 = L(20);
      let s = room(t) + `<rect width="${W}" height="${H}" fill="#E9DFCF" opacity=".55"/>`;
      const nod = t < l20.s + .2 ? Math.max(0, Math.sin((t - L(19).s) * 9)) * 3 : 0;
      s += person({ kind: 'buyer', x: 540, y: 900, s: 1.75, look: [0, .2], blink: blinkAt(t, 2), expr: 'smile', nod });
      const p = eo(prog(t, l20.s - .15, .4));
      if (p > 0) {
        s += `<rect width="${W}" height="${H}" fill="${C.ink}" opacity="${p * .55}"/>`;
        s += `<g transform="translate(540,${lerp(2200, 960, p)}) rotate(-3)"><rect x="-330" y="-430" width="660" height="860" rx="16" fill="#FFFDF7" filter="url(#shadow)"/>
        <text x="0" y="-330" text-anchor="middle" font-size="58" font-weight="700" fill="${C.ink}">চুক্তিপত্র</text>
        <rect x="-260" y="-290" width="520" height="6" rx="3" fill="${C.amber}"/>`;
        for (let i = 0; i < 4; i++) s += `<rect x="-260" y="${-240 + i * 40}" width="${i === 3 ? 300 : 520}" height="14" rx="7" fill="#E1DACB"/>`;
        s += `<text x="-260" y="0" font-size="40" font-weight="500" fill="${C.mute}">প্রতি পিস</text><text x="260" y="0" text-anchor="end" font-size="70" font-weight="700" fill="${C.coral}">$${bn('3.20')}</text>`;
        const sg = eo(prog(t, l20.s + .1, .5));
        s += `<path d="M-240,250 C-200,180 -170,300 -130,230 C-100,180 -80,280 -40,240 C-10,210 20,260 60,230" stroke="${C.ink}" stroke-width="6" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - sg}"/><line x1="-260" y1="280" x2="100" y2="280" stroke="#C9C0AE" stroke-width="3"/>`;
        s += `</g>`;
        const st = prog(t, l20.s + .35, .22);
        if (st > 0) s += `<g opacity="${clamp(st * 2)}">${stamp(640, 1260, lerp(1.6, 1, eo(st)), 'চুক্তি সম্পন্ন', C.teal)}</g>`;
      }
      return s;
    }
  },
  { // 15 — a month later, dinner; buyer laughs
    from: 21, xf: true, dark: true, draw(t, lt) {
      let s = dinnerBg(t);
      const p = pop(lt, .2, .4);
      s += `<g transform="translate(540,300) scale(${p})" opacity="${clamp(p)}"><rect x="-150" y="-44" width="300" height="88" rx="44" fill="${C.amber}"/><text y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${C.ink}">এক মাস পর</text></g>`;
      const laugh = t > L(22).s ? 'laugh' : 'smile';
      const lm = laugh === 'laugh' ? .35 + .3 * Math.abs(Math.sin(t * 9)) : 0;
      s += person({ kind: 'rafiq', x: 270, y: 980, s: .95, expr: 'smile', look: [1, 0], blink: blinkAt(t, 1) });
      s += person({ kind: 'buyer', x: 810, y: 980 - (laugh === 'laugh' ? Math.abs(Math.sin(t * 9)) * 6 : 0), s: .95, expr: laugh, mouth: lm, look: [-1, 0], blink: blinkAt(t, 2) });
      s += dinnerTable(t);
      return s;
    }
  },
  { // 16 — "your first price was within our budget"
    from: 23, dark: true, draw(t, lt) {
      const l24 = L(24);
      let s = dinnerBg(t);
      s += person({ kind: 'buyer', x: 540, y: 1060, s: 1.75, expr: 'smile', mouth: speakMouth(t, [23, 24]), look: [-.3, 0], blink: blinkAt(t, 2) });
      // budget scale card
      const p = eo(prog(t, L(23).s + 1.0, .5));
      s += `<g transform="translate(540,${lerp(200, 430, p)})" opacity="${p}"><rect x="-470" y="-190" width="940" height="360" rx="30" fill="#FFFDF7" filter="url(#shadow)"/>
      <text x="-420" y="-120" font-size="40" font-weight="700" fill="${C.ink}">বায়ারের বাজেট</text>`;
      const X = v => -400 + (v - 3) / 2 * 800;
      const z = eo(prog(t, L(23).s + 1.4, .7));
      s += `<rect x="-400" y="-30" width="800" height="24" rx="12" fill="#E8E1D3"/><rect x="${X(3.7)}" y="-38" width="${(X(4.8) - X(3.7)) * z}" height="40" rx="20" fill="${C.teal}" opacity=".85"/>`;
      ['3.00', '4.00', '5.00'].forEach(v => s += `<text x="${X(+v)}" y="50" text-anchor="middle" font-size="30" font-weight="500" fill="${C.mute}">$${bn(v)}</text>`);
      const m1 = pop(t, L(23).s + 1.9, .4);
      s += `<g transform="translate(${X(4)},-18) scale(${m1})"><circle r="26" fill="${C.amber}" stroke="#fff" stroke-width="6"/><text y="-44" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}">প্রথম দাম ✓</text></g>`;
      const m2 = pop(t, l24.s + .3, .4);
      s += `<g transform="translate(${X(3.2)},-18) scale(${m2})"><circle r="26" fill="${C.coral}" stroke="#fff" stroke-width="6"/><text y="100" text-anchor="middle" font-size="30" font-weight="700" fill="${C.coral}">চূড়ান্ত দাম</text></g>`;
      s += `</g>`;
      return s;
    }
  },
  { // 17 — nobody cheated him; he cheated himself
    from: 25, xf: true, draw(t, lt) {
      const l26 = L(26), l27 = L(27);
      let s = bgPaper(t);
      s += person({ kind: 'rafiq', x: 540, y: 1080, s: 1.5, expr: t > l26.s ? 'sad' : 'worried', look: [0, t > l26.s ? .8 : 0], blink: blinkAt(t, 3) });
      if (t < l26.s) {
        const p = pop(t, L(25).s + .2, .4);
        s += `<g transform="translate(540,470) scale(${p})" opacity="${clamp(p)}"><text text-anchor="middle" font-size="92" font-weight="700" fill="${C.ink}">কেউ ঠকায়নি</text></g>`;
      } else if (t < l27.s) {
        const p = pop(t, l26.s + .05, .4);
        s += `<g transform="translate(540,440) scale(${p})" opacity="${clamp(p)}"><text text-anchor="middle" font-size="84" font-weight="700" fill="${C.coral}">নিজেই নিজেকে</text><text y="110" text-anchor="middle" font-size="84" font-weight="700" fill="${C.ink}">ঠকিয়েছেন</text></g>`;
      } else {
        const p = pop(t, l27.s + .05, .45);
        s += `<g transform="translate(540,450) scale(${p})" opacity="${clamp(p)}"><rect x="-430" y="-150" width="860" height="300" rx="30" fill="#fff" filter="url(#shadow)"/>
        <text x="0" y="-60" text-anchor="middle" font-size="46" font-weight="600" fill="${C.mute}">$${bn('4.00')}  −  $${bn('3.20')}</text>
        <text x="0" y="50" text-anchor="middle" font-size="84" font-weight="700" fill="${C.coral}">= $${bn('0.80')}</text>
        <text x="0" y="110" text-anchor="middle" font-size="34" font-weight="600" fill="${C.ink}">প্রতি পিসে ক্ষতি</text></g>`;
      }
      return s;
    }
  },
  { // 18 — people fear silence
    from: 28, dark: true, draw(t, lt) {
      const l29 = L(29);
      let s = bgInk(t);
      const shake = t < l29.s ? Math.sin(t * 30) * 4 * clamp(lt - .4) : 0;
      s += silhouette(300 + shake, 1050, C.amber, 1) + silhouette(780, 1050, '#6C7A99', -1);
      s += `<g transform="translate(780,700)">${bubble(-110, -60, 220, 110, '#ffffff22', '#ffffff55', 'left', true)}${[0, 1, 2].map(i => `<circle cx="${-50 + i * 50}" cy="-5" r="12" fill="#fff" opacity="${.35 + .65 * Math.max(0, Math.sin(t * 5 - i))}"/>`).join('')}</g>`;
      // heartbeat line under "you"
      if (t < l29.s) s += `<g opacity="${eo(prog(lt, .3, .4))}">${heartbeat(300, 1380, t)}</g>`;
      const th = [['বিরক্ত?', 210, 600, .1], ['রাজি না?', 400, 470, .9]];
      th.forEach(([w, x, y, d]) => {
        const p = pop(t, l29.s + d, .4);
        s += `<g transform="translate(${x},${y}) scale(${p})" opacity="${clamp(p)}"><ellipse rx="150" ry="80" fill="#fff"/><circle cx="60" cy="110" r="16" fill="#fff"/><circle cx="85" cy="150" r="10" fill="#fff"/><text y="16" text-anchor="middle" font-size="50" font-weight="700" fill="${C.coral}">${w}</text></g>`;
      });
      return s;
    }
  },
  { // 19 — we fill the gap with words → weakness
    from: 30, draw(t, lt) {
      const l31 = L(31);
      let s = bgPaper(t);
      s += miniPerson(170, 900, C.amber) + miniPerson(910, 900, '#6C7A99');
      const g = clamp(1 - eo(prog(t, L(30).s + .8, 1.4)));
      s += `<rect x="300" y="720" width="480" height="${360}" rx="30" fill="none" stroke="${C.mute}" stroke-width="5" stroke-dasharray="18 14" opacity="${.3 + g * .7}"/>`;
      s += `<text x="540" y="${690}" text-anchor="middle" font-size="40" font-weight="600" fill="${C.mute}">ফাঁকা জায়গা</text>`;
      const words = [['অর্ডারটা দরকার', 'খুব দরকার'], ['খরচ কম', 'আরও কমাতে পারি'], ['দাম কমাবো', 'দামে নমনীয়']];
      words.forEach(([w, weak], i) => {
        const p = eo(prog(t, L(30).s + .7 + i * .45, .5));
        const flip = eo(prog(t, l31.s + 1.2 + i * .35, .35));
        const x = lerp(260, 540, p), y = 780 + i * 120;
        s += `<g transform="translate(${x},${y}) scale(1,${Math.abs(1 - 2 * flip) || .01})" opacity="${p}"><rect x="-210" y="-46" width="420" height="92" rx="46" fill="${flip > .5 ? C.coral : '#fff'}" stroke="${flip > .5 ? C.coral : C.ink}" stroke-width="4"/><text y="14" text-anchor="middle" font-size="40" font-weight="600" fill="${flip > .5 ? '#fff' : C.ink}">${flip > .5 ? weak : w}</text></g>`;
      });
      // weakness meter
      const m = eo(prog(t, l31.s + 1.2, 1.6));
      s += `<g transform="translate(540,1220)" opacity="${eo(prog(t, l31.s, .4))}"><text x="-400" y="-20" font-size="38" font-weight="700" fill="${C.ink}">দুর্বলতা</text><rect x="-400" y="0" width="800" height="36" rx="18" fill="#E8E1D3"/><rect x="-400" y="0" width="${800 * m * .9}" height="36" rx="18" fill="${C.coral}"/></g>`;
      return s;
    }
  },
  { // 20 — The 48 Laws of Power, Law 4
    from: 32, xf: true, dark: true, draw(t, lt) {
      const l33 = L(33), l34 = L(34);
      let s = bgInk(t);
      const up = eo(prog(t, l33.s - .1, .6));
      const bp = eo(prog(lt, .1, .7));
      s += `<g transform="translate(540,${lerp(900, 480, up)}) scale(${lerp(1, .62, up)}) rotate(${lerp(-6, 0, bp)})" opacity="${bp}">
        <rect x="-250" y="-340" width="500" height="680" rx="14" fill="#1F3A2E"/><rect x="-250" y="-340" width="40" height="680" rx="8" fill="#16291F"/>
        <rect x="-200" y="-300" width="420" height="600" fill="none" stroke="${C.amber}" stroke-width="4"/>
        <text x="10" y="-180" text-anchor="middle" font-size="30" font-weight="600" fill="${C.amber}" letter-spacing="6">ROBERT GREENE</text>
        <text x="10" y="-40" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">The 48</text>
        <text x="10" y="50" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Laws of</text>
        <text x="10" y="140" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Power</text>
        <rect x="-40" y="200" width="100" height="5" fill="${C.amber}"/></g>`;
      const p = pop(t, l33.s + .3, .45);
      s += `<g transform="translate(540,1090) scale(${p})" opacity="${clamp(p)}"><rect x="-150" y="-80" width="300" height="160" rx="24" fill="${C.amber}"/><text y="30" text-anchor="middle" font-size="96" font-weight="700" fill="${C.ink}">LAW 4</text></g>`;
      const q = eo(prog(t, l33.s + .9, .5));
      s += `<text x="540" y="${1270 + (1 - q) * 30}" text-anchor="middle" font-size="44" font-weight="600" fill="#fff" opacity="${q}" letter-spacing="2">ALWAYS SAY LESS THAN NECESSARY</text>`;
      const r = eo(prog(t, l34.s, .5));
      s += `<g opacity="${r}" transform="translate(0,${(1 - r) * 30})"><text x="540" y="1440" text-anchor="middle" font-size="66" font-weight="600" fill="#fff">প্রয়োজনের চেয়ে সবসময়</text><text x="540" y="1540" text-anchor="middle" font-size="84" font-weight="700" fill="${C.amber}">কম বলো।</text></g>`;
      return s;
    }
  },
  { // 21 — mystery: the quiet one makes others open up
    from: 35, draw(t, lt) {
      const l36 = L(36);
      let s = bgPaper(t);
      const glow = eo(prog(t, l36.s + 1.5, 1));
      s += `<circle cx="300" cy="900" r="${230 + glow * 40}" fill="${C.amber}" opacity="${.12 + glow * .2}"/>`;
      s += silhouette(300, 1050, '#2B3A5E', 1);
      ['?', '?', '?'].forEach((q, i) => {
        const p = eo(prog(lt, .3 + i * .25, .5));
        s += `<text x="${200 + i * 100}" y="${640 - Math.sin(t * 2 + i) * 15 - i * 30}" font-size="${90 - i * 10}" font-weight="700" fill="${C.amber}" opacity="${p}">${q}</text>`;
      });
      s += `<text x="300" y="1430" text-anchor="middle" font-size="40" font-weight="700" fill="${C.ink}" opacity="${eo(prog(lt, .2, .4))}">যে কম বলে</text>`;
      if (t > l36.s) {
        s += silhouette(800, 1050, '#9AA6BF', -1);
        const it = ['আমার বাজেট...', 'আসলে...', 'সত্যি বলতে...'];
        it.forEach((w, i) => {
          const p = eo(prog(t, l36.s + 1.2 + i * .45, .8));
          const x = lerp(760, 380, p), y = 640 + i * 110 - p * 60;
          s += `<g transform="translate(${x},${y})" opacity="${p < .9 ? p : (1 - p) * 10}"><rect x="-150" y="-36" width="300" height="72" rx="36" fill="#fff" stroke="${C.ink}" stroke-width="3"/><text y="12" text-anchor="middle" font-size="32" font-weight="600" fill="${C.ink}">${w}</text></g>`;
        });
        s += `<text x="800" y="1430" text-anchor="middle" font-size="40" font-weight="700" fill="${C.mute}">অন্যজন</text>`;
      }
      return s;
    }
  },
  { // 22 — next time remember
    from: 37, xf: true, draw(t, lt) {
      const l38 = L(38);
      let s = bgPaper(t);
      const h = eo(prog(lt, 0, .5));
      s += `<g opacity="${h}"><text x="90" y="420" font-size="68" font-weight="700" fill="${C.ink}">পরের বার মনে রাখবেন</text><rect x="90" y="450" width="${180 * h}" height="10" rx="5" fill="${C.amber}"/></g>`;
      const cards = [[L(37).s + .4, 'কেউ চুপ হলে ঘাবড়াবেন না'], [l38.s + .1, 'তাড়াহুড়ো করে নীরবতা ভাঙবেন না']];
      cards.forEach(([a, txt], i) => {
        const p = eo(prog(t, a, .5));
        const dim = i === 0 && t > l38.s + .1 ? .5 : 1;
        s += `<g transform="translate(0,${(1 - p) * 60})" opacity="${p * dim}"><rect x="80" y="${560 + i * 190}" width="920" height="150" rx="30" fill="#fff" filter="url(#shadow)"/>
          <circle cx="170" cy="${635 + i * 190}" r="44" fill="${C.amber}"/><text x="170" y="${652 + i * 190}" text-anchor="middle" font-size="48" font-weight="700" fill="${C.ink}">${bn(i + 1)}</text>
          <text x="245" y="${650 + i * 190}" font-size="46" font-weight="600" fill="${C.ink}">${txt}</text></g>`;
      });
      s += person({ kind: 'rafiq', x: 540, y: 1400, s: 1.05, expr: 'neutral', blink: blinkAt(t, 5), look: [0, -.3] });
      return s;
    }
  },
  { // 23 — Stay silent. Let them break it.
    from: 39, dark: true, draw(t, lt) {
      const l40 = L(40);
      let s = bgInk(t);
      const p = pop(t, L(39).s, .45);
      s += `<g transform="translate(540,${t > l40.s ? lerp(760, 600, eo(prog(t, l40.s, .5))) : 760}) scale(${p})"><text text-anchor="middle" font-size="170" font-weight="700" fill="#fff">চুপ থাকুন।</text></g>`;
      s += `<line x1="160" y1="980" x2="920" y2="980" stroke="${C.amber}" stroke-width="10" stroke-linecap="round" opacity="${eo(prog(lt, .2, .4))}"/>`;
      if (t > l40.s) {
        const q = eo(prog(t, l40.s + .1, .6));
        s += `<g opacity="${q}">${waveform(lerp(540, 700, q), 980, 440, 90, t, C.teal, 10)}</g>`;
        const r = eo(prog(t, l40.s + .3, .5));
        s += `<g opacity="${r}" transform="translate(0,${(1 - r) * 30})"><text x="540" y="1220" text-anchor="middle" font-size="70" font-weight="600" fill="#fff">নীরবতাটা <tspan fill="${C.amber}" font-weight="700">তাকেই</tspan></text><text x="540" y="1320" text-anchor="middle" font-size="70" font-weight="600" fill="#fff">ভাঙতে দিন।</text></g>`;
      }
      return s;
    }
  },
  { // 24 — CTA: comment
    from: 41, xf: true, draw(t, lt) {
      const l42 = L(42);
      let s = bgPaper(t);
      const a = eo(prog(lt, .1, .5)), b = eo(prog(lt, .9, .5));
      s += `<g opacity="${a}" transform="translate(0,${(1 - a) * 30})"><text x="540" y="420" text-anchor="middle" font-size="70" font-weight="700" fill="${C.ink}">আপনি কি কখনো বেশি কথা বলে</text></g>`;
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 30})"><text x="540" y="520" text-anchor="middle" font-size="70" font-weight="700" fill="${C.ink}">নিজের <tspan fill="${C.coral}">ক্ষতি</tspan> করেছেন?</text></g>`;
      const bo = back(prog(lt, .3, .6));
      s += `<g transform="translate(540,${1180 + (1 - bo) * 600})" filter="url(#sticker)">${person({ kind: 'rafiq', x: 0, y: 0, s: 1.25, expr: 'smile', blink: blinkAt(t, 1), look: [0, -.4] })}</g>`;
      const p = pop(t, l42.s - .1, .4);
      s += `<g transform="translate(540,700) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-58" width="520" height="116" rx="58" fill="${C.teal}"/><path d="M-200,-22 h60 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-34 l-16,14 v-14 h-10 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12z" fill="#fff"/><text x="30" y="18" text-anchor="middle" font-size="50" font-weight="700" fill="#fff">কমেন্টে লিখুন</text></g>`;
      const c = eo(prog(t, l42.s + .2, .4));
      if (c > 0) s += `<g transform="translate(${lerp(820, 660, c)},${lerp(900, 740, c)}) scale(${t > l42.s + .6 && t < l42.s + .75 ? .85 : 1})">${cursor()}</g>`;
      return s;
    }
  },
  { // 25 — end card: follow
    from: 43, dark: true, draw(t, lt) {
      let s = bgInk(t);
      const a = pop(lt, .05, .5);
      s += `<g transform="translate(540,760) scale(${a})">${orbitLogo(t, 120)}</g>`;
      const b = eo(prog(lt, .35, .5));
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 30})"><text x="540" y="1020" text-anchor="middle" font-size="96" font-weight="700" fill="#fff">${BRAND}</text>
        <text x="540" y="1100" text-anchor="middle" font-size="40" font-weight="500" fill="#ffffffaa">গল্পে গল্পে জীবনের কৌশল</text></g>`;
      const p = pop(lt, .8, .45);
      const clicked = lt > 1.75;
      s += `<g transform="translate(540,1280) scale(${p * (lt > 1.6 && lt < 1.75 ? .92 : 1)})" opacity="${clamp(p)}"><rect x="${clicked ? -290 : -210}" y="-62" width="${clicked ? 580 : 420}" height="124" rx="62" fill="${clicked ? '#fff' : C.amber}"/><text y="20" text-anchor="middle" font-size="54" font-weight="700" fill="${C.ink}">${clicked ? '✓ ফলো করা হয়েছে' : '+ ফলো করুন'}</text></g>`;
      const c = eo(prog(lt, 1.0, .55));
      if (c > 0) s += `<g transform="translate(${lerp(820, 600, c)},${lerp(1500, 1300, c)})">${cursor()}</g>`;
      const end = eo(prog(t, LINES[42].e + .9, .6));
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${end}"/>`;
      return s;
    }
  }
];

// ---------- helper visuals used by scenes ----------
function priceStack(t, items) {
  let s = '';
  items.forEach(([a, label], i) => {
    const p = a === 0 ? 1 : pop(t, a, .4);
    const struck = i < items.length - 1 && (items[i + 1][0] === 0 || t > items[i + 1][0]);
    const y = 300 + i * 150;
    s += `<g transform="translate(540,${y}) scale(${p})" opacity="${clamp(p) * (struck ? .55 : 1)}"><rect x="-190" y="-60" width="380" height="120" rx="26" fill="#fff" stroke="${struck ? '#ccc' : (i === items.length - 1 ? C.coral : C.ink)}" stroke-width="5"/><text y="24" text-anchor="middle" font-size="68" font-weight="700" fill="${struck ? C.mute : (i ? C.coral : C.ink)}">${label}</text>`;
    if (struck) { const sp = a === 0 && items[i + 1][0] === 0 ? 1 : eo(prog(t, items[i + 1][0] - .05, .3)); s += `<line x1="-150" y1="0" x2="${-150 + 300 * sp}" y2="0" stroke="${C.coral}" stroke-width="9" stroke-linecap="round"/>`; }
    s += `</g>`;
    if (i > 0) s += `<path d="M540,${y - 92} l0,26 m-14,-12 l14,14 l14,-14" stroke="${C.coral}" stroke-width="6" fill="none" opacity="${clamp(p)}"/>`;
  });
  return s;
}
function dinnerBg(t) {
  let s = `<rect width="${W}" height="${H}" fill="url(#gDin)"/>`;
  for (let i = 0; i < 14; i++) {
    const x = (i * 173 + 60) % W, y = 200 + (i * 97) % 500;
    s += `<circle cx="${x}" cy="${y}" r="${30 + (i % 4) * 14}" fill="${C.amber}" opacity="${.08 + .06 * Math.sin(t * 1.5 + i)}"/>`;
  }
  return s;
}
function dinnerTable(t) {
  let s = `<rect x="-20" y="1240" width="1120" height="700" fill="#4A2C24"/><rect x="-20" y="1240" width="1120" height="16" fill="#6A4234"/>`;
  s += `<ellipse cx="300" cy="1290" rx="130" ry="30" fill="#F3EDE3"/><ellipse cx="780" cy="1290" rx="130" ry="30" fill="#F3EDE3"/>`;
  const fl = 1 + Math.sin(t * 13) * .08 + Math.sin(t * 7) * .05;
  s += `<rect x="525" y="1120" width="30" height="140" rx="6" fill="#F6EFE4"/><g transform="translate(540,1110) scale(${fl},${2 - fl})"><path d="M0,-50 C20,-20 18,0 0,6 C-18,0 -20,-20 0,-50Z" fill="${C.amber}"/><path d="M0,-28 C8,-14 8,-2 0,2 C-8,-2 -8,-14 0,-28Z" fill="#FFF3C4"/></g>`;
  s += `<circle cx="540" cy="1090" r="90" fill="${C.amber}" opacity=".12"/>`;
  return s;
}
function silhouette(x, y, col, dir) {
  return `<g transform="translate(${x},${y}) scale(${dir},1)"><circle cx="0" cy="-200" r="110" fill="${col}"/><path d="M-170,250 C-170,40 -110,-60 0,-60 C110,-60 170,40 170,250Z" fill="${col}"/><path d="M95,-215 l22,30 l-24,6z" fill="${col}"/></g>`;
}
function miniPerson(x, y, col) {
  return `<g transform="translate(${x},${y})"><circle cy="-60" r="56" fill="${col}"/><path d="M-90,140 C-90,30 -50,10 0,10 C50,10 90,30 90,140Z" fill="${col}"/></g>`;
}
function heartbeat(cx, cy, t) {
  let d = 'M' + (cx - 200) + ',' + cy;
  const ph = (t * 1.6) % 1;
  d += ` h${120} l20,-60 l25,120 l20,-90 l15,30 h${200}`;
  return `<path d="${d}" stroke="${C.coral}" stroke-width="8" fill="none" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - ph}"/>`;
}
function cursor() {
  return `<path d="M0,0 L0,80 L20,62 L36,98 L52,90 L36,56 L62,56Z" fill="#fff" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`;
}
function orbitLogo(t, r) {
  const a = t * 1.4;
  return `<circle r="${r * .42}" fill="${C.amber}"/><ellipse rx="${r}" ry="${r * .36}" fill="none" stroke="#fff" stroke-width="${r * .06}" transform="rotate(-24)"/>
  <circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r * .36}" r="${r * .1}" fill="${C.teal}" transform="rotate(-24)"/>
  <text y="${r * .15}" text-anchor="middle" font-size="${r * .38}" font-weight="700" fill="${C.ink}">TR</text>`;
}
function brandTag(dark) {
  return `<g transform="translate(60,96)"><g transform="translate(26,-12)">${orbitLogo(0, 26).replace(/<text.*<\/text>/, '')}</g>
  <text x="70" y="0" font-size="34" font-weight="600" fill="${dark ? '#ffffffd9' : C.ink}" opacity=".9">${BRAND}</text></g>`;
}

// ---------- timeline ----------
function sceneStart(i) { return i === 0 ? 0 : Math.max(0, L(SCENES[i].from).s - 0.08); }
function sceneAt(t) {
  let k = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= sceneStart(i)) k = i;
  return k;
}
const DEFS = `<defs>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0"/></filter>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="gInk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2B50"/><stop offset="1" stop-color="#0E1730"/></linearGradient>
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE6EC"/><stop offset="1" stop-color="#F6EFE4"/></linearGradient>
<linearGradient id="gDin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2036"/><stop offset="1" stop-color="#3E2A28"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#14213D" flood-opacity=".18"/></filter>
<filter id="sticker"><feMorphology in="SourceAlpha" operator="dilate" radius="10" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="o"/><feDropShadow in="o" dx="0" dy="10" stdDeviation="12" flood-opacity=".18" result="os"/><feMerge><feMergeNode in="os"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`;

function frameSVG(t) {
  const k = sceneAt(t), sc = SCENES[k], st = sceneStart(k);
  let body = sc.draw(t, t - st);
  if (sc.xf && k > 0 && t - st < 0.35) {
    const prev = SCENES[k - 1], pst = sceneStart(k - 1);
    body = prev.draw(st, st - pst) + `<g opacity="${eio((t - st) / 0.35)}">${body}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${DEFS}${body}${vignette(sc.dark ? .5 : .22)}${grain(.05)}${brandTag(sc.dark)}</svg>`;
}
function subAt(t) {
  for (let i = 1; i <= LINES.length; i++) {
    const l = L(i), next = LINES[i] ? LINES[i].s : l.e + .4;
    const end = Math.min(next - .02, l.e + .35);
    if (t >= l.s - .05 && t < end) return HIDE_SUB.has(i) ? null : { i, p: clamp((t - l.s + .05) / .18) };
  }
  return null;
}
function renderFrame(t) {
  document.getElementById('stage').innerHTML = frameSVG(t);
  const sb = document.getElementById('sub'), s = subAt(t);
  if (!s) { sb.style.opacity = 0; return; }
  if (sb.dataset.i != s.i) { sb.innerHTML = subHTML(s.i); sb.dataset.i = s.i; }
  sb.style.opacity = s.p;
  sb.style.transform = `translateX(-50%) scale(${.94 + .06 * eo(s.p)})`;
}
