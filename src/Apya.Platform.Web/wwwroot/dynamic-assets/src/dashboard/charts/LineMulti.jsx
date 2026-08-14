import React from 'react';
import { SERIES_TOKENS, VIEWBOX_H, VIEWBOX_W, linePath, spreadX } from './chartUtils';

/**
 * Çok serili çizgi. Seriler ORTAK ölçeğe oturur — her seriyi kendi maksimumuna
 * normalize etmek karşılaştırmayı yalan yapardı.
 */
function LineMulti({ series = [], ariaLabel }) {
    const all = series.flatMap((s) => s.values ?? []);
    if (all.length < 2) return null;

    const max = Math.max(...all, 0);
    const toY = (v) => (max > 0 ? 2 + (VIEWBOX_H - 4) * (1 - v / max) : VIEWBOX_H - 2);

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="block w-full h-full"
            role={ariaLabel ? 'img' : 'presentation'}
            aria-label={ariaLabel}
        >
            {series.map((s, i) => {
                const values = s.values ?? [];
                if (values.length < 2) return null;
                return (
                    <path
                        key={s.label ?? i}
                        d={linePath(spreadX(values.length), values.map(toY))}
                        fill="none"
                        stroke={s.color ?? SERIES_TOKENS[i % SERIES_TOKENS.length]}
                        strokeWidth="1.75"
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
        </svg>
    );
}

export { LineMulti };
