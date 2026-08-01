import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

/**
 * Dialog — merkezi modal. Sheet.jsx'in kardeşi (o kenardan açılan panel için).
 * Radix Dialog primitive'i üzerinde: focus trap, ESC, aria-modal, portal bedava.
 *
 * Boyutlandırma sabit px DEĞİL:
 *   desktop   → w: min(92vw, 1400px)   ← .apya-page max-width'iyle aynı tavan
 *               h: min(88dvh, 940px)
 *   fullscreen→ viewport - 2*space-4   ← "büyüt" aksiyonu
 *   mobile    → 100vw × 100dvh, köşesiz, safe-area padding'li
 *
 * dvh kullanımı bilinçli: mobil adres çubuğu açılıp kapanırken vh zıplar.
 */

function Dialog({ open, onOpenChange, children }) {
    return (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </RadixDialog.Root>
    );
}

const DialogContent = React.forwardRef(function DialogContent(
    { title, description, fullscreen = false, className, children, onOpenChange, ...props },
    ref,
) {
    const sizeClass = fullscreen
        ? cn(
            'w-[calc(100vw-2*var(--apya-space-4))]',
            'h-[calc(100dvh-2*var(--apya-space-4))]',
        )
        : cn(
            'w-[min(92vw,1400px)]',
            'h-[min(88dvh,940px)]',
            'tablet:min-h-[520px]',
        );

    return (
        <RadixDialog.Portal>
            <RadixDialog.Overlay
                className={cn(
                    'fixed inset-0 z-modal-backdrop',
                    'bg-surface-overlay backdrop-blur-sm',
                    'animate-overlay-fade',
                )}
            />
            <RadixDialog.Content
                ref={ref}
                className={cn(
                    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-modal',
                    'bg-surface-base text-text-primary',
                    'border border-default rounded-[var(--apya-radius-xl)] shadow-xl',
                    'flex flex-col overflow-hidden',
                    'focus-visible:outline-none',
                    'animate-dialog-in',
                    sizeClass,
                    /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
                       iOS home indicator'ın altında kalmaması için padding. */
                    'mobile:w-screen mobile:h-[100dvh] mobile:max-w-none',
                    'mobile:left-0 mobile:top-0 mobile:translate-x-0 mobile:translate-y-0',
                    'mobile:rounded-none mobile:border-0',
                    'mobile:pb-[env(safe-area-inset-bottom)]',
                    className,
                )}
                {...props}
            >
                <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
                {description
                    ? <RadixDialog.Description className="sr-only">{description}</RadixDialog.Description>
                    : null}
                {children}
            </RadixDialog.Content>
        </RadixDialog.Portal>
    );
});

const DialogClose = RadixDialog.Close;

Dialog.Content = DialogContent;
Dialog.Close = DialogClose;

export { Dialog, DialogContent, DialogClose };
