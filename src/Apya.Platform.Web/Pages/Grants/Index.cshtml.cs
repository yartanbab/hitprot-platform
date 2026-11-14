using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

[Authorize(PlatformPermissions.Grants.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly ICurrentTenant _currentTenant;

    // Host (CurrentTenant.Id == null) → katalog yönetimi; tenant → profil + öneri feed.
    public bool IsHost { get; private set; }

    /// <summary>21a/22 · Host Çağrılar sekmesi: "live" (varsayılan) ya da "draft". Kaynaklar ayrı sayfa.</summary>
    [BindProperty(SupportsGet = true)]
    public string? Tab { get; set; }

    /// <summary>
    /// X-05 · Kazıyıcı bağlanmadıysa (<see cref="NotConfiguredGrantScraper"/>) "Tümünü Tara" çizilmez:
    /// düğme her kaynak için yalnız "atlandı" koşusu bırakıyordu. Gerçek kazıyıcı kaydedilince geri gelir.
    /// </summary>
    public bool ScraperConnected { get; }

    public IndexModel(ICurrentTenant currentTenant, IGrantScraper scraper)
    {
        _currentTenant = currentTenant;
        ScraperConnected = scraper is not NotConfiguredGrantScraper;
    }

    public void OnGet()
    {
        IsHost = _currentTenant.Id == null;
        Tab = Tab == "draft" ? "draft" : "live";
    }

    /// <summary>Host Çağrılar (.xlsx): ekrandaki sekme, durum, kurum ve sıralama sunucuda aynen uygulanır.</summary>
    public async Task<IActionResult> OnGetCallsExcelAsync(GetGrantCallBoardInput input, [FromServices] IGrantCallBoardAppService board)
    {
        var dto = await board.GetAsync(input);
        var columns = new List<ExcelColumn<GrantCallCardDto>>
        {
            new(L["Export:Col:Program"], c => c.GrantName),
            new(L["Export:Col:Issuer"], c => c.Issuer),
            new(L["Export:Col:Period"], c => c.Period),
            new(L["Export:Col:Reference"], c => c.Reference),
            new(L["Export:Col:Status"], c => L[$"Grants:Calls:State:{CallState(c.Status)}"].Value),
            new(L["Export:Col:OpenDate"], c => c.OpenDate, "dd.MM.yyyy"),
            new(L["Export:Col:DueDate"], c => c.Deadline, "dd.MM.yyyy"),
            new(L["Export:Col:DaysRemaining"], c => c.DaysRemaining),
            new(L["Export:Col:MinAmount"], c => c.MinAmount),
            new(L["Export:Col:MaxAmount"], c => c.MaxAmount),
            new(L["Export:Col:Currency"], c => c.Currency),
            new(L["Export:Col:SupportRate"], c => c.SupportRatePercent),
            new(L["Export:Col:MatchingFirms"], c => c.MatchingFirmCount),
            new(L["Export:Col:Interests"], c => c.InterestCount),
        };

        var name = L["Export:GrantCalls:Name"].Value;
        return this.TableFile(name, columns, dto.Items);
    }

    /// <summary>
    /// Kiracı Fırsatlar (.xlsx). Gelişmiş süzgeç istemcide çalışıyor (Tenant.js); ekranda görünen
    /// çağrıların kimlikleri ekrandaki sırayla gelir, dosya akışı onlarla süzer.
    /// </summary>
    public async Task<IActionResult> OnPostFeedExcelAsync(List<Guid> callIds, [FromServices] IGrantRecommendationAppService recommendations)
    {
        var order = callIds.Distinct().Select((id, i) => (id, i)).ToDictionary(x => x.id, x => x.i);
        var rows = (await recommendations.GetOpenCallsAsync())
            .Where(r => order.ContainsKey(r.GrantCallId))
            .OrderBy(r => order[r.GrantCallId]);

        var columns = new List<ExcelColumn<GrantRecommendationDto>>
        {
            new(L["Export:Col:Program"], r => r.GrantName),
            new(L["Export:Col:Issuer"], r => r.Issuer),
            new(L["Export:Col:Period"], r => r.Period),
            new(L["Export:Col:DueDate"], r => r.Deadline, "dd.MM.yyyy"),
            new(L["Export:Col:DaysRemaining"], r => r.DaysRemaining),
            new(L["Export:Col:MinAmount"], r => r.MinAmount),
            new(L["Export:Col:MaxAmount"], r => r.MaxAmount),
            new(L["Export:Col:Currency"], r => r.Currency),
            new(L["Export:Col:SupportRate"], r => r.SupportRatePercent),
            new(L["Export:Col:Eligibility"], r => L[$"Grants:Bucket:{r.Bucket}"].Value),
            new(L["Export:Col:Score"], r => r.Score),
        };

        var name = L["Export:GrantFeed:Name"].Value;
        return this.TableFile(name, columns, rows);
    }

    // Index.js stateOf() ile aynı eşleme.
    private static string CallState(GrantCallStatus? status) => status switch
    {
        null => "NoCall",
        GrantCallStatus.Acik => "Live",
        GrantCallStatus.Planlandi => "Planned",
        GrantCallStatus.Kapandi => "Closed",
        _ => "Draft"
    };
}
