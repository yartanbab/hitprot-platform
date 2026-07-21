import React from 'react';
import { Card, CardHeader, CardTitle, CardBody, Skeleton, Badge, EmptyState } from '../../components/ui';
import { cn } from '../../lib/utils';
import { t, currentLocale } from '../../lib/i18n';

/**
 * WidgetShell — Bento grid içindeki TÜM widget'ların ortak chrome'u.
 *
 * 4-state kontratı (UX strategy doc § Widget kontratı):
 *   1. skeleton  → shape-aware. Caller `skeleton` prop'una SkeletonHeadline /
 *                   SkeletonChart / SkeletonList verir; yoksa generic 3-satır.
 *   2. empty     → ikon + 1 satır + 1 CTA. "Veri yok" yasak.
 *                   Caller `emptyState={<EmptyState ... />}` ile özelleştirir;
 *                   yoksa fallback nötr ipucu.
 *   3. error     → "Yeniden dene" + son başarılı snapshot timestamp'i
 *                   (caller `dataUpdatedAt` verirse "X dk önce güncellendi").
 *   4. stale     → Sessiz "Güncelleniyor…" rozeti header'da.
 *                   Caller `isStale` + `isFetching` verir; ikisi de true ise
 *                   eski veri görünür ama yenisi geliyor.
 *
 * UX kuralı (strategy doc § Performance):
 *   - <150ms yükleme → skeleton GÖSTERME (caller `isLoading` <150ms ise debounce'lamalı,
 *     React Query default'unda olabiliyor; primitive bunu enforce etmez)
 *   - 150-1000ms → skeleton (default davranış)
 *   - >1000ms → skeleton + "Veriler yükleniyor..." metni (caller eklemeli)
 */

const STATE_PROPS = {
    /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
    DRAG_HANDLE_CLASS: 'widget-drag-handle',
};

function WidgetShell({
    title,
    subtitle,
    badge,
    actions,                    /* sağ üstteki action button'lar */
    isLoading = false,
    isError = false,
    errorMessage,
    onRetry,
    isEmpty = false,
    emptyMessage,               /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
    emptyState,                 /* yeni: <EmptyState .../> ReactNode */
    skeleton,                   /* yeni: shape-aware loading state — ReactNode */
    isFetching = false,         /* React Query background refetch */
    isStale = false,            /* React Query staleTime aşıldı */
    dataUpdatedAt,              /* number (ms) | Date | undefined — son başarılı fetch */
    density = 'compact',
    children,
    className,
}) {
    /* Stale banner: stale + background fetch sürüyorsa "güncelleniyor"
       sinyali. Tek başına stale (refetch yok) ise sessiz kal — refetch
       window-focus'ta otomatik olur, kullanıcıyı uyarmana gerek yok. */
    const showStale = !isLoading && !isError && isStale && isFetching;

    return (
        <Card variant="default" className={cn('h-full flex flex-col', className)}>
            <CardHeader
                density={density}
                className={cn(
                    STATE_PROPS.DRAG_HANDLE_CLASS,
                    'cursor-grab active:cursor-grabbing select-none',
                    'flex-row items-center justify-between flex-none',
                )}
            >
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>
                        {badge}
                        {showStale && <StaleIndicator />}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-text-tertiary truncate">{subtitle}</p>
                    )}
                </div>
                {actions && (
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
                    <ErrorState
                        message={errorMessage}
                        onRetry={onRetry}
                        dataUpdatedAt={dataUpdatedAt}
                    />
                )}
                {!isError && isLoading && (skeleton ?? <DefaultLoadingState density={density} />)}
                {!isError && !isLoading && isEmpty && (
                    emptyState ?? <FallbackEmptyState message={emptyMessage} />
                )}
                {!isError && !isLoading && !isEmpty && children}
            </CardBody>
        </Card>
    );
}

function DefaultLoadingState({ density }) {
    return (
        <div className="flex flex-col gap-3" aria-busy="true">
            <Skeleton height={density === 'spacious' ? 48 : 32} className="w-1/3" />
            <Skeleton height={16} />
            <Skeleton height={16} className="w-5/6" />
            <Skeleton height={16} className="w-3/4" />
        </div>
    );
}

function FallbackEmptyState({ message }) {
    /* Caller emptyState vermediyse — geriye düşüş. Yeni widget'larda EmptyState
       primitive'i tercih edilmeli (UX kontrat: ikon + başlık + CTA). */
    return (
        <EmptyState
            compact
            title={message ?? t('Common:NoDataToShow', 'Görüntülenecek veri yok')}
            description={t('Common:NoDataYet', 'Yeni veri girildiğinde burada görünecek.')}
        />
    );
}

function ErrorState({ message, onRetry, dataUpdatedAt }) {
    const lastSeen = formatRelative(dataUpdatedAt);
    return (
        <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
            <Badge variant="negative" withDot>{t('Common:LoadFailed', 'Yüklenemedi')}</Badge>
            <p className="text-sm text-text-secondary max-w-xs">
                {message || t('Common:FetchError', 'Veri alınırken bir hata oluştu.')}
            </p>
            {lastSeen && (
                /* Son başarılı snapshot — kullanıcı "veri ne kadar eski" bilsin.
                   Critical UX: kullanıcı kararlarını eski veriyle vermesin diye. */
                <p className="text-xs text-text-tertiary">
                    {t('Common:LastSuccessfulUpdate', 'Son başarılı güncelleme')}: {lastSeen}
                </p>
            )}
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className={cn(
                        'text-sm text-text-link underline-offset-2 hover:underline',
                        'focus-visible:outline-none focus-visible:shadow-focus rounded-sm',
                    )}
                >
                    {t('Common:Retry', 'Tekrar dene')}
                </button>
            )}
        </div>
    );
}

/* Sessiz stale rozeti — küçük spinner-dot + tooltip. Kullanıcıyı rahatsız
   etmesin diye text minimal. */
function StaleIndicator() {
    return (
        <span
            className="inline-flex items-center gap-1 text-xs text-text-tertiary"
            title={t('Common:UpdatingInBackground', 'Arka planda güncelleniyor')}
            aria-live="polite"
        >
            <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse"
                aria-hidden="true"
            />
            <span>{t('Common:Updating', 'güncelleniyor')}</span>
        </span>
    );
}

/* Relative time — son başarılı veri için "3 dk önce" tarzı kısa biçim.
   Lokal aktif ABP kültüründen gelir (sabit 'tr-TR' dil değişince biçimi
   Türkçe bırakıyordu). */
function formatRelative(when) {
    if (when == null) return null;
    const ts = when instanceof Date ? when.getTime() : Number(when);
    if (!Number.isFinite(ts)) return null;
    const diffSec = Math.round((ts - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    const fmt = new Intl.RelativeTimeFormat(currentLocale(), { numeric: 'auto' });
    if (abs < 60)    return fmt.format(diffSec, 'second');
    if (abs < 3600)  return fmt.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400) return fmt.format(Math.round(diffSec / 3600), 'hour');
    return fmt.format(Math.round(diffSec / 86400), 'day');
}

WidgetShell.DRAG_HANDLE_CLASS = STATE_PROPS.DRAG_HANDLE_CLASS;

export { WidgetShell };
