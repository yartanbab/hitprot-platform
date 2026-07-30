$(function () {
    var feedbackService = apya.platform.feedbacks.feedback;
    var $list = $('#feedback-full-list');
    var skipCount = 0;
    var maxResultCount = 10;

    var TYPE_ICONS = { 1: 'fa-bug text-danger', 2: 'fa-lightbulb text-warning', 3: 'fa-circle-question text-info', 4: 'fa-heart text-success' };
    var TYPE_LABELS = { 1: 'Hata', 2: 'Öneri', 3: 'Soru', 4: 'Beğeni' };
    var STATUS_LABELS = { 1: 'Yeni', 2: 'İnceleniyor', 3: 'Planlandı', 4: 'Tamamlandı', 5: 'Reddedildi' };
    var STATUS_CLASSES = { 1: 'bg-secondary', 2: 'bg-info', 3: 'bg-primary', 4: 'bg-success', 5: 'bg-dark' };

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
                var itemHtml = `
                    <div class="list-group-item p-3 feedback-page-item" data-id="${item.id}">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <h6 class="mb-1"><i class="fa ${TYPE_ICONS[item.type] || 'fa-comment'} me-2"></i>${item.subject}</h6>
                            <small class="text-muted"><i class="fa fa-clock me-1"></i>${time}</small>
                        </div>
                        <div class="d-flex align-items-center mt-1">
                            <span class="badge feedback-status-badge ${STATUS_CLASSES[item.status] || 'bg-secondary'}">${STATUS_LABELS[item.status] || item.status}</span>
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

    $(document).on('click', '.feedback-page-item', function () {
        var id = $(this).data('id');
        feedbackService.getMy(id).then(function (detail) {
            $('#feedback-detail-subject').text(detail.subject);
            $('#feedback-detail-body').text(detail.body);

            var metaParts = [
                STATUS_LABELS[detail.status] || detail.status,
                moment(detail.creationTime).format('LLL')
            ];
            $('#feedback-detail-meta').text(metaParts.join(' · '));

            var $comments = $('#feedback-detail-comments').empty();
            if (!detail.comments || detail.comments.length === 0) {
                $comments.append('<p class="text-muted text-sm">Henüz cevap yok.</p>');
            } else {
                detail.comments.forEach(function (c) {
                    $comments.append(
                        '<div class="feedback-comment-item"><div class="text-sm">' + c.text + '</div>' +
                        '<div class="text-muted text-xs mt-1">' + (c.authorName || 'Ekip') + ' · ' + moment(c.creationTime).format('LLL') + '</div></div>'
                    );
                });
            }

            bootstrap.Modal.getOrCreateInstance(document.getElementById('feedback-detail-modal')).show();
        });
    });
});
