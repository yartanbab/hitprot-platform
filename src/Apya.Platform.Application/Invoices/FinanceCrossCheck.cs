using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Expenses;

namespace Apya.Platform.Invoices;

/// <summary>
/// FIN-05 · Alış faturası ↔ gider eşleşmesi (ürün kararı, 2026-10-13). İki kayıt arasında bağ
/// TUTULMAZ; karşılık şu ölçütlerle ARANIR: aynı proje, aynı para birimi, aynı tutar, tarih
/// ±<see cref="DateWindowDays"/> gün. İki tarafta da bütçe kalemi varsa kalem de aynı olmalıdır.
/// Kural iki yönde de aynıdır ve yalnız burada yaşar.
/// </summary>
public class FinanceCrossCheck : ITransientDependency
{
    public const int DateWindowDays = 30;

    /// <summary>Fatura toplamı vergi çarpımından gelir; kuruş altı fark eşleşmeyi bozmamalı.</summary>
    private const decimal AmountTolerance = 0.005m;

    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;

    public FinanceCrossCheck(
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Expense, Guid> expenseRepository)
    {
        _invoiceRepository = invoiceRepository;
        _expenseRepository = expenseRepository;
    }

    public async Task<bool> InvoiceLacksExpenseAsync(Invoice invoice)
    {
        if (invoice.Direction != InvoiceDirection.Purchase)
        {
            return false;
        }

        var projectId = invoice.ProjectId;
        var currency = invoice.Currency;
        var min = invoice.TotalAmount - AmountTolerance;
        var max = invoice.TotalAmount + AmountTolerance;
        var from = invoice.InvoiceDate.Date.AddDays(-DateWindowDays);
        var to = invoice.InvoiceDate.Date.AddDays(DateWindowDays + 1);
        var lineId = invoice.BudgetLineId;

        return !await _expenseRepository.AnyAsync(e =>
            e.ProjectId == projectId
            && e.Currency == currency
            && e.Amount >= min && e.Amount <= max
            && e.ExpenseDate >= from && e.ExpenseDate < to
            && (lineId == null || e.BudgetLineId == null || e.BudgetLineId == lineId));
    }

    public async Task<bool> ExpenseLacksInvoiceAsync(Expense expense)
    {
        if (expense.ProjectId == null)
        {
            return false;
        }

        var projectId = expense.ProjectId.Value;
        var currency = expense.Currency;
        var min = expense.Amount - AmountTolerance;
        var max = expense.Amount + AmountTolerance;
        var from = expense.ExpenseDate.Date.AddDays(-DateWindowDays);
        var to = expense.ExpenseDate.Date.AddDays(DateWindowDays + 1);
        var lineId = expense.BudgetLineId;

        return !await _invoiceRepository.AnyAsync(i =>
            i.Direction == InvoiceDirection.Purchase
            && i.ProjectId == projectId
            && i.Currency == currency
            && i.TotalAmount >= min && i.TotalAmount <= max
            && i.InvoiceDate >= from && i.InvoiceDate < to
            && (lineId == null || i.BudgetLineId == null || i.BudgetLineId == lineId));
    }
}
