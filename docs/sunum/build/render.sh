#!/usr/bin/env bash
# Slaytları PNG'ye ve tüm sunumu PDF'e basar (headless Chrome / Edge).
# Kullanım: bash render.sh [png|pdf|all]
set -e

HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$HERE/_tmp"                 # ara dosyalar (git dışı, bkz .gitignore)
OUT_IMG="$HERE/../gorseller"
OUT_PDF="$HERE/../apya-sunum.pdf"

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

MODE="${1:-all}"
mkdir -p "$OUT_IMG" "$TMP"

TMP_W="$(winpath "$TMP")"
IMG_W="$(winpath "$OUT_IMG")"
PDF_W="$(winpath "$OUT_PDF")"

FLAGS=(--headless=new --disable-gpu --hide-scrollbars --no-first-run
       --no-default-browser-check --user-data-dir="$TMP_W/chrome-profile"
       --virtual-time-budget=8000)

node "$HERE/build.mjs" "$TMP" >/dev/null

if [ "$MODE" = "png" ] || [ "$MODE" = "all" ]; then
  for f in "$TMP"/slayt-*.html; do
    n=$(basename "$f" .html)
    "$CHROME" "${FLAGS[@]}" --window-size=1600,900 \
      --screenshot="$IMG_W/$n.png" "file:///$TMP_W/$n.html" 2>/dev/null || true
  done
  echo "PNG: $(ls -1 "$OUT_IMG"/slayt-*.png | wc -l) dosya"
fi

if [ "$MODE" = "pdf" ] || [ "$MODE" = "all" ]; then
  "$CHROME" "${FLAGS[@]}" --no-pdf-header-footer \
    --print-to-pdf="$PDF_W" "file:///$TMP_W/_print.html" 2>/dev/null || true
  echo "PDF: $OUT_PDF"
fi

# --- Uygulama içi tanıtım turunun varlıkları -------------------------------
# Turda gösterilen 6 slayt + tam sunum PDF'i wwwroot'a KOPYALANIR. Kopyalama
# burada durur ki kaynak ile uygulamadaki görsel asla ayrışmasın: slides.mjs
# değişip render.sh koşunca uygulama da güncellenmiş olur.
# Slayt seçimi TourSlideCatalog.cs ile aynı olmalı (test bunu doğrular).
if [ "$MODE" = "all" ]; then
  WWW="$HERE/../../../src/Apya.Platform.Web/wwwroot/tanitim"
  mkdir -p "$WWW"
  for n in 01 04 05 06 08 16; do
    cp "$OUT_IMG/slayt-$n.png" "$WWW/slayt-$n.png"
  done
  cp "$OUT_PDF" "$WWW/apya-sunum.pdf"
  echo "TUR : $(ls -1 "$WWW"/slayt-*.png | wc -l) slayt + PDF -> wwwroot/tanitim"
fi
