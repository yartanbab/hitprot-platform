/**
 * taskDetailStore — island DIŞINDAN (jQuery sayfa script'leri) imperatif açma.
 *
 * useSyncExternalStore deseni lib/device/useDeviceMode.jsx ile aynı — bu repoda
 * kurulu idiom. Redux/zustand eklemeye gerek yok, tek bir Guid tutuyoruz.
 *
 * open() hem 'guid' hem {id:'guid'} kabul eder çünkü apya-kanban.js
 * `editModal.open({ id: ... })` çağırıyor ve o dosya DEĞİŞTİRİLMEYECEK.
 */
let currentTaskId = null;
const listeners = new Set();
const resultHandlers = new Set();
/* Adada son sonuç yayınından beri yazma oldu (ya da başladı) mı? Modül düzeyinde:
   bayrağı okuyan onClose kökün DIŞINDA (task-detail.jsx) ve kök kapanışta sökülüyor. */
let changedSinceEmit = false;

function emit() {
    listeners.forEach((l) => l());
}

function normalizeId(arg) {
    if (typeof arg === 'string' && arg) return arg;
    if (arg && typeof arg === 'object' && typeof arg.id === 'string' && arg.id) return arg.id;
    return null;
}

export const taskDetailStore = {
    open(arg) {
        const id = normalizeId(arg);
        if (!id) return;
        currentTaskId = id;
        emit();
    },
    close() {
        currentTaskId = null;
        emit();
    },
    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot() {
        return currentTaskId;
    },
    /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
    onResult(fn) {
        if (typeof fn === 'function') resultHandlers.add(fn);
    },
    emitResult() {
        changedSinceEmit = false;
        resultHandlers.forEach((fn) => fn());
    },
    /** Adada bir yazma oldu ya da başladı — kapanışta liste/kanban tazelensin. */
    markChanged() {
        changedSinceEmit = true;
    },
    /** Yalnız yazma olduysa sonuç yayınlar: salt bakıp kapatmak sayfayı yeniden yüklemez.
        'this' kullanılmaz; metot referansla da geçirilebilir. */
    emitResultIfChanged() {
        if (changedSinceEmit) taskDetailStore.emitResult();
    },
    /** Yalnız testler için. */
    reset() {
        currentTaskId = null;
        changedSinceEmit = false;
        listeners.clear();
        resultHandlers.clear();
    },
};
