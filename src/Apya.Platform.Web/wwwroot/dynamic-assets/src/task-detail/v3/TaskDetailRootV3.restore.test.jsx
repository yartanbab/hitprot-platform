import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { QueryProvider } from '../../lib/api/QueryProvider';
import { TaskDetailRootV3 } from './TaskDetailRootV3';

/**
 * Kalıcılaştırılmış önbellek (PersistQueryClientProvider) GERÇEK sağlayıcıyla
 * kurulur — diğer görev detayı testleri düz QueryClientProvider kullandığı için
 * "restore" penceresini hiç görmüyor.
 *
 * O pencerede useQuery `fetchStatus:'idle'` döndürür → `isLoading` FALSE olduğu
 * hâlde `data` hâlâ undefined'dır. Önbellek DOLU geliyorsa hemen ardından iskelet
 * aşaması HİÇ yaşanmaz; gövde undefined görevle mount olmuş hâlde kalır.
 *
 * Görev detayı artık kalıcılaştırılmıyor (meta.persist:false, TSK-01) — yalnız
 * lookup'lar saklanıyor. isPending kapısı yine de gerekli: yayın (deploy) geçişinde
 * sekmede görev gövdesi taşıyan ESKİ biçim bir blob kalmış olabilir.
 */

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Otel Konaklama Anlaşması',
    description: '<p>Kayıtlı açıklama metni</p>',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 1, priority: 2, isPrivate: false,
    assigneeId: null, projectId: null, parentTaskId: null,
    predecessorIds: [], boardColumnId: null, tags: [],
    subTasks: [], comments: [], attachments: [],
    lastModificationTime: '2026-07-10T09:45:00Z',
};

const CACHE_KEY = 'apya-rq-cache';

beforeEach(() => {
    window.sessionStorage.clear();
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(TASK)),
                    update: vi.fn(() => Promise.resolve()),
                    getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
                    getProjectsLookup: vi.fn(() => Promise.resolve([])),
                    getFeatureAssignments: vi.fn(() => Promise.resolve([])),
                    getChecklistItems: vi.fn(() => Promise.resolve([])),
                    getComments: vi.fn(() => Promise.resolve([])),
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

function openModal() {
    return render(
        <QueryProvider>
            <TaskDetailRootV3 taskId={TASK.id} presentation="modal" onClose={() => {}} />
        </QueryProvider>,
    );
}

const editorText = () =>
    document.querySelector('[aria-label="Görev açıklaması"]')?.textContent ?? null;

describe('TaskDetailRootV3 — kalıcı önbellek geri yükleme penceresi', () => {
    it('ilk açılışta kayıtlı açıklamayı gösterir', async () => {
        openModal();
        expect(await screen.findByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
        await waitFor(() => expect(editorText()).toBe('Kayıtlı açıklama metni'));
    });

    it('KAPATIP TEKRAR AÇINCA da kayıtlı açıklamayı gösterir', async () => {
        const first = openModal();
        await screen.findByText('Otel Konaklama Anlaşması');
        await waitFor(() => expect(editorText()).toBe('Kayıtlı açıklama metni'));

        // Persister throttleTime 1000 → yazma gecikmeli; oturum önbelleği dolsun.
        // Lookup'lar saklanır, görev gövdesi SAKLANMAZ.
        await waitFor(() => expect(window.sessionStorage.getItem(CACHE_KEY)).toContain('users-lookup'),
                      { timeout: 4000 });
        expect(window.sessionStorage.getItem(CACHE_KEY)).not.toContain(TASK.title);

        first.unmount();          // modalı kapat (island taskId=null → tüm ağaç sökülür)

        openModal();              // yeniden aç — lookup önbelleği DOLU geliyor
        await screen.findByText('Otel Konaklama Anlaşması');
        await waitFor(() => expect(editorText()).toBe('Kayıtlı açıklama metni'));
    });

    it('görev gövdesi taşıyan ESKİ biçim blob geri yüklenirken de açıklama dolu gelir', async () => {
        const old = new QueryClient();
        old.setQueryData(['task-detail', TASK.id], TASK);
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            buster: 't1:u1',
            timestamp: Date.now(),
            clientState: dehydrate(old),
        }));

        openModal();
        await screen.findByText('Otel Konaklama Anlaşması');
        await waitFor(() => expect(editorText()).toBe('Kayıtlı açıklama metni'));
    });
});
