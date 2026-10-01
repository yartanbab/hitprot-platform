import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TimeTrackingTabV3 } from './OtherFeaturesTabV3';

/**
 * Zaman Takibi — sayaç başlat/durdur hatası ortak kanaldan (lib/api/abpErrors) bildirilir.
 * Canlı doğrulama L1-07: oturum düşmüşken "Süre başlat", merkezi oturum penceresinin yanında
 * ikinci bir toast ("Zaman takibi güncellenemedi.") açıyordu (çift kanal).
 */
const TASK_ID = 'aaaaaaaa-0000-0000-0000-000000000001';

let svc;

beforeEach(() => {
    svc = {
        getTimeLogs: vi.fn(() => Promise.resolve([])),
        getActiveTimeLog: vi.fn(() => Promise.resolve(null)),
        startTimeTracking: vi.fn(() => Promise.resolve()),
        stopTimeTracking: vi.fn(() => Promise.resolve()),
    };
    window.apya = { platform: { tasks: { task: svc } } };
    window.abp = { notify: { error: vi.fn() } };
});

afterEach(() => {
    delete window.abp;
});

function renderTab() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <TimeTrackingTabV3 taskId={TASK_ID} task={{ id: TASK_ID }} />
        </QueryClientProvider>,
    );
}

const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });

describe('TimeTrackingTabV3 — hata bildirimi ortak kanaldan (STA-10)', () => {
    it('merkezi oturum penceresine gitmiş hata (401) için ikinci toast açılmaz', async () => {
        svc.startTimeTracking.mockImplementation(() => Promise.reject(
            Object.assign(new Error('Oturumunuz sona erdi.'), { status: 401, apyaShown: true, apyaCentral: true }),
        ));
        renderTab();

        fireEvent.click(screen.getByRole('button', { name: 'Süre başlat' }));

        await waitFor(() => expect(svc.startTimeTracking).toHaveBeenCalledWith(TASK_ID));
        await settle();
        await settle();
        expect(window.abp.notify.error).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Süre başlat' })).toBeEnabled();
    });

    it('gösterilmemiş hata tek bildirimle gider', async () => {
        svc.startTimeTracking.mockImplementation(() => Promise.reject(new Error('Başka bir aktif sayaç var.')));
        renderTab();

        fireEvent.click(screen.getByRole('button', { name: 'Süre başlat' }));

        await waitFor(() => expect(window.abp.notify.error.mock.calls).toEqual([['Başka bir aktif sayaç var.']]));
    });
});
