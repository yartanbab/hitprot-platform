import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { isoDay } from '../lib/model';

/**
 * Dış takvim etkinlikleri — iç feed'den AYRI sorgu.
 *
 * Neden ayrı: dış çağrı yavaş ve kırılgan. Aynı sorguya girseydi görevler de
 * Google yanıtı gelene kadar beklerdi ve süresi dolmuş tek bir yetki takvimin
 * tamamını düşürürdü. Ayrı olduğu için grid hemen dolar, etkinlikler geldiğinde
 * üzerine biner (tasarım: "kaynaklar sırayla dolar, grid zıplamaz").
 *
 * Hata YUTULUR: bağlı hesabı olmayan ya da bağlantısı bozuk kullanıcıda takvim
 * çalışmaya devam eder; durum ray satırında gösterilir.
 */
export function useExternalEvents({ from, to, enabled = true }) {
    const fromKey = isoDay(from);
    const toKey = isoDay(to);

    return useQuery({
        queryKey: ['calendar', 'external', fromKey, toKey],
        queryFn: () => api.get(`/api/app/calendar/external-events?From=${fromKey}&To=${toKey}`),
        enabled,
        staleTime: 120_000,
        retry: false,
        placeholderData: (previous) => previous,
    });
}
