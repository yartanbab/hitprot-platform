import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';

/**
 * Takvim tercihleri: kapasite, açık kaynaklar, kurulum durumu.
 *
 * localStorage'daki kaynak seçimi O CİHAZIN geçici tercihidir; buradaki değer
 * kullanıcıya aittir ve cihazlar arası taşınır. Kurulum sihirbazı buraya yazar.
 */
const KEY = ['calendar', 'preferences'];

export function useCalendarPreferences() {
    return useQuery({
        queryKey: KEY,
        queryFn: () => api.get('/api/app/calendar/preferences'),
        staleTime: 5 * 60_000,
    });
}

export function useUpdatePreferences() {
    const queryClient = useQueryClient();
    return useMutation({
        /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
           ayarlar SESSİZCE kaydedilmemiş olur. */
        mutationFn: (input) => api.put('/api/app/calendar/preferences', input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            /* Kapasite değişti → gün yükü çubukları ve aşım uyarısı yeniden hesaplanmalı. */
            queryClient.invalidateQueries({ queryKey: ['calendar', 'feed'] });
        },
    });
}

/**
 * Toplu erteleme. Sonuç SATIR SATIR döner: biri başarısız olsa da diğerleri
 * uygulanmış kalır, hata o satırda gösterilir.
 */
export function useBulkReschedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (items) => api.post('/api/app/calendar/bulk-reschedule', items),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['calendar', 'feed'] }),
    });
}
