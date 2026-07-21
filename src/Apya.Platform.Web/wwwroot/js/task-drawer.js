// Görev detay drawer'ının kompakt pill-tab satırı — Bootstrap nav-tabs yerine.
// AJAX ile enjekte edilen içerik olduğu için hep delegeli (document) bind.
$(function () {
    $(document).on('click', '.apya-pilltab-btn', function () {
        var $btn = $(this);
        var targetId = $btn.data('pilltab-target');
        var $row = $btn.closest('.apya-pilltab-row');
        var $content = $row.next('.tab-content');

        $row.find('.apya-pilltab-btn').removeClass('active');
        $btn.addClass('active');

        $content.children('.tab-pane').removeClass('show active');
        var $target = $content.children('#' + targetId).addClass('show active');

        // Lazy-load kancası (ör. Zaman Geçmişi) — hedef pane'e özel event tetikler,
        // idempotent olup olmadığına (tekrar yüklenmesin) alıcı taraf karar verir.
        var lazyKey = $btn.data('lazy');
        if (lazyKey) {
            $target.trigger('apya:lazy:' + lazyKey);
        }
    });

    // Durum inline pill-switcher — gizli <select asp-for="StatusOrColumn"> değerini set edip
    // change tetikler (autosave dinleyicisi zaten select değişikliklerini yakalıyor).
    $(document).on('click', '.apya-status-pill', function () {
        var $pill = $(this);
        var $row = $pill.closest('.apya-status-pill-row');
        var $select = $($row.data('status-select'));
        $row.find('.apya-status-pill').removeClass('active');
        $row.find('.apya-status-overflow').val('');
        $pill.addClass('active');
        $select.val($pill.data('value')).trigger('change');
    });

    $(document).on('change', '.apya-status-overflow', function () {
        var $sel = $(this);
        if (!$sel.val()) return;
        var $row = $sel.closest('.apya-status-pill-row');
        var $select = $($row.data('status-select'));
        $row.find('.apya-status-pill').removeClass('active');
        $select.val($sel.val()).trigger('change');
    });
});
