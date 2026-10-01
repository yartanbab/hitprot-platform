import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within, act } from '@testing-library/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { TaskDetailRootV3 } from './TaskDetailRootV3';
import { taskDetailStore } from '../taskDetailStore';

/**
 * Görev detayının TAZELİĞİ — gerçek kalıcılaştırma sağlayıcısıyla (restore testiyle
 * aynı kurulum).
 *
 * TSK-01: detay ve görev kapsamlı sorgular sessionStorage'a yazılıp 30 sn taze
 *   sayılıyordu; kanbanda taşınan görev yeniden açılınca eski durumla geliyor, Kaydet
 *   eski durumu geri yazıyordu.
 * STA-04: aynı görev için sunucudan gelen yeni veri forma yansımıyordu; arşivle ya da
 *   kayıt sonrası etiket düzeltmesi formu sebepsiz "kirli" bırakıyordu.
 * STA-19: kapanışta liste/kanban yalnız yazma olduysa tazelenmeli; yazma izi istek
 *   BAŞLARKEN alınmalı (uçuştaki istekle kapatma).
 */

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
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

const CACHE_KEY = 'apya-rq-cache';
const DIRTY = 'Kaydedilmemiş değişiklikler var';

let svc;
let client;

beforeEach(() => {
    window.sessionStorage.clear();
    taskDetailStore.reset();
    svc = {
        get: vi.fn(() => Promise.resolve(TASK)),
        update: vi.fn(() => Promise.resolve(TASK)),
        updateStatus: vi.fn(() => Promise.resolve()),
        delete: vi.fn(() => Promise.resolve()),
        getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
        getProjectsLookup: vi.fn(() => Promise.resolve([])),
        getFeatureAssignments: vi.fn(() => Promise.resolve([])),
        getChecklistItems: vi.fn(() => Promise.resolve([])),
        addChecklistItem: vi.fn(() => Promise.resolve()),
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
    window.sessionStorage.clear();
});

function GrabClient() {
    client = useQueryClient();
    return null;
}

function openModal(onClose = () => {}) {
    return render(
        <QueryProvider>
            <GrabClient />
            <TaskDetailRootV3 taskId={TASK.id} presentation="modal" onClose={onClose} />
        </QueryProvider>,
    );
}

async function openLoaded(onClose) {
    const view = openModal(onClose);
    await screen.findByText(TASK.title);
    return view;
}

function clickMenuItem(name) {
    fireEvent.click(screen.getByRole('button', { name: /diğer seçenekler/i }));
    fireEvent.click(screen.getByText(name));
}

async function addTag(name) {
    fireEvent.click(screen.getByLabelText('Yeni etiket ekle'));
    const input = screen.getByPlaceholderText('Etiket…');
    fireEvent.change(input, { target: { value: name } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await screen.findByText(DIRTY);
}

describe('TaskDetailRootV3 — görev detayı açılışta taze gelir (TSK-01)', () => {
    it('yeniden açılışta görev ve kontrol listesi sunucudan gelir; oturum önbelleğine yazılmaz', async () => {
        const first = await openLoaded();

        // Persister throttleTime 1000 → lookup'lar yazılana kadar bekle.
        await waitFor(() => expect(window.sessionStorage.getItem(CACHE_KEY)).toContain('users-lookup'),
                      { timeout: 4000 });
        const blob = window.sessionStorage.getItem(CACHE_KEY);
        expect(blob).not.toContain(TASK.title);
        ['task-checklist', 'task-features', 'task-comments'].forEach((k) => expect(blob).not.toContain(k));

        first.unmount();

        // Görev bu arada kanbanda "Yapılacak"a taşındı, madde proje konsolunda işaretlendi.
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, status: 1 }));
        svc.getChecklistItems.mockImplementation(() =>
            Promise.resolve([{ id: 'c1', text: 'Sözleşmeyi imzala', isDone: true }]));

        await openLoaded();

        await waitFor(() => expect(screen.getAllByText('Yapılacak').length).toBeGreaterThan(0));
        expect(screen.queryByText('Sürüyor')).not.toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Tamamlandı işaretini kaldır' })).toBeInTheDocument();
        expect(svc.get).toHaveBeenCalledTimes(2);
        expect(svc.getChecklistItems).toHaveBeenCalledTimes(2);
        expect(screen.queryByText(DIRTY)).not.toBeInTheDocument();
    });
});

describe('TaskDetailRootV3 — form sunucu verisine yeniden temellenir (STA-04)', () => {
    it('Arşivle sonrası durum güncellenir, form kirli görünmez', async () => {
        await openLoaded();
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, status: 4 }));

        clickMenuItem('Arşivle');

        await waitFor(() => expect(svc.updateStatus).toHaveBeenCalledWith(TASK.id, 4));
        await waitFor(() => expect(screen.getAllByText('Tamamlandı').length).toBeGreaterThan(0));
        expect(screen.queryByText(DIRTY)).not.toBeInTheDocument();
        expect(screen.queryByText('Taslak')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
    });

    it('tazelemeyle gelen durum değişikliği, kullanıcının önceliğini ezmeden kaydedilir', async () => {
        await openLoaded();

        fireEvent.click(screen.getByRole('button', { name: 'Orta' }));
        const menu = screen.getByText('Öncelik seç').parentElement;
        fireEvent.click(within(menu).getByText('Kritik'));
        await screen.findByText(DIRTY);

        // Görev başka yerde "Yapılacak"a taşındı; odak tazelemesi geldi.
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, status: 1 }));
        await act(async () => { await client.invalidateQueries({ queryKey: ['task-detail', TASK.id] }); });
        await waitFor(() => expect(screen.getAllByText('Yapılacak').length).toBeGreaterThan(0));

        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1]).toMatchObject({ status: 1, priority: 4 });
    });

    it('kayıt sonrası sunucunun düzelttiği etiket yazımı formu kirli bırakmaz', async () => {
        await openLoaded();
        await addTag('konaklama');

        const saved = { ...TASK, tags: [{ id: 'g1', name: 'Konaklama' }] };
        svc.update.mockImplementation(() => Promise.resolve(saved));
        svc.get.mockImplementation(() => Promise.resolve(saved));

        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1].tagNames).toEqual(['konaklama']);
        await screen.findByText('Konaklama');
        await waitFor(() => expect(screen.queryByText(DIRTY)).not.toBeInTheDocument());
        expect(screen.queryByText('konaklama')).not.toBeInTheDocument();
    });

    it('kayıttan sonraki yeniden çekme başarısızsa form yerinde kalır; sonraki tazelemede kirli kalmaz', async () => {
        await openLoaded();
        await addTag('konaklama');

        const saved = { ...TASK, tags: [{ id: 'g1', name: 'Konaklama' }] };
        svc.update.mockImplementation(() => Promise.resolve(saved));
        svc.get.mockImplementation(() => Promise.reject(new Error('Ağ hatası')));

        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        // Yenileme hatası ilk yükleme hatası değil: form sökülmez, UpdateAsync'in döndürdüğü kayıt işlenir.
        await screen.findByText('Konaklama');
        expect(screen.queryByText('Görev detayları yüklenemedi.')).not.toBeInTheDocument();

        // Sonraki tazeleme (sekme odağı, yeniden bağlanma) başarılı.
        svc.get.mockImplementation(() => Promise.resolve(saved));
        await act(async () => { await client.invalidateQueries({ queryKey: ['task-detail', TASK.id] }); });

        await waitFor(() => expect(screen.queryByText(DIRTY)).not.toBeInTheDocument());
        expect(screen.getByText('Konaklama')).toBeInTheDocument();
    });

    /* Açık eylem kendi yazdığı alanı forma işler: kullanıcının kaydetmediği durum/proje
       seçimi rebase'de "dokunulmuş" sayılıp korunuyordu; Kaydet arşivi/taşımayı geri
       alıyordu. Diğer kaydedilmemiş düzenleme (öncelik) korunmalı. */
    it('kaydedilmemiş durum seçiminin üstüne Arşivle: Kaydet arşivi geri almaz', async () => {
        await openLoaded();
        fireEvent.click(screen.getByRole('button', { name: 'Orta' }));
        fireEvent.click(within(screen.getByText('Öncelik seç').parentElement).getByText('Kritik'));
        fireEvent.click(screen.getAllByRole('button', { name: 'Sürüyor' })[0]);
        fireEvent.click(within(screen.getByText('Durumu değiştir').parentElement).getByText('Testte'));
        await screen.findByText(DIRTY);
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, status: 4 }));

        clickMenuItem('Arşivle');

        await waitFor(() => expect(svc.updateStatus).toHaveBeenCalledWith(TASK.id, 4));
        await waitFor(() => expect(screen.getAllByText('Tamamlandı').length).toBeGreaterThan(0));
        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1]).toMatchObject({ status: 4, priority: 4 });
    });

    it('kaydedilmemiş proje seçiminin üstüne Taşı: Kaydet taşımayı geri almaz', async () => {
        svc.getProjectsLookup.mockImplementation(() => Promise.resolve([
            { id: 'p1', name: 'Alfa' }, { id: 'p2', name: 'Beta' }, { id: 'p3', name: 'Gama' },
        ]));
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, projectId: 'p1' }));
        svc.transfer = vi.fn(() => Promise.resolve({ createdTaskIds: [] }));
        await openLoaded();
        fireEvent.click(await screen.findByRole('button', { name: 'Alfa' }));
        fireEvent.click(screen.getByText('Beta'));
        fireEvent.click(screen.getByRole('button', { name: 'Orta' }));
        fireEvent.click(within(screen.getByText('Öncelik seç').parentElement).getByText('Kritik'));
        await screen.findByText(DIRTY);
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, projectId: 'p3' }));

        clickMenuItem('Taşı (başka proje)');
        const dialog = screen.getAllByRole('dialog', { name: 'Başka projeye taşı' }).at(-1);   // katman + iç diyalog
        fireEvent.click(within(dialog).getByText('Gama'));
        const ctas = within(dialog).getAllByRole('button', { name: 'Taşı' });
        fireEvent.click(ctas[ctas.length - 1]);

        await waitFor(() => expect(svc.transfer).toHaveBeenCalledWith(
            TASK.id, expect.objectContaining({ mode: 1, targetProjectIds: ['p3'] })));
        await screen.findByRole('button', { name: 'Gama' });
        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1]).toMatchObject({ projectId: 'p3', priority: 4 });
    });
});

/* Canlı doğrulama L1-10: oturum düşüp pencere "Kapat"la kapatıldıktan sonra sekmeye dönüşteki
   odak tazelemesi (GET 401) kirli formu "Görev detayları yüklenemedi"ye çeviriyordu — yazılan
   metin görünmüyor, kopyalanamıyordu. Tazeleme hatası ilk yükleme hatası değildir. */
describe('TaskDetailRootV3 — görev ekrandayken tazeleme düşerse form kalır (RES-01)', () => {
    it.each([
        ['oturum düştü (401, merkezi pencereye gitmiş)',
            () => Object.assign(new Error('Oturumunuz sona erdi.'), { status: 401, apyaShown: true, apyaCentral: true })],
        ['sunucu hatası (500)', () => Object.assign(new Error('Sunucu hatası'), { status: 500 })],
    ])('%s: kirli form ve Kaydet ekranda, hata gövdesi yok', async (_name, makeError) => {
        await openLoaded();
        await addTag('konaklama');

        svc.get.mockImplementation(() => Promise.reject(makeError()));
        await act(async () => {
            await client.invalidateQueries({ queryKey: ['task-detail', TASK.id] });
            /* TanStack gözlemci bildirimini bir sonraki görevde (setTimeout 0) dağıtır: beklenmezse
               bileşen hatayı henüz görmeden "hata gövdesi yok" denmiş olur (sahte geçiş). */
            for (let i = 0; i < 3; i++) await new Promise((r) => setTimeout(r, 0));
        });

        expect(client.getQueryState(['task-detail', TASK.id]).status).toBe('error');   // tazeleme gerçekten düştü
        expect(screen.queryByText('Görev detayları yüklenemedi.')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /tekrar dene/i })).toBeNull();
        expect(screen.getByText('konaklama')).toBeInTheDocument();
        expect(screen.getByText(DIRTY)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled();

        // Oturum geri gelince (ya da sunucu düzelince) aynı form kaydedilir.
        svc.get.mockImplementation(() => Promise.resolve(TASK));
        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));
        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1].tagNames).toEqual(['konaklama']);
    });
});

describe('TaskDetailRootV3 — yazma izi kapanıştan önce alınır (STA-19)', () => {
    it('Arşivle: istek sürerken yazma işaretlenmiş olur', async () => {
        const markSpy = vi.spyOn(taskDetailStore, 'markChanged');
        let release;
        svc.updateStatus.mockImplementation(() => new Promise((r) => { release = r; }));
        await openLoaded();
        expect(markSpy).not.toHaveBeenCalled();

        clickMenuItem('Arşivle');

        expect(svc.updateStatus).toHaveBeenCalled();
        expect(markSpy).toHaveBeenCalled();
        await act(async () => { release(); });
    });

    it('Sil: yazma, kapanıştan (closeNow → onClose) ÖNCE işaretlenir ve kapanış sonucu yayınlar', async () => {
        const markSpy = vi.spyOn(taskDetailStore, 'markChanged');
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
        const listener = vi.fn();
        taskDetailStore.onResult(listener);
        const onClose = vi.fn(() => taskDetailStore.emitResultIfChanged());   // task-detail.jsx V3 dalı gibi
        await openLoaded(onClose);

        clickMenuItem('Sil');

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
        expect(svc.delete).toHaveBeenCalledWith(TASK.id);
        expect(Math.min(...markSpy.mock.invocationCallOrder))
            .toBeLessThan(onClose.mock.invocationCallOrder[0]);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('kontrol listesine madde eklerken istek sürerken yazma işaretlenir (MutationCache)', async () => {
        const markSpy = vi.spyOn(taskDetailStore, 'markChanged');
        svc.addChecklistItem.mockImplementation(() => new Promise(() => {}));
        await openLoaded();
        expect(markSpy).not.toHaveBeenCalled();

        const input = screen.getByPlaceholderText("Yeni madde yaz ve Enter'a bas…");
        fireEvent.change(input, { target: { value: 'QA madde' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        await waitFor(() => expect(svc.addChecklistItem).toHaveBeenCalledWith(TASK.id, 'QA madde'));
        expect(markSpy).toHaveBeenCalled();
    });

    it('Kaydet sonucu BİR KEZ yayınlar; ardından kapanış yeniden yayınlamaz', async () => {
        const listener = vi.fn();
        taskDetailStore.onResult(listener);
        await openLoaded();
        await addTag('acil');
        const saved = { ...TASK, tags: [{ id: 'g3', name: 'acil' }] };
        svc.update.mockImplementation(() => Promise.resolve(saved));
        svc.get.mockImplementation(() => Promise.resolve(saved));

        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(listener).toHaveBeenCalledTimes(1));
        taskDetailStore.emitResultIfChanged();                                  // kapanış
        expect(listener).toHaveBeenCalledTimes(1);
    });

    /* Ortak oturum önbelleği modalın istemcisine de geri yüklenir; QueryProvider'ın
       veri-değişti damgası (lib/api/dataChanged.js) oradaki pano/takvim sorgularını
       bayat işaretler. Bu bir yazma değil: bakıp kapatmak kanbanı yeniden yüklememeli. */
    it('geri yüklemede damgayla bayat işaretlenen pano sorgusu yazma sayılmaz', async () => {
        const qk = ['dashboard', 'summary', {}];
        function Pano() {
            const { data } = useQuery({ queryKey: qk, queryFn: async () => 'pano verisi' });
            return <div>{data ?? 'yükleniyor'}</div>;
        }
        const pano = render(<QueryProvider><Pano /></QueryProvider>);
        await screen.findByText('pano verisi');
        await waitFor(() => expect(window.sessionStorage.getItem(CACHE_KEY)).toContain('summary'),
                      { timeout: 4000 });
        pano.unmount();
        window.sessionStorage.setItem('apya-data-changed-at', String(Date.now()));   // kanbanda taşıma

        const listener = vi.fn();
        taskDetailStore.onResult(listener);
        await openLoaded();
        await waitFor(() => expect(client.getQueryState(qk)?.isInvalidated).toBe(true));

        taskDetailStore.emitResultIfChanged();                                  // kapanış
        expect(listener).not.toHaveBeenCalled();
    });
});
