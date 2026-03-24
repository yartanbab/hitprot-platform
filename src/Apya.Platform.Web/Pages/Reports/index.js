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
            var sym = p.currencySymbol || '\u20BA';
            
            // Zaman sagligi trafik isigi
            var healthDot = '';
            if (p.timeHealthColor === 'danger') {
                healthDot = '<span class="badge bg-danger rounded-pill ms-1" style="font-size:0.65rem;">Kritik</span>';
            } else if (p.timeHealthColor === 'warning') {
                healthDot = '<span class="badge bg-warning text-dark rounded-pill ms-1" style="font-size:0.65rem;">Dikkat</span>';
            } else {
                healthDot = '<span class="badge bg-success rounded-pill ms-1" style="font-size:0.65rem;">Saglam</span>';
            }

            var remainingText = p.remainingDays > 0 ? `${p.remainingDays} gun` : 'Bitis!';
            
            body.append(`
                <tr class="bg-white">
                    <td class="fw-bold text-dark">
                        <i class="fa fa-folder-open text-primary me-2"></i>${p.projectName}
                        <br><small class="text-muted fw-normal">${p.projectCode || ''}</small>
                    </td>
                    <td class="text-muted">${p.totalBudget.toLocaleString('tr-TR')} ${sym}</td>
                    <td class="text-dark fw-bold">${p.spentBudget.toLocaleString('tr-TR')} ${sym}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="progress shadow-sm w-100 me-2" style="height: 6px;">
                                <div class="progress-bar ${usageClass}" role="progressbar" style="width: ${usage}%"></div>
                            </div>
                            <span class="small fw-bold ${usage > 90 ? 'text-danger' : 'text-muted'}">%${usage}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-light text-dark border"><i class="fa fa-clock text-secondary me-1"></i>${hours} sa</span>
                        ${healthDot}
                        <br><small class="text-muted" style="font-size:0.7rem;"><i class="fa fa-hourglass-half me-1"></i>${remainingText}</small>
                    </td>
                </tr>
            `);
        });
    }

    function renderPersonnelSummary(personnel) {
        var list = $('#personnelSummaryList');
        list.empty();
        personnel.forEach(p => {
            var hours = (p.totalSeconds / 3600).toFixed(1);
            var isOverloaded = p.isOverloaded || false;
            var borderClass = isOverloaded ? 'border-danger' : '';
            var nameClass = isOverloaded ? 'text-danger' : 'text-dark';
            var badgeClass = isOverloaded 
                ? 'bg-danger bg-opacity-10 text-danger border-danger' 
                : 'bg-primary bg-opacity-10 text-primary border-primary';
            var overloadBadge = isOverloaded 
                ? '<span class="badge bg-danger text-white ms-2" style="font-size:0.65rem;">Kapasite Asimi!</span>' 
                : '';

            list.append(`
                <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom ${borderClass}">
                    <div class="d-flex align-items-center">
                        <div class="kpi-icon-box ${isOverloaded ? 'bg-danger bg-opacity-10 text-danger' : 'bg-light text-secondary'} me-3" style="width:40px;height:40px;border-radius:50%;">
                            <i class="fa fa-user"></i>
                        </div>
                        <div>
                            <div class="fw-bold ${nameClass}">${p.userName}${overloadBadge}</div>
                            <small class="text-muted"><i class="fa fa-tasks me-1"></i>${p.taskCount} Gorevde Calisti</small>
                        </div>
                    </div>
                    <div class="badge ${badgeClass} border rounded-pill px-3 py-2 fs-6">
                        ${hours} Saat
                    </div>
                </div>
            `);
        });
    }
});
