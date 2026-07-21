/* =============================================================================
   APYA MONEY — Ortak para biçimlendirici (tek kaynak)
   -----------------------------------------------------------------------------
   apya.money.format(amount, currency) -> "1.000,00 TRY"

   • Binlik ayraç '.', ondalık ',', her zaman 2 hane.
   • Sabit 'tr-TR' locale → sunucu/tarayıcı kültürü ne olursa olsun aynı görünür.
   • currency verilmezse 'TRY'. (Kaydında gerçek birim olan ekranlar -Kasalar,
     Para Hareketleri, Giderler- onu geçer; çoklu döviz gizli ekranlar TRY alır.)
   • Geçersiz/eksik değer -> '—'.

   Global script bundle'a kayıtlı (PlatformWebModule.ConfigureBundles) → her
   sayfada hazır. Server-render için karşılığı: Finance/Index.cshtml @Money.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.money) { return; }

    function format(amount, currency) {
        var n = Number(amount);
        if (!isFinite(n)) { return '—'; }
        return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            + ' ' + (currency || 'TRY');
    }

    apya.money = { format: format };
})();
