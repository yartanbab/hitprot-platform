import React from 'react';
import { cn } from '../lib/utils';
import { RISK, SOURCES, fmt } from './lib/model';

const RISK_BADGE = {
    [RISK.OVERDUE]:   { label: 'Gecikmiş',      className: 'bg-negative-50 text-negative-700' },
    [RISK.DUE_TODAY]: { label: 'Bugün son gün', className: 'bg-warning-50 text-warning-700' },
};

/**
 * Ajanda ve gün panelindeki tek satır. Ay hücresindeki pill'in aksine burada
 * yer var: tür ikonu, başlık, bağlam (proje/müşteri), tutar ve risk rozeti.
 *
 * Faz 3'te tıklama etkinlik drawer'ını açacak; şu an öğenin kendi ekranına
 * götürür — çıkmaz sokak bırakmamak için.
 */
export function ItemRow({ item, onSelect, showDate = false }) {
    const meta = SOURCES[item.source];
    const risk = RISK_BADGE[item.risk];

    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
                'flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast',
                'hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
        >
            <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary"
                aria-hidden="true"
            >
                {meta && <i className={cn('fa', meta.icon)} />}
            </span>

            <span className="min-w-0 flex-1">
                <span className={cn('block truncate text-[13px] font-semibold text-text-primary', item.isDone && 'line-through opacity-65')}>
                    {item.title}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-text-tertiary">
                    {[
                        showDate ? fmt.dayShort(new Date(`${item.date.slice(0, 10)}T00:00:00`)) : null,
                        item.subtitle,
                        item.assigneeName,
                        item.amount != null ? fmt.money(item.amount, item.currency) : null,
                    ].filter(Boolean).join(' · ') || (meta ? meta.label : '')}
                </span>
            </span>

            {risk && (
                <span className={cn('shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold', risk.className)}>
                    {risk.label}
                </span>
            )}
        </button>
    );
}
