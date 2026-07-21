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
            '  <ul class="apya-command-palette-list"></ul>' +
            '  <div class="apya-command-palette-empty" hidden>Sonuç bulunamadı</div>' +
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

    function render(query) {
        var q = (query || '').toLocaleLowerCase('tr-TR').trim();
        filtered = !q ? items : items.filter(function (it) {
            return it.label.toLocaleLowerCase('tr-TR').indexOf(q) !== -1 ||
                (it.section && it.section.toLocaleLowerCase('tr-TR').indexOf(q) !== -1);
        });
        list.innerHTML = '';
        emptyEl.hidden = filtered.length > 0;
        filtered.forEach(function (it, idx) {
            var li = document.createElement('li');
            li.className = 'apya-command-palette-item' + (idx === 0 ? ' active' : '');
            li.innerHTML =
                '<i class="' + it.icon + '" aria-hidden="true"></i>' +
                '<span class="apya-command-palette-item-label">' + escapeHtml(it.label) + '</span>' +
                (it.section ? '<span class="apya-command-palette-item-section">' + escapeHtml(it.section) + '</span>' : '');
            li.addEventListener('mousemove', function () {
                setActive(idx);
            });
            li.addEventListener('click', function () {
                navigate(it.href);
            });
            list.appendChild(li);
        });
        activeIndex = filtered.length > 0 ? 0 : -1;
    }

    function setActive(idx) {
        var els = list.querySelectorAll('.apya-command-palette-item');
        els.forEach(function (el, i) {
            el.classList.toggle('active', i === idx);
        });
        activeIndex = idx;
        if (els[idx]) {
            els[idx].scrollIntoView({ block: 'nearest' });
        }
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
            var target = filtered[activeIndex];
            if (target) {
                navigate(target.href);
            }
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
