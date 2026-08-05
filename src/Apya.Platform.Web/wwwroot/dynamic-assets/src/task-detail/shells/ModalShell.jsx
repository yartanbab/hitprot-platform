import React from 'react';
import { Dialog, DialogContent } from '../../components/ui';

/**
 * ModalShell — YALNIZ dış kabuk. İçeriği hiç bilmez.
 * Faz 5'te eklenecek PageShell aynı `children`'ı portal'sız/backdrop'suz render eder;
 * bu yüzden buraya görev-özel hiçbir şey koyma.
 *
 * Tek scroll konteyneri: grid-rows [header | içerik(1fr, scroll) | footer].
 * min-h-0 zorunlu — CSS grid çocukları varsayılan min-height:auto ile küçülmez,
 * o olmadan içerik footer'ı ekrandan taşırır.
 */
export function ModalShell({
    open, onRequestClose, fullscreen, title, header, footer, children,
}) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => { if (!next) onRequestClose(); }}
        >
            <DialogContent
                title={title}
                fullscreen={fullscreen}
                /* Backdrop tıklaması da dirty kontrolünden geçmeli: Radix'in
                   otomatik kapanmasını engelleyip kendi akışımıza yönlendiriyoruz. */
                onInteractOutside={(e) => { e.preventDefault(); onRequestClose(); }}
                onEscapeKeyDown={(e) => { e.preventDefault(); onRequestClose(); }}
            >
                <div className="grid h-full min-h-0 grid-rows-[auto_1fr_auto]">
                    {header}
                    <div className="min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]">
                        {children}
                    </div>
                    {footer}
                </div>
            </DialogContent>
        </Dialog>
    );
}
