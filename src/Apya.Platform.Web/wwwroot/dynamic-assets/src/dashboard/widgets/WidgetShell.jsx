import React from 'react';
import { Card, CardHeader, CardTitle, CardBody, Skeleton, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';

/**
 * WidgetShell — Bento grid içindeki TÜM widget'ların ortak chrome'u.
 *
 * Sorumluluklar:
 *   - Üst başlık + opsiyonel badge ("LIVE", "AI", "BETA")
 *   - Drag handle bölgesi (react-grid-layout `drag-handle` class'ını arar)
 *   - Loading state → Skeleton fallback
 *   - Error state → kullanıcıya ne oldu + retry CTA
 *   - Empty state → "Veri yok" mesajı
 *   - Body slot → widget'ın gerçek içeriği
 *
 * UX kuralı (strategy doc § Performance):
 *   - <150ms yükleme → skeleton GÖSTERME
 *   - 150-1000ms → skeleton + shimmer (default)
 *   - >1000ms → "Veriler yükleniyor..." metni eklenmeli (ilerleme metni)
 *
 * Bu shell `density` prop'u alır — Bento grid'de "compact" tercih edilir
 * çünkü hücreler küçük; standalone kullanımda "comfortable" varsayılan.
 */

const STATE_PROPS = {
    /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir,
       body'den sürüklendiğinde widget içindeki interactive element'leri tetiklemez. */
    DRAG_HANDLE_CLASS: 'widget-drag-handle',
};

function WidgetShell({
    title,
    subtitle,
    badge,
    actions,           /* sağ üstteki action button'lar */
    isLoading = false,
    isError = false,
    errorMessage,
    onRetry,
    isEmpty = false,
    emptyMessage = 'Görüntülenecek veri yok.',
    density = 'compact',
    children,
    className,
}) {
    return (
        <Card variant="default" className={cn('h-full flex flex-col', className)}>
            <CardHeader
                density={density}
                className={cn(
                    /* Header drag-handle olur — sadece BURASI sürüklenir */
                    STATE_PROPS.DRAG_HANDLE_CLASS,
                    'cursor-grab active:cursor-grabbing select-none',
                    'flex-row items-center justify-between flex-none',
                )}
            >
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>
                        {badge}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-text-tertiary truncate">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    /* Action button'ların onClick'leri drag'i tetiklemesin diye stopPropagation */
                    <div
                        className="flex items-center gap-1 flex-none"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        {actions}
                    </div>
                )}
            </CardHeader>

            <CardBody density={density} className="flex-1 overflow-auto">
                {isError && (
                    <ErrorState message={errorMessage} onRetry={onRetry} />
                )}
                {!isError && isLoading && <LoadingState density={density} />}
                {!isError && !isLoading && isEmpty && (
                    <EmptyState message={emptyMessage} />
                )}
                {!isError && !isLoading && !isEmpty && children}
            </CardBody>
        </Card>
    );
}

function LoadingState({ density }) {
    return (
        <div className="flex flex-col gap-3" aria-busy="true">
            <Skeleton height={density === 'spacious' ? 48 : 32} className="w-1/3" />
            <Skeleton height={16} />
            <Skeleton height={16} className="w-5/6" />
            <Skeleton height={16} className="w-3/4" />
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
            <Badge variant="negative" withDot>Yüklenemedi</Badge>
            <p className="text-sm text-text-secondary max-w-xs">
                {message || 'Veri alınırken bir hata oluştu.'}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className={cn(
                        'text-sm text-text-link underline-offset-2 hover:underline',
                        'focus-visible:outline-none focus-visible:shadow-focus rounded-sm',
                    )}
                >
                    Tekrar dene
                </button>
            )}
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center text-center gap-1 py-6">
            <p className="text-sm text-text-tertiary">{message}</p>
        </div>
    );
}

WidgetShell.DRAG_HANDLE_CLASS = STATE_PROPS.DRAG_HANDLE_CLASS;

export { WidgetShell };
