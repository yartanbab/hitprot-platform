/* =============================================================================
   APYA TOPBAR SHELL — üst barın gezinme bağlamı (Faz 3a)
   -----------------------------------------------------------------------------
   Kurulanlar: breadcrumb · geri/ileri/son bakılanlar (Alt ←/→) · ortam çipi ·
   kaydırma gölgesi · dar ekran davranışı.

   Temanın boş bıraktığı `nav.lpx-breadcrumb-container` kullanılır; mevcut
   toolbar öğelerine (komut paleti, tema, yoğunluk, bildirim, kiracı pili)
   DOKUNULMAZ — onlar ViewComponent olarak sağ kümede duruyor.

   VERİ: apya-sidebar-shell.js'in çektiği tek `window.apyaShellState` promise'i
   paylaşılır (sayfa başına tek istek).

   Breadcrumb kaynağı: kenar çubuğunun AKTİF öğesi. Menü zaten izin-filtreli
   server-render edildiği için ayrı bir "sayfa başlığı" kaynağı uydurmaya gerek
   yok — command-palette.js de aynı yaklaşımı kullanıyor.
   ============================================================================= */
$(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var bar = document.querySelector('.lpx-topbar');
    var host = document.querySelector('.lpx-breadcrumb-container');
    if (!bar || !host) { return; }

    var NARROW = 1320;
    var HIST_KEY = 'apya-shell-history';

    function svg(path, size, width) {
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 20 20" fill="none" ' +
               'stroke="currentColor" stroke-width="' + (width || 1.8) + '" stroke-linecap="round" ' +
               'stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
    }
    var I_BACK = '<path d="M12.5 4.5L7 10l5.5 5.5"></path>';
    var I_FWD = '<path d="M7.5 4.5L13 10l-5.5 5.5"></path>';
    var I_CLOCK = '<path d="M10 5.5V10l3 1.5"></path><circle cx="10" cy="10" r="6.5"></circle>';
    var I_SEP = '<path d="M8 4.5l4 5.5-4 5.5"></path>';

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // -------------------------------------------------------------------------
    // Aktif menü öğesinden breadcrumb: [bölüm] › [sayfa]
    // -------------------------------------------------------------------------
    function activeMenuInfo() {
        var path = location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
        var anchors = document.querySelectorAll('#lpx-sidebar a.lpx-menu-item-link[href]');
        var best = null, bestLen = -1;

        anchors.forEach(function (a) {
            if (a.closest('.apya-pinned-section')) { return; } // kopya, asıl satır dursun
            var href = (a.getAttribute('href') || '').split('?')[0].replace(/\/+$/, '').toLowerCase();
            if (!href || href === '#') { return; }
            // En UZUN eşleşen önek kazanır: /Reports ve /Reports/ProjectBudget
            // birlikte varken doğru olan sayfa seçilsin.
            if (path === href || path.indexOf(href + '/') === 0) {
                if (href.length > bestLen) { best = a; bestLen = href.length; }
            }
        });
        if (!best) { return null; }

        var pageText = best.querySelector('.lpx-menu-item-text');
        var page = pageText ? pageText.textContent.trim() : (best.textContent || '').trim();

        // Bölüm = en dıştaki li.outer-menu-item'ın başlığı
        var outer = best.closest('li.outer-menu-item');
        var section = '';
        if (outer) {
            var head = outer.querySelector(':scope > a.lpx-menu-item-link');
            if (head && head !== best) {
                var t = head.querySelector('.lpx-menu-item-text');
                section = t ? t.textContent.trim() : '';
            }
        }
        return { page: page, section: section };
    }

    // -------------------------------------------------------------------------
    // Son bakılanlar — kendi yığınımız. History API "geri gidilebilir mi"
    // sorusuna cevap VERMEZ, o yüzden konumu kendimiz izliyoruz.
    // sessionStorage: sekmeye özel, kalıcı çöp bırakmaz.
    // -------------------------------------------------------------------------
    function readHistory() {
        try {
            var raw = sessionStorage.getItem(HIST_KEY);
            var h = raw ? JSON.parse(raw) : null;
            if (!h || !Array.isArray(h.items)) { return { items: [], index: -1 }; }
            return h;
        } catch (e) { return { items: [], index: -1 }; }
    }
    function writeHistory(h) {
        try { sessionStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch (e) { /* yoksay */ }
    }

    function recordVisit(label) {
        var h = readHistory();
        var url = location.pathname + location.search;
        var current = h.items[h.index];

        // Geri/ileri ile gelindiyse yığın kaymamalı — yalnız indeks taşınır.
        var back = h.items[h.index - 1];
        var fwd = h.items[h.index + 1];
        if (current && current.url === url) { return h; }
        if (back && back.url === url) { h.index -= 1; writeHistory(h); return h; }
        if (fwd && fwd.url === url) { h.index += 1; writeHistory(h); return h; }

        h.items = h.items.slice(0, h.index + 1);
        h.items.push({ url: url, label: label, at: Date.now() });
        if (h.items.length > 20) { h.items = h.items.slice(-20); }
        h.index = h.items.length - 1;
        writeHistory(h);
        return h;
    }

    function stepsAgoText(i, index) {
        var d = index - i;
        if (d === 0) { return 'şimdi'; }
        return d + ' adım önce';
    }

    // -------------------------------------------------------------------------
    function build(state) {
        var info = activeMenuInfo();
        var pageLabel = info ? info.page : (document.title || '').split('|')[0].trim();
        var h = recordVisit(pageLabel);

        var wrap = document.createElement('div');
        wrap.className = 'apya-topbar-nav';

        // --- geri / ileri / son bakılanlar ---
        var group = document.createElement('div');
        group.className = 'apya-topbar-histgroup';

        var backBtn = mkBtn(I_BACK, 'Önceki ekran (Alt + Sol ok)');
        var fwdBtn = mkBtn(I_FWD, 'Sonraki ekran (Alt + Sağ ok)');
        var recentsBtn = mkBtn(I_CLOCK, 'Son bakılanlar');
        recentsBtn.classList.add('apya-topbar-recents-btn');

        group.appendChild(backBtn);
        group.appendChild(fwdBtn);
        group.appendChild(recentsBtn);

        function syncArrows() {
            var s = readHistory();
            setDisabled(backBtn, s.index <= 0);
            setDisabled(fwdBtn, s.index < 0 || s.index >= s.items.length - 1);
        }
        syncArrows();

        backBtn.addEventListener('click', function () { if (!backBtn.disabled) { history.back(); } });
        fwdBtn.addEventListener('click', function () { if (!fwdBtn.disabled) { history.forward(); } });

        // --- son bakılanlar menüsü ---
        var menu = document.createElement('div');
        menu.className = 'apya-topbar-menu';
        menu.setAttribute('role', 'menu');
        menu.hidden = true;
        group.appendChild(menu);

        recentsBtn.setAttribute('aria-haspopup', 'true');
        recentsBtn.setAttribute('aria-expanded', 'false');
        recentsBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!menu.hidden) { closeMenu(); return; }
            renderRecents(menu);
            menu.hidden = false;
            recentsBtn.setAttribute('aria-expanded', 'true');
            recentsBtn.classList.add('is-open');
            document.addEventListener('click', onDocClick);
            document.addEventListener('keydown', onEsc);
        });
        function closeMenu() {
            menu.hidden = true;
            recentsBtn.setAttribute('aria-expanded', 'false');
            recentsBtn.classList.remove('is-open');
            document.removeEventListener('click', onDocClick);
            document.removeEventListener('keydown', onEsc);
        }
        function onDocClick(e) { if (!menu.contains(e.target)) { closeMenu(); } }
        function onEsc(e) { if (e.key === 'Escape') { closeMenu(); recentsBtn.focus(); } }

        // --- breadcrumb ---
        var crumb = document.createElement('div');
        crumb.className = 'apya-topbar-crumb';
        crumb.setAttribute('aria-label', 'Sayfa konumu');
        var parts = '';
        if (info && info.section) {
            // Bölüm başlıklarının URL'si YOK (LeptonX yalnız yaprakta id/href basıyor)
            // → handoff'taki "tıklanabilir üst seviye" burada metin olarak kalır;
            // olmayan bir hedefe link vermek yanlış söz olurdu.
            parts += '<span class="apya-topbar-crumb-parent">' + escapeHtml(info.section) + '</span>' +
                     '<span class="apya-topbar-crumb-sep">' + svg(I_SEP, 12, 2) + '</span>';
        }
        parts += '<span class="apya-topbar-crumb-page" aria-current="page">' + escapeHtml(pageLabel) + '</span>';
        crumb.innerHTML = parts;

        wrap.appendChild(group);
        wrap.appendChild(crumb);

        // --- ortam çipi ---
        // Handoff kuralı: PROD nötr, çip HİÇ gösterilmez.
        var env = (state && state.health && state.health.environment) || '';
        if (env && !/^prod/i.test(env)) {
            var chip = document.createElement('span');
            chip.className = 'apya-topbar-envchip' + (/^stag/i.test(env) ? ' is-staging' : '');
            chip.textContent = /^dev/i.test(env) ? 'DEV' : env.toUpperCase();
            chip.title = env + ' ortamı';
            wrap.appendChild(chip);
        }

        // Breadcrumb, mevcut `.apya-page-title`ın YERİNE geçer: ikisi de aynı
        // şeyi (sayfa adını) söylüyor, yan yana durunca üst bar iki kez
        // tekrar ediyordu. Alt başlık (sayfa açıklaması) KORUNUR — bilgi kaybı
        // olmasın diye breadcrumb'ın altında kalır.
        var oldTitle = host.querySelector('.apya-page-title');
        if (oldTitle) { oldTitle.hidden = true; }
        host.insertBefore(wrap, host.firstChild);

        function renderRecents(el) {
            var s = readHistory();
            var rows = s.items.slice().reverse().map(function (item, revIdx) {
                var i = s.items.length - 1 - revIdx;
                var active = i === s.index;
                return '<a class="apya-topbar-menu-row' + (active ? ' is-active' : '') + '" role="menuitem" href="' +
                       escapeHtml(item.url) + '"><span>' + escapeHtml(item.label || item.url) + '</span>' +
                       '<span class="apya-topbar-menu-meta">' + stepsAgoText(i, s.index) + '</span></a>';
            }).join('');
            el.innerHTML = '<div class="apya-topbar-menu-head">SON BAKILANLAR</div>' +
                           (rows || '<div class="apya-topbar-menu-empty">Henüz kayıt yok</div>');
        }

        // --- klavye: Alt ←/→ ---
        document.addEventListener('keydown', function (e) {
            if (!e.altKey || e.ctrlKey || e.metaKey) { return; }
            if (isTyping(e.target)) { return; }
            if (e.key === 'ArrowLeft' && !backBtn.disabled) { e.preventDefault(); history.back(); }
            if (e.key === 'ArrowRight' && !fwdBtn.disabled) { e.preventDefault(); history.forward(); }
        });
    }

    function isTyping(el) {
        if (!el) { return false; }
        var tag = (el.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    }

    function mkBtn(icon, label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'apya-topbar-iconbtn';
        b.innerHTML = svg(icon, 16, 2);
        b.title = label;
        b.setAttribute('aria-label', label);
        return b;
    }
    function setDisabled(btn, disabled) {
        btn.disabled = !!disabled;
        btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }

    // -------------------------------------------------------------------------
    // Kaydırma gölgesi — hangi kabın kaydırdığı sayfaya göre değişiyor
    // (LeptonX içerik kabı bazen kendisi, bazen pencere kaydırıyor).
    // -------------------------------------------------------------------------
    function setupScrollShadow() {
        var candidates = [document.querySelector('.lpx-content-container'), document.scrollingElement];
        var apply = function () {
            var top = 0;
            candidates.forEach(function (el) { if (el && el.scrollTop > top) { top = el.scrollTop; } });
            bar.classList.toggle('is-scrolled', top > 4);
        };
        candidates.forEach(function (el) {
            if (!el) { return; }
            (el === document.scrollingElement ? window : el)
                .addEventListener('scroll', apply, { passive: true });
        });
        apply();
    }

    function setupNarrow() {
        var apply = function () { bar.classList.toggle('is-narrow', window.innerWidth < NARROW); };
        window.addEventListener('resize', apply);
        apply();
    }

    (window.apyaShellState || Promise.resolve(null))
        .then(function (state) { build(state); setupScrollShadow(); setupNarrow(); })
        .catch(function () { build(null); setupScrollShadow(); setupNarrow(); });
});
