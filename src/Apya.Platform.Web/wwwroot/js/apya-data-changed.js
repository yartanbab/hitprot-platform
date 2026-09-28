/* =============================================================================
   APYA DATA CHANGED — Veri-değişti köprüsü (jQuery yazmaları → React adaları)
   -----------------------------------------------------------------------------
   apya.dataChanged.emit({ entity: 'task', ids?: [...], action?: 'create' });

   • Önce sessionStorage['apya-data-changed-at'] = Date.now() damgası yazılır:
     sayfalar arası kalıcı react-query önbelleği (QueryProvider restore'u) bu
     damgadan eski görev türevi sorguları bayat sayar.
   • Sonra document üzerinde CustomEvent('apya:data-changed') yayınlanır: aynı
     sayfadaki React adaları (proje panelleri, takvim, pano) dinler.
   • Sözleşme dynamic-assets/src/lib/api/dataChanged.js ile AYNIDIR ve
     src/test/apyaDataChanged.test.js ile kilitlidir.
   • jQuery sayfaları bu olayı DİNLEMEZ: kendi yazmalarında yayınladıkları için
     dinlerlerse döngü doğar.

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles): Yeni
   Görev modalı AJAX ile yüklenir ve her sayfada (kabuk '+ Yeni', ⌘K) açılır.
   ============================================================================= */
(function (window, document) {
    'use strict';

    var apya = window.apya = window.apya || {};
    var EVENT = 'apya:data-changed';
    var STAMP_KEY = 'apya-data-changed-at';

    function emit(detail) {
        // Gizli sekme / site verisi kapalı: damga yazılamaz, olay yine gider.
        try { window.sessionStorage.setItem(STAMP_KEY, String(Date.now())); } catch (e) { /* yok say */ }
        document.dispatchEvent(new CustomEvent(EVENT, { detail: detail || {} }));
    }

    apya.dataChanged = { EVENT: EVENT, STAMP_KEY: STAMP_KEY, emit: emit };
})(window, document);
