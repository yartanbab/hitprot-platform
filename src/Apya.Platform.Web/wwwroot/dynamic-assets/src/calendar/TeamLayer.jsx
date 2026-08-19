import React from 'react';
import { cn } from '../lib/utils';
import { fmt, isoDay } from './lib/model';

/**
 * Ekip katmanı — "kim ne zaman müsait".
 *
 * Rayda anahtarla açılır; açıkken kişi başına günlük yük şeritleri görünür.
 * Yetki notu EKRANDA yazar: burada yalnız kullanıcının görebildiği görevler
 * toplanır, yani katman yeni bir görünürlük açmaz.
 */
export function TeamLayer({ rows, days, capacity, loading }) {
    if (loading) {
        return (
            <p className="px-2 py-1.5 text-[11.5px] text-text-tertiary">
                <i className="fa fa-circle-notch fa-spin me-1.5" aria-hidden="true" />
                ekip yükü hesaplanıyor…
            </p>
        );
    }

    if (!rows || rows.length === 0) {
        return (
            <p className="px-2 py-1.5 text-[11.5px] text-text-tertiary">
                Bu aralıkta atanmış açık görev yok.
            </p>
        );
    }

    const dayKeys = (days ?? []).map(isoDay);

    return (
        <div className="flex flex-col gap-1.5 px-2 pb-1">
            {rows.map((row) => {
                const byDay = {};
                for (const d of row.days ?? []) byDay[d.date.slice(0, 10)] = d;

                return (
                    <div key={row.userId}>
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-[11.5px] font-medium text-text-primary">{row.name}</span>
                            <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary">
                                {fmt.hours(row.totalHours)}
                            </span>
                        </div>

                        {/* Şerit: gün başına bir hücre; kapasiteyi aşan gün kırmızı. */}
                        <div className="mt-0.5 flex gap-[2px]">
                            {(dayKeys.length ? dayKeys : (row.days ?? []).map((d) => d.date.slice(0, 10))).map((key) => {
                                const day = byDay[key];
                                const hours = day?.hours ?? 0;
                                const over = capacity && hours > capacity;
                                const ratio = capacity ? Math.min(hours / capacity, 1) : (hours > 0 ? 1 : 0);
                                return (
                                    <span
                                        key={key}
                                        title={`${key}: ${fmt.hours(hours)}${day?.itemCount ? ` · ${day.itemCount} öğe` : ''}`}
                                        className="h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle"
                                    >
                                        <span
                                            className={cn('block h-full', over ? 'bg-negative' : 'bg-accent')}
                                            style={{ width: `${ratio * 100}%` }}
                                        />
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <p className="mt-1 text-[10.5px] leading-snug text-text-tertiary">
                Yalnız görebildiğiniz projelerin görevleri sayılır.
            </p>
        </div>
    );
}
