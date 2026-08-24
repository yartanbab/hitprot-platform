// İki destenin de kullandığı, İÇERİK TAŞIMAYAN parçalar.
// Metin/veri taşıyan her şey destenin kendi slides-*.mjs dosyasında kalır —
// desteler bilinçli olarak ayrışacak, ortak dosya onları birbirine bağlamamalı.

/** SVG ok ucu tanımı. id her slaytta benzersiz olmalı (tek belgede 16 slayt yan yana). */
export const ARROW = (id, color = "#9CA3AF") => `
  <defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5"
      markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker></defs>`;

/** Uygulama maketinin sol menüsü. Etiketler deste diline göre dışarıdan verilir. */
export const sideNav = (items, active) => `<div class="side">
  <b>Menü</b>
  ${items.map((t, i) => `<a class="${i === active ? "on" : ""}"><i></i>${t}</a>`).join("")}
</div>`;
