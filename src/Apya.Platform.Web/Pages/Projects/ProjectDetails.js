$(function () {
    var taskService = apya.platform.tasks.task;
    var createModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/CreateModal' });
    var editModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    
    // Proje Id'sini sayfadan (buton attribute'undan veya URL'den) alıyoruz.
    var projectId = $('#btn-create-task').attr('data-project-id');
    if (!projectId) {
        // Eğer Buton yoksa URL path'inden (GUID formatında) alıyoruz
        var pathParts = window.location.pathname.split('/');
        projectId = pathParts[pathParts.length - 1]; 
    }

    // 1. DataTable Konfigürasyonu
    var dataTable = $('#ProjectTasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[1, "desc"]], // Başlık sütununa veya tarihe göre sırala
        searching: true,
        scrollX: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList, function () {
            // SADECE BU PROJENİN GÖREVLERİNİ GETİR
            return { projectId: projectId };
        }),
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
                    
                    return '<span class="badge bg-' + color + ' rounded-pill px-3 py-2 shadow-sm border">' + text + '</span>';
                }
            },
            {
                title: "Öncelik",
                data: "priority",
                render: function (data) {
                    var color = 'success', text = 'Düşük';
                    if (data === 1) { text = 'Normal'; color = 'warning text-dark'; }
                    else if (data === 2) { text = 'Yüksek'; color = 'danger'; }
                    return '<span class="badge border border-' + (color.includes('warning') ? 'warning' : color) + ' text-' + (color.includes('warning') ? 'dark' : color) + ' rounded-pill bg-white px-2 py-1"><i class="fa fa-circle text-' + color.split(' ')[0] + ' me-1" style="font-size: 0.6rem;"></i>' + text + '</span>';
                }
            },
            {
                title: "Başlangıç Tarihi",
                data: "startDate",
                render: function (data) {
                    if (data === null) return "";
                    return moment(data).format('L');
                }
            },
            {
                title: "Bitiş Tarihi",
                data: "dueDate",
                render: function (data) {
                    if (data === null) return "";
                    return moment(data).format('L');
                }
            }
        ]
    }));

    // 2. Butona Tıklanınca (Yeni Ekle)
    $('#btn-create-task').click(function (e) {
        e.preventDefault();
        createTaskModal.open({
            projectId: projectId
        });
    });

    // 3. Kayıt Başarılı Olunca Tabloyu Yenile (Sayfayı değil)
    createModal.onResult(function () {
        abp.notify.success('Görev başarıyla eklendi!');
        dataTable.ajax.reload();
        // İlerleme yüzdesi vs güncellensin diye opsiyonel sayfa refresh yapabiliriz ama UX için tablo refresh yeterli
        setTimeout(() => location.reload(), 1500); // 1.5 sn sonra yüzdeler güncellensin 
    });
    
    editModal.onResult(function () {
        dataTable.ajax.reload();
        setTimeout(() => location.reload(), 1500); 
    });

    // 4. Projeyi Silme (Danger Zone)
    $('#btn-delete-project').click(function () {
        var pId = $(this).attr('data-project-id');
        var pCode = $(this).attr('data-project-code');

        Swal.fire({
            title: 'Projeyi Silmek Üzeresiniz!',
            html: `Dikkat! Bu işlem <b>geri alınamaz</b> ve projeye ait tüm görevler silinir.<br><br>Onaylamak için lütfen projenin kodunu (<b>${pCode}</b>) aşağıdaki kutuya yazın.`,
            icon: 'error',
            input: 'text',
            inputPlaceholder: pCode,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-exclamation-triangle"></i> Evet, Kalıcı Olarak Sil',
            cancelButtonText: 'Güvenli Bölgeye Dön (İptal)',
            confirmButtonColor: '#dc3545',
            preConfirm: (inputValue) => {
                if (inputValue !== pCode) {
                    Swal.showValidationMessage(`Silme işlemini onaylamak için tam olarak "${pCode}" yazmalısınız.`);
                }
                return inputValue;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Not: Burada ProjectAppService.DeleteAsync isteği atılmalı
                apya.platform.projects.project.delete(pId).then(function () {
                    abp.notify.success("Proje ve bağlı tüm veriler başarıyla silindi.");
                    setTimeout(function() {
                        window.location.href = '/Projects';
                    }, 1500);
                });
            }
        });
    });
});