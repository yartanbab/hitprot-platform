// Apya Platform — ŞİRKET odaklı müşteri tanıtım sunumu, slayt içerikleri.
// Tek kaynak: buradan hem HTML deck, hem PDF, hem PNG, hem PPTX üretilir.
// Dernek/vakıf sürümü ayrı dosyadadır: slides-dernek.mjs

import { ARROW, sideNav as shellNav } from "./common.mjs";

/* ── 02 · Bugünkü dağınıklık ─────────────────────────────────────────── */
const s02 = () => {
  const left = [
    ["Excel tabloları", "proje listesi, bütçe, takip"],
    ["WhatsApp grupları", "görev dağıtımı, onaylar"],
    ["E-posta ekleri", "sözleşme, teklif, fatura"],
  ];
  const right = [
    ["Masaüstü klasörleri", "belgelerin son sürümü hangisi?"],
    ["Kağıt fatura & fiş", "ay sonunda toplanır"],
    ["Muhasebecideki kayıt", "gerçek rakamlar orada"],
  ];
  const box = (x, y, t, d) => `
    <rect x="${x}" y="${y}" width="310" height="104" rx="14" fill="#FFFFFF" stroke="#E5E7EB"/>
    <text x="${x + 24}" y="${y + 44}" font-size="22" font-weight="600" fill="#111827">${t}</text>
    <text x="${x + 24}" y="${y + 74}" font-size="16" fill="#6B7280">${d}</text>`;
  const lbl = (x, y, t) => {
    const w = t.length * 7.6 + 18;
    return `<rect x="${x - w / 2}" y="${y - 15}" width="${w}" height="24" rx="7" fill="#FFFFFF"/>
    <text x="${x}" y="${y + 3}" font-size="15" fill="#94A3B8" text-anchor="middle">${t}</text>`;
  };
  const arm = (x1, y1, x2, y2, label, lx, ly) => `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#CBD5E1" stroke-width="2"
          stroke-dasharray="7 6" marker-end="url(#a2)"/>
    ${lbl(lx, ly, label)}`;
  return `<figure><svg class="flow" viewBox="0 0 1416 480" role="img"
      aria-label="Bilgi altı ayrı yerde durduğu için yöneticinin her soru için tek tek kaynaklara gitmesi gerekiyor">
    ${ARROW("a2", "#CBD5E1")}
    ${left.map((c, i) => box(0, i * 186, c[0], c[1])).join("")}
    ${right.map((c, i) => box(1106, i * 186, c[0], c[1])).join("")}

    ${arm(538, 205, 322, 60, "tek tek sor", 430, 132)}
    ${arm(538, 240, 322, 240, "elle kopyala", 430, 240)}
    ${arm(538, 275, 322, 416, "ay sonunu bekle", 430, 345)}
    ${arm(878, 205, 1094, 60, "dosyayı ara", 986, 132)}
    ${arm(878, 240, 1094, 240, "yeniden yaz", 986, 240)}
    ${arm(878, 275, 1094, 416, "telefon aç", 986, 345)}

    <rect x="546" y="170" width="324" height="140" rx="20" fill="#FEF2F2" stroke="#FECACA" stroke-width="2"/>
    <text x="708" y="212" font-size="25" font-weight="700" fill="#B91C1C" text-anchor="middle">Ne durumdayız?</text>
    <text x="708" y="248" font-size="17" fill="#DC2626" text-anchor="middle">Proje kâr ediyor mu?</text>
    <text x="708" y="276" font-size="17" fill="#DC2626" text-anchor="middle">Hangi belge güncel?</text>
  </svg></figure>`;
};

/* ── 03 · Üç sütun ───────────────────────────────────────────────────── */
const s03 = () => {
  const pillar = (color, soft, kicker, title, desc, items) => `
    <div class="card pillar" style="border-top:5px solid ${color}">
      <span class="chip" style="background:${soft};color:${color};align-self:flex-start;
            font-size:14px;letter-spacing:.08em">${kicker}</span>
      <h3>${title}</h3>
      <p>${desc}</p>
      <ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>
    </div>`;
  return `<div style="display:flex;flex-direction:column;gap:24px;width:100%">
    <div class="grid3">
      ${pillar("#2563EB", "#EFF6FF", "1 · İŞ", "İşi planlarsınız",
        "Müşteri, proje, görev ve takvim aynı yerde durur.",
        ["Projeler ve alt görevler", "Kanban · Takvim · Gantt", "Kim neyi ne zaman yapacak"])}
      ${pillar("#059669", "#ECFDF5", "2 · PARA", "Parayı takip edersiniz",
        "Fatura, gider, tahsilat ve kasa tek defterde birleşir.",
        ["Kasa & banka hareketleri", "Fatura, gider, tahsilat", "Çoklu para birimi + kur"])}
      ${pillar("#7C3AED", "#F5F3FF", "3 · BELGE", "Bilgiyi saklarsınız",
        "Sözleşme, form ve rapor işin yanında yaşar.",
        ["Dokümanlar + sürüm geçmişi", "Şablonlar ve formlar", "Excel / PDF çıktısı"])}
    </div>
    <div class="card" style="background:#0B1220;border:0;padding:22px 30px;display:flex;
         align-items:center;justify-content:space-between;gap:24px">
      <span style="font:600 24px/1.3 var(--sans);color:#F8FAFC">
        Üçü aynı veriyi paylaşır: görev bitince bütçe de, rapor da kendiliğinden güncellenir.
      </span>
      <span class="chip d">Tek kayıt · tek doğru</span>
    </div>
  </div>`;
};

/* ── 04 · Uçtan uca akış (ana görsel) ────────────────────────────────── */
const s04 = () => {
  const steps = [
    ["1", "Müşteri", "Cari kartı açılır;", "sözleşme dosyası eklenir."],
    ["2", "Proje", "Bütçe, tarih ve ekip", "tanımlanır."],
    ["3", "Görevler", "İş parçalara bölünür,", "kişilere atanır."],
    ["4", "Para", "Fatura, gider ve tahsilat", "kaydı girilir."],
    ["5", "Rapor", "Kârlılık ve cari ekstre", "otomatik oluşur."],
  ];
  const X = [0, 304, 608, 912, 1216];
  const arrows = [["kimin için", 255], ["nasıl bölünür", 559], ["maliyeti ne", 863], ["sonuç ne", 1167]];
  return `<figure><svg class="flow" viewBox="0 0 1416 450" role="img"
      aria-label="Müşteriden projeye, görevden para hareketine ve rapora uzanan beş adımlı akış; rapor yeni kararı besleyerek döngüyü başa döndürür">
    ${ARROW("a4", "#94A3B8")}
    ${steps.map((s, i) => `
      <rect x="${X[i]}" y="60" width="200" height="160" rx="16" fill="#FFFFFF" stroke="#E5E7EB"/>
      <rect x="${X[i]}" y="60" width="200" height="4" rx="2" fill="#2563EB"/>
      <rect x="${X[i] + 18}" y="82" width="32" height="32" rx="9" fill="#0B1220"/>
      <text class="m" x="${X[i] + 34}" y="104" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">${s[0]}</text>
      <text x="${X[i] + 18}" y="152" font-size="26" font-weight="700" fill="#111827">${s[1]}</text>
      <text x="${X[i] + 18}" y="182" font-size="15" fill="#6B7280">${s[2]}</text>
      <text x="${X[i] + 18}" y="203" font-size="15" fill="#6B7280">${s[3]}</text>`).join("")}
    ${arrows.map(([l, mid]) => `
      <line x1="${mid - 41}" y1="140" x2="${mid + 41}" y2="140" stroke="#94A3B8" stroke-width="2.5" marker-end="url(#a4)"/>
      <text x="${mid}" y="124" font-size="15" fill="#6B7280" text-anchor="middle">${l}</text>`).join("")}

    <path d="M1316 220 C 1316 390, 100 390, 100 220" fill="none" stroke="#4F46E5"
          stroke-width="2.5" stroke-dasharray="8 7" marker-end="url(#a4)"/>
    <rect x="468" y="333" width="480" height="34" rx="8" fill="#FFFFFF"/>
    <text x="708" y="356" font-size="17" font-weight="600" fill="#4F46E5" text-anchor="middle">
      Rapor kararı besler, döngü yeni projeyle başa döner
    </text>
  </svg></figure>`;
};

/* ── 05 · Genel Bakış ekranı ─────────────────────────────────────────── */
const MENU = ["Genel Bakış", "Projeler", "Görevler", "Takvim", "Finans", "Dokümanlar", "Raporlar"];
const sideNav = (active) => shellNav(MENU, MENU.indexOf(active));

const s05 = () => {
  const kpi = (k, v, d, c) => `<div class="kpi"><span class="k">${k}</span><span class="v">${v}</span><span class="d" style="color:${c}">${d}</span></div>`;
  const bars = [62, 78, 54, 90, 71, 84, 96, 68];
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"];
  return `<div class="app">
    <div class="bar"><em></em><em></em><em></em><span>Genel Bakış</span></div>
    <div class="win">${sideNav("Genel Bakış")}
      <div class="main">
        <div class="grid4">
          ${kpi("Aktif proje", "12", "3 tanesi bu ay bitiyor", "#4B5563")}
          ${kpi("Geciken görev", "5", "geçen haftaya göre +2", "#DC2626")}
          ${kpi("Bu ay tahsilat", "482.000 ₺", "aylık hedefin %94'ü", "#059669")}
          ${kpi("Bekleyen fatura", "7", "toplam 318.400 ₺", "#B45309")}
        </div>
        <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:16px;flex:1;min-height:0">
          <div class="card" style="padding:16px 18px;display:flex;flex-direction:column;gap:12px;min-height:0">
            <b style="font:600 17px/1 var(--sans)">Aylık gelir / gider dengesi</b>
            <div class="bars">
              ${bars.map((h, i) => `<div class="b"><i style="height:${h}%"></i><u>${months[i]}</u></div>`).join("")}
            </div>
          </div>
          <div class="card" style="overflow:hidden;display:flex;flex-direction:column;min-height:0">
            <b style="font:600 17px/1 var(--sans);padding:16px 18px 12px">Bugün dikkat isteyenler</b>
            <table class="tbl">
              <tr><td>Sözleşme onayı bekliyor</td><td class="r"><span class="chip n">2 gün gecikti</span></td></tr>
              <tr><td>Vadesi gelen fatura</td><td class="r"><span class="chip w">bugün</span></td></tr>
              <tr><td>Saha raporu yüklenecek</td><td class="r"><span class="chip">yarın</span></td></tr>
              <tr><td>Kur güncellendi (TCMB)</td><td class="r"><span class="chip p">tamam</span></td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

/* ── 06 · Proje konsolu ──────────────────────────────────────────────── */
const s06 = () => `<div class="app">
  <div class="bar"><em></em><em></em><em></em><span>Projeler › Belediye Su Şebekesi Yenileme</span></div>
  <div class="win">${sideNav("Projeler")}
    <div class="main">
      <div class="card" style="padding:18px 20px;display:flex;align-items:center;gap:28px">
        <div style="flex:1">
          <div style="font:700 26px/1.2 var(--sans);letter-spacing:-.02em">Belediye Su Şebekesi Yenileme</div>
          <div style="font:500 16px/1 var(--sans);color:var(--ink3);margin-top:8px">Müşteri: Karadeniz Altyapı A.Ş. · Teslim: 30.11.2026</div>
        </div>
        <div style="min-width:360px">
          <div style="display:flex;justify-content:space-between;gap:20px;white-space:nowrap;
               font:600 15px/1 var(--sans);margin-bottom:8px">
            <span style="color:var(--ink2)">Bütçe kullanımı</span>
            <span class="num">840.000 ₺ / 1.200.000 ₺</span>
          </div>
          <div style="height:10px;border-radius:6px;background:var(--sunken);overflow:hidden">
            <div style="width:70%;height:100%;background:#059669"></div>
          </div>
        </div>
        <span class="chip p">%70 tamamlandı</span>
      </div>
      <div style="display:flex;gap:8px">
        ${["Genel", "Görevler", "Bütçe", "Belgeler", "Ekip"].map((t, i) =>
          `<span class="chip ${i === 1 ? "a" : ""}">${t}</span>`).join("")}
      </div>
      <div class="card" style="overflow:hidden;flex:1;min-height:0">
        <table class="tbl">
          <tr><th>Görev</th><th>Sorumlu</th><th>Bitiş</th><th>Durum</th><th style="text-align:right">Harcanan</th></tr>
          <tr><td>Keşif ve ölçüm raporu</td><td><span class="avat" style="background:#2563EB">MK</span> M. Kaya</td><td class="r">12.09</td><td><span class="chip p">Tamam</span></td><td class="r">46.200 ₺</td></tr>
          <tr><td>Boru temini · 1. parti</td><td><span class="avat" style="background:#7C3AED">AY</span> A. Yıldız</td><td class="r">28.09</td><td><span class="chip p">Tamam</span></td><td class="r">312.500 ₺</td></tr>
          <tr><td>Hat döşeme · 2. etap</td><td><span class="avat" style="background:#DC2626">EÖ</span> E. Öz</td><td class="r">21.10</td><td><span class="chip n">Gecikti</span></td><td class="r">463.300 ₺</td></tr>
          <tr><td>Basınç testi</td><td><span class="avat" style="background:#4B5563">—</span> Atanmadı</td><td class="r">14.11</td><td><span class="chip">Bekliyor</span></td><td class="r">—</td></tr>
        </table>
      </div>
    </div>
  </div>
</div>`;

/* ── 07 · Dört görünüm ───────────────────────────────────────────────── */
const s07 = () => {
  const frame = (label, hint, inner) => `
    <div class="card" style="overflow:hidden;display:flex;flex-direction:column;min-height:0">
      <div style="padding:13px 16px;border-bottom:1px solid var(--line);display:flex;
           align-items:center;justify-content:space-between;flex:none">
        <b style="font:700 19px/1 var(--sans)">${label}</b>
        <span style="font:500 14px/1 var(--sans);color:var(--ink3)">${hint}</span>
      </div>
      <div style="flex:1;padding:12px 14px;min-height:0;overflow:hidden">${inner}</div>
    </div>`;

  const liste = `<table class="tbl" style="background:transparent">
    <tr><td>Keşif raporu</td><td class="r"><span class="chip p">Tamam</span></td></tr>
    <tr><td>Kazı ruhsatı</td><td class="r"><span class="chip w">Devam</span></td></tr>
    <tr><td>Hat döşeme</td><td class="r"><span class="chip n">Gecikti</span></td></tr>
  </table>`;

  const kanban = `<div class="kb">
    ${[["Yapılacak", 4, ["Basınç testi", "Etiketleme"]],
       ["Devam", 3, ["Kazı ruhsatı", "Hat döşeme"]],
       ["Onayda", 2, ["Hakediş #3"]],
       ["Bitti", 9, ["Keşif raporu", "Boru temini"]]].map(([t, n, cards]) => `
      <div class="col"><b>${t}<span>${n}</span></b>
        ${cards.map((c) => `<div class="t">${c}<i></i></div>`).join("")}
      </div>`).join("")}
  </div>`;

  const takvim = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;height:100%">
    ${["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) =>
      `<div style="font:600 13px/1 var(--sans);color:var(--ink3);text-align:center;padding:2px 0">${d}</div>`).join("")}
    ${Array.from({ length: 21 }, (_, i) => {
      const ev = { 3: ["#2563EB", "Keşif"], 8: ["#059669", "Teslim"], 10: ["#7C3AED", "Toplantı"], 16: ["#DC2626", "Son gün"] }[i];
      return `<div style="border:1px solid var(--line);border-radius:7px;background:var(--paper);
        padding:4px 5px;display:flex;flex-direction:column;gap:3px;min-height:0">
        <span style="font:600 11px/1 var(--mono);color:var(--ink3)">${i + 1}</span>
        ${ev ? `<span style="font:600 10px/1.2 var(--sans);color:#fff;background:${ev[0]};
          border-radius:4px;padding:3px 4px">${ev[1]}</span>` : ""}
      </div>`;
    }).join("")}
  </div>`;

  const gantt = `<div style="display:flex;flex-direction:column;gap:11px;height:100%;justify-content:center">
    ${[["Keşif", 0, 22, "#059669"], ["Temin", 14, 34, "#2563EB"], ["Ruhsat", 30, 24, "#7C3AED"],
       ["Döşeme", 46, 40, "#DC2626"], ["Test", 78, 20, "#9CA3AF"]].map(([t, off, w, c]) => `
      <div style="display:flex;align-items:center;gap:10px">
        <span style="width:74px;font:600 14px/1 var(--sans);color:var(--ink2)">${t}</span>
        <div style="flex:1;height:15px;background:var(--sunken);border-radius:8px;position:relative">
          <div style="position:absolute;left:${off}%;width:${w}%;height:100%;background:${c};border-radius:8px"></div>
        </div>
      </div>`).join("")}
  </div>`;

  return `<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;
       gap:20px;width:100%;height:100%">
    ${frame("Liste", "filtrele, sırala, toplu düzenle", liste)}
    ${frame("Kanban", "sürükle-bırak ile durum değiştir", kanban)}
    ${frame("Takvim", "kim ne zaman müsait", takvim)}
    ${frame("Gantt", "proje detayı içinde", gantt)}
  </div>`;
};

/* ── 08 · Finans ─────────────────────────────────────────────────────── */
const s08 = () => {
  const lanes = [
    ["Satış faturası kesilir", "#2563EB", "tahsilat girilir", "Kasa / banka girişi", "otomatik", "Cari alacak kapanır"],
    ["Gider / masraf girilir", "#DC2626", "ödeme yapılır", "Kasa / banka çıkışı", "otomatik", "Proje maliyetine işlenir"],
    ["Döviz kuru (TCMB)", "#B45309", "her gün çekilir", "₺ karşılığı hesaplanır", "otomatik", "Raporlar tek para biriminde"],
  ];
  const X = [0, 518, 1036];
  const box = (x, y, t, accent) => `
    <rect x="${x}" y="${y}" width="380" height="96" rx="14" fill="#FFFFFF" stroke="#E5E7EB"/>
    ${accent ? `<rect x="${x}" y="${y}" width="5" height="96" rx="2.5" fill="${accent}"/>` : ""}
    <text x="${x + 26}" y="${y + 56}" font-size="22" font-weight="600" fill="#111827">${t}</text>`;
  const arr = (mid, y, label) => `
    <line x1="${mid - 54}" y1="${y + 48}" x2="${mid + 54}" y2="${y + 48}" stroke="#94A3B8"
          stroke-width="2.5" marker-end="url(#a8)"/>
    <text x="${mid}" y="${y + 32}" font-size="15" fill="#6B7280" text-anchor="middle">${label}</text>`;
  return `<figure><svg class="flow" viewBox="0 0 1416 470" role="img"
      aria-label="Fatura, gider ve kur kayıtları kasa hareketine dönüşür ve oradan cari, proje maliyeti ve raporlara otomatik işlenir">
    ${ARROW("a8", "#94A3B8")}
    ${lanes.map((l, i) => {
      const y = i * 130;
      return box(X[0], y, l[0], l[1]) + arr(448, y, l[2]) + box(X[1], y, l[3], null) + arr(966, y, l[4]) + box(X[2], y, l[5], null);
    }).join("")}
    <rect x="0" y="396" width="1416" height="70" rx="16" fill="#EFF6FF"/>
    <text x="34" y="439" font-size="21" font-weight="600" fill="#1D4ED8">
      Tek defter · Çift kayıt otomatik tutulur — Cari Ekstre ve Proje Kârlılığı her an hazır
    </text>
  </svg></figure>`;
};

/* ── 09 · Belgeler & formlar ─────────────────────────────────────────── */
const s09 = () => `<div class="grid2" style="height:100%">
  <div class="card" style="overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:15px 18px;border-bottom:1px solid var(--line);display:flex;
         justify-content:space-between;align-items:center">
      <b style="font:700 21px/1 var(--sans)">Dokümanlar</b>
      <span class="chip b">sürüm geçmişi açık</span>
    </div>
    <div style="flex:1;display:flex;min-height:0">
      <div style="width:200px;border-right:1px solid var(--line);padding:14px 12px;
           display:flex;flex-direction:column;gap:8px;background:var(--paper2)">
        ${[["Projeler", 1], ["Su Şebekesi", 0], ["Sözleşmeler", 0], ["Hakedişler", 0], ["Şirket", 1], ["Sigorta", 0]]
          .map(([t, top]) => `<span style="font:${top ? "600" : "500"} 15px/1 var(--sans);
            color:${top ? "var(--ink)" : "var(--ink2)"};padding-left:${top ? 0 : 14}px">${top ? "" : "· "}${t}</span>`).join("")}
      </div>
      <div style="flex:1;padding:16px;display:grid;grid-template-columns:1fr 1fr;
           grid-auto-rows:min-content;gap:12px">
        ${[["Sözleşme", "PDF", "v3", "#DC2626"], ["Keşif raporu", "DOCX", "v2", "#2563EB"],
           ["Hakediş-3", "XLSX", "v1", "#059669"], ["Ruhsat", "PDF", "v1", "#DC2626"]].map(([n, x, v, c]) => `
          <div style="border:1px solid var(--line);border-radius:11px;padding:12px;
               display:flex;flex-direction:column;gap:9px;background:var(--paper)">
            <span style="align-self:flex-start;border-radius:6px;padding:5px 9px;background:${c}1F;
                  color:${c};font:700 12px/1 var(--mono);letter-spacing:.06em">${x}</span>
            <span style="font:600 15px/1.25 var(--sans)">${n}</span>
            <span style="font:600 12px/1 var(--mono);color:var(--ink3)">${v} · güncel</span>
          </div>`).join("")}
      </div>
    </div>
  </div>

  <div class="card" style="overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:15px 18px;border-bottom:1px solid var(--line);display:flex;
         justify-content:space-between;align-items:center">
      <b style="font:700 21px/1 var(--sans)">Şablonlar &amp; Formlar</b>
      <span class="chip a">kodsuz oluşturulur</span>
    </div>
    <div style="flex:1;padding:18px;display:flex;flex-direction:column;gap:14px;min-height:0">
      <div style="display:flex;flex-direction:column;gap:10px">
        ${[["Soru tipi seç", "Kısa yanıt · Çoktan seçmeli · Dosya · Tarih"],
           ["Formu paylaş", "Bağlantı veya e-posta ile"],
           ["Yanıtlar biriksin", "Tablo hâlinde, Excel'e aktarılır"]].map((r, i) => `
          <div style="display:flex;gap:14px;align-items:flex-start">
            <span class="stepnum" style="width:34px;height:34px;font-size:15px">${i + 1}</span>
            <div><div style="font:600 19px/1.2 var(--sans)">${r[0]}</div>
                 <div style="font:400 16px/1.35 var(--sans);color:var(--ink2);margin-top:5px">${r[1]}</div></div>
          </div>`).join("")}
      </div>
      <div class="card soft" style="flex:1;padding:14px 16px;min-height:0;overflow:hidden">
        <div style="font:600 15px/1 var(--sans);color:var(--ink3);margin-bottom:11px">Gelen yanıtlar · 148</div>
        <table class="tbl" style="background:transparent">
          <tr><td>Saha güvenlik formu</td><td class="r">42 yanıt</td></tr>
          <tr><td>Tedarikçi ön değerlendirme</td><td class="r">61 yanıt</td></tr>
          <tr><td>Müşteri memnuniyeti</td><td class="r">45 yanıt</td></tr>
          <tr><td>İş güvenliği kontrol listesi</td><td class="r">28 yanıt</td></tr>
        </table>
      </div>
    </div>
  </div>
</div>`;

/* ── 10 · Raporlar ───────────────────────────────────────────────────── */
const s10 = () => {
  const card = (title, desc, body) => `
    <div class="card" style="overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:18px 20px 14px">
        <div style="font:700 24px/1.2 var(--sans);letter-spacing:-.02em">${title}</div>
        <div style="font:400 16px/1.4 var(--sans);color:var(--ink2);margin-top:7px">${desc}</div>
      </div>
      <div style="flex:1;padding:0 20px;min-height:0">${body}</div>
      <div style="padding:14px 20px;display:flex;gap:8px;border-top:1px solid var(--line-soft)">
        <span class="chip p">Excel</span><span class="chip n">PDF</span><span class="chip">Yazdır</span>
      </div>
    </div>`;
  const rows = (data) => `<table class="tbl" style="background:transparent">${data.map(
    ([a, b, c]) => `<tr><td>${a}</td><td class="r" style="color:${c || "inherit"}">${b}</td></tr>`).join("")}</table>`;
  return `<div class="grid2" style="height:100%">
    ${card("Proje Kârlılığı", "Bütçe, gerçekleşen ve kalan — proje bazında.",
      rows([["Su Şebekesi", "+ 360.000 ₺", "#059669"], ["Fabrika Otomasyon", "+ 142.500 ₺", "#059669"],
            ["Depo Yenileme", "− 28.400 ₺", "#DC2626"], ["Bakım Sözleşmesi", "+ 96.000 ₺", "#059669"],
            ["Saha Kurulumu", "+ 51.700 ₺", "#059669"], ["Toplam", "+ 621.800 ₺", "#059669"]]))}
    ${card("Cari Ekstre", "Bir müşterinin tüm borç / alacak hareketi.",
      rows([["Devir", "0 ₺"], ["Fatura #2026-114", "+ 285.000 ₺"], ["Tahsilat", "− 150.000 ₺"],
            ["Fatura #2026-131", "+ 78.000 ₺"], ["Tahsilat", "− 78.000 ₺"],
            ["Bakiye", "135.000 ₺", "#B45309"]]))}
  </div>`;
};

/* ── 12 · Hibe yönetimi ──────────────────────────────────────────────── */
const s12 = () => `<div style="display:grid;grid-template-columns:1.25fr 1fr;gap:24px;width:100%;height:100%">
  <div class="card" style="overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:16px 20px;border-bottom:1px solid var(--line);display:flex;
         justify-content:space-between;align-items:center">
      <b style="font:700 21px/1 var(--sans)">Açık hibe çağrıları</b>
      <span class="chip b">güncel katalog</span>
    </div>
    <table class="tbl">
      <tr><th>Çağrı</th><th>Kurum</th><th>Son başvuru</th><th style="text-align:right">Uygunluk</th></tr>
      <tr><td>Yeşil Dönüşüm Desteği</td><td>KOSGEB</td><td class="r">30.09.2026</td><td class="r"><span class="chip p">%92 uygun</span></td></tr>
      <tr><td>Ar-Ge Başlangıç Programı</td><td>TÜBİTAK</td><td class="r">15.10.2026</td><td class="r"><span class="chip p">%78 uygun</span></td></tr>
      <tr><td>İhracat Pazarlama Desteği</td><td>Ticaret Bak.</td><td class="r">01.11.2026</td><td class="r"><span class="chip w">%54 uygun</span></td></tr>
      <tr><td>Dijitalleşme Hibesi</td><td>Kalkınma Aj.</td><td class="r">22.11.2026</td><td class="r"><span class="chip">%31 uygun</span></td></tr>
      <tr><td>Kadın Girişimci Desteği</td><td>KOSGEB</td><td class="r">05.12.2026</td><td class="r"><span class="chip w">%47 uygun</span></td></tr>
      <tr><td>Enerji Verimliliği Programı</td><td>Sanayi Bak.</td><td class="r">18.12.2026</td><td class="r"><span class="chip p">%83 uygun</span></td></tr>
    </table>
  </div>
  <div style="display:flex;flex-direction:column;gap:18px;min-height:0;justify-content:space-between">
    ${[["Profilinizi bir kez girin", "Sektör, ölçek, il, çalışan sayısı, sertifikalar."],
       ["Sistem eşleştirsin", "Uygun çağrılar uygunluk yüzdesiyle öne çıkar."],
       ["Başvuruyu takip edin", "Belgeler, tarihler ve durum tek dosyada."],
       ["Kazanılan hibe projeye dönsün", "Bütçesi ve görevleriyle normal proje gibi yönetilir."]]
      .map(([t, d], i) => `
      <div class="card" style="padding:16px 18px;display:flex;gap:15px;align-items:flex-start">
        <span class="stepnum">${i + 1}</span>
        <div><div style="font:700 21px/1.2 var(--sans)">${t}</div>
        <div style="font:400 17px/1.35 var(--sans);color:var(--ink2);margin-top:6px">${d}</div></div>
      </div>`).join("")}
  </div>
</div>`;

/* ── 13 · Roller ve yetkiler ─────────────────────────────────────────── */
const s13 = () => {
  const P = { t: ["Tümü", "p"], k: ["Kendi projesi", "b"], g: ["Sadece görüntüler", "a"], y: ["Yok", ""] };
  const cols = ["Projeler", "Görevler", "Finans", "Belgeler", "Raporlar", "Ayarlar"];
  const rows = [
    ["Yönetici", "şirket sahibi / genel müdür", ["t", "t", "t", "t", "t", "t"]],
    ["Proje Yöneticisi", "işi yürüten kişi", ["k", "k", "g", "k", "k", "y"]],
    ["Ekip Üyesi", "sahada / masada çalışan", ["g", "k", "y", "k", "y", "y"]],
    ["Muhasebe", "mali işler", ["g", "y", "t", "g", "t", "y"]],
    ["Görüntüleyici", "danışman / dış paydaş", ["g", "g", "y", "g", "g", "y"]],
  ];
  const cell = (k) => k === "y"
    ? `<span style="color:var(--ink3);font:600 17px/1 var(--mono)">—</span>`
    : `<span class="chip ${P[k][1]}">${P[k][0]}</span>`;
  return `<div class="card" style="width:100%;overflow:hidden;align-self:center">
    <table class="tbl" style="table-layout:fixed">
      <tr>
        <th style="width:270px">Rol</th>
        ${cols.map((c) => `<th style="text-align:center">${c}</th>`).join("")}
      </tr>
      ${rows.map(([r, d, ks]) => `
        <tr>
          <td style="padding:20px 18px">
            <div style="font:700 21px/1.2 var(--sans)">${r}</div>
            <div style="font:400 15px/1.2 var(--sans);color:var(--ink3);margin-top:6px">${d}</div>
          </td>
          ${ks.map((k) => `<td class="r" style="text-align:center">${cell(k)}</td>`).join("")}
        </tr>`).join("")}
    </table>
  </div>`;
};

/* ── 14 · Çok şirketli yapı + güvenlik ───────────────────────────────── */
const s14 = () => {
  const X = [32, 498, 964];
  const names = [["Ana Şirket", "#2563EB"], ["İnşaat A.Ş.", "#059669"], ["Enerji Ltd.", "#7C3AED"]];
  const chips = [
    ["Kim ne zaman ne değiştirdi", "işlem geçmişi kayıtlı"],
    ["KVKK rıza kaydı", "onay metni ve tarihi saklanır"],
    ["Rol bazlı yetki", "modül modül açılır / kapanır"],
    ["Şifreli anahtar saklama", "dış servis anahtarları açıkta durmaz"],
  ];
  return `<figure><svg class="flow" viewBox="0 0 1416 400" role="img"
      aria-label="Tek platform üzerinde her şirketin verisi ayrı bölmede tutulur; şirketler birbirinin verisini göremez">
    <rect x="0" y="0" width="1416" height="292" rx="20" fill="#F9FAFB" stroke="#E5E7EB" stroke-dasharray="9 7"/>
    <text class="m" x="32" y="34" font-size="13" font-weight="700" fill="#9CA3AF" letter-spacing="2">
      TEK PLATFORM · TEK GÜNCELLEME · TEK YEDEK
    </text>
    ${names.map(([n, c], i) => `
      <rect x="${X[i]}" y="56" width="420" height="200" rx="16" fill="#FFFFFF" stroke="#E5E7EB"/>
      <rect x="${X[i]}" y="56" width="420" height="4" rx="2" fill="${c}"/>
      <text x="${X[i] + 26}" y="102" font-size="25" font-weight="700" fill="#111827">${n}</text>
      ${["Projeler ve görevler", "Faturalar ve kasa", "Belgeler ve formlar"].map((r, j) => `
        <circle cx="${X[i] + 32}" cy="${131 + j * 34}" r="4" fill="${c}"/>
        <text x="${X[i] + 48}" y="${137 + j * 34}" font-size="17" fill="#4B5563">${r}</text>`).join("")}
      <text x="${X[i] + 26}" y="232" font-size="15" font-weight="600" fill="${c}">kendi kullanıcıları · kendi yetkileri</text>`).join("")}
    ${[475, 941].map((x) => `
      <line x1="${x}" y1="66" x2="${x}" y2="246" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 6"/>
      <rect x="${x - 15}" y="140" width="30" height="30" rx="8" fill="#E7E9EF"/>
      <rect x="${x - 6}" y="150" width="12" height="10" rx="2" fill="#64748B"/>
      <path d="M${x - 4} 150 v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="#64748B" stroke-width="2"/>`).join("")}
    <text x="708" y="278" font-size="17" font-weight="600" fill="#64748B" text-anchor="middle">
      Bir şirketin verisi diğerinin ekranında asla görünmez
    </text>
    ${chips.map(([t, d], i) => {
      const x = i * 360;
      return `<rect x="${x}" y="324" width="336" height="72" rx="14" fill="#FFFFFF" stroke="#E5E7EB"/>
      <text x="${x + 20}" y="354" font-size="18" font-weight="600" fill="#111827">${t}</text>
      <text x="${x + 20}" y="379" font-size="15" fill="#6B7280">${d}</text>`;
    }).join("")}
  </svg></figure>`;
};

/* ── 15 · Her yerden erişim ──────────────────────────────────────────── */
const s15 = () => {
  const tile = (k, v, c, fs = 9) => `<div style="flex:1;border:1px solid var(--line);border-radius:7px;
    padding:6px 7px;display:flex;flex-direction:column;gap:3px;background:var(--paper);min-width:0">
    <span style="font:600 ${fs}px/1 var(--sans);color:var(--ink3);white-space:nowrap;overflow:hidden">${k}</span>
    <span style="font:700 ${fs + 6}px/1 var(--sans);color:${c};font-variant-numeric:tabular-nums">${v}</span></div>`;
  const row = (t, c, fs = 10) => `<div style="display:flex;align-items:center;gap:6px;
    padding:5px 0;border-bottom:1px solid var(--line-soft)">
    <span style="width:5px;height:5px;border-radius:50%;background:${c};flex:none"></span>
    <span style="font:500 ${fs}px/1.2 var(--sans);color:var(--ink2);white-space:nowrap;
      overflow:hidden;text-overflow:ellipsis">${t}</span></div>`;
  const label = (t) => `<div style="text-align:center;font:600 17px/1 var(--sans);
    color:var(--ink2);margin-top:14px">${t}</div>`;

  return `<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:28px;width:100%;height:100%">
    <div class="card soft" style="padding:26px;display:flex;align-items:center;justify-content:center">
     <div style="display:flex;align-items:flex-end;justify-content:center;gap:24px;width:100%">
      <div style="flex:1;max-width:500px">
        <div style="border:1px solid var(--line);border-radius:12px;background:var(--paper);
             padding:11px;display:flex;flex-direction:column;gap:8px;height:262px">
          <div style="display:flex;align-items:center;gap:5px;padding-bottom:7px;border-bottom:1px solid var(--line-soft)">
            ${[0, 1, 2].map(() => `<span style="width:7px;height:7px;border-radius:50%;background:#E5E7EB"></span>`).join("")}
            <span style="font:600 10px/1 var(--sans);color:var(--ink3);margin-left:6px">Genel Bakış</span>
          </div>
          <div style="display:flex;gap:7px">
            ${tile("Aktif proje", "12", "var(--ink)")}${tile("Geciken", "5", "#DC2626")}
            ${tile("Tahsilat", "482K", "#059669")}${tile("Fatura", "7", "#B45309")}
          </div>
          <div style="display:flex;gap:9px;flex:1;min-height:0">
            <div style="flex:1.15;border:1px solid var(--line);border-radius:8px;padding:8px;
                 display:flex;align-items:flex-end;gap:5px;background:var(--paper)">
              ${[58, 74, 50, 88, 67, 80, 94, 64].map((h) =>
                `<div style="flex:1;height:${h}%;border-radius:3px 3px 0 0;background:#2563EB;opacity:.85"></div>`).join("")}
            </div>
            <div style="flex:1;border:1px solid var(--line);border-radius:8px;padding:6px 9px;background:var(--paper)">
              ${row("Sözleşme onayı", "#DC2626")}${row("Vadesi gelen fatura", "#B45309")}
              ${row("Saha raporu", "#2563EB")}${row("Kur güncellendi", "#059669")}
            </div>
          </div>
        </div>
        ${label("Masaüstü — tam görünüm")}
      </div>

      <div style="width:172px">
        <div style="border:1px solid var(--line);border-radius:12px;background:var(--paper);
             padding:10px;display:flex;flex-direction:column;gap:7px;height:214px">
          <span style="font:600 10px/1 var(--sans);color:var(--ink3)">Projeler</span>
          <div style="display:flex;gap:6px">${tile("Aktif", "12", "var(--ink)", 8)}${tile("Geciken", "5", "#DC2626", 8)}</div>
          <div style="flex:1;border:1px solid var(--line);border-radius:8px;padding:5px 8px;min-height:0">
            ${row("Su Şebekesi", "#059669", 9)}${row("Fabrika Otom.", "#2563EB", 9)}
            ${row("Depo Yenileme", "#B45309", 9)}${row("Bakım Sözleşm.", "#7C3AED", 9)}
          </div>
        </div>
        ${label("Tablet")}
      </div>

      <div style="width:118px">
        <div style="border:1px solid var(--line);border-radius:16px;background:var(--paper);
             padding:9px;display:flex;flex-direction:column;gap:6px;height:238px">
          <div style="height:4px;width:34px;border-radius:2px;background:#E5E7EB;margin:0 auto 2px"></div>
          <span style="font:600 9px/1 var(--sans);color:var(--ink3)">Görevlerim</span>
          <div style="display:flex">${tile("Bugün biten", "3", "#DC2626", 8)}</div>
          <div style="flex:1;border:1px solid var(--line);border-radius:8px;padding:4px 7px;min-height:0">
            ${row("Kazı ruhsatı", "#B45309", 9)}${row("Basınç testi", "#2563EB", 9)}
            ${row("Hakediş #3", "#7C3AED", 9)}
          </div>
          <div style="display:flex;gap:4px">${["#4F46E5", "#E5E7EB", "#E5E7EB", "#E5E7EB"].map((c) =>
            `<div style="flex:1;height:14px;border-radius:4px;background:${c}"></div>`).join("")}</div>
        </div>
        ${label("Telefon")}
      </div>
     </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px;min-height:0">
      <div class="card" style="padding:20px 22px">
        <div style="font:700 22px/1.2 var(--sans)">Kurulum yok</div>
        <div style="font:400 17px/1.4 var(--sans);color:var(--ink2);margin-top:8px">
          Tarayıcıdan girilir. Telefonda menü alta iner, tabloların yerini kart listesi alır.
        </div>
      </div>
      <div class="card" style="padding:20px 22px;flex:1;min-height:0">
        <div style="font:700 22px/1.2 var(--sans);margin-bottom:14px">Haberiniz olur</div>
        ${[["Görev size atandı", "#2563EB"], ["Fatura vadesi yaklaştı", "#B45309"],
           ["Onayınız bekleniyor", "#7C3AED"], ["Proje bütçesi %90'a ulaştı", "#DC2626"]].map(([t, c]) => `
          <div style="display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid var(--line-soft)">
            <span style="width:9px;height:9px;border-radius:50%;background:${c};flex:none"></span>
            <span style="font:500 17px/1.2 var(--sans)">${t}</span>
          </div>`).join("")}
        <div style="font:500 15px/1.35 var(--sans);color:var(--ink3);margin-top:14px">
          Uygulama içi bildirim ve e-posta olarak; hangisini isteyeceğinizi kendiniz seçersiniz.
        </div>
      </div>
    </div>
  </div>`;
};

/* ── 16 · Başlangıç ──────────────────────────────────────────────────── */
const s16 = () => {
  const steps = [
    ["Şirketinizi açalım", "Kullanıcılar, roller ve yetkiler tanımlanır."],
    ["Mevcut veriyi taşıyalım", "Müşteri listesi, açık projeler ve kasa açılış bakiyeleri aktarılır."],
    ["Bir projeyle deneyelim", "Tek bir gerçek proje uçtan uca sistemde yürütülür."],
    ["Ekip devralsın", "Kısa eğitim sonrası tüm projeler taşınır."],
  ];
  return `<div style="display:flex;flex-direction:column;gap:28px;width:100%;height:100%;justify-content:center">
    <div class="grid4">
      ${steps.map(([t, d], i) => `
        <div style="background:#131C30;border:1px solid #1E293B;border-radius:16px;
             padding:26px 24px;display:flex;flex-direction:column;gap:14px">
          <span style="width:44px;height:44px;border-radius:12px;background:#2563EB;color:#fff;
                display:grid;place-items:center;font:700 20px/1 var(--mono)">${i + 1}</span>
          <div style="font:700 25px/1.2 var(--sans);color:#F8FAFC;letter-spacing:-.02em">${t}</div>
          <div style="font:400 17px/1.45 var(--sans);color:#94A3B8">${d}</div>
        </div>`).join("")}
    </div>
    <div style="border-radius:16px;background:rgba(37,99,235,.12);border:1px solid #1E3A8A;
         padding:24px 30px;display:flex;align-items:center;justify-content:space-between;gap:24px">
      <span style="font:600 26px/1.3 var(--sans);color:#F8FAFC;letter-spacing:-.01em">
        “Ne durumdayız?” sorusunun cevabı artık tek tık uzağınızda.
      </span>
      <span class="chip" style="background:#2563EB;color:#fff;font-size:17px;padding:11px 20px">Demo için hazırız</span>
    </div>
  </div>`;
};

/* ── Slayt listesi ───────────────────────────────────────────────────── */
export const deckTitle = "Apya Platform Tanıtımı";

export const slides = [
  {
    section: "", eyebrow: "APYA PLATFORM", night: true, cover: true,
    title: "Projeleriniz, ekibiniz ve paranız — tek ekranda.",
    sub: "Müşteriden projeye, görevden faturaya, belgeden rapora kadar tüm işiniz aynı yerde birleşir.",
    canvas: `<div style="display:flex;align-items:flex-end;gap:14px;width:100%">
      ${["Müşteri", "Proje", "Görev", "Para", "Rapor"].map((t, i) => `
        <div style="display:flex;align-items:center;gap:14px">
          <div style="border:1px solid #1E293B;background:#131C30;border-radius:12px;padding:14px 22px;
               font:600 20px/1 var(--sans);color:#E2E8F0">${t}</div>
          ${i < 4 ? `<span style="width:26px;height:2px;background:#334155;display:block"></span>` : ""}
        </div>`).join("")}
    </div>`,
    note: `<b>Tanıtım sunumu.</b> Ekran görselleri örnek verilerle hazırlanmıştır.`,
  },
  {
    section: "NEDEN", eyebrow: "SORUN",
    title: "Bugün bilgi altı ayrı yerde duruyor",
    sub: "Hiçbiri yanlış değil — ama hiçbiri tek başına doğru resmi vermiyor.",
    canvas: s02(),
    note: `Basit bir soruya cevap vermek için <b>dört kişiye sormak</b> ve üç dosyayı karşılaştırmak gerekiyor. Cevap geldiğinde ise çoktan eskimiş oluyor.`,
  },
  {
    section: "NEDEN", eyebrow: "ÇÖZÜM",
    title: "Apya üç şeyi birbirine bağlar",
    sub: "İş, para ve belge ayrı programlarda değil; aynı kaydın üç yüzü olarak durur.",
    canvas: s03(),
    note: `Bilgiyi <b>bir kez</b> girersiniz. Aynı veriyi ikinci bir yere kopyalamak diye bir adım kalmaz.`,
  },
  {
    section: "NEDEN", eyebrow: "AKIŞ",
    title: "İşin baştan sona yolculuğu",
    sub: "Sistemde her şey bu beş adımın üzerinde ilerler.",
    canvas: s04(),
    note: `Her adım bir sonrakini <b>otomatik besler</b>: görevi tamamladığınızda bütçe, faturayı kestiğinizde kasa ve cari, ay sonunda ise rapor kendiliğinden güncellenir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "01 · GENEL BAKIŞ",
    title: "Sabah açtığınızda gördüğünüz ekran",
    sub: "Gününüze nereden başlayacağınızı söyleyen tek sayfa.",
    canvas: s05(),
    note: `Her rakam tıklanabilir: <b>“5 geciken görev”</b> yazısına bastığınızda o beş görevin listesine inersiniz.`,
  },
  {
    section: "EKRANLAR", eyebrow: "02 · PROJELER",
    title: "Her projenin kendi konsolu var",
    sub: "İşin durumu ve parası aynı ekranda, yan yana.",
    canvas: s06(),
    note: `Proje kâr ediyor mu diye <b>tahmin etmezsiniz</b>: harcanan tutar görevlerden, bütçe ise proje tanımından gelir; ikisi aynı satırda görünür.`,
  },
  {
    section: "EKRANLAR", eyebrow: "03 · GÖREVLER",
    title: "Aynı görevler, dört farklı bakış",
    sub: "Veri tek; herkes kendine uygun görünümü seçer.",
    canvas: s07(),
    note: `Kanban'da bir kartı sürüklediğinizde <b>liste, takvim ve Gantt aynı anda</b> değişir — çünkü hepsi aynı görevi gösterir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "04 · FİNANS",
    title: "Para nereden geldi, nereye gitti",
    sub: "Muhasebe bilgisi gerektirmeden, doğru kayıt otomatik oluşur.",
    canvas: s08(),
    note: `Siz sadece <b>“fatura kestim”</b> veya <b>“şu gideri ödedim”</b> dersiniz; kasa, cari ve proje maliyeti arkada kendiliğinden işlenir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "05 · BELGELER",
    title: "Belgeler klasörde değil, işin yanında",
    sub: "Her dosya ait olduğu projeye ve göreve bağlı durur.",
    canvas: s09(),
    note: `Aynı dosyanın yeni sürümünü yüklediğinizde <b>eskisi silinmez</b>, arşive iner. “Hangisi güncel?” sorusu ortadan kalkar.`,
  },
  {
    section: "EKRANLAR", eyebrow: "06 · RAPORLAR",
    title: "Rapor için kimseden veri istemezsiniz",
    sub: "Günlük çalışırken girilen kayıtlar raporu zaten oluşturur.",
    canvas: s10(),
    note: `Her rapor <b>Excel veya PDF</b> olarak indirilir; tarih aralığı, proje ve müşteri filtreleri hazır gelir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "07 · HİBE YÖNETİMİ",
    title: "Size uygun hibeyi kaçırmayın",
    sub: "Açık çağrılar tek listede; profilinize uyanlar öne çıkar.",
    canvas: s12(),
    note: `Kazanılan hibe <b>normal bir projeye dönüşür</b> — bütçesi, görevleri ve harcama belgeleriyle aynı sistemde yürür.`,
  },
  {
    section: "GÜVEN", eyebrow: "YETKİ",
    title: "Herkes yalnızca kendi işini görür",
    sub: "Yetkiler modül modül açılır; kimse görmemesi gerekeni görmez.",
    canvas: s13(),
    note: `Roller örnektir — <b>kendi organizasyonunuza göre</b> yeni rol tanımlanabilir, mevcutların yetkisi tek tek değiştirilebilir.`,
  },
  {
    section: "GÜVEN", eyebrow: "GÜVENLİK",
    title: "Şirketiniz kendi kapalı alanında",
    sub: "Birden fazla şirketi tek platformda, birbirine karıştırmadan yönetirsiniz.",
    canvas: s14(),
    note: `Grup şirketleri, şubeler veya farklı markalar <b>ayrı bölmelerde</b> durur; raporlarınız yalnızca kendi verinizi kapsar.`,
  },
  {
    section: "GÜVEN", eyebrow: "ERİŞİM",
    title: "Ofiste, sahada, yolda",
    sub: "Aynı sistem üç ekran boyutunda da çalışır.",
    canvas: s15(),
    note: `Sahadaki ekip telefondan <b>görev günceller ve fotoğraf yükler</b>; ofis aynı anda güncel durumu görür.`,
  },
  {
    section: "BAŞLANGIÇ", eyebrow: "NASIL BAŞLARIZ", night: true,
    title: "Kullanmaya başlamak: dört adım",
    sub: "Her şeyi ilk gün taşımayız — önce tek bir projeyle güven kurarız.",
    canvas: s16(),
    note: ``,
  },
];
