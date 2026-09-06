/* =============================================================================
   APYA SHELL ACTIONS — "+ Yeni" menüsü · yardım menüsü · kısayol penceresi
   -----------------------------------------------------------------------------
   YANLIŞ SÖZ VERME KURALI (handoff): kısayol penceresi YALNIZ gerçekten çalışan
   kısayolları listeler. Bu dosyadaki liste, aşağıda BAĞLANAN tuşlardan üretilir
   — ayrı bir "kısayol tablosu" tutulmaz ki ikisi birbirinden ayrı düşmesin.

   Bugün çalışanlar:
     ⌘/Ctrl K  komut paleti aç/kapat      (command-palette.js)
     ↑ ↓ ↵     palet içinde gez/çalıştır  (command-palette.js)
     Alt ← →   önceki/sonraki ekran       (apya-topbar-shell.js)
     G P H     yeni görev/proje/hibe      (bu dosya)
     /         komut paletini aç          (bu dosya)
     ?         bu pencere                 (bu dosya)
     Esc       açık katmanı kapat         (bu dosya + diğerleri)

   Handoff'ta geçen `⌘\` (menüyü daralt) BAĞLANMADI → listede de YOK.
   ============================================================================= */
$(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var content = document.querySelector('.lpx-topbar-content');
    if (!content) { return; }

    var state = null;

    function svg(path, size, width) {
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 20 20" fill="none" ' +
               'stroke="currentColor" stroke-width="' + (width || 1.8) + '" stroke-linecap="round" ' +
               'stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
    }
    var I_PLUS = '<path d="M10 4.5v11M4.5 10h11"></path>';
    var I_HELP = '<circle cx="10" cy="10" r="7"></circle><path d="M8.2 8a1.9 1.9 0 113.1 1.5c-.6.5-1.3.8-1.3 1.7"></path><path d="M10 14.2h.01"></path>';

    function isTyping(el) {
        if (!el) { return false; }
        var tag = (el.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    }

    // Avatar menüsü satırları kullanıcı/kiracı adı gibi VERİYE dayalı metinleri
    // innerHTML ile basıyor — tek yer bu yüzden burada kaçış gerekiyor.
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Açık katman varsa kısayollar tetiklenmesin (palet, modal, diyalog).
    function overlayOpen() {
        return !!document.querySelector('.apya-command-palette-overlay.open, .apya-shell-dialog:not([hidden]), .modal.show');
    }

    // SAYFA KENDİ KISAYOL SİSTEMİNİ KURDUYSA KABUK ÇEKİLİR.
    // Görev/proje konsolları (apya-task-console.js `bindShortcuts`) `#shortcuts-modal`
    // basıyor ve tek harfleri sahipleniyor: `g l` liste, `g k` kanban, `n` yeni
    // görev, `/` sayfa aramasına odaklan, `j/k/x/1-4` satır işlemleri.
    // Kabuk da `g/p/h` ve `/` bağlarsa ÇAKIŞIR: ölçüldü — `g` basınca kabuk
    // "Yeni Görev" modalını açıyor ve konsolun `g l` dizisi hiç tamamlanamıyor,
    // `/` de sayfa araması yerine paleti açıyor. Yani sayfanın kendi kısayol
    // penceresinde YAZAN şeyler çalışmaz hâle geliyordu.
    // Daha ÖZGÜL olan kazanır: sayfa. ⌘K ve Alt ←/→ çakışmıyor, onlar kalır.
    function pageOwnsShortcuts() {
        return !!document.querySelector('#shortcuts-modal');
    }

    function openModal(url) {
        if (window.abp && abp.ModalManager) { new abp.ModalManager(url).open(); }
        else { location.href = url; }
    }

    // =========================================================================
    // Oluşturma eylemleri — tek kaynak. Menü satırları da, kısayol bağlamaları
    // da, kısayol penceresindeki liste de BURADAN üretilir.
    // =========================================================================
    function createActions() {
        var can = (state && state.can) || {};
        var all = [
            { key: 'g', label: 'Görev', url: '/Tasks/CreateModal', allowed: !!can.createTask },
            { key: 'p', label: 'Proje', url: '/Projects/CreateModal', allowed: !!can.createProject },
            // /Grants/CreateModal bir HİBE (çağrı) oluşturuyor — handoff'taki
            // "Hibe başvurusu" etiketi bu ekranın yaptığı iş DEĞİL; gerçekte
            // ne yarattığıysa o yazılır.
            { key: 'h', label: 'Hibe Çağrısı', url: '/Grants/CreateModal', allowed: !!can.createGrant }
        ];
        return all.filter(function (a) { return a.allowed; });
    }

    // =========================================================================
    // "+ Yeni"
    // =========================================================================
    function buildNewMenu() {
        var actions = createActions();
        if (!actions.length) { return; } // hiçbir şey oluşturamıyorsa düğme de yok

        var wrap = document.createElement('div');
        wrap.className = 'apya-shell-new';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'apya-shell-new-btn';
        btn.innerHTML = svg(I_PLUS, 17, 2.2);
        btn.title = 'Yeni';
        btn.setAttribute('aria-label', 'Yeni oluştur');
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');

        var menu = document.createElement('div');
        menu.className = 'apya-shell-menu apya-shell-new-menu';
        menu.setAttribute('role', 'menu');
        menu.hidden = true;
        menu.innerHTML = actions.map(function (a) {
            return '<button type="button" class="apya-shell-menu-row" role="menuitem" data-url="' + a.url + '">' +
                   '<span>' + a.label + '</span>' +
                   '<kbd class="apya-shell-kbd">' + a.key.toUpperCase() + '</kbd></button>';
        }).join('');

        wrap.appendChild(btn);
        wrap.appendChild(menu);
        content.appendChild(wrap);

        bindMenu(btn, menu);
        menu.addEventListener('click', function (e) {
            var row = e.target.closest('.apya-shell-menu-row');
            if (!row) { return; }
            closeMenu(btn, menu);
            openModal(row.dataset.url);
        });
    }

    // =========================================================================
    // "Kullanıcı Ekle"
    // Handoff'ta bu düğme "Davet et" diye geçiyor; projede davet akışı
    // (e-posta + token) YOK, düğme ABP Identity'nin kullanıcı oluşturma
    // modalını açıyor. Etiket gerçekte yapılan işi söyler — "Davet et" deyip
    // kullanıcı oluşturmak yanlış söz olurdu (kullanıcı kararı 2026-08-14).
    // Yetkisi olmayanda DOM'da hiç bulunmaz (gizlenmez).
    // =========================================================================
    function buildInviteButton() {
        if (!state || !state.can || !state.can.createUser) { return; }

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'apya-shell-invite';
        btn.innerHTML = svg('<path d="M13 15.5v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1"></path>' +
                            '<circle cx="8" cy="6.5" r="2.5"></circle>' +
                            '<path d="M15 6.5v4M17 8.5h-4"></path>', 15, 1.7) +
                        '<span class="apya-shell-invite-label">Kullanıcı Ekle</span>';
        btn.title = 'Kullanıcı Ekle';
        btn.setAttribute('aria-label', 'Kullanıcı Ekle');
        btn.addEventListener('click', function () { openModal('/Identity/Users/CreateModal'); });
        content.appendChild(btn);
    }

    // =========================================================================
    // Yardım
    // =========================================================================
    function buildHelpMenu() {
        var wrap = document.createElement('div');
        wrap.className = 'apya-shell-help';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'apya-shell-help-btn';
        btn.innerHTML = svg(I_HELP, 17, 1.7);
        btn.title = 'Yardım';
        btn.setAttribute('aria-label', 'Yardım');
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');

        var menu = document.createElement('div');
        menu.className = 'apya-shell-menu apya-shell-help-menu';
        menu.setAttribute('role', 'menu');
        menu.hidden = true;

        var healthy = !(state && state.health) || state.health.isHealthy !== false;
        // Geri bildirim satırı: sayfadaki MEVCUT tetikleyiciye delege eder,
        // ikinci bir akış kurmaz (eski barda bu link iki kez geçiyordu).
        var hasFeedback = !!document.querySelector('.apya-feedback-open-link');

        // Tanıtım turu (2026-09-06 avatar menüsü revizyonu): satır avatar
        // menüsünden buraya taşındı — erişim kaybolmasın diye. Href/etiket
        // PlatformMenuContributor'ın kullanıcı menüsüne eklediği ("Apya.
        // Account.Tour") ve LeptonX'in ZATEN bastığı öğeden okunur; ikinci
        // bir URL/etiket kaynağı açılmaz (bkz. buildAvatarMenu()).
        var tourAnchor = (function () {
            var p = content.querySelector('.lpx-user-profile');
            var d = p && p.closest('.dropdown');
            return d && d.querySelector('.dropdown-menu a[href*="tur=1"]');
        })();
        var tourHref = tourAnchor ? tourAnchor.getAttribute('href') : null;
        var tourLabel = tourAnchor ? (tourAnchor.textContent || '').trim() : '';

        menu.innerHTML =
            '<button type="button" class="apya-shell-menu-row" role="menuitem" data-act="palette">' +
                '<span>Komut paleti</span><kbd class="apya-shell-kbd">' + modLabel() + 'K</kbd></button>' +
            '<button type="button" class="apya-shell-menu-row" role="menuitem" data-act="shortcuts">' +
                '<span>Klavye kısayolları</span><kbd class="apya-shell-kbd">?</kbd></button>' +
            (tourHref
                ? '<button type="button" class="apya-shell-menu-row" role="menuitem" data-act="tour">' +
                  '<span>' + escapeHtml(tourLabel || 'Tanıtım turu') + '</span></button>'
                : '') +
            (hasFeedback
                ? '<button type="button" class="apya-shell-menu-row" role="menuitem" data-act="feedback">' +
                  '<span>Bu sayfa hakkında geri bildirim</span></button>'
                : '') +
            '<div class="apya-shell-menu-sep"></div>' +
            '<div class="apya-shell-menu-status">' +
                '<span class="apya-shell-status-dot' + (healthy ? '' : ' is-down') + '"></span>' +
                '<span>' + (healthy ? 'Tüm sistemler çalışıyor' : 'Sistem sorunu var') + '</span></div>';

        wrap.appendChild(btn);
        wrap.appendChild(menu);
        content.appendChild(wrap);

        bindMenu(btn, menu);
        menu.addEventListener('click', function (e) {
            var row = e.target.closest('.apya-shell-menu-row');
            if (!row) { return; }
            closeMenu(btn, menu);
            var act = row.dataset.act;
            if (act === 'palette') { openPalette(); }
            if (act === 'shortcuts') { openShortcuts(); }
            if (act === 'tour') { location.href = tourHref; }
            if (act === 'feedback') { document.querySelector('.apya-feedback-open-link').click(); }
        });
    }

    function modLabel() {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl ';
    }

    // =========================================================================
    // Menü ortak davranışı — tek seferde tek menü, dışa tıklama + Esc kapatır,
    // kapanışta odak tetiğe döner.
    // =========================================================================
    var openPair = null;
    function bindMenu(btn, menu) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!menu.hidden) { closeMenu(btn, menu); return; }
            if (openPair) { closeMenu(openPair[0], openPair[1]); }
            menu.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
            btn.classList.add('is-open');
            openPair = [btn, menu];
            document.addEventListener('click', onDoc);
            document.addEventListener('keydown', onKey);
            var first = menu.querySelector('.apya-shell-menu-row');
            if (first) { first.focus(); }
        });
        function onDoc(e) { if (!menu.contains(e.target)) { closeMenu(btn, menu); } }
        function onKey(e) {
            if (e.key === 'Escape') { closeMenu(btn, menu); btn.focus(); return; }
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') { return; }
            e.preventDefault();
            var rows = [].slice.call(menu.querySelectorAll('.apya-shell-menu-row'));
            var i = rows.indexOf(document.activeElement);
            var next = e.key === 'ArrowDown' ? i + 1 : i - 1;
            if (next < 0) { next = rows.length - 1; }
            if (next >= rows.length) { next = 0; }
            if (rows[next]) { rows[next].focus(); }
        }
        menu._cleanup = function () {
            document.removeEventListener('click', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }
    function closeMenu(btn, menu) {
        menu.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-open');
        if (menu._cleanup) { menu._cleanup(); }
        if (openPair && openPair[1] === menu) { openPair = null; }
    }

    function openPalette() {
        var trigger = document.getElementById('ApyaCommandPaletteTrigger');
        if (trigger) { trigger.click(); }
    }

    // =========================================================================
    // Kısayol penceresi — liste yukarıdaki BAĞLANMIŞ tuşlardan üretilir.
    // =========================================================================
    var dialog = null;
    // Liste BAĞLAMA GÖRE üretilir: sayfa tek harfleri sahiplenmişse kabuk
    // onları bağlamıyor demektir, o hâlde LİSTELEMEZ de. Aksi hâlde pencere
    // "hepsi şu an çalışıyor" derken çalışmayan satır gösterirdi.
    function shortcutGroups() {
        var sayfaSahip = pageOwnsShortcuts();
        var paletRows = [
            [modLabel() + 'K', 'aç / kapat'],
            ['↑ ↓', 'gez'],
            ['↵', 'çalıştır']
        ];
        if (!sayfaSahip) { paletRows.push(['/', 'paleti aç']); }

        var groups = [
            ['KOMUT PALETİ', paletRows],
            ['GEZİNME', [
                ['Alt ←', 'önceki ekran'],
                ['Alt →', 'sonraki ekran']
            ]],
            ['YARDIM', sayfaSahip ? [['Esc', 'kapat']] : [['?', 'bu pencere'], ['Esc', 'kapat']]]
        ];

        if (!sayfaSahip) {
            var creates = createActions().map(function (a) {
                return [a.key.toUpperCase(), 'Yeni ' + a.label.toLocaleLowerCase('tr')];
            });
            if (creates.length) { groups.splice(2, 0, ['OLUŞTUR', creates]); }
        }
        return groups;
    }

    function openShortcuts() {
        if (dialog) { dialog.hidden = false; dialog.querySelector('.apya-shell-dialog-close').focus(); return; }

        dialog = document.createElement('div');
        dialog.className = 'apya-shell-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', 'Klavye kısayolları');

        var cols = shortcutGroups().map(function (g) {
            return '<div class="apya-shell-dialog-group"><div class="apya-shell-dialog-grouphead">' + g[0] + '</div>' +
                   g[1].map(function (row) {
                       return '<div class="apya-shell-dialog-row"><span>' + row[1] + '</span>' +
                              '<kbd class="apya-shell-kbd">' + row[0] + '</kbd></div>';
                   }).join('') + '</div>';
        }).join('');

        dialog.innerHTML =
            '<div class="apya-shell-dialog-panel">' +
              '<div class="apya-shell-dialog-head">' +
                '<div><div class="apya-shell-dialog-title">Klavye kısayolları</div>' +
                '<div class="apya-shell-dialog-sub">Hepsi şu an çalışıyor — deneyebilirsin.</div></div>' +
                '<button type="button" class="apya-shell-dialog-close" aria-label="Kapat">✕</button>' +
              '</div>' +
              '<div class="apya-shell-dialog-body">' + cols + '</div>' +
            '</div>';

        document.body.appendChild(dialog);

        var closeBtn = dialog.querySelector('.apya-shell-dialog-close');
        closeBtn.addEventListener('click', closeShortcuts);
        dialog.addEventListener('click', function (e) { if (e.target === dialog) { closeShortcuts(); } });

        // Odak tuzağı — diyalog açıkken Tab dışarı çıkmasın.
        dialog.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { e.stopPropagation(); closeShortcuts(); return; }
            if (e.key !== 'Tab') { return; }
            var f = dialog.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
            if (!f.length) { return; }
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
        closeBtn.focus();
    }
    function closeShortcuts() {
        if (dialog) { dialog.hidden = true; }
    }

    // =========================================================================
    // Avatar menüsü — kimlik bloğu + Profil/Görünüm sekmeleri
    // (Avatar Profil Menüsü handoff, 2026-09-06, Faz 1)
    //
    // Bootstrap'in KENDİ dropdown mekanizması (aç/kapat, dış tıklama, Esc,
    // `.dropdown-item` satırları arası ↑↓ — bkz. bootstrap.bundle.js
    // SELECTOR_VISIBLE_ITEMS) KORUNUR; yalnız İÇERİĞİ değiştirilir. Temanın
    // kendi öğeleri (Hesabım, Genel Ayarlar, Tanıtım turu, Çıkış) SİLİNMEZ —
    // href/metinleri buradan OKUNUP kendi satırlarımızda kullanılır (ikinci
    // bir URL kaynağı açılmaz, PlatformMenuContributor/ABP Account modülü tek
    // kaynak kalır), sonra CSS ile gizlenir (apya-shell.css, `:has(> .apya-
    // avatar-menu)`). Tanıtım turu satırı artık burada değil — yardım
    // menüsünde (bkz. buildHelpMenu).
    //
    // Görünüm sekmesindeki dört denetim (Dil/Tema/Yoğunluk/Kenar çubuğu) eski
    // davranışla AYNI teknikle taşınır (yeniden üretilmez) — bkz. aşağıdaki
    // yorum, bu fazda değişmedi.
    // =========================================================================
    function buildAvatarMenu() {
        // DİKKAT: `document.querySelector('.lpx-user-profile')` MOBİL navbar'ın
        // kopyasını döndürüyor (0 boyutlu, .lpx-mobile-navbar-container içinde).
        // Aynı tuzak `.lpx-logo-container`da da vardı — tema aynı sınıfı iki kez
        // basıyor. Arama ÜST BARA kısıtlanır.
        var profile = content.querySelector('.lpx-user-profile');
        var dropdown = profile && profile.closest('.dropdown');
        var toggle = dropdown && dropdown.querySelector('[data-bs-toggle="dropdown"]');
        var menu = dropdown && dropdown.querySelector('.dropdown-menu');
        if (!menu || !toggle) { return; }

        function extractItem(hrefPart) {
            var a = menu.querySelector('a[href*="' + hrefPart + '"]');
            return a ? { href: a.getAttribute('href'), label: (a.textContent || '').trim() } : null;
        }
        var manageItem = extractItem('/Account/Manage');
        var logoutItem = extractItem('/Account/Logout');
        var settingsItem = extractItem('/Settings');

        var tenantRoot = document.getElementById('apya-tenant-switch');
        var tenantCanSwitch = !!(tenantRoot && tenantRoot.classList.contains('dropdown'));

        var section = document.createElement('div');
        section.className = 'apya-avatar-menu';

        var avatarSlot = document.createElement('span');
        avatarSlot.className = 'apya-avatar-menu-avatar';
        var nameEl = document.createElement('div');
        nameEl.className = 'apya-avatar-menu-name';
        var roleEl = document.createElement('div');
        roleEl.className = 'apya-avatar-menu-role';
        var idText = document.createElement('div');
        idText.className = 'apya-avatar-menu-idtext';
        idText.appendChild(nameEl);
        idText.appendChild(roleEl);
        var identity = document.createElement('div');
        identity.className = 'apya-avatar-menu-identity';
        identity.appendChild(avatarSlot);
        identity.appendChild(idText);
        section.appendChild(identity);

        var tabs = document.createElement('div');
        tabs.className = 'apya-avatar-menu-tabs';
        tabs.setAttribute('role', 'tablist');
        tabs.innerHTML =
            '<button type="button" class="apya-avatar-menu-tab" data-tab="profile" role="tab">Profil</button>' +
            '<button type="button" class="apya-avatar-menu-tab" data-tab="appearance" role="tab">Görünüm</button>';
        section.appendChild(tabs);

        // --- Profil sekmesi ---
        var profilePanel = document.createElement('div');
        profilePanel.className = 'apya-avatar-menu-panel';
        profilePanel.dataset.panel = 'profile';

        var rows = '';
        if (tenantCanSwitch) {
            rows += '<button type="button" class="apya-shell-menu-row dropdown-item" role="menuitem" data-act="tenant">' +
                '<i class="fa fa-building" aria-hidden="true"></i><span class="apya-avatar-menu-tenant-name"></span>' +
                '<i class="fa fa-chevron-right" aria-hidden="true"></i></button>';
        } else {
            rows += '<div class="apya-shell-menu-row is-static">' +
                '<i class="fa fa-building" aria-hidden="true"></i><span class="apya-avatar-menu-tenant-name"></span></div>';
        }
        if (manageItem) {
            rows += '<a class="apya-shell-menu-row dropdown-item" role="menuitem" href="' + manageItem.href + '">' +
                '<i class="fa fa-gear" aria-hidden="true"></i><span>' + escapeHtml(manageItem.label) + '</span></a>';
        }
        rows += '<button type="button" class="apya-shell-menu-row dropdown-item" role="menuitem" data-act="notif-prefs">' +
            // fa-bell REGULAR (fa-regular) değil — bu depoda tek yüklü yüz
            // "Font Awesome 7 Free" 900/solid; regular ağırlık YÜKLENMİYOR
            // (bkz. reference-fontawesome-version). Bare "fa" = solid.
            '<i class="fa fa-bell" aria-hidden="true"></i><span>Bildirim tercihleri</span></button>';
        if (settingsItem) {
            rows += '<a class="apya-shell-menu-row dropdown-item" role="menuitem" href="' + settingsItem.href + '">' +
                '<i class="fa fa-sliders" aria-hidden="true"></i><span>' + escapeHtml(settingsItem.label) + '</span></a>';
        }
        rows += '<button type="button" class="apya-shell-menu-row dropdown-item" role="menuitem" data-act="shortcuts">' +
            '<i class="fa fa-keyboard" aria-hidden="true"></i><span>Klavye kısayolları</span>' +
            '<kbd class="apya-shell-kbd">?</kbd></button>';
        rows += '<button type="button" class="apya-shell-menu-row dropdown-item" role="menuitem" data-act="appearance-tab">' +
            '<i class="fa fa-eye" aria-hidden="true"></i><span>Görünüm</span>' +
            '<span class="apya-avatar-menu-summary"></span></button>';
        if (logoutItem) {
            rows += '<div class="apya-shell-menu-sep"></div>' +
                '<a class="apya-shell-menu-row dropdown-item" role="menuitem" href="' + logoutItem.href + '">' +
                '<i class="fa fa-power-off" aria-hidden="true"></i><span>' + escapeHtml(logoutItem.label) + '</span></a>';
        }
        profilePanel.innerHTML = rows;
        section.appendChild(profilePanel);

        // --- Görünüm sekmesi — bugünkü dört denetim, AYNI teknikle taşınır ---
        var appearancePanel = document.createElement('div');
        appearancePanel.className = 'apya-avatar-menu-panel';
        appearancePanel.dataset.panel = 'appearance';
        appearancePanel.hidden = true;

        var entries = [
            ['.lpx-language-selection', 'Dil'],
            ['.apya-theme-toggle', 'Tema'],
            ['.apya-density-toggle', 'Yoğunluk'],
            ['.apya-sidebar-mode', 'Kenar çubuğu']
        ].map(function (e) { return { el: content.querySelector(':scope > ' + e[0]), label: e[1] }; })
         .filter(function (e) { return !!e.el; });
        entries.forEach(function (e) {
            var item = document.createElement('div');
            item.className = 'apya-avatar-menu-item';
            var label = document.createElement('span');
            label.className = 'apya-avatar-menu-label';
            label.textContent = e.label;
            item.appendChild(label);
            item.appendChild(e.el);
            appearancePanel.appendChild(item);
        });
        // Handoff: "Görünüm sekmesinde de altta aynı ayraç + Çıkış satırı durur".
        if (logoutItem) {
            var sep = document.createElement('div');
            sep.className = 'apya-shell-menu-sep';
            appearancePanel.appendChild(sep);
            var logoutRow2 = document.createElement('a');
            logoutRow2.className = 'apya-shell-menu-row dropdown-item';
            logoutRow2.setAttribute('role', 'menuitem');
            logoutRow2.href = logoutItem.href;
            logoutRow2.innerHTML = '<i class="fa fa-power-off" aria-hidden="true"></i><span>' + escapeHtml(logoutItem.label) + '</span>';
            appearancePanel.appendChild(logoutRow2);
        }
        section.appendChild(appearancePanel);

        menu.appendChild(section);

        // Menü içindeki tıklama dropdown'ı kapatmasın (Görünüm sekmesindeki
        // denetimler DELEGE dinleyici kullanıyor — bkz. eski yorum, ölçüldü:
        // stopPropagation onları öldürüyordu). Bootstrap'in kendi mekanizması
        // hem menüyü açık tutar hem olayı document'e ulaştırır.
        toggle.setAttribute('data-bs-auto-close', 'outside');

        function setActiveTab(tab) {
            tabs.querySelectorAll('.apya-avatar-menu-tab').forEach(function (b) {
                var active = b.dataset.tab === tab;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            profilePanel.hidden = tab !== 'profile';
            appearancePanel.hidden = tab !== 'appearance';
        }
        tabs.addEventListener('click', function (e) {
            var b = e.target.closest('.apya-avatar-menu-tab');
            if (b) { setActiveTab(b.dataset.tab); }
        });

        function syncAvatar() {
            // Menü, üst bardaki 30px rozeti (dark-mode.js tryReplaceUserAvatar)
            // KLONLAR — baş harf/renk hesabı İKİNCİ bir yerde tekrarlanmaz (bkz.
            // reference-abp-currentuser-surname, iki kopya zaten var). Rozet
            // dark-mode.js'in MutationObserver'ı yüzünden gecikebildiği için
            // senkron her menü AÇILIŞINDA tekrarlanır (bkz. shown.bs.dropdown).
            var src = document.querySelector('.lpx-user-profile .apya-user-avatar');
            avatarSlot.innerHTML = '';
            var badge = src ? src.cloneNode(true) : document.createElement('span');
            if (!src) { badge.className = 'apya-avatar apya-avatar-brand'; }
            badge.classList.remove('apya-user-avatar');
            badge.classList.add('apya-avatar-lg');
            var dot = document.createElement('span');
            dot.className = 'apya-avatar-dot';
            dot.setAttribute('aria-hidden', 'true');
            badge.appendChild(dot);
            avatarSlot.appendChild(badge);
            nameEl.textContent = badge.title || '';
        }

        function syncIdentityText() {
            var cu = (window.abp && abp.currentUser) || {};
            var role = (cu.roles && cu.roles.length) ? cu.roles[0] : '';
            var tenantName = (tenantRoot && (tenantRoot.querySelector('.apya-tenant-switch-name') || {}).textContent || '').trim();
            profilePanel.querySelectorAll('.apya-avatar-menu-tenant-name').forEach(function (el) {
                el.textContent = tenantName;
            });
            roleEl.textContent = [role, tenantName].filter(Boolean).join(' · ');
            roleEl.hidden = !roleEl.textContent;
        }

        function updateSummary() {
            var summaryEl = profilePanel.querySelector('.apya-avatar-menu-summary');
            if (!summaryEl) { return; }
            var cultureName = (window.abp && abp.localization && abp.localization.currentCulture && abp.localization.currentCulture.name) || document.documentElement.lang || '';
            var lang = cultureName.slice(0, 2).toUpperCase();
            var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Koyu' : 'Açık';
            var density = '';
            if (window.apya && apya.density) {
                var toggleEl = document.getElementById('DensityToggle');
                var raw = toggleEl ? (toggleEl.getAttribute('data-label-' + apya.density.current()) || '') : '';
                density = raw.split(':').pop().trim();
            }
            summaryEl.textContent = [lang, theme, density].filter(Boolean).join(' · ');
        }

        section.addEventListener('click', function (e) {
            var actBtn = e.target.closest('[data-act]');
            if (!actBtn) { return; }
            var act = actBtn.dataset.act;
            if (act === 'appearance-tab') { setActiveTab('appearance'); return; }
            var inst = window.bootstrap && bootstrap.Dropdown.getInstance(toggle);
            if (act === 'tenant') {
                if (inst) { inst.hide(); }
                // DİKKAT: TenantBadge/Default.cshtml düğmesi `.dropdown-toggle`
                // SINIFI TAŞIMAZ — Bootstrap'ı çalıştıran `data-bs-toggle`
                // özniteliğidir (ölçüldü, 2026-09-06). Sınıfa göre arama sessizce
                // hiçbir şey bulamıyordu.
                var tenantToggle = tenantRoot.querySelector('[data-bs-toggle="dropdown"]');
                // Menünün kendi kapanış geçişiyle çakışmasın diye bir sonraki
                // görev döngüsünde tıklanır — aynı akış tetiklenir, ikinci bir
                // müşteri değiştirme mantığı KURULMAZ.
                if (tenantToggle) { setTimeout(function () { tenantToggle.click(); }, 0); }
            } else if (act === 'shortcuts') {
                if (inst) { inst.hide(); }
                openShortcuts();
            } else if (act === 'notif-prefs') {
                if (inst) { inst.hide(); }
                location.href = '/Notifications?tercihler=1';
            }
        });

        // Menü HER açıldığında Profil sekmesiyle başlar (handoff: "menü her
        // açıldığında Profil ile başlar") ve kimlik/özet verisi tazelenir —
        // sekme seçimi menü kapanınca hafızada TUTULMAZ.
        $(toggle).on('shown.bs.dropdown', function () {
            syncAvatar();
            syncIdentityText();
            updateSummary();
            setActiveTab('profile');
            var first = profilePanel.querySelector('.apya-shell-menu-row');
            if (first) { first.focus(); }
        });
    }

    // =========================================================================
    // Global kısayollar
    // =========================================================================
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) { return; }
        if (isTyping(e.target)) { return; }

        // Sayfa kendi kısayollarını sahipleniyorsa kabuk hiçbirine dokunmaz —
        // `?` de dahil, çünkü orada sayfanın kendi (daha ayrıntılı) penceresi
        // açılmalı. Kabuk penceresine yardım menüsünden hâlâ ulaşılabilir.
        if (pageOwnsShortcuts()) { return; }

        if (e.key === '?') { e.preventDefault(); openShortcuts(); return; }
        if (e.key === '/') { e.preventDefault(); openPalette(); return; }

        if (overlayOpen()) { return; }
        var hit = createActions().filter(function (a) { return a.key === e.key.toLowerCase(); })[0];
        if (hit) { e.preventDefault(); openModal(hit.url); }
    });

    (window.apyaShellState || Promise.resolve(null))
        .then(function (s) { state = s; buildInviteButton(); buildNewMenu(); buildHelpMenu(); buildAvatarMenu(); })
        .catch(function () { buildHelpMenu(); buildAvatarMenu(); });
});
