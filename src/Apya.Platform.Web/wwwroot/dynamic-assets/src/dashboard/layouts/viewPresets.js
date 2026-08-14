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
    /* h=2 (138px): kutucuk içeriği ~122px. h=3 verilince ızgara kutusu
       içerikten ~75px yüksek kalıyor ve altındaki satırla arasında ölü boşluk
       oluşuyordu. minH de 2 olmalı — aksi halde RGL yüksekliği 3'e zorlar. */
    'summary-strip':    { component: StatStripCard,      titleKey: 'Dashboard:Card:SummaryStrip',   fallback: 'Sayısal özet',       w: 12, h: 2, minW: 6, minH: 2 },
    'deliveries':       { component: DeliveriesCard,     titleKey: 'Dashboard:Deliveries:Title',    fallback: 'Bu ay teslim edilecekler', w: 7, h: 8, minW: 4, minH: 5 },
    'project-health':   { component: ProjectHealthCard,  titleKey: 'Dashboard:Health:Title',        fallback: 'Proje sağlığı',      w: 5,  h: 8, minW: 3, minH: 5 },
    'approvals':        { component: ApprovalsCard,      titleKey: 'Dashboard:Approvals:Title',     fallback: 'Bende bekleyen kararlar', w: 4, h: 6, minW: 3, minH: 4 },
    'blockers':         { component: BlockersCard,       titleKey: 'Dashboard:Blockers:Title',      fallback: 'Tıkanan işler & risk', w: 4, h: 6, minW: 3, minH: 4 },
    'ai-suggestions':   { component: AiSuggestionsCard,  titleKey: 'Dashboard:Ai:Title',            fallback: 'AI önerileri',       w: 4,  h: 6, minW: 3, minH: 3 },
    'income-expense':   { component: IncomeExpenseCard,  titleKey: 'Dashboard:IncomeExpense:Title', fallback: 'Gelir / gider',      w: 4,  h: 6, minW: 3, minH: 4 },
    'delivery-heatmap': { component: DeliveryHeatmapCard,titleKey: 'Dashboard:Heatmap:Title',       fallback: 'Teslim yoğunluğu',   w: 4,  h: 6, minW: 3, minH: 4 },
    'project-phases':   { component: ProjectPhasesCard,  titleKey: 'Dashboard:Phases:Title',        fallback: 'Proje fazları',      w: 4,  h: 6, minW: 3, minH: 4 },
    'statistics-band':  { component: StatisticsBand,     titleKey: 'Dashboard:Statistics:Title',    fallback: 'İstatistikler',      w: 12, h: 6, minW: 6, minH: 4 },
};

/* Izgara sabitleri — react-grid-layout ile paylaşılır.
   Tasarımın kesirli ızgaraları (1.55fr:1fr ve 1.2fr:1fr:1fr) 12 kolona tam
   oturmuyor; en yakın tamsayı karşılıkları 7/5 ve 4/4/4 olarak alındı. */
export const GRID_BREAKPOINTS = { desktop: 1200, tablet: 768, mobile: 0 };
export const GRID_COLS = { desktop: 12, tablet: 8, mobile: 1 };
export const GRID_ROW_HEIGHT = 64;
/* Kart ↔ kart boşluğu, başlık → kart boşluğundan (16px) bilinçli olarak DAHA DAR:
   kartlar tek bir blok gibi okunsun, sayfa başlığı onlardan ayrışsın. */
export const GRID_MARGIN = [10, 10];

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
