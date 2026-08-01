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
    var LAST_STEP = 2;

    var $modal = null;
    var $form = null;
    var selectedRating = null;
    var pendingScreenshotFileName = null;
    var pendingAttachments = []; // [{fileName, storedFileName, contentType, sizeBytes}]
    var currentStep = 1;

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
        clearError();
        // Başarı panelinden form görünümüne dön; görünürlüğü goToStep yönetir.
        $form.find('.apya-feedback-success').addClass('d-none');
        $form.find('.apya-feedback-stepper').removeClass('d-none');
        syncDetailSections();
        goToStep(1);
    }

    /* --- Adım gezinmesi -------------------------------------------------- */

    // Aynı anda tek adım görünür; footer buton takımı da adıma bağlıdır.
    function goToStep(step) {
        currentStep = step;

        $form.find('.apya-feedback-step').addClass('d-none');
        $form.find('.apya-feedback-step[data-step="' + step + '"]').removeClass('d-none');

        $form.find('.apya-feedback-stepper-item').each(function () {
            var itemStep = parseInt($(this).data('step'), 10);
            $(this).toggleClass('is-active', itemStep === step)
                   .toggleClass('is-done', itemStep < step);
        });

        $form.find('.apya-feedback-back').toggleClass('d-none', step === 1);
        $form.find('.apya-feedback-next').toggleClass('d-none', step === LAST_STEP);
        $form.find('.apya-feedback-submit').toggleClass('d-none', step !== LAST_STEP);

        $modal.find('.modal-body').scrollTop(0);
    }

    // 1. adımdaki zorunlu alanlar — hem "İleri"de hem gönderimde kullanılır.
    function validateCoreFields() {
        var subject = $form.find('[name=Subject]').val();
        var body = $form.find('[name=Body]').val();

        if (!subject || !subject.trim()) {
            return 'Konu alanı boş bırakılamaz.';
        }
        if (!body || !body.trim()) {
            return 'Açıklama alanı boş bırakılamaz.';
        }
        return null;
    }

    /* --- Taslak koruması: yanlışlıkla kapatmada metin kaybolmasın --- */

    // Türe özel alanların TAMAMI (görünmeyenler dahil) — taslakta tür değiştirip
    // geri dönen kullanıcı yazdıklarını kaybetmesin.
    function collectDetailValues() {
        var values = {};
        $form.find('[data-detail]').each(function () {
            var value = $(this).val();
            if (value && value.trim()) {
                values[$(this).data('detail')] = value;
            }
        });
        return values;
    }

    function saveDraft() {
        try {
            var details = collectDetailValues();
            var draft = {
                type: $form.find('[name=Type]').val(),
                subject: $form.find('[name=Subject]').val(),
                body: $form.find('[name=Body]').val(),
                severity: $form.find('[name=Severity]').val(),
                details: details
            };
            if (!draft.subject && !draft.body && Object.keys(details).length === 0) {
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
            if (draft.details) {
                Object.keys(draft.details).forEach(function (key) {
                    $form.find('[data-detail="' + key + '"]').val(draft.details[key]);
                });
            }
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

    // Ayardan gelen boyut/uzantı sınırını yükleme ÖNCESİ uygular (sunucu ayrıca
    // doğrular). Uygunsa null, değilse kullanıcıya gösterilecek sebep döner.
    function validateFile($input, file) {
        var maxMb = parseFloat($input.data('max-mb'));
        if (maxMb > 0 && file.size > maxMb * 1024 * 1024) {
            return file.name + ': dosya çok büyük (' + (file.size / 1024 / 1024).toFixed(1) +
                   ' MB). En fazla ' + maxMb + ' MB yükleyebilirsiniz.';
        }

        var accept = ($input.attr('accept') || '').toLowerCase();
        if (accept) {
            var dot = file.name.lastIndexOf('.');
            var ext = dot >= 0 ? file.name.substring(dot).toLowerCase() : '';
            var allowed = accept.split(',').map(function (e) { return e.trim(); })
                                .filter(function (e) { return e.length > 0; });
            if (allowed.indexOf(ext) === -1) {
                return file.name + ': "' + ext + '" uzantısı kabul edilmiyor. İzin verilenler: ' + allowed.join(', ');
            }
        }

        return null;
    }

    // Sunucunun reddetme sebebini çıkarır: düz metin (BadRequest) veya ABP hata
    // zarfı (BusinessException) olabilir. HTML hata sayfası gelirse yok sayılır.
    function extractFailureReason(xhr) {
        if (!xhr) return '';
        if (xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.message) {
            return xhr.responseJSON.error.message;
        }
        var text = xhr.responseText;
        if (typeof text === 'string' && text.length > 0 && text.charAt(0) !== '<') {
            return text;
        }
        return '';
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
        }).fail(function (xhr) {
            // Sebebi göster — "Dosya yüklenemedi" tek başına kullanıcıya neyi
            // düzeltmesi gerektiğini söylemiyordu.
            var reason = extractFailureReason(xhr);
            abp.notify.error(reason ? file.name + ': ' + reason : 'Dosya yüklenemedi: ' + file.name);
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
        var problem = validateCoreFields();
        if (problem) {
            // Eksik alan 1. adımda — kullanıcıyı sorunun olduğu yere geri götür.
            goToStep(1);
            showError(problem);
            return;
        }

        clearError();

        var subject = $form.find('[name=Subject]').val();
        var body = $form.find('[name=Body]').val();
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

    /// Adımları gizleyip FB numaralı teşekkür panelini gösterir.
    function showSuccess(feedbackNumber) {
        $form.find('.apya-feedback-stepper, .apya-feedback-step').addClass('d-none');
        clearError();
        $form.find('.apya-feedback-back, .apya-feedback-next, .apya-feedback-submit').addClass('d-none');
        $form.find('.apya-feedback-success-number').text(feedbackNumber || '');
        $form.find('.apya-feedback-success').removeClass('d-none');
    }

    function showError(message) {
        var $error = $form.find('.apya-feedback-error').removeClass('d-none').text(message);
        // Form uzun olabildiği için hata kutusu görünür alanın dışında kalıyor,
        // kullanıcı gönderimin neden başarısız olduğunu göremiyordu.
        $error[0].scrollIntoView({ block: 'nearest' });
    }

    function clearError() {
        $form.find('.apya-feedback-error').addClass('d-none').text('');
    }

    $(function () {
        $modal = $('#apya-feedback-modal');
        if ($modal.length === 0) return; // Yalnızca oturum açık kullanıcıda render edilir.

        // Modal, header toolbar'ı içinde render ediliyor (FeedbackToolbarContributor).
        // .lpx-topbar-container (position:sticky, z-index:101) yeni bir yığın bağlamı
        // açtığı için modalın z-index:1055'i o bağlamın İÇİNDE kalıyor; body'ye eklenen
        // .modal-backdrop (z-index:1050) ise kök bağlamda. Kök bağlamda 1050 > 101
        // olduğundan backdrop tüm modalın üstüne boyanıyor → modal kararıyor ve
        // tıklamalar modala değil backdrop'a gidiyordu. Düğümü body'ye almak modalı
        // kök yığın bağlamına taşır. (Alternatif olan "topbar z-index'ini yükselt"
        // yanlıştır: header o zaman sitedeki DİĞER modalların üstünde kalır.)
        if ($modal.parent()[0] !== document.body) {
            $modal.appendTo(document.body);
        }

        $form = $modal.find('form');

        $form.find('[name=Type]').on('change', syncDetailSections);
        syncDetailSections();
        goToStep(1);

        $modal.find('.apya-feedback-next').on('click', function () {
            var problem = validateCoreFields();
            if (problem) {
                showError(problem);
                return;
            }
            clearError();
            goToStep(currentStep + 1);
        });

        $modal.find('.apya-feedback-back').on('click', function () {
            clearError();
            goToStep(currentStep - 1);
        });

        $modal.find('.apya-feedback-rating .fa-star').on('click', function () {
            setRating($(this).data('value'));
        });

        // Yıldızlar klavyeyle de seçilebilmeli (erişilebilirlik).
        $modal.find('.apya-feedback-rating .fa-star').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setRating($(this).data('value'));
            }
        });

        $modal.find('.apya-feedback-screenshot-input').on('change', function (e) {
            var file = e.target.files && e.target.files[0];
            if (!file) return;
            var $name = $form.find('.apya-feedback-screenshot-name');

            var invalid = validateFile($(this), file);
            if (invalid) {
                abp.notify.error(invalid);
                e.target.value = '';
                $name.text('');
                return;
            }

            $name.text('Yükleniyor...');
            uploadFile('UploadScreenshot', file, function (result) {
                pendingScreenshotFileName = result && result.storedFileName;
                $name.text(pendingScreenshotFileName ? file.name : '');
            });
        });

        $modal.find('.apya-feedback-attachment-input').on('change', function (e) {
            var $input = $(this);
            var files = Array.prototype.slice.call(e.target.files || []);
            e.target.value = ''; // aynı dosya tekrar seçilebilsin
            files.forEach(function (file) {
                if (pendingAttachments.length >= MAX_ATTACHMENTS) {
                    abp.notify.warn('En fazla ' + MAX_ATTACHMENTS + ' dosya eklenebilir.');
                    return;
                }

                var invalid = validateFile($input, file);
                if (invalid) {
                    abp.notify.error(invalid);
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
        $form.on('input change', '[name=Subject], [name=Body], [name=Type], [name=Severity], [data-detail]', saveDraft);

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
