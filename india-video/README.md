# India | How 1.4 Billion People Survive Every Single Day | Travel Documentary

TRVlog01 video #3 (after Bhutan and Japan), made with the same travel-video-maker workflow, but longer (~11.5 min).

- `script.json`: 30 segments in the travel-video-maker format (`id`, `search`, `text`), plus `chapter` (chapter title) and `sfx` (ambient sound to put under that segment).
- `narration-script.txt`: all narration, segments separated by blank lines (for ElevenLabs if wanted).
- `voice/segNN.wav`: finished voiceover, one file per segment (Kokoro TTS, voice am_michael, 24 kHz). Use these instead of make-voice.ps1 output; total 11.2 min.
- `narration-preview.mp3`: all segments joined, for listening.

## Audio mix targets
- Voice: -16 LUFS integrated, always on top.
- Music (Pixabay, Indian cinematic/ambient, e.g. sitar/flute): loop, ducked under the voice with sidechain compression (~-24 dB while talking), swells to ~-18 dB in the gaps and on the title card; fade in 2 s, fade out 4 s.
- Ambient SFX per segment (`sfx` field, from pixabay.com/sound-effects): -30 to -26 dB under the voice, 0.5 s crossfades between segments, never louder than the voice.
- A soft whoosh on each segment transition, about -22 dB.
- Final master: loudnorm I=-14 LUFS, TP=-1 dB (YouTube target).
