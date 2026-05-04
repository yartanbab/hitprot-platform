import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { useOptimisticListMutation } from '../../lib/api/optimisticList';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.pendingApprovals();

export function usePendingApprovals() {
    return useQuery({
        queryKey: QK.dashboard.approvals(),
        queryFn:  fetcher,
    });
}

/**
 * Approve / Reject — optimistic UI:
 *   - Satır cache'ten anında düşer.
 *   - Onay/red başarılı → "Geri al" toast'i 10s görünür (undo restore + reverse call).
 *   - 409 → rollback + "Yenile" CTA toast'i (başkası onaylamış).
 *
 * Approve ledger'ı etkiler — extraInvalidations'la budget/cashflow tazelenir.
 * Backend SignalR de yayar; bu defansif. */

export function useApproveItem() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.approvals(),
        mutationFn: (item) => fixtures.approveItem(item),
        extraInvalidations: [QK.dashboard.budget(), QK.dashboard.cashflow()],
        undoMessage: (item) => `${item.title} onaylandı`,
        undoFn: (item) => fixtures.rejectItem(item),  /* "geri al" = ters yöne kaydet */
        errorMessage: 'Onay başarısız oldu',
    });
}

export function useRejectItem() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.approvals(),
        mutationFn: (item) => fixtures.rejectItem(item),
        extraInvalidations: [QK.dashboard.budget(), QK.dashboard.cashflow()],
        undoMessage: (item) => `${item.title} reddedildi`,
        undoFn: (item) => fixtures.approveItem(item),
        errorMessage: 'Reddetme başarısız oldu',
    });
}
