import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Popover from '@radix-ui/react-popover';
import { TASK_FEATURE_REGISTRY } from '../../TaskFeatureRegistry';

// Sık kullanılan (gerçek/çalışan) özellikler — Monday tarzı açılır listede DOĞRUDAN görünür.
// Kod/başlık/ikon registry'den çözülür → tıklanınca gerçek sekme açılır.
const COMMON_CODES = ['checklist', 'time-tracking', 'gantt', 'dependencies', 'finance', 'comments', 'activity', 'history'];
const REG = Object.fromEntries(TASK_FEATURE_REGISTRY.map((f) => [f.code, f]));

// "Daha fazla" tam popup içeriği — tüm katalog (daha az kullanılanlar dahil), aramalı.
const FEATURE_CATEGORIES = [
    {
        title: 'GÖREV & PLANLAMA',
        items: [
            { code: 'gantt', title: 'Gantt Çizelgesi', desc: 'İnteraktif zaman çizelgesi ve aşamalar', icon: 'fa-bars-staggered', color: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' },
            { code: 'dashboard', title: 'Gösterge Paneli', desc: 'Özel KPI ve performans widget panelleri', icon: 'fa-chart-pie', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'time-tracking', title: 'Zaman Takibi', desc: 'Canlı süre takibi, sayaç ve raporlama', icon: 'fa-stopwatch', color: 'bg-warning-subtle text-warning border-warning/20' },
            { code: 'checklist', title: 'Kontrol Listesi', desc: 'Alt görev ve onay kontrol listeleri', icon: 'fa-square-check', color: 'bg-success-subtle text-success border-success/20' },
            { code: 'risks', title: 'Risk Yönetimi', desc: 'Risk matrisi ve önleyici aksiyonlar', icon: 'fa-triangle-exclamation', color: 'bg-warning-subtle text-warning border-warning/20' },
            { code: 'approvals', title: 'Onay Süreçleri', desc: 'Çok adımlı yönetici onay akışları', icon: 'fa-stamp', color: 'bg-primary-subtle text-primary border-primary/20' },
            { code: 'dependencies', title: 'İlişkili Görevler', desc: 'Öncül ve ardıl görev bağlantıları', icon: 'fa-link', color: 'bg-surface-sunken text-text-secondary border-subtle' }
        ]
    },
    {
        title: 'İLETİŞİM',
        items: [
            { code: 'comments', title: 'Yorumlar', desc: 'Görev yorumları ve @bahsetmeler', icon: 'fa-comments', color: 'bg-primary-subtle text-primary border-primary/20' },
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

const TOTAL_FEATURES = FEATURE_CATEGORIES.reduce((n, c) => n + c.items.length, 0);

export function FeaturePickerV3({
    assignedCodes = [],
    onAddFeature = () => {}
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAll, setShowAll] = useState(false); // tam popup
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAssigned = (code) => assignedCodes.includes(code);

    const handleItemClick = (code) => {
        onAddFeature(code);
        setDropdownOpen(false);
        setShowAll(false);
    };

    const openAll = () => {
        setDropdownOpen(false);
        setSearchQuery('');
        setShowAll(true);
    };

    // Tam popup Escape ile kapansın
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showAll) setShowAll(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showAll]);

    const commonItems = COMMON_CODES.map((c) => REG[c]).filter(Boolean);

    const filteredCategories = FEATURE_CATEGORIES.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter((cat) => cat.items.length > 0);

    const modalContent = showAll && mounted ? createPortal(
        <div
            className="apya-feature-modal-root fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setShowAll(false)}
        >
            <div
                className="relative w-full max-w-3xl rounded-3xl border border-subtle bg-surface-base shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-subtle bg-surface-sunken/50">
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
                        onClick={() => setShowAll(false)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-base" />
                    </button>
                </div>

                <div className="px-6 pt-4 pb-2">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-xs" />
                        <input
                            type="text"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`${TOTAL_FEATURES} özellik arasında ara (Gantt, Finans, AI, Riskler...)`}
                            className="w-full h-10 pl-9 pr-4 text-[13px] rounded-xl border border-subtle bg-surface-base focus:border-primary focus:outline-none focus:shadow-focus transition-all text-text-primary placeholder:text-text-tertiary"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer"
                            >
                                <i className="fa-solid fa-circle-xmark text-xs" />
                            </button>
                        )}
                    </div>
                </div>

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

                <div className="flex items-center justify-between px-6 py-3.5 border-t border-subtle bg-surface-sunken/40 text-xs text-text-tertiary">
                    <span>Toplam {TOTAL_FEATURES} profesyonel modül ve sekme</span>
                    <button
                        type="button"
                        onClick={() => setShowAll(false)}
                        className="text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer"
                    >
                        Kapat (ESC)
                    </button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="relative inline-flex items-center">
            {/* Monday tarzı açılır liste — "+" tetikleyici */}
            <Popover.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary-subtle/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all focus:outline-none shadow-xs cursor-pointer active:scale-95"
                        aria-label="Özellik ekle"
                        title="Özellik Ekle (+)"
                    >
                        <i className="fa-solid fa-plus text-xs pointer-events-none" />
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        align="end"
                        sideOffset={6}
                        className="z-[99999999] w-72 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95"
                    >
                        <div className="px-2.5 py-1.5 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                            Görünüm / özellik ekle
                        </div>

                        <div className="flex flex-col gap-0.5 max-h-[320px] overflow-y-auto custom-scrollbar">
                            {commonItems.map((item) => {
                                const assigned = isAssigned(item.code);
                                return (
                                    <button
                                        key={item.code}
                                        type="button"
                                        disabled={assigned}
                                        onClick={() => handleItemClick(item.code)}
                                        className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                                            assigned
                                                ? 'opacity-60 cursor-default'
                                                : 'hover:bg-surface-hover cursor-pointer'
                                        }`}
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary">
                                            <i className={`fa-solid ${item.icon} text-xs`} />
                                        </span>
                                        <span className="flex-1 text-[13px] font-medium text-text-primary truncate">{item.title}</span>
                                        {assigned && <i className="fa-solid fa-check text-xs text-primary shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="my-1 h-px bg-subtle" />

                        <button
                            type="button"
                            onClick={openAll}
                            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-semibold text-primary hover:bg-primary-subtle transition-colors cursor-pointer"
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                                <i className="fa-solid fa-grip text-xs" />
                            </span>
                            <span className="flex-1 text-left">Daha fazla özellik keşfet…</span>
                            <i className="fa-solid fa-chevron-right text-[10px] opacity-60" />
                        </button>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            {modalContent}
        </div>
    );
}
