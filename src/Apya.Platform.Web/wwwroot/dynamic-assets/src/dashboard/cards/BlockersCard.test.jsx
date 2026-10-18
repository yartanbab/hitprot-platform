import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlockersCard } from './BlockersCard';

/*
 * K-12 · Boş pano yanıltmasın: hiç açık işi olmayan yeni kiracıda kart "Açık işlerin hepsi son
 * günlerde hareket görmüş" diyordu — ortada iş yokken bir "her şey yolunda" hükmü. Boş durum
 * cümlesi iki durumda da (iş yok / işler hareketli) doğru kalmalı.
 */
const jsonResponse = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('BlockersCard · boş durum', () => {
    it('hiç açık iş yokken de doğru kalan bir cümle kurar', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(jsonResponse(200, []))));
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

        render(<QueryClientProvider client={client}><BlockersCard /></QueryClientProvider>);

        expect(await screen.findByText('Hareketsiz kalmış açık iş bulunmuyor.')).toBeInTheDocument();
        expect(screen.queryByText(/hepsi son günlerde hareket görmüş/)).toBeNull();
    });
});
