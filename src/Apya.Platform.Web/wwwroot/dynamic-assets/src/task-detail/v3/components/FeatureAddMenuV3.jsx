import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { dialogPortalContainer } from '../../../lib/dom/dialogPortalContainer';

/* Popover.Root'a `modal` ve portal kabı olarak dialogPortalContainer ŞART —
   gerekçeler TaskDetailHeaderV3 üstündeki not ve lib/dom/dialogPortalContainer. */
const MENU_CLS =
    'z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast ' +
    'max-h-[var(--radix-popover-content-available-height)] overflow-y-auto';

/**
 * "＋ Özellik ekle" DÜZ LİSTE menüsü — FeaturePickerV3 modalının yerini aldı
 * (birleşik sekme sistemi: /Tasks ve Proje Detayı'ndaki ＋ menüsüyle aynı model).
 *
 * `children` tetikleyicidir (Popover.Trigger asChild): sekme çubuğundaki ＋,
 * sol raydaki "Özellik ekle" ve boş durumlardaki CTA aynı menüyü kendi
 * yerlerinde açar. Ekli özellik ✓ ile soluk listelenir; tıklama ekli olana
 * GEÇER, ekli olmayanı EKLER + geçer (FeaturePickerV3 davranışı korunur).
 */
export function FeatureAddMenuV3({ entries = [], onPick, children }) {
    /* Portal kabı için modal içinde bir DOM düğümü gerekiyor; ref ilk render'da
       undefined kalır diye state (bkz. TaskDetailHeaderV3'teki aynı desen). */
    const [rootEl, setRootEl] = useState(null);
    const portalContainer = dialogPortalContainer(rootEl);

    return (
        <span ref={setRootEl} className="contents">
            <Popover.Root modal>
                <Popover.Trigger asChild>{children}</Popover.Trigger>
                <Popover.Portal container={portalContainer}>
                    <Popover.Content sideOffset={6} align="start" collisionPadding={12} className={MENU_CLS}>
                        <div className="px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary">
                            Özellik ekle
                        </div>
                        {entries.map((f) => (
                            <Popover.Close asChild key={f.code}>
                                <button
                                    type="button"
                                    onClick={() => onPick?.(f.code, f.isAssigned)}
                                    className={[
                                        'flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px]',
                                        'text-[12.5px] font-semibold text-left cursor-pointer',
                                        f.isAssigned
                                            ? 'text-text-tertiary hover:bg-surface-hover'
                                            : 'text-text-primary hover:bg-surface-hover',
                                    ].join(' ')}
                                >
                                    <i className={`fa-solid ${f.icon} text-[12px] w-[15px] opacity-85`} aria-hidden="true" />
                                    <span className="flex-1 truncate">{f.title}</span>
                                    {f.isAssigned && (
                                        <span className="shrink-0 text-[10px] font-extrabold text-primary">✓ açık</span>
                                    )}
                                </button>
                            </Popover.Close>
                        ))}
                        {entries.length === 0 && (
                            <div className="px-[9px] py-[7px] text-[11.5px] text-text-tertiary">
                                Eklenecek başka özellik yok.
                            </div>
                        )}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </span>
    );
}
