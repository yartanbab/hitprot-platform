$(function () {
    // Proje bağlamı kök düğümde; modal URL'leri onsuz kurulamaz.
    var projectId = $('.apya-page').data('project-id');
    if (!projectId) { return; }

    var lineModal = new abp.ModalManager(abp.appPath + 'Finance/BudgetLineModal');
    var trancheModal = new abp.ModalManager(abp.appPath + 'Finance/TrancheModal');
    var collectionModal = new abp.ModalManager(abp.appPath + 'Finance/CollectionModal');
    var deductionModal = new abp.ModalManager(abp.appPath + 'Finance/DeductionModal');
    var revisionModal = new abp.ModalManager(abp.appPath + 'Finance/RevisionModal');

    // Paneller sunucuda render ediliyor; kaydettikten sonra sayfayı tazelemek
    // hem tabloyu hem KPI'ları hem şerit toplamlarını tek hamlede tutarlı yapar.
    [lineModal, trancheModal, collectionModal, deductionModal, revisionModal]
        .forEach(function (m) { m.onResult(function () { window.location.reload(); }); });

    $('#BtnAddBudgetLine').on('click', function () {
        lineModal.open({ projectId: projectId });
    });

    $('#BtnApplyRevision').on('click', function () {
        revisionModal.open({ projectId: projectId });
    });

    $('#BtnAddTranche').on('click', function () {
        trancheModal.open({ projectId: projectId });
    });

    $(document).on('click', '[data-edit-line]', function () {
        lineModal.open({ projectId: projectId, id: $(this).data('edit-line') });
    });

    $(document).on('click', '[data-edit-tranche]', function () {
        trancheModal.open({ projectId: projectId, id: $(this).data('edit-tranche') });
    });

    $(document).on('click', '[data-collect-tranche]', function () {
        collectionModal.open({ projectId: projectId, id: $(this).data('collect-tranche') });
    });

    $(document).on('click', '[data-add-deduction]', function () {
        deductionModal.open({ projectId: projectId, id: $(this).data('add-deduction') });
    });

    $(document).on('click', '[data-revise-budget]', function () {
        revisionModal.open({ projectId: projectId, deductionId: $(this).data('revise-budget') });
    });

    // Silme onayı — form POST'u ABP'nin onay kutusuna bağlar. Onaylanmadan
    // gönderim yapılmaz; native confirm() yerine tema diyaloğu kullanılır.
    $(document).on('click', 'button[data-confirm]', function (e) {
        var $btn = $(this);
        if ($btn.data('confirmed')) { return; }

        e.preventDefault();
        abp.message.confirm($btn.data('confirm')).then(function (confirmed) {
            if (confirmed) {
                $btn.data('confirmed', true);
                $btn.closest('form').trigger('submit');
            }
        });
    });
});
