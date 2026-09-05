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
     * Paneldeki zorunlu alanları denetler. Radyo grupları ad bazında tek kez
     * değerlendirilir; aksi halde seçilmeyen her seçenek ayrı hata üretirdi.
     */
    function validatePanel(panel) {
        clearErrors(panel);

        var fields = panel.querySelectorAll('[data-val-required]');
        var seenRadioGroups = {};
        var firstInvalid = null;

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
                showError(name, message);
                if (!firstInvalid) { firstInvalid = field; }
            }
        });

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
            var planName = plan.closest('.apya-wiz__plan').querySelector('.apya-wiz__plan-name');
            appendRow(summary, 'Seçilen paket', planName ? planName.textContent.trim() : plan.value);
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

    function goTo(step) {
        current = Math.min(Math.max(step, 1), total);
        render();
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
        if (!invalid) { return; }

        var panel = invalid.closest('[data-wizard-panel]');
        if (panel) {
            current = Number(panel.getAttribute('data-wizard-panel'));
        }
    }

    // JS çalıştığına göre adım arayüzünü göster.
    if (stepList) { stepList.hidden = false; }
    backBtn.hidden = false;
    nextBtn.hidden = false;

    jumpToServerError();
    render();
})();
