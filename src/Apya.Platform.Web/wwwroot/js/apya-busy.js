/* =============================================================================
   APYA BUSY — Meşgul kilidi (çift gönderim koruması) + tek gönderim delegesi
   -----------------------------------------------------------------------------
   $('#KaydetBtn').on('click', function () {
       var dto = oku();                        // doğrulama ve erken dönüşler kilidin ÖNÜNDE
       apya.busy($(this), function () {        // istek kilidin İÇİNDE başlar
           return servis.kaydet(dto).then(function (sonuc) { ...; return yukle(); });
       });
   });

   apya.busy(hedef, is) → boolean
   • hedef: jQuery nesnesi | Element | NodeList | dizi (düğme(ler) ve/veya kap).
   • is: söz (jQuery Deferred ya da Promise) döndüren FONKSİYON. Hazır söz kabul edilmez
     (TypeError): istek kilidin dışında başlamış olurdu ve aria-disabled düğmede işleyici
     yine çalıştığı için koruma delinirdi.
   • Hedeflerden biri zaten meşgulse iş ÇAĞRILMAZ, false döner — ikinci tık / Enter istek
     göndermez. Koruma budur; görsel kısım ([data-apya-busy], apya-shell.css) yardımcıdır.
   • Kilit: data-apya-busy + aria-busy="true"; hedef bir denetimse aria-disabled="true".
     Kap (div) hedefi aria-disabled almaz; içindeki denetimler CSS ile tıklanamaz olur
     (her boyamada yeniden kurulan çip / satır için kabı kilitle).
   • disabled DEĞİL: (1) Chromium odaklı düğme disabled olunca odağı body'ye atar
     (apya-load-state.js "Tekrar dene" ve React RetryButton emsali); (2) sayfanın kendi
     disabled yazımıyla (boyama) çakışmaz — boyama araya girse de kilit düşmez, kilit
     kalkınca sayfanın son yazdığı durum görünür.
   • Söz sonuçlanınca — başarı da ret de — kilit kalkar, önceki aria değerleri geri gelir.
     Kilit zincirin TAMAMI boyunca sürer: "return yukle()" derse yenileme bitene kadar.
     İş söz döndürmezse kilit bir sonraki mikro görevde kalkar; eşzamanlı fırlatırsa hemen
     kalkar ve hata çağırana gider.
   • Başarıda sayfa değişiyorsa (reload / location) iş bilerek sonuçlanmayan söz döndürür:
     return new Promise(function () { });  — kilit yeni sayfa gelene kadar kalır.
   • Zincir işin İÇİNDE kurulur; dönüş değerine (boolean) zincirlenmez.

   Tek gönderim: <body data-apya-submit-once> (ya da tek bir <form data-apya-submit-once>)
   • Yalnız bu kapsamdaki method=post formlar: ilk gönderimde formun tüm submit düğmeleri
     kilitlenir, gönderen düğme aria-busy alır ve data-busy-text'i varsa (alt öğesi olmayan
     <button>) metni onunla değişir; ikinci gönderim (çift tık, Enter tekrarı) durdurulur.
   • defaultPrevented gelen gönderim (istemci doğrulaması, AJAX formu) kilitlenmez.
   • Düğmeler disabled YAPILMAZ: gönderen düğmenin name/value'su form verisinden düşerdi
     (Login "Action=Cancel", dış sağlayıcı "provider=…").
   • Sıfırlama: pageshow (bfcache'ten geri dönüş) + 15 sn emniyet (gezinme hiç olmazsa).

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles); global demeti
   yüklemeyen kamu düzeni (Pages/Hibeler/_PublicLayout.cshtml) dosyayı doğrudan yükler.
   jQuery ve abp'ye bağımlı DEĞİL.
   ============================================================================= */
(function () {
    'use strict';
    window.apya = window.apya || {};
    if (window.apya.busy) { return; }

    var MARK = 'data-apya-busy';
    var CONTROL = 'button, input, select, textarea, a, [role=button]';

    // jQuery nesnesi, tek öğe, NodeList ya da dizi -> öğe dizisi (jQuery'siz).
    function elements(target) {
        if (!target) { return []; }
        if (target.nodeType === 1) { return [target]; }
        return Array.prototype.filter.call(target, function (el) { return el && el.nodeType === 1; });
    }

    function isBusy(el) { return el.hasAttribute(MARK); }

    function mark(el, busy) {
        el.__apyaBusy = { disabled: el.getAttribute('aria-disabled'), busy: el.getAttribute('aria-busy') };
        el.setAttribute(MARK, '');
        if (busy) { el.setAttribute('aria-busy', 'true'); }
        if (el.matches(CONTROL)) { el.setAttribute('aria-disabled', 'true'); }
    }

    function restore(el, name, value) {
        if (value === null) { el.removeAttribute(name); } else { el.setAttribute(name, value); }
    }

    function unmark(el) {
        var previous = el.__apyaBusy;
        if (!previous) { return; }
        delete el.__apyaBusy;
        el.removeAttribute(MARK);
        restore(el, 'aria-busy', previous.busy);
        restore(el, 'aria-disabled', previous.disabled);
    }

    window.apya.busy = function (target, work) {
        if (typeof work !== 'function') {
            throw new TypeError('apya.busy: work bir fonksiyon olmalı (istek kilidin içinde başlar).');
        }
        var els = elements(target);
        if (els.some(isBusy)) { return false; }
        els.forEach(function (el) { mark(el, true); });
        var release = function () { els.forEach(unmark); };
        var promise;
        try { promise = work(); } catch (e) { release(); throw e; }
        // jQuery 4 Deferred'da .finally yok; ret kolu da verilir (yakalanmamış ret üretmez).
        Promise.resolve(promise).then(release, release);
        return true;
    };

    /* ---------- Tek gönderim: tam sayfa POST formları ---------- */
    var SUBMITTING = 'data-apya-submitting';
    var RELEASE_MS = 15000;

    function submitButtons(form) {
        return Array.prototype.filter.call(form.elements, function (el) { return el.type === 'submit'; });
    }

    function reset(form) {
        if (!form.hasAttribute(SUBMITTING)) { return; }
        form.removeAttribute(SUBMITTING);
        clearTimeout(form.__apyaSubmitTimer);
        submitButtons(form).forEach(function (button) {
            if (button.__apyaIdleText != null) {
                button.textContent = button.__apyaIdleText;
                delete button.__apyaIdleText;
            }
            unmark(button);
        });
    }

    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!form || form.nodeName !== 'FORM' || !form.closest('[data-apya-submit-once]')) { return; }
        if ((form.getAttribute('method') || '').toLowerCase() !== 'post') { return; }
        // İstemci doğrulaması ya da AJAX formu gönderimi durdurduysa kilit yok.
        if (e.defaultPrevented) { return; }
        if (form.hasAttribute(SUBMITTING)) { e.preventDefault(); return; }

        form.setAttribute(SUBMITTING, '');
        var buttons = submitButtons(form);
        var submitter = e.submitter || buttons[0];
        buttons.forEach(function (button) { mark(button, button === submitter); });
        var text = submitter && submitter.nodeName === 'BUTTON' && !submitter.firstElementChild
            && submitter.getAttribute('data-busy-text');
        if (text) {
            submitter.__apyaIdleText = submitter.textContent;
            submitter.textContent = text;
        }
        // Gezinme hiç olmazsa (Durdur/Esc) form kilitli kalmasın.
        form.__apyaSubmitTimer = setTimeout(function () { reset(form); }, RELEASE_MS);
    });

    // bfcache'ten geri dönüş: sayfa kilitli hâliyle gelir.
    window.addEventListener('pageshow', function () {
        Array.prototype.forEach.call(document.querySelectorAll('form[' + SUBMITTING + ']'), reset);
    });
})();
