using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Documents;

/// <summary>
/// Zaman çizelgesi & bütçe.
///
/// Kapsama oranı MEVCUT veriden türetilir; ayrı bir "kapsama" tablosu yok —
/// harcama veya eşleşme değiştiğinde sayılar kendiliğinden doğrudur.
/// Adam-gün, görev tahmin/kayıt saatlerinden 8 saat = 1 gün kabulüyle çıkar.
/// </summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectTimelineAppService : ApplicationService, IProjectTimelineAppService
{
    private const decimal HoursPerPersonDay = 8m;

    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<ProjectRisk, Guid> _riskRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentExpenseMatch, Guid> _matchRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;

    public ProjectTimelineAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IRepository<ProjectRisk, Guid> riskRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentExpenseMatch, Guid> matchRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskTimeLog, Guid> timeLogRepository)
    {
        _projectRepository = projectRepository;
        _workStepRepository = workStepRepository;
        _riskRepository = riskRepository;
        _fileRepository = fileRepository;
        _matchRepository = matchRepository;
        _expenseRepository = expenseRepository;
        _taskRepository = taskRepository;
        _timeLogRepository = timeLogRepository;
    }

    public virtual async Task<ProjectTimelineDto> GetAsync(Guid projectId)
    {
        var project = await _projectRepository.GetAsync(projectId);

        var steps = (await _workStepRepository.GetListAsync(s => s.ProjectId == projectId))
            .OrderBy(s => s.Order)
            .ToList();

        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var files = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking()
                .Where(f => f.ProjectId == projectId)
                .Select(f => new { f.Id, f.WorkStepId, f.Amount }));

        var dto = new ProjectTimelineDto
        {
            ProjectId = projectId,
            ProjectName = project.Name,
            StartDate = project.StartDate,
            EndDate = project.EndDate,
            Currency = project.Currency,
            Steps = steps.Select(s => new TimelineStepDto
            {
                Id = s.Id,
                Order = s.Order,
                Name = s.Name,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                ProgressPercent = s.ProgressPercent,
                DocumentCount = files.Count(f => f.WorkStepId == s.Id),
                DocumentedAmount = files.Where(f => f.WorkStepId == s.Id).Sum(f => f.Amount ?? 0m),
            }).ToList(),
        };

        dto.Budget = await BuildBudgetAsync(project, files.Select(f => f.Id).ToList());
        dto.Capacity = await BuildCapacityAsync(projectId);
        dto.Risks = await BuildRisksAsync(projectId, steps);

        return dto;
    }

    /// <summary>
    /// Bütçe kapsaması. "Belgesiz harcama" = hiçbir belgeye bağlanmamış harcama —
    /// teslimde en riskli kalem, bu yüzden ayrı toplanır.
    /// </summary>
    private async Task<BudgetCoverageDto> BuildBudgetAsync(Project project, List<Guid> projectFileIds)
    {
        var expenses = await _expenseRepository.GetListAsync(e => e.ProjectId == project.Id);
        var totalExpense = expenses.Sum(e => e.Amount);

        var matchQueryable = await _matchRepository.GetQueryableAsync();
        var matchedExpenseIds = (await AsyncExecuter.ToListAsync(
                matchQueryable.AsNoTracking()
                    .Where(m => projectFileIds.Contains(m.DocumentFileId))
                    .Select(m => m.ExpenseId)))
            .ToHashSet();

        var documented = expenses.Where(e => matchedExpenseIds.Contains(e.Id)).Sum(e => e.Amount);
        var undocumented = expenses.Where(e => !matchedExpenseIds.Contains(e.Id)).ToList();

        return new BudgetCoverageDto
        {
            TotalBudget = project.TotalBudget,
            TotalExpense = totalExpense,
            DocumentedExpense = documented,
            UndocumentedExpense = undocumented.Sum(e => e.Amount),
            UndocumentedCount = undocumented.Count,
            BudgetUsedPercent = project.TotalBudget <= 0
                ? 0
                : (int)Math.Round(totalExpense * 100m / project.TotalBudget, MidpointRounding.AwayFromZero),
            DocumentedPercent = totalExpense <= 0
                ? 100
                : (int)Math.Round(documented * 100m / totalExpense, MidpointRounding.AwayFromZero),
        };
    }

    private async Task<CapacityDto> BuildCapacityAsync(Guid projectId)
    {
        var taskQueryable = await _taskRepository.GetQueryableAsync();
        var tasks = await AsyncExecuter.ToListAsync(
            taskQueryable.AsNoTracking()
                .Where(t => t.ProjectId == projectId)
                .Select(t => new { t.Id, t.EstimatedHours }));

        var estimated = tasks.Sum(t => t.EstimatedHours ?? 0m);

        var taskIds = tasks.Select(t => t.Id).ToList();
        var logQueryable = await _timeLogRepository.GetQueryableAsync();

        // TaskTimeLog saniye tutuyor; saate burada çevrilir.
        var seconds = taskIds.Count == 0
            ? 0L
            : (await AsyncExecuter.ToListAsync(
                    logQueryable.AsNoTracking()
                        .Where(l => taskIds.Contains(l.TaskId) && l.SecondsSpent != null)
                        .Select(l => l.SecondsSpent!.Value)))
                .Sum();

        var logged = Math.Round(seconds / 3600m, 2);

        return new CapacityDto
        {
            EstimatedHours = estimated,
            LoggedHours = logged,
            EstimatedPersonDays = Math.Round(estimated / HoursPerPersonDay, 1),
            LoggedPersonDays = Math.Round(logged / HoursPerPersonDay, 1),
        };
    }

    private async Task<List<ProjectRiskDto>> BuildRisksAsync(Guid projectId, List<ProjectWorkStep> steps)
    {
        var risks = (await _riskRepository.GetListAsync(r => r.ProjectId == projectId))
            .OrderByDescending(r => r.Likelihood * r.Impact)
            .ToList();

        var stepNames = steps.ToDictionary(s => s.Id, s => s.Name);

        return risks.Select(r => MapRisk(r, stepNames)).ToList();
    }

    /* ─────────────────────────── Risk kütüğü ─────────────────────────── */

    [Authorize(PlatformPermissions.Projects.Edit)]
    public virtual async Task<ProjectRiskDto> CreateRiskAsync(CreateUpdateProjectRiskDto input)
    {
        await _projectRepository.GetAsync(input.ProjectId);

        var risk = new ProjectRisk(
            GuidGenerator.Create(), CurrentTenant.Id, input.ProjectId, input.Title,
            input.Likelihood, input.Impact, input.WorkStepId, input.Mitigation);

        await _riskRepository.InsertAsync(risk, autoSave: true);

        return MapRisk(risk, await GetStepNamesAsync(input.ProjectId));
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public virtual async Task<ProjectRiskDto> UpdateRiskAsync(Guid id, CreateUpdateProjectRiskDto input)
    {
        var risk = await _riskRepository.GetAsync(id);
        risk.Update(input.Title, input.Likelihood, input.Impact, input.WorkStepId, input.Mitigation, null);
        await _riskRepository.UpdateAsync(risk);

        return MapRisk(risk, await GetStepNamesAsync(risk.ProjectId));
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public virtual async Task<ProjectRiskDto> SetRiskClosedAsync(Guid id, bool isClosed)
    {
        var risk = await _riskRepository.GetAsync(id);

        if (isClosed) risk.Close(); else risk.Reopen();
        await _riskRepository.UpdateAsync(risk);

        return MapRisk(risk, await GetStepNamesAsync(risk.ProjectId));
    }

    [Authorize(PlatformPermissions.Projects.Delete)]
    public virtual async Task DeleteRiskAsync(Guid id)
    {
        var risk = await _riskRepository.GetAsync(id);
        await _riskRepository.DeleteAsync(risk);
    }

    private async Task<Dictionary<Guid, string>> GetStepNamesAsync(Guid projectId)
        => (await _workStepRepository.GetListAsync(s => s.ProjectId == projectId))
            .ToDictionary(s => s.Id, s => s.Name);

    private static ProjectRiskDto MapRisk(ProjectRisk risk, Dictionary<Guid, string> stepNames) => new()
    {
        Id = risk.Id,
        CreationTime = risk.CreationTime,
        ProjectId = risk.ProjectId,
        WorkStepId = risk.WorkStepId,
        WorkStepName = risk.WorkStepId.HasValue ? stepNames.GetValueOrDefault(risk.WorkStepId.Value) : null,
        Title = risk.Title,
        Likelihood = risk.Likelihood,
        Impact = risk.Impact,
        Score = risk.Score,
        Mitigation = risk.Mitigation,
        IsClosed = risk.IsClosed,
    };
}
