import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { QK } from '../../lib/api/queryClient';

/**
 * Kart düzeni — kullanıcı bazlı, SUNUCUDA saklanır (AppDashboardLayouts).
 * Kayıt yoksa sunucu görünümün yerleşik varsayılanını `isDefault: true` ile döner.
 *
 * localStorage KULLANILMAZ: düzen cihazlar arası taşınmalı. Yalnız aktif görünüm
 * sekmesi lokalde tutulur (bkz viewPresets).
 */

export function useDashboardLayout(viewKey) {
    return useQuery({
        queryKey: QK.dashboard.layout(viewKey),
        queryFn: () => api.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(viewKey)}`),
        /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
        staleTime: 5 * 60_000,
        enabled: Boolean(viewKey),
    });
}

export function useSaveLayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ viewKey, cards }) =>
            api.put('/api/dashboard/layout', { viewKey, cards }),
        onSuccess: (_data, { viewKey }) => {
            queryClient.invalidateQueries({ queryKey: QK.dashboard.layout(viewKey) });
        },
    });
}

export function useResetLayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (viewKey) =>
            api.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(viewKey)}`),
        onSuccess: (_data, viewKey) => {
            queryClient.invalidateQueries({ queryKey: QK.dashboard.layout(viewKey) });
        },
    });
}
