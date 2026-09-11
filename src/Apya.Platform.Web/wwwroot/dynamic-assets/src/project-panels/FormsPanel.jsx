import React from 'react';
import { api, projectTasks, openTask } from './api';
import { usePanelShown, useAsyncData } from './usePanel';
import { groupByTask, partitionByProject } from './grouping';
import { PanelLoading, PanelError, PanelEmpty, TaskGroupHeader, ProjectGroupHeader } from './PanelChrome';

/**
 * Form — proje kapsamı (wireframe 2f). Projenin görevlerine bağlı formlar
 * görev gruplu listelenir; yanıt sayısı görev bağlamındadır. Form BAĞLAMA
 * bilinçli olarak burada yok: bağ görevin işi, satırdan görev detayı açılır
 * (v1 kararı — kapsam modeli PR-3'te ilişki seçiciyi getirecek).
 * projectId null = ÇAPRAZ PROJE (/Tasks): görev grupları proje başlıkları
 * altında toplanır.
 */
export function FormsPanel({ projectId, kind, mountEl }) {
    const isGlobal = !projectId;
    const shown = usePanelShown(kind, mountEl);
    const panel = useAsyncData(
        () => Promise.all([
            projectTasks(projectId),
            api.projectForms(projectId),
            isGlobal ? api.projectsLookup() : Promise.resolve([]),
        ]),
        shown,
    );

    if (!shown || panel.status === 'idle' || panel.status === 'loading') { return <PanelLoading />; }
    if (panel.status === 'error') { return <PanelError onRetry={panel.reload} />; }

    const [tasks, links, projects] = panel.data;

    if (links.length === 0) {
        return (
            <PanelEmpty
                icon="fa-clipboard-list"
                title="Henüz form bağlanmadı"
                desc="Form Yönetimi'ndeki bir formu görev detayından bağlayın; yanıtlar o görev bağlamında toplansın."
            />
        );
    }

    const renderTaskGroups = (groupTasks, groupLinks) =>
        groupByTask(groupTasks, groupLinks, (l) => l.taskId).map((g) => (
                <section key={g.task?.id ?? 'orphan'}>
                    <TaskGroupHeader task={g.task} />
                    <ul className="m-0 p-0 list-none">
                        {g.records.map((link) => (
                            <li key={link.id} className="flex items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle">
                                <i className="fa-solid fa-clipboard-list text-[12px] text-text-tertiary" aria-hidden="true" />
                                <span className="flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate">
                                    {link.title}
                                </span>
                                {link.isGuestFillable && (
                                    <span className="shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-warning-subtle text-warning text-[10.5px] font-semibold"
                                          title="Görevin dış paylaşım linkine açık">
                                        dışa açık
                                    </span>
                                )}
                                <span className="shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-secondary text-[10.5px] font-semibold font-mono">
                                    {link.responseCount} yanıt
                                </span>
                                {g.task && (
                                    <button
                                        type="button"
                                        onClick={() => openTask(g.task.id)}
                                        className="shrink-0 text-[12px] font-semibold text-primary cursor-pointer hover:underline"
                                    >
                                        Görevde aç →
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
        ));

    return (
        <div className="pb-4">
            {isGlobal
                ? partitionByProject(projects, tasks, links, (l) => l.taskId).map((part) => (
                    <section key={part.project?.id ?? 'no-project'}>
                        <ProjectGroupHeader project={part.project} />
                        {renderTaskGroups(part.tasks, part.records)}
                    </section>
                ))
                : renderTaskGroups(tasks, links)}
        </div>
    );
}
