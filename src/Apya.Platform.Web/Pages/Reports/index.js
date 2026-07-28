$(function () {
    var reportService = apya.platform.reports.report;
    var budgetChart = null;
    var efficiencyChart = null;
    var lastStats = null;

    initDashboard();

    // Grafik renkleri token'lardan runtime okunuyor → tema değişince yeniden kur.
    apyaChart.onThemeChange(function () {
        if (!lastStats) { return; }
        if (budgetChart) { budgetChart.destroy(); }
        if (efficiencyChart) { efficiencyChart.destroy(); }
        renderBudgetChart(lastStats.projects);
        renderEfficiencyChart(lastStats.personnel);
    });

    function initDashboard() {
        reportService.getDashboardStats().then(function (result) {
            lastStats = result;
            
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
            renderTenantRoi(result.tenantRoi || []);
        });
    }

    function renderBudgetChart(projects) {
        var ctx = document.getElementById('budgetChart').getContext('2d');
        var labels = projects.map(p => p.projectName);
        var budgets = projects.map(p => p.totalBudget);
        var spent = projects.map(p => p.spentBudget);
        // Forecast: Tahmini tukenme noktasi (gun bazli yanma hizi x toplam gun)
        var forecast = projects.map(p => {
            if (p.dailyBurnRate > 0 && p.totalProjectDays > 0) {
                return Math.min(p.totalBudget, p.dailyBurnRate * p.totalProjectDays);
            }
            return 0;
        });

        // Renkler tasarım tonlarından: bütçe=nötr referans, harcanan=aksiyon,
        // tahmin=uyarı (gelecek/riskli). apyaChart geri kalanını (ızgara,
        // tooltip, punto, bar yarıçapı/kalınlığı) token'lardan doldurur.
        budgetChart = new Chart(ctx, apyaChart.options({
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Toplam Butce',
                        data: budgets,
                        backgroundColor: apyaChart.alpha(apyaChart.tone('brand'), 0.35)
                    },
                    {
                        label: 'Harcanan',
                        data: spent,
                        backgroundColor: apyaChart.tone('accent')
                    },
                    {
                        label: 'Tahmini Toplam Harcama (Forecast)',
                        data: forecast,
                        type: 'line',
                        borderColor: apyaChart.tone('warning'),
                        borderDash: [6, 3],
                        pointRadius: 3,
                        pointBackgroundColor: apyaChart.tone('warning'),
                        fill: false
                    }
                ]
            }
        }));
    }

    function renderEfficiencyChart(personnel) {
        var ctx = document.getElementById('efficiencyChart');
        if(!ctx) return;
        var labels = personnel.map(p => p.userName);
        var hours = personnel.map(p => parseFloat((p.totalSeconds / 3600).toFixed(1)));

        // doughnut: HANDOFF'un dilim grafiği kalıbı (cutout %72 + 2px spacing);
        // dilim renkleri apyaChart paletinden sırayla atanır.
        efficiencyChart = new Chart(ctx.getContext('2d'), apyaChart.options({
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{ label: 'Harcanan Saat', data: hours }]
            },
            options: {
                plugins: { legend: { position: 'right' } }
            }
        }));
    }

    function renderProjectTable(projects) {
        var body = $('#projectReportTableBody');
        body.empty();
        projects.forEach(p => {
            var usage = p.totalBudget > 0 ? (p.spentBudget / p.totalBudget * 100).toFixed(1) : 0;
            // Tasarım sistemi ilerleme barı (apya-shell.css §14) — Bootstrap
            // .progress/.progress-bar yerine; ton sınıfları token'lardan gelir.
            var usageTone = usage > 90 ? 'is-negative' : (usage > 50 ? 'is-warning' : 'is-positive');
            var hours = (p.totalSeconds / 3600).toFixed(1);
            var sym = ''; // \u00C7oklu d\u00F6viz gizlendi \u2014 tutarlar sade (sembols\u00FCz); t\u00FCm i\u015Flemler TRY.
            
            // Zaman sagligi trafik isigi
            var healthDot = '';
            if (p.timeHealthColor === 'danger') {
                healthDot = '<span class="apya-chip apya-chip-negative ms-1">Kritik</span>';
            } else if (p.timeHealthColor === 'warning') {
                healthDot = '<span class="apya-chip apya-chip-warning ms-1">Dikkat</span>';
            } else {
                healthDot = '<span class="apya-chip apya-chip-positive ms-1">Saglam</span>';
            }

            var remainingText = p.remainingDays > 0 ? `${p.remainingDays} gun` : 'Bitis!';

            body.append(`
                <tr>
                    <td class="fw-bold">
                        <i class="fa fa-folder-open text-primary me-2"></i>${p.projectName}
                        <br><small class="text-muted fw-normal">${p.projectCode || ''}</small>
                    </td>
                    <td class="apya-numeric text-muted">${p.totalBudget.toLocaleString('tr-TR')} ${sym}</td>
                    <td class="apya-numeric fw-bold">${p.spentBudget.toLocaleString('tr-TR')} ${sym}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="apya-mini-progress ${usageTone} w-100"><span style="width: ${usage}%"></span></div>
                            <span class="apya-numeric fw-bold ${usage > 90 ? 'text-danger' : 'text-muted'}">%${usage}</span>
                        </div>
                    </td>
                    <td>
                        <span class="apya-chip apya-chip-neutral"><i class="fa fa-clock me-1"></i>${hours} sa</span>
                        ${healthDot}
                        <br><small class="text-muted"><i class="fa fa-hourglass-half me-1"></i>${remainingText}</small>
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
            var nameClass = isOverloaded ? 'text-danger' : '';
            var chipTone = isOverloaded ? 'negative' : 'brand';
            var iconTone = isOverloaded ? 'kpi-icon-box--negative' : 'kpi-icon-box--neutral';
            var overloadBadge = isOverloaded
                ? '<span class="apya-chip apya-chip-negative ms-2">Kapasite Asimi!</span>'
                : '';

            list.append(`
                <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom ${borderClass}">
                    <div class="d-flex align-items-center">
                        <div class="kpi-icon-box kpi-icon-box--sm ${iconTone} me-3">
                            <i class="fa fa-user"></i>
                        </div>
                        <div>
                            <div class="fw-bold ${nameClass}">${p.userName}${overloadBadge}</div>
                            <small class="text-muted"><i class="fa fa-tasks me-1"></i>${p.taskCount} Gorevde Calisti</small>
                        </div>
                    </div>
                    <div class="apya-chip apya-chip-${chipTone} apya-numeric">
                        ${hours} Saat
                    </div>
                </div>
            `);
        });
    }
    function renderTenantRoi(tenantRoi) {
        var body = $('#tenantRoiTableBody');
        var noDataMsg = $('#noTenantRoiMessage');
        body.empty();

        if (!tenantRoi || tenantRoi.length === 0) {
            noDataMsg.removeClass('d-none');
            $('#TenantRoiTable').addClass('d-none');
            return;
        }

        noDataMsg.addClass('d-none');
        $('#TenantRoiTable').removeClass('d-none');

        tenantRoi.forEach(t => {
            var profit = t.profit || (t.totalBudget - t.totalSpent);
            var roiPercent = t.roiPercent || (t.totalBudget > 0 ? (profit / t.totalBudget * 100) : 0);
            var profitClass = profit >= 0 ? 'text-success' : 'text-danger';
            var roiTone = roiPercent >= 0 ? 'positive' : 'negative';
            var hours = (t.totalHours || 0).toFixed(1);

            body.append(`
                <tr>
                    <td class="fw-bold">
                        <i class="fa fa-building text-info me-2"></i>${t.tenantName}
                    </td>
                    <td class="text-center">
                        <span class="apya-chip apya-chip-brand">${t.projectCount}</span>
                    </td>
                    <td class="apya-numeric text-muted">${t.totalBudget.toLocaleString('tr-TR')} \u20BA</td>
                    <td class="apya-numeric fw-bold">${t.totalSpent.toLocaleString('tr-TR')} \u20BA</td>
                    <td class="apya-numeric fw-bold ${profitClass}">${profit.toLocaleString('tr-TR')} \u20BA</td>
                    <td class="text-center">
                        <span class="apya-chip apya-chip-${roiTone}">
                            %${roiPercent.toFixed(1)}
                        </span>
                    </td>
                    <td><span class="apya-chip apya-chip-neutral"><i class="fa fa-clock me-1"></i>${hours} sa</span></td>
                </tr>
            `);
        });
    }
});
