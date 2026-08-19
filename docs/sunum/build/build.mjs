// Tek kaynaktan üç çıktı üretir:
//   docs/sunum/apya-sunum.html   → ekranda gezilen deck (Artifact kaynağı da bu)
//   <out>/_print.html            → PDF için (slayt = sayfa)
//   <out>/slayt-NN.html          → PNG ekran görüntüsü için
//
// Kullanım: node build.mjs <gecici-cikti-dizini>

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { slides } from "./slides.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");             // repo kökü
const OUT_DECK = resolve(HERE, "../apya-sunum.html");
const TMP = resolve(process.argv[2] || join(HERE, "_tmp"));
mkdirSync(TMP, { recursive: true });

/* ---- Fontlar: ürünün kendi self-host woff2'leri, base64 gömülü ---- */
const FONT_DIR = join(ROOT, "src/Apya.Platform.Web/wwwroot/fonts");
const RANGE = {
  latin:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329," +
    "U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  ext:
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329," +
    "U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
};
const face = (family, file, range, wght) => {
  const b64 = readFileSync(join(FONT_DIR, file)).toString("base64");
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${wght};` +
    `font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2");` +
    `unicode-range:${range}}`;
};
const FONT_CSS = [
  face("Inter", "inter-latin-wght-normal.woff2", RANGE.latin, "100 900"),
  face("Inter", "inter-latin-ext-wght-normal.woff2", RANGE.ext, "100 900"),
  face("JetBrains Mono", "jetbrains-mono-latin-wght-normal.woff2", RANGE.latin, "100 800"),
  face("JetBrains Mono", "jetbrains-mono-latin-ext-wght-normal.woff2", RANGE.ext, "100 800"),
].join("\n");

const THEME_CSS = readFileSync(join(HERE, "theme.css"), "utf8");
const N = slides.length;

/* ---- Slayt ---- */
const pad2 = (n) => String(n).padStart(2, "0");

function slideHtml(s, i, { plain = false } = {}) {
  const eyebrow = `<div class="eyebrow">${s.eyebrow}` +
    (s.section ? `<span class="sep">·</span><span class="sec">${s.section}</span>` : "") + `</div>`;
  return `<section class="slide${s.night ? " night" : ""}${s.cover ? " cover" : ""}${plain ? " plain" : ""}">
  ${s.night ? `<div class="glow"></div>` : ""}
  <div class="pad">
    <div class="rail">${eyebrow}<div class="wordmark"><i></i>Apya Platform</div></div>
    <div class="head">
      ${s.cover ? `<h1>${s.title}</h1>` : `<h2>${s.title}</h2>`}
      ${s.sub ? `<p class="sub">${s.sub}</p>` : ""}
    </div>
    <div class="canvas">${s.canvas}</div>
    ${s.note ? `<div class="note">${s.note}</div>` : ""}
  </div>
  <div class="pageno">${pad2(i + 1)} / ${N}</div>
</section>`;
}

const STYLE = `<style>\n${FONT_CSS}\n${THEME_CSS}\n</style>`;

/* ---- 1) Ekranda gezilen deck ---- */
const deck = `<title>Apya Platform Tanıtımı</title>
${STYLE}
<style>
  html{ scroll-behavior:smooth; }
  @media (prefers-reduced-motion:reduce){ html{ scroll-behavior:auto; } }
</style>
<main class="deck">
${slides.map((s, i) => `<div class="stage" id="s${i + 1}"><div class="fit">${slideHtml(s, i)}</div></div>`).join("\n")}
</main>
<div class="deckbar"><b>Apya Platform</b> · ${N} slayt · gezinmek için <kbd>&darr;</kbd> <kbd>&uarr;</kbd></div>
<script>
  var stages = Array.prototype.slice.call(document.querySelectorAll(".stage"));
  function fit(){
    stages.forEach(function(st){
      var k = st.clientWidth / 1600;
      st.querySelector(".fit").style.transform = "scale(" + k + ")";
      st.style.height = (900 * k) + "px";
    });
  }
  fit();
  window.addEventListener("resize", fit);
  document.addEventListener("keydown", function(e){
    var next = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
    var prev = e.key === "ArrowUp" || e.key === "PageUp";
    if(!next && !prev) return;
    e.preventDefault();
    var top = window.scrollY + 4, cur = 0;
    stages.forEach(function(st, i){ if(st.offsetTop <= top) cur = i; });
    var t = Math.min(stages.length - 1, Math.max(0, cur + (next ? 1 : -1)));
    window.scrollTo({ top: stages[t].offsetTop - 26, behavior: "smooth" });
  });
</script>`;
writeFileSync(OUT_DECK, deck, "utf8");

/* ---- 2) PDF kaynağı ---- */
const print = `<title>Apya Platform Tanıtımı</title>
${STYLE}
<style>
  @page{ size:1600px 900px; margin:0; }
  /* Chrome --print-to-pdf varsayılanı "arka plan grafiklerini basma"dır;
     bu olmadan koyu slaytlar PDF'te bembeyaz çıkar. */
  *{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  html,body{ background:#FFFFFF; }
  body{ width:1600px; }
  .slide{ break-after:page; page-break-after:always; }
  .slide:last-child{ break-after:auto; page-break-after:auto; }
</style>
${slides.map((s, i) => slideHtml(s, i, { plain: true })).join("\n")}`;
writeFileSync(join(TMP, "_print.html"), print, "utf8");

/* ---- 3) PNG kaynakları ---- */
slides.forEach((s, i) => {
  const one = `<title>Apya · ${pad2(i + 1)}</title>
${STYLE}
<style>html,body{ width:1600px; height:900px; overflow:hidden; background:#FFFFFF; }</style>
${slideHtml(s, i, { plain: true })}`;
  writeFileSync(join(TMP, `slayt-${pad2(i + 1)}.html`), one, "utf8");
});

console.log(`deck   : ${OUT_DECK}`);
console.log(`print  : ${join(TMP, "_print.html")}`);
console.log(`slides : ${N} adet -> ${TMP}`);
