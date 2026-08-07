import React from 'react';

export function ActivityTab({ task }) {
    const activities = [];

    if (task?.creationTime) {
        activities.push({
            id: 'created',
            type: 'create',
            icon: 'fa-plus',
            title: 'Görev oluşturuldu',
            user: task.creatorUserName || task.creatorName || 'Sistem / Kullanıcı',
            time: new Date(task.creationTime).toLocaleString('tr-TR'),
        });
    }

    if (task?.lastModificationTime) {
        activities.push({
            id: 'modified',
            type: 'update',
            icon: 'fa-pen',
            title: 'Görev güncellendi',
            user: task.lastModifierUserName || task.lastModifierName || 'Kullanıcı',
            time: new Date(task.lastModificationTime).toLocaleString('tr-TR'),
        });
    }

    if (task?.attachments && task.attachments.length > 0) {
        activities.push({
            id: 'files',
            type: 'file',
            icon: 'fa-paperclip',
            title: `${task.attachments.length} dosya eki mevcut`,
            user: 'Sistem',
            time: '',
        });
    }

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Aktivite Zaman Çizelgesi</h4>
            {activities.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-tertiary">
                    Aktivite kaydı bulunamadı.
                </div>
            ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
                    {activities.map((act) => (
                        <div key={act.id} className="relative flex items-start justify-between gap-3 text-xs">
                            <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-surface-raised text-text-tertiary">
                                <i className={`fa ${act.icon} text-[10px]`} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="font-medium text-text-primary">{act.title}</p>
                                {act.user && <span className="text-text-tertiary">Yapan: {act.user}</span>}
                            </div>
                            {act.time && <span className="text-text-tertiary whitespace-nowrap">{act.time}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
