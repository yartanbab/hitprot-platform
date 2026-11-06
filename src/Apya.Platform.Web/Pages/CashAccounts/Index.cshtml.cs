using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.CashAccounts;

[Authorize(PlatformPermissions.CashAccounts.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly IExchangeRateAppService _exchangeRateAppService;

    public List<AccountCardModel> Accounts { get; set; } = new();
    public decimal TotalBalanceTry { get; set; }
    public int DistinctCurrencyCount { get; set; }

    public IndexModel(
        ICashAccountAppService cashAccountAppService,
        ICashMovementAppService cashMovementAppService,
        IExchangeRateAppService exchangeRateAppService)
    {
        _cashAccountAppService = cashAccountAppService;
        _cashMovementAppService = cashMovementAppService;
        _exchangeRateAppService = exchangeRateAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        await LoadAccountsAsync();
        return Page();
    }

    /// <summary>
    /// Konsolide toplam + hesap kartları parçası. Kartlar Razor'da TEK yerde çizilir; JS
    /// hareket yazmalarından sonra yalnız bu parçayı yerine koyar (tam sayfa yenilemesi yok).
    /// Tek kart değil özetin tamamı basılır: hareketin kasası düzenlemede değişebiliyor ve
    /// transfer iki hesaba birden yazıyor.
    /// </summary>
    public virtual async Task<IActionResult> OnGetAccountSummaryAsync()
    {
        await LoadAccountsAsync();
        return Partial("_AccountSummary", this);
    }

    /// <summary>Seçili kasanın hareketleri (.xlsx), yeniden eskiye.</summary>
    public virtual async Task<IActionResult> OnGetMovementsExcelAsync(Guid cashAccountId)
    {
        var account = await _cashAccountAppService.GetAsync(cashAccountId);
        var rows = await ExcelTable.CollectAsync((skip, take) => _cashMovementAppService.GetListAsync(new GetCashMovementsInput
        {
            CashAccountId = cashAccountId,
            Sorting = "movementDate desc",
            SkipCount = skip,
            MaxResultCount = take
        }));

        var columns = new List<ExcelColumn<CashMovementDto>>
        {
            new(L["Export:Col:Date"], m => m.MovementDate, "dd.MM.yyyy"),
            new(L["Export:Col:Direction"], m => L[$"CashMovement:Direction:{m.Direction}"].Value),
            new(L["Export:Col:Description"], m => m.Description),
            new(L["Export:Col:Amount"], m => m.Amount),
            new(L["Export:Col:Currency"], _ => account.Currency),
            new(L["Export:Col:Source"], m => L[$"CashMovement:Source:{m.Source}"].Value),
        };

        var name = L["Export:CashMovements:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return File(ExcelTable.Build(account.Name, columns, rows.Items, note), ExcelTable.ContentType, ExcelTable.FileName(name, Clock.Now));
    }

    private async Task LoadAccountsAsync()
    {
        var rows = await CashAccountBalanceLoader.LoadActiveAsync(_cashAccountAppService, _cashMovementAppService);

        var accounts = rows.Select(r => new AccountCardModel
        {
            Id = r.Account.Id,
            Name = r.Account.Name,
            Type = r.Account.Type,
            Currency = r.Account.Currency,
            BankName = r.Account.BankName,
            Branch = r.Account.Branch,
            Iban = r.Account.Iban,
            Balance = r.Balance
        }).ToList();

        Accounts = accounts.OrderByDescending(a => a.Balance).ToList();
        DistinctCurrencyCount = accounts.Select(a => a.Currency).Distinct().Count();

        var ratesToTry = await CurrencyConversionHelper.LoadRatesToTryAsync(_exchangeRateAppService);
        TotalBalanceTry = accounts.Sum(a => CurrencyConversionHelper.ToTry(a.Balance, a.Currency, ratesToTry));
    }

    public class AccountCardModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CashAccountType Type { get; set; }
        public string Currency { get; set; } = "TRY";
        public string? BankName { get; set; }
        public string? Branch { get; set; }
        public string? Iban { get; set; }
        public decimal Balance { get; set; }
    }
}
