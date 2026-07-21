import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Card — sub-component'lerle composable container.
 *
 * Compound pattern: <Card>, <Card.Header>, <Card.Title>, <Card.Description>,
 * <Card.Body>, <Card.Footer>. shadcn convention'ı; kullanım kolay,
 * styling ortak.
 *
 * Variants:
 *   - default   : standart raised surface
 *   - elevated  : daha yüksek shadow (modal-benzeri vurgu)
 *   - flat      : border-only, shadow yok (compact dashboard widget)
 *   - interactive: hover lift + cursor pointer (kart kart tıklanabilir liste)
 *
 * Density (Bento dashboard için kritik):
 *   - compact    : padding 12px
 *   - comfortable: padding 16px (default)
 *   - spacious   : padding 24px
 */

const variantClasses = {
    default:     'bg-surface-raised border border-subtle shadow-sm',
    elevated:    'bg-surface-elevated border border-subtle shadow-md',
    flat:        'bg-surface-base border border-default shadow-none',
    interactive: cn(
        'bg-surface-raised border border-subtle shadow-sm',
        'hover:shadow-md hover:border-default cursor-pointer',
        'transition-shadow duration-fast ease-standard',
    ),
};

const densityClasses = {
    compact:     'p-3',
    comfortable: 'p-4',
    spacious:    'p-6',
};

const Card = React.forwardRef(function Card(
    { className, variant = 'default', density, children, ...props },
    ref,
) {
    return (
        <div
            ref={ref}
            data-density={density}
            className={cn(
                'rounded-xl overflow-hidden',
                'text-text-primary',
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
});

const CardHeader = React.forwardRef(function CardHeader(
    { className, density = 'comfortable', children, ...props },
    ref,
) {
    return (
        <div
            ref={ref}
            className={cn(
                'flex flex-col gap-1',
                'border-b border-subtle',
                densityClasses[density],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
});

const CardTitle = React.forwardRef(function CardTitle(
    { className, as: Tag = 'h3', children, ...props },
    ref,
) {
    return (
        <Tag
            ref={ref}
            className={cn(
                'text-lg font-semibold leading-tight text-text-primary',
                className,
            )}
            {...props}
        >
            {children}
        </Tag>
    );
});

const CardDescription = React.forwardRef(function CardDescription(
    { className, children, ...props },
    ref,
) {
    return (
        <p
            ref={ref}
            className={cn('text-sm text-text-secondary', className)}
            {...props}
        >
            {children}
        </p>
    );
});

const CardBody = React.forwardRef(function CardBody(
    { className, density = 'comfortable', children, ...props },
    ref,
) {
    return (
        <div
            ref={ref}
            className={cn(densityClasses[density], className)}
            {...props}
        >
            {children}
        </div>
    );
});

const CardFooter = React.forwardRef(function CardFooter(
    { className, density = 'comfortable', children, ...props },
    ref,
) {
    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-end gap-2',
                'border-t border-subtle bg-surface-sunken',
                densityClasses[density],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
});

/* Compound API — `Card.Header` notation */
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
