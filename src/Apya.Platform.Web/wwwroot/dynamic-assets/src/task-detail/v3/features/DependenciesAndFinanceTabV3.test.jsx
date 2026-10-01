import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DependenciesTabV3 } from './DependenciesAndFinanceTabV3';

/* STA-01: öncül kaldırma tam güncellemedir (UpdateAsync). Elle kurulan DTO bütçe
   bağını taşımıyordu; bağlantı kaldırmak görevin bütçe kalemini ve planlanan tutarını
   siliyordu. DTO artık ortak yardımcıdan (taskToUpdateDto) kurulur. */
const TASK = {
    id: 't1',
    title: 'Ana görev',
    startDate: '2026-10-01T00:00:00',
    status: 1,
    priority: 2,
    predecessorIds: ['p1', 'p2'],
    budgetLineId: 'b1',
    plannedAmount: 500,
    tags: [{ name: 'x' }],
    estimatedHours: 4,
};

let update;

beforeEach(() => {
    update = vi.fn(() => Promise.resolve());
    window.abp = { notify: { info: vi.fn(), error: vi.fn() } };
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: (id) => Promise.resolve({ id, title: id, status: 1, code: 'GRV-' + id }),
                    update,
                },
            },
        },
    };
});

afterEach(() => { delete window.apya; delete window.abp; });

describe('DependenciesTabV3 / bağlantı kaldırma', () => {
    it('kalan öncüllerle günceller; bütçe bağı, etiket ve planlama korunur', async () => {
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={qc}>
                <DependenciesTabV3 task={TASK} />
            </QueryClientProvider>,
        );

        fireEvent.click(await screen.findByLabelText('p1 bağlantısını kaldır'));

        await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
        expect(update).toHaveBeenCalledWith('t1', expect.objectContaining({
            predecessorIds: ['p2'],
            budgetLineId: 'b1',
            plannedAmount: 500,
            tagNames: ['x'],
            estimatedHours: 4,
        }));
    });
});
