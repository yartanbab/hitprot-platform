import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubtasksTab } from './SubtasksTab';

const TASK = {
    id: 'parent-1',
    subTasks: [
        { id: 'sub-1', title: 'İlk alt görev', status: 0, code: 'GRV-11' },
        { id: 'sub-2', title: 'İkinci alt görev', status: 2, code: 'GRV-12' },
        { id: 'sub-3', title: 'Üçüncü alt görev', status: 4, code: 'GRV-13' },
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
                    create: vi.fn(() => Promise.resolve('sub-9')),
                    delete: vi.fn(() => Promise.resolve()),
                    updateStatus: vi.fn(() => Promise.resolve()),
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

    /* V4: alt görev SİLME bu sekmeden kaldırıldı, alt görev paneline taşındı
       (tasarım satırı: checkbox · kod · başlık · durum · tarih · avatar · ›).
       Onaylı silme akışı artık SubtaskSheetV3'te; buradaki 3 eski test yerine
       tasarımın yeni davranış kuralları test ediliyor. */

    it('satirin herhangi bir yerine tiklayinca alt gorev paneli acilir', () => {
        const onOpenSubtask = vi.fn();
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={onOpenSubtask} />);
        // başlık değil, satırın kendisi (kod hücresi üzerinden)
        fireEvent.click(screen.getByText('GRV-11'));
        expect(onOpenSubtask).toHaveBeenCalledWith('sub-1', 'İlk alt görev');
    });

    it('checkbox tiklamasi paneli ACMAZ, sadece durumu degistirir', async () => {
        const onOpenSubtask = vi.fn();
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={onOpenSubtask} />);
        fireEvent.click(screen.getByRole('button', { name: /İlk alt görev tamamlandı işaretle/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.updateStatus).toHaveBeenCalledWith('sub-1', 4));
        expect(onOpenSubtask).not.toHaveBeenCalled();
    });

    it('tamamlanmis alt gorevin checkboxi geri Yapilacak yapar', async () => {
        renderWithQueryClient(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: /Üçüncü alt görev tamamlandı işaretle/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.updateStatus).toHaveBeenCalledWith('sub-3', 1));
    });
});
