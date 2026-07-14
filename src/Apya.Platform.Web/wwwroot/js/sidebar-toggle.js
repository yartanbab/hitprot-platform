$(function () {
    // Sidebar daralt/genişlet — LeptonX Lite'ın YERLEŞİK mekanizması + kalıcılık.
    // Tema: .menu-collapse-icon tıklaması #lpx-wrapper'a .hover-trigger toggle'lar ve
    // 'lpx:side-menu-state' ('1' = daraltılmış) anahtarını KENDİSİ yazar; ama sayfa
    // yüklemede geri UYGULAMAZ (Lite gap). Pre-paint tarafı ApyaThemeHead FOUC'ta
    // (<html data-sidebar="collapsed">); burada class ↔ attribute senkronu yapılır.
    // CSS geometrisi: apya-theme-bridge.css "SIDEBAR COLLAPSE" bölümü.
    if (/^\/Account\//i.test(location.pathname)) {
        return;
    }

    var html = document.documentElement;
    var wrapper = document.getElementById('lpx-wrapper');
    if (!wrapper) {
        return;
    }

    // FOUC'un çözdüğü durumu temanın class'ına yansıt (native logo/hover kuralları da işlesin).
    if (html.getAttribute('data-sidebar') === 'collapsed') {
        wrapper.classList.add('hover-trigger');
    }

    // Tema butonu class'ı değiştirdiğinde attribute'u aynala — iki CSS yolu tek durumdan beslensin.
    // (localStorage'ı tema kendi tıklama handler'ında zaten güncelliyor, tekrar yazmıyoruz.)
    new MutationObserver(function () {
        if (wrapper.classList.contains('hover-trigger')) {
            html.setAttribute('data-sidebar', 'collapsed');
        } else {
            html.removeAttribute('data-sidebar');
        }
    }).observe(wrapper, { attributes: true, attributeFilter: ['class'] });

    // Erişilebilirlik: temanın butonu düz bir <i> — role/klavye/etiket ekle.
    var btn = document.querySelector('.menu-collapse-icon');
    if (btn) {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', 'Menüyü daralt/genişlet');
        btn.setAttribute('title', 'Menüyü daralt/genişlet');
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    }

    // Rail modunda ikonlar için title tooltip (HANDOFF: "yalnızca ikonlar, title tooltip'li").
    document.querySelectorAll('#lpx-sidebar a.lpx-menu-item-link').forEach(function (a) {
        if (a.getAttribute('title')) {
            return;
        }
        var t = a.querySelector('.lpx-menu-item-text');
        var label = (t ? t.textContent : '').trim();
        if (label) {
            a.setAttribute('title', label);
        }
    });
});
