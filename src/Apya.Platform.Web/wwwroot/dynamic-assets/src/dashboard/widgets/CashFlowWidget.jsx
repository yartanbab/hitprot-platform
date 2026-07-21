import React from 'react';
import { WidgetShell } from './WidgetShell';
import { SkeletonHeadline, SkeletonChart, Sparkline } from '../../components/ui';
import { formatMoneyCompact, formatDelta, cn } from '../../lib/utils';
import { useCashFlow } from '../hooks/useCashFlow';

/**
 * CashFlowWidget — "Nakit akışım hangi yöne gidiyor?" — 4×1 yatay widget.
 *
 * Sparkline paylaşılan primitive'e taşındı (components/ui/Sparkline) —
 * KpiStripWidget de aynı görsel dili kullanıyor. Tooltip mevcut değil
 * (deferred — Bento'da hover etkileşimi minimal tutulur, drill için
 * tıklama tercih edilir).
 *
 * Veri kaynağı: useCashFlow hook (TanStack Query, APYA-97).
 */

function CashFlowWidget() {
    const { data, isLoading, isError, isFetching, isStale, dataUpdatedAt, refetch } = useCashFlow();
    const onRetry = () => refetch();
    const delta = data ? formatDelta(data.deltaPct) : null;
    const trendUp = data ? data.deltaPct >= 0 : true;

    return (
        <WidgetShell
            title="Nakit Akışı"
            subtitle="Son 30 gün"
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            isStale={isStale}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={onRetry}
            skeleton={(
                <div className="flex items-center justify-between gap-4 h-full">
                    <SkeletonHeadline className="flex-none" />
                    <div className="flex-1 min-w-0 h-full max-h-16">
                        <SkeletonChart height={64} />
                    </div>
                </div>
            )}
        >
            {data && (
                <div className="flex items-center justify-between gap-4 h-full">
                    {/* Sol: glance metric + delta */}
                    <div className="flex flex-col gap-1 flex-none">
                        <div className="text-2xl font-semibold tracking-tight font-tabular">
                            {formatMoneyCompact(data.netCurrent, data.currency)}
                        </div>
                        {delta && (
                            <div className="flex items-center gap-1 text-xs">
                                <span className={cn(
                                    'inline-flex items-center gap-1 font-medium font-tabular',
                                    trendUp ? 'text-text-positive' : 'text-text-negative',
                                )}>
                                    {delta.symbol} {delta.text}
                                </span>
                                <span className="text-text-tertiary">vs önceki dönem</span>
                            </div>
                        )}
                    </div>

                    {/* Sağ: sparkline — flex-1 so it fills */}
                    <div className="flex-1 min-w-0 h-full max-h-16">
                        <Sparkline series={data.series} variant={trendUp ? 'positive' : 'negative'} />
                    </div>
                </div>
            )}
        </WidgetShell>
    );
}

export { CashFlowWidget };
