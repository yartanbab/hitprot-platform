$(function () {
    var taskService = apya.platform.tasks.task;
    var _oldEditModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var editModal = {
        open: function (arg) {
            if (window.apya && window.apya.taskDetail) {
                window.apya.taskDetail.open(arg);
            } else {
                _oldEditModal.open(arg);
            }
        },
        onResult: function (fn) {
            _oldEditModal.onResult(fn);
            if (window.apya && window.apya.taskDetail && window.apya.taskDetail.onResult) {
                window.apya.taskDetail.onResult(fn);
            }
        }
    };

    // Görev oluşturma modalı. MEVCUT HATA (bu turda bulundu): burada tanımlı
    // değildi — Tasks/index.js ve Board/index.js kendi createModal'ını kurarken
    // bu dosya tanımsız global'i kullanıyordu. Sonuç: aşağıdaki
    // `createModal.onResult` satırı ReferenceError atıyor ve ondan SONRAKİ tüm
    // bağlamalar (app.task.updated, proje silme, bütçe modalı) hiç kurulmuyordu.
    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');

    // Proje Id'sini sayfadan alıyoruz (buton attribute veya URL)
    var projectId = $('#btn-create-task').data('project-id');
    if (!projectId) {
        var pathParts = window.location.pathname.split('/');
        projectId = pathParts[pathParts.length - 1];
    }

    // ================================================================
    // FİLTRE STATE — TEK KAYNAK
    // Şerit barları, filtre chip'leri, Kanban ve URL aynı nesneyi
    // okur/yazar. İkinci bir filtre mekanizması YOK (handoff kuralı).
    // ================================================================
    var CURRENT_USER_ID = (abp.currentUser && abp.currentUser.id) || null;
    var OPEN_STATUSES = [1, 2, 3]; // Todo/InProgress/InReview — Done(4) ve Cancelled(0) hariç

    // Yetkiler sunucuda karara bağlanıp kök elemana yazılıyor (bkz. .cshtml).
    var $console = $('.apya-project-console');
    var canChangeStatus = $console.data('can-change-status') === true;
    var canDeleteTasks  = $console.data('can-delete-tasks') === true;
    var canBulk         = $console.data('can-bulk') === true;

    var STATUS_LABELS   = { '': 'tümü', '0': 'İptal', '1': 'Yapılacak', '2': 'Sürüyor', '3': 'Testte', '4': 'Tamamlandı' };
    var PRIORITY_LABELS = { '': 'tümü', '1': 'Düşük', '2': 'Orta', '3': 'Yüksek', '4': 'Kritik' };

    var filterState = { status: '', assignee: '', priority: '', overdue: false, due7: false, mine: false, open: false };
    var currentView = 'list';

    function emptyState() {
        return { status: '', assignee: '', priority: '', overdue: false, due7: false, mine: false, open: false };
    }

    function readStateFromUrl() {
        var p = new URLSearchParams(window.location.search);
        filterState.status   = p.get('status') || '';
        filterState.assignee = p.get('assignee') || '';
        filterState.priority = p.get('priority') || '';
        filterState.overdue  = p.get('overdue') === '1';
        filterState.due7     = p.get('due7') === '1';
        filterState.mine     = p.get('mine') === '1';
        filterState.open     = p.get('open') === '1';
        currentView = p.get('view') === 'board' ? 'kanban' : 'list';
    }

    function writeStateToUrl() {
        // Mevcut arama dizesinden başlanır → görev derin bağlantısı (?task=...) korunur.
        var p = new URLSearchParams(window.location.search);
        function set(k, v) { if (v) { p.set(k, v); } else { p.delete(k); } }
        set('status', filterState.status);
        set('assignee', filterState.assignee);
        set('priority', filterState.priority);
        set('overdue', filterState.overdue ? '1' : '');
        set('due7', filterState.due7 ? '1' : '');
        set('mine', filterState.mine ? '1' : '');
        set('open', filterState.open ? '1' : '');
        set('view', currentView === 'kanban' ? 'board' : '');
        var qs = p.toString();
        history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    }

    // 6 → "6", 6.5 → "6,5" (ondalık yalnız gerekiyorsa, TR ayracıyla)
    function fmtHours(n) {
        return Number(n).toLocaleString('tr-TR', { maximumFractionDigits: 1 });
    }

    // Gün sınırı: dueDate saat taşıyabildiği için gün SONU kullanılır
    // (yalnız tarih tutan kayıtlar da doğru düşer).
    function dayBound(offsetDays, endOfDay) {
        var m = moment().startOf('day').add(offsetDays, 'days');
        if (endOfDay) { m.endOf('day'); }
        return m.format('YYYY-MM-DDTHH:mm:ss');
    }

    // filterState → GetTasksInput. Hem DataTables hem Kanban bunu kullanır.
    // NOT: dizi alanları ABP proxy'sine DİZİ olarak verilmeli — proxy yalnız
    // bilinen DTO alanlarını okur (`{ name:'statuses', value: input.statuses }`)
    // ve `abp.utils.buildQueryString` bunu doğru indeksli biçimde serileştirir
    // (canlı doğrulandı: `statuses:[4]` → 0 sonuç). Elle `statuses[0]` anahtarı
    // üretmek İŞE YARAMAZ, proxy o anahtarı hiç görmez.
    function buildInput() {
        var input = { projectId: projectId };

        if (filterState.status !== '') {
            input.statuses = [parseInt(filterState.status, 10)];
        } else if (filterState.open || filterState.overdue || filterState.due7) {
            // "Tamamlanmamış" ve tarih barları yalnız AÇIK görevleri kapsar
            input.statuses = OPEN_STATUSES.slice();
        }

        // Backend'de tek AssigneeId alanı var → "Bana atanan" ile kişi seçimi
        // birbirini dışlar (aşağıdaki handler'lar bunu zorunlu kılıyor).
        var assigneeId = filterState.mine ? CURRENT_USER_ID : filterState.assignee;
        if (assigneeId) { input.assigneeId = assigneeId; }

        if (filterState.priority !== '') { input.priorities = [parseInt(filterState.priority, 10)]; }

        if (filterState.overdue) {
            input.maxDueDate = dayBound(-1, true);      // dün 23:59:59 ve öncesi
        } else if (filterState.due7) {
            input.minDueDate = dayBound(0, false);      // bugün 00:00
            input.maxDueDate = dayBound(7, true);       // +7 gün 23:59:59
        }
        return input;
    }

    function hasActiveFilters() {
        return !!(filterState.status || filterState.assignee || filterState.priority ||
                  filterState.overdue || filterState.due7 || filterState.mine || filterState.open);
    }

    function assigneeLabel() {
        if (filterState.mine) { return 'ben'; }
        if (!filterState.assignee) { return 'tümü'; }
        var label = $('[data-filter="assignee"][data-value="' + filterState.assignee + '"]').data('label');
        return label || 'seçili';
    }

    // State → arayüz. Barlar ve chip'ler aynı state'i yansıtır.
    function renderFilterUi() {
        $('#chip-status  [data-chip-text]').text('Durum: ' + STATUS_LABELS[filterState.status]);
        $('#chip-priority [data-chip-text]').text('Öncelik: ' + PRIORITY_LABELS[filterState.priority]);
        $('#chip-assignee [data-chip-text]').text('Atanan: ' + assigneeLabel());

        // Dropdown chip'leri aria-expanded taşıdığı için aria-pressed KULLANMAZ.
        $('#chip-status').toggleClass('is-active', filterState.status !== '');
        $('#chip-priority').toggleClass('is-active', filterState.priority !== '');
        $('#chip-assignee').toggleClass('is-active', filterState.mine || filterState.assignee !== '');

        $('#chip-overdue').attr('aria-pressed', String(filterState.overdue));
        $('#chip-mine').attr('aria-pressed', String(filterState.mine));
        $('#bar-progress').attr('aria-pressed', String(filterState.open));
        $('#bar-overdue').attr('aria-pressed', String(filterState.overdue));
        $('#bar-due7').attr('aria-pressed', String(filterState.due7));
        $('[data-assignee-id]').each(function () {
            var on = !filterState.mine && String($(this).data('assignee-id')) === filterState.assignee;
            $(this).attr('aria-pressed', String(on));
        });

        $('#btn-clear-filters').toggleClass('d-none', !hasActiveFilters());
    }

    function applyFilters() {
        renderFilterUi();
        writeStateToUrl();
        if (dataTable) { dataTable.ajax.reload(); }
        if (kb && currentView === 'kanban') { kb.load(); }
    }

    readStateFromUrl();

    // --- 1. DataTable ---
    var hasList = $('#ProjectTasksTable').length > 0; // 403'te tablo hiç basılmaz
    var dataTable = !hasList ? null : $('#ProjectTasksTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[0, 'asc']],
            searching: true,
            // scrollX BURADAN KAPATILAMAZ: normalizeConfiguration onu "100%"
            // ile eziyor (taze sunucuda ölçüldü). Handoff'un istediği "yatay
            // scroll yok" sonucu bunun yerine `table-layout:fixed` + aşağıdaki
            // yüzdelik kolon genişlikleriyle sağlanıyor (apya-shell.css §21).
            scrollX: true,
            // Sıralama + sayfa uzunluğu hafızası (proje başına: anahtar pathname'i içerir).
            // Arama ve sayfa numarası bilinçli olarak geri yüklenmez — arama kutusu
            // şeritte ayrı yönetiliyor, bayat bir terim kafa karıştırır.
            stateSave: true,
            stateLoadParams: function (settings, data) {
                data.search.search = '';
                data.start = 0;
            },
            ajax: abp.libs.datatables.createAjax(taskService.getList, buildInput),
            createdRow: function (row, data) {
                $(row).attr('data-id', data.id).css('cursor', 'pointer');
            },
            columnDefs: buildColumns()
        })
    );

    // Kolon tanımları — seçim kolonu yalnız toplu işlem yetkisi varsa eklenir.
    function buildColumns() {
        var cols = [];
        if (canBulk) {
            cols.push({
                title: '<input type="checkbox" class="apya-row-check" id="check-all" aria-label="Sayfadaki görevleri seç">',
                data: 'id',
                orderable: false,
                width: '34px',
                // apya-c-* sınıfları: mobil kart düzeni (apya-shell.css §21)
                // hücreleri bunlarla hedefler — nth-child güvenilmez, seçim
                // kolonu yetkiye göre var/yok ve 3 kolon gizlenebiliyor.
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
                        var head = '<span class="fw-bold">' + apyaTask.esc(data) + '</span>' + apyaTask.commentCount(row.comments);
                        if (row.parentTaskTitle) {
                            head += '<div class="text-muted small"><i class="fa fa-level-up-alt fa-rotate-90 me-1"></i>' + apyaTask.esc(row.parentTaskTitle) + '</div>';
                        }
                        return '<div>' + head + apyaTask.tagChips(row.tags) + '</div>';
                    }
                },
                {
                    title: 'Atanan',
                    className: 'apya-c-assignee',
                    width: '12%',
                    data: 'assigneeName',
                    render: function (data) { return apyaTask.assigneeAvatar(data); }
                },
                {
                    title: 'Durum',
                    className: 'apya-c-status',
                    width: '12%',
                    data: 'status',
                    render: function (data, type, row) {
                        // Özel kolondaysa kolon adını göster (ortak kanban paritesi).
                        if (row.boardColumnName) {
                            return '<span class="apya-chip apya-chip-brand">' + row.boardColumnName + '</span>';
                        }
                        var map = {
                            1: { tone: 'neutral', text: 'Yapılacak' },
                            2: { tone: 'warning', text: 'Sürüyor' },
                            3: { tone: 'brand',   text: 'Testte' },
                            4: { tone: 'positive', text: 'Tamamlandı' },
                            0: { tone: 'negative', text: 'İptal' }
                        };
                        var s = map[data] || { tone: 'neutral', text: 'Bilinmiyor' };
                        return '<span class="apya-chip apya-chip-' + s.tone + '">' + s.text + '</span>';
                    }
                },
                {
                    title: 'Öncelik',
                    className: 'apya-c-priority',
                    width: '10%',
                    data: 'priority',
                    render: function (data) { return apyaTask.priorityBadge(data); }
                },
                {
                    // Efor — main merge'ünden sonra geldi: TaskDto.SpentHours
                    // (TaskTimeLog'lardan hesaplanır) + TaskDto.EstimatedHours.
                    // SpentHours türetilmiş alan olduğu için SIRALANAMAZ
                    // (ApplySorting entity kolonu bekler, sunucuda patlar).
                    title: 'Efor',
                    name: 'effort',
                    className: 'apya-c-effort',
                    width: '12%',
                    data: 'spentHours',
                    orderable: false,
                    render: function (data, type, row) {
                        var spent = Number(row.spentHours || 0);
                        var est = (row.estimatedHours === null || row.estimatedHours === undefined)
                            ? null : Number(row.estimatedHours);
                        if (!spent && est === null) { return '<span class="text-muted small">—</span>'; }

                        var text = est === null
                            ? fmtHours(spent) + 's'
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
                    width: '12%',
                    data: 'startDate',
                    render: function (data) { return data ? moment(data).format('L') : ''; }
                },
                {
                    title: 'Bitiş',
                    name: 'due',
                    className: 'apya-c-due',
                    width: '16%',
                    data: 'dueDate',
                    render: function (data, type, row) {
                        var chip = apyaTask.dueDateChip(data, row.status, row.completedDate);
                        // Satır üstüne gelince hızlı aksiyon. Yalnız "Tamamla" var:
                        // Ata/Tarih tam DTO ile UpdateAsync gerektiriyor, kısmi
                        // güncelleme uç noktası yok (görev detayından yapılıyor).
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

    // --- 1b. Şerit araması → DataTables (kendi arama kutusu CSS ile gizli) ---
    // serverSide olduğu için her tuşta istek atmasın diye 300ms geciktirilir.
    var searchTimer = null;
    $('#console-search').on('input', function () {
        var term = this.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () { if (dataTable) { dataTable.search(term).draw(); } }, 300);
    });

    if (dataTable) {
        // Sekme sayacı — DataTables'ın bildirdiği süzülmüş/toplam kayıt sayısı.
        dataTable.on('draw', function () {
            var info = dataTable.page.info();
            $('#console-task-count').text(
                info.recordsDisplay === info.recordsTotal
                    ? info.recordsTotal + ' görev'
                    : info.recordsDisplay + ' / ' + info.recordsTotal + ' görev');
            renderEmptyState();
            syncRowChecks(); // yeniden çizimde seçim işaretlerini geri koy
        });

        // Yükleniyor: spinner yerine tablo hizasında iskelet satırlar.
        dataTable.on('processing', function (e, settings, processing) {
            $('#state-loading').toggleClass('d-none', !processing);
        });
    }

    // Boş hâl, DataTables'ın kendi boş hücresine basılır — böylece tablo
    // grid'iyle aynı hizada kalır, ayrı bir overlay hizalaması gerekmez.
    // "Hiç görev yok" ile "filtreye uyan yok" ayrı metinler (handoff).
    function renderEmptyState() {
        var $cell = $('#ProjectTasksTable tbody td.dt-empty');
        if (!$cell.length) { return; }
        var filtered = hasActiveFilters() || !!(dataTable && dataTable.search());
        $cell.html($(filtered ? '#tpl-state-nomatch' : '#tpl-state-empty').html());
    }

    // ================================================================
    // TOPLU SEÇİM + TOPLU İŞLEM
    // Backend'de BulkUpdateAsync yok → istekler SIRAYLA gönderilir
    // (paralel göndermek sahte eşzamanlılık hatası üretebiliyor).
    // ================================================================
    var selectedIds = [];

    function renderBulkBar() {
        var n = selectedIds.length;
        $('#bulk-bar').toggleClass('d-none', n === 0);
        $('#bulk-count').text(n + ' görev seçili');
        // Satır vurgusu + "tümünü seç" kutusunun durumu
        $('#ProjectTasksTable tbody tr').each(function () {
            $(this).toggleClass('is-selected', selectedIds.indexOf($(this).attr('data-id')) > -1);
        });
        var pageIds = $('#ProjectTasksTable tbody .apya-row-check[data-task-id]').map(function () {
            return String($(this).data('task-id'));
        }).get();
        var allOnPage = pageIds.length > 0 && pageIds.every(function (id) { return selectedIds.indexOf(id) > -1; });
        $('#check-all').prop('checked', allOnPage);
    }

    function syncRowChecks() {
        $('#ProjectTasksTable tbody .apya-row-check[data-task-id]').each(function () {
            $(this).prop('checked', selectedIds.indexOf(String($(this).data('task-id'))) > -1);
        });
        renderBulkBar();
    }

    function clearSelection() {
        selectedIds = [];
        syncRowChecks();
    }

    $(document).on('change', '#ProjectTasksTable tbody .apya-row-check', function () {
        var id = String($(this).data('task-id'));
        var i = selectedIds.indexOf(id);
        if (this.checked && i === -1) { selectedIds.push(id); }
        else if (!this.checked && i > -1) { selectedIds.splice(i, 1); }
        renderBulkBar();
    });

    $(document).on('change', '#check-all', function () {
        var on = this.checked;
        $('#ProjectTasksTable tbody .apya-row-check[data-task-id]').each(function () {
            var id = String($(this).data('task-id'));
            var i = selectedIds.indexOf(id);
            if (on && i === -1) { selectedIds.push(id); }
            else if (!on && i > -1) { selectedIds.splice(i, 1); }
        });
        syncRowChecks();
    });

    $('#bulk-clear').click(clearSelection);

    // İstekleri sırayla çalıştırır; biri patlarsa zinciri kesip hatayı yükseltir.
    function runSequential(ids, fn) {
        return ids.reduce(function (chain, id) {
            return chain.then(function () { return fn(id); });
        }, Promise.resolve());
    }

    $('[data-bulk-status]').click(function () {
        var status = parseInt($(this).data('bulk-status'), 10);
        var ids = selectedIds.slice();
        if (!ids.length) { return; }
        runSequential(ids, function (id) { return taskService.updateStatus(id, status); })
            .then(function () {
                abp.notify.success(ids.length + ' görevin durumu güncellendi.');
                clearSelection();
                reloadAll(false);
            });
    });

    $('#bulk-delete').click(function () {
        var ids = selectedIds.slice();
        if (!ids.length) { return; }
        Swal.fire({
            title: ids.length + ' görev silinecek',
            text: 'Bu işlem geri alınamaz.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil',
            cancelButtonText: 'Vazgeç'
        }).then(function (result) {
            if (!result.isConfirmed) { return; }
            runSequential(ids, function (id) { return taskService.delete(id); })
                .then(function () {
                    abp.notify.success(ids.length + ' görev silindi.');
                    clearSelection();
                    reloadAll();
                });
        });
    });

    // Satır hover aksiyonu: Tamamla
    $(document).on('click', '[data-complete-id]', function (e) {
        e.stopPropagation(); // satır tıklaması görev detayını açmasın
        var id = $(this).data('complete-id');
        taskService.updateStatus(id, 4).then(function () {
            abp.notify.success('Görev tamamlandı.');
            reloadAll(false);
        });
    });

    // Boş hâldeki CTA'lar şeritteki gerçek butonları tetikler (tek akış).
    $(document).on('click', '[data-state-action]', function () {
        var action = $(this).data('state-action');
        if (action === 'create') { $('#btn-create-task').trigger('click'); }
        else if (action === 'ai') { $('#btn-ai-task-generator').trigger('click'); }
        else if (action === 'clear') { $('#btn-clear-filters').trigger('click'); }
    });

    // --- Kanban (ortak çekirdek: /js/apya-kanban.js) ---
    // Proje board'u: özel kolon + timer + ekle/sil/düzenle hepsi modülden.
    var kb = apya.kanban.create({
        projectId: projectId,
        editModal: editModal,
        showProjectName: false,        // tek proje → kartta proje adı gereksiz
        enableTimer: false,            // zaman sayacı her board'da gizli (kullanıcı kararı)
        enableCustomColumns: true,
        // Aynı filtre state'i board'a da uygulanır — liste ve kanban ayrışmasın.
        getFilter: buildInput,
        onChanged: function () { if (dataTable) { dataTable.ajax.reload(null, false); } }
    });

    // --- Zaman Çizelgesi (Pages/Projects/ProjectGantt.js) ---
    // Aynı filtre state'ini kullanır; tarih sürükleme yalnız Tasks.Edit ile.
    var gantt = apya.projectGantt.create({
        mount: '#view-gantt',
        getFilter: buildInput,
        editModal: editModal,
        canEdit: $console.data('can-edit-tasks') === true,
        onSaved: function () { if (dataTable) { dataTable.ajax.reload(null, false); } }
    });

    // --- Satıra tıklayınca görev detay modalını aç ---
    $(document).on('click', '#ProjectTasksTable tbody tr', function (e) {
        if ($(e.target).closest('a, button, .form-check-input, input, select, .dropdown').length) return;
        var $tr = $(this).closest('tr');
        var row = dataTable ? dataTable.row($tr) : null;
        var rowData = row ? row.data() : null;
        var id = (rowData && rowData.id) ? rowData.id : $tr.attr('data-id');
        if (id) { editModal.open(id); }
    });

    // --- 2. Yeni Görev Ekle ---
    // Mobil FAB (#btn-create-task-fab) aynı girişi kullanır — ikinci bir
    // "yeni görev" yolu değil, dar ekranda şeritteki butonun yerini alır.
    $('#btn-create-task, #btn-create-task-fab').click(function (e) {
        e.preventDefault();
        createModal.open({ projectId: projectId });
    });

    var reviewModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/Drafts/ReviewModal' });

    // --- 2b. AI Görev Oluşturucu (Yeni Arka Plan İşleme Modülü) ---
    var aiTaskModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'Tasks/Drafts/ImportModal',
        modalClass: 'aiTaskImport' // Opsiyonel CSS class
    });

    $('#btn-ai-task-generator').click(function (e) {
        e.preventDefault();
        aiTaskModal.open({ projectId: projectId });
    });

    // APYA-117: SignalR canlı güncelleme. Polling fallback'i de tutuyoruz (SignalR başarısız olursa devreye girer).
    var aiHubClient = null;
    var aiHubReady = false;

    function ensureAiHubClient() {
        if (aiHubClient) return Promise.resolve(aiHubClient);
        if (typeof window.AiHubClient === 'undefined') {
            console.warn('AiHubClient not loaded — falling back to polling.');
            return Promise.reject('hub-unavailable');
        }
        aiHubClient = new window.AiHubClient();
        return aiHubClient.connect().then(function () {
            aiHubReady = true;
            return aiHubClient;
        });
    }

    function showProgressToast(message, type) {
        type = type || 'info';
        if (abp.notify && abp.notify[type]) abp.notify[type](message);
    }

    function openReviewForBatch(batchId, totalItems) {
        showProgressToast('AI ' + totalItems + ' taslak görev üretti. İncelemeye geçiliyor.', 'success');
        setTimeout(function () {
            reviewModal.open({ BatchId: batchId });
        }, 500);
    }

    function startPollingFallback(batchId) {
        var checks = 0;
        var iv = setInterval(function () {
            checks++;
            if (checks > 20) {
                clearInterval(iv);
                abp.notify.error('İşlem zaman aşımına uğradı.');
                return;
            }
            abp.ajax({
                type: 'GET',
                url: '/api/app/draft-task/pending-drafts/' + batchId,
                cache: false
            }).done(function (result) {
                if (result && result.length > 0) {
                    clearInterval(iv);
                    openReviewForBatch(batchId, result.length);
                }
            });
        }, 3000);
    }

    // SignalR event listener — single global handler, multiplexes by batchId
    var subscribedBatches = {};
    document.addEventListener('apya:draft-batch-update', function (e) {
        var d = e.detail;
        if (!subscribedBatches[d.batchId]) return; // not our batch

        switch (d.status) {
            case 'Processing':
                showProgressToast('AI dokümanı analiz ediyor…', 'info');
                break;
            case 'ReadyForReview':
                delete subscribedBatches[d.batchId];
                openReviewForBatch(d.batchId, d.totalItems);
                break;
            case 'Abandoned':
                delete subscribedBatches[d.batchId];
                abp.notify.warning(d.errorMessage || 'AI geçerli görev bulamadı.');
                break;
            case 'Failed':
                delete subscribedBatches[d.batchId];
                abp.notify.error(d.errorMessage || 'AI işleme sırasında hata oluştu.');
                break;
        }
    });

    $(document).on('ai.drafts.batchStarted', function (e, batchId) {
        ensureAiHubClient()
            .then(function (client) {
                subscribedBatches[batchId] = true;
                return client.subscribeToBatch(batchId);
            })
            .then(function () {
                showProgressToast('Canlı bağlantı kuruldu, AI işleminin sonucu beklenecek.', 'info');
            })
            .catch(function () {
                // Hub unavailable → fall back to polling
                startPollingFallback(batchId);
            });
    });

    // Liste 403'te hiç kurulmadığı için tüm yenilemeler tek yerden korunur.
    function reloadAll(resetPaging) {
        if (dataTable) { dataTable.ajax.reload(null, resetPaging !== false); }
        kb.load();
    }

    reviewModal.onResult(function () {
        abp.notify.success('AI görevleri başarıyla oluşturuldu!');
        reloadAll();
    });

    // --- 3. Modal sonuçları ---
    createModal.onResult(function () {
        abp.notify.success('Görev başarıyla eklendi!');
        reloadAll();
    });

    // editModal.onResult ortak kanban modülü tarafından bağlanır (load + onChanged
    // → board + datatable yenilenir). Burada tekrar bağlamıyoruz.

    // Otomatik kayıt event'ini dinle:
    abp.event.on('app.task.updated', function () {
        reloadAll(false);
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

    // --- 5. Görünüm sekmeleri ---
    // Bootstrap tab yerine .view-panel + .d-none deseni (Tasks/Index ile aynı):
    // tam yükseklik flex zinciri `.view-panel:not(.d-none)` seçicisine dayanıyor,
    // .tab-pane'in kendi display/opacity yönetimi zinciri koparıyordu.
    function switchView(mode) {
        currentView = (mode === 'kanban' || mode === 'gantt') ? mode : 'list';
        $('.apya-console-views > .view-panel').addClass('d-none');
        $('.apya-console-tab').removeClass('active').attr('aria-selected', 'false');

        if (currentView === 'gantt') {
            $('#view-gantt').removeClass('d-none');
            $('#btn-view-gantt').addClass('active').attr('aria-selected', 'true');
            gantt.load();
        } else if (currentView === 'kanban') {
            $('#view-kanban').removeClass('d-none');
            $('#btn-view-kanban').addClass('active').attr('aria-selected', 'true');
            kb.load();
        } else {
            $('#view-list').removeClass('d-none');
            $('#btn-view-list').addClass('active').attr('aria-selected', 'true');
            // Gizliyken yeniden çizilen tablo kolon genişliklerini 0 ölçer.
            if (dataTable) { dataTable.columns.adjust(); }
        }
        writeStateToUrl();
    }

    $('#btn-view-list').click(function () { switchView('list'); });
    $('#btn-view-kanban').click(function () { switchView('kanban'); });
    $('#btn-view-gantt').click(function () { switchView('gantt'); });

    // Kaydedilmemiş Gantt sürüklemesi varken sayfadan ayrılma uyarısı (handoff).
    $(window).on('beforeunload', function () {
        if (gantt && gantt.hasPending()) { return 'Kaydedilmemiş tarih değişiklikleriniz var.'; }
    });

    // ================================================================
    // FİLTRE HANDLER'LARI — hepsi tek state'i yazar, sonra applyFilters()
    // ================================================================

    // Şerit barları (toggle: ikinci tık kaldırır)
    $('#bar-progress').click(function () {
        filterState.open = !filterState.open;
        applyFilters();
    });
    $('#bar-overdue, #chip-overdue').click(function () {
        filterState.overdue = !filterState.overdue;
        if (filterState.overdue) { filterState.due7 = false; } // ikisi de maxDueDate yazıyor
        applyFilters();
    });
    $('#bar-due7').click(function () {
        filterState.due7 = !filterState.due7;
        if (filterState.due7) { filterState.overdue = false; }
        applyFilters();
    });

    // Ekip facepile → o kişinin görevleri
    $('[data-assignee-id]').click(function () {
        var id = String($(this).data('assignee-id'));
        filterState.assignee = (filterState.assignee === id && !filterState.mine) ? '' : id;
        filterState.mine = false;
        applyFilters();
    });

    $('#chip-mine').click(function () {
        filterState.mine = !filterState.mine;
        if (filterState.mine) { filterState.assignee = ''; } // backend'de tek AssigneeId alanı
        applyFilters();
    });

    // Dropdown chip seçimleri (Durum / Atanan / Öncelik)
    $('[data-filter]').click(function () {
        var field = $(this).data('filter');
        filterState[field] = String($(this).data('value'));
        if (field === 'assignee') { filterState.mine = false; }
        applyFilters();
    });

    $('#btn-clear-filters').click(function () {
        filterState = emptyState();
        if (dataTable) { dataTable.search(''); }
        $('#console-search').val('');
        applyFilters();
    });

    // Başlangıç: URL'den okunan state'i arayüze bas ve görünümü aç.
    renderFilterUi();
    switchView(currentView);

    // ================================================================
    // KOLON SEÇİCİ — localStorage `apya.project.columns`
    // Başlık/Atanan/Durum/Öncelik sabit; yalnız Efor/Başlangıç/Bitiş kapanır.
    // ================================================================
    var COLS_KEY = 'apya.project.columns';
    var TOGGLEABLE_COLS = ['effort', 'start', 'due'];

    function readColPrefs() {
        try {
            var raw = JSON.parse(localStorage.getItem(COLS_KEY) || '{}');
            var out = {};
            TOGGLEABLE_COLS.forEach(function (c) { out[c] = raw[c] !== false; }); // varsayılan açık
            return out;
        } catch (e) { return { effort: true, start: true, due: true }; }
    }
    function writeColPrefs(prefs) {
        try { localStorage.setItem(COLS_KEY, JSON.stringify(prefs)); } catch (e) { /* yok say */ }
    }
    // Dar kapta Efor + Başlangıç OTOMATİK düşer (handoff <1200px kuralı).
    // Eşik viewport'a değil KABA göre: LeptonX kenar çubuğu viewport'u yiyor
    // (§21 başındaki not) — 1366px ekranda kap ~1185px. 1020px ≈ handoff'un
    // 1200px viewport'unun kenar çubuğu düşülmüş karşılığı.
    // Kullanıcının localStorage tercihi EZİLMEZ: yalnız görüntülenen hâl
    // daraltılır, kap genişleyince kayıtlı tercih geri gelir.
    var COLS_NARROW_W = 1020;
    var colsNarrow = false;
    var AUTO_DROP_COLS = ['effort', 'start'];

    function effectiveColPrefs() {
        if (!colsNarrow) { return colPrefs; }
        var out = {};
        TOGGLEABLE_COLS.forEach(function (c) {
            out[c] = AUTO_DROP_COLS.indexOf(c) === -1 ? colPrefs[c] : false;
        });
        return out;
    }

    function applyColPrefs() {
        if (!dataTable) { return; }
        var prefs = effectiveColPrefs();
        TOGGLEABLE_COLS.forEach(function (c) {
            // name seçicisi kullanılıyor: seçim kolonu yetkiye göre var/yok
            // olduğu için sabit indeks güvenilmez.
            dataTable.column(c + ':name').visible(prefs[c], false);
        });
        dataTable.columns.adjust();
        $('[data-col-toggle]').each(function () {
            var col = $(this).data('col-toggle');
            var auto = colsNarrow && AUTO_DROP_COLS.indexOf(col) !== -1;
            $(this).attr('aria-pressed', String(prefs[col]))
                   .prop('disabled', auto)
                   .attr('title', auto ? 'Ekran dar olduğu için otomatik gizlendi' : null);
        });
    }

    var colPrefs = readColPrefs();
    applyColPrefs(); // kayıtlı tercihi ilk çizimden önce uygula

    $('[data-col-toggle]').click(function () {
        var col = $(this).data('col-toggle');
        colPrefs[col] = !colPrefs[col];
        writeColPrefs(colPrefs);
        applyColPrefs();
    });

    // Kabı izle — viewport değil (kenar çubuğu daraltılabiliyor, sabit bir
    // viewport eşiği doğru cevabı veremez).
    var consoleEl = document.querySelector('.apya-project-console');
    if (consoleEl && window.ResizeObserver) {
        new ResizeObserver(function (entries) {
            var next = entries[0].contentRect.width < COLS_NARROW_W;
            if (next === colsNarrow) { return; }
            colsNarrow = next;
            applyColPrefs();
        }).observe(consoleEl);
    }

    // ================================================================
    // KAYDEDİLMİŞ GÖRÜNÜMLER — localStorage `apya.project.views`
    // Backend yok (handoff v1). Proje başına saklanır: atanan filtresi
    // proje-özgü olduğu için tek ortak liste yanlış sonuç verirdi.
    // ================================================================
    var VIEWS_KEY = 'apya.project.views';

    function readViews() {
        try {
            var all = JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}');
            return Array.isArray(all[projectId]) ? all[projectId] : [];
        } catch (e) { return []; }
    }
    function writeViews(list) {
        try {
            var all = JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}');
            all[projectId] = list;
            localStorage.setItem(VIEWS_KEY, JSON.stringify(all));
        } catch (e) { /* yok say */ }
    }

    function viewSummary(s) {
        var parts = [];
        if (s.status) { parts.push(STATUS_LABELS[s.status]); }
        if (s.priority) { parts.push(PRIORITY_LABELS[s.priority]); }
        if (s.mine) { parts.push('bana atanan'); }
        else if (s.assignee) { parts.push($('[data-filter="assignee"][data-value="' + s.assignee + '"]').data('label') || 'kişi'); }
        if (s.overdue) { parts.push('gecikmiş'); }
        if (s.due7) { parts.push('7 gün'); }
        if (s.open) { parts.push('tamamlanmamış'); }
        return parts.length ? parts.join(' · ') : 'filtresiz';
    }

    function renderSavedViews() {
        var list = readViews();
        var $wrap = $('#saved-views-list').empty();
        if (!list.length) {
            $wrap.append('<div class="apya-console-menu-hint px-3 pb-2">Henüz kayıtlı görünüm yok.</div>');
            return;
        }
        list.forEach(function (v, i) {
            var $row = $(
                '<div class="apya-console-saved-view">' +
                '  <button type="button" class="apya-console-saved-view-apply">' +
                '    <span class="apya-console-saved-view-name"></span>' +
                '    <span class="apya-console-saved-view-meta"></span>' +
                '  </button>' +
                '  <button type="button" class="apya-console-saved-view-del" aria-label="Görünümü sil" title="Sil">' +
                '    <i class="fa fa-xmark"></i></button>' +
                '</div>');
            $row.find('.apya-console-saved-view-name').text(v.name);
            $row.find('.apya-console-saved-view-meta').text(viewSummary(v.state));
            $row.find('.apya-console-saved-view-apply').click(function () {
                filterState = $.extend(emptyState(), v.state);
                currentView = v.view === 'kanban' ? 'kanban' : 'list';
                if (dataTable) { dataTable.search(v.q || ''); }
                $('#console-search').val(v.q || '');
                switchView(currentView);
                applyFilters();
            });
            $row.find('.apya-console-saved-view-del').click(function (e) {
                e.stopPropagation();
                var next = readViews();
                next.splice(i, 1);
                writeViews(next);
                renderSavedViews();
            });
            $wrap.append($row);
        });
    }

    $('#btn-save-view').click(function () {
        Swal.fire({
            title: 'Görünümü kaydet',
            input: 'text',
            inputPlaceholder: 'Örn. Bana atanan gecikmişler',
            showCancelButton: true,
            confirmButtonText: 'Kaydet',
            cancelButtonText: 'Vazgeç',
            preConfirm: function (name) {
                if (!name || !name.trim()) { Swal.showValidationMessage('Bir ad girin.'); }
                return name;
            }
        }).then(function (result) {
            if (!result.isConfirmed) { return; }
            var list = readViews();
            list.push({
                name: result.value.trim(),
                state: $.extend({}, filterState),
                view: currentView,
                q: dataTable ? dataTable.search() : ''
            });
            writeViews(list);
            renderSavedViews();
            abp.notify.success('Görünüm kaydedildi.');
        });
    });

    renderSavedViews();

    // ================================================================
    // KLAVYE KISAYOLLARI
    // Kural: bir metin alanına yazarken veya herhangi bir pencere/menü
    // açıkken HİÇBİR kısayol tetiklenmez — görev detay island'ı (React)
    // ve SweetAlert kendi tuşlarını kullanıyor.
    // ================================================================
    var shortcutsModal = null;
    function getShortcutsModal() {
        var el = document.getElementById('shortcuts-modal');
        if (!el) { return null; }
        if (!shortcutsModal) { shortcutsModal = new bootstrap.Modal(el); }
        return shortcutsModal;
    }
    $('#menu-shortcuts').click(function () {
        var m = getShortcutsModal();
        if (m) { m.show(); }
    });

    function typingInField(el) {
        if (!el) { return false; }
        var tag = (el.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    }
    function overlayOpen() {
        return !!document.querySelector('.modal.show, .swal2-container, [role="dialog"]') ||
               document.body.classList.contains('swal2-shown');
    }

    // Odaklı satır — j/k ile gezilir, ↵/x/1-4 bunun üzerinde çalışır.
    var focusedIndex = -1;
    function rowEls() { return $('#ProjectTasksTable tbody tr[data-id]').get(); }
    function renderFocusedRow() {
        var rows = rowEls();
        $('#ProjectTasksTable tbody tr').removeClass('is-focused');
        if (focusedIndex < 0 || focusedIndex >= rows.length) { return null; }
        var el = rows[focusedIndex];
        el.classList.add('is-focused');
        if (el.scrollIntoView) { el.scrollIntoView({ block: 'nearest' }); }
        return el;
    }
    function moveFocus(delta) {
        var rows = rowEls();
        if (!rows.length) { return; }
        focusedIndex = focusedIndex < 0
            ? (delta > 0 ? 0 : rows.length - 1)
            : Math.min(rows.length - 1, Math.max(0, focusedIndex + delta));
        renderFocusedRow();
    }
    function focusedTaskId() {
        var el = rowEls()[focusedIndex];
        return el ? el.getAttribute('data-id') : null;
    }

    // "g" ön ekli iki tuşlu diziler (g l / g k) için kısa süreli bekleme.
    var awaitingG = false;
    var gTimer = null;

    $(document).on('keydown', function (e) {
        if (e.ctrlKey || e.altKey || e.metaKey) { return; }
        if (typingInField(e.target)) { return; }

        // Esc yalnız kısayol penceresini kapatır; diğer pencereleri Bootstrap
        // ve React kendi yönetiyor, araya girmiyoruz.
        if (e.key === 'Escape') {
            var el = document.getElementById('shortcuts-modal');
            if (el && el.classList.contains('show') && shortcutsModal) { shortcutsModal.hide(); }
            return;
        }
        if (overlayOpen()) { return; }

        // g + l / g + k
        if (awaitingG) {
            awaitingG = false;
            clearTimeout(gTimer);
            if (e.key === 'l') { e.preventDefault(); switchView('list'); return; }
            if (e.key === 'k') { e.preventDefault(); switchView('kanban'); return; }
        }
        if (e.key === 'g') {
            awaitingG = true;
            gTimer = setTimeout(function () { awaitingG = false; }, 800);
            return;
        }

        switch (e.key) {
            case '?':
                e.preventDefault();
                var m = getShortcutsModal();
                if (m) { m.show(); }
                return;
            case '/':
                e.preventDefault();
                $('#console-search').focus();
                return;
            case 'n':
                if ($('#btn-create-task').length) { e.preventDefault(); $('#btn-create-task').trigger('click'); }
                return;
        }

        // Buradan sonrası liste görünümüne özgü
        if (currentView !== 'list') { return; }

        if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); return; }
        if (e.key === 'k' || e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); return; }

        var id = focusedTaskId();
        if (!id) { return; }

        if (e.key === 'Enter') { e.preventDefault(); editModal.open(id); return; }

        if (e.key === 'x' && canBulk) {
            e.preventDefault();
            var $cb = $('#ProjectTasksTable tbody tr[data-id="' + id + '"] .apya-row-check');
            $cb.prop('checked', !$cb.prop('checked')).trigger('change');
            return;
        }

        if (canChangeStatus && ['1', '2', '3', '4'].indexOf(e.key) > -1) {
            e.preventDefault();
            taskService.updateStatus(id, parseInt(e.key, 10)).then(function () {
                abp.notify.success('Görev durumu güncellendi.');
                reloadAll(false);
            });
        }
    });

    // Yeniden çizimde odak satırı kaybolmasın.
    if (dataTable) { dataTable.on('draw', renderFocusedRow); }

    // --- APYA-143b: Bütçe-vs-Gerçekleşen modalı ---
    // İki giriş noktası: şeritteki Bütçe barı ve ⋯ menüsündeki öğe.
    var budgetModal = new abp.ModalManager(abp.appPath + 'Projects/BudgetSummaryModal');
    $('#btn-budget-summary, #menu-budget-summary').click(function (e) {
        e.preventDefault();
        var pid = $(this).data('project-id');
        if (pid) budgetModal.open({ projectId: pid });
    });

    // --- 6. Proje kodunu kopyala (şerit ikonu + ⋯ menü öğesi) ---
    $(document).on('click', '[data-copy-code]', function () {
        var code = $(this).data('copy-code');
        if (!code) return;
        navigator.clipboard.writeText(code);
        abp.notify.success('Proje kodu kopyalandı!');
    });

    // --- 7. ⋯ menüsü → Yoğunluk ---
    // Mantık /js/density-toggle.js'te (tek kaynak: attribute + localStorage);
    // burada yalnız segmentin aktif durumu senkronlanır. Uygulama geneli ayardır,
    // topbar'daki düğmeyle aynı değeri yazar.
    function syncDensityButtons() {
        var d = (window.apya && window.apya.density) ? window.apya.density.current() : 'cozy';
        $('[data-density-set]').each(function () {
            $(this).toggleClass('active', $(this).data('density-set') === d);
        });
    }
    $('[data-density-set]').click(function () {
        if (window.apya && window.apya.density) {
            window.apya.density.set($(this).data('density-set'));
        }
    });
    document.addEventListener('apya:density-changed', syncDensityButtons);
    syncDensityButtons();
});
