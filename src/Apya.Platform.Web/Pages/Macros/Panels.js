/* =============================================================================
   Makro Ekran (/Makro) — paneller: Bildirimler · Bana ait kayıtlar · Bekleyen işler.
   Tasarım docs/design/makro-ekran (1a).

   Veri MEVCUT uçlardan gelir; yeni olan yalnız "projelerim" (macroScreen.getMyProjects).
   Hangi kaynağın çekileceğine sunucu karar verir (Index.cshtml.cs → data-groups /
   data-sources): burada izin ya da host/kiracı tarafı yeniden yorumlanmaz.
   Kabuk rozetleri (geciken görevlerim, karar bekleyen talepler/başvurular) her sayfada
   zaten çekilen kabuk durumundan okunur — ek istek yok.
   ============================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('ApyaMacros');
    if (!root) { return; }

    var l = abp.localization.getResource('Platform');
    var MAX_GRANT_ROWS = 5;

    function esc(t) { return $('<div>').text(t == null ? '' : String(t)).html(); }

    // Açık yönlendirme olmasın: yalnız "/x" biçimli uygulama yolu (apya-load-state.js ile aynı kural).
    function appPath(url) { return typeof url === 'string' && /^\/(?![\/\\])/.test(url) ? url : null; }

    function bodyOf(panel) { return panel.querySelector('[data-panel-body]'); }

    function loading(panel) {
        bodyOf(panel).innerHTML = apya.loadState.loadingHtml(l('Macros:Loading'));
    }

    function failed(panel, titleKey, retry, err) {
        var body = bodyOf(panel);
        body.innerHTML = apya.loadState.errorHtml(l(titleKey), 'js-macros-retry', err);
        var btn = body.querySelector('.js-macros-retry');
        if (btn) { btn.addEventListener('click', retry, { once: true }); }
    }

    function emptyHtml(icon, text) {
        return '<div class="apya-console-state"><span class="apya-console-state-icon is-muted">' +
               '<i class="fa ' + icon + '" aria-hidden="true"></i></span><p>' + esc(text) + '</p></div>';
    }

    // =========================================================================
    // Bildirimler — en yeni üstte; tıklanınca okundu + bildirimin bağlantısı.
    // =========================================================================
    var notifications = document.getElementById('MacrosNotifications');
    var notificationService = apya.platform.notifications.notification;

    function notificationRow(n) {
        var href = appPath(n.deepLinkUrl) || '/Notifications';
        var when = moment(n.lastOccurredAt || n.creationTime).fromNow();
        var meta = n.actorName ? when + ' · ' + n.actorName : when;
        return '<a class="apya-macros-row' + (n.isRead ? '' : ' is-unread') + '" href="' + esc(href) + '"' +
               (n.isRead ? '' : ' data-notification-id="' + esc(n.id) + '"') + '>' +
               '<span class="apya-macros-row-icon" aria-hidden="true"><i class="' + esc(n.icon || 'fa fa-bell') + '"></i></span>' +
               '<span class="apya-macros-row-text">' +
               '<span class="apya-macros-row-title">' + esc(n.title) + '</span>' +
               '<span class="apya-macros-row-meta">' + esc(meta) + '</span></span>' +
               '<span class="apya-macros-row-dot" aria-hidden="true"></span></a>';
    }

    function loadNotifications() {
        loading(notifications);
        var unreadEl = notifications.querySelector('[data-unread]');
        Promise.all([
            notificationService.getMyNotifications({ maxResultCount: 20, sort: 0 }, { abpHandleError: false }),
            notificationService.getUnreadCount({ abpHandleError: false })
        ]).then(function (res) {
            var items = (res[0] && res[0].items) || [];
            var unread = res[1] || 0;
            unreadEl.textContent = unread > 99 ? '99+' : String(unread);
            unreadEl.hidden = unread === 0;
            bodyOf(notifications).innerHTML = items.length
                ? items.map(notificationRow).join('')
                : emptyHtml('fa-bell', l('Macros:Notifications:Empty'));
        }, function (err) {
            failed(notifications, 'Macros:Notifications:LoadFailed', loadNotifications, err);
        });
    }

    if (notifications) {
        // Okundu işareti gitmeden sayfa değişirse kaybolur → önce işaretle, sonra git.
        notifications.addEventListener('click', function (e) {
            var row = e.target.closest('[data-notification-id]');
            if (!row || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) { return; }
            e.preventDefault();
            var go = function () { location.href = row.getAttribute('href'); };
            Promise.resolve(notificationService.markAsRead(row.dataset.notificationId, { abpHandleError: false }))
                .then(go, go);
        });
        loadNotifications();
    }

    // =========================================================================
    // Bana ait kayıtlar — Projelerim · İlgilendiğim çağrılar · Hibe süreçlerim.
    // =========================================================================
    var records = document.getElementById('MacrosRecords');

    function tone(value) { return value === 'warning' || value === 'positive' || value === 'negative' ? value : 'idle'; }

    function recordRow(r) {
        return '<a class="apya-macros-row apya-macros-record' + (r.fresh ? ' is-fresh' : '') + '" href="' + esc(r.href) + '">' +
               '<span class="apya-macros-status tone-' + tone(r.tone) + '" aria-hidden="true"></span>' +
               '<span class="apya-macros-row-text">' +
               '<span class="apya-macros-row-title">' + esc(r.title) + '</span>' +
               '<span class="apya-macros-row-meta">' + esc(r.meta) + '</span></span>' +
               (r.fresh
                   ? '<i class="fa fa-arrow-up-right-dots apya-macros-fresh" title="' + esc(l('Macros:Records:Fresh')) + '"></i>' +
                     '<span class="visually-hidden">' + esc(l('Macros:Records:Fresh')) + '</span>'
                   : '') +
               '</a>';
    }

    function groupHtml(icon, titleKey, count, rows) {
        if (!rows.length) { return ''; }
        return '<div class="apya-macros-group">' +
               '<div class="apya-macros-group-head"><i class="fa ' + icon + '" aria-hidden="true"></i>' +
               '<span>' + esc(l(titleKey)) + '</span><span class="apya-macros-group-count">' + count + '</span></div>' +
               rows.map(recordRow).join('') + '</div>';
    }

    function projectGroup(dto) {
        var rows = (dto.items || []).map(function (p) {
            var meta = p.overdueTaskCount > 0
                ? l('Macros:Records:OpenAndOverdue', p.openTaskCount, p.overdueTaskCount)
                : p.openTaskCount > 0 ? l('Macros:Records:OpenTasks', p.openTaskCount) : l('Macros:Records:NoOpenTasks');
            return {
                href: '/Projects/ProjectDetails/' + p.id,
                title: p.name,
                meta: meta,
                tone: p.overdueTaskCount > 0 ? 'warning' : p.openTaskCount > 0 ? 'positive' : 'idle',
                fresh: p.hasUnread
            };
        });
        return groupHtml('fa-rocket', 'Macros:Records:Projects', dto.totalCount || rows.length, rows);
    }

    function interestGroup(items) {
        // Başvuruya dönen talep "Hibe süreçlerim"de, geri çekilen talep artık takipte değil.
        var keys = apyaGrantStatus.interest.keys;
        var tones = apyaGrantStatus.interest.tones;
        var active = (items || []).filter(function (i) {
            return keys[i.status] !== 'BasvuruAcildi' && keys[i.status] !== 'GeriCekildi';
        });
        var rows = active.slice(0, MAX_GRANT_ROWS).map(function (i) {
            var status = l('Grants:Interest:Status:' + keys[i.status]);
            return {
                href: '/Grants/Detail?id=' + i.grantCallId,
                title: i.grantName,
                meta: i.period ? status + ' · ' + i.period : status,
                tone: tones[i.status]
            };
        });
        return groupHtml('fa-bullhorn', 'Macros:Records:Interests', active.length, rows);
    }

    function applicationGroup(dto) {
        var keys = apyaGrantStatus.stage.keys;
        var tones = apyaGrantStatus.stage.tones;
        var open = ((dto && dto.items) || []).filter(function (a) { return !a.isClosed; });
        var rows = open.slice(0, MAX_GRANT_ROWS).map(function (a) {
            var stage = a.stageName || l('Grants:Stage:' + keys[a.stage]);
            return {
                // Doğru eylem ekranını (sihirbaz / itiraz / uygulama) liste seçiyor; aynı kuralı
                // burada ikinci kez yazmıyoruz.
                href: '/Grants/MyApplications',
                title: a.grantName,
                meta: a.daysRemaining != null && a.daysRemaining >= 0
                    ? stage + ' · ' + l('Macros:Records:DaysLeft', a.daysRemaining)
                    : stage,
                tone: tones[a.stage]
            };
        });
        return groupHtml('fa-route', 'Macros:Records:Applications', open.length, rows);
    }

    var recordSources = {
        projects: function () { return apya.platform.macros.macroScreen.getMyProjects({ abpHandleError: false }).then(projectGroup); },
        interests: function () { return apya.platform.grants.grantInterest.getMine({ abpHandleError: false }).then(interestGroup); },
        applications: function () { return apya.platform.grants.grantMyApplications.get({ abpHandleError: false }).then(applicationGroup); }
    };

    function loadRecords() {
        loading(records);
        var groups = (records.dataset.groups || '').split(',').filter(function (g) { return recordSources[g]; });
        Promise.all(groups.map(function (g) { return Promise.resolve(recordSources[g]()); }))
            .then(function (parts) {
                var html = parts.join('');
                bodyOf(records).innerHTML = html || emptyHtml('fa-inbox', l('Macros:Records:Empty'));
            }, function (err) {
                failed(records, 'Macros:Records:LoadFailed', loadRecords, err);
            });
    }

    if (records) { loadRecords(); }

    // =========================================================================
    // Bekleyen işler — sıfır sayaç gizlenmez, soluk basılır (ızgara kaymaz).
    // =========================================================================
    var pending = document.getElementById('MacrosPending');

    function cell(c) {
        return '<a class="apya-macros-pending-cell tone-' + c.tone + (c.count ? '' : ' is-zero') + '" href="' + esc(c.href) + '">' +
               '<span class="apya-macros-pending-count">' + c.count + '</span>' +
               '<span class="apya-macros-pending-title">' + esc(l(c.titleKey)) + '</span></a>';
    }

    function shellBadges() {
        return Promise.resolve(window.apyaShellState || null).then(function (state) {
            return (state && state.badges) || null;
        });
    }

    var pendingSources = {
        overdueTasks: function () {
            return shellBadges().then(function (b) {
                return b ? [{ count: b.overdueTasks, titleKey: 'Macros:Pending:OverdueTasks', href: '/Tasks?overdue=1&mine=1', tone: 'negative' }] : [];
            });
        },
        grantInterests: function () {
            return shellBadges().then(function (b) {
                return b ? [{ count: b.pendingGrantInterests, titleKey: 'Macros:Pending:GrantInterests', href: '/Grants/Requests', tone: 'warning' }] : [];
            });
        },
        grantApplications: function () {
            return shellBadges().then(function (b) {
                return b ? [{ count: b.pendingGrantApplications, titleKey: 'Macros:Pending:GrantApplications', href: '/Grants/Pipeline', tone: 'warning' }] : [];
            });
        },
        grantToday: function () {
            return apya.platform.grants.grantToday.get({ abpHandleError: false }).then(function (t) {
                return [
                    { count: t.itemCount, titleKey: 'Macros:Pending:GrantToday', href: '/Grants/Today', tone: 'warning' },
                    { count: t.nearDeadlineCount, titleKey: 'Macros:Pending:NearDeadline', href: '/Grants/Today', tone: 'warning' }
                ];
            });
        },
        draftInvoices: function () {
            return apya.platform.dashboard.dashboard.getPendingApprovals({ abpHandleError: false }).then(function (d) {
                return d.locked ? [] : [{ count: (d.items || []).length, titleKey: 'Macros:Pending:DraftInvoices', href: '/Invoices', tone: 'neutral' }];
            });
        }
    };

    function loadPending() {
        loading(pending);
        var totalEl = pending.querySelector('[data-pending-total]');
        var sources = (pending.dataset.sources || '').split(',').filter(function (s) { return pendingSources[s]; });
        var failures = 0;

        // Bir kaynağın düşmesi diğerlerini götürmesin: her biri kendi hatasını yutar, sayılır.
        Promise.all(sources.map(function (s) {
            return Promise.resolve(pendingSources[s]()).then(null, function () { failures++; return []; });
        })).then(function (parts) {
            var cells = [].concat.apply([], parts);
            if (!cells.length) {
                // Hiç hücre yoksa: ya hepsi düştü (hata kutusu) ya da gösterilecek sayaç yok (bölüm kalkar).
                if (failures) { failed(pending, 'Macros:Pending:LoadFailed', loadPending); } else { pending.hidden = true; }
                return;
            }
            var total = cells.reduce(function (sum, c) { return sum + (c.count || 0); }, 0);
            // Hepsi sıfırsa (ve kaynak düşmediyse) sıfır hücre ızgarası yerine tek kutu (3a).
            pending.classList.toggle('is-empty', total === 0 && !failures);
            if (total === 0 && !failures) {
                bodyOf(pending).innerHTML =
                    '<div class="apya-macros-pending-empty">' +
                    '<span class="apya-macros-pending-empty-icon" aria-hidden="true"><i class="fa fa-inbox"></i></span>' +
                    '<span class="apya-macros-pending-empty-text">' +
                    '<span class="apya-macros-pending-empty-title">' + esc(l('Macros:Pending:Empty')) + '</span>' +
                    '<span class="apya-macros-pending-empty-desc">' + esc(l('Macros:Pending:EmptyDescription')) + '</span>' +
                    '</span></div>';
                return;
            }
            totalEl.textContent = l('Macros:Pending:Total', total);
            totalEl.hidden = total === 0;
            bodyOf(pending).innerHTML = cells.map(cell).join('') +
                (failures ? '<p class="apya-macros-pending-warn" role="status">' + esc(l('Macros:Pending:LoadFailed')) + '</p>' : '');
        });
    }

    if (pending) { loadPending(); }
})();
