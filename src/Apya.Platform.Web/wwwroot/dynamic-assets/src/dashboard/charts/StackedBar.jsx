import React from 'react';
import { SERIES_TOKENS, VIEWBOX_H, VIEWBOX_W } from './chartUtils';

/**
 * Yığılmış bar — grup toplamları karşılaştırılır.
 * `fullHeight` true ise her bar %100'e normalize edilir (FullStacked bunu kullanır):
 * o zaman toplam değil BİLEŞİM okunur.
 */
function StackedBar({ groups = [], fullHeight = false, ariaLabel }) {
    if (!groups.length) return null;

    const totals = groups.map((g) => g.values.reduce((a, b) => a + b, 0));
    const scaleMax = fullHeight ? null : Math.max(...totals, 0);

    const slot = VIEWBOX_W / groups.length;
    const barWidth = Math.min(7, slot * 0.6);

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="block w-full h-full"
            role={ariaLabel ? 'img' : 'presentation'}
            aria-label={ariaLabel}
        >
            {groups.map((group, gi) => {
                const total = totals[gi];
                if (total <= 0) return null;

                const barHeight = fullHeight
                    ? VIEWBOX_H - 2
                    : (total / scaleMax) * (VIEWBOX_H - 2);

                let cursor = VIEWBOX_H;
                return group.values.map((value, si) => {
                    const segment = (value / total) * barHeight;
                    cursor -= segment;
                    return (
                        <rect
                            key={`${gi}-${si}`}
                            x={gi * slot + (slot - barWidth) / 2}
                            y={cursor}
                            width={barWidth}
                            height={segment}
                            fill={SERIES_TOKENS[si % SERIES_TOKENS.length]}
                        />
                    );
                });
            })}
        </svg>
    );
}

/** %100 yığılmış — StackedBar'ın normalize kipi, ayrı bileşen olarak katalogda. */
function FullStacked(props) {
    return <StackedBar {...props} fullHeight />;
}

export { StackedBar, FullStacked };
