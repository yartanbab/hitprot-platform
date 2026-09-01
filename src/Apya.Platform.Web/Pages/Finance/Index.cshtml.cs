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
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Web.Pages.Shared;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Finans tek çatısı — proje bağlamı + bağlam şablonuna göre değişen sekme seti.
///
/// Sayfanın omurgası sunucu taraflıdır: proje ve sekme seçimi query string'te
/// taşınır (<c>?projectId=…&amp;tab=…</c>), her sekme kendi verisini YALNIZ aktifken
/// yükler. Böylece bağlantı paylaşılabilir, geri tuşu çalışır ve pasif sekmelerin
/// sorgusu hiç koşmaz.
///
/// Her kaynak kendi app service'i üzerinden çekilir (yetki/tenant filtresi
/// korunur); yetkisi olmayan kaynak sessizce atlanır.
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    private const int MaxPerSource = 100;
    private const int MaxTransactionsShown = 12;
    private const int MaxProjects = 1000;

    private readonly IExpenseAppService _expenseAppService;
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly IInvoiceAppService _invoiceAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly IExchangeRateAppService _exchangeRateAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly IProjectBudgetAppService _projectBudgetAppService;

    /// <summary>Seçili proje; boş = "Tüm projeler" (portföy).</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    /// <summary>Aktif sekmenin kodu; geçersiz/boşsa şablonun ilk sekmesine düşer.</summary>
    [BindProperty(SupportsGet = true)]
    public string? Tab { get; set; }

    public List<ProjectDto> Projects { get; private set; } = new();
    public ProjectDto? SelectedProject { get; private set; }
    public FinanceContextTemplate Template { get; private set; } = FinanceContextTemplate.Corporate;
    public List<FinanceTabDefinition> Tabs { get; private set; } = new();
    public string ActiveTab { get; private set; } = FinanceContext.TabOverview;

    /// <summary>
    /// Proje seçiliyken bütçe/fonlama özeti — "Genel", "Bütçe kalemleri" ve
    /// "Dilimler" sekmelerinin ortak kaynağı. Portföyde ya da bütçe görme yetkisi
    /// yoksa null.
    /// </summary>
    public ProjectBudgetOverviewDto? Budget { get; private set; }

    /// <summary>"Dilimler &amp; kesintiler" sekmesinin verisi.</summary>
    public List<FundingTrancheDto> Tranches { get; private set; } = new();

    /// <summary>Bütçe yazma yetkisi — ekleme/düzenleme düğmeleri buna bakar.</summary>
    public bool CanEditBudget { get; private set; }

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
        IExchangeRateAppService exchangeRateAppService,
        IProjectAppService projectAppService,
        IProjectBudgetAppService projectBudgetAppService)
    {
        _expenseAppService = expenseAppService;
        _incomeAppService = incomeAppService;
        _invoiceAppService = invoiceAppService;
        _cashAccountAppService = cashAccountAppService;
        _cashMovementAppService = cashMovementAppService;
        _exchangeRateAppService = exchangeRateAppService;
        _projectAppService = projectAppService;
        _projectBudgetAppService = projectBudgetAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadProjectContextAsync();
        await LoadTabsAsync();

        CanEditBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.Edit);

        // Sekme başına yükleme: pasif sekmenin sorgusu hiç koşmaz.
        if (ActiveTab == FinanceContext.TabOverview)
        {
            await LoadAccountsAsync();
            await LoadTransactionsAsync();
            await LoadBudgetAsync();
        }
        else if (ActiveTab == FinanceContext.TabCash)
        {
            await LoadAccountsAsync();
        }
        else if (ActiveTab == FinanceContext.TabBudgetLines)
        {
            await LoadBudgetAsync();
        }
        else if (ActiveTab == FinanceContext.TabTranches)
        {
            await LoadBudgetAsync();
            if (SelectedProject != null)
            {
                await TryAddAsync(async () =>
                    Tranches = await _projectBudgetAppService.GetTranchesAsync(SelectedProject.Id));
            }
        }
    }

    /// <summary>
    /// Bütçe özeti. Yetkisi olmayan kullanıcıda sessizce atlanır (TryAddAsync) —
    /// "Genel" sekmesi bütçe bloğu olmadan da anlamlıdır.
    /// </summary>
    private async Task LoadBudgetAsync()
    {
        if (SelectedProject == null)
        {
            return;
        }

        await TryAddAsync(async () =>
            Budget = await _projectBudgetAppService.GetOverviewAsync(SelectedProject.Id));
    }

    /// <summary>
    /// Proje listesi + seçili proje + şablon. Projeleri görme yetkisi yoksa
    /// seçici hiç basılmaz; sayfa portföy (proje bağlamsız) kipinde açılır.
    /// </summary>
    private async Task LoadProjectContextAsync()
    {
        await TryAddAsync(async () =>
        {
            var result = await _projectAppService.GetListAsync(
                new PagedAndSortedResultRequestDto { MaxResultCount = MaxProjects, Sorting = "Name asc" });
            Projects = result.Items.ToList();
        });

        if (ProjectId.HasValue)
        {
            SelectedProject = Projects.FirstOrDefault(p => p.Id == ProjectId.Value);

            // Listede yoksa (silinmiş/yetkisiz) seçim düşürülür — 404 yerine portföy.
            if (SelectedProject == null)
            {
                ProjectId = null;
            }
        }

        Template = FinanceContext.Resolve(SelectedProject?.CategorySystemKey);
    }

    /// <summary>
    /// Şablonun sekme setini izne göre süzer ve aktif sekmeyi çözer.
    /// Gelen <see cref="Tab"/> süzülmüş sette yoksa ilk sekmeye düşülür — böylece
    /// yetkisi olmayan sekmeye bağlantıyla girilemez.
    /// </summary>
    private async Task LoadTabsAsync()
    {
        var tabs = new List<FinanceTabDefinition>();
        foreach (var tab in FinanceContext.TabsFor(Template))
        {
            if (await IsTabGrantedAsync(tab))
            {
                tabs.Add(tab);
            }
        }

        Tabs = tabs;
        ActiveTab = tabs.Any(t => string.Equals(t.Code, Tab, StringComparison.Ordinal))
            ? Tab!
            : tabs.FirstOrDefault()?.Code ?? FinanceContext.TabOverview;
    }

    private async Task<bool> IsTabGrantedAsync(FinanceTabDefinition tab)
    {
        if (tab.AnyOfPermissions.Length == 0)
        {
            return true;
        }

        foreach (var permission in tab.AnyOfPermissions)
        {
            if (await AuthorizationService.IsGrantedAsync(permission))
            {
                return true;
            }
        }

        return false;
    }

    private async Task LoadTransactionsAsync()
    {
        var projects = await SafeLookupAsync(async () =>
            (await _invoiceAppService.GetProjectLookupAsync()).Items.ToDictionary(x => x.Id, x => x.Name));
        var customers = await SafeLookupAsync(async () =>
            (await _invoiceAppService.GetCustomerLookupAsync()).Items.ToDictionary(x => x.Id, x => x.Name));

        var rows = new List<TransactionRow>();

        await TryAddAsync(async () =>
        {
            var page = await _incomeAppService.GetListAsync(
                new GetIncomeEntriesInput { MaxResultCount = MaxPerSource, ProjectId = ProjectId });
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
            var page = await _expenseAppService.GetListAsync(
                new GetExpensesInput { MaxResultCount = MaxPerSource, ProjectId = ProjectId });
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
            // Fatura ucunda proje süzgeci yok; sayfalanmış sonuç bellekte süzülür.
            var page = await _invoiceAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = MaxPerSource });
            foreach (var x in page.Items.Where(i => !ProjectId.HasValue || i.ProjectId == ProjectId.Value))
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

        // Transferin projesi yoktur — proje seçiliyken listeye hiç girmez.
        if (!ProjectId.HasValue)
        {
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
        }

        Transactions = rows.OrderByDescending(r => r.Date).Take(MaxTransactionsShown).ToList();
    }

    private async Task LoadAccountsAsync()
    {
        var accounts = new List<AccountSummary>();

        await TryAddAsync(async () =>
        {
            var result = await _cashAccountAppService.GetListAsync(
                new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });

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
        });

        Accounts = accounts.OrderByDescending(a => a.Balance).ToList();
        DistinctCurrencyCount = accounts.Select(a => a.Currency).Distinct().Count();

        await TryAddAsync(async () =>
        {
            var ratesToTry = await CurrencyConversionHelper.LoadRatesToTryAsync(_exchangeRateAppService);
            TotalBalanceTry = accounts.Sum(a => CurrencyConversionHelper.ToTry(a.Balance, a.Currency, ratesToTry));
        });
    }

    // ─── Tek tıklık işlemler ───
    // Bunlar için ayrı modal/AJAX katmanı kurulmadı: hepsi tek bir id alıp tek bir
    // çağrı yapıyor ve sonuç sayfanın yeniden render edilmesi. Form POST + redirect
    // en az hareketli eden yol; JS'e bağımlılık da doğurmuyor.

    public async Task<IActionResult> OnPostDeleteLineAsync(Guid lineId)
    {
        await _projectBudgetAppService.DeleteLineAsync(lineId);
        return RedirectToActiveTab();
    }

    public async Task<IActionResult> OnPostDeleteTrancheAsync(Guid trancheId)
    {
        await _projectBudgetAppService.DeleteTrancheAsync(trancheId);
        return RedirectToActiveTab();
    }

    public async Task<IActionResult> OnPostRemoveDeductionAsync(Guid deductionId)
    {
        await _projectBudgetAppService.RemoveDeductionAsync(deductionId);
        return RedirectToActiveTab();
    }

    public async Task<IActionResult> OnPostMarkDeductionUnfundedAsync(Guid deductionId)
    {
        await _projectBudgetAppService.MarkDeductionUnfundedAsync(deductionId);
        return RedirectToActiveTab();
    }

    public async Task<IActionResult> OnPostReopenDeductionAsync(Guid deductionId)
    {
        await _projectBudgetAppService.ReopenDeductionAsync(deductionId);
        return RedirectToActiveTab();
    }

    /// <summary>POST sonrası aynı proje + aynı sekmeye döner (PRG).</summary>
    private IActionResult RedirectToActiveTab()
        => RedirectToPage(new { projectId = ProjectId, tab = Tab });

    /// <summary>Sekme bağlantısı — seçili proje korunarak sekme değiştirir.</summary>
    public string TabUrl(string tabCode)
        => ProjectId.HasValue ? $"/Finance?projectId={ProjectId.Value}&tab={tabCode}" : $"/Finance?tab={tabCode}";

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

/// <summary>Enum kategorilerini Türkçe, kısa chip metnine çevirir (Finans akışı).</summary>
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
