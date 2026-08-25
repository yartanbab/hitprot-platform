/* =============================================================================
   MENÜ DÜZENİ EDİTÖRÜ — /Settings/Menu
   -----------------------------------------------------------------------------
   Üç bölme, tek markup: taşınan <li> DOM'da olduğu gibi öbür bölmeye geçer.
   Hangi düğmenin görüneceğini bölmenin [data-nav-side] değeri CSS'te belirler,
   bu yüzden burada düğme cerrahisi YOK. Bir grup taşınırken alt ağacı da
   kendiliğinden gelir — DOM'da zaten içinde.

   SIRA + TAŞIMA → SortableJS. Bütün listeler AYNI Sortable grubunda: madde
                   herhangi bir gruba ve öbür bölmeye sürüklenebilir. Tek kısıt
                   grubu grubun İÇİNE bırakmamak; LeptonX üç seviye basıyor,
                   dördüncü seviye görsel olarak kırılır (sunucu da MaxDepth ile
                   aynı tavanı uyguluyor).
   DÜĞMELER      → sürüklemenin klavye/dokunma karşılığı. ↑/↓ sıra, ←/→ bölme,
                   göz gizler/geri getirir, kalem+çöp yalnız ÖZEL öğelerde.
   DÖNÜŞ YERİ    → bölme değiştiren madde nereden geldiğini data-nav-from'a
                   yazar; geri alma önce oraya bakar.
   YENİ SATIR    → markup'ı JS kurmaz, Razor'un bastığı <template>'ten klonlanır
                   (RenderNode ile aynı kaynak, ayrışamaz).

   Kaydet'e basılınca düzen DOM'dan kurulup gizli alana yazılır; doğrulama ve
   üst sınırlar SUNUCUDA (MenuLayout.Parse + resolver'ın yerleşim koruması).
   Buradaki kontroller yalnız kullanıcıya anında geri bildirim içindir.
   ============================================================================= */
$(function () {
    'use strict';

    var form = document.getElementById('ApyaMenuEditor');
    var output = document.getElementById('ApyaMenuLayoutJson');
    if (!form || !output) { return; }

    var sidebarRoot = form.querySelector('[data-nav-root="sidebar"]');
    var settingsRoot = form.querySelector('[data-nav-root="settings"]');
    var hiddenRoot = form.querySelector('[data-nav-root="hidden"]');
    if (!sidebarRoot || !settingsRoot || !hiddenRoot) { return; }

    // Sunucudaki PlatformNavigationResolver.ManagementGroupName ile aynı olmalı.
    var MANAGEMENT_GROUP = 'Apya.Management';
    // PlatformSettingDefaults.ShellMenuLayoutCustomPrefix ile aynı olmalı.
    var CUSTOM_PREFIX = 'Apya.User.';

    function itemsOf(list) {
        return Array.prototype.filter.call(
            list.children,
            function (li) { return li.classList.contains('apya-navedit-item'); });
    }

    // Kilitli satır ("Ayarlar") düzenin parçası DEĞİL: sunucudaki Place guard'ı
    // onu zaten yok sayıyor, ama yüke koyarsak liste kotasından (60) yer harcar
    // ve kalabalık bir kenar çubuğunda son gerçek bölüm sessizce kırpılır.
    function namesOf(list) {
        return itemsOf(list)
            .filter(function (li) { return li.getAttribute('data-nav-locked') !== 'true'; })
            .map(function (li) { return li.getAttribute('data-nav-node'); });
    }

    function allLists() {
        return [sidebarRoot, settingsRoot, hiddenRoot].concat(
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
    function sortableOptions() {
        return {
            animation: 150,
            handle: '.apya-navedit-handle',
            draggable: '.apya-navedit-item',
            filter: '[data-nav-locked="true"]',
            group: { name: 'apya-nav' },
            fallbackOnBody: true,
            swapThreshold: 0.65,
            ghostClass: 'apya-navedit-item--ghost',
            onMove: function (evt) {
                // Grup yalnız bir bölmenin köküne bırakılabilir.
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
                if (evt.from !== evt.to) {
                    evt.item.setAttribute('data-nav-from', listKey(evt.from));
                }
                normalizePlaceholders();
            }
        };
    }

    function bindSortable(list) {
        if (typeof Sortable === 'undefined' || Sortable.get(list)) { return; }
        new Sortable(list, sortableOptions());
    }

    // Yeni kategori de bırakma hedefi olmalı → listeler sonradan da bağlanır.
    function bindAllSortables() {
        allLists().forEach(bindSortable);
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
    // 3) Bölmeler arası taşıma
    // =========================================================================
    function relocate(item, target, focusSelector) {
        item.setAttribute('data-nav-from', listKey(item.parentElement));
        appendTo(target, item);
        var focus = item.querySelector(focusSelector);
        if (focus) { focus.focus(); }
    }

    function toSidebar(item) {
        // Sırayla: geldiği yer → (yönetim bağlantısıysa) Yönetim grubu → kök.
        var target = listByKey(item.getAttribute('data-nav-from'));

        if (!target && item.getAttribute('data-nav-admin') === 'true') {
            target = form.querySelector('[data-nav-list="' + MANAGEMENT_GROUP + '"]');
        }
        // Hedef başka bölmede kaldıysa kullanılamaz: madde kenar çubuğuna gitmeli.
        if (target && sideOf(target) !== 'sidebar') { target = null; }

        relocate(item, target || sidebarRoot, '[data-nav-to-settings]');
    }

    // Gizlemeden geri alma: eski yerine, orası artık kenar çubuğunda değilse köke.
    function unhide(item) {
        var target = listByKey(item.getAttribute('data-nav-from'));
        if (target && sideOf(target) === 'hidden') { target = null; }
        relocate(item, target || sidebarRoot, '[data-nav-hide]');
    }

    // =========================================================================
    // 4) Özel kategori / kısayol — ekle, düzenle, sil
    // =========================================================================
    var toolbar = form.querySelector('.apya-navedit-toolbar');
    var formBox = document.getElementById('ApyaNavForm');
    var fieldTitle = document.getElementById('ApyaNavFormTitle');
    var fieldIcon = document.getElementById('ApyaNavFormIcon');
    var fieldUrl = document.getElementById('ApyaNavFormUrl');
    var preview = document.getElementById('ApyaNavFormPreview');
    var errorBox = document.getElementById('ApyaNavFormError');
    var editing = null;   // düzenlenen <li> ya da null (yeni)
    var editKind = 'group';

    function newName() {
        // Yalnız alfasayısal son ek: sunucudaki CleanCustomName bunu şart koşuyor
        // (ve alt çizgi LeptonX id çevirisini bozardı).
        return CUSTOM_PREFIX +
               Date.now().toString(36) +
               Math.random().toString(36).replace(/[^a-z0-9]/g, '').slice(0, 6);
    }

    function openForm(kind, item) {
        editKind = kind;
        editing = item || null;
        errorBox.textContent = '';

        fieldTitle.value = item ? (item.getAttribute('data-nav-title') || '') : '';
        fieldIcon.value = item ? (item.getAttribute('data-nav-icon') || fieldIcon.options[0].value)
                               : fieldIcon.options[0].value;
        fieldUrl.value = item ? (item.getAttribute('data-nav-url') || '') : '';
        fieldUrl.hidden = kind !== 'link';

        syncPreview();
        formBox.hidden = false;
        fieldTitle.focus();
    }

    function closeForm() {
        formBox.hidden = true;
        editing = null;
        errorBox.textContent = '';
    }

    function syncPreview() {
        preview.className = 'apya-navedit-icon ' + fieldIcon.value;
    }

    // Sunucunun kabul edeceği kuralın aynısı — burada yalnız anında geri bildirim
    // için var, yetkili doğrulama MenuLayout.NormalizePath'te.
    function isSitePath(url) {
        return url.length > 0 && url.charAt(0) === '/' && url.slice(0, 2) !== '//';
    }

    function applyRow(item, title, icon, url) {
        item.setAttribute('data-nav-title', title);
        item.setAttribute('data-nav-icon', icon);
        item.setAttribute('data-nav-url', url || '');
        item.querySelector(':scope > .apya-navedit-row .apya-navedit-title').textContent = title;
        item.querySelector(':scope > .apya-navedit-row .apya-navedit-icon').className =
            'apya-navedit-icon ' + icon;
    }

    function createRow(kind, title, icon, url) {
        var template = document.getElementById(
            kind === 'group' ? 'ApyaNavGroupTemplate' : 'ApyaNavLinkTemplate');
        var item = template.content.querySelector('.apya-navedit-item').cloneNode(true);

        var name = newName();
        item.setAttribute('data-nav-node', name);
        var inner = item.querySelector(':scope > [data-nav-list]');
        if (inner) { inner.setAttribute('data-nav-list', name); }

        applyRow(item, title, icon, url);
        return item;
    }

    function limitOf(kind) {
        var raw = toolbar && toolbar.getAttribute('data-nav-max-' + kind);
        var max = parseInt(raw, 10);
        return isNaN(max) ? Infinity : max;
    }

    function limitMessage(kind) {
        return (toolbar && toolbar.getAttribute('data-nav-limit-' + kind)) || '';
    }

    // Gizlenenler bölmesindekiler de sayılır: onlar da yüke giriyor.
    function atLimit(kind) {
        return form.querySelectorAll('[data-nav-custom="' + kind + '"]').length >= limitOf(kind);
    }

    function saveForm() {
        var title = fieldTitle.value.trim();
        var icon = fieldIcon.value;
        var url = fieldUrl.value.trim();

        if (!title) {
            errorBox.textContent = fieldTitle.dataset.required || fieldTitle.placeholder;
            fieldTitle.focus();
            return;
        }
        if (editKind === 'link' && !isSitePath(url)) {
            errorBox.textContent = fieldUrl.dataset.invalid || fieldUrl.placeholder;
            fieldUrl.focus();
            return;
        }

        if (editing) {
            applyRow(editing, title, icon, url);
        } else {
            // Tavan SUNUCUNUN sınırı (MenuLayout.Normalize). Burada durdurmazsak
            // 11. kategori kaydedilirken sessizce kırpılır: kullanıcı ad+ikon+hedef
            // yazar, "kaydedildi" görür ve kaybını ancak menüde fark eder.
            if (atLimit(editKind)) {
                errorBox.textContent = limitMessage(editKind);
                return;
            }
            var item = createRow(editKind, title, icon, url);
            appendTo(sidebarRoot, item);
            bindAllSortables();   // yeni kategori de bırakma hedefi olsun
        }

        closeForm();
        normalizePlaceholders();
    }

    // Silme: satır DOM'dan kalkar, çocukları varsa ÜST LİSTEYE devredilir.
    // Sunucu da aynı sonucu üretirdi (üstü olmayan düğüm koddaki yerine döner)
    // ama ekranda öğelerin yok olup kaydettikten sonra geri gelmesi kafa karıştırır.
    function deleteRow(item) {
        var parent = item.parentElement;
        var inner = item.querySelector(':scope > [data-nav-list]');
        if (inner) {
            itemsOf(inner).forEach(function (child) { parent.insertBefore(child, item); });
        }
        item.remove();
        normalizePlaceholders();
    }

    fieldIcon.addEventListener('change', syncPreview);
    document.getElementById('ApyaNavFormSave').addEventListener('click', saveForm);
    document.getElementById('ApyaNavFormCancel').addEventListener('click', closeForm);
    formBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); saveForm(); }
        else if (e.key === 'Escape') { closeForm(); }
    });

    // =========================================================================
    // 5) Tek delege dinleyici
    // =========================================================================
    form.addEventListener('click', function (e) {
        var newButton = e.target.closest('button[data-nav-new]');
        if (newButton) {
            e.preventDefault();
            openForm(newButton.getAttribute('data-nav-new'), null);
            return;
        }

        var button = e.target.closest(
            'button[data-nav-up], button[data-nav-down], button[data-nav-to-settings], ' +
            'button[data-nav-to-sidebar], button[data-nav-hide], button[data-nav-show], ' +
            'button[data-nav-edit], button[data-nav-delete]');
        if (!button) { return; }

        var item = button.closest('.apya-navedit-item');
        if (!item) { return; }
        e.preventDefault();

        if (button.hasAttribute('data-nav-up')) { move(item, -1); }
        else if (button.hasAttribute('data-nav-down')) { move(item, 1); }
        else if (button.hasAttribute('data-nav-to-settings')) { relocate(item, settingsRoot, '[data-nav-to-sidebar]'); }
        else if (button.hasAttribute('data-nav-to-sidebar')) { toSidebar(item); }
        else if (button.hasAttribute('data-nav-hide')) { relocate(item, hiddenRoot, '[data-nav-show]'); }
        else if (button.hasAttribute('data-nav-show')) { unhide(item); }
        else if (button.hasAttribute('data-nav-edit')) { openForm(item.getAttribute('data-nav-custom'), item); }
        else { deleteRow(item); }

        normalizePlaceholders();
    });

    // =========================================================================
    // 6) Kaydet — düzeni DOM'dan kur
    // Her öğenin YERİ = (bölme, üst öğe, sıra). Listeler bunu eksiksiz anlatır;
    // ayrıca "şu öğe taşındı" diye bir işaret tutmaya gerek yok.
    // =========================================================================
    function customEntries(kind) {
        return Array.prototype.slice
            .call(form.querySelectorAll('[data-nav-custom="' + kind + '"]'))
            .map(function (li) {
                var entry = {
                    n: li.getAttribute('data-nav-node'),
                    t: li.getAttribute('data-nav-title') || '',
                    i: li.getAttribute('data-nav-icon') || ''
                };
                if (kind === 'link') { entry.u = li.getAttribute('data-nav-url') || ''; }
                return entry;
            });
    }

    function serialize() {
        var layout = {
            sections: namesOf(sidebarRoot),
            settingsOrder: namesOf(settingsRoot),
            items: {},
            groups: customEntries('group'),
            links: customEntries('link'),
            hidden: namesOf(hiddenRoot)
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

    bindAllSortables();

    // --- kaydettikten sonra geri bildirimi GÖRÜNÜR alana getir ---
    // Onay/hata kutusu sayfanın tepesinde, Kaydet düğmesi ~150 satır aşağıda.
    // Kaydeden kullanıcı, bastığı yerde hiçbir şey değişmediği için "olmadı"
    // sanıp tekrar basıyordu — oysa ilk tıklama kaydediyordu (ölçüldü: POST
    // gidiyor, ayar yazılıyor, yönlendirme dönüyor). Mesajı düğmenin yanına
    // KOPYALAMAK yerine kullanıcıyı mesaja getiriyoruz: tek kaynak korunur,
    // ekran okuyucu için role="status"/role="alert" yerinde kalır.
    var bildirim = document.getElementById('ApyaNavError') ||
                   document.getElementById('ApyaNavSaved');
    if (bildirim && typeof bildirim.scrollIntoView === 'function') {
        // Hizalama 'center' değil 'nearest': kutu zaten görünür alandaysa
        // sayfa boşuna zıplamasın.
        bildirim.scrollIntoView({ block: 'nearest' });
    }
});
