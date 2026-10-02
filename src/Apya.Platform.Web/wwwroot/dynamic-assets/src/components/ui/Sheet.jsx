import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import { OpenerContext, useOpenerRef, restoreOpenerFocus } from './openerFocus';

/**
 * Sheet — adaptive: mobile'da bottom-sheet, tablet/desktop'ta side drawer.
 * Radix Dialog primitive üzerinde; a11y (focus trap, escape, aria-modal) free.
 *
 * `side`: 'bottom' (mobile default) | 'right' (desktop default)
 *   prop verilmezse responsive: mobile=bottom, ≥tablet=right
 *
 * Drag-to-dismiss yok (vaul dep'inden kaçındık). Backdrop tap + escape ile kapanır.
 *
 * Başlık: `title` / `description` sr-only basılır; görünür olanlar için <SheetTitle> /
 * <SheetDescription>. Kapanışta odak paneli açan öğeye döner (openerFocus.js).
 */

function Sheet({ open, onOpenChange, children }) {
    const openerRef = useOpenerRef(open);
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <OpenerContext.Provider value={openerRef}>
                {children}
            </OpenerContext.Provider>
        </Dialog.Root>
    );
}

const SheetContent = React.forwardRef(function SheetContent(
    { side, className, children, title, description, onCloseAutoFocus, ...props },
    ref,
) {
    const openerRef = React.useContext(OpenerContext);
    const sideClass = side === 'bottom'
        ? 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom'
        : side === 'right'
            ? 'inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right'
            /* responsive default */
            : cn(
                'inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom',
                'tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto',
                'tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0',
                'tablet:animate-sheet-right',
            );

    return (
        <Dialog.Portal>
            <Dialog.Overlay className={cn(
                'fixed inset-0 z-modal-backdrop',
                'bg-surface-overlay backdrop-blur-sm',
                'animate-overlay-fade',
            )} />
            <Dialog.Content
                ref={ref}
                className={cn(
                    'fixed z-modal',
                    'bg-surface-base text-text-primary',
                    'border-default shadow-xl',
                    'flex flex-col',
                    'focus-visible:outline-none',
                    sideClass,
                    className,
                )}
                {...props}
                onCloseAutoFocus={(e) => {
                    onCloseAutoFocus?.(e);
                    restoreOpenerFocus(e, openerRef);
                }}
            >
                {/* Drag handle visual hint (mobile only). Sağ panelde basılmaz: telefonda
                    da kenardan açılır, alt panel tutamağı orada yanlış ipucu. */}
                {side !== 'right' && (
                    <div className="tablet:hidden flex justify-center pt-2 pb-1">
                        <div className="h-1 w-10 rounded-full bg-neutral-300" aria-hidden="true" />
                    </div>
                )}
                {title && (
                    <Dialog.Title className="sr-only">{title}</Dialog.Title>
                )}
                {description && (
                    <Dialog.Description className="sr-only">{description}</Dialog.Description>
                )}
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    );
});

const SheetTrigger = Dialog.Trigger;
const SheetClose   = Dialog.Close;
/* Görünür başlık / açıklama: panele aria-labelledby / aria-describedby ile bağlanır. */
const SheetTitle       = Dialog.Title;
const SheetDescription = Dialog.Description;

Sheet.Trigger = SheetTrigger;
Sheet.Close   = SheetClose;
Sheet.Content = SheetContent;
Sheet.Title       = SheetTitle;
Sheet.Description = SheetDescription;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
