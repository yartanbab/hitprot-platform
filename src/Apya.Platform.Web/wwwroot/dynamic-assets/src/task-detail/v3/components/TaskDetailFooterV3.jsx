import React from 'react';

export function TaskDetailFooterV3({
    lastSavedAt,
    isDirty,
    isSaving,
    justSaved,
    onCancel,
    onSave,
    sticky = false,
}) {
    const formatted = lastSavedAt
        ? new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        }).format(new Date(lastSavedAt))
        : '—';

    const saveIcon = isSaving ? 'fa-solid fa-circle-notch fa-spin'
        : justSaved ? 'fa-solid fa-check'
        : 'fa-regular fa-floppy-disk';
    const saveLabel = isSaving ? 'Kaydediliyor…' : justSaved ? 'Kaydedildi' : 'Kaydet';
    const canSave = isDirty && !isSaving;

    /* shrink-0 ŞART: kolon flex'inde varsayılan flex-shrink:1'dir ve içerik taştığında
       tarayıcı footer'ı da kısaltıp Kaydet/Vazgeç düğmelerini yarım bırakabiliyordu.
       Kısalması gereken tek öğe ortadaki kaydırma alanı.
       sticky: SAYFA kipinde kap sabit yükseklikli değil (min-h), çubuk içeriğin sonuna
       itiliyordu — 800px ekranda 1405. pikselde (QA-15). Üstte değiştirilen durum/öncelik
       "Kaydet"i beklerken çubuk görünmüyordu; yapışkan olunca hep ekranın altında. */
    return (
        <footer className={`${sticky ? 'sticky bottom-0 z-10 ' : ''}shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base`}>
            <div className="flex items-center gap-3.5 min-w-0 lt-560:hidden">
                <span className="flex items-center gap-[7px] text-[11.5px] text-text-tertiary">
                    <i className="fa-regular fa-clock text-[11px]" />
                    Son kayıt: <strong className="font-semibold text-text-secondary">{formatted}</strong>
                </span>
                {isDirty && (
                    <span className="flex items-center gap-[7px] text-[11.5px] font-semibold text-warning">
                        <span className="h-[7px] w-[7px] rounded-full bg-warning animate-pulse" />
                        Kaydedilmemiş değişiklikler var
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    /* Kayıt sürerken kapatma isteği kökte yok sayılır; düğme bunu göstersin. */
                    disabled={isSaving}
                    className="h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Vazgeç
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={!canSave}
                    className={`flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${
                        canSave ? 'bg-primary hover:bg-primary-hover cursor-pointer' : 'bg-border-strong cursor-not-allowed'
                    }`}
                >
                    <i className={`${saveIcon} text-[11px]`} />
                    {saveLabel}
                </button>
            </div>
        </footer>
    );
}
