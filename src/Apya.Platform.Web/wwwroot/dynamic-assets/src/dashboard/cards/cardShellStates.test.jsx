import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { ApprovalsCard } from './ApprovalsCard';
import { CardShell } from './CardShell';
import { DeliveriesCard } from './DeliveriesCard';
import { ProjectHealthCard } from './ProjectHealthCard';

/**
 * Genel Bakış kartları — hata ve yükleme durumları (SHL-13).
 *
 *  1) Hiç başarılı yükleme yokken (dataUpdatedAt = 0) "Son başarılı güncelleme:
 *     20.724 gün önce" yazılmaz; gerçek bir zaman varsa satır görünür.
 *  2) Yüklenirken (geri yükleme penceresi dahil) ve hatada türetilmiş alt başlık
 *     ("0 iş · 0 gecikmiş", "0 aktif proje") basılmaz; başarılı boş sonuçta basılır.
 *  3) Hata durumunun "Tekrar dene"si kanonik düğmedir (karar 10): metin bağlantısı değil,
 *     kartın başlığıyla betimlenir, yeniden deneme sürerken meşgul.
 *  4) Tazeleme düşüp gövde hata gösterirken eldeki (bayat) veriden türeyen altbilgi çizilmez.
 */

const FILTER = { range: 'month' };

const jsonResponse = (status, body) => ({
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

beforeEach(() => {
    window.sessionStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
    delete window.abp;
    window.sessionStorage.clear();
});

describe('CardShell · son başarılı güncelleme', () => {
    it('dataUpdatedAt=0 (hiç veri gelmedi) → satır YOK', () => {
        render(<CardShell title="Kart" isError onRetry={() => {}} dataUpdatedAt={0} />);

        expect(screen.getByText('Veri alınırken bir hata oluştu.')).toBeInTheDocument();
        expect(screen.queryByText(/Son başarılı güncelleme/)).not.toBeInTheDocument();
    });

    it('gerçek zaman damgası → satır görünür', () => {
        render(<CardShell title="Kart" isError onRetry={() => {}} dataUpdatedAt={Date.now() - 120_000} />);

        expect(screen.getByText(/Son başarılı güncelleme/)).toBeInTheDocument();
    });
});

describe('CardShell · hata durumunun "Tekrar dene"si (karar 10)', () => {
    it('kanonik düğme (Razor\'la aynı sınıflar + ikon), kartın başlığıyla betimlenir; onRetry ARGÜMANSIZ', () => {
        const onRetry = vi.fn();
        render(<CardShell title="Proje sağlığı" isError onRetry={onRetry} dataUpdatedAt={0} />);

        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(retry).toHaveClass('btn', 'btn-sm', 'btn-outline-primary');
        // Eski hâli çerçevesiz, ikonsuz metin bağlantısıydı.
        expect(retry).not.toHaveClass('text-text-link');
        expect(retry.querySelector('i.fa.fa-rotate-right')).toHaveAttribute('aria-hidden', 'true');
        // Aynı anda birkaç kart düşebilir: her düğme kendi kartının başlığıyla okunur.
        expect(retry).toHaveAccessibleDescription('Proje sağlığı');

        fireEvent.click(retry);
        // react-query refetch'ine MouseEvent sızmaz.
        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onRetry).toHaveBeenCalledWith();
    });

    it('yeniden deneme sürerken (isFetching) aynı düğme meşgul: tıklama yutulur, odak düğmede kalır', () => {
        const onRetry = vi.fn();
        const { rerender } = render(<CardShell title="Kart" isError onRetry={onRetry} />);
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        retry.focus();
        expect(retry).not.toHaveAttribute('aria-busy');

        rerender(<CardShell title="Kart" isError isFetching onRetry={onRetry} />);

        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBe(retry);
        expect(document.activeElement).toBe(retry);
        expect(retry).toHaveAttribute('aria-busy', 'true');
        expect(retry).toHaveAttribute('aria-disabled', 'true');
        fireEvent.click(retry);
        expect(onRetry).not.toHaveBeenCalled();
    });

    it('hata yokken başlığa kimlik basılmaz (diğer durumların çıktısı aynı kalır)', () => {
        render(<CardShell title="Kart"><p>içerik</p></CardShell>);

        expect(screen.getByRole('heading', { name: 'Kart' })).not.toHaveAttribute('id');
    });
});

describe('CardShell · altbilgi', () => {
    it('hata durumunda çizilmez; hata yokken çizilir', () => {
        const footer = <span>+1 proje →</span>;
        const { rerender } = render(<CardShell title="Kart" footer={footer}><p>içerik</p></CardShell>);
        expect(screen.getByText('+1 proje →')).toBeInTheDocument();

        rerender(<CardShell title="Kart" footer={footer} isError onRetry={() => {}}><p>içerik</p></CardShell>);

        expect(screen.getByText('Veri alınırken bir hata oluştu.')).toBeInTheDocument();
        expect(screen.queryByText('+1 proje →')).not.toBeInTheDocument();
    });

    it('ProjectHealthCard / ApprovalsCard: tazeleme düşünce bayat altbilgi kalkar, Tekrar dene başarısında geri gelir', async () => {
        const projects = Array.from({ length: 6 }, (_, i) => ({
            projectId: `p${i}`, name: `Proje ${i}`, state: 0, timeRatio: 0.5, budgetRatio: null,
            daysRemaining: 10, tasksDone: 1, tasksTotal: 2,
        }));
        const approvals = {
            locked: false,
            items: [{ id: 'i1', type: 0, title: 'QA-UX fatura', requesterName: 'Ayşe', amount: 10, currency: 'TRY', ageHours: 3, targetUrl: '/Invoices?invoiceId=i1' }],
        };
        let failing = false;
        vi.stubGlobal('fetch', vi.fn((url) => Promise.resolve(failing
            ? jsonResponse(500, { error: { message: 'Sunucu hatası' } })
            : jsonResponse(200, String(url).includes('project-health') ? projects : approvals))));
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={client}>
                <ProjectHealthCard filter={FILTER} />
                <ApprovalsCard />
            </QueryClientProvider>,
        );

        expect(await screen.findByText('+2 proje →')).toBeInTheDocument();
        expect(screen.getByText('Proje 4 · Proje 5')).toBeInTheDocument();
        expect(await screen.findByText('Onay kuyruğu →')).toBeInTheDocument();

        // Tazeleme düşer: veri önbellekte durur (bayat), gövde hata gösterir.
        failing = true;
        await act(async () => { await client.refetchQueries(); });

        await waitFor(() => expect(screen.getAllByText('Veri alınırken bir hata oluştu.')).toHaveLength(2));
        expect(screen.getAllByText(/Son başarılı güncelleme/)).toHaveLength(2);
        expect(screen.queryByText('+2 proje →')).not.toBeInTheDocument();
        expect(screen.queryByText('Proje 4 · Proje 5')).not.toBeInTheDocument();
        expect(screen.queryByText('Onay kuyruğu →')).not.toBeInTheDocument();

        failing = false;
        const [healthRetry] = screen.getAllByRole('button', { name: 'Tekrar dene' });
        expect(healthRetry).toHaveAccessibleDescription('Proje sağlığı');
        fireEvent.click(healthRetry);

        expect(await screen.findByText('+2 proje →')).toBeInTheDocument();
        expect(screen.getAllByText('Veri alınırken bir hata oluştu.')).toHaveLength(1);
        expect(screen.queryByText('Onay kuyruğu →')).not.toBeInTheDocument();
    });
});

describe('DeliveriesCard / ProjectHealthCard · alt başlık', () => {
    it('500 → hata gövdesi; "0 iş · 0 gecikmiş" / "0 aktif proje" ve 1970 satırı YOK', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(jsonResponse(500, { error: { message: 'Sunucu hatası' } }))));

        renderWithClient(<><DeliveriesCard filter={FILTER} /><ProjectHealthCard filter={FILTER} /></>);

        await waitFor(() => expect(screen.getAllByText('Veri alınırken bir hata oluştu.')).toHaveLength(2));
        expect(screen.queryByText('0 iş · 0 gecikmiş')).not.toBeInTheDocument();
        expect(screen.queryByText('0 aktif proje')).not.toBeInTheDocument();
        expect(screen.queryByText(/Son başarılı güncelleme/)).not.toBeInTheDocument();
    });

    it('yüklenirken alt başlık YOK', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

        renderWithClient(<><DeliveriesCard filter={FILTER} /><ProjectHealthCard filter={FILTER} /></>);

        expect(screen.queryByText('0 iş · 0 gecikmiş')).not.toBeInTheDocument();
        expect(screen.queryByText('0 aktif proje')).not.toBeInTheDocument();
    });

    it('başarılı boş sonuç → alt başlık ve gerçek boş durum görünür', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(jsonResponse(200, []))));

        renderWithClient(<><DeliveriesCard filter={FILTER} /><ProjectHealthCard filter={FILTER} /></>);

        expect(await screen.findByText('0 iş · 0 gecikmiş')).toBeInTheDocument();
        expect(screen.getByText('Bu dönem teslim yok')).toBeInTheDocument();
        expect(await screen.findByText('0 aktif proje')).toBeInTheDocument();
    });

    it('kalıcı önbellek geri yüklenirken "0 iş" / "0 aktif proje" YOK', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
        window.abp = { currentUser: { id: 'u1', tenantId: 't1' } };

        const { unmount } = render(
            <QueryProvider><DeliveriesCard filter={FILTER} /><ProjectHealthCard filter={FILTER} /></QueryProvider>,
        );

        expect(screen.queryByText('0 iş · 0 gecikmiş')).not.toBeInTheDocument();
        expect(screen.queryByText('0 aktif proje')).not.toBeInTheDocument();
        unmount();
    });
});
