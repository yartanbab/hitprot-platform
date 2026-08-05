import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '../../components/ui';
import { AccessBadge } from './AccessBadge';

const STATUS = {
    0: { text: 'İptal',      variant: 'neutral'  },
    1: { text: 'Yapılacak',  variant: 'neutral'  },
    2: { text: 'Sürüyor',    variant: 'warning'  },
    3: { text: 'Testte',     variant: 'brand'    },
    4: { text: 'Tamamlandı', variant: 'positive' },
};

const PRIORITY = {
    1: { text: 'Düşük',  variant: 'positive' },
    2: { text: 'Orta',   variant: 'neutral'  },
    3: { text: 'Yüksek', variant: 'warning'  },
    4: { text: 'Kritik', variant: 'negative' },
};

export function TaskDetailHeader({
    task, canDelete, onClose, onDelete, onToggleFullscreen, fullscreen = false,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onDocClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        const onEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, [menuOpen]);

    const status = STATUS[task?.status] ?? STATUS[1];
    const priority = PRIORITY[task?.priority] ?? PRIORITY[2];

    const copyLink = () => {
        const url = `${window.location.origin}/Tasks/Detail/${task.id}`;
        navigator.clipboard?.writeText(url);
        window?.abp?.notify?.info?.('Bağlantı kopyalandı.');
        setMenuOpen(false);
    };

    return (
        <header className="flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]">
            <div className="flex items-start justify-between gap-[var(--apya-space-4)]">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
                        <i className="fa fa-list-check" aria-hidden="true" />
                        <span>Görev</span>
                    </div>
                    <h2 className="mt-1 truncate text-xl font-semibold text-text-primary">
                        {task?.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant={status.variant}>{status.text}</Badge>
                        <Badge variant={priority.variant}>{priority.text}</Badge>
                        <AccessBadge isPrivate={task?.isPrivate} />
                    </div>
                </div>

                <div className="flex flex-none items-center gap-1">
                    <button
                        type="button"
                        aria-label={fullscreen ? 'Küçült' : 'Tam ekrana büyüt'}
                        onClick={onToggleFullscreen}
                        className="mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                    >
                        <i className={fullscreen ? 'fa fa-compress' : 'fa fa-expand'} aria-hidden="true" />
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            aria-label="Görev işlemleri"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((v) => !v)}
                            className="grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                        >
                            <i className="fa fa-ellipsis" aria-hidden="true" />
                        </button>
                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 z-popover mt-1 w-56 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated py-1 shadow-xl"
                            >
                                <button type="button" role="menuitem" onClick={copyLink}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised">
                                    <i className="fa fa-link w-4 text-text-tertiary" aria-hidden="true" />Bağlantıyı kopyala
                                </button>
                                <button type="button" role="menuitem" disabled
                                    title="Yakında"
                                    className="flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary">
                                    <i className="fa fa-copy w-4" aria-hidden="true" />Çoğalt
                                    <span className="ml-auto text-[11px]">Yakında</span>
                                </button>
                                <button type="button" role="menuitem" disabled
                                    title="Yakında"
                                    className="flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary">
                                    <i className="fa fa-box-archive w-4" aria-hidden="true" />Arşivle
                                    <span className="ml-auto text-[11px]">Yakında</span>
                                </button>
                                {canDelete && (
                                    <>
                                        <div className="my-1 h-px bg-border-subtle" />
                                        <button type="button" role="menuitem"
                                            onClick={() => { setMenuOpen(false); onDelete(); }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-negative hover:bg-surface-raised">
                                            <i className="fa fa-trash w-4" aria-hidden="true" />Sil
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Kapat"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
}
