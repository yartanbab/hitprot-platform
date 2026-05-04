import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Input — token-aware base input primitive.
 *
 * Davranışlar (UX strategy doc § Design System):
 *   - State sözleşmesi: default → hover → focus-visible → invalid → disabled
 *   - error: aria-invalid, border-error; helper'da hata metni caller'ın işi
 *   - leading / trailing slot: ikon, affix (₺, %, /gün vb.)
 *   - sizes: sm (32px) / md (40px, default) / lg (48px touch-first)
 *
 * Form sınırı işaretler — validation library'sine sıkı bağımlılık yok;
 * caller React Hook Form, ham state, ya da kendi reducer'ı kullanabilir.
 */

const inputVariants = cva(
    cn(
        'block w-full bg-surface-base text-text-primary',
        'rounded-md border',
        'placeholder:text-text-tertiary',
        'transition-colors duration-fast ease-standard',
        'focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus',
        'disabled:bg-surface-sunken disabled:text-text-disabled disabled:cursor-not-allowed',
        'aria-[invalid=true]:border-error',
    ),
    {
        variants: {
            size: {
                sm: 'h-8 px-2 text-sm',
                md: 'h-10 px-3 text-sm',
                lg: 'h-12 px-4 text-base',
            },
            tone: {
                default: 'border-default hover:border-strong',
                error:   'border-error',
            },
        },
        defaultVariants: {
            size: 'md',
            tone: 'default',
        },
    },
);

const Input = React.forwardRef(function Input(
    {
        className,
        size,
        invalid,
        leading,
        trailing,
        type = 'text',
        ...props
    },
    ref,
) {
    const tone = invalid ? 'error' : 'default';

    /* Affix yoksa raw input — ek wrapper DOM'a çıkmasın */
    if (!leading && !trailing) {
        return (
            <input
                ref={ref}
                type={type}
                aria-invalid={invalid || undefined}
                className={cn(inputVariants({ size, tone }), className)}
                {...props}
            />
        );
    }

    /* Affix'li mode — wrapper input görsel kontur, gerçek input plain.
       Focus halkası wrapper'da; input box-shadow kaybolur. */
    return (
        <span
            className={cn(
                inputVariants({ size, tone }),
                'inline-flex items-center gap-2 px-0',
                'focus-within:shadow-focus focus-within:border-focus',
                className,
            )}
        >
            {leading && (
                <span className="flex-none pl-3 text-text-tertiary">{leading}</span>
            )}
            <input
                ref={ref}
                type={type}
                aria-invalid={invalid || undefined}
                className={cn(
                    'flex-1 min-w-0 bg-transparent outline-none border-0 p-0',
                    'text-text-primary placeholder:text-text-tertiary',
                    !leading && 'pl-3',
                    !trailing && 'pr-3',
                    'disabled:cursor-not-allowed disabled:text-text-disabled',
                )}
                {...props}
            />
            {trailing && (
                <span className="flex-none pr-3 text-text-tertiary">{trailing}</span>
            )}
        </span>
    );
});

export { Input, inputVariants };
