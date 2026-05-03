import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Button — token-aware, variant-driven primitive.
 *
 * Variant'lar Apya'nın UX prensibine bağlı:
 *   - primary    : ana aksiyon (form submit, "Onayla")
 *   - secondary  : ikincil aksiyon ("İptal", "Geri")
 *   - ghost      : minimal yüzey, ikon button + toolbar
 *   - destructive: yıkıcı aksiyon ("Sil", "Reddet") — confirmation modal'lı
 *   - outline    : alternatif ikincil
 *   - link       : metin görünümlü
 *
 * Boyutlar:
 *   - sm (32px)  : compact density
 *   - md (40px)  : comfortable (default)
 *   - lg (48px)  : touch-first / mobile primary
 *   - icon (40px square) : ikon-only
 *
 * `asChild` prop'u (Radix Slot pattern) — Button wrapper'ı kaldırır,
 * altındaki child'a (genelde <a>) sınıfları geçirir. Routing component'leriyle
 * çakışmadan link button yapar.
 *
 * Loading state: `isLoading` prop'u + `loadingText`.
 *   - Spinner gösterilir, content opacity'i düşer.
 *   - Disabled olur (kullanıcı double-submit yapamaz).
 *   - aria-busy="true" — screen reader'a "yükleniyor" der.
 */

const buttonVariants = cva(
    /* Base — her variant için ortak */
    cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-md font-medium',
        'transition-colors duration-fast ease-standard',
        'focus-visible:outline-none focus-visible:shadow-focus',
        'disabled:opacity-50 disabled:pointer-events-none',
        'select-none whitespace-nowrap',
    ),
    {
        variants: {
            variant: {
                primary: cn(
                    'bg-brand-500 text-text-inverse',
                    'hover:bg-brand-600 active:bg-brand-700',
                    'shadow-sm',
                ),
                secondary: cn(
                    'bg-surface-raised text-text-primary border border-default',
                    'hover:bg-surface-elevated hover:border-strong',
                ),
                ghost: cn(
                    'bg-transparent text-text-secondary',
                    'hover:bg-surface-raised hover:text-text-primary',
                ),
                destructive: cn(
                    'bg-negative-500 text-text-inverse',
                    'hover:bg-negative-600 active:bg-negative-700',
                    'shadow-sm',
                ),
                outline: cn(
                    'bg-transparent text-text-primary border border-strong',
                    'hover:bg-surface-raised',
                ),
                link: cn(
                    'bg-transparent text-text-link p-0 h-auto',
                    'hover:underline underline-offset-2',
                ),
            },
            size: {
                sm:   'h-8 px-3 text-sm',
                md:   'h-10 px-4 text-sm',
                lg:   'h-12 px-6 text-base',
                icon: 'h-10 w-10 p-0',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size:    'md',
        },
    },
);

const Button = React.forwardRef(function Button(
    {
        className,
        variant,
        size,
        asChild = false,
        isLoading = false,
        loadingText,
        leadingIcon,
        trailingIcon,
        disabled,
        children,
        type = 'button',
        ...props
    },
    ref,
) {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    return (
        <Comp
            ref={ref}
            type={asChild ? undefined : type}
            disabled={asChild ? undefined : isDisabled}
            aria-busy={isLoading || undefined}
            data-loading={isLoading || undefined}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {isLoading ? <Spinner /> : leadingIcon}
            <span className={isLoading ? 'opacity-80' : undefined}>
                {isLoading && loadingText ? loadingText : children}
            </span>
            {!isLoading && trailingIcon}
        </Comp>
    );
});

function Spinner() {
    /* Inline SVG — lucide-react'ten kaçınıp Button bağımsız kalsın diye. */
    return (
        <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
    );
}

export { Button, buttonVariants };
