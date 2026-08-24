#!/usr/bin/env bash
# Bir destenin slaytlarını PNG'ye ve tümünü PDF'e basar (headless Chrome / Edge).
# Kullanım: bash render.sh <sirket|dernek> [png|pdf|all]
set -e

DECK="${1:-}"
case "$DECK" in
  sirket|dernek) ;;
  *) echo "Kullanım: bash render.sh <sirket|dernek> [png|pdf|all]" >&2; exit 1 ;;
esac
MODE="${2:-all}"

HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$HERE/_tmp/$DECK"          # ara dosyalar (git dışı, bkz .gitignore)
OUT_IMG="$HERE/../$DECK/gorseller"
OUT_PDF="$HERE/../$DECK/apya-sunum-$DECK.pdf"

# Git Bash yolunu Windows biçimine çevir. ŞART: MSYS düz argümanları kendisi
# çevirir ama "file:///" ön ekli bir dizeyi URL sanıp DOKUNMAZ; /e/... yolu
# file:////e/... olarak Chrome'a gider, Chrome sayfayı açamaz ve sessizce
# boş bir Letter sayfası basar (PNG'ler de boş çıkar).
winpath() { cygpath -m "$1" 2>/dev/null || echo "$1"; }

# Chrome yoksa Edge'e düş — ikisi de aynı headless bayraklarını destekler.
for c in "/c/Program Files/Google/Chrome/Application/chrome.exe" \
         "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
         "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
         "/c/Program Files/Microsoft/Edge/Application/msedge.exe" \
         "$(command -v google-chrome || true)" \
         "$(command -v chromium || true)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done
if [ -z "${CHROME:-}" ]; then
  echo "Chrome/Edge bulunamadi. CHROME degiskenini elle ver." >&2; exit 1
fi

mkdir -p "$OUT_IMG" "$TMP"

TMP_W="$(winpath "$TMP")"
IMG_W="$(winpath "$OUT_IMG")"
PDF_W="$(winpath "$OUT_PDF")"

FLAGS=(--headless=new --disable-gpu --hide-scrollbars --no-first-run
       --no-default-browser-check --user-data-dir="$TMP_W/chrome-profile"
       --virtual-time-budget=8000)

node "$HERE/build.mjs" "$DECK" "$TMP" >/dev/null

if [ "$MODE" = "png" ] || [ "$MODE" = "all" ]; then
  # Deste KÜÇÜLDÜYSE eski görseller ortada kalır (örn. 16 slayttan 15'e inince
  # slayt-16.png öksüz kalır) ve PPTX'e bayat slayt sızar. Önce temizle.
  rm -f "$OUT_IMG"/slayt-*.png
  for f in "$TMP"/slayt-*.html; do
    n=$(basename "$f" .html)
    "$CHROME" "${FLAGS[@]}" --window-size=1600,900 \
      --screenshot="$IMG_W/$n.png" "file:///$TMP_W/$n.html" 2>/dev/null || true
  done
  echo "PNG ($DECK): $(ls -1 "$OUT_IMG"/slayt-*.png | wc -l) dosya"
fi

if [ "$MODE" = "pdf" ] || [ "$MODE" = "all" ]; then
  "$CHROME" "${FLAGS[@]}" --no-pdf-header-footer \
    --print-to-pdf="$PDF_W" "file:///$TMP_W/_print.html" 2>/dev/null || true
  echo "PDF ($DECK): $OUT_PDF"
fi
