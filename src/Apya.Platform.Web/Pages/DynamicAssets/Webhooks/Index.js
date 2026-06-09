$(function () {

    var svc = apya.platform.dynamicAssets.webhooks.webhookSubscription;

    var createModal = new abp.ModalManager(abp.appPath + 'DynamicAssets/Webhooks/CreateModal');
    var editModal   = new abp.ModalManager(abp.appPath + 'DynamicAssets/Webhooks/EditModal');
    var logsModal   = new abp.ModalManager(abp.appPath + 'DynamicAssets/Webhooks/LogsModal');

    var formNames = window.webhookFormNames || {};

    function formName(id) {
        return formNames[id] || ('<span class="text-muted">' + (id ? id.substring(0, 8) + '…' : '-') + '</span>');
    }

    var table = $('#WebhookSubscriptionsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        autoWidth: false,
        scrollCollapse: true,
        order: [[1, 'desc']],
        ajax: abp.libs.datatables.createAjax(svc.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Teslimat Kayıtları',
                            action: function (data) { logsModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.DynamicAssets.Edit'),
                            action: function (data) { editModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.DynamicAssets.Delete'),
                            confirmMessage: function () { return 'Bu webhook aboneliği silinecek. Emin misiniz?'; },
                            action: function (data) {
                                svc.delete(data.record.id).then(function () {
                                    abp.notify.success('Webhook aboneliği silindi.');
                                    table.ajax.reload();
                                });
                            }
                        }
                    ]
                }
            },
            {
                title: 'Oluşturulma',
                data: 'creationTime',
                render: function (d) { return d ? new Date(d).toLocaleString('tr-TR') : '-'; }
            },
            {
                title: 'Form',
                data: 'documentId',
                render: function (d) { return formName(d); }
            },
            {
                title: 'Hedef URL',
                data: 'targetUrl',
                render: function (d) {
                    return d ? '<code>' + $('<div>').text(d).html() + '</code>' : '-';
                }
            },
            {
                title: 'Durum',
                data: 'isActive',
                render: function (d) {
                    return d
                        ? '<span class="badge bg-success">Aktif</span>'
                        : '<span class="badge bg-secondary">Pasif</span>';
                }
            }
        ]
    }));

    $('#NewWebhookButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () { table.ajax.reload(); });
    editModal.onResult(function ()   { table.ajax.reload(); });
});
