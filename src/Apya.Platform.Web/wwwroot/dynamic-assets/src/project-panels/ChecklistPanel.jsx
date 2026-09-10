import React, { useState } from 'react';
import { api, projectTasks } from './api';
import { usePanelShown, useAsyncData } from './usePanel';
import { groupByTask } from './grouping';
import { PanelLoading, PanelError, PanelEmpty, TaskGroupHeader } from './PanelChrome';

/**
 * Kontrol Listesi — proje kapsamı (wireframe 2g: "P'de görev listelerinin
 * toplamı"). Üst kapsamdan TAM düzenleme: işaretleme/silme/madde ekleme
 * kaynağa (görevin listesine) yazar, yetki mevcut uçlarınkiyle aynı.
 * Proje-seviyesi bağımsız madde PR-3'ün kapsam modeliyle gelecek.
 */
export function ChecklistPanel({ projectId, kind, mountEl }) {
    const shown = usePanelShown(kind, mountEl);
    const panel = useAsyncData(
        () => Promise.all([projectTasks(projectId), api.projectChecklist(projectId)]),
        shown,
    );
    const [addingFor, setAddingFor] = useState(null);   // taskId | null
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);

    if (!shown || panel.status === 'idle' || panel.status === 'loading') { return <PanelLoading />; }
    if (panel.status === 'error') { return <PanelError onRetry={panel.reload} />; }

    const [tasks, items] = panel.data;
    const groups = groupByTask(tasks, items, (i) => i.taskId);

    const run = async (fn) => {
        setBusy(true);
        try { await fn(); await panel.reload(); }
        catch (err) { window?.abp?.notify?.error?.(err?.message || 'İşlem tamamlanamadı.'); }
        finally { setBusy(false); }
    };

    const submitAdd = (taskId) => {
        const text = draft.trim();
        if (!text) { setAddingFor(null); return; }
        setDraft('');
        setAddingFor(null);
        run(() => api.addChecklistItem(taskId, text));
    };

    if (groups.length === 0) {
        return (
            <PanelEmpty
                icon="fa-square-check"
                tone="success"
                title="Bu projede henüz kontrol listesi yok"
                desc="Maddeler görevlerin kontrol listelerinden toplanır — bir görevi açıp ilk maddeyi ekleyin."
            />
        );
    }

    return (
        <div className="pb-4">
            {groups.map((g) => {
                const done = g.records.filter((i) => i.isDone).length;
                const taskId = g.task?.id;
                return (
                    <section key={taskId ?? 'orphan'}>
                        <TaskGroupHeader
                            task={g.task}
                            trailing={(
                                <span className="text-[11px] font-bold font-mono text-text-secondary">
                                    {done}/{g.records.length}
                                </span>
                            )}
                        />
                        <ul className="m-0 p-0 list-none">
                            {g.records.map((item) => (
                                <li key={item.id} className="group flex items-center gap-2.5 min-h-[38px] pl-10 pr-4 border-b border-subtle">
                                    <input
                                        type="checkbox"
                                        checked={item.isDone}
                                        disabled={busy}
                                        onChange={() => run(() => api.toggleChecklistItem(item.id))}
                                        className="h-[15px] w-[15px] accent-[var(--apya-accent-500,#4F46E5)] cursor-pointer"
                                        aria-label={item.text}
                                    />
                                    <span className={`flex-1 text-[12.5px] ${item.isDone ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
                                        {item.text}
                                    </span>
                                    <button
                                        type="button"
                                        title="Maddeyi sil"
                                        disabled={busy}
                                        onClick={() => run(() => api.deleteChecklistItem(item.id))}
                                        className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                    >
                                        <i className="fa-solid fa-xmark text-[11px]" aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                            {taskId && (
                                <li className="flex items-center gap-2.5 min-h-[36px] pl-10 pr-4">
                                    {addingFor === taskId ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={draft}
                                            onChange={(e) => setDraft(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') submitAdd(taskId);
                                                if (e.key === 'Escape') { setAddingFor(null); setDraft(''); }
                                            }}
                                            onBlur={() => submitAdd(taskId)}
                                            placeholder="Madde yazın, Enter ile ekleyin"
                                            className="flex-1 h-7 px-2 rounded-md border border-default bg-surface-base text-[12.5px] focus:outline-none focus:border-focus"
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => { setAddingFor(taskId); setDraft(''); }}
                                            className="text-[12px] font-semibold text-primary cursor-pointer hover:underline"
                                        >
                                            ＋ madde ekle…
                                        </button>
                                    )}
                                </li>
                            )}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}
