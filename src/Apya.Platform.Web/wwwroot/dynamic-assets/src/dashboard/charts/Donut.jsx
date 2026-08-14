import React from 'react';
import { SERIES_TOKENS } from './chartUtils';

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Halka. Dilimler stroke-dasharray ile çizilir (path aritmetiği yok) —
 * tasarımdaki bütçe halkasıyla aynı teknik.
 */
function Donut({ slices = [], centerLabel, ariaLabel }) {
    const total = slices.reduce((sum, s) => sum + s.value, 0);
    if (total <= 0) return null;

    let offset = 0;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" role={ariaLabel ? 'img' : 'presentation'} aria-label={ariaLabel}>
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--apya-surface-sunken)" strokeWidth="12" />
                {slices.map((slice, i) => {
                    const length = (slice.value / total) * CIRCUMFERENCE;
                    const dash = `${length} ${CIRCUMFERENCE - length}`;
                    const el = (
                        <circle
                            key={slice.label ?? i}
                            cx="50" cy="50" r={RADIUS}
                            fill="none"
                            stroke={slice.color ?? SERIES_TOKENS[i % SERIES_TOKENS.length]}
                            strokeWidth="12"
                            strokeDasharray={dash}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 50 50)"
                        />
                    );
                    offset += length;
                    return el;
                })}
            </svg>
            {centerLabel && (
                <span className="absolute font-mono text-sm font-semibold text-text-primary tabular-nums">
                    {centerLabel}
                </span>
            )}
        </div>
    );
}

export { Donut };
