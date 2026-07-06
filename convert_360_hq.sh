#!/usr/bin/env zsh
# Fix 360° videos: risoluzione con altezza pari (1638x820 con padding di 1px)

FFMPEG="/Applications/noTube.app/Contents/MacOS/Tools/ffmpeg"
ASSETS_DIR="public/assets"

make_file_list() {
  local dir="$1"; local list_file="$2"
  rm -f "$list_file"
  for f in $(ls "$dir"/*.jpg 2>/dev/null | sort -V); do
    echo "file '$(realpath "$f")'" >> "$list_file"
  done
  echo "  → $(wc -l < "$list_file" | tr -d ' ') frame"
}

convert_360() {
  local input_dir="$1"; local output_file="$2"
  local list_file="/tmp/bc360_$$.txt"
  echo ""; echo "▶ $output_file"
  make_file_list "$input_dir" "$list_file"
  rm -f "$output_file"
  # pad=w=iw:h=ceil(ih/2)*2 arrotonda l'altezza al multiplo di 2 più vicino
  "$FFMPEG" -y \
    -f concat -safe 0 \
    -r 25 \
    -i "$list_file" \
    -vf "pad=width=iw:height=ceil(ih/2)*2" \
    -c:v libx264 \
    -preset medium \
    -crf 12 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    "$output_file" 2>&1 | grep -E "frame=.*fps=|Lsize=|Error|error" | tail -3
  local exit=$?; rm -f "$list_file"
  [ $exit -eq 0 ] && echo "  ✓ $(du -sh "$output_file" | cut -f1)" || echo "  ✗ Errore (code $exit)"
}

convert_360 "$ASSETS_DIR/textures/BatCaverna_Armeria360"    "$ASSETS_DIR/textures/BatCaverna360_ArmeriaArea.mp4"
convert_360 "$ASSETS_DIR/textures/BatCaverna_Batcomputer360" "$ASSETS_DIR/textures/BatCaverna360_BatComputerArea.mp4"

echo ""
for f in "$ASSETS_DIR/textures/BatCaverna360_ArmeriaArea.mp4" "$ASSETS_DIR/textures/BatCaverna360_BatComputerArea.mp4"; do
  [ -f "$f" ] && size=$(du -sh "$f" | cut -f1) && echo "  ✓ $(basename $f) — $size" || echo "  ✗ $(basename $f) mancante"
done
