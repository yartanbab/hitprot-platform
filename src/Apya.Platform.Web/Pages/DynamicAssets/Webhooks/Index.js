$(function () {

    var svc = apya.platform.dynamicAssets.webhooks.webhookSubscription;

    var createModal = new abp.ModalManager(abp.appPath + 'DynamicAssets/Webhooks/CreateModal');
    var editModal   = new abp.ModalManager(abp.appPath + 'DynamicAssets/Webhooks/EditModal');

    var formNames = window.webhookFormNames || {};
    var canEdit   = abp.auth.isGranted('Platform.DynamicAssets.Edit');
    var canDelete = abp.auth.isGranted('Platform.DynamicAssets.Delete');

    var $container  = $('#WebhookCardsContainer');
    var $emptyState = $('#WebhookEmptyState');

    function escapeHtml(text) {
        return $('<div>').text(text == null ? '' : text).html();
    }

    function formName(id) {
        // Form adı kullanıcı girdisidir — HTML'e ham basılamaz (XSS).
        if (formNames[id]) {
            return escapeHtml(formNames[id]);
        }
        return '<span class="text-muted">' + (id ? escapeHtml(id.substring(0, 8)) + '…' : '-') + '</span>';
    }

    function formatDateTime(value) {
        return value ? new Date(value).toLocaleString('tr-TR') : '-';
    }

    function elapsedText(log) {
        return (log.elapsedMilliseconds === null || log.elapsedMilliseconds === undefined)
            ? '<span class="text-muted">—</span>'
            : log.elapsedMilliseconds + ' ms';
    }

    function renderLogRow(log) {
        return $(
            '<tr>' +
                '<td class="text-nowrap">' + formatDateTime(log.creationTime) + '</td>' +
                '<td><span class="apya-chip apya-numeric ' + (log.isSuccess ? 'apya-chip-positive' : 'apya-chip-negative') + '">' + (log.responseCode || '—') + '</span></td>' +
                '<td>' + elapsedText(log) + '</td>' +
                '<td><a href="#" class="apya-resend-link small text-decoration-none" data-log-id="' + log.id + '">' +
                    '<i class="fa fa-rotate-right me-1"></i>Yeniden gönder' +
                '</a></td>' +
            '</tr>'
        );
    }

    function loadLogs($card, subscriptionId) {
        var $body = $card.find('.apya-logs-body');
        $body.html('<tr><td colspan="4" class="text-center text-muted py-3">Yükleniyor…</td></tr>');

        svc.getDeliveryLogs(subscriptionId).then(function (logs) {
            $body.empty();
            if (!logs.length) {
                $body.html('<tr><td colspan="4" class="text-center text-muted py-3">' +
                    '<i class="fa fa-inbox me-1"></i>Bu abonelik için henüz teslimat kaydı yok.</td></tr>');
                return;
            }
            logs.forEach(function (log) { $body.append(renderLogRow(log)); });
        });
    }

    function cardTemplate(sub) {
        var statusClass = sub.isActive ? 'apya-status-dot--active' : 'apya-status-dot--inactive';

        var $card = $(
            '<div class="card">' +
              '<div class="card-body">' +
                '<div class="d-flex align-items-center gap-2 flex-wrap">' +
                  '<span class="apya-status-dot ' + statusClass + '"></span>' +
                  '<code class="flex-grow-1 text-break">' + escapeHtml(sub.targetUrl) + '</code>' +
                  '<div class="form-check form-switch mb-0">' +
                    '<input class="form-check-input apya-active-toggle" type="checkbox" role="switch"' +
                      (sub.isActive ? ' checked' : '') + (canEdit ? '' : ' disabled') + '>' +
                  '</div>' +
                '</div>' +
                '<div class="d-flex align-items-center flex-wrap gap-2 mt-2">' +
                  '<span class="apya-chip apya-chip-accent">' + formName(sub.documentId) + '</span>' +
                '</div>' +
                '<div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 pt-3 border-top">' +
                  '<div class="d-flex align-items-center gap-2 text-muted small">' +
                    '<i class="fa fa-lock"></i>' +
                    '<span>Gizli anahtar yapılandırıldı</span>' +
                    (canEdit ?
                      '<button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 apya-regenerate-secret">' +
                        '<i class="fa fa-rotate"></i> Yeniden oluştur' +
                      '</button>' : '') +
                  '</div>' +
                  '<div class="apya-row-actions d-flex align-items-center gap-1">' +
                    (canEdit ? '<button type="button" class="btn btn-sm btn-link text-muted apya-edit-btn" title="Düzenle"><i class="fa fa-pen"></i></button>' : '') +
                    (canDelete ? '<button type="button" class="btn btn-sm btn-link text-danger apya-delete-btn" title="Sil"><i class="fa fa-trash"></i></button>' : '') +
                  '</div>' +
                '</div>' +
                '<div class="mt-2">' +
                  '<a href="#" class="apya-toggle-logs small text-decoration-none">' +
                    'Teslimat Kayıtları <i class="fa fa-chevron-down apya-expand-chevron ms-1"></i>' +
                  '</a>' +
                  '<div class="apya-logs-panel d-none mt-2">' +
                    '<div class="table-responsive">' +
                      '<table class="table table-sm align-middle mb-0">' +
                        '<thead><tr><th>Zaman</th><th>HTTP Durum</th><th>Yanıt Süresi</th><th>İşlem</th></tr></thead>' +
                        '<tbody class="apya-logs-body"></tbody>' +
                      '</table>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
        );

        $card.data('sub', sub);
        return $card;
    }

    function loadList() {
        svc.getList({ maxResultCount: 1000, sorting: 'creationTime desc' }).then(function (result) {
            $container.empty();

            if (!result.items.length) {
                $container.addClass('d-none');
                $emptyState.removeClass('d-none');
                return;
            }

            $container.removeClass('d-none');
            $emptyState.addClass('d-none');
            result.items.forEach(function (sub) { $container.append(cardTemplate(sub)); });
        });
    }

    // --- Aksiyonlar (event delegation — kartlar dinamik oluşturulur) ---

    $container.on('change', '.apya-active-toggle', function () {
        var $toggle = $(this);
        var $card = $toggle.closest('.card');
        var sub = $card.data('sub');
        var nextActive = $toggle.is(':checked');

        $toggle.prop('disabled', true);
        svc.update(sub.id, {
            documentId: sub.documentId,
            targetUrl: sub.targetUrl,
            secret: '',
            isActive: nextActive
        }).then(function (updated) {
            sub.isActive = updated.isActive;
            $card.data('sub', sub);
            $card.find('.apya-status-dot')
                .toggleClass('apya-status-dot--active', updated.isActive)
                .toggleClass('apya-status-dot--inactive', !updated.isActive);
            $toggle.prop('disabled', !canEdit);
        }, function () {
            $toggle.prop('checked', !nextActive).prop('disabled', !canEdit);
            abp.notify.error('Durum güncellenemedi.');
        });
    });

    $container.on('click', '.apya-regenerate-secret', function () {
        var subId = $(this).closest('.card').data('sub').id;

        Swal.fire({
            title: 'Gizli Anahtarı Yeniden Oluştur',
            text: 'Mevcut gizli anahtar geçersiz olacak; hedef sistemde de güncellemeniz gerekir. Devam edilsin mi?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Yeniden Oluştur',
            cancelButtonText: 'İptal',
            confirmButtonColor: '#dc3545'
        }).then(function (result) {
            if (!result.isConfirmed) return;

            svc.regenerateSecret(subId).then(function (res) {
                var secret = res.secret;
                Swal.fire({
                    title: 'Yeni Gizli Anahtar',
                    icon: 'success',
                    html:
                        '<p class="text-start text-muted mb-2">Bu değeri şimdi kopyalayın — güvenlik nedeniyle bir daha gösterilmeyecek.</p>' +
                        '<div class="input-group">' +
                            '<input type="text" id="apya-secret-reveal-input" class="form-control" readonly value="' + escapeHtml(secret) + '">' +
                            '<button type="button" class="btn btn-outline-secondary" id="apya-secret-copy-btn"><i class="fa fa-copy"></i></button>' +
                        '</div>',
                    confirmButtonText: 'Kapat',
                    didOpen: function () {
                        document.getElementById('apya-secret-copy-btn').addEventListener('click', function () {
                            navigator.clipboard.writeText(secret);
                            abp.notify.success('Gizli anahtar kopyalandı.');
                        });
                    }
                });
            });
        });
    });

    $container.on('click', '.apya-edit-btn', function () {
        var subId = $(this).closest('.card').data('sub').id;
        editModal.open({ id: subId });
    });

    $container.on('click', '.apya-delete-btn', function () {
        var subId = $(this).closest('.card').data('sub').id;

        Swal.fire({
            title: 'Webhook Silinecek',
            text: 'Bu webhook aboneliği silinecek. Emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'İptal',
            confirmButtonColor: '#dc3545'
        }).then(function (result) {
            if (!result.isConfirmed) return;
            svc.delete(subId).then(function () {
                abp.notify.success('Webhook aboneliği silindi.');
                loadList();
            });
        });
    });

    $container.on('click', '.apya-toggle-logs', function (e) {
        e.preventDefault();
        var $link = $(this);
        var $card = $link.closest('.card');
        var $panel = $card.find('.apya-logs-panel');
        var $chevron = $link.find('.apya-expand-chevron');
        var opening = $panel.hasClass('d-none');

        $panel.toggleClass('d-none', !opening);
        $chevron.toggleClass('is-open', opening);

        if (opening && !$card.data('logsLoaded')) {
            $card.data('logsLoaded', true);
            loadLogs($card, $card.data('sub').id);
        }
    });

    $container.on('click', '.apya-resend-link', function (e) {
        e.preventDefault();
        var $link = $(this);
        var logId = $link.data('log-id');
        var $body = $link.closest('.apya-logs-panel').find('.apya-logs-body');

        $link.addClass('disabled').html('<i class="fa fa-spinner fa-spin me-1"></i>Gönderiliyor…');
        svc.resendDelivery(logId).then(function (newLog) {
            abp.notify.success('Teslimat yeniden gönderildi.');
            $body.prepend(renderLogRow(newLog));
        }, function () {
            $link.removeClass('disabled').html('<i class="fa fa-rotate-right me-1"></i>Yeniden gönder');
        });
    });

    $('#NewWebhookButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(loadList);
    editModal.onResult(loadList);

    loadList();
});
