/* =============================================================================
   APYA ACTIVITY — "İşlem sürüyor" göstergesi (sayfa geçişi + kullanıcı eyleminin istekleri)
   -----------------------------------------------------------------------------
   Kullanıcı isteği (2026-10-19): "bir şey yüklenirken, sayfa geçişinde ekranda yükleniyor
   işareti olsun; tıklayınca işlem yapıyor mu yapmıyor mu kestiremiyoruz."

   • ÜST ÇUBUK: sayfanın tepesinde ince, belirsiz ilerleme çubuğu.
     - Tam sayfa gezinme: aynı kökenli bağlantı tıklaması ya da form gönderimi (başka bir
       dinleyici durdurmadıysa — defaultPrevented) → hemen başlar, yeni sayfa gelince biter
       (bfcache'ten dönüşte pageshow ile kapanır; gezinme hiç olmazsa 15 sn emniyet).
     - Kullanıcının tetiklediği istek: bir tıklamadan / Enter'dan sonraki 1,5 sn içinde başlayan
       istek. XMLHttpRequest (jQuery, ABP vekilleri, DataTables) ve fetch (React adaları)
       kapsanır. 250 ms'den kısa süren istek gösterge üretmez (titreşim yok).
     - Etkileşime bağlı olmayan istekler (kabuk durumu, zil sayacı, SignalR el sıkışması,
       React Query yoklaması, telemetri) gösterge ÜRETMEZ: çubuk "senin tıklaman çalışıyor" der.
   • TIKLANAN DÜĞME: aynı etkileşimin istekleri bitene dek data-apya-pending + aria-busy
     (dönen simge apya-shell.css'te). apya.busy ile zaten kilitli düğmeye ve açılır menü
     düğmesine (dropdown-toggle, ::after oku) dokunulmaz.
   • ÇİFT TIKLAMA (Y-02): düğmenin isteği sürerken aynı düğmeye ikinci tıklama yutulur; klasik
     form gezinme sürerken ikinci kez gönderilmez. Bilinçli tekrar isteyen düğme
     data-apya-repeat ile muaf tutulur.
   • EMNİYET: istek göstergesi 30 sn'de kendiliğinden kapanır (asılı kalan istek).
   • window.apya.activity.track(söz) — etkileşim dışı ama kullanıcının beklediği uzun iş için
     elle kullanım (ör. dosya işleme): söz sonuçlanınca çubuk kapanır.

   Global script bundle'a apya-busy.js'ten SONRA kayıtlı (PlatformWebModule.ConfigureBundles).
   jQuery ve abp'ye bağımlı DEĞİL; vitest altında jsdom ile sınanır (test/apyaActivity.test.js).
   ============================================================================= */
(function () {
    'use strict';
    window.apya = window.apya || {};
    if (window.apya.activity) { return; }

    var INTERACTION_WINDOW_MS = 1500;
    var SHOW_DELAY_MS = 250;
    var NAV_DELAY_MS = 120;
    var REQUEST_SAFETY_MS = 30000;
    var NAV_SAFETY_MS = 15000;
    var PENDING = 'data-apya-pending';
    var BUTTONS = 'button, [role=button], input[type=submit], input[type=button], a.btn';

    var lastInteraction = { time: -Infinity, target: null };
    var active = 0;                 // izlenen istek sayısı
    var bar = null;
    var showTimer = null;
    var navTimer = null;
    var navigating = false;

    function now() { return Date.now(); }

    function ensureBar() {
        if (bar && bar.isConnected) { return bar; }
        if (!document.body) { return bar; }
        if (bar) { document.body.appendChild(bar); return bar; } // DOM yeniden kurulduysa (ör. body değişti) geri takılır
        bar = document.createElement('div');
        bar.className = 'apya-activity';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-label', 'İşlem sürüyor');
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);
        return bar;
    }

    function setVisible(on) {
        var el = ensureBar();
        if (!el) { return; }
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-hidden', on ? 'false' : 'true');
        document.documentElement.classList.toggle('apya-activity-busy', on);
    }

    function refresh() {
        if (navigating) { return; }
        if (active > 0) {
            if (!showTimer && !(bar && bar.classList.contains('is-active'))) {
                showTimer = setTimeout(function () {
                    showTimer = null;
                    if (active > 0) { setVisible(true); }
                }, SHOW_DELAY_MS);
            }
        } else {
            clearTimeout(showTimer);
            showTimer = null;
            setVisible(false);
        }
    }

    // --- Tıklanan düğmenin "bekliyor" işareti ---
    function pendingTarget(el) {
        if (!el || el.nodeType !== 1) { return null; }
        var button = el.closest(BUTTONS);
        if (!button) { return null; }
        if (button.hasAttribute('data-apya-busy')) { return null; }        // apya.busy zaten kilitli
        if (button.classList.contains('dropdown-toggle')) { return null; } // ::after oku var
        return button;
    }

    function markPending(button) {
        if (!button) { return function () { }; }
        var count = (button.__apyaPendingCount || 0) + 1;
        button.__apyaPendingCount = count;
        var timer = setTimeout(function () {
            if (!button.__apyaPendingCount) { return; }
            if (!button.hasAttribute(PENDING)) {
                button.__apyaPendingAria = button.getAttribute('aria-busy');
                button.setAttribute(PENDING, '');
                button.setAttribute('aria-busy', 'true');
            }
        }, SHOW_DELAY_MS);
        return function () {
            clearTimeout(timer);
            button.__apyaPendingCount = Math.max(0, (button.__apyaPendingCount || 1) - 1);
            if (button.__apyaPendingCount === 0 && button.hasAttribute(PENDING)) {
                button.removeAttribute(PENDING);
                if (button.__apyaPendingAria == null) { button.removeAttribute('aria-busy'); }
                else { button.setAttribute('aria-busy', button.__apyaPendingAria); }
                delete button.__apyaPendingAria;
            }
        };
    }

    // --- İstek izleme ---
    function begin() {
        var fromInteraction = now() - lastInteraction.time <= INTERACTION_WINDOW_MS;
        if (!fromInteraction) { return null; }
        active++;
        var unmark = markPending(lastInteraction.target);
        var finished = false;
        var safety = setTimeout(finish, REQUEST_SAFETY_MS);
        refresh();
        function finish() {
            if (finished) { return; }
            finished = true;
            clearTimeout(safety);
            active = Math.max(0, active - 1);
            unmark();
            refresh();
        }
        return finish;
    }

    if (window.XMLHttpRequest && XMLHttpRequest.prototype) {
        var send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            var finish = begin();
            if (finish) { this.addEventListener('loadend', finish); }
            return send.apply(this, arguments);
        };
    }

    if (typeof window.fetch === 'function') {
        var originalFetch = window.fetch;
        window.fetch = function () {
            var finish = begin();
            var result = originalFetch.apply(this, arguments);
            if (finish) { Promise.resolve(result).then(finish, finish); }
            return result;
        };
    }

    // --- Çift tıklama / çift gönderim koruması (Y-02) ---
    // Etkileşim kaydından ÖNCE kayıtlı: yutulan tıklama yeni etkileşim sayılmaz. Belge düzeyinde
    // yakalama evresi düğmenin kendi işleyicisinden ve jQuery temsilcilerinden önce çalışır.
    document.addEventListener('click', function (e) {
        var button = pendingTarget(e.target);
        if (button && button.__apyaPendingCount > 0 && !button.hasAttribute('data-apya-repeat')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (navigating && form && form.__apyaSubmitted) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    // --- Etkileşim kaydı (yakalama evresi: sayfanın kendi işleyicisinden ÖNCE) ---
    document.addEventListener('pointerdown', function (e) {
        if (e.button !== undefined && e.button !== 0) { return; }
        lastInteraction = { time: now(), target: pendingTarget(e.target) };
    }, true);
    document.addEventListener('click', function (e) {
        // Klavyeyle (Enter/Boşluk) etkinleşen düğme de tıklama üretir; pointerdown olmadan.
        if (now() - lastInteraction.time > 50) {
            lastInteraction = { time: now(), target: pendingTarget(e.target) };
        }
    }, true);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { lastInteraction = { time: now(), target: pendingTarget(e.target) }; }
    }, true);

    // --- Tam sayfa gezinme ---
    function startNavigation() {
        if (navigating) { return; }
        navigating = true;
        clearTimeout(showTimer);
        showTimer = null;
        navTimer = setTimeout(function () { setVisible(true); }, NAV_DELAY_MS);
        // Gezinme hiç olmazsa (kirli form uyarısında "Kal", Esc, indirme) çubuk asılı kalmasın.
        setTimeout(stopNavigation, NAV_SAFETY_MS);
    }

    function stopNavigation() {
        if (!navigating) { return; }
        navigating = false;
        clearTimeout(navTimer);
        navTimer = null;
        refresh();
    }

    function isPageLink(a, e) {
        if (!a || !a.href) { return false; }
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return false; }
        if (a.hasAttribute('download')) { return false; }
        var target = (a.getAttribute('target') || '').toLowerCase();
        if (target && target !== '_self') { return false; }
        if (a.getAttribute('data-bs-toggle') || a.getAttribute('data-toggle')) { return false; }
        var raw = a.getAttribute('href') || '';
        if (raw === '' || raw.charAt(0) === '#' || /^(javascript|mailto|tel|sms):/i.test(raw)) { return false; }
        var url;
        try { url = new URL(a.href, location.href); } catch (err) { return false; }
        if (url.origin !== location.origin) { return false; }
        // Yalnız çapa değişiyorsa sayfa yüklenmez.
        return !(url.pathname === location.pathname && url.search === location.search && url.hash);
    }

    // Kabarcık evresi + sıfır gecikme: sayfanın kendi işleyicisi (SPA yönlendirme, onay penceresi)
    // tıklamayı durdurduysa gösterge açılmaz.
    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) { return; }
        setTimeout(function () { if (isPageLink(a, e)) { startNavigation(); } }, 0);
    });

    document.addEventListener('submit', function (e) {
        var form = e.target;
        setTimeout(function () {
            if (e.defaultPrevented || !form || form.nodeName !== 'FORM') { return; }
            var target = (form.getAttribute('target') || '').toLowerCase();
            if (target && target !== '_self') { return; }
            form.__apyaSubmitted = true;
            startNavigation();
        }, 0);
    });

    window.addEventListener('pageshow', function (e) { if (e.persisted) { stopNavigation(); } });

    window.apya.activity = {
        /** Etkileşim dışı ama kullanıcının beklediği bir işi çubukla gösterir. */
        track: function (promise) {
            active++;
            refresh();
            var done = function () { active = Math.max(0, active - 1); refresh(); };
            Promise.resolve(promise).then(done, done);
            return promise;
        },
        // Testler ve tanılama için.
        _state: function () { return { active: active, navigating: navigating }; }
    };
})();
