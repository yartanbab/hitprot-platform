import React from 'react';
import { Button } from '../components/ui';
import { cn } from '../lib/utils';
import { fmt } from './lib/model';

const VIEW_LABELS = { month: 'Ay', agenda: 'Ajanda' };

/**
 * Üst araç çubuğu: ay gezinme + görünüm anahtarı + kapasite uyarısı.
 *
 * Hafta ve Gün görünümleri bilerek YOK: saat ızgarası dış takvim etkinliklerini
 * gerektiriyor, o veri Faz 4'te geliyor. Çalışmayan bir düğme koymaktansa
 * eksik bırakıldı.
 */
export function Toolbar({ month, view, onView, onPrev, onNext, onToday, overloadDays }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex">
                <button
                    type="button" onClick={onPrev} aria-label="Önceki ay"
                    className="h-9 w-9 rounded-l-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                    <i className="fa fa-chevron-left" aria-hidden="true" />
                </button>
                <button
                    type="button" onClick={onNext} aria-label="Sonraki ay"
                    className="h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                    <i className="fa fa-chevron-right" aria-hidden="true" />
                </button>
            </div>

            <Button variant="outline" size="sm" onClick={onToday}>Bugün</Button>

            <h2 className="ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary">
                {fmt.monthTitle(month)}
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
