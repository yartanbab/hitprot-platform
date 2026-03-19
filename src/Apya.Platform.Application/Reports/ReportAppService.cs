using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Tasks;
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
        var projects = await _projectRepository.GetListAsync();
        var allTasks = await _taskRepository.GetListAsync();
        var allLogs = await _timeLogRepository.GetListAsync();
        var users = await _userRepository.GetListAsync();

        var result = new DashboardReportDto();

        // 1. Proje Analizi
        foreach (var p in projects)
        {
            var pTasks = allTasks.Where(x => x.ProjectId == p.Id).Select(x => x.Id).ToList();
            var pSeconds = allLogs.Where(x => pTasks.Contains(x.TaskId)).Sum(x => x.SecondsSpent ?? 0);
            
            result.Projects.Add(new ProjectReportDto
            {
                ProjectName = p.Name,
                TotalBudget = p.TotalBudget,
                SpentBudget = (decimal)(pSeconds / 3600.0) * p.HourlyRate,
                TotalSeconds = pSeconds
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
                    UserName = u.UserName,
                    TotalSeconds = uLogs.Sum(x => x.SecondsSpent ?? 0),
                    TaskCount = uLogs.Select(x => x.TaskId).Distinct().Count()
                });
            }
        }

        return result;
    }
}
