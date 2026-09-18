$(function () {
    var service = apya.platform.grants.grantApplicationDetail;
    var wizard = apya.platform.grants.grantApplicationWizard;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var partyKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];
    // Enum adları ve rozet tonları sunucudan gelir (GrantStatusCatalog → _StatusMap).
    var stateKeys = apyaGrantStatus.sectionState.keys;
    var stateTone = apyaGrantStatus.sectionState.tones;
    // Akış olayı adları da sözlükten: para olayları (H-07) eklendiğinde elle dizi "undefined" basardı.
    var activityKinds = apyaGrantStatus.activity.keys;
    // Dilim durumu da sunucudan: dizi bir kaymıştı ve ödenmiş dilim "İptal" görünüyordu.
    // Ton da sözlükten: elle yazılmış `status === 1 ? 'positive'` talep edileni yeşil, ödeneni gri boyuyordu.
    var trancheStatus = apyaGrantStatus.tranche.keys;
    var trancheTone = apyaGrantStatus.tranche.tones;
    var decisionKeys = apyaGrantStatus.decision.keys;
    var decisionTone = apyaGrantStatus.decision.tones;
    var REJECTED = decisionKeys.indexOf('Reddedildi');
    var appeal = apya.platform.grants.grantAppeal;
    var decisionModal = new bootstrap.Modal(document.getElementById('DecisionModal'));

    var model = null;
    var decision = null;
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

    // Bölüm kartta yalnız durum; iş, bölümün düzenlendiği ekranda yapılır.
    // Sihirbaza adım parametresi GEÇİLMEZ: adım sunucuda iki tarafa ortak tutulur,
    // bağlantı açınca firmanın ekranı da kayardı.
    var sectionPages = {
        Summary: '/Grants/Wizard?id=',
        Budget: '/Grants/Wizard?id=',
        Documents: '/Grants/Documents?id=',
        Submit: '/Grants/Documents?id='
    };

    function paintSections() {
        $('#Sections').html((model.sections || []).map(function (s) {
            var href = sectionPages[s.key] ? sectionPages[s.key] + appId : null;
            return (href ? '<a class="apya-dh-section is-link" href="' + href + '">' : '<div class="apya-dh-section">') +
                '<span><i class="fa ' + (s.state === 3 ? 'fa-circle-check text-success'
                    : s.state === 4 ? 'fa-lock text-muted' : 'fa-circle-dot text-warning') + '"></i></span>' +
                '<span>' + esc(l('Grants:DetailHost:Section:' + s.key)) +
                (href ? ' <i class="fa fa-chevron-right apya-dh-section-go"></i>' : '') +
                '<br /><span class="apya-dh-section-note">' + esc(sectionNote(s)) + '</span></span>' +
                '<span><span class="apya-chip apya-chip-' + stateTone[s.state] + '">' +
                esc(l('Grants:DetailHost:State:' + stateKeys[s.state])) + '</span></span>' +
                '<span class="apya-dh-section-note">' +
                (s.party != null ? esc(l('Grants:DetailHost:OnParty', l('Grants:Party:' + partyKeys[s.party]))) : '') +
                '</span>' + (href ? '</a>' : '</div>');
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
                    '<span class="apya-chip apya-chip-' + trancheTone[t.status] + '">' +
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
        abp.message.prompt(l('Grants:DetailHost:HoursPrompt')).then(function (input) {
            if (input === null) { return; }
            var value = Number((input || '').replace(',', '.'));
            if (!value) { return; }
            service.addConsultingLog({ applicationId: appId, hours: value }).then(function (dto) {
                model = dto; paint();
            });
        });
    });

    $('#SetFeeBtn').on('click', function () {
        abp.message.prompt(l('Grants:DetailHost:FeePrompt')).then(function (input) {
            if (input === null) { return; }
            var value = (input || '').replace(',', '.');
            service.setSuccessFee({
                applicationId: appId,
                percent: value === '' ? null : Number(value)
            }).then(function (dto) { model = dto; paint(); });
        });
    });

    // ---------- Kurum kararı ----------
    function pad(n) { return ('0' + n).slice(-2); }
    // toISOString() TZ+03'te günü bir geri kaydırır; <input type=date> için gün elle kurulur.
    function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function day(v) { return v ? String(v).substring(0, 10) : ''; }

    function paintDecision() {
        var has = !!(decision && decision.decisionId);
        $('#DecisionNone').toggleClass('d-none', has);
        $('#DecisionChip')
            .attr('class', 'apya-chip' + (has ? ' apya-chip-' + decisionTone[decision.outcome] : ' d-none'))
            .text(has ? l('Grants:Decision:Outcome:' + decisionKeys[decision.outcome]) : '');
        $('#DecisionMeta').toggleClass('d-none', !has).text(has ? [
            l('Grants:Decision:Meta:DecidedOn', date(decision.decidedOn)),
            decision.referenceNo ? l('Grants:Appeal:Reference', decision.referenceNo) : null,
            decision.outcome === REJECTED && decision.appealDeadline
                ? l('Grants:Decision:Meta:AppealUntil', date(decision.appealDeadline)) : null
        ].filter(Boolean).join(' · ') : '');
        $('#DecisionBtnText').text(l(has ? 'Grants:Decision:Edit' : 'Grants:Decision:Enter'));
        $('#DecisionBtn').prop('disabled', false);
        $('#DecisionAppealLink').toggleClass('d-none', !(has && decision.outcome === REJECTED));
    }

    // Number('') 0'dır, 0 da "Reddedildi" — boş seçim ayrıca denetlenir.
    function selectedOutcome() {
        var v = $('#DecisionOutcome').val();
        return v === '' || v == null ? null : Number(v);
    }

    function toggleAppealField() {
        $('#DecisionAppealField').toggleClass('d-none', selectedOutcome() !== REJECTED);
    }

    function openDecision() {
        var has = !!(decision && decision.decisionId);
        $('#DecisionOutcome').val(has ? String(decision.outcome) : '');
        $('#DecisionDecidedOn').val(has ? day(decision.decidedOn) : today());
        $('#DecisionReference').val(has ? (decision.referenceNo || '') : '');
        $('#DecisionAppealDeadline').val(has ? day(decision.appealDeadline) : '');
        toggleAppealField();
        decisionModal.show();
    }

    $('#DecisionOutcome').on('change', toggleAppealField);
    $('#DecisionBtn').on('click', openDecision);

    $('#DecisionForm').on('submit', function (e) {
        e.preventDefault();
        var outcome = selectedOutcome();
        if (outcome === null) { return; }
        var $save = $('#DecisionSaveBtn').prop('disabled', true);
        appeal.saveDecision({
            applicationId: appId,
            outcome: outcome,
            decidedOn: $('#DecisionDecidedOn').val(),
            referenceNo: ($('#DecisionReference').val() || '').trim() || null,
            appealDeadline: outcome === REJECTED ? ($('#DecisionAppealDeadline').val() || null) : null
        }).then(function (dto) {
            decision = dto;
            paintDecision();
            decisionModal.hide();
            abp.notify.success(l('Grants:Decision:Saved'));
        }).always(function () { $save.prop('disabled', false); });
    });

    function loadDecision() {
        return appeal.get(appId).then(function (dto) {
            decision = dto;
            paintDecision();
            // Appeal ekranının "kararı gir" bağlantısı buraya #decision ile gelir.
            if (location.hash === '#decision' && !dto.decisionId) { openDecision(); }
        });
    }

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
    loadDecision();
});
