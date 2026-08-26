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
        scrollX: true,
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
                                text: 'Paket Değiştir',
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.Update'),
                                action: function (data) {
                                    changePackage(data.record);
                                }
                            },
                            {
                                text: 'Süreyi Uzat',
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.Update'),
                                action: function (data) {
                                    renewPackage(data.record);
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
                        return '<span class="apya-chip apya-chip-positive"><i class="fa fa-circle"></i> Aktif</span>';
                    } else {
                        return '<span class="apya-chip apya-chip-neutral"><i class="fa fa-circle"></i> Pasif</span>';
                    }
                }
            },
            {
                title: 'Müşteri (Tenant) Adı',
                data: "tenantName"
            },
            {
                title: 'Paket',
                data: "packageCode",
                render: function (data) {
                    var dic = { 1: 'Basic', 2: 'Standard', 3: 'Premium', 4: 'Enterprise' };
                    return '<span class="apya-chip apya-chip-brand">' + (dic[data] || '-') + '</span>';
                }
            },
            {
                title: 'Paket Bitişi',
                data: "subscriptionEndDate",
                render: function (data, type, row) {
                    // Abonelik satırı olmayan müşteri süresizdir: süre işleyicisi ona dokunmaz.
                    if (!data) {
                        return '<span class="text-muted">Süresiz</span>';
                    }

                    var end = new Date(data);
                    var text = end.toLocaleDateString('tr-TR');
                    var daysLeft = Math.ceil((end - new Date()) / 86400000);

                    if (row.isInGracePeriod) {
                        return '<span class="apya-chip apya-chip-negative" title="Süre doldu, ek süre işliyor">'
                            + text + ' · ek süre</span>';
                    }
                    if (daysLeft <= 7) {
                        return '<span class="apya-chip apya-chip-warning">' + text + ' · ' + daysLeft + ' gün</span>';
                    }
                    return '<span class="apya-chip apya-chip-neutral">' + text + '</span>';
                }
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

    var PACKAGES = { 1: 'Basic', 2: 'Standard', 3: 'Premium', 4: 'Enterprise' };

    // SubscriptionPeriod: değer = AY SAYISI (0 = süresiz).
    var PERIODS = { 0: 'Süresiz', 1: '1 Ay', 3: '3 Ay', 6: '6 Ay', 12: '1 Yıl' };

    function buildSelect(id, options, selectedValue) {
        var html = '<select id="' + id + '" class="form-select">';
        Object.keys(options).forEach(function (value) {
            var selected = String(selectedValue) === String(value) ? ' selected' : '';
            html += '<option value="' + value + '"' + selected + '>' + options[value] + '</option>';
        });
        return html + '</select>';
    }

    // Faz 2: tenant'a paket ata → feature seti yeniden uygulanır (AssignPackageAsync).
    // Süre seçimi yeni bir abonelik dönemi başlatır; süre dolunca müşteri Basic'e iner.
    function changePackage(record) {
        Swal.fire({
            title: 'Paket Değiştir',
            html: '<div class="text-start">'
                + '<div class="mb-2 text-muted small">' + record.tenantName + '</div>'
                + '<label class="form-label small">Paket</label>'
                + buildSelect('pkgSelect', PACKAGES, record.packageCode || 1)
                + '<label class="form-label small mt-3">Süre</label>'
                + buildSelect('periodSelect', PERIODS, record.subscriptionPeriod || 0)
                + '<div class="form-text mt-2">Yeni dönem bugün başlar; kalan süre devredilmez. '
                + 'Kalan süreyi korumak için "Süreyi Uzat"ı kullanın.</div>'
                + '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Uygula',
            cancelButtonText: 'İptal',
            preConfirm: function () {
                return {
                    packageCode: parseInt(document.getElementById('pkgSelect').value, 10),
                    period: parseInt(document.getElementById('periodSelect').value, 10)
                };
            }
        }).then(function (r) {
            if (!r.isConfirmed) { return; }
            apya.platform.tenants.tenantProfile
                .assignPackage(record.tenantId, r.value.packageCode, r.value.period)
                .then(function () {
                    abp.notify.success('Paket güncellendi ve müşteriye uygulandı.');
                    dataTable.ajax.reload();
                });
        });
    }

    // Paketi DEĞİŞTİRMEDEN süreyi uzatır: yeni dönem mevcut bitişin üstüne biner,
    // kalan süre yanmaz. Ödeme altyapısı geldiğinde aynı kapı kullanılacak.
    function renewPackage(record) {
        var periods = { 1: '1 Ay', 3: '3 Ay', 6: '6 Ay', 12: '1 Yıl' };

        Swal.fire({
            title: 'Süreyi Uzat',
            html: '<div class="text-start">'
                + '<div class="mb-2 text-muted small">' + record.tenantName
                + ' · ' + (PACKAGES[record.packageCode] || '-') + '</div>'
                + '<label class="form-label small">Eklenecek süre</label>'
                + buildSelect('renewSelect', periods, 1)
                + '<div class="form-text mt-2">Kalan süre korunur: yeni dönem mevcut bitişin üstüne eklenir.</div>'
                + '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Uzat',
            cancelButtonText: 'İptal',
            preConfirm: function () {
                return parseInt(document.getElementById('renewSelect').value, 10);
            }
        }).then(function (r) {
            if (!r.isConfirmed) { return; }
            apya.platform.tenants.tenantProfile
                .renewPackage(record.tenantId, r.value)
                .then(function () {
                    abp.notify.success('Paket süresi uzatıldı.');
                    dataTable.ajax.reload();
                });
        });
    }

});
