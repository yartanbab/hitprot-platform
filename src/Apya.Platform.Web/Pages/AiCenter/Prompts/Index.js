$(function () {
    // Prompt Kütüphanesi — master-detail (apya-shell.css §13 deseni).
    // Sol liste: server-side sayfalı getList; sağ detay: get(id) (versiyonlar dahil).
    var service = apya.platform.ai.prompts.prompt;

    var createModal = new abp.ModalManager(abp.appPath + 'AiCenter/Prompts/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'AiCenter/Prompts/EditModal');

    var PAGE_SIZE = 20;
    var state = { skip: 0, total: 0, items: [], selectedId: null };

    var $md = $('#PromptsMd');
    var $list = $('#PromptsList');
    var $empty = $('#PromptsListEmpty');
    var $detail = $('#PromptDetail');

    var canEdit = abp.auth.isGranted('Ai.Prompts.Edit');
    var canDelete = abp.auth.isGranted('Ai.Prompts.Delete');

    // Kategori id → ad (detayda göstermek için; select zaten server-render'lı).
    var categoryNames = {};
    $('#CategoryFilter option').each(function () {
        var v = $(this).val();
        if (v) { categoryNames[v] = $(this).text(); }
    });

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function getFilterInput() {
        var status = $('#StatusFilter').val();
        return {
            filter: $('#PromptFilter').val(),
            categoryId: $('#CategoryFilter').val() || null,
            isActive: status === '' ? null : (status === 'true'),
            skipCount: state.skip,
            maxResultCount: PAGE_SIZE,
            sorting: 'code asc'
        };
    }

    function statusChip(isActive) {
        return isActive
            ? '<span class="apya-chip apya-chip-positive">Aktif</span>'
            : '<span class="apya-chip apya-chip-neutral">Pasif</span>';
    }

    function renderList() {
        $list.empty();
        $empty.prop('hidden', state.items.length > 0);
        state.items.forEach(function (p) {
            var li = $(
                '<li><button type="button" class="apya-md-item" role="option">' +
                '  <span class="apya-md-item-body">' +
                '    <span class="apya-md-item-title d-block">' + esc(p.name) + '</span>' +
                '    <span class="apya-md-item-sub d-block"><span class="apya-md-code">' + esc(p.code) + '</span> · ' + p.versionCount + ' versiyon</span>' +
                '  </span>' +
                '  <span class="apya-md-item-side">' +
                (p.activeVersionId
                    ? '<i class="fa fa-check-circle text-success" title="Yayınlı" aria-label="Yayınlı"></i>'
                    : '<span class="text-muted" style="font-size:10.5px">taslak</span>') +
                '  </span>' +
                '</button></li>'
            );
            var btn = li.find('button');
            btn.toggleClass('selected', p.id === state.selectedId)
               .attr('aria-selected', p.id === state.selectedId ? 'true' : 'false')
               .on('click', function () { select(p.id); });
            $list.append(li);
        });

        var from = state.total === 0 ? 0 : state.skip + 1;
        var to = Math.min(state.skip + PAGE_SIZE, state.total);
        $('#PromptsPagerInfo').text(state.total + ' kayıttan ' + from + '–' + to);
        $('#PromptsPrev').prop('disabled', state.skip === 0);
        $('#PromptsNext').prop('disabled', state.skip + PAGE_SIZE >= state.total);
    }

    function load(keepSelection) {
        service.getList(getFilterInput()).then(function (result) {
            state.items = result.items || [];
            state.total = result.totalCount || 0;
            if (!keepSelection) {
                state.selectedId = null;
            }
            // Masaüstünde otomatik ilk kayıt (dar ekranda kullanıcı seçer —
            // yoksa sayfa doğrudan detaya atlar).
            var stillThere = state.items.some(function (p) { return p.id === state.selectedId; });
            if (!stillThere) {
                state.selectedId = null;
                var isDesktop = window.matchMedia('(min-width: 992px)').matches;
                if (isDesktop && state.items.length > 0) {
                    state.selectedId = state.items[0].id;
                }
                renderList();
                if (state.selectedId) { select(state.selectedId); } else { renderDetailEmpty(); }
                return;
            }
            renderList();
        });
    }

    function renderDetailEmpty() {
        $md.removeClass('has-selection');
        $detail.html(
            '<div class="apya-md-empty">' +
            '  <i class="fa fa-wand-magic-sparkles" aria-hidden="true"></i>' +
            '  <span>Detaylarını görmek için soldaki listeden bir prompt seçin.</span>' +
            '</div>'
        );
    }

    function versionStatusChip(status) {
        // PromptVersionStatus: 0=Draft, 1=Published, 2=Archived (enum sırası)
        var map = {
            0: ['Taslak', 'apya-chip-neutral'],
            1: ['Yayınlı', 'apya-chip-positive'],
            2: ['Arşiv', 'apya-chip-warning']
        };
        var m = map[status] || ['?', 'apya-chip-neutral'];
        return '<span class="apya-chip ' + m[1] + '">' + m[0] + '</span>';
    }

    function renderDetail(d) {
        var activeVersion = (d.versions || []).filter(function (v) { return v.id === d.activeVersionId; })[0];
        var categoryName = d.categoryId ? (categoryNames[d.categoryId] || '—') : '—';

        var versionRows = (d.versions || [])
            .slice()
            .sort(function (a, b) { return b.versionNo - a.versionNo; })
            .slice(0, 5)
            .map(function (v) {
                return '<div class="d-flex align-items-center justify-content-between py-1" style="border-bottom:1px solid var(--apya-border-subtle)">' +
                    '  <span class="apya-md-code" style="font-size:12px">v' + v.versionNo + '</span>' +
                    '  <span style="font-size:11px" class="text-muted">' + (v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('tr-TR') : '—') + '</span>' +
                    versionStatusChip(v.status) +
                    '</div>';
            }).join('');

        var html =
            '<button type="button" class="apya-md-back" id="PromptDetailBack">' +
            '  <i class="fa fa-arrow-left" aria-hidden="true"></i> Listeye dön' +
            '</button>' +

            '<div class="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">' +
            '  <div class="min-w-0">' +
            '    <div class="d-flex align-items-center gap-2 flex-wrap">' +
            '      <span class="h6 mb-0">' + esc(d.name) + '</span>' + statusChip(d.isActive) +
            '    </div>' +
            '    <div class="mt-1"><span class="apya-md-code text-muted" style="font-size:12px">' + esc(d.code) + '</span></div>' +
            '  </div>' +
            '  <div class="d-flex gap-1 flex-wrap">' +
            (canEdit ? '<button type="button" class="btn btn-sm btn-outline-secondary" id="PromptDetailEdit"><i class="fa fa-pencil me-1"></i>Düzenle</button>' : '') +
            '    <button type="button" class="btn btn-sm btn-outline-secondary" id="PromptDetailVersions"><i class="fa fa-code-branch me-1"></i>Versiyonlar</button>' +
            (canDelete ? '<button type="button" class="btn btn-sm btn-outline-danger" id="PromptDetailDelete"><i class="fa fa-trash me-1"></i>Sil</button>' : '') +
            '  </div>' +
            '</div>' +

            '<div class="row g-3 mb-3">' +
            '  <div class="col-sm-4"><div class="apya-md-overline">Kategori</div><div style="font-size:12.5px">' + esc(categoryName) + '</div></div>' +
            '  <div class="col-sm-4"><div class="apya-md-overline">Versiyon Sayısı</div><div class="apya-md-code" style="font-size:12.5px">' + d.versionCount + '</div></div>' +
            '  <div class="col-sm-4"><div class="apya-md-overline">Yayın Durumu</div><div style="font-size:12.5px">' +
            (d.activeVersionId
                ? '<i class="fa fa-check-circle text-success me-1"></i>v' + (activeVersion ? activeVersion.versionNo : '?') + ' yayında'
                : '<span class="text-muted">— taslak —</span>') +
            '  </div></div>' +
            '</div>' +

            (d.description
                ? '<div class="mb-3"><div class="apya-md-overline mb-1">Açıklama</div><div style="font-size:12.5px;color:var(--apya-text-secondary)">' + esc(d.description) + '</div></div>'
                : '') +

            (activeVersion && activeVersion.systemPrompt
                ? '<div class="mb-3"><div class="apya-md-overline mb-1">System Prompt (v' + activeVersion.versionNo + ')</div><pre class="apya-md-pre">' + esc(activeVersion.systemPrompt) + '</pre></div>'
                : '') +
            (activeVersion && activeVersion.userPromptTemplate
                ? '<div class="mb-3"><div class="apya-md-overline mb-1">Kullanıcı Şablonu (v' + activeVersion.versionNo + ')</div><pre class="apya-md-pre">' + esc(activeVersion.userPromptTemplate) + '</pre></div>'
                : '') +

            (versionRows
                ? '<div><div class="apya-md-overline mb-1">Son Versiyonlar</div>' + versionRows + '</div>'
                : '');

        $detail.html(html);
        $md.addClass('has-selection');

        $('#PromptDetailBack').on('click', function () {
            state.selectedId = null;
            renderList();
            renderDetailEmpty();
        });
        $('#PromptDetailEdit').on('click', function () { editModal.open({ id: d.id }); });
        $('#PromptDetailVersions').on('click', function () {
            window.location = abp.appPath + 'AiCenter/Prompts/Versions?id=' + d.id;
        });
        $('#PromptDetailDelete').on('click', function () {
            abp.message.confirm('"' + d.name + '" prompt\'u silinecek. Bu işlem geri alınamaz.', 'Prompt Silinecek')
                .then(function (confirmed) {
                    if (!confirmed) { return; }
                    service.delete(d.id).then(function () {
                        abp.notify.success('Prompt silindi.');
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

    // ── Olaylar ──
    $('#PromptsPrev').on('click', function () {
        state.skip = Math.max(0, state.skip - PAGE_SIZE);
        load();
    });
    $('#PromptsNext').on('click', function () {
        state.skip = state.skip + PAGE_SIZE;
        load();
    });

    $('#CategoryFilter, #StatusFilter').on('change', function () {
        state.skip = 0;
        load();
    });

    var filterDebounce;
    $('#PromptFilter').on('keyup', function () {
        clearTimeout(filterDebounce);
        filterDebounce = setTimeout(function () {
            state.skip = 0;
            load();
        }, 400);
    });

    createModal.onResult(function () {
        abp.notify.success('Prompt oluşturuldu.');
        load(true);
    });

    editModal.onResult(function () {
        abp.notify.success('Prompt güncellendi.');
        load(true);
    });

    $('#NewPromptButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    load();
});
