import React, { useState, useCallback } from 'react';
import { ModalShell } from './shells/ModalShell';
import { TaskDetailHeader } from './components/TaskDetailHeader';
import { TaskDetailFooter } from './components/TaskDetailFooter';
import { useTaskDetail, isGranted } from './hooks/useTaskDetail';
import { useDirtyGuard } from './hooks/useDirtyGuard';
import { useTaskUrlSync, clearTaskUrl } from './hooks/useTaskUrlSync';
import { Skeleton, Button } from '../components/ui';

const FULLSCREEN_KEY = 'apya.taskDetail.fullscreen';

/**
 * TaskDetailRoot — sunum-BAĞIMSIZ çekirdek: veri, izin, dirty state.
 * `presentation` yalnız hangi kabuğun saracağını seçer. Faz 5'te 'page' eklenecek;
 * içerik componentleri (Faz 2+) her iki modda da AYNI kalır.
 */
export function TaskDetailRoot({ taskId, presentation = 'modal', onClose }) {
    const { data: task, isLoading, isError, refetch } = useTaskDetail(taskId);
    const guard = useDirtyGuard();
    const [fullscreen, setFullscreen] = useState(
        () => window.localStorage?.getItem(FULLSCREEN_KEY) === '1',
    );

    const closeNow = useCallback(() => {
        clearTaskUrl();
        onClose?.();
    }, [onClose]);

    useTaskUrlSync(taskId, closeNow);

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

    /* SİLME Faz 1'de ÇALIŞIR olmak zorunda: bugün drawer'da çalışıyor, bayrak
       açıldığında kaybolursa fonksiyonel regresyon olur. Kaydetme aksine Faz 2'ye
       kalabilir çünkü Faz 1'de düzenlenebilir alan hiç yok (Kaydet hep disabled). */
    const handleDelete = useCallback(async () => {
        setDeleting(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(taskId));
            window?.abp?.notify?.info?.('Başarıyla silindi.');
            setDeleteOpen(false);
            guard.markClean();
            closeNow();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev silinemedi.');
        } finally {
            setDeleting(false);
        }
    }, [taskId, guard, closeNow]);

    const body = isLoading
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
                <p className="text-text-tertiary">
                    Genel sekmesi Faz 2&apos;de eklenecek.
                </p>
            );

    /* presentation: Faz 1'de tek geçerli değer 'modal'; Faz 5'te 'page' eklenecek
       ve ModalShell yerine PageShell seçilecek. Prop şimdi duruyor çünkü çağıran
       taraflar (island + Faz 5'in Razor sayfası) bu sözleşmeye göre yazılıyor.
       Bilinmeyen değer için savunma kodu YOK — çağıran iç kod, dış girdi değil. */
    return (
        <ModalShell
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
                    isSaving={false}
                    onCancel={requestClose}
                    /* onSave BİLEREK geçilmiyor: Faz 1'de düzenlenebilir alan yok,
                       isDirty hiç true olmuyor, Kaydet hep disabled → handler asla
                       çalışmaz. No-op fonksiyon yerine hiç geçmemek daha dürüst.
                       Gerçek kaydetme Faz 2'de bağlanacak. */
                />
            )}
        >
            {body}
            {guard.pendingClose && (
                <UnsavedChangesDialog
                    onStay={() => guard.resolvePendingClose('stay')}
                    onDiscard={() => guard.resolvePendingClose('discard')}
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
        </ModalShell>
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

function UnsavedChangesDialog({ onStay, onDiscard }) {
    return (
        <AlertShell
            label="Kaydedilmemiş değişiklikler"
            title="Kaydedilmemiş değişiklikleriniz var."
            description="Çıkarsanız yaptığınız değişiklikler kaybolur."
            actions={(
                <>
                    <Button variant="secondary" onClick={onStay}>Düzenlemeye devam et</Button>
                    <Button variant="destructive" onClick={onDiscard}>Değişiklikleri iptal et</Button>
                </>
            )}
        />
    );
}
