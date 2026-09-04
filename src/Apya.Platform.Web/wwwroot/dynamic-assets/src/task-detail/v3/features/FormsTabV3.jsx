import React, { useState } from 'react';
import { useTaskForms, useTaskFormOptions, useTaskFormResponses } from '../../hooks/useTaskForms';
import { isGranted } from '../../hooks/useTaskDetail';
import { TabEmptyState, RatioBadge, fmtDateTime } from '../tabPrimitives';

/**
 * Form sekmesi (V3) — göreve bağlanmış formlar ve bu görevde toplanan yanıtlar.
 *
 * Form KOPYALANMAZ: Form Yönetimi'nde tanımlı bir forma BAĞ kurulur, aynı form
 * birden çok göreve bağlanabilir. Sayaç yalnız BU GÖREV bağlamında toplanan
 * yanıtları sayar, formun toplam yanıtını değil.
 *
 * "Dışarıya açık" anahtarı görevin süreli paylaşım linkiyle ilgilidir ve
 * `Platform.Tasks.ShareExternally` ister — bağlamak dışarı açmak DEĞİLDİR.
 */
function ResponseList({ taskId, documentId }) {
    const { data: responses, isLoading } = useTaskFormResponses(taskId, documentId);

    if (isLoading) {
        return <p className="m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary">Yanıtlar yükleniyor…</p>;
    }
    if (!responses?.length) {
        return <p className="m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary">Bu görevde henüz yanıt yok.</p>;
    }

    return (
        <ul className="m-0 list-none p-0">
            {responses.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle">
                    <span className="flex items-center gap-2 min-w-0">
                        <i className={`fa-solid ${r.isGuestSubmission ? 'fa-user-clock' : 'fa-user'} text-[10px] text-text-tertiary`} />
                        <span className="truncate text-[12.5px] text-text-primary">{r.respondentName}</span>
                        {r.isGuestSubmission && (
                            <span className="shrink-0 text-[10.5px] text-text-tertiary">· dış</span>
                        )}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-text-tertiary">
                        {fmtDateTime(r.creationTime)}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export function FormsTabV3({ taskId }) {
    const { forms, isLoading, linkForm, unlinkForm, setGuestFillable, isLinking } = useTaskForms(taskId);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [openId, setOpenId] = useState(null);
    const { data: options, isLoading: optionsLoading } = useTaskFormOptions(taskId, pickerOpen);

    const canShare = isGranted('Platform.Tasks.ShareExternally');

    const onLink = async (documentId) => {
        try {
            await linkForm(documentId);
            setPickerOpen(false);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Form bağlanamadı.');
        }
    };

    const onUnlink = async (link) => {
        if (!window.confirm(`“${link.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`)) return;
        try {
            await unlinkForm(link.id);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Bağlantı kaldırılamadı.');
        }
    };

    const onToggleGuest = async (link, value) => {
        try {
            await setGuestFillable({ linkId: link.id, value });
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Ayar değiştirilemedi.');
        }
    };

    return (
        <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-[14px] font-bold text-text-primary">Formlar</h2>
                <button
                    type="button"
                    onClick={() => setPickerOpen((v) => !v)}
                    className="flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover"
                >
                    <i className={`fa-solid ${pickerOpen ? 'fa-xmark' : 'fa-plus'} text-[11px]`} />
                    {pickerOpen ? 'Kapat' : 'Form bağla'}
                </button>
            </div>

            {pickerOpen && (
                <div className="flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden">
                    {optionsLoading && (
                        <p className="m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary">Formlar yükleniyor…</p>
                    )}
                    {!optionsLoading && !options?.length && (
                        <p className="m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary">
                            Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun.
                        </p>
                    )}
                    {options?.map((o) => (
                        <button
                            key={o.documentId}
                            type="button"
                            disabled={o.isLinked || isLinking}
                            onClick={() => onLink(o.documentId)}
                            className={`flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-subtle last:border-b-0 text-left ${
                                o.isLinked ? 'cursor-not-allowed opacity-55' : 'cursor-pointer hover:bg-surface-hover'
                            }`}
                        >
                            <span className="truncate text-[12.5px] font-semibold text-text-primary">{o.title}</span>
                            <span className="shrink-0 text-[11px] text-text-tertiary">
                                {o.isLinked ? 'zaten bağlı' : o.isPublished ? 'yayında' : 'taslak'}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {isLoading && forms.length === 0 && (
                <p className="m-0 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
            )}

            {!isLoading && forms.length === 0 && !pickerOpen && (
                <TabEmptyState
                    icon="fa-clipboard-list"
                    title="Göreve bağlı form yok"
                    description="Saha formu, kabul kontrol listesi ya da anket bağlayıp yanıtları bu görevin altında toplayabilirsiniz."
                />
            )}

            {forms.map((link) => (
                <div key={link.id} className="flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden">
                    <div className="flex items-center gap-3 px-3.5 py-3">
                        <span className="flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary">
                            <i className="fa-solid fa-clipboard-list text-[14px]" />
                        </span>

                        <button
                            type="button"
                            onClick={() => setOpenId((v) => (v === link.documentId ? null : link.documentId))}
                            className="flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <span className="truncate text-[13px] font-bold text-text-primary">{link.title}</span>
                                {!link.isPublished && (
                                    <span className="shrink-0 text-[10.5px] font-bold text-warning">taslak</span>
                                )}
                            </span>
                            <span className="block text-[11.5px] text-text-tertiary">
                                {link.responseCount > 0
                                    ? `${link.responseCount} yanıt · bu görevde`
                                    : 'Bu görevde henüz yanıt yok'}
                            </span>
                        </button>

                        {link.responseCount > 0 && <RatioBadge>{link.responseCount}</RatioBadge>}

                        {link.isPublished && link.slug && (
                            <a
                                href={`/f/${link.slug}?taskId=${link.taskId}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Formu doldur"
                                aria-label={`${link.title} formunu doldur`}
                                className="flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-primary-subtle hover:text-primary"
                            >
                                <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" />
                            </a>
                        )}

                        <button
                            type="button"
                            title="Bağlantıyı kaldır"
                            aria-label={`${link.title} bağlantısını kaldır`}
                            onClick={() => onUnlink(link)}
                            className="flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                        >
                            <i className="fa-regular fa-trash-can text-[12px]" />
                        </button>
                    </div>

                    {/* Dışarı açma yalnız paylaşım yetkisi olana görünür; sunucu da
                        aynı yetkiyi ayrıca doğrular. */}
                    {canShare && link.isPublished && (
                        <label className="flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer">
                            <input
                                type="checkbox"
                                checked={Boolean(link.isGuestFillable)}
                                onChange={(e) => onToggleGuest(link, e.target.checked)}
                            />
                            Süreli paylaşım linkiyle ekip dışından da doldurulabilsin
                        </label>
                    )}

                    {openId === link.documentId && (
                        <ResponseList taskId={taskId} documentId={link.documentId} />
                    )}
                </div>
            ))}
        </div>
    );
}
