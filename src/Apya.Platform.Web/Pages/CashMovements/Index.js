$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'CashMovements/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'CashMovements/EditModal');
    var svc = apya.platform.cashMovements.cashMovement;

    function fmt(n) {
        return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }

    var dataTable = $('#CashMovementsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        autoWidth: false,
        scrollCollapse: true,
        order: [[1, "desc"]],
        ajax: abp.libs.datatables.createAjax(svc.getList, function () {
            var id = $('#AccountFilter').val();
            return id ? { cashAccountId: id } : {};
        }),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.CashMovements.Edit'),
                            action: function (data) { editModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.CashMovements.Delete'),
                            confirmMessage: function () { return 'Hareket silinecek?'; },
                            action: function (data) {
                                svc.delete(data.record.id).then(function () {
                                    abp.notify.success('Hareket silindi.');
                                    reload();
                                });
                            }
                        }
                    ]
                }
            },
            { title: 'Tarih', data: 'movementDate', render: function (d) { return d ? new Date(d).toLocaleDateString('tr-TR') : '-'; } },
            { title: 'Kasa', data: 'cashAccountName', render: function (d) { return d || '-'; } },
            {
                title: 'Yön', data: 'direction',
                render: function (d) {
                    return d === 0
                        ? '<span class="apya-chip apya-chip-positive">Giriş</span>'
                        : '<span class="apya-chip apya-chip-negative">Çıkış</span>';
                }
            },
            { title: 'Tutar', data: 'amount', render: function (d) { return fmt(d); } },
            { title: 'Açıklama', data: 'description', render: function (d) { return d || '-'; } }
        ]
    }));

    function reload() {
        dataTable.ajax.reload();
        refreshBalance();
    }

    function refreshBalance() {
        var id = $('#AccountFilter').val();
        var $card = $('#BalanceCard');
        if (!id) { $card.addClass('d-none'); return; }
        svc.getBalance(id).then(function (b) {
            $('#BalAccount').text(b.cashAccountName);
            $('#BalOpening').text(fmt(b.openingBalance) + ' ' + b.currency);
            $('#BalIn').text(fmt(b.totalIn));
            $('#BalOut').text(fmt(b.totalOut));
            $('#BalCurrent').text(fmt(b.currentBalance) + ' ' + b.currency);
            $card.removeClass('d-none');
        });
    }

    $('#AccountFilter').change(reload);

    $('#NewCashMovementButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(reload);
    editModal.onResult(reload);
});
