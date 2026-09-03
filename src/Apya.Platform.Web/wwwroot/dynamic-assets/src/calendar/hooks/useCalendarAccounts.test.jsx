import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConnectAccount, useDisconnectAccount, useForceSync } from './useCalendarAccounts';
import { api } from '../../lib/api/httpClient';

vi.mock('../../lib/api/httpClient', () => ({
    api: { get: vi.fn(), post: vi.fn() },
}));

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

/* jsdom gerçek gezinmeyi uygulamaz; href atamasını gözlemleyebilmek için değiştirilebilir kılıyoruz. */
let href;
beforeEach(() => {
    href = '';
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { get href() { return href; }, set href(v) { href = v; } },
    });
});

describe('useConnectAccount', () => {
    /* Regresyon: bağla düğmeleri '/Calendars/SimulateAuth?provider=N' adresini SABİT
       yazıyordu. Gerçek istemci tanımlansa bile kullanıcı simülasyona düşüyor, sahte
       token'lı hesap oluşuyor ve her okuma sessizce hataya düşüyordu. */
    it('yetkilendirme adresini SUNUCUDAN ister', async () => {
        api.get.mockResolvedValue('https://accounts.google.com/o/oauth2/v2/auth?client_id=x');

        const { result } = renderHook(() => useConnectAccount(), { wrapper });
        result.current.mutate(1);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/app/calendar/auth-url?provider=1'));
        await waitFor(() => expect(href).toBe('https://accounts.google.com/o/oauth2/v2/auth?client_id=x'));
    });

    it('Outlook için sağlayıcı numarasını geçirir', async () => {
        api.get.mockResolvedValue('/Calendars/SimulateAuth?provider=2');

        const { result } = renderHook(() => useConnectAccount(), { wrapper });
        result.current.mutate(2);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/app/calendar/auth-url?provider=2'));
        /* İstemci tanımsızken sunucu simülasyon yolunu döndürür — istemci ayrım YAPMAZ. */
        await waitFor(() => expect(href).toBe('/Calendars/SimulateAuth?provider=2'));
    });

    it('adres alınamazsa gezinme YAPILMAZ', async () => {
        api.get.mockRejectedValue(new Error('403'));

        const { result } = renderHook(() => useConnectAccount(), { wrapper });
        result.current.mutate(1);

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(href).toBe('');
    });
});

describe('hesap eylemleri', () => {
    /* ABP konvansiyonu: "id" eylem adından ÖNCE yol segmenti olur (emsal: form/{id}/publish). */
    it('bağlantıyı kaldır POST ile {id}/disconnect-account uçlarına gider', async () => {
        api.post.mockResolvedValue(null);

        const { result } = renderHook(() => useDisconnectAccount(), { wrapper });
        result.current.mutate('acc-1');

        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/app/calendar/acc-1/disconnect-account', {}));
    });

    it('şimdi senkronize et POST ile {id}/force-sync uçlarına gider', async () => {
        api.post.mockResolvedValue(null);

        const { result } = renderHook(() => useForceSync(), { wrapper });
        result.current.mutate('acc-2');

        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/app/calendar/acc-2/force-sync', {}));
    });
});
