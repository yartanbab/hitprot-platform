// jQuery 3.0+ uyumluluk yaması ($.isFunction hatasını giderir)
if (typeof $.isFunction !== 'function') {
    $.isFunction = function (obj) {
        return typeof obj === "function";
    };
}

$(function () {
    var l = abp.localization.getResource('Platform');

    // Konsol ağacına göre kesinleşen adres
    var projectService = apya.platform.application.projects.project;

    var createModal = new abp.ModalManager(abp.appPath + 'CreateModal');
    var analysisInputModal = new abp.ModalManager(abp.appPath + 'AnalysisInputModal');
    var analysisResultModal = new abp.ModalManager(abp.appPath + 'AnalysisModal');

    var dataTable = $('#ProjectsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, "asc"]],
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
                                    window.location.href = "/ProjectDetails/" + data.record.id;
                                }
                            },
                            {
                                text: "➕ Veri Gir / Puanla",
                                action: function (data) {
                                    analysisInputModal.open({ projectId: data.record.id });
                                }
                            },
                            {
                                text: "🏆 Sonuç Gör",
                                visible: function (data) {
                                    return true;
                                },
                                action: function (data) {
                                    analysisResultModal.open({ projectId: data.record.id });
                                }
                            }
                        ]
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
        abp.notify.success('Proje başarıyla oluşturuldu!');
    });
});