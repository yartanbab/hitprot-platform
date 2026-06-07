$(function () {
    var service = apya.platform.ai.providers.aiProvider;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/Providers/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/Providers/EditModal');

    var dataTable = $('#AiProviderConfigsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: false,
            paging: true,
            order: [[1, 'asc']],
            searching: false,
            scrollX: true,
            ajax: function (data, callback) {
                service.getList().then(function (result) {
                    callback({ data: result });
                });
            },
            columnDefs: [
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Düzenle',
                                visible: function () { return abp.auth.isGranted('Ai.Providers.Manage'); },
                                action: function (data) { editModal.open({ id: data.record.id }); }
                            },
                            {
                                text: 'Varsayılan Yap',
                                visible: function (data) {
                                    return abp.auth.isGranted('Ai.Providers.Manage') && !data.record.isDefault;
                                },
                                action: function (data) {
                                    service.setDefault(data.record.id).then(function () {
                                        abp.notify.success('Varsayılan sağlayıcı güncellendi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            },
                            {
                                text: 'Sil',
                                visible: function () { return abp.auth.isGranted('Ai.Providers.Manage'); },
                                confirmMessage: function (data) {
                                    return '"' + data.record.displayName + '" yapılandırmasını silmek istiyor musunuz?';
                                },
                                action: function (data) {
                                    service.delete(data.record.id).then(function () {
                                        abp.notify.success('Sağlayıcı silindi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                { title: 'Sağlayıcı', data: 'providerName' },
                { title: 'Görünen Ad', data: 'displayName' },
                { title: 'Model', data: 'model' },
                {
                    title: 'API Anahtarı',
                    data: 'hasApiKey',
                    render: function (data) {
                        return data
                            ? '<span class="badge bg-success">Tanımlı</span>'
                            : '<span class="badge bg-warning text-dark">Eksik</span>';
                    }
                },
                {
                    title: 'Varsayılan',
                    data: 'isDefault',
                    render: function (data) {
                        return data ? '<i class="fa fa-star text-warning"></i>' : '';
                    }
                },
                {
                    title: 'Durum',
                    data: 'isEnabled',
                    render: function (data) {
                        return data
                            ? '<span class="badge bg-success">Aktif</span>'
                            : '<span class="badge bg-secondary">Pasif</span>';
                    }
                }
            ]
        })
    );

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Sağlayıcı eklendi.');
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Sağlayıcı güncellendi.');
    });

    $('#NewProviderButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});
