using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;

namespace Apya.Platform.Web.Pages.ExchangeRates;

[Authorize(PlatformPermissions.ExchangeRates.Default)]
public class IndexModel : PlatformPageModel
{
    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }

    /// <summary>
    /// Ekrandaki sıralamayla kur listesi. İlk dört sütun içe aktarma şablonuyla aynı
    /// (<see cref="ImportModalModel"/>): dosya geri yüklenebilir; "Kaynak" içe aktarmada okunmaz.
    /// </summary>
    public async Task<IActionResult> OnGetExcelAsync(GetExchangeRatesInput input,
        [FromServices] IExchangeRateAppService exchangeRateAppService)
    {
        var rows = await ExcelTable.CollectAsync((skip, take) =>
        {
            input.SkipCount = skip;
            input.MaxResultCount = take;
            return exchangeRateAppService.GetListAsync(input);
        });

        var columns = new List<ExcelColumn<ExchangeRateDto>>
        {
            new(L["Export:Col:Date"], r => r.RateDate, "dd.MM.yyyy"),
            new(L["Export:Col:Currency"], r => r.FromCurrency),
            new(L["Import:Col:ToCurrency"], r => r.ToCurrency),
            new(L["Import:Col:Rate"], r => r.Rate, "#,##0.00####"),
            new(L["Export:Col:Source"], r => L[$"Export:RateSource:{r.Source}"].Value),
        };

        var name = L["Import:ExchangeRates:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return this.TableFile(name, columns, rows.Items, note);
    }
}
