$(function () {
    var hostSvc = apya.platform.grants.grantApplicationHost;

    var stageLabels = { 0: 'Başvuru', 1: 'Değerlendirme', 2: 'Onay', 3: 'Ödeme' };
    var stageTone = { 0: 'neutral', 1: 'warning', 2: 'positive', 3: 'ai' };
    var trancheStatusLabels = { 0: 'Planlandı', 1: 'Talep Edildi', 2: 'Ödendi' };

    var advanceModal = new bootstrap.Modal(document.getElementById('AdvanceStageModal'));
    var trancheModal = new bootstrap.Modal(document.getElementById('TrancheModal'));
    var milestoneModal = new bootstrap.Modal(document.getElementById('MilestoneModal'));

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v != null ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

    var apps = [];

    function trancheRow(a, t) {
        return '<div class="d-flex align-items-center justify-content-between gap-2 py-1 border-top small" data-tranche-id="' + t.id + '">' +
            '<span>#' + t.sequenceNo + ' · ' + money(t.amount) + ' · <span class="apya-chip apya-chip-neutral">' + trancheStatusLabels[t.status] + '</span> · ' + fmtDate(t.dueDate) + '</span>' +
            '<span class="apya-touch-actions"><button type="button" class="btn btn-sm btn-link apya-tranche-edit" title="Düzenle" aria-label="Dilimi düzenle"><i class="fa fa-pen"></i></button>' +
            '<button type="button" class="btn btn-sm btn-link text-danger apya-tranche-del" title="Sil" aria-label="Dilimi sil"><i class="fa fa-trash"></i></button></span>' +
            '</div>';
    }
    function milestoneRow(a, m) {
        var tone = m.isCompleted ? 'positive' : 'neutral';
        return '<div class="d-flex align-items-center justify-content-between gap-2 py-1 border-top small" data-milestone-id="' + m.id + '">' +
            '<span>' + esc(m.title) + ' · <span class="apya-chip apya-chip-' + tone + '">' + (m.isCompleted ? 'Tamamlandı' : 'Bekliyor') + '</span> · ' + fmtDate(m.dueDate) + '</span>' +
            '<span class="apya-touch-actions"><button type="button" class="btn btn-sm btn-link apya-milestone-edit" title="Düzenle" aria-label="Kilometre taşını düzenle"><i class="fa fa-pen"></i></button>' +
            '<button type="button" class="btn btn-sm btn-link text-danger apya-milestone-del" title="Sil" aria-label="Kilometre taşını sil"><i class="fa fa-trash"></i></button></span>' +
            '</div>';
    }

    function appRow(a) {
        var tone = stageTone[a.stage] || 'neutral';
        var $row = $(
            '<div class="apya-app-row border-top py-2" data-id="' + a.id + '">' +
            '  <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">' +
            '    <div class="d-flex align-items-center gap-2 flex-wrap">' +
            '      <span class="fw-semibold">' + esc(a.tenantName) + '</span>' +
            '      <span class="text-muted small">' + esc(a.grantName || '-') + ' · ' + esc(a.period || '') + '</span>' +
            '      <span class="apya-chip apya-chip-' + tone + '">' + (stageLabels[a.stage] || '') + '</span>' +
            (a.approvedAmount != null ? '<span class="apya-numeric small fw-semibold">' + money(a.approvedAmount) + '</span>' : '') +
            '    </div>' +
            '    <div class="d-flex align-items-center gap-1">' +
            '      <button type="button" class="btn btn-sm btn-outline-secondary apya-advance-btn"><i class="fa fa-forward me-1"></i>Aşama İlerlet</button>' +
            '      <a href="#" class="apya-toggle-detail small text-decoration-none ms-2">Detay <i class="fa fa-chevron-down apya-expand-chevron ms-1"></i></a>' +
            '    </div>' +
            '  </div>' +
            '  <div class="apya-detail-panel d-none mt-2">' +
            '    <div class="row g-3">' +
            '      <div class="col-md-6">' +
            '        <div class="d-flex justify-content-between align-items-center mb-1"><span class="fw-semibold small">Tahsilat Dilimleri</span>' +
            '          <button type="button" class="btn btn-sm btn-link apya-tranche-add">+ Dilim Ekle</button></div>' +
            '        <div class="apya-tranche-list"></div>' +
            '      </div>' +
            '      <div class="col-md-6">' +
            '        <div class="d-flex justify-content-between align-items-center mb-1"><span class="fw-semibold small">Milestone\'lar</span>' +
            '          <button type="button" class="btn btn-sm btn-link apya-milestone-add">+ Milestone Ekle</button></div>' +
            '        <div class="apya-milestone-list"></div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>'
        );
        $row.data('app', a);
        return $row;
    }

    function renderDetail($row, a) {
        var $t = $row.find('.apya-tranche-list').empty();
        (a.tranches || []).forEach(function (t) { $t.append(trancheRow(a, t)); });
        if (!(a.tranches || []).length) { $t.append('<div class="text-muted small py-1">Dilim yok.</div>'); }
        var $m = $row.find('.apya-milestone-list').empty();
        (a.milestones || []).forEach(function (m) { $m.append(milestoneRow(a, m)); });
        if (!(a.milestones || []).length) { $m.append('<div class="text-muted small py-1">Milestone yok.</div>'); }
    }

    function loadList() {
        hostSvc.getList().then(function (items) {
            apps = items;
            var $list = $('#AppList').empty();
            if (!items.length) { $('#AppListEmpty').removeClass('d-none'); return; }
            $('#AppListEmpty').addClass('d-none');
            items.forEach(function (a) { $list.append(appRow(a)); });
        });
    }

    $('#AppList').on('click', '.apya-toggle-detail', function (e) {
        e.preventDefault();
        var $row = $(this).closest('.apya-app-row');
        var $panel = $row.find('.apya-detail-panel');
        var opening = $panel.hasClass('d-none');
        $panel.toggleClass('d-none', !opening);
        $(this).find('.apya-expand-chevron').toggleClass('is-open', opening);
        if (opening) { renderDetail($row, $row.data('app')); }
    });

    // ---------- Aşama İlerlet ----------
    $('#AppList').on('click', '.apya-advance-btn', function () {
        var a = $(this).closest('.apya-app-row').data('app');
        $('#StageAppId').val(a.id);
        $('#StageSelect').val(a.stage);
        $('#StageApprovedAmount').val(a.approvedAmount != null ? a.approvedAmount : '');
        advanceModal.show();
    });
    $('#AdvanceStageForm').on('submit', function (e) {
        e.preventDefault();
        var amountVal = $('#StageApprovedAmount').val();
        hostSvc.advanceStage({
            applicationId: $('#StageAppId').val(),
            stage: parseInt($('#StageSelect').val(), 10),
            approvedAmount: amountVal === '' ? null : parseFloat(amountVal)
        }).then(function () {
            advanceModal.hide();
            abp.notify.success('Aşama güncellendi.');
            loadList();
        });
    });

    // ---------- Dilim ----------
    $('#AppList').on('click', '.apya-tranche-add', function () {
        var $row = $(this).closest('.apya-app-row');
        var a = $row.data('app');
        $('#TrancheForm')[0].reset();
        $('#TrancheId').val('');
        $('#TrancheAppId').val(a.id);
        $('#TrancheSeq').val(((a.tranches || []).length) + 1);
        $('#TrancheModalTitle').text('Yeni Dilim');
        trancheModal.show();
    });
    $('#AppList').on('click', '.apya-tranche-edit', function () {
        var $row = $(this).closest('.apya-app-row');
        var a = $row.data('app');
        var trancheId = $(this).closest('[data-tranche-id]').data('tranche-id');
        var t = (a.tranches || []).filter(function (x) { return x.id === trancheId; })[0];
        $('#TrancheId').val(t.id);
        $('#TrancheAppId').val(a.id);
        $('#TrancheSeq').val(t.sequenceNo);
        $('#TrancheAmount').val(t.amount);
        $('#TrancheStatus').val(t.status);
        $('#TrancheDueDate').val(t.dueDate ? t.dueDate.substring(0, 10) : '');
        $('#TrancheModalTitle').text('Dilim Düzenle');
        trancheModal.show();
    });
    $('#TrancheForm').on('submit', function (e) {
        e.preventDefault();
        var dto = {
            sequenceNo: parseInt($('#TrancheSeq').val(), 10),
            amount: parseFloat($('#TrancheAmount').val()),
            status: parseInt($('#TrancheStatus').val(), 10),
            dueDate: $('#TrancheDueDate').val() || null
        };
        var id = $('#TrancheId').val();
        var op = id ? hostSvc.updateTranche(id, dto) : hostSvc.addTranche($('#TrancheAppId').val(), dto);
        op.then(function () {
            trancheModal.hide();
            abp.notify.success('Dilim kaydedildi.');
            loadList();
        });
    });
    $('#AppList').on('click', '.apya-tranche-del', function () {
        var trancheId = $(this).closest('[data-tranche-id]').data('tranche-id');
        Swal.fire({
            title: 'Dilim Silinecek', icon: 'warning', showCancelButton: true,
            confirmButtonText: 'Evet, Sil', cancelButtonText: 'İptal', confirmButtonColor: '#dc3545'
        }).then(function (r) {
            if (!r.isConfirmed) return;
            hostSvc.deleteTranche(trancheId).then(function () {
                abp.notify.success('Dilim silindi.');
                loadList();
            });
        });
    });

    // ---------- Milestone ----------
    $('#AppList').on('click', '.apya-milestone-add', function () {
        var $row = $(this).closest('.apya-app-row');
        var a = $row.data('app');
        $('#MilestoneForm')[0].reset();
        $('#MilestoneId').val('');
        $('#MilestoneAppId').val(a.id);
        $('#MilestoneModalTitle').text('Yeni Milestone');
        milestoneModal.show();
    });
    $('#AppList').on('click', '.apya-milestone-edit', function () {
        var $row = $(this).closest('.apya-app-row');
        var a = $row.data('app');
        var milestoneId = $(this).closest('[data-milestone-id]').data('milestone-id');
        var m = (a.milestones || []).filter(function (x) { return x.id === milestoneId; })[0];
        $('#MilestoneId').val(m.id);
        $('#MilestoneAppId').val(a.id);
        $('#MilestoneTitle').val(m.title);
        $('#MilestoneDueDate').val(m.dueDate ? m.dueDate.substring(0, 10) : '');
        $('#MilestoneCompleted').prop('checked', m.isCompleted);
        $('#MilestoneModalTitle').text('Milestone Düzenle');
        milestoneModal.show();
    });
    $('#MilestoneForm').on('submit', function (e) {
        e.preventDefault();
        var dto = {
            title: $('#MilestoneTitle').val().trim(),
            dueDate: $('#MilestoneDueDate').val() || null,
            isCompleted: $('#MilestoneCompleted').is(':checked')
        };
        var id = $('#MilestoneId').val();
        var op = id ? hostSvc.updateMilestone(id, dto) : hostSvc.addMilestone($('#MilestoneAppId').val(), dto);
        op.then(function () {
            milestoneModal.hide();
            abp.notify.success('Milestone kaydedildi.');
            loadList();
        });
    });
    $('#AppList').on('click', '.apya-milestone-del', function () {
        var milestoneId = $(this).closest('[data-milestone-id]').data('milestone-id');
        Swal.fire({
            title: 'Milestone Silinecek', icon: 'warning', showCancelButton: true,
            confirmButtonText: 'Evet, Sil', cancelButtonText: 'İptal', confirmButtonColor: '#dc3545'
        }).then(function (r) {
            if (!r.isConfirmed) return;
            hostSvc.deleteMilestone(milestoneId).then(function () {
                abp.notify.success('Milestone silindi.');
                loadList();
            });
        });
    });

    loadList();
});
