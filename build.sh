#!/usr/bin/env bash
# Full pipeline: align voice -> render frames -> synth SFX & mix -> final vertical MP4
set -euo pipefail
cd "$(dirname "$0")"
BUILD=${BUILD:-build}
mkdir -p "$BUILD" output
python3 tools/align.py assets/voiceover.mp3 script.txt assets/words.json assets/anchors.json > "$BUILD/align.txt"
python3 -c "import json;d=json.load(open('assets/words.json'));open('assets/words.js','w').write('window.WORDS='+json.dumps(d,ensure_ascii=False)+';')"
NODE_PATH=${NODE_PATH:-$(npm root -g)} node tools/render.js "$BUILD" 30 ${WORKERS:-3}
DUR=$(node -e "const s=require('fs').readFileSync('assets/words.json','utf8');console.log(JSON.parse(s).duration+1.4)")
python3 tools/sfx.py "$BUILD/sfx.json" assets/voiceover.mp3 "$DUR" "$BUILD/mix.wav"
ffmpeg -v error -y -f concat -safe 0 -i "$BUILD/segs.txt" -i "$BUILD/mix.wav" -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart output/bkash_vs_bangla_qr_vertical.mp4
echo "=> output/bkash_vs_bangla_qr_vertical.mp4"
