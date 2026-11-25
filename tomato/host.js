// Narrator character, drawn after the channel owner's photo: thick tousled dark hair,
// full short beard + moustache, grey/black/white camo quarter-zip, black wristwatch.
// host({mouth:0..1, pose:'clasp'|'point'|'shrug'|'wave', brow:-1..1, blink:0..1, t}) -> SVG
(function () {
  const INK = '#0a0f1c', SKIN = '#9c6440', SKIN_D = '#7d4c2e', HAIR = '#141010', BEARD = '#1b1412';
  const TOP = '#c9ccd1';

  function arm(x0, y0, x1, y1, x2, y2, watch = false) {
    let w = '';
    if (watch) {
      const a = Math.atan2(y2 - y1, x2 - x1), wx = x1 + (x2 - x1) * 0.78, wy = y1 + (y2 - y1) * 0.78;
      w = `<rect x="${wx - 13}" y="${wy - 9}" width="26" height="18" rx="4" fill="#111" stroke="${INK}" stroke-width="3" transform="rotate(${a * 57.3 + 90} ${wx} ${wy})"/>`;
    }
    return `
      <path d="M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}" stroke="url(#camo)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      ${w}
      <circle cx="${x2}" cy="${y2}" r="18" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>`;
  }

  const DEFS = `<defs>
    <pattern id="camo" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect width="90" height="90" fill="${TOP}"/>
      <path d="M5 10 Q25 0 38 14 Q30 30 12 26 Z" fill="#3b3f47"/>
      <path d="M50 40 Q72 30 84 48 Q70 62 52 56 Z" fill="#2a2d33"/>
      <path d="M10 60 Q22 50 36 62 Q30 80 14 76 Z" fill="#f2f3f5"/>
      <path d="M58 4 Q74 2 80 16 Q66 22 56 14 Z" fill="#f2f3f5"/>
      <path d="M30 40 Q42 34 46 46 Q38 52 30 48 Z" fill="#6b707a"/>
      <path d="M62 70 Q78 66 86 80 Q72 88 60 82 Z" fill="#6b707a"/>
    </pattern></defs>`;

  window.host = function ({ mouth = 0, pose = 'clasp', brow = 0, blink = 0, t = 0 } = {}) {
    const bob = Math.sin(t * 2.2) * 3;
    let arms = '';
    if (pose === 'point') {
      arms = arm(92, 258, 62, 330, 104, 372) + arm(208, 258, 262, 200, 276, 116, true) +
        `<path d="M276 116 L282 80" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="M276 116 L282 80" stroke="${SKIN}" stroke-width="9" stroke-linecap="round"/>`;
    } else if (pose === 'shrug') {
      arms = arm(92, 258, 40, 302, 22, 238) + arm(208, 258, 260, 302, 278, 238, true);
    } else if (pose === 'wave') {
      const w = Math.sin(t * 9) * 14;
      arms = arm(92, 258, 62, 330, 104, 372) + arm(208, 258, 262, 212, 282 + w, 132, true);
    } else { // hands clasped in front, like the photo
      arms = arm(92, 258, 70, 340, 136, 352) + arm(208, 258, 230, 340, 164, 352, true) +
        `<ellipse cx="150" cy="350" rx="30" ry="20" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>
         <path d="M134 342 L146 356 M146 340 L158 356 M158 340 L168 352" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    }
    const m = Math.max(0, Math.min(1, mouth));
    const mouthSvg = m < 0.08
      ? `<path d="M138 196 Q150 200 162 196" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="150" cy="${197 + m * 3}" rx="${11 + m * 3}" ry="${3 + m * 10}" fill="#4a1a1a" stroke="${INK}" stroke-width="4"/>
         <ellipse cx="150" cy="${201 + m * 7}" rx="${6 + m * 2}" ry="${1 + m * 4}" fill="#d85a5a"/>`;
    const by = -brow * 5;
    const eyeH = 9 * (1 - Math.max(0, Math.min(1, blink)));
    const eye = (cx) => eyeH < 1.5
      ? `<path d="M${cx - 13} 138 H${cx + 13}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
      : `<ellipse cx="${cx}" cy="138" rx="14" ry="${eyeH}" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
         <circle cx="${cx + 1}" cy="138" r="${Math.min(7, eyeH)}" fill="#2a1a12"/><circle cx="${cx + 3}" cy="136" r="2" fill="#fff"/>`;
    return `<svg viewBox="0 0 300 430" width="100%" height="100%" overflow="visible">${DEFS}
      <g transform="translate(0 ${bob})">
        <path d="M58 430 L60 305 Q64 248 112 236 L188 236 Q236 248 240 305 L242 430 Z" fill="url(#camo)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M120 234 L150 262 L180 234 L178 222 L122 222 Z" fill="url(#camo)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M150 262 V430" stroke="#555a63" stroke-width="5"/><rect x="144" y="268" width="12" height="18" rx="3" fill="#9aa0a8" stroke="${INK}" stroke-width="2.5"/>
        ${arms}
        <path d="M128 196 V230 H172 V196 Z" fill="${SKIN_D}" stroke="${INK}" stroke-width="5"/>
        <ellipse cx="93" cy="148" rx="12" ry="19" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>
        <ellipse cx="207" cy="148" rx="12" ry="19" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>
        <path d="M97 112 Q98 70 150 68 Q202 70 203 112 L201 168 Q197 222 150 226 Q103 222 99 168 Z" fill="${SKIN}" stroke="${INK}" stroke-width="6"/>
        <path d="M99 150 Q100 226 150 230 Q200 226 201 150 Q196 192 176 204 Q150 214 124 204 Q104 192 99 150 Z" fill="${BEARD}"/>
        <path d="M124 182 Q150 170 176 182 Q170 192 150 188 Q130 192 124 182 Z" fill="${BEARD}"/>
        ${mouthSvg}
        <path d="M150 140 L143 168 Q150 172 158 168" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        ${eye(126)}${eye(174)}
        <path d="M108 ${120 + by} Q126 ${110 + by} 144 ${118 + by}" stroke="${HAIR}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M156 ${118 + by} Q174 ${110 + by} 192 ${120 + by}" stroke="${HAIR}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M90 132 Q78 92 96 70 Q92 46 120 40 Q132 18 160 26 Q186 16 200 38 Q226 48 216 78 Q224 104 208 132 Q206 104 192 96 Q186 110 172 100 Q160 112 146 100 Q132 112 120 100 Q106 108 100 98 Q92 112 90 132 Z" fill="${HAIR}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
        <g stroke="#3b302b" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M108 70 Q124 56 140 62"/><path d="M150 46 Q170 40 184 52"/><path d="M118 88 Q132 78 146 86"/><path d="M168 76 Q184 70 198 80"/><path d="M100 54 Q110 44 124 46"/>
        </g>
      </g>
    </svg>`;
  };
})();
