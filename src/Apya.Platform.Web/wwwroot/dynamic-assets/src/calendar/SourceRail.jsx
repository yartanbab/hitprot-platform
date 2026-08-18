import React from 'react';
import { cn } from '../lib/utils';
import { SOURCES, SOURCE_ORDER } from './lib/model';

/**
 * Kaynak rayı — hangi veri türü takvimde görünsün.
 *
 * İzin verilmeyen kaynak HİÇ ÇİZİLMEZ (sunucu IsAvailable=false döner):
 * kullanıcıya erişemeyeceği bir veri türü vaat edilmez.
 *
 * `compact` (tablet): satırlar ikona daralır, sayaç ikonun üstünde rozet olur —
 * kolonlardan hiçbiri kaybolmaz, yalnız genişlik 256 → 60px'e iner.
 */
export function SourceRail({ sources, counts, enabled, onToggle, compact = false }) {
    const available = (sources ?? []).filter((s) => s.isAvailable);
    if (available.length === 0) return null;

    return (
        <nav
            aria-label="Takvim kaynakları"
            className={cn(
                'flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2',
                compact ? 'w-[60px] items-center' : 'w-full',
            )}
        >
            {!compact && (
                <p className="px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary">
                    Kaynaklar
                </p>
            )}

            {available.map((row) => {
                const meta = SOURCES[row.source];
                if (!meta) return null;
                const isOn = enabled.has(row.source);
                const count = counts[row.source] ?? 0;

                return (
                    <button
                        key={row.source}
                        type="button"
                        role="switch"
                        aria-checked={isOn}
                        title={compact ? `${meta.label} — ${count} öğe` : undefined}
                        onClick={() => onToggle(row.source)}
                        className={cn(
                            'group flex items-center rounded-md text-left transition-colors duration-fast',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                            compact ? 'relative h-11 w-11 justify-center' : 'gap-2.5 px-2 py-2',
                            isOn ? 'text-text-primary' : 'text-text-tertiary',
                            'hover:bg-surface-hover',
                        )}
                    >
                        <span
                            className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]',
                                isOn ? 'bg-primary-subtle text-accent' : 'bg-neutral-subtle text-text-tertiary',
                            )}
                            aria-hidden="true"
                        >
                            <i className={cn('fa', meta.icon)} />
                        </span>

                        {compact ? (
                            count > 0 && (
                                <span
                                    className={cn(
                                        'absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4',
                                        isOn ? 'bg-accent text-white' : 'bg-neutral-200 text-text-tertiary',
                                    )}
                                >
                                    {count}
                                </span>
                            )
                        ) : (
                            <>
                                <span className={cn('flex-1 truncate text-[12.5px] font-medium', !isOn && 'line-through decoration-1')}>
                                    {meta.label}
                                </span>
                                <span className="font-mono text-[11px] tabular-nums text-text-tertiary">{count}</span>
                            </>
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
