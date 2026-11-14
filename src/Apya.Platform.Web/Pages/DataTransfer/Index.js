$(function () {
    var l = abp.localization.getResource('Platform');

    // İçe aktarma modülün kendi penceresinde yapılır (şablon → önizleme → onay); burada yalnız açılır.
    // Adres şablon taşıyabilir (?template=…): pencere uçlarını o şablonla çağırır.
    var modals = {};

    $(document).on('click', '[data-transfer-import]', function () {
        var url = $(this).attr('data-transfer-import');
        modals[url] = modals[url] || new abp.ModalManager(abp.appPath + url.replace(/^\//, ''));
        modals[url].open();
    });

    // Şablonlar sekmesi: düzenleyici pencere kaydı şablon servisine kendisi gönderir; kayıttan sonra
    // liste sunucuda yeniden çizilir.
    var templateModal = new abp.ModalManager(abp.appPath + 'DataTransfer/TemplateModal');
    var templateSaved = false;

    $(document).on('click', '[data-template-edit]', function () {
        var id = $(this).attr('data-template-edit');
        templateSaved = false;
        templateModal.open(id ? { id: id } : {});
    });

    document.addEventListener('apya:transfer-template-saved', function () {
        templateSaved = true;
        templateModal.close();
    });

    templateModal.onClose(function () {
        if (templateSaved) { window.location.reload(); }
    });

    $(document).on('click', '[data-template-delete]', function () {
        var button = $(this);
        apya.confirm({ message: l('DataTransfer:Templates:DeleteConfirm', button.attr('data-template-name')), danger: true }).then(function (confirmed) {
            if (!confirmed) { return; }
            apya.platform.dataTransfers.dataTransferTemplate.delete(button.attr('data-template-delete')).then(function () {
                window.location.reload();
            });
        });
    });
});
