$(function () {
    var profileSvc = apya.platform.grants.firmProfile;
    var recoSvc = apya.platform.grants.grantRecommendation;
    var appSvc = apya.platform.grants.grantApplication;
    var l = abp.localization.getResource('Platform');


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

        $('#ProfileSuggestedNote').toggleClass('d-none', !p.isSuggested);

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
        // Dar ekranda şerit yatay kayar; seçilen sekme görünür alana ortalanır.
        var strip = this.parentElement, r = this.getBoundingClientRect(), sr = strip.getBoundingClientRect();
        strip.scrollLeft += r.left - sr.left - (sr.width - r.width) / 2;
        paintFeed();
    });

    // ---------- Kart akışı ----------
    function ruleText(rule) { return l('Grants:Rule:' + ruleKeys[rule]); }

    // GrantInterestStatus enum değerleri sunucudakiyle birebir.
    var interestKeys = ['Yeni', 'Inceleniyor', 'BasvuruAcildi', 'UygunDegil', 'GeriCekildi', 'Kacirildi'];
    var interestTone = ['neutral', 'neutral', 'positive', 'negative', 'neutral', 'neutral'];
    var bucketKeys = ['Uygun', 'Kosullu', 'UygunDegil'];
    var bucketTone = ['positive', 'warning', 'neutral'];

    var bookmarkNoteModal = new bootstrap.Modal(document.getElementById('BookmarkNoteModal'));
    var bookmarkNoteCallId = null;

    /// Kartın tek eylemi (tur 14): ilgi kartta DEĞİL detayda bildirilir, kart "İncele" der;
    /// şartları karşılamayan kartta "Neden uymuyor?". Süren talepte düğme yerine durum rozeti.
    function cardCta(r) {
        var st = r.interestStatus;
        if (r.alreadyApplied || st === 2) {
            return '<span class="apya-chip apya-chip-positive">' + esc(l('Grants:Interest:Status:BasvuruAcildi')) + '</span>';
        }
        if (st === 0 || st === 1) {
            return '<span class="apya-chip apya-chip-' + interestTone[st] + '">' + esc(l('Grants:Interest:Status:' + interestKeys[st])) + '</span>';
        }
        var unfit = r.bucket === 2;
        return '<a class="btn btn-sm ' + (unfit ? 'btn-outline-secondary' : 'btn-primary') + '" href="/Grants/Detail?id=' + r.grantCallId + '">' +
            esc(l(unfit ? 'Grants:Feed:Card:WhyNot' : 'Grants:Feed:Card:Review')) + '</a>';
    }

    /// 10c/12b · "Neden uygun" tek cümle: sağlanan şartların adları; koşulluda eksik veri;
    /// uymayanda eleyen şartın gerekçesi. Ek gerektiren kalıp yok.
    function whySentence(r) {
        if (r.bucket === 2 && r.failedRules && r.failedRules.length) {
            return reasonSentence(r, r.failedRules[0]);
        }
        var passed = (r.passedRules || []).slice(0, 3).map(ruleText);
        if (passed.length === 0) { return l('Grants:Feed:Card:WhyNone'); }
        return l(r.bucket === 0 ? 'Grants:Feed:Card:WhyAll' : 'Grants:Feed:Card:WhySome', passed.join(', '));
    }

    function gapSentence(r) {
        if (r.bucket === 1 && r.unknownRules && r.unknownRules.length) {
            return l('Grants:RuleMissing', ruleText(r.unknownRules[0]));
        }
        if (r.bucket === 0 && r.unknownRules && r.unknownRules.length) {
            return l('Grants:Feed:Card:GapOptional', ruleText(r.unknownRules[0]));
        }
        return '';
    }

    function difficultyWord(d) {
        return l(d >= 4 ? 'Grants:Feed:Card:Hard' : d >= 3 ? 'Grants:Feed:Card:Medium' : 'Grants:Feed:Card:Easy');
    }

    function daysChip(r) {
        if (r.daysRemaining == null) { return ''; }
        var d = r.daysRemaining;
        if (d < 0) { return '<span class="apya-feed-days is-closed">' + esc(l('Grants:Feed:Card:Closed')) + '</span>'; }
        return '<span class="apya-feed-days' + (d <= 20 ? ' is-urgent' : '') + '"><i class="fa fa-clock"></i>' +
            esc(l('Grants:Feed:Card:DaysLeft', d)) + '</span>';
    }

    /// 13b · Takip satırı: ne zaman, kim işaretledi, firmanın notu.
    function bookmarkLine(r) {
        if (!r.isBookmarked) { return ''; }
        var parts = [];
        if (r.bookmarkedAt) { parts.push(l('Grants:Feed:Bookmark:Since', fmtDate(r.bookmarkedAt))); }
        if (r.bookmarkedByName) { parts.push(l('Grants:Feed:Bookmark:MarkedBy', r.bookmarkedByName)); }
        var note = r.bookmarkNote ? esc(r.bookmarkNote) : '<span class="apya-feed-bookmark-empty">' + esc(l('Grants:Feed:Bookmark:NoNote')) + '</span>';
        return '<div class="apya-feed-bookmark"><i class="fa fa-bookmark"></i><span class="apya-feed-bookmark-text">' +
            '<span class="apya-feed-bookmark-meta">' + esc(parts.join(' · ')) + '</span>' + note + '</span>' +
            '<button type="button" class="apya-feed-bookmark-edit" data-note="' + r.grantCallId + '" title="' + esc(l('Grants:Feed:Bookmark:EditNote')) + '"><i class="fa fa-pen"></i></button></div>';
    }

    function feedCard(r) {
        var unfit = r.bucket === 2;
        var gap = gapSentence(r);
        return '<article class="apya-feed-card' + (unfit ? ' is-unfit' : '') + '" data-call="' + r.grantCallId + '">' +
            '<a class="apya-feed-poster" style="' + apyaGrantPoster.style(r.issuer, r.posterFileName) + '" href="/Grants/Detail?id=' + r.grantCallId + '" aria-label="' + esc(r.grantName) + '">' +
            '<span class="apya-feed-poster-top">' +
            (r.isHostRecommended ? '<span class="apya-feed-badge"><i class="fa fa-star"></i>' + esc(l('Grants:Feed:Card:HostRecommended')) + '</span>' : '<span></span>') +
            daysChip(r) + '</span>' +
            '<span class="apya-feed-poster-bottom">' +
            '<span class="apya-feed-poster-issuer">' + esc(r.issuer) + ' · ' + esc(r.period) + '</span>' +
            '<span class="apya-feed-poster-name">' + esc(r.grantName) + '</span></span></a>' +
            '<button type="button" class="apya-feed-mark' + (r.isBookmarked ? ' is-on' : '') + '" data-mark="' + r.grantCallId + '" ' +
            'title="' + esc(l(r.isBookmarked ? 'Grants:Catalog:Unbookmark' : 'Grants:Catalog:Bookmark')) + '" aria-pressed="' + (r.isBookmarked ? 'true' : 'false') + '">' +
            '<i class="fa' + (r.isBookmarked ? '' : '-regular') + ' fa-bookmark"></i></button>' +
            '<div class="apya-feed-body">' +
            '<div class="apya-feed-amount-row"><span class="apya-feed-amount-value">' + esc(ceiling(r.maxAmount)) + '</span>' +
            (r.supportRatePercent != null ? '<span class="apya-feed-rate">' + esc(l('Grants:Feed:Card:Rate', r.supportRatePercent)) + '</span>' : '') + '</div>' +
            '<p class="apya-feed-why">' + esc(whySentence(r)) + '</p>' +
            (gap ? '<p class="apya-feed-gap"><i class="fa fa-circle-exclamation"></i>' + esc(gap) + '</p>' : '') +
            (activeTab === 'bookmarked' ? bookmarkLine(r) : '') +
            '<div class="apya-feed-foot">' +
            '<span class="apya-feed-fit is-' + bucketTone[r.bucket] + '"><span class="apya-feed-fit-dot"></span>' + esc(l('Grants:Bucket:' + bucketKeys[r.bucket])) +
            '<span class="apya-feed-fit-sep">·</span>' + esc(difficultyWord(r.difficulty)) + '</span>' +
            cardCta(r) + '</div></div></article>';
    }

    /// Eleyen şartın tek satırlık gerekçesi — değerler sunucudan, cümle burada kurulur.
    function reasonSentence(r, rule) {
        var firmValue = r.reasonRule === rule ? (r.reasonFirmValue || '—') : '—';
        var grantValue = r.reasonRule === rule ? (r.reasonGrantValue || '—') : '—';
        return l('Grants:RuleReason:' + ruleKeys[rule], firmValue, grantValue);
    }

    // Sıra: uyum skoruna göre; uygun olmayanlar soluk ama listede (12a).
    function sorted(items) {
        return items.slice().sort(function (a, b) { return b.score - a.score || (a.daysRemaining == null ? 1e9 : a.daysRemaining) - (b.daysRemaining == null ? 1e9 : b.daysRemaining); });
    }

    function paintFeed() {
        var eligible = sorted(feed.filter(function (r) { return r.isRecommended; }));
        var items = activeTab === 'bookmarked' ? sorted(feed.filter(function (r) { return r.isBookmarked; }))
            : activeTab === 'all' ? sorted(feed)
            : eligible;

        $('#FeedGrid').attr('data-cols', activeTab === 'eligible' ? '2' : '3');
        // İskelet `:empty` kuralıyla çiziliyor; boş sonuçta sonsuza dek parlardı — sınıf her boyamada düşer.
        $('#FeedGrid').removeClass('apya-skel-cards').html(items.map(feedCard).join(''));
        // Hiç açık çağrı yoksa "Tüm açık hibeler" sekmesi de boş kartı gösterir, boş ızgara değil.
        $('#FeedEmpty').toggleClass('d-none', items.length > 0 || activeTab === 'bookmarked');
        $('#BookmarkEmpty').toggleClass('d-none', items.length > 0 || activeTab !== 'bookmarked');
        $('#BookmarkHint').toggleClass('d-none', activeTab !== 'bookmarked' || items.length === 0);
        $('#FeedTableLink').toggleClass('d-none', activeTab !== 'all');
        $('#FeedSortLabel').text(l('Grants:Feed:SortByFit'));

        // 12a · Kova sayıları tek satır.
        var buckets = [0, 1, 2].map(function (b) { return feed.filter(function (r) { return r.bucket === b; }).length; });
        $('#FeedBuckets').toggleClass('d-none', activeTab !== 'all' || feed.length === 0).html(
            '<span class="apya-feed-bucket is-positive">' + esc(l('Grants:Feed:Bucket:Eligible', buckets[0])) + '</span>' +
            '<span class="apya-feed-bucket is-warning">' + esc(l('Grants:Feed:Bucket:Conditional', buckets[1])) + '</span>' +
            '<span class="apya-feed-bucket is-neutral">' + esc(l('Grants:Feed:Bucket:Ineligible', buckets[2])) + '</span>');

        // 13a · Eşiğin altındakiler gizlenmez; altta tek cümleyle çağrılır.
        var below = feed.length - eligible.length;
        $('#FeedMore').toggleClass('d-none', activeTab !== 'eligible' || below === 0);
        $('#FeedMoreText').text(l('Grants:Feed:More:Text', below));
    }

    $('#FeedMoreBtn').on('click', function () { $('.apya-tenant-tab[data-tab="all"]').trigger('click'); });

    // Yer imi: kartın köşesindeki düğme; ikinci basış takipten çıkarır.
    $('#FeedGrid').on('click', '[data-mark]', function () {
        var id = $(this).data('mark');
        var $btn = $(this).prop('disabled', true);
        recoSvc.toggleBookmark(id).then(function (on) {
            var row = feed.filter(function (r) { return r.grantCallId === id; })[0];
            if (row) { row.isBookmarked = on; if (!on) { row.bookmarkNote = null; row.bookmarkedAt = null; row.bookmarkedByName = null; } else { row.bookmarkedAt = new Date().toISOString(); } }
            $('#TabCountBookmarked').text(feed.filter(function (r) { return r.isBookmarked; }).length);
            paintHeading();
            paintFeed();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // 13b · Takip notu.
    $('#FeedGrid').on('click', '[data-note]', function () {
        bookmarkNoteCallId = $(this).data('note');
        var row = feed.filter(function (r) { return r.grantCallId === bookmarkNoteCallId; })[0];
        $('#BookmarkNoteCall').text(row ? row.grantName : '');
        $('#BookmarkNoteText').val(row && row.bookmarkNote ? row.bookmarkNote : '');
        bookmarkNoteModal.show();
    });

    $('#BookmarkNoteForm').on('submit', function (e) {
        e.preventDefault();
        if (!bookmarkNoteCallId) { return; }
        // 🔴 $.trim YOK: libs'teki jQuery 4.0.0 (install-libs) kaldırdı; String.prototype.trim kullanılır.
        var note = ($('#BookmarkNoteText').val() || '').trim();
        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        recoSvc.setBookmarkNote({ grantCallId: bookmarkNoteCallId, note: note || null }).then(function () {
            var row = feed.filter(function (r) { return r.grantCallId === bookmarkNoteCallId; })[0];
            if (row) { row.bookmarkNote = note || null; }
            bookmarkNoteModal.hide();
            paintFeed();
        }).always(function () { $submit.prop('disabled', false); });
    });

    // 10c/13a · Başlık cümlesi: kaç uygun çağrı, en yakın son tarih hangi kartta.
    function paintHeading() {
        var eligible = sorted(feed.filter(function (r) { return r.isRecommended; }));
        $('#FeedHeading').removeClass('apya-skel-num').text(eligible.length
            ? l('Grants:Feed:Heading', eligible.length) : l('Grants:Feed:Heading:None'));
        var nearest = null, nearestIndex = -1;
        eligible.forEach(function (r, i) {
            if (r.daysRemaining != null && r.daysRemaining >= 0 && (nearest == null || r.daysRemaining < nearest.daysRemaining)) { nearest = r; nearestIndex = i; }
        });
        var lead = [];
        if (eligible.length) { lead.push(l('Grants:Feed:Lead:Sorted')); }
        if (nearest) {
            lead.push(nearest.daysRemaining === 0
                ? l('Grants:Feed:Lead:NearestToday', nearest.grantName, nearestIndex + 1)
                : l('Grants:Feed:Lead:Nearest', nearest.daysRemaining, nearest.grantName, nearestIndex + 1));
        }
        $('#FeedLead').text(lead.join(' ')).toggleClass('d-none', lead.length === 0);
    }

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

    function load() {
        return recoSvc.getOpenCalls().then(function (items) {
            feed = items || [];
            $('#TabCountEligible').text(feed.filter(function (r) { return r.isRecommended; }).length);
            $('#TabCountAll').text(feed.length);
            $('#TabCountBookmarked').text(feed.filter(function (r) { return r.isBookmarked; }).length);
            paintHeading();
            paintFeed();
            return profileSvc.getMyProfile();
        }).then(paintProfile);
    }

    load();
    loadApplications();
});
