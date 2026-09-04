import React from 'react';

/**
 * Geçmiş sekmesi (V3). SALT OKUMA — DB'ye yazmaz, yeni şema gerektirmez.
 *
 * Kaynak, görevin kendi denetim alanlarıdır (`AuditedEntityDto`: creationTime /
 * creatorId / lastModificationTime / lastModifierId) ve durum geçişini gösteren
 * gerçek kolonlar (completedDate, cancelledDate, cancelReason). Alan bazında
 * "şu değer şununla değişti" günlüğü YOK — ABP denetim kaydı henüz bir uçtan
 * dışarı verilmiyor. O yüzden başlık "değişiklik geçmişi" değil "kayıt bilgileri":
 * olmayan bir şeyi varmış gibi sunmuyoruz.
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

export function HistoryTabV3({ task = {}, nameById }) {
    const who = (id) => (id && nameById?.get?.(id)) || null;

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

            <p className="m-0 text-[11.5px] text-text-tertiary">
                Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı.
            </p>
        </div>
    );
}
