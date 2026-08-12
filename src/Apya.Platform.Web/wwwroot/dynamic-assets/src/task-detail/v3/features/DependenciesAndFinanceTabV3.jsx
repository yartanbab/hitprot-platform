import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { statusOf } from '../taskMetaV3';
import { TAB_CARD, RowBadge, TabEmptyState } from '../tabPrimitives';

function GroupCard({ icon, iconTone, title, note, children }) {
    return (
        <div className={TAB_CARD}>
            <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle">
                <i className={`fa-solid ${icon} text-[12px] ${iconTone}`} />
                <span className="text-[13px] font-bold text-text-primary">{title}</span>
                <span className="text-[11.5px] text-text-tertiary">{note}</span>
            </div>
            {children}
        </div>
    );
}

/**
 * Bağımlılıklar sekmesi (V4 tasarım dili) — iki grup kartı.
 *
 * VERİ SINIRI: `TaskDto` yalnız `predecessorIds` taşır. "Ardıl görevler" için
 * ters yönlü sorgu (bu görevi öncül gösteren görevler) gerekiyor ve karşılığı
 * olan bir uç nokta YOK — o kart bilinçli olarak boş durumla render edilir,
 * uydurma satır gösterilmez.
 */
export function DependenciesTabV3({ task = {} }) {
    const queryClient = useQueryClient();
    const ids = task.predecessorIds || [];
    const svc = () => window?.apya?.platform?.tasks?.task;

    const { data: predecessors = [], isLoading } = useQuery({
        queryKey: ['task-predecessors', task.id, ids],
        queryFn: async () => {
            const s = svc();
            if (!s) return [];
            return Promise.all(
                ids.map((id) =>
                    Promise.resolve(s.get(id)).catch(() => ({ id, title: '(erişilemeyen görev)', status: null, code: '—' }))
                )
            );
        },
        enabled: ids.length > 0,
        staleTime: 30_000,
        retry: false,
    });

    /** Bağlantıyı kaldır — görevi kalan öncüllerle günceller (anında persist eder). */
    const unlink = async (predecessorId) => {
        try {
            await Promise.resolve(svc().update(task.id, {
                title: task.title,
                description: task.description ?? null,
                startDate: (task.startDate ?? '').slice(0, 10),
                dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId ?? null,
                boardColumnId: task.boardColumnId ?? null,
                projectId: task.projectId ?? null,
                parentTaskId: task.parentTaskId ?? null,
                isPrivate: Boolean(task.isPrivate),
                predecessorIds: ids.filter((x) => x !== predecessorId),
                tagNames: (task.tags ?? []).map((t) => t.name),
                estimatedHours: task.estimatedHours ?? null,
                taskType: task.taskType ?? null,
                sprint: task.sprint ?? null,
            }));
            await queryClient.invalidateQueries({ queryKey: ['task-detail', task.id] });
            window?.abp?.notify?.info?.('Bağlantı kaldırıldı.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Bağlantı kaldırılamadı.');
        }
    };

    const openTask = (id) => window?.apya?.taskDetail?.open?.(id);

    return (
        <div className="flex flex-col gap-4">
            <GroupCard
                icon="fa-arrow-left-long"
                iconTone="text-warning"
                title="Öncül görevler"
                note="bu görev başlamadan tamamlanmalı"
            >
                {ids.length === 0 ? (
                    <TabEmptyState icon="fa-link" title="Öncül bağımlılık yok" description="Bu görevin tanımlı bir öncül bağımlılığı yok." />
                ) : isLoading ? (
                    <p className="m-0 px-4 py-5 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
                ) : (
                    predecessors.map((d) => {
                        const st = d.status == null ? null : statusOf(d.status);
                        return (
                            <div
                                key={d.id}
                                className="flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised"
                            >
                                <span className="shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary">{d.code || '—'}</span>
                                <button
                                    type="button"
                                    onClick={() => openTask(d.id)}
                                    className="flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer"
                                >
                                    {d.title || 'Başlıksız görev'}
                                </button>
                                {st && <RowBadge bg={st.bg} fg={st.fg}>{st.label}</RowBadge>}
                                <button
                                    type="button"
                                    title="Bağlantıyı kaldır"
                                    aria-label={`${d.title} bağlantısını kaldır`}
                                    onClick={() => unlink(d.id)}
                                    className="flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                >
                                    <i className="fa-solid fa-link-slash text-[10px]" />
                                </button>
                            </div>
                        );
                    })
                )}
            </GroupCard>

            <GroupCard
                icon="fa-arrow-right-long"
                iconTone="text-primary"
                title="Ardıl görevler"
                note="bu görev bitince başlar"
            >
                <TabEmptyState
                    icon="fa-diagram-project"
                    title="Ardıl görev listesi henüz yok"
                    description="Bu görevi öncül olarak gösteren görevleri bulmak ters yönlü bir sorgu gerektiriyor; karşılığı olan bir uç nokta henüz tanımlı değil."
                />
            </GroupCard>
        </div>
    );
}
