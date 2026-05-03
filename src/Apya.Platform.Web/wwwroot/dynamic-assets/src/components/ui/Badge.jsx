import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Badge — status/label indicator.
 *
 * Variant'lar semantic — renk anlam taşır:
 *   - neutral  : bekleme, taslak
 *   - brand    : info, etiket
 *   - positive : onaylı, başarılı, aktif
 *   - negative : reddedildi, hata, iptal
 *   - warning  : dikkat, gecikme yakın
 *   - critical : kritik, ihlal
 *   - ai       : AI suggestion etiketi
 *
 * Sizes:
 *   - sm: meta info, table cell
 *   - md: default
 *   - lg: prominent (page header)
 *
 * Color-blind a11y: dot variant'ı içinde küçük circle indicator de gösterir
 * (renge ek görsel sinyal).
 */

const badgeVariants = cva(
    cn(
        'inline-flex items-center gap-1',
        'font-medium',
        'border',
        'whitespace-nowrap',
    ),
    {
        variants: {
            variant: {
                neutral:  'bg-neutral-100 text-neutral-700 border-neutral-200',
                brand:    'bg-brand-50 text-brand-700 border-brand-100',
                positive: 'bg-positive-50 text-positive-700 border-positive-100',
                negative: 'bg-negative-50 text-negative-700 border-negative-100',
                warning:  'bg-warning-50 text-warning-700 border-warning-100',
                critical: 'bg-critical-50 text-critical-600 border-critical-50',
                ai:       'bg-ai-50 text-ai-600 border-ai-50',
            },
            size: {
                sm: 'text-xs px-2 py-0.5 rounded-sm',
                md: 'text-xs px-2.5 py-1 rounded-md',
                lg: 'text-sm px-3 py-1.5 rounded-md',
            },
        },
        defaultVariants: {
            variant: 'neutral',
            size:    'md',
        },
    },
);

const dotColorMap = {
    neutral:  'bg-neutral-500',
    brand:    'bg-brand-500',
    positive: 'bg-positive-500',
    negative: 'bg-negative-500',
    warning:  'bg-warning-500',
    critical: 'bg-critical-500',
    ai:       'bg-ai-500',
};

function Badge({ variant = 'neutral', size, withDot = false, className, children, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {withDot && (
                <span
                    className={cn('inline-block h-1.5 w-1.5 rounded-full', dotColorMap[variant])}
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
}

export { Badge, badgeVariants };
