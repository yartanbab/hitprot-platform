import React from 'react';

export function HistoryTab({ task }) {
    const records = [
        { label: 'Görev ID', value: task?.id || '-' },
        { label: 'Oluşturan', value: task?.creatorUserName || task?.creatorName || 'Bilinmiyor' },
        { label: 'Oluşturulma Tarihi', value: task?.creationTime ? new Date(task.creationTime).toLocaleString('tr-TR') : '-' },
        { label: 'Son Güncelleyen', value: task?.lastModifierUserName || task?.lastModifierName || 'Henüz güncellenmedi' },
        { label: 'Son Güncelleme Tarihi', value: task?.lastModificationTime ? new Date(task.lastModificationTime).toLocaleString('tr-TR') : '-' },
        { label: 'Proje ID', value: task?.projectId || 'Genel Projesiz Görev' },
    ];

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Teknik Audit & Değişiklik Geçmişi</h4>
            <div className="rounded-lg border border-default divide-y divide-border-subtle bg-surface-elevated">
                {records.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 text-xs">
                        <span className="font-medium text-text-secondary">{r.label}</span>
                        <span className="font-mono text-text-primary">{r.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
