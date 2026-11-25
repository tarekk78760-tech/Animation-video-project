# Law 4 – Say Less (TR Universe 0.1)

A vertical reel (1080×1920, 30fps): Rafiq Saheb's story, plus Law 4 from *The 48 Laws of Power*.

## Files
- `chars.js` – characters (Rafiq Saheb, the European buyer) and props as SVG; expressions, blinking, mouth shapes
- `scenes.js` – 25 scenes, subtitles (keywords highlighted), timeline
- `index.html` – page layout + Hind Siliguri fonts
- `render.js` – Playwright renders each frame → ffmpeg
- `data/lines.json` – start/end time of each script line, aligned to the voiceover
- `data/env.json` – per-frame voiceover amplitude (for lip-sync)
- `audio/voiceover.mp3`, `data/script.srt` – original voice and script

## Render
```bash
node render.js out 30 4                 # 4 parallel workers → out/seg0..3.mp4
ffmpeg -f concat -i out/list.txt -i audio/voiceover.mp3 -c:v copy -c:a aac -b:a 192k -shortest final.mp4
node render.js stills 30 1 --stills 5,20,40   # specific frames only (for checking)
```

## For a new video
1. Put the new voiceover and SRT in `audio/` and `data/`, generate `lines.json` and `env.json`.
2. Update the `SUB` array (`*amber*`, `~coral~`, `|` = line break) and `SCENES` in `scenes.js`.
