import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { useOptimisticListMutation } from '../../lib/api/optimisticList';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.riskAlerts();

export function useRiskAlerts() {
    return useQuery({
        queryKey: QK.dashboard.risks(),
        queryFn:  fetcher,
    });
}

/* Dismiss/Accept — optimistic UI; hata durumunda factory rollback + toast.
   Risk dismiss "Geri al" göstermiyor (kullanıcı kasten yok saydı; gürültü olur). */

export function useDismissRisk() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.risks(),
        mutationFn: (risk) => fixtures.dismissRisk(risk),
        errorMessage: 'Uyarı reddedilemedi',
    });
}

export function useAcceptRisk() {
    return useOptimisticListMutation({
        queryKey: QK.dashboard.risks(),
        mutationFn: (risk) => fixtures.acceptRisk(risk),
        undoMessage: (risk) => `Uygulandı: ${risk.title}`,
        undoFn: (risk) => fixtures.dismissRisk(risk),
        errorMessage: 'Aksiyon uygulanamadı',
    });
}
