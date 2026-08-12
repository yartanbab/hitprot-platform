import React, { useMemo } from 'react';
import { TAB_CARD, TabEmptyState } from '../tabPrimitives';

// Status → çubuk rengi (ayrı "progress" alanı yok, renk durumdan gelir)
const STATUS_BAR = {
    0: 'bg-neutral-400',
    1: 'bg-text-tertiary',
    2: 'bg-warning',
    3: 'bg-primary',
    4: 'bg-success',
};

function toDate(v) {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
}

const fmtShort = (d) => (d
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit' }).format(d)
    : '—');

/**
 * Gantt sekmesi (V4 tasarım dili) — 170px sabit etiket kolonu + şerit üzerinde
 * konumlanmış renkli barlar.
 *
 * Prototip sabit "4 hafta" başlığı gösteriyor; burada kolon başlıkları gerçek
 * tarih aralığından TÜRETİLİR (uydurma takvim yok). Ekstra backend çağrısı yok:
 * `task` + `task.subTasks` tarihleri kullanılır.
 */
export function GanttTabV3({ task = {} }) {
    const rows = useMemo(() => {
        const list = [{ ...task, __main: true }, ...(task.subTasks || [])];
        return list.map((t, i) => ({
            id: t.id || `row-${i}`,
            name: t.title || 'Başlıksız görev',
            isMain: Boolean(t.__main),
            start: toDate(t.startDate),
            end: toDate(t.dueDate) || toDate(t.completedDate),
            status: t.status ?? 1,
        }));
    }, [task]);

    const { min, span } = useMemo(() => {
        const times = rows.flatMap((r) => [r.start, r.end]).filter(Boolean).map((d) => d.getTime());
        if (times.length === 0) return { min: null, span: 0 };
        const minT = Math.min(...times);
        const maxT = Math.max(...times);
        return { min: minT, span: Math.max(1, maxT - minT) };
    }, [rows]);

    /** Şerit üstündeki 4 eşit kolonun başlangıç tarihleri. */
    const columns = useMemo(() => {
        if (min === null) return [];
        return [0, 1, 2, 3].map((i) => new Date(min + (span * i) / 4));
    }, [min, span]);

    if (min === null) {
        return (
            <div className={TAB_CARD}>
                <TabEmptyState
                    icon="fa-bars-staggered"
                    title="Zaman çizelgesi çizilemiyor"
                    description="Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
                />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h2 className="m-0 text-[14px] font-bold text-text-primary">Zaman çizelgesi</h2>
                <span className="text-[11.5px] text-text-tertiary">
                    {fmtShort(new Date(min))} – {fmtShort(new Date(min + span))}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]">
                {columns.map((d, i) => (
                    <span
                        key={i}
                        className="pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary"
                    >
                        {fmtShort(d)}
                    </span>
                ))}
            </div>

            <div className="flex flex-col gap-1.5">
                {rows.map((r) => {
                    const s = r.start ? r.start.getTime() : min;
                    const e = r.end ? Math.max(r.end.getTime(), s) : s;
                    const left = ((s - min) / span) * 100;
                    const width = Math.max(2, ((e - s) / span) * 100);
                    const days = Math.max(1, Math.round((e - s) / 86400000));
                    return (
                        <div key={r.id} className="flex items-center gap-0 h-9">
                            <span
                                className={`w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${
                                    r.isMain ? 'font-bold text-text-primary' : 'font-semibold text-text-secondary'
                                }`}
                                title={r.name}
                            >
                                {r.name}
                            </span>
                            <div className="relative flex-1 h-full rounded-lg bg-neutral-subtle">
                                <div
                                    className={`absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${STATUS_BAR[r.status] || 'bg-primary'}`}
                                    style={{ left: `${left}%`, width: `${width}%` }}
                                    title={`${fmtShort(r.start)} – ${fmtShort(r.end)}`}
                                >
                                    <span className="truncate text-[10.5px] font-bold text-white">{days}g</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
