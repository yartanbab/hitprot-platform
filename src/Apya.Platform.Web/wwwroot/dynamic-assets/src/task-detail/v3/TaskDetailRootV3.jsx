import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, Skeleton, Button } from '../../components/ui';
import { TaskDetailHeaderV3 } from './components/TaskDetailHeaderV3';
import { TaskMetadataGridV3 } from './components/TaskMetadataGridV3';
import { TaskFeatureNavbarV3 } from './components/TaskFeatureNavbarV3';
import { TaskSidePanelV3 } from './components/TaskSidePanelV3';
import { TaskGeneralTabV3 } from './components/TaskGeneralTabV3';
import { TaskDetailFooterV3 } from './components/TaskDetailFooterV3';
import { ActivityTabV3 } from './components/ActivityTabV3';
import { FeaturePickerV3 } from './components/FeaturePickerV3';
import { getVisibleTabs } from '../TaskFeatureRegistry';
import { useTaskDetail, isGranted } from '../hooks/useTaskDetail';
import { useDirtyGuard } from '../hooks/useDirtyGuard';
import { useTaskUrlSync, clearTaskUrl } from '../hooks/useTaskUrlSync';
import { useTaskForm } from '../hooks/useTaskForm';
import { useAssigneeOptions } from '../hooks/useAssigneeOptions';
import { useTaskFeatures } from '../hooks/useTaskFeatures';
import { taskDetailStore } from '../taskDetailStore';

const FULLSCREEN_KEY = 'apya.taskDetail.fullscreen';

export function TaskDetailRootV3({ 
    taskId, 
    presentation = 'modal',
    onClose, 
    switchToTask 
}) {
    const [currentTaskId, setCurrentTaskId] = useState(taskId);
    const { data: task, isLoading, isError, refetch } = useTaskDetail(currentTaskId);
    const queryClient = useQueryClient();
    const guard = useDirtyGuard();
    const form = useTaskForm(task);
    const assignees = useAssigneeOptions();
    const features = useTaskFeatures(currentTaskId);

    const [activeTabCode, setActiveTabCode] = useState('general');
    const [fullscreen, setFullscreen] = useState(
        () => window.localStorage?.getItem(FULLSCREEN_KEY) === '1'
    );
    const [isSaving, setIsSaving] = useState(false);

    const closeNow = useCallback(() => {
        clearTaskUrl();
        onClose?.();
    }, [onClose]);

    useTaskUrlSync(taskId, closeNow);

    React.useEffect(() => {
        if (form.isDirty) guard.markDirty(); else guard.markClean();
    });

    const requestClose = useCallback(() => guard.requestClose(closeNow), [guard, closeNow]);

    const toggleFullscreen = useCallback(() => {
        setFullscreen((v) => {
            const next = !v;
            window.localStorage?.setItem(FULLSCREEN_KEY, next ? '1' : '0');
            return next;
        });
    }, []);

    const visibleTabs = useMemo(
        () => getVisibleTabs(features.assignedCodes),
        [features.assignedCodes]
    );

    const activeTabDef = visibleTabs.find(t => t.code === activeTabCode) || visibleTabs[0];

    const doSave = useCallback(async () => {
        if (!form.validate()) return false;
        setIsSaving(true);
        try {
            await Promise.resolve(
                window.apya.platform.tasks.task.update(currentTaskId, form.toUpdateDto())
            );
            await queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] });
            taskDetailStore.emitResult();
            window?.abp?.notify?.success?.('Görev başarıyla güncellendi.');
            return true;
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Kaydedilemedi.');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [currentTaskId, form, queryClient]);

    const handleDelete = useCallback(async () => {
        if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(currentTaskId));
            window?.abp?.notify?.info?.('Görev silindi.');
            guard.markClean();
            closeNow();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev silinemedi.');
        }
    }, [currentTaskId, guard, closeNow]);

    const content = isLoading ? (
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
        <div className="flex flex-col min-h-0 bg-surface-base">
            {/* V3 Header */}
            <TaskDetailHeaderV3 
                task={task} 
                onClose={requestClose} 
                isFullscreen={fullscreen}
                onToggleFullscreen={toggleFullscreen}
                presentation={presentation}
            />

            <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
                {/* 4-Kolon Metadata Grid */}
                <TaskMetadataGridV3 task={task} />

                {/* Sekmeler & Özellik Ekleme Barı */}
                <div className="flex items-center justify-between border-b border-subtle px-6 bg-surface-base">
                    <TaskFeatureNavbarV3 
                        activeTab={activeTabCode} 
                        onTabChange={setActiveTabCode}
                        visibleTabs={visibleTabs} 
                    />
                    <div className="py-2">
                        <FeaturePickerV3 assignedCodes={features.assignedCodes} />
                    </div>
                </div>

                {/* Ana İçerik Alanı */}
                <div className="p-6">
                    {activeTabCode === 'general' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                            {/* Sol Kolon: Zengin Açıklama, Kontrol Listesi, Yorumlar */}
                            <div className="min-w-0 space-y-6">
                                <TaskGeneralTabV3 task={task} />
                            </div>
                            
                            {/* Sağ Kolon: Detaylar & Hızlı İşlemler */}
                            <div className="w-full shrink-0">
                                <TaskSidePanelV3 task={task} />
                            </div>
                        </div>
                    ) : activeTabCode === 'history' || activeTabCode === 'activity' ? (
                        <ActivityTabV3 />
                    ) : (
                        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                            {activeTabDef?.component ? (
                                <activeTabDef.component 
                                    taskId={currentTaskId} 
                                    task={task} 
                                    onOpenSubtask={switchToTask} 
                                />
                            ) : (
                                <div className="text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl">
                                    <i className="fa-solid fa-person-digging text-4xl mb-4 opacity-50" />
                                    <p>Bu sekme yapım aşamasında.</p>
                                </div>
                            )}
                        </Suspense>
                    )}
                </div>
            </div>

            {/* V3 Footer with Save/Cancel */}
            <TaskDetailFooterV3
                lastSavedAt={task?.lastModificationTime}
                isDirty={guard.isDirty}
                isSaving={isSaving}
                onCancel={requestClose}
                onSave={doSave}
            />
        </div>
    );

    if (presentation === 'page') {
        return (
            <div className="w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden">
                {content}
            </div>
        );
    }

    return (
        <Dialog
            open={true}
            onOpenChange={(next) => { if (!next) requestClose(); }}
        >
            <DialogContent
                title={task?.title ? `Görev Detayı: ${task.title}` : 'Görev Detayı'}
                fullscreen={fullscreen}
                className="max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base"
                onInteractOutside={(e) => { e.preventDefault(); requestClose(); }}
                onEscapeKeyDown={(e) => { e.preventDefault(); requestClose(); }}
            >
                {content}
            </DialogContent>
        </Dialog>
    );
}
