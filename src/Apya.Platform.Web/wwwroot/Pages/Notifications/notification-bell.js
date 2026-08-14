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

    // Aciliyet: sunucudaki NotificationSeverity ile aynı sıra (Info<Normal<High<Critical).
    var SEVERITY = { INFO: 1, NORMAL: 2, HIGH: 3, CRITICAL: 4 };

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

        $(document).on('click', '#notification-items-list .notification-item', function() {
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

        // Aciliyet sıralı çekiliyor: kritik olan, daha yeni ama önemsiz olanın
        // altında kalmasın. Bölümlere ayırmayı istemci yapıyor.
        service.getMyNotifications({
            maxResultCount: 8,
            isRead: false,
            sort: 1 // Importance
        }).then(function(result) {
            $container.empty();

            if (result.items.length === 0) {
                $container.append('<div class="apya-notif-empty">Okunmamış bildiriminiz yok.</div>');
                return;
            }

            var important = result.items.filter(function(i) { return i.severity >= SEVERITY.HIGH; });
            var others    = result.items.filter(function(i) { return i.severity <  SEVERITY.HIGH; });

            // Hiyerarşi: önce "Önemli", sonra geri kalanı. Tek bölüm varsa
            // başlık gösterilmiyor — tek başlıklı liste gürültüden ibaret.
            if (important.length && others.length) {
                appendSection('Önemli', important);
                appendSection('Diğer', others);
            } else {
                appendItems(result.items);
            }
        }).catch(function(err) {
            $container.empty().append('<div class="apya-notif-empty text-danger">Bildirimler yüklenirken bir hata oluştu.</div>');
            console.error(err);
        });
    }

    function appendSection(label, items) {
        $container.append($('<div class="apya-notif-section"></div>').text(label));
        appendItems(items);
    }

    function appendItems(items) {
        items.forEach(function(item) {
            $container.append(buildItem(item));
        });
    }

    function severityClass(severity) {
        if (severity >= SEVERITY.CRITICAL) return 'sev-critical';
        if (severity >= SEVERITY.HIGH)     return 'sev-high';
        return '';
    }

    // jQuery ile kurulup .text() kullanılıyor: başlık/gövde kullanıcı içeriği
    // (yorum metni, görev adı) taşıyor, şablon dizesine gömülmemeli.
    function buildItem(item) {
        var $row = $('<div class="notification-item unread"></div>')
            .addClass(severityClass(item.severity))
            .attr('data-id', item.id)
            .attr('data-url', item.deepLinkUrl || '#');

        $row.append($('<div class="apya-notif-icon"></div>')
            .append($('<i></i>').addClass(item.icon || 'fa fa-bell')));

        var $body = $('<div class="apya-notif-body"></div>');
        var $title = $('<div class="apya-notif-title"></div>').append($('<span></span>').text(item.title));

        if (item.occurrenceCount > 1) {
            $title.append($('<span class="apya-notif-count"></span>').text(item.occurrenceCount));
        }

        $body.append($title);
        $body.append($('<div class="notification-text"></div>').text(item.body));
        $body.append($('<div class="notification-time"></div>')
            .append('<i class="fa fa-clock me-1"></i>')
            .append(document.createTextNode(moment(item.lastOccurredAt || item.creationTime).fromNow())));

        return $row.append($body);
    }

    // ABP ve DOM hazır olduğunda başlat
    $(function() {
        init();
    });

})(jQuery);
