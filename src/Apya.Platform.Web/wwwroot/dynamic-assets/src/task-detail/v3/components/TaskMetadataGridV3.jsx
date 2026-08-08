import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Badge } from '../../../components/ui';

// TaskStatus: Cancelled=0, Todo=1, InProgress=2, InReview=3, Done=4
const STATUS_META = {
    0: { label: 'İptal', cls: 'text-text-secondary bg-neutral-subtle', icon: 'fa-ban' },
    1: { label: 'Bekliyor', cls: 'text-text-secondary bg-neutral-subtle', icon: 'fa-clock' },
    2: { label: 'Sürüyor', cls: 'text-warning bg-warning-subtle', icon: 'fa-spinner' },
    3: { label: 'Testte', cls: 'text-primary bg-primary-subtle', icon: 'fa-flask' },
    4: { label: 'Tamamlandı', cls: 'text-success bg-success-subtle', icon: 'fa-circle-check' },
};
// TaskPriority: Low=1, Medium=2, High=3, Critical=4
const PRIORITY_META = {
    1: { label: 'Düşük', cls: 'text-text-secondary bg-surface-sunken', icon: 'fa-arrow-down' },
    2: { label: 'Orta', cls: 'text-warning bg-warning-subtle', icon: 'fa-minus' },
    3: { label: 'Yüksek', cls: 'text-negative bg-negative-subtle', icon: 'fa-arrow-up' },
    4: { label: 'Kritik', cls: 'text-negative bg-negative-subtle', icon: 'fa-flag' },
};

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
    projectOptions = [],
    onFieldChange = () => {},
    statusValue,
    priorityValue,
    assigneeValue,
    projectValue
}) {
    // Controlled değerler (header ile tek kaynak = form). Kaydet ile persist edilir.
    const currentStatus = statusValue ?? task.status ?? 1;
    const currentPriority = priorityValue ?? task.priority ?? 2;
    const projectId = projectValue ?? task.projectId ?? null;
    const selectedProject = projectOptions.find((o) => o.value === projectId);
    const projectName = selectedProject?.label || task.projectName || 'Projesiz';
    // Etiketler: TagDto listesi ({ name }) → serbest-metin isim dizisi. Form sözleşmesi
    // `tagNames` (List<string>) bekler; onFieldChange bu anahtarla gönderilmeli.
    const [tags, setTags] = useState(
        Array.isArray(task.tags)
            ? task.tags.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean)
            : []
    );
    const [newTagInput, setNewTagInput] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);

    // Sorumlu: controlled (form assigneeId). Seçim anında form güncellenir, Kaydet ile persist.
    const assigneeId = assigneeValue ?? task.assigneeId ?? null;

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const trimmed = newTagInput.trim();
            if (trimmed && !tags.includes(trimmed)) {
                const nextTags = [...tags, trimmed];
                setTags(nextTags);
                onFieldChange('tagNames', nextTags);
            }
            setNewTagInput('');
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const nextTags = tags.filter(t => t !== tagToRemove);
        setTags(nextTags);
        onFieldChange('tagNames', nextTags);
    };

    const handleSelectAssignee = (id) => {
        onFieldChange('assigneeId', id);
    };

    // Formatted Dates
    const fmtDate = (d) => {
        if (!d) return '—';
        const date = new Date(d);
        return isNaN(date.getTime()) ? d : date.toISOString().split('T')[0];
    };

    const selectedOption = assigneeOptions.find((o) => o.value === assigneeId);
    const assigneeName = selectedOption?.label || task.assigneeName || 'Atanmamış';
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
                                    <button
                                        type="button"
                                        onClick={() => handleSelectAssignee(null)}
                                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${
                                            !assigneeId ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'
                                        }`}
                                    >
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-sunken text-text-tertiary">
                                            <i className="fa-solid fa-user-slash text-[9px]" />
                                        </span>
                                        <span>Atanmamış</span>
                                    </button>
                                    {assigneeOptions.length === 0 && (
                                        <div className="px-2 py-1.5 text-[12px] text-text-tertiary">Kullanıcı listesi yükleniyor…</div>
                                    )}
                                    {assigneeOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSelectAssignee(opt.value)}
                                            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${
                                                assigneeId === opt.value ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'
                                            }`}
                                        >
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(opt.label)}&background=6366f1&color=fff&size=64`} alt={opt.label} className="h-5 w-5 rounded-full" />
                                            <span>{opt.label}</span>
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

                {/* 4. Öncelik (tıklanır dropdown — form.priority) */}
                <MetadataCell label="Öncelik">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button type="button" className="flex items-center rounded-md cursor-pointer hover:opacity-90 transition-all focus-visible:outline-none focus-visible:shadow-focus">
                                {(() => {
                                    const p = PRIORITY_META[currentPriority] || PRIORITY_META[2];
                                    return (
                                        <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[13px] font-semibold ${p.cls}`}>
                                            <i className={`fa-solid ${p.icon} text-xs`} />
                                            <span>{p.label}</span>
                                            <i className="fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" />
                                        </span>
                                    );
                                })()}
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content sideOffset={6} align="start" className="z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95">
                                <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1">Öncelik Seç</div>
                                <div className="flex flex-col gap-0.5">
                                    {[1, 2, 3, 4].map((id) => {
                                        const p = PRIORITY_META[id];
                                        const active = currentPriority === id;
                                        return (
                                            <button key={id} type="button" onClick={() => onFieldChange('priority', id)}
                                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${active ? 'bg-primary-subtle text-primary font-bold' : 'text-text-primary hover:bg-surface-hover'}`}>
                                                <i className={`fa-solid ${p.icon} text-xs`} />
                                                <span className="flex-1">{p.label}</span>
                                                {active && <i className="fa-solid fa-check text-xs text-primary" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </MetadataCell>

                {/* 5. Durum (tıklanır dropdown — form.status) */}
                <MetadataCell label="Durum">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button type="button" className="flex items-center rounded-md cursor-pointer hover:opacity-90 transition-all focus-visible:outline-none focus-visible:shadow-focus">
                                {(() => {
                                    const s = STATUS_META[currentStatus] || STATUS_META[1];
                                    return (
                                        <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[13px] font-semibold ${s.cls}`}>
                                            <i className={`fa-solid ${s.icon} text-xs`} />
                                            <span>{s.label}</span>
                                            <i className="fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" />
                                        </span>
                                    );
                                })()}
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content sideOffset={6} align="start" className="z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95">
                                <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1">Durumu Değiştir</div>
                                <div className="flex flex-col gap-0.5">
                                    {[1, 2, 3, 4].map((id) => {
                                        const s = STATUS_META[id];
                                        const active = currentStatus === id;
                                        return (
                                            <button key={id} type="button" onClick={() => onFieldChange('status', id)}
                                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${active ? 'bg-primary-subtle text-primary font-bold' : 'text-text-primary hover:bg-surface-hover'}`}>
                                                <i className={`fa-solid ${s.icon} text-xs`} />
                                                <span className="flex-1">{s.label}</span>
                                                {active && <i className="fa-solid fa-check text-xs text-primary" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
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

                {/* 7. Proje (tıklanır dropdown — form.projectId) */}
                <MetadataCell label="Proje">
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button type="button" className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus">
                                <i className="fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" />
                                <span className="font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]">{projectName}</span>
                                <i className="fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content sideOffset={6} align="start" className="z-50 w-56 rounded-xl border border-subtle bg-surface-base p-2 shadow-float animate-in fade-in-50 zoom-in-95">
                                <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1 mb-1">Proje Seç</div>
                                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto custom-scrollbar">
                                    <button type="button" onClick={() => onFieldChange('projectId', null)}
                                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${!projectId ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'}`}>
                                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-sunken text-text-tertiary"><i className="fa-solid fa-ban text-[9px]" /></span>
                                        <span>Projesiz</span>
                                    </button>
                                    {projectOptions.length === 0 && (
                                        <div className="px-2 py-1.5 text-[12px] text-text-tertiary">Proje listesi yükleniyor…</div>
                                    )}
                                    {projectOptions.map((opt) => (
                                        <button key={opt.value} type="button" onClick={() => onFieldChange('projectId', opt.value)}
                                            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${projectId === opt.value ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'}`}>
                                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-sunken text-text-secondary"><i className="fa-regular fa-folder text-[9px]" /></span>
                                            <span className="truncate">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </MetadataCell>

            </div>
        </div>
    );
}
