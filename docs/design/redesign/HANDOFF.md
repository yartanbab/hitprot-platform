> **Kaynak:** Claude Design projesi — "Apya.Platform Kapsamlı Redesign"
> `https://claude.ai/design/p/61bd3e04-c7e5-4b83-9b3f-2159c0f8546e`
> Prototip dosyaları (`Apya Platform.dc.html`, `Apya Mobile.dc.html`, `support.js`) **referans amaçlıdır**,
> üretime kopyalanmaz. Bu dosya (handoff/README) uygulamanın kalıcı kılavuzudur.
> Prototipin görsel referansı, uygulama sırasında ilgili ekran için tarayıcıda açılarak alınır.

---

# Handoff: Apya.Platform — Kapsamlı Arayüz Redesign'ı

## Genel Bakış
Bu paket, Apya.Platform (Hitprot) ERP/AI platformunun **tüm ekranları için yeni bir arayüz tasarımını** içerir: modern, yoğunluk-ayarlı (density), light + dark temalı, tutarlı bir tasarım sistemi. Amaç, mevcut ABP tabanlı kod tabanının görünümünü bu tasarıma göre yenilemektir. Paket ayrıca aynı token sistemini paylaşan ayrı bir **mobil refakatçi uygulaması** tasarımı (`Apya Mobil.dc.html`) içerir — bkz. "Mobil Uygulama" bölümü.

Kapsanan ekranlar: Genel Bakış (Dashboard), Projeler, Hibeler, Görevler (tablo + detay drawer), Kanban, Takvim, Finans Hub, Faturalar, Cariler, Kasa & Banka, Proje Bütçesi, Cari Ekstre, Mizan, Kur Değerleme, Dokümanlar, Form Oluşturucu, Webhooks, AI Panosu, Prompt'lar, Workflow'lar, AI Kullanım, Kullanıcılar, Roller, Tenant'lar, Ayarlar, Tasarım Sistemi.

## Tasarım Dosyaları Hakkında (ÖNEMLİ — önce oku)
Bu paketteki `Apya Platform.dc.html` + `support.js` dosyaları **HTML ile hazırlanmış bir tasarım referansıdır** — istenen görünüm ve davranışı gösteren interaktif bir prototiptir, doğrudan kopyalanacak üretim kodu DEĞİLDİR.

Görev: **bu HTML tasarımlarını mevcut kod tabanının kendi ortamında yeniden oluşturmaktır.** Bu proje bir **ABP Framework (.NET) MVC / Razor Pages** uygulamasıdır ve **LeptonX Lite** temasını (Bootstrap 5) kullanır. Dolayısıyla:

- **React / Node / SPA EKLEME.** Prototip React ile yazıldı ama bu yalnızca hızlı prototipleme içindir. Hedef ortam sunucu-tarafı Razor Pages'tir.
- Tasarımı, mevcut `.cshtml` sayfaları + özel CSS (LeptonX üzerine bindirme) + mevcut JS (jQuery/DataTables/abp) ile yeniden yarat.
- Grafikler için kod tabanı zaten **chart.js 4.4** kullanıyor (prototiple aynı) — aynısını kullan.
- İkonlar: prototip Phosphor Icons (`ph ph-*`) kullanır. Kod tabanında zaten bir ikon seti (FontAwesome, LeptonX default) varsa ona en yakın eşleştirmeyi yap veya Phosphor'u ekle — tutarlı kal.

## Sadakat (Fidelity): Yüksek (hi-fi)
Prototip **piksel-hassasiyetinde** hazırlanmıştır: nihai renkler, tipografi, boşluk, gölge ve etkileşimler kesindir. Aşağıdaki tasarım token'larını ve ölçüleri birebir uygula. Layout ve bileşen yapısını referans al; stil değerlerini bu README'deki tablolardan çek.

## Hedef Kod Tabanı Haritası
Prototipteki her ekran, kod tabanında zaten var olan bir sayfaya karşılık gelir:

| Prototip ekranı | Razor Pages klasörü (`src/Apya.Platform.Web/Pages/`) |
|---|---|
| Genel Bakış | `Dashboard/` |
| Projeler | `Projects/` |
| Hibeler | `Grants/` |
| Görevler / Kanban | `Tasks/`, `Board/` |
| Takvim | `Calendars/` |
| Finans Hub | `Finance/` |
| Faturalar | `Invoices/` |
| Cariler | `Customers/` |
| Kasa & Banka | `CashAccounts/`, `CashMovements/` |
| Cari Ekstre / Mizan / Kur Değ. / Proje Bütçesi | `Reports/`, `FxRevaluations/`, `ExchangeRates/` |
| Dokümanlar | `Documents/` |
| AI Panosu / Prompt / Workflow / Kullanım | `AiCenter/` |
| Kullanıcılar / Roller / Tenant'lar | ABP Identity + `TenantManagement/` |
| Ayarlar | Settings sayfaları |

Menü/navigasyon: `Menus/PlatformMenuContributor.cs` ve `PlatformMenus.cs`.

## Tasarım Sistemi — Token'lar

Tasarım, CSS custom property'leri (`--apya-*`) üzerine kuruludur. Bunları global bir stylesheet'e (örn. `wwwroot/styles/apya-theme.css`, LeptonX'ten sonra yüklenir) taşı. Light `:root`, dark ise `[data-theme="dark"]` altında tanımlanır.

### Renkler — Light (`:root`)
| Token | Değer | Kullanım |
|---|---|---|
| `--apya-brand-500` | `#2563EB` | Ana marka mavisi (birincil vurgular) |
| `--apya-brand-600` | `#1D4ED8` | Link, hover |
| `--apya-accent-500` | `#4F46E5` | Aksiyon/CTA (indigo) — birincil butonlar, seçili durumlar |
| `--apya-accent-600` | `#4338CA` | CTA hover |
| `--apya-accent-soft` | `rgba(79,70,229,0.10)` | Seçili satır arka planı, yumuşak vurgu |
| `--apya-positive-500` | `#059669` | Pozitif/başarı (alacak, ▲) |
| `--apya-negative-500` | `#DC2626` | Negatif/hata (borç, ▼, geciken) |
| `--apya-warning-500` | `#F59E0B` (600: `#D97706`) | Uyarı, beklemede |
| `--apya-ai-500` | `#7C3AED` | AI mor aksanı (AI Merkezi ekranları) |
| `--apya-ai-600` | `#6D28D9` | AI vurgu koyu |
| `--apya-neutral-{50..900}` | `#F9FAFB … #111827` | Gri skala |

### Yüzeyler & Metin — Light
| Token | Değer |
|---|---|
| `--apya-surface-app-bg` | `#F5F5F5` |
| `--apya-surface-base` | `#FFFFFF` (kart/panel zemini) |
| `--apya-surface-raised` | `#F9FAFB` (tablo başlığı, hover) |
| `--apya-surface-sunken` | `#F3F4F6` (bar zemini, chip zemini) |
| `--apya-text-primary` | `#111827` |
| `--apya-text-secondary` | `#4B5563` |
| `--apya-text-tertiary` | `#9CA3AF` |
| `--apya-border-subtle` | `#F3F4F6` |
| `--apya-border-default` | `#E5E7EB` |
| `--apya-border-strong` | `#D1D5DB` |

### Dark tema (`[data-theme="dark"]` — değişenler)
`--apya-accent-500:#6366F1`, `--apya-brand-500:#60A5FA`, `--apya-positive-500:#10B981`, `--apya-negative-500:#F87171`, `--apya-warning-500:#FBBF24`, `--apya-ai-500:#A78BFA`;
yüzeyler: `--apya-surface-app-bg:#0A0A0B`, `--apya-surface-base:#0F0F11`, `--apya-surface-raised:#141416`, `--apya-surface-sunken:#070708`; metin: `--apya-text-primary:#F4F4F5`, `--apya-text-secondary:#A1A1AA`, `--apya-text-tertiary:#71717A`; kenarlıklar `rgba(255,255,255,0.05/0.08/0.13)`.

### Gölgeler
| Token | Light değeri |
|---|---|
| `--apya-shadow-sm` | `0 1px 2px 0 rgba(17,24,39,0.05)` |
| `--apya-shadow-md` | `0 4px 6px -1px rgba(17,24,39,0.08), 0 2px 4px -2px rgba(17,24,39,0.04)` |
| `--apya-shadow-lg` | `0 10px 15px -3px rgba(17,24,39,0.10), 0 4px 6px -4px rgba(17,24,39,0.05)` |

### Tipografi
- **Ana font:** `Inter` (sistem fallback: `system-ui, sans-serif`). Ağırlıklar 400/500/550/600/650/700.
- **Monospace:** `JetBrains Mono` — tüm sayısal/parasal değerler, IBAN, belge no, hesap kodu, kur, secret, API anahtarı.
- **Sayılar:** her zaman `font-variant-numeric: tabular-nums`; para/oran sağa dayalı.
- Başlık ölçekleri: sayfa başlığı 16px/650, kart başlığı 14px/600, KPI değeri 19–28px/700 (letter-spacing −0.02em), tablo hücresi 12–12.5px, ikincil/etiket 11–11.5px, üst-etiket (uppercase) 10.5px/700 letter-spacing .4px.

### Yarıçap & Yoğunluk
- Border-radius: kartlar 12–14px, butonlar/inputlar 8–9px, chip'ler 99px (pill) veya 6px, ikon kutuları 8–11px.
- **Yoğunluk (density):** tablo satır yüksekliği `--row-h` ile kontrol edilir — `compact:36px`, `cozy:44px` (varsayılan), `comfortable:56px`. Kök öğede `data-density` attribute'u ile geçiş yapılır.
- **Tema geçişi:** kök öğede `data-theme="light|dark"`.

## Global Layout (Kabuk)
- **Sol sidebar** (genişletilebilir/daraltılabilir): logo (Apya + PLATFORM rozeti) + tenant seçici + gruplu navigasyon (`Genel Bakış`, `İş Yönetimi`, `Finans`, `Raporlar`, `İçerik`, `AI Merkezi`, `Yönetim`). Daraltılınca yalnızca ikonlar (title tooltip'li). Genişlik ~248px açık / ~64px daralt.
- **Üst header** (yükseklik 57px): sayfa başlığı + alt-başlık (sol), sağda: dil (TR), tema toggle (ay/güneş), bildirim (nokta rozetli), kullanıcı avatarı.
- **İçerik alanı:** `--apya-surface-app-bg` zemin; her ekran `max-width` ile ortalanmış, `padding: 20–22px 26px`.
- Mobilde sidebar overlay olarak açılır (hamburger).

## Ekranlar (özet — tam detay için prototipi aç)
Her ekranın tam markup'ı, ölçüsü ve etkileşimi `Apya Platform.dc.html` içindedir. Öne çıkan kalıplar:

- **Dashboard:** 4 KPI kartı (ikon + değer + delta chip + sparkline), Nakit Akışı (chart.js line + gradient), Gelir/Gider (grouped bar), Bütçe (doughnut), Onay listesi, AI öngörü kartları.
- **Tablolar (Faturalar, Görevler, Kullanıcılar, Mizan, Ekstre, Hareketler):** CSS grid tablo; başlık `surface-raised` + uppercase 10.5px; satır yüksekliği `--row-h`; hover `surface-raised`; parasal kolonlar sağa dayalı `JetBrains Mono` tabular. Renk asla ikonsuz kullanılmaz (▲/▼ + renk).
- **Master-detail (Cariler, Prompt'lar, Roller, Workflow'lar):** sol liste (seçili satır `accent-soft` + sol kenarlık) + sağ detay paneli.
- **Görev detay drawer:** sağdan kayan panel (`apyaSlide` animasyonu), durum değiştirme, meta grid, yanıtlanabilir yorum akışı.
- **Kart ızgaraları (Projeler, Tenant'lar, Dokümanlar):** `repeat(auto-fill, minmax(...))` grid.
- **Hibeler:** 4 aşamalı pipeline göstergesi + son tarih listesi + AI eşleştirmeli çağrılar.
- **Takvim:** aylık grid (7 kolon), renk-kodlu event pill'leri (görev=accent, fatura=negative, hibe=warning), gün pop-over'ı, "Bu Hafta" ajandası.
- **Ayarlar:** sekmeli (Genel / Kur / AI / Bildirimler); toggle'lar, maskeli API anahtarı (göster/gizle), manuel kur tablosu.
- **Webhooks:** endpoint kartları, olay chip'leri, aktif toggle, maskeli secret, açılır teslimat log tablosu (renkli HTTP kod chip'i).

## Mobil Uygulama (Apya Mobil)
`Apya Mobil.dc.html`, platformun **mobil refakatçi uygulamasının** hi-fi tasarım referansıdır — aynı `--apya-*` token sistemi, Inter + JetBrains Mono, Phosphor ikonlar. Native kalıpları **iOS ve Android** için ayrı ayrı gösterir (üstteki segment ile geçiş): iOS (Dynamic Island, büyük başlık, kenardan-kaydır geri, alt home indicator, hap biçimli FAB) ve Android (punch-hole kamera, sabit üst çubuk, sistem geri, dairesel 56px FAB, Material 3). Light + dark tema aynı token'larla çalışır.

Yerel hedef: iOS için SwiftUI/React Native, Android için Jetpack Compose/React Native. Bu prototip yalnızca **görsel + etkileşim referansıdır**; token değerleri ve ölçüler yukarıdaki tablolarla birebir aynıdır.

**Ekranlar & kalıplar:**
- **Bugün:** selamlama başlığı, yatay kaydırmalı KPI kartları (sparkline'lı), Nakit Akışı mini-grafiği, "Bugünün Görevleri" listesi (tek dokunuşla tamamla), "Onayınızı Bekliyor" (satır içi Onayla/Reddet).
- **Görevler:** Liste ↔ Pano segmenti. Liste: filtre chip'leri + **kaydırmalı satır aksiyonları** (sola: tamamla, sağa: ertele). Pano: yatay snap'li Kanban, **basılı-tut & sürükle** ile kolon değiştirme (haptik + hayalet kart), nokta sayfalayıcı.
- **Görev Detay** (push geçişi): etiketler, durum seçici, meta grid, açıklama, yanıtlanabilir yorum akışı + giriş çubuğu.
- **Finans:** üstte konsolide bakiye kartı (TRY karşılığı toplam + kur notu), hesap kartları listesi (kasa/banka, para birimi rozeti TRY/USD/EUR, bakiye JetBrains Mono), "Son Hareketler" (▲ alacak yeşil / ▼ borç kırmızı, karşı taraf, tutar sağa dayalı mono).
- **Hesap Detay** (push): bakiye başlığı + tarih gruplu hareket listesi (Bugün/Dün/9 Tem…); hareket satırına dokununca detay bottom sheet (kategori/yöntem/hesap/referans/tarih + not).
- **Hızlı Gider / Tahsilat** ([+] menüsünden, bottom sheet): büyük tutar alanı + sayısal klavye, para birimi seçici, kategori chip'leri, aramalı cari seçici, tarih (varsayılan bugün), not, fiş/fotoğraf ekleme; kaydet butonu sheet altına sabit.
- **Faturalar** (Menü → Faturalar): durum filtreli liste (Ödendi/Bekliyor/Gecikti); fatura satırı cari + no (mono) + vade + tutar. Detay push: satır kalemleri, KDV, genel toplam — salt okunur + "Tahsilat Kaydet".
- **Onay Akışı:** Bugün ekranındaki onay kartından push → onay detayı (talep eden, tutar, açıklama, ek dosya) + altta sabit Onayla (positive) / Reddet (negative outline); reddetmede sebep isteyen bottom sheet (hazır sebep chip'leri + serbest metin).
- **Dinamik Form Doldurma** ([+] → Form Doldur): form seçim listesi → çok adımlı doldurma (üstte adım progress bar'ı; text/select/date/number/dosya/imza alan türleri), altta "Taslak kaydedildi ✓ · çevrimdışı" göstergesi, gönder onayı.
- **Bildirim Merkezi** (zil ikonundan push): tarih gruplu bildirim listesi — tür ikonlu (görev=accent, fatura=negative, form=brand, onay=warning, AI öngörü=ai moru); okunmamış nokta; dokununca okundu; üstte "Tümünü okundu say".
- **Takvim** (Menü'den): üstte yatay hafta şeridi (bugün vurgulu) + ay görünümü toggle'ı; seçili günün renk kodlu ajanda listesi (görev=accent, fatura=negative, hibe=warning); boş gün için empty-state.
- **Dokümanlar** (Menü'den): klasör → dosya listesi (tür ikonu, boyut, tarih), arama alanı, iskelet (skeleton) yükleme, dosya önizleme push'u + paylaş/indir aksiyonları.
- **AI Özet** (Menü'den): AI mor aksanıyla öngörü kartları (nakit akışı uyarısı, geciken görev riski, önerilen hibe çağrısı) — güven skoru, "Detay" ve kaynağa git linki; altta istek/token kullanım özeti.
- **Menü (tam):** profil başlığı, tenant seçici (alt sheet), tema seçimi (Açık/Koyu/Sistem), bildirim tercihleri, modül listesi (Takvim, Dokümanlar, Faturalar, AI Özet, Ayarlar, Tasarım Sistemi — hepsi aktif), sürüm + build bilgisi.
- **Ayarlar** (Menü'den): dil (TR/EN), biyometrik kilit toggle'ı, çevrimdışı senkron durumu (son senkron zamanı + bekleyen kayıt rozeti + simüle et), önbellek temizle.
- **Global durumlar:** çevrimdışı uyarı şeridi (üstte sarı ince banner, tüm ekranlarda kalıcı), pull-to-refresh (ana scroll alanında aşağı çekince yenile), skeleton yükleme kalıbı (Dokümanlar/AI), boş durum illüstrasyon kalıbı (Takvim/Faturalar).
- **Tasarım Sistemi:** mobil token'lar — renk/yüzey swatch'ları, tipografi ölçeği, chip tonları, buton hiyerarşisi, liste satırı anatomisi, yarıçap.
- **Ortak:** alt tab bar (ortada + FAB → hızlı işlem sheet'i), bottom sheet, toast, durum çubuğu (platforma göre notch/punch-hole).

Etkileşimler prototipte **çalışır durumdadır** (kaydırma, sürükle-bırak, sheet, toast, tema/platform geçişi); davranışı birebir referans al.

## Etkileşimler & Davranış
- **Tema/yoğunluk:** kök öğede `data-theme` / `data-density` attribute değişimi; localStorage'da saklanır.
- **Navigasyon:** sidebar öğesi → ilgili sayfa (Razor Pages'te gerçek route'lar; prototipte tek sayfa state'i).
- **Chip'ler:** durum renkleri tone → (positive/negative/warning/brand/ai/neutral) arka plan `color-mix(... 12–15%)` + koyu metin.
- **Animasyonlar:** kart girişi `apyaFade .3s ease`, drawer/modal `apyaSlide .22s cubic-bezier(0.16,1,0.3,1)`, overlay `apyaFade .18s`.
- **Hover:** butonlarda accent-600'e koyulaşma; kartlarda `shadow-md` + `border-strong`; tablo satırında `surface-raised`.
- **Toggle/checkbox/drawer/modal/dropdown:** hepsi prototipte çalışır durumda — davranışı birebir referans al.

## Grafikler (chart.js)
Kod tabanı chart.js 4.4 içeriyor. Prototipteki grafik ayarları: line (gradient fill, tension 0.35, pointRadius 0), grouped bar (borderRadius 4, maxBarThickness 16), doughnut (cutout '72%', spacing 2). Tooltip zemini light `#111827` / dark `#1A1A1D`. Grid rengi light `#EEF0F3` / dark `rgba(255,255,255,0.06)`. Tema değişince grafikler yeniden kurulur.

## Uygulama Sırası (öneri)
1. Global token stylesheet'i (`apya-theme.css`) ekle; `data-theme`/`data-density` altyapısını LeptonX layout'una bağla (tema toggle + localStorage).
2. Sidebar + header kabuğunu LeptonX layout'unda yeniden biçimlendir.
3. Ortak bileşenleri CSS util/partial olarak çıkar: kart, tablo, chip, buton, KPI, drawer, modal, toggle.
4. Ekranları öncelik sırasına göre migrate et: Dashboard → tablolar (Faturalar/Görevler) → master-detail → geri kalan.
5. Grafikleri mevcut chart.js ile bağla; dark tema yeniden-kurulumunu ekle.

## Varlıklar (Assets)
Prototip harici CDN kullanır: Google Fonts (Inter, JetBrains Mono), Phosphor Icons, chart.js. Üretimde kendi ikon setini ve font barındırma yöntemini kullan. Özel görsel/logo yoktur (logo bir ikon glifidir).
