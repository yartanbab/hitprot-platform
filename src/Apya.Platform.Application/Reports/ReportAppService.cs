using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Tasks;
using Microsoft.Extensions.Logging;
using Apya.Platform.Projects;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Permissions;

namespace Apya.Platform.Reports;

// SEC-007: Çıplak [Authorize] finansal özeti izinsiz kullanıcıya sızdırıyordu; sayfayla hizalandı.
[Authorize(PlatformPermissions.Reports.Default)]
public class ReportAppService : ApplicationService, IReportAppService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    // ARCH-042: ITenantStore → IRepository<Tenant> — batch lookup yerine N+1 FindAsync çağrısından kaçınmak için
    private readonly IRepository<Tenant, Guid> _tenantRepository;

    public ReportAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskTimeLog, Guid> timeLogRepository,
        IRepository<IdentityUser, Guid> userRepository,
        IRepository<Tenant, Guid> tenantRepository)
    {
        _projectRepository = projectRepository;
        _taskRepository = taskRepository;
        _timeLogRepository = timeLogRepository;
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
    }

    public async Task<DashboardReportDto> GetDashboardStatsAsync()
    {
        try
        {
            // Root Admin (Host) ise tüm kiracıların verilerini görsün
            using (CurrentTenant.Id == null ? DataFilter.Disable<Volo.Abp.MultiTenancy.IMultiTenant>() : null)
            {
                Logger.LogInformation("Dashboard istatistikleri hesaplanıyor... TenantId: {TenantId}", CurrentTenant.Id);

                var projectQuery = await _projectRepository.GetQueryableAsync();
                var taskQuery = await _taskRepository.GetQueryableAsync();
                var logQuery = await _timeLogRepository.GetQueryableAsync();
                var userQuery = await _userRepository.GetQueryableAsync();

                var result = new DashboardReportDto();

                // 1. Proje Analizi (Tamamen SQL tarafında gruplanarak çekilir)
                var projectStats = await AsyncExecuter.ToListAsync(
                    projectQuery.Select(p => new
                    {
                        Project = p,
                        TotalTaskCount = taskQuery.Count(t => t.ProjectId == p.Id),
                        CompletedTaskCount = taskQuery.Count(t => t.ProjectId == p.Id && (int)t.Status == 3),
                        TotalSeconds = logQuery
                            .Where(l => taskQuery.Where(t => t.ProjectId == p.Id).Select(t => t.Id).Contains(l.TaskId))
                            .Sum(l => (long?)l.SecondsSpent) ?? 0
                    })
                );

                // ARCH-042: Tenant isimlerini tek sorguda toplu al — N+1 FindAsync döngüsü yerine.
                var tenantIds = projectStats
                    .Where(s => s.Project.TenantId.HasValue)
                    .Select(s => s.Project.TenantId!.Value)
                    .Distinct()
                    .ToList();
                var tenantNameMap = tenantIds.Count > 0
                    ? (await _tenantRepository.GetListAsync(t => tenantIds.Contains(t.Id)))
                        .ToDictionary(t => t.Id, t => t.Name)
                    : new Dictionary<Guid, string>();

                // ARCH-043: Clock.Now (IClock) — DateTime.Now yerine ABP zaman soyutlaması
                var now = Clock.Now;
                foreach (var stat in projectStats)
                {
                    var p = stat.Project;
                    var pSeconds = stat.TotalSeconds;

                    var currencySymbol = (p.Currency ?? "TRY") switch
                    {
                        "USD" => "$",
                        "EUR" => "€",
                        _ => "₺"
                    };

                    int remainingDays = 0;
                    int timeUsagePercent = 0;
                    string timeHealthColor = "success";

                    if (p.StartDate.HasValue && p.EndDate.HasValue)
                    {
                        var totalDays = (p.EndDate.Value - p.StartDate.Value).TotalDays;
                        var daysPassed = (now - p.StartDate.Value).TotalDays;
                        remainingDays = Math.Max(0, (int)(p.EndDate.Value - now).TotalDays);
                        timeUsagePercent = totalDays > 0
                            ? Math.Min(100, (int)Math.Round(daysPassed / totalDays * 100))
                            : 0;

                        var completionRate = stat.TotalTaskCount > 0
                            ? (double)stat.CompletedTaskCount / stat.TotalTaskCount * 100
                            : 0;

                        if (timeUsagePercent > 80 && completionRate < 50)
                            timeHealthColor = "danger";
                        else if (timeUsagePercent > 50 && completionRate < (timeUsagePercent - 20))
                            timeHealthColor = "warning";
                    }

                    var spentBudget = (decimal)(pSeconds / 3600.0) * p.HourlyRate;
                    int totalProjectDays = 0;
                    int daysPassedInt = 0;
                    decimal dailyBurnRate = 0;
                    int estimatedExhaustionDay = 0;

                    if (p.StartDate.HasValue && p.EndDate.HasValue)
                    {
                        totalProjectDays = (int)(p.EndDate.Value - p.StartDate.Value).TotalDays;
                        daysPassedInt = Math.Max(1, (int)(now - p.StartDate.Value).TotalDays);

                        if (daysPassedInt > 0 && spentBudget > 0)
                        {
                            dailyBurnRate = spentBudget / daysPassedInt;
                            if (dailyBurnRate > 0 && p.TotalBudget > 0)
                            {
                                estimatedExhaustionDay = (int)(p.TotalBudget / dailyBurnRate);
                            }
                        }
                    }

                    var tenantName = p.TenantId.HasValue
                        ? tenantNameMap.GetValueOrDefault(p.TenantId.Value, "Bilinmeyen")
                        : "Platform (Host)";

                    result.Projects.Add(new ProjectReportDto
                    {
                        ProjectId = p.Id,
                        ProjectName = p.Name ?? "İsimsiz Proje",
                        ProjectCode = p.Code ?? "",
                        Currency = p.Currency ?? "TRY",
                        CurrencySymbol = currencySymbol,
                        TotalBudget = p.TotalBudget,
                        SpentBudget = spentBudget,
                        TotalSeconds = pSeconds,
                        RemainingDays = remainingDays,
                        TimeUsagePercent = timeUsagePercent,
                        TimeHealthColor = timeHealthColor,
                        HasAttachments = false,
                        TotalProjectDays = totalProjectDays,
                        DaysPassed = daysPassedInt,
                        DailyBurnRate = dailyBurnRate,
                        EstimatedBudgetExhaustionDay = estimatedExhaustionDay,
                        StartDate = p.StartDate,
                        EndDate = p.EndDate,
                        TenantName = tenantName
                    });
                }

                // 2. Personel Verimliliği (Veritabanı bazlı aggregation)
                var userStats = await AsyncExecuter.ToListAsync(
                    userQuery.Select(u => new
                    {
                        UserName = u.UserName,
                        TotalSeconds = logQuery.Where(l => l.UserId == u.Id).Sum(l => (long?)l.SecondsSpent) ?? 0,
                        TaskCount = logQuery.Where(l => l.UserId == u.Id).Select(l => l.TaskId).Distinct().Count()
                    }).Where(u => u.TotalSeconds > 0)
                );

                foreach (var stat in userStats)
                {
                    result.Personnel.Add(new PersonnelEfficiencyDto
                    {
                        UserName = stat.UserName ?? "Bilinmeyen Kullanıcı",
                        TotalSeconds = stat.TotalSeconds,
                        TaskCount = stat.TaskCount
                    });
                }

                Logger.LogInformation("Dashboard istatistikleri başarıyla hesaplandı. Proje: {ProjectCount}, Personel: {UserCount}", result.Projects.Count, result.Personnel.Count);

                // 3. Tenant ROI Analizi
                var tenantGroups = result.Projects
                    .Where(p => p.TenantName != "Platform (Host)")
                    .GroupBy(p => p.TenantName);

                foreach (var group in tenantGroups)
                {
                    result.TenantRoi.Add(new TenantRoiDto
                    {
                        TenantName = group.Key,
                        ProjectCount = group.Count(),
                        TotalBudget = group.Sum(p => p.TotalBudget),
                        TotalSpent = group.Sum(p => p.SpentBudget),
                        TotalHours = group.Sum(p => p.TotalHours)
                    });
                }

                return result;
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Dashboard istatistikleri alınırken kritik hata oluştu!");
            throw;
        }
    }
}
