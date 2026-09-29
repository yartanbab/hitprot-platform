/**
 * ABP hata kanalı — React köprüsü. jQuery tarafı ve kuralın tamamı:
 * wwwroot/js/ajax-error-detail.js (window.apya.ajaxErrors).
 *
 * - İşlem (kaydet/sil) hatası: ABP penceresi tek kanal. Pencere ya da merkezi oturum
 *   penceresi zaten gösterildiyse çağıran ikinci bildirim basmaz → notifyError / wasShown.
 * - Yükleme hatası: isteğe { abpHandleError: false } verilir (ABP proxy'sinin son
 *   parametresi); sayfa içi metin errorMessage(err, yedek). null = merkezi oturum
 *   penceresi açık, ayrıntı metni basılmaz. 401 ve oturum kaybı abpHandleError'dan
 *   bağımsız merkezi pencereye gider (jQuery prefilter kancası; fetch için httpClient).
 * - errorMessage() DÜZ METİN döner (sunucunun cümlesi olabilir): JSX metni olarak ya da
 *   textContent ile basılır, HTML'e kaçışsız konmaz. notifyError toast için kaçışlar.
 *
 * Köprü yoksa (test, köprü yüklenmemiş) eski davranış: err.message || yedek gösterilir.
 */

const bridge = () => (typeof window === 'undefined' ? undefined : window.apya?.ajaxErrors);

/** ABP hata penceresi ya da merkezi oturum penceresi bu hatayı gösterdi mi? */
export function wasShown(err) {
    if (err?.apyaShown || err?.apyaCentral) return true;
    return Boolean(bridge()?.wasShown?.(err));
}

/** Kullanıcıya gösterilecek tek metin; null = merkezi pencere gösteriyor, bir şey basma. */
export function errorMessage(err, fallback) {
    const b = bridge();
    if (b?.message) return b.message(err, fallback);
    return err?.message || fallback || null;
}

/** İşlem hatası bildirimi: pencere zaten gösterildiyse susar. */
export function notifyError(err, fallback) {
    if (wasShown(err)) return;
    const message = errorMessage(err, fallback);
    /* ABP toast'ı metni innerHTML ile basar: sunucunun düz metni kaçışlanır. */
    const htmlEscape = window?.abp?.utils?.htmlEscape;
    if (message) window?.abp?.notify?.error?.(htmlEscape ? htmlEscape(message) : message);
}
