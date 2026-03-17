$(function () {
    var taskService = apya.platform.tasks.task;
    var createModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/CreateModal' });
    var editModal   = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });

    // Proje Id'sini sayfadan alıyoruz (buton attribute veya URL)
    var projectId = $('#btn-create-task').data('project-id');
    if (!projectId) {
        var pathParts = window.location.pathname.split('/');
        projectId = pathParts[pathParts.length - 1];
    }

    // --- 1. DataTable ---
    var dataTable = $('#ProjectTasksTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, 'asc']],
            searching: true,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(taskService.getList, function () {
                return { projectId: projectId };
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
                                                setTimeout(function () { location.reload(); }, 1500);
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
                            0: { color: 'secondary', text: 'Bekliyor' },
                            1: { color: 'warning text-dark', text: 'Sürüyor' },
                            2: { color: 'info', text: 'Testte' },
                            3: { color: 'success', text: 'Tamamlandı' }
                        };
                        var s = map[data] || map[0];
                        return '<span class="badge bg-' + s.color + ' rounded-pill px-3 py-2 shadow-sm border">' + s.text + '</span>';
                    }
                },
                {
                    title: 'Öncelik',
                    data: 'priority',
                    render: function (data) {
                        var map = {
                            0: { color: 'success', text: 'Düşük' },
                            1: { color: 'warning text-dark', text: 'Normal' },
                            2: { color: 'danger', text: 'Yüksek' }
                        };
                        var p = map[data] || map[0];
                        var baseColor = p.color.split(' ')[0];
                        return '<span class="badge border border-' + baseColor + ' text-' + baseColor + ' rounded-pill bg-white px-2 py-1"><i class="fa fa-circle text-' + baseColor + ' me-1" style="font-size:0.6rem;"></i>' + p.text + '</span>';
                    }
                },
                {
                    title: 'Başlangıç Tarihi',
                    data: 'startDate',
                    render: function (data) { return data ? moment(data).format('L') : ''; }
                },
                {
                    title: 'Bitiş Tarihi',
                    data: 'dueDate',
                    render: function (data) { return data ? moment(data).format('L') : ''; }
                }
            ]
        })
    );

    // --- 2. Yeni Görev Ekle ---
    $('#btn-create-task').click(function (e) {
        e.preventDefault();
        createModal.open({ projectId: projectId });
    });

    // --- 3. Modal sonuçları ---
    createModal.onResult(function () {
        abp.notify.success('Görev başarıyla eklendi!');
        dataTable.ajax.reload();
        setTimeout(function () { location.reload(); }, 1500);
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
        setTimeout(function () { location.reload(); }, 1500);
    });

    // --- 4. Projeyi Sil (Danger Zone) ---
    $('#btn-delete-project').click(function () {
        var pId   = $(this).data('project-id');
        var pCode = $(this).data('project-code');

        Swal.fire({
            title: 'Projeyi Silmek Üzeresiniz!',
            html: 'Dikkat! Bu işlem <b>geri alınamaz</b> ve projeye ait tüm görevler silinir.<br><br>Onaylamak için lütfen projenin kodunu (<b>' + pCode + '</b>) aşağıdaki kutuya yazın.',
            icon: 'error',
            input: 'text',
            inputPlaceholder: pCode,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-exclamation-triangle"></i> Evet, Kalıcı Olarak Sil',
            cancelButtonText: 'Güvenli Bölgeye Dön (İptal)',
            confirmButtonColor: '#dc3545',
            preConfirm: function (inputValue) {
                if (inputValue !== pCode) {
                    Swal.showValidationMessage('Silme işlemini onaylamak için tam olarak "' + pCode + '" yazmalısınız.');
                }
                return inputValue;
            }
        }).then(function (result) {
            if (result.isConfirmed) {
                apya.platform.application.projects.project.delete(pId).then(function () {
                    abp.notify.success('Proje ve bağlı tüm veriler başarıyla silindi.');
                    setTimeout(function () { window.location.href = '/Projects'; }, 1500);
                });
            }
        });
    });
});