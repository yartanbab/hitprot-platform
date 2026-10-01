/*
 * Sürüm notu yayın onayı — "Hepsini onayla" / "Bu sürümün tümünü onayla" kutuları.
 *
 * Bu ekranda GERÇEK yayın kararı verilir; kutuların ekrandaki durumu Kaydet'te aynen
 * sunucuya gider. Eski satır içi betik toplu kutuyu kaldırınca kapsamdaki BÜTÜN
 * onayları siliyordu: "hepsini onayla"yı yanlışlıkla işaretleyip geri alan host,
 * önceden onaylı maddelerini de kaybediyordu (65 → 207 → 0). Toplu kutular ayrıca
 * açılışta hep boş doğuyor, madde değişince güncellenmiyordu.
 *
 * SÖZLEŞME
 *  (a) Her madde kutusunun bir "kendi kararı" vardır (data-rn-own = "1" / "0"):
 *      açılışta HTML'deki `checked` özniteliği (= sunucudaki karar; tarayıcının form
 *      geri yüklemesinden etkilenmez), kullanıcı maddeyi ELLE değiştirince o değer.
 *  (b) Toplu kutu işaretlenince kapsamdaki tüm maddeler işaretlenir; kendi kararları
 *      DEĞİŞMEZ.
 *  (c) Toplu kutu kaldırılınca her madde kendi kararına döner (65 → 207 → 65).
 *  (d) Dönülecek durum zaten "hepsi onaylı" ise kutu olağan davranır: kapsamdaki
 *      onayları kaldırır ve bu, maddelerin yeni kendi kararı olur.
 *  (e) Toplu kutu kapsamının ÖZETİDİR: hepsi → işaretli, bir kısmı → belirsiz
 *      (indeterminate), hiçbiri → boş. Açılışta ve her değişiklikten sonra hesaplanır.
 *  (f) Form alanlarına, `name`lere ve POST'a dokunulmaz: toplu kutuların adı yoktur,
 *      maddelere yalnız data-rn-own yazılır. Kaydet'e basılmadan hiçbir şey yayınlanmaz
 *      ya da yayından kalkmaz.
 *  (g) GÜVENLİ YÖN: toplu işaret "kendi karar" SAYILMAZ. Ana kutu kaldırılınca sürüm
 *      kutusuyla yapılmış toplu işaretler de geri alınır; geriye yalnız açılıştaki ve
 *      elle verilmiş kararlar kalır (toplu işaret kalıntısı olmaz).
 *
 * Bağımlılık yok (jQuery / ABP gerekmez). `init` yalnız test için dışa açıktır.
 */
(function () {
    'use strict';

    function init(root) {
        var all = root.querySelector('#rnSelectAll');
        var items = Array.prototype.slice.call(root.querySelectorAll('.rn-approve'));
        var versionBoxes = Array.prototype.slice.call(root.querySelectorAll('.rn-select-version'));
        if (!items.length) { return; }

        function own(cb) { return cb.getAttribute('data-rn-own') === '1'; }
        function setOwn(cb, value) { cb.setAttribute('data-rn-own', value ? '1' : '0'); }

        function inVersion(version) {
            return items.filter(function (cb) { return cb.getAttribute('data-version') === version; });
        }

        function reflect(box, scope) {
            var on = scope.filter(function (cb) { return cb.checked; }).length;
            box.checked = scope.length > 0 && on === scope.length;
            box.indeterminate = on > 0 && on < scope.length;
        }

        function reflectAll() {
            if (all) { reflect(all, items); }
            versionBoxes.forEach(function (box) {
                reflect(box, inVersion(box.getAttribute('data-version')));
            });
        }

        function apply(scope, checked) {
            if (checked) {
                scope.forEach(function (cb) { cb.checked = true; });
            } else if (scope.every(own)) {
                // (d) Geri dönülecek durum "hepsi onaylı": kutu olağan "tümünü kaldır"dır.
                scope.forEach(function (cb) { cb.checked = false; setOwn(cb, false); });
            } else {
                scope.forEach(function (cb) { cb.checked = own(cb); });
            }
            reflectAll();
        }

        items.forEach(function (cb) {
            setOwn(cb, cb.defaultChecked);
            cb.addEventListener('change', function () {
                setOwn(cb, cb.checked);
                reflectAll();
            });
        });

        if (all) {
            all.addEventListener('change', function () { apply(items, all.checked); });
        }

        versionBoxes.forEach(function (box) {
            box.addEventListener('change', function () {
                apply(inVersion(box.getAttribute('data-version')), box.checked);
            });
        });

        reflectAll();
    }

    window.apya = window.apya || {};
    window.apya.releaseNoteApproval = { init: init };

    init(document);
})();
