import { createContext, useRef } from 'react';

/**
 * Dialog / Sheet odak iadesi. components/ui varilinden DIŞA AKTARILMAZ (iç yardımcı).
 *
 * Radix modal Dialog kapanışta odağı YALNIZ <Dialog.Trigger>'a verir. Depodaki bütün
 * kullanımlar denetimli (`open` özelliğiyle açılıyor, Trigger yok) → kapanışta odak
 * <body>'ye düşüyordu: klavye kullanıcısı sayfanın başına atılıyordu.
 */

export const OpenerContext = createContext(null);

/**
 * Pencereyi açan öğeyi (açılış anındaki document.activeElement) tutar.
 *
 * RENDER sırasında okunur, effect'te DEĞİL: içerik bağlanınca Radix odağı pencerenin içine
 * taşır, autoFocus'lu çocuk commit'te odak alır — ikisinden de önce okunmalı. Aynı render
 * iki kez çalışsa da (StrictMode) sonuç aynıdır.
 */
export function useOpenerRef(open) {
    const openerRef = useRef(null);
    const wasOpen = useRef(false);

    if (open && !wasOpen.current) {
        const active = document.activeElement;
        openerRef.current = active && active !== document.body ? active : null;
    }
    wasOpen.current = Boolean(open);

    return openerRef;
}

/**
 * Radix `onCloseAutoFocus` içinde çağrılır; odağı açan öğeye geri verir.
 * Dokunmadığı durumlar (sırayla):
 *   1. olay zaten engellenmiş          → çağıran kendi hedefini seçmiştir
 *   2. açan öğe yok / belgeden kalkmış → Radix'in kendi dalı (Trigger) çalışır
 *   3. odak <body>'de değil            → başka bir katman (yeni pencere, SweetAlert) ya da
 *                                        kullanıcı odağı almıştır; çalınmaz
 */
export function restoreOpenerFocus(event, openerRef) {
    if (event.defaultPrevented) return;

    const opener = openerRef?.current;
    if (!opener || !opener.isConnected) return;

    const active = document.activeElement;
    if (active && active !== document.body) return;

    event.preventDefault();
    opener.focus({ preventScroll: true });
}
