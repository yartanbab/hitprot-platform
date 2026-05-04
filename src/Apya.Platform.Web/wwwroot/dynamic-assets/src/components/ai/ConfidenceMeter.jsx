import React from 'react';
import { cn } from '../../lib/utils';

/**
 * ConfidenceMeter — AI önerinin güven seviyesini 5 noktalı meter ile gösterir.
 *
 * Tasarım kararı: ham yüzde ("%73") kullanıcıya anlamlı değil. 5-dot scale
 * insanın hızlıca tarayabildiği görsel sinyal: ●●●●○ → "yüksek ama tam değil".
 *
 * Eşikler (UX strategy doc § AI UX):
 *   ≥ 0.85   →  ●●●●●  Çok yüksek — 1-tık uygulamaya uygun
 *   ≥ 0.70   →  ●●●●○  Yüksek
 *   ≥ 0.50   →  ●●●○○  Orta — kullanıcı kararı önerilir
 *   ≥ 0.30   →  ●●○○○  Düşük — bilgi olarak göster
 *   < 0.30   →  ●○○○○  Çok düşük — AUTO-SHOW ETME (caller filtrelemeli)
 *
 * Caller `score` olarak 0-1 ya da 0-100 verebilir (helper otomatik algılar).
 * Erişilebilirlik: sr-only span ham değeri okur, dot'lar aria-hidden.
 */

const SIZES = {
    sm: { dot: 'h-1 w-1',   gap: 'gap-0.5' },
    md: { dot: 'h-1.5 w-1.5', gap: 'gap-0.5' },
    lg: { dot: 'h-2 w-2',   gap: 'gap-1' },
};

function normalize(score) {
    if (typeof score !== 'number' || !Number.isFinite(score)) return 0;
    /* 0-1 ya da 0-100 hangisi gelirse tek formata indir. */
    return score > 1 ? Math.max(0, Math.min(100, score)) / 100 : Math.max(0, Math.min(1, score));
}

function bandFor(value) {
    if (value >= 0.85) return { dots: 5, label: 'Çok yüksek güven' };
    if (value >= 0.70) return { dots: 4, label: 'Yüksek güven' };
    if (value >= 0.50) return { dots: 3, label: 'Orta güven' };
    if (value >= 0.30) return { dots: 2, label: 'Düşük güven' };
    return { dots: 1, label: 'Çok düşük güven' };
}

function ConfidenceMeter({ score, label, size = 'md', showLabel = true, className }) {
    const value = normalize(score);
    const band = bandFor(value);
    const sizeStyles = SIZES[size] ?? SIZES.md;
    const display = label ?? band.label;
    const percent = Math.round(value * 100);

    return (
        <span
            className={cn('inline-flex items-center gap-1 text-xs text-text-tertiary', className)}
            title={`${band.label} (%${percent})`}
        >
            <span className={cn('inline-flex items-center', sizeStyles.gap)} aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                    <span
                        key={i}
                        className={cn(
                            'inline-block rounded-full',
                            sizeStyles.dot,
                            i < band.dots ? 'bg-ai-500' : 'bg-neutral-200',
                        )}
                    />
                ))}
            </span>
            {showLabel && <span aria-hidden="true">{display}</span>}
            <span className="sr-only">Güven düzeyi: {band.label} (%{percent})</span>
        </span>
    );
}

ConfidenceMeter.bandFor = bandFor;
ConfidenceMeter.normalize = normalize;

export { ConfidenceMeter };
