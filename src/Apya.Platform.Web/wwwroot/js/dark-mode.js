$(function () {
    // FOUC script ile aynı key ve target kullanılır:
    //   key    → 'apya-theme'  (localStorage SoT)
    //   target → document.documentElement (<html>)  → :root CSS değişkenleri doğru cascade eder
    var THEME_KEY = 'apya-theme';
    var $html = $(document.documentElement);

    // FOUC script zaten html'yi set etmiş olabilir; yoksa localStorage'dan oku.
    var savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);

    // Toggle UI
    if ($('#ThemeToggle').length === 0) {
        var $toggle = $('<div id="ThemeToggle" title="Tema Değiştir"><i class="fa ' + (savedTheme === 'dark' ? 'fa-moon' : 'fa-sun') + '"></i></div>');
        $('body').append($toggle);
    }

    $(document).on('click', '#ThemeToggle', function () {
        var current = $html.attr('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);

        var $icon = $(this).find('i');
        $icon.fadeOut(150, function () {
            $icon.removeClass('fa-sun fa-moon').addClass(next === 'dark' ? 'fa-moon' : 'fa-sun').fadeIn(150);
        });

        if (window.abp && abp.leptonX && abp.leptonX.theme) {
            abp.leptonX.theme.setTheme(next);
        }
    });

    function applyTheme(theme) {
        // SoT: <html data-theme="..."> — tokens.css :root override buradan beslenir
        $html.attr('data-theme', theme);
        // LeptonX class mirror (dropdown'lar, kendi theming'i için)
        $html.removeClass('lpx-theme-light lpx-theme-dark lpx-theme-dim');
        $html.addClass(theme === 'dark' ? 'lpx-theme-dark' : 'lpx-theme-light');
        // Body class — eski DataTable/jQuery widget uyumu
        $('body').toggleClass('dark-theme', theme === 'dark');
    }
});
