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
                {
                    title: 'Başlık', 
                    data: 'title',
                    render: function (data, type, row) {
                        if (row.parentTaskTitle) {
                            return '<div class="d-flex flex-column"><span class="fw-bold">' + data + '</span><span class="text-muted small"><i class="fa fa-level-up-alt fa-rotate-90 me-1"></i> ' + row.parentTaskTitle + '</span></div>';
                        }
                        return '<span class="fw-bold">' + data + '</span>';
                    }
                },
                {
                    title: 'Durum',
                    data: 'status',
                    render: function (data) {
                        var map = {
                            1: { color: 'secondary', text: 'Yapılacak' },
                            2: { color: 'warning text-dark', text: 'Sürüyor' },
                            3: { color: 'info', text: 'Testte' },
                            4: { color: 'success', text: 'Tamamlandı' },
                            0: { color: 'danger', text: 'İptal' }
                        };
                        var s = map[data] || { color: 'secondary', text: 'Bilinmiyor' };
                        return '<span class="badge bg-' + s.color + ' rounded-pill px-3 py-2 shadow-sm border">' + s.text + '</span>';
                    }
                },
                {
                    title: 'Öncelik',
                    data: 'priority',
                    render: function (data) {
                        var map = {
                            1: { color: 'success', text: 'Düşük' },
                            2: { color: 'warning text-dark', text: 'Orta' },
                            3: { color: 'danger', text: 'Yüksek' },
                            4: { color: 'dark', text: 'Kritik' }
                        };
                        var p = map[data] || { color: 'secondary', text: 'Bilinmiyor' };
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
                    render: function (data, type, row) {
                        if (!data) return '';
                        if (row.status !== 4 && row.status !== 0) {
                            var dueDiff = moment(data).diff(moment(), 'hours');
                            if (dueDiff < 0) {
                                return '<span class="badge bg-danger heartbeat-animation px-2 py-1"><i class="fa fa-exclamation-circle me-1"></i>' + moment(data).format('DD MMM YYYY') + '</span>';
                            } else if (dueDiff <= 48) {
                                return '<span class="badge bg-warning text-dark px-2 py-1"><i class="fa fa-clock me-1"></i>' + moment(data).format('DD MMM YYYY') + '</span>';
                            }
                        }
                        return '<span class="text-muted">' + moment(data).format('DD MMM YYYY') + '</span>';
                    }
                }
            ]
        })
    );

    // --- 2. Yeni Görev Ekle ---
    $('#btn-create-task').click(function (e) {
        e.preventDefault();
        createModal.open({ projectId: projectId });
    });

    // --- 2b. AI Görev Oluşturucu ---
    var aiTaskModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Projects/AiTaskGeneratorModal' });

    $('#btn-ai-task-generator').click(function (e) {
        e.preventDefault();
        aiTaskModal.open({ projectId: projectId });
    });

    aiTaskModal.onResult(function () {
        abp.notify.success('AI görevleri başarıyla oluşturuldu!');
        dataTable.ajax.reload();
        setTimeout(function () { location.reload(); }, 1500);
    });

    // --- 3. Modal sonuçları ---
    createModal.onResult(function () {
        abp.notify.success('Görev başarıyla eklendi!');
        dataTable.ajax.reload();
        setTimeout(function () { location.reload(); }, 1500);
    });

    editModal.onResult(function () {
        dataTable.ajax.reload(null, false);
        if ($('#board-tab').hasClass('border-primary')) {
            loadKanban();
        }
    });

    // Otomatik kayıt event'ini dinle:
    abp.event.on('app.task.updated', function () {
        dataTable.ajax.reload(null, false);
        if ($('#board-tab').hasClass('border-primary')) {
            loadKanban();
        }
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
                    setTimeout(function () { window.location.href = '/'; }, 1500);
                });
            }
        });
    });

    // --- 5. Tabs & Kanban Gösterimi ---
    $('#list-tab').on('click', function () {
        $(this).addClass('border-bottom border-primary border-3 text-dark').removeClass('text-muted');
        $('#board-tab').removeClass('border-bottom border-primary border-3 text-dark').addClass('text-muted');
    });

    $('#board-tab').on('click', function () {
        $(this).addClass('border-bottom border-primary border-3 text-dark').removeClass('text-muted');
        $('#list-tab').removeClass('border-bottom border-primary border-3 text-dark').addClass('text-muted');
        loadKanban();
    });

    function loadKanban() {
        taskService.getList({ projectId: projectId, maxResultCount: 200 }).then(function(result) {
            $('.kanban-cards').empty();
            var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
            
            result.items.forEach(function(task) {
                var statusId = task.status;
                var priorityId = task.priority;
                var assigneeHtml = task.assigneeName ? '<div class="small fw-bold text-muted mt-2"><i class="fa fa-user me-1"></i>' + task.assigneeName + '</div>' : '';
                
                var dueHtml = '';
                var cardBorder = '';
                if (task.dueDate) {
                    if (statusId !== 4 && statusId !== 0) { // 4: Tamamlandı, 0: İptal
                        var dueDiff = moment(task.dueDate).diff(moment(), 'hours');
                        if (dueDiff < 0) {
                            cardBorder = 'border-danger border-2 bg-light bg-opacity-50';
                            dueHtml = '<div class="small text-white bg-danger mt-2 px-2 py-1 rounded fw-bold text-center heartbeat-animation"><i class="fa fa-exclamation-circle me-1"></i>Süresi Geçti (' + moment(task.dueDate).format("DD MMM") + ')</div>';
                        } else if (dueDiff <= 48) {
                            cardBorder = 'border-warning border-2';
                            dueHtml = '<div class="small text-dark bg-warning mt-2 px-2 py-1 rounded fw-bold text-center"><i class="fa fa-clock me-1"></i>Yaklaşıyor (' + moment(task.dueDate).format("DD MMM") + ')</div>';
                        } else {
                            dueHtml = '<div class="small text-muted mt-2 px-1"><i class="fa fa-clock me-1"></i>' + moment(task.dueDate).format("DD MMM") + '</div>';
                        }
                    } else {
                        dueHtml = '<div class="small text-success mt-2 px-1"><i class="fa fa-check-circle me-1"></i>' + moment(task.dueDate).format("DD MMM") + '</div>';
                    }
                }

                var parentHtml = task.parentTaskTitle ? '<div class="d-flex align-items-center mb-1 text-primary small"><i class="fa fa-level-up-alt fa-rotate-90 me-1"></i> ' + task.parentTaskTitle + '</div>' : '';
                var cardHtml = `
                    <div class="kanban-card shadow-sm ${cardBorder}" data-id="${task.id}" data-priority="${priorityId}">
                        ${parentHtml}
                        <div class="fw-bold mb-1 text-dark">${task.title}</div>
                        ${assigneeHtml}
                        ${dueHtml}
                        <div class="text-end mt-2">
                           <button class="btn btn-sm btn-light py-0 px-2 rounded edit-task-btn" data-id="${task.id}"><i class="fa fa-pencil-alt text-secondary" style="font-size: 0.75rem;"></i></button>
                        </div>
                    </div>
                `;
                
                if (statusId === 1) { $('#kanban-todo').append(cardHtml); counts[1]++; }
                else if (statusId === 2) { $('#kanban-inprogress').append(cardHtml); counts[2]++; }
                else if (statusId === 3) { $('#kanban-inreview').append(cardHtml); counts[3]++; }
                else if (statusId === 4) { $('#kanban-done').append(cardHtml); counts[4]++; }
            });
            
            // Update counts
            $('[data-status-id="1"] .kanban-count').text(counts[1]);
            $('[data-status-id="2"] .kanban-count').text(counts[2]);
            $('[data-status-id="3"] .kanban-count').text(counts[3]);
            $('[data-status-id="4"] .kanban-count').text(counts[4]);
            
            // Init Sortable hook
            initSortable();
        });
    }

    $(document).on('click', '.edit-task-btn', function(){
       editModal.open({ id: $(this).data('id') });
    });

    var sortables = [];
    function initSortable() {
        // Destroy existing instances
        sortables.forEach(function(s) { s.destroy(); });
        sortables = [];

        var cols = document.querySelectorAll('.kanban-cards');
        cols.forEach(function (col) {
            var sortable = new Sortable(col, {
                group: 'shared', // set both lists to same group
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: function (evt) {
                    var itemEl = evt.item;  // dragged element
                    var toCol = evt.to;    // target list
                    var taskId = $(itemEl).data('id');
                    var newStatusId = $(toCol).closest('.kanban-column').data('status-id');
                    
                    if (evt.from !== evt.to) {
                        // KANBAN UPDATE
                        taskService.updateStatus(taskId, newStatusId).then(function() {
                            abp.notify.success('Görev durumu güncellendi.');
                            dataTable.ajax.reload(null, false); // DataTable'ı arkada sessizce yenile
                            
                            // Re-calculate counts
                            var colsArr = [1,2,3,4];
                            colsArr.forEach(function(s) {
                                $('[data-status-id="'+s+'"] .kanban-count').text($('[data-status-id="'+s+'"] .kanban-cards .kanban-card').length);
                            });
                        });
                    }
                }
            });
            sortables.push(sortable);
        });
    }
});