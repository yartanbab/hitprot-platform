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

export const api = {
    projectDocuments: (projectId) => p(svc().getProjectDocuments(projectId)),
    projectForms: (projectId) => p(svc().getProjectLinkedForms(projectId)),
    projectChecklist: (projectId) => p(svc().getProjectChecklist(projectId)),
    projectDependencies: (projectId) => p(svc().getProjectDependencies(projectId)),

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
 */
const tasksCache = new Map();

export function projectTasks(projectId, { force = false } = {}) {
    if (!force && tasksCache.has(projectId)) { return tasksCache.get(projectId); }
    const promise = p(svc().getList({ projectId, maxResultCount: 1000, rootOnly: false }))
        .then((r) => r?.items ?? []);
    tasksCache.set(projectId, promise);
    // Başarısız istek önbellekte KALMASIN — sonraki deneme tazeden gitsin.
    promise.catch(() => { tasksCache.delete(projectId); });
    return promise;
}

/** Görev detay modalını açar (vanilla köprü — ProjectDetails sayfasında hazır). */
export function openTask(taskId) {
    window?.apya?.taskDetail?.open?.(taskId);
}
