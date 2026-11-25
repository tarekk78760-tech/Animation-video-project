#!/usr/bin/env bash
# Usage: analyze.sh <video> <out_dir> [scene_threshold] [whisper_model]
# Produces: info.txt, scenes.txt, contact sheets (grid_XX.jpg), per-scene keyframes,
# audio levels, silences, and (if faster-whisper works) transcript.txt
set -uo pipefail
V="$1"; OUT="$2"; TH="${3:-0.2}"; WM="${4:-small}"
mkdir -p "$OUT/scenes"

echo "== probe ==" | tee "$OUT/info.txt"
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate \
  -of compact "$V" | tee -a "$OUT/info.txt"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")

echo "== scene cuts (threshold $TH) =="
ffmpeg -nostdin -i "$V" -vf "select='gt(scene,$TH)',showinfo" -vsync vfr "$OUT/scenes/cut_%03d.jpg" 2>&1 \
  | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 > "$OUT/scenes.txt"
cat "$OUT/scenes.txt"

echo "== contact sheets (1 fps, 6 per sheet) =="
ffmpeg -nostdin -v error -y -i "$V" -vf "fps=1,scale=270:-1,tile=6x1" "$OUT/grid_%02d.jpg"
ls "$OUT"/grid_*.jpg

echo "== mid-scene keyframes =="
prev=0; i=1
for t in $(cat "$OUT/scenes.txt") "$DUR"; do
  mid=$(python3 -c "print(($prev+$t)/2)")
  ffmpeg -nostdin -v error -y -ss "$mid" -i "$V" -frames:v 1 -vf scale=540:-1 "$OUT/scenes/scene_$(printf %02d $i)_mid.jpg"
  echo "scene $i: ${prev}s - ${t}s (mid ${mid}s)"
  prev=$t; i=$((i+1))
done | tee -a "$OUT/info.txt"

echo "== audio =="
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$V" | grep -q .; then
  ffmpeg -nostdin -i "$V" -af silencedetect=n=-35dB:d=0.4 -f null - 2>&1 | grep -E "silence_(start|end)" | tee "$OUT/silences.txt"
  ffmpeg -nostdin -v error -y -i "$V" -ac 1 -ar 16000 "$OUT/audio.wav"
  python3 - "$OUT/audio.wav" "$WM" > "$OUT/transcript.txt" 2>"$OUT/transcript.err" <<'PY' || echo "transcription failed: see transcript.err"
import sys
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[2], device="cpu", compute_type="int8")
segs, info = m.transcribe(sys.argv[1], word_timestamps=False)
print(f"# language={info.language} p={info.language_probability:.2f}")
for s in segs:
    print(f"{s.start:6.1f}-{s.end:6.1f}: {s.text.strip()}")
PY
  cat "$OUT/transcript.txt" 2>/dev/null
else
  echo "no audio stream"
fi
