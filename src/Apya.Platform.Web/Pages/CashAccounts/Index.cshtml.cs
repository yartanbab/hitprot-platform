using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Web.Pages.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.CashAccounts;

[Authorize(PlatformPermissions.CashAccounts.Default)]
public class IndexModel : AbpPageModel
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

    private async Task LoadAccountsAsync()
    {
        var result = await _cashAccountAppService.GetListAsync(
            new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });

        var accounts = new List<AccountCardModel>();
        foreach (var a in result.Items)
        {
            var balance = await _cashMovementAppService.GetBalanceAsync(a.Id);
            accounts.Add(new AccountCardModel
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                Currency = a.Currency,
                BankName = a.BankName,
                Branch = a.Branch,
                Iban = a.Iban,
                Balance = balance.CurrentBalance
            });
        }

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
