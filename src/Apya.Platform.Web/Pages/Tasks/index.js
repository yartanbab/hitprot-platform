$(function () {
    var taskService = apya.platform.tasks.task;
    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'Tasks/EditModal');

    var dataTable = $('#TasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[1, "desc"]], // Başlık sütununa veya tarihe göre sırala
        searching: true,
        scrollX: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList),
        columnDefs: [
            {
                title: "İşlemler",
                rowAction: {
                    items: [
                        {
                            text: "Düzenle",
                            visible: function (data) {
                                return abp.auth.isGranted('Platform.Projects.ManageTeam') || 
                                       data.record.creatorId === abp.currentUser.id || 
                                       data.record.assigneeId === abp.currentUser.id;
                            },
                            action: function (data) { editModal.open({ id: data.record.id }); }
                        },
                        {
                            text: "Sil",
                            visible: function (data) {
                                return abp.auth.isGranted('Platform.Projects.ManageTeam') || 
                                       data.record.creatorId === abp.currentUser.id || 
                                       data.record.assigneeId === abp.currentUser.id;
                            },
                            action: function (data) {
                                Swal.fire({
                                    title: 'Görev Silinecek!',
                                    text: 'Görevi kalıcı olarak silmek üzeresiniz. Onaylamak için aşağıdaki alana "SİL" yazmalısınız.',
                                    icon: 'warning',
                                    input: 'text',
                                    inputPlaceholder: 'SİL',
                                    showCancelButton: true,
                                    confirmButtonText: '<i class="fa fa-trash"></i> Evet, Sil!',
                                    cancelButtonText: 'İptal',
                                    confirmButtonColor: '#dc3545',
                                    preConfirm: (inputValue) => {
                                        if (inputValue !== 'SİL') {
                                            Swal.showValidationMessage('Silme işlemini onaylamak için tam olarak "SİL" yazmalısınız.');
                                        }
                                        return inputValue;
                                    }
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        taskService.delete(data.record.id).then(function () {
                                            abp.notify.info("Başarıyla silindi.");
                                            dataTable.ajax.reload();
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            },
            { title: "Başlık", data: "title" },
            {
                title: "Durum",
                data: "status",
                render: function (data) {
                    var color = 'secondary', text = 'Bekliyor';
                    if (data === 1) { text = 'Sürüyor'; color = 'warning text-dark'; }
                    else if (data === 2) { text = 'Testte'; color = 'info'; }
                    else if (data === 3) { text = 'Tamamlandı'; color = 'success'; }
                    return '<span class="badge bg-' + color + '">' + text + '</span>';
                }
            }
        ]
    }));

    $('#NewTaskButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () { dataTable.ajax.reload(); });
    editModal.onResult(function () { dataTable.ajax.reload(); });

}); // KİLİT NOKTA: İŞTE EKSİK OLAN VE SİSTEMİ ÇÖKERTEN PARANTEZLER BURADA