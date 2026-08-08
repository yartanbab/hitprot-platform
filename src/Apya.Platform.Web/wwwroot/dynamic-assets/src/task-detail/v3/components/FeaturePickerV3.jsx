import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

// Feature Grid Configuration based on the 17 items from V3 spec
const FEATURE_CATEGORIES = [
    {
        title: 'GÖREV',
        items: [
            { code: 'table', title: 'Tablo', desc: 'Veri tabloları oluşturun', icon: 'fa-table-cells', color: 'bg-primary-subtle text-primary' },
            { code: 'gantt', title: 'Gantt', desc: 'Zaman çizelgesi görünümü', icon: 'fa-bars-staggered', color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600' },
            { code: 'timeline', title: 'Zaman Çizelgesi', desc: 'Timeline görünümü', icon: 'fa-timeline', color: 'bg-negative-subtle text-negative' },
            { code: 'dashboard', title: 'Gösterge Paneli', desc: 'KPI ve widget panelleri', icon: 'fa-chart-pie', color: 'bg-primary-subtle text-primary' },
            { code: 'time-tracking', title: 'Zaman Takibi', desc: 'Süre takibi ve raporlama', icon: 'fa-stopwatch', color: 'bg-warning-subtle text-warning' },
            { code: 'forms', title: 'Formlar', desc: 'Özel formlar oluşturun', icon: 'fa-clipboard-list', color: 'bg-primary-subtle text-primary' },
            { code: 'checklist', title: 'Kontrol Listesi', desc: 'Görev kontrol listeleri', icon: 'fa-square-check', color: 'bg-success-subtle text-success' },
            { code: 'risks', title: 'Riskler', desc: 'Risk yönetimi', icon: 'fa-triangle-exclamation', color: 'bg-warning-subtle text-warning' },
            { code: 'approvals', title: 'Onaylar', desc: 'Onay süreçleri', icon: 'fa-stamp', color: 'bg-primary-subtle text-primary' },
            { code: 'dependencies', title: 'İlişkili Görevler', desc: 'Bağlantılı görevler', icon: 'fa-link', color: 'bg-surface-sunken text-text-secondary border border-subtle' }
        ]
    },
    {
        title: 'İLETİŞİM',
        items: [
            { code: 'emails', title: 'E-postalar', desc: 'E-posta entegrasyonu', icon: 'fa-envelope', color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600' }
        ]
    },
    {
        title: 'GEÇMİŞ',
        items: [
            { code: 'history', title: 'Aktiviteler', desc: 'Aktivite akışı', icon: 'fa-file-lines', color: 'bg-primary-subtle text-primary' }
        ]
    },
    {
        title: 'FİNANS',
        items: [
            { code: 'finance', title: 'Finans', desc: 'Bütçe ve maliyetler', icon: 'fa-coins', color: 'bg-success-subtle text-success' },
            { code: 'files', title: 'Dosya Galerisi', desc: 'Görsel dosya yönetimi', icon: 'fa-image', color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600' }
        ]
    },
    {
        title: 'İLERİ ÖZELLİKLER',
        items: [
            { code: 'custom-fields', title: 'Özel Alanlar', desc: 'Özel alanlar ekleyin', icon: 'fa-square-plus', color: 'bg-success-subtle text-success' },
            { code: 'automations', title: 'Otomasyonlar', desc: 'Otomatik işlemler', icon: 'fa-wand-magic-sparkles', color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600' },
            { code: 'ai', title: 'Yapay Zeka', desc: 'AI analiz ve öneriler', icon: 'fa-sparkles', color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600' }
        ]
    }
];

export function FeaturePickerV3({ 
    assignedCodes = [], 
    onAddFeature = () => {} 
}) {
    const [open, setOpen] = useState(false);
    const isAssigned = (code) => assignedCodes.includes(code);

    const handleItemClick = (code) => {
        onAddFeature(code);
        setOpen(false);
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-subtle text-text-tertiary hover:border-primary hover:text-primary hover:bg-primary-subtle/30 transition-all focus-visible:outline-none focus-visible:shadow-focus"
                    aria-label="Özellik ekle"
                    title="Özellik Ekle (+)"
                >
                    <i className="fa-solid fa-plus text-[13px]" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={8}
                    align="end"
                    className="z-50 w-[760px] rounded-2xl border border-subtle bg-surface-base p-6 shadow-float will-change-[transform,opacity] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                >
                    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-subtle">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-shapes text-primary text-base" />
                                <h3 className="text-[15px] font-bold text-text-primary tracking-wide">ÖZELLİK EKLEME SİSTEMİ</h3>
                            </div>
                            <p className="text-[12px] text-text-tertiary">+ ikonuna tıklayınca açılan menü ile göreve yeni özellikler/sekme eklenir.</p>
                        </div>

                        {FEATURE_CATEGORIES.map((category) => (
                            <div key={category.title} className="flex flex-col gap-2.5">
                                <h4 className="text-[11px] font-bold text-text-tertiary tracking-widest uppercase pl-1">{category.title}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {category.items.map((item) => {
                                        const assigned = isAssigned(item.code);
                                        return (
                                            <div
                                                key={item.code}
                                                onClick={() => handleItemClick(item.code)}
                                                className={`
                                                    group flex items-start gap-3.5 rounded-xl border p-3 transition-all cursor-pointer select-none
                                                    ${assigned 
                                                        ? 'border-primary/40 bg-primary-subtle/30 shadow-xs' 
                                                        : 'border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-xs'
                                                    }
                                                `}
                                            >
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                                                    <i className={`fa-solid ${item.icon} text-[15px]`} />
                                                </div>
                                                <div className="flex flex-col gap-0.5 mt-0.5 min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[13px] font-bold text-text-primary truncate">{item.title}</span>
                                                        {assigned && (
                                                            <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                                                                <i className="fa-solid fa-check text-[10px]" />
                                                                Aktif
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[12px] text-text-tertiary truncate">{item.desc}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Popover.Arrow className="fill-surface-base stroke-subtle" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
