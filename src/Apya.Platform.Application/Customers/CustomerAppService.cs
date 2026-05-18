using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Permissions;

namespace Apya.Platform.Customers;

[Authorize(PlatformPermissions.Customers.Default)]
public class CustomerAppService :
    CrudAppService<
        Customer,
        CustomerDto,
        Guid,
        GetCustomersInput,
        CreateUpdateCustomerDto>,
    ICustomerAppService
{
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepository;

    public CustomerAppService(
        IRepository<Customer, Guid> repository,
        IRepository<CustomerLedgerEntry, Guid> ledgerRepository)
        : base(repository)
    {
        _ledgerRepository = ledgerRepository;
        GetPolicyName = PlatformPermissions.Customers.Default;
        GetListPolicyName = PlatformPermissions.Customers.Default;
        CreatePolicyName = PlatformPermissions.Customers.Create;
        UpdatePolicyName = PlatformPermissions.Customers.Edit;
        DeletePolicyName = PlatformPermissions.Customers.Delete;
    }

    protected override async Task<IQueryable<Customer>> CreateFilteredQueryAsync(GetCustomersInput input)
    {
        var query = await ReadOnlyRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            // case-insensitive contains; EF Core translates ToLower() into SQL LOWER()
            var f = input.Filter.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(f) ||
                (x.TaxNumber != null && x.TaxNumber.ToLower().Contains(f)) ||
                (x.Email != null && x.Email.ToLower().Contains(f)) ||
                (x.Phone != null && x.Phone.ToLower().Contains(f)));
        }

        if (input.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == input.IsActive.Value);
        }

        return query;
    }

    protected override IQueryable<Customer> ApplyDefaultSorting(IQueryable<Customer> query)
    {
        return query.OrderBy(x => x.Name);
    }

    // APYA-142e: Liste sayfasında cari bakiye kolonu (N+1'siz — sayfa müşterileri için tek grup sorgu)
    public override async Task<PagedResultDto<CustomerDto>> GetListAsync(GetCustomersInput input)
    {
        var result = await base.GetListAsync(input);

        var ids = result.Items.Select(x => x.Id).ToList();
        if (ids.Count > 0)
        {
            var ledgerQuery = await _ledgerRepository.GetQueryableAsync();
            var sums = await AsyncExecuter.ToListAsync(
                ledgerQuery.Where(l => ids.Contains(l.CustomerId))
                    .GroupBy(l => l.CustomerId)
                    .Select(g => new
                    {
                        CustomerId = g.Key,
                        Debit = g.Where(x => x.Direction == CustomerLedgerDirection.Debit).Sum(x => (decimal?)x.Amount) ?? 0m,
                        Credit = g.Where(x => x.Direction == CustomerLedgerDirection.Credit).Sum(x => (decimal?)x.Amount) ?? 0m
                    }));
            var map = sums.ToDictionary(s => s.CustomerId, s => s.Debit - s.Credit);
            foreach (var dto in result.Items)
                dto.Balance = map.TryGetValue(dto.Id, out var bal) ? bal : 0m;
        }

        return result;
    }
}
