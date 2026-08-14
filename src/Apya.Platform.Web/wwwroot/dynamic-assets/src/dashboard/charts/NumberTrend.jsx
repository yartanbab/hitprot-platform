import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Sayı + trend kutucuğu. Aynı zamanda TÜM grafiklerin fallback'i:
 * kart bir grafiğin asgari boyutunun altına inerse grafik kırılmaz, buraya düşer.
 */
function NumberTrend({ value, label, delta, trend = 'Flat', tone = 'neutral', className }) {
    return (
        <div className={cn('flex flex-col gap-1 justify-center h-full', className)}>
            {label && <span className="text-xs text-text-secondary">{label}</span>}
            <span
                className={cn(
                    'font-mono text-2xl font-semibold leading-none tracking-[-0.03em] tabular-nums',
                    tone === 'negative' ? 'text-negative-600'
                        : tone === 'warning' ? 'text-warning-600'
                        : tone === 'positive' ? 'text-positive-600'
                        : 'text-text-primary',
                )}
            >
                {value}
            </span>
            {delta && <TrendDelta trend={trend}>{delta}</TrendDelta>}
        </div>
    );
}

/** Delta rozeti — yön okunu trend'den türetir, rengi anlamdan değil yönden almaz. */
function TrendDelta({ trend, children }) {
    const glyph = trend === 'Up' ? '▲' : trend === 'Down' ? '▼' : '•';
    return (
        <span
            className={cn(
                'font-mono text-[10.5px] tabular-nums',
                trend === 'Up' ? 'text-positive-600'
                    : trend === 'Down' ? 'text-negative-600'
                    : 'text-text-tertiary',
            )}
        >
            {glyph} {children}
        </span>
    );
}

export { NumberTrend, TrendDelta };
