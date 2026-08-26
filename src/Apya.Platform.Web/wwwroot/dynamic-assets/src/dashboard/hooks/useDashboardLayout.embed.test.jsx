import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Razor sayfaya varsayılan görünümün düzenini gömüyor (Pages/Dashboard/Index.cshtml).
 * Island bunu initialData olarak kullanmalı — böylece /api/dashboard/layout turu
 * hiç atılmaz ve kartlar (dolayısıyla 8 widget isteği) bir gidiş-dönüş erken başlar.
 */

const GOMULU = {
    viewKey: 'project-management',
    isDefault: true,
    cards: [{ key: 'stat-strip', x: 0, y: 0, w: 12, h: 3 }],
};

function gom(veri) {
    const node = document.createElement('script');
    node.type = 'application/json';
    node.id = 'apya-dashboard-layout';
    node.textContent = JSON.stringify(veri);
    document.body.appendChild(node);
}

/** Modül gömülü düğümü import anında okuyor → her senaryoda taze import şart. */
async function hookuYukle() {
    vi.resetModules();
    return (await import('./useDashboardLayout')).useDashboardLayout;
}

function Ekran({ useHook, viewKey }) {
    const q = useHook(viewKey);
    return <div data-testid="k">{q.data ? `kart:${q.data.cards.length}` : 'veri-yok'}</div>;
}

function sar(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('gömülü düzen', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('istek ATILMAMALIYDI'))));
    });
    afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

    it('eşleşen görünümde istek ATMADAN veriyi verir', async () => {
        gom(GOMULU);
        const useHook = await hookuYukle();

        sar(<Ekran useHook={useHook} viewKey="project-management" />);

        await waitFor(() => expect(screen.getByTestId('k').textContent).toBe('kart:1'));
        expect(fetch).not.toHaveBeenCalled();
    });

    it('BAŞKA görünümde gömülü kaydı KULLANMAZ', async () => {
        // Aktif görünüm kullanıcının localStorage'ında; sunucu bilemez. Gömülü kayıt
        // yanlış görünüme tohum olsaydı kullanıcı BAŞKASININ düzenini görürdü.
        gom(GOMULU);
        const useHook = await hookuYukle();

        sar(<Ekran useHook={useHook} viewKey="finance" />);

        expect(screen.getByTestId('k').textContent).toBe('veri-yok');
    });

    it('gömülü düğüm bozuksa patlamaz', async () => {
        /* Bu senaryoda hook DOĞRU davranıp normal isteğe düşer; stub'ı sessiz tut. */
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true, status: 200, json: () => Promise.resolve(GOMULU),
        })));
        const node = document.createElement('script');
        node.type = 'application/json';
        node.id = 'apya-dashboard-layout';
        node.textContent = '{bozuk json';
        document.body.appendChild(node);

        const useHook = await hookuYukle();
        expect(() => sar(<Ekran useHook={useHook} viewKey="project-management" />)).not.toThrow();
    });
});
