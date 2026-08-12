import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { statusOf } from '../v3/taskMetaV3';
import { TAB_CARD, RatioBadge, RowBadge, Avatar, fmtShortDate } from '../v3/tabPrimitives';

/**
 * Alt Görevler sekmesi (V4 tasarım dili).
 *
 * Satırın TAMAMI tıklanabilir ve alt görev panelini açar (`onOpenSubtask`);
 * checkbox `stopPropagation` ile paneli AÇMADAN durumu değiştirir — tasarımın
 * açık talebi.
 */
export function SubtasksTab({ taskId, task, onOpenSubtask }) {
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const queryClient = useQueryClient();
    const subtasks = task?.subTasks ?? [];
    const doneCount = subtasks.filter((s) => s.status === 4).length;

    const invalidateParent = () => queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });

    const addSubtask = async () => {
        const title = draft.trim();
        if (!title) return;
        setBusy(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.create({
                title,
                startDate: new Date().toISOString().slice(0, 10),
                parentTaskId: taskId,
                projectId: task?.projectId,
            }));
            setDraft('');
            await invalidateParent();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Alt görev eklenemedi.');
        } finally {
            setBusy(false);
        }
    };

    /** Checkbox: Tamamlandı(4) ↔ Bekliyor(1). Satır tıklamasını tetiklemez. */
    const toggleDone = async (e, sub) => {
        e.stopPropagation();
        try {
            await Promise.resolve(window.apya.platform.tasks.task.updateStatus(sub.id, sub.status === 4 ? 1 : 4));
            await invalidateParent();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Alt görev durumu güncellenemedi.');
        }
    };

    return (
        <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <h2 className="m-0 text-[14px] font-bold text-text-primary">Alt görevler</h2>
                    {subtasks.length > 0 && <RatioBadge>{doneCount}/{subtasks.length}</RatioBadge>}
                </div>
                <button
                    type="button"
                    onClick={addSubtask}
                    disabled={busy || !draft.trim()}
                    className={`flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${
                        busy || !draft.trim() ? 'bg-border-strong cursor-not-allowed' : 'bg-primary hover:bg-primary-hover cursor-pointer'
                    }`}
                >
                    <i className="fa-solid fa-plus text-[11px]" />
                    Alt görev ekle
                </button>
            </div>

            <div className={TAB_CARD}>
                {subtasks.map((sub) => {
                    const st = statusOf(sub.status);
                    const isDone = sub.status === 4;
                    return (
                        <div
                            key={sub.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onOpenSubtask?.(sub.id, sub.title)}
                            onKeyDown={(e) => { if (e.key === 'Enter') onOpenSubtask?.(sub.id, sub.title); }}
                            className="flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer"
                        >
                            <button
                                type="button"
                                aria-label={`${sub.title} tamamlandı işaretle`}
                                onClick={(e) => toggleDone(e, sub)}
                                className={`flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${
                                    isDone ? 'bg-success border-success' : 'bg-transparent border-strong'
                                }`}
                            >
                                {isDone && <i className="fa-solid fa-check text-[9px]" />}
                            </button>

                            <span className="shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary">{sub.code}</span>

                            <span className={`flex-1 min-w-0 truncate text-[13px] font-semibold ${
                                isDone ? 'line-through text-text-tertiary' : 'text-text-primary'
                            }`}>
                                {sub.title}
                            </span>

                            <RowBadge bg={st.bg} fg={st.fg}>{st.label}</RowBadge>

                            <span className="shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden">
                                {fmtShortDate(sub.dueDate)}
                            </span>

                            <Avatar name={sub.assigneeName} />

                            <i className="fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" />
                        </div>
                    );
                })}

                <div className="px-4 py-3 border-t border-subtle first:border-t-0">
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(); }}
                        disabled={busy}
                        placeholder="Yeni alt görev başlığı"
                        className="w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    />
                </div>
            </div>

            {subtasks.length === 0 && (
                <p className="m-0 text-[12.5px] text-text-tertiary">Henüz alt görev yok.</p>
            )}
        </div>
    );
}
