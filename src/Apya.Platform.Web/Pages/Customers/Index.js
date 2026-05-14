$(function () {

    var createModal = new abp.ModalManager(abp.appPath + 'Customers/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'Customers/EditModal');

    var dataTable = $('#CustomersTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: true,
        autoWidth: false,
        scrollCollapse: true,
        order: [[2, "asc"]],
        ajax: abp.libs.datatables.createAjax(apya.platform.customers.customer.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items: [
                        {
                            text: 'Düzenle',
                            visible: abp.auth.isGranted('Platform.Customers.Edit'),
                            action: function (data) {
                                editModal.open({ id: data.record.id });
                            }
                        },
                        {
                            text: 'Sil',
                            visible: abp.auth.isGranted('Platform.Customers.Delete'),
                            confirmMessage: function (data) {
                                return 'Cari kalıcı olarak silinecek: ' + data.record.name + '?';
                            },
                            action: function (data) {
                                apya.platform.customers.customer.delete(data.record.id)
                                    .then(function () {
                                        abp.notify.success('Cari başarıyla silindi.');
                                        dataTable.ajax.reload();
                                    });
                            }
                        }
                    ]
                }
            },
            {
                title: 'Durum',
                data: 'isActive',
                render: function (data) {
                    return data
                        ? '<span class="badge bg-success">Aktif</span>'
                        : '<span class="badge bg-secondary">Pasif</span>';
                }
            },
            {
                title: 'Cari Adı',
                data: 'name'
            },
            {
                title: 'Vergi / TC No',
                data: 'taxNumber',
                render: function (data) { return data || '-'; }
            },
            {
                title: 'Vergi Dairesi',
                data: 'taxOffice',
                render: function (data) { return data || '-'; }
            },
            {
                title: 'Telefon',
                data: 'phone',
                render: function (data) {
                    return data ? '<a href="tel:' + data + '"><i class="fa fa-phone"></i> ' + data + '</a>' : '-';
                }
            },
            {
                title: 'E-Posta',
                data: 'email',
                render: function (data) {
                    return data ? '<a href="mailto:' + data + '">' + data + '</a>' : '-';
                }
            }
        ]
    }));

    $('#NewCustomerButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

});
