// Görevler konsolu — Proje Detay konsolunun tasarım/etkileşim dili tüm projelere
// uyarlanmış hâli. Jenerik parçalar /js/apya-task-console.js'te; burada yalnız
// bu sayfaya özel olan var: proje filtresi + PROJE kolonu, alt görev hiyerarşisi,
// kanban/gantt bağlantısı ve AI taslak akışı.
$(function () {
    var taskService = apya.platform.tasks.task;
    var console_ = apya.taskConsole;

    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');
    // editModal: apya.taskDetail kuyruk köprüsü sayesinde her zaman hazır.
    var _oldModal = new abp.ModalManager(abp.appPath + 'Tasks/EditModal');
    var editModal = {
        open: function (arg) {
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

    // Yetkiler sunucuda karara bağlanıp kök elemana yazılıyor (bkz. Index.cshtml).
    var $root = $('.apya-task-console');
    var canChangeStatus = $root.data('can-change-status') === true;
    var canDeleteTasks = $root.data('can-delete-tasks') === true;
    var canEditTasks = $root.data('can-edit-tasks') === true;
    var canBulk = $root.data('can-bulk') === true;

    var OPEN_STATUSES = [1, 2, 3]; // Todo/InProgress/InReview — Done(4) ve Cancelled(0) hariç
    var CURRENT_USER_ID = (abp.currentUser && abp.currentUser.id) || '';

    // Sözcükler tr.json'daki Tasks:Status:* ile birebir — durum çipi, filtre
    // chip'i ve toplu işlem menüsü aynı durumu aynı adla anmalı.
    var STATUS_LABELS = { '': 'tümü', '0': 'İptal', '1': 'Yapılacak', '2': 'Sürüyor', '3': 'Testte', '4': 'Tamamlandı' };
    var PRIORITY_LABELS = { '': 'tümü', '1': 'Düşük', '2': 'Orta', '3': 'Yüksek', '4': 'Kritik' };

    // ─── Filtre state'i ────────────────────────────────────────────────────
    // Şerit barları ve chip'ler AYNI state'i okur/yazar — iki ayrı mekanizma yok.
    var state = console_.createState({
        status: '', assignee: '', project: '', priority: '',
        minDue: '', maxDue: '',
        overdue: false, due7: false, mine: false, open: false
    });
    state.readUrl();

    var currentView = 'list';

    // Gün sınırı: dueDate saat taşıyabildiği için gün SONU kullanılır.
    function dayBound(offsetDays, endOfDay) {
        var m = moment().startOf('day').add(offsetDays, 'days');
        if (endOfDay) { m.endOf('day'); }
        return m.format('YYYY-MM-DDTHH:mm:ss');
    }

    function fmtHours(n) {
        return Number(n).toLocaleString('tr-TR', { maximumFractionDigits: 1 });
    }

    // state → GetTasksInput. DataTable, Kanban ve Gantt hepsi bunu kullanır.
    // NOT: dizi alanları ABP proxy'sine DİZİ olarak verilmeli.
    function buildInput() {
        var input = {};

        if (state.get('project')) { input.projectId = state.get('project'); }

        if (state.get('status') !== '') {
            input.statuses = [parseInt(state.get('status'), 10)];
        } else if (state.get('open') || state.get('overdue') || state.get('due7')) {
            // "Tamamlanmamış" ve tarih barları yalnız AÇIK görevleri kapsar
            input.statuses = OPEN_STATUSES.slice();
        }

        // Backend'de tek AssigneeId alanı var → "Bana atanan" ile kişi seçimi
        // birbirini dışlar.
        var assigneeId = state.get('mine') ? CURRENT_USER_ID : state.get('assignee');
        if (assigneeId) { input.assigneeId = assigneeId; }

        if (state.get('priority') !== '') { input.priorities = [parseInt(state.get('priority'), 10)]; }

        // Bar tarih aralıkları, elle girilen aralığın ÖNÜNDE gelir (bara basmak
        // açık bir niyettir; iki aralık birleşseydi sonuç boş çıkardı).
        if (state.get('overdue')) {
            input.maxDueDate = dayBound(-1, true);
        } else if (state.get('due7')) {
            input.minDueDate = dayBound(0, false);
            input.maxDueDate = dayBound(7, true);
        } else {
            if (state.get('minDue')) { input.minDueDate = state.get('minDue'); }
            if (state.get('maxDue')) { input.maxDueDate = state.get('maxDue'); }
        }
        return input;
    }

    // ─── Alt görev hiyerarşisi ─────────────────────────────────────────────
    // Mekanizma ortak modülde (createSubtaskHierarchy). Burada yalnız "hangi
    // durumda hiyerarşik" kararı var: filtre veya arama aktifken DÜZ kipe
    // dönülür — aksi halde filtreye uyan bir alt görev, üstü uymadığı için
    // listeden tamamen düşerdi. Proje seçimi bir kapsam (scope), filtre değil
    // → hiyerarşiyi bozmaz.
    function hasActiveFilter() {
        // Proje HARİÇ: kapsam sayılır, hiyerarşiyi bozmaz.
        return !!(state.get('status') || state.get('assignee') || state.get('priority') ||
                  state.get('minDue') || state.get('maxDue') ||
                  state.get('overdue') || state.get('due7') || state.get('mine') || state.get('open') ||
                  (dataTable && dataTable.search()));
    }

    function isHierarchical() { return !hasActiveFilter(); }

    function listFilter() {
        var input = buildInput();
        if (isHierarchical()) { input.rootOnly = true; }
        return input;
    }

    // ─── Filtre arayüzü ────────────────────────────────────────────────────
    function assigneeLabel() {
        if (state.get('mine')) { return 'ben'; }
        if (!state.get('assignee')) { return 'tümü'; }
        var label = $('[data-filter="assignee"][data-value="' + state.get('assignee') + '"]').data('label');
        return label || 'seçili';
    }

    function projectLabel() {
        if (!state.get('project')) { return 'tümü'; }
        var label = $('[data-filter="project"][data-value="' + state.get('project') + '"]').data('label');
        return label || 'seçili';
    }

    function dateRangeLabel() {
        var min = state.get('minDue'), max = state.get('maxDue');
        if (!min && !max) { return 'tümü'; }
        if (min && max) { return moment(min).format('DD MMM') + ' – ' + moment(max).format('DD MMM'); }
        return min ? moment(min).format('DD MMM') + ' sonrası' : moment(max).format('DD MMM') + ' öncesi';
    }

    // Mobilde chip'ler katlıyken etkin filtre sayısı düğmedeki rozetten okunur.
    // BOYUT sayılır, chip değil: "Bana atanan" hem Atanan chip'ini hem kendi
    // chip'ini etkiliyor, iki kez sayılmamalı. Proje bir kapsam ama kullanıcı
    // açısından yine daraltma → sayılır.
    function activeFilterCount() {
        var n = 0;
        if (state.get('status') !== '') { n++; }
        if (state.get('mine') || state.get('assignee') !== '') { n++; }
        if (state.get('project') !== '') { n++; }
        if (state.get('priority') !== '') { n++; }
        if (state.get('minDue') || state.get('maxDue')) { n++; }
        if (state.get('overdue')) { n++; }
        if (state.get('due7')) { n++; }
        if (state.get('open')) { n++; }
        return n;
    }

    function renderFilterUi() {
        $('#chip-status [data-chip-text]').text('Durum: ' + STATUS_LABELS[state.get('status')]);
        $('#chip-priority [data-chip-text]').text('Öncelik: ' + PRIORITY_LABELS[state.get('priority')]);
        $('#chip-assignee [data-chip-text]').text('Atanan: ' + assigneeLabel());
        $('#chip-project [data-chip-text]').text('Proje: ' + projectLabel());
        $('#chip-daterange [data-chip-text]').text('Son Tarih: ' + dateRangeLabel());

        $('#chip-status').toggleClass('is-active', state.get('status') !== '');
        $('#chip-priority').toggleClass('is-active', state.get('priority') !== '');
        $('#chip-assignee').toggleClass('is-active', state.get('mine') || state.get('assignee') !== '');
        $('#chip-project').toggleClass('is-active', state.get('project') !== '');
        $('#chip-daterange').toggleClass('is-active', !!(state.get('minDue') || state.get('maxDue')));

        $('#chip-overdue').attr('aria-pressed', String(state.get('overdue')));
        $('#chip-mine').attr('aria-pressed', String(state.get('mine')));
        $('#bar-progress').attr('aria-pressed', String(state.get('open')));
        $('#bar-overdue').attr('aria-pressed', String(state.get('overdue')));
        $('#bar-due7').attr('aria-pressed', String(state.get('due7')));
        $('#bar-mine').attr('aria-pressed', String(state.get('mine')));

        $('#btn-clear-filters').toggleClass('d-none', !state.hasActive());

        var activeCount = activeFilterCount();
        $('#filters-active-count').text(activeCount).toggleClass('d-none', activeCount === 0);
        $('#btn-filters-toggle').toggleClass('is-active', activeCount > 0);
    }

    function applyFilters(resetSubtasks) {
        if (resetSubtasks !== false) { hierarchy.reset(); }
        renderFilterUi();
        state.writeUrl({ view: currentView === 'list' ? '' : currentView });
        if (dataTable) { dataTable.ajax.reload(); }
        if (kb && currentView === 'kanban') { kb.load(); }
        if (currentView === 'gantt') { loadGantt(); }
    }

    // ─── Şerit sayaçları ───────────────────────────────────────────────────
    // Barlar kapsam sayaçlarıdır: yalnız proje kapsamını izler, chip
    // filtrelerinden etkilenmez (sunucu tarafı da böyle davranır).
    function loadSummary() {
        var scope = {};
        if (state.get('project')) { scope.projectId = state.get('project'); }

        taskService.getSummary(scope).then(function (s) {
            var pct = s.total > 0 ? Math.round(s.done * 100 / s.total) : 0;
            $('#sum-progress-pct').text('%' + pct);
            $('#sum-progress-ratio').text('· ' + s.done + '/' + s.total);
            $('#sum-progress-bar').toggleClass('is-positive', pct === 100)
                                  .toggleClass('is-progress', pct !== 100)
                                  .find('span').css('width', pct + '%');

            $('#sum-overdue').text(s.overdue);
            $('#sum-overdue-bar').find('span').css('width', (s.total > 0 ? s.overdue * 100 / s.total : 0) + '%');

            $('#sum-due7').text(s.dueIn7Days);
            $('#sum-due7-bar').find('span').css('width', (s.total > 0 ? s.dueIn7Days * 100 / s.total : 0) + '%');

            $('#sum-mine').text(s.assignedToMe);
            $('#sum-mine-bar').find('span').css('width', (s.total > 0 ? s.assignedToMe * 100 / s.total : 0) + '%');
        });
    }

    // ─── DataTable ─────────────────────────────────────────────────────────
    var dataTable = $('#TasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[canBulk ? 1 : 0, 'asc']],
        searching: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList, listFilter),
        // Satıra data-id — klavye kısayolları (j/k gezinme, ↵, x, 1-4) satırları
        // bununla buluyor. Konsolda da aynı desen var.
        createdRow: function (row, data) {
            $(row).attr('data-id', data.id);
        },
        columnDefs: buildColumns()
    }));

    var hierarchy = console_.createSubtaskHierarchy({
        table: '#TasksTable',
        getTable: function () { return dataTable; },
        service: taskService,
        isEnabled: isHierarchical,
        openTask: function (id) { editModal.open(id); }
    });

    function buildColumns() {
        var cols = [];
        if (canBulk) {
            cols.push({
                title: '<input type="checkbox" class="apya-row-check" id="check-all" aria-label="Sayfadaki görevleri seç">',
                data: 'id',
                orderable: false,
                width: '34px',
                // apya-c-* sınıfları: mobil kart düzeni (apya-shell.css §21) hücreleri
                // bunlarla hedefler — nth-child güvenilmez, kolonlar gizlenebiliyor.
                className: 'apya-console-check-cell apya-c-check',
                render: function (data) {
                    return '<input type="checkbox" class="apya-row-check" data-task-id="' + data + '" aria-label="Görevi seç">';
                }
            });
        }
        return cols.concat([
            {
                title: 'Başlık',
                className: 'apya-c-title',
                width: '26%',
                data: 'title',
                render: function (data, type, row) {
                    var head = '<span class="fw-bold">' + apyaTask.esc(data) + '</span>' +
                        apyaTask.commentCount(row.comments) + apyaTask.subtaskCountBadge(row);
                    // Üst görev bağlamı yalnız DÜZ kipte gerekli.
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
                // Konsolda yok — burada TÜM projeler listelendiği için sabit.
                title: 'Proje',
                name: 'project',
                className: 'apya-c-project',
                width: '12%',
                data: 'projectName',
                render: function (data) {
                    return data ? '<span class="small">' + apyaTask.esc(data) + '</span>'
                                : '<span class="text-muted small">—</span>';
                }
            },
            {
                title: 'Atanan',
                className: 'apya-c-assignee',
                width: '10%',
                data: 'assigneeName',
                render: function (data) { return apyaTask.assigneeAvatar(data, true); }
            },
            {
                title: 'Durum',
                className: 'apya-c-status',
                width: '10%',
                data: 'status',
                render: function (data, type, row) { return apyaTask.statusChip(data, row.boardColumnName); }
            },
            {
                title: 'Öncelik',
                className: 'apya-c-priority',
                width: '9%',
                data: 'priority',
                render: function (data) { return apyaTask.priorityBadge(data); }
            },
            {
                // SpentHours türetilmiş alan → SIRALANAMAZ (ApplySorting entity kolonu bekler).
                title: 'Efor',
                name: 'effort',
                className: 'apya-c-effort',
                width: '11%',
                data: 'spentHours',
                orderable: false,
                render: function (data, type, row) {
                    var spent = Number(row.spentHours || 0);
                    var est = (row.estimatedHours === null || row.estimatedHours === undefined)
                        ? null : Number(row.estimatedHours);
                    if (!spent && est === null) { return '<span class="text-muted small">—</span>'; }

                    var text = est === null ? fmtHours(spent) + 's'
                                            : fmtHours(spent) + 's / ' + fmtHours(est) + 's';
                    var over = est !== null && spent > est;
                    var html = '<span class="apya-console-effort' + (over ? ' is-over' : '') + '">' +
                               '<span class="apya-numeric">' + text + '</span>';
                    if (est !== null && est > 0) {
                        var pct = Math.min(100, Math.round(spent / est * 100));
                        html += '<span class="apya-mini-progress ' + (over ? 'is-negative' : 'is-progress') + '">' +
                                '<span style="width:' + pct + '%"></span></span>';
                    }
                    return html + '</span>';
                }
            },
            {
                title: 'Başlangıç',
                name: 'start',
                className: 'apya-c-start',
                width: '10%',
                data: 'startDate',
                render: function (data) { return data ? moment(data).format('L') : ''; }
            },
            {
                title: 'Bitiş',
                name: 'due',
                className: 'apya-c-due',
                width: '12%',
                data: 'dueDate',
                render: function (data, type, row) {
                    var chip = apyaTask.dueDateChip(data, row.status, row.completedDate);
                    // Satır üstüne gelince hızlı aksiyon. Yalnız "Tamamla" var:
                    // Ata/Tarih tam DTO ile UpdateAsync gerektiriyor.
                    var closed = row.status === 4 || row.status === 0;
                    if (!canChangeStatus || closed) { return chip; }
                    return '<span class="apya-console-due">' + chip +
                        '<span class="apya-row-actions apya-console-row-actions">' +
                        '<button type="button" class="apya-console-row-action" data-complete-id="' + row.id +
                        '" title="Tamamla" aria-label="Görevi tamamla"><i class="fa fa-check"></i></button>' +
                        '</span></span>';
                }
            }
        ]);
    }

    // Yükleniyor: spinner değil, tablo hizasında iskelet satırlar. İlk yüklemede
    // ve her filtre değişiminde tabloyu iskeletle değiştirir.
    dataTable.on('preXhr', function () {
        $('#state-loading').removeClass('d-none');
        $('#TasksTable_wrapper').addClass('d-none');
    });
    dataTable.on('xhr', function () {
        $('#state-loading').addClass('d-none');
        $('#TasksTable_wrapper').removeClass('d-none');
    });

    // Sekme sayacı + boş hâl + seçim senkronu
    dataTable.on('draw', function () {
        var info = dataTable.page.info();
        $('#console-task-count').text(
            info.recordsDisplay === info.recordsTotal
                ? info.recordsTotal + ' görev'
                : info.recordsDisplay + ' / ' + info.recordsTotal + ' görev');

        // "Hiç görev yok" ile "filtreye uyan yok" ayrı metinler.
        console_.renderEmptyState({
            table: '#TasksTable',
            hasFilters: state.hasActive() || !!dataTable.search(),
            emptyTemplate: 'tpl-state-empty',
            nomatchTemplate: 'tpl-state-nomatch'
        });

        if (bulk) { bulk.syncRowChecks(); }

        // Açık alt görev satırlarını geri aç (child satırlar her draw'da kaybolur).
        hierarchy.restore();
    });

    // ─── Şerit araması → DataTables ────────────────────────────────────────
    var searchTimer = null;
    $('#console-search').on('input', function () {
        var term = this.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            hierarchy.reset();
            dataTable.search(term).draw();
            renderFilterUi();
        }, 300);
    });

    // ─── Chip + bar kablolaması ────────────────────────────────────────────
    $(document).on('click', '[data-filter]', function () {
        var key = String($(this).data('filter'));
        var value = String($(this).data('value') || '');
        if (key === 'assignee' && value) { state.set('mine', false); }
        state.set(key === 'assignee' ? 'assignee' : key, value);
        applyFilters();
        if (key === 'project') { loadSummary(); kb.setProject(value || null); }
    });

    $('#chip-overdue, #bar-overdue').on('click', function () {
        var next = !state.get('overdue');
        state.set('overdue', next);
        if (next) { state.set('due7', false); } // iki tarih barı birbirini dışlar
        applyFilters();
    });

    $('#bar-due7').on('click', function () {
        var next = !state.get('due7');
        state.set('due7', next);
        if (next) { state.set('overdue', false); }
        applyFilters();
    });

    $('#chip-mine, #bar-mine').on('click', function () {
        var next = !state.get('mine');
        state.set('mine', next);
        if (next) { state.set('assignee', ''); }
        applyFilters();
    });

    $('#bar-progress').on('click', function () {
        state.set('open', !state.get('open'));
        applyFilters();
    });

    $('#btn-apply-daterange').on('click', function () {
        state.set('minDue', $('#Filter_MinDueDate').val() || '');
        state.set('maxDue', $('#Filter_MaxDueDate').val() || '');
        if (state.get('minDue') || state.get('maxDue')) {
            state.set('overdue', false).set('due7', false); // bar aralıkları elle aralığı eziyordu
        }
        applyFilters();
        $('#chip-daterange').dropdown('hide');
    });

    // Filtreleri katla/aç — düğme yalnız mobilde görünür, sınıfı taşıyan
    // .apya-console-filters'tır (chip kümesi CSS'te ona bağlı).
    $('#btn-filters-toggle').on('click', function () {
        var open = !$('#console-filters').hasClass('is-filters-open');
        $('#console-filters').toggleClass('is-filters-open', open);
        $(this).attr('aria-expanded', String(open));
    });

    $('#btn-clear-filters').on('click', function () { clearAllFilters(); });
    $(document).on('click', '[data-state-action="clear"]', function () { clearAllFilters(); });
    $(document).on('click', '[data-state-action="create"]', function () { createModal.open({}); });

    function clearAllFilters() {
        state.reset();
        $('#Filter_MinDueDate').val('');
        $('#Filter_MaxDueDate').val('');
        $('#console-search').val('');
        if (dataTable) { dataTable.search(''); }
        kb.setProject(null);
        applyFilters();
        loadSummary();
    }

    // ─── Lookup'lar: Atanan + Proje chip menüleri ──────────────────────────
    taskService.getUsersLookup().then(function (res) {
        var $menu = $('#chip-assignee-menu');
        (res.items || []).forEach(function (u) {
            // Etiket ad+soyad; ikisi de boşsa kullanıcı adına düşülür — listedeki
            // "atanan" sütunu da aynı kuralı uyguluyor (AssigneeName eşlemesi).
            var full = [u.name, u.surname]
                .filter(function (s) { return s && String(s).trim(); })
                .join(' ')
                .trim();
            var name = full || u.userName;

            // Baş harfler: ad ve soyadın ilk harfi (proje kartlarındaki ToInitials ile aynı).
            var parts = String(name).trim().split(/\s+/);
            var initials = (parts.length >= 2
                ? parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
                : String(name).trim().slice(0, 2)).toUpperCase();

            $menu.append(
                $('<button type="button" class="apya-console-menu-item">')
                    .attr('data-filter', 'assignee').attr('data-value', u.id).attr('data-label', name)
                    .append($('<span class="apya-avatar apya-avatar-' + apyaTask.hashTone(name) + '">')
                        .text(initials))
                    .append(document.createTextNode(name))
            );
        });
        renderFilterUi();
    });

    // Hafif seçici ucu: yalnız id/ad/kod döner. Önce project.getList({maxResultCount:1000})
    // çağrılıyordu — 1000 TAM proje DTO'su (bütçe, tarihler, açıklama…) yalnız bu açılır
    // listeyi doldurmak için indiriliyor ve görev listesi isteğiyle yarışıyordu.
    taskService.getProjectsLookup().then(function (items) {
        var $menu = $('#chip-project-menu');
        (items || []).forEach(function (p) {
            var label = p.name + (p.code ? ' (' + p.code + ')' : '');
            $menu.append(
                $('<button type="button" class="apya-console-menu-item">')
                    .attr('data-filter', 'project').attr('data-value', p.id).attr('data-label', label)
                    .text(label)
            );
        });
        renderFilterUi();
    });

    // ─── Toplu seçim ───────────────────────────────────────────────────────
    var bulk = !canBulk ? null : console_.createBulkSelection({
        table: '#TasksTable',
        checkAll: '#check-all',
        bar: '#bulk-bar',
        count: '#bulk-count'
    });

    if (bulk) {
        $('#bulk-clear').on('click', function () { bulk.clear(); });

        $(document).on('click', '[data-bulk-status]', function () {
            var status = parseInt($(this).data('bulk-status'), 10);
            var ids = bulk.ids();
            if (!ids.length) { return; }
            console_.runSequential(ids, function (id) {
                return Promise.resolve(taskService.updateStatus(id, status));
            }).then(function () {
                abp.notify.success(ids.length + ' görevin durumu güncellendi.');
                bulk.clear();
                reloadAll();
            });
        });

        $('#bulk-delete').on('click', function () {
            var ids = bulk.ids();
            if (!ids.length) { return; }
            abp.message.confirm(
                'Seçili görevler kalıcı olarak silinecek.',
                ids.length + ' görev silinecek',
                function (confirmed) {
                    if (!confirmed) { return; }
                    console_.runSequential(ids, function (id) {
                        return Promise.resolve(taskService.delete(id));
                    }).then(function () {
                        abp.notify.success(ids.length + ' görev silindi.');
                        bulk.clear();
                        reloadAll();
                    });
                }
            );
        });
    }

    // Satır hover hızlı aksiyon: Tamamla
    $(document).on('click', '[data-complete-id]', function (e) {
        e.stopPropagation();
        var id = $(this).data('complete-id');
        taskService.updateStatus(id, 4).then(function () {
            abp.notify.success('Görev tamamlandı.');
            reloadAll();
        });
    });

    // ─── Yoğunluk + kolon seçici ───────────────────────────────────────────
    // Yoğunluk UYGULAMA GENELİ ayardır — topbar düğmesiyle aynı değeri yazar.
    // (Önceden sayfaya özel bir kopyaydı; ikisi birbirini görmüyordu.)
    console_.bindDensitySegment();

    var colPrefs = console_.createColumnPrefs({
        storageKey: 'apya.tasks.columns',
        codes: ['project', 'effort', 'start', 'due'],
        // Mobil kart ızgarasında yalnız Başlık/Atanan/Durum/Öncelik/Bitiş'in
        // hücresi var; kalanlar dar kapta otomatik düşer.
        autoDrop: ['project', 'effort', 'start'],
        observe: '.apya-task-console',
        onApply: function (prefs) {
            if (!dataTable) { return; }
            Object.keys(prefs).forEach(function (code) {
                dataTable.column(code + ':name').visible(prefs[code], false);
            });
            dataTable.columns.adjust();
        }
    });
    colPrefs.apply();

    // ─── Kanban (ortak çekirdek) ───────────────────────────────────────────
    var kb = apya.kanban.create({
        projectId: state.get('project') || null,
        editModal: editModal,
        createModal: createModal,   // kolon başlığındaki ＋ (o kolon ön seçili açar)
        showProjectName: true,
        enableLanes: true,          // genel pano: Grupla → Proje / Atanan kulvarları
        enableTimer: false,
        enableCustomColumns: true,
        getFilter: buildInput,
        onChanged: function () {
            hierarchy.reset();
            dataTable.ajax.reload(null, false);
            loadSummary();
            if (currentView === 'gantt') { loadGantt(); }
        }
    });

    // ─── Satıra tıklayınca görev detayı ────────────────────────────────────
    $(document).on('click', '#TasksTable tbody tr', function (e) {
        if ($(e.target).closest('a, button, .form-check-input, input, select, .dropdown').length) { return; }
        var $tr = $(this).closest('tr');
        var row = dataTable ? dataTable.row($tr) : null;
        var rowData = row ? row.data() : null;
        var id = (rowData && rowData.id) ? rowData.id : $tr.attr('data-id');
        if (id) { editModal.open(id); }
    });

    // ─── Yeni Görev ────────────────────────────────────────────────────────
    $('#NewTaskButton').click(function (e) {
        e.preventDefault();
        createModal.open(state.get('project') ? { projectId: state.get('project') } : {});
    });

    // ─── Görünüm sekmeleri ─────────────────────────────────────────────────
    $('#btn-view-list').click(function () { switchView('list'); });
    $('#btn-view-kanban').click(function () { switchView('kanban'); kb.load(); });
    $('#btn-view-gantt').click(function () { switchView('gantt'); loadGantt(); });

    // Kaydedilmemiş Gantt sürüklemesi varken sayfadan ayrılma uyarısı (konsoldaki gibi).
    $(window).on('beforeunload', function () {
        if (gantt && gantt.hasPending()) { return 'Kaydedilmemiş tarih değişiklikleriniz var.'; }
    });

    function switchView(mode) {
        currentView = mode;
        $('.view-panel').addClass('d-none');
        $('.apya-console-tab').removeClass('active').attr('aria-selected', 'false');

        var id = mode === 'list' ? '#view-list' : (mode === 'kanban' ? '#view-kanban' : '#view-gantt');
        var btn = mode === 'list' ? '#btn-view-list' : (mode === 'kanban' ? '#btn-view-kanban' : '#btn-view-gantt');
        $(id).removeClass('d-none');
        $(btn).addClass('active').attr('aria-selected', 'true');

        // Filtre çubuğu her görünümde geçerli; yalnız kolon seçici listeye özel.
        state.writeUrl({ view: mode === 'list' ? '' : mode });
    }

    // ─── Zaman Çizelgesi (paylaşılan bileşen: /js/apya-gantt.js) ───────────
    // Proje konsoluyla AYNI bileşen; kapsamı getFilter belirler. frappe-gantt
    // kaldırıldı — hiyerarşi, çeyrek zoom, gruplama, kritik yol ve kapasite
    // uyarısı onda yoktu.
    var gantt = apya.projectGantt.create({
        mount: '#view-gantt',
        getFilter: buildInput,
        editModal: editModal,
        canEdit: canEditTasks,
        onSaved: function () {
            hierarchy.reset();
            dataTable.ajax.reload(null, false);
            loadSummary();
        }
    });

    function loadGantt() { gantt.load(); }

    // ─── Yenileme ──────────────────────────────────────────────────────────
    function reloadAll() {
        hierarchy.reset();
        dataTable.ajax.reload(null, false);
        loadSummary();
        if (currentView === 'kanban') { kb.load(); }
        if (currentView === 'gantt') { loadGantt(); }
    }

    createModal.onResult(function () { reloadAll(); });
    abp.event.on('app.task.updated', function () { reloadAll(); });

    // ─── Kaydedilmiş görünümler ────────────────────────────────────────────
    // Konsolda proje başına saklanır (atanan filtresi proje-özgü); burada
    // proje YOK — tüm projelerin görevleri listeleniyor — o yüzden düz liste.
    function viewSummary(s) {
        var parts = [];
        if (s.status) { parts.push(STATUS_LABELS[s.status]); }
        if (s.priority) { parts.push(PRIORITY_LABELS[s.priority]); }
        if (s.project) { parts.push(projectLabel()); }
        if (s.mine) { parts.push('bana atanan'); }
        else if (s.assignee) { parts.push($('[data-filter="assignee"][data-value="' + s.assignee + '"]').data('label') || 'kişi'); }
        if (s.overdue) { parts.push('gecikmiş'); }
        if (s.due7) { parts.push('7 gün'); }
        if (s.open) { parts.push('tamamlanmamış'); }
        return parts.length ? parts.join(' · ') : 'filtresiz';
    }

    console_.createSavedViews({
        storageKey: 'apya.tasks.views',
        scope: null,               // düz liste
        list: '#saved-views-list',
        saveButton: '#btn-save-view',
        summarize: viewSummary,
        getSnapshot: function () {
            return {
                state: $.extend({}, state.values),
                view: currentView,
                q: dataTable ? dataTable.search() : ''
            };
        },
        onApply: function (v) {
            // Yerinde sıfırla + kayıtlı değerleri aynı nesneye yaz (modülün
            // state nesnesini yeniden atamak senkron bağını koparır).
            state.reset();
            $.extend(state.values, v.state);
            currentView = v.view === 'kanban' ? 'kanban' : (v.view === 'gantt' ? 'gantt' : 'list');
            if (dataTable) { dataTable.search(v.q || ''); }
            $('#console-search').val(v.q || '');
            kb.setProject(state.get('project') || null);
            switchView(currentView);
            applyFilters();
            loadSummary();
        }
    });

    // ─── Klavye kısayolları ────────────────────────────────────────────────
    var shortcuts = console_.bindShortcuts({
        table: '#TasksTable',
        modal: '#shortcuts-modal',
        menuButton: '#menu-shortcuts',
        searchInput: '#console-search',
        newButton: '#NewTaskButton',
        canBulk: canBulk,
        canChangeStatus: canChangeStatus,
        getView: function () { return currentView; },
        switchView: switchView,
        openTask: function (id) { editModal.open(id); },
        onStatusKey: function (id, status) {
            taskService.updateStatus(id, status).then(function () {
                abp.notify.success('Görev durumu güncellendi.');
                reloadAll();
            });
        }
    });

    // Yeniden çizimde odak satırı kaybolmasın.
    dataTable.on('draw', shortcuts.renderFocusedRow);

    // ─── AI taslak inceleme (batch sonrası event-driven) ───────────────────
    // APYA-122: tetikleyici buton bu sayfada YOK; yalnız modal açılışı korunuyor.
    var reviewModal = new abp.ModalManager(abp.appPath + 'Tasks/Drafts/ReviewModal');

    $(document).on('ai.drafts.batchStarted', function (e, batchId) {
        var checkLimit = 0;
        var checkInterval = setInterval(function () {
            checkLimit++;
            if (checkLimit > 20) {
                clearInterval(checkInterval);
                abp.notify.error("İşlem zaman aşımına uğradı veya beklenen veri gelmedi.");
                return;
            }
            abp.ajax({ type: 'GET', url: '/api/app/draft-task/pending-drafts/' + batchId, cache: false })
                .done(function (result) {
                    if (result && result.length > 0) {
                        clearInterval(checkInterval);
                        setTimeout(function () { reviewModal.open({ BatchId: batchId }); }, 500);
                    }
                });
        }, 3000);
    });

    // ─── İlk render ────────────────────────────────────────────────────────
    renderFilterUi();
    loadSummary();
    $('#Filter_MinDueDate').val(state.get('minDue'));
    $('#Filter_MaxDueDate').val(state.get('maxDue'));
});
