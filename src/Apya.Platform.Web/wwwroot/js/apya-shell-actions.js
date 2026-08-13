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

        menu.innerHTML =
            '<button type="button" class="apya-shell-menu-row" role="menuitem" data-act="palette">' +
                '<span>Komut paleti</span><kbd class="apya-shell-kbd">' + modLabel() + 'K</kbd></button>' +
            '<button type="button" class="apya-shell-menu-row" role="menuitem" data-act="shortcuts">' +
                '<span>Klavye kısayolları</span><kbd class="apya-shell-kbd">?</kbd></button>' +
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
        .then(function (s) { state = s; buildNewMenu(); buildHelpMenu(); })
        .catch(function () { buildHelpMenu(); });
});
