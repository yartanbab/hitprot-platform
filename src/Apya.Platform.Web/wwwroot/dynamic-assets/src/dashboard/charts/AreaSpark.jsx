import React, { useId } from 'react';
import { VIEWBOX_H, VIEWBOX_W, areaPath, linePath, scaleY, spreadX } from './chartUtils';

/**
 * Taşan alan grafiği — kartın alt kenarına yapışır (negatif yatay margin caller'da).
 * Eksen/etiket yok: bu bir sparkline, okunacak değil hissedilecek.
 */
function AreaSpark({ values = [], color = 'var(--apya-brand-500)', ariaLabel }) {
    /* Gradient id'si benzersiz olmalı — aynı sayfada iki sparkline varsa
       sabit id ikisini de ilkinin gradientine bağlardı. */
    const gradientId = useId().replace(/:/g, '');

    if (values.length < 2) return null;

    const xs = spreadX(values.length);
    const ys = scaleY(values);

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="block w-full h-full"
            role={ariaLabel ? 'img' : 'presentation'}
            aria-label={ariaLabel}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.16" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath(xs, ys)} fill={`url(#${gradientId})`} />
            <path
                d={linePath(xs, ys)}
                fill="none"
                stroke={color}
                strokeWidth="1.75"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export { AreaSpark };
