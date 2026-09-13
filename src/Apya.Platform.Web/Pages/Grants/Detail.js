$(function () {
    var service = apya.platform.grants.grantRecommendation;
    var interestSvc = apya.platform.grants.grantInterest;
    var l = abp.localization.getResource('Platform');
    var callId = $('.apya-page').data('call-id');
    var interestModal = new bootstrap.Modal(document.getElementById('InterestModal'));

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
    function fmtDateTime(v) {
        return v ? new Date(v).toLocaleString('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : '';
    }

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

        paintInterest(d);
        paintBookmark(d.isBookmarked);
    }

    // ---------- İlgi talebi (tur 14) ----------
    // Enum değerleri sunucudakiyle birebir (GrantInterestStatus).
    var IST = { Yeni: 0, Inceleniyor: 1, BasvuruAcildi: 2, UygunDegil: 3, GeriCekildi: 4 };

    function paintInterest(d) {
        var st = d.interestStatus;
        var closed = st === IST.UygunDegil || st === IST.GeriCekildi;
        var pending = st === IST.Yeni || st === IST.Inceleniyor;

        // Yeni talep ancak süren talep ya da açılmış başvuru yokken bırakılabilir. Kapanan
        // talep (reddedilen ya da geri çekilen) kapıyı kapatmaz: yeni kayıt açılır.
        var canExpress = !d.alreadyApplied && (st == null || closed);
        $('#InterestBtn').toggleClass('d-none', !canExpress).prop('disabled', false);
        $('#InterestBtnText').text(l(closed ? 'Grants:Interest:ExpressAgain' : 'Grants:Interest:Express'));

        // Talep kaydı olmayan ESKİ başvurular (bu akıştan önce açılanlar) yalnız rozet görür;
        // talebi olanların durumu aşağıdaki şeritte anlatılır — başlıkta ikinci sinyal yok.
        var legacy = st == null && d.alreadyApplied;
        $('#InterestChip')
            .attr('class', 'apya-chip apya-chip-positive' + (legacy ? '' : ' d-none'))
            .text(legacy ? l('Grants:Interest:Status:BasvuruAcildi') : '');

        $('#InterestAppLink').toggleClass('d-none', !d.interestApplicationId)
            .attr('href', '/Grants/Wizard?id=' + d.interestApplicationId);

        $('#InterestFeedback').toggleClass('d-none', !(st === IST.UygunDegil && d.interestFeedback));
        $('#InterestFeedbackText').text(d.interestFeedback || '');

        $('#InterestWithdrawn').toggleClass('d-none', st !== IST.GeriCekildi);
        $('#InterestWithdrawnText').text(st === IST.GeriCekildi
            ? l('Grants:Interest:Withdrawn', fmtDate(d.interestWithdrawnAt)) : '');

        paintInterestState(d, st, pending);
    }

    var stepDone = '<i class="fa fa-check apya-interest-step-check" aria-hidden="true"></i>';

    function stepRow(state, title, sub, tail) {
        return '<li class="apya-interest-step is-' + state + '">' +
            '<span class="apya-interest-dot" aria-hidden="true"></span>' +
            '<span class="apya-interest-step-text">' +
            '<span class="apya-interest-step-title">' + esc(title) + '</span>' +
            '<span class="apya-interest-step-sub">' + esc(sub) + '</span></span>' +
            (tail || '') + '</li>';
    }

    /// "İlginiz iletildi" şeridi + dört adım. Proje fikri onay adımıyla BİRLİKTE
    /// gönderildiği için ilk iki adım aynı anda tamamlanır.
    function paintInterestState(d, st, pending) {
        var started = st === IST.BasvuruAcildi;
        $('#InterestState').toggleClass('d-none', !pending && !started);
        if (!pending && !started) { return; }

        $('#InterestSent').toggleClass('d-none', !pending);
        $('#InterestSentText').text(l('Grants:Interest:Sent:Text', fmtDateTime(d.interestCreationTime)));

        var reviewing = st === IST.Inceleniyor;
        $('#InterestSteps').html([
            stepRow('done', l('Grants:Interest:Step:Expressed'), fmtDateTime(d.interestCreationTime), stepDone),
            stepRow('done', l('Grants:Interest:Step:Idea'), l('Grants:Interest:Step:IdeaSent'), stepDone),
            started
                ? stepRow('done', l('Grants:Interest:Step:Review'), l('Grants:Interest:Step:ReviewDone'), stepDone)
                : stepRow('current', l('Grants:Interest:Step:Review'),
                    l(reviewing ? 'Grants:Interest:Step:ReviewActive' : 'Grants:Interest:Step:ReviewWaiting'),
                    reviewing ? '<span class="apya-chip apya-chip-accent">' + esc(l('Grants:Interest:Step:ReviewChip')) + '</span>' : ''),
            started
                ? stepRow('done', l('Grants:Interest:Step:Decision'), l('Grants:Interest:Step:DecisionStarted'), stepDone)
                : stepRow('pending', l('Grants:Interest:Step:Decision'), l('Grants:Interest:Step:DecisionHint'))
        ].join(''));

        // Başvuruya dönmüş talepte eylem yok; boş kap flex boşluğu bırakmasın diye kapla birlikte gizlenir.
        $('#InterestWithdrawBtn').closest('.apya-interest-actions').toggleClass('d-none', !pending);
        $('#InterestWithdrawBtn').toggleClass('d-none', !pending);
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
                '<span class="apya-check-note" data-label="' + esc(l('Grants:Detail:Col:Note')) + '">' +
                esc(note) + '</span>' +
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
                '<span data-label="' + esc(l('Grants:Detail:Budget:Yours')) + '">' +
                '<input type="number" min="0" step="0.01" class="form-control form-control-sm apya-budget-input" /></span>' +
                '<span class="apya-cat-num text-end" data-label="' + esc(l('Grants:Detail:Budget:Rate')) + '">' +
                (d.supportRatePercent != null ? '%' + d.supportRatePercent : '—') + '</span>' +
                '<span class="apya-cat-num text-end apya-budget-support" data-label="' +
                esc(l('Grants:Detail:Budget:Support')) + '">—</span>' +
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

    // ---------- İlgi onayı + proje fikri ----------
    function showPane(name) {
        $('#InterestModal .apya-interest-pane').each(function () {
            $(this).toggleClass('d-none', $(this).data('pane') !== name);
        });
    }

    // Hedeflenen başlangıç: içinde bulunulan çeyrekten itibaren sekiz çeyrek. Değer
    // çeyreğin ilk günü, "yyyy-MM-dd" olarak ELLE kurulur — toISOString() TZ+03'te
    // tarihi bir gün geriye kaydırır.
    function quarterOptions() {
        var now = new Date();
        var y = now.getFullYear();
        var q = Math.floor(now.getMonth() / 3) + 1;
        var html = '<option value="">' + esc(l('Grants:Interest:Form:TargetStart:Unknown')) + '</option>';
        for (var i = 0; i < 8; i++) {
            var month = (q - 1) * 3 + 1;
            html += '<option value="' + y + '-' + (month < 10 ? '0' : '') + month + '-01">' +
                esc(l('Grants:Interest:Form:Quarter', y, q)) + '</option>';
            q++;
            if (q > 4) { q = 1; y++; }
        }
        return html;
    }

    function partnerChoice() { return $('input[name=InterestPartner]:checked').val() || null; }

    function paintPartner() {
        var c = partnerChoice();
        $('#InterestPartnerName').toggleClass('d-none', c !== 'has');
        $('#InterestPartnerHint').toggleClass('d-none', c !== 'needs');
    }

    function resetInterestForm() {
        document.getElementById('InterestForm').reset();
        $('#InterestNote').removeClass('is-invalid');
        $('#InterestPartnerError').removeClass('d-block');
        $('#InterestCallName').text(detail ? detail.grantName : '');
        $('#InterestStart').html(quarterOptions());
        var budget = document.getElementById('InterestBudget');
        if (budget.__apyaMoney) { apya.moneyInput.setValue(budget, null); }
        $('#InterestPartnerBlock').toggleClass('d-none', !(detail && detail.requiresConsortium));
        paintPartner();
        showPane('confirm');
    }

    $('#InterestBtn').on('click', function () {
        resetInterestForm();
        interestModal.show();
    });

    $('#InterestContinue').on('click', function () {
        showPane('form');
        $('#InterestNote').trigger('focus');
    });

    $('#InterestBack').on('click', function () { showPane('confirm'); });

    $('#InterestModal').on('change', 'input[name=InterestPartner]', function () {
        $('#InterestPartnerError').removeClass('d-block');
        paintPartner();
    });

    $('#InterestNote').on('input', function () { $(this).removeClass('is-invalid'); });

    $('#InterestForm').on('submit', function (e) {
        e.preventDefault();

        var note = $.trim($('#InterestNote').val());
        var askPartner = !!(detail && detail.requiresConsortium);
        var choice = partnerChoice();
        var valid = true;
        if (!note) { $('#InterestNote').addClass('is-invalid'); valid = false; }
        if (askPartner && !choice) { $('#InterestPartnerError').addClass('d-block'); valid = false; }
        if (!valid) { return; }

        var budget = document.getElementById('InterestBudget');
        var input = {
            grantCallId: callId,
            note: note,
            estimatedBudget: budget.__apyaMoney
                ? apya.moneyInput.getValue(budget)
                : (budget.value === '' ? null : Number(budget.value)),
            targetStartDate: $('#InterestStart').val() || null,
            needsPartner: askPartner ? choice === 'needs' : null,
            partnerName: askPartner && choice === 'has' ? ($.trim($('#InterestPartnerName').val()) || null) : null
        };

        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        interestSvc.express(input)
            .then(function () {
                interestModal.hide();
                // Durum sunucudan geri okunur: şerit, düğme ve takip işareti tek yerden boyanır.
                return service.getCallDetail(callId).then(function (d) {
                    detail = d;
                    paintInterest(d);
                    paintBookmark(d.isBookmarked);
                    var state = document.getElementById('InterestState');
                    if (state && state.scrollIntoView) { state.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                });
            })
            .always(function () { $submit.prop('disabled', false); });
    });

    $('#InterestWithdrawBtn').on('click', function () {
        if (!detail || !detail.interestId) { return; }
        var $btn = $(this);
        abp.message.confirm(l('Grants:Interest:Withdraw:Confirm'), l('Grants:Interest:Withdraw:Title')).then(function (ok) {
            if (!ok) { return; }
            $btn.prop('disabled', true);
            interestSvc.withdraw(detail.interestId)
                .then(function () { return service.getCallDetail(callId); })
                .then(function (d) { detail = d; paintInterest(d); })
                .always(function () { $btn.prop('disabled', false); });
        });
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
