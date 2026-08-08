import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '../../../components/ui';

export function TaskPrivacyDialogV3() {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm">
                    <i className="fa-solid fa-lock text-[11px] text-text-tertiary" />
                    <span>Sınırlı erişim</span>
                    <i className="fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" />
                </div>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={8}
                    align="end"
                    className="z-50 w-[620px] rounded-2xl border border-subtle bg-surface-base p-6 shadow-float animate-in fade-in-50 zoom-in-95"
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-subtle pb-3">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-shield-halved text-primary text-base" />
                                <h3 className="text-[15px] font-bold text-text-primary">GİZLİLİK & YETKİ GÖSTERİMİ</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-start">
                            {/* Sol: Gizlilik Seviyeleri */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-sunken border border-subtle">
                                    <i className="fa-solid fa-lock text-primary text-base mt-0.5" />
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-text-primary">Sınırlı erişim</h4>
                                        <p className="text-[12px] text-text-tertiary mt-0.5">
                                            Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl border border-subtle hover:bg-surface-hover transition-colors">
                                    <i className="fa-solid fa-eye-slash text-text-tertiary text-base mt-0.5" />
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-text-primary">Özel görev</h4>
                                        <p className="text-[12px] text-text-tertiary mt-0.5">
                                            Bu görev gizli olarak işaretlenmiştir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl border border-subtle hover:bg-surface-hover transition-colors">
                                    <i className="fa-solid fa-shield-cat text-text-tertiary text-base mt-0.5" />
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-text-primary">Hassas içerik</h4>
                                        <p className="text-[12px] text-text-tertiary mt-0.5">
                                            Bu görev hassas bilgiler içermektedir.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sağ: Yetkili Kullanıcılar & Yönetim */}
                            <div className="p-4 rounded-xl border border-subtle bg-surface-sunken flex flex-col gap-4">
                                <div>
                                    <h4 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
                                        Yetkili Kullanıcılar
                                    </h4>
                                    <div className="flex items-center gap-1.5">
                                        <img src="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" alt="Yakup" className="h-7 w-7 rounded-full border-2 border-surface-base" />
                                        <img src="https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64" alt="Elif" className="h-7 w-7 rounded-full border-2 border-surface-base" />
                                        <img src="https://ui-avatars.com/api/?name=Mehmet+K&background=10b981&color=fff&size=64" alt="Mehmet" className="h-7 w-7 rounded-full border-2 border-surface-base" />
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-base border border-subtle text-[11px] font-bold text-text-secondary">
                                            +5
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5">
                                        Erişim Düzeyi
                                    </h4>
                                    <select className="w-full h-9 px-3 rounded-lg border border-subtle bg-surface-base text-[13px] font-medium text-text-primary focus:outline-none focus:border-primary">
                                        <option value="limited">Sınırlı</option>
                                        <option value="team">Tüm Ekip</option>
                                        <option value="public">Herkes</option>
                                    </select>
                                </div>

                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="w-full mt-2 font-semibold text-primary border-primary/30 hover:bg-primary/5"
                                >
                                    Yetkileri Yönet
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Popover.Arrow className="fill-surface-base stroke-subtle" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
