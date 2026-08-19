import React from 'react';
import { cn } from '../lib/utils';
import {
    RISK, SOURCES, buildAgenda, fmt, isoDay, mondayOf, monthGridDays, addDays,
} from './lib/model';

const DOW = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

/**
 * A4 YATAY baskı çıktısı — iki sayfa: (1) aylık takvim, (2) haftalık ajanda.
 *
 * Ekran renkleri baskıda SADELEŞİR: dolgu yok, risk sol kenar çizgisi + koyu
 * metinle anlatılır. Renkli dolgu hem toneri yer hem de siyah-beyaz çıktıda
 * ayırt edilemez; kenar çizgisi ikisinde de okunur.
 *
 * Ajanda satırlarında ELLE işaretlenebilir onay kutusu vardır (kağıt üstünde
 * işaretlemek için) — tamamlanmış öğeler listeye alınmaz.
 */
export function PrintView({ items, month, today, generatedAt }) {
    const days = monthGridDays(month);
    const todayKey = isoDay(today);

    const byDay = {};
    for (const item of items ?? []) {
        (byDay[item.date.slice(0, 10)] ??= []).push(item);
    }

    const weekStart = mondayOf(today);
    const weekItems = (items ?? []).filter((i) => {
        const key = i.date.slice(0, 10);
        return key >= isoDay(weekStart) && key <= isoDay(addDays(weekStart, 7));
    });
    const { overdue, days: agendaDays } = buildAgenda(weekItems, today);

    const riskBorder = (risk) => (
        risk === RISK.OVERDUE ? 'border-l-[3px] border-l-black'
            : risk === RISK.DUE_TODAY ? 'border-l-[3px] border-l-neutral-500'
                : 'border-l-[3px] border-l-neutral-300'
    );

    return (
        <div className="apya-print-root hidden print:block">
            {/* ── Sayfa 1: aylık takvim ── */}
            <section className="apya-print-page">
                <header className="flex items-end justify-between border-b-2 border-black pb-2">
                    <div>
                        <p className="text-[8pt] font-bold uppercase tracking-widest text-neutral-500">APYA · Takvim</p>
                        <h1 className="mt-1 text-[22pt] font-semibold capitalize leading-none">
                            {fmt.monthTitle(month)}
                        </h1>
                    </div>
                    <div className="text-right text-[8pt] text-neutral-500">
                        <p>Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün</p>
                        <p>{generatedAt} tarihinde oluşturuldu · Sayfa 1 / 2</p>
                    </div>
                </header>

                <div className="mt-3 grid grid-cols-7">
                    {DOW.map((d) => (
                        <div key={d} className="pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 border-l border-t border-neutral-300">
                    {days.map((day) => {
                        const key = isoDay(day);
                        const dayItems = byDay[key] ?? [];
                        const isOther = day.getMonth() !== month.getMonth();
                        return (
                            <div
                                key={key}
                                className={cn(
                                    'min-h-[62px] border-b border-r border-neutral-300 p-1',
                                    key === todayKey && 'ring-1 ring-inset ring-black',
                                )}
                            >
                                <p className={cn(
                                    'text-right font-mono text-[9pt] font-semibold',
                                    isOther ? 'text-neutral-300' : 'text-neutral-700',
                                )}>
                                    {day.getDate()}
                                </p>
                                {dayItems.slice(0, 4).map((item) => (
                                    <p
                                        key={item.key}
                                        className={cn(
                                            'mt-0.5 truncate ps-1 text-[7.5pt] leading-tight',
                                            riskBorder(item.risk),
                                            item.risk === RISK.OVERDUE ? 'font-semibold' : 'font-normal',
                                            item.isDone && 'line-through',
                                        )}
                                    >
                                        {item.title}
                                    </p>
                                ))}
                                {dayItems.length > 4 && (
                                    <p className="mt-0.5 text-[7pt] text-neutral-500">+{dayItems.length - 4} öğe</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Sayfa 2: haftalık ajanda ── */}
            <section className="apya-print-page apya-print-break">
                <header className="flex items-end justify-between border-b-2 border-black pb-2">
                    <div>
                        <p className="text-[8pt] font-bold uppercase tracking-widest text-neutral-500">
                            APYA · Haftalık ajanda
                        </p>
                        <h1 className="mt-1 text-[22pt] font-semibold leading-none">
                            {fmt.dayShort(weekStart)} – {fmt.dayShort(addDays(weekStart, 6))}
                        </h1>
                    </div>
                    <div className="text-right text-[8pt] text-neutral-500">
                        <p>Onay kutuları elle işaretlemek için · tamamlananlar listeye alınmadı</p>
                        <p>{generatedAt} tarihinde oluşturuldu · Sayfa 2 / 2</p>
                    </div>
                </header>

                <div className="mt-3 columns-2 gap-8">
                    {overdue.length > 0 && (
                        <div className="mb-4 break-inside-avoid">
                            <p className="border-b-2 border-black pb-1 text-[9pt] font-bold uppercase tracking-wide">
                                Gecikmiş · {overdue.length}
                            </p>
                            {overdue.map((item) => (
                                <PrintRow key={item.key} item={item} showDate />
                            ))}
                        </div>
                    )}

                    {agendaDays.map((day) => (
                        <div key={day.key} className="mb-4 break-inside-avoid">
                            <p className="border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide">
                                {fmt.dayTitle(day.date)}{day.isToday ? ' · Bugün' : ''}
                            </p>
                            {day.items.map((item) => (
                                <PrintRow key={item.key} item={item} />
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function PrintRow({ item, showDate = false }) {
    const meta = SOURCES[item.source];
    return (
        <div className="flex items-start gap-2 border-b border-neutral-200 py-1">
            {/* Kağıt üstünde işaretlenecek kutu. */}
            <span className="mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600" aria-hidden="true" />
            <span className="min-w-0 flex-1">
                <span className={cn('block text-[9pt] leading-tight', item.risk === RISK.OVERDUE && 'font-semibold')}>
                    {item.title}
                </span>
                <span className="block text-[7.5pt] text-neutral-500">
                    {[
                        showDate ? fmt.dayShort(new Date(`${item.date.slice(0, 10)}T00:00:00`)) : null,
                        meta?.label,
                        item.subtitle,
                        item.amount != null ? fmt.money(item.amount, item.currency) : null,
                    ].filter(Boolean).join(' · ')}
                </span>
            </span>
        </div>
    );
}
