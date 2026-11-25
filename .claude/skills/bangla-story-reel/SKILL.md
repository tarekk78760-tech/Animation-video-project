---
name: bangla-story-reel
description: Turn a Bangla script (SRT) + voiceover into a vertical (1080×1920) animated story reel for the TR Universe 0.1 page — flat vector characters with lip-sync, kinetic infographics, highlighted Bangla subtitles, Hind Siliguri font. Use when the user gives a script/SRT and voiceover (and optionally a font) and asks for a video/reel/animation, or says "আগের মতো ভিডিও বানাও".
---

# Bangla Story Reel (TR Universe 0.1)

A pipeline that turns a script + voiceover into an animated story-reel video. Each frame is drawn in code as SVG → Playwright screenshot → ffmpeg MP4. Finished example: `law4/` in this repository (Law 4 – Say Less, 25 scenes, 110s); the final video is `law4/output/`.

## Inputs (the user provides)
- Voiceover (mp3/wav)
- Script as SRT (its times are rough; they are re-aligned below)
- Font (default: Hind Siliguri — copy `law4/fonts/` if the user sends nothing)
- Page name: **TR Universe 0.1** (top-left of every scene, plus the end card). Ask if the user wants a different name.
- Size: portrait 1080×1920, 30fps (the user's word "পার্টিকেল সাইজ" means portrait)

## Workflow
1. **New project folder:** `mkdir <name>` → copy `templates/{chars.js,index.html,render.js}`, plus `fonts/`, `audio/voiceover.mp3`, `data/script.srt`.
2. **Timing + lip-sync data:**
   `python3 -I .claude/skills/bangla-story-reel/scripts/prepare_audio.py <name>/audio/voiceover.mp3 <name>/data/script.srt <name>/data`
   → `lines.json` and `env.json`. Check the printout: a line whose duration is badly out of proportion to its character count was probably assigned to the wrong pause. Whisper doesn't work for Bangla; don't use it.
3. **Write `scenes.js`** (start from `examples/law4_scenes.js`):
   - `SUB` = subtitle per line; `*amber*` = positive / number / key word, `~coral~` = negative / mistake / loss, `|` = line break (max 2–3 lines).
   - `HIDE_SUB` = lines whose text is already big on screen (book, quote, CTA, timer).
   - `SCENES` = `{from: firstLineNo, dark, xf, draw(t, lt)}`. One visual beat per line; change scene every 2–4s.
   - Lip-sync: `mouth: speakMouth(t, [lineNos])` — only for the character speaking that dialogue line. For narration, keep mouths closed.
4. **Check stills:** `node <name>/render.js <outdir> 30 1 --stills 2,10,25,...` → combine with `hstack` into one sheet and inspect it. Text overlapping the subtitle, overflowing buttons, and overlapping elements are the usual problems.
5. **Full render:** `node <name>/render.js <outdir> 30 4` (argument order: outdir, fps, workers). About 3 minutes for ~3300 frames. Run it in the background and watch `log.txt` with a Monitor.
6. **Merge:** `ffmpeg -f concat -i <outdir>/list.txt -i audio/voiceover.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart output/<name>.mp4`
7. Check a few frames with ffprobe + frame grabs → send with SendUserFile → commit and push.

## Design system (our own — do not copy the reference video)
- Colors (`C` in `chars.js`): paper `#F6EFE4`, ink navy `#14213D` (dark scenes, gradient `#1A2B50→#0E1730`), amber `#F4A93B`, coral `#E85D4A`, teal `#2A9D8F`.
- Dark scenes (hook, suspense, book/principle, end card) alternate with light paper scenes (story, infographics, CTA). Every frame gets grain plus a vignette.
- Subtitle: navy box at 90% opacity, white SemiBold 52px, `top:1540px`. Keep scene content away from y≈1500–1700.
- Motion: `pop` (back-ease scale), staggered slide-in, stroke `draw-on` (pathLength=1 + dashoffset), stamp slam, slow Ken Burns zoom (1–5%) on every shot, `focus-dim` (earlier cards drop to 50%). Mostly hard cuts; set `xf:true` (0.35s crossfade) at act changes.
- "Silence" motif: a waveform that goes flat (`waveform()` amp → 0), a flat-line + timer pill (`silencePill`).
- Use Bangla digits (`bn()`). If a currency amount could be confused (৪ looks like 8), check with the user.

## Characters (`person()` in `chars.js`)
- `kind:'rafiq'` — Bangladeshi businessman, brown vest (koti), mustache, grey temples.
- `kind:'buyer'` — European, silver hair and beard, round glasses, charcoal suit, teal tie.
- Options: `expr` neutral|smile|laugh|sad|worried|stern, `mouth` 0..1, `look:[x,y]`, `blink: blinkAt(t,seed)`, `sweat`, `nod`, `s` (scale), `flip`.
- For a new story with new characters, add a new `kind` to `person()` (skin, hair, outfit), keeping the same face geometry.
- Other props: `factory, priceTag, tshirt, stamp, clockFace, plant, moneyNote, bubble, silhouette, miniPerson, orbitLogo, cursor`.

## Story structure (default)
Hook (shocking result / warning, dark) → character + setting → conflict/climax (cuts between dialogue and close-ups, a number/price change on screen) → twist/result (with a calculation) → principle/book reference (dark) → infographic + checklist → strong one-line takeaway → CTA (question + comment button) → TR Universe 0.1 end card (follow button + cursor click) → fade to black.

## Pitfalls
- `render.js` arguments: `outdir fps workers` — workers is `argv[4]`.
- Don't put a shell variable in `rm` (blocked by the safety check); use a new folder.
- Don't pipe `render.js` output through `tail` (logs won't show) — write to `> log.txt`.
- Background music only if the user provides it (duck it to about −20 dB under the voice).
- The reference video's analysis is in `docs/STYLE_GUIDE.md` (for inspiration only).
