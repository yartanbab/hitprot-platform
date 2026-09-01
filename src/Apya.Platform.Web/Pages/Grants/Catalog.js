$(function () {
    var service = apya.platform.grants.grantRecommendation;
    var l = abp.localization.getResource('Platform');

    // GrantEligibilityBucket / GrantEligibilityRule enum sıralarıyla birebir.
    var UYGUN = 0, KOSULLU = 1, UYGUN_DEGIL = 2;
    var bucketKeys = ['Uygun', 'Kosullu', 'UygunDegil'];
    var bucketTone = ['positive', 'warning', 'neutral'];
    var bucketIcon = ['fa-circle-check', 'fa-circle-exclamation', 'fa-circle-xmark'];
    var ruleKeys = ['CompanySize', 'CompanyAge', 'Trl', 'StaffCount', 'RdStaffCount', 'Revenue', 'Consortium'];

    var items = [];

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }

    /// Tek satırlık gerekçe: eleyen ya da ölçülemeyen şarttan kurulur.
    function reasonOf(r) {
        if (r.reasonRule == null) { return ''; }
        var key = ruleKeys[r.reasonRule];
        return r.bucket === UYGUN_DEGIL
            ? l('Grants:RuleReason:' + key, r.reasonFirmValue || '—', r.reasonGrantValue || '—')
            : l('Grants:RuleMissing', l('Grants:Rule:' + key));
    }

    function row(r) {
        var chips = '';
        if (r.isHostRecommended) {
            chips += '<span class="apya-chip apya-chip-brand">' +
                esc(l('Grants:Feed:Card:HostRecommended')) + '</span>';
        }
        chips += '<span class="apya-chip apya-chip-neutral">' +
            esc(l('Grants:Detail:Difficulty')) + ' ' + r.difficulty + '/5</span>';

        var days = r.daysRemaining == null ? '—'
            : r.daysRemaining < 0 ? esc(l('Grants:Feed:Card:Closed'))
            : r.daysRemaining;

        var reason = reasonOf(r);

        return '<div class="apya-cat-row' + (r.bucket === UYGUN_DEGIL ? ' is-ineligible' : '') + '">' +
            '<i class="fa ' + bucketIcon[r.bucket] + ' text-' +
                (r.bucket === UYGUN ? 'success' : r.bucket === KOSULLU ? 'warning' : 'secondary') + '"></i>' +
            '<span class="apya-cat-call">' +
            '<span class="apya-cat-name"><a class="text-decoration-none" href="/Grants/Detail?id=' +
                r.grantCallId + '">' + esc(r.grantName) + '</a>' + chips + '</span>' +
            '<span class="apya-cat-sub">' + esc(r.issuer) + ' · ' + esc(r.period) + '</span>' +
            (reason ? '<span class="apya-cat-reason">' + esc(reason) + '</span>' : '') +
            '</span>' +
            '<span><span class="apya-chip apya-chip-' + bucketTone[r.bucket] + '">' +
                esc(l('Grants:Bucket:' + bucketKeys[r.bucket])) + '</span></span>' +
            '<span class="apya-cat-num">%' + r.score + '</span>' +
            '<span class="apya-mini-bar"><span style="width:' + r.score + '%"></span></span>' +
            '<span class="apya-cat-num text-end">' + esc(money(r.maxAmount)) + '</span>' +
            '<span class="apya-cat-num">' + days + '</span>' +
            '<span class="d-flex align-items-center gap-1">' +
            '<a class="btn btn-sm btn-outline-secondary" href="/Grants/Detail?id=' + r.grantCallId + '">' +
                esc(l('Grants:Feed:Card:Detail')) + '</a>' +
            '<button type="button" class="apya-cat-bookmark' + (r.isBookmarked ? ' is-on' : '') +
                '" data-id="' + r.grantCallId + '" title="' +
                esc(l(r.isBookmarked ? 'Grants:Catalog:Unbookmark' : 'Grants:Catalog:Bookmark')) +
                '"><i class="fa fa-bookmark"></i></button>' +
            '</span></div>';
    }

    function paint() {
        // 🔴 Katalogda hiçbir açık çağrı GİZLENMEZ; süzgeç yalnız kullanıcı isterse daraltır.
        var onlyFixable = $('#OnlyFixable').is(':checked');
        var shown = onlyFixable ? items.filter(function (r) { return r.isFixable; }) : items;

        $('#CatalogRows').html(shown.map(row).join(''));
        $('#CatalogEmpty').toggleClass('d-none', shown.length > 0);
    }

    $('#OnlyFixable').on('change', paint);

    $('#CatalogRows').on('click', '.apya-cat-bookmark', function () {
        var $btn = $(this).prop('disabled', true);
        var id = $btn.data('id');
        service.toggleBookmark(id)
            .then(function (isOn) {
                var item = items.find(function (r) { return r.grantCallId === id; });
                if (item) { item.isBookmarked = isOn; }
                paint();
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    service.getOpenCalls().then(function (list) {
        items = list || [];
        $('#TabCountEligible').text(items.filter(function (r) { return r.isRecommended; }).length);
        $('#TabCountAll').text(items.length);
        $('#BucketEligible').text(items.filter(function (r) { return r.bucket === UYGUN; }).length);
        $('#BucketConditional').text(items.filter(function (r) { return r.bucket === KOSULLU; }).length);
        $('#BucketIneligible').text(items.filter(function (r) { return r.bucket === UYGUN_DEGIL; }).length);
        paint();
    });
});
