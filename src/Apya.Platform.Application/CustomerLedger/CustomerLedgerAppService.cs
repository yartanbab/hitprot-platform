using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Customers;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;

namespace Apya.Platform.CustomerLedger;

[Authorize(PlatformPermissions.Customers.Default)]
public class CustomerLedgerAppService : ApplicationService, ICustomerLedgerAppService
{
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepository;
    private readonly IRepository<Customer, Guid> _customerRepository;
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Payment, Guid> _paymentRepository;

    public CustomerLedgerAppService(
        IRepository<CustomerLedgerEntry, Guid> ledgerRepository,
        IRepository<Customer, Guid> customerRepository,
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Payment, Guid> paymentRepository)
    {
        _ledgerRepository = ledgerRepository;
        _customerRepository = customerRepository;
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<CustomerStatementDto> GetStatementAsync(
        Guid customerId, DateTime? fromDate = null, DateTime? toDate = null, string? currency = null)
    {
        var customer = await _customerRepository.GetAsync(customerId);

        var query = await _ledgerRepository.GetQueryableAsync();
        var entries = query.Where(x => x.CustomerId == customerId);
        if (fromDate.HasValue)
            entries = entries.Where(x => x.EntryDate >= fromDate.Value);
        if (toDate.HasValue)
            entries = entries.Where(x => x.EntryDate <= toDate.Value);
        if (!string.IsNullOrWhiteSpace(currency))
            entries = entries.Where(x => x.Currency == currency);

        var list = (await AsyncExecuter.ToListAsync(entries))
            .OrderBy(x => x.EntryDate).ThenBy(x => x.CreationTime)
            .ToList();

        // Belge no çözümü — Invoice kaynaklı satırlar doğrudan ReferenceId=Invoice.Id;
        // Payment kaynaklı satırlar ReferenceId=Payment.Id (ReferenceNumber varsa o,
        // yoksa ilişkili faturanın numarası fallback). Batch (N+1 yok).
        var invoiceSourceIds = list
            .Where(e => e.Source == CustomerLedgerSource.Invoice && e.ReferenceId.HasValue)
            .Select(e => e.ReferenceId!.Value)
            .Distinct()
            .ToList();
        var paymentSourceIds = list
            .Where(e => e.Source == CustomerLedgerSource.Payment && e.ReferenceId.HasValue)
            .Select(e => e.ReferenceId!.Value)
            .Distinct()
            .ToList();

        var paymentsById = paymentSourceIds.Count > 0
            ? (await _paymentRepository.GetListAsync(p => paymentSourceIds.Contains(p.Id)))
                .ToDictionary(p => p.Id)
            : new Dictionary<Guid, Payment>();

        var invoiceIdsNeeded = invoiceSourceIds
            .Concat(paymentsById.Values.Select(p => p.InvoiceId))
            .Distinct()
            .ToList();

        var invoiceNumbersById = invoiceIdsNeeded.Count > 0
            ? (await _invoiceRepository.GetListAsync(i => invoiceIdsNeeded.Contains(i.Id)))
                .ToDictionary(i => i.Id, i => i.InvoiceNumber)
            : new Dictionary<Guid, string>();

        var dto = new CustomerStatementDto
        {
            CustomerId = customer.Id,
            CustomerName = customer.Name
        };

        decimal running = 0m;
        foreach (var e in list)
        {
            running += e.SignedAmount;

            string? documentNumber = null;
            if (e.Source == CustomerLedgerSource.Invoice && e.ReferenceId.HasValue)
            {
                invoiceNumbersById.TryGetValue(e.ReferenceId.Value, out documentNumber);
            }
            else if (e.Source == CustomerLedgerSource.Payment && e.ReferenceId.HasValue
                     && paymentsById.TryGetValue(e.ReferenceId.Value, out var payment))
            {
                documentNumber = !string.IsNullOrWhiteSpace(payment.ReferenceNumber)
                    ? payment.ReferenceNumber
                    : invoiceNumbersById.GetValueOrDefault(payment.InvoiceId);
            }

            dto.Lines.Add(new CustomerStatementLineDto
            {
                Id = e.Id,
                EntryDate = e.EntryDate,
                Source = e.Source,
                Description = e.Description,
                Currency = e.Currency,
                Debit = e.Direction == CustomerLedgerDirection.Debit ? e.Amount : 0m,
                Credit = e.Direction == CustomerLedgerDirection.Credit ? e.Amount : 0m,
                RunningBalance = running,
                DocumentNumber = documentNumber
            });
        }

        dto.TotalDebit = dto.Lines.Sum(l => l.Debit);
        dto.TotalCredit = dto.Lines.Sum(l => l.Credit);
        dto.Balance = running;
        dto.OverdueAmount = await CalculateOverdueAmountAsync(customerId, currency);
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

    /// <summary>
    /// Vadesi bugün itibarıyla geçmiş, tam tahsil edilmemiş satış faturası tutarı.
    /// Invoice.Status'a değil doğrudan (TotalAmount - ödenen) farkına bakar; çünkü Status
    /// yalnız ilk ödeme kaydında Sent/Paid'e geçiyor — hiç ödeme almamış (hâlâ Draft)
    /// vadesi geçmiş bir fatura Status filtresiyle atlanırdı.
    /// </summary>
    private async Task<decimal> CalculateOverdueAmountAsync(Guid customerId, string? currency)
    {
        var invoiceQuery = await _invoiceRepository.GetQueryableAsync();
        var candidates = invoiceQuery.Where(x =>
            x.CustomerId == customerId &&
            x.Direction == InvoiceDirection.Sales &&
            x.Status != InvoiceStatus.Cancelled &&
            x.DueDate < Clock.Now);
        if (!string.IsNullOrWhiteSpace(currency))
            candidates = candidates.Where(x => x.Currency == currency);

        var overdueInvoices = await AsyncExecuter.ToListAsync(candidates);
        if (overdueInvoices.Count == 0)
            return 0m;

        var overdueInvoiceIds = overdueInvoices.Select(x => x.Id).ToList();
        var paymentQuery = await _paymentRepository.GetQueryableAsync();
        var paidByInvoice = (await AsyncExecuter.ToListAsync(
                paymentQuery.Where(p => overdueInvoiceIds.Contains(p.InvoiceId))))
            .GroupBy(p => p.InvoiceId)
            .ToDictionary(g => g.Key, g => g.Sum(p => p.Amount));

        return overdueInvoices.Sum(inv =>
            Math.Max(0m, inv.TotalAmount - paidByInvoice.GetValueOrDefault(inv.Id)));
    }
}
