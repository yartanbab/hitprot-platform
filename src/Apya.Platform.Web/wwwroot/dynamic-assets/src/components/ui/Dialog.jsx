import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

/**
 * Dialog — merkezi modal. Sheet.jsx'in kardeşi (o kenardan açılan panel için).
 * Radix Dialog primitive'i üzerinde: focus trap, ESC, aria-modal, portal bedava.
 *
 * Boyutlandırma sabit px DEĞİL:
 *   desktop   → w: min(92vw, 1400px)   ← .apya-page max-width'iyle aynı tavan
 *               h: min(88svh, 940px)
 *   fullscreen→ viewport - 2*space-4   ← "büyüt" aksiyonu
 *   mobile    → 100vw × 100svh, köşesiz, safe-area padding'li
 *
 * BİRİM svh, dvh DEĞİL: panel `position:fixed` olduğu için sayfa hiç kaydırılmaz,
 * dolayısıyla mobil tarayıcı çubukları hiç gizlenmez — geçerli viewport DAİMA
 * "small viewport"tur. dvh ile panel çubukların altına taşıp footer'ı (Kaydet /
 * Vazgeç) yarım bırakıyordu. svh tanımı gereği en küçük değer olduğu için taşamaz.
 * (vh büsbütün yanlış: adres çubuğu açıkken bile lvh'yi verir.)
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
            'h-[calc(100svh-2*var(--apya-space-4))]',
        )
        : cn(
            'w-[min(92vw,1400px)]',
            'h-[min(88svh,940px)]',
            /* min-h VİEWPORT'A KISKAÇLANIR. Çıplak `min-h-[520px]` yatay telefonda
               (932×430 → genişlik 768'i aştığı için `tablet:` devrede) paneli 520px'e
               zorluyor, panel ortalandığı ve overflow-hidden olduğu için üstten VE
               alttan kırpılıyordu. Takvim sihirbazı bunu yerel olarak yamamıştı
               (SetupWizard.jsx `tablet:min-h-0`); kaynağı burası. */
            'tablet:min-h-[min(520px,88svh)]',
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
            {/* Ortalama flexbox ile yapılır, transform ile DEĞİL: transform hem
                konumlama (translate -50%) hem giriş animasyonu (dialogIn scale)
                için kullanılırsa ikisi çakışıyordu — animasyon transform'u BASTAN
                YAZIYOR, "both" fill-mode kalıcı olduğu için modal mobilde
                ekran dışında sabit kalıyordu. Wrapper pointer-events-none:
                backdrop tıklaması Overlay'e düşsün ki Radix'in onInteractOutside'ı
                (dirty-guard bunun üstünden kapanıyor) çalışmaya devam etsin. */}
            <div className="fixed inset-0 z-modal flex items-center justify-center pointer-events-none">
                <RadixDialog.Content
                    ref={ref}
                    className={cn(
                        /* relative: AlertShell (silme/kaydetmeden-çık onayı) "absolute
                           inset-0" ile bu paneli kaplıyor; positioning context olmazsa
                           en yakın "fixed" ata olan yukarıdaki wrapper'a atlar ve tüm
                           viewport'u kaplar. */
                        'relative pointer-events-auto',
                        'bg-surface-base text-text-primary',
                        'border border-default rounded-[var(--apya-radius-xl)] shadow-xl',
                        'flex flex-col overflow-hidden',
                        'focus-visible:outline-none',
                        'animate-dialog-in',
                        sizeClass,
                        /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
                           iOS home indicator'ın altında kalmaması için padding. */
                        'mobile:w-screen mobile:h-[100svh] mobile:max-w-none',
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
            </div>
        </RadixDialog.Portal>
    );
});

const DialogClose = RadixDialog.Close;

Dialog.Content = DialogContent;
Dialog.Close = DialogClose;

export { Dialog, DialogContent, DialogClose };
