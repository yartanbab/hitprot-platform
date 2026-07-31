$(function () {
    var service = apya.platform.telemetry.systemHealth;

    var SOURCE_LABELS = { 1: 'JS Hatası', 2: 'Promise Reddi', 3: 'AJAX Hatası' };

    function getFilterInput() {
        var isResolved = $('#Filter_IsResolved').val();
        return {
            isResolved: isResolved === '' ? null : (isResolved === 'true'),
            filter: $('#Filter_Text').val() || null
        };
    }

    var dataTable = $('#ClientErrorsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, 'desc']],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(service.getClientErrors, getFilterInput),
            columnDefs: [
                {
                    title: 'İşlemler',
                    orderable: false,
                    rowAction: {
                        items: [
                            {
                                text: 'Çözüldü İşaretle',
                                visible: function (record) { return !record.isResolved; },
                                action: function (data) {
                                    service.setClientErrorResolved(data.record.id, true).then(function () {
                                        abp.notify.success('Çözüldü olarak işaretlendi.');
                                        dataTable.ajax.reload(null, false);
                                    });
                                }
                            },
                            {
                                text: 'Yeniden Aç',
                                visible: function (record) { return record.isResolved; },
                                action: function (data) {
                                    service.setClientErrorResolved(data.record.id, false).then(function () {
                                        dataTable.ajax.reload(null, false);
                                    });
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Son Görülme', data: 'lastSeenAt',
                    render: function (d) { return d ? d.substring(0, 16).replace('T', ' ') : ''; }
                },
                { title: 'Kaynak', data: 'source', render: function (s) { return SOURCE_LABELS[s] || s; } },
                {
                    title: 'Mesaj', data: 'message',
                    render: function (m) { return m && m.length > 80 ? m.substring(0, 80) + '…' : m; }
                },
                { title: 'Sayfa', data: 'pageUrl', defaultContent: '-' },
                { title: 'Tenant', data: 'tenantName', defaultContent: '-' },
                { title: 'Oluşum', data: 'occurrenceCount' },
                {
                    title: 'Durum', data: 'isResolved',
                    render: function (r) {
                        return r
                            ? '<span class="apya-chip apya-chip-positive">Çözüldü</span>'
                            : '<span class="apya-chip apya-chip-negative">Açık</span>';
                    }
                }
            ]
        })
    );

    $('#Filter_IsResolved').on('change', function () { dataTable.ajax.reload(); });

    var textDebounce;
    $('#Filter_Text').on('keyup', function () {
        clearTimeout(textDebounce);
        textDebounce = setTimeout(function () { dataTable.ajax.reload(); }, 400);
    });
});
