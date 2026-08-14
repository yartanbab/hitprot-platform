import React from 'react';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * Isı takvimi — hafta × gün. SVG değil, CSS grid: hücreler kare kalmalı ve
 * her hücrenin kendi title'ı (erişilebilirlik) olmalı.
 *
 * Yoğunluk 5 kademe; hibe son tarihi olan gün kademe yerine sarı boyanır.
 */

/* Yoğunluk kademeleri — tasarımın #F0F0F2→#BFDBFE→#93C5FD→#2563EB→#1D4ED8
   skalası mevcut brand token'larına birebir oturuyor. */
const LEVEL_CLASS = [
    'bg-surface-sunken',      /* 0 teslim */
    'bg-brand-200',
    'bg-brand-300',
    'bg-brand-500',
    'bg-brand-600',
];

function levelFor(count, max) {
    if (count <= 0) return 0;
    if (max <= 1) return 2;
    /* 1..4 arası kademe — en yoğun gün her zaman en koyu. */
    return Math.min(4, 1 + Math.round(((count - 1) / max) * 3));
}

function Heatmap({ cells = [], weekdayLabels = true }) {
    if (!cells.length) return null;

    const max = Math.max(...cells.map((c) => c.count), 0);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
        <div className="flex flex-col gap-1">
            {weeks.map((week, wi) => (
                <div key={wi} className="flex gap-1">
                    {week.map((cell) => (
                        <span
                            key={cell.date}
                            title={cellTitle(cell)}
                            className={cn(
                                'flex-1 h-[15px] rounded',
                                /* Hibe günü kademeden çıkar, sarı boyanır. Tasarımdaki
                                   #FCD34D için token yok → warning-500 yarı saydam
                                   (yeni renk üretmemek için). */
                                cell.isGrantDeadline
                                    ? 'bg-warning-500/55'
                                    : LEVEL_CLASS[levelFor(cell.count, max)],
                            )}
                        />
                    ))}
                </div>
            ))}
            {weekdayLabels && (
                <div className="flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5">
                    {[
                        t('Common:Day:Mon', 'Pzt'), t('Common:Day:Tue', 'Sal'),
                        t('Common:Day:Wed', 'Çar'), t('Common:Day:Thu', 'Per'),
                        t('Common:Day:Fri', 'Cum'), t('Common:Day:Sat', 'Cmt'),
                        t('Common:Day:Sun', 'Paz'),
                    ].map((label) => <span key={label}>{label}</span>)}
                </div>
            )}
        </div>
    );
}

function cellTitle(cell) {
    const date = new Date(cell.date).toLocaleDateString();
    const deliveries = t('Dashboard:Heatmap:CellCount', '{0} teslim', cell.count);
    return cell.isGrantDeadline
        ? `${date} — ${deliveries} · ${t('Dashboard:Heatmap:GrantDeadline', 'hibe son tarihi')}`
        : `${date} — ${deliveries}`;
}

export { Heatmap };
