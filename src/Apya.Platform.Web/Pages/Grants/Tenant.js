$(function () {
    var profileSvc = apya.platform.grants.firmProfile;
    var recoSvc = apya.platform.grants.grantRecommendation;
    var appSvc = apya.platform.grants.grantApplication;
    var interestSvc = apya.platform.grants.grantInterest;
    var l = abp.localization.getResource('Platform');

    var interestModal = new bootstrap.Modal(document.getElementById('InterestModal'));
    var interestCallId = null;

    var stageLabels = { 0: 'Başvuru', 1: 'Değerlendirme', 2: 'Onay', 3: 'Ödeme' };
    var stageTone = { 0: 'neutral', 1: 'warning', 2: 'positive', 3: 'ai' };
    var trancheStatusLabels = { 0: 'Planlandı', 1: 'Talep Edildi', 2: 'Ödendi' };

    // GrantEligibilityRule enum sırasıyla birebir.
    var ruleKeys = ['CompanySize', 'CompanyAge', 'Trl', 'StaffCount', 'RdStaffCount', 'Revenue', 'Consortium'];

    var feed = [];
    var activeTab = 'eligible';

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v != null ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    // Tavan belirtilmemiş program 0 ile saklanır (MaxAmount kolonu NOT NULL) — "0 ₺" yerine — göster.
    function ceiling(v) { return v ? money(v) : '—'; }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

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
    function getTags(kind) {
        return $('.apya-tag-input[data-kind="' + kind + '"] .apya-tag-chip')
            .map(function () { return $(this).contents().first().text().trim(); }).get();
    }
    function setTags(kind, values) {
        var $input = $('.apya-tag-input[data-kind="' + kind + '"]');
        $input.find('.apya-tag-chips').empty();
        (values || []).forEach(function (v) { addTag($input, v); });
    }

    $(document).on('keydown', '.apya-tag-entry', function (e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag($(this).closest('.apya-tag-input'), $(this).val());
            $(this).val('');
        }
    });
    $(document).on('blur', '.apya-tag-entry', function () {
        addTag($(this).closest('.apya-tag-input'), $(this).val());
        $(this).val('');
    });
    $(document).on('click', '.apya-tag-remove', function () {
        $(this).closest('.apya-tag-chip').remove();
    });

    // ---------- Profil ----------
    function num(sel) {
        // Maskeli tutar alanında .val() "1.234,56" döndürür; Number() NaN verir.
        var el = $(sel)[0];
        if (el && el.__apyaMoney) { return apya.moneyInput.getValue(el); }
        var v = $(sel).val(); return v === '' || v == null ? null : Number(v);
    }

    // Kurum türü formu ikiye ayırır: şirket alanları ile STK alanları asla birlikte
    // görünmez. Görünmeyen grubun değerini sunucu zaten temizler (FirmProfileAppService.Apply),
    // burada yalnız görünürlük yönetilir.
    function applyOrgType(type) {
        var isNgo = type !== 0;
        $('[data-org-group="company"]').toggleClass('d-none', isNgo);
        $('[data-org-group="ngo"]').toggleClass('d-none', !isNgo);
    }

    function setThematic(values) {
        $('#ProfileThematic .apya-choice').each(function () {
            $(this).toggleClass('is-on', values.indexOf(String($(this).data('area'))) >= 0);
        });
    }

    function getThematic() {
        return $('#ProfileThematic .apya-choice.is-on').map(function () {
            return String($(this).data('area'));
        }).get();
    }

    $('#ProfileThematic').on('click', '.apya-choice', function () {
        $(this).toggleClass('is-on');
    });

    $('#ProfileOrgType').on('change', function () {
        applyOrgType(Number($(this).val()));
    });

    function paintProfile(p) {
        $('#ProfileCompleteText').text(l('Grants:Feed:Profile:Complete', p.completionPercent));
        $('#ProfileBar').css('width', p.completionPercent + '%');
        $('#ProfileMissingChip')
            .toggleClass('d-none', p.missingFieldCount === 0)
            .text(l('Grants:Feed:Profile:Missing', p.missingFieldCount));
        // Eksik alan sayısı, "koşullu" kovadaki çağrı sayısıyla doğrudan ilişkili:
        // profil dolunca o çağrılar ölçülebilir hâle gelir.
        var conditional = feed.filter(function (r) { return r.bucket === 1; }).length;
        $('#ProfileGain').text(p.missingFieldCount === 0
            ? l('Grants:Feed:Profile:Full')
            : l('Grants:Feed:Profile:Gain', conditional));

        var type = p.type || 0;
        $('#ProfileOrgType').val(String(type));
        applyOrgType(type);

        $('#ProfileSize').val(p.size == null ? '' : String(p.size));
        $('#ProfileFoundedOn').val(p.foundedOn ? p.foundedOn.substring(0, 10) : '');
        $('#ProfileStaff').val(p.staffCount == null ? '' : p.staffCount);
        $('#ProfileRdStaff').val(p.rdStaffCount == null ? '' : p.rdStaffCount);
        apya.moneyInput.setValue($('#ProfileRevenue')[0], p.annualRevenue);
        $('#ProfileTrl').val(p.trl == null ? '' : p.trl);
        $('#ProfileConsortium').val(p.hasConsortiumPartner == null ? '' : String(p.hasConsortiumPartner));

        $('#ProfileRegistryNo').val(p.registryNumber || '');
        $('#ProfileTaxNo').val(p.taxNumber || '');
        $('#ProfileTaxOffice').val(p.taxOffice || '');
        // Bantlarda 0 geçerli bir değerdir (proje deneyimi "yok"), bu yüzden == null.
        $('#ProfileStaffBand').val(p.professionalStaffBand == null ? '' : String(p.professionalStaffBand));
        $('#ProfileExperience').val(p.projectExperience == null ? '' : String(p.projectExperience));

        [0, 1, 2, 3].forEach(function (kind) {
            setTags(kind, (p.tags || []).filter(function (t) { return t.kind === kind; })
                .map(function (t) { return t.value; }));
        });
        setThematic((p.tags || []).filter(function (t) { return t.kind === 4; })
            .map(function (t) { return t.value; }));
    }

    $('#ProfileToggleBtn').on('click', function () {
        $('#ProfileEditor').toggleClass('d-none');
    });

    $('#SaveProfileBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        var consortium = $('#ProfileConsortium').val();
        var tags = [];
        [0, 1, 2, 3].forEach(function (kind) {
            getTags(kind).forEach(function (v) { tags.push({ kind: kind, value: v }); });
        });
        getThematic().forEach(function (v) { tags.push({ kind: 4, value: v }); });

        // İki grubun alanları da gönderilir; sunucu türe göre karşı grubu temizler.
        profileSvc.updateMyProfile({
            type: Number($('#ProfileOrgType').val()),
            size: num('#ProfileSize'),
            foundedOn: $('#ProfileFoundedOn').val() || null,
            staffCount: num('#ProfileStaff'),
            rdStaffCount: num('#ProfileRdStaff'),
            annualRevenue: num('#ProfileRevenue'),
            trl: num('#ProfileTrl'),
            hasConsortiumPartner: consortium === '' ? null : consortium === 'true',
            registryNumber: $('#ProfileRegistryNo').val() || null,
            taxNumber: $('#ProfileTaxNo').val() || null,
            taxOffice: $('#ProfileTaxOffice').val() || null,
            professionalStaffBand: num('#ProfileStaffBand'),
            projectExperience: num('#ProfileExperience'),
            tags: tags
        }).then(function () {
            abp.notify.success(l('Grants:Sources:Saved'));
            // Profil değişince eşleşme de değişir — akışı yeniden kur.
            return load();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- Sekmeler ----------
    $('.apya-tenant-tab[data-tab]').on('click', function () {
        activeTab = $(this).data('tab');
        $('.apya-tenant-tab').removeClass('is-active');
        $(this).addClass('is-active');
        paintFeed();
    });

    // ---------- Takvim şeridi (90 gün) ----------
    // Konum son tarihle orantılıdır; ancak son tarihi aynı ya da birbirine yakın
    // çağrılar aynı yüzdeye düşüp etiketleri üst üste bindiriyordu. Orantılı
    // konum hesaplandıktan sonra soldan sağa tek geçişte etiket genişliği kadar
    // asgari aralık zorlanıyor: sıra ve yaklaşık orantı korunuyor, çakışma bitiyor.
    function paintTimeline() {
        var horizon = 90;
        var points = feed
            .filter(function (r) { return r.daysRemaining != null && r.daysRemaining >= 0 && r.daysRemaining <= horizon; })
            .sort(function (a, b) { return a.daysRemaining - b.daysRemaining; })
            .slice(0, 6);

        var $t = $('#Timeline').empty();
        $('#TimelineEmpty').toggleClass('d-none', points.length > 0);
        $t.toggleClass('d-none', points.length === 0);
        if (points.length === 0) { return; }

        // Etiket kutusu en fazla 132px; şerit dar olduğunda pay eşit bölünür, bu
        // sayede son nokta da sağ kenarın içinde kalır (kanıt: half + (n-1)*slot
        // <= width - half, çünkü slot <= width / n).
        var width = $t.width() || 640;
        var slot = Math.min(132, width / points.length);
        var half = slot / 2;
        var cursor = half;

        points.forEach(function (r) {
            var x = Math.max(cursor, Math.min(width - half, (r.daysRemaining / horizon) * width));
            cursor = x + slot;
            // <20 gün kırmızı · 20-40 sarı · 40+ accent.
            var tone = r.daysRemaining < 20 ? 'is-urgent' : r.daysRemaining <= 40 ? 'is-soon' : '';
            $t.append(
                '<a class="apya-timeline-point" style="left:' + ((x / width) * 100).toFixed(2) + '%;width:' +
                Math.floor(slot) + 'px" href="/Grants/Detail?id=' + r.grantCallId + '">' +
                '<span class="apya-timeline-label">' + esc(r.grantName) + '</span>' +
                '<span class="apya-timeline-date">' + esc(fmtDate(r.deadline)) + '</span>' +
                '<span class="apya-timeline-dot ' + tone + '"></span></a>');
        });
    }

    // Şerit genişliği değişince (pencere, kenar çubuğu) asgari aralık yeniden
    // hesaplanmalı — yoksa daralan şeritte çakışma geri gelir.
    var timelineResizeTimer;
    $(window).on('resize', function () {
        clearTimeout(timelineResizeTimer);
        timelineResizeTimer = setTimeout(paintTimeline, 150);
    });

    // ---------- Kart akışı ----------
    function ruleText(rule) { return l('Grants:Rule:' + ruleKeys[rule]); }

    // GrantInterestStatus enum sırasıyla birebir.
    var interestKeys = ['Yeni', 'Inceleniyor', 'BasvuruAcildi', 'UygunDegil'];
    var interestTone = ['neutral', 'neutral', 'positive', 'negative'];

    /// Kartın eylem alanı. Kiracı başvuruyu kendi açmaz: ilgi bildirir, host karar verir.
    /// Süren talepte düğme yerine durum rozeti çıkar; uygun bulunmayan talep yeniden bildirilebilir.
    function interestCta(r) {
        var st = r.interestStatus;

        if (r.alreadyApplied || st === 2) {
            return '<span class="apya-chip apya-chip-positive">' +
                esc(l('Grants:Interest:Status:BasvuruAcildi')) + '</span>';
        }
        if (st === 0 || st === 1) {
            return '<span class="apya-chip apya-chip-' + interestTone[st] + '">' +
                esc(l('Grants:Interest:Status:' + interestKeys[st])) + '</span>';
        }
        if (r.score >= 65) {
            return '<button type="button" class="btn btn-sm btn-primary apya-interest-btn" data-id="' +
                r.grantCallId + '">' +
                esc(l(st === 3 ? 'Grants:Interest:ExpressAgain' : 'Grants:Interest:Express')) + '</button>';
        }
        return '<a class="btn btn-sm btn-outline-secondary" href="/Grants/Detail?id=' + r.grantCallId + '">' +
            esc(l('Grants:Feed:Card:WhyNot')) + '</a>';
    }

    function feedCard(r) {
        var chips = '<span class="apya-chip apya-numeric apya-chip-' + (r.score >= 65 ? 'positive' : 'neutral') + '">%' + r.score + '</span>';
        if (r.isHostRecommended) {
            chips += '<span class="apya-chip apya-chip-brand">' + esc(l('Grants:Feed:Card:HostRecommended')) + '</span>';
        }

        // "Neden uygun" — kanıtlı sağlanan şartlardan en fazla üçü.
        var reasons = (r.passedRules || []).slice(0, 3).map(function (rule) {
            return '<span class="apya-feed-reason is-good"><i class="fa fa-check"></i>' + esc(ruleText(rule)) + '</span>';
        }).join('');
        (r.unknownRules || []).slice(0, 2).forEach(function (rule) {
            reasons += '<span class="apya-feed-reason is-missing"><i class="fa fa-circle-exclamation"></i>' +
                esc(l('Grants:RuleMissing', ruleText(rule))) + '</span>';
        });
        (r.failedRules || []).slice(0, 2).forEach(function (rule) {
            reasons += '<span class="apya-feed-reason is-bad"><i class="fa fa-xmark"></i>' +
                esc(reasonSentence(r, rule)) + '</span>';
        });

        var days = r.daysRemaining == null ? ''
            : r.daysRemaining < 0 ? '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Feed:Card:Closed')) + '</span>'
            : '<span class="apya-chip apya-chip-' + (r.daysRemaining < 20 ? 'negative' : r.daysRemaining <= 40 ? 'warning' : 'neutral') +
              '">' + esc(l('Grants:Feed:Card:DaysLeft', r.daysRemaining)) + '</span>';

        var cta = interestCta(r);

        return '<div class="apya-feed-card">' +
            '<div class="apya-feed-head">' +
            '<span class="apya-feed-icon"><i class="fa fa-award"></i></span>' +
            '<div class="flex-grow-1 min-w-0">' +
            '<a class="apya-feed-title text-decoration-none d-block" href="/Grants/Detail?id=' + r.grantCallId + '">' +
            esc(r.grantName) + '</a>' +
            '<span class="apya-feed-issuer">' + esc(r.issuer) + ' · ' + esc(r.period) + '</span></div>' +
            '<div class="d-flex flex-column align-items-end gap-1">' + chips + '</div>' +
            '</div>' +
            '<div class="apya-feed-amount"><span class="small text-muted">' + esc(l('Grants:Parameters:MaxAmount')) + '</span>' +
            '<span class="apya-feed-amount-value">' + esc(ceiling(r.maxAmount)) +
            (r.supportRatePercent != null ? ' · %' + r.supportRatePercent : '') + '</span></div>' +
            (reasons ? '<div class="apya-feed-reasons">' + reasons + '</div>' : '') +
            '<div class="apya-feed-foot">' +
            '<div class="d-flex align-items-center gap-1">' + days +
            '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Detail:Difficulty')) + ' ' +
            r.difficulty + '/5</span></div>' + cta +
            '</div></div>';
    }

    /// Eleyen şartın tek satırlık gerekçesi — değerler sunucudan, cümle burada kurulur.
    function reasonSentence(r, rule) {
        var firmValue = r.reasonRule === rule ? (r.reasonFirmValue || '—') : '—';
        var grantValue = r.reasonRule === rule ? (r.reasonGrantValue || '—') : '—';
        return l('Grants:RuleReason:' + ruleKeys[rule], firmValue, grantValue);
    }

    function paintFeed() {
        var items = activeTab === 'bookmarked'
            ? feed.filter(function (r) { return r.isBookmarked; })
            : feed.filter(function (r) { return r.isRecommended; });

        // İskelet `:empty` kuralıyla çiziliyor; sonuç boş gelince kap boş kalır ve
        // iskelet sonsuza dek parlamaya devam ederdi (boş durum metniyle yan yana).
        // Veri geldiği anda sınıfı düşür.
        $('#FeedGrid').removeClass('apya-skel-cards').html(items.map(feedCard).join(''));
        $('#FeedEmpty').toggleClass('d-none', items.length > 0 || activeTab === 'bookmarked');
        $('#BookmarkEmpty').toggleClass('d-none', items.length > 0 || activeTab !== 'bookmarked');

        paintTimeline();
    }

    $('#FeedGrid').on('click', '.apya-interest-btn', function () {
        interestCallId = $(this).data('id');

        // Program adı kartın kendisinden değil veriden okunur: tırnak içeren bir ad
        // data- özniteliğinde markup'ı kırardı.
        var row = feed.filter(function (r) { return r.grantCallId === interestCallId; })[0];
        $('#InterestCallName').text(row ? row.grantName : '');
        $('#InterestNote').val('');
        interestModal.show();
    });

    $('#InterestForm').on('submit', function (e) {
        e.preventDefault();
        if (!interestCallId) { return; }

        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        interestSvc.express({ grantCallId: interestCallId, note: $('#InterestNote').val() })
            .then(function () {
                interestModal.hide();
                abp.notify.success(l('Grants:Interest:Toast'));
                return load();
            })
            .always(function () { $submit.prop('disabled', false); });
    });

    // ---------- Başvurularım ----------
    function loadApplications() {
        return appSvc.getMyApplications().then(function (items) {
            var $l = $('#AppsList').empty();
            $('#AppsEmpty').toggleClass('d-none', items.length > 0);
            items.forEach(function (a) {
                var tone = stageTone[a.stage] || 'neutral';
                var detail = (a.tranches || []).map(function (t) {
                    return '<div>#' + t.sequenceNo + ' · ' + money(t.amount) + ' · ' +
                        trancheStatusLabels[t.status] + ' · ' + fmtDate(t.dueDate) + '</div>';
                }).concat((a.milestones || []).map(function (m) {
                    return '<div>' + esc(m.title) + ' · ' + (m.isCompleted ? 'Tamamlandı' : 'Bekliyor') +
                        ' · ' + fmtDate(m.dueDate) + '</div>';
                })).join('');
                $l.append(
                    '<div class="card"><div class="card-body py-2">' +
                    '<div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">' +
                    '<div><span class="fw-semibold">' + esc(a.grantName || '-') + '</span> ' +
                    '<span class="text-muted small">' + esc(a.period || '') + '</span></div>' +
                    '<div class="d-flex align-items-center gap-2">' +
                    (a.approvedAmount != null
                        ? '<span class="apya-numeric small fw-semibold">' + money(a.approvedAmount) + '</span>' : '') +
                    '<span class="apya-chip apya-chip-' + tone + '">' + (stageLabels[a.stage] || '') + '</span>' +
                    '<span class="text-muted small">' + fmtDate(a.appliedDate) + '</span></div>' +
                    '</div>' +
                    (detail ? '<div class="small text-muted mt-1">' + detail + '</div>' : '') +
                    '</div></div>');
            });
        });
    }

    function loadDashboard() {
        return appSvc.getMyDashboard().then(function (d) {
            $('#KpiOnaylanan').text(d.onaylanan);
            $('#KpiDegerlendirmede').text(d.degerlendirmede);
            $('#KpiTahsilEdilen').text(money(d.tahsilEdilen));
            $('#KpiBuAySonTarih').text(d.buAySonTarih);
        });
    }

    function load() {
        return recoSvc.getOpenCalls().then(function (items) {
            feed = items || [];
            $('#TabCountEligible').text(feed.filter(function (r) { return r.isRecommended; }).length);
            $('#TabCountAll').text(feed.length);
            $('#TabCountBookmarked').text(feed.filter(function (r) { return r.isBookmarked; }).length);
            paintFeed();
            return profileSvc.getMyProfile();
        }).then(paintProfile);
    }

    load();
    loadApplications();
    loadDashboard();
});
