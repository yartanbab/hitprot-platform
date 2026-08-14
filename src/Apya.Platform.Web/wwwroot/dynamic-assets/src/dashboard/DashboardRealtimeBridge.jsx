import { useMemo } from 'react';
import { QK } from '../lib/api/queryClient';
import { useSignalRInvalidation } from '../lib/realtime/useSignalRInvalidation';
import { useConflictListener } from '../lib/realtime/useConflictListener';

/**
 * Dashboard SignalR → cache invalidation köprüsü.
 *
 * Bölüm key'leri filtre taşıdığı için (['dashboard','summary',{range,projectId}])
 * PREFIX ile invalidate edilir: aktif olmayan aralıkların cache'i de bayatlasın,
 * kullanıcı sekme değiştirince taze veri gelsin.
 */
const prefix = (section) => ['dashboard', section];

export function DashboardRealtimeBridge() {
    const invalidations = useMemo(() => ([
        /* Görev durumu değişti → teslimler, tıkananlar, özet, ısı takvimi, istatistik */
        ['TaskStatusChanged', [
            prefix('summary'), prefix('deliveries'), prefix('blocked-tasks'),
            prefix('delivery-heatmap'), prefix('statistics'), prefix('project-health'),
        ]],
        /* Atama değişti → tıkanma sebebi "atanmamış" olabilir */
        ['TaskAssigned', [prefix('blocked-tasks'), prefix('deliveries')]],

        /* Onay kuyruğu (taslak fatura) hareketi */
        ['ApprovalCreated',  [prefix('pending-approvals'), prefix('summary'), prefix('statistics')]],
        ['ApprovalResolved', [prefix('pending-approvals'), prefix('summary'), prefix('statistics')]],

        /* Bütçe / muhasebe hareketi → bütçe oranları ve finans istatistikleri */
        ['BudgetUpdated',      [prefix('summary'), prefix('project-health'), prefix('statistics')]],
        ['JournalEntryPosted', [prefix('income-expense'), prefix('statistics')]],

        /* Hibe belgesi son tarihi → ısı takviminin sarı günleri */
        ['GrantDocumentDue', [prefix('delivery-heatmap'), prefix('statistics')]],
    ]), []);

    const conflicts = useMemo(() => ([
        ['BudgetConflict', {
            queryKeys: [prefix('summary'), prefix('project-health')],
            message: 'Bütçe kaydında çakışma',
            description: 'Aynı bütçeyi başka bir kullanıcı güncelledi.',
        }],
    ]), []);

    useSignalRInvalidation(invalidations);
    useConflictListener(conflicts);
    return null;
}
