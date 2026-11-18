// Belgeden doldur: okuma yapay zekâ yanıtını beklediği için birkaç saniye sürer.
// Gönderimden sonra düğme kilitlenir ve "okunuyor" yazar; ikinci tıklama ikinci okuma başlatmasın.
// Yükleme ve "Yeniden dene" formları aynı davranır.
(function () {
    document.querySelectorAll('[data-firm-import-upload], [data-firm-import-retry]').forEach(function (form) {
        form.addEventListener('submit', function () {
            var button = form.querySelector('[data-busy-label]');
            if (!button || !form.checkValidity()) {
                return;
            }
            button.disabled = true;
            button.textContent = button.getAttribute('data-busy-label');
        });
    });
})();
