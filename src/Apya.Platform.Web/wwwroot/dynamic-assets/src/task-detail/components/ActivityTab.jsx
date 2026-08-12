import React from 'react';
import { fmtDateTime } from '../v3/tabPrimitives';

/**
 * Aktiviteler sekmesi (V4 tasarım dili) — dikey zaman çizelgesi.
 *
 * VERİ SINIRI: ayrı bir olay/denetim tablosu yok; satırlar görevin audit
 * alanlarından (oluşturma/güncelleme/ek sayısı) TÜRETİLİR. Gerçek bir olay
 * akışı için backend'de audit log gerekir.
 */
export function ActivityTab({ task }) {
    const activities = [];

    if (task?.creationTime) {
        activities.push({
            id: 'created',
            icon: 'fa-plus',
            bg: 'bg-success-subtle',
            fg: 'text-success',
            actor: task.creatorUserName || task.creatorName || 'Sistem / Kullanıcı',
            event: 'görevi oluşturdu',
            time: fmtDateTime(task.creationTime),
        });
    }

    if (task?.lastModificationTime) {
        activities.push({
            id: 'modified',
            icon: 'fa-pen',
            bg: 'bg-warning-subtle',
            fg: 'text-warning',
            actor: task.lastModifierUserName || task.lastModifierName || 'Kullanıcı',
            event: 'görevi güncelledi',
            time: fmtDateTime(task.lastModificationTime),
        });
    }

    if (task?.attachments?.length) {
        activities.push({
            id: 'files',
            icon: 'fa-paperclip',
            bg: 'bg-primary-subtle',
            fg: 'text-primary',
            actor: 'Sistem',
            event: `${task.attachments.length} dosya eki mevcut`,
            time: '',
        });
    }

    return (
        <div className="flex flex-col gap-3.5">
            <h4 className="m-0 text-[14px] font-bold text-text-primary">Aktivite Zaman Çizelgesi</h4>

            {activities.length === 0 ? (
                <div className="rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs">
                    <p className="m-0 text-[12.5px] text-text-tertiary">Aktivite kaydı bulunamadı.</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs">
                    {activities.map((act, i) => {
                        const isLast = i === activities.length - 1;
                        return (
                            <div key={act.id} className={`flex items-start gap-3.5 ${isLast ? '' : 'pb-[18px]'}`}>
                                <div className="flex flex-col items-center shrink-0 self-stretch">
                                    <span className={`flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${act.bg} ${act.fg}`}>
                                        <i className={`fa-solid ${act.icon} text-[11px]`} />
                                    </span>
                                    {!isLast && <span className="flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" />}
                                </div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="text-[12.5px] leading-[1.55] text-text-secondary">
                                        <strong className="font-bold text-text-primary">{act.actor}</strong> {act.event}
                                    </div>
                                    {act.time && (
                                        <div className="mt-[3px] font-mono text-[10.5px] text-text-tertiary">{act.time}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
