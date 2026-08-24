// Apya Platform — DERNEK / VAKIF odaklı tanıtım sunumu, slayt içerikleri.
// Şirket sürümü ayrı dosyadadır: slides-sirket.mjs
//
// KAPSAM KARARI: Üyelik ve aidat takibi üründe YOKTUR (üye modülü, aidat
// tahakkuku, gönüllü yönetimi yok). Bu sunum onlara HİÇ değinmez; ürünün
// gerçekten güçlü olduğu yerlere odaklanır: fon/hibe yönetimi, bağış ve
// faturasız gelir, proje bazlı bütçe, belge düzeni ve şeffaflık.
// Yeni slayt eklerken bu kurala uy — olmayan özelliği anlatma.

import { ARROW, sideNav as shellNav } from "./common.mjs";

/* ── 02 · Bugünkü dağınıklık ─────────────────────────────────────────── */
const s02 = () => {
  const left = [
    ["Excel tabloları", "fon bütçesi, harcama takibi"],
    ["WhatsApp grupları", "saha ve ekip koordinasyonu"],
    ["E-posta ekleri", "fon sözleşmesi, yazışma"],
  ];
  const right = [
    ["Masaüstü klasörleri", "faaliyet fotoğrafı, belgeler"],
    ["Kağıt fiş & dekont", "ay sonunda toplanır"],
    ["Muhasebecideki kayıt", "resmî defter orada"],
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
      aria-label="Fon raporu istendiğinde bilginin altı ayrı yerden tek tek toplanması gerekiyor">
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
    <text x="708" y="212" font-size="24" font-weight="700" fill="#B91C1C" text-anchor="middle">Bu fon nereye gitti?</text>
    <text x="708" y="248" font-size="17" fill="#DC2626" text-anchor="middle">Hangi harcama hangi projeye ait?</text>
    <text x="708" y="276" font-size="17" fill="#DC2626" text-anchor="middle">Sözleşmenin son hali nerede?</text>
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
      ${pillar("#2563EB", "#EFF6FF", "1 · FAALİYET", "Faaliyeti planlarsınız",
        "Proje, görev ve takvim aynı yerde durur.",
        ["Projeler ve alt görevler", "Kanban · Takvim · Gantt", "Kim neyi ne zaman yapacak"])}
      ${pillar("#059669", "#ECFDF5", "2 · KAYNAK", "Kaynağı takip edersiniz",
        "Hibe, bağış ve harcama tek defterde birleşir.",
        ["Hibe ve bağış ayrı kategoride", "Kasa & banka hareketleri", "Çoklu para birimi + TCMB kuru"])}
      ${pillar("#7C3AED", "#F5F3FF", "3 · KANIT", "Kanıtı saklarsınız",
        "Sözleşme, fatura ve faaliyet belgesi işin yanında yaşar.",
        ["Belgeler + sürüm geçmişi", "Formlar ve şablonlar", "Excel / PDF raporu"])}
    </div>
    <div class="card" style="background:#0B1220;border:0;padding:22px 30px;display:flex;
         align-items:center;justify-content:space-between;gap:24px">
      <span style="font:600 24px/1.3 var(--sans);color:#F8FAFC">
        Üçü aynı veriyi paylaşır: harcamayı girdiğiniz anda fonun kalanı da, raporu da güncellenir.
      </span>
      <span class="chip d">Tek kayıt · tek doğru</span>
    </div>
  </div>`;
};

/* ── 04 · Uçtan uca akış (ana görsel) ────────────────────────────────── */
const s04 = () => {
  const steps = [
    ["1", "Kaynak", "Hibe veya bağış kaydedilir,", "kasaya işlenir."],
    ["2", "Proje", "Fonun bütçesi, tarihi ve", "ekibi tanımlanır."],
    ["3", "Faaliyet", "İş parçalara bölünür,", "kişilere atanır."],
    ["4", "Harcama", "Fatura, fiş ve ödeme", "kaydı girilir."],
    ["5", "Rapor", "Fon kullanımı ve mizan", "otomatik oluşur."],
  ];
  const X = [0, 304, 608, 912, 1216];
  // Etiketler kutular arasındaki 104 px boşluğa sığmalı — ~11 karakteri geçme,
  // yoksa kutuların üzerine taşar.
  const arrows = [["hangi proje", 255], ["nasıl yürür", 559], ["ne harcandı", 863], ["sonuç ne", 1167]];
  return `<figure><svg class="flow" viewBox="0 0 1416 450" role="img"
      aria-label="Kaynaktan projeye, faaliyetten harcamaya ve rapora uzanan beş adımlı akış; rapor bir sonraki fon başvurusunu besleyerek döngüyü başa döndürür">
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
    <rect x="452" y="333" width="512" height="34" rx="8" fill="#FFFFFF"/>
    <text x="708" y="356" font-size="17" font-weight="600" fill="#4F46E5" text-anchor="middle">
      Temiz rapor bir sonraki fon başvurusunu güçlendirir
    </text>
  </svg></figure>`;
};

/* ── Uygulama maketi sol menüsü ──────────────────────────────────────── */
const MENU = ["Genel Bakış", "Projeler", "Görevler", "Takvim", "Kaynaklar", "Belgeler", "Raporlar"];
const sideNav = (active) => shellNav(MENU, MENU.indexOf(active));

/* ── 05 · Genel Bakış ekranı ─────────────────────────────────────────── */
const s05 = () => {
  const kpi = (k, v, d, c) => `<div class="kpi"><span class="k">${k}</span><span class="v">${v}</span><span class="d" style="color:${c}">${d}</span></div>`;
  const bars = [62, 78, 54, 90, 71, 84, 96, 68];
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"];
  return `<div class="app">
    <div class="bar"><em></em><em></em><em></em><span>Genel Bakış</span></div>
    <div class="win">${sideNav("Genel Bakış")}
      <div class="main">
        <div class="grid4">
          ${kpi("Yürüyen proje", "12", "3 tanesi bu ay bitiyor", "#4B5563")}
          ${kpi("Geciken görev", "5", "geçen haftaya göre +2", "#DC2626")}
          ${kpi("Bu ay gelen kaynak", "482.000 ₺", "hibe + bağış toplamı", "#059669")}
          ${kpi("Onay bekleyen harcama", "7", "toplam 318.400 ₺", "#B45309")}
        </div>
        <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:16px;flex:1;min-height:0">
          <div class="card" style="padding:16px 18px;display:flex;flex-direction:column;gap:12px;min-height:0">
            <b style="font:600 17px/1 var(--sans)">Aylık kaynak / harcama dengesi</b>
            <div class="bars">
              ${bars.map((h, i) => `<div class="b"><i style="height:${h}%"></i><u>${months[i]}</u></div>`).join("")}
            </div>
          </div>
          <div class="card" style="overflow:hidden;display:flex;flex-direction:column;min-height:0">
            <b style="font:600 17px/1 var(--sans);padding:16px 18px 12px">Bugün dikkat isteyenler</b>
            <table class="tbl">
              <tr><td>Fon ara raporu teslimi</td><td class="r"><span class="chip n">2 gün gecikti</span></td></tr>
              <tr><td>Eğitmen sözleşmesi onayı</td><td class="r"><span class="chip w">bugün</span></td></tr>
              <tr><td>Atölye fotoğrafları yüklenecek</td><td class="r"><span class="chip">yarın</span></td></tr>
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
  <div class="bar"><em></em><em></em><em></em><span>Projeler › Çocuklar İçin Okuma Atölyeleri</span></div>
  <div class="win">${sideNav("Projeler")}
    <div class="main">
      <div class="card" style="padding:18px 20px;display:flex;align-items:center;gap:28px">
        <div style="flex:1">
          <div style="font:700 26px/1.2 var(--sans);letter-spacing:-.02em">Çocuklar İçin Okuma Atölyeleri</div>
          <div style="font:500 16px/1 var(--sans);color:var(--ink3);margin-top:8px">Fon: Sivil Toplum Destek Programı · Bitiş: 30.11.2026</div>
        </div>
        <div style="min-width:360px">
          <div style="display:flex;justify-content:space-between;gap:20px;white-space:nowrap;
               font:600 15px/1 var(--sans);margin-bottom:8px">
            <span style="color:var(--ink2)">Fon kullanımı</span>
            <span class="num">840.000 ₺ / 1.200.000 ₺</span>
          </div>
          <div style="height:10px;border-radius:6px;background:var(--sunken);overflow:hidden">
            <div style="width:70%;height:100%;background:#059669"></div>
          </div>
        </div>
        <span class="chip p">%70 tamamlandı</span>
      </div>
      <div style="display:flex;gap:8px">
        ${["Genel", "Faaliyetler", "Bütçe", "Belgeler", "Ekip"].map((t, i) =>
          `<span class="chip ${i === 1 ? "a" : ""}">${t}</span>`).join("")}
      </div>
      <div class="card" style="overflow:hidden;flex:1;min-height:0">
        <table class="tbl">
          <tr><th>Faaliyet</th><th>Sorumlu</th><th>Bitiş</th><th>Durum</th><th style="text-align:right">Harcanan</th></tr>
          <tr><td>Okul ziyaretleri ve planlama</td><td><span class="avat" style="background:#2563EB">MK</span> M. Kaya</td><td class="r">12.09</td><td><span class="chip p">Tamam</span></td><td class="r">46.200 ₺</td></tr>
          <tr><td>Kitap ve malzeme alımı</td><td><span class="avat" style="background:#7C3AED">AY</span> A. Yıldız</td><td class="r">28.09</td><td><span class="chip p">Tamam</span></td><td class="r">312.500 ₺</td></tr>
          <tr><td>Atölyeler · 2. dönem</td><td><span class="avat" style="background:#DC2626">EÖ</span> E. Öz</td><td class="r">21.10</td><td><span class="chip n">Gecikti</span></td><td class="r">463.300 ₺</td></tr>
          <tr><td>Fon ara raporu</td><td><span class="avat" style="background:#4B5563">—</span> Atanmadı</td><td class="r">14.11</td><td><span class="chip">Bekliyor</span></td><td class="r">—</td></tr>
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
    <tr><td>Okul ziyaretleri</td><td class="r"><span class="chip p">Tamam</span></td></tr>
    <tr><td>Eğitmen sözleşmesi</td><td class="r"><span class="chip w">Devam</span></td></tr>
    <tr><td>Atölyeler · 2. dönem</td><td class="r"><span class="chip n">Gecikti</span></td></tr>
  </table>`;

  const kanban = `<div class="kb">
    ${[["Yapılacak", 4, ["Ara rapor", "Duyuru metni"]],
       ["Devam", 3, ["Eğitmen sözleşmesi", "Atölyeler"]],
       ["Onayda", 2, ["Harcama listesi"]],
       ["Bitti", 9, ["Okul ziyaretleri", "Malzeme alımı"]]].map(([t, n, cards]) => `
      <div class="col"><b>${t}<span>${n}</span></b>
        ${cards.map((c) => `<div class="t">${c}<i></i></div>`).join("")}
      </div>`).join("")}
  </div>`;

  const takvim = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;height:100%">
    ${["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) =>
      `<div style="font:600 13px/1 var(--sans);color:var(--ink3);text-align:center;padding:2px 0">${d}</div>`).join("")}
    ${Array.from({ length: 21 }, (_, i) => {
      const ev = { 3: ["#2563EB", "Atölye"], 8: ["#059669", "Ziyaret"], 10: ["#7C3AED", "Kurul"], 16: ["#DC2626", "Ara rapor"] }[i];
      return `<div style="border:1px solid var(--line);border-radius:7px;background:var(--paper);
        padding:4px 5px;display:flex;flex-direction:column;gap:3px;min-height:0">
        <span style="font:600 11px/1 var(--mono);color:var(--ink3)">${i + 1}</span>
        ${ev ? `<span style="font:600 10px/1.2 var(--sans);color:#fff;background:${ev[0]};
          border-radius:4px;padding:3px 4px">${ev[1]}</span>` : ""}
      </div>`;
    }).join("")}
  </div>`;

  const gantt = `<div style="display:flex;flex-direction:column;gap:11px;height:100%;justify-content:center">
    ${[["Hazırlık", 0, 22, "#059669"], ["Duyuru", 14, 34, "#2563EB"], ["Atölyeler", 30, 24, "#7C3AED"],
       ["Ara rapor", 46, 40, "#DC2626"], ["Kapanış", 78, 20, "#9CA3AF"]].map(([t, off, w, c]) => `
      <div style="display:flex;align-items:center;gap:10px">
        <span style="width:84px;font:600 14px/1 var(--sans);color:var(--ink2)">${t}</span>
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

/* ── 08 · Kaynak akışı ───────────────────────────────────────────────── */
const s08 = () => {
  const lanes = [
    ["Hibe / fon girişi", "#2563EB", "kaydedilir", "Kasa / banka girişi", "otomatik", "Projenin bütçesine bağlanır"],
    ["Bağış / sponsorluk", "#059669", "kaydedilir", "Kasa / banka girişi", "otomatik", "Bağışçı kaydına işlenir"],
    ["Harcama / fiş", "#DC2626", "ödeme yapılır", "Kasa / banka çıkışı", "otomatik", "Fon kullanımına düşer"],
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
      aria-label="Hibe, bağış ve harcama kayıtları kasa hareketine dönüşür ve oradan proje bütçesine, bağışçı kaydına ve fon kullanımına otomatik işlenir">
    ${ARROW("a8", "#94A3B8")}
    ${lanes.map((l, i) => {
      const y = i * 130;
      return box(X[0], y, l[0], l[1]) + arr(448, y, l[2]) + box(X[1], y, l[3], null) + arr(966, y, l[4]) + box(X[2], y, l[5], null);
    }).join("")}
    <rect x="0" y="396" width="1416" height="70" rx="16" fill="#EFF6FF"/>
    <text x="34" y="439" font-size="21" font-weight="600" fill="#1D4ED8">
      Hibe ve bağış AYRI kategorilerde tutulur — satış geliriyle karışmaz, raporda ayrışır
    </text>
  </svg></figure>`;
};

/* ── 09 · Belgeler & formlar ─────────────────────────────────────────── */
const s09 = () => `<div class="grid2" style="height:100%">
  <div class="card" style="overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:15px 18px;border-bottom:1px solid var(--line);display:flex;
         justify-content:space-between;align-items:center">
      <b style="font:700 21px/1 var(--sans)">Belgeler</b>
      <span class="chip b">sürüm geçmişi açık</span>
    </div>
    <div style="flex:1;display:flex;min-height:0">
      <div style="width:200px;border-right:1px solid var(--line);padding:14px 12px;
           display:flex;flex-direction:column;gap:8px;background:var(--paper2)">
        ${[["Projeler", 1], ["Okuma Atölyeleri", 0], ["Fon sözleşmeleri", 0], ["Ara raporlar", 0], ["Dernek", 1], ["Tüzük ve kararlar", 0]]
          .map(([t, top]) => `<span style="font:${top ? "600" : "500"} 15px/1 var(--sans);
            color:${top ? "var(--ink)" : "var(--ink2)"};padding-left:${top ? 0 : 14}px">${top ? "" : "· "}${t}</span>`).join("")}
      </div>
      <div style="flex:1;padding:16px;display:grid;grid-template-columns:1fr 1fr;
           grid-auto-rows:min-content;gap:12px">
        ${[["Fon sözleşmesi", "PDF", "v3", "#DC2626"], ["Ara rapor", "DOCX", "v2", "#2563EB"],
           ["Harcama listesi", "XLSX", "v1", "#059669"], ["Faaliyet izni", "PDF", "v1", "#DC2626"]].map(([n, x, v, c]) => `
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
      <b style="font:700 21px/1 var(--sans)">Formlar</b>
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
        <div style="font:600 15px/1 var(--sans);color:var(--ink3);margin-bottom:11px">Gelen yanıtlar · 176</div>
        <table class="tbl" style="background:transparent">
          <tr><td>Atölye katılım kaydı</td><td class="r">61 yanıt</td></tr>
          <tr><td>Destek başvuru formu</td><td class="r">42 yanıt</td></tr>
          <tr><td>Katılımcı memnuniyeti</td><td class="r">45 yanıt</td></tr>
          <tr><td>Eğitmen değerlendirme</td><td class="r">28 yanıt</td></tr>
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
  return `<div class="grid3" style="height:100%">
    ${card("Proje / Fon Bütçesi", "Bütçe, harcanan ve kalan — proje bazında.",
      rows([["Okuma Atölyeleri", "kalan 360.000 ₺", "#059669"], ["Kadın Kooperatifi", "kalan 142.500 ₺", "#059669"],
            ["Depo Yenileme", "aşım 28.400 ₺", "#DC2626"], ["Çevre Eğitimi", "kalan 96.000 ₺", "#059669"],
            ["Saha Ekipmanı", "kalan 51.700 ₺", "#059669"], ["Toplam kalan", "621.800 ₺", "#059669"]]))}
    ${card("Cari Ekstre", "Bir bağışçının / kurumun tüm hareketi.",
      rows([["Devir", "0 ₺"], ["Bağış · Mart", "+ 285.000 ₺"], ["Bağış · Haziran", "+ 78.000 ₺"],
            ["Proje harcaması", "− 150.000 ₺"], ["Proje harcaması", "− 78.000 ₺"],
            ["Bakiye", "135.000 ₺", "#B45309"]]))}
    ${card("Mizan (Özet)", "Dönem sonu borç / alacak dengesi.",
      rows([["Kasa & Banka", "612.300 ₺"], ["Alacaklar", "418.900 ₺"], ["Borçlar", "236.100 ₺"],
            ["Giderler", "294.600 ₺"], ["Gelirler", "1.089.700 ₺"], ["Denge", "Tutuyor", "#059669"]]))}
  </div>`;
};

/* ── 11 · AI ön eleme ────────────────────────────────────────────────── */
const s11 = () => {
  const X = [0, 508, 1016];
  const steps = [
    ["Başvuru formu gelir", "Destek talebi, katılım başvurusu,\neğitmen adaylığı…", "#2563EB"],
    ["Yapay zekâ okur", "Sizin yazdığınız kriterlere göre\nyanıtı değerlendirir.", "#7C3AED"],
    ["Skor + risk + gerekçe", "Her karar, neden öyle verildiğiyle\nbirlikte kaydedilir.", "#059669"],
  ];
  return `<figure><svg class="flow" viewBox="0 0 1416 388" role="img"
      aria-label="Gelen başvuru formunu yapay zekâ tanımlı kriterlere göre değerlendirir, skor ve gerekçe üretir, sonuç kurala göre otomatik aksiyona bağlanır">
    ${ARROW("a11", "#94A3B8")}
    ${steps.map(([t, d, c], i) => {
      const lines = d.split("\n");
      return `
      <rect x="${X[i]}" y="10" width="400" height="210" rx="16" fill="#FFFFFF" stroke="#E5E7EB"/>
      <rect x="${X[i]}" y="10" width="400" height="4" rx="2" fill="${c}"/>
      <text class="m" x="${X[i] + 26}" y="58" font-size="14" font-weight="700" fill="${c}"
            letter-spacing="2">ADIM ${i + 1}</text>
      <text x="${X[i] + 26}" y="110" font-size="27" font-weight="700" fill="#111827">${t}</text>
      ${lines.map((ln, j) => `<text x="${X[i] + 26}" y="${152 + j * 26}" font-size="17" fill="#6B7280">${ln}</text>`).join("")}`;
    }).join("")}
    ${[[454, "otomatik"], [962, "saniyede"]].map(([mid, l]) => `
      <line x1="${mid - 40}" y1="118" x2="${mid + 40}" y2="118" stroke="#94A3B8" stroke-width="2.5" marker-end="url(#a11)"/>
      <text x="${mid}" y="102" font-size="15" fill="#6B7280" text-anchor="middle">${l}</text>`).join("")}

    <rect x="0" y="262" width="1416" height="110" rx="16" fill="#F5F3FF"/>
    <text x="34" y="306" font-size="22" font-weight="700" fill="#6D28D9">Sonuç sizin kuralınıza bağlanır</text>
    <text x="34" y="340" font-size="18" fill="#7C3AED">
      Riskliyse koordinatöre bildirim gönder · Belirli skorun üstündeyse onaya düşür · Etiketle · Dış sisteme ilet
    </text>
    <text x="1382" y="306" font-size="15" fill="#8B5CF6" text-anchor="end">Sağlayıcı seçimi sizde:</text>
    <text x="1382" y="340" font-size="16" font-weight="600" fill="#6D28D9" text-anchor="end">Claude · Gemini · OpenAI · DeepSeek</text>
  </svg></figure>`;
};

/* ── 12 · Fon / hibe yönetimi ────────────────────────────────────────── */
const s12 = () => `<div style="display:grid;grid-template-columns:1.25fr 1fr;gap:24px;width:100%;height:100%">
  <div class="card" style="overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:16px 20px;border-bottom:1px solid var(--line);display:flex;
         justify-content:space-between;align-items:center">
      <b style="font:700 21px/1 var(--sans)">Açık fon çağrıları</b>
      <span class="chip b">güncel katalog</span>
    </div>
    <table class="tbl">
      <tr><th>Çağrı</th><th>Kurum</th><th>Son başvuru</th><th style="text-align:right">Uygunluk</th></tr>
      <tr><td>Sivil Toplum Destek Programı</td><td>AB / Sivil Düşün</td><td class="r">30.09.2026</td><td class="r"><span class="chip p">%92 uygun</span></td></tr>
      <tr><td>Çevre Eğitimi Fonu</td><td>Çevre Bakanlığı</td><td class="r">18.10.2026</td><td class="r"><span class="chip p">%83 uygun</span></td></tr>
      <tr><td>Yerel Kalkınma Hibesi</td><td>Kalkınma Ajansı</td><td class="r">15.10.2026</td><td class="r"><span class="chip p">%78 uygun</span></td></tr>
      <tr><td>Gençlik Projeleri Desteği</td><td>Gençlik ve Spor Bak.</td><td class="r">01.11.2026</td><td class="r"><span class="chip w">%54 uygun</span></td></tr>
      <tr><td>Kadın Kooperatifleri Desteği</td><td>Ticaret Bakanlığı</td><td class="r">05.12.2026</td><td class="r"><span class="chip w">%47 uygun</span></td></tr>
      <tr><td>Erasmus+ Küçük Ölçekli Ortaklık</td><td>Ulusal Ajans</td><td class="r">22.11.2026</td><td class="r"><span class="chip">%31 uygun</span></td></tr>
    </table>
  </div>
  <div style="display:flex;flex-direction:column;gap:18px;min-height:0;justify-content:space-between">
    ${[["Dernek profilinizi bir kez girin", "Faaliyet alanı, il, ölçek, hedef kitle, belgeler."],
       ["Sistem eşleştirsin", "Uygun çağrılar uygunluk yüzdesiyle öne çıkar."],
       ["Başvuruyu takip edin", "Belgeler, tarihler ve durum tek dosyada."],
       ["Kazanılan fon projeye dönsün", "Bütçesi ve faaliyetleriyle aynı sistemde yürür."]]
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
  const cols = ["Projeler", "Görevler", "Kaynaklar", "Belgeler", "Raporlar", "Ayarlar"];
  const rows = [
    ["Yönetim Kurulu", "başkan / yönetici", ["t", "t", "t", "t", "t", "t"]],
    ["Proje Koordinatörü", "fonu yürüten kişi", ["k", "k", "g", "k", "k", "y"]],
    ["Ekip / Saha", "faaliyeti yürüten kişi", ["g", "k", "y", "k", "y", "y"]],
    ["Sayman / Muhasebe", "mali işler", ["g", "y", "t", "g", "t", "y"]],
    ["Denetim Kurulu", "bağımsız denetim", ["g", "g", "g", "g", "g", "y"]],
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

/* ── 14 · Çok kuruluşlu yapı + şeffaflık ─────────────────────────────── */
const s14 = () => {
  const X = [32, 498, 964];
  const names = [["Genel Merkez", "#2563EB"], ["İstanbul Şubesi", "#059669"], ["İzmir Temsilciliği", "#7C3AED"]];
  const chips = [
    ["Kim ne zaman ne değiştirdi", "işlem geçmişi kayıtlı"],
    ["KVKK rıza kaydı", "onay metni ve tarihi saklanır"],
    ["Rol bazlı yetki", "modül modül açılır / kapanır"],
    ["Şifreli anahtar saklama", "dış servis anahtarları açıkta durmaz"],
  ];
  return `<figure><svg class="flow" viewBox="0 0 1416 400" role="img"
      aria-label="Tek platform üzerinde her şubenin verisi ayrı bölmede tutulur; şubeler birbirinin verisini göremez">
    <rect x="0" y="0" width="1416" height="292" rx="20" fill="#F9FAFB" stroke="#E5E7EB" stroke-dasharray="9 7"/>
    <text class="m" x="32" y="34" font-size="13" font-weight="700" fill="#9CA3AF" letter-spacing="2">
      TEK PLATFORM · TEK GÜNCELLEME · TEK YEDEK
    </text>
    ${names.map(([n, c], i) => `
      <rect x="${X[i]}" y="56" width="420" height="200" rx="16" fill="#FFFFFF" stroke="#E5E7EB"/>
      <rect x="${X[i]}" y="56" width="420" height="4" rx="2" fill="${c}"/>
      <text x="${X[i] + 26}" y="102" font-size="25" font-weight="700" fill="#111827">${n}</text>
      ${["Projeler ve faaliyetler", "Bağış, hibe ve harcama", "Belgeler ve formlar"].map((r, j) => `
        <circle cx="${X[i] + 32}" cy="${131 + j * 34}" r="4" fill="${c}"/>
        <text x="${X[i] + 48}" y="${137 + j * 34}" font-size="17" fill="#4B5563">${r}</text>`).join("")}
      <text x="${X[i] + 26}" y="232" font-size="15" font-weight="600" fill="${c}">kendi kullanıcıları · kendi yetkileri</text>`).join("")}
    ${[475, 941].map((x) => `
      <line x1="${x}" y1="66" x2="${x}" y2="246" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 6"/>
      <rect x="${x - 15}" y="140" width="30" height="30" rx="8" fill="#E7E9EF"/>
      <rect x="${x - 6}" y="150" width="12" height="10" rx="2" fill="#64748B"/>
      <path d="M${x - 4} 150 v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="#64748B" stroke-width="2"/>`).join("")}
    <text x="708" y="278" font-size="17" font-weight="600" fill="#64748B" text-anchor="middle">
      Bir şubenin verisi diğerinin ekranında asla görünmez
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
            ${tile("Yürüyen proje", "12", "var(--ink)")}${tile("Geciken", "5", "#DC2626")}
            ${tile("Kaynak", "482K", "#059669")}${tile("Onayda", "7", "#B45309")}
          </div>
          <div style="display:flex;gap:9px;flex:1;min-height:0">
            <div style="flex:1.15;border:1px solid var(--line);border-radius:8px;padding:8px;
                 display:flex;align-items:flex-end;gap:5px;background:var(--paper)">
              ${[58, 74, 50, 88, 67, 80, 94, 64].map((h) =>
                `<div style="flex:1;height:${h}%;border-radius:3px 3px 0 0;background:#2563EB;opacity:.85"></div>`).join("")}
            </div>
            <div style="flex:1;border:1px solid var(--line);border-radius:8px;padding:6px 9px;background:var(--paper)">
              ${row("Fon ara raporu", "#DC2626")}${row("Sözleşme onayı", "#B45309")}
              ${row("Atölye fotoğrafı", "#2563EB")}${row("Kur güncellendi", "#059669")}
            </div>
          </div>
        </div>
        ${label("Masaüstü — tam görünüm")}
      </div>

      <div style="width:172px">
        <div style="border:1px solid var(--line);border-radius:12px;background:var(--paper);
             padding:10px;display:flex;flex-direction:column;gap:7px;height:214px">
          <span style="font:600 10px/1 var(--sans);color:var(--ink3)">Projeler</span>
          <div style="display:flex;gap:6px">${tile("Yürüyen", "12", "var(--ink)", 8)}${tile("Geciken", "5", "#DC2626", 8)}</div>
          <div style="flex:1;border:1px solid var(--line);border-radius:8px;padding:5px 8px;min-height:0">
            ${row("Okuma Atölyeleri", "#059669", 9)}${row("Kadın Koop.", "#2563EB", 9)}
            ${row("Çevre Eğitimi", "#B45309", 9)}${row("Saha Ekipmanı", "#7C3AED", 9)}
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
            ${row("Eğitmen sözleşmesi", "#B45309", 9)}${row("Atölye planı", "#2563EB", 9)}
            ${row("Ara rapor", "#7C3AED", 9)}
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
        ${[["Görev size atandı", "#2563EB"], ["Fon ara raporu yaklaştı", "#B45309"],
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
    ["Derneğinizi açalım", "Kullanıcılar, roller ve yetkiler tanımlanır."],
    ["Mevcut veriyi taşıyalım", "Bağışçı listesi, yürüyen projeler ve kasa açılış bakiyeleri aktarılır."],
    ["Bir fonla deneyelim", "Tek bir gerçek proje uçtan uca sistemde yürütülür."],
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
        “Bu para nereye gitti?” sorusunun cevabı artık tek tık uzağınızda.
      </span>
      <span class="chip" style="background:#2563EB;color:#fff;font-size:17px;padding:11px 20px">Demo için hazırız</span>
    </div>
  </div>`;
};

/* ── Slayt listesi ───────────────────────────────────────────────────── */
export const deckTitle = "Apya Dernek Sunumu";

export const slides = [
  {
    section: "", eyebrow: "APYA PLATFORM", night: true, cover: true,
    title: "Projeleriniz, fonlarınız ve bağışlarınız — tek ekranda.",
    sub: "Fon başvurusundan faaliyet raporuna kadar derneğinizin tüm işi aynı yerde birleşir.",
    canvas: `<div style="display:flex;align-items:flex-end;gap:14px;width:100%">
      ${["Kaynak", "Proje", "Faaliyet", "Harcama", "Rapor"].map((t, i) => `
        <div style="display:flex;align-items:center;gap:14px">
          <div style="border:1px solid #1E293B;background:#131C30;border-radius:12px;padding:14px 22px;
               font:600 20px/1 var(--sans);color:#E2E8F0">${t}</div>
          ${i < 4 ? `<span style="width:26px;height:2px;background:#334155;display:block"></span>` : ""}
        </div>`).join("")}
    </div>`,
    note: `<b>Dernek ve vakıflar için tanıtım sunumu.</b> Ekran görselleri örnek verilerle hazırlanmıştır.`,
  },
  {
    section: "NEDEN", eyebrow: "SORUN",
    title: "Fon raporu istendiğinde işler durur",
    sub: "Bilgi altı ayrı yerde; hiçbiri yanlış değil ama hiçbiri tek başına yetmiyor.",
    canvas: s02(),
    note: `Tek bir harcamanın hangi fona ait olduğunu bulmak için <b>dört kişiye sormak</b> ve üç dosyayı karşılaştırmak gerekiyor. Denetim tarihi yaklaştıkça bu iş büyüyor.`,
  },
  {
    section: "NEDEN", eyebrow: "ÇÖZÜM",
    title: "Apya üç şeyi birbirine bağlar",
    sub: "Faaliyet, kaynak ve kanıt ayrı programlarda değil; aynı kaydın üç yüzü olarak durur.",
    canvas: s03(),
    note: `Bilgiyi <b>bir kez</b> girersiniz. Rapor zamanı geldiğinde toplanacak bir şey kalmaz — zaten toplanmıştır.`,
  },
  {
    section: "NEDEN", eyebrow: "AKIŞ",
    title: "Kaynaktan rapora giden yol",
    sub: "Sistemde her şey bu beş adımın üzerinde ilerler.",
    canvas: s04(),
    note: `Her adım bir sonrakini <b>otomatik besler</b>: harcamayı girdiğinizde fonun kalanı, faaliyeti bitirdiğinizde ilerleme, dönem sonunda ise mizan kendiliğinden güncellenir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "01 · GENEL BAKIŞ",
    title: "Sabah açtığınızda gördüğünüz ekran",
    sub: "Gününüze nereden başlayacağınızı söyleyen tek sayfa.",
    canvas: s05(),
    note: `Her rakam tıklanabilir: <b>“7 onay bekleyen harcama”</b> yazısına bastığınızda o harcamaların listesine inersiniz.`,
  },
  {
    section: "EKRANLAR", eyebrow: "02 · PROJELER",
    title: "Her fonun kendi konsolu var",
    sub: "Faaliyetin durumu ve fonun parası aynı ekranda, yan yana.",
    canvas: s06(),
    note: `Fonun ne kadarı kaldı diye <b>tahmin etmezsiniz</b>: harcanan tutar faaliyetlerden, bütçe ise fon tanımından gelir; ikisi aynı satırda görünür.`,
  },
  {
    section: "EKRANLAR", eyebrow: "03 · GÖREVLER",
    title: "Aynı faaliyetler, dört farklı bakış",
    sub: "Veri tek; herkes kendine uygun görünümü seçer.",
    canvas: s07(),
    note: `Kanban'da bir kartı sürüklediğinizde <b>liste, takvim ve Gantt aynı anda</b> değişir — çünkü hepsi aynı faaliyeti gösterir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "04 · KAYNAKLAR",
    title: "Para nereden geldi, nereye gitti",
    sub: "Muhasebe bilgisi gerektirmeden, doğru kayıt otomatik oluşur.",
    canvas: s08(),
    note: `Siz sadece <b>“bağış geldi”</b> veya <b>“şu gideri ödedim”</b> dersiniz; kasa, proje maliyeti ve bağışçı kaydı arkada kendiliğinden işlenir. Yabancı para cinsinden fonlarda kur TCMB'den otomatik çekilir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "05 · BELGELER",
    title: "Denetime hazır durun",
    sub: "Her belge ait olduğu projeye ve faaliyete bağlı durur.",
    canvas: s09(),
    note: `Aynı belgenin yeni sürümünü yüklediğinizde <b>eskisi silinmez</b>, arşive iner. “Fon sözleşmesinin son hali hangisi?” sorusu ortadan kalkar.`,
  },
  {
    section: "EKRANLAR", eyebrow: "06 · RAPORLAR",
    title: "Rapor için kimseden veri istemezsiniz",
    sub: "Günlük çalışırken girilen kayıtlar raporu zaten oluşturur.",
    canvas: s10(),
    note: `Her rapor <b>Excel veya PDF</b> olarak indirilir; tarih aralığı, proje ve kurum filtreleri hazır gelir.`,
  },
  {
    section: "EKRANLAR", eyebrow: "07 · YAPAY ZEKÂ",
    title: "Başvuruları yapay zekâ ön eler",
    sub: "Kararı siz verirsiniz — o sadece ön eleme ve gerekçe hazırlar.",
    canvas: s11(),
    note: `Yapay zekâ <b>kendi kuralını uydurmaz</b>: kriterleri siz yazarsınız, o uygular ve her puan için gerekçesini kayda geçer.`,
  },
  {
    section: "EKRANLAR", eyebrow: "08 · FON YÖNETİMİ",
    title: "Size uygun fonu kaçırmayın",
    sub: "Açık çağrılar tek listede; derneğinizin profiline uyanlar öne çıkar.",
    canvas: s12(),
    note: `Kazanılan fon <b>normal bir projeye dönüşür</b> — bütçesi, faaliyetleri ve harcama belgeleriyle aynı sistemde yürür.`,
  },
  {
    section: "GÜVEN", eyebrow: "YETKİ",
    title: "Herkes yalnızca kendi işini görür",
    sub: "Yetkiler modül modül açılır; kimse görmemesi gerekeni görmez.",
    canvas: s13(),
    note: `Roller örnektir — <b>kendi tüzüğünüze göre</b> yeni rol tanımlanabilir, mevcutların yetkisi tek tek değiştirilebilir. Denetim kuruluna değiştirme yetkisi olmadan görüntüleme açılır.`,
  },
  {
    section: "GÜVEN", eyebrow: "ŞEFFAFLIK",
    title: "Şubeniz kendi kapalı alanında",
    sub: "Genel merkez, şube ve temsilcilikleri tek platformda, birbirine karıştırmadan yönetirsiniz.",
    canvas: s14(),
    note: `Her değişiklik <b>kim ve ne zaman</b> bilgisiyle kayda geçer; bağışçıya ve denetime karşı hesap verirken dayanağınız olur.`,
  },
  {
    section: "GÜVEN", eyebrow: "ERİŞİM",
    title: "Ofiste, sahada, yolda",
    sub: "Aynı sistem üç ekran boyutunda da çalışır.",
    canvas: s15(),
    note: `Sahadaki ekip telefondan <b>faaliyet günceller ve fotoğraf yükler</b>; merkez aynı anda güncel durumu görür.`,
  },
  {
    section: "BAŞLANGIÇ", eyebrow: "NASIL BAŞLARIZ", night: true,
    title: "Kullanmaya başlamak: dört adım",
    sub: "Her şeyi ilk gün taşımayız — önce tek bir fonla güven kurarız.",
    canvas: s16(),
    note: ``,
  },
];
