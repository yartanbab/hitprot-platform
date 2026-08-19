/*
 * Hesap bağlama akışının dönüş bildirimi.
 *
 * Entegrasyon kartları senkron drawer'ına taşındığı için (Faz 5) bu dosyada
 * kart DOM'unu güncelleyen kod KALMADI — hesap listesi artık island'da
 * (/api/app/calendar/sync-settings) yaşıyor. Geriye yalnız OAuth callback'inin
 * "?msg=success|error" sonucunu bildirmek kaldı: kullanıcı Google'dan dönünce
 * bağlantının olup olmadığını görmeden bırakılmasın.
 */
$(function () {
    var msg = new URLSearchParams(window.location.search).get('msg');
    if (!msg) { return; }

    if (msg === 'success') { abp.notify.success('Takvim başarıyla bağlandı!'); }
    if (msg === 'error')   { abp.notify.error('Takvim bağlantısı başarısız oldu. Lütfen tekrar deneyin.'); }

    window.history.replaceState({}, document.title, window.location.pathname);
});
