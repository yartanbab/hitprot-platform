import React from 'react';
import { Button } from '../../../components/ui';

export function DependenciesTabV3({ taskId, task }) {
    const dependencies = [
        { id: 1, code: 'OTL-2490', title: 'Otel Oda Kontratı Onayı', type: 'Öncül (Predecessor)', status: 'Tamamlandı', statusColor: 'text-success bg-success-subtle' },
        { id: 2, code: 'OTL-2510', title: 'Finans Ödeme Emri Çıkarılması', type: 'Ardıl (Successor)', status: 'Bekliyor', statusColor: 'text-warning bg-warning-subtle' }
    ];

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-link text-primary text-base" />
                    <h3 className="text-[15px] font-bold text-text-primary">İlişkili Görevler & Bağımlılıklar</h3>
                </div>
                <Button size="sm" variant="outline" icon="fa-plus">Bağımlılık Ekle</Button>
            </div>

            <div className="flex flex-col divide-y divide-subtle/50">
                {dependencies.map(d => (
                    <div key={d.id} className="flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">#{d.code}</span>
                            <span className="text-[13px] font-semibold text-text-primary">{d.title}</span>
                            <span className="text-xs text-text-tertiary">({d.type})</span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${d.statusColor}`}>{d.status}</span>
                    </div>
                ))}
            </div>
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
