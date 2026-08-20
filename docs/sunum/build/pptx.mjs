// PNG slaytlardan 16:9 PPTX üretir. Her slayt tam-kanama görsel;
// konuşmacı notlarına slaytın başlığı ve alt notu düz metin olarak yazılır.
//
// Kullanım: node pptx.mjs [pptxgenjs-kurulu-dizin]
// Dizin verilmezse build/_tmp/pptx aranır (orada `npm install pptxgenjs@4`).

import { readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { slides } from "./slides.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const IMG = resolve(HERE, "../gorseller");
const OUT = resolve(HERE, "../apya-sunum.pptx");
const MODDIR = resolve(process.argv[2] || join(HERE, "_tmp/pptx"));

const { default: PptxGenJS } = await import(
  pathToFileURL(join(MODDIR, "node_modules/pptxgenjs/dist/pptxgen.cjs.js")).href
);

const files = readdirSync(IMG).filter((f) => /^slayt-\d+\.png$/.test(f)).sort();
if (files.length !== slides.length) {
  throw new Error(`PNG sayisi (${files.length}) slayt sayisiyla (${slides.length}) uyusmuyor`);
}

const strip = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

const pptx = new PptxGenJS();
// DIKKAT: pptxgenjs'te LAYOUT_16x9 = 10 x 5.625 inc'tir; PowerPoint'in
// modern genis varsayilani LAYOUT_WIDE'dir (13.333 x 7.5). Asagidaki
// gorsel olculeri bu ikinciyle eslesir.
pptx.layout = "LAYOUT_WIDE";                 // 13.333 x 7.5 inch (16:9)
pptx.title = "Apya Platform Tanıtımı";
pptx.subject = "Müşteri tanıtım sunumu";
pptx.company = "Apya";

files.forEach((f, i) => {
  const s = slides[i];
  const sl = pptx.addSlide();
  sl.background = { color: s.night ? "0B1220" : "FFFFFF" };
  sl.addImage({ path: join(IMG, f), x: 0, y: 0, w: 13.333, h: 7.5 });
  const notes = [strip(s.title), strip(s.sub), strip(s.note)].filter(Boolean).join("\n\n");
  if (notes) sl.addNotes(notes);
});

await pptx.writeFile({ fileName: OUT });
console.log(`PPTX: ${OUT} (${files.length} slayt)`);
