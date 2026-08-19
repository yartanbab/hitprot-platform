import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import {
    RISK, SOURCES, dayLoad, fmt, hourRange, isTimed, isoDay, minutesOfDay, timeLabel,
} from './lib/model';

const HOUR_PX = 44;
const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const RISK_PILL = {
    [RISK.OVERDUE]: 'bg-negative-50 text-negative-700',
    [RISK.DUE_TODAY]: 'bg-warning-50 text-warning-700',
};

/** Gün başlığındaki yük çubuğu: kapasiteye kadar nötr, aşan kısım kırmızı. */
function LoadBar({ load, capacity }) {
    if (!capacity || load <= 0) return null;
    const over = load > capacity;
    return (
        <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle">
            <span
                className={cn('block h-full', over ? 'bg-negative' : 'bg-accent')}
                style={{ width: `${Math.min(load / capacity, 1) * 100}%` }}
            />
        </div>
    );
}

/**
 * Hafta ve Gün görünümü — tek bileşen, gün sayısı değişir.
 *
 * Tasarımın ana kuralı: SON TARİHLER SAAT IZGARASINA İNMEZ. APYA öğeleri (görev,
 * fatura, hibe…) gün bazlıdır; saatli bir yere konsalardı uydurma bir saat
 * gösterilirdi. Bu yüzden üstte ayrı "son tarih şeridi" vardır; alttaki ızgara
 * yalnız dış takvimden gelen SAATLİ etkinlikler içindir ve salt-okunurdur.
 */
export function WeekGrid({ days, byDay, today, capacity, onSelectItem, onSelectDay, selectedDay }) {
    const todayKey = isoDay(today);
    const gridRef = useRef(null);
    const [nowMinutes, setNowMinutes] = useState(() => {
        const n = new Date();
        return n.getHours() * 60 + n.getMinutes();
    });

    /* "Şimdi" çizgisi dakikada bir ilerler — sayfa açık kalırsa donmasın. */
    useEffect(() => {
        const id = setInterval(() => {
            const n = new Date();
            setNowMinutes(n.getHours() * 60 + n.getMinutes());
        }, 60_000);
        return () => clearInterval(id);
    }, []);

    const dayKeys = days.map(isoDay);
    const timedByDay = {};
    const alldayByDay = {};
    for (const key of dayKeys) {
        const items = byDay[key] ?? [];
        timedByDay[key] = items.filter(isTimed);
        alldayByDay[key] = items.filter((i) => !isTimed(i));
    }

    const allTimed = dayKeys.flatMap((k) => timedByDay[k]);
    const { start: startHour, end: endHour } = hourRange(allTimed);
    const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
    const gridHeight = (endHour - startHour) * HOUR_PX;

    const showNowLine = dayKeys.includes(todayKey)
        && nowMinutes >= startHour * 60 && nowMinutes <= endHour * 60;

    /* Bugün ızgarada görünüyorsa "şimdi"yi görünür alana getir — kullanıcı
       her açılışta elle kaydırmasın. */
    useEffect(() => {
        if (!showNowLine || !gridRef.current) return;
        const offset = ((nowMinutes - startHour * 60) / 60) * HOUR_PX;
        gridRef.current.scrollTop = Math.max(0, offset - 120);
        // yalnız ilk yerleşimde
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNowLine, startHour]);

    return (
        <div className="overflow-hidden rounded-card border border-default bg-surface-base">
            {/* Gün başlıkları */}
            <div
                className="grid border-b border-default bg-surface-raised"
                style={{ gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` }}
            >
                <div />
                {days.map((day) => {
                    const key = isoDay(day);
                    const load = dayLoad(byDay[key] ?? []);
                    const isToday = key === todayKey;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSelectDay(key)}
                            className={cn(
                                'border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
                                selectedDay === key && 'bg-primary-subtle',
                            )}
                        >
                            <span className="flex items-baseline gap-1.5">
                                <span className={cn(
                                    'text-[10.5px] font-bold uppercase tracking-wider',
                                    isToday ? 'text-accent' : 'text-text-tertiary',
                                )}>
                                    {DOW[(day.getDay() + 6) % 7]}
                                </span>
                                <span className={cn(
                                    'font-mono text-[13px] font-semibold tabular-nums',
                                    isToday ? 'text-accent' : 'text-text-primary',
                                )}>
                                    {day.getDate()}
                                </span>
                                {capacity && load > capacity && (
                                    <span className="ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700">
                                        {fmt.hours(load)}
                                    </span>
                                )}
                            </span>
                            <LoadBar load={load} capacity={capacity} />
                        </button>
                    );
                })}
            </div>

            {/* Son tarih şeridi — saat ızgarasına inmeyen APYA öğeleri */}
            <div
                className="grid border-b border-default"
                style={{ gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` }}
            >
                <div className="flex items-start justify-end px-1.5 py-1.5 text-[9.5px] font-bold uppercase leading-tight tracking-wider text-text-tertiary">
                    Son<br />tarih
                </div>
                {dayKeys.map((key) => (
                    <div key={key} className="flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1">
                        {alldayByDay[key].slice(0, 4).map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => onSelectItem(item)}
                                title={item.title}
                                className={cn(
                                    'flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                    RISK_PILL[item.risk] ?? 'bg-neutral-subtle text-text-primary',
                                    item.isDone && 'line-through opacity-65',
                                )}
                            >
                                {SOURCES[item.source] && (
                                    <i className={cn('fa shrink-0 text-[9px] opacity-70', SOURCES[item.source].icon)} aria-hidden="true" />
                                )}
                                <span className="truncate">{item.title}</span>
                            </button>
                        ))}
                        {alldayByDay[key].length > 4 && (
                            <button
                                type="button"
                                onClick={() => onSelectDay(key)}
                                className="px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary"
                            >
                                +{alldayByDay[key].length - 4} öğe
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Saat ızgarası — yalnız dış takvim etkinlikleri */}
            <div ref={gridRef} className="max-h-[520px] overflow-y-auto">
                <div
                    className="relative grid"
                    style={{
                        gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))`,
                        height: `${gridHeight}px`,
                    }}
                >
                    {/* Saat etiketleri */}
                    <div className="relative">
                        {hours.map((h, i) => (
                            <div
                                key={h}
                                className="absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary"
                                style={{ top: `${i * HOUR_PX}px` }}
                            >
                                {String(h).padStart(2, '0')}:00
                            </div>
                        ))}
                    </div>

                    {dayKeys.map((key) => (
                        <div key={key} className="relative border-l border-subtle">
                            {hours.map((h, i) => (
                                <div
                                    key={h}
                                    className="absolute inset-x-0 border-t border-subtle"
                                    style={{ top: `${i * HOUR_PX}px` }}
                                />
                            ))}

                            {timedByDay[key].map((item) => {
                                const startMin = minutesOfDay(item.startTime);
                                const endMin = item.endTime ? minutesOfDay(item.endTime) : startMin + 60;
                                const top = ((startMin - startHour * 60) / 60) * HOUR_PX;
                                const height = Math.max(((endMin - startMin) / 60) * HOUR_PX, 18);
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => onSelectItem(item)}
                                        title={`${item.title} · ${timeLabel(item.startTime)}`}
                                        /* Dış etkinlik salt-okunur: taralı zemin onu APYA öğelerinden ayırır. */
                                        style={{
                                            top: `${top}px`,
                                            height: `${height}px`,
                                            backgroundImage:
                                                'repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)',
                                        }}
                                        className={cn(
                                            'absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle',
                                            'px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                                        )}
                                    >
                                        <span className="block truncate font-semibold">{item.title}</span>
                                        <span className="block truncate text-[9.5px] text-text-tertiary">
                                            {timeLabel(item.startTime)}
                                            {item.endTime ? `–${timeLabel(item.endTime)}` : ''}
                                        </span>
                                    </button>
                                );
                            })}

                            {showNowLine && key === todayKey && (
                                <div
                                    className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative"
                                    style={{ top: `${((nowMinutes - startHour * 60) / 60) * HOUR_PX}px` }}
                                    aria-hidden="true"
                                >
                                    <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {allTimed.length === 0 && (
                    <p className="border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary">
                        Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır.
                    </p>
                )}
            </div>
        </div>
    );
}
