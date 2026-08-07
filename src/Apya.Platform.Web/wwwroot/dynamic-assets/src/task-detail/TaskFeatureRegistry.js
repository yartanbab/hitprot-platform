import { isGranted } from './hooks/useTaskDetail';
import { SubtasksTab } from './components/SubtasksTab';
import { FilesTab } from './components/FilesTab';
import { ChecklistTab } from './components/ChecklistTab';
import { CommentsTab } from './components/CommentsTab';
import { ActivityTab } from './components/ActivityTab';
import { HistoryTab } from './components/HistoryTab';
import { FinanceTab } from './components/FinanceTab';
import { AdvancedTab } from './components/AdvancedTab';

/**
 * Görev detayının sekme/özellik kayıt defteri.
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
        code: 'comments', title: 'Yorumlar', icon: 'fa-comments',
        category: 'iletisim', isCore: false, order: 20, permission: null,
        implemented: true, component: CommentsTab,
    },
    {
        code: 'activity', title: 'Aktiviteler', icon: 'fa-timeline',
        category: 'gecmis', isCore: false, order: 30, permission: null,
        implemented: true, component: ActivityTab,
    },
    {
        code: 'history', title: 'Geçmiş', icon: 'fa-clock-rotate-left',
        category: 'gecmis', isCore: false, order: 31, permission: null,
        implemented: true, component: HistoryTab,
    },
    {
        code: 'finance', title: 'Finans', icon: 'fa-coins',
        category: 'finans', isCore: false, order: 40, permission: null,
        implemented: true, component: FinanceTab,
    },
    {
        code: 'dependencies', title: 'Bağımlılıklar', icon: 'fa-diagram-project',
        category: 'ileri', isCore: false, order: 50, permission: null,
        implemented: true, component: AdvancedTab,
    },
    {
        code: 'risks', title: 'Riskler', icon: 'fa-triangle-exclamation',
        category: 'ileri', isCore: false, order: 51, permission: null,
        implemented: true, component: AdvancedTab,
    },
    {
        code: 'approvals', title: 'Onaylar', icon: 'fa-stamp',
        category: 'ileri', isCore: false, order: 52, permission: null,
        implemented: true, component: AdvancedTab,
    },
    {
        code: 'time-tracking', title: 'Zaman Takibi', icon: 'fa-stopwatch',
        category: 'ileri', isCore: false, order: 53, permission: null,
        implemented: true, component: AdvancedTab,
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
