$(function () {
    var service = apya.platform.ai.workflows.aiWorkflow;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/Workflows/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/Workflows/EditModal');

    var dataTable = $('#AiWorkflowsTable').DataTable(
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
                                text: 'Kurallar',
                                action: function (data) {
                                    window.location = abp.appPath + 'AiCenter/Workflows/Rules?id=' + data.record.id;
                                }
                            },
                            {
                                text: 'Düzenle',
                                visible: function () { return abp.auth.isGranted('Ai.Workflows.Manage'); },
                                action: function (data) { editModal.open({ id: data.record.id }); }
                            },
                            {
                                text: 'Sil',
                                visible: function () { return abp.auth.isGranted('Ai.Workflows.Manage'); },
                                confirmMessage: function (data) { return '"' + data.record.name + '" iş akışını silmek istiyor musunuz?'; },
                                action: function (data) {
                                    service.delete(data.record.id).then(function () {
                                        abp.notify.success('İş akışı silindi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                { title: 'Ad', data: 'name' },
                {
                    title: 'Kapsam',
                    data: null,
                    render: function (row) {
                        var parts = [];
                        if (row.documentId) parts.push('Form');
                        if (row.promptId) parts.push('Prompt');
                        return parts.length ? parts.join(' + ') : 'Tümü';
                    }
                },
                { title: 'Kural', data: 'ruleCount' },
                {
                    title: 'Durum',
                    data: 'isActive',
                    render: function (data) {
                        return data
                            ? '<span class="apya-chip apya-chip-positive">Aktif</span>'
                            : '<span class="apya-chip apya-chip-neutral">Pasif</span>';
                    }
                }
            ]
        })
    );

    createModal.onResult(function () { dataTable.ajax.reload(); abp.notify.success('İş akışı oluşturuldu.'); });
    editModal.onResult(function () { dataTable.ajax.reload(); abp.notify.success('İş akışı güncellendi.'); });

    $('#NewWorkflowButton').click(function (e) { e.preventDefault(); createModal.open(); });
});
