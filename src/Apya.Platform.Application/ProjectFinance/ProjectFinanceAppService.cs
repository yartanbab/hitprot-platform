using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectFinance;

[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectFinanceAppService : ApplicationService, IProjectFinanceAppService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;

    public ProjectFinanceAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IRepository<TaskItem, Guid> taskRepository)
    {
        _projectRepository = projectRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _taskRepository = taskRepository;
    }

    public async Task<ProjectFinanceSummaryDto> GetSummaryAsync(Guid projectId)
    {
        // Proje kartına basınca gelen 404'ün ASIL kaynağı burasıydı: ProjectDetails
        // sayfası GetDetailAsync'ten (host kapsamını açıyor) sonra bunu çağırıyor,
        // buradaki filtresiz GetAsync ise kiracı projesini "bulunamadı" sayıyordu.
        using var hostScope = CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null;

        var project = await _projectRepository.GetAsync(projectId);

        var expenses = await _expenseRepository.GetListAsync(x => x.ProjectId == projectId);
        var incomes = await _incomeRepository.GetListAsync(x => x.ProjectId == projectId);

        var dto = new ProjectFinanceSummaryDto
        {
            ProjectId = project.Id,
            ProjectName = project.Name,
            Currency = string.IsNullOrWhiteSpace(project.Currency) ? "TRY" : project.Currency,
            Budget = project.TotalBudget,
            TotalExpense = expenses.Sum(x => x.Amount),
            TotalIncome = incomes.Sum(x => x.Amount)
        };

        // Task bazlı kırılım (maliyet boyutu — APYA-143)
        var taskKeys = expenses.Select(e => e.TaskId)
            .Concat(incomes.Select(i => i.TaskId))
            .Distinct()
            .ToList();

        var taskIds = taskKeys.Where(tk => tk.HasValue).Select(tk => tk!.Value).ToList();
        var tasks = taskIds.Any()
            ? await _taskRepository.GetListAsync(t => taskIds.Contains(t.Id))
            : new System.Collections.Generic.List<TaskItem>();

        foreach (var tk in taskKeys)
        {
            var taskName = tk.HasValue ? tasks.FirstOrDefault(t => t.Id == tk.Value)?.Title : null;
            dto.TaskBreakdown.Add(new ProjectFinanceTaskLineDto
            {
                TaskId   = tk,
                TaskName = taskName,
                Expense  = expenses.Where(e => e.TaskId == tk).Sum(e => e.Amount),
                Income   = incomes.Where(i => i.TaskId == tk).Sum(i => i.Amount)
            });
        }

        return dto;
    }
}
