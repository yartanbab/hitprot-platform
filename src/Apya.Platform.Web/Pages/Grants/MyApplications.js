$(function () {
    var service = apya.platform.grants.grantMyApplications;
    var l = abp.localization.getResource('Platform');

    // Enum sıraları sunucudakiyle birebir.
    var stageKeys = ['Basvuru', 'Degerlendirme', 'Onay', 'Odeme'];
    var actionKeys = ['CompleteForm', 'UploadDocuments', 'WaitingOnConsultant',
                      'WaitingOnInstitution', 'InProject', 'Done'];

    var model = null;
    var filter = 'all';

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
    function shortMoney(v) {
        if (!v) { return '0'; }
        return v >= 1000000
            ? (v / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M'
            : money(v);
    }
    function date(v) {
        return v ? new Date(v).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }) : '—';
    }
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    // Firmadan beklenen iki eylem vurgulanır.
    function isYours(action) { return action === 0 || action === 1; }

    // ---------- Satır ----------
    function row(r) {
        var stageName = r.stageName || l('Grants:Stage:' + stageKeys[r.stage]);
        // Red kararı olan başvuruda CTA doğrudan itiraz ekranına gider.
        var cta = r.isRejected
            ? '<a class="btn btn-sm btn-outline-danger" href="/Grants/Appeal?id=' + r.id + '">' +
              esc(l('Grants:Mine:Cta:Appeal')) + '</a>'
            : r.projectId
            ? '<a class="btn btn-sm btn-outline-secondary" href="/Projects/ProjectDetails/' + r.projectId + '">' +
              esc(l('Grants:Mine:Cta:Project')) + '</a>'
            : '<a class="btn btn-sm btn-' + (isYours(r.nextAction) ? 'primary' : 'outline-secondary') +
              '" href="/Grants/Wizard?id=' + r.id + '">' +
              esc(l(isYours(r.nextAction) ? 'Grants:Mine:Cta:Continue' : 'Grants:Mine:Cta:View')) + '</a>';

        return '<div class="apya-my-row' + (r.isRejected ? ' is-rejected' : (r.isClosed ? ' is-closed' : '')) + '">' +
            '<span class="apya-my-grant">' +
            '<span class="apya-my-grant-name">' + esc(r.grantName) + '</span>' +
            '<span class="apya-my-grant-meta">' + esc(r.issuer) +
            (r.period ? ' · ' + esc(r.period) : '') + '</span></span>' +

            '<span class="apya-my-stage">' +
            '<span class="apya-chip apya-chip-neutral">' + esc(stageName) + '</span>' +
            '<span class="apya-mini-bar"><span style="width:' + r.progressPercent + '%"></span></span></span>' +

            '<span class="apya-numeric' + (r.isApprovedAmount ? ' fw-semibold' : '') + '">' +
            (r.amount != null ? shortMoney(r.amount) + ' ₺' : '—') + '</span>' +

            '<span class="apya-numeric apya-my-grant-meta">' +
            (r.deadline
                ? esc(date(r.deadline)) + (r.daysRemaining != null && r.daysRemaining >= 0
                    ? ' · ' + esc(l('Grants:Feed:Card:DaysLeft', r.daysRemaining)) : '')
                : '—') + '</span>' +

            '<span class="apya-my-next' + (isYours(r.nextAction) ? ' is-yours' : '') + '">' +
            (r.assignedUserName && !isYours(r.nextAction)
                ? '<span class="apya-my-avatar">' + esc(initials(r.assignedUserName)) + '</span>' : '') +
            '<span class="apya-my-next-text">' +
            esc(r.isRejected
                ? (r.appealDaysLeft != null
                    ? l('Grants:Mine:Action:Rejected', r.appealDaysLeft)
                    : l('Grants:Mine:Action:RejectedClosed'))
                : l('Grants:Mine:Action:' + actionKeys[r.nextAction], r.nextActionValue)) + '</span></span>' +

            '<span>' + cta + '</span></div>';
    }

    function visible() {
        var items = model.items || [];
        if (filter === 'open') { return items.filter(function (r) { return !r.isClosed; }); }
        if (filter === 'closed') { return items.filter(function (r) { return r.isClosed; }); }
        return items;
    }

    function paintRows() {
        var rows = visible();
        $('#Rows').html(rows.map(row).join(''));
        $('#Empty').toggleClass('d-none', rows.length > 0);
    }

    $('.apya-choice-row').on('click', '.apya-choice', function () {
        $('.apya-choice-row .apya-choice').removeClass('is-on');
        $(this).addClass('is-on');
        filter = $(this).data('filter');
        paintRows();
    });

    // ---------- Çizim ----------
    function paint() {
        var items = model.items || [];
        var open = items.filter(function (r) { return !r.isClosed; }).length;

        $('#KpiOpen').text(model.openCount);
        $('#KpiApproved').text(model.approvedCount);
        $('#KpiOnYou').text(model.waitingOnYouCount);
        $('#KpiCollected').text(shortMoney(model.collectedAmount) + ' ₺');
        $('#KpiNearest').text(model.nearestDeadlineDays != null
            ? l('Grants:Feed:Card:DaysLeft', model.nearestDeadlineDays) : '—');

        $('#FilterAll').text(l('Grants:Mine:Filter:All', items.length));
        $('#FilterOpen').text(l('Grants:Mine:Filter:Open', open));
        $('#FilterClosed').text(l('Grants:Mine:Filter:Closed', items.length - open));

        paintRows();
    }

    service.get().then(function (dto) { model = dto; paint(); });
});
