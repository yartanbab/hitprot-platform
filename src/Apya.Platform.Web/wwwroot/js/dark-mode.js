$(function () {
    // Tema kontrolcüsü — FOUC script (Components/ApyaThemeHead) ile aynı anahtar/hedef:
    //   key    → 'apya-theme'  (localStorage SoT)
    //   target → <html>        (data-theme → :root token override cascade eder)
    // data-theme paint ÖNCESİ ApyaThemeHead FOUC'u tarafından çözülür (kayıtlı || OS).
    // Burada yalnız: lpx/body class senkronu + toggle davranışı.
    var THEME_KEY = 'apya-theme';
    var $html = $(document.documentElement);

    // Auth/account sayfaları tema-nötr LIGHT (FOUC ile aynı kural) → toggle da gösterilmez.
    if (/^\/Account\//i.test(location.pathname)) {
        applyTheme('light');
        return;
    }

    // FOUC'un çözdüğü mevcut temayı baz al (localStorage 'light' default'una DÜŞME —
    // aksi halde OS-dark kullanıcıda dark→light flash olur).
    var current = $html.attr('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current);

    // Toggle UI — geçici floating buton (header entegrasyonu P1'de).
    if ($('#ThemeToggle').length === 0) {
        var iconClass = current === 'dark' ? 'fa-moon' : 'fa-sun';
        var $toggle = $('<button type="button" id="ThemeToggle" aria-label="Tema Değiştir" title="Tema Değiştir"><i class="fa ' + iconClass + '"></i></button>');
        $('body').append($toggle);
    }

    $(document).on('click', '#ThemeToggle', function () {
        var now = $html.attr('data-theme') === 'dark' ? 'dark' : 'light';
        var next = now === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* yok say */ }

        var $icon = $(this).find('i');
        $icon.fadeOut(120, function () {
            $icon.removeClass('fa-sun fa-moon').addClass(next === 'dark' ? 'fa-moon' : 'fa-sun').fadeIn(120);
        });

        // LeptonX kendi theming'ini de senkron tut (dropdown vs.).
        if (window.abp && abp.leptonX && abp.leptonX.theme) {
            try { abp.leptonX.theme.setTheme(next); } catch (e) { /* yok say */ }
        }
    });

    function applyTheme(theme) {
        // SoT: <html data-theme="..."> — tokens.css :root override buradan beslenir.
        $html.attr('data-theme', theme);
        // LeptonX class mirror (dropdown'lar, kendi theming'i için).
        $html.removeClass('lpx-theme-light lpx-theme-dark lpx-theme-dim');
        $html.addClass(theme === 'dark' ? 'lpx-theme-dark' : 'lpx-theme-light');
        // Body class — eski DataTable/jQuery widget uyumu.
        $('body').toggleClass('dark-theme', theme === 'dark');
    }
});
