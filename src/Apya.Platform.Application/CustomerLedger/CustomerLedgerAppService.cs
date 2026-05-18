using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Customers;
using Apya.Platform.Permissions;

namespace Apya.Platform.CustomerLedger;

[Authorize(PlatformPermissions.Customers.Default)]
public class CustomerLedgerAppService : ApplicationService, ICustomerLedgerAppService
{
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepository;
    private readonly IRepository<Customer, Guid> _customerRepository;

    public CustomerLedgerAppService(
        IRepository<CustomerLedgerEntry, Guid> ledgerRepository,
        IRepository<Customer, Guid> customerRepository)
    {
        _ledgerRepository = ledgerRepository;
        _customerRepository = customerRepository;
    }

    public async Task<CustomerStatementDto> GetStatementAsync(
        Guid customerId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var customer = await _customerRepository.GetAsync(customerId);

        var query = await _ledgerRepository.GetQueryableAsync();
        var entries = query.Where(x => x.CustomerId == customerId);
        if (fromDate.HasValue)
            entries = entries.Where(x => x.EntryDate >= fromDate.Value);
        if (toDate.HasValue)
            entries = entries.Where(x => x.EntryDate <= toDate.Value);

        var list = (await AsyncExecuter.ToListAsync(entries))
            .OrderBy(x => x.EntryDate).ThenBy(x => x.CreationTime)
            .ToList();

        var dto = new CustomerStatementDto
        {
            CustomerId = customer.Id,
            CustomerName = customer.Name
        };

        decimal running = 0m;
        foreach (var e in list)
        {
            running += e.SignedAmount;
            dto.Lines.Add(new CustomerStatementLineDto
            {
                Id = e.Id,
                EntryDate = e.EntryDate,
                Source = e.Source,
                Description = e.Description,
                Currency = e.Currency,
                Debit = e.Direction == CustomerLedgerDirection.Debit ? e.Amount : 0m,
                Credit = e.Direction == CustomerLedgerDirection.Credit ? e.Amount : 0m,
                RunningBalance = running
            });
        }

        dto.TotalDebit = dto.Lines.Sum(l => l.Debit);
        dto.TotalCredit = dto.Lines.Sum(l => l.Credit);
        dto.Balance = running;
        return dto;
    }

    public async Task<decimal> GetBalanceAsync(Guid customerId)
    {
        var query = await _ledgerRepository.GetQueryableAsync();
        var debit = await AsyncExecuter.SumAsync(
            query.Where(x => x.CustomerId == customerId && x.Direction == CustomerLedgerDirection.Debit),
            x => (decimal?)x.Amount) ?? 0m;
        var credit = await AsyncExecuter.SumAsync(
            query.Where(x => x.CustomerId == customerId && x.Direction == CustomerLedgerDirection.Credit),
            x => (decimal?)x.Amount) ?? 0m;
        return debit - credit;
    }
}
