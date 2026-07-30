// Geri bildirim widget'ı: header linki + her sayfada gizli duran modal.
// Bağlam (sayfa URL'si, ekran çözünürlüğü, davranış izi) sessizce eklenir;
// kullanıcı yalnızca tür/konu/açıklama/puan/(opsiyonel) ekran görüntüsü girer.
(function () {
    'use strict';

    if (typeof window.ApyaFeedback !== 'undefined') {
        return;
    }

    var $modal = null;
    var $form = null;
    var selectedRating = null;
    var pendingScreenshotFileName = null;

    function resetForm() {
        if (!$form) return;
        $form[0].reset();
        selectedRating = null;
        pendingScreenshotFileName = null;
        $form.find('.apya-feedback-rating .fa-star').removeClass('fa-solid text-warning').addClass('fa-regular');
        $form.find('.apya-feedback-screenshot-name').text('');
        $form.find('.apya-feedback-error').addClass('d-none').text('');
    }

    function open() {
        if (!$modal) return;
        resetForm();
        var ctx = window.ApyaTelemetry ? window.ApyaTelemetry.getPageContext() : {};
        $form.find('[name=PageUrl]').val(ctx.pageUrl || location.pathname);
        var modal = bootstrap.Modal.getOrCreateInstance($modal[0]);
        modal.show();
    }

    function setRating(value) {
        selectedRating = value;
        $form.find('.apya-feedback-rating .fa-star').each(function (i) {
            var $star = $(this);
            var starValue = i + 1;
            if (starValue <= value) {
                $star.removeClass('fa-regular').addClass('fa-solid text-warning');
            } else {
                $star.removeClass('fa-solid text-warning').addClass('fa-regular');
            }
        });
    }

    function uploadScreenshot(file, callback) {
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: '/Feedback?handler=UploadScreenshot',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: { RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val() }
        }).done(function (result) {
            callback(result && result.storedFileName);
        }).fail(function () {
            abp.notify.error('Ekran görüntüsü yüklenemedi.');
            callback(null);
        });
    }

    function submit() {
        var subject = $form.find('[name=Subject]').val();
        var body = $form.find('[name=Body]').val();

        if (!subject || !subject.trim()) {
            showError('Konu alanı boş bırakılamaz.');
            return;
        }
        if (!body || !body.trim()) {
            showError('Açıklama alanı boş bırakılamaz.');
            return;
        }

        var dto = {
            type: parseInt($form.find('[name=Type]').val(), 10),
            subject: subject.trim(),
            body: body.trim(),
            rating: selectedRating,
            pageUrl: $form.find('[name=PageUrl]').val(),
            pageTitle: document.title,
            screenResolution: window.screen ? (window.screen.width + 'x' + window.screen.height) : null,
            appVersion: null,
            breadcrumbJson: window.ApyaTelemetry ? window.ApyaTelemetry.getBreadcrumbJson() : null,
            userAgent: navigator.userAgent,
            screenshotFileName: pendingScreenshotFileName
        };

        var $submitBtn = $form.find('.apya-feedback-submit');
        $submitBtn.prop('disabled', true);

        apya.platform.feedbacks.feedback.submit(dto)
            .then(function () {
                bootstrap.Modal.getOrCreateInstance($modal[0]).hide();
                abp.notify.success('Geri bildiriminiz için teşekkürler!');
            })
            .catch(function (err) {
                var message = (err && err.message) || 'Gönderim başarısız oldu. Lütfen tekrar deneyin.';
                showError(message);
            })
            .then(function () {
                $submitBtn.prop('disabled', false);
            });
    }

    function showError(message) {
        $form.find('.apya-feedback-error').removeClass('d-none').text(message);
    }

    $(function () {
        $modal = $('#apya-feedback-modal');
        if ($modal.length === 0) return; // Yalnızca oturum açık kullanıcıda render edilir.

        $form = $modal.find('form');

        $modal.find('.apya-feedback-rating .fa-star').on('click', function () {
            setRating($(this).data('value'));
        });

        $modal.find('.apya-feedback-screenshot-input').on('change', function (e) {
            var file = e.target.files && e.target.files[0];
            if (!file) return;
            var $name = $form.find('.apya-feedback-screenshot-name');
            $name.text('Yükleniyor...');
            uploadScreenshot(file, function (storedFileName) {
                pendingScreenshotFileName = storedFileName;
                $name.text(storedFileName ? file.name : '');
            });
        });

        $modal.find('.apya-feedback-submit').on('click', submit);

        $(document).on('click', '.apya-feedback-open-link', function (e) {
            e.preventDefault();
            open();
        });
    });

    window.ApyaFeedback = { open: open };
})();
