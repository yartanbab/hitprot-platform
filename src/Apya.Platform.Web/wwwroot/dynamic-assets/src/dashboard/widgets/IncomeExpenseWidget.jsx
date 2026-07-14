import React from 'react';
import { WidgetShell } from './WidgetShell';
import { SkeletonChart } from '../../components/ui';
import { formatMoneyCompact } from '../../lib/utils';
import { useIncomeExpense } from '../hooks/useIncomeExpense';

/**
 * IncomeExpenseWidget — prototip "Gelir/Gider (grouped bar)" (HANDOFF
 * §Dashboard). CashFlowWidget'ın kardeşi — aynı SVG-only yaklaşım (chart.js
 * bağımlılığı Bento widget'larına henüz eklenmedi, bkz Sparkline.jsx notu).
 *
 * Veri kaynağı: useIncomeExpense hook (fixture, APYA-97 kalıbı).
 */
function IncomeExpenseWidget() {
    const { data, isLoading, isError, isFetching, isStale, dataUpdatedAt, refetch } = useIncomeExpense();
    const onRetry = () => refetch();
    const lastMonth = data?.months?.[data.months.length - 1];
    const net = lastMonth ? lastMonth.income - lastMonth.expense : null;

    return (
        <WidgetShell
            title="Gelir / Gider"
            subtitle="Son 6 ay"
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            isStale={isStale}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={onRetry}
            skeleton={<SkeletonChart height={64} />}
        >
            {data && (
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between gap-3">
                        {net != null && (
                            <span className="text-lg font-semibold tracking-tight font-tabular">
                                {formatMoneyCompact(net, data.currency)}
                                <span className="text-xs font-normal text-text-tertiary ml-1">net</span>
                            </span>
                        )}
                        <Legend />
                    </div>
                    <div className="flex-1 min-h-0">
                        <GroupedBars months={data.months} />
                    </div>
                    <div className="flex text-[10px] text-text-tertiary">
                        {data.months.map((m) => (
                            <span key={m.label} className="flex-1 text-center">{m.label}</span>
                        ))}
                    </div>
                </div>
            )}
        </WidgetShell>
    );
}

function Legend() {
    return (
        <div className="flex items-center gap-3 text-[11px] text-text-secondary flex-none">
            <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--apya-positive-500)' }} aria-hidden="true" />
                Gelir
            </span>
            <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--apya-negative-500)' }} aria-hidden="true" />
                Gider
            </span>
        </div>
    );
}

/**
 * GroupedBars — minimal SVG bar chart, her ay için gelir+gider yan yana çubuk.
 * preserveAspectRatio='none' — container'a esner (Sparkline ile aynı desen).
 */
function GroupedBars({ months }) {
    if (!months || months.length === 0) return null;

    const W = 100;
    const H = 100;
    const max = Math.max(...months.flatMap((m) => [m.income, m.expense])) || 1;
    const groupW = W / months.length;
    const barW = groupW * 0.3;
    const gap = groupW * 0.08;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
            {months.map((m, i) => {
                const groupCenter = i * groupW + groupW / 2;
                const incomeH = (m.income / max) * H;
                const expenseH = (m.expense / max) * H;
                return (
                    <g key={m.label}>
                        <rect
                            x={groupCenter - gap / 2 - barW}
                            y={H - incomeH}
                            width={barW}
                            height={incomeH}
                            fill="var(--apya-positive-500)"
                        />
                        <rect
                            x={groupCenter + gap / 2}
                            y={H - expenseH}
                            width={barW}
                            height={expenseH}
                            fill="var(--apya-negative-500)"
                        />
                    </g>
                );
            })}
        </svg>
    );
}

export { IncomeExpenseWidget };
