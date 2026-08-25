/* =============================================================================
   KENAR ÇUBUĞU GENİŞLİĞİ — sürüklenebilir tutamak
   -----------------------------------------------------------------------------
   Tek kaldıraç: `--apya-sidebar-w`. Kabuk geometrisinin tamamı (kap genişliği,
   nav min/max, scrollbar telafisi, daralt düğmesinin sol koordinatı) o token'dan
   türüyor — bkz. apya-theme-bridge.css "KABUK GEOMETRİSİ". Bu yüzden burada
   yalnız değişken yazılır, hiçbir kural elle güncellenmez.

   KALICILIK localStorage: genişlik EKRAN BOYUTUNA bağlı bir tercih; 27"da
   seçilen 380px, dizüstünde içeriği boğar. Kabuğun kuralı da bu — "yerleşim
   durumu cihazda, taşınması gerekenler ayarda" (sabitlemeler ve menü düzeni
   ayarda, bölüm katlama ve ray modu localStorage'da).

   Boyanma ÖNCESİ uygulama ApyaThemeHead'deki FOUC betiğinde; burada yalnız
   sürükleme var. Yoksa her yenilemede menü 250px'ten seçilen genişliğe zıplardı.
   ============================================================================= */
$(function () {
    'use strict';

    if (/^\/Account\//i.test(location.pathname)) { return; }

    var container = document.querySelector('.lpx-sidebar-container');
    if (!container) { return; }

    var KEY = 'apya-sidebar-width';
    var MIN = 200;
    var MAX = 420;

    // Uygulanan SON değer. Ölçüm yerine bunu kullanmak şart: kabın gerçek
    // genişliği token ile birebir aynı olmak zorunda değil (kenarlık,
    // .lpx-has-scrollbar telafisi, calc(... - 15px) kuralları). Ölçümden
    // yeniden başlansaydı genişlik her sürüklemede birkaç piksel kayardı.
    // null → kullanıcı henüz dokunmadı, geçerli olan CSS varsayılanı.
    var applied = null;

    // Dar ekranda kenar çubuğu çekmece/sekme oluyor; tutamak orada anlamsız.
    var MOBILE_MAX = 767.98;

    // FOUC betiği kayıtlı genişliği zaten uygulamış olabilir; kaynağı ondan
    // DEVRAL ki ilk sürükleme de ölçümden değil token değerinden başlasın.
    // Sınırlar ApyaThemeHead'deki betikle aynı — depo elle kurcalanmış olabilir.
    try {
        var stored = parseInt(localStorage.getItem(KEY), 10);
        if (stored >= MIN && stored <= MAX) { applied = stored; }
    } catch (e) { /* gizli mod */ }

    function clamp(value) {
        return Math.max(MIN, Math.min(MAX, Math.round(value)));
    }

    function apply(width) {
        applied = width;
        document.documentElement.style.setProperty('--apya-sidebar-w', width + 'px');
    }

    // Varsayılana dönüş: satır içi stili SİL, CSS kendi değerini geri alsın.
    // Varsayılanı JS'te sabit yazmak, apya-theme-bridge.css ile ikinci bir
    // kaynak yaratır ve o değer değişince buradaki sessizce yanlış kalır.
    function reset() {
        applied = null;
        document.documentElement.style.removeProperty('--apya-sidebar-w');
        persist(null);
    }

    function persist(width) {
        try {
            if (width === null) { localStorage.removeItem(KEY); }
            else { localStorage.setItem(KEY, String(width)); }
        } catch (e) { /* kota / gizli mod */ }
    }

    var handle = document.createElement('div');
    handle.className = 'apya-sidebar-resizer';
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-orientation', 'vertical');
    handle.setAttribute('aria-label', handleLabel());
    handle.tabIndex = 0;
    // Kaba DEĞİL gövdeye: tutamak position:fixed ve kabın konumuna dokunulmuyor
    // (bkz. apya-shell.css §26 — kaba position vermek temanın fixed kuralını
    // eziyor ve kenar çubuğunu akışa döndürüyordu).
    document.body.appendChild(handle);

    // Etiket SUNUCUDAN gelir (ApyaThemeHead → #ApyaMobileShellL10n): kabuk
    // metinleri JS'e gömülmüyor. Blok okunamazsa erişilebilirlik etiketsiz
    // kalmasın diye yalın bir yedek var.
    function handleLabel() {
        try {
            var el = document.getElementById('ApyaMobileShellL10n');
            return (JSON.parse(el.textContent) || {}).sidebarWidth || 'Kenar çubuğu genişliği';
        } catch (e) {
            return 'Kenar çubuğu genişliği';
        }
    }

    // Kaba göre ÖLÇÜM yalnız başlangıç noktası için: kullanıcı henüz bir
    // genişlik uygulamadıysa geçerli olan CSS varsayılanıdır. Uygulama başladıktan
    // sonra kaynak `applied`; ölçüm token'la birebir aynı olmadığı için ondan
    // devam etmek her turda kayma üretirdi.
    function baseWidth() {
        return applied !== null ? applied : container.getBoundingClientRect().width;
    }

    // Tutamak CSS ile gizlenen yerlerde (dar ekran, ray/gizli mod) çalışmamalı.
    // Kapı İKİ yolda da geçerli: tutamak tabIndex=0 olduğu için gizliyken bile
    // klavyeyle odaklanılabiliyor ve ok tuşları sessizce kalıcı bir genişlik
    // yazardı — kullanıcı hiçbir şey olmadığını görür, sonra masaüstünde menü
    // beklenmedik genişlikte açılırdı.
    function canResize() {
        return window.innerWidth > MOBILE_MAX &&
               !document.documentElement.getAttribute('data-sidebar');
    }

    // --- sürükleme ---
    var dragging = false;
    var startX = 0;
    var startWidth = 0;

    handle.addEventListener('pointerdown', function (e) {
        if (!canResize()) { return; }

        dragging = true;
        startX = e.clientX;
        startWidth = baseWidth();
        // Yakalama başarısız olabilir (tarayıcı/eklenti); atmasına izin verirsek
        // aşağıdaki belge dinleyicileri hiç kurulmadan sürükleme askıda kalırdı.
        try { handle.setPointerCapture(e.pointerId); } catch (err) { /* yoksay */ }
        document.body.classList.add('apya-sidebar-resizing');
        e.preventDefault();
    });

    handle.addEventListener('pointermove', function (e) {
        if (!dragging) { return; }
        apply(clamp(startWidth + (e.clientX - startX)));
    });

    function endDrag(e) {
        if (!dragging) { return; }
        dragging = false;
        if (e && e.pointerId !== undefined) {
            try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* yoksay */ }
        }
        document.body.classList.remove('apya-sidebar-resizing');
        // Uygulanan değer saklanır, ölçülen DEĞİL.
        if (applied !== null) { persist(applied); }
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    // Belge seviyesinde yedek: yakalama kurulamadıysa ya da işaretçi tutamağın
    // dışında bırakıldıysa pointerup tutamağa hiç ulaşmaz. O durumda `dragging`
    // true kalır ve `body.apya-sidebar-resizing` yüzünden içerik
    // pointer-events:none olarak donmuş görünürdü — tek çıkış yenilemekti.
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);

    // --- klavye: sürükleme faresiz de çalışmalı ---
    handle.addEventListener('keydown', function (e) {
        if (!canResize()) { return; }

        var step = e.shiftKey ? 32 : 8;

        if (e.key === 'Home') {
            e.preventDefault();
            reset();
            return;
        }

        var width = null;
        if (e.key === 'ArrowLeft') { width = clamp(baseWidth() - step); }
        else if (e.key === 'ArrowRight') { width = clamp(baseWidth() + step); }
        else { return; }

        e.preventDefault();
        apply(width);
        persist(width);
    });

    // --- çift tık: varsayılana dön ---
    handle.addEventListener('dblclick', reset);
});
