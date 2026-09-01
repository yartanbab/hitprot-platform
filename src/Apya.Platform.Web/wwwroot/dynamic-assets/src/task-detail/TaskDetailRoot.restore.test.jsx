import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryProvider } from '../lib/api/QueryProvider';
import { TaskDetailRoot } from './TaskDetailRoot';

/**
 * v1 kökü de GERÇEK QueryProvider ile kurulur — diğer TaskDetailRoot testleri düz
 * QueryClientProvider kullandığı için `PersistQueryClientProvider`'ın geri yükleme
 * penceresini hiç görmüyor. O pencerede sorgu `fetchStatus:'idle'` döndüğü için
 * `isLoading` FALSE olur ama `task` hâlâ undefined'dır; gövde iskelet yerine
 * boş görevle çizilirdi (v3'teki açıklama editörü hatasıyla aynı sınıf).
 */

const TASK_ID = '11111111-2222-3333-4444-555555555555';

beforeEach(() => {
    window.sessionStorage.clear();
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve({ id: TASK_ID, title: 'Otel Konaklama Anlaşması' })),
                    getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
                    getFeatureAssignments: vi.fn(() => Promise.resolve([])),
                },
            },
        },
    };
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

describe('TaskDetailRoot — kalıcı önbellek geri yükleme penceresi', () => {
    it('geri yükleme penceresinde gövdeyi değil İSKELETİ çizer', () => {
        render(
            <QueryProvider>
                <TaskDetailRoot taskId={TASK_ID} presentation="modal" onClose={() => {}} />
            </QueryProvider>,
        );

        expect(screen.getByLabelText('Görev yükleniyor')).toBeInTheDocument();
    });

    it('veri gelince gövdeye geçer', async () => {
        render(
            <QueryProvider>
                <TaskDetailRoot taskId={TASK_ID} presentation="modal" onClose={() => {}} />
            </QueryProvider>,
        );

        expect(await screen.findByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
    });
});
