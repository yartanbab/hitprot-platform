import React, { useState } from 'react';

const ACTIVITIES = [
    {
        id: 1,
        user: 'Yakup B.',
        avatar: 'https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64',
        type: 'status',
        category: 'field',
        icon: 'fa-arrows-rotate',
        iconColor: 'text-primary bg-primary-subtle',
        text: <>Görev durumu <strong className="text-success font-semibold">Tamamlandı</strong> olarak değiştirildi</>,
        date: '10.07.2026 09:45'
    },
    {
        id: 2,
        user: 'Elif A.',
        avatar: 'https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64',
        type: 'file',
        category: 'files',
        icon: 'fa-paperclip',
        iconColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40',
        text: <>Dosya eklendi: <strong className="text-primary hover:underline cursor-pointer">Sözleşme_v2.pdf</strong></>,
        date: '10.07.2026 09:30'
    },
    {
        id: 3,
        user: 'Yakup B.',
        avatar: 'https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64',
        type: 'date',
        category: 'field',
        icon: 'fa-calendar',
        iconColor: 'text-warning bg-warning-subtle',
        text: <>Son tarih <strong className="line-through opacity-70">12.07.2026</strong>'dan <strong>10.07.2026</strong> olarak değiştirildi</>,
        date: '09.07.2026 16:20'
    },
    {
        id: 4,
        user: 'Mehmet K.',
        avatar: 'https://ui-avatars.com/api/?name=Mehmet+K&background=10b981&color=fff&size=64',
        type: 'comment',
        category: 'comments',
        icon: 'fa-comment',
        iconColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
        text: <>Yorum yaptı: <span className="italic text-text-secondary">"Otel kapasitesi onaylandı."</span></>,
        date: '09.07.2026 11:10'
    },
    {
        id: 5,
        user: 'Sistem',
        avatar: '',
        type: 'system',
        category: 'system',
        icon: 'fa-gear',
        iconColor: 'text-text-tertiary bg-surface-sunken',
        text: <>Görev oluşturuldu</>,
        date: '25.06.2026 14:30'
    }
];

export function ActivityTabV3() {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' 
        ? ACTIVITIES 
        : ACTIVITIES.filter(a => a.category === filter);

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-timeline text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">AKTİVİTE & GEÇMİŞ TAKİBİ</h3>
                </div>
                
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                    {[
                        { id: 'all', label: 'Tümü' },
                        { id: 'field', label: 'Alan Değişiklikleri' },
                        { id: 'comments', label: 'Yorumlar' },
                        { id: 'files', label: 'Dosyalar' },
                        { id: 'system', label: 'Sistem' },
                        { id: 'finance', label: 'Finans' },
                    ].map(f => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilter(f.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                                filter === f.id
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-surface-sunken text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chronological Stream with vertical timeline line */}
            <div className="relative flex flex-col pl-4 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-subtle/70">
                {filtered.map(item => (
                    <div key={item.id} className="relative flex items-start gap-4 py-3 group">
                        {/* Timeline Node Icon / Avatar */}
                        <div className="relative z-10 shrink-0">
                            {item.avatar ? (
                                <img 
                                    src={item.avatar} 
                                    alt={item.user} 
                                    className="h-8 w-8 rounded-full border-2 border-surface-base shadow-xs object-cover" 
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-surface-sunken border-2 border-surface-base flex items-center justify-center text-text-tertiary shadow-xs">
                                    <i className="fa-solid fa-server text-xs" />
                                </div>
                            )}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-surface-sunken/40 group-hover:bg-surface-hover/80 border border-subtle/50 transition-all">
                            <div className="flex items-center gap-2">
                                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${item.iconColor} text-[10px]`}>
                                    <i className={`fa-solid ${item.icon}`} />
                                </span>
                                <span className="text-[13px] font-bold text-text-primary">{item.user}</span>
                                <span className="text-[13px] text-text-secondary">{item.text}</span>
                            </div>

                            <span className="text-xs text-text-tertiary font-mono shrink-0">
                                {item.date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
