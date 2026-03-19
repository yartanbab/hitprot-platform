(function($) {
    var notificationService = apya.platform.notifications.notification;
    var $badge = $('#notification-unread-badge');
    var $container = $('#notification-items-list');
    var isListOpen = false;

    // --- SignalR Bağlantısı ---
    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/notification-hub") // Bu isim module'de map edilecek
        .withAutomaticReconnect()
        .build();

    connection.on("ReceiveNotification", function(notificationDto) {
        updateBadge(1); // Mevcut sayıya 1 ekle
        abp.notify.info(notificationDto.title, "Yeni Bildirim");
        if (isListOpen) {
            fetchNotifications(); // Liste açıksa yenile
        }
    });

    connection.start().catch(err => console.error("SignalR hatası: " + err.toString()));

    // --- Badge Güncelleme ---
    function updateBadge(diff) {
        var current = parseInt($badge.text()) || 0;
        var newVal = current + diff;
        if (newVal <= 0) {
            $badge.addClass('d-none').text('0');
        } else {
            $badge.removeClass('d-none').text(newVal > 99 ? '99+' : newVal);
        }
    }

    // --- Bildirimleri Getir ---
    function fetchNotifications() {
        notificationService.getMyNotifications({
            maxResultCount: 5,
            isRead: false
        }).then(function(result) {
            $container.empty();
            if (result.items.length === 0) {
                $container.append('<li class="p-4 text-center text-muted text-sm">Okunmamış bildiriminiz yok.</li>');
                return;
            }

            result.items.forEach(function(item) {
                var creationTime = moment(item.creationTime).fromNow();
                var itemHtml = `
                    <li class="p-3 notification-item unread" data-id="${item.id}" data-url="${item.deepLinkUrl || '#'}">
                        <div class="fw-bold text-sm mb-1">${item.title}</div>
                        <div class="notification-text text-muted mb-1">${item.body}</div>
                        <div class="notification-time text-xs mt-1 text-primary"><i class="fa fa-clock me-1"></i>${creationTime}</div>
                    </li>`;
                $container.append(itemHtml);
            });
        });
    }

    // --- Event Handlers ---
    $('#notificationDropdown').on('show.bs.dropdown', function () {
        isListOpen = true;
        fetchNotifications();
    });

    $('#notificationDropdown').on('hide.bs.dropdown', function () {
        isListOpen = false;
    });

    $(document).on('click', '.notification-item', function() {
        var id = $(this).data('id');
        var url = $(this).data('url');
        notificationService.markAsRead(id).then(function() {
            if (url && url !== '#') {
                window.location.href = url;
            } else {
                fetchNotifications();
                updateBadge(-1);
            }
        });
    });

    $('#mark-all-as-read').click(function(e) {
        e.preventDefault();
        notificationService.markAllAsRead().then(function() {
            $badge.addClass('d-none').text('0');
            fetchNotifications();
            abp.notify.success("Tüm bildirimler okundu işaretlendi.");
        });
    });

})(jQuery);
