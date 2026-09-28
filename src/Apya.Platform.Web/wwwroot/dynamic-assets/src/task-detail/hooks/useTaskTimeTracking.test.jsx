import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskTimeTracking } from './useTaskTimeTracking';

/**
 * TSK-18: aktif kayıt yokken GetActiveTimeLogAsync null döner → ASP.NET Core 204 →
 * ABP proxy undefined çözer. TanStack v5 undefined veriyi HATA sayar ve son başarılı
 * veriyi (çalışan kaydı) ekranda bırakır: "Sayacı durdur"dan sonra saat işlemeye
 * devam ediyordu.
 */
const TASK_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const RUNNING = {
    id: 'log-1', taskId: TASK_ID, userId: 'u1',
    startTime: '2026-09-28T10:00:00Z', endTime: null,
};

let running;

beforeEach(() => {
    running = true;
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getTimeLogs: vi.fn(() => Promise.resolve([])),
                    /* 204 benzetimi: kayıt yokken proxy undefined çözer. */
                    getActiveTimeLog: vi.fn(() => Promise.resolve(running ? RUNNING : undefined)),
                    startTimeTracking: vi.fn(() => { running = true; return Promise.resolve(); }),
                    stopTimeTracking: vi.fn(() => { running = false; return Promise.resolve(); }),
                },
            },
        },
    };
});

function setup() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const hook = renderHook(() => useTaskTimeTracking(TASK_ID), { wrapper });
    return { client, ...hook };
}

describe('useTaskTimeTracking', () => {
    it('durdurunca uç 204 (undefined) dönse de aktif kayıt null olur', async () => {
        const errorSpy = vi.spyOn(console, 'error');
        const { result } = setup();
        await waitFor(() => expect(result.current.activeLog).toEqual(RUNNING));

        await act(async () => { await result.current.stop(); });

        await waitFor(() => expect(result.current.activeLog).toBeNull());
        expect(window.apya.platform.tasks.task.getActiveTimeLog).toHaveBeenCalledTimes(2);
        const logged = errorSpy.mock.calls.flat().map(String).join(' ');
        expect(logged).not.toMatch(/Query data cannot be undefined/);
    });

    it('canlı sayaç ve zaman kayıtları oturum önbelleğine yazılmaz (meta.persist:false)', async () => {
        const { client, result } = setup();
        await waitFor(() => expect(result.current.activeLog).toEqual(RUNNING));

        const cache = client.getQueryCache();
        expect(cache.find({ queryKey: ['task-active-timelog'] }).meta?.persist).toBe(false);
        expect(cache.find({ queryKey: ['task-timelogs', TASK_ID] }).meta?.persist).toBe(false);
    });
});
