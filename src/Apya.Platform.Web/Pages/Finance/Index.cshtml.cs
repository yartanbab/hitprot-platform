using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Faz 2 — "Para Hareketleri" hub'ı. Gelir + Gider + Fatura kayıtlarını tek
/// listede birleştirir (sunucu-render, salt-okunur). Her kaynak kendi app
/// service'i üzerinden çekilir (yetki/tenant filtresi korunur); kullanıcının
/// yetkisi olmayan kaynak sessizce atlanır.
/// </summary>
public class IndexModel : AbpPageModel
{
    private const int MaxPerSource = 100;

    private readonly IExpenseAppService _expenseAppService;
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly IInvoiceAppService _invoiceAppService;

    public List<TransactionRow> Transactions { get; private set; } = new();
    public List<CurrencySummary> Summaries { get; private set; } = new();

    public IndexModel(
        IExpenseAppService expenseAppService,
        IIncomeEntryAppService incomeAppService,
        IInvoiceAppService invoiceAppService)
    {
        _expenseAppService = expenseAppService;
        _incomeAppService = incomeAppService;
        _invoiceAppService = invoiceAppService;
    }

    public async Task OnGetAsync()
    {
        var projects = await SafeLookupAsync(async () =>
            (await _invoiceAppService.GetProjectLookupAsync()).Items.ToDictionary(x => x.Id, x => x.Name));
        var customers = await SafeLookupAsync(async () =>
            (await _invoiceAppService.GetCustomerLookupAsync()).Items.ToDictionary(x => x.Id, x => x.Name));

        var rows = new List<TransactionRow>();

        await TryAddAsync(async () =>
        {
            var page = await _incomeAppService.GetListAsync(new GetIncomeEntriesInput { MaxResultCount = MaxPerSource });
            foreach (var x in page.Items)
            {
                rows.Add(new TransactionRow
                {
                    Type = TxType.Income,
                    IsInflow = true,
                    Date = x.IncomeDate,
                    Title = x.Title,
                    Amount = x.Amount,
                    Currency = x.Currency,
                    ProjectName = NameOf(projects, x.ProjectId),
                    CustomerName = NameOf(customers, x.CustomerId),
                    Description = x.Description,
                    Url = "/Incomes"
                });
            }
        });

        await TryAddAsync(async () =>
        {
            var page = await _expenseAppService.GetListAsync(new GetExpensesInput { MaxResultCount = MaxPerSource });
            foreach (var x in page.Items)
            {
                rows.Add(new TransactionRow
                {
                    Type = TxType.Expense,
                    IsInflow = false,
                    Date = x.ExpenseDate,
                    Title = x.Title,
                    Amount = x.Amount,
                    Currency = x.Currency,
                    ProjectName = NameOf(projects, x.ProjectId),
                    CustomerName = NameOf(customers, x.CustomerId),
                    Description = x.Description,
                    Url = "/Expenses"
                });
            }
        });

        await TryAddAsync(async () =>
        {
            var page = await _invoiceAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = MaxPerSource });
            foreach (var x in page.Items)
            {
                rows.Add(new TransactionRow
                {
                    Type = TxType.Invoice,
                    IsInflow = x.Direction == InvoiceDirection.Sales,
                    Date = x.InvoiceDate,
                    Title = string.IsNullOrWhiteSpace(x.InvoiceNumber) ? x.ProjectName : x.InvoiceNumber,
                    Amount = x.TotalAmount,
                    Currency = x.Currency,
                    ProjectName = x.ProjectName,
                    CustomerName = x.CustomerName,
                    Description = x.Notes,
                    Url = "/Invoices"
                });
            }
        });

        Transactions = rows.OrderByDescending(r => r.Date).ToList();

        // Çoklu para birimi (BUG-3): farklı kurları TOPLAMA — para birimi başına ayrı özet.
        Summaries = rows
            .GroupBy(r => r.Currency)
            .Select(g => new CurrencySummary
            {
                Currency = g.Key,
                Income = g.Where(x => x.Type == TxType.Income).Sum(x => x.Amount),
                Expense = g.Where(x => x.Type == TxType.Expense).Sum(x => x.Amount)
            })
            .OrderByDescending(s => s.Income + s.Expense)
            .ToList();
    }

    private static string? NameOf(Dictionary<Guid, string> map, Guid? id)
        => id.HasValue && map.TryGetValue(id.Value, out var name) ? name : null;

    private static async Task<Dictionary<Guid, string>> SafeLookupAsync(Func<Task<Dictionary<Guid, string>>> fetch)
    {
        try { return await fetch(); }
        catch (AbpAuthorizationException) { return new Dictionary<Guid, string>(); }
    }

    private static async Task TryAddAsync(Func<Task> fetch)
    {
        try { await fetch(); }
        catch (AbpAuthorizationException) { /* kullanıcının bu kaynağa yetkisi yok → atla */ }
    }

    public enum TxType { Income, Expense, Invoice }

    public class TransactionRow
    {
        public TxType Type { get; set; }
        public bool IsInflow { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "TRY";
        public string? ProjectName { get; set; }
        public string? CustomerName { get; set; }
        public string? Description { get; set; }
        public string Url { get; set; } = "#";
    }

    public class CurrencySummary
    {
        public string Currency { get; set; } = "TRY";
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
        public decimal Net => Income - Expense;
    }
}
