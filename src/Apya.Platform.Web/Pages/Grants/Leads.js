$(function () {
    var service = apya.platform.grants.grantLead;
    var l = abp.localization.getResource('Platform');

    // Enum sıraları sunucudakiyle birebir.
    var statusKeys = ['Yeni', 'Arandi', 'RandevuVerildi', 'MusteriOldu', 'Takipte', 'Kapandi'];
    var signalKeys = ['HighAmountNeedsConsortium', 'DeadlinePressure', 'MultipleEligible',
                      'RevenueAboveThreshold', 'RdStaffLowTrl'];
    // CompanySize [Flags]: 1/2/4/8 — sıra numarası DEĞİL.
    var sizeNames = { 1: 'Mikro', 2: 'Kucuk', 4: 'Orta', 8: 'Buyuk' };

    var model = null;
    var detail = null;
    var selectedId = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺'; }
    function shortMoney(v) {
        if (!v) { return '0 ₺'; }
        return v >= 1000000
            ? (v / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M ₺'
            : money(v);
    }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

    // ---------- Liste ----------
    function heatTone(score) {
        if (score >= model.qualifiedThreshold) { return 'apya-chip-negative'; }
        if (score >= model.callThreshold) { return 'apya-chip-warning'; }
        return 'apya-chip-neutral';
    }

    function row(r) {
        return '<button type="button" class="apya-lead-row' +
            (r.id === selectedId ? ' is-selected' : '') + '" data-id="' + r.id + '">' +
            '<span class="apya-lead-firm">' +
            '<strong>' + esc(r.firmName) + '</strong>' +
            '<span>' + esc(r.contactName) + ' · ' + esc(r.grantName) + ' · ' + esc(date(r.creationTime)) +
            '</span></span>' +

            '<span class="apya-lead-heat">' +
            '<span>' + r.heatScore + '</span>' +
            '<span class="apya-mini-bar"><span style="width:' + r.heatScore + '%"></span></span></span>' +

            '<span class="apya-lead-num">' + r.passedRuleCount + '/' + r.totalRuleCount + '</span>' +
            '<span class="apya-lead-num">' + esc(shortMoney(r.estimatedSupport)) + '</span>' +
            '<span class="apya-lead-num">' + esc(l('Grants:Difficulty:' + r.difficulty)) + '</span>' +
            '<span><span class="apya-chip ' + heatTone(r.heatScore) + '">' +
            esc(l('Grants:Leads:Status:' + statusKeys[r.status])) + '</span></span></button>';
    }

    function paintList() {
        var items = model.items || [];
        $('#LeadRows').html(items.map(row).join(''));
        $('#LeadEmpty').toggleClass('d-none', items.length > 0);
        $('#LeadCount').text(items.length);

        $('#KpiWeek').text(model.thisWeekCount);
        $('#KpiQualified').text(model.qualifiedCount);
        $('#KpiQualifiedLabel').text(l('Grants:Leads:Kpi:Qualified', model.qualifiedThreshold));
        // 🔴 Oran örneklem küçükken sunucu null döner; sayıyı uydurmuyoruz.
        $('#KpiMeetings').text(model.meetingRatePercent != null
            ? model.meetingCount + ' · %' + model.meetingRatePercent
            : model.meetingCount);
        $('#KpiConverted').text(model.convertedCount);
        $('#KpiPipeline').text(shortMoney(model.pipelineAmount));
    }

    // ---------- Detay ----------
    function answerChips(d) {
        var chips = [];
        function add(key, value) {
            if (value == null || value === '') { return; }
            chips.push('<span class="apya-chip apya-chip-neutral">' +
                esc(l('Grants:Leads:Answer:' + key)) + ': ' + esc(value) + '</span>');
        }
        add('Size', d.size != null && sizeNames[d.size] ? l('Grants:CompanySize:' + sizeNames[d.size]) : null);
        add('Age', d.companyAgeYears);
        add('Sector', d.sector);
        add('RdStaff', d.rdStaffCount);
        add('Trl', d.trl);
        add('Revenue', d.annualRevenue != null ? money(d.annualRevenue) : null);
        add('Consortium', d.hasConsortiumPartner == null ? null
            : l(d.hasConsortiumPartner ? 'Grants:Public:Option:Yes' : 'Grants:Public:Option:No'));

        return chips.length ? chips.join('') :
            '<span class="apya-field-hint">' + esc(l('Grants:Leads:NoAnswers')) + '</span>';
    }

    function paintDetail() {
        $('#LeadSelectHint').toggleClass('d-none', !!detail);
        $('#LeadDetail').toggleClass('d-none', !detail);
        if (!detail) { return; }

        $('#LeadDetailTitle').text(detail.firmName);
        $('#LeadDetailHeat').removeClass('d-none').text(l('Grants:Leads:Heat', detail.heatScore));

        $('#LeadContact').html(
            '<span>' + esc(detail.contactName) +
            (detail.contactTitle ? ' · ' + esc(detail.contactTitle) : '') + '</span>' +
            '<span>' + esc(detail.email) + (detail.phone ? ' · ' + esc(detail.phone) : '') + '</span>' +
            (detail.preferredMeetingAt
                ? '<span>' + esc(l('Grants:Leads:Preferred', date(detail.preferredMeetingAt))) + '</span>'
                : ''));

        $('#LeadAnswers').html(answerChips(detail));

        $('#LeadSignals').html((detail.signals || []).length
            ? detail.signals.map(function (s) {
                return '<span class="apya-chip apya-chip-warning">' +
                    esc(l('Grants:Leads:Signal:' + signalKeys[s])) + '</span>';
            }).join('')
            : '<span class="apya-field-hint">' + esc(l('Grants:Leads:NoSignals')) + '</span>');

        $('#LeadStatusRow').html(statusKeys.map(function (key, i) {
            return '<button type="button" class="apya-choice' +
                (detail.status === i ? ' is-on' : '') + '" data-status="' + i + '">' +
                esc(l('Grants:Leads:Status:' + key)) + '</button>';
        }).join(''));

        $('#LeadLoads').html((detail.consultantLoads || []).map(function (c) {
            return '<span class="apya-lead-load"><span>' + esc(c.name) + '</span>' +
                '<span>' + c.openApplicationCount + '</span></span>';
        }).join(''));

        $('#ConvertBtn').prop('disabled', detail.isConverted);
        $('#ConvertedNote').toggleClass('d-none', !detail.isConverted)
            .text(detail.isConverted ? l('Grants:Leads:AlreadyConverted') : '');
    }

    function loadDetail(id) {
        service.getDetail(id).then(function (dto) {
            detail = dto;
            paintDetail();
        });
    }

    // ---------- Olaylar ----------
    $('#LeadRows').on('click', '.apya-lead-row', function () {
        selectedId = $(this).data('id');
        paintList();
        loadDetail(selectedId);
    });

    $('#LeadStatusRow').on('click', '.apya-choice', function () {
        var status = $(this).data('status');
        service.setStatus({ leadId: selectedId, status: status }).then(function (dto) {
            model = dto;
            paintList();
            loadDetail(selectedId);
        });
    });

    $('#ConvertBtn').on('click', function () {
        if (!detail || detail.isConverted) { return; }

        service.convertToTenant({ leadId: detail.id }).then(function (r) {
            abp.notify.success(l('Grants:Leads:Converted', r.tenantName, r.profileCompletionPercent));
            service.get().then(function (dto) {
                model = dto;
                paintList();
                loadDetail(detail.id);
            });
        });
    });

    // ---------- Açılış ----------
    service.get().then(function (dto) {
        model = dto;
        var first = (dto.items || [])[0];
        selectedId = first ? first.id : null;
        paintList();
        if (selectedId) { loadDetail(selectedId); }
    });
});
