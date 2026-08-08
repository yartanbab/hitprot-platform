import React, { useMemo } from 'react';

// Status → ilerleme yüzdesi (durumdan türetilir; ayrı "progress" alanı yok)
const STATUS_PROGRESS = { 0: 0, 1: 0, 2: 50, 3: 75, 4: 100 };
const STATUS_BAR = { 0: 'bg-neutral-400', 1: 'bg-text-tertiary', 2: 'bg-warning', 3: 'bg-primary', 4: 'bg-success' };

function toDate(v) {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}
function fmtShort(d) {
    return d ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit' }).format(d) : '—';
}

/** Gantt — ana görev + alt görevlerin gerçek başlangıç/bitiş tarihlerinden çubuk çizer.
 *  Ekstra backend YOK: `task` prop'u ve `task.subTasks` kullanılır. */
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
        const dates = rows.flatMap((r) => [r.start, r.end]).filter(Boolean).map((d) => d.getTime());
        if (dates.length === 0) return { min: null, span: 0 };
        const minT = Math.min(...dates);
        const maxT = Math.max(...dates);
        return { min: minT, span: Math.max(1, maxT - minT) };
    }, [rows]);

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-subtle pb-4">
                <i className="fa-solid fa-bars-staggered text-primary text-base" />
                <h3 className="text-[15px] font-bold text-text-primary">Gantt Zaman Çizelgesi</h3>
            </div>

            {min === null ? (
                <p className="text-[13px] text-text-tertiary py-2">
                    Zaman çizelgesi için görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {rows.map((r) => {
                        const s = r.start ? r.start.getTime() : min;
                        const e = r.end ? Math.max(r.end.getTime(), s) : s;
                        const left = ((s - min) / span) * 100;
                        const width = Math.max(2, ((e - s) / span) * 100);
                        const progress = STATUS_PROGRESS[r.status] ?? 0;
                        const bar = STATUS_BAR[r.status] || 'bg-primary';
                        return (
                            <div
                                key={r.id}
                                className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${
                                    r.isMain ? 'bg-primary-subtle/30 border-primary/20' : 'bg-surface-sunken/40 border-subtle/50 hover:bg-surface-hover/60'
                                }`}
                            >
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className={`truncate ${r.isMain ? 'font-bold text-text-primary' : 'font-semibold text-text-secondary'}`}>{r.name}</span>
                                    <span className="text-xs text-text-tertiary font-mono shrink-0 ml-2">{fmtShort(r.start)} – {fmtShort(r.end)}</span>
                                </div>
                                <div className="relative w-full h-3 bg-surface-base rounded-full overflow-hidden border border-subtle">
                                    <div className={`absolute top-0 h-full ${bar} rounded-full opacity-30`} style={{ left: `${left}%`, width: `${width}%` }} />
                                    <div className={`absolute top-0 h-full ${bar} rounded-full`} style={{ left: `${left}%`, width: `${(width * progress) / 100}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
