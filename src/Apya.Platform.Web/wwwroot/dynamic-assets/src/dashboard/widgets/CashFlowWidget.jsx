import React, { useId } from 'react';
import { WidgetShell } from './WidgetShell';
import { formatMoneyCompact, formatDelta, cn } from '../../lib/utils';

/**
 * CashFlowWidget — "Nakit akışım hangi yöne gidiyor?" — 4×1 yatay widget.
 *
 * SVG sparkline (chart library bağımlılığı YOK — Visx/Recharts henüz
 * proje'ye girmedi). Inline SVG, 60fps, ~5KB. Tooltip mevcut değil
 * (deferred — Bento'da hover etkileşimi minimal tutulur, drill için
 * tıklama tercih edilir).
 *
 * Datasource (gerçek): JournalEntry sequence'ından accumulated cashflow.
 * Mock: son 30 gün fixture.
 */

const MOCK = {
    currency:   'TRY',
    netCurrent: 487_300,
    deltaPct:   12.4,
    /* 30 günlük seri — son 30 gün, 0 = en eski */
    series: [
        320, 312, 305, 318, 332, 340, 355, 348, 360, 372,
        380, 365, 390, 410, 405, 420, 435, 425, 440, 455,
        448, 462, 470, 458, 472, 480, 475, 482, 487, 487,
    ],
};

function CashFlowWidget({ data = MOCK, isLoading, isError, onRetry }) {
    const delta = data ? formatDelta(data.deltaPct) : null;
    const trendUp = data ? data.deltaPct >= 0 : true;

    return (
        <WidgetShell
            title="Nakit Akışı"
            subtitle="Son 30 gün"
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
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
