import React, { useState } from 'react';
import { api, projectTasks } from './api';
import { usePanelShown, useAsyncData } from './usePanel';
import { groupByTask, partitionByProject } from './grouping';
import { PanelLoading, PanelError, PanelEmpty, TaskGroupHeader, ProjectGroupHeader } from './PanelChrome';

/**
 * Kontrol Listesi — proje kapsamı (wireframe 2g). İki katman (PR-3a hiyerarşik
 * kapsam): "Proje maddeleri" (TaskId boş — doğrudan projenin listesi) üstte,
 * görev grupları altta. Üst kapsamdan TAM düzenleme: işaretleme/silme/madde
 * ekleme kaynağa yazar, yetki mevcut uçlarınkiyle aynı. Bağımsız madde yok —
 * kontrol listesi yalnız görev/proje yüzeylerinde yaşar.
 * projectId null = ÇAPRAZ PROJE (/Tasks): aynı iki katman proje başlıkları
 * altında yinelenir; İLK proje maddesini ekleme Proje Detayı'nda kalır
 * (her proje için boş ekleme satırı basmak listeyi gürültüye boğardı).
 */

/** addingFor için proje kapsamını görev id'lerinden ayıran önek — çapraz-proje
 *  kipte her proje grubunun KENDİ ekleme satırı var, hedef proje eke gömülür. */
const PROJECT_SCOPE_PREFIX = '__project__:';
const projectScopeKey = (pid) => PROJECT_SCOPE_PREFIX + pid;

export function ChecklistPanel({ projectId, kind, mountEl }) {
    const isGlobal = !projectId;
    const shown = usePanelShown(kind, mountEl);
    const panel = useAsyncData(
        () => Promise.all([
            projectTasks(projectId),
            api.projectChecklist(projectId),
            isGlobal ? api.projectsLookup() : Promise.resolve([]),
        ]),
        shown,
    );
    const [addingFor, setAddingFor] = useState(null);   // projectScopeKey(pid) | taskId | null
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);

    if (!shown || panel.status === 'idle' || panel.status === 'loading') { return <PanelLoading />; }
    if (panel.status === 'error') { return <PanelError onRetry={panel.reload} />; }

    const [tasks, items, projects] = panel.data;
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
        run(() => String(scope).indexOf(PROJECT_SCOPE_PREFIX) === 0
            ? api.addProjectChecklistItem(String(scope).slice(PROJECT_SCOPE_PREFIX.length), text)
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

    // "Proje maddeleri" bölümü ve görev grupları iki kipte de aynı basılır;
    // çapraz-proje kip bunları proje başlığının altında yineler.
    const renderProjectItemsSection = (pid, pItems) => (
        <section>
            <div className="flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle">
                <i className="fa-solid fa-diagram-project text-[11px] text-text-tertiary" aria-hidden="true" />
                <span className="text-[12.5px] font-bold text-text-primary">Proje maddeleri</span>
                {pItems.length > 0 && (
                    <span className="ml-auto text-[11px] font-bold font-mono text-text-secondary">
                        {done(pItems)}/{pItems.length}
                    </span>
                )}
            </div>
            <ul className="m-0 p-0 list-none">
                {pItems.map(renderItem)}
                {renderAddRow(projectScopeKey(pid))}
            </ul>
        </section>
    );

    const renderTaskGroups = (groups) => groups.map((g) => (
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
    ));

    if (isGlobal) {
        const parts = partitionByProject(projects, tasks, items, (i) => i.taskId, (i) => i.projectId);
        if (parts.length === 0) {
            return (
                <PanelEmpty
                    icon="fa-square-check"
                    tone="success"
                    title="Henüz kontrol listesi yok"
                    desc="Maddeler görev detayından ya da projenin Kontrol Listesi panelinden eklenir."
                />
            );
        }
        return (
            <div className="pb-4">
                {parts.map((part) => {
                    const pid = part.project?.id;
                    const pItems = part.records.filter((i) => !i.taskId);
                    const groups = groupByTask(part.tasks, part.records.filter((i) => i.taskId), (i) => i.taskId);
                    return (
                        <section key={pid ?? 'no-project'}>
                            <ProjectGroupHeader project={part.project} />
                            {!!pid && pItems.length > 0 && renderProjectItemsSection(pid, pItems)}
                            {renderTaskGroups(groups)}
                        </section>
                    );
                })}
            </div>
        );
    }

    const showProjectSection = projectItems.length > 0 || addingFor === projectScopeKey(projectId);

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
                        onClick={() => { setAddingFor(projectScopeKey(projectId)); setDraft(''); }}
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
                renderProjectItemsSection(projectId, projectItems)
            ) : (
                <div className="flex justify-end px-4 py-2">
                    <button
                        type="button"
                        onClick={() => { setAddingFor(projectScopeKey(projectId)); setDraft(''); }}
                        className="text-[12px] font-semibold text-primary cursor-pointer hover:underline"
                    >
                        ＋ Proje maddesi ekle…
                    </button>
                </div>
            )}

            {renderTaskGroups(taskGroups)}
        </div>
    );
}
