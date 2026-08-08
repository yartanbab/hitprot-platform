import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

export function TaskSidePanelV3({ task = {}, onDelete = () => {}, nameById }) {
    const [isCloning, setIsCloning] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const queryClient = useQueryClient();

    const resolveName = (name, id) => name || (id && nameById?.get?.(id)) || 'Bilinmiyor';
    const creatorName = resolveName(task.creatorName, task.creatorId);
    const modifierName = task.lastModificationTime ? resolveName(task.lastModifierName, task.lastModifierId) : '—';

    const fmt = (iso) => (iso
        ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
        : '—');

    // 1. Bağlantıyı kopyala
    const handleCopyLink = () => {
        const url = `${window.location.origin}/Tasks?task=${task.id || ''}`;
        navigator.clipboard?.writeText(url);
        window?.abp?.notify?.success?.('Görev bağlantısı panoya kopyalandı!');
    };

    // 2. Çoğalt (Clone/Duplicate to backend)
    const handleDuplicate = async () => {
        if (!task || isCloning) return;
        setIsCloning(true);
        try {
            const svc = window?.apya?.platform?.tasks?.task;
            if (svc) {
                const cloneDto = {
                    title: `Kopya - ${task.title || 'Görev'}`,
                    description: task.description || '',
                    startDate: task.startDate ? new Date(task.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : null,
                    status: 1, // Todo
                    priority: task.priority || 2,
                    projectId: task.projectId,
                    assigneeId: task.assigneeId,
                    isPrivate: task.isPrivate || false
                };
                const newId = await Promise.resolve(svc.create(cloneDto));
                await queryClient.invalidateQueries({ queryKey: ['task-detail'] });
                window?.abp?.notify?.success?.('Görev başarıyla çoğaltıldı!');
                if (window.apya?.taskDetail?.open && newId) {
                    window.apya.taskDetail.open(newId);
                }
            }
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev çoğaltılamadı.');
        } finally {
            setIsCloning(false);
        }
    };

    // 3. Arşivle (Status -> Done / Archived)
    const handleArchive = async () => {
        if (!task.id || isArchiving) return;
        setIsArchiving(true);
        try {
            const svc = window?.apya?.platform?.tasks?.task;
            if (svc) {
                await Promise.resolve(svc.updateStatus(task.id, 4)); // Done / Tamamlandı
                await queryClient.invalidateQueries({ queryKey: ['task-detail', task.id] });
                window?.abp?.notify?.info?.('Görev arşivlendi (Tamamlandı).');
            }
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev arşivlenemedi.');
        } finally {
            setIsArchiving(false);
        }
    };

    return (
        <aside className="flex flex-col gap-6">
            
            {/* 1. Detaylar Kartı */}
            <div className="rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col">
                <h3 className="text-[14px] font-bold text-text-primary mb-2">Detaylar</h3>
                <div className="flex flex-col divide-y divide-subtle/50">
                    <DetailRowUser
                        label="Oluşturan"
                        name={creatorName}
                        avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=6366f1&color=fff&size=64`}
                    />
                    <DetailRow label="Oluşturma Tarihi" value={fmt(task.creationTime)} />
                    <DetailRowUser
                        label="Güncelleyen"
                        name={modifierName}
                        avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(modifierName)}&background=6366f1&color=fff&size=64`}
                    />
                    <DetailRow label="Son Güncelleme" value={fmt(task.lastModificationTime)} />
                </div>
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
                    disabled={isCloning}
                    isLoading={isCloning}
                    className="w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]" 
                    icon="fa-copy"
                >
                    Çoğalt
                </Button>
                
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleArchive}
                    disabled={isArchiving}
                    isLoading={isArchiving}
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
