/*
 * Gösterge Paneli — PAYLAŞILAN konsol görünümü.
 *
 * Kanban/Gantt/Takvim/Galeri ile AYNI sözleşme: apya.taskDashboard.create({
 * mount, getFilter }). Ayrı Dashboard SAYFASINDAN farkı: bu panel o anki konsol
 * SÜZGECİNİ izler — filtre değişince aynı kapsamın dağılımını gösterir.
 *
 * SALT OKUMA, yeni uç YOK: sayılar zaten çekilen görev listesinden hesaplanır.
 * Renkler apyaChart üzerinden token'lardan okunur; grafiklerde ham hex yazılmaz
 * (DESIGN-SYSTEM §10.7). Tema değişiminde grafikler yeniden kurulur, aksi halde
 * koyu temaya geçince eski renklerle kalırlardı.
 */
(function (window) {
    'use strict';

    var apya = window.apya = window.apya || {};

    var l = (typeof abp !== 'undefined' && abp.localization)
        ? abp.localization.getResource('Platform')
        : function (k) { return k; };

    var STATUS_LABELS = { 0: 'İptal', 1: 'Yapılacak', 2: 'Sürüyor', 3: 'Testte', 4: 'Tamamlandı' };
    var STATUS_TONES = { 0: 'neutral', 1: 'neutral', 2: 'warning', 3: 'brand', 4: 'positive' };
    var PRIORITY_LABELS = { 1: 'Düşük', 2: 'Orta', 3: 'Yüksek', 4: 'Kritik' };
    var PRIORITY_TONES = { 1: 'neutral', 2: 'warning', 3: 'negative', 4: 'negative' };

    var OPEN_STATUSES = [1, 2, 3];
    var TOP_ASSIGNEES = 8;   // kuyruk "Diğer"de toplanır, eksen okunaksızlaşmasın

    function esc(s) {
        return $('<div/>').text(s == null ? '' : s).html();
    }

    /** Gecikme ölçüsü gün bazında: saat farkı yüzünden "bugün" gecikmiş sayılmasın. */
    function isOverdue(task, today) {
        if (!task.dueDate || OPEN_STATUSES.indexOf(task.status) === -1) { return false; }
        var due = new Date(task.dueDate);
        if (isNaN(due.getTime())) { return false; }
        return due.setHours(0, 0, 0, 0) < today;
    }

    function countBy(tasks, keyFn) {
        var map = {};
        $.each(tasks, function (_, t) {
            var k = keyFn(t);
            map[k] = (map[k] || 0) + 1;
        });
        return map;
    }

    function create(opts) {
        var $mount = $(opts.mount);
        var getFilter = typeof opts.getFilter === 'function' ? opts.getFilter : function () { return {}; };
        var taskSvc = apya.platform.tasks.task;

        var state = { loading: false, tasks: [] };
        var charts = [];

        function destroyCharts() {
            $.each(charts, function (_, c) { if (c) { c.destroy(); } });
            charts = [];
        }

        function stat(label, value, tone) {
            return '<div class="apya-dash-stat apya-dash-stat-' + tone + '">'
                 + '<span class="apya-dash-stat-value apya-numeric">' + value + '</span>'
                 + '<span class="apya-dash-stat-label">' + esc(label) + '</span>'
                 + '</div>';
        }

        function render() {
            destroyCharts();

            if (state.loading) {
                $mount.html('<div class="apya-dash apya-skeleton" style="height:420px"></div>');
                return;
            }
            if (state.tasks.length === 0) {
                $mount.html('<p class="apya-dash-empty">' + esc(l('Tasks:Dashboard:Empty')) + '</p>');
                return;
            }

            var today = new Date().setHours(0, 0, 0, 0);
            var done = 0, overdue = 0;
            $.each(state.tasks, function (_, t) {
                if (t.status === 4) { done++; }
                if (isOverdue(t, today)) { overdue++; }
            });

            $mount.html(''
                + '<div class="apya-dash">'
                + '  <div class="apya-dash-stats">'
                +      stat(l('Tasks:Dashboard:Total'), state.tasks.length, 'neutral')
                +      stat(l('Tasks:Dashboard:Done'), done, 'positive')
                +      stat(l('Tasks:Dashboard:Overdue'), overdue, 'negative')
                + '  </div>'
                + '  <div class="apya-dash-charts">'
                + '    <section class="apya-dash-card"><h3>' + esc(l('Tasks:Dashboard:ByStatus')) + '</h3><div class="apya-dash-canvas"><canvas id="dash-status"></canvas></div></section>'
                + '    <section class="apya-dash-card"><h3>' + esc(l('Tasks:Dashboard:ByPriority')) + '</h3><div class="apya-dash-canvas"><canvas id="dash-priority"></canvas></div></section>'
                + '    <section class="apya-dash-card apya-dash-card-wide"><h3>' + esc(l('Tasks:Dashboard:ByAssignee')) + '</h3><div class="apya-dash-canvas"><canvas id="dash-assignee"></canvas></div></section>'
                + '  </div>'
                + '</div>');

            if (typeof Chart === 'undefined' || typeof apyaChart === 'undefined') {
                // Grafik kütüphanesi yüklenmediyse sayaçlar yine de dursun; sessiz
                // boş kutu bırakmak yerine durumu söyleyelim.
                $mount.find('.apya-dash-charts').html('<p class="apya-dash-empty">Grafik bileşeni yüklenemedi.</p>');
                return;
            }

            buildDoughnut('#dash-status', countBy(state.tasks, function (t) { return t.status; }),
                STATUS_LABELS, STATUS_TONES);
            buildDoughnut('#dash-priority', countBy(state.tasks, function (t) { return t.priority; }),
                PRIORITY_LABELS, PRIORITY_TONES);
            buildAssigneeBar('#dash-assignee');
        }

        function buildDoughnut(sel, counts, labels, tones) {
            var ctx = $mount.find(sel)[0];
            if (!ctx) { return; }
            var keys = Object.keys(counts).sort();
            charts.push(new Chart(ctx, apyaChart.options({
                type: 'doughnut',
                data: {
                    labels: keys.map(function (k) { return labels[k] || k; }),
                    datasets: [{
                        data: keys.map(function (k) { return counts[k]; }),
                        backgroundColor: keys.map(function (k) { return apyaChart.tone(tones[k] || 'neutral'); }),
                        borderWidth: 0
                    }]
                },
                options: { plugins: { legend: { position: 'bottom' } } }
            })));
        }

        function buildAssigneeBar(sel) {
            var ctx = $mount.find(sel)[0];
            if (!ctx) { return; }

            var counts = countBy(state.tasks, function (t) {
                return t.assigneeName || l('Tasks:Dashboard:Unassigned');
            });
            var pairs = Object.keys(counts).map(function (k) { return { name: k, n: counts[k] }; })
                .sort(function (a, b) { return b.n - a.n; });

            // Kuyruk tek "Diğer" barında toplanır — toplam korunur, eksen okunur kalır.
            if (pairs.length > TOP_ASSIGNEES) {
                var rest = pairs.slice(TOP_ASSIGNEES).reduce(function (sum, p) { return sum + p.n; }, 0);
                pairs = pairs.slice(0, TOP_ASSIGNEES).concat([{ name: 'Diğer', n: rest }]);
            }

            charts.push(new Chart(ctx, apyaChart.options({
                type: 'bar',
                data: {
                    labels: pairs.map(function (p) { return p.name; }),
                    datasets: [{
                        label: l('Tasks:Dashboard:Total'),
                        data: pairs.map(function (p) { return p.n; }),
                        backgroundColor: apyaChart.alpha(apyaChart.tone('brand'), 0.75),
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { x: { ticks: { precision: 0 } } }
                }
            })));
        }

        function load() {
            state.loading = true;
            render();
            // getPoints: yalın projeksiyon — dağılım için başlık/durum/öncelik/
            // atanan/termin yetiyor. RootOnly sunucuda kapatılıyor (tüm görevler).
            var filter = $.extend({ maxResultCount: 1000 }, getFilter());
            return taskSvc.getPoints(filter).then(function (items) {
                state.tasks = items || [];
                state.loading = false;
                render();
            });
        }

        if (typeof apyaChart !== 'undefined') {
            // Tema değişiminde renkler token'lardan yeniden okunsun.
            apyaChart.onThemeChange(function () { if (state.tasks.length) { render(); } });
        }

        return { load: load };
    }

    apya.taskDashboard = { create: create };
})(window);
