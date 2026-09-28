import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCalendarMutations } from './useCalendarMutations';
import { api } from '../../lib/api/httpClient';

vi.mock('../../lib/api/httpClient', () => ({
    api: { get: vi.fn(), post: vi.fn() },
}));

/* STA-03: takvimden yapılan taşıma/tamamlama Pano'ya ve sonraki takvim
   restore'una bayat görünüyordu. Başarıda YALNIZ damga yazılır; olay yayınlanmaz,
   çünkü takvim kendi feed'ini zaten geçersizliyor (olay ikinci çekme yapardı). */

const STAMP_KEY = 'apya-data-changed-at';
const ITEM = { key: 'task:t1', source: 1, sourceId: 't1', title: 'QA-UX görev', date: '2026-09-01T00:00:00' };

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

let events;
const onEvent = () => { events += 1; };

beforeEach(() => {
    window.sessionStorage.clear();
    events = 0;
    document.addEventListener('apya:data-changed', onEvent);
});
afterEach(() => { document.removeEventListener('apya:data-changed', onEvent); });

describe('useCalendarMutations — veri-değişti damgası', () => {
    it('tarih taşıma başarılı → damga yazılır, olay yayınlanmaz', async () => {
        api.post.mockResolvedValue(undefined);
        const { result } = renderHook(() => useCalendarMutations(), { wrapper });

        result.current.reschedule(ITEM, new Date('2026-09-05T00:00:00'));

        await waitFor(() => expect(window.sessionStorage.getItem(STAMP_KEY)).not.toBeNull());
        expect(api.post).toHaveBeenCalledWith('/api/app/calendar/reschedule-item', expect.anything());
        expect(events).toBe(0);
    });

    it('tamamlama başarılı → damga yazılır, olay yayınlanmaz', async () => {
        api.post.mockResolvedValue(undefined);
        const { result } = renderHook(() => useCalendarMutations(), { wrapper });

        result.current.complete(ITEM);

        await waitFor(() => expect(window.sessionStorage.getItem(STAMP_KEY)).not.toBeNull());
        expect(api.post).toHaveBeenCalledWith('/api/app/calendar/complete-item', expect.anything());
        expect(events).toBe(0);
    });

    it('sunucu reddederse (çevrimiçi) damga yazılmaz', async () => {
        api.post.mockRejectedValue(new Error('Reddedildi'));
        const { result } = renderHook(() => useCalendarMutations(), { wrapper });

        result.current.reschedule(ITEM, new Date('2026-09-05T00:00:00'));

        await waitFor(() => expect(result.current.errors[ITEM.key]).toBe('Reddedildi'));
        expect(window.sessionStorage.getItem(STAMP_KEY)).toBeNull();
        expect(events).toBe(0);
    });
});
