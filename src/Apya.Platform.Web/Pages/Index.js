$(function () {
    var l = abp.localization.getResource('Platform');
    var projectService = apya.platform.application.projects.project;

    var createModal = new abp.ModalManager(abp.appPath + 'Projects/CreateModal');

    var dataTable = $('#ProjectsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[2, "asc"]], // Sıralamayı Proje Adı sütununa göre ayarladık
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(projectService.getList),
            columnDefs: [
                {
                    title: "İşlemler",
                    rowAction: {
                        items: [
                            {
                                text: "📂 Projeye Git / Görevler",
                                action: function (data) {
                                    window.location.href = "/Projects/ProjectDetails/" + data.record.id;
                                }
                            }
                        ]
                    }
                },
                {
                    title: "Müşteri",
                    data: "tenantName",
                    // Yeni ABP mimarisine uygun kullanım (Root Admin kontrolü)
                    visible: (!abp.currentTenant || !abp.currentTenant.id),
                    render: function (data) {
                        return data ? '<span class="text-info fw-bold">' + data + '</span>' : '<span class="text-muted">Platform (Host)</span>';
                    }
                },
                {
                    title: "Proje Adı",
                    data: "name"
                },
                {
                    title: "Kod",
                    data: "code"
                },
                {
                    title: "Durum",
                    data: "status",
                    render: function (data) {
                        var color = 'secondary';
                        var text = 'Taslak';
                        if (data === 1) { color = 'warning'; text = 'Devam Ediyor'; }
                        if (data === 2) { color = 'success'; text = 'Tamamlandı'; }
                        return '<span class="badge bg-' + color + '">' + text + '</span>';
                    }
                },
                {
                    title: "Oluşturulma Tarihi",
                    data: "creationTime",
                    render: function (data) {
                        if (!data) return "—";
                        return luxon
                            .DateTime
                            .fromISO(data, { locale: abp.localization.currentCulture.name })
                            .toLocaleString(luxon.DateTime.DATETIME_SHORT);
                    }
                }
            ]
        })
    );

    $('#NewProjectButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });
});