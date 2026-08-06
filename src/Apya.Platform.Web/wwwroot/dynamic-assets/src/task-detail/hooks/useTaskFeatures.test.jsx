import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskFeatures } from './useTaskFeatures';

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
                    getFeatureAssignments: vi.fn(() => Promise.resolve(['checklist'])),
                    addFeature: vi.fn(() => Promise.resolve()),
                    removeFeature: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('useTaskFeatures', () => {
    it('atanmis kodlari yukler', async () => {
        const { result } = renderHook(() => useTaskFeatures(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist']));
        expect(window.apya.platform.tasks.task.getFeatureAssignments).toHaveBeenCalledWith(TASK_ID);
    });

    it('addFeature backend cagirir ve listeyi tazeler', async () => {
        const { result } = renderHook(() => useTaskFeatures(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist']));

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(
            () => Promise.resolve(['checklist', 'comments']),
        );
        await act(async () => { await result.current.addFeature('comments'); });

        expect(window.apya.platform.tasks.task.addFeature).toHaveBeenCalledWith(TASK_ID, 'comments');
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist', 'comments']));
    });

    it('removeFeature backend cagirir ve listeyi tazeler', async () => {
        const { result } = renderHook(() => useTaskFeatures(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist']));

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve([]));
        await act(async () => { await result.current.removeFeature('checklist'); });

        expect(window.apya.platform.tasks.task.removeFeature).toHaveBeenCalledWith(TASK_ID, 'checklist');
        await waitFor(() => expect(result.current.assignedCodes).toEqual([]));
    });
});
