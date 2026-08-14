import React from 'react';
import { VIEWBOX_H, VIEWBOX_W } from './chartUtils';

/**
 * Gruplu bar — grup başına iki seri (gelir/gider). Taşan grafik; kartın alt
 * kenarına yapışır. Eksen yok, seri açıklaması kart başlığında.
 */
/* Gider serisi tasarımda #FCA5A5 — token yok. Yeni renk üretmemek için
   negative-500 yarı saydam kullanılır; koyu temada da doğru çalışır. */
const DEFAULT_COLORS = ['var(--apya-positive-500)', 'color-mix(in srgb, var(--apya-negative-500) 45%, transparent)'];

function GroupedBar({ groups = [], colors = DEFAULT_COLORS, ariaLabel }) {
    if (!groups.length) return null;

    const max = Math.max(...groups.flatMap((g) => g.values), 0);
    const slot = VIEWBOX_W / groups.length;
    /* Grup içinde iki bar + aralarında ince boşluk, grupların arasında daha geniş. */
    const barWidth = Math.min(4.5, (slot * 0.62) / 2);
    const gap = barWidth * 0.22;

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="block w-full h-full"
            role={ariaLabel ? 'img' : 'presentation'}
            aria-label={ariaLabel}
        >
            {groups.map((group, gi) => {
                const groupWidth = group.values.length * barWidth + (group.values.length - 1) * gap;
                const originX = gi * slot + (slot - groupWidth) / 2;

                return group.values.map((value, si) => {
                    /* max 0 ise tüm barlar sıfır yükseklik — boş kart görünümü, yalan yok. */
                    const height = max > 0 ? (value / max) * (VIEWBOX_H - 2) : 0;
                    return (
                        <rect
                            key={`${gi}-${si}`}
                            x={originX + si * (barWidth + gap)}
                            y={VIEWBOX_H - height}
                            width={barWidth}
                            height={height}
                            rx="0.8"
                            fill={colors[si % colors.length]}
                        />
                    );
                });
            })}
        </svg>
    );
}

export { GroupedBar };
