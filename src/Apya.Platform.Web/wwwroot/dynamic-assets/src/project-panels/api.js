/**
 * ABP proxy köprüsü — useTaskFeatures.js ile aynı desen: jQuery Deferred'ler
 * native Promise'e sarılır. Uçlar TaskAppService'in proje kapsamı metodları
 * (birleşik sekme sistemi PR-2b); yazma uçları görev-kapsamlı mevcut uçlardır —
 * üst kapsamdan düzenleme kaynağa yazar.
 */
function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) throw new Error('ABP görev servisi yüklenmedi.');
    return s;
}

const p = (v) => Promise.resolve(v);

// Çapraz-proje kip projectId'siz çağırır; undefined verilirse ABP proxy
// parametreyi hiç yazmaz ve sunucu null bağlar (null literal'i güvenmeyip
// burada normalize ediyoruz).
const opt = (projectId) => projectId ?? undefined;

export const api = {
    projectDocuments: (projectId) => p(svc().getProjectDocuments(opt(projectId))),
    projectForms: (projectId) => p(svc().getProjectLinkedForms(opt(projectId))),
    projectChecklist: (projectId) => p(svc().getProjectChecklist(opt(projectId))),
    projectDependencies: (projectId) => p(svc().getProjectDependencies(opt(projectId))),

    /** Proje adı/kodu lookup'ı — çapraz-proje kipte grup başlıkları için
     *  (görevi olmayan projenin proje-seviyesi maddesi ada başka yerden ulaşamaz). */
    projectsLookup: () => p(svc().getProjectsLookup()),

    document: (documentId) => p(svc().getDocument(documentId)),
    createDocument: (taskId, title) => p(svc().createDocument(taskId, title)),
    updateDocument: (documentId, input) => p(svc().updateDocument(documentId, input)),
    deleteDocument: (documentId) => p(svc().deleteDocument(documentId)),

    addChecklistItem: (taskId, text) => p(svc().addChecklistItem(taskId, text)),
    // PR-3a hiyerarşik kapsam: doğrudan projeye bağlı madde (TaskId boş).
    addProjectChecklistItem: (projectId, text) => p(svc().addProjectChecklistItem(projectId, text)),
    toggleChecklistItem: (itemId) => p(svc().toggleChecklistItem(itemId)),
    deleteChecklistItem: (itemId) => p(svc().deleteChecklistItem(itemId)),
};

/**
 * Projenin görev listesi — TEK istek, dört panel kökü arasında PAYLAŞILIR
 * (başlık/kod/durum gruplama ve seçiciler için). Modül seviyesi önbellek:
 * kökler ayrı React ağaçları olduğu için ortak context kurulamıyor.
 * projectId null = tüm görünür görevler (çapraz-proje kip; liste ucunun
 * kendi 1000 kaydı sınırı burada da geçerli).
 */
const tasksCache = new Map();

export function projectTasks(projectId, { force = false } = {}) {
    const key = projectId ?? '__all__';
    if (!force && tasksCache.has(key)) { return tasksCache.get(key); }
    const promise = p(svc().getList({ projectId: opt(projectId), maxResultCount: 1000, rootOnly: false }))
        .then((r) => r?.items ?? []);
    tasksCache.set(key, promise);
    // Başarısız istek önbellekte KALMASIN — sonraki deneme tazeden gitsin.
    promise.catch(() => { tasksCache.delete(key); });
    return promise;
}

/** Görev detay modalını açar (vanilla köprü — ProjectDetails sayfasında hazır). */
export function openTask(taskId) {
    window?.apya?.taskDetail?.open?.(taskId);
}
