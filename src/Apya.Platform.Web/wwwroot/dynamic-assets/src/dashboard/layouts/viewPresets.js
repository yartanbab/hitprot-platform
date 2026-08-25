import { StatStripCard } from '../cards/StatStripCard';
import { DeliveriesCard } from '../cards/DeliveriesCard';
import { ProjectHealthCard } from '../cards/ProjectHealthCard';
import { ApprovalsCard } from '../cards/ApprovalsCard';
import { BlockersCard } from '../cards/BlockersCard';
import { AiSuggestionsCard } from '../cards/AiSuggestionsCard';
import { IncomeExpenseCard } from '../cards/IncomeExpenseCard';
import { DeliveryHeatmapCard } from '../cards/DeliveryHeatmapCard';
import { ProjectPhasesCard } from '../cards/ProjectPhasesCard';
import { StatisticsBand } from '../cards/StatisticsBand';

/**
 * Görünümler (persona DEĞİL) — kullanıcı ne yapmaya geldiğine göre seçer.
 * Anahtarlar sunucudaki DashboardDefaultLayouts ile BİREBİR aynı olmalı;
 * kart düzeni bu anahtarla kaydediliyor.
 */
export const VIEWS = [
    { key: 'project-management', labelKey: 'Dashboard:View:ProjectManagement', fallback: 'Proje Yönetimi' },
    { key: 'finance',            labelKey: 'Dashboard:View:Finance',            fallback: 'Finans' },
    { key: 'today',              labelKey: 'Dashboard:View:Today',              fallback: 'Bugün' },
    { key: 'grants',             labelKey: 'Dashboard:View:Grants',             fallback: 'Hibe takibi' },
];

export const DEFAULT_VIEW = 'project-management';

/**
 * Kart kaydı — sunucudaki `cardKey` değerleri bileşene burada bağlanır.
 * `w`/`h`: kart kataloğundan eklenirken kullanılan varsayılan boyut.
 */
export const CARD_REGISTRY = {
    /* h=2 (140px): kutucuk içeriği ~122px. h=3 verilince ızgara kutusu
       içerikten ~75px yüksek kalıyor ve altındaki satırla arasında ölü boşluk
       oluşuyordu. minH de 2 olmalı — aksi halde RGL yüksekliği 3'e zorlar. */
    /* `band`: kart yatay bir şerittir — dar kırılımlarda yarım genişliğe
       düşürülmez, hep tam satır kaplar (içeriği kolonlara yayılıyor). */
    'summary-strip':    { component: StatStripCard,      titleKey: 'Dashboard:Card:SummaryStrip',   fallback: 'Sayısal özet',       w: 12, h: 2, minW: 6, minH: 2, band: true },
    'deliveries':       { component: DeliveriesCard,     titleKey: 'Dashboard:Deliveries:Title',    fallback: 'Bu ay teslim edilecekler', w: 7, h: 8, minW: 4, minH: 5 },
    'project-health':   { component: ProjectHealthCard,  titleKey: 'Dashboard:Health:Title',        fallback: 'Proje sağlığı',      w: 5,  h: 8, minW: 3, minH: 5 },
    'approvals':        { component: ApprovalsCard,      titleKey: 'Dashboard:Approvals:Title',     fallback: 'Bende bekleyen kararlar', w: 4, h: 6, minW: 3, minH: 4 },
    'blockers':         { component: BlockersCard,       titleKey: 'Dashboard:Blockers:Title',      fallback: 'Tıkanan işler & risk', w: 4, h: 6, minW: 3, minH: 4 },
    'ai-suggestions':   { component: AiSuggestionsCard,  titleKey: 'Dashboard:Ai:Title',            fallback: 'AI önerileri',       w: 4,  h: 6, minW: 3, minH: 3 },
    'income-expense':   { component: IncomeExpenseCard,  titleKey: 'Dashboard:IncomeExpense:Title', fallback: 'Gelir / gider',      w: 4,  h: 6, minW: 3, minH: 4 },
    'delivery-heatmap': { component: DeliveryHeatmapCard,titleKey: 'Dashboard:Heatmap:Title',       fallback: 'Teslim yoğunluğu',   w: 4,  h: 6, minW: 3, minH: 4 },
    'project-phases':   { component: ProjectPhasesCard,  titleKey: 'Dashboard:Phases:Title',        fallback: 'Proje fazları',      w: 4,  h: 6, minW: 3, minH: 4 },
    'statistics-band':  { component: StatisticsBand,     titleKey: 'Dashboard:Statistics:Title',    fallback: 'İstatistikler',      w: 12, h: 6, minW: 6, minH: 4, band: true },
};

/* Izgara sabitleri — react-grid-layout ile paylaşılır.
   Tasarımın kesirli ızgaraları (1.55fr:1fr ve 1.2fr:1fr:1fr) 12 kolona tam
   oturmuyor; en yakın tamsayı karşılıkları 7/5 ve 4/4/4 olarak alındı.

   🔴 EŞİKLER VIEWPORT DEĞİL, IZGARA KABININ GENİŞLİĞİDİR.
   RGL kırılımı `width` prop'uyla karşılaştırır; biz de o prop'a kabın ÖLÇÜLEN
   genişliğini veriyoruz (bkz DashboardRoot). Eskiden buraya viewport değerleri
   (1200/768) yazılmıştı: 1440px ekranda kenar çubuğu 280 + kaydırma çubuğu 15 +
   `main` px-4 32 = 327px düşünce kap 1113px kalıyor ve ızgara kendini "tablet"
   sanıyordu — yani 12 kolonluk düzen 1527px'ten dar HER ekranda devre dışıydı.

   Yeni eşikler kart genişliğinden türetildi:
     desktop ≥ 920  → 12 kolon; en dar kart (w=4) 4*55+60 = 280px
     tablet  ≥ 560  →  6 kolon; yarım kart (w=3) 3*70+40 = 250px
     mobil   <  560 →  1 kolon */
export const GRID_BREAKPOINTS = { desktop: 920, tablet: 560, mobile: 0 };
export const GRID_COLS = { desktop: 12, tablet: 6, mobile: 1 };
export const GRID_ROW_HEIGHT = 64;
/* Kart ↔ kart boşluğu 12px (kullanıcı kararı). Yatay ve dikey aynı — özet
   şeridi de dahil her yerde tek bir boşluk değeri geçerli, istisna yok. */
export const GRID_MARGIN = [12, 12];
/* Izgaranın KENDİ kenar dolgusu yok. RGL'e `containerPadding` verilmezse
   `margin`i kenara da uygular; sayfa dolgusuyla toplanınca sol/sağ 16+20=36px
   oluyordu. Kenar boşluğu artık TEK yerden gelir: `main` px-[18px] pb-[18px]. */
export const GRID_CONTAINER_PADDING = [0, 0];

/** Kabın genişliğinden kırılım adı — RGL ile AYNI eşikleri kullanır. */
export function tierFromWidth(width) {
    if (width >= GRID_BREAKPOINTS.desktop) return 'desktop';
    if (width >= GRID_BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
}

/** Tam genişlikteki bir kartın piksel genişliği (iki yandan containerPadding düşer). */
export function fullWidthCardWidth(gridWidth) {
    return Math.max(0, gridWidth - GRID_CONTAINER_PADDING[0] * 2);
}

/**
 * Sayısal özet şeridinin kutucuk düzeni — ŞERİDİN KENDİ genişliğinden türer.
 *
 * Eşikler tahmin değil, Inter ile ölçülen metin genişliklerinden:
 *   normal kutucuk  = etiket(≤100) + ikon 24 + gap 8 + px-4 32  → ≥ 170px
 *   bütçe kutucuğu  = altyazı(118) + Gauge 58 + gap 10 + p-4 32 → ≥ 218px
 *
 * Bütçe kutucuğu diğerlerinden pahalı olduğu için 5'li dizilimde eşit kolon
 * KULLANILMAZ: 4×2fr + 3fr ile ona %50 fazla pay verilir (normal 180, bütçe 271).
 * Eşit 5 kolonda kutucuk ~199px kalıyordu ve "Bütçe kullanımı" + para satırı
 * kırpılıyordu — kullanıcının bildirdiği "Büt…" hatası buydu.
 *
 * `h` satır sayısını takip eder; sabit h=2 bırakılırsa çok satırlı dizilimde
 * kutucuklar tek satırlık kutuya sıkışıp içerikleri kırpılıyor (kutucuklar h-full).
 * RGL kutu yüksekliği = 64h + 12(h-1). Bir kutucuk satırı 140px (h=2), satır
 * arası da 12px → n satırlık dizilim için h = 2n (2 → 140, 4 → 292, 6 → 444).
 */
export function stripLayoutFor(stripWidth) {
    if (stripWidth >= 1015) return { template: 'repeat(4, minmax(0, 2fr)) minmax(0, 3fr)', h: 2 };
    if (stripWidth >= 694)  return { template: 'repeat(3, minmax(0, 1fr))', h: 4 };
    if (stripWidth >= 456)  return { template: 'repeat(2, minmax(0, 1fr))', h: 6 };
    /* Dar mobil: tek kolonlu dev kartlar (h=10 → 820px) ekranı yiyordu.
       Kompakt kip: 2 kolon küçük kutucuk (padding/punto küçülür, sparkline
       gizlenir), bütçe kutucuğu tam satıra yayılır → 3 satır.
       h=4 → 76*4-12 = 292px; gap 12 ile satır ≈ 89px. (Kompakt kip yalnız
       mobilde geçerli, orada kartlar NativeStack ile doğal yükseklikte akar.) */
    return { template: 'repeat(2, minmax(0, 1fr))', h: 4, compact: true };
}

const VIEW_STORAGE_KEY = 'apya-dashboard-view';

/** Aktif sekme lokalde kalır (düzenin kendisi SUNUCUDA — bkz useDashboardLayout). */
export function readViewPreference() {
    try {
        const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
        return VIEWS.some((v) => v.key === stored) ? stored : DEFAULT_VIEW;
    } catch {
        return DEFAULT_VIEW;
    }
}

export function writeViewPreference(viewKey) {
    try {
        window.localStorage.setItem(VIEW_STORAGE_KEY, viewKey);
    } catch {
        /* Gizli sekmede localStorage yazılamaz — görünüm oturumluk kalır, hata yok. */
    }
}
