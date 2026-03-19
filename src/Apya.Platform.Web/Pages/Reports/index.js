$(function () {
    var reportService = apya.platform.reports.report;
    var budgetChart = null;
    var efficiencyChart = null;

    initDashboard();

    function initDashboard() {
        reportService.getDashboardStats().then(function (result) {
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
                        label: 'Toplam Bütçe',
                        data: budgets,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 1
                    },
                    {
                        label: 'Harcanan',
                        data: spent,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function renderEfficiencyChart(personnel) {
        var ctx = document.getElementById('efficiencyChart').getContext('2d');
        var labels = personnel.map(p => p.userName);
        var hours = personnel.map(p => p.totalHours);

        efficiencyChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Harcanan Saat',
                    data: hours,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)'
                    ]
                }]
            }
        });
    }

    function renderProjectTable(projects) {
        var body = $('#projectReportTableBody');
        body.empty();
        projects.forEach(p => {
            var usage = p.totalBudget > 0 ? (p.spentBudget / p.totalBudget * 100).toFixed(1) : 0;
            var usageClass = usage > 90 ? 'text-danger fw-bold' : (usage > 50 ? 'text-warning' : 'text-success');
            
            body.append(`
                <tr>
                    <td>${p.projectName}</td>
                    <td>${p.totalBudget.toLocaleString()}</td>
                    <td>${p.spentBudget.toLocaleString()}</td>
                    <td class="${usageClass}">${usage}%</td>
                    <td>${p.totalHours.toFixed(1)} sa</td>
                </tr>
            `);
        });
    }

    function renderPersonnelSummary(personnel) {
        var list = $('#personnelSummaryList');
        list.empty();
        personnel.forEach(p => {
            list.append(`
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div class="fw-bold">${p.userName}</div>
                        <small class="text-muted">${p.taskCount} Farklı Görev</small>
                    </div>
                    <div class="badge bg-primary rounded-pill">${p.totalHours.toFixed(1)} sa</div>
                </div>
            `);
        });
    }
});
