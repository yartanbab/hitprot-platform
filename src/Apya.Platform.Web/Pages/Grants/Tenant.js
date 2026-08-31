$(function () {
    var profileSvc = apya.platform.grants.firmProfile;
    var recoSvc = apya.platform.grants.grantRecommendation;
    var appSvc = apya.platform.grants.grantApplication;

    var stageLabels = { 0: 'Başvuru', 1: 'Değerlendirme', 2: 'Onay', 3: 'Ödeme' };
    var stageTone = { 0: 'neutral', 1: 'warning', 2: 'positive', 3: 'ai' };
    var trancheStatusLabels = { 0: 'Planlandı', 1: 'Talep Edildi', 2: 'Ödendi' };

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v != null ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

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
        return $('.apya-tag-input[data-kind="' + kind + '"] .apya-tag-chip')
            .map(function () { return $(this).contents().first().text().trim(); }).get();
    }
    function setTags(kind, values) {
        var $input = $('.apya-tag-input[data-kind="' + kind + '"]');
        (values || []).forEach(function (v) { addTag($input, v); });
    }

    $(document).on('keydown', '.apya-tag-entry', function (e) {
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

    // ---------- Profil ----------
    function loadProfile() {
        profileSvc.getMyProfile().then(function (p) {
            $('#ProfileSize').val(p.size != null ? p.size : '');
            $('.apya-tag-chips').empty();
            setTags(0, (p.tags || []).filter(function (t) { return t.kind === 0; }).map(function (t) { return t.value; }));
            setTags(1, (p.tags || []).filter(function (t) { return t.kind === 1; }).map(function (t) { return t.value; }));
            setTags(2, (p.tags || []).filter(function (t) { return t.kind === 2; }).map(function (t) { return t.value; }));
        });
    }
    $('#SaveProfileBtn').click(function () {
        var sizeVal = $('#ProfileSize').val();
        var dto = {
            size: sizeVal === '' ? null : parseInt(sizeVal, 10),
            tags: []
                .concat(getTags(0).map(function (v) { return { kind: 0, value: v }; }))
                .concat(getTags(1).map(function (v) { return { kind: 1, value: v }; }))
                .concat(getTags(2).map(function (v) { return { kind: 2, value: v }; }))
        };
        profileSvc.updateMyProfile(dto).then(function () {
            abp.notify.success('Profil kaydedildi.');
            loadCalls();
        });
    });

    // ---------- Çağrılar: önerilenler + kalan açık çağrılar ----------
    // Tek istek (getOpenCalls) yayındaki TÜM açık çağrıları döner; isRecommended
    // bayrağı listeyi iki bloğa ayırır — sunucu tarafında eleme yok.
    function callTile(r) {
        var btn = r.alreadyApplied
            ? '<button class="btn btn-sm btn-outline-success" disabled><i class="fa fa-check me-1"></i>Başvuruldu</button>'
            : '<button class="btn btn-sm ' + (r.isRecommended ? 'btn-primary' : 'btn-outline-primary') +
              ' apya-apply-btn"><i class="fa fa-paper-plane me-1"></i>Başvur</button>';
        var days = r.daysRemaining != null
            ? '<span class="apya-chip apya-chip-' + (r.daysRemaining <= 7 ? 'warning' : 'neutral') + '"><i class="fa fa-hourglass-half"></i>' +
              (r.daysRemaining < 0 ? 'Süre doldu' : r.daysRemaining + ' gün kaldı') + '</span>'
            : '';
        var hostBadge = r.isHostRecommended
            ? '<span class="apya-chip apya-chip-brand"><i class="fa fa-star me-1"></i>Platform Önerdi</span>'
            : '';
        // Uyum puanı önerilende vurgulu, eşiğin altındaki çağrıda nötr gösterilir.
        var scoreChip = '<span class="apya-chip apya-chip-' + (r.isRecommended ? 'ai' : 'neutral') +
            '" title="Firma profilinizle uyum puanınız">%' + r.score + '</span>';
        var $t = $(
            '<div class="apya-tile" data-call-id="' + r.grantCallId + '">' +
            '  <div class="apya-tile-head">' +
            '    <div class="d-flex align-items-start gap-2">' +
            '      <span class="apya-tile-icon-box"><i class="fa fa-award"></i></span>' +
            '      <div><div class="apya-tile-title">' + esc(r.grantName) + '</div><div class="apya-tile-sub">' + esc(r.issuer) + ' · ' + esc(r.period) + '</div></div>' +
            '    </div>' +
            '    <div class="d-flex flex-column align-items-end gap-1">' + hostBadge + scoreChip + '</div>' +
            '  </div>' +
            '  <div class="apya-tile-progress-label"><span>Maks. Tutar</span><span class="apya-numeric fw-semibold">' + money(r.maxAmount) + '</span></div>' +
            '  <div class="apya-tile-foot">' + days + btn + '</div>' +
            '</div>'
        );
        return $t;
    }
    function fillCallGrid($grid, $empty, items) {
        $grid.empty();
        if (!items.length) { $grid.addClass('d-none'); $empty.removeClass('d-none'); return; }
        $grid.removeClass('d-none'); $empty.addClass('d-none');
        items.forEach(function (r) { $grid.append(callTile(r)); });
    }
    function loadCalls() {
        recoSvc.getOpenCalls().then(function (items) {
            var recommended = items.filter(function (r) { return r.isRecommended; });
            var others = items.filter(function (r) { return !r.isRecommended; });
            fillCallGrid($('#RecoGrid'), $('#RecoEmpty'), recommended);
            fillCallGrid($('#AllCallsGrid'), $('#AllCallsEmpty'), others);
            $('#AllCallsCount').text(others.length ? ' (' + others.length + ')' : '');
        });
    }
    $('#RecoGrid, #AllCallsGrid').on('click', '.apya-apply-btn', function () {
        var callId = $(this).closest('.apya-tile').data('call-id');
        appSvc.apply(callId).then(function () {
            abp.notify.success('Başvurunuz alındı.');
            loadCalls();
            loadApplications();
        });
    });

    // ---------- Başvurularım ----------
    function loadApplications() {
        appSvc.getMyApplications().then(function (items) {
            var $l = $('#AppsList');
            $l.empty();
            if (!items.length) { $('#AppsEmpty').removeClass('d-none'); return; }
            $('#AppsEmpty').addClass('d-none');
            items.forEach(function (a) {
                var tone = stageTone[a.stage] || 'neutral';
                var detail = (a.tranches || []).map(function (t) {
                    return '<div>#' + t.sequenceNo + ' · ' + money(t.amount) + ' · ' + trancheStatusLabels[t.status] + ' · ' + fmtDate(t.dueDate) + '</div>';
                }).concat((a.milestones || []).map(function (m) {
                    return '<div>' + esc(m.title) + ' · ' + (m.isCompleted ? 'Tamamlandı' : 'Bekliyor') + ' · ' + fmtDate(m.dueDate) + '</div>';
                })).join('');
                $l.append(
                    '<div class="card"><div class="card-body py-2">' +
                    '<div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">' +
                    '<div><span class="fw-semibold">' + esc(a.grantName || '-') + '</span> <span class="text-muted small">' + esc(a.period || '') + '</span></div>' +
                    '<div class="d-flex align-items-center gap-2">' +
                    (a.approvedAmount != null ? '<span class="apya-numeric small fw-semibold">' + money(a.approvedAmount) + '</span>' : '') +
                    '<span class="apya-chip apya-chip-' + tone + '">' + (stageLabels[a.stage] || '') + '</span>' +
                    '<span class="text-muted small">' + fmtDate(a.appliedDate) + '</span></div>' +
                    '</div>' +
                    (detail ? '<div class="small text-muted mt-1">' + detail + '</div>' : '') +
                    '</div></div>'
                );
            });
        });
    }

    // ---------- Dashboard KPI + Yaklaşan Son Tarihler ----------
    function loadDashboard() {
        appSvc.getMyDashboard().then(function (d) {
            $('#KpiOnaylanan').text(d.onaylanan);
            $('#KpiDegerlendirmede').text(d.degerlendirmede);
            $('#KpiTahsilEdilen').text(money(d.tahsilEdilen));
            $('#KpiBuAySonTarih').text(d.buAySonTarih);

            var $dl = $('#DeadlinesList').empty();
            if (!d.yaklasanSonTarihler.length) { $('#DeadlinesEmpty').removeClass('d-none'); return; }
            $('#DeadlinesEmpty').addClass('d-none');
            d.yaklasanSonTarihler.forEach(function (x) {
                var tone = x.kind === 'Milestone' ? 'neutral' : 'ai';
                $dl.append(
                    '<div class="d-flex align-items-center justify-content-between gap-2 small py-1 border-bottom">' +
                    '<span>' + esc(x.title) + '</span>' +
                    '<span><span class="apya-chip apya-chip-' + tone + '">' + x.kind + '</span> ' + fmtDate(x.date) + '</span>' +
                    '</div>'
                );
            });
        });
    }

    loadProfile();
    loadCalls();
    loadApplications();
    loadDashboard();
});
