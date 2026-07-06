#!/bin/bash
SRC="./public/assets/showreel"
DST="./public/assets/showreel_jpg"
MAX_W=1920
QUALITY=75
WORKERS=8

echo "Conversione Showreel PNG -> JPEG (${MAX_W}px, q${QUALITY})"
mkdir -p "$DST"
TOTAL=$(ls "$SRC"/*.png 2>/dev/null | wc -l | tr -d ' ')
echo "File trovati: $TOTAL"

convert_file() {
  local src_file="$1"
  local filename=$(basename "$src_file" .png)
  local dst_file="$2/${filename}.jpg"
  [ -f "$dst_file" ] && return 0
  sips --resampleWidth "$3" --setProperty formatOptions "$4" --setProperty format jpeg "$src_file" --out "$dst_file" > /dev/null 2>&1
}
export -f convert_file

ls "$SRC"/*.png | xargs -P $WORKERS -I {} bash -c 'convert_file "$@"' _ {} "$DST" $MAX_W $QUALITY

DST_COUNT=$(ls "$DST"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
DST_SIZE=$(du -sh "$DST" | cut -f1)
echo "Convertiti: $DST_COUNT / $TOTAL  |  Dimensione: $DST_SIZE"
echo "Aggiorna BatmanCamera.tsx: IMAGE_PREFIX=\"./assets/showreel_jpg/\"  IMAGE_SUFFIX=\".jpg\""
