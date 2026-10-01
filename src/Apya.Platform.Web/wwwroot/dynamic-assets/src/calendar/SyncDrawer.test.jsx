import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SyncDrawer } from './SyncDrawer';
import { api } from '../lib/api/httpClient';

/**
 * iCal "Dışarıdan takvim ekle" alanı (2026-09-28 UX denetimi, CAL-15).
 *
 * Eskiden "Takvimi ekle" yalnız alan BOŞKEN pasifti: kullanıcı "bu-bir-url-degil"
 * yazıp ekleyebiliyor, hatayı ancak sunucudan (üstelik webhook diliyle) öğreniyordu.
 * Artık http(s) ile başlamayan adres kaydedilemez ve alanın altında ipucu çıkar.
 * "Bağlantıyı dene" etkin kalır: asıl hüküm sunucudadır (yerel ağ adresi istemci
 * denetimini geçer, sunucu reddeder) ve gerekçeyi sunucunun cümlesi söyler.
 */

vi.mock('../lib/api/httpClient', () => ({
    api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const HINT = 'Adres http:// ya da https:// ile başlamalı.';
const SERVER_SENTENCE = 'Geçerli bir takvim adresi girin. Adres http:// ya da https:// ile başlamalı '
    + 've internetten erişilebilir olmalıdır; yerel ağ adresleri kabul edilmez.';

let probeResult;

beforeEach(() => {
    probeResult = { isValid: true, eventCount: 3, suggestedName: 'Tatiller' };

    api.get.mockImplementation((path) => Promise.resolve(
        path === '/api/app/calendar/sync-settings' ? { accounts: [], log: [] } : [],
    ));
    api.post.mockImplementation((path) => {
        if (path === '/api/app/ical-feed/ensure') return Promise.resolve({ path: '/ical/abc.ics' });
        if (path.startsWith('/api/app/ical-subscription/probe')) return Promise.resolve(probeResult);
        return Promise.resolve({});
    });
});

async function renderDrawer() {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    render(
        <QueryClientProvider client={qc}>
            <SyncDrawer open onClose={vi.fn()} />
        </QueryClientProvider>,
    );
    return screen.findByLabelText('Takvim bağlantısı');
}

const addButton = () => screen.getByRole('button', { name: 'Takvimi ekle' });
const probeButton = () => screen.getByRole('button', { name: 'Bağlantıyı dene' });
const type = (input, value) => fireEvent.change(input, { target: { value } });

describe('SyncDrawer › dışarıdan takvim ekle', () => {
    it('boş alanda iki düğme de pasif, ipucu yok', async () => {
        await renderDrawer();

        expect(addButton()).toBeDisabled();
        expect(probeButton()).toBeDisabled();
        expect(screen.queryByText(HINT)).toBeNull();
    });

    it('http(s) ile başlamayan adreste "Takvimi ekle" pasif, ipucu görünür; "Bağlantıyı dene" etkin', async () => {
        const input = await renderDrawer();

        type(input, 'bu-bir-url-degil');

        expect(addButton()).toBeDisabled();
        expect(probeButton()).toBeEnabled();
        const hint = screen.getByText(HINT);
        expect(hint).toHaveAttribute('id', 'ical-url-hint');
        expect(input).toHaveAttribute('aria-describedby', 'ical-url-hint');
    });

    it.each(['ftp://ornek.com/a.ics', 'webcal://ornek.com/a.ics', 'ornek.com/a.ics'])(
        '%s kaydedilemez',
        async (value) => {
            const input = await renderDrawer();

            type(input, value);

            expect(addButton()).toBeDisabled();
            fireEvent.click(addButton());
            expect(api.post).not.toHaveBeenCalledWith('/api/app/ical-subscription', expect.anything());
        },
    );

    it('geçerli adreste "Takvimi ekle" etkin, ipucu yok ve KIRPILMIŞ adres gönderilir', async () => {
        const input = await renderDrawer();

        /* type=url alanı baştaki/sondaki boşluğu kendisi atar (tarayıcı da jsdom da);
           bileşendeki kırpma ikinci emniyettir. Sunucuya giden adres boşluksuz olmalı. */
        type(input, '  HTTPS://ornek.com/a.ics ');

        expect(screen.queryByText(HINT)).toBeNull();
        expect(input).not.toHaveAttribute('aria-describedby');
        expect(addButton()).toBeEnabled();

        fireEvent.click(addButton());

        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/app/ical-subscription', {
            url: 'HTTPS://ornek.com/a.ics',
            displayName: '',
            color: 'accent',
            refreshMinutes: 60,
        }));
    });

    it('yerel ağ adresi istemci denetimini geçer: hüküm sunucuda', async () => {
        const input = await renderDrawer();

        type(input, 'http://127.0.0.1/a.ics');

        expect(addButton()).toBeEnabled();
        expect(screen.queryByText(HINT)).toBeNull();
    });

    it('"Bağlantıyı dene" kırpılmış adresi yollar; hata sunucunun cümlesiyle düz metin basılır', async () => {
        probeResult = { isValid: false, eventCount: 0, error: SERVER_SENTENCE };
        const input = await renderDrawer();

        type(input, ' bu-bir-url-degil ');
        fireEvent.click(probeButton());

        expect(await screen.findByText(SERVER_SENTENCE)).toBeInTheDocument();
        expect(api.post).toHaveBeenCalledWith(
            `/api/app/ical-subscription/probe?url=${encodeURIComponent('bu-bir-url-degil')}`, {},
        );
        /* Sunucu cümlesi geldiyse ipucu onun yerini tutmaz: aynı şeyi iki kez söylemeyiz. */
        expect(screen.queryByText(HINT)).toBeNull();
        expect(document.body.textContent).not.toContain('Exception of type');
        /* Sunucu reddetse de geçersiz adres kaydedilemez. */
        expect(addButton()).toBeDisabled();
    });

    it('adres değişince probe sonucu silinir ve ipucu geri gelir', async () => {
        probeResult = { isValid: false, eventCount: 0, error: SERVER_SENTENCE };
        const input = await renderDrawer();

        type(input, 'bu-bir-url-degil');
        fireEvent.click(probeButton());
        await screen.findByText(SERVER_SENTENCE);

        type(input, 'bu-da-degil');

        await waitFor(() => expect(screen.queryByText(SERVER_SENTENCE)).toBeNull());
        expect(screen.getByText(HINT)).toBeInTheDocument();
    });
});
