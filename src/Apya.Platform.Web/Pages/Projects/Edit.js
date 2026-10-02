/* ============================================================================
   PROJE DÜZENLEME — sekme geçişi, silme onayı, kapak önizlemesi.
   ----------------------------------------------------------------------------
   Stil tek kaynak: apya-shell.css §23. Bu dosya satır-içi renk yazmaz.

   Sekme durumu SUNUCUDAN gelir (data-active-tab): form post'undan sonra
   kullanıcı hangi sekmedeyse oraya döner. JS yalnız reload'suz geçişi ve
   adres çubuğunun senkronunu üstlenir — JS kapalıyken sayfa yine çalışır,
   yalnız her sekme bir tur sunucuya gider.
   ============================================================================ */
$(function () {
    'use strict';

    var $page = $('.apya-proj-edit');
    if (!$page.length) { return; }

    var PROJECT_CODE = String($page.data('project-code') || '');

    // ------------------------------------------------------------- SEKMELER
    function activate(tab) {
        var known = $page.find('[data-panel="' + tab + '"]').length ? tab : 'info';

        $page.find('.apya-proj-edit-tab').each(function () {
            var isActive = $(this).data('tab') === known;
            $(this).toggleClass('is-active', isActive).attr('aria-selected', isActive ? 'true' : 'false');
        });
        $page.find('.apya-proj-edit-panel').each(function () {
            $(this).prop('hidden', $(this).data('panel') !== known);
        });

        // Derin bağlantı korunsun (⋯ menüsündeki "Projeyi sil" ?tab=danger ile gelir)
        // ama geçmişe yeni kayıt düşmesin — geri tuşu düzenleme sayfasında dönüp durmasın.
        if (window.history && window.history.replaceState) {
            var url = window.location.pathname + '?tab=' + known;
            window.history.replaceState(null, '', url);
        }
    }

    $page.on('click', '.apya-proj-edit-tab', function () {
        activate(String($(this).data('tab')));
    });

    activate(String($page.data('active-tab') || 'info'));

    // ---------------------------------------------------------- TARİH SIRASI
    // PRJ-01: bitiş başlangıçtan önce olamaz. min başlangıçtan kurulur: tarayıcı seçicisi
    // önceki günleri kapatır, jQuery Validation type=date'te min'i ISO dize olarak karşılaştırır
    // (eşit tarih geçerli; mesaj data-msg-min). Asıl kapı sunucu — Project.Update.
    var $start = $('#Project_StartDate');
    var $end = $('#Project_EndDate');

    function syncEndMin() {
        var start = String($start.val() || '');
        if (start) {
            $end.attr('min', start);
        } else {
            $end.removeAttr('min');
        }
    }

    $start.on('change input', syncEndMin);
    syncEndMin();

    // --------------------------------------------------------- SİLME ONAYI
    // Buton yalnız proje kodu BİREBİR yazılınca açılır. Sunucu da aynı kontrolü
    // yapıyor (asıl kapı orası); buradaki yalnız kullanıcıya geri bildirim.
    var $codeInput = $('#DeleteConfirmCode');
    var $deleteBtn = $('#DeleteProjectButton');
    var $codeHint = $('#DeleteCodeHint');

    if ($codeInput.length && $deleteBtn.length) {
        $codeInput.on('input', function () {
            var matches = String($(this).val() || '').trim() === PROJECT_CODE;
            $deleteBtn.prop('disabled', !matches);
            $codeHint.text(matches
                ? 'Kod eşleşti — silme geri alınamaz.'
                : 'Kod eşleşene kadar buton kapalı kalır.');
        });
    }

    // data-confirm taşıyan submit düğmelerini (kapağı kaldır, dosyayı sil) genel delege sorar:
    // wwwroot/js/apya-confirm.js.

    // ---------------------------------------------------- KAPAK ÖNİZLEMESİ
    // Yüklemeden ÖNCE seçilen görseli göster; yanlış dosya seçimi sunucuya
    // gitmeden fark edilsin.
    $('#CoverFileInput').on('change', function () {
        var file = this.files && this.files[0];
        if (!file || !/^image\//i.test(file.type)) { return; }

        var reader = new FileReader();
        reader.onload = function (ev) {
            $('#CoverPreview').html($('<img>').attr({ src: ev.target.result, alt: 'Seçilen kapak görseli' }));
        };
        reader.readAsDataURL(file);
    });
});
