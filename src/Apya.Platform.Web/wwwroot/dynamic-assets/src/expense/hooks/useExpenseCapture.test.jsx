import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubmitExpense } from './useExpenseCapture';
import { attachReceipt, createExpense } from './expenseApi';

vi.mock('./expenseApi', () => ({
    createExpense: vi.fn(),
    attachReceipt: vi.fn(),
    fetchBudgetLines: vi.fn(),
    fetchCaptureContext: vi.fn(),
}));

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

const payload = { vendor: 'Shell', amount: 250, currency: 'TRY', date: '2026-11-11', cashAccountId: 'k1' };
const photo = new File(['x'], 'image.jpg', { type: 'image/jpeg' });

/*
 * Fiş, gider kaydedildikten SONRA eklenir. Fiş eklenemezse gider geri alınmaz — sahada
 * girilen kayıt kaybolmamalı — ama arayüz bunu söyleyebilsin diye sonuç hatayı taşır.
 */
describe('useSubmitExpense — fiş', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        createExpense.mockResolvedValue({ id: 'gider-1' });
    });

    it('çevrimiçiyken gideri kaydeder, ardından fişi o gidere ekler', async () => {
        attachReceipt.mockResolvedValue(undefined);
        const { result } = renderHook(() => useSubmitExpense(), { wrapper });

        const outcome = await result.current.mutateAsync({ payload, photo });

        expect(attachReceipt).toHaveBeenCalledWith('gider-1', photo, payload);
        expect(outcome).toMatchObject({ queued: false, receiptAttached: true, receiptError: null });
    });

    it('fiş eklenemezse gider kaydedilmiş sayılır ve hata sonuçta döner', async () => {
        attachReceipt.mockRejectedValue(new Error('Dosya türü desteklenmiyor.'));
        const { result } = renderHook(() => useSubmitExpense(), { wrapper });

        const outcome = await result.current.mutateAsync({ payload, photo });

        expect(outcome.result).toEqual({ id: 'gider-1' });
        expect(outcome.receiptAttached).toBe(false);
        expect(outcome.receiptError).toBe('Dosya türü desteklenmiyor.');
    });

    it('fotoğraf verilmezse (belge izni yok) fiş isteği hiç gitmez', async () => {
        const { result } = renderHook(() => useSubmitExpense(), { wrapper });

        await result.current.mutateAsync({ payload, photo: null });

        expect(createExpense).toHaveBeenCalledTimes(1);
        expect(attachReceipt).not.toHaveBeenCalled();
    });
});
