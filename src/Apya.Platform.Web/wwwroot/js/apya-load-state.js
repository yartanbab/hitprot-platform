/* =============================================================================
   APYA LOAD STATE — Razor/jQuery sayfalarında satır içi yükleme ve hata durumu
   -----------------------------------------------------------------------------
   $kutu.attr('aria-busy', 'true').html(apya.loadState.loadingHtml('Olay yükleniyor…'));
   $kutu.html(apya.loadState.errorHtml('Liste yüklenemedi.', 'js-liste-retry'));
   $(document).on('click', '.js-liste-retry', function () { ...yeniden yükle... });

   • Yarış koruması burada DEĞİL: apya.latest (apya-latest.js) ile birlikte kullanılır.
   • Görsel desen apya-shell.css .apya-console-state; React karşılığı components/ui
     + react-query. Başlık çağırandan gelir ve kaçışlanır.
   • Açıklama ve düğme metni Common:FetchError / Common:Retry anahtarlarından gelir;
     abp yoksa ya da anahtar bulunamazsa Türkçe varsayılana düşülür.
   • "Tekrar dene" düğmesine delege bağlama çağıranın işi (retryClass sabit bir sınıf adı).

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles): apya-latest.js'in
   hemen altında, sayfa betiklerinden ÖNCE.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (window.apya.loadState) { return; }

    function text(key, fallback) {
        if (typeof abp === 'undefined' || !abp.localization || !abp.localization.getResource) {
            return fallback;
        }
        var value = abp.localization.getResource('Platform')(key);
        // Anahtar bulunamazsa ABP anahtarın kendisini döndürür.
        return value && value !== key ? value : fallback;
    }

    // jQuery'siz: global demette jQuery'den bağımsız kalır, vitest de jQuery'siz koşar.
    function esc(s) {
        var div = document.createElement('div');
        div.textContent = s == null ? '' : String(s);
        return div.innerHTML;
    }

    function errorHtml(title, retryClass) {
        return '<div class="apya-console-state" role="alert">'
            + '<span class="apya-console-state-icon is-muted"><i class="fa fa-triangle-exclamation" aria-hidden="true"></i></span>'
            + '<strong>' + esc(title) + '</strong>'
            + '<p>' + esc(text('Common:FetchError', 'Veri alınırken bir hata oluştu.')) + '</p>'
            + '<span class="apya-console-state-actions">'
            + '<button type="button" class="btn btn-sm btn-outline-primary ' + retryClass + '">'
            + '<i class="fa fa-rotate-right me-1" aria-hidden="true"></i>' + esc(text('Common:Retry', 'Tekrar dene'))
            + '</button></span></div>';
    }

    // aria-busy'yi kapsayıcıya çağıran koyar.
    function loadingHtml(message) {
        return '<div class="apya-console-state" role="status">'
            + '<span class="apya-console-state-icon is-muted"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>'
            + '<p>' + esc(message) + '</p></div>';
    }

    window.apya.loadState = { errorHtml: errorHtml, loadingHtml: loadingHtml };
})();
