import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { statusOf, priorityOf, SELECTABLE_STATUSES } from '../taskMetaV3';
import { Avatar, TabEmptyState, fmtShortDate } from '../tabPrimitives';

/**
 * Kanban sekmesi (V3) — alt görevleri duruma göre sütunlarda gösterir.
 *
 * DB'YE YAZAR: bir kartı başka sütuna bırakmak `task.updateStatus` ucunu çağırır
 * (Alt Görevler sekmesindeki onay kutusuyla AYNI uç). Yeni şema YOK.
 *
 * Sürükleme yerli HTML5 DnD ile — kanban sayfasının kütüphanesi bu ada (React
 * island) girmiyor ve tek bir sekme için yeni bağımlılık eklemek istemedik.
 * Dokunmatikte HTML5 DnD çalışmaz; o yüzden her kartta sütun değiştiren bir
 * yedek menü de var (`aria-label`li durum düğmesi).
 */
export function SubtaskBoardTabV3({ taskId, task = {}, onOpenSubtask }) {
    const queryClient = useQueryClient();
    const subtasks = task?.subTasks ?? [];
    const [dragOver, setDragOver] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const moveTo = async (subId, status) => {
        const sub = subtasks.find((s) => s.id === subId);
        if (!sub || sub.status === status) return;
        setBusyId(subId);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.updateStatus(subId, status));
            await queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Alt görev durumu güncellenemedi.');
        } finally {
            setBusyId(null);
        }
    };

    if (subtasks.length === 0) {
        return (
            <TabEmptyState
                icon="fa-table-columns"
                title="Alt görev yok"
                description="Alt Görevler sekmesinden ekledikleriniz burada duruma göre sütunlanır."
            />
        );
    }

    return (
        // 🔴 `grid-cols-[repeat(4,minmax(190px,1fr))]` KULLANMA: Tailwind bu keyfi
        // değer için kural ÜRETMİYOR (repeat(auto-fit,…) üretiliyor, repeat(4,…)
        // üretilmiyor) → sınıf HTML'de durur ama CSS'i yoktur ve ızgara sessizce
        // tek sütuna düşer. auto-fit zaten istediğimizi yapıyor: dört durum
        // sütunu geniş alanda yan yana, dar alanda alt alta sarar.
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start">
            {SELECTABLE_STATUSES.map((status) => {
                const st = statusOf(status);
                const items = subtasks.filter((s) => s.status === status);
                const isOver = dragOver === status;
                return (
                    <section
                        key={status}
                        aria-label={`${st.label} sütunu`}
                        onDragOver={(e) => { e.preventDefault(); if (dragOver !== status) setDragOver(status); }}
                        onDragLeave={() => setDragOver((d) => (d === status ? null : d))}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(null);
                            const id = e.dataTransfer?.getData('text/plain');
                            if (id) moveTo(id, status);
                        }}
                        className={`flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${
                            isOver ? 'border-focus bg-primary-subtle' : 'border-subtle'
                        }`}
                    >
                        <header className="flex items-center gap-2 px-1">
                            <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                            <h3 className="m-0 flex-1 text-[12px] font-bold text-text-primary">{st.label}</h3>
                            <span className="font-mono text-[11px] font-bold text-text-tertiary">{items.length}</span>
                        </header>

                        {items.map((sub) => {
                            const pr = priorityOf(sub.priority);
                            return (
                                <article
                                    key={sub.id}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer?.setData('text/plain', sub.id)}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onOpenSubtask?.(sub.id)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') onOpenSubtask?.(sub.id); }}
                                    className={`flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${
                                        busyId === sub.id ? 'opacity-60' : ''
                                    }`}
                                >
                                    <span className="text-[12.5px] font-semibold text-text-primary line-clamp-2">
                                        {sub.title}
                                    </span>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`text-[10.5px] font-bold ${pr.fg}`}>
                                            <i className={`fa-solid ${pr.icon} text-[9px] mr-1`} />
                                            {pr.label}
                                        </span>
                                        {sub.dueDate && (
                                            <span className="font-mono text-[10.5px] text-text-tertiary">
                                                {fmtShortDate(sub.dueDate)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-subtle">
                                        {sub.assigneeName
                                            ? <Avatar name={sub.assigneeName} size={20} />
                                            : <span className="text-[10.5px] text-text-tertiary">Atanmadı</span>}

                                        {/* Dokunmatik yedeği: sürükleyemeyen cihazda sonraki duruma taşır. */}
                                        <select
                                            aria-label={`${sub.title} durumunu değiştir`}
                                            value={sub.status}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => moveTo(sub.id, Number(e.target.value))}
                                            className="h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary cursor-pointer"
                                        >
                                            {SELECTABLE_STATUSES.map((s) => (
                                                <option key={s} value={s}>{statusOf(s).label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                );
            })}
        </div>
    );
}
