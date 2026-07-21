import { useQuery } from '@tanstack/react-query';
import { QK } from '../../lib/api/queryClient';
import { fixtures } from './fixtures';

const fetcher = () => fixtures.kpiSummary();

export function useKpiSummary() {
    return useQuery({
        queryKey: QK.dashboard.kpiSummary(),
        queryFn:  fetcher,
    });
}
