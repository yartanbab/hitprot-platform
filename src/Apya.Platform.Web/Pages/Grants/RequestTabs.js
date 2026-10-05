// 22b · Talepler sekme sayaçları — pano ve liste sayfalarında sekme başlığı Yanıt bekleyen
// ekranıyla aynı sayıyı göstersin diye tek uçtan okunur. Yanıt bekleyen ekranı sayaçları kendi
// yükünden doldurduğu için bu betiği yüklemez.
$(function () {
    var $counts = $('[data-request-count]');
    if (!$counts.length) { return; }

    // Sayaç yüklemesi düşerse iskelet sonsuza dek parlamasın; ABP penceresi açılmaz (Faz 4 kararı 2).
    Promise.resolve(apya.platform.grants.grantRequest.getTabCounts({ abpHandleError: false })).then(function (dto) {
        $counts.filter('[data-request-count="pending"]').text(dto.pendingCount);
        $counts.filter('[data-request-count="ideas"]').text(dto.ideasCount);
    }, function () {
        $counts.text('—');
    });
});
