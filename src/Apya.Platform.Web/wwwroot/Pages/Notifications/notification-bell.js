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

    // ─── Masaüstü bildirimi ────────────────────────────────────────────────────
    // Faz 1 kapsamı: SAYFA AÇIKKEN gelen SignalR olayını işletim sistemi
    // bildirimine çevirmek. Bunun için Web Push GEREKMEZ — abonelik, VAPID ve
    // sunucu tarafı gönderici yalnız tarayıcı KAPALIYKEN bildirim için gerekli
    // ve o Faz 2'nin işi (bkz. docs/design/bildirim-sistemi/02-coklu-kanal-plan.md).
    // Modül dışarıya açılıyor: /Notifications tercihler ekranı aynı durumu okuyup
    // yazıyor, izin mantığı iki yere kopyalanmasın diye.
    var DESKTOP = (function() {
        var LS_ENABLED = 'apya.notif.desktop.enabled';
        var LS_PROMPT  = 'apya.notif.desktop.promptDismissed';

        // localStorage gizli sekmede ve site verisi kapalıyken ERİŞİMDE HATA ATAR;
        // bildirim akışı buna takılmasın diye her okuma/yazma sarmalanıyor.
        function read(key) {
            try { return window.localStorage.getItem(key); } catch (e) { return null; }
        }
        function write(key, value) {
            try { window.localStorage.setItem(key, value); } catch (e) { /* yoksay */ }
        }

        function supported() { return typeof window.Notification === 'function'; }

        // Cihaz anahtarı yerelde tutuluyor, sunucuda değil: "bu ekranda bildirim
        // göster" kararı cihaza aittir — ofis bilgisayarında kapatmak kullanıcının
        // dizüstünü etkilememeli. İzin verilmiş olması niyet beyanı sayılır,
        // bu yüzden varsayılan AÇIK.
        function enabledHere() { return read(LS_ENABLED) !== '0'; }

        // Tarayıcı izni + cihaz anahtarı tek duruma indirgenir. Ekran bu durumu
        // gösterir; "açık" yazıp aslında kapalı olma hâli böyle engelleniyor.
        // Faz 2'de 'PermissionGranted' ikiye ayrılacak: sunucuda abonelik varsa
        // 'Subscribed' (tarayıcı kapalıyken de gelir), yoksa yalnız bu oturum.
        function state() {
            if (!supported())                          { return 'NotSupported'; }
            if (Notification.permission === 'denied')   { return 'PermissionDenied'; }
            if (Notification.permission === 'default')  { return 'NotRequested'; }
            return enabledHere() ? 'PermissionGranted' : 'DisabledOnThisDevice';
        }

        function request() {
            if (!supported()) { return Promise.resolve('NotSupported'); }

            // 'denied' iken TEKRAR SORULMAZ: tarayıcı çağrıyı sessizce reddeder,
            // kullanıcı hiçbir diyalog görmez ama "açılmadı" hissiyle kalır.
            // Bu durumda yapılacak şey tarayıcı ayarına yönlendirmek (tercih ekranı).
            if (Notification.permission !== 'default') { return Promise.resolve(state()); }

            // Promise.resolve sarmalı eski Safari için: orada requestPermission
            // geri çağırma alır ve undefined döner; izni yine de sonradan okuyoruz.
            return Promise.resolve(Notification.requestPermission()).then(function() {
                if (Notification.permission === 'granted') { write(LS_ENABLED, '1'); }
                return state();
            });
        }

        function setEnabledHere(on) { write(LS_ENABLED, on ? '1' : '0'); }

        function promptDismissed() { return read(LS_PROMPT) === '1'; }
        function dismissPrompt()   { write(LS_PROMPT, '1'); }

        // force: yalnız kullanıcının "bu cihazda dene" düğmesi için.
        function show(payload, force) {
            if (state() !== 'PermissionGranted') { return false; }

            // Kural: uygulama gözün önündeyse işletim sistemi bildirimi GÖSTERİLMEZ.
            // Zil rozeti ve anlık uyarı aynı şeyi zaten söylüyor; ikisi birden
            // aynı olay için iki kez rahatsız etmek olur. Değer, uygulama arka
            // plandayken ortaya çıkıyor.
            if (!force && document.visibilityState === 'visible') { return false; }

            try {
                var options = {
                    body: payload.body || '',
                    icon: '/icons/apya-icon.svg',
                    // Aynı kullanıcının birden çok sekmesi açıkken her sekme
                    // göstermeye çalışır; aynı `tag` işletim sisteminde bunları
                    // TEK bildirimde toplar (sunucu artık satır kimliğini yolluyor).
                    tag: payload.id ? 'apya-' + payload.id : undefined,
                    requireInteraction: (payload.severity || 0) >= SEVERITY.CRITICAL
                };

                var notification = new Notification(payload.title || 'Apya', options);
                notification.onclick = function() {
                    window.focus();
                    notification.close();
                    // Derin link sunucuda türetiliyor (NotificationTypeRegistry);
                    // istemci adres kurmaya çalışmaz.
                    if (payload.deepLinkUrl) { window.location.href = payload.deepLinkUrl; }
                };
                return true;
            } catch (e) {
                // Android Chrome sayfa bağlamında `new Notification`'ı reddeder ve
                // service worker üzerinden gösterim ister; hata akışı kesmesin.
                console.warn('[NotificationBell] masaüstü bildirimi gösterilemedi', e);
                return false;
            }
        }

        return {
            supported: supported,
            state: state,
            request: request,
            setEnabledHere: setEnabledHere,
            promptDismissed: promptDismissed,
            dismissPrompt: dismissPrompt,
            show: show
        };
    })();

    window.apyaDesktopNotifications = DESKTOP;

    function init() {
        // --- SignalR Bağlantısı ---
        if (typeof signalR !== "undefined") {
            var connection = new signalR.HubConnectionBuilder()
                .withUrl("/notification-hub")
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveNotification", function(notificationDto) {
                refreshBadge();
                notifyToast(notificationDto);
                DESKTOP.show(notificationDto);
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
            // Şerit her açılışta yeniden değerlendirilir: izin başka sekmede
            // verilmiş ya da tarayıcı ayarından geri alınmış olabilir.
            renderDesktopPrompt();
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

        // Şerit DOM'a sonradan giriyor: dinleyiciler delege ediliyor.
        $(document).on('click', '#notif-desktop-prompt [data-act="enable"]', function() {
            var l = abp.localization.getResource('Platform');
            DESKTOP.request().then(function(state) {
                $('#notif-desktop-prompt').remove();
                if (state === 'PermissionGranted') {
                    abp.notify.success(l('Notifications:Desktop:Enabled'));
                } else if (state === 'PermissionDenied') {
                    // Zorlama yok: ne olduğu söylenir, çözüm tercih ekranında.
                    abp.notify.info(l('Notifications:Desktop:StatusDenied'));
                }
            });
        });

        $(document).on('click', '#notif-desktop-prompt [data-act="dismiss"]', function() {
            DESKTOP.dismissPrompt();
            $('#notif-desktop-prompt').remove();
        });
    }

    // İzin şeridi. YALNIZ izin hiç istenmemişken ve kullanıcı kapatmamışken çıkar:
    // ilk girişte kimseye sorulmaz (kullanıcı zile bakmışsa bildirimle zaten
    // ilgileniyordur), reddedenin karşısına bir daha çıkmaz.
    function renderDesktopPrompt() {
        $('#notif-desktop-prompt').remove();

        if (DESKTOP.state() !== 'NotRequested' || DESKTOP.promptDismissed()) {
            return;
        }

        var l = abp.localization.getResource('Platform');
        var $cta = $('<li id="notif-desktop-prompt" class="apya-notif-cta"></li>');

        $cta.append($('<i class="fa fa-bell" aria-hidden="true"></i>'));
        $cta.append($('<span class="apya-notif-cta-text"></span>')
            .text(l('Notifications:Desktop:Prompt')));
        $cta.append($('<button type="button" class="btn btn-sm btn-primary" data-act="enable"></button>')
            .text(l('Notifications:Desktop:Enable')));
        $cta.append($('<button type="button" class="btn btn-sm btn-link apya-notif-cta-dismiss" data-act="dismiss"></button>')
            .text(l('Notifications:Desktop:DismissPrompt')));

        $cta.insertBefore('#notification-items-list');
    }

    // Aciliyet toast biçimini seçer: kritik bir uyarı mavi bilgi kutusunda
    // kaybolmasın, kritikte kendiliğinden kapanmasın.
    function notifyToast(dto) {
        var severity = dto.severity || 0;

        if (severity >= SEVERITY.CRITICAL) {
            abp.notify.error(dto.title, "Yeni Bildirim", { sticky: true });
            return;
        }
        if (severity >= SEVERITY.HIGH) {
            abp.notify.warn(dto.title, "Yeni Bildirim");
            return;
        }
        abp.notify.info(dto.title, "Yeni Bildirim");
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
