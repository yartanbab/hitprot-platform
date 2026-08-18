import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { isoDay } from '../lib/model';

/**
 * Takvim verisi — TEK uçtan: CalendarAppService.GetFeedAsync (/api/app/calendar/feed).
 *
 * Aralık değişince yeni query key doğar, eski veri cache'te kalır: ay ileri/geri
 * gezinmesi ikinci ziyarette anında açılır (grid zıplamaz, iskelet yalnız ilk
 * yüklemede görünür).
 *
 * Kaynak süzgeci sunucuya GÖNDERİLMEZ: kapatılan kaynak istemcide gizlenir, böylece
 * ray anahtarları ağ isteği doğurmaz ve sayaçlar (kaç öğe var) doğru kalır.
 */

const STALE = 60_000;

export function useCalendarFeed({ from, to }) {
    const fromKey = isoDay(from);
    const toKey = isoDay(to);

    return useQuery({
        queryKey: ['calendar', 'feed', fromKey, toKey],
        queryFn: () => api.get(`/api/app/calendar/feed?From=${fromKey}&To=${toKey}`),
        staleTime: STALE,
        placeholderData: (previous) => previous, /* ay geçişinde boş ekran yerine eski veri */
    });
}
