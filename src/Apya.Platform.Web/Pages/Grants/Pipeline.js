$(function () {
    var service = apya.platform.grants.grantPipeline;
    var callService = apya.platform.grants.grantCall;
    var l = abp.localization.getResource('Platform');

    // Enum sıraları sunucudakiyle birebir.
    var riskKeys = ['DeadlineNear', 'DeadlinePassed', 'MissingDocuments', 'WaitingOnFirm', 'Unassigned'];
    var riskTone = ['warning', 'negative', 'warning', 'neutral', 'neutral'];
    var stageKeys = ['Basvuru', 'Degerlendirme', 'Onay', 'Odeme'];

    var board = null;
    var sortables = [];

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    // ---------- Kart ----------
    function riskChip(r) {
        var key = riskKeys[r.kind];
        return '<span class="apya-chip apya-chip-' + riskTone[r.kind] + '">' +
            esc(l('Grants:Pipeline:Risk:' + key, r.value)) + '</span>';
    }

    function card(c) {
        var amount = c.approvedAmount != null ? c.approvedAmount : c.requestedSupport;
        return '<div class="apya-pipe-card" data-id="' + c.applicationId + '">' +
            '<a class="apya-pipe-firm" href="/Grants/DetailHost?id=' + c.applicationId + '">' +
            esc(c.firmName) + '</a>' +
            '<span class="apya-pipe-grant">' + esc(c.grantName) + (c.period ? ' · ' + esc(c.period) : '') + '</span>' +
            (amount != null
                ? '<span class="apya-pipe-amount">' + money(amount) + ' ₺' +
                  (c.approvedAmount != null ? '' : ' <span class="apya-pipe-metric-sub">' +
                      esc(l('Grants:Pipeline:Requested')) + '</span>') + '</span>'
                : '') +
            '<span class="apya-pipe-risks">' + (c.risks || []).map(riskChip).join('') + '</span>' +
            '<span class="apya-pipe-foot">' +
            '<span class="apya-pipe-who apya-pipe-assign" role="button" tabindex="0">' +
            '<span class="apya-pipe-avatar' + (c.assignedUserName ? '' : ' apya-pipe-avatar--none') + '">' +
            esc(c.assignedUserName ? initials(c.assignedUserName) : '+') + '</span>' +
            '<span>' + esc(c.assignedUserName || l('Grants:Pipeline:Assign')) + '</span></span>' +
            (c.daysRemaining != null
                ? '<span class="apya-numeric">' + esc(l('Grants:Feed:Card:DaysLeft', c.daysRemaining)) + '</span>'
                : '') +
            '</span></div>';
    }

    function column(col) {
        var key = col.stepId ? 'step:' + col.stepId : 'stage:' + col.stage;
        var name = col.stepId ? col.name : l('Grants:Stage:' + stageKeys[col.stage]);
        return '<div class="apya-pipe-col">' +
            '<div class="apya-pipe-col-head">' +
            '<span class="apya-pipe-col-name">' + esc(name) + '</span>' +
            '<span class="apya-pipe-col-count">' + col.cards.length + '</span></div>' +
            '<div class="apya-pipe-drop" data-col="' + esc(key) + '">' +
            col.cards.map(card).join('') + '</div></div>';
    }

    // ---------- Sürükle-bırak ----------
    function wireSortables() {
        sortables.forEach(function (s) { s.destroy(); });
        sortables = [];

        $('.apya-pipe-drop').each(function () {
            sortables.push(new Sortable(this, {
                group: 'pipeline',
                animation: 150,
                ghostClass: 'sortable-ghost',
                onAdd: function (evt) {
                    var key = $(evt.to).data('col').split(':');
                    var input = { applicationId: $(evt.item).data('id') };
                    if (key[0] === 'step') { input.stepId = key[1]; } else { input.stage = Number(key[1]); }

                    service.move(input).then(function (dto) {
                        board = dto; paint();
                        abp.notify.success(l('Grants:Pipeline:Moved'));
                    }).fail(function () { load(); });
                }
            }));
        });
    }

    // ---------- Atama ----------
    $('#Board').on('click', '.apya-pipe-assign', function () {
        var applicationId = $(this).closest('.apya-pipe-card').data('id');
        var options = {};
        (board.consultants || []).forEach(function (u) {
            options[u.userId] = u.name + ' · ' + l('Grants:Dispatch:ConsultantLoad', u.assignedCount);
        });
        options[''] = l('Grants:Dispatch:ConsultantNone');

        abp.message.prompt(l('Grants:Pipeline:AssignPrompt'), '', { inputType: 'select', inputOptions: options })
            .then(function (result) {
                if (!result.isConfirmed) { return; }
                service.assign({
                    applicationId: applicationId,
                    userId: result.value === '' ? null : result.value
                }).then(function (dto) {
                    board = dto; paint();
                    abp.notify.success(l('Grants:Pipeline:Assigned'));
                });
            });
    });

    // ---------- Süzgeçler ----------
    $('#CallSelect, #ConsultantFilter').on('change', load);

    function fillConsultantFilter() {
        var current = $('#ConsultantFilter').val();
        var $sel = $('#ConsultantFilter').empty()
            .append($('<option>').val('').text(l('Grants:Pipeline:AllConsultants')));
        (board.consultants || []).forEach(function (u) {
            $sel.append($('<option>').val(u.userId)
                .text(u.name + ' · ' + l('Grants:Dispatch:ConsultantLoad', u.assignedCount)));
        });
        if (current) { $sel.val(current); }
    }

    // ---------- Çizim ----------
    function paint() {
        $('#Board').removeClass('apya-skel-cards').html((board.columns || []).map(column).join(''));
        $('#BoardEmpty').toggleClass('d-none', (board.columns || []).length > 0);

        $('#TemplateChip').text(board.isTemplateDriven
            ? l('Grants:Pipeline:FromTemplate', board.stageTemplateName || '')
            : l('Grants:Pipeline:FromStages'));
        // Şablon bağlantısı yalnız sütunlar şablondan geldiğinde anlamlı.
        $('#TemplateLink').toggleClass('d-none', !board.isTemplateDriven);

        $('#SumRisky').text(board.riskyCount);
        $('#SumRiskySub').text(l('Grants:Pipeline:Summary:RiskySub', board.riskyDayThreshold));
        $('#SumDocs').text(board.waitingDocumentApplicationCount);
        $('#SumDocsSub').text(l('Grants:Pipeline:Summary:DocumentsSub', board.waitingDocumentCount));
        $('#SumReady').text(board.readyForProjectCount);
        $('#SumReadySub').text(board.columns.length
            ? l('Grants:Pipeline:Summary:LastStageSub',
                board.isTemplateDriven
                    ? board.columns[board.columns.length - 1].name
                    : l('Grants:Stage:' + stageKeys[board.columns[board.columns.length - 1].stage]))
            : '');
        $('#SumAmount').text(money(board.pipelineAmount) + ' ₺');

        fillConsultantFilter();
        wireSortables();
    }

    function load() {
        var callId = $('#CallSelect').val();
        var userId = $('#ConsultantFilter').val();
        return service.getBoard(callId || null, userId || null).then(function (dto) {
            board = dto; paint();
        });
    }

    // Çağrı listesi: pano tek çağrı seçilince şablon sütunlarına geçer.
    callService.getList({ maxResultCount: 200 }).then(function (result) {
        var $sel = $('#CallSelect').append($('<option>').val('').text(l('Grants:Pipeline:AllCalls')));
        (result.items || []).forEach(function (c) {
            $sel.append($('<option>').val(c.id).text((c.grantName || '') + ' · ' + c.period));
        });
        load();
    });
});
