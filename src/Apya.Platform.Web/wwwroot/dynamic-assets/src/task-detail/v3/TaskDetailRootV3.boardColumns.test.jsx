import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { TaskDetailRootV3 } from './TaskDetailRootV3';
import { taskDetailStore } from '../taskDetailStore';

/**
 * Durum = projenin kanban kolonları. Panoda eklenen özel kolon ("Test") görev
 * detayının Durum menüsünde de seçilir ve KAYDA işlenir: UpdateAsync'e kolon bağı
 * (boardColumnId) + kolonun temel durumu gider. Önceden menü sabit dört durumdu,
 * DTO da sunucudaki eski kolon bağını körlemesine geri gönderiyordu.
 */

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Başvuru dosyasını tamamla',
    description: '',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: null,
    status: 1, priority: 2, isPrivate: false,
    assigneeId: null, projectId: 'p1', parentTaskId: null,
    predecessorIds: [], boardColumnId: null, tags: [],
    subTasks: [], comments: [], attachments: [],
    lastModificationTime: '2026-07-10T09:45:00Z',
};

const COLUMNS = [
    { id: 'c1', statusValue: 1, name: 'Yapılacak', colorClass: 'secondary', order: 0, isSystem: true },
    { id: 'c2', statusValue: 2, name: 'Sürüyor', colorClass: 'warning', order: 1, isSystem: true },
    { id: 'c3', statusValue: 3, name: 'Testte', colorClass: 'info', order: 2, isSystem: true },
    { id: 'c4', statusValue: 4, name: 'Tamamlandı', colorClass: 'success', order: 3, isSystem: true },
    { id: 'x9', statusValue: 3, name: 'Test', colorClass: 'primary', order: 4, isSystem: false },
];

let svc;
let colSvc;

beforeEach(() => {
    window.sessionStorage.clear();
    taskDetailStore.reset();
    svc = {
        get: vi.fn(() => Promise.resolve(TASK)),
        update: vi.fn(() => Promise.resolve(TASK)),
        updateStatus: vi.fn(() => Promise.resolve()),
        delete: vi.fn(() => Promise.resolve()),
        getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
        getProjectsLookup: vi.fn(() => Promise.resolve([{ id: 'p1', name: 'Alfa' }])),
        getFeatureAssignments: vi.fn(() => Promise.resolve([])),
        getChecklistItems: vi.fn(() => Promise.resolve([])),
        addChecklistItem: vi.fn(() => Promise.resolve()),
        getComments: vi.fn(() => Promise.resolve([])),
    };
    colSvc = { getListByProject: vi.fn(() => Promise.resolve(COLUMNS)) };
    window.apya = { platform: { tasks: { task: svc }, projects: { boardColumn: colSvc } } };
    window.abp = {
        currentUser: { id: 'u1', tenantId: 't1', userName: 'ybaba' },
        auth: { isGranted: () => true },
        notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
    };
    window.history.replaceState(null, '', '/Tasks');
});

afterEach(() => {
    delete window.abp;
    window.sessionStorage.clear();
});

async function openLoaded() {
    render(
        <QueryProvider>
            <TaskDetailRootV3 taskId={TASK.id} presentation="modal" onClose={() => {}} />
        </QueryProvider>,
    );
    await screen.findByText(TASK.title);
    await waitFor(() => expect(colSvc.getListByProject).toHaveBeenCalledWith('p1', expect.anything()));
}

const openStatusMenu = (current) => {
    fireEvent.click(screen.getAllByRole('button', { name: current })[0]);
    return screen.getByText('Durumu değiştir').parentElement;
};

describe('TaskDetailRootV3 — durum menüsü proje kolonlarını kullanır', () => {
    it('özel kolon seçilip kaydedilince kolon bağı ve temel durum sunucuya gider', async () => {
        await openLoaded();

        const menu = await waitFor(() => {
            const m = openStatusMenu('Yapılacak');
            within(m).getByText('Test');
            return m;
        });
        fireEvent.click(within(menu).getByText('Test'));
        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1]).toMatchObject({ status: 3, boardColumnId: 'x9' });
    });

    it('özel kolondaki görevde sistem durumu seçilince kolon bağı düşer', async () => {
        svc.get.mockImplementation(() => Promise.resolve({ ...TASK, status: 3, boardColumnId: 'x9' }));
        await openLoaded();

        const menu = await waitFor(() => {
            const m = openStatusMenu(/^test$/i);
            within(m).getByText('Tamamlandı');
            return m;
        });
        fireEvent.click(within(menu).getByText('Tamamlandı'));
        fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
        expect(svc.update.mock.calls[0][1]).toMatchObject({ status: 4, boardColumnId: null });
    });
});
