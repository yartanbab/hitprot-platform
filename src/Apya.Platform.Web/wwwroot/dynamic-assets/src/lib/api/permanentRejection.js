/**
 * Çevrimdışı kuyruklar (masraf, takvim) için: sunucunun yanıtı kaydı KALICI olarak
 * mı reddetti, yoksa aynı kayıt sonra yeniden denenmeli mi?
 *
 * Kalıcı ret (kayıt kuyruktan çıkarılır): doğrulama (ABP zarfıyla 400), yetki (403),
 * kayıt yok (404), çakışma (409) gibi, yeniden denemekle değişmeyecek yanıtlar.
 *
 * Geçici (kayıt kuyrukta KALIR, sonra yeniden denenir):
 *  - 401: oturum düşmüş. Kullanıcı yeniden giriş yapınca aynı kayıt geçer.
 *  - Gövdesiz 400: ABP zarfı yok (kod, doğrulama ya da ayrıntı taşımıyor). Bu, bayat
 *    güvenlik belirteci (antiforgery) ya da oturum değişimidir; sayfa yenilenince geçer.
 *  - 408 / 429: zaman aşımı ve hız sınırı.
 *
 * Bu ayrım yokken her 4xx kalıcı sayılıyordu: oturum düşmüşken ya da belirteç
 * bayatken kuyruk boşaltılınca kullanıcının çevrimdışı kaydettiği her şey siliniyordu.
 */
export function isPermanentRejection(err) {
    const status = err?.status;
    if (!(status >= 400 && status < 500)) return false;
    if (status === 401 || status === 408 || status === 429) return false;
    if (status === 400 && !err.code && !err.validationErrors && !err.details) return false;
    return true;
}
