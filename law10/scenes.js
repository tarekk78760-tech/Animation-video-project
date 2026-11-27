// ===== Law 10 – Infection: the roommate (TR Universe 0.1) =====
const W = 1080, H = 1920;
const BRAND = 'TR Universe 0.1';
const SUB = [
  'সাকিবের কোনো *শত্রু* ছিল না।',
  'তবু তার ~স্বপ্ন শেষ~ করে দিল তার *রুমমেট*,',
  '*একটাও খারাপ কাজ* না করে।',
  '*ঢাকার* এক মেসে থাকে সাকিব।',
  'চাকরির জন্য *দিনরাত* পড়ে।',
  'রুমমেট *মিঠু* ঠিক উল্টো।',
  'সারাদিন শুধু ~অভিযোগ~।',
  '“এই দেশে ~কিছু হবে না~।”',
  '“সব ~মামা-খালুর খেলা~।”',
  'সাকিব ভাবল, ওকে *বদলে দেবে*।',
  'কিন্তু *ছয় মাসে* সাকিবের|~পড়া কমতে~ লাগল।',
  'আর *এক বছর পর*|তার মুখেও ~একই কথা~,',
  '“~পড়ে কী হবে?~”',
  '*Robert Greene* তাঁর|*The 48 Laws of Power* বইয়ে|এটাকেই বলেছেন,',
  'Law 10',
  'হতাশা ~সর্দির মতো~ ছড়ায়।',
  'কখন যে আপনাকেও ধরে ফেলে,|~টেরও পাবেন না~।',
  'মানুষের *পাশে থাকুন*,',
  'কিন্তু তার হতাশাকে|নিজের ভেতরে ~জায়গা দেবেন না~।',
  'আপনার আশেপাশে কি এমন কেউ আছে?',
  '*কমেন্টে* লিখুন। আর *ফলো* করে রাখুন।'
];
const HIDE_SUB = new Set([15, 20, 21]);
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
  { from: 1, draw(t, lt) { // Sakib had no enemies
      let s = ROOM(t);
      s += zoomG(540, 1200, 1.12 + lt * .02, studySakib(540, 1240, 1.05, t, { expr: 'smile', label: 'চাকরি', write: true, blink: blinkAt(t, 1) }));
      s += pill(540, 330, 'শত্রু: ০', '#fff', C.ink, pop(lt, .3, .4), 52);
      return s;
  } },
  { from: 2, dark: true, draw(t, lt) { // yet his roommate ended his dream
      let s = bgInk(t);
      const crack = prog(t, lp(2, .45), 1.0);
      s += `<g transform="translate(0,${eio(clamp(crack * 1.2 - .5)) * 900})" opacity="${1 - clamp(crack * 1.4 - .6)}">${dreamBubble(560, 760, 1.4, t, crack)}</g>`;
      s += `<g opacity="${eo(prog(lt, .2, .6))}">${silhouetteP(860, 1500, 1.1, '#3A4256')}<text x="860" y="1240" text-anchor="middle" font-size="120" font-weight="700" fill="#9AA6BF">?</text></g>`;
      s += pill(300, 1250, 'রুমমেট', C.coral, '#fff', pop(t, lp(2, .7), .4), 44);
      return s;
  } },
  { from: 3, draw(t, lt) { // without doing a single bad deed
      let s = bgPaper(t);
      s += person({ kind: 'mithu', x: 540, y: 1000, s: 1.15, expr: 'neutral', look: [0, 0], blink: blinkAt(t, 2), tilt: Math.sin(t * 2) * 2 });
      const icons = ['চুরি', 'মারামারি', 'প্রতারণা'];
      icons.forEach((w, i) => { const p = pop(lt, .1 + i * .25, .35); s += `<g transform="translate(${220 + i * 320},460) scale(${p})" opacity="${clamp(p)}"><rect x="-130" y="-50" width="260" height="100" rx="50" fill="#fff" filter="url(#shadow)"/><text x="20" y="14" text-anchor="middle" font-size="40" font-weight="700" fill="${C.ink}">${w}</text>${crossIcon(-90, 0, .6, C.coral)}</g>`; });
      return s;
  } },
  { from: 4, xf: true, draw(t, lt) { // a mess in Dhaka
      let s = zoomG(540, 1100, 1.0 + lt * .04, dhakaStreet(t));
      const p = eo(prog(lt, .2, .5));
      s += `<g transform="translate(200,${lerp(240, 520, p)})" opacity="${p}"><path d="M0,0 C-60,-60 -60,-150 0,-150 C60,-150 60,-60 0,0Z" fill="${C.coral}"/><circle cy="-100" r="22" fill="#fff"/></g>` + pill(200, 590, 'ঢাকা', C.ink, '#fff', pop(lt, .55, .4), 42);
      return s;
  } },
  { from: 5, xf: true, draw(t, lt) { // studies day and night for a job
      const night = lt > (L(5).e - L(5).s) * .5;
      let s = ROOM(t, { night });
      s += studySakib(540, 1240, 1.05, t, { expr: 'neutral', label: 'চাকরি', write: true, blink: blinkAt(t, 1) });
      s += alarmClock(880, 760, 1.1, t * 30);
      s += pill(270, 760, night ? 'রাত' : 'দিন', night ? C.ink : C.amber, night ? '#fff' : C.ink, 1, 46);
      return s;
  } },
  { from: 6, draw(t, lt) { // roommate Mithu, the opposite
      let s = ROOM(t);
      s += lyingMithu(560, 1300, 1.15, t, { blink: blinkAt(t, 2) });
      s += pill(540, 380, 'মিঠু', C.coral, '#fff', pop(lt, .1, .4), 52);
      return s;
  } },
  { from: 7, draw(t, lt) { // complains all day
      let s = ROOM(t);
      s += lyingMithu(560, 1300, 1.15, t, { expr: 'angry', mouth: .25 + .3 * Math.abs(Math.sin(t * 8)), blink: blinkAt(t, 2) });
      s += grayCloud(420, 760, 1.1, t, eo(prog(lt, .2, .6)));
      return s;
  } },
  { from: 8, draw(t, lt) { // "nothing will happen in this country"
      let s = ROOM(t) + `<rect width="${W}" height="${H}" fill="#3A4050" opacity=".18"/>`;
      s += person({ kind: 'mithu', x: 540, y: 1060, s: 1.35, expr: 'angry', mouth: speakMouth(t, [8, 9]), look: [.3, 0], blink: blinkAt(t, 2) });
      s += grayCloud(540, 440, 1.2, t, 1);
      s += bubbleT(560, 700, 640, 'এই দেশে কিছু হবে না!', '#5E6470', pop(t, L(8).s, .3), 44);
      if (t > L(9).s) s += bubbleT(520, 860, 600, 'সব মামা-খালুর খেলা!', '#5E6470', pop(t, L(9).s, .3), 44, 'right');
      return s;
  } },
  { from: 10, xf: true, draw(t, lt) { // Sakib thought he'd change him
      let s = ROOM(t);
      s += lyingMithu(330, 1360, .85, t, { blink: blinkAt(t, 2) });
      s += person({ kind: 'sakib', x: 780, y: 1000, s: 1.0, expr: 'smile', look: [-1, 0], blink: blinkAt(t, 1) });
      const p = pop(lt, .2, .4);
      s += `<g transform="translate(860,620) scale(${p})" opacity="${clamp(p)}"><circle r="70" fill="#FFE29A" opacity=".5"/><path d="M-30,30 C-50,-10 -40,-56 0,-60 C40,-56 50,-10 30,30Z" fill="#F2C94C"/><rect x="-20" y="30" width="40" height="22" rx="4" fill="#9AA6BF"/></g>`;
      s += `<g transform="translate(${lerp(760, 560, eo(prog(lt, .6, .7)))},1180) rotate(-8)"><rect x="-70" y="-50" width="140" height="100" rx="8" fill="#2A9D8F"/><text y="12" text-anchor="middle" font-size="30" font-weight="700" fill="#fff">বই</text></g>`;
      return s;
  } },
  { from: 11, draw(t, lt) { // in six months Sakib's study dropped
      const p = clamp(lt / (L(11).e - L(11).s + .4));
      let s = satWrap(1 - p * .35, ROOM(t) + lyingMithu(320, 1380, .78, t) + studySakib(760, 1330, .8, t, { expr: 'bored', label: 'চাকরি', books: 5, blink: blinkAt(t, 1), pen: false, openBook: true }));
      s += grayCloud(lerp(320, 640, p), lerp(900, 820, p), lerp(.8, 1.1, p), t, .9);
      s += calendarPage(260, 520, .85, '৬', 'মাস');
      s += meter(500, 460, 480, 1 - p * .65, 'পড়া', p > .5 ? C.coral : C.teal);
      return s;
  } },
  { from: 12, xf: true, draw(t, lt) { // a year later, the same words
      let s = satWrap(.35, ROOM(t, { night: true, fanSpeed: 2 }) + studySakib(540, 1300, .95, t, { expr: 'bored', books: 5, dust: true, openBook: false, lampOn: false, pen: false, look: [0, .3], blink: blinkAt(t, 1) }));
      s += grayCloud(540, 640, 1.4, t, 1);
      s += calendarPage(220, 520, .75, '১', 'বছর', '#6E7480');
      return s;
  } },
  { from: 13, draw(t, lt) { // "what's the point of studying?"
      let s = satWrap(.3, ROOM(t, { night: true, fanSpeed: 2 }));
      s += satWrap(.45, person({ kind: 'sakib', x: 540, y: 1060, s: 1.4, expr: 'bored', mouth: speakMouth(t, [13]), look: [.4, .2], blink: 0 }));
      s += grayCloud(540, 470, 1.3, t, 1) + bubbleT(560, 720, 520, 'পড়ে কী হবে?', '#5E6470', pop(t, L(13).s, .3), 52);
      return s;
  } },
  { from: 14, xf: true, dark: true, draw(t, lt) { // 48 Laws of Power
      const l15 = L(15);
      let s = bgInk(t);
      const up = eo(prog(t, l15.s - .1, .6)), bp = eo(prog(lt, .1, .7));
      s += `<g transform="translate(540,${lerp(900, 430, up)}) scale(${lerp(1, .5, up)}) rotate(${lerp(-6, 0, bp)})" opacity="${bp}"><rect x="-250" y="-340" width="500" height="680" rx="14" fill="#1F3A2E"/><rect x="-250" y="-340" width="40" height="680" rx="8" fill="#16291F"/><rect x="-200" y="-300" width="420" height="600" fill="none" stroke="${C.amber}" stroke-width="4"/><text x="10" y="-180" text-anchor="middle" font-size="30" font-weight="600" fill="${C.amber}" letter-spacing="6">ROBERT GREENE</text><text x="10" y="-40" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">The 48</text><text x="10" y="50" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Laws of</text><text x="10" y="140" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Power</text><rect x="-40" y="200" width="100" height="5" fill="${C.amber}"/></g>`;
      const p = pop(t, l15.s + .1, .45);
      s += `<g transform="translate(540,900) scale(${p})" opacity="${clamp(p)}"><rect x="-170" y="-80" width="340" height="160" rx="24" fill="${C.amber}"/><text y="30" text-anchor="middle" font-size="96" font-weight="700" fill="${C.ink}">LAW 10</text></g>`;
      const q1 = eo(prog(t, lp(15, .3), .5)), q2 = eo(prog(t, lp(15, .6), .5));
      s += `<text x="540" y="${1090 + (1 - q1) * 30}" text-anchor="middle" font-size="64" font-weight="700" fill="${C.coral}" opacity="${q1}">Infection:</text>`;
      s += `<text x="540" y="${1180 + (1 - q2) * 30}" text-anchor="middle" font-size="46" font-weight="600" fill="#fff" opacity="${q2}">Avoid the Unhappy and Unlucky.</text>`;
      if (t > l15.s) for (let i = 0; i < 6; i++) s += virus(150 + i * 160, 1380 + Math.sin(t * 2 + i) * 30, 22, '#6E7480', .5 * q2, t * 40 + i * 30);
      return s;
  } },
  { from: 16, xf: true, dark: true, draw(t, lt) { // despair spreads like a cold
      let s = bgInk(t);
      const cols = ['#9AA6BF', '#9AA6BF', '#9AA6BF', '#9AA6BF'], gray = ['#5A606C', '#6A707C', '#7A8090', '#8A90A0'];
      for (let i = 0; i < 4; i++) { const inf = clamp((lt - i * .35) / .5); s += silhouetteP(170 + i * 250, 1150, .82, inf > .5 ? gray[i] : cols[i]); if (inf > 0 && inf < 1) s += `<circle cx="${170 + i * 250}" cy="1000" r="${80 + inf * 80}" fill="none" stroke="#8A94A6" stroke-width="5" opacity="${1 - inf}"/>`; }
      for (let i = 0; i < 9; i++) { const q = (lt * .7 + i / 9) % 1; s += virus(120 + q * 840, 820 + Math.sin(i * 2 + t * 3) * 80, 18 + (i % 3) * 6, '#7A808C', .8, t * 60); }
      s += pill(540, 500, 'হতাশা = সর্দি', '#2E3440', '#fff', pop(lt, .3, .4), 48);
      return s;
  } },
  { from: 17, dark: true, draw(t, lt) { // it catches you without you noticing
      const p = clamp(lt / (L(17).e - L(17).s + .3));
      let s = bgInk(t);
      s += `<rect x="290" y="420" width="500" height="900" rx="250" fill="#1B2440" stroke="#9AA6BF" stroke-width="10"/>`;
      s += satWrap(1 - p * .85, person({ kind: 'sakib', x: 540, y: 950, s: 1.15, expr: p > .6 ? 'bored' : 'neutral', look: [0, 0], blink: blinkAt(t, 1) }));
      for (let i = 0; i < 6; i++) { const a = i * 60 + t * 40; s += virus(540 + Math.cos(a * .0174) * (320 - p * 120), 900 + Math.sin(a * .0174) * (320 - p * 120), 20, '#7A808C', .7, a); }
      return s;
  } },
  { from: 18, xf: true, draw(t, lt) { // stay beside people
      let s = bgPaper(t);
      s += person({ kind: 'mithu', x: 360, y: 1000, s: 1.0, expr: 'sad', look: [.6, 0], blink: blinkAt(t, 2) });
      s += person({ kind: 'sakib', x: 740, y: 1000, s: 1.0, expr: 'smile', look: [-.6, 0], blink: blinkAt(t, 1) });
      s += `<path d="M640,1140 C580,1120 520,1110 470,1120" stroke="#5B8DC9" stroke-width="44" stroke-linecap="round" fill="none"/><ellipse cx="460" cy="1122" rx="30" ry="20" fill="#B8805A"/>`;
      s += `<g opacity="${eo(prog(lt, .3, .4))}">${heartIcon(550, 560, 3, C.coral)}</g>`;
      return s;
  } },
  { from: 19, draw(t, lt) { // but don't let their despair inside
      const sh = eo(prog(lt, .4, .6));
      let s = bgPaper(t);
      s += satWrap(.5, person({ kind: 'mithu', x: 300, y: 1060, s: .9, expr: 'bored', look: [.6, 0], blink: blinkAt(t, 2) }));
      s += grayCloud(300, 600, .9, t, 1);
      for (let i = 0; i < 5; i++) { const q = (lt * .8 + i / 5) % 1; const x = lerp(380, 560, q); s += virus(x, 700 + i * 40, 16, '#7A808C', q < .8 ? .8 : (1 - q) * 4, t * 60); }
      s += `<g opacity="${sh}">${shieldIcon(600, 820, 1.4, C.teal)}<ellipse cx="800" cy="900" rx="${200 + 10 * Math.sin(t * 3)}" ry="380" fill="#FFE29A" opacity=".18"/></g>`;
      s += studySakib(800, 1300, .62, t, { expr: 'smile', label: 'চাকরি', write: true, blink: blinkAt(t, 1) });
      return s;
  } },
  { from: 20, xf: true, draw(t, lt) { // is there someone like this around you?
      let s = bgPaper(t);
      const a = eo(prog(lt, .05, .5));
      s += `<g opacity="${a}" transform="translate(0,${(1 - a) * 30})"><text x="540" y="400" text-anchor="middle" font-size="68" font-weight="700" fill="${C.ink}">আপনার আশেপাশে কি</text><text x="540" y="495" text-anchor="middle" font-size="68" font-weight="700" fill="${C.ink}">এমন <tspan fill="${C.coral}">কেউ</tspan> আছে?</text></g>`;
      s += person({ kind: 'mithu', x: 540, y: 1150, s: 1.15, expr: 'smirk', look: [0, 0], blink: blinkAt(t, 2) }) + grayCloud(540, 640, .9, t, .9);
      return s;
  } },
  { from: 21, dark: true, draw(t, lt) { // comment & follow — end card with brand
      let s = bgInk(t);
      const c = pop(lt, 0, .4);
      s += `<g transform="translate(540,420) scale(${c})" opacity="${clamp(c)}"><rect x="-260" y="-58" width="520" height="116" rx="58" fill="${C.teal}"/><path d="M-200,-22 h60 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-34 l-16,14 v-14 h-10 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12z" fill="#fff"/><text x="30" y="18" text-anchor="middle" font-size="50" font-weight="700" fill="#fff">কমেন্টে লিখুন</text></g>`;
      s += `<g transform="translate(540,800) scale(${pop(lt, .3, .5)})">${orbitLogo(t, 120)}</g>`;
      const b = eo(prog(lt, .5, .5));
      s += `<g opacity="${b}"><text x="540" y="1060" text-anchor="middle" font-size="96" font-weight="700" fill="#fff">${BRAND}</text><text x="540" y="1140" text-anchor="middle" font-size="40" font-weight="500" fill="#ffffffaa">গল্পে গল্পে জীবনের কৌশল</text></g>`;
      const p = pop(lt, .9, .45), clicked = lt > 1.75;
      s += `<g transform="translate(540,1320) scale(${p * (lt > 1.6 && lt < 1.75 ? .92 : 1)})" opacity="${clamp(p)}"><rect x="${clicked ? -290 : -210}" y="-62" width="${clicked ? 580 : 420}" height="124" rx="62" fill="${clicked ? '#fff' : C.amber}"/><text y="20" text-anchor="middle" font-size="54" font-weight="700" fill="${C.ink}">${clicked ? '✓ ফলো করা হয়েছে' : '+ ফলো করুন'}</text></g>`;
      const k = eo(prog(lt, 1.1, .5)); if (k > 0) s += `<g transform="translate(${lerp(820, 600, k)},${lerp(1540, 1340, k)})">${cursor()}</g>`;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${eo(prog(t, LINES[LINES.length - 1].e + 1.0, .6))}"/>`;
      return s;
  } }
];

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
