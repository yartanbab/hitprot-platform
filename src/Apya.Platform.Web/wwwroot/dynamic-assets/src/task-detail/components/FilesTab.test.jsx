import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilesTab } from './FilesTab';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getAttachments: vi.fn(() => Promise.resolve([
                        { id: 'att-1', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/x', uploaderName: 'ali' },
                    ])),
                    deleteAttachment: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('FilesTab', () => {
    it('dosya listesini gosterir', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText('rapor.pdf')).toBeInTheDocument();
        expect(screen.getByText(/2 KB/)).toBeInTheDocument();
    });

    it('sil butonuna basinca deleteAttachment cagirir', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('rapor.pdf');
        fireEvent.click(screen.getByRole('button', { name: /rapor\.pdf dosyasini sil/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteAttachment).toHaveBeenCalledWith('att-1'));
    });

    it('hic dosya yoksa bos durum mesaji gosterir', async () => {
        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([]));
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText(/henüz dosya yüklenmemiş/i)).toBeInTheDocument();
    });
});

/* Canlı doğrulama L1-19: yükleme reddinde sunucunun metni toast'a kaçışsız basılıyordu (ABP toast'ı
   innerHTML kullanır → HTML yorumlanıyordu). Bildirim ortak kanaldan (lib/api/abpErrors) gider. */
describe('FilesTab — hata bildirimi ortak kanaldan (STA-10)', () => {
    // abp.js ile aynı
    const htmlEscape = (html) => html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    beforeEach(() => {
        window.abp = { utils: { htmlEscape }, notify: { error: vi.fn(), success: vi.fn() } };
    });

    afterEach(() => {
        delete window.abp;
        vi.unstubAllGlobals();
    });

    it('yükleme reddi: sunucunun metni kaçışlanır, HTML olarak yorumlanmaz', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ success: false, error: 'QA-UX <b>kalın</b> dosya reddedildi' }),
        })));
        const { container } = renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('rapor.pdf');

        fireEvent.change(container.querySelector('input[type="file"]'), {
            target: { files: [new File(['x'], 'yeni.pdf', { type: 'application/pdf' })] },
        });

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalled());
        expect(window.abp.notify.error.mock.calls).toEqual([['QA-UX &lt;b&gt;kalın&lt;/b&gt; dosya reddedildi']]);
        expect(window.abp.notify.success).not.toHaveBeenCalled();
    });

    it('silme reddini ABP penceresi zaten gösterdiyse ikinci bildirim basılmaz', async () => {
        const deleteAttachment = vi.fn(() => Promise.reject({ message: 'Bu dosyayı silemezsiniz.', apyaShown: true }));
        window.apya.platform.tasks.task.deleteAttachment = deleteAttachment;
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('rapor.pdf');

        fireEvent.click(screen.getByRole('button', { name: /rapor\.pdf dosyasini sil/i }));

        await waitFor(() => expect(deleteAttachment).toHaveBeenCalledWith('att-1'));
        await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
        expect(window.abp.notify.error).not.toHaveBeenCalled();
    });

    it('gösterilmemiş hata tek bildirimle gider (yedek metin)', async () => {
        window.apya.platform.tasks.task.deleteAttachment = vi.fn(() => Promise.reject({}));
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('rapor.pdf');

        fireEvent.click(screen.getByRole('button', { name: /rapor\.pdf dosyasini sil/i }));

        await waitFor(() => expect(window.abp.notify.error.mock.calls).toEqual([['rapor.pdf silinemedi.']]));
    });
});

/* QA 10-22: salt görüntüleyen (görevi değiştiremeyen) kullanıcı başkasının dosyasını silemez — sunucu
   TaskUpdateDenied döndürür. Kendi yüklediğini (düzenleme izniyle) kaldırabilir. */
describe('FilesTab — salt görüntüleme', () => {
    beforeEach(() => {
        window.abp = { currentUser: { id: 'me' }, auth: { isGranted: (p) => p === 'Platform.Tasks.Edit' } };
        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([
            { id: 'att-1', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/x', uploaderName: 'ali', creatorId: 'other' },
            { id: 'att-2', fileName: 'benim.pdf', fileSize: 1024, downloadUrl: '/file/get/y', uploaderName: 'ben', creatorId: 'me' },
        ]));
    });

    afterEach(() => { delete window.abp; });

    it('başkasının dosyasında sil düğmesi yok, kendi dosyasında var', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} readOnly />);
        await screen.findByText('rapor.pdf');
        expect(screen.queryByRole('button', { name: /rapor\.pdf dosyasini sil/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /benim\.pdf dosyasini sil/i })).toBeInTheDocument();
    });
});
