/*
 * Kayıt talebi sihirbazı — tek formu adımlara böler.
 *
 * 🔑 İLERİCİ ZENGİNLEŞTİRME: adım gezinmesinin TAMAMI burada. Bu dosya hiç
 *    çalışmazsa (JS kapalı, hata, ağ) sayfa dört bölümü art arda gösteren düz bir
 *    form olarak kalır ve tek gönderimle çalışır. Bu yüzden adım göstergesi ile
 *    İleri/Geri düğmeleri markup'ta `hidden` doğar ve GÖRÜNÜR HÂLE BURADA gelir —
 *    tersi olsaydı JS'siz kullanıcı, hiçbir şey yapmayan düğmelerle baş başa kalırdı.
 *
 * 🔴 Alanlara native `required` KONMAZ: gizlenen panellerdeki zorunlu alanlar
 *    tarayıcının gönderimi "odaklanılamayan geçersiz denetim" diyerek sessizce
 *    engellemesine yol açar. Zorunluluk, tag helper'ın bastığı `data-val-required`
 *    işaretinden okunur.
 *
 * 🔒 KİŞİSEL VERİ HİÇBİR DEPOYA YAZILMAZ (sessionStorage / localStorage / çerez yok).
 *    Yarıda kalan form iki yolla korunur (2026-09-28 UX denetimi, ACC-08):
 *    (1) ADIM HAFIZASI — yalnız adım NUMARASI history.state'te durur; geri/ileri
 *        dönüşte ya da yenilemede alanları tarayıcı geri yükler, sihirbaz kaldığı
 *        adımda açılır. Kayıtlı adımdan önceki bir adım eksikse orada durulur.
 *    (2) AYRILMA UYARISI — formda yazı varken yenileme / kapatma / başka sayfaya
 *        geçişte tarayıcı kendi "ayrılmak istiyor musunuz?" penceresini gösterir.
 *        Dinleyici yalnız veri varken bağlıdır (boş form bfcache'i boşuna kapatmasın).
 */
(function () {
    'use strict';

    var form = document.querySelector('[data-wizard-form]');
    if (!form) { return; }

    var panels = Array.prototype.slice.call(form.querySelectorAll('[data-wizard-panel]'));
    if (panels.length === 0) { return; }

    var indicators = document.querySelectorAll('[data-wizard-indicator]');
    var stepList = document.querySelector('[data-wizard-steps]');
    var backBtn = form.querySelector('[data-wizard-back]');
    var nextBtn = form.querySelector('[data-wizard-next]');
    var submitBtn = form.querySelector('[data-wizard-submit]');
    var summary = form.querySelector('[data-wizard-summary]');

    var current = 1;
    var total = panels.length;

    // history.state içindeki anahtar: yalnız adım numarası (kişisel veri değil).
    var STEP_KEY = 'apyaWizardStep';

    // --- Yardımcılar -------------------------------------------------------

    function panelAt(step) {
        return form.querySelector('[data-wizard-panel="' + step + '"]');
    }

    function messageSlot(name) {
        return form.querySelector('[data-valmsg-for="' + name + '"]');
    }

    function clearErrors(panel) {
        Array.prototype.forEach.call(panel.querySelectorAll('[data-valmsg-for]'), function (slot) {
            if (slot.getAttribute('data-wizard-owned') === 'true') {
                slot.textContent = '';
                slot.removeAttribute('data-wizard-owned');
            }
        });
    }

    function showError(name, message) {
        var slot = messageSlot(name);
        if (!slot) { return; }
        slot.textContent = message;
        // Sunucudan gelen mesajı ezmeyelim diye kendi yazdığımızı işaretliyoruz.
        slot.setAttribute('data-wizard-owned', 'true');
    }

    /**
     * Paneldeki eksik / geçersiz zorunlu alanları döndürür — YAN ETKİSİZ (mesaj
     * yazmaz, odak taşımaz): adım geri yüklenirken de çağrılır. Radyo grupları ad
     * bazında tek kez değerlendirilir; aksi halde seçilmeyen her seçenek ayrı hata
     * üretirdi.
     */
    function invalidFields(panel) {
        var fields = panel.querySelectorAll('[data-val-required]');
        var seenRadioGroups = {};
        var found = [];

        Array.prototype.forEach.call(fields, function (field) {
            var name = field.getAttribute('name');
            if (!name) { return; }

            var message = field.getAttribute('data-val-required');
            var invalid = false;

            if (field.type === 'radio') {
                if (seenRadioGroups[name]) { return; }
                seenRadioGroups[name] = true;
                invalid = !panel.querySelector('input[name="' + name + '"]:checked');
            } else {
                invalid = field.value.trim() === '';
            }

            // Boş değilse biçim denetimi tarayıcıya kalır (e-posta, sayı…).
            if (!invalid && typeof field.checkValidity === 'function' && !field.checkValidity()) {
                invalid = true;
                message = field.validationMessage;
            }

            if (invalid) {
                found.push({ field: field, name: name, message: message });
            }
        });

        return found;
    }

    function isPanelComplete(panel) {
        return invalidFields(panel).length === 0;
    }

    /** Paneli denetler; hataları alan altına yazar ve ilk hatalı alana odaklanır. */
    function validatePanel(panel) {
        clearErrors(panel);

        var invalid = invalidFields(panel);
        invalid.forEach(function (item) { showError(item.name, item.message); });

        var firstInvalid = invalid.length ? invalid[0].field : null;

        if (firstInvalid && typeof firstInvalid.focus === 'function') {
            // preventScroll: alan gizli bir atanın içindeyse odak, sayfayı beklenmedik
            // bir yere kaydırıyor.
            firstInvalid.focus({ preventScroll: true });
            firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        return !firstInvalid;
    }

    // --- Özet --------------------------------------------------------------

    function labelFor(field) {
        var wrapper = field.closest('.apya-auth__field');
        var label = wrapper ? wrapper.querySelector('.apya-auth__label') : null;
        if (!label) { return null; }
        // "(isteğe bağlı)" ibaresi etikete dahil; özette gereksiz.
        var optional = label.querySelector('.apya-auth__optional');
        return label.textContent.replace(optional ? optional.textContent : '', '').trim();
    }

    function readableValue(field) {
        if (field.tagName === 'SELECT') {
            var option = field.options[field.selectedIndex];
            return option && option.value !== '' ? option.textContent.trim() : '';
        }
        return field.value.trim();
    }

    function buildSummary() {
        if (!summary) { return; }

        summary.innerHTML = '';

        var plan = form.querySelector('input[name="Input.RequestedPlan"]:checked');
        if (plan) {
            var card = plan.closest('.apya-wiz__plan');
            var planName = card.querySelector('.apya-wiz__plan-name');
            // "Popüler" rozeti adın içinde; özete sızmasın.
            var planTag = planName ? planName.querySelector('.apya-wiz__plan-tag') : null;
            var nameText = planName
                ? planName.textContent.replace(planTag ? planTag.textContent : '', '').trim()
                : plan.value;
            var planPrice = card.querySelector('.apya-wiz__plan-price');
            appendRow(summary, 'Seçilen paket',
                planPrice ? nameText + ' — ' + planPrice.textContent.trim() : nameText);
        }

        var fields = form.querySelectorAll('[data-wizard-panel="2"] .apya-auth__input, [data-wizard-panel="3"] .apya-auth__input');
        Array.prototype.forEach.call(fields, function (field) {
            var value = readableValue(field);
            var label = labelFor(field);
            if (value && label) {
                appendRow(summary, label, value);
            }
        });

        summary.hidden = summary.children.length === 0;
    }

    function appendRow(list, term, value) {
        var dt = document.createElement('dt');
        dt.textContent = term;
        var dd = document.createElement('dd');
        dd.textContent = value;
        list.appendChild(dt);
        list.appendChild(dd);
    }

    // --- Adım gezinmesi ----------------------------------------------------

    function render() {
        panels.forEach(function (panel) {
            panel.hidden = Number(panel.getAttribute('data-wizard-panel')) !== current;
        });

        Array.prototype.forEach.call(indicators, function (indicator) {
            var step = Number(indicator.getAttribute('data-wizard-indicator'));
            indicator.classList.toggle('is-active', step === current);
            indicator.classList.toggle('is-done', step < current);
        });

        backBtn.hidden = current === 1;
        nextBtn.hidden = current === total;
        submitBtn.hidden = current !== total;

        if (current === total) {
            buildSummary();
        }
    }

    /**
     * Adım numarasını geçmiş kaydına yazar (URL değişmez, yeni kayıt açılmaz).
     * Sayfanın başka bir parçası state'e bir şey koyduysa korunur.
     */
    function rememberStep() {
        try {
            var state = {};
            var existing = history.state;
            if (existing && typeof existing === 'object') {
                Object.keys(existing).forEach(function (key) { state[key] = existing[key]; });
            }
            state[STEP_KEY] = current;
            history.replaceState(state, '');
        } catch (e) { /* geçmiş API'si kapalıysa sihirbaz hafızasız çalışır */ }
    }

    function goTo(step) {
        current = Math.min(Math.max(step, 1), total);
        render();
        rememberStep();
    }

    /**
     * Kayıtlı adıma döner — ama yalnız aradaki adımlar DOLUYSA. Tarayıcı alanları
     * geri yüklemediyse (ör. sert yenileme) ilk eksik adımda durulur: kullanıcı boş
     * bir formun özet adımına düşmez. Hiçbir zaman geriye götürmez.
     */
    function restoreStep() {
        var saved = 0;
        try { saved = Number(history.state && history.state[STEP_KEY]) || 0; } catch (e) { saved = 0; }
        if (saved <= current) { return; }

        var target = current;
        var limit = Math.min(saved, total);
        while (target < limit && isPanelComplete(panelAt(target))) {
            target++;
        }

        if (target !== current) {
            current = target;
            render();
        }
    }

    nextBtn.addEventListener('click', function () {
        if (validatePanel(panelAt(current))) {
            goTo(current + 1);
        }
    });

    backBtn.addEventListener('click', function () {
        goTo(current - 1);
    });

    /**
     * Sunucu doğrulaması bir alanı reddettiyse (ör. aynı IP'den sel koruması ya da
     * gözden kaçan bir biçim hatası) sayfa 1. adımda açılır ve kullanıcı hatayı
     * göremez. Hatalı alanın bulunduğu adıma atlıyoruz.
     */
    function jumpToServerError() {
        var invalid = form.querySelector('.field-validation-error, .input-validation-error');
        if (!invalid) { return false; }

        var panel = invalid.closest('[data-wizard-panel]');
        if (panel) {
            current = Number(panel.getAttribute('data-wizard-panel'));
        }
        return true;
    }

    // --- Ayrılma uyarısı ---------------------------------------------------

    /**
     * Kullanıcının YAZDIĞI bir şey var mı? Yalnız "Input." alanlarına bakılır: bal
     * küpü ("Website") ve KVKK kutusu bu adı taşımaz. Paket radyosu tek başına veri
     * sayılmaz — bir tıkla geri gelir, uyarıyı hak etmez.
     */
    function hasTypedContent() {
        var fields = form.querySelectorAll('input[name^="Input."], select[name^="Input."], textarea[name^="Input."]');
        return Array.prototype.some.call(fields, function (field) {
            if (field.type === 'radio' || field.type === 'checkbox' || field.type === 'hidden') { return false; }
            return (field.value || '').trim() !== '';
        });
    }

    var leaving = false;
    var guardBound = false;

    function onBeforeUnload(e) {
        if (leaving) { return; }
        // Özel metin YOK: tarayıcılar kendi cümlesini gösterir.
        e.preventDefault();
        e.returnValue = '';
    }

    function syncLeaveGuard() {
        var needed = hasTypedContent();
        if (needed === guardBound) { return; }
        guardBound = needed;
        if (needed) {
            window.addEventListener('beforeunload', onBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', onBeforeUnload);
        }
    }

    form.addEventListener('input', syncLeaveGuard);
    form.addEventListener('change', syncLeaveGuard);

    // Formun KENDİ gönderimi uyarıya takılmasın. Doğrulama gönderimi iptal ederse
    // (sayfada kalınır) koruma 1 sn sonra geri açılır.
    form.addEventListener('submit', function () {
        leaving = true;
        setTimeout(function () { leaving = false; }, 1000);
    });

    // JS çalıştığına göre adım arayüzünü göster.
    if (stepList) { stepList.hidden = false; }
    backBtn.hidden = false;
    nextBtn.hidden = false;

    var hadServerError = jumpToServerError();
    render();

    // Sunucu bir alanı reddettiyse hatalı alanın adımı kazanır; kayıtlı adım yok sayılır.
    // İki kez değerlendirilir: Chrome alanları ayrıştırma sırasında, Firefox / Safari
    // load'dan sonra geri yükler (pageshow). bfcache'ten dönüşte adım zaten yerindedir.
    if (!hadServerError) {
        restoreStep();
        window.addEventListener('pageshow', restoreStep);
    }

    // Sunucudan dolu dönen ya da tarayıcının geri yüklediği form da korunur.
    syncLeaveGuard();
    window.addEventListener('pageshow', syncLeaveGuard);
})();
