import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoryTabV3 } from './HistoryTabV3';

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

    it('olmayan alan bazli gunluk icin uydurma icerik basmaz', () => {
        render(<HistoryTabV3 task={task} nameById={nameById} />);
        expect(screen.getByText(/değişiklik günlüğü .* henüz yayınlanmadı/i)).toBeInTheDocument();
    });
});
