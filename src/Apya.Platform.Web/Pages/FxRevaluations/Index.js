$(function () {

    var runModal = new abp.ModalManager(abp.appPath + 'FxRevaluations/RunModal');
    var detailModal = new abp.ModalManager(abp.appPath + 'FxRevaluations/DetailModal');
    var svc = apya.platform.fxRevaluations.fxRevaluation;

    var dataTable = $('#FxRevaluationsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
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
                            text: 'Detay',
                            action: function (data) { detailModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.FxRevaluations.Delete'),
                            confirmMessage: function () { return 'Bu değerleme silinecek?'; },
                            action: function (data) {
                                svc.delete(data.record.id).then(function () {
                                    abp.notify.success('Silindi.');
                                    dataTable.ajax.reload();
                                });
                            }
                        }
                    ]
                }
            },
            {
                title: 'Tarih', data: 'asOfDate',
                render: function (d) { return d ? new Date(d).toLocaleDateString('tr-TR') : '-'; }
            },
            {
                title: 'Toplam TL Değeri', data: 'totalTryValue',
                render: function (d) { return Number(d).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'; }
            },
            { title: 'Not', data: 'notes', render: function (d) { return d || '-'; } },
            {
                title: 'Oluşturma', data: 'creationTime',
                render: function (d) { return d ? new Date(d).toLocaleString('tr-TR') : '-'; }
            }
        ]
    }));

    $('#NewRevaluationButton').click(function (e) {
        e.preventDefault();
        runModal.open();
    });

    runModal.onResult(function () {
        abp.notify.success('Değerleme tamamlandı.');
        dataTable.ajax.reload();
    });
});
