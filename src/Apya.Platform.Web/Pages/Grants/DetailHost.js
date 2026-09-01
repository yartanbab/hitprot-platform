$(function () {
    var service = apya.platform.grants.grantApplicationDetail;
    var wizard = apya.platform.grants.grantApplicationWizard;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var partyKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];
    var stateKeys = ['Empty', 'InProgress', 'Live', 'Complete', 'Locked'];
    var stateTone = ['neutral', 'warning', 'accent', 'positive', 'neutral'];
    var activityKinds = ['StageMoved', 'AssignmentChanged', 'HandedOver', 'Submitted'];
    var trancheStatus = ['Planlandi', 'Odendi', 'Iptal'];

    var model = null;
    var channel = 'all';

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
    function hours(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 1 }); }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    // ---------- Süreç adımları ----------
    function paintSteps() {
        var steps = model.steps || [];
        $('#NoTemplate').toggleClass('d-none', steps.length > 0);
        $('#Steps').html(steps.map(function (s, i) {
            return '<div class="apya-dh-step' + (s.isCurrent ? ' is-current' : (s.isDone ? ' is-done' : '')) + '">' +
                '<span class="apya-dh-step-no">' + (i + 1) + (s.isDone ? ' ✓' : '') + '</span>' +
                '<span class="apya-dh-step-name">' + esc(s.name) + '</span>' +
                '<span class="apya-dh-step-no">' + esc(l('Grants:Party:' + partyKeys[s.owner])) + '</span>' +
                '</div>';
        }).join(''));
        // Şablon yoksa ilerletme yapılamaz; pano dört sabit aşamayı kullanır.
        $('#AdvanceBtn').prop('disabled', steps.length === 0);
    }

    // ---------- Form durumu ----------
    // Cümle İSTEMCİDE kurulur: sunucu bölüm anahtarı + sayıları döner.
    function sectionNote(s) {
        if (s.state === 3) { return l('Grants:DetailHost:Section:Complete'); }
        if (s.state === 4) { return l('Grants:DetailHost:Section:Locked'); }
        if (s.total > 0) { return l('Grants:DetailHost:Section:Progress', s.value, s.total); }
        return l('Grants:DetailHost:Section:Empty');
    }

    function paintSections() {
        $('#Sections').html((model.sections || []).map(function (s) {
            return '<div class="apya-dh-section">' +
                '<span><i class="fa ' + (s.state === 3 ? 'fa-circle-check text-success'
                    : s.state === 4 ? 'fa-lock text-muted' : 'fa-circle-dot text-warning') + '"></i></span>' +
                '<span>' + esc(l('Grants:DetailHost:Section:' + s.key)) +
                '<br /><span class="apya-dh-section-note">' + esc(sectionNote(s)) + '</span></span>' +
                '<span><span class="apya-chip apya-chip-' + stateTone[s.state] + '">' +
                esc(l('Grants:DetailHost:State:' + stateKeys[s.state])) + '</span></span>' +
                '<span class="apya-dh-section-note">' +
                (s.party != null ? esc(l('Grants:DetailHost:OnParty', l('Grants:Party:' + partyKeys[s.party]))) : '') +
                '</span></div>';
        }).join(''));
    }

    // ---------- Akış ----------
    $('.apya-choice-row').on('click', '.apya-choice', function () {
        $('.apya-choice-row .apya-choice').removeClass('is-on');
        $(this).addClass('is-on');
        channel = $(this).data('channel');
        paintFeed();
    });

    function activityText(a) {
        if (a.channel === 0) { return a.text; }
        if (a.channel === 1) {
            return l('Grants:DetailHost:Activity:Version', a.documentName || '', a.versionNo) +
                (a.text ? ' · ' + a.text : '');
        }
        return l('Grants:DetailHost:Activity:' + activityKinds[a.kind], a.text || '');
    }

    function paintFeed() {
        var items = (model.activities || []).filter(function (a) {
            return channel === 'all' || a.channel === Number(channel);
        });

        $('#Feed').html(items.length
            ? items.map(function (a) {
                return '<div class="apya-dh-item">' +
                    '<span class="apya-dh-item-avatar">' + esc(initials(a.actorName)) + '</span>' +
                    '<span><span class="apya-dh-item-head">' +
                    '<span class="fw-semibold">' + esc(a.actorName) + '</span>' +
                    '<span class="apya-chip apya-chip-neutral">' +
                    esc(l('Grants:Party:' + partyKeys[a.actorRole])) + '</span>' +
                    '<span class="apya-dh-item-time">' + esc(date(a.at)) + '</span></span>' +
                    '<span class="apya-dh-item-text">' + esc(activityText(a)) + '</span></span></div>';
            }).join('')
            : '<div class="apya-dh-hint">' + esc(l('Grants:DetailHost:Feed:Empty')) + '</div>');
    }

    // ---------- Sağ panel ----------
    function paintSide() {
        $('#Tranches').html((model.tranches || []).length
            ? model.tranches.map(function (t) {
                return '<div class="apya-dh-row"><span class="apya-numeric">#' + t.sequenceNo + '</span>' +
                    '<span class="apya-numeric fw-semibold">' + money(t.amount) + ' ₺</span>' +
                    '<span class="apya-chip apya-chip-' + (t.status === 1 ? 'positive' : 'neutral') + '">' +
                    esc(l('Grants:Tranche:' + trancheStatus[t.status])) + '</span>' +
                    '<span class="apya-dh-item-time">' + esc(date(t.dueDate)) + '</span></div>';
            }).join('')
            : '<div class="apya-dh-hint">' + esc(l('Grants:DetailHost:NoTranche')) + '</div>');

        $('#Milestones').html((model.milestones || []).length
            ? model.milestones.map(function (m) {
                return '<div class="apya-dh-row"><span><i class="fa ' +
                    (m.isCompleted ? 'fa-circle-check text-success' : 'fa-circle-dot text-muted') +
                    ' me-1"></i>' + esc(m.title) + '</span>' +
                    '<span class="apya-dh-item-time">' + esc(date(m.dueDate)) + '</span></div>';
            }).join('')
            : '<div class="apya-dh-hint">' + esc(l('Grants:DetailHost:NoMilestone')) + '</div>');

        $('#TotalHours').text(hours(model.totalHours) + ' sa');
        $('#SuccessFee').text(model.successFeePercent != null ? '%' + model.successFeePercent : '—');
        $('#Revenue').text(model.estimatedRevenue != null ? money(model.estimatedRevenue) + ' ₺' : '—');

        $('#Logs').html((model.consultingLogs || []).slice(0, 6).map(function (g) {
            return '<div class="apya-dh-row"><span class="apya-dh-section-note">' +
                esc(date(g.workDate)) + ' · ' + esc(g.userName) + (g.note ? ' · ' + esc(g.note) : '') + '</span>' +
                '<span class="apya-numeric">' + hours(g.hours) + ' sa</span></div>';
        }).join(''));
    }

    // ---------- Eylemler ----------
    $('#AdvanceBtn').on('click', function () {
        service.advanceToNextStep(appId).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:DetailHost:Advanced', dto.currentStageName || ''));
        });
    });

    $('#SendMessageBtn').on('click', sendMessage);
    $('#MessageBody').on('keydown', function (e) { if (e.key === 'Enter') { sendMessage(); } });

    function sendMessage() {
        var body = ($('#MessageBody').val() || '').trim();
        if (!body) { return; }
        // Mesaj 2a'daki yazışmayla AYNI kayda gider; firma sihirbazda görür.
        wizard.sendMessage({ applicationId: appId, body: body }).then(function () {
            $('#MessageBody').val('');
            load();
        });
    }

    $('#AddHoursBtn').on('click', function () {
        abp.message.prompt(l('Grants:DetailHost:HoursPrompt')).then(function (result) {
            if (!result.isConfirmed) { return; }
            var value = Number((result.value || '').replace(',', '.'));
            if (!value) { return; }
            service.addConsultingLog({ applicationId: appId, hours: value }).then(function (dto) {
                model = dto; paint();
            });
        });
    });

    $('#SetFeeBtn').on('click', function () {
        abp.message.prompt(l('Grants:DetailHost:FeePrompt')).then(function (result) {
            if (!result.isConfirmed) { return; }
            var value = (result.value || '').replace(',', '.');
            service.setSuccessFee({
                applicationId: appId,
                percent: value === '' ? null : Number(value)
            }).then(function (dto) { model = dto; paint(); });
        });
    });

    // ---------- Çizim ----------
    function paint() {
        $('#FirmInitials').text(initials(model.firmName));
        $('#HeaderTitle').text(model.firmName + ' · ' + model.grantName);
        $('#HeaderMeta').text([model.reference, model.issuer, model.period,
            l('Grants:DetailHost:OpenedOn', date(model.openedAt))].filter(Boolean).join(' · '));

        $('#StageChip').text(model.currentStageName || l('Grants:DetailHost:NoStage'));
        $('#DaysChip').toggleClass('d-none', model.daysRemaining == null)
            .text(l('Grants:Feed:Card:DaysLeft', model.daysRemaining));
        $('#ScoreChip').toggleClass('d-none', model.matchScore == null)
            .text(l('Grants:DetailHost:Match', model.matchScore));
        $('#DocumentsLink').attr('href', '/Grants/Documents?id=' + appId);

        paintSteps();
        paintSections();
        paintFeed();
        paintSide();
    }

    function load() {
        return service.get(appId).then(function (dto) { model = dto; paint(); });
    }

    load();
});
