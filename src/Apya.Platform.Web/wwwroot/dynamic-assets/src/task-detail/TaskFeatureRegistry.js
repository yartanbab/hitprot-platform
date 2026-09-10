import { isGranted } from './hooks/useTaskDetail';
import { SubtasksTab } from './components/SubtasksTab';
import { FilesTab } from './components/FilesTab';
import { ChecklistTabV3 } from './v3/features/ChecklistTabV3';
import { CommentsTab } from './components/CommentsTab';
import { SharingTab } from './components/SharingTab';
import { ActivityTab } from './components/ActivityTab';
import { HistoryTabV3 } from './v3/features/HistoryTabV3';
import { FinanceTab } from './components/FinanceTab';
import { GalleryTabV3 } from './v3/features/GalleryTabV3';
import { SubtaskTableTabV3 } from './v3/features/SubtaskTableTabV3';
import { SubtaskBoardTabV3 } from './v3/features/SubtaskBoardTabV3';
import { TaskCalendarTabV3 } from './v3/features/TaskCalendarTabV3';
import { DocumentsTabV3 } from './v3/features/DocumentsTabV3';
import { FormsTabV3 } from './v3/features/FormsTabV3';
import { GanttTabV3 } from './v3/features/GanttTabV3';
import { DependenciesTabV3 } from './v3/features/DependenciesAndFinanceTabV3';
// Not: dosyada artık yalnız TimeTrackingTabV3 var — diğer "OtherFeatures*"
// bileşenleri Faz 10-B'de silindi (hepsi uydurma içerik basıyordu ve kodları
// UNBUILT_CODES'ta olduğu için zaten render edilmiyordu).
import { TimeTrackingTabV3 } from './v3/features/OtherFeaturesTabV3';

/**
 * Görev detayının sekme/özellik kayıt defteri (V3). Sayı sık değiştiği için
 * burada yazılmaz — tek doğruluk kaynağı dizinin kendisi.
 *
 * `surfaces`: modülün hangi yüzeylerde panel olarak açılabildiği (birleşik
 * sekme sistemi) — 'task' (görev detayı) · 'project' (proje detay konsolu) ·
 * 'tasks' (/Tasks çapraz-proje). Alansız kayıt yalnız 'task' sayılır. PR-1'de
 * yalnız VERİ: proje//Tasks katalog menüleri bu alanı PR-2'de okuyacak.
 * Kaynak: design_handoff_sekme_esitleme (wireframe 2a-2i kapsam çipleri).
 */
export const TASK_FEATURE_REGISTRY = [
    {
        code: 'general', title: 'Genel', icon: 'fa-circle-info',
        category: 'gorev', isCore: true, order: 0, permission: null,
        implemented: true, component: null,
        surfaces: ['task'],
    },
    {
        code: 'subtasks', title: 'Alt Görevler', icon: 'fa-list-check',
        category: 'gorev', isCore: true, order: 1, permission: null,
        implemented: true, component: SubtasksTab,
        surfaces: ['task'],
    },
    {
        code: 'files', title: 'Dosyalar', icon: 'fa-paperclip',
        category: 'gorev', isCore: true, order: 2, permission: null,
        implemented: true, component: FilesTab,
        surfaces: ['task'],
    },
    {
        // Alt görevlerin tablo/kanban görünümleri ve tarih takvimi — üçü de
        // görevin kendi `subTasks` koleksiyonundan beslenir, ek uç YOK.
        code: 'subtask-table', title: 'Tablo', icon: 'fa-table',
        category: 'gorev', isCore: false, order: 6, permission: null,
        implemented: true, component: SubtaskTableTabV3,
        surfaces: ['task'],
    },
    {
        code: 'subtask-board', title: 'Kanban', icon: 'fa-table-columns',
        category: 'gorev', isCore: false, order: 7, permission: null,
        implemented: true, component: SubtaskBoardTabV3,
        surfaces: ['task'],
    },
    {
        code: 'calendar', title: 'Takvim', icon: 'fa-calendar-days',
        category: 'gorev', isCore: false, order: 8, permission: null,
        implemented: true, component: TaskCalendarTabV3,
        surfaces: ['task', 'project', 'tasks'],
    },
    {
        code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check',
        category: 'gorev', isCore: false, order: 10, permission: null,
        implemented: true, component: ChecklistTabV3,
        surfaces: ['task', 'project'],
    },
    {
        code: 'gantt', title: 'Gantt', icon: 'fa-bars-staggered',
        category: 'gorev', isCore: false, order: 11, permission: null,
        implemented: true, component: GanttTabV3,
        surfaces: ['task', 'project', 'tasks'],
    },
    {
        code: 'dependencies', title: 'Bağımlılıklar', icon: 'fa-link',
        category: 'gorev', isCore: false, order: 12, permission: null,
        implemented: true, component: DependenciesTabV3,
        surfaces: ['task', 'project'],
    },
    {
        code: 'finance', title: 'Finans', icon: 'fa-coins',
        category: 'finans', isCore: false, order: 13, permission: null,
        implemented: true, component: FinanceTab,
        // Proje ve /Tasks yüzeylerinde Finans katalog modülü değil SABİT sekme
        // (bütçe kapılı) — o yüzden yalnız 'task'.
        surfaces: ['task'],
    },
    {
        code: 'history', title: 'Geçmiş', icon: 'fa-clock-rotate-left',
        category: 'gecmis', isCore: false, order: 14, permission: null,
        implemented: true, component: HistoryTabV3,
        surfaces: ['task', 'project'],
    },
    {
        code: 'activity', title: 'Aktiviteler', icon: 'fa-timeline',
        category: 'gecmis', isCore: false, order: 15, permission: null,
        implemented: true, component: ActivityTab,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        code: 'comments', title: 'Yorumlar', icon: 'fa-comments',
        category: 'iletisim', isCore: false, order: 20, permission: null,
        implemented: true, component: CommentsTab,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        // Ekip dışına açılan süreli linkler. permission dolu olduğu için "+" picker'da
        // yalnız yetkisi olana görünür; sekmenin kendisi de yetkiyi ayrıca kontrol eder
        // (izin sonradan alınmış bir görevde sekme atanmış kalabilir).
        code: 'sharing', title: 'Dış Paylaşım', icon: 'fa-share-nodes',
        category: 'iletisim', isCore: false, order: 25,
        permission: 'Platform.Tasks.ShareExternally',
        implemented: true, component: SharingTab,
        surfaces: ['task'],
    },
    {
        code: 'risks', title: 'Riskler', icon: 'fa-triangle-exclamation',
        category: 'gorev', isCore: false, order: 21, permission: null,
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        // component yok: onay akışı backend'i gelene kadar "yapım aşamasında" boş
        // durumu gösterilir (featureCatalogV3 UNBUILT_CODES).
        code: 'approvals', title: 'Onaylar', icon: 'fa-stamp',
        category: 'gorev', isCore: false, order: 22, permission: null,
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        code: 'time-tracking', title: 'Zaman Takibi', icon: 'fa-stopwatch',
        category: 'gorev', isCore: false, order: 23, permission: null,
        implemented: true, component: TimeTrackingTabV3,
        surfaces: ['task'],
    },
    {
        code: 'dashboard', title: 'Gösterge Paneli', icon: 'fa-chart-pie',
        category: 'gorev', isCore: false, order: 24, permission: null,
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
        // `hidden` yalnız GÖREV DETAYI yüzeyini kapatır; /Tasks'ta Gösterge
        // Paneli sabit pano olarak zaten var, proje yüzeyi PR-2'de açılacak.
        surfaces: ['project', 'tasks'],
    },
    {
        code: 'ai', title: 'Yapay Zeka', icon: 'fa-sparkles',
        category: 'ileri', isCore: false, order: 30, permission: null,
        // component yok: LLM entegrasyonu gelene kadar boş durum (UNBUILT_CODES).
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        code: 'custom-fields', title: 'Özel Alanlar', icon: 'fa-square-plus',
        category: 'ileri', isCore: false, order: 31, permission: null,
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        code: 'automations', title: 'Otomasyonlar', icon: 'fa-wand-magic-sparkles',
        category: 'ileri', isCore: false, order: 32, permission: null,
        // component yok: kural motoru gelene kadar boş durum (UNBUILT_CODES).
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        code: 'emails', title: 'E-postalar', icon: 'fa-envelope',
        category: 'iletisim', isCore: false, order: 33, permission: null,
        implemented: true, component: null,
        hidden: true, // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    },
    {
        // Göreve bağlı zengin metin belgeleri (TaskDocument tablosu). Dosya
        // ekinden ayrıdır: ek yüklenen dosyayı, belge yazılan metni saklar.
        code: 'documents', title: 'Belge', icon: 'fa-file-lines',
        category: 'gorev', isCore: false, order: 9, permission: null,
        implemented: true, component: DocumentsTabV3,
        surfaces: ['task', 'project'],
    },
    {
        // Form KOPYALANMAZ: Form Yönetimi'ndeki bir AppDocument'e bağ kurulur.
        // Yanıtlar görev bağlamıyla (AppResponse.TaskId) toplanır.
        code: 'forms', title: 'Form', icon: 'fa-clipboard-list',
        category: 'gorev', isCore: false, order: 9.5, permission: null,
        implemented: true, component: FormsTabV3,
        surfaces: ['task', 'project'],
    },
    {
        code: 'gallery', title: 'Dosya Galerisi', icon: 'fa-image',
        category: 'finans', isCore: false, order: 34, permission: null,
        implemented: true, component: GalleryTabV3,
        surfaces: ['task', 'project', 'tasks'],
    },
];

/** Navbar'da GÖRÜNECEK sekmeler: implemented olan core'lar + implemented olan
 *  atanmış non-core'lar. */
export function getVisibleTabs(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => !f.hidden)
        .filter((f) => f.implemented && (f.isCore || assigned.has(f.code)))
        .sort((a, b) => a.order - b.order);
}

/**
 * GİZLİ ÖZELLİKLER (2026-09-03) — `hidden: true` işaretli kayıtlar hem "+"
 * kataloğundan hem sekme çubuğundan düşer; göreve daha önce atanmış olsalar bile
 * render EDİLMEZLER (atama satırı DB'de durmaya devam eder, veri kaybı yok).
 *
 * Gerekçe: arkalarında DB'ye yazan bir akış yoktu (Riskler, Yapay Zeka,
 * Otomasyonlar, Özel Alanlar, E-postalar, Onaylar, Gösterge Paneli) ya da
 * içerikleri başka bir sekmede zaten sunuluyordu (Yorumlar → Genel sekmesi).
 * Aktiviteler'in çalışan bir bileşeni VAR; ürün kararıyla şimdilik kapatıldı,
 * kodu yerinde duruyor.
 *
 * Geri açmak: ilgili kayıttan `hidden` satırını sil (tek yer) ve
 * `v3/featureCatalogV3.test.js` içindeki HIDDEN_CODES listesini güncelle.
 */

/** "+" picker'da listelenecek non-core entry'ler. */
export function getPickerEntries(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => !f.hidden)
        .filter((f) => !f.isCore)
        .filter((f) => !f.permission || isGranted(f.permission))
        .map((f) => ({ ...f, isAssigned: assigned.has(f.code) }))
        .sort((a, b) => a.order - b.order);
}
