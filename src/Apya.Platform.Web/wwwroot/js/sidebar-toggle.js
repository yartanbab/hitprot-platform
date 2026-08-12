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

    // --- Kenar çubuğu modu: sabit / dinamik / kapalı ---
    // SoT <html data-sidebar>: (yok)=pinned · collapsed=dynamic · hidden=hidden.
    //   pinned  → 280px, içerik yanında (tema varsayılanı)
    //   dynamic → 72px ray; fare üzerine gelince 280px'e İÇERİĞİN ÜSTÜNE açılır
    //             (içeriğin margin-left'i ray genişliğinde sabit kalır), çekilince kapanır
    //   hidden  → tamamen gizli, içerik tüm genişliği kullanır
    // Kalıcılık kendi anahtarımızda ('apya-sidebar-mode'); LeptonX'in
    // 'lpx:side-menu-state' anahtarı da senkron tutuluyor ki temanın kendi
    // davranışı bizimkiyle çelişmesin. Pre-paint: ApyaThemeHead FOUC script'i.
    var MODE_KEY = 'apya-sidebar-mode';
    var MODES = ['pinned', 'dynamic', 'hidden'];
    var MODE_ICONS = {
        pinned:  'fa-table-columns',
        dynamic: 'fa-arrows-left-right-to-line',
        hidden:  'fa-eye-slash'
    };
    // Temanın kendi düğmesini izleyen observer. applyMode sırasında DISCONNECT
    // edilir: bir "syncing" bayrağı YETMEZ, çünkü MutationObserver geri çağrısı
    // mikro-görevdir ve bayrak senkron blokta temizlendikten SONRA çalışır —
    // kendi yazdığımız class'ı geri okuyup modu ezerdi ("Kapalı" seçilince
    // anında "Sabit"e dönüyordu). disconnect() bekleyen kayıtları da atar.
    var classObserver = null;

    function currentMode() {
        var attr = html.getAttribute('data-sidebar');
        if (attr === 'collapsed') { return 'dynamic'; }
        if (attr === 'hidden') { return 'hidden'; }
        return 'pinned';
    }

    function renderMode(mode) {
        var toggle = document.getElementById('SidebarModeToggle');
        if (!toggle) { return; }
        var icon = toggle.querySelector('i');
        if (icon) { icon.className = 'fa ' + MODE_ICONS[mode]; }
        // Etiketler view'dan data-label-* ile geliyor (i18n; JS'e metin gömülmez).
        var label = toggle.getAttribute('data-label-' + mode);
        if (label) {
            toggle.setAttribute('title', label);
            toggle.setAttribute('aria-label', label);
        }
        var menu = toggle.parentElement.querySelector('.apya-sidebar-mode-menu');
        if (menu) {
            menu.querySelectorAll('[data-sidebar-mode]').forEach(function (item) {
                item.classList.toggle('active', item.getAttribute('data-sidebar-mode') === mode);
            });
        }
    }

    function applyMode(mode, persist) {
        if (MODES.indexOf(mode) < 0) { mode = 'pinned'; }
        if (classObserver) { classObserver.disconnect(); }
        if (mode === 'dynamic') {
            html.setAttribute('data-sidebar', 'collapsed');
            wrapper.classList.add('hover-trigger');
        } else if (mode === 'hidden') {
            html.setAttribute('data-sidebar', 'hidden');
            // hover-trigger KALKMALI: aksi halde tema ray kozmetiğini uygulamaya
            // devam eder ve gizli sidebar hover'da tekrar belirir.
            wrapper.classList.remove('hover-trigger');
        } else {
            html.removeAttribute('data-sidebar');
            wrapper.classList.remove('hover-trigger');
        }
        if (classObserver) {
            classObserver.observe(wrapper, { attributes: true, attributeFilter: ['class'] });
        }

        if (persist !== false) {
            try {
                localStorage.setItem(MODE_KEY, mode);
                // Temanın kendi anahtarı da tutarlı kalsın (ray durumu).
                localStorage.setItem('lpx:side-menu-state', mode === 'dynamic' ? '1' : '0');
            } catch (e) { /* yok say */ }
        }
        renderMode(mode);
    }

    // Temanın KENDİ düğmesi (.menu-collapse-icon) class'ı değiştirirse modu ondan türet
    // → sidebar içindeki düğme ile header seçicisi aynı durumu paylaşır.
    classObserver = new MutationObserver(function () {
        applyMode(wrapper.classList.contains('hover-trigger') ? 'dynamic' : 'pinned');
    });

    // FOUC'un çözdüğü durumu temanın class'ına yansıt (native logo/hover kuralları da
    // işlesin). applyMode observer'ı kendi bağlar, bu yüzden ayrıca observe çağrılmaz.
    applyMode(currentMode(), false);

    // Header seçicisi — dropdown öğeleri.
    var modeMenu = document.querySelector('.apya-sidebar-mode-menu');
    if (modeMenu) {
        modeMenu.addEventListener('click', function (e) {
            var item = e.target.closest('[data-sidebar-mode]');
            if (!item) { return; }
            applyMode(item.getAttribute('data-sidebar-mode'));
        });
    }

    // Dikey scrollbar telafisi. .lpx-sidebar-container 280px ve overflow-y:auto;
    // scrollbar çıkınca iç genişlik 264px'e düşüyor ama .lpx-nav'ın min-width'i
    // 280px'te kalıyor → menü satırlarının sağ 16px'i kırpılıyor (kullanıcıya göre
    // bazı yapılandırmalarda yatay kaydırma çubuğu olarak görünüyor). Temanın CSS'inde
    // telafi HAZIR (.lpx-has-scrollbar → nav 265px, nav-menu max 265px) ama sınıfı
    // ekleyen JS Lite paketinde YOK (5.0.1 bundle'ında hiç geçmiyor) — Lite gap.
    var sidebar = document.getElementById('lpx-sidebar');
    if (sidebar) {
        // Kaydırmayı hangi elemanın yaptığı sabit DEĞİL: bir dönem .lpx-sidebar-container
        // (overflow-y:auto), kenar çubuğu modu çalışmasından sonra #lpx-sidebar. İkisini de
        // ölç, biri bile oluk açıyorsa telafiyi uygula — böylece kaydırmanın yeri değişse de
        // bozulmaz.
        var hosts = [sidebar, document.querySelector('.lpx-sidebar-container')].filter(Boolean);
        // Ölçüt "taşıyor mu" DEĞİL, "scrollbar gerçekten yer kaplıyor mu". Daraltılmış
        // rayda overflow gizli olduğu için oluk 0'dır ve sınıf eklenmez. Overlay
        // scrollbar'lı ortamlarda da oluk 0'dır, telafi gerekmez.
        // Kenarlık düşülmeli: kapsayıcının 1px sağ kenarlığı da offset/client farkına giriyor.
        var gutterOf = function (el) {
            var cs = getComputedStyle(el);
            return el.offsetWidth - el.clientWidth
                - (parseFloat(cs.borderLeftWidth) || 0) - (parseFloat(cs.borderRightWidth) || 0);
        };
        var syncScrollbarClass = function () {
            sidebar.classList.toggle('lpx-has-scrollbar', hosts.some(function (el) {
                return gutterOf(el) > 0;
            }));
        };
        syncScrollbarClass();
        window.addEventListener('resize', syncScrollbarClass);
        // nav'ı gözle: hem menü yüksekliği (scrollbar çıkar/kaybolur) hem ray genişliği
        // değişimi buradan görünür. toggle idempotent olduğu için geri besleme yok.
        if (window.ResizeObserver) {
            new ResizeObserver(syncScrollbarClass).observe(sidebar.querySelector('nav.lpx-nav') || sidebar);
        }
    }

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
