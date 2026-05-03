import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.riskAlerts();

export function useRiskAlerts() {
    return useQuery({
        queryKey: QK.dashboard.risks(),
        queryFn:  fetcher,
    });
}

/**
 * Dismiss/Accept — optimistic UI: ilgili risk listeden anında kalkar.
 * Hata durumunda rollback + toast.
 */
function useRiskMutation(performer) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: performer,
        onMutate: async (risk) => {
            await qc.cancelQueries({ queryKey: QK.dashboard.risks() });
            const previous = qc.getQueryData(QK.dashboard.risks());
            qc.setQueryData(QK.dashboard.risks(), (old = []) =>
                old.filter((r) => r.id !== risk.id),
            );
            return { previous };
        },
        onError: (_err, _risk, ctx) => {
            if (ctx?.previous) qc.setQueryData(QK.dashboard.risks(), ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: QK.dashboard.risks() });
        },
    });
}

export function useDismissRisk() {
    return useRiskMutation((risk) => fixtures.dismissRisk(risk));
}

export function useAcceptRisk() {
    return useRiskMutation((risk) => fixtures.acceptRisk(risk));
}
