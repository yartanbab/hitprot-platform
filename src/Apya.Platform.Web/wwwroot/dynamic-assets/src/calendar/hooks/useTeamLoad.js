import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { isoDay } from '../lib/model';

/**
 * Ekip yükü — yalnız katman AÇIKKEN sorgulanır (`enabled`).
 * Kapalıyken sorgu atmak, kimsenin bakmadığı bir kırılım için her ay
 * gezinmesinde fazladan istek demekti.
 */
export function useTeamLoad({ from, to, enabled }) {
    const fromKey = isoDay(from);
    const toKey = isoDay(to);

    return useQuery({
        queryKey: ['calendar', 'team-load', fromKey, toKey],
        queryFn: () => api.get(`/api/app/calendar/team-load?From=${fromKey}&To=${toKey}`),
        enabled,
        staleTime: 60_000,
    });
}
