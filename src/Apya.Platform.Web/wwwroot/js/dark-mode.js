$(function () {
    // Tema kontrolcüsü — FOUC script (Components/ApyaThemeHead) ile aynı anahtar/hedef:
    //   key    → 'apya-theme'  (localStorage SoT)
    //   target → <html>        (data-theme → :root token override cascade eder)
    // data-theme paint ÖNCESİ ApyaThemeHead FOUC'u tarafından çözülür (kayıtlı || OS).
    // Toggle butonu header toolbar'ında (ThemeToggle ViewComponent) render edilir.
    var THEME_KEY = 'apya-theme';
    var $html = $(document.documentElement);

    // Auth/account sayfaları tema-nötr LIGHT (FOUC ile aynı kural) → toggle yok.
    if (/^\/Account\//i.test(location.pathname)) {
        applyTheme('light');
        return;
    }

    // FOUC'un çözdüğü mevcut temayı baz al (localStorage 'light' default'una DÜŞME).
    var current = $html.attr('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current);

    // Header sol: sayfa başlığını breadcrumb alanına yaz (hi-fi header).
    var bc = document.querySelector('.lpx-breadcrumb-container');
    if (bc) {
        var pt = (document.title || '').split('|')[0].trim();
        if (pt) {
            bc.textContent = '';
            var sp = document.createElement('span');
            sp.className = 'apya-page-title';
            sp.textContent = pt;
            bc.appendChild(sp);

            // Alt satır: SAYFA AÇIKLAMASI — hedef tasarımdaki
            // "Tüm projelerdeki görevler · tablo görünümü" deseni.
            // Kaynak: sayfa konteynerindeki data-page-description (bkz. .apya-page
            // sarmalayıcıları). Yeni altyapı yok; öznitelik yoksa satır basılmaz.
            // Önceki hali "tenant · ay/yıl" idi; tenant artık header'daki kendi
            // rozetinde görünüyor, tarih bilgi değeri taşımıyordu.
            var descEl = document.querySelector('[data-page-description]');
            var desc = descEl ? (descEl.getAttribute('data-page-description') || '').trim() : '';
            var subSp = document.createElement('span');
            subSp.className = 'apya-page-subtitle';
            subSp.textContent = desc;
            bc.appendChild(subSp);

            // Görünüm modu eki (" · tablo görünümü") — sayfada görünüm seçici varsa
            // header'a taşıyan kod (apya-header-views.js) buradan güncelliyor.
            window.apyaHeader = window.apyaHeader || {};
            window.apyaHeader.setViewLabel = function (label) {
                subSp.textContent = desc && label ? (desc + ' · ' + label)
                                  : (label || desc);
            };
        }
        // apya-theme-bridge.css "html.js .lpx-breadcrumb-container" ile gizlenmişti
        // (ham LeptonX breadcrumb'ı flaşlamasın diye) — pt boş olsa bile burada aç.
        bc.style.visibility = 'visible';
    }

    // Header sağ: kullanıcı adı yerine baş harf rozeti (avatar) — hedef tasarım.
    // #userDropdown zaten dropdown-toggle; yalnız içindeki metni değiştiriyoruz,
    // tıklama/menü davranışı dokunulmadan kalır. LeptonX bu öğeyi jQuery ready
    // sırasında bazen henüz eklemiyor, bazen ready'den SONRA kendi JS'iyle
    // yeniden render edip üstüne yazıyor (ikisi de canlı gözlendi) → tek seferlik
    // deneme yerine birkaç saniye boyunca kalıcı MutationObserver ile her
    // görünüşünde yeniden uygulanıyor.
    function tryReplaceUserAvatar() {
        var userNameEl = document.querySelector('.lpx-user-profile .user-full-name');
        if (!userNameEl) return false;
        var fullName = (window.abp && abp.currentUser && (abp.currentUser.name || abp.currentUser.userName)) || userNameEl.textContent.trim();
        var parts = fullName.trim().split(/\s+/).filter(Boolean);
        var initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]) : fullName.slice(0, 2);
        var avatar = document.createElement('span');
        avatar.className = 'apya-avatar apya-avatar-brand apya-user-avatar';
        avatar.textContent = initials.toUpperCase();
        avatar.title = fullName;
        userNameEl.replaceWith(avatar);
        return true;
    }
    var avatarReplaced = tryReplaceUserAvatar();
    var avatarObserver = new MutationObserver(function () {
        if (tryReplaceUserAvatar()) { avatarReplaced = true; }
    });
    avatarObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () {
        avatarObserver.disconnect();
        // apya-theme-bridge.css "html.js .lpx-user-profile .user-full-name" ile gizlenmişti;
        // rozete hiç dönüşemediyse (beklenmedik DOM durumu) ham adı görünür yap — kalıcı
        // gizlenmiş kalmasın diye güvenli geri dönüş.
        if (!avatarReplaced) {
            var fallback = document.querySelector('.lpx-user-profile .user-full-name');
            if (fallback) { fallback.style.visibility = 'visible'; }
        }
    }, 5000);

    // Tenant rozeti artık burada taşınmıyor — Body.Last'taki kendi senkron script'i
    // (TenantBadge/Default.cshtml) sidebar DOM'da hazırken, ilk paint'ten ÖNCE taşıyor
    // (bkz. o dosyadaki yorum). jQuery ready'yi beklemek sidebar'ın anlık sıçramasına
    // sebep oluyordu.

    // Toggle header toolbar'ında gelir; yoksa (toolbar'sız layout) fallback floating.
    if ($('#ThemeToggle').length === 0) {
        $('body').append(
            '<button type="button" id="ThemeToggle" class="apya-theme-toggle apya-theme-toggle--floating" ' +
            'title="Tema Değiştir" aria-label="Tema Değiştir"><i class="fa fa-sun"></i></button>'
        );
    }
    setToggleIcon(current);

    $(document).on('click', '#ThemeToggle', function (e) {
        e.preventDefault();
        var now = $html.attr('data-theme') === 'dark' ? 'dark' : 'light';
        var next = now === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e2) { /* yok say */ }
        setToggleIcon(next);

        // LeptonX kendi theming'ini de senkron tut (dropdown vs.).
        if (window.abp && abp.leptonX && abp.leptonX.theme) {
            try { abp.leptonX.theme.setTheme(next); } catch (e3) { /* yok say */ }
        }
    });

    function setToggleIcon(theme) {
        $('#ThemeToggle i')
            .removeClass('fa-sun fa-moon')
            .addClass(theme === 'dark' ? 'fa-moon' : 'fa-sun');
    }

    function applyTheme(theme) {
        // SoT: <html data-theme="..."> — tokens.css :root override buradan beslenir.
        $html.attr('data-theme', theme);
        // LeptonX class mirror (dropdown'lar, kendi theming'i için).
        $html.removeClass('lpx-theme-light lpx-theme-dark lpx-theme-dim');
        $html.addClass(theme === 'dark' ? 'lpx-theme-dark' : 'lpx-theme-light');
        // Body class — eski DataTable/jQuery widget uyumu.
        $('body').toggleClass('dark-theme', theme === 'dark');

        // Token'ları CSS dışında okuyan tüketiciler (chart.js — HANDOFF: "tema
        // değişince grafikler yeniden kurulur") için tek bildirim noktası.
        document.dispatchEvent(new CustomEvent('apya:themechange', { detail: { theme: theme } }));
    }
});
