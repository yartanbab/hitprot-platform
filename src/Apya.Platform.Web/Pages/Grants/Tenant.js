$(function () {
    var profileSvc = apya.platform.grants.firmProfile;
    var recoSvc = apya.platform.grants.grantRecommendation;
    var appSvc = apya.platform.grants.grantApplication;

    var stageLabels = { 0: 'Başvuru', 1: 'Değerlendirme', 2: 'Onay', 3: 'Ödeme' };
    var stageTone = { 0: 'neutral', 1: 'warning', 2: 'positive', 3: 'ai' };

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
            loadRecommendations();
        });
    });

    // ---------- Önerilen Çağrılar ----------
    function recoTile(r) {
        var btn = r.alreadyApplied
            ? '<button class="btn btn-sm btn-outline-success" disabled><i class="fa fa-check me-1"></i>Başvuruldu</button>'
            : '<button class="btn btn-sm btn-primary apya-apply-btn"><i class="fa fa-paper-plane me-1"></i>Başvur</button>';
        var days = r.daysRemaining != null
            ? '<span class="apya-chip apya-chip-' + (r.daysRemaining <= 7 ? 'warning' : 'neutral') + '"><i class="fa fa-hourglass-half"></i>' +
              (r.daysRemaining < 0 ? 'Süre doldu' : r.daysRemaining + ' gün kaldı') + '</span>'
            : '';
        var hostBadge = r.isHostRecommended
            ? '<span class="apya-chip apya-chip-brand"><i class="fa fa-star me-1"></i>Platform Önerdi</span>'
            : '';
        var $t = $(
            '<div class="apya-tile" data-call-id="' + r.grantCallId + '">' +
            '  <div class="apya-tile-head">' +
            '    <div class="d-flex align-items-start gap-2">' +
            '      <span class="apya-tile-icon-box"><i class="fa fa-award"></i></span>' +
            '      <div><div class="apya-tile-title">' + esc(r.grantName) + '</div><div class="apya-tile-sub">' + esc(r.issuer) + ' · ' + esc(r.period) + '</div></div>' +
            '    </div>' +
            '    <div class="d-flex flex-column align-items-end gap-1">' + hostBadge + '<span class="apya-chip apya-chip-ai">%' + r.score + '</span></div>' +
            '  </div>' +
            '  <div class="apya-tile-progress-label"><span>Maks. Tutar</span><span class="apya-numeric fw-semibold">' + money(r.maxAmount) + '</span></div>' +
            '  <div class="apya-tile-foot">' + days + btn + '</div>' +
            '</div>'
        );
        return $t;
    }
    function loadRecommendations() {
        recoSvc.getMyRecommendations().then(function (items) {
            var $g = $('#RecoGrid');
            $g.empty();
            if (!items.length) { $g.addClass('d-none'); $('#RecoEmpty').removeClass('d-none'); return; }
            $g.removeClass('d-none'); $('#RecoEmpty').addClass('d-none');
            items.forEach(function (r) { $g.append(recoTile(r)); });
        });
    }
    $('#RecoGrid').on('click', '.apya-apply-btn', function () {
        var callId = $(this).closest('.apya-tile').data('call-id');
        appSvc.apply(callId).then(function () {
            abp.notify.success('Başvurunuz alındı.');
            loadRecommendations();
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
                $l.append(
                    '<div class="card"><div class="card-body py-2 d-flex align-items-center justify-content-between gap-2 flex-wrap">' +
                    '<div><span class="fw-semibold">' + esc(a.grantName || '-') + '</span> <span class="text-muted small">' + esc(a.period || '') + '</span></div>' +
                    '<div class="d-flex align-items-center gap-2"><span class="apya-chip apya-chip-' + tone + '">' + (stageLabels[a.stage] || '') + '</span>' +
                    '<span class="text-muted small">' + fmtDate(a.appliedDate) + '</span></div>' +
                    '</div></div>'
                );
            });
        });
    }

    loadProfile();
    loadRecommendations();
    loadApplications();
});
