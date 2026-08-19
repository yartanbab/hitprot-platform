// PDF doğrulaması: sayfa sayısı, sayfa boyutu ve ilk sayfanın gerçekten
// koyu zeminle basılıp basılmadığı (arka plan grafikleri korunmuş mu).
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const path = process.argv[2];
const buf = readFileSync(path);
const raw = buf.toString("latin1");

const pages = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;
const box = [...new Set(raw.match(/\/MediaBox\s*\[[^\]]*\]/g) || [])];

// Tüm sıkıştırılmış akışları aç, içlerinde renk-doldurma operatörü ara.
let found = [];
const re = /stream\r?\n/g;
let m;
while ((m = re.exec(raw)) !== null) {
  const start = m.index + m[0].length;
  const end = raw.indexOf("endstream", start);
  if (end < 0) continue;
  try {
    const txt = inflateSync(buf.subarray(start, end)).toString("latin1");
    const fills = txt.match(/[\d.]+ [\d.]+ [\d.]+ (rg|sc)\b/g);
    if (fills) found.push(...fills);
  } catch { /* sıkıştırılmamış veya font akışı */ }
}
const uniq = [...new Set(found)];
// #0B1220 => 0.043 0.071 0.125
const dark = uniq.filter((f) => {
  const [r, g, b] = f.split(" ").map(Number);
  return r < 0.12 && g < 0.15 && b < 0.22 && (r + g + b) > 0;
});

console.log("sayfa       :", pages);
console.log("sayfa olcusu:", box.join(" | "));
console.log("dolgu rengi :", uniq.length, "farkli");
console.log("koyu zemin  :", dark.length ? "VAR -> " + dark.slice(0, 3).join(" , ") : "YOK (arka planlar basilmamis)");
