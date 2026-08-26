// KOTA DUVARI → YÜKSELTME YÖNLENDİRMESİ
//
// Paket kotası dolduğunda sunucu BusinessException atıyor ("en fazla N proje…, paketinizi
// yükseltin") ve ABP bunu düz bir hata kutusunda gösteriyordu: metin yükseltmeyi söylüyor
// ama kullanıcının gidebileceği bir yer yok. Kotanın dolduğu an, kullanıcının tam da
// yapmak istediği işi yapamadığı andır — yönlendirme için en değerli nokta burasıdır.
//
// Yöntem: abp.ajax.showError override'ı. Yalnız iki kota koduna dokunur, geri kalan TÜM
// hatalar ABP'nin kendi kutusuna gider — davranış değişmez. Ek popup AÇMAZ, ABP'ninkinin
// YERİNE geçer.
(function () {
    // Sunucudaki hata kodları. Tek kaynak: PackageQuotaErrorCodes (Domain.Shared);
    // ayrışmayı QuotaUpsell_Tests ölçüyor.
    var QUOTA_ERROR_CODES = {
        'Platform:Error:MaxProjectsReached': true,
        'Platform:Error:MaxUsersReached': true
    };

    var SUBSCRIPTION_URL = '/Subscription';

    function isQuotaError(error) {
        return !!(error && error.code && QUOTA_ERROR_CODES[error.code]);
    }

    // "Paketim" ekranı TenantSettings iznine bağlı. İzni olmayan kullanıcıyı oraya
    // göndermek 403'e sürüklerdi; ona yalnız kime başvuracağı söylenir.
    function canViewSubscription() {
        try {
            return !!(abp.auth && abp.auth.isGranted && abp.auth.isGranted('Platform.TenantSettings'));
        } catch (e) {
            return false;
        }
    }

    // Testten erişilebilir yüzey. Modal'ın kendisi jQuery + Bootstrap istiyor (repoda
    // jQuery devDependency yok) — karar mantığı burada, DOM canlı QA ile doğrulanır.
    window.apya = window.apya || {};
    window.apya.quotaUpsell = {
        isQuotaError: isQuotaError,
        canViewSubscription: canViewSubscription,
        subscriptionUrl: SUBSCRIPTION_URL
    };

    if (typeof abp === 'undefined' || !abp.ajax || !abp.ajax.showError) {
        return;
    }

    var originalShowError = abp.ajax.showError;

    abp.ajax.showError = function (error) {
        if (!isQuotaError(error)) {
            return originalShowError.apply(this, arguments);
        }

        // Bootstrap/jQuery beklenmedik şekilde yoksa sessiz kalma — ABP'nin kutusuna dön.
        if (typeof $ === 'undefined' || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
            return originalShowError.apply(this, arguments);
        }

        showUpsell(error.message || '');
        // ABP dönen değeri yalnız zincirlemek için kullanıyor; modal kendi yaşam
        // döngüsünü yönetiyor.
        return null;
    };

    function showUpsell(message) {
        var showLink = canViewSubscription();

        // Modal her seferinde yeniden kurulur ve kapanınca DOM'dan silinir: ekranda
        // birikmemesi ve bayat metin göstermemesi için.
        var $modal = $(
            '<div class="modal fade" tabindex="-1" role="dialog"' +
            '     aria-labelledby="ApyaQuotaUpsellTitle">' +
            '  <div class="modal-dialog modal-dialog-centered" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h5 class="modal-title" id="ApyaQuotaUpsellTitle">' +
            '          <i class="fa fa-arrow-up-right-dots text-primary me-2"></i>Paket sınırınıza ulaştınız' +
            '        </h5>' +
            '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '        <p class="mb-2 js-quota-upsell-message"></p>' +
            '        <p class="text-muted small mb-0">' +
            (showLink
                ? 'Üst paketin neler getirdiğini "Paketim" ekranından görebilirsiniz. Mevcut verileriniz etkilenmez.'
                : 'Paket yükseltmesi için kurumunuzun sistem yöneticisiyle görüşün.') +
            '        </p>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Kapat</button>' +
            (showLink
                ? '        <a class="btn btn-primary" href="' + SUBSCRIPTION_URL + '">' +
                  '          <i class="fa fa-gem me-1"></i>Paketimi görüntüle</a>'
                : '') +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>');

        // Metin .text() ile basılır: sunucu mesajı HTML olarak yorumlanmamalı.
        $modal.find('.js-quota-upsell-message').text(message);

        // Düğüm doğrudan body'ye takılır. Bir araç çubuğunun/kartın içine basılırsa
        // yığın bağlamı yüzünden backdrop'un ALTINDA kalır.
        $modal.appendTo(document.body);
        $modal.on('hidden.bs.modal', function () { $modal.remove(); });

        bootstrap.Modal.getOrCreateInstance($modal[0]).show();
    }
})();
