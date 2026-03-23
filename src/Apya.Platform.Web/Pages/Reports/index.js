$(function () {
    var reportService = apya.platform.reports.report;
    var budgetChart = null;
    var efficiencyChart = null;

    initDashboard();

    function initDashboard() {
        reportService.getDashboardStats().then(function (result) {
            
            // Calculate KPIs
            var totalProjects = result.projects.length;
            var totalBudget = 0;
            var totalSpent = 0;
            var totalSeconds = 0;

            result.projects.forEach(p => {
                totalBudget += p.totalBudget;
                totalSpent += p.spentBudget;
                totalSeconds += p.totalSeconds; // from C# DTO
            });

            var totalHours = (totalSeconds / 3600).toFixed(1);
            var budgetFormatted = totalSpent.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + " ₺ / " + totalBudget.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + " ₺";

            // Update UI Counters
            $('#KpiTotalProjects').text(totalProjects);
            $('#KpiTotalHours').text(totalHours + "s");
            $('#KpiTotalBudget').text(budgetFormatted);

            // Render components
            renderBudgetChart(result.projects);
            renderEfficiencyChart(result.personnel);
            renderProjectTable(result.projects);
            renderPersonnelSummary(result.personnel);
        });
    }

    function renderBudgetChart(projects) {
        var ctx = document.getElementById('budgetChart').getContext('2d');
        var labels = projects.map(p => p.projectName);
        var budgets = projects.map(p => p.totalBudget);
        var spent = projects.map(p => p.spentBudget);

        budgetChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Toplam Bütçe (₺)',
                        data: budgets,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Harcanan (₺)',
                        data: spent,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    function renderEfficiencyChart(personnel) {
        var ctx = document.getElementById('efficiencyChart');
        if(!ctx) return;
        var labels = personnel.map(p => p.userName);
        var hours = personnel.map(p => parseFloat((p.totalSeconds / 3600).toFixed(1)));

        efficiencyChart = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Harcanan Saat',
                    data: hours,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }

    function renderProjectTable(projects) {
        var body = $('#projectReportTableBody');
        body.empty();
        projects.forEach(p => {
            var usage = p.totalBudget > 0 ? (p.spentBudget / p.totalBudget * 100).toFixed(1) : 0;
            var usageClass = usage > 90 ? 'bg-danger' : (usage > 50 ? 'bg-warning' : 'bg-success');
            var hours = (p.totalSeconds / 3600).toFixed(1);
            
            body.append(`
                <tr class="bg-white">
                    <td class="fw-bold text-dark"><i class="fa fa-folder-open text-primary me-2"></i>${p.projectName}</td>
                    <td class="text-muted">${p.totalBudget.toLocaleString('tr-TR')} ₺</td>
                    <td class="text-dark fw-bold">${p.spentBudget.toLocaleString('tr-TR')} ₺</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="progress shadow-sm w-100 me-2" style="height: 6px;">
                                <div class="progress-bar ${usageClass}" role="progressbar" style="width: ${usage}%" aria-valuenow="${usage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <span class="small fw-bold ${usage > 90 ? 'text-danger' : 'text-muted'}">%${usage}</span>
                        </div>
                    </td>
                    <td><span class="badge bg-light text-dark border"><i class="fa fa-clock text-secondary me-1"></i>${hours} sa</span></td>
                </tr>
            `);
        });
    }

    function renderPersonnelSummary(personnel) {
        var list = $('#personnelSummaryList');
        list.empty();
        personnel.forEach(p => {
            var hours = (p.totalSeconds / 3600).toFixed(1);
            list.append(`
                <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                    <div class="d-flex align-items-center">
                        <div class="kpi-icon-box bg-light text-secondary me-3" style="width:40px;height:40px;border-radius:50%;">
                            <i class="fa fa-user"></i>
                        </div>
                        <div>
                            <div class="fw-bold text-dark">${p.userName}</div>
                            <small class="text-muted"><i class="fa fa-tasks me-1"></i>${p.taskCount} Görevde Çalıştı</small>
                        </div>
                    </div>
                    <div class="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-pill px-3 py-2 fs-6">
                        ${hours} Saat
                    </div>
                </div>
            `);
        });
    }
});
