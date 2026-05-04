import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '../../lib/utils';

/**
 * Shape-aware skeletons — widget'ın iskeleti yüklenirken görsel formu korur.
 *
 * Tasarım kararı (UX strategy doc § Performance + § Widget kontratı):
 *   Generic 3-satır skeleton "yükleniyor" sinyali verir ama kullanıcının
 *   beklentisini yanlış yönlendirir (sayı widget'ı için 3-satır metin
 *   görmek "yanlış içerik" hissi yaratır). Shape-aware skeleton iskelet
 *   ile gerçek içeriğin bounding box'ını eşler — flicker'ı azaltır.
 *
 * Üç temel shape:
 *   - SkeletonHeadline : tek büyük metric + alt etiket (Budget, CashFlow gibi)
 *   - SkeletonChart    : sparkline / area chart yerine tutucu
 *   - SkeletonList     : N satır liste (Approvals, Risks, Suggestions)
 */

function SkeletonHeadline({ className, withDelta = true, withBar = false }) {
    return (
        <div className={cn('flex flex-col gap-3 h-full', className)} aria-busy="true">
            {/* Glance metric — büyük rakam */}
            <div className="flex items-baseline gap-2">
                <Skeleton width={140} height={32} rounded="md" />
                <Skeleton width={70}  height={16} rounded="sm" />
            </div>
            {/* Delta line */}
            {withDelta && <Skeleton width={180} height={12} rounded="sm" />}
            {/* Optional progress bar */}
            {withBar && <Skeleton height={6} rounded="full" />}
        </div>
    );
}

function SkeletonChart({ className, height = 64 }) {
    /* Çubuk simulasyonu — gerçek chart'ın aspect ratio'sunu korur.
       12 sütun, varying height; CSS ile dağılım, JS hesabı yok. */
    const bars = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
    return (
        <div
            className={cn('flex items-end justify-between gap-1 w-full', className)}
            style={{ height }}
            aria-busy="true"
        >
            {bars.map((h, i) => (
                <Skeleton
                    key={i}
                    height={`${h * 100}%`}
                    className="flex-1 min-w-0"
                    rounded="sm"
                />
            ))}
        </div>
    );
}

function SkeletonList({ rows = 4, withLeading = true, withTrailing = true, className }) {
    return (
        <ul className={cn('flex flex-col gap-2', className)} aria-busy="true">
            {Array.from({ length: rows }).map((_, i) => (
                <li
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base"
                >
                    {withLeading && <Skeleton width={32} height={32} rounded="md" />}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <Skeleton height={12} className={i % 2 === 0 ? 'w-3/4' : 'w-2/3'} />
                        <Skeleton height={10} className="w-1/2" />
                    </div>
                    {withTrailing && <Skeleton width={64} height={12} rounded="sm" />}
                </li>
            ))}
        </ul>
    );
}

export { SkeletonHeadline, SkeletonChart, SkeletonList };
