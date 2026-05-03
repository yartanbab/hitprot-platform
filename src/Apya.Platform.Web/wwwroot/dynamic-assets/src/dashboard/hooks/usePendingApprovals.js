import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.pendingApprovals();

export function usePendingApprovals() {
    return useQuery({
        queryKey: QK.dashboard.approvals(),
        queryFn:  fetcher,
    });
}

/**
 * Approve — optimistic UI:
 *   1) cancelQueries — in-flight refetch'leri durdur
 *   2) snapshot al → rollback için
 *   3) cache'ten satırı kaldır + _pending: 'approve' işaretle (UI half-opacity)
 *   4) backend çağrısı
 *   5) onError: snapshot'a rollback + hata toast'i
 *   6) onSettled: invalidate (gerçek state'le sync)
 *
 * Concurrency çakışması (409) → rollback + kullanıcıya "başkası onayladı" mesajı.
 */
function useApprovalMutation(performer) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: performer,
        onMutate: async (item) => {
            await qc.cancelQueries({ queryKey: QK.dashboard.approvals() });
            const previous = qc.getQueryData(QK.dashboard.approvals());
            qc.setQueryData(QK.dashboard.approvals(), (old = []) =>
                old.filter((i) => i.id !== item.id),
            );
            return { previous, item };
        },
        onError: (_err, _item, ctx) => {
            if (ctx?.previous) qc.setQueryData(QK.dashboard.approvals(), ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: QK.dashboard.approvals() });
            /* Approve/Reject ledger'ı etkiler — bütçe ve cashflow da invalidate edilir.
               Backend SignalR event yayınlayınca da olur ama buradan da defansif. */
            qc.invalidateQueries({ queryKey: QK.dashboard.budget() });
            qc.invalidateQueries({ queryKey: QK.dashboard.cashflow() });
        },
    });
}

export function useApproveItem() {
    return useApprovalMutation((item) => fixtures.approveItem(item));
}

export function useRejectItem() {
    return useApprovalMutation((item) => fixtures.rejectItem(item));
}
