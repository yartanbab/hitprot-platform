import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.cashFlow();

export function useCashFlow() {
    return useQuery({
        queryKey: QK.dashboard.cashflow(),
        queryFn:  fetcher,
    });
}
