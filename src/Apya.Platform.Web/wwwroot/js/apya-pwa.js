/* =============================================================================
   apya-pwa.js — "Ana ekrana ekle" ve yüklü uygulamada bildirim çağrısı.
   -----------------------------------------------------------------------------
   - Service worker'ı HER oturumlu sayfada kaydeder (plan K4). Önceden yalnız
     Genel Bakış ve Masraf Ekle kaydediyordu; başka sayfadan giren kullanıcıda
     tarayıcı kurulum önerisini hiç sunmayabiliyordu.
   - Chrome/Edge/Samsung'un kurulum isteğini (beforeinstallprompt) yakalar;
     "Uygulamayı yükle" satırı (avatar menüsü + mobil kişi menüsü) ve mobilde
     bir kez gösterilen şerit bu isteği açar.
   - iPhone/iPad'de böyle bir istek YOK: satır ve şerit "Paylaş → Ana Ekrana
     Ekle" adımlarını gösteren pencereyi açar. Android'de istek sunmayan
     tarayıcıda (Firefox) tarayıcı menüsü tarif edilir.
   - Uygulama ana ekrandan açıldıysa (standalone) kurulum girişleri görünmez;
     bildirim izni hiç istenmediyse yerine "Bildirimleri aç" şeridi çıkar.
     iOS izni yalnız bir dokunuşla isteyebildiği için şerit düğmelidir.
   ============================================================================= */
(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var LS_INSTALL_DISMISSED = 'apya-pwa-install-dismissed';
    var LS_NOTIFY_DISMISSED = 'apya-pwa-notify-dismissed';

    var deferredPrompt = null;
    var installed = false;

    // Kurulum isteği sayfa yüklenmeden de gelebilir: dinleyici hemen kurulur.
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        render();
    });
    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        window.__apyaInstallPrompt = null;
        installed = true;
        render();
    });

    function read(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
    function write(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* yoksay */ } }

    function l(key) {
        return (window.abp && abp.localization) ? abp.localization.getResource('Platform')(key) : key;
    }

    function isStandalone() {
        return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
            || window.navigator.standalone === true;
    }

    function isIos() {
        return /iPhone|iPad|iPod/.test(navigator.userAgent || '')
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    // Android'de kurulum isteği sunmayan tarayıcı: kullanıcıya menü tarif edilir.
    // Chrome tabanlılarda istek gelmediyse uygulama büyük olasılıkla zaten yüklüdür.
    function isAndroidWithoutPromptApi() {
        var ua = navigator.userAgent || '';
        return /Android/.test(ua) && !('onbeforeinstallprompt' in window);
    }

    function isMobileShell() {
        return window.apyaIsMobileShell ? window.apyaIsMobileShell() : window.innerWidth < 768;
    }

    function prompt() { return deferredPrompt || window.__apyaInstallPrompt || null; }

    function canInstall() {
        if (installed || isStandalone()) { return false; }
        return !!prompt() || isIos() || isAndroidWithoutPromptApi();
    }

    function install() {
        var p = prompt();
        if (!p) { showGuide(); return; }

        p.prompt();
        Promise.resolve(p.userChoice).then(function (choice) {
            // İstek bir kez kullanılabilir; reddedilse de tarayıcı yenisini sonra yollar.
            deferredPrompt = null;
            window.__apyaInstallPrompt = null;
            if (choice && choice.outcome === 'accepted') { installed = true; }
            render();
        });
    }

    // ── Adım adım kurulum penceresi (iOS / istek sunmayan tarayıcı) ─────────
    function showGuide() {
        closeMobileSheet();

        var ios = isIos();
        var steps = ios
            ? [
                '<i class="fa fa-arrow-up-from-bracket" aria-hidden="true"></i>' + escapeHtml(l('Pwa:Install:IosStep1')),
                '<i class="fa fa-square-plus" aria-hidden="true"></i>' + escapeHtml(l('Pwa:Install:IosStep2')),
                '<i class="fa fa-mobile-screen" aria-hidden="true"></i>' + escapeHtml(l('Pwa:Install:IosStep3'))
            ]
            : ['<i class="fa fa-ellipsis-vertical" aria-hidden="true"></i>' + escapeHtml(l('Pwa:Install:OtherStep'))];

        var modal = document.createElement('div');
        modal.className = 'modal fade apya-pwa-guide';
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', 'apya-pwa-guide-title');
        modal.innerHTML =
            '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
                '<div class="modal-header">' +
                    '<h5 class="modal-title" id="apya-pwa-guide-title">' + escapeHtml(l('Pwa:Install:GuideTitle')) + '</h5>' +
                    '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="' + escapeHtml(l('Pwa:Install:Close')) + '"></button>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<ol class="apya-pwa-steps">' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
                    (ios ? '<p class="apya-pwa-note">' + escapeHtml(l('Pwa:Install:IosNote')) + '</p>' : '') +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">' + escapeHtml(l('Pwa:Install:Close')) + '</button>' +
                '</div>' +
            '</div></div>';
        document.body.appendChild(modal);
        modal.addEventListener('hidden.bs.modal', function () { modal.remove(); });
        new bootstrap.Modal(modal).show();
    }

    function closeMobileSheet() {
        var group = document.getElementById('mobile-user-menu-group');
        if (group) { group.classList.add('d-none'); }
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    // ── Menü satırları ───────────────────────────────────────────────────────
    // Satırlar mevcut menülerin KENDİ sınıflarıyla eklenir (apya-shell-actions.js
    // avatar menüsü, sidebar-toggle.js mobil kişi menüsü); görünümleri oradan gelir.
    var desktopRow = null;
    var mobileRow = null;

    function mountRows() {
        var notifPrefs = document.querySelector('.apya-avatar-menu-panel[data-panel="profile"] [data-act="notif-prefs"]');
        if (notifPrefs && !desktopRow) {
            desktopRow = document.createElement('button');
            desktopRow.type = 'button';
            desktopRow.className = 'apya-shell-menu-row dropdown-item';
            desktopRow.setAttribute('role', 'menuitem');
            desktopRow.dataset.act = 'install-app';
            desktopRow.innerHTML = '<i class="fa fa-mobile-screen" aria-hidden="true"></i><span></span>';
            desktopRow.querySelector('span').textContent = l('Pwa:Install:MenuLabel');
            desktopRow.addEventListener('click', install);
            notifPrefs.parentNode.insertBefore(desktopRow, notifPrefs);
        }

        var notifRow = document.querySelector('#mobile-user-menu-group .apya-mshell-row--notif');
        if (notifRow && !mobileRow) {
            mobileRow = document.createElement('div');
            mobileRow.className = 'apya-mshell-row apya-mshell-row--install';
            mobileRow.setAttribute('role', 'button');
            mobileRow.tabIndex = 0;
            mobileRow.innerHTML = '<i class="fa fa-mobile-screen" aria-hidden="true"></i><span class="apya-mshell-row-label"></span>';
            mobileRow.querySelector('.apya-mshell-row-label').textContent = l('Pwa:Install:MenuLabel');
            mobileRow.addEventListener('click', install);
            mobileRow.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); install(); }
            });
            notifRow.parentNode.insertBefore(mobileRow, notifRow.nextSibling);
        }
    }

    // ── Şeritler (yalnız mobil kabukta, içerik alanının en üstünde) ─────────
    var banner = null;

    function bannerKind() {
        if (!isMobileShell()) { return null; }

        if (isStandalone()) {
            var desktop = window.apyaDesktopNotifications;
            return desktop && desktop.state() === 'NotRequested' && !read(LS_NOTIFY_DISMISSED) ? 'notify' : null;
        }

        // Tarayıcı sekmesinde: Android'de yalnız gerçek kurulum isteği varken (yüklüyse
        // istek gelmez, şerit de çıkmaz); iOS'ta yüklü olup olmadığı anlaşılamaz, kapatılana dek.
        var offer = !!prompt() || isIos();
        return offer && !installed && !read(LS_INSTALL_DISMISSED) ? 'install' : null;
    }

    function renderBanner() {
        var kind = bannerKind();
        if (banner && banner.dataset.kind !== kind) { banner.remove(); banner = null; }
        if (!kind || banner) { return; }

        var host = document.querySelector('.lpx-content');
        if (!host) { return; }

        banner = document.createElement('div');
        banner.className = 'apya-pwa-banner';
        banner.dataset.kind = kind;
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', l(kind === 'install' ? 'Pwa:Install:MenuLabel' : 'Notifications:Desktop:Title'));
        banner.innerHTML =
            '<img class="apya-pwa-banner-icon" src="/brand/icon-192.png" alt="" width="36" height="36" />' +
            '<p class="apya-pwa-banner-text"></p>' +
            '<div class="apya-pwa-banner-actions">' +
                '<button type="button" class="btn btn-primary btn-sm" data-pwa="go"></button>' +
                '<button type="button" class="btn btn-link btn-sm" data-pwa="dismiss"></button>' +
            '</div>';
        banner.querySelector('.apya-pwa-banner-text').textContent =
            l(kind === 'install' ? 'Pwa:Install:BannerText' : 'Pwa:Notify:BannerText');
        banner.querySelector('[data-pwa="go"]').textContent =
            l(kind === 'install' ? 'Pwa:Install:Action' : 'Notifications:Desktop:Enable');
        banner.querySelector('[data-pwa="dismiss"]').textContent = l('Notifications:Desktop:DismissPrompt');

        banner.addEventListener('click', function (e) {
            var act = e.target.closest('[data-pwa]');
            if (!act) { return; }
            if (act.dataset.pwa === 'dismiss') {
                write(kind === 'install' ? LS_INSTALL_DISMISSED : LS_NOTIFY_DISMISSED, '1');
                render();
                return;
            }
            if (kind === 'install') {
                install();
                return;
            }
            window.apyaDesktopNotifications.request().then(function (state) {
                if (state === 'PermissionGranted') { abp.notify.success(l('Notifications:Desktop:Enabled')); }
                render();
            });
        });

        host.insertBefore(banner, host.firstChild);
    }

    var ready = false;

    function render() {
        if (!ready) { return; }
        var show = canInstall();
        if (desktopRow) { desktopRow.hidden = !show; }
        if (mobileRow) { mobileRow.hidden = !show; }
        renderBanner();
    }

    // Mobil kişi menüsü DOMContentLoaded'da kuruluyor; satırlar ondan sonra eklenir.
    window.addEventListener('load', function () {
        if (!(window.abp && abp.currentUser && abp.currentUser.isAuthenticated)) { return; }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function (err) {
                console.warn('[PWA] service worker kaydedilemedi:', err && err.message);
            });
        }

        ready = true;
        mountRows();
        render();

        // Avatar menüsü kabuk durumu (sunucu isteği) gelince kurulur — load'dan sonra
        // olabilir. Satır menü her açılırken yerinde mi diye bakılır.
        document.addEventListener('show.bs.dropdown', function () {
            mountRows();
            render();
        });
    });
})();
