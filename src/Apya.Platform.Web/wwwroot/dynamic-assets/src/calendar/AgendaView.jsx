import React from 'react';
import { EmptyState } from '../components/ui';
import { cn } from '../lib/utils';
import { ItemRow } from './ItemRow';
import { buildAgenda, fmt } from './lib/model';

/**
 * Ajanda — grid'in yapamadığı: sıralama önceliğe göre.
 * Gecikmiş blok en üstte, sonra günü gününe. Tamamlanmış öğeler listeye alınmaz.
 */
export function AgendaView({ items, today, onSelectItem, onSmartDefer }) {
    const { overdue, days } = buildAgenda(items, today);

    if (overdue.length === 0 && days.length === 0) {
        return (
            <div className="rounded-card border border-subtle bg-surface-base p-6">
                <EmptyState
                    icon={<i className="fa fa-mug-hot" />}
                    title="Planlanmış bir şey yok"
                    description="Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {overdue.length > 0 && (
                <section className="rounded-card border border-negative-100 bg-surface-base">
                    <header className="flex items-center gap-2 border-b border-negative-100 px-3 py-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-negative-700">Gecikmiş</span>
                        <span className="font-mono text-[11px] font-semibold tabular-nums text-negative-700">{overdue.length}</span>
                        {onSmartDefer && (
                            <button
                                type="button"
                                onClick={onSmartDefer}
                                className="ms-auto rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                            >
                                Akıllı ertele
                            </button>
                        )}
                    </header>
                    <div className="p-1">
                        {overdue.map((item) => (
                            <ItemRow key={item.key} item={item} onSelect={onSelectItem} showDate />
                        ))}
                    </div>
                </section>
            )}

            {days.map((day) => (
                <section key={day.key} className="rounded-card border border-subtle bg-surface-base">
                    <header className={cn(
                        'flex items-center justify-between border-b border-subtle px-3 py-2',
                        day.isToday && 'border-b-accent',
                    )}>
                        <span className={cn(
                            'text-[11px] font-bold uppercase tracking-wider',
                            day.isToday ? 'text-accent' : 'text-text-tertiary',
                        )}>
                            {fmt.dayTitle(day.date)}{day.isToday ? ' · Bugün' : ''}
                        </span>
                        <span className="font-mono text-[11px] tabular-nums text-text-tertiary">{day.items.length}</span>
                    </header>
                    <div className="p-1">
                        {day.items.map((item) => (
                            <ItemRow key={item.key} item={item} onSelect={onSelectItem} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
