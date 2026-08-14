import React from 'react';
import { CardShell } from './CardShell';
import { GroupedBar } from '../charts';
import { useIncomeExpense } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { formatMoneyCompact } from '../../lib/utils';
import { t } from '../../lib/i18n';

/** Gelir / gider — 6 ay, taşan gruplu bar. */
function IncomeExpenseCard({ filter, editMode }) {
    const query = useIncomeExpense(filter);
    const data = query.data;
    const points = data?.points ?? [];
    const hasValues = points.some((p) => p.income > 0 || p.expense > 0);

    return (
        <CardShell
            editMode={editMode}
            bleed
            title={t('Dashboard:IncomeExpense:Title', 'Gelir / gider')}
            subtitle={t('Dashboard:IncomeExpense:Subtitle', 'Son 6 ay')}
            actions={
                <div className="flex items-center gap-2.5 text-[11px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-positive-500" />
                        {t('Dashboard:IncomeExpense:Income', 'Gelir')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-negative-500/45" />
                        {t('Dashboard:IncomeExpense:Expense', 'Gider')}
                    </span>
                </div>
            }
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={!hasValues}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:IncomeExpense:EmptyTitle', 'Kayıtlı hareket yok')}
                    description={t('Dashboard:IncomeExpense:EmptyDescription', 'Son 6 ayda gelir veya gider kaydı bulunmuyor.')}
                />
            }
            bodyClassName="flex flex-col gap-2.5"
        >
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-2xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums">
                    {formatMoneyCompact(data?.net ?? 0, data?.currency)}
                </span>
                <span className="text-[11.5px] text-text-tertiary">
                    {t('Dashboard:IncomeExpense:Net', 'net')}
                </span>
            </div>

            {/* Taşan grafik: kartın yatay padding'ini iptal eder, alt kenara yapışır. */}
            <div className="h-[82px] -mx-[18px] mt-auto">
                <GroupedBar
                    groups={points.map((p) => ({ values: [p.income, p.expense] }))}
                    ariaLabel={t('Dashboard:IncomeExpense:ChartLabel', 'Aylık gelir ve gider')}
                />
            </div>
        </CardShell>
    );
}

export { IncomeExpenseCard };
