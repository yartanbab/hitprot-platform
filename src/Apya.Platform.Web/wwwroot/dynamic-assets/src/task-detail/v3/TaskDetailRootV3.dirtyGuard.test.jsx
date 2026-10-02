import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { TaskDetailRootV3 } from './TaskDetailRootV3';
import { taskDetailStore } from '../taskDetailStore';

/**
 * Görev detayı V3 — kaydedilmemiş değişiklik penceresi (CON-01, TSK-04).
 *
 * CON-01: guard kirliyken `pendingClose` kuruyor ama V3 pencereyi çizmiyordu → Vazgeç, ✕,
 *   Esc ve arka plan tıklaması kirli formda sessizce yutuluyordu.
 * TSK-04: kayıt düşünce (403 / 409 / 500 / oturum) form kirli kalıyor, hiçbir çıkış yolu
 *   çalışmıyordu — kullanıcı modalda kilitleniyordu.
 * Kurulum TaskDetailRootV3.freshness.test.jsx ile aynı (gerçek QueryProvider + servis sahteleri).
 */

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    code: 'GRV-30',
    title: 'Otel Konaklama Anlaşması',
    description: '<p>Kayıtlı açıklama metni</p>',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 2, priority: 2, isPrivate: false,
    assigneeId: null, projectId: null, parentTaskId: null,
    predecessorIds: [], boardColumnId: null, tags: [],
    subTasks: [], comments: [], attachments: [],
    lastModificationTime: '2026-07-10T09:45:00Z',
};

const SUB = {
    ...TASK,
    id: '99999999-2222-3333-4444-555555555555',
    code: 'GRV-31',
    title: 'Oda listesini çıkar',
    description: '',
    parentTaskId: TASK.id,
};

const COPY = { ...TASK, id: '77777777-2222-3333-4444-555555555555', code: 'GRV-32', title: 'Otel Konaklama Anlaşması (kopya)' };

const DIRTY = 'Kaydedilmemiş değişiklikler var';
const TITLE = 'Kaydedilmemiş değişiklikleriniz var';
const STAY = 'Düzenlemeye devam et';
const DISCARD = 'Değişiklikleri at';
const SAVE_CLOSE = 'Kaydet ve çık';

let svc;
let byId;

beforeEach(() => {
    window.sessionStorage.clear();
    taskDetailStore.reset();
    byId = { [TASK.id]: TASK, [SUB.id]: SUB, [COPY.id]: COPY };
    svc = {
        get: vi.fn((id) => Promise.resolve(byId[id])),
        update: vi.fn(() => Promise.resolve(TASK)),
        transfer: vi.fn(() => Promise.resolve({ createdTaskIds: [COPY.id] })),
        getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
        getProjectsLookup: vi.fn(() => Promise.resolve([])),
        getFeatureAssignments: vi.fn(() => Promise.resolve([])),
        getChecklistItems: vi.fn(() => Promise.resolve([])),
        getAttachments: vi.fn(() => Promise.resolve([])),
        getComments: vi.fn(() => Promise.resolve([])),
    };
    window.apya = { platform: { tasks: { task: svc } } };
    window.abp = {
        currentUser: { id: 'u1', tenantId: 't1', userName: 'ybaba' },
        auth: { isGranted: () => true },
        notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
    };
    window.history.replaceState(null, '', '/Tasks');
});

afterEach(() => {
    delete window.abp;
    delete window.apya;
    window.sessionStorage.clear();
});

async function open({ presentation = 'modal', onClose = vi.fn() } = {}) {
    render(
        <QueryProvider>
            <TaskDetailRootV3 taskId={TASK.id} presentation={presentation} onClose={onClose} />
        </QueryProvider>,
    );
    await screen.findByText(TASK.title);
    return onClose;
}

/** Formu kirletir: etiket ekler (ızgara her sekmede görünür). */
async function addTag(name = 'konaklama') {
    fireEvent.click(screen.getByLabelText('Yeni etiket ekle'));
    const input = screen.getByPlaceholderText('Etiket…');
    fireEvent.change(input, { target: { value: name } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await screen.findByText(DIRTY);
}

const dialog = () => screen.findByRole('alertdialog', { name: TITLE });
const noDialog = () => expect(screen.queryByRole('alertdialog')).toBeNull();
const button = (name) => screen.getByRole('button', { name });

/** Dört çıkış yolu — hepsi guard'dan geçer. */
const EXITS = [
    ['Vazgeç', () => userEvent.click(button('Vazgeç'))],
    ['✕', () => userEvent.click(screen.getByTitle('Kapat (Esc)'))],
    ['Esc', () => userEvent.keyboard('{Escape}')],
    ['arka plan tıklaması', () => userEvent.click(document.querySelector('.z-modal-backdrop'))],
];

describe('TaskDetailRootV3 — kirli formda çıkış pencere açar (CON-01)', () => {
    it.each(EXITS)('%s: pencere açılır, modal kapanmaz', async (_name, exit) => {
        const onClose = await open();
        await addTag();

        await exit();

        expect(await dialog()).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: new RegExp(`^(${STAY}|${DISCARD}|${SAVE_CLOSE})$`) })).toHaveLength(3);
        expect(button(STAY)).toHaveFocus();
        expect(onClose).not.toHaveBeenCalled();
        expect(svc.update).not.toHaveBeenCalled();
    });

    it.each(EXITS)('temiz formda %s doğrudan kapatır (pencere çizilmez)', async (_name, exit) => {
        const onClose = await open();

        await exit();

        expect(onClose).toHaveBeenCalledTimes(1);
        noDialog();
    });

    it('pencere açıkken Esc: pencere kapanır, modal ve yazılan değer yerinde', async () => {
        const onClose = await open();
        await addTag();
        await userEvent.click(button('Vazgeç'));
        await dialog();

        await userEvent.keyboard('{Escape}');

        await waitFor(noDialog);
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByText('konaklama')).toBeInTheDocument();
        expect(screen.getByText(DIRTY)).toBeInTheDocument();

        // Pencere kapandıktan sonra ikinci Esc modalı KAPATMAZ, pencereyi yeniden açar.
        await userEvent.keyboard('{Escape}');
        expect(await dialog()).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('"Değişiklikleri at": kaydetmeden kapatır', async () => {
        const onClose = await open();
        await addTag();
        await userEvent.click(button('Vazgeç'));
        await dialog();

        await userEvent.click(button(DISCARD));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(svc.update).not.toHaveBeenCalled();
    });

    it('"Kaydet ve çık": kaydeder, sonra kapatır; sonuç BİR KEZ yayınlanır', async () => {
        const listener = vi.fn();
        taskDetailStore.onResult(listener);
        const onClose = vi.fn(() => taskDetailStore.emitResultIfChanged());   // task-detail.jsx V3 dalı gibi
        await open({ onClose });
        await addTag();
        const saved = { ...TASK, tags: [{ id: 'g1', name: 'konaklama' }] };
        svc.update.mockImplementation(() => Promise.resolve(saved));
        byId[TASK.id] = saved;
        await userEvent.click(button('Vazgeç'));
        await dialog();

        await userEvent.click(button(SAVE_CLOSE));

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
        expect(svc.update).toHaveBeenCalledTimes(1);
        expect(svc.update.mock.calls[0][1].tagNames).toEqual(['konaklama']);
        expect(svc.update.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0]);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('"Kaydet ve çık" doğrulama hatasında: pencere kapanır, kayıt gitmez, modal açık kalır', async () => {
        const onClose = await open();
        fireEvent.change(document.querySelectorAll('input[type="date"]')[1], { target: { value: '' } });   // Başlangıç
        await screen.findByText(DIRTY);
        await userEvent.click(button('Vazgeç'));
        await dialog();

        await userEvent.click(button(SAVE_CLOSE));

        await waitFor(noDialog);
        expect(svc.update).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        expect(window.abp.notify.error).toHaveBeenCalled();
    });

    it('pencere açıkken Ctrl+S kayıt tetiklemez', async () => {
        await open();
        await addTag();
        await userEvent.click(button('Vazgeç'));
        await dialog();

        fireEvent.keyDown(window, { key: 's', ctrlKey: true });
        await act(async () => { await Promise.resolve(); });

        expect(svc.update).not.toHaveBeenCalled();
    });

    it('pencere yokken Ctrl+S kaydeder (kısayol yerinde)', async () => {
        await open();
        await addTag();

        fireEvent.keyDown(window, { key: 's', ctrlKey: true });

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
    });
});

describe('TaskDetailRootV3 — kayıt düşünce kullanıcı kilitlenmez (TSK-04)', () => {
    it('"Kaydet ve çık" sunucu hatasında pencere AÇIK kalır; "Değişiklikleri at" ile çıkılır', async () => {
        svc.update.mockImplementation(() => Promise.reject(Object.assign(new Error('Yetkiniz yok'), { status: 403 })));
        const onClose = await open();
        await addTag();
        await userEvent.click(button('Vazgeç'));
        await dialog();

        await userEvent.click(button(SAVE_CLOSE));

        expect(await screen.findByText('Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.')).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();
        await waitFor(() => expect(button(DISCARD)).toBeEnabled());

        await userEvent.click(button(DISCARD));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(svc.update).toHaveBeenCalledTimes(1);
    });

    it('altbilgideki Kaydet düştükten sonra Vazgeç → pencere → "Değişiklikleri at" çıkarır', async () => {
        svc.update.mockImplementation(() => Promise.reject(new Error('Sunucu hatası')));
        const onClose = await open();
        await addTag();
        await userEvent.click(button('Kaydet'));
        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(button('Kaydet')).toBeEnabled());

        await userEvent.click(button('Vazgeç'));
        await dialog();
        // Hata satırı yalnız "Kaydet ve çık" düştüğünde çıkar.
        expect(screen.queryByText(/Kaydedilemedi\. Düzenlemeye dönebilir/)).toBeNull();
        await userEvent.click(button(DISCARD));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('kayıt sürerken Esc / ✕ yok sayılır; Vazgeç düğmesi kilitli', async () => {
        let release;
        svc.update.mockImplementation(() => new Promise((resolve) => { release = resolve; }));
        const onClose = await open();
        await addTag();
        fireEvent.click(button('Kaydet'));
        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));

        expect(button('Vazgeç')).toBeDisabled();
        await userEvent.keyboard('{Escape}');
        fireEvent.click(screen.getByTitle('Kapat (Esc)'));

        noDialog();
        expect(onClose).not.toHaveBeenCalled();
        await act(async () => { release(TASK); });
        await waitFor(() => expect(button('Vazgeç')).toBeEnabled());
    });
});

describe('TaskDetailRootV3 — sayfa sunumu', () => {
    const unloadBlocked = () => {
        const event = new Event('beforeunload', { cancelable: true });
        window.dispatchEvent(event);
        return event.defaultPrevented;
    };

    it('URL\'e ?task eklenmez: Vazgeç tek adımda sayfadan çıkarır', async () => {
        window.history.replaceState(null, '', `/Tasks/Detail/${TASK.id}`);
        const pushSpy = vi.spyOn(window.history, 'pushState');

        await open({ presentation: 'page' });

        expect(pushSpy).not.toHaveBeenCalled();
        expect(window.location.search).toBe('');
    });

    it('modal sunumunda ?task eklenmeye devam eder (geri tuşu modalı kapatır)', async () => {
        await open();
        await waitFor(() => expect(window.location.search).toBe(`?task=${TASK.id}`));
    });

    it('kirliyken Vazgeç pencereyi açar; "Değişiklikleri at" çıkarır ve tarayıcı ikinci kez sormaz', async () => {
        const blockedDuringClose = [];
        const onClose = vi.fn(() => blockedDuringClose.push(unloadBlocked()));   // history.back() anı
        await open({ presentation: 'page', onClose });
        await addTag();
        await waitFor(() => expect(unloadBlocked()).toBe(true));

        await userEvent.click(button('Vazgeç'));
        await dialog();
        expect(onClose).not.toHaveBeenCalled();
        await userEvent.click(button(DISCARD));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(blockedDuringClose).toEqual([false]);
    });
});

describe('TaskDetailRootV3 — başka göreve geçiş de guard\'dan geçer (CON-01)', () => {
    async function openSubtaskSheet() {
        fireEvent.click(screen.getByRole('button', { name: /Alt Görevler/ }));
        fireEvent.click(await screen.findByText(SUB.title));
        return screen.findByTitle('Tam detayda aç');
    }

    beforeEach(() => {
        byId[TASK.id] = { ...TASK, subTasks: [{ id: SUB.id, code: SUB.code, title: SUB.title, status: 1, priority: 2 }] };
    });

    it('temizken "Tam detayda aç" doğrudan o göreve geçer', async () => {
        await open();
        fireEvent.click(await openSubtaskSheet());

        noDialog();
        await waitFor(() => expect(screen.queryByText(TASK.title)).toBeNull());
        expect(await screen.findByText(SUB.title)).toBeInTheDocument();
    });

    it('kirliyken "Tam detayda aç" pencere açar; "devam et" denince geçilmez, "at" denince geçilir', async () => {
        const onClose = await open();
        await addTag();
        fireEvent.click(await openSubtaskSheet());
        await dialog();

        await userEvent.click(button(STAY));
        await waitFor(noDialog);
        expect(screen.getByText(TASK.title)).toBeInTheDocument();
        expect(screen.getByText('konaklama')).toBeInTheDocument();

        fireEvent.click(await openSubtaskSheet());
        await dialog();
        await userEvent.click(button(DISCARD));

        await waitFor(() => expect(screen.queryByText(TASK.title)).toBeNull());
        expect(await screen.findByText(SUB.title)).toBeInTheDocument();
        expect(screen.queryByText(DIRTY)).toBeNull();
        expect(onClose).not.toHaveBeenCalled();
        expect(svc.update).not.toHaveBeenCalled();
    });

    const duplicate = () => {
        fireEvent.click(screen.getByRole('button', { name: /diğer seçenekler/i }));
        fireEvent.click(screen.getByText('Çoğalt'));
    };

    it('temizken "Çoğalt" doğrudan kopyaya geçer', async () => {
        await open();

        duplicate();

        expect(await screen.findByText(COPY.title)).toBeInTheDocument();
        noDialog();
    });

    it('kirliyken "Çoğalt": kopya oluşur, geçiş için pencere açılır; "at" denince kopyaya geçilir', async () => {
        await open();
        await addTag();

        duplicate();

        await dialog();
        expect(svc.transfer).toHaveBeenCalledTimes(1);
        expect(screen.getByText(TASK.title)).toBeInTheDocument();
        expect(screen.queryByText(COPY.title)).toBeNull();

        await userEvent.click(button(DISCARD));

        expect(await screen.findByText(COPY.title)).toBeInTheDocument();
        expect(svc.update).not.toHaveBeenCalled();
    });
});
