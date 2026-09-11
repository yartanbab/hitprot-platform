import React, { useState } from 'react';
import { api, projectTasks } from './api';
import { usePanelShown, useAsyncData } from './usePanel';
import { groupByTask, partitionByProject } from './grouping';
import { PanelLoading, PanelError, PanelEmpty, TaskGroupHeader, ProjectGroupHeader } from './PanelChrome';
import { RichTextEditorV3 } from '../task-detail/v3/components/RichTextEditorV3';

const notify = {
    ok:  (m) => window?.abp?.notify?.success?.(m),
    err: (m) => window?.abp?.notify?.error?.(m),
};

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('tr-TR') : '');

/**
 * Belge — proje kapsamı (wireframe 2e). Projenin görevlerine bağlı belgeler
 * görev gruplu listelenir; üst kapsamdan TAM düzenleme: belge burada açılır,
 * düzenlenir ve kaynağına (görevin belgesine) kaydedilir. Yeni belge bir
 * GÖREV seçilerek oluşturulur — "yalnız projeye bağlı / bağımsız" seçenekleri
 * PR-3'ün kapsam modeliyle gelecek.
 * projectId null = ÇAPRAZ PROJE (/Tasks): aynı liste tüm görünür görevler
 * üzerinden gelir ve görev grupları proje başlıkları altında toplanır.
 */
export function DocumentsPanel({ projectId, kind, mountEl }) {
    const isGlobal = !projectId;
    const shown = usePanelShown(kind, mountEl);
    const panel = useAsyncData(
        () => Promise.all([
            projectTasks(projectId),
            api.projectDocuments(projectId),
            isGlobal ? api.projectsLookup() : Promise.resolve([]),
        ]),
        shown,
    );

    const [openId, setOpenId] = useState(null);
    const [creating, setCreating] = useState(false);

    if (!shown || panel.status === 'idle' || panel.status === 'loading') { return <PanelLoading />; }
    if (panel.status === 'error') { return <PanelError onRetry={panel.reload} />; }

    const [tasks, docs, projects] = panel.data;

    if (openId) {
        return (
            <DocumentEditor
                documentId={openId}
                onBack={() => setOpenId(null)}
                onChanged={() => panel.reload()}
                onDeleted={() => { setOpenId(null); panel.reload(); }}
            />
        );
    }

    if (creating) {
        return (
            <CreateDocumentForm
                tasks={tasks}
                showProject={isGlobal}
                onCancel={() => setCreating(false)}
                onCreated={(doc) => { setCreating(false); panel.reload(); setOpenId(doc.id); }}
            />
        );
    }

    const newButton = (
        <button
            type="button"
            onClick={() => setCreating(true)}
            className="h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover"
        >
            <i className="fa-solid fa-plus text-[10px]" aria-hidden="true" />
            Yeni belge
        </button>
    );

    if (docs.length === 0) {
        return (
            <PanelEmpty
                icon="fa-file-lines"
                title={isGlobal ? 'Henüz belge yok' : 'Bu projede henüz belge yok'}
                desc="Belgeler görevlere bağlı yazılır; ilkini buradan bir görev seçerek oluşturabilirsiniz."
                action={newButton}
            />
        );
    }

    // Görev grupları iki kipte de aynı basılır; çapraz-proje kip yalnız
    // grupları proje başlıklarının altına yerleştirir.
    const renderTaskGroups = (groupTasks, groupDocs) =>
        groupByTask(groupTasks, groupDocs, (d) => d.taskId).map((g) => (
            <section key={g.task?.id ?? 'orphan'}>
                <TaskGroupHeader task={g.task} />
                <ul className="m-0 p-0 list-none">
                    {g.records.map((doc) => (
                        <li key={doc.id}>
                            <button
                                type="button"
                                onClick={() => setOpenId(doc.id)}
                                className="flex w-full items-center gap-2.5 min-h-[44px] pl-10 pr-4 border-b border-subtle text-left cursor-pointer hover:bg-surface-hover"
                            >
                                <i className="fa-solid fa-file-lines text-[12px] text-text-tertiary" aria-hidden="true" />
                                <span className="flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate">
                                    {doc.title}
                                </span>
                                {doc.contentLength === 0 && (
                                    <span className="shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-neutral-subtle text-text-tertiary text-[10.5px] font-semibold">
                                        boş
                                    </span>
                                )}
                                <span className="shrink-0 text-[11px] text-text-tertiary">
                                    {doc.editorName} · {fmtDate(doc.lastModificationTime ?? doc.creationTime)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        ));

    return (
        <div className="pb-4">
            <div className="flex items-center justify-end px-4 py-3">{newButton}</div>
            {isGlobal
                ? partitionByProject(projects, tasks, docs, (d) => d.taskId).map((part) => (
                    <section key={part.project?.id ?? 'no-project'}>
                        <ProjectGroupHeader project={part.project} />
                        {renderTaskGroups(part.tasks, part.records)}
                    </section>
                ))
                : renderTaskGroups(tasks, docs)}
        </div>
    );
}

function CreateDocumentForm({ tasks, showProject = false, onCancel, onCreated }) {
    const [taskId, setTaskId] = useState(tasks[0]?.id ?? '');
    const [title, setTitle] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async () => {
        if (!taskId || !title.trim() || busy) { return; }
        setBusy(true);
        try {
            const doc = await api.createDocument(taskId, title.trim());
            notify.ok('Belge oluşturuldu.');
            onCreated(doc);
        } catch (err) {
            notify.err(err?.message || 'Belge oluşturulamadı.');
            setBusy(false);
        }
    };

    return (
        <div className="max-w-[480px] mx-auto my-8 px-4 flex flex-col gap-3">
            <span className="text-[14px] font-bold text-text-primary">Yeni belge</span>
            <label className="flex flex-col gap-1 text-[11.5px] font-semibold text-text-secondary">
                Görev
                <select
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    className="h-9 px-2 rounded-lg border border-default bg-surface-base text-[12.5px] text-text-primary"
                >
                    {tasks.map((t) => (
                        <option key={t.id} value={t.id}>
                            {(showProject && t.projectName ? t.projectName + ' — ' : '')
                                + (t.number > 0 ? `GRV-${t.number} · ` : '') + t.title}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col gap-1 text-[11.5px] font-semibold text-text-secondary">
                Başlık
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                    placeholder="Toplantı notu, kapsam taslağı…"
                    className="h-9 px-2.5 rounded-lg border border-default bg-surface-base text-[12.5px] text-text-primary focus:outline-none focus:border-focus"
                />
            </label>
            <div className="flex justify-end gap-2 mt-1">
                <button type="button" onClick={onCancel}
                        className="h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover">
                    Vazgeç
                </button>
                <button type="button" onClick={submit} disabled={busy || !title.trim() || !taskId}
                        className="h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    Oluştur
                </button>
            </div>
        </div>
    );
}

function DocumentEditor({ documentId, onBack, onChanged, onDeleted }) {
    const doc = useAsyncData(() => api.document(documentId), true);
    const [title, setTitle] = useState(null);      // null = sunucudan gelen
    const [content, setContent] = useState(null);
    const [busy, setBusy] = useState(false);

    if (doc.status !== 'ready') {
        return doc.status === 'error'
            ? <PanelError onRetry={doc.reload} />
            : <PanelLoading />;
    }

    const currentTitle = title ?? doc.data.title;
    const isDirty = title !== null || content !== null;

    const save = async () => {
        if (busy) { return; }
        setBusy(true);
        try {
            await api.updateDocument(documentId, {
                title: currentTitle,
                content: content ?? doc.data.content,
            });
            notify.ok('Belge kaydedildi.');
            onChanged();
            onBack();
        } catch (err) {
            notify.err(err?.message || 'Belge kaydedilemedi.');
            setBusy(false);
        }
    };

    const remove = async () => {
        if (busy || !window.confirm('Belge silinecek (geri alınabilir arşive gider). Devam edilsin mi?')) { return; }
        setBusy(true);
        try {
            await api.deleteDocument(documentId);
            notify.ok('Belge silindi.');
            onDeleted();
        } catch (err) {
            notify.err(err?.message || 'Belge silinemedi.');
            setBusy(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <button type="button" onClick={onBack}
                        className="h-8 px-2.5 rounded-lg text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover">
                    <i className="fa-solid fa-arrow-left text-[11px] mr-1.5" aria-hidden="true" />
                    Belgeler
                </button>
                <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 h-9 px-2.5 rounded-lg border border-default bg-surface-base text-[13.5px] font-bold text-text-primary focus:outline-none focus:border-focus"
                    aria-label="Belge başlığı"
                />
                <button type="button" onClick={remove} disabled={busy} title="Belgeyi sil"
                        className="h-8 w-8 rounded-lg text-text-tertiary cursor-pointer hover:bg-negative-subtle hover:text-negative">
                    <i className="fa-solid fa-trash text-[12px]" aria-hidden="true" />
                </button>
                <button type="button" onClick={save} disabled={busy || !isDirty || !currentTitle.trim()}
                        className="h-8 px-4 rounded-lg bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    Kaydet
                </button>
            </div>
            <RichTextEditorV3
                value={doc.data.content || ''}
                onChange={setContent}
                placeholder="Belge içeriği…"
            />
        </div>
    );
}
