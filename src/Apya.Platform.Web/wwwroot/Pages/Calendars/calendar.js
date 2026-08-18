/*
 * Aylık takvim görünümü (HANDOFF: 7 kolonlu grid, renk-kodlu event pill'leri,
 * gün pop-over'ı, "Bu Hafta" ajandası).
 *
 * Veri tek uçtan gelir: CalendarAppService.GetFeedAsync — görev, fatura, hibe,
 * gider, gelir ve kasa hareketi aynı şekle indirgenmiş olarak döner. İzin
 * verilmeyen kaynak sunucuda hiç sorgulanmaz, ray sayacı sızdırmaz.
 * Renk YALNIZ risk için: gecikmiş kırmızı, bugün son gün amber, gerisi nötr.
 */
$(function () {
    var $grid = $('#cal-grid');
    if (!$grid.length) { return; }

    var DAY_MS = 86400000;
    var DOW_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    // CalendarSourceType (Domain.Shared) ile birebir.
    var SOURCE_META = {
        1: { label: 'Görev',  icon: 'fa-circle-check' },
        2: { label: 'Fatura', icon: 'fa-file-invoice' },
        3: { label: 'Hibe',   icon: 'fa-award' },
        4: { label: 'Gider',  icon: 'fa-arrow-trend-down' },
        5: { label: 'Gelir',  icon: 'fa-arrow-trend-up' },
        6: { label: 'Kasa',   icon: 'fa-wallet' }
    };
    // CalendarRiskLevel: 0 yok, 1 bugün son gün, 2 gecikmiş.
    var RISK_TONE = { 1: 'tone-warning', 2: 'tone-negative' };

    var calSvc = apya.platform.calendars.calendar;

    var today = stripTime(new Date());
    var viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function isoDay(d) {
        var p = function (n) { return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }
    function esc(s) { return $('<div>').text(s == null ? '' : String(s)).html(); }
    function money(v, cur) {
        try { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur || 'TRY', maximumFractionDigits: 0 }).format(v || 0); }
        catch (e) { return (v || 0) + ' ' + (cur || 'TRY'); }
    }
    // Haftanın pazartesisi (TR takvimi pazartesi başlar)
    function mondayOf(d) {
        var off = (d.getDay() + 6) % 7;
        return new Date(d.getTime() - off * DAY_MS);
    }
    function gridStart(month) { return mondayOf(new Date(month.getFullYear(), month.getMonth(), 1)); }

    /* ── Veri ── */

    function fetchEvents(from, to) {
        return calSvc.getFeed({ from: isoDay(from), to: isoDay(to) })
            .then(function (feed) {
                renderLegend(feed.sources || []);

                var byDay = {};
                (feed.items || []).forEach(function (item) {
                    var day = item.date.slice(0, 10);
                    var sub = item.subtitle || '';
                    if (item.amount != null) {
                        sub = sub ? sub + ' · ' + money(item.amount, item.currency) : money(item.amount, item.currency);
                    }
                    (byDay[day] = byDay[day] || []).push({
                        source: item.source,
                        tone: RISK_TONE[item.risk] || '',
                        done: item.isDone,
                        title: item.title,
                        sub: sub,
                        href: item.href || ''
                    });
                });
                return byDay;
            }, function () { return {}; });
    }

    // Renk anahtarı sunucudan gelen kaynak listesinden doğar: izin verilmeyen
    // kaynak hiç yazılmaz (kullanıcıya olmayan bir veri türü vaat edilmez).
    function renderLegend(sources) {
        var html = sources.filter(function (s) { return s.isAvailable; })
            .map(function (s) {
                var meta = SOURCE_META[s.source];
                return meta ? '<span><i class="fa ' + meta.icon + ' me-1"></i>' + meta.label + '</span>' : '';
            }).join('');
        $('#cal-legend-sources').html(html);
    }

    /* ── Ay grid'i ── */

    function pillHtml(ev, full) {
        var meta = SOURCE_META[ev.source];
        var icon = meta ? '<i class="fa ' + meta.icon + ' me-1"></i>' : '';
        var text = esc(ev.title) + (full && ev.sub ? ' <span class="text-muted">· ' + esc(ev.sub) + '</span>' : '');
        return '<button type="button" class="apya-cal-pill ' + ev.tone + (ev.done ? ' is-done' : '') +
            '" data-href="' + ev.href + '" title="' + esc(ev.title + (ev.sub ? ' — ' + ev.sub : '')) + '">' +
            icon + text + '</button>';
    }

    function renderMonth(byDay) {
        var start = gridStart(viewMonth);
        var html = DOW_LABELS.map(function (d) { return '<div class="apya-cal-dow">' + d + '</div>'; }).join('');

        for (var i = 0; i < 42; i++) {
            var d = new Date(start.getTime() + i * DAY_MS);
            var key = isoDay(d);
            var evs = byDay[key] || [];
            var cls = 'apya-cal-day'
                + (d.getMonth() !== viewMonth.getMonth() ? ' is-other' : '')
                + (d.getTime() === today.getTime() ? ' is-today' : '');

            var pills = evs.slice(0, 3).map(function (e) { return pillHtml(e, false); }).join('');
            if (evs.length > 3) {
                pills += '<button type="button" class="apya-cal-more">+' + (evs.length - 3) + ' daha</button>';
            }

            html += '<div class="' + cls + '" data-day="' + key + '">' +
                '<span class="apya-cal-num">' + d.getDate() + '</span>' + pills + '</div>';
        }

        $grid.html(html);
        $('#cal-title').text(new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(viewMonth));
    }

    var monthEvents = {};
    function loadMonth() {
        var start = gridStart(viewMonth);
        var end = new Date(start.getTime() + 41 * DAY_MS);
        fetchEvents(start, end).then(function (byDay) {
            monthEvents = byDay;
            renderMonth(byDay);
        });
    }

    /* ── Gün pop-over'ı ── */

    var $pop = $('<div class="apya-cal-popover" style="display:none"></div>').appendTo(document.body);

    function openPopover(dayKey, cell) {
        var evs = monthEvents[dayKey] || [];
        var d = new Date(dayKey + 'T00:00:00');
        var head = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).format(d);
        $pop.html(
            '<div class="apya-cal-popover-head"><span>' + head + '</span>' +
            '<button type="button" class="apya-cal-popover-close" aria-label="Kapat">✕</button></div>' +
            (evs.length
                ? evs.map(function (e) { return pillHtml(e, true); }).join('')
                : '<div class="apya-agenda-empty">Bu gün için planlanmış öğe yok.</div>')
        );
        // position:fixed — viewport koordinatları; sağ/alt kenarda taşmayı kıstır
        var rect = cell.getBoundingClientRect();
        var left = Math.min(rect.left, Math.max(8, window.innerWidth - 296));
        var top = rect.bottom + 4;
        $pop.css({ left: left + 'px', top: top + 'px', visibility: 'hidden' }).show();
        var ph = $pop.outerHeight();
        if (top + ph > window.innerHeight - 8) { top = Math.max(8, rect.top - ph - 4); }
        $pop.css({ top: top + 'px', visibility: 'visible' });
    }

    $grid.on('click', '.apya-cal-day', function (e) {
        if ($(e.target).closest('.apya-cal-pill').length) { return; }
        openPopover($(this).data('day'), this);
        e.stopPropagation();
    });
    $pop.on('click', '.apya-cal-popover-close', function (e) { $pop.hide(); e.stopPropagation(); });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.apya-cal-popover, .apya-cal-day').length) { $pop.hide(); }
    });
    $(document).on('click', '.apya-cal-pill', function () {
        var href = $(this).data('href');
        if (href) { window.location.href = href; }
    });

    /* ── Bu Hafta ajandası ── */

    function renderAgenda(byDay) {
        var start = mondayOf(today);
        var out = '';
        var any = false;
        for (var i = 0; i < 7; i++) {
            var d = new Date(start.getTime() + i * DAY_MS);
            var evs = byDay[isoDay(d)] || [];
            if (!evs.length) { continue; }
            any = true;
            var isToday = d.getTime() === today.getTime();
            out += '<div class="apya-agenda-day">' +
                '<div class="apya-agenda-date' + (isToday ? ' is-today' : '') + '">' +
                new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'short' }).format(d) +
                (isToday ? ' · Bugün' : '') + '</div>' +
                evs.map(function (e) { return pillHtml(e, true); }).join('') +
                '</div>';
        }
        $('#cal-agenda').html(any
            ? out
            : '<div class="apya-agenda-empty"><i class="fa fa-mug-hot d-block mb-2 fs-4 opacity-50"></i>Bu hafta planlanmış öğe yok.</div>');
    }

    function loadAgenda() {
        var start = mondayOf(today);
        var end = new Date(start.getTime() + 6 * DAY_MS);
        fetchEvents(start, end).then(renderAgenda);
    }

    /* ── Gezinme ── */

    $('#cal-prev').on('click', function () {
        viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
        $pop.hide(); loadMonth();
    });
    $('#cal-next').on('click', function () {
        viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
        $pop.hide(); loadMonth();
    });
    $('#cal-today').on('click', function () {
        viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        $pop.hide(); loadMonth();
    });

    loadMonth();
    loadAgenda();
});
