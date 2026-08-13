/* =============================================================================
   APYA SIDEBAR SHELL — kabuk handoff'unun sol menü davranışları
   -----------------------------------------------------------------------------
   Kabuk LeptonX'in KENDİ menü render'ının üstüne kurulur; markup yeniden
   üretilmez (kullanıcı kararı 2026-08-13: "DOM zenginleştirmeyle devam et").
   Menü AĞACI PlatformMenuContributor'da değişir — burada yalnız temanın
   basmadığı davranışlar eklenir:

     · bölüm katlama (başlıklar temada tıklanamaz overline'dı)
     · sabitleme iğnesi + SABİTLENENLER bölümü
     · Projeler satırına "+" ve proje alt listesi
     · rozetler (geciken görev / bekleyen başvuru / webhook hatası)
     · dip blok: Ayarlar iki satır + sistem durumu

   VERİ: tek çağrı — /api/app/shell/state (ShellAppService). Rozet ve proje
   listesi oradan gelir; sabitlemeler SUNUCUDA saklanır (cihazlar arası taşınsın),
   yerleşim durumları (hangi bölüm kapalı) localStorage'da yeterli.

   ÖĞE KİMLİĞİ: LeptonX her menü anchor'ına `id="MenuItem_Apya_Finance_CashAccounts"`
   basıyor → menü ADI DOM'dan geri okunabiliyor. Sabitlemede etiket değil ad
   saklanır: dil değişince veya etiket güncellenince sabitlemeler kaybolmasın.
   ============================================================================= */
$(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var sidebar = document.getElementById('lpx-sidebar');
    var menuRoot = sidebar && sidebar.querySelector('ul.lpx-nav-menu');
    if (!menuRoot) { return; }

    var LAYOUT_KEY = 'apya-shell-layout';
    var state = null;          // sunucudan gelen ShellStateDto
    var pins = [];             // string[] menü adı
    var layout = readLayout(); // { sections: {ad: kapalıMı}, projectsOpen: bool, pinnedOpen: bool }

    // --- yerleşim kalıcılığı (yalnız bu cihaz) ---
    function readLayout() {
        try {
            var raw = localStorage.getItem(LAYOUT_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return {
                sections: parsed.sections || {},
                projectsOpen: parsed.projectsOpen !== false,
                pinnedOpen: parsed.pinnedOpen !== false,
                boardsOpen: parsed.boardsOpen !== false
            };
        } catch (e) {
            return { sections: {}, projectsOpen: true, pinnedOpen: true, boardsOpen: true };
        }
    }
    function saveLayout() {
        try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch (e) { /* kota/gizli mod */ }
    }

    function menuNameOf(anchor) {
        var id = anchor && anchor.id;
        if (!id || id.indexOf('MenuItem_') !== 0) { return null; }
        // Menü adlarında alt çizgi kullanılmıyor (hepsi "Apya.Alan.Öğe"),
        // bu yüzden ters çevirme güvenli.
        return id.substring('MenuItem_'.length).replace(/_/g, '.');
    }

    function sectionItems() {
        return Array.prototype.filter.call(
            menuRoot.children,
            function (li) { return li.querySelector(':scope > ul.lpx-inner-menu'); });
    }

    function leafAnchors() {
        return Array.prototype.filter.call(
            sidebar.querySelectorAll('a.lpx-menu-item-link[href]'),
            function (a) {
                var href = a.getAttribute('href');
                if (!href || href === '#') { return false; }
                // bölüm başlığı değil (kendi alt listesi olan öğe)
                return !a.parentElement.querySelector(':scope > ul.lpx-inner-menu');
            });
    }

    function svgIcon(path, size) {
        var s = size || 12;
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 20 20" fill="none" ' +
               'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
               'stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
    }
    var ICON_CHEVRON = '<path d="M5 8l5 5 5-5"></path>';
    var ICON_PIN = '<path d="M10 2.5v6M10 8.5l4 4v2H6v-2l4-4zM10 14.5v3"></path>';
    var ICON_PLUS = '<path d="M10 4.5v11M4.5 10h11"></path>';

    // =========================================================================
    // 1) Bölüm katlama
    // Temada bölüm başlığı `pointer-events:none` bir overline'dı; burada
    // gerçek bir aç/kapa denetimine dönüşür (aria-expanded ile).
    // =========================================================================
    function setupSections() {
        sectionItems().forEach(function (li) {
            var head = li.querySelector(':scope > a.lpx-menu-item-link');
            var list = li.querySelector(':scope > ul.lpx-inner-menu');
            if (!head || !list) { return; }

            // Bölüm başlıklarının URL'si yok → LeptonX id BASMIYOR, menü adı
            // okunamıyor. Katlama anahtarı olarak etiket metnine düşülür: dil
            // değişirse o bölüm bir kez açık gelir (kabul edilebilir), veri
            // kaybı olmaz.
            var name = menuNameOf(head) || (head.textContent || '').trim();
            li.classList.add('apya-shell-section');

            var chevron = document.createElement('span');
            chevron.className = 'apya-shell-section-chevron';
            chevron.innerHTML = svgIcon(ICON_CHEVRON, 10);
            head.insertBefore(chevron, head.firstChild);

            head.setAttribute('role', 'button');
            head.setAttribute('tabindex', '0');

            var apply = function (collapsed) {
                li.classList.toggle('apya-shell-section--collapsed', collapsed);
                head.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            };
            apply(!!layout.sections[name]);

            var toggle = function (e) {
                e.preventDefault();
                var collapsed = !li.classList.contains('apya-shell-section--collapsed');
                layout.sections[name] = collapsed;
                saveLayout();
                apply(collapsed);
            };
            head.addEventListener('click', toggle);
            head.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { toggle(e); }
            });
        });
    }

    // =========================================================================
    // 2) Sabitleme iğneleri + SABİTLENENLER bölümü
    // =========================================================================
    function setupPins() {
        leafAnchors().forEach(function (a) {
            var name = menuNameOf(a);
            if (!name || a.closest('.apya-pinned-section')) { return; }

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'apya-shell-pin';
            btn.innerHTML = svgIcon(ICON_PIN, 12);
            btn.dataset.menuName = name;
            a.appendChild(btn);
            syncPinButton(btn);

            btn.addEventListener('click', function (e) {
                // Maddeye gitmesin — yalnız sabitlesin.
                e.preventDefault();
                e.stopPropagation();
                togglePin(name);
            });
        });
        renderPinnedSection();
    }

    function syncPinButton(btn) {
        var pinned = pins.indexOf(btn.dataset.menuName) !== -1;
        btn.classList.toggle('is-pinned', pinned);
        btn.setAttribute('aria-pressed', pinned ? 'true' : 'false');
        btn.setAttribute('aria-label', (pinned ? 'Sabitlemeyi kaldır: ' : 'Sabitle: ') + labelOf(btn.dataset.menuName));
        btn.title = pinned ? 'Sabitlemeyi kaldır' : 'Sabitle';
    }

    function anchorByName(name) {
        return sidebar.querySelector('a[id="MenuItem_' + name.replace(/\./g, '_') + '"]');
    }
    function labelOf(name) {
        var a = anchorByName(name);
        var t = a && a.querySelector('.lpx-menu-item-text');
        return t ? t.textContent.trim() : name;
    }

    function togglePin(name) {
        var i = pins.indexOf(name);
        if (i === -1) { pins.push(name); } else { pins.splice(i, 1); }

        sidebar.querySelectorAll('.apya-shell-pin').forEach(syncPinButton);
        renderPinnedSection();

        // Sunucuya yaz — başarısız olursa sessizce yut: sabitleme kritik değil,
        // kullanıcıya hata kutusu göstermek gezinmeyi bölerdi. Bir sonraki
        // sayfa yüklemesinde sunucudaki hâl geri gelir.
        var token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
        fetch('/api/app/shell/set-pins', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token ? decodeURIComponent(token) : ''
            },
            body: JSON.stringify(pins)
        }).catch(function () { /* yoksay */ });
    }

    function renderPinnedSection() {
        var existing = menuRoot.querySelector('.apya-pinned-section');
        if (existing) { existing.remove(); }
        if (!pins.length) { return; }

        var li = document.createElement('li');
        li.className = 'outer-menu-item apya-shell-section apya-pinned-section';

        var head = document.createElement('a');
        head.className = 'lpx-menu-item-link lpx-menu-item';
        head.href = '#';
        head.setAttribute('role', 'button');
        head.setAttribute('tabindex', '0');
        head.innerHTML = '<span class="apya-shell-section-chevron">' + svgIcon(ICON_CHEVRON, 10) + '</span>' +
                         '<span class="lpx-menu-item-text">Sabitlenenler</span>';

        var list = document.createElement('ul');
        list.className = 'lpx-inner-menu';

        pins.forEach(function (name) {
            var src = anchorByName(name);
            if (!src) { return; } // yetki değişmiş olabilir — sessizce atla
            var item = document.createElement('li');
            item.className = 'lpx-inner-menu-item';
            var a = document.createElement('a');
            a.className = 'lpx-menu-item-link lpx-menu-item';
            a.href = src.getAttribute('href');
            var icon = src.querySelector('.lpx-menu-item-icon');
            a.innerHTML = (icon ? icon.outerHTML : '') +
                          '<span class="lpx-menu-item-text">' + labelOf(name) + '</span>';
            item.appendChild(a);
            list.appendChild(item);
        });

        if (!list.children.length) { return; }

        li.appendChild(head);
        li.appendChild(list);
        menuRoot.insertBefore(li, menuRoot.firstChild);

        var apply = function (collapsed) {
            li.classList.toggle('apya-shell-section--collapsed', collapsed);
            head.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        };
        apply(!layout.pinnedOpen);
        var toggle = function (e) {
            e.preventDefault();
            layout.pinnedOpen = li.classList.contains('apya-shell-section--collapsed');
            saveLayout();
            apply(!layout.pinnedOpen);
        };
        head.addEventListener('click', toggle);
        head.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { toggle(e); }
        });
    }

    // =========================================================================
    // 2b) Panolar grubu varsayılan AÇIK
    // sidebar-toggle.js tüm 2. seviye grupları kapalı başlatıyor. O kural
    // YÖNETİM'in alt grupları (Kiracı/Kimlik/Platform/Geri Bildirim) için
    // konmuştu; YÖNETİM kalktı ve artık tek 2. seviye grup Panolar. Görevler
    // oraya taşınınca günlük kullanılan sayfa kapalı grubun ardında kalıyor,
    // geciken rozeti de görünmüyordu (ölçüldü). Handoff da Panolar'ı açık
    // gösteriyor. Durum kullanıcı başına saklanır.
    // =========================================================================
    function setupBoards() {
        // DİKKAT: LeptonX `id="MenuItem_..."` yalnız URL'Sİ OLAN yaprak öğelere
        // basıyor; grup başlıklarında id yok (yalnız title). Bu yüzden Panolar
        // adıyla bulunamaz — bilinen bir ÇOCUĞUNDAN yukarı yürünür.
        var child = anchorByName('Apya.Work.Tasks') || anchorByName('Apya.Work.Board');
        var li = child && child.closest('li.lpx-inner-menu-item')
                              && child.closest('li.lpx-inner-menu-item').parentElement
                              && child.closest('li.lpx-inner-menu-item').parentElement.closest('li.lpx-inner-menu-item');
        var list = li && li.querySelector(':scope > ul.lpx-inner-menu');
        var anchor = li && li.querySelector(':scope > a.lpx-menu-item-link');
        if (!list || !anchor) { return; }

        var caret = anchor.querySelector('.lpx-caret');
        var applyCaret = function (open) {
            if (!caret) { return; }
            caret.classList.toggle('bi-chevron-up', open);
            caret.classList.toggle('bi-chevron-down', !open);
        };

        if (layout.boardsOpen) {
            list.classList.remove('collapsed');
            applyCaret(true);
        }

        // Temanın kendi aç/kapa handler'ına dokunmuyoruz; tıklamadan SONRA
        // sonucu okuyup kaydediyoruz (handler bu dinleyiciden önce çalışmış olur).
        anchor.addEventListener('click', function () {
            setTimeout(function () {
                layout.boardsOpen = !list.classList.contains('collapsed');
                saveLayout();
            }, 0);
        });
    }

    // =========================================================================
    // 3) Projeler satırı: "+" (yeni proje) + chevron + proje alt listesi
    // =========================================================================
    function setupProjects() {
        var anchor = anchorByName('Apya.Work.Projects');
        if (!anchor || !state.projects || !state.projects.length) { return; }
        var li = anchor.parentElement;

        var add = document.createElement('button');
        add.type = 'button';
        add.className = 'apya-shell-rowbtn';
        add.title = 'Yeni proje';
        add.setAttribute('aria-label', 'Yeni proje');
        add.innerHTML = svgIcon(ICON_PLUS, 13);
        add.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // ABP modal yöneticisi varsa doğrudan aç; yoksa listeye götür
            // (sayfanın kendi "Yeni Proje Ekle" düğmesi orada).
            if (window.abp && abp.ModalManager) {
                new abp.ModalManager('/Projects/CreateModal').open();
            } else {
                location.href = '/Projects';
            }
        });

        var chevron = document.createElement('button');
        chevron.type = 'button';
        chevron.className = 'apya-shell-rowbtn apya-shell-subtoggle';
        chevron.innerHTML = svgIcon(ICON_CHEVRON, 12);

        anchor.appendChild(add);
        anchor.appendChild(chevron);

        var list = document.createElement('ul');
        list.className = 'lpx-inner-menu apya-shell-subnav';
        state.projects.forEach(function (p) {
            var item = document.createElement('li');
            item.className = 'lpx-inner-menu-item';
            var a = document.createElement('a');
            a.className = 'lpx-menu-item-link lpx-menu-item';
            a.href = '/Projects/ProjectDetails?id=' + encodeURIComponent(p.id);
            a.innerHTML =
                '<span class="apya-shell-dot" style="background:' + projectColor(p.name) + '"></span>' +
                '<span class="lpx-menu-item-text">' + escapeHtml(p.name) + '</span>' +
                (p.openTaskCount ? '<span class="apya-shell-count apya-numeric">' + p.openTaskCount + '</span>' : '');
            item.appendChild(a);
            list.appendChild(item);
        });

        var allItem = document.createElement('li');
        allItem.className = 'lpx-inner-menu-item';
        allItem.innerHTML = '<a class="lpx-menu-item-link lpx-menu-item apya-shell-subnav-all" href="/Projects">' +
                            '<span class="apya-shell-dot apya-shell-dot--empty"></span>' +
                            '<span class="lpx-menu-item-text">Tüm projeler</span></a>';
        list.appendChild(allItem);
        li.appendChild(list);

        var apply = function (open) {
            li.classList.toggle('apya-shell-sub--open', open);
            chevron.setAttribute('aria-expanded', open ? 'true' : 'false');
            chevron.setAttribute('aria-label', open ? 'Proje listesini kapat' : 'Proje listesini aç');
        };
        apply(layout.projectsOpen);
        chevron.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            layout.projectsOpen = !layout.projectsOpen;
            saveLayout();
            apply(layout.projectsOpen);
        });
    }

    // Project entity'sinde renk alanı YOK — ad'dan deterministik ton üretilir
    // (projede .apya-assignee-avatar aynı deseni kullanıyor). Şema değişikliği
    // gerektirmez ve aynı proje her sayfada aynı rengi alır.
    var PROJECT_HUES = [212, 262, 152, 32, 342, 192];
    function projectColor(name) {
        var h = 0;
        for (var i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) >>> 0; }
        return 'hsl(' + PROJECT_HUES[h % PROJECT_HUES.length] + ' 62% 52%)';
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // =========================================================================
    // 4) Rozetler
    // =========================================================================
    function setupBadges() {
        var b = state.badges || {};
        // Geciken görev handoff'ta rozet DEĞİL düz sayı — "bekleyen iş" ile
        // "gecikmiş iş" görsel olarak ayrışsın diye.
        addBadge('Apya.Work.Tasks', b.overdueTasks, 'apya-shell-badge--plain');
        addBadge('Apya.Grants.Applications', b.pendingGrantApplications, 'apya-shell-badge--warning');
        addBadge('Apya.Platform.Webhooks', b.webhookErrors, 'apya-shell-badge--negative');
    }

    function addBadge(name, value, variant) {
        if (!value) { return; } // sıfır rozet basılmaz
        var a = anchorByName(name);
        if (!a) { return; }
        var badge = document.createElement('span');
        badge.className = 'apya-shell-badge ' + variant + ' apya-numeric';
        badge.textContent = value;
        // Ekran okuyucu "9" değil ne olduğunu duysun.
        badge.setAttribute('aria-label', value + ' ' + (
            variant === 'apya-shell-badge--plain' ? 'geciken' :
            variant === 'apya-shell-badge--warning' ? 'bekleyen' : 'hatalı'));
        var pin = a.querySelector('.apya-shell-pin');
        if (pin) { a.insertBefore(badge, pin); } else { a.appendChild(badge); }
    }

    // =========================================================================
    // 5) Dip blok — Ayarlar (iki satır) + sistem durumu
    // Ayarlar öğesi akışın sonundan alınıp kenar çubuğunun DİBİNE sabitlenir.
    // =========================================================================
    function setupFooter() {
        var settings = anchorByName('Apya.Settings');
        var nav = sidebar.querySelector('.lpx-nav') || sidebar;
        if (!settings) { return; }

        var foot = document.createElement('div');
        foot.className = 'apya-shell-foot';

        var li = settings.parentElement;
        li.classList.add('apya-shell-foot-item');
        foot.appendChild(li);

        // İkinci satır: katlanan YÖNETİM bölümünün nereye gittiğini açıklar.
        // Handoff bunu açıkça "kaldırılmamalı" diye işaretliyor.
        var hint = document.createElement('span');
        hint.className = 'apya-shell-foot-hint';
        hint.textContent = 'Kiracı · Kimlik · Platform · Geri bildirim';
        settings.appendChild(hint);

        var health = state.health || {};
        var status = document.createElement('div');
        status.className = 'apya-shell-status';
        status.innerHTML =
            '<span class="apya-shell-status-dot' + (health.isHealthy ? '' : ' is-down') + '"></span>' +
            '<span class="apya-shell-status-text">' +
            (health.isHealthy ? 'Tüm sistemler çalışıyor' : 'Sistem sorunu var') + '</span>' +
            (health.version ? '<span class="apya-shell-status-version apya-numeric">' +
             escapeHtml(health.version) + '</span>' : '');
        foot.appendChild(status);

        nav.appendChild(foot);
    }

    // =========================================================================
    // Tek istek, iki tüketici: üst bar (apya-topbar-shell.js) aynı promise'i
    // kullanır — kabuk verisi sayfa başına BİR kez çekilir.
    window.apyaShellState = fetch('/api/app/shell/state', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; });

    window.apyaShellState
        .then(function (data) {
            if (!data) { return; }
            state = data;
            pins = (data.pins || []).slice();

            sidebar.classList.add('apya-shell-ready');
            setupSections();
            setupBoards();
            setupProjects();
            setupBadges();
            setupPins();
            setupFooter();
        })
        .catch(function () {
            // Kabuk verisi gelmezse menü temanın hâliyle çalışmaya devam eder —
            // gezinme sabitleme/rozet uğruna bloklanmaz.
        });
});
