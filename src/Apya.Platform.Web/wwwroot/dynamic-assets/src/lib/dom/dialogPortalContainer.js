/**
 * Radix Popover içeriğinin portal edileceği kabı bulur.
 *
 * NEDEN: Popover.Portal varsayılan olarak `document.body`'ye basar. İçerik modal
 * bir Radix Dialog'un İÇİNDEN açıldığında bu, Dialog'un `FocusScope trapped`
 * kabının DIŞINA düşmek demek. Trap, popover içindeki bir öğeye verilen odağı
 * "dışarı kaçtı" sayıp anında geri çeker; `element.focus()` senkron olarak geri
 * alınır. Sonuç: popover içindeki arama kutuları hiç odak alamaz, kullanıcının
 * yazdığı metin modalda odakta kalan öğeye gider.
 *
 * `modal` prop'u bunu ÇÖZMEZ — o yalnız popover'ın focusOutside ile kapanmasını
 * engeller (PopoverContentModal `onFocusOutside`'ı preventDefault eder).
 *
 * Popover'ı Dialog'un içine basınca trap içeriği "kendi kabımda" sayar ve odağa
 * dokunmaz. Konumlandırma etkilenmez: Radix'in popper sarmalayıcısı
 * `position: fixed` ve DialogContent kırpan bir kap oluşturmuyor.
 *
 * @param {Element | null | undefined} node
 *   Modalın içinde yer alan, bileşenin sahip olduğu herhangi bir DOM düğümü.
 * @returns {Element | undefined}
 *   Bulunan dialog; modal bağlam yoksa (görev detayının sayfa modu gibi)
 *   `undefined` — bu durumda Radix varsayılan davranışıyla body'ye basar.
 */
export function dialogPortalContainer(node) {
    return node?.closest('[role="dialog"]') ?? undefined;
}
