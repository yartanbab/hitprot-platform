$(function () {
    var taskService = apya.platform.tasks.task;
    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');
    // editModal: apya.taskDetail kuyruk köprüsü sayesinde her zaman hazır.
    // Tıklama anında ES module henüz yüklenmemiş olsa bile ID kuyruğa alınır
    // ve module yüklenince otomatik açılır.
    var _oldModal = new abp.ModalManager(abp.appPath + 'Tasks/EditModal');
    var editModal = {
        open: function (arg) {
            // window.apya.taskDetail her zaman var (kuyruk köprüsü garanti eder)
            if (window.apya && window.apya.taskDetail) {
                window.apya.taskDetail.open(arg);
            } else {
                _oldModal.open(arg);
            }
        },
        onResult: function (fn) {
            _oldModal.onResult(fn);
            if (window.apya && window.apya.taskDetail && window.apya.taskDetail.onResult) {
                window.apya.taskDetail.onResult(fn);
            }
        }
    };

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

    // --- Alt görev hiyerarşisi ---------------------------------------------
    // Liste normalde HİYERARŞİK: yalnız kök görevler sayfalanır, alt görevler
    // chevron ile açılır. Filtre veya arama aktifken DÜZ kipe döner — aksi halde
    // filtreye uyan bir alt görev, üstü uymadığı için listeden tamamen düşerdi.
    // Proje seçimi bir kapsam (scope), filtre değil → hiyerarşiyi bozmaz.
    var expanded = {};      // parentId -> true (kullanıcı niyeti; her draw sonrası geri açılır)
    var subtaskCache = {};  // parentId -> alt görev dizisi (yalnız hızlandırma)

    function hasActiveFilter() {
        return !!($('#Filter_AssigneeId').val() ||
                  $('#Filter_Status').val() ||
                  $('#Filter_Priority').val() ||
                  $('#Filter_MinDueDate').val() ||
                  $('#Filter_MaxDueDate').val() ||
                  (dataTable && dataTable.search()));
    }

    function isHierarchical() { return !hasActiveFilter(); }

    // Yalnız DataTable bu sarmalayıcıyı kullanır; kanban ve gantt currentFilter'ı
    // doğrudan kullanmayı sürdürür — orada alt görevler gizlenmemeli.
    function listFilter() {
        var input = currentFilter();
        if (isHierarchical()) input.rootOnly = true;
        return input;
    }

    // --- DataTable ---
    var dataTable = $('#TasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[0, 'asc']],
        searching: true,
        scrollX: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList, listFilter),
        columnDefs: [
            {
                title: 'Görev',
                data: 'title',
                render: function(data, type, row) {
                    var head = '<span class="fw-bold">' + apyaTask.esc(data) + '</span>' +
                        apyaTask.commentCount(row.comments) + apyaTask.subtaskCountBadge(row);
                    // Üst görev bağlamı yalnız DÜZ kipte gerekli — hiyerarşik kipte
                    // alt görev zaten üstünün altında duruyor.
                    if (!isHierarchical() && row.parentTaskTitle) {
                        head += '<div class="text-muted small"><i class="fa fa-level-up-alt fa-rotate-90 me-1"></i>' + apyaTask.esc(row.parentTaskTitle) + '</div>';
                    }
                    return '<div class="apya-task-title-cell">' +
                        (isHierarchical() ? apyaTask.subtaskToggle(row) : '') +
                        '<div class="apya-task-title-main">' + head + apyaTask.tagChips(row.tags) + '</div>' +
                        '</div>';
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
                    return apyaTask.assigneeAvatar(data, true);
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
                title: 'Son Tarih',
                data: 'dueDate',
                render: function (data, type, row) {
                    return apyaTask.dueDateChip(data, row.status, row.completedDate);
                }
            }
        ]
    }));

    // --- "Ara" kutusunu DataTables'ın ürettiği yerden kart başlığındaki ortak
    // slot'a taşı (kendi satırını kaplamasın, Görev Panosu satırında ortalansın).
    // DataTables 2.x .dt-search kullanıyor (eski .dataTables_filter değil). ---
    $('#TasksTable_wrapper .dt-search').addClass('mb-0').appendTo('#tasks-search-slot');
    $('#tasks-search-slot input.form-control').attr('placeholder', 'Görev ara...');

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
            subtaskCache = {}; // kanban'da taşınan kart bir alt görev olabilir
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

    // --- Satıra tıklayınca görev detay modalını aç ---
    $(document).on('click', '#TasksTable tbody tr', function (e) {
        if ($(e.target).closest('a, button, .form-check-input, input, select, .dropdown').length) return;
        var $tr = $(this).closest('tr');
        var row = dataTable ? dataTable.row($tr) : null;
        var rowData = row ? row.data() : null;
        var id = (rowData && rowData.id) ? rowData.id : $tr.attr('data-id');
        if (id) { editModal.open(id); }
    });

    // --- Alt görev aç/kapa -------------------------------------------------
    // Chevron bir <button>, üstteki satır tıklaması onu zaten atlıyor; yine de
    // stopPropagation ile niyet açık bırakılıyor.
    $(document).on('click', '#TasksTable tbody [data-subtask-toggle]', function (e) {
        e.stopPropagation();
        var $btn = $(this);
        var id = $btn.attr('data-subtask-toggle');
        var row = dataTable.row($btn.closest('tr'));
        if (!row || !row.data()) return;

        if (row.child.isShown()) {
            row.child.hide();
            delete expanded[id];
            $btn.attr('aria-expanded', 'false').attr('aria-label', 'Alt görevleri göster');
            return;
        }
        expanded[id] = true;
        renderSubtasks(row, id);
    });

    // Alt görev satırına tıklayınca o alt görevin detayı açılır.
    $(document).on('click', '#TasksTable tbody .apya-subtask-row', function (e) {
        e.stopPropagation();
        var id = $(this).attr('data-subtask-id');
        if (id) { editModal.open(id); }
    });
    $(document).on('keydown', '#TasksTable tbody .apya-subtask-row', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).attr('data-subtask-id');
        if (id) { editModal.open(id); }
    });

    // Alt görevleri child satıra basar; veri cache'te yoksa önce çeker.
    function renderSubtasks(rowApi, id) {
        var $btn = $(rowApi.node()).find('[data-subtask-toggle]');
        $btn.attr('aria-expanded', 'true').attr('aria-label', 'Alt görevleri gizle');

        if (subtaskCache[id]) {
            rowApi.child(apyaTask.subtaskRows(subtaskCache[id])).show();
            return;
        }

        var $icon = $btn.find('i');
        $icon.attr('class', 'fa fa-spinner fa-spin');
        taskService.getList({ parentTaskId: id, maxResultCount: 100, sorting: 'Number' }).then(
            function (res) {
                $icon.attr('class', 'fa fa-chevron-right');
                subtaskCache[id] = res.items || [];
                if (!expanded[id]) return; // yükleme biterken kullanıcı kapattıysa açma
                rowApi.child(apyaTask.subtaskRows(subtaskCache[id])).show();
            },
            function () {
                $icon.attr('class', 'fa fa-chevron-right');
                delete expanded[id];
                $btn.attr('aria-expanded', 'false').attr('aria-label', 'Alt görevleri göster');
                abp.notify.error('Alt görevler yüklenemedi.');
            }
        );
    }

    // Child satırlar her draw'da kaybolur — açık bırakılanlar geri açılır.
    // Sayfada olmayan satırlar atlanır; expanded korunduğu için geri dönünce açılırlar.
    dataTable.on('draw', function () {
        // Düz kipte chevron basılmaz; açık kayıtlar korunur ama child satır
        // AÇILMAZ — aksi halde tetikleyicisi olmayan bir panel asılı kalırdı.
        if (!isHierarchical()) return;
        var ids = Object.keys(expanded);
        if (!ids.length) return;
        dataTable.rows().every(function () {
            var d = this.data();
            if (d && expanded[d.id]) { renderSubtasks(this, d.id); }
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
        subtaskCache = {}; // yeni görev bir alt görev olabilir → cache bayat
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // editModal.onResult ortak kanban modülünce bağlanır (load + onChanged →
    // datatable + gantt yenilenir). Burada tekrar bağlamıyoruz.

    // Otomatik kayıt event'ini dinle:
    abp.event.on('app.task.updated', function () {
        subtaskCache = {}; // başlık/durum/atanan değişmiş olabilir → yeniden çekilsin
        dataTable.ajax.reload(null, false);
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    });

    // --- APYA-25: Filtre Butonları ---
    function applyFilters() {
        dataTable.ajax.reload();
        if (!$('#view-kanban').hasClass('d-none')) kb.load();
        if (!$('#view-gantt').hasClass('d-none')) loadGantt();
    }

    // Durum/Atanan/Öncelik pilleri seçilir seçilmez uygulanır (Son Tarih popover'ı
    // hâlâ kendi "Uygula" butonuyla — iki tarihi birlikte girip tek seferde tetiklemek için).
    $('#Filter_Status, #Filter_AssigneeId, #Filter_Priority').on('change', applyFilters);
    $('#btn-apply-filters').click(applyFilters);

    $('#btn-clear-filters').click(function () {
        $('#TaskFilterForm')[0].reset();
        $('#tasks-project').trigger('change'); // reset() 'change' tetiklemez → selectedProjectId/kb scope elle temizlenmeli
        applyFilters();
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
