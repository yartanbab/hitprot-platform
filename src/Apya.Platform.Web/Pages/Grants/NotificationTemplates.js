$(function () {
    var service = apya.platform.grants.grantNotificationTemplate;
    var l = abp.localization.getResource('Platform');

    // Enum sırası sunucudakiyle birebir (GrantNotificationTrigger).
    // 🔴 InterestAnswered (7) ve InterestReceived (8) eklenirken bu dizi güncellenmemişti; iki şablonun adı
    // ekranda "Grants:Notify:Trigger:undefined:Name" olarak çıkıyordu. CallClosed (9) 18b, MeetingProposed (10) ve
    // MeetingAnswered (11) 18e ile, IdeaLinked (12) 20b ile, IdeaInvited (13) 19b ile, ApplicationSubmitted (14) 2d ile geldi.
    var triggerKeys = ['RecommendationSent', 'DocumentDeadlineNear', 'DocumentRevisionRequested',
                       'ApplicationStageChanged', 'DecisionIssued', 'ReportDeadlineNear', 'CallPublished',
                       'InterestAnswered', 'InterestReceived', 'CallClosed', 'MeetingProposed', 'MeetingAnswered',
                       'IdeaLinked', 'IdeaInvited', 'ApplicationSubmitted',
                       'ConvertedToProject', 'ConversionPending', 'SubmissionDeadlineNear', 'IdeaShared',
                       'AppealResolved', 'MessageReceived', 'HandedOver', 'DocumentUploaded', 'DocumentApproved'];

    // Enum sırası sunucudakiyle birebir (GrantNotificationAudience).
    var audienceKeys = ['Genel', 'FirmaKullanicisi', 'FirmaYoneticisi', 'Danisman', 'HostYoneticisi'];
    function audienceName(a) { return l('Grants:Notify:Audience:' + audienceKeys[a]); }
    // Yükseltmede kitle kayda göre okunur: Genel = işi bekleyen taraf, Danışman = atanan danışman.
    function escalationName(a) { return l('Grants:Notify:Escalation:Audience:' + audienceKeys[a]); }
    function targetName(t) { return t.isEscalation ? escalationName(t.audience) : audienceName(t.audience); }

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

        // Rol şablonu ve yükseltme Genel şablonun altında, girintili ve etiketiyle durur.
        var isRole = t.audience !== 0 || t.isEscalation;
        var chip = t.isEscalation
            ? '<span class="apya-chip apya-chip-warning me-1">' + esc(l('Grants:Notify:Escalation:Row', t.afterDays)) + '</span>'
            : isRole ? '<span class="apya-chip apya-chip-brand me-1">' + esc(audienceName(t.audience)) + '</span>' : '';
        var name = '<strong>' + chip + esc(tk(t.trigger, 'Name')) + '</strong>';

        return '<button type="button" class="apya-nt-row' +
            (isRole ? ' is-role' : '') +
            (t.id === selectedId ? ' is-selected' : '') +
            '" data-id="' + t.id + '">' +
            '<span class="apya-nt-name">' + name +
            '<span>' + esc(t.subject) + '</span></span>' +
            '<span class="apya-nt-meta">' + esc(tk(t.trigger, 'When')) + '</span>' +
            '<span class="apya-nt-meta">' + esc(isRole ? targetName(t) : tk(t.trigger, 'Recipient')) + '</span>' +
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

        // Hedef kitle: Genel şablon role çoğaltılır ve yükseltme alır; rol şablonu ve yükseltme silinir.
        var isGeneral = t.audience === 0 && !t.isEscalation;
        $('#NtAudience').text(targetName(t));
        $('#NtAudienceHint').text(l(t.isEscalation ? 'Grants:Notify:Escalation:Hint'
            : isGeneral ? 'Grants:Notify:AudienceHint:Genel' : 'Grants:Notify:AudienceHint:Role'));
        $('#NtDeleteBtn').toggleClass('d-none', isGeneral)
            .find('span.js-label').text(l(t.isEscalation ? 'Grants:Notify:DeleteEscalation' : 'Grants:Notify:DeleteRole'));

        $('#NtAfterDaysField').toggleClass('d-none', !t.isEscalation);
        $('#NtAfterDays').val(t.afterDays || '');

        var options = t.duplicableAudiences || [];
        $('#NtDuplicate').toggleClass('d-none', !isGeneral);
        $('#NtDuplicateAudience').html(options.map(function (a) {
            return '<option value="' + a + '">' + esc(audienceName(a)) + '</option>';
        }).join('')).prop('disabled', options.length === 0);
        $('#NtDuplicateBtn').prop('disabled', options.length === 0);
        $('#NtDuplicateHint').text(l(options.length ? 'Grants:Notify:DuplicateHint' : 'Grants:Notify:DuplicateNone'));

        // Yükseltme yalnız beklenen işi olan bildirimde: seçenek listesi boş geliyorsa ya bu bildirimin
        // işi yok (bölüm gizli) ya da her kitlenin yükseltmesi zaten var.
        var escalations = t.escalationAudiences || [];
        var hasAny = escalations.length > 0 || (model.templates || []).some(function (x) {
            return x.trigger === t.trigger && x.isEscalation;
        });
        $('#NtEscalate').toggleClass('d-none', !isGeneral || !hasAny);
        $('#NtEscalateAudience').html(escalations.map(function (a) {
            return '<option value="' + a + '">' + esc(escalationName(a)) + '</option>';
        }).join('')).prop('disabled', escalations.length === 0);
        $('#NtEscalateDays, #NtEscalateBtn').prop('disabled', escalations.length === 0);
        $('#NtEscalateHint').text(l(escalations.length ? 'Grants:Notify:AddEscalationHint' : 'Grants:Notify:EscalationNone'));
    }

    // Çoğaltma/silme sonrası liste yeniden kurulur; seçimi yeni (ya da Genel) şablona taşır.
    function apply(dto, selectWhere, message) {
        model = dto;
        var next = (dto.templates || []).filter(selectWhere)[0];
        selectedId = next ? next.id : null;
        paintList();
        paintEditor();
        abp.notify.success(l(message));
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
            isEnabled: t.isMandatory ? true : $('#NtEnabled').is(':checked'),
            afterDays: t.isEscalation ? parseInt($('#NtAfterDays').val(), 10) || null : null
        }).then(function (dto) {
            model = dto;
            paintList();
            paintEditor();
            abp.notify.success(l('Grants:Notify:Saved'));
        });
    });

    $('#NtDuplicateBtn').on('click', function () {
        var t = selected();
        var audience = parseInt($('#NtDuplicateAudience').val(), 10);
        if (!t || isNaN(audience)) { return; }

        service.duplicate({ id: t.id, audience: audience }).then(function (dto) {
            apply(dto, function (x) { return x.trigger === t.trigger && x.audience === audience; },
                'Grants:Notify:Duplicated');
        });
    });

    $('#NtDeleteBtn').on('click', function () {
        var t = selected();
        if (!t) { return; }

        abp.message.confirm(l(t.isEscalation ? 'Grants:Notify:DeleteEscalationConfirm' : 'Grants:Notify:DeleteRoleConfirm')).then(function (ok) {
            if (!ok) { return; }
            service.delete(t.id).then(function (dto) {
                apply(dto, function (x) { return x.trigger === t.trigger && x.audience === 0 && !x.isEscalation; },
                    t.isEscalation ? 'Grants:Notify:EscalationDeleted' : 'Grants:Notify:Deleted');
            });
        });
    });

    $('#NtEscalateBtn').on('click', function () {
        var t = selected();
        var audience = parseInt($('#NtEscalateAudience').val(), 10);
        var days = parseInt($('#NtEscalateDays').val(), 10);
        if (!t || isNaN(audience) || isNaN(days)) { return; }

        service.addEscalation({ id: t.id, audience: audience, afterDays: days }).then(function (dto) {
            apply(dto, function (x) { return x.trigger === t.trigger && x.audience === audience && x.isEscalation; },
                'Grants:Notify:EscalationAdded');
        });
    });

    // ---------- Açılış ----------
    // Yalnız açılışta ve Tekrar dene ile çağrılır; kayıt modeli yanıttan günceller. Yükleme hatası
    // ABP penceresi değil satır içi kart (Faz 4 kararı 2); editör işaretlemede gizli, kaydet
    // seçili şablon olmadan çalışmaz.
    function load() {
        return Promise.resolve(service.get({ abpHandleError: false })).then(function (dto) {
            model = dto;
            var first = (dto.templates || [])[0];
            selectedId = first ? first.id : null;
            paintList();
            paintEditor();
        }, function (err) {
            $('#NtRows').removeClass('apya-skel-rows')
                .html(apya.loadState.errorHtml(l('Grants:Notify:LoadFailed'), 'js-nt-retry', err));
            $('#NtCount').text('');
        });
    }

    $('#NtRows').on('click', '.js-nt-retry', function () {
        $(this).prop('disabled', true);
        load();
    });

    load();
});
