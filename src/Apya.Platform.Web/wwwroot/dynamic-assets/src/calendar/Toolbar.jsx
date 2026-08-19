import React from 'react';
import { Button } from '../components/ui';
import { cn } from '../lib/utils';

const VIEW_LABELS = { month: 'Ay', week: 'Hafta', day: 'Gün', agenda: 'Ajanda' };

/**
 * Üst araç çubuğu: gezinme + görünüm anahtarı + kapasite uyarısı.
 *
 * Oklar görünüme göre adım atar (ay / hafta / gün). Ajanda bugünden ileri akan
 * bir pencere olduğu için oklar orada GİZLENİR — çalışmayan düğme koymamak için.
 */
export function Toolbar({ title, view, onView, onPrev, onNext, onToday, overloadDays, onHelp }) {
    const showNav = view !== 'agenda';
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

            <div className="ml-auto flex items-center gap-2">
                {overloadDays > 0 && (
                    <span
                        className="rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700"
                        title="Günlük kapasitenizi aşan gün sayısı"
                    >
                        <i className="fa fa-triangle-exclamation me-1" aria-hidden="true" />
                        {overloadDays} günde kapasite aşımı
                    </span>
                )}

                <button
                    type="button"
                    onClick={() => window.print()}
                    title="A4 yatay, iki sayfa"
                    className="h-9 rounded-md border border-default bg-surface-base px-2.5 text-[12px] text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                    <i className="fa fa-print" aria-hidden="true" /><span className="sr-only">Yazdır</span>
                </button>

                {onHelp && (
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
            </div>
        </div>
    );
}
