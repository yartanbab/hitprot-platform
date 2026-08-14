import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Risk matrisi — 3×3 olasılık × etki. Hücre rengi konumdan türetilir
 * (sağ-üst köşe en riskli), sayı hücrenin içinde.
 */
const SIZE = 3;

function RiskMatrix({ cells = [], impactLabels = [], likelihoodLabels = [] }) {
    /* cells: [{ impact: 0..2, likelihood: 0..2, count }] */
    const lookup = new Map(cells.map((c) => [`${c.likelihood}-${c.impact}`, c.count]));

    return (
        <div className="flex flex-col gap-1">
            {Array.from({ length: SIZE }, (_, row) => {
                /* Üst satır en yüksek olasılık → ters sırada çiziliyor. */
                const likelihood = SIZE - 1 - row;
                return (
                    <div key={likelihood} className="flex gap-1 items-center">
                        <span className="w-10 shrink-0 text-[9.5px] text-text-tertiary truncate">
                            {likelihoodLabels[likelihood]}
                        </span>
                        {Array.from({ length: SIZE }, (_, impact) => {
                            const count = lookup.get(`${likelihood}-${impact}`) ?? 0;
                            const severity = likelihood + impact; /* 0..4 */
                            return (
                                <span
                                    key={impact}
                                    className={cn(
                                        'flex-1 h-7 rounded flex items-center justify-center',
                                        'font-mono text-[11px] tabular-nums',
                                        severity >= 3 ? 'bg-negative-100 text-negative-700'
                                            : severity >= 2 ? 'bg-warning-100 text-warning-700'
                                            : 'bg-positive-100 text-positive-700',
                                        count === 0 && 'opacity-40',
                                    )}
                                >
                                    {count}
                                </span>
                            );
                        })}
                    </div>
                );
            })}
            <div className="flex gap-1">
                <span className="w-10 shrink-0" />
                {impactLabels.map((label) => (
                    <span key={label} className="flex-1 text-center text-[9.5px] text-text-tertiary truncate">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export { RiskMatrix };
