/*
 * Takvim — PAYLAŞILAN konsol görünümü.
 *
 * Kanban/Gantt ile AYNI sözleşme: apya.taskCalendar.create({ mount, getFilter,
 * editModal }). Kapsamı çağıranın `getFilter`ı belirler, bileşende sabit
 * projectId YOKTUR.
 *
 * Veri: TaskDto.startDate / dueDate / status / title. Salt okuma — hücreye
 * tıklamak görev detayını açar, sürükleyip tarih DEĞİŞTİRMEZ (kısmi güncelleme
 * ucu repoda yok; Gantt'taki tarih sürükleme tam DTO ile UpdateAsync çağırır ve
 * o akış burada tekrar edilmedi).
 *
 * 🔴 Gün anahtarı ISO METNİNDEN kesilir, `new Date(...)` üzerinden hesaplanmaz.
 * Sunucu tarihleri UTC gece yarısı gönderiyor; yerel dönüşüm saat dilimine göre
 * kaydı bir gün öteye/geriye kaydırır. Izgara hücreleri de yerel yıl/ay/gün
 * sayılarından kurulur, araya Date dönüşümü girmez.
 */
(function (window) {
    'use strict';

    var apya = window.apya = window.apya || {};

    var l = (typeof abp !== 'undefined' && abp.localization)
        ? abp.localization.getResource('Platform')
        : function (k) { return k; };

    var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    var WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    var MAX_PER_DAY = 4;   // hücrede gösterilecek azami olay; kalanı '+N daha'

    // Kart rengi durum tonuna bağlanır — kanban.css'teki sınıflarla aynı aile.
    var STATUS_TONE = {
        0: 'neutral', 1: 'neutral', 2: 'warning', 3: 'brand', 4: 'positive'
    };

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function cellKey(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }

    /** ISO metninden gün anahtarı — Date'e HİÇ uğramaz. */
    function isoDayKey(iso) {
        if (!iso) { return null; }
        var m = /^(\d{4}-\d{2}-\d{2})/.exec(String(iso));
        return m ? m[1] : null;
    }

    function esc(s) {
        return $('<div/>').text(s == null ? '' : s).html();
    }

    function create(opts) {
        var $mount = $(opts.mount);
        var getFilter = typeof opts.getFilter === 'function' ? opts.getFilter : function () { return {}; };
        var editModal = opts.editModal || null;
        var taskSvc = apya.platform.tasks.task;
        // Süzgeç hızla değişince yanıtlar sırasız dönebilir: yalnız son istek çizer.
        var nextLoad = apya.latest();

        var now = new Date();
        var state = {
            loading: false,
            loadFailed: false,
            loadError: null,
            tasks: [],
            year: now.getFullYear(),
            month: now.getMonth(),
            // Hangi günün tam listesi açıldı (gün anahtarı -> true)
            expanded: {}
        };

        /** Gün anahtarı → olay listesi. Bir görev hem başlangıç hem termin basar. */
        function buildEvents() {
            var map = {};
            function push(iso, task, kind) {
                var key = isoDayKey(iso);
                if (!key) { return; }
                (map[key] = map[key] || []).push({ task: task, kind: kind });
            }
            $.each(state.tasks, function (_, t) {
                push(t.startDate, t, 'start');
                push(t.dueDate, t, 'due');
            });
            return map;
        }

        function monthCells() {
            var first = new Date(state.year, state.month, 1);
            var offset = (first.getDay() + 6) % 7;                       // Pazartesi = 0
            var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
            var cells = [];
            for (var i = 0; i < 42; i++) {
                var dayNo = i - offset + 1;
                cells.push(dayNo >= 1 && dayNo <= daysInMonth
                    ? { key: cellKey(state.year, state.month, dayNo), day: dayNo, inMonth: true }
                    : { key: 'bos-' + i, day: null, inMonth: false });
            }
            return cells;
        }

        function render() {
            if (state.loading) {
                $mount.html('<div class="apya-cal-loading apya-skeleton" style="height:420px"></div>');
                return;
            }
            // Hata anında ay başlığı ve gezinme çizilmez: gezinme veri istemez, boş ay "planlanmış
            // bir şey yok" yalanını basardı.
            if (state.loadFailed) {
                $mount.html(apya.loadState.errorHtml(l('Tasks:View:LoadFailed'), 'js-cal-retry', state.loadError));
                return;
            }

            var today = new Date();
            var todayKey = cellKey(today.getFullYear(), today.getMonth(), today.getDate());
            var events = buildEvents();

            var html = ''
                + '<div class="apya-cal">'
                + '  <div class="apya-cal-head">'
                + '    <h3 class="apya-cal-title">' + MONTHS[state.month] + ' ' + state.year + '</h3>'
                + '    <div class="apya-cal-nav">'
                + '      <button type="button" class="apya-cal-btn" data-cal="prev" aria-label="' + esc(l('Tasks:Calendar:PrevMonth')) + '"><i class="fa fa-chevron-left"></i></button>'
                + '      <button type="button" class="apya-cal-btn apya-cal-btn-text" data-cal="today">' + esc(l('Tasks:Calendar:Today')) + '</button>'
                + '      <button type="button" class="apya-cal-btn" data-cal="next" aria-label="' + esc(l('Tasks:Calendar:NextMonth')) + '"><i class="fa fa-chevron-right"></i></button>'
                + '    </div>'
                + '  </div>';

            if (state.tasks.length === 0) {
                // Boş durum ortak konsol kartıyla (tasarım 3a): tonlu ikon karesi
                // + başlık — liste panelinin boş hâliyle aynı görsel dil.
                html += '<div class="apya-console-state">'
                    + '<span class="apya-console-state-icon"><i class="fa fa-calendar-days" aria-hidden="true"></i></span>'
                    + '<strong>' + esc(l('Tasks:Calendar:Empty')) + '</strong>'
                    + '</div></div>';
                $mount.html(html);
                return;
            }

            html += '  <div class="apya-cal-weekdays">';
            $.each(WEEKDAYS, function (_, d) { html += '<span>' + d + '</span>'; });
            html += '  </div><div class="apya-cal-grid">';

            $.each(monthCells(), function (_, cell) {
                var tumOlaylar = cell.inMonth ? (events[cell.key] || []) : [];

                // Bir güne 16 kayıt düştüğünde hücre uzuyor ve o hafta satırının
                // TAMAMI devleşiyordu (ızgara satır yüksekliği en uzun hücreye göre).
                // İlk MAX_PER_DAY tanesi gösterilir, kalanı "+N daha" ile açılır —
                // gizlemek yerine istendiğinde göstermek.
                var acik = state.expanded[cell.key] === true;
                var dayEvents = acik ? tumOlaylar : tumOlaylar.slice(0, MAX_PER_DAY);
                var gizliSayi = tumOlaylar.length - dayEvents.length;

                html += '<div class="apya-cal-cell' + (cell.inMonth ? '' : ' apya-cal-cell-out') + '">';
                if (cell.inMonth) {
                    html += '<span class="apya-cal-day' + (cell.key === todayKey ? ' apya-cal-day-today' : '') + '">' + cell.day + '</span>';
                }
                $.each(dayEvents, function (_, ev) {
                    var tone = STATUS_TONE[ev.task.status] || 'neutral';
                    var icon = ev.kind === 'due' ? 'fa-flag-checkered' : 'fa-play';
                    html += '<button type="button" class="apya-cal-item apya-cal-item-' + tone + '"'
                          + ' data-open="' + ev.task.id + '"'
                          + ' title="' + esc(ev.task.title + ' — ' + (ev.kind === 'due' ? 'termin' : 'başlangıç')) + '">'
                          + '<i class="fa ' + icon + '"></i><span>' + esc(ev.task.title) + '</span></button>';
                });
                if (gizliSayi > 0) {
                    html += '<button type="button" class="apya-cal-more" data-more="' + cell.key + '">+' + gizliSayi + ' daha</button>';
                }
                html += '</div>';
            });

            html += '</div></div>';
            $mount.html(html);
        }

        function shift(delta) {
            state.expanded = {};   // yeni ayda eski açılmışlar taşınmasın
            var m = state.month + delta;
            state.year += Math.floor(m / 12);
            state.month = ((m % 12) + 12) % 12;
            render();
        }

        function bindUi() {
            $mount.on('click', '[data-cal]', function () {
                var act = $(this).data('cal');
                if (act === 'prev') { return shift(-1); }
                if (act === 'next') { return shift(1); }
                var t = new Date();
                state.year = t.getFullYear();
                state.month = t.getMonth();
                state.expanded = {};
                render();
            });

            $mount.on('click', '[data-more]', function () {
                state.expanded[$(this).data('more')] = true;
                render();
            });

            $mount.on('click', '[data-open]', function () {
                if (editModal) { editModal.open($(this).data('open')); }
            });

            $mount.on('click', '.js-cal-retry', function () { load(); });
        }

        function load() {
            var isLatest = nextLoad();
            state.loading = true;
            state.loadFailed = false;
            render();
            // getPoints: yalın projeksiyon (getList'in altı zenginleştirme turu
            // bu görünümde kullanılmıyordu). RootOnly sunucuda zaten kapatılıyor.
            // Yükleme hatası ABP penceresi değil satır içi kart (Faz 4 kararı 2).
            var filter = $.extend({ maxResultCount: 1000 }, getFilter());
            return Promise.resolve(taskSvc.getPoints(filter, { abpHandleError: false })).then(function (items) {
                if (!isLatest()) { return; }
                state.tasks = (items || []).filter(function (t) {
                    return !!(t.startDate || t.dueDate);
                });
                state.loading = false;
                render();
            }, function (err) {
                if (!isLatest()) { return; }
                state.loading = false;
                state.loadFailed = true;
                state.loadError = err;
                render();
            });
        }

        bindUi();
        return { load: load };
    }

    apya.taskCalendar = { create: create, isoDayKey: isoDayKey };
})(window);
