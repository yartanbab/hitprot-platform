using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Incomes;

[Authorize(PlatformPermissions.Incomes.Default)]
public class IncomeEntryAppService :
    CrudAppService<
        IncomeEntry,
        IncomeEntryDto,
        Guid,
        GetIncomeEntriesInput,
        CreateUpdateIncomeEntryDto>,
    IIncomeEntryAppService
{
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ProjectBudgetManager _budgetManager;
    private readonly FxLedgerStamper _fxStamper;

    public IncomeEntryAppService(
        IRepository<IncomeEntry, Guid> repository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        ProjectBudgetManager budgetManager,
        FxLedgerStamper fxStamper)
        : base(repository)
    {
        _cashMovementRepository = cashMovementRepository;
        _cashAccountRepository = cashAccountRepository;
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _budgetManager = budgetManager;
        _fxStamper = fxStamper;
        GetPolicyName = PlatformPermissions.Incomes.Default;
        GetListPolicyName = PlatformPermissions.Incomes.Default;
        CreatePolicyName = PlatformPermissions.Incomes.Create;
        UpdatePolicyName = PlatformPermissions.Incomes.Edit;
        DeletePolicyName = PlatformPermissions.Incomes.Delete;
    }

    protected override async Task<IQueryable<IncomeEntry>> CreateFilteredQueryAsync(GetIncomeEntriesInput input)
    {
        var query = await ReadOnlyRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var f = input.Filter.Trim().ToLower();
            query = query.Where(x => x.Title.ToLower().Contains(f)
                || (x.Description != null && x.Description.ToLower().Contains(f)));
        }
        if (input.Category.HasValue)
            query = query.Where(x => x.Category == input.Category.Value);
        if (input.CashAccountId.HasValue)
            query = query.Where(x => x.CashAccountId == input.CashAccountId.Value);
        if (input.ProjectId.HasValue)
            query = query.Where(x => x.ProjectId == input.ProjectId.Value);
        if (input.TaskId.HasValue)
            query = query.Where(x => x.TaskId == input.TaskId.Value);
        if (input.CustomerId.HasValue)
            query = query.Where(x => x.CustomerId == input.CustomerId.Value);
        if (input.FromDate.HasValue)
            query = query.Where(x => x.IncomeDate >= input.FromDate.Value);
        if (input.ToDate.HasValue)
            query = query.Where(x => x.IncomeDate <= input.ToDate.Value);

        return query;
    }

    protected override IQueryable<IncomeEntry> ApplyDefaultSorting(IQueryable<IncomeEntry> query)
        => query.OrderByDescending(x => x.IncomeDate);

    /* --- ÜÇ DEFTER DAMGASI — gerekçe ExpenseAppService'teki notla aynı --- */

    protected override async Task<IncomeEntry> MapToEntityAsync(CreateUpdateIncomeEntryDto createInput)
    {
        var entity = await base.MapToEntityAsync(createInput);
        // Kapsam kuralı damgadan önce — gerekçe ExpenseAppService'teki notta.
        await ApplyScopeRuleAsync(entity);
        await ApplyFxStampAsync(entity);
        return entity;
    }

    protected override async Task MapToEntityAsync(CreateUpdateIncomeEntryDto updateInput, IncomeEntry entity)
    {
        await base.MapToEntityAsync(updateInput, entity);
        await ApplyScopeRuleAsync(entity);
        await ApplyFxStampAsync(entity);
    }

    /* Kapsam tutarlılığı (PR-3a) — gerekçe ExpenseAppService'teki notla aynı:
       TaskId doluysa ProjectId görevden türetilir, istemci değeri yok sayılır. */
    private async Task ApplyScopeRuleAsync(IncomeEntry entity)
    {
        if (entity.TaskId.HasValue)
        {
            var task = await _taskRepository.GetAsync(entity.TaskId.Value); // tenant süzgeçli
            entity.ProjectId = task.ProjectId;
        }
    }

    private async Task ApplyFxStampAsync(IncomeEntry entity)
    {
        // entity.ProjectId: kapsam kuralı projeyi türetmiş olabilir.
        var stamp = await _fxStamper.StampAsync(entity.ProjectId, entity.Currency, entity.Amount, entity.IncomeDate);
        entity.BookAmount = stamp.BookAmount;
        entity.BookRate = stamp.BookRate;
        entity.DonorAmount = stamp.DonorAmount;
        entity.DonorRate = stamp.DonorRate;
        entity.RateLocked = stamp.DonorAmount != null;
    }

    /// <summary>Kalem doğrulaması türetilmiş projeye göre — bkz. ExpenseAppService.</summary>
    private async Task<Guid?> ResolveEffectiveProjectIdAsync(CreateUpdateIncomeEntryDto input)
        => input.TaskId.HasValue
            ? (await _taskRepository.GetAsync(input.TaskId.Value)).ProjectId
            : input.ProjectId;

    public override async Task<IncomeEntryDto> CreateAsync(CreateUpdateIncomeEntryDto input)
    {
        // Giderdeki ile aynı koşullu kural; bkz. ExpenseAppService.
        await _budgetManager.EnsureBudgetLineIsValidAsync(
            await ResolveEffectiveProjectIdAsync(input), input.BudgetLineId);

        var dto = await base.CreateAsync(input);

        if (input.CashAccountId.HasValue)
        {
            await _cashMovementRepository.InsertAsync(new CashMovement(
                GuidGenerator.Create(),
                input.CashAccountId.Value,
                CashMovementDirection.In,
                input.Amount,
                input.IncomeDate,
                "Gelir: " + input.Title,
                CashMovementSource.Income,
                dto.Id,
                CurrentTenant.Id), autoSave: true);
        }

        return dto;
    }

    public override async Task<IncomeEntryDto> UpdateAsync(Guid id, CreateUpdateIncomeEntryDto input)
    {
        await _budgetManager.EnsureBudgetLineIsValidAsync(
            await ResolveEffectiveProjectIdAsync(input), input.BudgetLineId);

        var dto = await base.UpdateAsync(id, input);

        var linked = await _cashMovementRepository.FirstOrDefaultAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Income);

        if (input.CashAccountId.HasValue)
        {
            if (linked == null)
            {
                await _cashMovementRepository.InsertAsync(new CashMovement(
                    GuidGenerator.Create(), input.CashAccountId.Value, CashMovementDirection.In,
                    input.Amount, input.IncomeDate, "Gelir: " + input.Title,
                    CashMovementSource.Income, id, CurrentTenant.Id), autoSave: true);
            }
            else
            {
                linked.CashAccountId = input.CashAccountId.Value;
                linked.SetAmount(input.Amount);
                linked.MovementDate = input.IncomeDate;
                linked.Description = "Gelir: " + input.Title;
                await _cashMovementRepository.UpdateAsync(linked, autoSave: true);
            }
        }
        else if (linked != null)
        {
            await _cashMovementRepository.DeleteAsync(linked);
        }

        return dto;
    }

    public override async Task DeleteAsync(Guid id)
    {
        var linked = await _cashMovementRepository.GetListAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Income);
        foreach (var m in linked)
            await _cashMovementRepository.DeleteAsync(m);

        await base.DeleteAsync(id);
    }

    /// <summary>"İlişkiyi değiştir…" — gerekçe ve kurallar ExpenseAppService
    /// .SetScopeAsync ile aynı (granüler uç, çifte yetki, otomatik audit).</summary>
    public async Task<IncomeEntryDto> SetScopeAsync(Guid id, SetIncomeScopeDto input)
    {
        await CheckPolicyAsync(PlatformPermissions.Incomes.Edit);
        await CheckPolicyAsync(PlatformPermissions.Tasks.Edit);

        var income = await Repository.GetAsync(id);
        var oldProjectId = income.ProjectId;

        if (input.TaskId.HasValue)
        {
            var task = await _taskRepository.GetAsync(input.TaskId.Value);
            income.TaskId = task.Id;
            income.ProjectId = task.ProjectId; // türetilir
        }
        else if (input.ProjectId.HasValue)
        {
            await _projectRepository.GetAsync(input.ProjectId.Value);
            income.TaskId = null;
            income.ProjectId = input.ProjectId;
        }
        else
        {
            income.TaskId = null;
            income.ProjectId = null; // bağımsız
        }

        if (income.ProjectId != oldProjectId)
        {
            income.BudgetLineId = null;          // kalem projeye özgü
            await ApplyFxStampAsync(income);     // donör defteri yeni projeye göre
        }

        await Repository.UpdateAsync(income, autoSave: true);
        return await MapToGetOutputDtoAsync(income);
    }

    public override async Task<PagedResultDto<IncomeEntryDto>> GetListAsync(GetIncomeEntriesInput input)
    {
        var result = await base.GetListAsync(input);

        var accountIds = result.Items
            .Where(x => x.CashAccountId.HasValue)
            .Select(x => x.CashAccountId!.Value).Distinct().ToList();
        if (accountIds.Count > 0)
        {
            var accounts = await _cashAccountRepository.GetListAsync(a => accountIds.Contains(a.Id));
            var nameMap = accounts.ToDictionary(a => a.Id, a => a.Name);
            foreach (var dto in result.Items)
                if (dto.CashAccountId.HasValue && nameMap.TryGetValue(dto.CashAccountId.Value, out var name))
                    dto.CashAccountName = name;
        }

        return result;
    }
}
