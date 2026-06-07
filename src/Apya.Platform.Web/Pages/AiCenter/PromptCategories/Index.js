$(function () {
    var service = apya.platform.ai.prompts.promptCategory;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/PromptCategories/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/PromptCategories/EditModal');

    var dataTable = $('#PromptCategoriesTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: false,
            paging: true,
            order: [[1, 'asc']],
            searching: true,
            scrollX: true,
            // GetListAsync returns a plain List (not paged) → client-side mode.
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
                                visible: function () {
                                    return abp.auth.isGranted('Ai.Prompts.Edit');
                                },
                                action: function (data) {
                                    editModal.open({ id: data.record.id });
                                }
                            },
                            {
                                text: 'Sil',
                                visible: function () {
                                    return abp.auth.isGranted('Ai.Prompts.Delete');
                                },
                                confirmMessage: function (data) {
                                    return '"' + data.record.name + '" kategorisini silmek istiyor musunuz?';
                                },
                                action: function (data) {
                                    service.delete(data.record.id).then(function () {
                                        abp.notify.success('Kategori silindi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                { title: 'Ad', data: 'name' },
                { title: 'Kod', data: 'code' },
                { title: 'Açıklama', data: 'description', defaultContent: '—' }
            ]
        })
    );

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Kategori oluşturuldu.');
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Kategori güncellendi.');
    });

    $('#NewPromptCategoryButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});
