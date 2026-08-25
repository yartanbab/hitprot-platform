/* =============================================================================
   MENÜ DÜZENİ EDİTÖRÜ — /Settings/Menu
   -----------------------------------------------------------------------------
   İki sütun, tek markup: taşınan <li> DOM'da olduğu gibi öbür sütuna geçer.
   Hangi okun görüneceğini sütunun [data-nav-side] değeri CSS'te belirler,
   bu yüzden burada düğme cerrahisi YOK. Bir grup taşınırken alt ağacı da
   kendiliğinden gelir — DOM'da zaten içinde.

   SIRA + TAŞIMA → SortableJS. Bütün listeler AYNI Sortable grubunda: madde
                   herhangi bir gruba ve öbür sütuna sürüklenebilir. Tek kısıt
                   grubu grubun İÇİNE bırakmamak; LeptonX üç seviye basıyor,
                   dördüncü seviye görsel olarak kırılır (sunucu da MaxDepth ile
                   aynı tavanı uyguluyor).
   OK DÜĞMELERİ  → sürüklemenin klavye/dokunma karşılığı. ↑/↓ sıra, ←/→ sütun.
   DÖNÜŞ YERİ    → → ile inen madde nereden geldiğini data-nav-from'a yazar;
                   ← ona geri koyar. Yönetim bağlantılarının (data-nav-admin)
                   varsayılan dönüş yeri "Yönetim" grubudur.

   Kaydet'e basılınca düzen DOM'dan kurulup gizli alana yazılır; doğrulama ve
   üst sınırlar SUNUCUDA (MenuLayout.Parse + resolver'ın yerleşim koruması).
   ============================================================================= */
$(function () {
    'use strict';

    var form = document.getElementById('ApyaMenuEditor');
    var output = document.getElementById('ApyaMenuLayoutJson');
    if (!form || !output) { return; }

    var sidebarRoot = form.querySelector('[data-nav-root="sidebar"]');
    var settingsRoot = form.querySelector('[data-nav-root="settings"]');
    if (!sidebarRoot || !settingsRoot) { return; }

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

    function allLists() {
        return [sidebarRoot, settingsRoot].concat(
            Array.prototype.slice.call(form.querySelectorAll('[data-nav-list]')));
    }

    function listKey(list) {
        return list.getAttribute('data-nav-list') || ('#' + list.getAttribute('data-nav-root'));
    }

    function listByKey(key) {
        if (!key) { return null; }
        if (key.charAt(0) === '#') {
            return form.querySelector('[data-nav-root="' + key.slice(1).replace(/"/g, '') + '"]');
        }
        return form.querySelector('[data-nav-list="' + key.replace(/"/g, '') + '"]');
    }

    function sideOf(node) {
        var holder = node.closest('[data-nav-side]');
        return holder ? holder.getAttribute('data-nav-side') : null;
    }

    // Boş ipucu her zaman listenin SONUNDA durur; sürükleme onu ortada
    // bırakabiliyor. Görünürlüğü CSS'te (:only-child), yeri burada.
    function normalizePlaceholders() {
        allLists().forEach(function (list) {
            var placeholder = list.querySelector(':scope > .apya-navedit-empty');
            if (placeholder && placeholder !== list.lastElementChild) {
                list.appendChild(placeholder);
            }
        });
    }

    // Bir listeye madde koyarken: boş ipucundan ÖNCE, kenar çubuğu kökünde ise
    // ayrıca kilitli "Ayarlar" satırından da önce.
    function appendTo(list, item) {
        var locked = list.querySelector(':scope > [data-nav-locked="true"]');
        list.insertBefore(item, locked || list.querySelector(':scope > .apya-navedit-empty'));
    }

    // =========================================================================
    // 1) Sürükleme — bütün listeler tek grupta, iki kısıtla
    // =========================================================================
    function setupSortable() {
        if (typeof Sortable === 'undefined') { return; } // kütüphane yoksa ok düğmeleri çalışmaya devam eder

        allLists().forEach(function (list) {
            new Sortable(list, {
                animation: 150,
                handle: '.apya-navedit-handle',
                draggable: '.apya-navedit-item',
                filter: '[data-nav-locked="true"]',
                group: { name: 'apya-nav' },
                fallbackOnBody: true,
                swapThreshold: 0.65,
                ghostClass: 'apya-navedit-item--ghost',
                onMove: function (evt) {
                    // Grup yalnız bir sütunun köküne bırakılabilir.
                    if (evt.dragged.getAttribute('data-nav-kind') === 'group' &&
                        evt.to.hasAttribute('data-nav-list')) {
                        return false;
                    }
                    // Kilitli "Ayarlar" satırının altına geçilemez.
                    if (evt.related &&
                        evt.related.getAttribute('data-nav-locked') === 'true' &&
                        evt.willInsertAfter) {
                        return false;
                    }
                    return true;
                },
                onEnd: function (evt) {
                    // Sütun değiştiyse dönüş adresini tazele.
                    if (evt.from !== evt.to) {
                        evt.item.setAttribute('data-nav-from', listKey(evt.from));
                    }
                    normalizePlaceholders();
                }
            });
        });
    }

    // =========================================================================
    // 2) ↑ / ↓ — sürüklemenin klavyeyle çalışan karşılığı
    // =========================================================================
    function move(item, delta) {
        var list = item.parentElement;
        var siblings = itemsOf(list);
        var index = siblings.indexOf(item);
        var target = index + delta;
        if (index < 0 || target < 0 || target >= siblings.length) { return; }

        // Kilitli komşunun (Ayarlar) önüne/arkasına geçilmez — dipte kalır.
        if (siblings[target].getAttribute('data-nav-locked') === 'true') { return; }

        if (delta < 0) {
            list.insertBefore(item, siblings[target]);
        } else {
            list.insertBefore(siblings[target], item);
        }
        item.querySelector('[data-nav-' + (delta < 0 ? 'up' : 'down') + ']').focus();
    }

    // =========================================================================
    // 3) Sütunlar arası taşıma (düğmeyle)
    // =========================================================================
    function toSettings(item) {
        item.setAttribute('data-nav-from', listKey(item.parentElement));
        appendTo(settingsRoot, item);
        item.querySelector('[data-nav-to-sidebar]').focus();
    }

    function toSidebar(item) {
        // Sırayla: geldiği yer → (yönetim bağlantısıysa) Yönetim grubu → kök.
        var target = listByKey(item.getAttribute('data-nav-from'));

        if (!target && item.getAttribute('data-nav-admin') === 'true') {
            target = form.querySelector('[data-nav-list="' + MANAGEMENT_GROUP + '"]');
        }
        // Hedef Ayarlar sütununda kaldıysa kullanılamaz: madde kenar çubuğuna
        // gitmeli. (Örn. taşınan bir kategori de aşağı inmişse.)
        if (target && sideOf(target) !== 'sidebar') { target = null; }
        if (!target) { target = sidebarRoot; }

        item.setAttribute('data-nav-from', listKey(item.parentElement));
        appendTo(target, item);
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

        normalizePlaceholders();
    });

    // =========================================================================
    // 4) Kaydet — düzeni DOM'dan kur
    // Her öğenin YERİ = (sütun, üst öğe, sıra). Üç liste bunu eksiksiz anlatır;
    // ayrıca "şu öğe taşındı" diye bir işaret tutmaya gerek yok.
    // =========================================================================
    function serialize() {
        var layout = {
            sections: namesOf(sidebarRoot),
            settingsOrder: namesOf(settingsRoot),
            items: {}
        };

        form.querySelectorAll('[data-nav-list]').forEach(function (list) {
            var name = list.getAttribute('data-nav-list');
            if (!name) { return; }
            var children = namesOf(list);
            if (children.length) { layout.items[name] = children; }
        });

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
