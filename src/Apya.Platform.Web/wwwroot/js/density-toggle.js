$(function () {
    // Yoğunluk (density) değiştirici — compact / cozy / comfortable.
    // SoT: <html data-density>; kalıcılık localStorage('apya-density').
    // Pre-paint uygulaması ApyaThemeHead FOUC script'inde ZATEN vardı (kayıtlı
    // tercihi okuyup attribute'u basıyordu) — eksik olan yalnız değiştiren UI'ydı.
    // Tüketici: tokens.css [data-density] → --row-h; tablo yüksekliği
    // apya-theme-bridge.css "TABLO" bölümünde height: var(--row-h).
    var KEY = 'apya-density';
    var ORDER = ['compact', 'cozy', 'comfortable'];
    var ICONS = {
        // 'cozy' eskiden fa-bars kullanıyordu — mobil hamburger menü ikonuyla
        // aynı glyph, kavramsal çakışma riski taşıyordu (2026-08 tasarım
        // denetimi). fa-table-cells (izgara) navigasyon ikonlarından net ayrışır.
        compact:     'fa-align-justify',
        cozy:        'fa-table-cells',
        comfortable: 'fa-grip-lines'
    };

    var html = document.documentElement;
    var btn = document.getElementById('DensityToggle');

    function current() {
        var d = html.getAttribute('data-density');
        return ORDER.indexOf(d) >= 0 ? d : 'cozy';
    }

    function render(density) {
        if (!btn) { return; } // topbar düğmesi olmayan sayfa — yalnız API kullanılıyor
        var icon = btn.querySelector('i');
        if (icon) {
            icon.className = 'fa ' + ICONS[density];
        }
        // Etiketler view'dan data-label-* ile geliyor (i18n; JS'e metin gömülmez).
        var label = btn.getAttribute('data-label-' + density);
        if (label) {
            btn.setAttribute('title', label);
            btn.setAttribute('aria-label', label);
        }
    }

    function apply(density) {
        if (ORDER.indexOf(density) < 0) { return; }
        html.setAttribute('data-density', density);
        try { localStorage.setItem(KEY, density); } catch (e) { /* yok say */ }
        render(density);
        // Topbar dışındaki yüzeyler (Proje konsolu ⋯ menüsündeki S/N/G segmenti)
        // kendi aktif durumlarını buradan senkronlar.
        document.dispatchEvent(new CustomEvent('apya:density-changed', { detail: density }));
    }

    // Paylaşılan API — yoğunluğu değiştiren başka bir yüzey bu mantığı KOPYALAMAZ
    // (SoT tek yerde kalsın: attribute + localStorage + event).
    window.apya = window.apya || {};
    window.apya.density = { current: current, set: apply, order: ORDER };

    // Başlangıç: FOUC script'inin bastığı değeri ikona/etikete yansıt.
    render(current());

    if (btn) {
        btn.addEventListener('click', function () {
            var next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
            apply(next);
        });
    }
});
