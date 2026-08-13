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

    // Ad sorma — window.prompt yerine repo deseni (SweetAlert). prompt tarayıcıyı
    // kilitliyor, mobilde kırpılıyor ve tema dışı görünüyordu.
    function askName(title, current, done) {
        Swal.fire({
            title: title,
            input: 'text',
            inputValue: current || '',
            showCancelButton: true,
            confirmButtonText: 'Kaydet',
            cancelButtonText: 'Vazgeç',
            preConfirm: function (v) {
                if (!v || !v.trim()) { Swal.showValidationMessage('Bir ad girin.'); }
                return v;
            }
        }).then(function (r) { if (r.isConfirmed) { done(r.value.trim()); } });
    }

    // Özel kolon colorClass (Bootstrap renk adı, kullanıcı seçimi) -> apya-chip tone.
    var COLOR_TONE = { primary: 'brand', success: 'positive', danger: 'negative', warning: 'warning', info: 'brand', secondary: 'neutral', dark: 'neutral' };
    function colorTone(colorClass) { return COLOR_TONE[colorClass] || 'brand'; }
    // Kolon ⋯ menüsündeki renk seçenekleri (BoardColumn.ColorClass değerleri).
    var COLOR_CHOICES = ['primary', 'success', 'warning', 'danger', 'info', 'secondary'];
    function colorSwatches(current) {
        return COLOR_CHOICES.map(function (c) {
            return '<button type="button" class="kanban-col-swatch text-' + c + ' js-col-color" data-color="' + c +
                '" aria-pressed="' + (c === (current || 'primary')) + '" title="' + c + '" aria-label="Renk: ' + c + '">' +
                '<i class="fa fa-circle"></i></button>';
        }).join('');
    }
    // TaskPriority enum (Low=1..Critical=4) doğrudan kanban.css [data-priority="1..4"] ile eşleşir.
    function priorityAttr(p) { return (typeof p === 'number' && p >= 1) ? p : 2; } // varsayılan Medium=2

    function create(opts) {
        opts = opts || {};
        // projectId artık DİNAMİK: setProject(pid) ile değişebilir (global board'larda
        // proje seçici). Proje seçiliyse o projenin özel kolonları + Kolon Ekle gelir.
        var projectId = opts.projectId || null;
        var boardSel = opts.boardSelector || '.kanban-board';
        var showProject = !!opts.showProjectName;
        // Timer (zaman sayacı) opt-in ve varsayılan KAPALI. Kullanıcı kararıyla her
        // board'da gizli (2026-06-11). İleride permission ile açmak için:
        //   enableTimer: abp.auth.isGranted('Platform.Tasks.TimeTracking')
        var enableTimer = opts.enableTimer === true;
        // Özel kolonlara izin (false ise asla); izin varsa AKTİF projede çalışır.
        var customColumnsAllowed = opts.enableCustomColumns !== false;
        function effectiveCols() { return customColumnsAllowed && !!projectId; }
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

            // Başlık — text-dark KOYMA: .kanban-card kendi bg'sine göre (light/dark)
            // doğru metin rengini zaten ambient/body'den miras alır; text-dark sabit
            // koyu renk zorlayıp dark'ta görünmez yapıyordu.
            var title = el('div', 'fw-bold mb-2');
            title.textContent = task.title;
            card.appendChild(title);

            // Etiketler — apyaTask.tagChips kendi içinde escape ediyor (güvenli).
            if (window.apyaTask && task.tags && task.tags.length) {
                var tagsRow = el('div', 'mb-2');
                tagsRow.innerHTML = window.apyaTask.tagChips(task.tags);
                card.appendChild(tagsRow);
            }

            // Alt satır: atanan + bitiş
            var bottom = el('div', 'd-flex justify-content-between align-items-center flex-wrap gap-1');
            var who = el('div', 'small text-muted');
            who.innerHTML = '<i class="fa fa-user-circle me-1"></i>';
            who.appendChild(document.createTextNode(task.assigneeName || 'Atanmamış'));
            bottom.appendChild(who);

            // Done ise BİTİŞ = gerçek tamamlanma günü (completedDate); eski kayıtlarda
            // completedDate yoksa deadline'a düş. Done değilse deadline (renk/uyarı) göster.
            var doneDate = isDone ? (task.completedDate || task.dueDate) : null;
            if (isDone && doneDate) {
                var doneEl = el('div', 'small text-success fw-bold');
                doneEl.innerHTML = '<i class="fa fa-check-circle me-1"></i>' + moment(doneDate).format('DD MMM');
                bottom.appendChild(doneEl);
            } else if (!isDone && task.dueDate) {
                var due = el('div', 'small');
                var d2 = moment(task.dueDate).diff(moment(), 'hours');
                if (d2 < 0) { due.className = 'apya-chip apya-chip-negative heartbeat-animation'; due.innerHTML = '<i class="fa fa-exclamation-circle me-1"></i>Süresi Geçti (' + moment(task.dueDate).format('DD MMM') + ')'; }
                else if (d2 <= 48) { due.className = 'apya-chip apya-chip-warning'; due.innerHTML = '<i class="fa fa-clock me-1"></i>Yaklaşıyor (' + moment(task.dueDate).format('DD MMM') + ')'; }
                else { due.className = 'small text-muted'; due.innerHTML = '<i class="fa fa-clock me-1"></i>' + moment(task.dueDate).format('DD MMM'); }
                bottom.appendChild(due);
            }
            card.appendChild(bottom);

            // Aksiyonlar: düzenle + sil
            var actions = el('div', 'apya-touch-actions text-end mt-2 d-flex justify-content-end gap-1');
            if (canEdit(task)) {
                actions.innerHTML += '<button class="btn btn-sm btn-light py-0 px-2 rounded js-edit-task" data-id="' + task.id + '" title="Düzenle" aria-label="Görevi düzenle"><i class="fa fa-pencil-alt text-secondary" style="font-size:0.75rem;"></i></button>';
            }
            if (canDelete(task)) {
                actions.innerHTML += '<button class="btn btn-sm btn-light py-0 px-2 rounded js-delete-task" data-id="' + task.id + '" title="Sil" aria-label="Görevi sil"><i class="fa fa-trash text-danger" style="font-size:0.75rem;"></i></button>';
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
                    // Mevcut renk DOM'da taşınır: UpdateBoardColumnDto ad VE rengi
                    // BİRLİKTE ister; biri okunmadan gönderilirse diğeri sıfırlanır
                    // (eski kod yeniden adlandırmada rengi hep 'primary' yapıyordu).
                    col.setAttribute('data-column-color', c.colorClass || 'primary');
                    if (c.wipLimit) { col.setAttribute('data-wip-limit', c.wipLimit); }
                    col.innerHTML =
                        '<div class="kanban-header">' +
                            '<span class="text-' + (c.colorClass || 'primary') + ' js-col-name"><i class="fa fa-circle me-2"></i></span>' +
                            '<span class="d-flex align-items-center gap-2 apya-touch-actions">' +
                                '<span class="apya-chip apya-chip-' + colorTone(c.colorClass) + ' kanban-count">0</span>' +
                                '<span class="kanban-wip' + (c.wipLimit ? '' : ' d-none') + '" title="WIP limiti"></span>' +
                                '<span class="dropdown">' +
                                    '<button type="button" class="kanban-col-menu" data-bs-toggle="dropdown" aria-expanded="false" title="Kolon ayarları" aria-label="Kolon ayarları"><i class="fa fa-ellipsis"></i></button>' +
                                    '<div class="dropdown-menu dropdown-menu-end apya-console-menu">' +
                                        '<button type="button" class="apya-console-menu-item js-col-rename">' +
                                            '<span class="apya-console-menu-icon"><i class="fa fa-pen"></i></span>Yeniden adlandır</button>' +
                                        '<div class="apya-console-menu-head is-divided">Renk</div>' +
                                        '<div class="kanban-col-colors">' + colorSwatches(c.colorClass) + '</div>' +
                                        '<div class="apya-console-menu-head is-divided">WIP limiti</div>' +
                                        '<div class="kanban-col-wip-row">' +
                                            '<input type="number" min="0" max="999" class="js-col-wip" ' +
                                                'value="' + (c.wipLimit || '') + '" placeholder="limit yok" ' +
                                                'aria-label="WIP limiti" />' +
                                            '<button type="button" class="kanban-col-wip-save js-col-wip-save">Kaydet</button>' +
                                        '</div>' +
                                        '<button type="button" class="apya-console-menu-item is-danger js-col-delete">' +
                                            '<span class="apya-console-menu-icon"><i class="fa fa-trash"></i></span>Kolonu sil</button>' +
                                    '</div>' +
                                '</span>' +
                            '</span>' +
                        '</div>' +
                        '<div class="kanban-cards" id="kanban-col-' + c.id + '"></div>';
                    col.querySelector('.js-col-name').appendChild(document.createTextNode(' ' + c.name));
                    board.appendChild(col);
                });
            // "Kolon ekle" hayalet kolonu (handoff: kesik çizgili, dar)
            var add = el('div', 'kanban-column js-add-col kanban-add-col');
            add.innerHTML = '<i class="fa fa-plus"></i>' +
                '<span class="kanban-add-col-title">Kolon ekle</span>' +
                '<span class="kanban-add-col-sub">özel kolon · durum eşlemesi</span>';
            board.appendChild(add);
        }

        // Global moda dönerken (proje seçimi kalkınca) özel kolonları + Kolon Ekle
        // karosunu DOM'dan temizle ve sistem kolonlarının DB kolon-id'lerini sıfırla
        // (drag tekrar status ile taşınsın).
        function clearCustomColumns() {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            board.querySelectorAll('.js-custom-col, .js-add-col').forEach(function (n) { n.remove(); });
            board.querySelectorAll('.kanban-column[data-column-id]').forEach(function (c) { c.removeAttribute('data-column-id'); });
            customIds = {};
        }

        // ── Yükle ──
        function load() {
            if (effectiveCols()) {
                colSvc.getListByProject(projectId).then(function (cols) {
                    renderColumns(cols);
                    fetchTasks();
                });
            } else {
                clearCustomColumns();
                fetchTasks();
            }
        }

        // Aktif projeyi değiştir (global board proje seçici). null → global görünüm.
        function setProject(pid) {
            projectId = pid || null;
            load();
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
                var n = col.querySelectorAll('.kanban-cards .kanban-card').length;
                var b = col.querySelector('.kanban-count');
                if (b) { b.textContent = n; }

                // WIP rozeti: "n / limit". Aşımda negatif tona geçer — limit sert
                // kısıt değil, uyarı sinyalidir (bkz. BoardColumn.WipLimit).
                var wipEl = col.querySelector('.kanban-wip');
                if (!wipEl) { return; }
                var limit = parseInt(col.getAttribute('data-wip-limit'), 10);
                if (!limit) {
                    wipEl.classList.add('d-none');
                    return;
                }
                wipEl.classList.remove('d-none');
                wipEl.textContent = n + ' / ' + limit;
                wipEl.classList.toggle('is-over', n > limit);
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
                    // Dokunmatikte board yatay overflow-x:auto ile kaydırılıyor;
                    // gecikme'siz sürükleme bir kartın üstünden yana kaydırma
                    // hareketini anında "drag" sanıyordu (2026-08 tasarım denetimi).
                    // delayOnTouchOnly: true → fare kullanıcıları etkilenmez.
                    delay: 150,
                    delayOnTouchOnly: true,
                    touchStartThreshold: 5,
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

        // UpdateBoardColumnDto ad + renk + WIP'i BİRLİKTE ister: yalnız birini
        // gönderirsen diğerleri sıfırlanır. Bu yüzden her güncelleme mevcut
        // değerleri DOM'dan okuyup yalnız değişeni ezer (tek giriş noktası).
        function saveColumn($col, patch) {
            if (!projectId) { return; }
            var current = {
                name: $col.find('.js-col-name').text().trim(),
                colorClass: $col.data('column-color') || 'primary',
                wipLimit: parseInt($col.attr('data-wip-limit'), 10) || null
            };
            colSvc.update($col.data('column-id'), $.extend(current, patch))
                .then(function () { load(); });
        }

        // Özel kolon ekle / sil / yeniden adlandır — izin varsa bağla; aktif proje
        // yoksa karo/butonlar zaten DOM'da olmaz (guard çift güvence).
        if (customColumnsAllowed) {
            $doc.on('click', boardSel + ' .js-add-col', function () {
                if (!projectId) { return; }
                askName('Yeni kolon', '', function (name) {
                    colSvc.create({ projectId: projectId, name: name, colorClass: 'primary' })
                        .then(function () { abp.notify.success('Kolon eklendi.'); load(); });
                });
            });
            $doc.on('click', boardSel + ' .js-col-delete', function () {
                if (!projectId) { return; }
                var id = $(this).closest('.kanban-column').data('column-id');
                abp.message.confirm('Bu kolonu silmek istediğinize emin misiniz? İçindeki görevler durumlarına göre varsayılan kolonlara döner.', 'Kolonu Sil', function (ok) {
                    if (!ok) { return; }
                    colSvc.delete(id).then(function () { abp.notify.info('Kolon silindi.'); load(); });
                });
            });
            $doc.on('click', boardSel + ' .js-col-rename', function () {
                if (!projectId) { return; }
                var $col = $(this).closest('.kanban-column');
                var id = $col.data('column-id');
                askName('Kolon adı', $col.find('.js-col-name').text().trim(), function (name) {
                    saveColumn($col, { name: name });
                });
            });

            $doc.on('click', boardSel + ' .js-col-color', function () {
                saveColumn($(this).closest('.kanban-column'), { colorClass: $(this).data('color') });
            });

            $doc.on('click', boardSel + ' .js-col-wip-save', function () {
                var $col = $(this).closest('.kanban-column');
                var raw = $col.find('.js-col-wip').val();
                var limit = raw === '' ? null : parseInt(raw, 10);
                if (limit !== null && (isNaN(limit) || limit < 0)) {
                    abp.notify.warn('WIP limiti 0 veya daha büyük bir sayı olmalı.');
                    return;
                }
                saveColumn($col, { wipLimit: limit });
            });
        }

        if (editModal && editModal.onResult) { editModal.onResult(function () { load(); onChanged(); }); }

        return {
            load: load,
            reload: load,
            setProject: setProject,
            getProjectId: function () { return projectId; }
        };
    }

    apya.kanban = { create: create };
})();
