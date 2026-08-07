import React, { useState } from 'react';
import { Button, Badge } from '../../../components/ui';

export function TaskDetailHeaderV3({
    task,
    onClose,
    onToggleFullscreen,
    isFullscreen,
    presentation = 'modal'
}) {
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock status and priority options
    const statuses = [
        { id: 1, label: 'Tamamlandı', color: 'success' },
        { id: 2, label: 'Devam Ediyor', color: 'primary' },
        { id: 3, label: 'Beklemede', color: 'warning' },
    ];
    const priorities = [
        { id: 1, label: 'Kritik', color: 'negative' },
        { id: 2, label: 'Yüksek', color: 'warning' },
        { id: 3, label: 'Normal', color: 'neutral' },
    ];

    const currentStatus = statuses.find(s => s.id === task.status) || statuses[0];
    const currentPriority = priorities.find(p => p.id === task.priority) || priorities[0];

    return (
        <header className="flex flex-col gap-[var(--apya-space-4)] border-b border-subtle p-[var(--apya-space-6)] pb-[var(--apya-space-4)]">
            <div className="flex items-start justify-between gap-[var(--apya-space-4)]">
                {/* Left: Code, Title, Star */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="primary" className="font-mono text-xs tracking-wider bg-primary-subtle text-primary">
                            #{task.id?.substring(0, 8).toUpperCase() || 'OTL-2507'}
                        </Badge>
                        
                        <div className="flex items-center gap-2">
                            <Badge variant="success" className="cursor-pointer hover:bg-success-hover transition-colors font-medium text-xs py-1 px-2.5">
                                <i className="fa-regular fa-circle-check mr-1.5" />
                                {currentStatus.label} <i className="fa-solid fa-chevron-down ml-1 text-[10px]" />
                            </Badge>
                            
                            <Badge variant="negative" className="cursor-pointer hover:bg-negative-hover transition-colors font-medium text-xs py-1 px-2.5">
                                <i className="fa-solid fa-flag mr-1.5" />
                                {currentPriority.label} <i className="fa-solid fa-chevron-down ml-1 text-[10px]" />
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 group mt-1">
                        <h1 className="text-[22px] font-semibold text-text-primary group-hover:text-primary transition-colors cursor-text">
                            {task.title || 'İsimsiz Görev'}
                        </h1>
                        <button
                            type="button"
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                isFavorite 
                                    ? 'text-warning hover:bg-warning-subtle' 
                                    : 'text-text-tertiary hover:bg-surface-hover hover:text-text-secondary'
                            }`}
                        >
                            <i className={isFavorite ? 'fa-solid fa-star text-lg' : 'fa-regular fa-star text-lg'} />
                        </button>
                    </div>
                </div>

                {/* Right: Access Badge & Actions */}
                <div className="flex items-center gap-[var(--apya-space-3)]">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm">
                        <i className="fa-solid fa-lock text-[11px]" />
                        Sınırlı erişim
                        <i className="fa-solid fa-chevron-down text-[10px] ml-1" />
                    </div>

                    <div className="h-6 w-px bg-subtle mx-1" />

                    <div className="flex items-center gap-1">
                        {presentation === 'modal' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={isFullscreen ? 'fa-compress' : 'fa-expand'}
                                onClick={onToggleFullscreen}
                                aria-label="Tam ekran"
                                className="h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-surface-hover"
                            />
                        )}
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            icon="fa-ellipsis"
                            aria-label="Aksiyonlar"
                            className="h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-surface-hover"
                        />

                        {presentation === 'modal' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon="fa-xmark"
                                onClick={onClose}
                                aria-label="Kapat"
                                className="h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-negative-subtle hover:text-negative transition-colors"
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
