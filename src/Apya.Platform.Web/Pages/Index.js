$(function () {
    var l = abp.localization.getResource('Platform');
    var projectService = apya.platform.application.projects.project;

    var createModal = new abp.ModalManager(abp.appPath + 'Projects/CreateModal');

    // Mıknatıs: Görevleri Getir (Acil/Yaklaşan Widget'ları İçin)
    var taskService = apya.platform.tasks.task || null;
    if (taskService) {
        loadDashboardWidgets();
    }

    function loadDashboardWidgets() {
        var now = moment();
        
        // 1. Gecikmiş Görevler (Teslim tarihi geçmiş, tamamlanmamış)
        taskService.getList({ 
            maxDueDate: now.format(), 
            statuses: [1, 2, 3], 
            maxResultCount: 10 
        }).then(function (result) {
            if (result.items.length > 0) {
                $('#DashboardAlertsContainer').show();
                var html = '';
                result.items.forEach(function (t) {
                    html += `
                        <a href="/Projects/ProjectDetails/${t.projectId}" class="text-decoration-none">
                            <div class="card shadow-sm border-danger border-1 h-100" style="width: 250px;">
                                <div class="card-body p-2">
                                    <div class="small fw-bold text-dark text-truncate" title="${t.title}">${t.title}</div>
                                    <div class="small text-danger mt-1"><i class="fa fa-exclamation-triangle"></i> Gecikti: ${moment(t.dueDate).fromNow()}</div>
                                </div>
                            </div>
                        </a>
                    `;
                });
                $('#OverdueTasksList').html(html);
            }
        });

        // 2. Yaklaşan Görevler (Önümüzdeki 48 saat)
        taskService.getList({ 
            minDueDate: now.format(), 
            maxDueDate: now.add(48, 'hours').format(), 
            statuses: [1, 2, 3], 
            maxResultCount: 10 
        }).then(function (result) {
            if (result.items.length > 0) {
                $('#DashboardUpcomingContainer').show();
                var html = '';
                result.items.forEach(function (t) {
                    html += `
                        <a href="/Projects/ProjectDetails/${t.projectId}" class="text-decoration-none">
                            <div class="card shadow-sm border-warning border-1 h-100" style="width: 250px;">
                                <div class="card-body p-2">
                                    <div class="small fw-bold text-dark text-truncate" title="${t.title}">${t.title}</div>
                                    <div class="small text-warning text-dark mt-1"><i class="fa fa-clock"></i> Kalan: ${moment(t.dueDate).fromNow()}</div>
                                </div>
                            </div>
                        </a>
                    `;
                });
                $('#UpcomingTasksList').html(html);
            }
        });
    }

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