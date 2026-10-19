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

/* QA-22 · Öncül eklenebilir; ardıllar projenin bağ kenarlarından listelenir. */
describe('DependenciesTabV3 / öncül ekleme ve ardıllar', () => {
    function renderWith(extra, props = {}) {
        Object.assign(window.apya.platform.tasks.task, extra);
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        return render(
            <QueryClientProvider client={qc}>
                <DependenciesTabV3 task={{ ...TASK, projectId: 'pr1' }} {...props} />
            </QueryClientProvider>,
        );
    }

    const PROJECT_TASKS = {
        items: [
            { id: 't1', title: 'Ana görev', status: 1, code: 'GRV-1' },
            { id: 'p1', title: 'p1', status: 1, code: 'GRV-p1' },
            { id: 'c1', title: 'Aday iş', status: 1, code: 'GRV-7' },
            { id: 's1', title: 'Ardıl iş', status: 2, code: 'GRV-9' },
        ],
    };

    it('ardılları bağ kenarlarından listeler', async () => {
        renderWith({
            getList: () => Promise.resolve(PROJECT_TASKS),
            getProjectDependencies: () => Promise.resolve([{ taskId: 's1', predecessorTaskId: 't1' }]),
        });
        expect(await screen.findByText('Ardıl iş')).toBeInTheDocument();
    });

    it('seçilen görevi öncül olarak ekler; görevin kendisi, öncülleri ve ardılları seçenek değildir', async () => {
        renderWith({
            getList: () => Promise.resolve(PROJECT_TASKS),
            getProjectDependencies: () => Promise.resolve([{ taskId: 's1', predecessorTaskId: 't1' }]),
        });
        const select = await screen.findByLabelText('Öncül görev seç');
        await waitFor(() => expect(select.querySelectorAll('option').length).toBe(2));
        const values = [...select.querySelectorAll('option')].map((o) => o.value);
        expect(values).toEqual(['', 'c1']);

        fireEvent.change(select, { target: { value: 'c1' } });
        fireEvent.click(screen.getByRole('button', { name: 'Öncül ekle' }));

        await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
        expect(update).toHaveBeenCalledWith('t1', expect.objectContaining({ predecessorIds: ['p1', 'p2', 'c1'] }));
    });

    it('salt okunur kullanıcıya seçici çizilmez', async () => {
        renderWith({
            getList: () => Promise.resolve(PROJECT_TASKS),
            getProjectDependencies: () => Promise.resolve([]),
        }, { readOnly: true });
        expect(await screen.findByText('Ardıl görev yok')).toBeInTheDocument();
        expect(screen.queryByLabelText('Öncül görev seç')).toBeNull();
    });
});

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
