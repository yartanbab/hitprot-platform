using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
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
    public CustomerAppService(IRepository<Customer, Guid> repository)
        : base(repository)
    {
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
}
