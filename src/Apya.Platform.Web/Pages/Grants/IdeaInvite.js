/* 19b · Fikir daveti gönder (Fikir Havuzu). Alıcı sayısı seçim değiştikçe sunucudan sayılır; kural ve bildirim
   sunucuda (GrantIdeaInvitationManager). Son davetin sonucu havuz listesinin üstünde. */
$(function () {
    var modalEl = document.getElementById('InviteModal');
    if (!modalEl) { return; }

    var service = apya.platform.grants.grantIdeaInvitation;
    var l = abp.localization.getResource('Platform');
    var modal = new bootstrap.Modal(modalEl);
    // GrantIdeaInvitationAudience: 0 tek firma · 1 süzülmüş grup · 2 tümü.
    var AUDIENCE = { Single: 0, Filtered: 1, All: 2 };
    var DEFAULT_REMIND_DAYS = 10;

    var optionsLoaded = false;
    var countTimer = null;
    var countSeq = 0;
    var messageTouched = false;

    function audience() { return Number($('input[name=InviteAudience]:checked').val()); }
    function forCall() { return $('input[name=InviteContext]:checked').val() === 'call'; }

    function audienceInput() {
        var sizes = 0;
        $('.apya-invite-size:checked').each(function () { sizes |= Number(this.value); });
        return {
            audience: audience(),
            tenantId: $('#InviteFirm').val() || null,
            sizes: sizes || null,
            onlyWithoutPoolIdea: $('#InviteNoIdea').is(':checked')
        };
    }

    function defaultMessage() {
        var callName = $('#InviteCall').val() ? $('#InviteCall option:selected').text() : null;
        return forCall() && callName ? l('Grants:Invite:DefaultMessageCall', callName) : l('Grants:Invite:DefaultMessage');
    }

    // Danışman mesaja dokunmadıysa bağlam değişince varsayılan metin de değişir; dokunduysa yazdığı korunur.
    function syncMessage() {
        if (!messageTouched) { $('#InviteMessage').val(defaultMessage()); }
    }

    function paintPanes() {
        $('[data-audience-pane]').each(function () {
            $(this).toggleClass('d-none', Number($(this).data('audience-pane')) !== audience());
        });
        $('#InviteCallPane').toggleClass('d-none', !forCall());
        $('#InviteResponses').text(l(forCall() ? 'Grants:Invite:Responses:Call' : 'Grants:Invite:Responses:Pool'));
        $('#InviteRemindDays').prop('disabled', !$('#InviteRemind').is(':checked'));
    }

    function paintCount(n) {
        $('#InviteSend').text(n > 0 ? l('Grants:Invite:Send', n) : l('Grants:Invite:SendNone')).prop('disabled', n === 0);
    }

    // Seçim hızlı değişince eski cevap yenisini ezmesin: yalnız son isteğin sonucu boyanır.
    function refreshCount() {
        clearTimeout(countTimer);
        countTimer = setTimeout(function () {
            var input = audienceInput();
            if (input.audience === AUDIENCE.Single && !input.tenantId) { paintCount(0); return; }
            var seq = ++countSeq;
            service.countRecipients(input).then(function (n) { if (seq === countSeq) { paintCount(n); } });
        }, 250);
    }

    function hidePreview() { $('#InvitePreview').addClass('d-none'); }

    function loadOptions() {
        if (optionsLoaded) { return $.Deferred().resolve().promise(); }
        return service.getOptions().then(function (o) {
            optionsLoaded = true;
            (o.firms || []).forEach(function (f) { $('#InviteFirm').append($('<option>').val(f.id).text(f.name)); });
            if (!(o.calls || []).length) {
                $('#InviteCall').empty().append($('<option>').val('').text(l('Grants:Invite:NoOpenCalls')));
                $('input[name=InviteContext][value=call]').prop('disabled', true);
            }
            (o.calls || []).forEach(function (c) { $('#InviteCall').append($('<option>').val(c.id).text(c.name)); });
        });
    }

    $('#InviteOpenBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        loadOptions().then(function () {
            document.getElementById('InviteForm').reset();
            // Tasarımın varsayılanı: süzülmüş grup, çağrıdan bağımsız, 10 gün sonra hatırlat.
            $('input[name=InviteAudience][value=' + AUDIENCE.Filtered + ']').prop('checked', true);
            $('input[name=InviteContext][value=pool]').prop('checked', true);
            $('#InviteNoIdea').prop('checked', true);
            $('#InviteRemind').prop('checked', true);
            $('#InviteRemindDays').val(DEFAULT_REMIND_DAYS);
            $('#InviteFirm, #InviteCall, #InviteMessage').removeClass('is-invalid');
            messageTouched = false;
            syncMessage();
            hidePreview();
            paintPanes();
            refreshCount();
            modal.show();
        }).always(function () { $btn.prop('disabled', false); });
    });

    $('input[name=InviteAudience], #InviteNoIdea, .apya-invite-size').on('change', function () {
        paintPanes();
        refreshCount();
    });
    $('#InviteFirm').on('change', function () { $(this).removeClass('is-invalid'); refreshCount(); });

    $('input[name=InviteContext], #InviteCall').on('change', function () {
        $('#InviteCall').removeClass('is-invalid');
        paintPanes();
        syncMessage();
        hidePreview();
    });

    $('#InviteRemind').on('change', paintPanes);
    $('#InviteMessage').on('input', function () {
        messageTouched = true;
        $(this).removeClass('is-invalid');
        hidePreview();
    });

    function callId() { return forCall() ? ($('#InviteCall').val() || null) : null; }

    $('#InvitePreviewBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.preview({ grantCallId: callId(), message: $('#InviteMessage').val() }).then(function (p) {
            $('#InvitePreviewSubject').text(p.subject).toggleClass('d-none', !p.templateEnabled);
            $('#InvitePreviewBody').text(p.body).toggleClass('d-none', !p.templateEnabled);
            $('#InviteTemplateOff').toggleClass('d-none', p.templateEnabled);
            $('#InvitePreview').removeClass('d-none');
        }).always(function () { $btn.prop('disabled', false); });
    });

    $('#InviteForm').on('submit', function (e) {
        e.preventDefault();
        var input = audienceInput();
        // 🔴 $.trim YOK (jQuery 4): String.prototype.trim.
        var message = ($('#InviteMessage').val() || '').trim();
        var remind = $('#InviteRemind').is(':checked');
        var days = Number($('#InviteRemindDays').val());

        $('#InviteFirm').toggleClass('is-invalid', input.audience === AUDIENCE.Single && !input.tenantId);
        $('#InviteCall').toggleClass('is-invalid', forCall() && !callId());
        $('#InviteMessage').toggleClass('is-invalid', !message);
        var $invalid = $('#InviteForm .is-invalid');
        if ($invalid.length) { $invalid.first().trigger('focus'); return; }

        var $submit = $('#InviteSend').prop('disabled', true);
        service.send($.extend(input, {
            grantCallId: callId(),
            message: message,
            sendEmail: $('#InviteEmail').is(':checked'),
            remindAfterDays: remind && days > 0 ? days : null
        })).then(function (r) {
            modal.hide();
            abp.notify.success(l('Grants:Invite:Sent', r.recipientCount));
            loadLatest();
        }).always(function () { $submit.prop('disabled', false); });
    });

    // ---------- Son davet ----------
    function shortDate(v) { return new Date(v).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }); }

    function paintLatest(s) {
        $('#InviteLatest').toggleClass('d-none', !s);
        if (!s) { return; }
        var parts = [s.grantName
            ? l('Grants:Invite:LatestCall', shortDate(s.sentAt), s.grantName, s.recipientCount, s.respondedCount)
            : l('Grants:Invite:Latest', shortDate(s.sentAt), s.recipientCount, s.respondedCount)];
        if (s.remindedCount > 0) {
            parts.push(l('Grants:Invite:LatestReminded', s.remindedCount));
        } else if (s.remindAt) {
            parts.push(l('Grants:Invite:LatestRemindAt', shortDate(s.remindAt)));
        }
        $('#InviteLatestText').text(parts.join(' · '));
    }

    function loadLatest() { return service.getLatest().then(paintLatest); }

    loadLatest();
});
