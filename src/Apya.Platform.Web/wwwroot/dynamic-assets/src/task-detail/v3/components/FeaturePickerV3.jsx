import React, { useEffect, useState } from 'react';
import { catalogItems, TOTAL_FEATURE_COUNT } from '../featureCatalogV3';
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
    const items = catalogItems(query);
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
            className="absolute inset-0 flex items-center justify-center p-6 mobile:p-3 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast"
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
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-subtle bg-surface-raised">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex shrink-0 items-center justify-center h-8 w-8 rounded-[10px] bg-primary text-white shadow-md">
                            <i className="fa-solid fa-shapes text-[13px]" />
                        </span>
                        <div className="min-w-0">
                            <h3 className="m-0 text-[14px] leading-tight font-extrabold tracking-[-.02em] text-text-primary">Özellik ekle</h3>
                            <p className="mt-0.5 mb-0 text-[11px] leading-tight text-text-tertiary truncate">
                                Bir özelliğe tıklayarak görevinize yeni sekme ve fonksiyon ekleyin.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Kapat"
                        className="flex shrink-0 items-center justify-center h-8 w-8 rounded-[9px] text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-[15px]" />
                    </button>
                </div>

                <div className="px-4 pt-2.5">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-[13px] top-1/2 -translate-y-1/2 text-[12px] text-text-tertiary" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`${TOTAL_FEATURE_COUNT} özellik arasında ara (Gantt, Finans, Risk, AI…)`}
                            className="w-full h-[36px] pl-9 pr-3.5 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 px-4 pt-2.5 pb-4 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-3 mobile:grid-cols-2 gap-2">
                        {items.map((f) => {
                            const isAdded = assigned.has(f.code);
                            return (
                                <button
                                    key={f.code}
                                    type="button"
                                    onClick={() => handleClick(f.code)}
                                    className={`group flex items-center gap-2.5 p-2.5 rounded-xl border text-left cursor-pointer hover:border-focus hover:shadow-md ${
                                        isAdded ? 'border-primary bg-primary-subtle' : 'border-subtle bg-surface-base'
                                    }`}
                                >
                                    <span className={`flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] ${f.bg} ${f.fg}`}>
                                        <i className={`fa-solid ${f.icon} text-[14px]`} />
                                    </span>
                                    <span className="flex flex-col min-w-0 flex-1">
                                        <span className="flex items-center justify-between gap-1.5">
                                            <span className="text-[12.5px] font-bold text-text-primary truncate">{f.title}</span>
                                            {/* Rozet dar ekranda tamamen düşer: başlık kırpılmasın diye.
                                                Ekli durumu orada da okunur, kartın kenarlığı/zemini söylüyor. */}
                                            <span className={`mobile:hidden shrink-0 text-[10px] font-extrabold ${isAdded ? 'text-primary' : 'text-text-tertiary'}`}>
                                                {isAdded ? '✓ Ekli' : 'Ekle →'}
                                            </span>
                                        </span>
                                        <span className="mobile:hidden text-[11px] leading-[1.35] text-text-tertiary line-clamp-2">{f.desc}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {items.length === 0 && (
                        <div className="flex flex-col items-center gap-1.5 py-10 text-center">
                            <i className="fa-solid fa-magnifying-glass text-2xl text-text-tertiary mb-1" />
                            <p className="m-0 text-sm font-semibold text-text-primary">Eşleşen özellik bulunamadı</p>
                            <p className="m-0 text-xs text-text-tertiary">Lütfen farklı bir arama terimi deneyin.</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-subtle bg-surface-raised text-[11px] text-text-tertiary">
                    <span className="truncate">Toplam {TOTAL_FEATURE_COUNT} modül · {assignedCount} tanesi bu göreve ekli</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 border-0 bg-transparent text-text-secondary text-[11px] font-bold cursor-pointer hover:text-primary"
                    >
                        Kapat (ESC)
                    </button>
                </div>
            </div>
        </div>
        </OverlayLayerV3>
    );
}
