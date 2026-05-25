$(function () {

    // ── HESAPLAR sekmesi ──────────────────────────────────────────────────────

    var createAccountModal = new abp.ModalManager(abp.appPath + 'CashAccounts/CreateModal');
    var editAccountModal   = new abp.ModalManager(abp.appPath + 'CashAccounts/EditModal');

    var typeNames = { 0: 'Nakit', 1: 'Banka', 2: 'Kredi Kartı' };

    var accountsTable = $('#CashAccountsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: true,
        autoWidth: false,
        scrollCollapse: true,
        order: [[2, 'asc']],
        ajax: abp.libs.datatables.createAjax(apya.platform.cashAccounts.cashAccount.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.CashAccounts.Edit'),
                            action: function (data) { editAccountModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.CashAccounts.Delete'),
                            confirmMessage: function (data) {
                                return 'Kasa kalıcı olarak silinecek: ' + data.record.name + '?';
                            },
                            action: function (data) {
                                apya.platform.cashAccounts.cashAccount.delete(data.record.id)
                                    .then(function () {
                                        abp.notify.success('Kasa başarıyla silindi.');
                                        accountsTable.ajax.reload();
                                    });
                            }
                        }
                    ]
                }
            },
            {
                title: 'Durum',
                data: 'isActive',
                render: function (data) {
                    return data
                        ? '<span class="badge bg-success">Aktif</span>'
                        : '<span class="badge bg-secondary">Pasif</span>';
                }
            },
            { title: 'Kasa Adı',        data: 'name' },
            { title: 'Tür',              data: 'type',           render: function (d) { return typeNames[d] || '-'; } },
            { title: 'Para Birimi',      data: 'currency' },
            {
                title: 'Açılış Bakiyesi',
                data: 'openingBalance',
                render: function (d, type, row) {
                    return Number(d).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ' + row.currency;
                }
            }
        ]
    }));

    $('#NewCashAccountButton').click(function (e) {
        e.preventDefault();
        createAccountModal.open();
    });

    createAccountModal.onResult(function () { accountsTable.ajax.reload(); });
    editAccountModal.onResult(function ()   { accountsTable.ajax.reload(); });

    // ── HAREKETLER sekmesi ────────────────────────────────────────────────────

    var createMovementModal = new abp.ModalManager(abp.appPath + 'CashMovements/CreateModal');
    var editMovementModal   = new abp.ModalManager(abp.appPath + 'CashMovements/EditModal');
    var svc = apya.platform.cashMovements.cashMovement;
    var movementsTableInit = false;
    var movementsTable;

    function fmt(n) {
        return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }

    function initMovementsTable() {
        if (movementsTableInit) return;
        movementsTableInit = true;

        movementsTable = $('#CashMovementsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
            processing: true,
            serverSide: true,
            paging: true,
            searching: false,
            autoWidth: false,
            scrollCollapse: true,
            order: [[1, 'desc']],
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
                                action: function (data) { editMovementModal.open({ id: data.record.id }); }
                            },
                            {
                                text: 'Sil',
                                visible: abp.auth.isGranted('Platform.CashMovements.Delete'),
                                confirmMessage: function () { return 'Hareket silinecek?'; },
                                action: function (data) {
                                    svc.delete(data.record.id).then(function () {
                                        abp.notify.success('Hareket silindi.');
                                        reloadMovements();
                                    });
                                }
                            }
                        ]
                    }
                },
                { title: 'Tarih', data: 'movementDate', render: function (d) { return d ? new Date(d).toLocaleDateString('tr-TR') : '-'; } },
                { title: 'Kasa',  data: 'cashAccountName', render: function (d) { return d || '-'; } },
                {
                    title: 'Yön', data: 'direction',
                    render: function (d) {
                        return d === 0
                            ? '<span class="badge bg-success">Giriş</span>'
                            : '<span class="badge bg-danger">Çıkış</span>';
                    }
                },
                { title: 'Tutar',    data: 'amount',      render: function (d) { return fmt(d); } },
                { title: 'Açıklama', data: 'description', render: function (d) { return d || '-'; } }
            ]
        }));
    }

    function reloadMovements() {
        if (movementsTable) movementsTable.ajax.reload();
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

    // DataTable'ı sadece sekme açıldığında başlat (gizli DOM'da boyut hatası vermemesi için)
    $('#tab-hareketler').on('shown.bs.tab', function () {
        initMovementsTable();
        reloadMovements();
    });

    $('#AccountFilter').change(reloadMovements);

    $('#NewCashMovementButton').click(function (e) {
        e.preventDefault();
        createMovementModal.open();
    });

    createMovementModal.onResult(reloadMovements);
    editMovementModal.onResult(reloadMovements);
});
