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

namespace Apya.Platform.Reports;

[Authorize]
public class ReportAppService : ApplicationService, IReportAppService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;
    private readonly IRepository<IdentityUser, Guid> _userRepository;

    public ReportAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskTimeLog, Guid> timeLogRepository,
        IRepository<IdentityUser, Guid> userRepository)
    {
        _projectRepository = projectRepository;
        _taskRepository = taskRepository;
        _timeLogRepository = timeLogRepository;
        _userRepository = userRepository;
    }

    public async Task<DashboardReportDto> GetDashboardStatsAsync()
    {
        try
        {
            // Root Admin (Host) ise tüm kiracıların verilerini görsün
            using (CurrentTenant.Id == null ? DataFilter.Disable<Volo.Abp.MultiTenancy.IMultiTenant>() : null)
            {
                Logger.LogInformation("Dashboard istatistikleri hesaplanıyor... TenantId: {TenantId}", CurrentTenant.Id);

                var projects = await _projectRepository.GetListAsync();
                var allTasks = await _taskRepository.GetListAsync();
                var allLogs = await _timeLogRepository.GetListAsync();
                var users = await _userRepository.GetListAsync();

                var result = new DashboardReportDto();

                // 1. Proje Analizi
                var now = DateTime.Now;
                foreach (var p in projects)
                {
                    var pTasks = allTasks.Where(x => x.ProjectId == p.Id).Select(x => x.Id).ToList();
                    var pSeconds = allLogs.Where(x => pTasks.Contains(x.TaskId)).Sum(x => x.SecondsSpent ?? 0);

                    // Para birimi cevrimle
                    var currencySymbol = (p.Currency ?? "TRY") switch
                    {
                        "USD" => "$",
                        "EUR" => "\u20AC",
                        _ => "\u20BA"
                    };

                    // Zaman sagligi hesaplama
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

                        // Tamamlanma orani ile kiyasla
                        var totalTaskCount = allTasks.Count(x => x.ProjectId == p.Id);
                        var completedCount = allTasks.Count(x => x.ProjectId == p.Id && (int)x.Status == 3);
                        var completionRate = totalTaskCount > 0 ? (double)completedCount / totalTaskCount * 100 : 0;

                        if (timeUsagePercent > 80 && completionRate < 50)
                            timeHealthColor = "danger";
                        else if (timeUsagePercent > 50 && completionRate < (timeUsagePercent - 20))
                            timeHealthColor = "warning";
                    }

                    result.Projects.Add(new ProjectReportDto
                    {
                        ProjectId = p.Id,
                        ProjectName = p.Name ?? "Isimsiz Proje",
                        ProjectCode = p.Code ?? "",
                        Currency = p.Currency ?? "TRY",
                        CurrencySymbol = currencySymbol,
                        TotalBudget = p.TotalBudget,
                        SpentBudget = (decimal)(pSeconds / 3600.0) * p.HourlyRate,
                        TotalSeconds = pSeconds,
                        RemainingDays = remainingDays,
                        TimeUsagePercent = timeUsagePercent,
                        TimeHealthColor = timeHealthColor,
                        HasAttachments = false // TODO: ProjectAttachment kontrolu eklenecek
                    });
                }

                // 2. Personel Verimliliği
                foreach (var u in users)
                {
                    var uLogs = allLogs.Where(x => x.UserId == u.Id).ToList();
                    if (uLogs.Any())
                    {
                        result.Personnel.Add(new PersonnelEfficiencyDto
                        {
                            UserName = u.UserName ?? "Bilinmeyen Kullanıcı",
                            TotalSeconds = uLogs.Sum(x => x.SecondsSpent ?? 0),
                            TaskCount = uLogs.Select(x => x.TaskId).Distinct().Count()
                        });
                    }
                }

                Logger.LogInformation("Dashboard istatistikleri başarıyla hesaplandı. Proje: {ProjectCount}, Personel: {UserCount}", result.Projects.Count, result.Personnel.Count);
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
