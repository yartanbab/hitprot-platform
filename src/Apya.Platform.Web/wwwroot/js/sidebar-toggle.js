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
    // ── MOBİL KABUK VARYANTI: çekmece / alt sekme ────────────────────────────
    // Kenar çubuğu modunun (yukarıdaki applyMode/renderMode) birebir ikizi:
    //   SoT        <html data-mobile-shell="drawer|tabs">
    //   kalıcılık  localStorage 'apya-mobile-shell'
    //   pre-paint  ApyaThemeHead FOUC script'i (apya-theme / apya-density /
    //              apya-sidebar-mode ile aynı blok) → varyant değişimi sayfa
    //              yenilemede yanıp sönmez
    //   seçici UI  Pages/Settings/Index.cshtml (#MobileShellChooser)
    // Görünüm farkı tamamen CSS'te (apya-theme-bridge.css "MOBİL NAVİGASYON").
    if (/^\/Account\//i.test(location.pathname)) {
        return;
    }

    var htmlEl = document.documentElement;
    var SHELL_KEY = 'apya-mobile-shell';
    var SHELLS = ['drawer', 'tabs'];

    function currentShell() {
        return htmlEl.getAttribute('data-mobile-shell') === 'tabs' ? 'tabs' : 'drawer';
    }

    function renderShell(shell) {
        var chooser = document.getElementById('MobileShellChooser');
        if (!chooser) { return; }
        chooser.querySelectorAll('[data-mobile-shell]').forEach(function (input) {
            input.checked = input.getAttribute('data-mobile-shell') === shell;
        });
    }

    function applyShell(shell, persist) {
        if (SHELLS.indexOf(shell) < 0) { shell = 'drawer'; }
        htmlEl.setAttribute('data-mobile-shell', shell);
        if (persist !== false) {
            try { localStorage.setItem(SHELL_KEY, shell); } catch (e) { /* yok say */ }
        }
        renderShell(shell);
        // Bar yüksekliği varyanta göre değişiyor (54 ↔ 48px) — mobil kabuk
        // bloğu bunu dinleyip --apya-mobile-header-h'i yeniden ÖLÇER.
        window.dispatchEvent(new CustomEvent('apya:mobile-shell'));
    }

    // FOUC'un çözdüğü durumu seçiciye yansıt (yeniden yazma, kalıcılık zaten var).
    applyShell(currentShell(), false);

    var chooser = document.getElementById('MobileShellChooser');
    if (chooser) {
        chooser.addEventListener('change', function (e) {
            var input = e.target.closest('[data-mobile-shell]');
            if (input) { applyShell(input.getAttribute('data-mobile-shell')); }
        });
    }
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
    var personToggle = navbar.querySelector('[data-lpx-toggle="mobile-user-menu-group"]');
    var group = document.getElementById('mobile-user-menu-group');

    // --- Metinler: head'deki JSON bloğundan (ApyaThemeHead). JS'e metin gömülmez;
    //     SidebarModeToggle'daki data-label-* deseninin çok anahtarlı karşılığı
    //     (mobil barda bizim bir view'umuz yok, etiketler head'e iner). ---
    var T = {};
    try {
        var l10nEl = document.getElementById('ApyaMobileShellL10n');
        if (l10nEl) { T = JSON.parse(l10nEl.textContent) || {}; }
    } catch (e) { /* boş sözlük — etiketler görünmez ama kabuk çalışır */ }
    function t(key) { return T[key] || ''; }

    // =========================================================================
    // MENÜ OKUMA — command-palette.js'in deseni: menü SUNUCUDA izin filtreli
    // render ediliyor, sekmeler/gruplar sabit YAZILMAZ, DOM'dan türetilir.
    // Öğenin sunucu anahtarı: yaprakta <a id="MenuItem_Apya_Dashboard">,
    // grupta iç <ul id="MenuItem_Apya_Finance"> (canlı DOM'da doğrulandı —
    // grup <a>'sında id yok, o yüzden ikisine de bakılır).
    // =========================================================================
    function menuKey(li) {
        var el = li.querySelector(':scope > a[id^="MenuItem_"], :scope > ul[id^="MenuItem_"]');
        return el ? el.id.replace(/^MenuItem_/, '').replace(/_/g, '.') : '';
    }

    function itemInfo(li) {
        var a = li.querySelector(':scope > a');
        var textEl = a && a.querySelector('.lpx-menu-item-text');
        var iconEl = a && a.querySelector('.lpx-menu-item-icon i');
        return {
            li: li,
            key: menuKey(li),
            label: textEl ? textEl.textContent.trim() : ((a && a.textContent) || '').trim(),
            icon: iconEl ? iconEl.className.replace(/\blpx-icon\b/, '').trim() : 'fa fa-file',
            href: (a && a.getAttribute('href')) || '',
            sub: li.querySelector(':scope > ul.lpx-inner-menu')
        };
    }

    function topLevelItems() {
        var root = document.getElementById('mobile-sidebar');
        if (!root) { return []; }
        return Array.prototype.filter.call(root.children, function (li) {
            return li.tagName === 'LI' && !li.classList.contains('apya-mshell-grouphead');
        }).map(itemInfo);
    }

    // "GÜNLÜK" dörtlüsü (= alt sekmeler): önce küratörlü sıra — tasarımın günlük
    // dört hedefi. İzin yüzünden biri yoksa yerine kalan üst düzey öğelerden
    // DOM sırasına göre doldurulur; hiç doldurulamazsa sekme sayısı 5'in altına
    // düşer (grid esnek, bkz. CSS).
    var DAILY_KEYS = ['Apya.Dashboard', 'Apya.Work', 'Apya.Finance', 'Apya.Reports'];
    var DAILY_MAX = 4;

    function splitItems() {
        var items = topLevelItems();
        var daily = [];
        DAILY_KEYS.forEach(function (key) {
            items.forEach(function (i) {
                if (i.key === key && daily.indexOf(i) < 0) { daily.push(i); }
            });
        });
        items.forEach(function (i) {
            if (daily.length < DAILY_MAX && daily.indexOf(i) < 0) { daily.push(i); }
        });
        return {
            daily: daily,
            other: items.filter(function (i) { return daily.indexOf(i) < 0; })
        };
    }

    // Aktif hedef: öğenin KENDİ href'i ya da altındaki herhangi bir href, en uzun
    // önek kazanır (apyaActiveMenuInfo ile aynı eşleşme kuralı).
    function matchLength(info) {
        var path = location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
        var hrefs = [];
        if (info.href) { hrefs.push(info.href); }
        if (info.sub) {
            info.sub.querySelectorAll('a[href]').forEach(function (a) {
                hrefs.push(a.getAttribute('href'));
            });
        }
        var best = -1;
        hrefs.forEach(function (h) {
            h = (h || '').split('?')[0].replace(/\/+$/, '').toLowerCase();
            if (!h || h === '#') { return; }
            if ((path === h || path.indexOf(h + '/') === 0) && h.length > best) { best = h.length; }
        });
        return best;
    }

    // =========================================================================
    // 1) ÜST BAR — hamburger · "A" işareti · sayfa adı · arama · bildirim · avatar
    //    Marka işareti salt CSS (ray modundaki işaretle aynı dil); burada yalnız
    //    düğüm sırası, sayfa adı ve yeni aksiyon düğmeleri kuruluyor.
    // =========================================================================
    if (toggle) {
        // Hamburger bar'ın BAŞINA (Material Top App Bar / Apple HIG). Düğüm
        // taşınır, yeniden üretilmez → temanın dinleyicisi korunur.
        navbar.insertBefore(toggle, navbar.firstChild);
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-label', t('open'));
        toggle.setAttribute('aria-controls', 'mobile-navbar');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    }

    // Sayfa adı — YENİ veri kaynağı açılmaz: masaüstü breadcrumb'ı ile aynı
    // fonksiyon (apya-topbar-shell.js → window.apyaActiveMenuInfo).
    var titleEl = document.createElement('span');
    titleEl.className = 'apya-mshell-title';
    var info = (typeof window.apyaActiveMenuInfo === 'function') ? window.apyaActiveMenuInfo() : null;
    titleEl.textContent = info ? info.page : (document.title || '').split('|')[0].trim();
    var logoContainer = navbar.querySelector('.lpx-logo-container');
    if (logoContainer) { logoContainer.after(titleEl); }

    function iconButton(cls, iconClass, label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'apya-mshell-btn ' + cls;
        b.innerHTML = '<i class="' + iconClass + '" aria-hidden="true"></i>';
        b.title = label;
        b.setAttribute('aria-label', label);
        return b;
    }

    // Arama: mevcut #ApyaCommandPaletteTrigger programatik tıklanır —
    // command-palette.js dinleyicisi document'e delege, görünürlükten
    // bağımsız çalışır (bkz. command-palette.js son satırı).
    var searchBtn = iconButton('apya-mshell-search', 'fa fa-magnifying-glass', t('search'));
    searchBtn.addEventListener('click', function () {
        var trigger = document.getElementById('ApyaCommandPaletteTrigger');
        if (trigger) { trigger.click(); }
    });

    // Bildirim: sayaç kaynağı notification-bell.js'in beslediği rozet — ikinci
    // bir istek açılmaz, aynı düğüm gözlenir.
    var bellLink = document.createElement('a');
    bellLink.className = 'apya-mshell-btn apya-mshell-bell';
    bellLink.href = '/Notifications';
    bellLink.title = t('notifications');
    bellLink.setAttribute('aria-label', t('notifications'));
    bellLink.innerHTML = '<i class="fa-regular fa-bell" aria-hidden="true"></i>' +
                         '<span class="apya-mshell-dot" hidden></span>';

    var userMenu = navbar.querySelector('.user-menu');
    if (userMenu) {
        navbar.insertBefore(searchBtn, userMenu);
        navbar.insertBefore(bellLink, userMenu);
    }

    if (personToggle) {
        personToggle.setAttribute('role', 'button');
        personToggle.setAttribute('tabindex', '0');
        personToggle.setAttribute('aria-label', t('account'));
        personToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                personToggle.click();
            }
        });
    }

    // Kullanıcı kimliği — dark-mode.js'teki baş harf kuralının aynısı.
    var currentUser = (window.abp && window.abp.currentUser) || {};
    // name YALNIZ ad; soyad surName'de durur — ikisi birleşmezse tek kelime kalıp
    // ad'ın ilk iki harfi basılıyordu (dark-mode.js'te aynı kural).
    var fullName = [currentUser.name, currentUser.surName].filter(Boolean).join(' ').trim()
        || currentUser.userName || '';
    var initials = '';
    if (fullName) {
        var parts = fullName.trim().split(/\s+/).filter(Boolean);
        initials = (parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]) : (parts[0] || '').slice(0, 1))
            .toLocaleUpperCase('tr');
    }
    // Avatar: temanın <i> düğümü KORUNUR (aç/kapa ona bağlı), yalnız glyph
    // yerine baş harfler basılır (glyph'i CSS söndürür).
    if (personToggle && initials) {
        personToggle.classList.add('apya-mshell-avatar');
        personToggle.textContent = initials;
    }

    // Bar yüksekliği TEK KAYNAK: barı ölç, CSS'e bildir (hesap sheet'i ve
    // çekmece konumu buna bağlı). Varyant değişiminde bar 54 ↔ 48px olduğu için
    // yeniden ölçülür — konum elle hesaplanmaz.
    function measureBar() {
        var h = Math.round(navbar.getBoundingClientRect().height);
        if (h > 0) {
            document.documentElement.style.setProperty('--apya-mobile-header-h', h + 'px');
        }
    }
    measureBar();
    window.addEventListener('resize', measureBar);
    // Varyant değişiminde bar 54 ↔ 48px oluyor. Olayı dinleyip requestAnimationFrame
    // ile ölçmek YETMEDİ: rAF yeni düzenden bir adım geriden okuyordu (ölçüldü —
    // bar 54'e çıkmışken değişkene 48 yazılıyordu). Barın KENDİSİ gözlenir; ölçüm
    // düzen yerleştikten sonra, tek kaynaktan gelir. measureBar yalnız <html>'e
    // özel değişken yazar, barın yüksekliğini etkilemez → geri besleme yok.
    if (window.ResizeObserver) {
        new ResizeObserver(measureBar).observe(navbar);
    } else {
        window.addEventListener('apya:mobile-shell', function () {
            window.requestAnimationFrame(measureBar);
        });
    }

    // =========================================================================
    // 2) ÇEKMECE — tam ekran, iki gruplu (GÜNLÜK / DİĞER) + 2. seviye panel
    // =========================================================================
    // Başlık: "A" işareti (CSS) + MENÜ + kapat düğmesi (modal-escape kuralı).
    if (!drawer.querySelector('.apya-drawer-head')) {
        var head = document.createElement('div');
        head.className = 'apya-drawer-head';
        head.innerHTML = '<span class="apya-drawer-brand" aria-hidden="true"></span>' +
                         '<span class="apya-drawer-head-title">' + t('menu') + '</span>';
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'apya-drawer-close';
        closeBtn.setAttribute('aria-label', t('close'));
        closeBtn.innerHTML = '<i class="fa fa-xmark" aria-hidden="true"></i>';
        closeBtn.addEventListener('click', close);
        head.appendChild(closeBtn);
        drawer.insertBefore(head, drawer.firstChild);
    }

    // --- Gruplama: başlık satırları eklenir ve li'ler AYNI ul içinde sıralanır.
    //     Yeniden ebeveynleme YOK → temanın dinleyicileri ve DOM sözleşmesi
    //     (ul#mobile-sidebar > li.outer-menu-item) bozulmaz.
    function groupHead(root, kind, label) {
        var existing = root.querySelector(':scope > .apya-mshell-grouphead[data-kind="' + kind + '"]');
        if (existing) { return existing; }
        var li = document.createElement('li');
        li.className = 'apya-mshell-grouphead';
        li.setAttribute('data-kind', kind);
        li.setAttribute('aria-hidden', 'true');
        li.textContent = label;
        return li;
    }

    var split = { daily: [], other: [] };
    function buildDrawerGroups() {
        var root = document.getElementById('mobile-sidebar');
        if (!root) { return; }
        split = splitItems();
        var hDaily = groupHead(root, 'daily', t('groupDaily'));
        var hOther = groupHead(root, 'other', t('groupOther'));
        root.appendChild(hDaily);
        split.daily.forEach(function (i) {
            i.li.classList.add('apya-mshell-daily');
            root.appendChild(i.li);
        });
        if (split.other.length) {
            root.appendChild(hOther);
            split.other.forEach(function (i) {
                i.li.classList.remove('apya-mshell-daily');
                root.appendChild(i.li);
            });
        } else if (hOther.parentElement) {
            hOther.remove();
        }
    }
    buildDrawerGroups();

    // --- 2. seviye panel: grup satırları akordeon AÇMAZ (bugün açılan akordeon
    //     listeyi 20 satıra çıkarıyor), aynı çekmecenin içinde yatay kayan ikinci
    //     bir panel açılır. Bu bir aç/kapa makinesi DEĞİL — çekmecenin İÇ
    //     görünümü; açık/kapalı hâlâ temanın .d-none'ı.
    var panel = document.createElement('div');
    panel.className = 'apya-mshell-panel';
    panel.innerHTML =
        '<div class="apya-mshell-panel-head">' +
        '  <button type="button" class="apya-mshell-back">' +
        '    <i class="fa fa-chevron-left" aria-hidden="true"></i><span></span>' +
        '  </button>' +
        '</div>' +
        '<div class="apya-mshell-panel-body"></div>';
    drawer.appendChild(panel);
    var panelBody = panel.querySelector('.apya-mshell-panel-body');
    var backBtn = panel.querySelector('.apya-mshell-back');
    backBtn.querySelector('span').textContent = t('back');
    backBtn.addEventListener('click', closePanel);

    function rowLink(child) {
        var a = document.createElement('a');
        a.className = 'apya-mshell-panel-row';
        a.href = child.href;
        a.innerHTML = '<i class="' + child.icon + '" aria-hidden="true"></i><span></span>';
        a.querySelector('span').textContent = child.label;
        if (matchLength(child) >= 0) { a.classList.add('is-active'); }
        return a;
    }

    // Menü en fazla 3 seviye (İş Yönetimi › Panolar › Görevler): 3. seviye ayrı
    // bir ekran açmaz, başlık altında düz liste olarak görünür.
    function renderPanelInto(ul) {
        Array.prototype.forEach.call(ul.children, function (li) {
            if (li.tagName !== 'LI') { return; }
            var child = itemInfo(li);
            if (child.sub) {
                var section = document.createElement('div');
                section.className = 'apya-mshell-panel-section';
                section.textContent = child.label;
                panelBody.appendChild(section);
                renderPanelInto(child.sub);
            } else if (child.href) {
                panelBody.appendChild(rowLink(child));
            }
        });
    }

    // DİKKAT: sınıf yazımları KOŞULA bağlı. classList.add/remove, sınıf zaten
    // (yok)var olsa bile class attribute'unu yeniden yazar ve bu bir
    // MutationRecord kuyruklar — aşağıdaki sync() çekmecenin class'ını gözlediği
    // için koşulsuz yazım sonsuz döngü yapar (canlıda renderer'ı kilitledi).
    function openPanel(item) {
        if (!item || !item.sub) { return; }
        panelBody.innerHTML = '';
        renderPanelInto(item.sub);
        backBtn.querySelector('span').textContent = item.label;
        if (!drawer.classList.contains('apya-mshell-in-panel')) {
            drawer.classList.add('apya-mshell-in-panel');
        }
        var first = panelBody.querySelector('.apya-mshell-panel-row');
        // ODAK ASLA KAYDIRMASIN. Odak verildiği an panel HÂLÂ translateX(100%):
        // tarayıcı odaklanan satırı görünür kılmak için en yakın kaydırma kabını
        // (#mobile-navbar; overflow:hidden ama yine de programatik kaydırılabilir,
        // translateX(100%) paneli scrollWidth'i 2 viewport'a çıkarıyor) tam bir
        // viewport genişliği sağa kaydırıyordu. Çekmecenin TAMAMI — başlık dâhil —
        // ekran dışına çıkıyor, geriye BOŞ EKRAN kalıyordu. Chromium kaymayı geçiş
        // bitince kırpıp geri alıyor (yalnız bir flaş); iOS Safari almıyor, ekran
        // bir sonraki dokunuşa kadar boş kalıyor — bildirilen hata bu.
        if (first) { first.focus({ preventScroll: true }); }
        // preventScroll'u desteklemeyen eski sürümler için aynı görevdeki geri
        // alma (boyanmadan önce çalışır, bu yüzden kayma hiç görünmez).
        drawer.scrollLeft = 0;
        drawer.scrollTop = 0;
    }

    function closePanel() {
        if (drawer.classList.contains('apya-mshell-in-panel')) {
            drawer.classList.remove('apya-mshell-in-panel');
        }
    }

    // Temanın akordeon dinleyicisi YAKALAMA fazında durdurulur: kendi
    // dinleyicimizi anchor'a eklemek yetmez (tema da aynı düğüme bağlı),
    // ancak ÜST düğümde capture ile stopPropagation hedefin kendi
    // dinleyicilerini de engeller.
    drawer.addEventListener('click', function (e) {
        if (window.innerWidth >= 768) { return; }
        var a = e.target.closest('a.lpx-menu-item-link');
        if (!a || a.closest('.apya-mshell-panel')) { return; }
        var li = a.parentElement;
        if (!li || li.parentElement !== document.getElementById('mobile-sidebar')) { return; }
        var item = itemInfo(li);
        if (!item.sub) { return; }   // yaprak: normal gezinme
        e.preventDefault();
        e.stopPropagation();
        openPanel(item);
    }, true);

    // =========================================================================
    // 3) HESAP PANELİ → ALT SHEET (kimlik başlığı + gerçek aksiyonlar)
    //    Aç/kapa yine temanın .d-none'ı; burada yalnız içerik ve sıra kuruluyor.
    //    Mevcut satırlar (Genel Ayarlar / Hesabım / Çıkış) YENİDEN ÜRETİLMEZ,
    //    kendi menülerinden TAŞINIR → href/antiforgery davranışları korunur.
    // =========================================================================
    var bellDot = bellLink.querySelector('.apya-mshell-dot');
    var countPill = null;

    function sheetRow(tag, cls, iconClass, label) {
        var el = document.createElement(tag);
        el.className = 'apya-mshell-row ' + cls;
        el.innerHTML = '<i class="' + iconClass + '" aria-hidden="true"></i>' +
                       '<span class="apya-mshell-row-label"></span>';
        el.querySelector('.apya-mshell-row-label').textContent = label;
        return el;
    }

    function activateOnKey(el, fn) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', fn);
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fn();
            }
        });
    }

    function buildSheet() {
        if (!group || group.querySelector('.apya-mshell-sheet-head')) { return; }

        // --- Kimlik başlığı: avatar + ad + e-posta + kiracı pili.
        //     Kaynak abp.currentUser ve mevcut kiracı pili — yeni istek yok.
        var headEl = document.createElement('div');
        headEl.className = 'apya-mshell-sheet-head';
        var tenantEl = document.querySelector('#apya-tenant-switch .apya-tenant-switch-name');
        var tenantName = tenantEl ? tenantEl.textContent.trim() : '';
        headEl.innerHTML =
            '<span class="apya-mshell-sheet-avatar"></span>' +
            '<span class="apya-mshell-sheet-id">' +
            '  <span class="apya-mshell-sheet-name"></span>' +
            '  <span class="apya-mshell-sheet-mail"></span>' +
            '</span>' +
            (tenantName ? '<span class="apya-mshell-sheet-tenant"></span>' : '');
        headEl.querySelector('.apya-mshell-sheet-avatar').textContent = initials;
        headEl.querySelector('.apya-mshell-sheet-name').textContent = fullName;
        headEl.querySelector('.apya-mshell-sheet-mail').textContent = currentUser.email || '';
        if (tenantName) { headEl.querySelector('.apya-mshell-sheet-tenant').textContent = tenantName; }
        group.insertBefore(headEl, group.firstChild);

        // --- Bildirimler (sağda sayaç pili).
        var notifRow = sheetRow('a', 'apya-mshell-row--notif', 'fa-regular fa-bell', t('notifications'));
        notifRow.setAttribute('href', '/Notifications');
        countPill = document.createElement('span');
        countPill.className = 'apya-mshell-count';
        countPill.hidden = true;
        notifRow.appendChild(countPill);

        // --- Ara veya komut çalıştır (⌘K).
        var searchRow = sheetRow('div', 'apya-mshell-row--search', 'fa fa-magnifying-glass', t('search'));
        var kbd = document.createElement('kbd');
        kbd.className = 'apya-mshell-kbd';
        kbd.textContent = '⌘K';
        searchRow.appendChild(kbd);
        activateOnKey(searchRow, function () {
            var trigger = document.getElementById('ApyaCommandPaletteTrigger');
            if (trigger) { trigger.click(); }
        });

        // --- Tema anahtarı: İKİNCİ KAYNAK AÇILMAZ. Mevcut #ThemeToggle
        //     programatik tıklanır (dark-mode.js delege dinliyor), böylece
        //     'apya-theme' anahtarını yine o yazar.
        var themeRow = sheetRow('div', 'apya-mshell-row--theme', 'fa fa-moon', '');
        var themeSwitch = document.createElement('span');
        themeSwitch.className = 'apya-mshell-switch';
        themeRow.appendChild(themeSwitch);
        function renderTheme() {
            var dark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeRow.querySelector('.apya-mshell-row-label').textContent = dark ? t('themeDark') : t('themeLight');
            themeRow.querySelector('i').className = dark ? 'fa fa-moon' : 'fa fa-sun';
            themeSwitch.classList.toggle('is-on', dark);
            themeRow.setAttribute('aria-pressed', dark ? 'true' : 'false');
        }
        renderTheme();
        new MutationObserver(renderTheme).observe(document.documentElement,
            { attributes: true, attributeFilter: ['data-theme'] });
        activateOnKey(themeRow, function () {
            var themeToggle = document.getElementById('ThemeToggle');
            if (themeToggle) { themeToggle.click(); }
        });

        // --- Mevcut hesap bağlantıları: kendi (gizli) menülerinden taşınır.
        //     Silmiyoruz — dil seçici de dahil hiçbir işlev kaybolmasın.
        var settingsLink = group.querySelector('#MenuItem_Apya_Account_Settings');
        var manageLink = group.querySelector('#MenuItem_Account_Manage');
        var logoutLink = group.querySelector('#MenuItem_Account_Logout');
        var langToggle = group.querySelector('.lpx-language-selection.lpx-toggle');
        var langMenu = langToggle ? langToggle.nextElementSibling : null;

        [settingsLink, manageLink, logoutLink].forEach(function (a) {
            if (a) { a.classList.add('apya-mshell-row'); }
        });
        if (settingsLink && !settingsLink.querySelector('i')) {
            settingsLink.insertAdjacentHTML('afterbegin', '<i class="fa fa-gear" aria-hidden="true"></i>');
        }
        if (manageLink && !manageLink.querySelector('i')) {
            manageLink.insertAdjacentHTML('afterbegin', '<i class="fa fa-user" aria-hidden="true"></i>');
        }
        if (logoutLink) {
            logoutLink.classList.add('apya-mshell-row--logout');
            if (!logoutLink.querySelector('i')) {
                logoutLink.insertAdjacentHTML('afterbegin',
                    '<i class="fa fa-arrow-right-from-bracket" aria-hidden="true"></i>');
            }
        }
        if (langToggle) { langToggle.classList.add('apya-mshell-row', 'apya-mshell-row--lang'); }

        [notifRow, searchRow, themeRow, settingsLink, manageLink, langToggle, langMenu, logoutLink]
            .forEach(function (el) { if (el) { group.appendChild(el); } });
    }
    buildSheet();

    // Okunmamış sayacı: notification-bell.js'in beslediği rozet gözlenir
    // (bar noktası ve sheet pili aynı kaynaktan).
    function syncUnread() {
        var badge = document.getElementById('notification-unread-badge');
        var text = (badge && !badge.classList.contains('d-none'))
            ? (badge.textContent || '').trim() : '';
        var has = !!text && text !== '0';
        if (bellDot) { bellDot.hidden = !has; }
        if (countPill) {
            countPill.hidden = !has;
            countPill.textContent = text;
        }
    }
    var badgeEl = document.getElementById('notification-unread-badge');
    if (badgeEl) {
        new MutationObserver(syncUnread).observe(badgeEl,
            { attributes: true, childList: true, characterData: true, subtree: true });
    }
    syncUnread();

    // =========================================================================
    // 4) ALT SEKME ÇUBUĞU (varyant B) — DOM her iki varyantta kurulur,
    //    görünürlüğüne CSS (html[data-mobile-shell]) karar verir.
    // =========================================================================
    function buildTabs() {
        if (document.querySelector('.apya-mshell-tabs')) { return; }
        var tabs = document.createElement('nav');
        tabs.className = 'apya-mshell-tabs';
        tabs.setAttribute('aria-label', t('menu'));

        var best = -1, bestEl = null;
        split.daily.forEach(function (item) {
            var isLeaf = !!item.href && !item.sub;
            var el = document.createElement(isLeaf ? 'a' : 'button');
            el.className = 'apya-mshell-tab';
            // Kısa etiket anahtarı yoksa menüdeki tam ad kullanılır.
            var label = t('short.' + item.key) || item.label;
            el.innerHTML = '<i class="' + item.icon + '" aria-hidden="true"></i>' +
                           '<span class="apya-mshell-tab-label"></span>';
            el.querySelector('.apya-mshell-tab-label').textContent = label;
            el.title = item.label;
            if (isLeaf) {
                el.href = item.href;
            } else {
                el.type = 'button';
                el.addEventListener('click', function () {
                    // Çekmece temanın kendi toggle'ı ile açılır (paralel state yok),
                    // panel içeriği önceden hazırlanır.
                    openPanel(item);
                    if (!isOpen() && toggle) { toggle.click(); }
                });
            }
            var len = matchLength(item);
            if (len > best) { best = len; bestEl = el; }
            tabs.appendChild(el);
        });

        // "Daha": gizli hamburger'e programatik tıklama → aynı tam ekran menü.
        var moreBtn = document.createElement('button');
        moreBtn.type = 'button';
        moreBtn.className = 'apya-mshell-tab apya-mshell-tab--more';
        moreBtn.innerHTML = '<i class="fa fa-ellipsis" aria-hidden="true"></i>' +
                            '<span class="apya-mshell-tab-label"></span>';
        moreBtn.querySelector('.apya-mshell-tab-label').textContent = t('more');
        moreBtn.addEventListener('click', function () {
            closePanel();
            if (!isOpen() && toggle) { toggle.click(); }
        });
        tabs.appendChild(moreBtn);

        if (bestEl) {
            bestEl.classList.add('is-active');
            bestEl.setAttribute('aria-current', 'page');
        }
        document.body.appendChild(tabs);

        // Çubuk yüksekliği de TEK KAYNAK (bar ile aynı kural): içeriğin dip
        // boşluğu ve sayfaların kendi alt şeritleri (Görevler konsolu) bu
        // değişkene dayanır — elle 65px yazılmaz.
        var measureTabs = function () {
            var h = Math.round(tabs.getBoundingClientRect().height);
            if (h > 0) {
                document.documentElement.style.setProperty('--apya-mobile-tabs-h', h + 'px');
            }
        };
        measureTabs();
        window.addEventListener('resize', measureTabs);
        if (window.ResizeObserver) { new ResizeObserver(measureTabs).observe(tabs); }
    }

    // =========================================================================
    // 5) AÇIK/KAPALI YAN ETKİLERİ — backdrop, gövde kilidi, aria, odak, Esc
    //    (mevcut desen korunur: temanın .d-none'ı GÖZLENİR, yönetilmez)
    // =========================================================================
    var backdrop = document.createElement('div');
    backdrop.className = 'apya-mobile-nav-backdrop';
    backdrop.addEventListener('click', function () {
        if (isOpen()) { close(); }
        if (isSheetOpen()) { closeSheet(); }
    });
    document.body.appendChild(backdrop);

    function isOpen() {
        return !drawer.classList.contains('d-none');
    }
    function isSheetOpen() {
        return !!group && !group.classList.contains('d-none');
    }

    function close() {
        // Temanın kendi toggle'ını kullan → tema state'i ile senkron kalır.
        if (isOpen() && toggle) {
            toggle.click();
        } else {
            drawer.classList.add('d-none');
        }
    }
    function closeSheet() {
        if (isSheetOpen() && personToggle) {
            personToggle.click();
        } else if (group) {
            group.classList.add('d-none');
        }
    }

    var lastFocus = null;
    var wasOpen = false;
    var wasSheetOpen = false;
    function sync() {
        var open = isOpen();
        var sheetOpen = isSheetOpen();
        backdrop.classList.toggle('is-open', open || sheetOpen);
        document.body.classList.toggle('apya-mobile-nav-open', open || sheetOpen);
        if (toggle) {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? t('close') : t('open'));
        }
        if (personToggle) {
            personToggle.setAttribute('aria-expanded', sheetOpen ? 'true' : 'false');
        }
        // Odak ve panel sıfırlama yalnız GEÇİŞTE: gözlenen düğümün class'ı
        // panel açılıp kapanırken de değişiyor, her tetiklemede odak alınsaydı
        // 2. seviye panele geçildiği anda odak kapat düğmesine kaçardı.
        if (open === wasOpen && sheetOpen === wasSheetOpen) { return; }
        wasOpen = open;
        wasSheetOpen = sheetOpen;
        if (!open) { closePanel(); }
        if (open || sheetOpen) {
            if (!lastFocus) { lastFocus = document.activeElement; }
            var first = open
                ? drawer.querySelector('.apya-drawer-close')
                : group.querySelector('.apya-mshell-row');
            if (first && first.focus) { first.focus(); }
        } else if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
            lastFocus = null;
        }
    }

    new MutationObserver(sync).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    if (group) {
        new MutationObserver(sync).observe(group, { attributes: true, attributeFilter: ['class'] });
    }
    buildTabs();
    sync();

    // Esc ile kapat (panel açıksa önce panel kapanır — geri adımı).
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') { return; }
        if (drawer.classList.contains('apya-mshell-in-panel')) { closePanel(); return; }
        if (isOpen()) { close(); return; }
        if (isSheetOpen()) { closeSheet(); }
    });

    // Masaüstüne genişletilirse açık kalan çekmece/sheet temizlenir.
    window.addEventListener('resize', function () {
        if (window.innerWidth < 768) { return; }
        if (isOpen()) { close(); }
        if (isSheetOpen()) { closeSheet(); }
    });
});
