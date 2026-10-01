/* =============================================================================
   APYA LATEST — Bayat yanıt koruması (tek kaynak)
   -----------------------------------------------------------------------------
   var nextLoad = apya.latest();   // yükleyici başına bir kez
   var isLatest = nextLoad();      // her istekte; önceki biletleri bayatlatır
   Promise.resolve(istek).then(
       function (r) { if (!isLatest()) { return; } ...çiz... },
       function ()  { if (!isLatest()) { return; } ...hata durumu... });

   • Promise'i sarmaz, bekletmez, İPTAL ETMEZ; yalnız "bu yanıt hâlâ en son
     istenen mi?" sorusunu cevaplar. İstek atmadan bayatlatmak için sonucu at:
     nextLoad();
   • Reddetme dalını her zaman ver: bayat ret unhandledrejection üretmesin.
   • React adalarındaki karşılığı useRef sayacıdır
     (components/documents/useComplianceOverview.js requestRef).

   DataTables koruması: abp.libs.datatables.createAjax sarılır. 4. parametre
   (cancelPreviousRequest) verilmemişse yalnız SON isteğin DataTables callback'i
   çağrılır; geç dönen eski yanıt ne 'xhr' olayı üretir ne tabloya yazılır.
   Bayat istek bilerek iptal EDİLMEZ: iptal sunucuda RequestAborted ile EF
   sorgusunu keser ve [ERR] "beklenmedik hata" olarak loglanır (Sistem Sağlığı'nı
   kirletir). Sunucu sorguyu normal bitirir, yanıt yalnız çizilmez. Açıkça true
   geçen çağrıda ABP'nin kendi iptali (ve aşağıdaki hata dalı) YOK: ABP aynen.

   Hata dalı (Faz 4 kararı 2 — yükleme hatası YALNIZ sayfa içi kart):
   • ABP'nin iç fonksiyonu reddi yutar ve sözü döndürmez; ret ancak serverMethod
     sarılarak görülür. ABP serverMethod'u DataTables çağrısının İÇİNDE EŞZAMANLI
     çağırır: callback/settings/bilet o anda sarılı fonksiyona aktarılır. Sarılı
     fonksiyon ÖZGÜN sözü döndürür (ABP .always ve .jqXHR'i onun üzerinde bekler).
   • SON isteğin reddi apya.loadState.failTable'a gider: tablo "İşleniyor…"da
     kalmaz, boş hücreye "Liste yüklenemedi + Tekrar dene" basılır; bir sonraki
     başarılı yanıt kartı kendiliğinden siler. Bayat ret de aynı biletle yutulur
     (geç düşen eski istek yeni başarıyı ezmez).
   • Aynı eşzamanlı pencerede abp.ajax'a giden istek { abpHandleError: false }
     taşır: ABP'nin engelleyici penceresi açılmaz (proxy imzası — son parametre
     ajaxParams — burada bilinmez, bu yüzden istek seçeneğine yazılır). 401 ve
     oturum kaybı ajax-error-detail.js'in $.ajaxPrefilter kancasıyla yine merkezi
     pencereye gider; kartın açıklaması apya.ajaxErrors.message'dan gelir.

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles): tema
   katkılarından (datatables-extensions dahil) SONRA, sayfa betiklerinden ÖNCE.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.latest) { return; }

    apya.latest = function () {
        var seq = 0;
        return function () {
            var mine = ++seq;
            return function () { return mine === seq; };
        };
    };

    // fn'i çalıştırırken abp.ajax'a giden her isteğe { abpHandleError: false } yazar.
    // abp.ajax'ın özellikleri (defaultOpts, handle*) özgün nesneden okunur; çağrı
    // eşzamanlı bittiği için hata yolu (asenkron) özgün abp.ajax ile çalışır.
    function quietly(fn, thisArg, args) {
        var abp = window.abp;
        var ajax = abp && abp.ajax;
        var $ = window.jQuery;
        if (typeof ajax !== 'function' || !$ || !$.extend) { return fn.apply(thisArg, args); }
        var quiet = function (userOptions) {
            return ajax.call(this, $.extend({}, userOptions, { abpHandleError: false }));
        };
        Object.setPrototypeOf(quiet, ajax);
        abp.ajax = quiet;
        try {
            return fn.apply(thisArg, args);
        } finally {
            if (abp.ajax === quiet) { abp.ajax = ajax; }
        }
    }

    var dt = window.abp && window.abp.libs && window.abp.libs.datatables;
    if (dt && dt.createAjax) {
        var createAjax = dt.createAjax;
        dt.createAjax = function (serverMethod, inputAction, responseCallback, cancelPreviousRequest) {
            if (cancelPreviousRequest) { return createAjax.apply(this, arguments); }
            var pending = null;
            var method = function () {
                var request = pending;
                pending = null;
                var promise = quietly(serverMethod, this, arguments);
                if (request && promise && typeof promise.then === 'function') {
                    promise.then(null, function (error) {
                        var loadState = window.apya.loadState;
                        if (request.isLatest() && loadState && loadState.failTable) {
                            loadState.failTable(request.settings, request.callback, error);
                        }
                    });
                }
                return promise;
            };
            var ajax = createAjax.call(this, method, inputAction, responseCallback, cancelPreviousRequest);
            var next = apya.latest();
            return function (requestData, callback, settings) {
                var isLatest = next();
                pending = callback ? { callback: callback, settings: settings, isLatest: isLatest } : null;
                try {
                    return ajax.call(this, requestData, callback && function (json) {
                        if (isLatest()) { callback(json); }
                    }, settings);
                } finally {
                    pending = null;
                }
            };
        };
    }
})();
