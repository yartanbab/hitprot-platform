import React, { useId } from 'react';

/**
 * Sparkline — minimal SVG line + area gradient.
 * Chart library bağımlılığı YOK (Visx/Recharts henüz projeye girmedi) —
 * CashFlowWidget'ın orijinal inline implementasyonundan çıkarıldı, KPI
 * şeridinde de aynı görsel dilin tekrarlanabilmesi için.
 *
 * preserveAspectRatio='none' — container'a göre serbestçe esner.
 */
function Sparkline({ series, variant = 'positive', className = 'w-full h-full' }) {
    const uid = useId();
    const gradientId = `apya-spark-${uid.replace(/:/g, '')}`;

    if (!series || series.length < 2) return null;

    const W = 100;
    const H = 40;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;

    const points = series.map((v, i) => {
        const x = (i / (series.length - 1)) * W;
        const y = H - ((v - min) / range) * H;
        return [x, y];
    });

    const linePath = points
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
        .join(' ');

    const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

    const stroke = variant === 'positive'
        ? 'var(--apya-positive-500)'
        : 'var(--apya-negative-500)';

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
                d={linePath}
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export { Sparkline };
