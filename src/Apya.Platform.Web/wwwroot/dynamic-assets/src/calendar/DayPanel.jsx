import React from 'react';
import { EmptyState } from '../components/ui';
import { cn } from '../lib/utils';
import { ItemRow } from './ItemRow';
import { SOURCES, dayLoad, fmt } from './lib/model';

/**
 * Seçili günün içeriği. Faz 3'te bu panelin öğe satırları etkinlik drawer'ını
 * açacak (tamamla / ertele / son tarih değiştir); şu an okuma amaçlıdır.
 *
 * `onClose` verilirse kapatma düğmesi çıkar — tablet/mobilde panel takvimin
 * üstüne bindiği için kapatılabilmesi şart.
 */
export function DayPanel({ dayKey, items, capacity, onSelectItem, onClose }) {
    const date = new Date(`${dayKey}T00:00:00`);
    const load = dayLoad(items);
    const over = capacity && load > capacity;

    const counts = items.reduce((acc, item) => {
        acc[item.source] = (acc[item.source] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <aside className="flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base">
            <header className="flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5">
                <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-text-primary">{fmt.dayTitle(date)}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-text-tertiary">
                        {Object.keys(counts).length === 0
                            ? 'Planlanmış öğe yok'
                            : Object.entries(counts)
                                .map(([source, count]) => `${count} ${SOURCES[source]?.plural ?? 'öğe'}`)
                                .join(' · ')}
                    </p>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Günü kapat"
                        className="shrink-0 rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                )}
            </header>

            {capacity && load > 0 && (
                <div className={cn(
                    'flex items-center justify-between border-b px-3 py-2 text-[11.5px]',
                    over ? 'border-negative-100 bg-negative-50 text-negative-700' : 'border-subtle text-text-secondary',
                )}>
                    <span className="font-semibold">{over ? 'Kapasite aşımı' : 'Gün yükü'}</span>
                    <span className="font-mono tabular-nums">{fmt.hours(load)} / {fmt.hours(capacity)}</span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-1">
                {items.length === 0 ? (
                    <EmptyState
                        compact
                        icon={<i className="fa fa-calendar-day" />}
                        title="Bu gün boş"
                        description="Bu güne düşen bir öğe yok."
                    />
                ) : (
                    items.map((item) => <ItemRow key={item.key} item={item} onSelect={onSelectItem} />)
                )}
            </div>
        </aside>
    );
}
