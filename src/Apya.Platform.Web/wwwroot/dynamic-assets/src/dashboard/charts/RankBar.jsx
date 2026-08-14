import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Yatay sıralama barı — "en çok / en az" listeleri. SVG değil CSS:
 * etiketler metin olarak seçilebilir ve ekran okuyucuya doğal gelir.
 */
function RankBar({ items = [], color = 'var(--apya-brand-500)', formatValue }) {
    if (!items.length) return null;
    const max = Math.max(...items.map((i) => i.value), 0);

    return (
        <ul className="flex flex-col gap-2">
            {items.map((item) => (
                <li key={item.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-text-secondary truncate">{item.label}</span>
                        <span className="font-mono text-[11px] text-text-primary tabular-nums flex-none">
                            {formatValue ? formatValue(item.value) : item.value}
                        </span>
                    </div>
                    <span className="block h-[5px] rounded-full bg-surface-sunken overflow-hidden">
                        <span
                            className={cn('block h-full rounded-full')}
                            style={{
                                width: max > 0 ? `${(item.value / max) * 100}%` : '0%',
                                background: item.color ?? color,
                            }}
                        />
                    </span>
                </li>
            ))}
        </ul>
    );
}

export { RankBar };
