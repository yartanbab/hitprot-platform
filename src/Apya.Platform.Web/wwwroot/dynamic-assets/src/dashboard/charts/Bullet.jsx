import React from 'react';

/**
 * Tek satır oransal bar (proje sağlığı). Tasarımdaki teknik: iki flex kardeş,
 * dolu kısım flex:<oran>, kalan flex:<1-oran> — yüzde hesabı CSS'e bırakılır.
 *
 * Oran 1'i aşabilir (bütçe aşımı): o zaman tek renk dolu bar çizilir.
 */
function Bullet({ ratio = 0, tone = 'positive', ariaLabel }) {
    const clamped = Math.max(0, Math.min(ratio, 1));
    const filled = Math.round(clamped * 100);

    const color = tone === 'negative' ? 'var(--apya-negative-500)'
        : tone === 'warning' ? 'var(--apya-warning-500)'
        : 'var(--apya-positive-500)';

    return (
        <div
            className="flex gap-1"
            role="img"
            aria-label={ariaLabel ?? `%${filled}`}
        >
            <span className="h-[5px] rounded-full" style={{ flex: filled, background: color }} />
            {filled < 100 && (
                <span
                    className="h-[5px] rounded-full bg-surface-sunken"
                    style={{ flex: 100 - filled }}
                />
            )}
        </div>
    );
}

export { Bullet };
