$(function () {
    var grantService = apya.platform.grants.grant;
    var callService = apya.platform.grants.grantCall;
    var canCreate = abp.auth.isGranted('Platform.Grants.Create');
    var canEdit = abp.auth.isGranted('Platform.Grants.Edit');
    var canDelete = abp.auth.isGranted('Platform.Grants.Delete');

    var $grid = $('#GrantTileGrid');
    var $empty = $('#GrantTileGridEmpty');
    var grantModal = new bootstrap.Modal(document.getElementById('GrantModal'));
    var callModal = new bootstrap.Modal(document.getElementById('CallModal'));

    var statusLabels = { 0: 'Planlandı', 1: 'Açık', 2: 'Kapandı' };
    var statusTone = { 0: 'neutral', 1: 'positive', 2: 'warning' };
    var sizeNames = { 1: 'Mikro', 2: 'Küçük', 4: 'Orta', 8: 'Büyük' };

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v != null ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }
    function numOrNull(sel) { var v = $(sel).val(); return v === '' || v == null ? null : parseFloat(v); }

    // ---------- Etiket (chip) girişi ----------
    function addTag($input, value) {
        value = (value || '').trim();
        if (!value) return;
        var $chips = $input.find('.apya-tag-chips');
        var dup = $chips.find('.apya-tag-chip').filter(function () {
            return $(this).contents().first().text().trim().toLowerCase() === value.toLowerCase();
        }).length;
        if (!dup) {
            $chips.append('<span class="apya-tag-chip">' + esc(value) +
                '<button type="button" class="apya-tag-remove" aria-label="Kaldır">&times;</button></span>');
        }
    }
    function getTags(kind) {
        return $('#GrantModal .apya-tag-input[data-kind="' + kind + '"] .apya-tag-chip')
            .map(function () { return $(this).contents().first().text().trim(); }).get();
    }
    function setTags(kind, values) {
        var $input = $('#GrantModal .apya-tag-input[data-kind="' + kind + '"]');
        (values || []).forEach(function (v) { addTag($input, v); });
    }
    function collectCriteria() {
        var out = [];
        [0, 1, 2].forEach(function (kind) {
            getTags(kind).forEach(function (v) { out.push({ kind: kind, value: v }); });
        });
        return out;
    }

    $('#GrantModal').on('keydown', '.apya-tag-entry', function (e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag($(this).closest('.apya-tag-input'), $(this).val());
            $(this).val('');
        }
    }).on('blur', '.apya-tag-entry', function () {
        addTag($(this).closest('.apya-tag-input'), $(this).val());
        $(this).val('');
    }).on('click', '.apya-tag-remove', function () {
        $(this).closest('.apya-tag-chip').remove();
    });

    function getSizeMask() {
        var m = 0;
        $('#GrantModal .apya-size:checked').each(function () { m += parseInt($(this).val(), 10); });
        return m;
    }
    function setSizeMask(mask) {
        $('#GrantModal .apya-size').each(function () {
            $(this).prop('checked', (mask & parseInt($(this).val(), 10)) !== 0);
        });
    }

    // ---------- KPI ----------
    function renderKpis(items) {
        var total = items.length;
        var totalAmount = items.reduce(function (s, g) { return s + (g.maxAmount || 0); }, 0);
        var avg = total ? items.reduce(function (s, g) { return s + (g.minMatchScore || 0); }, 0) / total : 0;
        var top = items.reduce(function (b, g) { return (!b || (g.maxAmount || 0) > (b.maxAmount || 0)) ? g : b; }, null);
        $('#KpiTotalPrograms').text(total);
        $('#KpiTotalAmount').text(total ? Math.round(totalAmount).toLocaleString('tr-TR') + ' ₺' : '—');
        $('#KpiAvgScore').text(total ? ('%' + Math.round(avg)) : '—');
        $('#KpiTopProgram').text(top ? top.name : '—').attr('title', top ? top.name : '');
    }

    // ---------- Kart ----------
    function sizeChips(mask) {
        if (!mask) return '';
        return [1, 2, 4, 8].filter(function (b) { return mask & b; })
            .map(function (b) { return '<span class="apya-chip apya-chip-neutral">' + sizeNames[b] + '</span>'; }).join('');
    }
    function critChips(tags) {
        return (tags || []).map(function (t) {
            var tone = t.kind === 0 ? 'brand' : (t.kind === 1 ? 'neutral' : 'ai');
            return '<span class="apya-chip apya-chip-' + tone + '">' + esc(t.value) + '</span>';
        }).join('');
    }
    function tileTemplate(g) {
        var scoreChip = g.minMatchScore > 0 ? '<span class="apya-chip apya-chip-ai">%' + g.minMatchScore + ' uyum</span>' : '';
        var criteria = critChips(g.criteriaTags) + sizeChips(g.eligibleCompanySizes);
        var actions =
            '<div class="apya-tile-actions">' +
            (canEdit ? '<button type="button" class="btn btn-sm btn-link text-muted apya-edit-btn" title="Düzenle"><i class="fa fa-pen"></i></button>' : '') +
            (canDelete ? '<button type="button" class="btn btn-sm btn-link text-danger apya-delete-btn" title="Sil"><i class="fa fa-trash"></i></button>' : '') +
            '</div>';
        var $tile = $(
            '<div class="apya-tile" data-id="' + g.id + '">' +
            '  <div class="apya-tile-head">' +
            '    <div class="d-flex align-items-start gap-2">' +
            '      <span class="apya-tile-icon-box"><i class="fa fa-award"></i></span>' +
            '      <div><div class="apya-tile-title">' + esc(g.name) + '</div><div class="apya-tile-sub">' + esc(g.issuer) + '</div></div>' +
            '    </div>' +
            '    <div class="d-flex flex-column align-items-end gap-1">' + scoreChip + '</div>' +
            '  </div>' +
            (criteria ? '<div class="d-flex flex-wrap gap-1">' + criteria + '</div>' : '') +
            '  <div class="apya-tile-progress-label"><span>Maks. Tutar</span><span class="apya-numeric fw-semibold">' + money(g.maxAmount) + '</span></div>' +
            '  <div class="apya-calls-section">' +
            '    <a href="#" class="apya-toggle-calls small text-decoration-none">Çağrılar (<span class="apya-call-count">' + (g.callCount || 0) + '</span>) <i class="fa fa-chevron-down apya-expand-chevron ms-1"></i></a>' +
            '    <div class="apya-calls-panel d-none mt-2"></div>' +
            '  </div>' +
            '  <div class="apya-tile-foot" style="justify-content:flex-end">' + actions + '</div>' +
            '</div>'
        );
        $tile.data('grant', g);
        return $tile;
    }
    function loadList() {
        grantService.getList({ maxResultCount: 1000, sorting: 'name asc' }).then(function (res) {
            $grid.empty();
            renderKpis(res.items);
            if (!res.items.length) { $grid.addClass('d-none'); $empty.removeClass('d-none'); return; }
            $grid.removeClass('d-none'); $empty.addClass('d-none');
            res.items.forEach(function (g) { $grid.append(tileTemplate(g)); });
        });
    }

    // ---------- Çağrı listesi (genişletilebilir) ----------
    function callRow(c) {
        var tone = statusTone[c.status] || 'neutral';
        var edit = canEdit ? '<button type="button" class="btn btn-sm btn-link text-muted apya-call-edit" title="Düzenle"><i class="fa fa-pen"></i></button>' : '';
        var del = canDelete ? '<button type="button" class="btn btn-sm btn-link text-danger apya-call-del" title="Sil"><i class="fa fa-trash"></i></button>' : '';
        var $row = $(
            '<div class="apya-call-row d-flex align-items-center justify-content-between gap-2 py-1 border-top">' +
            '  <div class="d-flex align-items-center gap-2 flex-wrap">' +
            '    <span class="fw-semibold">' + esc(c.period) + '</span>' +
            '    <span class="apya-chip apya-chip-' + tone + '">' + (statusLabels[c.status] || '') + '</span>' +
            '    <span class="text-muted small"><i class="fa fa-hourglass-half me-1"></i>' + fmtDate(c.deadline) + '</span>' +
            (c.budget != null ? '<span class="text-muted small apya-numeric">' + money(c.budget) + '</span>' : '') +
            '  </div>' +
            '  <div class="d-flex align-items-center gap-1">' + edit + del + '</div>' +
            '</div>'
        );
        $row.data('call', c);
        return $row;
    }
    function loadCalls($tile) {
        var $panel = $tile.find('.apya-calls-panel');
        var grantId = $tile.data('grant').id;
        $panel.html('<div class="text-muted small py-2">Yükleniyor…</div>');
        return callService.getList({ grantId: grantId, maxResultCount: 100, sorting: 'period desc' }).then(function (res) {
            $panel.empty();
            res.items.forEach(function (c) { $panel.append(callRow(c)); });
            if (canCreate) {
                $panel.append('<button type="button" class="btn btn-sm btn-outline-secondary mt-2 apya-call-add"><i class="fa fa-plus me-1"></i>Çağrı Ekle</button>');
            } else if (!res.items.length) {
                $panel.append('<div class="text-muted small py-2">Bu program için çağrı yok.</div>');
            }
            $tile.find('.apya-call-count').text(res.items.length);
        });
    }

    $grid.on('click', '.apya-toggle-calls', function (e) {
        e.preventDefault();
        var $tile = $(this).closest('.apya-tile');
        var $panel = $tile.find('.apya-calls-panel');
        var opening = $panel.hasClass('d-none');
        $panel.toggleClass('d-none', !opening);
        $(this).find('.apya-expand-chevron').toggleClass('is-open', opening);
        if (opening && !$tile.data('callsLoaded')) {
            $tile.data('callsLoaded', true);
            loadCalls($tile);
        }
    });

    // ---------- Program create/edit ----------
    $('#NewGrantButton').click(function () {
        $('#GrantForm')[0].reset();
        $('#GrantId').val('');
        $('#GrantModal .apya-tag-chips').empty();
        setSizeMask(0);
        $('#GrantModalTitle').text('Yeni Hibe Programı');
        grantModal.show();
    });
    $grid.on('click', '.apya-edit-btn', function () {
        var g = $(this).closest('.apya-tile').data('grant');
        $('#GrantForm')[0].reset();
        $('#GrantModal .apya-tag-chips').empty();
        $('#GrantId').val(g.id);
        $('#GrantName').val(g.name);
        $('#GrantIssuer').val(g.issuer);
        $('#GrantDescription').val(g.description || '');
        $('#GrantMaxAmount').val(g.maxAmount != null ? g.maxAmount : '');
        $('#GrantMinMatchScore').val(g.minMatchScore || 0);
        setSizeMask(g.eligibleCompanySizes || 0);
        setTags(0, (g.criteriaTags || []).filter(function (t) { return t.kind === 0; }).map(function (t) { return t.value; }));
        setTags(1, (g.criteriaTags || []).filter(function (t) { return t.kind === 1; }).map(function (t) { return t.value; }));
        setTags(2, (g.criteriaTags || []).filter(function (t) { return t.kind === 2; }).map(function (t) { return t.value; }));
        $('#GrantModalTitle').text('Hibe Programı Düzenle');
        grantModal.show();
    });
    $('#GrantForm').on('submit', function (e) {
        e.preventDefault();
        var name = $('#GrantName').val().trim();
        var issuer = $('#GrantIssuer').val().trim();
        if (!name || !issuer) { abp.notify.warn('Program adı ve kurum zorunludur.'); return; }
        var dto = {
            name: name,
            issuer: issuer,
            description: $('#GrantDescription').val().trim() || null,
            maxAmount: numOrNull('#GrantMaxAmount'),
            minMatchScore: parseFloat($('#GrantMinMatchScore').val()) || 0,
            eligibleCompanySizes: getSizeMask(),
            criteriaTags: collectCriteria()
        };
        var id = $('#GrantId').val();
        var op = id ? grantService.update(id, dto) : grantService.create(dto);
        op.then(function () {
            grantModal.hide();
            abp.notify.success(id ? 'Hibe programı güncellendi.' : 'Hibe programı oluşturuldu.');
            loadList();
        });
    });
    $grid.on('click', '.apya-delete-btn', function () {
        var g = $(this).closest('.apya-tile').data('grant');
        Swal.fire({
            title: 'Hibe Programı Silinecek',
            text: '"' + g.name + '" programını (ve çağrılarını) silmek istiyor musunuz?',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'Evet, Sil', cancelButtonText: 'İptal', confirmButtonColor: '#dc3545'
        }).then(function (r) {
            if (!r.isConfirmed) return;
            grantService.delete(g.id).then(function () {
                abp.notify.success('Hibe programı silindi.');
                loadList();
            });
        });
    });

    // ---------- Çağrı create/edit/delete ----------
    var activeCallTile = null;
    function openCallModal(grantId, call) {
        $('#CallForm')[0].reset();
        $('#CallGrantId').val(grantId);
        if (call) {
            $('#CallId').val(call.id);
            $('#CallPeriod').val(call.period);
            $('#CallStatus').val(call.status);
            $('#CallOpenDate').val(call.openDate ? call.openDate.substring(0, 10) : '');
            $('#CallDeadline').val(call.deadline ? call.deadline.substring(0, 10) : '');
            $('#CallBudget').val(call.budget != null ? call.budget : '');
            $('#CallReference').val(call.reference || '');
            $('#CallModalTitle').text('Çağrı Düzenle');
        } else {
            $('#CallId').val('');
            $('#CallStatus').val('1');
            $('#CallModalTitle').text('Yeni Çağrı');
        }
        callModal.show();
    }
    $grid.on('click', '.apya-call-add', function () {
        var $tile = $(this).closest('.apya-tile');
        activeCallTile = $tile;
        openCallModal($tile.data('grant').id, null);
    });
    $grid.on('click', '.apya-call-edit', function () {
        var $tile = $(this).closest('.apya-tile');
        activeCallTile = $tile;
        openCallModal($tile.data('grant').id, $(this).closest('.apya-call-row').data('call'));
    });
    $('#CallForm').on('submit', function (e) {
        e.preventDefault();
        var period = $('#CallPeriod').val().trim();
        if (!period) { abp.notify.warn('Dönem zorunludur.'); return; }
        var dto = {
            grantId: $('#CallGrantId').val(),
            period: period,
            status: parseInt($('#CallStatus').val(), 10),
            openDate: $('#CallOpenDate').val() || null,
            deadline: $('#CallDeadline').val() || null,
            budget: numOrNull('#CallBudget'),
            reference: $('#CallReference').val().trim() || null
        };
        var id = $('#CallId').val();
        var op = id ? callService.update(id, dto) : callService.create(dto);
        op.then(function () {
            callModal.hide();
            abp.notify.success(id ? 'Çağrı güncellendi.' : 'Çağrı oluşturuldu.');
            if (activeCallTile) { loadCalls(activeCallTile); }
        });
    });
    $grid.on('click', '.apya-call-del', function () {
        var $tile = $(this).closest('.apya-tile');
        var c = $(this).closest('.apya-call-row').data('call');
        Swal.fire({
            title: 'Çağrı Silinecek',
            text: '"' + c.period + '" çağrısını silmek istiyor musunuz?',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'Evet, Sil', cancelButtonText: 'İptal', confirmButtonColor: '#dc3545'
        }).then(function (r) {
            if (!r.isConfirmed) return;
            callService.delete(c.id).then(function () {
                abp.notify.success('Çağrı silindi.');
                loadCalls($tile);
            });
        });
    });

    loadList();
});
