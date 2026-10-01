import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubtaskSheetV3 } from './SubtaskSheetV3';

/**
 * STA-01: alt görev panelindeki her tıklama tam güncelleme (UpdateAsync) yapıyordu ve
 * elle kurulan DTO bütçe bağını taşımıyordu — durum rozetine basmak alt görevin bütçe
 * kalemini siliyordu. Durum/öncelik artık dar uçlardan (updateStatus/setPriority), açıklama
 * ortak yardımcıyla kurulan tam DTO'dan gider.
 */
const SUB = {
    id: 's1', code: 'GRV-31', title: 'Alt iş', description: 'Eski',
    startDate: '2026-10-01T00:00:00', status: 1, priority: 2,
    creatorId: 'u-me', assigneeId: null,
    budgetLineId: 'b1', plannedAmount: 250, predecessorIds: ['p9'], tags: [{ name: 't' }],
};

function setup({ updateStatus = vi.fn(() => Promise.resolve()) } = {}) {
    window.abp = {
        currentUser: { id: 'u-me' },
        auth: { isGranted: () => true },
        notify: { error: vi.fn(), info: vi.fn(), success: vi.fn() },
    };
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(SUB)),
                    getChecklistItems: vi.fn(() => Promise.resolve([])),
                    getAttachments: vi.fn(() => Promise.resolve([])),
                    getComments: vi.fn(() => Promise.resolve([])),
                    update: vi.fn(() => Promise.resolve()),
                    updateStatus,
                    setPriority: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
        <QueryClientProvider client={qc}>
            <SubtaskSheetV3 subtaskId="s1" parentCode="GRV-30" onClose={vi.fn()} />
        </QueryClientProvider>,
    );
    return window.apya.platform.tasks.task;
}

afterEach(() => { delete window.abp; delete window.apya; });

describe('SubtaskSheetV3 / kısmi güncelleme', () => {
    it('durum rozeti yalnız updateStatus çağırır, tam güncelleme yok', async () => {
        const svc = setup();
        await screen.findByText('Alt iş');

        fireEvent.click(screen.getByTitle('Durumu değiştir'));

        await waitFor(() => expect(svc.updateStatus).toHaveBeenCalledWith('s1', 2));
        expect(svc.update).not.toHaveBeenCalled();
    });

    it('öncelik rozeti yalnız setPriority çağırır, tam güncelleme yok', async () => {
        const svc = setup();
        await screen.findByText('Alt iş');

        fireEvent.click(screen.getByTitle('Önceliği değiştir'));

        await waitFor(() => expect(svc.setPriority).toHaveBeenCalledWith('s1', 3));
        expect(svc.update).not.toHaveBeenCalled();
    });

    it('açıklama kaydı tam DTO gönderir; bütçe bağı, öncül ve etiket korunur', async () => {
        const svc = setup();
        await screen.findByText('Alt iş');

        const description = screen.getByDisplayValue('Eski');
        fireEvent.change(description, { target: { value: 'yeni' } });
        fireEvent.blur(description);

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update).toHaveBeenCalledWith('s1', expect.objectContaining({
            description: 'yeni',
            budgetLineId: 'b1',
            plannedAmount: 250,
            predecessorIds: ['p9'],
            tagNames: ['t'],
        }));
    });

    it('durum ucu reddederse hata bildirimi gösterilir', async () => {
        setup({ updateStatus: vi.fn(() => Promise.reject(new Error('Yetkiniz yok'))) });
        await screen.findByText('Alt iş');

        fireEvent.click(screen.getByTitle('Durumu değiştir'));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalledWith('Yetkiniz yok'));
    });
});
