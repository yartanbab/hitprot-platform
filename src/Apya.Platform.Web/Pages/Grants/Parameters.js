$(function () {
    var service = apya.platform.grants.grantParameter;
    var templateService = apya.platform.grants.grantStageTemplate;
    var weightService = apya.platform.grants.grantMatchWeight;
    var l = abp.localization.getResource('Platform');
    var grantId = $('.apya-page').data('grant-id');

    // GrantEligibilityRule ↔ kural adı (sunucudaki enum sırasıyla birebir).
    var ruleKeys = ['CompanySize', 'CompanyAge', 'Trl', 'StaffCount', 'RdStaffCount', 'Revenue', 'Consortium'];
    var sizeKeys = { 1: 'Mikro', 2: 'Kucuk', 4: 'Orta', 8: 'Buyuk' };
    var partyKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];
    var obligationKeys = ['Zorunlu', 'Kosullu'];
    var stageTemplates = [];
    var dimensionKeys = ['Sector', 'TechnicalMaturity', 'RdStaff', 'Region', 'ProjectHistory', 'Keyword'];

    var trlMin = null;
    var trlMax = null;
    var previewTimer = null;
    var loading = true;
    var lastDraftCount = 0;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function num(sel) { var v = $(sel).val(); return v === '' || v == null ? null : Number(v); }
    function setNum(sel, v) { $(sel).val(v == null ? '' : v); }

    // ---------- Etiket (chip) girişi ----------
    function addTag($input, value) {
        value = (value || '').trim();
        if (!value) { return; }
        var $chips = $input.find('.apya-tag-chips');
        var dup = $chips.find('.apya-tag-chip').filter(function () {
            return $(this).contents().first().text().trim().toLowerCase() === value.toLowerCase();
        }).length;
        if (!dup) {
            $chips.append('<span class="apya-tag-chip">' + esc(value) +
                '<button type="button" class="apya-tag-remove" aria-label="&times;">&times;</button></span>');
        }
    }

    function readTags(kind) {
        return $('.apya-tag-input[data-kind="' + kind + '"] .apya-tag-chip')
            .map(function () { return $(this).contents().first().text().trim(); }).get();
    }

    $(document).on('keydown', '.apya-tag-entry', function (e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag($(this).closest('.apya-tag-input'), $(this).val());
            $(this).val('');
            schedulePreview();
        }
    });
    $(document).on('blur', '.apya-tag-entry', function () {
        addTag($(this).closest('.apya-tag-input'), $(this).val());
        $(this).val('');
        schedulePreview();
    });
    $(document).on('click', '.apya-tag-remove', function () {
        $(this).closest('.apya-tag-chip').remove();
        schedulePreview();
    });

    // ---------- Ölçek chip'leri ----------
    $('#ParamSizes').on('click', '.apya-choice', function () {
        $(this).toggleClass('is-on');
        schedulePreview();
    });

    // ---------- TRL aralığı ----------
    // Tek tıklama tek seviye seçer; ikinci tıklama aralığı o yöne genişletir.
    // Seçili tek segmente tekrar tıklamak seçimi temizler ("şart yok").
    $('#ParamTrl').on('click', '.apya-trl-seg', function () {
        var n = Number($(this).data('trl'));
        if (trlMin === null) {
            trlMin = trlMax = n;
        } else if (n < trlMin) {
            trlMin = n;
        } else if (n > trlMax) {
            trlMax = n;
        } else if (trlMin === trlMax && n === trlMin) {
            trlMin = trlMax = null;
        } else {
            trlMin = trlMax = n;
        }
        paintTrl();
        schedulePreview();
    });

    function paintTrl() {
        $('#ParamTrl .apya-trl-seg').each(function () {
            var n = Number($(this).data('trl'));
            $(this).toggleClass('is-on', trlMin !== null && n >= trlMin && n <= trlMax);
        });
    }

    // ---------- Harcama kalemleri ----------
    $('#ParamCostItems').on('click', '.apya-cost-tile', function () {
        var $tile = $(this);
        $tile.toggleClass('is-open');
        paintCostTile($tile);
        schedulePreview();
    });
    // Limit kutusuna tıklamak kalemi kapatmasın. (Değer değişimini aşağıdaki
    // genel 'input change' dinleyicisi zaten yakalıyor.)
    $('#ParamCostItems').on('click', '.apya-cost-limit', function (e) { e.stopPropagation(); });

    function paintCostTile($tile) {
        var open = $tile.hasClass('is-open');
        $tile.find('.apya-cost-tile-state').toggleClass('d-none', open);
        $tile.find('.apya-cost-limit').toggleClass('d-none', !open);
    }

    // ---------- Konsorsiyum ----------
    $('#ParamConsortium').on('change', function () {
        $('#ParamMinPartners').prop('disabled', !this.checked);
        if (!this.checked) { $('#ParamMinPartners').val(''); }
    });

    // ---------- Eş finansman (türetilmiş) ----------
    $('#ParamSupportRate').on('input', paintCoFinancing);
    function paintCoFinancing() {
        var rate = num('#ParamSupportRate');
        $('#ParamCoFinancing').val(rate == null ? '' : 100 - rate);
    }

    // ---------- Sol nav: bölüme kaydır ----------
    $('.apya-param-nav-item[data-target]').on('click', function () {
        var target = document.querySelector($(this).data('target'));
        if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        $('.apya-param-nav-item').removeClass('is-active');
        $(this).addClass('is-active');
    });

    // ---------- Evrak & Belgeler ----------
    function docRow(d) {
        var opts = function (keys, prefix, selected) {
            return keys.map(function (k, i) {
                return '<option value="' + i + '"' + (selected === i ? ' selected' : '') + '>' +
                    esc(l(prefix + k)) + '</option>';
            }).join('');
        };
        return $(
            '<div class="apya-doc-row apya-doc-item">' +
            '  <input type="text" class="form-control form-control-sm apya-doc-name" maxlength="128" ' +
            '         placeholder="' + esc(l('Grants:Parameters:Documents:NamePlaceholder')) + '" />' +
            '  <select class="form-select form-select-sm apya-doc-obligation">' +
                   opts(obligationKeys, 'Grants:Obligation:', d.obligation) + '</select>' +
            '  <select class="form-select form-select-sm apya-doc-uploader">' +
                   opts(partyKeys, 'Grants:Party:', d.uploaderParty) + '</select>' +
            '  <span class="form-check mb-0"><input class="form-check-input apya-doc-esign" type="checkbox" /></span>' +
            '  <button type="button" class="apya-doc-remove" title="' + esc(l('Grants:Parameters:Documents:Remove')) + '">' +
            '    <i class="fa fa-xmark"></i></button>' +
            '</div>')
            .find('.apya-doc-name').val(d.name || '').end()
            .find('.apya-doc-esign').prop('checked', !!d.requiresESignature).end();
    }

    $('#ParamAddDocument').on('click', function () {
        $('#ParamDocuments').append(docRow({ obligation: 0, uploaderParty: 0 }));
        refreshDocMeta();
        schedulePreview();
    });

    $('#ParamDocuments').on('click', '.apya-doc-remove', function () {
        $(this).closest('.apya-doc-item').remove();
        refreshDocMeta();
        schedulePreview();
    });

    function refreshDocMeta() {
        var n = $('#ParamDocuments .apya-doc-item').length;
        $('#ParamDocumentsEmpty').toggleClass('d-none', n > 0);
        $('#NavDocumentsBadge').text(n);
    }

    function readDocuments() {
        return $('#ParamDocuments .apya-doc-item').map(function (i) {
            var $r = $(this);
            return {
                order: i,
                name: $r.find('.apya-doc-name').val(),
                obligation: Number($r.find('.apya-doc-obligation').val()),
                uploaderParty: Number($r.find('.apya-doc-uploader').val()),
                requiresESignature: $r.find('.apya-doc-esign').is(':checked')
            };
        }).get();
    }

    // ---------- Süreç şablonu ----------
    $('#ParamStageTemplate').on('change', paintStageMeta);

    function paintStageMeta() {
        var id = $('#ParamStageTemplate').val();
        var t = stageTemplates.find(function (x) { return x.id === id; });
        $('#ParamStageStepCount')
            .toggleClass('d-none', !t)
            .text(t ? l('Grants:Parameters:Process:StepCount', t.steps.length) : '');
        // Rozet şablon ADINI değil aşama SAYISINI taşır: 236px'lik navda uzun ad
        // satır kaydırıyordu ve tasarımın rozetleri de kısa ('8 aşama').
        $('#NavProcessBadge')
            .toggleClass('apya-chip-neutral', !t)
            .toggleClass('apya-chip-accent', !!t)
            .text(t ? l('Grants:Parameters:Process:StepCount', t.steps.length) : l('Grants:Parameters:Process:NoneShort'));
    }

    // ---------- Form ↔ DTO ----------
    function collect() {
        var sizes = 0;
        $('#ParamSizes .apya-choice.is-on').each(function () { sizes |= Number($(this).data('size')); });

        var tags = [];
        [0, 1, 2, 3].forEach(function (kind) {
            readTags(kind).forEach(function (v) { tags.push({ kind: kind, value: v }); });
        });

        var costItems = [];
        $('#ParamCostItems .apya-cost-tile.is-open').each(function () {
            var limit = $(this).find('.apya-cost-limit').val();
            costItems.push({
                kind: Number($(this).data('kind')),
                limitPercent: limit === '' || limit == null ? null : Number(limit)
            });
        });

        return {
            name: $('#ParamName').val(),
            issuer: $('#ParamIssuer').val(),
            description: $('#ParamSummary').val(),
            sourceUrl: $('#ParamSourceUrl').val(),
            eligibleCompanySizes: sizes,
            minCompanyAgeYears: num('#ParamMinAge'),
            maxCompanyAgeYears: num('#ParamMaxAge'),
            minTrl: trlMin,
            maxTrl: trlMax,
            minStaffCount: num('#ParamMinStaff'),
            minRdStaffCount: num('#ParamMinRdStaff'),
            minRevenue: num('#ParamMinRevenue'),
            maxRevenue: num('#ParamMaxRevenue'),
            requiresConsortium: $('#ParamConsortium').is(':checked'),
            minConsortiumPartners: num('#ParamMinPartners'),
            prefersFemaleEntrepreneur: $('#ParamPrefersFemale').is(':checked'),
            prefersYoungEntrepreneur: $('#ParamPrefersYoung').is(':checked'),
            criteriaTags: tags,
            maxAmount: num('#ParamMaxAmount'),
            supportRatePercent: num('#ParamSupportRate'),
            projectDurationMonths: num('#ParamDuration'),
            repaymentType: Number($('#ParamRepayment').val()),
            hasAdvancePayment: $('#ParamAdvance').is(':checked'),
            requiresGuaranteeLetter: $('#ParamGuarantee').is(':checked'),
            eligibleCostItems: costItems,
            documentRequirements: readDocuments(),
            stageTemplateId: $('#ParamStageTemplate').val() || null,
            minMatchScore: num('#ParamMinScore') || 0
        };
    }

    function fill(dto) {
        loading = true;

        $('#ParamName').val(dto.name || '');
        $('#ParamIssuer').val(dto.issuer || '');
        $('#ParamSummary').val(dto.description || '');
        $('#ParamSourceUrl').val(dto.sourceUrl || '');
        $('#ParamSourceUrlText').text(dto.sourceUrl || '');

        $('#ParamSizes .apya-choice').each(function () {
            $(this).toggleClass('is-on', (dto.eligibleCompanySizes & Number($(this).data('size'))) !== 0);
        });
        setNum('#ParamMinAge', dto.minCompanyAgeYears);
        setNum('#ParamMaxAge', dto.maxCompanyAgeYears);

        trlMin = dto.minTrl == null ? null : dto.minTrl;
        trlMax = dto.maxTrl == null ? trlMin : dto.maxTrl;
        paintTrl();

        setNum('#ParamMinStaff', dto.minStaffCount);
        setNum('#ParamMinRdStaff', dto.minRdStaffCount);
        setNum('#ParamMinRevenue', dto.minRevenue);
        setNum('#ParamMaxRevenue', dto.maxRevenue);
        setNum('#ParamMinScore', dto.minMatchScore);

        $('#ParamConsortium').prop('checked', !!dto.requiresConsortium);
        $('#ParamMinPartners').prop('disabled', !dto.requiresConsortium);
        setNum('#ParamMinPartners', dto.minConsortiumPartners);
        $('#ParamPrefersFemale').prop('checked', !!dto.prefersFemaleEntrepreneur);
        $('#ParamPrefersYoung').prop('checked', !!dto.prefersYoungEntrepreneur);

        $('.apya-tag-input .apya-tag-chips').empty();
        (dto.criteriaTags || []).forEach(function (t) {
            addTag($('.apya-tag-input[data-kind="' + t.kind + '"]'), t.value);
        });

        setNum('#ParamMaxAmount', dto.maxAmount);
        setNum('#ParamSupportRate', dto.supportRatePercent);
        setNum('#ParamDuration', dto.projectDurationMonths);
        $('#ParamRepayment').val(String(dto.repaymentType || 0));
        $('#ParamAdvance').prop('checked', !!dto.hasAdvancePayment);
        $('#ParamGuarantee').prop('checked', !!dto.requiresGuaranteeLetter);
        paintCoFinancing();

        var openKinds = {};
        (dto.eligibleCostItems || []).forEach(function (c) { openKinds[c.kind] = c.limitPercent; });
        $('#ParamCostItems .apya-cost-tile').each(function () {
            var kind = Number($(this).data('kind'));
            var open = Object.prototype.hasOwnProperty.call(openKinds, kind);
            $(this).toggleClass('is-open', open);
            $(this).find('.apya-cost-limit').val(open && openKinds[kind] != null ? openKinds[kind] : '');
            paintCostTile($(this));
        });

        var $docs = $('#ParamDocuments').empty();
        (dto.documentRequirements || []).forEach(function (d) { $docs.append(docRow(d)); });
        refreshDocMeta();

        $('#ParamStageTemplate').val(dto.stageTemplateId || '');
        paintStageMeta();

        $('#NavEligibilityBadge').text((dto.criteriaTags || []).length);
        $('#NavFinancialBadge').text((dto.eligibleCostItems || []).length);

        paintStatus(dto);
        loading = false;
        refreshPreview();
    }

    // Tamamlanma + eksik zorunlu alan + yayın kapısı; hem kayıt dönüşü hem canlı
    // önizleme aynı alanları taşıdığı için tek boyayıcı yeterli.
    function paintStatus(s) {
        $('#ParamCompletionText').text('%' + (s.completionPercent || 0));
        $('#ParamCompletionBar').css('width', (s.completionPercent || 0) + '%');

        var missing = s.missingRequiredFields || [];
        if (missing.length) {
            var names = missing.map(function (f) { return l('Grants:Field:' + f); }).join(' · ');
            $('#ParamMissingText')
                .removeClass('text-muted').addClass('text-warning')
                .text(l('Grants:Parameters:MissingRequired', missing.length) + ' — ' + names);
        } else {
            $('#ParamMissingText')
                .removeClass('text-warning').addClass('text-muted')
                .text(l('Grants:Parameters:AllRequiredFilled'));
        }

        var drafts = s.draftCallCount || 0;
        lastDraftCount = drafts;
        $('#ParamDraftInfo')
            .toggleClass('d-none', drafts === 0)
            .text(l('Grants:Parameters:DraftCallCount', drafts));

        $('#ParamPublishBtn')
            .prop('disabled', !s.canPublish)
            .attr('title', s.canPublish
                ? ''
                : (missing.length
                    ? l('Grants:Parameters:PublishBlocked', missing.length)
                    : l('Grants:Parameters:NoDraftCall')));
    }

    // ---------- Canlı eşleşme ----------
    function schedulePreview() {
        if (loading) { return; }
        clearTimeout(previewTimer);
        previewTimer = setTimeout(refreshPreview, 300);
    }

    function refreshPreview() {
        service.previewMatch(grantId, collect()).then(paintPreview);
    }

    function paintPreview(p) {
        paintStatus(p);

        $('#MatchCount').text(p.matchingFirms);
        $('#MatchTotal').text(l('Grants:Parameters:OfTotal', p.totalFirms));

        var $sizes = $('#MatchSizeBreakdown').empty();
        (p.sizeBreakdown || []).forEach(function (s) {
            var pct = p.totalFirms ? Math.round((s.count / p.totalFirms) * 100) : 0;
            $sizes.append(
                '<div class="apya-side-row"><span>' + esc(l('Grants:Size:' + sizeKeys[s.size])) +
                '</span><span class="apya-numeric">' + s.count + '</span></div>' +
                '<div class="apya-mini-bar"><span style="width:' + pct + '%"></span></div>');
        });

        var impactByRule = {};
        (p.ruleImpacts || []).forEach(function (i) { impactByRule[i.rule] = i; });
        $('.apya-field-impact').each(function () {
            var i = impactByRule[Number($(this).data('impact'))];
            var n = i ? i.eliminatedCount : 0;
            $(this)
                .text(i ? (n ? l('Grants:Parameters:EliminationImpact', n) : l('Grants:Parameters:NoImpact')) : '')
                .toggleClass('is-heavy', n > 0 && p.totalFirms > 0 && n / p.totalFirms >= 0.25);
        });

        var $top = $('#MatchTopRule').empty();
        if (p.topEliminatingRule === null || p.topEliminatingRule === undefined) {
            $top.append('<div class="apya-side-note apya-side-note--quiet">' +
                esc(l('Grants:Parameters:NoEliminatingRule')) + '</div>');
            return;
        }
        var top = impactByRule[p.topEliminatingRule];
        var ruleName = l('Grants:Rule:' + ruleKeys[p.topEliminatingRule]);
        var text = l('Grants:Parameters:EliminationWarning', ruleName, top.eliminatedCount);
        if (top.missingDataCount) {
            text += ' ' + l('Grants:Parameters:MissingDataNote', top.missingDataCount);
        }
        $top.append('<div class="apya-side-note"><i class="fa fa-triangle-exclamation mt-1"></i><span>' +
            esc(text) + '</span></div>');
    }

    // ---------- Kaydet / Yayınla ----------
    $('#ParamSaveBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.update(grantId, collect())
            .then(function (dto) {
                abp.notify.success(l('Grants:Parameters:Saved'));
                fill(dto);
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    $('#ParamPublishBtn').on('click', function () {
        // Yayınlanan çağrı sayısı işlemden SONRA sıfırlanır (taslak kalmaz) —
        // mesaj için önceki sayaç kullanılır.
        var published = lastDraftCount;
        $(this).prop('disabled', true);
        // Yayın kaydedilmiş değerlere göre çalışır — önce kaydet, sonra yayınla.
        service.update(grantId, collect())
            .then(function () { return service.publish(grantId); })
            .then(function (dto) {
                abp.notify.success(l('Grants:Parameters:Published', published));
                // Düğmenin yeni durumunu paintStatus belirler; burada elle açılmaz.
                fill(dto);
            })
            .fail(refreshPreview);
    });

    // Alan değişimlerinde canlı panel yenilensin (300ms debounce).
    $('.apya-param-sections').on('input change', 'input, select, textarea', schedulePreview);

    // ---------- Eşleştirme ağırlıkları özeti (4b'ye köprü) ----------
    function paintWeights(w) {
        $('#ParamWeightLink').attr('href', '/Grants/MatchWeights?id=' + w.grantId);
        // Rozet KISA hâli taşır: 236px'lik navda "bu programa özel" satır kaydırıyordu.
        $('#NavWeightsBadge')
            .toggleClass('apya-chip-neutral', w.isInherited)
            .toggleClass('apya-chip-accent', !w.isInherited)
            .text(w.isInherited ? l('Grants:Weights:InheritedShort') : l('Grants:Weights:OverriddenShort'));

        var $sum = $('#ParamWeightSummary').empty();
        (w.dimensions || []).forEach(function (d) {
            var off = d.multiplier === 0;
            var label = l('Grants:Dimension:' + dimensionKeys[d.dimension]) + ' ' +
                (off ? l('Grants:Weights:Off') : '×' + String(d.multiplier).replace('.', ','));
            $sum.append('<span class="apya-chip ' + (off ? 'apya-chip-neutral' : 'apya-chip-accent') +
                '">' + esc(label) + '</span>');
        });
    }

    weightService.get(grantId).then(paintWeights);

    // Şablon listesi önce yüklenir: seçim kutusu dolmadan fill() değeri atayamaz.
    templateService.getList().then(function (list) {
        stageTemplates = list || [];
        var $sel = $('#ParamStageTemplate');
        $sel.append($('<option>').val('').text(l('Grants:Parameters:Process:None')));
        stageTemplates.forEach(function (t) {
            $sel.append($('<option>').val(t.id).text(t.name));
        });
        return service.get(grantId).then(fill);
    });
});
