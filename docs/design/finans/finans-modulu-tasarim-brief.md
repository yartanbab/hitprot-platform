# APYA Platform — Finans Modülü Tasarım Brief'i

> **Kime:** Claude Design (tasarım aracı) · **Hazırlayan:** depo kodundan çıkarıldı, 2026-11-25
> **Kaynak:** APYA Platform deposu, main dalı (`cf496e4f`) — ekranlar, alanlar, metinler ve kurallar
> koddan okundu; tahmin edilen yer "(kodda belirsiz)" diye işaretli.
> **Ürün adı:** APYA Platform (ekranda "APYA"). Depo adı başkadır; tasarımda ürün adı olarak yalnız APYA kullanılır.

---

## 0. Bu dosya nasıl kullanılır

Bu belge, Finans modülünün **bugün koddaki hâlini** ekran ekran anlatır ve yeniden tasarımın
uyması gereken kararları sabitler. Tasarımcı kodu görmeyecek; bu belge tek kaynaktır.

- **§1–§2** ürünü ve alınmış (yeniden tartışılmayacak) kararları anlatır.
- **§3–§4** tasarım dilini ve uygulama kabuğunu verir — yeni ekranlar bu kabuğun **içine** oturur,
  yeni bir kabuk tasarlanmaz.
- **§5** bilgi mimarisi: finansa nereden girilir, hangi sayfa nereye bağlanır.
- **§6** Finans Merkezi ekran envanteri: her sekme, her pencere (modal); alanlar, sütunlar,
  düğmeler, boş durum metinleri. **§7** aynısı Finans Merkezi dışındaki finans sayfaları için
  (Faturalar, Giderler, Masraf Yakala, Gelirler, Kasa & Banka, Kurlar, Değerleme, Bütçe raporu).
- **§8** veri modeli, iş kuralları ve formüller · **§9** izinler ve roller · **§10** gezinme,
  bildirimler, açık denetim bulguları — ekranda neyin gösterilip neyin kilitleneceğini belirler.
- **§11** durum kataloğu · **§12** mobil · **§13** öncelikli sorunlar (tasarımın çözmesi beklenenler).
- **§14** tasarımdan istenen teslimatlar (ekran listesi + ölçüler) · **§15** açık sorular.

Parantez içindeki dosya yolları ve kimlikler (`Invoice.cs:150`, `FIN-02`) geliştirici içindir;
tasarımcı atlayabilir. §6.5 ve §7.11'deki "sorunlar" listeleri ham gözlemdir; özetlenmiş hâli §13'tedir.

Metinler Türkçedir ve **ekranda görünen hâliyle** aktarıldı; tasarımda aynı terimler kullanılmalı
(ör. "Gelir-Gider", "Dilimler", "Kur Köprüsü").

---

## 1. Ürün bağlamı

**APYA Platform** (Akıllı Proje Yönetim Asistanı) çok kiracılı (multi-tenant) bir B2B web
uygulamasıdır: proje & görev yönetimi, hibe başvuru/yönetimi ve proje finansı tek çatı altında.
Teknik zemin: ASP.NET Core Razor Pages + LeptonX Lite teması + Bootstrap 5 + jQuery/DataTables;
bazı ekranlar React adacığı. Arayüz Türkçe.

**Kimler kullanır**
- **Kiracılar:** KOBİ'ler, dernekler/STK'lar, hibe (AB, kalkınma ajansı, KOSGEB vb.) projesi yürüten kurumlar.
- **Host (platform yöneticisi):** kiracıları yönetir. Kiracının projesine bakarken gelir-gider, fatura, kasa ve
  belge kayıtlarını **görmez** (yerine kilit kartı); bütçe kalemi, dilim ve kur köprüsü verisini görür
  (bkz. §6.0 "Host kapsamı", §10.1).
- **Roller (kiracı içi rol şablonları):** Yönetici · **Proje Sorumlusu** (bütçeyi görür ve düzenler; gider/gelir/
  fatura oluşturamaz, kasayı hiç görmez) · **Muhasebe** (tüm finans kayıtları + bütçe düzenleme; projeyi
  düzenleyemez) · **Gözlemci** (yalnız görme). Ayrıntı §9.

**Finans modülü ne yapar**
- Proje bütçesini **kalem kalem** planlar, gerçekleşeni (harcanan/kalan) bağlı kayıtlardan hesaplar.
- Hibe projelerinde **fonlama dilimlerini** (tranche), donörün yaptığı **kesintileri**, **destek oranını**,
  **eş finansmanı**, **bütçe revizyonlarını** ve **donör para birimiyle kur köprüsünü** izler.
- **Gelir ve gider** kayıtları, **faturalar** (KDV, istisna, ödeme), **kasa/banka hesapları** ve aralarındaki
  **transferler**.
- **Belgeler:** her harcamanın belgesi var mı (belge açığı), uygunluk, teslim paketi.
- **Döviz kurları** ve dönem sonu **kur değerlemesi**.
- Her gelir/gider için **üç defter** karşılığı tutulur: işlem para birimi, ₺ (yasal) defter ve donör para birimi.

**Finans modülü ne yapmaz (tasarıma koyma):** çift taraflı muhasebe / yevmiye / hesap planı yok
(ertelendi); tevkifat (stopaj), dönem kapanışı/kilidi, e-Fatura/e-Arşiv entegrasyonu, fatura iptali ve
silme, ödeme geri alma, harcama onay akışı, kalemler arası aktarım akışı yok. Bunlar §8'de ayrıca anılıyor.

**Kullanım bağlamı:** masaüstü öncelikli (yoğun tablolar, çok sütunlu bütçe); telefon gider girişi ve hızlı
durum kontrolü için (mobil alt çubukta "Finans" dört günlük kısayoldan biri, PWA kısayolu "Masraf Ekle").

---

## 2. Alınmış kararlar — yeniden açılmaz

Tasarım bunlara uymalı; alternatif önermek yerine bunların içinde çözüm üretmeli.

| # | Karar | Tasarıma etkisi |
|---|---|---|
| K1 | **Finans tek girişlidir:** menüde "Finans & Bütçe → Finans Merkezi" tek öğe. Kasa & Banka, Kurlar, Proje Bütçesi raporu menüden kaldırıldı; sayfalar adresle/bağlantıyla açılıyor. | Yeni menü öğesi önerme. Kasa, kurlar vb. Finans Merkezi'nin **içinden** erişilir. |
| K2 | **Proje bağlamlı:** Finans Merkezi'nin tepesinde proje seçici var ("Tüm projeler" = portföy). Bağlam şablonu proje kategorisinden türer: **Kurumsal / Hibe / Etkinlik**. Şablona göre sekme seti değişir. | Bağlam çubuğu + şablona göre değişen sekme şeridi korunur. |
| K3 | **Cari Yönetimi (müşteri/tedarikçi kartları, cari ekstre) ve Mizan kullanılmıyor**, arayüzden gizli. Faturadaki "Müşteri" seçicisi de gizli ("müşteri diye bir şey yok"). | Bu ekranları **tasarlama**, fatura formuna müşteri alanı **koyma**. |
| K4 | **Giderde kasa zorunlu değil.** Kasasız gider = kasa hareketi oluşmaz. | Gider formunda kasa alanı isteğe bağlı görünmeli. |
| K5 | **Ana renk `#123B63`** (APYA lacivert) tüm arayüzde; mevcut indigo (`#4F46E5`) / mavi / AI moru **kalkacak**. Durum renkleri (yeşil/sarı/kırmızı) kalır. Koyu temada ana renk **beyaz** (düğme beyaz zemin + lacivert yazı; bağlantı altı çizili). | Kod hâlâ indigo kullanıyor (palet geçişi yapılmadı) — **tasarım yeni paletle** yapılmalı. |
| K6 | **Yazı tipi Figtree** (400/500/600/700) her yerde; sayılar `tabular-nums`. Figtree'de ₺ glifi yok → ₺ için Inter yedeği. Veri/kod için JetBrains Mono. | Para tutarları tabular rakamla, sağa hizalı. |
| K7 | **Marka işareti** (13 ışın + pusula) tüm yükleniyor durumlarında spinner olarak kullanılır. Degrade, gölgeli logo, ikinci marka rengi yok. | Yükleniyor durumlarında işaret animasyonu. |
| K8 | **AI ikonu yalnız gerçek yapay zekâ özelliğinde.** Finans hesapları kural tabanlıdır → **nötr ikon**, AI/ışıltı ikonu kullanma. | Finans ekranlarında "akıllı öneri" görseli yok. |
| K9 | Animasyon ≤ 200 ms, ease-out; `prefers-reduced-motion` desteklenir. | — |
| K10 | Renk **asla tek başına** anlam taşımaz (ikon/desen/metin ile birlikte; ▲/▼). | Aşım, kesinti, gecikme hem renk hem simge/metinle. |

---

## 3. Tasarım dili

Kaynak: `wwwroot/dynamic-assets/src/styles/tokens.css` (tek kaynak), `apya-theme-bridge.css`, `apya-shell.css`.
Tüm değerler `--apya-*` token'larıdır; açık + koyu tema aynı token adlarıyla çalışır.

### 3.1 Renk

**Marka / birincil (K5 — hedef palet)**

| Rol | Açık tema | Koyu tema |
|---|---|---|
| Marka / birincil eylem | `#123B63` | `#FFFFFF` (düğme beyaz zemin + `#123B63` yazı) |
| Birincil hover | `#0B2542` | — |
| Koyu zemin (marka kılavuzu) | `#101827` | — |
| Marka kılavuzu nötrleri | başlık `#1B1A17` · gövde `#55524A` · ikincil `#8C887C` · kenarlık `#E4E1D8` · yumuşak kenarlık `#EDEBE4` · açık zemin `#F5F4F0` | — |

> Not: Marka kılavuzunun sıcak nötrleri (`#F5F4F0` …) ile uygulamanın bugünkü soğuk gri skalası
> (aşağıda) aynı değil. Uygulama içinde hangisinin kullanılacağı **§15 S1**'de açık soru.

**Bugünkü uygulama token'ları (açık / koyu)**

| Token | Açık | Koyu | Kullanım |
|---|---|---|---|
| accent-500 (bugün birincil, K5 ile `#123B63` olacak) | `#4F46E5` | `#6366F1` | düğme, aktif sekme alt çizgisi, odak halkası |
| brand-500/600 | `#2563EB` / `#1D4ED8` | `#60A5FA` / `#3B82F6` | bağlantı, finansal vurgu |
| positive-500 / -700 | `#059669` / `#065F46` | `#10B981` / `#34D399` | gelir, tahsil edildi, kâr |
| negative-500 / -700 | `#DC2626` / `#991B1B` | `#F87171` / `#FCA5A5` | gider, aşım, kesinti, hata |
| warning-500 / -700 | `#D97706` / `#92400E` | `#FBBF24` / `#FCD34D` | yaklaşan, kısmi, dikkat |
| critical-500 | `#B91C1C` | `#F87171` | kullanıcı müdahalesi gereken hata |
| surface app-bg | `#F5F5F5` | `#0A0A0B` | sayfa zemini |
| surface base | `#FFFFFF` | `#0F0F11` | kart/ana içerik |
| surface raised | `#F9FAFB` | `#141416` | tablo başlığı, hover |
| surface sunken | `#F3F4F6` | `#070708` | input, ilerleme çubuğu zemini |
| surface overlay | `rgba(17,24,39,.45)` | `rgba(0,0,0,.65)` | modal arka planı |
| text primary / secondary / tertiary | `#111827` / `#4B5563` / `#9CA3AF` | `#F4F4F5` / `#A1A1AA` / `#71717A` | — |
| border subtle / default / strong | `#F3F4F6` / `#E5E7EB` / `#D1D5DB` | beyaz %4 / %7 / %12 | — |

Koyu tema "Linear/Notion" tarzı saf koyu gri (mavi tonsuz); semantik renkler koyu temada daha parlak.

**Durum çipi formülü:** zemin = ton rengi %14 karışım (`color-mix`), metin = tonun -700'ü.
Tonlar: `positive`, `negative`, `warning`, `brand`, `accent`, `neutral`.

### 3.2 Tipografi

| Ölçek (yoğun arayüz) | px | Kullanım |
|---|---|---|
| fs-xs | 11 | overline (BÜYÜK HARF, 700, harf aralığı .5px, tertiary), çip |
| tablo başlığı | 10.5 | BÜYÜK HARF, 700, .4px, tertiary |
| fs-sm | 12.5 | tablo hücresi |
| fs-base | 13 | gövde, sekme etiketi (500; aktif 700) |
| fs-md | 14 | form, düğme |
| fs-lg | 16 | kart başlığı |
| fs-xl | 20 | finans KPI değeri (700, harf aralığı −0.02em) |
| fs-2xl / 3xl | 26 / 28 | sayfa düzeyi büyük sayı |

Ağırlıklar 400/500/600/700. Sayılar `tabular-nums`, tutar sütunları sağa hizalı.

### 3.3 Ölçü, köşe, gölge, yoğunluk

- **Boşluk:** 4 px tabanlı (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- **Köşe:** xs 2 · sm 4 · md 6 · **lg 8 (düğme/input)** · **xl 12 (kart)** · card 14 (pano kartı) · 2xl 16 · tam (çip/pill).
- **Gölge:** sm `0 1px 2px rgba(17,24,39,.05)` (kart varsayılanı) · md (kart hover) · lg (modal) · xl (popover).
  Marka kılavuzu "hiçbir yerde gölge yok" der — işaret/logo için; arayüz kartlarında ince gölge var.
- **Kontrol yüksekliği:** sm 32 · md 36 · lg 44.
- **Tablo satırı (yoğunluk):** compact 36 · **cozy 44 (varsayılan)** · comfortable 56. Kullanıcı Görünüm
  ayarından değiştirir.
- **Çip:** yükseklik 28 (telefonda 30), yatay dolgu 10, yazı 11.5.

### 3.4 Bileşen sözlüğü (mevcut — yeniden kullanılmalı)

| Bileşen | Sınıf | Görünüm |
|---|---|---|
| Konsol şeridi (bağlam çubuğu) | `.apya-console-rail` | min 60 px yükseklik, beyaz kart, 1 px kenarlık, köşe 12, sm gölge; sığmazsa ikinci satıra sarar. Sayfanın ilk öğesiyse üst bara ve iki yana yapışır (üst köşeler düz). |
| Konsol sekmeleri | `.apya-console-tabs` / `.apya-console-tab` | 46 px şerit, alt kenarlık subtle; sekme 13 px/500 secondary, aktif 700 primary + 3 px alt çizgi (birincil renk); sığmazsa yatay kayar. |
| Bağlama özel sekme noktası | `.apya-finance-tab-dot` | 5 px yuvarlak nokta, birincil renk, sekme etiketinin sağında. |
| Çip / rozet | `.apya-chip .apya-chip-{ton}` | pill, 11 px/600, dolgu 2×10. |
| Overline | `.apya-overline` | 11 px/700 BÜYÜK HARF tertiary. |
| KPI kartı | `_KpiCard` (`.card` + `.kpi-icon-box` + overline + değer) | Finans şeridinde **ikonsuz**, dolgu 15×16, değer 20 px; 3×2 ızgara (6 kart tek satıra sığmıyor — Türkçe etiketler kırpılıyordu). Tıklanabilir sürümde sağda chevron. |
| Temiz tablo | `.apya-clean-table` | zebra yok; ince alt çizgi; hover raised. |
| Fonlama akışı çubuğu | `.apya-funding-flow` | 14 px yükseklik, pill; segmentler: tahsil edilen (yeşil düz), bekleyen (gri **taramalı**), kesinti (kırmızı). |
| Kesinti alt satırı | `.apya-deduction-row` | ait olduğu dilimin altında, kesikli üst çizgi, %5 kırmızı zemin, 12.5 px. |
| Kalem ↔ görev matrisi satırı | `.apya-matrix-line` / `.apya-matrix-task` | kalem satırı %9 metin rengi karışımı bant; görev satırı 44 px girintili. |
| Seçenek kartı | `.apya-revmode` | seçili: birincil renk kenarlık + 1 px halka. |
| Boş durum | `_EmptyState` (`.apya-console-state`) | ikon balonu + başlık + açıklama + isteğe bağlı eylem; Hata varyantı (uyarı üçgeni + "Tekrar dene"), Kilit varyantı. |
| Form bölümü | `.apya-form-section` | modal içinde ilişkili alanları gruplayan kutu. |
| İpucu | `<apya-hint>` | etiketin yanında küçük (i) ikonu, üzerine gelince açıklama. |

İkon seti: **Font Awesome 6** (finansta kullanılanlar: `fa-chart-pie`, `fa-list-ul`, `fa-scissors`,
`fa-right-left`, `fa-file-invoice-dollar`, `fa-file-export`, `fa-cash-register`,
`fa-arrow-right-arrow-left`, `fa-folder-open`, `fa-layer-group`, `fa-sliders`, `fa-rocket`, `fa-coins`).

### 3.5 Para ve tarih biçimi

- Para: Türkçe biçim, binlik nokta + ondalık virgül. **Bugün tutarlı değil** (tasarım tek kural koymalı):
  - Tablolar: `2.400.000,00 ₺` (iki ondalık, sembol sonda); döviz: `12.500,00 EUR`.
  - KPI kartları (Donör sekmesi): `₺2.400.000` (ondalıksız, sembol önde); döviz: `12.500 EUR`.
  - Bütçe kalemleri tablosu: `2.400.000,00` (sembolsüz; para birimi başlıkta/bağlamda).
  - Boş değer: `—`.
- Kur: en az 2, en çok 6 ondalık, gereksiz sıfır basılmaz (`34,50` · `34,215678`).
- Döviz kodu gerektiğinde çip olarak (`EUR`, `USD`). Negatif tutar: eksi işareti + negatif renk + ▼ (K10).
- Tarih: `GG.AA.YYYY`.

---

## 4. Uygulama kabuğu (değişmez çerçeve)

Finans ekranları bu kabuğun içerik alanına oturur; kabuk yeniden tasarlanmaz ama maketlerde
**gerçekçi bağlam için çizilmelidir**.

- **Sol kenar çubuğu:** açık 280 px · ray modu 72 px (yalnız ikon). 768–1199 px'te fareyle otomatik ray.
  Üstte APYA işareti + "APYA" yazısı (Figtree 600, harf aralığı .12em).
- **Üst bar:** 57 px; sayfa başlığı/gezinme bağlamı, arama ("Ara veya komut çalıştır", ⌘K), "+ Yeni",
  bildirim zili, avatar menüsü (profil, görünüm: tema + yoğunluk).
- **İçerik dolgusu:** 28 px (≥768 px). Bağlam çubuğu sayfanın ilk öğesiyse bu dolguyu aşıp üst bara yapışır.
- **Menü ağacı (kiracı kullanıcısı, sırayla):**
  1. Hızlı İşlemler (`fa-bolt`) · Genel Bakış (`fa-chart-line`)
  2. İş Yönetimi (`fa-briefcase`) → Projeler, Panolar
  3. Takvim (`fa-calendar-days`)
  4. Hibe Yönetimi (`fa-award`) → Bugün, Çağrılar, Talepler, Başvurular, Raporlar, Başvurularım
  5. **Finans & Bütçe** (`fa-coins`) → **Finans Merkezi** (`fa-chart-pie`)
  6. İçerik (`fa-folder-open`) → Belgeler, Şablonlar & Formlar
  7. Yönetim / Ayarlar
- **Mobil (<768 px):** kenar çubuğu yerine alt çubuk; "GÜNLÜK" dört kısayol: **Hızlı · İşler · Finans · Hibe**
  + "Daha" (diğer menü). Üstte kompakt başlık + arama.
- **Tema:** açık / koyu (kullanıcı seçer); yoğunluk: compact / cozy / comfortable.

---

## 5. Bilgi mimarisi

### 5.1 Ekran haritası (bugün)

```
Kenar çubuğu: Finans & Bütçe
└── Finans Merkezi  /Finance                      ← TEK menü girişi (K1)
    ├── Bağlam çubuğu: [Proje ▾ Tüm projeler | proje] [şablon çipi] [kod] [PB]  … [Bu projeyi yapılandır] [Proje konsolu]
    └── Sekmeler (şablona göre, §6.0)
        ├── Genel ─────────────── KPI şeridi / Portföy · Fonlama akışı · Son İşlemler · Kasa & Banka
        ├── Bütçe kalemleri ───── kalem ağacı · matris (kalem↔görev) · 6 pencere
        ├── Dilimler & kesintiler  dilim tablosu + kesinti alt satırları · 4 pencere
        ├── Gelir-Gider ───────── birleşik tablo → Gelir/Gider pencereleri
        ├── Faturalar ─────────── /Invoices'ın ana-detay arayüzü, projeye süzülü
        ├── Donör & raporlama ─── (yalnız Hibe) donör KPI · uygunluk · rapor paketleri
        ├── Kur köprüsü ───────── (yalnız Hibe) üç defter · kur politikası · mutabakat
        ├── Kasa ──────────────── toplam bakiye · hesaplar · hızlı transfer
        └── Belgeler ──────────── belge açığı · uygunluk · teslim paketleri → /Documents/*

Menüde OLMAYAN, adresle/bağlantıyla açılan sayfalar (§7)
├── /Invoices           Faturalar (tam sürüm: Yeni fatura + Excel'den içe aktar)
├── /Expenses           Giderler        └── /Expenses/Capture  Masraf Yakala (mobil)
├── /Incomes            Gelirler
├── /CashAccounts       Kasa & Banka (hesap kartları + hareketler)
├── /ExchangeRates      Kurlar
├── /FxRevaluations     Yıl Sonu Kur Değerleme   ← uygulama içinde HİÇ bağlantı yok
└── /Reports/ProjectBudget  Proje Bütçe / K/Z Raporu ← ekrana bağlantı yok, ⋯ menüsü dosya indirir

Gizli / kapsam dışı (K3): /Customers (Cari) · /Reports/TrialBalance (Mizan) · /Reports/CustomerStatement (Cari ekstre)
```

### 5.2 Finans ekranlarına diğer giriş noktaları

| Nereden | Ne açılır |
|---|---|
| Hızlı İşlemler (`/Makro`) | Masraf Yakala sayfası; Gider, Gelir, Fatura, Kasa Hareketi pencereleri |
| Görev detayı → Finans sekmesi | Gider, Gelir, Fatura pencereleri (görev ve bütçe bağı önden dolu) |
| Proje detayı / konsolu | "Harcama ekle" → gider penceresi; ⋯ menüsü "Bütçe raporu (Excel/PDF)"; Finans Merkezi'nin o proje bağlamı |
| PWA kısayolu "Masraf Ekle" | `/Expenses/Capture` |
| İçe/Dışa Aktarma Çalışma Alanı (`/DataTransfer`) | Bütün içe aktarma pencereleri; sistem yöneticisi için "tüm parametreler" aktarımları |
| Bildirim (geciken fatura) | `/Invoices?invoiceId=…` |
| Mobil alt çubuk "Finans" | `/Finance` |

### 5.3 Gezinme davranışı

- Finans Merkezi'nde **durum adreste taşınır** (`?projectId=&tab=&period=&kind=&lineId=&accountId=…`);
  sekme değişimi ve süzgeçler tam sayfa yeniden yükleme yapar. Paylaşılabilir/yer imi alınabilir adres
  bilinçli bir özelliktir.
- Pencereler (modal) AJAX ile açılır; kayıt başarılıysa **bildirim çıkmaz, sayfa tamamen yenilenir**.
- Bağımsız sayfalar (`/Expenses`, `/Incomes`, `/ExchangeRates`…) kayıttan sonra yalnız tabloyu yeniler
  ve "… kaydedildi" bildirimi gösterir. İki davranış tutarsız (§13).

### 5.4 Yeniden tasarımda bilgi mimarisinin çözmesi gerekenler

Kararlar (K1–K3) sabit kalır: yeni menü öğesi açılmaz. Ama bugünkü yapının sorunları şunlar
(ayrıntı §6.5 ve §7 sonundaki listelerde):

1. **Ulaşılamayan ekranlar:** Kasa & Banka'nın tam sürümüne, Kurlar'a, Yıl Sonu Değerleme'ye ve Proje Bütçe
   raporunun ekranına Finans Merkezi'nden düzenli bir yol yok. Tasarım, bunların Finans Merkezi içinde
   **nerede durduğunu** göstermeli (sekme içi bağlantı, "Araçlar" menüsü, sekmenin tam görünümü vb.).
2. **Aynı kaydın iki arayüzü:** Gelir/gider hem Finans Merkezi Gelir-Gider sekmesinde (zengin: kalem, kasa,
   ₺ defter, donör, belge) hem `/Expenses`–`/Incomes`'ta (yoksul DataTables) görünüyor. Faturalar ise
   iki yerde aynı ana-detay arayüzüyle. Tasarım **tek bir kayıt listesi deseni** önermeli.
3. **Bağlam kaybı:** Gelir-Gider satır başlığı kaydın kendisine değil projesiz listeye gidiyor;
   "Faturalar sayfasında aç" proje süzgecini düşürüyor; Kasa sekmesi proje seçiliyken de bütün hesapları
   gösteriyor ve bunu söylemiyor.
4. **Proje seçici:** 1000 projeye kadar aramasız düz liste.

---

## 6. Finans Merkezi (`/Finance`) — ekran ekran


### 6.0 Sayfa çerçevesi (bütün sekmelerde ortak)

**Adlar**
- Menüde "Finans Merkezi" (`Menu:FinanceHub`).
- Sayfa başlığı "Finans".
- Başlığın altındaki satır "Bütçe, gelir-gider ve kasa — tek çatı". Bu metin cshtml'e gömülü (`data-page-description`), JS ile üst başlık çubuğuna taşınıyor.

**Sayfa kapısı (403)**
- Şu izinlerden en az biri yoksa erişim reddi sayfası açılır: `Projects.ViewBudget`, `Incomes.Default`, `Expenses.Default`, `Invoices.Default`, `CashAccounts.Default`.
- `Documents.Default` tek başına sayfayı açmaya yetmez.

**Durum adreste taşınır (sunucu render)**
- Parametreler: `projectId`, `tab`, `breakdown` (kalem-gorev | gorev-kalem), `kind` (gelir | gider), `lineId`, `accountId`, `period` (bu-ay | gecen-ay | bu-ceyrek | bu-yil | proje | ozel), `from`, `to`, `invoiceId`; satır çapası `#fin-ledger-{id}`.
- Her sekme verisini yalnız aktifken yükler.
- Geçersiz ya da izinsiz sekme setin ilk sekmesine düşer.
- Kullanıcının listesinde olmayan `projectId` sessizce "Tüm projeler"e düşer.

**Etkileşim modeli**
- Modallar ABP ModalManager ile AJAX yüklenir. Kayıt başarılı olunca bildirim çıkmaz, sayfa tamamen yenilenir.
- Tek tıklık işlemler (sil, itiraz, finanse edilmeyen, geri al, yeniden hesapla) form POST'udur ve aynı proje + sekmeye yönlendirir.
- Onay soruları ortak `data-confirm` penceresinden gelir; `data-confirm-danger` tehlike stilidir.

#### Bağlam çubuğu (`.apya-console-rail.apya-finance-context`)
Soldan sağa:

| Öğe | Ayrıntı |
|---|---|
| Etiket "Proje" | overline |
| Proje seçici | Küçük select, en az 200 / en çok 320 px. İlk seçenek "Tüm projeler", sonra en çok 1000 proje ada göre. Değişince form gönderilir (tam sayfa) ve aktif sekme korunur. Yeni şablonda o sekme yoksa ilk sekmeye düşer. JS yoksa "Getir" düğmesi çıkar. Arama yok. |
| Ayırıcı | `.apya-console-sep` |
| Proje seçiliyken çipler | Accent çip `fa-layer-group` + şablon adı ("Kurumsal proje" / "Hibe projesi" / "Dernek etkinliği"); nötr çip proje kodu (sayısal yazı, kod boşsa yok); nötr çip para birimi kodu (TRY, EUR…) |
| Portföyde çip | Nötr çip `fa-layer-group` "Portföy" |
| Sağa yaslı düğmeler (yalnız proje seçiliyken) | "Bu projeyi yapılandır" (`fa-sliders`, outline, `Projects.Edit` gerekir) → `/Projects/Edit/{id}`. "Proje konsolu" (`fa-rocket`, outline, izin koşulu yok) → `/Projects/ProjectDetails/{id}` |

Şablon ayrı bir ayar değildir, proje kategorisinden türer:
- "Hibe Projesi" kategorisi → Hibe.
- "Etkinlik" kategorisi → Etkinlik.
- Diğer kategoriler ve kiracının eklediği kategoriler → Kurumsal.

Portföy kipi Kurumsal setini kullanır.

#### Sekme şeridi (`.apya-console-tabs` > `a.apya-console-tab`)
`<nav>` + bağlantılardan oluşur; her tık tam sayfa gezinmedir. Yükseklik bilinçli olarak 46 px (tasarımda 38 px).

| Sekme (etiket) | kod | ikon | Kurumsal | Hibe | Etkinlik | Gereken izin (biri yeter) | Mor nokta |
|---|---|---|---|---|---|---|---|
| Genel | genel | fa-chart-pie | ✓ | ✓ | ✓ | — | — |
| Bütçe kalemleri | kalemler | fa-list-ul | ✓ | ✓ | ✓ | Projects.ViewBudget | — |
| Dilimler & kesintiler | dilimler | fa-scissors | ✓ | ✓ | ✗ | Projects.ViewBudget | **var** |
| Gelir-Gider | gelir-gider | fa-right-left | ✓ | ✓ | ✓ | Incomes.Default / Expenses.Default | — |
| Faturalar | faturalar | fa-file-invoice-dollar | ✓ | ✓ | ✓ | Invoices.Default | — |
| Donör & raporlama | donor | fa-file-export | ✗ | ✓ | ✗ | Projects.ViewBudget | **var** |
| Kur köprüsü | kur-koprusu | fa-arrow-right-arrow-left | ✗ | ✓ | ✗ | Projects.ViewBudget | **var** |
| Kasa | kasa | fa-cash-register | ✓ | ✓ | ✓ | CashAccounts.Default | — |
| Belgeler | belgeler | fa-folder-open | ✓ | ✓ | ✓ | Documents.Default | — |

- Hibe sırası: Genel, Bütçe kalemleri, Dilimler & kesintiler, Gelir-Gider, Faturalar, Donör & raporlama, Kur köprüsü, Kasa, Belgeler.
- Mor nokta: 5 px yuvarlak, `--apya-accent-500`. İpucu metni "Bu sekme projenin bağlam şablonuna özeldir".
- Nokta elle verilmiyor, hesaplanıyor: sekme üç şablonun hepsinde yoksa nokta alır. Bu yüzden "Dilimler & kesintiler" Kurumsal'da da noktalı.

#### Host kapsamı
**Ne zaman:** Platform yönetim hesabıyla ("Hesabına Gir" kullanılmadan) bir kiracının projesi seçilmişse.

**Durum kartı (kilit varyantı, `data-apya-state="host-scope"`):** "Kiracı kayıtları platform yönetim hesabından görünmez; kiracının hesabından (Hesabına Gir) bakın."

**Nerede basılır:**
- Genel sekmesinde "Son İşlemler" ve "Kasa & Banka" kutularının yerine.
- Gelir-Gider, Faturalar, Kasa ve Belgeler sekmelerinin tamamında.

**Etkilenmeyenler:** Bütçe kalemleri, Dilimler, Kur köprüsü ve Genel'deki KPI şeridi normal veri gösterir. Donör sekmesinde iki "denetlenemedi" satırı çıkar ve paketler kilitli görünür.

#### Ortak bileşenler ve biçimler
- **Durum kartı** (`_EmptyState`, `.apya-console-state`): ikon balonu, kalın başlık, açıklama, isteğe bağlı eylem düğmesi. Kilit varyantında kilit ikonu var.
- **KPI kartı** (`_KpiCard`): overline etiket (+ ⓘ ipucu), büyük değer (h3), küçük gri alt metin.
  - Finans şeritlerinde (`.apya-finance-kpis`) ikon kutusu CSS ile gizli, dolgu 15/16 px, değer 20 px.
  - KPI'ların "Accent" rengi YALNIZ bu gizli ikon kutusuna uygulanıyor (sorunlar bölümüne bakın).
- **Para biçimleri (tr-TR):**
  - KPI: TRY ise önek ve kuruşsuz "₺2.400.000"; diğer para birimlerinde "2.400.000 EUR".
  - Genel, portföy, donör ve kur köprüsü tabloları: "1.234,56 ₺" / "1.234,56 EUR".
  - Kalem, dilim ve matris tabloları: yalnız sayı, "1.234,56" (birim yok). Altlarındaki notlarda "₺1.234,56" ya da "EUR1.234,56" önekli.
  - Gelir-Gider: işaretli "+1.234,56 ₺" / "−1.234,56 EUR" (U+2212).
  - Belgeler: her zaman "… ₺".
  - Kur: "#,##0.00####" (6 haneye kadar, sondaki sıfırlar yazılmaz).
- **Tarih:** çoğunlukla `dd.MM.yyyy`. Son İşlemler'de `dd MMM yyyy` (ör. 05 Kas 2026).
- **Kullanım çubuğu** (`.apya-mini-progress`): ≥%100 kırmızı, ≥%80 amber, altı yeşil. "%NN" etiketi üstte (`.apya-tile-progress-label`), genişlik %100'de kesilir.

---

### 6.1 Sekmeler

#### Genel (`genel`)
**Amaç:** Bütçe ve nakit özeti, son işlemler ve hesap bakiyeleri.

**Tek proje ile portföy farkı**
- Proje seçili ve `ViewBudget` var: 6 KPI'lık şerit ve (dilim varsa) "Fonlama akışı" kartı.
- Tüm projeler ve `ViewBudget` var: Portföy paneli.
- İki kipte de `ViewBudget` yoksa yalnız nötr kilit çipi: "🔒 Bütçe özetini görme yetkiniz yok."
- Altta her durumda iki sütun (lg 7/12 ve 5/12): "Son İşlemler" ve "Kasa & Banka".
- Şablona göre değişen bir şey yok. Dilim tanımlı olup olmaması KPI etiketini ve fonlama kartını değiştirir.

**Yerleşim (proje seçili):** 1) KPI şeridi, 3 sütun × 2 satır (col-6 / md-4). 2) Fonlama akışı kartı. 3) Son İşlemler | Kasa & Banka.

**KPI kartları** (ortak `_ProjectBudgetKpis` parçası; Proje Detay'daki "Bütçe Durumu" penceresi de aynısını basar):

| Etiket | Değer ve hesap | Alt metin | ⓘ ipucu (aynen) | Ton |
|---|---|---|---|---|
| Sözleşme bütçesi | Kalemlerin sözleşme tutarları toplamı; kalem yoksa projenin toplam bütçesi | "N kalem" / "kalem tanımlı değil" | "Kalemlerin sözleşmedeki ilk tutarlarının toplamı. Revizyon bu tutarı değiştirmez." / "Bu projede bütçe kalemi tanımlı değil; proje bütçesi tek tutar olarak gösteriliyor." | neutral |
| Onaylanan bütçe | Kalemlerin yürürlükteki tutar toplamı | "Rev.N" / "revizyon yok" | "Yürürlükteki bütçe. Bütçe revizyonu yalnız bu tutarı değiştirir." | accent |
| Gelen (tahsil) (dilim varsa) / Gelir (dilim yoksa) | Dilim varsa tahsilat toplamı, yoksa projeye bağlı gelir kayıtları; ikisi toplanmaz | "x/y dilim · %F bütçe" (F = gelen / onaylanan) / "gelir kayıtları" | "Fonlama dilimlerinden tahsil edilen toplam." / "Bu projede dilim tanımlı değil; projeye bağlı gelir kayıtlarının toplamı gösteriliyor." | positive |
| Harcanan | Projenin tüm giderleri, kaleme yazılmamışlar dahil | "%U bütçe" | "Bu projeye bağlı TÜM gider kayıtları — kaleme yazılmamış olanlar dahil." | negative |
| Kullanılabilir nakit | Gelen − harcanan | "gelen − harcanan" | "Bütçe değil NAKİT sorusunun cevabı: eline geçen paradan ne kadarı duruyor." | <0 ise negative, değilse brand |
| Kalan bütçe | Onaylanan − harcanan | <0 ise "bütçe aşıldı", değilse "onaylanan − harcanan" | "Onaylanan bütçe eksi toplam gider. Gelir bu hesaba girmez." | <0 ise negative, değilse neutral |

**Fonlama akışı kartı** (dilim sayısı > 0 ise)
- Başlık "Fonlama akışı", yanında gri "gelen · bekleyen · kesinti ayrı ayrı".
- Sağda bağlantı "Dilimler & kesintiler →".
- 14 px yatay çubuk: yeşil (gelen), taralı gri (bekleyen), kırmızı (kesinti). Ölçek = max(planlanan fon, gelen + kesinti).
- Lejant (11.5 px, renkli noktalar): "Gelen X · Bekleyen dilim Y · Kesinti Z".

**"Son İşlemler" kartı**
- Başlık; alt satırda proje adı ya da "Tüm hesaplar".
- En yeni 12 kayıt. Kaynaklar: gelir, gider, fatura (satış = giriş, alış = çıkış); portföyde ayrıca hesaplar arası transfer.
- Sayfalama ya da "tümünü gör" yok.
- Satır yapısı:
  - Ikon kutusu: giriş yeşil ↓, çıkış kırmızı ↑, transfer accent ⇄.
  - Başlık: kaydın başlığı; faturada fatura no (yoksa proje adı); transferde açıklama ya da "Hesaplar arası transfer".
  - Alt satır: "cari ya da proje ya da — · tarih".
  - Sağda kategori çipi ve tutar: "▲ +1.234,56 ₺" yeşil / "▼ −…" kırmızı.
- Kategori çipleri:
  - Gider: Ofis / Seyahat / Personel / Malzeme / Hizmet / Vergi / Diğer.
  - Gelir: Hibe / Bağış / Nakit Satış / Finansal / Diğer.
  - Fatura: "Satış geliri" / "Alış gideri".
  - "Transfer".
- Satırın tamamı bağlantı:
  - Proje seçiliyse gelir/gider kaydı Gelir-Gider sekmesinde o satıra gider (satır vurgulanır); fatura Faturalar sekmesinde o fatura seçili açılır.
  - Sekme kapalıysa ya da portföydeyse `/Incomes`, `/Expenses`, `/Invoices?invoiceId=…`; transfer `/CashAccounts`.
- Durumlar:
  - Host kapsamı: host kartı.
  - Tüm kaynaklar okunamıyorsa kilit kartı: "Son işlemleri görme yetkiniz yok." / "\"Gelirler\", \"Giderler\" ya da \"Faturalar\" yetkilerinden biri gerekir."
  - Boş: "Henüz işlem yok." Kaynakların bir kısmı okunamıyorsa "Görebildiğiniz kayıtlarda işlem yok."

**"Kasa & Banka" kartı** (`_AccountsList`; Kasa sekmesindekiyle aynı parça)
- Aktif hesaplar, bakiyeye göre azalan sırada.
- Satır: ikon kutusu (Banka `fa-building-columns`, Kredi kartı `fa-credit-card`, Nakit `fa-wallet`) · ad ve para birimi çipi · altında IBAN ya da "Banka hesabı" / "Kredi kartı" / "Nakit kasa" · sağda kalın bakiye "N2 + PB".
- Satır tıklanmaz.
- Proje seçili olsa da TÜM hesaplar listelenir.
- Durumlar:
  - Host kapsamı: host kartı.
  - Kilit: "Kasa/banka hesaplarını ve bakiyelerini görme yetkiniz yok." / "\"Kasalar\" ve \"Kasa Hareketleri\" yetkilerinin ikisi de gerekir."
  - Boş: "Henüz kasa/banka hesabı yok. Kasa & Banka'dan ekleyin." ("Kasa & Banka" bağlantısı `/CashAccounts`'a gider.)

**Portföy paneli** (Tüm projeler seçiliyken KPI şeridinin yerine)
- **Boş:** durum kartı "Bütçesi olan proje yok" / "Bir projeye bütçe tanımladığınızda ya da ilk gelir/gider kaydını girdiğinizde portföy burada oluşur."
- **Tek para birimi:** 4 KPI (md-3), ipucu yok:
  - "Onaylanan" (alt "N proje").
  - "Gelen" (alt "tahsilat + gelir").
  - "Harcanan" (alt "kullanılabilir ₺X").
  - "Finanse edilmeyen": >0 ise warning ve alt "kesinti karşılanmadı", değilse "kesinti yok".
- **Karışık para birimi:** KPI yerine kart.
  - Amber çip "karışık PB" ve "Projeler farklı para birimlerinde; toplamlar para birimi başına verilir."
  - Tablo: PB (çip + "N proje") | Onaylanan (kalın) | Gelen | Harcanan | Finanse edilmeyen. Sayılar sağa yaslı. Çapraz kur toplamı yapılmaz.
- **"Projeler" kartı:**
  - Başlık "Projeler", alt "Riskli projeler üstte". Sağda (varsa) "N proje bütçesiz — listelenmedi".
  - Tablo en çok 460 px yükseklikte kendi içinde kayar, başlık satırı yapışkan.
  - Sütunlar:
    - Proje: bağlantı, o projenin Genel sekmesine gider.
    - Şablon (96 px): çip "Hibe" / "Etkinlik" / "Kurumsal".
    - Onaylanan (kalın), Gelen, Harcanan, Kullanılabilir (negatifse kırmızı). Tutarlar satırın kendi para biriminde.
    - Kullanım (130 px): yüzde ve çubuk.
    - Durum (150 px): tek çip, öncelik sırasıyla "Nakit riski" (kırmızı; kullanılabilir < 0) › "Bütçe aşımı" (kırmızı) › "Kesinti itirazı" (amber; itirazlı dilim var) › "Sağlıklı" (yeşil).
  - Sıralama sunucuda yapılır. İstemcide sıralama, süzgeç, arama ve sayfalama yok; toplam satırı yok.

---

#### Bütçe kalemleri (`kalemler`)
**Amaç:** Kalem ağacı (en çok 4 düzey), planlanan ile gerçekleşen, hibe/kurum payları ve kalem ↔ görev matrisi.

**Portföyde (ya da bütçe okunamazsa):** durum kartı "Bütçe görüntülenemiyor" / "Bir proje seçin ya da bütçe görme yetkinizi kontrol edin."

**Şablon farkı:** Yok. Hibe ve Kurum sütunları üç şablonda da var.

**Yerleşim:** 1) Başlık şeridi. 2) Kırılım anahtarı (kalem varsa). 3a) Liste kipi: süzgeç çubuğu → tablo → süzgeç boş notu → kalemsiz harcama notu. 3b) Matris kipi: matris tablosu → 3 not.

**Başlık şeridi:** "Bütçe kalemleri" ve çipler:
- "N kalem" (nötr).
- "Rev.N" (amber, revizyon varsa).
- "Hibe %X · Kurum %Y" (nötr; ipucu "Oran hibe programından geliyor" ya da "Projenin destek oranı"). Oran yoksa amber "Destek oranı girilmemiş".
- "KDV istisnası · {belge no} · {dd.MM.yyyy}'e kadar" (istisna varsa).

Sağdaki düğmeler:

| Etiket | İkon | Koşul | Açtığı |
|---|---|---|---|
| Excel'e aktar | fa-file-excel | kalem var (görme izni yeter) | İndirme: içe aktarma sütunlarıyla kalem listesi |
| Destek oranı | fa-percent | CanEditBudget | SupportRateModal |
| KDV istisnası | fa-receipt | CanEditBudget | VatExemptionModal |
| Bütçeyi revize et | fa-code-branch | CanEditBudget + kalem var | RevisionModal ("yeni tutar" kipi) |
| Bağlamı kur | fa-list-check | CanEditBudget | ContextWizardModal |
| Excel'den içe aktar | fa-file-import | CanEditBudget | BudgetLineImportModal |
| **Kalem ekle** (birincil) | fa-plus | CanEditBudget | BudgetLineModal (yeni) |

CanEditBudget = `Projects.ManageBudget` ya da `Projects.Edit`.

**Kırılım anahtarı:** overline "Kırılım" ve üç bağlantı-düğme: "Kalem listesi" | "Kalem → görev" | "Görev → kalem". Seçili olan birincil, diğerleri outline.

**Süzgeç çubuğu (tarayıcıda çalışır)**
- Arama (en çok 260 px), yer tutucu "Kod ya da ad ara…".
- Seçim (en çok 220 px): "Tüm kalemler / Bütçeyi aşanlar / Harcama yapılanlar / Harcama yapılmayanlar / Hibe payı elle girilenler".
- Sayaç "x / y kalem".
- Eşleşen kalemin üst kalemleri soluk (%50) görünür kalır.
- Hiç eşleşme yoksa: "Süzgece uyan kalem yok."

**Kalem tablosu**
- Başlıkların hepsi sıralama düğmesi (↕ / ↑ / ↓).
- Varsayılan sıra kodun sayı sırası (1, 2, 2.1, 10). Sıralama yalnız kardeşler arasında yapılır, ağaç bozulmaz; değeri olmayan en sona gider.

| Başlık | İçerik | Biçim |
|---|---|---|
| Kalem | Ad (kalın); gerekçe (küçük gri); kod (sayısal). Çipler: "kendi tutarı X" (üst kalemin kendi tutarı varsa; ipucu "Alt kalemler hariç bu kalemin kendi tutarı"), "N kayıt". Üst kalemde klasör ikonu ve koyu zemin (`tr.apya-budget-parent`). Derinlik başına 20 px girinti. | sol |
| Sözleşme | Alt ağaç toplamı | sağ, gri, N2 |
| Onaylanan | Alt ağaç toplamı | sağ, kalın |
| Hibe | Pay toplamı; hesaplanamazsa "—"; elle girildiyse "*" (ipucu "Hibe payı elle girildi (orandan hesaplanmadı)") | sağ |
| Kurum | Onaylanan − hibe, ya da "—" | sağ |
| Harcanan | Alt ağaç toplamı | sağ |
| Kalan | Onaylanan − harcanan; negatifse kırmızı | sağ, kalın |
| Gerçekleşme (140 px) | "%NN" ve çubuk | — |
| (eylemler, 120 px) | yalnız CanEditBudget | sağ |

**Satır eylemleri** (yalnız ikon, bağlantı stili):
- "Alt kalem ekle" (`fa-indent`) → BudgetLineModal, üst kalem önden seçili.
- "Düzenle" (`fa-pen`) → BudgetLineModal.
- "Sil" (`fa-trash`, kırmızı) → onay "Kalem silinsin mi?" (tehlike) → POST DeleteLine.
- Sil pasif (gri) iki durumda, ipucuyla:
  - Alt kalemi varsa: "Bu kalemin alt kalemleri var; önce onları silin ya da başka bir üst kaleme taşıyın."
  - Bağlı kayıt varsa: "Bu kaleme bağlı N kayıt var; önce onları başka kaleme taşıyın."

**Toplam satırı:** "TOPLAM" | Σ kendi sözleşme | proje onaylanan | hibe toplamı ya da "—" | kurum ya da "—" | Σ harcanan | Σ kalan. Süzgeçten etkilenmez. Sayfalama yok.

**Not** (kaleme yazılmamış harcama varsa): "ⓘ Bu projede **₺X** tutarında harcama **hiçbir kaleme yazılmamış** — kalem toplamları ile projenin toplam harcaması arasındaki fark budur."

**Kalem yoksa:** durum kartı "Bu projede bütçe kalemi yok" / "Kalem tanımlayana kadar bütçe tek tutar olarak yönetilir; harcamalar kaleme yazılamaz." Kırılım, süzgeç, "Excel'e aktar" ve "Bütçeyi revize et" gizlenir.

**Matris kipi** (`_PanelMatrix`)
- Sütunlar: "Kalem / görev" ("Görev → kalem"de "Görev") | Planlanan | Gerçekleşen | Kalan | Kullanım (130 px) | Uyarı (190 px).
- **Kalem → görev:**
  - Kalem satırı: kalın, zemin bandı (`tr.apya-matrix-line`). Planlanan = kalemin onaylanan tutarı. Uyarı çipi "kalem aşıldı" (kırmızı) ya da "X dağıtılmamış" (nötr; ipucu "Kalemin göreve ayrılmamış kısmı").
  - Altındaki görev satırları: 44 px girinti, `fa-list-check`. Planlanan = görevin bütçe bağı (yoksa "—"). Çubuk yalnız plan > 0 iken. Uyarı "görev planı aşıldı" (kırmızı) ya da "plansız harcama" (nötr).
  - Gri "Göreve bağlanmamış" satırı (`fa-circle-notch`): yalnız Gerçekleşen dolu.
- **Görev → kalem:** düz liste; görev başlığının altında kalem adı çipi. Sıra: planı aşanlar önce, sonra harcamaya göre azalan. Boşsa: "Hiçbir görev bir bütçe kalemine bağlanmamış."
- **Matris boşsa:** "Matris için bütçe kalemi gerekiyor" / "Önce kalem tanımlayın; görevleri kalemlere bağladıkça kırılım burada oluşur."
- **Notlar (12 px, ⓘ):**
  - "Bir kalemdeki görev planlarının toplamı kalem bütçesini geçemez; geçiren kayıt sunucuda reddedilir."
  - "**Göreve bağlanmamış** harcama meşrudur — bordro, kira ve idari giderler bir göreve yazılmaz."
  - (varsa) "₺X tutarındaki harcama hiçbir **kaleme** yazılmamış; matrisin dışında kalır."
- Matriste süzgeç, sıralama ve toplam satırı yok. Üst kalem/alt kalem hiyerarşisinin matriste nasıl göründüğü kodda belirsiz.

---

#### Dilimler & kesintiler (`dilimler`)
**Amaç:** Fonlama taksitleri, tahsilatlar, kesintiler ve kesinti kararları.

**Şablon:** Kurumsal ve Hibe'de var; Etkinlik'te sekme yok. Mor noktalı.

**Portföyde:** "Dilimler görüntülenemiyor" / "Bir proje seçin ya da bütçe görme yetkinizi kontrol edin."

**Yerleşim**
1. **Denklem kartı:** `[Sözleşme bütçesi X]  −  [Kesinti Y (kırmızı)]  =  [Onaylanan bütçe (Rev.N) Z]`, sağda `[Tahsil / Planlanan %P]`. P = gelen ÷ planlanan fon. Değerler 20 px kalın, önekli ("₺1.234,56").
2. **Başlık şeridi:** "Dilimler", çip "N dilim", (varsa) amber çip "N kesinti". Sağda "Dilim ekle" (birincil, `fa-plus`, CanEditBudget) → TrancheModal.
3. **Tablo** ya da boş durum: "Bu projede fonlama dilimi yok" / "Para tek seferde geliyorsa dilim tanımlamanız gerekmez; parçalı fonlamada her taksit bir dilimdir."
4. **Not** (finanse edilmeyen > 0): "⚠ **₺X** tutarındaki kesinti **finanse edilmeyen** olarak bırakıldı: bütçe aynı kaldı, karşılığı gelmeyecek."

**Tablo sütunları**

| Başlık | İçerik |
|---|---|
| Dilim (150 px) | "N. Dilim" (kalın), altında başlık (gri) |
| Planlanan tarih (120 px) | dd.MM.yyyy ya da "—", gri |
| Planlanan | sağ, N2 |
| Gelen | sağ, yeşil, kalın |
| Kesinti | sağ; >0 ise kırmızı, değilse gri |
| Durum (150 px) | Çip: "Bekliyor" (nötr) / "Kısmi tahsil" (amber) / "Tahsil edildi" (yeşil) / "İtiraz sürecinde" (kırmızı) |
| (eylemler, 200 px) | CanEditBudget |

**Satır eylemleri** (yalnız ikon):
- "Tahsilat gir" (`fa-hand-holding-dollar`) → CollectionModal.
- "Kesinti ekle" (`fa-scissors`) → DeductionModal.
- İtiraz tokmağı (`fa-gavel`), iki hal:
  - Dilim itirazdaysa kırmızı, "İtiraz işaretini kaldır" → POST, onaysız.
  - Tahsil edilmemişse gri, "İtiraz sürecinde olarak işaretle" → onay "Dilim itiraz sürecinde olarak işaretlensin mi?" → POST.
  - Tahsil edildiyse tokmak hiç çıkmaz.
- "Düzenle" (`fa-pen`) → TrancheModal.
- "Sil" (`fa-trash`, kırmızı) → onay "Dilim ve kesintileri silinsin mi?" (tehlike).

**Kesinti alt satırları** (her biri dilimin hemen altında, tüm genişlikte; kesikli üst çizgi ve %5 kırmızı zemin, 12.5 px):
- İçerik: makas ikonu · "−X" (kırmızı, kalın) · gerekçe · tarih · karar çipi.
- Karar çipleri: "Açık" (amber) / "Bütçeye işlendi · Rev.N" (yeşil) / "Finanse edilmeyen" (kırmızı).
- Sağdaki eylemler (CanEditBudget):
  - Karar açıksa: "Bütçeye işle" (outline) → RevisionModal kesinti kipi; "Finanse edilmeyen" (outline) → POST, onaysız.
  - Karar verilmişse: "Kararı geri al" (bağlantı) → POST, onaysız.
  - Her durumda çöp ikonu "Kesintiyi sil" → onay "Kesinti silinsin mi?".

**Toplam satırı:** "TOPLAM" | planlanan fon | gelen (yeşil) | kesinti (kırmızı) | "bekleyen X" (gri, 12 px, >0 ise). Süzgeç, sıralama ve sayfalama yok.

---

#### Gelir-Gider (`gelir-gider`)
**Amaç:** Gelir ve gider tek tabloda. Faturalar bilerek dahil değil.

**Portföyde:** Bütün projelerin kayıtları. Kalem süzgeci çıkmaz, donör sütunu çıkmaz, ekle düğmeleri modül sayfasına gider.

**Host:** host kartı.

**Şablon farkı:** Donör sütunu yalnız projenin donör para birimi tanımlıysa çıkar. Bu ayar Kur köprüsü sekmesinden yapılır; o sekme yalnız Hibe'de var.

**Süzgeç çubuğu** (`.apya-console-filters`; tek satır, her seçim tam sayfa yeniden yükleme)
- Etiket "Filtre".
- Çipler: "Tümü" · "Gelir" · "Gider". Okunamayan tür gizlenir; aktif çip dolu görünür.
- Açılır çip "Kalem: tümü | {kod · ad}" (yalnız proje seçili ve kalem varsa). Menüde "Tümü" ve kalemler.
- Açılır çip "Kasa: tümü | {Ad (PB)}".
- Açılır çip "Dönem: {ad}". Menü:
  - "tüm zamanlar", "Bu ay", "Geçen ay", "Bu çeyrek", "Bu yıl".
  - "Proje dönemi" (projenin tarihi varsa).
  - Ayırıcının altında "Özel aralık" formu: "Başlangıç" (tarih), "Bitiş" (tarih), "Uygula". Ters girilen tarihler yer değiştirir.
  - Proje dönemi ve özel aralık çipte "dd.MM.yyyy – dd.MM.yyyy" olarak yazar; açık uç "…".
- Herhangi bir süzgeç etkinse "Filtreleri temizle" bağlantısı (dönemi de temizler).
- Sağa yaslı eylemler:
  - "Excel" (`fa-file-excel`, satır varsa) → .xlsx indirir.
  - "Gelir ekle" (`fa-arrow-down-long`): proje seçili ve `Incomes.Create` varsa gelir penceresi proje önden seçili açılır (`Incomes/CreateModal`); yoksa `/Incomes` bağlantısı.
  - "Gider ekle" (`fa-arrow-up-long`): aynı mantık (`Expenses/CreateModal`).
  - Kaynağı okunamayan tarafın düğmesi gizlenir.

**Tablo**

| Başlık | İçerik | Biçim |
|---|---|---|
| Tarih (110 px) | dd.MM.yyyy | gri |
| Kayıt | Tür çipi "Gelir" (yeşil) / "Gider" (amber). Başlık bağlantısı → `/Incomes` ya da `/Expenses` LİSTE sayfası. Bağlı her belge için ataş ikonu (dosyayı indirir; ipucu belge adı). Gelir satırında `CanLinkIncomeDocuments` varsa "Belge bağla" (`fa-link`) → IncomeDocumentModal. Altında kategori (gri). | sol |
| Kalem (200 px) | "kod · ad" ya da "—" | küçük |
| Kasa (190 px) | "Ad (PB)" ya da "—" | küçük, gri |
| İşlem PB (150 px) | "+1.234,56 ₺" yeşil / "−… EUR" kırmızı | sağ |
| ₺ defter (140 px) | "1.234,56 ₺" ya da "kur yok" (ipucu "Bu tarih için kur girilmemiş; kayıt ₺ defterine yansımadı") | sağ, gri |
| {PB} donör (150 px, koşullu) | "1.234,56 EUR" ve kilit ikonu (ipucu "Donör karşılığı kilitli") ya da "kur yok" (ipucu "Bu tarih için kur girilmemiş") | sağ |

- Sıra sabit: en yeni üstte. Sıralama, arama ve sayfalama yok.
- Kaynak başına en çok 100 kayıt okunur.
- "Son İşlemler"den çapayla gelinen satır accent-soft zeminle vurgulanır.

**Toplam satırı**
- Sol: "TOPLAM", dönem seçiliyse "DÖNEM TOPLAMI". Yanında gri "{aralık · }N kayıt".
- Altında amber uyarılar:
  - "⚠ N kaydın kuru girilmemiş; ₺ toplamına dahil değil."
  - "⚠ N tahsilatın belgesi (dekont vb.) bağlanmamış." (belge izni varsa ve proje seçiliyse)
- İşlem PB sütununda gri "karışık PB" (bu sütun toplanmaz).
- ₺ defter sütununda üç satır: "+gelir ₺" (yeşil), "−gider ₺" (kırmızı), "= ±net ₺" (işaretine göre renk). Okunamayan taraf "—" yazılır ve net hesaplanmaz.

**Kesik notu:** "ⓘ Liste kaynak başına en fazla 100 kayıt gösterir; toplam bu kesitin toplamıdır. Daraltmak için süzgeçleri kullanın."

**Boş:** "Kayıt bulunamadı" / "Seçilen süzgeçlerle eşleşen gelir/gider kaydı yok." Bir taraf okunamıyorsa açıklama "Görebildiğiniz kayıtlarda süzgeçle eşleşen yok."

**Excel çıktısı** (`LedgerExcelExporter`)
- Dosya adı `Gelir-Gider-{projeKodu | tum-projeler}.xlsx`, sayfa adı "Gelir-Gider".
- 1. satır başlık: "Gelir-Gider — {proje | Tüm projeler} — {dd.MM.yyyy – dd.MM.yyyy | tüm zamanlar} — {yalnız gelir, kalem: …, kasa: …}".
- Sütunlar: Tarih, Tür, Başlık, Kategori, Bütçe kalemi, Kasa, Tutar, PB, ₺ karşılığı ("kur yok" olabilir), [Donör (PB)], [Belge (adet)].
- Dipte: "Toplam gelir (₺)", "Toplam gider (₺)", "Net (₺)".
- İtalik notlar:
  - "Kaynak başına en fazla 1000 kayıt alındı; tüm kayıtlar için dönemi daraltın."
  - "Gelir kayıtlarını görme yetkiniz yok; dosyada yer almıyor." (gider için aynısı)

---

#### Faturalar (`faturalar`)
**Amaç:** `/Invoices` ekranının ana-detay arayüzü olduğu gibi kullanılır (aynı betik), projeye süzülmüş hâliyle.

**Portföyde:** Bütün faturalar; üstteki başlık şeridi çıkmaz.

**Host:** host kartı.

**Şablon farkı:** Yok.

**Yerleşim**
1. Proje seçiliyse şerit: "Faturalar", proje adı çipi, sağda "Faturalar sayfasında aç" (`fa-arrow-up-right-from-square`; `Invoices.Create` gerekir) → `/Invoices` (proje süzgeci olmadan).
2. Ana-detay (`.apya-md`): solda liste, sağda detay. Dar ekranda tek panel; seçince detaya geçer.

**Liste araç çubuğu**
- Metin kutusu "Fatura no ara..." (fatura no ve cari adında arar; 250 ms gecikmeli).
- Durum düğmeleri: "Tümü" (seçili, birincil) · "Gönderildi" · "Ödendi" · "Gecikmiş" · "Taslak".
- ⓘ "Durum ödemelere göre otomatik belirlenir: kayıt Taslak olarak açılır, ödeme girildikçe Gönderildi, ödenen tutar genel toplamı karşılayınca Ödendi olur."
- "Excel'e aktar" (`fa-file-excel`): JS ekler; proje, durum ve arama süzgeciyle indirir.

**Liste öğesi**
- Yön ikonu: Alış ↓ amber, Satış ↑ mavi.
- Başlık: fatura no ya da "(numarasız)".
- Alt satır: "Alış | Satış · cari ya da proje · tarih".
- Sağda: kalın "1.234,56 EUR" ve durum çipi: Taslak (nötr) / Gönderildi (brand) / Ödendi (yeşil) / İptal (kırmızı) / Gecikmiş (amber; sunucunun hesapladığı bayrak).
- Alt bilgi: "N fatura" (+ " · x / y yüklendi"). "Daha fazla yükle" 200'erli sayfa getirir.
- Yüklenirken 6 iskelet satır ve "Yükleniyor…".
- Boş: "Eşleşen fatura bulunamadı" (+ süzgeç varsa "Filtreleri temizle").
- Hata: "Faturalar yüklenemedi." + "Tekrar dene".
- Masaüstünde ilk fatura kendiliğinden seçilir; `?invoiceId` ile gelindiyse o fatura seçilir.

**Detay paneli**
- Mobilde "← Listeye dön".
- Fatura no ve durum çipi; altında cari ya da proje.
- Eylemler:
  - "Gider kaydı oluştur" (`fa-receipt`): alış faturası, `Expenses.Create` ve karşılık gider yoksa. ⓘ "Fatura bütçe harcamasına sayılmaz; tutarın bütçe kalemine harcama olarak düşmesi için karşılığı olan gider kaydı girilir. Pencere faturanın bilgileriyle dolu açılır."
  - "Düzenle" (`fa-pen`; `Invoices.Edit`, iptal değilse).
  - "Ödeme Ekle" (`fa-hand-holding-dollar`; `Invoices.Edit`, ödenmemişse). ⓘ "Faturaya kısmi ya da tam tahsilat kaydı ekler. Ödenen tutar genel toplamı karşılayınca fatura Ödendi durumuna geçer."
  - "Yazdır" (`fa-print`, yeni sekme).
  - "PDF indir" (`fa-file-pdf`).
- 4 sütunlu bilgi ızgarası: "Düzenleme" (tarih), "Vade", "Yön" (ⓘ "Satış = sizin kestiğiniz fatura; sizin için alacak doğurur. Alış = size kesilen fatura; borcunuzu oluşturur."), "Ödenen".
- "Bütçe kalemi": kalem adı ya da "Bağlı değil".
- Kalem tablosu: Kalem | Adet | Birim | Tutar. Boşsa "Kalem yok".
- Sağda toplam kutusu (280 px): "Ara toplam", "KDV (%x)" (+ " · istisna: {ref}"), "Genel Toplam" (kalın, üst çizgili).
- "Notlar" (varsa).
- Detay boşken: "Detaylarını görmek için soldaki listeden bir fatura seçin."; yüklenirken "Fatura yükleniyor…".

Açılan pencereler başka modüle ait: `Invoices/EditModal`, `Invoices/PaymentModal`, `Expenses/CreateModal`. Bu sekmede "Yeni fatura" düğmesi yok.

---

#### Donör & raporlama (`donor`)
**Amaç:** Donör defteri özeti, uygunluk denetimi ve rapor paketleri. Yalnız Hibe şablonunda; mor noktalı.

**Portföyde:** durum kartı (`fa-file-export`) "Önce bir proje seçin" / "Donör raporlaması proje bağlamında anlamlıdır."

**Donör para birimi tanımsızsa (ya da kur köprüsü okunamazsa):** durum kartı "Bu projede donör para birimi tanımlı değil" / "Donör raporlaması, projenin donör para birimi ve kur politikası tanımlandıktan sonra anlam kazanır." Eylem düğmesi "Kur köprüsünü aç" (`fa-arrow-right-arrow-left`, outline) → Kur köprüsü sekmesi.

**Yerleşim:** 1) 4 KPI (md-3). 2) İki sütun (xl 7/5): "Donör kalemleri" | "Uygunluk denetimi". 3) Tam genişlik "Rapor dönemleri".

**KPI kartları** (donör para biriminde, KPI biçiminde):

| Etiket | Değer | Alt metin | Ton |
|---|---|---|---|
| Donör geliri | Donör defterinde gelen | "donör defteri" | positive |
| Donör gideri | Donör defterinde harcanan | "donör defteri" | negative |
| Donör net | Gelen − harcanan | "gelen − harcanan" | <0 ise negative |
| Kuru eksik kayıt | Adet | "donör tutarı hesaplanamadı" / "tamamı hesaplandı" | >0 ise warning |

**Donör kalemleri kartı:** Kod (70 px; ya da "—") | Kalem (kalın) | Onaylanan (sağ) | Harcanan (sağ; aşımda kırmızı). Tutarlar projenin para biriminde ve kalemin kendi tutarıdır; girintisiz düz liste. Boşsa "Bu projede bütçe kalemi yok."

**Uygunluk denetimi kartı**
- Başlık "Uygunluk denetimi", alt "Donöre göndermeden önce kapatılması gerekenler".
- Satır yapısı: [çip: adet, ya da denetlenemediyse soru ikonu] · [kalın başlık + " · tutar"] · [gri detay] · [sağda "Aç" bağlantısı].

| Başlık | Ton | Detay (aynen) | Sayı / tutar | "Aç" → |
|---|---|---|---|---|
| Belgesiz harcama | kırmızı | "Donöre belgesiz harcama sunulamaz." | adet + belgesiz toplam | `/Documents/Matching?projectId=` |
| Donör karşılığı hesaplanamadı | amber | "Kur kaydı eksik; bu kayıtlar donör raporunda tutar taşımaz." | adet | Kur köprüsü |
| Proje tarihleri dışında kayıt | amber | "Proje aralığı: dd.MM.yyyy – dd.MM.yyyy" | adet + ₺ defter toplamı | Gelir-Gider |
| Belge denetimi yapılamadı (?) | amber | "Harcama belgelerine erişiminiz yok (rol izni ya da paket kapsamı); belgesiz harcama olup olmadığı bilinmiyor. Bu başlık uygun sayılmaz." · host'ta: "Kiracı kayıtları platform yönetim hesabından denetlenemez; kiracının hesabından (Hesabına Gir) bakın." | — | — |
| Tarih denetimi yapılamadı (?) | amber | "Projenin başlangıç ve bitiş tarihi tanımlı değil." (`Projects.Edit` varsa "Aç" → proje düzenleme) · ya da "Gelir ya da gider kayıtlarını görme yetkiniz yok; tarih aralığı dışındaki kayıtlar denetlenemedi." · ya da host metni | — | (koşullu) |
| Tarih denetimi eksik (?) | amber | "Denetim gelir ve giderde en yeni 100'er kaydı kapsıyor (ya da bir süzgeç uygulanmış); daha eski kayıtlar proje tarihleri açısından denetlenmedi." | — | — |

- Hiç bulgu yoksa yeşil: "✓ Denetlenen üç başlıkta bulgu yok: her harcamanın belgesi var, kur karşılıkları hesaplandı, kayıtlar proje tarih aralığında."
- Kart dipnotu: "ⓘ Kayıt bazında **uygun/uygun değil** işareti henüz yok; bu denetim belge, kur ve tarih üzerinden yapılır."

**Rapor dönemleri kartı**
- Başlık; alt "Donöre giden paketler ve durumları".
- Sağda "Teslimler" (`fa-file-export`) → `/Documents/Deliveries?projectId=`. Paketler okunamıyorsa düğme gizli.
- Tablo: Paket | Dönem (110 px; kod ya da "—") | Ek (80 px; adet) | Durum (130 px; "Taslak" nötr / "Üretildi" accent / "Gönderildi" yeşil) | Üretim (150 px; tarih ya da "henüz üretilmedi").
- Boş: "Bu projede rapor paketi yok. Dönem paketini Teslimler ekranından kurar, Excel/PDF çıktısını oradan alırsınız."
- Kilit kartı: "Rapor paketlerine erişiminiz yok (rol izni ya da paket kapsamı)."

---

#### Kasa (`kasa`)
**Amaç:** Kiracının bütün kasa ve banka hesapları, ₺ karşılığı toplam ve hızlı transfer. Proje seçimi bu sekmede hiçbir şeyi değiştirmez.

**Host:** host kartı.

**Yerleşim:** İki sütun (lg 5/7).

**Sol sütun**
1. **Degrade kart** (accent-500 → 700, 135°, beyaz yazı):
   - Overline "Toplam Bakiye (₺ karşılığı)" ve ⓘ "Her hesabın bakiyesi, o para birimi için kayıtlı EN GÜNCEL kurla ₺'ye çevrilip toplanır. Kuru hiç girilmemiş bir para birimi toplama 0 olarak katılır — eksik görünüyorsa Kurlar sayfasından kur ekleyin."
   - Değer (h2): "₺1.234.567" (kuruşsuz).
   - Alt satır: "↗ N hesap · M para birimi".
   - Kurlar okunamıyorsa: "🔒 Yalnız ₺ hesaplar toplandı — kurları görme yetkiniz yok."
   - Hesaplar okunamıyorsa değer "— —" ve "🔒 Kasa/banka hesaplarını ve bakiyelerini görme yetkiniz yok."
2. **"Hesaplar" kartı:** Genel sekmesindeki hesap listesinin aynısı.

**Sağ sütun: "Hızlı Transfer" kartı** (`fa-paper-plane`; `apya-transfer.js`)
- Yüklenirken: "Hesaplar yükleniyor..."
- Form alanları:
  - "Gönderen": seçim; seçenek metni "Ad · PB  (bakiye)".
  - Yuvarlak "Yön değiştir" düğmesi (`fa-arrow-down-up-across-line`).
  - "Alıcı": seçim; varsayılan ikinci hesap.
  - "Tutar": solunda gönderen hesabın para birimi etiketi olan giriş grubu, para maskesi, yer tutucu "0,00".
  - Kur ipucu satırı (para birimleri farklıysa): "ⓘ Çevrim kuru uygulanır · 1 EUR ≈ 35,12 TRY" ya da "⚠ Güncel kur bulunamadı."
  - "Transferi onayla" (birincil, tam genişlik). Gönderirken "Gönderiliyor...".
- Uyarı bildirimleri: "Gönderen ve alıcı kasa farklı olmalıdır." · "Geçerli bir tutar girin."
- Başarı: "Transfer tamamlandı." ardından sayfa yenilenir.
- Onay adımı, açıklama ve tarih alanı yok. Arayüzde izin denetimi yok; izni olmayanı sunucu reddeder.

Hesap ekleme ya da hareket listesi bu sekmede yok; hepsi `/CashAccounts`'ta.

---

#### Kur köprüsü (`kur-koprusu`)
**Amaç:** Üç defteri yan yana göstermek (donör, yasal ₺, kasa gerçeği), kur politikası ve mutabakat. Yalnız Hibe; mor noktalı.

**Portföyde ya da okunamazsa:** "Kur köprüsü görüntülenemiyor" / "Bir proje seçin ya da bütçe görme yetkinizi kontrol edin."

**Yerleşim**
1. **Üç defter kartı** (md 4/4/4):
   - "Donör defteri" (`fa-hand-holding-dollar`) ve mor (`chip-ai`) para birimi çipi (ya da "—"). Satırlar: Gelen / Harcanan / Net (üst çizgili, kalın), donör para biriminde. Donör para birimi yoksa: "Bu projede donör para birimi tanımlı değil; donör defteri tutulmuyor."
   - "Yasal defter" (`fa-scale-balanced`), çip "TRY". Gelen / Harcanan / Net (₺).
   - "Kasa gerçeği" (`fa-cash-register`): her para birimi kendi içinde net (negatifse kırmızı); çapraz kur uygulanmaz. Kayıt yoksa "Bu projede kayıt yok."
2. **"Kur politikası" kartı:**
   - Yanında gri "donör karşılığı hangi günün kuruyla hesaplanır".
   - Sağda (CanEditBudget): "Politikayı düzenle" (`fa-sliders`) → FxPolicyModal. Kilitli kayıt varsa "Yeniden hesapla" (`fa-rotate`) → onay "N kaydın donör karşılığı yürürlükteki politikayla yeniden hesaplanacak. Devam edilsin mi?" → POST RecalculateFx.
   - Dört bilgi kartı (md-3, tıklanamaz). Seçili olan mavi çerçeve ve accent "Seçili" çipi alır; donör para birimi yoksa hiçbiri seçili değildir.
     - "Dilim (tahsil) kuru": "Paranın geldiği günün kuru. Donör açısından en doğrusu; projede tahsil edilmiş dilim yoksa harcama günü kuruna düşer."
     - "Harcama günü kuru": "Kaydın kendi günündeki kur. Varsayılan; ek veri istemez."
     - "Aylık donör kuru": "Donörün o ay için yayımladığı kur (InforEuro tipi). Ay içindeki tüm kayıtlar aynı kuru kullanır."
     - "Sabit sözleşme kuru": "Sözleşmede yazan kur. Kur hiç sorgulanmaz." Seçiliyse altında "1 TRY = 0,028 EUR".
   - Üç bilgi çipi: "Kayıt oluşunca donör karşılığı kilitlenir" · "Politika değişince kayıtlar kendiliğinden değişmez" · "Kur kaynağı: Kurlar sayfası" (bağlantı `/ExchangeRates`).
   - Eksik kur notu: "⚠ **N kaydın** donör karşılığı hesaplanamadı — o tarihler için kur girilmemiş. Kur eklendikten sonra "Yeniden hesapla" ile tamamlanır." ("kur girilmemiş" ifadesi `/ExchangeRates`'e bağlantı.)
3. **Mutabakat tablosu:**
   - Sütunlar: Tarih (100 px) | Hareket (çip "Gelir" yeşil / "Gider" amber + kalın başlık) | Kasa (170 px) | İşlem PB (140 px; N2 + PB) | Kur (110 px; donör kuru, yoksa defter kuru; kilitliyse kilit ikonu) | ₺ defter (140 px) | {PB} donör (150 px; ya da gri "kur yok").
   - Toplam satırı, süzgeç, sıralama ve sayfalama yok.
   - Boş: "Bu projede kayıt yok" / "Gelir/gider girildikçe üç defterdeki karşılıkları burada satır satır görünür."

---

#### Belgeler (`belgeler`)
**Amaç:** Belge modülünün finans bağlamındaki özeti. Ekranlar belge modülünde; buradan derin bağlantıyla açılır.

**Portföyde:** "Önce bir proje seçin" / "Belge açığı, uygunluk ve teslim paketi proje bağlamında anlamlıdır."

**Host:** host kartı.

**Üç kaynağın üçü de okunamazsa:** "Belge modülüne erişiminiz yok" / "Belge açığı, uygunluk kontrol listesi ve teslim paketleri belge modülünde tutulur."

**Yerleşim:** İki kart (xl 6/6) ve tam genişlik bir kart. Kart başlığı h6 (13 px, kalın), altında 12 px açıklama, sağda outline düğme.

**1. "Belge açığı"**
- Açıklama: "Harcamanın belgesi yoksa donöre sunulamaz; belge bir harcamaya bağlanmadıysa hiçbir kaleme sayılmaz."
- Düğme "Eşleştir" (`fa-link`) → `/Documents/Matching?projectId=`.
- İki sayı:
  - "Belgesiz harcama": adet (18 px, kırmızı), altında "X ₺".
  - "Harcamasız belge": adet, altında "bağlanmayı bekliyor".
- "Kalem bazında" başlıksız tablo: kalem adı çipi (kalemsizse italik gri "Kaleme yazılmamış") | "N kayıt" | tutar ₺ (kalın). Tutara göre azalan.
- Açık yoksa yeşil: "✓ Açık yok: her harcamanın belgesi, her belgenin harcaması var."
- Yetki yoksa: "Bu bölümü görme yetkiniz yok."

**2. "Uygunluk"**
- Açıklama: "Kurumun istediği belge listesi. Durumlar belgelerden hesaplanır, elle işaretlenmez."
- Düğme "Kontrol listesi" (`fa-list-check`) → `/Documents/Scope?projectId=`.
- İlerleme etiketi "X / Y kalem tamam · Z feragat" ve "%P". Çubuk eşikleri burada farklı: ≥100 yeşil, ≥60 amber, altı kırmızı.
- Çipler: "N bloke kalem" (kırmızı), "N eksik" (amber), paket adları (nötr).
- Paket yoksa: "Bu projeye henüz bir uygunluk paketi uygulanmamış."
- Yetki yoksa: "Bu bölümü görme yetkiniz yok."

**3. "Teslim paketleri"**
- Açıklama: "Bütçe tablosu, harcama listesi ve ekler tek dosyada. Bloke kalem varken paket dışa aktarılamaz."
- Düğme "Teslimler" (`fa-box-archive`) → `/Documents/Deliveries?projectId=`.
- Tablo: Paket (ad, altında rapor şablonu adı) | Dönem (110 px) | Ek (80 px) | Son kontrol (220 px).
- "Son kontrol" değerleri: gri "kontrol edilemedi" / yeşil "dışa aktarılabilir" (+ amber "N uyarı") / kırmızı "N bloke" ve altında "paket dışa aktarılamaz".
- Boş: "Bu projede teslim paketi yok. Donöre gidecek dosyayı Teslimler ekranından kurabilirsiniz."

---

### 6.2 Pencereler (modallar)

Ortak davranış:
- Bütçe modallarının sayfa izni `Projects.ViewBudget`. Yazma denetimi sunucudadır (ManageBudget ya da Projects.Edit); açan düğmeler zaten yalnız CanEditBudget iken çıkar.
- Alt düğmeler ABP'nin İptal + Kaydet çifti; Türkçe karşılıkları ABP kaynağından gelir (kodda belirsiz).
- Kaydet başarılıysa pencere kapanır ve sayfa tamamen yenilenir (Budget.js / Ledger.js).
- Hatalar ABP'nin hata penceresinde görünür. Alan doğrulama metinleri ABP'nin standart metinleridir (kodda belirsiz). İş kuralı hatalarının Türkçe metinleri aşağıda.
- Tutar alanlarında `data-money-input` tr-TR para maskesi var ("1.500,00").

#### BudgetLineModal: "Yeni Bütçe Kalemi" / "Bütçe Kalemini Düzenle"
**Açıldığı yer** (Bütçe kalemleri sekmesi): "Kalem ekle" (yeni), satırdaki "Alt kalem ekle" (yeni, üst kalem önden seçili), satırdaki "Düzenle".

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama | Yardım / davranış |
|---|---|---|---|---|---|
| Üst kalem / kategori | seçim | hayır | "— Yok (ana kalem) —"; alt kalemden açıldıysa o kalem; düzenlemede mevcut değer | Kalemin kendisi ve alt ağacı listede yok; en çok 4 düzey | Seçenekler ağaç sırasıyla, derinliğe göre girintili "kod · ad". Kod "2.1" yazılınca üst kalem boşsa "2" kodlu kalem kendiliğinden seçilir. |
| Kod | metin (yer tutucu "1.2") | hayır | — | ≤32 karakter; projede benzersiz | — |
| Kalem adı | metin | evet | — | ≤128 karakter | — |
| Sözleşme tutarı | para | örtük evet | 0 (ekranda nasıl göründüğü kodda belirsiz) | 0 – 999.999.999.999 | — |
| Onaylanan tutar | para | hayır | düzenlemede mevcut değer | 0 – 999.999.999.999 | Boşsa sözleşme tutarı kullanılır |
| Hibe payı | para | hayır | düzenlemede elle girilmiş pay | 0 ≤ hibe ≤ onaylanan | Boşsa destek oranından hesaplanır |
| Kurum payı | para (KAYDEDİLMEZ) | hayır | onaylanan − hibe | — | Yazılınca hibe = onaylanan − kurum olarak doldurulur |

- **Canlı ipucu satırı** (hibe/kurum değişince yazılır):
  - "Hibe payı onaylanan tutardan büyük olamaz."
  - "Hibe payı elle girildi; destek oranı bu kalem için kullanılmaz."
  - "Boş bırakılırsa destek oranından hesaplanır: hibe %X = A, kurum B."
  - "Projede destek oranı yok; hibe payı girilmezse pay hesaplanmaz."
- **Sabit not:** "Onaylanan tutarı buradan değiştirmek **revizyon kaydı üretmez**. Kesinti sonrası bütçe düşürmek için "Dilimler & kesintiler" sekmesindeki revizyon akışını kullanın."
- **İş kuralı hataları:**
  - "Bu kalem kodu bu projede zaten kullanılıyor."
  - "Seçilen üst kalem geçersiz. Üst kalem aynı projede olmalı; bir kalem kendisinin ya da kendi alt kaleminin altına taşınamaz ve en fazla 4 düzey iç içe kalem tanımlanabilir."
  - "Hibe payı 0 ile kalemin onaylanan tutarı arasında olmalıdır. Onaylanan: …, girilen hibe payı: …."
  - "Bütçe kaleminin adı boş bırakılamaz."
  - "Geçersiz tutar. Bütçe kalemi tutarı negatif olamaz."

#### BudgetLineImportModal: "Bütçe kalemlerini Excel'den içe aktar"
**Açıldığı yer:** Bütçe kalemleri › "Excel'den içe aktar". Pencere çok geniş. Aynı sayfanın Export işleyicisi "Excel'e aktar" düğmesinin indirdiği dosyayı üretir.

**Adımlar (tek ekranda):**
1. Metin: "1. Şablonu indirip doldurun ya da bu ekrandan dışa aktardığınız dosyayı kullanın. Yıldızlı sütunlar zorunludur; liste olan sütunlarda şablondaki seçeneklerden birini seçin." ve ek ipucu: "Tutarlar projenin para birimindedir. Üst kalem, mevcut bir kalemin ya da dosyada daha yukarıdaki bir satırın kodu veya adı olabilir. Onaylanan tutar boşsa sözleşme tutarı, hibe payı boşsa destek oranıyla hesaplanan tutar kullanılır."
   - Düğme "Şablonu indir" (`fa-download`) ve bağlantı "CSV şablonu".
2. Metin: "2. Doldurduğunuz dosyayı seçip önizleyin; hata yoksa içe aktarın."
   - Dosya seçici (.xlsx, .csv), "Önizle" (`fa-eye`, outline-primary), "İçe aktar" (`fa-file-import`, birincil; önizleme hatasız olana kadar pasif).
   - Not: "Hatalı satır varsa hiçbir satır kaydedilmez."
   - Mesaj kutusu (başarı / hata) ve önizleme tablosu (en çok %50 ekran yüksekliğinde kayar): Satır | dosya sütunları | Hata. Hatalı satır kırmızı.
3. Alt düğme: "Kapat". İçe aktarma tamamlanınca başarı bildirimi çıkar; pencere kapanınca sayfa yenilenir.

**Dosya sütunları:**

| Sütun | Zorunlu | Kural |
|---|---|---|
| Kod | hayır | ≤32; mevcut kalemlerde ve dosyada tekrar edemez |
| Kalem adı | evet | ≤128 |
| Üst kalem | hayır | Mevcut ya da dosyada daha yukarıdaki kalemin kodu, adı ya da "kod - ad" |
| Sözleşme tutarı | evet | sayı, ≥0 |
| Onaylanan tutar | hayır | sayı, ≥0 |
| Hibe payı | hayır | sayı, ≥0 |

**Hata metinleri:**
- Satır düzeyi: "{0} boş olamaz.", "{0} en fazla {1} karakter olabilir.", "{0}: \"{1}\" zaten kullanılıyor.", "{0} sayı olmalı.", "{0} negatif olamaz.", "{0}: \"{1}\" bulunamadı.", "{0}: \"{1}\" birden fazla kayıtla eşleşiyor."
- Genel: "Önce bir Excel ya da CSV dosyası seçin.", "Dosya işlenemedi. Lütfen tekrar deneyin.", "Dosya okunamadı; .xlsx ya da .csv biçiminde bir dosya seçin.", "\"{0}\" sütunu bulunamadı. Şablonu indirip başlıkları değiştirmeden kullanın.", "Bir dosyada en fazla {0} satır içe aktarılabilir.", "Dosyada içe aktarılacak satır yok."

#### CollectionModal: "{N}. Dilim — Tahsilat"
**Açıldığı yer:** Dilimler & kesintiler › satırdaki "Tahsilat gir" (`fa-hand-holding-dollar`).

- **Üst özet** (overline + kalın sayı): "Planlanan" · "Kesinti" (kırmızı) · "Beklenen" (planlanan − kesinti).

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama | Yardım |
|---|---|---|---|---|---|
| Tahsil edilen (toplam) | para | örtük evet | mevcut tahsilat | 0 – 999.999.999.999 | Kümülatif tutar |
| Tahsilat tarihi | tarih | hayır | mevcut tahsilat tarihi, yoksa bugün | — | — |
| Karşılık gelen gelir kaydı (isteğe bağlı) | seçim | hayır | dilimin mevcut bağı; "— Bağlanmadı —" | Başka dilime bağlı gelirler listede yok | Seçenek metni "dd.MM.yyyy · Başlık · Tutar" (projenin son 200 geliri). Gelir yoksa ya da görme yetkisi yoksa alan hiç çıkmaz. |

- **Not:** "Tutar **kümülatiftir**: bugüne kadar gelen toplamı yazın, farkı değil. Beklenen tutara ulaşınca dilim "Tahsil edildi" olur."
- **Hatalar:**
  - "Geçersiz tahsilat tutarı. Tutar negatif olamaz."
  - "Seçilen gelir kaydı bulunamadı. Kayıt silinmiş olabilir; listeden yeniden seçin."
  - "Seçilen gelir kaydı bu projeye ait değil. Tahsilat yalnız aynı projenin gelir kaydına bağlanabilir."
  - "Bu gelir kaydı zaten {N}. dilimin tahsilatına bağlı. Aynı gelir iki dilime bağlanamaz."

#### ContextWizardModal: "Finans bağlamını kur"
**Açıldığı yer:** Bütçe kalemleri › "Bağlamı kur". Pencere geniş. "Sihirbaz" adını taşısa da tek ekran, iki bölüm.

**Bölüm 1, overline "Bu projenin bağlamı" (salt okunur kart)**
- Kategori ikonu (accent kutu), proje adı.
- "Kategori: **{kategori}** → finans şablonu: **{Kurumsal proje | Hibe projesi | Etkinlik}**".
- Şablonun sekmeleri çip olarak; bağlama özel olanlar accent (mor), diğerleri nötr.
- Yardım: "Bu şablonda açılan sekmeler yukarıda; mor olanlar bu şablona özeldir. Şablonu değiştirmek için projenin **kategorisini** değiştirin — proje düzenleme ekranı." (bağlantı `/Projects/Edit/{id}`)

**Bölüm 2, overline "Bütçe kalemleri"**
- Projede kalem varsa amber çip: "⚠ Bu projede zaten N kalem var — aşağıdakiler ÜSTÜNE eklenir."
- Not: "Aşağıdaki adlar yalnızca öneridir; düzenleyin, silin ya da satır ekleyin. **Tutarlar boş gelir** — girmediğiniz bir bütçeyi sizin adınıza yazmıyoruz."
- Düzenlenebilir tablo: Kod (90 px, metin, ≤32) | Kalem adı (metin, ≤200) | Sözleşme tutarı (170 px, sayı, ≥0, varsayılan 0) | çöp "Satırı çıkar".
- "Satır ekle" (`fa-plus`, outline).
- Şablona göre önerilen satırlar:
  - Hibe: 1 Personel · 2 Seyahat ve konaklama · 3 Ekipman ve malzeme · 4 Hizmet alımı · 5 Dolaylı giderler.
  - Etkinlik: 1 Mekân ve lojistik · 2 Konuşmacı ve program · 3 İkram · 4 Tanıtım ve basılı malzeme.
  - Kurumsal: 1 Personel · 2 Hizmet alımı · 3 Ekipman · 4 Diğer giderler.

**Kaydet:** Adı boş satırlar atlanır, kalanlar ana kalem olarak eklenir. Önce bütün kodlar denetlenir; çakışma varsa hiçbir kalem eklenmez ve şu hata çıkar: "Şu kalem kodları kullanılamaz: X (formda iki kez), Y (projede zaten var). Kodları düzeltin ya da boş bırakın; hiçbir kalem eklenmedi."

#### DeductionModal: "{N}. Dilim — Kesinti Ekle"
**Açıldığı yer:** Dilimler & kesintiler › satırdaki "Kesinti ekle" (`fa-scissors`).

- **Özet satırı:** "Planlanan X · mevcut kesinti Y (kırmızı) · kesilebilecek en fazla Z".

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama |
|---|---|---|---|---|
| Kesinti tutarı | para | evet | — | ≥0,01; toplam kesinti planlananı aşamaz |
| Kesinti tarihi | tarih | örtük evet | bugün | — |
| Gerekçe | metin | evet | — | ≤512 karakter |

- **Not:** "Kesinti önce **açık** kaydedilir. Bütçeyi küçültmek mi yoksa "finanse edilmeyen" olarak bırakmak mı gerektiğine listedeki satırdan karar verirsiniz."
- **Hatalar:**
  - "Kesintilerin toplamı dilimin planlanan tutarını aşamaz."
  - "Kesinti için gerekçe girilmelidir."
  - "Geçersiz tutar. Kesinti tutarı sıfırdan büyük olmalıdır."

#### FxPolicyModal: "Kur Politikası"
**Açıldığı yer:** Kur köprüsü › "Politikayı düzenle".

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama | Yardım |
|---|---|---|---|---|---|
| Donör para birimi | seçim: "— Donör defteri yok —", TRY (₺), EUR (€), USD ($), GBP (£) | hayır | mevcut değer | 3 karakter; proje para biriminden farklı olmalı | Boşsa proje tek defterli olur |
| Kur politikası | seçim: Harcama günü kuru / Dilim (tahsil) kuru / Aylık donör kuru / Sabit sözleşme kuru | — | mevcut değer | — | — |
| Sabit kur — 1 {proje PB} = ? donör PB (yalnız "Sabit sözleşme kuru" için) | sayı, 6 ondalık | Sabit politikada evet | mevcut değer | 0 – 999999 | Politika seçiminden bağımsız olarak hep görünür |

- **Not:** "Donör para birimi boş bırakılırsa proje tek defterli olur; politika ve sabit kur temizlenir. **Mevcut kayıtlar bu ekrandan değişmez** — donör karşılıkları kilitlidir; yeniden hesaplamak için sekmedeki "Yeniden hesapla" düğmesini kullanın."
- **Hatalar:**
  - "Donör para birimi, projenin kendi para biriminden farklı olmalıdır."
  - "Sabit sözleşme kuru seçildiğinde kur değeri girilmelidir."

#### IncomeDocumentModal: "Tahsilata belge bağla"
**Açıldığı yer:** Gelir-Gider › gelir satırındaki "Belge bağla" (`fa-link`). Görünmesi için `Incomes.Edit` ve `Documents.Default` izinleri ile proje seçimi gerekir.

- **"Bağlı belgeler"** listesi (varsa): ataş ikonu, ad, "Bağı kaldır" (outline). Bağı kaldırma anında yapılır ve sayfa yenilenir; Kaydet gerekmez.

| Etiket | Tür | Zorunlu | Varsayılan | Yardım |
|---|---|---|---|---|
| Bağlanacak belge | seçim ("— Seçin —" + gelirin projesindeki, bu gelire henüz bağlanmamış belgeler) | hayır | boş | "Belgeler bu gelirin projesindeki dosyalardan seçilir. Dekont henüz yüklenmediyse önce Belgeler ekranından projeye yükleyin." |

- Bağlanabilecek belge yoksa: "Bağlanabilecek belge yok. Gelir bir projeye bağlı olmalı ve projede henüz bu gelire bağlanmamış bir belge bulunmalı."
- Kaydet: belge seçildiyse bağlar, seçilmediyse yalnız pencereyi kapatır. İki durumda da sayfa yenilenir.

#### RevisionModal: "Bütçe Revizyonu — Rev.{N}"
**İki kipte açılır** (geniş pencere):
- (a) Bütçe kalemleri › "Bütçeyi revize et": **"yeni tutar" kipi**.
- (b) Dilimler › kesinti satırı › "Bütçeye işle": **"kesinti" kipi**.

**Yalnız kesinti kipinde:**
- İki seçenek kartı (radyo; seçili olan accent çerçeveli):
  - "**Bütçeyi revize et**" / "Kesintiyi kalemlere dağıt, Rev.N oluşsun." (varsayılan)
  - "**Açık bırak**" / "Bütçe aynı kalır; kesinti "finanse edilmeyen" olarak kapanır." Seçilince aşağıdaki alanlar ve tablo gizlenir.
- Amber kutu: "Dağıtılacak kesinti: **X** · dağıtılmayan kalan: **Y**. Tamamını dağıtmak zorunda değilsiniz — kalan kısım bütçede açık olarak durur." Kalan, yazdıkça canlı güncellenir.

**Alanlar:**

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama |
|---|---|---|---|---|
| Gerekçe | metin | evet (sunucuda) | kesinti kipinde "Kesinti: {gerekçe}" | ≤512 |
| Yürürlük tarihi | tarih | örtük evet | bugün | — |

**Kalem tablosu:**
- Sütunlar: Kalem ("kod · ad"; bütün kalemler girintisiz düz liste, üst kalemlerde kendi tutarı) | "Rev.{N−1}" (mevcut onaylanan) | ve:
  - Kesinti kipinde: "Düşülecek" (sayı girişi, kırmızı, kalın) + "Rev.N" (hesaplanan yeni tutar).
  - Yeni tutar kipinde: "Yeni tutar" (para girişi, mevcut tutarla dolu).
- Not: "Yalnız **değiştirdiğiniz** kalemler revizyon kaydına girer. Kalemin sözleşme tutarı değişmez; sadece onaylanan tutar taşınır."
- Kalem yoksa: "Bu projede bütçe kalemi yok — önce kalem tanımlayın."

**Kaydet:**
- "Açık bırak" seçiliyse kesinti finanse edilmeyen olarak kapanır, başka alan okunmaz.
- Diğer durumda yalnız değişen kalemler revizyona yazılır; kesinti kipinde kesinti bu revizyona bağlanır ve çipi "Bütçeye işlendi · Rev.N" olur.

**Hatalar:** "Revizyon için en az bir kalemin tutarı değiştirilmelidir." · "Geçersiz tutar. Revizyon tutarı negatif olamaz."

#### SupportRateModal: "Destek Oranı"
**Açıldığı yer:** Bütçe kalemleri › "Destek oranı" (`fa-percent`).

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama |
|---|---|---|---|---|
| Hibe destek oranı (%) | sayı (gruplama yok) | hayır | projenin kendi oranı; oran programdan geliyorsa boş | 0 – 100 |

- **Not:** "Kurum katkısı (eş finansman) oranı otomatik olarak **100 − destek oranı** olur. Kalemlerde hibe payı elle girilmemişse bu orana göre hesaplanır." Program oranı varsa ek satır: "Boş bırakılırsa hibe programının oranı kullanılır: **%X**."
- **Hata:** "Destek oranı 0 ile 100 arasında olmalıdır."

#### TrancheModal: "Yeni Fonlama Dilimi" / "Dilimi Düzenle"
**Açıldığı yer:** Dilimler › "Dilim ekle" ve satırdaki "Düzenle".

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama |
|---|---|---|---|---|
| Başlık (isteğe bağlı) | metin (yer tutucu "1. Hakediş") | hayır | — | ≤128 |
| Planlanan tutar | para | evet | — | 0,01 – 999.999.999.999 |
| Planlanan tarih | tarih | hayır | — | — |
| Not (isteğe bağlı) | metin | hayır | — | ≤512 |

- **Not:** "Tahsilat bu ekranda girilmez — dilim oluştuktan sonra satırdaki **Tahsilat gir** ile kaydedilir."
- **Hata:** "Geçersiz tutar. Dilim tutarı sıfırdan büyük olmalıdır."

#### VatExemptionModal: "KDV İstisna Belgesi"
**Açıldığı yer:** Bütçe kalemleri › "KDV istisnası" (`fa-receipt`).

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama |
|---|---|---|---|---|
| Belge no | metin | hayır (boşaltmak istisnayı kaldırır) | mevcut değer | ≤64 |
| Son geçerlilik tarihi | tarih | hayır (boşsa süresiz) | mevcut değer | — |

- **Not:** "Belge geçerliyken bu projeye kesilen yeni faturalar **KDV istisnalı** açılır (KDV %0, yazdırmada belge no basılır); fatura penceresinde kaldırılabilir. Tarih boşsa belge süresiz sayılır. Belge no'yu silerseniz istisna kaldırılır. Belgenin taramasını Belgeler'e "KDV istisna belgesi" türüyle yükleyebilirsiniz."

---

### 6.3 Tek tıklık işlemler (sunucu uçları)

| İşleyici | Tetikleyen | Ne yapar | Dönüş |
|---|---|---|---|
| `OnGetAsync` | Sayfa açılışı | İzin kapısı (403); proje listesi (≤1000) ve seçili proje; şablon; host kapsamı; izne göre süzülmüş sekme seti; yazma bayrakları; yalnız aktif sekmenin verisi | Sayfa |
| `OnGetLedgerExcelAsync` (`?handler=LedgerExcel`) | Gelir-Gider › "Excel" | Aynı süzgeçlerle, kaynak başına 1000 kayıtla Excel üretir | .xlsx |
| `OnPostDeleteLineAsync(lineId)` | Kalem "Sil" | Kalemi siler | Aynı proje ve sekmeye yönlendirme |
| `OnPostDeleteTrancheAsync(trancheId)` | Dilim "Sil" | Dilimi ve kesintilerini siler | Yönlendirme |
| `OnPostSetTrancheDisputedAsync(trancheId, disputed)` | Tokmak düğmesi | İtiraz işaretini koyar ya da kaldırır | Yönlendirme |
| `OnPostRemoveDeductionAsync(deductionId)` | Kesinti çöp ikonu | Kesintiyi siler | Yönlendirme |
| `OnPostMarkDeductionUnfundedAsync(deductionId)` | "Finanse edilmeyen" | Kesintiyi finanse edilmeyen olarak kapatır | Yönlendirme |
| `OnPostReopenDeductionAsync(deductionId)` | "Kararı geri al" | Kesintiyi yeniden açık yapar | Yönlendirme |
| `OnPostRecalculateFxAsync()` | Kur köprüsü › "Yeniden hesapla" | Kilitli kayıtların donör karşılığını yürürlükteki politikayla yeniden hesaplar | Yönlendirme |

- POST işleyicilerinde başarı bildirimi yok; sayfa yeniden çizilir.
- Servis hata atarsa düz form POST'unda ne gösterildiği kodda belirsiz (muhtemelen ABP hata sayfası).
- Modal sayfalarındaki ek uçlar:
  - `BudgetLineImportModal`: `?handler=Export` (GET), Template (GET), Preview ve Import (POST, dosyayla).
  - `IncomeDocumentModal.OnPostUnlinkAsync`: arayüz bunu kullanmıyor, bağı API vekili üzerinden kaldırıyor.

---

### 6.4 CSS sınıf ailesi (bölüm bazında)

| Bölüm | Sınıflar | Kaynak |
|---|---|---|
| Sayfa kökü | `.apya-page` (`data-project-id`, `data-page-description`) | — |
| Bağlam çubuğu | `.apya-console-rail` + `.apya-finance-context` (select 200–320 px), `.apya-overline`, `.form-select-sm`, `.apya-console-sep`, `.apya-chip` + `-accent` / `-neutral`, `.apya-numeric`, `.btn-sm.btn-outline-secondary` | apya-shell.css S21, S24 |
| Sekme şeridi | `nav.apya-console-tabs` > `a.apya-console-tab(.active)`, `.apya-finance-tab-dot` | S21, S24 |
| Panel kabı | Bootstrap `.card` > `.card-body`, `.card-header` | LeptonX / theme-bridge |
| KPI şeritleri | `.row.g-3.apya-finance-kpis` > `_KpiCard`: `.card.h-100`, `.kpi-icon-box--{neutral, accent, positive, negative, warning, brand}` (finansta GİZLİ), `.kpi-card-text`, `h3.apya-numeric`, `<apya-hint>` (ⓘ ipucu) | S24, shell §kpi |
| Fonlama akışı | `.apya-funding-flow` > `.is-received` / `.is-pending` (taralı) / `.is-deducted` | S24 |
| Listeler (Son İşlemler, hesaplar) | `.list-group-flush`, `.list-group-item-action`, `.kpi-icon-box--sm` + ton | Bootstrap + shell |
| Tablolar | `.table.apya-clean-table.align-middle`, `.table-responsive`, `.apya-portfolio-scroll` (460 px, yapışkan başlık), `tr.apya-budget-parent`, `button.apya-th-sort` + `th[aria-sort]`, `tr.apya-deduction-row`, `tr.apya-matrix-line` / `.apya-matrix-task`, `tr.apya-ledger-row:target` | shell S17, S24 |
| İlerleme | `.apya-tile-progress-label`, `.apya-mini-progress.is-positive` / `is-warning` / `is-negative` | shell |
| Rozetler | `.apya-chip-{neutral, accent, positive, negative, warning, brand, ai}` | apya-theme-bridge.css |
| Süzgeç çubuğu (Gelir-Gider) | `.apya-console-filters`, `.apya-console-filter-label`, `.apya-filter-chip(.is-active)`, `.apya-console-filter-clear`, `.dropdown-menu.apya-console-menu` > `.apya-console-menu-item` | shell |
| Durum kartları | `.apya-console-state`, `-icon(.is-muted)`, `-actions`, `[data-apya-state]` | shell |
| Faturalar ana-detay | `.apya-md(.has-selection)`, `-list`, `-toolbar`, `-items`, `-item(.selected)`, `-item-body` / `-title` / `-sub` / `-side`, `-detail`, `-empty`, `-pager`, `-back`, `-overline`, `.apya-skeleton` | shell §11 |
| Modallar | ABP `abp-modal` (Bootstrap modal), `.apya-revmode(.is-selected)`, `[data-money-input]`, `.form-text`, `.alert-warning` | S24 |
| Kasa toplam kartı | satır içi stil `linear-gradient(135deg, var(--apya-accent-500), var(--apya-accent-700))`, `.text-white-50` | — |
| Kullanılan token'lar | `--apya-accent-500/600/700`, `--apya-positive-500`, `--apya-negative-500`, `--apya-warning-500`, `--apya-surface-sunken`, `--apya-radius-lg` | — |

Ayrıca satır içi yazı boyutları çok sık: 11.5 / 12 / 12.5 / 13 / 18 / 20 px. Tipografi ölçeği bileşenlere bağlı değil.

---

### 6.5 Tasarım açısından göze çarpan sorunlar — Finans Merkezi

1. **KPI renkleri görünmüyor.** `.apya-finance-kpis .kpi-icon-box { display:none }`. KPI'ların ton bilgisi (aşımda kırmızı, eksik kurda amber vb.) YALNIZ ikon kutusuna uygulanıyor. Sonuçta Genel, portföy ve Donör şeritlerinde "Kullanılabilir nakit < 0", "Kalan bütçe aşıldı", "Finanse edilmeyen > 0", "Kuru eksik kayıt > 0" yalnız alt metinden anlaşılıyor. Şerit 6 kart için bilerek 3×2 seçilmiş; tek satırda Türkçe etiketler kırpılıyor (CSS yorumu).
2. **Adlandırma tutarsızlıkları:**
   - Menü "Finans Merkezi", sayfa başlığı "Finans".
   - Şablon çipte "Dernek etkinliği", portföy tablosunda ve sihirbazda "Etkinlik".
   - Bir hata metni olmayan bir ekranı gösteriyor: "Finans › Fonlama ekranında".
   - BudgetLineModal notu revizyonu "Dilimler & kesintiler" sekmesinde gösteriyor; oysa "Bütçeyi revize et" Bütçe kalemleri sekmesinde ve Etkinlik şablonunda Dilimler sekmesi hiç yok.
   - "Planlanan" üç ayrı anlamda kullanılıyor: matriste kalemin onaylanan tutarı, dilimde planlanan fon, kalem verisinde sözleşme tutarı.
3. **"Açık bırak" tam tersini yapıyor.** Revizyon modalındaki "Açık bırak" kesintiyi "Finanse edilmeyen" olarak KAPATIYOR; ama karar çipindeki "Açık" henüz karar verilmemiş demek. Aynı işlemin üç adı var: "Açık bırak" kartı, "Finanse edilmeyen" düğmesi, "Finanse edilmeyen" çipi.
4. **Aynı bilgi birden çok yerde:**
   - Donör sekmesinde "Kuru eksik kayıt" KPI'ı ile "Donör karşılığı hesaplanamadı" bulgusu aynı sayı.
   - Donör KPI'ları ile Kur köprüsündeki "Donör defteri" kartı aynı üç rakam.
   - "Belgesiz harcama" hem Donör bulgusunda hem Belgeler'de; Donör'de proje para birimiyle, Belgeler'de sabit "₺" ile (aynı tutar, iki farklı birim).
   - Teslim paketleri iki sekmede, iki ayrı sütun setiyle (Donör: Durum + Üretim; Belgeler: Son kontrol).
   - Hesap listesi Genel ve Kasa'da.
   - Fonlama akışı (Genel) ile denklem şeridi (Dilimler) aynı sayılar.
5. **Dilim denklemi tutmayabilir.** "Sözleşme − Kesinti = Onaylanan" yazıyor. Ama kesinti bütün kesintilerin toplamı (açık ve finanse edilmeyenler dahil), onaylanan ise kalemlerin yürürlükteki toplamı (kesintiden bağımsız revizyonla da değişir). Kod eşitliği zorlamıyor (çıkarım; çalıştırılarak doğrulanmadı).
6. **Yoğun eylem alanları:**
   - Bütçe kalemleri başlığında tek satırda 7 düğme.
   - Dilim satırında 5 etiketsiz ikon; tokmağın iki hali var ve renkten başka fark yok.
   - Kesinti alt satırında 2–3 düğme daha.
   - Satır eylemlerinin neredeyse hepsi yalnız ikon.
7. **Yoğun tablolar ve şablona uymayan sütunlar:**
   - Bütçe kalemlerinde 8 veri sütunu + eylem sütunu.
   - Gelir-Gider'in başlık hücresinde çip, bağlantı, ataş ve bağla ikonu bir arada.
   - Hibe/Kurum sütunları ve "Destek oranı girilmemiş" uyarısı Kurumsal ve Etkinlik projelerinde de çıkıyor.
8. **Para birimi gösterimi dağınık:**
   - KPI'da önek, kuruşsuz "₺2.400.000"; tablolarda sonek "1.234,56 ₺".
   - Kalem, dilim ve matris tablolarında birim hiç yok.
   - Belgeler'de para birimi ne olursa olsun "₺".
   - Son İşlemler'de transferler hesabın para biriminden bağımsız "₺" (kodda `Currency = "TRY"` sabit).
9. **Renk anlamı tutarsız:**
   - "Gider" çipi amber ama gider tutarı kırmızı.
   - Kullanım çubuğu eşikleri 80/100, uygunluk çubuğu 60/100.
   - Donör para birimi çipi mor (`chip-ai`).
10. **"Okunamadı ≠ yok" kuralı her yerde yok.**
    - Belgeler'de teslim paketleri okunamazsa "Bu projede teslim paketi yok…" yazıyor (Donör'de kilit kartı var).
    - "Eşleştir", "Kontrol listesi" ve "Teslimler" düğmeleri yetki yokken de basılıyor; tıklayan 403'e düşer.
11. **Bağlam kaybı:**
    - Gelir-Gider satır başlığı kaydın kendisine değil, projesiz `/Incomes` ya da `/Expenses` listesine gidiyor.
    - "Faturalar sayfasında aç" projesiz `/Invoices`'a gidiyor ve bir gezinme bağlantısı olduğu hâlde `Invoices.Create` iznine bağlı.
    - Faturalar sekmesinde "Yeni fatura" düğmesi yok.
    - Proje seçiliyken Kasa & Banka listesi ve Kasa sekmesi projeye süzülmüyor ve bunu söylemiyor.
12. **Mor nokta yanıltıcı.** Kurumsal şablonda "Dilimler & kesintiler" de noktalı (yalnız Etkinlik'te olmadığı için). İpucu "bu şablona özel" diyor.
13. **Bağlam sihirbazı:**
    - Tek ekran, adım yok.
    - "Tutarlar boş gelir" diyor ama alanlar 0 ile geliyor.
    - Kalem adı alanı 200 karakter kabul ediyor, sunucu 128'den uzununu reddediyor.
    - Yalnız ana kalem kuruyor; kod yorumunda hâlâ "kalem ağacı yok" yazıyor ama kalemler artık 4 düzeye kadar ağaç.
    - Gösterilen sekme çipleri kullanıcının iznine göre süzülmemiş.
14. **Revizyon modalı:** Kalemler girintisiz düz liste (üst/alt kalem ayrımı görünmüyor). İlk revizyonda mevcut sütunun başlığı "Rev.0".
15. **Kur politikası:**
    - Dört kart seçilebilir gibi görünüyor ama tıklanmıyor; seçim modalda yapılıyor.
    - Kart sırası (Dilim, Harcama, Aylık, Sabit) modaldaki seçim sırasından (Harcama, Dilim, Aylık, Sabit) farklı.
    - Sabit kur alanı politika seçiminden bağımsız olarak hep görünüyor.
16. **Hızlı Transfer:**
    - Para hareketi için onay adımı yok.
    - Hesaplar yüklenemezse "Hesaplar yükleniyor..." sonsuza kadar kalıyor (hata yakalanmıyor).
    - Açıklama ve tarih alanı yok.
    - İzni olmayana da gösteriliyor.
17. **Gelir-Gider:**
    - Sıralama, arama ve sayfalama yok; kaynak başına 100 kayıt kesiği var (not düşülüyor).
    - "karışık PB" ibaresi bütün kayıtlar TRY olsa da basılıyor.
    - Donör tarih denetimi de bu 100 kayıtlık kesite dayanıyor.
18. **Aynı kalem, iki farklı rakam.** "Donör kalemleri" tablosu kalemin kendi tutarını ve proje para birimini gösteriyor; Bütçe kalemleri sekmesi alt ağaç toplamını gösteriyor.
19. **Yanıltıcı alt metin.** Portföydeki "Gelen" KPI'ının alt metni "tahsilat + gelir"; oysa kural toplama değil: dilim varsa tahsilat, yoksa gelir kayıtları.
20. **Proje seçici:**
    - Proje listesi izni yoksa seçici yine basılıyor, tek seçeneği "Tüm projeler" (kod yorumu "hiç basılmaz" diyor).
    - 1000 projeye kadar düz select; arama yok.
    - Her seçim tam sayfa yeniden yükleme.
21. **Metinlerin çoğu koda gömülü.** Panel metinlerinin büyük kısmı ve başlık altı açıklaması cshtml'de; yalnız bir kısmı `tr.json`'da. Metin değişikliği iki kaynağa dokunmayı gerektirir.
22. **Faturalar:**
    - "İptal" durumu için süzgeç düğmesi yok.
    - Arama kutusu "Fatura no ara..." diyor ama cari adında da arıyor.
    - İptal edilmiş faturada da "Ödeme Ekle" çıkabiliyor; koşul yalnız "ödenmedi".
23. **Son İşlemler:** Bir alış faturası ile onun karşılığı olan gider kaydı iki ayrı satır olarak görünebilir (Gelir-Gider sekmesi faturayı tam bu yüzden dışarıda tutuyor). Transferin iki bacağının iki ayrı satır çıkıp çıkmadığı kodda belirsiz.
24. **Onay asimetrisi.** "Finanse edilmeyen", "Kararı geri al" ve "İtiraz işaretini kaldır" onaysız çalışıyor; "İtiraz sürecinde olarak işaretle" onay istiyor.
25. **Sessiz düşüş.** Bir Etkinlik projesinde (başka yoldan girilmiş) dilim varsa, Genel'deki "Dilimler & kesintiler →" bağlantısı sette olmayan bir sekmeye gider ve sunucu kullanıcıyı sessizce Genel'e geri atar.
---

## 7. Finans Merkezi dışındaki finans ekranları

### 7.0 Kapsam, menü durumu ve giriş noktaları

**Kapsam dışı, arayüzden gizli:** `/Customers` (Cari), `/Reports/TrialBalance` (Mizan) ve `/Reports/CustomerStatement` (Cari ekstre). Menü kayıtları yoruma alınmış; adresle hâlâ açılıyorlar. Formlardaki **Müşteri/Cari alanı da gizli**. Değer yalnız gizli `CustomerId` alanıyla taşınıyor (fatura için karar tarihi 2026-11-14, gider/gelir için 2026-06-22).

**Menü durumu (PlatformNavigationResolver):** "Finans & Bütçe" çatısında yalnız **Finans Merkezi** var. Aşağıdaki sayfaların hiçbiri menüde değil:
- 2026-10-14'te Finans Merkezi'ne taşınanlar: Kasa & Banka, Kurlar, Proje Bütçesi.
- 2026-09-06'da "gömülenler": Yıl Sonu Değerleme, Mizan, Cari ekstre.

**Bu ekranların başka giriş noktaları:**
- **Makro Ekran (`/Makro`):** Masraf Yakala sayfası ile Gider, Gelir, Fatura ve Kasa Hareketi pencereleri.
- **Görev detayı Finans sekmesi:** Gider, Gelir ve Fatura pencerelerini `?TaskId=` ile açar.
- **Proje detayı:** "Harcama ekle" düğmesi gider penceresini açar.
- **PWA kısayolu:** "Masraf Ekle", `/Expenses/Capture` adresine gider.
- **İçe/Dışa Aktarma Çalışma Alanı (`/DataTransfer`):** bütün içe aktarma pencereleri ve "tüm parametreler" aktarımları.
- **Her "Excel'e aktar" düğmesi:** yanına küçük bir menü eklenir ("CSV'ye aktar", "Tüm aktarımlar").

---

### 7.1 Faturalar — `/Invoices`

**1. Genel**
- **Amaç:** satış ve alış faturaları. Üst başlık "Faturalar", alt satır "Satış ve alış faturaları" (uygulama başlığına yazılır, sayfada tekrarlanmaz).
- **İzin:** `Invoices.Default`.
- **Menüde yok.** Ulaşma yolları:
  - Finans Merkezi "Son İşlemler" fatura satırı (`/Invoices?invoiceId=…`, liste o faturayı seçili açar).
  - Finans Merkezi Faturalar sekmesindeki "Faturalar sayfasında aç".
  - Geciken fatura bildirimi.
- **Finans Merkezi bu sayfayı gömüyor.** "Faturalar" sekmesi (`_PanelInvoices.cshtml`) aynı master-detail iskeletini ve **aynı `/Pages/Invoices/index.js`'i** kullanıyor. Tek fark: `data-project-id` doluysa liste sunucuda o projeye süzülüyor. Gömülü sürümün farkları:
  - "Yeni fatura" ve "Excel'den içe aktar" düğmeleri yok.
  - Başlık satırı "Faturalar" + proje çipi + "Faturalar sayfasında aç". Bu bağlantı `Invoices.Create` iznine bağlı ve proje bağlamını düşürüyor.
  - Host kapsamında betik yüklenmiyor.

**2. Yerleşim (master-detail; masaüstünde iki sütun: liste 300–380px + detay)**
- **Üst eylemler** (`Invoices.Create` iznine bağlı): "Excel'den içe aktar" (ikincil) ve **"Yeni fatura"** (birincil).
- **Liste araç çubuğu:**
  - Arama kutusu "Fatura no ara...". Fatura no ve müşteri adında arar; müşteri gizli olduğu halde aramaya giriyor. 250 ms gecikmeli, istemcide çalışır.
  - Durum hapları: **Tümü** (varsayılan) · Gönderildi · Ödendi · Gecikmiş · Taslak. İptal hapı yok.
  - İpucu metni: "Durum ödemelere göre otomatik belirlenir: kayıt Taslak olarak açılır, ödeme girildikçe Gönderildi, ödenen tutar genel toplamı karşılayınca Ödendi olur."
  - Hapların sonuna "Excel'e aktar" eklenir. Proje, durum ve arama dosyaya aynen geçer.
- **Liste öğesi:**
  - Solda ok ikonu: aşağı ok sarı = Alış, yukarı ok mavi = Satış.
  - Başlık: fatura no ya da "(numarasız)".
  - Alt satır: "Satış/Alış · {müşteri ya da proje} · {tarih}".
  - Sağda: kalın "toplam + para birimi" ve durum çipi.
  - Sıralama: fatura tarihi, yeniden eskiye. Sayfa boyu 200; "Daha fazla yükle" sonraki sayfayı ekler.
  - Alt bilgi: "{n} fatura" (+ " · {yüklenen} / {toplam} yüklendi").
- **Durumlar:**
  - Yükleniyor: 6 iskelet satır, alt bilgide "Yükleniyor…".
  - Boş: "Eşleşen fatura bulunamadı" + süzgeç varsa "Filtreleri temizle".
  - Yükleme hatası: kart "Faturalar yüklenemedi." + "Tekrar dene".
- **Detay boş durumu:** "Detaylarını görmek için soldaki listeden bir fatura seçin." Masaüstünde ilk fatura kendiliğinden seçilir. Yüklenirken: "Fatura yükleniyor…".

**3. Detay paneli (satır eylemlerinin yeri)**
- **Başlık:** fatura no + durum çipi; altında müşteri ya da proje adı.
- **Eylemler:**

| Etiket | Koşul / izin |
|---|---|
| Gider kaydı oluştur | Yalnız Alış faturası, karşılığı olan gider yoksa, `Expenses.Create`. Gider penceresini faturadan dolu açar. İpucu var. |
| Düzenle | Durum ≠ İptal, `Invoices.Edit` |
| Ödeme Ekle (+ ipucu) | Durum ≠ Ödendi, `Invoices.Edit` |
| Yazdır | Herkes; yeni sekmede `/Invoices/Print/{id}` |
| PDF indir | Herkes |

- **Bilgi satırı (4 kutu):** Düzenleme (fatura tarihi) | Vade | Yön (ipuçlu: "Satış = sizin kestiğiniz fatura; sizin için alacak doğurur. Alış = size kesilen fatura; borcunuzu oluşturur.") | Ödenen.
- **Bütçe kalemi:** kalemin "kod · ad" gösterimi ya da "Bağlı değil".
- **Kalem tablosu:** Kalem | Adet | Birim | Tutar. Kalem yoksa "Kalem yok".
- **Toplam bloğu (sağda, 280px):**
  - Ara toplam
  - "KDV (%{oran})" + istisna varsa " · istisna: {belge no}"
  - **Genel Toplam**
  - **Kalan gösterilmez.**
- **Notlar:** varsa.
- **Detayda olmayanlar:** ödeme geçmişi (servis ucu `GetPaymentsAsync` var ama arayüz kullanmıyor), bağlı belgeler (yalnız Düzenle penceresinde görünüyor). Toplu eylem yok, silme yok.
- **Bildirimler (aynen):** "Fatura başarıyla oluşturuldu." · "Tahsilat kaydedildi." · "Fatura güncellendi." · "Gider kaydı oluşturuldu."

**4. Dışa aktarma (Excel/CSV)**
- Sütunlar: Fatura no, Yön, Proje, Müşteri, Tarih, Son tarih, Durum, KDV %, Toplam, Ödenen, Kalan, Para birimi, Bütçe kalemi.
- 10.000 satırda kesilirse not: "Liste ilk {0} satırla sınırlandı. Tamamı için filtreyi daraltın."

#### Durum makinesi (fatura)

| Durum | Çip | Nasıl oluşur | Açtığı eylemler |
|---|---|---|---|
| Taslak (0) | nötr | Oluşturulunca; hiç ödeme yok | Düzenle (tam: yön dahil), Ödeme Ekle |
| Gönderildi (1) | marka | Ödeme var ama toplamın altında. **Pratikte "kısmen ödendi" demek; gerçek bir "gönder" adımı yok.** | Düzenle (yön kilitli), Ödeme Ekle |
| Ödendi (2) | pozitif | Ödenen ≥ genel toplam | Düzenle (yön kilitli); Ödeme Ekle gizli |
| İptal (3) | negatif | **Hiçbir arayüz ya da servis yolu yok.** Varlıkta yalnız koruma için duruyor. | Düzenle gizli; "Ödeme Ekle" kodda yine görünür |
| Gecikmiş (4) | uyarı | Saklanmaz, okunurken hesaplanır: vade geçmiş, tamamı ödenmemiş, iptal değil. Taslak ya da Gönderildi'nin üstüne biner. | Alttaki durumunkiler |

- Düzenlemede tutar değişirse durum ödemelerden yeniden hesaplanır.
- Fatura silme yok; `Invoices.Delete` izni tanımlı ama kullanılmıyor.

#### Pencere: "Yeni Fatura Oluştur" (`Invoices/CreateModal`, Büyük)
Sunucu kuralı: `Invoices.Create`. Kayıttan sonra alış faturasının gider karşılığı yoksa uyarı çıkar (aşağıda **Çapraz uyarı**).

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama / koşul / yardım |
|---|---|---|---|---|
| Proje | seçici | evet | **Boş seçenek yok → ilk proje seçili gelir**; görevden açıldıysa görevin projesi | Projede KDV istisna belgesi varsa ve fatura tarihinde geçerliyse "KDV istisna belge no" önden dolar |
| Bütçe kalemi *(isteğe bağlı)* | seçici | hiçbir zaman | Görevin "Bütçe bağı" | Proje seçilince görünür; seçenekler "— Kalem seçin —" ya da "— Bu projede kalem tanımlı değil —", sonra "kod · ad" |
| Yön | radyo: **Satış Faturası** / Alış Faturası | evet | Satış | — |
| Fatura No | metin | evet | boş | Boşsa: "Fatura numarası boş bırakılamaz." Kurumda tekil (veritabanı indeksi); çift numara için kullanıcıya özel ileti bulunamadı (kodda belirsiz) |
| Fatura Tarihi | tarih | evet | bugün | — |
| Son Ödeme Tarihi | tarih | evet | bugün + 15 gün | — |
| KDV Oranı (%) | sayı (tutar maskesi) | — | 20 | ≥ 0 |
| Fiyatlar KDV dahil | onay kutusu | — | kapalı | İşaretliyse birim fiyat kuruşa yuvarlanarak KDV'den arındırılır |
| KDV istisna belge no | metin, en çok 128 | — | proje belgesinden ya da boş | Yer tutucu "İstisna yoksa boş bırakın". Yardım: "Doluysa fatura KDV'siz kesilir (KDV %0)." |
| Notlar | metin alanı (2 satır) | — | — | Yer tutucu "İsteğe bağlı not..." |
| Belge ekle (fatura, fiş, dekont) | çoklu dosya | — | — | Yalnız belge yükleme izni ve paketi olana görünür (aşağıda **Belge ekleme**) |
| **Fatura Kalemleri** bölümü + "Yeni Kalem Ekle" | tekrarlanan satır | en az 1 | 1 satır | Her satır: Açıklama (zorunlu) · Miktar (zorunlu, varsayılan 1, > 0) · Birim Fiyat (zorunlu, ≥ 0) · çöp kutusu "Kalemi sil". Son satır silinmek istenirse uyarı: "En az bir fatura kalemi gereklidir." |
| Para birimi | — | — | **gizli, TRY** | "Çoklu para birimi gizlendi — tüm faturalar TRY." |
| Görev | — | — | gizli (görevden açıldıysa dolu) | Görünür görev seçici yok |

**Hesaplanan özet satırı** (sağ altta, küçük, canlı güncellenir):
- Metin: "Ara toplam X ₺ · KDV Y ₺ · Genel toplam Z ₺". İstisna varsa "KDV (istisna)".
- Hesap:
  1. İstisna varsa oran 0 sayılır.
  2. "KDV dahil" işaretliyse her birim fiyat önce `round(fiyat × 100 / (100 + oran), 2)` ile arındırılır.
  3. Ara toplam = Σ miktar × fiyat; Genel toplam = ara toplam × (1 + oran / 100).
- Aynı hesap sunucuda yapılır; fiyatlar KDV hariç saklanır.

#### Pencere: "Faturayı Düzenle" (`Invoices/EditModal`, `Invoices.Edit`)
Yeni fatura penceresiyle aynı alanlar. Farklar:
- **Proje** düzenlenemez (disabled metin). Para birimi düzenlenemez.
- **Fiyatlar KDV dahil** her açılışta boş gelir (kayıtlı fiyatlar zaten KDV hariç).
- **Taslak değilse** (ödeme girilmişse) Yön radyoları kilitlenir ve şu bilgi kutusu çıkar: "Bu faturaya ödeme girilmiş: fatura yönü değiştirilemez. Tutar değişirse ödeme durumu yeniden hesaplanır."
- **Belge ekle** alanında bağlı belgeler indirme bağlantısı olarak listelenir; kaldırma yok.
- **Kalemler** mevcut satırlarla dolu gelir.

#### Pencere: "Fatura Tahsilatı" (`Invoices/PaymentModal`; sunucu `Invoices.Edit`)

| Etiket | Tür | Zorunlu | Varsayılan | Not |
|---|---|---|---|---|
| Tutar | tutar maskesi | > 0 | **faturanın GENEL TOPLAMI (kalan değil)** | Hata: "Ödeme tutarı sıfırdan büyük olmalıdır." Fazla ödeme bilerek engellenmiyor (avans/kısmi). |
| Ödeme Yöntemi | serbest metin | — | "Havale" | — |
| Referans No | metin | — | boş | **Aynı referansla ikinci kayıt sessizce yok sayılır** (çift kayıt koruması); kullanıcıya bir şey söylenmez |
| Tahsilatın Girdiği Kasa (boş = sadece fatura işaretlenir) | seçici | — | "— Kasaya işlenmesin —" | Seçenekler: aktif kasalar "Ad (PB)". Yardım: "Kasa seçilirse otomatik giriş hareketi oluşur." Kur yoksa: "Tahsilat tarihi için kur bulunamadı. Lütfen ilgili kuru tanımlayın." |
| Belge ekle (dekont) | dosya | — | — | Faturaya bağlanır |

- **Ödeme tarihi alanı yok;** sunucu "şimdi" yazar.
- Pencerede faturanın toplamı, ödenen ve kalan tutarı gösterilmiyor.
- Pencere kasa listesini kasa servisinden okuyor (`CashAccounts.Default` izni ister). Kasa izni olmayan fatura düzenleyicisinde pencere açılmayabilir (gözlem; doğrulanmadı).

#### Çapraz uyarı (FIN-05; `apya-finance-modal.js`)
Kayıt her durumda yapılmıştır; uyarı engellemez. Sayfa yenilense de 2 dakika saklanır.
- **Alış faturası kaydedildi, karşılığı olan gider yok →** onay penceresi, başlık "Karşılık bulunamadı":
  "Bu alış faturasının karşılığı olan bir gider kaydı bulunamadı. Şimdi gider kaydını girmek ister misiniz?"
  Evet → gider penceresi faturadan dolu açılır.
- **Projeye yazılan giderin alış faturası yok →** uyarı:
  "Bu giderin karşılığı olan bir alış faturası bulunamadı. Fatura geldiyse Faturalar ekranından girmeyi unutmayın."

#### Yazdır (`/Invoices/Print/{id}`) ve PDF (`?handler=Pdf`, QuestPDF)
**HTML Yazdır sayfası**
- Uygulama kabuğu yok, ayrı bir sayfa. Bootstrap CDN'den yükleniyor. Ortada en çok 800px beyaz "kâğıt".
- Üstte (yazdırmada gizlenir): "PDF indir", "Yazdır".
- **Başlık:**
  - Sol (kesen kurum, Kurum Profili'nden): ticari unvan ya da kiracı adı · adres · "{Vergi dairesi} V.D. · {vergi no}" · kurumsal e-posta. Host bağlamında yalnız "APYA".
  - Sağ: büyük "FATURA" · Tarih · Fatura No · Vade · durum damgası (Ödendi yeşil / Gecikmiş kırmızı / diğerleri gri + durum adı).
- **Bilgi:** "Müşteri" (yalnız eski kayıtta ad varsa) · "Proje: X".
- **Tablo** (zebra): Açıklama | Miktar | Birim Fiyat | Tutar.
- **Toplamlar (300px):**
  - Ara Toplam
  - KDV (%x)
  - "KDV istisnası · Belge no: …"
  - **Genel toplam** (büyük, kırmızı, para birimiyle)
  - Ödeme varsa: Ödenen (yeşil), **Kalan**
- **Altbilgi:** "Bu belge bilgi amaçlıdır; e-fatura ya da e-arşiv fatura yerine geçmez."
- **Notlar basılmıyor.**

**PDF**
- A4, 1,5 cm kenar boşluğu, 10 pt.
- Başlık: aynı kurum bloğu solda; sağda "FATURA", Fatura no, Tarih, Vade, Durum.
- Gövde: Müşteri (varsa), Proje; tablo Açıklama | Miktar | Birim fiyat | Tutar.
- Toplam (260 pt): Ara toplam / KDV tutarı (%x) / istisna (8 pt gri) / **Genel toplam** / Ödenen / **Kalan**. **Notlar basılıyor** (9 pt).
- Altbilgi: uyarı metni ortada; sağda "Oluşturma: gg.aa.yyyy SS:dd" (italik, 7 pt).
- Dosya adı: `Fatura_{no}.pdf`.
- **İkisinde de faturanın yönü (Satış/Alış) yazmıyor.** Alış faturası da kendi kurumunuz "kesen" olarak basılıyor.

#### İçe aktarma: "Faturaları Excel'den içe aktar" (`Invoices/ImportModal`, `Invoices.Create`)
Ortak pencerenin akışı aşağıda (**Ortak içe aktarma penceresi**). Ekrana özel ipucu:
"Aynı fatura numaralı satırlar tek faturanın kalemleridir. Birim fiyat KDV hariçtir (miktar boşsa 1); kalem sütunları boşsa Toplam KDV dahil tek kalem sayılır. KDV boşsa %20, son tarih boşsa fatura tarihi. Tahsilat ve durum alınmaz: faturalar ödenmemiş açılır, tahsilatı ekrandan girin."

- **Sütunlar:** Fatura no* · Yön (Satış/Alış) · Proje* (ad ya da kod) · Tarih* · Son tarih · KDV % · Para birimi (her 3 harfli kod geçer, boşsa TRY) · Bütçe kalemi · Kalem · Miktar · Birim fiyat · Toplam · KDV istisna belge no · Not.
- **Ekrana özel hatalar:**
  - "{0} \"{1}\" dosyada başka {2} ile de geçiyor; aynı faturanın satırları aynı projede olmalı."
  - "{0} ya da {1} doldurulmalı."
  - "Bir faturanın satırları ya hep {0} ya hep {1} kullanmalı."
  - "{0}, {1} tarihinden önce olamaz."
  - "{0} 0 ile 100 arasında olmalı."
  - Mevcut fatura numarası: "{0}: \"{1}\" zaten kullanılıyor."
- Kalem açıklaması boşsa "{no} tutarı" yazılır.

#### Tam parametreli içe aktarma: "Faturaları tüm parametreleriyle içe aktar" (`Invoices/FullImportModal`)
- **Kim, nereden:** yalnız host bağlamında ve `DataTransfer.FullParameters` izniyle (+ `Invoices.Create`). Yalnız `/DataTransfer` çalışma alanından açılır ("Faturalar (tüm parametreler)"). Aynı yerden dolu çıktı indirilebilir (`?handler=Export`).
- **Sıradan içe aktarmadan farkları:**
  - Kiracı seçilerek yazar.
  - Yalnız yeni kayıt açar. Çıktıdaki mevcut satırlar başvuru içindir; değiştirilirse "…mevcut finans kaydı bu yolla değiştirilemez…" hatası çıkar.
  - Fatura başına tek satır; kalemler tek hücrede.
  - Şablonda "Alan rehberi" sayfası var (Sütun | Zorunlu | Nasıl doldurulur | Geçerli değerler).
  - Başarı iletisine özet eklenir: "Yeni: {0} · Güncellenen: {1} · Değişmeyen: {2}".
- **Sütunlar:** Kayıt kimliği · Kiracı · Fatura numarası* · Fatura yönü · Proje* · Görev (GRV-12; proje boşsa görevden gelir) · Bütçe kalemi · Tarih* · Vade tarihi · KDV oranı (%) · Fiyatlar KDV dahil (Evet/Hayır) · KDV istisna belge no · Para birimi · Not · Kalemler*.
- **Kalemler hücresi:** "Açıklama | Miktar | Birim fiyat" girdileri `;` ile ayrılır. Örnek: "Danışmanlık | 2 | 1500,50; Yol | 1 | 300".
- **Pencere ipucu (aynen):** "Yalnız sistem yöneticisi içindir ve yalnız yeni fatura açar. Kayıt kimliği boş satır Kiracı sütunundaki hesaba yazılır. Çıktıdaki mevcut satırlar başvuru içindir, değiştirilirse dosya reddedilir. Fatura numarası hesapta tekildir. Tahsilat dosyadan alınmaz, ekrandan girilir. Bir dosyada en fazla 1000 satır yüklenir."

---

### 7.2 Giderler — `/Expenses`

**1. Genel**
- **Amaç:** proje ve genel giderler (alt satır "Proje ve genel giderler").
- **İzin:** `Expenses.Default`.
- **Menüde yok.** Ulaşma yolları:
  - Finans Merkezi Gelir-Gider sekmesi "Gider ekle": proje seçili değilse ya da oluşturma izni yoksa bu sayfaya bağlantı; proje seçiliyse pencereyi yerinde açar.
  - "Son İşlemler" (projesiz): yalın `/Expenses`. Kayda odaklanmaz.

**2. Yerleşim**
- `abp-card` içinde kart başlığı **"Giderler"** (başlık sayfada ikinci kez yazılıyor).
- **Sağdaki düğmeler:**
  - "Excel'e aktar"
  - "Excel'den içe aktar" (`Expenses.Create`)
  - **"Masraf Yakala"** (kamera ikonu, `/Expenses/Capture`'a gider; izin kontrolü yok). İpucu: "Fiş/fatura fotoğrafını çekip ona bakarak masraf girmek için: fotoğraf formun üstünde durur, tutarı, tarihi ve tedarikçiyi siz girersiniz. Sahada ardışık masraf girmek için tasarlandı."
  - **"Yeni Gider"** (birincil; arayüzde izin kontrolü yok).
- Özet kutusu yok, ek süzgeç yok; yalnız DataTables'ın kendi arama kutusu.

**3. Tablo (DataTables, sunucu tarafı sayfalama ve sıralama)**
- Varsayılan sıralama: Tarih azalan. Sayfa boyu ABP varsayılanı (kodda belirtilmemiş).

| Sütun | Tür / biçim |
|---|---|
| Aksiyonlar | Açılır menü: **Düzenle** (`Expenses.Edit`), **Sil** (`Expenses.Delete`) |
| Tarih | tr-TR kısa tarih, boşsa "-" |
| Başlık | metin |
| Kategori | Genel/Diğer · Ofis · Seyahat · Personel · Malzeme · Hizmet · Vergi |
| Tutar | sağa yaslı, para birimiyle (`apya.money.format`) |
| Kasa | kasa adı ya da "-" |

- **Görünmeyenler:** proje, bütçe kalemi, belge, ₺ defter karşılığı (bunlar Finans Merkezi Gelir-Gider tablosunda var).
- **Sil onayı (aynen):** "Gider ve bağlı kasa hareketi silinecek: {başlık}?" (pencere başlığı ABP varsayılanı). Başarı: "Gider silindi."
- **Excel/CSV sütunları:** Tarih, Başlık, Kategori, Tutar, Para birimi, Kasa, Proje, Bütçe kalemi, Açıklama. İçe aktarma şablonuyla aynı olduğu için geri yüklenebilir.

#### Pencere: "Yeni Gider" (`Expenses/CreateModal`) ve "Gideri Düzenle" (`Expenses/EditModal`)

| Etiket | Tür | Zorunlu | Varsayılan | Doğrulama / koşul |
|---|---|---|---|---|
| Başlık | metin, en çok 200 | evet | — (faturadan açılırsa "Fatura {no}") | "Gider başlığı boş bırakılamaz." |
| Tutar | tutar maskesi | ≥ 0,01 | — (faturadan: genel toplam) | — |
| Tarih | tarih | — | bugün (faturadan: fatura tarihi) | Proje seçiliyse projenin başlangıç–bitiş aralığına sınırlanır. İleti: "Seçilen tarih, projenin tarih aralığı dışında (gg.aa.yyyy – gg.aa.yyyy). Lütfen aralık içinde bir tarih seçin." |
| Para birimi | seçici | evet | TRY | TRY (₺) / EUR (€) / USD ($) / GBP (£). Kasanın para biriminden farklıysa ve kur yoksa: "Kaydın para birimi ile seçilen kasanın para birimi farklı ve bu tarih için bir döviz kuru bulunamadı…" |
| Kategori | seçici | — | Genel / Diğer | Genel / Diğer · Ofis / Kira · Seyahat / Ulaşım · Personel / Maaş · Malzeme / Sarf · Hizmet / Danışmanlık · Vergi / Harç |
| Kasa (isteğe bağlı — boşsa kasaya işlenmez) *(düzenlemede yalnız "Kasa")* | seçici | — | "— Kasaya işlenmesin —" | "Ad (PB)" |
| Proje (isteğe bağlı) | seçici | — | "— Proje yok —" (Finans Merkezi ya da görevden açılınca önden seçili) | — |
| Bütçe kalemi | seçici | **projenin kalemi varsa zorunlu** | görevin bütçe bağı | Proje seçilmeden gizli. Etiket yanında çip: "kalan 12.345,00" ya da kırmızı "asim 1.234,00" (Türkçe karakter yok). Sunucu iletisi: "Bu projede bütçe kalemleri tanımlı; kaydın hangi kaleme yazılacağını seçin." |
| Görev (isteğe bağlı) | seçici | — | "— Görev yok —" | Projede görev yoksa gizli |
| Açıklama | metin, en çok 500 | — | — | — |
| Belge ekle (fatura, fiş, dekont) | çoklu dosya | — | — | Aşağıda **Belge ekleme** |

- Pencere küçük boy; müşteri gizli alanla taşınıyor.

#### İçe aktarma
- **"Giderleri Excel'den içe aktar":** ipucu "Para birimi boşsa kasanın para birimi kullanılır."
  - Sütunlar: Tarih* · Başlık* · Kategori · Tutar* · Para birimi · Kasa · Proje · Bütçe kalemi · Açıklama.
  - Hatalar: "Bu projenin bütçe kalemleri var; {0} doldurulmalı." · "{0} yalnız {1} doluyken yazılabilir."
- **"Giderleri tüm parametreleriyle içe aktar"** (yalnız sistem yöneticisi, `/DataTransfer`).
  - Sütunlar: Kayıt kimliği, Kiracı, Başlık*, Tarih*, Kategori, Tutar*, Kasa, Para birimi, Proje, Görev, Bütçe kalemi, Açıklama.
  - **Fark:** aynı kiracıda başlığı, günü, tutarı, para birimi ve kasası aynı olan yeni satır reddedilir. İleti: "Bu hesapta aynı başlık, tarih, tutar, para birimi ve kasayla kayıt var ya da satır dosyada tekrar ediyor. Gerçekten ayrı bir kayıtsa başlığını farklı yazın."

---

### 7.3 Masraf Yakala (mobil hızlı gider) — `/Expenses/Capture`

- **Teknik:** React adası (`dynamic-assets/src/expense/…`), kenardan kenara; uygulama içeriğinin dolgusunu yer.
- **İzin:** sayfa yalnız oturum ister; kaydı `Expenses.Create` yapar (Makro bunu ister).
- **Giriş:** Giderler sayfasındaki düğme, PWA kısayolu "Masraf Ekle", Makro Ekran.

**Akış: çekim → form → başarı → (çekim | çıkış)**
- **Üst şerit (yapışkan):** "Masraf Yakala".
  - Çevrimdışıysa sarı çip "Çevrimdışı".
  - Kuyrukta kayıt varsa "{n} bekliyor" düğmesi (dokununca gönderir).
  - Tema düğmesi.
- **Çekim alanı:**
  - Tüm alan tek dokunma hedefi; sürükle-bırak çalışır.
  - Kamera ikonu, "Faturayı çek", açıklama: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. Fotoğraf formun üstünde görünür; tutarı, tarihi ve tedarikçiyi ona bakarak girersin."
  - Düğme **"Kamerayı Aç"**. Dosya `image/*`, arka kamera açılır.
  - Hatalar: "Resim dosyası gerekli" / "Lütfen JPG/PNG/HEIC fatura görseli seç." · "Dosya çok büyük" / "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
- **Form:** mobilde alttan açılan sayfa, tablet ve masaüstünde yan panel.
  - Başlık "Masraf detayları", açıklama "Fişteki bilgileri girin ve gönderin", iç başlık "Masraf Detayları".
  - Bütün dokunma hedefleri ≥ 44 px. Form her yeni fotoğrafta boş açılır (fiş okuma yok).
  - Çevrimdışıysa sarı kutu: "Bağlantı yok — kayıt **cihazda saklanır**, bağlantı gelince gönderilir."
  - Fotoğraf önizlemesi (en çok 256 px yükseklik); altında üç metinden biri:
    - Belge izni var, çevrimiçi: "Fotoğraf kayda fiş olarak eklenir; Belgeler'de de görünür."
    - Çevrimdışı: "Bağlantı yokken fotoğraf kayda eklenmez. Gider gönderildikten sonra fişi gider düzenleme penceresinden ekleyebilirsin."
    - Belge izni yok: "Fotoğraf yalnız bu ekranda görünür, kayda eklenmez."

| Etiket | Tür | Zorunlu | Varsayılan | Not |
|---|---|---|---|---|
| Proje | seçici | — | "— Projesiz —" | En çok 200 proje |
| Bütçe kalemi | seçici | kalem tanımlıysa * | "— Kalem seçin —" | Yalnız projenin kalemi varsa görünür. **Seçilmezse "Gönder" sessizce hiçbir şey yapmaz.** |
| Kasa / banka | seçici | — | "— Kasaya işlenmesin —" | — |
| Tutar | büyük tutar girişi + para birimi seçici | * | — | Para birimi **TRY / USD / EUR** |
| Tarih | tarih | * | bugün | Proje tarih aralığı denetimi yok |
| Tedarikçi | metin | * | — | Yer tutucu "örn. Migros A.Ş."; **kayda Başlık olarak gider** |
| Kategori | arama kutulu seçici | — | "Kategori seç" (boşsa Genel / Diğer) | Masaüstü formuyla aynı etiketler |
| "Daha fazla alan" / "Daha az alan" → Not | metin alanı | — | — | Kayda Açıklama olarak gider |

- Görev alanı yok.
- **Form altbilgisi:** "Toplam: {tutar}" · "İptal" · **"Gönder"** (yüklenirken "Gönderiliyor...").
- **Bildirimler (aynen):**
  - Kuyruğa alındı: "Kuyruğa alındı" / "Bağlantı yok — bağlantı gelince otomatik gönderilecek."
  - Fiş eklenemedi: "Masraf kaydedildi, fiş eklenemedi" / "{hata} Fişi gider düzenleme penceresinden ekleyebilirsin."
  - Başarı: "Masraf kaydedildi" / "{tutar} — {tedarikçi} · fiş eklendi".
  - Hata: "Kayıt başarısız" / alan hataları ya da "Tekrar deneyebilirsin."
  - Kuyruk gönderildi: "{n} kayıt gönderildi" / "{r} kayıt hâlâ kuyrukta." ya da "Kuyruk boşaldı."
  - Kuyruk gönderilemedi: "Kuyruk gönderilemedi" / "{r} kayıt cihazda bekliyor."
- **Başarı ekranı:** onay ikonu, "Masraf gönderildi", "{tutar} · {tedarikçi}", ardından "Onaya gitti. Bildirim ile durumu takip edebilirsin." Düğmeler: "Bir tane daha çek", "Bitir" (`/Dashboard`'a gider). **1,5 saniye sonra kendiliğinden çekim ekranına döner.**
- **Çevrimdışı kuyruk:** cihazda (kiracı + kullanıcıya bağlı). Fotoğraf kuyruğa girmez.
- **Fiş ekleme:** gider kaydedildikten sonra ayrı istekle eklenir; yalnız kişinin kendi oluşturduğu gidere. Dosya adı "Fiş - {tedarikçi} - {tarih}.jpg".

---

### 7.4 Gelirler — `/Incomes`

**1. Genel**
- Kart başlığı **"Gelirler (Faturasız / Hibe)"**, alt satır "Faturasız gelir ve hibe kayıtları".
- Kart başlığında ek açıklama: "Hibe, bağış, faturasız nakit gelir. Kasa seçilirse otomatik kasa girişi oluşur."
- **İzin:** `Incomes.Default`. Menüde yok; Giderler'le aynı yollardan ulaşılır.

**2. Düğmeler**
- "Excel'e aktar", "Excel'den içe aktar" (`Incomes.Create`), **"Yeni Gelir"** (arayüzde izin kontrolü yok).
- İpucu (aynen): "Fatura kesmediğiniz gelirler için: hibe, bağış, nakit gelir. Kasa seçerseniz o kasaya giriş hareketi otomatik yazılır. DİKKAT: buraya girilen gelir, cari seçseniz bile cari bakiyesini değiştirmez — cari hesabı faturalar, tahsilatlar ve açılış kayıtları işler." Cari gizli olduğu halde metin cariden söz ediyor.

**3. Tablo** (Giderler ile aynı yapı)
- Aksiyonlar (Düzenle `Incomes.Edit`, Sil `Incomes.Delete`) | Tarih | Başlık | Kategori | Tutar | Kasa.
- Kategori etiketleri: Diğer · Hibe · Bağış · Faturasız Satış · Finansal.
- **Tutar para birimi olmadan biçimleniyor.**
- Kasa boşsa "— (tahsil edilmedi)".
- Sil onayı: "Gelir ve bağlı kasa hareketi silinecek: {başlık}?" → "Gelir silindi."
- Excel sütunları Giderler'deki gibi.

#### Pencere: "Yeni Gelir / Fon" ve "Geliri Düzenle"
Gider penceresiyle aynı alanlar ve kurallar (başlık en çok 200, açıklama en çok 500, tutar ≥ 0,01, proje tarih aralığı, koşullu bütçe kalemi, görev, belge ekle). Farklar:
- **Kasa etiketi:** "Giren Kasa (isteğe bağlı — boşsa tahsil edilmemiş)"; düzenlemede "Giren Kasa".
- **Kategori seçenekleri:** Diğer · Hibe · Bağış / Sponsorluk · Faturasız Satış / Nakit · Faiz / Finansal.
- **Görevden açılınca** bütçe kalemi önden seçilmiyor (giderde seçiliyor).
- Fatura çapraz uyarısı yok.

#### İçe aktarma
- **"Gelirleri Excel'den içe aktar":** giderle aynı sütunlar ve aynı ipucu.
- **"Gelirleri tüm parametreleriyle içe aktar":** giderle aynı mantık; ipucu "…kasa seçiliyse kasa girişi oluşur…".

---

### 7.5 Kasa & Banka — `/CashAccounts`

**1. Genel**
- **Amaç:** hesaplar ve hareketler, çoklu para birimi (alt satır "Hesaplar ve hareketler · çoklu para birimi").
- **İzin:** `CashAccounts.Default`.
- **Menüde yok.** Ulaşma yolları:
  - Finans Merkezi hesap listesi boşken: "Henüz kasa/banka hesabı yok. Kasa & Banka'dan ekleyin."
  - Finans Merkezi "Son İşlemler"deki **transfer** satırları.
  - Başka uygulama içi bağlantı bulunamadı.
  - Adreste `?account={id}` varsa o kart seçili açılır.

**2. Yerleşim**
- **Üst eylemler:** "Yeni Kasa Ekle" (`CashAccounts.Create`, ikincil) ve **"Transfer"** (birincil; arayüzde izin kontrolü yok, sunucu `CashMovements.Create` ister).
- **Transfer ipucu:** "İki hesap arasında para aktarır: kaynak hesaba çıkış, hedef hesaba giriş hareketi olarak tek işlemde yazılır. Para birimleri farklıysa kayıtlı kurla çevrilir; kur bulunamazsa işlem yapılmaz."
- **Konsolide kartı** (degrade, beyaz yazı):
  - "Konsolide Bakiye (₺ karşılığı)" + ipucu: "Her hesabın bakiyesi, o para birimi için kayıtlı EN GÜNCEL kurla ₺'ye çevrilip toplanır. Kuru hiç girilmemiş bir para birimi toplama 0 olarak katılır — eksik görünüyorsa Kurlar sayfasından kur ekleyin."
  - Büyük "₺{kuruşsuz tutar}"; sağda "{n} hesap · {m} para birimi".
- **Hesap kartları:**
  - Mobilde 2, masaüstünde 4 sütun; bakiyeye göre çoktan aza sıralı.
  - Kart içeriği: tür ikonu (nakit / banka / kredi kartı) · para birimi çipi · banka adı ya da kasa adı · IBAN, yoksa şube, yoksa ad · bakiye ("N2 ₺" ya da "N2 USD").
  - Kart tıklanınca seçilir (vurgulanır).
  - **Kartta Düzenle/Sil eylemi yok.**
- **Boş durum:** "Henüz kasa/banka hesabı yok." / "Nakit ve banka hareketlerini izlemek için ilk hesabı ekleyin." + "Yeni Kasa Ekle" (izin varsa).
- **Hareketler kartı** (yalnız hesap varsa):
  - Başlık "Hareketler", alt satır "Bir hesap kartı seçin" (seçince hesabın adı).
  - Sağda "Excel'e aktar" (`CashMovements.Default`) ve "Yeni Hareket" (`CashMovements.Create`). İkisi de seçim yapılana kadar devre dışı.
  - Seçim yokken: "Hareketleri görmek için yukarıdan bir hesap seçin."

**3. Hareket tablosu**
- Son 200 hareket, tarih azalan; sayfalama yok.

| Sütun | Biçim |
|---|---|
| Tarih | tr-TR |
| Yön | çip: "Giriş" (pozitif) / "Çıkış" (negatif) |
| Açıklama | metin; boşsa transferde "Transfer", diğerlerinde "—" |
| Tutar | 2 ondalık, **para birimi yok** |
| (eylemler) | kalem "Hareketi düzenle" / çöp "Hareketi sil". **Yalnız elle girilmiş harekette** (`CashMovements.Edit` / `.Delete`) |

- Fatura, gider, gelir ve transfer kaynaklı satırlarda eylem yok ve neden olduğu yazmıyor. Sunucu iletisi: "Bu hareket bir gider, gelir, fatura ya da transfer kaydından oluştu; buradan düzenlenemez veya silinemez. Değişikliği kaynak kayıt üzerinden yapın."
- Boş: "Bu hesapta henüz hareket yok."
- Yükleme hatası: "Hareketler yüklenemedi." + Tekrar dene. Bakiye tazeleme düşerse: "Bakiyeler güncellenemedi. Güncel değerler için sayfayı yenileyin."
- Sil onayı (aynen): "Hareket silinecek?" → "Hareket silindi."
- Diğer bildirimler: "Hareket kaydedildi." / "Hareket güncellendi."
- **Excel sütunları:** Tarih, Yön, Açıklama, Tutar, Para birimi, Kaynak (Elle / Fatura / Gider / Transfer / Gelir). Çalışma sayfasının adı = kasa adı.

#### Pencere: "Yeni Kasa Ekle" / "Kasayı Düzenle" (`CashAccounts/CreateModal`, `EditModal`)
**Kasayı Düzenle'yi açan bir arayüz yok.** Kod yorumu da bunu söylüyor: "…mevcut EditModal doğrudan hesap id'siyle açılabilir (ileride: kart üstü aksiyon menüsü)."

| Etiket | Tür | Zorunlu | Varsayılan | Not |
|---|---|---|---|---|
| Kasa Adı (Örn: Ana Kasa, Ziraat TL) *(düzenlemede "Kasa Adı")* | metin, en çok 200 | evet | — | "Kasa adı boş bırakılamaz." |
| Kasa Türü | seçici | — | Nakit | Nakit / Banka / Kredi Kartı |
| Para Birimi * | seçici | evet | TRY | **₺ TRY / $ USD / € EUR (GBP yok).** Hareketi olan kasada değiştirilirse: "Bu kasada {n} hareket var; para birimi değiştirilemez…" |
| Açılış Bakiyesi | sayı | — | 0 | İpucu: "Hesabın bu sistemde takibe başladığı andaki mevcut tutarı. Bakiyeye doğrudan eklenir, kasa hareketi olarak listelenmez — bu yüzden Hareketler sekmesinde görünmez." Düzenlemede: "…Değiştirirseniz geçmiş hareketler aynı kalır ama güncel bakiye kayar." |
| Banka Adı | metin, en çok 200 | — | — | — |
| Şube | metin, en çok 200 | — | — | — |
| IBAN | metin, en çok 34 | — | — | Biçim denetimi yok |
| Açıklama | metin, en çok 500 | — | — | — |
| Aktif | onay kutusu | — | açık | Pasif kasa listeden kaybolur; geri açacak bir arayüz yok |

- Kayıttan sonra sayfa tamamen yenilenir.

#### Pencere: "Yeni Kasa Hareketi" / "Kasa Hareketini Düzenle" (`CashMovements/…`)

| Etiket | Tür | Zorunlu | Varsayılan | Not |
|---|---|---|---|---|
| Kasa | seçici (aktif kasalar, "Ad (PB)") | evet | seçili kart; Makro'dan açılırsa ilk kasa | Boş seçenek yok |
| Yön | seçici | — | Giriş | "Giriş (Tahsilat)" / "Çıkış (Ödeme)" |
| Tutar | tutar maskesi | ≥ 0,01 | — | — |
| Tarih | tarih | — | bugün | — |
| Açıklama | metin, en çok 500 | — | — | — |

#### Pencere: "Hızlı Transfer" (sayfaya gömülü Bootstrap penceresi, en çok 420 px; aynı bileşen Finans Merkezi Kasa sekmesinde de var)
- **Gönderen** (seçici, "Ad · PB  (bakiye)") · **"Yön değiştir"** (yuvarlak takas düğmesi) · **Alıcı** (varsayılan ikinci hesap) · **Tutar** (başında gönderenin para birimi; yer tutucu "0,00").
- **Kur ipucu:** "Çevrim kuru uygulanır · 1 USD ≈ x TRY" ya da "Güncel kur bulunamadı.".
- Düğme **"Transferi onayla"** (gönderilirken "Gönderiliyor...").
- Uyarılar: "Gönderen ve alıcı kasa farklı olmalıdır." · "Geçerli bir tutar girin." Başarı: "Transfer tamamlandı."
- Sunucu hataları: "Pasif bir kasaya/kasadan transfer yapılamaz." · "Bu iki para birimi arasında güncel bir döviz kuru bulunamadı. Lütfen Kur Değerleme ekranından ilgili kuru tanımlayın."
- **Tarih ve açıklama alanı yok.**

---

### 7.6 Kurlar — `/ExchangeRates`

**1. Genel**
- Kart başlığı **"Kurlar"**, alt satır "Günlük ve manuel döviz kurları".
- **İzin:** `ExchangeRates.Default`.
- **Menüde yok.** Ulaşma yolu: Finans Merkezi "Kur köprüsü" panelindeki "Kurlar sayfası" ve "kur girilmemiş" bağlantıları.

**2. Düğmeler**
- "Excel'e aktar".
- `ExchangeRates.Create` izni olana:
  - Tarih kutusu ("TCMB kur tarihi (boşsa bugünkü bülten)").
  - **"TCMB'den Güncelle"** + ipucu: "Merkez Bankası bülteninden yalnız USD, EUR ve GBP için Döviz Alış kurunu çeker ve bültenin tarihiyle kaydeder (hafta sonu son iş gününün bülteni gelir). Tarih seçerseniz o günün arşiv bülteni çekilir. Aynı güne ait kayıt varsa üzerine yazılır; diğer para birimlerini elle eklemeniz gerekir. Dövizli bir projeniz varsa kurlar her iş günü kendiliğinden de eklenir (o günün kaydı yoksa)."
  - "Excel'den içe aktar".
  - **"Yeni Kur Ekle"** + ipucu: "Elle kur girişi. Anlaştığınız özel kuru buradan ekleyebilirsiniz; transferler ve ₺ karşılığı toplamlar her zaman o para birimi için EN GÜNCEL tarihli kaydı kullanır."
- TCMB sonrası bildirim: "{n} kur TCMB'den güncellendi."

**3. Tablo**
- Varsayılan sıralama: Tarih azalan.
- Sütunlar: Aksiyonlar (Düzenle `.Edit`, Sil `.Delete`) | Tarih | Kaynak Birim | Hedef Birim | Kur (2–6 ondalık) | Kaynak (çip: "Manuel" nötr / "TCMB" marka).
- Sil onayı: "Kur kaydı silinecek: USD/TRY?" → "Kur kaydı silindi."
- **Excel sütunları:** Tarih, Para birimi, Hedef para birimi, Kur, Kaynak.

#### Pencere: "Yeni Kur" / "Kuru Düzenle"

| Etiket | Tür | Zorunlu | Varsayılan | Not |
|---|---|---|---|---|
| Kaynak Para Birimi | seçici | evet | USD (ilk seçenek) | USD / EUR / GBP / TRY |
| Hedef Para Birimi | seçici | evet | TRY | Kaynakla aynı olursa: "Kaynak ve hedef para birimi aynı olamaz." |
| Kur (1 kaynak = ? hedef) *(düzenlemede "Kur")* | tutar maskesi, 6 ondalık | > 0 | — | "Geçersiz kur değeri. Kur sıfırdan büyük olmalıdır." |
| Kur Tarihi | tarih | — | bugün | İpucu: "Kurun geçerli olduğu gün. Transferler ve ₺ karşılığı toplamlar her zaman EN GÜNCEL tarihli kaydı kullanır; kur değerleme ise değerleme tarihine kadarki en güncel kaydı seçer. Aynı gün ve para birimi çifti için ikinci bir kayıt girmek engellenmez — mükerrer kayıttan kaçının." |

#### İçe aktarma: "Kurları Excel'den içe aktar"
- **İpucu:** "Kur, para biriminin 1 biriminin hedef para birimindeki karşılığıdır; hedef boşsa TRY kullanılır. Satırlar elle eklenen kur olarak kaydedilir."
- **Sütunlar:** Tarih* · Para birimi* · Hedef para birimi · Kur*. Metinde tek nokta ondalık sayılır ("1.085" = 1,085).
- **Kurallar:** aynı dosyada aynı çift ve gün tekrar ederse reddedilir (veritabanındakiyle karşılaştırılmaz). Kaynak ve hedef aynıysa: "{0} ile {1} aynı olamaz."

---

### 7.7 Yıl Sonu Kur Değerleme — `/FxRevaluations` (menüden gömülü, uygulama içi bağlantı bulunamadı)

- **İzin:** `FxRevaluations.Default`; çalıştırma `.Run` ister ama "Yeni Değerleme" düğmesi izne bağlı gösterilmiyor.
- **Kart:** başlık "Yıl Sonu Kur Değerleme", alt satır "Yabancı para kasalarının seçilen tarihteki TL karşılığı. Ardışık değerlemeler arası fark = kur farkı."
- **Düğme:** **"Yeni Değerleme"** + ipucu: "Seçtiğiniz tarihe kadarki hareketlerden her aktif kasanın bakiyesini hesaplar ve o tarihe ait en güncel kurla ₺'ye çevirerek donmuş bir kayıt oluşturur. Yabancı para kasalarından birinin o tarihe kadar hiç kuru yoksa işlem tamamen başarısız olur — önce Kurlar sayfasından eksik kuru girin."
- **Tablo:** arama yok, varsayılan sıralama Tarih azalan.
  - Sütunlar: Aksiyonlar (Detay; Sil `.Delete`) | Tarih | Toplam TL Değeri ("N2 ₺") | Not ("-") | Oluşturma (tarih + saat).
  - **Fark (kur farkı) sütunu yok.**
  - Sil onayı: "Bu değerleme silinecek?" → "Silindi."
- **"Yeni Kur Değerleme" penceresi:**
  - Değerleme Tarihi (örn. yıl sonu 31.12): tarih, varsayılan bu yılın 31.12'si.
  - Not (isteğe bağlı): en çok 500.
  - Yardım: "Aktif tüm kasalar için bakiye hesaplanır; yabancı para kasaları bu tarihe kadarki en güncel TCMB/manuel kurla TL'ye çevrilir. Kuru olmayan yabancı para kasası varsa hata verir."
  - Başarı: "Değerleme tamamlandı." Hata: "Değerleme tarihi için kur bulunamadı. Lütfen ilgili kuru tanımlayın."
- **"Değerleme Detayı" penceresi:**
  - Üst satır: "Tarih: … | Toplam TL: …"; not varsa altında.
  - Tablo: Kasa | Birim | Bakiye | Kur | TL Karşılığı; alt satırda "TOPLAM". Yalnız "Kapat" düğmesi.

---

### 7.8 Proje Bütçe / K/Z Raporu — `/Reports/ProjectBudget`

- **İzin:** `Projects.ViewBudget`.
- **Menüde yok.** Ulaşma yolları:
  - Proje konsolu ve proje listesi ⋯ menüsünde "Bütçe raporu (Excel)" ve "Bütçe raporu (PDF)". Bunlar dosyayı doğrudan indirir; ekran sayfası açılmaz.
  - `/DataTransfer` çalışma alanı.
- **Başlık** "Proje Bütçe / K/Z Raporu", alt satır "Proje bazlı bütçe ve kâr/zarar". Proje seçiliyse sağda "Excel" (yeşil çerçeve), "PDF" (kırmızı çerçeve), "Yazdır".
- **Süzgeç:** Proje seçici ("-- Seçiniz --") + **"Getir"**. Proje seçilmemişse: "Lütfen bir proje seçin."
- **İçerik:**
  - Proje adı.
  - **6 KPI kartı** (Finans Merkezi Genel sekmesiyle aynı parça, `_ProjectBudgetKpis`):
    - Sözleşme bütçesi: "{n} kalem" ya da "kalem tanımlı değil".
    - Onaylanan bütçe: "Rev.{n}" ya da "revizyon yok".
    - Gelen (tahsil) / Gelir: "{x}/{y} dilim · %{z} bütçe" ya da "gelir kayıtları".
    - Harcanan: "%{x} bütçe".
    - Kullanılabilir nakit: "gelen − harcanan"; eksiyse kırmızı.
    - Kalan bütçe: "onaylanan − harcanan" ya da "bütçe aşıldı".
    - Her kartın ipucu metni var. Para "₺12.345" biçiminde (kuruşsuz).
  - **İlerleme çubuğu:** "Bütçe Kullanımı: %x" + ipucu "Harcanan / onaylanan bütçe oranı. Gelir bu orana girmez — bütçenin ne kadarının harcandığını gösterir, kâr/zarar durumunu değil." Renk: %80 altı yeşil, %80 ve üstü sarı, aşımda kırmızı.
  - **Aşım kutusu:** "⚠ Bütçe aşıldı! Aşım: {tutar}".
  - **"Görev Bazlı Kırılım"** (görevli kayıt varsa): Görev | Gider (kırmızı) | Gelir (yeşil) | Net (işarete göre renkli), altında TOPLAM satırı. Para birimi yazılmıyor.
- **Excel** (`Butce_{Proje_Adı}.xlsx`, sayfa "Bütçe"):
  - Başlık "Proje Bütçe / K/Z — {proje}".
  - Özet satırları: Sözleşme bütçesi, Onaylanan bütçe, Gelen (tahsil) ya da Gelir, Harcanan, Kullanılabilir nakit (eksiyse kırmızı), Kalan bütçe (aşımda kırmızı), Bütçe Kullanımı %.
  - "Görev Kırılımı" tablosu (gri başlık).
- **PDF** (A4):
  - Aynı özet tablosu. **Yalnız ilk iki satırda para birimi var.**
  - "Görev Bazlı Kırılım" tablosu.
  - Sağ altta "Oluşturma: …".
- **Ekranda yazdırma:** kartın çerçevesi ve gölgesi kalkar, düğmeler gizlenir.

---

### 7.9 Ortak bileşenler

**Ortak içe aktarma penceresi** (`Pages/Shared/_ExcelImportModal.cshtml`, çok büyük boy)
1. **1. adım:** "1. Şablonu indirip doldurun ya da bu ekrandan dışa aktardığınız dosyayı kullanın. Yıldızlı sütunlar zorunludur; liste olan sütunlarda şablondaki seçeneklerden birini seçin." + ekrana özel ipucu.
   - Düğme "Şablonu indir": xlsx; "Seçenekler" sayfasında açılır listeler var; tam parametreli aktarımda ayrıca "Alan rehberi" sayfası.
   - Bağlantı "CSV şablonu".
2. **2. adım:** "2. Doldurduğunuz dosyayı seçip önizleyin; hata yoksa içe aktarın."
   - Dosya kutusu (.xlsx, .csv) + "Önizle" + "İçe aktar". "İçe aktar" yalnız hatasız önizlemeden sonra etkinleşir.
   - Altında: "Hatalı satır varsa hiçbir satır kaydedilmez."
3. **Önizleme tablosu** (en çok %50 ekran yüksekliği, kayar): Satır | {şablon sütunları} | Hata. Hatalı satırlar kırmızı.
   - İleti kutusu: "{0} satır içe aktarılmaya hazır." (yeşil) ya da "{0} satırdan {1} tanesinde hata var. Dosyayı düzeltip yeniden önizleyin." (kırmızı).
   - Dosya düzeyi hatalar: "Önce bir Excel ya da CSV dosyası seçin." · "Dosya okunamadı; .xlsx ya da .csv biçiminde bir dosya seçin." · "\"{0}\" sütunu bulunamadı. Şablonu indirip başlıkları değiştirmeden kullanın." · "Bir dosyada en fazla {0} satır içe aktarılabilir." (1000) · "Dosyada içe aktarılacak satır yok."
   - Satır hataları: "{0} boş olamaz." · "{0} en fazla {1} karakter olabilir." · "{0} geçerli bir tarih değil (gg.aa.yyyy)." · "{0} sayı olmalı." · "{0} sıfırdan büyük olmalı." · "{0}: \"{1}\" bulunamadı." · "{0}: \"{1}\" birden fazla kayıtla eşleşiyor." · "{0} üç harfli kod olmalı (TRY, EUR, USD…)."
4. **Onay:** hepsi ya da hiçbiri, tek işlemde yazılır.
   - Başarı: bildirim "{n} satır içe aktarıldı." (tam parametrelide özetle birlikte); tablo ve dosya temizlenir. **Pencere açık kalır**; kapanınca liste yenilenir.
   - Kayıt sırasında satır reddi: "Satır {n}: {ileti} Hiçbir satır kaydedilmedi."
   - Beklenmeyen hata: "Dosya işlenemedi. Lütfen tekrar deneyin."
   - Altbilgide yalnız "Kapat".

**Belge ekleme** (`Pages/Shared/_FinanceDocumentField.cshtml`; gider, gelir, fatura ve tahsilat pencerelerinde)
- Etiket "Belge ekle (fatura, fiş, dekont)".
- Kayda bağlı belgeler ataş ikonlu indirme bağlantısı olarak listelenir. **Kaldırma ya da yeniden adlandırma yok.**
- Çoklu dosya: .pdf .png .jpg .jpeg .gif .doc .docx .xls .xlsx .zip .rar.
- Yardım: "İsteğe bağlı; birden çok dosya seçebilirsiniz (dosya başına en çok 25 MB). Dosyalar Belge Merkezi'ne kaydedilir ve bu kayda bağlanır."
- Dosyalar kayıttan **önce** doğrulanır; reddedilen dosya kaydı açmaz.
- Alan yalnız Belgeler paketi ve belge yükleme izni olana basılır.

**Tutar girişi** (`data-money-input`, `apya-money-input.js`): tr-TR maske ("1.500,00" → 1500). Kur alanında 6 ondalık.

**Bütçe bağlamı** (`apya-finance-modal.js`):
- Proje seçilince Bütçe kalemi ve Görev seçicileri dolar.
- Kalem projede tanımlıysa zorunlu; faturada hiçbir zaman zorunlu değil.
- Kalan/aşım çipi gösterilir.
- Proje tarih aralığı denetimi yapılır.

**`FinanceLookupShared.cs`:**
- Gelir/gider para birimi listesi (TRY/EUR/USD/GBP).
- Proje tarih sözlüğü.
- Görevden proje ve bütçe kalemi çözümü.

---

### 7.10 Mobil davranış (özet)
- **Faturalar:** 992 px altında tek sütun. Önce liste; öğeye dokununca detay açılır ve "Listeye dön" görünür. Masaüstünde ilk fatura kendiliğinden seçilir, mobilde seçilmez.
- **Giderler, Gelirler, Kurlar, Değerleme:** DataTables "nowrap" ve kaydırma kabı, yani dar ekranda yatay kaydırma. Kart görünümüne dönüşmez. Başlıktaki düğme grubu sağa yaslı kalıp alt satıra kayar. Özel mobil düzen yok.
- **Kasa & Banka:** kartlar mobilde 2'li ızgara; hareket tablosu yatay kaydırmalı; transfer penceresi en çok 420 px.
- **Pencereler:** Bootstrap `col-md-*` mobilde alt alta dizilir. Fatura kalem satırında Açıklama, Miktar, Birim Fiyat ve Sil her biri tam genişlik olur.
- **Masraf Yakala:** mobil öncelikli; alttan açılan form, ≥ 44 px dokunma hedefleri, kamera doğrudan açılır, çevrimdışı kuyruk.
- **Yazdır:** en çok 800 px kâğıt; yazdırmada gölge ve düğmeler gizlenir.

---

### 7.11 Tasarım açısından göze çarpan sorunlar — bağımsız sayfalar

1. **Aynı tür kayıt için dört ayrı arayüz kalıbı:**
   - Faturalar: özel master-detail.
   - Giderler, Gelirler, Kurlar, Değerleme: ABP DataTables + kart başlığı.
   - Kasa: kartlar + elle çizilen tablo.
   - Finans Merkezi Gelir-Gider: sunucuda basılan tablo.
   - Aynı gelir/gider kaydı Finans Merkezi'nde ₺ defter, donör tutarı, kalem ve belgeyle görünüyor; `/Expenses` ve `/Incomes`'ta bunların hiçbiri yok. Finans Merkezi kayıttan sonra sayfayı tamamen yeniliyor, liste sayfaları yalnız tabloyu.
2. **Sayfa başlığı tutarsız.** Faturalar ve Kasa başlığı yalnız uygulama başlığına bırakıyor. Diğerleri kart içinde ikinci kez yazıyor. Kasa & Banka `ViewBag.Title` yerine `ViewBag.PageTitle` kullanıyor, sayfada da başlık basmıyor. Üst başlık `document.title`'dan okunduğu için bu sayfalarda başlık eksik görünebilir (kodda belirsiz).
3. **Kategori etiketleri üç farklı yazımda:**
   - Gider: tablo "Ofis" · form ve Masraf Yakala "Ofis / Kira" · Excel/tr.json "Ofis".
   - Gelir: tablo "Bağış" · form "Bağış / Sponsorluk"; "Faturasız Satış" / "Faturasız satış" / "Faturasız Satış / Nakit"; "Finansal" / "Faiz / Finansal".
4. **Para birimi listeleri farklı:**
   - Gider, gelir ve kur: TRY/EUR/USD/GBP.
   - Kasa: TRY/USD/EUR (GBP yok).
   - Masraf Yakala: TRY/USD/EUR.
   - Fatura formu: gizli TRY. Ama fatura içe aktarması her 3 harfli kodu kabul ediyor; dövizli fatura yalnız Excel'le açılabiliyor.
5. **Gelir tablosunda tutar para birimi olmadan basılıyor;** gider tablosu basıyor. Kasa hareket tablosunda da para birimi yok.
6. **Fatura durum adları yanıltıcı:**
   - "Taslak" = hiç ödeme yok; "Gönderildi" = kısmi ödeme alınmış. Gerçek bir taslak/gönder akışı yok.
   - "İptal" durumuna ulaşan hiçbir yol yok; fatura silme de yok (`Invoices.Delete` izni boşta). Kodda İptal faturada da "Ödeme Ekle" görünür.
   - "Gecikmiş" ayrı bir durum değil, hesaplanan bir bayrak; Taslak/Gönderildi'nin üstüne biniyor.
7. **Tahsilat penceresi:**
   - Varsayılan tutar kalan değil **genel toplam**; fazla ödeme engellenmiyor.
   - Faturanın toplamı, ödenen ve kalan tutarı pencerede görünmüyor.
   - Ödeme tarihi girilemiyor; ödeme yöntemi serbest metin.
   - **Aynı referans no ile ikinci ödeme sessizce yok sayılıyor.**
   - Başlık "Fatura Tahsilatı" ve "Tahsilatın Girdiği Kasa … otomatik giriş hareketi" alış faturasında da aynı. Oysa alış faturasında yapılan bir ödemedir; hareket yönü kodda satış/alış bayrağına göre ayrılıyor.
   - Kasa servisini okuduğu için kasa izni olmayan kullanıcıda açılmayabilir (doğrulanmadı).
8. **Detay paneli eksik:** ödeme geçmişi yok (servis ucu var). "Kalan" yok, yalnız "Ödenen" var. Bağlı belgeler yalnız Düzenle penceresinde görünüyor. Hiçbir finans formunda belge kaldırılamıyor.
9. **Yazdırma ve PDF:**
   - Fatura yönü hiçbir yerde basılmıyor; alış faturası kendi kurumunuz "kesen" olarak "FATURA" başlığıyla çıkıyor.
   - HTML yazdırma notları basmıyor, PDF basıyor.
   - Yazdır sayfası Bootstrap'ı CDN'den alıyor, uygulama temasını kullanmıyor; genel toplam kırmızı.
10. **Aynı alana farklı adlar:**
    - Vade: "Son Ödeme Tarihi" (form) / "Vade" (detay, yazdırma) / "Son tarih" (Excel) / "Vade tarihi" (tam içe aktarma).
    - Fatura tarihi: "Fatura Tarihi" (form) / "Düzenleme" (detay).
    - Kalem sütunları: "Miktar / Birim Fiyat" (form) / "Adet / Birim" (detay).
    - Kasa bakiyesi: "Konsolide Bakiye" (Kasa & Banka) / "Toplam Bakiye" (Finans Merkezi Kasa sekmesi). Kart banka adını, Finans Merkezi listesi kasa adını öne çıkarıyor.
11. **Gizli Müşteri alanı hâlâ sızıyor:**
    - Fatura araması müşteri adında da arıyor.
    - Excel çıktısında "Müşteri" sütunu var.
    - Yazdırma ve PDF eski kayıtta "Müşteri" basıyor.
    - Gelir ipucu "cari seçseniz bile" diyor; hata iletisi "cari ve fatura yönü değiştirilemez" diyor.
12. **Bayat ya da yanlış hata metinleri:**
    - `Platform:Invoice:NotEditable` "ödeme alınmış … olabilir" diyor; oysa ödemeli fatura artık düzenlenebiliyor.
    - `Platform:Expense:CashAccountRequired` kasa zorunluymuş gibi; kasa isteğe bağlı.
    - Transfer kur hatası gizli "Kur Değerleme ekranı"nı gösteriyor; doğrusu "Kurlar".
    - Kasa açılış bakiyesi ipucu "Hareketler sekmesi" diyor; ortada bir sekme yok, kart var.
    - Bütçe çipinde "asim" (Türkçe karakter yok).
13. **Ulaşılmaz ekranlar:**
    - `/CashAccounts`'a hesap varken Finans Merkezi'nden düzenli bir bağlantı yok; yalnız transfer satırları ya da boş durum bağlantısı.
    - `/ExchangeRates`'e yalnız Kur köprüsü panelinden gidiliyor.
    - `/Reports/ProjectBudget` ekranına giden bağlantı yok; ⋯ menüsü doğrudan dosya indiriyor.
    - `/FxRevaluations`'a hiç bağlantı yok.
    - Finans Merkezi'ndeki "Faturalar sayfasında aç" proje bağlamını düşürüyor ve `Invoices.Create` iznine bağlı.
    - Aktarma kataloğunda "`/Finance?tab=butce`" geçiyor; böyle bir sekme kodu yok, doğrusu "kalemler".
14. **Kasa yönetimi eksik:**
    - Kasa düzenleme penceresini açan bir arayüz yok; kasa silme yok.
    - Pasife alınan kasa listeden kayboluyor ve geri açılamıyor.
    - Para birimi formda değiştirilebiliyor ama hareketi olan kasada sunucu reddediyor.
    - Konsolide toplamda kuru olmayan para birimi sessizce 0 sayılıyor.
15. **İzin denetimi tutarsız:**
    - Arayüzde izne bağlanmamış düğmeler: "Yeni Gider", "Yeni Gelir", "Masraf Yakala", "Transfer", "Yeni Değerleme". Sunucu reddeder.
    - Faturada ise düğmeler izne göre gizleniyor.
16. **Kasa hareket tablosu:** kaynak sütunu yok (Excel'de var). Elle girilmemiş satırlarda eylemin neden olmadığı yazmıyor. 200 satır sınırı, sayfalama yok. Transferde tarih ve açıklama girilemiyor.
17. **Masraf Yakala:**
    - Başarı ekranı "Onaya gitti. Bildirim ile durumu takip edebilirsin." diyor; gider tarafında bir onay akışı yok.
    - Başarı ekranı 1,5 saniyede kendiliğinden kapanıyor; kendi kod yorumu ise "bir tane daha / bitir seçeneği veriliyor" diyor.
    - Zorunlu bütçe kalemi seçilmeden "Gönder" sessizce çalışmıyor.
    - Görev alanı ve proje tarih aralığı denetimi yok; en çok 200 proje.
    - Kasa listesini kasa servisinden okuyor; masaüstü form bunu bilerek kaçınıyor, izinsiz kullanıcıda boş kalabilir (doğrulanmadı).
    - Hitap "sen", masaüstü "siz".
    - Kuyruk kodu "eşleştirme ekranından belge bağlanır" diyor; böyle bir ekran bulunamadı.
18. **Kurlar:** elle aynı gün ve aynı çift için mükerrer kur girilebiliyor (yalnız ipucu uyarıyor). İçe aktarma tekrarı yalnız dosya içinde yakalıyor, veritabanıyla karşılaştırmıyor.
19. **Değerleme:** sayfa "ardışık değerlemeler arası fark = kur farkı" diyor ama fark hiçbir yerde gösterilmiyor.
20. **Fatura oluşturma ayrıntıları:**
    - Proje seçicide boş seçenek yok; ilk proje sessizce seçili geliyor.
    - Çift fatura numarası için kullanıcıya özel ileti yok (veritabanı hatasına düşüyor, kodda belirsiz).
    - Gelir penceresi görevden açılınca bütçe kalemini önden seçmiyor; gider penceresi seçiyor.
21. **Proje bütçe raporu:** PDF'te para birimi yalnız ilk iki satırda var. Kırılım tablosunda para birimi yok. Uyarıda "⚠" simgesi; ipuçlarında BÜYÜK HARFLİ vurgular ("EN GÜNCEL", "DİKKAT").


---

## 8. Veri modeli, iş kuralları ve formüller

Kod yolları depo köküne göredir. Kısaltmalar: `D/` = `src/Apya.Platform.Domain/` · `DS/` = `src/Apya.Platform.Domain.Shared/` · `A/` = `src/Apya.Platform.Application/` · `AC/` = `src/Apya.Platform.Application.Contracts/` · `W/` = `src/Apya.Platform.Web/`.

> ⚠ **Çok para birimi (FIN-02, karar bekliyor):** kalem ve proje toplamları ham tutar üzerinden yapılıyor; 100 USD + 1.000 TRY = 1.100 "proje para birimi" sayılıyor. Yalnız portföy toplamları para birimine göre ayrı tutuluyor. **Tasarım tek para birimli gösterge varsaymamalı.** Ayrıntı §8.4.7 sonunda.

### 8.1 Kavram sözlüğü

Şablon sütunu (K=Kurumsal, H=Hibe, E=Etkinlik), Finans Merkezi sekmelerinin şablona göre görünmesinden çıkarıldı. Şablon, proje kategorisinden çözülüyor: `GrantProject`→Hibe, `Event`→Etkinlik, diğer her şey→Kurumsal (`W/Pages/Finance/FinanceContext.cs:134-139`).

| Ekrandaki ad | Tanım | Şablon |
|---|---|---|
| Finans Merkezi | `/Finance`. Proje seçiciyle (ya da "Tüm projeler" portföyüyle) çalışan tek finans çatısı, sekmeli. | K/H/E |
| Toplam bütçe | Projenin tek tutarlı bütçesi (`Project.TotalBudget`). Kalem tanımlı değilse bütün bütçe göstergeleri bu tutara düşer. | K/H/E |
| Bütçe kalemi | Bütçenin kırılımı ("1. Personel"). En fazla 4 düzeyli bir ağaçtır. Üst kalemin kendi tutarı olabilir; tutarı 0 olan üst kalem fiilen bir kategoridir. | K/H/E |
| Planlanan (sözleşme) tutarı | Kalemin sözleşmedeki ilk tutarı. Revizyon bu tutarı değiştirmez; kıyas noktasıdır. | K/H/E |
| Onaylanan tutar | Kalemin yürürlükteki tutarı. Yalnız revizyon (ya da kalem düzenleme) değiştirir. | K/H/E |
| Harcanan / Kalan / Kullanım % | Kaleme bağlı giderlerin toplamı, Onaylanan − Harcanan ve Harcanan / Onaylanan. Bunlar saklanmaz, her seferinde hesaplanır. | K/H/E |
| Aktarım sınırı % | Kalemler arası aktarım için donör sınırı. Yalnız saklanır ve gösterilir; aktarım akışı yok. | H |
| Destek oranı | Hibenin bütçeyi karşıladığı yüzde. Proje oranı boşsa bağlı hibe programının oranı kullanılır. | H |
| Hibe payı / Kurum payı (eş finansman) | Kalemin hibeden karşılanan kısmı (elle girilebilir, yoksa oranla hesaplanır). Kurum payı = Onaylanan − Hibe payı; saklanmaz. | H |
| Fon dilimi ("Dilimler & kesintiler") | Fonlamanın bir taksiti (hakediş, hibe taksiti, bağış taahhüdü): planlanan tutar ve tarih, tahsilat. | K/H |
| Kesinti | Bir dilimden eksik gelen tutar ve gerekçesi. Bütçeye etkisi ayrıca karara bağlanır: Açık / Bütçeye işlendi / Finanse edilmeyen. | K/H |
| Bütçe revizyonu (Rev.N) | Kalem onaylanan tutarlarının gerekçeli sürümü: kaçtan kaça, ne zaman, neden. | K/H/E |
| Gelir (faturasız gelir) | Hibe, bağış ya da faturasız satış girişi. Kasaya bağlanabilir. Dilim tahsilatının karşılığı olur. | K/H/E |
| Gider / Masraf | Harcama kaydı. Kasa, proje, görev ve bütçe kalemi isteğe bağlıdır. "Masraf yakala" mobil fiş akışıdır (`/Expenses/Capture`). | K/H/E |
| Fatura (Satış/Alış) | Projeye bağlı fatura: kalemler, tek KDV oranı, KDV istisnası, ödemeler. **Bütçe harcamasına sayılmaz.** | K/H/E |
| Ödeme / Tahsilat | Faturaya girilen ödeme. Kasa seçilirse kasa hareketi doğurur. | K/H/E |
| KDV istisnası | Proje belgesi (no + son geçerlilik). Belge fatura tarihinde geçerliyse yeni fatura KDV %0 ile açılır. | K/H/E |
| Kasa & Banka | Nakit kasa, banka hesabı ya da kredi kartı. Bakiye hareketlerden hesaplanır. | K/H/E |
| Kasa hareketi | Kasaya giriş/çıkış. Gider, gelir, fatura ödemesi ve transfer otomatik yazar; bir de elle girilen hareket var. | K/H/E |
| Transfer | Kasalar arası iki bacaklı hareket; farklı para biriminde kurla çevrilir. | K/H/E |
| Kurlar | `1 X = oran Y` kayıtları. Kaynak: Elle ya da TCMB. | K/H/E |
| Üç defter | Her gider/gelir için üç karşılık: işlem para birimi (tutar), ₺ defter karşılığı (BookAmount), donör para birimi karşılığı (DonorAmount). | H (₺ defter her yerde) |
| Kur köprüsü | Donör para birimi ve kur politikası ayarı, kayıtların üç defter karşılaştırması, "yeniden hesapla". | H |
| Kur politikası | Donör karşılığının hangi günün kuruyla hesaplanacağı. | H |
| Kur kilidi | Donör karşılığı kesinleşmiş kayıt. Politika değişince kendiliğinden yeniden hesaplanmaz. | H |
| Donör & raporlama | Donöre mali rapor ve teslim paketleri (Belgeler ve Raporlama ile bağlı). Ekranı §6.1 "Donör & raporlama". | H |
| Yıl Sonu Değerleme | Yabancı para kasalarının seçilen tarihteki TL karşılığının anlık görüntüsü. İki değerleme arasındaki fark kur farkıdır. | K/H/E (yalnız Premium/Enterprise) |
| Portföy | Proje seçili değilken bütün projelerin bütçe/nakit tablosu; para birimine göre ayrı toplamlar. | – |
| Görev bütçesi | Göreve ayrılan tutar; bir bütçe kaleminin dilimidir. | K/H/E |
| Hibe dönüşümü bağı / uyuşmazlık | Başvurudan projeye kopyalanan kalem ve dilimler kaynağını hatırlar. İki kayıt çelişirse rozet çıkar. | H |
| Belge bağları | Gider↔belge (skorlu eşleştirme önerisi), gelir↔belge ve fatura↔belge (elle). | K/H/E |
| *Cari, Mizan, Cari Ekstre* | Kodda var, arayüzden gizli. Kapsam dışı. | – |
| *Abonelik faturası (Billing)* | Host'un kiracıya kestiği fatura. Finans modülü değildir. | – |

---

### 8.2 Varlıklar (yalnız ekranı etkileyen alanlar)

#### Project (finans alanları) — `D/Projects/Project.cs`

| Alan | Tür | Zorunlu | Açıklama / kısıt |
|---|---|---|---|
| TotalBudget | decimal | evet (varsayılan 0) | ≥0 (`:174-180`) |
| HourlyRate | decimal | evet (0) | ≥0 |
| Currency | string(3) | varsayılan TRY | Ekrandan ayarlanamıyor (PRJ-11) |
| DonorCurrency | string(3)? | hayır | Boşsa donör defteri yok. Proje para biriminden farklı olmalı (`SetFxBridge`, `:242` vd.) |
| FxPolicy | enum | varsayılan Harcama günü | Donör para birimi boşaltılınca politika sıfırlanır |
| FixedDonorRate | decimal? | "Sabit sözleşme kuru"nda zorunlu, >0 | Başka politikada null |
| SupportRatePercent | decimal? | hayır | 0–100. Boşsa `Grant.SupportRatePercent` (tamsayı) kullanılır |
| VatExemptionCertificateNo | string ≤64 | hayır | Boşsa istisna kalkar, tarih de silinir |
| VatExemptionValidUntil | date? | hayır | Boşsa süresiz |
| CategoryId | Guid | evet | Finans şablonunu belirler |

#### ProjectBudgetLine — Bütçe kalemi (`D/ProjectBudgets/ProjectBudgetLine.cs`)

| Alan | Tür | Zorunlu | Kısıt |
|---|---|---|---|
| Code | string ≤32 | hayır | Doluysa proje içinde tekil (`ProjectBudgetManager.cs:385-399`). Fazlası **sessizce kırpılır** (`:125-131`) |
| Name | string ≤128 | evet | Fazlası sessizce kırpılır |
| Order | int | otomatik | Sıralama |
| PlannedAmount | decimal | evet | ≥0 (DTO: 0–999.999.999.999) |
| ApprovedAmount | decimal | hayır (boşsa = Planlanan) | ≥0 |
| TransferLimitPercent | decimal? | hayır | 0–100 |
| ParentId | Guid? | hayır | Aynı projede olmalı; döngü olamaz; en fazla 4 düzey |
| GrantAmount (hibe payı) | decimal? | hayır | 0 ≤ x ≤ Onaylanan (`:173-181`) |
| Justification | string ≤512 | hayır | Dönüşümde başvurudan gelir |
| SourceGrantLineId | Guid? | sistem | Başvuru satırı bağı |

Hesaplananlar (`AC/ProjectBudgets/ProjectBudgetDtos.cs`):
- Satır alanları: SpentAmount, RemainingAmount, UsagePercent, IsOverBudget (`:40-47`), GrantShare, InstitutionShare (`:69`).
- LinkedRecordCount: 0 değilse kalem silinemez.
- Ağaç toplamları: Total* (`:77-80`).

#### FundingTranche — Fon dilimi (`D/ProjectBudgets/FundingTranche.cs`)

| Alan | Tür | Zorunlu | Kısıt |
|---|---|---|---|
| SequenceNo | int | otomatik | max+1 ("1. Dilim") |
| Title | string ≤128 | hayır | |
| PlannedDate | date? | hayır | |
| PlannedAmount | decimal | evet | >0 |
| ReceivedAmount | decimal | – | ≥0. **Kümülatiftir**: o güne kadar gelen toplam yazılır, fark değil |
| ReceivedDate | date? | – | Tahsilat 0 ise silinir |
| Status | enum | türetilir | Yalnız "İtiraz" elle işaretlenir |
| IncomeEntryId | Guid? | hayır | Tahsilatın karşılığı olan gelir kaydı |
| Note | string ≤512 | hayır | |
| SourceGrantTrancheId | Guid? | sistem | Hibe dilimi bağı |

Hesaplananlar:
- DeductionTotal
- ExpectedAmount = max(0, Planlanan − Kesinti) (`:65`)
- OutstandingAmount = max(0, Beklenen − Tahsil edilen) (`ProjectBudgetDtos.cs:203`)

#### TrancheDeduction — Kesinti (`D/ProjectBudgets/TrancheDeduction.cs`)

| Alan | Kısıt |
|---|---|
| Amount | >0 |
| Reason | zorunlu, ≤512 |
| DeductionDate | |
| Resolution | Açık / Bütçeye işlendi / Finanse edilmeyen |
| BudgetRevisionId | "Bütçeye işlendi · Rev.N" rozeti bunu okur |

#### BudgetRevision ve BudgetRevisionLine (`D/ProjectBudgets/BudgetRevision.cs`)

- **Revizyon:** RevisionNo (otomatik), Reason (zorunlu, ≤512), EffectiveDate. TotalApprovedAmount, revizyon sonrası kalem toplamının anlık görüntüsü olarak saklanır.
- **Satırlar:** BudgetLineId, PreviousAmount, NewAmount (≥0), Delta.
- **NetDelta:** revizyonun net etkisi; eksi değer küçültme demektir.

#### Expense — Gider (`D/Expenses/Expense.cs`; DTO `AC/Expenses/CreateUpdateExpenseDto.cs`)

| Alan | Tür | Zorunlu | Kısıt / açıklama |
|---|---|---|---|
| Title ("Başlık") | string ≤200 | evet | |
| Amount | decimal | evet | ≥0,01 |
| Currency | string(3) | evet | Ekranda TRY/EUR/USD/GBP (`W/Pages/FinanceLookupShared.cs:68-73`) |
| ExpenseDate | date | evet | Varsayılan bugün |
| Category | enum | varsayılan "Genel / Diğer" | |
| CashAccountId ("Kasa") | Guid? | **hayır** | Boşsa kasaya işlenmez (`:25`). Seçicide yalnız aktif kasalar |
| ProjectId | Guid? | hayır | Görev seçiliyse yok sayılır, projeden türetilir |
| TaskId | Guid? | hayır | |
| BudgetLineId | Guid? | **koşullu** | Projenin kalemi varsa zorunlu (bkz. 4.1) |
| CustomerId | Guid? | gizli | Kapsam dışı |
| Description | string ≤500 | hayır | |
| BookAmount, BookRate | decimal | sistem | ₺ karşılığı; salt gösterim |
| DonorAmount, DonorRate | decimal? | sistem | Donör karşılığı. Kur yoksa boş |
| RateLocked | bool | sistem | Donör karşılığı doluysa true |

#### IncomeEntry — Gelir (`D/Incomes/IncomeEntry.cs`)

Alanlar gidere eşdeğer: Title ≤200, Amount ≥0,01, Currency, IncomeDate, Category, CashAccountId?, ProjectId?, TaskId?, BudgetLineId? (koşullu), Description ≤500, üç defter alanları. Farkı: kasa boşsa kayıt "tahsil edilmemiş/beklenen" sayılır (`:24`).

#### Invoice — Fatura (`D/Invoices/Invoice.cs`; DTO `AC/Invoices/InvoiceDtos.cs`)

| Alan | Tür | Zorunlu | Kısıt / açıklama |
|---|---|---|---|
| ProjectId | Guid | **evet** | Faturasız proje yok |
| Direction | enum | varsayılan Satış | Ödeme girildikten sonra kilitli |
| InvoiceNumber ("Fatura No") | string | evet | Kiracı içinde tekil, ama kural yalnız veritabanında (`src/Apya.Platform.EntityFrameworkCore/EntityFrameworkCore/PlatformDbContext.cs:1629`). Silinmiş faturanın numarası da yeniden kullanılamaz. Uzunluk sınırı DTO'da yok |
| InvoiceDate | date | evet | |
| DueDate ("Son Ödeme Tarihi") | date | evet | Ödeme alınmış faturada da değişir |
| TaxRate ("KDV Oranı %") | decimal | evet (varsayılan 20) | ≥0. **Fatura başına tek oran**, serbest sayı |
| PricesIncludeTax ("Fiyatlar KDV dahil") | bool | yalnız girdi | Fiyat KDV'den arındırılıp saklanır |
| VatExemptionReference ("KDV istisna belge no") | string ≤128 | hayır | Doluysa oran 0'a çekilir |
| Currency | string(3) | | **Ekranda TRY sabit** (gizli alan, `W/Pages/Invoices/CreateModal.cshtml:79`) |
| Notes | string | hayır | |
| BudgetLineId | Guid? | **hiçbir zaman zorunlu değil** | Faturanın projesine ait olmalı |
| TaskId | Guid? | hayır | |
| CustomerId | Guid? | gizli (`CreateModal.cshtml:33`) | Kapsam dışı |
| Status | enum | sistem | |
| TotalAmount | decimal | hesaplanır | Kalem toplamı × (1 + KDV/100) |
| PaidAmount, Balance, IsOverdue | | hesaplanır (DTO) | |

**InvoiceItem (kalem):** Description, Quantity >0, UnitPrice ≥0, TotalPrice = Miktar × Birim fiyat. Açıklama için zorunluluk kodda görülmedi.

**Payment (ödeme)** — `D/Invoices/Payment.cs`:

| Alan | Açıklama |
|---|---|
| Amount | >0 |
| PaymentDate | Formda alan yok; **daima sistem saati** |
| PaymentMethod ("Ödeme Yöntemi") | Serbest metin, varsayılan "Havale" |
| ReferenceNumber ("Referans No") | Yinelemeyi önler |
| CashAccountId | Boşsa ödeme yalnız faturaya işlenir |

#### CashAccount — Kasa (`D/CashAccounts/CashAccount.cs`)

| Alan | Kısıt |
|---|---|
| Name | zorunlu, ≤200 |
| Type | Nakit / Banka / Kredi kartı |
| Currency | 3 harf. Hareketi varsa kilitli |
| OpeningBalance | Doğrulama yok; eksi olabilir |
| Description | ≤500 |
| BankName | ≤200 |
| Branch | ≤200 |
| Iban | ≤34 |
| IsActive | |

Hesaplanan: CurrentBalance = Açılış + ΣGiriş − ΣÇıkış (`A/CashMovements/CashMovementAppService.cs:128-150`).

#### CashMovement — Kasa hareketi (`D/CashMovements/CashMovement.cs`)

| Alan | Açıklama |
|---|---|
| CashAccountId | zorunlu |
| Direction | Giriş / Çıkış |
| Amount | >0. **Para birimi alanı yok**; tutar kasanın para biriminde sayılır |
| MovementDate | |
| Description | ≤500 |
| Source | Hareketin kaynağı |
| ReferenceId | Kaynağa göre anlamı değişir: ödeme, gider, gelir ya da transfer eşi (`:25-38`) |

#### ExchangeRate — Kur (`D/ExchangeRates/ExchangeRate.cs`)

| Alan | Kısıt |
|---|---|
| FromCurrency | 3 harf |
| ToCurrency | 3 harf, varsayılan TRY. Kaynak para biriminden farklı olmalı |
| Rate | >0 (DTO ≥0,000001) |
| RateDate | gün |
| Source | Elle / TCMB. Elle düzenlenen TCMB kaydı "Elle" olur |

Aynı gün ve çift için tekillik **yok**: indeks tekil değil, `PlatformDbContext.cs:673` civarı.

#### FxRevaluationSnapshot ve FxRevaluationLine — Yıl sonu değerleme

- **Anlık görüntü:** AsOfDate (varsayılan bu yılın 31.12'si), Notes, TotalTryValue.
- **Satır:** kasa adı, para birimi, Balance, Rate?, TryValue.

#### TaskItem bütçe bağı (`D/Tasks/TaskItem.cs:38,48,56-69`)

- BudgetLineId? ve PlannedAmount? (≥0).
- Kalem boşaltılırsa tutar da silinir.

#### İlişkiler

- **Fatura:** →Proje (zorunlu), →Bütçe kalemi?, →Görev?, →Ödemeler (1-n). Ödeme→Kasa? ve kasa hareketi.
- **Gider / Gelir:** →Kasa?, →Proje?, →Görev?, →Bütçe kalemi?. Kasa seçiliyse 1 kasa hareketi.
- **Fon dilimi:** →Proje, →Gelir kaydı? (1-1: bir gelir yalnız bir dilime bağlanır), →Kesintiler (1-n). Kesinti→Revizyon?.
- **Bütçe kalemi:** →Proje, →Üst kalem?. Görevler ve giderler/gelirler kaleme bağlanır.
- **Proje dönüşüm bağları:** →Hibe programı?. Kalem→başvuru bütçe satırı, dilim→hibe tahsilat dilimi. İkisi de bilerek FK değil.
- **Belge bağları** (`D/Documents/Matching/`): DocumentExpenseMatch (n-n; skor + ek numarası), DocumentIncomeLink (n-n), DocumentInvoiceLink (n-n; fatura PDF'i ve dekontlar faturaya bağlanır, ödemeye değil).
- **Gider↔alış faturası:** bağ tutulmaz. Karşılık şu ölçütlerle aranır: aynı proje, aynı para birimi, tutar ±0,005, tarih ±30 gün; iki tarafta da kalem varsa aynı kalem (`A/Invoices/FinanceCrossCheck.cs:10-20`).

---

### 8.3 Enum'lar (değer → Türkçe etiket)

| Enum | Değerler |
|---|---|
| InvoiceStatus | 0 Taslak · 1 Gönderildi · 2 Ödendi · 3 İptal · 4 Gecikmiş (`tr.json:964-968`) |
| InvoiceDirection | 0 Satış (Faturası) · 1 Alış (Faturası) |
| CashAccountType | 0 Nakit (kasa) · 1 Banka (hesabı) · 2 Kredi kartı. Etiketler kodda gömülü (`W/Pages/Finance/_AccountsList.cshtml:22-27`) |
| CashMovementDirection | 0 Giriş · 1 Çıkış |
| CashMovementSource | 0 Elle · 1 Fatura · 2 Gider · 3 Transfer · 4 Gelir |
| ExpenseCategory | 0 Genel / Diğer · 1 Ofis · 2 Seyahat · 3 Personel · 4 Malzeme · 5 Hizmet · 6 Vergi |
| IncomeCategory | 0 Diğer · 1 Hibe · 2 Bağış · 3 Faturasız satış · 4 Finansal |
| ExchangeRateSource | 0 Elle · 1 TCMB |
| FundingTrancheStatus | 0 Bekliyor · 1 Kısmi tahsil · 2 Tahsil edildi · 3 İtiraz sürecinde (`_PanelTranches.cshtml:14-20`) |
| DeductionResolution | 0 Açık · 1 Bütçeye işlendi · Rev.N · 2 Finanse edilmeyen |
| FxPolicy | 0 Harcama günü kuru · 1 Dilim (tahsil) kuru · 2 Aylık donör kuru · 3 Sabit sözleşme kuru (`FxPolicyModal.cshtml.cs:35-38`) |
| Hibe tarafı: GrantDisbursementTrancheStatus | 0 Planlandı · 1 Talep edildi · 2 Ödendi |
| Hibe tarafı: GrantCurrencies | TRY, EUR, USD, GBP |

Fatura durumlarına dair üç not:
- "Gecikmiş" hiçbir yerde atanmıyor. Okunurken hesaplanıyor (`IsOverdue`).
- "İptal" de hiçbir yolda atanmıyor. Ne iptal akışı ne iptal düğmesi var (FIN-10).
- "Gönderildi"ye yalnız kısmi ödeme girilince geçiliyor; "Gönder" eylemi yok.

---

### 8.4 İş kuralları ve ekrana etkileri

#### 8.4.1 Gider ve gelir

1. **Kasa isteğe bağlı.** Kasa seçilirse otomatik kasa hareketi yazılır: giderde Çıkış, gelirde Giriş. Kasasız kayıt hiçbir bakiyeye dokunmaz.
   → Kasa alanı "boşsa kasaya işlenmez" diye anlatılmalı. (`A/Expenses/ExpenseAppService.cs:188-211`; `A/Incomes/IncomeEntryAppService.cs:161`)
2. **Kayıt ile kasanın para birimi farklıysa** kasaya çevrilmiş tutar yazılır; kur kayıt tarihinden bulunur. Kur yoksa **kayıt reddedilir**: "…döviz kuru bulunamadı. Kurlar ekranından ilgili kuru ekleyip…". Uygulanan kur hareket açıklamasına eklenir, ör. "(1 EUR = 35,1234 TRY)".
   → Formda kasa ve para birimi uyuşmazlığı önceden uyarılmalı. (`D/CashMovements/CashMovementAmountResolver.cs:41-70, 83-86`)
3. **Bütçe kalemi koşullu zorunlu:** projenin kalemi varsa zorunlu, yoksa boş kalmalı. Projesiz kayıtta kalem verilemez.
   → Proje seçilince kalem alanı belirir; o projede kalem varsa zorunlu yıldızı alır. DTO'da `RequiresBudgetLine` hazır. (`D/ProjectBudgets/ProjectBudgetManager.cs:136-167`; `ProjectBudgetDtos.cs:166`)
4. **Görev seçilirse proje görevden türetilir;** istemcinin gönderdiği proje yok sayılır. Görevsiz ve projesiz kayıt bağımsızdır, hiçbir bütçeye sayılmaz.
   → Görev seçilince proje alanı kilitlenmeli ya da kendiliğinden dolmalı. (`ExpenseAppService.cs:135-141`)
5. **Düzenlemede kasa hareketi eşitlenir:** kasa sonradan eklenirse hareket açılır, kaldırılırsa silinir, değişirse güncellenir. Silmede hareket de silinir. (`ExpenseAppService.cs:216-256, 279-288`)
6. **Üç defter damgası** her kayıtta ve her güncellemede yeniden basılır:
   - ₺ karşılığı her zaman hesaplanır.
   - Donör karşılığı yalnız projenin donör para birimi varsa hesaplanır.
   - Kur bulunamazsa hata verilmez: ₺ karşılığı **0** yazılır (FIN-08), donör karşılığı boş kalır, kilit konmaz.
   → "Kur yok" durumu görünür kılınmalı. (`D/ProjectBudgets/FxLedgerStamper.cs:33-65`; `ExpenseAppService.cs:143-156`)
7. **Kayıt kapsamını taşımak** ("İlişkiyi değiştir…": görev, yalnız proje ya da bağımsız) hem Gider/Gelir Düzenleme hem Görev Düzenleme izni ister. (`ExpenseAppService.cs:301-304`; `IncomeEntryAppService.cs:248-251`)
8. **Dilime bağlı gelir silinemez ve projesi değiştirilemez:** "Bu gelir kaydı N. fon diliminin tahsilatına bağlı…".
   → Bağlı gelirde Sil düğmesi pasif olmalı, bağ rozeti gösterilmeli. (`ProjectBudgetManager.cs:218-239`)
9. **Görev başka projeye taşınınca** giderleri de taşınır ve bütçe kalemleri **boşaltılır**. (`D/Tasks/TaskManager.cs:390-398`)
10. **Gelir belgesi bağlamak** Gelir Düzenleme ve Belgeler izni ister. Belge, gelirle aynı projeden olmalı. (`IncomeEntryAppService.cs:334-346`)
11. **Giderde fiş/belge eşleştirme bir öneridir.** Skor: tutar 50, tarih 30, tedarikçi 20. Eşik altındaki öneri gösterilmez; kullanıcı onaylamadan bağ kurulmaz. (`D/Documents/Matching/ExpenseMatchScorer.cs:39-61`)

#### 8.4.2 Fatura

1. **Proje zorunlu; bütçe kalemi hiçbir zaman zorunlu değil.** Kalem seçilirse faturanın projesine ait olmalı. (`A/Invoices/InvoiceAppService.cs:189-203`)
2. **Fatura bütçe "harcanan"ına sayılmaz.** Harcanan yalnız gider kayıtlarından toplanır.
   → Alış faturasının karşılığı olan gider bulunmazsa detayda "Gider kaydı oluştur" düğmesi çıkar; pencere faturanın bilgileriyle dolu açılır. Gider Oluşturma izni gerekir. (`W/Pages/Invoices/index.js:236-246`; `D/Invoices/Invoice.cs:19-24`)
3. **Toplam** = Σ(Miktar × Birim fiyat) × (1 + KDV/100) (`Invoice.cs:200-201`).
   - Miktar >0, birim fiyat ≥0, KDV ≥0 olmalı.
   - "Fiyatlar KDV dahil" seçiliyse birim fiyat = fiyat × 100 / (100 + KDV), kuruşa yuvarlanır. Genel toplam girilen tutardan 1–2 kuruş sapabilir (`D/Invoices/InvoiceItemDescriptor.cs:15-16`).
4. **KDV istisnası:** istisna belge no doluysa KDV oranı 0'a çekilir ve KDV dahil çevirmesi yapılmaz.
   - Projenin istisna belgesi fatura tarihinde geçerliyse yeni faturada belge no kendiliğinden dolar (istemci tarafında).
   - Belge yazdırmada istisna satırı basılır.
   - (`Invoice.cs:187-198`; `Project.HasVatExemptionOn`; `CreateModal.cshtml:86-92, 170-192`)
5. **Durum yalnız ödemelerden türer** ve ödeme toplamına göre değişir:
   - Ödeme toplamı ≥ fatura toplamı → Ödendi.
   - Kısmi ödeme → Gönderildi.
   - Hiç ödeme yoksa Taslak kalır.
   - (`Invoice.cs:150-154`)
6. **Düzenleme ve ödeme düğmeleri:**
   - "Düzenle" yalnız **İptal** durumunda gizli, yani ödenmiş fatura da düzenlenebilir.
   - Ödeme girilmiş faturada **cari ve yön kilitli**: "Bu faturaya ödeme girilmiş: cari ve fatura yönü değiştirilemez. Tutar, kalemler ve KDV düzenlenebilir."
   - "Ödeme ekle" düğmesi Ödendi durumunda gizli.
   - (`Invoice.cs:108-128`; `index.js:177-181`; `W/Pages/Invoices/EditModal.cshtml.cs:114-115`)
   - ⚠ `AC/Invoices/IInvoiceAppService.cs:16`'daki yorum "yalnız Taslak düzenlenir" diyor; kod ve ekran böyle davranmıyor.
7. **Vade, not ve bütçe kalemi** ödeme alınmış faturada da ayrı bir uçla değişir (`InvoiceAppService.cs:176-186`).
8. **Ödeme kaydı** (`D/Invoices/InvoiceManager.cs:173-228`):
   - Tutar >0 olmalı. **Fazla ödeme engellenmez** (avans/kısmi ödemede kasıtlı).
   - Aynı referans numarasıyla tekrar gelen ödeme sessizce yok sayılır.
   - Ödeme tarihi ve kasa hareketi tarihi **daima işlem anıdır**; formda tarih alanı yok (`:206, :303`).
   - Kasa seçilirse hareket yazılır: Satış → Giriş "Fatura tahsilatı: …", Alış → Çıkış "Tedarikçi ödemesi: …".
   - Kasanın para birimi farklıysa ödeme gününün kuruyla çevrilir; kur yoksa ödeme reddedilir ("Tahsilat tarihi için kur bulunamadı").
   - Ödeme penceresinde tutarın varsayılanı **fatura toplamıdır, kalan bakiye değil** (`W/Pages/Invoices/PaymentModal.cshtml.cs:70`).
   - Kasa listesinde yalnız aktif kasalar var; "— Kasaya işlenmesin —" seçeneği de bulunuyor.
9. **Silinemeyen ve geri alınamayan işlemler:**
   - Fatura silme ya da iptal ucu yok. `Invoices.Delete` izni tanımlı ama hiçbir yerde kullanılmıyor.
   - Ödeme silme ya da geri alma ucu da yok.
   → Bu eylemler tasarıma "mevcut" diye konmamalı.
10. **Vadesi geçmiş (Gecikmiş)** = İptal değil + Ödendi değil + vade < şimdi. Hiç ödeme almamış (Taslak) fatura da sayılır. (`InvoiceAppService.cs:300-302`)
11. **Para birimi** ekranda TRY'ye sabit, alan gizli.
12. **Genel Bakış'taki "onay bekleyen tutar"** Taslak faturaların toplamı. Ancak onay iş akışı yok (`A/Dashboard/DashboardStatisticsProvider.cs:335, 587-590`).

#### 8.4.3 Kasa ve kasa hareketi

1. **Hareketi olan kasa silinemez:** "…Silmek yerine kasayı pasife alın."
   → Hareketi varsa Sil yerine "Pasife al" gösterilmeli. (`A/CashAccounts/CashAccountAppService.cs:45-55`)
2. **Hareketi olan kasanın para birimi değiştirilemez:** "…Farklı para birimi için yeni bir kasa açın."
   → Düzenle formunda para birimi alanı kilitli olmalı. (`CashAccountAppService.cs:63-78`)
3. **Yalnız elle girilen hareket düzenlenir ya da silinir.** Gider, gelir, fatura ve transfer hareketleri reddedilir: "…Değişikliği kaynak kayıt üzerinden yapın."
   → Otomatik hareketlerde düzenle/sil yerine kaynağa giden bağlantı olmalı. (`A/CashMovements/CashMovementAppService.cs:42-80`)
4. **Transfer:**
   - Aynı kasaya yapılamaz; pasif kasaya ya da pasif kasadan yapılamaz.
   - Farklı para biriminde transfer gününün kuruyla çevrilir; kur yoksa reddedilir.
   - Kasa Hareketi Oluşturma izni ister.
   - (`D/CashAccounts/CashTransferManager.cs:39-93`; `CashMovementAppService.cs:152`)
5. **Bakiye eksiye düşebilir.** Yeterli bakiye denetimi yok; açılış bakiyesi de eksi olabilir.
6. **Pasif kasalar** gider, gelir ve ödeme formlarının kasa seçicisinde görünmez (`ExpenseAppService.cs:368-376`). Sunucuda pasif kasaya yazmayı engelleyen bir denetim bulunmadı (kodda belirsiz).

#### 8.4.4 Bütçe kalemi, revizyon ve görev bütçesi

Kalem yazma izni: **Bütçe Düzenleme ya da Proje Düzenleme** (`A/ProjectBudgets/BudgetWritePermission.cs`).

1. Yeni kalemde Onaylanan boş bırakılırsa Planlanan'a eşitlenir (`ProjectBudgetManager.cs:74`).
2. Kalem kodu doluysa proje içinde tekil olmalı.
3. Üst kalem aynı projede olmalı; kendisi ya da kendi alt kalemi olamaz; ağaç en fazla 4 düzey olabilir (`:412-436`).
4. **Bağlı gider/gelir kaydı olan kalem silinemez** ("Önce kayıtları başka bir kaleme taşıyın"). **Alt kalemi olan kalem de silinemez.**
   → `LinkedRecordCount > 0` ya da alt kalem varsa Sil düğmesi pasif olmalı. (`:110-126`)
5. Hibe payı 0 ile Onaylanan arasında olmalı. Bir revizyon Onaylanan'ı payın altına indirirse pay kendiliğinden kırpılır (`ProjectBudgetLine.cs:173-197`).
6. **Revizyon** (`:326-377`; `A/ProjectBudgets/ProjectBudgetAppService.cs:743`):
   - En az bir kalem değişikliği ister; yeni tutar ≥0 olmalı.
   - Gerekçe zorunlu (≤512).
   - Uygulanınca revizyon numarası artar, satırlarda eski→yeni tutar saklanır, kalem Onaylanan tutarları güncellenir.
   - İsteğe bağlı bir kesintiyi "Bütçeye işlendi · Rev.N" olarak kapatır. O kesinti aynı projenin bir diliminden olmalı.
   - Revizyon geri alınamaz: geri alma ucu yok.
7. **Görev bütçesi:**
   - Kalem görevin projesine ait olmalı.
   - **Aynı kalemdeki görev planlarının toplamı kalemin Onaylanan tutarını aşamaz** ("…istenen toplam: X").
   → Görev formunda kalan dağıtılabilir tutar gösterilmeli. (`ProjectBudgetManager.cs:251-284`)
8. **Aktarım sınırı yalnız gösterilir;** kalemler arası aktarım akışı yok.

#### 8.4.5 Fon dilimi, tahsilat ve kesinti

Hepsi Bütçe Düzenleme ya da Proje Düzenleme izni ister.

1. Planlanan tutar >0 olmalı. Sıra numarası otomatiktir.
2. **Tahsilat kümülatif girilir** (o güne kadar gelen toplam). Durum tutardan türer (`FundingTranche.cs:124-134, 197-207`):
   - Tahsil edilen 0 → Bekliyor.
   - Tahsil edilen ≥ Beklenen (Planlanan − kesintiler) → Tahsil edildi.
   - Diğer → Kısmi tahsil.
   → Form "toplam gelen tutar" diye etiketlenmeli, "eklenen tutar" değil.
3. **"İtiraz sürecinde" elle işaretlenir ve tutar değişse de korunur.** İşaret kaldırılınca durum yeniden türetilir (`:137-149`).
4. **Tahsilata bağlanacak gelir kaydı:** aynı kiracıda, aynı projede olmalı ve **başka bir dilime bağlı olmamalı.** Tahsilat 0'lanırsa bağ kopar (`ProjectBudgetManager.cs:180-207`).
5. **Tahsilat otomatik gelir ya da kasa kaydı üretmez.** Gelir ayrıca girilip bağlanır (FIN-13, OPS-04 açık).
6. **Kesinti:** tutar >0, gerekçe zorunlu. **Kesinti toplamı dilimin planlanan tutarını aşamaz** (`FundingTranche.cs:151-169`).
   - Kesintinin çözümü: Açık → "Finanse edilmeyen" (bütçe aynı kalır) ya da "Bütçeye işlendi" (revizyonla).
   - "Yeniden aç" kararı geri alır (`TrancheDeduction.cs:65-83`).
7. **Dilim silmenin hiçbir koruması yok.** Tahsil edilmiş, gelire bağlı dilim de silinir (`ProjectBudgetAppService.cs:612-617`).
   → Tasarımda onay penceresi önerilir; sunucu korumuyor.
8. **Hibe dönüşümü uyuşmazlığı** (`D/ProjectBudgets/GrantLedgerSync.cs:28-47`):
   - Uyuşmazlık sayılan iki durum: hibe dilimi "Ödendi" ama proje dilimi tam tahsil edilmemiş; ya da proje dilimine para girmiş ama hibe dilimi ödenmemiş görünüyor.
   - Başvurudaki kalem tutarı proje kaleminin Planlanan tutarından farklıysa kalem "bayat" sayılır.
   → Bu iki durum rozetle gösterilir. Hangi kaydın doğru olduğuna karar verilmez.

#### 8.4.6 Kur, kur köprüsü ve değerleme

1. **Kur kaydı:** iki para birimi farklı olmalı, oran >0. Elle düzenlenen kayıt "Elle" kaynağına döner.
   - "TCMB'den Güncelle" düğmesi USD/EUR/GBP için **alış kurunu** bülten tarihiyle yazar ve var olan kaydın üzerine yazar.
   - Gelecek bir tarih ya da tatil günü için kur alınamaz (`A/ExchangeRates/ExchangeRateAppService.cs:26, 81-130`).
2. **Otomatik TCMB çekimi:** saatlik iş, iş günlerinde. Yalnız dövizli projesi olan kiracılara yazar ve var olan kayda dokunmaz (`A/ExchangeRates/TcmbDailySync.cs` başlık notu).
3. **Kur arama sırası** (`D/ProjectBudgets/FxRateResolver.cs:92-122`):
   - Hedef tarihe kadarki en güncel kur aranır.
   - Aylık politikada önce o ayın kurları aranır, yoksa tarihe kadarki en güncel kur kullanılır.
   - Doğru yönde kur yoksa ters yönde girilmiş kur 1/oran olarak kullanılır.
   - Aynı güne birden çok kur girilebilir; hangisinin seçileceği kodda belirsiz.
4. **Politikanın belirlediği gün** (`FxRateResolver.cs:38-86`):
   - Harcama günü kuru: kaydın kendi günü.
   - Dilim (tahsil) kuru: kayıt tarihine kadar tahsil edilmiş son dilimin tahsilat günü. Hiç tahsil edilmiş dilim yoksa harcama günü kullanılır.
   - Aylık donör kuru: kaydın ayı.
   - Sabit sözleşme kuru: sorgu yapılmaz, `FixedDonorRate` kullanılır.
5. **Kur köprüsü ayarı** (`Project.SetFxBridge`):
   - Donör para birimi proje para biriminden farklı olmalı.
   - "Sabit sözleşme kuru"nda kur değeri zorunlu.
   - Donör para birimi boşaltılınca politika ve sabit kur temizlenir.
   - **Politika değişikliği kayıtları yeniden hesaplamaz.** Kullanıcı önce etkilenen kilitli kayıt sayısını görür, sonra "Yeniden hesapla"ya basar. Yeniden hesaplama projenin bütün gider ve gelirlerini yeniden damgalar ve "hâlâ kuru eksik" sayısını döner. (`A/ProjectBudgets/ProjectFxAppService.cs:57-70, 144-182`)
6. **Yıl Sonu Değerleme** (`A/FxRevaluations/FxRevaluationAppService.cs:56-89`):
   - Yalnız aktif kasaları kapsar.
   - Kasanın bakiyesi değerleme tarihine kadarki hareketlerle hesaplanır.
   - TL karşılığı = Bakiye × kur (tarihe kadarki en güncel kur, ters kur yedeğiyle). TRY kasada kur aranmaz.
   - Yabancı para kasası için kur yoksa değerleme **toptan reddedilir** (`FxRevaluationCalculator.cs:14-25`).
   - Kur farkı saklanmaz; ekran "ardışık değerlemeler arası fark" diye anlatıyor. Karşılaştırma görünümü kodda yok (kodda belirsiz).
   - Yalnız Premium/Enterprise paketlerinde açılır.

#### 8.4.7 Hesaplama formülleri

```
Fatura toplamı        = Σ(Miktar×BirimFiyat) × (1 + KDV%/100)        [istisnada KDV%=0]
KDV dahil → hariç     = BirimFiyat × 100 / (100 + KDV%), kuruşa yuvarla
Fatura bakiyesi       = Toplam − Σ Ödeme
Kalem harcanan        = Σ Gider.Amount (o kaleme bağlı)   ← fatura SAYILMAZ
Kalem kalan           = Onaylanan − Harcanan
Kalem kullanım %      = round(Harcanan / Onaylanan × 100)   [Onaylanan 0 ise 0]
Kalem aşımı           = Onaylanan > 0 ve Harcanan > Onaylanan
Hibe payı (kalem)     = elle girilen ise min(GrantAmount, Onaylanan);
                        değilse round(Onaylanan × DestekOranı/100, 2); ikisi de yoksa "bilinmiyor" (null, 0 değil)
Kurum payı            = Onaylanan − Hibe payı;  Kurum oranı = 100 − Destek oranı
Destek oranı          = Project.SupportRatePercent ?? Grant.SupportRatePercent
Proje hibe payı topl. = kalemler varsa Σ kalem payı (biri bile null ise toplam null);
                        kalem yoksa round(TotalBudget × oran/100, 2)
Sözleşme bütçesi      = kalem varsa Σ Planlanan, yoksa TotalBudget
Onaylanan bütçe       = kalem varsa Σ Onaylanan, yoksa TotalBudget
Gelen para (MoneyIn)  = dilim varsa Σ Dilim.Tahsil edilen, yoksa Σ Gelir.Amount  (ikisi toplanmaz)
Bekleyen fon          = max(0, Σ Planlanan dilim − Σ Tahsil edilen − Σ Kesinti)
Dilim beklenen        = max(0, Planlanan − Σ Kesinti);  Dilim kalan = max(0, Beklenen − Tahsil edilen)
Kullanılabilir nakit  = Gelen para − Harcanan          (Portföyde < 0 → "nakit riski")
Kalan bütçe           = Onaylanan bütçe − Harcanan (projeye bağlı TÜM gider, kalemsiz dahil)
Bütçe kullanım %      = round(Harcanan / Onaylanan bütçe × 100)
Fonlama %             = round(Gelen para / Onaylanan bütçe × 100)
Kalemsiz harcama      = projeye bağlı ama kalemsiz gider toplamı
Görev matrisi         = Dağıtılmamış = max(0, Kalem Onaylanan − Σ görev planı)
Kasa bakiyesi         = Açılış + Σ Giriş − Σ Çıkış   (kasanın para biriminde)
₺ defter              = Amount × BookRate (TRY'de 1; kur yoksa 0)
Donör karşılığı       = Amount × DonorRate (kur yoksa boş)
Kur köprüsü           = Donör net = Σ donör gelir − Σ donör gider; ₺ net aynı şekilde
Değerleme TL          = Bakiye × kur;  Toplam = Σ satır
Bütçe uyarı eşikleri  = %50, 75, 90, 100 (host ayarı) — kalem bazında
Hibe başvurusu desteği= kalem × program oranı → kalem limiti (proje toplamı × N% × oran) ile kırp
                        → toplam program üst limitini aşarsa orantılı kırp  (D/Grants/GrantBudgetCalculator.cs:7-15)
```

Kaynaklar: `AC/ProjectBudgets/ProjectBudgetDtos.cs:40-80, 203, 307-367, 412-451, 474-512`; `A/ProjectBudgets/ProjectBudgetAppService.cs:84-132, 286-372`.

> ⚠ **FIN-02 (karar bekliyor):** Bütün toplamlar ham `Amount` üzerinden yapılıyor; para birimi karıştırılıyor. 100 USD + 1.000 TRY = 1.100 "proje para birimi" sayılıyor. Kalem ve proje göstergeleri bu yüzden çok para birimli projede yanlış. Portföy toplamları para birimine göre ayrı tutuluyor (`IsMixedCurrency`). Tasarım "tek para birimi göstergesi" varsaymamalı.


## 9. İzinler ve roller

Roller:
- **Admin** = statik kiracı yöneticisi. Bütün izinlerin ona verilmesi ABP'nin varsayılan davranışı; bunu burada ayrıca doğrulamadım.
- **PS** = Proje Sorumlusu, **Muh** = Muhasebe, **Göz** = Gözlemci (`A/Tenants/TenantRoleTemplates.cs:34-116`).

Paket kapıları:
- Finans izinleri `Finance` özelliğine bağlı. Bu özellik dört pakette de açık.
- `FxRevaluations` ve `Reports.TrialBalance` ayrıca `AdvancedReports` ister; o da yalnız Premium/Enterprise'da var.
- `Projects.ViewBudget` ve `Projects.ManageBudget` paket kapısına bağlı değil.
- Kaynak: `AC/Permissions/PlatformPermissionDefinitionProvider.cs:19-29, 70-130`.

| İzin | Türkçe ad | Ne açar | PS | Muh | Göz |
|---|---|---|---|---|---|
| Projects.ViewBudget | Bütçe Görüntüleme | Finans Merkezi'nde Bütçe kalemleri, Dilimler, Donör ve Kur köprüsü sekmeleri; Genel'deki göstergeler; proje detayındaki Finans sekmesi; bütçe raporu; finans bildirimleri | ✓ | ✓ | ✓ |
| Projects.ManageBudget | Bütçe Düzenleme (kalem, fon dilimi, revizyon) | Kalem, dilim, tahsilat, kesinti, revizyon, destek oranı, KDV istisnası ve kur politikası yazma. Proje Düzenleme de aynı hakkı verir | ✓ | ✓ | – |
| Projects.Edit | Proje Düzenleme | Bütçe yazmanın alternatif yolu; "Projeyi yapılandır" | ✓ | – | – |
| Incomes(.Create/.Edit/.Delete) | Gelirler / Oluşturma / Düzenleme / Silme | Gelir-Gider sekmesi, `/Incomes`, "Gelir ekle". Belge bağlamak için Düzenleme izni gerekir | yalnız görme | ✓ tümü | görme |
| Expenses(.Create/.Edit/.Delete) | Giderler / … | Gelir-Gider sekmesi, `/Expenses`, "Gider ekle", "Masraf yakala", içe aktarma (Oluşturma) | yalnız görme | ✓ tümü | görme |
| Invoices(.Create/.Edit/.Delete) | Faturalar / … | Faturalar sekmesi ve `/Invoices`. Ödeme ekleme **Düzenleme** izni ister. Silme izninin karşılığı olan bir eylem **yok** | yalnız görme | ✓ tümü | görme |
| CashAccounts(.Create/.Edit/.Delete) | Kasalar / … | Kasa sekmesi, `/CashAccounts`, Genel'deki "Kasa & Banka" kartı | **–** | ✓ tümü | görme |
| CashMovements(.Create/.Edit/.Delete) | Kasa Hareketleri / Hareket … | Elle hareket ve **transfer** (Oluşturma izniyle) | – | ✓ tümü | görme |
| ExchangeRates(.Create/.Edit/.Delete) | Kurlar / … | `/ExchangeRates`, "TCMB'den Güncelle" (Oluşturma izniyle) | – | ✓ tümü | görme |
| FxRevaluations(.Run/.Delete) | Yıl Sonu Değerleme / Değerleme Çalıştırma / Silme | `/FxRevaluations` (gelişmiş paket) | – | ✓ tümü | görme |
| Reports(.TrialBalance) | Raporlar / Mizan Raporu | Mizan (kapsam dışı) | – | ✓ | ✓ |
| Customers(.*) | Cariler | Kapsam dışı, gizli | görme | ✓ | görme |
| Documents | Belgeler | Belgeler sekmesi; fiş ve dekont ekleme | ✓ | görme | görme |
| DataTransfer(.Export/.Import/.ManageTemplates) | İçe / Dışa Aktarma | Excel aktarımı | ✓ | ✓ | Default + Export |
| DataTransfer.FullParameters | Tüm parametrelerle toplu aktarım (sistem yöneticisi) | Kiracı seçerek gider, gelir ve fatura tam aktarımı. **Yalnız host** | – | – | – |

Tasarıma etkileri:
- **Proje Sorumlusu gider, gelir ve fatura oluşturamaz; kasayı hiç görmez.** Görev penceresindeki "Gider Ekle" gibi girişler bu rol için gizli olmalı.
- Muhasebe projeyi düzenleyemez, ama bütçeyi düzenleyebilir.
- Finans Merkezi sayfasına girmek için şu beş izinden biri yeterli: ViewBudget, Incomes, Expenses, Invoices, CashAccounts. Her sekme kendi iznine göre süzülür; yetkisiz sekmeye adresle girilirse ilk sekmeye düşülür (`W/Pages/Finance/FinanceContext.cs:102-109`; `Index.cshtml.cs:584-617`).

---

## 10. Gezinme, bildirimler ve açık denetim bulguları

### 10.1 Menü ve gezinme

- **Masaüstü:** Menüde "Finans & Bütçe" grubunun altında **tek görünür öğe "Finans Merkezi"** (`/Finance`) var. Kasa & Banka, Kurlar, Cariler, Proje Bütçesi raporu, Cari Ekstre, Mizan ve Yıl Sonu Değerleme menüden yorum satırıyla kaldırılmış. Giderler, Gelirler ve Faturalar da menüde yok (`W/Menus/PlatformNavigationResolver.cs:740-831`).
- **Mobil:**
  - Alt sekme çubuğunda 3. sıradaki "Finans" bir panel açar; panelde yalnız Finans Merkezi var (`W/wwwroot/js/sidebar-toggle.js:376, 850-869`).
  - Varsayılan iğneler: Finans Merkezi ve Hibe talepleri (`D/Settings/PlatformSettings.cs:582`).
  - PWA kısayolu: "Masraf Ekle" → `/Expenses/Capture`.
- **"+ Yeni", Hızlı İşlemler (`/Makro`) ve komut paleti:** Masraf yakala, Gider ekle, Gelir ekle, Fatura ekle, Kasa hareketi. Her öğe ilgili Oluşturma iznine bağlı (`AC/Macros/MacroCatalog.cs:31-36`).
- **Finans Merkezi sekmeleri ve şablonlar:**

  | Sekme | Kurumsal | Hibe | Etkinlik |
  |---|---|---|---|
  | Genel | ✓ | ✓ | ✓ |
  | Bütçe kalemleri | ✓ | ✓ | ✓ |
  | Dilimler & kesintiler | ✓ | ✓ | – |
  | Gelir-Gider | ✓ | ✓ | ✓ |
  | Faturalar | ✓ | ✓ | ✓ |
  | Donör & raporlama | – | ✓ | – |
  | Kur köprüsü | – | ✓ | – |
  | Kasa | ✓ | ✓ | ✓ |
  | Belgeler | ✓ | ✓ | ✓ |

  Her şablonda bulunmayan sekme mor noktayla işaretleniyor. Seçim `?projectId=&tab=` adresinde taşınıyor.
- **Menüde olmayan, adresle ya da sayfa içinden açılan sayfalar:**
  - `/Invoices`, `/Invoices/Print/{id}`
  - `/Expenses`, `/Expenses/Capture`, `/Incomes`
  - `/CashAccounts`: yalnız hiç hesap yokken boş durum metninden.
  - `/ExchangeRates`: Kur köprüsü sekmesinden.
  - `/FxRevaluations`: hiçbir yerden bağlantı yok.
  - `/Reports/ProjectBudget`: Excel/PDF bağlantıları ve bildirim derin bağlantısı.
  - `/Reports/TrialBalance`, `/Reports/CustomerStatement`, `/Customers`: kapsam dışı.
  - Pencereler: `/Projects/BudgetSummaryModal`; `/Finance/*Modal` (Kalem, Dilim, Tahsilat, Kesinti, Revizyon, Destek oranı, KDV istisnası, Kur politikası, Bağlam sihirbazı, Kalem içe aktarma, Gelir belgesi).
  - Eski sayfalardan `/Finance`'a geri dönen bağlantı yok.
- **Proje detayı:** "Finans" sekmesi Bütçe Görüntüleme izniyle görünür ve her kategoride aynıdır. İçinde göstergeler, kalem tablosu ve görev kırılımı var; dilim bölümü yok. Üst çubukta "Bütçe" menüsü var.
- **Host bağlamı** (`HostScope`):
  - Proje seçicide bütün kiracıların projeleri listeleniyor.
  - Genel, Bütçe kalemleri, Dilimler, Kur köprüsü ve Portföy kiracı verisiyle dolu geliyor; host izin varsa bu verilere **yazabiliyor**.
  - Gelir-Gider, Faturalar, Kasa ve Belgeler sekmelerinde sorgu atılmıyor; yerine bir kilit metni basılıyor (`tr.json:477`).
  - Portföy kipinde tutarsızlık var: tablo bütün kiracıları toplarken "Son İşlemler" ve "Kasa & Banka" kartları yalnız host kayıtlarını gösteriyor. Bunu çalıştırarak doğrulamadım.

### 10.2 Bildirimler

Ayrı bir `*Eto` olayı yok; hepsi `NotificationManager` ile yazılıyor, kategorisi "Finans".

| Tür | Tetikleyici | Önem | Alıcı |
|---|---|---|---|
| Bütçe revizyonu uygulandı | Revizyon | Normal | Proje Lead'leri (yoksa oluşturan), Bütçe Görüntüleme iznine göre süzülmüş; işlemi yapan hariç |
| Bütçe kullanım eşiği | Kaleme bağlı gider kaydı ve günlük tarama; yalnız en yüksek eşik | Yüksek | aynı |
| Bütçe aşımı | Aynı yollar; Onaylanan aşılınca | **Kritik** (tek anında e-posta adayı) | aynı |
| Dilim tahsil edildi | Tahsilat | Bilgi | aynı |
| Dilim gecikti | Günlük tarama: planlanan tarih < bugün ve durum Bekliyor | Yüksek | aynı |
| Kesinti eklendi | Kesinti | Yüksek | aynı |
| Dilim itirazı | İtiraz işareti açılınca | Normal | aynı |
| Fatura gecikti ("Tahsilatı/Ödemesi geciken fatura") | Saatlik tarama: son 30 günde vadesi geçmiş, ödenmemiş faturalar | Yüksek | Faturayı kesen kişi ve Lead'ler, Faturalar iznine göre süzülmüş |

- Derin bağlantılar: bütçe bildirimleri `/Reports/ProjectBudget?ProjectId=`, fatura bildirimi `/Invoices?invoiceId=`.
- Kur, eksik kur, düşük kasa ve değerleme için bildirim **yok**.
- Finans e-postası varsayılan olarak kapalı; web push için tarayıcı aboneliği gerekiyor.
- Kaynaklar: `DS/Notifications/NotificationTypeRegistry.cs:294-321`, `A/ProjectBudgets/BudgetRiskEvaluator.cs`, `D/Invoices/InvoiceOverdueNotifier.cs`.

### 10.3 Açık denetim bulguları (belgelerdeki durumlar 14–18 Ekim 2026 tarihli)

| Kimlik | Özet | Durum |
|---|---|---|
| FIN-02 | Toplamlar para birimi karıştırıyor; BookAmount önerisi çürütüldü, alternatif B öneriliyor | **Karar bekliyor** |
| FIN-13 / OPS-04 | Dilim tahsilatı gelir ya da kasa kaydı üretmiyor; doğruluk kaynağı ürün kararı | Açık / Kısmen |
| CNV-01 / CNV-04 | Dönüşüm ikinci bir gelir defteri açıyor; para birimi aktarılmıyor | Kısmen (karar bekliyor) |
| FIN-08 | Kur yokken ₺ karşılığı 0 saklanıyor ve toplamlarda 0 sayılıyor | Kısmen |
| FIN-09 | Kasa hareketindeki ReferenceId tek kolonda dört anlam taşıyor | Kısmen |
| FIN-10 | "Gecikmiş" okunurken hesaplanıyor; "İptal" atanmıyor, iptal ya da ters kayıt akışı yok | Kısmen |
| FIN-12 | Genel Bakış bütçeyi proje toplam alanından okuyor | Sicilde kapandı; geliştirme taraması "bir ayağı açık" diyor |
| FUX-03 | Kasa hem sekmede hem ayrı sayfada; bakiye yükleyicisi iki kopya | Açık |
| FUX-04 | Hibe finansı 6–10 ekran istiyor; fatura, kur ve düzenleme hâlâ ayrı | Kısmen |
| FUX-08 | Gelir-Gider, Donör ve Kur köprüsü aynı satırları üç biçimde gösteriyor | Açık |
| FUX-11 | Pencereler kayıttan sonra tam sayfa yeniliyor | Açık |
| RPT-03 | Hibe ile rapor motoru arasında üretim bağı yok | Kısmen |
| RPT-08 | Rapor dönemi serbest metinle süzülüyor; tarih aralığı yok | Açık |
| NTF-06 | Proje nakit dengesi ya da "kaynak azalıyor" eşiği yok | Açık |
| NTF-12 | Bütçe aşımı alıcı kümesi boş kalabiliyor; yedek alıcı yok | Kısmen |
| PRJ-11 | Proje para birimi ekrandan ayarlanamıyor | Açık |
| PERF-002 | Kur aramaları önbelleğe alınmıyor | Açık (bilinçli) |
| H-21, H-03, H-06 (hibe denetimi) | Hibede para birimi; dilim statüsünün doğrudan yazılması; eksi tutar kabulü | Durum belgede belirsiz |
| FIN-11, RPT-05, FUX-10 | Cari ve Mizan | Kapsam dışı |

Notlar:
- Kasım işleri bu sicile işlenmemiş: #929 fatura içe aktarma, #935 müşteri seçicisinin gizlenmesi, #936 kasasız gider.
- Geliştirme taramasının (18 Ekim) finans önerileri, hepsi öneri durumunda:
  - F-01 Masraf Yakala: dürüst form
  - F-02 Fiş ve e-Arşiv okuma
  - F-03 Fatura yaşam döngüsü
  - F-04 Alış faturası ve gider tek akış
  - F-05 Dönem, sayfalama ve dışa aktarma
  - F-06 Kur otomasyonu
  - F-07 Cari
  - F-08 Kasa defteri
  - F-09 Banka hareketi eşleştirme
  - F-10 Nakit akışı tahmini
  - F-11 Harcama onay akışı
  - F-12 Destek oranı, uygunluk ve donör raporu
  - F-13 e-Fatura
  - F-14 ERP aktarımı
  - F-15 Finans Merkezi bilgi mimarisi
  - X-04 Ortak liste deseni
  - X-05 Vaat süpürmesi
- Taramadaki "fatura düzenleme yok" gözlemi **eskimiş**: kodda düzenleme artık var. "Tek KDV oranı", "fatura TRY'ye kilitli" ve "ödeme tarihi hep şimdi" gözlemlerini kodda doğruladım.

### 10.4 Denetim belgelerinde olmayan, kodda görülen boşluklar

1. Fatura silme ve iptal ucu yok; `Invoices.Delete` izni ölü. Ödeme silme ya da geri alma da yok.
2. Ödeme penceresinin varsayılan tutarı fatura toplamı, kalan bakiye değil. Fazla ödeme de engellenmiyor. Kısmen ödenmiş faturada çift tahsilat riski var.
3. Fon dilimi silmenin koruması yok; tahsil edilmiş ve gelire bağlı dilim de siliniyor.
4. Kasa bakiyesi eksiye düşebilir.
5. Aynı gün ve çift için birden çok kur girilebilir; seçim belirsiz.
6. Kalem kodu ve adı uzunluk sınırını aşınca hata vermeden kırpılıyor. Ekranda `maxlength` 32/128 olmalı.
7. Fatura numarası tekilliği yalnız veritabanı indeksinde. Ekranda hangi hata mesajının göründüğü bulunamadı (kodda belirsiz).
8. Genel Bakış "onay bekleyen tutar" gösteriyor (Taslak faturalar), ama onay iş akışı yok.
9. `IInvoiceAppService.cs:16`'daki "yalnız Taslak düzenlenir" yorumu gerçek davranışla çelişiyor.

---

## 11. Durum kataloğu (tasarımda her biri çizilmeli)

| Durum | Bugün nasıl | Kural |
|---|---|---|
| **Yükleniyor** | Sunucu render: yok (sayfa dolu gelir). AJAX listelerde (Faturalar) 6 iskelet satır + "Yükleniyor…". Pencere açılırken ve sayfa geçişinde APYA işareti animasyonlu katman (250 ms sonra görünür). | Spinner yerine APYA işareti (K7). Solma geçişi yok. |
| **Boş** | `_EmptyState`: ikon balonu + başlık + açıklama + isteğe bağlı eylem. Metinler §6–§7'de aynen. | Boş durum **ne yapılacağını** söyler ("Kalem tanımlayana kadar bütçe tek tutar olarak yönetilir…"). |
| **Süzgeç boş** | "Süzgece uyan kalem yok." / "Eşleşen fatura bulunamadı" + "Filtreleri temizle" | Boş durumdan ayrı: veri var ama süzgeç eliyor. |
| **İzin yok (kilit)** | Kilit varyantı: "Son işlemleri görme yetkiniz yok." + hangi iznin gerektiği. KPI şeridinde nötr çip "🔒 Bütçe özetini görme yetkiniz yok." | **"Okunamadı ≠ yok"**: yetki yoksa "kayıt yok" denmez. Bugün her yerde uygulanmıyor (§6.5 madde 10). |
| **Host kapsamı** | Kilit kartı: "Kiracı kayıtları platform yönetim hesabından görünmez; kiracının hesabından (Hesabına Gir) bakın." | Platform yöneticisi kiracı projesine bakarken; hangi sekmelerde çıktığı §6.0'da. |
| **Hata** | Hata varyantı: soluk balon + uyarı üçgeni + "Tekrar dene" (`Common:FetchError`). Faturalar: "Faturalar yüklenemedi." | — |
| **Satır içi eksik veri** | "kur yok" (gri, ipuçlu), "—", "Bağlı değil", "kaleme yazılmamış" (italik gri) | Eksik değer ile sıfır ayrışır. |
| **Kesik / sınır notu** | "ⓘ Liste kaynak başına en fazla 100 kayıt gösterir; toplam bu kesitin toplamıdır…" | Kullanıcı eksik görünümü bilmeli. |
| **Uyarı şeridi** | Amber: "⚠ N kaydın kuru girilmemiş; ₺ toplamına dahil değil." · "⚠ ₺X tutarındaki kesinti finanse edilmeyen olarak bırakıldı…" | Toplamın altında, toplama neyin girmediğini söyler. |
| **Onay penceresi** | Ortak `data-confirm` (tehlike varyantı kırmızı): "Kalem silinsin mi?", "Dilim ve kesintileri silinsin mi?", "Gider ve bağlı kasa hareketi silinecek: {başlık}?" | Bugün tutarsız: bazı geri alınabilir işlemler onaysız, bazıları onaylı (§6.5 madde 24). |
| **Başarı geri bildirimi** | Finans Merkezi: bildirim YOK, sayfa yenilenir. Bağımsız sayfalar: "Gider silindi.", "Fatura güncellendi." bildirimi. | Tek desen seçilmeli (§13). |
| **Çevrimdışı** (yalnız Masraf Yakala) | Sarı "Çevrimdışı" çipi, "{n} bekliyor" kuyruğu, "Bağlantı yok — kayıt cihazda saklanır…" | — |

---

## 12. Mobil

- **Kırılımlar:** <768 px telefon (alt çubuk, çip 30 px) · 768–1199 px kenar çubuğu otomatik ray (72 px) ·
  ≥1200 px tam kenar çubuğu (280 px). Faturalar ana-detay 992 px altında tek panele düşer.
- **Bugün:** Finans Merkezi'nin bağlam çubuğu mobilde kart değil, kendi 12 px kuralıyla; sekme şeridi yatay
  kayar; tablolar yalnız **yatay kaydırma** ile sığar (kart görünümüne dönüşmez). Gelir/gider/kur listeleri
  DataTables "nowrap". Bütçe kalemleri gibi 9 sütunlu tablolar telefonda pratikte okunmuyor.
- **Mobil öncelikli tek ekran:** Masraf Yakala (§7.3) — alttan açılan form, ≥44 px dokunma hedefi, kamera
  doğrudan açılır, çevrimdışı kuyruk.
- **Mobilde gerçek kullanım (tahmin değil, ürün içi işaret):** alt çubuktaki "Finans" günlük dört kısayoldan
  biri; PWA kısayolu "Masraf Ekle". Yani telefonda en sık iş: **gider girmek** ve **durum bakmak**
  (Genel sekmesi, Kasa bakiyesi, son işlemler).
- **Tasarımdan beklenen:** Genel + Gelir-Gider + Kasa'nın telefon hâli (tablo → kart/satır listesi),
  Masraf Yakala akışının yeni dille hâli, pencerelerin telefonda tam ekran sayfa hâli.

---

## 13. Öncelikli sorunlar — tasarımın çözmesi beklenenler

§6.5 (25 madde) ve §7.11 (21 madde) ham listelerdir. Aşağıda **tema bazında** toplandı; her temada
**[T]** = tasarımla çözülür, **[K]** = davranış/kural değişikliği gerektirir (tasarım önerebilir, karar
kullanıcının — §15).

1. **Tek kayıt listesi deseni yok [T].** Aynı tür veri için dört kalıp: Faturalar ana-detay · Gider/Gelir/Kur/
   Değerleme DataTables · Kasa kartlar + elle tablo · Gelir-Gider sunucu tablosu. Sıralama/arama/sayfalama
   kimi yerde var kimi yerde yok. → Tek liste deseni: başlık + süzgeç çipleri + tablo + toplam satırı + kesik
   notu + satır eylemleri; mobilde satır kartı. (§6.5-17, §7.11-1, §7.11-16)
2. **Para gösterimi dağınık [T].** Önek/sonek, kuruşlu/kuruşsuz, birimsiz tablolar, sabit "₺" (§3.5).
   → Tek kural + KPI/tablo/toplam için üç kademe. (§6.5-8, §7.11-4, §7.11-5)
3. **KPI tonu görünmüyor [T].** Aşım, nakit riski, eksik kur yalnız gizli ikon kutusunda renkleniyor; değer
   ve kart nötr kalıyor. → Tonlu KPI (renk + simge + metin, K10). 6 kartın 3×2 zorunluluğu (Türkçe etiket
   uzunluğu) çözülmeli. (§6.5-1)
4. **Yoğun eylem alanları, yalnız ikonlu satır eylemleri [T].** Bütçe kalemleri başlığında 7 düğme; dilim
   satırında 5 etiketsiz ikon; tokmağın iki hâli yalnız renkle ayrışıyor. → Birincil eylem + "Diğer" menüsü,
   satır sonu ⋯ menüsü, etiketli ikon. (§6.5-6, §6.5-7)
5. **Adlandırma tutarsızlıkları [T].** "Finans Merkezi"/"Finans"; "Dernek etkinliği"/"Etkinlik";
   "Planlanan" üç anlamda; vade dört adla; kategori etiketleri üç yazımda; "Konsolide"/"Toplam" bakiye.
   → Tasarım terim sözlüğü önermeli (bkz. §8 kavram sözlüğü). (§6.5-2, §7.11-3, §7.11-10)
6. **"Açık bırak" tam tersini yapıyor [T].** Kesinti kararında "Açık" = karar yok; "Açık bırak" = finanse
   edilmeyen olarak kapat. → Karar dilini yeniden kur: *Bütçeye işle* / *Finanse edilmeyen olarak kapat* /
   *Karar bekliyor*. (§6.5-3)
7. **Aynı bilgi birden çok yerde [T].** Donör KPI = Kur köprüsü donör defteri; belgesiz harcama Donör'de ve
   Belgeler'de farklı birimle; teslim paketleri iki sekmede iki sütun setiyle; hesap listesi Genel ve Kasa'da.
   → Her bilginin tek sahibi, diğer yerlerde özet + bağlantı. (§6.5-4, §6.5-18)
8. **Ulaşılamayan ekranlar ve bağlam kaybı [T][K].** Kasa & Banka tam görünümü, Kurlar, Değerleme, Proje
   Bütçe raporuna yol yok; satır başlıkları projesiz listeye gidiyor. (§5.4, §6.5-11, §7.11-13)
9. **Fatura durum modeli yanıltıcı [K], detay eksik [T].** "Taslak" = ödeme yok, "Gönderildi" = kısmi
   ödeme; İptal'e ulaşan yol yok; "Gecikmiş" hesaplanan bayrak. Detayda kalan tutar ve ödeme geçmişi yok;
   tahsilat penceresinde toplam/ödenen/kalan görünmüyor, varsayılan tutar genel toplam. Yazdırma/PDF fatura
   yönünü basmıyor. (§7.11-6…9)
10. **Para hareketinde güvence [K].** Hızlı Transfer onaysız, tarihsiz, açıklamasız; izinsiz kullanıcıya da
    görünüyor; hesaplar yüklenemezse sonsuz "yükleniyor". Onay asimetrisi. İzne bağlanmamış düğmeler
    ("Yeni Gider", "Transfer", "Yeni Değerleme"). (§6.5-16, §6.5-24, §7.11-15)
11. **Marka kararıyla çelişen görseller [T].** Kasa toplam bakiye kartı **degrade** (accent 500→700) — marka
    kılavuzu degrade yasaklar; donör para birimi çipi **mor AI tonu** (`chip-ai`) — AI ikonu/tonu yalnız
    gerçek yapay zekâda (K8). Tüm indigo vurgular `#123B63`'e döner (K5).
12. **Gizli müşteri alanı sızıyor [T].** Fatura araması, Excel "Müşteri" sütunu, yazdırma, gelir ipucu
    ("cari seçseniz bile") hâlâ cariden söz ediyor. Tasarımda müşteri/cari **hiç** görünmemeli (K3). (§7.11-11)
13. **Kasa yönetimi eksik [T][K].** Kasa düzenleme penceresine yol yok, silme yok, pasif kasa kayboluyor ve
    geri açılamıyor; hareket tablosunda kaynak sütunu yok ve neden düzenlenemediği yazmıyor. (§7.11-14, -16)
14. **Mobilde tablolar okunmuyor [T].** (§12)

---

## 14. Teslimatlar — tasarımdan istenen ekranlar

**Biçim:** önceki APYA tasarım paketleriyle aynı: tek `.dc.html` dosyasında her ekran bir `id` ile
(`#1a`, `#2b`…), ayrıca "hangi id hangi ekran" tablosu içeren bir handoff README. **Hi-fi**; renk/yazı/ölçü
§3 token'larından (K5 paletiyle). Kabuk (§4) her masaüstü ekranında çizilir. Metinler Türkçe, §6–§7'deki
ifadelerle. Örnek veri **uydurma ama gerçekçi**: hayalî kurum ve proje adları, ₺ ve EUR tutarlar,
4 düzeyli bir bütçe kalem ağacı, 3 dilimli bir hibe projesi (biri kesintili, biri itirazlı).

| id | Ekran | Ölçü | Kapsadığı |
|---|---|---|---|
| 1a | **Finans Merkezi · Genel · Hibe projesi** (tam kabuk) | 1440×1100 | bağlam çubuğu, sekme şeridi (mor noktalar), 6 tonlu KPI, fonlama akışı, Son İşlemler, Kasa & Banka |
| 1b | Genel · Portföy (Tüm projeler) — tek PB ve karışık PB hâli | 1440×1000 | portföy KPI, projeler tablosu (durum çipleri: Nakit riski / Bütçe aşımı / Kesinti itirazı / Sağlıklı) |
| 1c | Genel · Kurumsal proje, dilimsiz | 1280×800 | KPI'ın "Gelir" varyantı, fonlama kartı yok |
| 2a | Bütçe kalemleri · liste kipi | 1440×1000 | başlık çipleri, eylem gruplaması, süzgeç, 4 düzey ağaç, aşım, elle hibe payı (*), toplam satırı, kalemsiz harcama notu |
| 2b | Bütçe kalemleri · matris (Kalem → görev / Görev → kalem) | 1440×900 | kalem bandı, görev satırları, uyarı çipleri, "Göreve bağlanmamış" |
| 2c | Dilimler & kesintiler | 1440×900 | denklem kartı, dilim tablosu, kesinti alt satırları, kesinti kararı dili (§13-6), itiraz |
| 2d | Pencereler: Kalem · Revizyon (iki kip) · Dilim · Tahsilat · Kesinti · Destek oranı · KDV istisnası | 720×var | §6.2 alanları; canlı ipucu satırları; hata hâlleri |
| 2e | Bağlamı kur + Excel'den içe aktar (önizleme hatalı/hatasız) | 960×720 | §6.2 ContextWizard, ortak içe aktarma penceresi §7.9 |
| 3a | **Gelir-Gider** | 1440×1000 | süzgeç çipleri (Tür/Kalem/Kasa/Dönem), donör sütunu, "kur yok", ₺ defter toplamları, uyarılar, kesik notu |
| 3b | Gelir / Gider penceresi | 720×var | bütçe kalemi kalan/aşım çipi, kasa isteğe bağlı (K4), proje tarih aralığı hatası, belge ekle, fatura çapraz uyarısı |
| 4a | **Faturalar** (Finans Merkezi içinde, ana-detay) | 1440×1000 | liste + detay; kalan tutar ve ödeme geçmişi (§13-9) |
| 4b | Yeni fatura · Tahsilat penceresi | 900×var | kalem satırları, KDV dahil/istisna, canlı toplam; tahsilatta toplam/ödenen/kalan |
| 4c | Fatura yazdırma / PDF | A4 (794×1123) | kurum bloğu, yön, toplamlar, "e-fatura yerine geçmez" altbilgisi |
| 5a | Donör & raporlama | 1440×1000 | donör KPI, donör kalemleri, uygunluk denetimi (bulgulu ve temiz hâl), rapor dönemleri |
| 5b | Kur köprüsü + Kur politikası penceresi | 1440×1000 | üç defter, politika seçimi, mutabakat tablosu, eksik kur notu |
| 6a | Kasa (sekme) + Kasa & Banka tam görünüm | 1440×1000 | toplam bakiye (degradesiz), hesap kartları (düzenle/pasif), hareketler + kaynak, transfer (onay adımlı öneri) |
| 6b | Kurlar ve Yıl Sonu Değerleme — Finans Merkezi'nde nereye oturduğu | 1280×800 | TCMB'den güncelle, kur tablosu, değerleme listesi + kur farkı |
| 7a | Belgeler | 1440×900 | belge açığı, uygunluk ilerlemesi, teslim paketleri |
| 8a | **Mobil** · Finans Merkezi Genel + Gelir-Gider + Kasa | 390×844 (×3) | alt çubuk, bağlam seçici, KPI, satır kartları |
| 8b | **Mobil** · Masraf Yakala akışı | 390×844 (×4) | çekim → form → başarı; çevrimdışı + kuyruk |
| 9a | Koyu tema · 1a | 1440×1100 | koyu paletle (K5: birincil beyaz) |
| 9b | Durum kataloğu | 1280×900 | §11'deki her durum, tek sayfada |
| 9c | Bileşen sayfası | 1280×var | tonlu KPI, para gösterim kademeleri, durum çipi seti (fatura/dilim/kesinti/kur kaynağı), satır eylem menüsü, süzgeç çipi, kesik notu |

Öncelik: **1a, 2a, 2c, 3a, 4a, 8a** ilk tur; kalanlar ikinci tur.

---

## 15. Açık sorular (tasarımcı öneri sunar, karar kullanıcıda)

| # | Soru | Neden açık |
|---|---|---|
| S1 | Uygulama içi nötr palet: marka kılavuzunun **sıcak** nötrleri (`#F5F4F0`, `#E4E1D8`…) mi, bugünkü **soğuk** gri skala mı? | K5 yalnız ana rengi sabitledi; nötrler için karar yok. |
| S2 | Gelir-Gider sekmesi ile `/Expenses`–`/Incomes` **tek liste** olsun mu? | Bugün aynı kaydın iki arayüzü var (§5.4-2). |
| S3 | Kasa & Banka tam görünümü, Kurlar ve Yıl Sonu Değerleme Finans Merkezi'nde **nerede** durur: Kasa sekmesinin alt görünümü mü, sağ üstte "Araçlar" menüsü mü, ayrı sekme mi? | K1 yeni menü öğesini yasaklar; sekme içi yer seçimi açık. |
| S4 | Fatura durum **adları**: "Taslak/Gönderildi/Ödendi" yerine "Ödenmedi/Kısmen ödendi/Ödendi" gibi davranışı anlatan adlar? İptal durumu görünür olsun mu? | Bugünkü adlar gerçek bir gönderim akışı ima ediyor (§13-9). |
| S5 | Para biçiminde tek kural: KPI'da kuruşsuz + önek, tabloda kuruşlu + sonek mi; yoksa her yerde aynı mı? | §3.5. |
| S6 | Hızlı Transfer'e **onay adımı**, tarih ve açıklama alanı eklensin mi? | Para hareketi onaysız (§13-10). |
| S7 | Hibe/Kurum payı sütunları ve "Destek oranı girilmemiş" uyarısı **Kurumsal ve Etkinlik** projelerinde gizlensin mi? | Bugün üç şablonda da çıkıyor (§6.5-7). |
| S8 | Telefonda Finans Merkezi'nin hangi sekmeleri olsun: hepsi mi, yalnız Genel / Gelir-Gider / Kasa mı? | §12. |
| S9 | Mor "bağlama özel" noktası kalsın mı? Kurumsal şablonda "Dilimler & kesintiler" de noktalı çıkıyor. | Hesaplama kuralı ipucuyla çelişiyor (§6.5-12). |
