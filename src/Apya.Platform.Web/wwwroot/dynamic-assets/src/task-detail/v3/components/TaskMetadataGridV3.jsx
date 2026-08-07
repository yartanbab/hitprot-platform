import React from 'react';
import { Badge } from '../../../components/ui';

function MetadataCell({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider">{label}</span>
            <div className="flex items-center text-[13px] text-text-primary h-8">
                {children}
            </div>
        </div>
    );
}

export function TaskMetadataGridV3({ task }) {
    // Mock user
    const assigneeName = 'Yakup B.';
    const assigneeAvatar = 'https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64';

    return (
        <div className="px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]">
                
                {/* 1. Sorumlu */}
                <MetadataCell label="Sorumlu">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max">
                        <img src={assigneeAvatar} alt={assigneeName} className="h-6 w-6 rounded-full border border-subtle" />
                        <span className="font-medium text-text-secondary">{assigneeName}</span>
                    </div>
                </MetadataCell>

                {/* 2. Son Tarih */}
                <MetadataCell label="Son Tarih">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max">
                        <i className="fa-regular fa-calendar text-text-tertiary" />
                        <span className="text-text-secondary">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR') : '10.07.2026'}</span>
                    </div>
                </MetadataCell>

                {/* 3. Başlangıç Tarihi */}
                <MetadataCell label="Başlangıç">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max">
                        <i className="fa-regular fa-calendar text-text-tertiary" />
                        <span className="text-text-secondary">{task.startDate ? new Date(task.startDate).toLocaleDateString('tr-TR') : '25.06.2026'}</span>
                    </div>
                </MetadataCell>

                {/* 4. Öncelik (Readonly here, it is in header too but mock shows it here) */}
                <MetadataCell label="Öncelik">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-flag text-negative" />
                        <span className="font-medium text-text-secondary">Kritik</span>
                    </div>
                </MetadataCell>

                {/* 5. Durum (Readonly) */}
                <MetadataCell label="Durum">
                    <div className="flex items-center gap-2">
                        <i className="fa-regular fa-circle-check text-success" />
                        <span className="font-medium text-text-secondary">Tamamlandı</span>
                    </div>
                </MetadataCell>

                {/* 6. Etiketler */}
                <MetadataCell label="Etiketler">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="primary" className="bg-primary-subtle text-primary hover:bg-primary-hover/20 cursor-pointer text-[11px] font-medium px-2 py-0.5">Konaklama</Badge>
                        <Badge variant="primary" className="bg-primary-subtle text-primary hover:bg-primary-hover/20 cursor-pointer text-[11px] font-medium px-2 py-0.5">Anlaşma</Badge>
                        <button type="button" className="flex items-center justify-center h-[22px] w-[22px] rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors" aria-label="Etiket ekle">
                            <i className="fa-solid fa-plus text-[10px]" />
                        </button>
                    </div>
                </MetadataCell>

                {/* 7. Proje */}
                <MetadataCell label="Proje">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max">
                        <i className="fa-regular fa-folder-open text-text-tertiary" />
                        <span className="font-medium text-text-secondary">Otel Projesi</span>
                    </div>
                </MetadataCell>

                {/* 8. Maliyet Merkezi */}
                <MetadataCell label="Maliyet Merkezi">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max">
                        <i className="fa-solid fa-bullseye text-text-tertiary" />
                        <span className="font-medium text-text-secondary">Merkez</span>
                    </div>
                </MetadataCell>

            </div>
        </div>
    );
}
