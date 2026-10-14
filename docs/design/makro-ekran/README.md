# Handoff: Makro Ekran (/Makro) — Hitprot / Apya Platform

## Overview
Tüm programın tek giriş ekranı: kullanıcının en çok kullandığı işlemleri ("makro") tek tıkla başlatır, hibe/gelişme haberlerini banner'da gösterir, bildirimleri ve kullanıcıya ait canlı kayıtları yan panellerde toplar, bekleyen işleri sayaçlarla listeler. Host tarafında makroların üretildiği/düzenlendiği/silindiği yönetim ekranı ve uç haller (boş durum, ön izleme hatası) de pakette.

Hedef: `yartanbab/hitprot-platform` (ABP / ASP.NET Core Razor Pages + LeptonX Lite). Kabuk (320px kenar çubuğu, 64px üst bar, `--apya-*` token sistemi, menü ağacı ve ikonlar) bu repodan birebir çıkarıldı — yeni bir kabuk yazılmayacak, mevcut layout içine bir sayfa eklenecek.

## About the Design Files
Bu paketteki dosyalar **HTML ile üretilmiş tasarım referanslarıdır** — istenen görünümü ve davranışı gösteren prototiplerdir, doğrudan kopyalanacak üretim kodu değildir. Görev, bu HTML tasarımları **hedef kod tabanının mevcut ortamında yeniden kurmaktır**: Razor Pages (.cshtml) + mevcut `apya-shell.css` / `apya-theme-bridge.css` sınıfları ve `wwwroot/js/*-shell.js` desenleri. Prototipteki satır içi stiller okunabilirlik içindir; üretimde mevcut token'lar ve sınıflar kullanılmalıdır.

`Makro Ekran.dc.html` tek dosyada birden çok seçenek barındırır; her seçenek `id` ile işaretlidir (aşağıdaki tabloya bakın). Tarayıcıda açıp `#1a`, `#2a` gibi çapalarla gezilebilir.

## Fidelity
**High-fidelity.** Renkler, tipografi, ölçüler ve durumlar nihai; repodaki gerçek token değerlerinden alındı. Pixel-perfect yeniden kurulum beklenir. İçerik (haber başlıkları, kayıt adları, sayaçlar) örnek veridir — gerçek veriyle değişir.

## Onaylanan kararlar (bu tasarımın dayandığı brief)
- Amaç: hızlı işlem başlatma + launcher + bekleyen işler + kişiselleşen pano + sayısal özet.
- Giriş: ayrı sayfa `/Makro`.
- Rol: tek ekran, role göre içerik değişir (host / kiracı yöneticisi / kiracı kullanıcısı).
- Cihaz: masaüstü ve dokunmatik eşit ağırlıkta.
- Sıralama: **sıklık**, ama sabitlenenler her zaman ilk sırada; ilk dördü ayrı "SENİN İÇİN" şeridinde.
- Çok adımlı makro: **tek sayfalık ön izleme** — ne oluşacağı listelenir, "Onayla"ya kadar hiçbir kayıt yazılmaz.
- Makro sayısı: 12 (4 yatay × 3 dikey) + 4 "Senin için".
- Makro üretimi/düzenlemesi/silinmesi: **host** tarafında (2a / 2b).

## Ekran haritası (dosya içi id → ekran)
| id | Ekran | Ölçü |
|---|---|---|
| 1a | **Ana ekran, masaüstü** (tam kabuk: kenar çubuğu + üst bar) | 1440×1180 |
| 1b | Klavye öncelikli liste (⌘K paleti deseni) | 1120×760 |
| 1c | Ön izleme / onay ekranı | 1120×760 |
| 1d | Tablet, koyu tema | 1024×768 |
| 1g | **Mobil** (sekmeli alt bölüm) | 390×844 |
| 1f | Tüm haberler listesi | 1120×700 |
| 2a | Host · makro yönetimi, master-detail | 1180×880 |
| 2b | Host · makro yönetimi, tablo + drawer | 1180×700 |
| 3a | Boş durum (yeni kiracı, kullanım verisi yok) | 1120×600 |
| 3b | Ön izleme hata hali | 1120×600 |

---

## Screens / Views

### 1a — Makro Ekran (masaüstü, ana ekran)
**Purpose:** Kullanıcı günün işine buradan başlar.

**Layout:** `display:flex` — sol kenar çubuğu `flex:0 0 320px`, sağ kolon `flex:1`. Sağ kolonda 64px üst bar (`flex:none`) + içerik alanı (`flex:1; overflow:hidden; padding:24px 28px; display:flex; flex-direction:column; gap:18px`).

İçerik alanı sırası (hepsi `flex:none`):
1. **Haber banner'ı** — tam genişlik, `height:200px`, `border-radius:18px`, `border:1px solid --apya-border-default`, `box-shadow:--apya-shadow-card`, `overflow:hidden`.
   - Arka plan: görsel `position:absolute; inset:0` (prototipte `<image-slot id="news-banner-bg">`; üretimde haberin kapak görseli).
   - Scrim: `position:absolute; inset:0; pointer-events:none; background:linear-gradient(100deg, var(--apya-surface-base) 0%, var(--apya-surface-base) 46%, color-mix(in srgb, var(--apya-surface-base) 72%, transparent) 62%, transparent 86%)` — metnin 4.5:1 kontrastı bu geçişe dayanıyor, kaldırılmamalı.
   - İçerik: `position:relative; box-sizing:border-box; height:100%; max-width:640px; display:flex; flex-direction:column; gap:9px; padding:18px 28px 30px`. **`box-sizing:border-box` şart** — content-box'ta padding 200px'in dışına çıkıp butonları kırpıyor.
   - Satırlar: ① "3 yeni" çipi (`--apya-negative-500` %12 zemin, `--apya-negative-700` metin, 5px nokta) + "Tüm haberler" bağlantısı; ② tür etiketi (`--apya-accent-soft` zemin, `--apya-accent-600`, 10.5px/700/uppercase) + `17.09.2026 · TÜBİTAK` (mono 11.5px); ③ başlık 23px/700/1.15/-.02em; ④ özet 12.5px/1.45 `--apya-text-secondary`, `max-width:470px`; ⑤ `margin-top:auto` ile iki buton: birincil "Çağrıdan başvuru başlat" (38px, `--apya-accent-500` zemin, #fff, radius 9px) ve ikincil "Çağrı detayı" (38px, `--apya-surface-base`, 1px `--apya-border-default`).
   - Geçiş: sol/sağ 34px yuvarlak ok butonları (`position:absolute; top:50%; translateY(-50%)`, 14px içte, `--apya-shadow-md`); altta ortada nokta göstergesi (`bottom:12px`, aktif 16×6px `--apya-accent-500`, pasif 6×6px `--apya-border-strong`, her birinde `box-shadow:0 0 0 1px` surface — fotoğraf üzerinde görünürlük için). **Maksimum 5 haber**; gerisi "Tüm haberler" (1f).
2. **Makro sonuç şeridi** — makro çalıştıktan sonra ~8 sn görünür. `padding:11px 16px`, `radius:12px`, `border:1px solid color-mix(in srgb, var(--apya-positive-500) 30%, var(--apya-border-default))`, zemin `color-mix(in srgb, var(--apya-positive-500) 7%, var(--apya-surface-base))`. 28px onay ikonu + "Çağrıdan başvuru başlat tamamlandı — 3 aşama, 11 görev, 6 belge talebi oluştu" (12.5px/600) + mono alt satır + sağda "Başvuruyu aç" bağlantısı, "Geri al" butonu (30px) ve kapat ikonu.
3. **Üç kolonlu grid** — `grid-template-columns:532px 1fr 1fr; gap:16px; align-items:stretch`.
   - **Sol kolon** (`display:flex; flex-direction:column; gap:18px`):
     - *Senin için* başlık satırı: "SENİN İÇİN" (10.5px/700/uppercase/`--apya-text-tertiary`) + "son 30 günkü kullanımına göre" çipi (`--apya-accent-soft`/`--apya-accent-600`) + sağda **Düzenle** (30px, ikincil) ve **Makro ekle** (30px, birincil accent) butonları.
     - *Senin için* ızgarası: `grid-template-columns:repeat(4,1fr); gap:12px`. Kart: `min-height:124px; padding:13px; radius:14px; border:1px solid --apya-accent-500` (sabitlenmiş vurgusu), `box-shadow:--apya-shadow-sm`. İçerik: 34px ikon karesi (`radius:9px`, `--apya-accent-soft` zemin, `--apya-accent-500` ikon) + sağ üstte `fa-thumbtack` 10px accent; başlık 12.5px/600/1.3; `margin-top:auto` ile kullanım sayacı (mono 10.5px `--apya-text-tertiary`, örn. `31×`).
     - *Tüm makrolar* başlığı: "TÜM MAKROLAR" + "12 işlem · sıklığa göre".
     - *Tüm makrolar* ızgarası: `repeat(4,1fr); gap:12px`, **12 kart → 3 satır**. Kart aynı ölçü, `border:1px solid --apya-border-default`, ikon karesi `--apya-surface-sunken` zeminli, `--apya-text-secondary` ikon. Hover: `border-color:--apya-accent-500; background:--apya-surface-raised`.
     - **Güncelleme rozeti** (her iki ızgarada): ikon karesinin sağ üst köşesinde `position:absolute; top:-6px; right:-6px`, `min-width:17px; height:17px; radius:999px`, `--apya-negative-500` zemin, #fff mono 10px/700, `border:1.5px solid --apya-surface-base`. Başkaları tarafından güncellenen kayıt sayısını gösterir; 0 ise `display:none`.
   - **Orta kolon — Bildirimler:** `position:relative` sarmalayıcı içinde `position:absolute; inset:0` panel (min-content'in grid satırını büyütmesini engellemek için — aksi halde bekleyen işler aşağı kayıyor). Panel: `radius:14px`, 1px border, `overflow:hidden`, `display:flex; flex-direction:column`. Başlık (`flex:none`): "Bildirimler" + kırmızı sayı balonu (3) + "en yeni üstte" + "Tümü". Liste: `flex:1; min-height:0; overflow-y:auto` — **kendi içinde kayar**. Satır: `padding:11px 16px`, 28px ikon karesi, başlık 12px/600, meta 11px tertiary, sağda 7px okunmamış noktası. Okunmamış satır zemini `--apya-accent-soft`. Aksiyonu olan bildirimde alt satırda `⚡ Eksik belgeleri iste` (11px/600 accent) — tıklanınca ilgili makronun **ön izlemesi** açılır. Sıralama: yaşa göre artan (en yeni üstte), elle dizilim değil.
   - **Sağ kolon — Bana ait kayıtlar:** aynı absolute kalıbı. Başlık: "Bana ait kayıtlar" + "canlı". Liste `overflow-y:auto`; gruplar: **Projelerim / İlgili çağrılarım / Hibe süreçleri**. Grup başlığı `--apya-surface-raised` zeminli 10.5px/700/uppercase + sağda adet. Satır: 6px durum noktası (`--apya-warning-500` aksiyon gerek / `--apya-positive-500` yolunda / `--apya-border-strong` boşta), başlık 12px/600 (tek satır, ellipsis), meta 10.5px. **Gelişme olan satır** `--apya-accent-soft` zeminli + sağda küçük accent gelişme ikonu.
4. **Bekleyen işler** — tam genişlik, `flex:none` (**şart**: shrink olursa panel başlığa çöküyor). Başlık + "21 kayıt" çipi (warning) + "Tümünü gör". Gövde `grid-template-columns:repeat(5,1fr)`: her hücre 22px/700 mono sayaç (renk: negative/warning/primary) + 11px ikon, 12px/600 başlık, 11px tertiary alt satır. Sütunlar arası 1px `--apya-border-subtle`.

### 1b — Klavye öncelikli liste
56px komut alanı (`border:1px solid --apya-accent-500`, `box-shadow:0 0 0 3px --apya-accent-soft`), sağında mono tuş ipuçları (`↑↓ gez`, `↵ çalıştır`, `1-9 doğrudan`). Liste başlığı **"OLUŞTUR"**; 52px satırlar: 22px tuş kutusu (mono 11px), 30px accent ikon karesi, başlık 13.5px/600 + alt satır 11.5px tertiary, sağda kullanım sayacı ve iğne. Sabitlenenler önce, gerisi sıklığa göre; **tuş numaraları sıralanmış indeksten türetilir**. Sabitlenmemiş iğne `--apya-text-tertiary` + `opacity:.45` (repo kuralı: yalnız `.is-pinned` opak accent). Sağda 300px bekleyen işler kolonu. Üretimde bu liste ayrı ekran olmak zorunda değil — mevcut `wwwroot/js/command-palette.js` paletine "OLUŞTUR" grubu olarak eklenmesi önerilir.

### 1c — Ön izleme / onay
Üst bar sağında "ön izleme — henüz kaydedilmedi" çipi (accent). Sol kolonda çağrı/şablon özeti kartı (40px ikon, 14.5px/700 başlık, 11.5px meta, "Şablonu değiştir" butonu) ve **Oluşturulacak kayıtlar** listesi — 6 satır: `Başvuru kaydı açılacak (1)`, `Aşamalar üretilecek (3)`, `Görevler açılacak (11)`, `Belge talepleri kurulacak (6)`, `Sorumlu atanacak (11)`, `Bildirim gidecek (1)`; her satırda 26px ikon, 12.5px/600 başlık, 11.5px açıklama, sağda mono adet çipi. Sağ kolonda sorumlu seçici, termin hesabı (3 satır; son başvuru warning renkli), özet kutusu ve `Onayla ve oluştur` (42px birincil) / `Vazgeç`.

### 1d — Tablet, koyu tema
250px kenar çubuğu, 44px satır yükseklikleri (dokunmatik hedef), `repeat(3,1fr)` 132px makro kartları (46px ikon), altta 56px satırlı bekleyen işler. `.apya-dark` token seti.

### 1g — Mobil (390×844)
Sıra: 52px durum çubuğu → 56px başlık (hamburger + Apya + PLATFORM çipi + arama ikonu + noktalı zil + avatar) → içerik. **Alt tab bar yok** — gezinme hamburger menüde, arama üst barda; sekmeli bölüm ekranın dibine kadar uzar (`padding-bottom:env(safe-area-inset-bottom)`).

- **Haber banner'ı:** yatay kaydırma, kart `flex:0 0 344px; height:124px; radius:16px`. Arka plan görseli `inset:0`, scrim `linear-gradient(100deg, …94% → …88% 56% → transparent)`, içerik `box-sizing:border-box; max-width:250px; padding:12px 14px`: tür etiketi + tarih, başlık 14px/700/1.2, `margin-top:auto` ile 11px/600 accent eylem satırı. Altta solda nokta göstergesi, sağda "Tüm haberler".
- **Makro ızgarası:** sayfalı — her sayfa `flex:0 0 322px`, `grid-template-columns:repeat(3,1fr); gap:10px`, kart `aspect-ratio:1/1`, 40px ikon (`radius:12px`), 11.5px/600 etiket. 12 makro = 2 sayfa; sağa kaydırılır. Kart sağ üstünde güncelleme rozeti (18px). "Fatura yakala" kartında `☁ 2 bekliyor` (10px/600 `--apya-warning-700`) — çevrimdışı kuyruk. Izgara altında solda "Sabitlemek için uzun bas", sağda sayfa noktaları.
- **Sekmeli alt bölüm:** `grid-template-columns:repeat(3,1fr)`, 40px sekme yüksekliği, etiket + sayı balonu yan yana, aktif sekme `border-bottom:2px solid --apya-accent-500` ve `--apya-accent-600` metin. Gövde `overflow-y:auto` — **Bildirimler / Kayıtlarım / Bekleyen** aynı yüzeyi paylaşır (üç panel yan yana sığmıyor).

### 1f — Tüm haberler
Sol 188px tür filtreleri (Tümü 18 / Yeni çağrı 7 / Mevzuat 4 / Sonuç 5 / Platform 2; aktif `--apya-accent-soft`), sağda tek kolon kartlar: 132px görsel + metin + sağda eylem bağlantısı, `min-height:104px`.

### 2a — Host · makro yönetimi (master-detail)
Sol 340px liste (arama, durum çipleri Tümü 14 / Yayında 11 / Taslak 3; satır: 30px ikon, 13px/600 ad, 11px meta, durum çipi; seçili satır `--apya-accent-soft` + 2px sol accent kenarlık). Sağ detay: kimlik başlığı (44px ikon, 16px/700 ad, mono `makro.grants.startApplication · v4 · son 30 günde 312 çalıştırma`, Kopyala / Sil), 2×2 alan ızgarası (**Görünen ad**, **İkon**, **Tür** = Bağlantı / Modal / Bileşik akış (ön izlemeli), **Gerekli izin** = ABP izni, örn. `Grants.Edit`), **Kime görünsün** kapsam çipleri (Tüm kiracılar / Paket / Rol + "kapsam ekle"), **Adımlar** panosu (sürükle-sırala; 6 adım: `GrantApplication.Create` → `GrantStageTemplate.Apply` → `Tasks.CreateFromStages` → `GrantDocumentRequirement.Seed` → `Assign` → `Notification.Send`), iki anahtar ("Yeni kullanıcıya sabitli gelsin" açık, "Ön izleme atlanabilsin" kapalı) ve `Taslak olarak kaydet` / `Yayınla`.

### 2b — Host · makro yönetimi (tablo + drawer)
Sütunlar: seçim / Makro (ikon + ad + mono anahtar) / Tür / Kapsam / Kullanım 30g / Durum / işlem. 8 satır, 52px satır yüksekliği. Çoklu seçimde "2 seçili · Yayından kaldır · Sil" accent çipi. Sağda 440px drawer: tek adımlı makro düzenleme (ad, tür, hedef `/Expenses/Capture`, izin `Expenses.Create`, kapsam), altta `Sil` / `Kaydet ve yayınla`.

### 3a — Boş durum
Accent sol kenarlıklı bilgi kutusu ("Rolüne göre başlangıç seti hazır"), "BAŞLANGIÇ SETİ" ızgarası (172px kartlar, "henüz kullanılmadı"), ve kesikli kenarlıklı "Bekleyen iş yok" kutusu. Kullanım verisi yokken boş kutu gösterilmez — host'un `defaultPinned` işaretlediği makrolar role göre doldurulur.

### 3b — Ön izleme hata hali
Negatif kenarlıklı uyarı ("Bu ön izleme artık geçerli değil · Hiçbir kayıt oluşturulmadı"), **Engeller** listesi (son başvuru geçti / şablon v3→v4 değişti / sorumlu kiracıdan çıktı — her satırda düzeltme eylemi), sağda ön izleme künyesi (hazırlandı 09:12, geçerlilik doldu, oluşan kayıt 0), `Ön izlemeyi yenile` birincil, `Onayla ve oluştur` **disabled**.

---

## Interactions & Behavior
- **Makro tıklaması:** tür `Bağlantı` → sayfaya git; `Modal` → modal aç; `Bileşik akış` → **1c ön izlemesi** (zorunlu, `Ön izleme atlanabilsin` kapalıysa). Onay tek kullanımlık `previewToken` harcar → çift tıklama ikinci başvuru oluşturmaz.
- **Sonuç şeridi:** onaydan sonra 1a'da görünür, ~8 sn sonra solar; "Geri al" bu makronun ürettiği tüm kayıtları toplu siler (çalıştırma günlüğü gerektirir).
- **Sıralama:** sabitlenenler önce, sonra son 30 günlük kullanım sayısına göre azalan. İlk 4 "SENİN İÇİN" şeridine çıkar. Sıra sessizce değişmez — şerit etiketi nedeni söyler.
- **Sabitleme:** masaüstünde "Düzenle" modu, mobilde karta **uzun basış** → Sabitle / Kaldır.
- **Banner:** sağ/sol ok (masaüstü), parmakla kaydırma (mobil), nokta göstergesi; max 5 haber, gerisi 1f.
- **Bildirim → makro:** aksiyonu olan bildirim satırı ilgili makronun ön izlemesini açar.
- **Çevrimdışı:** "Fatura yakala" şebeke yokken fotoğrafı yerelde kuyruklar, bağlantı gelince yükler; kartta "N bekliyor".
- **Kaydırma:** Bildirimler ve Bana ait kayıtlar panelleri **kendi içlerinde** kayar (başlık sabit); sayfa kaymaz.
- **Hover:** kart `border-color:--apya-accent-500` (+ ikincillerde `background:--apya-surface-raised`); satır `background:--apya-surface-raised`; birincil buton `--apya-accent-500` → `--apya-accent-600`.

## State Management
- `pinnedMacros: string[]` — **mevcut `ShellPins` ayarını kullanın**, ikinci bir sabitleme deposu kurulmamalı (`/api/app/shell/set-pins`). Kenar çubuğu ile makro ekranı aynı kaynağı okur.
- `macroUsage: { macroKey, userId, day, count }` — günlük toplanan sayaç; 30 günden eskisi silinir (her tıklamayı satır olarak yazmayın: çok kiracılı kurulumda tablo şişer).
- `macroUpdateCounts: Record<macroKey, number>` — başkalarının güncellediği kayıt sayısı (rozet). Kullanıcı makroyu açınca sıfırlanır.
- `newsItems` (max 5 + tümü), `notifications` (yaşa göre sıralı, okunmuş/okunmamış), `myRecords` (3 grup, `fresh` işareti), `queueCounts` (5 sayaç).
- `previewToken` + `previewPayload` — ön izleme üretilince oluşur, onayda harcanır; geçersizse 3b.
- `offlineCaptureQueue: File[]` (mobil, yerel).
- **Veri çekme:** "Bekleyen işler" sayaçlarını `/api/app/shell/state`'e **eklemeyin** — o çağrı her sayfada çalışıyor. Makro ekranına özel ikinci bir uç açın.

## Design Tokens
Kaynak: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/styles/tokens.css` (+ `.apya-dark`).

**Renk (açık tema):** brand `#2563EB`/`#1E40AF` · accent `#4F46E5`/`#4338CA`, soft `rgba(79,70,229,.10)`, 50 `#EEF2FF` · positive `#059669`/`#065F46` · negative `#DC2626`/`#991B1B` · warning `#D97706`/`#92400E` · ai `#7C3AED`/`#6D28D9` · neutral-500 `#6B7280`
**Yüzey:** app-bg `#F5F5F5` · sidebar/base `#FFFFFF` · raised `#F9FAFB` · sunken/hover `#F3F4F6`
**Metin:** primary `#111827` · secondary `#4B5563` · tertiary `#9CA3AF`
**Kenarlık:** subtle `#F3F4F6` · default `#E5E7EB` · strong `#D1D5DB`
**Koyu tema:** accent `#6366F1`/`#4F46E5`, soft `rgba(99,102,241,.13)` · app-bg `#0A0A0B` · sidebar `#0C0C0E` · base `#0F0F11` · raised `#141416` · sunken `#070708` · hover `#1C1C20` · metin `#F4F4F5`/`#A1A1AA`/`#71717A` · kenarlık `rgba(255,255,255,.04/.07/.12)`
**Gölge:** sm `0 1px 2px rgba(17,24,39,.05)` · md `0 4px 6px -1px rgba(17,24,39,.08), 0 2px 4px -2px rgba(17,24,39,.04)` · lg `0 10px 15px -3px rgba(17,24,39,.10), 0 4px 6px -4px rgba(17,24,39,.05)` · card `0 1px 2px rgba(17,24,39,.04), 0 8px 24px -16px rgba(17,24,39,.14)`
**Tipografi:** sans **Inter** (400/500/600/700), mono **JetBrains Mono** (400/600/700). Ölçek: 23px/700 banner başlık · 20px/700 sayfa başlık · 16px/700 panel başlık · 14.5px/700 kart başlık · 13px gövde · 12.5px/600 kart etiketi · 11–11.5px meta · 10.5px/700 uppercase bölüm etiketi (letter-spacing .5px). Sayılar daima mono.
**Radius:** 5–6px çip/etiket · 8–9px buton/satır · 12px küçük panel · 14px kart/panel · 16–18px banner ve mobil kart · 999px balon/nokta.
**Boşluk:** 4 / 5 / 7 / 9 / 10 / 12 / 14 / 16 / 18 / 22 / 24 / 28 px.
**Ölçüler:** kenar çubuğu 320px (tablet 250px) · üst bar 64px · sidebar satırı 36px (dokunmatik 44px) · makro kartı 124px · banner 200px (mobil 124px) · bildirim/kayıt kolonu `1fr` (sol kolon 532px sabit) · mobil dokunma hedefi ≥44px.

## Assets
- **İkonlar:** Font Awesome 6 (repo zaten kullanıyor) — `fa-bolt, fa-bullhorn, fa-file-circle-exclamation, fa-lightbulb, fa-plus, fa-camera, fa-file-invoice, fa-arrow-up, fa-arrow-down, fa-cash-register, fa-calendar-days, fa-sun, fa-list-check, fa-route, fa-rocket, fa-table-columns, fa-chart-pie, fa-book, fa-thumbtack, fa-grip-vertical, fa-diagram-project, fa-user-check, fa-circle-check, fa-cloud-arrow-up, fa-rotate-left`.
- **Fontlar:** Inter + JetBrains Mono (Google Fonts). Repoda mevcut değilse self-host edin.
- **Görseller:** banner ve haber kapakları prototipte boş yer tutucu (`image-slot.js`). Gerçek görseller haber kaydından gelecek; yoksa tür etiketine göre düz renk + ikon fallback'i önerilir.

## Files
- `Makro Ekran.dc.html` — tüm ekranlar (id'ler yukarıdaki tabloda). Tarayıcıda doğrudan açılır.
- `support.js`, `image-slot.js` — prototipin çalışması için gereken yardımcılar (üretime taşınmaz).
- `github.md` — kaynak repo, dal ve hangi ekranın hangi dosyalardan çıkarıldığı.

## Açık kararlar (uygulamada netleştirilecek)
- **Giriş sayfası:** /Makro ana giriş olacaksa Genel Bakış'ın yerini almalı ya da varsayılan yönlendirme /Makro olmalı — ikisi birden değil.
- **Rozet rengi:** kırmızı rozet bildirimde "okunmamış", makro kartında "başkası güncelledi" — aynı renk iki anlam. Makro rozetini accent (--apya-accent-500) yapmak önerilir.
- **Çift kayıt yok:** sabitlenen makro "Tüm makrolar" ızgarasından çıkar; iki liste kesişmez.
- **Sıfır sayaç:** Bekleyen işler'de 0 olan hücre gizlenmez, soluk gösterilir (grid kaymaz).
- **Mobil boş durum:** 3a mantığı 1g'ye de uygulanır (rol bazlı başlangıç seti).
- **Mobil banner ölçümü:** bildirim okuma oranı düşükse banner 124→96px ilk aday.

## Uygulama sırası önerisi
1. `/Makro` sayfası + kabuk içine yerleştirme, menüye "Makro Ekran" girdisi (`PlatformNavigationResolver`).
2. Makro tanım varlığı + host yönetimi (2a) — **menü anahtarına bağlayın**, ayrı URL/izin alanı tutmayın; izin ABP'den gelir, kapsam yalnız görünürlüğü daraltır.
3. Sıklık sayacı + sabitleme (mevcut `ShellPins`) + 1a ızgaraları.
4. Ön izleme motoru (1c) + `previewToken` + hata hali (3b).
5. Banner, bildirimler, bana ait kayıtlar panelleri.
6. Mobil (1g) + çevrimdışı kuyruk.
7. Çalıştırma günlüğü + "Geri al" + adım tasarrufu ölçümü (makro başına: önce 5 ekran/4 adım → sonra kaç adım).
