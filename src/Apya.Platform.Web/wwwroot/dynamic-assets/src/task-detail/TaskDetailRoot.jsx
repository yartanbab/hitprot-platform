import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalShell } from './shells/ModalShell';
import { PageShell } from './shells/PageShell';
import { TaskDetailHeader } from './components/TaskDetailHeader';
import { TaskDetailFooter } from './components/TaskDetailFooter';
import { TaskGeneralForm } from './components/TaskGeneralForm';
import { TaskDetailsPanel } from './components/TaskDetailsPanel';
import { TaskFeatureNavbar } from './components/TaskFeatureNavbar';
import { FeaturePicker } from './components/FeaturePicker';
import { TaskBreadcrumb } from './components/TaskBreadcrumb';
import { useTaskDetail, isGranted } from './hooks/useTaskDetail';
import { useDirtyGuard } from './hooks/useDirtyGuard';
import { useTaskUrlSync, clearTaskUrl } from './hooks/useTaskUrlSync';
import { useTaskForm } from './hooks/useTaskForm';
import { useAssigneeOptions } from './hooks/useAssigneeOptions';
import { useTaskFeatures } from './hooks/useTaskFeatures';
import { getVisibleTabs, getPickerEntries } from './TaskFeatureRegistry';
import { taskDetailStore } from './taskDetailStore';
import { Skeleton, Button } from '../components/ui';

const FULLSCREEN_KEY = 'apya.taskDetail.fullscreen';

/**
 * TaskDetailRoot — sunum-BAĞIMSIZ çekirdek: veri, izin, dirty state.
 * `presentation` yalnız hangi kabuğun saracağını seçer. Faz 5'te 'page' eklenecek;
 * içerik componentleri (Faz 2+) her iki modda da AYNI kalır.
 */
export function TaskDetailRoot({ taskId, presentation = 'modal', onClose }) {
    const [currentTaskId, setCurrentTaskId] = useState(taskId);
    const [breadcrumbTrail, setBreadcrumbTrail] = useState([]); // [{id, title}]
    /* isLoading DEĞİL isPending: kalıcılaştırılmış önbellek geri yüklenirken
       (PersistQueryClientProvider'ın `isRestoring` penceresi) TanStack sorguyu
       `fetchStatus:'idle'` gösterir → isLoading FALSE olur ama `task` hâlâ
       undefined'dır. Gövde o karede undefined görevle çizilip `task.creatorId`
       okumasında ÇÖKÜYORDU. (v3 kökünde aynı kapı açıklama editörünü kalıcı
       boş bırakıyordu — aynı sınıf hata.) */
    const { data: task, isPending, isError, refetch } = useTaskDetail(currentTaskId);
    const guard = useDirtyGuard();
    const form = useTaskForm(task);
    const assignees = useAssigneeOptions();
    const features = useTaskFeatures(currentTaskId);
    const [activeCode, setActiveCode] = useState('general');
    const [pickerOpen, setPickerOpen] = useState(false);
    const pickerRef = React.useRef(null);
    const visibleTabs = useMemo(
        () => getVisibleTabs(features.assignedCodes),
        [features.assignedCodes],
    );
    const pickerEntries = useMemo(
        () => getPickerEntries(features.assignedCodes),
        [features.assignedCodes],
    );
    /* activeCode baska bir oturumda kaldirilmis bir ozelligi gosteriyor olabilir
       (refetchOnWindowFocus sonrasi assignedCodes degisip visibleTabs kuculur) —
       boyle durumda visibleTabs[0]'a (daima 'general', core+implemented) don;
       asagidaki effect activeCode state'ini de ayni degere senkronlar ki navbar'da
       da 'general' aria-selected=true gorunsun, bos panel + secili sekme yok
       durumu olusmasin. */
    const activeFeature = visibleTabs.find((t) => t.code === activeCode) ?? visibleTabs[0];
    React.useEffect(() => {
        if (activeFeature.code !== activeCode) setActiveCode(activeFeature.code);
    }, [activeFeature, activeCode]);
    // JSX renders lowercase tag names as literal DOM elements, so a dynamic
    // component reference must be bound to a capitalized variable first.
    const ActiveFeatureComponent = activeFeature?.component;
    const queryClient = useQueryClient();
    const [fullscreen, setFullscreen] = useState(
        () => window.localStorage?.getItem(FULLSCREEN_KEY) === '1',
    );
    const [isSaving, setIsSaving] = useState(false);

    const closeNow = useCallback(() => {
        clearTaskUrl();
        onClose?.();
    }, [onClose]);

    useTaskUrlSync(taskId, closeNow);

    /* Formun dirty durumu tek gerçek kaynak; guard'ı buna senkron tutuyoruz.
       guard.markDirty/markClean useCallback([])'la sabit, effect deps'e girmesi zararsız. */
    React.useEffect(() => {
        if (form.isDirty) guard.markDirty(); else guard.markClean();
    }); // eslint-disable-line react-hooks/exhaustive-deps

    const requestClose = useCallback(() => guard.requestClose(closeNow), [guard, closeNow]);

    const toggleFullscreen = useCallback(() => {
        setFullscreen((v) => {
            const next = !v;
            window.localStorage?.setItem(FULLSCREEN_KEY, next ? '1' : '0');
            return next;
        });
    }, []);

    const canDelete = isGranted('Platform.Tasks.Delete');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = useCallback(async () => {
        setDeleting(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(currentTaskId));
            window?.abp?.notify?.info?.('Başarıyla silindi.');
            setDeleteOpen(false);
            guard.markClean();
            closeNow();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev silinemedi.');
        } finally {
            setDeleting(false);
        }
    }, [currentTaskId, guard, closeNow]);

    /** Kaydeder; başarılıysa true döner (çağıran taraf kapatıp kapatmayacağına kendi karar verir). */
    const doSave = useCallback(async () => {
        if (!form.validate()) return false;
        setIsSaving(true);
        try {
            await Promise.resolve(
                window.apya.platform.tasks.task.update(currentTaskId, form.toUpdateDto()),
            );
            await queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] });
            /* Modal açık kalabilir (yalnız Kaydet, kapatma yok) — bu yüzden liste/kanban
               tazelemesi burada tetiklenir, yalnız closeNow'a bağlı kalınmaz. "Kaydet ve
               çık" akışında closeNow'un kendi onClose zinciri de emitResult çağırır; bu
               çift-tetikleme zararsızdır (liste bir kez daha yenilenir), engellemek için
               ekstra state tutmaya değmez. */
            taskDetailStore.emitResult();
            window?.abp?.notify?.success?.('Kaydedildi.');
            return true;
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Kaydedilemedi.');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [currentTaskId, form, guard, queryClient]);

    const handleSaveClick = useCallback(() => { doSave(); }, [doSave]);

    const handleUnsavedSaveAndClose = useCallback(async () => {
        const doClose = guard.resolvePendingClose('save');
        const ok = await doSave();
        if (ok) doClose?.();
    }, [guard, doSave]);

    /* guard.requestClose'un generic "kapatma" parametresini burada kapatma DIŞINDA
       bir aksiyon (context-switch) için reuse ediyoruz — dirty'yken aynı "Kaydedilmemiş
       değişiklikler" dialog'u açılır, temizken direkt geçer. */
    const switchToTask = useCallback((nextId, nextTitle) => {
        guard.requestClose(() => {
            setBreadcrumbTrail((trail) => [...trail, { id: currentTaskId, title: task?.title ?? '' }]);
            setCurrentTaskId(nextId);
            setActiveCode('general');
            guard.markClean();
        });
    }, [guard, currentTaskId, task]);

    const navigateBreadcrumb = useCallback((targetId) => {
        guard.requestClose(() => {
            setBreadcrumbTrail((trail) => {
                const idx = trail.findIndex((c) => c.id === targetId);
                return idx === -1 ? trail : trail.slice(0, idx);
            });
            setCurrentTaskId(targetId);
            setActiveCode('general');
            guard.markClean();
        });
    }, [guard]);

    const handleAddFeature = useCallback(async (code) => {
        try {
            await features.addFeature(code);
            setActiveCode(code);
            setPickerOpen(false);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Özellik eklenemedi.');
        }
    }, [features]);

    const handleRemoveFeature = useCallback(async (code) => {
        try {
            await features.removeFeature(code);
            setActiveCode((current) => (current === code ? 'general' : current));
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Özellik kaldırılamadı.');
        }
    }, [features]);

    /* "+" tetikleyicisi ile popover paneli TEK bir ref altinda — TaskDetailHeader'daki
       "⋯" menusuyle AYNI desen (menuRef hem butonu hem menuyu kapsar). Aksi halde
       "+" butonuna basmak mousedown'da onClose'u tetikleyip click'te tekrar acar
       (popover hic kapanmiyormus gibi davranir). */
    React.useEffect(() => {
        if (!pickerOpen) return undefined;
        const onDocClick = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
        };
        const onEsc = (e) => { if (e.key === 'Escape') setPickerOpen(false); };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, [pickerOpen]);

    const body = isPending
        ? (
            <div aria-label="Görev yükleniyor" aria-busy="true" className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
        : isError
            ? (
                <div className="grid place-items-center gap-3 py-[var(--apya-space-12)] text-center">
                    <i className="fa fa-triangle-exclamation text-2xl text-text-tertiary" aria-hidden="true" />
                    <p className="text-text-secondary">Görev yüklenemedi. Erişim yetkiniz olmayabilir.</p>
                    <Button variant="ghost" onClick={() => refetch()}>Tekrar dene</Button>
                </div>
            )
            : (
                <div className="flex min-h-0 flex-col gap-[var(--apya-space-4)]">
                    <TaskBreadcrumb
                        trail={breadcrumbTrail}
                        current={{ id: currentTaskId, title: task?.title ?? '' }}
                        onNavigate={navigateBreadcrumb}
                    />
                    <div className="relative" ref={pickerRef}>
                        <TaskFeatureNavbar
                            tabs={visibleTabs}
                            activeCode={activeFeature.code}
                            onSelect={(code) => { setActiveCode(code); setPickerOpen(false); }}
                            onOpenPicker={() => setPickerOpen((v) => !v)}
                            pickerOpen={pickerOpen}
                        />
                        {pickerOpen && (
                            <FeaturePicker
                                entries={pickerEntries}
                                busyCode={features.isMutating ? features.mutatingCode : null}
                                onAdd={handleAddFeature}
                                onRemove={handleRemoveFeature}
                            />
                        )}
                    </div>
                    <div
                        role="tabpanel"
                        id="task-feature-tabpanel"
                        aria-labelledby={`task-tab-${activeFeature.code}`}
                        className="grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]"
                    >
                        {activeFeature.code === 'general' ? (
                            <TaskGeneralForm
                                values={form.values}
                                errors={form.errors}
                                onFieldChange={form.setField}
                                assigneeOptions={assignees.options}
                                isLoadingAssignees={assignees.isLoading}
                            />
                        ) : (
                            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                                {ActiveFeatureComponent && (
                                    <ActiveFeatureComponent
                                        taskId={currentTaskId}
                                        task={task}
                                        form={form}
                                        onOpenSubtask={switchToTask}
                                    />
                                )}
                            </Suspense>
                        )}
                        <TaskDetailsPanel
                            task={task}
                            creatorName={assignees.nameById.get(task.creatorId)}
                            lastModifierName={assignees.nameById.get(task.lastModifierId)}
                        />
                    </div>
                </div>
            );

    const Shell = presentation === 'page' ? PageShell : ModalShell;

    return (
        <Shell
            open
            fullscreen={fullscreen}
            onRequestClose={requestClose}
            /* Dialog'un erişilebilir adı (sr-only) header'daki görünür h2 ile
               BİREBİR AYNI metin OLAMAZ — ikisi de aynı textContent'e sahip
               olursa testing-library (ve ekran okuyucu gezinme) tekilliği
               kaybeder. "Görev Detayı: " ön eki hem tekilliği korur hem de
               ekran okuyucuya hangi görev olduğunu söyler. */
            title={task ? `Görev Detayı: ${task.title}` : 'Görev Detayı'}
            header={(
                <TaskDetailHeader
                    task={task ?? { title: 'Yükleniyor…' }}
                    canDelete={canDelete}
                    fullscreen={fullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    onClose={requestClose}
                    onDelete={() => setDeleteOpen(true)}
                />
            )}
            footer={(
                <TaskDetailFooter
                    lastSavedAt={task?.lastModificationTime}
                    isDirty={guard.isDirty}
                    isSaving={isSaving}
                    onCancel={requestClose}
                    onSave={handleSaveClick}
                />
            )}
        >
            {body}
            {guard.pendingClose && (
                <UnsavedChangesDialog
                    isSaving={isSaving}
                    onStay={() => guard.resolvePendingClose('stay')}
                    onDiscard={() => guard.resolvePendingClose('discard')}
                    onSaveAndClose={handleUnsavedSaveAndClose}
                />
            )}
            {deleteOpen && (
                <DeleteTaskDialog
                    taskTitle={task?.title ?? ''}
                    busy={deleting}
                    onCancel={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </Shell>
    );
}

/**
 * Silme onayı — eski drawer'daki SweetAlert akışıyla aynı sertlikte:
 * kullanıcı tam olarak "SİL" yazmadan buton aktifleşmez.
 */
function DeleteTaskDialog({ taskTitle, busy, onCancel, onConfirm }) {
    const [text, setText] = useState('');
    const ok = text.trim() === 'SİL';
    return (
        <AlertShell
            label="Görev silinecek"
            title="Görev silinecek"
            description={<><strong className="text-text-primary">{taskTitle}</strong> kalıcı olarak silinecek. Onaylamak için aşağıya <strong>SİL</strong> yazın.</>}
            actions={(
                <>
                    <Button variant="secondary" onClick={onCancel} disabled={busy}>İptal</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={!ok}
                        isLoading={busy} loadingText="Siliniyor…">
                        Evet, sil
                    </Button>
                </>
            )}
        >
            <label htmlFor="delete-confirm" className="sr-only">Onay metni</label>
            <input
                id="delete-confirm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="SİL"
                autoComplete="off"
                className="mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
            />
        </AlertShell>
    );
}

/**
 * AlertShell — iki onay diyaloğunun ORTAK kabuğu (backdrop + kart + aksiyon satırı).
 * Ayrı bir component çünkü aksi halde aynı overlay markup'ı üç yere kopyalanırdı
 * (documents.jsx'te zaten bir kopyası var — o island'ın yerel ConfirmDialog'u).
 *
 * Radix Dialog KULLANILMIYOR: bu diyaloglar zaten açık bir Radix Dialog'un
 * İÇİNDE render ediliyor; ikinci bir portal + focus trap iç içe girip ESC
 * sırasını bozuyor. Burada dış modal focus trap'i zaten aktif.
 */
function AlertShell({ label, title, description, children, actions }) {
    return (
        <div role="alertdialog" aria-modal="true" aria-label={label}
            className="absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4">
            <div className="w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl">
                <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{description}</p>
                {children}
                <div className="mt-[var(--apya-space-5)] flex justify-end gap-2">{actions}</div>
            </div>
        </div>
    );
}

function UnsavedChangesDialog({ isSaving, onStay, onDiscard, onSaveAndClose }) {
    return (
        <AlertShell
            label="Kaydedilmemiş değişiklikler"
            title="Kaydedilmemiş değişiklikleriniz var."
            description="Çıkarsanız yaptığınız değişiklikler kaybolur."
            actions={(
                <>
                    <Button variant="secondary" onClick={onStay} disabled={isSaving}>Düzenlemeye devam et</Button>
                    <Button variant="destructive" onClick={onDiscard} disabled={isSaving}>Değişiklikleri iptal et</Button>
                    <Button variant="primary" onClick={onSaveAndClose} isLoading={isSaving} loadingText="Kaydediliyor…">
                        Kaydet ve çık
                    </Button>
                </>
            )}
        />
    );
}
