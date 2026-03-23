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
            columnDefs: [
                {
                    title: 'Fatura No',
                    data: "invoiceNumber"
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
                        return data.toLocaleString() + ' ' + row.currency;
                    }
                },
                {
                    title: 'Ödenen',
                    data: "paidAmount",
                    render: function (data, type, row) {
                        return data.toLocaleString() + ' ' + row.currency;
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
                                    return data.status !== 2;
                                }
                            }
                        ]
                    }
                }
            ]
        })
    );

    function addPayment(id) {
        abp.message.confirm('Bu fatura için ödeme alındı olarak işaretlensin mi?', function (confirmed) {
            if (confirmed) {
                invoiceService.addPayment(id, 0, 'Sisteme İşlendi', 'Referans No Yok').then(function() {
                    abp.notify.success('Ödeme başarıyla kaydedildi.');
                    dataTable.ajax.reload();
                });
            }
        });
    }

    var createModal = new abp.ModalManager(abp.appPath + 'Invoices/CreateModal');

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Fatura başarıyla oluşturuldu.');
    });

    $('#NewInvoiceButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});

