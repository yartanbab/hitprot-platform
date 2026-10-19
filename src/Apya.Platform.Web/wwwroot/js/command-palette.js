$(function () {
    // Komut paleti — menü navigasyonu + X-01 kayıt araması (görev, proje, hibe başvurusu, fatura;
    // kullanıcı kararı 2026-10-19, eski P4 "backend yok" kapsamının yerine).
    // Veri kaynağı: sidebar zaten permission-filtered server-render edilmiş —
    // burada tekrar sorgulamak yerine DOM'dan scrape edilir (tek doğru kaynak,
    // kullanıcı hangi öğeleri görüyorsa palette de aynısını listeler).
    if (/^\/Account\//i.test(location.pathname)) {
        return;
    }

    var overlay, panel, input, list, emptyEl;
    var lastTrigger = null; // paleti açan öğe — kapanışta odak buraya döner
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
            searchRecords((input.value || '').trim());
        });
        input.addEventListener('keydown', onKeydown);
    }

    // Sayfanın KENDİ arama alanı — ortak konsol modülünün sözleşmesi
    // (Görevler/Proje konsolları bu sınıfı kullanıyor). Yoksa "bu sayfada ara"
    // bölümü hiç basılmaz: olmayan bir yeteneği vaat etmeyiz.
    function pageSearchInput() {
        return document.querySelector('.apya-console-search input');
    }

    // "+ Yeni" menüsüyle AYNI kaynak: kabuk durumundaki oluşturma listesi (Makro Ekran
    // kataloğunun adresli satırları, sunucuda izne göre süzülmüş — ShellStateDto.Creates).
    // Yetkisi olmayana satır gösterip 403 aldırmayız. Menüdeki sayfalar "GİT"te zaten var.
    function createEntries() {
        var creates = (window.apyaShellStateValue && window.apyaShellStateValue.creates) || [];
        return creates.map(function (c) {
            return c.isModal
                ? { kind: 'create', label: c.title, url: c.url, icon: c.icon, section: '' }
                : { kind: 'nav', label: c.title, href: c.url, icon: c.icon, section: '' };
        });
    }

    // X-01 · Kayıt araması (görev, proje, hibe başvurusu, fatura). Yazarken 250 ms bekler; yanıt yalnız
    // sorgu hâlâ aynıysa basılır. Sunucu her türü izin ve kapsamıyla arar; hata sessizdir (palet menüyle çalışır).
    var records = [];
    var recordsFor = '';
    var recordTimer = null;
    var RECORD_ICON = { task: 'fa fa-list-check', project: 'fa fa-diagram-project', grant: 'fa fa-award', invoice: 'fa fa-file-invoice' };

    function searchRecords(raw) {
        clearTimeout(recordTimer);
        var svc = window.apya && apya.platform && apya.platform.search && apya.platform.search.recordSearch;
        if (!svc || raw.length < 2) { records = []; recordsFor = ''; return; }
        recordTimer = setTimeout(function () {
            Promise.resolve(svc.search(raw, { abpHandleError: false, apyaBackground: true })).then(function (res) {
                if ((input.value || '').trim() !== raw) { return; }
                records = (res || []).map(function (r) {
                    return { kind: 'nav', label: r.title, href: r.url, icon: RECORD_ICON[r.kind] || 'fa fa-file', section: r.subtitle || '', group: 'KAYITLAR', record: true };
                });
                recordsFor = raw;
                render(raw);
            }, function () { });
        }, 250);
    }

    // X-02 · Son açılan kayıtlar (yalnız paletten açılan KAYITLAR satırları). Anahtar kullanıcıya ve kiracıya
    // özel: aynı tarayıcıyı paylaşan iki kullanıcı birbirinin kayıtlarını görmez.
    var RECENT_MAX = 5;
    function recentKey() {
        var u = (window.abp && abp.currentUser) || {};
        return 'apya.cp.recent.' + (u.tenantId || 'host') + '.' + (u.id || 'anon');
    }
    function readRecents() {
        try { return JSON.parse(localStorage.getItem(recentKey()) || '[]') || []; } catch (e) { return []; }
    }
    function rememberRecent(entry) {
        try {
            var list = readRecents().filter(function (r) { return r.href !== entry.href; });
            list.unshift({ label: entry.label, href: entry.href, icon: entry.icon, section: entry.section || '' });
            localStorage.setItem(recentKey(), JSON.stringify(list.slice(0, RECENT_MAX)));
        } catch (e) { /* depolama kapalı: palet yine çalışır */ }
    }

    function buildEntries(q) {
        var entries = [];

        // 0) SON AÇILANLAR — yalnız sorgu boşken.
        if (!q) {
            entries = readRecents().map(function (r) {
                return { kind: 'nav', label: r.label, href: r.href, icon: r.icon, section: r.section, group: 'SON AÇILANLAR', record: true };
            });
        }

        // 1) BU SAYFADA ARA — yalnız sorgu varken ve sayfanın arama alanı varken.
        if (q && pageSearchInput()) {
            entries.push({
                kind: 'page', label: '"' + q + '" — bu sayfada ara',
                icon: 'fa fa-magnifying-glass', section: 'Enter', group: 'BU SAYFADA ARA'
            });
        }

        // 1b) KAYITLAR — sunucudan gelen kayıt sonuçları (sorgu aynıysa)
        if (q && recordsFor && recordsFor.toLocaleLowerCase('tr-TR') === q) {
            entries = entries.concat(records);
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
        if (entry.kind === 'nav') {
            if (entry.record) { rememberRecent(entry); }
            navigate(entry.href);
            return;
        }
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
        // FOCUS TRAP: panel `aria-modal="true"` ilan ediyor, o hâlde odak
        // dışarı KAÇMAMALI (denetimde kaçıyordu). Listbox örüntüsünde seçim
        // ok tuşlarıyla yapılır ve panelde input dışında odaklanabilir öğe
        // yoktur → Tab yutulur, odak inputta kalır.
        if (e.key === 'Tab') {
            e.preventDefault();
            input.focus();
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
        // Açan öğeyi ŞİMDİ yakala: buildDom/focus sonrası activeElement artık
        // paletin input'u olur.
        var active = document.activeElement;
        lastTrigger = (active && active !== document.body) ? active : null;
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
        // Odak, paleti açan öğeye döner — klavye kullanıcısı sayfanın başına
        // savrulmaz. Öğe DOM'dan kalkmışsa sessizce atlanır.
        if (lastTrigger && document.contains(lastTrigger)) {
            lastTrigger.focus();
        }
        lastTrigger = null;
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
