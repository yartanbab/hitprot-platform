import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render as rtlRender, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HistoryTabV3 } from './HistoryTabV3';

let getHistory;
beforeEach(() => {
    getHistory = vi.fn(() => Promise.resolve([]));
    window.apya = { platform: { tasks: { task: { getHistory } } } };
});
afterEach(() => { delete window.apya; });

const render = (ui) => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return rtlRender(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

const task = {
    id: 't-1',
    code: 'GRV-17',
    creationTime: '2026-08-01T09:30:00Z',
    creatorId: 'u-1',
    lastModificationTime: '2026-08-20T14:05:00Z',
    lastModifierId: 'u-2',
    startDate: '2026-08-02T00:00:00Z',
    dueDate: null,
};

const nameById = new Map([['u-1', 'Ayşe Yılmaz'], ['u-2', 'Mehmet Kaya']]);

describe('HistoryTabV3', () => {
    it('kayit bilgilerini ve kullanici adlarini cozer', () => {
        render(<HistoryTabV3 task={task} nameById={nameById} />);
        expect(screen.getByText('GRV-17')).toBeInTheDocument();
        expect(screen.getByText('Ayşe Yılmaz tarafından')).toBeInTheDocument();
        expect(screen.getByText('Mehmet Kaya tarafından')).toBeInTheDocument();
    });

    it('hic guncellenmemis gorevde durumu acikca soyler', () => {
        render(<HistoryTabV3 task={{ ...task, lastModificationTime: null, lastModifierId: null }} nameById={nameById} />);
        expect(screen.getByText('Henüz güncellenmedi')).toBeInTheDocument();
    });

    it('iptal edilmis gorevde iptal satirini ve gerekcesini gosterir', () => {
        render(
            <HistoryTabV3
                task={{ ...task, cancelledDate: '2026-08-25T10:00:00Z', cancelReason: 'Bütçe onaylanmadı' }}
                nameById={nameById}
            />,
        );
        expect(screen.getByText('İptal')).toBeInTheDocument();
        expect(screen.getByText('Bütçe onaylanmadı')).toBeInTheDocument();
    });

    /* QA-23 · Alan bazında değişiklik geçmişi denetim kaydından gelir (getHistory). */
    it('degisiklik gecmisini kim/ne zaman/eski → yeni olarak listeler', async () => {
        getHistory.mockResolvedValue([
            {
                changeTime: '2026-08-20T14:05:00Z', changedBy: 'Mehmet Kaya', kind: 'Güncellendi',
                changes: [{ field: 'Durum', oldValue: 'Yapılacak', newValue: 'Sürüyor' }],
            },
            { changeTime: '2026-08-01T09:30:00Z', changedBy: 'Ayşe Yılmaz', kind: 'Oluşturuldu', changes: [] },
        ]);
        render(<HistoryTabV3 task={task} nameById={nameById} />);

        expect(await screen.findByText('Durum:')).toBeInTheDocument();
        expect(screen.getByText('Yapılacak')).toBeInTheDocument();
        expect(screen.getByText('Sürüyor')).toBeInTheDocument();
        expect(screen.getByText(/Mehmet Kaya$/)).toBeInTheDocument();
        expect(screen.getByText(/Oluşturuldu$/)).toBeInTheDocument();
        expect(getHistory).toHaveBeenCalledWith('t-1');
        expect(screen.queryByText(/henüz yayınlanmadı/i)).not.toBeInTheDocument();
    });

    it('kayit yoksa bos durumu soyler', async () => {
        render(<HistoryTabV3 task={task} nameById={nameById} />);
        expect(await screen.findByText('Henüz kayıtlı değişiklik yok.')).toBeInTheDocument();
    });

    it('yukleme hatasinda sessiz kalmaz', async () => {
        getHistory.mockRejectedValue(new Error('500'));
        render(<HistoryTabV3 task={task} nameById={nameById} />);
        expect(await screen.findByText('Geçmiş yüklenemedi.')).toBeInTheDocument();
    });
});
