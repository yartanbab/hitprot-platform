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

    // Sözcükler tr.json'daki Tasks:Status:* ile birebir (bkz. Tasks/index.js).
    var STATUS_LABELS   = { '': 'tümü', '0': 'İptal', '1': 'Yapılacak', '2': 'Sürüyor', '3': 'Testte', '4': 'Tamamlandı' };
    var PRIORITY_LABELS = { '': 'tümü', '1': 'Düşük', '2': 'Orta', '3': 'Yüksek', '4': 'Kritik' };

    // Filtre state'i + URL senkronu ortak modülde (/js/apya-task-console.js).
    // `filterState` modülün İÇ nesnesine takma ad: mevcut filterState.x okuma/
    // yazmaları aynen çalışır, senkron mantığı tek kopya olur.
    var console_ = apya.taskConsole;
    var state = console_.createState({
        status: '', assignee: '', priority: '', overdue: false, due7: false, mine: false, open: false
    });
    var filterState = state.values;
    var currentView = 'list';

    function readStateFromUrl() {
        state.readUrl();
        currentView = new URLSearchParams(window.location.search).get('view') === 'board' ? 'kanban' : 'list';
    }

    function writeStateToUrl() {
        // 'view' bu sayfada 'board' olarak yazılır (eski derin bağlantılar bozulmasın).
        state.writeUrl({ view: currentView === 'kanban' ? 'board' : '' });
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

    function hasActiveFilters() { return state.hasActive(); }

    // ─── Alt görev hiyerarşisi ─────────────────────────────────────────────
    // Görevler konsoluyla AYNI kural (mekanizma ortak modülde): normalde yalnız
    // kök görevler sayfalanır, alt görevler chevron altında açılır. Filtre veya
    // arama aktifken düz kipe dönülür — aksi halde filtreye uyan bir alt görev,
    // üstü uymadığı için listeden tamamen düşerdi. Proje kapsamı filtre değil,
    // zaten sayfanın tanımı.
    function isHierarchical() {
        return !hasActiveFilters() && !(dataTable && dataTable.search());
    }

    function listFilter() {
        var input = buildInput();
        if (isHierarchical()) { input.rootOnly = true; }
        return input;
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
        hierarchy.reset();
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
            ajax: abp.libs.datatables.createAjax(taskService.getList, listFilter),
            createdRow: function (row, data) {
                $(row).attr('data-id', data.id).css('cursor', 'pointer');
            },
            columnDefs: buildColumns()
        })
    );

    var hierarchy = console_.createSubtaskHierarchy({
        table: '#ProjectTasksTable',
        getTable: function () { return dataTable; },
        service: taskService,
        isEnabled: isHierarchical,
        openTask: function (id) { editModal.open(id); }
    });

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
                        var head = '<span class="fw-bold">' + apyaTask.esc(data) + '</span>' +
                            apyaTask.commentCount(row.comments) + apyaTask.subtaskCountBadge(row);
                        // Üst görev bağlamı yalnız DÜZ kipte gerekli — hiyerarşik
                        // kipte alt görev zaten üstünün altında duruyor.
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
                    // Kopyalanmış durum haritası kaldırıldı: alt görev satırları
                    // ile üst satırlar aynı sözcükleri kullansın diye paylaşılan
                    // çipe geçildi (Görevler listesiyle de aynı).
                    render: function (data, type, row) { return apyaTask.statusChip(data, row.boardColumnName); }
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
        searchTimer = setTimeout(function () {
            if (!dataTable) { return; }
            hierarchy.reset();          // arama düz kipe geçirir, önbellek bayatlar
            dataTable.search(term).draw();
        }, 300);
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
            // Açık alt görev satırları her draw'da kaybolur → geri açılır.
            hierarchy.restore();
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
        console_.renderEmptyState({
            table: '#ProjectTasksTable',
            hasFilters: hasActiveFilters() || !!(dataTable && dataTable.search()),
            emptyTemplate: 'tpl-state-empty',
            nomatchTemplate: 'tpl-state-nomatch'
        });
    }

    // ================================================================
    // TOPLU SEÇİM + TOPLU İŞLEM  (ortak modül)
    // Backend'de BulkUpdateAsync yok → istekler SIRAYLA gönderilir
    // (paralel göndermek sahte eşzamanlılık hatası üretebiliyor).
    // ================================================================
    var bulk = console_.createBulkSelection({
        table: '#ProjectTasksTable',
        checkAll: '#check-all',
        bar: '#bulk-bar',
        count: '#bulk-count'
    });

    // Mevcut çağrı noktaları korunsun diye ince sarmalayıcılar.
    function renderBulkBar() { bulk.render(); }
    function syncRowChecks() { bulk.syncRowChecks(); }
    function clearSelection() { bulk.clear(); }

    $('#bulk-clear').click(clearSelection);

    var runSequential = console_.runSequential;

    $('[data-bulk-status]').click(function () {
        var status = parseInt($(this).data('bulk-status'), 10);
        var ids = bulk.ids();
        if (!ids.length) { return; }
        runSequential(ids, function (id) { return taskService.updateStatus(id, status); })
            .then(function () {
                abp.notify.success(ids.length + ' görevin durumu güncellendi.');
                clearSelection();
                reloadAll(false);
            });
    });

    $('#bulk-delete').click(function () {
        var ids = bulk.ids();
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
        createModal: createModal,      // kolon başlığındaki ＋ (o kolon ön seçili açar)
        showProjectName: false,        // tek proje → kartta proje adı gereksiz
        enableTimer: false,            // zaman sayacı her board'da gizli (kullanıcı kararı)
        enableCustomColumns: true,
        // Aynı filtre state'i board'a da uygulanır — liste ve kanban ayrışmasın.
        getFilter: buildInput,
        onChanged: function () {
            hierarchy.reset();
            if (dataTable) { dataTable.ajax.reload(null, false); }
        }
    });

    // --- Zaman Çizelgesi (paylaşılan bileşen: /js/apya-gantt.js) ---
    // Aynı filtre state'ini kullanır; tarih sürükleme yalnız Tasks.Edit ile.
    var gantt = apya.projectGantt.create({
        mount: '#view-gantt',
        getFilter: buildInput,
        editModal: editModal,
        canEdit: $console.data('can-edit-tasks') === true,
        onSaved: function () {
            hierarchy.reset();
            if (dataTable) { dataTable.ajax.reload(null, false); }
        }
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
        hierarchy.reset();
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

    // ================================================================
    // EKİP YÖNETİMİ DRAWER (8. adım)
    // Üyelik YALNIZ kayıttır: burada yapılan hiçbir şey görev atamasını,
    // görünürlüğü veya yetkileri değiştirmez (bkz. ProjectMember sınıf notu).
    // ================================================================
    var memberService = apya.platform.projects.projectMember;
    var $teamDrawer = $('#team-drawer');

    if ($teamDrawer.length) {
        var teamProjectId = $teamDrawer.data('project-id');
        // Razor `true`/`false` string basıyor — jQuery bunu boolean'a çeviriyor,
        // yine de açıkça karşılaştır (attribute yoksa undefined gelir).
        var canManageTeam = $teamDrawer.data('can-manage') === true || $teamDrawer.data('can-manage') === 'true';
        var teamModal = new bootstrap.Modal($teamDrawer[0]);

        var ROLE_TEXT = { 1: 'Sorumlu', 2: 'Üye', 3: 'İzleyici' };
        var teamChanged = false;

        function renderMembers(list) {
            var $list = $('#team-list').empty();
            if (!list.length) {
                $list.append(
                    '<div class="apya-console-state">' +
                    '<span class="apya-console-state-icon"><i class="fa fa-users"></i></span>' +
                    '<strong>Bu projede henüz ekip üyesi yok</strong>' +
                    (canManageTeam ? '<p>Yukarıdan kullanıcı seçip ekleyin.</p>' : '') +
                    '</div>');
                return;
            }

            list.forEach(function (m) {
                var $row = $('<div class="apya-team-row"></div>');
                // Baş harf/ton kuralı tek yerde kalsın diye paylaşılan üretici
                // kullanılıyor (apyaTask.initials dışa aktarılmıyor), ama o İKİ
                // eleman döndürüyor: avatar + `.ms-2` isim span'i. Buradaki ad
                // kendi sütununda (.apya-team-name) basıldığı için YALNIZ avatar
                // alınır — ikisi de eklenince satır 6 çocuk oluyor, 5 kolonluk
                // ızgarada çıkar butonu alt satıra kayıyordu (ölçüldü).
                $row.append($(apyaTask.assigneeAvatar(m.displayName)).first());

                var meta = '<span class="apya-team-name">' + apyaTask.esc(m.displayName) + '</span>';
                if (m.userName) { meta += '<span class="apya-team-sub">@' + apyaTask.esc(m.userName) + '</span>'; }
                $row.append('<span class="apya-team-ident">' + meta + '</span>');

                // Açık görev sayısı — üyenin yükünü drawer'dan çıkmadan göster.
                $row.append(m.openTaskCount > 0
                    ? '<span class="apya-chip apya-chip-neutral" title="Açık görev">' + m.openTaskCount + '</span>'
                    : '<span></span>');

                if (canManageTeam) {
                    var $sel = $('<select class="form-select form-select-sm apya-team-role-select" aria-label="Rol"></select>');
                    [2, 1, 3].forEach(function (v) {
                        $sel.append($('<option></option>').attr('value', v).text(ROLE_TEXT[v]));
                    });
                    $sel.val(String(m.role));
                    $sel.on('change', function () {
                        memberService.updateRole(m.id, { role: parseInt($(this).val(), 10) })
                            .then(function () {
                                teamChanged = true;
                                abp.notify.success('Rol güncellendi.');
                                loadMembers();
                            });
                    });
                    $row.append($sel);

                    var $del = $('<button type="button" class="apya-console-row-action" title="Ekipten çıkar" aria-label="Ekipten çıkar"><i class="fa fa-user-minus"></i></button>');
                    $del.on('click', function () {
                        Swal.fire({
                            title: m.displayName + ' ekipten çıkarılacak',
                            // Görevler kasten boşa çıkarılmıyor — sunucu tarafıyla aynı karar.
                            text: 'Kişiye atanmış görevler olduğu gibi kalır.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Evet, çıkar',
                            cancelButtonText: 'Vazgeç'
                        }).then(function (r) {
                            if (!r.isConfirmed) { return; }
                            memberService.remove(m.id).then(function () {
                                teamChanged = true;
                                abp.notify.success('Üye ekipten çıkarıldı.');
                                loadMembers();
                            });
                        });
                    });
                    $row.append($del);
                } else {
                    $row.append('<span class="apya-team-role-static">' + apyaTask.esc(m.roleText) + '</span>');
                }

                $list.append($row);
            });
        }

        function loadMembers() {
            return memberService.getListByProject(teamProjectId).then(function (list) {
                renderMembers(list || []);
                if (canManageTeam) { loadAssignable(); refreshBackfillBanner(); }
            });
        }

        function loadAssignable() {
            return memberService.getAssignableUsers(teamProjectId).then(function (users) {
                var $sel = $('#team-add-user').empty().append('<option value="">Kullanıcı seçin…</option>');
                (users || []).forEach(function (u) {
                    $sel.append($('<option></option>').attr('value', u.id).text(u.displayName));
                });
            });
        }

        $('#team-add-btn').click(function () {
            var userId = $('#team-add-user').val();
            if (!userId) { abp.notify.warn('Önce bir kullanıcı seçin.'); return; }
            memberService.add({
                projectId: teamProjectId,
                userId: userId,
                role: parseInt($('#team-add-role').val(), 10)
            }).then(function () {
                teamChanged = true;
                abp.notify.success('Üye eklendi.');
                $('#team-add-user').val('');
                loadMembers();
            });
        });

        // --- Tek seferlik geçiş: görev atananlarını ekibe ekle ---
        // Sayı SUNUCUDAN sorulur, sayfadaki görev listesinden hesaplanmaz:
        // `GetDetailAsync` görevleri AutoMapper ile map'liyor ve `AssigneeName`
        // Identity araması gerektiren türetilmiş bir alan olduğu için null
        // kalıyor → Razor tarafındaki atanan listesi HER ZAMAN boş (ölçüldü).
        // Sunucu ayrıca "daha önce çıkarılmış" olanları da eliyor, yani sayı
        // tahmin değil kesin.
        function refreshBackfillBanner() {
            if (!canManageTeam) { return; }
            return memberService.getBackfillCandidateCount(teamProjectId).then(function (n) {
                $('#team-backfill-count').text(n);
                $('#team-backfill').toggleClass('d-none', !(n > 0));
            });
        }

        $('#team-backfill-btn').click(function () {
            var $btn = $(this).prop('disabled', true);
            memberService.backfillFromAssignees(teamProjectId).then(function (r) {
                teamChanged = true;

                var parcalar = [];
                if (r.added) { parcalar.push(r.added + ' kişi ekibe eklendi'); }
                if (r.skippedAlreadyMember) { parcalar.push(r.skippedAlreadyMember + ' kişi zaten ekipteydi'); }
                if (r.skippedPreviouslyRemoved) {
                    parcalar.push(r.skippedPreviouslyRemoved + ' kişi daha önce ekipten çıkarıldığı için atlandı');
                }
                if (!parcalar.length) { parcalar.push('Eklenecek kimse bulunamadı'); }

                // Atlanan varsa "başarı" demek yanıltıcı — uyarı tonu kullanılır.
                var ton = r.skippedPreviouslyRemoved > 0 ? 'warn' : 'success';
                abp.notify[ton](parcalar.join(', ') + '.');

                $btn.prop('disabled', false);
                loadMembers();       // içinde refreshBackfillBanner de çağrılır
            }).catch(function () {
                $btn.prop('disabled', false); // hata: tekrar denenebilsin
            });
        });

        $('#btn-team-drawer, #menu-team-drawer').click(function () {
            loadMembers();
            teamModal.show();
        });

        // Drawer kapanınca şeritteki facepile bayat kalmasın. Tam reload gerekiyor:
        // facepile Razor'da sunucu tarafında basılıyor, JS'te kaynağı yok.
        // Bayrak yalnız GERÇEKTEN başarılı bir yazma olunca kalkar (setTeamChanged
        // başarı callback'lerinden çağrılır) — tıklamayı dinlemek, iptal edilen
        // silme onayında veya hata dönen istekte de sayfayı yeniletirdi.
        $teamDrawer.on('hidden.bs.modal', function () {
            if (teamChanged) { window.location.reload(); }
        });
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
        state.reset();   // YERİNDE sıfırlar — filterState takma adı aynı nesneyi işaret etmeyi sürdürür
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
    // Dar kapta Efor + Başlangıç OTOMATİK düşer (handoff <1200px kuralı).
    // Eşik viewport'a değil KABA göre: LeptonX kenar çubuğu viewport'u yiyor
    // (§21 başındaki not) — 1366px ekranda kap ~1185px. 1020px ≈ handoff'un
    // 1200px viewport'unun kenar çubuğu düşülmüş karşılığı.
    // Kullanıcının localStorage tercihi EZİLMEZ: yalnız görüntülenen hâl
    // daraltılır, kap genişleyince kayıtlı tercih geri gelir.
    var colPrefs = console_.createColumnPrefs({
        storageKey: 'apya.project.columns',
        codes: ['effort', 'start', 'due'],
        autoDrop: ['effort', 'start'],
        narrowWidth: 1020,
        observe: '.apya-project-console',
        onApply: function (prefs) {
            if (!dataTable) { return; }
            // name seçicisi kullanılıyor: seçim kolonu yetkiye göre var/yok
            // olduğu için sabit indeks güvenilmez.
            Object.keys(prefs).forEach(function (c) {
                dataTable.column(c + ':name').visible(prefs[c], false);
            });
            dataTable.columns.adjust();
        }
    });

    function applyColPrefs() { colPrefs.apply(); }
    applyColPrefs(); // kayıtlı tercihi ilk çizimden önce uygula

    // ================================================================
    // KAYDEDİLMİŞ GÖRÜNÜMLER — localStorage `apya.project.views`
    // Backend yok (handoff v1). Proje başına saklanır: atanan filtresi
    // proje-özgü olduğu için tek ortak liste yanlış sonuç verirdi.
    // ================================================================
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

    console_.createSavedViews({
        storageKey: 'apya.project.views',
        scope: projectId,          // proje başına: atanan filtresi proje-özgü
        list: '#saved-views-list',
        saveButton: '#btn-save-view',
        summarize: viewSummary,
        getSnapshot: function () {
            return {
                state: $.extend({}, filterState),
                view: currentView,
                q: dataTable ? dataTable.search() : ''
            };
        },
        onApply: function (v) {
            // Önce yerinde sıfırla, sonra kayıtlı değerleri AYNI nesneye yaz —
            // yeniden atamak filterState takma adını modülün state'inden koparırdı.
            state.reset();
            $.extend(filterState, v.state);
            currentView = v.view === 'kanban' ? 'kanban' : 'list';
            if (dataTable) { dataTable.search(v.q || ''); }
            $('#console-search').val(v.q || '');
            switchView(currentView);
            applyFilters();
        }
    });

    // ================================================================
    // KLAVYE KISAYOLLARI — ortak modül (/js/apya-task-console.js)
    // ================================================================
    var shortcuts = console_.bindShortcuts({
        table: '#ProjectTasksTable',
        modal: '#shortcuts-modal',
        menuButton: '#menu-shortcuts',
        searchInput: '#console-search',
        newButton: '#btn-create-task',
        canBulk: canBulk,
        canChangeStatus: canChangeStatus,
        getView: function () { return currentView; },
        switchView: switchView,
        openTask: function (id) { editModal.open(id); },
        onStatusKey: function (id, status) {
            taskService.updateStatus(id, status).then(function () {
                abp.notify.success('Görev durumu güncellendi.');
                reloadAll(false);
            });
        }
    });

    // Yeniden çizimde odak satırı kaybolmasın.
    if (dataTable) { dataTable.on('draw', shortcuts.renderFocusedRow); }

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
    // topbar'daki düğmeyle aynı değeri yazar. Bağlama ortak modülde.
    console_.bindDensitySegment();
});
