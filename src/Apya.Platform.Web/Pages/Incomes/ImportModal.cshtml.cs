using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Incomes;

/// <summary>
/// Gelirleri Excel'den içe aktarma; her satır gelir penceresinin servisinden geçer.
/// Kasa isteğe bağlı: seçilirse kasa giriş hareketi servisçe yazılır.
/// </summary>
[Authorize(PlatformPermissions.Incomes.Create)]
public class ImportModalModel : FinanceImportPageModel<IncomeCategory>
{
    private readonly IIncomeEntryAppService _incomeAppService;

    public ImportModalModel(IIncomeEntryAppService incomeAppService)
    {
        _incomeAppService = incomeAppService;
    }

    protected override string NameKey => "Export:Incomes:Name";
    protected override string CategoryKeyPrefix => "Income:Category:";
    protected override bool AccountRequired => false;
    protected override int MaxTitleLength => IncomeConsts.MaxTitleLength;
    protected override int MaxDescriptionLength => IncomeConsts.MaxDescriptionLength;

    protected override async Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync()
        => (await _incomeAppService.GetCashAccountLookupAsync()).Items;

    protected override Task CreateAsync(FinanceImportRow<IncomeCategory> row)
        => _incomeAppService.CreateAsync(new CreateUpdateIncomeEntryDto
        {
            Title = row.Title,
            IncomeDate = row.Date,
            Category = row.Category,
            Amount = row.Amount,
            Currency = row.Currency,
            CashAccountId = row.CashAccountId,
            ProjectId = row.ProjectId,
            BudgetLineId = row.BudgetLineId,
            Description = row.Description
        });
}
