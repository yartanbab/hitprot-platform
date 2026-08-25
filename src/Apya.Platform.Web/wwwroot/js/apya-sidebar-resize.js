/* =============================================================================
   KENAR ÇUBUĞU GENİŞLİĞİ — sürüklenebilir tutamak
   -----------------------------------------------------------------------------
   Tek kaldıraç: `--apya-sidebar-w`. Kabuk geometrisinin tamamı (kap genişliği,
   nav min/max, scrollbar telafisi, daralt düğmesinin sol koordinatı) o token'dan
   türüyor — bkz. apya-theme-bridge.css "KABUK GEOMETRİSİ". Bu yüzden burada
   yalnız değişken yazılır, hiçbir kural elle güncellenmez.

   KALICILIK localStorage: genişlik EKRAN BOYUTUNA bağlı bir tercih; 27"da
   seçilen 380px, dizüstünde içeriği boğar. Kabuğun kuralı da bu — "yerleşim
   durumu cihazda, taşınması gerekenler ayarda" (sabitlemeler ve menü düzeni
   ayarda, bölüm katlama ve ray modu localStorage'da).

   Boyanma ÖNCESİ uygulama ApyaThemeHead'deki FOUC betiğinde; burada yalnız
   sürükleme var. Yoksa her yenilemede menü 250px'ten seçilen genişliğe zıplardı.
   ============================================================================= */
$(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var container = document.querySelector('.lpx-sidebar-container');
    if (!container) { return; }

    var KEY = 'apya-sidebar-width';
    var MIN = 200;
    var MAX = 420;
    var DEFAULT = 250;

    // Dar ekranda kenar çubuğu çekmece/sekme oluyor; tutamak orada anlamsız.
    var MOBILE_MAX = 767.98;

    function clamp(value) {
        return Math.max(MIN, Math.min(MAX, Math.round(value)));
    }

    function apply(width) {
        document.documentElement.style.setProperty('--apya-sidebar-w', width + 'px');
    }

    function persist(width) {
        try {
            if (width === null) { localStorage.removeItem(KEY); }
            else { localStorage.setItem(KEY, String(width)); }
        } catch (e) { /* kota / gizli mod */ }
    }

    var handle = document.createElement('div');
    handle.className = 'apya-sidebar-resizer';
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-orientation', 'vertical');
    handle.setAttribute('aria-label', handleLabel());
    handle.tabIndex = 0;
    container.appendChild(handle);

    // Etiket SUNUCUDAN gelir (ApyaThemeHead → #ApyaMobileShellL10n): kabuk
    // metinleri JS'e gömülmüyor. Blok okunamazsa erişilebilirlik etiketsiz
    // kalmasın diye yalın bir yedek var.
    function handleLabel() {
        try {
            var el = document.getElementById('ApyaMobileShellL10n');
            return (JSON.parse(el.textContent) || {}).sidebarWidth || 'Kenar çubuğu genişliği';
        } catch (e) {
            return 'Kenar çubuğu genişliği';
        }
    }

    function currentWidth() {
        return container.getBoundingClientRect().width;
    }

    // --- sürükleme ---
    var dragging = false;
    var startX = 0;
    var startWidth = 0;

    handle.addEventListener('pointerdown', function (e) {
        if (window.innerWidth <= MOBILE_MAX) { return; }
        if (document.documentElement.getAttribute('data-sidebar')) { return; } // ray/gizli mod

        dragging = true;
        startX = e.clientX;
        startWidth = currentWidth();
        handle.setPointerCapture(e.pointerId);
        document.body.classList.add('apya-sidebar-resizing');
        e.preventDefault();
    });

    handle.addEventListener('pointermove', function (e) {
        if (!dragging) { return; }
        apply(clamp(startWidth + (e.clientX - startX)));
    });

    function endDrag(e) {
        if (!dragging) { return; }
        dragging = false;
        try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* yoksay */ }
        document.body.classList.remove('apya-sidebar-resizing');
        persist(clamp(currentWidth()));
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    // --- klavye: sürükleme faresiz de çalışmalı ---
    handle.addEventListener('keydown', function (e) {
        var step = e.shiftKey ? 32 : 8;
        var width = null;

        if (e.key === 'ArrowLeft') { width = clamp(currentWidth() - step); }
        else if (e.key === 'ArrowRight') { width = clamp(currentWidth() + step); }
        else if (e.key === 'Home') { width = DEFAULT; }
        else { return; }

        e.preventDefault();
        apply(width);
        persist(width === DEFAULT ? null : width);
    });

    // --- çift tık: varsayılana dön ---
    handle.addEventListener('dblclick', function () {
        document.documentElement.style.removeProperty('--apya-sidebar-w');
        persist(null);
    });
});
