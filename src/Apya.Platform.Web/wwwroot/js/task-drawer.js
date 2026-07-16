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
});
