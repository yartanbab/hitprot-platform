$(function () {
    // Komut paleti — yalnız menü navigasyonu (P4 kapsam kararı, backend yok).
    // Veri kaynağı: sidebar zaten permission-filtered server-render edilmiş —
    // burada tekrar sorgulamak yerine DOM'dan scrape edilir (tek doğru kaynak,
    // kullanıcı hangi öğeleri görüyorsa palette de aynısını listeler).
    if (/^\/Account\//i.test(location.pathname)) {
        return;
    }

    var overlay, panel, input, list, emptyEl;
    var items = [];
    var filtered = [];
    var activeIndex = -1;

    function collectItems() {
        var sidebar = document.getElementById('lpx-sidebar');
        if (!sidebar) {
            return [];
        }
        var anchors = sidebar.querySelectorAll('a.lpx-menu-item-link[href]');
        var result = [];
        anchors.forEach(function (a) {
            var href = a.getAttribute('href');
            if (!href || href === '#') {
                return;
            }
            // SABİTLENENLER bölümü asıl satırların KOPYASI (apya-sidebar-shell.js
            // üretiyor) — atlanmazsa sabitlenen her sayfa palette iki kez çıkar.
            if (a.closest('.apya-pinned-section')) {
                return;
            }
            var textEl = a.querySelector('.lpx-menu-item-text');
            var label = ((textEl ? textEl.textContent : a.textContent) || '').trim();
            if (!label) {
                return;
            }
            var iconEl = a.querySelector('.lpx-menu-item-icon i');
            var iconClass = iconEl ? iconEl.className : 'fa fa-file';
            var sectionLi = a.closest('li.outer-menu-item');
            var sectionHeaderA = sectionLi ? sectionLi.querySelector(':scope > a.lpx-menu-item-link') : null;
            // Üst-düzey yaprak öğede (Ana Sayfa, Genel Bakış) header anchor kendisiyle
            // aynı → bölüm rozeti gösterme (redundant "Ana Sayfa · Ana Sayfa" olmasın).
            var sectionText = (sectionHeaderA && sectionHeaderA !== a)
                ? ((sectionHeaderA.querySelector('.lpx-menu-item-text') || {}).textContent || '').trim()
                : '';
            result.push({ label: label, href: href, icon: iconClass, section: sectionText });
        });
        return result;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function buildDom() {
        overlay = document.createElement('div');
        overlay.className = 'apya-command-palette-overlay';
        overlay.innerHTML =
            '<div class="apya-command-palette apya-pop-in" role="dialog" aria-modal="true" aria-label="Ara veya komut çalıştır">' +
            '  <div class="apya-command-palette-input-row">' +
            '    <i class="fa fa-magnifying-glass" aria-hidden="true"></i>' +
            '    <input type="text" class="apya-command-palette-input" placeholder="Ara veya komut çalıştır..." autocomplete="off" spellcheck="false" />' +
            '    <kbd>Esc</kbd>' +
            '  </div>' +
            '  <ul class="apya-command-palette-list" role="listbox"></ul>' +
            '  <div class="apya-command-palette-empty" hidden>Sonuç bulunamadı</div>' +
            '  <div class="apya-command-palette-foot">' +
            '    <span class="apya-command-palette-hints">↑↓ gez · ↵ seç · esc kapat</span>' +
            '    <span class="apya-command-palette-env"></span>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(overlay);
        panel = overlay.querySelector('.apya-command-palette');
        input = overlay.querySelector('.apya-command-palette-input');
        list = overlay.querySelector('.apya-command-palette-list');
        emptyEl = overlay.querySelector('.apya-command-palette-empty');

        overlay.addEventListener('mousedown', function (e) {
            if (e.target === overlay) {
                close();
            }
        });
        input.addEventListener('input', function () {
            render(input.value);
        });
        input.addEventListener('keydown', onKeydown);
    }

    // Sayfanın KENDİ arama alanı — ortak konsol modülünün sözleşmesi
    // (Görevler/Proje konsolları bu sınıfı kullanıyor). Yoksa "bu sayfada ara"
    // bölümü hiç basılmaz: olmayan bir yeteneği vaat etmeyiz.
    function pageSearchInput() {
        return document.querySelector('.apya-console-search input');
    }

    // "+ Yeni" menüsüyle AYNI kaynak: kabuk durumundaki oluşturma yetkileri.
    // Yetkisi olmayana satır gösterip 403 aldırmayız.
    function createEntries() {
        var can = (window.apyaShellStateValue && window.apyaShellStateValue.can) || null;
        if (!can) { return []; }
        var all = [
            { label: 'Yeni görev', url: '/Tasks/CreateModal', allowed: can.createTask },
            { label: 'Yeni proje', url: '/Projects/CreateModal', allowed: can.createProject },
            { label: 'Yeni hibe çağrısı', url: '/Grants/CreateModal', allowed: can.createGrant }
        ];
        return all.filter(function (a) { return a.allowed; }).map(function (a) {
            return { kind: 'create', label: a.label, url: a.url, icon: 'fa fa-plus', section: '' };
        });
    }

    function buildEntries(q) {
        var entries = [];

        // 1) BU SAYFADA ARA — yalnız sorgu varken ve sayfanın arama alanı varken.
        if (q && pageSearchInput()) {
            entries.push({
                kind: 'page', label: '"' + q + '" — bu sayfada ara',
                icon: 'fa fa-magnifying-glass', section: 'Enter', group: 'BU SAYFADA ARA'
            });
        }

        // 2) GİT — menüden toplanan sayfalar
        var navs = (!q ? items : items.filter(function (it) {
            return it.label.toLocaleLowerCase('tr-TR').indexOf(q) !== -1 ||
                (it.section && it.section.toLocaleLowerCase('tr-TR').indexOf(q) !== -1);
        })).map(function (it) {
            return { kind: 'nav', label: it.label, href: it.href, icon: it.icon, section: it.section, group: 'GİT' };
        });
        entries = entries.concat(navs);

        // 3) OLUŞTUR
        var creates = createEntries().filter(function (c) {
            return !q || c.label.toLocaleLowerCase('tr-TR').indexOf(q) !== -1;
        });
        creates.forEach(function (c) { c.group = 'OLUŞTUR'; });
        return entries.concat(creates);
    }

    function render(query) {
        var raw = (query || '').trim();
        var q = raw.toLocaleLowerCase('tr-TR');
        filtered = buildEntries(q);
        // Sorgu metnini "bu sayfada ara" satırında ham hâliyle göstermek için
        // yeniden kur (buildEntries küçük harfli q ile filtreliyor).
        if (raw && pageSearchInput() && filtered.length && filtered[0].kind === 'page') {
            filtered[0].label = '"' + raw + '" — bu sayfada ara';
            filtered[0].query = raw;
        }

        list.innerHTML = '';
        emptyEl.hidden = filtered.length > 0;

        var lastGroup = null;
        filtered.forEach(function (it, idx) {
            if (it.group && it.group !== lastGroup) {
                var head = document.createElement('li');
                head.className = 'apya-command-palette-group';
                head.setAttribute('aria-hidden', 'true');
                head.textContent = it.group;
                list.appendChild(head);
                lastGroup = it.group;
            }
            var li = document.createElement('li');
            li.className = 'apya-command-palette-item apya-cp-' + it.kind + (idx === 0 ? ' active' : '');
            li.id = 'apya-cp-item-' + idx;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
            li.innerHTML =
                '<i class="' + it.icon + '" aria-hidden="true"></i>' +
                '<span class="apya-command-palette-item-label">' + escapeHtml(it.label) + '</span>' +
                (it.section ? '<span class="apya-command-palette-item-section">' + escapeHtml(it.section) + '</span>' : '');
            li.addEventListener('mousemove', function () { setActive(idx); });
            li.addEventListener('click', function () { run(it); });
            list.appendChild(li);
        });
        activeIndex = filtered.length > 0 ? 0 : -1;
        syncActiveDescendant();
    }

    function syncActiveDescendant() {
        if (activeIndex >= 0) { input.setAttribute('aria-activedescendant', 'apya-cp-item-' + activeIndex); }
        else { input.removeAttribute('aria-activedescendant'); }
    }

    // Tek çalıştırma noktası — klavye ve fare aynı yoldan geçer.
    function run(entry) {
        if (!entry) { return; }
        if (entry.kind === 'nav') { navigate(entry.href); return; }
        if (entry.kind === 'create') {
            close();
            if (window.abp && abp.ModalManager) { new abp.ModalManager(entry.url).open(); }
            else { location.href = entry.url; }
            return;
        }
        if (entry.kind === 'page') {
            // Sorguyu sayfanın kendi aramasına uygula ve paleti kapat.
            var el = pageSearchInput();
            close();
            if (el) {
                el.value = entry.query || '';
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.focus();
            }
        }
    }

    function setActive(idx) {
        var els = list.querySelectorAll('.apya-command-palette-item');
        els.forEach(function (el, i) {
            el.classList.toggle('active', i === idx);
            el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
        activeIndex = idx;
        if (els[idx]) {
            // Seçili satır görünür alana kaydırılır — uzun listede kaybolmasın.
            els[idx].scrollIntoView({ block: 'nearest' });
        }
        syncActiveDescendant();
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            close();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filtered.length) {
                setActive((activeIndex + 1) % filtered.length);
            }
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filtered.length) {
                setActive((activeIndex - 1 + filtered.length) % filtered.length);
            }
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            run(filtered[activeIndex]);
        }
    }

    function navigate(href) {
        location.href = href;
    }

    function open() {
        if (!overlay) {
            buildDom();
        }
        items = collectItems();
        // Ortam etiketi — PROD'da BASILMAZ (kabuk genelindeki kural: dikkat
        // yalnız riskli ortamda harcanır).
        var envEl = overlay.querySelector('.apya-command-palette-env');
        var env = (window.apyaShellStateValue && window.apyaShellStateValue.health &&
                   window.apyaShellStateValue.health.environment) || '';
        envEl.textContent = (env && !/^prod/i.test(env)) ? (env.toUpperCase() + ' ortamı') : '';
        input.value = '';
        render('');
        overlay.classList.add('open');
        document.body.classList.add('apya-command-palette-lock');
        setTimeout(function () {
            input.focus();
        }, 0);
    }

    function close() {
        if (!overlay) {
            return;
        }
        overlay.classList.remove('open');
        document.body.classList.remove('apya-command-palette-lock');
    }

    document.addEventListener('keydown', function (e) {
        var isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        var mod = isMac ? e.metaKey : e.ctrlKey;
        if (mod && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (overlay && overlay.classList.contains('open')) {
                close();
            } else {
                open();
            }
        }
    });

    $(document).on('click', '#ApyaCommandPaletteTrigger', function (e) {
        e.preventDefault();
        open();
    });
});
