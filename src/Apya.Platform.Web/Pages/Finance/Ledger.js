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
    wire('#fin-ledger-add-expense', 'Expenses/CreateModal');
});
