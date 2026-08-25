import React from 'react';
import { Button } from '../components/ui';
import { cn } from '../lib/utils';

const VIEW_LABELS = { month: 'Ay', week: 'Hafta', day: 'Gün', agenda: 'Ajanda' };

/** "2 dk önce" / "3 sa önce" / "dün" — rozet dar, uzun tarih sığmaz. */
function sinceLabel(iso) {
    if (!iso) return null;
    const dk = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (!Number.isFinite(dk) || dk < 0) return null;
    if (dk < 1) return 'az önce';
    if (dk < 60) return `${dk} dk önce`;
    const sa = Math.round(dk / 60);
    if (sa < 24) return `${sa} sa önce`;
    const gun = Math.round(sa / 24);
    return gun === 1 ? 'dün' : `${gun} gün önce`;
}

/** Yeni görev — kabuğun kendi modal yöneticisi; yoksa sayfaya düşer. */
function openNewTask() {
    const url = '/Tasks/CreateModal';
    if (window.abp?.ModalManager) new window.abp.ModalManager(url).open();
    else window.location.href = url;
}

/**
 * Dar kapta birincil eylem: sağ altta sabit yuvarlak düğme.
 *
 * NEDEN AYRI BİLEŞEN: araç çubuğundaki düğmeyi gizleyen koşul ile bunu açan
 * koşul AYNI kaynaktan (CalendarRoot'un `isNarrow`'u) okumak ZORUNDA. Görevler
 * konsolunda biri kabı biri viewport'u ölçtüğü için ara genişlikte iki eylem de
 * kaybolabiliyordu; eylem tek dosyada durunca ikisi sessizce ayrışamaz.
 *
 * Island kökünün DOĞRUDAN çocuğu olarak çizilmeli: baskı kuralı
 * (`#apya-calendar-root > div > *:not(.apya-print-root)`) FAB'ı ancak o zaman
 * gizler. `position: fixed` olduğu için kolonun akışına ve gap'ine girmez.
 */
export function NewTaskFab() {
    return (
        <button
            type="button"
            onClick={openNewTask}
            aria-label="Yeni görev"
            title="Yeni görev"
            /* bottom inline: env() güvenli alanı (iPhone ana ekran çubuğu) keyfi
               Tailwind değeriyle değil, doğrudan yazılıyor. */
            style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            className="fixed right-4 z-fixed grid h-14 w-14 place-items-center rounded-full bg-accent text-text-inverse shadow-lg transition-colors duration-fast hover:bg-accent-600 active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
            <i className="fa fa-plus text-[19px]" aria-hidden="true" />
        </button>
    );
}

/**
 * Üst araç çubuğu: gezinme + görünüm anahtarı + kapasite uyarısı.
 *
 * Oklar görünüme göre adım atar (ay / hafta / gün). Ajanda bugünden ileri akan
 * bir pencere olduğu için oklar orada GİZLENİR — çalışmayan düğme koymamak için.
 *
 * `compact` (dar kap): "Yeni görev" FAB'a devreder, A4 yazdırma ve klavye
 * kısayolları çizilmez — ikisi de telefonda anlamsız. Kalanlar (Senkron, filtre,
 * görünüm sekmeleri) 375px'e sığar; sığmazsa grup sarar, taşmaz.
 */
export function Toolbar({
    title, view, onView, onPrev, onNext, onToday, overloadDays, onHelp,
    filterCount = 0, onClearFilters, lastSyncAt, syncError = false, canCreateTask = true,
    compact = false,
}) {
    const showNav = view !== 'agenda';
    const since = sinceLabel(lastSyncAt);
    return (
        <div className="flex flex-wrap items-center gap-2">
            {showNav && (
                <div className="flex">
                    <button
                        type="button" onClick={onPrev} aria-label="Öncekine git"
                        className="h-9 w-9 rounded-l-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-chevron-left" aria-hidden="true" />
                    </button>
                    <button
                        type="button" onClick={onNext} aria-label="Sonrakine git"
                        className="h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-chevron-right" aria-hidden="true" />
                    </button>
                </div>
            )}

            <Button variant="outline" size="sm" onClick={onToday}>Bugün</Button>

            <h2 className="ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary">
                {title}
            </h2>

            {/* Sağ grup SARAR: dış kabın flex-wrap'i yalnız başlık satırını
                ayırıyordu, grubun kendisi tek satırda kalıp 375px'te sayfayı
                yatay taşırıyordu. Sarma yalnız sığmadığında devreye girer. */}
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                {overloadDays > 0 && (
                    <span
                        className="rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700"
                        title="Günlük kapasitenizi aşan gün sayısı"
                    >
                        <i className="fa fa-triangle-exclamation me-1" aria-hidden="true" />
                        {overloadDays} günde kapasite aşımı
                    </span>
                )}

                {/* Senkron durumu — yalnız bağlı hesap varsa anlamlı. Hata varsa
                    rozet kritik renge döner; "en son ne zaman" bilgisi kaybolmaz. */}
                {(since || syncError) && (
                    <span
                        className={cn(
                            'flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium',
                            syncError ? 'bg-negative-50 text-negative-700' : 'text-text-tertiary',
                        )}
                        title={syncError ? 'Bir dış takvim senkronlanamıyor' : 'Dış takvimlerin son senkron zamanı'}
                    >
                        <span
                            className={cn('h-[6px] w-[6px] rounded-full', syncError ? 'bg-negative' : 'bg-positive')}
                            aria-hidden="true"
                        />
                        Senkron{since ? ` · ${since}` : ''}
                    </span>
                )}

                {/* Filtre — kaç kaynağın kapalı olduğunu gösterir, tıklayınca açar.
                    Sayaç 0'ken düğme çizilmez: "0 filtre" diye bir durum yok. */}
                {filterCount > 0 && onClearFilters && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        title="Filtreleri temizle — kapalı kaynakları geri aç"
                        className="flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        Filtre
                        <span className="rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent">
                            {filterCount}
                        </span>
                    </button>
                )}

                {!compact && (
                    <button
                        type="button"
                        onClick={() => window.print()}
                        title="A4 yatay, iki sayfa"
                        className="h-9 rounded-md border border-default bg-surface-base px-2.5 text-[12px] text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-print" aria-hidden="true" /><span className="sr-only">Yazdır</span>
                    </button>
                )}

                {onHelp && !compact && (
                    <button
                        type="button"
                        onClick={onHelp}
                        title="Klavye kısayolları (?)"
                        aria-label="Klavye kısayolları"
                        className="h-9 w-9 rounded-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-keyboard" aria-hidden="true" />
                    </button>
                )}

                <div role="tablist" aria-label="Görünüm" className="flex rounded-md border border-default bg-surface-base p-0.5">
                    {Object.entries(VIEW_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={view === key}
                            onClick={() => onView(key)}
                            className={cn(
                                'rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                view === key ? 'bg-primary-subtle text-accent' : 'text-text-secondary hover:bg-surface-hover',
                            )}
                        >
                            {/* Etiketler dar ekranda da tam yazılır: "Ay" ve "Ajanda" tek harfe
                                inince ikisi de "A" oluyor ve seçim ayırt edilemiyordu. */}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Dar kapta buton FAB'a devreder — bkz. NewTaskFab. */}
                {canCreateTask && !compact && (
                    <Button variant="primary" size="sm" onClick={openNewTask}>
                        <i className="fa fa-plus me-1.5" aria-hidden="true" />Yeni görev
                    </Button>
                )}
            </div>
        </div>
    );
}
