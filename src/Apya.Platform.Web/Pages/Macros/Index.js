/* =============================================================================
   Makro Ekran (/Makro) — tıklama ve sabitleme. Kartları sunucu basar
   (Pages/Macros/_MacroCard.cshtml); burada yalnız davranış var.

   Sabitleme kenar çubuğuyla ORTAK ayarda (Platform.Shell.Pins) ve sunucuya liste
   BÜTÜN olarak yazılır. Kenar çubuğu yüklüyse onun listesi üzerinden yazarız
   (window.apyaShellPins): iki ayrı kopya tutulsaydı sonraki iğne tıklaması
   diğerinin değişikliğini ezerdi. Kenar çubuğu yoksa kendi kopyamızı yazarız.
   ============================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('ApyaMacros');
    var stateEl = document.getElementById('apya-macro-pins');
    if (!root || !stateEl) { return; } // boş durum: makro yok

    var l = abp.localization.getResource('Platform');
    var FOR_YOU_COUNT = 4; // IndexModel.ForYouCount ile aynı

    var initial = JSON.parse(stateEl.textContent || '{}');
    var localPins = (initial.pins || []).slice();
    var maxPins = initial.max || 12;
    var editing = false;

    var editBtn = root.querySelector('.apya-macros-edit');
    var editLabel = editBtn.querySelector('span');
    var hint = root.querySelector('.apya-macros-edit-hint');
    var forYouGrid = root.querySelector('[data-macro-grid="for-you"]');
    var restGrid = root.querySelector('[data-macro-grid="rest"]');
    var restSection = restGrid.closest('section');

    // Telefon (1g): iki ızgara yerine tek sayfalı ızgara (Index.css ile aynı kırılım).
    var PAGE_SIZE = 6;
    var phone = window.matchMedia('(max-width: 575.98px)');
    var pager = root.querySelector('[data-macro-pager]');
    var track = pager.querySelector('[data-pager-track]');
    var dots = pager.querySelector('[data-pager-dots]');

    function currentPins() {
        return window.apyaShellPins ? window.apyaShellPins.list() : localPins;
    }

    function cards() {
        return Array.prototype.slice.call(root.querySelectorAll('.apya-macro-card'));
    }

    function syncCard(card) {
        var pinned = currentPins().indexOf(card.dataset.pinName) !== -1;
        card.classList.toggle('is-pinned', pinned);
        if (editing) {
            card.setAttribute('aria-pressed', pinned ? 'true' : 'false');
        } else {
            card.removeAttribute('aria-pressed');
        }
    }

    // Sabitlenenler önce (sabitlenme sırasıyla), gerisi son 30 günlük kullanıma göre,
    // eşitlikte host sırası, o da yoksa katalog sırası (data-order = MacroItem.TieBreakOrder) —
    // sunucudaki MacroLauncher.Order ile aynı kural.
    function reorder() {
        var pins = currentPins();
        var all = cards().sort(function (a, b) {
            var ia = pins.indexOf(a.dataset.pinName);
            var ib = pins.indexOf(b.dataset.pinName);
            if (ia !== -1 || ib !== -1) {
                if (ia === -1) { return 1; }
                if (ib === -1) { return -1; }
                return ia - ib;
            }
            return (Number(b.dataset.usage) - Number(a.dataset.usage)) ||
                   (Number(a.dataset.order) - Number(b.dataset.order));
        });
        place(all);
    }

    // Sıralı kartları yerleştirir: geniş ekranda "Senin için" (ilk 4) + "Tüm makrolar",
    // telefonda 6'lı sayfalar. Kartlar taşınır (yeniden basılmaz): olay ve durumları korunur.
    function place(all) {
        if (phone.matches) {
            var pages = [];
            all.forEach(function (card, i) {
                if (i % PAGE_SIZE === 0) {
                    pages.push(document.createElement('div'));
                    pages[pages.length - 1].className = 'apya-macro-page';
                }
                pages[pages.length - 1].appendChild(card);
            });
            track.replaceChildren.apply(track, pages);
            dots.innerHTML = pages.length > 1 ? new Array(pages.length + 1).join('<span class="apya-macro-pager-dot"></span>') : '';
            syncDots();
        } else {
            all.forEach(function (card, i) {
                (i < FOR_YOU_COUNT ? forYouGrid : restGrid).appendChild(card);
            });
            track.replaceChildren();
            dots.innerHTML = '';
        }
        pager.hidden = !phone.matches;
        forYouGrid.hidden = phone.matches;
        restSection.hidden = phone.matches || all.length <= FOR_YOU_COUNT;
    }

    function syncDots() {
        var max = track.scrollWidth - track.clientWidth;
        var count = dots.children.length;
        var current = max > 0 && count > 1 ? Math.round(track.scrollLeft / max * (count - 1)) : 0;
        Array.prototype.forEach.call(dots.children, function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    track.addEventListener('scroll', syncDots, { passive: true });
    // Sunucu sırası = belge sırası (önce "Senin için", sonra "Tüm makrolar").
    if (phone.matches) { place(cards()); }
    phone.addEventListener('change', function () { place(cards()); });

    function saveLocal() {
        abp.ajax({
            url: abp.appPath + 'api/app/shell/set-pins',
            type: 'POST',
            data: JSON.stringify(localPins),
            abpHandleError: false
        }).fail(function () {
            abp.notify.error(l('Macros:PinSaveFailed'));
        });
    }

    // Değiştirdiyse true (sınırda false).
    function togglePin(name) {
        var pins = currentPins();
        var adding = pins.indexOf(name) === -1;
        if (adding && pins.length >= maxPins) {
            abp.notify.warn(l('Macros:PinLimit', maxPins));
            return false;
        }

        if (window.apyaShellPins) {
            window.apyaShellPins.toggle(name);
            return true;
        }

        if (adding) { localPins.push(name); } else { localPins.splice(localPins.indexOf(name), 1); }
        saveLocal();
        return true;
    }

    // Kullanım sayacı (sıralama bundan beslenir). keepalive: bağlantı makrosunda sayfa hemen
    // değişiyor, istek yarıda kalmasın. Ateşle-unut: sayaç kritik değil, hata kullanıcıya gösterilmez.
    function recordUse(key) {
        if (!key) { return; }
        var token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
        try {
            fetch(abp.appPath + 'api/app/macro-screen/record-use?key=' + encodeURIComponent(key), {
                method: 'POST',
                credentials: 'same-origin',
                keepalive: true,
                headers: { 'RequestVerificationToken': token ? decodeURIComponent(token) : '' }
            }).catch(function () { /* yoksay */ });
        } catch (err) { /* yoksay */ }
    }

    function setEditing(on) {
        editing = on;
        root.classList.toggle('is-editing', on);
        editBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        editLabel.textContent = on ? l('Macros:Done') : l('Macros:Edit');
        hint.hidden = !on;
        cards().forEach(syncCard);
        // Kartlar düzenleme sırasında YER DEĞİŞTİRMEZ (imlecin altından kaçmasın); "Bitti"de dizilir.
        if (!on) { reorder(); }
    }

    editBtn.addEventListener('click', function () { setEditing(!editing); });

    // Dokunmatik (1g): karta uzun basış sabitler ya da kaldırır. Parmak kayarsa (sayfa kaydırma)
    // iptal; basışın ardından gelen tıklama makroyu başlatmaz. "Düzenle" erişilebilir yol olarak kalır.
    var LONG_PRESS_MS = 500;
    var press = null;
    var swallowClick = false;

    root.addEventListener('pointerdown', function (e) {
        swallowClick = false;
        var card = e.pointerType === 'touch' && !editing && e.target.closest('.apya-macro-card');
        if (!card) { return; }
        press = {
            x: e.clientX,
            y: e.clientY,
            timer: setTimeout(function () {
                press = null;
                swallowClick = true;
                var pinning = currentPins().indexOf(card.dataset.pinName) === -1;
                if (!togglePin(card.dataset.pinName)) { return; }
                if (navigator.vibrate) { navigator.vibrate(10); }
                cards().forEach(syncCard);
                reorder();
                abp.notify.info(l(pinning ? 'Macros:PinAdded' : 'Macros:PinRemoved'));
            }, LONG_PRESS_MS)
        };
    });

    function cancelPress(e) {
        if (!press) { return; }
        if (e.type === 'pointermove' && Math.abs(e.clientX - press.x) < 10 && Math.abs(e.clientY - press.y) < 10) { return; }
        clearTimeout(press.timer);
        press = null;
    }

    ['pointermove', 'pointerup', 'pointercancel'].forEach(function (type) {
        root.addEventListener(type, cancelPress);
    });

    // Uzun basışta tarayıcının bağlantı menüsü açılmasın.
    root.addEventListener('contextmenu', function (e) {
        if ((press || swallowClick) && e.target.closest('.apya-macro-card')) { e.preventDefault(); }
    });

    root.addEventListener('click', function (e) {
        var card = e.target.closest('.apya-macro-card');
        if (!card) { return; }

        if (swallowClick) {
            swallowClick = false;
            e.preventDefault();
            return;
        }

        if (editing) {
            e.preventDefault();
            togglePin(card.dataset.pinName);
            cards().forEach(syncCard);
            return;
        }

        recordUse(card.dataset.macroKey);

        if (card.dataset.modalUrl) {
            e.preventDefault();
            new abp.ModalManager(card.dataset.modalUrl).open();
        }
    });

    // Kenar çubuğunda iğne değişirse kartlar da güncellenir.
    document.addEventListener('apya:pins-changed', function () {
        cards().forEach(syncCard);
        if (!editing) { reorder(); }
    });

    // Kenar çubuğu listesini yüklemeden düzenlemeye izin verme: önce yazan kopya
    // diğerinin yüklediği eski listeyle ezilirdi.
    if (window.apyaShellState && typeof window.apyaShellState.then === 'function') {
        editBtn.disabled = true;
        window.apyaShellState.then(
            function () { editBtn.disabled = false; },
            function () { editBtn.disabled = false; });
    }
})();
