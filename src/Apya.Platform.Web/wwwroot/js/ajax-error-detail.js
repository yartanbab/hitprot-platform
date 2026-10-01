/* =============================================================================
   APYA AJAX HATA KANALI + OTURUM — tek kaynak
   -----------------------------------------------------------------------------
   Neden: Eski sürüm yalnız "gövdesiz 400 = bayat güvenlik anahtarı" için yazılmış
   metni abp.ajax.defaultError'a KOŞULSUZ yazıyordu. ABP bu nesneyi zarfsız TÜM
   hatalarda (ağ kopması, 502/503, 500, 413, 429) gösterdiği için her hata
   "İşlem doğrulanamadı… Ctrl+Shift+R" diyordu. Gövdesiz her 400'de de sayfa
   kendiliğinden yenileniyordu: oturumu düşen kullanıcının formu kayboluyordu.
   401'de ABP kullanıcıyı uygulama köküne atıyordu (ReturnUrl=/Dashboard).

   Şimdi defaultError'a HİÇ yazılmaz; ABP'nin hata yolu SARILIR (ezilmez):
   • $.ajaxPrefilter: her jQuery isteğinin fail'i ABP'nin ve çağıranın
     işleyicilerinden ÖNCE çalışır (jQuery 4: prefilter → s.error → ABP .fail).
       - 401 (oturumlu sayfada)            → merkezi oturum penceresi
       - gövdesiz 400 + POST/PUT/PATCH/DELETE → application-configuration
         yoklaması: oturum düştü / kullanıcı değişti / yalnız anahtar bayat
     Bu yönlendirme abpHandleError'dan BAĞIMSIZDIR. ModalManager .load() hatası
     (dataType 'html') için JSON zarfı hazırlanır: boş/HTML gövdede JSON.parse
     çökmesi ve sessiz başarısızlık olmaz.
   • handleErrorStatusCode: durum koduna göre metin (0 ağ, 502-504 geçici kesinti,
     5xx sunucu — gövde ASLA gösterilmez, 413 boyut, 4xx düz metin gövde).
   • handleAbpErrorResponse: "pencere gösterildi" işareti (tek kanal).
   • handleUnAuthorizedRequest: oturumlu sayfada yönlendirme YOK.
   • showError: merkezi pencereye yönlendirilmiş hata için ABP penceresi açılmaz.
   • Başka sekmede giriş/çıkış: ABP'nin authentication-state dinleyicisi (localStorage
     'authentication-state-id' değişince bu sekmeyi kendiliğinden yeniden yükler ya da
     köke yollar) oturum akışı SÜRERKEN (oturum penceresi açık ya da "Kapat"la kapatılmış)
     ÖNCE bizim 'storage' dinleyicimize takılır (bu dosya ondan önce kaydolur): giriş
     sayfası açıldı → pencere yerinde kalır, aynı kullanıcı yeniden girdi → pencere kapanır.
     "Yeni sekmede giriş yap" bu sayede özgün sekmeyi ve formu korur. Bilerek çıkış (akış
     yokken ya da yeniden girişten sonra) ve BAŞKA kullanıcının girişi ABP'ye bırakılır:
     sekme yenilenir, önceki kullanıcının verisi ekranda kalmaz.
   Oturum kaybı yollarında otomatik yenileme/yönlendirme yok; "Sayfayı yenile" yalnız
   kullanıcı basınca (hardReload).

   KANAL KURALI (Faz 4 kararı 2)
   • İşlem (kaydet/sil/gönder) hatası → ABP penceresi, tek kez. Çağıran yalnız
     geri alır; apya.ajaxErrors.notify(err, yedek) pencere gösterildiyse susar.
   • Liste/ekran YÜKLEME hatası → yalnız sayfa içi durum. İsteğe
     { abpHandleError: false } verilir (ABP proxy'sinin son parametresi,
     DataTables için: createAjax(function (input) {
         return servis.getList(input, { abpHandleError: false }); }))
     ve metin apya.ajaxErrors.message(err, yedek) ile alınır. null dönerse
     merkezi oturum penceresi zaten açık: ikinci metin basılmaz. 401 ve oturum
     kaybı yine merkezi pencereye gider (prefilter kancası).
   • Arka plan isteği (telemetri, yoklama) → { abpHandleError: false,
     apyaBackground: true }: bayat anahtar sessizce tazelenir; oturum kaybında
     pencere yalnız kullanıcı onu daha önce "Kapat"la kapatmadıysa açılır.
     Güvenli yöntemin (GET/HEAD: liste, odakta tazeleme) 401'i de böyle;
     "Kapat"tan sonra pencereyi yalnız değiştiren istek (kaydet/sil) yeniden açar.
     Kullanıcının açtığı modal (ModalManager .load, HTML GET) "Kapat"tan sonra 401
     alırsa pencere yine açılmaz; ölü tık olmasın diye engellemeyen bir hatırlatma
     (abp.notify.warn, 30 sn'de en çok bir kez) gösterilir.
   • Oturum (ya da "başka kullanıcı") penceresi açıkken abp.message.error/warn/info
     pencere açmaz; confirm false, prompt null (iptal) döner: SweetAlert tekil,
     çağıranın penceresi merkezi pencereyi ezerdi.
     ABP'nin kendi pencereleri de Radix/Bootstrap modalından yalıtılır
     (sweetAlert.config.default: willOpen + keydownListenerCapture).

   API
   apya.ajaxErrors.describe(xhrOrStatus) → { message: başlık, details: metin }
   apya.ajaxErrors.message(err, yedek)   → metin | null (null: merkezi pencere).
     DÜZ METİN döner (sunucunun cümlesi olabilir): HTML'e textContent ya da
     kaçışlanarak basılır.
   apya.ajaxErrors.wasShown(err)         → ABP ya da merkezi pencere gösterdi mi
   apya.ajaxErrors.notify(err, yedek)    → gösterilmediyse abp.notify.error (kaçışlı)
     err: ABP zarf nesnesi, jqXHR, ApiError (React), Error.
   apya.session.expired([{ background }]) → oturum penceresi; anonim sayfada false
   apya.session.verify([{ quiet }])      → Promise<'expired' | 'user-changed' |
                                            'retry' | 'persist' | 'refreshed' | 'network'>
   apya.session.loginUrl()               → /Account/Login?ReturnUrl=…(&ReturnUrlHash=…)
   apya.session.isDialogOpen()           → oturum ya da "başka kullanıcı" penceresi açık mı
   React karşılığı: dynamic-assets/src/lib/api/abpErrors.js (+ httpClient 401/400).

   Global demette ApplicationConfigurationScript'ten ÖNCE yüklenir: abp.currentUser
   ve yerelleştirme ÇAĞRI ANINDA okunur. apya-quota-upsell.js bu dosyadan SONRA
   yüklenir ve showError'u bizim sarmalayıcımızın üstüne sarar.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};

    var $ = window.jQuery;
    var UNSAFE_METHODS = { POST: true, PUT: true, PATCH: true, DELETE: true };
    var PLAIN_TEXT_MAX = 300;
    // Bu süre içinde ikinci kez bayat anahtar görülürse "tekrar deneyin" yetmez.
    var RETRY_WINDOW_MS = 2 * 60 * 1000;
    // "Kapat"tan sonraki oturum hatırlatması bu aralıkta en çok bir kez gösterilir.
    var REMINDER_INTERVAL_MS = 30 * 1000;
    // ABP'nin sekmeler arası oturum anahtarı (authentication-state-listener.js ile aynı).
    var AUTH_STATE_KEY = 'authentication-state-id';
    // Teknik (İngilizce) çalışma zamanı hataları kullanıcıya metin olarak gösterilmez.
    var RUNTIME_ERRORS = { TypeError: true, ReferenceError: true, SyntaxError: true, RangeError: true, EvalError: true, URIError: true };

    /* ---------- Metin: yerelleştirme çağrı anında; yedekler tr.json ile aynı
       (errorChannel.wiring.test.js kilitler) ---------- */
    function localize(resource, key, fallback) {
        try {
            var value = abp.localization.getResource(resource)(key);
            if (value && value !== key) { return value; }
        } catch (e) { /* yerelleştirme henüz yüklenmedi */ }
        return fallback;
    }

    function text(key, fallback) { return localize('Platform', key, fallback); }

    function closeText() { return localize('AbpUi', 'Close', 'Kapat'); }

    function isPageAuthenticated() {
        return !!(window.abp && abp.currentUser && abp.currentUser.isAuthenticated);
    }

    function pageUserId() {
        return (window.abp && abp.currentUser && abp.currentUser.id) || null;
    }

    function appPath() {
        return (window.abp && abp.appPath) || '/';
    }

    /* ---------- Hatayı tanıma ---------- */
    function isXhr(value) {
        return !!value && typeof value === 'object' &&
            typeof value.getResponseHeader === 'function' && typeof value.status === 'number';
    }

    function bodyOf(xhr) {
        return typeof xhr.responseText === 'string' ? xhr.responseText.trim() : '';
    }

    function parseJson(body) {
        if (!body || body.charAt(0) !== '{') { return null; }
        try { return JSON.parse(body); } catch (e) { return null; }
    }

    function envelopeOf(xhr) {
        var json = xhr.responseJSON || parseJson(bodyOf(xhr));
        var error = json && json.error;
        return error && typeof error === 'object' ? error : null;
    }

    function firstMessage(error) {
        var list = error.validationErrors;
        return (list && list.length && list[0] && list[0].message) || error.message || null;
    }

    // Bayat anahtar ya da oturum kaybı: ASP.NET antiforgery reddi gövdesiz 400 döner.
    // GET/HEAD/OPTIONS/TRACE doğrulanmaz; yalnız güvenli olmayan yöntemler aday.
    function isAntiforgeryCandidate(xhr) {
        return xhr.status === 400 && !bodyOf(xhr) && !!UNSAFE_METHODS[xhr.apyaMethod];
    }

    function isCentral(xhr) {
        return !!xhr.apyaCentral || (xhr.status === 401 && isPageAuthenticated()) || isAntiforgeryCandidate(xhr);
    }

    // 4xx düz metin gövde (hız sınırı, "Doğrulama Hatası: …") sunucunun kendi cümlesi.
    function plainBody(xhr) {
        var body = bodyOf(xhr);
        return body && body.length <= PLAIN_TEXT_MAX && !/^[<{[]/.test(body) ? body : null;
    }

    function copyError(error) {
        return { message: error && error.message, details: error && error.details };
    }

    /** Zarfsız hata için başlık + metin. ABP'nin varsayılan nesnelerine dokunmaz. */
    function describe(xhrOrStatus) {
        var xhr = isXhr(xhrOrStatus) ? xhrOrStatus : null;
        var status = xhr ? xhr.status : (typeof xhrOrStatus === 'number' ? xhrOrStatus : 0);
        var ajax = (window.abp && abp.ajax) || {};
        var title = ajax.defaultError && ajax.defaultError.message;

        if (status === 0) {
            return {
                message: text('Api:Error:Network:Title', 'Bağlantı kurulamadı'),
                details: text('Api:Error:Network', 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.')
            };
        }
        if (status === 502 || status === 503 || status === 504) {
            return {
                message: text('Api:Error:ServerUnavailable:Title', 'Sunucu şu an yanıt vermiyor'),
                details: text('Api:Error:ServerUnavailable', 'Sunucu geçici olarak kullanılamıyor. Birkaç dakika sonra tekrar deneyin; bu sayfada girdiğiniz bilgiler korunuyor.')
            };
        }
        if (status >= 500) {
            // Gövde gösterilmez: geliştirme ortamında yığın izi dönebilir.
            return { message: title, details: text('Api:Error:Server', 'Sunucuda beklenmeyen bir hata oluştu. Biraz sonra tekrar deneyin; sorun sürerse Geri bildirim ile bize iletin.') };
        }
        if (status === 401) { return copyError(ajax.defaultError401); }
        if (status === 403) { return copyError(ajax.defaultError403); }
        if (status === 404) { return copyError(ajax.defaultError404); }

        var plain = xhr && status >= 400 ? plainBody(xhr) : null;
        if (plain) {
            // Ayrıntıya konur (ABP kaçışlar); HTML yorumlanan başlığa asla.
            return { message: title, details: plain };
        }
        if (status === 413) {
            return { message: title, details: text('Api:Error:PayloadTooLarge', 'Gönderilen dosya ya da veri izin verilen boyutu aşıyor. Daha küçük bir dosyayla tekrar deneyin.') };
        }
        if (status === 400) {
            return { message: title, details: text('Api:Error:BadRequest', 'İstek işlenemedi. Girdiğiniz bilgileri kontrol edip tekrar deneyin.') };
        }
        return { message: title, details: text('Api:Error:Generic', 'İşlem tamamlanamadı, lütfen tekrar deneyin.') };
    }

    /**
     * Yükleme (liste/ekran) kartı için ağ ve geçici kesinti metni: orada girilmiş bilgi yok,
     * "bu sayfada girdiğiniz bilgiler korunuyor" cümlesi yersiz. Diğer durumlarda null.
     */
    function loadDetails(status) {
        if (status === 0) {
            return text('Api:Error:Network:Load', 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
        }
        if (status === 502 || status === 503 || status === 504) {
            return text('Api:Error:ServerUnavailable:Load', 'Sunucu geçici olarak kullanılamıyor. Birkaç dakika sonra tekrar deneyin.');
        }
        return null;
    }

    /**
     * Çağıranın göstereceği tek metin. null: merkezi oturum/anahtar penceresi bu
     * hatayı zaten gösteriyor (ya da gösterecek) — çağıran bir şey basmasın.
     * options.load: yükleme kartı bağlamı (apya.loadState.errorHtml, React EmptyState).
     */
    function message(err, fallback, options) {
        var alt = fallback || null;
        var load = !!(options && options.load);
        if (!err) { return alt; }
        if (err.apyaCentral) { return null; }
        if (isXhr(err)) {
            if (isCentral(err)) { return null; }
            var envelope = envelopeOf(err);
            if (envelope) { return firstMessage(envelope) || alt; }
            return (load && loadDetails(err.status)) || describe(err).details || alt;
        }
        if (err instanceof Error && RUNTIME_ERRORS[err.name]) { return alt; }
        // fetch (httpClient ApiError): ağ hatası status 0 + code 'Network'; zarfsız 502-504'te code yok.
        if (load && typeof err.status === 'number' && (err.status === 0 || !err.code)) {
            var loadText = loadDetails(err.status);
            if (loadText) { return loadText; }
        }
        return firstMessage(err) || alt;
    }

    function wasShown(err) {
        return !!(err && (err.apyaShown || err.apyaCentral));
    }

    function notify(err, fallback) {
        if (wasShown(err)) { return; }
        var m = message(err, fallback);
        // ABP toast'ı metni innerHTML ile basar: sunucunun düz metni kaçışlanır.
        if (m && window.abp && abp.notify) { abp.notify.error(abp.utils && abp.utils.htmlEscape ? abp.utils.htmlEscape(m) : m); }
    }

    window.apya.ajaxErrors = { describe: describe, message: message, wasShown: wasShown, notify: notify };
    window.apya.session = {
        expired: expired, verify: verify, loginUrl: loginUrl,
        isDialogOpen: function () { return isOpen('session') || isOpen('user-changed'); }
    };

    /* ---------- Son başarısız istek: handleErrorStatusCode yalnız durum kodu alır ---------- */
    var lastFailure = null;

    function remember(xhr) {
        lastFailure = xhr;
        // ABP ve abpAjaxForm aynı görev içinde tüketir; bayat kalıp başka isteğe karışmasın.
        setTimeout(function () { if (lastFailure === xhr) { lastFailure = null; } }, 0);
    }

    function takeFailure(status) {
        var xhr = lastFailure;
        if (xhr && xhr.status === status) {
            lastFailure = null;
            return xhr;
        }
        return null;
    }

    function markCentral(xhr) {
        xhr.apyaRouted = xhr.apyaCentral = xhr.apyaShown = true;
        var error = xhr.responseJSON && xhr.responseJSON.error;
        if (error && typeof error === 'object') { error.apyaCentral = error.apyaShown = true; }
    }

    // Zarf varsa jqXHR.responseJSON'a yazılır: ABP aynı nesneyi reddeder, işaretler korunur.
    // dataType 'html' (ModalManager .load) hatasında zarf yoksa açıklama zarfa çevrilir.
    function normalizeEnvelope(xhr, wantsHtml) {
        if (xhr.responseJSON) { return; }
        if (!wantsHtml && xhr.getResponseHeader('_AbpErrorFormat') !== 'true') { return; }
        var json = parseJson(bodyOf(xhr));
        if (json && json.error && typeof json.error === 'object') {
            xhr.responseJSON = json;
        } else if (wantsHtml) {
            xhr.responseJSON = { error: describe(xhr) };
        }
    }

    function route(xhr, wantsHtml) {
        if (xhr.apyaRouted) { return; }
        if (xhr.status === 401 && isPageAuthenticated()) {
            markCentral(xhr);
            // "Kapat"tan sonra güvenli yöntem (liste, odakta tazeleme) pencereyi yeniden açmaz.
            expired({ background: !!xhr.apyaBackground || !UNSAFE_METHODS[xhr.apyaMethod] });
            // Pencere açılmadıysa ("Kapat" dendi) ve istek kullanıcının açtığı modalsa
            // (ModalManager .load) hiçbir şey olmuyordu: ölü tık yerine hatırlatma.
            if (wantsHtml && !xhr.apyaBackground && !isOpen('session')) { remindExpired(); }
        } else if (isAntiforgeryCandidate(xhr)) {
            markCentral(xhr);
            verify({ quiet: !!xhr.apyaBackground });
        }
    }

    if ($ && $.ajaxPrefilter) {
        $.ajaxPrefilter(function (settings, originalSettings, jqXHR) {
            jqXHR.apyaMethod = String(settings.type || 'GET').toUpperCase();
            if (settings.apyaBackground) { jqXHR.apyaBackground = true; }
            var wantsHtml = (settings.dataTypes || []).indexOf('html') >= 0;
            jqXHR.fail(function () {
                remember(jqXHR);
                normalizeEnvelope(jqXHR, wantsHtml);
                route(jqXHR, wantsHtml);
            });
        });
    }

    /* ---------- ABP hata yolunu sarma ---------- */
    var ajax = window.abp && abp.ajax;
    if (ajax && ajax.handleErrorStatusCode) {
        var originalShowError = ajax.showError;
        ajax.showError = function (error) {
            if (error && error.apyaCentral) {
                // Merkezi pencere gösteriyor. Bekleyen söz: ABP'nin ".done → köke git" zinciri çalışmaz.
                return $ && $.Deferred ? $.Deferred().promise() : null;
            }
            // ABP zarfta details varken mesajı pencere BAŞLIĞINA koyar; başlık HTML olarak
            // basılır (metin kaçışlanır, başlık kaçışlanmaz). Sunucunun cümlesi düz metindir.
            if (error && error.details && typeof error.message === 'string' && abp.utils && abp.utils.htmlEscape) {
                var escaped = {};
                for (var key in error) { escaped[key] = error[key]; }
                escaped.message = abp.utils.htmlEscape(error.message);
                return originalShowError.call(this, escaped);
            }
            return originalShowError.apply(this, arguments);
        };

        var originalStatusCode = ajax.handleErrorStatusCode;
        ajax.handleErrorStatusCode = function (status) {
            var xhr = takeFailure(status);
            if (xhr && xhr.apyaRouted) { return; }
            if (xhr) { xhr.apyaShown = true; }
            if (status === 401 && isPageAuthenticated()) {
                if (xhr) { markCentral(xhr); }
                expired();
                return;
            }
            if (status === 401 || status === 403 || status === 404) {
                return originalStatusCode.apply(this, arguments);
            }
            // Dinamik çağrı: kota modalı (apya-quota-upsell.js) zinciri devrede kalır.
            abp.ajax.showError(describe(xhr || status));
        };

        var originalAbpError = ajax.handleAbpErrorResponse;
        ajax.handleAbpErrorResponse = function (jqXHR, userOptions) {
            if (isXhr(jqXHR)) { normalizeEnvelope(jqXHR, false); }
            var error = jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.error;
            // İşaret showError'dan ÖNCE: kota modalı da "gösterildi" sayılır.
            if (error && typeof error === 'object' && !(userOptions && userOptions.abpHandleError === false)) {
                error.apyaShown = true;
            }
            return originalAbpError.apply(this, arguments);
        };

        var originalUnauthorized = ajax.handleUnAuthorizedRequest;
        ajax.handleUnAuthorizedRequest = function () {
            if (isPageAuthenticated()) {
                // Zarflı 401: prefilter (route) zaten karar verdi; "Kapat" sonrası GET'i yeniden açma.
                expired({ background: true });
                return;
            }
            return originalUnauthorized.apply(this, arguments);
        };
    }

    /* ---------- Pencereler ---------- */
    var openDialog = null;
    var dialogSeq = 0;

    function isOpen(kind) {
        return !!openDialog && openDialog.kind === kind;
    }

    function stopPropagation(e) { e.stopPropagation(); }

    // Radix (görev detayı V3) ve Bootstrap modalları odağı/tıklamayı belge seviyesinde
    // yakalıyor; body pointer-events:none kalıyor. Üst katmanlarımız (pencere, bildirim balonu)
    // bunlardan yalıtılır: kap işaretlenir ve bu olaylar kabın dışına çıkmaz.
    function isolateLayer(container, kind) {
        if (!container || !container.setAttribute || container.hasAttribute('data-apya-overlay')) { return; }
        container.setAttribute('data-apya-overlay', kind || '');
        ['pointerdown', 'mousedown', 'touchstart', 'focusin'].forEach(function (name) {
            container.addEventListener(name, stopPropagation, { passive: true });
        });
    }

    function isolate(popup) {
        var container = popup && popup.parentNode;
        if (!container || !container.setAttribute) { return; }
        isolateLayer(container);
        container.style.pointerEvents = 'auto';
    }

    // Radix FocusScope odak penceremize geçerken 'focusout'ta odağı geri çekiyor;
    // yalnız o geçişte olay yakalama aşamasında durdurulur.
    window.addEventListener('focusout', function (e) {
        var next = e.relatedTarget;
        if (next && next.closest && next.closest('.swal2-container[data-apya-overlay]')) {
            e.stopPropagation();
        }
    }, true);

    // ABP'nin kendi pencereleri (abp.message.*, dolayısıyla ABP hata penceresi) de
    // yalıtılır: V3 görev modalı üstünde tıklanamıyor, Esc alttaki modala gidiyordu.
    // ABP her çağrıda config.default'u birleştirir (abp-sweetalert2.js); diğer alanlara
    // (düğme metinleri/sınıfları) dokunulmaz.
    var sweetAlertDefaults = window.abp && abp.libs && abp.libs.sweetAlert &&
        abp.libs.sweetAlert.config && abp.libs.sweetAlert.config['default'];
    if (sweetAlertDefaults) {
        sweetAlertDefaults.willOpen = isolate;
        sweetAlertDefaults.keydownListenerCapture = true;
    }

    // ABP bildirim balonu (abp.notify) da yalıtılır. Balon açık pencerenin üstünde tıklanabilir
    // ama pencerenin "dışı" sayılıyordu: balona ya da "×"ine basmak görev detayını kapatıyor,
    // kaydedilmemiş değişiklik varken "Kaydet" tıklamasını yutuyordu. Kap ilk bildirimde oluşur;
    // her bildirim yeni bir servis örneği kurup konumu güncellediği için yalıtım oraya bağlanır.
    // click durdurulmaz ("×" çalışır); kabın pointer-events'ine dokunulmaz (balonlar arası boşluk
    // tıklamayı alttakine geçirmeye devam eder).
    var ToastService = window.AbpToastService;
    if (ToastService && ToastService.prototype && ToastService.prototype.updateContainerPosition) {
        var originalUpdateContainerPosition = ToastService.prototype.updateContainerPosition;
        ToastService.prototype.updateContainerPosition = function () {
            var result = originalUpdateContainerPosition.apply(this, arguments);
            isolateLayer(this.container, 'toast');
            return result;
        };
    }

    // SweetAlert tekil: oturum (ya da "başka kullanıcı") penceresi açıkken çağıranın
    // abp.message.error'u onu ezer, "Yeni sekmede giriş yap" kaybolurdu. O sırada ABP
    // mesajı açılmaz; ABP'nin döndürdüğüyle aynı türde (jQuery Deferred) çözülmüş
    // değer döner. Pencere kapalıyken davranış aynen.
    if ($ && window.abp && abp.message) {
        ['error', 'warn', 'info'].forEach(function (type) {
            var original = abp.message[type];
            abp.message[type] = function () {
                if (isOpen('session') || isOpen('user-changed')) { return $.Deferred().resolve(); }
                return original.apply(this, arguments);
            };
        });
        // Onay ve soru da aynı: açılmaz, "vazgeçildi" sayılır (confirm false, prompt null).
        // Geri çağrı da çağrılır: onu Promise'e saran çağıran askıda kalmaz.
        ['confirm', 'prompt'].forEach(function (type) {
            var original = abp.message[type];
            abp.message[type] = function (message, second, third) {
                if (isOpen('session') || isOpen('user-changed')) {
                    var callback = typeof second === 'function' ? second : third;
                    var value = type === 'confirm' ? false : null;
                    if (typeof callback === 'function') { callback(value); }
                    return $.Deferred().resolve(value);
                }
                return original.apply(this, arguments);
            };
        });
    }

    function showDialog(kind, options, onDestroy) {
        if (!window.Swal || !Swal.fire) {
            if (window.abp && abp.message) { abp.message.warn(options.text, options.titleText); }
            if (onDestroy) { onDestroy(); }
            return Promise.resolve(null);
        }
        var id = ++dialogSeq;
        openDialog = { kind: kind, id: id };
        var sweetAlert = window.abp && abp.libs && abp.libs.sweetAlert;
        var base = (sweetAlert && sweetAlert.config && sweetAlert.config['default']) || {};
        return Promise.resolve(Swal.fire(Object.assign({}, base, {
            allowOutsideClick: false,
            // Esc/Tab pencerede kalır; alttaki modal Esc'i ayrıca yakalayıp kapanmaz.
            keydownListenerCapture: true,
            // didOpen'da DEĞİL: SweetAlert odağı didOpen'dan önce veriyor.
            willOpen: isolate,
            didDestroy: function () {
                if (openDialog && openDialog.id === id) { openDialog = null; }
                if (onDestroy) { onDestroy(); }
            }
        }, options)));
    }

    function isStandalone() {
        try {
            return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                window.navigator.standalone === true;
        } catch (e) {
            return false;
        }
    }

    /** Eski kendini onarma adımları — YALNIZ kullanıcı "Sayfayı yenile"ye basınca. */
    function hardReload() {
        document.cookie = 'XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        document.cookie = 'XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
        var work = [];
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
                work.push(navigator.serviceWorker.getRegistrations().then(function (regs) {
                    return Promise.all(regs.map(function (r) { return r.unregister(); }));
                }));
            }
            if (window.caches && caches.keys) {
                work.push(caches.keys().then(function (keys) {
                    return Promise.all(keys.map(function (k) { return caches.delete(k); }));
                }));
            }
        } catch (e) { /* yoksay */ }
        return Promise.all(work).catch(function () { /* yoksay */ }).then(function () {
            location.reload();
        });
    }

    /* ---------- Oturum ---------- */
    function loginUrl() {
        var url = appPath() + 'Account/Login?ReturnUrl=' + encodeURIComponent(location.pathname + location.search);
        if (location.hash) { url += '&ReturnUrlHash=' + encodeURIComponent(location.hash); }
        return url;
    }

    // ABP GetAsync ilk iş AntiForgeryManager.SetCookie() çağırır: yoklama XSRF-TOKEN'ı
    // (geçersizse antiforgery çerezini de) tazeler. Uç anonimde de 200 döner.
    function probe() {
        return fetch(appPath() + 'api/abp/application-configuration?includeLocalizationResources=false', {
            credentials: 'same-origin',
            cache: 'no-store',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
        }).then(function (response) {
            if (!response.ok) {
                var error = new Error('application-configuration ' + response.status);
                error.status = response.status;
                throw error;
            }
            return response.json();
        }).then(function (config) {
            var user = (config && config.currentUser) || {};
            return { isAuthenticated: !!user.isAuthenticated, id: user.id || null };
        });
    }

    var dismissedByUser = false;

    /**
     * Oturum düştü: tek merkezi pencere. Anonim sayfada false (ABP'nin özgün akışı).
     * Arka plan isteği, kullanıcı pencereyi "Kapat"la kapattıysa yeniden açtırmaz.
     */
    function expired(options) {
        if (!isPageAuthenticated()) { return false; }
        if (isOpen('session')) { return true; }
        if (dismissedByUser && options && options.background) { return true; }
        openSessionDialog();
        return true;
    }

    function expiredTitle() {
        return text('Api:Session:Expired:Title', 'Oturumunuz sona erdi');
    }

    function expiredText() {
        return text('Api:Session:Expired:Text', 'Devam etmek için yeniden giriş yapmanız gerekiyor. Bu sayfada girdiğiniz bilgiler şimdilik korunuyor; giriş sayfasına geçerseniz kaydedilmemiş değişiklikler kaybolur.');
    }

    var remindedAt = 0;

    // Kullanıcı pencereyi "Kapat"la kapattı; pencere yeniden açılmaz (onu yalnız değiştiren
    // istek açar). Engellemeyen, seyrek bir bildirim — pencereyle aynı metin — neden hiçbir
    // şey olmadığını söyler.
    function remindExpired() {
        var now = Date.now();
        if (remindedAt && now - remindedAt < REMINDER_INTERVAL_MS) { return; }
        remindedAt = now;
        if (window.abp && abp.notify && abp.notify.warn) { abp.notify.warn(expiredText(), expiredTitle()); }
    }

    function openSessionDialog() {
        restoredElsewhere = false;
        var newTab = !isStandalone();
        var onReturn = function () {
            if (document.visibilityState !== 'hidden') { checkRestored(); }
        };
        window.addEventListener('focus', onReturn);
        document.addEventListener('visibilitychange', onReturn);

        var loginHere = text('Api:Session:LoginHere', 'Giriş sayfasına git');
        var options = {
            icon: 'warning',
            titleText: expiredTitle(),
            text: expiredText(),
            showCancelButton: true,
            cancelButtonText: closeText()
        };
        if (newTab) {
            // Bu sekme ve form açık kalır; dönüşte oturum yoklanır (checkRestored).
            options.confirmButtonText = text('Api:Session:LoginNewTab', 'Yeni sekmede giriş yap');
            options.showDenyButton = true;
            options.denyButtonText = loginHere;
            options.preConfirm = function () {
                window.open(loginUrl(), '_blank', 'noopener');
                Swal.update({ text: text('Api:Session:LoginNewTab:Hint', 'Giriş yaptıktan sonra bu sekmeye dönün; oturumunuz algılanınca işleminizi tekrar deneyebilirsiniz.') });
                return false;
            };
        } else {
            // Kurulu PWA: yeni sekme çerez paylaşmayabilir (iOS); tek yol giriş sayfası.
            options.confirmButtonText = loginHere;
            options.focusCancel = true;
        }

        return showDialog('session', options, function () {
            window.removeEventListener('focus', onReturn);
            document.removeEventListener('visibilitychange', onReturn);
        }).then(function (result) {
            if (!result) { return; }
            if (newTab ? result.isDenied : result.isConfirmed) {
                location.assign(loginUrl());
            } else if (result.dismiss === 'cancel' || result.dismiss === 'esc') {
                dismissedByUser = true;
            }
        });
    }

    var restoring = false;

    function checkRestored() {
        if (restoring || !isOpen('session')) { return; }
        restoring = true;
        probe().then(function (user) {
            restoring = false;
            if (!isOpen('session') || !user.isAuthenticated) { return; }
            var id = pageUserId();
            if (id && user.id && user.id !== id) {
                userChanged();
                return;
            }
            dismissedByUser = false;
            restoredElsewhere = false;
            Swal.close();
            if (window.abp && abp.notify) {
                abp.notify.success(text('Api:Session:Restored', 'Oturumunuz yenilendi. İşleminizi tekrar deneyebilirsiniz.'));
            }
        }, function () {
            restoring = false;
        });
    }

    // Başka kullanıcının oturumuyla bu sayfanın işlemi tekrar denenmez.
    function userChanged() {
        return showDialog('user-changed', {
            icon: 'warning',
            text: text('Api:Session:UserChanged', 'Bu tarayıcıda başka bir kullanıcıyla giriş yapılmış. Devam etmek için sayfayı yenileyin.'),
            confirmButtonText: text('Api:Error:Antiforgery:Reload', 'Sayfayı yenile'),
            showCancelButton: true,
            cancelButtonText: closeText(),
            focusCancel: true
        }).then(function (result) {
            if (result && result.isConfirmed) { hardReload(); }
        });
    }

    /* ---------- Başka sekmede giriş / çıkış ---------- */
    // ABP (Theme.Shared authentication-state-listener.js) her sayfa yüklenişinde localStorage'a
    // kullanıcı kimliğini yazar (oturumsuz sayfada siler); pencere 'load' olayında eklediği
    // 'storage' dinleyicisi diğer sekmeleri kendiliğinden yeniden yükler ya da köke yollar.
    // "Yeni sekmede giriş yap"ta giriş sayfası anahtarı sildiği için özgün sekme yenileniyor,
    // form kayboluyordu. Oturumlu sayfada olay ABP'ye ulaşmadan kesilir ve oturum akışına
    // bağlanır; oturumsuz sayfada (giriş vb.) ABP'nin davranışı aynen kalır.
    // SIRA: bu dinleyici dosya değerlendirilirken, ABP'ninki 'load'da kaydolur — bizimki hep
    // önce çalışır. Chrome, window'a gelen olayda dinleyicileri KAYIT sırasıyla çağırır;
    // yakalama bayrağı sırayı değiştirmez (Chrome 152'de ölçüldü), yalnız yakalamayı önce
    // çağıran motorlar için ek güvencedir. ABP dinleyicisini 'load'dan önce kaydetmeye
    // başlarsa (sürüm yükseltmesi) bu kesme çalışmaz: canlıda yeniden doğrulanmalı.
    // GİZLİLİK: olay yalnız bu sekme oturumun düştüğünü ZATEN biliyorsa kesilir (oturum ya da
    // "başka kullanıcı" penceresi açık, ya da kullanıcı pencereyi "Kapat"la kapattı). Akış
    // yokken başka sekmede BİLEREK çıkış yapılırsa (ya da başka kullanıcı girerse) ABP'nin
    // davranışı aynen kalır: sekme yenilenir, giriş sayfasına düşer — çıkıştan sonra veri
    // pencerenin arkasında ekranda kalmaz (paylaşılan bilgisayar).
    // Kesilen YALNIZ iki olaydır: giriş sayfasının açılması (oturum zaten düşmüş; anahtar silinir)
    // ve AYNI kullanıcının yeniden girişi. Yeniden girişten SONRA gelen çıkış gerçek çıkıştır;
    // BAŞKA kullanıcının girişinde de eski kullanıcının ekranı yeni kullanıcıya kalmamalıdır —
    // ikisi de ABP'ye bırakılır (sekme yenilenir / köke gider).
    var restoredElsewhere = false;
    window.addEventListener('storage', function (event) {
        if (event.key !== AUTH_STATE_KEY || event.oldValue === event.newValue || !isPageAuthenticated()) { return; }
        if (!isOpen('session') && !isOpen('user-changed') && !dismissedByUser) { return; }
        var sameUser = !!event.newValue && event.newValue === pageUserId();
        if ((!event.newValue && restoredElsewhere) || (event.newValue && !sameUser)) {
            restoredElsewhere = false;
            return;
        }
        event.stopImmediatePropagation();
        if (!event.newValue) {
            // Giriş sayfası açıldı: pencere açıksa dokunulmaz, kullanıcı "Kapat" dediyse yeniden açılmaz.
            expired({ background: true });
            return;
        }
        // Aynı kullanıcı yeniden girdi: yeni oturum dönemi. Açık pencere dönüş akışıyla kapanır;
        // sekme gizliyse kullanıcı dönünce (openSessionDialog → onReturn).
        dismissedByUser = false;
        if (document.visibilityState !== 'hidden') { checkRestored(); } else { restoredElsewhere = true; }
    }, true);

    var verifying = null;
    var retryShownAt = 0;

    /**
     * Gövdesiz 400 (güvenli olmayan yöntem): oturum düştü mü, kullanıcı değişti mi,
     * yoksa yalnız anahtar mı bayattı? Uçuşta tek yoklama. quiet: arka plan isteği —
     * anahtar tazelendiyse pencere açılmaz.
     */
    function verify(options) {
        var loud = !(options && options.quiet);
        if (verifying) {
            if (loud) { verifying.loud = true; }
            return verifying.promise;
        }
        var wasAuthenticated = isPageAuthenticated();
        var userId = pageUserId();
        var state = { loud: loud };
        verifying = state;
        state.promise = probe().then(function (user) {
            verifying = null;
            if (wasAuthenticated && !user.isAuthenticated) {
                expired({ background: !state.loud });
                return 'expired';
            }
            if (userId && user.id && user.id !== userId) {
                userChanged();
                return 'user-changed';
            }
            if (!state.loud) { return 'refreshed'; }
            var now = Date.now();
            if (retryShownAt && now - retryShownAt < RETRY_WINDOW_MS) {
                showDialog('antiforgery', {
                    icon: 'warning',
                    titleText: text('Api:Error:Antiforgery:Title', 'İşlem doğrulanamadı'),
                    text: text('Api:Error:Antiforgery:Persist', 'Doğrulama yine başarısız oldu. Devam etmek için sayfayı yenilemeniz gerekiyor; kaydedilmemiş değişiklikler kaybolabilir.'),
                    confirmButtonText: text('Api:Error:Antiforgery:Reload', 'Sayfayı yenile'),
                    showCancelButton: true,
                    cancelButtonText: closeText(),
                    focusCancel: true
                }).then(function (result) {
                    if (result && result.isConfirmed) { hardReload(); }
                });
                return 'persist';
            }
            retryShownAt = now;
            showDialog('antiforgery', {
                icon: 'info',
                titleText: text('Api:Error:Antiforgery:Title', 'İşlem doğrulanamadı'),
                text: text('Api:Error:Antiforgery:Retry', 'Güvenlik anahtarınız yenilendi. Bu sayfada girdiğiniz bilgiler korunuyor; lütfen işlemi tekrar deneyin.')
            });
            return 'retry';
        }, function (error) {
            verifying = null;
            if (state.loud && window.abp && abp.ajax) {
                abp.ajax.showError(describe((error && error.status) || 0));
            }
            return 'network';
        });
        return state.promise;
    }
})();
