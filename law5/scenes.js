// ===== Law 5 – Reputation reel (TR Universe 0.1) =====
const W = 1080, H = 1920;
const BRAND = 'TR Universe 0.1';

const SUB = [
  '*পনেরো বছর* ধরে যে সুনাম গড়েছিলেন,',
  'মাত্র ~পনেরো সেকেন্ডের~ একটা ভিডিও|সেটা ~শেষ~ করে দিল।',
  '*মিরপুরে* জামাল সাহেবের|ছোট একটা *ভাতের হোটেল*।',
  '*সস্তা দাম*, *ভালো রান্না*।',
  'এলাকার *সবাই চেনে*।',
  'এক রাতে এক কাস্টমারের সঙ্গে|~ঝামেলা~ হলো।',
  'জামাল সাহেব জোরে ~ধমক~ দিলেন।',
  'কেউ একজন সেই *মুহূর্তটুকু*|মোবাইলে তুলে',
  '*ফেসবুকে* ছেড়ে দিল।',
  'পরদিন সকালে ভিডিওর ভিউ|*দশ লাখ*।',
  '“~অভদ্র মালিক।~”',
  '“এই হোটেল ~বয়কট~ করুন।”',
  'জামাল সাহেব ~রেগে গিয়ে~|কমেন্টে উত্তর দিতে লাগলেন।',
  'লোকজনের সঙ্গে ~ঝগড়া~।|~গালির জবাবে গালি~।',
  'যত লিখলেন, তত মানুষ বলল,',
  '“দেখেন, এখনো কেমন ~মেজাজ~।”',
  'এক সপ্তাহে দোকান ~প্রায় খালি~।',
  'তখন তাঁর *মেয়ে* বলল,',
  '“আব্বু, আর *একটা কথাও* লিখবা না।”',
  'মেয়েটা দোকানের *সিসি ক্যামেরার*|*পুরো ফুটেজ* বের করল।',
  'কোনো *রাগ নেই*, কোনো *অভিযোগ নেই*।',
  'শুধু পুরো *তিন মিনিটের*|ভিডিওটা পোস্ট করল।',
  'সেখানে দেখা গেল,|ওই কাস্টমার অনেকক্ষণ ধরে',
  'কম বয়সী এক ওয়েটার ছেলেকে|~অপমান~ করছিল,',
  '~গায়ে হাত তোলার~ চেষ্টা করছিল।',
  'জামাল সাহেব ধমক দিয়েছিলেন|*ছেলেটাকে বাঁচাতে*।',
  'দুদিনের মধ্যে *সব উল্টে গেল*।',
  'যারা ~বয়কট~ বলেছিল,|তারাই এবার *লাইন ধরে* খেতে এল।',
  '*Robert Greene* তাঁর|*The 48 Laws of Power* বইয়ে|এটাকেই বলেছেন,',
  'Law 5',
  'সুনামকে *জীবনের মতো* রক্ষা করো।',
  'মানুষ *পুরো ঘটনা* দেখে না।',
  '*প্রথম যা দেখে*, সেটাই বিশ্বাস করে।',
  'আর ~রাগ~ দেখালে ভাবে,|~অভিযোগটাই সত্যি~।',
  'তাই সুনামে আঘাত এলে|~চিৎকার~ করবেন না।',
  '*ঠান্ডা মাথায়* সত্যটা সামনে আনুন।',
  'আর সবসময় এমনভাবে চলুন,',
  'যেন *ক্যামেরা চালু* থাকলেও|আপনার *ভয় পাওয়ার কিছু না থাকে*।',
  'আপনি কি কখনো কোনো|ভাইরাল ভিডিও দেখে',
  'না জেনেই কাউকে ~বিচার~ করেছেন?',
  '*কমেন্টে* লিখুন।',
  'আর এমন গল্প পেতে *ফলো* করে রাখুন।'
];
const HIDE_SUB = new Set([30, 31, 39, 40, 41, 42]);

const L = i => LINES[i - 1];
function speakMouth(t, idxs, gain = 1.25) {
  for (const i of idxs) {
    const l = L(i);
    if (t >= l.s - .03 && t <= l.e + .05) {
      const f = Math.round(t * FPS);
      const e = ((ENV[f - 1] || 0) + (ENV[f] || 0) * 2 + (ENV[f + 1] || 0)) / 4;
      return clamp((e - .1) * gain * 1.4);
    }
  }
  return 0;
}
const shoutMouth = t => .55 + .4 * Math.abs(Math.sin(t * 11)) * Math.abs(Math.sin(t * 3.3 + 1));
function subHTML(i) {
  return SUB[i - 1].split('|').map(r => r.replace(/\*(.+?)\*/g, '<b class="a">$1</b>').replace(/~(.+?)~/g, '<b class="c">$1</b>')).join('<br>');
}
const lp = (i, f) => L(i).s + (L(i).e - L(i).s) * f;   // time at fraction f of line i

// ---------- shared visuals ----------
function bgPaper(t) {
  return `<rect width="${W}" height="${H}" fill="${C.paper}"/><circle cx="${880 + Math.sin(t * .3) * 20}" cy="380" r="420" fill="${C.amber}" opacity=".07"/><circle cx="160" cy="${1560 + Math.cos(t * .25) * 20}" r="360" fill="${C.teal}" opacity=".06"/>`;
}
function bgInk(t) {
  let s = `<rect width="${W}" height="${H}" fill="url(#gInk)"/>`;
  for (let i = 0; i < 28; i++) s += `<circle cx="${(i * 397) % W}" cy="${(i * 613) % H}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${.25 + .25 * Math.sin(t * 1.4 + i)}"/>`;
  return s;
}
function pill(x, y, txt, bg, fg, sc = 1, fs = 44) {
  const w = txt.length * fs * .52 + 70;
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${clamp(sc)}"><rect x="${-w / 2}" y="${-fs * .95}" width="${w}" height="${fs * 1.9}" rx="${fs * .95}" fill="${bg}"/><text y="${fs * .36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${fg}">${txt}</text></g>`;
}
function zoomG(cx, cy, z, inner) { return `<g transform="translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})">${inner}</g>`; }
function lakh(n) { // Indian grouping in Bangla digits
  n = Math.round(n); let s = String(n);
  if (s.length > 3) { const last = s.slice(-3); let rest = s.slice(0, -3); rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ','); s = rest + ',' + last; }
  return bn(s);
}
function heartIcon(x, y, s, col) { return `<path transform="translate(${x},${y}) scale(${s})" d="M0,12 C-22,-6 -30,-22 -16,-30 C-8,-35 0,-28 0,-22 C0,-28 8,-35 16,-30 C30,-22 22,-6 0,12Z" fill="${col}"/>`; }
function shieldIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,-90 L74,-60 C74,10 46,60 0,90 C-46,60 -74,10 -74,-60Z" fill="${col}"/><path d="M-30,0 L-8,24 L34,-24" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
function crossIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="${col}"/><path d="M-16,-16 L16,16 M16,-16 L-16,16" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>`; }
function checkIcon(x, y, s, col) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="${col}"/><path d="M-18,0 L-5,14 L20,-14" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
function cursor() { return `<path d="M0,0 L0,80 L20,62 L36,98 L52,90 L36,56 L62,56Z" fill="#fff" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`; }
function orbitLogo(t, r) {
  const a = t * 1.4;
  return `<circle r="${r * .42}" fill="${C.amber}"/><ellipse rx="${r}" ry="${r * .36}" fill="none" stroke="#fff" stroke-width="${r * .06}" transform="rotate(-24)"/><circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r * .36}" r="${r * .1}" fill="${C.teal}" transform="rotate(-24)"/><text y="${r * .15}" text-anchor="middle" font-size="${r * .38}" font-weight="700" fill="${C.ink}">TR</text>`;
}
function brandTag(dark) {
  return `<g transform="translate(60,96)"><g transform="translate(26,-12)">${orbitLogo(0, 26).replace(/<text.*<\/text>/, '')}</g><text x="70" y="0" font-size="34" font-weight="600" fill="${dark ? '#ffffffd9' : C.ink}" opacity=".92">${BRAND}</text></g>`;
}
// raised arm (for the customer) — from shoulder at (x,y), angle a (deg, 0 = straight up)
function raisedArm(x, y, s, a, sleeve = '#8B1F33', skin = '#C58A5C') {
  return `<g transform="translate(${x},${y}) rotate(${a}) scale(${s})"><path d="M-34,0 C-40,-90 -36,-180 -26,-240 L26,-240 C34,-180 38,-90 34,0Z" fill="${sleeve}"/><path d="M-26,-240 L26,-240 L24,-262 L-24,-262Z" fill="#6A1424"/><ellipse cx="0" cy="-300" rx="36" ry="46" fill="${skin}"/><path d="M-30,-318 q-10,-30 6,-40 M-12,-334 q0,-34 14,-36 M8,-334 q6,-32 20,-30 M24,-322 q12,-24 22,-18" stroke="${skin}" stroke-width="16" stroke-linecap="round" fill="none"/></g>`;
}
// CCTV overlay frame (footage look)
function cctvOverlay(t, label = 'CAM 01') {
  const sec = Math.floor(t * 1) % 60; const ts = bn('00:0' + Math.floor(t / 60) % 10 + ':' + String(sec).padStart(2, '0'));
  let s = `<rect width="${W}" height="${H}" fill="#0E3B3A" opacity=".28"/>`;
  for (let y = 0; y < H; y += 8) s += `<rect y="${y}" width="${W}" height="2" fill="#000" opacity=".08"/>`;
  s += `<path d="M60,200 v-60 h80 M1020,200 v-60 h-80 M60,1420 v60 h80 M1020,1420 v60 h-80" stroke="#fff" stroke-width="6" fill="none" opacity=".85"/>`;
  s += `<g transform="translate(110,250)"><circle r="12" fill="#E53935" opacity="${Math.sin(t * 6) > 0 ? 1 : .25}"/><text x="26" y="12" font-size="34" font-weight="700" fill="#fff">REC · ${label}</text></g>`;
  s += `<text x="970" y="262" text-anchor="end" font-size="32" font-weight="600" fill="#fff">${ts}</text>`;
  return s;
}

// =============== SCENES ===============
const SCENES = [
  { // 1 — 15 years of reputation (badge builds)
    from: 1, dark: true, draw(t, lt) {
      let s = bgInk(t);
      const p = eo(prog(lt, .1, 1.6));
      const yr = Math.round(lerp(0, 15, p));
      // reputation medal
      s += `<g transform="translate(540,820) scale(${pop(lt, 0, .5)})">`;
      s += `<path d="M-90,120 L-150,330 L-60,290 L-20,380 L30,160Z" fill="${C.coral}"/><path d="M90,120 L150,330 L60,290 L20,380 L-30,160Z" fill="#C44536"/>`;
      s += `<circle r="230" fill="${C.amber}"/><circle r="196" fill="none" stroke="#FFF1C9" stroke-width="8" stroke-dasharray="4 14"/><circle r="170" fill="#E8962B"/>`;
      for (let i = 0; i < 5; i++) { const a = (i - 2) * 26 * Math.PI / 180; const on = p > i / 5; s += `<g transform="translate(${Math.sin(a) * 110},${-Math.cos(a) * 110 + 10}) scale(${on ? 1 : .6})" opacity="${on ? 1 : .3}"><path d="M0,-26 L8,-8 L27,-8 L12,4 L18,23 L0,12 L-18,23 L-12,4 L-27,-8 L-8,-8Z" fill="#FFF6D8"/></g>`; }
      s += `<text y="70" text-anchor="middle" font-size="150" font-weight="700" fill="#FFF6D8">${bn(yr)}</text><text y="140" text-anchor="middle" font-size="48" font-weight="700" fill="#FFF1C9">বছর</text></g>`;
      s += pill(540, 470, 'সুনাম', '#ffffff1f', '#fff', pop(lt, .3, .4), 56);
      return s;
    }
  },
  { // 2 — a 15-second video shatters it
    from: 2, dark: true, draw(t, lt) {
      const l = L(2), brk = prog(t, lp(2, .55), .9);
      let s = bgInk(t);
      // medal (cracking)
      s += `<g transform="translate(540,${760 + eio(brk) * 40})" opacity="${1 - brk * .55}"><circle r="200" fill="${C.amber}"/><circle r="148" fill="#E8962B"/><text y="60" text-anchor="middle" font-size="130" font-weight="700" fill="#FFF6D8">১৫</text>`;
      const cr = eo(prog(t, lp(2, .5), .25));
      s += `<path d="M-20,-200 L10,-90 L-40,-20 L30,60 L-10,200" stroke="${C.ink}" stroke-width="14" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - cr}"/><path d="M10,-90 L120,-130 M-40,-20 L-170,10 M30,60 L150,110" stroke="${C.ink}" stroke-width="9" fill="none" opacity="${cr}"/></g>`;
      // shards fall
      for (let i = 0; i < 8; i++) { const q = prog(t, lp(2, .65) + i * .04, 1.1); if (q <= 0) continue; s += `<path transform="translate(${540 + Math.cos(i) * 140 + (i % 2 ? 1 : -1) * q * 160},${760 + Math.sin(i) * 120 + q * q * 700}) rotate(${q * 200 * (i % 2 ? 1 : -1)})" d="M0,-30 L28,10 L-18,26Z" fill="${C.amber}" opacity="${1 - q}"/>`; }
      // phone with 15s clip
      const ph = eo(prog(lt, .05, .5));
      const inner = `<rect x="-172" y="-350" width="344" height="700" fill="#2E3B55"/><g transform="translate(0,40)">${person({ kind: 'jamal', x: 0, y: -60, s: .62, expr: 'shout', mouth: shoutMouth(t) })}</g><rect x="-150" y="290" width="300" height="10" rx="5" fill="#ffffff44"/><rect x="-150" y="290" width="${300 * clamp(lt / (l.e - l.s))}" height="10" rx="5" fill="${C.coral}"/><text x="140" y="270" text-anchor="end" font-size="34" font-weight="700" fill="#fff">০:${bn(String(Math.min(15, Math.floor(lt / (l.e - l.s) * 15))).padStart(2, '0'))}</text>`;
      s += `<g opacity="${ph}" transform="translate(${lerp(1300, 0, ph)},0)">${phone(780, 1130, .78, inner, 8)}</g>`;
      s += pill(780, 780, '১৫ সেকেন্ড', C.coral, '#fff', pop(lt, .3, .4), 40);
      return s;
    }
  },
  { // 3 — Mirpur, Jamal's small rice hotel
    from: 3, xf: true, draw(t, lt) {
      let s = zoomG(540, 1000, 1 + lt * .025, hotelStreet(t, {}));
      const p = eo(prog(lt, .2, .5));
      s += `<g transform="translate(220,${lerp(240, 520, p)})" opacity="${p}"><path d="M0,0 C-60,-60 -60,-150 0,-150 C60,-150 60,-60 0,0Z" fill="${C.coral}"/><circle cy="-100" r="22" fill="#fff"/></g>`;
      s += pill(220, 590, 'মিরপুর', C.ink, '#fff', pop(lt, .6, .4), 40);
      return s;
    }
  },
  { // 4 — cheap price, good food
    from: 4, draw(t, lt) {
      let s = hotelInterior(t);
      s += person({ kind: 'jamal', x: 540, y: 960, s: 1.15, expr: 'smile', blink: blinkAt(t, 1), look: [0, .2] });
      s += steelTable(1230) + deg(260, 1220, 1.1, t) + plate(760, 1262, 1.15);
      // highlight menu + pills
      const a = pop(t, lp(4, .05), .4), b = pop(t, lp(4, .5), .4);
      s += `<rect x="40" y="370" width="320" height="270" rx="20" fill="none" stroke="${C.amber}" stroke-width="8" opacity="${clamp(a)}"/>`;
      s += pill(270, 300, '৳ সস্তা দাম', C.amber, C.ink, a, 42) + pill(800, 300, 'ভালো রান্না', C.teal, '#fff', b, 42);
      return s;
    }
  },
  { // 5 — everyone in the area knows him
    from: 5, draw(t, lt) {
      let s = bgPaper(t);
      s += `<circle cx="540" cy="900" r="${300 + 10 * Math.sin(t * 2)}" fill="${C.amber}" opacity=".14"/>`;
      s += person({ kind: 'jamal', x: 540, y: 880, s: 1.05, expr: 'smile', blink: blinkAt(t, 2) });
      const cols = ['#2A9D8F', '#E76F51', '#457B9D', '#8E7DBE', '#E9C46A', '#6D9F71'];
      for (let i = 0; i < 6; i++) {
        const a = (-150 + i * 60) * Math.PI / 180, R = 390, p = pop(lt, .05 + i * .1, .4);
        const x = 540 + Math.cos(a) * R, y = 820 + Math.sin(a) * R * .9;
        s += `<g transform="translate(${x},${y}) scale(${p})" opacity="${clamp(p)}"><circle r="72" fill="#fff" filter="url(#shadow)"/><clipPath id="av${i}"><circle r="64"/></clipPath><g clip-path="url(#av${i})"><rect x="-70" y="-70" width="140" height="140" fill="${cols[i]}" opacity=".25"/>${crowdPerson(0, 10, .55, cols[i], ['#B07A50', '#8F5B3A', '#C68C62'][i % 3])}</g>${heartIcon(52, -40, 1, C.coral)}</g>`;
      }
      s += pill(540, 1380, 'জামাল ভাই!', '#fff', C.ink, pop(lt, .5, .4), 44);
      return s;
    }
  },
  { // 6 — one night, trouble with a customer
    from: 6, xf: true, draw(t, lt) {
      if (t < lp(6, .3)) return zoomG(540, 1000, 1.05 + lt * .03, hotelStreet(t, { night: true })) + pill(540, 300, 'এক রাতে', C.ink, '#fff', pop(lt, .05, .4), 44);
      let s = hotelInterior(t);
      s += `<rect width="${W}" height="${H}" fill="#14213D" opacity=".18"/>`;
      s += person({ kind: 'customer', x: 330, y: 980, s: 1.05, expr: 'shout', mouth: shoutMouth(t), look: [1, 0], t });
      s += person({ kind: 'waiter', x: 790, y: 1010, s: .95, expr: 'worried', look: [-1, 0], blink: blinkAt(t, 3), flip: true });
      s += steelTable(1270) + plate(330, 1310, 1);
      for (let i = 0; i < 3; i++) { const q = (t * 1.6 + i / 3) % 1; s += `<path d="M${470 + q * 120},${900 - 40 + i * 40} l40,0" stroke="${C.coral}" stroke-width="8" stroke-linecap="round" opacity="${1 - q}"/>`; }
      return s;
    }
  },
  { // 7 — Jamal shouted loudly
    from: 7, draw(t, lt) {
      let s = hotelInterior(t) + `<rect width="${W}" height="${H}" fill="#14213D" opacity=".18"/>`;
      const sh = Math.sin(t * 50) * 4;
      s += zoomG(540, 950, 1 + lt * .06, person({ kind: 'jamal', x: 540 + sh, y: 980, s: 1.55, expr: 'shout', mouth: shoutMouth(t), anger: 1, t }));
      for (let i = 0; i < 3; i++) { const q = (lt * 1.4 + i / 3) % 1; s += `<ellipse cx="540" cy="1050" rx="${200 + q * 380}" ry="${120 + q * 220}" fill="none" stroke="${C.coral}" stroke-width="${10 * (1 - q)}" opacity="${(1 - q) * .8}"/>`; }
      s += pill(540, 300, 'ধমক!', C.coral, '#fff', pop(lt, .1, .35), 60);
      return s;
    }
  },
  { // 8 — someone records that moment on a phone
    from: 8, draw(t, lt) {
      let s = hotelInterior(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".45"/>`;
      // blurred background people
      s += `<g opacity=".5">${person({ kind: 'jamal', x: 540, y: 900, s: 1.2, expr: 'shout', mouth: shoutMouth(t) })}</g>`;
      const inner = `<rect x="-172" y="-350" width="344" height="700" fill="#3A2A22"/>${person({ kind: 'jamal', x: 0, y: -40, s: .66, expr: 'shout', mouth: shoutMouth(t), anger: 1, t })}` +
        `<g transform="translate(-140,-310)"><circle r="10" fill="#E53935" opacity="${Math.sin(t * 6) > 0 ? 1 : .3}"/><text x="20" y="10" font-size="26" font-weight="700" fill="#fff">REC ০০:${bn(String(Math.min(15, Math.floor(lt * 5))).padStart(2, '0'))}</text></g>` +
        `<rect x="-120" y="-200" width="240" height="300" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="20 200" opacity=".8"/>`;
      const p = eo(prog(lt, 0, .5));
      s += `<g transform="translate(0,${(1 - p) * 500})">${hand(640, 1500, 1.6, -6)}${phone(560, 1080, 1.05, inner, -6)}</g>`;
      s += pill(540, 300, 'শুধু এই মুহূর্তটুকু', C.amber, C.ink, pop(lt, .6, .4), 42);
      return s;
    }
  },
  { // 9 — posted on Facebook
    from: 9, draw(t, lt) {
      let s = bgInk(t);
      const up = eo(prog(lt, .05, .9));
      const done = lt > 1.0;
      const inner = `<rect x="-172" y="-350" width="344" height="700" fill="#F0F2F5"/><rect x="-172" y="-350" width="344" height="80" fill="#3B5BA9"/><text x="-150" y="-298" font-size="30" font-weight="700" fill="#fff">নতুন পোস্ট</text>
        <rect x="-150" y="-240" width="300" height="230" rx="12" fill="#3A2A22"/>${'<g transform="translate(0,-90)">' + person({ kind: 'jamal', x: 0, y: -20, s: .38, expr: 'shout', mouth: .7 }) + '</g>'}
        <rect x="-150" y="20" width="300" height="20" rx="10" fill="#DDE1E7"/><rect x="-150" y="20" width="${300 * up}" height="20" rx="10" fill="${C.teal}"/>
        <text x="0" y="100" text-anchor="middle" font-size="32" font-weight="700" fill="${done ? C.teal : C.ink}">${done ? '✓ পোস্ট হয়েছে' : 'আপলোড হচ্ছে...'}</text>`;
      s += phone(540, 900, 1.25, inner, 0);
      for (let i = 0; i < 8; i++) { const q = prog(lt, 1.0 + i * .06, .8); if (q <= 0 || q >= 1) continue; const a = i * 45 * Math.PI / 180; s += `<g transform="translate(${540 + Math.cos(a) * q * 560},${900 + Math.sin(a) * q * 560})" opacity="${1 - q}"><path d="M-22,10 L0,-16 L22,10 M0,-16 V22" stroke="${C.amber}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`; }
      return s;
    }
  },
  { // 10 — next morning, 1 million views
    from: 10, xf: true, draw(t, lt) {
      let s = bgPaper(t);
      s += pill(540, 280, 'পরদিন সকালে', C.amber, C.ink, pop(lt, 0, .4), 42);
      const v = 1000000 * eio(prog(lt, .3, Math.max(.6, L(10).e - L(10).s - .3)));
      s += feedCard(540, 800, 1, { thumb: `<g transform="translate(0,0)"><rect x="-410" y="-200" width="820" height="400" rx="16" fill="#3A2A22"/>${person({ kind: 'jamal', x: 0, y: -30, s: .7, expr: 'shout', mouth: .7 })}</g>`, views: '', meta: '' });
      s += `<g transform="translate(540,1240)">${eyeIcon(-250, -20, 1.6, C.ink)}<text x="30" y="0" text-anchor="middle" font-size="96" font-weight="700" fill="${C.coral}">${lakh(v)}</text><text x="30" y="70" text-anchor="middle" font-size="40" font-weight="600" fill="${C.ink}">ভিউ</text></g>`;
      return s;
    }
  },
  { // 11 — comments: "rude owner", "boycott"
    from: 11, draw(t, lt) {
      let s = bgPaper(t);
      s += `<g opacity=".35">${feedCard(540, 520, .8, { thumb: `<rect x="-410" y="-200" width="820" height="400" rx="16" fill="#3A2A22"/>${person({ kind: 'jamal', x: 0, y: -30, s: .7, expr: 'shout', mouth: .7 })}` })}</g>`;
      const a = pop(t, L(11).s, .4), b = pop(t, L(12).s, .4);
      s += `<g opacity="${clamp(a)}" transform="translate(0,${(1 - clamp(a)) * 40})">${commentRow(600, 960, 1.2, '#E76F51', 'ফেসবুক ইউজার', 'অভদ্র মালিক।', { w: 440, textCol: C.coral })}</g>`;
      s += `<g opacity="${clamp(b)}" transform="translate(0,${(1 - clamp(b)) * 40})">${commentRow(600, 1160, 1.2, '#457B9D', 'ফেসবুক ইউজার', 'এই হোটেল বয়কট করুন।', { w: 620, textCol: C.coral })}</g>`;
      const st = prog(t, lp(12, .55), .22);
      if (st > 0) s += `<g opacity="${clamp(st * 2)}">${stamp(620, 650, lerp(1.6, 1.05, eo(st)), 'বয়কট', C.coral, -10)}</g>`;
      return s;
    }
  },
  { // 12 — Jamal angrily replies
    from: 13, draw(t, lt) {
      let s = bgPaper(t);
      s += person({ kind: 'jamal', x: 540, y: 820, s: 1.2, expr: 'angry', look: [0, 1], anger: 1, t });
      const typed = '!!! ... !!!';
      const n = Math.floor(clamp(prog(lt, .4, 1.6)) * typed.length);
      const inner = `<rect x="-172" y="-350" width="344" height="700" fill="#F0F2F5"/><text x="-150" y="-290" font-size="28" font-weight="700" fill="${C.ink}">কমেন্ট লিখুন...</text><rect x="-155" y="-250" width="310" height="140" rx="20" fill="#fff" stroke="${C.coral}" stroke-width="4"/><text x="-135" y="-190" font-size="30" font-weight="600" fill="${C.coral}">${typed.slice(0, n)}${Math.sin(t * 8) > 0 ? '|' : ''}</text>`;
      s += `<g transform="translate(0,${(1 - eo(prog(lt, 0, .5))) * 400})">${phone(540, 1520, .95, inner, 0)}</g>`;
      return s;
    }
  },
  { // 13 — fights in the comments, abuse for abuse
    from: 14, dark: true, draw(t, lt) {
      let s = bgInk(t);
      const rows = [['l', '#@$%!'], ['r', '%&#@!'], ['l', '@#!!'], ['r', '#$%@&!'], ['l', '!!@#$']];
      rows.forEach(([side, txt], i) => {
        const p = pop(lt, .15 + i * .32, .3);
        const x = side === 'l' ? 330 : 750, y = 420 + i * 200;
        s += `<g transform="translate(${x},${y}) scale(${p})" opacity="${clamp(p)}">${bubble(-220, -60, 440, 120, side === 'l' ? '#fff' : '#FFE1DA', side === 'l' ? '#fff' : '#FFE1DA', side === 'l' ? 'left' : 'right')}<text y="18" text-anchor="middle" font-size="58" font-weight="700" fill="${C.coral}">${txt}</text></g>`;
        s += `<g transform="translate(${side === 'l' ? 70 : 1010},${y})" opacity="${clamp(p)}"><circle r="44" fill="${side === 'l' ? '#E8962B' : '#6C7A99'}"/>${side === 'l' ? '<text y="14" text-anchor="middle" font-size="34" font-weight="700" fill="#fff">জা</text>' : ''}</g>`;
      });
      return s;
    }
  },
  { // 14 — the more he wrote… "look at his temper"
    from: 15, draw(t, lt) {
      let s = bgPaper(t);
      const n = Math.min(6, Math.floor(prog(t, L(15).s, L(15).e - L(15).s) * 6) + 1);
      for (let i = 0; i < n; i++) s += `<g opacity="${.45 + .1 * i}">${commentRow(600, 400 + i * 110, .85, '#E8962B', 'জামাল হোটেল', '!!! ... !!!', { w: 560, textCol: C.coral })}</g>`;
      s += pill(860, 290, `উত্তর: ${bn(n)}`, C.coral, '#fff', 1, 34);
      const b = pop(t, L(16).s, .4);
      s += `<g opacity="${clamp(b)}" transform="translate(540,1150) scale(${b}) translate(-540,-1150)">${commentRow(600, 1150, 1.2, '#2A9D8F', 'ফেসবুক ইউজার', 'দেখেন, এখনো কেমন মেজাজ।', { w: 640, textCol: C.coral, bg: '#fff' })}</g>`;
      for (let i = 0; i < 5; i++) { const q = prog(t, L(16).s + .3 + i * .12, 1); if (q <= 0 || q >= 1) continue; s += `<g opacity="${1 - q}">${heartIcon(780 + i * 30, 1120 - q * 300, 1.4, i % 2 ? C.coral : C.amber)}</g>`; }
      return s;
    }
  },
  { // 15 — in a week the shop is nearly empty
    from: 17, xf: true, draw(t, lt) {
      let s = hotelInterior(t * .3) + `<rect width="${W}" height="${H}" fill="#3A4256" opacity=".25"/>`;
      s += person({ kind: 'jamal', x: 760, y: 1000, s: .95, expr: 'sad', look: [-.6, .6], blink: blinkAt(t, 4) });
      s += steelTable(1270) + `<g opacity=".7">${plate(250, 1300, .9)}</g>`;
      s += pill(270, 300, 'এক সপ্তাহ', C.ink, '#fff', pop(lt, 0, .4), 42);
      // falling customer bar
      const p = eo(prog(lt, .3, 1.2));
      s += `<g transform="translate(200,760)"><rect width="40" height="300" rx="10" fill="#E8E1D3" transform="translate(0,-300)"/><rect y="${-300 * (1 - p * .9)}" width="40" height="${300 * (1 - p * .9)}" rx="10" fill="${C.coral}"/><text x="20" y="50" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}">কাস্টমার</text></g>`;
      return s;
    }
  },
  { // 16 — his daughter speaks
    from: 18, draw(t, lt) {
      let s = hotelInterior(t * .3) + `<rect width="${W}" height="${H}" fill="#F6EFE4" opacity=".35"/>`;
      const dIn = eo(prog(lt, 0, .5));
      s += person({ kind: 'jamal', x: 300, y: 1000, s: .95, expr: t > L(19).s + .8 ? 'worried' : 'sad', look: [1, 0], blink: blinkAt(t, 4) });
      s += `<g transform="translate(${(1 - dIn) * 400},0)" opacity="${dIn}">${person({ kind: 'daughter', x: 790, y: 1000, s: 1.0, expr: 'calm', mouth: speakMouth(t, [19]), look: [-1, 0], blink: blinkAt(t, 5) })}</g>`;
      s += steelTable(1290);
      // phone put down + X
      if (t > lp(19, .5)) { const q = pop(t, lp(19, .5), .4); s += `<g opacity="${clamp(q)}">${phone(540, 560, .3 * q, '<rect x="-172" y="-350" width="344" height="700" fill="#F0F2F5"/>', 0)}${crossIcon(600, 470, 1.1 * q, C.coral)}</g>`; }
      return s;
    }
  },
  { // 17 — CCTV full footage
    from: 20, xf: true, draw(t, lt) {
      let s = hotelInterior(t);
      const e = eio(prog(lt, .1, 1.3)), z = lerp(1, 2.6, e);
      s = `<g transform="translate(${lerp(0, 540 - 970 * 2.6, e) / (e ? 1 : 1)},${lerp(0, 760 - 210 * 2.6, e)}) scale(${z})">${s}${cctv(970, 210, 1, t, true)}</g>`;
      const p = eo(prog(t, lp(20, .5), .5));
      s += `<g opacity="${p}"><rect width="${W}" height="${H}" fill="#14213D" opacity=".97"/>
        <g transform="translate(540,880)"><rect x="-440" y="-300" width="880" height="560" rx="20" fill="#20263A"/><rect x="-410" y="-270" width="820" height="460" rx="10" fill="#0F2E2D"/>
        ${[0, 1, 2, 3].map(i => `<rect x="${-400 + (i % 2) * 410}" y="${-262 + Math.floor(i / 2) * 228}" width="400" height="220" fill="#173F3D"/><text x="${-390 + (i % 2) * 410}" y="${-232 + Math.floor(i / 2) * 228}" font-size="22" font-weight="700" fill="#9FE3D6">CAM ০${bn(i + 1)}</text>`).join('')}
        <rect x="-400" y="-262" width="400" height="220" fill="none" stroke="${C.amber}" stroke-width="6"/>
        <rect x="-60" y="260" width="120" height="60" fill="#20263A"/><rect x="-200" y="318" width="400" height="20" rx="10" fill="#20263A"/></g></g>`;
      s += `<g opacity="${p}">${person({ kind: 'daughter', x: 820, y: 1380, s: .75, expr: 'stern', look: [-1, -.5], blink: blinkAt(t, 5) })}</g>`;
      s += pill(540, 300, 'পুরো ফুটেজ', C.amber, C.ink, pop(t, lp(20, .55), .4), 44);
      return s;
    }
  },
  { // 18 — no anger, no complaint
    from: 21, draw(t, lt) {
      let s = bgPaper(t);
      s += person({ kind: 'daughter', x: 540, y: 1000, s: 1.3, expr: 'calm', blink: blinkAt(t, 5) });
      const a = pop(t, L(21).s + .1, .4), b = pop(t, lp(21, .5), .4);
      s += `<g transform="translate(300,420) scale(${a})" opacity="${clamp(a)}"><rect x="-200" y="-60" width="400" height="120" rx="60" fill="#fff" filter="url(#shadow)"/><text x="20" y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${C.ink}">রাগ</text>${crossIcon(-130, 0, .8, C.coral)}</g>`;
      s += `<g transform="translate(780,420) scale(${b})" opacity="${clamp(b)}"><rect x="-220" y="-60" width="440" height="120" rx="60" fill="#fff" filter="url(#shadow)"/><text x="30" y="16" text-anchor="middle" font-size="44" font-weight="700" fill="${C.ink}">অভিযোগ</text>${crossIcon(-150, 0, .8, C.coral)}</g>`;
      return s;
    }
  },
  { // 19 — posts the full 3-minute video
    from: 22, draw(t, lt) {
      let s = bgPaper(t);
      const a = eo(prog(lt, .1, .6)), b = eo(prog(lt, .6, 1.0));
      s += `<g opacity="${a}">${clipBar(120, 520, 840, .083, 'ভাইরাল ক্লিপ · ১৫ সেকেন্ড', C.coral)}</g>`;
      s += `<g opacity="${b > 0 ? 1 : 0}">${clipBar(120, 700, 840, b, 'পুরো ফুটেজ · ৩ মিনিট', C.teal)}</g>`;
      const p = pop(lt, 1.4, .4), click = lt > 1.9 && lt < 2.05;
      s += `<g transform="translate(540,1000) scale(${p * (click ? .92 : 1)})" opacity="${clamp(p)}"><rect x="-200" y="-60" width="400" height="120" rx="60" fill="${C.teal}"/><text y="18" text-anchor="middle" font-size="52" font-weight="700" fill="#fff">${lt > 2.05 ? '✓ পোস্ট হয়েছে' : 'পোস্ট করুন'}</text></g>`;
      const c = eo(prog(lt, 1.5, .4));
      if (c > 0) s += `<g transform="translate(${lerp(820, 600, c)},${lerp(1250, 1020, c)})">${cursor()}</g>`;
      return s;
    }
  },
  { // 20 — CCTV: customer insulting the young waiter, trying to hit
    from: 23, draw(t, lt) {
      let s = hotelInterior(t);
      const hit = t > L(25).s;
      const armA = hit ? lerp(35, 70, (Math.sin((t - L(25).s) * 6) + 1) / 2) : 0;
      s += person({ kind: 'waiter', x: 770, y: 1010, s: .95, expr: hit ? 'worried' : 'sad', look: [-1, hit ? -.4 : .6], flip: true, blink: blinkAt(t, 3) });
      s += person({ kind: 'customer', x: 330, y: 980, s: 1.05, expr: 'shout', mouth: shoutMouth(t), look: [1, 0] });
      if (hit) s += raisedArm(470, 1230, 1.0, armA);
      s += steelTable(1290);
      s += cctvOverlay(t);
      if (t > L(24).s) s += pill(780, 640, 'অপমান', C.coral, '#fff', pop(t, L(24).s + .2, .4), 40);
      if (hit) s += pill(420, 640, 'গায়ে হাত!', C.coral, '#fff', pop(t, L(25).s + .1, .4), 40);
      s += pill(540, 1380, 'পুরো ঘটনা', '#ffffffdd', C.ink, pop(lt, .1, .4), 34);
      return s;
    }
  },
  { // 21 — Jamal shouted to save the boy
    from: 26, draw(t, lt) {
      let s = hotelInterior(t);
      s += person({ kind: 'waiter', x: 860, y: 1050, s: .82, expr: 'worried', look: [-1, 0], flip: true });
      s += person({ kind: 'customer', x: 220, y: 1000, s: .9, expr: 'worried', look: [1, 0], sweat: 1, t });
      s += person({ kind: 'jamal', x: 570, y: 990, s: 1.0, expr: 'shout', mouth: shoutMouth(t), look: [-1, 0], t });
      s += steelTable(1300) + cctvOverlay(t);
      const p = pop(t, lp(26, .45), .45);
      s += `<g opacity="${clamp(p)}">${shieldIcon(780, 640, p * 1.1, C.teal)}</g>`;
      s += pill(540, 1400, 'ছেলেটাকে বাঁচাতে', C.teal, '#fff', p, 42);
      return s;
    }
  },
  { // 22 — in two days everything turned around
    from: 27, xf: true, draw(t, lt) {
      let s = bgPaper(t);
      s += pill(540, 300, 'দুই দিন পর', C.ink, '#fff', pop(lt, 0, .4), 42);
      const f = eio(prog(lt, .4, .9));
      // sentiment meter
      s += `<g transform="translate(540,900)"><path d="M-340,0 A340,340 0 0 1 340,0" fill="none" stroke="#E8E1D3" stroke-width="60"/><path d="M-340,0 A340,340 0 0 1 0,-340" fill="none" stroke="${C.coral}" stroke-width="60" opacity=".85"/><path d="M0,-340 A340,340 0 0 1 340,0" fill="none" stroke="${C.teal}" stroke-width="60" opacity=".85"/>
        <g transform="rotate(${lerp(-70, 70, f)})"><path d="M-14,0 L0,-290 L14,0Z" fill="${C.ink}"/></g><circle r="34" fill="${C.ink}"/>
        <text x="-340" y="80" text-anchor="middle" font-size="40" font-weight="700" fill="${C.coral}">ঘৃণা</text><text x="340" y="80" text-anchor="middle" font-size="40" font-weight="700" fill="${C.teal}">সম্মান</text></g>`;
      for (let i = 0; i < 6; i++) { const q = prog(t, lp(27, .6) + i * .1, 1); if (q <= 0 || q >= 1) continue; s += `<g opacity="${1 - q}">${heartIcon(700 + (i % 3) * 60, 1150 - q * 320, 1.6, C.teal)}</g>`; }
      return s;
    }
  },
  { // 23 — the boycotters now queue up to eat
    from: 28, draw(t, lt) {
      let s = `<g transform="translate(0,-230)">${hotelStreet(t, {})}</g><rect y="1400" width="${W}" height="520" fill="#7E7B75"/>`;
      const st = prog(t, L(28).s + .2, .3);
      if (t < lp(28, .5)) s += `<g opacity="${clamp(st * 2)}">${stamp(540, 420, lerp(1.6, 1, eo(st)), 'বয়কট', C.coral, -10)}</g>`;
      else { const q = eo(prog(t, lp(28, .5), .3)); s += `<g opacity="${1 - q}">${stamp(540, 420, 1, 'বয়কট', C.coral, -10)}</g>`; }
      const cols = ['#2A9D8F', '#E76F51', '#457B9D', '#8E7DBE', '#E9C46A', '#6D9F71', '#B5838D'];
      for (let i = 0; i < 7; i++) {
        const p = eo(prog(t, lp(28, .45) + i * .12, .6));
        s += crowdPerson(lerp(1300, 250 + i * 115, p), 1150 - (i % 2) * 8, .95, cols[i], ['#B07A50', '#8F5B3A', '#C68C62', '#A9714B'][i % 4]);
      }
      s += `<g transform="translate(0,0)">${person({ kind: 'jamal', x: 110, y: 1010, s: .55, expr: 'smile', blink: blinkAt(t, 1) })}</g>`;
      s += pill(540, 250, 'লাইন ধরে খেতে এল', C.teal, '#fff', pop(t, lp(28, .55), .4), 42);
      return s;
    }
  },
  { // 24 — 48 Laws, Law 5
    from: 29, xf: true, dark: true, draw(t, lt) {
      const l30 = L(30), l31 = L(31);
      let s = bgInk(t);
      const up = eo(prog(t, l30.s - .1, .6)), bp = eo(prog(lt, .1, .7));
      s += `<g transform="translate(540,${lerp(900, 430, up)}) scale(${lerp(1, .5, up)}) rotate(${lerp(-6, 0, bp)})" opacity="${bp}">
        <rect x="-250" y="-340" width="500" height="680" rx="14" fill="#1F3A2E"/><rect x="-250" y="-340" width="40" height="680" rx="8" fill="#16291F"/>
        <rect x="-200" y="-300" width="420" height="600" fill="none" stroke="${C.amber}" stroke-width="4"/>
        <text x="10" y="-180" text-anchor="middle" font-size="30" font-weight="600" fill="${C.amber}" letter-spacing="6">ROBERT GREENE</text>
        <text x="10" y="-40" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">The 48</text><text x="10" y="50" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Laws of</text><text x="10" y="140" text-anchor="middle" font-size="84" font-weight="700" fill="#F6EFE4">Power</text>
        <rect x="-40" y="200" width="100" height="5" fill="${C.amber}"/></g>`;
      const p = pop(t, l30.s + .1, .45);
      s += `<g transform="translate(540,900) scale(${p})" opacity="${clamp(p)}"><rect x="-150" y="-80" width="300" height="160" rx="24" fill="${C.amber}"/><text y="30" text-anchor="middle" font-size="96" font-weight="700" fill="${C.ink}">LAW 5</text></g>`;
      const q1 = eo(prog(t, lp(30, .3), .5)), q2 = eo(prog(t, lp(30, .65), .5));
      s += `<text x="540" y="${1070 + (1 - q1) * 30}" text-anchor="middle" font-size="44" font-weight="600" fill="#fff" opacity="${q1}">So Much Depends on Reputation –</text>`;
      s += `<text x="540" y="${1140 + (1 - q2) * 30}" text-anchor="middle" font-size="50" font-weight="700" fill="${C.amber}" opacity="${q2}">Guard It with Your Life.</text>`;
      const r = eo(prog(t, l31.s, .5));
      s += `<g opacity="${r}" transform="translate(0,${(1 - r) * 30})">${shieldIcon(540, 1330, .8, C.teal)}<text x="540" y="1520" text-anchor="middle" font-size="64" font-weight="700" fill="#fff">সুনামকে <tspan fill="${C.amber}">জীবনের মতো</tspan> রক্ষা করো।</text></g>`;
      return s;
    }
  },
  { // 25 — people don't see the whole story; believe the first thing
    from: 32, draw(t, lt) {
      let s = bgPaper(t);
      // film strip = full 3 min; only a small part visible
      const N = 12;
      s += `<g transform="translate(540,700)"><rect x="-500" y="-110" width="1000" height="220" rx="12" fill="#20263A"/>`;
      for (let i = 0; i < N; i++) { s += `<rect x="${-480 + i * 80}" y="-80" width="70" height="160" rx="6" fill="#3A4560"/>`; }
      for (let i = 0; i < 24; i++) s += `<rect x="${-490 + i * 42}" y="-102" width="22" height="14" rx="3" fill="#F6EFE4"/><rect x="${-490 + i * 42}" y="88" width="22" height="14" rx="3" fill="#F6EFE4"/>`;
      const hi = eo(prog(lt, .2, .5));
      s += `<rect x="-490" y="-120" width="1000" height="240" fill="${C.paper}" opacity="${hi * .75}"/><rect x="${-480 + 7 * 80 - 6}" y="-92" width="${2 * 80 + 2}" height="184" rx="10" fill="none" stroke="${C.coral}" stroke-width="8" opacity="${hi}"/></g>`;
      s += `<g opacity="${hi}">${eyeIcon(720, 470, 2.2, C.ink)}</g>`;
      s += `<text x="540" y="920" text-anchor="middle" font-size="44" font-weight="700" fill="${C.mute}" opacity="${hi}">পুরো ঘটনা · ৩ মিনিট</text>`;
      if (t > L(33).s) {
        const p = pop(t, L(33).s + .1, .45);
        s += `<g transform="translate(540,1180) scale(${p})" opacity="${clamp(p)}"><rect x="-430" y="-90" width="860" height="180" rx="30" fill="#fff" filter="url(#shadow)"/><text x="-200" y="18" text-anchor="middle" font-size="52" font-weight="700" fill="${C.coral}">প্রথম দেখা</text><text x="30" y="18" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">=</text><text x="230" y="18" text-anchor="middle" font-size="52" font-weight="700" fill="${C.ink}">বিশ্বাস</text></g>`;
      }
      return s;
    }
  },
  { // 26 — show anger → they think the accusation is true
    from: 34, draw(t, lt) {
      let s = bgPaper(t);
      s += person({ kind: 'jamal', x: 330, y: 960, s: 1.0, expr: 'shout', mouth: shoutMouth(t), anger: 1, t });
      const p = pop(lt, .7, .45);
      s += `<g transform="translate(780,760) scale(${p})" opacity="${clamp(p)}"><rect x="-230" y="-120" width="460" height="240" rx="30" fill="#fff" filter="url(#shadow)"/><text y="-20" text-anchor="middle" font-size="46" font-weight="700" fill="${C.ink}">অভিযোগ</text><text y="60" text-anchor="middle" font-size="58" font-weight="700" fill="${C.coral}">সত্যি!</text></g>`;
      s += `<path d="M520,800 Q580,760 560,760" stroke="${C.mute}" stroke-width="6" fill="none" opacity="${clamp(p)}"/>`;
      return s;
    }
  },
  { // 27 — don't shout; bring the truth calmly
    from: 35, xf: true, draw(t, lt) {
      let s = bgPaper(t);
      const a = eo(prog(lt, .1, .5)), b = eo(prog(t, L(36).s, .5));
      s += `<g opacity="${a}" transform="translate(0,${(1 - a) * 40})"><rect x="80" y="280" width="920" height="520" rx="34" fill="#fff" filter="url(#shadow)"/><clipPath id="cA"><rect x="80" y="280" width="920" height="520" rx="34"/></clipPath><g clip-path="url(#cA)">${person({ kind: 'jamal', x: 320, y: 600, s: .8, expr: 'shout', mouth: shoutMouth(t) })}</g>${crossIcon(160, 360, 1.1, C.coral)}<text x="760" y="560" text-anchor="middle" font-size="76" font-weight="700" fill="${C.coral}">চিৎকার</text></g>`;
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 40})"><rect x="80" y="860" width="920" height="560" rx="34" fill="#fff" filter="url(#shadow)" stroke="${C.teal}" stroke-width="6"/><clipPath id="cB"><rect x="80" y="860" width="920" height="560" rx="34"/></clipPath><g clip-path="url(#cB)">${person({ kind: 'daughter', x: 320, y: 1190, s: .8, expr: 'calm', blink: blinkAt(t, 5) })}</g>${checkIcon(160, 940, 1.1, C.teal)}<text x="760" y="1110" text-anchor="middle" font-size="58" font-weight="700" fill="${C.teal}">ঠান্ডা মাথায়</text><text x="760" y="1190" text-anchor="middle" font-size="58" font-weight="700" fill="${C.ink}">সত্যটা সামনে</text></g>`;
      return s;
    }
  },
  { // 28 — live so that even with the camera on, nothing to fear
    from: 37, draw(t, lt) {
      let s = hotelInterior(t);
      s += person({ kind: 'jamal', x: 420, y: 990, s: 1.05, expr: 'smile', blink: blinkAt(t, 1), look: [.6, 0] });
      s += person({ kind: 'waiter', x: 820, y: 1030, s: .85, expr: 'smile', look: [-1, 0], flip: true, blink: blinkAt(t, 3) });
      s += steelTable(1290) + plate(420, 1330, 1) + plate(820, 1330, .9);
      const z = t > L(38).s ? eo(prog(t, L(38).s, .6)) : 0;
      s += `<g opacity="${z}"><circle cx="970" cy="210" r="${150 + 10 * Math.sin(t * 4)}" fill="${C.amber}" opacity=".3"/></g>`;
      s += `<g transform="translate(800,150)" opacity="${z}"><rect x="-90" y="-36" width="180" height="72" rx="36" fill="#E53935"/><text y="12" text-anchor="middle" font-size="34" font-weight="700" fill="#fff">● REC</text></g>`;
      const p = pop(t, lp(38, .55), .45);
      s += `<g opacity="${clamp(p)}">${shieldIcon(200, 300, p * .8, C.teal)}</g>`;
      return s;
    }
  },
  { // 29 — CTA question
    from: 39, xf: true, draw(t, lt) {
      let s = bgPaper(t);
      const a = eo(prog(lt, .1, .5)), b = eo(prog(t, L(40).s, .5));
      s += `<g opacity="${a}" transform="translate(0,${(1 - a) * 30})"><text x="540" y="380" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">আপনি কি কখনো কোনো</text><text x="540" y="470" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">ভাইরাল ভিডিও দেখে</text></g>`;
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 30})"><text x="540" y="560" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">না জেনেই কাউকে <tspan fill="${C.coral}">বিচার</tspan> করেছেন?</text></g>`;
      const ph = `<rect x="-172" y="-350" width="344" height="700" fill="#3A2A22"/>${person({ kind: 'jamal', x: 0, y: -40, s: .6, expr: 'shout', mouth: shoutMouth(t) })}<text x="0" y="300" text-anchor="middle" font-size="30" font-weight="700" fill="#fff">ভাইরাল!</text>`;
      s += `<g opacity="${a}">${phone(540, 1150, .85, ph, -4)}</g>`;
      const p = pop(t, L(41).s - .1, .4);
      s += `<g transform="translate(540,720) scale(${p})" opacity="${clamp(p)}"><rect x="-260" y="-58" width="520" height="116" rx="58" fill="${C.teal}"/><path d="M-200,-22 h60 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-34 l-16,14 v-14 h-10 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12z" fill="#fff"/><text x="30" y="18" text-anchor="middle" font-size="50" font-weight="700" fill="#fff">কমেন্টে লিখুন</text></g>`;
      const c = eo(prog(t, L(41).s + .2, .4));
      if (c > 0) s += `<g transform="translate(${lerp(820, 660, c)},${lerp(920, 760, c)}) scale(${t > L(41).s + .6 && t < L(41).s + .75 ? .85 : 1})">${cursor()}</g>`;
      return s;
    }
  },
  { // 30 — end card
    from: 42, dark: true, draw(t, lt) {
      let s = bgInk(t);
      s += `<g transform="translate(540,760) scale(${pop(lt, .05, .5)})">${orbitLogo(t, 120)}</g>`;
      const b = eo(prog(lt, .3, .5));
      s += `<g opacity="${b}" transform="translate(0,${(1 - b) * 30})"><text x="540" y="1020" text-anchor="middle" font-size="96" font-weight="700" fill="#fff">${BRAND}</text><text x="540" y="1100" text-anchor="middle" font-size="40" font-weight="500" fill="#ffffffaa">গল্পে গল্পে জীবনের কৌশল</text></g>`;
      const p = pop(lt, .7, .45), clicked = lt > 1.65;
      s += `<g transform="translate(540,1280) scale(${p * (lt > 1.5 && lt < 1.65 ? .92 : 1)})" opacity="${clamp(p)}"><rect x="${clicked ? -290 : -210}" y="-62" width="${clicked ? 580 : 420}" height="124" rx="62" fill="${clicked ? '#fff' : C.amber}"/><text y="20" text-anchor="middle" font-size="54" font-weight="700" fill="${C.ink}">${clicked ? '✓ ফলো করা হয়েছে' : '+ ফলো করুন'}</text></g>`;
      const c = eo(prog(lt, .9, .55));
      if (c > 0) s += `<g transform="translate(${lerp(820, 600, c)},${lerp(1500, 1300, c)})">${cursor()}</g>`;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${eo(prog(t, LINES[LINES.length - 1].e + 1.1, .6))}"/>`;
      return s;
    }
  }
];

// ---------- timeline ----------
function sceneStart(i) { return i === 0 ? 0 : Math.max(0, L(SCENES[i].from).s - .08); }
function sceneAt(t) { let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= sceneStart(i)) k = i; return k; }
const DEFS = `<defs>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0"/></filter>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="gInk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2B50"/><stop offset="1" stop-color="#0E1730"/></linearGradient>
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFDDE6"/><stop offset="1" stop-color="#F6EFE4"/></linearGradient>
<linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101833"/><stop offset="1" stop-color="#2E2A44"/></linearGradient>
<linearGradient id="gShop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
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
