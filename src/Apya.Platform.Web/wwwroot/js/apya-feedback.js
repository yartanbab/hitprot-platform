// Geri bildirim widget'ı: header linki + her sayfada gizli duran modal.
// Bağlam (sayfa URL'si, ekran çözünürlüğü, davranış izi, modül/bileşen kodları)
// sessizce eklenir; kullanıcı yalnızca tür/konu/açıklama/puan/(opsiyonel)
// ekran görüntüsü ve türe özel alanları girer.
(function () {
    'use strict';

    if (typeof window.ApyaFeedback !== 'undefined') {
        return;
    }

    var TYPE_BUG = 1;
    var TYPE_SUGGESTION = 2;
    var MAX_ATTACHMENTS = 5;
    var DRAFT_KEY = 'apyaFeedbackDraft';

    var $modal = null;
    var $form = null;
    var selectedRating = null;
    var pendingScreenshotFileName = null;
    var pendingAttachments = []; // [{fileName, storedFileName, contentType, sizeBytes}]

    // ApyaFeedback.open({module, component, action, entityType, entityId}) ile gelen
    // bağlam; modal kapanana kadar geçerli. Global link bağlamsız açar.
    var openContext = {};

    function resetForm() {
        if (!$form) return;
        $form[0].reset();
        selectedRating = null;
        pendingScreenshotFileName = null;
        pendingAttachments = [];
        $form.find('.apya-feedback-rating .fa-star').removeClass('fa-solid text-warning').addClass('fa-regular');
        $form.find('.apya-feedback-screenshot-name').text('');
        $form.find('.apya-feedback-attachment-list').empty();
        $form.find('.apya-feedback-error').addClass('d-none').text('');
        // Success panelinden form görünümüne dön.
        $form.find('.apya-feedback-success').addClass('d-none');
        $form.find('.modal-body > :not(.apya-feedback-success)').removeClass('d-none');
        $form.find('.apya-feedback-submit').removeClass('d-none');
        syncDetailSections();
    }

    /* --- Taslak koruması: yanlışlıkla kapatmada metin kaybolmasın --- */

    function saveDraft() {
        try {
            var draft = {
                type: $form.find('[name=Type]').val(),
                subject: $form.find('[name=Subject]').val(),
                body: $form.find('[name=Body]').val(),
                severity: $form.find('[name=Severity]').val()
            };
            if (!draft.subject && !draft.body) {
                localStorage.removeItem(DRAFT_KEY);
                return;
            }
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch (e) { /* localStorage yoksa taslak özelliği sessizce devre dışı */ }
    }

    function restoreDraft() {
        try {
            var raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            var draft = JSON.parse(raw);
            if (draft.type) { $form.find('[name=Type]').val(draft.type); syncDetailSections(); }
            if (draft.subject) $form.find('[name=Subject]').val(draft.subject);
            if (draft.body) $form.find('[name=Body]').val(draft.body);
            if (draft.severity) $form.find('[name=Severity]').val(draft.severity);
        } catch (e) { /* bozuk taslak yok sayılır */ }
    }

    function clearDraft() {
        try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* yoksay */ }
    }

    // Tür seçimine göre türe özel alan bölümünü göster/gizle.
    function syncDetailSections() {
        var type = parseInt($form.find('[name=Type]').val(), 10);
        $form.find('.apya-feedback-details').addClass('d-none');
        if (type === TYPE_BUG) {
            $form.find('.apya-feedback-details-bug').removeClass('d-none');
        } else if (type === TYPE_SUGGESTION) {
            $form.find('.apya-feedback-details-suggestion').removeClass('d-none');
        }
    }

    // Görünür türe özel alanları JSON nesnesine paketler. Boşlar atlanır; hiç değer
    // yoksa null döner. Form alanı DEĞERLERİ değil, kullanıcının bilerek yazdıkları.
    function collectDetailsJson() {
        var details = {};
        var any = false;
        $form.find('.apya-feedback-details').not('.d-none').find('[data-detail]').each(function () {
            var value = $(this).val();
            if (value && value.trim()) {
                details[$(this).data('detail')] = value.trim();
                any = true;
            }
        });
        return any ? JSON.stringify(details) : null;
    }

    function open(context) {
        if (!$modal) return;
        resetForm();
        restoreDraft();
        openContext = context || {};
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

    function uploadFile(handler, file, callback) {
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: '/Feedback?handler=' + handler,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: { RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val() }
        }).done(function (result) {
            callback(result || null);
        }).fail(function () {
            abp.notify.error('Dosya yüklenemedi: ' + file.name);
            callback(null);
        });
    }

    function renderAttachmentList() {
        var $list = $form.find('.apya-feedback-attachment-list');
        $list.empty();
        pendingAttachments.forEach(function (a, index) {
            var $item = $('<li></li>');
            $item.append($('<i class="fa fa-paperclip me-1"></i>'));
            $item.append($('<span></span>').text(a.fileName + ' (' + Math.round(a.sizeBytes / 1024) + ' KB)'));
            $('<a href="#" class="ms-2 text-danger" aria-label="Kaldır"><i class="fa fa-times"></i></a>')
                .on('click', function (e) {
                    e.preventDefault();
                    pendingAttachments.splice(index, 1);
                    renderAttachmentList();
                })
                .appendTo($item);
            $list.append($item);
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

        var severity = $form.find('[name=Severity]').val();

        var dto = {
            type: parseInt($form.find('[name=Type]').val(), 10),
            subject: subject.trim(),
            body: body.trim(),
            rating: selectedRating,
            severity: severity ? parseInt(severity, 10) : null,
            detailsJson: collectDetailsJson(),
            isAnonymous: $form.find('[name=IsAnonymous]').is(':checked'),
            allowContact: $form.find('[name=AllowContact]').is(':checked'),
            pageUrl: $form.find('[name=PageUrl]').val(),
            pageTitle: document.title,
            screenResolution: window.screen ? (window.screen.width + 'x' + window.screen.height) : null,
            appVersion: null,
            breadcrumbJson: window.ApyaTelemetry ? window.ApyaTelemetry.getBreadcrumbJson() : null,
            userAgent: navigator.userAgent,
            screenshotFileName: pendingScreenshotFileName,
            attachments: pendingAttachments.length > 0 ? pendingAttachments : null,
            // Bağlamsal kodlar — yalnızca ApyaFeedback.open({...}) ile açıldıysa dolu.
            moduleCode: openContext.module || null,
            componentCode: openContext.component || null,
            actionCode: openContext.action || null,
            relatedEntityType: openContext.entityType || null,
            relatedEntityId: openContext.entityId || null,
            lastClientErrorId: window.ApyaTelemetry && window.ApyaTelemetry.getLastClientErrorId
                ? window.ApyaTelemetry.getLastClientErrorId()
                : null
        };

        var $submitBtn = $form.find('.apya-feedback-submit');
        $submitBtn.prop('disabled', true);

        apya.platform.feedbacks.feedback.submit(dto)
            .then(function (created) {
                clearDraft();
                showSuccess(created && created.feedbackNumber);
            })
            .catch(function (err) {
                // Metin kaybolmaz: modal açık kalır, kullanıcı düzeltip yeniden dener.
                var message = (err && err.message) || 'Gönderim başarısız oldu. Lütfen tekrar deneyin.';
                showError(message);
            })
            .then(function () {
                $submitBtn.prop('disabled', false);
            });
    }

    /// Form alanlarını gizleyip FB numaralı teşekkür panelini gösterir.
    function showSuccess(feedbackNumber) {
        $form.find('.modal-body > :not(.apya-feedback-success)').addClass('d-none');
        $form.find('.apya-feedback-submit').addClass('d-none');
        $form.find('.apya-feedback-success-number').text(feedbackNumber || '');
        $form.find('.apya-feedback-success').removeClass('d-none');
    }

    function showError(message) {
        $form.find('.apya-feedback-error').removeClass('d-none').text(message);
    }

    $(function () {
        $modal = $('#apya-feedback-modal');
        if ($modal.length === 0) return; // Yalnızca oturum açık kullanıcıda render edilir.

        $form = $modal.find('form');

        $form.find('[name=Type]').on('change', syncDetailSections);
        syncDetailSections();

        $modal.find('.apya-feedback-rating .fa-star').on('click', function () {
            setRating($(this).data('value'));
        });

        $modal.find('.apya-feedback-screenshot-input').on('change', function (e) {
            var file = e.target.files && e.target.files[0];
            if (!file) return;
            var $name = $form.find('.apya-feedback-screenshot-name');
            $name.text('Yükleniyor...');
            uploadFile('UploadScreenshot', file, function (result) {
                pendingScreenshotFileName = result && result.storedFileName;
                $name.text(pendingScreenshotFileName ? file.name : '');
            });
        });

        $modal.find('.apya-feedback-attachment-input').on('change', function (e) {
            var files = Array.prototype.slice.call(e.target.files || []);
            e.target.value = ''; // aynı dosya tekrar seçilebilsin
            files.forEach(function (file) {
                if (pendingAttachments.length >= MAX_ATTACHMENTS) {
                    abp.notify.warn('En fazla ' + MAX_ATTACHMENTS + ' dosya eklenebilir.');
                    return;
                }
                uploadFile('UploadAttachment', file, function (result) {
                    if (result && result.storedFileName) {
                        pendingAttachments.push({
                            fileName: result.fileName,
                            storedFileName: result.storedFileName,
                            contentType: result.contentType,
                            sizeBytes: result.sizeBytes
                        });
                        renderAttachmentList();
                    }
                });
            });
        });

        // Taslak: yazarken kaydet (input başına debounce'a gerek yok, alan az).
        $form.on('input change', '[name=Subject], [name=Body], [name=Type], [name=Severity]', saveDraft);

        $modal.find('.apya-feedback-copy-number').on('click', function () {
            var number = $form.find('.apya-feedback-success-number').text();
            if (number && navigator.clipboard) {
                navigator.clipboard.writeText(number).then(function () {
                    abp.notify.success('Numara kopyalandı: ' + number);
                });
            }
        });

        $modal.find('.apya-feedback-submit').on('click', submit);

        $(document).on('click', '.apya-feedback-open-link', function (e) {
            e.preventDefault();
            // Bağlamsal linkler data-* ile bağlam taşıyabilir (bkz. _FeedbackLink.cshtml).
            var $link = $(this);
            open({
                module: $link.data('feedback-module'),
                component: $link.data('feedback-component'),
                action: $link.data('feedback-action'),
                entityType: $link.data('feedback-entity-type'),
                entityId: $link.data('feedback-entity-id')
            });
        });
    });

    window.ApyaFeedback = { open: open };
})();
