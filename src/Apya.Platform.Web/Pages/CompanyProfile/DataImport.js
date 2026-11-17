// Belgeden doldur: okuma yapay zekâ yanıtını beklediği için birkaç saniye sürer.
// Gönderimden sonra düğme kilitlenir ve "okunuyor" yazar; ikinci tıklama ikinci okuma başlatmasın.
(function () {
    var form = document.querySelector('[data-firm-import-upload]');
    if (!form) {
        return;
    }
    form.addEventListener('submit', function () {
        var button = form.querySelector('[data-busy-label]');
        if (!button || !form.checkValidity()) {
            return;
        }
        button.disabled = true;
        button.textContent = button.getAttribute('data-busy-label');
    });
})();
