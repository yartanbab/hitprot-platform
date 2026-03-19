$(function() {
    var notificationService = apya.platform.notifications.notification;
    var $list = $('#notifications-full-list');
    var skipCount = 0;
    var maxResultCount = 10;

    function loadNotifications(append = false) {
        notificationService.getMyNotifications({
            skipCount: skipCount,
            maxResultCount: maxResultCount
        }).then(function(result) {
            if (!append) $list.empty();
            
            if (result.items.length === 0 && !append) {
                $list.append('<div class="p-5 text-center text-muted">Hiç bildirim bulunamadı.</div>');
                $('#load-more-btn').addClass('d-none');
                return;
            }

            result.items.forEach(function(item) {
                var time = moment(item.creationTime).format('LLL');
                var unreadClass = item.isRead ? "" : "unread text-dark fw-bold border-start-warning";
                var itemHtml = `
                    <div class="list-group-item p-3 notif-page-item ${unreadClass}" data-id="${item.id}" data-url="${item.deepLinkUrl || '#'}">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <h6 class="mb-1 fw-bold text-primary">${item.title}</h6>
                            <small class="text-muted"><i class="fa fa-clock me-1"></i>${time}</small>
                        </div>
                        <p class="mb-1 text-muted small">${item.body}</p>
                        <div class="d-flex justify-content-end mt-2">
                             <button class="btn btn-sm btn-link text-danger delete-notif" data-id="${item.id}"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>`;
                $list.append(itemHtml);
            });

            if (result.items.length < maxResultCount) {
                $('#load-more-btn').addClass('d-none');
                $('#no-more-notif').removeClass('d-none');
            } else {
                $('#load-more-btn').removeClass('d-none');
                $('#no-more-notif').addClass('d-none');
            }
        });
    }

    loadNotifications();

    $('#load-more-btn').click(function() {
        skipCount += maxResultCount;
        loadNotifications(true);
    });

    $('#btn-mark-all-page').click(function() {
        notificationService.markAllAsRead().then(function() {
            abp.notify.success("Tüm bildirimler okundu.");
            skipCount = 0;
            loadNotifications();
        });
    });

    $(document).on('click', '.notif-page-item', function(e) {
        if ($(e.target).closest('.delete-notif').length) return;
        var id = $(this).data('id');
        var url = $(this).data('url');
        notificationService.markAsRead(id).then(function() {
            if (url && url !== '#') window.location.href = url;
            else loadNotifications();
        });
    });

    $(document).on('click', '.delete-notif', function() {
        var id = $(this).data('id');
        abp.message.confirm("Bildirim silinsin mi?", function(confirmed) {
            if (confirmed) {
                notificationService.delete(id).then(function() {
                    abp.notify.info("Bildirim silindi.");
                    loadNotifications();
                });
            }
        });
    });
});
