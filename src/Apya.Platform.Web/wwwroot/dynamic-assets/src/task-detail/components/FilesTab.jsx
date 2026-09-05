import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTaskAttachments } from '../hooks/useTaskAttachments';
import { isGranted } from '../hooks/useTaskDetail';
import { fileKindOf, fmtSize } from '../v3/tabPrimitives';

/**
 * Dosyalar sekmesi (V4 tasarım dili) — sürükle-bırak alanı + kart ızgarası.
 * Yükleme yolu değişmedi (`useTaskAttachments` → raw multipart endpoint).
 */
export function FilesTab({ taskId }) {
    const { attachments, upload, remove, isUploading } = useTaskAttachments(taskId);
    const queryClient = useQueryClient();
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const canShare = isGranted('Platform.Tasks.ShareExternally');

    const onToggleGuestVisibility = async (attachmentId, isVisible) => {
        try {
            await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(attachmentId, isVisible);
            queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görünürlük değiştirilemedi.');
        }
    };

    const uploadFile = async (file) => {
        if (!file) return;
        try {
            await upload(file);
            window?.abp?.notify?.success?.('Dosya yüklendi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Dosya yüklenemedi.');
        } finally {
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const onDelete = async (attachmentId, fileName) => {
        try {
            await remove(attachmentId);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || `${fileName} silinemedi.`);
        }
    };

    return (
        <div className="flex flex-col gap-3.5">
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => uploadFile(e.target.files?.[0])}
                disabled={isUploading}
            />

            {attachments.length === 0 ? (
                <p className="m-0 text-[12.5px] text-text-tertiary">Henüz dosya yüklenmemiş.</p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
                    {attachments.map((att) => {
                        const kind = fileKindOf(att.fileName);
                        return (
                            <div
                                key={att.id}
                                className="flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className={`flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${kind.bg} ${kind.fg}`}>
                                        <i className={`fa-solid ${kind.icon} text-[15px]`} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[12.5px] font-bold text-text-primary" title={att.fileName}>
                                            {att.fileName}
                                        </div>
                                        <div className="font-mono text-[11px] text-text-tertiary">{fmtSize(att.fileSize)}</div>
                                    </div>
                                </div>

                                {/* Dış paylaşım görünürlüğü: misafir yüklemesinde anlamsız (dosya
                                    zaten sahibinin), o yüzden yalnız ekip dosyalarında çıkar. */}
                                {canShare && !att.isGuestUpload && (
                                    <label className="flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(att.isVisibleToGuests)}
                                            onChange={(e) => onToggleGuestVisibility(att.id, e.target.checked)}
                                        />
                                        Dış paylaşımda görünsün
                                    </label>
                                )}

                                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-subtle">
                                    <span className="truncate text-[11px] text-text-tertiary">
                                        {att.uploaderName}
                                        {att.isGuestUpload ? ' · dış' : ''}
                                    </span>
                                    <div className="flex gap-1 shrink-0">
                                        <a
                                            href={att.downloadUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            title="İndir"
                                            aria-label={`${att.fileName} dosyasini indir`}
                                            className="flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary"
                                        >
                                            <i className="fa-solid fa-download text-[11px]" />
                                        </a>
                                        <button
                                            type="button"
                                            title="Sil"
                                            aria-label={`${att.fileName} dosyasini sil`}
                                            onClick={() => onDelete(att.id, att.fileName)}
                                            className="flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                        >
                                            <i className="fa-regular fa-trash-can text-[11px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); uploadFile(e.dataTransfer?.files?.[0]); }}
                className={`flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${
                    dragging ? 'border-focus bg-primary-subtle' : 'border-strong bg-surface-base'
                }`}
            >
                <i className={`fa-solid ${isUploading ? 'fa-circle-notch fa-spin' : 'fa-cloud-arrow-up'} text-[26px] ${dragging ? 'text-primary' : 'text-text-tertiary'}`} />
                <span className="text-[13.5px] font-bold text-text-primary">
                    {isUploading ? 'Yükleniyor…' : dragging ? 'Bırakın, yükleyelim' : 'Dosyaları buraya sürükleyin veya tıklayın'}
                </span>
                <span className="text-[12px] text-text-tertiary">PNG, PDF, DOCX · max 25MB</span>
            </div>
        </div>
    );
}
