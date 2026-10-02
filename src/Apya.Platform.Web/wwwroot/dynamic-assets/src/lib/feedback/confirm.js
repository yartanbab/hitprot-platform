/**
 * confirmAsync — React adalarının TEK onay girişi (CON-02).
 *
 * Pencerenin kendisi global demettedir: wwwroot/js/apya-confirm.js (apya.confirm).
 * Burası yalnız köprü (lib/api/abpErrors ↔ ajax-error-detail.js deseni); görünüm, odak,
 * yazarak onay ve oturum penceresi kuralları orada.
 *
 *   confirmAsync(options | 'mesaj') → Promise<boolean>   (asla reddetmez)
 *   options: { message, html?, title?, danger?, confirmText?, cancelText?, typeToConfirm? }
 *
 * Sıra: window.apya.confirm → yoksa abp.message.confirm → ikisi de yoksa false.
 * Tarayıcının yerel onay penceresine DÜŞÜLMEZ. Köprü yokken yazarak onay istenmişse
 * false döner: koruma düşürülmez.
 *
 * Hiçbir şey içe aktarmaz ve lib/feedback/index.js'ten dışa aktarılmaz: hafif adalara
 * (formlar, cari, yanıtlar, herkese açık form) ağır parça taşımaz. Çağıranlar doğrudan
 * '…/lib/feedback/confirm' yolunu içe aktarır.
 */
export function confirmAsync(options) {
    const o = typeof options === 'string' ? { message: options } : (options || {});
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (typeof window.apya?.confirm === 'function') {
        return Promise.resolve(window.apya.confirm(o)).then(Boolean, () => false);
    }
    if (typeof window.abp?.message?.confirm === 'function' && !o.typeToConfirm) {
        return new Promise((resolve) => window.abp.message.confirm(o.message, o.title || undefined, (r) => resolve(!!r)));
    }
    return Promise.resolve(false);
}
