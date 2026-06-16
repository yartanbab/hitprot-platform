// Stale antiforgery / CSRF token'da ASP.NET, ABP hata zarfı oluşmadan gövdesiz 400 döner.
// Bu durumda kullanıcı, ABP'nin genel "Hatanın ne olduğu sunucu tarafından gönderilmedi"
// mesajını görür ve ne yapacağını bilemez. Aşağıdaki override, aynı (tek) ABP diyaloğunda
// aksiyon alınabilir bir açıklama gösterir — ek popup AÇMAZ.
(function () {
    if (typeof abp === 'undefined' || !abp.ajax || !abp.ajax.defaultError) {
        return;
    }

    var actionableDetail =
        'İşlem doğrulanamadı. Oturumunuz veya tarayıcı önbelleğiniz güncel olmayabilir. ' +
        'Lütfen sayfayı yenileyip (Ctrl+Shift+R) tekrar deneyin.';

    function apply() {
        if (abp.ajax.defaultError) {
            abp.ajax.defaultError.details = actionableDetail;
        }
    }

    // ABP, 'abp.configurationInitialized' anında details'i localization'dan yeniden yazar.
    // Bu script libs bundle'ından sonra yüklendiği için aynı event'e bağlanıp override'ı
    // kalıcı kılıyoruz (event handler'ları kayıt sırasıyla çalışır → bizimki en sonda kazanır).
    apply();
    if (abp.event && abp.event.on) {
        abp.event.on('abp.configurationInitialized', apply);
    }

    // SELF-HEAL: Bayat/şifresi çözülemeyen antiforgery token'da ASP.NET, gövdesiz 400 döner.
    // Bu durumda JS-okunur XSRF-TOKEN cookie'sini sil + service worker/cache'i temizle + sayfayı
    // BİR KEZ yenile. Yeni GET, taze antiforgery cookie+token üretir → sonraki POST çalışır.
    // Böylece kullanıcının elle "clear site data" yapmasına gerek kalmaz (kurulu PWA dahil).
    // sessionStorage guard ile oturumda tek sefer — reload döngüsü olmaz.
    if (typeof $ !== 'undefined' && $(document).ajaxError) {
        $(document).ajaxError(function (event, xhr) {
            if (!xhr || xhr.status !== 400) { return; }
            // ABP doğrulama hataları JSON gövde taşır → onlara dokunma; sadece gövdesiz 400.
            if ((xhr.responseText || '').trim().length > 0) { return; }
            try {
                if (sessionStorage.getItem('apyaAntiforgeryHeal') === '1') { return; }
                sessionStorage.setItem('apyaAntiforgeryHeal', '1');
            } catch (e) { /* sessionStorage yoksa yine de bir kez dene */ }

            // XSRF-TOKEN JS-okunur cookie → sil; abp bir sonraki GET'te taze set eder.
            ['XSRF-TOKEN'].forEach(function (n) {
                document.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                document.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
            });

            (async function () {
                try {
                    if (navigator.serviceWorker) {
                        var regs = await navigator.serviceWorker.getRegistrations();
                        for (var i = 0; i < regs.length; i++) { await regs[i].unregister(); }
                    }
                    if (window.caches) {
                        var keys = await caches.keys();
                        for (var j = 0; j < keys.length; j++) { await caches.delete(keys[j]); }
                    }
                } catch (e) { /* yoksay */ }
                location.reload();
            })();
        });
    }
})();
