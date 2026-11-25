#!/usr/bin/env bash
# Usage: build.sh <voiceover.mp3> <output.mp4> [workdir]
set -euo pipefail
cd "$(dirname "$0")"
VO="$1"; OUT="$2"; WORK="${3:-$(mktemp -d)}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VO")
python3 music.py "$WORK/music.wav" "$(python3 -c "print($DUR+0.5)")"
node render.js frames "$WORK/video.mp4" 30
# voice up front, music ducked under the voice (sidechain), loudness normalised for Shorts/Reels
ffmpeg -y -v error -i "$WORK/video.mp4" -i "$VO" -i "$WORK/music.wav" -filter_complex \
 "[1:a]aresample=44100,aformat=channel_layouts=stereo,asplit=2[vo][sc];\
  [2:a]volume=0.22[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];\
  [vo][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
echo "done: $OUT"
