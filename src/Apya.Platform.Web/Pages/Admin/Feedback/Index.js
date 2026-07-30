$(function () {
    var service = apya.platform.feedbacks.feedbackAdmin;
    var detailModal = new abp.ModalManager(abp.appPath + 'Admin/Feedback/DetailModal');

    var TYPE_LABELS = { 1: 'Hata', 2: 'Öneri', 3: 'Soru', 4: 'Beğeni' };
    var STATUS_LABELS = { 1: 'Yeni', 2: 'İnceleniyor', 3: 'Planlandı', 4: 'Tamamlandı', 5: 'Reddedildi' };
    var STATUS_CHIPS = { 1: 'apya-chip-neutral', 2: 'apya-chip-brand', 3: 'apya-chip-accent', 4: 'apya-chip-positive', 5: 'apya-chip-negative' };
    var PRIORITY_LABELS = { 1: 'Düşük', 2: 'Normal', 3: 'Yüksek', 4: 'Kritik' };

    var selectedIds = {};

    function getFilterInput() {
        var type = $('#Filter_Type').val();
        var status = $('#Filter_Status').val();
        var priority = $('#Filter_Priority').val();
        var tenantId = $('#Filter_TenantId').val();
        return {
            type: type === '' ? null : parseInt(type, 10),
            status: status === '' ? null : parseInt(status, 10),
            priority: priority === '' ? null : parseInt(priority, 10),
            tenantId: tenantId === '' ? null : tenantId,
            filter: $('#Filter_Text').val() || null,
            onlyUnanswered: $('#Filter_OnlyUnanswered').is(':checked') ? true : null
        };
    }

    function updateBulkBar() {
        var count = Object.keys(selectedIds).filter(function (k) { return selectedIds[k]; }).length;
        if (count > 0) {
            $('#BulkActionBar').show();
            $('#SelectedCount').text(count + ' seçildi');
        } else {
            $('#BulkActionBar').hide();
        }
    }

    var dataTable = $('#FeedbackTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[2, 'desc']],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(service.getList, getFilterInput),
            columnDefs: [
                {
                    title: '',
                    orderable: false,
                    data: null,
                    render: function (row) {
                        var checked = selectedIds[row.id] ? 'checked' : '';
                        return '<input type="checkbox" class="row-select" data-id="' + row.id + '" ' + checked + ' />';
                    }
                },
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Detay',
                                action: function (data) { detailModal.open({ id: data.record.id }); }
                            }
                        ]
                    }
                },
                {
                    title: 'Tarih',
                    data: 'creationTime',
                    render: function (d) { return d ? d.substring(0, 16).replace('T', ' ') : ''; }
                },
                { title: 'Tenant', data: 'tenantName', defaultContent: '-' },
                { title: 'Tür', data: 'type', render: function (t) { return TYPE_LABELS[t] || t; } },
                { title: 'Konu', data: 'subject' },
                {
                    title: 'Durum', data: 'status',
                    render: function (s) {
                        return '<span class="apya-chip ' + (STATUS_CHIPS[s] || 'apya-chip-neutral') + '">' + (STATUS_LABELS[s] || s) + '</span>';
                    }
                },
                { title: 'Öncelik', data: 'priority', render: function (p) { return PRIORITY_LABELS[p] || p; } },
                { title: 'Puan', data: 'rating', defaultContent: '—' },
                { title: 'Cevap', data: 'commentCount' }
            ]
        })
    );

    dataTable.on('draw', updateBulkBar);

    $(document).on('change', '.row-select', function () {
        var id = $(this).data('id');
        selectedIds[id] = $(this).is(':checked');
        updateBulkBar();
    });

    $('#SelectAllCheckbox').on('change', function () {
        var checked = $(this).is(':checked');
        $('.row-select').each(function () {
            $(this).prop('checked', checked);
            selectedIds[$(this).data('id')] = checked;
        });
        updateBulkBar();
    });

    $('#FeedbackFilterForm select, #FeedbackFilterForm input[type=checkbox]').on('change', function () {
        dataTable.ajax.reload();
    });

    var textFilterDebounce;
    $('#Filter_Text').on('keyup', function () {
        clearTimeout(textFilterDebounce);
        textFilterDebounce = setTimeout(function () { dataTable.ajax.reload(); }, 400);
    });

    $('#btn-bulk-apply').on('click', function () {
        var ids = Object.keys(selectedIds).filter(function (k) { return selectedIds[k]; });
        if (ids.length === 0) return;

        var status = parseInt($('#BulkStatusSelect').val(), 10);
        service.bulkUpdateStatus({ ids: ids, status: status }).then(function () {
            abp.notify.success('Seçilen geri bildirimler güncellendi.');
            selectedIds = {};
            dataTable.ajax.reload(null, false);
        });
    });

    $('#btn-export-excel').on('click', function () {
        var qs = $.param(getFilterInput());
        window.location.href = '/Admin/Feedback?handler=Excel&' + qs;
    });

    /* ─── Detay modalı içindeki kontroller (modal AJAX ile DOM'a sonradan
       ekleniyor → delegasyon ile document üzerinden dinlenir) ─────────────── */

    $(document).on('change', '.detail-status-select', function () {
        var id = $(this).data('id');
        var status = parseInt($(this).val(), 10);
        service.updateStatus(id, { status: status }).then(function () {
            abp.notify.success('Durum güncellendi.');
            dataTable.ajax.reload(null, false);
        });
    });

    $(document).on('change', '.detail-priority-select', function () {
        var id = $(this).data('id');
        var priority = parseInt($(this).val(), 10);
        service.updatePriority(id, { priority: priority }).then(function () {
            abp.notify.success('Öncelik güncellendi.');
            dataTable.ajax.reload(null, false);
        });
    });

    $(document).on('blur', '.detail-tags-input', function () {
        var id = $(this).data('id');
        service.updateTags(id, { adminTags: $(this).val() }).then(function () {
            abp.notify.success('Etiketler kaydedildi.');
        });
    });

    $(document).on('click', '.detail-add-comment-btn', function () {
        var id = $(this).data('id');
        var $modal = $(this).closest('.modal');
        var text = $modal.find('.detail-comment-text').val();
        var isInternal = $modal.find('.detail-comment-internal').is(':checked');

        if (!text || !text.trim()) return;

        service.addComment(id, { text: text, isInternal: isInternal }).then(function () {
            abp.notify.success(isInternal ? 'İç not eklendi.' : 'Cevap gönderildi ve kullanıcıya bildirildi.');
            detailModal.open({ id: id });
            dataTable.ajax.reload(null, false);
        });
    });

    $(document).on('click', '.detail-delete-btn', function () {
        var id = $(this).data('id');
        abp.message.confirm('Bu geri bildirim kalıcı olarak silinsin mi?', function (confirmed) {
            if (confirmed) {
                service.delete(id).then(function () {
                    abp.notify.info('Geri bildirim silindi.');
                    detailModal.getModal().modal('hide');
                    dataTable.ajax.reload(null, false);
                });
            }
        });
    });
});
