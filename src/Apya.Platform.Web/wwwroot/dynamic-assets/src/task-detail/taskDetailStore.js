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
        if (!id || id === currentTaskId) return;
        currentTaskId = id;
        emit();
    },
    close() {
        if (currentTaskId === null) return;
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
        resultHandlers.forEach((fn) => fn());
    },
    /** Yalnız testler için. */
    reset() {
        currentTaskId = null;
        listeners.clear();
        resultHandlers.clear();
    },
};
