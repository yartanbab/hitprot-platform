$(function () {
    var service = apya.platform.grants.grantRecommendation;
    var appSvc = apya.platform.grants.grantApplication;
    var l = abp.localization.getResource('Platform');
    var callId = $('.apya-page').data('call-id');

    // Enum sıraları sunucudakiyle birebir.
    var bucketKeys = ['Uygun', 'Kosullu', 'UygunDegil'];
    var bucketTone = ['positive', 'warning', 'neutral'];
    var ruleKeys = ['CompanySize', 'CompanyAge', 'Trl', 'StaffCount', 'RdStaffCount', 'Revenue', 'Consortium'];
    var outcomeIcon = ['fa-circle-check is-passed', 'fa-circle-xmark is-failed', 'fa-circle-exclamation is-unknown'];
    var dimensionKeys = ['Sector', 'TechnicalMaturity', 'RdStaff', 'Region', 'ProjectHistory', 'Keyword'];
    var costKeys = ['Personel', 'MakineTechizat', 'Danismanlik', 'YazilimLisans', 'Seyahat', 'SarfMalzeme'];
    var partyKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];
    var obligationKeys = ['Zorunlu', 'Kosullu'];
    var difficultyKeys = ['ManyDocuments', 'ESignature', 'Consortium', 'ComplexProcess', 'DeadlinePressure'];

    var detail = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

    // ---------- Başlık + metrikler ----------
    function paintHead(d) {
        $('#CallTitle').text(d.grantName);
        $('#CallIssuer').text(d.issuer + ' · ' + d.period);
        $('#CallDescription').text(d.description || '');

        $('#BucketChip')
            .attr('class', 'apya-chip apya-chip-' + bucketTone[d.bucket])
            .text(l('Grants:Bucket:' + bucketKeys[d.bucket]));

        $('#DaysChip').toggleClass('d-none', d.daysRemaining == null)
            .text(d.daysRemaining == null ? ''
                : d.daysRemaining < 0 ? l('Grants:Feed:Card:Closed')
                : l('Grants:Feed:Card:DaysLeft', d.daysRemaining));

        var metrics = [
            [l('Grants:Parameters:MaxAmount'), money(d.maxAmount)],
            [l('Grants:Parameters:SupportRate'), d.supportRatePercent != null ? '%' + d.supportRatePercent : '—'],
            [l('Grants:Parameters:Duration'), d.projectDurationMonths != null ? d.projectDurationMonths : '—'],
            [l('Grants:Field:Deadline'), fmtDate(d.deadline)]
        ];
        $('#CallMetrics').html(metrics.map(function (m) {
            return '<div class="apya-detail-metric"><span class="apya-overline">' + esc(m[0]) +
                '</span><span class="apya-detail-metric-value">' + esc(m[1]) + '</span></div>';
        }).join(''));

        $('#ApplyBtn').prop('disabled', d.alreadyApplied)
            .text(d.alreadyApplied ? l('Grants:Feed:Card:Applied') : l('Grants:Detail:Apply'));
        paintBookmark(d.isBookmarked);
    }

    function paintBookmark(on) {
        $('#BookmarkBtn').toggleClass('btn-primary', on).toggleClass('btn-outline-secondary', !on);
        $('#BookmarkText').text(l(on ? 'Grants:Catalog:Unbookmark' : 'Grants:Catalog:Bookmark'));
    }

    // ---------- Uygunluk tablosu ----------
    function paintRules(d) {
        var $rows = $('#RuleRows').empty();
        (d.rules || []).forEach(function (r) {
            var cls = r.outcome === 1 ? ' is-failed' : r.outcome === 2 ? ' is-unknown' : '';
            var firm = r.firmValue == null ? l('Grants:Detail:NotEntered') : r.firmValue;
            var note = (r.grantValue == null ? '—' : r.grantValue);
            $rows.append(
                '<div class="apya-check-row' + cls + '">' +
                '<i class="fa ' + outcomeIcon[r.outcome] + '"></i>' +
                '<span>' + esc(l('Grants:Rule:' + ruleKeys[r.rule])) +
                ' <span class="apya-cat-sub">· ' + esc(firm) + '</span></span>' +
                '<span class="apya-check-note">' + esc(note) + '</span>' +
                '</div>');
        });
        $('#RuleEmpty').toggleClass('d-none', (d.rules || []).length > 0);
        $('#NotBlockingNote').toggleClass('d-none', !d.missingRulesAreNotBlocking);
    }

    // ---------- Bütçe hesaplayıcı ----------
    function paintBudget(d) {
        var $rows = $('#BudgetRows').empty();
        (d.costItems || []).forEach(function (c, i) {
            var limit = c.limitPercent != null
                ? '<span class="apya-chip apya-chip-warning">' + esc(l('Grants:Detail:Budget:Limit', c.limitPercent)) + '</span>'
                : '';
            $rows.append(
                '<div class="apya-budget-row" data-index="' + i + '">' +
                '<span>' + esc(l('Grants:CostItem:' + costKeys[c.kind])) + ' ' + limit + '</span>' +
                '<input type="number" min="0" step="0.01" class="form-control form-control-sm apya-budget-input" />' +
                '<span class="apya-cat-num text-end">' + (d.supportRatePercent != null ? '%' + d.supportRatePercent : '—') + '</span>' +
                '<span class="apya-cat-num text-end apya-budget-support">—</span>' +
                '</div>');
        });
        $('#BudgetEmpty').toggleClass('d-none', (d.costItems || []).length > 0);
        recalcBudget();
    }

    $('#BudgetRows').on('input', '.apya-budget-input', recalcBudget);

    /// Destek = kalem bütçesi × destek oranı, kalem üst limitiyle kırpılır; toplam da
    /// programın üst limitini aşamaz. Hesap tamamen istemcide, hiçbir şey kaydedilmez.
    function recalcBudget() {
        if (!detail) { return; }
        var rate = (detail.supportRatePercent || 0) / 100;
        var totalOwn = 0;
        var totalSupport = 0;

        $('#BudgetRows .apya-budget-row').each(function () {
            var i = Number($(this).data('index'));
            var item = detail.costItems[i];
            var own = Number($(this).find('.apya-budget-input').val()) || 0;
            var support = own * rate;
            if (item.limitPercent != null) {
                support = Math.min(support, own * (item.limitPercent / 100));
            }
            totalOwn += own;
            totalSupport += support;
            $(this).find('.apya-budget-support').text(own ? money(support) : '—');
        });

        var capped = false;
        if (detail.maxAmount && totalSupport > detail.maxAmount) {
            totalSupport = detail.maxAmount;
            capped = true;
        }

        $('#BudgetSupport').text(totalOwn ? money(totalSupport) : '—');
        $('#BudgetShare').text(totalOwn ? money(Math.max(0, totalOwn - totalSupport)) : '—');
        $('#BudgetNote').text(capped ? l('Grants:Detail:Budget:Capped') : '');
    }

    // ---------- Süreç + evrak ----------
    function paintProcess(d) {
        var $strip = $('#StepStrip').empty();
        (d.stageSteps || []).forEach(function (s, i) {
            if (i > 0) { $strip.append('<i class="fa fa-angle-right text-muted"></i>'); }
            $strip.append('<span class="apya-step"><span>' + esc(s.name) + '</span>' +
                '<span class="apya-step-owner">' + esc(l('Grants:Party:' + partyKeys[s.owner])) + '</span></span>');
        });
        $('#StepEmpty').toggleClass('d-none', (d.stageSteps || []).length > 0);

        var $docs = $('#DocumentList').empty();
        (d.documents || []).forEach(function (doc) {
            $docs.append('<div class="apya-dim-row"><span>' + esc(doc.name) +
                (doc.requiresESignature
                    ? ' <span class="apya-chip apya-chip-warning">' + esc(l('Grants:Parameters:Documents:ESignature')) + '</span>'
                    : '') +
                '</span><span class="d-flex gap-1">' +
                '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Obligation:' + obligationKeys[doc.obligation])) + '</span>' +
                '<span class="apya-chip apya-chip-accent">' + esc(l('Grants:Party:' + partyKeys[doc.uploaderParty])) + '</span>' +
                '</span></div>');
        });
        $('#DocumentEmpty').toggleClass('d-none', (d.documents || []).length > 0);
    }

    // ---------- Sağ panel ----------
    function paintSide(d) {
        $('#ScoreValue').text('%' + d.score);
        var $dims = $('#ScoreDimensions').empty();
        (d.scoreDimensions || []).forEach(function (dim) {
            $dims.append(
                '<div class="apya-dim-row"><span>' + esc(l('Grants:Dimension:' + dimensionKeys[dim.dimension])) +
                '</span><span class="apya-cat-num">%' + dim.value + '</span></div>' +
                '<div class="apya-mini-bar"><span style="width:' + dim.value + '%"></span></div>');
        });

        $('#DifficultyLabel').text(l('Grants:Difficulty:' + d.difficulty));
        var $bar = $('#DifficultyBar').empty().toggleClass('is-hard', !!d.isHard);
        for (var i = 1; i <= 5; i++) {
            $bar.append('<span class="' + (i <= d.difficulty ? 'is-on' : '') + '"></span>');
        }
        $('#DifficultyReasons').html((d.difficultyReasons || []).map(function (r) {
            return '<span class="apya-feed-reason is-missing"><i class="fa fa-circle-exclamation"></i>' +
                esc(l('Grants:DifficultyReason:' + difficultyKeys[r])) + '</span>';
        }).join(''));
        $('#HardWarning').toggleClass('d-none', !d.isHard);

        var $sim = $('#SimilarList').empty();
        (d.similar || []).forEach(function (s) {
            $sim.append('<div class="apya-dim-row"><a class="text-decoration-none" href="/Grants/Detail?id=' +
                s.grantCallId + '">' + esc(s.grantName) + '</a>' +
                '<span class="apya-cat-num">%' + s.score + '</span></div>');
        });
        $('#SimilarEmpty').toggleClass('d-none', (d.similar || []).length > 0);
    }

    // ---------- Eylemler ----------
    $('#BookmarkBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.toggleBookmark(callId)
            .then(function (on) { detail.isBookmarked = on; paintBookmark(on); })
            .always(function () { $btn.prop('disabled', false); });
    });

    $('#ApplyBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        appSvc.apply(callId)
            .then(function () {
                abp.notify.success('Başvurunuz alındı.');
                $btn.text(l('Grants:Feed:Card:Applied'));
            })
            .fail(function () { $btn.prop('disabled', false); });
    });

    service.getCallDetail(callId).then(function (d) {
        detail = d;
        paintHead(d);
        paintRules(d);
        paintBudget(d);
        paintProcess(d);
        paintSide(d);
    });
});
