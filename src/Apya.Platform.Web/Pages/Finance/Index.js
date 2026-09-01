$(function () {
    // Script yalnız "Kasa" sekmesinde yükleniyor; yine de düğümü doğrula —
    // sekme kodu değişirse widget sessizce kurulmasın diye değil, konsola
    // anlamsız hata basmasın diye.
    if (!document.getElementById('ApyaTransferWidget')) { return; }

    apya.transfer.mount('ApyaTransferWidget', {
        onSuccess: function () {
            window.location.reload();
        }
    });
});
