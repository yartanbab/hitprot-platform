import React, { useState } from 'react';
import { api, projectTasks } from './api';
import { usePanelShown, useAsyncData } from './usePanel';
import { groupByTask } from './grouping';
import { PanelLoading, PanelError, PanelEmpty, TaskGroupHeader } from './PanelChrome';

/**
 * Kontrol Listesi — proje kapsamı (wireframe 2g). İki katman (PR-3a hiyerarşik
 * kapsam): "Proje maddeleri" (TaskId boş — doğrudan projenin listesi) üstte,
 * görev grupları altta. Üst kapsamdan TAM düzenleme: işaretleme/silme/madde
 * ekleme kaynağa yazar, yetki mevcut uçlarınkiyle aynı. Bağımsız madde yok —
 * kontrol listesi yalnız görev/proje yüzeylerinde yaşar.
 */

/** addingFor için proje kapsamını görev id'lerinden ayıran sabit. */
const PROJECT_SCOPE = '__project__';

export function ChecklistPanel({ projectId, kind, mountEl }) {
    const shown = usePanelShown(kind, mountEl);
    const panel = useAsyncData(
        () => Promise.all([projectTasks(projectId), api.projectChecklist(projectId)]),
        shown,
    );
    const [addingFor, setAddingFor] = useState(null);   // PROJECT_SCOPE | taskId | null
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);

    if (!shown || panel.status === 'idle' || panel.status === 'loading') { return <PanelLoading />; }
    if (panel.status === 'error') { return <PanelError onRetry={panel.reload} />; }

    const [tasks, items] = panel.data;
    const projectItems = items.filter((i) => !i.taskId);
    const taskGroups = groupByTask(tasks, items.filter((i) => i.taskId), (i) => i.taskId);

    const run = async (fn) => {
        setBusy(true);
        try { await fn(); await panel.reload(); }
        catch (err) { window?.abp?.notify?.error?.(err?.message || 'İşlem tamamlanamadı.'); }
        finally { setBusy(false); }
    };

    const submitAdd = (scope) => {
        const text = draft.trim();
        if (!text) { setAddingFor(null); return; }
        setDraft('');
        setAddingFor(null);
        run(() => scope === PROJECT_SCOPE
            ? api.addProjectChecklistItem(projectId, text)
            : api.addChecklistItem(scope, text));
    };

    /* Alt BİLEŞEN değil düz render fonksiyonları: gövde içinde tanımlı bir
       bileşen her render'da yeni tip sayılır, React alt ağacı remount eder ve
       yazarken input odağı düşerdi. Fonksiyon çağrısı ({renderItem(x)}) bu
       tuzağa girmez. */
    const renderItem = (item) => (
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
    );

    const renderAddRow = (scope) => (
        <li key="add" className="flex items-center gap-2.5 min-h-[36px] pl-10 pr-4">
            {addingFor === scope ? (
                <input
                    autoFocus
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') submitAdd(scope);
                        if (e.key === 'Escape') { setAddingFor(null); setDraft(''); }
                    }}
                    onBlur={() => submitAdd(scope)}
                    placeholder="Madde yazın, Enter ile ekleyin"
                    className="flex-1 h-7 px-2 rounded-md border border-default bg-surface-base text-[12.5px] focus:outline-none focus:border-focus"
                />
            ) : (
                <button
                    type="button"
                    onClick={() => { setAddingFor(scope); setDraft(''); }}
                    className="text-[12px] font-semibold text-primary cursor-pointer hover:underline"
                >
                    ＋ madde ekle…
                </button>
            )}
        </li>
    );

    const done = (list) => list.filter((i) => i.isDone).length;
    const showProjectSection = projectItems.length > 0 || addingFor === PROJECT_SCOPE;

    if (!showProjectSection && taskGroups.length === 0) {
        return (
            <PanelEmpty
                icon="fa-square-check"
                tone="success"
                title="Bu projede henüz kontrol listesi yok"
                desc="Bir göreve bağlayın ya da doğrudan proje düzeyinde tutun — proje maddeleri görevlerden bağımsız yaşar."
                action={(
                    <button
                        type="button"
                        onClick={() => { setAddingFor(PROJECT_SCOPE); setDraft(''); }}
                        className="h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover"
                    >
                        <i className="fa-solid fa-plus text-[10px]" aria-hidden="true" />
                        Yeni proje maddesi
                    </button>
                )}
            />
        );
    }

    return (
        <div className="pb-4">
            {/* Proje maddeleri — görevlerden bağımsız, projenin kendi listesi. */}
            {showProjectSection ? (
                <section>
                    <div className="flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle">
                        <i className="fa-solid fa-diagram-project text-[11px] text-text-tertiary" aria-hidden="true" />
                        <span className="text-[12.5px] font-bold text-text-primary">Proje maddeleri</span>
                        {projectItems.length > 0 && (
                            <span className="ml-auto text-[11px] font-bold font-mono text-text-secondary">
                                {done(projectItems)}/{projectItems.length}
                            </span>
                        )}
                    </div>
                    <ul className="m-0 p-0 list-none">
                        {projectItems.map(renderItem)}
                        {renderAddRow(PROJECT_SCOPE)}
                    </ul>
                </section>
            ) : (
                <div className="flex justify-end px-4 py-2">
                    <button
                        type="button"
                        onClick={() => { setAddingFor(PROJECT_SCOPE); setDraft(''); }}
                        className="text-[12px] font-semibold text-primary cursor-pointer hover:underline"
                    >
                        ＋ Proje maddesi ekle…
                    </button>
                </div>
            )}

            {taskGroups.map((g) => (
                <section key={g.task?.id ?? 'orphan'}>
                    <TaskGroupHeader
                        task={g.task}
                        trailing={(
                            <span className="text-[11px] font-bold font-mono text-text-secondary">
                                {done(g.records)}/{g.records.length}
                            </span>
                        )}
                    />
                    <ul className="m-0 p-0 list-none">
                        {g.records.map(renderItem)}
                        {g.task && renderAddRow(g.task.id)}
                    </ul>
                </section>
            ))}
        </div>
    );
}
