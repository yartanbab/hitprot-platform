import React from 'react';
import { cn } from '../../lib/utils';

/**
 * EmptyState — "veri yok" yerine ikon + 1 satır + 1 CTA.
 *
 * UX strategy doc § Widget kontratı: "Veri yok" yasak.
 * Kullanıcıya ne anlama geldiğini ve hangi aksiyonu alabileceğini söyle:
 *
 *   ✗ "Bekleyen onay yok."
 *   ✓ icon + "Hepsi tamam" + "Bugün karar bekleyen kalmadı."
 *
 * Variant'lar:
 *   - default : nötr (ikon+başlık ai-500/neutral)
 *   - success : pozitif (yeşil) — "tüm işler bitti" durumu
 *   - info    : nötr bilgilendirici
 *
 * Standalone kullanılabilir; WidgetShell tarafından da inline gösterilir.
 */

const VARIANTS = {
    default: { ring: 'bg-neutral-100 text-neutral-500',  text: 'text-text-tertiary' },
    success: { ring: 'bg-positive-50 text-positive-600', text: 'text-text-secondary' },
    info:    { ring: 'bg-brand-50 text-brand-600',       text: 'text-text-secondary' },
};

function EmptyState({
    icon,
    title,
    description,
    action,            /* ReactNode — Button, link vs. */
    variant = 'default',
    compact = false,   /* compact: ikonu küçült, padding düşür — Bento widget için */
    className,
}) {
    const v = VARIANTS[variant] ?? VARIANTS.default;
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'flex flex-col items-center justify-center text-center',
                compact ? 'gap-2 py-3' : 'gap-3 py-6',
                className,
            )}
        >
            {icon && (
                <span
                    className={cn(
                        'inline-flex items-center justify-center rounded-full',
                        v.ring,
                        compact ? 'h-8 w-8' : 'h-12 w-12',
                    )}
                    aria-hidden="true"
                >
                    {icon}
                </span>
            )}
            {title && (
                <p className={cn(
                    'font-medium text-text-primary',
                    compact ? 'text-sm' : 'text-base',
                )}>
                    {title}
                </p>
            )}
            {description && (
                <p className={cn('max-w-sm', v.text, compact ? 'text-xs' : 'text-sm')}>
                    {description}
                </p>
            )}
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}

export { EmptyState };
