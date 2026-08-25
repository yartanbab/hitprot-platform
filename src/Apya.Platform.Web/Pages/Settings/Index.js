/*
 * /Settings — sekme hafızası.
 *
 * Form POST → OnPostAsync → RedirectToPage ile döner. Hash olmasaydı kullanıcı
 * hangi sekmede kaydederse etsin daima ilk sekmeye düşerdi ("kaydettim ama
 * yerimi kaybettim" hissi). Fragment tarayıcıda kaldığı ve 302 yönlendirmesi
 * boyunca taşındığı için redirect'ten sonra da yaşar.
 *
 * Sekmenin KENDİSİ Bootstrap'in data-bs-toggle="tab" davranışıdır; burada
 * yalnız hash ⇄ aktif sekme senkronu var.
 */
(function () {
    var tabs = document.querySelectorAll('#SettingsTab [data-bs-toggle="tab"]');
    if (!tabs.length) {
        return;
    }

    var hash = window.location.hash;
    if (hash) {
        // Yetkisi olmayan kullanıcıda Kiracı/Yönetim sekmesi hiç basılmaz —
        // eski bir bağlantıyla gelindiğinde sessizce ilk sekmede kalınır.
        var wanted = document.querySelector('#SettingsTab [data-bs-target="' + hash + '"]');
        if (wanted && window.bootstrap && window.bootstrap.Tab) {
            window.bootstrap.Tab.getOrCreateInstance(wanted).show();
        }
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('shown.bs.tab', function (e) {
            var target = e.target.getAttribute('data-bs-target');
            if (!target) {
                return;
            }
            // replaceState: geri tuşu sekme geçişlerini geçmişe biriktirmesin
            // (kullanıcı "geri" derken sayfadan çıkmayı bekler, sekme gezmeyi değil).
            history.replaceState(null, '', window.location.pathname + target);
        });
    });
})();
