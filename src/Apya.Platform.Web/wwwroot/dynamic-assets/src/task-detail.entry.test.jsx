import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    await act(async () => { await import('./task-detail.jsx'); });
});

const TASK = {
    id: '22222222-3333-4444-5555-666666666666',
    title: 'Kanbandan açılan görev',
    description: '', startDate: '2026-06-25T00:00:00Z', dueDate: null,
    status: 1, priority: 2, isPrivate: false,
    assigneeId: null, projectId: null, parentTaskId: null,
    predecessorIds: [], boardColumnId: null, tags: [],
    subTasks: [], comments: [], attachments: [],
};

/**
 * STA-19: modal kapanınca koşulsuz sonuç yayınlanıyordu → kanban/liste yalnız bakıp
 * kapatınca da yeniden yükleniyor (kaydırma, odak kayboluyor), Kaydet sonrası kapanışta
 * İKİ kez yükleniyordu. Kapanış GERÇEK ada üzerinden kilitlenir: task-detail.jsx'in V3
 * dalı koşulsuz emitResult'a dönerse ilk vaka kırılır.
 *
 * SIRA ÖNEMLİ: bu blok, reset() çağıran bloktan ÖNCE koşmalı — reset() store
 * dinleyicilerini de siler ve adanın useSyncExternalStore aboneliği kopar (ada bir
 * daha açılmaz).
 */
describe('task-detail.jsx island — V3 kapanışı yalnız yazma olduysa sonuç yayınlar', () => {
    beforeEach(() => {
        /* window.apya DEĞİŞTİRİLMEZ (taskDetail API'si onun üzerinde); servis eklenir. */
        window.apya.platform = {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(TASK)),
                    getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
                    getProjectsLookup: vi.fn(() => Promise.resolve([])),
                    getFeatureAssignments: vi.fn(() => Promise.resolve([])),
                    getChecklistItems: vi.fn(() => Promise.resolve([])),
                    getComments: vi.fn(() => Promise.resolve([])),
                },
            },
        };
    });

    async function openAndWait() {
        await act(async () => { window.apya.taskDetail.open(TASK.id); });
        await screen.findByText(TASK.title);
    }

    async function pressEscape() {
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(taskDetailStore.getSnapshot()).toBeNull());
    }

    it('yalnız bakıp kapatınca onResult ÇAĞRILMAZ', async () => {
        const onResult = vi.fn();
        window.apya.taskDetail.onResult(onResult);

        await openAndWait();
        await pressEscape();

        expect(onResult).not.toHaveBeenCalled();
    });

    it('adada yazma olduysa kapanışta onResult BİR KEZ çağrılır', async () => {
        const onResult = vi.fn();
        window.apya.taskDetail.onResult(onResult);

        await openAndWait();
        taskDetailStore.markChanged();
        await pressEscape();

        expect(onResult).toHaveBeenCalledTimes(1);
    });
});

describe('task-detail.jsx island — abp.ModalManager uyumlu adaptör', () => {
    beforeEach(() => {
        taskDetailStore.reset();
    });

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
