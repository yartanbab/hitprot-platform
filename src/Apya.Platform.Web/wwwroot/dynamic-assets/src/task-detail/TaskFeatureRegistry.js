import { isGranted } from './hooks/useTaskDetail';
import { SubtasksTab } from './components/SubtasksTab';
import { FilesTab } from './components/FilesTab';
import { ChecklistTab } from './components/ChecklistTab';
import { CommentsTab } from './components/CommentsTab';
import { ActivityTab } from './components/ActivityTab';
import { HistoryTab } from './components/HistoryTab';
import { FinanceTab } from './components/FinanceTab';
import { GanttTabV3 } from './v3/features/GanttTabV3';
import { DependenciesTabV3 } from './v3/features/DependenciesAndFinanceTabV3';
import {
    RisksTabV3,
    TimeTrackingTabV3,
    CustomFieldsTabV3,
    EmailsTabV3,
    GalleryTabV3,
    DashboardTabV3
} from './v3/features/OtherFeaturesTabV3';

/**
 * Görev detayının 17 özelliklik sekme/özellik kayıt defteri (V3).
 */
export const TASK_FEATURE_REGISTRY = [
    {
        code: 'general', title: 'Genel', icon: 'fa-circle-info',
        category: 'gorev', isCore: true, order: 0, permission: null,
        implemented: true, component: null,
    },
    {
        code: 'subtasks', title: 'Alt Görevler', icon: 'fa-list-check',
        category: 'gorev', isCore: true, order: 1, permission: null,
        implemented: true, component: SubtasksTab,
    },
    {
        code: 'files', title: 'Dosyalar', icon: 'fa-paperclip',
        category: 'gorev', isCore: true, order: 2, permission: null,
        implemented: true, component: FilesTab,
    },
    {
        code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check',
        category: 'gorev', isCore: false, order: 10, permission: null,
        implemented: true, component: ChecklistTab,
    },
    {
        code: 'gantt', title: 'Gantt', icon: 'fa-bars-staggered',
        category: 'gorev', isCore: false, order: 11, permission: null,
        implemented: true, component: GanttTabV3,
    },
    {
        code: 'dependencies', title: 'Bağımlılıklar', icon: 'fa-link',
        category: 'gorev', isCore: false, order: 12, permission: null,
        implemented: true, component: DependenciesTabV3,
    },
    {
        code: 'finance', title: 'Finans', icon: 'fa-coins',
        category: 'finans', isCore: false, order: 13, permission: null,
        implemented: true, component: FinanceTab,
    },
    {
        code: 'history', title: 'Geçmiş', icon: 'fa-clock-rotate-left',
        category: 'gecmis', isCore: false, order: 14, permission: null,
        implemented: true, component: HistoryTab,
    },
    {
        code: 'activity', title: 'Aktiviteler', icon: 'fa-timeline',
        category: 'gecmis', isCore: false, order: 15, permission: null,
        implemented: true, component: ActivityTab,
    },
    {
        code: 'comments', title: 'Yorumlar', icon: 'fa-comments',
        category: 'iletisim', isCore: false, order: 20, permission: null,
        implemented: true, component: CommentsTab,
    },
    {
        code: 'risks', title: 'Riskler', icon: 'fa-triangle-exclamation',
        category: 'gorev', isCore: false, order: 21, permission: null,
        implemented: true, component: RisksTabV3,
    },
    {
        // component yok: onay akışı backend'i gelene kadar "yapım aşamasında" boş
        // durumu gösterilir (featureCatalogV3 UNBUILT_CODES).
        code: 'approvals', title: 'Onaylar', icon: 'fa-stamp',
        category: 'gorev', isCore: false, order: 22, permission: null,
        implemented: true, component: null,
    },
    {
        code: 'time-tracking', title: 'Zaman Takibi', icon: 'fa-stopwatch',
        category: 'gorev', isCore: false, order: 23, permission: null,
        implemented: true, component: TimeTrackingTabV3,
    },
    {
        code: 'dashboard', title: 'Gösterge Paneli', icon: 'fa-chart-pie',
        category: 'gorev', isCore: false, order: 24, permission: null,
        implemented: true, component: DashboardTabV3,
    },
    {
        code: 'ai', title: 'Yapay Zeka', icon: 'fa-sparkles',
        category: 'ileri', isCore: false, order: 30, permission: null,
        // component yok: LLM entegrasyonu gelene kadar boş durum (UNBUILT_CODES).
        implemented: true, component: null,
    },
    {
        code: 'custom-fields', title: 'Özel Alanlar', icon: 'fa-square-plus',
        category: 'ileri', isCore: false, order: 31, permission: null,
        implemented: true, component: CustomFieldsTabV3,
    },
    {
        code: 'automations', title: 'Otomasyonlar', icon: 'fa-wand-magic-sparkles',
        category: 'ileri', isCore: false, order: 32, permission: null,
        // component yok: kural motoru gelene kadar boş durum (UNBUILT_CODES).
        implemented: true, component: null,
    },
    {
        code: 'emails', title: 'E-postalar', icon: 'fa-envelope',
        category: 'iletisim', isCore: false, order: 33, permission: null,
        implemented: true, component: EmailsTabV3,
    },
    {
        code: 'gallery', title: 'Dosya Galerisi', icon: 'fa-image',
        category: 'finans', isCore: false, order: 34, permission: null,
        implemented: true, component: GalleryTabV3,
    },
];

/** Navbar'da GÖRÜNECEK sekmeler: implemented olan core'lar + implemented olan
 *  atanmış non-core'lar. */
export function getVisibleTabs(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => f.implemented && (f.isCore || assigned.has(f.code)))
        .sort((a, b) => a.order - b.order);
}

/** "+" picker'da listelenecek non-core entry'ler. */
export function getPickerEntries(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => !f.isCore)
        .filter((f) => !f.permission || isGranted(f.permission))
        .map((f) => ({ ...f, isAssigned: assigned.has(f.code) }))
        .sort((a, b) => a.order - b.order);
}
