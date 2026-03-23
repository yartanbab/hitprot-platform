$(function () {

    var l = abp.localization.getResource('ApyaPlatform');

    var createModal = new abp.ModalManager(abp.appPath + 'Tenants/CreateModal');

    var dataTable = $('#TenantsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: true,
        autoWidth: false,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(volo.abp.tenantManagement.tenant.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items:
                        [
                            {
                                text: 'Düzenle',
                                action: function (data) {
                                    // Normally editModal.open({ id: data.record.id });
                                }
                            },
                            {
                                text: 'Hesabına Gir (Impersonate)',
                                action: function (data) {
                                    // ABP Impersonation Endpoint
                                    var $form = $('<form/>', {
                                        action: '/Account/ImpersonateTenant',
                                        method: 'post'
                                    });
                                    $form.append($('<input/>', {
                                        type: 'hidden',
                                        name: 'TenantId',
                                        value: data.record.id
                                    }));
                                    $form.append($('<input/>', {
                                        type: 'hidden',
                                        name: '__RequestVerificationToken',
                                        value: abp.security.antiForgery.getToken()
                                    }));
                                    $form.appendTo('body').submit();
                                }
                            }
                        ]
                }
            },
            {
                title: 'Durum',
                data: "isActive",
                render: function (data) {
                    if (data) {
                        return '<span class="badge bg-success"><i class="fa fa-circle"></i> Aktif</span>';
                    } else {
                        return '<span class="badge bg-secondary"><i class="fa fa-circle"></i> Pasif</span>';
                    }
                }
            },
            {
                title: 'Müşteri (Tenant) Adı',
                data: "name"
            }
        ]
    }));

    $('#NewTenantButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

});
