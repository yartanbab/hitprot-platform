/* =============================================================================
   APYA HINT — Bilgi ipucu (ⓘ) altyapısı
   -----------------------------------------------------------------------------
   İlk kullanıcıya buton/işlev açıklaması: ikonun üzerine gelince (ya da Tab ile
   odaklanınca) küçük bilgi kutusu açılır.

   • Görsel  : .apya-hint            → apya-shell.css "MICRO COMPONENTS"
   • Kutu    : Bootstrap tooltip     → apya-theme-bridge.css --bs-tooltip-* köprüsü
   • Razor   : <apya-hint text="…" /> → HintTagHelper
   • JS      : apya.hint('…')        → HTML string döner (grid/kart render'ı için)

   TEK init: tooltip body'ye DELEGE edilir (selector opsiyonu). Sayfa başına
   init yok; JS ile sonradan render edilen içerik (kart ızgaraları, DataTables
   satırları, React island'lar) de otomatik kapsanır.

   Seçici bilerek [data-bs-toggle="tooltip"] — mevcut ham title="…" kullanımları
   etkilenmez, onlar tarayıcı tooltip'i olarak kalır.

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles).
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.hint) { return; }

    function init() {
        if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) { return; }
        new bootstrap.Tooltip(document.body, {
            selector: '[data-bs-toggle="tooltip"]',
            // container:body → kart/tablo gibi overflow:hidden kapsayıcılarda kırpılmaz.
            container: 'body',
            // html:false (varsayılan) korunur — ipucu metni her zaman düz metin.
            trigger: 'hover focus'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    apya.hint = function (text, placement) {
        return '<span class="apya-hint" data-bs-toggle="tooltip" data-bs-placement="'
            + escapeHtml(placement || 'top') + '" data-bs-title="' + escapeHtml(text)
            + '" tabindex="0" aria-label="Bilgi">'
            + '<i class="fa fa-circle-info" aria-hidden="true"></i></span>';
    };
})();
