import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDetailRoot } from './TaskDetailRoot';

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Otel Konaklama Anlaşması',
    description: 'Detaylar',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 4, priority: 4, isPrivate: true,
    assigneeId: null,
    creatorId: 'u1', lastModifierId: 'u1',
    projectId: 'p1', projectName: 'Otel Projesi',
    parentTaskId: null, predecessorIds: [], boardColumnId: null,
    tags: [],
    lastModificationTime: '2026-07-10T09:45:00Z',
    creationTime: '2026-06-25T14:30:00Z',
};

const USERS = { items: [{ id: 'u1', userName: 'ybaba', name: 'Yakup', surname: 'Babaoğlu' }] };

function wrap(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(TASK)),
                    update: vi.fn(() => Promise.resolve()),
                    getUsersLookup: vi.fn(() => Promise.resolve(USERS)),
                },
            },
        },
    };
    window.abp = {
        auth: { isGranted: () => true },
        notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
    };
    window.history.replaceState(null, '', '/Tasks');
});

describe('TaskDetailRoot', () => {
    it('yuklenirken iskelet gosterir', () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText('Görev yükleniyor')).toBeInTheDocument();
    });

    it('veri gelince baslik gorunur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(await screen.findByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
    });

    it('temizken kapat dogrudan kapatir', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('API hatasinda hata mesaji ve tekrar dene gosterir', async () => {
        window.apya.platform.tasks.task.get = vi.fn(() => Promise.reject(new Error('403')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(await screen.findByText(/Görev yüklenemedi/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    });

    it('veri ekrandayken tazeleme duserse form kalir (hata govdesine donmez)', async () => {
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(<QueryClientProvider client={qc}><TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} /></QueryClientProvider>);
        await screen.findByText('Otel Konaklama Anlaşması');

        window.apya.platform.tasks.task.get = vi.fn(() => Promise.reject(Object.assign(new Error('401'), { status: 401 })));
        await qc.invalidateQueries();
        await waitFor(() => expect(window.apya.platform.tasks.task.get).toHaveBeenCalled());
        // TanStack gözlemci bildirimini makro görevle dağıtır: olumsuz iddiadan önce bekle.
        await new Promise((resolve) => setTimeout(resolve, 30));

        expect(screen.getByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
        expect(screen.queryByText(/Görev yüklenemedi/)).toBeNull();
    });

    it('acilinca URLe ?task ekler', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await waitFor(() => expect(window.location.search).toBe(`?task=${TASK.id}`));
    });

    it('Kaydet temizken devre disi, alan degisince aktif olur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();

        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled();
    });

    it('Kaydete basinca update cagrilir, cache invalidate olur, dirty temizlenir', async () => {
        // Sunucu kullanicinin gonderdigi degeri AYNEN geri dondurur (trim/canonicalization
        // yok) - bu, dirty-guard'in gercekten form.isDirty'yi izledigini kanitlayan
        // "eslesen" senaryo. Trim-uyusmazligi senaryosu bir sonraki testte.
        let getCallCount = 0;
        window.apya.platform.tasks.task.get = vi.fn(() => {
            getCallCount += 1;
            return Promise.resolve(getCallCount === 1
                ? TASK
                : { ...TASK, title: 'Otel Konaklama Anlaşması ek' });
        });
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.update).toHaveBeenCalledWith(
            TASK.id,
            expect.objectContaining({ title: 'Otel Konaklama Anlaşması ek' }),
        ));
        await waitFor(() => expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled());
    });

    it('kayit sonrasi sunucu degeri istemciden farkliysa (trim) Kaydet aktif kalir, kapatinca uyarir', async () => {
        // Sunucu title'i trim'liyor: kullanicinin gonderdigi 'Otel Konaklama Anlaşması ek '
        // (sondaki bosluk) yerine backend'den 'Otel Konaklama Anlaşması ek' (trim'li) donuyor.
        let getCallCount = 0;
        window.apya.platform.tasks.task.get = vi.fn(() => {
            getCallCount += 1;
            return Promise.resolve(getCallCount === 1
                ? TASK
                : { ...TASK, title: 'Otel Konaklama Anlaşması ek' });
        });
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');

        await userEvent.type(screen.getByLabelText('Başlık'), ' ek ');
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.update).toHaveBeenCalled());
        // Sunucu deger (trim'li) ile istemci deger (sondaki boslukla) hala farkli oldugu icin
        // Kaydet aktif kalmali, guard 'temiz' YALANI soylememeli.
        await waitFor(() => expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled());
    });

    it('kayit hatasinda girilen deger form\'da kalir', async () => {
        window.apya.platform.tasks.task.update = vi.fn(() => Promise.reject(new Error('sunucu hatasi')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalled());
        expect(screen.getByLabelText('Başlık')).toHaveValue('Otel Konaklama Anlaşması ek');
    });

    it('kirliyken kapatinca uyari gosterir; Kaydet ve cik kaydedip kapatir', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));

        expect(await screen.findByRole('alertdialog', { name: 'Kaydedilmemiş değişiklikleriniz var' })).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet ve çık' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.update).toHaveBeenCalled());
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });

    /* Faz 5 — pencere ortak bileşen (components/ui/UnsavedChangesDialog). */
    const openDirtyDialog = async (onClose) => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        return screen.findByRole('alertdialog');
    };

    it('pencere acikken Esc pencereyi kapatir; modal ve yazilan deger yerinde', async () => {
        const onClose = vi.fn();
        await openDirtyDialog(onClose);

        await userEvent.keyboard('{Escape}');

        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Başlık')).toHaveValue('Otel Konaklama Anlaşması ek');
    });

    it('Degisiklikleri at: kaydetmeden kapatir', async () => {
        const onClose = vi.fn();
        await openDirtyDialog(onClose);

        await userEvent.click(screen.getByRole('button', { name: 'Değişiklikleri at' }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(window.apya.platform.tasks.task.update).not.toHaveBeenCalled();
    });

    it('Kaydet ve cik sunucu hatasinda pencere ACIK kalir; Degisiklikleri at ile cikilir', async () => {
        window.apya.platform.tasks.task.update = vi.fn(() => Promise.reject(new Error('sunucu hatasi')));
        const onClose = vi.fn();
        await openDirtyDialog(onClose);

        await userEvent.click(screen.getByRole('button', { name: 'Kaydet ve çık' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.update).toHaveBeenCalled());
        expect(await screen.findByText(/Kaydedilemedi\. Düzenlemeye dönebilir/)).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('button', { name: 'Değişiklikleri at' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('Kaydet ve cik dogrulama hatasinda pencere kapanir, hata alanin altinda, kayit gitmez', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.clear(screen.getByLabelText('Başlık'));
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        await screen.findByRole('alertdialog');

        await userEvent.click(screen.getByRole('button', { name: 'Kaydet ve çık' }));

        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
        expect(screen.getByText('Başlık zorunlu.')).toBeInTheDocument();
        expect(window.apya.platform.tasks.task.update).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('sayfa sunumunda URLe ?task EKLENMEZ (Vazgec tek adimda sayfadan cikarir)', async () => {
        window.history.replaceState(null, '', `/Tasks/Detail/${TASK.id}`);
        const pushSpy = vi.spyOn(window.history, 'pushState');
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="page" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');

        expect(pushSpy).not.toHaveBeenCalled();
        expect(window.location.search).toBe('');
    });

    it('silme onayinda SIL yazilmadan buton aktif olmaz', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        await userEvent.click(screen.getByRole('menuitem', { name: /Sil/ }));

        const confirmBtn = screen.getByRole('button', { name: 'Evet, sil' });
        expect(confirmBtn).toBeDisabled();

        await userEvent.type(screen.getByLabelText('Onay metni'), 'SİL');
        expect(confirmBtn).toBeEnabled();
    });

    it('silme onaylaninca servis cagrilir ve modal kapanir', async () => {
        const onClose = vi.fn();
        window.apya.platform.tasks.task.delete = vi.fn(() => Promise.resolve());
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        await userEvent.click(screen.getByRole('menuitem', { name: /Sil/ }));
        await userEvent.type(screen.getByLabelText('Onay metni'), 'SİL');
        await userEvent.click(screen.getByRole('button', { name: 'Evet, sil' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.delete).toHaveBeenCalledWith(TASK.id));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });
});
