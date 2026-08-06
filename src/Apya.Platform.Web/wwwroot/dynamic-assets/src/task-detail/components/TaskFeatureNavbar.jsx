import React, { useRef } from 'react';

const tabButtonBase = 'group relative flex shrink-0 items-center gap-2 whitespace-nowrap '
    + 'border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary '
    + 'hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus';

const tabButtonActive = 'border-brand-500 text-text-primary';

/**
 * Borderless sekme çubuğu — WAI-ARIA APG "Tabs (Automatic Activation)" deseni:
 * ok tuşları hem odağı hem seçili sekmeyi taşır (roving tabindex, yalnız aktif
 * sekmenin tabIndex'i 0). "+" butonu tablist'in DIŞINDA — bir sekme değil,
 * picker açan ayrı bir buton (TaskDetailHeader'daki "⋯" butonuyla aynı rol).
 */
export function TaskFeatureNavbar({ tabs, activeCode, onSelect, onOpenPicker, pickerOpen }) {
    const refs = useRef(new Map());

    const focusAndSelect = (tab) => {
        onSelect(tab.code);
        refs.current.get(tab.code)?.focus();
    };

    const onKeyDown = (e, index) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusAndSelect(tabs[(index + 1) % tabs.length]);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusAndSelect(tabs[(index - 1 + tabs.length) % tabs.length]);
        } else if (e.key === 'Home') {
            e.preventDefault();
            focusAndSelect(tabs[0]);
        } else if (e.key === 'End') {
            e.preventDefault();
            focusAndSelect(tabs[tabs.length - 1]);
        }
    };

    return (
        <div className="flex items-center border-b border-subtle">
            <div role="tablist" aria-label="Görev özellikleri" className="flex min-w-0 flex-1 overflow-x-auto">
                {tabs.map((tab, index) => {
                    const active = tab.code === activeCode;
                    return (
                        <button
                            key={tab.code}
                            ref={(el) => {
                                if (el) refs.current.set(tab.code, el);
                                else refs.current.delete(tab.code);
                            }}
                            type="button"
                            role="tab"
                            id={`task-tab-${tab.code}`}
                            aria-selected={active}
                            aria-controls="task-feature-tabpanel"
                            tabIndex={active ? 0 : -1}
                            onClick={() => onSelect(tab.code)}
                            onKeyDown={(e) => onKeyDown(e, index)}
                            className={`${tabButtonBase} ${active ? tabButtonActive : ''}`}
                        >
                            <i className={`fa ${tab.icon}`} aria-hidden="true" />
                            {tab.title}
                        </button>
                    );
                })}
            </div>
            <button
                type="button"
                aria-label="Özellik ekle"
                aria-haspopup="dialog"
                aria-expanded={pickerOpen}
                onClick={onOpenPicker}
                className="mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
            >
                <i className="fa fa-plus" aria-hidden="true" />
            </button>
        </div>
    );
}
