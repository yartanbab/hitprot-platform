import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskGeneralTabV3 } from './TaskGeneralTabV3';

/**
 * Açıklama editörü contentEditable olduğu için içeriğini MOUNT anında bir kez
 * basar (caret'i korumak için bilinçli). Bu yüzden görev değiştiğinde editörün
 * yeniden kurulması ŞART: aksi halde kullanıcı B görevinde A görevinin metnini
 * görür ve üzerine yazıp kaydettiğinde B'nin açıklamasını A'nınkiyle ezer.
 * (Alt görev panelinden "tam ekran aç" ve "görevi çoğalt" bu yolu kullanıyor.)
 */

const A = { id: 'aaaaaaaa-0000-0000-0000-000000000001', description: '<p>A görevinin açıklaması</p>' };
const B = { id: 'bbbbbbbb-0000-0000-0000-000000000002', description: '<p>B görevinin açıklaması</p>' };

const editorText = () =>
    document.querySelector('[aria-label="Görev açıklaması"]')?.textContent ?? null;

function wrap(task, descriptionValue) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return (
        <QueryClientProvider client={qc}>
            <TaskGeneralTabV3
                task={task}
                descriptionValue={descriptionValue}
                checklist={{ items: [], addItem: vi.fn() }}
            />
        </QueryClientProvider>
    );
}

beforeEach(() => {
    window.apya = {
        platform: { tasks: { task: { getComments: vi.fn(() => Promise.resolve([])) } } },
    };
    window.abp = { notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() } };
});

describe('TaskGeneralTabV3 açıklama editörü', () => {
    it('görev değişince editör yeni görevin açıklamasını gösterir', async () => {
        const view = render(wrap(A, A.description));
        await waitFor(() => expect(editorText()).toBe('A görevinin açıklaması'));

        view.rerender(wrap(B, B.description));
        await waitFor(() => expect(editorText()).toBe('B görevinin açıklaması'));
    });
});
