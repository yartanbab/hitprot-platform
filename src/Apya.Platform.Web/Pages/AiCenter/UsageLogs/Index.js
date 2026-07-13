$(function () {
    var service = apya.platform.ai.usageLogs.aiUsageLog;

    var getFilterInput = function () {
        var status = $('#StatusFilter').val();
        return {
            providerName: $('#ProviderFilter').val(),
            status: status === '' ? null : parseInt(status, 10)
        };
    };

    var statusBadge = function (s) {
        switch (s) {
            case 0: return '<span class="apya-chip apya-chip-warning">Bekliyor</span>';
            case 1: return '<span class="apya-chip apya-chip-brand">İşleniyor</span>';
            case 2: return '<span class="apya-chip apya-chip-positive">Tamamlandı</span>';
            case 3: return '<span class="apya-chip apya-chip-negative">Başarısız</span>';
            default: return s;
        }
    };

    var dataTable = $('#UsageLogsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[0, 'desc']],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(service.getList, getFilterInput),
            columnDefs: [
                {
                    title: 'Tarih',
                    data: 'creationTime',
                    render: function (d) {
                        return d ? d.substring(0, 16).replace('T', ' ') : '';
                    }
                },
                { title: 'Sağlayıcı', data: 'providerName' },
                { title: 'Tür', data: 'requestType' },
                { title: 'Durum', data: 'status', render: statusBadge },
                { title: 'Token', data: 'tokensUsed' },
                {
                    title: 'Süre (ms)',
                    data: 'durationMs',
                    render: function (d) { return d != null ? Math.round(d) : '—'; }
                }
            ]
        })
    );

    $('#StatusFilter').on('change', function () { dataTable.ajax.reload(); });

    var providerDebounce;
    $('#ProviderFilter').on('keyup', function () {
        clearTimeout(providerDebounce);
        providerDebounce = setTimeout(function () { dataTable.ajax.reload(); }, 400);
    });
});
