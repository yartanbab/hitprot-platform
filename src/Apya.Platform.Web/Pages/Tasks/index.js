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
            var input = {};
            if ($('#Filter_AssigneeId').val()) input.assigneeId = $('#Filter_AssigneeId').val();
            if ($('#Filter_Status').val()) input.statuses = [parseInt($('#Filter_Status').val())];
            if ($('#Filter_MinDueDate').val()) input.minDueDate = $('#Filter_MinDueDate').val();
            if ($('#Filter_MaxDueDate').val()) input.maxDueDate = $('#Filter_MaxDueDate').val();
            return input;
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
            {
                title: 'Başlık', 
                data: 'title',
                render: function(data, type, row) {
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
        var params = { maxResultCount: 1000 };
        if ($('#Filter_AssigneeId').val()) params.assigneeId = $('#Filter_AssigneeId').val();
        if ($('#Filter_Status').val()) params.statuses = [parseInt($('#Filter_Status').val())];
        if ($('#Filter_MinDueDate').val()) params.minDueDate = $('#Filter_MinDueDate').val();
        if ($('#Filter_MaxDueDate').val()) params.maxDueDate = $('#Filter_MaxDueDate').val();

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
        var params = { maxResultCount: 1000 };
        if ($('#Filter_AssigneeId').val()) params.assigneeId = $('#Filter_AssigneeId').val();
        if ($('#Filter_Status').val()) params.statuses = [parseInt($('#Filter_Status').val())];
        if ($('#Filter_MinDueDate').val()) params.minDueDate = $('#Filter_MinDueDate').val();
        if ($('#Filter_MaxDueDate').val()) params.maxDueDate = $('#Filter_MaxDueDate').val();

        Promise.all([
            taskService.getList(params),
            taskService.getActiveTimeLog()
        ]).then(function (results) {
            renderKanban(results[0].items, results[1]);
        });
    }

    function renderKanban(tasks, activeLog) {
        $('.kanban-items').empty();
        var counts = { 1:0, 2:0, 3:0, 4:0 };

        tasks.forEach(function (task) {
            var isActive = activeLog && activeLog.taskId === task.id;
            var timerHtml = isActive 
                ? `<button class="btn btn-sm btn-danger btn-stop-timer p-1 px-2" data-id="${task.id}"><i class="fa fa-pause fa-beat"></i></button>`
                : `<button class="btn btn-sm btn-outline-success btn-start-timer p-1 px-2" data-id="${task.id}"><i class="fa fa-play"></i></button>`;

            var dueHtml = '';
            var cardBorder = '';
            if (task.dueDate) {
                if (task.status !== 4 && task.status !== 0) { // 4: Tamamlandı, 0: İptal
                    var dueDiff = moment(task.dueDate).diff(moment(), 'hours');
                    if (dueDiff < 0) {
                        cardBorder = 'border-danger border-2 bg-light bg-opacity-50';
                        dueHtml = '<div class="small text-white bg-danger mt-2 px-2 py-1 rounded fw-bold text-center heartbeat-animation w-100"><i class="fa fa-exclamation-circle me-1"></i>Süresi Geçti</div>';
                    } else if (dueDiff <= 48) {
                        cardBorder = 'border-warning border-2';
                        dueHtml = '<div class="small text-dark bg-warning mt-2 px-2 py-1 rounded fw-bold text-center w-100"><i class="fa fa-clock me-1"></i>Yaklaşıyor</div>';
                    } else {
                        dueHtml = '<div class="small text-danger fw-bold"><i class="fa fa-calendar-alt me-1"></i> ' + moment(task.dueDate).format('DD MMM') + '</div>';
                    }
                } else {
                    dueHtml = '<div class="small text-success fw-bold"><i class="fa fa-check-circle me-1"></i> ' + moment(task.dueDate).format('DD MMM') + '</div>';
                }
            }

            var cardHtml = `
                <div class="kanban-card p-3 mb-2 bg-white shadow-sm border priority-${getPriorityClass(task.priority)} ${isActive ? 'timer-active' : ''} ${cardBorder}" 
                     draggable="true" data-id="${task.id}" id="task-${task.id}">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted border px-1 rounded bg-light" style="font-size: 0.75rem;">
                            <i class="fa fa-tag me-1"></i>#${task.id.substring(0,4)}
                            ${task.parentTaskTitle ? `<span class="ms-1 border-start ps-1 text-primary"><i class="fa fa-level-up-alt fa-rotate-90"></i> ${task.parentTaskTitle}</span>` : ''}
                        </small>
                        <div class="timer-controls">
                            ${timerHtml}
                        </div>
                    </div>
                    <div class="fw-bold mb-2 task-title text-truncate" title="${task.title}">${task.title}</div>
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div class="avatar-group small">
                            <i class="fa fa-user-circle me-1 text-secondary"></i> 
                            ${task.assigneeName || 'Atanmamış'}
                        </div>
                        ${dueHtml}
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

        // Zaman Takibi
        $('.btn-start-timer').on('click', function(e) {
            e.stopPropagation();
            var id = $(this).data('id');
            taskService.startTimeTracking(id).then(function() {
                abp.notify.success('Sayman başlatıldı.');
                loadKanban();
            });
        });

        $('.btn-stop-timer').on('click', function(e) {
            e.stopPropagation();
            var id = $(this).data('id');
            taskService.stopTimeTracking(id).then(function() {
                abp.notify.success('Sayman durduruldu.');
                loadKanban();
            });
        });

        // HTML5 Drag & Drop (jQuery .off() ile event çakışmasını engelliyoruz)
        var $cards = $('.kanban-card');
        var $columns = $('.col-kanban');

        // Önceki eventleri temizle
        $cards.off('dragstart dragend');
        $columns.off('dragover dragleave drop');

        $cards.on('dragstart', function() {
            $(this).addClass('dragging');
        });
        $cards.on('dragend', function() {
            $(this).removeClass('dragging');
        });

        $columns.on('dragover', function(e) {
            e.preventDefault();
            $(this).find('.kanban-items').addClass('bg-light');
        });

        $columns.on('dragleave', function() {
            $(this).find('.kanban-items').removeClass('bg-light');
        });

        $columns.on('drop', function(e) {
            e.preventDefault();
            $(this).find('.kanban-items').removeClass('bg-light');
            
            var $draggable = $('.dragging');
            if (!$draggable.length) return;

            const taskId = $draggable.data('id');
            const newStatus = parseInt($(this).data('status'));
            
            // UI'da hemen taşıyalım
            $(this).find('.kanban-items').append($draggable);
            
            // Servis çağrısı
            taskService.updateStatus(taskId, newStatus)
                .then(function() {
                    abp.notify.success('Durum güncellendi.');
                    loadKanban(); // Sayacı vs güncellemek için yenileyelim
                })
                .catch(function() {
                    abp.notify.error('Hata oluştu veya bu duruma geçirilemez.');
                    loadKanban();
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
        dataTable.ajax.reload(null, false); 
        if (!$('#view-kanban').hasClass('d-none')) loadKanban();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // Otomatik kayıt event'ini dinle:
    abp.event.on('app.task.updated', function () {
        dataTable.ajax.reload(null, false);
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

    // --- AI Draft Tasks ---
    var importModal = new abp.ModalManager(abp.appPath + 'Tasks/Drafts/ImportModal');
    var reviewModal = new abp.ModalManager(abp.appPath + 'Tasks/Drafts/ReviewModal');

    $('#BtnImportAI').click(function(e) {
        e.preventDefault();
        importModal.open();
    });

    $(document).on('ai.drafts.batchStarted', function(e, batchId) {
        var checkLimit = 0;
        var checkInterval = setInterval(function() {
            checkLimit++;
            if (checkLimit > 20) { // Max 1 dakika beklet
                clearInterval(checkInterval);
                abp.notify.error("İşlem zaman aşımına uğradı veya beklenen veri gelmedi.");
                return;
            }

            abp.ajax({
                type: 'GET',
                url: '/api/app/draft-task/pending-drafts/' + batchId,
                cache: false
            }).done(function(result) {
                if (result && result.length > 0) {
                    clearInterval(checkInterval);
                    setTimeout(function() {
                        reviewModal.open({ BatchId: batchId });
                    }, 500); // Modalların çakışmaması için yarım saniye gecikme
                }
            });
        }, 3000); // 3 saniyede 1 polling (yüklenme durumunu simule eder)
    });
});
