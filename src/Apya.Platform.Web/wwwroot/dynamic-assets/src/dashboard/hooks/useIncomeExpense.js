import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.incomeExpense();

export function useIncomeExpense() {
    return useQuery({
        queryKey: QK.dashboard.incomeExpense(),
        queryFn:  fetcher,
    });
}
