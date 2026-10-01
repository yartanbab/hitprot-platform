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
   geçen çağrıda ABP'nin kendi iptali aynen korunur.

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

    var dt = window.abp && window.abp.libs && window.abp.libs.datatables;
    if (dt && dt.createAjax) {
        var createAjax = dt.createAjax;
        dt.createAjax = function (serverMethod, inputAction, responseCallback, cancelPreviousRequest) {
            var ajax = createAjax.apply(this, arguments);
            if (cancelPreviousRequest) { return ajax; }
            var next = apya.latest();
            return function (requestData, callback, settings) {
                var isLatest = next();
                return ajax.call(this, requestData, callback && function (json) {
                    if (isLatest()) { callback(json); }
                }, settings);
            };
        };
    }
})();
