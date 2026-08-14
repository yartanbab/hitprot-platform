import React from 'react';
import { CardShell } from './CardShell';
import { usePendingApprovals } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { formatMoney } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * "Bende bekleyen kararlar" — taslak faturalar.
 *
 * Satır içi onay/red YOKTUR (tasarım kuralı: aksiyon = navigasyon). Platformda
 * bir onay iş akışı da yok; kaynak taslak faturalardır.
 */
function ApprovalsCard({ editMode }) {
    const query = usePendingApprovals();
    const items = query.data ?? [];

    const total = items.reduce((sum, i) => sum + (i.amount ?? 0), 0);
    const avgAge = items.length
        ? Math.round(items.reduce((sum, i) => sum + i.ageHours, 0) / items.length)
        : 0;
    const currency = items[0]?.currency ?? 'TRY';

    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Approvals:Title', 'Bende bekleyen kararlar')}
            badge={items.length > 0 && (
                <span className="font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-warning-50 text-warning-700 tabular-nums flex-none">
                    {items.length}
                </span>
            )}
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={items.length === 0}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Approvals:EmptyTitle', 'Karar bekleyen yok')}
                    description={t('Dashboard:Approvals:EmptyDescription', 'Taslak durumdaki fatura bulunmuyor.')}
                    action={
                        <a href="/Invoices" className="text-[12.5px] font-medium text-text-link hover:underline">
                            {t('Dashboard:Approvals:OpenInvoices', 'Faturaları aç →')}
                        </a>
                    }
                />
            }
            footer={items.length > 0 && (
                /* Satır başlıkları serbest metin olduğu için kırpılabilir, ama bu
                   özet SABİT biçimli — dar kartta kırpmak yerine alt satıra sarsın. */
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11.5px] text-text-tertiary">
                        {t('Dashboard:Approvals:Total', 'Toplam {0} · ort. bekleme {1} sa', formatMoney(total, currency), avgAge)}
                    </span>
                    <a href="/Invoices" className="text-[12.5px] font-medium text-text-link hover:underline flex-none">
                        {t('Dashboard:Approvals:Queue', 'Onay kuyruğu →')}
                    </a>
                </div>
            )}
        >
            <ul className="flex flex-col">
                {items.slice(0, 4).map((item, index) => (
                    <li
                        key={item.id}
                        /* Tutar ve "İncele" flex-none — dar kartta metin sütunu
                           127px'e eziliyordu (ölçüldü). Taban genişlik + sarma. */
                        className="flex flex-wrap items-center gap-2.5 py-2 border-b border-subtle last:border-b-0"
                    >
                        <span className="flex-1 min-w-[150px] flex flex-col gap-0.5">
                            <span className="text-[12.5px] font-medium text-text-primary truncate">
                                {item.title}
                            </span>
                            <span className="text-[11px] text-text-tertiary truncate">
                                {t('Dashboard:Approvals:Meta', 'Fatura · {0} · {1} sa', item.requesterName || '—', item.ageHours)}
                            </span>
                        </span>
                        <span className="font-mono text-xs font-semibold text-text-primary tabular-nums flex-none">
                            {formatMoney(item.amount, item.currency)}
                        </span>
                        <a
                            href={item.targetUrl}
                            className="text-xs font-medium text-text-link hover:underline flex-none"
                        >
                            {t('Dashboard:Approvals:Review', 'İncele →')}
                        </a>
                    </li>
                ))}
            </ul>
        </CardShell>
    );
}

export { ApprovalsCard };
