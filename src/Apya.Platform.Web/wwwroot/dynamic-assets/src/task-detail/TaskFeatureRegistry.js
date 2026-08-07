import { isGranted } from './hooks/useTaskDetail';
import { SubtasksTab } from './components/SubtasksTab';
import { FilesTab } from './components/FilesTab';
import { ChecklistTab } from './components/ChecklistTab';

/**
 * Görev detayının sekme/özellik kayıt defteri. Faz 4+ yeni bir non-core özellik
 * eklediğinde tek değişiklik burada bir entry eklemek/`component`'ı doldurmak
 * olmalı — TaskFeatureNavbar, FeaturePicker, TaskDetailRoot bu listeyi okur,
 * kendileri değişmez.
 *
 * component: null → henüz inşa edilmedi ("Yakında" rozeti). isCore: true → "+"
 * picker'da hiç listelenmez, navbar'da implemented olduğu an daima görünür
 * (kaldırılamaz). `general` entry'sinin component'i YOK — TaskDetailRoot onu
 * özel olarak, useTaskForm'un sahip olduğu form state'iyle render eder; her
 * gelecek entry ise kendi kendine yeten bir component olacak ({ taskId, task }
 * dışında dışarıdan prop almayacak).
 *
 * Roadmap'in `availabilityRule`/`badgeResolver` alanları burada YOK: hiçbir
 * entry henüz bunları üretmiyor/tüketmiyor — ilk gerçek ihtiyaçta eklenecek.
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
        implemented: false, component: null,
    },
    {
        code: 'activity', title: 'Aktiviteler', icon: 'fa-timeline',
        category: 'gecmis', isCore: false, order: 30, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'history', title: 'Geçmiş', icon: 'fa-clock-rotate-left',
        category: 'gecmis', isCore: false, order: 31, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'finance', title: 'Finans', icon: 'fa-coins',
        category: 'finans', isCore: false, order: 40, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'dependencies', title: 'Bağımlılıklar', icon: 'fa-diagram-project',
        category: 'ileri', isCore: false, order: 50, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'risks', title: 'Riskler', icon: 'fa-triangle-exclamation',
        category: 'ileri', isCore: false, order: 51, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'approvals', title: 'Onaylar', icon: 'fa-stamp',
        category: 'ileri', isCore: false, order: 52, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'time-tracking', title: 'Zaman Takibi', icon: 'fa-stopwatch',
        category: 'ileri', isCore: false, order: 53, permission: null,
        implemented: false, component: null,
    },
];

/** Navbar'da GÖRÜNECEK sekmeler: implemented olan core'lar + implemented olan
 *  atanmış non-core'lar. Sırasız gelen assignedCodes'a güvenmiyoruz, `order`'a
 *  göre sıralıyoruz (backend'in kendi notu: liste sırasız döner). */
export function getVisibleTabs(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => f.implemented && (f.isCore || assigned.has(f.code)))
        .sort((a, b) => a.order - b.order);
}

/** "+" picker'da listelenecek non-core entry'ler — izin filtresi uygulanmış,
 *  atanmışlık bilgisi eklenmiş. isCore entry'ler burada HİÇ görünmez. */
export function getPickerEntries(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => !f.isCore)
        .filter((f) => !f.permission || isGranted(f.permission))
        .map((f) => ({ ...f, isAssigned: assigned.has(f.code) }))
        .sort((a, b) => a.order - b.order);
}
