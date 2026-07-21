$(function () {
    var service = apya.platform.ai.evaluations.aiEvaluation;

    var detailModal = new abp.ModalManager(abp.appPath + 'AiCenter/Evaluations/DetailModal');

    function statusBadge(text) {
        switch (text) {
            case 'Completed': return '<span class="apya-chip apya-chip-positive">Tamamlandı</span>';
            case 'Processing': return '<span class="apya-chip apya-chip-brand">İşleniyor</span>';
            case 'Pending': return '<span class="apya-chip apya-chip-warning">Bekliyor</span>';
            case 'Failed': return '<span class="apya-chip apya-chip-negative">Başarısız</span>';
            default: return '<span class="apya-chip apya-chip-neutral">' + (text || '') + '</span>';
        }
    }

    var dataTable = $('#AiEvaluationsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(service.getList),
            columnDefs: [
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Detay',
                                action: function (data) { detailModal.open({ id: data.record.id }); }
                            },
                            {
                                text: 'Yeniden Dene',
                                visible: function (data) {
                                    return abp.auth.isGranted('Ai.Evaluations.Retry') && data.record.statusText === 'Failed';
                                },
                                action: function (data) {
                                    service.retry(data.record.id).then(function () {
                                        abp.notify.success('Değerlendirme yeniden kuyruğa alındı.');
                                        dataTable.ajax.reload(null, false);
                                    });
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Tarih',
                    data: 'creationTime',
                    render: function (data) { return data ? new Date(data).toLocaleString() : ''; }
                },
                { title: 'Durum', data: 'statusText', render: function (d) { return statusBadge(d); } },
                { title: 'Skor', data: 'score', defaultContent: '—' },
                { title: 'Risk', data: 'riskLevel', defaultContent: '—' },
                { title: 'Karar', data: 'decision', defaultContent: '—' }
            ]
        })
    );

    // Live status via SignalR (tenant-scoped group).
    if (typeof signalR !== 'undefined') {
        var connection = new signalR.HubConnectionBuilder()
            .withUrl(abp.appPath + 'ai-hub')
            .withAutomaticReconnect()
            .build();

        connection.on('ReceiveEvaluationUpdate', function () {
            dataTable.ajax.reload(null, false);
        });

        connection.start()
            .then(function () { return connection.invoke('SubscribeToEvaluationsAsync'); })
            .catch(function (err) { console.warn('[AiEvaluations] ai-hub connection failed:', err); });
    }
});
