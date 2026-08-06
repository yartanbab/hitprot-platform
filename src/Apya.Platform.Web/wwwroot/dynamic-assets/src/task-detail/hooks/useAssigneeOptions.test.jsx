import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAssigneeOptions } from './useAssigneeOptions';

const USERS = {
    items: [
        { id: 'u1', userName: 'ybaba', name: 'Yakup', surname: 'Babaoğlu' },
        { id: 'u2', userName: 'noname', name: null, surname: null },
    ],
};

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
    window.apya = { platform: { tasks: { task: { getUsersLookup: vi.fn(() => Promise.resolve(USERS)) } } } };
});

describe('useAssigneeOptions', () => {
    it('yüklenirken isLoading true, boş options döner', () => {
        const { result } = renderHook(() => useAssigneeOptions(), { wrapper });
        expect(result.current.isLoading).toBe(true);
        expect(result.current.options).toEqual([]);
    });

    it('ad+soyad varsa combobox etiketi olarak birleştirir', async () => {
        const { result } = renderHook(() => useAssigneeOptions(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.options).toEqual([
            { value: 'u1', label: 'Yakup Babaoğlu' },
            { value: 'u2', label: 'noname' },
        ]);
    });

    it('nameById ile id\'den isme çözümleme yapılabilir', async () => {
        const { result } = renderHook(() => useAssigneeOptions(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.nameById.get('u1')).toBe('Yakup Babaoğlu');
        expect(result.current.nameById.get('u2')).toBe('noname');
        expect(result.current.nameById.get('unknown')).toBeUndefined();
    });
});
