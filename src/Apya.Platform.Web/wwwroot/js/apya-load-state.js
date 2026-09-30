/* =============================================================================
   APYA LOAD STATE — Razor/jQuery sayfalarında satır içi yükleme ve hata durumu
   -----------------------------------------------------------------------------
   $kutu.attr('aria-busy', 'true').html(apya.loadState.loadingHtml('Olay yükleniyor…'));
   Promise.resolve(servis.getList(girdi, { abpHandleError: false })).then(boya, function (err) {
       $kutu.html(apya.loadState.errorHtml(l('…:LoadFailed'), 'js-liste-retry', err));
   });
   $kutu.on('click', '.js-liste-retry', function () { $(this).prop('disabled', true); yukle(); });

   • Yarış koruması burada DEĞİL: apya.latest (apya-latest.js) ile birlikte kullanılır.
   • Görsel desen apya-shell.css .apya-console-state; React karşılığı components/ui
     EmptyState (variant="error"). Başlık çağırandan gelir ve kaçışlanır.
   • errorHtml(başlık, retryClass, hata?) — hata verilirse açıklama G1 kanalından:
     apya.ajaxErrors.message(hata, Common:FetchError). null dönerse (merkezi oturum
     penceresi zaten açık) açıklama satırı basılmaz. Hata verilmezse Common:FetchError.
     Yükleme isteği { abpHandleError: false } taşır: nedeni ABP penceresi değil kart söyler.
   • Düğme metni Common:Retry ("Tekrar dene"); abp yoksa ya da anahtar bulunamazsa Türkçe
     varsayılana düşülür. Kanonik düğme: btn-outline-primary + fa-rotate-right.
   • "Tekrar dene" düğmesine delege bağlama çağıranın işi (retryClass sabit bir sınıf adı).
     İstisna: DataTables kartı (failTable) — onun düğmesini bu dosya bağlar.
   • notFoundHtml(başlık?, açıklama?, geriHref?, geriMetni?) — kayıt yok (404): "Tekrar dene"
     anlamsız, yerine isteğe bağlı geri bağlantısı. Boş başlık/açıklama → ErrorPage:RecordNotFound:*
     (hata sayfasıyla aynı metin). geriHref yalnız uygulama içi yol ("/x"; "//" ve "/\" değil).
     $kutu.html(apya.loadState.notFoundHtml(l('…:NotFound'), null, '/Liste', l('…:Back')));

   DataTables (abp.libs.datatables.createAjax sarmalayıcısı çağırır, apya-latest.js):
   • failTable(settings, callback, hata?) — DataTables'a boş yanıt verir (işleniyor ve
     "Yükleniyor…" kapanır) ve boş hücreye hata kartını basar: başlık tablonun
     data-load-failed özniteliğinden (ör. "Görevler yüklenemedi."), yoksa "Liste yüklenemedi.".
     Kart settings.json'daki işarete bağlıdır: bir sonraki başarılı yanıt onu kendiliğinden
     siler. Kart dururken bilgi satırı ("0 kayıttan 0 ile 0 arası…") boşaltılır.
   • Kartın "Tekrar dene"si aria-disabled + aria-busy + dönen ikonla meşgul olur (disabled
     DEĞİL: Chromium odaklı düğme disabled olunca odağı body'ye atar — React RetryButton
     emsali). Odaklıyken basıldıysa sonraki çizimde odak yeni kartın düğmesine (yine düştüyse)
     ya da tablonun kendisine (tabindex=-1; geldiyse) verilir.
   • tableFailed(api | settings) — son yanıt yükleme hatası mı? Sayfanın draw işleyicisi
     sahte "0 kayıt" sayacı ve "henüz kayıt yok" boş durumu basmamak için sorar.

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles): apya-latest.js'in
   hemen altında, sayfa betiklerinden ÖNCE. Çekirdek jQuery'siz; DataTables yardımcıları
   çalışırken window.jQuery kullanır.
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

    // Açıklama G1 hata kanalından (ajax-error-detail.js): ağ / sunucu / sunucunun kendi
    // cümlesi. null = merkezi oturum penceresi gösteriyor, ikinci metin basılmaz.
    function detailOf(error, fallback) {
        var errors = window.apya.ajaxErrors;
        return errors && typeof errors.message === 'function' ? errors.message(error, fallback) : fallback;
    }

    function errorHtml(title, retryClass, error) {
        var detail = detailOf(error, text('Common:FetchError', 'Veri alınırken bir hata oluştu.'));
        return '<div class="apya-console-state" role="alert">'
            + '<span class="apya-console-state-icon is-muted"><i class="fa fa-triangle-exclamation" aria-hidden="true"></i></span>'
            + '<strong>' + esc(title) + '</strong>'
            + (detail ? '<p>' + esc(detail) + '</p>' : '')
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

    // Açık yönlendirme olmasın: yalnız "/x" biçimli uygulama yolu ("//host" ve "/\host" değil).
    function isAppPath(href) {
        return typeof href === 'string' && /^\/(?![\/\\])/.test(href);
    }

    // Kayıt yok (404, GRH-22): Tekrar dene yok; geri bağlantısı isteğe bağlı. esc() tırnak kaçışlamaz,
    // öznitelikte ayrıca &quot; yapılır.
    function notFoundHtml(title, message, backHref, backText) {
        var back = isAppPath(backHref)
            ? '<span class="apya-console-state-actions">'
                + '<a class="btn btn-sm btn-outline-primary" href="' + esc(backHref).replace(/"/g, '&quot;') + '">'
                + '<i class="fa fa-arrow-left me-1" aria-hidden="true"></i>' + esc(backText || backHref)
                + '</a></span>'
            : '';
        return '<div class="apya-console-state is-denied" role="alert">'
            + '<span class="apya-console-state-icon is-muted"><i class="fa fa-magnifying-glass" aria-hidden="true"></i></span>'
            + '<strong>' + esc(title || text('ErrorPage:RecordNotFound:Title', 'Aradığınız kayıt bulunamadı')) + '</strong>'
            + '<p>' + esc(message || text('ErrorPage:RecordNotFound:Description', 'Kayıt silinmiş olabilir ya da bu hesaptan görüntülenemiyor.')) + '</p>'
            + back + '</div>';
    }

    /* ---------- DataTables ---------- */
    var TABLE_RETRY = 'js-apya-table-retry';
    // "Tekrar dene"si odaklıyken basılan tablo: düğme bir sonraki çizimde sökülür, odak oraya taşınır.
    var focusAfterRetry = null;

    /** Son yanıt yükleme hatası mı? DataTables API'si ya da settings nesnesi alır. */
    function tableFailed(table) {
        if (!table) { return false; }
        var json = table.ajax && typeof table.ajax.json === 'function' ? table.ajax.json() : table.json;
        return !!(json && json.apyaLoadFailed);
    }

    // Kanca ilk HATADA takılır: sayfanın açılışta kaydettiği draw işleyicilerinden SONRA
    // çalışır ve boş hücrede son sözü söyler. Sıralama/arama gibi istemci tarafı yeniden
    // çizimlerde de kart kalır; başarılı yanıt settings.json'u değiştirince susar.
    function hookTable(settings) {
        var $ = window.jQuery;
        if (!$ || !settings.nTable || settings._apyaLoadHook) { return; }
        settings._apyaLoadHook = true;
        $(settings.nTable).on('draw.dt', function () {
            // Odak yalnız düğmeyle birlikte düştüyse taşınır (kullanıcı arada başka yere geçtiyse çalınmaz).
            var active = document.activeElement;
            var refocus = focusAfterRetry === settings.nTable && (!active || active === document.body);
            if (focusAfterRetry === settings.nTable) { focusAfterRetry = null; }
            if (!tableFailed(settings)) {
                if (refocus) {
                    settings.nTable.setAttribute('tabindex', '-1');
                    settings.nTable.focus();
                }
                return;
            }
            var cell = settings.nTBody && settings.nTBody.querySelector('td.dt-empty');
            if (cell) {
                cell.innerHTML = errorHtml(
                    settings.nTable.getAttribute('data-load-failed') || text('Common:ListLoadFailed', 'Liste yüklenemedi.'),
                    TABLE_RETRY, settings.json.apyaLoadError);
                var retry = refocus && cell.querySelector('.' + TABLE_RETRY);
                if (retry) { retry.focus(); }
            }
            // DataTables bilgi satırını drawCallback'te, bu olaydan ÖNCE yazar ("0 kayıttan 0 ile 0
            // arası" kartla çelişir); bir sonraki başarılı çizimde kendisi yeniden yazar.
            var info = settings.nTableWrapper && settings.nTableWrapper.querySelector('.dt-info');
            if (info) { info.textContent = ''; }
        });
    }

    /**
     * DataTables ajax fonksiyonunun ret dalı. Boş yanıtla çizim: işleniyor göstergesi ve
     * "Yükleniyor…" satırı kapanır, 'xhr' olayı gelir (iskeletler kalkar). 'error'/'sError'
     * alanı KONMAZ — DataTables onu errMode ile alert() olarak basar.
     */
    function failTable(settings, callback, error) {
        if (!settings || typeof callback !== 'function') { return; }
        hookTable(settings);
        callback({ data: [], recordsTotal: 0, recordsFiltered: 0, apyaLoadFailed: true, apyaLoadError: error });
    }

    // Tablo kartının "Tekrar dene"si: belge düzeyinde tek dinleyici (jQuery'siz kayıt).
    // scrollX'te gövde yine özgün tablodadır (settings.nTable).
    document.addEventListener('click', function (e) {
        var button = e.target && e.target.closest ? e.target.closest('.' + TABLE_RETRY) : null;
        var table = button && button.closest('table');
        var $ = window.jQuery;
        if (!table || !$ || !$.fn || !$.fn.dataTable || !$.fn.dataTable.isDataTable(table)) { return; }
        // Yeniden deneme sürüyor: tıklama yutulur. disabled DEĞİL — odak düğmede kalır.
        if (button.getAttribute('aria-disabled') === 'true') { return; }
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('aria-busy', 'true');
        var icon = button.querySelector('.fa-rotate-right');
        if (icon) { icon.classList.add('fa-spin'); }
        focusAfterRetry = document.activeElement === button ? table : null;
        $(table).DataTable().ajax.reload(null, false);
    });

    window.apya.loadState = {
        errorHtml: errorHtml,
        loadingHtml: loadingHtml,
        notFoundHtml: notFoundHtml,
        failTable: failTable,
        tableFailed: tableFailed
    };
})();
