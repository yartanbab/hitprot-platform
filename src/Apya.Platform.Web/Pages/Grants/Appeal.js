$(function () {
    var service = apya.platform.grants.grantAppeal;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var outcomeKeys = ['Reddedildi', 'Onaylandi', 'KismiOnay'];
    var stanceKeys = ['Belirsiz', 'Itiraz', 'Kabul'];
    var stanceTone = ['neutral', 'accent', 'warning'];
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
        $('#Items').html(items.map(item).join(''));
        $('#ItemsEmpty').toggleClass('d-none', items.length > 0 || !model.decisionId);
    }

    // ---------- Görüş yazma (danışman) ----------
    $('#Items').on('click', '.apya-ap-edit', function () {
        var id = $(this).closest('.apya-ap-item').data('id');
        var current = (model.items || []).filter(function (i) { return i.id === id; })[0];

        abp.message.prompt(l('Grants:Appeal:OpinionPrompt'), '', {
            inputType: 'select',
            inputOptions: {
                1: l('Grants:Appeal:Stance:Itiraz'),
                2: l('Grants:Appeal:Stance:Kabul')
            }
        }).then(function (stanceResult) {
            if (!stanceResult.isConfirmed) { return; }
            abp.message.prompt(l('Grants:Appeal:OpinionDetailPrompt'), '', {
                inputValue: (current && current.opinionDetail) || ''
            }).then(function (detailResult) {
                if (!detailResult.isConfirmed) { return; }
                service.saveOpinion({
                    itemId: id,
                    stance: Number(stanceResult.value),
                    summary: Number(stanceResult.value) === 1
                        ? l('Grants:Appeal:Summary:Appeal')
                        : l('Grants:Appeal:Summary:Accept'),
                    detail: detailResult.value || null
                }).then(function (dto) { model = dto; paint(); });
            });
        });
    });

    $('#AddItemBtn').on('click', function () {
        abp.message.prompt(l('Grants:Appeal:AddItemPrompt')).then(function (result) {
            if (!result.isConfirmed || !result.value) { return; }
            service.addItem({ applicationId: appId, title: result.value }).then(function (dto) {
                model = dto; paint();
            });
        });
    });

    // ---------- İtirazı gönder ----------
    $('#SubmitAppealBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.submitAppeal(appId).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:Appeal:Submitted'));
        }).always(function () { $btn.prop('disabled', false); });
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

        if (hasDecision) {
            $('#DecisionTitle').text(l('Grants:Appeal:Outcome:' + outcomeKeys[model.outcome],
                date(model.decidedOn)));
            $('#DecisionMeta').text([model.grantName, model.period,
                model.referenceNo ? l('Grants:Appeal:Reference', model.referenceNo) : null]
                .filter(Boolean).join(' · '));

            $('#Countdown').text(model.appealSubmittedAt
                ? l('Grants:Appeal:SubmittedOn', date(model.appealSubmittedAt))
                : model.appealDaysLeft != null
                    ? l('Grants:Appeal:DaysLeft', model.appealDaysLeft)
                    : l('Grants:Appeal:WindowClosed'));

            // İtirazı firma gönderir; danışman görüş yazar.
            $('#SubmitAppealBtn').toggleClass('d-none',
                !model.isAppealWindowOpen || model.appealedCount === 0);
        }

        paintItems();
        paintSide();
    }

    service.get(appId).then(function (dto) { model = dto; paint(); });
});
