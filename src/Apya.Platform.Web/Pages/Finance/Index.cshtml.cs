using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Expenses;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Web.Pages.Shared;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Finans Hub — konsolide bakiye, hesap listesi, hızlı transfer ve son işlemler.
/// Gelir + Gider + Fatura + Transfer kayıtlarını tek listede birleştirir
/// (sunucu-render, salt-okunur). Her kaynak kendi app service'i üzerinden
/// çekilir (yetki/tenant filtresi korunur); yetkisi olmayan kaynak sessizce atlanır.
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    private const int MaxPerSource = 100;
    private const int MaxTransactionsShown = 12;

    private readonly IExpenseAppService _expenseAppService;
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly IInvoiceAppService _invoiceAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly IExchangeRateAppService _exchangeRateAppService;

    public List<TransactionRow> Transactions { get; private set; } = new();
    public List<AccountSummary> Accounts { get; private set; } = new();
    public decimal TotalBalanceTry { get; private set; }
    public int DistinctCurrencyCount { get; private set; }

    public IndexModel(
        IExpenseAppService expenseAppService,
        IIncomeEntryAppService incomeAppService,
        IInvoiceAppService invoiceAppService,
        ICashAccountAppService cashAccountAppService,
        ICashMovementAppService cashMovementAppService,
        IExchangeRateAppService exchangeRateAppService)
    {
        _expenseAppService = expenseAppService;
        _incomeAppService = incomeAppService;
        _invoiceAppService = invoiceAppService;
        _cashAccountAppService = cashAccountAppService;
        _cashMovementAppService = cashMovementAppService;
        _exchangeRateAppService = exchangeRateAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadAccountsAsync();

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
                    CategoryLabel = CategoryLabels.ForIncome(x.Category),
                    ProjectName = NameOf(projects, x.ProjectId),
                    CustomerName = NameOf(customers, x.CustomerId),
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
                    CategoryLabel = CategoryLabels.ForExpense(x.Category),
                    ProjectName = NameOf(projects, x.ProjectId),
                    CustomerName = NameOf(customers, x.CustomerId),
                    Url = "/Expenses"
                });
            }
        });

        await TryAddAsync(async () =>
        {
            var page = await _invoiceAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = MaxPerSource });
            foreach (var x in page.Items)
            {
                var isSales = x.Direction == InvoiceDirection.Sales;
                rows.Add(new TransactionRow
                {
                    Type = TxType.Invoice,
                    IsInflow = isSales,
                    Date = x.InvoiceDate,
                    Title = string.IsNullOrWhiteSpace(x.InvoiceNumber) ? x.ProjectName : x.InvoiceNumber,
                    Amount = x.TotalAmount,
                    Currency = x.Currency,
                    CategoryLabel = isSales ? "Satış geliri" : "Alış gideri",
                    ProjectName = x.ProjectName,
                    CustomerName = x.CustomerName,
                    Url = "/Invoices"
                });
            }
        });

        await TryAddAsync(async () =>
        {
            // Yalnızca Transfer kaynaklı hareketler eklenir — Invoice/Expense/Income
            // kaynaklı hareketler zaten kendi listelerinden geldi (çift sayım olmasın).
            var page = await _cashMovementAppService.GetListAsync(new GetCashMovementsInput { MaxResultCount = MaxPerSource });
            foreach (var x in page.Items.Where(m => m.Source == CashMovementSource.Transfer))
            {
                rows.Add(new TransactionRow
                {
                    Type = TxType.Transfer,
                    IsInflow = x.Direction == CashMovementDirection.In,
                    Date = x.MovementDate,
                    Title = x.Description ?? "Hesaplar arası transfer",
                    Amount = x.Amount,
                    Currency = "TRY",
                    CategoryLabel = "Transfer",
                    Url = "/CashAccounts"
                });
            }
        });

        Transactions = rows.OrderByDescending(r => r.Date).Take(MaxTransactionsShown).ToList();
    }

    private async Task LoadAccountsAsync()
    {
        var result = await _cashAccountAppService.GetListAsync(
            new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });

        var accounts = new List<AccountSummary>();
        foreach (var a in result.Items)
        {
            var balance = await _cashMovementAppService.GetBalanceAsync(a.Id);
            accounts.Add(new AccountSummary
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                Currency = a.Currency,
                Iban = a.Iban,
                Balance = balance.CurrentBalance
            });
        }

        Accounts = accounts.OrderByDescending(a => a.Balance).ToList();
        DistinctCurrencyCount = accounts.Select(a => a.Currency).Distinct().Count();

        var ratesToTry = await CurrencyConversionHelper.LoadRatesToTryAsync(_exchangeRateAppService);
        TotalBalanceTry = accounts.Sum(a => CurrencyConversionHelper.ToTry(a.Balance, a.Currency, ratesToTry));
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

    public enum TxType { Income, Expense, Invoice, Transfer }

    public class TransactionRow
    {
        public TxType Type { get; set; }
        public bool IsInflow { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "TRY";
        public string CategoryLabel { get; set; } = string.Empty;
        public string? ProjectName { get; set; }
        public string? CustomerName { get; set; }
        public string Url { get; set; } = "#";
    }

    public class AccountSummary
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CashAccountType Type { get; set; }
        public string Currency { get; set; } = "TRY";
        public string? Iban { get; set; }
        public decimal Balance { get; set; }
    }
}

/// <summary>Enum kategorilerini Türkçe, kısa chip metnine çevirir (Finans Hub akışı).</summary>
internal static class CategoryLabels
{
    public static string ForExpense(ExpenseCategory category) => category switch
    {
        ExpenseCategory.Office => "Ofis",
        ExpenseCategory.Travel => "Seyahat",
        ExpenseCategory.Personnel => "Personel",
        ExpenseCategory.Material => "Malzeme",
        ExpenseCategory.Service => "Hizmet",
        ExpenseCategory.Tax => "Vergi",
        _ => "Diğer"
    };

    public static string ForIncome(IncomeCategory category) => category switch
    {
        IncomeCategory.Grant => "Hibe",
        IncomeCategory.Donation => "Bağış",
        IncomeCategory.CashSale => "Nakit Satış",
        IncomeCategory.Financial => "Finansal",
        _ => "Diğer"
    };
}
