import React, { useEffect, useState } from 'react';
import { catalogGroups, TOTAL_FEATURE_COUNT } from '../featureCatalogV3';
import { OverlayLayerV3 } from './OverlayLayerV3';

/**
 * Özellik ekleme modalı. Tetikleyicisi burada DEĞİL: "+" düğmesi sekme çubuğunun
 * (ve sol rayın) içinde yaşıyor, bu bileşen yalnız açık/kapalı olarak sürülür.
 *
 * Davranış: ekli bir karta tıklamak o sekmeye GİDER, ekli olmayan kartı eklemek
 * hem ekler hem sekmeye geçer.
 */
export function FeaturePickerV3({
    open,
    onClose,
    assignedCodes = [],
    onAddFeature,
    onGoToTab,
}) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!open) setQuery('');
    }, [open]);

    if (!open) return null;

    const assigned = new Set(assignedCodes);
    const groups = catalogGroups(query);
    const assignedCount = assignedCodes.length + 3; // + çekirdek sekmeler

    const handleClick = (code) => {
        if (assigned.has(code)) {
            onGoToTab?.(code);
            onClose?.();
            return;
        }
        onAddFeature?.(code);
        onClose?.();
    };

    return (
        <OverlayLayerV3 open={open} onClose={onClose} label="Özellik ekle">
        <div
            data-apya-overlay
            className="absolute inset-0 flex items-center justify-center p-6 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Özellik ekle"
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-full max-w-[840px] max-h-[86vh] rounded-[22px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in"
            >
                <div className="flex items-center justify-between gap-4 px-[22px] py-5 border-b border-subtle bg-surface-raised">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary text-white shadow-md">
                            <i className="fa-solid fa-shapes text-base" />
                        </span>
                        <div className="min-w-0">
                            <h3 className="m-0 text-base font-extrabold tracking-[-.02em] text-text-primary">Özellik ekle</h3>
                            <p className="mt-0.5 mb-0 text-[12px] text-text-tertiary">
                                Bir özelliğe tıklayarak görevinize yeni sekme ve fonksiyon ekleyin.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Kapat"
                        className="flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-[15px]" />
                    </button>
                </div>

                <div className="px-[22px] pt-4 pb-2">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-[13px] top-1/2 -translate-y-1/2 text-[12px] text-text-tertiary" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`${TOTAL_FEATURE_COUNT} özellik arasında ara (Gantt, Finans, Risk, AI…)`}
                            className="w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar">
                    {groups.map((group) => (
                        <div key={group.title} className="flex flex-col gap-[11px]">
                            <div className="flex items-center gap-2.5">
                                <span className="text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary">
                                    {group.title}
                                </span>
                                <span className="flex-1 h-px bg-subtle" />
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]">
                                {group.items.map((f) => {
                                    const isAdded = assigned.has(f.code);
                                    return (
                                        <button
                                            key={f.code}
                                            type="button"
                                            onClick={() => handleClick(f.code)}
                                            className={`group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${
                                                isAdded ? 'border-primary bg-primary-subtle' : 'border-subtle bg-surface-base'
                                            }`}
                                        >
                                            <span className={`flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${f.bg} ${f.fg}`}>
                                                <i className={`fa-solid ${f.icon} text-[15px]`} />
                                            </span>
                                            <span className="flex flex-col gap-[3px] min-w-0 flex-1">
                                                <span className="flex items-center justify-between gap-2">
                                                    <span className="text-[13px] font-bold text-text-primary truncate">{f.title}</span>
                                                    <span className={`shrink-0 text-[10.5px] font-extrabold ${isAdded ? 'text-primary' : 'text-text-tertiary'}`}>
                                                        {isAdded ? '✓ Ekli' : 'Ekle →'}
                                                    </span>
                                                </span>
                                                <span className="text-[11.5px] leading-[1.5] text-text-tertiary">{f.desc}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {groups.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-12 text-center">
                            <i className="fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" />
                            <p className="m-0 text-sm font-semibold text-text-primary">Eşleşen özellik bulunamadı</p>
                            <p className="m-0 text-xs text-text-tertiary">Lütfen farklı bir arama terimi deneyin.</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary">
                    <span>Toplam {TOTAL_FEATURE_COUNT} modül · {assignedCount} tanesi bu göreve ekli</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="border-0 bg-transparent text-text-secondary text-[11.5px] font-bold cursor-pointer hover:text-primary"
                    >
                        Kapat (ESC)
                    </button>
                </div>
            </div>
        </div>
        </OverlayLayerV3>
    );
}
