import React, { useId } from 'react';
import { WidgetShell } from './WidgetShell';
import { SkeletonHeadline, SkeletonChart } from '../../components/ui';
import { formatMoneyCompact, formatDelta, cn } from '../../lib/utils';
import { useCashFlow } from '../hooks/useCashFlow';

/**
 * CashFlowWidget — "Nakit akışım hangi yöne gidiyor?" — 4×1 yatay widget.
 *
 * SVG sparkline (chart library bağımlılığı YOK — Visx/Recharts henüz
 * proje'ye girmedi). Inline SVG, 60fps, ~5KB. Tooltip mevcut değil
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

/**
 * Sparkline — minimal SVG line + area gradient.
 * preserveAspectRatio='none' — container'a göre yatay esner.
 *
 * Gradient için unique ID (useId) çünkü aynı sayfada birden fazla
 * sparkline olursa SVG defs çakışır.
 */
function Sparkline({ series, variant = 'positive' }) {
    const uid = useId();
    const gradientId = `cashflow-grad-${uid.replace(/:/g, '')}`;

    if (!series || series.length < 2) return null;

    const W = 100;
    const H = 40;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;

    const points = series.map((v, i) => {
        const x = (i / (series.length - 1)) * W;
        const y = H - ((v - min) / range) * H;
        return [x, y];
    });

    const linePath = points
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
        .join(' ');

    const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

    const stroke = variant === 'positive'
        ? 'var(--apya-positive-500)'
        : 'var(--apya-negative-500)';

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
                d={linePath}
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export { CashFlowWidget };
