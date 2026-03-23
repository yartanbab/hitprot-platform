$(function () {
    var themeKey = 'apya-app-theme';
    var savedTheme = localStorage.getItem(themeKey) || 'light';
    
    // Apply saved theme immediately
    applyTheme(savedTheme);

    // Create Toggle UI if it doesn't exist
    if ($('#ThemeToggle').length === 0) {
        var $toggle = $(`
            <div id="ThemeToggle" title="Tema Değiştir">
                <i class="fa ${savedTheme === 'dark' ? 'fa-moon' : 'fa-sun'}"></i>
            </div>
        `);
        $('body').append($toggle);
    }

    // Toggle Click Event
    $(document).on('click', '#ThemeToggle', function () {
        var currentTheme = $('body').attr('data-theme') === 'dark' ? 'dark' : 'light';
        var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(nextTheme);
        localStorage.setItem(themeKey, nextTheme);
        
        // Update Icon with a quick animation
        var $icon = $(this).find('i');
        $icon.fadeOut(150, function () {
            $icon.removeClass('fa-sun fa-moon')
                 .addClass(nextTheme === 'dark' ? 'fa-moon' : 'fa-sun')
                 .fadeIn(150);
        });

        // Trigger ABP internal theme change if available (for UI stability)
        if (window.abp && abp.leptonX && abp.leptonX.theme) {
            abp.leptonX.theme.setTheme(nextTheme);
        }
    });

    function applyTheme(theme) {
        $('body').attr('data-theme', theme);
        if (theme === 'dark') {
            $('body').addClass('dark-theme'); // Bazı kütüphane desteği için
        } else {
            $('body').removeClass('dark-theme');
        }
    }
});
