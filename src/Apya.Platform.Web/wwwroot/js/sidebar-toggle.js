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

    // --- 2. seviye menü grupları varsayılan KAPALI ---
    // Yönetim altındaki açılır gruplar (Kiracı Yönetimi, Kimlik yönetimi, Platform,
    // Geri Bildirim). LeptonX aktif sayfanın grubunu AÇIK render ediyor; kullanıcı
    // tercihi hepsinin kapalı gelmesi, tıklayınca açılması. Yalnız başlangıç
    // durumunu değiştiriyoruz — temanın toggle handler'ına dokunulmuyor, bu yüzden
    // açma/kapama ve caret yönü (bi-chevron-up/down) kendi akışında çalışmaya devam eder.
    // Seçici doğal olarak 2. seviyeyi hedefler: 1. seviye listeler li.outer-menu-item
    // çocuğudur ve zaten kalıcı açık bölüm başlıklarıdır (apya-theme-bridge.css).
    document.querySelectorAll('li.lpx-inner-menu-item > ul.lpx-inner-menu').forEach(function (ul) {
        if (ul.classList.contains('collapsed')) {
            return;
        }
        ul.classList.add('collapsed');
        var caret = ul.parentElement.querySelector(':scope > a .lpx-caret');
        if (caret) {
            caret.classList.remove('bi-chevron-up');
            caret.classList.add('bi-chevron-down');
        }
    });

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

$(function () {
    // Mobil header: arama + bildirim erişimi. .lpx-topbar-content (masaüstü
    // toolbar — arama/bildirim/tema/yoğunluk hepsi orada) LeptonX'in kendi
    // CSS'i tarafından mobilde display:none yapılıyor; ayrı DOM ağacı olan
    // mobil navbar'ın hiçbir karşılığı yok (canlı 375px testte doğrulandı).
    // Mevcut #ApyaCommandPaletteTrigger'ı programatik tıklayarak tetikliyoruz —
    // command-palette.js dinleyicisi document'e delege, görünürlükten bağımsız
    // çalışır (bkz. command-palette.js son satırı).
    if (/^\/Account\//i.test(location.pathname)) {
        return;
    }

    var group = document.getElementById('mobile-user-menu-group');
    if (!group) {
        return;
    }

    function addRow(tag, cls, iconClass, label, onActivate) {
        var el = document.createElement(tag);
        el.className = cls;
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.innerHTML = '<i class="lpx-icon ' + iconClass + '" aria-hidden="true"></i><span>' + label + '</span>';
        if (onActivate) {
            el.addEventListener('click', onActivate);
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onActivate();
                }
            });
        }
        group.insertBefore(el, group.firstChild);
        return el;
    }

    var notifRow = addRow('a', 'lpx-language-selection', 'fa fa-bell', 'Bildirimler');
    notifRow.setAttribute('href', '/Notifications');

    addRow('div', 'lpx-language-selection btn-toggle', 'fa fa-magnifying-glass', 'Ara', function () {
        var trigger = document.getElementById('ApyaCommandPaletteTrigger');
        if (trigger) {
            trigger.click();
        }
    });
});

$(function () {
    // ── MOBİL DRAWER NAVİGASYONU ─────────────────────────────────────────────
    // Temanın mobil menüsü (a) hamburger'i SAĞA koyuyor, (b) açılınca içeriği
    // aşağı itiyor, (c) kapatma affordance'ı sunmuyordu. Burada düğüm taşınıyor,
    // backdrop + gövde kilidi + Esc + odak yönetimi ekleniyor. Görünüm tarafı:
    // apya-theme-bridge.css "MOBİL NAVİGASYON" bölümü.
    //
    // Temanın kendi toggle'ına DOKUNULMUYOR: aç/kapa hâlâ .d-none sınıfını
    // tema yönetiyor, biz yalnız o sınıfı GÖZLEMLEYİP yan etkileri sürüyoruz.
    // Böylece tema güncellemesi mekanizmayı değiştirse bile menü çalışmaya
    // devam eder (yalnız süslemeler devre dışı kalır).
    if (/^\/Account\//i.test(location.pathname)) {
        return;
    }

    var drawer = document.getElementById('mobile-navbar');
    var navbar = document.querySelector('.lpx-mobile-navbar');
    if (!drawer || !navbar) {
        return;
    }

    var toggle = navbar.querySelector('[data-lpx-toggle="mobile-navbar"]');

    // 1) Hamburger'i bar'ın BAŞINA taşı (Material Top App Bar / Apple HIG).
    //    Düğüm taşınır, yeniden üretilmez → temanın dinleyicisi korunur.
    if (toggle) {
        navbar.insertBefore(toggle, navbar.firstChild);
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-label', 'Menüyü aç');
        toggle.setAttribute('aria-controls', 'mobile-navbar');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    }

    var personToggle = navbar.querySelector('[data-lpx-toggle="mobile-user-menu-group"]');
    if (personToggle) {
        personToggle.setAttribute('role', 'button');
        personToggle.setAttribute('tabindex', '0');
        personToggle.setAttribute('aria-label', 'Hesap menüsü');
        personToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                personToggle.click();
            }
        });
    }

    // Header yüksekliğini CSS'e bildir (hesap paneli buna göre konumlanır).
    document.documentElement.style.setProperty(
        '--apya-mobile-header-h', Math.round(navbar.getBoundingClientRect().height) + 'px');

    // 2) Drawer başlığı + kapat düğmesi (modal-escape kuralı).
    if (!drawer.querySelector('.apya-drawer-head')) {
        var head = document.createElement('div');
        head.className = 'apya-drawer-head';
        head.innerHTML = '<span class="apya-drawer-head-title">Menü</span>';
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'apya-drawer-close';
        closeBtn.setAttribute('aria-label', 'Menüyü kapat');
        closeBtn.innerHTML = '<i class="fa fa-xmark" aria-hidden="true"></i>';
        closeBtn.addEventListener('click', close);
        head.appendChild(closeBtn);
        drawer.insertBefore(head, drawer.firstChild);
    }

    // 3) Backdrop.
    var backdrop = document.createElement('div');
    backdrop.className = 'apya-mobile-nav-backdrop';
    backdrop.addEventListener('click', close);
    document.body.appendChild(backdrop);

    function isOpen() {
        return !drawer.classList.contains('d-none');
    }

    function close() {
        // Temanın kendi toggle'ını kullan → tema state'i ile senkron kalır.
        if (isOpen() && toggle) {
            toggle.click();
        } else {
            drawer.classList.add('d-none');
        }
    }

    // 4) Açık/kapalı durumunun yan etkileri: backdrop, gövde kilidi, aria, odak.
    var lastFocus = null;
    function sync() {
        var open = isOpen();
        backdrop.classList.toggle('is-open', open);
        document.body.classList.toggle('apya-mobile-nav-open', open);
        if (toggle) {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
        }
        if (open) {
            lastFocus = document.activeElement;
            var first = drawer.querySelector('.apya-drawer-close');
            if (first) { first.focus(); }
        } else if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
            lastFocus = null;
        }
    }

    new MutationObserver(sync).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    sync();

    // 5) Esc ile kapat.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) {
            close();
        }
    });

    // 6) Masaüstüne genişletilirse açık kalan drawer'ı temizle.
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768 && isOpen()) {
            close();
        }
    });
});
