import React, { useEffect, useState } from 'react';
import { useTaskDocuments, useTaskDocument } from '../../hooks/useTaskDocuments';
import { RichTextEditorV3 } from '../components/RichTextEditorV3';
import { TabEmptyState, fmtDateTime } from '../tabPrimitives';

/**
 * Belge sekmesi (V3) — göreve bağlı zengin metin belgeleri.
 *
 * DB'YE YAZAR: TaskDocument tablosu (bu turda eklendi, çift migration).
 * Dosya ekinden AYRIDIR — ek yüklenmiş bir dosyayı saklar, belge uygulamanın
 * içinde yazılan metni.
 *
 * İki kip tek sekmede: liste ve editör. Liste ucu gövdeyi taşımaz, seçilen
 * belgenin gövdesi ayrı çekilir.
 *
 * Kaydetme AÇIK bir eylemdir (otomatik kaydetme yok): `document.execCommand`
 * tabanlı editör her tuşta onChange bastığı için otomatik kaydetme her harfte
 * bir istek anlamına gelirdi.
 */
export function DocumentsTabV3({ taskId }) {
    const { documents, isLoading, createDocument, updateDocument, removeDocument, isSaving } =
        useTaskDocuments(taskId);

    const [openId, setOpenId] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftContent, setDraftContent] = useState('');
    const [dirty, setDirty] = useState(false);

    const { data: openDoc, isFetching } = useTaskDocument(openId);

    /* Sunucudan gelen gövde tasla­ğa YALNIZ kimlik değiştiğinde yazılır; her
       yenilemede yazılsaydı kullanıcının yazdığı metin üstüne binerdi. */
    useEffect(() => {
        if (!openDoc || openDoc.id !== openId) return;
        setDraftTitle(openDoc.title ?? '');
        setDraftContent(openDoc.content ?? '');
        setDirty(false);
    }, [openDoc?.id]);   // eslint-disable-line react-hooks/exhaustive-deps

    const onCreate = async () => {
        try {
            const created = await createDocument('Yeni belge');
            if (created?.id) setOpenId(created.id);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Belge oluşturulamadı.');
        }
    };

    const onSave = async () => {
        const title = draftTitle.trim();
        if (!title) {
            window?.abp?.notify?.error?.('Belge başlığı boş olamaz.');
            return;
        }
        try {
            await updateDocument({ id: openId, title, content: draftContent });
            setDirty(false);
            window?.abp?.notify?.success?.('Belge kaydedildi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Belge kaydedilemedi.');
        }
    };

    const onDelete = async (id, title) => {
        try {
            await removeDocument(id);
            if (openId === id) setOpenId(null);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || `“${title}” silinemedi.`);
        }
    };

    const closeEditor = () => {
        // Kaydedilmemiş değişiklik varken kaza ile kapanmasın.
        if (dirty && !window.confirm('Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?')) return;
        setOpenId(null);
    };

    /* ─── Editör kipi ─── */
    if (openId) {
        return (
            <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={closeEditor}
                        aria-label="Belge listesine dön"
                        className="flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer"
                    >
                        <i className="fa-solid fa-arrow-left text-[12px]" />
                    </button>

                    <input
                        type="text"
                        value={draftTitle}
                        aria-label="Belge başlığı"
                        onChange={(e) => { setDraftTitle(e.target.value); setDirty(true); }}
                        className="flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
                    />

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || !dirty}
                        className={`flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${
                            isSaving || !dirty ? 'bg-border-strong cursor-not-allowed' : 'bg-primary hover:bg-primary-hover cursor-pointer'
                        }`}
                    >
                        <i className={`fa-solid ${isSaving ? 'fa-circle-notch fa-spin' : 'fa-floppy-disk'} text-[11px]`} />
                        {isSaving ? 'Kaydediliyor…' : dirty ? 'Kaydet' : 'Kaydedildi'}
                    </button>
                </div>

                {isFetching && !openDoc ? (
                    <p className="m-0 text-[12.5px] text-text-tertiary">Belge yükleniyor…</p>
                ) : (
                    <RichTextEditorV3
                        value={draftContent}
                        placeholder="Belgeyi buraya yazın…"
                        onChange={(html) => { setDraftContent(html); setDirty(true); }}
                    />
                )}
            </div>
        );
    }

    /* ─── Liste kipi ─── */
    return (
        <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-[14px] font-bold text-text-primary">Belgeler</h2>
                <button
                    type="button"
                    onClick={onCreate}
                    className="flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover"
                >
                    <i className="fa-solid fa-plus text-[11px]" />
                    Yeni belge
                </button>
            </div>

            {isLoading && documents.length === 0 && (
                <p className="m-0 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
            )}

            {!isLoading && documents.length === 0 && (
                <TabEmptyState
                    icon="fa-file-lines"
                    title="Henüz belge yok"
                    description="Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
                />
            )}

            {documents.length > 0 && (
                <div className="flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised"
                        >
                            <span className="flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary">
                                <i className="fa-solid fa-file-lines text-[14px]" />
                            </span>

                            <button
                                type="button"
                                onClick={() => setOpenId(doc.id)}
                                className="flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer"
                            >
                                <span className="block truncate text-[13px] font-bold text-text-primary">{doc.title}</span>
                                <span className="block text-[11.5px] text-text-tertiary">
                                    {doc.contentLength > 0
                                        ? `${doc.editorName} · ${fmtDateTime(doc.lastModificationTime ?? doc.creationTime)}`
                                        : 'Boş belge — açıp yazmaya başlayın'}
                                </span>
                            </button>

                            <button
                                type="button"
                                title="Sil"
                                aria-label={`${doc.title} belgesini sil`}
                                onClick={() => onDelete(doc.id, doc.title)}
                                className="flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer"
                            >
                                <i className="fa-regular fa-trash-can text-[12px]" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
