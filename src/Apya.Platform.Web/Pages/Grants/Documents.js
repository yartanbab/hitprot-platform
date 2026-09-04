$(function () {
    var service = apya.platform.grants.grantApplicationDocument;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var statusKeys = ['Bekleniyor', 'Incelemede', 'Onaylandi', 'RevizyonIstendi'];
    var statusTone = ['neutral', 'warning', 'positive', 'negative'];
    var partyKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];

    var model = null;
    var filter = 'all';
    var selectedId = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function size(bytes) {
        if (!bytes) { return ''; }
        var kb = bytes / 1024;
        return kb < 1024 ? Math.round(kb) + ' KB' : (kb / 1024).toFixed(1) + ' MB';
    }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : ''; }

    // ---------- Süzgeç ----------
    $('.apya-choice-row').on('click', '.apya-choice', function () {
        $('.apya-choice-row .apya-choice').removeClass('is-on');
        $(this).addClass('is-on');
        filter = $(this).data('filter');
        paintRows();
    });

    // ---------- Satır ----------
    function documentRow(d) {
        var icon = d.status === 2 ? 'fa-circle-check text-success'
            : d.status === 3 ? 'fa-circle-xmark text-danger'
            : d.status === 1 ? 'fa-clock text-warning'
            : 'fa-circle-dot text-muted';

        var actions = '';
        if (!model.isReadOnly) {
            actions += '<button type="button" class="btn btn-sm btn-outline-secondary apya-doc-upload" ' +
                'data-id="' + d.id + '" title="' + esc(l('Grants:Documents:Upload')) + '">' +
                '<i class="fa fa-upload"></i></button>';
        }
        if (d.latestVersion) {
            actions += '<a class="btn btn-sm btn-outline-secondary" title="' + esc(l('Grants:Documents:Download')) +
                '" href="?handler=Download&versionId=' + d.latestVersion.id + '"><i class="fa fa-download"></i></a>';
        }
        if (model.canReview && !model.isReadOnly && d.latestVersionNo > 0 && d.status !== 2) {
            actions += '<button type="button" class="btn btn-sm btn-outline-success apya-doc-approve" data-id="' + d.id +
                '" title="' + esc(l('Grants:Documents:Approve')) + '"><i class="fa fa-check"></i></button>' +
                '<button type="button" class="btn btn-sm btn-outline-warning apya-doc-revise" data-id="' + d.id +
                '" title="' + esc(l('Grants:Documents:RequestRevision')) + '"><i class="fa fa-rotate-left"></i></button>';
        }

        return '<div class="apya-doc-row' + (d.id === selectedId ? ' is-selected' : '') + '" data-id="' + d.id + '">' +
            '<span><i class="fa ' + icon + '"></i></span>' +
            '<span class="apya-doc-name">' +
            '<span class="apya-doc-name-text">' + esc(d.name) +
            (d.obligation === 0 ? '' : ' <span class="apya-chip apya-chip-neutral">' +
                esc(l('Grants:Documents:Optional')) + '</span>') +
            (d.requiresESignature ? ' <span class="apya-chip apya-chip-accent">' +
                esc(l('Grants:Documents:NeedsESignature')) + '</span>' : '') + '</span>' +
            (d.latestVersion
                ? '<span class="apya-doc-file">' + esc(d.latestVersion.originalFileName) + ' · ' +
                  size(d.latestVersion.sizeBytes) + '</span>'
                : '') +
            (d.reviewNote ? '<span class="apya-doc-note">' + esc(d.reviewNote) + '</span>' : '') +
            '</span>' +
            '<span class="apya-cat-sub">' + esc(l('Grants:Party:' + partyKeys[d.uploaderParty])) + '</span>' +
            '<span><span class="apya-chip apya-chip-' + statusTone[d.status] + '">' +
            esc(l('Grants:DocStatus:' + statusKeys[d.status])) + '</span></span>' +
            '<span class="apya-doc-version">' + (d.latestVersionNo > 0 ? 'v' + d.latestVersionNo : '—') + '</span>' +
            '<span class="apya-doc-actions">' + actions + '</span>' +
            '</div>';
    }

    function visibleDocuments() {
        var all = model.documents || [];
        return filter === 'mine' ? all.filter(function (d) { return d.isOnViewer; }) : all;
    }

    function paintRows() {
        var rows = visibleDocuments();
        $('#DocumentRows').removeClass('apya-skel-rows').html(rows.map(documentRow).join(''));
        $('#DocumentEmpty').toggleClass('d-none', rows.length > 0);
    }

    // ---------- Sürüm geçmişi ----------
    $('#DocumentRows').on('click', '.apya-doc-row', function (e) {
        if ($(e.target).closest('button, a').length) { return; }
        selectedId = $(this).data('id');
        paintRows();
        paintHistory();
    });

    function paintHistory() {
        var doc = (model.documents || []).filter(function (d) { return d.id === selectedId; })[0];
        if (!doc) {
            $('#HistoryTitle').text('');
            $('#HistoryList').html('<div class="apya-doc-hint">' + esc(l('Grants:Documents:HistoryHint')) + '</div>');
            return;
        }

        $('#HistoryTitle').text(doc.name);
        $('#HistoryList').html(doc.versions.length
            ? doc.versions.map(function (v, i) {
                return '<div class="apya-doc-history">' +
                    '<span class="apya-doc-history-no">v' + v.versionNo + '</span>' +
                    '<span class="flex-fill">' + esc(v.note || v.originalFileName) +
                    '<br /><span class="apya-doc-history-meta">' + esc(date(v.creationTime)) + ' · ' +
                    esc(v.uploaderName) + (i === 0 ? ' · ' + esc(l('Grants:Documents:Current')) : '') +
                    '</span></span>' +
                    '<a class="btn btn-sm btn-outline-secondary" href="?handler=Download&versionId=' + v.id + '">' +
                    '<i class="fa fa-download"></i></a></div>';
            }).join('')
            : '<div class="apya-doc-hint">' + esc(l('Grants:Documents:NoVersion')) + '</div>');
    }

    // ---------- Yükleme ----------
    // Dosya seçici gizli formda; satırdaki düğme onu açar. Yükleme sayfa
    // işleyicisine gider (dosya baytları AppService'e girmez).
    $('#DocumentRows').on('click', '.apya-doc-upload', function () {
        $('#UploadDocumentId').val($(this).data('id'));
        $('#UploadFile').val('').trigger('click');
    });

    $('#UploadFile').on('change', function () {
        if (!this.files || !this.files.length) { return; }

        var form = new FormData();
        form.append('documentId', $('#UploadDocumentId').val());
        form.append('file', this.files[0]);
        form.append('__RequestVerificationToken', $('input[name="__RequestVerificationToken"]').val());

        $.ajax({
            url: '?handler=Upload',
            type: 'POST',
            data: form,
            processData: false,
            contentType: false
        }).done(function () {
            abp.notify.success(l('Grants:Documents:Uploaded'));
            load();
        }).fail(function (x) {
            abp.message.error(x.responseText || l('Grants:Documents:UploadFailed'));
        });
    });

    // ---------- İnceleme ----------
    $('#DocumentRows').on('click', '.apya-doc-approve', function () {
        service.approve({ documentId: $(this).data('id') }).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:Documents:Approved'));
        });
    });

    $('#DocumentRows').on('click', '.apya-doc-revise', function () {
        var id = $(this).data('id');
        abp.message.prompt(l('Grants:Documents:RevisionPrompt')).then(function (result) {
            if (!result.isConfirmed || !result.value) { return; }
            service.requestRevision({ documentId: id, note: result.value }).then(function (dto) {
                model = dto; paint();
                abp.notify.success(l('Grants:Documents:RevisionRequested'));
            });
        });
    });

    // ---------- Evrak ekle / hatırlat ----------
    $('#AddDocBtn').on('click', function () {
        abp.message.prompt(l('Grants:Documents:AddPrompt')).then(function (result) {
            if (!result.isConfirmed || !result.value) { return; }
            service.add({
                applicationId: appId,
                name: result.value,
                // Ekleyen taraf sorumluluğu da üstlenir; karşı tarafa iş yazmak
                // için evrakın sahibi ayrıca değiştirilmeli (2d).
                uploaderParty: model.viewerRole
            }).then(function (dto) { model = dto; paint(); });
        });
    });

    $('#RemindBtn').on('click', function () {
        service.sendReminder(appId).then(function (r) {
            if (r.missingCount === 0) {
                abp.message.info(l('Grants:Documents:NothingMissing'));
                return;
            }
            abp.notify.success(l('Grants:Documents:ReminderSent', r.missingCount, r.notifiedUserCount));
        });
    });

    // ---------- Paket ----------
    $('#CreatePackageBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        $.ajax({
            url: '?handler=CreatePackage',
            type: 'POST',
            data: {
                applicationId: appId,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        }).done(function (r) {
            abp.notify.success(l('Grants:Documents:PackageCreated', r.entryCount));
            load();
        }).fail(function (x) {
            abp.message.error(x.responseText || l('Grants:Documents:PackageFailed'));
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- Çizim ----------
    function paint() {
        $('#KpiTotal').text(model.totalCount);
        $('#KpiApproved').text(model.approvedCount);
        $('#KpiOnYou').text(model.waitingOnViewerCount);
        $('#KpiOnOther').text(model.waitingOnOtherCount);
        $('#KpiReady').text('%' + model.readyPercent);
        $('#ReadyBar').css('width', model.readyPercent + '%');
        $('#KpiReadySub').text(model.mandatoryApprovedCount + ' / ' + model.mandatoryCount);

        paintRows();
        paintHistory();

        $('#ESignList').html((model.eSignatureItems || []).length
            ? model.eSignatureItems.map(function (e) {
                return '<div class="apya-doc-history"><i class="fa fa-signature mt-1"></i>' +
                    '<span class="flex-fill">' + esc(e.name) +
                    '<br /><span class="apya-doc-history-meta">' +
                    esc(l('Grants:DocStatus:' + statusKeys[e.status])) + '</span></span></div>';
            }).join('')
            : '<div class="apya-doc-hint">' + esc(l('Grants:Documents:NoESignature')) + '</div>');

        var missing = model.mandatoryCount - model.mandatoryApprovedCount;
        $('#PackageReady').text(l('Grants:Documents:PackageReady',
            model.mandatoryApprovedCount, model.mandatoryCount));
        $('#PackageWarning').toggleClass('d-none', missing <= 0);
        $('#PackageWarningText').text(l('Grants:Documents:PackageMissing', missing));
        $('#CreatePackageBtn').prop('disabled', model.approvedCount === 0);
        $('#DownloadPackageBtn').toggleClass('d-none', !model.hasPackage);

        $('#LastActivity').text(model.lastActivityAt
            ? l('Grants:Documents:LastActivity', date(model.lastActivityAt)) : '');
        $('#RemindBtn').toggleClass('d-none', model.isReadOnly);
        $('#AddDocBtn').toggleClass('d-none', model.isReadOnly);
    }

    function load() {
        return service.get(appId).then(function (dto) { model = dto; paint(); });
    }

    load();
});
