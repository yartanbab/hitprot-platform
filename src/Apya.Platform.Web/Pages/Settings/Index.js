/*
 * /Settings — sekme hafızası + Kaydet görünürlüğü.
 *
 * Form POST → OnPostAsync → RedirectToPage ile döner. Hash olmasaydı kullanıcı
 * hangi sekmede kaydederse etsin daima ilk sekmeye düşerdi ("kaydettim ama
 * yerimi kaybettim" hissi). Fragment tarayıcıda kaldığı ve 302 yönlendirmesi
 * boyunca taşındığı için redirect'ten sonra da yaşar.
 *
 * Sekmenin KENDİSİ Bootstrap'in data-bs-toggle="tab" davranışıdır; burada
 * yalnız (a) hash ⇄ aktif sekme senkronu, (b) "kirli form" işareti,
 * (c) mobil panelinde örtük gönderimin engellenmesi var.
 */
(function () {
    var form = document.querySelector('form.apya-settings-tabs');
    var tabs = document.querySelectorAll('#SettingsTab [data-bs-toggle="tab"]');
    if (!form || !tabs.length) {
        return;
    }

    // ── 1) Hash → aktif sekme ────────────────────────────────────────────────
    // Fragment kullanıcıdan gelir: doğrudan seçiciye gömülemez. `#a"]` gibi bir
    // değer querySelector'ı DOMException ile düşürür ve bu betiğin GERİ KALANI
    // (aşağıdaki dinleyiciler) hiç bağlanmazdı. Panel kimlikleri "st-" ile
    // başlıyor; kalıba uymayan her şey yok sayılır.
    var hash = window.location.hash;
    if (/^#st-[a-z-]+$/.test(hash)) {
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
            // search KORUNUR: yalnız pathname ile yeniden kurarsak sayfaya
            // sorgu parametresiyle gelen kullanıcı ilk sekme tıklamasında onu
            // kaybeder (adres paylaşılınca da geri gelmez).
            // replaceState: geri tuşu sekme geçişlerini geçmişe biriktirmesin
            // (kullanıcı "geri" derken sayfadan çıkmayı bekler, sekme gezmeyi değil).
            history.replaceState(null, '', window.location.pathname + window.location.search + target);
        });
    });

    // ── 2) Kirli form → Kaydet görünür kalsın ────────────────────────────────
    // Kaydet düğmesi, aktif panelde kaydedilecek alan yoksa CSS ile gizleniyor.
    // Ama form TEK: Görevler sekmesinde bir şey değiştirip Mobil sekmesine geçen
    // kullanıcının bekleyen değişikliği "kaydedilemez" hale geliyordu. Formda bir
    // değişiklik olduysa gizleme kuralı devre dışı kalır.
    var chooser = document.getElementById('MobileShellChooser');
    form.addEventListener('change', function (e) {
        // Mobil seçici sunucuya gitmez, anında localStorage'a yazar — onu
        // "bekleyen değişiklik" saymak Kaydet'i boşuna açardı.
        if (chooser && chooser.contains(e.target)) {
            return;
        }
        form.classList.add('is-dirty');
    });

    // ── 3) Mobil panelinde örtük gönderim yok ────────────────────────────────
    // Bu fieldset eskiden formun DIŞINDAYDI (sunucuya hiç gitmiyor). Sekmeli
    // düzende panel formun içinde kalmak zorunda; radyo odaktayken Enter'a
    // basmak tam bir ayar POST'u tetikliyordu — üstelik o sekmede "anında
    // kaydedilir" yazıyor ve Kaydet düğmesi gizli.
    if (chooser) {
        chooser.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
})();
