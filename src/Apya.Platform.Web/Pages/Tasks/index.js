$(function () {
    var taskService = apya.platform.tasks.task;
    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');
    var editModal   = new abp.ModalManager(abp.appPath + 'Tasks/EditModal');

    // --- DataTable ---
    var dataTable = $('#TasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[1, 'asc']],
        searching: true,
        scrollX: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList, function () {
            // APYA-25 : Gelişmiş filtre parametreleri
            return {
                assigneeId : $('#Filter_AssigneeId').val() || null,
                statuses   : $('#Filter_Status').val() ? [$('#Filter_Status').val()] : null,
                minDueDate : $('#Filter_MinDueDate').val() || null,
                maxDueDate : $('#Filter_MaxDueDate').val() || null
            };
        }),
        columnDefs: [
            {
                title: 'İşlemler',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: function (data) {
                                return abp.auth.isGranted('Platform.Projects.ManageTeam') ||
                                       data.record.creatorId  === abp.currentUser.id ||
                                       data.record.assigneeId === abp.currentUser.id;
                            },
                            action: function (data) { editModal.open({ id: data.record.id }); }
                        },
                        {
                            text: 'Sil',
                            visible: function (data) {
                                return abp.auth.isGranted('Platform.Projects.ManageTeam') ||
                                       data.record.creatorId  === abp.currentUser.id ||
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
                                    preConfirm: function (inputValue) {
                                        if (inputValue !== 'SİL') {
                                            Swal.showValidationMessage('Silme işlemini onaylamak için tam olarak "SİL" yazmalısınız.');
                                        }
                                        return inputValue;
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        taskService.delete(data.record.id).then(function () {
                                            abp.notify.info('Başarıyla silindi.');
                                            dataTable.ajax.reload();
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            },
            { title: 'Başlık', data: 'title' },
            {
                title: 'Durum',
                data: 'status',
                render: function (data) {
                    var map = {
                        0: { color: 'secondary',       text: 'Bekliyor'   },
                        1: { color: 'warning text-dark', text: 'Sürüyor'  },
                        2: { color: 'info',            text: 'Testte'      },
                        3: { color: 'success',         text: 'Tamamlandı'  }
                    };
                    var s = map[data] || map[0];
                    return '<span class="badge bg-' + s.color + '">' + s.text + '</span>';
                }
            },
            {
                title: 'Öncelik',
                data: 'priority',
                render: function (data) {
                    var map = {
                        0: { color: 'success',          text: 'Düşük'  },
                        1: { color: 'warning text-dark', text: 'Normal' },
                        2: { color: 'danger',           text: 'Yüksek' }
                    };
                    var p = map[data] || map[0];
                    return '<span class="badge bg-' + p.color + '">' + p.text + '</span>';
                }
            },
            {
                title: 'Bitiş Tarihi',
                data: 'dueDate',
                render: function (data) { return data ? moment(data).format('L') : ''; }
            }
        ]
    }));

    // --- Yeni Görev ---
    $('#NewTaskButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () { dataTable.ajax.reload(); });
    editModal.onResult(function ()   { dataTable.ajax.reload(); });

    // --- APYA-25: Filtre Butonları ---
    $('#btn-apply-filters').click(function () {
        dataTable.ajax.reload();
    });

    $('#btn-clear-filters').click(function () {
        $('#TaskFilterForm')[0].reset();
        dataTable.ajax.reload();
    });
});