$(function () {
    var service = apya.platform.grants.grantFunnel;
    var l = abp.localization.getResource('Platform');
    var $call = $('#FunnelCall');
    var $window = $('#FunnelWindow');

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function num(v) { return (v || 0).toLocaleString('tr-TR'); }

    /// Oran yalnız anlamlıysa yazılır: payda sıfırsa ya da aşama öncekini aşıyorsa (başka kanaldan gelen
    /// kayıt) yüzde yanıltır.
    function ratio(key, part, whole) {
        if (!whole || part > whole) { return ''; }
        return l('Grants:Funnel:Sub:' + key, Math.round(part * 100 / whole));
    }

    function stagesOf(d) {
        var entry = d.tests + d.interests;
        return [
            { key: 'Views', value: d.publicViews + d.tenantViews, sub: l('Grants:Funnel:Sub:Views', num(d.publicViews), num(d.tenantViews)) },
            { key: 'Tests', value: d.tests, sub: ratio('Tests', d.tests, d.publicViews) },
            { key: 'Interests', value: d.interests, sub: ratio('Interests', d.interests, d.tenantViews) },
            { key: 'Meetings', value: d.meetings, sub: ratio('Meetings', d.meetings, entry), hint: l('Grants:Funnel:Hint:Meetings') },
            { key: 'Applications', value: d.applications, sub: ratio('Applications', d.applications, d.meetings) },
            {
                key: 'Approved', value: d.approved,
                sub: d.approved > 0
                    ? ratio('Approved', d.approved, d.applications)
                    : (d.applications > 0 ? l('Grants:Funnel:Sub:AwaitingResult') : '')
            }
        ];
    }

    /// En büyük oransal kayıp. Görüntülenme dışarıda (her zaman en büyüğü olur), onay dışarıda (sonuç
    /// kurumdan gelir, kayıp değildir). Üçten az kayıtla oran gürültüdür.
    function insightOf(d) {
        var steps = [
            { name: l('Grants:Funnel:Insight:Entry'), value: d.tests + d.interests },
            { name: l('Grants:Funnel:Stage:Meetings'), value: d.meetings },
            { name: l('Grants:Funnel:Stage:Applications'), value: d.applications }
        ];
        var best = null;
        for (var i = 1; i < steps.length; i++) {
            var prev = steps[i - 1];
            var next = steps[i];
            if (prev.value < 3 || next.value >= prev.value) { continue; }
            var loss = (prev.value - next.value) / prev.value;
            if (!best || loss > best.loss) { best = { loss: loss, from: prev, to: next }; }
        }
        return best
            ? l('Grants:Funnel:Insight', best.from.name, best.to.name, num(best.from.value), num(best.to.value))
            : '';
    }

    function render(d) {
        $('#FunnelHeading').text(l('Grants:Funnel:Heading', d.callLabel));
        $('#FunnelSub').text(l('Grants:Funnel:Sub', d.days));

        var stages = stagesOf(d);
        var max = Math.max.apply(null, stages.map(function (s) { return s.value; }));
        if (max === 0) {
            $('#FunnelStages').empty();
            $('#FunnelInsight').addClass('d-none');
            $('#FunnelEmptyText').text(l('Grants:Funnel:Empty'));
            $('#FunnelEmpty').removeClass('d-none');
            return;
        }

        $('#FunnelEmpty').addClass('d-none');
        $('#FunnelStages').html(stages.map(function (s) {
            var width = s.value > 0 ? Math.max(2, Math.round(s.value * 100 / max)) : 0;
            return '<li class="apya-fnl-stage" data-stage="' + s.key + '"' + (s.hint ? ' title="' + esc(s.hint) + '"' : '') + '>' +
                '<span class="apya-fnl-label">' + esc(l('Grants:Funnel:Stage:' + s.key)) + '</span>' +
                '<span class="apya-fnl-value apya-numeric">' + num(s.value) + '</span>' +
                '<span class="apya-fnl-bar" aria-hidden="true"><span style="width:' + width + '%"></span></span>' +
                '<span class="apya-fnl-subtext">' + esc(s.sub) + '</span>' +
                '</li>';
        }).join(''));

        var insight = insightOf(d);
        $('#FunnelInsightText').text(insight);
        $('#FunnelInsight').toggleClass('d-none', !insight);
    }

    function load() {
        var callId = $call.val();
        if (!callId) { return; }
        var url = new URL(window.location.href);
        url.searchParams.set('callId', callId);
        window.history.replaceState({}, '', url);
        service.get(callId, parseInt($window.val(), 10)).then(render);
    }

    service.getCalls().then(function (calls) {
        if (!calls.length) {
            $('#FunnelControls').addClass('d-none');
            $('#FunnelEmptyText').text(l('Grants:Funnel:NoCalls'));
            $('#FunnelEmpty').removeClass('d-none');
            return;
        }

        // GrantCallStatus: 0 Planlandı · 1 Açık · 2 Kapandı. Açık çağrı yalnız adıyla yazılır.
        $call.html(calls.map(function (c) {
            var suffix = c.status === 0 ? ' · ' + l('Grants:Funnel:Status:Planned')
                : c.status === 2 ? ' · ' + l('Grants:Funnel:Status:Closed') : '';
            return '<option value="' + c.id + '">' + esc(c.label + suffix) + '</option>';
        }).join(''));

        // Seçim adreste taşınır (?callId=): paylaşılan bağlantı ve yenileme aynı çağrıda açılır.
        var wanted = (new URLSearchParams(window.location.search).get('callId') || '').toLowerCase();
        if (calls.some(function (c) { return c.id === wanted; })) { $call.val(wanted); }
        load();
    });

    $call.on('change', load);
    $window.on('change', load);
});
