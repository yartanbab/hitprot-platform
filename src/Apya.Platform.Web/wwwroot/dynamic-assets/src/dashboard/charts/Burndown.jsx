import React from 'react';
import { VIEWBOX_H, VIEWBOX_W, linePath, spreadX } from './chartUtils';

/**
 * Burndown — ideal (kesikli) ve gerçekleşen (dolu) iki çizgi.
 * İkisi de AYNI başlangıç toplamına göre ölçeklenir; ayrı ölçek karşılaştırmayı bozar.
 */
function Burndown({ actual = [], ideal = [], ariaLabel }) {
    if (actual.length < 2) return null;

    const max = Math.max(...actual, ...ideal, 0);
    const toY = (v) => (max > 0 ? 2 + (VIEWBOX_H - 4) * (1 - v / max) : VIEWBOX_H - 2);

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="block w-full h-full"
            role={ariaLabel ? 'img' : 'presentation'}
            aria-label={ariaLabel}
        >
            {ideal.length >= 2 && (
                <path
                    d={linePath(spreadX(ideal.length), ideal.map(toY))}
                    fill="none"
                    stroke="var(--apya-text-tertiary)"
                    strokeWidth="1.25"
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                />
            )}
            <path
                d={linePath(spreadX(actual.length), actual.map(toY))}
                fill="none"
                stroke="var(--apya-brand-500)"
                strokeWidth="1.75"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export { Burndown };
