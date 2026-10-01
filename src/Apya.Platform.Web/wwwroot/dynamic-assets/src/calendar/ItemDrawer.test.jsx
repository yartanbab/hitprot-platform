import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemDrawer } from './ItemDrawer';

/**
 * Çekmece eylemleri sunucunun yetki kararını yansıtır (2026-09-28 UX denetimi, CAL-01):
 * 'Tamamla' yalnız canComplete, '+1 gün ertele' ve tarih alanı yalnız canReschedule
 * ile çizilir. Eskiden görevlerde canReschedule sabit true'ydu ve tek bayrak iki eylemi
 * birden açıyordu — salt-okur stajyer her görevi tamamlayabiliyordu.
 */

const BASE = {
    key: '1:t1', source: 1, sourceId: 't1', title: 'Teklif hazırla', subtitle: 'Proje A',
    date: '2026-03-10T00:00:00', isDone: false, risk: null, amount: null,
    assigneeName: 'pm1', href: '/Tasks',
};

function renderDrawer(item, props = {}) {
    render(
        <ItemDrawer
            item={{ ...BASE, ...item }}
            capacity={null}
            onClose={vi.fn()}
            onReschedule={vi.fn()}
            onComplete={vi.fn()}
            isPending={false}
            error={null}
            onRetry={vi.fn()}
            {...props}
        />,
    );
}

describe('ItemDrawer yetki bayrakları', () => {
    it('iki izin de varsa Tamamla ve Ertele görünür', () => {
        renderDrawer({ canComplete: true, canReschedule: true });
        expect(screen.getByRole('button', { name: /Tamamla/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\+1 gün ertele/ })).toBeInTheDocument();
    });

    it('yalnız erteleme izni varsa Tamamla çizilmez', () => {
        renderDrawer({ canComplete: false, canReschedule: true });
        expect(screen.queryByRole('button', { name: /Tamamla/ })).toBeNull();
        expect(screen.getByRole('button', { name: /\+1 gün ertele/ })).toBeInTheDocument();
    });

    it('hiçbir izin yoksa eylem yok, tarih salt-okunur', () => {
        renderDrawer({ canComplete: false, canReschedule: false });
        expect(screen.queryByRole('button', { name: /Tamamla/ })).toBeNull();
        expect(screen.queryByRole('button', { name: /ertele/ })).toBeNull();
        expect(screen.queryByLabelText('Son tarih')).toBeNull();
        expect(screen.getByText(/takvimden değiştirilemez/)).toBeInTheDocument();
    });
});

/* Kaydedilemeyen işlem şeridi: düğme kanonik "Tekrar dene" (Common:Retry, Faz 4 karar 10) —
   "Yeniden dene" altı çizili bağlantısı uygulamanın geri kalanından ayrışıyordu. */
describe('ItemDrawer hata şeridi', () => {
    it('kanonik "Tekrar dene" düğmesi çizilir ve onRetry\'ı argümansız çağırır', () => {
        const onRetry = vi.fn();
        renderDrawer({ canReschedule: true }, { error: 'Kaydedilemedi — tarih değişmedi.', onRetry });

        expect(screen.getByText('Kaydedilemedi — tarih değişmedi.')).toBeInTheDocument();
        expect(screen.queryByText('Yeniden dene')).toBeNull();
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(retry.querySelector('i.fa-rotate-right')).not.toBeNull();

        fireEvent.click(retry);

        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onRetry).toHaveBeenCalledWith();
    });

    it('hata yokken düğme yok', () => {
        renderDrawer({ canReschedule: true });
        expect(screen.queryByRole('button', { name: 'Tekrar dene' })).toBeNull();
    });
});
