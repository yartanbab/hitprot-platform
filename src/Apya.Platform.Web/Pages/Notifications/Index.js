$(function () {
    var notificationService = apya.platform.notifications.notification;
    var l = abp.localization.getResource('Platform');

    var $list = $('#notifications-full-list');
    var $categories = $('#notif-categories');

    var PAGE_SIZE = 15;
    var SEVERITY = { INFO: 1, NORMAL: 2, HIGH: 3, CRITICAL: 4 };

    // Sunucudaki NotificationCategory ile aynı sıra. İkonlar kategori başlıklarında
    // kullanılıyor; satır ikonu türe özeldir ve DTO ile gelir.
    var CATEGORIES = [
        { value: null, key: 'All',       icon: 'fa fa-inbox' },
        { value: 1,    key: 'Tasks',     icon: 'fa fa-list-check' },
        { value: 2,    key: 'Projects',  icon: 'fa fa-diagram-project' },
        { value: 3,    key: 'Documents', icon: 'fa fa-folder-open' },
        { value: 4,    key: 'Grants',    icon: 'fa fa-award' },
        { value: 5,    key: 'Ai',        icon: 'fa fa-robot' },
        { value: 6,    key: 'Feedback',  icon: 'fa fa-comment-dots' },
        { value: 7,    key: 'System',    icon: 'fa fa-gear' }
    ];

    var state = {
        skipCount: 0,
        category: null,
        isRead: false,
        minSeverity: null,
        sort: 0,
        filter: ''
    };

    // ── Kategori ağacı ────────────────────────────────────────────────────────

    function renderCategories(summary) {
        var counts = {};
        (summary.categories || []).forEach(function (c) { counts[c.category] = c.unreadCount; });

        $categories.empty();

        CATEGORIES.forEach(function (cat) {
            // Boş kategoriler gizlenir; "Tümü" ve seçili olan her zaman durur.
            var count = cat.value === null ? summary.totalUnread : (counts[cat.value] || 0);
            if (cat.value !== null && count === 0 && state.category !== cat.value) return;

            var $btn = $('<button type="button" class="apya-notif-cat"></button>')
                .attr('data-category', cat.value === null ? '' : cat.value)
                .toggleClass('active', state.category === cat.value)
                .attr('aria-current', state.category === cat.value ? 'true' : null);

            $btn.append($('<i></i>').addClass(cat.icon));
            $btn.append($('<span></span>').text(l('Notification:Category:' + cat.key)));

            if (count > 0) {
                $btn.append($('<span class="apya-cat-count"></span>').text(count > 99 ? '99+' : count));
            }

            $categories.append($btn);
        });
    }

    function refreshSummary() {
        return notificationService.getSummary().then(renderCategories);
    }

    // ── Liste ─────────────────────────────────────────────────────────────────

    function buildInput() {
        var input = {
            skipCount: state.skipCount,
            maxResultCount: PAGE_SIZE,
            sort: state.sort
        };
        if (state.category !== null)    input.category = state.category;
        if (state.isRead !== null)      input.isRead = state.isRead;
        if (state.minSeverity !== null) input.minSeverity = state.minSeverity;
        if (state.filter)               input.filter = state.filter;
        return input;
    }

    function severityClass(severity) {
        if (severity >= SEVERITY.CRITICAL) return 'sev-critical';
        if (severity >= SEVERITY.HIGH)     return 'sev-high';
        return '';
    }

    // Kullanıcı içeriği (görev adı, yorum metni) taşıdığı için satır jQuery ile
    // kurulup .text() ile yazılıyor — şablon dizesine gömülmüyor.
    function buildRow(item) {
        var $row = $('<div class="notif-page-item"></div>')
            .addClass(item.isRead ? '' : 'unread')
            .addClass(severityClass(item.severity))
            .attr('data-id', item.id)
            .attr('data-url', item.deepLinkUrl || '#');

        $row.append($('<div class="apya-notif-icon"></div>')
            .append($('<i></i>').addClass(item.icon || 'fa fa-bell')));

        var $head = $('<div class="apya-notif-head"></div>')
            .append($('<strong></strong>').text(item.title));

        if (item.occurrenceCount > 1) {
            $head.append($('<span class="apya-notif-count"></span>').text(item.occurrenceCount));
        }
        if (item.severity >= SEVERITY.CRITICAL) {
            $head.append($('<span class="badge bg-danger"></span>').text(l('Notification:Severity:Critical')));
        }

        var $time = $('<div class="notification-time"></div>')
            .append('<i class="fa fa-clock me-1"></i>')
            .append(document.createTextNode(moment(item.lastOccurredAt || item.creationTime).format('LLL')));

        if (item.actorName) {
            $time.append(document.createTextNode(' · ')).append($('<span></span>').text(item.actorName));
        }

        var $body = $('<div class="apya-notif-body"></div>')
            .append($head)
            .append($('<div class="notification-text"></div>').text(item.body))
            .append($time);

        var $actions = $('<div class="apya-notif-actions"></div>')
            .append($('<button class="btn btn-sm btn-link text-danger delete-notif"></button>')
                .attr({ 'data-id': item.id, title: 'Sil', 'aria-label': 'Bildirimi sil' })
                .append('<i class="fa fa-trash"></i>'));

        return $row.append($body).append($actions);
    }

    function loadNotifications(append) {
        return notificationService.getMyNotifications(buildInput()).then(function (result) {
            if (!append) $list.empty();

            if (result.items.length === 0 && !append) {
                $list.append($('<div class="apya-notif-empty"></div>')
                    .text(state.filter ? 'Aramanızla eşleşen bildirim yok.' : 'Gösterilecek bildirim yok.'));
                $('#load-more-btn').addClass('d-none');
                $('#no-more-notif').addClass('d-none');
                return;
            }

            result.items.forEach(function (item) { $list.append(buildRow(item)); });

            var shown = state.skipCount + result.items.length;
            var hasMore = shown < result.totalCount;
            $('#load-more-btn').toggleClass('d-none', !hasMore);
            $('#no-more-notif').toggleClass('d-none', hasMore);
        });
    }

    function reload() {
        state.skipCount = 0;
        return $.when(loadNotifications(false), refreshSummary());
    }

    // ── Etkileşim ─────────────────────────────────────────────────────────────

    $categories.on('click', '.apya-notif-cat', function () {
        var raw = $(this).attr('data-category');
        state.category = raw === '' ? null : parseInt(raw, 10);
        $categories.find('.apya-notif-cat').removeClass('active').removeAttr('aria-current');
        $(this).addClass('active').attr('aria-current', 'true');
        reload();
    });

    $('#notif-read-filter').change(function () {
        var v = $(this).val();
        state.isRead = v === '' ? null : (v === 'true');
        reload();
    });

    $('#notif-severity-filter').change(function () {
        var v = $(this).val();
        state.minSeverity = v === '' ? null : parseInt(v, 10);
        reload();
    });

    $('#notif-sort').change(function () {
        state.sort = parseInt($(this).val(), 10);
        reload();
    });

    // Aramada her tuşta istek atmamak için kısa bekleme.
    var searchTimer = null;
    $('#notif-search').on('input', function () {
        var value = $(this).val();
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            state.filter = value;
            reload();
        }, 300);
    });

    $('#load-more-btn').click(function () {
        state.skipCount += PAGE_SIZE;
        loadNotifications(true);
    });

    $('#btn-mark-all-page').click(function () {
        // Bir kategori seçiliyse yalnız onu okundu yap — "tümü" beklentisi
        // ekranda görünen listeyle uyuşmalı.
        var action = state.category === null
            ? notificationService.markAllAsRead()
            : notificationService.markCategoryAsRead(state.category);

        action.then(function () {
            abp.notify.success('Bildirimler okundu işaretlendi.');
            reload();
        });
    });

    $('#btn-clear-read').click(function () {
        abp.message.confirm('Okunmuş bildirimler silinsin mi?', function (confirmed) {
            if (!confirmed) return;
            notificationService.deleteRead().then(function (count) {
                abp.notify.info(count > 0 ? count + ' bildirim silindi.' : 'Silinecek okunmuş bildirim yok.');
                reload();
            });
        });
    });

    $list.on('click', '.notif-page-item', function (e) {
        if ($(e.target).closest('.delete-notif').length) return;

        var id = $(this).data('id');
        var url = $(this).data('url');
        var isRead = !$(this).hasClass('unread');

        // Okunmuş satıra tekrar tıklamak yalnızca yönlendirir.
        var action = isRead ? $.Deferred().resolve() : notificationService.markAsRead(id);

        $.when(action).then(function () {
            if (url && url !== '#') window.location.href = url;
            else reload();
        });
    });

    $list.on('click', '.delete-notif', function () {
        var id = $(this).data('id');
        abp.message.confirm('Bildirim silinsin mi?', function (confirmed) {
            if (!confirmed) return;
            notificationService.delete(id).then(function () {
                abp.notify.info('Bildirim silindi.');
                reload();
            });
        });
    });

    reload();
});
