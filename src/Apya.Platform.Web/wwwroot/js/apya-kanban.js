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
        createModal: <abp.ModalManager>, // kolon başlığındaki ＋ (yoksa çizilmez)
        showProjectName: true|false,  // global'de kartta proje adı göster
        enableTimer: true,            // zaman sayacı butonları
        enableCustomColumns: bool,    // varsayılan: projectId != null
        canEditColumns: bool,         // varsayılan: Projects.Edit izni (⋯ menüsü + Kolon ekle)
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
    // Swal html'ine kullanıcı girdisi (kolon/görev adı) basılıyor — kaçış şart.
    function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

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
        // Kolon DÜZENLEME yetkisi ayrıdır: özel kolonlar herkese GÖRÜNÜR (kartlar
        // orada durur), ama ⋯ menüsü ve "Kolon ekle" karosu yalnız Projects.Edit
        // ile çizilir. Eskiden hiç kontrol yoktu; yetkisiz kullanıcı düğmeleri
        // görüyor, tıklayınca API 403 dönüyordu.
        var canEditColumns = (typeof opts.canEditColumns === 'boolean')
            ? opts.canEditColumns
            : abp.auth.isGranted('Platform.Projects.Edit');
        var editModal = opts.editModal || null;
        // Kolon başlığındaki ＋ bunu kullanır; verilmezse düğme hiç çizilmez.
        var createModal = opts.createModal || null;
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
            // Kolon silme onayı kartın döneceği durum kolonunu bundan bulur.
            card.setAttribute('data-status', task.status);

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
            idBadge.innerHTML = '<i class="fa fa-tag me-1"></i>';
            // Kullanıcıya görünen kod ("GRV-17") — liste satırıyla aynı kimlik.
            // Eski payload'da code yoksa GUID kısaltmasına düş.
            idBadge.appendChild(document.createTextNode(
                task.code || ('#' + ('' + task.id).substring(0, 4))));
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

        // ── Kolonlar: sistem + özel TEK üreteçten ────────────────────────────
        // Sistem kolonları da (ad/renk/WIP) DB'den gelir. Eskiden markup'ta sabit
        // yazdıkları için DB'deki ad hiç görünmüyor, ⋯ menüsü de basılmıyordu:
        // "sistem kolonunu yeniden adlandır" UI'da imkânsızdı.
        var SYS_DEFAULT_COLOR = { 1: 'secondary', 2: 'warning', 3: 'info', 4: 'success' };

        // Proje seçili DEĞİLKEN (genel pano "Tümü") BoardColumn kaydı yoktur; adlar
        // _KanbanBoard.cshtml'deki data-col-* niteliklerinden okunur → adlandırma
        // tek kaynaktan (Tasks:Status:*) gelir, JS'te ikinci bir Türkçe kopya yok.
        function defaultColumns(board) {
            return [1, 2, 3, 4].map(function (sv) {
                return {
                    id: null, statusValue: sv, isSystem: true, order: sv - 1, wipLimit: null,
                    name: board.getAttribute('data-col-' + sv) || '',
                    colorClass: SYS_DEFAULT_COLOR[sv]
                };
            });
        }

        // Boş kolon metni — sürükleme hedefi görünür kalsın diye kolonun kendi dilinde.
        var EMPTY_TEXT = {
            1: ['Sırada iş yok', 'Yeni bir görev ekleyerek başla.'],
            2: ['Henüz iş başlamadı', 'Kart sürükleyerek buraya taşı ya da sıradaki bir işe başla.'],
            3: ['Test bekleyen iş yok', ''],
            4: ['Henüz kapatılan görev yok', '']
        };
        function buildEmptyState(statusValue) {
            var t = EMPTY_TEXT[statusValue] || ['Bu kolon boş', 'Kartları buraya sürükleyebilirsin.'];
            var box = el('div', 'kanban-empty');
            var title = el('div', 'kanban-empty-title');
            title.textContent = t[0];
            box.appendChild(title);
            if (t[1]) {
                var sub = el('div', 'kanban-empty-sub');
                sub.textContent = t[1];
                box.appendChild(sub);
            }
            return box;
        }

        // ⋯ menüsü. Sistem kolonunda SİL kilitli görünür (StatusValue'ya bağlı, API de
        // reddeder) — kullanıcıya yeniden adlandırma alternatifi kalır.
        function columnMenuHtml(c) {
            if (!canEditColumns || !c.id) { return ''; }
            var del = c.isSystem
                ? '<div class="apya-console-menu-item is-locked js-col-delete-locked" aria-disabled="true" ' +
                      'title="Sistem kolonu görev durumuna bağlıdır; silinemez, yeniden adlandırılabilir">' +
                      '<span class="apya-console-menu-icon"><i class="fa fa-lock"></i></span>Kolonu sil</div>'
                : '<button type="button" class="apya-console-menu-item is-danger js-col-delete">' +
                      '<span class="apya-console-menu-icon"><i class="fa fa-trash"></i></span>Kolonu sil</button>';
            return '<span class="dropdown">' +
                '<button type="button" class="kanban-col-menu" data-bs-toggle="dropdown" aria-expanded="false" title="Kolon ayarları" aria-label="Kolon ayarları"><i class="fa fa-ellipsis"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-end apya-console-menu">' +
                    '<button type="button" class="apya-console-menu-item js-col-rename">' +
                        '<span class="apya-console-menu-icon"><i class="fa fa-pen"></i></span>Yeniden adlandır</button>' +
                    '<div class="apya-console-menu-head is-divided">Renk</div>' +
                    '<div class="kanban-col-colors">' + colorSwatches(c.colorClass) + '</div>' +
                    '<div class="apya-console-menu-head is-divided">WIP limiti</div>' +
                    '<div class="kanban-col-wip-row">' +
                        '<input type="number" min="0" max="999" class="js-col-wip" ' +
                            'value="' + (c.wipLimit || '') + '" placeholder="limit yok" aria-label="WIP limiti" />' +
                        '<button type="button" class="kanban-col-wip-save js-col-wip-save">Kaydet</button>' +
                    '</div>' +
                    del +
                '</div>' +
            '</span>';
        }

        // Tek kolon elemanı. Sistem kolonunun kart kabı SYS id'siyle doğar
        // (render() görevleri hâlâ statüye göre oraya yerleştiriyor).
        function buildColumn(c) {
            var isSys = c.statusValue != null;
            var col = el('div', 'kanban-column shadow-sm border' + (isSys ? '' : ' js-custom-col'));
            if (isSys) { col.setAttribute('data-status-id', c.statusValue); }
            else { col.setAttribute('data-column-id-custom', c.id); }
            if (c.id) { col.setAttribute('data-column-id', c.id); }
            // Mevcut renk DOM'da taşınır: UpdateBoardColumnDto ad VE rengi BİRLİKTE
            // ister; biri okunmadan gönderilirse diğeri sıfırlanır.
            col.setAttribute('data-column-color', c.colorClass || 'primary');
            if (c.wipLimit) { col.setAttribute('data-wip-limit', c.wipLimit); }

            // Renk YALNIZ noktada: başlık metni nötr kalır. (Bootstrap text-* utility'si
            // dark temada -emphasis kalıntısı bırakıyordu; renk artık CSS'te
            // [data-column-color] üzerinden token'a bağlı.)
            var addBtn = (createModal && projectId)
                ? '<button type="button" class="kanban-col-add js-col-add-task" title="Bu kolona görev ekle" aria-label="Bu kolona görev ekle"><i class="fa fa-plus"></i></button>'
                : '';
            col.innerHTML =
                '<div class="kanban-header">' +
                    '<span class="kanban-title js-col-name' + (canEditColumns && c.id ? ' is-editable' : '') +
                        '" title="' + (canEditColumns && c.id ? 'Adı düzenlemek için tıkla' : '') + '">' +
                        '<i class="fa fa-circle me-2"></i></span>' +
                    '<span class="d-flex align-items-center gap-2 apya-touch-actions">' +
                        '<span class="apya-chip apya-chip-' + colorTone(c.colorClass) + ' kanban-count">0</span>' +
                        '<span class="kanban-wip' + (c.wipLimit ? '' : ' d-none') + '" title="WIP limiti"></span>' +
                        addBtn +
                        columnMenuHtml(c) +
                    '</span>' +
                '</div>' +
                '<div class="kanban-cards"></div>';
            // Ad textContent ile: XSS-güvenli (kolon adı kullanıcı girdisi).
            col.querySelector('.js-col-name').appendChild(document.createTextNode(' ' + c.name));
            col.querySelector('.kanban-cards').id = isSys ? SYS[c.statusValue] : ('kanban-col-' + c.id);
            return col;
        }

        // Hedef durum kolonunun ADI board'dan okunur — JS'te ikinci bir durum
        // sözlüğü tutulmaz (adlandırma tek kaynaktan gelsin).
        function statusColumnName(statusValue) {
            var col = document.querySelector(boardSel + ' .kanban-column[data-status-id="' + statusValue + '"]');
            var n = col && col.querySelector('.js-col-name');
            return n ? n.textContent.trim() : ('Durum ' + statusValue);
        }

        // Silme onayının gövdesi: kaç görev var ve hangi kolona dönecekler.
        // Kolon silinince görevler MoveToColumn(null) ile durum kolonuna döner.
        function buildDeletePreview(cards) {
            if (!cards.length) {
                return '<p class="kanban-del-note">Kolon boş; silmek hiçbir görevi etkilemez.</p>';
            }
            var shown = Array.prototype.slice.call(cards, 0, 8);
            var rows = shown.map(function (card) {
                var codeEl = card.querySelector('small');
                var titleEl = card.querySelector('.fw-bold');
                return '<li>' +
                    '<span class="kanban-del-code">' + esc(codeEl ? codeEl.textContent.trim() : '') + '</span>' +
                    '<span class="kanban-del-title">' + esc(titleEl ? titleEl.textContent : '') + '</span>' +
                    '<span class="kanban-del-target">→ ' + esc(statusColumnName(card.getAttribute('data-status'))) + '</span>' +
                    '</li>';
            }).join('');
            var more = cards.length > shown.length
                ? '<li class="kanban-del-more">+' + (cards.length - shown.length) + ' görev daha</li>'
                : '';
            return '<p class="kanban-del-note">Kolon kalkar, içindeki <b>' + cards.length +
                ' görev silinmez</b> — durumlarına göre varsayılan kolona döner.</p>' +
                '<ul class="kanban-del-list">' + rows + more + '</ul>';
        }

        // Yerinde ad düzenleme (mockup 3a): Enter kaydeder, Esc iptal eder, 64
        // karakter sayacı görünür (BoardColumn.Name sınırı). SweetAlert kutusunun
        // yerini alır — başlığa tıklayınca ya da ⋯ → "Yeniden adlandır" ile açılır.
        function startRename(colEl) {
            if (!colEl || !projectId || !canEditColumns) { return; }
            if (!colEl.getAttribute('data-column-id')) { return; }  // DB kaydı yoksa düzenlenemez
            var nameEl = colEl.querySelector('.js-col-name');
            if (!nameEl || colEl.querySelector('.kanban-col-rename')) { return; }

            var current = nameEl.textContent.trim();
            var box = el('span', 'kanban-col-rename');
            var input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 64;
            input.value = current;
            input.className = 'kanban-col-name-input';
            input.setAttribute('aria-label', 'Kolon adı');
            var counter = el('span', 'kanban-col-name-counter');
            function sync() { counter.textContent = input.value.length + '/64'; }
            sync();
            box.appendChild(input);
            box.appendChild(counter);
            nameEl.style.display = 'none';
            nameEl.parentNode.insertBefore(box, nameEl);

            function close() { box.remove(); nameEl.style.display = ''; }
            input.addEventListener('input', sync);
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var v = input.value.trim();
                    close();
                    if (v && v !== current) { saveColumn($(colEl), { name: v }); }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    close();
                }
            });
            input.addEventListener('blur', close); // blur = iptal; kaydeden tuş Enter
            input.focus();
            input.select();
        }

        // Board'u baştan kurar. Sıra: DB Order (sistem ve özel kolonlar aynı listede).
        function renderColumns(cols) {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            board.innerHTML = '';
            customIds = {};

            cols.slice().sort(function (a, b) { return a.order - b.order; }).forEach(function (c) {
                if (c.statusValue == null) { customIds[c.id] = true; }
                board.appendChild(buildColumn(c));
            });

            // "Kolon ekle" hayalet kolonu (handoff: kesik çizgili, dar) — yalnız
            // yetkiliye ve yalnız proje seçiliyken (özel kolon projeye aittir).
            if (canEditColumns && effectiveCols()) {
                var add = el('div', 'kanban-column js-add-col kanban-add-col');
                add.innerHTML = '<i class="fa fa-plus"></i>' +
                    '<span class="kanban-add-col-title">Kolon ekle</span>' +
                    '<span class="kanban-add-col-sub">özel kolon · durum eşlemesi</span>';
                board.appendChild(add);
            } else if (canEditColumns && customColumnsAllowed) {
                // Genel panoda proje seçilmemiş: kolon yönetimi neden yok, tek satırda söyle.
                var note = el('div', 'kanban-column kanban-note-col');
                note.innerHTML = '<i class="fa fa-circle-info"></i>' +
                    '<span class="kanban-add-col-title">Özel kolonlar projeye ait</span>' +
                    '<span class="kanban-add-col-sub">Kolon eklemek ya da düzenlemek için yukarıdan bir proje seç.</span>';
                board.appendChild(note);
            }
        }

        // ── Yükle ──
        // Proje seçiliyse kolonlar DB'den (sistem + özel), değilse partial'daki
        // varsayılan adlardan kurulur. Her iki yolda da board baştan çizilir —
        // böylece proje değiştirince bayat kolon/limit kalmaz.
        function load() {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            if (effectiveCols()) {
                colSvc.getListByProject(projectId).then(function (cols) {
                    renderColumns(cols);
                    fetchTasks();
                });
            } else {
                renderColumns(defaultColumns(board));
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

        // Sayaç + WIP + boş metin: kolon başlığının kartlarla senkronu TEK yerde.
        // Sürükleme sonrası da çağrılır — boş kolona kart bırakılınca metin kalkar,
        // son kart çıkınca geri gelir (yeniden yükleme beklemeden).
        function updateCounts() {
            document.querySelectorAll(boardSel + ' .kanban-column').forEach(function (col) {
                var n = col.querySelectorAll('.kanban-cards .kanban-card').length;
                var b = col.querySelector('.kanban-count');
                if (b) { b.textContent = n; }

                var cards = col.querySelector('.kanban-cards');
                if (cards && !col.classList.contains('js-add-col')) {
                    var empty = cards.querySelector('.kanban-empty');
                    if (n === 0 && !empty) {
                        cards.appendChild(buildEmptyState(col.getAttribute('data-status-id')));
                    } else if (n > 0 && empty) {
                        empty.remove();
                    }
                }

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
                    // Boş kolon metni de kabın çocuğu — sürüklenebilir sanılmasın.
                    draggable: '.kanban-card',
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
        // Kolon SIRASI artık projeye ait (ReorderAsync) — renderColumns DB Order'ıyla
        // diziyor, burada yalnız kullanıcıya ait GENİŞLİK tercihi uygulanır.
        // (Eskiden sıra da localStorage'daydı: aynı projeyi açan iki kişi farklı
        // düzen görüyordu ve ReorderAsync hiç çağrılmıyordu.)
        function applyLayout() {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            board.querySelectorAll('.kanban-column').forEach(function (col) {
                var w = localStorage.getItem(kbKey('w-' + colToken(col)));
                if (w) { col.style.flexBasis = w + 'px'; }
            });
        }

        function ensureColumnConfig() {
            var board = document.querySelector(boardSel);
            if (!board || typeof Sortable === 'undefined') { return; }
            // Kolon sırası PROJEYE ait: yalnız Projects.Edit olan ve proje seçili
            // bir panoda sürüklenebilir. Sıra sunucuya yazılır (ReorderAsync) —
            // tüm ekip aynı düzeni görür.
            if (!configInited && canEditColumns && projectId) {
                configInited = true;
                new Sortable(board, {
                    draggable: '.kanban-column:not(.js-add-col)',
                    handle: '.kanban-header',
                    animation: 150,
                    ghostClass: 'kanban-col-ghost',
                    onEnd: function () {
                        // Proje seçimi bu arada kalkmış olabilir (genel panoda "Tümü"):
                        // kaydedilecek yer yok, düzeni geri al.
                        if (!projectId) { load(); return; }
                        var ids = Array.prototype.map.call(
                            board.querySelectorAll('.kanban-column:not(.js-add-col)'),
                            function (c) { return c.getAttribute('data-column-id'); })
                            .filter(function (id) { return !!id; });
                        if (!ids.length) { return; }
                        colSvc.reorder(projectId, ids)
                            .then(function () { abp.notify.success('Kolon sırası kaydedildi.'); })
                            .catch(function () {
                                // Sıra sunucuda değişmedi → DB düzenine geri dön.
                                abp.notify.error('Sıralama kaydedilemedi.');
                                load();
                            });
                    }
                });
            }
            // Boyutlandırma tutamağı (eksik olan kolonlara ekle) — karo/not
            // döşemeleri gerçek kolon değil, atlanır.
            board.querySelectorAll('.kanban-column:not(.js-add-col):not(.kanban-note-col)').forEach(function (col) {
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
        // Kolon başlığındaki ＋ — görev oluşturma modalını o kolon ön seçili açar.
        // Sistem kolonu "s:<status>", özel kolon "c:<guid>" (CreateModal aynı dili konuşur).
        $doc.on('click', boardSel + ' .js-col-add-task', function (e) {
            e.stopPropagation();
            if (!createModal || !projectId) { return; }
            var $col = $(this).closest('.kanban-column');
            var custom = $col.attr('data-column-id-custom');
            var statusOrColumn = custom ? ('c:' + custom) : ('s:' + $col.attr('data-status-id'));
            createModal.open({ projectId: projectId, statusOrColumn: statusOrColumn });
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
        // yoksa ya da Projects.Edit yoksa karo/butonlar zaten DOM'da olmaz
        // (guard çift güvence).
        if (customColumnsAllowed && canEditColumns) {
            $doc.on('click', boardSel + ' .js-add-col', function () {
                if (!projectId) { return; }
                askName('Yeni kolon', '', function (name) {
                    colSvc.create({ projectId: projectId, name: name, colorClass: 'primary' })
                        .then(function () { abp.notify.success('Kolon eklendi.'); load(); });
                });
            });
            // Silme onayı kartların NEREYE gideceğini isim isim söyler: kolon
            // kalkınca görevler MoveToColumn(null) ile durum kolonuna döner.
            // Hedef kolon adları board'dan okunur — JS'te ikinci bir durum sözlüğü yok.
            $doc.on('click', boardSel + ' .js-col-delete', function () {
                if (!projectId) { return; }
                var $col = $(this).closest('.kanban-column');
                var id = $col.data('column-id');
                var name = $col.find('.js-col-name').text().trim();
                var cards = $col[0].querySelectorAll('.kanban-cards .kanban-card');

                Swal.fire({
                    title: '"' + name + '" kolonu silinsin mi?',
                    html: buildDeletePreview(cards),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Kolonu sil',
                    cancelButtonText: 'Vazgeç',
                    confirmButtonColor: '#dc3545'
                }).then(function (r) {
                    if (!r.isConfirmed) { return; }
                    colSvc.delete(id).then(function () { abp.notify.info('Kolon silindi.'); load(); });
                });
            });

            // Sistem kolonunda "Kolonu sil" kilitli — tıklayınca gerekçe ve alternatif.
            $doc.on('click', boardSel + ' .js-col-delete-locked', function () {
                var name = $(this).closest('.kanban-column').find('.js-col-name').text().trim();
                abp.message.info(
                    '"' + name + '" görev durumuna bağlı bir sistem kolonu; panodan kaldırılamaz. ' +
                    'Ekibinin diline uydurmak için ⋯ menüsünden yeniden adlandırabilirsin.',
                    'Varsayılan kolonlar silinemez');
            });
            // Yeniden adlandırma yerinde yapılır (Enter kaydet · Esc iptal):
            // ⋯ menüsünden ya da doğrudan başlığa tıklayarak.
            $doc.on('click', boardSel + ' .js-col-rename', function () {
                startRename($(this).closest('.kanban-column')[0]);
            });
            $doc.on('click', boardSel + ' .js-col-name.is-editable', function () {
                startRename($(this).closest('.kanban-column')[0]);
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
