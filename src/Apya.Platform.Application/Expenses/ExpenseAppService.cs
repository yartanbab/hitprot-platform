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

namespace Apya.Platform.Expenses;

[Authorize(PlatformPermissions.Expenses.Default)]
public class ExpenseAppService :
    CrudAppService<
        Expense,
        ExpenseDto,
        Guid,
        GetExpensesInput,
        CreateUpdateExpenseDto>,
    IExpenseAppService
{
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;

    public ExpenseAppService(
        IRepository<Expense, Guid> repository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<CashAccount, Guid> cashAccountRepository)
        : base(repository)
    {
        _cashMovementRepository = cashMovementRepository;
        _cashAccountRepository = cashAccountRepository;
        GetPolicyName = PlatformPermissions.Expenses.Default;
        GetListPolicyName = PlatformPermissions.Expenses.Default;
        CreatePolicyName = PlatformPermissions.Expenses.Create;
        UpdatePolicyName = PlatformPermissions.Expenses.Edit;
        DeletePolicyName = PlatformPermissions.Expenses.Delete;
    }

    protected override async Task<IQueryable<Expense>> CreateFilteredQueryAsync(GetExpensesInput input)
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
            query = query.Where(x => x.ExpenseDate >= input.FromDate.Value);
        if (input.ToDate.HasValue)
            query = query.Where(x => x.ExpenseDate <= input.ToDate.Value);

        return query;
    }

    protected override IQueryable<Expense> ApplyDefaultSorting(IQueryable<Expense> query)
    {
        return query.OrderByDescending(x => x.ExpenseDate);
    }

    public override async Task<ExpenseDto> CreateAsync(CreateUpdateExpenseDto input)
    {
        var dto = await base.CreateAsync(input);

        // Otomatik kasa çıkış hareketi
        await _cashMovementRepository.InsertAsync(new CashMovement(
            GuidGenerator.Create(),
            input.CashAccountId,
            CashMovementDirection.Out,
            input.Amount,
            input.ExpenseDate,
            "Gider: " + input.Title,
            CashMovementSource.Expense,
            dto.Id,
            CurrentTenant.Id), autoSave: true);

        return dto;
    }

    public override async Task<ExpenseDto> UpdateAsync(Guid id, CreateUpdateExpenseDto input)
    {
        var dto = await base.UpdateAsync(id, input);

        // Bağlı kasa hareketini senkronla
        var linked = await _cashMovementRepository.FirstOrDefaultAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Expense);
        if (linked != null)
        {
            linked.CashAccountId = input.CashAccountId;
            linked.SetAmount(input.Amount);
            linked.MovementDate = input.ExpenseDate;
            linked.Description = "Gider: " + input.Title;
            await _cashMovementRepository.UpdateAsync(linked, autoSave: true);
        }

        return dto;
    }

    public override async Task DeleteAsync(Guid id)
    {
        var linked = await _cashMovementRepository.GetListAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Expense);
        foreach (var m in linked)
            await _cashMovementRepository.DeleteAsync(m);

        await base.DeleteAsync(id);
    }

    public override async Task<PagedResultDto<ExpenseDto>> GetListAsync(GetExpensesInput input)
    {
        var result = await base.GetListAsync(input);

        var accountIds = result.Items.Select(x => x.CashAccountId).Distinct().ToList();
        if (accountIds.Count > 0)
        {
            var accounts = await _cashAccountRepository.GetListAsync(a => accountIds.Contains(a.Id));
            var nameMap = accounts.ToDictionary(a => a.Id, a => a.Name);
            foreach (var dto in result.Items)
                if (nameMap.TryGetValue(dto.CashAccountId, out var name))
                    dto.CashAccountName = name;
        }

        return result;
    }
}
