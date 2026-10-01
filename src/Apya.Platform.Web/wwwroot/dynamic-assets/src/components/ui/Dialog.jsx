import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import { OpenerContext, useOpenerRef, restoreOpenerFocus } from './openerFocus';

/**
 * Dialog — merkezi modal. Sheet.jsx'in kardeşi (o kenardan açılan panel için).
 * Radix Dialog primitive'i üzerinde: focus trap, ESC, aria-modal, portal bedava.
 *
 * Boyutlandırma sabit px DEĞİL:
 *   desktop   → w: min(92vw, 1400px)   ← .apya-page max-width'iyle aynı tavan
 *               h: min(88svh, 940px)
 *   fullscreen→ viewport - 2*space-4   ← "büyüt" aksiyonu
 *   mobile    → 100vw × 100svh, köşesiz, safe-area padding'li
 *   compact   → size="compact": içeriğe göre boylanan küçük pencere (onay, kısa form).
 *               Genişlik max-w-md (çağıran className ile ezer), yükseklik içerik kadar,
 *               taşarsa kendi içinde kayar. Telefonda da 16 px boşluklu KART kalır:
 *               mobile:* tam ekran sınıfları basılmaz. fullscreen verilirse o kazanır.
 *
 * Başlık: `title` özelliği sr-only başlık basar. Görünür başlık için <DialogTitle>
 * (açıklama için <DialogDescription>) kullanılır — aynı metin iki kez okunmaz.
 *
 * Odak: kapanışta odak pencereyi açan öğeye döner (openerFocus.js). Çağıran
 * onCloseAutoFocus'ta preventDefault ederse kendi hedefi geçerli olur.
 *
 * BİRİM svh, dvh DEĞİL: panel `position:fixed` olduğu için sayfa hiç kaydırılmaz,
 * dolayısıyla mobil tarayıcı çubukları hiç gizlenmez — geçerli viewport DAİMA
 * "small viewport"tur. dvh ile panel çubukların altına taşıp footer'ı (Kaydet /
 * Vazgeç) yarım bırakıyordu. svh tanımı gereği en küçük değer olduğu için taşamaz.
 * (vh büsbütün yanlış: adres çubuğu açıkken bile lvh'yi verir.)
 */

function Dialog({ open, onOpenChange, children }) {
    const openerRef = useOpenerRef(open);
    return (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
            <OpenerContext.Provider value={openerRef}>
                {children}
            </OpenerContext.Provider>
        </RadixDialog.Root>
    );
}

const DialogContent = React.forwardRef(function DialogContent(
    {
        title, description, size = 'default', fullscreen = false, className, children,
        onOpenChange, onCloseAutoFocus, ...props
    },
    ref,
) {
    const openerRef = React.useContext(OpenerContext);
    const compact = size === 'compact' && !fullscreen;

    const sizeClass = fullscreen
        ? cn(
            'w-[calc(100vw-2*var(--apya-space-4))]',
            'h-[calc(100svh-2*var(--apya-space-4))]',
        )
        : compact
        ? cn(
            'w-[calc(100vw-2*var(--apya-space-4))] max-w-md',
            'h-auto max-h-[calc(100svh-2*var(--apya-space-4))]',
            'overflow-y-auto overflow-x-hidden',
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
                        'flex flex-col',
                        !compact && 'overflow-hidden',
                        'focus-visible:outline-none',
                        'animate-dialog-in',
                        sizeClass,
                        /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
                           iOS home indicator'ın altında kalmaması için padding.
                           compact'ta basılmaz: küçük pencere telefonda da kart kalır. */
                        !compact && 'mobile:w-screen mobile:h-[100svh] mobile:max-w-none',
                        !compact && 'mobile:rounded-none mobile:border-0',
                        !compact && 'mobile:pb-[env(safe-area-inset-bottom)]',
                        className,
                    )}
                    {...props}
                    onCloseAutoFocus={(e) => {
                        onCloseAutoFocus?.(e);
                        restoreOpenerFocus(e, openerRef);
                    }}
                >
                    {/* title verilmezse boş başlık BASILMAZ: görünür başlık <DialogTitle> ile gelir. */}
                    {title != null
                        ? <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
                        : null}
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
/* Görünür başlık / açıklama: pencereye aria-labelledby / aria-describedby ile bağlanır.
   İkisi de asChild destekler (Bootstrap sınıflı sayfada div biçimi bozulmadan). */
const DialogTitle = RadixDialog.Title;
const DialogDescription = RadixDialog.Description;

Dialog.Content = DialogContent;
Dialog.Close = DialogClose;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

export { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription };
