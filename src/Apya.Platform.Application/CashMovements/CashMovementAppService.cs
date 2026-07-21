using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CashAccounts;
using Apya.Platform.Permissions;

namespace Apya.Platform.CashMovements;

[Authorize(PlatformPermissions.CashMovements.Default)]
public class CashMovementAppService :
    CrudAppService<
        CashMovement,
        CashMovementDto,
        Guid,
        GetCashMovementsInput,
        CreateUpdateCashMovementDto>,
    ICashMovementAppService
{
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly CashTransferManager _cashTransferManager;

    public CashMovementAppService(
        IRepository<CashMovement, Guid> repository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        CashTransferManager cashTransferManager)
        : base(repository)
    {
        _cashAccountRepository = cashAccountRepository;
        _cashTransferManager = cashTransferManager;
        GetPolicyName = PlatformPermissions.CashMovements.Default;
        GetListPolicyName = PlatformPermissions.CashMovements.Default;
        CreatePolicyName = PlatformPermissions.CashMovements.Create;
        UpdatePolicyName = PlatformPermissions.CashMovements.Edit;
        DeletePolicyName = PlatformPermissions.CashMovements.Delete;
    }

    protected override async Task<IQueryable<CashMovement>> CreateFilteredQueryAsync(GetCashMovementsInput input)
    {
        var query = await ReadOnlyRepository.GetQueryableAsync();

        if (input.CashAccountId.HasValue)
            query = query.Where(x => x.CashAccountId == input.CashAccountId.Value);

        if (input.Direction.HasValue)
            query = query.Where(x => x.Direction == input.Direction.Value);

        if (input.FromDate.HasValue)
            query = query.Where(x => x.MovementDate >= input.FromDate.Value);

        if (input.ToDate.HasValue)
            query = query.Where(x => x.MovementDate <= input.ToDate.Value);

        return query;
    }

    protected override IQueryable<CashMovement> ApplyDefaultSorting(IQueryable<CashMovement> query)
    {
        return query.OrderByDescending(x => x.MovementDate);
    }

    public override async Task<PagedResultDto<CashMovementDto>> GetListAsync(GetCashMovementsInput input)
    {
        var result = await base.GetListAsync(input);

        // CashAccountName'leri tek sorguda doldur (N+1 yok)
        var accountIds = result.Items.Select(x => x.CashAccountId).Distinct().ToList();
        if (accountIds.Count > 0)
        {
            var accounts = await _cashAccountRepository.GetListAsync(a => accountIds.Contains(a.Id));
            var nameMap = accounts.ToDictionary(a => a.Id, a => a.Name);
            foreach (var dto in result.Items)
            {
                if (nameMap.TryGetValue(dto.CashAccountId, out var name))
                    dto.CashAccountName = name;
            }
        }

        return result;
    }

    public async Task<CashAccountBalanceDto> GetBalanceAsync(Guid cashAccountId)
    {
        var account = await _cashAccountRepository.GetAsync(cashAccountId);

        var query = await ReadOnlyRepository.GetQueryableAsync();
        var movements = query.Where(x => x.CashAccountId == cashAccountId);

        var totalIn = await AsyncExecuter.SumAsync(
            movements.Where(x => x.Direction == CashMovementDirection.In), x => (decimal?)x.Amount) ?? 0m;
        var totalOut = await AsyncExecuter.SumAsync(
            movements.Where(x => x.Direction == CashMovementDirection.Out), x => (decimal?)x.Amount) ?? 0m;

        return new CashAccountBalanceDto
        {
            CashAccountId = account.Id,
            CashAccountName = account.Name,
            Currency = account.Currency,
            OpeningBalance = account.OpeningBalance,
            TotalIn = totalIn,
            TotalOut = totalOut,
            CurrentBalance = account.OpeningBalance + totalIn - totalOut
        };
    }

    [Authorize(PlatformPermissions.CashMovements.Create)]
    public async Task<CashTransferResultDto> TransferAsync(CreateCashTransferDto input)
    {
        var result = await _cashTransferManager.TransferAsync(
            input.FromCashAccountId,
            input.ToCashAccountId,
            input.Amount,
            input.TransferDate ?? Clock.Now,
            input.Description);

        return new CashTransferResultDto
        {
            OutMovement = ObjectMapper.Map<CashMovement, CashMovementDto>(result.OutMovement),
            InMovement = ObjectMapper.Map<CashMovement, CashMovementDto>(result.InMovement),
            ConvertedAmount = result.ConvertedAmount,
            RateApplied = result.RateApplied
        };
    }
}
