import React from 'react';
import { VIEWBOX_H, VIEWBOX_W } from './chartUtils';

/**
 * Şelale — başlangıçtan bitişe artı/eksi katkılar. Her bar bir öncekinin
 * bıraktığı seviyeden başlar; `isTotal` işaretli adımlar tabandan çizilir.
 */
function Waterfall({ steps = [], ariaLabel }) {
    if (!steps.length) return null;

    /* Kümülatif seviyeler — ölçek için tepe ve dip birlikte gerekir. */
    let running = 0;
    const bars = steps.map((step) => {
        const from = step.isTotal ? 0 : running;
        const to = step.isTotal ? step.value : running + step.value;
        if (!step.isTotal) running = to;
        return { ...step, from, to };
    });

    const top = Math.max(...bars.map((b) => Math.max(b.from, b.to)), 0);
    const bottom = Math.min(...bars.map((b) => Math.min(b.from, b.to)), 0);
    const span = top - bottom || 1;

    const toY = (v) => 2 + (VIEWBOX_H - 4) * (1 - (v - bottom) / span);
    const slot = VIEWBOX_W / bars.length;
    const barWidth = Math.min(7, slot * 0.6);

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="block w-full h-full"
            role={ariaLabel ? 'img' : 'presentation'}
            aria-label={ariaLabel}
        >
            {bars.map((bar, i) => {
                const y1 = toY(bar.from);
                const y2 = toY(bar.to);
                return (
                    <rect
                        key={bar.label ?? i}
                        x={i * slot + (slot - barWidth) / 2}
                        y={Math.min(y1, y2)}
                        width={barWidth}
                        height={Math.max(Math.abs(y2 - y1), 0.6)}
                        rx="0.8"
                        fill={bar.isTotal ? 'var(--apya-text-primary)'
                            : bar.value >= 0 ? 'var(--apya-positive-500)'
                            : 'var(--apya-negative-500)'}
                    />
                );
            })}
        </svg>
    );
}

export { Waterfall };
