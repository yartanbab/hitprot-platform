import React, { useState, useMemo } from 'react';
import { Input } from '../../components/ui';

const CATEGORY_LABELS = {
    gorev: 'Görev', iletisim: 'İletişim', gecmis: 'Geçmiş',
    finans: 'Finans', ileri: 'İleri Özellikler',
};

/**
 * "+" picker popover'ı — dışa-tıklama/Escape kapatma mantığı BURADA DEĞİL:
 * TaskDetailRoot'taki ortak `<div className="relative">` sarmalayıcı, hem "+"
 * tetikleyici butonu hem bu paneli TEK bir ref altında tutup kapatıyor
 * (TaskDetailHeader'ın "⋯" menüsüyle aynı desen). Ref sadece panelin kendisinde
 * olsaydı, "+" butonuna basmak mousedown'da onClose'u tetikleyip click'te
 * tekrar açardı — popover hiç kapanmıyormuş gibi davranırdı.
 */
export function FeaturePicker({ entries, onAdd, onRemove, busyCode }) {
    const [query, setQuery] = useState('');

    const grouped = useMemo(() => {
        const q = query.trim().toLocaleLowerCase('tr-TR');
        const filtered = q
            ? entries.filter((e) => e.title.toLocaleLowerCase('tr-TR').includes(q))
            : entries;
        const byCategory = new Map();
        filtered.forEach((e) => {
            const list = byCategory.get(e.category) ?? [];
            list.push(e);
            byCategory.set(e.category, list);
        });
        return byCategory;
    }, [entries, query]);

    return (
        <div
            role="dialog"
            aria-label="Özellik ekle"
            className="absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl"
        >
            <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Özellik ara…"
                aria-label="Özellik ara"
            />
            <div className="mt-2 max-h-80 overflow-y-auto">
                {grouped.size === 0 && (
                    <p className="px-2 py-3 text-sm text-text-tertiary">Sonuç bulunamadı.</p>
                )}
                {[...grouped.entries()].map(([category, items]) => (
                    <div key={category} className="mb-2">
                        <p className="px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary">
                            {CATEGORY_LABELS[category] ?? category}
                        </p>
                        {items.map((entry) => (
                            <div key={entry.code} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised">
                                <i className={`fa ${entry.icon} w-4 text-text-tertiary`} aria-hidden="true" />
                                <span className="flex-1 truncate text-sm text-text-primary">{entry.title}</span>
                                {!entry.implemented && (
                                    <span className="text-[11px] text-text-tertiary">Yakında</span>
                                )}
                                {entry.implemented && !entry.isAssigned && (
                                    <button
                                        type="button"
                                        disabled={busyCode === entry.code}
                                        onClick={() => onAdd(entry.code)}
                                        className="text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50"
                                    >
                                        Ekle
                                    </button>
                                )}
                                {entry.implemented && entry.isAssigned && (
                                    <button
                                        type="button"
                                        disabled={busyCode === entry.code}
                                        onClick={() => onRemove(entry.code)}
                                        className="text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50"
                                    >
                                        Kaldır
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
