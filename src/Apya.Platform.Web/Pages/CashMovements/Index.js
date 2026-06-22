$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'CashMovements/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'CashMovements/EditModal');
    var svc = apya.platform.cashMovements.cashMovement;

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
                        ? '<span class="badge bg-success">Giriş</span>'
                        : '<span class="badge bg-danger">Çıkış</span>';
                }
            },
            { title: 'Tutar', data: 'amount', render: function (d, t, row) { return apya.money.format(d, row.currency); } },
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
            $('#BalOpening').text(apya.money.format(b.openingBalance, b.currency));
            $('#BalIn').text(apya.money.format(b.totalIn, b.currency));
            $('#BalOut').text(apya.money.format(b.totalOut, b.currency));
            $('#BalCurrent').text(apya.money.format(b.currentBalance, b.currency));
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
