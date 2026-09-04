import React, { useRef, useState } from 'react';
import { useTaskAttachments } from '../../hooks/useTaskAttachments';
import { isImageFile, fmtSize } from '../tabPrimitives';

/**
 * Dosya Galerisi sekmesi (V3). Ayrı bir depo YOK — görevin mevcut ekleri
 * (`TaskAttachment`) arasından görsel olanları önizlemeli ızgarada gösterir.
 * Yükleme/silme yolu Dosyalar sekmesiyle aynı hook üzerinden gider, dolayısıyla
 * iki sekme aynı veriyi anında paylaşır. Yeni şema YOK.
 */
export function GalleryTabV3({ taskId }) {
    const { attachments, isLoading, upload, remove, isUploading } = useTaskAttachments(taskId);
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const images = attachments.filter((a) => isImageFile(a.fileName));

    const uploadFile = async (file) => {
        if (!file) return;
        if (!isImageFile(file.name)) {
            window?.abp?.notify?.error?.('Galeriye yalnız görsel dosya yüklenebilir.');
            return;
        }
        try {
            await upload(file);
            window?.abp?.notify?.success?.('Görsel yüklendi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görsel yüklenemedi.');
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
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadFile(e.target.files?.[0])}
                disabled={isUploading}
            />

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
                <i className={`fa-solid ${isUploading ? 'fa-circle-notch fa-spin' : 'fa-images'} text-[26px] ${dragging ? 'text-primary' : 'text-text-tertiary'}`} />
                <span className="text-[13.5px] font-bold text-text-primary">
                    {isUploading ? 'Yükleniyor…' : dragging ? 'Bırakın, yükleyelim' : 'Görselleri buraya sürükleyin veya tıklayın'}
                </span>
                <span className="text-[12px] text-text-tertiary">PNG, JPG, GIF, WEBP, SVG · max 25MB</span>
            </div>

            {isLoading && images.length === 0 && (
                <p className="m-0 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
            )}

            {!isLoading && images.length === 0 && (
                <p className="m-0 text-[12.5px] text-text-tertiary">
                    Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür.
                </p>
            )}

            {images.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                    {images.map((att) => (
                        <figure
                            key={att.id}
                            className="group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md"
                        >
                            <a
                                href={att.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                title={`${att.fileName} — tam boyutta aç`}
                                className="block aspect-[4/3] overflow-hidden bg-neutral-subtle"
                            >
                                <img
                                    src={att.downloadUrl}
                                    alt={att.fileName}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                                />
                            </a>

                            <figcaption className="flex items-center justify-between gap-2 p-2.5">
                                <div className="min-w-0">
                                    <div className="truncate text-[12px] font-bold text-text-primary" title={att.fileName}>
                                        {att.fileName}
                                    </div>
                                    <div className="font-mono text-[11px] text-text-tertiary">{fmtSize(att.fileSize)}</div>
                                </div>
                                <button
                                    type="button"
                                    title="Sil"
                                    aria-label={`${att.fileName} gorselini sil`}
                                    onClick={() => onDelete(att.id, att.fileName)}
                                    className="flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                >
                                    <i className="fa-regular fa-trash-can text-[11px]" />
                                </button>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            )}
        </div>
    );
}
