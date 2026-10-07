using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CashMovements;
using Apya.Platform.Permissions;

namespace Apya.Platform.CashAccounts;

[Authorize(PlatformPermissions.CashAccounts.Default)]
public class CashAccountAppService :
    CrudAppService<
        CashAccount,
        CashAccountDto,
        Guid,
        GetCashAccountsInput,
        CreateUpdateCashAccountDto>,
    ICashAccountAppService
{
    private readonly IRepository<CashMovement, Guid> _movementRepository;

    public CashAccountAppService(
        IRepository<CashAccount, Guid> repository,
        IRepository<CashMovement, Guid> movementRepository)
        : base(repository)
    {
        _movementRepository = movementRepository;
        GetPolicyName = PlatformPermissions.CashAccounts.Default;
        GetListPolicyName = PlatformPermissions.CashAccounts.Default;
        CreatePolicyName = PlatformPermissions.CashAccounts.Create;
        UpdatePolicyName = PlatformPermissions.CashAccounts.Edit;
        DeletePolicyName = PlatformPermissions.CashAccounts.Delete;
    }

    /// <summary>
    /// Hareketi olan kasa silinmez. Hareketler (gider, gelir, fatura ödemesi ve transferin yazdıkları
    /// dahil) kasayı kimliğiyle gösterir ve kasayla birlikte SİLİNMEZ: kasa gidince mizan açılış
    /// bakiyesini düşürür ama hareketleri toplamaya devam eder, hareketler de hiçbir ekrandan
    /// okunamaz. Sessizce koparmak yerine reddet (emsal: <c>GrantCallAppService.DeleteByIdAsync</c>);
    /// hareketi olan kasa PASİFE alınır.
    /// </summary>
    protected override async Task DeleteByIdAsync(Guid id)
    {
        var movementCount = (int)await _movementRepository.CountAsync(m => m.CashAccountId == id);
        if (movementCount > 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.CashAccountInUse)
                .WithData("MovementCount", movementCount);
        }

        await base.DeleteByIdAsync(id);
    }

    protected override async Task<IQueryable<CashAccount>> CreateFilteredQueryAsync(GetCashAccountsInput input)
    {
        var query = await ReadOnlyRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var f = input.Filter.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(f) ||
                (x.Description != null && x.Description.ToLower().Contains(f)));
        }

        if (input.Type.HasValue)
        {
            query = query.Where(x => x.Type == input.Type.Value);
        }

        if (input.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == input.IsActive.Value);
        }

        return query;
    }

    protected override IQueryable<CashAccount> ApplyDefaultSorting(IQueryable<CashAccount> query)
    {
        return query.OrderBy(x => x.Name);
    }
}
