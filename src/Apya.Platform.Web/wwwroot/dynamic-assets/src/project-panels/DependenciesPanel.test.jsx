import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('./api', () => ({
    api: { projectDependencies: vi.fn() },
    projectTasks: vi.fn(),
    openTask: vi.fn(),
}));

import { api, projectTasks, openTask } from './api';
import { DependenciesPanel } from './DependenciesPanel';

const gecmis = '2020-01-01T00:00:00';

const TASKS = [
    { id: 'pred', title: 'Test ortamı kurulumu', number: 3, status: 2, dueDate: gecmis },
    { id: 'succ', title: 'Entegrasyon testi', number: 4, status: 1, dueDate: null },
];

const mountEl = () => document.createElement('div');

beforeEach(() => {
    vi.clearAllMocks();
    projectTasks.mockResolvedValue(TASKS);
    api.projectDependencies.mockResolvedValue([{ taskId: 'succ', predecessorTaskId: 'pred' }]);
});

describe('DependenciesPanel (proje kapsamı)', () => {
    it('kenari oncul→ardil olarak listeler, durum pilleriyle', async () => {
        render(<DependenciesPanel projectId="p1" kind="dependencies" mountEl={mountEl()} />);

        expect(await screen.findByText('Test ortamı kurulumu')).toBeInTheDocument();
        expect(screen.getByText('Entegrasyon testi')).toBeInTheDocument();
        expect(screen.getByText('Sürüyor')).toBeInTheDocument();
        expect(screen.getByText('Yapılacak')).toBeInTheDocument();
    });

    it('gecikmis acik oncul icin bloke uyari bandini basar', async () => {
        render(<DependenciesPanel projectId="p1" kind="dependencies" mountEl={mountEl()} />);

        expect(await screen.findByText(/bağlantı bloke ediyor/)).toBeInTheDocument();
    });

    it('oncul tamamlanmissa bant cikmaz', async () => {
        projectTasks.mockResolvedValue([{ ...TASKS[0], status: 4 }, TASKS[1]]);
        render(<DependenciesPanel projectId="p1" kind="dependencies" mountEl={mountEl()} />);

        await screen.findByText('Test ortamı kurulumu');
        expect(screen.queryByText(/bağlantı bloke ediyor/)).not.toBeInTheDocument();
    });

    it('gorev basligina tiklama gorev detayini acar', async () => {
        render(<DependenciesPanel projectId="p1" kind="dependencies" mountEl={mountEl()} />);
        fireEvent.click(await screen.findByText('Entegrasyon testi'));

        expect(openTask).toHaveBeenCalledWith('succ');
    });

    it('kenar yokken 3a bos durumunu basar', async () => {
        api.projectDependencies.mockResolvedValue([]);
        render(<DependenciesPanel projectId="p1" kind="dependencies" mountEl={mountEl()} />);

        expect(await screen.findByText('Bu projede görevler arası bağ yok')).toBeInTheDocument();
    });
});
