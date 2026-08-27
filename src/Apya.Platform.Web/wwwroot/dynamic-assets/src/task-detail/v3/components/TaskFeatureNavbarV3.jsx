import React, { useState } from 'react';

/**
 * Yatay sekme çubuğu (modal görünümü).
 *
 * İki kullanıcı talebi burada karşılanır:
 *  1) "+" düğmesi SON SEKMENİN HEMEN SAĞINDA, çubuğun en sağında değil — yani yatay
 *     kaydırma alanının İÇİNDE. Hover'da genişleyip "Özellik ekle" yazısını açar.
 *  2) Sekmeler sürükle-bırak ile yeniden sıralanır; dragover'da CANLI yer değiştirir
 *     (ayrı bir drop göstergesi yok).
 */
export function TaskFeatureNavbarV3({
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
    isDirty = false,
}) {
    const [plusHover, setPlusHover] = useState(false);

    return (
        <div className="flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base">
            <div className="flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar">
                {orderedTabs.map((tab) => {
                    const isActive = activeTab === tab.code;
                    const count = counts[tab.code] || 0;

                    return (
                        <button
                            key={tab.code}
                            type="button"
                            draggable
                            title="Sürükleyerek sırayı değiştirin"
                            /* Seçim POINTERDOWN'da, `click`te DEĞİL: düğme `draggable` olduğu
                               için fare basılıyken 4px'lik kayma bile yerel sürüklemeyi başlatır
                               ve `click` HİÇ üretilmez — sekme tek tıklamayla değişmiyor, birkaç
                               kez basmak gerekiyordu. `draggable`ı kayma eşiğinden sonra açmak
                               çare değil: tarayıcı sürükleme kararını mousedown anında verir.
                               DOKUNMA dışarıda — parmak değdiği an pointerdown gelir, çubuk yatay
                               kaydırılabilir olduğu için kaydırma jesti sekme değişimine dönerdi;
                               orada yerel sürükleme yok, `click` (ve klavye) güvenilir. Farede
                               ikisi de çalışır, ikinci çağrı aynı kodla geldiği için etkisiz.
                               Aynı düzeltme TaskFeatureRailV3'te de var. */
                            onPointerDown={(e) => {
                                if (e.pointerType !== 'touch' && e.button === 0) onTabChange(tab.code);
                            }}
                            onClick={() => onTabChange(tab.code)}
                            onDragStart={(e) => {
                                onDragStart(tab.code);
                                try {
                                    e.dataTransfer.effectAllowed = 'move';
                                    e.dataTransfer.setData('text/plain', tab.code);
                                } catch { /* bazı tarayıcılarda dataTransfer kısıtlı */ }
                            }}
                            onDragOver={(e) => { e.preventDefault(); onReorderTo(tab.code); }}
                            onDrop={(e) => { e.preventDefault(); onReorderDrop?.(); }}
                            onDragEnd={onDragEnd}
                            className={[
                                'flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]',
                                'text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing',
                                'transition-opacity duration-fast',
                                isActive
                                    ? 'bg-primary-subtle text-primary font-bold'
                                    : 'text-text-secondary font-medium hover:bg-surface-hover',
                                draggingCode === tab.code ? 'opacity-35' : 'opacity-100',
                            ].join(' ')}
                        >
                            <i className={`fa-solid ${tab.icon} text-[11px] opacity-85`} />
                            <span>{tab.title}</span>
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

                {/* "+" — son sekmenin hemen sağında, kaydırma alanının içinde.
                    Genişleme padding üzerinden yapılır (width değil): metin belirirken
                    düğme sağa doğru açılır, sekmeler yerinde kalır. */}
                <button
                    type="button"
                    title="Özellik ekle"
                    onClick={() => { setPlusHover(false); onOpenPicker(); }}
                    onMouseEnter={() => setPlusHover(true)}
                    onMouseLeave={() => setPlusHover(false)}
                    className={[
                        'flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]',
                        'border border-dashed border-primary bg-primary-subtle text-primary',
                        'text-[12.5px] font-bold whitespace-nowrap cursor-pointer',
                        'hover:border-solid',
                        'transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]',
                        plusHover ? 'px-[13px]' : 'px-[11px]',
                    ].join(' ')}
                >
                    <i className="fa-solid fa-plus text-[11px]" />
                    {plusHover && <span className="animate-fade-in-fast">Özellik ekle</span>}
                </button>
            </div>

            {isDirty && (
                <span className="flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold">
                    <span className="h-[7px] w-[7px] rounded-full bg-warning animate-pulse" />
                    Taslak
                </span>
            )}
        </div>
    );
}
