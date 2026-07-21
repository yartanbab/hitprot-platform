$(function () {
    var taskService = apya.platform.tasks.task;
    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');
    var editModal   = new abp.ModalManager(abp.appPath + 'Tasks/EditModal');

    // Proje seçimi: kanban'ı o projeye scope'lar (özel kolonlar) + liste/gantt'ı filtreler.
    var selectedProjectId = null;

    // Ortak filtre — DataTable, Gantt ve Kanban aynı kaynaktan beslenir.
    function currentFilter() {
        var input = {};
        if (selectedProjectId) input.projectId = selectedProjectId;
        if ($('#Filter_AssigneeId').val()) input.assigneeId = $('#Filter_AssigneeId').val();
        if ($('#Filter_Status').val()) input.statuses = [parseInt($('#Filter_Status').val())];
        if ($('#Filter_Priority').val()) input.priorities = [parseInt($('#Filter_Priority').val())];
        if ($('#Filter_MinDueDate').val()) input.minDueDate = $('#Filter_MinDueDate').val();
        if ($('#Filter_MaxDueDate').val()) input.maxDueDate = $('#Filter_MaxDueDate').val();
        return input;
    }

    // --- DataTable ---
    var dataTable = $('#TasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[1, 'asc']],
        searching: true,
        scrollX: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList, currentFilter),
        columnDefs: [
            {
                title: '',
                data: null,
                orderable: false,
                className: 'text-end',
                render: function (data, type, row) {
                    var canManage = abp.auth.isGranted('Platform.Projects.ManageTeam') ||
                                     row.creatorId === abp.currentUser.id ||
                                     row.assigneeId === abp.currentUser.id;
                    return canManage
                        ? '<button type="button" class="btn btn-sm btn-light py-0 px-2 rounded js-delete-task" data-id="' + row.id + '" title="Sil"><i class="fa fa-trash text-danger" style="font-size:0.8rem;"></i></button>'
                        : '';
                }
            },
            {
                title: 'Başlık',
                data: 'title',
                render: function(data, type, row) {
                    var head = '<span class="fw-bold">' + apyaTask.esc(data) + '</span>' + apyaTask.commentCount(row.comments);
                    if (row.parentTaskTitle) {
                        head += '<div class="text-muted small"><i class="fa fa-level-up-alt fa-rotate-90 me-1"></i>' + apyaTask.esc(row.parentTaskTitle) + '</div>';
                    }
                    return '<div>' + head + apyaTask.tagChips(row.tags) + '</div>';
                }
            },
            {
                title: 'Proje',
                data: 'projectName',
                render: function (data) {
                    return data ? '<span class="small">' + apyaTask.esc(data) + '</span>' : '<span class="text-muted small">—</span>';
                }
            },
            {
                title: 'Atanan',
                data: 'assigneeName',
                render: function (data) {
                    return apyaTask.assigneeAvatar(data);
                }
            },
            {
                title: 'Durum',
                data: 'status',
                render: function (data, type, row) {
                    // Özel kolondaysa kolon adını göster (ortak kanban paritesi).
                    if (row.boardColumnName) {
                        return '<span class="apya-chip apya-chip-brand">' + row.boardColumnName + '</span>';
                    }
                    var map = {
                        1: { tone: 'neutral', text: 'Bekliyor'   },
                        2: { tone: 'warning', text: 'Sürüyor'  },
                        3: { tone: 'brand',   text: 'Testte'      },
                        4: { tone: 'positive', text: 'Tamamlandı'  }
                    };
                    var s = map[data] || map[0];
                    return '<span class="apya-chip apya-chip-' + s.tone + '">' + s.text + '</span>';
                }
            },
            {
                title: 'Öncelik',
                data: 'priority',
                render: function (data) {
                    return apyaTask.priorityBadge(data);
                }
            },
            {
                title: 'Bitiş Tarihi',
                data: 'dueDate',
                render: function (data, type, row) {
                    return apyaTask.dueDateChip(data, row.status);
                }
            }
        ]
    }));

    // --- "Ara" kutusunu DataTables'ın ürettiği yerden kart başlığındaki ortak
    // slot'a taşı (kendi satırını kaplamasın, Görev Panosu satırında ortalansın).
    // DataTables 2.x .dt-search kullanıyor (eski .dataTables_filter değil). ---
    $('#TasksTable_wrapper .dt-search').addClass('mb-0').appendTo('#tasks-search-slot');

    // --- Kanban (ortak çekirdek: /js/apya-kanban.js) ---
    // Görevler sayfası çapraz-proje (global) → sistem kolonları + proje adı + timer.
    var kb = apya.kanban.create({
        projectId: null,
        editModal: editModal,
        showProjectName: true,
        enableTimer: false,         // zaman sayacı her board'da gizli (kullanıcı kararı)
        enableCustomColumns: true,  // proje seçilince o projenin özel kolonları + Kolon Ekle
        getFilter: currentFilter,
        onChanged: function () {
            dataTable.ajax.reload(null, false);
            if (!$('#view-gantt').hasClass('d-none')) loadGantt();
        }
    });

    // --- Proje seçici: kanban'ı scope'lar + liste/gantt'ı filtreler ---
    apya.platform.application.projects.project.getList({ maxResultCount: 1000 }).then(function (res) {
        var $sel = $('#tasks-project');
        (res.items || []).forEach(function (p) {
            $sel.append($('<option>').val(p.id).text(p.name + (p.code ? ' (' + p.code + ')' : '')));
        });
    });
    $('#tasks-project').on('change', function () {
        selectedProjectId = $(this).val() || null;
        kb.setProject(selectedProjectId);
        dataTable.ajax.reload();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // --- Satıra tıklayınca drawer aç (eski "İşlemler" dropdown'ı kaldırıldı) ---
    $('#TasksTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('a, button, .form-check-input').length) return;
        var rowData = dataTable.row(this).data();
        if (rowData && rowData.id) { editModal.open({ id: rowData.id }); }
    });

    $('#TasksTable tbody').on('click', '.js-delete-task', function (e) {
        e.stopPropagation();
        var taskId = $(this).data('id');
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
                taskService.delete(taskId).then(function () {
                    abp.notify.info('Başarıyla silindi.');
                    dataTable.ajax.reload();
                    if (!$('#view-kanban').hasClass('d-none')) kb.load();
                });
            }
        });
    });

    // --- Yeni Görev ---
    $('#NewTaskButton').click(function (e) {
        e.preventDefault();
        createModal.open(selectedProjectId ? { projectId: selectedProjectId } : {});
    });

    // --- Görüntü Modu Geçişi ---
    $('#btn-view-list').click(function() { switchView('list'); });
    $('#btn-view-kanban').click(function() { switchView('kanban'); kb.load(); });
    $('#btn-view-gantt').click(function() { switchView('gantt'); loadGantt(); });

    function switchView(mode) {
        $('.view-panel').addClass('d-none');
        $('.btn-group .btn').removeClass('active');
        $('#tasks-search-slot').toggleClass('d-none', mode !== 'list');

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
        var params = $.extend({ maxResultCount: 1000 }, currentFilter());
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

    // TaskPriority enum: Low=1, Medium=2, High=3, Critical=4 — önceki hali (0/2/else)
    // gerçek enum değerleriyle uyuşmuyordu, neredeyse her görev 'medium' gösteriyordu.
    function getPriorityClass(p) {
        if (p === 1) return 'low';
        if (p === 3) return 'high';
        if (p === 4) return 'critical';
        return 'medium';
    }

    createModal.onResult(function () {
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // editModal.onResult ortak kanban modülünce bağlanır (load + onChanged →
    // datatable + gantt yenilenir). Burada tekrar bağlamıyoruz.

    // Otomatik kayıt event'ini dinle:
    abp.event.on('app.task.updated', function () {
        dataTable.ajax.reload(null, false);
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // --- APYA-25: Filtre Butonları ---
    $('#btn-apply-filters').click(function () {
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    $('#btn-clear-filters').click(function () {
        $('#TaskFilterForm')[0].reset();
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // --- AI Draft Tasks ---
    // APYA-122: BtnImportAI generic Tasks sayfasından kaldırıldı.
    // Review modalı hâlâ batch sonrası açılıyor (event-driven) — yalnızca tetikleyici buton taşındı.
    var reviewModal = new abp.ModalManager(abp.appPath + 'Tasks/Drafts/ReviewModal');

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
