#!/usr/bin/env zsh
# BatCaverna — Converti sequenze JPG in MP4 ad alta qualità

FFMPEG="/Applications/noTube.app/Contents/MacOS/Tools/ffmpeg"
ASSETS_DIR="public/assets"

make_file_list() {
  local dir="$1"
  local list_file="$2"
  rm -f "$list_file"
  for f in $(ls "$dir"/*.jpg 2>/dev/null | sort -V); do
    echo "file '$(realpath "$f")'" >> "$list_file"
  done
  local count=$(wc -l < "$list_file" | tr -d ' ')
  echo "  → $count frame trovati"
}

convert_to_mp4() {
  local input_dir="$1"
  local output_file="$2"
  local fps="${3:-25}"
  local width="${4:-1920}"
  local height="${5:-1080}"
  local list_file="/tmp/batcaverna_frames_$$.txt"

  echo ""
  echo "▶ Conversione: $input_dir"
  echo "  → Output: $output_file"
  echo "  → Risoluzione: ${width}x${height} @ ${fps}fps"
  
  make_file_list "$input_dir" "$list_file"
  
  if [ ! -s "$list_file" ]; then
    echo "  ✗ Nessun frame trovato in $input_dir"
    return 1
  fi

  rm -f "$output_file"

  "$FFMPEG" -y \
    -f concat \
    -safe 0 \
    -r "$fps" \
    -i "$list_file" \
    -c:v libx264 \
    -preset slow \
    -crf 18 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -vf "scale=${width}:${height}:flags=lanczos" \
    "$output_file" 2>&1 | grep -E "(Error|error|frame=|fps=|video:)" | tail -5
  
  local exit_code=$?
  rm -f "$list_file"
  
  if [ $exit_code -eq 0 ]; then
    local size=$(du -sh "$output_file" | cut -f1)
    echo "  ✓ Completato! ($size)"
  else
    echo "  ✗ Errore nella conversione (exit code: $exit_code)"
  fi
  return $exit_code
}

echo "BatCaverna — Conversione Frame Sequence → MP4"
echo ""

convert_to_mp4 "$ASSETS_DIR/textures/BatCaverna_Armeria360" "$ASSETS_DIR/textures/BatCaverna360_ArmeriaArea.mp4" 25 2040 1024
convert_to_mp4 "$ASSETS_DIR/textures/BatCaverna_Batcomputer360" "$ASSETS_DIR/textures/BatCaverna360_BatComputerArea.mp4" 25 2040 1024
convert_to_mp4 "$ASSETS_DIR/videos/BatCaverna_PassaggioBatComputerAArmeria" "$ASSETS_DIR/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4" 25 1920 1080
convert_to_mp4 "$ASSETS_DIR/videos/BatCaverna_PassaggioArmeriaABatMobile" "$ASSETS_DIR/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4" 25 1920 1080

echo ""
echo "File generati:"
for f in \
  "$ASSETS_DIR/textures/BatCaverna360_ArmeriaArea.mp4" \
  "$ASSETS_DIR/textures/BatCaverna360_BatComputerArea.mp4" \
  "$ASSETS_DIR/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4" \
  "$ASSETS_DIR/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4"; do
  if [ -f "$f" ]; then
    size=$(du -sh "$f" | cut -f1)
    echo "  ✓ $(basename $f) ($size)"
  else
    echo "  ✗ $(basename $f) — NON GENERATO"
  fi
done
