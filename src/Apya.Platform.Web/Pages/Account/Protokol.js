/*
 * Protokol onay kapısı — belge sonuna gelmeden onay kutuları açılmaz.
 *
 * Clickwrap'in hukuki değeri "okuma FIRSATI verildi" iddiasına dayanır; kutuyu belgeyi
 * hiç görmeden işaretleyebilen bir akış bu iddiayı zayıflatır.
 *
 * 🔑 Kutular markup'ta AÇIK doğar, kilidi bu dosya koyar. Tersi olsaydı (kilitli doğup
 *    JS ile açılsaydı) JavaScript çalışmayan bir tarayıcıda aday formu HİÇ gönderemezdi.
 *    Onayın kendisi sunucuda ayrıca denetleniyor; buradaki kapı bir kolaylık değil, bir
 *    kanıt katmanıdır ve tek başına güvenlik sınırı DEĞİLDİR.
 */
(function () {
    'use strict';

    var doc = document.querySelector('[data-protocol-doc]');
    var form = document.querySelector('[data-protocol-form]');
    if (!doc || !form) { return; }

    var boxes = Array.prototype.slice.call(form.querySelectorAll('[data-protocol-accept]'));
    var gate = document.querySelector('[data-protocol-gate]');
    if (boxes.length === 0) { return; }

    var unlocked = false;

    function lock() {
        boxes.forEach(function (box) {
            box.disabled = true;
            box.checked = false;
        });
        if (gate) { gate.hidden = false; }
    }

    function unlock() {
        if (unlocked) { return; }
        unlocked = true;
        boxes.forEach(function (box) { box.disabled = false; });
        if (gate) { gate.hidden = true; }
    }

    /**
     * Sona gelindi mi? 4px pay bırakılıyor: tarayıcılar kesirli piksel ve zoom durumunda
     * scrollTop + clientHeight değerini scrollHeight'a tam eşitlemeyebiliyor ve kapı
     * kullanıcının hiç açamayacağı bir kilide dönüşüyor.
     */
    function atBottom() {
        return doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 4;
    }

    /**
     * Belge kutuya SIĞIYORSA kaydırma hiç olmaz; bu durumda metin zaten tamamen
     * görünüyordur ve kapı anlamsızdır. Kilidi hiç koymuyoruz — aksi halde kısa bir
     * sözleşmede onay kutuları sonsuza kadar kapalı kalırdı.
     */
    function scrollable() {
        return doc.scrollHeight - doc.clientHeight > 8;
    }

    function evaluate() {
        if (!scrollable() || atBottom()) {
            unlock();
        }
    }

    lock();
    doc.addEventListener('scroll', evaluate, { passive: true });

    // Yazı tipleri geç yüklenince belge yüksekliği değişiyor; ilk ölçüm yanlış çıkabilir.
    window.addEventListener('resize', evaluate);
    if (window.ResizeObserver) {
        new ResizeObserver(evaluate).observe(doc);
    }

    evaluate();
})();
