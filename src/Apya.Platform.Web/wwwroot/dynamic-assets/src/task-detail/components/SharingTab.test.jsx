import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { SharingTab } from './SharingTab';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const ACTIVE_LINK = {
    id: 'link-1',
    recipientName: 'Ahmet Yılmaz',
    recipientEmail: 'ahmet@ornek.com',
    expiresAt: '2026-09-10T00:00:00Z',
    isActive: true,
    accessCount: 3,
    uploadCount: 1,
    revokedAt: null,
};

function setPermission(granted) {
    window.abp = { auth: { isGranted: vi.fn((p) => granted && p === 'Platform.Tasks.ShareExternally') } };
}

beforeEach(() => {
    setPermission(true);
    window.apya = {
        platform: {
            tasks: {
                taskShare: {
                    getList: vi.fn(() => Promise.resolve([ACTIVE_LINK])),
                    create: vi.fn(() => Promise.resolve({
                        ...ACTIVE_LINK, id: 'link-2', url: '/Paylasim/gizli-token',
                    })),
                    revoke: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('SharingTab', () => {
    it('mevcut paylasim linklerini listeler', async () => {
        renderWithClient(<SharingTab taskId="t-1" />);
        expect(await screen.findByText(/Ahmet Yılmaz/)).toBeInTheDocument();
        expect(screen.getByText(/3 erişim/)).toBeInTheDocument();
    });

    /**
     * Yetki köprüsü: izin yoksa sekme içerik BASMAZ. Sunucu tarafı zaten reddeder,
     * ama boş form göstermek "üretebilirim" izlenimi verirdi.
     */
    it('yetki yoksa form gosterilmez', async () => {
        setPermission(false);
        renderWithClient(<SharingTab taskId="t-1" />);
        expect(await screen.findByText(/paylaşma yetkiniz yok/i)).toBeInTheDocument();
        expect(screen.queryByText('Bağlantı üret')).not.toBeInTheDocument();
    });

    it('form gonderilince create cagrilir ve gorev id eklenir', async () => {
        renderWithClient(<SharingTab taskId="t-1" />);
        await screen.findByText(/Ahmet Yılmaz/);

        fireEvent.change(screen.getByPlaceholderText(/Kime\?/), { target: { value: 'Mehmet Demir' } });
        fireEvent.click(screen.getByText('Bağlantı üret'));

        await waitFor(() => expect(window.apya.platform.tasks.taskShare.create).toHaveBeenCalled());
        const arg = window.apya.platform.tasks.taskShare.create.mock.calls[0][0];
        expect(arg.recipientName).toBe('Mehmet Demir');
        expect(arg.taskId).toBe('t-1');
    });

    /**
     * 🔴 Token sunucuda SAKLANMAZ — yalnız create yanıtında döner. Kutu kaybolursa
     * link kalıcı olarak gider; bu yüzden üretilen bağlantı ekranda kalmalı.
     */
    it('uretilen baglanti kopyalanmak uzere ekranda kalir', async () => {
        renderWithClient(<SharingTab taskId="t-1" />);
        await screen.findByText(/Ahmet Yılmaz/);

        fireEvent.change(screen.getByPlaceholderText(/Kime\?/), { target: { value: 'Mehmet Demir' } });
        fireEvent.click(screen.getByText('Bağlantı üret'));

        expect(await screen.findByText(/Paylasim\/gizli-token/)).toBeInTheDocument();
        expect(screen.getByText('Kopyala')).toBeInTheDocument();
    });

    it('iptal butonu revoke cagirir', async () => {
        renderWithClient(<SharingTab taskId="t-1" />);
        await screen.findByText(/Ahmet Yılmaz/);

        fireEvent.click(screen.getByText('İptal et'));

        await waitFor(() => expect(window.apya.platform.tasks.taskShare.revoke).toHaveBeenCalledWith('link-1'));
    });

    it('iptal edilmis linkte iptal butonu cikmaz', async () => {
        window.apya.platform.tasks.taskShare.getList = vi.fn(() => Promise.resolve([
            { ...ACTIVE_LINK, isActive: false, revokedAt: '2026-08-27T00:00:00Z' },
        ]));
        renderWithClient(<SharingTab taskId="t-1" />);
        await screen.findByText(/Ahmet Yılmaz/);

        expect(screen.getByText(/İptal edildi/)).toBeInTheDocument();
        expect(screen.queryByText('İptal et')).not.toBeInTheDocument();
    });

    it('hic paylasim yoksa bos durum mesaji gosterir', async () => {
        window.apya.platform.tasks.taskShare.getList = vi.fn(() => Promise.resolve([]));
        renderWithClient(<SharingTab taskId="t-1" />);
        expect(await screen.findByText(/henüz kimseyle paylaşılmadı/i)).toBeInTheDocument();
    });

    /**
     * Kalıcı önbellek geri yükleme penceresi: GERÇEK QueryProvider kullanılır.
     * O pencerede sorgu `fetchStatus:'idle'` döndüğü için `isLoading` FALSE olur
     * ama liste henüz yoktur — sekme, paylaşımı OLAN görevde bile bir kare
     * "henüz kimseyle paylaşılmadı" yazıyordu. Kapı `isPending` olmalı.
     */
    it('geri yukleme penceresinde bos durum DEGIL yukleniyor gosterir', () => {
        window.abp = {
            ...window.abp,
            currentUser: { id: 'u1', tenantId: 't1' },
        };
        render(
            <QueryProvider>
                <SharingTab taskId="t-1" />
            </QueryProvider>,
        );

        expect(screen.getByText('Yükleniyor…')).toBeInTheDocument();
        expect(screen.queryByText(/henüz kimseyle paylaşılmadı/i)).not.toBeInTheDocument();
    });
});
