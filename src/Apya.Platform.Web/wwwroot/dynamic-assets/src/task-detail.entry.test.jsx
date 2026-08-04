import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { taskDetailStore } from './task-detail/taskDetailStore';

/**
 * apya-kanban.js DEĞİŞTİRİLEMEZ (Faz 1'in sabit kısıtı) ve şu şekilde çağırıyor:
 *   editModal.open({ id: $(this).data('id') })
 *   editModal.onResult(function () { load(); onChanged(); })
 *
 * Bu test, task-detail.jsx'in mount olduğunda window.apya.taskDetail'i TAM
 * OLARAK bu iki metotla kurduğunu ve ikisinin de taskDetailStore'a doğru
 * yönlendiğini doğrular — modülü gerçekten import edip (mock'lamadan) canlı
 * DOM üzerinde çalıştırarak.
 *
 * Modül yalnız BİR KEZ import ediliyor (beforeAll): ES modülleri singleton'dır,
 * vi.resetModules() burada YANLIŞ olur — task-detail.jsx içindeki taskDetailStore
 * ile bu dosyanın üstte import ettiği taskDetailStore farklı modül kopyalarına
 * ayrılır ve testler birbirini görmeyen iki store'la karşı karşıya kalır.
 */
beforeAll(async () => {
    document.body.innerHTML = '<div id="task-detail-island"></div>';
    window.apya = window.apya || {};
    window.abp = window.abp || { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn() } };
    await import('./task-detail.jsx');
});

beforeEach(() => {
    taskDetailStore.reset();
});

describe('task-detail.jsx island — abp.ModalManager uyumlu adaptör', () => {
    it('window.apya.taskDetail.open ve .onResult fonksiyon olarak kurulur', () => {
        expect(typeof window.apya.taskDetail.open).toBe('function');
        expect(typeof window.apya.taskDetail.onResult).toBe('function');
    });

    it('open({id}) — apya-kanban.js nesne formuyla cagirir — store\'u gunceller', () => {
        const id = '11111111-2222-3333-4444-555555555555';

        window.apya.taskDetail.open({ id });

        expect(taskDetailStore.getSnapshot()).toBe(id);
    });

    it('onResult ile kaydedilen callback emitResult\'ta cagrilir', () => {
        const onResult = vi.fn();

        window.apya.taskDetail.onResult(onResult);
        taskDetailStore.emitResult();

        expect(onResult).toHaveBeenCalledTimes(1);
    });
});
