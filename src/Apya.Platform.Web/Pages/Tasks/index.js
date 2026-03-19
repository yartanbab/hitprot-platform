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
                        1: { color: 'secondary',       text: 'Bekliyor'   },
                        2: { color: 'warning text-dark', text: 'Sürüyor'  },
                        3: { color: 'info',            text: 'Testte'      },
                        4: { color: 'success',         text: 'Tamamlandı'  }
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

    // --- Görüntü Modu Geçişi ---
    $('#btn-view-list').click(function() {
        switchView('list');
    });

    $('#btn-view-kanban').click(function() {
        switchView('kanban');
        loadKanban();
    });

    $('#btn-view-gantt').click(function() {
        switchView('gantt');
        loadGantt();
    });

    function switchView(mode) {
        $('.view-panel').addClass('d-none');
        $('.btn-group .btn').removeClass('active');
        
        if (mode === 'list') {
            $('#view-list').removeClass('d-none');
            $('#btn-view-list').addClass('active');
        } else if (mode === 'kanban') {
            $('#view-kanban').removeClass('d-none');
            $('#btn-view-kanban').addClass('active');
        } else {
            $('#view-gantt').removeClass('d-none');
            $('#btn-view-gantt').addClass('active');
        }
    }

    // --- Gantt Mantığı ---
    var gantt = null;

    function loadGantt() {
        var params = {
            maxResultCount: 1000,
            assigneeId: $('#Filter_AssigneeId').val() || null,
            statuses: $('#Filter_Status').val() ? [$('#Filter_Status').val()] : null,
            minDueDate: $('#Filter_MinDueDate').val() || null,
            maxDueDate: $('#Filter_MaxDueDate').val() || null
        };

        taskService.getList(params).then(function (result) {
            renderGantt(result.items);
        });
    }

    function renderGantt(tasks) {
        if (!tasks.length) {
            $('#gantt-svg').empty();
            return;
        }

        var ganttTasks = tasks.map(function (task) {
            return {
                id: task.id,
                name: task.title,
                start: moment(task.startDate).format('YYYY-MM-DD'),
                end: moment(task.dueDate || moment(task.startDate).add(1, 'days')).format('YYYY-MM-DD'),
                progress: task.status === 4 ? 100 : (task.status === 1 ? 0 : 50),
                dependencies: (task.predecessorIds || []).join(','),
                custom_class: 'priority-' + getPriorityClass(task.priority)
            };
        });

        gantt = new Gantt("#gantt-svg", ganttTasks, {
            on_click: function (task) {
                editModal.open({ id: task.id });
            },
            on_date_change: function(task, start, end) {
                // Sürükle bırak ile tarih güncelleme
                taskService.get(task.id).then(function(original) {
                    var input = {
                        title: original.title,
                        description: original.description,
                        startDate: start,
                        dueDate: end,
                        status: original.status,
                        priority: original.priority,
                        projectId: original.projectId,
                        assigneeId: original.assigneeId,
                        predecessorIds: original.predecessorIds
                    };
                    taskService.update(task.id, input).then(function() {
                        abp.notify.success('Tarih güncellendi.');
                    });
                });
            },
            language: 'tr'
        });

        // View Mode Change
        $('.gantt-change-view').on('click', function() {
            var view = $(this).data('view');
            gantt.change_view_mode(view);
            $('.gantt-change-view').removeClass('active');
            $(this).addClass('active');
        });
    }

    // --- Kanban Mantığı ---
    function loadKanban() {
        var params = {
            maxResultCount: 1000, // Kanban için tümünü çekelim (sayfalama yerine)
            assigneeId: $('#Filter_AssigneeId').val() || null,
            statuses: $('#Filter_Status').val() ? [$('#Filter_Status').val()] : null,
            minDueDate: $('#Filter_MinDueDate').val() || null,
            maxDueDate: $('#Filter_MaxDueDate').val() || null
        };

        taskService.getList(params).then(function (result) {
            renderKanban(result.items);
        });
    }

    function renderKanban(tasks) {
        $('.kanban-items').empty();
        var counts = { 1:0, 2:0, 3:0, 4:0 };

        tasks.forEach(function (task) {
            var cardHtml = `
                <div class="kanban-card p-3 mb-2 bg-white shadow-sm border priority-${getPriorityClass(task.priority)}" 
                     draggable="true" data-id="${task.id}" id="task-${task.id}">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted"><i class="fa fa-tag me-1"></i> #${task.id.substring(0,4)}</small>
                        <span class="badge bg-light text-dark border p-1">${getPriorityText(task.priority)}</span>
                    </div>
                    <div class="fw-bold mb-2 task-title text-truncate" title="${task.title}">${task.title}</div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="avatar-group small">
                            <i class="fa fa-user-circle me-1 text-secondary"></i> 
                            ${task.assigneeName || 'Atanmamış'}
                        </div>
                        ${task.dueDate ? `<div class="small text-danger fw-bold"><i class="fa fa-calendar-alt me-1"></i> ${moment(task.dueDate).format('DD MMM')}</div>` : ''}
                    </div>
                </div>`;
            
            var targetId = '';
            switch(task.status) {
                case 1: targetId = '#kanban-todo'; break;
                case 2: targetId = '#kanban-inprogress'; break;
                case 3: targetId = '#kanban-test'; break;
                case 4: targetId = '#kanban-done'; break;
            }
            if(targetId) {
                $(targetId).append(cardHtml);
                counts[task.status]++;
            }
        });

        $('#count-todo').text(counts[1] || 0);
        $('#count-inprogress').text(counts[2] || 0);
        $('#count-test').text(counts[3] || 0);
        $('#count-done').text(counts[4] || 0);

        initKanbanEvents();
    }

    function initKanbanEvents() {
        // Kart tıklama (Düzenleme)
        $('.kanban-card').on('click', function(e) {
            if (e.target.closest('.btn')) return;
            var id = $(this).data('id');
            editModal.open({ id: id });
        });

        // HTML5 Drag & Drop
        var cards = document.querySelectorAll('.kanban-card');
        var columns = document.querySelectorAll('.col-kanban');

        cards.forEach(card => {
            card.addEventListener('dragstart', () => {
                card.classList.add('dragging');
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });

        columns.forEach(column => {
            column.addEventListener('dragover', e => {
                e.preventDefault();
                column.querySelector('.kanban-items').classList.add('bg-light');
            });

            column.addEventListener('dragleave', () => {
                column.querySelector('.kanban-items').classList.remove('bg-light');
            });

            column.addEventListener('drop', e => {
                e.preventDefault();
                column.querySelector('.kanban-items').classList.remove('bg-light');
                const draggable = document.querySelector('.dragging');
                if (!draggable) return;

                const taskId = draggable.dataset.id;
                const newStatus = parseInt(column.dataset.status);
                
                // UI'da hemen taşıyalım
                column.querySelector('.kanban-items').appendChild(draggable);
                
                // Servis çağrısı
                taskService.updateStatus(taskId, newStatus)
                    .then(function() {
                        abp.notify.success('Durum güncellendi.');
                        loadKanban(); // Sayacı vs güncellemek için yenileyelim
                    })
                    .catch(function(err) {
                        abp.notify.error('Hata oluştu.');
                        loadKanban();
                    });
            });
        });
    }

    function getPriorityClass(p) {
        if(p === 0) return 'low';
        if(p === 2) return 'high';
        return 'medium';
    }

    function getPriorityText(p) {
        if(p === 0) return 'Düşük';
        if(p === 2) return 'Yüksek';
        return 'Normal';
    }

    createModal.onResult(function () { 
        dataTable.ajax.reload(); 
        if (!$('#view-kanban').hasClass('d-none')) loadKanban();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    editModal.onResult(function () { 
        dataTable.ajax.reload(); 
        if (!$('#view-kanban').hasClass('d-none')) loadKanban();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // --- APYA-25: Filtre Butonları ---
    $('#btn-apply-filters').click(function () {
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) loadKanban();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    $('#btn-clear-filters').click(function () {
        $('#TaskFilterForm')[0].reset();
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) loadKanban();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });
});
