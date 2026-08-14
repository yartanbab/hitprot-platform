import React from 'react';

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Tek oranlık halka (bütçe kullanımı). Renk eşikten türetilir:
 * %90+ negatif, %70+ uyarı, altı pozitif — proje sağlığıyla AYNI eşikler.
 */
function Gauge({ ratio = 0, size = 58, ariaLabel }) {
    const clamped = Math.max(0, Math.min(ratio, 1));
    const filled = clamped * CIRCUMFERENCE;

    const stroke = clamped >= 0.9 ? 'var(--apya-negative-500)'
        : clamped >= 0.7 ? 'var(--apya-warning-500)'
        : 'var(--apya-positive-500)';

    return (
        <svg
            viewBox="0 0 100 100"
            style={{ width: size, height: size }}
            className="flex-none"
            role="img"
            aria-label={ariaLabel ?? `${Math.round(clamped * 100)}%`}
        >
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--apya-surface-sunken)" strokeWidth="12" />
            {/* Oran 0 iken yay HİÇ çizilmez: strokeLinecap="round" sıfır uzunlukta
                bile iki yuvarlak uç bırakıyor ve boş halkada nokta gibi görünüyor. */}
            {filled > 0 && (
                <circle
                    cx="50" cy="50" r={RADIUS}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="12"
                    strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
            )}
        </svg>
    );
}

export { Gauge };
