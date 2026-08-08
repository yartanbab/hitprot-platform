import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Button, Badge } from '../../../components/ui';
import { TaskPrivacyDialogV3 } from './TaskPrivacyDialogV3';

const STATUS_LIST = [
    { id: 1, label: 'Bekliyor', color: 'bg-neutral-subtle text-text-secondary border-subtle', dot: 'bg-gray-400' },
    { id: 2, label: 'Sürüyor', color: 'bg-warning-subtle text-warning border-warning/20', dot: 'bg-warning' },
    { id: 3, label: 'Testte', color: 'bg-primary-subtle text-primary border-primary/20', dot: 'bg-primary' },
    { id: 4, label: 'Tamamlandı', color: 'bg-success-subtle text-success border-success/20', dot: 'bg-success' }
];

const PRIORITY_LIST = [
    { id: 1, label: 'Düşük', color: 'text-text-secondary bg-surface-sunken', icon: 'fa-arrow-down' },
    { id: 2, label: 'Orta', color: 'text-warning bg-warning-subtle', icon: 'fa-minus' },
    { id: 3, label: 'Yüksek', color: 'text-negative bg-negative-subtle', icon: 'fa-arrow-up' },
    { id: 4, label: 'Kritik', color: 'text-negative bg-negative-subtle font-bold', icon: 'fa-flag' }
];

export function TaskDetailHeaderV3({
    task = {},
    onClose,
    onToggleFullscreen,
    isFullscreen,
    presentation = 'modal',
    onFieldChange = () => {}
}) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [currentStatusId, setCurrentStatusId] = useState(task.status || 4);
    const [currentPriorityId, setCurrentPriorityId] = useState(task.priority || 4);

    const statusObj = STATUS_LIST.find(s => s.id === currentStatusId) || STATUS_LIST[3];
    const priorityObj = PRIORITY_LIST.find(p => p.id === currentPriorityId) || PRIORITY_LIST[3];

    const taskCode = task.code || (task.id ? `#OTL-${task.id.substring(0, 4).toUpperCase()}` : '#OTL-2507');

    const handleCopyCode = () => {
        navigator.clipboard?.writeText(taskCode);
        setCopiedCode(true);
        window?.abp?.notify?.success?.(`${taskCode} panoya kopyalandı.`);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <header className="flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5">
            <div className="flex items-start justify-between gap-4">
                
                {/* Sol: Görev Kodu, Rozetler & Başlık */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    
                    {/* Üst Sıra Rozetler */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Kod Rozeti */}
                        <button
                            type="button"
                            onClick={handleCopyCode}
                            title="Kodu Kopyala"
                            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs"
                        >
                            <i className="fa-solid fa-hashtag text-[10px]" />
                            <span>{taskCode.replace('#', '')}</span>
                            <i className={`fa-solid ${copiedCode ? 'fa-check text-success' : 'fa-copy opacity-50 group-hover:opacity-100'} text-[10px] ml-0.5 transition-all`} />
                        </button>
                        
                        {/* Durum Dropdown Popover */}
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${statusObj.color}`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${statusObj.dot} animate-pulse`} />
                                    <span>{statusObj.label}</span>
                                    <i className="fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    sideOffset={4}
                                    align="start"
                                    className="z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95"
                                >
                                    <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1">Durumu Değiştir</div>
                                    <div className="flex flex-col gap-0.5">
                                        {STATUS_LIST.map(st => (
                                            <button
                                                key={st.id}
                                                type="button"
                                                onClick={() => {
                                                    setCurrentStatusId(st.id);
                                                    onFieldChange('status', st.id);
                                                }}
                                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${
                                                    currentStatusId === st.id ? 'bg-primary-subtle text-primary font-bold' : 'text-text-primary hover:bg-surface-hover'
                                                }`}
                                            >
                                                <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                                                <span className="flex-1">{st.label}</span>
                                                {currentStatusId === st.id && <i className="fa-solid fa-check text-xs text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>

                        {/* Öncelik Dropdown Popover */}
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${priorityObj.color}`}
                                >
                                    <i className={`fa-solid ${priorityObj.icon} text-[11px]`} />
                                    <span>{priorityObj.label}</span>
                                    <i className="fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    sideOffset={4}
                                    align="start"
                                    className="z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95"
                                >
                                    <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1">Öncelik Seç</div>
                                    <div className="flex flex-col gap-0.5">
                                        {PRIORITY_LIST.map(pr => (
                                            <button
                                                key={pr.id}
                                                type="button"
                                                onClick={() => {
                                                    setCurrentPriorityId(pr.id);
                                                    onFieldChange('priority', pr.id);
                                                }}
                                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${
                                                    currentPriorityId === pr.id ? 'bg-primary-subtle text-primary font-bold' : 'text-text-primary hover:bg-surface-hover'
                                                }`}
                                            >
                                                <i className={`fa-solid ${pr.icon} text-xs`} />
                                                <span className="flex-1">{pr.label}</span>
                                                {currentPriorityId === pr.id && <i className="fa-solid fa-check text-xs text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    </div>
                    
                    {/* Başlık & Favori Yıldızı */}
                    <div className="flex items-center gap-3 mt-1 group">
                        <h1 
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onFieldChange('title', e.currentTarget.textContent)}
                            className="text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate"
                        >
                            {task.title || 'Otel Konaklama Anlaşması'}
                        </h1>

                        <button
                            type="button"
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                                isFavorite 
                                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 scale-110' 
                                    : 'text-text-tertiary hover:bg-surface-hover hover:text-amber-500'
                            }`}
                            title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                        >
                            <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-star text-lg transition-transform`} />
                        </button>
                    </div>
                </div>

                {/* Sağ: Gizlilik Popover'ı, Tam Ekran & Kapat */}
                <div className="flex items-center gap-2 shrink-0">
                    <TaskPrivacyDialogV3 />

                    <div className="h-5 w-px bg-subtle mx-1" />

                    <div className="flex items-center gap-1">
                        {presentation === 'modal' && (
                            <button
                                type="button"
                                onClick={onToggleFullscreen}
                                title={isFullscreen ? 'Küçült' : 'Tam Ekran'}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                            >
                                <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-xs`} />
                            </button>
                        )}

                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    title="Diğer Seçenekler"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
                                >
                                    <i className="fa-solid fa-ellipsis text-sm" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    sideOffset={4}
                                    align="end"
                                    className="z-50 w-48 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95"
                                >
                                    <button 
                                        type="button" 
                                        onClick={handleCopyCode}
                                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left"
                                    >
                                        <i className="fa-solid fa-link text-xs text-text-tertiary" />
                                        <span>Bağlantıyı Kopyala</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left"
                                    >
                                        <i className="fa-solid fa-print text-xs text-text-tertiary" />
                                        <span>Yazdır</span>
                                    </button>
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>

                        {presentation === 'modal' && (
                            <button
                                type="button"
                                onClick={onClose}
                                title="Kapat (Esc)"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-negative-subtle hover:text-negative transition-colors ml-1"
                            >
                                <i className="fa-solid fa-xmark text-sm" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
