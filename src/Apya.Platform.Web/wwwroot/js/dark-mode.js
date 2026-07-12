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
    }
});
