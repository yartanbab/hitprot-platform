$(function () {
    var service = apya.platform.grants.grantParameter;
    var templateService = apya.platform.grants.grantStageTemplate;
    var weightService = apya.platform.grants.grantMatchWeight;
    var l = abp.localization.getResource('Platform');
    var grantId = $('.apya-page').data('grant-id');

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
    function num(sel) {
        // Maskeli tutar alanında .val() "1.234,56" döndürür; Number() NaN verir.
        var el = $(sel)[0];
        if (el && el.__apyaMoney) { return apya.moneyInput.getValue(el); }
        var v = $(sel).val(); return v === '' || v == null ? null : Number(v);
    }
    function setNum(sel, v) {
        var el = $(sel)[0];
        if (el && el.__apyaMoney) { apya.moneyInput.setValue(el, v); return; }
        $(sel).val(v == null ? '' : v);
    }

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
    $('#ParamThematic').on('click', '.apya-choice', function () {
        $(this).toggleClass('is-on');
        schedulePreview();
    });

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

    // ---------- Sekme grubu (10b) ----------
    // Seçili sekme adreste (#eligibility) durur: kaydet sonrası yenilemede kullanıcı yerinde kalır.
    function showTab(name) {
        var $btn = $('.apya-param-tabs [data-tab="' + name + '"]');
        if (!$btn.length) {
            name = 'eligibility';
            $btn = $('.apya-param-tabs [data-tab="eligibility"]');
        }
        $('.apya-param-tabs [data-tab]').removeClass('is-active').attr('aria-selected', 'false');
        $btn.addClass('is-active').attr('aria-selected', 'true');
        $('.apya-param-panel').each(function () {
            $(this).prop('hidden', $(this).data('panel') !== name);
        });
        try { history.replaceState(null, '', '#' + name); } catch (e) { /* yoksay */ }
    }

    $('.apya-param-tabs').on('click', '[data-tab]', function () { showTab($(this).data('tab')); });
    showTab((window.location.hash || '').replace('#', ''));

    // ---------- Şart kartları (10b) ----------
    // Kart = şartın tek satırlık özeti; tıklayınca altındaki alan açılır (11c "dolu alan tek
    // satır özet"). Kart GÖRÜNÜR: şart konmuşsa ya da editörü açıksa. Konmamış şartlar
    // "Şart ekle" menüsünde durur. Özet metni formun GÜNCEL değerinden kurulur (kaydetmeden).
    var SOURCE = { Metinden: 0, Elle: 1, MetindenFarkli: 2, OnayBekliyor: 3 };
    var ruleSources = {};   // GrantEligibilityRule → GrantRuleSourceDto (son kayda göre)
    var lastImpacts = {};   // GrantEligibilityRule → GrantRuleImpactDto (canlı önizleme)
    var lastTotal = 0;
    var openRows = {};      // kart anahtarı → editörü açık mı

    function tagValues(s, kind) {
        return (s.criteriaTags || []).filter(function (t) { return t.kind === kind; })
            .map(function (t) { return t.value; });
    }

    function listText(values) {
        var shown = values.slice(0, 3).join(' · ');
        return values.length > 3 ? shown + ' ' + l('Grants:Parameters:Value:More', values.length - 3) : shown;
    }

    function rangeText(min, max, prefix, fmt) {
        fmt = fmt || function (x) { return x; };
        if (min != null && max != null) { return l(prefix + 'Range', fmt(min), fmt(max)); }
        if (min != null) { return l(prefix + 'Min', fmt(min)); }
        return l(prefix + 'Max', fmt(max));
    }

    function moneyText(v) { return Math.round(v).toLocaleString('tr-TR'); }

    // rule: GrantEligibilityRule (firmayı ELEYEN şartlar) · null: yalnız uyum puanını etkiler.
    var RULES = [
        { key: 'size', rule: 0, label: 'Grants:Parameters:CompanySizes',
          isSet: function (s) { return s.eligibleCompanySizes !== 0; },
          text: function (s) {
              return [1, 2, 4, 8].filter(function (x) { return (s.eligibleCompanySizes & x) !== 0; })
                  .map(function (x) { return l('Grants:Size:' + sizeKeys[x]); }).join(', ');
          } },
        { key: 'age', rule: 1, label: 'Grants:Parameters:CompanyAge',
          isSet: function (s) { return s.minCompanyAgeYears != null || s.maxCompanyAgeYears != null; },
          text: function (s) { return rangeText(s.minCompanyAgeYears, s.maxCompanyAgeYears, 'Grants:Parameters:Value:Years'); } },
        { key: 'trl', rule: 2, label: 'Grants:Parameters:Trl',
          isSet: function (s) { return s.minTrl != null; },
          text: function (s) {
              return s.maxTrl != null && s.maxTrl !== s.minTrl
                  ? l('Grants:Parameters:Value:TrlRange', s.minTrl, s.maxTrl)
                  : l('Grants:Parameters:Value:Trl', s.minTrl);
          } },
        { key: 'staff', rule: 3, label: 'Grants:Parameters:StaffCount',
          isSet: function (s) { return s.minStaffCount != null; },
          text: function (s) { return l('Grants:Parameters:Value:PeopleMin', s.minStaffCount); } },
        { key: 'rdstaff', rule: 4, label: 'Grants:Parameters:RdStaffCount',
          isSet: function (s) { return s.minRdStaffCount != null; },
          text: function (s) { return l('Grants:Parameters:Value:PeopleMin', s.minRdStaffCount); } },
        { key: 'revenue', rule: 5, label: 'Grants:Parameters:Revenue',
          isSet: function (s) { return s.minRevenue != null || s.maxRevenue != null; },
          text: function (s) { return rangeText(s.minRevenue, s.maxRevenue, 'Grants:Parameters:Value:Money', moneyText); } },
        { key: 'consortium', rule: 6, label: 'Grants:Rule:Consortium',
          isSet: function (s) { return !!s.requiresConsortium; },
          text: function (s) {
              return s.minConsortiumPartners
                  ? l('Grants:Parameters:Value:ConsortiumPartners', s.minConsortiumPartners)
                  : l('Grants:Parameters:Value:Consortium');
          } },
        { key: 'nace', rule: null, label: 'Grants:Parameters:Nace',
          isSet: function (s) { return tagValues(s, 3).length > 0; },
          text: function (s) { return listText(tagValues(s, 3)); } },
        { key: 'sector', rule: null, label: 'Grants:Parameters:Sector',
          isSet: function (s) { return tagValues(s, 0).length > 0; },
          text: function (s) { return listText(tagValues(s, 0)); } },
        { key: 'region', rule: null, label: 'Grants:Parameters:Region',
          isSet: function (s) { return tagValues(s, 1).length > 0; },
          text: function (s) { return listText(tagValues(s, 1)); } },
        { key: 'keyword', rule: null, label: 'Grants:Parameters:Keyword',
          isSet: function (s) { return tagValues(s, 2).length > 0; },
          text: function (s) { return listText(tagValues(s, 2)); } },
        { key: 'thematic', rule: null, label: 'Grants:Parameters:Thematic',
          isSet: function (s) { return tagValues(s, 4).length > 0; },
          text: function (s) {
              return listText(tagValues(s, 4).map(function (v) { return l('Grants:Thematic:' + v); }));
          } },
        { key: 'priority', rule: null, label: 'Grants:Parameters:Priorities',
          isSet: function (s) { return s.prefersFemaleEntrepreneur || s.prefersYoungEntrepreneur; },
          text: function (s) {
              var parts = [];
              if (s.prefersFemaleEntrepreneur) { parts.push(l('Grants:Parameters:PrefersFemale')); }
              if (s.prefersYoungEntrepreneur) { parts.push(l('Grants:Parameters:PrefersYoung')); }
              return parts.join(' · ');
          } },
        { key: 'minscore', rule: null, label: 'Grants:Parameters:MinMatchScore',
          isSet: function (s) { return s.minMatchScore > 0; },
          text: function (s) { return l('Grants:Parameters:Value:MinScore', s.minMatchScore); } }
    ];

    function ruleDef(rule) { return RULES.filter(function (r) { return r.rule === rule; })[0]; }

    function setSources(dto) {
        ruleSources = {};
        (dto.ruleSources || []).forEach(function (s) { ruleSources[s.rule] = s; });
    }

    // Satır başına TEK sinyal: çelişki > onay bekliyor > eksik veri > kaynak.
    function paintSource($row, r) {
        var src = r.rule == null ? null : ruleSources[r.rule];
        var impact = r.rule == null ? null : lastImpacts[r.rule];
        var tone = '', icon = '', text = '';

        if (src && src.source === SOURCE.MetindenFarkli) {
            tone = 'is-conflict'; icon = 'fa-code-compare'; text = l('Grants:Parameters:Source:Conflict');
        } else if (src && src.source === SOURCE.OnayBekliyor) {
            tone = 'is-suggest'; icon = 'fa-wand-magic-sparkles'; text = l('Grants:Parameters:Source:Pending');
        } else if (impact && impact.missingDataCount > 0) {
            tone = 'is-attention'; icon = 'fa-circle-exclamation';
            text = l('Grants:Parameters:Source:MissingData', impact.missingDataCount);
        } else if (src && src.source === SOURCE.Metinden) {
            text = l('Grants:Parameters:Source:Text');
        } else if (r.rule != null) {
            text = l('Grants:Parameters:Source:Manual');
        }

        $row.removeClass('is-conflict is-suggest is-attention').addClass(tone);
        $row.find('[data-rule-source]').html(
            (icon ? '<i class="fa ' + icon + '" aria-hidden="true"></i>' : '') + esc(text));
    }

    function paintImpact($row, r, maxImpact) {
        var $imp = $row.find('[data-rule-impact]').removeClass('is-score is-medium is-heavy');
        var $bar = $imp.find('.apya-rule-bar > span');

        if (r.rule == null) {
            $imp.addClass('is-score').find('.apya-rule-impact-text').text(l('Grants:Parameters:Impact:Score'));
            $bar.css('width', 0);
            return;
        }

        var i = lastImpacts[r.rule];
        var n = i ? i.eliminatedCount : null;
        // Eşik firma SAYISI değil PAYI: kiracı sayısı büyüdükçe mutlak eşik anlamını yitirir.
        var share = n && lastTotal ? n / lastTotal : 0;
        $imp.toggleClass('is-heavy', share >= 0.25).toggleClass('is-medium', share >= 0.12 && share < 0.25);
        $imp.find('.apya-rule-impact-text').text(
            n == null ? '—' : n === 0 ? l('Grants:Parameters:Impact:None') : l('Grants:Parameters:Impact:Firms', n));
        $bar.css('width', maxImpact && n ? Math.round((n / maxImpact) * 100) + '%' : 0);
    }

    function paintRules() {
        var s = collect();
        s.minTrl = trlMin;
        s.maxTrl = trlMax;

        var maxImpact = 0;
        RULES.forEach(function (r) {
            var i = r.rule == null ? null : lastImpacts[r.rule];
            if (i && i.eliminatedCount > maxImpact) { maxImpact = i.eliminatedCount; }
        });

        var visible = 0;
        var addable = [];
        RULES.forEach(function (r) {
            var $row = $('.apya-rule[data-rule-key="' + r.key + '"]');
            var set = r.isSet(s);
            var show = set || !!openRows[r.key];
            $row.prop('hidden', !show);
            if (!show) {
                addable.push(r);
                return;
            }
            visible++;
            $row.find('[data-rule-value]')
                .text(set ? r.text(s) : l('Grants:Parameters:Value:NotSet'))
                .toggleClass('is-empty', !set);
            paintSource($row, r);
            paintImpact($row, r, maxImpact);
        });

        $('#NavEligibilityBadge').text(visible);
        paintAddMenu(addable);
        paintConflicts(s);
    }

    function toggleRow($row, open) {
        var key = $row.data('rule-key');
        if (open) { openRows[key] = true; } else { delete openRows[key]; }
        $row.toggleClass('is-open', open);
        $row.find('.apya-rule-summary').attr('aria-expanded', open ? 'true' : 'false');
        $row.find('.apya-rule-editor').prop('hidden', !open);
    }

    $('#RuleList').on('click', '.apya-rule-summary', function () {
        var $row = $(this).closest('.apya-rule');
        toggleRow($row, !$row.hasClass('is-open'));
        paintRules();
    });

    function paintAddMenu(addable) {
        var $menu = $('#RuleAddMenu').empty();
        if (!addable.length) {
            $menu.append('<li><span class="dropdown-item-text">' + esc(l('Grants:Parameters:AddRule:Empty')) + '</span></li>');
            return;
        }
        addable.forEach(function (r) {
            $menu.append('<li><button type="button" class="dropdown-item" data-add-rule="' + r.key + '">' +
                esc(l(r.label)) + '</button></li>');
        });
    }

    $('#RuleAddMenu').on('click', '[data-add-rule]', function () {
        var $row = $('.apya-rule[data-rule-key="' + $(this).data('add-rule') + '"]');
        toggleRow($row, true);
        paintRules();
        if ($row[0] && $row[0].scrollIntoView) { $row[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        $row.find('.apya-rule-editor').find('input:not([disabled]), button').first().trigger('focus');
    });

    // ---------- Çelişki: resmî metin ↔ program değeri ----------
    function paintConflicts(s) {
        var $box = $('#RuleConflicts').empty();
        Object.keys(ruleSources).forEach(function (k) {
            var src = ruleSources[k];
            var def = ruleDef(src.rule);
            if (!def || src.source !== SOURCE.MetindenFarkli || !src.sourceValues) { return; }

            // Metindeki değer, programın değeriyle AYNI biçimlendiriciden geçer.
            var v = src.sourceValues;
            var fromText = {
                eligibleCompanySizes: v.eligibleCompanySizes, minCompanyAgeYears: v.minCompanyAgeYears,
                maxCompanyAgeYears: null, minTrl: v.minTrl, maxTrl: v.maxTrl,
                minRdStaffCount: v.minRdStaffCount, requiresConsortium: v.requiresConsortium, minConsortiumPartners: null
            };
            var textValue = def.isSet(fromText) ? def.text(fromText) : l('Grants:Parameters:Value:NotSet');
            var current = def.isSet(s) ? def.text(s) : l('Grants:Parameters:Value:NotSet');

            $box.append(
                '<div class="apya-rule-conflict" role="status">' +
                '<i class="fa fa-code-compare" aria-hidden="true"></i>' +
                '<div class="apya-rule-conflict-text"><strong>' + esc(l('Grants:Parameters:Conflict:Title')) + '</strong> ' +
                esc(l('Grants:Parameters:Conflict:Text', l(def.label), textValue, current)) + '</div>' +
                '<div class="apya-rule-conflict-actions">' +
                '<button type="button" class="btn btn-danger apya-conflict-apply" data-rule="' + src.rule + '">' +
                esc(l('Grants:Parameters:Conflict:Apply')) + '</button>' +
                '<button type="button" class="btn btn-outline-secondary apya-conflict-keep" data-rule="' + src.rule + '">' +
                esc(l('Grants:Parameters:Conflict:Keep')) + '</button>' +
                '</div></div>');
        });
    }

    // Metne dönülen şartın alanları sunucunun geri yazdığı değerle doldurulur. Formun kalanı
    // YENİDEN YÜKLENMEZ: kaydedilmemiş başka değişiklikler kaybolmasın.
    function setRuleFromDto(rule, dto) {
        switch (rule) {
            case 0:
                $('#ParamSizes .apya-choice').each(function () {
                    $(this).toggleClass('is-on', (dto.eligibleCompanySizes & Number($(this).data('size'))) !== 0);
                });
                break;
            case 1:
                setNum('#ParamMinAge', dto.minCompanyAgeYears);
                break;
            case 2:
                trlMin = dto.minTrl == null ? null : dto.minTrl;
                trlMax = dto.maxTrl == null ? trlMin : dto.maxTrl;
                paintTrl();
                break;
            case 4:
                setNum('#ParamMinRdStaff', dto.minRdStaffCount);
                break;
            case 6:
                $('#ParamConsortium').prop('checked', !!dto.requiresConsortium);
                $('#ParamMinPartners').prop('disabled', !dto.requiresConsortium);
                break;
        }
    }

    $('#RuleConflicts').on('click', '.apya-conflict-apply, .apya-conflict-keep', function () {
        var rule = Number($(this).data('rule'));
        var toText = $(this).hasClass('apya-conflict-apply');
        var $buttons = $(this).closest('.apya-rule-conflict').find('button').prop('disabled', true);

        (toText ? service.applySourceValue(grantId, rule) : service.keepOwnValue(grantId, rule))
            .then(function (dto) {
                if (toText) { setRuleFromDto(rule, dto); }
                setSources(dto);
                paintRules();
                if (toText) { schedulePreview(); }
            })
            .always(function () { $buttons.prop('disabled', false); });
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
        $('#ParamThematic .apya-choice.is-on').each(function () {
            tags.push({ kind: 4, value: String($(this).data('area')) });
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
        $('#ParamTitle').text(dto.name || '');
        $('#ParamIssuerText').text(dto.issuer || '');
        paintLead(dto);
        setSources(dto);
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
        // Tematik alan sabit listeden seçilir; serbest metin kutusu yoktur.
        var thematic = (dto.criteriaTags || [])
            .filter(function (t) { return t.kind === 4; })
            .map(function (t) { return t.value; });
        $('#ParamThematic .apya-choice').each(function () {
            $(this).toggleClass('is-on', thematic.indexOf(String($(this).data('area'))) >= 0);
        });
        (dto.criteriaTags || []).filter(function (t) { return t.kind !== 4; }).forEach(function (t) {
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

        $('#NavFinancialBadge').text((dto.eligibleCostItems || []).length);

        paintStatus(dto);
        paintRules();
        loading = false;
        refreshPreview();
    }

    // Başlık cümlesi: resmî metinden kaç alan okundu, kaçı onay bekliyor + şartların etkisi.
    function paintLead(dto) {
        var read = dto.draftFieldCount || 0;
        var pending = dto.draftPendingCount || 0;
        var lead = read === 0 ? ''
            : (pending ? l('Grants:Parameters:Lead:Read', read, pending) : l('Grants:Parameters:Lead:ReadApproved', read)) + ' ';
        $('#ParamLead').text(lead + l('Grants:Parameters:Lead:Hint'));
    }

    $('#ParamName').on('input', function () { $('#ParamTitle').text($(this).val()); });
    $('#ParamIssuer').on('input', function () { $('#ParamIssuerText').text($(this).val()); });

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
        // Kart özeti beklemeden güncellenir; firma sayıları 300ms sonra sunucudan gelir.
        paintRules();
        clearTimeout(previewTimer);
        previewTimer = setTimeout(refreshPreview, 300);
    }

    function refreshPreview() {
        service.previewMatch(grantId, collect()).then(paintPreview);
    }

    function paintPreview(p) {
        paintStatus(p);

        $('#MatchCount').text(p.matchingFirms);
        $('#MatchTotal').text(l('Grants:Parameters:MatchOf', p.totalFirms));
        $('#MatchBar').css('width', p.totalFirms ? Math.round((p.matchingFirms / p.totalFirms) * 100) + '%' : 0);

        // En çok eleyen şart ayrı bir kutuda değil, kartların etki sütununda görünür (10b).
        lastTotal = p.totalFirms || 0;
        lastImpacts = {};
        (p.ruleImpacts || []).forEach(function (i) { lastImpacts[i.rule] = i; });
        paintRules();
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
    $('.apya-param-panels').on('input change', 'input, select, textarea', schedulePreview);

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
