import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskAttachments } from './useTaskAttachments';

const TASK_ID = 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5';

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getAttachments: vi.fn(() => Promise.resolve([
                        { id: 'att-1', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/x', uploaderName: 'ali' },
                    ])),
                    deleteAttachment: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
    global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ success: true, storedFileName: 'stored-x.pdf' }),
    }));
    document.head.innerHTML = '<meta name="__RequestVerificationToken" content="tok-123">';
});

describe('useTaskAttachments', () => {
    it('ekleri yukler', async () => {
        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));
        expect(window.apya.platform.tasks.task.getAttachments).toHaveBeenCalledWith(TASK_ID);
    });

    it('upload dogru URL ve antiforgery header ile fetch cagirir', async () => {
        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));

        const file = new File(['x'], 'yeni.pdf', { type: 'application/pdf' });
        await act(async () => { await result.current.upload(file); });

        expect(global.fetch).toHaveBeenCalledWith(
            `/api/tasks/attachments/upload/${TASK_ID}`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ RequestVerificationToken: 'tok-123' }),
            }),
        );
    });

    it('remove deleteAttachment cagirir ve listeyi tazeler', async () => {
        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));

        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([]));
        await act(async () => { await result.current.remove('att-1'); });

        expect(window.apya.platform.tasks.task.deleteAttachment).toHaveBeenCalledWith('att-1');
        await waitFor(() => expect(result.current.attachments).toHaveLength(0));
    });

    it('basarisiz upload (success:false) hata firlatir', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve({ success: false, error: 'Dosya cok buyuk.' }),
        }));

        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));

        const file = new File(['x'], 'buyuk.pdf', { type: 'application/pdf' });
        await expect(result.current.upload(file)).rejects.toThrow('Dosya cok buyuk.');
    });
});
