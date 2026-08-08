import React, { useState } from 'react';

const ACTIVITIES = [
    {
        id: 1,
        user: 'Yakup B.',
        avatar: 'https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64',
        type: 'field',
        category: 'field',
        text: <>Görev durumu <strong>Tamamlandı</strong> olarak değiştirildi</>,
        date: '10.07.2026 09:45'
    },
    {
        id: 2,
        user: 'Elif A.',
        avatar: 'https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64',
        type: 'file',
        category: 'files',
        text: <>Dosya eklendi: <strong className="text-primary cursor-pointer hover:underline">Sözleşme_v2.pdf</strong></>,
        date: '10.07.2026 09:30'
    },
    {
        id: 3,
        user: 'Yakup B.',
        avatar: 'https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64',
        type: 'field',
        category: 'field',
        text: <>Son tarih <strong>12.07.2026</strong>'dan <strong>10.07.2026</strong> olarak değiştirildi</>,
        date: '09.07.2026 16:20'
    },
    {
        id: 4,
        user: 'Mehmet K.',
        avatar: 'https://ui-avatars.com/api/?name=Mehmet+K&background=10b981&color=fff&size=64',
        type: 'comment',
        category: 'comments',
        text: <>Yorum yaptı</>,
        date: '09.07.2026 11:10'
    },
    {
        id: 5,
        user: 'Sistem',
        avatar: '',
        type: 'system',
        category: 'system',
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
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <h3 className="text-[15px] font-bold text-text-primary">AKTİVİTE & GEÇMİŞ TAKİBİ</h3>
                
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

            {/* Chronological Stream */}
            <div className="flex flex-col divide-y divide-subtle/50">
                {filtered.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            {item.avatar ? (
                                <img src={item.avatar} alt={item.user} className="h-8 w-8 rounded-full border border-subtle" />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-surface-sunken border border-subtle flex items-center justify-center text-text-tertiary">
                                    <i className="fa-solid fa-server text-xs" />
                                </div>
                            )}
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold text-text-primary">{item.user}</span>
                                    <span className="text-[13px] text-text-secondary">{item.text}</span>
                                </div>
                            </div>
                        </div>

                        <span className="text-xs text-text-tertiary font-mono">
                            {item.date}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
