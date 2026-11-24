# শ্রমিক বাঁচলে শিল্প বাঁচবে — explainer video (9:16)

Final video: `output/shromik_bachle_shilpo_bachbe_9x16.mp4` (1080×1920, 30 fps, 64.5 s)

- `src/timeline.py` – script phrases aligned to the pauses in the voiceover
- `src/render.py` – draws every frame (photos, Ken Burns, infographics, Bangla subtitles in Hind Siliguri) and encodes with ffmpeg
- `src/make_music.py` – synthesises the soft background pad (ducked under the voice)

Rebuild: `pip install pillow numpy` (Pillow needs raqm for Bangla shaping), then `python3 src/render.py`.
Preview stills: `python3 src/render.py --preview 3.5,16.8,61.5`
