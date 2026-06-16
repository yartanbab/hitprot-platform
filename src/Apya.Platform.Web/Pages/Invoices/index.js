$(function () {
    var invoiceService = apya.platform.invoices.invoice;
    var l = abp.localization.getResource('Platform');

    var dataTable = $('#InvoicesTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, "asc"]],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(invoiceService.getList),
            language: {
                emptyTable: l('DataTable:Invoice:Empty'),
                zeroRecords: l('DataTable:Invoice:Empty'),
                loadingRecords: l('DataTable:Invoice:Loading'),
                processing: l('DataTable:Invoice:Loading')
            },
            columnDefs: [
                {
                    title: 'Fatura No',
                    data: "invoiceNumber"
                },
                {
                    title: 'Yön',
                    data: "direction",
                    render: function (data) {
                        return data === 1
                            ? '<span class="badge bg-warning text-dark">Alış</span>'
                            : '<span class="badge bg-primary">Satış</span>';
                    }
                },
                {
                    title: 'Müşteri',
                    data: "customerName",
                    defaultContent: '—'
                },
                {
                    title: 'Proje',
                    data: "projectName"
                },
                {
                    title: 'Tarih',
                    data: "invoiceDate",
                    render: function (data) {
                        return luxon.DateTime.fromISO(data, { locale: abp.localization.currentCulture.name }).toLocaleString();
                    }
                },
                {
                    title: 'Vade',
                    data: "dueDate",
                    render: function (data) {
                        var date = luxon.DateTime.fromISO(data);
                        var isOverdue = date < luxon.DateTime.now() && dataTable.row(this).data().status !== 2;
                        return `<span class="${isOverdue ? 'text-danger fw-bold' : ''}">${date.toLocaleString()}</span>`;
                    }
                },
                {
                    title: 'Toplam Tutar',
                    data: "totalAmount",
                    render: function (data, type, row) {
                        return data.toLocaleString();
                    }
                },
                {
                    title: 'Ödenen',
                    data: "paidAmount",
                    render: function (data, type, row) {
                        return data.toLocaleString();
                    }
                },
                {
                    title: 'Durum',
                    data: "status",
                    render: function (data) {
                        var map = {
                            0: { text: 'Taslak', class: 'bg-secondary' },
                            1: { text: 'Gönderildi', class: 'bg-info' },
                            2: { text: 'Ödendi', class: 'bg-success' },
                            3: { text: 'İptal', class: 'bg-danger' },
                            4: { text: 'Gecikmiş', class: 'bg-dark' }
                        };
                        var s = map[data] || map[0];
                        return `<span class="badge ${s.class}">${s.text}</span>`;
                    }
                },
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Yazdır / PDF',
                                action: function (data) {
                                    window.open('/Invoices/Print/' + data.record.id, '_blank');
                                }
                            },

                            {
                                text: 'Ödeme Ekle',
                                action: function (data) {
                                    addPayment(data.record.id);
                                },
                                visible: function(data) {
                                    return abp.auth.isGranted('Platform.Invoices.Edit')
                                        && data.status !== 2;
                                }
                            }
                        ]
                    }
                }
            ]
        })
    );

    var paymentModal = new abp.ModalManager(abp.appPath + 'Invoices/PaymentModal');

    function addPayment(id) {
        paymentModal.open({ invoiceId: id });
    }

    paymentModal.onResult(function () {
        abp.notify.success(l('Notify:Invoice:PaymentRecorded'));
        dataTable.ajax.reload();
    });

    var createModal = new abp.ModalManager(abp.appPath + 'Invoices/CreateModal');

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success(l('Notify:Invoice:Created'));
    });

    $('#NewInvoiceButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});

