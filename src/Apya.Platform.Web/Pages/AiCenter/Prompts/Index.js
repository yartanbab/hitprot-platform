$(function () {
    var service = apya.platform.ai.prompts.prompt;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/Prompts/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/Prompts/EditModal');

    var getFilterInput = function () {
        var status = $('#StatusFilter').val();
        return {
            filter: $('#PromptFilter').val(),
            categoryId: $('#CategoryFilter').val() || null,
            isActive: status === '' ? null : (status === 'true')
        };
    };

    var dataTable = $('#PromptsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, 'asc']],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(service.getList, getFilterInput),
            columnDefs: [
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Düzenle',
                                visible: function () {
                                    return abp.auth.isGranted('Ai.Prompts.Edit');
                                },
                                action: function (data) {
                                    editModal.open({ id: data.record.id });
                                }
                            },
                            {
                                text: 'Versiyonlar',
                                action: function (data) {
                                    window.location = abp.appPath + 'AiCenter/Prompts/Versions?id=' + data.record.id;
                                }
                            },
                            {
                                text: 'Sil',
                                visible: function () {
                                    return abp.auth.isGranted('Ai.Prompts.Delete');
                                },
                                confirmMessage: function (data) {
                                    return '"' + data.record.name + '" prompt\'unu silmek istiyor musunuz?';
                                },
                                action: function (data) {
                                    service.delete(data.record.id).then(function () {
                                        abp.notify.success('Prompt silindi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                { title: 'Kod', data: 'code' },
                { title: 'Ad', data: 'name' },
                {
                    title: 'Durum',
                    data: 'isActive',
                    render: function (data) {
                        return data
                            ? '<span class="apya-chip apya-chip-positive">Aktif</span>'
                            : '<span class="apya-chip apya-chip-neutral">Pasif</span>';
                    }
                },
                { title: 'Versiyon', data: 'versionCount' },
                {
                    title: 'Yayınlı',
                    data: 'activeVersionId',
                    render: function (data) {
                        return data
                            ? '<i class="fa fa-check-circle text-success"></i>'
                            : '<span class="text-muted">— taslak —</span>';
                    }
                }
            ]
        })
    );

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Prompt oluşturuldu.');
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Prompt güncellendi.');
    });

    $('#NewPromptButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    $('#CategoryFilter, #StatusFilter').on('change', function () {
        dataTable.ajax.reload();
    });

    var filterDebounce;
    $('#PromptFilter').on('keyup', function () {
        clearTimeout(filterDebounce);
        filterDebounce = setTimeout(function () { dataTable.ajax.reload(); }, 400);
    });
});
