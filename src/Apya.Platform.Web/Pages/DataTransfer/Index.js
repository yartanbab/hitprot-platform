$(function () {
    // İçe aktarma modülün kendi penceresinde yapılır (şablon → önizleme → onay); burada yalnız açılır.
    var modals = {};

    $(document).on('click', '[data-transfer-import]', function () {
        var url = $(this).attr('data-transfer-import');
        modals[url] = modals[url] || new abp.ModalManager(abp.appPath + url.replace(/^\//, ''));
        modals[url].open();
    });
});
