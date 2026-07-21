$(function () {
    var grantService = apya.platform.grants.grant;

    var dataTable = $('#GrantsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, 'asc']],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(grantService.getList),
            columnDefs: [
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Düzenle',
                                visible: function () {
                                    return abp.auth.isGranted('Platform.Grants.Edit');
                                },
                                action: function (data) {
                                    editModal.open({ id: data.record.id });
                                }
                            },
                            {
                                text: 'Sil',
                                visible: function () {
                                    return abp.auth.isGranted('Platform.Grants.Delete');
                                },
                                confirmMessage: function (data) {
                                    return '"' + data.record.name + '" hibe programını silmek istiyor musunuz?';
                                },
                                action: function (data) {
                                    grantService.delete(data.record.id).then(function () {
                                        abp.notify.success('Hibe programı silindi.');
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Program Adı',
                    data: 'name',
                    render: function (data) {
                        return '<span class="fw-semibold">' + $('<div>').text(data || '').html() + '</span>';
                    }
                },
                { title: 'Kurum', data: 'issuer' },
                {
                    title: 'Açıklama',
                    data: 'description',
                    defaultContent: '—',
                    render: function (data) {
                        if (!data) { return '—'; }
                        var esc = $('<div>').text(data).html();
                        return '<span class="d-inline-block text-truncate align-middle" style="max-width:320px" title="' + esc + '">' + esc + '</span>';
                    }
                },
                {
                    title: 'Maks. Tutar',
                    data: 'maxAmount',
                    className: 'apya-numeric',
                    render: function (data) {
                        return data != null ? data.toLocaleString('tr-TR') + ' ₺' : '—';
                    }
                },
                {
                    title: 'Min. Uyum Puanı',
                    data: 'minMatchScore',
                    render: function (data) {
                        // AI eşleştirme skoru — AI aksan tonu (HANDOFF: AI moru)
                        return data > 0 ? '<span class="apya-chip apya-chip-ai">%' + data + '</span>' : '—';
                    }
                }
            ]
        })
    );

    var createModal = new abp.ModalManager(abp.appPath + 'Grants/CreateModal');
    var editModal   = new abp.ModalManager(abp.appPath + 'Grants/EditModal');

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Hibe programı oluşturuldu.');
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success('Hibe programı güncellendi.');
    });

    $('#NewGrantButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});
