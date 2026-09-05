import { useQuery } from '@tanstack/react-query';
import { isGranted } from './useTaskDetail';

/**
 * Görevin projesindeki bütçe kalemleri — "Bütçe bağı" kartının seçicisi için.
 *
 * Yeni uç AÇMIYORUZ: gelir/gider modallerinin kullandığı lookup'ın aynısı
 * (bkz. wwwroot/js/apya-finance-modal.js). Böylece görevden ve finans
 * modalinden görülen kalem listesi tek kaynaktan gelir.
 *
 * Servis `Projects.ViewBudget` iznine bağlı; izin yoksa çağrı HİÇ yapılmaz —
 * koşulsuz çağrı, izni olmayan kullanıcıda sekmeyi 403 ile düşürürdü.
 */
function fetchLookup(projectId) {
    const svc = window?.apya?.platform?.projectBudgets?.projectBudget;
    if (!svc?.getRecordFormLookup) return Promise.reject(new Error('Bütçe servisi yüklenmedi.'));
    return Promise.resolve(svc.getRecordFormLookup(projectId));
}

export function useProjectBudgetLines(projectId) {
    const canViewBudget = isGranted('Platform.Projects.ViewBudget');

    const query = useQuery({
        queryKey: ['task-detail', 'budget-lines', projectId],
        queryFn: () => fetchLookup(projectId),
        enabled: Boolean(projectId) && canViewBudget,
        staleTime: 60_000,
        retry: false,
    });

    const lines = query.data?.lines ?? [];

    return {
        lines,
        options: lines.map((l) => ({ value: l.id, label: l.code ? `${l.code} · ${l.name}` : l.name })),
        canViewBudget,
        isLoading: query.isLoading,
    };
}
