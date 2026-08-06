import React from 'react';

const fmt = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
    : '—');

function Row({ label, value }) {
    return (
        <div>
            <dt className="text-[13px] text-text-tertiary">{label}</dt>
            <dd className="mt-0.5 text-text-primary">{value ?? '—'}</dd>
        </div>
    );
}

export function TaskDetailsPanel({ task, creatorName, lastModifierName }) {
    return (
        <aside className="space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]">
            <h3 className="text-[13px] font-semibold text-text-secondary">Detaylar</h3>
            <dl className="space-y-3 text-sm">
                <Row label="Oluşturan" value={creatorName} />
                <Row label="Oluşturulma zamanı" value={fmt(task.creationTime)} />
                <Row label="Güncelleyen" value={lastModifierName} />
                <Row label="Son güncelleme zamanı" value={fmt(task.lastModificationTime)} />
                <Row label="Proje" value={task.projectName} />
            </dl>
        </aside>
    );
}
