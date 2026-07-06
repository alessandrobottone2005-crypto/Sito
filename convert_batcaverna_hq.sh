#!/usr/bin/env zsh
# BatCaverna — Re-encode ALTA QUALITÀ: risoluzione nativa, CRF 12

FFMPEG="/Applications/noTube.app/Contents/MacOS/Tools/ffmpeg"
ASSETS_DIR="public/assets"

make_file_list() {
  local dir="$1"
  local list_file="$2"
  rm -f "$list_file"
  for f in $(ls "$dir"/*.jpg 2>/dev/null | sort -V); do
    echo "file '$(realpath "$f")'" >> "$list_file"
  done
  echo "  → $(wc -l < "$list_file" | tr -d ' ') frame"
}

convert_hq() {
  local input_dir="$1"
  local output_file="$2"
  local fps="${3:-25}"
  local list_file="/tmp/bcframes_$$.txt"

  echo ""
  echo "▶ $output_file"
  make_file_list "$input_dir" "$list_file"
  [ ! -s "$list_file" ] && echo "  ✗ Nessun frame" && return 1

  rm -f "$output_file"

  # CRF 12 = alta qualità, nessun rescale (risoluzione nativa)
  "$FFMPEG" -y \
    -f concat -safe 0 \
    -r "$fps" \
    -i "$list_file" \
    -c:v libx264 \
    -preset medium \
    -crf 12 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    "$output_file" 2>&1 | grep -E "frame=.*fps=|Lsize=|error" | tail -3

  local exit_code=$?
  rm -f "$list_file"
  [ $exit_code -eq 0 ] && echo "  ✓ $(du -sh "$output_file" | cut -f1)" || echo "  ✗ Errore"
  return $exit_code
}

echo "BatCaverna — Riconversione HQ (risoluzione nativa, CRF 12)"

convert_hq "$ASSETS_DIR/textures/BatCaverna_Armeria360"              "$ASSETS_DIR/textures/BatCaverna360_ArmeriaArea.mp4"           25
convert_hq "$ASSETS_DIR/textures/BatCaverna_Batcomputer360"           "$ASSETS_DIR/textures/BatCaverna360_BatComputerArea.mp4"        25
convert_hq "$ASSETS_DIR/videos/BatCaverna_PassaggioBatComputerAArmeria" "$ASSETS_DIR/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4" 25
convert_hq "$ASSETS_DIR/videos/BatCaverna_PassaggioArmeriaABatMobile"   "$ASSETS_DIR/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4"   25

echo ""
echo "Risultato finale:"
for f in \
  "$ASSETS_DIR/textures/BatCaverna360_ArmeriaArea.mp4" \
  "$ASSETS_DIR/textures/BatCaverna360_BatComputerArea.mp4" \
  "$ASSETS_DIR/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4" \
  "$ASSETS_DIR/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4"; do
  if [ -f "$f" ]; then
    echo "  ✓ $(basename $f) — $(du -sh "$f" | cut -f1)"
  else
    echo "  ✗ $(basename $f) — MANCANTE"
  fi
done
