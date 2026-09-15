// 21a/22 · Host Çağrılar. Kart = çağrı + programı; sayılar sunucudan (GrantCallBoardAppService).
// Program oluşturma Elle hibe gir'de (/Grants/Import), düzenleme Parametreler'de. Bu sayfada
// yalnız çağrı penceresi (ekle/düzenle) ve silme işlemleri kalır.
$(function () {
    var board = apya.platform.grants.grantCallBoard;
    var callService = apya.platform.grants.grantCall;
    var grantService = apya.platform.grants.grant;
    var sourceService = apya.platform.grants.grantSource;
    var l = abp.localization.getResource('Platform');

    var canCreate = abp.auth.isGranted('Platform.Grants.Create');
    var canEdit = abp.auth.isGranted('Platform.Grants.Edit');
    var canDelete = abp.auth.isGranted('Platform.Grants.Delete');

    // Enum sıraları sunucudakiyle birebir: GrantCallStatus, GrantCallBoardTab.
    var ST = { Planlandi: 0, Acik: 1, Kapandi: 2, Taslak: 3 };
    var TAB = { live: 0, draft: 1 };

    var callModal = new bootstrap.Modal(document.getElementById('CallModal'));
    var state = {
        tab: $('[data-call-tab]').first().attr('data-call-tab') === 'draft' ? 'draft' : 'live',
        closed: false,
        issuer: '',
        sort: 0,
        view: 'cards'
    };
    var issuersFilled = false;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function num(v) { return Math.round(v).toLocaleString('tr-TR'); }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }
    function numOrNull(sel) {
        // Maskeli tutar alanında .val() "1.234,56" döndürür; parseFloat onu 1'e indirir.
        var el = $(sel)[0];
        if (el && el.__apyaMoney) { return apya.moneyInput.getValue(el); }
        var v = $(sel).val(); return v === '' || v == null ? null : parseFloat(v);
    }
    function setMoney(sel, v) { apya.moneyInput.setValue($(sel)[0], v); }

    // ---------- Kart parçaları ----------
    // Tavan belirtilmemiş program 0 ile saklanır (MaxAmount kolonu NOT NULL); asgari varsa aralık.
    function amount(c) {
        var max = c.maxAmount || 0, min = c.minAmount || 0;
        if (min && max) { return num(min) + ' – ' + num(max) + ' ₺'; }
        if (max) { return num(max) + ' ₺'; }
        if (min) { return num(min) + '+ ₺'; }
        return l('Grants:Calls:NoCeiling');
    }

    function stateOf(c) {
        if (c.status == null) { return { key: 'NoCall', tone: 'warning', cls: 'is-draft' }; }
        switch (c.status) {
            case ST.Acik: return { key: 'Live', tone: 'positive', cls: 'is-live' };
            case ST.Planlandi: return { key: 'Planned', tone: 'neutral', cls: 'is-planned' };
            case ST.Kapandi: return { key: 'Closed', tone: 'neutral', cls: 'is-closed' };
            default: return { key: 'Draft', tone: 'warning', cls: 'is-draft' };
        }
    }

    function daysPill(c) {
        if (c.daysRemaining == null) { return ''; }
        if (c.status === ST.Kapandi || c.daysRemaining < 0) {
            return '<span class="apya-feed-days is-closed">' + esc(l('Grants:Feed:Card:Closed')) + '</span>';
        }
        return '<span class="apya-feed-days' + (c.daysRemaining <= 20 ? ' is-urgent' : '') + '"><i class="fa fa-clock"></i>' +
            esc(l('Grants:Feed:Card:DaysLeft', c.daysRemaining)) + '</span>';
    }

    function isDraft(c) { return c.status == null || c.status === ST.Taslak; }

    function missingNames(c) {
        return (c.missingRequiredFields || []).map(function (f) { return l('Grants:Field:' + f); }).join(' · ');
    }

    // Satır başına tek sinyal: yayındakinde erişim, taslakta yayına ne kaldığı.
    function body(c) {
        if (c.status == null) {
            return '<p class="apya-call-note is-warning"><i class="fa fa-circle-exclamation"></i><span>' + esc(l('Grants:Calls:NoCallNote')) + '</span></p>';
        }
        if (c.status === ST.Taslak) {
            var missing = missingNames(c);
            return missing
                ? '<p class="apya-call-note is-warning"><i class="fa fa-triangle-exclamation"></i><span>' +
                    esc(l('Grants:Calls:DraftNote', c.completionPercent)) + '<span class="apya-call-note-sub">' + esc(missing) + '</span></span></p>'
                : '<p class="apya-call-note is-ready"><i class="fa fa-circle-check"></i><span>' + esc(l('Grants:Calls:DraftReady', c.completionPercent)) + '</span></p>';
        }
        return '<div class="apya-call-stats">' +
            '<div class="apya-call-stat"><span class="apya-call-stat-label">' + esc(l('Grants:Calls:Stat:Firms')) + '</span>' +
            '<span class="apya-call-stat-value apya-numeric">' + (c.matchingFirmCount || 0) + '</span></div>' +
            '<div class="apya-call-stat"><span class="apya-call-stat-label">' + esc(l('Grants:Calls:Stat:Interest')) + '</span>' +
            '<span class="apya-call-stat-value apya-numeric">' + (c.interestCount || 0) + '</span></div></div>';
    }

    function paramsHref(c) { return '/Grants/Parameters?id=' + c.grantId; }

    function cta(c) {
        if (c.status == null) {
            return canCreate ? '<button type="button" class="btn btn-sm btn-primary" data-act="add-call">' + esc(l('Grants:Calls:AddCall')) + '</button>' : '';
        }
        if (c.status === ST.Taslak) {
            return canEdit ? '<a class="btn btn-sm btn-primary" href="' + paramsHref(c) + '">' + esc(l('Grants:Calls:CompleteParameters')) + '</a>' : '';
        }
        if (c.status === ST.Acik && canCreate) {
            return '<a class="btn btn-sm btn-outline-secondary" href="/Grants/Dispatch?id=' + c.grantCallId + '">' + esc(l('Grants:Calls:SendToFirms')) + '</a>';
        }
        return canEdit ? '<a class="btn btn-sm btn-outline-secondary" href="' + paramsHref(c) + '">' + esc(l('Grants:Calls:Parameters')) + '</a>' : '';
    }

    // Kart overflow:hidden — menü sabit konumla açılır ki kırpılmasın.
    function menu(c) {
        var items = [];
        if (c.grantCallId && canEdit) { items.push(['edit-call', 'Grants:Calls:Menu:EditCall']); }
        if (canCreate) { items.push(['add-call', 'Grants:Calls:Menu:AddCall']); }
        if (c.grantCallId && canDelete) { items.push(['delete-call', 'Grants:Calls:Menu:DeleteCall', true]); }
        if (canDelete) { items.push(['delete-grant', 'Grants:Calls:Menu:DeleteGrant', true]); }
        if (!items.length) { return ''; }
        return '<div class="dropdown">' +
            '<button type="button" class="btn btn-sm btn-outline-secondary apya-call-icon" data-bs-toggle="dropdown" ' +
            'data-bs-popper-config=\'{"strategy":"fixed"}\' aria-expanded="false" aria-label="' + esc(l('Grants:Calls:Menu:More')) + '" title="' + esc(l('Grants:Calls:Menu:More')) + '">' +
            '<i class="fa fa-ellipsis-vertical"></i></button>' +
            '<ul class="dropdown-menu dropdown-menu-end">' + items.map(function (i) {
                return '<li><button type="button" class="dropdown-item' + (i[2] ? ' text-danger' : '') + '" data-act="' + i[0] + '">' + esc(l(i[1])) + '</button></li>';
            }).join('') + '</ul></div>';
    }

    function actions(c) {
        var pen = canEdit
            ? '<a class="btn btn-sm btn-outline-secondary apya-call-icon" href="' + paramsHref(c) + '" title="' + esc(l('Grants:Calls:Parameters')) + '" aria-label="' + esc(l('Grants:Calls:Parameters')) + '"><i class="fa fa-pen"></i></a>'
            : '';
        return '<div class="apya-call-actions">' + cta(c) + pen + menu(c) + '</div>';
    }

    function card(c) {
        var st = stateOf(c);
        var head = c.period ? c.issuer + ' · ' + c.period : c.issuer;
        var posterTag = canEdit ? 'a' : 'div';
        return '<article class="apya-feed-card apya-call-card' + (isDraft(c) ? ' is-draft' : '') + '" data-grant="' + c.grantId + '"' +
            (c.grantCallId ? ' data-call="' + c.grantCallId + '"' : '') + ' data-name="' + esc(c.grantName) + '" data-period="' + esc(c.period || '') + '">' +
            '<' + posterTag + ' class="apya-feed-poster" style="' + apyaGrantPoster.style(c.issuer, c.posterFileName) + '"' +
            (canEdit ? ' href="' + paramsHref(c) + '"' : '') + ' aria-label="' + esc(c.grantName) + '">' +
            '<span class="apya-feed-poster-top"><span class="apya-call-state ' + st.cls + '">' + esc(l('Grants:Calls:State:' + st.key)) + '</span>' + daysPill(c) + '</span>' +
            '<span class="apya-feed-poster-bottom"><span class="apya-feed-poster-issuer">' + esc(head) + '</span>' +
            '<span class="apya-feed-poster-name">' + esc(c.grantName) + '</span></span></' + posterTag + '>' +
            '<div class="apya-feed-body">' +
            '<div class="apya-feed-amount-row"><span class="apya-feed-amount-value">' + esc(amount(c)) + '</span>' +
            (c.supportRatePercent != null ? '<span class="apya-feed-rate">' + esc(l('Grants:Feed:Card:Rate', c.supportRatePercent)) + '</span>' : '') + '</div>' +
            body(c) +
            '<div class="apya-feed-foot">' + actions(c) + '</div>' +
            '</div></article>';
    }

    function reach(c) {
        if (c.status == null) { return '—'; }
        if (c.status === ST.Taslak) { return l('Grants:Calls:Completion', c.completionPercent); }
        return l('Grants:Calls:Reach', c.matchingFirmCount || 0, c.interestCount || 0);
    }

    function row(c) {
        var st = stateOf(c);
        var deadline = c.deadline
            ? fmtDate(c.deadline) + (c.daysRemaining != null && c.daysRemaining >= 0 && c.status !== ST.Kapandi ? ' · ' + l('Grants:Feed:Card:DaysLeft', c.daysRemaining) : '')
            : '—';
        return '<div class="apya-call-row" data-grant="' + c.grantId + '"' + (c.grantCallId ? ' data-call="' + c.grantCallId + '"' : '') +
            ' data-name="' + esc(c.grantName) + '" data-period="' + esc(c.period || '') + '">' +
            // Durum rozeti program hücresinde: ayrı sütun 1280px'te destek ve erişimi 62-75px'e sıkıştırıyordu.
            '<div class="apya-call-name"><strong>' + esc(c.grantName) + '</strong>' +
            '<span class="apya-call-name-meta"><span class="apya-chip apya-chip-' + st.tone + '">' + esc(l('Grants:Calls:State:' + st.key)) + '</span>' +
            '<span class="apya-call-name-sub" title="' + esc(c.period ? c.issuer + ' · ' + c.period : c.issuer) + '">' +
            esc(c.period ? c.issuer + ' · ' + c.period : c.issuer) + '</span></span></div>' +
            '<span class="apya-numeric" data-label="' + esc(l('Grants:Calls:Col:Deadline')) + '">' + esc(deadline) + '</span>' +
            '<span class="apya-numeric" data-label="' + esc(l('Grants:Calls:Col:Amount')) + '">' + esc(amount(c)) + '</span>' +
            '<span data-label="' + esc(l('Grants:Calls:Col:Reach')) + '">' + esc(reach(c)) + '</span>' +
            actions(c) + '</div>';
    }

    // ---------- Boyama ----------
    function fillIssuers(list) {
        if (issuersFilled) { return; }
        issuersFilled = true;
        (list || []).forEach(function (i) { $('#IssuerFilter').append($('<option>').val(i).text(i)); });
    }

    function emptyText() {
        if (state.issuer) { return l('Grants:Calls:EmptyFiltered'); }
        if (state.tab === 'draft') { return l('Grants:Calls:EmptyDraft'); }
        return l(state.closed ? 'Grants:Calls:EmptyClosed' : 'Grants:Calls:EmptyLive');
    }

    function paint(dto) {
        $('[data-call-count="live"]').text(dto.liveCount);
        $('[data-call-count="draft"]').text(dto.draftCount);
        fillIssuers(dto.issuers);

        var items = dto.items || [];
        var cards = state.view === 'cards';
        $('#CallGrid').removeClass('apya-skel-cards').toggleClass('d-none', !cards || items.length === 0)
            .html(cards ? items.map(card).join('') : '');
        $('#CallList').toggleClass('d-none', cards || items.length === 0);
        $('#CallRows').html(cards ? '' : items.map(row).join(''));
        $('#CallEmpty').toggleClass('d-none', items.length > 0).text(emptyText());
    }

    function load() {
        $('.apya-call-live-only').toggleClass('d-none', state.tab !== 'live');
        return board.get({
            tab: TAB[state.tab],
            closed: state.tab === 'live' && state.closed,
            issuer: state.issuer || null,
            sort: state.sort
        }).then(paint);
    }

    // ---------- Sekme, süzgeç, görünüm ----------
    $('.apya-call-tabs').on('click', 'a[data-call-tab]', function (e) {
        e.preventDefault();
        state.tab = $(this).attr('data-call-tab');
        $('.apya-call-tabs a[data-call-tab]').each(function () {
            var on = $(this).attr('data-call-tab') === state.tab;
            $(this).toggleClass('is-active', on).attr('aria-current', on ? 'page' : null);
        });
        history.replaceState(null, '', state.tab === 'draft' ? '/Grants?tab=draft' : '/Grants');
        load();
    });

    $('#IssuerFilter').on('change', function () { state.issuer = $(this).val(); load(); });
    $('#StateFilter').on('change', function () { state.closed = $(this).val() === 'closed'; load(); });
    $('#SortFilter').on('change', function () { state.sort = parseInt($(this).val(), 10) || 0; load(); });

    $('.apya-req-views').on('click', '[data-view]', function () {
        state.view = $(this).attr('data-view');
        $('.apya-req-views [data-view]').each(function () {
            var on = $(this).attr('data-view') === state.view;
            $(this).toggleClass('is-active', on).attr('aria-pressed', on ? 'true' : 'false');
        });
        load();
    });

    // ---------- Çağrı penceresi ----------
    function openCallModal(grantId, call) {
        $('#CallForm')[0].reset();
        $('#CallGrantId').val(grantId);
        if (call) {
            $('#CallId').val(call.id);
            $('#CallPeriod').val(call.period);
            $('#CallStatus').val(String(call.status));
            $('#CallOpenDate').val(call.openDate ? call.openDate.substring(0, 10) : '');
            $('#CallDeadline').val(call.deadline ? call.deadline.substring(0, 10) : '');
            setMoney('#CallBudget', call.budget);
            $('#CallReference').val(call.reference || '');
            $('#CallModalTitle').text(l('Grants:Calls:Modal:EditTitle'));
        } else {
            // Yeni çağrı taslak doğar: yayına alma Parametreler'deki yayın kapısından geçer.
            $('#CallId').val('');
            $('#CallStatus').val(String(ST.Taslak));
            $('#CallModalTitle').text(l('Grants:Calls:Modal:NewTitle'));
        }
        callModal.show();
    }

    function target(el) {
        var $host = $(el).closest('[data-grant]');
        return {
            grantId: $host.attr('data-grant'),
            callId: $host.attr('data-call') || null,
            name: $host.attr('data-name'),
            period: $host.attr('data-period')
        };
    }

    function confirmDelete(titleKey, textKey, arg) {
        return Swal.fire({
            title: l(titleKey),
            text: l(textKey, arg),
            icon: 'warning', showCancelButton: true,
            confirmButtonText: l('Grants:Calls:Delete:Confirm'), cancelButtonText: l('Grants:Calls:Delete:Cancel'),
            confirmButtonColor: '#dc3545'
        });
    }

    $('.apya-page').on('click', '[data-act]', function () {
        var t = target(this);
        switch ($(this).attr('data-act')) {
            case 'add-call':
                openCallModal(t.grantId, null);
                break;
            case 'edit-call':
                // Kart bütçeyi taşımaz; pencere çağrının güncel hâliyle açılır.
                callService.get(t.callId).then(function (call) { openCallModal(t.grantId, call); });
                break;
            case 'delete-call':
                confirmDelete('Grants:Calls:DeleteCall:Title', 'Grants:Calls:DeleteCall:Text', t.name + ' · ' + t.period).then(function (r) {
                    if (!r.isConfirmed) { return; }
                    callService.delete(t.callId).then(function () { abp.notify.success(l('Grants:Calls:DeleteCall:Done')); load(); });
                });
                break;
            case 'delete-grant':
                confirmDelete('Grants:Calls:DeleteGrant:Title', 'Grants:Calls:DeleteGrant:Text', t.name).then(function (r) {
                    if (!r.isConfirmed) { return; }
                    grantService.delete(t.grantId).then(function () { abp.notify.success(l('Grants:Calls:DeleteGrant:Done')); load(); });
                });
                break;
        }
    });

    $('#CallForm').on('submit', function (e) {
        e.preventDefault();
        var period = $('#CallPeriod').val().trim();
        if (!period) { abp.notify.warn(l('Grants:Calls:Modal:PeriodRequired')); return; }
        var dto = {
            grantId: $('#CallGrantId').val(),
            period: period,
            status: parseInt($('#CallStatus').val(), 10),
            openDate: $('#CallOpenDate').val() || null,
            deadline: $('#CallDeadline').val() || null,
            budget: numOrNull('#CallBudget'),
            reference: $('#CallReference').val().trim() || null
        };
        var id = $('#CallId').val();
        var op = id ? callService.update(id, dto) : callService.create(dto);
        op.then(function (saved) {
            callModal.hide();
            abp.notify.success(l(id ? 'Grants:Calls:Modal:Updated' : 'Grants:Calls:Modal:Created'));
            // 18b · Bu kayıtta çağrı kapandıysa zincirin sonucu ayrıca duyurulur.
            if (saved && saved.closingSummary) {
                var s = saved.closingSummary;
                abp.message.info(l('Grants:CallClose:Summary')
                    .replace('{0}', s.missedInterestCount)
                    .replace('{1}', s.unfinishedApplicationCount)
                    .replace('{2}', s.notifiedFirmCount));
            }
            load();
        });
    });

    // ---------- Tümünü tara (Kaynaklar sekmesindeki düğmeyle aynı uç) ----------
    $('#ScrapeAllBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        sourceService.scrapeAll()
            .then(function (r) {
                abp.notify.success(l('Grants:Sources:ScrapeResult', r.sourceCount, r.skippedCount, r.newDraftCount));
                // Kazıyıcı bağlı değilken hepsi atlanır — sessiz başarısızlık yerine söyle.
                if (r.sourceCount > 0 && r.skippedCount === r.sourceCount) {
                    abp.message.info(l('Grants:Sources:ScraperNotConnected'));
                }
                return load();
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    load();
});
