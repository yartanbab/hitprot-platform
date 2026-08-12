import React from 'react';

/**
 * Tam sayfa (odak) görünümündeki sol dikey özellik rayı — üst yatay sekme çubuğunun
 * yerine geçer. Sıra üst çubukla PAYLAŞILIR: ikisi de aynı `orderedTabs` dizisini
 * alır ve aynı sürükle-bırak kancalarını çağırır (tek `order` kaynağı).
 *
 * ≤860px'te gizlenir (yatay çubuk devreye girer) — bkz. TaskDetailRootV3.
 */
export function TaskFeatureRailV3({
    activeTab,
    onTabChange,
    orderedTabs = [],
    draggingCode,
    onDragStart,
    onDragEnd,
    onReorderTo,
    onReorderDrop,
    onOpenPicker,
    counts = {},
}) {
    return (
        <nav
            aria-label="Görev özellikleri"
            /* Eşik 860px tasarımdan birebir; `tablet` (768px) yeterince yakın değil. */
            className="flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar"
        >
            <span className="px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary">
                Özellikler
            </span>

            {orderedTabs.map((tab) => {
                const isActive = activeTab === tab.code;
                const count = counts[tab.code] || 0;

                return (
                    <button
                        key={tab.code}
                        type="button"
                        draggable
                        title="Sürükleyerek sırayı değiştirin"
                        onClick={() => onTabChange(tab.code)}
                        onDragStart={(e) => {
                            onDragStart(tab.code);
                            try {
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', tab.code);
                            } catch { /* dataTransfer kısıtlı olabilir */ }
                        }}
                        onDragOver={(e) => { e.preventDefault(); onReorderTo(tab.code); }}
                        onDrop={(e) => { e.preventDefault(); onReorderDrop?.(); }}
                        onDragEnd={onDragEnd}
                        className={[
                            'flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]',
                            'text-[12.5px] text-left cursor-grab active:cursor-grabbing',
                            'transition-opacity duration-fast',
                            isActive
                                ? 'bg-primary-subtle text-primary font-bold'
                                : 'text-text-secondary font-medium hover:bg-surface-hover',
                            draggingCode === tab.code ? 'opacity-35' : 'opacity-100',
                        ].join(' ')}
                    >
                        <i className={`fa-solid ${tab.icon} text-[12px] w-[15px] opacity-85`} />
                        <span className="flex-1 truncate">{tab.title}</span>
                        {count > 0 && (
                            <span className={[
                                'flex items-center justify-center h-[17px] min-w-[17px] px-[5px]',
                                'rounded-full text-[10px] font-extrabold',
                                isActive ? 'bg-primary text-white' : 'bg-neutral-subtle text-text-tertiary',
                            ].join(' ')}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}

            <button
                type="button"
                onClick={onOpenPicker}
                className="flex shrink-0 items-center gap-[11px] h-9 mt-1.5 px-[11px] rounded-[9px] border border-dashed border-primary bg-primary-subtle text-primary text-[12.5px] font-bold text-left cursor-pointer hover:border-solid"
            >
                <i className="fa-solid fa-plus text-[11px] w-[15px]" />
                <span>Özellik ekle</span>
            </button>
        </nav>
    );
}
