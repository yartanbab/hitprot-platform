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
                refreshBadge();
                abp.notify.info(notificationDto.title, "Yeni Bildirim");
                if (isListOpen) {
                    fetchNotifications();
                }
            });

            // Bildirim okundu/silindi — bu kullanıcının diğer sekmeleri de eşitlensin.
            connection.on("NotificationCountChanged", function() {
                refreshBadge();
                if (isListOpen) {
                    fetchNotifications();
                }
            });

            // TD-W-006: Reconnect lifecycle — kullanıcıyı bağlantı durumundan haberdar et.
            var l = abp.localization.getResource('Platform');

            connection.onreconnecting(function(error) {
                console.warn('[NotificationHub] reconnecting:', error);
                abp.notify.warn(l('Connection:Reconnecting'), l('Connection:Title'));
            });

            connection.onreconnected(function(connectionId) {
                abp.notify.success(l('Connection:Reconnected'), l('Connection:Title'));
            });

            connection.onclose(function(error) {
                console.error('[NotificationHub] connection closed:', error);
                abp.notify.error(l('Connection:Lost'), l('Connection:ErrorTitle'), { sticky: true });
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
                        refreshBadge();
                    }
                });
            }
        });

        $('#mark-all-as-read').click(function(e) {
            e.preventDefault();
            var service = getService();
            if (service) {
                service.markAllAsRead().then(function() {
                    setBadge(0);
                    fetchNotifications();
                    abp.notify.success("Tüm bildirimler okundu işaretlendi.");
                });
            }
        });
    }

    // --- Badge Güncelleme ---
    // Rozet her zaman sunucudaki gerçek sayıyı gösterir. (Önceden yerel +1/-1
    // aritmetiğiyle takip ediliyordu; ikinci sekme veya başka cihazda sapıyordu.)
    function setBadge(count) {
        if (!count || count <= 0) {
            $badge.addClass('d-none').text('0');
        } else {
            $badge.removeClass('d-none').text(count > 99 ? '99+' : count);
        }
    }

    function refreshBadge() {
        var service = getService();
        if (!service) return;
        service.getUnreadCount()
            .then(setBadge)
            .catch(function(err) { console.error('[NotificationBell] sayaç alınamadı', err); });
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
