import { useMemo } from 'react';
import { QK } from '../lib/api/queryClient';
import { useSignalRInvalidation } from '../lib/realtime/useSignalRInvalidation';

/**
 * Dashboard SignalR → cache invalidation köprüsü.
 * useEffect içinde mappings reference stable olsun diye useMemo.
 */
export function DashboardRealtimeBridge() {
    const mappings = useMemo(() => ([
        ['JournalEntryPosted', [QK.dashboard.budget(), QK.dashboard.cashflow()]],
        ['ApprovalDecided',    [QK.dashboard.approvals(), QK.dashboard.budget(), QK.dashboard.cashflow()]],
        ['RiskDetected',       [QK.dashboard.risks()]],
        ['RiskDismissed',      [QK.dashboard.risks()]],
    ]), []);

    useSignalRInvalidation(mappings);
    return null;
}
