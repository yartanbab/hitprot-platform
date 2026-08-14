import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './httpClient';

/**
 * Shared QueryClient — sane enterprise defaults.
 * - staleTime: 30s (UI feels live, server pressure düşük)
 * - gcTime: 5 dk (geri navigasyon hızlı)
 * - retry: 4xx hata için RETRY YOK (idempotency riski + UX yavaşlığı)
 * - refetchOnWindowFocus: true (kullanıcı tab'a dönünce taze veri)
 */
export function createApyaQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                gcTime: 5 * 60_000,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
                retry: (failureCount, error) => {
                    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                        return false;
                    }
                    return failureCount < 2;
                },
            },
            mutations: {
                /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
                retry: false,
            },
        },
    });
}

/**
 * Query key konvansiyonu — hierarchical, JSON-serializable.
 *   ['dashboard', 'budget']
 *   ['dashboard', 'approvals', { status: 'pending' }]
 *   ['ledger', 'account', accountId]
 *
 * Invalidation kuralları:
 *   - SignalR `JournalEntryPosted` → invalidate ['ledger'], ['dashboard', 'budget'], ['dashboard', 'cashflow']
 *   - SignalR `ApprovalDecided` → invalidate ['dashboard', 'approvals']
 */
export const QK = {
    dashboard: {
        /* Desen: ['dashboard', <bölüm>, { range, projectId }] — filtre değişince
           yeni key, eski veri cache'te kalır (sekme geçişi anında). */
        summary:        (f) => ['dashboard', 'summary', f],
        deliveries:     (f) => ['dashboard', 'deliveries', f],
        projectHealth:  (f) => ['dashboard', 'project-health', f],
        approvals:      () => ['dashboard', 'pending-approvals'],
        blockedTasks:   () => ['dashboard', 'blocked-tasks'],
        statistics:     (f) => ['dashboard', 'statistics', f],
        incomeExpense:  (f) => ['dashboard', 'income-expense', f],
        deliveryHeatmap:(f) => ['dashboard', 'delivery-heatmap', f],
        layout:         (viewKey) => ['dashboard', 'layout', viewKey],
        aiSuggestions: (scope) => scope ? ['dashboard', 'ai-suggestions', scope] : ['dashboard', 'ai-suggestions'],
    },
};
