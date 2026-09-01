$(function () {
    var service = apya.platform.grants.grantImplementation;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var reportKeys = ['Planlandi', 'Hazirlaniyor', 'Gonderildi', 'Onaylandi', 'RevizyonIstendi'];
    var reportTone = ['neutral', 'warning', 'accent', 'positive', 'negative'];
    var trancheKeys = ['Planlandi', 'Odendi', 'Iptal'];
    var obligationKeys = ['ReportDue', 'TrancheDue'];

    var model = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

    // ---------- Zincir ----------
    function section(s) {
        return '<span class="apya-im-section" data-id="' + s.id + '">' +
            '<i class="fa ' + (s.status === 3 ? 'fa-circle-check text-success'
                : s.status === 4 ? 'fa-circle-xmark text-danger'
                : s.status === 1 ? 'fa-spinner text-warning' : 'fa-circle-dot text-muted') + '"></i>' +
            esc(s.name) +
            (s.note ? ' <span class="apya-im-section-note">· ' + esc(s.note) + '</span>' : '') +
            '</span>';
    }

    function chainItem(c) {
        var paid = c.trancheStatus === 1;
        var cls = paid ? ' is-paid' : (c.paymentBlocked ? ' is-blocked' : '');

        var tranche = c.trancheId
            ? '<span class="apya-im-tranche">' +
              '<span class="apya-im-amount">' + money(c.trancheAmount) + ' ₺</span>' +
              '<span class="apya-chip apya-chip-' + (paid ? 'positive' : 'neutral') + '">' +
              esc(l('Grants:Tranche:' + trancheKeys[c.trancheStatus])) + '</span>' +
              (c.paymentBlocked
                  ? '<span class="apya-im-section-note">' + esc(l('Grants:Impl:PaymentBlocked')) + '</span>'
                  : '') +
              (model.canManage && !paid && !c.paymentBlocked
                  ? '<button type="button" class="btn btn-sm btn-outline-success apya-im-pay" ' +
                    'data-id="' + c.trancheId + '">' + esc(l('Grants:Impl:MarkPaid')) + '</button>'
                  : '') +
              '</span>'
            : '<span class="apya-im-tranche"><span class="apya-im-section-note">' +
              esc(l('Grants:Impl:NoTranche')) + '</span></span>';

        return '<div class="apya-im-chain-item' + cls + '" data-report="' + (c.reportId || '') + '">' +
            '<span class="apya-im-no">' + c.order + '</span>' +
            '<span><span class="apya-im-title">' +
            esc(c.title || l('Grants:Impl:TrancheOnly')) + '</span> ' +
            (c.reportId
                ? '<span class="apya-chip apya-chip-' + reportTone[c.status] + '">' +
                  esc(l('Grants:Impl:Status:' + reportKeys[c.status])) + '</span>'
                : '') +
            (c.dueDate
                ? ' <span class="apya-im-section-note">' + esc(date(c.dueDate)) + '</span>' : '') +
            (c.note ? '<div class="apya-im-section-note">' + esc(c.note) + '</div>' : '') +
            (c.sections && c.sections.length
                ? '<div class="apya-im-sections">' + c.sections.map(section).join('') + '</div>' : '') +
            (model.canManage && c.reportId
                ? '<div class="mt-2 d-flex gap-2">' +
                  '<button type="button" class="btn btn-sm btn-outline-secondary apya-im-status">' +
                  esc(l('Grants:Impl:SetStatus')) + '</button>' +
                  '<button type="button" class="btn btn-sm btn-outline-secondary apya-im-add-section">' +
                  esc(l('Grants:Impl:AddSection')) + '</button></div>'
                : '') +
            '</span>' + tranche + '</div>';
    }

    function paintChain() {
        var chain = model.chain || [];
        $('#Chain').html(chain.map(chainItem).join(''));
        $('#ChainEmpty').toggleClass('d-none', chain.length > 0);
    }

    // ---------- Eylemler ----------
    $('#AddReportBtn').on('click', function () {
        abp.message.prompt(l('Grants:Impl:AddReportPrompt')).then(function (r) {
            if (!r.isConfirmed || !r.value) { return; }
            service.saveReport({ applicationId: appId, title: r.value }).then(function (dto) {
                model = dto; paint();
            });
        });
    });

    $('#Chain').on('click', '.apya-im-status', function () {
        var reportId = $(this).closest('.apya-im-chain-item').data('report');
        var options = {};
        reportKeys.forEach(function (k, i) { options[i] = l('Grants:Impl:Status:' + k); });

        abp.message.prompt(l('Grants:Impl:StatusPrompt'), '', {
            inputType: 'select', inputOptions: options
        }).then(function (r) {
            if (!r.isConfirmed) { return; }
            service.setReportStatus({ reportId: reportId, status: Number(r.value) }).then(function (dto) {
                model = dto; paint();
            });
        });
    });

    $('#Chain').on('click', '.apya-im-add-section', function () {
        var reportId = $(this).closest('.apya-im-chain-item').data('report');
        abp.message.prompt(l('Grants:Impl:AddSectionPrompt')).then(function (r) {
            if (!r.isConfirmed || !r.value) { return; }
            service.addSection({ reportId: reportId, name: r.value }).then(function (dto) {
                model = dto; paint();
            });
        });
    });

    $('#Chain').on('click', '.apya-im-section', function () {
        if (!model.canManage) { return; }
        var sectionId = $(this).data('id');
        var options = {};
        reportKeys.forEach(function (k, i) { options[i] = l('Grants:Impl:Status:' + k); });

        abp.message.prompt(l('Grants:Impl:SectionStatusPrompt'), '', {
            inputType: 'select', inputOptions: options
        }).then(function (r) {
            if (!r.isConfirmed) { return; }
            abp.message.prompt(l('Grants:Impl:SectionNotePrompt')).then(function (n) {
                service.setSectionStatus({
                    sectionId: sectionId,
                    status: Number(r.value),
                    note: n.isConfirmed ? (n.value || null) : null
                }).then(function (dto) { model = dto; paint(); });
            });
        });
    });

    $('#Chain').on('click', '.apya-im-pay', function () {
        var trancheId = $(this).data('id');
        var $btn = $(this).prop('disabled', true);
        service.markTranchePaid(trancheId).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:Impl:Paid'));
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- Bütçe ----------
    function budgetRow(b) {
        return '<div class="apya-im-budget-row' + (b.isNearLimit ? ' is-near' : '') + '">' +
            '<span>' + esc(b.name) + '</span>' +
            '<span class="apya-numeric">' + money(b.approvedAmount) + '</span>' +
            '<span class="apya-numeric">' + money(b.spentAmount) + '</span>' +
            '<span class="apya-numeric">' + money(b.remainingAmount) + '</span>' +
            '<span class="apya-im-usage">' +
            '<span class="apya-mini-bar' + (b.isNearLimit ? ' apya-im-usage-bar-over' : '') + '">' +
            '<span style="width:' + Math.min(100, b.usagePercent) + '%"></span></span>' +
            '<span class="apya-numeric">%' + b.usagePercent + '</span></span></div>';
    }

    function paintBudget() {
        var rows = model.budget || [];
        $('#BudgetRows').html(rows.map(budgetRow).join(''));
        $('#BudgetTable').toggleClass('d-none', rows.length === 0);
        // Proje yoksa gerçekleşme de yoktur; sebebi ekranda yazar.
        $('#NoProjectNote').toggleClass('d-none', model.hasProject);
        $('#TransferNote').toggleClass('d-none', !rows.some(function (b) { return b.isNearLimit; }));
    }

    // ---------- Yükümlülükler ----------
    function paintObligations() {
        var items = model.obligations || [];
        $('#Obligations').html(items.length
            ? items.map(function (o) {
                var text = o.kind === 0
                    ? l('Grants:Impl:Obligation:Report', o.label)
                    : l('Grants:Impl:Obligation:Tranche', o.label);
                return '<div class="apya-im-obligation' + (o.isOverdue ? ' is-overdue' : '') + '">' +
                    '<span>' + esc(text) + '</span>' +
                    '<span class="apya-im-obligation-date">' + esc(date(o.dueDate)) +
                    (o.isOverdue
                        ? ' · ' + esc(l('Grants:Impl:Overdue', -o.daysLeft))
                        : ' · ' + esc(l('Grants:Feed:Card:DaysLeft', o.daysLeft))) +
                    '</span></div>';
            }).join('')
            : '<div class="apya-im-hint">' + esc(l('Grants:Impl:NoObligation')) + '</div>');
    }

    // ---------- Çizim ----------
    function paint() {
        $('#HeaderTitle').text(model.grantName);
        $('#HeaderMeta').text([model.issuer, model.period,
            model.contractStart && model.contractEnd
                ? date(model.contractStart) + ' — ' + date(model.contractEnd) : null]
            .filter(Boolean).join(' · '));

        $('#Approved').text(money(model.approvedAmount) + ' ₺');
        $('#Collected').text(money(model.collectedAmount) + ' ₺');
        $('#Remaining').text(money(model.remainingAmount) + ' ₺');
        $('#CollectedBar').css('width', model.collectedPercent + '%');
        $('#CollectedPercent').text('%' + model.collectedPercent);

        $('#AddReportBtn').toggleClass('d-none', !model.canManage);
        $('#ProjectLink').toggleClass('d-none', !model.projectId)
            .attr('href', '/Projects/ProjectDetails/' + model.projectId);
        $('#DocumentsLink').attr('href', '/Grants/Documents?id=' + appId);

        paintChain();
        paintBudget();
        paintObligations();
    }

    service.get(appId).then(function (dto) { model = dto; paint(); });
});
