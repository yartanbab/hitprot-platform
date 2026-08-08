import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Badge } from '../../../components/ui';

function MetadataCell({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none">{label}</span>
            <div className="flex items-center text-[13px] text-text-primary h-8 min-w-0">
                {children}
            </div>
        </div>
    );
}

export function TaskMetadataGridV3({ 
    task = {}, 
    assigneeOptions = [], 
    onFieldChange = () => {} 
}) {
    const [tags, setTags] = useState(
        Array.isArray(task.tags) && task.tags.length > 0 
            ? task.tags 
            : ['Konaklama', 'Anlaşma']
    );
    const [newTagInput, setNewTagInput] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const trimmed = newTagInput.trim();
            if (trimmed && !tags.includes(trimmed)) {
                const nextTags = [...tags, trimmed];
                setTags(nextTags);
                onFieldChange('tags', nextTags);
            }
            setNewTagInput('');
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const nextTags = tags.filter(t => t !== tagToRemove);
        setTags(nextTags);
        onFieldChange('tags', nextTags);
    };

    // Formatted Dates
    const fmtDate = (d) => {
        if (!d) return '—';
        const date = new Date(d);
        return isNaN(date.getTime()) ? d : date.toISOString().split('T')[0];
    };

    const assigneeName = task.assigneeName || 'Yakup B.';
    const assigneeAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(assigneeName)}&background=6366f1&color=fff&size=64`;

    return (
        <div className="px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]">
                
                {/* 1. Sorumlu */}
                <MetadataCell label="Sorumlu">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus"
                            >
                                <img src={assigneeAvatar} alt={assigneeName} className="h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" />
                                <span className="font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors">{assigneeName}</span>
                                <i className="fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content
                                sideOffset={6}
                                align="start"
                                className="z-50 w-56 rounded-xl border border-subtle bg-surface-base p-2 shadow-float animate-in fade-in-50 zoom-in-95"
                            >
                                <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1 mb-1">Kişi Ata</div>
                                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                                    {['Yakup B.', 'Elif A.', 'Mehmet K.', 'Ayşe D.'].map(user => (
                                        <button
                                            key={user}
                                            type="button"
                                            onClick={() => onFieldChange('assigneeName', user)}
                                            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${
                                                assigneeName === user ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'
                                            }`}
                                        >
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=6366f1&color=fff&size=64`} alt={user} className="h-5 w-5 rounded-full" />
                                            <span>{user}</span>
                                        </button>
                                    ))}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </MetadataCell>

                {/* 2. Son Tarih */}
                <MetadataCell label="Son Tarih">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative">
                        <i className="fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" />
                        <input
                            type="date"
                            value={fmtDate(task.dueDate)}
                            onChange={(e) => onFieldChange('dueDate', e.target.value)}
                            className="bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
                        />
                    </label>
                </MetadataCell>

                {/* 3. Başlangıç Tarihi */}
                <MetadataCell label="Başlangıç">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative">
                        <i className="fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" />
                        <input
                            type="date"
                            value={fmtDate(task.startDate)}
                            onChange={(e) => onFieldChange('startDate', e.target.value)}
                            className="bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
                        />
                    </label>
                </MetadataCell>

                {/* 4. Öncelik */}
                <MetadataCell label="Öncelik">
                    <div className="flex items-center gap-2 text-[13px] font-medium">
                        <span className="flex items-center gap-1.5 text-negative bg-negative-subtle px-2.5 py-0.5 rounded-md font-semibold">
                            <i className="fa-solid fa-flag text-xs" />
                            <span>Kritik</span>
                        </span>
                    </div>
                </MetadataCell>

                {/* 5. Durum */}
                <MetadataCell label="Durum">
                    <div className="flex items-center gap-2 text-[13px] font-medium">
                        <span className="flex items-center gap-1.5 text-success bg-success-subtle px-2.5 py-0.5 rounded-md font-semibold">
                            <i className="fa-regular fa-circle-check text-xs" />
                            <span>Tamamlandı</span>
                        </span>
                    </div>
                </MetadataCell>

                {/* 6. Etiketler */}
                <MetadataCell label="Etiketler">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {tags.map((tag) => (
                            <span 
                                key={tag} 
                                className="group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors"
                            >
                                <span>{tag}</span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveTag(tag)}
                                    className="opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5"
                                    aria-label="Etiketi kaldır"
                                >
                                    <i className="fa-solid fa-xmark text-[9px]" />
                                </button>
                            </span>
                        ))}

                        {isAddingTag ? (
                            <input
                                autoFocus
                                type="text"
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                onBlur={handleAddTag}
                                placeholder="Etiket..."
                                className="h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
                            />
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setIsAddingTag(true)}
                                className="flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all"
                                aria-label="Yeni etiket ekle"
                            >
                                <i className="fa-solid fa-plus text-[9px]" />
                            </button>
                        )}
                    </div>
                </MetadataCell>

                {/* 7. Proje */}
                <MetadataCell label="Proje">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group">
                        <i className="fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" />
                        <span className="font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]">
                            {task.projectName || 'Otel Projesi'}
                        </span>
                    </div>
                </MetadataCell>

                {/* 8. Maliyet Merkezi */}
                <MetadataCell label="Maliyet Merkezi">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group">
                        <i className="fa-solid fa-bullseye text-text-tertiary group-hover:text-primary transition-colors text-sm" />
                        <span className="font-medium text-text-primary group-hover:text-primary transition-colors text-[13px]">
                            Merkez
                        </span>
                    </div>
                </MetadataCell>

            </div>
        </div>
    );
}
