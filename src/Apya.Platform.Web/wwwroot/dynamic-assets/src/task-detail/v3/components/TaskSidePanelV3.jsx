import React from 'react';
import { initialsOf, avatarColorOf } from '../taskMetaV3';

/**
 * Genel sekmesinin sağ paneli — yalnızca "Detaylar" kartı.
 * "Hızlı işlemler" ve "Kısayollar" kartları KALDIRILDI: ikisi de header'daki
 * ⋯ menüsüne taşındı (tasarım kararı), aynı eylem iki yerde durmasın.
 */

function Row({ label, value, avatarName }) {
    return (
        <div className="flex items-center justify-between gap-3 py-[9px] border-t border-subtle">
            <span className="text-[12.5px] text-text-tertiary shrink-0">{label}</span>
            <span className="flex items-center gap-[7px] min-w-0">
                {avatarName && (
                    <span
                        className="flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold"
                        style={{ background: avatarColorOf(avatarName) }}
                    >
                        {initialsOf(avatarName)}
                    </span>
                )}
                <span className="text-[12.5px] font-semibold text-text-primary truncate" title={typeof value === 'string' ? value : undefined}>
                    {value || '—'}
                </span>
            </span>
        </div>
    );
}

const fmt = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
    : '—');

export function TaskSidePanelV3({ task = {}, nameById }) {
    const resolve = (name, id) => name || (id && nameById?.get?.(id)) || null;
    const creator = resolve(task.creatorName, task.creatorId);
    const modifier = task.lastModificationTime ? resolve(task.lastModifierName, task.lastModifierId) : null;

    return (
        <aside className="flex flex-col gap-3.5 min-w-0">
            <div className="rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs">
                <h3 className="mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary">Detaylar</h3>
                <Row label="Oluşturan"        value={creator || 'Bilinmiyor'} avatarName={creator} />
                <Row label="Oluşturma tarihi" value={fmt(task.creationTime)} />
                <Row label="Güncelleyen"      value={modifier || '—'} avatarName={modifier} />
                <Row label="Son güncelleme"   value={fmt(task.lastModificationTime)} />
                <Row label="Görev tipi"       value={task.taskType} />
                <Row label="Sprint"           value={task.sprint} />
            </div>
        </aside>
    );
}
