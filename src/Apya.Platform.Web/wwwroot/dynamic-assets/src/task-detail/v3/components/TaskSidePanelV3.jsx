import React from 'react';
import { Button } from '../../../components/ui';

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-start py-2">
            <span className="text-[13px] text-text-tertiary">{label}</span>
            <span className="text-[13px] text-text-primary text-right font-medium max-w-[140px] truncate" title={typeof value === 'string' ? value : ''}>
                {value ?? '—'}
            </span>
        </div>
    );
}

function DetailRowUser({ label, name, avatar }) {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-text-tertiary">{label}</span>
            <div className="flex items-center gap-2">
                <img src={avatar} alt={name} className="w-5 h-5 rounded-full" />
                <span className="text-[13px] text-text-primary font-medium">{name}</span>
            </div>
        </div>
    );
}

export function TaskSidePanelV3({ task }) {
    // Mock formatting
    const fmt = (iso) => (iso
        ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
        : '—');

    return (
        <aside className="flex flex-col gap-[var(--apya-space-6)]">
            
            {/* Detaylar Card */}
            <div className="rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)] flex flex-col">
                <h3 className="text-[14px] font-semibold text-text-primary mb-3">Detaylar</h3>
                <div className="flex flex-col divide-y divide-subtle/50">
                    <DetailRowUser label="Oluşturan" name="Yakup B." avatar="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" />
                    <DetailRow label="Oluşturma Tarihi" value={fmt(task.creationTime)} />
                    <DetailRowUser label="Güncelleyen" name="Yakup B." avatar="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" />
                    <DetailRow label="Son Güncelleme" value={fmt(task.lastModificationTime)} />
                    <DetailRow label="Oluşturma Paneli" value="Otomasyon" />
                    <DetailRow label="Tahmini Süre" value="15 gün" />
                    <DetailRow label="Gerçekleşen Süre" value="12 gün" />
                </div>
                
                <button type="button" className="mt-3 text-[13px] font-medium text-primary hover:text-primary-hover flex items-center justify-center gap-1 transition-colors">
                    Daha fazla alan göster <i className="fa-solid fa-chevron-down text-[10px]" />
                </button>
            </div>

            {/* Hızlı İşlemler Card */}
            <div className="rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)] flex flex-col gap-3">
                <h3 className="text-[14px] font-semibold text-text-primary mb-1">Hızlı işlemler</h3>
                
                <Button variant="outline" className="w-full justify-start text-text-secondary h-10 border-subtle" icon="fa-link">
                    Bağlantıyı kopyala
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-text-secondary h-10 border-subtle" icon="fa-copy">
                    Çoğalt
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-text-secondary h-10 border-subtle" icon="fa-box-archive">
                    Arşivle
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-negative h-10 border-negative-subtle hover:bg-negative-subtle hover:border-negative transition-colors" icon="fa-trash-can">
                    Sil
                </Button>
            </div>

        </aside>
    );
}
