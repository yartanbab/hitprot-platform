/* =============================================================================
   MENÜ DÜZENİ EDİTÖRÜ — /Settings/Menu
   -----------------------------------------------------------------------------
   İki sütun, tek markup: taşınan <li> DOM'da olduğu gibi öbür sütuna geçer.
   Hangi okun görüneceğini sütunun [data-nav-side] değeri CSS'te belirler,
   bu yüzden burada düğme cerrahisi YOK.

   SIRA         → SortableJS (sürükle) + ↑/↓ düğmeleri (klavye/dokunma).
   TAŞIMA       → satırdaki ok düğmesi. Sürükleyerek sütun değiştirilemez:
                  her liste KENDİ Sortable grubunda (pull/put kapalı), böylece
                  "bir maddeyi başka gruba sürükleme" kuralı da kendiliğinden
                  korunur (kullanıcı kararı: gruplar arası taşıma YOK).
   EV (home)    → Ayarlar'a inen madde geri alınırken hangi listeye döneceği.
                  Sunucu bunu data-nav-home ile basar; JS taşırken günceller.

   Kaydet'e basılınca düzen DOM'dan kurulup gizli alana yazılır; doğrulama ve
   üst sınırlar SUNUCUDA (MenuLayout.Parse).
   ============================================================================= */
$(function () {
    'use strict';

    var form = document.getElementById('ApyaMenuEditor');
    var output = document.getElementById('ApyaMenuLayoutJson');
    if (!form || !output) { return; }

    var rootList = form.querySelector('[data-nav-root]');
    var settingsList = form.querySelector('[data-nav-settings-list]');
    if (!rootList || !settingsList) { return; }

    // Ayarlar'dan kenar çubuğuna alınan yönetim bağlantılarının toplandığı grup.
    // Sunucudaki PlatformNavigationResolver.ManagementGroupName ile aynı olmalı.
    var MANAGEMENT_GROUP = 'Apya.Management';

    function itemsOf(list) {
        return Array.prototype.filter.call(
            list.children,
            function (li) { return li.classList.contains('apya-navedit-item'); });
    }

    function namesOf(list) {
        return itemsOf(list).map(function (li) { return li.getAttribute('data-nav-node'); });
    }

    function listOf(item) {
        return item.parentElement;
    }

    // =========================================================================
    // 1) Sürükleyerek sıralama — her liste kendi grubunda (sütun/grup değişmez)
    // =========================================================================
    function setupSortable() {
        if (typeof Sortable === 'undefined') { return; } // kütüphane yoksa ↑/↓ ile çalışmaya devam

        var lists = [rootList, settingsList].concat(
            Array.prototype.slice.call(form.querySelectorAll('[data-nav-list]')));

        lists.forEach(function (list, index) {
            new Sortable(list, {
                animation: 150,
                handle: '.apya-navedit-handle',
                draggable: '.apya-navedit-item',
                // Kilitli öğe (Ayarlar) sürüklenemez ve üzerine bırakılamaz.
                filter: '[data-nav-locked="true"]',
                group: { name: 'apya-nav-' + index, pull: false, put: false },
                ghostClass: 'apya-navedit-item--ghost',
                onMove: function (evt) {
                    return evt.related == null ||
                           evt.related.getAttribute('data-nav-locked') !== 'true';
                }
            });
        });
    }

    // =========================================================================
    // 2) ↑ / ↓ — sürüklemenin klavyeyle çalışan karşılığı
    // =========================================================================
    function move(item, delta) {
        var siblings = itemsOf(listOf(item));
        var index = siblings.indexOf(item);
        var target = index + delta;
        if (index < 0 || target < 0 || target >= siblings.length) { return; }

        // Kilitli komşunun (Ayarlar) önüne/arkasına geçilmez — dipte kalır.
        if (siblings[target].getAttribute('data-nav-locked') === 'true') { return; }

        if (delta < 0) {
            listOf(item).insertBefore(item, siblings[target]);
        } else {
            listOf(item).insertBefore(siblings[target], item);
        }
        item.querySelector('[data-nav-' + (delta < 0 ? 'up' : 'down') + ']').focus();
    }

    // =========================================================================
    // 3) Sütunlar arası taşıma
    // =========================================================================
    function toSettings(item) {
        // Geri dönüş adresi: şu an içinde bulunduğu listenin adı. Kök listede
        // (1. seviye yaprak) ad yoktur → boş kalır, geri alınınca köke döner.
        var list = listOf(item);
        item.setAttribute('data-nav-home', list.getAttribute('data-nav-list') || '');
        settingsList.insertBefore(item, settingsList.lastElementChild);
        item.querySelector('[data-nav-to-sidebar]').focus();
    }

    function toSidebar(item) {
        var home = item.getAttribute('data-nav-home') || '';
        var target = home
            ? form.querySelector('[data-nav-list="' + home.replace(/"/g, '') + '"]')
            : rootList;

        // Ev grubu ekranda yoksa (olmaması gerekir — sayfa modeli boş grupları
        // yeniden kuruyor) madde kaybolmasın diye köke düşer.
        if (!target) { target = rootList; }

        // Yönetim grubuna dönen bağlantı orada kalır; kök listede "Ayarlar"
        // her zaman en altta durduğu için yeni madde ondan ÖNCE eklenir.
        target.insertBefore(item, target.lastElementChild);
        if (target === rootList) {
            var locked = rootList.querySelector(':scope > [data-nav-locked="true"]');
            if (locked) { rootList.insertBefore(item, locked); }
        }
        item.querySelector('[data-nav-to-settings]').focus();
    }

    form.addEventListener('click', function (e) {
        var button = e.target.closest('button[data-nav-up], button[data-nav-down], ' +
                                      'button[data-nav-to-settings], button[data-nav-to-sidebar]');
        if (!button) { return; }

        var item = button.closest('.apya-navedit-item');
        if (!item) { return; }
        e.preventDefault();

        if (button.hasAttribute('data-nav-up')) { move(item, -1); }
        else if (button.hasAttribute('data-nav-down')) { move(item, 1); }
        else if (button.hasAttribute('data-nav-to-settings')) { toSettings(item); }
        else { toSidebar(item); }
    });

    // =========================================================================
    // 4) Kaydet — düzeni DOM'dan kur
    // =========================================================================
    function serialize() {
        var layout = {
            sections: namesOf(rootList),
            items: {},
            toSidebar: [],
            toSettings: [],
            settingsOrder: namesOf(settingsList)
        };

        form.querySelectorAll('[data-nav-list]').forEach(function (list) {
            var name = list.getAttribute('data-nav-list');
            if (name) { layout.items[name] = namesOf(list); }
        });

        // Kenar çubuğuna alınmış yönetim bağlantıları = Yönetim grubunun içeriği.
        // Ayrı bir işaret tutmaya gerek yok: oraya yalnız bu bağlantılar girer.
        layout.toSidebar = layout.items[MANAGEMENT_GROUP] || [];

        // Ayarlar sütununda duran ama YÖNETİM KATALOĞUNDAN OLMAYANLAR kenar
        // çubuğundan indirilmiş demektir. Katalog istemcide yok; ayırt edici
        // işaret, bağlantının evinin Yönetim grubu olması.
        layout.toSettings = itemsOf(settingsList)
            .filter(function (li) { return li.getAttribute('data-nav-home') !== MANAGEMENT_GROUP; })
            .map(function (li) { return li.getAttribute('data-nav-node'); });

        return JSON.stringify(layout);
    }

    form.addEventListener('submit', function (e) {
        // "Varsayılana dön" ayrı handler'a gider — düzen gönderilmez.
        var submitter = e.submitter;
        if (submitter && submitter.getAttribute('formaction')) { return; }
        output.value = serialize();
    });

    setupSortable();
});
