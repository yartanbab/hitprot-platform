// /Tasks "Finans" paneli (birleşik sekme sistemi PR-3b, tasarım 2b/3c).
// Giderler PROJE GRUPLU listelenir: ara toplamlar SUNUCUDAN (GROUP BY,
// ExpenseAppService.GetProjectGroupedAsync), "Genel gider" (bağımsız kayıtlar)
// amber grup olarak EN SONDA ve hiçbir bütçeye sayılmaz. Toplamlar para birimi
// başına — kur uydurulmaz (portföy özetiyle aynı karar).
//
// "Proje ayırıcı" çubuğu ikinci bir filtre mekanizması DEĞİLDİR: proje seçimi
// konsolun mevcut filtre state'ine yazılır (opts.setProject → filterState.project),
// böylece diğer panellerle aynı kapsamı paylaşır.
(function (window, $) {
    'use strict';

    var apya = window.apya = window.apya || {};

    function esc(s) { return $('<div>').text(s == null ? '' : String(s)).html(); }
    function l(key) { return abp.localization.getResource('Platform')(key); }

    function fmt(total, currency) {
        var n = Number(total).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        return currency === 'TRY' ? n + ' ₺' : n + ' ' + currency;
    }

    function totalsText(totals) {
        return (totals || []).map(function (t) { return fmt(t.total, t.currency); }).join(' · ');
    }

    var CATS = { 0: 'Genel', 1: 'Ofis', 2: 'Seyahat', 3: 'Personel', 4: 'Malzeme', 5: 'Hizmet', 6: 'Vergi' };

    function create(opts) {
        var $mount = $(opts.mount);
        var state = { data: null, sort: 'date', collapsed: {} };

        function svc() { return window.apya.platform.expenses.expense; }

        function findRow(id) {
            var groups = (state.data && state.data.groups) || [];
            for (var i = 0; i < groups.length; i++) {
                var hit = groups[i].rows.filter(function (r) { return r.id === id; })[0];
                if (hit) { return hit; }
            }
            return null;
        }

        // Olaylar TEK sefer, delege olarak bağlanır (takvim/galeri ile aynı
        // desen) — render her seferinde HTML'i yeniden bastığı için düğme
        // başına bağlama sızıntı ve çift tetik üretirdi.
        $mount
            .on('click', '[data-fin="project-pick"]', function () {
                if (opts.setProject) { opts.setProject(this.getAttribute('data-id') || ''); }
            })
            .on('click', '[data-fin="sort"]', function () {
                state.sort = state.sort === 'date' ? 'amount' : 'date';
                render();
            })
            .on('click', '[data-fin="toggle"]', function () {
                var key = this.getAttribute('data-key');
                state.collapsed[key] = !state.collapsed[key];
                render();
            })
            .on('click', '[data-fin="open-task"]', function () {
                if (opts.openTask) { opts.openTask(this.getAttribute('data-task-id')); }
            })
            .on('click', '[data-fin="change-scope"]', function () {
                var row = findRow(this.getAttribute('data-id'));
                if (!row) { return; }
                apya.financeScope.open({
                    kind: 'expense',
                    // Çapraz-proje yüzeyi: "yalnız projeye" hedefi seçiciden gelir.
                    projectOptions: (opts.getProjects && opts.getProjects()) || [],
                    record: {
                        id: row.id,
                        title: row.title,
                        amount: row.amount,
                        currency: row.currency,
                        taskId: row.taskId || null
                    },
                    onSaved: load
                });
            });

        function load() {
            $mount.html('<div class="apya-fin apya-skeleton" style="height:320px"></div>');
            var input = {};
            var projectId = opts.getProject && opts.getProject();
            if (projectId) { input.projectId = projectId; }
            return svc().getProjectGrouped(input).then(function (data) {
                state.data = data;
                render();
            });
        }

        function sortedRows(rows) {
            var copy = (rows || []).slice();
            if (state.sort === 'amount') {
                copy.sort(function (a, b) { return b.amount - a.amount; });
            }
            return copy; // 'date': sunucu zaten tarih desc veriyor
        }

        function render() {
            var d = state.data;
            var html = '';

            // ─── Proje ayırıcı çubuk (tasarım 2b) ───
            var projectId = (opts.getProject && opts.getProject()) || '';
            var projects = (opts.getProjects && opts.getProjects()) || [];
            var current = projects.filter(function (p) { return p.id === projectId; })[0];

            var menuItems = '<button type="button" class="apya-console-menu-item" data-fin="project-pick" data-id="">Tümü</button>';
            projects.forEach(function (p) {
                menuItems += '<button type="button" class="apya-console-menu-item" data-fin="project-pick" data-id="' + p.id + '">'
                    + esc(p.name + (p.code ? ' (' + p.code + ')' : '')) + '</button>';
            });

            html += '<div class="apya-fin-divider">'
                + '<span class="apya-fin-divider-label">Proje ayırıcı</span>'
                + '<div class="dropdown d-inline-flex">'
                + '  <button type="button" class="apya-fin-pill" data-bs-toggle="dropdown" aria-expanded="false">'
                + '    Proje: ' + esc(current ? current.name : 'tümü') + ' <i class="fa fa-chevron-down" aria-hidden="true"></i>'
                + '  </button>'
                + '  <div class="dropdown-menu apya-console-menu">' + menuItems + '</div>'
                + '</div>'
                + '<button type="button" class="apya-fin-pill" data-fin="sort">'
                + '  Sırala: ' + (state.sort === 'amount' ? 'Tutar ↓' : 'Tarih ↓')
                + '</button>'
                + '</div>';

            if (!d || d.groups.length === 0) {
                html += '<div class="apya-console-state">'
                    + '<span class="apya-console-state-icon"><i class="fa fa-coins" aria-hidden="true"></i></span>'
                    + '<strong>' + esc(l('Tasks:Finance:Empty')) + '</strong>'
                    + '</div>';
                $mount.html(html);
                return;
            }

            // ─── Proje grupları ───
            d.groups.forEach(function (g) {
                var key = g.projectId || 'pool';
                var isPool = !g.projectId;
                var open = !state.collapsed[key];

                html += '<div class="apya-fin-group' + (isPool ? ' is-pool' : '') + '">'
                    + '<button type="button" class="apya-fin-group-head" data-fin="toggle" data-key="' + key + '" aria-expanded="' + open + '">'
                    + '  <i class="fa fa-chevron-' + (open ? 'down' : 'right') + '" aria-hidden="true"></i>'
                    + '  <i class="fa ' + (isPool ? 'fa-inbox' : 'fa-diagram-project') + '" aria-hidden="true"></i>'
                    + '  <span class="apya-fin-group-name">' + esc(g.projectName) + '</span>'
                    + (g.projectCode ? '<span class="apya-chip apya-chip-neutral apya-numeric">' + esc(g.projectCode) + '</span>' : '')
                    + (isPool ? '<span class="apya-chip apya-chip-warning">bütçeye sayılmaz</span>' : '')
                    + '  <span class="apya-fin-group-meta">' + g.totalCount + ' kayıt</span>'
                    + '  <span class="apya-fin-group-sum"><small>' + (isPool ? 'havuz toplamı' : 'ara toplam') + '</small> '
                    + '    <b class="apya-numeric">' + esc(totalsText(g.totals)) + '</b></span>'
                    + '</button>';

                if (open) {
                    html += '<div class="apya-fin-rows">';
                    sortedRows(g.rows).forEach(function (r) {
                        html += '<div class="apya-fin-row">'
                            + '<span class="apya-fin-row-title">' + esc(r.title) + '</span>'
                            + (r.taskId
                                ? '<button type="button" class="apya-fin-task" data-fin="open-task" data-task-id="' + r.taskId + '">'
                                    + '<i class="fa fa-list-check" aria-hidden="true"></i> ' + esc(r.taskTitle || '—') + '</button>'
                                : '<span class="apya-fin-task is-empty">—</span>')
                            + '<span class="apya-chip apya-chip-neutral">' + esc(CATS[r.category] || 'Genel') + '</span>'
                            + '<span class="apya-fin-date apya-numeric">' + esc(new Date(r.expenseDate).toLocaleDateString('tr-TR')) + '</span>'
                            + '<span class="apya-fin-amount apya-numeric">' + esc(fmt(r.amount, r.currency)) + '</span>'
                            + '<div class="dropdown">'
                            + '  <button type="button" class="apya-fin-row-menu" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Satır işlemleri">'
                            + '    <i class="fa fa-ellipsis" aria-hidden="true"></i></button>'
                            + '  <div class="dropdown-menu apya-console-menu">'
                            + '    <button type="button" class="apya-console-menu-item" data-fin="change-scope" data-id="' + r.id + '">'
                            + '      <span class="apya-console-menu-icon"><i class="fa fa-arrows-turn-to-dots" aria-hidden="true"></i></span>İlişkiyi değiştir…</button>'
                            + (r.taskId
                                ? '<button type="button" class="apya-console-menu-item" data-fin="open-task" data-task-id="' + r.taskId + '">'
                                    + '<span class="apya-console-menu-icon"><i class="fa fa-list-check" aria-hidden="true"></i></span>Görevde aç</button>'
                                : '')
                            + '  </div>'
                            + '</div>'
                            + '</div>';
                    });
                    if (g.rows.length < g.totalCount) {
                        html += '<div class="apya-fin-more">Son ' + g.rows.length + ' kayıt gösteriliyor — '
                            + 'grubun toplamı ' + g.totalCount + ' kayıttan hesaplandı.</div>';
                    }
                    html += '</div>';
                }
                html += '</div>';
            });

            // ─── Koyu toplam bandı ───
            html += '<div class="apya-fin-grand">'
                + '<span>TÜM PROJELER — SÜZÜLMÜŞ TOPLAM</span>'
                + '<b class="apya-numeric">' + esc(totalsText(d.grandTotals)) + '</b>'
                + '</div>';

            $mount.html(html);
        }

        return { load: load };
    }

    apya.taskFinance = { create: create };
})(window, jQuery);
