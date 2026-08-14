import React from 'react';
import { Skeleton, EmptyState } from '../../components/ui';
import { cn } from '../../lib/utils';
import { t, currentLocale } from '../../lib/i18n';

/**
 * CardShell — yeni dashboard kart yüzeyi.
 *
 * WidgetShell'in 4-DURUM KONTRATINI aynen devralır (skeleton / empty / error +
 * "Tekrar dene" + son güncelleme / sessiz stale rozeti); değişen yalnız görünüm:
 *   - beyaz yüzey, 14px köşe (rounded-card), katmanlı gölge (shadow-card)
 *   - başlıkta AYIRICI ÇİZGİ YOK
 *   - sürükleme tutamağı (⠿) yalnız düzenleme modunda görünür ve
 *     react-grid-layout'ın draggableHandle'ı odur
 *   - `bleed` verilirse gövde yatay padding'i iptal eder → grafik kartın
 *     alt kenarına taşar
 *   - `accent` üstte 3px durum şeridi çizer (zemin renklendirilmez)
 */

const DRAG_HANDLE_CLASS = 'apya-card-drag-handle';

function CardShell({
    title,
    subtitle,
    badge,
    actions,
    footer,
    accent,                     /* 'negative' | 'warning' — kritik kartların üst şeridi */
    editMode = false,
    isLoading = false,
    isError = false,
    errorMessage,
    onRetry,
    isEmpty = false,
    emptyState,
    skeleton,
    isFetching = false,
    isStale = false,
    dataUpdatedAt,
    bleed = false,
    className,
    bodyClassName,
    children,
}) {
    const showStale = !isLoading && !isError && isStale && isFetching;

    return (
        <section
            className={cn(
                'h-full flex flex-col overflow-hidden',
                'rounded-card shadow-card',
                'bg-surface-base border border-default',
                className,
            )}
        >
            {accent && (
                <span
                    aria-hidden="true"
                    className={cn(
                        'block h-[3px] flex-none',
                        accent === 'negative' ? 'bg-negative-500' : 'bg-warning-500',
                    )}
                />
            )}

            <header
                className={cn(
                    'flex items-start justify-between gap-3 flex-none',
                    bleed ? 'px-[18px] pt-4' : 'px-[18px] pt-4',
                )}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {editMode && (
                        <span
                            className={cn(
                                DRAG_HANDLE_CLASS,
                                'text-accent-soft text-xs tracking-[-2px] cursor-grab active:cursor-grabbing select-none flex-none',
                            )}
                            aria-hidden="true"
                        >
                            ⠿
                        </span>
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <h2 className="text-[13.5px] font-semibold tracking-[-0.01em] truncate text-text-primary">
                                {title}
                            </h2>
                            {badge}
                            {showStale && <StaleIndicator />}
                        </div>
                        {subtitle && (
                            <p className="text-[11.5px] text-text-tertiary truncate">{subtitle}</p>
                        )}
                    </div>
                </div>
                {actions && (
                    /* Aksiyonlara basmak kartı sürüklemesin. */
                    <div
                        className="flex items-center gap-2.5 flex-none"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        {actions}
                    </div>
                )}
            </header>

            <div
                className={cn(
                    /* Kart yüksekliği ızgaradan SABİT gelir, içerik ise değişken:
                       kayıt sayısı, kart genişliği (satırlar sarar) ve kullanıcının
                       verdiği boyut hepsi etkiliyor. Kaydırma olmadan `overflow-hidden`
                       fazlalığı sessizce kesiyordu — kullanıcının "alt açıklamalar
                       kesiliyor" dediği davranış. Kart kendi gerekçesiyle
                       `bodyClassName="overflow-visible"` diyerek vazgeçebilir. */
                    'flex-1 min-h-0 pt-3 overflow-y-auto',
                    bleed ? 'pb-0' : 'px-[18px] pb-[18px]',
                    bleed && 'px-[18px]',
                    bodyClassName,
                )}
            >
                {isError && (
                    <ErrorState message={errorMessage} onRetry={onRetry} dataUpdatedAt={dataUpdatedAt} />
                )}
                {!isError && isLoading && (skeleton ?? <DefaultSkeleton />)}
                {!isError && !isLoading && isEmpty && (emptyState ?? <FallbackEmpty />)}
                {!isError && !isLoading && !isEmpty && children}
            </div>

            {footer && (
                <footer className="flex-none px-[18px] pb-[14px] pt-1">{footer}</footer>
            )}
        </section>
    );
}

function DefaultSkeleton() {
    return (
        <div className="flex flex-col gap-3" aria-busy="true">
            <Skeleton height={28} className="w-1/3" />
            <Skeleton height={14} />
            <Skeleton height={14} className="w-5/6" />
            <Skeleton height={14} className="w-3/4" />
        </div>
    );
}

function FallbackEmpty() {
    return (
        <EmptyState
            compact
            title={t('Common:NoDataToShow', 'Görüntülenecek veri yok')}
            description={t('Common:NoDataYet', 'Yeni veri girildiğinde burada görünecek.')}
        />
    );
}

function ErrorState({ message, onRetry, dataUpdatedAt }) {
    const lastSeen = formatRelative(dataUpdatedAt);
    return (
        <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
            <p className="text-[12.5px] text-text-secondary max-w-xs">
                {message || t('Common:FetchError', 'Veri alınırken bir hata oluştu.')}
            </p>
            {lastSeen && (
                <p className="text-[11px] text-text-tertiary">
                    {t('Common:LastSuccessfulUpdate', 'Son başarılı güncelleme')}: {lastSeen}
                </p>
            )}
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="text-[12.5px] text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                >
                    {t('Common:Retry', 'Tekrar dene')}
                </button>
            )}
        </div>
    );
}

function StaleIndicator() {
    return (
        <span
            className="inline-flex items-center gap-1 text-[11px] text-text-tertiary flex-none"
            title={t('Common:UpdatingInBackground', 'Arka planda güncelleniyor')}
            aria-live="polite"
        >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse" aria-hidden="true" />
            <span>{t('Common:Updating', 'güncelleniyor')}</span>
        </span>
    );
}

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

CardShell.DRAG_HANDLE_CLASS = DRAG_HANDLE_CLASS;

export { CardShell };
