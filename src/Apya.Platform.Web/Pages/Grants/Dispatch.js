$(function () {
    var service = apya.platform.grants.grantHostDispatch;
    var l = abp.localization.getResource('Platform');
    var callId = $('.apya-page').data('call-id');

    // Enum sıraları sunucudakiyle birebir.
    var ruleKeys = ['CompanySize', 'CompanyAge', 'Trl', 'StaffCount', 'RdStaffCount', 'Revenue', 'Consortium'];
    var dimensionKeys = ['Sector', 'TechnicalMaturity', 'RdStaff', 'Region', 'ProjectHistory', 'Keyword'];
    var sizeKeys = { 1: 'Mikro', 2: 'Kucuk', 4: 'Orta', 8: 'Buyuk' };

    var candidates = [];
    var selected = {};
    var previewTimer = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function num(sel) {
        // Maskeli tutar alanında .val() "1.234,56" döndürür; Number() NaN verir.
        var el = $(sel)[0];
        if (el && el.__apyaMoney) { return apya.moneyInput.getValue(el); }
        var v = $(sel).val(); return v === '' || v == null ? null : Number(v);
    }
    function initials(name) {
        return (name || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    // ---------- Süzgeç ----------
    $('#FilterSizes').on('click', '.apya-choice', function () {
        $(this).toggleClass('is-on');
        schedulePreview();
    });

    $('#MinScore').on('input', function () {
        $('#MinScoreValue').text('%' + $(this).val());
        schedulePreview();
    });

    $('#BudgetMin, #BudgetMax, #FilterCategory').on('input change', schedulePreview);
    $('.apya-filter-flag').on('change', schedulePreview);

    function collectFilter() {
        var sizes = 0;
        $('#FilterSizes .apya-choice.is-on').each(function () { sizes |= Number($(this).data('size')); });
        var category = $('#FilterCategory').val();

        return {
            grantCallId: callId,
            sizes: sizes || null,
            budgetMin: num('#BudgetMin'),
            budgetMax: num('#BudgetMax'),
            category: category === '' ? null : Number(category),
            minScore: Number($('#MinScore').val()) || 0,
            excludeAlreadySent: $('#ExcludeSent').is(':checked'),
            excludeApplied: $('#ExcludeApplied').is(':checked'),
            onlyEligible: $('#OnlyEligible').is(':checked')
        };
    }

    function schedulePreview() {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(load, 300);
    }

    // ---------- Aday satırı ----------
    // Kiracı ekranlarındaki gerekçeler firmaya "siz" diye seslenir; host konsolunda
    // BAŞKA firmalar konuşulduğu için üçüncü tekil karşılıkları kullanılır. Zaten
    // nötr yazılmış gerekçeler (yaş, personel, ciro) ortak anahtarda kalır.
    var hostVoicedRules = { CompanySize: 1, Trl: 1, Consortium: 1 };
    function reasonKey(key) {
        return (hostVoicedRules[key] ? 'Grants:Dispatch:RuleReason:' : 'Grants:RuleReason:') + key;
    }

    function dimBar(d) {
        // Yeşil = tam · sarı = kısmi · kırmızı = hiç.
        var cls = d.value >= 100 ? 'is-full' : d.value > 0 ? 'is-partial' : 'is-none';
        return '<span class="apya-cand-dim">' +
            '<span class="apya-cand-dim-label">' + esc(l('Grants:Dimension:' + dimensionKeys[d.dimension])) + '</span>' +
            '<span class="apya-cand-dim-bar"><span class="' + cls + '" style="width:' +
            Math.max(4, d.value) + '%"></span></span></span>';
    }

    function candidateRow(c) {
        var chips = '';
        if (c.size) {
            chips += '<span class="apya-chip apya-chip-neutral">' +
                esc(l('Grants:Size:' + sizeKeys[c.size])) + '</span>';
        }
        // "Neden uygun" — kanıtlı sağlanan şartlardan en fazla ikisi.
        (c.passedRules || []).slice(0, 2).forEach(function (rule) {
            chips += '<span class="apya-chip apya-chip-positive">' +
                esc(l('Grants:Rule:' + ruleKeys[rule])) + '</span>';
        });
        if (c.alreadySent) {
            chips += '<span class="apya-chip apya-chip-brand">' + esc(l('Grants:Dispatch:AlreadySent')) + '</span>';
        }
        if (c.alreadyApplied) {
            chips += '<span class="apya-chip apya-chip-accent">' + esc(l('Grants:Dispatch:Applied')) + '</span>';
        }

        var warning = '';
        if (c.warningRule != null) {
            var key = ruleKeys[c.warningRule];
            warning = c.bucket === 2
                ? l(reasonKey(key), c.warningFirmValue || '—', c.warningGrantValue || '—')
                : l('Grants:Dispatch:RuleMissing', l('Grants:Rule:' + key));
        }

        var isSelected = !!selected[c.tenantId];
        return '<div class="apya-cand-row' + (isSelected ? '' : ' is-unselected') + '">' +
            '<span><input type="checkbox" class="form-check-input apya-cand-check" data-id="' + c.tenantId + '"' +
                (isSelected ? ' checked' : '') + ' /></span>' +
            '<span class="apya-cand-firm">' +
            '<span class="apya-cand-name"><span class="apya-cand-avatar">' + esc(initials(c.tenantName)) + '</span>' +
            esc(c.tenantName) + chips + '</span>' +
            (warning ? '<span class="apya-cand-warning">' + esc(warning) + '</span>' : '') +
            '</span>' +
            '<span><span class="apya-chip apya-numeric apya-chip-' + (c.score >= 65 ? 'positive' : 'neutral') + '">%' +
                c.score + '</span></span>' +
            '<span class="apya-cand-dims">' + (c.dimensions || []).map(dimBar).join('') + '</span>' +
            '<span class="apya-cat-sub">' + esc(c.assignedUserName || '—') + '</span>' +
            '</div>';
    }

    $('#CandidateRows').on('change', '.apya-cand-check', function () {
        selected[$(this).data('id')] = this.checked;
        paintCandidates();
    });

    $('#SelectAll').on('change', function () {
        var on = this.checked;
        candidates.forEach(function (c) { selected[c.tenantId] = on; });
        paintCandidates();
    });

    function paintCandidates() {
        $('#CandidateRows').removeClass('apya-skel-rows').html(candidates.map(candidateRow).join(''));
        $('#CandidateEmpty').toggleClass('d-none', candidates.length > 0);

        var count = candidates.filter(function (c) { return selected[c.tenantId]; }).length;
        $('#SelectedCount').text(l('Grants:Dispatch:SendCount', count));
        $('#SendBtn').prop('disabled', count === 0);
    }

    // ---------- Gönderim ----------
    $('#SendBtn').on('click', function () {
        var ids = candidates.filter(function (c) { return selected[c.tenantId]; })
            .map(function (c) { return c.tenantId; });
        if (!ids.length) {
            abp.message.warn(l('Grants:Dispatch:NothingSelected'));
            return;
        }

        var $btn = $(this).prop('disabled', true);
        var assigned = $('#AssignedUser').val();
        service.send({
            grantCallId: callId,
            tenantIds: ids,
            note: $('#DispatchNote').val() || null,
            assignedUserId: assigned === '' ? null : assigned,
            sendNotification: $('#ChannelNotification').is(':checked'),
            sendEmail: $('#ChannelEmail').is(':checked')
        }).then(function (r) {
            abp.notify.success(l('Grants:Dispatch:Sent', r.sentCount, r.skippedCount));
            selected = {};
            return load();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- Yükleme ----------
    function load() {
        return service.preview(collectFilter()).then(function (c) {
            candidates = c.candidates || [];
            $('#CallTitle').text(c.grantName);
            $('#CallPeriod').text(c.period);
            $('#CandidateCount').text(l('Grants:Dispatch:CandidateCount', candidates.length, c.totalFirms));
            $('#ThresholdNote').text(l('Grants:Dispatch:ProgramThreshold', Math.round(c.grantMinMatchScore)));

            // Danışman listesi yükleriyle birlikte; seçim korunur.
            var current = $('#AssignedUser').val();
            var $sel = $('#AssignedUser').empty()
                .append($('<option>').val('').text(l('Grants:Dispatch:ConsultantNone')));
            (c.consultants || []).forEach(function (u) {
                $sel.append($('<option>').val(u.userId)
                    .text(u.name + ' · ' + l('Grants:Dispatch:ConsultantLoad', u.assignedCount)));
            });
            if (current) { $sel.val(current); }

            $('#OpportunityBox').html(c.consortiumOpportunityCount > 0
                ? '<div class="apya-opportunity"><i class="fa fa-lightbulb mt-1"></i><span>' +
                  esc(l('Grants:Dispatch:OpportunityText', c.consortiumOpportunityCount)) + '</span></div>'
                : '<div class="small text-muted">' + esc(l('Grants:Dispatch:NoOpportunity')) + '</div>');

            paintCandidates();
        });
    }

    $('#MinScoreValue').text('%' + $('#MinScore').val());
    load();
});
