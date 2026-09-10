import React from 'react';
import { STATUS_META } from '../task-detail/v3/taskMetaV3';

/**
 * Panellerin ortak iskeleti: yükleme, hata, boş durum (tasarım 3a) ve
 * görev grup başlığı. Boş durum deseni: 44px tonlu ikon karesi + 700/14
 * başlık + tek cümle + (varsa) birincil aksiyon.
 */

export function PanelLoading() {
    return (
        <div className="p-5" aria-hidden="true">
            <div className="h-10 w-1/3 rounded-lg bg-neutral-subtle animate-pulse mb-3" />
            <div className="h-36 rounded-xl bg-neutral-subtle animate-pulse" />
        </div>
    );
}

export function PanelError({ onRetry }) {
    return (
        <div className="flex flex-col items-center gap-2 py-12 px-6 text-center">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-warning" />
            <span className="text-[13px] font-semibold text-text-primary">Panel yüklenemedi.</span>
            <button
                type="button"
                onClick={onRetry}
                className="mt-1 h-8 px-3.5 rounded-lg border border-default bg-surface-base text-[12.5px] font-semibold text-text-secondary cursor-pointer hover:bg-surface-hover"
            >
                Tekrar dene
            </button>
        </div>
    );
}

export function PanelEmpty({ icon, title, desc, action = null, tone = 'primary' }) {
    const toneCls = tone === 'success'
        ? 'bg-success-subtle text-success'
        : 'bg-primary-subtle text-primary';
    return (
        <div className="flex flex-col items-center gap-2 py-14 px-6 text-center">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneCls}`}>
                <i className={`fa-solid ${icon} text-[18px]`} aria-hidden="true" />
            </span>
            <span className="text-[14px] font-bold text-text-primary">{title}</span>
            {desc && <span className="max-w-[360px] text-[12px] leading-[1.55] text-text-secondary">{desc}</span>}
            {action && <div className="mt-1.5">{action}</div>}
        </div>
    );
}

/** Görev grup başlığı — 42px, kod pill'li; task null ise "kaynağı silinmiş" grubu. */
export function TaskGroupHeader({ task, trailing = null }) {
    return (
        <div className="flex items-center gap-2.5 h-[42px] px-4 bg-surface-raised border-b border-subtle">
            <i className="fa-solid fa-list-check text-[11px] text-text-tertiary" aria-hidden="true" />
            <span className="text-[12.5px] font-bold text-text-primary truncate">
                {task ? task.title : 'Görevi bulunamayan kayıtlar'}
            </span>
            {task && (
                <span className="shrink-0 h-5 inline-flex items-center px-2 rounded-full bg-primary-subtle text-primary text-[10.5px] font-semibold font-mono">
                    {task.number > 0 ? `GRV-${task.number}` : 'GRV-—'}
                </span>
            )}
            {trailing && <span className="ml-auto flex items-center gap-2">{trailing}</span>}
        </div>
    );
}

export function StatusPill({ status }) {
    const meta = STATUS_META[status] ?? STATUS_META[1];
    return (
        <span className={`h-5 inline-flex items-center gap-1 px-2 rounded-full text-[10.5px] font-semibold ${meta.bg} ${meta.fg}`}>
            <i className={`fa-solid ${meta.icon} text-[9px]`} aria-hidden="true" />
            {meta.label}
        </span>
    );
}
