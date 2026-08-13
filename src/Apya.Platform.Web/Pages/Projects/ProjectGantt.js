/*
 * Proje konsolu — Zaman Çizelgesi (Gantt).
 * Handoff "Proje Detay — operasyon konsolu" 7. adım.
 *
 * Sayfaya özel: /Board ve /Tasks'taki frappe-gantt'a DOKUNMAZ (o ayrı bir
 * bileşen). Kanban modülüyle aynı sözleşme: apya.projectGantt.create(opts).
 *
 * Veri: TaskDto.startDate / dueDate / status / assigneeName / parentTaskId /
 * predecessorIds. BASELINE ÇİZİLMEZ — backend'de baselineStart/End alanı yok.
 */
(function (window) {
    'use strict';

    var apya = window.apya = window.apya || {};

    var LABEL_W = 330;   // etiket kolonu (handoff ölçüsü)
    var ROW_H = 36;
    var ZOOMS = {
        gun:    { pxPerDay: 34, step: 1,  label: 'Gün' },
        hafta:  { pxPerDay: 11, step: 7,  label: 'Hafta' },
        ay:     { pxPerDay: 3.6, step: 7, label: 'Ay' },
        ceyrek: { pxPerDay: 1.5, step: 30, label: 'Çeyrek' }
    };
    var CAPACITY_THRESHOLD = 5; // eş zamanlı aktif görev (handoff)

    function create(opts) {
        var $mount = $(opts.mount);
        var getFilter = typeof opts.getFilter === 'function' ? opts.getFilter : function () { return {}; };
        var editModal = opts.editModal || null;
        var canEdit = opts.canEdit !== false;
        var onSaved = typeof opts.onSaved === 'function' ? opts.onSaved : function () { };
        var taskSvc = apya.platform.tasks.task;

        var state = {
            zoom: 'ay',
            group: 'none',
            critical: false,
            capacity: true,
            tasks: [],
            pending: {},        // taskId -> {start, due} (kaydedilmemiş sürükleme)
            loading: false
        };

        // ---------- yardımcılar ----------
        function day(d) { return moment(d).startOf('day'); }
        function isClosed(t) { return t.status === 4 || t.status === 0; }
        function taskStart(t) {
            var p = state.pending[t.id];
            return day(p ? p.start : t.startDate);
        }
        function taskEnd(t) {
            var p = state.pending[t.id];
            var due = p ? p.due : t.dueDate;
            // Bitişi olmayan görev tek günlük çizilir (aksi halde bar üretilemez).
            return due ? day(due) : taskStart(t);
        }
        function isOverdue(t) {
            return !isClosed(t) && t.dueDate && day(t.dueDate).isBefore(day(new Date()));
        }

        // Pencere: tüm görevlerin min/max'ı + bugün, iki yana pay.
        function window_() {
            var min = null, max = null;
            state.tasks.forEach(function (t) {
                var s = taskStart(t), e = taskEnd(t);
                if (!min || s.isBefore(min)) { min = s.clone(); }
                if (!max || e.isAfter(max)) { max = e.clone(); }
            });
            var today = day(new Date());
            if (!min || today.isBefore(min)) { min = today.clone(); }
            if (!max || today.isAfter(max)) { max = today.clone(); }
            var pad = state.zoom === 'gun' ? 2 : 7;
            return { from: min.clone().subtract(pad, 'days'), to: max.clone().add(pad, 'days') };
        }
        // Gün/px yoğunluğu zoom'un TABANI ile "eldeki genişliği doldur"un BÜYÜĞÜ.
        // Sabit taban tek başına yetmiyor: 3 günlük görevleri olan bir projede
        // Ay zoom'u (3.6px/gün) tüm çizelgeyi ~60px'e sıkıştırıp barları nokta
        // haline getiriyordu (canlıda görüldü). Uzun projelerde taban kazanır ve
        // çizelge yatay kaydırılır.
        function computePpd(w) {
            var base = ZOOMS[state.zoom].pxPerDay;
            var avail = Math.max(240, ($mount.innerWidth() || 900) - LABEL_W - 24);
            var days = Math.max(1, w.to.diff(w.from, 'days'));
            return Math.max(base, avail / days);
        }
        function pxPerDay() { return state.ppd || ZOOMS[state.zoom].pxPerDay; }
        function xOf(w, d) { return day(d).diff(w.from, 'days') * pxPerDay(); }
        function contentW(w) { return Math.max(1, w.to.diff(w.from, 'days') * pxPerDay()); }

        // ---------- kritik yol ----------
        // predecessorIds üzerinden en uzun süre zinciri. Döngüye karşı korumalı.
        function criticalSet() {
            var byId = {};
            state.tasks.forEach(function (t) { byId[t.id] = t; });
            // Hiç bağımlılık yoksa "kritik yol" diye bir şey yok: en uzun zincir
            // her görev için kendi süresi olur ve HEPSİ işaretlenirdi (yanıltıcı).
            var anyDep = state.tasks.some(function (t) {
                return (t.predecessorIds || []).some(function (p) { return !!byId[p]; });
            });
            if (!anyDep) { return {}; }
            var memo = {}, guard = {};
            function longest(id) {
                if (memo[id] !== undefined) { return memo[id]; }
                if (guard[id]) { return 0; }      // döngü — 0 dön, zinciri kes
                guard[id] = true;
                var t = byId[id];
                var own = t ? Math.max(1, taskEnd(t).diff(taskStart(t), 'days') + 1) : 0;
                var best = 0;
                ((t && t.predecessorIds) || []).forEach(function (p) {
                    if (byId[p]) { best = Math.max(best, longest(p)); }
                });
                guard[id] = false;
                memo[id] = own + best;
                return memo[id];
            }
            var scores = state.tasks.map(function (t) { return { id: t.id, v: longest(t.id) }; });
            if (!scores.length) { return {}; }
            var max = Math.max.apply(null, scores.map(function (s) { return s.v; }));
            // En uzun zincirdeki görev ve tüm ataları kritik sayılır.
            var set = {};
            function markChain(id) {
                if (!byId[id] || set[id]) { return; }
                set[id] = true;
                ((byId[id].predecessorIds) || []).forEach(markChain);
            }
            scores.filter(function (s) { return s.v === max; }).forEach(function (s) { markChain(s.id); });
            return set;
        }

        // ---------- gruplama ----------
        var STATUS_NAMES = { 0: 'İptal', 1: 'Yapılacak', 2: 'Sürüyor', 3: 'Testte', 4: 'Tamamlandı' };
        function lanes() {
            if (state.group === 'none') { return [{ title: null, rows: sortRows(state.tasks) }]; }
            var map = {};
            state.tasks.forEach(function (t) {
                var k = state.group === 'assignee'
                    ? (t.assigneeName || 'Atanmamış')
                    : (STATUS_NAMES[t.status] || 'Bilinmiyor');
                (map[k] = map[k] || []).push(t);
            });
            return Object.keys(map).sort().map(function (k) {
                return { title: k, rows: sortRows(map[k]) };
            });
        }
        // Üst görev → hemen altında alt görevleri (hiyerarşi görünürlüğü).
        function sortRows(list) {
            var byParent = {}, roots = [];
            var ids = {};
            list.forEach(function (t) { ids[t.id] = true; });
            list.forEach(function (t) {
                if (t.parentTaskId && ids[t.parentTaskId]) {
                    (byParent[t.parentTaskId] = byParent[t.parentTaskId] || []).push(t);
                } else { roots.push(t); }
            });
            function byStart(a, b) { return taskStart(a).valueOf() - taskStart(b).valueOf(); }
            roots.sort(byStart);
            var out = [];
            roots.forEach(function (r) {
                out.push(r);
                (byParent[r.id] || []).sort(byStart).forEach(function (c) { out.push(c); });
            });
            return out;
        }

        // ---------- eksen ----------
        function ticks(w) {
            var out = [];
            var cur = w.from.clone();
            // Ay/çeyrek/hafta dilimleri pencere BAŞLANGICINDAN ÖNCE başlayabilir
            // (ör. ay başı). Kırpılmazsa etiket negatif konuma düşüp görünmez
            // oluyordu (canlıda görüldü).
            var clamp = function (list) {
                var total = contentW(w);
                return list.map(function (t) {
                    var x = t.x, wd = t.w;
                    if (x < 0) { wd += x; x = 0; }
                    if (x + wd > total) { wd = total - x; }
                    return $.extend({}, t, { x: x, w: Math.max(0, wd) });
                }).filter(function (t) { return t.w > 0; });
            };
            if (state.zoom === 'gun') {
                while (cur.isSameOrBefore(w.to)) {
                    out.push({ x: xOf(w, cur), w: pxPerDay(), label: cur.format('D'), weekend: cur.day() === 0 || cur.day() === 6 });
                    cur.add(1, 'day');
                }
            } else if (state.zoom === 'hafta') {
                cur = cur.clone().startOf('isoWeek');
                while (cur.isSameOrBefore(w.to)) {
                    out.push({ x: xOf(w, cur), w: 7 * pxPerDay(), label: cur.format('D MMM') });
                    cur.add(7, 'days');
                }
            } else if (state.zoom === 'ay') {
                cur = cur.clone().startOf('month');
                while (cur.isSameOrBefore(w.to)) {
                    var next = cur.clone().add(1, 'month');
                    out.push({ x: xOf(w, cur), w: next.diff(cur, 'days') * pxPerDay(), label: cur.format('MMM YYYY') });
                    cur = next;
                }
            } else {
                cur = cur.clone().startOf('quarter');
                while (cur.isSameOrBefore(w.to)) {
                    var nq = cur.clone().add(1, 'quarter');
                    out.push({ x: xOf(w, cur), w: nq.diff(cur, 'days') * pxPerDay(), label: cur.format('YYYY') + ' Ç' + cur.quarter() });
                    cur = nq;
                }
            }
            return clamp(out);
        }

        // ---------- kapasite ----------
        function capacityRows(w) {
            var buckets = state.zoom === 'gun' ? 1 : (state.zoom === 'hafta' ? 7 : 14);
            var total = Math.max(1, Math.ceil(w.to.diff(w.from, 'days') / buckets));
            var people = {};
            state.tasks.forEach(function (t) {
                if (isClosed(t)) { return; }
                var name = t.assigneeName || 'Atanmamış';
                var arr = people[name] = people[name] || new Array(total).fill(0);
                var s = Math.max(0, Math.floor(taskStart(t).diff(w.from, 'days') / buckets));
                var e = Math.min(total - 1, Math.floor(taskEnd(t).diff(w.from, 'days') / buckets));
                for (var i = s; i <= e; i++) { arr[i]++; }
            });
            return Object.keys(people).sort().map(function (name) {
                var cells = people[name];
                return { name: name, cells: cells, peak: Math.max.apply(null, cells.concat([0])) };
            });
        }

        // ---------- render ----------
        function esc(s) { return $('<div>').text(s == null ? '' : String(s)).html(); }

        function render() {
            if (state.loading) {
                $mount.html('<div class="apya-gantt-empty">Zaman çizelgesi yükleniyor…</div>');
                return;
            }
            if (!state.tasks.length) {
                $mount.html('<div class="apya-gantt-empty">Bu filtrede zaman çizelgesine çizilecek görev yok.</div>');
                return;
            }

            var w = window_();
            state.ppd = computePpd(w);   // xOf/contentW bunu okur
            var cw = contentW(w);
            var crit = state.critical ? criticalSet() : {};
            var tks = ticks(w);
            var todayX = xOf(w, new Date());
            var pendCount = Object.keys(state.pending).length;

            var html = '<div class="apya-gantt">';

            // araç çubuğu
            html += '<div class="apya-gantt-toolbar">' +
                '<span class="apya-console-filter-label">Zoom</span>' +
                Object.keys(ZOOMS).map(function (z) {
                    return '<button type="button" class="apya-gantt-seg" data-zoom="' + z + '" aria-pressed="' +
                        (state.zoom === z) + '">' + ZOOMS[z].label + '</button>';
                }).join('') +
                '<span class="apya-gantt-sep"></span>' +
                '<span class="apya-console-filter-label">Grupla</span>' +
                [['none', 'Yok'], ['assignee', 'Atanan'], ['status', 'Durum']].map(function (g) {
                    return '<button type="button" class="apya-gantt-seg" data-group="' + g[0] + '" aria-pressed="' +
                        (state.group === g[0]) + '">' + g[1] + '</button>';
                }).join('') +
                '<span class="apya-gantt-sep"></span>' +
                '<button type="button" class="apya-gantt-seg" data-toggle="critical" aria-pressed="' + state.critical + '">' +
                '<i class="fa fa-diagram-project me-1"></i>Kritik yol</button>' +
                '<button type="button" class="apya-gantt-seg" data-toggle="capacity" aria-pressed="' + state.capacity + '">' +
                '<i class="fa fa-chart-simple me-1"></i>Kapasite</button>' +
                '<span class="apya-gantt-spacer"></span>' +
                '<span class="apya-gantt-hint">' +
                (canEdit ? 'Barı sürükle: tarihi ötele · sağ kenar: süreyi uzat' : 'Salt görüntüleme') +
                '</span></div>';

            // kaydedilmemiş değişiklik şeridi
            if (pendCount) {
                html += '<div class="apya-gantt-pending"><div class="apya-gantt-pending-head">' +
                    '<i class="fa fa-clock-rotate-left"></i>' +
                    '<strong>' + pendCount + ' görevde kaydedilmemiş tarih değişikliği</strong>' +
                    '<span class="apya-gantt-spacer"></span>' +
                    '<button type="button" class="apya-gantt-btn" data-act="discard">Vazgeç</button>' +
                    '<button type="button" class="apya-gantt-btn is-primary" data-act="save">Kaydet</button>' +
                    '</div>' + pendingList() + warnings() + '</div>';
            }

            html += '<div class="apya-gantt-scroll"><div class="apya-gantt-inner" style="width:' + (LABEL_W + cw) + 'px">';

            // eksen
            html += '<div class="apya-gantt-axis"><div class="apya-gantt-axis-label">Görev / Alt görev</div>' +
                '<div class="apya-gantt-axis-ticks" style="width:' + cw + 'px">';
            tks.forEach(function (t) {
                html += '<div class="apya-gantt-tick' + (t.weekend ? ' is-weekend' : '') +
                    '" style="left:' + t.x + 'px;width:' + t.w + 'px">' + esc(t.label) + '</div>';
            });
            if (state.zoom !== 'gun') {
                html += '<span class="apya-gantt-todaylabel" style="left:' + todayX + 'px">BUGÜN</span>';
            }
            html += '</div></div>';

            // satırlar
            html += '<div class="apya-gantt-rows">';
            lanes().forEach(function (lane) {
                if (lane.title) {
                    var over = lane.rows.filter(function (t) { return !isClosed(t); }).length;
                    html += '<div class="apya-gantt-lane"><span>' + esc(lane.title) + '</span>' +
                        '<span class="apya-gantt-lane-meta">' + lane.rows.length + ' görev · ' + over + ' açık</span></div>';
                }
                lane.rows.forEach(function (t) {
                    html += rowHtml(t, w, cw, crit, todayX, tks);
                });
            });
            html += '</div></div></div>'; // rows, inner, scroll

            if (state.capacity) { html += capacityHtml(w); }
            html += legendHtml();
            html += '</div>';

            $mount.html(html);
            drawDeps(w);
        }

        function rowHtml(t, w, cw, crit, todayX, tks) {
            var sub = !!t.parentTaskId;
            var x = xOf(w, taskStart(t));
            var wid = Math.max(6, (taskEnd(t).diff(taskStart(t), 'days') + 1) * pxPerDay());
            var tone = isOverdue(t) ? 'is-negative' : (isClosed(t) ? 'is-positive' : (sub ? 'is-sub' : 'is-accent'));
            var pending = !!state.pending[t.id];

            // İlerleme dolgusu: tamamlandıysa %100, sürüyorsa geçen süre oranı.
            var pct = t.status === 4 ? 100 : (function () {
                var total = taskEnd(t).diff(taskStart(t), 'days') + 1;
                var gone = day(new Date()).diff(taskStart(t), 'days') + 1;
                return Math.max(0, Math.min(100, Math.round(gone / total * 100)));
            })();

            var h = '<div class="apya-gantt-row' + (sub ? ' is-sub' : '') + '" data-id="' + t.id + '">';
            h += '<div class="apya-gantt-rowlabel" data-open="' + t.id + '">' +
                (sub ? '<i class="fa fa-arrow-turn-up apya-gantt-conn"></i>' : '') +
                '<span class="apya-gantt-title">' + esc(t.title) + '</span>' +
                (t.assigneeName ? '<span class="apya-gantt-who">' + esc(t.assigneeName) + '</span>' : '') +
                '</div>';
            h += '<div class="apya-gantt-track" style="width:' + cw + 'px">';
            tks.forEach(function (tk) {
                if (tk.weekend) { h += '<span class="apya-gantt-weekend" style="left:' + tk.x + 'px;width:' + tk.w + 'px"></span>'; }
            });
            h += '<span class="apya-gantt-today" style="left:' + todayX + 'px"></span>';
            h += '<span class="apya-gantt-bar ' + tone + (crit[t.id] ? ' is-critical' : '') + (pending ? ' is-pending' : '') +
                '" data-bar="' + t.id + '" style="left:' + x + 'px;width:' + wid + 'px" ' +
                'title="' + esc(t.title + ' · ' + taskStart(t).format('DD.MM.YYYY') + ' → ' + taskEnd(t).format('DD.MM.YYYY')) + '">' +
                '<span class="apya-gantt-fill" style="width:' + pct + '%"></span>' +
                (canEdit ? '<span class="apya-gantt-handle" data-handle="' + t.id + '"></span>' : '') +
                '</span>';
            h += '</div></div>';
            return h;
        }

        function pendingList() {
            var byId = {};
            state.tasks.forEach(function (t) { byId[t.id] = t; });
            return '<div class="apya-gantt-pending-list">' + Object.keys(state.pending).map(function (id) {
                var t = byId[id], p = state.pending[id];
                if (!t) { return ''; }
                return '<span>' + esc(t.title) + ': ' + day(p.start).format('DD.MM') + ' → ' + day(p.due).format('DD.MM') + '</span>';
            }).join('') + '</div>';
        }

        // Alt görev üst görevin aralığını aşarsa uyar (handoff: otomatik genişletme YOK).
        function warnings() {
            var byId = {};
            state.tasks.forEach(function (t) { byId[t.id] = t; });
            var out = [];
            state.tasks.forEach(function (t) {
                if (!t.parentTaskId || !byId[t.parentTaskId]) { return; }
                var p = byId[t.parentTaskId];
                if (taskStart(t).isBefore(taskStart(p)) || taskEnd(t).isAfter(taskEnd(p))) {
                    out.push('<span class="apya-gantt-warn"><i class="fa fa-triangle-exclamation"></i>' +
                        esc(t.title) + ' üst görevin aralığını aşıyor</span>');
                }
            });
            return out.join('');
        }

        function capacityHtml(w) {
            var rows = capacityRows(w);
            if (!rows.length) { return ''; }
            var h = '<div class="apya-gantt-capacity"><div class="apya-gantt-capacity-head">' +
                '<span class="apya-console-filter-label">Kapasite · eş zamanlı aktif görev · eşik ' + CAPACITY_THRESHOLD + '</span></div>';
            rows.forEach(function (r) {
                h += '<div class="apya-gantt-capacity-row"><span class="apya-gantt-capacity-name">' + esc(r.name) + '</span>' +
                    '<span class="apya-gantt-capacity-cells">' +
                    r.cells.map(function (c) {
                        var lvl = c === 0 ? 0 : (c <= 2 ? 1 : (c <= 4 ? 2 : 3));
                        return '<span class="apya-gantt-cap-cell lvl-' + lvl + '" title="' + c + ' görev"></span>';
                    }).join('') + '</span>' +
                    '<span class="apya-gantt-cap-peak' + (r.peak >= CAPACITY_THRESHOLD ? ' is-over' : '') + '">' +
                    r.peak + ' / ' + CAPACITY_THRESHOLD + '</span></div>';
            });
            return h + '</div>';
        }

        function legendHtml() {
            return '<div class="apya-gantt-legend">' +
                '<span><i class="apya-gantt-key is-accent"></i>Süren (dolgu = geçen süre)</span>' +
                '<span><i class="apya-gantt-key is-positive"></i>Tamamlandı</span>' +
                '<span><i class="apya-gantt-key is-negative"></i>Gecikmiş</span>' +
                '<span><i class="apya-gantt-key is-sub"></i>Alt görev</span>' +
                '<span><i class="apya-gantt-key is-today"></i>Bugün · ' + moment().format('DD.MM.YYYY') + '</span>' +
                '<span class="apya-gantt-spacer"></span>' +
                '<span class="apya-gantt-hint">Baseline ve sapma rozeti çizilmiyor — backend alanı yok.</span>' +
                '</div>';
        }

        // Bağımlılık okları: yalnız gruplamasız görünümde (handoff).
        function drawDeps(w) {
            if (state.group !== 'none') { return; }
            var $rows = $mount.find('.apya-gantt-row');
            var pos = {};
            $rows.each(function (i) {
                pos[$(this).data('id')] = { i: i, el: this };
            });
            var segs = [];
            state.tasks.forEach(function (t) {
                (t.predecessorIds || []).forEach(function (pid) {
                    if (!pos[pid] || !pos[t.id]) { return; }
                    var fromX = xOf(w, taskEnd(state.tasks.filter(function (x) { return x.id === pid; })[0]));
                    var toX = xOf(w, taskStart(t));
                    segs.push({ fromRow: pos[pid].i, toRow: pos[t.id].i, fromX: fromX + pxPerDay(), toX: toX });
                });
            });
            if (!segs.length) { return; }
            var svg = segs.map(function (s) {
                var y1 = s.fromRow * ROW_H + ROW_H / 2;
                var y2 = s.toRow * ROW_H + ROW_H / 2;
                var midX = Math.max(s.fromX + 8, s.toX - 8);
                return '<path d="M' + s.fromX + ' ' + y1 + ' H' + midX + ' V' + y2 + ' H' + s.toX + '" />' +
                       '<circle cx="' + s.toX + '" cy="' + y2 + '" r="2.5" />';
            }).join('');
            $mount.find('.apya-gantt-rows').append(
                '<svg class="apya-gantt-deps" style="left:' + LABEL_W + 'px">' + svg + '</svg>');
        }

        // ---------- sürükleme ----------
        function bindDrag() {
            if (!canEdit) { return; }
            $mount.off('pointerdown.gantt').on('pointerdown.gantt', '[data-bar]', function (e) {
                var id = $(this).data('bar');
                var resizing = $(e.target).is('[data-handle]');
                var t = state.tasks.filter(function (x) { return x.id === id; })[0];
                if (!t) { return; }
                e.preventDefault();
                var startX = e.clientX;
                var origStart = taskStart(t).clone();
                var origEnd = taskEnd(t).clone();
                var ppd = pxPerDay();

                function move(ev) {
                    var deltaDays = Math.round((ev.clientX - startX) / ppd);
                    if (!deltaDays) { return; }
                    var ns = origStart.clone(), ne = origEnd.clone();
                    if (resizing) {
                        ne = origEnd.clone().add(deltaDays, 'days');
                        if (ne.isBefore(ns)) { ne = ns.clone(); }
                    } else {
                        ns = origStart.clone().add(deltaDays, 'days');
                        ne = origEnd.clone().add(deltaDays, 'days');
                    }
                    // YEREL biçim, toISOString DEĞİL: UTC'ye çevirmek UTC+3'te
                    // yerel gece yarısını bir önceki güne kaydırıyor, sunucu da
                    // saat dilimsiz geri döndürdüğü için tarih 1 gün geri düşüyordu
                    // (canlıda görüldü: 14.08 kaydedince 13.08 oldu).
                    state.pending[id] = {
                        start: ns.format('YYYY-MM-DDTHH:mm:ss'),
                        due: ne.format('YYYY-MM-DDTHH:mm:ss')
                    };
                    render();
                    bindDrag();
                }
                function up() {
                    document.removeEventListener('pointermove', move);
                    document.removeEventListener('pointerup', up);
                }
                document.addEventListener('pointermove', move);
                document.addEventListener('pointerup', up);
            });
        }

        // Kaydetme: kısmi güncelleme uç noktası yok → tam DTO round-trip.
        // TaskDto'nun CreateUpdateTaskDto'da karşılığı olan HER alanı taşırız,
        // yoksa sessizce veri kaybı olur (açıklama, etiket, öncelik…).
        function toUpdateDto(t, pend) {
            return {
                title: t.title,
                description: t.description,
                startDate: pend.start,
                dueDate: pend.due,
                status: t.status,
                boardColumnId: t.boardColumnId,
                priority: t.priority,
                projectId: t.projectId,
                assigneeId: t.assigneeId,
                parentTaskId: t.parentTaskId,
                isPrivate: t.isPrivate,
                estimatedHours: t.estimatedHours,
                taskType: t.taskType,
                sprint: t.sprint,
                predecessorIds: t.predecessorIds || [],
                tagNames: (t.tags || []).map(function (x) { return x.name || x; })
            };
        }

        function save() {
            var ids = Object.keys(state.pending);
            if (!ids.length) { return; }
            var byId = {};
            state.tasks.forEach(function (t) { byId[t.id] = t; });
            // Sırayla: paralel istek sahte eşzamanlılık hatası üretebiliyor.
            ids.reduce(function (chain, id) {
                return chain.then(function () {
                    var t = byId[id];
                    if (!t) { return null; }
                    return taskSvc.update(id, toUpdateDto(t, state.pending[id]));
                });
            }, Promise.resolve()).then(function () {
                abp.notify.success(ids.length + ' görevin tarihi güncellendi.');
                state.pending = {};
                onSaved();
                load();
            });
        }

        function bindUi() {
            $mount.off('click.gantt').on('click.gantt', function (e) {
                var $z = $(e.target).closest('[data-zoom]');
                if ($z.length) { state.zoom = $z.data('zoom'); return refresh(); }
                var $g = $(e.target).closest('[data-group]');
                if ($g.length) { state.group = $g.data('group'); return refresh(); }
                var $t = $(e.target).closest('[data-toggle]');
                if ($t.length) { state[$t.data('toggle')] = !state[$t.data('toggle')]; return refresh(); }
                var $a = $(e.target).closest('[data-act]');
                if ($a.length) {
                    if ($a.data('act') === 'discard') { state.pending = {}; return refresh(); }
                    if ($a.data('act') === 'save') { return save(); }
                }
                var $o = $(e.target).closest('[data-open]');
                if ($o.length && editModal) { editModal.open($o.data('open')); }
            });
        }

        function refresh() { render(); bindDrag(); }

        function load() {
            state.loading = true;
            render();
            var filter = $.extend({ maxResultCount: 1000 }, getFilter());
            return taskSvc.getList(filter).then(function (res) {
                state.tasks = (res.items || []).filter(function (t) { return !!t.startDate; });
                state.loading = false;
                refresh();
            });
        }

        bindUi();
        return {
            load: load,
            hasPending: function () { return Object.keys(state.pending).length > 0; }
        };
    }

    apya.projectGantt = { create: create };
})(window);
