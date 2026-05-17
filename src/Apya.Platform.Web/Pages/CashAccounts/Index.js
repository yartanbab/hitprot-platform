$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'CashAccounts/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'CashAccounts/EditModal');

    var typeNames = { 0: 'Nakit', 1: 'Banka', 2: 'Kredi Kartı' };

    var dataTable = $('#CashAccountsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: true,
        autoWidth: false,
        scrollCollapse: true,
        order: [[2, "asc"]],
        ajax: abp.libs.datatables.createAjax(apya.platform.cashAccounts.cashAccount.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.CashAccounts.Edit'),
                            action: function (data) {
                                editModal.open({ id: data.record.id });
                            }
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
                                        dataTable.ajax.reload();
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
            {
                title: 'Kasa Adı',
                data: 'name'
            },
            {
                title: 'Tür',
                data: 'type',
                render: function (data) { return typeNames[data] || '-'; }
            },
            {
                title: 'Para Birimi',
                data: 'currency'
            },
            {
                title: 'Açılış Bakiyesi',
                data: 'openingBalance',
                render: function (data, type, row) {
                    return Number(data).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ' + row.currency;
                }
            }
        ]
    }));

    $('#NewCashAccountButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

});
