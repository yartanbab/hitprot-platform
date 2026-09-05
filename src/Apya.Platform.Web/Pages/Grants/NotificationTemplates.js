$(function () {
    var service = apya.platform.grants.grantNotificationTemplate;
    var l = abp.localization.getResource('Platform');

    // Enum sırası sunucudakiyle birebir (GrantNotificationTrigger).
    var triggerKeys = ['RecommendationSent', 'DocumentDeadlineNear', 'DocumentRevisionRequested',
                       'ApplicationStageChanged', 'DecisionIssued', 'ReportDeadlineNear', 'CallPublished'];

    var model = null;
    var selectedId = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function tk(trigger, part) { return l('Grants:Notify:Trigger:' + triggerKeys[trigger] + ':' + part); }

    // ---------- Liste ----------
    function row(t) {
        var channels = '';
        if (t.inApp) {
            channels += '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Notify:Channel:InApp')) + '</span>';
        }
        if (t.email) {
            channels += '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Notify:Channel:Email')) + '</span>';
        }

        var state = t.isMandatory
            ? '<span class="apya-chip apya-chip-warning">' + esc(l('Grants:Notify:Mandatory')) + '</span>'
            : '<span class="apya-chip ' + (t.isEnabled ? 'apya-chip-positive' : 'apya-chip-neutral') + '">' +
              esc(l(t.isEnabled ? 'Grants:Notify:State:On' : 'Grants:Notify:State:Off')) + '</span>';

        return '<button type="button" class="apya-nt-row' +
            (t.id === selectedId ? ' is-selected' : '') +
            '" data-id="' + t.id + '">' +
            '<span class="apya-nt-name">' +
            '<strong>' + esc(tk(t.trigger, 'Name')) + '</strong>' +
            '<span>' + esc(t.subject) + '</span></span>' +
            '<span class="apya-nt-meta">' + esc(tk(t.trigger, 'When')) + '</span>' +
            '<span class="apya-nt-meta">' + esc(tk(t.trigger, 'Recipient')) + '</span>' +
            '<span class="apya-nt-channels">' + channels + '</span>' +
            '<span>' + state + '</span></button>';
    }

    function paintList() {
        var items = model.templates || [];
        $('#NtRows').removeClass('apya-skel-rows').html(items.map(row).join(''));
        $('#NtEmpty').toggleClass('d-none', items.length > 0);
        $('#NtCount').text(l('Grants:Notify:ActiveCount', model.enabledCount));
    }

    // ---------- Düzenleyici ----------
    function selected() {
        return (model.templates || []).filter(function (t) { return t.id === selectedId; })[0];
    }

    function paintEditor() {
        var t = selected();
        $('#NtSelectHint').toggleClass('d-none', !!t);
        $('#NtEditor').toggleClass('d-none', !t);
        if (!t) {
            $('#NtEditorTitle').text(l('Grants:Notify:Preview'));
            return;
        }

        $('#NtEditorTitle').text(tk(t.trigger, 'Name'));
        $('#NtSubject').val(t.subject);
        $('#NtBody').val(t.body);
        $('#NtInApp').prop('checked', t.inApp);
        $('#NtEmail').prop('checked', t.email);
        $('#NtEnabled').prop('checked', t.isEnabled);

        // Zorunlu tetikleyicide uygulama içi bildirim ve şablon anahtarı kilitli:
        // sunucu da reddediyor, kullanıcıyı boşuna hata ekranına düşürmeyelim.
        $('#NtInApp, #NtEnabled').prop('disabled', t.isMandatory);
        $('#NtInApp, #NtEnabled').closest('.apya-choice').toggleClass('is-locked', t.isMandatory);
        $('#NtMandatoryChip').toggleClass('d-none', !t.isMandatory);

        $('#NtVariables').html((t.variables || []).map(function (v) {
            return '<button type="button" class="apya-nt-var" data-var="' + esc(v) + '">' + esc(v) + '</button>';
        }).join(''));

        $('#NtPreviewSubject').text(t.previewSubject);
        $('#NtPreviewBody').text(t.previewBody);
    }

    // ---------- Olaylar ----------
    $('#NtRows').on('click', '.apya-nt-row', function () {
        selectedId = $(this).data('id');
        paintList();
        paintEditor();
    });

    $('#NtVariables').on('click', '.apya-nt-var', function () {
        var $body = $('#NtBody');
        var token = $(this).data('var');
        var text = $body.val();
        $body.val(text + (text && !/\s$/.test(text) ? ' ' : '') + token).focus();
    });

    $('#NtSaveBtn').on('click', function () {
        var t = selected();
        if (!t) { return; }

        service.save({
            id: t.id,
            subject: $('#NtSubject').val(),
            body: $('#NtBody').val(),
            // Zorunlu şablonda anahtarlar kilitli olduğu için kutunun kendi değeri
            // yerine sunucunun bildiği değeri geri gönderiyoruz.
            inApp: t.isMandatory ? true : $('#NtInApp').is(':checked'),
            email: $('#NtEmail').is(':checked'),
            isEnabled: t.isMandatory ? true : $('#NtEnabled').is(':checked')
        }).then(function (dto) {
            model = dto;
            paintList();
            paintEditor();
            abp.notify.success(l('Grants:Notify:Saved'));
        });
    });

    // ---------- Açılış ----------
    service.get().then(function (dto) {
        model = dto;
        var first = (dto.templates || [])[0];
        selectedId = first ? first.id : null;
        paintList();
        paintEditor();
    });
});
