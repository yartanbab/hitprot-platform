import React from 'react';
import { Dialog, DialogContent } from '../components/ui';

const GROUPS = [
    {
        title: 'Gezinme',
        rows: [
            { keys: ['←', '→'], label: 'Gün değiştir' },
            { keys: ['↑', '↓'], label: 'Hafta değiştir' },
            { keys: ['PgUp', 'PgDn'], label: 'Önceki / sonraki dönem' },
            { keys: ['T'], label: 'Bugüne dön' },
            { keys: ['M', 'W', 'D', 'A'], label: 'Ay / Hafta / Gün / Ajanda' },
        ],
    },
    {
        title: 'Eylem',
        rows: [
            { keys: ['Enter'], label: 'Seçili günü aç' },
            { keys: ['⇧', '→'], label: 'Seçili günün öğelerini 1 gün ertele' },
            { keys: ['⌘/Ctrl', 'Z'], label: 'Son değişikliği geri al' },
            { keys: ['?'], label: 'Bu haritayı aç / kapat' },
            { keys: ['Esc'], label: 'Açık paneli kapat' },
        ],
    },
];

function Key({ children }) {
    return (
        <kbd className="rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary">
            {children}
        </kbd>
    );
}

/**
 * Klavye kısayolları haritası (`?` ile açılır).
 *
 * Neden var: grid tek sekme durağı ve oklarla geziliyor — bu, keşfedilebilir
 * bir davranış değil. Harita olmadan klavye kullanıcısı takvimin içine
 * girebildiğini bilemez.
 */
export function ShortcutHelp({ open, onClose }) {
    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
            <DialogContent className="w-full max-w-[480px] p-0">
                <header className="flex items-center justify-between border-b border-subtle px-5 py-3">
                    <h2 className="text-[15px] font-semibold text-text-primary">Klavye kısayolları</h2>
                    <button
                        type="button" onClick={onClose} aria-label="Kapat"
                        className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                </header>

                <div className="px-5 py-4">
                    {GROUPS.map((group) => (
                        <section key={group.title} className="mb-4 last:mb-0">
                            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                                {group.title}
                            </p>
                            {group.rows.map((row) => (
                                <div key={row.label} className="flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0">
                                    <span className="flex shrink-0 items-center gap-1">
                                        {row.keys.map((k) => <Key key={k}>{k}</Key>)}
                                    </span>
                                    <span className="text-[12px] text-text-secondary">{row.label}</span>
                                </div>
                            ))}
                        </section>
                    ))}

                    <p className="text-[11px] leading-snug text-text-tertiary">
                        Takvim ızgarası tek sekme durağıdır: <Key>Tab</Key> ile içine girin,
                        sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki
                        kısayollarla da yapılabilir.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
