import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

/* Backend hazır olunca: const fetcher = () => api.get('/api/dashboard/budget-summary'); */
const fetcher = () => fixtures.budgetSummary();

export function useBudgetSummary() {
    return useQuery({
        queryKey: QK.dashboard.budget(),
        queryFn:  fetcher,
    });
}
