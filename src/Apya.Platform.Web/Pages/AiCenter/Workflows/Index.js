$(function () {
    // AI İş Akışları — master-detail (apya-shell.css §13 deseni).
    // Liste küçük olduğundan getList tek seferde çekilir; arama client-side.
    var service = apya.platform.ai.workflows.aiWorkflow;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/Workflows/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/Workflows/EditModal');

    var state = { all: [], filtered: [], selectedId: null };

    var $md = $('#WorkflowsMd');
    var $list = $('#WorkflowsList');
    var $empty = $('#WorkflowsListEmpty');
    var $detail = $('#WorkflowDetail');

    var canManage = abp.auth.isGranted('Ai.Workflows.Manage');

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function scopeText(w) {
        var parts = [];
        if (w.documentId) { parts.push('Form'); }
        if (w.promptId) { parts.push('Prompt'); }
        return parts.length ? parts.join(' + ') : 'Tümü';
    }

    function statusChip(isActive) {
        return isActive
            ? '<span class="apya-chip apya-chip-positive">Aktif</span>'
            : '<span class="apya-chip apya-chip-neutral">Pasif</span>';
    }

    function applyFilter() {
        var q = ($('#WorkflowFilter').val() || '').toLocaleLowerCase('tr-TR').trim();
        state.filtered = !q ? state.all.slice() : state.all.filter(function (w) {
            return (w.name || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1;
        });
        renderList();
    }

    function renderList() {
        $list.empty();
        $empty.prop('hidden', state.filtered.length > 0);
        state.filtered.forEach(function (w) {
            var li = $(
                '<li><button type="button" class="apya-md-item" role="option">' +
                '  <span class="apya-md-item-body">' +
                '    <span class="apya-md-item-title d-block">' + esc(w.name) + '</span>' +
                '    <span class="apya-md-item-sub d-block">' + esc(scopeText(w)) + ' · ' + w.ruleCount + ' kural</span>' +
                '  </span>' +
                '  <span class="apya-md-item-side">' + statusChip(w.isActive) + '</span>' +
                '</button></li>'
            );
            var btn = li.find('button');
            btn.toggleClass('selected', w.id === state.selectedId)
               .attr('aria-selected', w.id === state.selectedId ? 'true' : 'false')
               .on('click', function () { select(w.id); });
            $list.append(li);
        });
        $('#WorkflowsPagerInfo').text(state.filtered.length + ' iş akışı');
    }

    function renderDetailEmpty() {
        $md.removeClass('has-selection');
        $detail.html(
            '<div class="apya-md-empty">' +
            '  <i class="fa fa-diagram-project" aria-hidden="true"></i>' +
            '  <span>Detaylarını görmek için soldaki listeden bir iş akışı seçin.</span>' +
            '</div>'
        );
    }

    function ruleRow(r) {
        return '<div class="d-flex align-items-center flex-wrap gap-2 py-2" style="border-bottom:1px solid var(--apya-border-subtle)">' +
            '  <span class="apya-chip apya-chip-neutral">' + r.order + '</span>' +
            '  <span class="apya-md-code" style="font-size:11.5px">' + esc(r.jsonPath) + '</span>' +
            '  <span class="text-muted" style="font-size:11.5px">' + esc(r.operatorText) + '</span>' +
            '  <span class="apya-md-code" style="font-size:11.5px">' + esc(r.compareValue) + '</span>' +
            '  <i class="fa fa-arrow-right text-muted" style="font-size:10px" aria-hidden="true"></i>' +
            '  <span class="apya-chip apya-chip-brand">' + esc(r.actionTypeText) + '</span>' +
            (r.actionPayload ? '<span class="apya-md-code text-muted" style="font-size:11px">' + esc(r.actionPayload) + '</span>' : '') +
            '</div>';
    }

    function renderDetail(d) {
        var rules = (d.rules || []).slice().sort(function (a, b) { return a.order - b.order; });

        var html =
            '<button type="button" class="apya-md-back" id="WorkflowDetailBack">' +
            '  <i class="fa fa-arrow-left" aria-hidden="true"></i> Listeye dön' +
            '</button>' +

            '<div class="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">' +
            '  <div class="min-w-0">' +
            '    <div class="d-flex align-items-center gap-2 flex-wrap">' +
            '      <span class="h6 mb-0">' + esc(d.name) + '</span>' + statusChip(d.isActive) +
            '    </div>' +
            '  </div>' +
            '  <div class="d-flex gap-1 flex-wrap">' +
            '    <button type="button" class="btn btn-sm btn-outline-secondary" id="WorkflowDetailRules"><i class="fa fa-list-check me-1"></i>Kurallar</button>' +
            (canManage ? '<button type="button" class="btn btn-sm btn-outline-secondary" id="WorkflowDetailEdit"><i class="fa fa-pencil me-1"></i>Düzenle</button>' : '') +
            (canManage ? '<button type="button" class="btn btn-sm btn-outline-danger" id="WorkflowDetailDelete"><i class="fa fa-trash me-1"></i>Sil</button>' : '') +
            '  </div>' +
            '</div>' +

            '<div class="row g-3 mb-3">' +
            '  <div class="col-sm-4"><div class="apya-md-overline">Kapsam</div><div style="font-size:12.5px">' + esc(scopeText(d)) + '</div></div>' +
            '  <div class="col-sm-4"><div class="apya-md-overline">Kural Sayısı</div><div class="apya-md-code" style="font-size:12.5px">' + d.ruleCount + '</div></div>' +
            '  <div class="col-sm-4"><div class="apya-md-overline">Durum</div><div style="font-size:12.5px">' + (d.isActive ? 'Aktif' : 'Pasif') + '</div></div>' +
            '</div>' +

            '<div><div class="apya-md-overline mb-1">Kurallar (koşul → aksiyon)</div>' +
            (rules.length
                ? rules.map(ruleRow).join('')
                : '<div class="text-muted" style="font-size:12px">Henüz kural yok — "Kurallar" ekranından ekleyin.</div>') +
            '</div>';

        $detail.html(html);
        $md.addClass('has-selection');

        $('#WorkflowDetailBack').on('click', function () {
            state.selectedId = null;
            renderList();
            renderDetailEmpty();
        });
        $('#WorkflowDetailRules').on('click', function () {
            window.location = abp.appPath + 'AiCenter/Workflows/Rules?id=' + d.id;
        });
        $('#WorkflowDetailEdit').on('click', function () { editModal.open({ id: d.id }); });
        $('#WorkflowDetailDelete').on('click', function () {
            abp.message.confirm('"' + d.name + '" iş akışı silinecek. Bu işlem geri alınamaz.', 'İş Akışı Silinecek')
                .then(function (confirmed) {
                    if (!confirmed) { return; }
                    service.delete(d.id).then(function () {
                        abp.notify.success('İş akışı silindi.');
                        state.selectedId = null;
                        load();
                    });
                });
        });
    }

    function select(id) {
        state.selectedId = id;
        renderList();
        service.get(id).then(renderDetail);
    }

    function load(keepSelection) {
        service.getList().then(function (result) {
            state.all = result || [];
            if (!keepSelection) { state.selectedId = null; }
            applyFilter();
            var stillThere = state.filtered.some(function (w) { return w.id === state.selectedId; });
            if (!stillThere) {
                state.selectedId = null;
                var isDesktop = window.matchMedia('(min-width: 992px)').matches;
                if (isDesktop && state.filtered.length > 0) {
                    select(state.filtered[0].id);
                } else {
                    renderList();
                    renderDetailEmpty();
                }
                return;
            }
            renderList();
            if (state.selectedId) { select(state.selectedId); }
        });
    }

    // ── Olaylar ──
    var filterDebounce;
    $('#WorkflowFilter').on('keyup', function () {
        clearTimeout(filterDebounce);
        filterDebounce = setTimeout(function () {
            applyFilter();
            // Seçili öğe filtre dışına düştüyse detayı kapat.
            if (state.selectedId && !state.filtered.some(function (w) { return w.id === state.selectedId; })) {
                state.selectedId = null;
                renderList();
                renderDetailEmpty();
            }
        }, 250);
    });

    createModal.onResult(function () { abp.notify.success('İş akışı oluşturuldu.'); load(true); });
    editModal.onResult(function () { abp.notify.success('İş akışı güncellendi.'); load(true); });

    $('#NewWorkflowButton').click(function (e) { e.preventDefault(); createModal.open(); });

    load();
});
