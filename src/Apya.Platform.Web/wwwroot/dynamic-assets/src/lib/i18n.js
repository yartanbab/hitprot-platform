/**
 * i18n — ABP localization köprüsü (React island'lar için).
 *
 * Razor tarafı zaten `abp.localization.getResource('Platform')` kullanıyor
 * (bkz. Pages/Invoices/CreateModal.cshtml). Island'lar aynı sayfa bağlamında
 * çalıştığı için aynı global API erişilebilir — ayrı bir i18n kütüphanesi
 * EKLENMEZ. Tek çeviri kaynağı: Domain.Shared/Localization/Platform/*.json.
 *
 * Fallback zinciri:
 *   1) ABP resource'tan anahtar çözülür
 *   2) çözülemezse (abp henüz yüklenmemiş veya anahtar yok) `fallback` döner
 *
 * Bu sayede kademeli geçişte hiçbir ekran boş string göstermez: anahtar
 * json'a eklenmeden önce de bileşen fallback metniyle çalışır.
 */

let _resource = null;

function resource() {
    if (_resource) return _resource;
    const getResource = window?.abp?.localization?.getResource;
    if (typeof getResource === 'function') {
        // Bulunamazsa cache'leme — abp island'dan sonra yüklenmişse
        // sonraki çağrıda tekrar denensin.
        _resource = getResource('Platform');
    }
    return _resource;
}

/**
 * @param {string} key      Platform resource anahtarı, ör. 'Widget:CashFlow:Title'
 * @param {string} fallback Anahtar çözülemezse gösterilecek metin (Türkçe)
 * @param {...*}   args     {0}, {1} … yer tutucu değerleri
 */
export function t(key, fallback, ...args) {
    const r = resource();
    const value = r ? r(key, ...args) : null;
    // ABP anahtar bulamazsa anahtarın kendisini döner → fallback'e düş.
    if (value != null && value !== key) return value;
    return format(fallback ?? key, args);
}

/* {0}, {1} … doldurma — yalnız fallback yolu için (ABP kendi yolunda zaten yapar). */
function format(text, args) {
    if (!args.length) return text;
    return String(text).replace(/\{(\d+)\}/g, (m, i) => args[i] ?? m);
}

/**
 * Aktif kültür kodu — Intl.* (RelativeTimeFormat, NumberFormat, DateTimeFormat)
 * için. Sabit 'tr-TR' yazmak dil değişince biçimlendirmeyi Türkçe bırakıyordu.
 */
export function currentLocale() {
    return window?.abp?.localization?.currentCulture?.name
        || document?.documentElement?.lang
        || 'tr-TR';
}
