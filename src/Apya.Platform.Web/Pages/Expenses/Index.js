$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'Expenses/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'Expenses/EditModal');
    var importModal = new abp.ModalManager(abp.appPath + 'Expenses/ImportModal');
    var svc = apya.platform.expenses.expense;

    var categoryNames = {
        0: 'Genel/Diğer', 1: 'Ofis', 2: 'Seyahat', 3: 'Personel',
        4: 'Malzeme', 5: 'Hizmet', 6: 'Vergi'
    };

    var dataTable = $('#ExpensesTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: true,
        autoWidth: false,
        scrollCollapse: true,
        order: [[1, "desc"]],
        ajax: abp.libs.datatables.createAjax(svc.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.Expenses.Edit'),
                            action: function (data) { editModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.Expenses.Delete'),
                            confirmMessage: function (data) {
                                return 'Gider ve bağlı kasa hareketi silinecek: ' + data.record.title + '?';
                            },
                            action: function (data) {
                                svc.delete(data.record.id).then(function () {
                                    abp.notify.success('Gider silindi.');
                                    dataTable.ajax.reload();
                                });
                            }
                        }
                    ]
                }
            },
            { title: 'Tarih', data: 'expenseDate', render: function (d) { return d ? new Date(d).toLocaleDateString('tr-TR') : '-'; } },
            { title: 'Başlık', data: 'title' },
            { title: 'Kategori', data: 'category', render: function (d) { return categoryNames[d] || '-'; } },
            {
                title: 'Tutar', data: 'amount',
                className: 'text-end apya-numeric',
                render: function (d, t, row) {
                    return apya.money.format(d, row.currency);
                }
            },
            { title: 'Kasa', data: 'cashAccountName', render: function (d) { return d || '-'; } }
        ]
    }));

    // Ekrandaki arama ve sıralama dosyaya aynen geçer.
    $('#ExpensesExportExcel').on('click', function () {
        var params = new URLSearchParams({ handler: 'Excel' });
        if (dataTable.search()) { params.append('filter', dataTable.search()); }
        var order = dataTable.order()[0];
        var column = order && dataTable.settings()[0].aoColumns[order[0]];
        if (column && typeof column.data === 'string') { params.append('sorting', column.data + ' ' + order[1]); }
        window.location.href = abp.appPath + 'Expenses?' + params.toString();
    });

    $('#NewExpenseButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () { dataTable.ajax.reload(); });
    editModal.onResult(function () { dataTable.ajax.reload(); });

    // İçe aktarma pencereyi kendisi kapatmaz; kapanınca liste yenilenir.
    $('#ExpensesImportExcel').on('click', function () { importModal.open(); });
    importModal.onClose(function () { dataTable.ajax.reload(); });
});
