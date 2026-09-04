import React, { useState } from 'react';
import { useTaskChecklist } from '../../hooks/useTaskChecklist';

/**
 * Kontrol Listesi sekmesi (V3). Gerçek backend'e yazar:
 * `getChecklistItems / addChecklistItem / toggleChecklistItem / deleteChecklistItem`
 * (TaskChecklistItem entity'si). Yeni şema YOK.
 *
 * Genel sekmesindeki kontrol listesi bloğuyla AYNI veriyi gösterir — orası
 * daraltılabilir bir özet, burası tam genişlikte çalışma yüzeyi. İkisi de aynı
 * `useTaskChecklist` hook'unu kullandığı için sorgu anahtarı ortak; birinde
 * yapılan değişiklik diğerine anında yansır.
 */
export function ChecklistTabV3({ taskId }) {
    const { items, isLoading, addItem, toggleItem, removeItem } = useTaskChecklist(taskId);
    const [draft, setDraft] = useState('');

    const doneCount = items.filter((c) => c.isDone).length;
    const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0;

    const onAdd = async () => {
        const text = draft.trim();
        if (!text || !taskId) return;
        setDraft('');
        try {
            await addItem(text);
        } catch (err) {
            setDraft(text); // yazdığı metni kaybetmesin
            window?.abp?.notify?.error?.(err?.message || 'Madde eklenemedi.');
        }
    };

    return (
        <div className="flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <h2 className="m-0 text-[13.5px] font-bold text-text-primary">Kontrol listesi</h2>
                    <span className="flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold">
                        {doneCount}/{items.length}
                    </span>
                </div>
                <span className="font-mono text-[11px] font-bold text-text-tertiary">%{percent}</span>
            </div>

            <div className="h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden">
                <div
                    className="h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="flex flex-col gap-1">
                {isLoading && items.length === 0 && (
                    <p className="m-0 py-2 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
                )}

                {!isLoading && items.length === 0 && (
                    <p className="m-0 py-2 text-[12.5px] text-text-tertiary">
                        Henüz madde yok. Aşağıdan ilk maddeyi ekleyin.
                    </p>
                )}

                {items.map((item) => (
                    <div key={item.id} className="group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised">
                        <button
                            type="button"
                            aria-label={item.isDone ? 'Tamamlandı işaretini kaldır' : 'Tamamlandı işaretle'}
                            onClick={() => toggleItem(item.id).catch((err) =>
                                window?.abp?.notify?.error?.(err?.message || 'Durum güncellenemedi.'))}
                            className={`flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${
                                item.isDone ? 'bg-success border-success' : 'bg-transparent border-strong'
                            }`}
                        >
                            {item.isDone && <i className="fa-solid fa-check text-[9px]" />}
                        </button>

                        <span className={`flex-1 min-w-0 text-[13px] ${
                            item.isDone ? 'line-through text-text-tertiary font-medium' : 'text-text-primary font-semibold'
                        }`}>
                            {item.text}
                        </span>

                        <button
                            type="button"
                            title="Sil"
                            aria-label={`${item.text} maddesini sil`}
                            onClick={() => removeItem(item.id).catch((err) =>
                                window?.abp?.notify?.error?.(err?.message || 'Madde silinemedi.'))}
                            className="flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer"
                        >
                            <i className="fa-regular fa-trash-can text-[11px]" />
                        </button>
                    </div>
                ))}

                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onAdd(); }}
                    placeholder="Yeni madde yaz ve Enter'a bas…"
                    aria-label="Yeni kontrol listesi maddesi"
                    className="h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                />
            </div>
        </div>
    );
}
