import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input, Badge } from '../../components/ui';
import { STATUS } from '../statusMaps';

export function SubtasksTab({ taskId, task, onOpenSubtask }) {
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const [confirmingId, setConfirmingId] = useState(null);
    const queryClient = useQueryClient();
    const subtasks = task?.subTasks ?? [];

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

    const deleteSubtask = async (subtaskId) => {
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(subtaskId));
            await invalidateParent();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Alt görev silinemedi.');
        } finally {
            setConfirmingId(null);
        }
    };

    return (
        <div className="space-y-[var(--apya-space-4)]">
            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(); }}
                    placeholder="Yeni alt görev başlığı"
                    disabled={busy}
                />
                <Button variant="secondary" onClick={addSubtask} disabled={busy || !draft.trim()}>
                    Alt Görev Ekle
                </Button>
            </div>

            {subtasks.length === 0 ? (
                <p className="text-sm text-text-tertiary">Henüz alt görev yok.</p>
            ) : (
                <ul className="divide-y divide-border-default">
                    {subtasks.map((sub) => (
                        <li key={sub.id} className="flex items-center justify-between py-2">
                            <button
                                type="button"
                                onClick={() => onOpenSubtask?.(sub.id, sub.title)}
                                className="text-left text-sm font-medium text-text-primary hover:underline"
                            >
                                {sub.title}
                            </button>
                            <div className="flex items-center gap-2">
                                <Badge variant={STATUS[sub.status]?.variant ?? 'neutral'}>{STATUS[sub.status]?.text ?? sub.status}</Badge>
                                {confirmingId === sub.id ? (
                                    <>
                                        <span className="text-xs text-text-tertiary">Emin misiniz?</span>
                                        <Button variant="destructive" onClick={() => deleteSubtask(sub.id)}>
                                            Evet, sil
                                        </Button>
                                        <Button variant="ghost" onClick={() => setConfirmingId(null)}>
                                            Vazgeç
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="ghost" onClick={() => setConfirmingId(sub.id)} aria-label={`${sub.title} alt görevini sil`}>
                                        Sil
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
