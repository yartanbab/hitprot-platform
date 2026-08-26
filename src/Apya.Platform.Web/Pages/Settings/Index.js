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
    var categories = document.getElementById('ProjectCategories');
    form.addEventListener('change', function (e) {
        // Mobil seçici sunucuya gitmez, anında localStorage'a yazar — onu
        // "bekleyen değişiklik" saymak Kaydet'i boşuna açardı.
        if (chooser && chooser.contains(e.target)) {
            return;
        }
        // Kategoriler de bu formla gitmez: kendi AJAX'ıyla anında kaydolur.
        if (categories && categories.contains(e.target)) {
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

/*
 * Proje kategorileri — Ayarlar > Projeler sekmesindeki CRUD bölümü.
 *
 * Sayfanın geri kalanı tek POST'la kaydolur; kategoriler ise doğrudan
 * ProjectCategoryAppService'e gider ve ANINDA kalıcıdır. Bu yüzden alanların
 * `name`i yok (POST'a sızmasınlar) ve bölüm formun "kirli" sayacından muaf.
 *
 * Her başarılı işlemden sonra sayfa yeniden yüklenir: listeyi elle yeniden
 * çizmek proje sayısı, sıra ve sistem/kiracı ayrımını istemcide ikinci kez
 * modellemek demekti — sunucu zaten doğrusunu basıyor.
 */
(function () {
    var root = document.getElementById('ProjectCategories');
    if (!root || root.getAttribute('data-can-manage') !== 'true') {
        return;
    }

    var l = abp.localization.getResource('Platform');
    var svc = (apya.platform.projects && apya.platform.projects.projectCategory)
        || apya.platform.application.projects.projectCategory;

    var $id = document.getElementById('CatEditId');
    var $name = document.getElementById('CatName');
    var $icon = document.getElementById('CatIcon');
    var $tone = document.getElementById('CatTone');
    var $save = document.getElementById('CatSave');
    var $cancel = document.getElementById('CatCancel');

    var addLabel = $save.textContent.trim();

    function reload() { window.location.reload(); }

    // Yeni kategori listenin sonuna: mevcut en büyük sıranın bir fazlası. Sıralamayı
    // elle düzenlemek bu turun kapsamında değil.
    function nextOrder() {
        var max = 0;
        root.querySelectorAll('li[data-order]').forEach(function (li) {
            max = Math.max(max, parseInt(li.getAttribute('data-order'), 10) || 0);
        });
        return max + 1;
    }

    function resetForm() {
        $id.value = '';
        $name.value = '';
        $icon.value = '';
        $tone.selectedIndex = 0;
        $save.textContent = addLabel;
        $cancel.hidden = true;
    }

    // Satırın kendisi tek gerçek kaynak: değerler data-* özniteliklerinde durur,
    // düzenleme formuna oradan taşınır. DOM'dan metin ayıklamak ("· " ile bölmek)
    // proje sayısı satırı değişince sessizce kırılırdı.
    function rowOf(el) { return el.closest('li[data-id]'); }

    root.addEventListener('click', function (e) {
        var editBtn = e.target.closest('[data-cat-edit]');
        if (editBtn) {
            var row = rowOf(editBtn);
            $id.value = row.getAttribute('data-id');
            $name.value = row.getAttribute('data-name');
            $icon.value = row.getAttribute('data-icon');
            $tone.value = row.getAttribute('data-tone');
            $save.textContent = l('Settings:ProjectCategories.Save');
            $cancel.hidden = false;
            $name.focus();
            return;
        }

        var delBtn = e.target.closest('[data-cat-delete]');
        if (delBtn) {
            var delRow = rowOf(delBtn);
            abp.message.confirm(l('Settings:ProjectCategories.DeleteConfirm', delRow.getAttribute('data-name'))).then(function (confirmed) {
                if (!confirmed) { return; }
                svc.delete(delRow.getAttribute('data-id')).then(reload);
            });
        }
    });

    // Aç/kapa anahtarı iki ayrı şeye bağlanır: sistem kategorisinde GÖRÜNÜRLÜK
    // (kiracı ayarı), kiracı kategorisinde entity'nin IsActive'i. Kullanıcı için
    // ikisi de "listede çıksın mı" sorusudur.
    root.addEventListener('change', function (e) {
        var toggle = e.target.closest('[data-cat-active]');
        if (!toggle) { return; }

        var row = rowOf(toggle);
        var id = row.getAttribute('data-id');
        var on = toggle.checked;

        var call = row.getAttribute('data-system') === 'true'
            ? svc.setSystemVisibility(id, on)
            : svc.update(id, {
                name: row.getAttribute('data-name'),
                icon: row.getAttribute('data-icon'),
                tone: row.getAttribute('data-tone'),
                order: parseInt(row.getAttribute('data-order'), 10) || 0,
                isActive: on
            });

        call.then(reload, function () { toggle.checked = !on; });
    });

    $save.addEventListener('click', function () {
        var name = ($name.value || '').trim();
        if (!name) { $name.focus(); return; }

        var input = {
            name: name,
            icon: ($icon.value || '').trim(),
            tone: $tone.value,
            // Sıra: yeni kategoriler listenin sonuna. Sıralamayı elle düzenlemek
            // bu turun kapsamında değil, alan ileride kullanılabilsin diye duruyor.
            order: nextOrder(),
            isActive: true
        };

        var id = $id.value;
        (id ? svc.update(id, input) : svc.create(input)).then(reload);
    });

    $cancel.addEventListener('click', resetForm);
})();
