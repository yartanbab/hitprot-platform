using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.UsageLogs;
using Apya.Platform.Ai.UsageLogs.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.AiCenter.UsageLogs;

[Authorize(AiPermissions.UsageLogs.View)]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }

    /// <summary>Kullanım kayıtları (.xlsx), sağlayıcı ve durum süzgeciyle; en yeni üstte. Hata metni ekranda yok, dosyada da yok.</summary>
    public async Task<IActionResult> OnGetExcelAsync(GetAiUsageLogsInput input, [FromServices] IAiUsageLogAppService usageLogs)
    {
        var rows = await ExcelTable.CollectAsync((skip, take) =>
        {
            input.SkipCount = skip;
            input.MaxResultCount = take;
            return usageLogs.GetListAsync(input);
        });

        var columns = new List<ExcelColumn<AiUsageLogDto>>
        {
            new(L["Export:Col:Date"], r => r.CreationTime, "dd.MM.yyyy HH:mm"),
            new(L["Export:Col:Provider"], r => r.ProviderName),
            new(L["Export:Col:Type"], r => r.RequestType),
            new(L["Export:Col:Status"], r => L[$"Export:AiStatus:{r.Status}"].Value),
            new(L["Export:Col:Tokens"], r => r.TokensUsed),
            new(L["Export:Col:DurationMs"], r => r.DurationMs.HasValue ? Math.Round(r.DurationMs.Value) : null),
        };

        var name = L["Export:AiUsageLogs:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return this.TableFile(name, columns, rows.Items, note);
    }
}
