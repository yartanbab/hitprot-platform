$(function () {
    var service = apya.platform.grants.grantMatchWeight;
    var l = abp.localization.getResource('Platform');
    var grantId = $('.apya-page').data('grant-id');

    // GrantMatchDimension ve GrantFirmDataField enum sıralarıyla birebir.
    var dimensionKeys = ['Sector', 'TechnicalMaturity', 'RdStaff', 'Region', 'ProjectHistory', 'Keyword'];
    var fieldKeys = ['Nace', 'Trl', 'RdStaff', 'StaffCount', 'Revenue', 'FoundedOn', 'ConsortiumPartner', 'CompanySize'];
    var steps = [0, 0.5, 1, 1.5, 2];

    var previewTimer = null;
    var loading = true;
    var publishedCallCount = 0;
    var missingByField = {};

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function fmt(v) { return v === 0 ? l('Grants:Weights:Off') : '×' + String(v).replace('.', ','); }

    // ---------- Boyut satırları ----------
    function dimensionRow(d) {
        var buttons = steps.map(function (s) {
            return '<button type="button" class="apya-weight-step' +
                (d.multiplier === s ? ' is-on' : '') + (s === 0 ? ' is-zero' : '') +
                '" data-value="' + s + '">' + esc(fmt(s)) + '</button>';
        }).join('');

        return $(
            '<div class="apya-weight-row' + (d.multiplier === 0 ? ' is-off' : '') +
            '" data-dimension="' + d.dimension + '">' +
            '  <span class="apya-weight-name">' + esc(l('Grants:Dimension:' + dimensionKeys[d.dimension])) + '</span>' +
            '  <span class="apya-weight-steps">' + buttons + '</span>' +
            '  <span class="apya-weight-note"></span>' +
            '</div>');
    }

    $('#WeightDimensions').on('click', '.apya-weight-step', function () {
        var $row = $(this).closest('.apya-weight-row');
        var value = Number($(this).data('value'));
        $row.find('.apya-weight-step').removeClass('is-on');
        $(this).addClass('is-on');
        $row.toggleClass('is-off', value === 0);
        schedulePreview();
    });

    // ---------- Form → DTO ----------
    function collect() {
        return {
            applyToAllPrograms: $('#ScopeGlobal').is(':checked'),
            sizePenaltyEnabled: $('#WeightSizePenalty').is(':checked'),
            skipMissingDimensions: $('#WeightSkipMissing').is(':checked'),
            dimensions: $('#WeightDimensions .apya-weight-row').map(function () {
                var $r = $(this);
                return {
                    dimension: Number($r.data('dimension')),
                    multiplier: Number($r.find('.apya-weight-step.is-on').data('value'))
                };
            }).get()
        };
    }

    function fill(dto) {
        loading = true;
        publishedCallCount = dto.publishedCallCount || 0;

        var $dims = $('#WeightDimensions').empty();
        (dto.dimensions || []).forEach(function (d) { $dims.append(dimensionRow(d)); });

        $('#WeightSizePenalty').prop('checked', !!dto.sizePenaltyEnabled);
        $('#WeightSkipMissing').prop('checked', !!dto.skipMissingDimensions);

        $('#WeightScopeChip')
            .toggleClass('apya-chip-neutral', dto.isInherited)
            .toggleClass('apya-chip-accent', !dto.isInherited)
            .text(dto.isInherited ? l('Grants:Weights:Inherited') : l('Grants:Weights:Overridden'));
        // Kendi satırı olmayan programda "varsayılana dön" yapacak bir şey yok.
        $('#WeightResetBtn').toggleClass('d-none', dto.isInherited);

        $('#WeightBackLink').attr('href', '/Grants/Parameters?id=' + dto.grantId);

        paintScopeWarning();
        paintDimensionNotes();
        loading = false;
        refreshImpact();
    }

    // ---------- Kapsam ----------
    $('input[name="WeightScope"]').on('change', function () {
        paintScopeWarning();
        schedulePreview();
    });

    function paintScopeWarning() {
        var global = $('#ScopeGlobal').is(':checked');
        $('#ScopeWarning')
            .toggleClass('d-none', !global)
            .text(l('Grants:Weights:ScopeWarning', publishedCallCount));
    }

    // ---------- Canlı etki ----------
    function schedulePreview() {
        if (loading) { return; }
        clearTimeout(previewTimer);
        previewTimer = setTimeout(refreshImpact, 300);
    }

    function refreshImpact() {
        service.previewImpact(grantId, collect()).then(paintImpact);
    }

    function paintImpact(p) {
        $('#ImpactCurrent').text(p.currentMatchingFirms);
        $('#ImpactNew').text(p.newMatchingFirms);
        $('#ImpactTotal').text(l('Grants:Weights:ImpactOf', p.totalFirms));

        var $movers = $('#ImpactMovers').empty();
        if (!p.topMovers || p.topMovers.length === 0) {
            $movers.append('<div class="small text-muted">' + esc(l('Grants:Weights:NoMovers')) + '</div>');
            return;
        }
        p.topMovers.forEach(function (m) {
            var up = m.newScore >= m.currentScore;
            $movers.append(
                '<div class="apya-mover"><span>' + esc(m.tenantName) + '</span>' +
                '<span class="apya-mover-scores"><span class="is-old">' + m.currentScore + '</span> ' +
                '<span class="' + (up ? 'is-up' : 'is-down') + '">' + m.newScore + '</span></span></div>');
        });
    }

    // Boyut satırının sağındaki not: firmalarda o verinin ne kadar eksik olduğu.
    // Karşılığı olmayan boyutlar (bölge, proje geçmişi, anahtar kelime) boş kalır —
    // uydurma not yazmak yerine hiç yazmıyoruz.
    var noteFieldOfDimension = { 0: 0, 1: 1, 2: 2 }; // Sector→Nace, TechnicalMaturity→Trl, RdStaff→RdStaff

    function paintDimensionNotes() {
        $('#WeightDimensions .apya-weight-row').each(function () {
            var field = noteFieldOfDimension[Number($(this).data('dimension'))];
            var count = field === undefined ? null : missingByField[field];
            $(this).find('.apya-weight-note')
                .text(count ? l('Grants:Weights:MissingIn', count) : '');
        });
    }

    // ---------- Eksik veri kampanyası ----------
    function loadCampaign() {
        return service.getMissingData().then(function (rows) {
            missingByField = {};
            (rows || []).forEach(function (r) { missingByField[r.field] = r.firmCount; });
            paintDimensionNotes();

            var $body = $('#WeightCampaign').empty();
            (rows || []).forEach(function (r) {
                var key = fieldKeys[r.field];
                $body.append(
                    '<div class="apya-campaign-row">' +
                    '<span>' + esc(l('Grants:DataField:' + key)) + '</span>' +
                    '<span class="apya-campaign-count">' + r.firmCount + '</span>' +
                    '<span class="apya-campaign-count">' + r.affectedCallCount + '</span>' +
                    '<span class="apya-campaign-how">' + esc(l('Grants:DataFieldHow:' + key)) + '</span>' +
                    '</div>');
            });
            $('#WeightCampaignEmpty').toggleClass('d-none', (rows || []).length > 0);
        });
    }

    // ---------- Kaydet / sıfırla ----------
    $('#WeightSaveBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.update(grantId, collect())
            .then(function (dto) {
                abp.notify.success(l('Grants:Weights:Saved'));
                fill(dto);
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    $('#WeightResetBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.reset(grantId)
            .then(function (dto) {
                abp.notify.success(l('Grants:Weights:Reset'));
                fill(dto);
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    $('#WeightSizePenalty, #WeightSkipMissing').on('change', schedulePreview);

    loadCampaign();
    service.get(grantId).then(fill);
});
