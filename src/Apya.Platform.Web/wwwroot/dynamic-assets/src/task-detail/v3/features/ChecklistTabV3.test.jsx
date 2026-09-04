import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChecklistTabV3 } from './ChecklistTabV3';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getChecklistItems: vi.fn(() => Promise.resolve([
                        { id: 'c-1', text: 'Sözleşme imzalansın', isDone: true },
                        { id: 'c-2', text: 'Fatura kesilsin', isDone: false },
                    ])),
                    addChecklistItem: vi.fn(() => Promise.resolve('c-3')),
                    toggleChecklistItem: vi.fn(() => Promise.resolve()),
                    deleteChecklistItem: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('ChecklistTabV3', () => {
    it('maddeleri ve ilerleme sayacini gosterir', async () => {
        renderWithClient(<ChecklistTabV3 taskId="t-1" />);
        expect(await screen.findByText('Sözleşme imzalansın')).toBeInTheDocument();
        expect(screen.getByText('Fatura kesilsin')).toBeInTheDocument();
        expect(screen.getByText('1/2')).toBeInTheDocument();
        expect(screen.getByText('%50')).toBeInTheDocument();
    });

    it('Enter ile yeni madde ekler (DB ye yazar)', async () => {
        renderWithClient(<ChecklistTabV3 taskId="t-1" />);
        await screen.findByText('Fatura kesilsin');
        const input = screen.getByLabelText('Yeni kontrol listesi maddesi');
        fireEvent.change(input, { target: { value: 'Teslimat planlansın' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        await waitFor(() => expect(window.apya.platform.tasks.task.addChecklistItem)
            .toHaveBeenCalledWith('t-1', 'Teslimat planlansın'));
    });

    it('kutuya basinca toggleChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTabV3 taskId="t-1" />);
        await screen.findByText('Fatura kesilsin');
        fireEvent.click(screen.getByRole('button', { name: 'Tamamlandı işaretle' }));
        await waitFor(() => expect(window.apya.platform.tasks.task.toggleChecklistItem)
            .toHaveBeenCalledWith('c-2'));
    });

    it('bos listede yonlendirici mesaj gosterir', async () => {
        window.apya.platform.tasks.task.getChecklistItems = vi.fn(() => Promise.resolve([]));
        renderWithClient(<ChecklistTabV3 taskId="t-1" />);
        expect(await screen.findByText(/ilk maddeyi ekleyin/i)).toBeInTheDocument();
    });
});
