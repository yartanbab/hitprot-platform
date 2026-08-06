import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubtasksTab } from './SubtasksTab';

const TASK = {
    id: 'parent-1',
    subTasks: [
        { id: 'sub-1', title: 'İlk alt görev', status: 0 },
        { id: 'sub-2', title: 'İkinci alt görev', status: 2 },
    ],
};

function renderWithQueryClient(component) {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    );
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    create: vi.fn(() => Promise.resolve('sub-3')),
                    delete: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('SubtasksTab', () => {
    it('mevcut alt gorevleri listeler', () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        expect(screen.getByText('İlk alt görev')).toBeInTheDocument();
        expect(screen.getByText('İkinci alt görev')).toBeInTheDocument();
    });

    it('alt gorev basligina tiklayinca onOpenSubtask cagirir', () => {
        const onOpenSubtask = vi.fn();
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={onOpenSubtask} />);
        fireEvent.click(screen.getByText('İlk alt görev'));
        expect(onOpenSubtask).toHaveBeenCalledWith('sub-1', 'İlk alt görev');
    });

    it('bos baslikla yeni alt gorev eklenemez', async () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: /alt görev ekle/i }));
        expect(window.apya.platform.tasks.task.create).not.toHaveBeenCalled();
    });

    it('yeni alt gorev eklenince create parentTaskId ile cagirilir', async () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.change(screen.getByPlaceholderText('Yeni alt görev başlığı'), {
            target: { value: 'Üçüncü alt görev' },
        });
        fireEvent.click(screen.getByRole('button', { name: /alt görev ekle/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.create).toHaveBeenCalledTimes(1));
        const dto = window.apya.platform.tasks.task.create.mock.calls[0][0];
        expect(dto.title).toBe('Üçüncü alt görev');
        expect(dto.parentTaskId).toBe('parent-1');
    });

    it('sil butonuna basinca hemen delete cagirmaz, once onay ister', () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getAllByRole('button', { name: /sil/i })[0]);
        expect(window.apya.platform.tasks.task.delete).not.toHaveBeenCalled();
        expect(screen.getByText('Emin misiniz?')).toBeInTheDocument();
    });

    it('onay sonrasi Evet, sil ile delete cagirir', async () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getAllByRole('button', { name: /sil/i })[0]);
        fireEvent.click(screen.getByRole('button', { name: 'Evet, sil' }));
        await waitFor(() => expect(window.apya.platform.tasks.task.delete).toHaveBeenCalledWith('sub-1'));
    });

    it('Vazgec ile onay iptal edilir, delete cagrilmaz', () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getAllByRole('button', { name: /sil/i })[0]);
        fireEvent.click(screen.getByRole('button', { name: 'Vazgeç' }));
        expect(window.apya.platform.tasks.task.delete).not.toHaveBeenCalled();
        expect(screen.queryByText('Emin misiniz?')).not.toBeInTheDocument();
    });
});
