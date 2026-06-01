$(function () {
    var service = apya.platform.ai.bindings.aiFormBinding;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/Bindings/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/Bindings/EditModal');

    var dataTable = $('#AiFormBindingsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: false,
            paging: true,
            order: [[1, 'asc']],
            searching: false,
            scrollX: true,
            ajax: function (data, callback) {
                service.getList().then(function (result) { callback({ data: result }); });
            },
            columnDefs: [
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Düzenle',
                                visible: function () { return abp.auth.isGranted('Ai.Prompts.Edit'); },
                                action: function (data) { editModal.open({ id: data.record.id }); }
                            },
                            {
                                text: 'Sil',
                                visible: function () { return abp.auth.isGranted('Ai.Prompts.Edit'); },
                                confirmMessage: function () { return 'Bu form bağlamasını silmek istiyor musunuz?'; },
                                action: function (data) {
                                    service.delete(data.record.id).then(function () {
                                        abp.notify.success('Bağlama silindi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                { title: 'Form', data: 'documentTitle', defaultContent: '—' },
                { title: 'Prompt', data: 'promptName', defaultContent: '—' },
                { title: 'Tetikleme', data: 'triggerModeText' },
                {
                    title: 'Durum',
                    data: 'isActive',
                    render: function (data) {
                        return data
                            ? '<span class="badge bg-success">Aktif</span>'
                            : '<span class="badge bg-secondary">Pasif</span>';
                    }
                }
            ]
        })
    );

    createModal.onResult(function () { dataTable.ajax.reload(); abp.notify.success('Bağlama eklendi.'); });
    editModal.onResult(function () { dataTable.ajax.reload(); abp.notify.success('Bağlama güncellendi.'); });

    $('#NewBindingButton').click(function (e) { e.preventDefault(); createModal.open(); });
});
