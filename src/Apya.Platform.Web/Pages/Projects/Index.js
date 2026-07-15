$(function () {
    // Proxy namespace ABP sürümüne göre değişebiliyor — iki bilinen yolu da dene.
    var projectService = (apya.platform.projects && apya.platform.projects.project)
        || apya.platform.application.projects.project;
    var l = abp.localization.getResource('Platform');

    var PAGE_SIZE = 48;
    var items = [];          // sunucudan yüklenen tüm kayıtlar (sayfa sayfa birikir)
    var totalCount = 0;
    var query = '';
    var canDelete = abp.auth.isGranted('Platform.Projects.Delete');

    var $grid = $('#ProjectsGrid');
    var $empty = $('#ProjectsEmpty');
    var $count = $('#ProjectsCount');
    var $more = $('#ProjectsLoadMore');

    function esc(s) {
        return $('<div>').text(s == null ? '' : String(s)).html();
    }

    function money(v, cur) {
        try {
            return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur || 'TRY', maximumFractionDigits: 0 }).format(v || 0);
        } catch (e) {
            return (v || 0) + ' ' + (cur || 'TRY');
        }
    }

    function fmtDate(iso) {
        if (!iso) { return null; }
        return luxon.DateTime.fromISO(iso, { locale: abp.localization.currentCulture.name })
            .toLocaleString(luxon.DateTime.DATE_SHORT);
    }

    var CATEGORY = {
        1: { label: 'Hibe', chip: 'apya-chip-brand' },
        2: { label: 'Etkinlik', chip: 'apya-chip-warning' }
        // 0 = Diğer/Genel → chip gösterilmez (gürültü olmasın)
    };

    function tileHtml(p) {
        var detailUrl = '/Projects/ProjectDetails/' + p.id;
        var statusChip = p.isApproved
            ? '<span class="apya-chip apya-chip-positive">Onaylı</span>'
            : '<span class="apya-chip apya-chip-neutral">Taslak</span>';
        var cat = CATEGORY[p.category];
        var catChip = cat ? '<span class="apya-chip ' + cat.chip + '">' + cat.label + '</span>' : '';

        var meta = [];
        if (p.customerName) {
            meta.push('<span title="Müşteri"><i class="fa fa-building"></i>' + esc(p.customerName) + '</span>');
        }
        var range = [fmtDate(p.startDate), fmtDate(p.endDate)].filter(Boolean).join(' – ');
        if (range) {
            meta.push('<span title="Proje süresi"><i class="fa fa-calendar"></i><span class="apya-numeric">' + range + '</span></span>');
        }

        // Bütçe mini-progress: yalnız bütçesi tanımlı projelerde
        var progress = '';
        if (p.totalBudget > 0) {
            var pct = Math.round(100 * (p.spentBudget || 0) / p.totalBudget);
            var tone = pct > 100 ? ' is-negative' : (pct > 80 ? ' is-warning' : '');
            progress =
                '<div>' +
                '  <div class="apya-tile-progress-label">' +
                '    <span>Bütçe</span>' +
                '    <span class="apya-numeric">' + money(p.spentBudget, p.currency) + ' / ' + money(p.totalBudget, p.currency) + '</span>' +
                '  </div>' +
                '  <div class="apya-mini-progress' + tone + '"><span style="width:' + Math.min(pct, 100) + '%"></span></div>' +
                '</div>';
        }

        var actions =
            '<div class="apya-tile-actions">' +
            '  <a class="btn btn-sm btn-outline-secondary" href="' + detailUrl + '"><i class="fa fa-list-check me-1"></i>Detay / Görevler</a>' +
            (canDelete
                ? '  <button type="button" class="btn btn-sm btn-outline-danger js-delete-project" data-id="' + p.id + '" data-name="' + esc(p.name) + '" title="Sil"><i class="fa fa-trash"></i></button>'
                : '') +
            '</div>';

        return (
            '<div class="apya-tile" data-id="' + p.id + '">' +
            '  <div class="apya-tile-head">' +
            '    <div>' +
            '      <div class="apya-tile-title"><a href="' + detailUrl + '">' + esc(p.name) + '</a></div>' +
            '      <div class="apya-tile-sub">' + esc(p.code) + '</div>' +
            '    </div>' +
            '    <div class="d-flex flex-column align-items-end gap-1">' + statusChip + catChip + '</div>' +
            '  </div>' +
            (meta.length ? '<div class="apya-tile-meta">' + meta.join('') + '</div>' : '') +
            progress +
            '  <div class="apya-tile-foot">' +
            '    <span title="Oluşturulma">' + (fmtDate(p.creationTime) || '') + '</span>' +
            actions +
            '  </div>' +
            '</div>'
        );
    }

    function visibleItems() {
        if (!query) { return items; }
        var q = query.toLocaleLowerCase('tr');
        return items.filter(function (p) {
            return (p.name || '').toLocaleLowerCase('tr').indexOf(q) >= 0
                || (p.code || '').toLocaleLowerCase('tr').indexOf(q) >= 0
                || (p.customerName || '').toLocaleLowerCase('tr').indexOf(q) >= 0;
        });
    }

    function render() {
        var list = visibleItems();
        $grid.html(list.map(tileHtml).join(''));
        $empty.toggle(items.length === 0);
        $grid.toggle(list.length > 0);
        if (items.length && !list.length) {
            // arama sonuçsuz — boş durumu aramaya özgü metinle göster
            $empty.show().find('.fw-semibold').text('Eşleşen proje yok');
            $empty.find('div:last').text('Farklı bir arama terimi deneyin.');
        } else if (!items.length) {
            $empty.find('.fw-semibold').text('Henüz proje yok');
            $empty.find('div:last').text('İlk projenizi ekleyerek görev ve bütçe takibine başlayın.');
        }
        $count.text(query
            ? list.length + ' / ' + totalCount + ' proje'
            : (totalCount ? totalCount + ' proje' : ''));
        $more.toggle(items.length < totalCount);
    }

    function load() {
        projectService.getList({
            skipCount: items.length,
            maxResultCount: PAGE_SIZE,
            sorting: 'name asc'
        }).then(function (res) {
            totalCount = res.totalCount;
            items = items.concat(res.items || []);
            render();
        });
    }

    function reload() {
        items = [];
        totalCount = 0;
        load();
    }

    $more.on('click', load);

    $('#ProjectsSearch').on('input', function () {
        query = ($(this).val() || '').trim();
        render();
    });

    $grid.on('click', '.js-delete-project', function () {
        var id = $(this).data('id');
        var name = $(this).data('name');
        abp.message.confirm('"' + name + '" projesini silmek istiyor musunuz?').then(function (confirmed) {
            if (!confirmed) { return; }
            projectService.delete(id).then(function () {
                abp.notify.success(l('Notify:Project:Deleted'));
                reload();
            });
        });
    });

    var createModal = new abp.ModalManager(abp.appPath + 'Projects/CreateModal');

    createModal.onResult(function () {
        reload();
        abp.notify.success(l('Notify:Project:Created'));
    });

    $('#NewProjectButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    load();
});
