$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'ExchangeRates/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'ExchangeRates/EditModal');

    var sourceNames = { 0: 'Manuel', 1: 'TCMB' };

    var dataTable = $('#ExchangeRatesTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: true,
        autoWidth: false,
        scrollCollapse: true,
        order: [[1, "desc"]],
        ajax: abp.libs.datatables.createAjax(apya.platform.exchangeRates.exchangeRate.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.ExchangeRates.Edit'),
                            action: function (data) {
                                editModal.open({ id: data.record.id });
                            }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.ExchangeRates.Delete'),
                            confirmMessage: function (data) {
                                return 'Kur kaydı silinecek: ' + data.record.fromCurrency + '/' + data.record.toCurrency + '?';
                            },
                            action: function (data) {
                                apya.platform.exchangeRates.exchangeRate.delete(data.record.id)
                                    .then(function () {
                                        abp.notify.success('Kur kaydı silindi.');
                                        dataTable.ajax.reload();
                                    });
                            }
                        }
                    ]
                }
            },
            {
                title: 'Tarih',
                data: 'rateDate',
                render: function (data) {
                    return data ? new Date(data).toLocaleDateString('tr-TR') : '-';
                }
            },
            {
                title: 'Kaynak Birim',
                data: 'fromCurrency'
            },
            {
                title: 'Hedef Birim',
                data: 'toCurrency'
            },
            {
                title: 'Kur',
                data: 'rate',
                className: 'text-end apya-numeric',
                render: function (data) {
                    return Number(data).toLocaleString('tr-TR', { minimumFractionDigits: 4 });
                }
            },
            {
                title: 'Kaynak',
                data: 'source',
                render: function (data) {
                    var tone = data === 1 ? 'brand' : 'neutral';
                    return '<span class="apya-chip apya-chip-' + tone + '">' + (sourceNames[data] || '-') + '</span>';
                }
            }
        ]
    }));

    $('#NewExchangeRateButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    $('#SyncTcmbButton').click(function (e) {
        e.preventDefault();
        abp.ui.setBusy();
        apya.platform.exchangeRates.exchangeRate.syncFromTcmb()
            .then(function (count) {
                abp.notify.success(count + ' kur TCMB\'den güncellendi.');
                dataTable.ajax.reload();
            })
            .always(function () {
                abp.ui.clearBusy();
            });
    });

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

});
