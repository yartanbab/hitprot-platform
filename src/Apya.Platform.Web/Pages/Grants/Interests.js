$(function () {
    var service = apya.platform.grants.grantInterestHost;
    var l = abp.localization.getResource('Platform');
    var rejectModal = new bootstrap.Modal(document.getElementById('RejectModal'));

    // GrantInterestStatus enum sırasıyla birebir.
    var statusKeys = ['Yeni', 'Inceleniyor', 'BasvuruAcildi', 'UygunDegil'];
    var statusTone = ['warning', 'neutral', 'positive', 'negative'];

    var model = null;
    var onlyPending = true;
    var rejectId = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

    function deadlineText(r) {
        if (r.deadline == null) { return ''; }
        var days = r.daysRemaining == null ? null
            : r.daysRemaining < 0 ? l('Grants:Feed:Card:Closed')
            : l('Grants:Feed:Card:DaysLeft', r.daysRemaining);
        return ' · ' + date(r.deadline) + (days ? ' (' + days + ')' : '');
    }

    function actions(r) {
        // Karara bağlanmış talepte eylem yok: kim, ne zaman kapattı bilgisi kalır.
        if (r.status === 2 || r.status === 3) {
            return r.reviewedAt
                ? '<span class="small text-muted">' +
                  esc(l('Grants:Interests:ReviewedBy', r.reviewedByName || '—', date(r.reviewedAt))) + '</span>'
                : '';
        }

        var html = '';
        if (r.status === 0) {
            html += '<button type="button" class="btn btn-sm btn-outline-secondary apya-int-review" data-id="' +
                r.id + '">' + esc(l('Grants:Interests:Action:Review')) + '</button>';
        }
        html += '<button type="button" class="btn btn-sm btn-primary apya-int-start" data-id="' + r.id + '">' +
            esc(l('Grants:Interests:Action:Start')) + '</button>';
        html += '<button type="button" class="btn btn-sm btn-outline-danger apya-int-reject" data-id="' + r.id + '">' +
            esc(l('Grants:Interests:Action:Reject')) + '</button>';
        return html;
    }

    function item(r) {
        var note = r.note
            ? '<span class="apya-int-note">' + esc(r.note) + '</span>'
            : '<span class="apya-int-note is-empty">' + esc(l('Grants:Interests:NoNote')) + '</span>';

        var feedback = r.hostFeedback
            ? '<div class="apya-int-extra"><div class="apya-side-note">' +
              '<i class="fa fa-circle-info mt-1"></i><span><strong>' +
              esc(l('Grants:Interests:Reject:Reason')) + ':</strong> ' + esc(r.hostFeedback) +
              '</span></div></div>'
            : '';

        return '<div class="apya-int-item">' +
            '<div class="apya-int-row">' +
            '<span class="apya-int-cell"><strong>' + esc(r.firmName) + '</strong>' +
            '<span>' + esc(r.requestedByName || '—') + ' · ' + esc(date(r.creationTime)) + '</span></span>' +

            '<span class="apya-int-cell"><strong>' + esc(r.grantName) + '</strong>' +
            '<span>' + esc(r.period || '') + esc(deadlineText(r)) + '</span></span>' +

            note +

            '<span><span class="apya-chip apya-chip-' + statusTone[r.status] + '">' +
            esc(l('Grants:Interests:Status:' + statusKeys[r.status])) + '</span></span>' +

            '<span class="apya-int-actions">' + actions(r) + '</span>' +
            '</div>' + feedback + '</div>';
    }

    function paint(data) {
        model = data;
        $('#KpiNew').text(data.newCount);
        $('#KpiInReview').text(data.inReviewCount);
        $('#KpiStarted').text(data.startedCount);
        $('#KpiRejected').text(data.rejectedCount);

        var items = data.items || [];
        // 🔴 İskelet sınıfı boş listede kendiliğinden kalkmaz (:empty seçicisi);
        // boyama satırında elle kaldırılır, yoksa "kayıt yok" metninin altında
        // sonsuza kadar nabız atar.
        $('#InterestRows').removeClass('apya-skel-rows').html(items.map(item).join(''));
        $('#InterestEmpty').toggleClass('d-none', items.length > 0);
    }

    function load() {
        return service.get(onlyPending).then(paint);
    }

    // ---------- Süzgeç ----------
    $('.apya-choice[data-filter]').on('click', function () {
        $('.apya-choice[data-filter]').removeClass('is-on');
        $(this).addClass('is-on');
        onlyPending = $(this).data('filter') === 'pending';
        load();
    });

    // ---------- Eylemler ----------
    $('#InterestRows').on('click', '.apya-int-review', function () {
        var $btn = $(this).prop('disabled', true);
        service.startReview($(this).data('id'))
            .then(function (d) {
                abp.notify.success(l('Grants:Interests:Reviewing'));
                // Süzgeç "tümü" ise sunucudan gelen bekleyen listesi eksik kalır: yeniden yükle.
                return onlyPending ? paint(d) : load();
            })
            .fail(function () { $btn.prop('disabled', false); });
    });

    $('#InterestRows').on('click', '.apya-int-start', function () {
        var $btn = $(this).prop('disabled', true);
        service.startApplication($(this).data('id'))
            .then(function (d) {
                abp.notify.success(l('Grants:Interests:Started'));
                return onlyPending ? paint(d) : load();
            })
            .fail(function () { $btn.prop('disabled', false); });
    });

    $('#InterestRows').on('click', '.apya-int-reject', function () {
        rejectId = $(this).data('id');

        var row = (model.items || []).filter(function (r) { return r.id === rejectId; })[0];
        $('#RejectTarget').text(row ? row.firmName + ' · ' + row.grantName : '');
        $('#RejectReason').val('');
        rejectModal.show();
    });

    $('#RejectForm').on('submit', function (e) {
        e.preventDefault();
        if (!rejectId) { return; }

        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        service.reject({ interestId: rejectId, reason: $('#RejectReason').val() })
            .then(function (d) {
                rejectModal.hide();
                abp.notify.success(l('Grants:Interests:Rejected'));
                return onlyPending ? paint(d) : load();
            })
            .always(function () { $submit.prop('disabled', false); });
    });

    load();
});
