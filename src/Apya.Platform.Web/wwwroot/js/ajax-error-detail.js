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
   Otomatik yenileme/yönlendirme hiçbir yolda yok; "Sayfayı yenile" yalnız
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

   API
   apya.ajaxErrors.describe(xhrOrStatus) → { message: başlık, details: metin }
   apya.ajaxErrors.message(err, yedek)   → metin | null (null: merkezi pencere)
   apya.ajaxErrors.wasShown(err)         → ABP ya da merkezi pencere gösterdi mi
   apya.ajaxErrors.notify(err, yedek)    → gösterilmediyse abp.notify.error
     err: ABP zarf nesnesi, jqXHR, ApiError (React), Error.
   apya.session.expired([{ background }]) → oturum penceresi; anonim sayfada false
   apya.session.verify([{ quiet }])      → Promise<'expired' | 'user-changed' |
                                            'retry' | 'persist' | 'refreshed' | 'network'>
   apya.session.loginUrl()               → /Account/Login?ReturnUrl=…(&ReturnUrlHash=…)
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
     * Çağıranın göstereceği tek metin. null: merkezi oturum/anahtar penceresi bu
     * hatayı zaten gösteriyor (ya da gösterecek) — çağıran bir şey basmasın.
     */
    function message(err, fallback) {
        var alt = fallback || null;
        if (!err) { return alt; }
        if (err.apyaCentral) { return null; }
        if (isXhr(err)) {
            if (isCentral(err)) { return null; }
            var envelope = envelopeOf(err);
            if (envelope) { return firstMessage(envelope) || alt; }
            return describe(err).details || alt;
        }
        if (err instanceof Error && RUNTIME_ERRORS[err.name]) { return alt; }
        return firstMessage(err) || alt;
    }

    function wasShown(err) {
        return !!(err && (err.apyaShown || err.apyaCentral));
    }

    function notify(err, fallback) {
        if (wasShown(err)) { return; }
        var m = message(err, fallback);
        if (m && window.abp && abp.notify) { abp.notify.error(m); }
    }

    window.apya.ajaxErrors = { describe: describe, message: message, wasShown: wasShown, notify: notify };
    window.apya.session = { expired: expired, verify: verify, loginUrl: loginUrl };

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

    function route(xhr) {
        if (xhr.apyaRouted) { return; }
        if (xhr.status === 401 && isPageAuthenticated()) {
            markCentral(xhr);
            expired({ background: !!xhr.apyaBackground });
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
                route(jqXHR);
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
                expired();
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
    // yakalıyor; body pointer-events:none kalıyor. Penceremiz bunlardan yalıtılır.
    function isolate(popup) {
        var container = popup && popup.parentNode;
        if (!container || !container.setAttribute) { return; }
        container.setAttribute('data-apya-overlay', '');
        container.style.pointerEvents = 'auto';
        ['pointerdown', 'mousedown', 'touchstart', 'focusin'].forEach(function (name) {
            container.addEventListener(name, stopPropagation, { passive: true });
        });
    }

    // Radix FocusScope odak penceremize geçerken 'focusout'ta odağı geri çekiyor;
    // yalnız o geçişte olay yakalama aşamasında durdurulur.
    window.addEventListener('focusout', function (e) {
        var next = e.relatedTarget;
        if (next && next.closest && next.closest('.swal2-container[data-apya-overlay]')) {
            e.stopPropagation();
        }
    }, true);

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

    function openSessionDialog() {
        var newTab = !isStandalone();
        var onReturn = function () {
            if (document.visibilityState !== 'hidden') { checkRestored(); }
        };
        window.addEventListener('focus', onReturn);
        document.addEventListener('visibilitychange', onReturn);

        var loginHere = text('Api:Session:LoginHere', 'Giriş sayfasına git');
        var options = {
            icon: 'warning',
            titleText: text('Api:Session:Expired:Title', 'Oturumunuz sona erdi'),
            text: text('Api:Session:Expired:Text', 'Devam etmek için yeniden giriş yapmanız gerekiyor. Bu sayfada girdiğiniz bilgiler şimdilik korunuyor; giriş sayfasına geçerseniz kaydedilmemiş değişiklikler kaybolur.'),
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
