$(function () {
    var service = apya.platform.telemetry.systemHealth;

    var SOURCE_LABELS = { 1: 'JS Hatası', 2: 'Promise Reddi', 3: 'AJAX Hatası' };

    var windowDays = parseInt($('#SystemHealthContext').data('window-days'), 10) || 7;

    // Tek bir istemci hatasının teşhis detayı (stack trace, davranış izi, ortam).
    var clientErrorDetailModal = new abp.ModalManager({
        viewUrl: '/Admin/SystemHealth/ClientErrorDetailModal'
    });

    // Bir URL'in pencere içindeki tek tek sunucu hataları (exception metni dahil).
    var serverErrorDetailModal = new abp.ModalManager({
        viewUrl: '/Admin/SystemHealth/ServerErrorDetailModal'
    });

    // Her iki detay modalındaki "Göreve Dönüştür" düğmesi ortak köprüye bağlanır.
    apyaIssueTask.bind(clientErrorDetailModal);
    apyaIssueTask.bind(serverErrorDetailModal);

    function getFilterInput() {
        var isResolved = $('#Filter_IsResolved').val();
        var source = $('#Filter_Source').val();
        var tenant = $('#Filter_Tenant').val();

        return {
            isResolved: isResolved === '' ? null : (isResolved === 'true'),
            source: source === '' ? null : parseInt(source, 10),
            // "host" sentinel'i ayrı bayrağa çevrilir: Guid? tek başına
            // "filtre yok" ile "host" ayrımını yapamıyor (bkz. GetClientErrorListInput).
            hostOnly: tenant === 'host',
            tenantId: (tenant === '' || tenant === 'host') ? null : tenant,
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
                                text: 'Detay',
                                action: function (data) {
                                    clientErrorDetailModal.open({ id: data.record.id });
                                }
                            },
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
                            },
                            {
                                text: 'Göreve Dönüştür',
                                visible: abp.auth.isGranted('Platform.IssueTasks'),
                                action: function (data) {
                                    apyaIssueTask.open({ sourceType: 2, sourceId: data.record.id });
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

    apyaIssueTask.onCreated(function () {
        dataTable.ajax.reload(null, false);
    });

    // Detayda durum değiştirilirse tablo da tazelensin.
    clientErrorDetailModal.onOpen(function () {
        clientErrorDetailModal.getModal().find('.client-error-toggle-resolved').on('click', function () {
            var $btn = $(this);
            var next = $btn.data('resolved') !== true && $btn.data('resolved') !== 'true';
            service.setClientErrorResolved($btn.data('id'), next).then(function () {
                abp.notify.success(next ? 'Çözüldü olarak işaretlendi.' : 'Yeniden açıldı.');
                clientErrorDetailModal.close();
                dataTable.ajax.reload(null, false);
            });
        });
    });

    $('#Filter_IsResolved, #Filter_Source, #Filter_Tenant').on('change', function () {
        dataTable.ajax.reload();
    });

    var textDebounce;
    $('#Filter_Text').on('keyup', function () {
        clearTimeout(textDebounce);
        textDebounce = setTimeout(function () { dataTable.ajax.reload(); }, 400);
    });

    // Kaynak kırılım kartı → tabloyu o kaynağa filtrele (bağlantı zaten #client-errors'a kaydırıyor).
    $('.apya-source-tile').on('click', function () {
        $('#Filter_Source').val(String($(this).data('source')));
        dataTable.ajax.reload();
    });

    // "En Çok Hata Veren Uçlar" satırı → o ucun sunucu hataları.
    // url NORMALİZE yoldur (/api/app/task/{id}); metot uç kimliğinin ikinci yarısı,
    // taşınmazsa GET ve POST tek uç gibi listelenir.
    $('.apya-failing-page-row').on('click', function () {
        var $row = $(this);
        serverErrorDetailModal.open({
            url: $row.data('url'),
            httpMethod: $row.data('http-method') || '',
            windowDays: windowDays
        });
    });
});
