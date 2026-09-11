import React from 'react';
import { api, projectTasks, openTask } from './api';
import { usePanelShown, useAsyncData } from './usePanel';
import { blockedEdges, partitionByProject } from './grouping';
import { PanelLoading, PanelError, PanelEmpty, StatusPill, ProjectGroupHeader } from './PanelChrome';

/**
 * Bağımlılıklar — proje kapsamı (wireframe 2h: "P'de proje içi görevler arası
 * bağ haritası (liste); bloke eden öncül kırmızı uyarı verir"). Salt okuma;
 * bağ kurma/ayırma görev detayının işi. Kenarlar sunucudan yalın gelir
 * (TaskDependencyEdgeDto), başlık/durum görev listesiyle burada birleşir.
 * projectId null = ÇAPRAZ PROJE (/Tasks): kenarlar ARDILIN projesine göre
 * gruplanır (bekleyen taraf o); bloke uyarısı tüm liste için tek.
 */
export function DependenciesPanel({ projectId, kind, mountEl }) {
    const isGlobal = !projectId;
    const shown = usePanelShown(kind, mountEl);
    const panel = useAsyncData(
        () => Promise.all([
            projectTasks(projectId),
            api.projectDependencies(projectId),
            isGlobal ? api.projectsLookup() : Promise.resolve([]),
        ]),
        shown,
    );

    if (!shown || panel.status === 'idle' || panel.status === 'loading') { return <PanelLoading />; }
    if (panel.status === 'error') { return <PanelError onRetry={panel.reload} />; }

    const [tasks, edges, projects] = panel.data;
    const taskById = new Map(tasks.map((t) => [t.id, t]));
    const blocked = blockedEdges(edges, taskById);
    const blockedSet = new Set(blocked.map((e) => e.predecessorTaskId + '→' + e.taskId));

    if (edges.length === 0) {
        return (
            <PanelEmpty
                icon="fa-link"
                title={isGlobal ? 'Görevler arası bağ yok' : 'Bu projede görevler arası bağ yok'}
                desc="Öncül/ardıl bağlantıları görev detayının Bağımlılıklar sekmesinden kurulur."
            />
        );
    }

    const TaskCell = ({ id }) => {
        const t = taskById.get(id);
        if (!t) { return <span className="text-[12.5px] text-text-tertiary">(görünmeyen görev)</span>; }
        return (
            <button
                type="button"
                onClick={() => openTask(t.id)}
                className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
            >
                <span className="text-[12.5px] font-semibold text-text-primary truncate group-hover:text-primary">
                    {t.title}
                </span>
                <StatusPill status={t.status} />
            </button>
        );
    };

    return (
        <div className="pb-4">
            {blocked.length > 0 && (
                <div className="flex items-start gap-2.5 m-4 mb-0 px-3.5 py-3 rounded-xl bg-negative-subtle border border-negative/30">
                    <i className="fa-solid fa-link-slash text-[13px] text-negative mt-0.5" aria-hidden="true" />
                    <div className="text-[12px] leading-[1.55] text-negative">
                        <b>{blocked.length} bağlantı bloke ediyor:</b> öncülü tamamlanmamış ve termini
                        geçmiş görevler ardıllarını bekletiyor. Satırlarda ⚠ ile işaretli.
                    </div>
                </div>
            )}

            <div className="flex px-4 pt-4 pb-2 text-[10.5px] font-semibold tracking-[.06em] text-text-tertiary">
                <span className="flex-1">ÖNCÜL (önce bitmeli)</span>
                <span className="w-8" />
                <span className="flex-1">ARDIL (bunu bekliyor)</span>
            </div>
            {isGlobal
                ? partitionByProject(projects, tasks, edges, (e) => e.taskId).map((part) => (
                    <section key={part.project?.id ?? 'no-project'}>
                        <ProjectGroupHeader project={part.project} />
                        {renderEdgeList(part.records)}
                    </section>
                ))
                : renderEdgeList(edges)}
        </div>
    );

    function renderEdgeList(list) {
        return (
            <ul className="m-0 p-0 list-none">
                {list.map((e) => {
                    const isBlocked = blockedSet.has(e.predecessorTaskId + '→' + e.taskId);
                    return (
                        <li key={e.predecessorTaskId + e.taskId}
                            className="flex items-center min-h-[44px] px-4 border-b border-subtle">
                            <span className="flex-1 min-w-0 flex items-center gap-2">
                                {isBlocked && (
                                    <i className="fa-solid fa-triangle-exclamation text-[11px] text-negative"
                                       title="Öncül tamamlanmadı ve termini geçti — ardılı bloke ediyor"
                                       aria-hidden="true" />
                                )}
                                <TaskCell id={e.predecessorTaskId} />
                            </span>
                            <span className="w-8 text-center text-text-tertiary" aria-hidden="true">→</span>
                            <span className="flex-1 min-w-0">
                                <TaskCell id={e.taskId} />
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    }
}
