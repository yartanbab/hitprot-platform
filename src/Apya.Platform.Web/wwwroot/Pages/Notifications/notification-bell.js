(function($) {
    var notificationService = null;
    function getService() {
        if (!notificationService && window.apya && apya.platform && apya.platform.notifications) {
            notificationService = apya.platform.notifications.notification;
        }
        return notificationService;
    }
    
    var $badge = $('#notification-unread-badge');
    var $container = $('#notification-items-list');
    var isListOpen = false;

    function init() {
        // --- SignalR Bağlantısı ---
        if (typeof signalR !== "undefined") {
            var connection = new signalR.HubConnectionBuilder()
                .withUrl("/notification-hub")
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveNotification", function(notificationDto) {
                updateBadge(1);
                abp.notify.info(notificationDto.title, "Yeni Bildirim");
                if (isListOpen) {
                    fetchNotifications();
                }
            });

            connection.start().catch(err => console.error("SignalR hatası: " + err.toString()));
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
            var service = getService();
            if (service) {
                service.markAsRead(id).then(function() {
                    if (url && url !== '#') {
                        window.location.href = url;
                    } else {
                        fetchNotifications();
                        updateBadge(-1);
                    }
                });
            }
        });

        $('#mark-all-as-read').click(function(e) {
            e.preventDefault();
            var service = getService();
            if (service) {
                service.markAllAsRead().then(function() {
                    $badge.addClass('d-none').text('0');
                    fetchNotifications();
                    abp.notify.success("Tüm bildirimler okundu işaretlendi.");
                });
            }
        });
    }

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
        var service = getService();
        if (!service) {
            console.warn("Bildirim servisi henüz hazır değil...");
            return;
        }

        service.getMyNotifications({
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
        }).catch(function(err) {
            $container.empty().append('<li class="p-4 text-center text-danger text-sm">Bildirimler yüklenirken bir hata oluştu.</li>');
            console.error(err);
        });
    }

    // ABP ve DOM hazır olduğunda başlat
    $(function() {
        init();
    });

})(jQuery);
