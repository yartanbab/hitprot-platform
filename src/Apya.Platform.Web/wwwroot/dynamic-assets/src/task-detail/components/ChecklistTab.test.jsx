import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChecklistTab } from './ChecklistTab';

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
                        { id: 'item-1', text: 'İlk madde', isDone: false },
                    ])),
                    addChecklistItem: vi.fn(() => Promise.resolve('item-2')),
                    toggleChecklistItem: vi.fn(() => Promise.resolve()),
                    deleteChecklistItem: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('ChecklistTab', () => {
    it('maddeleri listeler', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText('İlk madde')).toBeInTheDocument();
    });

    it('checkbox tiklaninca toggleChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');
        fireEvent.click(screen.getByRole('checkbox'));
        await waitFor(() => expect(window.apya.platform.tasks.task.toggleChecklistItem).toHaveBeenCalledWith('item-1'));
    });

    it('yeni madde eklenince addChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');
        fireEvent.change(screen.getByPlaceholderText('Yeni madde'), { target: { value: 'İkinci madde' } });
        fireEvent.click(screen.getByRole('button', { name: /ekle/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.addChecklistItem).toHaveBeenCalledWith('t-1', 'İkinci madde'));
    });

    it('sil butonuna basinca deleteChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');
        fireEvent.click(screen.getByRole('button', { name: 'İlk madde maddesini sil' }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteChecklistItem).toHaveBeenCalledWith('item-1'));
    });

    it('addChecklistItem reddedilirse abp.notify.error cagirir, draft temizlenmez', async () => {
        window.apya.platform.tasks.task.addChecklistItem = vi.fn(() => Promise.reject(new Error('Sunucu hatasi.')));
        window.abp = { notify: { error: vi.fn() } };
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');

        fireEvent.change(screen.getByPlaceholderText('Yeni madde'), { target: { value: 'Basarisiz madde' } });
        fireEvent.click(screen.getByRole('button', { name: /ekle/i }));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalledWith('Sunucu hatasi.'));
        expect(screen.getByPlaceholderText('Yeni madde')).toHaveValue('Basarisiz madde');
    });

    it('toggleChecklistItem reddedilirse abp.notify.error cagirir', async () => {
        window.apya.platform.tasks.task.toggleChecklistItem = vi.fn(() => Promise.reject(new Error('Sunucu hatasi.')));
        window.abp = { notify: { error: vi.fn() } };
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');

        fireEvent.click(screen.getByRole('checkbox'));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalledWith('Sunucu hatasi.'));
    });
});
