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

function Pill({ item, onSelect, onDragStart, isPending, hasError }) {
    const meta = SOURCES[item.source];
    const risk = RISK_STYLE[item.risk];
    /* Taşınamayan öğe (fatura vadesi vb.) sürüklenemez: kullanıcı sunucunun
       reddedeceği bir hareketi hiç başlatmasın. */
    const draggable = item.canReschedule && !item.isDone;

    return (
        <button
            type="button"
            draggable={draggable}
            onDragStart={draggable ? (e) => {
                e.stopPropagation();
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.key);
                onDragStart(item);
            } : undefined}
            onClick={(e) => { e.stopPropagation(); onSelect(item); }}
            title={item.subtitle ? `${item.title} — ${item.subtitle}` : item.title}
            style={risk ? { backgroundImage: risk.pattern } : undefined}
            className={cn(
                'flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                risk ? risk.pill : 'bg-neutral-subtle text-text-primary',
                item.isDone && 'line-through opacity-65',
                draggable && 'cursor-grab active:cursor-grabbing',
                /* Hata SATIRDA kalır — toast'a kaçmaz. */
                hasError && 'ring-1 ring-negative-500',
                isPending && 'opacity-60',
            )}
        >
            {isPending
                ? <i className="fa fa-circle-notch fa-spin shrink-0 text-[9px]" aria-hidden="true" />
                : meta && <i className={cn('fa shrink-0 text-[9px] opacity-70', meta.icon)} aria-hidden="true" />}
            <span className="truncate">{item.title}</span>
            {hasError && <i className="fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]" aria-hidden="true" />}
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

export function MonthGrid({
    month, byDay, today, capacity, onSelectItem, onSelectDay, selectedDay,
    onDropItem, pending = {}, errors = {},
    focusedDay, onFocusDay, onNavigate,
}) {
    const days = monthGridDays(month);
    const todayKey = isoDay(today);
    const [dragging, setDragging] = React.useState(null);
    const [dropTarget, setDropTarget] = React.useState(null);
    const gridRef = React.useRef(null);

    /* Roving tabindex: grid TEK sekme durağıdır. 42 hücre sekme sırasına girseydi
       klavye kullanıcısı takvimi geçmek için 42 kez Tab'lardı; içeri girildikten
       sonra oklarla gezilir (WAI-ARIA grid deseni). */
    const focusedKey = focusedDay ?? selectedDay ?? todayKey;

    const moveFocus = (deltaDays) => {
        const next = addDays(new Date(`${focusedKey}T00:00:00`), deltaDays);
        /* Görünen ayın dışına çıkılırsa ay değişir — odak kaybolmasın. */
        if (!days.some((d) => isoDay(d) === isoDay(next))) onNavigate?.(next);
        onFocusDay?.(isoDay(next));
    };

    const onKeyDown = (e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (step) {
            e.preventDefault();
            moveFocus(step);
            return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectDay(focusedKey);
        }
    };

    /* Odak DOM'a da taşınır ki ekran okuyucu hangi hücrede olunduğunu söylesin.
       Yalnız grid ZATEN odaktayken: sayfa yüklenince odağı çalmayalım. */
    React.useEffect(() => {
        const node = gridRef.current?.querySelector(`[data-day="${focusedKey}"]`);
        if (node && gridRef.current?.contains(document.activeElement)) node.focus();
    }, [focusedKey]);

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

            <div
                ref={gridRef}
                role="grid"
                aria-label="Ay takvimi"
                tabIndex={0}
                onKeyDown={onKeyDown}
                className="grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus"
            >
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
                            data-day={key}
                            tabIndex={key === focusedKey ? 0 : -1}
                            aria-selected={isSelected}
                            aria-label={`${fmt.dayTitle(day)}${items.length ? `, ${items.length} öğe` : ', boş'}`}
                            onClick={() => { onFocusDay?.(key); onSelectDay(key); }}
                            onDragOver={dragging ? (e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                if (dropTarget !== key) setDropTarget(key);
                            } : undefined}
                            onDragLeave={dragging ? () => setDropTarget((t) => (t === key ? null : t)) : undefined}
                            onDrop={dragging ? (e) => {
                                e.preventDefault();
                                const item = dragging;
                                setDragging(null);
                                setDropTarget(null);
                                if (item && item.date.slice(0, 10) !== key) {
                                    onDropItem(item, new Date(`${key}T00:00:00`));
                                }
                            } : undefined}
                            className={cn(
                                'flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5',
                                'transition-colors duration-fast last:border-r-0 hover:bg-surface-hover',
                                isOtherMonth ? 'bg-surface-sunken' : 'bg-surface-base',
                                isSelected && 'ring-2 ring-inset ring-border-focus',
                                dropTarget === key && 'bg-primary-subtle ring-2 ring-inset ring-accent',
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
                                <Pill
                                    key={item.key}
                                    item={item}
                                    onSelect={onSelectItem}
                                    onDragStart={setDragging}
                                    isPending={!!pending[item.key]}
                                    hasError={!!errors[item.key]}
                                />
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
