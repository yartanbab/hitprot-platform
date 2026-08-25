import React from 'react';
import * as Popover from '@radix-ui/react-popover';

const OPTIONS = [
    { value: false, icon: 'fa-globe', title: 'Herkese açık', desc: 'Görevi, erişimi olan tüm ekip üyeleri görebilir.' },
    { value: true, icon: 'fa-lock', title: 'Özel görev', desc: 'Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir.' },
];

/** Görev görünürlüğü — gerçek `isPrivate` alanına bağlı. Değişiklik forma yansır, "Kaydet" ile
 *  kalıcılaşır. Not: kişi-bazlı yetkilendirme (ACL) ayrı bir backend işi (Faz 2). */
export function TaskPrivacyDialogV3({ isPrivate = false, onChange = () => {} }) {
    const priv = Boolean(isPrivate);
    return (
        <Popover.Root modal>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm"
                >
                    <i className={`fa-solid ${priv ? 'fa-lock' : 'fa-globe'} text-[11px] text-text-tertiary`} />
                    <span>{priv ? 'Özel görev' : 'Herkese açık'}</span>
                    <i className="fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={8}
                    align="end"
                    className="z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95"
                >
                    <div className="flex items-center gap-2 border-b border-subtle pb-3 mb-3">
                        <i className="fa-solid fa-shield-halved text-primary text-base" />
                        <h3 className="text-[14px] font-bold text-text-primary">Görünürlük</h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        {OPTIONS.map((o) => {
                            const active = priv === o.value;
                            return (
                                <button
                                    key={String(o.value)}
                                    type="button"
                                    onClick={() => onChange(o.value)}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                                        active ? 'border-primary bg-primary-subtle/40' : 'border-subtle hover:bg-surface-hover'
                                    }`}
                                >
                                    <i className={`fa-solid ${o.icon} text-base mt-0.5 ${active ? 'text-primary' : 'text-text-tertiary'}`} />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[13px] font-semibold text-text-primary">{o.title}</h4>
                                            {active && <i className="fa-solid fa-check text-xs text-primary" />}
                                        </div>
                                        <p className="text-[12px] text-text-tertiary mt-0.5">{o.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-[11px] text-text-tertiary mt-3">Değişiklik “Kaydet” ile uygulanır.</p>
                    <Popover.Arrow className="fill-surface-base stroke-subtle" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
