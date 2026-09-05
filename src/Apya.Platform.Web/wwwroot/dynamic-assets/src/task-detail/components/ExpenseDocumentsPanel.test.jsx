import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExpenseDocumentsPanel } from './ExpenseDocumentsPanel';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const CANDIDATES = [
    { documentFileId: 'd1', displayName: 'Fatura-1001.pdf', amount: 1500, documentDate: '2026-09-02T00:00:00Z', score: 92, isStrong: true },
    { documentFileId: 'd2', displayName: 'Dekont.pdf', amount: 900, documentDate: '2026-08-20T00:00:00Z', score: 41, isStrong: false },
];

/** abp.ajax jQuery Deferred taklidi — done/fail zincirlenebilir olmali. */
function deferred(value) {
    return { done(f) { setTimeout(() => f(value), 0); return this; }, fail() { return this; } };
}

function setup({ canLink = true, matches = [] } = {}) {
    const calls = [];
    window.abp = {
        appPath: '/',
        auth: { isGranted: (p) => (p === 'Platform.Documents.ManageMeta' ? canLink : true) },
        notify: { error: vi.fn() },
        ajax: vi.fn((options) => {
            calls.push(options);
            if (options.url.includes('handler=Candidates')) return deferred(CANDIDATES);
            return deferred({});
        }),
    };
    renderWithClient(<ExpenseDocumentsPanel expenseId="e1" projectId="p1" matches={matches} />);
    return { calls };
}

beforeEach(() => { delete window.abp; });

describe('ExpenseDocumentsPanel', () => {
    it('aday evraklari skoruyla listeler', async () => {
        setup();

        expect(await screen.findByText('Fatura-1001.pdf')).toBeInTheDocument();
        expect(screen.getByText('%92')).toBeInTheDocument();
        expect(screen.getByText('%41')).toBeInTheDocument();
    });

    it('Bagla, mevcut CreateMatch ucuna gider+belge kimligini gonderir', async () => {
        const { calls } = setup();
        await screen.findByText('Fatura-1001.pdf');

        fireEvent.click(screen.getAllByRole('button', { name: /bağla/i })[0]);

        await waitFor(() => {
            const post = calls.find((c) => c.url.includes('handler=CreateMatch'));
            expect(post).toBeTruthy();
            expect(JSON.parse(post.data)).toEqual({ documentFileId: 'd1', expenseId: 'e1', score: 92 });
        });
    });

    it('zaten bagli belge aday listesinde TEKRAR gosterilmez', async () => {
        setup({ matches: [{ id: 'm1', documentFileId: 'd1', documentFileName: 'Fatura-1001.pdf' }] });

        // Adaylar gelene kadar bekle; "Bağlı evraklar" prop'tan geldigi icin aninda basilir.
        expect(await screen.findByText('Dekont.pdf')).toBeInTheDocument();
        expect(screen.getByText('Bağlı evraklar')).toBeInTheDocument();
        // Ad yalnizca "bagli" bolumunde gecmeli.
        expect(screen.getAllByText('Fatura-1001.pdf')).toHaveLength(1);
    });

    it('Kaldir, RemoveMatch ucunu match kimligiyle cagirir', async () => {
        const { calls } = setup({ matches: [{ id: 'm1', documentFileId: 'd1', documentFileName: 'Fatura-1001.pdf' }] });
        await screen.findByText('Bağlı evraklar');

        fireEvent.click(screen.getByRole('button', { name: /kaldır/i }));

        await waitFor(() => {
            expect(calls.some((c) => c.url.includes('handler=RemoveMatch') && c.url.includes('matchId=m1'))).toBe(true);
        });
    });

    it('ManageMeta izni yoksa bagla/kaldir dugmeleri basilmaz', async () => {
        setup({ canLink: false, matches: [{ id: 'm1', documentFileId: 'd9', documentFileName: 'Eski.pdf' }] });
        await screen.findByText('Fatura-1001.pdf');

        expect(screen.queryByRole('button', { name: /bağla/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /kaldır/i })).not.toBeInTheDocument();
    });

    it('aday yoksa yonlendirici metin gosterir', async () => {
        window.abp = {
            appPath: '/',
            auth: { isGranted: () => true },
            notify: { error: vi.fn() },
            ajax: vi.fn(() => deferred([])),
        };
        renderWithClient(<ExpenseDocumentsPanel expenseId="e1" projectId="p1" matches={[]} />);

        expect(await screen.findByText(/Belgeler modülünden yüklenip/i)).toBeInTheDocument();
    });
});
