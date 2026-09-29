import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApprovalsCard } from './ApprovalsCard';
import { IncomeExpenseCard } from './IncomeExpenseCard';

/**
 * Genel Bakış finans kartları — "okunamadı" ≠ "yok" (SHL-15, ROL-06).
 *
 * Sunucu yetkisizlikte sorgu atmaz ve { locked: true } döner (DashboardAppService). Kart bunu
 * "karar bekleyen yok" / "kayıtlı hareket yok" diye çizemez ve yasak sayfaya (/Invoices → 403)
 * bağlantı vermez. Onay ucunun şekli dizi → { items, locked } değişti: kalıcı önbellekteki ESKİ
 * dizi (yayın öncesi yazılmış) çökmeden eskisi gibi çizilir.
 */

const FILTER = { range: 'Month' };

const LOCK_TITLE = 'Bu bilgiyi görme yetkiniz yok';

function stubBody(body) {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(JSON.stringify(body)),
    })));
}

function renderWithClient(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('ApprovalsCard · kilit', () => {
    it('locked → "görme yetkiniz yok" + izin adı; "Karar bekleyen yok" ve /Invoices bağlantısı YOK', async () => {
        stubBody({ items: [], locked: true });

        renderWithClient(<ApprovalsCard />);

        expect(await screen.findByText(LOCK_TITLE)).toBeInTheDocument();
        expect(screen.getByText('Taslak faturalar Platform.Invoices izni gerektirir.')).toBeInTheDocument();
        expect(screen.queryByText('Karar bekleyen yok')).not.toBeInTheDocument();
        expect(screen.queryByText('Faturaları aç →')).not.toBeInTheDocument();
        expect(document.querySelector('a[href="/Invoices"]')).toBeNull();
    });

    it('kilitsiz boş kuyruk → gerçek boş durum ve "Faturaları aç →" (regresyon)', async () => {
        stubBody({ items: [], locked: false });

        renderWithClient(<ApprovalsCard />);

        expect(await screen.findByText('Karar bekleyen yok')).toBeInTheDocument();
        expect(screen.getByText('Faturaları aç →')).toBeInTheDocument();
        expect(screen.queryByText(LOCK_TITLE)).not.toBeInTheDocument();
    });

    it('kilitsiz dolu kuyruk → satırlar çizilir', async () => {
        stubBody({ items: [{ id: 'i1', type: 0, title: 'QA-2', requesterName: 'Ayşe', amount: 10, currency: 'TRY', ageHours: 3, targetUrl: '/Invoices?invoiceId=i1' }], locked: false });

        renderWithClient(<ApprovalsCard />);

        expect(await screen.findByText('QA-2')).toBeInTheDocument();
    });

    it('eski önbellek şekli [] → boş durum, çökme yok', async () => {
        stubBody([]);

        renderWithClient(<ApprovalsCard />);

        expect(await screen.findByText('Karar bekleyen yok')).toBeInTheDocument();
    });

    it('eski önbellek şekli [{…}] → satır çizilir, çökme yok', async () => {
        stubBody([{ id: 'i1', type: 0, title: 'QA-1', requesterName: '', amount: 1, currency: 'TRY', ageHours: 1, targetUrl: '#' }]);

        renderWithClient(<ApprovalsCard />);

        expect(await screen.findByText('QA-1')).toBeInTheDocument();
    });
});

describe('IncomeExpenseCard · kilit', () => {
    it('locked → "görme yetkiniz yok" + iki izin adı; "Kayıtlı hareket yok" ve lejant YOK', async () => {
        stubBody({ points: [], currency: 'TRY', net: 0, locked: true });

        renderWithClient(<IncomeExpenseCard filter={FILTER} />);

        expect(await screen.findByText(LOCK_TITLE)).toBeInTheDocument();
        expect(screen.getByText('Bu kart Platform.Incomes ve Platform.Expenses izinlerinin ikisini de gerektirir.')).toBeInTheDocument();
        expect(screen.queryByText('Kayıtlı hareket yok')).not.toBeInTheDocument();
        expect(screen.queryByText('Gelir')).not.toBeInTheDocument();
        expect(screen.queryByText('Gider')).not.toBeInTheDocument();
    });

    it('kilitsiz, altı sıfır ay → "Kayıtlı hareket yok" ve lejant (regresyon)', async () => {
        const points = Array.from({ length: 6 }, (_, i) => ({ month: `2026-0${i + 4}-01T00:00:00Z`, income: 0, expense: 0 }));
        stubBody({ points, currency: 'TRY', net: 0, locked: false });

        renderWithClient(<IncomeExpenseCard filter={FILTER} />);

        expect(await screen.findByText('Kayıtlı hareket yok')).toBeInTheDocument();
        expect(screen.getByText('Gelir')).toBeInTheDocument();
        expect(screen.queryByText(LOCK_TITLE)).not.toBeInTheDocument();
    });
});
