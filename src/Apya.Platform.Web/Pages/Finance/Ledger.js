$(function () {
    // FUX-01: "Gelir ekle" / "Gider ekle" çıplak /Incomes ve /Expenses sayfalarına
    // gidiyordu; o sayfalar parametre okumadığı için merkezde seçili proje kayboluyordu.
    // Proje seçiliyken kayıt penceresi burada, proje ÖNDEN seçili açılır (proje konsolundaki
    // "Harcama ekle" ile aynı kalıp). Proje seçili değilken düğmeler bağlantı olarak kalır
    // ve bu betik hiçbir şey bağlamaz.
    var $scope = $('[data-fin-ledger-project]');
    if (!$scope.length) { return; }

    var projectId = $scope.data('fin-ledger-project');

    function wire(buttonSelector, viewPath) {
        var $button = $(buttonSelector);
        if (!$button.length) { return; }

        var modal = new abp.ModalManager({ viewUrl: abp.appPath + viewPath });
        // Liste sunucuda basılı — dürüst tazeleme tam yükleme. Proje, sekme ve süzgeç
        // adreste durduğu için kullanıcı aynı yere döner.
        modal.onResult(function () { window.location.reload(); });

        $button.on('click', function () {
            modal.open({ ProjectId: projectId });
        });
    }

    wire('#fin-ledger-add-income', 'Incomes/CreateModal');

    // DOC-08: gelir satırındaki "belge bağla" düğmesi.
    var incomeDocModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Finance/IncomeDocumentModal' });
    incomeDocModal.onResult(function () { window.location.reload(); });
    $(document).on('click', '[data-income-doc-link]', function () {
        incomeDocModal.open({ id: $(this).data('income-doc-link') });
    });
    wire('#fin-ledger-add-expense', 'Expenses/CreateModal');
});
