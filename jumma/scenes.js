// ===== Jumma reminder reel · TR Universe 0.1 =====
const W = 1080, H = 1920;
const BRAND = 'TR Universe 0.1';
const SUB = [
  'হে মুসলিম! একটু থামুন…!',
  'আপনি কি জানেন, আপনার জীবনের|আরেকটি *শুক্রবার* হয়তো ~আর কখনো আসবে না~!',
  'যে *রব* প্রতিদিন আপনাকে বাঁচিয়ে রাখছেন,|আজ তাঁর ডাকে সাড়া দিতে আপনি *কতটা প্রস্তুত?*',
  'আজ শুক্রবার… পবিত্র জুমার দিন।',
  'সপ্তাহের ব্যস্ততা পেছনে ফেলে মুসলমানরা|ছুটে যায় *মহান আল্লাহর ঘরের* দিকে।',
  'কেউ আসে *দুঃখ* নিয়ে, কেউ আসে *অভাব* নিয়ে,|কেউ আসে বুকভরা হাজারো *না বলা কষ্ট* নিয়ে।',
  'কিন্তু *সিজদায়* মাথা রাখার পর|সবাই যেন *একই আশ্রয়* খুঁজে পায়।',
  'কারণ পৃথিবীর মানুষ আপনাকে ভুলে যেতে পারে,|কিন্তু মহান আল্লাহর কাছে আপনার *কোনো কষ্টই অজানা নয়*।',
  'আপনার *চোখের পানি*, আপনার *নীরব কান্না*—|সবই তাঁর জানা।',
  'তাই এই শুক্রবারটিকে ~অবহেলায়~ কাটিয়ে দেবেন না।',
  '*জুমার নামাজ* আদায় করুন, বেশি বেশি *দরুদ* পাঠ করুন,|*কোরআন তিলাওয়াত* করুন।',
  'নিজের ভুলের জন্য *ক্ষমা চান*।',
  'মনে রাখবেন, আল্লাহর *রহমত* থেকে|কখনো ~নিরাশ~ হবেন না।',
  'এবার আপনাকে একটি *প্রশ্ন* করতে চাই…',
  'জীবনের সবচেয়ে কঠিন সময়ে, যখন পৃথিবীর ~সব দরজা বন্ধ~ মনে হয়,|তখন আপনি *কার কাছে* সাহায্য চান?',
  'মানুষের কাছে,|নাকি *একমাত্র মহান আল্লাহর কাছে?*',
  'আপনার উত্তর *কমেন্টে* লিখুন।',
  'A) মানুষের কাছে|B) একমাত্র মহান আল্লাহর কাছে',
  'কে জানে, আগামী শুক্রবার পর্যন্ত|আমরা ~বেঁচে থাকব কি না~!',
  'তাই যতদিন *নিঃশ্বাস* আছে, ততদিন|আল্লাহর পথে *ফিরে আসার* চেষ্টা করি।',
  'মহান আল্লাহ আমাদের সবাইকে *ক্ষমা* করুন|এবং *সঠিক পথে* পরিচালিত করুন।',
  'আমিন।',
  'জুমা মোবারক।'
];
const HIDE_SUB = new Set([1, 4, 17, 18, 22, 23]);
const L = i => LINES[i - 1];
const lp = (i, f) => L(i).s + (L(i).e - L(i).s) * f;
function subHTML(i) { return SUB[i - 1].split('|').map(r => r.replace(/\*(.+?)\*/g, '<b class="a">$1</b>').replace(/~(.+?)~/g, '<b class="c">$1</b>')).join('<br>'); }
function pill(x, y, txt, bg, fg, sc = 1, fs = 44) { const w = txt.length * fs * .52 + 70; return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}"><rect x="${-w / 2}" y="${-fs * .95}" width="${w}" height="${fs * 1.9}" rx="${fs * .95}" fill="${bg}"/><text y="${fs * .36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${fg}">${txt}</text></g>`; }
function zoomG(cx, cy, z, inner) { return `<g transform="translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})">${inner}</g>`; }
function bigText(y, txt, fs, col, op, dy = 0) { return `<text x="540" y="${y + dy}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}" opacity="${op}" stroke="#120C08" stroke-width="${fs * .08}" paint-order="stroke">${txt}</text>`; }
function fadeUp(t, a, d = .6) { return eo(prog(t, a, d)); }
function cursor() { return `<path d="M0,0 L0,80 L20,62 L36,98 L52,90 L36,56 L62,56Z" fill="#fff" stroke="#14213D" stroke-width="5" stroke-linejoin="round"/>`; }
function orbitLogo(t, r) { const a = t * 1.4; return `<circle r="${r * .42}" fill="${C.amber}"/><ellipse rx="${r}" ry="${r * .36}" fill="none" stroke="#fff" stroke-width="${r * .06}" transform="rotate(-24)"/><circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r * .36}" r="${r * .1}" fill="${C.teal}" transform="rotate(-24)"/><text y="${r * .15}" text-anchor="middle" font-size="${r * .38}" font-weight="700" fill="#14213D">TR</text>`; }
function brandTag(dark) { return `<g transform="translate(60,96)"><g transform="translate(26,-12)">${orbitLogo(0, 26).replace(/<text.*<\/text>/, '')}</g><text x="70" y="0" font-size="34" font-weight="600" fill="${dark ? '#ffffffd9' : '#14213D'}" opacity=".92">${BRAND}</text></g>`; }
function bgWarm(t) { return `<rect width="${W}" height="${H}" fill="url(#gWarm)"/>${geoPattern(.06)}${dust(t, 24, [0, 0, 1080, 1920])}`; }
function cityDark(t) {
  let g = `<rect width="${W}" height="${H}" fill="#0E1018"/>`;
  for (let i = 0; i < 9; i++) { const x = i * 130 - 20, h = 500 + (i * 173) % 500; g += `<rect x="${x}" y="${1350 - h}" width="120" height="${h}" fill="#1A1E2C"/>`; for (let r = 0; r < Math.floor(h / 70); r++) for (let c = 0; c < 3; c++) if ((i + r + c) % 3) g += `<rect x="${x + 14 + c * 36}" y="${1350 - h + 20 + r * 70}" width="20" height="30" fill="#F4C46B" opacity="${.25 + .2 * ((r + c) % 2)}"/>`; }
  g += `<rect y="1350" width="${W}" height="${H - 1350}" fill="#14161E"/>`;
  return g;
}
function card3(x, y, sc, icon, txt) { return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}"><rect x="-430" y="-110" width="860" height="220" rx="34" fill="#2A1C12" fill-opacity=".85" stroke="${GOLD}" stroke-width="5"/><g transform="translate(-320,0)">${icon}</g><text x="-180" y="20" font-size="58" font-weight="700" fill="#FFF3D6">${txt}</text></g>`; }

// ================= SCENES =================
const PHOTOS = { sajdah: { w: 1284, h: 848 }, dua: { w: 1284, h: 726 } };
const SCENES = [
  { from: 1, dark: true, draw(t, lt) { // O Muslim, stop a moment
      const stop = lp(1, .45), frozen = t > stop;
      let s = cityDark(t);
      for (let i = 0; i < 4; i++) { const tt = frozen ? stop : t; s += walker(((i * 300 + tt * 160) % 1400) - 160, 1640, .95, frozen ? stop : t, { seed: i, col: ['#5C6B80', '#3A4256', '#6E5A48', '#4A5368'][i], skin: '#9E6E4C', beard: '#2A2220' }); }
      if (frozen) { const f = eo(prog(t, stop, .5)); s += `<rect width="${W}" height="${H}" fill="#000" opacity="${.45 * f}"/><circle cx="540" cy="1000" r="${lerp(900, 420, f)}" fill="none" stroke="${GOLD}" stroke-width="6" opacity="${f * .6}"/>`; }
      s += bigText(760, 'হে মুসলিম!', 130, '#FFF3D6', fadeUp(t, L(1).s + .05, .4), (1 - fadeUp(t, L(1).s, .4)) * 30);
      s += bigText(930, 'একটু থামুন…!', 110, GOLD, fadeUp(t, stop - .1, .4));
      return s;
  } },
  { from: 2, dark: true, draw(t, lt) { // another Friday may never come
      let s = bgWarm(t);
      const p = clamp(lt / (L(2).e - L(2).s + .5));
      s += hourglass(540, 820, 1.35, p, t);
      const hb = Math.max(0, Math.sin(t * 7.2)) ** 6;
      s += `<circle cx="540" cy="820" r="${360 + hb * 30}" fill="none" stroke="${C.coral}" stroke-width="4" opacity="${.15 + hb * .3}"/>`;
      s += pill(540, 330, 'আরেকটি শুক্রবার?', '#2A1C12', GOLD, pop(t, lp(2, .45), .45), 48);
      return s;
  } },
  { from: 3, xf: true, dark: true, draw(t, lt) { // the Lord who keeps you alive; are you ready to answer His call
      let s = skyDawn(t) + zoomG(540, 1300, 1 + lt * .02, mosque(540, 1350, .85, { dusk: true }) + `<rect y="1350" width="${W}" height="${H - 1350}" fill="#3A2A20"/>`);
      for (let i = 0; i < 4; i++) { const q = (t * .45 + i / 4) % 1; s += `<circle cx="${540 + 380 * .85}" cy="${1350 - 900 * .85}" r="${30 + q * 520}" fill="none" stroke="#FFF3D6" stroke-width="${6 * (1 - q)}" opacity="${(1 - q) * .55}"/>`; }
      s += pill(540, 330, 'আপনি কতটা প্রস্তুত?', '#2A1C12cc', GOLD, pop(t, lp(3, .6), .45), 46);
      return s;
  } },
  { from: 4, xf: true, dark: true, draw(t, lt) { // today is Friday, the blessed day of Jumu'ah
      let s = skyDawn(t + 20) + `<rect width="${W}" height="${H}" fill="#F4A261" opacity=".12"/>`;
      s += zoomG(540, 1400, 1.05 + lt * .03, mosque(540, 1450, 1.0) + `<rect y="1450" width="${W}" height="${H - 1450}" fill="#C9A77A"/>`);
      s += `<g opacity="${fadeUp(t, L(4).s, .5)}">${crescent(540, 300, 1.3)}</g>`;
      s += bigText(560, 'আজ শুক্রবার', 120, '#FFF6E0', fadeUp(t, L(4).s + .05, .5));
      s += bigText(700, 'পবিত্র জুমার দিন', 96, GOLD, fadeUp(t, lp(4, .45), .5));
      return s;
  } },
  { from: 5, dark: true, draw(t, lt) { // leaving the week's busyness, Muslims hurry to the House of Allah
      let s = skyDawn(t + 30) + mosque(760, 1300, .62) + `<rect y="1300" width="${W}" height="${H - 1300}" fill="#C9A77A"/><path d="M0,1500 L1080,1360 L1080,1420 L0,1640Z" fill="#E2C9A0"/>`;
      const fadeCity = eo(prog(lt, .2, 2));
      s += `<g opacity="${1 - fadeCity * .85}"><rect x="-20" y="900" width="180" height="420" fill="#5A5A66"/><rect x="150" y="1000" width="140" height="320" fill="#6A6A76"/></g>`;
      const cols = ['#FBFAF6', '#E6EEF5', '#F0E6D2', '#FFFFFF', '#EAE4F2', '#F6F2EA'];
      for (let i = 0; i < 6; i++) { const st = i * .35, x = -120 + ((lt - st) * 120) + i * 60; if (lt < st) continue; s += walker(Math.min(x, 600 + i * 30), 1560 - i * 14, .8 - i * .03, t, { seed: i, col: cols[i], beard: i % 3 === 2 ? '#D9D6D0' : '#1B1513' }); }
      s += pill(760, 520, 'আল্লাহর ঘর', '#2A1C12cc', GOLD, pop(t, lp(5, .55), .45), 44);
      return s;
  } },
  { from: 6, xf: true, dark: true, draw(t, lt) { // some with grief, some with want, some with countless unspoken pains
      let s = bgWarm(t);
      const P = [[200, lp(6, 0), 'sad', 'দুঃখ'], [540, lp(6, .33), 'poor', 'অভাব'], [880, lp(6, .62), 'elder', 'না বলা কষ্ট']];
      P.forEach(([x, a, k, lab], i) => {
        const p = fadeUp(t, a, .6);
        s += `<g opacity="${p}" transform="translate(0,${(1 - p) * 60})"><ellipse cx="${x}" cy="980" rx="170" ry="300" fill="${GOLDL}" opacity=".08"/>${person({ kind: k, x, y: 960, s: .62, expr: k === 'elder' ? 'worried' : 'sad', look: [0, .6], blink: blinkAt(t, i + 2), tear: k === 'sad' ? 1 : 0, t })}</g>`;
        s += pill(x, 1340, lab, '#2A1C12', GOLD, pop(t, a + .2, .4), 40);
      });
      return s;
  } },
  { from: 7, xf: true, dark: true, photo: { src: 'sajdah', z: [1.0, 1.12], f: [.5, .55] }, draw(t, lt) { // sajdah: original photo
      let s = dust(t, 30, [0, 300, 1080, 1300]);
      s += pill(540, 330, 'একই আশ্রয়', '#2A1C12cc', GOLD, pop(t, lp(7, .55), .45), 48);
      return s;
  } },
  { from: 8, dark: true, draw(t, lt) { // people may forget you, but no pain of yours is unknown to Allah
      const mid = lp(8, .5);
      let s = `<rect width="${W}" height="${H}" fill="#14121A"/>`;
      if (t < mid) {
        for (let i = 0; i < 5; i++) { const x = ((i * 260 + lt * 200) % 1400) - 160; s += `<g opacity=".35">${walker(x, 1560, .85, t, { seed: i, col: '#4A4A55', skin: '#6E5A48', beard: '#2A2220' })}</g>`; }
        s += person({ kind: 'sad', x: 540, y: 1000, s: 1.1, expr: 'sad', look: [0, .7], blink: blinkAt(t, 3) });
      } else {
        const f = fadeUp(t, mid, .8);
        s += `<g opacity="${f}">${lightRays(540, -60, 6, 30, 1800, .6, t)}</g><rect width="${W}" height="${H}" fill="${GOLDL}" opacity="${f * .06}"/>`;
        s += person({ kind: 'sad', x: 540, y: 1000, s: 1.1, expr: f > .5 ? 'calm' : 'sad', look: [0, -1 * f], blink: blinkAt(t, 3) });
        s += dust(t, 30);
      }
      return s;
  } },
  { from: 9, xf: true, dark: true, photo: { src: 'dua', z: [1.0, 1.35], f: [.55, .38] }, draw(t, lt) { // tears & silent crying: dua photo, slow push to the face
      return dust(t, 34, [0, 300, 1080, 1200]);
  } },
  { from: 10, xf: true, dark: true, draw(t, lt) { // don't let this Friday pass in neglect
      let s = bgWarm(t);
      s += hourglass(540, 860, 1.2, clamp(.6 + lt * .15), t * 3);
      for (let i = 0; i < 5; i++) { const q = prog(lt, i * .3, 1.4); if (q <= 0 || q >= 1) continue; s += `<g transform="translate(${300 + i * 120 + q * 300},${600 + q * 700}) rotate(${q * 120})" opacity="${1 - q}"><rect x="-60" y="-70" width="120" height="140" rx="10" fill="#FFF6E0"/><rect x="-60" y="-70" width="120" height="30" rx="8" fill="${C.coral}"/></g>`; }
      const p = pop(t, lp(10, .5), .45);
      s += `<g transform="translate(540,1350) scale(${p})" opacity="${clamp(p)}"><rect x="-230" y="-60" width="460" height="120" rx="60" fill="#2A1C12" stroke="${C.coral}" stroke-width="5"/><text x="30" y="18" text-anchor="middle" font-size="52" font-weight="700" fill="#FFF3D6">অবহেলা নয়</text><g transform="translate(-170,0) scale(.8)"><circle r="40" fill="${C.coral}"/><path d="M-16,-16 L16,16 M16,-16 L-16,16" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g></g>`;
      return s;
  } },
  { from: 11, dark: true, draw(t, lt) { // pray Jumu'ah, send much durood, recite the Quran
      let s = bgWarm(t);
      const a = pop(t, lp(11, 0), .45), b = pop(t, lp(11, .42), .45), c = pop(t, lp(11, .76), .45);
      s += card3(540, 500, a, `<g transform="scale(.22) translate(0,380)">${mosque(0, 0, 1, {})}</g>`, 'জুমার নামাজ');
      s += card3(540, 800, b, tasbih(0, 0, .75), 'দরুদ পাঠ');
      s += card3(540, 1100, c, quranRehal(0, 0, .42, t), 'কোরআন তিলাওয়াত');
      return s;
  } },
  { from: 12, xf: true, dark: true, photo: { src: 'dua', z: [1.12, 1.22], f: [.6, .45] }, draw(t, lt) { // seek forgiveness: dua photo
      let s = dust(t, 24, [0, 300, 1080, 1200]);
      s += pill(540, 330, 'ক্ষমা চান', '#2A1C12cc', GOLD, pop(t, lp(12, .3), .45), 52);
      return s;
  } },
  { from: 13, xf: true, dark: true, draw(t, lt) { // never despair of Allah's mercy
      let s = skyDawn(t + 40);
      s += `<path d="M0,1300 Q270,1240 540,1290 T1080,1270 V1920 H0Z" fill="#6E9E5A"/><path d="M0,1400 Q300,1350 600,1390 T1080,1380 V1920 H0Z" fill="#5A8A4A"/>`;
      for (let i = 0; i < 4; i++) s += `<ellipse cx="${200 + i * 230}" cy="${400 + (i % 2) * 60}" rx="200" ry="70" fill="#FFF6E0" opacity=".6"/>`;
      s += lightRays(540, 300, 7, 60, 1400, .45, t);
      for (let i = 0; i < 40; i++) { const x = (i * 97) % 1080, y = 480 + ((i * 131 + t * 300) % 900); s += `<path d="M${x},${y} l-4,26" stroke="#E6F6FF" stroke-width="4" opacity=".55" stroke-linecap="round"/>`; }
      const f = fadeUp(t, lp(13, .2), .6);
      s += bigText(800, 'রহমত', 150, GOLD, f);
      return s;
  } },
  { from: 14, xf: true, dark: true, draw(t, lt) { // a question for you
      let s = bgWarm(t);
      const p = pop(lt, .05, .5);
      s += `<g transform="translate(540,880) scale(${p})" opacity="${clamp(p)}"><circle r="260" fill="${GOLD}" opacity=".12"/><text y="140" text-anchor="middle" font-size="420" font-weight="700" fill="${GOLD}">?</text></g>`;
      s += bigText(1320, 'একটি প্রশ্ন…', 80, '#FFF3D6', fadeUp(t, lp(14, .3), .5));
      return s;
  } },
  { from: 15, dark: true, draw(t, lt) { // in the hardest times, when all doors seem shut, whom do you ask?
      let s = `<rect width="${W}" height="${H}" fill="#14121A"/>`;
      [[220, .05], [540, .25], [860, .45]].forEach(([x, f]) => s += door(x, 820, .78, eio(prog(t, lp(15, f), .5))));
      s += person({ kind: 'sad', x: 540, y: 1180, s: .8, expr: 'sad', look: [0, -.6], blink: blinkAt(t, 3) });
      const q = pop(t, lp(15, .72), .45);
      s += pill(540, 330, 'কার কাছে?', '#2A1C12', GOLD, q, 52);
      return s;
  } },
  { from: 16, dark: true, draw(t, lt) { // to people, or to Allah alone?
      let s = `<rect width="${W}" height="${H}" fill="#14121A"/>`;
      const a = fadeUp(t, L(16).s, .5), b = fadeUp(t, lp(16, .38), .6);
      s += `<g opacity="${a}"><rect x="60" y="500" width="440" height="760" rx="30" fill="#24222C"/>${[0, 1, 2].map(i => walker(170 + i * 110, 1120, .65, 0, { seed: i, col: '#5C5C68', skin: '#6E5A48', beard: '#2A2220' })).join('')}<text x="280" y="1210" text-anchor="middle" font-size="48" font-weight="700" fill="#B9B9C4">মানুষের কাছে</text></g>`;
      s += `<g opacity="${b}"><rect x="580" y="500" width="440" height="760" rx="30" fill="#2A1C12" stroke="${GOLD}" stroke-width="6"/>${lightRays(800, 520, 4, 30, 640, .7, t)}<circle cx="800" cy="780" r="${110 + 8 * Math.sin(t * 2)}" fill="${GOLDL}" opacity=".35"/>${crescent(800, 780, 1.2)}<text x="800" y="1150" text-anchor="middle" font-size="44" font-weight="700" fill="${GOLD}">একমাত্র</text><text x="800" y="1210" text-anchor="middle" font-size="44" font-weight="700" fill="${GOLD}">আল্লাহর কাছে</text></g>`;
      return s;
  } },
  { from: 17, xf: true, dark: true, draw(t, lt) { // write your answer in comments: A / B
      let s = bgWarm(t);
      s += bigText(420, 'আপনার উত্তর', 84, '#FFF3D6', fadeUp(t, L(17).s, .5));
      s += bigText(530, 'কমেন্টে লিখুন', 84, GOLD, fadeUp(t, lp(17, .4), .5));
      const A = pop(t, L(18).s, .45), B = pop(t, lp(18, .4), .45);
      s += `<g transform="translate(540,820) scale(${A})" opacity="${clamp(A)}"><rect x="-440" y="-90" width="880" height="180" rx="40" fill="#24222C" stroke="#9AA6BF" stroke-width="5"/><circle cx="-340" r="56" fill="#9AA6BF"/><text x="-340" y="24" text-anchor="middle" font-size="68" font-weight="700" fill="#14121A">A</text><text x="-250" y="22" font-size="56" font-weight="700" fill="#E6E6EE">মানুষের কাছে</text></g>`;
      s += `<g transform="translate(540,1060) scale(${B})" opacity="${clamp(B)}"><rect x="-440" y="-90" width="880" height="180" rx="40" fill="#2A1C12" stroke="${GOLD}" stroke-width="6"/><circle cx="-340" r="56" fill="${GOLD}"/><text x="-340" y="24" text-anchor="middle" font-size="68" font-weight="700" fill="#2A1C12">B</text><text x="-250" y="-6" font-size="50" font-weight="700" fill="${GOLD}">একমাত্র মহান</text><text x="-250" y="56" font-size="50" font-weight="700" fill="${GOLD}">আল্লাহর কাছে</text></g>`;
      const c = pop(t, L(18).e - .6, .4);
      s += `<g transform="translate(540,1330) scale(${c})" opacity="${clamp(c)}"><rect x="-200" y="-56" width="400" height="112" rx="56" fill="${C.teal}"/><path d="M-150,-20 h56 a12,12 0 0 1 12,12 v28 a12,12 0 0 1 -12,12 h-30 l-16,14 v-14 h-10 a12,12 0 0 1 -12,-12 v-28 a12,12 0 0 1 12,-12z" fill="#fff"/><text x="40" y="18" text-anchor="middle" font-size="46" font-weight="700" fill="#fff">কমেন্ট</text></g>`;
      return s;
  } },
  { from: 19, xf: true, dark: true, draw(t, lt) { // who knows if we'll live till next Friday
      let s = `<rect width="${W}" height="${H}" fill="url(#gSunset)"/>`;
      const sun = lerp(1180, 1330, clamp(lt / 4));
      s += `<circle cx="540" cy="${sun}" r="170" fill="#FF9F5A" opacity=".85"/>` + mosque(540, 1360, .7, { lit: true }) + `<rect y="1360" width="${W}" height="${H - 1360}" fill="#2A1A18"/>`;
      s += hourglass(860, 520, .6, clamp(.85 + lt * .03), t);
      const hb = Math.max(0, Math.sin(t * 6)) ** 6;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${.08 + hb * .08}"/>`;
      return s;
  } },
  { from: 20, xf: true, dark: true, draw(t, lt) { // while there is breath, let us try to return to Allah's path
      let s = skyDawn(t + 50) + mosque(540, 1150, .6) + `<rect y="1150" width="${W}" height="${H - 1150}" fill="#C9A77A"/>`;
      s += `<path d="M380,${H} L500,1150 L580,1150 L700,${H}Z" fill="#E8D2A8"/>` + lightRays(540, 700, 5, 26, 1400, .3, t);
      const p = clamp(lt / (L(20).e - L(20).s + .5));
      s += walker(540, lerp(1820, 1500, p), lerp(1.2, .8, p), t, { seed: 1 });
      s += pill(540, 330, 'ফিরে আসার পথ', '#2A1C12cc', GOLD, pop(t, lp(20, .55), .45), 46);
      return s;
  } },
  { from: 21, xf: true, dark: true, photo: { src: 'dua', z: [1.25, 1.0], f: [.5, .45] }, draw(t, lt) { // may Allah forgive us all: dua photo, slow pull back
      return dust(t, 30, [0, 300, 1080, 1200]);
  } },
  { from: 22, dark: true, photo: { src: 'dua', z: [1.0, 1.04], f: [.5, .45], dim: .55 }, draw(t, lt) { // Ameen
      const p = pop(lt, 0, .45);
      return `<g transform="translate(540,1250) scale(${p})" opacity="${clamp(p)}"><circle r="200" fill="${GOLDL}" opacity=".1"/></g>` + bigText(1290, 'আমিন', 170, GOLD, clamp(p));
  } },
  { from: 23, dark: true, draw(t, lt) { // Jumu'ah Mubarak + end card
      let s = skyNight(t) + mosque(540, 1720, .62, { lit: true }) + `<rect y="1720" width="${W}" height="${H - 1500}" fill="#141824"/>`;
      s += `<g transform="translate(540,300) scale(${pop(lt, 0, .5)})">${crescent(0, 0, 1.1)}</g>`;
      s += bigText(560, 'জুমা মোবারক', 132, GOLD, fadeUp(t, L(23).s, .4), (1 - fadeUp(t, L(23).s, .4)) * 30);
      const b = fadeUp(t, L(23).s + .8, .4);
      s += `<g opacity="${b}"><text x="540" y="700" text-anchor="middle" font-size="52" font-weight="700" fill="#FFF3D6">${BRAND}</text></g>`;
      const p = pop(t, L(23).s + 1.0, .4), clicked = t > L(23).s + 1.6;
      s += `<g transform="translate(540,830) scale(${p * (t > L(23).s + 1.45 && t < L(23).s + 1.6 ? .92 : 1)})" opacity="${clamp(p)}"><rect x="${clicked ? -270 : -200}" y="-54" width="${clicked ? 540 : 400}" height="108" rx="54" fill="${clicked ? '#fff' : GOLD}"/><text y="18" text-anchor="middle" font-size="48" font-weight="700" fill="#2A1C12">${clicked ? '✓ ফলো করা হয়েছে' : '+ ফলো করুন'}</text></g>`;
      const c = eo(prog(t, L(23).s + 1.05, .4));
      if (c > 0) s += `<g transform="translate(${lerp(820, 600, c)},${lerp(1050, 850, c)})">${cursor()}</g>`;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${eo(prog(t, L(23).e + 1.1, .5))}"/>`;
      return s;
  } }
];

function sceneStart(i) { return i === 0 ? 0 : Math.max(0, L(SCENES[i].from).s - .08); }
function sceneAt(t) { let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= sceneStart(i)) k = i; return k; }
const DEFS = `<defs>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0"/></filter>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".65"/></radialGradient>
<linearGradient id="gRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3A3" stop-opacity=".9"/><stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/></linearGradient>
<linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2818"/><stop offset="1" stop-color="#6E5236"/></linearGradient>
<linearGradient id="gDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3A6A"/><stop offset=".55" stop-color="#E89A6A"/><stop offset="1" stop-color="#FFD9A0"/></linearGradient>
<linearGradient id="gSunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1A3A"/><stop offset=".5" stop-color="#8A3A4A"/><stop offset="1" stop-color="#E8834A"/></linearGradient>
<linearGradient id="gNightJ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1028"/><stop offset="1" stop-color="#1E2A4A"/></linearGradient>
<linearGradient id="gWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E140E"/><stop offset="1" stop-color="#3A2616"/></linearGradient>
<linearGradient id="gTopDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset=".3" stop-color="#000" stop-opacity="0"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity=".3"/></filter>
</defs>`;
function frameSVG(t) {
  _pid = 0;
  const k = sceneAt(t), sc = SCENES[k], st = sceneStart(k), lt = t - st;
  let body = sc.draw(t, lt);
  if (sc.xf && k > 0 && lt < .5) {
    const pv = SCENES[k - 1], pb = pv.draw(st, st - sceneStart(k - 1)), p = eio(lt / .5);
    if (sc.photo && !pv.photo) body = `<g opacity="${1 - p}">${pb}</g>` + `<g opacity="${p}">${body}</g>`;   // photo fades in underneath
    else body = pb + `<g opacity="${p}">${body}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${DEFS}${body}${vignette(.55)}${grain(.05)}${brandTag(true)}</svg>`;
}
function photoState(t) {
  const k = sceneAt(t), sc = SCENES[k], st = sceneStart(k), lt = t - st;
  const dur = (k + 1 < SCENES.length ? sceneStart(k + 1) : st + 3) - st;
  if (sc.photo) { const fade = sc.xf && k > 0 && !SCENES[k - 1].photo ? eio(lt / .5) : 1; return { ...sc.photo, op: fade, p: clamp(lt / dur) }; }
  if (sc.xf && k > 0 && SCENES[k - 1].photo && lt < .5) { const pv = SCENES[k - 1]; return { ...pv.photo, op: 1 - eio(lt / .5), p: 1 }; }
  return null;
}
function updatePhoto(t) {
  const ps = photoState(t);
  for (const n of Object.keys(PHOTOS)) {
    const g = document.getElementById('pg_' + n);
    if (!ps || ps.src !== n) { g.setAttribute('opacity', 0); continue; }
    const meta = PHOTOS[n], h = 1080 * meta.h / meta.w, top = 860 - h / 2;
    const z = lerp(ps.z[0], ps.z[1], eio(ps.p)), cx = 1080 * ps.f[0], cy = top + h * ps.f[1];
    document.getElementById('pw_' + n).setAttribute('transform', `translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`);
    g.setAttribute('opacity', ps.op * (ps.dim ? 1 - ps.dim * .5 : 1));
  }
}
function subAt(t) {
  for (let i = 1; i <= LINES.length; i++) {
    const l = L(i), next = LINES[i] ? LINES[i].s : l.e + .4, end = Math.min(next - .02, l.e + .35);
    if (t >= l.s - .05 && t < end) return HIDE_SUB.has(i) ? null : { i, p: clamp((t - l.s + .05) / .2) };
  }
  return null;
}
function renderFrame(t) {
  updatePhoto(t);
  document.getElementById('stage').innerHTML = frameSVG(t);
  const sb = document.getElementById('sub'), s = subAt(t);
  if (!s) { sb.style.opacity = 0; return; }
  if (sb.dataset.i != s.i) { sb.innerHTML = subHTML(s.i); sb.dataset.i = s.i; }
  sb.style.opacity = s.p; sb.style.transform = `translateX(-50%) scale(${.94 + .06 * eo(s.p)})`;
}
