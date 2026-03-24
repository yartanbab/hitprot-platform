$(function () {

    var l = abp.localization.getResource('ApyaPlatform');

    var createModal = new abp.ModalManager(abp.appPath + 'TenantManagement/Tenants/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'TenantManagement/Tenants/EditModal');
    var manageFeaturesModal = new abp.ModalManager(abp.appPath + 'TenantManagement/Tenants/FeatureManagementModal');
    var manageConnectionStringsModal = new abp.ModalManager(abp.appPath + 'TenantManagement/Tenants/ConnectionStringsModal');

    var dataTable = $('#TenantsTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        autoWidth: false,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(apya.platform.tenants.tenantProfile.getList),
        columnDefs: [
            {
                title: 'Aksiyonlar',
                rowAction: {
                    items:
                        [
                            {
                                text: 'Hesabına Gir (Impersonate)',
                                action: function (data) {
                                    var $form = $('<form/>', {
                                        action: '/Account/ImpersonateTenant',
                                        method: 'post'
                                    });
                                    $form.append($('<input/>', {
                                        type: 'hidden',
                                        name: 'TenantId',
                                        value: data.record.tenantId
                                    }));
                                    $form.append($('<input/>', {
                                        type: 'hidden',
                                        name: '__RequestVerificationToken',
                                        value: abp.security.antiForgery.getToken()
                                    }));
                                    $form.appendTo('body').submit();
                                }
                            },
                            {
                                text: 'Düzenle (Edit)',
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.Update'),
                                action: function (data) {
                                    editModal.open({ id: data.record.tenantId });
                                }
                            },
                            {
                                text: 'Bağlantı Dizeleri (Connection Strings)',
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.ManageConnectionStrings'),
                                action: function (data) {
                                    manageConnectionStringsModal.open({ id: data.record.tenantId });
                                }
                            },
                            {
                                text: 'Seçenekler (Features)',
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.ManageFeatures'),
                                action: function (data) {
                                    manageFeaturesModal.open({ providerName: 'T', providerKey: data.record.tenantId });
                                }
                            },
                            {
                                text: 'Sil (Delete)',
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.Delete'),
                                confirmMessage: function (data) {
                                    return "Müşteri kalıcı olarak silinecek: " + data.record.tenantName + "?";
                                },
                                action: function (data) {
                                    $.ajax({
                                        type: 'DELETE',
                                        url: '/api/multi-tenancy/tenants/' + data.record.tenantId,
                                        success: function () {
                                            abp.notify.success('Müşteri başarıyla silindi.');
                                            dataTable.ajax.reload();
                                        }
                                    });
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
                data: "tenantName"
            },
            {
                title: 'Vergi No',
                data: "taxNumber",
                render: function (data) {
                    return data || '-';
                }
            },
            {
                title: 'Türü',
                data: "companyType",
                render: function(data) {
                    var dic = { 1: "Şirket", 2: "Dernek", 3: "Vakıf", 4: "Şahıs Şti." };
                    return dic[data] || "Bilinmiyor";
                }
            },
            {
                title: 'Açık Adres',
                data: "address",
                render: function(data) { return data || '-'; }
            },
            {
                title: 'Yasal Yetkili',
                data: "legalRepresentativeName",
                render: function(data, type, row) { 
                    var name = data || '-';
                    var phone = row.legalRepresentativePhone;
                    if (phone) return name + ' <br/><small><a href="tel:' + phone + '"><i class="fa fa-phone"></i> ' + phone + '</a></small>';
                    return name;
                }
            },
            {
                title: 'İletişim Kişisi',
                data: "operationalContactName",
                render: function(data, type, row) { 
                    var name = data || '-';
                    var phone = row.operationalContactPhone;
                    if (phone) return name + ' <br/><small><a href="tel:' + phone + '"><i class="fa fa-phone"></i> ' + phone + '</a></small>';
                    return name;
                }
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

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

});
