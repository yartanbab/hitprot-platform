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

namespace Apya.Platform.ProjectFinance;

[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectFinanceAppService : ApplicationService, IProjectFinanceAppService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;

    public ProjectFinanceAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository)
    {
        _projectRepository = projectRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
    }

    public async Task<ProjectFinanceSummaryDto> GetSummaryAsync(Guid projectId)
    {
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
            .Distinct();
        foreach (var tk in taskKeys)
        {
            dto.TaskBreakdown.Add(new ProjectFinanceTaskLineDto
            {
                TaskId = tk,
                Expense = expenses.Where(e => e.TaskId == tk).Sum(e => e.Amount),
                Income = incomes.Where(i => i.TaskId == tk).Sum(i => i.Amount)
            });
        }

        return dto;
    }
}
