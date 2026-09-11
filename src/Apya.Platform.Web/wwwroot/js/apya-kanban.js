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

    // 0 (İptal) DAHİL: eskiden haritada yoktu, iptal edilen kart sessizce
    // düşüyordu ve kullanıcı görevin silindiğini sanıyordu (Faz 4b).
    var SYS = { 0: 'kanban-cancelled', 1: 'kanban-todo', 2: 'kanban-inprogress', 3: 'kanban-inreview', 4: 'kanban-done' };

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
        // Kulvar (gruplama) yalnız genel panoda anlamlı: proje panosunda tek proje
        // zaten var. Kartlar kolonun İÇİNDE kulvar başlıkları altında toplanır —
        // sürükleme kapları değişmediği için taşıma mantığı aynı kalır.
        var enableLanes = opts.enableLanes === true;
        // İptal kolonu varsayılan KAPALI (daraltılmış); tercih kullanıcıya ait.
        // Kolon daraltma tercihi KOLON BAZINDA (kullanıcıya ait, genişlik tercihiyle
        // aynı yerde). İptal kolonu da aynı mekanizmayı kullanır; tek farkı
        // kaydedilmiş tercih yokken VARSAYILAN olarak daralmış gelmesi.
        var collapsed = {};
        try { collapsed = JSON.parse(localStorage.getItem(kbKey('collapsed')) || '{}') || {}; } catch (e) { collapsed = {}; }
        function isCollapsed(token, isCancelCol) {
            if (Object.prototype.hasOwnProperty.call(collapsed, token)) { return !!collapsed[token]; }
            return !!isCancelCol;   // İptal kolonu varsayılan kapalı, diğerleri açık
        }
        function saveCollapsed() {
            try { localStorage.setItem(kbKey('collapsed'), JSON.stringify(collapsed)); } catch (e) { }
        }

        function syncCollapseBtn(colEl, shut) {
            var btn = colEl.querySelector('.js-col-collapse');
            if (!btn) { return; }
            btn.setAttribute('title', shut ? 'Genişlet' : 'Daralt');
            btn.setAttribute('aria-expanded', String(!shut));
            var icon = btn.querySelector('i');
            if (icon) { icon.className = 'fa fa-angle-' + (shut ? 'right' : 'left'); }
        }

        // Aç/kapa düğmesini DOĞRUDAN bağlar (jQuery delegasyonu değil): kolonlar
        // her render'da yeniden kurulduğu için sızıntı olmaz, davranış test edilebilir
        // kalır. Yeniden yükleme YAPMAZ — sınıfı ve ok yönünü yerinde çevirir.
        function bindCollapse(colEl, token) {
            var btn = colEl.querySelector('.js-col-collapse');
            if (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var shut = !colEl.classList.contains('is-collapsed');
                    colEl.classList.toggle('is-collapsed', shut);
                    // Elle müdahale otomatik daraltmayı devre dışı bırakır —
                    // tercih artık açıkça kullanıcıya ait.
                    colEl.classList.remove('is-auto-collapsed');
                    applyColumnWidth(colEl, token);
                    collapsed[token] = shut;
                    saveCollapsed();
                    syncCollapseBtn(colEl, shut);
                });
            }

            // v2: daraltılmış kolon (ray) tıklanınca açılır. Düğme/menü/kutu
            // tıklamaları kendi işini yapar; ray hâli dışında etkisiz.
            colEl.addEventListener('click', function (e) {
                if (!colEl.classList.contains('is-collapsed')) { return; }
                if (e.target.closest('button, .dropdown-menu, input')) { return; }
                colEl.classList.remove('is-collapsed', 'is-auto-collapsed');
                collapsed[token] = false;
                saveCollapsed();
                applyColumnWidth(colEl, token);
                syncCollapseBtn(colEl, false);
                updateCounts();   // boş kutu / rozetler yeniden değerlendirilsin
            });
        }
        var grouping = '';
        if (enableLanes) {
            try { grouping = localStorage.getItem('apya-kanban-group') || ''; } catch (e) { }
        }
        var getFilter = typeof opts.getFilter === 'function' ? opts.getFilter : function () { return {}; };
        var onChanged = typeof opts.onChanged === 'function' ? opts.onChanged : function () { };

        var taskSvc = apya.platform.tasks.task;
        var colSvc = apya.platform.projects.boardColumn;

        var sortables = [];
        var customIds = {};       // { columnId: true } özel kolonlar
        var configInited = false;

        // ── Görünüm tercihi (Shell.KanbanView — kanban v2, ekran 2a) ────────
        // density/fields/collapseEmpty/hideDone kullanıcı AYARIDIR: üç kanban
        // yüzeyi ve cihazlar arası ortak. Sayfaya _KanbanBoard.cshtml
        // data-kanban-view ile gelir; her değişiklikte sunucuya yazılır
        // (sekme düzenindeki persistTabs deseni — sessiz hata).
        // Yoğunluk uygulama geneli <html data-density>'ye BAĞLANMAZ: dört
        // kademe KART tasarımıdır, tablo satır yüksekliği değil.
        var DENSITIES = ['card', 'compact', 'list', 'title'];
        var DENSITY_LABELS = { card: 'Kart', compact: 'Kompakt', list: 'Liste', title: 'Başlık' };
        // Alan anahtarları ShellKanbanViewSetting.FieldKeys ile birebir;
        // "project" ve "subtasks" yalnız genel panoda seçilebilir çizilir.
        var FIELD_DEFS = [
            ['code', 'Kod'], ['pri', 'Öncelik'], ['assignee', 'Atanan'],
            ['due', 'Son tarih'], ['meta', 'Yorum / ek'], ['tags', 'Etiketler'],
            ['project', 'Proje'], ['subtasks', 'Alt görev']
        ];
        var view = readViewPrefs();

        function readViewPrefs() {
            var v = { density: '', fields: {}, collapseEmpty: true, hideDone: false };
            var board = document.querySelector(boardSel);
            var raw = board && board.getAttribute('data-kanban-view');
            if (raw) {
                try {
                    var p = JSON.parse(raw) || {};
                    v.density = p.density || '';
                    v.fields = p.fields || {};
                    if (p.collapseEmpty === false) { v.collapseEmpty = false; }
                    v.hideDone = p.hideDone === true;
                } catch (e) { /* bozuk değer tercihi çökertmesin — varsayılana düş */ }
            }
            if (DENSITIES.indexOf(v.density) < 0) {
                // Kayıt yoksa varsayılan: masaüstünde Kompakt, dar ekranda Liste.
                v.density = (window.matchMedia && window.matchMedia('(max-width: 767px)').matches)
                    ? 'list' : 'compact';
            }
            return v;
        }
        // Kayıtta OLMAYAN alan AÇIK sayılır — yeni bir alan eklendiğinde eski
        // kayıtlar onu gizlemesin (ShellKanbanViewDto.Fields sözleşmesi).
        function fieldOn(key) { return view.fields[key] !== false; }

        function persistViewPrefs() {
            // Sessizce yut: görünüm tercihi kritik değil; bir sonraki yüklemede
            // sunucudaki hâl geri gelir (persistTabs gerekçesiyle aynı).
            var token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
            fetch('/api/app/shell/set-kanban-view', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': token ? decodeURIComponent(token) : ''
                },
                body: JSON.stringify({
                    density: view.density,
                    fields: view.fields,
                    collapseEmpty: view.collapseEmpty,
                    hideDone: view.hideDone
                })
            }).catch(function () { });
        }

        // Yoğunluk/alan değişimi SUNUCUYA GİTMEDEN yeniden çizsin diye son
        // görev listesi bellekte tutulur; filtre değişimi yine load()'dan geçer.
        var lastTasks = null;
        var lastActiveLog = null;
        function rerender() {
            if (lastTasks) { render(lastTasks, lastActiveLog); }
            else { load(); }
        }

        function applyViewPrefs() {
            var board = document.querySelector(boardSel);
            if (board) { board.setAttribute('data-kb-density', view.density); }
            syncViewButton();
            rerender();
        }

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

        // ── Kart (DOM, XSS-güvenli: dinamik metin textContent ile) ──────────
        // Kanban v2 (ekran 2a): kart DÖRT yoğunlukta çizilir (card/compact/
        // list/title), alanlar Görünüm popover'ından açılıp kapanır. Düzenle/Sil
        // düğmeleri karttan kalktı — hepsi ⋯ menüsünde. Gecikme dili gün
        // sayısıyla sürüyor (Faz 7) ama kırmızı şerit yerine kart/rozet dilinde.

        // Gecikme GÜN sayısı — Done(4)/İptal(0) gecikmez.
        function lateDaysOf(task) {
            if (task.status === 4 || task.status === 0 || !task.dueDate) { return 0; }
            var d = Math.floor(moment().diff(moment(task.dueDate), 'days'));
            return d > 0 ? d : 0;
        }

        // Toplu seçim onay kutusu — yalnız yetkiliye; hover'da beliriyor,
        // seçim varken kalıcı görünüyor (CSS .kanban-card.is-selected).
        function buildCheck(task) {
            if (!bulkAllowed()) { return null; }
            var check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'kanban-card-check js-card-check';
            check.setAttribute('aria-label', 'Kartı seç');
            check.checked = !!selected[task.id];
            return check;
        }

        // ⋯ menü düğmesi — doğrudan bağlanır (kartlar her render'da yeniden
        // kurulur, sızıntı olmaz); stopPropagation kart tıklamasını (detay
        // açma / seçim) tetiklemesin diye.
        function buildMenuBtn(task) {
            var b = el('button', 'kanban-card-menubtn js-card-menu');
            b.type = 'button';
            b.setAttribute('title', 'Kart menüsü');
            b.setAttribute('aria-label', 'Kart menüsü');
            b.setAttribute('aria-haspopup', 'true');
            b.innerHTML = '<i class="fa fa-ellipsis"></i>';
            b.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleCardMenu(b, task);
            });
            return b;
        }

        // Kullanıcıya görünen kod ("GRV-17") — liste satırıyla aynı kimlik.
        // Eski payload'da code yoksa GUID kısaltmasına düş. codeOf() ve kolon
        // silme önizlemesi bu sınıfı okur.
        function buildCode(task) {
            var c = el('span', 'kanban-card-code');
            c.textContent = task.code || ('#' + ('' + task.id).substring(0, 4));
            return c;
        }

        // Atanan: baş harfli daire (apya-avatar sözlüğü). Atanmamış: kesik
        // çizgili boş daire; kart modunda "Atanmamış" etiketi de yazılır.
        function buildWho(task, withName) {
            var wrap = el('span', 'kanban-card-who');
            if (task.assigneeName) {
                var av = el('span', 'apya-avatar apya-avatar-brand kanban-avatar');
                av.title = task.assigneeName;
                av.textContent = (window.apyaTask && apyaTask.personInitials)
                    ? apyaTask.personInitials(task.assigneeName) : '?';
                wrap.appendChild(av);
                if (withName) {
                    var nm = el('span', 'kanban-card-whoname');
                    nm.textContent = task.assigneeName;
                    wrap.appendChild(nm);
                }
            } else {
                var dash = el('span', 'kanban-avatar-empty');
                dash.title = 'Atanmamış';
                wrap.appendChild(dash);
                if (withName) {
                    var lbl = el('span', 'kanban-card-whoname is-empty');
                    lbl.textContent = 'Atanmamış';
                    wrap.appendChild(lbl);
                }
            }
            return wrap;
        }

        // Bitiş: Done'da tamamlanma günü (✓), gecikmişte tarih + "+Ng" rozeti
        // ya da "· N gün geç" dili — yoğunluğa göre kısalır.
        function dueText(task) {
            var isDone = task.status === 4 || task.status === 0;
            var d = isDone ? (task.completedDate || task.dueDate) : task.dueDate;
            return d ? moment(d).format('DD MMM') : '';
        }

        function buildDueFull(task, lateDays) {
            var isDone = task.status === 4;
            var text = dueText(task);
            if (!text) { return null; }
            var due = el('span', 'kanban-card-due' + (lateDays ? ' is-late' : '') + (isDone ? ' is-done' : ''));
            if (isDone) { due.innerHTML = '<i class="fa fa-check-circle me-1"></i>'; }
            due.appendChild(document.createTextNode(text));
            if (lateDays) {
                var badge = el('span', 'kanban-late-badge');
                badge.textContent = '+' + lateDays + 'g';
                due.appendChild(badge);
            }
            return due;
        }

        function buildDueCompact(task, lateDays) {
            var isDone = task.status === 4;
            var text = dueText(task);
            if (!text) { return null; }
            var due = el('span', 'kanban-card-due' + (lateDays ? ' is-late' : '') + (isDone ? ' is-done' : ''));
            due.innerHTML = isDone ? '<i class="fa fa-check-circle me-1"></i>' : '<i class="fa fa-clock me-1"></i>';
            due.appendChild(document.createTextNode(
                lateDays ? (text + ' · ' + lateDays + ' gün geç') : text));
            return due;
        }

        // Yorum / ek / alt görev sayaçları. "meta" alanı yorum+eki, "subtasks"
        // alanı alt görev sayacını yönetir; Engelli rozeti alan tercihinden
        // BAĞIMSIZ (risk sinyali kapatılamaz).
        function buildMetaItems(task) {
            var items = [];
            if (fieldOn('meta')) {
                if (task.commentCount) {
                    var cm = el('span', 'kanban-card-metaitem');
                    cm.innerHTML = '<i class="fa fa-comment me-1"></i>' + task.commentCount;
                    items.push(cm);
                }
                if (task.attachmentCount) {
                    var at = el('span', 'kanban-card-metaitem');
                    at.innerHTML = '<i class="fa fa-paperclip me-1"></i>' + task.attachmentCount;
                    items.push(at);
                }
            }
            if (fieldOn('subtasks') && task.subTaskCount) {
                var st = el('span', 'kanban-card-metaitem');
                st.innerHTML = '<i class="fa fa-list-check me-1"></i>' +
                    (task.completedSubTaskCount || 0) + '/' + task.subTaskCount;
                items.push(st);
            }
            return items;
        }

        function buildBlockedChip(task) {
            if (!task.blockedByCodes || !task.blockedByCodes.length) { return null; }
            var bl = el('span', 'kanban-chip-blocked');
            bl.innerHTML = '<i class="fa fa-lock me-1"></i>';
            bl.appendChild(document.createTextNode('Engelli · ' + task.blockedByCodes.join(', ')));
            return bl;
        }

        // Genel panoda proje adı: renkli ince şerit + ad (ton apyaTask.hashTone).
        // Projeye göre gruplandıysa ad kulvar başlığında zaten var — basılmaz.
        function buildProjectRow(task) {
            if (!(showProject && task.projectName && grouping !== 'project' && fieldOn('project'))) { return null; }
            var tone = (window.apyaTask && apyaTask.hashTone) ? apyaTask.hashTone(task.projectName) : 'brand';
            var pj = el('span', 'kanban-card-project is-' + tone);
            pj.appendChild(document.createTextNode(task.projectName));
            return pj;
        }

        // Ortak kuyruk: engelli rozeti, iptal notu, çizilmeyen özel kolon notu.
        // Yalnız kart/kompakt modda — satır modlarında yer yok, bilgi ⋯ menüde.
        function appendCardExtras(card, task) {
            var blocked = buildBlockedChip(task);
            if (blocked) {
                var meta = el('div', 'kanban-card-meta');
                meta.appendChild(blocked);
                card.appendChild(meta);
            }

            // İptal edilmiş kart: ne zaman ve neden iptal edildiği görünür,
            // "İptali geri al" kartı iptalden ÖNCEKİ durumuna döndürür.
            if (task.status === 0) {
                var cx = el('div', 'kanban-cancel-note');
                var when = task.cancelledDate ? moment(task.cancelledDate).format('DD MMM') : '';
                var head = el('div', 'kanban-cancel-when');
                head.textContent = when ? ('İPTAL · ' + when) : 'İPTAL';
                cx.appendChild(head);
                if (task.cancelReason) {
                    var why = el('div', 'kanban-cancel-why');
                    why.textContent = 'Sebep: ' + task.cancelReason;
                    cx.appendChild(why);
                }
                cx.innerHTML += '<button type="button" class="kanban-cancel-restore js-restore-task" ' +
                    'data-id="' + task.id + '">İptali geri al</button>';
                card.appendChild(cx);
            }

            // Kart, bu panoda ÇİZİLMEYEN bir özel kolonda duruyorsa (genel panoda
            // "Tümü" seçili ya da başka bir projenin kolonu) nerede olduğunu söyle.
            if (task.boardColumnName && !(task.boardColumnId && customIds[task.boardColumnId])) {
                var colNote = el('div', 'kanban-card-colnote');
                colNote.innerHTML = '<i class="fa fa-diagram-project me-1"></i>';
                colNote.appendChild(document.createTextNode('Projede özel kolon: ' + task.boardColumnName));
                card.appendChild(colNote);
            }
        }

        // KART modu: kod + öncelik metni üstte, tam başlık, etiket satırı,
        // altta çizgiyle ayrılmış avatar+ad · tarih.
        function buildCardFull(card, task, lateDays, isActive) {
            var top = el('div', 'kanban-card-top');
            var check = buildCheck(task);
            if (check) { top.appendChild(check); }
            if (fieldOn('code')) { top.appendChild(buildCode(task)); }
            if (fieldOn('pri') && window.apyaTask && apyaTask.priorityBadge) {
                var pri = el('span', 'kanban-card-pri');
                pri.innerHTML = apyaTask.priorityBadge(task.priority);
                top.appendChild(pri);
            }
            if (enableTimer) { top.appendChild(buildTimerBtn(task, isActive)); }
            top.appendChild(buildMenuBtn(task));
            card.appendChild(top);

            var pj = buildProjectRow(task);
            if (pj) { card.appendChild(pj); }
            if (task.parentTaskTitle) {
                var pt = el('span', 'kanban-card-parent');
                pt.innerHTML = '<i class="fa fa-level-up-alt fa-rotate-90 me-1"></i>';
                pt.appendChild(document.createTextNode(task.parentTaskTitle));
                card.appendChild(pt);
            }

            var title = el('div', 'kanban-card-title');
            title.textContent = task.title;
            card.appendChild(title);

            if (fieldOn('tags') && window.apyaTask && task.tags && task.tags.length) {
                var tagsRow = el('div', 'kanban-card-tags');
                tagsRow.innerHTML = apyaTask.tagChips(task.tags);
                card.appendChild(tagsRow);
            }

            var foot = el('div', 'kanban-card-foot');
            if (fieldOn('assignee')) { foot.appendChild(buildWho(task, true)); }
            buildMetaItems(task).forEach(function (m) { foot.appendChild(m); });
            if (fieldOn('due')) {
                var due = buildDueFull(task, lateDays);
                if (due) { foot.appendChild(due); }
            }
            if (foot.childNodes.length) { card.appendChild(foot); }

            appendCardExtras(card, task);
        }

        // KOMPAKT modu (varsayılan): sol öncelik şeridi (CSS), kod + etiketler
        // üstte, 2 satır kırpılmış başlık, altta avatar · ◷ tarih · sayaçlar.
        function buildCardCompact(card, task, lateDays, isActive) {
            var top = el('div', 'kanban-card-top');
            var check = buildCheck(task);
            if (check) { top.appendChild(check); }
            if (fieldOn('code')) { top.appendChild(buildCode(task)); }
            var pj = buildProjectRow(task);
            if (pj) { top.appendChild(pj); }
            if (fieldOn('tags') && window.apyaTask && task.tags && task.tags.length) {
                var tags = el('span', 'kanban-card-tags');
                tags.innerHTML = apyaTask.tagChips(task.tags);
                top.appendChild(tags);
            }
            if (enableTimer) { top.appendChild(buildTimerBtn(task, isActive)); }
            top.appendChild(buildMenuBtn(task));
            card.appendChild(top);

            var title = el('div', 'kanban-card-title is-clamped');
            title.textContent = task.title;
            card.appendChild(title);

            var foot = el('div', 'kanban-card-foot');
            if (fieldOn('assignee')) { foot.appendChild(buildWho(task, false)); }
            if (fieldOn('due')) {
                var due = buildDueCompact(task, lateDays);
                if (due) { foot.appendChild(due); }
            }
            var metaWrap = el('span', 'kanban-card-metawrap');
            buildMetaItems(task).forEach(function (m) { metaWrap.appendChild(m); });
            if (metaWrap.childNodes.length) { foot.appendChild(metaWrap); }
            if (foot.childNodes.length) { card.appendChild(foot); }

            appendCardExtras(card, task);
        }

        // LİSTE modu: 36px tek satır — nokta · no · başlık · kısa tarih · avatar · ⋯
        function buildCardRow(card, task, lateDays) {
            var check = buildCheck(task);
            if (check) { card.appendChild(check); }
            if (fieldOn('pri')) { card.appendChild(el('span', 'kanban-pri-dot')); }
            if (fieldOn('code')) {
                var num = el('span', 'kanban-card-code');
                var code = task.code || ('#' + ('' + task.id).substring(0, 4));
                // Satırda yer dar: "GRV-17" → "17". Tire yoksa olduğu gibi kalır.
                num.textContent = code.indexOf('-') > 0 ? code.split('-').pop() : code;
                num.title = code;
                card.appendChild(num);
            }
            var title = el('span', 'kanban-card-title');
            title.textContent = task.title;
            card.appendChild(title);
            if (fieldOn('due')) {
                var isDone = task.status === 4;
                var d = el('span', 'kanban-card-due' + (lateDays ? ' is-late' : '') + (isDone ? ' is-done' : ''));
                if (lateDays) { d.textContent = '-' + lateDays + 'g'; }
                else if (isDone) { d.innerHTML = '<i class="fa fa-check"></i>'; }
                else if (task.dueDate) { d.textContent = moment(task.dueDate).format('DD'); }
                if (d.textContent || d.childNodes.length) { card.appendChild(d); }
            }
            if (fieldOn('assignee')) { card.appendChild(buildWho(task, false)); }
            card.appendChild(buildMenuBtn(task));
        }

        // BAŞLIK modu: 28px — sol öncelik kenarı (CSS), başlık, geçse "+Ng", ⋯
        function buildCardTitle(card, task, lateDays) {
            var check = buildCheck(task);
            if (check) { card.appendChild(check); }
            var title = el('span', 'kanban-card-title');
            title.textContent = task.title;
            card.appendChild(title);
            if (fieldOn('due') && lateDays) {
                var badge = el('span', 'kanban-late-badge');
                badge.textContent = '+' + lateDays + 'g';
                card.appendChild(badge);
            }
            card.appendChild(buildMenuBtn(task));
        }

        function buildTimerBtn(task, isActive) {
            var tc = el('span', 'timer-controls');
            tc.innerHTML = isActive
                ? '<button class="btn btn-sm btn-danger js-stop-timer p-1 px-2" data-id="' + task.id + '" title="Sayacı durdur"><i class="fa fa-pause fa-beat"></i></button>'
                : '<button class="btn btn-sm btn-outline-success js-start-timer p-1 px-2" data-id="' + task.id + '" title="Sayacı başlat"><i class="fa fa-play"></i></button>';
            return tc;
        }

        function buildCard(task, activeLog) {
            var card = el('div', 'kanban-card');
            card.setAttribute('data-id', task.id);
            card.setAttribute('data-priority', priorityAttr(task.priority));
            // Kolon silme onayı kartın döneceği durum kolonunu bundan bulur.
            card.setAttribute('data-status', task.status);

            // Gecikme/engel işaretleri ATTRIBUTE'ta taşınır: kolon sayaçları ve
            // "N geç" rozeti bunları sayar. Görsel dil yoğunluğa göre değişse de
            // sayım kaynağı sabit kalır (gizli-rozet tuzağına düşülmez).
            var lateDays = lateDaysOf(task);
            if (lateDays > 0) {
                card.classList.add('is-late');
                card.setAttribute('data-late', lateDays);
            }
            if (task.blockedByCodes && task.blockedByCodes.length) {
                card.setAttribute('data-blocked', task.blockedByCodes.length);
            }
            var isActive = enableTimer && activeLog && activeLog.taskId === task.id;
            if (isActive) { card.classList.add('timer-active'); }
            if (selected[task.id]) { card.classList.add('is-selected'); }
            // Öncelik alanı kapalıyken kompakt şerit / başlık kenarı da söner.
            if (!fieldOn('pri')) { card.classList.add('kb-no-pri'); }

            if (view.density === 'list') { buildCardRow(card, task, lateDays); }
            else if (view.density === 'title') { buildCardTitle(card, task, lateDays); }
            else if (view.density === 'card') { buildCardFull(card, task, lateDays, isActive); }
            else { buildCardCompact(card, task, lateDays, isActive); }
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

        // Boş kolon metni — v2: tek satırlık kesik çizgili bırakma hedefi.
        // (Durum başına ayrı metinler kalktı; boş kolon zaten çoğunlukla raya
        // iniyor, kutu yalnız "daraltma kapalı"yken görünür.)
        function buildEmptyState() {
            var box = el('div', 'kanban-empty');
            box.textContent = 'Kart yok · buraya sürükle';
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
            // SİSTEM ayrımı isSystem'dan gelir, statusValue'dan DEĞİL: Faz 4a ile
            // eşlemeli ÖZEL kolonun da statusValue'su dolu olabiliyor ama o kendi
            // kolonu olarak yaşar (kartlar boardColumnId ile bağlı).
            var isSys = !!c.isSystem;
            var col = el('div', 'kanban-column' + (isSys ? '' : ' js-custom-col'));
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
            // Aç/kapa: her kolonda (İptal kolonundaki desen genelleştirildi).
            var token = isSys ? ('s' + c.statusValue) : ('c' + c.id);
            var shut = isCollapsed(token, false);
            if (shut) { col.classList.add('is-collapsed'); }
            var collapseBtn = '<button type="button" class="kanban-col-collapse js-col-collapse" ' +
                'title="' + (shut ? 'Genişlet' : 'Daralt') + '" aria-expanded="' + (!shut) + '" ' +
                'aria-label="Kolonu aç/kapat"><i class="fa fa-angle-' + (shut ? 'right' : 'left') + '"></i></button>';
            // v2 başlık: nokta + ad + mono sayaç + "N geç" rozeti solda; ＋, ⋯ ve
            // aç/kapa sağda. Sayaç eylem grubunun DIŞINDA: ray (daraltılmış)
            // hâlde eylemler gizlenirken sayaç görünür kalmalı. WIP artık rozet
            // değil, başlığın altında ince çizgi + "n / limit" etiketi.
            col.innerHTML =
                '<div class="kanban-header">' +
                    '<span class="kanban-title js-col-name' + (canEditColumns && c.id ? ' is-editable' : '') +
                        '" title="' + (canEditColumns && c.id ? 'Adı düzenlemek için tıkla' : '') + '">' +
                        '<i class="fa fa-circle me-2"></i></span>' +
                    '<span class="kanban-count">0</span>' +
                    '<span class="kanban-col-late js-col-late d-none"></span>' +
                    '<span class="kanban-col-actions apya-touch-actions">' +
                        addBtn +
                        columnMenuHtml(c) +
                        collapseBtn +
                    '</span>' +
                '</div>' +
                '<div class="kanban-wip' + (c.wipLimit ? '' : ' d-none') + '" title="WIP limiti">' +
                    '<span class="kanban-wip-track"><span class="kanban-wip-fill"></span></span>' +
                    '<span class="kanban-wip-label"></span>' +
                '</div>' +
                '<div class="kanban-cards"></div>';
            // Ad textContent ile: XSS-güvenli (kolon adı kullanıcı girdisi).
            col.querySelector('.js-col-name').appendChild(document.createTextNode(' ' + c.name));
            col.querySelector('.kanban-cards').id = isSys ? SYS[c.statusValue] : ('kanban-col-' + c.id);
            bindCollapse(col, token);
            return col;
        }

        // ── Toplu seçim (4c) ────────────────────────────────────────────────
        // Liste tarafındaki createBulkSelection DataTables satırlarına bağlı ve
        // /Board'da apya-task-console.js hiç yüklenmiyor; seçim burada kendi
        // içinde yaşıyor, PAYLAŞILAN kısım görsel bileşen (.apya-console-bulkbar).
        var selected = {};      // { taskId: true }
        var lastPickedId = null;
        var lastBulk = null;    // "Geri al": { entries: [{ id, columnId, status }] }

        function bulkAllowed() {
            var board = document.querySelector(boardSel);
            return !!board && board.getAttribute('data-can-bulk') === 'true';
        }
        function selectedIds() { return Object.keys(selected); }
        // Çubukları board'un sarmalayıcısında ara, bulunamazsa belgeye düş.
        // Sıkı `board.parentNode` bağı, partial'da çubuk sarmalayıcı dışına
        // taşındığında çubuğu sessizce GİZLİ bırakıyordu (canlı QA'da yakalandı).
        function nearBoard(sel) {
            var board = document.querySelector(boardSel);
            if (!board) { return null; }
            var wrap = board.closest ? board.closest('.kanban-wrap') : null;
            return (wrap && wrap.querySelector(sel)) ||
                   (board.parentNode && board.parentNode.querySelector(sel)) ||
                   document.querySelector(sel);
        }
        function bulkBar() { return nearBoard('.js-kb-bar'); }

        function clearSelection() {
            selected = {};
            lastPickedId = null;
            syncSelection();
        }

        function syncSelection() {
            var ids = selectedIds();
            document.querySelectorAll(boardSel + ' .kanban-card').forEach(function (card) {
                var on = !!selected[card.getAttribute('data-id')];
                card.classList.toggle('is-selected', on);
                var box = card.querySelector('.js-card-check');
                if (box) { box.checked = on; }
            });
            var bar = bulkBar();
            if (!bar) { return; }
            bar.classList.toggle('d-none', ids.length === 0);
            var count = bar.querySelector('.js-kb-count');
            if (count) { count.textContent = ids.length + ' kart seçili'; }
        }

        // Shift ile aralık: yalnız AYNI kolonun içinde anlamlı — kartlar kolonlara
        // dağılmış durumda, panonun tamamında "aralık" diye bir sıra yok.
        function selectRange(fromId, toId) {
            var toCard = document.querySelector(boardSel + ' .kanban-card[data-id="' + toId + '"]');
            if (!toCard) { return; }
            var cards = Array.prototype.slice.call(
                toCard.closest('.kanban-cards').querySelectorAll('.kanban-card'));
            var ids = cards.map(function (c) { return c.getAttribute('data-id'); });
            var a = ids.indexOf(fromId), b = ids.indexOf(toId);
            if (a < 0) { selected[toId] = true; return; }
            var lo = Math.min(a, b), hi = Math.max(a, b);
            for (var i = lo; i <= hi; i++) { selected[ids[i]] = true; }
        }

        // Sıralı çalıştırma: bir kart hata verse de kalanlar denenir; hata veren
        // kartların KODU bildirimde geçer (liste tarafındaki runSequential deseni).
        function runSequential(ids, fn) {
            var failed = [];
            return ids.reduce(function (chain, id) {
                return chain.then(function () {
                    return Promise.resolve(fn(id)).catch(function () { failed.push(id); });
                });
            }, Promise.resolve()).then(function () { return failed; });
        }

        function codeOf(id) {
            var card = document.querySelector(boardSel + ' .kanban-card[data-id="' + id + '"]');
            var code = card && card.querySelector('.kanban-card-code');
            // Kod alanı Görünüm'den kapatılmış olabilir; kimlik yine söylenmeli.
            return code ? (code.title || code.textContent.trim()) : id.substring(0, 8);
        }

        // İşlem öncesi konumu sakla ki "Geri al" kartları yerine koyabilsin.
        function snapshot(ids) {
            return ids.map(function (id) {
                var card = document.querySelector(boardSel + ' .kanban-card[data-id="' + id + '"]');
                var col = card && card.closest('.kanban-column');
                return {
                    id: id,
                    status: card ? parseInt(card.getAttribute('data-status'), 10) : null,
                    columnId: col ? col.getAttribute('data-column-id-custom') : null
                };
            });
        }

        function finishBulk(ids, failed, doneMsg, undoEntries) {
            var okCount = ids.length - failed.length;
            if (failed.length) {
                abp.notify.error(failed.map(codeOf).join(', ') + ' işlenemedi, eski yerinde kaldı.');
            }
            if (okCount > 0) {
                lastBulk = undoEntries
                    ? { entries: undoEntries.filter(function (e) { return failed.indexOf(e.id) < 0; }) }
                    : null;
                abp.notify.success(okCount + ' görev ' + doneMsg + (lastBulk ? ' · geri almak için çubuktaki "Geri al"' : ''));
            }
            clearSelection();
            load();
            onChanged();
            syncUndoButton();
        }

        function syncUndoButton() {
            var bar = bulkBar();
            var btn = bar && bar.querySelector('.js-kb-undo');
            if (btn) { btn.classList.toggle('d-none', !lastBulk || !lastBulk.entries.length); }
        }

        // Kullanıcı listesi BİR KEZ istenir; hem toplu "Ata" menüsü hem kart ⋯
        // menüsündeki "Ata" alt listesi aynı önbellekten okur.
        var usersPromise = null;
        function getUsers() {
            if (!usersPromise) {
                usersPromise = taskSvc.getUsersLookup()
                    .then(function (res) { return res.items || []; })
                    .catch(function () { usersPromise = null; return []; });
            }
            return usersPromise;
        }

        // "Ata" menüsü kullanıcı listesinden BİR KEZ doldurulur (her render'da
        // istek atmasın); menü yoksa yetki de yok demektir.
        var assignMenuFilled = false;
        function fillAssignMenu() {
            var bar = bulkBar();
            var menu = bar && bar.querySelector('.js-kb-assign-menu');
            if (!menu || assignMenuFilled) { return; }
            assignMenuFilled = true;
            getUsers().then(function (items) {
                if (!items.length) { assignMenuFilled = false; return; }
                var none = el('button', 'apya-console-menu-item js-kb-assign');
                none.type = 'button';
                none.textContent = 'Atamayı kaldır';
                menu.appendChild(none);
                items.forEach(function (u) {
                    var btn = el('button', 'apya-console-menu-item js-kb-assign');
                    btn.type = 'button';
                    btn.setAttribute('data-user-id', u.id);
                    btn.textContent = u.userName || u.name || '';
                    menu.appendChild(btn);
                });
            });
        }

        // Taşı menüsü panodaki kolonlardan doldurulur: sistem kolonu durum,
        // özel kolon kolon bağı üzerinden taşır (tek kaynak: DOM'daki kolonlar).
        function fillMoveMenu() {
            var bar = bulkBar();
            var menu = bar && bar.querySelector('.js-kb-move-menu');
            if (!menu) { return; }
            menu.innerHTML = '';
            // İptal kolonu hedef listesinde YOK: iptal sebep soruyor, çubuktaki
            // "İptal et" o yolu kullanıyor.
            document.querySelectorAll(boardSel + ' .kanban-column:not(.js-add-col):not(.kanban-note-col):not(.kanban-cancel-col)').forEach(function (col) {
                var name = col.querySelector('.js-col-name');
                var btn = el('button', 'apya-console-menu-item js-kb-move');
                btn.type = 'button';
                // DB kolonu varsa taşıma kolon ucundan gider (sistem kolonunda da
                // doğru: MoveTaskToColumnAsync durumu değiştirip bağı temizler).
                // Proje seçili değilken kolon kaydı yoktur → durum ucuna düşülür.
                var colId = col.getAttribute('data-column-id');
                if (colId) { btn.setAttribute('data-column-id', colId); }
                else { btn.setAttribute('data-status-id', col.getAttribute('data-status-id')); }
                btn.textContent = name ? name.textContent.trim() : '';
                menu.appendChild(btn);
            });
        }

        // ── Kart ⋯ menüsü (v2) ──────────────────────────────────────────────
        // Düzenle/Sil düğmeleri karttan kalktı; taşı/ata/ertele/öncelik dâhil
        // tüm kart eylemleri buradan. Menü BODY'ye basılır: kolonlar
        // overflow-y:auto — kart içinde açılsa kolonun kenarında kırpılırdı
        // (3b panelinin gerekçesiyle aynı). Yetki kapıları toplu işlem
        // çubuğuyla AYNI kaynaktan okunur: çubukta olmayan eylem menüde de yok.
        var cardMenu = null;

        function cardMenuCaps() {
            var bar = bulkBar();
            return {
                move: !!(bar && bar.querySelector('.js-kb-move-menu')),
                assign: !!(bar && bar.querySelector('.js-kb-assign-menu')),
                defer: !!(bar && bar.querySelector('.js-kb-defer')),
                priority: !!(bar && bar.querySelector('.js-kb-priority'))
            };
        }

        function closeCardMenu() {
            if (!cardMenu) { return; }
            cardMenu.remove();
            cardMenu = null;
            document.removeEventListener('click', onCardMenuDoc, true);
            document.removeEventListener('keydown', onCardMenuKey, true);
            window.removeEventListener('scroll', closeCardMenu, true);
            window.removeEventListener('resize', closeCardMenu);
        }
        function onCardMenuDoc(e) {
            if (cardMenu && !cardMenu.contains(e.target)) { closeCardMenu(); }
        }
        function onCardMenuKey(e) {
            if (e.key === 'Escape') { closeCardMenu(); }
        }

        // Tek kart eylemi: bildir + panoyu tazele (toplu akıştaki finishBulk'ın
        // tekil karşılığı; geri alma yok — tek kartta maliyeti düşük).
        function runCardAction(promise, okMsg) {
            closeCardMenu();
            Promise.resolve(promise).then(function () {
                abp.notify.success(okMsg);
                load();
                onChanged();
            }).catch(function () {
                abp.notify.error('İşlem tamamlanamadı.');
                load();
            });
        }

        // Görev silme onayı — karttaki eski Sil düğmesinin akışı, artık ⋯
        // menüsünden çağrılıyor (yazılı "SİL" onayı korunur).
        function confirmDeleteTask(id) {
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
        }

        function toggleCardMenu(btn, task) {
            if (cardMenu && cardMenu.getAttribute('data-task-id') === String(task.id)) {
                closeCardMenu();
                return;
            }
            closeCardMenu();
            openCardMenu(btn, task);
        }

        function menuRow(label, extraCls) {
            var b = el('button', 'kanban-popmenu-item' + (extraCls ? ' ' + extraCls : ''));
            b.type = 'button';
            b.textContent = label;
            return b;
        }

        function openCardMenu(btn, task) {
            var caps = cardMenuCaps();
            var menu = el('div', 'kanban-card-popmenu');
            menu.setAttribute('data-task-id', task.id);
            menu.setAttribute('role', 'menu');

            var head = el('div', 'kanban-popmenu-head');
            head.textContent = task.code || ('#' + ('' + task.id).substring(0, 4));
            menu.appendChild(head);

            // Taşı ▸ — hedefler panodaki kolonlardan (toplu menüyle aynı kaynak);
            // alt liste akordeon açılır: dokunmatikte uçan menü tutturulamıyor.
            if (caps.move) {
                var moveBtn = menuRow('Taşı', 'has-sub');
                var moveSub = el('div', 'kanban-popmenu-sub d-none');
                document.querySelectorAll(boardSel + ' .kanban-column:not(.js-add-col):not(.kanban-note-col):not(.kanban-cancel-col)').forEach(function (col) {
                    var name = col.querySelector('.js-col-name');
                    var t = el('button', 'kanban-popmenu-subitem');
                    t.type = 'button';
                    t.textContent = name ? name.textContent.trim() : '';
                    var colId = col.getAttribute('data-column-id');
                    var statusId = col.getAttribute('data-status-id');
                    t.addEventListener('click', function () {
                        runCardAction(
                            colId ? colSvc.moveTaskToColumn(task.id, colId)
                                  : taskSvc.updateStatus(task.id, parseInt(statusId, 10)),
                            '"' + t.textContent + '" kolonuna taşındı.');
                    });
                    moveSub.appendChild(t);
                });
                moveBtn.addEventListener('click', function () { moveSub.classList.toggle('d-none'); });
                menu.appendChild(moveBtn);
                menu.appendChild(moveSub);
            }

            // Ata ▸ — kullanıcılar ortak önbellekten; ilk açılışta yüklenir.
            if (caps.assign) {
                var assignBtn = menuRow('Ata', 'has-sub');
                var assignSub = el('div', 'kanban-popmenu-sub d-none');
                var assignFilled = false;
                assignBtn.addEventListener('click', function () {
                    assignSub.classList.toggle('d-none');
                    if (assignFilled) { return; }
                    assignFilled = true;
                    getUsers().then(function (items) {
                        var none = el('button', 'kanban-popmenu-subitem');
                        none.type = 'button';
                        none.textContent = 'Atamayı kaldır';
                        none.addEventListener('click', function () {
                            runCardAction(taskSvc.setAssignee(task.id, null), 'Atama kaldırıldı.');
                        });
                        assignSub.appendChild(none);
                        items.forEach(function (u) {
                            var ub = el('button', 'kanban-popmenu-subitem');
                            ub.type = 'button';
                            ub.textContent = u.userName || u.name || '';
                            ub.addEventListener('click', function () {
                                runCardAction(taskSvc.setAssignee(task.id, u.id),
                                    '"' + ub.textContent + '" kişisine atandı.');
                            });
                            assignSub.appendChild(ub);
                        });
                    });
                });
                menu.appendChild(assignBtn);
                menu.appendChild(assignSub);
            }

            // Ertele — 1g / 7g mono hapları (toplu çubuktaki iki hazır adım).
            if (caps.defer) {
                var deferRow = el('div', 'kanban-popmenu-row');
                deferRow.appendChild(document.createTextNode('Ertele'));
                var deferWrap = el('span', 'kanban-popmenu-tail');
                [1, 7].forEach(function (days) {
                    var d = el('button', 'kanban-popmenu-pill');
                    d.type = 'button';
                    d.textContent = days + 'g';
                    d.addEventListener('click', function () {
                        runCardAction(taskSvc.defer(task.id, days), days + ' gün ertelendi.');
                    });
                    deferWrap.appendChild(d);
                });
                deferRow.appendChild(deferWrap);
                menu.appendChild(deferRow);
            }

            // Öncelik — 4 renkli nokta (Düşük → Kritik).
            if (caps.priority) {
                var priRow = el('div', 'kanban-popmenu-row');
                priRow.appendChild(document.createTextNode('Öncelik'));
                var priWrap = el('span', 'kanban-popmenu-tail');
                var PRI_NAMES = { 1: 'Düşük', 2: 'Orta', 3: 'Yüksek', 4: 'Kritik' };
                [1, 2, 3, 4].forEach(function (p) {
                    var d = el('button', 'kanban-popmenu-dot');
                    d.type = 'button';
                    d.setAttribute('data-priority', p);
                    d.title = PRI_NAMES[p];
                    d.setAttribute('aria-label', 'Öncelik: ' + PRI_NAMES[p]);
                    d.addEventListener('click', function () {
                        runCardAction(taskSvc.setPriority(task.id, p), 'Öncelik "' + PRI_NAMES[p] + '" yapıldı.');
                    });
                    priWrap.appendChild(d);
                });
                priRow.appendChild(priWrap);
                menu.appendChild(priRow);
            }

            var needsDivider = menu.childNodes.length > 1;
            var tail = [];
            if (task.status === 0) {
                var restore = menuRow('İptali geri al');
                restore.addEventListener('click', function () {
                    runCardAction(taskSvc.restoreFromCancel(task.id), 'İptal geri alındı.');
                });
                tail.push(restore);
            }
            if (editModal && canEdit(task)) {
                var edit = menuRow('Düzenle');
                edit.addEventListener('click', function () {
                    closeCardMenu();
                    editModal.open({ id: task.id });
                });
                tail.push(edit);
            }
            if (canDelete(task)) {
                var del = menuRow('Sil', 'is-danger');
                del.addEventListener('click', function () {
                    closeCardMenu();
                    confirmDeleteTask(task.id);
                });
                tail.push(del);
            }
            if (tail.length) {
                if (needsDivider) { menu.appendChild(el('div', 'kanban-popmenu-divider')); }
                tail.forEach(function (t) { menu.appendChild(t); });
            }
            if (menu.childNodes.length <= 1) { return; }  // yalnız başlık — menü boş

            // BODY'ye bas, düğmenin altına sabitle; alta sığmıyorsa üstüne aç.
            document.body.appendChild(menu);
            var rect = btn.getBoundingClientRect();
            var mw = menu.offsetWidth || 190;
            var mh = menu.offsetHeight;
            var left = Math.max(8, Math.min(rect.right - mw, window.innerWidth - mw - 8));
            var top = rect.bottom + 4;
            if (top + mh > window.innerHeight - 8) { top = Math.max(8, rect.top - mh - 4); }
            menu.style.left = left + 'px';
            menu.style.top = top + 'px';

            cardMenu = menu;
            document.addEventListener('click', onCardMenuDoc, true);
            document.addEventListener('keydown', onCardMenuKey, true);
            window.addEventListener('scroll', closeCardMenu, true);
            window.addEventListener('resize', closeCardMenu);
        }

        // ── Görünüm popover'ı (yoğunluk · kartta göster · anahtarlar) ───────
        // Tetikleyici araç çubuğundaki "Görünüm" düğmesi (_KanbanColumnTools).
        // Popover BODY'ye basılır (kart menüsüyle aynı gerekçe).
        var viewPop = null;

        function syncViewButton() {
            var btn = nearBoard('.js-kanban-view');
            if (!btn) { return; }
            var label = btn.querySelector('.js-kanban-view-density');
            if (label) { label.textContent = DENSITY_LABELS[view.density]; }
            btn.classList.toggle('is-active', !!viewPop);
            btn.setAttribute('aria-expanded', String(!!viewPop));
        }

        function closeViewPop() {
            if (!viewPop) { return; }
            viewPop.remove();
            viewPop = null;
            document.removeEventListener('click', onViewPopDoc, true);
            document.removeEventListener('keydown', onViewPopKey, true);
            window.removeEventListener('resize', closeViewPop);
            syncViewButton();
        }
        function onViewPopDoc(e) {
            if (viewPop && !viewPop.contains(e.target) && !e.target.closest('.js-kanban-view')) { closeViewPop(); }
        }
        function onViewPopKey(e) {
            if (e.key === 'Escape') { closeViewPop(); }
        }

        // Değişikliği anında uygula + sunucuya yaz + popover durumunu tazele.
        function changeView(mutate) {
            mutate();
            applyViewPrefs();
            persistViewPrefs();
            syncViewPop();
        }

        function syncViewPop() {
            if (!viewPop) { return; }
            viewPop.querySelectorAll('[data-kb-density]').forEach(function (b) {
                b.classList.toggle('is-active', b.getAttribute('data-kb-density') === view.density);
            });
            viewPop.querySelectorAll('[data-kb-field]').forEach(function (b) {
                var on = fieldOn(b.getAttribute('data-kb-field'));
                b.classList.toggle('is-on', on);
                b.setAttribute('aria-pressed', String(on));
            });
            viewPop.querySelectorAll('[data-kb-switch]').forEach(function (b) {
                var key = b.getAttribute('data-kb-switch');
                var on = key === 'collapseEmpty' ? view.collapseEmpty : view.hideDone;
                b.classList.toggle('is-on', on);
                b.setAttribute('aria-pressed', String(on));
            });
        }

        function openViewPop(btn) {
            closeViewPop();
            var pop = el('div', 'kanban-view-pop');
            pop.setAttribute('role', 'dialog');
            pop.setAttribute('aria-label', 'Pano görünümü');

            var html = '<div class="kanban-pop-head">Yoğunluk</div>' +
                '<div class="kanban-pop-density">' +
                DENSITIES.map(function (d) {
                    return '<button type="button" data-kb-density="' + d + '">' + DENSITY_LABELS[d] + '</button>';
                }).join('') +
                '</div>' +
                '<div class="kanban-pop-head">Kartta göster</div>' +
                '<div class="kanban-pop-fields">' +
                FIELD_DEFS.filter(function (f) {
                    // Proje ve alt görev alanları yalnız genel panoda seçilebilir;
                    // proje panosunda kartta proje adı zaten yok.
                    return showProject || (f[0] !== 'project' && f[0] !== 'subtasks');
                }).map(function (f) {
                    return '<button type="button" data-kb-field="' + f[0] + '">' + f[1] + '</button>';
                }).join('') +
                '</div>' +
                '<div class="kanban-pop-switches">' +
                    '<button type="button" class="kanban-pop-switchrow" data-kb-switch="collapseEmpty">' +
                        'Boş kolonları daralt<span class="kanban-switch" aria-hidden="true"><span class="kanban-switch-knob"></span></span></button>' +
                    '<button type="button" class="kanban-pop-switchrow" data-kb-switch="hideDone">' +
                        'Tamamlananları gizle<span class="kanban-switch" aria-hidden="true"><span class="kanban-switch-knob"></span></span></button>' +
                '</div>' +
                '<div class="kanban-pop-note">Tercih hesabına kaydedilir · tüm panolarda ortak</div>';
            pop.innerHTML = html;

            pop.addEventListener('click', function (e) {
                e.stopPropagation();
                var t = e.target.closest('button');
                if (!t) { return; }
                if (t.hasAttribute('data-kb-density')) {
                    changeView(function () { view.density = t.getAttribute('data-kb-density'); });
                } else if (t.hasAttribute('data-kb-field')) {
                    changeView(function () {
                        var key = t.getAttribute('data-kb-field');
                        view.fields[key] = !fieldOn(key);
                    });
                } else if (t.hasAttribute('data-kb-switch')) {
                    changeView(function () {
                        if (t.getAttribute('data-kb-switch') === 'collapseEmpty') { view.collapseEmpty = !view.collapseEmpty; }
                        else { view.hideDone = !view.hideDone; }
                    });
                }
            });

            document.body.appendChild(pop);
            var rect = btn.getBoundingClientRect();
            var pw = pop.offsetWidth || 300;
            var left = Math.max(8, Math.min(rect.right - pw, window.innerWidth - pw - 8));
            pop.style.left = left + 'px';
            pop.style.top = (rect.bottom + 10) + 'px';

            viewPop = pop;
            syncViewPop();
            syncViewButton();
            document.addEventListener('click', onViewPopDoc, true);
            document.addEventListener('keydown', onViewPopKey, true);
            window.addEventListener('resize', closeViewPop);
        }

        // ── Kulvarlar (kolon içi gruplama) ──────────────────────────────────
        // Değeri olmayan kartlar tek bir kovada toplanır ve DAİMA sona konur.
        var LANE_FALLBACK = { project: 'Projesiz', assignee: 'Atanmamış' };
        function laneKeyOf(task) {
            if (grouping === 'project') { return task.projectName || LANE_FALLBACK.project; }
            if (grouping === 'assignee') { return task.assigneeName || LANE_FALLBACK.assignee; }
            return '';
        }
        function laneGroups(list) {
            var map = {};
            list.forEach(function (t) {
                var k = laneKeyOf(t);
                (map[k] = map[k] || []).push(t);
            });
            var fallback = LANE_FALLBACK[grouping];
            return Object.keys(map).sort(function (a, b) {
                if (a === fallback) { return 1; }
                if (b === fallback) { return -1; }
                return a.localeCompare(b, 'tr');
            }).map(function (k) { return { key: k, tasks: map[k] }; });
        }
        function buildLaneHead(lane) {
            var h = el('div', 'kanban-lane-head');
            var n = el('span', 'kanban-lane-name');
            n.textContent = lane.key;
            var c = el('span', 'kanban-lane-count');
            c.textContent = lane.tasks.length;
            h.appendChild(n);
            h.appendChild(c);
            return h;
        }
        function setGrouping(mode) {
            grouping = (mode === 'project' || mode === 'assignee') ? mode : '';
            try { localStorage.setItem('apya-kanban-group', grouping); } catch (e) { }
            load();
        }

        // Araç çubuğu kontrolleri: "Grupla" kulvar açık panoda, "Kolonları düzenle"
        // yetki + proje seçiliyken. Çubuğun kendisi ikisinden biri varsa görünür.
        function syncToolbar() {
            var bar = nearBoard('.js-kanban-toolbar');
            if (!bar) { return; }
            var showCols = canEditColumns && effectiveCols();
            var editBtn = bar.querySelector('.js-edit-cols');
            if (editBtn) { editBtn.classList.toggle('d-none', !showCols); }
            var group = bar.querySelector('.js-kanban-group');
            if (group) { group.classList.toggle('d-none', !enableLanes); }
            var sel = bar.querySelector('.js-group-select');
            if (sel && sel.value !== grouping) { sel.value = grouping; }
            // "Görünüm" her panoda var — çubuk artık düğme çizildiyse hep görünür.
            // Düğme DOĞRUDAN bağlanır (bindCollapse gerekçesi: davranış test
            // edilebilir kalsın); partial tek kez basıldığı için sızıntı yok.
            var viewBtn = bar.querySelector('.js-kanban-view');
            if (viewBtn && !viewBtn.hasAttribute('data-kb-bound')) {
                viewBtn.setAttribute('data-kb-bound', 'true');
                viewBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (viewPop) { closeViewPop(); } else { openViewPop(viewBtn); }
                });
            }
            bar.classList.toggle('d-none', !(showCols || enableLanes || viewBtn));
        }

        // (v2) Pano üstü kırmızı risk şeridi KALKTI: gecikme sinyali artık kolon
        // başlığındaki "N geç" rozeti + karttaki gün sayısı; sayfa düzeyindeki
        // toplam, filtre çubuğundaki "Gecikmiş" chip/barında yaşıyor.

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
                var codeEl = card.querySelector('.kanban-card-code');
                var titleEl = card.querySelector('.kanban-card-title');
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

        // ── 3b "Kolonları düzenle" paneli ────────────────────────────────────
        // Tek yerden sırala + adlandır + renk + WIP. Değişiklikler biriktirilir,
        // "Değişiklikleri kaydet"te gider: satır başına UpdateAsync (DTO ad+renk+WIP'i
        // BİRLİKTE ister) + sıra değiştiyse ReorderAsync. Silme buradan da zengin
        // onaydan geçer. Panel body'ye basılır — ata bir 'transform' position:fixed'i
        // kapsayıp paneli hapsedebilir (bkz. modal yığın bağlamı tuzağı).
        var panelRoot = null;

        function cardCountOf(c) {
            var sel = c.isSystem
                ? '.kanban-column[data-status-id="' + c.statusValue + '"]'
                : '.kanban-column[data-column-id-custom="' + c.id + '"]';
            var col = document.querySelector(boardSel + ' ' + sel);
            return col ? col.querySelectorAll('.kanban-cards .kanban-card').length : 0;
        }

        function closeColumnPanel() {
            if (panelRoot) { panelRoot.remove(); panelRoot = null; }
        }

        function openColumnPanel() {
            if (!projectId || !canEditColumns || panelRoot) { return; }
            colSvc.getListByProject(projectId).then(function (cols) {
                renderColumnPanel(cols.slice().sort(function (a, b) { return a.order - b.order; }));
            });
        }

        function renderColumnPanel(cols) {
            closeColumnPanel();
            // Düzenlenen kopya: iptal edilirse sunucuya hiçbir şey gitmez.
            var draft = cols.map(function (c) {
                return {
                    id: c.id, isSystem: c.isSystem, cards: cardCountOf(c),
                    name: c.name, colorClass: c.colorClass || 'primary', wipLimit: c.wipLimit || null,
                    statusValue: c.statusValue == null ? null : c.statusValue,
                    applyToExisting: false,
                    origName: c.name, origColor: c.colorClass || 'primary', origWip: c.wipLimit || null,
                    origStatus: c.statusValue == null ? null : c.statusValue
                };
            });
            var origOrder = draft.map(function (d) { return d.id; }).join(',');

            panelRoot = el('div', 'kanban-panel-backdrop');
            panelRoot.innerHTML =
                '<div class="kanban-panel" role="dialog" aria-modal="true" aria-label="Kolonları düzenle">' +
                    '<div class="kanban-panel-head">' +
                        '<div>' +
                            '<div class="kanban-panel-title">Kolonları düzenle</div>' +
                            '<div class="kanban-panel-sub">' + draft.length + ' kolon</div>' +
                        '</div>' +
                        '<button type="button" class="kanban-panel-close js-p-close" aria-label="Kapat"><i class="fa fa-xmark"></i></button>' +
                    '</div>' +
                    '<div class="kanban-panel-cols"><span>Kolon adı</span><span>Renk</span><span>WIP</span><span></span></div>' +
                    '<div class="kanban-panel-rows js-p-rows"></div>' +
                    '<button type="button" class="kanban-panel-addcol js-p-add"><i class="fa fa-plus me-1"></i>Özel kolon ekle</button>' +
                    '<p class="kanban-panel-note">Sistem kolonları görev durumuna bağlı olduğu için silinemez — adını ve rengini değiştirebilirsin. Sıralama sürükle-bırak ile yapılır ve projeye kaydedilir.</p>' +
                    '<div class="kanban-panel-foot">' +
                        '<span class="kanban-panel-dirty js-p-dirty">Değişiklik yok</span>' +
                        '<span class="kanban-panel-actions">' +
                            '<button type="button" class="kanban-panel-btn js-p-cancel">Vazgeç</button>' +
                            '<button type="button" class="kanban-panel-btn is-primary js-p-save" disabled>Değişiklikleri kaydet</button>' +
                        '</span>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(panelRoot);

            var rowsEl = panelRoot.querySelector('.js-p-rows');
            var dirtyEl = panelRoot.querySelector('.js-p-dirty');
            var saveBtn = panelRoot.querySelector('.js-p-save');

            draft.forEach(function (d) { rowsEl.appendChild(buildPanelRow(d, refreshDirty)); });

            function currentOrder() {
                return Array.prototype.map.call(rowsEl.querySelectorAll('.kanban-panel-row'),
                    function (r) { return r.getAttribute('data-id'); }).join(',');
            }
            function changedRows() {
                return draft.filter(function (d) {
                    return d.name !== d.origName || d.colorClass !== d.origColor || d.wipLimit !== d.origWip;
                });
            }
            // Durum eşlemesi AYRI uçtan gider (UpdateBoardColumnDto'ya konsaydı her
            // yeniden adlandırma eşlemeyi sessizce sıfırlardı).
            function mappedRows() {
                return draft.filter(function (d) { return !d.isSystem && d.statusValue !== d.origStatus; });
            }
            function refreshDirty() {
                var n = changedRows().length + mappedRows().length + (currentOrder() !== origOrder ? 1 : 0);
                dirtyEl.textContent = n === 0 ? 'Değişiklik yok' : (n + ' değişiklik bekliyor');
                dirtyEl.classList.toggle('is-dirty', n > 0);
                saveBtn.disabled = n === 0;
            }

            if (typeof Sortable !== 'undefined') {
                new Sortable(rowsEl, {
                    draggable: '.kanban-panel-row',
                    handle: '.kanban-panel-grip',
                    animation: 150,
                    // Kart Sortable'ıyla aynı dokunma koruması: gecikmesiz sürükleme
                    // dokunmatikte parmak titremesini "drag" sanıp dokunuşu yutuyor
                    // (buton ancak ikinci dokunuşta çalışıyordu).
                    delay: 150,
                    delayOnTouchOnly: true,
                    touchStartThreshold: 5,
                    onEnd: refreshDirty
                });
            }

            panelRoot.querySelector('.js-p-close').addEventListener('click', closeColumnPanel);
            panelRoot.querySelector('.js-p-cancel').addEventListener('click', closeColumnPanel);
            panelRoot.addEventListener('click', function (e) {
                if (e.target === panelRoot) { closeColumnPanel(); }   // dışarı tıkla = vazgeç
            });
            panelRoot.querySelector('.js-p-add').addEventListener('click', function () {
                askName('Yeni kolon', '', function (name) {
                    colSvc.create({ projectId: projectId, name: name, colorClass: 'primary' })
                        .then(function () {
                            abp.notify.success('Kolon eklendi.');
                            load();
                            openColumnPanelSoon();
                        });
                });
            });

            panelRoot.querySelector('.js-p-save').addEventListener('click', function () {
                saveBtn.disabled = true;
                var updates = changedRows().map(function (d) {
                    return colSvc.update(d.id, { name: d.name, colorClass: d.colorClass, wipLimit: d.wipLimit });
                }).concat(mappedRows().map(function (d) {
                    return colSvc.setStatusMapping(d.id, {
                        statusValue: d.statusValue,
                        applyToExistingTasks: !!d.applyToExisting
                    });
                }));
                var orderNow = currentOrder();
                Promise.all(updates)
                    .then(function () {
                        if (orderNow === origOrder) { return null; }
                        return colSvc.reorder(projectId, orderNow.split(','));
                    })
                    .then(function () {
                        abp.notify.success('Kolonlar güncellendi.');
                        closeColumnPanel();
                        load();
                    })
                    .catch(function () {
                        abp.notify.error('Kolonlar kaydedilemedi.');
                        saveBtn.disabled = false;
                    });
            });

            refreshDirty();
        }

        // Kolon eklendikten sonra paneli tazeleyerek yeniden aç (liste değişti).
        function openColumnPanelSoon() {
            closeColumnPanel();
            setTimeout(openColumnPanel, 0);
        }

        function buildPanelRow(d, onChange) {
            var row = el('div', 'kanban-panel-row');
            row.setAttribute('data-id', d.id);

            // Durum eşlemesi seçenekleri: etiketler board'daki sistem kolonlarından
            // okunur, JS'te ikinci bir durum sözlüğü tutulmuyor.
            var mapOptions = ['', 1, 2, 3, 4].map(function (v) {
                var label = v === '' ? 'Durum değişmesin' : statusColumnName(v);
                return '<option value="' + v + '">' + esc(label) + '</option>';
            }).join('');

            row.innerHTML =
                '<span class="kanban-panel-grip" title="Sürükleyerek sırala" aria-hidden="true"><i class="fa fa-grip-vertical"></i></span>' +
                '<div class="kanban-panel-name">' +
                    '<div class="kanban-panel-nameline">' +
                        '<input type="text" class="js-p-name" maxlength="64" aria-label="Kolon adı" />' +
                        '<span class="kanban-panel-counter js-p-counter"></span>' +
                    '</div>' +
                    '<div class="kanban-panel-meta js-p-meta"></div>' +
                    (d.isSystem ? '' :
                        '<div class="kanban-panel-map">' +
                            '<span class="kanban-panel-map-label">Durum eşlemesi</span>' +
                            '<select class="js-p-status" aria-label="Bu kolon hangi durumu temsil ediyor">' + mapOptions + '</select>' +
                            '<label class="kanban-panel-map-apply js-p-apply-wrap d-none">' +
                                '<input type="checkbox" class="js-p-apply" /> mevcut kartları da güncelle' +
                            '</label>' +
                        '</div>') +
                    '<div class="kanban-panel-warn js-p-warn d-none"></div>' +
                '</div>' +
                '<div class="kanban-panel-color">' + colorSwatches(d.colorClass) + '</div>' +
                '<div class="kanban-panel-wip">' +
                    '<input type="number" min="0" max="999" class="js-p-wip" placeholder="—" aria-label="WIP limiti" />' +
                '</div>' +
                '<div class="kanban-panel-act">' +
                    (d.isSystem
                        ? '<span class="kanban-panel-lock" title="Sistem kolonu görev durumuna bağlıdır"><i class="fa fa-lock me-1"></i>Kilit</span>'
                        : '<button type="button" class="kanban-panel-del js-p-del">Sil</button>') +
                '</div>';

            // Ad/limit değerleri textContent-güvenli yollarla atanır (XSS).
            var nameInput = row.querySelector('.js-p-name');
            var counter = row.querySelector('.js-p-counter');
            var wipInput = row.querySelector('.js-p-wip');
            nameInput.value = d.name;
            wipInput.value = d.wipLimit == null ? '' : d.wipLimit;

            var statusSel = row.querySelector('.js-p-status');
            var applyWrap = row.querySelector('.js-p-apply-wrap');
            var applyBox = row.querySelector('.js-p-apply');
            if (statusSel) { statusSel.value = d.statusValue == null ? '' : String(d.statusValue); }

            function syncMeta() {
                var kind = d.isSystem ? 'Sistem' : 'Özel kolon';
                var what = d.statusValue != null
                    ? 'durum: ' + statusColumnName(d.statusValue)
                    : 'durumu değiştirmez';
                row.querySelector('.js-p-meta').textContent = kind + ' · ' + what + ' · ' + d.cards + ' kart';
            }
            syncMeta();

            function syncCounter() { counter.textContent = nameInput.value.length + '/64'; }
            function syncWarn() {
                var warn = row.querySelector('.js-p-warn');
                if (d.wipLimit && d.cards > d.wipLimit) {
                    warn.classList.remove('d-none');
                    warn.textContent = 'Şu anda bu kolonda ' + d.cards + ' kart var — limiti ' + d.wipLimit +
                        ' yaparsan kolon başlığı uyarı rozetiyle görünür, kart eklemek engellenmez.';
                } else {
                    warn.classList.add('d-none');
                }
            }
            syncCounter();
            syncWarn();

            nameInput.addEventListener('input', function () {
                d.name = nameInput.value;
                syncCounter();
                onChange();
            });
            wipInput.addEventListener('input', function () {
                var raw = wipInput.value.trim();
                var v = raw === '' ? null : parseInt(raw, 10);
                d.wipLimit = (v === null || isNaN(v) || v <= 0) ? null : v;
                syncWarn();
                onChange();
            });
            if (statusSel) {
                statusSel.addEventListener('change', function () {
                    var raw = statusSel.value;
                    d.statusValue = raw === '' ? null : parseInt(raw, 10);
                    // "Mevcut kartları da güncelle" yalnız gerçekten kart varken ve
                    // bir duruma eşlenirken sorulur — boş kolonda anlamsız.
                    var offer = d.statusValue != null && d.cards > 0;
                    applyWrap.classList.toggle('d-none', !offer);
                    if (!offer) { applyBox.checked = false; }
                    d.applyToExisting = offer && applyBox.checked;
                    syncMeta();
                    onChange();
                });
                applyBox.addEventListener('change', function () {
                    d.applyToExisting = applyBox.checked;
                });
            }
            row.querySelectorAll('.js-col-color').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    d.colorClass = btn.getAttribute('data-color');
                    row.querySelectorAll('.js-col-color').forEach(function (b) {
                        b.setAttribute('aria-pressed', String(b === btn));
                    });
                    onChange();
                });
            });
            var del = row.querySelector('.js-p-del');
            if (del) {
                del.addEventListener('click', function () {
                    var sel = '.kanban-column[data-column-id-custom="' + d.id + '"] .kanban-cards .kanban-card';
                    var cards = document.querySelectorAll(boardSel + ' ' + sel);
                    Swal.fire({
                        title: '"' + d.name + '" kolonu silinsin mi?',
                        html: buildDeletePreview(cards),
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Kolonu sil',
                        cancelButtonText: 'Vazgeç',
                        confirmButtonColor: '#dc3545'
                    }).then(function (r) {
                        if (!r.isConfirmed) { return; }
                        colSvc.delete(d.id).then(function () {
                            abp.notify.info('Kolon silindi.');
                            load();
                            openColumnPanelSoon();
                        });
                    });
                });
            }
            return row;
        }

        // Board'u baştan kurar. Sıra: DB Order (sistem ve özel kolonlar aynı listede).
        function renderColumns(cols) {
            var board = document.querySelector(boardSel);
            if (!board) { return; }
            board.innerHTML = '';
            customIds = {};
            // Yoğunluk board attribute'unda taşınır — kolon genişliği ve kart
            // aralığı CSS'te buradan okunur (kanban.css [data-kb-density]).
            board.setAttribute('data-kb-density', view.density);

            cols.slice().sort(function (a, b) { return a.order - b.order; }).forEach(function (c) {
                if (!c.isSystem) { customIds[c.id] = true; }
                board.appendChild(buildColumn(c));
            });

            // İptal kolonu (Faz 4b): BoardColumn kaydı YOK, yalnız Status 0'ın
            // panodaki karşılığı. En sağda, varsayılan daraltılmış; kapalıyken de
            // kartlar render edilir (sayaç doğru kalsın, CSS listeyi gizler).
            var cancelShut = isCollapsed('s0', true);   // varsayılan: kapalı
            var cancelCol = el('div', 'kanban-column kanban-cancel-col' + (cancelShut ? ' is-collapsed' : ''));
            cancelCol.setAttribute('data-status-id', '0');
            cancelCol.setAttribute('data-cancel-col', 'true');
            cancelCol.setAttribute('data-column-color', 'danger');
            cancelCol.innerHTML =
                '<div class="kanban-header">' +
                    '<span class="kanban-title js-col-name"><i class="fa fa-ban me-2"></i>İptal edildi</span>' +
                    '<span class="kanban-count">0</span>' +
                    '<span class="kanban-col-actions apya-touch-actions">' +
                        '<button type="button" class="kanban-col-collapse js-col-collapse" ' +
                            'title="' + (cancelShut ? 'Genişlet' : 'Daralt') + '" aria-expanded="' + (!cancelShut) + '" ' +
                            'aria-label="İptal kolonunu aç/kapat"><i class="fa fa-angle-' + (cancelShut ? 'right' : 'left') + '"></i></button>' +
                    '</span>' +
                '</div>' +
                '<div class="kanban-cards" id="kanban-cancelled"></div>';
            bindCollapse(cancelCol, 's0');
            board.appendChild(cancelCol);

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

            syncToolbar();
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
            lastTasks = tasks;
            lastActiveLog = activeLog;
            closeCardMenu();   // çapa kart birazdan yok olacak
            document.querySelectorAll(boardSel + ' .kanban-cards').forEach(function (n) { n.innerHTML = ''; });
            // Kartlar önce kabına göre toplanır: kulvar kipinde her kabın içi
            // gruplanarak basılacak, kapların kendisi değişmiyor.
            var buckets = {};
            tasks.forEach(function (task) {
                var container = null;
                if (task.boardColumnId && customIds[task.boardColumnId]) {
                    container = document.getElementById('kanban-col-' + task.boardColumnId);
                }
                if (!container) { container = document.getElementById(SYS[task.status]); }
                if (!container) { return; }
                (buckets[container.id] = buckets[container.id] || []).push(task);
            });
            Object.keys(buckets).forEach(function (id) {
                var container = document.getElementById(id);
                if (!grouping) {
                    buckets[id].forEach(function (t) { container.appendChild(buildCard(t, activeLog)); });
                    return;
                }
                laneGroups(buckets[id]).forEach(function (lane) {
                    container.appendChild(buildLaneHead(lane));
                    lane.tasks.forEach(function (t) { container.appendChild(buildCard(t, activeLog)); });
                });
            });
            syncToolbar();
            fillMoveMenu();     // taşı hedefleri panodaki güncel kolonlardan
            fillAssignMenu();   // kullanıcı listesi bir kez
            syncSelection();    // yeniden çizimde seçim vurgusu korunur
            updateCounts();
            initSortable();
            ensureColumnConfig();
            applyLayout();
            syncViewButton();   // "Görünüm: Kompakt" etiketi güncel kalsın
        }

        // Sayaç + WIP + boş metin: kolon başlığının kartlarla senkronu TEK yerde.
        // Sürükleme sonrası da çağrılır — boş kolona kart bırakılınca metin kalkar,
        // son kart çıkınca geri gelir (yeniden yükleme beklemeden).
        function updateCounts() {
            document.querySelectorAll(boardSel + ' .kanban-column').forEach(function (col) {
                if (col.classList.contains('js-add-col') || col.classList.contains('kanban-note-col')) { return; }
                var n = col.querySelectorAll('.kanban-cards .kanban-card').length;
                var b = col.querySelector('.kanban-count');
                if (b) { b.textContent = n; }

                // "N geç" rozeti — kartların data-late ATTRIBUTE'undan sayılır:
                // görsel dil yoğunlukla değişse de sayım kaynağı sabit kalır
                // (gizli rozet sayma tuzağına düşülmez). Faz 7'nin gün-sayısı
                // dili kartta sürüyor; kolon özeti tek rozete indi.
                var late = col.querySelectorAll('.kanban-cards .kanban-card[data-late]').length;
                var lateEl = col.querySelector('.js-col-late');
                if (lateEl) {
                    lateEl.textContent = late ? (late + ' geç') : '';
                    lateEl.classList.toggle('d-none', !late);
                }

                // "Tamamlananları gizle": Tamamlandı sistem kolonu tamamen
                // gizlenir (ray bile değil). Özel kolonlar durumdan bağımsız kalır.
                if (col.getAttribute('data-status-id') === '4' && !col.hasAttribute('data-column-id-custom')) {
                    col.classList.toggle('d-none', view.hideDone);
                }

                // Boş kolon: "Boş kolonları daralt" AÇIK ve kullanıcının kendi
                // tercihi YOKSA raya iner; kart gelince kendiliğinden açılır.
                // İptal kolonu kendi varsayılanıyla yönetilir, otomatiğe girmez.
                var token = colToken(col);
                var hasPref = Object.prototype.hasOwnProperty.call(collapsed, token);
                var isCancel = col.classList.contains('kanban-cancel-col');
                if (!hasPref && !isCancel) {
                    var auto = n === 0 && view.collapseEmpty;
                    if (auto && !col.classList.contains('is-collapsed')) {
                        col.classList.add('is-collapsed', 'is-auto-collapsed');
                        applyColumnWidth(col, token);
                        syncCollapseBtn(col, true);
                    } else if (!auto && col.classList.contains('is-auto-collapsed')) {
                        col.classList.remove('is-collapsed', 'is-auto-collapsed');
                        applyColumnWidth(col, token);
                        syncCollapseBtn(col, false);
                    }
                }

                var cards = col.querySelector('.kanban-cards');
                if (cards) {
                    var empty = cards.querySelector('.kanban-empty');
                    var needBox = n === 0 && !col.classList.contains('is-collapsed');
                    if (needBox && !empty) { cards.appendChild(buildEmptyState()); }
                    else if (!needBox && empty) { empty.remove(); }
                }

                // WIP: ince çizgi + "n / limit" etiketi. Aşımda negatif tona geçer —
                // limit sert kısıt değil, uyarı sinyalidir (bkz. BoardColumn.WipLimit).
                var wipEl = col.querySelector('.kanban-wip');
                if (!wipEl) { return; }
                var limit = parseInt(col.getAttribute('data-wip-limit'), 10);
                if (!limit) {
                    wipEl.classList.add('d-none');
                    return;
                }
                wipEl.classList.remove('d-none');
                wipEl.classList.toggle('is-over', n > limit);
                var label = wipEl.querySelector('.kanban-wip-label');
                if (label) { label.textContent = n + ' / ' + limit; }
                var fill = wipEl.querySelector('.kanban-wip-fill');
                if (fill) { fill.style.width = Math.min(100, (n / limit) * 100) + '%'; }
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
                    // Sürükleme başlarken OTOMATİK daraltılmış (boş) kolonlar
                    // açılır ki bırakma hedefi görünür olsun; bırakınca boş
                    // kalanlar raya geri iner (updateCounts değil burada:
                    // kart başka panoya taşınmadıysa sunucu yolu zaten
                    // updateCounts/load çağırıyor, erken kapatma titretir).
                    onStart: function () {
                        document.querySelectorAll(boardSel + ' .kanban-column.is-auto-collapsed').forEach(function (c) {
                            c.classList.remove('is-collapsed');
                            applyColumnWidth(c, colToken(c));
                        });
                    },
                    onEnd: function (evt) {
                        document.querySelectorAll(boardSel + ' .kanban-column.is-auto-collapsed').forEach(function (c) {
                            if (!c.querySelector('.kanban-cards .kanban-card')) {
                                c.classList.add('is-collapsed');
                                applyColumnWidth(c, colToken(c));
                            } else {
                                c.classList.remove('is-auto-collapsed');
                            }
                        });
                        if (evt.from === evt.to) { return; }
                        var taskId = $(evt.item).data('id');
                        var col = $(evt.to).closest('.kanban-column');
                        var columnId = col.attr('data-column-id');
                        var statusId = col.attr('data-status-id');
                        var promise;
                        // İptal kolonuna bırakma sebep sorar; iptal SEBEPSİZ de olur
                        // (kullanıcı boş geçebilir) ama işlem sessizce yapılmaz.
                        if (col.attr('data-cancel-col')) {
                            Swal.fire({
                                title: 'Görev iptal edilsin mi?',
                                input: 'text',
                                inputPlaceholder: 'Sebep (isteğe bağlı)',
                                showCancelButton: true,
                                confirmButtonText: 'İptal et',
                                cancelButtonText: 'Vazgeç'
                            }).then(function (r) {
                                if (!r.isConfirmed) { load(); return; }   // bırakmayı geri al
                                taskSvc.cancel(taskId, r.value || null).then(function () {
                                    abp.notify.info('Görev iptal edildi.');
                                    load();
                                    onChanged();
                                }).catch(function () {
                                    abp.notify.error('Görev iptal edilemedi.');
                                    load();
                                });
                            });
                            return;
                        }
                        if (columnId) { promise = colSvc.moveTaskToColumn(taskId, columnId); }
                        else if (statusId) { promise = taskSvc.updateStatus(taskId, parseInt(statusId)); }
                        else { return; }
                        promise.then(function () {
                            abp.notify.success('Görev taşındı.');
                            // Kulvar kipinde kart, bırakıldığı yerdeki kulvarın altında
                            // kalır; doğru kulvara oturması için yeniden çiz.
                            if (grouping) { load(); onChanged(); return; }
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
                applyColumnWidth(col, colToken(col));
            });
        }

        // Genişlik tercihi SATIR İÇİ flex-basis olarak yazılır ve satır içi stil
        // `.kanban-column.is-collapsed { flex: 0 0 52px }` kuralını EZER: kolon
        // daraltılmışken tercih uygulanırsa kapanır ama DARALMAZ. Kapalıyken
        // genişliği CSS'e bırak, açılınca tercihi geri koy.
        function applyColumnWidth(col, token) {
            var w = col.classList.contains('is-collapsed')
                ? null : localStorage.getItem(kbKey('w-' + token));
            col.style.flexBasis = w ? (w + 'px') : '';
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
                    // handle=.kanban-header aç/kapa, ⋯ ve ＋ butonlarını da içeriyor:
                    // dokunmatikte gecikmesiz sürükleme bu dokunuşları drag başlangıcı
                    // sanıp yutuyordu (mobilde "iki kere basmak gerekiyor" şikâyeti).
                    // delayOnTouchOnly: true → fare kullanıcıları etkilenmez.
                    delay: 150,
                    delayOnTouchOnly: true,
                    touchStartThreshold: 5,
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

        // Karta tıklama: sade tık detay açar, Ctrl/⌘ tek tek seçer, Shift aralık
        // seçer. Seçim varken sade tık da seçime katılır — kullanıcı "seçim kipi"
        // içindeyken kart açmak istemiyor.
        $doc.on('click', boardSel + ' .kanban-card', function (e) {
            if (e.target.closest('.btn')) { return; }
            var id = String($(this).data('id'));

            if (bulkAllowed()) {
                var isCheck = !!e.target.closest('.js-card-check');
                var toggle = isCheck || e.ctrlKey || e.metaKey;
                var range = e.shiftKey && lastPickedId;
                if (toggle || range || selectedIds().length) {
                    e.preventDefault();
                    if (range) { selectRange(lastPickedId, id); }
                    else if (selected[id]) { delete selected[id]; }
                    else { selected[id] = true; }
                    lastPickedId = id;
                    syncSelection();
                    return;
                }
            }
            if (editModal) { editModal.open({ id: id }); }
        });

        // Esc seçimi bırakır (mockup 4c).
        $doc.on('keydown', function (e) {
            if (e.key === 'Escape' && selectedIds().length) { clearSelection(); }
        });

        $doc.on('click', '.js-kb-clear', function () { clearSelection(); });


        // "İptali geri al" — kartı iptalden ÖNCEKİ durumuna döndürür.
        $doc.on('click', boardSel + ' .js-restore-task', function (e) {
            e.stopPropagation();
            var id = $(this).data('id');
            taskSvc.restoreFromCancel(id).then(function () {
                abp.notify.success('İptal geri alındı.');
                load();
                onChanged();
            }).catch(function () { abp.notify.error('İptal geri alınamadı.'); });
        });

        // Taşı: hedef sistem kolonuysa durum, özel kolonsa kolon bağı üzerinden.
        $doc.on('click', '.js-kb-move', function () {
            var ids = selectedIds();
            if (!ids.length) { return; }
            var columnId = $(this).attr('data-column-id');
            var statusId = $(this).attr('data-status-id');
            var target = $(this).text().trim();
            var before = snapshot(ids);
            runSequential(ids, function (id) {
                return columnId ? colSvc.moveTaskToColumn(id, columnId)
                                : taskSvc.updateStatus(id, parseInt(statusId, 10));
            }).then(function (failed) {
                finishBulk(ids, failed, '"' + target + '" kolonuna taşındı.', before);
            });
        });

        $doc.on('click', '.js-kb-cancel-tasks', function () {
            var ids = selectedIds();
            if (!ids.length) { return; }
            var before = snapshot(ids);
            runSequential(ids, function (id) { return taskSvc.updateStatus(id, 0); })
                .then(function (failed) { finishBulk(ids, failed, 'iptal edildi.', before); });
        });

        $doc.on('click', '.js-kb-assign', function () {
            var ids = selectedIds();
            if (!ids.length) { return; }
            var userId = $(this).attr('data-user-id') || null;
            var who = $(this).text().trim();
            runSequential(ids, function (id) { return taskSvc.setAssignee(id, userId); })
                .then(function (failed) {
                    // Atama geri alınmıyor: kartta önceki atananın id'si yok.
                    finishBulk(ids, failed, userId ? ('"' + who + '" kişisine atandı.') : 'ataması kaldırıldı.', null);
                });
        });

        $doc.on('click', '.js-kb-priority', function () {
            var ids = selectedIds();
            if (!ids.length) { return; }
            var p = parseInt($(this).attr('data-priority'), 10);
            var label = $(this).text().trim();
            runSequential(ids, function (id) { return taskSvc.setPriority(id, p); })
                .then(function (failed) { finishBulk(ids, failed, 'önceliği "' + label + '" yapıldı.', null); });
        });

        $doc.on('click', '.js-kb-defer', function () {
            var ids = selectedIds();
            if (!ids.length) { return; }
            var days = parseInt($(this).attr('data-days'), 10);
            runSequential(ids, function (id) { return taskSvc.defer(id, days); })
                .then(function (failed) {
                    // Erteleme geri alınmıyor: eski tarihi kartta tutmuyoruz.
                    finishBulk(ids, failed, days + ' gün ertelendi.', null);
                });
        });

        $doc.on('click', '.js-kb-delete', function () {
            var ids = selectedIds();
            if (!ids.length) { return; }
            abp.message.confirm(
                'Seçili görevler kalıcı olarak silinecek. Bu işlem geri alınamaz.',
                ids.length + ' görev silinecek',
                function (ok) {
                    if (!ok) { return; }
                    runSequential(ids, function (id) { return taskSvc.delete(id); })
                        .then(function (failed) { finishBulk(ids, failed, 'silindi.', null); });
                });
        });

        // Geri al: son toplu taşımanın kartlarını eski kolon/durumuna döndürür.
        $doc.on('click', '.js-kb-undo', function () {
            if (!lastBulk || !lastBulk.entries.length) { return; }
            var entries = lastBulk.entries;
            lastBulk = null;
            runSequential(entries.map(function (e) { return e.id; }), function (id) {
                var e = entries.filter(function (x) { return x.id === id; })[0];
                return e.columnId ? colSvc.moveTaskToColumn(id, e.columnId)
                                  : taskSvc.updateStatus(id, e.status);
            }).then(function (failed) {
                if (failed.length) { abp.notify.error(failed.map(codeOf).join(', ') + ' geri alınamadı.'); }
                else { abp.notify.info('Son toplu işlem geri alındı.'); }
                load();
                onChanged();
                syncUndoButton();
            });
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

            // "Kolonları düzenle" (3b paneli) — partial'daki düğme, board'un kardeşi.
            $doc.on('click', '.js-edit-cols', function () { openColumnPanel(); });

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

        // Kulvar seçici yetkiden bağımsızdır: gruplama bir okuma işlemi.
        if (enableLanes) {
            $doc.on('change', '.js-group-select', function () { setGrouping(this.value); });
        }

        if (editModal && editModal.onResult) { editModal.onResult(function () { load(); onChanged(); }); }

        return {
            load: load,
            reload: load,
            setProject: setProject,
            getProjectId: function () { return projectId; },
            // 3b paneli: partial'daki düğme bunu çağırıyor; sayfalar kendi
            // araç çubuklarından da açabilsin diye dışarı veriliyor.
            openColumnPanel: openColumnPanel,
            closeColumnPanel: closeColumnPanel,
            setGrouping: setGrouping,
            getGrouping: function () { return grouping; }
        };
    }

    apya.kanban = { create: create };
})();
