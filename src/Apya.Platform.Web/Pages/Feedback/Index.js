$(function () {
    var feedbackService = apya.platform.feedbacks.feedback;
    var $list = $('#feedback-full-list');
    var skipCount = 0;
    var maxResultCount = 10;

    var TYPE_ICONS = {
        1: 'fa-bug text-danger', 2: 'fa-lightbulb text-warning', 3: 'fa-circle-question text-info',
        4: 'fa-heart text-success', 5: 'fa-hand-point-up text-warning', 6: 'fa-file-circle-question text-info',
        7: 'fa-gauge-high text-danger', 8: 'fa-palette text-info', 9: 'fa-comment text-secondary'
    };
    var TYPE_LABELS = {
        1: 'Hata', 2: 'Öneri', 3: 'Soru', 4: 'Beğeni', 5: 'Kullanım Zorluğu',
        6: 'Eksik İçerik', 7: 'Performans', 8: 'Tasarım/UX', 9: 'Diğer'
    };
    // Kullanıcı İÇ durumu değil sadeleşmiş UserStatus'u görür (FeedbackUserStatus enum'u).
    var USER_STATUS_LABELS = {
        1: 'Alındı', 2: 'İnceleniyor', 3: 'Ek bilgi bekleniyor', 4: 'Planlandı',
        5: 'Geliştiriliyor', 6: 'Tamamlandı', 7: 'Yayınlandı', 8: 'Kapatıldı'
    };
    var USER_STATUS_CLASSES = {
        1: 'bg-secondary', 2: 'bg-info', 3: 'bg-warning text-dark', 4: 'bg-primary',
        5: 'bg-primary', 6: 'bg-success', 7: 'bg-success', 8: 'bg-dark'
    };

    // Kullanıcı girdisi HTML şablonuna giriyor → daima kaçır (XSS).
    function esc(value) {
        return $('<span>').text(value == null ? '' : value).html();
    }

    function renderStars(rating) {
        if (!rating) return '';
        var html = '<span class="text-warning ms-2">';
        for (var i = 1; i <= 5; i++) {
            html += '<i class="fa-' + (i <= rating ? 'solid' : 'regular') + ' fa-star fa-xs"></i>';
        }
        return html + '</span>';
    }

    function loadFeedback(append) {
        feedbackService.getMyList({
            skipCount: skipCount,
            maxResultCount: maxResultCount
        }).then(function (result) {
            if (!append) $list.empty();

            if (result.items.length === 0 && !append) {
                $list.append('<div class="p-5 text-center text-muted">Henüz geri bildirim göndermediniz.</div>');
                $('#load-more-btn').addClass('d-none');
                return;
            }

            result.items.forEach(function (item) {
                var time = moment(item.creationTime).format('LLL');
                var answeredBadge = item.commentCount > 0
                    ? '<span class="badge bg-light text-dark ms-2"><i class="fa fa-reply me-1"></i>' + item.commentCount + '</span>'
                    : '';
                var numberBadge = item.feedbackNumber
                    ? '<span class="text-muted text-xs me-2 font-monospace">' + esc(item.feedbackNumber) + '</span>'
                    : '';
                var itemHtml = `
                    <div class="list-group-item p-3 feedback-page-item" data-id="${item.id}">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <h6 class="mb-1"><i class="fa ${TYPE_ICONS[item.type] || 'fa-comment'} me-2"></i>${esc(item.subject)}</h6>
                            <small class="text-muted"><i class="fa fa-clock me-1"></i>${time}</small>
                        </div>
                        <div class="d-flex align-items-center mt-1">
                            ${numberBadge}
                            <span class="badge feedback-status-badge ${USER_STATUS_CLASSES[item.userStatus] || 'bg-secondary'}">${USER_STATUS_LABELS[item.userStatus] || ''}</span>
                            <span class="text-muted text-xs ms-2">${TYPE_LABELS[item.type] || ''}</span>
                            ${renderStars(item.rating)}
                            ${answeredBadge}
                        </div>
                    </div>`;
                $list.append(itemHtml);
            });

            if (result.items.length < maxResultCount) {
                $('#load-more-btn').addClass('d-none');
                $('#no-more-feedback').removeClass('d-none');
            } else {
                $('#load-more-btn').removeClass('d-none');
                $('#no-more-feedback').addClass('d-none');
            }
        });
    }

    loadFeedback(false);

    $('#load-more-btn').click(function () {
        skipCount += maxResultCount;
        loadFeedback(true);
    });

    $('#btn-new-feedback').click(function () {
        if (window.ApyaFeedback) window.ApyaFeedback.open();
    });

    var currentDetailId = null;

    function renderDetail(detail) {
        currentDetailId = detail.id;
        $('#feedback-detail-subject').text(detail.subject);
        $('#feedback-detail-body').text(detail.body);

        var metaParts = [
            detail.feedbackNumber,
            USER_STATUS_LABELS[detail.userStatus] || '',
            moment(detail.creationTime).format('LLL')
        ].filter(Boolean);
        $('#feedback-detail-meta').text(metaParts.join(' · '));

        var $attachments = $('#feedback-detail-attachments').empty();
        var links = [];
        if (detail.hasScreenshot) {
            links.push('<a href="/Feedback?handler=Screenshot&feedbackId=' + detail.id + '" target="_blank">' +
                '<i class="fa fa-image me-1"></i>Ekran görüntüsü</a>');
        }
        (detail.attachments || []).forEach(function (a) {
            links.push('<a href="/Feedback?handler=Attachment&attachmentId=' + a.id + '" target="_blank">' +
                '<i class="fa fa-paperclip me-1"></i>' + esc(a.fileName) + '</a>');
        });
        if (links.length > 0) {
            $attachments.html('<div class="text-sm d-flex flex-wrap gap-3">' + links.join('') + '</div>');
        }

        var $comments = $('#feedback-detail-comments').empty();
        if (!detail.comments || detail.comments.length === 0) {
            $comments.append('<p class="text-muted text-sm">Henüz cevap yok.</p>');
        } else {
            detail.comments.forEach(function (c) {
                $comments.append(
                    '<div class="feedback-comment-item"><div class="text-sm">' + esc(c.text) + '</div>' +
                    '<div class="text-muted text-xs mt-1">' + esc(c.authorName || 'Ekip') + ' · ' + moment(c.creationTime).format('LLL') + '</div></div>'
                );
            });
        }

        $('#feedback-detail-comment-input').val('');
    }

    $(document).on('click', '.feedback-page-item', function () {
        var id = $(this).data('id');
        feedbackService.getMy(id).then(function (detail) {
            renderDetail(detail);
            bootstrap.Modal.getOrCreateInstance(document.getElementById('feedback-detail-modal')).show();
        });
    });

    $('#feedback-detail-comment-send').click(function () {
        var text = $('#feedback-detail-comment-input').val();
        if (!text || !text.trim() || !currentDetailId) return;

        var $btn = $(this).prop('disabled', true);
        feedbackService.addMyComment(currentDetailId, { text: text.trim() })
            .then(function () {
                // Yorum + olası durum değişikliği (NeedsInfo→InReview) taze gelsin.
                return feedbackService.getMy(currentDetailId);
            })
            .then(function (detail) {
                renderDetail(detail);
                loadFeedbackReset();
            })
            .catch(function (err) {
                abp.notify.error((err && err.message) || 'Yorum gönderilemedi.');
            })
            .then(function () { $btn.prop('disabled', false); });
    });

    function loadFeedbackReset() {
        skipCount = 0;
        loadFeedback(false);
    }
});
