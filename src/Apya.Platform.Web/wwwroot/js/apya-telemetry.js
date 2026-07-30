// Teşhis telemetrisi: davranış izi (breadcrumb) + istemci hata raporlama.
//
// KRİTİK KURAL: Form alanı DEĞERLERİ (kullanıcının yazdığı metin) hiçbir koşulda
// buraya girmez. Yalnızca sayfa geçişi, tıklanan öğenin ETİKETİ (buton/link metni),
// AJAX çağrısının yolu+durum kodu ve hata mesajları tutulur.
//
// Sunucuya SÜREKLİ akış YOKTUR — yalnızca (a) bir JS hatası oluştuğunda veya
// (b) kullanıcı geri bildirim gönderdiğinde (apya-feedback.js üzerinden) veri gider.
(function () {
    'use strict';

    if (typeof window.ApyaTelemetry !== 'undefined') {
        return; // Bundle iki kez yüklenirse tekrar kurulum yapma.
    }

    // TelemetryConsts.MaxBreadcrumbEvents (sunucu) ile aynı değer — burada sabit kopya,
    // ikisi birlikte değişmeli.
    var MAX_BREADCRUMB_EVENTS = 25;
    var MAX_LABEL_LENGTH = 60;
    var RAGE_CLICK_WINDOW_MS = 900;
    var RAGE_CLICK_THRESHOLD = 3;
    var STORAGE_KEY = 'apyaBreadcrumb';

    /* ─── Breadcrumb ring buffer (sayfa yenilemeleri arasında sessionStorage'da) ─── */

    function loadBreadcrumb() {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            var parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function saveBreadcrumb(items) {
        try {
            var trimmed = items.slice(-MAX_BREADCRUMB_EVENTS);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {
            // sessionStorage kotası dolu/kapalı olabilir — sessizce geç, telemetri opsiyonel.
        }
    }

    function pushBreadcrumb(type, label) {
        var items = loadBreadcrumb();
        items.push({
            t: Date.now(),
            y: type,
            l: (label || '').toString().substring(0, MAX_LABEL_LENGTH)
        });
        saveBreadcrumb(items);
    }

    function stripQuery(url) {
        if (!url) return url;
        var idx = url.search(/[?#]/);
        return idx < 0 ? url : url.substring(0, idx);
    }

    /* ─── Sayfa geçişi ─── */
    pushBreadcrumb('nav', location.pathname);

    /* ─── Tıklama + rage-click (yalnızca etiket; input DEĞERİ asla okunmaz) ─── */
    var lastClick = { label: null, time: 0, count: 0 };

    document.addEventListener('click', function (ev) {
        var el = ev.target && ev.target.closest
            ? ev.target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]')
            : null;
        if (!el) return;

        var label = (el.getAttribute('aria-label') || el.textContent || el.value || el.id || 'element')
            .toString().trim().replace(/\s+/g, ' ');
        if (!label) return;

        pushBreadcrumb('click', label);

        var now = Date.now();
        if (lastClick.label === label && (now - lastClick.time) < RAGE_CLICK_WINDOW_MS) {
            lastClick.count++;
            if (lastClick.count === RAGE_CLICK_THRESHOLD) {
                pushBreadcrumb('rageclick', label);
            }
        } else {
            lastClick = { label: label, time: now, count: 1 };
        }
        lastClick.time = now;
    }, true);

    /* ─── AJAX çağrıları (abp.ajax jQuery üzerinden çalışıyor → global event yakalar) ─── */
    if (typeof $ !== 'undefined' && $(document).ajaxComplete) {
        $(document).ajaxComplete(function (event, xhr, settings) {
            var path = stripQuery(settings.url);
            pushBreadcrumb('ajax', settings.type + ' ' + path + ' -> ' + xhr.status);
        });
    }

    /* ─── Hata yakalama + raporlama ─── */
    var reportedFingerprints = {}; // Bu sayfa yüklemesinde aynı hatayı ikinci kez göndermemek için.

    function truncate(value, maxLength) {
        if (!value) return value;
        var s = String(value);
        return s.length <= maxLength ? s : s.substring(0, maxLength);
    }

    function buildLocalKey(message, stack) {
        var firstStackLine = stack ? String(stack).split('\n')[0] : '';
        return (message || '') + '|' + firstStackLine + '|' + location.pathname;
    }

    function sendReport(dto, attemptsLeft) {
        if (typeof apya === 'undefined' || !apya.platform || !apya.platform.telemetry || !apya.platform.telemetry.telemetry) {
            if (attemptsLeft > 0) {
                // Dinamik servis proxy'leri henüz yüklenmemiş olabilir (script sırası) — kısa süre sonra tekrar dene.
                setTimeout(function () { sendReport(dto, attemptsLeft - 1); }, 1000);
            }
            return;
        }

        apya.platform.telemetry.telemetry.reportClientError(dto).catch(function () {
            // Raporlama başarısız olsa bile kullanıcıya ikinci bir hata göstermeyiz.
        });
    }

    function reportError(message, stack, source) {
        var localKey = buildLocalKey(message, stack);
        if (reportedFingerprints[localKey]) {
            return;
        }
        reportedFingerprints[localKey] = true;

        pushBreadcrumb('error', message);

        var dto = {
            source: source,
            message: truncate(message, 1024),
            stackTrace: stack ? truncate(stack, 8000) : null,
            pageUrl: location.pathname + location.search,
            screenResolution: window.screen ? (window.screen.width + 'x' + window.screen.height) : null,
            appVersion: null,
            breadcrumbJson: JSON.stringify(loadBreadcrumb()),
            userAgent: navigator.userAgent
        };

        sendReport(dto, 5);
    }

    var previousOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
        try {
            reportError(String(message), error && error.stack, 1 /* ClientErrorSource.JsError */);
        } catch (e) { /* teşhis kodu kendi hatasını raporlamaya çalışmaz */ }
        return typeof previousOnError === 'function' ? previousOnError.apply(this, arguments) : false;
    };

    window.addEventListener('unhandledrejection', function (ev) {
        try {
            var reason = ev && ev.reason;
            var message = (reason && (reason.message || String(reason))) || 'Unhandled promise rejection';
            reportError(message, reason && reason.stack, 2 /* ClientErrorSource.UnhandledRejection */);
        } catch (e) { /* yoksay */ }
    });

    /* ─── Dışa açılan yüzey — apya-feedback.js gönderim anında bunu okur ─── */
    window.ApyaTelemetry = {
        getBreadcrumbJson: function () {
            return JSON.stringify(loadBreadcrumb());
        },
        getPageContext: function () {
            return {
                pageUrl: location.pathname + location.search,
                pageTitle: document.title,
                screenResolution: window.screen ? (window.screen.width + 'x' + window.screen.height) : null
            };
        }
    };
})();
