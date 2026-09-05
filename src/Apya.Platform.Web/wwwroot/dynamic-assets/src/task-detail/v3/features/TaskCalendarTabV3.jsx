import React, { useMemo, useState } from 'react';
import { statusOf } from '../taskMetaV3';
import { TabEmptyState } from '../tabPrimitives';

/**
 * Takvim sekmesi (V3) — görevin ve alt görevlerinin tarihlerini aylık ızgarada
 * gösterir. SALT OKUMA, yeni şema YOK; veri görevin kendi alanlarından gelir.
 *
 * 🔴 Gün anahtarı ISO metninden KESİLİR, `new Date(...)` üzerinden hesaplanmaz.
 * Sunucu tarihleri UTC gece yarısı olarak gönderiyor; TZ+03'te yerel dönüşüm
 * kimi kaydı bir gün öteye/geriye kaydırır (aynı tuzak Yeni Proje formunda
 * `toISOString()` ile yaşanmıştı). Izgara hücreleri de aynı biçimde yerel
 * yıl/ay/gün sayılarından kurulur, araya Date dönüşümü girmez.
 */

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const pad = (n) => String(n).padStart(2, '0');
const cellKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** ISO metninden gün anahtarı — Date'e HİÇ uğramaz (bkz. dosya başındaki not). */
export function isoDayKey(iso) {
    if (!iso) return null;
    const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(iso));
    return m ? m[1] : null;
}

/** Ayın ızgarası — pazartesi başlangıçlı, 6 haftalık sabit blok. */
function monthGrid(year, month) {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;           // Pazar=0 → Pazartesi=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < 42; i++) {
        const dayNo = i - offset + 1;
        cells.push(dayNo >= 1 && dayNo <= daysInMonth
            ? { key: cellKey(year, month, dayNo), day: dayNo, inMonth: true }
            : { key: `bos-${i}`, day: null, inMonth: false });
    }
    return cells;
}

/** Görev + alt görevlerden gün → olay listesi. */
function buildEvents(task) {
    const map = new Map();
    const push = (iso, event) => {
        const key = isoDayKey(iso);
        if (!key) return;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(event);
    };

    push(task?.startDate, { id: task?.id, title: task?.title, kind: 'start', isSelf: true, status: task?.status });
    push(task?.dueDate,   { id: task?.id, title: task?.title, kind: 'due',   isSelf: true, status: task?.status });

    for (const sub of task?.subTasks ?? []) {
        push(sub.startDate, { id: sub.id, title: sub.title, kind: 'start', isSelf: false, status: sub.status });
        push(sub.dueDate,   { id: sub.id, title: sub.title, kind: 'due',   isSelf: false, status: sub.status });
    }
    return map;
}

export function TaskCalendarTabV3({ task = {}, onOpenSubtask }) {
    const events = useMemo(() => buildEvents(task), [task]);

    /* Açılış ayı: görevin başlangıcı varsa o ay, yoksa bugün. */
    const [cursor, setCursor] = useState(() => {
        const key = isoDayKey(task?.startDate) ?? isoDayKey(task?.dueDate);
        if (key) {
            const [y, m] = key.split('-').map(Number);
            return { year: y, month: m - 1 };
        }
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const cells = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor.year, cursor.month]);

    const shift = (delta) => setCursor(({ year, month }) => {
        const m = month + delta;
        return { year: year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

    const today = new Date();
    const todayKey = cellKey(today.getFullYear(), today.getMonth(), today.getDate());

    if (events.size === 0) {
        return (
            <TabEmptyState
                icon="fa-calendar"
                title="Takvimde gösterilecek tarih yok"
                description="Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
            />
        );
    }

    return (
        <div className="flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised">
                <h2 className="m-0 text-[13.5px] font-bold text-text-primary">
                    {MONTHS[cursor.month]} {cursor.year}
                </h2>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        aria-label="Önceki ay"
                        onClick={() => shift(-1)}
                        className="flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                    >
                        <i className="fa-solid fa-chevron-left text-[11px]" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}
                        className="h-7 px-2.5 rounded-lg border border-subtle bg-surface-base text-[11.5px] font-semibold text-text-secondary hover:text-text-primary cursor-pointer"
                    >
                        Bugün
                    </button>
                    <button
                        type="button"
                        aria-label="Sonraki ay"
                        onClick={() => shift(1)}
                        className="flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                    >
                        <i className="fa-solid fa-chevron-right text-[11px]" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-subtle bg-surface-raised">
                {WEEKDAYS.map((d) => (
                    <span key={d} className="px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {cells.map((cell) => {
                    const dayEvents = cell.inMonth ? (events.get(cell.key) ?? []) : [];
                    const isToday = cell.key === todayKey;
                    return (
                        <div
                            key={cell.key}
                            className={`flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${
                                cell.inMonth ? '' : 'bg-surface-sunken'
                            }`}
                        >
                            {cell.inMonth && (
                                <span className={`self-end font-mono text-[11px] font-bold ${
                                    isToday
                                        ? 'flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white'
                                        : 'text-text-tertiary'
                                }`}>
                                    {cell.day}
                                </span>
                            )}

                            {dayEvents.map((ev, i) => {
                                const st = statusOf(ev.status);
                                return (
                                    <button
                                        key={`${ev.id}-${ev.kind}-${i}`}
                                        type="button"
                                        title={`${ev.title} — ${ev.kind === 'due' ? 'termin' : 'başlangıç'}`}
                                        onClick={() => { if (!ev.isSelf) onOpenSubtask?.(ev.id); }}
                                        className={`flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${st.bg} ${st.fg} ${
                                            ev.isSelf ? 'cursor-default' : 'cursor-pointer hover:brightness-95'
                                        }`}
                                    >
                                        <i className={`fa-solid ${ev.kind === 'due' ? 'fa-flag-checkered' : 'fa-play'} text-[8px] shrink-0`} />
                                        <span className="truncate">{ev.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
