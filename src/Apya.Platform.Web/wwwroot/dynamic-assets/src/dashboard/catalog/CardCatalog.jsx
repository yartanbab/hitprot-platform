import React, { useMemo, useState } from 'react';
import { Sheet, SheetContent, Button, Input } from '../../components/ui';
import { CARD_REGISTRY } from '../layouts/viewPresets';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

/**
 * Kart kataloğu — aranabilir kart listesi.
 *
 * Zaten ekranda olan kart PASİF görünür (kaldırılıp yeniden eklenmesin diye);
 * yetki kontrolü yapılmaz çünkü kartın içeriğini sunucu zaten kilitliyor —
 * yetkisiz kullanıcı kartı ekleyebilir ama içinde değer göremez.
 */
function CardCatalog({ open, onOpenChange, presentCardKeys = [], onAdd }) {
    const [search, setSearch] = useState('');

    const entries = useMemo(() => {
        const term = search.trim().toLocaleLowerCase();
        return Object.entries(CARD_REGISTRY)
            .map(([key, meta]) => ({ key, meta, label: t(meta.titleKey, meta.fallback) }))
            .filter((entry) => !term || entry.label.toLocaleLowerCase().includes(term));
    }, [search]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[380px] mobile:w-full">
                <div className="flex flex-col gap-4 p-5 h-full">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold text-text-primary">
                            {t('Dashboard:Catalog:Title', 'Kart ekle')}
                        </h2>
                        <p className="text-[12.5px] text-text-tertiary">
                            {t('Dashboard:Catalog:Subtitle', 'Eklediğin kart görünümün altına yerleşir; sürükleyip boyutlandırabilirsin.')}
                        </p>
                    </div>

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('Dashboard:Catalog:Search', 'Kart ara…')}
                        aria-label={t('Dashboard:Catalog:Search', 'Kart ara…')}
                    />

                    <ul className="flex flex-col gap-2 overflow-auto flex-1">
                        {entries.map(({ key, meta, label }) => {
                            const present = presentCardKeys.includes(key);
                            return (
                                <li
                                    key={key}
                                    className={cn(
                                        'flex items-center justify-between gap-3 p-3 rounded-xl border',
                                        present ? 'border-subtle bg-surface-sunken opacity-60' : 'border-default bg-surface-base',
                                    )}
                                >
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-[13px] font-medium text-text-primary truncate">{label}</span>
                                        <span className="font-mono text-[10.5px] text-text-tertiary">
                                            {meta.w}×{meta.h}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={present ? 'ghost' : 'secondary'}
                                        disabled={present}
                                        onClick={() => onAdd(key)}
                                        className="flex-none"
                                    >
                                        {present
                                            ? t('Dashboard:Catalog:Added', 'Ekli')
                                            : t('Dashboard:Catalog:Add', 'Ekle')}
                                    </Button>
                                </li>
                            );
                        })}
                        {entries.length === 0 && (
                            <li className="text-[12.5px] text-text-tertiary py-4 text-center">
                                {t('Dashboard:Catalog:NoMatch', 'Eşleşen kart yok.')}
                            </li>
                        )}
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export { CardCatalog };
