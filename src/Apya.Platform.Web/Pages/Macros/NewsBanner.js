/* =============================================================================
   Makro Ekran (/Makro) — haber şeridi (tasarım 1a). En fazla 5 haber; oklar,
   nokta göstergesi, klavye (← →). Kalanı "Tüm haberler"de (/Makro/Haberler).
   Veri: macroNews vekili — açık çağrılar + sürüm notları + sonuçlar.
   Haber yoksa ya da yüklenemezse şerit hiç görünmez — sayfanın geri kalanı etkilenmez.
   ============================================================================= */
(function () {
    'use strict';

    var section = document.getElementById('MacrosNews');
    if (!section) { return; }

    var l = abp.localization.getResource('Platform');
    var MAX = 5;
    var KIND = { 1: 'Call', 2: 'Platform', 3: 'Result' }; // MacroNewsKind
    var stage = section.querySelector('[data-news-stage]');
    var dots = section.querySelector('[data-news-dots]');
    var items = [];
    var index = 0;

    function esc(t) { return $('<div>').text(t == null ? '' : String(t)).html(); }
    function attr(t) { return esc(t).replace(/"/g, '&quot;'); }
    function appPath(url) { return typeof url === 'string' && /^\/(?![\/\\])/.test(url) ? url : '/Makro/Haberler'; }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : ''; }

    // Çağrı afişi hibe ekranlarıyla aynı yardımcıdan (Poster.js): afiş yoksa kuruma göre renk.
    function background(item) {
        if (KIND[item.kind] !== 'Call' || !window.apyaGrantPoster) { return ''; }
        return ' style="' + attr(apyaGrantPoster.style(item.source, item.posterFileName)) + '"';
    }

    function slide(item) {
        var kind = KIND[item.kind] || 'Platform';
        var newCount = items.filter(function (i) { return i.isNew; }).length;
        var meta = [date(item.date), item.source].filter(Boolean).join(' · ');
        return '<div class="apya-macros-news-bg kind-' + kind.toLowerCase() + '"' + background(item) + '></div>' +
               '<div class="apya-macros-news-scrim"></div>' +
               '<div class="apya-macros-news-body">' +
               '<div class="apya-macros-news-top">' +
               (newCount ? '<span class="apya-chip apya-chip-negative"><span class="apya-macros-news-dot"></span>' +
                   esc(l('Macros:News:NewCount', newCount)) + '</span>' : '') +
               '<a href="/Makro/Haberler">' + esc(l('Macros:News:All')) + '</a></div>' +
               '<div class="apya-macros-news-meta"><span class="apya-macros-news-tag kind-' + kind.toLowerCase() + '">' +
               esc(l('Macros:News:Kind:' + kind)) + '</span><span class="apya-macros-news-source">' + esc(meta) + '</span></div>' +
               '<div class="apya-macros-news-title">' + esc(item.title) + '</div>' +
               '<div class="apya-macros-news-summary">' + esc(item.summary) + '</div>' +
               '<div class="apya-macros-news-actions"><a class="btn btn-sm btn-primary" href="' + attr(appPath(item.url)) + '">' +
               esc(l('Macros:News:Cta:' + kind)) + '</a></div></div>';
    }

    function render() {
        stage.innerHTML = slide(items[index]);
        dots.querySelectorAll('button').forEach(function (b, i) {
            b.classList.toggle('is-active', i === index);
            b.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        section.querySelectorAll('[data-news-prev],[data-news-next]').forEach(function (b) {
            b.hidden = items.length < 2;
        });
    }

    function go(step) {
        index = (index + step + items.length) % items.length;
        render();
    }

    section.querySelector('[data-news-prev]').addEventListener('click', function () { go(-1); });
    section.querySelector('[data-news-next]').addEventListener('click', function () { go(1); });
    section.addEventListener('keydown', function (e) {
        if (e.target.closest('a, input, textarea')) { return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });
    // Dokunmatik: yatay kaydırma (telefonda oklar gizli). Dikey kaydırmayı yutmaz.
    var touchX = null;
    var touchY = null;
    section.addEventListener('touchstart', function (e) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    }, { passive: true });
    section.addEventListener('touchend', function (e) {
        if (touchX === null) { return; }
        var dx = e.changedTouches[0].clientX - touchX;
        var dy = e.changedTouches[0].clientY - touchY;
        touchX = touchY = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && items.length > 1) { go(dx < 0 ? 1 : -1); }
    }, { passive: true });

    dots.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-index]');
        if (b) { index = Number(b.dataset.index); render(); }
    });

    Promise.resolve(apya.platform.macros.macroNews.getList(MAX, { abpHandleError: false }))
        .then(function (list) {
            items = (list || []).slice(0, MAX);
            if (!items.length) { return; }
            dots.innerHTML = items.map(function (_, i) {
                return '<button type="button" data-index="' + i + '" aria-label="' +
                       attr(l('Macros:News:Goto', i + 1)) + '"></button>';
            }).join('');
            section.hidden = false;
            render();
        }, function () { /* şerit görünmez; ekranın geri kalanı çalışır */ });
})();
