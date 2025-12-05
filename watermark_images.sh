#!/usr/bin/env bash
# watermark_images.sh
# Batch watermark images in-place (creates backups with .orig)
# Requires ImageMagick (convert/composite)
# Usage: ./watermark_images.sh path/to/images "海峡堂" 

set -euo pipefail

if ! command -v convert >/dev/null 2>&1; then
  echo "ImageMagick 'convert' is required. Install it (sudo apt install imagemagick)."
  exit 2
fi

IMAGEDIR="${1:-docs/assets/images}"
TEXT="${2:-海峡堂}"

if [ ! -d "$IMAGEDIR" ]; then
  echo "Directory not found: $IMAGEDIR"
  exit 3
fi

# Iterate common image extensions
shopt -s nullglob
for img in "$IMAGEDIR"/*.{jpg,jpeg,png,gif,webp,svg}; do
  [ -e "$img" ] || continue
  echo "Processing: $img"
  bak="$img.orig"
  if [ ! -e "$bak" ]; then
    cp "$img" "$bak"
  fi

  # create watermark as a semi-transparent PNG
  tmp_wm=$(mktemp --suffix=.png)
  convert -size 1200x300 xc:none -gravity center \
    -fill "rgba(255,255,255,0.12)" -pointsize 72 -gravity center \
    -annotate 0 "$TEXT" "$tmp_wm"

  # Composite watermark tiled over image (scale watermark relative to image)
  # We use -gravity center and -geometry to place a single large watermark.
  convert "$bak" "$tmp_wm" -gravity center -composite "$img"
  rm -f "$tmp_wm"
done

echo "Done. Backups saved with .orig suffix. Commit the new images if desired."