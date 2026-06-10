/* =============================================================================
   APYA KANBAN — Ortak çekirdek (tek kaynak JS)
   -----------------------------------------------------------------------------
   /Board (global), /Tasks (Görevler) ve Projects/ProjectDetails kanban'ları
   bu modülü kullanır. Kart tasarımı, drag motoru (SortableJS), taşıma API'si,
   timer, ekle/sil/düzenle, özel kolon ve sütun sırala/boyutlandır TEK yerde.

   Kullanım:
     var kb = apya.kanban.create({
        projectId: '...'|null,        // null = global board (tüm projeler)
        editModal: <abp.ModalManager>,
        showProjectName: true|false,  // global'de kartta proje adı göster
        enableTimer: true,            // zaman sayacı butonları
        enableCustomColumns: bool,    // varsayılan: projectId != null
        getFilter: fn -> {},          // /Tasks filtreleri (assigneeId, statuses...)
        onChanged: fn,                // taşıma/sil/timer sonrası (liste yenile)
        canEdit: fn(task)->bool,      // varsayılan: ManageTeam || creator || assignee
        canDelete: fn(task)->bool
     });
     kb.load();
   Tasarım: /css/kanban.css · Markup: Pages/Shared/_KanbanBoard.cshtml
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.kanban) { return; }

    var SYS = { 1: 'kanban-todo', 2: 'kanban-inprogress', 3: 'kanban-inreview', 4: 'kanban-done' };

    function el(tag, cls) { var e = document.createElement(tag); if (cls) { e.className = cls; } return e; }
    function priorityAttr(p) { return (typeof p === 'number' ? p : 0) + 1; } // enum 0-3 -> css 1-4

    function create(opts) {
        opts = opts || {};
        var projectId = opts.projectId || null;
        var boardSel = opts.boardSelector || '.kanban-board';
        var showProject = !!opts.showProjectName;
        var enableTimer = opts.enableTimer !== false;
        var enableCols = (opts.enableCustomColumns != null) ? !!opts.enableCustomColumns : !!projectId;
        var editModal = opts.editModal || null;
        var getFilter = typeof opts.getFilter === 'function' ? opts.getFilter : function () { return {}; };
        var onChanged = typeof opts.onChanged === 'function' ? opts.onChanged : function () { };

        var taskSvc = apya.platform.tasks.task;
        var colSvc = apya.platform.projects.boardColumn;

        var sortables = [];
        var customIds = {};       // { columnId: true } özel kolonlar
        var configInited = false;

        function canEdit(t) {
            if (typeof opts.canEdit === 'function') { return opts.canEdit(t); }
            return abp.auth.isGranted('Platform.Projects.ManageTeam') ||
                   t.creatorId === abp.currentUser.id || t.assigneeId === abp.currentUser.id;
        }
        function canDelete(t) {
            if (typeof opts.canDelete === 'function') { return opts.canDelete(t); }
            return abp.auth.isGranted('Platform.Projects.ManageTeam') ||
                   t.creatorId === abp.currentUser.id || t.assigneeId === abp.currentUser.id;
        }

        // ── localStorage anahtarı (sırala/boyutlandır) ──
        function kbKey(s) { return 'apya-kanban-' + s + '-' + (projectId || 'global'); }
        function colToken(col) {
            var c = col.getAttribute('data-column-id-custom');
            if (c) { return 'c' + c; }
            return 's' + col.getAttribute('data-status-id');
        }

        // ── Kart (DOM, XSS-güvenli: dinamik metin textContent ile) ──
        function buildCard(task, activeLog) {
            var card = el('div', 'kanban-card shadow-sm');
            card.setAttribute('data-id', task.id);
            card.setAttribute('data-priority', priorityAttr(task.priority));

            var isDone = task.status === 4 || task.status === 0;
            if (task.dueDate && !isDone) {
                var diff = moment(task.dueDate).diff(moment(), 'hours');
                if (diff < 0) { card.classList.add('border-danger', 'border-2'); }
                else if (diff <= 48) { card.classList.add('border-warning', 'border-2'); }
            }
            var isActive = enableTimer && activeLog && activeLog.taskId === task.id;
            if (isActive) { card.classList.add('timer-active'); }

            // Üst satır: id rozeti + (proje adı / üst görev) + timer
            var top = el('div', 'd-flex justify-content-between align-items-start mb-1');
            var tagWrap = el('div', 'd-flex flex-column gap-1');
            var idBadge = el('small', 'text-muted border px-1 rounded bg-light');
            idBadge.style.fontSize = '0.72rem';
            idBadge.innerHTML = '<i class="fa fa-tag me-1"></i>#';
            idBadge.appendChild(document.createTextNode(('' + task.id).substring(0, 4)));
            tagWrap.appendChild(idBadge);

            if (showProject && task.projectName) {
                var pj = el('span', 'small fw-bold text-primary');
                pj.innerHTML = '<i class="fa fa-rocket me-1"></i>';
                pj.appendChild(document.createTextNode(task.projectName));
                tagWrap.appendChild(pj);
            }
            if (task.parentTaskTitle) {
                var pt = el('span', 'small text-primary');
                pt.innerHTML = '<i class="fa fa-level-up-alt fa-rotate-90 me-1"></i>';
                pt.appendChild(document.createTextNode(task.parentTaskTitle));
                tagWrap.appendChild(pt);
            }
            top.appendChild(tagWrap);

            if (enableTimer) {
                var tc = el('div', 'timer-controls');
                tc.innerHTML = isActive
                    ? '<button class="btn btn-sm btn-danger js-stop-timer p-1 px-2" data-id="' + task.id + '" title="Sayacı durdur"><i class="fa fa-pause fa-beat"></i></button>'
                    : '<button class="btn btn-sm btn-outline-success js-start-timer p-1 px-2" data-id="' + task.id + '" title="Sayacı başlat"><i class="fa fa-play"></i></button>';
                top.appendChild(tc);
            }
            card.appendChild(top);

            // Başlık
            var title = el('div', 'fw-bold mb-2 text-dark');
            title.textContent = task.title;
            card.appendChild(title);

            // Alt satır: atanan + bitiş
            var bottom = el('div', 'd-flex justify-content-between align-items-center flex-wrap gap-1');
            var who = el('div', 'small text-muted');
            who.innerHTML = '<i class="fa fa-user-circle me-1"></i>';
            who.appendChild(document.createTextNode(task.assigneeName || 'Atanmamış'));
            bottom.appendChild(who);

            if (task.dueDate) {
                var due = el('div', 'small');
                if (isDone) {
                    due.className = 'small text-success fw-bold';
                    due.innerHTML = '<i class="fa fa-check-circle me-1"></i>' + moment(task.dueDate).format('DD MMM');
                } else {
                    var d2 = moment(task.dueDate).diff(moment(), 'hours');
                    if (d2 < 0) { due.className = 'small text-white bg-danger px-2 py-1 rounded fw-bold heartbeat-animation'; due.innerHTML = '<i class="fa fa-exclamation-circle me-1"></i>Süresi Geçti (' + moment(task.dueDate).format('DD MMM') + ')'; }
                    else if (d2 <= 48) { due.className = 'small text-dark bg-warning px-2 py-1 rounded fw-bold'; due.innerHTML = '<i class="fa fa-clock me-1"></i>Yaklaşıyor (' + moment(task.dueDate).format('DD MMM') + ')'; }
                    else { due.className = 'small text-muted'; due.innerHTML = '<i class="fa fa-clock me-1"></i>' + moment(task.dueDate).format('DD MMM'); }
                }
                bottom.appendChild(due);
            }
            card.appendChild(bottom);

            // Aksiyonlar: düzenle + sil
            var actions = el('div', 'text-end mt-2 d-flex justify-content-end gap-1');
            if (canEdit(task)) {
                actions.innerHTML += '<button class="btn btn-sm btn-light py-0 px-2 rounded js-edit-task" data-id="' + task.id + '" title="Düzenle"><i class="fa fa-pencil-alt text-secondary" style="font-size:0.75rem;"></i></button>';
            }
            if (canDelete(task)) {
                actions.innerHTML += '<button class="btn btn-sm btn-light py-0 px-2 rounded js-delete-task" data-id="' + task.id + '" title="Sil"><i class="fa fa-trash text-danger" style="font-size:0.75rem;"></i></button>';
            }
            if (actions.childNodes.length) { card.appendChild(actions); }
            return card;
        }

        // ── Özel kolonları render et (sadece enableCols) ──
        function renderColumns(cols) {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            board.querySelectorAll('.js-custom-col, .js-add-col').forEach(function (n) { n.remove(); });
            customIds = {};

            // Sistem kolonlarına DB kolon-id'sini ata (drag → moveTaskToColumn)
            cols.forEach(function (c) {
                if (c.statusValue != null) {
                    var sys = board.querySelector('.kanban-column[data-status-id="' + c.statusValue + '"]');
                    if (sys) { sys.setAttribute('data-column-id', c.id); }
                }
            });
            // Özel kolonlar (statusValue=null)
            cols.filter(function (c) { return c.statusValue == null; })
                .sort(function (a, b) { return a.order - b.order; })
                .forEach(function (c) {
                    customIds[c.id] = true;
                    var col = el('div', 'kanban-column shadow-sm border js-custom-col');
                    col.setAttribute('data-column-id', c.id);
                    col.setAttribute('data-column-id-custom', c.id);
                    col.innerHTML =
                        '<div class="kanban-header">' +
                            '<span class="text-' + (c.colorClass || 'primary') + ' js-col-name"><i class="fa fa-circle me-2"></i></span>' +
                            '<span class="d-flex align-items-center gap-2">' +
                                '<span class="badge bg-' + (c.colorClass || 'primary') + ' rounded-pill kanban-count">0</span>' +
                                '<button type="button" class="btn btn-sm btn-link text-secondary p-0 js-col-rename" title="Yeniden adlandır"><i class="fa fa-pen"></i></button>' +
                                '<button type="button" class="btn btn-sm btn-link text-danger p-0 js-col-delete" title="Kolonu sil"><i class="fa fa-trash"></i></button>' +
                            '</span>' +
                        '</div>' +
                        '<div class="kanban-cards" id="kanban-col-' + c.id + '"></div>';
                    col.querySelector('.js-col-name').appendChild(document.createTextNode(' ' + c.name));
                    board.appendChild(col);
                });
            // "+ Kolon Ekle" karosu
            var add = el('div', 'kanban-column shadow-sm border js-add-col d-flex align-items-center justify-content-center text-primary fw-bold');
            add.style.cursor = 'pointer';
            add.innerHTML = '<span><i class="fa fa-plus me-2"></i>Kolon Ekle</span>';
            board.appendChild(add);
        }

        // ── Yükle ──
        function load() {
            if (enableCols && projectId) {
                colSvc.getListByProject(projectId).then(function (cols) {
                    renderColumns(cols);
                    fetchTasks();
                });
            } else {
                fetchTasks();
            }
        }

        function fetchTasks() {
            var filter = $.extend({ maxResultCount: 1000 }, getFilter());
            if (projectId) { filter.projectId = projectId; }
            var calls = [taskSvc.getList(filter)];
            calls.push(enableTimer ? taskSvc.getActiveTimeLog() : Promise.resolve(null));
            Promise.all(calls).then(function (res) { render(res[0].items, res[1]); });
        }

        function render(tasks, activeLog) {
            document.querySelectorAll(boardSel + ' .kanban-cards').forEach(function (n) { n.innerHTML = ''; });
            tasks.forEach(function (task) {
                var container = null;
                if (task.boardColumnId && customIds[task.boardColumnId]) {
                    container = document.getElementById('kanban-col-' + task.boardColumnId);
                }
                if (!container) { container = document.getElementById(SYS[task.status]); }
                if (container) { container.appendChild(buildCard(task, activeLog)); }
            });
            updateCounts();
            initSortable();
            ensureColumnConfig();
            applyLayout();
        }

        function updateCounts() {
            document.querySelectorAll(boardSel + ' .kanban-column').forEach(function (col) {
                var b = col.querySelector('.kanban-count');
                if (b) { b.textContent = col.querySelectorAll('.kanban-cards .kanban-card').length; }
            });
        }

        // ── Kart sürükle-bırak ──
        function initSortable() {
            sortables.forEach(function (s) { s.destroy(); });
            sortables = [];
            document.querySelectorAll(boardSel + ' .kanban-cards').forEach(function (colCards) {
                sortables.push(new Sortable(colCards, {
                    group: 'apya-kanban-cards',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    onEnd: function (evt) {
                        if (evt.from === evt.to) { return; }
                        var taskId = $(evt.item).data('id');
                        var col = $(evt.to).closest('.kanban-column');
                        var columnId = col.attr('data-column-id');
                        var statusId = col.attr('data-status-id');
                        var promise;
                        if (columnId) { promise = colSvc.moveTaskToColumn(taskId, columnId); }
                        else if (statusId) { promise = taskSvc.updateStatus(taskId, parseInt(statusId)); }
                        else { return; }
                        promise.then(function () {
                            abp.notify.success('Görev taşındı.');
                            updateCounts();
                            onChanged();
                        }).catch(function () {
                            abp.notify.error('Görev taşınamadı.');
                            load();
                        });
                    }
                }));
            });
        }

        // ── Sütun sırala (header drag) + boyutlandır (sağ kenar) — localStorage ──
        function applyLayout() {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            try {
                var order = JSON.parse(localStorage.getItem(kbKey('order')) || 'null');
                if (order && order.length) {
                    order.forEach(function (tok) {
                        var col = colByToken(board, tok);
                        if (col) { board.appendChild(col); }
                    });
                    var addTile = board.querySelector('.js-add-col');
                    if (addTile) { board.appendChild(addTile); } // ekle karosu sona
                }
            } catch (e) { }
            board.querySelectorAll('.kanban-column').forEach(function (col) {
                var w = localStorage.getItem(kbKey('w-' + colToken(col)));
                if (w) { col.style.flexBasis = w + 'px'; }
            });
        }
        function colByToken(board, tok) {
            if (tok.charAt(0) === 'c') { return board.querySelector('.kanban-column[data-column-id-custom="' + tok.substring(1) + '"]'); }
            return board.querySelector('.kanban-column[data-status-id="' + tok.substring(1) + '"]');
        }

        function ensureColumnConfig() {
            var board = document.querySelector(boardSel);
            if (!board || typeof Sortable === 'undefined') { return; }
            if (!configInited) {
                configInited = true;
                new Sortable(board, {
                    draggable: '.kanban-column:not(.js-add-col)',
                    handle: '.kanban-header',
                    animation: 150,
                    ghostClass: 'kanban-col-ghost',
                    onEnd: function () {
                        var order = Array.prototype.map.call(
                            board.querySelectorAll('.kanban-column:not(.js-add-col)'),
                            function (c) { return colToken(c); });
                        try { localStorage.setItem(kbKey('order'), JSON.stringify(order)); } catch (e) { }
                    }
                });
            }
            // Boyutlandırma tutamağı (eksik olan kolonlara ekle)
            board.querySelectorAll('.kanban-column:not(.js-add-col)').forEach(function (col) {
                if (col.querySelector('.kanban-resize-handle')) { return; }
                var handle = el('div', 'kanban-resize-handle');
                handle.title = 'Sürükleyerek genişliği ayarla';
                col.appendChild(handle);
                handle.addEventListener('mousedown', function (e) {
                    e.preventDefault(); e.stopPropagation();
                    var startX = e.clientX, startW = col.getBoundingClientRect().width;
                    function mv(ev) { col.style.flexBasis = Math.max(240, Math.min(640, startW + (ev.clientX - startX))) + 'px'; }
                    function up() {
                        document.removeEventListener('mousemove', mv);
                        document.removeEventListener('mouseup', up);
                        try { localStorage.setItem(kbKey('w-' + colToken(col)), Math.round(col.getBoundingClientRect().width)); } catch (e) { }
                    }
                    document.addEventListener('mousemove', mv);
                    document.addEventListener('mouseup', up);
                });
            });
        }

        // ── Olay bağlamaları (delege; board kapsamında) ──
        var $doc = $(document);
        function inThisBoard(node) {
            var b = document.querySelector(boardSel);
            return b && b.contains(node);
        }

        $doc.on('click', boardSel + ' .js-edit-task', function () {
            if (editModal) { editModal.open({ id: $(this).data('id') }); }
        });
        $doc.on('click', boardSel + ' .kanban-card', function (e) {
            if (e.target.closest('.btn')) { return; }
            if (editModal) { editModal.open({ id: $(this).data('id') }); }
        });
        $doc.on('click', boardSel + ' .js-delete-task', function (e) {
            e.stopPropagation();
            var id = $(this).data('id');
            Swal.fire({
                title: 'Görev Silinecek!',
                text: 'Görevi kalıcı olarak silmek üzeresiniz. Onaylamak için aşağıdaki alana "SİL" yazmalısınız.',
                icon: 'warning', input: 'text', inputPlaceholder: 'SİL',
                showCancelButton: true, confirmButtonText: '<i class="fa fa-trash"></i> Evet, Sil!',
                cancelButtonText: 'İptal', confirmButtonColor: '#dc3545',
                preConfirm: function (v) { if (v !== 'SİL') { Swal.showValidationMessage('Onaylamak için tam olarak "SİL" yazın.'); } return v; }
            }).then(function (r) {
                if (r.isConfirmed) {
                    taskSvc.delete(id).then(function () { abp.notify.info('Başarıyla silindi.'); load(); onChanged(); });
                }
            });
        });

        // Timer
        $doc.on('click', boardSel + ' .js-start-timer', function (e) {
            e.stopPropagation();
            var $b = $(this); if ($b.prop('disabled')) { return; }
            $b.prop('disabled', true); abp.ui.setBusy($b);
            taskSvc.startTimeTracking($b.data('id')).then(function () { abp.notify.success('Sayaç başlatıldı.'); load(); }).always(function () { abp.ui.clearBusy($b); });
        });
        $doc.on('click', boardSel + ' .js-stop-timer', function (e) {
            e.stopPropagation();
            var $b = $(this); if ($b.prop('disabled')) { return; }
            $b.prop('disabled', true); abp.ui.setBusy($b);
            taskSvc.stopTimeTracking($b.data('id')).then(function () { abp.notify.success('Sayaç durduruldu.'); load(); }).always(function () { abp.ui.clearBusy($b); });
        });

        // Özel kolon ekle / sil / yeniden adlandır
        if (enableCols && projectId) {
            $doc.on('click', boardSel + ' .js-add-col', function () {
                var name = window.prompt('Yeni kolon adı:');
                if (!name || !name.trim()) { return; }
                colSvc.create({ projectId: projectId, name: name.trim(), colorClass: 'primary' })
                    .then(function () { abp.notify.success('Kolon eklendi.'); load(); });
            });
            $doc.on('click', boardSel + ' .js-col-delete', function () {
                var id = $(this).closest('.kanban-column').data('column-id');
                abp.message.confirm('Bu kolonu silmek istediğinize emin misiniz? İçindeki görevler durumlarına göre varsayılan kolonlara döner.', 'Kolonu Sil', function (ok) {
                    if (!ok) { return; }
                    colSvc.delete(id).then(function () { abp.notify.info('Kolon silindi.'); load(); });
                });
            });
            $doc.on('click', boardSel + ' .js-col-rename', function () {
                var $col = $(this).closest('.kanban-column');
                var id = $col.data('column-id');
                var name = window.prompt('Kolon adı:', $col.find('.js-col-name').text().trim());
                if (!name || !name.trim()) { return; }
                colSvc.update(id, { name: name.trim(), colorClass: 'primary' }).then(function () { load(); });
            });
        }

        if (editModal && editModal.onResult) { editModal.onResult(function () { load(); onChanged(); }); }

        return { load: load, reload: load };
    }

    apya.kanban = { create: create };
})();
