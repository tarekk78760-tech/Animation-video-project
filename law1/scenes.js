// ===== Law 1 – Never Outshine the Master (Fouquet & Louis XIV) · TR Universe 0.1 =====
const W = 1080, H = 1920;
const BRAND = 'TR Universe 0.1';

const SUB = [
  'রাজাকে খুশি করতে সে ইতিহাসের|সবচেয়ে *জমকালো পার্টি* দিল।',
  '*তিন সপ্তাহ পর* সেই রাজাই|তাকে ~জেলে~ পাঠালেন।',
  '*১৬৬১ সাল, ফ্রান্স।*',
  'দেশের অর্থমন্ত্রী *নিকোলাস ফুকে*।',
  '*ধনী*, *বুদ্ধিমান*, সবাই তাঁকে পছন্দ করে।',
  'তিনি চাইলেন তরুণ রাজা *চতুর্দশ লুই*|তাঁর ওপর খুশি হোন।',
  'তাই নিজের *নতুন প্রাসাদে*',
  'রাজার সম্মানে *বিশাল এক পার্টি* দিলেন।',
  'সে রাতে কী ছিল না!',
  '*বিশাল বাগান*, *ঝর্ণা*, *দামি খাবার*,',
  '*নতুন নাটক*, আকাশজুড়ে *আতশবাজি*।',
  'অতিথিরা *মুগ্ধ*।',
  'সবার মুখে একটাই নাম, *ফুকে*।',
  'কিন্তু রাজা ~হাসছিলেন না~।',
  'তিনি দেখছিলেন, তাঁর মন্ত্রীর প্রাসাদ|রাজার প্রাসাদের চেয়েও *সুন্দর*।',
  'তাঁর মন্ত্রীর পার্টি|রাজার পার্টির চেয়েও *জমকালো*।',
  'আর সবাই প্রশংসা করছে|রাজাকে না, *মন্ত্রীকে*।',
  'ঠিক তিন সপ্তাহ পর ফুকে ~গ্রেপ্তার~ হলেন।',
  'অভিযোগ, ~রাষ্ট্রের টাকা আত্মসাৎ~।',
  'জীবনের শেষ প্রায় *উনিশ বছর*|তিনি কাটালেন ~কারাগারে~।',
  'ইতিহাসবিদরা বলেন, এর পেছনে|*আর্থিক অনিয়মের অভিযোগ*',
  'আর দরবারের শত্রুদের *ষড়যন্ত্রও* ছিল।',
  'কিন্তু *Robert Greene* বলেন,',
  '*আসল আগুনটা* জ্বলেছিল|সেই পার্টির রাতেই।',
  'ফুকে ভেবেছিলেন,|তিনি রাজাকে *সম্মান* দেখাচ্ছেন।',
  'আসলে তিনি রাজাকে|নিজের সামনে ~ছোট~ করে ফেলেছিলেন।',
  'Greene তাঁর *The 48 Laws of Power* বইয়ের',
  'একদম *প্রথম নিয়মেই* এটা বলেছেন,',
  'Law 1: Never Outshine the Master.',
  'যার অধীনে আছেন,|তাঁকে কখনো ছাপিয়ে যাবেন না।',
  'ক্ষমতায় থাকা মানুষ সবচেয়ে বেশি ভয় পায়|~নিজের জায়গা হারানোকে~।',
  'আপনার সাফল্য যদি তাঁকে *ছোট মনে করায়*,',
  'সেই সাফল্যই আপনার ~বিপদ~ হয়ে দাঁড়ায়।',
  'অফিসে বা যেকোনো জায়গায়|নিজের *মেধা* দেখান।',
  'কিন্তু এমনভাবে, যেন ওপরের মানুষটা|নিজেকে *আরও শক্তিশালী* মনে করেন,',
  '~হুমকির মুখে~ না।',
  'আপনি কি কখনো ভালো কাজ করেও|বসের চোখে খারাপ হয়েছেন?',
  '*কমেন্টে* লিখুন।',
  'আর এমন গল্প পেতে *ফলো* করে রাখুন।'
];
const HIDE_SUB = new Set([3, 29, 30, 37, 38, 39]);

const L = i => LINES[i - 1];
const lp = (i, f) => L(i).s + (L(i).e - L(i).s) * f;
function subHTML(i) { return SUB[i - 1].split('|').map(r => r.replace(/\*(.+?)\*/g, '<b class="a">$1</b>').replace(/~(.+?)~/g, '<b class="c">$1</b>')).join('<br>'); }
function pill(x, y, txt, bg, fg, sc = 1, fs = 44) { const w = txt.length * fs * .52 + 70; return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}"><rect x="${-w / 2}" y="${-fs * .95}" width="${w}" height="${fs * 1.9}" rx="${fs * .95}" fill="${bg}"/><text y="${fs * .36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${fg}">${txt}</text></g>`; }
function zoomG(cx, cy, z, inner) { return `<g transform="translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})">${inner}</g>`; }
function cursor() { return `<path d="M0,0 L0,80 L20,62 L36,98 L52,90 L36,56 L62,56Z" fill="#fff" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`; }
function orbitLogo(t, r) { const a = t * 1.4; return `<circle r="${r * .42}" fill="${C.amber}"/><ellipse rx="${r}" ry="${r * .36}" fill="none" stroke="#fff" stroke-width="${r * .06}" transform="rotate(-24)"/><circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r * .36}" r="${r * .1}" fill="${C.teal}" transform="rotate(-24)"/><text y="${r * .15}" text-anchor="middle" font-size="${r * .38}" font-weight="700" fill="${C.ink}">TR</text>`; }
function brandTag(dark) { return `<g transform="translate(60,96)"><g transform="translate(26,-12)">${orbitLogo(0, 26).replace(/<text.*<\/text>/, '')}</g><text x="70" y="0" font-size="34" font-weight="600" fill="${dark ? '#ffffffd9' : C.ink}" opacity=".92">${BRAND}</text></g>`; }
function heartIcon(x, y, s, col) { return `<path transform="translate(${x},${y}) scale(${s})" d="M0,12 C-22,-6 -30,-22 -16,-30 C-8,-35 0,-28 0,-22 C0,-28 8,-35 16,-30 C30,-22 22,-6 0,12Z" fill="${col}"/>`; }
function crossIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="${col}"/><path d="M-16,-16 L16,16 M16,-16 L-16,16" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>`; }
function checkIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="${col}"/><path d="M-18,0 L-5,14 L20,-14" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
function coin(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="#E8B94A" stroke="#B8862B" stroke-width="6"/><circle r="28" fill="none" stroke="#B8862B" stroke-width="3"/>${fleur(0, 0, .55, '#B8862B')}</g>`; }
function bgNight(t) { let s = `<rect width="${W}" height="${H}" fill="url(#gNight)"/>`; for (let i = 0; i < 30; i++) s += `<circle cx="${(i * 397) % W}" cy="${(i * 613) % 1100}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${.25 + .25 * Math.sin(t * 1.4 + i)}"/>`; return s; }
function bgRoyal(t) { // deep royal blue with gold fleur pattern (dark scenes)
  let s = `<rect width="${W}" height="${H}" fill="url(#gRoyal)"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 6; c++) s += fleur(90 + c * 180 + (r % 2) * 90, 80 + r * 170, .55, '#D9A441').replace('<g ', `<g opacity=".08" `);
  return s;
}
function bgParch(t) { return `<rect width="${W}" height="${H}" fill="#F1E4C4"/><rect width="${W}" height="${H}" fill="url(#gParch)"/><circle cx="${880 + Math.sin(t * .3) * 20}" cy="380" r="420" fill="#D9A441" opacity=".08"/>`; }
function throneRoom(t) {
  let s = `<rect width="${W}" height="${H}" fill="#2B1E3A"/>`;
  s += `<path d="M0,0 H${W} V300 Q${W - 140},700 ${W - 60},1300 L${W},1300 V0Z" fill="#7A1426"/><path d="M0,0 V1300 L60,1300 Q140,700 0,300Z" fill="#7A1426"/>`;
  s += `<path d="M0,0 H${W} V160 Q${W * .75},240 540,200 Q${W * .25},240 0,160Z" fill="#9B1B30"/><path d="M0,160 Q${W * .25},240 540,200 Q${W * .75},240 ${W},160" stroke="#D9A441" stroke-width="10" fill="none"/>`;
  // throne
  s += `<g transform="translate(540,1160)"><path d="M-230,0 L-230,-640 Q-230,-760 0,-800 Q230,-760 230,-640 L230,0Z" fill="#D9A441"/><path d="M-190,-40 L-190,-620 Q-190,-720 0,-750 Q190,-720 190,-620 L190,-40Z" fill="#9B1B30"/>${fleur(0, -660, 1.2, '#D9A441')}<rect x="-270" y="-60" width="540" height="80" rx="20" fill="#B8862B"/></g>`;
  s += `<rect y="1300" width="${W}" height="${H - 1300}" fill="#3A1A2A"/><path d="M380,1300 L700,1300 L860,${H} L220,${H}Z" fill="#8C1C2E"/><path d="M380,1300 L220,${H} M700,1300 L860,${H}" stroke="#D9A441" stroke-width="8"/>`;
  return s;
}
function nameCard(x, y, sc, name, role) {
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}"><rect x="-280" y="-84" width="560" height="168" rx="22" fill="#F8F0DC" stroke="#D9A441" stroke-width="6" filter="url(#shadow)"/><path d="M-260,-64 h520" stroke="#D9A441" stroke-width="2" opacity=".6"/><text x="0" y="-4" text-anchor="middle" font-size="56" font-weight="700" fill="#3A1A16">${name}</text><text x="0" y="50" text-anchor="middle" font-size="32" font-weight="600" fill="#8C1C2E">${role}</text></g>`;
}
function compareBars(x, y, a, b, la, lb, p) {
  return `<g transform="translate(${x},${y})"><text x="-400" y="-20" font-size="38" font-weight="700" fill="#F6EFE4">${la}</text><rect x="-400" y="0" width="800" height="44" rx="22" fill="#ffffff22"/><rect x="-400" y="0" width="${800 * a * p}" height="44" rx="22" fill="#9AA6BF"/>
  <text x="-400" y="120" font-size="38" font-weight="700" fill="${C.amber}">${lb}</text><rect x="-400" y="140" width="800" height="44" rx="22" fill="#ffffff22"/><rect x="-400" y="140" width="${800 * b * p}" height="44" rx="22" fill="${C.amber}"/></g>`;
}

// ================= SCENES =================
const SCENES = [
  { from: 1, dark: true, draw(t, lt) { // hook: grandest party in history
      let s = bgNight(t) + fireworksSky(t, .2, 8);
      s += zoomG(540, 1100, 1.05 + lt * .02, chateau(540, 1150, .9, { night: true }) + frenchGarden(t, { night: true }));
      s += person({ kind: 'fouquet', x: 540, y: 1250, s: 1.05, expr: 'proud', blink: blinkAt(t, 1) });
      s += `<g transform="translate(760,1300) rotate(-20)"><path d="M-22,-80 h44 l-8,50 q-14,12 -28,0z" fill="#D9A441"/><rect x="-4" y="-30" width="8" height="40" fill="#D9A441"/><path d="M-18,-70 h36" stroke="#8C1C2E" stroke-width="10"/></g>`;
      s += pill(540, 300, 'ইতিহাসের সবচেয়ে জমকালো পার্টি', C.amber, C.ink, pop(lt, .4, .45), 40);
      return s;
  } },
  { from: 2, dark: true, draw(t, lt) { // 3 weeks later the king sends him to jail
      let s = prisonCell(t);
      s += person({ kind: 'fouquet', x: 540, y: 1080, s: 1.2, expr: 'sad', look: [0, .6], blink: blinkAt(t, 2) });
      const d = eo(prog(lt, .7, .35));
      s += `<g transform="translate(0,${(d - 1) * H})">${cellBars(1)}</g>`;
      s += pill(540, 300, '৩ সপ্তাহ পর', C.coral, '#fff', pop(lt, .05, .4), 46);
      return s;
  } },
  { from: 3, xf: true, draw(t, lt) { // 1661, France
      let s = bgParch(t);
      // stylised France outline
      const p = eo(prog(lt, .05, .9));
      s += `<path d="M420,620 L560,560 L700,600 L780,700 L760,820 L820,900 L780,1040 L660,1120 L560,1160 L440,1110 L380,1000 L330,900 L360,780 L300,720Z" fill="#D9C8A0" stroke="#8C6A3A" stroke-width="8" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - p}" fill-opacity="${p}"/>`;
      s += `<g opacity="${p}">${fleur(560, 860, 2.4, '#1F3C88')}</g>`;
      const q = pop(lt, .3, .45);
      s += `<g transform="translate(540,1350) scale(${q})" opacity="${clamp(q)}"><text text-anchor="middle" font-size="150" font-weight="700" fill="#3A1A16">১৬৬১</text><text y="90" text-anchor="middle" font-size="60" font-weight="700" fill="#8C1C2E">ফ্রান্স</text></g>`;
      return s;
  } },
  { from: 4, draw(t, lt) { // finance minister Nicolas Fouquet
      let s = bgParch(t);
      for (let i = 0; i < 10; i++) { const q = prog(lt, i * .08, 2); s += `<g opacity="${.25}">${coin(100 + (i * 113) % 900, 300 + ((i * 271) % 900) + q * 60, .9)}</g>`; }
      s += person({ kind: 'fouquet', x: 540, y: 960, s: 1.45, expr: 'smile', blink: blinkAt(t, 1) });
      s += nameCard(540, 380, pop(lt, .15, .45), 'নিকোলাস ফুকে', 'ফ্রান্সের অর্থমন্ত্রী');
      return s;
  } },
  { from: 5, draw(t, lt) { // rich, smart, liked by all
      let s = bgParch(t);
      s += person({ kind: 'fouquet', x: 540, y: 1000, s: 1.2, expr: 'proud', blink: blinkAt(t, 1) });
      const items = [[230, 520, 'ধনী', 0], [540, 380, 'বুদ্ধিমান', .3], [850, 520, 'সবার প্রিয়', .6]];
      items.forEach(([x, y, w, f], i) => {
        const p = pop(t, lp(5, f), .4);
        s += `<g transform="translate(${x},${y}) scale(${p})" opacity="${clamp(p)}"><circle r="92" fill="#F8F0DC" stroke="#D9A441" stroke-width="6" filter="url(#shadow)"/>${i === 0 ? coin(0, -12, .9) : i === 1 ? quill(-30, 40, .4, 10) : heartIcon(0, 6, 2.2, C.coral)}<text y="140" text-anchor="middle" font-size="42" font-weight="700" fill="#3A1A16">${w}</text></g>`;
      });
      return s;
  } },
  { from: 6, xf: true, dark: true, draw(t, lt) { // wanted young King Louis XIV pleased
      let s = throneRoom(t);
      s += person({ kind: 'louis', x: 540, y: 820, s: 1.05, expr: 'proud', blink: blinkAt(t, 3) });
      s += nameCard(540, 1420 - 60, pop(lt, .2, .45), 'রাজা চতুর্দশ লুই', 'ফ্রান্সের তরুণ রাজা');
      const f = pop(t, lp(6, .55), .45);
      s += `<g opacity="${clamp(f)}">${person({ kind: 'fouquet', x: 170, y: 1180, s: .55, expr: 'smile', look: [1, -.5] })}<g transform="translate(300,760) scale(${f})"><ellipse rx="120" ry="80" fill="#fff"/><circle cx="-60" cy="96" r="16" fill="#fff"/><circle cx="-86" cy="132" r="10" fill="#fff"/>${heartIcon(-40, 10, 2, C.coral)}${crown(40, 6, .5)}</g></g>`;
      return s;
  } },
  { from: 7, xf: true, draw(t, lt) { // his new palace
      let s = `<rect width="${W}" height="${H}" fill="url(#gDay)"/>`;
      const p = eio(prog(lt, 0, L(7).e - L(7).s + .4));
      s += `<g transform="translate(0,${lerp(260, 0, p)})">${chateau(540, 1100, lerp(.8, 1, p))}${frenchGarden(t)}${fountain(540, 1560, .9, t)}</g>`;
      s += pill(540, 300, 'ফুকের নতুন প্রাসাদ', '#F8F0DC', '#3A1A16', pop(lt, .3, .4), 42);
      return s;
  } },
  { from: 8, draw(t, lt) { // a huge party in the king's honour
      let s = bgRoyal(t);
      const p = eo(prog(lt, 0, .6));
      s += `<g transform="translate(540,${lerp(1400, 860, p)}) rotate(${lerp(8, -3, p)})">
        <rect x="-340" y="-440" width="680" height="880" rx="18" fill="#F8F0DC" stroke="#D9A441" stroke-width="10"/><rect x="-310" y="-410" width="620" height="820" rx="10" fill="none" stroke="#D9A441" stroke-width="3"/>
        ${crown(0, -320, 1)}<text y="-170" text-anchor="middle" font-size="40" font-weight="600" fill="#8C1C2E">আমন্ত্রণ</text>
        <text y="-80" text-anchor="middle" font-size="62" font-weight="700" fill="#3A1A16">মহামান্য রাজার</text><text y="10" text-anchor="middle" font-size="62" font-weight="700" fill="#3A1A16">সম্মানে</text>
        <text y="110" text-anchor="middle" font-size="58" font-weight="700" fill="#B8862B">মহাভোজ</text>
        <text y="220" text-anchor="middle" font-size="34" font-weight="600" fill="#5A3A2A">নিকোলাস ফুকের নতুন প্রাসাদে</text>
        <g transform="translate(200,330)"><circle r="56" fill="#A8202E"/>${fleur(0, 0, .75, '#7A1420')}</g></g>`;
      return s;
  } },
  { from: 9, dark: true, draw(t, lt) { // what wasn't there that night!
      let s = bgNight(t) + fireworksSky(t, L(9).s + .1, 5);
      s += zoomG(540, 1000, 1 + lt * .04, chateau(540, 1150, 1, { night: true }) + frenchGarden(t, { night: true }));
      for (let i = 0; i < 6; i++) s += guest(180 + i * 150, 1460 + (i % 2) * 30, .8, i % 2 ? 'man' : 'lady', t, i);
      return s;
  } },
  { from: 10, draw(t, lt) { // gardens, fountains, expensive food
      const mid = lp(10, .62);
      if (t < mid) {
        let s = `<rect width="${W}" height="${H}" fill="url(#gDusk)"/>` + zoomG(540, 1200, 1.1 + lt * .04, frenchGarden(t, { night: false }) + fountain(540, 1380, 1.3, t));
        s += pill(300, 420, 'বিশাল বাগান', '#F8F0DC', '#3A1A16', pop(t, lp(10, .02), .35), 42) + pill(780, 560, 'ঝর্ণা', C.teal, '#fff', pop(t, lp(10, .32), .35), 42);
        return s;
      }
      let s = banquetHall(t) + person({ kind: 'lady', x: 270, y: 1040, s: .8, expr: 'smile', blink: blinkAt(t, 4) }) + person({ kind: 'fouquet', x: 800, y: 1020, s: .85, expr: 'proud', blink: blinkAt(t, 1) }) + banquetTable(1250, t);
      s += pill(540, 760, 'দামি খাবার', C.amber, C.ink, pop(t, mid + .05, .35), 44);
      return s;
  } },
  { from: 11, dark: true, draw(t, lt) { // new play, fireworks across the sky
      const mid = lp(11, .45);
      if (t < mid) { let s = theatreStage(t, eo(prog(lt, 0, .8))); s += pill(540, 260, 'নতুন নাটক', C.amber, C.ink, pop(lt, .1, .35), 44); return s; }
      let s = bgNight(t) + fireworksSky(t, mid - .2, 9);
      s += chateau(540, 1500, .7, { night: true }) + `<rect y="1500" width="${W}" height="${H - 1500}" fill="#162A22"/>`;
      s += pill(540, 860, 'আকাশজুড়ে আতশবাজি', C.coral, '#fff', pop(t, mid + .05, .35), 40);
      return s;
  } },
  { from: 12, dark: true, draw(t, lt) { // guests amazed
      let s = bgNight(t) + fireworksSky(t, L(12).s - .6, 6);
      const glow = .5 + .5 * Math.sin(t * 6);
      s += person({ kind: 'lady', x: 330, y: 1020, s: 1.05, expr: 'smile', mouth: .45, look: [.3, -1], blink: 0 });
      s += person({ kind: 'courtier', x: 790, y: 1060, s: .95, expr: 'smile', mouth: .3, look: [-.3, -1] });
      s += `<rect width="${W}" height="${H}" fill="#FFC857" opacity="${.05 * glow}"/>`;
      for (let i = 0; i < 6; i++) { const q = (lt * .9 + i / 6) % 1; s += `<g opacity="${1 - q}">${heartIcon(200 + i * 140, 800 - q * 320, 1.4, i % 2 ? C.amber : C.coral)}</g>`; }
      return s;
  } },
  { from: 13, draw(t, lt) { // everyone says one name: Fouquet
      let s = banquetHall(t);
      s += person({ kind: 'fouquet', x: 540, y: 1060, s: 1.2, expr: 'proud', mouth: 0, blink: blinkAt(t, 1) });
      const pos = [[220, 560], [860, 520], [180, 880], [900, 860], [540, 360], [320, 1300], [780, 1320]];
      pos.forEach(([x, y], i) => { const p = pop(lt, .1 + i * .14, .3); s += `<g transform="translate(${x},${y}) scale(${p})" opacity="${clamp(p)}">${bubble(-110, -50, 220, 96, '#F8F0DC', '#D9A441', i % 2 ? 'right' : 'left')}<text y="16" text-anchor="middle" font-size="46" font-weight="700" fill="#8C1C2E">ফুকে!</text></g>`; });
      return s;
  } },
  { from: 14, dark: true, draw(t, lt) { // but the king was not smiling
      let s = `<rect width="${W}" height="${H}" fill="#120E1E"/>` + fireworksSky(t, L(14).s - 1, 4).replace(/opacity="/g, 'opacity=".4*');
      s = `<rect width="${W}" height="${H}" fill="#120E1E"/>`;
      for (let i = 0; i < 3; i++) { const q = ((t * .6 + i / 3) % 1); s += `<circle cx="${200 + i * 340}" cy="300" r="${80 + q * 200}" fill="none" stroke="${C.amber}" stroke-width="4" opacity="${.25 * (1 - q)}"/>`; }
      s += zoomG(540, 900, 1.1 + lt * .06, person({ kind: 'louis', x: 540, y: 950, s: 1.7, expr: 'cold', look: [-.6, 0], blink: 0 }));
      s += `<rect width="${W}" height="${H}" fill="url(#gSide)" opacity=".6"/>`;
      return s;
  } },
  { from: 15, draw(t, lt) { // minister's palace more beautiful than the king's
      let s = `<rect width="${W}" height="${H}" fill="url(#gDay)"/>`;
      const a = eo(prog(lt, .1, .6)), b = eo(prog(t, lp(15, .45), .6));
      s += `<g opacity="${a}">${kingPalace(540, 760, .75)}</g>` + pill(540, 300, 'রাজার প্রাসাদ', '#9AA6BF', '#fff', a, 38);
      s += `<g opacity="${b}">${chateau(540, 1380, .82)}</g>` + pill(540, 1440, 'মন্ত্রীর প্রাসাদ', C.amber, C.ink, b, 38);
      for (let i = 0; i < 6; i++) { const q = (t * 1.3 + i / 6) % 1; if (b > .5) s += `<path transform="translate(${260 + i * 110},${900 - q * 40}) scale(${1 - q})" d="M0,-24 L6,-6 L24,0 L6,6 L0,24 L-6,6 L-24,0 L-6,-6Z" fill="${C.amber}" opacity="${1 - q}"/>`; }
      s += `<g opacity="${b}">${person({ kind: 'louis', x: 170, y: 520, s: .38, expr: 'cold', look: [1, 1], crown: false })}</g>`;
      return s;
  } },
  { from: 16, dark: true, draw(t, lt) { // minister's party grander than the king's
      let s = bgRoyal(t);
      s += compareBars(540, 640, .45, 1, 'রাজার পার্টি', 'মন্ত্রীর পার্টি', eo(prog(lt, .2, 1.2)));
      s += person({ kind: 'louis', x: 540, y: 1250, s: 1.0, expr: 'cold', look: [0, -1], blink: blinkAt(t, 3) });
      return s;
  } },
  { from: 17, dark: true, draw(t, lt) { // everyone praises the minister, not the king
      let s = banquetHall(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".25"/>`;
      s += `<ellipse cx="660" cy="1000" rx="360" ry="520" fill="#FFE29A" opacity=".16"/>`;
      s += person({ kind: 'fouquet', x: 660, y: 1000, s: 1.05, expr: 'laugh', mouth: .4, blink: 0 });
      s += `<g opacity=".85">${person({ kind: 'louis', x: 180, y: 1120, s: .7, expr: 'cold', look: [1, 0] })}</g>`;
      for (let i = 0; i < 5; i++) s += guest(120 + i * 210, 1480, .85, i % 2 ? 'man' : 'lady', t, i);
      for (let i = 0; i < 4; i++) { const p = pop(t, lp(17, .4) + i * .15, .3); s += `<g transform="translate(${560 + (i % 2 ? 230 : -150)},${560 + i * 70}) scale(${p})" opacity="${clamp(p)}">${heartIcon(0, 0, 1.6, C.amber)}</g>`; }
      if (t > lp(17, .55)) s += `<g opacity="${eo(prog(t, lp(17, .55), .3))}">${crossIcon(180, 760, .9, C.coral)}${checkIcon(660, 420, .9, C.teal)}</g>`;
      return s;
  } },
  { from: 18, xf: true, dark: true, draw(t, lt) { // three weeks later, arrested
      let s = `<rect width="${W}" height="${H}" fill="#1E1418"/>`;
      s += pill(540, 280, 'ঠিক ৩ সপ্তাহ পর', C.coral, '#fff', pop(lt, 0, .4), 44);
      const p = eo(prog(lt, .2, .6));
      s += `<g opacity="${p}">${royalOrder(540, 820, lerp(.4, .75, p), { line: 'গ্রেপ্তার' })}</g>`;
      s += person({ kind: 'guard', x: 270, y: 1380, s: .85, expr: 'stern', look: [1, 0] });
      s += person({ kind: 'fouquet', x: 800, y: 1400, s: .82, expr: 'worried', look: [-1, 0], sweat: 1, t });
      return s;
  } },
  { from: 19, dark: true, draw(t, lt) { // accusation: embezzling state money
      let s = `<rect width="${W}" height="${H}" fill="#1E1418"/>`;
      for (let i = 0; i < 12; i++) { const q = prog(lt, i * .07, 1.4); if (q <= 0) continue; s += `<g opacity="${1 - q * .6}">${coin(180 + (i * 97) % 720, 1250 - q * 240 + (i % 3) * 40, .8)}</g>`; }
      s += `<g transform="translate(540,760)"><rect x="-380" y="-200" width="760" height="400" rx="20" fill="#F3E6C4"/><text y="-90" text-anchor="middle" font-size="50" font-weight="700" fill="#5A2A16">অভিযোগ</text><text y="20" text-anchor="middle" font-size="62" font-weight="700" fill="#8C1C2E">রাষ্ট্রের টাকা</text><text y="100" text-anchor="middle" font-size="62" font-weight="700" fill="#8C1C2E">আত্মসাৎ</text></g>`;
      return s;
  } },
  { from: 20, xf: true, dark: true, draw(t, lt) { // ~19 years in prison
      let s = prisonCell(t);
      s += person({ kind: 'fouquet', x: 430, y: 1100, s: 1.1, expr: 'sad', look: [.5, .5], blink: blinkAt(t, 2) });
      s += cellBars(.95);
      const y = Math.round(lerp(1, 19, eio(prog(lt, .3, Math.max(1, L(20).e - L(20).s - .3)))));
      s += `<g transform="translate(540,330)"><rect x="-230" y="-90" width="460" height="180" rx="24" fill="#F3E6C4"/><text y="22" text-anchor="middle" font-size="96" font-weight="700" fill="#5A2A16">${bn(y)} বছর</text></g>`;
      return s;
  } },
  { from: 21, xf: true, draw(t, lt) { // historians: financial irregularities
      let s = bgParch(t);
      s += oldBook(540, 1180, 1.6, '#5E1A2B', 'ইতিহাস') + oldBook(520, 1080, 1.5, '#1F3C88', '১৬৬১') + oldBook(560, 985, 1.4, '#2F5240', '');
      const w = eo(prog(lt, .2, 1.4));
      s += `<g transform="translate(540,600)"><rect x="-330" y="-200" width="660" height="400" rx="10" fill="#FBF3DF" stroke="#C9B48E" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<rect x="-280" y="${-140 + i * 60}" width="${560 * clamp(w * 4 - i)}" height="12" rx="6" fill="#B8A27A"/>`).join('')}</g>`;
      s += quill(-280 + 540 + 560 * clamp(w * 4 - Math.floor(w * 4)) * .9, 480 + Math.min(3, Math.floor(w * 4)) * 60, .5, 20);
      s += pill(540, 300, 'আর্থিক অনিয়ম', C.coral, '#fff', pop(t, lp(21, .55), .4), 44);
      return s;
  } },
  { from: 22, dark: true, draw(t, lt) { // court enemies conspired
      let s = `<rect width="${W}" height="${H}" fill="#24181E"/>`;
      s += `<rect x="0" y="0" width="260" height="${H}" fill="#3A2A30"/><rect x="820" y="0" width="260" height="${H}" fill="#3A2A30"/>`;
      s += person({ kind: 'courtier', x: 360, y: 1000, s: 1.0, expr: 'smirk', look: [1, 0], mouth: Math.max(0, Math.sin(t * 9)) * .3 });
      s += person({ kind: 'courtier', x: 760, y: 1030, s: .9, expr: 'cold', look: [-1, 0], flip: true });
      for (let i = 0; i < 3; i++) { const q = (t * .8 + i / 3) % 1; s += `<path d="M${470 + q * 160},${930 - i * 30} q20,-14 40,0" stroke="#D9C8A6" stroke-width="5" fill="none" opacity="${(1 - q) * .8}"/>`; }
      s += pill(540, 300, 'দরবারের ষড়যন্ত্র', '#5A2A3A', '#F3E6C4', pop(lt, .2, .4), 42);
      s += `<rect width="${W}" height="${H}" fill="url(#gSide)" opacity=".5"/>`;
      return s;
  } },
  { from: 23, xf: true, dark: true, draw(t, lt) { // but Robert Greene says
      let s = bgRoyal(t);
      const bp = eo(prog(lt, 0, .6));
      s += bookCover(540, 880, lerp(.7, 1, bp), bp, lerp(-8, 0, bp));
      return s;
  } },
  { from: 24, dark: true, draw(t, lt) { // the real fire was lit that party night
      let s = bgNight(t);
      s += `<g opacity=".55">${chateau(540, 1250, .9, { night: true })}</g>` + fireworksSky(t, L(24).s - 1, 4);
      const f = eo(prog(lt, .2, .8));
      s += `<g opacity="${f}">${flame(540, 1100, lerp(.4, 1.6, f), t)}</g><rect width="${W}" height="${H}" fill="#E85D4A" opacity="${f * .12}"/>`;
      s += pill(540, 300, 'আসল আগুন', C.coral, '#fff', pop(lt, .3, .4), 48);
      return s;
  } },
  { from: 25, xf: true, draw(t, lt) { // Fouquet thought he was honouring the king
      let s = bgParch(t);
      s += person({ kind: 'fouquet', x: 380, y: 1060, s: 1.1, expr: 'smile', look: [1, -.4], blink: blinkAt(t, 1), tilt: 4 });
      const p = pop(t, lp(25, .35), .45);
      s += `<g transform="translate(760,600) scale(${p})" opacity="${clamp(p)}"><ellipse rx="230" ry="150" fill="#fff" filter="url(#shadow)"/><circle cx="-140" cy="170" r="24" fill="#fff"/><circle cx="-180" cy="220" r="14" fill="#fff"/>${crown(-60, -30, .6)}${heartIcon(80, -20, 2.4, C.coral)}<text y="90" text-anchor="middle" font-size="42" font-weight="700" fill="#3A1A16">রাজাকে সম্মান</text></g>`;
      return s;
  } },
  { from: 26, dark: true, draw(t, lt) { // actually he made the king feel small
      let s = bgRoyal(t);
      const g = eio(prog(lt, .2, 1.4));
      s += `<ellipse cx="660" cy="1000" rx="${300 + g * 200}" ry="${500 + g * 200}" fill="#FFE29A" opacity="${.08 + g * .12}"/>`;
      s += person({ kind: 'fouquet', x: 660, y: lerp(1050, 980, g), s: lerp(.8, 1.35, g), expr: 'proud', blink: blinkAt(t, 1) });
      s += `<g opacity="${1 - g * .35}">${person({ kind: 'louis', x: 230, y: lerp(1100, 1250, g), s: lerp(.8, .45, g), expr: 'cold', look: [1, -1] })}</g>`;
      s += pill(230, lerp(1500, 1450, g), 'রাজা ছোট', C.coral, '#fff', pop(t, lp(26, .6), .4), 36);
      return s;
  } },
  { from: 27, xf: true, dark: true, draw(t, lt) { // 48 Laws, the very first law
      let s = bgRoyal(t);
      const up = eo(prog(t, L(28).s, .6));
      s += bookCover(540, lerp(880, 640, up), lerp(1, .78, up), 1, 0);
      const p = pop(t, L(28).s + .2, .45);
      s += `<g transform="translate(540,1290) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-80" width="520" height="160" rx="24" fill="#F8F0DC" stroke="#D9A441" stroke-width="6"/><text y="22" text-anchor="middle" font-size="62" font-weight="700" fill="#3A1A16">প্রথম নিয়ম</text></g>`;
      return s;
  } },
  { from: 29, dark: true, draw(t, lt) { // Law 1: Never Outshine the Master
      let s = bgRoyal(t);
      const p = pop(lt, .05, .45);
      s += `<g transform="translate(540,700) scale(${p})" opacity="${clamp(p)}"><rect x="-170" y="-90" width="340" height="180" rx="26" fill="${C.amber}"/><text y="34" text-anchor="middle" font-size="104" font-weight="700" fill="${C.ink}">LAW 1</text></g>`;
      const q = eo(prog(lt, .5, .5));
      s += `<g opacity="${q}" transform="translate(0,${(1 - q) * 30})"><text x="540" y="960" text-anchor="middle" font-size="66" font-weight="700" fill="#fff">Never Outshine</text><text x="540" y="1050" text-anchor="middle" font-size="66" font-weight="700" fill="${C.amber}">the Master.</text></g>`;
      s += `<g opacity="${q}">${crown(540, 1260, 1.1)}</g>`;
      return s;
  } },
  { from: 30, dark: true, draw(t, lt) { // don't outshine the one you serve
      let s = bgRoyal(t);
      s += `<ellipse cx="420" cy="980" rx="260" ry="420" fill="#FFE29A" opacity=".16"/>`;
      s += person({ kind: 'louis', x: 420, y: 1000, s: 1.0, expr: 'proud', blink: blinkAt(t, 3) });
      s += `<g opacity=".9">${person({ kind: 'fouquet', x: 830, y: 1120, s: .72, expr: 'smile', look: [-1, -.3], tilt: 6 })}</g>`;
      const a = eo(prog(lt, .1, .5)), b = eo(prog(t, lp(30, .45), .5));
      s += `<g opacity="${a}"><text x="540" y="380" text-anchor="middle" font-size="62" font-weight="700" fill="#fff">যার অধীনে আছেন,</text></g>`;
      s += `<g opacity="${b}"><text x="540" y="470" text-anchor="middle" font-size="62" font-weight="700" fill="${C.amber}">তাঁকে কখনো ছাপিয়ে যাবেন না।</text></g>`;
      return s;
  } },
  { from: 31, xf: true, dark: true, draw(t, lt) { // the powerful fear losing their place
      let s = throneRoom(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
      s += person({ kind: 'louis', x: 540, y: 820, s: 1.05, expr: 'worried', look: [.8, 0], sweat: .8, t });
      const g = eo(prog(lt, .4, 2));
      s += `<g opacity="${.25 + g * .5}"><path d="M${1100 - g * 260},${H} C${1000 - g * 260},1300 ${980 - g * 260},900 ${1040 - g * 260},700 C${1120 - g * 260},640 ${1200 - g * 260},700 ${1200},900 L1200,${H}Z" fill="#000"/></g>`;
      const sh = Math.sin(t * 30) * 2 * g;
      s += `<g transform="translate(${sh},0)"><path d="M380,1180 L700,1180" stroke="${C.coral}" stroke-width="0"/></g>`;
      return s;
  } },
  { from: 32, draw(t, lt) { // your success makes them feel small → danger
      let s = `<rect width="${W}" height="${H}" fill="#EEF2F6"/>`;
      const up = eo(prog(lt, .1, 1.2));
      s += `<g transform="translate(540,900)"><rect x="-400" y="-300" width="800" height="560" rx="24" fill="#fff" filter="url(#shadow)"/>${[.3, .45, .65, .95].map((h, i) => `<rect x="${-320 + i * 170}" y="${200 - 420 * h * up}" width="110" height="${420 * h * up}" rx="12" fill="${i === 3 ? C.teal : '#9CC3E0'}"/>`).join('')}
        <path d="M-320,150 L-150,80 L20,-20 L300,-220" stroke="${C.amber}" stroke-width="12" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - up}"/></g>`;
      s += pill(540, 400, 'আপনার সাফল্য', C.teal, '#fff', pop(lt, 0, .35), 42);
      if (t > L(33).s) {
        const d = pop(t, L(33).s + .05, .45);
        s += `<rect width="${W}" height="${H}" fill="${C.coral}" opacity="${.1 * clamp(d)}"/><g transform="translate(540,1300) scale(${d})" opacity="${clamp(d)}"><path d="M0,-130 L150,130 L-150,130Z" fill="${C.coral}" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><rect x="-10" y="-50" width="20" height="100" rx="10" fill="#fff"/><circle cy="90" r="13" fill="#fff"/></g>`;
        s += pill(540, 1060, 'বিপদ', C.coral, '#fff', d, 48);
      }
      return s;
  } },
  { from: 34, xf: true, draw(t, lt) { // show your talent at the office
      let s = officeBg(t);
      s += person({ kind: 'boss', x: 300, y: 1060, s: .95, expr: 'neutral', look: [1, 0], blink: blinkAt(t, 3) });
      s += person({ kind: 'employee', x: 780, y: 1080, s: .9, expr: 'smile', look: [-1, 0], blink: blinkAt(t, 1) });
      s += `<rect y="1300" width="${W}" height="${H - 1300}" fill="#8A6A4E"/><rect y="1300" width="${W}" height="16" fill="#A8846A"/>`;
      const p = pop(t, lp(34, .45), .45);
      s += `<g transform="translate(540,520) scale(${p})" opacity="${clamp(p)}"><rect x="-200" y="-120" width="400" height="240" rx="16" fill="#fff" stroke="#CFD8E3" stroke-width="5"/>${[.4, .6, .9].map((h, i) => `<rect x="${-130 + i * 100}" y="${80 - 160 * h}" width="60" height="${160 * h}" rx="8" fill="${C.teal}"/>`).join('')}</g>`;
      s += pill(540, 300, 'মেধা দেখান', C.teal, '#fff', p, 40);
      return s;
  } },
  { from: 35, draw(t, lt) { // so the boss feels stronger
      let s = officeBg(t);
      const g = eio(prog(lt, .5, 1.6));
      s += `<ellipse cx="420" cy="980" rx="${260 + g * 80}" ry="${420 + g * 60}" fill="#FFE29A" opacity="${.1 + g * .2}"/>`;
      s += person({ kind: 'boss', x: 420, y: lerp(1060, 1000, g), s: lerp(.95, 1.15, g), expr: g > .5 ? 'proud' : 'neutral', look: [.6, 0], blink: blinkAt(t, 3) });
      s += person({ kind: 'employee', x: 850, y: 1110, s: .8, expr: 'smile', look: [-1, 0], blink: blinkAt(t, 1) });
      s += `<rect y="1300" width="${W}" height="${H - 1300}" fill="#8A6A4E"/><rect y="1300" width="${W}" height="16" fill="#A8846A"/>`;
      const mv = eio(prog(lt, .3, 1.2));
      s += `<g transform="translate(${lerp(820, 520, mv)},${lerp(640, 560, mv)}) scale(.8)"><rect x="-150" y="-100" width="300" height="200" rx="14" fill="#fff" stroke="#CFD8E3" stroke-width="5" filter="url(#shadow)"/>${[.4, .6, .9].map((h, i) => `<rect x="${-100 + i * 75}" y="${70 - 130 * h}" width="46" height="${130 * h}" rx="6" fill="${C.teal}"/>`).join('')}</g>`;
      s += pill(420, 360, 'আরও শক্তিশালী', C.amber, C.ink, pop(t, lp(35, .65), .4), 42);
      return s;
  } },
  { from: 36, draw(t, lt) { // not threatened
      let s = officeBg(t);
      s += person({ kind: 'boss', x: 420, y: 1000, s: 1.15, expr: 'smile', blink: blinkAt(t, 3) });
      s += person({ kind: 'employee', x: 850, y: 1110, s: .8, expr: 'smile', look: [-1, 0] });
      s += `<rect y="1300" width="${W}" height="${H - 1300}" fill="#8A6A4E"/>`;
      const p = pop(lt, .05, .35);
      s += `<g transform="translate(540,420) scale(${p})" opacity="${clamp(p)}"><rect x="-200" y="-60" width="400" height="120" rx="60" fill="#fff" filter="url(#shadow)"/><text x="30" y="16" text-anchor="middle" font-size="46" font-weight="700" fill="${C.ink}">হুমকি</text>${crossIcon(-130, 0, .8, C.coral)}</g>`;
      return s;
  } },
  { from: 37, xf: true, draw(t, lt) { // CTA
      let s = bgParch(t);
      const a = eo(prog(lt, .1, .5)), b = eo(prog(lt, .9, .5));
      s += `<g opacity="${a}" transform="translate(0,${(1 - a) * 30})"><text x="540" y="400" text-anchor="middle" font-size="66" font-weight="700" fill="#3A1A16">আপনি কি কখনো ভালো কাজ করেও</text></g>`;
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 30})"><text x="540" y="500" text-anchor="middle" font-size="66" font-weight="700" fill="#3A1A16">বসের চোখে <tspan fill="${C.coral}">খারাপ</tspan> হয়েছেন?</text></g>`;
      s += person({ kind: 'employee', x: 360, y: 1250, s: .95, expr: 'worried', look: [1, 0], blink: blinkAt(t, 1) });
      s += person({ kind: 'boss', x: 780, y: 1240, s: .95, expr: 'stern', look: [-1, 0], blink: blinkAt(t, 3) });
      const p = pop(t, L(38).s - .1, .4);
      s += `<g transform="translate(540,720) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-58" width="520" height="116" rx="58" fill="${C.teal}"/><path d="M-200,-22 h60 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-34 l-16,14 v-14 h-10 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12z" fill="#fff"/><text x="30" y="18" text-anchor="middle" font-size="50" font-weight="700" fill="#fff">কমেন্টে লিখুন</text></g>`;
      const c = eo(prog(t, L(38).s + .2, .4));
      if (c > 0) s += `<g transform="translate(${lerp(820, 660, c)},${lerp(920, 760, c)}) scale(${t > L(38).s + .6 && t < L(38).s + .75 ? .85 : 1})">${cursor()}</g>`;
      return s;
  } },
  { from: 39, dark: true, draw(t, lt) { // end card
      let s = bgRoyal(t);
      s += `<g transform="translate(540,760) scale(${pop(lt, .05, .5)})">${orbitLogo(t, 120)}</g>`;
      const b = eo(prog(lt, .3, .5));
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 30})"><text x="540" y="1020" text-anchor="middle" font-size="96" font-weight="700" fill="#fff">${BRAND}</text><text x="540" y="1100" text-anchor="middle" font-size="40" font-weight="500" fill="#ffffffaa">গল্পে গল্পে জীবনের কৌশল</text></g>`;
      const p = pop(lt, .7, .45), clicked = lt > 1.65;
      s += `<g transform="translate(540,1280) scale(${p * (lt > 1.5 && lt < 1.65 ? .92 : 1)})" opacity="${clamp(p)}"><rect x="${clicked ? -290 : -210}" y="-62" width="${clicked ? 580 : 420}" height="124" rx="62" fill="${clicked ? '#fff' : C.amber}"/><text y="20" text-anchor="middle" font-size="54" font-weight="700" fill="${C.ink}">${clicked ? '✓ ফলো করা হয়েছে' : '+ ফলো করুন'}</text></g>`;
      const c = eo(prog(lt, .9, .55));
      if (c > 0) s += `<g transform="translate(${lerp(820, 600, c)},${lerp(1500, 1300, c)})">${cursor()}</g>`;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${eo(prog(t, LINES[LINES.length - 1].e + 1.1, .6))}"/>`;
      return s;
  } }
];
function bookCover(x, y, sc, op, rot) {
  return `<g transform="translate(${x},${y}) scale(${sc}) rotate(${rot})" opacity="${op}"><rect x="-250" y="-340" width="500" height="680" rx="14" fill="#1F3A2E"/><rect x="-250" y="-340" width="40" height="680" rx="8" fill="#16291F"/><rect x="-200" y="-300" width="420" height="600" fill="none" stroke="${C.amber}" stroke-width="4"/>
  <text x="10" y="-180" text-anchor="middle" font-size="30" font-weight="600" fill="${C.amber}" letter-spacing="6">ROBERT GREENE</text><text x="10" y="-40" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">The 48</text><text x="10" y="50" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Laws of</text><text x="10" y="140" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Power</text><rect x="-40" y="200" width="100" height="5" fill="${C.amber}"/></g>`;
}
function officeBg(t) {
  let s = `<rect width="${W}" height="${H}" fill="#E9EEF3"/><rect x="80" y="260" width="380" height="460" rx="10" fill="#CFE3EE" stroke="#fff" stroke-width="14"/>`;
  for (let i = 0; i < 7; i++) s += `<rect x="80" y="${280 + i * 62}" width="380" height="24" fill="#fff" opacity=".5"/>`;
  s += `<rect x="620" y="300" width="360" height="220" rx="8" fill="#fff" stroke="#14213D" stroke-width="8"/><path d="M650,480 L740,400 L820,440 L950,330" stroke="${C.teal}" stroke-width="10" fill="none"/>`;
  s += plant(990, 1250, 1.2);
  return s;
}

// ---------- timeline ----------
function sceneStart(i) { return i === 0 ? 0 : Math.max(0, L(SCENES[i].from).s - .08); }
function sceneAt(t) { let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= sceneStart(i)) k = i; return k; }
const DEFS = `<defs>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0"/></filter>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1530"/><stop offset="1" stop-color="#2E2A50"/></linearGradient>
<linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC7E2"/><stop offset="1" stop-color="#F6EFE4"/></linearGradient>
<linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3A6A"/><stop offset=".6" stop-color="#E08A6A"/><stop offset="1" stop-color="#F4C17A"/></linearGradient>
<linearGradient id="gRoyal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2A5E"/><stop offset="1" stop-color="#0E1636"/></linearGradient>
<linearGradient id="gStage" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<linearGradient id="gParch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#8A6A3A" stop-opacity=".2"/></linearGradient>
<linearGradient id="gSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".8"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#14213D" flood-opacity=".18"/></filter>
</defs>`;
function frameSVG(t) {
  _pid = 0;
  const k = sceneAt(t), sc = SCENES[k], st = sceneStart(k);
  let body = sc.draw(t, t - st);
  if (sc.xf && k > 0 && t - st < .35) { const pv = SCENES[k - 1]; body = pv.draw(st, st - sceneStart(k - 1)) + `<g opacity="${eio((t - st) / .35)}">${body}</g>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Hind Siliguri">${DEFS}${body}${vignette(sc.dark ? .5 : .22)}${grain(.05)}${brandTag(sc.dark)}</svg>`;
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
