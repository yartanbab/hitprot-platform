import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { statusOf } from '../taskMetaV3';
import { TAB_CARD, RowBadge, TabEmptyState } from '../tabPrimitives';
import { taskToUpdateDto } from '../../taskUpdateDto';
import { notifyError } from '../../../lib/api/abpErrors';

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
 * Öncüller `TaskDto.predecessorIds`'ten; ARDILLAR projenin bağ kenarlarından
 * (`getProjectDependencies` — Zaman Çizelgesi'nin de kullandığı, gizlilik süzgeçli uç).
 * Eskiden ardıl kartı "uç nokta yok" diyordu (uç vardı) ve öncül EKLENEMİYORDU: proje
 * ekranı "bağları görev detayının Bağımlılıklar sekmesinden kurun" derken burada yalnız
 * kaldırma vardı (QA-22). Seçici aynı projenin görevlerini sunar; görevin kendisi, mevcut
 * öncüller ve ardıllar (iki görevlik döngü) seçenek değildir.
 *
 * `readOnly`: bağlantı kaldırma görevin TAM güncellemesidir (UpdateAsync → Edit +
 * sahiplik); yetkisiz kullanıcıya düğme çizilmez.
 */
export function DependenciesTabV3({ task = {}, readOnly = false }) {
    const queryClient = useQueryClient();
    const ids = task.predecessorIds || [];
    const svc = () => window?.apya?.platform?.tasks?.task;

    /* Öncül seçicisinin seçenekleri + ardıl satırlarının başlıkları: aynı projenin görevleri. */
    const { data: projectTasks = [] } = useQuery({
        queryKey: ['task-dependency-candidates', task.projectId ?? null],
        queryFn: async () => {
            const res = await Promise.resolve(svc()?.getList({ projectId: task.projectId || undefined, maxResultCount: 1000 }));
            return res?.items ?? [];
        },
        enabled: Boolean(task.id),
        staleTime: 30_000,
        meta: { persist: false },
        retry: false,
    });

    const { data: edges = [], isLoading: edgesLoading } = useQuery({
        queryKey: ['task-dependency-edges', task.projectId ?? null],
        queryFn: async () => (await Promise.resolve(svc()?.getProjectDependencies(task.projectId || undefined))) ?? [],
        enabled: Boolean(task.id),
        staleTime: 30_000,
        meta: { persist: false },
        retry: false,
    });

    const byId = useMemo(() => new Map(projectTasks.map((t) => [t.id, t])), [projectTasks]);
    const successorIds = edges.filter((e) => e.predecessorTaskId === task.id).map((e) => e.taskId);
    const candidates = projectTasks.filter((t) =>
        t.id !== task.id && !ids.includes(t.id) && !successorIds.includes(t.id));
    const [pick, setPick] = useState('');

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
        meta: { persist: false },
        retry: false,
    });

    /** Bağlantıyı kaldır — görevi kalan öncüllerle günceller (anında persist eder).
     *  DTO ortak yardımcıdan: elle kurulan kopya bütçe bağını düşürüp siliyordu (STA-01). */
    const unlink = async (predecessorId) => {
        try {
            await Promise.resolve(svc().update(task.id, taskToUpdateDto(task, {
                predecessorIds: ids.filter((x) => x !== predecessorId),
            })));
            await queryClient.invalidateQueries({ queryKey: ['task-detail', task.id] });
            await queryClient.invalidateQueries({ queryKey: ['task-dependency-edges'] });
            window?.abp?.notify?.info?.('Bağlantı kaldırıldı.');
        } catch (err) {
            notifyError(err, 'Bağlantı kaldırılamadı.');
        }
    };

    /** Öncül ekle — kaldırmayla aynı tam güncelleme (ortak DTO yardımcısı). */
    const link = async () => {
        if (!pick) return;
        try {
            await Promise.resolve(svc().update(task.id, taskToUpdateDto(task, {
                predecessorIds: [...ids, pick],
            })));
            setPick('');
            await queryClient.invalidateQueries({ queryKey: ['task-detail', task.id] });
            await queryClient.invalidateQueries({ queryKey: ['task-dependency-edges'] });
            window?.abp?.notify?.success?.('Öncül eklendi.');
        } catch (err) {
            notifyError(err, 'Öncül eklenemedi.');
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
                                {!readOnly && (
                                    <button
                                        type="button"
                                        title="Bağlantıyı kaldır"
                                        aria-label={`${d.title} bağlantısını kaldır`}
                                        onClick={() => unlink(d.id)}
                                        className="flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                    >
                                        <i className="fa-solid fa-link-slash text-[10px]" />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
                {!readOnly && (
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-subtle">
                        <select
                            aria-label="Öncül görev seç"
                            value={pick}
                            onChange={(e) => setPick(e.target.value)}
                            className="flex-1 min-w-0 h-8 px-2.5 rounded-[9px] border border-default bg-surface-base text-text-primary text-[12.5px]"
                        >
                            <option value="">{candidates.length ? 'Öncül görev seçin…' : 'Eklenebilecek görev yok'}</option>
                            {candidates.map((c) => (
                                <option key={c.id} value={c.id}>{(c.code ? c.code + ' · ' : '') + (c.title || 'Başlıksız görev')}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={link}
                            disabled={!pick}
                            className="shrink-0 h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Öncül ekle
                        </button>
                    </div>
                )}
            </GroupCard>

            <GroupCard
                icon="fa-arrow-right-long"
                iconTone="text-primary"
                title="Ardıl görevler"
                note="bu görev bitince başlar"
            >
                {edgesLoading ? (
                    <p className="m-0 px-4 py-5 text-[12.5px] text-text-tertiary">Yükleniyor…</p>
                ) : successorIds.length === 0 ? (
                    <TabEmptyState icon="fa-diagram-project" title="Ardıl görev yok" description="Bu görevi öncül olarak gösteren bir görev yok." />
                ) : (
                    successorIds.map((sid) => {
                        const s = byId.get(sid);
                        const st = s && s.status != null ? statusOf(s.status) : null;
                        return (
                            <div
                                key={sid}
                                className="flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised"
                            >
                                <span className="shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary">{s?.code || '—'}</span>
                                <button
                                    type="button"
                                    onClick={() => openTask(sid)}
                                    className="flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer"
                                >
                                    {s?.title || '(erişilemeyen görev)'}
                                </button>
                                {st && <RowBadge bg={st.bg} fg={st.fg}>{st.label}</RowBadge>}
                            </div>
                        );
                    })
                )}
            </GroupCard>
        </div>
    );
}
