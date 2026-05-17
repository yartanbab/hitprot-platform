using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
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
    public CashAccountAppService(IRepository<CashAccount, Guid> repository)
        : base(repository)
    {
        GetPolicyName = PlatformPermissions.CashAccounts.Default;
        GetListPolicyName = PlatformPermissions.CashAccounts.Default;
        CreatePolicyName = PlatformPermissions.CashAccounts.Create;
        UpdatePolicyName = PlatformPermissions.CashAccounts.Edit;
        DeletePolicyName = PlatformPermissions.CashAccounts.Delete;
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
