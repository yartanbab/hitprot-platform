import { useMemo } from 'react';
import { QK } from '../lib/api/queryClient';
import { useSignalRInvalidation } from '../lib/realtime/useSignalRInvalidation';
import { useConflictListener } from '../lib/realtime/useConflictListener';

/**
 * Dashboard SignalR → cache invalidation + conflict toast köprüsü.
 *
 * İki farklı kanal:
 *   1) invalidation: "veri değişti, sessizce tazele" (refetchOnInvalidate)
 *   2) conflict:     "senin yapmaya çalıştığın işlem başkası tarafından yapıldı"
 *      → kullanıcıya warning toast + "Yenile" CTA + arka planda invalidate
 */
export function DashboardRealtimeBridge() {
    const invalidations = useMemo(() => ([
        ['JournalEntryPosted', [QK.dashboard.budget(), QK.dashboard.cashflow()]],
        ['ApprovalDecided',    [QK.dashboard.approvals(), QK.dashboard.budget(), QK.dashboard.cashflow()]],
        ['RiskDetected',       [QK.dashboard.risks()]],
        ['RiskDismissed',      [QK.dashboard.risks()]],
        ['AISuggestionPosted', [QK.dashboard.aiSuggestions()]],
    ]), []);

    const conflicts = useMemo(() => ([
        ['ApprovalConflict', {
            queryKeys: [QK.dashboard.approvals(), QK.dashboard.budget(), QK.dashboard.cashflow()],
            message: 'Onay kaydında çakışma',
            description: 'Bu kayıt başka bir kullanıcı tarafından işlendi.',
        }],
        ['BudgetConflict', {
            queryKeys: [QK.dashboard.budget()],
            message: 'Bütçe kaydında çakışma',
            description: 'Aynı bütçeyi başka bir kullanıcı güncelledi.',
        }],
        ['SuggestionConflict', {
            queryKeys: [QK.dashboard.aiSuggestions()],
            message: 'AI önerisinde çakışma',
            description: 'Bu öneri başka bir kullanıcı tarafından uygulanmış.',
        }],
    ]), []);

    useSignalRInvalidation(invalidations);
    useConflictListener(conflicts);
    return null;
}
