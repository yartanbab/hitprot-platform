import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// vi.mock() below is hoisted above this file's own top-level statements, so a
// plain `const DEMO_ENTRY = ...` here would still be in its temporal dead zone
// when the factory runs (Vitest error: "make sure there are no top level
// variables inside, since this call is hoisted to top of file"). vi.hoisted()
// is Vitest's documented escape hatch: its callback is hoisted and executed
// alongside vi.mock, so DEMO_ENTRY is guaranteed to exist by the time the
// factory below references it.
const { DEMO_ENTRY } = vi.hoisted(() => {
    function DemoFeature({ taskId }) {
        return <div>Demo özellik içeriği — görev {taskId}</div>;
    }
    return {
        DEMO_ENTRY: {
            code: 'demo', title: 'Demo Özellik', icon: 'fa-flask', category: 'ileri',
            isCore: false, order: 99, permission: null, implemented: true, component: DemoFeature,
        },
    };
});

vi.mock('./TaskFeatureRegistry', async (importOriginal) => {
    const actual = await importOriginal();
    const registry = [...actual.TASK_FEATURE_REGISTRY, DEMO_ENTRY];
    return {
        ...actual,
        TASK_FEATURE_REGISTRY: registry,
        getVisibleTabs: (assignedCodes = []) => {
            const assigned = new Set(assignedCodes);
            return registry
                .filter((f) => f.implemented && (f.isCore || assigned.has(f.code)))
                .sort((a, b) => a.order - b.order);
        },
        getPickerEntries: (assignedCodes = []) => {
            const assigned = new Set(assignedCodes);
            return registry
                .filter((f) => !f.isCore)
                .map((f) => ({ ...f, isAssigned: assigned.has(f.code) }))
                .sort((a, b) => a.order - b.order);
        },
    };
});

// eslint-disable-next-line import/first
import { TaskDetailRoot } from './TaskDetailRoot';

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Demo Görevi', description: '', startDate: '2026-06-25T00:00:00Z', dueDate: null,
    status: 1, priority: 2, isPrivate: false, assigneeId: null,
    creatorId: 'u1', lastModifierId: 'u1', projectId: null, projectName: null,
    parentTaskId: null, predecessorIds: [], boardColumnId: null, tags: [],
    lastModificationTime: '2026-07-10T09:45:00Z', creationTime: '2026-06-25T14:30:00Z',
};

function wrap(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(TASK)),
                    update: vi.fn(() => Promise.resolve()),
                    getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
                    getFeatureAssignments: vi.fn(() => Promise.resolve([])),
                    addFeature: vi.fn(() => Promise.resolve()),
                    removeFeature: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
    window.abp = { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() } };
    window.history.replaceState(null, '', '/Tasks');
});

describe('TaskDetailRoot — feature registry mekanizması (fixture ile)', () => {
    it('baslangicta yalniz Genel sekmesi gorunur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');
        expect(screen.getByRole('tab', { name: /Genel/ })).toBeInTheDocument();
        expect(screen.queryByRole('tab', { name: /Demo Özellik/ })).not.toBeInTheDocument();
    });

    it('picker acilinca demo entry Ekle ile gorunur, eklenince backend cagrilir ve sekme belirir', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        expect(screen.getByText('Demo Özellik')).toBeInTheDocument();

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        await userEvent.click(screen.getByRole('button', { name: 'Ekle' }));

        expect(window.apya.platform.tasks.task.addFeature).toHaveBeenCalledWith(TASK.id, 'demo');
        await waitFor(() => expect(screen.getByRole('tab', { name: /Demo Özellik/ })).toBeInTheDocument());
    });

    it('eklenen sekme tiklaninca lazy component render olur', async () => {
        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(await screen.findByRole('tab', { name: /Demo Özellik/ }));
        expect(await screen.findByText(`Demo özellik içeriği — görev ${TASK.id}`)).toBeInTheDocument();
    });

    it('Kaldir cagrilinca backend cagrilir, aktifken kaldirilirsa Genele doner', async () => {
        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');
        await userEvent.click(await screen.findByRole('tab', { name: /Demo Özellik/ }));
        await screen.findByText(`Demo özellik içeriği — görev ${TASK.id}`);

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve([]));
        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        await userEvent.click(screen.getByRole('button', { name: 'Kaldır' }));

        expect(window.apya.platform.tasks.task.removeFeature).toHaveBeenCalledWith(TASK.id, 'demo');
        await waitFor(() => expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('aria-selected', 'true'));
    });

    it('"+" butonuna acikken tekrar tiklamak picker\'i kapatir (yeniden acmaz)', async () => {
        // Regresyon testi: panelRef eskiden yalnizca FeaturePicker'in KENDI div'indeydi,
        // "+" butonunu kapsamiyordu. Acikken "+"ya basmak mousedown'da onClose'u
        // tetikleyip click'te tekrar aciyordu (picker hic kapanmiyor gibi davraniyordu).
        // Bu bug SADECE "+" butonu ve panel gercek DOM kardesleriyken ortaya cikar,
        // bu yuzden burada gercek TaskDetailRoot agaci uzerinden test ediliyor.
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        const plusButton = screen.getByRole('button', { name: 'Özellik ekle' });
        await userEvent.click(plusButton);
        expect(screen.getByRole('dialog', { name: 'Özellik ekle' })).toBeInTheDocument();

        await userEvent.click(plusButton);
        expect(screen.queryByRole('dialog', { name: 'Özellik ekle' })).not.toBeInTheDocument();
    });

    it('disari tiklama picker\'i kapatir', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        expect(screen.getByRole('dialog', { name: 'Özellik ekle' })).toBeInTheDocument();

        await userEvent.click(screen.getByText('Demo Görevi'));
        expect(screen.queryByRole('dialog', { name: 'Özellik ekle' })).not.toBeInTheDocument();
    });

    it('Escape picker acikken kapatir', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        expect(screen.getByRole('dialog', { name: 'Özellik ekle' })).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('dialog', { name: 'Özellik ekle' })).not.toBeInTheDocument();
    });

    it('addFeature reddedilirse abp.notify.error cagirilir, sekme eklenmez, picker acik kalir', async () => {
        window.apya.platform.tasks.task.addFeature = vi.fn(() => Promise.reject(new Error('sunucu hatasi')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        await userEvent.click(screen.getByRole('button', { name: 'Ekle' }));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalled());
        expect(screen.queryByRole('tab', { name: /Demo Özellik/ })).not.toBeInTheDocument();
        // Basarisiz eklemede picker kapatilmaz — yalniz basari yolunda kapanir.
        expect(screen.getByRole('dialog', { name: 'Özellik ekle' })).toBeInTheDocument();
    });

    it('removeFeature reddedilirse abp.notify.error cagirilir, sekme kaldirilmaz', async () => {
        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        window.apya.platform.tasks.task.removeFeature = vi.fn(() => Promise.reject(new Error('sunucu hatasi')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        await userEvent.click(screen.getByRole('button', { name: 'Kaldır' }));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalled());
        expect(screen.getByRole('tab', { name: /Demo Özellik/ })).toBeInTheDocument();
    });

    it('activeCode gosterilen sekmeler disinda kalirsa (baska oturumda kaldirilmis) Genel\'e duser', async () => {
        // handleRemoveFeature'in kendi 'activeCode === code ? general' donusunden
        // FARKLI bir yol: burada bu component'in mutasyonundan GECMEDEN, react-query
        // cache'i disaridan guncelleniyor — refetchOnWindowFocus'un baska bir
        // sekmede/oturumda yapilan degisiklikten sonra ureteceği durumu simule eder.
        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={qc}>
                <TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />
            </QueryClientProvider>,
        );
        await screen.findByText('Demo Görevi');
        await userEvent.click(await screen.findByRole('tab', { name: /Demo Özellik/ }));
        await screen.findByText(`Demo özellik içeriği — görev ${TASK.id}`);

        qc.setQueryData(['task-features', TASK.id], []);

        await waitFor(() => expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('aria-selected', 'true'));
        expect(screen.queryByRole('tab', { name: /Demo Özellik/ })).not.toBeInTheDocument();
        expect(screen.getByLabelText('Başlık')).toBeInTheDocument();
    });
});
