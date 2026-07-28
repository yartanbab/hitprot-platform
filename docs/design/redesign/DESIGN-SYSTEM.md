# Apya Design System — İmplementasyon Referansı

> **Durum:** 2026-07-13 · dal `claude/resdes-6db9c8` (taban: `redesign` = #91/`30a0086`) · P0–P2 tamam + canlı doğrulandı; P3 ana ekranlar + proje-geneli badge taraması tamam ama **statik doğrulamalı** (kullanıcı Chrome bağlantısı 2026-07-12 gecesinden beri kopuk — görsel QA bekliyor).
> **Kaynak spec:** [HANDOFF.md](HANDOFF.md) (Claude Design). Bu doküman spec'in **koddaki karşılığını** anlatır:
> hangi token nerede tanımlı, hangi katman neyi ezer, yeni bir ekran hi-fi'ye nasıl çekilir.

---

## 1) Katman mimarisi (tek bakışta)

```
┌─ tokens.css (--apya-*)  ← TEK KAYNAK (light :root / dark [data-theme] / density [data-density])
│
├─ Razor/LeptonX tarafı (site-wide, ABP global stil bundle)
│    apya-fonts.css   → @font-face (Inter + JetBrains Mono, self-host)
│    tokens.css       → değişkenler
│    apya-theme-bridge.css → Bootstrap --bs-* / LeptonX --lpx-* köprüsü + shell + tablo + chip
│    global.css       → LeptonX logo override
│    apya-shell.css   → mikro-etkileşim, animasyon, modal/select2/swal/datepicker, page util
│
└─ React island tarafı (yalnız island sayfaları, js/style.css)
     tailwind.config.js → aynı token'ları Tailwind semantic renklerine map eder
     index.css          → @tailwind + .font-tabular utility
     components/ui/*    → Card, Badge, Button, ... (token-driven primitive'ler)
```

**Kural:** Renk/spacing/radius **asla** hardcode edilmez — her iki taraf da `--apya-*` token'larından türetilir. Tek kural iki temada (light+dark) doğru çalışır.

---

## 2) Token'lar — `wwwroot/dynamic-assets/src/styles/tokens.css`

Kanonik kaynak. Kategoriler (dosyadaki sırayla):

| Kategori | Örnek | Not |
|---|---|---|
| Brand (mavi) | `--apya-brand-50..900` (500=`#2563EB`) | Link/finansal vurgu |
| Accent (indigo) | `--apya-accent-50..700` + `-soft` (500=`#4F46E5`, dark `#6366F1`) | Birincil aksiyon, seçili durum |
| Semantic | `positive/negative/warning/critical` 50/100/500/600/700 | Renk asla ikonsuz kullanılmaz (▲/▼) |
| AI | `--apya-ai-50/500/600` (mor) | AI Merkezi aksanı |
| Neutral | `--apya-neutral-50..900` | Gri skala |
| Surface | `app-bg/sidebar/base/raised/sunken/elevated/overlay/inverse/header` | Dark'ta chromatic-neutral (saf koyu gri) |
| Text | `primary/secondary/tertiary/disabled/inverse/link/...` | |
| Border | `subtle/default/strong/focus/error` | Dark'ta rgba-tabanlı ince |
| Shadow | `sm/md/lg/xl/focus` | |
| Radius | `xs..2xl/full` (lg=8px, xl=12px) | Kart=xl, buton/input=lg, pill=full |
| Spacing | `--apya-space-0..24` (4px taban) | |
| Typography | `--apya-font-sans/mono/numeric` + scale + weight | |
| Z-index | dropdown..toast (1000..1080) | |
| Motion | `fast/base/slow/skeleton` + easing | B2B: ≤200ms; `prefers-reduced-motion` desteği |
| **Density** | `--row-h` + `[data-density]` compact=36 / cozy=44 (default) / comfortable=56 | Tablo satır yüksekliği |

Dark tema: `[data-theme="dark"]` bloğu tüm semantik/surface/text/border/shadow'u override eder. `color-scheme` da senkron (native form kontrolleri dark olur).

---

## 3) Yükleme zinciri (site-wide)

`PlatformWebModule.ConfigureBundles` → LeptonX **Styles.Global** bundle sırası:

1. `/css/apya-fonts.css` (@font-face önce)
2. `/dynamic-assets/src/styles/tokens.css`
3. `/css/apya-theme-bridge.css`
4. `/global.css`
5. `/css/apya-shell.css`

**Scripts.Global**: `jquery-fix.js`, `notification-bell.js`, **`dark-mode.js`**, `ai-hub-client.js`, `ajax-error-detail.js`.

React island sayfaları ek olarak `_ApyaThemeBootstrap` partial'ı ile `~/js/style.css`'i (Tailwind çıktısı) yükler — token'lar zaten global bundle'dan gelir, çakışmaz.

---

## 4) Fontlar (self-host, CDN yok)

- `wwwroot/fonts/` → 4 variable woff2: **Inter** + **JetBrains Mono**, her biri latin + latin-ext subset (Türkçe tam kapsanır: ı latin'de, ĞğŞşİ latin-ext'te). Kaynak: `@fontsource-variable` (npm→kopya; runtime bağımlılık yok).
- `apya-fonts.css` → `@font-face` (weight ekseni: Inter 100–900, JBMono 100–800, `font-display: swap`, doğru `unicode-range`'ler).
- `body { font-family: var(--apya-font-sans) }` (apya-shell.css).
- **Para/sayı/ID/IBAN/kur = her zaman mono + tabular:** Razor'da `.apya-numeric` (apya-shell.css), React'te `.font-tabular` (index.css) — ikisi de `var(--apya-font-mono)` + `tabular-nums`.

---

## 5) Tema & density anahtarlama

**SoT:** `<html data-theme="light|dark" data-density="compact|cozy|comfortable">` · localStorage anahtarları: **`apya-theme`**, **`apya-density`**.

| Parça | Dosya | Görev |
|---|---|---|
| FOUC (paint öncesi) | `Pages/Shared/Components/ApyaThemeHead/` + `LayoutHooks.Head.Last` (PlatformWebModule) | Her sayfada: PWA manifest/theme-color/icon + data-theme çöz (kayıtlı ∥ OS) + data-density (kayıtlı ∥ cozy). **`/Account/*` her zaman light** (LeptonX account layout redesign dışı). |
| Toggle davranışı | `wwwroot/js/dark-mode.js` | data-theme flip + LeptonX class mirror (`lpx-theme-*`) + `body.dark-theme` + `abp.leptonX.theme.setTheme` senkron + sun/moon ikon. Header toggle yoksa floating fallback ekler. Sayfa başlığını header breadcrumb alanına yazar. |
| Header toggle butonu | `Theme/ThemeToggleViewComponent` + `ThemeToggleToolbarContributor` + `Pages/Shared/Components/ThemeToggle/Default.cshtml` | LeptonX ana toolbar'ında, bildirim zilinin solunda. Stil: `.apya-theme-toggle` (apya-shell.css §11). |

Density şu an yalnız **altyapı** (token + attribute + FOUC); kullanıcıya açık bir switch UI'ı henüz yok (P3'te tablo-yoğun bir ekranla gelecek).

---

## 6) Köprü katmanı — `wwwroot/css/apya-theme-bridge.css`

Bootstrap/LeptonX'i token'lara bağlar; **yalnız renk/görünüm** (layout LeptonX'te kalır). İçerik haritası:

- **Light köprü:** `--bs-primary`→accent, link→brand, success/danger/warning/info→semantic, `--lpx-primary`.
- **Dark köprü:** `--bs-body/card/dropdown/list-group/form/modal/table` + `--lpx-bg/section/content/card/text/border` → surface/text token'ları; `color-scheme: dark`.
- **Sabit utility güvenlik ağı (dark):** `.bg-white`→raised, `.bg-light`→sunken; `.text-dark` flip'i **yalnız bu zeminlerin içinde** (`bg-warning text-dark` gibi idiomatik kombinasyonlar bozulmaz).
- **`.card-title` dark fix:** LeptonX sabit koyu başlık rengini eziyordu → `:not([class*="text-"])` guard'lı override.
- **DataTables/card-header dark uyumu.**
- **P1 Shell:** sidebar (container + `#lpx-sidebar` + `nav.lpx-nav` + `ul.lpx-nav-menu` + logo + brand-name hepsi `--apya-surface-sidebar`; nav item `a.lpx-menu-item-link` hover/selected accent-soft pill; ikon/caret `inherit`), header (`.lpx-topbar` 57px + `--apya-surface-header` + kenarlık; `.lpx-breadcrumb-container .apya-page-title` 16px/650).
  ⚠️ Selektörler **canlı LeptonX v5 DOM'undan** doğrulandı (`a.lpx-menu-item-link`, `.lpx-menu-item > a` DEĞİL). LeptonX major upgrade'inde gözden geçir.
- **P2 Tablo:** `.table thead th` raised + uppercase 10.5px/700; satır yüksekliği `var(--row-h)`; hover raised; striped sunken; `.apya-numeric` kolon sağa dayalı; DataTables input/sayfalama token'ları. DOM/JS'e dokunmaz — server-side sıralama/sayfalama aynen çalışır.
- **P2 Buton/Chip:** `.btn/.form-control/.form-select` radius→`--apya-radius-lg`; `.btn-primary`→accent; `:focus-visible`→`--apya-shadow-focus`; **`.apya-chip` + `-accent/-positive/-negative/-warning/-brand/-ai/-neutral`** (color-mix %14 zemin + tonlu metin, dark varyantları dahil). `.apya-chip` **tek kaynak burasıdır** — apya-shell.css'te ikinci bir tanım vardı (BEM `--accent`/`--neutral`, 12px/500) ve sonra yüklendiği için bunu eziyordu; 2026-07-28 denetiminde kaldırıldı.
- **Semantic utility köprüsü (2026-07-28):** `--bs-{success,danger,warning,info,secondary}-rgb` + `-bg-subtle`/`-border-subtle`/`-text-emphasis` (light + dark). Bootstrap 5.3 renk utility'leri **hex değil `-rgb`** okur; yalnız `--bs-primary-rgb` köprülüydü, dolayısıyla `text-danger`/`bg-success`/`alert-info` gibi ~250 kullanım Bootstrap'ın kendi paletindeydi. Token değişirse **RGB üçlüleri de elle güncellenmeli** (var() rgba() içinde çalışmaz).
- **Buton varyantları (2026-07-28):** `.btn-outline-primary`, `.btn-secondary`/`.btn-outline-secondary`, `.btn-success/-danger/-warning`, `.btn-outline-success/-danger` → `--bs-btn-*` token override'ları. Bootstrap `.btn-*` sınıfları `--bs-btn-bg`'yi **sabit hex** yazdığı için `-rgb` köprüsü bunları kapsamaz. Solid varyantlarda metin `--apya-text-inverse` (light beyaz / dark neredeyse siyah) → parlaklaşan dark token zeminlerinde kontrast korunur.

---

## 7) Shell/polish katmanı — `wwwroot/css/apya-shell.css`

- Font smoothing + `body` font token'ı; `.apya-numeric`.
- Animasyon primitive'leri: `apyaFadeIn/PopIn/Shimmer/Pulse` + `.apya-fade-in/.apya-pop-in/.apya-skeleton/.apya-tap/.apya-row-actions`.
- Global transition default'ları (yalnız renk/opasite).
- Modal polish (radius xl, kenarlıklar, padding token'ları).
- Select2 / SweetAlert2 / datepicker / ABP toastr **dark uyumları**.
- Tipografi: `h1–h6` 650/-0.02em; `.text-muted`→tertiary.
- **Sayfa konteynerleri:** `.apya-page` (max 1400px) / `.apya-page--narrow` (860px); full-bleed ekranlar (kanban, form designer) wrapper kullanmaz.
- `.apya-overline` (uppercase KPI etiketi), `.kpi-icon-box` + **ton varyantları** `--accent/--positive/--negative/--warning/--brand/--ai/--neutral` ve boy varyantı `--sm` (38px). Ton formülü `.apya-chip` ile aynı (%14 color-mix + tonlu metin); `bg-{renk} bg-opacity-10` üçlüsünün yerini alır.
- **`.apya-form-section` / `.apya-form-section-title`** — modal/form içinde alan grubu kutusu (`bg-light p-3 rounded-3 border` tekrarının yerine).
- **`.apya-comment` / `--reply` / `--new`** — yanıtlanabilir yorum akışı kartları (görev drawer'ı).
- **`.apya-dropzone` (+ `.is-dragover`)** — kesikli kenarlıklı dosya bırakma alanı.
- `.apya-theme-toggle` (+ `--floating` fallback).

---

## 8) React island katmanı — `wwwroot/dynamic-assets/`

**tailwind.config.js** — token köprüsü:
- `darkMode: ['attribute', 'data-theme']` (aynı SoT).
- Semantic renkler: `surface-*`, `text-*`, `border-*`, `accent(-soft/-600)`, `positive/negative/warning` → `var(--apya-*)`.
- **Badge tone skalaları:** `neutral-100/200/500/700`, `brand-50/100/500/700`, `positive|negative|warning-50/100/500/700`, `critical-50/500/600`, `ai-50/500/600` → tokens.css değişkenlerine köprü. (Badge.jsx bunları kullanır; köprü olmadan sessizce transparent render oluyordu — düzeltildi.)
- boxShadow/borderColor token'ları; fontFamily.sans not: config `Plus Jakarta Sans` der ama fiili `--apya-font-sans` (Inter) kazanır.

**index.css** — `@tailwind` direktifleri + `@layer utilities { .font-tabular }` (mono + tabular-nums; 11 kullanım noktası: Dashboard widget'ları, MoneyInput, DataTable, ExpenseForm...).

**Primitive envanteri** (`src/components/`):
- `ui/`: **Card** (compound: Header/Title/Description/Body/Footer; variant default/elevated/flat/interactive; density compact/comfortable/spacious; **radius `rounded-xl`=12px**), **Badge** (tone: neutral/brand/positive/negative/warning/critical/ai + `withDot` a11y), Button, Input, MoneyInput (`font-tabular text-right`), Combobox, DateRangePicker, EmptyState, HoldButton, Sheet, Skeleton, SkeletonShape, ThemeToggle
- `data/DataTable` (numeric kolon → `font-tabular`)
- `layout/AdaptiveShell`
- `ai/`: ConfidenceMeter, SuggestionCard
- `dashboard/widgets/WidgetShell` — Bento widget ortak chrome'u (4-state kontratı: skeleton/empty/error/stale)

**Razor ortak parçaları** (`Pages/Shared/`): `_KpiCard` + `KpiCardModel`, `_EmptyState` + `EmptyStateModel`, `_KanbanBoard`, `_ApyaThemeBootstrap` (yalnız island sayfaları).

---

## 9) Build toolchain — `dynamic-assets/vite.config.js`

- **8 entry** (hepsi aktif): template-builder, form-builder, forms, public-form, responses, customers, **dashboard**, **expense-capture** → `../js/<name>.js`.
- **`manualChunks`** kategori bazlı sabit isimler: `react-vendor`, `grid-vendor`, `ui-vendor`, `query-vendor`, `signalr-vendor`.
- **`chunkFileNames: '[name].js'` — SABİT string KULLANMA.** Sabit `'vendor.js'`, çoklu shared chunk'ta Rollup'a çakışan otomatik isimler (`vendor2/3`) üretip import graph'ı bozdu ("does not provide an export" → Dashboard boş render). Bu turda canlı yakalanıp düzeltildi.
- CSS: `cssCodeSplit` yok → tüm island CSS'i tek `js/style.css`.
- Bağımlılık notu: `react-grid-layout` **1.5.3'e sabit** (v2 `WidthProvider`'ı kaldırdı, kaynak v1 API kullanır); react/react-dom `^18.2.0`.

**Yerel geliştirme prosedürü (sırayla, hepsi bu oturumda doğrulanmış gotcha):**
1. `npm run build` (dynamic-assets içinde) — island değişikliklerinde.
2. `Get-Process dotnet | Stop-Process -Force` — çalışan app **DLL kilitler**, build MSB3021/3027 ile patlar.
3. `dotnet build` → `./scripts/dev-up.ps1` — .NET **static asset fingerprint'i** (`style.<hash>.css`) process başında hesaplanır; npm build sonrası **restart şart**, yoksa eski hash servis edilir.
4. Tarayıcıda takılırsa: **PWA service worker** eski chunk'ları cache'ler → SW unregister + `caches.delete` (veya Incognito / "Clear site data").
5. ABP dev modda bundle dosyaları tek tek link'lenir (minify yok) — normaldir.

---

## 10) Yeni ekranı hi-fi'ye çekme — kontrol listesi (P3 tarifi)

1. **Konteyner:** `.apya-page` (liste/dashboard) veya `.apya-page--narrow` (ayarlar/odak); kanban/designer full-bleed.
2. **Tablo:** mevcut `.table`/DataTables otomatik hi-fi alır; parasal kolonlara `class="apya-numeric"` ekle (mono + sağa dayalı).
3. **Durum etiketi:** Razor → `<span class="apya-chip apya-chip-positive">Ödendi</span>`; React → `<Badge variant="positive" withDot>`. `bg-success`/`badge bg-*` KULLANMA (legacy köprü var ama yeni kod token-first).
4. **Kart/KPI/boş durum:** `.card` otomatik; KPI → `_KpiCard`; boş durum → `_EmptyState` ("Veri yok" yazma).
5. **Renk:** sabit hex/`bg-white`/`text-dark` YOK — token veya semantic sınıf. (Dark güvenlik ağı legacy içindir, bahane değil.)
6. **Animasyon:** `.apya-fade-in` kart girişi; drawer/modal `--apya-motion-*` + `--apya-easing-standard`.
7. **Grafik (chart.js 4.4):** HANDOFF config — line: gradient fill, tension .35, pointRadius 0; bar: radius 4, maxBarThickness 16; doughnut: cutout '72%'; grid light `#EEF0F3` / dark `rgba(255,255,255,.06)`; tooltip zemin `#111827`/`#1A1A1D`; **tema değişince chart yeniden kurulur.** (Ortak helper henüz yok — ilk grafik ekranında çıkarılacak, bkz. §11.)
8. **Doğrulama:** iki temada da canlı bak (toggle sağ üstte); beyaz-üstü-beyaz / görünmez yazı = bloker.

---

## 11) HANDOFF'a göre açık kalanlar (gap listesi)

| Gap | Not / plan |
|---|---|
| **Görsel QA (P3 sonuçları)** | **En yüksek öncelik.** 2026-07-12 gecesinden beri (kullanıcı Chrome bağlantısı koptu) yapılan tüm P3 chip/mono migrasyonu + Dashboard build-infra fix'i yalnız statik doğrulamalı (build+grep+HTTP smoke). Tarayıcıda gözden geçirilmeli. |
| `.apya-chip` badge migrasyonu | ✅ TAMAMLANDI — proje genelinde (`Pages/`) solid `badge bg-*` + `-subtle/-emphasis` kalıntısı grep ile sıfırlandı (~35 dosya, P3g). Yeni kod bu deseni bozarsa (Bootstrap badge geri gelirse) migrate et. |
| Phosphor ikonları | Bilinçli erteleme — app FontAwesome kullanıyor, HANDOFF eşleştirmeye izin veriyor. |
| Sidebar collapse 248/64px + logo PLATFORM rozeti | ✅ TAMAMLANDI — LeptonX'in YERLEŞİK `hover-trigger` rail mekanizması (72px, tema `.menu-collapse-icon` tıklamasında `lpx:side-menu-state` yazar ama yüklemede geri uygulamıyordu) + kalıcılık: ApyaThemeHead FOUC pre-paint `<html data-sidebar="collapsed">` uygular, `sidebar-toggle.js` class↔attribute senkronlar + a11y/tooltip. Rail kozmetiği (ikon merkezleme, bölüm başlığı→ayraç, tenant rozeti gizleme, scrollbar-kayması fix'i) apya-theme-bridge.css "SIDEBAR COLLAPSE" bölümünde; 768–1199px otomatik rail'i de kapsar. Genişlik temanın 72px'i (prototip ~64px, bilinçli sapma — tema geometrisiyle savaşmamak için). |
| Density switch UI | Altyapı hazır (`data-density`); kullanıcı switch'i ilk tablo-yoğun ekranla. |
| Drawer (görev detay, apyaSlide) ortak bileşeni | Tasks EditModal zaten chip/tone almış ama gerçek slide-drawer bileşeni çıkarılmadı. |
| chart.js ortak tema helper'ı (dark rebuild dahil) | ✅ **TAMAMLANDI (2026-07-28)** — `wwwroot/js/apya-chart-theme.js` → `window.apyaChart`. API: `options(config)` (HANDOFF grafik ayarları + token'lı ızgara/tooltip/punto + dataset renklerini paletten otomatik atama), `tone(ad)`, `palette()`, `alpha(renk, a)`, `gradient(ctx, renk, area)`, `onThemeChange(fn)`. Tema bildirimi: `dark-mode.js applyTheme()` artık `document` üzerinde **`apya:themechange`** CustomEvent yayınlar; tüketici chart'ı destroy+rebuild eder. Kullanıcılar: `Reports/index.js`, `AiCenter/Dashboard/Index.cshtml`. **`color-mix()` KULLANMA** — Chart.js kendi renk ayrıştırıcısını kullanır, `alpha()` rgba üretir. |
| **Cariler/Prompt/Rol/Workflow gerçek master-detail** | ✅ Cariler (customers.jsx v3, Tailwind lg: breakpoint) + Prompts + Workflows TAMAM — Razor tarafı ortak desen **apya-shell.css §13 `.apya-md*`** (sol liste accent-soft seçim, sağ detay, <992px liste↔detay geçişli). Yeni Razor ekranını master-detail'e çekerken bu sınıfları kullan; JS tarafı için referans: `Pages/AiCenter/Workflows/Index.js`. **Roller ekranı YAPILMADI** — ABP Identity NuGet sayfası, override ayrı karar. |
| `/Calendars` aylık-grid takvimi | Mevcut `/Calendars` = OAuth bağlantı ayarları (#86), HANDOFF'un istediği grid-takvim **hiç yok** — yeni özellik, redesign kapsamı dışı. |
| Sıradaki P3 ekranları (henüz taranmadı) | Hibeler (Grants), Dokümanlar (Documents), Form Oluşturucu (DynamicAssets/Forms), Ayarlar/TenantManagement/AiSettings — P3g yalnız MEVCUT badge kalıntılarını taradı, bu ekranların kendi layout/kart cilası ayrı iş. |
| **[Ayrı flag'lenen bug'lar — redesign dışı, task olarak kayıtlı]** | `/Calendars` index.js hiç yok (404, buton işlevsiz) · CashAccounts/CashMovements/Webhooks yetkisiz istekte HTTP 500 (graceful olmalı) · Dashboard SignalR negotiate 405. |
| Mobil (`apya-mobile`, ayrı repo) | Web foundation tamam → framework kararı verilince başlar; aynı token sistemi taşınır. |
