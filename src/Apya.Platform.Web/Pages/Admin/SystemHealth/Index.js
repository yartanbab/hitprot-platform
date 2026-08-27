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

/* =============================================================================
   TEŞHİS KONSOLU
   Liste ve kanıt paneli Razor PARTIAL olarak sunuluyor; burada yalnız gelen parça
   yerine konuyor. İşaretleme tek yerde (Razor) durur — elle aynalanmış bir DOM
   kopyası oluşmaz ve liste her yerde aynı kuralla çizilir.
   ========================================================================== */
$(function () {
    var $console = $('#HealthConsole');
    if ($console.length === 0) {
        return;
    }

    var windowDays = parseInt($('#SystemHealthContext').data('window-days'), 10) || 7;
    var basePath = window.location.pathname;

    // Durum ve kanal ayrı gruplar: biri seçilince diğeri sıfırlanmaz.
    var state = { status: null, kinds: null, sort: 'impact', filter: '' };

    var FACETS = {
        open:     { group: 'status', isResolved: false },
        resolved: { group: 'status', isResolved: true },
        server:   { group: 'kinds', kinds: '4' },
        client:   { group: 'kinds', kinds: '1,2,3' },
        perf:     { group: 'kinds', kinds: '5' },
        rejected: { group: 'kinds', kinds: '6' }   // HealthIssueKind.RequestRejected
    };

    function listUrl() {
        var params = { handler: 'IssueList', windowDays: windowDays, sort: state.sort };

        if (state.filter) { params.filter = state.filter; }
        if (state.kinds) { params.kinds = state.kinds; }
        if (state.status !== null) { params.isResolved = state.status; }

        return basePath + '?' + $.param(params);
    }

    function reloadList() {
        return $.get(listUrl()).done(function (html) {
            $('#IssueList').html(html);
            paintFacets();
        });
    }

    /** Sunucudan gelen parça çipleri de taşıyor; aktif olanları yeniden işaretle. */
    function paintFacets() {
        $('#IssueList .apya-health-facet').each(function () {
            var facet = FACETS[$(this).data('facet')];
            if (!facet) { return; }

            var active = facet.group === 'status'
                ? state.status === facet.isResolved
                : state.kinds === facet.kinds;

            $(this).toggleClass('active', active);
        });
    }

    function loadDetail($row) {
        $('#IssueList .apya-health-row').removeClass('selected');
        $row.addClass('selected');

        // Dar ekranda liste gizlenip detay gelir (.apya-md media query'si).
        $console.addClass('has-selection');

        var params = {
            handler: 'IssueDetail',
            windowDays: windowDays,
            kind: $row.data('kind')
        };

        // Boş string gönderilirse model binder Guid? alanını bağlayamayıp hata veriyor.
        if ($row.data('client-error-id')) { params.clientErrorId = $row.data('client-error-id'); }
        if ($row.data('url')) { params.url = $row.data('url'); }
        if ($row.data('http-method')) { params.httpMethod = $row.data('http-method'); }

        $.get(basePath + '?' + $.param(params)).done(function (html) {
            $('#IssueDetail').html(
                '<button type="button" class="apya-md-back" id="IssueBack">' +
                '<i class="fa fa-chevron-left"></i> Listeye dön</button>' + html);
        });
    }

    /* --- Sol liste --- */

    // Olay delegasyonu: liste her tazelemede yeniden basılıyor, tek tek bağlamak
    // ilk tazelemeden sonra sessizce etkisiz kalırdı.
    $('#IssueList').on('click', '.apya-health-facet', function () {
        var facet = FACETS[$(this).data('facet')];
        if (!facet) { return; }

        if (facet.group === 'status') {
            state.status = state.status === facet.isResolved ? null : facet.isResolved;
        } else {
            state.kinds = state.kinds === facet.kinds ? null : facet.kinds;
        }

        reloadList();
    });

    $('#IssueList').on('click', '.apya-health-row', function () {
        loadDetail($(this));
    });

    var searchDebounce;
    $('#Issue_Search').on('keyup search', function () {
        var value = $(this).val() || '';
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(function () {
            state.filter = value;
            reloadList();
        }, 350);
    });

    $('#Issue_Sort').on('change', function () {
        state.sort = $(this).val();
        reloadList();
    });

    /* --- Klavye: kayıtlar arasında ok tuşlarıyla gezinme --- */
    $(document).on('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') { return; }
        if (!$('#sh-console').hasClass('active')) { return; }
        if ($(e.target).is('input, textarea, select')) { return; }

        var $rows = $('#IssueList .apya-health-row');
        if ($rows.length === 0) { return; }

        var index = $rows.index($rows.filter('.selected'));
        var next = e.key === 'ArrowDown' ? index + 1 : index - 1;
        if (next < 0 || next >= $rows.length) { return; }

        e.preventDefault();
        loadDetail($rows.eq(next));
    });

    /* --- Kanıt paneli --- */

    $('#IssueDetail').on('click', '#IssueBack', function () {
        $console.removeClass('has-selection');
    });

    $('#IssueDetail').on('click', '.apya-health-tab', function () {
        var key = $(this).data('tab');
        $('#IssueDetail .apya-health-tab').removeClass('active');
        $(this).addClass('active');
        $('#IssueDetail .apya-health-pane').addClass('d-none')
            .filter('[data-pane="' + key + '"]').removeClass('d-none');
    });

    $('#IssueDetail').on('click', '.health-toggle-resolved', function () {
        var $btn = $(this);
        var next = $btn.data('resolved') !== true && $btn.data('resolved') !== 'true';

        // Üstteki blogun `service` degiskeni bu kapanisin disinda kaliyor.
        apya.platform.telemetry.systemHealth.setClientErrorResolved($btn.data('id'), next).then(function () {
            abp.notify.success(next ? 'Çözüldü olarak işaretlendi.' : 'Yeniden açıldı.');
            reloadList().done(function () {
                var $row = $('#IssueList .apya-health-row[data-client-error-id="' + $btn.data('id') + '"]');
                if ($row.length) { loadDetail($row); }
            });
        });
    });

    // Kanıt panelindeki "Göreve dönüştür" ortak köprüye bağlanır; ortada detay
    // modalı olmadığı için bind() yerine doğrudan açılır.
    $('#IssueDetail').on('click', '.issue-task-create', function () {
        var $btn = $(this);
        var args = { sourceType: $btn.data('source-type') };

        if ($btn.data('source-id')) { args.sourceId = $btn.data('source-id'); }
        if ($btn.data('source-url')) {
            args.sourceUrl = $btn.data('source-url');
            args.windowDays = $btn.data('window-days') || windowDays;
            if ($btn.data('source-http-method')) {
                args.sourceHttpMethod = $btn.data('source-http-method');
            }
        }

        apyaIssueTask.open(args);
    });

    paintFacets();
});
