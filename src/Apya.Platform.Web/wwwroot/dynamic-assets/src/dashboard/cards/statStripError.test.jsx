import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatStripCard } from './StatStripCard';

/**
 * Özet şeridi — yükleme hatası satırı.
 *
 * Şerit CardShell kullanmaz; kendi hata satırının "Tekrar dene"si çerçevesiz, ikonsuz metin
 * bağlantısıydı (kartlardaki aynı kusur CardShell'de kapandı). Kanonik düğme (Faz 4 karar 10)
 * RetryButton'dır: kendi mesajıyla betimlenir (aynı anda birkaç kart düşebilir), yeniden deneme
 * sürerken satır iskelete dönmez ve düğme meşguldür; başarıda kutucuklar çizilir.
 */

const FILTER = { range: 'Month' };

/* Bütçe alanları null: halka grafik (Gauge) çizilmesin — burada ölçülen hata satırı. */
const OZET = {
    dueThisPeriod: 12, dueThisWeek: 4, overdue: 3, oldestOverdueDays: 9, overdueProjectCount: 2,
    blocked: 5, blockedAvgIdleDays: 6.4,
    pendingApprovals: 2, pendingApprovalAmount: 100, pendingApprovalAvgAgeHours: 5,
    budgetUsedRatio: null, budgetSpent: null, budgetTotal: null,
    dueTrend: [], currency: 'TRY',
};

const response = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
});

function renderWithClient(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('StatStripCard · yükleme hatası', () => {
    it('"Tekrar dene" kanonik düğmedir: ikonlu, kendi mesajıyla betimlenir; metin bağlantısı değil', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response(500, {}))));

        renderWithClient(<StatStripCard filter={FILTER} />);

        expect(await screen.findByText('Özet yüklenemedi.')).toBeInTheDocument();
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        // Eski hâli çerçevesiz, ikonsuz metin bağlantısıydı.
        expect(retry).not.toHaveClass('text-text-link');
        expect(retry.querySelector('i.fa.fa-rotate-right')).toHaveAttribute('aria-hidden', 'true');
        expect(retry).toHaveAccessibleDescription('Özet yüklenemedi.');
    });

    it('ilk yükleme düşünce "Tekrar dene" isteği yeniden atar; başarıda kutucuklar çizilir', async () => {
        const fetchMock = vi.fn()
            .mockImplementationOnce(() => Promise.resolve(response(500, {})))
            .mockImplementation(() => Promise.resolve(response(200, OZET)));
        vi.stubGlobal('fetch', fetchMock);

        renderWithClient(<StatStripCard filter={FILTER} />);

        fireEvent.click(await screen.findByRole('button', { name: 'Tekrar dene' }));

        expect(await screen.findByText('Bu dönem teslim')).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(screen.queryByText('Özet yüklenemedi.')).not.toBeInTheDocument();
    });

    it('veri ekrandayken tazeleme düşerse: yeniden deneme sürerken satır yerinde, düğme meşgul', async () => {
        let resolveThird;
        const fetchMock = vi.fn()
            .mockImplementationOnce(() => Promise.resolve(response(200, OZET)))
            .mockImplementationOnce(() => Promise.resolve(response(500, {})))
            .mockImplementationOnce(() => new Promise((resolve) => { resolveThird = resolve; }));
        vi.stubGlobal('fetch', fetchMock);
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

        render(<QueryClientProvider client={client}><StatStripCard filter={FILTER} /></QueryClientProvider>);
        expect(await screen.findByText('Bu dönem teslim')).toBeInTheDocument();

        /* Arka plan tazelemesi düşer (odak/SignalR invalidasyonu): sorgu "hata + eldeki veri" durumunda. */
        await client.refetchQueries();
        const retry = await screen.findByRole('button', { name: 'Tekrar dene' });

        fireEvent.click(retry);

        /* TanStack veri varken durumu 'pending'e çekmez: satır iskelete dönmez, düğme meşgul (odak düşmez). */
        await waitFor(() => expect(screen.getByRole('button', { name: 'Tekrar dene' })).toHaveAttribute('aria-busy', 'true'));
        expect(screen.getByText('Özet yüklenemedi.')).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(3);

        resolveThird(response(200, OZET));

        await waitFor(() => expect(screen.queryByText('Özet yüklenemedi.')).not.toBeInTheDocument());
        expect(screen.getByText('Bu dönem teslim')).toBeInTheDocument();
    });
});
