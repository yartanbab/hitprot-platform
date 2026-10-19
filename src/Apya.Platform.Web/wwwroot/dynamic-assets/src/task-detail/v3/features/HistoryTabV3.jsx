import React from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * Geçmiş sekmesi (V3). SALT OKUMA — DB'ye yazmaz, yeni şema gerektirmez.
 *
 * Üstte görevin kendi denetim alanları ("Kayıt bilgileri"); altta QA-23 (kullanıcı kararı 2026-10-19):
 * ABP denetim kaydından ALAN BAZINDA değişiklik geçmişi (kim, ne zaman, eski → yeni) — `getHistory` ucu.
 */

const fmt = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
    : null);

function Row({ label, value, hint }) {
    return (
        <div className="flex items-start justify-between gap-4 px-3.5 py-3">
            <span className="shrink-0 text-[12.5px] font-semibold text-text-secondary">{label}</span>
            <span className="min-w-0 text-right">
                <span className="block text-[12.5px] font-bold text-text-primary break-words">
                    {value ?? '—'}
                </span>
                {hint && <span className="block text-[11px] text-text-tertiary">{hint}</span>}
            </span>
        </div>
    );
}

/* Anahtar görevin son güncellenme anını da taşır: kayıttan sonra sekme açılınca yeni değişiklik görünür. */
function useTaskHistory(taskId, version) {
    return useQuery({
        queryKey: ['task-history', taskId, version ?? null],
        queryFn: () => {
            const s = window?.apya?.platform?.tasks?.task;
            if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
            return Promise.resolve(s.getHistory(taskId));
        },
        enabled: Boolean(taskId),
        meta: { persist: false },
    });
}

function HistoryEntry({ entry }) {
    return (
        <li className="flex flex-col gap-1 px-3.5 py-3">
            <span className="text-[12px] text-text-tertiary">
                <span className="font-mono">{fmt(entry.changeTime)}</span>
                {entry.changedBy ? ` · ${entry.changedBy}` : ''}
                {entry.kind !== 'Güncellendi' ? ` · ${entry.kind}` : ''}
            </span>
            {entry.changes.map((c, i) => (
                <span key={i} className="text-[12.5px] text-text-primary">
                    <span className="font-semibold">{c.field}:</span>{' '}
                    {c.oldValue != null && <span className="text-text-tertiary line-through">{c.oldValue}</span>}
                    {c.oldValue != null && ' → '}
                    <span className="font-semibold">{c.newValue ?? '—'}</span>
                </span>
            ))}
        </li>
    );
}

export function HistoryTabV3({ task = {}, nameById }) {
    const who = (id) => (id && nameById?.get?.(id)) || null;
    const history = useTaskHistory(task.id, task.lastModificationTime);
    const entries = history.data ?? [];

    const rows = [
        { label: 'Görev kodu', value: task.code || '—' },
        {
            label: 'Oluşturulma',
            value: fmt(task.creationTime),
            hint: who(task.creatorId) ? `${who(task.creatorId)} tarafından` : null,
        },
        {
            label: 'Son güncelleme',
            value: fmt(task.lastModificationTime) ?? 'Henüz güncellenmedi',
            hint: who(task.lastModifierId) ? `${who(task.lastModifierId)} tarafından` : null,
        },
        { label: 'Planlanan başlangıç', value: fmt(task.startDate) },
        { label: 'Termin', value: fmt(task.dueDate) },
    ];

    if (task.completedDate) {
        rows.push({ label: 'Tamamlanma', value: fmt(task.completedDate) });
    }
    if (task.cancelledDate) {
        rows.push({
            label: 'İptal',
            value: fmt(task.cancelledDate),
            hint: task.cancelReason || null,
        });
    }

    return (
        <div className="flex flex-col gap-3.5">
            <div className="overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs">
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised">
                    <i className="fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" />
                    <h2 className="m-0 text-[13.5px] font-bold text-text-primary">Kayıt bilgileri</h2>
                </div>
                <div className="divide-y divide-subtle">
                    {rows.map((r) => <Row key={r.label} {...r} />)}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs">
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised">
                    <i className="fa-solid fa-list-ul text-[13px] text-text-tertiary" />
                    <h2 className="m-0 text-[13.5px] font-bold text-text-primary">Değişiklik geçmişi</h2>
                </div>
                {history.isPending && <p className="m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary">Yükleniyor…</p>}
                {history.isError && <p className="m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary">Geçmiş yüklenemedi.</p>}
                {history.isSuccess && !entries.length && (
                    <p className="m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary">Henüz kayıtlı değişiklik yok.</p>
                )}
                {entries.length > 0 && (
                    <ul className="m-0 p-0 list-none divide-y divide-subtle">
                        {entries.map((e, i) => <HistoryEntry key={i} entry={e} />)}
                    </ul>
                )}
            </div>
        </div>
    );
}
