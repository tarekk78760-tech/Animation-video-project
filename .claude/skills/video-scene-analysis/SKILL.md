---
name: video-scene-analysis
description: Analyze a video scene by scene — detect cuts, view frames, transcribe voiceover, and write a per-scene breakdown (visuals, character, action, text on screen, camera, audio, purpose). Use when the user uploads/points to a video (.mp4/.mov/.webm) and asks to analyze it, break down its scenes, or "প্রতিটা সিন অ্যানালাইজ করো".
---

# Video scene-by-scene analysis

Reply in the user's language (Bengali if they wrote in Bengali).

## 1. Extract everything
Run the helper (writes to a fresh dir in the scratchpad, never inside the upload folder):

```bash
bash .claude/skills/video-scene-analysis/scripts/analyze.sh "<video>" "<scratchpad>/va" 0.2 small
```

It outputs: `info.txt` (duration, resolution, fps, scene ranges), `scenes.txt` (cut timestamps),
`grid_XX.jpg` (1 fps contact sheets, 6 frames each), `scenes/scene_NN_mid.jpg`, `silences.txt`, `transcript.txt`.

- No cuts found? Lower threshold to 0.1; AI-generated clips are often fixed-length (e.g. every 8 s).
- Transcription needs `pip install faster-whisper` (first run downloads the model; can take minutes — run in background and keep going). If it fails, say so and analyze visuals only; never invent narration.

## 2. Look at the frames
Read **every** `grid_XX.jpg` with the Read tool (they show the motion within each scene). Open a `scene_NN_mid.jpg` at higher resolution when on-screen text or detail is unclear.

## 3. Write the breakdown
Header: duration, aspect ratio/resolution, number of scenes, art style, overall story/message.

Then for each scene (`সিন N — 0:00–0:08`):
- **সেটিং / Setting** – location, props, lighting, color mood
- **চরিত্র / Character** – look, expression, emotion change
- **অ্যাকশন / Action** – what happens over time (from the contact sheet)
- **অন-স্ক্রিন টেক্সট** – exact text; flag garbled AI text (misspellings, nonsense words)
- **ক্যামেরা** – static / zoom / pan / cut
- **অডিও** – voiceover lines from transcript in that time range, music, silences
- **উদ্দেশ্য / Story role** – hook, problem, turning point, payoff, CTA

Finish with:
- Story arc table (scene → emotion → message)
- **Consistency issues** across scenes (character design changes, room/props/clock changing, AI text glitches, timing problems)
- Concrete improvement suggestions (and, if useful, a prompt per scene to regenerate it)
