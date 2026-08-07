import React, { useRef } from 'react';
import { Button } from '../../components/ui';
import { useTaskAttachments } from '../hooks/useTaskAttachments';

function formatSize(bytes) {
    return `${Math.round(bytes / 1024)} KB`;
}

export function FilesTab({ taskId }) {
    const { attachments, upload, remove, isUploading } = useTaskAttachments(taskId);
    const inputRef = useRef(null);

    const onFileChosen = async (e) => {
        const file = e.target.files?.[0];
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
        <div className="space-y-[var(--apya-space-4)]">
            <div className="flex items-center gap-2">
                <input ref={inputRef} type="file" onChange={onFileChosen} className="text-sm" disabled={isUploading} />
                {isUploading && <span className="text-sm text-text-tertiary">Yükleniyor…</span>}
            </div>

            {attachments.length === 0 ? (
                <p className="text-sm text-text-tertiary">Henüz dosya yüklenmemiş.</p>
            ) : (
                <ul className="divide-y divide-border-default">
                    {attachments.map((att) => (
                        <li key={att.id} className="flex items-center justify-between py-2">
                            <div>
                                <a href={att.downloadUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-text-primary hover:underline">
                                    {att.fileName}
                                </a>
                                <p className="text-xs text-text-tertiary">{formatSize(att.fileSize)} — {att.uploaderName}</p>
                            </div>
                            <Button variant="ghost" onClick={() => onDelete(att.id, att.fileName)} aria-label={`${att.fileName} dosyasini sil`}>
                                Sil
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
