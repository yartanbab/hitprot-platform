$(function () {
    var service = apya.platform.grants.grantRequest;
    var l = abp.localization.getResource('Platform');

    // Enum sıraları sunucudakiyle birebir (GrantRequestKind, GrantResponseState).
    var KIND = { Interest: 0, Lead: 1 };
    var RS = { Waiting: 0, DueSoon: 1, Overdue: 2, Answered: 3, MeetingPlanned: 4, Closed: 5 };

    var filters = { consultantUserId: null, grantCallId: null, closed: false };
    var optionsFilled = false;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function pad(n) { return n < 10 ? '0' + n : String(n); }

    // Yanıtlanmamış = süre işliyor. Durumu sunucu hesaplar; burada yalnız gruplanır.
    function isUnanswered(r) { return r.response === RS.Waiting || r.response === RS.DueSoon || r.response === RS.Overdue; }
    function isPressing(r) { return r.response === RS.DueSoon || r.response === RS.Overdue; }

    function href(r) {
        return r.kind === KIND.Lead
            ? '/Grants/Leads?id=' + r.id
            : '/Grants/InterestReview?id=' + r.id;
    }

    // "3 saat önce" · "bugün 09:14" · "dün 16:40" · "2 gün önce" (22b).
    function arrived(value) {
        var d = new Date(value);
        var now = new Date();
        var hours = Math.floor((now - d) / 3600000);
        if (hours < 1) { return l('Grants:Requests:Arrived:Now'); }
        if (hours < 6) { return l('Grants:Requests:Arrived:HoursAgo', hours); }

        var time = pad(d.getHours()) + ':' + pad(d.getMinutes());
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (d >= today) { return l('Grants:Requests:Arrived:Today', time); }

        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (d >= yesterday) { return l('Grants:Requests:Arrived:Yesterday', time); }

        var day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return l('Grants:Requests:Arrived:DaysAgo', Math.round((today - day) / 86400000));
    }

    // Satır başına tek sinyal: renk yalnız yanıt süresi hücresinde.
    function response(r) {
        switch (r.response) {
            case RS.Waiting: return { text: l('Grants:Requests:Response:HoursLeft', r.hoursLeft), tone: 'is-waiting' };
            case RS.DueSoon: return { text: l('Grants:Requests:Response:HoursLeft', r.hoursLeft), tone: 'is-urgent' };
            case RS.Overdue: return { text: l('Grants:Requests:Response:Overdue'), tone: 'is-urgent' };
            case RS.MeetingPlanned: return { text: l('Grants:Requests:Response:MeetingPlanned'), tone: 'is-good' };
            case RS.Answered: return { text: l('Grants:Requests:Response:Answered'), tone: 'is-quiet' };
            default: return { text: l('Grants:Requests:Response:Closed'), tone: 'is-quiet' };
        }
    }

    // "Selin Bakır" → avatar "SB", etiket "Selin B." (22b).
    function consultant(r) {
        if (!r.consultantName) {
            return '<span class="apya-req-consultant is-none" data-label="' + esc(l('Grants:Requests:Col:Consultant')) + '">—</span>';
        }
        var parts = r.consultantName.trim().split(/\s+/);
        var initials = (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toLocaleUpperCase('tr-TR');
        var short = parts.length > 1 ? parts[0] + ' ' + parts[parts.length - 1][0] + '.' : parts[0];
        return '<span class="apya-req-consultant" data-label="' + esc(l('Grants:Requests:Col:Consultant')) + '" title="' + esc(r.consultantName) + '">' +
            '<span class="apya-avatar apya-avatar-brand" aria-hidden="true">' + esc(initials) + '</span>' +
            '<span class="apya-req-consultant-name">' + esc(short) + '</span></span>';
    }

    function row(r) {
        var rs = response(r);
        var summary = r.kind === KIND.Lead
            ? l('Grants:Requests:Kind:Lead') + (r.summary ? ' · ' + r.summary : '')
            : (r.summary || '');
        var call = r.period ? r.grantName + ' · ' + r.period : r.grantName;
        var primary = isUnanswered(r);

        return '<div class="apya-req-row">' +
            '<div class="apya-req-firm"><strong>' + esc(r.firmName) + '</strong>' +
            // Fikir tek satırda kesilir; tamamı üzerine gelince görünür.
            (summary ? '<span title="' + esc(summary) + '">' + esc(summary) + '</span>' : '') + '</div>' +
            '<span class="apya-req-call" data-label="' + esc(l('Grants:Requests:Col:Call')) + '" title="' + esc(call) + '">' + esc(r.grantName) + '</span>' +
            consultant(r) +
            '<span class="apya-req-arrived" data-label="' + esc(l('Grants:Requests:Col:Arrived')) + '">' + esc(arrived(r.creationTime)) + '</span>' +
            // Eş aralıklı yazı yalnız sayıda ("21 saat kaldı"); "görüşme planlandı" metindir.
            '<span class="apya-req-response ' + (r.hoursLeft != null ? 'apya-numeric ' : '') + rs.tone + '" data-label="' + esc(l('Grants:Requests:Col:Response')) + '">' + esc(rs.text) + '</span>' +
            '<a class="btn btn-sm apya-req-cta ' + (primary ? 'btn-primary' : 'btn-outline-secondary') + '" href="' + href(r) + '">' +
            esc(l(primary ? 'Grants:Requests:Open' : 'Grants:Requests:View')) + '</a>' +
            '</div>';
    }

    function fillOptions(dto) {
        if (optionsFilled) { return; }
        optionsFilled = true;
        (dto.consultants || []).forEach(function (c) {
            $('#ConsultantFilter').append($('<option>').val(c.id).text(c.name));
        });
        (dto.calls || []).forEach(function (c) {
            $('#CallFilter').append($('<option>').val(c.id).text(c.name));
        });
    }

    function paintDue(dto) {
        var pressing = (dto.items || []).filter(isPressing);
        var show = !filters.closed && dto.dueSoonCount > 0;
        $('#DueStrip').toggleClass('d-none', !show);
        if (!show) { return; }

        var parts = (dto.dueSoonByConsultant || []).map(function (c) {
            return (c.name || l('Grants:Requests:Due:Unassigned')) + ': ' + c.count;
        });
        $('#DueText').text(l('Grants:Requests:Due', dto.dueSoonCount) + (parts.length ? ' — ' + parts.join(' · ') : ''));

        // Liste en acil talep başta gelir; süzgeç o talebi gizlediyse düğme de gizlenir.
        $('#DueNext').toggleClass('d-none', pressing.length === 0)
            .attr('href', pressing.length ? href(pressing[0]) : '#');
    }

    function paint(dto) {
        $('[data-request-count="pending"]').text(dto.pendingCount);
        $('[data-request-count="running"]').text(dto.runningCount);
        fillOptions(dto);
        paintDue(dto);

        var items = dto.items || [];
        $('#RequestRows').removeClass('apya-skel-rows').html(items.map(row).join(''));

        var filtered = filters.consultantUserId || filters.grantCallId;
        $('#RequestEmpty').toggleClass('d-none', items.length > 0).text(
            filtered ? l('Grants:Requests:EmptyFiltered')
                : filters.closed ? l('Grants:Requests:EmptyClosed')
                : l('Grants:Requests:Empty'));
    }

    function load() {
        service.getInbox(filters).then(paint);
    }

    $('#ConsultantFilter').on('change', function () { filters.consultantUserId = $(this).val() || null; load(); });
    $('#CallFilter').on('change', function () { filters.grantCallId = $(this).val() || null; load(); });
    $('#StateFilter').on('change', function () { filters.closed = $(this).val() === 'closed'; load(); });

    load();
});
