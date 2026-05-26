$(function () {
    var projectService = apya.platform.projects.project;
    var l = abp.localization.getResource('Platform');

    var dataTable = $('#ProjectsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[2, 'asc']],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(projectService.getList),
            columnDefs: [
                {
                    title: 'İşlemler',
                    rowAction: {
                        items: [
                            {
                                text: 'Detay / Görevler',
                                action: function (data) {
                                    window.location.href = '/Projects/ProjectDetails/' + data.record.id;
                                }
                            },
                            {
                                text: 'Sil',
                                visible: function () {
                                    return abp.auth.isGranted('Platform.Projects.Delete');
                                },
                                confirmMessage: function (data) {
                                    return '"' + data.record.name + '" projesini silmek istiyor musunuz?';
                                },
                                action: function (data) {
                                    projectService.delete(data.record.id).then(function () {
                                        abp.notify.success(l('Notify:Project:Deleted'));
                                        dataTable.ajax.reload();
                                    });
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Müşteri',
                    data: 'customerName',
                    defaultContent: '—'
                },
                {
                    title: 'Proje Adı',
                    data: 'name',
                    render: function (data, type, row) {
                        return '<a href="/Projects/ProjectDetails/' + row.id + '">' + data + '</a>';
                    }
                },
                {
                    title: 'Kod',
                    data: 'code'
                },
                {
                    title: 'Durum',
                    data: 'isApproved',
                    render: function (data) {
                        return data
                            ? '<span class="badge bg-success">Onaylı</span>'
                            : '<span class="badge bg-secondary">Taslak</span>';
                    }
                },
                {
                    title: 'Oluşturulma Tarihi',
                    data: 'creationTime',
                    render: function (data) {
                        return luxon.DateTime.fromISO(data, { locale: abp.localization.currentCulture.name }).toLocaleString();
                    }
                }
            ]
        })
    );

    var createModal = new abp.ModalManager(abp.appPath + 'Projects/CreateModal');

    createModal.onResult(function () {
        dataTable.ajax.reload();
        abp.notify.success(l('Notify:Project:Created'));
    });

    $('#NewProjectButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});
