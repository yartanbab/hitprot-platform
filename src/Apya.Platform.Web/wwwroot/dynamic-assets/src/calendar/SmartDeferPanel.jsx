import React, { useMemo, useState } from 'react';
import { Button, Sheet, SheetContent } from '../components/ui';
import { cn } from '../lib/utils';
import { SOURCES, fmt, isoDay, suggestReschedule } from './lib/model';
import { useBulkReschedule } from './hooks/useCalendarPreferences';

/**
 * Akıllı toplu erteleme — gecikmiş öğeleri tek tek değil, önerilen tarihlerle
 * topluca kapatır.
 *
 * Tasarımın iki kuralı burada görünür:
 * - Öneriler BOŞ günlere dağıtılır (kapasite ve mevcut yük hesaba katılır) —
 *   hepsini bugüne yığmak "akıllı" olmazdı.
 * - Fatura/gider vadeleri ve hibe son tarihleri ERTELENMEZ; listede "değişmez"
 *   olarak ayrı durur ki kullanıcı neden dokunulmadığını görsün.
 */
export function SmartDeferPanel({ open, items, today, capacity, onClose }) {
    const { suggestions, fixed } = useMemo(
        () => suggestReschedule(items, { today, capacity }),
        [items, today, capacity],
    );

    const [selected, setSelected] = useState(() => new Set(suggestions.map((s) => s.item.key)));
    const bulk = useBulkReschedule();

    const results = bulk.data ?? [];
    const failed = new Map(results.filter((r) => !r.succeeded).map((r) => [r.sourceId, r.error]));

    const toggle = (key) => setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key); else next.add(key);
        return next;
    });

    const chosen = suggestions.filter((s) => selected.has(s.item.key));

    const apply = () => {
        bulk.mutate(
            chosen.map((s) => ({
                source: s.item.source,
                sourceId: s.item.sourceId,
                newDate: isoDay(s.date),
            })),
            {
                onSuccess: (data) => {
                    /* Hepsi başarılıysa panel kapanır; kısmi hatada açık kalır ki
                       kullanıcı hangi satırın gitmediğini görsün. */
                    if ((data ?? []).every((r) => r.succeeded)) onClose();
                },
            },
        );
    };

    return (
        <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
            <SheetContent side="right" title="Akıllı erteleme" className="w-full max-w-[420px] p-0">
                <header className="flex items-start gap-2 border-b border-subtle px-4 py-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-semibold text-text-primary">Akıllı erteleme</h3>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-text-tertiary">
                            {suggestions.length > 0
                                ? `${suggestions.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.`
                                : 'Ertelenecek gecikmiş öğe yok.'}
                            {capacity ? ` Günlük kapasite ${fmt.hours(capacity)}.` : ''}
                        </p>
                    </div>
                    <button
                        type="button" onClick={onClose} aria-label="Kapat"
                        className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {suggestions.map(({ item, date }) => {
                        const error = failed.get(item.sourceId);
                        return (
                            <label
                                key={item.key}
                                className={cn(
                                    'flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0',
                                    error && 'bg-negative-50',
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.has(item.key)}
                                    onChange={() => toggle(item.key)}
                                    className="mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[12.5px] font-semibold text-text-primary">
                                        {item.title}
                                    </span>
                                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary">
                                        <span className="line-through">
                                            {fmt.dayShort(new Date(`${item.date.slice(0, 10)}T00:00:00`))}
                                        </span>
                                        <i className="fa fa-arrow-right text-[9px]" aria-hidden="true" />
                                        <span className="font-semibold text-accent">{fmt.dayShort(date)}</span>
                                        {item.loadHours != null && <span>· {fmt.hours(item.loadHours)}</span>}
                                    </span>
                                    {error && (
                                        <span className="mt-0.5 block text-[11px] font-medium text-negative-700">
                                            {error}
                                        </span>
                                    )}
                                </span>
                            </label>
                        );
                    })}

                    {fixed.length > 0 && (
                        <div className="mt-2 border-t border-subtle pt-2">
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                                Ertelenemez
                            </p>
                            {fixed.map((item) => (
                                <div key={item.key} className="flex items-start gap-2.5 py-1.5">
                                    <i className="fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary" aria-hidden="true" />
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[12.5px] text-text-secondary">
                                            {item.title}
                                        </span>
                                        <span className="block text-[11px] text-text-tertiary">
                                            {SOURCES[item.source]?.label} — vadesi takvimden değiştirilemez
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {suggestions.length > 0 && (
                    <footer className="flex items-center gap-2 border-t border-subtle px-4 py-3">
                        <Button
                            size="sm"
                            variant="primary"
                            disabled={chosen.length === 0 || bulk.isPending}
                            onClick={apply}
                        >
                            {bulk.isPending ? 'Erteleniyor…' : `${chosen.length} öğeyi ertele`}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onClose}>Vazgeç</Button>
                    </footer>
                )}
            </SheetContent>
        </Sheet>
    );
}
