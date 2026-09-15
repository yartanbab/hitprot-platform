$(function () {
    var service = apya.platform.grants.grantJourney;
    var interestService = apya.platform.grants.grantInterest;
    var l = abp.localization.getResource('Platform');
    var meetingModal = new bootstrap.Modal(document.getElementById('MeetingModal'));

    // GrantJourneyItemKind / GrantNextAction enum sıralarıyla birebir.
    var kindKeys = ['InterestPending', 'InterestRejected', 'InterestWithdrawn', 'ApplicationOpen',
        'ApplicationWithInstitution', 'ApplicationRejected', 'Project', 'Completed', 'CallClosed', 'IdeaPooled'];
    var kindTone = ['accent', 'neutral', 'neutral', 'warning', 'accent', 'negative', 'positive', 'positive', 'neutral', 'accent'];
    // GrantInterestSource: 0 firma · 1 danışman firma adına.
    var SOURCE_CONSULTANT = 1;
    var IDEA_TITLE_MAX = 120;
    var nextKeys = ['CompleteForm', 'UploadDocuments', 'WaitingOnConsultant', 'WaitingOnInstitution', 'InProject', 'Done'];

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function slotText(v) {
        return new Date(v).toLocaleString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', hour: '2-digit', minute: '2-digit' });
    }

    /// 18e · Bekleyen talebin görüşme durumu. GrantMeetingStatus: 0 Bekliyor · 1 Onaylandı · 2 Başka saat istendi.
    function meetingSentence(m) {
        if (!m) { return ''; }
        if (m.status === 1) { return l('Grants:Journey:Meeting:Confirmed', slotText(m.confirmedSlot), m.durationMinutes); }
        if (m.status === 2) { return l('Grants:Journey:Meeting:OtherTime', m.hostNote || ''); }
        return l('Grants:Journey:Meeting:Pending', m.slots.map(slotText).join(' · '));
    }

    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'; }
    function shortMoney(v) {
        if (v == null) { return '—'; }
        return v >= 1000000
            ? (v / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M ₺'
            : Math.round(v).toLocaleString('tr-TR') + ' ₺';
    }

    function deadlineSentence(i) {
        if (!i.deadline || i.daysRemaining == null || i.daysRemaining < 0) { return ''; }
        return i.daysRemaining === 0
            ? l('Grants:Journey:DeadlineToday', date(i.deadline))
            : l('Grants:Journey:Deadline', date(i.deadline), i.daysRemaining);
    }

    /// Satırın başlığındaki durum sözcüğü: "danışman incelemesinde", "evrak hazırlığı · 5/11".
    function stateText(i) {
        if (i.kind === 0) { return l(i.reviewerName ? 'Grants:Journey:State:InReview' : 'Grants:Journey:State:Sent'); }
        if (i.kind === 3 && i.documentsTotal > 0) {
            return l('Grants:Journey:State:Preparing') + ' · ' + i.documentsApproved + '/' + i.documentsTotal;
        }
        return l('Grants:Journey:State:' + kindKeys[i.kind]);
    }

    function body(i) {
        switch (i.kind) {
            case 0:
                return [i.reviewerName
                    ? l('Grants:Journey:Body:InReview', date(i.at), i.reviewerName)
                    : l('Grants:Journey:Body:Sent', date(i.at)), meetingSentence(i.meeting)].filter(Boolean).join(' ');
            case 1:
                return l('Grants:Journey:Body:Rejected', date(i.at));
            case 2:
                return l('Grants:Journey:Body:Withdrawn', date(i.at));
            case 3:
                return [l('Grants:Today:App:' + nextKeys[i.nextAction], i.nextActionValue),
                    i.consultantName ? l('Grants:Journey:Body:Consultant', i.consultantName) : '',
                    deadlineSentence(i)].filter(Boolean).join(' ');
            case 4:
                return l('Grants:Journey:Body:WithInstitution', date(i.at));
            case 5:
                return i.appealDaysLeft != null
                    ? l('Grants:Journey:Body:AppealOpen', i.appealDaysLeft)
                    : l('Grants:Journey:Body:AppealClosed');
            case 6:
                return [i.approvedAmount != null ? l('Grants:Journey:Body:Approved', shortMoney(i.approvedAmount)) : '',
                    i.projectName ? l('Grants:Journey:Body:Project', i.projectName) : '',
                    i.nextTrancheNo != null && i.nextTrancheDue
                        ? l('Grants:Journey:Body:NextTranche', i.nextTrancheNo, date(i.nextTrancheDue))
                        : i.collectedAmount > 0 ? l('Grants:Journey:Body:Collected', shortMoney(i.collectedAmount)) : ''
                ].filter(Boolean).join(' ');
            case 7:
                return l('Grants:Journey:Body:Completed', shortMoney(i.approvedAmount), shortMoney(i.collectedAmount));
            case 8:
                if (!i.applicationId) { return l('Grants:Journey:Body:ClosedInterest'); }
                return i.nextAction === 0
                    ? l('Grants:Journey:Body:ClosedForm', i.nextActionValue)
                    : i.nextAction === 1
                        ? l('Grants:Journey:Body:ClosedDocuments', i.nextActionValue)
                        : l('Grants:Journey:Body:ClosedApplication');
            case 9:
                return l(i.ideaSource === SOURCE_CONSULTANT ? 'Grants:Journey:Body:IdeaPooledByConsultant' : 'Grants:Journey:Body:IdeaPooled', date(i.at));
        }
        return '';
    }

    function actions(i) {
        var html = [];
        var link = function (href, key, primary) {
            return '<a class="btn btn-sm ' + (primary ? 'btn-primary' : 'btn-outline-secondary') + '" href="' + href + '">' + esc(l(key)) + '</a>';
        };
        switch (i.kind) {
            case 0:
                // Açık öneri yoksa (ya da danışman başka saat istediyse) firma saat önerir.
                if (!i.meeting || i.meeting.status === 2) {
                    html.push('<button type="button" class="btn btn-sm btn-primary" data-meeting="' + i.interestId + '" data-grant="' + esc(i.grantName) + '">' +
                        esc(l('Grants:Journey:Action:ProposeMeeting')) + '</button>');
                }
                html.push(link('/Grants/Detail?id=' + i.grantCallId, 'Grants:Journey:Action:Call', false));
                html.push('<button type="button" class="btn btn-sm btn-outline-danger" data-withdraw="' + i.interestId + '">' +
                    esc(l('Grants:Journey:Action:Withdraw')) + '</button>');
                break;
            case 3: html.push(link('/Grants/Wizard?id=' + i.applicationId, 'Grants:Journey:Action:Continue', true)); break;
            case 4: html.push(link('/Grants/Wizard?id=' + i.applicationId, 'Grants:Journey:Action:View', false)); break;
            case 5:
                if (i.appealDaysLeft != null) { html.push(link('/Grants/Appeal?id=' + i.applicationId, 'Grants:Journey:Action:Appeal', true)); }
                break;
            case 6:
            case 7: html.push(link('/Grants/Implementation?id=' + i.applicationId, 'Grants:Journey:Action:Implementation', false)); break;
            case 1:
            case 2:
            case 8: html.push(link('/Grants/Detail?id=' + i.grantCallId, 'Grants:Journey:Action:Call', false)); break;
            // 19a · Havuzdaki fikrin çağrısı yok; firma yalnız geri çekebilir.
            case 9:
                html.push('<button type="button" class="btn btn-sm btn-outline-danger" data-withdraw-idea="' + i.interestId + '">' +
                    esc(l('Grants:Journey:Action:WithdrawIdea')) + '</button>');
                break;
        }
        return html.join('');
    }

    /// Kartın başlığı: çağrının adı; havuzdaki fikirde çağrı olmadığı için fikrin kendisi (uzunsa kesilir).
    function name(i) {
        if (i.kind !== 9) { return '<span class="apya-jny-name">' + esc(i.grantName) + '</span>'; }
        var idea = i.idea || l('Grants:Journey:IdeaLabel');
        var short = idea.length > IDEA_TITLE_MAX ? idea.slice(0, IDEA_TITLE_MAX).trim() + '…' : idea;
        return '<span class="apya-jny-name" title="' + esc(idea) + '">' + esc(short) + '</span>';
    }

    function item(i) {
        var feedback = i.kind === 1 && i.hostFeedback
            ? '<blockquote class="apya-jny-feedback">' + esc(i.hostFeedback) + '</blockquote>' : '';
        return '<li class="apya-jny-item is-' + kindTone[i.kind] + '">' +
            '<span class="apya-jny-dot" aria-hidden="true"></span>' +
            '<div class="apya-jny-card">' +
            '<div class="apya-jny-card-head">' +
            name(i) +
            '<span class="apya-chip apya-chip-' + kindTone[i.kind] + '">' + esc(stateText(i)) + '</span>' +
            '</div>' +
            (i.issuer || i.period ? '<div class="apya-jny-meta">' + esc([i.issuer, i.period].filter(Boolean).join(' · ')) + '</div>' : '') +
            '<p class="apya-jny-body">' + esc(body(i)) + '</p>' + feedback +
            '<div class="apya-jny-actions">' + actions(i) + '</div>' +
            '</div></li>';
    }

    function paint(d) {
        var parts = [];
        if (d.activeCount) { parts.push(l('Grants:Journey:Sub:Active', d.activeCount)); }
        if (d.projectCount) { parts.push(l('Grants:Journey:Sub:Projects', d.projectCount)); }
        if (d.missedCount) { parts.push(l('Grants:Journey:Sub:Missed', d.missedCount)); }
        // Havuzdaki fikir süreç sayılmaz ama "hibe ilişkiniz yok" da denmez.
        var ideaCount = (d.items || []).filter(function (i) { return i.kind === 9; }).length;
        if (ideaCount) { parts.push(l('Grants:Journey:Sub:Ideas', ideaCount)); }
        var sub = parts.length ? parts.join(', ') : l('Grants:Journey:Sub:None');
        $('#JourneySub').removeClass('apya-skel-num').text(d.firmName ? d.firmName + ' · ' + sub : sub);

        $('#JourneyWon').toggleClass('d-none', !(d.wonAmount > 0));
        $('#JourneyWonValue').text(shortMoney(d.wonAmount));

        var items = d.items || [];
        $('#JourneyItems').removeClass('apya-skel-cards').html(items.map(item).join(''));
        $('#JourneyEmpty').toggleClass('d-none', items.length > 0);
    }

    function load() { return service.get().then(paint); }

    $('#JourneyItems').on('click', '[data-withdraw]', function () {
        var id = $(this).data('withdraw');
        var $btn = $(this);
        abp.message.confirm(l('Grants:Interest:Withdraw:Confirm'), l('Grants:Interest:Withdraw:Title')).then(function (ok) {
            if (!ok) { return; }
            $btn.prop('disabled', true);
            interestService.withdraw(id).then(function () {
                abp.notify.success(l('Grants:Journey:Withdrawn'));
                return load();
            }).always(function () { $btn.prop('disabled', false); });
        });
    });

    $('#JourneyItems').on('click', '[data-withdraw-idea]', function () {
        var id = $(this).data('withdraw-idea');
        var $btn = $(this);
        abp.message.confirm(l('Grants:Idea:Withdraw:Confirm'), l('Grants:Idea:Withdraw:Title')).then(function (ok) {
            if (!ok) { return; }
            $btn.prop('disabled', true);
            interestService.withdraw(id).then(function () {
                abp.notify.success(l('Grants:Journey:IdeaWithdrawn'));
                return load();
            }).always(function () { $btn.prop('disabled', false); });
        });
    });

    /// datetime-local değeri yerel saattir ("2026-09-16T10:00"); en erken şu an, en geç 60 gün sonrası.
    function localValue(d) {
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    $('#JourneyItems').on('click', '[data-meeting]', function () {
        var now = new Date();
        var max = new Date(now.getTime() + 60 * 24 * 3600 * 1000);
        $('#MeetingForm').data('interest', $(this).data('meeting'));
        $('#MeetingTarget').text($(this).data('grant'));
        $('[data-meeting-slot]').val('').attr({ min: localValue(now), max: localValue(max) });
        $('#MeetingError').addClass('d-none');
        meetingModal.show();
    });

    $('#MeetingForm').on('submit', function (e) {
        e.preventDefault();
        var values = $('[data-meeting-slot]').map(function () { return this.value; }).get();
        var now = new Date();
        var valid = values.every(function (v) { return v && new Date(v) > now; })
            && new Set(values).size === values.length;
        $('#MeetingError').toggleClass('d-none', valid);
        if (!valid) { return; }

        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        // datetime-local saniyesiz gelir ("…T10:00"); tam ISO biçimiyle gönderilir.
        var slots = values.map(function (v) { return v.length === 16 ? v + ':00' : v; });
        interestService.proposeMeeting({ interestId: $(this).data('interest'), slots: slots }).then(function () {
            meetingModal.hide();
            abp.notify.success(l('Grants:Meeting:Propose:Sent'));
            return load();
        }).always(function () { $submit.prop('disabled', false); });
    });

    load();
});
