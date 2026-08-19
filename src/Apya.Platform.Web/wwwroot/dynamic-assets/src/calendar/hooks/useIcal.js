import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';

/**
 * iCal: dışa abonelik bağlantısı + içeri .ics abonelikleri.
 * Her ikisi de yalnız senkron drawer'ı açıkken sorgulanır.
 */
const FEED_KEY = ['calendar', 'ical-feed'];
const SUBS_KEY = ['calendar', 'ical-subscriptions'];

export function useIcalFeedLink(enabled) {
    return useQuery({
        queryKey: FEED_KEY,
        /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
        queryFn: () => api.post('/api/app/ical-feed/ensure', {}),
        enabled,
        staleTime: Infinity,
    });
}

export function useRegenerateIcalFeed() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.post('/api/app/ical-feed/regenerate', {}),
        onSuccess: (data) => queryClient.setQueryData(FEED_KEY, data),
    });
}

export function useIcalSubscriptions(enabled) {
    return useQuery({
        queryKey: SUBS_KEY,
        queryFn: () => api.get('/api/app/ical-subscription'),
        enabled,
        staleTime: 30_000,
    });
}

export function useAddIcalSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => api.post('/api/app/ical-subscription', input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBS_KEY });
            /* Yeni takvim hemen görünsün. */
            queryClient.invalidateQueries({ queryKey: ['calendar', 'external'] });
        },
    });
}

export function useDeleteIcalSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/api/app/ical-subscription/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBS_KEY });
            queryClient.invalidateQueries({ queryKey: ['calendar', 'external'] });
        },
    });
}

/** Adresi kaydetmeden dener — "38 etkinlik bulundu" satırı için. */
export function useProbeIcal() {
    return useMutation({
        mutationFn: (url) => api.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(url)}`, {}),
    });
}
