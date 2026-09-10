import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('./api', () => ({
    api: {
        projectChecklist: vi.fn(),
        toggleChecklistItem: vi.fn(() => Promise.resolve()),
        addChecklistItem: vi.fn(() => Promise.resolve('yeni-id')),
        deleteChecklistItem: vi.fn(() => Promise.resolve()),
    },
    projectTasks: vi.fn(),
    openTask: vi.fn(),
}));

import { api, projectTasks } from './api';
import { ChecklistPanel } from './ChecklistPanel';

const TASKS = [
    { id: 't1', title: 'API sözleşmesi', number: 7 },
    { id: 't2', title: 'Test ortamı', number: 8 },
];
const ITEMS = [
    { id: 'i1', taskId: 't1', text: 'Şema onayı', isDone: true },
    { id: 'i2', taskId: 't1', text: 'Alan listesi', isDone: false },
    { id: 'i3', taskId: 't2', text: 'Sunucu kiralama', isDone: false },
];

/** Panel görünür mount ile başlar (d-none yok) → tembel bekleme devreye girmez. */
const mountEl = () => document.createElement('div');

beforeEach(() => {
    vi.clearAllMocks();
    projectTasks.mockResolvedValue(TASKS);
    api.projectChecklist.mockResolvedValue(ITEMS);
});

describe('ChecklistPanel (proje kapsamı)', () => {
    it('maddeleri gorev basina gruplar ve ilerlemeyi yazar', async () => {
        render(<ChecklistPanel projectId="p1" kind="checklist" mountEl={mountEl()} />);

        expect(await screen.findByText('Şema onayı')).toBeInTheDocument();
        expect(screen.getByText('API sözleşmesi')).toBeInTheDocument();
        expect(screen.getByText('GRV-7')).toBeInTheDocument();
        expect(screen.getByText('1/2')).toBeInTheDocument();   // t1 ilerlemesi
        expect(screen.getByText('0/1')).toBeInTheDocument();   // t2 ilerlemesi
    });

    it('isaretleme kaynaga yazar ve paneli tazeler (ust kapsamdan tam duzenleme)', async () => {
        render(<ChecklistPanel projectId="p1" kind="checklist" mountEl={mountEl()} />);
        await screen.findByText('Alan listesi');

        fireEvent.click(screen.getByRole('checkbox', { name: 'Alan listesi' }));

        await waitFor(() => expect(api.toggleChecklistItem).toHaveBeenCalledWith('i2'));
        // Yazma sonrası tazeleme: liste ucu ikinci kez çağrılır.
        await waitFor(() => expect(api.projectChecklist).toHaveBeenCalledTimes(2));
    });

    it('madde ekleme gorevin listesine yazar', async () => {
        render(<ChecklistPanel projectId="p1" kind="checklist" mountEl={mountEl()} />);
        await screen.findByText('Şema onayı');

        fireEvent.click(screen.getAllByText('＋ madde ekle…')[0]);
        const input = screen.getByPlaceholderText('Madde yazın, Enter ile ekleyin');
        fireEvent.change(input, { target: { value: 'Yük testi raporu' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        await waitFor(() => expect(api.addChecklistItem).toHaveBeenCalledWith('t1', 'Yük testi raporu'));
    });

    it('hic madde yokken 3a bos durumunu basar', async () => {
        api.projectChecklist.mockResolvedValue([]);
        render(<ChecklistPanel projectId="p1" kind="checklist" mountEl={mountEl()} />);

        expect(await screen.findByText('Bu projede henüz kontrol listesi yok')).toBeInTheDocument();
    });
});
