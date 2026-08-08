import React, { useState, useEffect, useRef } from 'react';

// Feature Grid Configuration based on the 17 items from V3 spec
const FEATURE_CATEGORIES = [
    {
        title: 'GÖREV & PLANLAMA',
        items: [
            { code: 'table', title: 'Tablo', desc: 'Veri tabloları oluşturun ve filtreleyin', icon: 'fa-table-cells', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'gantt', title: 'Gantt Çizelgesi', desc: 'İnteraktif zaman çizelgesi ve aşamalar', icon: 'fa-bars-staggered', color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' },
            { code: 'timeline', title: 'Zaman Çizelgesi', desc: 'Görsel kilometre taşları ve timeline', icon: 'fa-timeline', color: 'bg-negative-subtle text-negative border-negative/20' },
            { code: 'dashboard', title: 'Gösterge Paneli', desc: 'Özel KPI ve performans widget panelleri', icon: 'fa-chart-pie', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'time-tracking', title: 'Zaman Takibi', desc: 'Canlı süre takibi, sayaç ve raporlama', icon: 'fa-stopwatch', color: 'bg-warning-subtle text-warning border-warning/20' },
            { code: 'forms', title: 'Formlar', desc: 'Dinamik veri toplama formları', icon: 'fa-clipboard-list', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'checklist', title: 'Kontrol Listesi', desc: 'Alt görev ve onay kontrol listeleri', icon: 'fa-square-check', color: 'bg-success-subtle text-success border-success/20' },
            { code: 'risks', title: 'Risk Yönetimi', desc: 'Risk matrisi ve önleyici aksiyonlar', icon: 'fa-triangle-exclamation', color: 'bg-warning-subtle text-warning border-warning/20' },
            { code: 'approvals', title: 'Onay Süreçleri', desc: 'Çok adımlı yönetici onay akışları', icon: 'fa-stamp', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'dependencies', title: 'İlişkili Görevler', desc: 'Öncül ve ardıl görev bağlantıları', icon: 'fa-link', color: 'bg-surface-sunken text-text-secondary border-subtle' }
        ]
    },
    {
        title: 'İLETİŞİM',
        items: [
            { code: 'emails', title: 'E-postalar', desc: 'Görevle bağlantılı e-posta entegrasyonu', icon: 'fa-envelope', color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' }
        ]
    },
    {
        title: 'GEÇMİŞ & AKTİVİTE',
        items: [
            { code: 'activity', title: 'Aktiviteler', desc: 'Tüm sistem olayları ve zaman akışı', icon: 'fa-timeline', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'history', title: 'Geçmiş & Versiyon', desc: 'Kronolojik alan ve metin geçmişi', icon: 'fa-clock-rotate-left', color: 'bg-primary-subtle text-primary border-primary/20' }
        ]
    },
    {
        title: 'FİNANS & MEDYA',
        items: [
            { code: 'finance', title: 'Finans & Bütçe', desc: 'Maliyet merkezleri, bütçe ve harcamalar', icon: 'fa-coins', color: 'bg-success-subtle text-success border-success/20' },
            { code: 'gallery', title: 'Dosya Galerisi', desc: 'Görsel medya ve dosya önizleme', icon: 'fa-image', color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' }
        ]
    },
    {
        title: 'İLERİ ÖZELLİKLER & YAPAY ZEKA',
        items: [
            { code: 'custom-fields', title: 'Özel Alanlar', desc: 'Görevinize özel form alanları tanımlayın', icon: 'fa-square-plus', color: 'bg-success-subtle text-success border-success/20' },
            { code: 'automations', title: 'Otomasyonlar', desc: 'Durum ve eylem tetikleyici kurallar', icon: 'fa-wand-magic-sparkles', color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' },
            { code: 'ai', title: 'Apya Yapay Zeka', desc: 'Akıllı görev analizi, özet ve öneriler', icon: 'fa-sparkles', color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' }
        ]
    }
];

export function FeaturePickerV3({ 
    assignedCodes = [], 
    onAddFeature = () => {} 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    const isAssigned = (code) => assignedCodes.includes(code);

    const handleItemClick = (code) => {
        onAddFeature(code);
        setIsOpen(false);
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Filter categories based on search
    const filteredCategories = FEATURE_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Direct Trigger Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(prev => !prev);
                }}
                className={`
                    flex h-9 items-center gap-2 px-3 rounded-xl border text-[13px] font-bold transition-all shadow-xs select-none cursor-pointer active:scale-95
                    ${isOpen 
                        ? 'border-primary bg-primary text-white shadow-md' 
                        : 'border-dashed border-primary/50 bg-primary-subtle/40 text-primary hover:bg-primary hover:text-white hover:border-primary'
                    }
                `}
                aria-label="Özellik ekle"
                title="Özellik Ekle (+)"
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-plus'} text-xs`} />
                <span className="hidden sm:inline">Özellik Ekle</span>
            </button>

            {/* Modal / Backdrop Overlay for Guaranteed Interaction */}
            {isOpen && (
                <>
                    {/* Darkened blur backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[99990] animate-in fade-in duration-150"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />

                    {/* Centered Rich Feature Selection Dialog */}
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <div 
                            className="pointer-events-auto w-full max-w-3xl rounded-3xl border border-subtle bg-surface-base shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Dialog Header */}
                            <div className="flex items-center justify-between p-6 border-b border-subtle bg-surface-sunken/40">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                                        <i className="fa-solid fa-shapes text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary tracking-tight">ÖZELLİK EKLEME SİSTEMİ</h3>
                                        <p className="text-xs text-text-tertiary">Bir özelliğe tıklayarak görevinize yeni sekme ve fonksiyonlar ekleyin.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="h-9 w-9 rounded-xl flex items-center justify-center text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
                                >
                                    <i className="fa-solid fa-xmark text-base" />
                                </button>
                            </div>

                            {/* Search Filter Input */}
                            <div className="px-6 pt-4 pb-2">
                                <div className="relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-xs" />
                                    <input 
                                        type="text"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="17 özellik arasında ara (Gantt, Finans, AI, Formlar, Riskler...)"
                                        className="w-full h-10 pl-9 pr-4 text-[13px] rounded-xl border border-subtle bg-surface-base focus:border-primary focus:outline-none focus:shadow-focus transition-all text-text-primary placeholder:text-text-tertiary"
                                    />
                                    {searchQuery && (
                                        <button 
                                            type="button" 
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                                        >
                                            <i className="fa-solid fa-circle-xmark text-xs" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Feature Grid Categories */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {filteredCategories.map((category) => (
                                    <div key={category.title} className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-text-tertiary tracking-widest uppercase">{category.title}</span>
                                            <div className="flex-1 h-px bg-subtle/60" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            {category.items.map((item) => {
                                                const assigned = isAssigned(item.code);
                                                return (
                                                    <div
                                                        key={item.code}
                                                        onClick={() => handleItemClick(item.code)}
                                                        className={`
                                                            group flex items-start gap-4 rounded-2xl border p-4 transition-all cursor-pointer select-none
                                                            ${assigned 
                                                                ? 'border-primary/50 bg-primary-subtle/30 shadow-xs ring-1 ring-primary/30' 
                                                                : 'border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-md hover:-translate-y-0.5'
                                                            }
                                                        `}
                                                    >
                                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${item.color} shadow-xs text-lg group-hover:scale-105 transition-transform`}>
                                                            <i className={`fa-solid ${item.icon}`} />
                                                        </div>

                                                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                                                                    {item.title}
                                                                </span>
                                                                {assigned ? (
                                                                    <span className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded-full border border-primary/20">
                                                                        <i className="fa-solid fa-check text-[10px]" />
                                                                        Aktif
                                                                    </span>
                                                                ) : (
                                                                    <span className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-primary transition-opacity flex items-center gap-1">
                                                                        <span>Ekle</span>
                                                                        <i className="fa-solid fa-arrow-right text-[10px]" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[12px] text-text-tertiary leading-normal line-clamp-2">
                                                                {item.desc}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {filteredCategories.length === 0 && (
                                    <div className="py-12 text-center flex flex-col items-center gap-2">
                                        <i className="fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" />
                                        <p className="text-sm font-semibold text-text-primary">Eşleşen özellik bulunamadı</p>
                                        <p className="text-xs text-text-tertiary">Lütfen farklı bir arama terimi deneyin.</p>
                                    </div>
                                )}
                            </div>

                            {/* Dialog Footer */}
                            <div className="flex items-center justify-between px-6 py-3.5 border-t border-subtle bg-surface-sunken/40 text-xs text-text-tertiary">
                                <span>Toplam 17 profesyonel modül ve sekme</span>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer"
                                >
                                    Kapat (ESC)
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
