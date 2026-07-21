$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'Incomes/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'Incomes/EditModal');
    var svc = apya.platform.incomes.incomeEntry;

    var categoryNames = { 0: 'Diğer', 1: 'Hibe', 2: 'Bağış', 3: 'Faturasız Satış', 4: 'Finansal' };

    var dataTable = $('#IncomesTable').DataTable(abp.libs.datatables.normalizeConfiguration({
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
                            visible: abp.auth.isGranted('Platform.Incomes.Edit'),
                            action: function (data) { editModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.Incomes.Delete'),
                            confirmMessage: function (data) {
                                return 'Gelir ve bağlı kasa hareketi silinecek: ' + data.record.title + '?';
                            },
                            action: function (data) {
                                svc.delete(data.record.id).then(function () {
                                    abp.notify.success('Gelir silindi.');
                                    dataTable.ajax.reload();
                                });
                            }
                        }
                    ]
                }
            },
            { title: 'Tarih', data: 'incomeDate', render: function (d) { return d ? new Date(d).toLocaleDateString('tr-TR') : '-'; } },
            { title: 'Başlık', data: 'title' },
            { title: 'Kategori', data: 'category', render: function (d) { return categoryNames[d] || '-'; } },
            {
                title: 'Tutar', data: 'amount',
                render: function (d, t, row) {
                    return apya.money.format(d);
                }
            },
            { title: 'Kasa', data: 'cashAccountName', render: function (d) { return d || '— (tahsil edilmedi)'; } }
        ]
    }));

    $('#NewIncomeButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () { dataTable.ajax.reload(); });
    editModal.onResult(function () { dataTable.ajax.reload(); });
});
