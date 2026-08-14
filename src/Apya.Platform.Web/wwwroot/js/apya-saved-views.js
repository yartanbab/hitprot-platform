/* =============================================================================
   APYA SAVED VIEWS — üst bardaki kayıtlı görünüm çipi
   -----------------------------------------------------------------------------
   Bir "kayıtlı görünüm", ekranın FİLTRE URL'İNİN adlandırılmış anlık
   görüntüsüdür. Konsol modülü (apya-task-console.js) filtreleri zaten
   `history.replaceState` ile URL'e yazıyor ve açılışta `readUrl()` ile oradan
   okuyor — bu yüzden çip konsola HİÇ BAĞLANMAZ, yalnız `location.search`
   üzerinden çalışır. Kuplaj sıfır; konsol değişse bile çip çalışmaya devam eder.

     · uygulamak = o sorguyla ekrana git (sayfa filtreleri URL'den kurar)
     · "kirli"   = mevcut sorgu, seçili görünümün sorgusundan farklı
     · kaydetmek = mevcut sorguyu ada bağlayıp sunucuya yaz

   ÇİP YALNIZ FİLTRESİ OLAN EKRANLARDA BASILIR (`[data-filter]` konsol
   sözleşmesi). Filtresiz sayfada "görünüm" kavramı yok — olmayan bir yeteneği
   vaat etmeyiz.

   Kalıcılık sunucuda (ShellAppService.SetSavedViewsAsync) → cihazlar arası
   taşınır. Seçili görünüm SEKMEYE özel (sessionStorage): aynı anda iki sekmede
   farklı görünümlere bakmak doğal, sunucuya yazmak onları birbirine bağlardı.
   ============================================================================= */
$(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var host = document.querySelector('.lpx-breadcrumb-container .apya-topbar-nav');
    if (!host) { return; }

    // Konsol filtre sözleşmesi — yoksa çip hiç basılmaz.
    if (!document.querySelector('[data-filter]')) { return; }

    var ACTIVE_KEY = 'apya-active-view:' + location.pathname;
    var views = [];
    var chip, menu, saveBtn;

    function screenPath() { return location.pathname; }
    function currentQuery() { return location.search.replace(/^\?/, ''); }

    function screenViews() {
        return views.filter(function (v) { return v.screen === screenPath(); });
    }

    function activeView() {
        var name = null;
        try { name = sessionStorage.getItem(ACTIVE_KEY); } catch (e) { /* gizli mod */ }
        if (!name) { return null; }
        return screenViews().filter(function (v) { return v.name === name; })[0] || null;
    }
    function setActiveName(name) {
        try {
            if (name) { sessionStorage.setItem(ACTIVE_KEY, name); }
            else { sessionStorage.removeItem(ACTIVE_KEY); }
        } catch (e) { /* yoksay */ }
    }

    // Sorgu karşılaştırması SIRA BAĞIMSIZ olmalı: konsol parametreleri her
    // zaman aynı sırada yazmayabilir ve `?task=...` gibi filtre DIŞI
    // parametreler kirli durumu tetiklememeli.
    var IGNORED = ['task', 'page', 'sort'];
    function normalizeQuery(q) {
        var p = new URLSearchParams(q || '');
        IGNORED.forEach(function (k) { p.delete(k); });
        var pairs = [];
        p.forEach(function (v, k) { if (v !== '') { pairs.push(k + '=' + v); } });
        return pairs.sort().join('&');
    }
    function isDirty() {
        var a = activeView();
        if (!a) { return normalizeQuery(currentQuery()) !== ''; }
        return normalizeQuery(currentQuery()) !== normalizeQuery(a.query);
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function save(list) {
        var token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
        return fetch('/api/app/shell/set-saved-views', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token ? decodeURIComponent(token) : ''
            },
            body: JSON.stringify(list.map(function (v) {
                return { name: v.name, screen: v.screen, query: v.query };
            }))
        }).then(function (r) { return r.ok ? r.json() : null; });
    }

    // -------------------------------------------------------------------------
    function build() {
        chip = document.createElement('div');
        chip.className = 'apya-view-chip';

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'apya-view-chip-btn';
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');

        menu = document.createElement('div');
        menu.className = 'apya-view-chip-menu';
        menu.setAttribute('role', 'menu');
        menu.hidden = true;

        saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'apya-view-chip-save';
        saveBtn.textContent = 'Kaydet';
        saveBtn.hidden = true;

        chip.appendChild(trigger);
        chip.appendChild(saveBtn);
        chip.appendChild(menu);
        host.appendChild(chip);

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!menu.hidden) { closeMenu(); return; }
            renderMenu();
            menu.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            trigger.classList.add('is-open');
            document.addEventListener('click', onDoc);
            document.addEventListener('keydown', onKey);
            var first = menu.querySelector('.apya-view-chip-row');
            if (first) { first.focus(); }
        });
        saveBtn.addEventListener('click', onSaveClick);

        function onDoc(e) { if (!menu.contains(e.target)) { closeMenu(); } }
        function onKey(e) {
            if (e.key === 'Escape') { closeMenu(); trigger.focus(); return; }
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') { return; }
            e.preventDefault();
            var rows = [].slice.call(menu.querySelectorAll('.apya-view-chip-row'));
            if (!rows.length) { return; }
            var i = rows.indexOf(document.activeElement);
            var n = e.key === 'ArrowDown' ? i + 1 : i - 1;
            if (n < 0) { n = rows.length - 1; }
            if (n >= rows.length) { n = 0; }
            rows[n].focus();
        }
        function closeMenu() {
            menu.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            trigger.classList.remove('is-open');
            document.removeEventListener('click', onDoc);
            document.removeEventListener('keydown', onKey);
        }
        chip._close = closeMenu;

        render();
    }

    function render() {
        var a = activeView();
        var dirty = isDirty();
        var trigger = chip.querySelector('.apya-view-chip-btn');

        trigger.innerHTML =
            '<span class="apya-view-chip-dot"></span>' +
            '<span class="apya-view-chip-name">' + escapeHtml(a ? a.name : 'Tüm kayıtlar') + '</span>' +
            (dirty
                ? '<span class="apya-view-chip-dirty">• kaydedilmemiş</span>'
                : '') +
            '<span class="apya-view-chip-caret" aria-hidden="true">⌄</span>';
        trigger.setAttribute('aria-label',
            'Kayıtlı görünüm: ' + (a ? a.name : 'Tüm kayıtlar') + (dirty ? ' (kaydedilmemiş değişiklik var)' : ''));

        chip.classList.toggle('is-dirty', dirty);
        saveBtn.hidden = !dirty;
    }

    function renderMenu() {
        var list = screenViews();
        var a = activeView();
        var rows = list.map(function (v) {
            return '<button type="button" class="apya-view-chip-row' + (a && a.name === v.name ? ' is-active' : '') +
                   '" role="menuitem" data-name="' + escapeHtml(v.name) + '">' +
                   '<span>' + escapeHtml(v.name) + '</span>' +
                   '<span class="apya-view-chip-del" data-del="' + escapeHtml(v.name) + '" title="Sil" aria-label="Görünümü sil: ' + escapeHtml(v.name) + '">✕</span>' +
                   '</button>';
        }).join('');

        menu.innerHTML =
            '<div class="apya-view-chip-head">KAYITLI GÖRÜNÜMLER</div>' +
            (rows || '<div class="apya-view-chip-empty">Henüz kayıtlı görünüm yok. Filtreleri ayarlayıp “Kaydet”e bas.</div>') +
            '<div class="apya-view-chip-sep"></div>' +
            '<button type="button" class="apya-view-chip-row apya-view-chip-clear" role="menuitem">Filtreleri temizle</button>';
    }

    // Menü tıklamaları — silme, seçme, temizleme.
    document.addEventListener('click', function (e) {
        if (!menu || menu.hidden) { return; }

        var del = e.target.closest('.apya-view-chip-del');
        if (del) {
            e.preventDefault();
            e.stopPropagation();
            var name = del.dataset.del;
            views = views.filter(function (v) { return !(v.screen === screenPath() && v.name === name); });
            if (activeView() && activeView().name === name) { setActiveName(null); }
            save(views);
            renderMenu();
            render();
            return;
        }

        if (e.target.closest('.apya-view-chip-clear')) {
            e.preventDefault();
            setActiveName(null);
            location.href = location.pathname;
            return;
        }

        var row = e.target.closest('.apya-view-chip-row');
        if (row && row.dataset.name) {
            e.preventDefault();
            var v = screenViews().filter(function (x) { return x.name === row.dataset.name; })[0];
            if (!v) { return; }
            setActiveName(v.name);
            // Görünümü uygulamak = o sorguyla ekrana gitmek. Sayfa filtrelerini
            // açılışta URL'den kuruyor, bu yüzden ayrı bir "uygula" API'sine
            // gerek yok.
            location.href = location.pathname + (v.query ? '?' + v.query : '');
        }
    });

    function onSaveClick(e) {
        e.stopPropagation();
        var a = activeView();
        // Seçili bir görünüm varsa ONU günceller; yoksa ad sorup yeni kaydeder.
        if (a) {
            a.query = currentQuery();
            save(views).then(render);
            return;
        }
        var name = (window.prompt('Görünüm adı:', '') || '').trim();
        if (!name) { return; }
        if (screenViews().some(function (v) { return v.name === name; })) {
            // Aynı ad varsa üzerine yaz — kullanıcı zaten o görünümü
            // güncellemek istiyor demektir.
            screenViews().forEach(function (v) { if (v.name === name) { v.query = currentQuery(); } });
        } else {
            views.push({ name: name, screen: screenPath(), query: currentQuery() });
        }
        setActiveName(name);
        save(views).then(function (saved) {
            if (saved) { views = saved.map(normalize); }
            render();
        });
    }

    function normalize(v) {
        return { name: v.name || v.Name, screen: v.screen || v.Screen, query: v.query || v.Query || '' };
    }

    (window.apyaShellState || Promise.resolve(null))
        .then(function (state) {
            views = ((state && state.savedViews) || []).map(normalize);
            build();
        })
        .catch(function () { /* kabuk verisi yoksa çip basılmaz */ });
});
