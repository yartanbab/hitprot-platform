$(function () {
    var service = apya.platform.grants.grantAppeal;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Karar ve tutum adları + tonları sunucudan gelir (GrantStatusCatalog → _StatusMap).
    var outcomeKeys = apyaGrantStatus.decision.keys;
    var outcomeTone = apyaGrantStatus.decision.tones;
    var outcomeIcon = { Reddedildi: 'fa-circle-xmark', Onaylandi: 'fa-circle-check', KismiOnay: 'fa-circle-half-stroke' };
    var stanceKeys = apyaGrantStatus.stance.keys;
    var stanceTone = apyaGrantStatus.stance.tones;
    var stanceClass = ['is-none', 'is-appeal', 'is-accept'];

    var model = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    // ---------- Gerekçe maddesi ----------
    function item(i) {
        var opinion = i.stance === 0 && !i.opinionSummary
            ? '<div class="apya-ap-opinion is-none">' + esc(l('Grants:Appeal:NoOpinion')) + '</div>'
            : '<div class="apya-ap-opinion ' + stanceClass[i.stance] + '">' +
              (i.opinionByName
                  ? '<span class="apya-ap-avatar">' + esc(initials(i.opinionByName)) + '</span>' : '') +
              '<span><span class="apya-ap-opinion-summary">' + esc(i.opinionSummary || '') + '</span>' +
              (i.opinionDetail ? ' ' + esc(i.opinionDetail) : '') + '</span></div>';

        return '<div class="apya-ap-item" data-id="' + i.id + '">' +
            '<span class="apya-ap-no">' + i.order + '</span>' +
            '<span><span class="apya-ap-title">' + esc(i.title) + '</span>' +
            (i.institutionText
                ? '<div class="apya-ap-quote">“' + esc(i.institutionText) + '”</div>' : '') +
            opinion + '</span>' +
            '<span class="apya-ap-stance">' +
            '<span class="apya-chip apya-chip-' + stanceTone[i.stance] + '">' +
            esc(l('Grants:Appeal:Stance:' + stanceKeys[i.stance])) + '</span>' +
            (model.canEditOpinion && !model.appealSubmittedAt
                ? '<button type="button" class="btn btn-sm btn-outline-secondary apya-ap-edit">' +
                  '<i class="fa fa-pen"></i></button>' : '') +
            '</span></div>';
    }

    function paintItems() {
        var items = model.items || [];
        $('#Items').removeClass('apya-skel-rows').html(items.map(item).join(''));
        $('#ItemsEmpty').toggleClass('d-none', items.length > 0 || !model.decisionId);
    }

    // ---------- Görüş yazma (danışman) ----------
    // LIF-12: Görüş iki ardışık istem kutusuyla giriliyordu (önce karar, sonra gerekçe).
    // İkincisinde vazgeçilince ilk seçim de kayboluyor, gerekçe tek satırlık kutuya
    // yazılıyordu. Artık tek pencere: karar ve çok satırlı gerekçe birlikte kaydedilir;
    // vazgeçmek hiçbir şeyi kaydetmez, kaydetmek ikisini birden yazar.
    var opinionModal = new bootstrap.Modal(document.getElementById('OpinionModal'));
    var opinionItemId = null;

    $('#Items').on('click', '.apya-ap-edit', function () {
        opinionItemId = $(this).closest('.apya-ap-item').data('id');
        var current = (model.items || []).filter(function (i) { return i.id === opinionItemId; })[0] || {};

        $('#OpinionItemTitle').text(current.title || '');
        // Görüş yazılmamış maddede (0) varsayılan "itiraz": pencere çoğunlukla bunun için açılır.
        $('#OpinionStance').val(current.stance === 2 ? '2' : '1');
        $('#OpinionDetail').val(current.opinionDetail || '');
        opinionModal.show();
    });

    $('#OpinionSaveBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        var stance = Number($('#OpinionStance').val());

        service.saveOpinion({
            itemId: opinionItemId,
            stance: stance,
            summary: stance === 1
                ? l('Grants:Appeal:Summary:Appeal')
                : l('Grants:Appeal:Summary:Accept'),
            detail: String($('#OpinionDetail').val() || '').trim() || null
        }).then(function (dto) {
            model = dto; paint();
            opinionModal.hide();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // LIF-12: Madde tek satırlık istem kutusuyla ekleniyordu ve yalnız başlık gidiyordu;
    // kurumun ifadesi (sunucu kabul ettiği hâlde) hiç girilemiyordu.
    var itemModal = new bootstrap.Modal(document.getElementById('ItemModal'));

    $('#AddItemBtn').on('click', function () {
        $('#ItemTitle').val('').removeClass('is-invalid');
        $('#ItemInstitutionText').val('');
        itemModal.show();
    });

    $('#ItemSaveBtn').on('click', function () {
        var title = String($('#ItemTitle').val() || '').trim();
        if (!title) {
            $('#ItemTitle').addClass('is-invalid').trigger('focus');
            return;
        }

        var $btn = $(this).prop('disabled', true);
        service.addItem({
            applicationId: appId,
            title: title,
            institutionText: String($('#ItemInstitutionText').val() || '').trim() || null
        }).then(function (dto) {
            model = dto; paint();
            itemModal.hide();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- İtirazı gönder ----------
    $('#SubmitAppealBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.submitAppeal(appId).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:Appeal:Submitted'));
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- İtiraz sonucu (danışman, kurumun yanıtını işler) ----------
    $('#ResolveBox').on('click', '[data-accepted]', function () {
        var accepted = $(this).data('accepted') === true;
        abp.message.confirm(l('Grants:Appeal:Resolve:Confirm')).then(function (ok) {
            if (!ok) { return; }
            service.resolveAppeal(appId, accepted).then(function (dto) { model = dto; paint(); });
        });
    });

    // ---------- Sağ panel ----------
    function paintSide() {
        var items = model.items || [];
        $('#AppealedCount').text(model.appealedCount + '/' + items.length);
        $('#AcceptedNote').text(model.acceptedCount > 0
            ? l('Grants:Appeal:AcceptedCount', model.acceptedCount) : '');
        // İtiraza konu madde yoksa dosya boş gider; düğme de kapalı kalır.
        $('#EmptyFileNote').toggleClass('d-none',
            model.appealedCount > 0 || !model.isAppealWindowOpen);

        var s = model.stats || {};
        $('#Stats').html(s.hasEnoughData
            ? '<div class="apya-ap-stat"><span>' + esc(l('Grants:Appeal:Stat:AppealRate')) + '</span>' +
              '<span class="apya-ap-stat-value">%' + s.appealRatePercent + '</span></div>' +
              (s.acceptanceRatePercent != null
                  ? '<div class="apya-ap-stat"><span>' + esc(l('Grants:Appeal:Stat:AcceptRate')) + '</span>' +
                    '<span class="apya-ap-stat-value">%' + s.acceptanceRatePercent + '</span></div>'
                  : '<div class="apya-ap-hint">' + esc(l('Grants:Appeal:Stat:NoResolved')) + '</div>') +
              '<div class="apya-ap-hint">' + esc(l('Grants:Appeal:Stat:Sample', s.sampleSize)) + '</div>'
            // 🔴 Örneklem küçükken oran GÖSTERİLMEZ: birkaç karardan çıkan yüzde
            // güven veriyormuş gibi durup yanlış yönlendirir.
            : '<div class="apya-ap-hint">' + esc(l('Grants:Appeal:Stat:NotEnough', s.sampleSize || 0)) + '</div>');

        $('#RetryBox').html(model.nextCallId
            ? '<div class="fw-semibold">' + esc(l('Grants:Appeal:NextCall', model.nextCallPeriod || '')) + '</div>' +
              '<div class="apya-ap-hint">' +
              esc(l('Grants:Appeal:NextCallDeadline', date(model.nextCallDeadline))) + '</div>' +
              '<a class="btn btn-sm btn-outline-primary mt-2" href="/Grants/Detail?id=' + model.nextCallId + '">' +
              esc(l('Grants:Appeal:GoToNextCall')) + '</a>'
            : '<div class="apya-ap-hint">' + esc(l('Grants:Appeal:NoNextCall')) + '</div>' +
              '<a class="btn btn-sm btn-outline-secondary mt-2" href="/Grants/Catalog">' +
              esc(l('Grants:Appeal:BrowseCatalog')) + '</a>');
    }

    // ---------- Çizim ----------
    function paint() {
        var hasDecision = model.decisionId != null;
        $('#DecisionBar').toggleClass('d-none', !hasDecision);
        $('#NoDecision').toggleClass('d-none', hasDecision);
        $('#NoDecisionHint').text(model.canEditOpinion
            ? l('Grants:Appeal:NoDecisionHostHint')
            : l('Grants:Appeal:NoDecisionTenantHint'));
        $('#AddItemBtn').toggleClass('d-none', !hasDecision || !model.canEditOpinion);
        $('#EnterDecisionLink').toggleClass('d-none', hasDecision || !model.canEditOpinion);

        if (hasDecision) {
            var outcome = outcomeKeys[model.outcome];
            $('#DecisionBadge').attr('class', 'apya-ap-badge is-' + outcomeTone[model.outcome]);
            $('#DecisionIcon').attr('class', 'fa ' + outcomeIcon[outcome]);
            $('#DecisionTitle').text(l('Grants:Appeal:Outcome:' + outcome, date(model.decidedOn)));
            $('#DecisionMeta').text([model.grantName, model.period,
                model.referenceNo ? l('Grants:Appeal:Reference', model.referenceNo) : null]
                .filter(Boolean).join(' · '));

            $('#WindowBox').toggleClass('d-none', outcome !== 'Reddedildi');
            $('#Countdown').text(model.appealAccepted != null
                ? l('Grants:Appeal:Resolved:' + (model.appealAccepted ? 'Accepted' : 'Rejected'))
                : model.appealSubmittedAt
                    ? l('Grants:Appeal:SubmittedOn', date(model.appealSubmittedAt))
                    : model.appealDaysLeft != null
                        ? l('Grants:Appeal:DaysLeft', model.appealDaysLeft)
                        : l('Grants:Appeal:WindowClosed'));
            $('#ResolveBox').toggleClass('d-none',
                !(model.canEditOpinion && model.appealSubmittedAt && model.appealAccepted == null));

            // İtirazı firma gönderir; danışman görüş yazar.
            $('#SubmitAppealBtn').toggleClass('d-none',
                !model.isAppealWindowOpen || model.appealedCount === 0);
        }

        paintItems();
        paintSide();
    }

    // Yalnız açılışta ve Tekrar dene ile çağrılır; eylemler modeli yanıttan günceller.
    // Yükleme hatası ABP penceresi değil satır içi kart (Faz 4 kararı 2); eylemler
    // (#SubmitAppealBtn, #ResolveBox, #AddItemBtn) işaretlemede gizli, paint açar.
    function load() {
        return Promise.resolve(service.get(appId, { abpHandleError: false })).then(function (dto) {
            model = dto;
            paint();
        }, function (err) {
            $('#Items').removeClass('apya-skel-rows')
                .html(apya.loadState.errorHtml(l('Grants:Appeal:LoadFailed'), 'js-appeal-retry', err));
            $('#ItemsEmpty').addClass('d-none');
        });
    }

    $('#Items').on('click', '.js-appeal-retry', function () {
        $(this).prop('disabled', true);
        load();
    });

    load();
});
