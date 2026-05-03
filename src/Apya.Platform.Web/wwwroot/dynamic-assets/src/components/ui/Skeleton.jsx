import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Skeleton — loading placeholder.
 *
 * Kullanım kuralı (UX strategy doc § Performance):
 *   - <150ms: skeleton GÖSTERME (flash önler)
 *   - 150-1000ms: skeleton + shimmer
 *   - >1000ms: skeleton + ilerleme metni ("Veriler yükleniyor...")
 *
 * Shimmer animasyonu `prefers-reduced-motion` altında devre dışı
 * (token override ile).
 *
 * `.skeleton` global class index.css'te tanımlı; bu component shorthand
 * + boyut prop'ları.
 */
function Skeleton({ className, width, height, rounded = 'md', ...props }) {
    const style = {};
    if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className={cn(
                'skeleton',
                rounded === 'full' && 'rounded-full',
                rounded === 'sm' && 'rounded-sm',
                rounded === 'md' && 'rounded-md',
                rounded === 'lg' && 'rounded-lg',
                className,
            )}
            style={style}
            {...props}
        />
    );
}

/**
 * SkeletonText — paragraph skeleton'ı için convenience.
 * Her satır biraz farklı genişlik (gerçek metin gibi).
 */
function SkeletonText({ lines = 3, className }) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height={12}
                    className={i === lines - 1 ? 'w-3/4' : 'w-full'}
                />
            ))}
        </div>
    );
}

export { Skeleton, SkeletonText };
