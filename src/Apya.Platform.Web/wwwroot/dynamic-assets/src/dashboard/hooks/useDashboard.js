import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/httpClient';
import { QK } from '../../lib/api/queryClient';

/**
 * Dashboard okuma hook'ları — hepsi /api/dashboard/* uçlarından beslenir.
 *
 * Her bölüm KENDİ query key'ine sahiptir; bir kartın hatası diğerlerini
 * düşürmez ve SignalR köprüsü yalnız ilgili bölümü invalidate eder.
 *
 * staleTime: genel 60s, finansal uçlarda 30s (para hareketi daha çabuk bayatlar).
 */

const STALE_DEFAULT = 60_000;
const STALE_FINANCIAL = 30_000;

/** DashboardQueryDto'ya karşılık gelen query string. Boş alanlar gönderilmez. */
function toQueryString({ range, projectId } = {}) {
    const params = new URLSearchParams();
    if (range) params.set('range', range);
    if (projectId) params.set('projectId', projectId);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

const get = (section, filter) =>
    api.get(`/api/dashboard/${section}${toQueryString(filter)}`);

export function useSummary(filter) {
    return useQuery({
        queryKey: QK.dashboard.summary(filter),
        queryFn: () => get('summary', filter),
        staleTime: STALE_FINANCIAL, /* bütçe alanları içeriyor */
    });
}

export function useDeliveries(filter) {
    return useQuery({
        queryKey: QK.dashboard.deliveries(filter),
        queryFn: () => get('deliveries', filter),
        staleTime: STALE_DEFAULT,
    });
}

export function useProjectHealth(filter) {
    return useQuery({
        queryKey: QK.dashboard.projectHealth(filter),
        queryFn: () => get('project-health', filter),
        staleTime: STALE_DEFAULT,
    });
}

export function usePendingApprovals() {
    return useQuery({
        queryKey: QK.dashboard.approvals(),
        queryFn: () => get('pending-approvals'),
        staleTime: STALE_FINANCIAL,
    });
}

export function useBlockedTasks() {
    return useQuery({
        queryKey: QK.dashboard.blockedTasks(),
        queryFn: () => get('blocked-tasks'),
        staleTime: STALE_DEFAULT,
    });
}

export function useStatistics(filter) {
    return useQuery({
        queryKey: QK.dashboard.statistics(filter),
        queryFn: () => get('statistics', filter),
        staleTime: STALE_DEFAULT,
    });
}

export function useIncomeExpense(filter) {
    return useQuery({
        queryKey: QK.dashboard.incomeExpense(filter),
        queryFn: () => get('income-expense', filter),
        staleTime: STALE_FINANCIAL,
    });
}

export function useDeliveryHeatmap(filter) {
    return useQuery({
        queryKey: QK.dashboard.deliveryHeatmap(filter),
        queryFn: () => get('delivery-heatmap', filter),
        staleTime: STALE_DEFAULT,
    });
}
