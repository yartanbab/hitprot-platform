$(function () {
    var service = apya.platform.grants.grantToday;
    var l = abp.localization.getResource('Platform');
    var isHost = $('.apya-today').data('host') === 1;

    // Enum değerleri sunucudakiyle birebir (GrantTodayItemKind / GrantTodayOwner / GrantNextAction).
    var KIND = ['UploadDocuments', 'CompleteForm', 'AppealDeadline', 'ReportDue', 'SubmitPackage',
        'WaitingOnFirm', 'LeadMeeting', 'DraftCallPublish', 'InterestReview', 'WaitingOnInstitution'];
    var ICON = ['fa-file-arrow-up', 'fa-pen-to-square', 'fa-gavel', 'fa-receipt', 'fa-cloud-arrow-up',
        'fa-hourglass-half', 'fa-phone', 'fa-pen-ruler', 'fa-handshake', 'fa-building-columns'];
    var NEXT = ['CompleteForm', 'UploadDocuments', 'WaitingOnConsultant', 'WaitingOnInstitution', 'InProject', 'Done'];

    var model = null;
    var owner = 0;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return Math.round(v).toLocaleString('tr-TR') + ' ₺'; }
    function fmtDate(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : ''; }
    function fmtDateTime(v) {
        return v ? new Date(v).toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '';
    }

    // Sayı içeren ek gerektiren kalıplar ('%22'si' gibi) bilinçle YOK; her cümle ek almayan kalıp.
    function greeting(name) {
        var h = new Date().getHours();
        var part = h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
        return name ? l('Grants:Today:Greeting:' + part, name) : l('Grants:Today:Greeting:' + part + ':NoName');
    }

    // Kime ait: kiracıda 'Grants:Today:<Kind>', host'ta önce ':Host' varyantı, yoksa ortak metin.
    function kindText(kind, suffix, args) {
        var base = 'Grants:Today:' + KIND[kind] + ':' + suffix;
        var hostKey = base + ':Host';
        var key = isHost && l(hostKey) !== hostKey ? hostKey : base;
        return l.apply(null, [key].concat(args));
    }

    function href(item) {
        switch (item.kind) {
            case 0: return isHost ? '/Grants/DetailHost?id=' + item.applicationId : '/Grants/Documents?id=' + item.applicationId;
            case 1: return '/Grants/Wizard?id=' + item.applicationId;
            case 2: return '/Grants/Appeal?id=' + item.applicationId;
            case 3: return '/Grants/Implementation?id=' + item.applicationId;
            case 4: case 5: case 9: return '/Grants/DetailHost?id=' + item.applicationId;
            case 6: return '/Grants/Leads';
            case 7: return '/Grants/Parameters?id=' + item.grantId;
            case 8: return '/Grants/Requests';
        }
        return '#';
    }

    // Kalan gün rozeti: renk yalnız zeminde, satır başına tek sinyal (10a).
    function deadlineChip(item) {
        if (item.kind === 6) {
            return '<span class="apya-chip apya-chip-accent apya-numeric"><i class="fa fa-clock"></i>' +
                esc(fmtDateTime(item.deadline)) + '</span>';
        }
        if (item.daysRemaining == null) { return ''; }
        var d = item.daysRemaining;
        var tone = d < 0 ? 'negative' : d <= 7 ? 'negative' : d <= 20 ? 'warning' : 'neutral';
        var text = d < 0 ? l('Grants:Today:DaysPast', -d) : d === 0 ? l('Grants:Today:DaysToday') : l('Grants:Today:DaysLeft', d);
        return '<span class="apya-chip apya-chip-' + tone + ' apya-numeric"><i class="fa fa-clock"></i>' + esc(text) + '</span>';
    }

    function itemCard(item) {
        var subject = isHost && item.firmName ? item.firmName : item.grantName;
        var title = kindText(item.kind, 'Title', [subject, item.value, item.grantName]);
        // Taslak çağrıda eksik alan yoksa cümle "yayınlayabilirsiniz" der; sayı sıfırla cümle kurmak yanıltırdı.
        var detailKey = item.kind === 7 && item.value === 0 ? 'DetailReady' : 'Detail';
        var detail = kindText(item.kind, detailKey, [item.grantName, item.value]);
        var meta = '';
        if (isHost && item.firmName && item.kind !== 6) {
            meta += '<span class="apya-today-item-firm">' + esc(item.firmName) + '</span>';
        }
        if (item.assignedUserName) {
            meta += '<span class="apya-today-item-firm">' + esc(l('Grants:Today:AssignedTo', item.assignedUserName)) + '</span>';
        }
        meta += deadlineChip(item);

        return '<a class="apya-today-item" href="' + href(item) + '" data-owner="' + item.owner + '">' +
            '<span class="apya-today-item-icon"><i class="fa ' + ICON[item.kind] + '"></i></span>' +
            '<span class="apya-today-item-body">' +
            '<span class="apya-today-item-title">' + esc(title) + '</span>' +
            '<span class="apya-today-item-detail">' + esc(detail) + '</span>' +
            '</span>' +
            '<span class="apya-today-item-meta">' + meta + '</span>' +
            '<span class="apya-today-item-cta">' + esc(kindText(item.kind, 'Cta', [])) + ' <i class="fa fa-chevron-right"></i></span>' +
            '</a>';
    }

    function paintHead(m) {
        var count = m.itemCount;
        // "0 dosyada 0 iş" yerine boş kutu cümlesi (QA'da yakalandı).
        var head = isHost
            ? (count === 0
                ? (m.firstName ? l('Grants:Today:Head:Host:None', m.firstName) : l('Grants:Today:Head:Host:None:NoName'))
                : (m.firstName
                    ? l('Grants:Today:Head:Host', m.firstName, m.fileCount, count)
                    : l('Grants:Today:Head:Host:NoName', m.fileCount, count)))
            : greeting(m.firstName) + ' ' + (count === 0 ? l('Grants:Today:Head:None') : l('Grants:Today:Head:Count', count));
        $('#TodayGreeting').text(head);

        var sub = [];
        if (isHost) {
            if (count > 0) {
                sub.push(l('Grants:Today:Sub:Near', m.nearDeadlineCount));
                sub.push(l('Grants:Today:Sub:Order'));
            }
        } else {
            if (m.nearestDeadlineDays != null && m.nearestGrantName) {
                sub.push(l('Grants:Today:Sub:Nearest', m.nearestDeadlineDays, m.nearestGrantName));
            }
            if (m.consultantItemCount > 0) {
                sub.push(l('Grants:Today:Sub:Consultant', m.consultantItemCount));
            }
        }
        $('#TodaySub').text(sub.join(' ')).toggleClass('d-none', sub.length === 0);
    }

    function visibleItems(list) {
        return isHost ? list.filter(function (i) { return i.owner === owner; }) : list;
    }

    function paintItems() {
        var top = visibleItems(model.items);
        // Boş sonuçta iskelet sonsuza dek parlardı — sınıf her boyamada düşer.
        $('#TodayItems').removeClass('apya-skel-cards').html(top.map(itemCard).join(''));
        $('#TodayEmpty').toggleClass('d-none', top.length > 0 || model.moreItems.length > 0);

        var more = visibleItems(model.moreItems);
        $('#TodayMore').toggleClass('d-none', more.length === 0);
        $('#TodayMoreTitle').text(isHost
            ? l('Grants:Today:More:Host', more.length)
            : l('Grants:Today:More', more.length));
        $('#TodayMoreItems').html(more.map(itemCard).join(''));
    }

    function paintHostTabs(m) {
        var all = m.items.concat(m.moreItems);
        var count = function (o) { return all.filter(function (i) { return i.owner === o; }).length; };
        $('#TabCountMine').text(count(0));
        $('#TabCountFirm').text(count(1));
        $('#TabCountInstitution').text(count(2));
    }

    $('.apya-today-tabs').on('click', '[data-owner]', function () {
        owner = Number($(this).data('owner'));
        $('.apya-today-tabs [data-owner]').removeClass('is-active');
        $(this).addClass('is-active');
        paintItems();
    });

    // ---------- Kiracı: fırsat, danışman, başvurular ----------
    function paintOpportunity(o) {
        var $card = $('#TodayOpportunity');
        if (!o) { $card.addClass('d-none'); return; }
        $card.removeClass('d-none').attr('href', '/Grants/Detail?id=' + o.grantCallId);
        var amount = o.maxAmount != null ? l('Grants:Today:Opportunity:Amount', money(o.maxAmount)) : '';
        $('#OpportunityTitle').text(l('Grants:Today:Opportunity:Title', o.issuer + ' · ' + o.grantName));
        $('#OpportunityDetail').text([
            l('Grants:Today:Opportunity:Recommended'),
            amount,
            o.daysRemaining != null ? l('Grants:Today:DaysLeft', o.daysRemaining) : ''
        ].filter(Boolean).join(' · '));
    }

    function paintConsultantItems(m) {
        var rows = m.consultantItems || [];
        $('#TodayConsultantItems').toggleClass('d-none', rows.length === 0);
        $('#TodayConsultantItemsTitle').text(l('Grants:Today:ConsultantItems', m.consultantItemCount));
        $('#TodayConsultantRows').html(rows.map(function (r) {
            var text = r.isWholeApplication
                ? l('Grants:Today:ConsultantItems:Whole', r.grantName)
                : l('Grants:Today:ConsultantItems:Docs', r.grantName, r.documentCount);
            return '<li><a class="apya-today-link" href="/Grants/Documents?id=' + r.applicationId + '">' + esc(text) + '</a></li>';
        }).join(''));
    }

    // 11c · Aşama adı yerine cümle: "Kurum dosyanızı inceliyor" gibi.
    function appSentence(a) {
        if (a.appealDaysLeft != null) { return l('Grants:Today:App:Rejected', a.appealDaysLeft); }
        return l('Grants:Today:App:' + NEXT[a.nextAction], a.nextActionValue);
    }

    function paintApps(list) {
        $('#TodayAppsEmpty').toggleClass('d-none', list.length > 0);
        $('#TodayApps').html(list.map(function (a) {
            var days = a.isClosed || a.daysRemaining == null ? ''
                : '<span class="apya-today-app-days apya-numeric">' +
                  esc(a.daysRemaining < 0 ? l('Grants:Today:DaysPast', -a.daysRemaining) : l('Grants:Today:DaysShort', a.daysRemaining)) + '</span>';
            var href = a.projectId ? '/Projects/ProjectDetails/' + a.projectId : '/Grants/MyApplications';
            return '<a class="apya-today-app' + (a.isClosed ? ' is-closed' : '') + '" href="' + href + '">' +
                '<span class="apya-today-app-body"><span class="apya-today-app-name">' + esc(a.grantName) + '</span>' +
                '<span class="apya-today-app-state">' + esc(appSentence(a)) + '</span></span>' + days + '</a>';
        }).join(''));
    }

    function paintConsultant(c) {
        $('#TodayConsultant').toggleClass('d-none', !c);
        if (!c) { return; }
        var initials = c.name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join('');
        $('#ConsultantInitials').text(initials);
        $('#ConsultantName').text(c.name);
        $('#ConsultantLink').attr('href', '/Grants/Wizard?id=' + c.applicationId);
    }

    service.get().then(function (m) {
        model = m;
        paintHead(m);
        if (isHost) {
            paintHostTabs(m);
            // İlk açılışta "Benim işlerim" boşsa dolu olan ilk sekmeye geç — boş ekranla karşılamayalım.
            var all = m.items.concat(m.moreItems);
            if (!all.some(function (i) { return i.owner === 0; })) {
                var first = all[0];
                if (first) {
                    owner = first.owner;
                    $('.apya-today-tabs [data-owner]').removeClass('is-active')
                        .filter('[data-owner="' + owner + '"]').addClass('is-active');
                }
            }
        }
        paintItems();
        if (!isHost) {
            paintOpportunity(m.opportunity);
            paintConsultantItems(m);
            paintApps(m.applications || []);
            paintConsultant(m.consultant);
        }
    });
});
