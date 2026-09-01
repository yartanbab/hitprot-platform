using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Kur köprüsü. Okuma <c>Projects.ViewBudget</c>, yazma <c>Projects.Edit</c> —
/// bütçe tarafıyla aynı izinler, yeni izin açılmadı.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class ProjectFxAppService : ApplicationService, IProjectFxAppService
{
    private const int MaxRows = 300;

    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly FxLedgerStamper _stamper;

    public ProjectFxAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        FxLedgerStamper stamper)
    {
        _projectRepository = projectRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _cashAccountRepository = cashAccountRepository;
        _stamper = stamper;
    }

    /// <summary>Host bağlamında kiracı filtresini kapatır — bütçe servisiyle aynı davranış.</summary>
    private IDisposable? HostScope()
        => CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null;

    public async Task<ProjectFxPolicyDto> GetPolicyAsync(Guid projectId)
    {
        using var scope = HostScope();
        return MapPolicy(await _projectRepository.GetAsync(projectId));
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<ProjectFxPolicyDto> UpdatePolicyAsync(Guid projectId, UpdateProjectFxPolicyDto input)
    {
        using var scope = HostScope();

        var project = await _projectRepository.GetAsync(projectId);
        project.SetFxBridge(input.DonorCurrency, input.Policy, input.FixedDonorRate);
        await _projectRepository.UpdateAsync(project, autoSave: true);

        // Kayıtlar BİLEREK dokunulmadan bırakılır: politika değişimi geçmişi
        // kendiliğinden yeniden yazmaz. Kullanıcı önce etkilenen sayıyı görür
        // (GetBridgeAsync.LockedRecordCount), sonra açıkça RecalculateAsync der.
        return MapPolicy(project);
    }

    public async Task<ProjectFxBridgeDto> GetBridgeAsync(Guid projectId)
    {
        using var scope = HostScope();

        var project = await _projectRepository.GetAsync(projectId);
        var expenses = await _expenseRepository.GetListAsync(x => x.ProjectId == projectId);
        var incomes = await _incomeRepository.GetListAsync(x => x.ProjectId == projectId);

        var accountNames = new Dictionary<Guid, string>();
        var accounts = await _cashAccountRepository.GetListAsync();
        foreach (var a in accounts)
        {
            accountNames[a.Id] = $"{a.Name} ({a.Currency})";
        }

        var dto = new ProjectFxBridgeDto
        {
            Policy = MapPolicy(project),
            BookIncome = incomes.Sum(x => x.BookAmount),
            BookExpense = expenses.Sum(x => x.BookAmount),
            DonorIncome = incomes.Sum(x => x.DonorAmount ?? 0m),
            DonorExpense = expenses.Sum(x => x.DonorAmount ?? 0m),
            MissingDonorRateCount = project.DonorCurrency == null
                ? 0
                : expenses.Count(x => x.DonorAmount == null) + incomes.Count(x => x.DonorAmount == null),
            LockedRecordCount = expenses.Count(x => x.RateLocked) + incomes.Count(x => x.RateLocked)
        };

        // Kasa gerçeği: her para birimi KENDİ içinde toplanır, çapraz kur uygulanmaz.
        foreach (var g in incomes.GroupBy(x => x.Currency))
        {
            dto.NetByCurrency[g.Key] = dto.NetByCurrency.GetValueOrDefault(g.Key) + g.Sum(x => x.Amount);
        }
        foreach (var g in expenses.GroupBy(x => x.Currency))
        {
            dto.NetByCurrency[g.Key] = dto.NetByCurrency.GetValueOrDefault(g.Key) - g.Sum(x => x.Amount);
        }

        var rows = new List<FxReconciliationRowDto>();
        rows.AddRange(incomes.Select(x => new FxReconciliationRowDto
        {
            Date = x.IncomeDate,
            IsInflow = true,
            Title = x.Title,
            CashAccountName = x.CashAccountId.HasValue ? accountNames.GetValueOrDefault(x.CashAccountId.Value) : null,
            Currency = x.Currency,
            Amount = x.Amount,
            BookAmount = x.BookAmount,
            BookRate = x.BookRate,
            DonorAmount = x.DonorAmount,
            DonorRate = x.DonorRate,
            RateLocked = x.RateLocked
        }));
        rows.AddRange(expenses.Select(x => new FxReconciliationRowDto
        {
            Date = x.ExpenseDate,
            IsInflow = false,
            Title = x.Title,
            CashAccountName = accountNames.GetValueOrDefault(x.CashAccountId),
            Currency = x.Currency,
            Amount = x.Amount,
            BookAmount = x.BookAmount,
            BookRate = x.BookRate,
            DonorAmount = x.DonorAmount,
            DonorRate = x.DonorRate,
            RateLocked = x.RateLocked
        }));

        dto.Rows = rows.OrderByDescending(r => r.Date).Take(MaxRows).ToList();
        return dto;
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FxRecalculationResultDto> RecalculateAsync(Guid projectId)
    {
        using var scope = HostScope();

        var project = await _projectRepository.GetAsync(projectId);
        var result = new FxRecalculationResultDto();

        var expenses = await _expenseRepository.GetListAsync(x => x.ProjectId == projectId);
        foreach (var e in expenses)
        {
            var stamp = await _stamper.StampAsync(projectId, e.Currency, e.Amount, e.ExpenseDate);
            e.BookAmount = stamp.BookAmount;
            e.BookRate = stamp.BookRate;
            e.DonorAmount = stamp.DonorAmount;
            e.DonorRate = stamp.DonorRate;
            e.RateLocked = stamp.DonorAmount != null;
            await _expenseRepository.UpdateAsync(e);
            result.UpdatedExpenseCount++;
            if (project.DonorCurrency != null && stamp.DonorAmount == null) result.StillMissingRateCount++;
        }

        var incomes = await _incomeRepository.GetListAsync(x => x.ProjectId == projectId);
        foreach (var i in incomes)
        {
            var stamp = await _stamper.StampAsync(projectId, i.Currency, i.Amount, i.IncomeDate);
            i.BookAmount = stamp.BookAmount;
            i.BookRate = stamp.BookRate;
            i.DonorAmount = stamp.DonorAmount;
            i.DonorRate = stamp.DonorRate;
            i.RateLocked = stamp.DonorAmount != null;
            await _incomeRepository.UpdateAsync(i);
            result.UpdatedIncomeCount++;
            if (project.DonorCurrency != null && stamp.DonorAmount == null) result.StillMissingRateCount++;
        }

        return result;
    }

    private static ProjectFxPolicyDto MapPolicy(Project project) => new()
    {
        ProjectId = project.Id,
        ProjectCurrency = string.IsNullOrWhiteSpace(project.Currency) ? "TRY" : project.Currency,
        DonorCurrency = project.DonorCurrency,
        Policy = project.FxPolicy,
        FixedDonorRate = project.FixedDonorRate
    };
}
