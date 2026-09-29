import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryProvider } from '../../lib/api/QueryProvider';
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
