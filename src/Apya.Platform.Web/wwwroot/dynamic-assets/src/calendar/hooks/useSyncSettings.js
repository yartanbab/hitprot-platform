import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';

/**
 * Senkron ayarları — hesap kuralları ve senkron günlüğü.
 *
 * Drawer açılana kadar SORGULANMAZ (`enabled`): takvimin ilk açılışı bir ayar
 * ekranının verisini beklemesin.
 */
const KEY = ['calendar', 'sync-settings'];

export function useSyncSettings(enabled) {
    return useQuery({
        queryKey: KEY,
        queryFn: () => api.get('/api/app/calendar/sync-settings'),
        enabled,
        staleTime: 30_000,
    });
}

export function useUpdateSyncRules() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input) => api.post('/api/app/calendar/sync-rules', input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            /* Kural değişince dış etkinlik katmanı da bayatlar. */
            queryClient.invalidateQueries({ queryKey: ['calendar', 'external'] });
        },
    });
}
