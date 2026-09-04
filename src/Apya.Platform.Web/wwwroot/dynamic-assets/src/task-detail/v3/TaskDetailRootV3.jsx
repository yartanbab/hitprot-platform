import React, { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, Skeleton, Button } from '../../components/ui';
import { TaskDetailHeaderV3 } from './components/TaskDetailHeaderV3';
import { TaskMetadataGridV3 } from './components/TaskMetadataGridV3';
import { TaskFeatureNavbarV3 } from './components/TaskFeatureNavbarV3';
import { TaskFeatureRailV3 } from './components/TaskFeatureRailV3';
import { TaskSidePanelV3 } from './components/TaskSidePanelV3';
import { TaskGeneralTabV3 } from './components/TaskGeneralTabV3';
import { TaskDetailFooterV3 } from './components/TaskDetailFooterV3';
import { TaskUnbuiltTabV3 } from './components/TaskUnbuiltTabV3';
import { FeaturePickerV3 } from './components/FeaturePickerV3';
import { TaskTransferDialogV3 } from './components/TaskTransferDialogV3';
import { SubtaskSheetV3 } from './components/SubtaskSheetV3';
import { getVisibleTabs, TASK_FEATURE_REGISTRY } from '../TaskFeatureRegistry';
import { isUnbuilt } from './featureCatalogV3';
import { useTabOrder } from './hooks/useTabOrder';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { useDirtyGuard } from '../hooks/useDirtyGuard';
import { useTaskUrlSync, clearTaskUrl } from '../hooks/useTaskUrlSync';
import { useTaskForm } from '../hooks/useTaskForm';
import { useTaskChecklist } from '../hooks/useTaskChecklist';
import { useAssigneeOptions } from '../hooks/useAssigneeOptions';
import { useProjectOptions } from '../hooks/useProjectOptions';
import { useTaskFeatures } from '../hooks/useTaskFeatures';
import { taskDetailStore } from '../taskDetailStore';

const FULLSCREEN_KEY = 'apya.taskDetail.fullscreen';

const notify = {
    ok:   (m) => window?.abp?.notify?.success?.(m),
    info: (m) => window?.abp?.notify?.info?.(m),
    err:  (m) => window?.abp?.notify?.error?.(m),
};

/** Proje adından kod türetir (CreateProjectDto.Code zorunlu). */
function projectCodeFrom(name) {
    const slug = name
        .toLocaleUpperCase('tr-TR')
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
    return slug || `PRJ-${Date.now().toString().slice(-6)}`;
}

export function TaskDetailRootV3({ taskId, presentation = 'modal', onClose, switchToTask }) {
    const [currentTaskId, setCurrentTaskId] = useState(taskId);
    /* isLoading DEĞİL isPending: kalıcılaştırılmış önbellek geri yüklenirken
       (PersistQueryClientProvider'ın `isRestoring` penceresi) TanStack sorguyu
       `fetchStatus:'idle'` gösterir → isLoading FALSE olur ama `task` hâlâ
       undefined'dır. Gövde o karede undefined görevle mount olurdu; önbellek
       dolu geldiği için (modalın ikinci açılışı) ardından iskelet aşaması hiç
       yaşanmaz, remount olmaz ve mount anında değerini yakalayan çocuklar
       (RichTextEditorV3'ün contentEditable'ı) sonsuza kadar BOŞ kalırdı. */
    const { data: task, isPending, isError, refetch } = useTaskDetail(currentTaskId);
    const queryClient = useQueryClient();
    const guard = useDirtyGuard();
    const form = useTaskForm(task);
    const assignees = useAssigneeOptions();
    const projects = useProjectOptions();
    const features = useTaskFeatures(currentTaskId);
    const checklist = useTaskChecklist(currentTaskId);

    const [activeTabCode, setActiveTabCode] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [transfer, setTransfer] = useState(null);   // { mode } | null
    const [openSubtaskId, setOpenSubtaskId] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [fullscreen, setFullscreen] = useState(() => {
        try { return localStorage.getItem(FULLSCREEN_KEY) === 'true'; } catch { return false; }
    });

    useTaskUrlSync(currentTaskId);

    /* Sunucudan gelen favori/takip durumunu bir kez yerel state'e al — düğmeler
       optimistik çalışıyor, her refetch'te kullanıcının tıklaması geri alınmasın. */
    const [syncedTaskId, setSyncedTaskId] = useState(null);
    if (task?.id && task.id !== syncedTaskId) {
        setSyncedTaskId(task.id);
        setIsFavorite(Boolean(task.isFavorite));
        setIsWatched(Boolean(task.isWatched));
    }

    useEffect(() => {
        if (form.isDirty) guard.markDirty(); else guard.markClean();
    });

    const closeNow = useCallback(() => { clearTaskUrl(); onClose?.(); }, [onClose]);
    const requestClose = useCallback(() => guard.requestClose(closeNow), [guard, closeNow]);

    const toggleFullscreen = useCallback(() => {
        setFullscreen((prev) => {
            const next = !prev;
            try { localStorage.setItem(FULLSCREEN_KEY, String(next)); } catch { /* quota */ }
            return next;
        });
    }, []);

    /* ─── Sekmeler ─── */
    const visibleTabs = useMemo(
        () => getVisibleTabs(features.assignedCodes),
        [features.assignedCodes],
    );
    const tabOrder = useTabOrder(visibleTabs);

    const counts = useMemo(() => ({
        subtasks:     task?.subTasks?.length ?? 0,
        files:        task?.attachments?.length ?? 0,
        dependencies: task?.predecessorIds?.length ?? 0,
        comments:     task?.comments?.length ?? 0,
        checklist:    checklist.items?.length ?? 0,
    }), [task, checklist.items]);

    const activeTabDef = TASK_FEATURE_REGISTRY.find((t) => t.code === activeTabCode);

    /* ─── İlerleme (kontrol listesi tamamlanma oranı) ─── */
    const clItems = checklist.items ?? [];
    const clDone = clItems.filter((c) => c.isDone).length;
    const progressPercent = clItems.length ? Math.round((clDone / clItems.length) * 100) : 0;

    /* ─── Kaydet ─── */
    const doSave = useCallback(async () => {
        if (!form.validate()) {
            notify.err('Zorunlu alanları kontrol edin.');
            return false;
        }
        setIsSaving(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.update(currentTaskId, form.toUpdateDto()));
            await queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] });
            taskDetailStore.emitResult();
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
            notify.ok('Görev başarıyla güncellendi.');
            return true;
        } catch (err) {
            notify.err(err?.message || 'Kaydedilemedi.');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [currentTaskId, form, queryClient]);

    /* ─── Klavye: Ctrl/⌘+S kaydeder, Esc katman katman kapatır ─── */
    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                if (form.isDirty && !isSaving) doSave();
                return;
            }
            if (e.key !== 'Escape') return;
            /* Sıra: önce üstteki overlay. Alt görev paneli kendi Esc'ini dinliyor,
               modalın Esc'ini Radix yönetiyor — burada yalnız aradaki iki katman. */
            if (transfer) { e.stopPropagation(); setTransfer(null); return; }
            if (pickerOpen) { e.stopPropagation(); setPickerOpen(false); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [doSave, form.isDirty, isSaving, transfer, pickerOpen]);

    /* ─── ⋯ menüsü eylemleri ─── */
    const svc = () => window?.apya?.platform?.tasks?.task;

    const handleToggleFavorite = async () => {
        const next = !isFavorite;
        setIsFavorite(next);
        try {
            await Promise.resolve(svc()?.toggleFavorite(currentTaskId));
        } catch (err) {
            setIsFavorite(!next);
            notify.err(err?.message || 'Favori güncellenemedi.');
        }
    };

    /**
     * PDF olarak dışa aktar — sunucu QuestPDF ile üretir (ReportExporter.TaskDetailToPdf),
     * handler: /Tasks/Detail/{id}?handler=Pdf. İndirme XHR ile DEĞİL, gizli bir <a>
     * ile tetikleniyor: dosyayı belleğe almadan tarayıcının kendi indirme akışını
     * kullanır ve oturum çerezi doğal olarak gider.
     */
    const handleExportPdf = () => {
        if (!currentTaskId) return;
        const a = document.createElement('a');
        a.href = `/Tasks/Detail/${currentTaskId}?handler=Pdf`;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleToggleWatch = async () => {
        const next = !isWatched;
        setIsWatched(next);
        try {
            await Promise.resolve(svc()?.toggleWatch(currentTaskId));
            notify.info(next ? 'Görev takip ediliyor.' : 'Takip bırakıldı.');
        } catch (err) {
            setIsWatched(!next);
            notify.err(err?.message || 'Takip durumu güncellenemedi.');
        }
    };

    const handleDuplicate = async () => {
        try {
            const result = await Promise.resolve(svc()?.transfer(currentTaskId, {
                mode: 2, // Copy
                targetProjectIds: task?.projectId ? [task.projectId] : [],
                include: { subtasks: true, checklist: true, comments: false, files: true, keepAssignee: true, keepLinks: true, shiftDates: false },
            }));
            await queryClient.invalidateQueries({ queryKey: ['task-detail'] });
            notify.ok('Görev çoğaltıldı.');
            const newId = result?.createdTaskIds?.[0];
            if (newId) setCurrentTaskId(newId);
        } catch (err) {
            notify.err(err?.message || 'Görev çoğaltılamadı.');
        }
    };

    const handleArchive = async () => {
        try {
            await Promise.resolve(svc()?.updateStatus(currentTaskId, 4));
            await queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] });
            notify.info('Görev arşivlendi (Tamamlandı).');
        } catch (err) {
            notify.err(err?.message || 'Görev arşivlenemedi.');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?')) return;
        try {
            await Promise.resolve(svc()?.delete(currentTaskId));
            notify.info('Görev silindi.');
            guard.markClean();
            closeNow();
        } catch (err) {
            notify.err(err?.message || 'Görev silinemedi.');
        }
    };

    /* ─── Özellik ekleme / kaldırma ─── */
    const handleAddFeature = async (code) => {
        try {
            await features.addFeature(code);
            setActiveTabCode(code);
            notify.ok('Özellik başarıyla eklendi.');
        } catch (err) {
            notify.err(err?.message || 'Özellik eklenemedi.');
        }
    };

    const handleRemoveFeature = async (code) => {
        try {
            await features.removeFeature(code);
            setActiveTabCode('general');
            notify.info('Özellik görevden kaldırıldı.');
        } catch (err) {
            notify.err(err?.message || 'Özellik kaldırılamadı.');
        }
    };

    /* ─── Transfer ─── */
    const handleCreateProject = async (name) => {
        /* DİKKAT: ProjectAppService'in namespace'i `Apya.Platform.Application.Projects`
           (araya "Application" giriyor), bu yüzden ABP proxy'si
           `apya.platform.application.projects.project` altında — `tasks.task` deseniyle
           simetrik DEĞİL. İkinci yol, namespace ileride düzeltilirse diye yedek. */
        const projectSvc = window?.apya?.platform?.application?.projects?.project
            ?? window?.apya?.platform?.projects?.project;
        if (!projectSvc?.create) throw new Error('Proje servisi yüklenmedi.');
        const created = await Promise.resolve(projectSvc.create({
            name, code: projectCodeFrom(name), currency: 'TRY',
        }));
        await queryClient.invalidateQueries({ queryKey: ['task-detail', 'projects-lookup'] });
        notify.ok(`“${name}” projesi oluşturuldu.`);
        return created?.id ?? created;
    };

    const handleTransferConfirm = async ({ mode, targetProjectIds, include }) => {
        try {
            const result = await Promise.resolve(svc()?.transfer(currentTaskId, {
                mode: mode === 'move' ? 1 : 2,
                targetProjectIds,
                include,
            }));
            await queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] });
            const names = targetProjectIds
                .map((id) => projects.options.find((p) => p.value === id)?.label)
                .filter(Boolean);
            const copies = result?.createdTaskIds?.length ?? 0;
            notify.ok(mode === 'move'
                ? (copies
                    ? `“${names[0]}” projesine taşındı, ${copies} projeye kopyalandı.`
                    : `Görev “${names[0]}” projesine taşındı.`)
                : (copies > 1 ? `${copies} projeye kopyalandı.` : `Kopya “${names[0]}” projesinde oluşturuldu.`));
            setTransfer(null);
        } catch (err) {
            notify.err(err?.message || 'Transfer tamamlanamadı.');
        }
    };

    /* ─── İçerik ─── */
    const isGeneral = activeTabCode === 'general';

    const tabContent = isGeneral ? (
        <div className="grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start">
            <TaskGeneralTabV3
                task={task}
                onFieldChange={form.setField}
                descriptionValue={form.values.description}
                checklist={checklist}
                currentUserName={window?.abp?.currentUser?.name || window?.abp?.currentUser?.userName || 'Ben'}
            />
            <div className="w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5">
                <TaskSidePanelV3 task={task} nameById={assignees.nameById} />
            </div>
        </div>
    ) : isUnbuilt(activeTabCode) ? (
        <TaskUnbuiltTabV3
            code={activeTabCode}
            onRemoveFeature={handleRemoveFeature}
            onOpenPicker={() => setPickerOpen(true)}
            canRemove={!activeTabDef?.isCore}
        />
    ) : (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            {activeTabDef?.component ? (
                <activeTabDef.component
                    taskId={currentTaskId}
                    task={task}
                    nameById={assignees.nameById}
                    onOpenSubtask={setOpenSubtaskId}
                />
            ) : (
                <TaskUnbuiltTabV3
                    code={activeTabCode}
                    onRemoveFeature={handleRemoveFeature}
                    onOpenPicker={() => setPickerOpen(true)}
                    canRemove={!activeTabDef?.isCore}
                />
            )}
        </Suspense>
    );

    const body = isPending ? (
        <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    ) : isError ? (
        <div className="p-12 text-center flex flex-col items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-3xl text-warning" />
            <p className="text-text-secondary font-medium">Görev detayları yüklenemedi.</p>
            <Button variant="ghost" onClick={() => refetch()}>Tekrar Dene</Button>
        </div>
    ) : (
        <div className="flex flex-col flex-1 min-h-0 bg-surface-base">
            <TaskDetailHeaderV3
                task={task}
                presentation={presentation}
                onClose={requestClose}
                isFullscreen={fullscreen}
                onToggleFullscreen={toggleFullscreen}
                onFieldChange={form.setField}
                statusValue={form.values.status}
                titleValue={task?.title}
                isPrivateValue={form.values.isPrivate}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                isWatched={isWatched}
                onToggleWatch={handleToggleWatch}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onOpenTransfer={(mode) => setTransfer({ mode })}
                onSaveAsTemplate={() => notify.info('Şablon olarak kaydetme yakında.')}
                onConvertToSubtask={() => notify.info('Alt göreve dönüştürme yakında.')}
                onExportPdf={handleExportPdf}
            />

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <TaskMetadataGridV3
                    task={task}
                    assigneeOptions={assignees.options}
                    projectOptions={projects.options}
                    onFieldChange={form.setField}
                    statusValue={form.values.status}
                    priorityValue={form.values.priority}
                    assigneeValue={form.values.assigneeId}
                    projectValue={form.values.projectId}
                    dueDateValue={form.values.dueDate}
                    startDateValue={form.values.startDate}
                    tagsValue={form.values.tagNames}
                    progressPercent={progressPercent}
                    progressNote={`${clDone}/${clItems.length} madde`}
                    onOpenTransfer={(mode) => setTransfer({ mode })}
                />

                <div className="flex items-stretch min-w-0">
                    {presentation === 'page' && (
                        <TaskFeatureRailV3
                            activeTab={activeTabCode}
                            onTabChange={setActiveTabCode}
                            orderedTabs={tabOrder.orderedTabs}
                            draggingCode={tabOrder.draggingCode}
                            onDragStart={tabOrder.handleDragStart}
                            onDragEnd={tabOrder.handleDragEnd}
                            onReorderTo={tabOrder.reorderTo}
                            onReorderDrop={() => notify.info('Sekme sırası güncellendi.')}
                            onOpenPicker={() => setPickerOpen(true)}
                            counts={counts}
                        />
                    )}

                    <div className="flex flex-col min-w-0 flex-1">
                        {/* Tam sayfada üst çubuk gizlenir, yerini sol ray alır — ama
                            ≤860px'te ray gizlendiği için çubuk geri gelir. */}
                        <div className={presentation === 'page' ? 'gte-861:hidden' : ''}>
                            <TaskFeatureNavbarV3
                                activeTab={activeTabCode}
                                onTabChange={setActiveTabCode}
                                orderedTabs={tabOrder.orderedTabs}
                                draggingCode={tabOrder.draggingCode}
                                onDragStart={tabOrder.handleDragStart}
                                onDragEnd={tabOrder.handleDragEnd}
                                onReorderTo={tabOrder.reorderTo}
                                onReorderDrop={() => notify.info('Sekme sırası güncellendi.')}
                                onOpenPicker={() => setPickerOpen(true)}
                                counts={counts}
                                isDirty={form.isDirty}
                            />
                        </div>

                        <div className="flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised">
                            {tabContent}
                        </div>
                    </div>
                </div>
            </div>

            <TaskDetailFooterV3
                lastSavedAt={task?.lastModificationTime}
                isDirty={form.isDirty}
                isSaving={isSaving}
                justSaved={justSaved}
                onCancel={requestClose}
                onSave={doSave}
            />
        </div>
    );

    const overlays = (
        <>
            <FeaturePickerV3
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                assignedCodes={features.assignedCodes}
                onAddFeature={handleAddFeature}
                onGoToTab={setActiveTabCode}
            />
            <TaskTransferDialogV3
                open={Boolean(transfer)}
                mode={transfer?.mode ?? 'move'}
                onClose={() => setTransfer(null)}
                onConfirm={handleTransferConfirm}
                projectOptions={projects.options}
                currentProjectId={form.values.projectId}
                counts={counts}
                onCreateProject={handleCreateProject}
            />
            {openSubtaskId && (
                <SubtaskSheetV3
                    subtaskId={openSubtaskId}
                    parentCode={task?.code}
                    onClose={() => setOpenSubtaskId(null)}
                    onOpenFull={(id) => { setOpenSubtaskId(null); (switchToTask ?? setCurrentTaskId)(id); }}
                    onDeleted={() => queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] })}
                    currentUserName={window?.abp?.currentUser?.name || window?.abp?.currentUser?.userName || 'Ben'}
                />
            )}
        </>
    );

    if (presentation === 'page') {
        return (
            <>
                <div className="flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base">
                    {body}
                </div>
                {overlays}
            </>
        );
    }

    return (
        <>
            <Dialog open onOpenChange={(next) => { if (!next) requestClose(); }}>
                <DialogContent
                    title={task?.title ? `Görev Detayı: ${task.title}` : 'Görev Detayı'}
                    fullscreen={fullscreen}
                    /* short:h-[100svh] — yatay telefonda başlık+metadata+sekme
                       çubuğu+footer zaten ~220px yer kapladığı için %88'lik pay
                       içeriğe avuç içi kadar alan bırakıyordu; kısa viewport'ta
                       panel tüm yüksekliği alsın. */
                    className={fullscreen
                        ? 'p-0 rounded-xl border border-default shadow-xl short:h-[100svh]'
                        : 'w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]'}
                    /* Özellik seçici / transfer diyaloğu / alt görev paneli createPortal ile
                       body'ye basılıyor; Radix'in dismissable-layer yığınında olmadıkları için
                       içlerindeki HER tıklama "dışarı tıklama" sayılıp ana modalı kapatıyordu
                       (alt görev panelinde "Tamam"a basmak görev detayını kapatıyordu).
                       Üstte açık bir katman varsa dışarı tıklama yok sayılır. */
                    onInteractOutside={(e) => {
                        e.preventDefault();
                        if (pickerOpen || transfer || openSubtaskId) return;
                        if (e.target?.closest?.('[data-apya-overlay]')) return;
                        requestClose();
                    }}
                    onEscapeKeyDown={(e) => {
                        /* Üstte açık bir katman varsa modal kapanmasın — o katman
                           kendi Esc'ini zaten işliyor. */
                        if (pickerOpen || transfer || openSubtaskId) { e.preventDefault(); return; }
                        e.preventDefault();
                        requestClose();
                    }}
                >
                    {body}
                </DialogContent>
            </Dialog>
            {overlays}
        </>
    );
}
