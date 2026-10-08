using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

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
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public CustomerAppService(
        IRepository<Customer, Guid> repository,
        IRepository<CustomerLedgerEntry, Guid> ledgerRepository,
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IRepository<Project, Guid> projectRepository)
        : base(repository)
    {
        _ledgerRepository = ledgerRepository;
        _invoiceRepository = invoiceRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _projectRepository = projectRepository;
        GetPolicyName = PlatformPermissions.Customers.Default;
        GetListPolicyName = PlatformPermissions.Customers.Default;
        CreatePolicyName = PlatformPermissions.Customers.Create;
        UpdatePolicyName = PlatformPermissions.Customers.Edit;
        DeletePolicyName = PlatformPermissions.Customers.Delete;
    }

    /// <summary>
    /// Kaydı olan cari silinmez. Fatura, cari hareket, gider, gelir ve proje cariyi kimliğiyle
    /// gösterir ve cariyle birlikte SİLİNMEZ: cari gidince bu kayıtlar carisiz görünür, cari
    /// hareketleri mizanda kalır ama tutarın kime ait olduğu hiçbir ekrandan okunamaz. Sessizce
    /// koparmak yerine reddet (emsal: <c>GrantCallAppService.DeleteByIdAsync</c>); kaydı olan cari
    /// PASİFE alınır.
    /// </summary>
    protected override async Task DeleteByIdAsync(Guid id)
    {
        if (await _ledgerRepository.AnyAsync(l => l.CustomerId == id)
            || await _invoiceRepository.AnyAsync(i => i.CustomerId == id)
            || await _expenseRepository.AnyAsync(e => e.CustomerId == id)
            || await _incomeRepository.AnyAsync(i => i.CustomerId == id)
            || await _projectRepository.AnyAsync(p => p.CustomerId == id))
        {
            throw new BusinessException(PlatformDomainErrorCodes.CustomerInUse);
        }

        await base.DeleteByIdAsync(id);
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
