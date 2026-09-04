/* ============================================================================
   PROJELER KONSOLU — veri, filtre, sıralama, risk ve render TEK MODÜLDE.
   ----------------------------------------------------------------------------
   Tasarım: "Projeler Redesign" kanvası 3a (masaüstü) + 3b (mobil).
   Stil tek kaynak: apya-shell.css §22. Bu dosya hiç satır-içi renk yazmaz.

   Değişmez kural — TEK DURUM: ekranda görünen her şey (KPI şeridi, çip
   sayaçları, liste, kart, risk kenarı, panel) `state.items` üzerinden türetilir.
   Görev tamamlandığında/ötelendiğinde ilgili projenin metrikleri yerelde
   SUNUCUYLA AYNI kuralla yeniden hesaplanır ve tek bir render() hepsini birden
   günceller; kısmi DOM yaması yapılmaz.

   Kırılım kararı KAP genişliğinden gelir, viewport'tan DEĞİL: içerik alanı
   kenar çubuğuna göre 280/72/0 px değişiyor (Dashboard'da aynı hata 327px
   sapma üretmişti). Kap dar olduğunda liste görünümü kullanılamaz, kart moduna
   düşülür — seçim silinmez, kap genişleyince geri gelir.
   ============================================================================ */
$(function () {
    'use strict';

    // Proxy namespace ABP sürümüne göre değişebiliyor — iki bilinen yolu da dene.
    var projectService = (apya.platform.projects && apya.platform.projects.project)
        || apya.platform.application.projects.project;
    var taskService = apya.platform.tasks && apya.platform.tasks.task;
    var l = abp.localization.getResource('Platform');

    var $console = $('#ProjectsConsole');
    if (!$console.length) { return; }

    var CAN_VIEW_BUDGET = $console.data('can-view-budget') === true;
    var CAN_CREATE = $console.data('can-create') === true;
    var CAN_EDIT = $console.data('can-edit') === true;
    var DEFAULT_VIEW = $console.data('default-view') === 'list' ? 'list' : 'card';
    // Görev paneli (sağdan açılan drawer) etkin mi? Kapalıyken (varsayılan) tıklama
    // proje detay sayfasına gider ve "Görev paneli" düğmesi hiç basılmaz. Ayardan açılır.
    var DRAWER_ENABLED = $console.data('detail-panel') === true;
    var ROLE_PRESET = String($console.data('role-preset') || 'pm');

    var PAGE_SIZE = 100;
    // Bu sınırın altında TÜM projeler yüklenir; böylece çip sayaçları, risk KPI'ı
    // ve sıralama sayfalanmış bir alt kümeye değil gerçek kümeye bakar. Üstünde
    // "Daha fazla yükle" düğmesi kalır ve sayaçlar "yüklenen" olarak etiketlenir.
    var AUTOLOAD_MAX = 500;
    // Liste görünümünün kolonlarının sığdığı en dar kap (apya-shell.css §22.9
    // merdiveninin tabanı). Altında kart moduna düşülür.
    var LIST_MIN_WIDTH = 820;

    // ------------------------------------------------------------------ DURUM
    var state = {
        items: [],
        totalCount: 0,
        loading: false,
        truncated: false,      // AUTOLOAD_MAX'a takıldı mı?
        query: '',
        filter: 'all',         // all | risk | overdue | week | grant | event
        sort: 'urgency',       // urgency | name | budget | progress
        view: DEFAULT_VIEW,    // card | list
        density: 'cozy',       // cozy | tight
        myScope: false,        // yalnız bana atanmış görevi olan projeler
        narrow: false,         // kap listeyi taşıyamıyor
        openProjectId: null,
        taskKpi: { overdue: null, upcoming: null }
    };

    // ------------------------------------------------------------- KALICILIK
    var STORE = 'apya.projects.';
    function readStore(key, fallback) {
        try {
            var v = window.localStorage.getItem(STORE + key);
            return v === null ? fallback : v;
        } catch (e) { return fallback; }
    }
    function writeStore(key, value) {
        try { window.localStorage.setItem(STORE + key, value); } catch (e) { /* özel kip */ }
    }

    function restorePreferences() {
        // Görünüm: localStorage (cihaz) > Ayarlar ekranı tercihi (sunucu).
        var view = readStore('view', null);
        state.view = (view === 'list' || view === 'card') ? view : DEFAULT_VIEW;

        var density = readStore('density', null);
        state.density = density === 'tight' ? 'tight' : 'cozy';

        var sort = readStore('sort', null);
        state.sort = ['urgency', 'name', 'budget', 'progress'].indexOf(sort) >= 0 ? sort : null;

        var filter = readStore('filter', null);
        state.filter = FILTER_KEYS.indexOf(filter) >= 0 ? filter : null;

        var scope = readStore('scope', null);
        state.myScope = scope === null ? null : scope === 'me';

        // İlk ziyaret (hiç seçim yok) → rol ön ayarı. Sonraki ziyaretlerde
        // kullanıcının kendi seçimi geçerli; ön ayar bir daha uygulanmaz.
        var preset = ROLE_PRESETS[ROLE_PRESET] || ROLE_PRESETS.pm;
        if (state.sort === null) { state.sort = preset.sort; }
        if (state.filter === null) { state.filter = preset.filter; }
        if (state.myScope === null) { state.myScope = preset.myScope; }
    }

    // Ön ayar sıralamayı ve kapsamı belirler; FİLTRE daima 'all' başlar. Rol
    // gereği daraltılmış bir filtreyle açmak (risk/overdue) çoğu kiracıda boş
    // liste üretip "projelerim kayboldu" izlenimi veriyordu.
    var ROLE_PRESETS = {
        // Yönetici: özet + risk — riskli projeler sıralamada öne çıkar.
        admin: { label: 'Yönetici görünümü', filter: 'all', sort: 'urgency', myScope: false },
        // PM: proje + gecikmiş görev.
        pm: { label: 'PM görünümü', filter: 'all', sort: 'urgency', myScope: false },
        // Saha: kendi görevleri — kapsam rozetten açılıp kapatılabilir.
        field: { label: 'Saha görünümü', filter: 'all', sort: 'urgency', myScope: true }
    };

    // ---------------------------------------------------------- YARDIMCILAR
    function esc(s) {
        return $('<div>').text(s === null || s === undefined ? '' : String(s)).html();
    }

    function money(v, cur) {
        try {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency', currency: (cur && cur !== '***') ? cur : 'TRY', maximumFractionDigits: 0
            }).format(v || 0);
        } catch (e) {
            return (v || 0) + ' ' + (cur || 'TRY');
        }
    }

    function fmtDate(iso) {
        if (!iso) { return null; }
        return luxon.DateTime.fromISO(iso, { locale: abp.localization.currentCulture.name })
            .toLocaleString(luxon.DateTime.DATE_SHORT);
    }

    function fmtDayMonth(iso) {
        if (!iso) { return null; }
        return luxon.DateTime.fromISO(iso).toFormat('dd.MM');
    }

    function dateRange(p) {
        var a = fmtDate(p.startDate), b = fmtDate(p.endDate);
        if (a && b) { return a + ' – ' + b; }
        return a || b || 'tarih girilmemiş';
    }

    /// Liste "Süre" kolonu için kısa aralık — tasarımdaki "10.01 – 30.09.2026"
    /// biçimi. Tam biçim (iki kez yıl) 128px'lik kolona sığmıyor ve satırların
    /// neredeyse tamamı üç noktayla kırpılıyordu; yıl aynıysa başta tekrarlanmaz.
    function dateRangeShort(p) {
        if (!p.startDate || !p.endDate) { return dateRange(p); }
        var s = luxon.DateTime.fromISO(p.startDate), e = luxon.DateTime.fromISO(p.endDate);
        return s.year === e.year
            ? s.toFormat('dd.MM') + ' – ' + e.toFormat('dd.MM.yyyy')
            : s.toFormat('dd.MM.yy') + ' – ' + e.toFormat('dd.MM.yy');
    }

    function lower(s) { return (s || '').toLocaleLowerCase('tr'); }

    // Kategori artık sabit enum değil, kiracının düzenleyebildiği bir tanım: ad, ikon
    // ve renk DTO ile birlikte gelir. Sunucu doldurmadıysa (kategori silinmiş) nötr
    // görünüme düşülür.
    // systemKey: 0 = Diğer/Genel, 1 = Hibe, 2 = Etkinlik, null = kullanıcı kategorisi.
    var SYSTEM_OTHER = 0;
    function category(p) {
        var tone = p.categoryTone || 'neutral';
        return {
            // "Diğer / Genel" rozet basmaz — her projede görünen etiket bilgi taşımaz.
            label: (p.categorySystemKey === SYSTEM_OTHER) ? null : (p.categoryName || null),
            chip: (p.categorySystemKey === SYSTEM_OTHER) ? null : ('apya-chip-' + tone),
            icon: p.categoryIcon || 'fa-diagram-project',
            box: 'kpi-icon-box--' + tone
        };
    }

    var STATUS_TONE = { 'Aktif': 'positive', 'Risk': 'negative', 'Planlama': 'neutral' };

    // ============================================================ RİSK (§5)
    // TEK FONKSİYON: liste, kart, mobil ve panel hepsi bunu kullanır.
    //   overdue >= 2 || daysLeft < 0  → high   (danger)
    //   overdue == 1 || daysLeft <= 7 → med    (warning)
    //   aksi hâlde                    → none   (nötr)
    function riskOf(p) {
        var overdue = p.overdueTaskCount || 0;
        var daysLeft = (p.daysRemaining === null || p.daysRemaining === undefined) ? null : p.daysRemaining;
        if (overdue >= 2 || (daysLeft !== null && daysLeft < 0)) { return 'high'; }
        if (overdue === 1 || (daysLeft !== null && daysLeft <= 7)) { return 'med'; }
        return 'none';
    }
    function riskEdgeClass(p) {
        var r = riskOf(p);
        return 'apya-proj-edge' + (r === 'high' ? ' is-high' : (r === 'med' ? ' is-med' : ''));
    }

    // ==================================================== FİLTRE / SIRALAMA
    var FILTERS = [
        { key: 'all', label: 'Tümü', test: function () { return true; } },
        { key: 'risk', label: 'Riskli', risky: true, test: function (p) { return riskOf(p) === 'high'; } },
        { key: 'overdue', label: 'Gecikmiş görevi olan', test: function (p) { return (p.overdueTaskCount || 0) > 0; } },
        { key: 'week', label: 'Bu hafta biten', test: function (p) { return p.daysRemaining !== null && p.daysRemaining !== undefined && p.daysRemaining >= 0 && p.daysRemaining <= 7; } },
        // Bu iki filtre DAVRANIŞ anahtarına bakar, kategori adına değil: kiracı sistem
        // kategorisini yeniden adlandıramaz ama kendi kategorisine "Hibe" diyebilir —
        // ada bakılsa o projeler de hibe sayılırdı.
        { key: 'grant', label: 'Hibe', test: function (p) { return p.categorySystemKey === 1; } },
        { key: 'event', label: 'Etkinlik', test: function (p) { return p.categorySystemKey === 2; } }
    ];
    var FILTER_KEYS = FILTERS.map(function (f) { return f.key; });
    function filterByKey(key) {
        for (var i = 0; i < FILTERS.length; i++) { if (FILTERS[i].key === key) { return FILTERS[i]; } }
        return FILTERS[0];
    }

    // Arama + kapsam: çip sayaçlarının paydası. Çip sayıları bu küme üzerinden
    // hesaplanır ki "Riskli 2" derken filtreye basınca 2 sonuç çıksın.
    function scoped() {
        var q = lower(state.query);
        return state.items.filter(function (p) {
            if (state.myScope && !p.isAssignedToMe) { return false; }
            if (!q) { return true; }
            return lower(p.name).indexOf(q) >= 0
                || lower(p.code).indexOf(q) >= 0
                || lower(p.customerName).indexOf(q) >= 0;
        });
    }

    var RISK_RANK = { high: 0, med: 1, none: 2 };
    function sortItems(list) {
        var out = list.slice();
        if (state.sort === 'name') {
            out.sort(function (a, b) { return (a.name || '').localeCompare(b.name || '', 'tr'); });
        } else if (state.sort === 'budget') {
            out.sort(function (a, b) { return (b.totalBudget || 0) - (a.totalBudget || 0); });
        } else if (state.sort === 'progress') {
            out.sort(function (a, b) { return (b.progressPercent || 0) - (a.progressPercent || 0); });
        } else {
            // Aciliyet: önce risk bandı, sonra kalan gün (tarihsiz en sona), sonra gecikme.
            out.sort(function (a, b) {
                var r = RISK_RANK[riskOf(a)] - RISK_RANK[riskOf(b)];
                if (r !== 0) { return r; }
                var da = (a.daysRemaining === null || a.daysRemaining === undefined) ? Infinity : a.daysRemaining;
                var db = (b.daysRemaining === null || b.daysRemaining === undefined) ? Infinity : b.daysRemaining;
                if (da !== db) { return da - db; }
                return (b.overdueTaskCount || 0) - (a.overdueTaskCount || 0);
            });
        }
        return out;
    }

    function visible() {
        return sortItems(scoped().filter(filterByKey(state.filter).test));
    }

    function hasActiveNarrowing() {
        return state.filter !== 'all' || !!state.query || state.myScope;
    }

    // ============================================================ PARÇALAR
    function chip(tone, text, icon) {
        return '<span class="apya-chip apya-chip-' + tone + '">' +
            (icon ? '<i class="fa ' + icon + '"></i>' : '') + esc(text) + '</span>';
    }

    function daysChipHtml(p) {
        if (p.daysRemaining === null || p.daysRemaining === undefined) { return ''; }
        var d = p.daysRemaining;
        if (d < 0) { return chip('negative', 'Süre doldu', 'fa-hourglass-half'); }
        if (d === 0) { return chip('negative', 'Bugün bitiyor', 'fa-hourglass-half'); }
        return chip(d <= 7 ? 'warning' : 'neutral', d + ' gün kaldı', 'fa-hourglass-half');
    }

    function daysTextHtml(p) {
        if (p.daysRemaining === null || p.daysRemaining === undefined) {
            return '<div class="apya-proj-days">tarih yok</div>';
        }
        var d = p.daysRemaining;
        var cls = d < 0 ? ' is-negative' : (d <= 7 ? ' is-warning' : '');
        var text = d < 0 ? (-d) + ' gün gecikti' : (d === 0 ? 'bugün bitiyor' : d + ' gün kaldı');
        return '<div class="apya-proj-days apya-numeric' + cls + '">' + text + '</div>';
    }

    function budgetBarHtml(p, compact) {
        if (!CAN_VIEW_BUDGET) { return ''; }
        var total = p.totalBudget || 0;
        var spent = p.spentBudget || 0;
        var pct = total > 0 ? Math.round(100 * spent / total) : 0;
        var tone = pct > 100 ? ' is-negative' : (pct > 80 ? ' is-warning' : '');
        var right = compact
            ? '<span class="apya-numeric">' + money(total, p.currency) + '</span>'
            : '<span class="apya-numeric">' + money(spent, p.currency) + ' / ' + money(total, p.currency) + '</span>';
        var left = compact
            ? '<span class="apya-numeric">' + money(spent, p.currency) + '</span>'
            : '<span>Bütçe</span>';
        return '<div class="apya-proj-bar-label">' + left + right + '</div>' +
            '<div class="apya-mini-progress' + tone + '"><span style="width:' + Math.min(pct, 100) + '%"></span></div>';
    }

    function progressBarHtml(p, compact) {
        var pct = p.progressPercent || 0;
        var tasks = (p.taskCount || 0) > 0
            ? p.completedTaskCount + '/' + p.taskCount + (compact ? '' : ' görev')
            : 'görev yok';
        var left = compact
            ? '<span class="apya-numeric">%' + pct + '</span>'
            : '<span>İlerleme</span>';
        var right = compact
            ? '<span class="apya-numeric">' + tasks + '</span>'
            : '<span class="apya-numeric">%' + pct + ' · ' + tasks + '</span>';
        return '<div class="apya-proj-bar-label">' + left + right + '</div>' +
            '<div class="apya-mini-progress is-progress"><span style="width:' + pct + '%"></span></div>';
    }

    function facepileHtml(p, emptyText) {
        if (!p.assigneeCount) {
            return emptyText ? '<span class="apya-proj-no-team">Kişi atanmamış</span>' : '';
        }
        var shown = (p.assigneeInitials || []).slice(0, 2);
        var rest = p.assigneeCount - shown.length;
        return '<div class="apya-tile-avatars" title="' + p.assigneeCount + ' kişi atanmış">' +
            shown.map(function (i) { return '<span class="apya-tile-avatar">' + esc(i) + '</span>'; }).join('') +
            (rest > 0 ? '<span class="apya-tile-avatar is-more">+' + rest + '</span>' : '') +
            '</div>';
    }

    function overdueMeta(p) {
        if (p.overdueTaskCount > 0) {
            return p.oldestOverdueDays !== null && p.oldestOverdueDays !== undefined
                ? 'en eski ' + p.oldestOverdueDays + ' gün'
                : '';
        }
        var next = fmtDayMonth(p.nextDueDate);
        return next ? 'sonraki ' + next : '';
    }

    // ================================================================ LİSTE
    // Satır/kart ⋯ düğmesi. Menünün KENDİSİ burada basılmaz: .apya-proj-card
    // `overflow:hidden` taşıyor, kart içine konan menü kırpılırdı. Sayfa kökündeki
    // tek #ProjectMoneyMenu açılışta buraya konumlanır.
    function moreButtonHtml(p) {
        return '' +
            '<button type="button" class="btn btn-sm btn-outline-secondary apya-proj-more" data-stop' +
            ' data-id="' + p.id + '" aria-haspopup="true" aria-expanded="false"' +
            ' title="Proje menüsü" aria-label="' + esc(p.name) + ' menüsü">' +
            '<i class="fa fa-ellipsis"></i></button>';
    }

    function rowHtml(p) {
        var cat = category(p);
        var chips = [];
        if (p.displayStatus) { chips.push(chip(STATUS_TONE[p.displayStatus] || 'neutral', p.displayStatus)); }
        if (cat.label) { chips.push('<span class="apya-chip ' + cat.chip + '">' + cat.label + '</span>'); }

        var overduePill = p.overdueTaskCount > 0
            ? '<span class="apya-chip apya-chip-negative apya-proj-overdue-pill"><i class="fa fa-clock-rotate-left"></i>' + p.overdueTaskCount + '</span>'
            : '<span class="apya-chip apya-chip-neutral apya-proj-overdue-pill">—</span>';

        return '' +
            '<div class="apya-proj-row" role="button" tabindex="0" data-id="' + p.id + '"' +
            ' aria-label="' + esc(p.name) + ' görev panelini aç">' +
            '<span class="' + riskEdgeClass(p) + '"></span>' +
            '<div class="apya-proj-name-cell">' +
            '  <span class="kpi-icon-box kpi-icon-box--xs ' + cat.box + '"><i class="fa ' + cat.icon + '"></i></span>' +
            '  <div style="min-width:0">' +
            '    <div class="apya-proj-name">' + esc(p.name) + '</div>' +
            '    <div class="apya-proj-name-sub">' +
            '      <span class="apya-proj-code apya-numeric">' + esc(p.code) + '</span>' + chips.join('') +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="apya-proj-cell apya-proj-col-client apya-proj-client">' + (esc(p.customerName) || '—') + '</div>' +
            '<div class="apya-proj-cell apya-proj-col-duration">' +
            '  <div class="apya-proj-range apya-numeric" title="' + esc(dateRange(p)) + '">' + esc(dateRangeShort(p)) + '</div>' +
            daysTextHtml(p) +
            '</div>' +
            '<div class="apya-proj-cell apya-proj-col-budget">' + (budgetBarHtml(p, true) || '<span class="apya-proj-days">—</span>') + '</div>' +
            '<div class="apya-proj-cell">' + progressBarHtml(p, true) + '</div>' +
            '<div class="apya-proj-cell">' + overduePill + '</div>' +
            '<div class="apya-proj-cell apya-proj-col-team apya-proj-team">' + facepileHtml(p, false) + '</div>' +
            '<div class="apya-proj-cell apya-proj-row-actions">' +
            '  <a class="btn btn-sm btn-outline-secondary" href="/Projects/ProjectDetails/' + p.id + '"' +
            '     data-stop title="Proje detayına git"><i class="fa fa-list-check me-1"></i>Detay</a>' +
            moreButtonHtml(p) +
            '</div>' +
            '</div>';
    }

    // ================================================================= KART
    function cardHtml(p) {
        var cat = category(p);
        var chips = [];
        if (riskOf(p) === 'high') { chips.push(chip('negative', 'Risk')); }
        if (p.displayStatus && p.displayStatus !== 'Risk') { chips.push(chip(STATUS_TONE[p.displayStatus] || 'neutral', p.displayStatus)); }
        if (cat.label) { chips.push('<span class="apya-chip ' + cat.chip + '">' + cat.label + '</span>'); }
        chips.push(daysChipHtml(p));

        var box = p.overdueTaskCount > 0
            ? '<div class="apya-proj-overdue-box">' +
              '  <i class="fa fa-clock-rotate-left" aria-hidden="true"></i>' +
              '  <span>' + p.overdueTaskCount + ' gecikmiş görev</span>' +
              '  <span class="apya-proj-overdue-meta">' + esc(overdueMeta(p)) + '</span>' +
              '</div>'
            : '<div class="apya-proj-overdue-box is-clear">' +
              '  <i class="fa fa-check" aria-hidden="true"></i>' +
              '  <span>Gecikmiş görev yok</span>' +
              '  <span class="apya-proj-overdue-meta">' + esc(overdueMeta(p)) + '</span>' +
              '</div>';

        var budget = budgetBarHtml(p, false);

        // Kapak görseli varsa kategori ikon kutusunun YERİNE geçer — aynı 40px
        // yuva, yani kartın yüksekliği görselli/görselsiz aynı kalır.
        var thumb = p.coverImageFileName
            ? '<span class="apya-proj-card-cover" aria-hidden="true">' +
              '<img src="/file/get/' + encodeURIComponent(p.coverImageFileName) + '" alt=""></span>'
            : '<span class="kpi-icon-box kpi-icon-box--sm ' + cat.box + '"><i class="fa ' + cat.icon + '"></i></span>';

        return '' +
            '<div class="apya-tile apya-proj-card" role="button" tabindex="0" data-id="' + p.id + '"' +
            ' aria-label="' + esc(p.name) + (DRAWER_ENABLED ? ' görev panelini aç' : ' projesinin detayını aç') + '">' +
            '<span class="' + riskEdgeClass(p) + '"></span>' +
            '<div class="apya-proj-card-head">' +
            thumb +
            '  <div style="flex:1 1 auto;min-width:0">' +
            '    <div class="apya-proj-card-title">' + esc(p.name) + '</div>' +
            '    <div class="apya-proj-card-sub">' +
            '      <span class="apya-numeric">' + esc(p.code) + '</span><span>·</span>' +
            '      <span class="apya-proj-client">' + (esc(p.customerName) || 'müşteri girilmemiş') + '</span>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="apya-proj-chips">' + chips.join('') + '</div>' +
            '<div class="apya-tile-progress-group">' +
            (budget ? '<div>' + budget + '</div>' : '') +
            '  <div>' + progressBarHtml(p, false) + '</div>' +
            '</div>' +
            box +
            '<div class="apya-proj-card-foot">' +
            facepileHtml(p, true) +
            '  <div class="apya-proj-card-actions">' +
            '    <a class="btn btn-sm btn-outline-secondary" href="/Projects/ProjectDetails/' + p.id + '" data-stop>' +
            '      <i class="fa fa-list-check me-1"></i>Detay</a>' +
            moreButtonHtml(p) +
            '  </div>' +
            '</div>' +
            '</div>';
    }

    function newCardHtml() {
        return '' +
            '<button type="button" class="apya-proj-new-card" data-new-project>' +
            '  <span class="kpi-icon-box kpi-icon-box--sm kpi-icon-box--accent"><i class="fa fa-plus"></i></span>' +
            '  <span class="apya-proj-new-card-title">Yeni proje</span>' +
            '  <span class="apya-proj-new-card-desc">Hibe veya etkinlik şablonundan başlayın; görev takvimi hazır gelir.</span>' +
            '</button>';
    }

    // ============================================ KURULUM İPUCU ŞERİDİ
    // Eski "odak kartı"nın yerini alır. Tek projesi olan hesapta kart ızgarası
    // AYNEN kalır (tasarım tek: kart), eksikler ızgaranın ÜSTÜNDE tek satırlık
    // bir şeritte listelenir — kart ne uzar ne biçim değiştirir.
    function stepsHtml(p) {
        var steps = [];
        if (!(p.taskCount > 0)) { steps.push(['fa-circle-plus', 'Görev ekle']); }
        if (!p.customerName) { steps.push(['fa-building', 'Müşteri bağla']); }
        if (p.daysRemaining === null || p.daysRemaining === undefined || p.daysRemaining <= 0) {
            steps.push(['fa-calendar', 'Bitiş tarihini güncelle']);
        }
        if (!steps.length) { return ''; }

        return '' +
            '<div class="apya-proj-steps-strip">' +
            '  <span class="apya-proj-steps-strip-title">' +
            '    <i class="fa fa-lightbulb" aria-hidden="true"></i>' +
            'Bu projeyi tamamlamak için ' + steps.length + ' adım kaldı</span>' +
            steps.map(function (s) {
                return '<span class="apya-proj-step-chip"><i class="fa ' + s[0] + '" aria-hidden="true"></i>' +
                    esc(s[1]) + '</span>';
            }).join('') +
            (CAN_EDIT
                ? '<a class="apya-proj-steps-strip-link" href="/Projects/Edit/' + p.id + '">' +
                  '<i class="fa fa-pen" aria-hidden="true"></i>Projeyi düzenle</a>'
                : '') +
            '</div>';
    }

    // =============================================================== RENDER
    function renderKpis() {
        var all = state.items;

        $('#KpiActiveProjects').text(all.filter(function (p) { return p.displayStatus !== 'Planlama'; }).length);
        if (CAN_VIEW_BUDGET) {
            $('#KpiTotalBudget').text(money(all.reduce(function (s, p) { return s + (p.totalBudget || 0); }, 0)));
        }
        $('#KpiAvgProgress').text('%' + (all.length
            ? Math.round(all.reduce(function (s, p) { return s + (p.progressPercent || 0); }, 0) / all.length)
            : 0));
        // Risk KPI'ı çip sayacıyla ve satır kenarlarıyla AYNI fonksiyondan gelir;
        // aksi hâlde "şeritte 2, ekranda 3 kırmızı kenar" tutarsızlığı olurdu.
        $('#KpiAtRisk').text(all.filter(function (p) { return riskOf(p) === 'high'; }).length);

        // Görev sayaçları proje kaydında değil, görev servisinde. Yüklenene kadar
        // yerel toplam gösterilir ki şerit hiç boş kalmasın.
        $('#KpiOverdueTasks').text(state.taskKpi.overdue !== null
            ? state.taskKpi.overdue
            : all.reduce(function (s, p) { return s + (p.overdueTaskCount || 0); }, 0));
        $('#KpiUpcomingTasks').text(state.taskKpi.upcoming !== null ? state.taskKpi.upcoming : '—');

        $console.find('[data-kpi-filter]').each(function () {
            var active = $(this).data('kpi-filter') === state.filter;
            $(this).toggleClass('is-active', active).attr('aria-pressed', active ? 'true' : 'false');
        });
    }

    function renderFilters() {
        // Hiç proje yokken çip şeridi "Tümü 0 · Riskli 0 · …" diye gürültü olur;
        // boş durum ekranı zaten ne yapılacağını söylüyor.
        // Sarmalayıcı gizlenir, iç kap değil: mobilde sıralama kutusu da orada
        // duruyor ve hiç proje yokken sıralanacak bir şey de yok.
        $('#ProjectsFilterBar').prop('hidden', state.items.length === 0);
        if (state.items.length === 0) { $('#ProjectsFilters').empty(); return; }

        var base = scoped();
        var html = FILTERS.map(function (f) {
            var count = base.filter(f.test).length;
            // is-empty: sayısı 0 olan çip mobilde basılmaz (apya-shell.css §22.10).
            // "Tümü" dışarıda — o sıfırlama çipi, sayısı 0 olsa da kalmalı.
            var cls = 'apya-chip apya-proj-filter' +
                (f.risky ? ' is-risk' : '') +
                (count === 0 && f.key !== 'all' ? ' is-empty' : '') +
                (state.filter === f.key ? ' is-active' : '');
            return '<button type="button" class="' + cls + '" data-filter="' + f.key + '"' +
                ' aria-pressed="' + (state.filter === f.key ? 'true' : 'false') + '">' +
                f.label + ' <span class="apya-proj-filter-count">' + count + '</span></button>';
        }).join('');

        html += '<button type="button" class="apya-proj-filter-clear" id="ProjectsClearFilters"' +
            (hasActiveNarrowing() ? '' : ' hidden') + '>Filtreleri temizle</button>';

        $('#ProjectsFilters').html(html);
    }

    function renderToolbar() {
        $console.toggleClass('is-tight', state.density === 'tight');
        $console.find('[data-density]').each(function () {
            $(this).toggleClass('is-active', $(this).data('density') === state.density);
        });

        var effectiveView = state.narrow ? 'card' : state.view;
        $console.find('[data-view]').each(function () {
            var v = $(this).data('view');
            $(this).toggleClass('is-active', v === effectiveView)
                .prop('disabled', state.narrow && v === 'list')
                .attr('title', (state.narrow && v === 'list')
                    ? 'Liste görünümü bu genişlikte kullanılamıyor'
                    : (v === 'list' ? 'Liste görünümü' : 'Kart görünümü'));
        });

        $('#ProjectsSort').val(state.sort);
        $('#ProjectsSearchClear').prop('hidden', !state.query);

        var preset = ROLE_PRESETS[ROLE_PRESET] || ROLE_PRESETS.pm;
        $('#ProjectsRoleChipText').text(preset.label + (state.myScope ? ' · yalnız bana atananlar' : ' · tüm projeler'));
        $('#ProjectsRoleChip').attr('aria-pressed', state.myScope ? 'true' : 'false')
            .attr('title', state.myScope
                ? 'Yalnız size atanmış görevi olan projeler listeleniyor — tümüne dönmek için tıklayın'
                : 'Yalnız size atanmış görevi olan projeleri göstermek için tıklayın');

        var list = visible();
        var narrowed = hasActiveNarrowing();
        $('#ProjectsCount').text(
            state.items.length === 0 ? '' :
            (narrowed ? list.length + ' / ' + state.items.length + ' proje'
                      : state.totalCount + ' proje') +
            (state.truncated ? ' (ilk ' + state.items.length + ')' : '')
        );
    }

    function renderBody() {
        var list = visible();
        var effectiveView = state.narrow ? 'card' : state.view;

        var noProjectsAtAll = state.items.length === 0 && !state.loading;
        var noResult = state.items.length > 0 && list.length === 0;
        // Kurulum ipucu şeridi YALNIZ kiracının gerçekten tek projesi varken —
        // filtre bir sonuca indiği için değil. Görünüm biçimi değişmez, yalnız
        // ızgaranın üstüne bir satır eklenir.
        var singleProject = state.items.length === 1 && list.length === 1 && !noResult;
        var stepsMarkup = singleProject ? stepsHtml(list[0]) : '';

        $('#ProjectsEmpty').prop('hidden', !noProjectsAtAll);
        $('#ProjectsNoResult').prop('hidden', !noResult);
        $('#ProjectsSteps').prop('hidden', !stepsMarkup).html(stepsMarkup);
        $('#ProjectsList').prop('hidden', noProjectsAtAll || noResult || effectiveView !== 'list');
        $('#ProjectsGrid').prop('hidden', noProjectsAtAll || noResult || effectiveView !== 'card');

        if (noResult) {
            $('#ProjectsNoResultHint').text(state.query
                ? '"' + state.query + '" için ' + filterByKey(state.filter).label.toLocaleLowerCase('tr') + ' filtresinde sonuç yok.'
                : filterByKey(state.filter).label + ' filtresinde proje yok.');
            $('#ProjectsListBody').empty();
            $('#ProjectsGrid').empty();
        } else if (effectiveView === 'list') {
            $('#ProjectsListBody').html(list.map(rowHtml).join(''));
            $('#ProjectsGrid').empty();
        } else {
            $('#ProjectsGrid').html(list.map(cardHtml).join('') + (CAN_CREATE ? newCardHtml() : ''));
            $('#ProjectsListBody').empty();
        }

        // Açık panelin satırı/kartı işaretli kalsın.
        if (state.openProjectId) {
            $console.find('[data-id="' + state.openProjectId + '"]').addClass('is-open');
        }

        $('#ProjectsLoadMore').prop('hidden', state.items.length >= state.totalCount);
        renderSortIndicators();
    }

    function renderSortIndicators() {
        $console.find('[data-sort-col]').each(function () {
            $(this).toggleClass('is-sorted', $(this).data('sort-col') === state.sort);
        });
    }

    function render() {
        // Tek ölçüm noktası: bu render boyunca kap genişliği sabit kabul edilir,
        // böylece araç çubuğu ile gövde aynı "dar mı?" kararını paylaşır.
        state.narrow = isNarrow();
        renderToolbar();
        renderKpis();
        renderFilters();
        renderBody();
    }

    // ================================================== GÖREV PANELİ (§6)
    // complete: panelin görev listesi projenin TAMAMINI kapsıyor mu? Kapsamıyorsa
    // (sayfalama sınırı) proje metrikleri yerelde yeniden hesaplanmaz.
    var drawer = { projectId: null, tasks: [], loading: false, complete: false, busy: {} };

    function taskIsOpen(t) { return t.status !== 4 && t.status !== 0; }

    function taskDueHtml(t) {
        if (!t.dueDate) { return '<div class="apya-proj-task-due">son tarih yok</div>'; }
        var due = luxon.DateTime.fromISO(t.dueDate);
        var days = Math.floor(due.diff(luxon.DateTime.now(), 'days').days);
        var cls = '', text;
        if (!taskIsOpen(t)) {
            text = 'bitti · ' + due.toFormat('dd.MM.yyyy');
        } else if (days < 0) {
            cls = ' is-overdue'; text = (-days) + ' gün gecikti · ' + due.toFormat('dd.MM');
        } else if (days <= 2) {
            cls = ' is-soon'; text = (days === 0 ? 'bugün' : days + ' gün kaldı') + ' · ' + due.toFormat('dd.MM');
        } else {
            text = due.toFormat('dd.MM.yyyy');
        }
        return '<div class="apya-proj-task-due apya-numeric' + cls + '">' + text + '</div>';
    }

    function drawerHtml(p) {
        var openCount = drawer.tasks.filter(taskIsOpen).length;
        var tasksHtml;

        if (drawer.loading) {
            tasksHtml = '<div class="apya-proj-task-due">Görevler yükleniyor…</div>';
        } else if (!drawer.tasks.length) {
            tasksHtml = '<div class="apya-proj-task-due">Bu projede henüz görev yok — görev eklendikçe ilerleme buradan hesaplanır.</div>';
        } else {
            tasksHtml = drawer.tasks.map(function (t) {
                var done = !taskIsOpen(t);
                var busy = !!drawer.busy[t.id];
                return '' +
                    '<div class="apya-proj-task' + (done ? ' is-done' : '') + '" data-task-id="' + t.id + '">' +
                    '  <button type="button" class="apya-proj-check js-task-toggle" aria-pressed="' + (done ? 'true' : 'false') + '"' +
                    '    aria-label="' + esc(t.title) + ' görevini ' + (done ? 'geri al' : 'tamamla') + '"' + (busy ? ' disabled' : '') + '>' +
                    '    <i class="fa fa-check" aria-hidden="true"></i></button>' +
                    '  <div style="flex:1 1 auto;min-width:0">' +
                    '    <div class="apya-proj-task-title">' + esc(t.title) + '</div>' + taskDueHtml(t) +
                    '  </div>' +
                    (done ? '' :
                    '  <button type="button" class="apya-proj-defer js-task-defer"' + (busy ? ' disabled' : '') + '>' +
                    '    <i class="fa fa-calendar-plus" aria-hidden="true"></i>Ötele</button>') +
                    (t.assigneeName
                        ? '  <span class="apya-tile-avatar" title="' + esc(t.assigneeName) + '">' + esc(initials(t.assigneeName)) + '</span>'
                        : '') +
                    '</div>';
            }).join('');
        }

        var cat = category(p);
        return '' +
            '<div class="apya-proj-drawer-backdrop" data-drawer-close></div>' +
            '<aside class="apya-proj-drawer" role="dialog" aria-modal="true" aria-label="' + esc(p.name) + ' görevleri">' +
            '  <div class="apya-proj-drawer-head">' +
            '    <span class="kpi-icon-box kpi-icon-box--sm ' + cat.box + '"><i class="fa ' + cat.icon + '"></i></span>' +
            '    <div style="flex:1 1 auto;min-width:0">' +
            '      <div class="apya-proj-drawer-title">' + esc(p.name) + '</div>' +
            '      <div class="apya-proj-drawer-sub"><span class="apya-numeric">' + esc(p.code) + '</span> · ' +
            (esc(p.customerName) || 'müşteri girilmemiş') + '</div>' +
            '    </div>' +
            '    <button type="button" class="apya-proj-drawer-close" data-drawer-close aria-label="Paneli kapat">' +
            '      <i class="fa fa-xmark"></i></button>' +
            '  </div>' +
            '  <div class="apya-proj-drawer-body">' +
            '    <div class="apya-proj-stat-grid">' +
            (CAN_VIEW_BUDGET
                ? '      <div class="apya-proj-stat">' +
                  '        <div class="apya-overline">Bütçe</div>' +
                  '        <div class="apya-proj-stat-value apya-numeric">' + money(p.spentBudget, p.currency) + '</div>' +
                  '        <div class="apya-proj-stat-sub apya-numeric">/ ' + money(p.totalBudget, p.currency) + '</div>' +
                  '        <div class="apya-mini-progress"><span style="width:' +
                        Math.min(p.totalBudget > 0 ? Math.round(100 * (p.spentBudget || 0) / p.totalBudget) : 0, 100) + '%"></span></div>' +
                  '      </div>'
                : '') +
            '      <div class="apya-proj-stat">' +
            '        <div class="apya-overline">İlerleme</div>' +
            '        <div class="apya-proj-stat-value apya-numeric">%' + (p.progressPercent || 0) + '</div>' +
            '        <div class="apya-proj-stat-sub apya-numeric">' +
            ((p.taskCount || 0) > 0 ? p.completedTaskCount + '/' + p.taskCount + ' görev' : 'görev yok') + '</div>' +
            '        <div class="apya-mini-progress is-progress"><span style="width:' + (p.progressPercent || 0) + '%"></span></div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="apya-proj-section-head">' +
            '      <span class="apya-overline">Görevler</span>' +
            '      <span class="apya-proj-task-due apya-numeric">' + openCount + ' açık</span>' +
            '      <span class="apya-proj-section-head-rule"></span>' +
            '    </div>' +
            '    <div class="apya-proj-task-list">' + tasksHtml + '</div>' +
            '  </div>' +
            '  <div class="apya-proj-drawer-foot">' +
            (CAN_CREATE
                ? '    <button type="button" class="btn btn-primary btn-sm" id="DrawerAddTask">' +
                  '      <i class="fa fa-plus me-1"></i>Görev ekle</button>'
                : '') +
            (CAN_EDIT
                ? '    <a class="btn btn-outline-secondary btn-sm" href="/Projects/Edit/' + p.id + '">' +
                  '      <i class="fa fa-pen me-1"></i>Projeyi düzenle</a>'
                : '') +
            '  </div>' +
            '</aside>';
    }

    function initials(name) {
        if (!name) { return '?'; }
        var parts = String(name).trim().split(/\s+/);
        return (parts.length >= 2
            ? parts[0][0] + parts[parts.length - 1][0]
            : parts[0].substring(0, 2)).toLocaleUpperCase('tr');
    }

    function findProject(id) {
        for (var i = 0; i < state.items.length; i++) {
            if (state.items[i].id === id) { return state.items[i]; }
        }
        return null;
    }

    function renderDrawer() {
        var p = findProject(drawer.projectId);
        if (!p) { closeDrawer(); return; }
        $('#ProjectsDrawerRoot').html(drawerHtml(p));
    }

    function openDrawer(id) {
        // Panel kapalıysa (varsayılan): drawer'ı hiç açma, proje detay sayfasına git.
        if (!DRAWER_ENABLED) {
            window.location.href = '/Projects/ProjectDetails/' + id;
            return;
        }
        var p = findProject(id);
        if (!p) { return; }
        drawer.projectId = id;
        drawer.tasks = [];
        drawer.busy = {};
        drawer.complete = false;
        drawer.loading = true;
        state.openProjectId = id;
        renderDrawer();
        renderBody();

        if (!taskService) { drawer.loading = false; renderDrawer(); return; }
        taskService.getList({ projectId: id, maxResultCount: 200 }).then(function (res) {
            if (drawer.projectId !== id) { return; }
            // Açık görevler önce (son tarihe göre), tamamlananlar en sonda.
            // Yalnız tarihe göre sıralarsak 40 gün önce bitmiş bir görev listenin
            // başına oturuyor ve panelin ilk onay kutusu yanlış görevi gösteriyordu.
            drawer.tasks = (res.items || []).slice().sort(function (a, b) {
                var oa = taskIsOpen(a) ? 0 : 1, ob = taskIsOpen(b) ? 0 : 1;
                if (oa !== ob) { return oa - ob; }
                var da = a.dueDate ? Date.parse(a.dueDate) : Infinity;
                var db = b.dueDate ? Date.parse(b.dueDate) : Infinity;
                return da - db;
            });
            drawer.loading = false;
            // Metrikleri panelin listesinden yalnız liste TAMSA yeniden hesapla.
            // Sayfalama sınırına takıldıysak elimizdeki alt küme sunucunun doğru
            // sayılarını bozardı (200 görevlik bir projede "%50 · 100/200" gibi).
            drawer.complete = (res.totalCount || 0) <= drawer.tasks.length;
            if (drawer.complete) { recomputeProject(p, drawer.tasks); }
            renderDrawer();
            render();
        }).catch(function () {
            drawer.loading = false;
            renderDrawer();
        });
    }

    function closeDrawer() {
        drawer.projectId = null;
        drawer.tasks = [];
        state.openProjectId = null;
        $('#ProjectsDrawerRoot').empty();
        renderBody();
    }

    // Sunucudaki EnrichProgressAndRisk ile AYNI kural — panelde yapılan
    // değişiklik sayfa yenilenmeden de doğru sonucu versin.
    function recomputeProject(p, tasks) {
        var now = Date.now();
        var open = tasks.filter(taskIsOpen);
        var overdue = open.filter(function (t) { return t.dueDate && Date.parse(t.dueDate) < now; });

        p.taskCount = tasks.length;
        p.completedTaskCount = tasks.filter(function (t) { return t.status === 4; }).length;
        p.progressPercent = p.taskCount > 0 ? Math.round(100 * p.completedTaskCount / p.taskCount) : 0;
        p.overdueTaskCount = overdue.length;
        p.oldestOverdueDays = overdue.length
            ? Math.max.apply(null, overdue.map(function (t) {
                return Math.floor((now - Date.parse(t.dueDate)) / 86400000);
            }))
            : null;

        var upcoming = open
            .filter(function (t) { return t.dueDate && Date.parse(t.dueDate) >= now; })
            .map(function (t) { return Date.parse(t.dueDate); });
        p.nextDueDate = upcoming.length ? new Date(Math.min.apply(null, upcoming)).toISOString() : null;
    }

    // Görev mutasyonu sonrası ortak kuyruk: yerel yeniden hesap → tam render →
    // arka planda görev sayaçlarını sunucudan tazele.
    //
    // "Geçmiş görev" KPI'ı proje kaydından değil görev servisinden geliyor; sunucu
    // yanıtını beklemek şeridi bir tur bayat bırakırdı. Bu yüzden projenin gecikme
    // sayısındaki YEREL fark şeride hemen uygulanır, arka plandaki çağrı da tam
    // değeri getirip üzerine yazar.
    function afterTaskMutation() {
        var p = findProject(drawer.projectId);
        // drawer.complete false ise (görev listesi sayfalama sınırına takıldı)
        // yerel yeniden hesap yapılmaz; sayılar sunucu tazelemesiyle güncellenir.
        if (p && drawer.complete) {
            var before = p.overdueTaskCount || 0;
            recomputeProject(p, drawer.tasks);
            var delta = (p.overdueTaskCount || 0) - before;
            if (delta !== 0 && state.taskKpi.overdue !== null) {
                state.taskKpi.overdue = Math.max(0, state.taskKpi.overdue + delta);
            }
        }
        renderDrawer();
        render();
        loadTaskKpis();
    }

    // ============================================================== YÜKLEME
    function load(append) {
        state.loading = true;
        return projectService.getList({
            skipCount: append ? state.items.length : 0,
            maxResultCount: PAGE_SIZE,
            sorting: 'name asc'
        }).then(function (res) {
            state.totalCount = res.totalCount;
            state.items = append ? state.items.concat(res.items || []) : (res.items || []);
            state.loading = false;

            // Çip sayaçları ve risk KPI'ı gerçek kümeye baksın diye kalan
            // sayfalar kendiliğinden çekilir (AUTOLOAD_MAX'a kadar).
            if (state.items.length < state.totalCount) {
                if (state.items.length < AUTOLOAD_MAX) {
                    render();
                    return load(true);
                }
                state.truncated = true;
            }
            render();
        }).catch(function (e) {
            state.loading = false;
            render();
            throw e;
        });
    }

    function reload() {
        state.items = [];
        state.totalCount = 0;
        state.truncated = false;
        return load(false);
    }

    // Gecikmiş / 48 saat içinde dolacak GÖREV sayıları — proje kaydında değil,
    // görev servisinde. Şeritteki iki hücre bunları gösterir.
    function loadTaskKpis() {
        if (!taskService) { return; }
        var now = moment();
        taskService.getList({
            maxDueDate: now.format(), statuses: [1, 2, 3], maxResultCount: 1
        }).then(function (r) { state.taskKpi.overdue = r.totalCount; renderKpis(); });

        taskService.getList({
            minDueDate: now.format(), maxDueDate: now.clone().add(48, 'hours').format(),
            statuses: [1, 2, 3], maxResultCount: 1
        }).then(function (r) { state.taskKpi.upcoming = r.totalCount; renderKpis(); });
    }

    // ============================================================== OLAYLAR
    function setFilter(key) {
        state.filter = (state.filter === key && key !== 'all') ? 'all' : key;
        writeStore('filter', state.filter);
        render();
    }

    // --- KPI hücreleri ve filtre çipleri aynı state'i sürer.
    $console.on('click', '[data-kpi-filter]', function () {
        setFilter(String($(this).data('kpi-filter')));
    });
    $console.on('click', '[data-filter]', function () {
        setFilter(String($(this).data('filter')));
    });
    $console.on('click', '#ProjectsClearFilters', function () {
        state.filter = 'all';
        state.query = '';
        state.myScope = false;
        $('#ProjectsSearch').val('');
        writeStore('filter', 'all');
        writeStore('scope', 'all');
        render();
    });
    $('#ProjectsNoResultClear').on('click', function () {
        $console.find('#ProjectsClearFilters').trigger('click');
    });

    // --- Yoğunluk / görünüm
    $console.on('click', '[data-density]', function () {
        state.density = String($(this).data('density'));
        writeStore('density', state.density);
        render();
    });
    $console.on('click', '[data-view]', function () {
        if ($(this).prop('disabled')) { return; }
        state.view = String($(this).data('view'));
        writeStore('view', state.view);
        render();
    });

    // --- Rol rozeti = kapsam anahtarı
    $('#ProjectsRoleChip').on('click', function () {
        state.myScope = !state.myScope;
        writeStore('scope', state.myScope ? 'me' : 'all');
        render();
    });

    // --- Arama (200ms debounce)
    var searchTimer = null;
    $('#ProjectsSearch').on('input', function () {
        var val = String($(this).val() || '').trim();
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(function () {
            state.query = val;
            render();
        }, 200);
    });
    $('#ProjectsSearchClear').on('click', function () {
        $('#ProjectsSearch').val('');
        state.query = '';
        render();
        $('#ProjectsSearch').trigger('focus');
    });

    // --- Sıralama: açılır liste ve kolon başlığı aynı state'i yazar
    $('#ProjectsSort').on('change', function () {
        state.sort = String($(this).val());
        writeStore('sort', state.sort);
        render();
    });
    $console.on('click', '[data-sort-col]', function () {
        state.sort = String($(this).data('sort-col'));
        writeStore('sort', state.sort);
        render();
    });

    // --- Satır / kart → panel. data-stop taşıyan iç aksiyonlar tetiklemez.
    $console.on('click', '.apya-proj-row, .apya-proj-card', function (e) {
        if ($(e.target).closest('[data-stop]').length) { return; }
        openDrawer(String($(this).data('id')));
    });
    $console.on('keydown', '.apya-proj-row, .apya-proj-card', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') { return; }
        if ($(e.target).closest('[data-stop]').length) { return; }
        e.preventDefault();
        openDrawer(String($(this).data('id')));
    });
    // --- Panel: kapatma (dış tık + X + ESC)
    $(document).on('click', '[data-drawer-close]', function () { closeDrawer(); });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && drawer.projectId) { closeDrawer(); }
    });

    // --- Proje ⋯ menüsü ------------------------------------------------------
    // Tek örnek sayfa kökünde durur; açılışta hedef projenin adresleri yazılır ve
    // düğmenin yanına position:fixed ile yerleştirilir. Bootstrap dropdown DEĞİL:
    // menü kartın İÇİNDE doğsaydı .apya-proj-card'ın overflow:hidden'ı kırpardı.
    // Adresler Pages/Shared/_ProjectMoneyLinks.cshtml ile AYNI olmalı.
    var $moneyMenu = $('#ProjectMoneyMenu');
    var moneyMenuOwner = null;

    function moneyMenuHref(kind, id) {
        if (kind === 'detail')    { return '/Projects/ProjectDetails/' + id; }
        if (kind === 'budget')    { return '/Finance?projectId=' + id + '&tab=kalemler'; }
        if (kind === 'finance')   { return '/Finance?projectId=' + id + '&tab=genel'; }
        if (kind === 'documents') { return '/Documents/Scope?projectId=' + id; }
        if (kind === 'edit')      { return '/Projects/Edit/' + id; }
        return '#';
    }

    function closeMoneyMenu() {
        if (!moneyMenuOwner) { return; }
        $(moneyMenuOwner).attr('aria-expanded', 'false');
        moneyMenuOwner = null;
        $moneyMenu.prop('hidden', true);
    }

    function openMoneyMenu(btn) {
        var id = String($(btn).data('id'));
        if (!id) { return; }

        $moneyMenu.find('[data-link]').each(function () {
            this.setAttribute('href', moneyMenuHref(this.getAttribute('data-link'), id));
        });

        // Ölçmek için önce göster: hidden iken getBoundingClientRect sıfır döner.
        $moneyMenu.prop('hidden', false).css({ top: '0px', left: '0px' });

        var r = btn.getBoundingClientRect();
        var m = $moneyMenu[0].getBoundingClientRect();
        var gap = 4;
        // Sağ kenara hizala, ekrandan taşarsa içeri çek; altta yer yoksa yukarı aç.
        var left = Math.max(8, Math.min(r.right - m.width, window.innerWidth - m.width - 8));
        var top = (r.bottom + gap + m.height > window.innerHeight)
            ? Math.max(8, r.top - gap - m.height)
            : r.bottom + gap;

        $moneyMenu.css({ top: top + 'px', left: left + 'px' });
        moneyMenuOwner = btn;
        $(btn).attr('aria-expanded', 'true');
    }

    $console.on('click', '.apya-proj-more', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (moneyMenuOwner === this) { closeMoneyMenu(); return; }
        closeMoneyMenu();
        openMoneyMenu(this);
    });

    // Dış tık / ESC / kaydırma-boyut değişimi kapatır: menü fixed olduğu için
    // sayfa kaydığında düğmesinden kopardı.
    $(document).on('click', function (e) {
        if (moneyMenuOwner && !$(e.target).closest('#ProjectMoneyMenu').length) { closeMoneyMenu(); }
    });
    $(document).on('keydown', function (e) { if (e.key === 'Escape') { closeMoneyMenu(); } });
    window.addEventListener('scroll', closeMoneyMenu, true);
    window.addEventListener('resize', closeMoneyMenu);

    // --- Panel: görev tamamla (iyimser) / geri al
    $(document).on('click', '.js-task-toggle', function () {
        var id = String($(this).closest('[data-task-id]').data('task-id'));
        var t = drawer.tasks.filter(function (x) { return x.id === id; })[0];
        if (!t || drawer.busy[id]) { return; }

        var previous = t.status;
        t.status = taskIsOpen(t) ? 4 : 1;       // Done <-> Todo
        drawer.busy[id] = true;
        afterTaskMutation();

        taskService.updateStatus(id, t.status).then(function () {
            drawer.busy[id] = false;
            renderDrawer();
        }).catch(function () {
            t.status = previous;                 // iyimser güncelleme geri alınır
            drawer.busy[id] = false;
            afterTaskMutation();
            abp.notify.error('Görev durumu güncellenemedi.');
        });
    });

    // --- Panel: ötele (+3 gün)
    $(document).on('click', '.js-task-defer', function () {
        var id = String($(this).closest('[data-task-id]').data('task-id'));
        var t = drawer.tasks.filter(function (x) { return x.id === id; })[0];
        if (!t || drawer.busy[id]) { return; }

        var previous = t.dueDate;
        var basis = t.dueDate ? luxon.DateTime.fromISO(t.dueDate) : luxon.DateTime.now();
        t.dueDate = basis.plus({ days: 3 }).toISO();
        drawer.busy[id] = true;
        afterTaskMutation();

        taskService.defer(id, 3).then(function (updated) {
            // Sunucunun döndüğü tarih otoritedir (başlangıç kayması vb. kuralları
            // uyguluyor); iyimser tahmin onunla değiştirilir.
            if (updated && updated.dueDate) { t.dueDate = updated.dueDate; }
            drawer.busy[id] = false;
            afterTaskMutation();
        }).catch(function () {
            t.dueDate = previous;
            drawer.busy[id] = false;
            afterTaskMutation();
            abp.notify.error('Görev ötelenemedi.');
        });
    });

    // --- Silme: bu ekranda YOK. Tek yol proje düzenleme ekranının "Tehlikeli
    // bölge" sekmesi; orada silmek için proje kodunun elle yazılması gerekiyor.
    // Listeden tek tıkla silme kaldırıldı (yanlışlıkla silme riski).

    // --- Yeni proje (araç çubuğu, dashed kart, boş durum ve şablon kartları)
    // "Şablon" kartları ayrı bir şablon altyapısı DEĞİL: aynı oluşturma modalını
    // açar ve kategoriyi (Hibe/Etkinlik) önceden seçer. Kategoriye bağlı hazır
    // görev takvimi henüz yok — kart metinleri de bunu vaat etmiyor.
    // Sistem kategorilerinin Id'leri SABİTTİR (ProjectCategoryConsts.SystemIds) —
    // migration onları bu değerlerle basar, bu yüzden burada sabit yazılabilirler.
    var CATEGORY_VALUE = {
        grant: 'a1c0a7e0-0000-4000-8000-000000000001',
        event: 'a1c0a7e0-0000-4000-8000-000000000002'
    };
    var pendingCategory = null;

    var createModal = new abp.ModalManager(abp.appPath + 'Projects/CreateModal');
    createModal.onOpen(function () {
        if (!pendingCategory) { return; }
        // Kategori artık açılır liste değil, seçim kartı: kartın kendisine tıklanır
        // (gizli input'u yazmak yetmez — görünürlük kuralları o tıklamaya bağlı).
        createModal.getModal()
            .find('.apya-pform-cat[data-cat="' + pendingCategory + '"]')
            .trigger('click');
        pendingCategory = null;
    });
    createModal.onResult(function (event, data) {
        abp.notify.success(l('Notify:Project:Created'));
        // ABP sonucu "abp-ajax-success" olayından taşır: ikinci argüman
        // { responseText, statusText, xhr, $form }. Ad yanıltıcı — JSON yanıtta
        // jQuery gövdeyi ZATEN nesneye çevirmiş olur, metin geldiği hâl için de bak.
        var result = data && data.responseText;
        if (typeof result === 'string') {
            try { result = JSON.parse(result); } catch (e) { result = null; }
        }
        // "Oluştur ve görev ekle": listeye dönmek yerine doğrudan görev paneline.
        if (result && result.goToTasks && result.id) {
            window.location.href = '/Projects/ProjectDetails/' + result.id;
            return;
        }
        reload();
        loadTaskKpis();
    });
    $(document).on('click', '#NewProjectButton, [data-new-project]', function (e) {
        e.preventDefault();
        pendingCategory = CATEGORY_VALUE[String($(this).data('template') || '')] || null;
        createModal.open();
    });
    $(document).on('click', '#DrawerAddTask', function () {
        // Görev ekleme akışı proje detayında yaşıyor — panelden oraya devredilir.
        window.location.href = '/Projects/ProjectDetails/' + drawer.projectId;
    });

    $('#ProjectsLoadMore').on('click', function () { load(true); });

    // ------------------------------------------- KAP ÖLÇÜMÜ (viewport DEĞİL)
    // Genişlik HER render'da yeniden okunur; gözlemci yalnız "başka hiçbir şey
    // değişmeden sadece kap daraldı" durumunu yakalamak için var. Doğruluk
    // gözlemcinin çalışmasına bağlı DEĞİL — kenar çubuğu açılıp kapandığında
    // ResizeObserver kaçarsa bile bir sonraki render doğru genişliği görür.
    function isNarrow() {
        var width = $console[0].clientWidth;
        return width > 0 && width < LIST_MIN_WIDTH;
    }
    function measure() {
        if (isNarrow() === state.narrow) { return; }
        render();
    }
    if (window.ResizeObserver) {
        new ResizeObserver(measure).observe($console[0]);
    }
    $(window).on('resize', measure);

    // Sıralama kutusu mobilde çip şeridine taşınır ki araç çubuğu tek satıra insin
    // (§22.10). Taşıma DOM'da yapılır çünkü CSS bir öğeyi kardeş kaplar arasında
    // taşıyamaz; AYNI <select> düğümü hareket eder, jQuery olay bağı ve seçili
    // değer korunur. Masaüstünde kutu aramanın hemen ardındaki yerine döner.
    //
    // Kırılım isNarrow()/LIST_MIN_WIDTH DEĞİL 768px: o eşik liste görünümünün
    // kolonları sığıyor mu sorusunu yanıtlıyor (820px) ve kap genişliğine bakıyor;
    // buradaki eşik CSS'teki mobil bloğun eşiğiyle AYNI olmak zorunda, yoksa
    // 768–820px arasında kutu bir kapta, ona ait stiller başka kapta kalır.
    var sortBarQuery = window.matchMedia('(max-width: 768px)');
    function placeSort() {
        var $sort = $('#ProjectsSort');
        if (sortBarQuery.matches) {
            if (!$sort.parent().is('#ProjectsFilterBar')) { $('#ProjectsFilterBar').append($sort); }
        } else if (!$sort.parent().is('.apya-proj-toolbar-end')) {
            $sort.insertAfter($console.find('.apya-proj-search'));
        }
    }
    sortBarQuery.addEventListener('change', placeSort);

    // ================================================================ AÇILIŞ
    restorePreferences();
    placeSort();
    render();
    load(false);
    loadTaskKpis();
});
