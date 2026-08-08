import React, { useState } from 'react';
import { Button } from '../../../components/ui';

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-start py-2.5">
            <span className="text-[13px] text-text-tertiary">{label}</span>
            <span className="text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate" title={typeof value === 'string' ? value : ''}>
                {value ?? '—'}
            </span>
        </div>
    );
}

function DetailRowUser({ label, name, avatar }) {
    return (
        <div className="flex justify-between items-center py-2.5">
            <span className="text-[13px] text-text-tertiary">{label}</span>
            <div className="flex items-center gap-2">
                <img src={avatar} alt={name} className="w-5 h-5 rounded-full border border-subtle object-cover" />
                <span className="text-[13px] text-text-primary font-semibold">{name}</span>
            </div>
        </div>
    );
}

export function TaskSidePanelV3({ task = {}, onDelete = () => {} }) {
    const [showMore, setShowMore] = useState(false);

    const fmt = (iso) => (iso
        ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
        : '25.06.2026 14:30');

    const handleCopyLink = () => {
        const url = `${window.location.origin}/Tasks?task=${task.id || ''}`;
        navigator.clipboard?.writeText(url);
        window?.abp?.notify?.success?.('Görev bağlantısı panoya kopyalandı!');
    };

    const handleDuplicate = () => {
        window?.abp?.notify?.info?.('Görev başarıyla çoğaltıldı.');
    };

    const handleArchive = () => {
        window?.abp?.notify?.info?.('Görev arşive kaldırıldı.');
    };

    return (
        <aside className="flex flex-col gap-6">
            
            {/* 1. Detaylar Kartı */}
            <div className="rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col">
                <h3 className="text-[14px] font-bold text-text-primary mb-2">Detaylar</h3>
                <div className="flex flex-col divide-y divide-subtle/50">
                    <DetailRowUser 
                        label="Oluşturan" 
                        name="Yakup B." 
                        avatar="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" 
                    />
                    <DetailRow label="Oluşturma Tarihi" value={fmt(task.creationTime)} />
                    <DetailRowUser 
                        label="Güncelleyen" 
                        name="Yakup B." 
                        avatar="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" 
                    />
                    <DetailRow label="Son Güncelleme" value={fmt(task.lastModificationTime)} />
                    <DetailRow label="Oluşturma Paneli" value="25.06.2026 14:30" />
                    <DetailRow label="Tahmini Süre" value="15 gün" />
                    <DetailRow label="Gerçekleşen Süre" value="12 gün" />

                    {showMore && (
                        <div className="flex flex-col divide-y divide-subtle/50 animate-in fade-in-50">
                            <DetailRow label="Özel Alanlar" value="Vize, Otel" />
                            <DetailRow label="Kategori" value="Operasyon" />
                            <DetailRow label="SLA Seviyesi" value="Standart (48s)" />
                        </div>
                    )}
                </div>
                
                <button 
                    type="button" 
                    onClick={() => setShowMore(!showMore)}
                    className="mt-3 text-[13px] font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1.5 transition-colors py-1 rounded-lg hover:bg-primary-subtle"
                >
                    <span>{showMore ? 'Daha az alan göster' : 'Daha fazla alan göster'}</span>
                    <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showMore ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* 2. Hızlı İşlemler Kartı */}
            <div className="rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col gap-2.5">
                <h3 className="text-[14px] font-bold text-text-primary mb-1">Hızlı işlemler</h3>
                
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleCopyLink}
                    className="w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]" 
                    icon="fa-link"
                >
                    Bağlantıyı kopyala
                </Button>
                
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleDuplicate}
                    className="w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]" 
                    icon="fa-copy"
                >
                    Çoğalt
                </Button>
                
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleArchive}
                    className="w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]" 
                    icon="fa-box-archive"
                >
                    Arşivle
                </Button>
                
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={onDelete}
                    className="w-full justify-start text-negative hover:bg-negative-subtle hover:border-negative/40 h-10 border-negative/20 font-semibold rounded-xl text-[13px] transition-colors mt-1" 
                    icon="fa-trash-can"
                >
                    Sil
                </Button>
            </div>

        </aside>
    );
}
