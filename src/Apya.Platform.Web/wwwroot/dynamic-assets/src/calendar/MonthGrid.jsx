import React from 'react';
import { cn } from '../lib/utils';
import {
    RISK, SOURCES, buildDayCell, dayLoad, fmt, isoDay, monthGridDays, summaryLabel,
} from './lib/model';

const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/**
 * Risk üç kanaldan anlatılır: renk + DESEN + ikon (renk körlüğü için tek başına
 * renk yeterli değil). Desen inline background-image ile verilir — Tailwind'de
 * karşılığı yok ve tek kural olduğu için CSS dosyasına taşımaya değmez.
 */
const RISK_STYLE = {
    [RISK.OVERDUE]: {
        pill: 'bg-negative-50 text-negative-700',
        /* çapraz tarama */
        pattern: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)',
    },
    [RISK.DUE_TODAY]: {
        pill: 'bg-warning-50 text-warning-700',
        /* dikey çizgi */
        pattern: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)',
    },
};

function Pill({ item, onSelect }) {
    const meta = SOURCES[item.source];
    const risk = RISK_STYLE[item.risk];

    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(item); }}
            title={item.subtitle ? `${item.title} — ${item.subtitle}` : item.title}
            style={risk ? { backgroundImage: risk.pattern } : undefined}
            className={cn(
                'flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                risk ? risk.pill : 'bg-neutral-subtle text-text-primary',
                item.isDone && 'line-through opacity-65',
            )}
        >
            {meta && <i className={cn('fa shrink-0 text-[9px] opacity-70', meta.icon)} aria-hidden="true" />}
            <span className="truncate">{item.title}</span>
        </button>
    );
}

function SummaryRow({ summary, onSelect }) {
    const meta = SOURCES[summary.source];
    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(summary.source); }}
            className={cn(
                'flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left',
                'text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
        >
            {meta && <i className={cn('fa shrink-0 text-[9px] opacity-60', meta.icon)} aria-hidden="true" />}
            <span className="truncate">{summaryLabel(summary)}</span>
        </button>
    );
}

/** Gün yükü çubuğu: kapasiteye kadar nötr, aşan kısım kırmızı. */
function CapacityBar({ load, capacity }) {
    if (!capacity || load <= 0) return null;
    const ratio = Math.min(load / capacity, 1);
    const over = load > capacity;

    return (
        <div
            className="mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle"
            title={`Gün yükü ${fmt.hours(load)} / kapasite ${fmt.hours(capacity)}`}
            aria-label={`Gün yükü ${fmt.hours(load)}, kapasite ${fmt.hours(capacity)}`}
        >
            <span
                className={cn('h-full', over ? 'bg-negative' : 'bg-accent')}
                style={{ width: `${ratio * 100}%` }}
            />
        </div>
    );
}

export function MonthGrid({ month, byDay, today, capacity, onSelectItem, onSelectDay, selectedDay }) {
    const days = monthGridDays(month);
    const todayKey = isoDay(today);

    return (
        <div className="overflow-hidden rounded-card border border-default bg-surface-base">
            <div className="grid grid-cols-7 border-b border-default bg-surface-raised">
                {DOW.map((d, i) => (
                    <div
                        key={d}
                        className={cn(
                            'px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider',
                            i > 4 ? 'text-text-tertiary opacity-70' : 'text-text-tertiary',
                        )}
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days.map((day) => {
                    const key = isoDay(day);
                    const items = byDay[key] ?? [];
                    const { pills, summaries } = buildDayCell(items);
                    const load = dayLoad(items);
                    const isOtherMonth = day.getMonth() !== month.getMonth();
                    const isToday = key === todayKey;
                    const isSelected = key === selectedDay;

                    return (
                        <div
                            key={key}
                            role="gridcell"
                            tabIndex={-1}
                            onClick={() => onSelectDay(key)}
                            className={cn(
                                'flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5',
                                'transition-colors duration-fast last:border-r-0 hover:bg-surface-hover',
                                isOtherMonth ? 'bg-surface-sunken' : 'bg-surface-base',
                                isSelected && 'ring-2 ring-inset ring-border-focus',
                            )}
                        >
                            <div className="flex items-center justify-between">
                                {load > 0 && capacity && load > capacity && (
                                    <span className="rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700">
                                        {fmt.hours(load)}
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        'ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums',
                                        isToday && 'bg-accent text-white',
                                        !isToday && isOtherMonth && 'text-text-tertiary opacity-60',
                                        !isToday && !isOtherMonth && 'text-text-secondary',
                                    )}
                                >
                                    {day.getDate()}
                                </span>
                            </div>

                            {pills.map((item) => (
                                <Pill key={item.key} item={item} onSelect={onSelectItem} />
                            ))}
                            {summaries.map((summary) => (
                                <SummaryRow
                                    key={`${key}-${summary.source}`}
                                    summary={summary}
                                    onSelect={() => onSelectDay(key)}
                                />
                            ))}

                            <CapacityBar load={load} capacity={capacity} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
