import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Mini gantt — satır başına tek şerit, pencere içindeki konumu yüzdeyle.
 * Kritik yoldaki satır kırmızı; rengi tone'dan alır, kendisi karar vermez.
 */
function MiniGantt({ rows = [], axisLabels = [] }) {
    if (!rows.length) return null;

    return (
        <div className="flex flex-col gap-2">
            {rows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11.5px] text-text-secondary truncate">{row.label}</span>
                        <span
                            className={cn(
                                'font-mono text-[10.5px] flex-none',
                                row.tone === 'negative' ? 'text-negative-500' : 'text-text-tertiary',
                            )}
                        >
                            {row.meta}
                        </span>
                    </div>
                    <span className="relative block h-[9px] rounded-[3px] bg-surface-sunken">
                        <span
                            className="absolute h-full rounded-[3px]"
                            style={{
                                left: `${clamp(row.startPercent)}%`,
                                width: `${clamp(row.widthPercent, 1)}%`,
                                background: row.tone === 'negative' ? 'var(--apya-negative-500)'
                                    : row.tone === 'warning' ? 'var(--apya-warning-500)'
                                    : 'var(--apya-positive-500)',
                            }}
                        />
                    </span>
                </div>
            ))}
            {axisLabels.length > 0 && (
                <div className="flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5">
                    {axisLabels.map((label) => <span key={label}>{label}</span>)}
                </div>
            )}
        </div>
    );
}

function clamp(value, min = 0) {
    return Math.max(min, Math.min(Number(value) || 0, 100));
}

export { MiniGantt };
