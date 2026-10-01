import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, dehydrate, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryProvider } from './api/QueryProvider';
import { mountIsland } from './mountIsland';
import { PERSIST_THROTTLE_MS, QUERY_CACHE_STORAGE_KEY } from './api/queryCacheStorage';

/**
 * CAL-24 mekanizması — gerçek QueryProvider + PersistQueryClientProvider ile.
 *
 * Takvimde bozuk tarihli öğe (CAL-03 → 'NaN-NaN-NaNT00:00:00') Intl biçimlendirmesinde
 * RangeError fırlatıyordu. Sınır yokken ada bembeyaz kalıyor, iyimser yama 'success' durumunda
 * olduğu için oturum önbelleğine yazılıyor ve her açılışta ilk kare ondan çizilip yeniden
 * çöküyordu (sekme kapanana kadar).
 *
 * (A) Açılışta kalıcı bozuk veri: kart + önbellek silinir; "Tekrar dene" sunucudan çizer.
 * (B) Oturum içinde bozulma: kalıcılaştırıcının sökülmeden sonra düşen kısıtlı yazması
 *     ikinci silmeyle etkisiz kalır.
 */

const QK = ['calendar', 'feed', 'x'];
const BAD = { items: [{ id: 'a', date: 'NaN-NaN-NaNT00:00:00' }] };
const GOOD = { items: [{ id: 'a', date: '2026-09-29T00:00:00' }] };
const SHOWN = new Intl.DateTimeFormat('tr-TR').format(new Date(GOOD.items[0].date));

function Probe({ queryFn }) {
    const client = useQueryClient();
    const { data } = useQuery({ queryKey: QK, queryFn, staleTime: 60_000 });
    if (!data) return <p>yükleniyor</p>;
    return (
        <div>
            <p>{new Intl.DateTimeFormat('tr-TR').format(new Date(data.items[0].date))}</p>
            {/* useCalendarMutations patchItemDate taklidi: iyimser yama önbelleğe 'success' olarak yazılır. */}
            <button type="button" onClick={() => client.setQueryData(QK, BAD)}>tarihi boz</button>
        </div>
    );
}

let container;
let root;

async function mount(queryFn) {
    await act(async () => {
        root = mountIsland(container, 'calendar', <QueryProvider><Probe queryFn={queryFn} /></QueryProvider>);
    });
}

const card = () => container.querySelector('[data-island-error="calendar"]');

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.sessionStorage.clear();
    window.abp = { currentUser: { id: 'k1', tenantId: 't1' } };
    container = document.createElement('div');
    document.body.appendChild(container);
});

// Kalıcılaştırıcının gecikmeli (kısıtlı) yazması kök söküldükten sonra da düşer; beklenmezse
// sonraki teste sızar (QueryProvider.persist.test.jsx'teki ders).
afterEach(async () => {
    await act(async () => { root?.unmount(); });
    root = null;
    container.remove();
    await new Promise((r) => setTimeout(r, PERSIST_THROTTLE_MS + 200));
    window.sessionStorage.clear();
    delete window.abp;
});

describe('mountIsland · bozuk önbellek kalıcı kilit değil (CAL-24)', () => {
    it('(A) açılışta önbellekten gelen bozuk veri: kart çıkar, önbellek silinir, "Tekrar dene" sunucudan çizer', async () => {
        const stale = new QueryClient();
        stale.setQueryData(QK, BAD);
        window.sessionStorage.setItem(QUERY_CACHE_STORAGE_KEY, JSON.stringify({
            buster: 't1:k1',
            timestamp: Date.now(),
            clientState: dehydrate(stale),
        }));
        const queryFn = vi.fn(async () => GOOD);

        await mount(queryFn);

        await waitFor(() => expect(card()).not.toBeNull());
        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

        expect(await screen.findByText(SHOWN)).toBeInTheDocument();
        expect(card()).toBeNull();
        expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('(B) oturum içinde bozulan veri: sökülmeden sonra düşen kısıtlı yazma önbelleğe geri koyulmaz', async () => {
        await mount(async () => GOOD);
        expect(await screen.findByText(SHOWN)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'tarihi boz' }));
        await waitFor(() => expect(card()).not.toBeNull());

        await new Promise((r) => setTimeout(r, PERSIST_THROTTLE_MS + 300));
        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();
    });
});
