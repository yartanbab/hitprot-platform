import React from 'react';
import { useQuery } from '@tanstack/react-query';

const STATUS_BADGE = {
    0: { label: 'İptal', cls: 'text-text-secondary bg-neutral-subtle' },
    1: { label: 'Bekliyor', cls: 'text-text-secondary bg-neutral-subtle' },
    2: { label: 'Sürüyor', cls: 'text-warning bg-warning-subtle' },
    3: { label: 'Testte', cls: 'text-primary bg-primary-subtle' },
    4: { label: 'Tamamlandı', cls: 'text-success bg-success-subtle' },
};

/** Bağımlılıklar — görevin gerçek `predecessorIds`'i (öncül görevler) başlıklarıyla listelenir.
 *  Her öncül için TaskDto `get(id)` ile çekilir. Öncül ekleme/çıkarma Faz 2 (görev seçici gerekir). */
export function DependenciesTabV3({ task = {} }) {
    const onOpen = (id) => window?.apya?.taskDetail?.open?.(id);
    const ids = task.predecessorIds || [];

    const { data: predecessors = [], isLoading } = useQuery({
        queryKey: ['task-predecessors', task.id, ids],
        queryFn: async () => {
            const svc = window?.apya?.platform?.tasks?.task;
            if (!svc) return [];
            return Promise.all(
                ids.map((id) =>
                    Promise.resolve(svc.get(id)).catch(() => ({ id, title: '(erişilemeyen görev)', status: null }))
                )
            );
        },
        enabled: ids.length > 0,
        staleTime: 30_000,
        retry: false,
    });

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-subtle pb-4">
                <i className="fa-solid fa-link text-primary text-base" />
                <h3 className="text-[15px] font-bold text-text-primary">Öncül Görevler (Bağımlılıklar)</h3>
            </div>

            {ids.length === 0 ? (
                <p className="text-[13px] text-text-tertiary py-2">Bu görevin tanımlı bir öncül bağımlılığı yok.</p>
            ) : isLoading ? (
                <p className="text-[13px] text-text-tertiary py-2">Yükleniyor…</p>
            ) : (
                <div className="flex flex-col divide-y divide-subtle/50">
                    {predecessors.map((d) => {
                        const badge = STATUS_BADGE[d.status] || null;
                        return (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => onOpen(d.id)}
                                className="flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors text-left"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <i className="fa-solid fa-diagram-predecessor text-text-tertiary text-xs shrink-0" />
                                    <span className="text-[13px] font-semibold text-text-primary truncate">{d.title || 'Başlıksız görev'}</span>
                                </div>
                                {badge && (
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${badge.cls}`}>{badge.label}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function FinanceTabV3({ taskId, task }) {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-coins text-success text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">Görev Bütçesi & Maliyet Analizi</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-success-subtle text-success px-2.5 py-1 rounded-lg">Bütçe Sağlıklı</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Tahsis Edilen Bütçe</span>
                    <span className="text-2xl font-bold text-text-primary">₺ 120.000</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Harcanan Tutar</span>
                    <span className="text-2xl font-bold text-primary">₺ 84.500</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Kalan Bütçe</span>
                    <span className="text-2xl font-bold text-success">₺ 35.500</span>
                </div>
            </div>
        </div>
    );
}
