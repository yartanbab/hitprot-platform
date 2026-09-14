$(function () {
    var service = apya.platform.grants.grantInterestHost;
    var l = abp.localization.getResource('Platform');
    var interestId = $('.apya-page').data('interest-id');
    var rejectModal = new bootstrap.Modal(document.getElementById('RejectModal'));
    var meetingOtherModal = new bootstrap.Modal(document.getElementById('MeetingOtherModal'));

    // Enum sıraları sunucudakiyle birebir.
    var statusKeys = ['Yeni', 'Inceleniyor', 'BasvuruAcildi', 'UygunDegil', 'GeriCekildi', 'Kacirildi'];
    var statusTone = ['warning', 'neutral', 'positive', 'negative', 'neutral', 'neutral'];
    var ruleKeys = ['CompanySize', 'CompanyAge', 'Trl', 'StaffCount', 'RdStaffCount', 'Revenue', 'Consortium'];
    var sizeKeys = { 1: 'Mikro', 2: 'Kucuk', 4: 'Orta', 8: 'Buyuk' };

    var model = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v == null ? '—' : Math.round(v).toLocaleString('tr-TR') + ' ₺'; }
    function dateTime(v) {
        return v ? new Date(v).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
    }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toLocaleUpperCase('tr-TR');
    }

    // "2027-01-01T00:00:00" → "2027 · 1. çeyrek". Dizeden okunur: Date'e çevirmek saat dilimiyle kayabilir.
    function quarter(v) {
        if (!v) { return '—'; }
        var y = Number(String(v).slice(0, 4));
        var m = Number(String(v).slice(5, 7));
        return l('Grants:Interest:Form:Quarter', y, Math.floor((m - 1) / 3) + 1);
    }

    /// Talebin ne kadar süredir beklediği. SLA hedefi tanımlı değil; yalnız geçen süre yazılır.
    function ago(v) {
        var minutes = Math.max(0, Math.floor((Date.now() - new Date(v).getTime()) / 60000));
        if (minutes < 60) { return l('Grants:InterestReview:Ago:Minutes', minutes); }
        var hours = Math.floor(minutes / 60);
        if (hours < 48) { return l('Grants:InterestReview:Ago:Hours', hours); }
        return l('Grants:InterestReview:Ago:Days', Math.floor(hours / 24));
    }

    function consortiumText(r) {
        if (r.needsPartner === true) { return l('Grants:Interests:Meta:NeedsPartner'); }
        if (r.needsPartner === false) {
            return r.partnerName ? l('Grants:Interests:Meta:Partner', r.partnerName) : l('Grants:Interests:Meta:HasPartner');
        }
        return l('Grants:InterestReview:Consortium:NotAsked');
    }

    function paintHead(d) {
        var r = d.interest;
        $('#ReviewTitle').removeClass('apya-skel-num').text(r.firmName + ' → ' + r.grantName);
        $('#ReviewStatus').attr('class', 'apya-chip apya-chip-' + statusTone[r.status])
            .text(l('Grants:Interests:Status:' + statusKeys[r.status]));
        var pending = r.status === 0 || r.status === 1;
        $('#ReviewWaiting').text(pending
            ? l('Grants:InterestReview:Waiting', ago(r.creationTime))
            : l('Grants:InterestReview:Arrived', dateTime(r.creationTime)));
    }

    function paintIdea(d) {
        var r = d.interest;
        $('#IdeaMeta').text(r.requestedByName
            ? l('Grants:InterestReview:Idea:MetaBy', dateTime(r.creationTime), r.requestedByName)
            : dateTime(r.creationTime));
        $('#IdeaText').toggleClass('is-empty', !r.note).text(r.note || l('Grants:InterestReview:Idea:Empty'));
        $('#StatBudget').text(money(r.estimatedBudget));
        $('#StatStart').text(quarter(r.targetStartDate));
        $('#StatConsortium').text(consortiumText(r));
        // Not alanı yalnız ilk boyamada ya da kayıttan sonra doldurulur: yazılan metni ezmesin.
        $('#ConsultantNote').val(d.consultantNote || '');
    }

    function paintDecision(d) {
        var r = d.interest;
        var pending = r.status === 0 || r.status === 1;
        $('#ReviewActions').toggleClass('d-none', !pending);
        $('#StartReviewBtn').toggleClass('d-none', r.status !== 0);

        var text = '';
        if (r.status === 2) { text = l('Grants:InterestReview:Decision:Started', r.reviewedByName || '—', date(r.reviewedAt)); }
        if (r.status === 3) { text = l('Grants:InterestReview:Decision:Rejected', r.reviewedByName || '—', date(r.reviewedAt)); }
        if (r.status === 4) { text = l('Grants:Interests:WithdrawnAt', date(r.withdrawnAt)); }
        if (r.status === 5) { text = l('Grants:Interests:MissedAt', date(r.reviewedAt)); }
        var feedback = (r.status === 3 || r.status === 5) && r.hostFeedback
            ? '<span class="apya-irv-feedback">' + esc(r.hostFeedback) + '</span>' : '';
        $('#DecisionText').toggleClass('d-none', !text).html(esc(text) + feedback);

        // Devret yalnız bekleyen talepte: karara bağlanmış işte yapılacak iş kalmadı.
        var $sel = $('#AssignSelect').empty().prop('disabled', !pending);
        $sel.append($('<option>').val('').text(r.assignedUserId ? l('Grants:InterestReview:Assign:Unassign') : l('Grants:InterestReview:Assign:None')));
        (d.consultants || []).forEach(function (c) {
            $sel.append($('<option>').val(c.userId).text(l('Grants:InterestReview:Assign:Option', c.name, c.assignedCount)));
        });
        $sel.val(r.assignedUserId || '');
        $('#AssignBtn').prop('disabled', !pending);
    }

    function paintFirm(d) {
        var r = d.interest;
        $('#FirmInitials').text(initials(r.firmName));
        $('#FirmName').text(r.firmName);
        var meta = [d.size ? l('Grants:InterestReview:Firm:Size', l('Grants:Size:' + sizeKeys[d.size])) : l('Grants:InterestReview:Firm:SizeUnknown')];
        (d.sectors || []).slice(0, 1).forEach(function (s) { meta.push(s); });
        (d.naceCodes || []).slice(0, 2).forEach(function (c) { meta.push(c); });
        (d.regions || []).slice(0, 1).forEach(function (g) { meta.push(g); });
        $('#FirmMeta').text(meta.join(' · '));
        $('#FirmMatch').text('%' + d.matchScore);
        $('#FirmRevenue').text(money(d.annualRevenue));
        $('#FirmRdStaff').text(d.rdStaffCount == null ? '—' : d.rdStaffCount);
        $('#FirmProjects').text(d.activeProjectCount);
        $('#FirmGrants').text(d.approvedGrantCount > 0
            ? l('Grants:InterestReview:Firm:GrantsCount', d.approvedGrantCount)
            : l('Grants:InterestReview:Firm:GrantsNone'));

        var gaps = (d.failedRules || []).map(function (rule) {
            return '<li class="is-failed"><i class="fa fa-circle-xmark"></i>' + esc(l('Grants:InterestReview:Gap:Failed', l('Grants:Rule:' + ruleKeys[rule]))) + '</li>';
        }).concat((d.unknownRules || []).map(function (rule) {
            return '<li class="is-unknown"><i class="fa fa-triangle-exclamation"></i>' + esc(l('Grants:InterestReview:Gap:Unknown', l('Grants:Rule:' + ruleKeys[rule]))) + '</li>';
        }));
        $('#FirmGaps').html(gaps.length
            ? '<ul>' + gaps.join('') + '</ul>'
            : d.passedRuleCount > 0
                ? '<p class="is-ok"><i class="fa fa-circle-check"></i>' + esc(l('Grants:InterestReview:Gap:None')) + '</p>'
                : '<p class="is-neutral"><i class="fa fa-circle-info"></i>' + esc(l('Grants:InterestReview:Gap:NoRules')) + '</p>');
    }

    function paintPartners(d) {
        var show = d.interest.needsPartner === true || d.requiresConsortium;
        $('#PartnerSection').toggleClass('d-none', !show);
        if (!show) { return; }

        var items = d.partnerSuggestions || [];
        $('#PartnerList').html(items.length ? items.map(function (p) {
            var line = l('Grants:InterestReview:Partner:Line', p.matchScore) +
                (p.needsPartner === true ? ' · ' + l('Grants:InterestReview:Partner:AlsoNeeds') : '');
            return '<div class="apya-irv-partner">' +
                '<span class="apya-irv-avatar is-small">' + esc(initials(p.firmName)) + '</span>' +
                '<span class="apya-irv-partner-text"><strong>' + esc(p.firmName) + '</strong><span>' + esc(line) + '</span></span>' +
                '<a class="btn btn-sm btn-outline-secondary" href="/Grants/InterestReview?id=' + p.interestId + '">' +
                esc(l('Grants:InterestReview:Partner:Open')) + '</a></div>';
        }).join('') : '<p class="apya-irv-card-meta mb-0">' + esc(l('Grants:InterestReview:Partner:None')) + '</p>');
    }

    function slotText(v) {
        return new Date(v).toLocaleString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', hour: '2-digit', minute: '2-digit' });
    }

    /// 18e · GrantMeetingStatus: 0 Bekliyor · 1 Onaylandı · 2 Başka saat istendi. Yalnız bekleyen talepte eylem var.
    function paintMeeting(d) {
        var m = d.meeting;
        var pending = d.interest.status === 0 || d.interest.status === 1;
        var open = !!m && m.status === 0 && pending;
        $('#MeetingSlots').toggleClass('d-none', !open).html(open ? m.slots.map(function (s, i) {
            var past = new Date(s) <= new Date();
            return '<label class="apya-irv-meeting-slot' + (past ? ' is-past' : '') + '">' +
                '<input type="radio" name="MeetingSlot" value="' + i + '"' + (past ? ' disabled' : '') + '> ' +
                '<span>' + esc(slotText(s)) + '</span></label>';
        }).join('') : '');
        $('#MeetingActions').toggleClass('d-none', !open);

        $('#MeetingMeta').text(!m
            ? l('Grants:InterestReview:Meeting:None')
            : m.status === 0 ? l('Grants:InterestReview:Meeting:Pending', m.durationMinutes) : '');
        var state = !m ? ''
            : m.status === 1 ? l('Grants:InterestReview:Meeting:Confirmed', slotText(m.confirmedSlot), m.durationMinutes)
            : m.status === 2 ? l('Grants:InterestReview:Meeting:OtherRequested', m.hostNote || '') : '';
        $('#MeetingState').toggleClass('d-none', !state).text(state);
    }

    function paint(d) {
        model = d;
        paintHead(d);
        paintIdea(d);
        paintMeeting(d);
        paintDecision(d);
        paintFirm(d);
        paintPartners(d);
    }

    function load() { return service.getReview(interestId).then(paint); }

    // ---------- Eylemler ----------
    function busy($btn, promise) {
        $btn.prop('disabled', true);
        return promise.always(function () { $btn.prop('disabled', false); });
    }

    $('#SaveNoteBtn').on('click', function () {
        busy($(this), service.saveNote({ interestId: interestId, note: $('#ConsultantNote').val() }).then(function (d) {
            paint(d);
            abp.notify.success(l('Grants:InterestReview:Note:Saved'));
        }));
    });

    $('#AssignBtn').on('click', function () {
        var userId = $('#AssignSelect').val() || null;
        busy($(this), service.assign({ interestId: interestId, userId: userId }).then(function (d) {
            paint(d);
            abp.notify.success(userId
                ? l('Grants:InterestReview:Assign:Done', d.interest.assignedUserName || '')
                : l('Grants:InterestReview:Assign:Cleared'));
        }));
    });

    $('#StartReviewBtn').on('click', function () {
        busy($(this), service.startReview(interestId).then(function () {
            abp.notify.success(l('Grants:Interests:Reviewing'));
            return load();
        }));
    });

    $('#StartApplicationBtn').on('click', function () {
        busy($(this), service.startApplication(interestId).then(function () {
            abp.notify.success(l('Grants:Interests:Started'));
            return load();
        }));
    });

    $('#MeetingConfirmBtn').on('click', function () {
        var slot = $('input[name=MeetingSlot]:checked').val();
        if (slot == null) {
            abp.notify.warn(l('Grants:InterestReview:Meeting:PickSlot'));
            return;
        }
        busy($(this), service.confirmMeeting({ proposalId: model.meeting.id, slotIndex: parseInt(slot, 10) }).then(function (d) {
            paint(d);
            abp.notify.success(l('Grants:InterestReview:Meeting:DoneConfirmed'));
        }));
    });

    $('#MeetingOtherBtn').on('click', function () {
        $('#MeetingOtherNote').val('');
        meetingOtherModal.show();
    });

    $('#MeetingOtherForm').on('submit', function (e) {
        e.preventDefault();
        var $submit = $(this).find('button[type=submit]');
        busy($submit, service.requestOtherMeetingTime({ proposalId: model.meeting.id, note: $('#MeetingOtherNote').val() }).then(function (d) {
            meetingOtherModal.hide();
            paint(d);
            abp.notify.success(l('Grants:InterestReview:Meeting:DoneOther'));
        }));
    });

    $('#RejectBtn').on('click', function () {
        $('#RejectTarget').text(model ? model.interest.firmName + ' · ' + model.interest.grantName : '');
        $('#RejectReason').val('');
        rejectModal.show();
    });

    $('#RejectForm').on('submit', function (e) {
        e.preventDefault();
        var $submit = $(this).find('button[type=submit]');
        busy($submit, service.reject({ interestId: interestId, reason: $('#RejectReason').val() }).then(function () {
            rejectModal.hide();
            abp.notify.success(l('Grants:Interests:Rejected'));
            return load();
        }));
    });

    load();
});
