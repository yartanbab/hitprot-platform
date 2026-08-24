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

    // ------------------------------------------------- GENEL ONAY DİYALOĞU
    // data-confirm taşıyan submit düğmeleri önce sorar. abp.message.confirm
    // yoksa (çok eski tarayıcı/JS hatası) form doğrudan gönderilir.
    $page.on('click', 'button[data-confirm]', function (e) {
        var $btn = $(this);
        if ($btn.data('confirmed')) { return; }

        e.preventDefault();
        var message = String($btn.data('confirm'));

        if (!window.abp || !abp.message || !abp.message.confirm) {
            $btn.data('confirmed', true).closest('form').trigger('submit');
            return;
        }

        abp.message.confirm(message).then(function (confirmed) {
            if (!confirmed) { return; }
            $btn.data('confirmed', true).closest('form').trigger('submit');
        });
    });

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
