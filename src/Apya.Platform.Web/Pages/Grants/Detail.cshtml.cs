using System;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Apya.Platform.Grants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>1e · Kiracı: Hibe Detayı.</summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class DetailModel : PlatformPageModel
{
    private readonly IGrantFunnelAppService _funnel;
    private readonly IGrantDetailBannerSettingsAppService _bannerSettings;

    public DetailModel(IGrantFunnelAppService funnel, IGrantDetailBannerSettingsAppService bannerSettings)
    {
        _funnel = funnel;
        _bannerSettings = bannerSettings;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    /// <summary>Afiş düzeni (host ayarı): cover / side / overlay.</summary>
    public string BannerVariant { get; private set; } = GrantDetailBannerVariants.Default;

    public async Task<IActionResult> OnGetAsync()
    {
        if (Id == Guid.Empty)
        {
            return RedirectToPage("./Index");
        }

        // 18c · Huni: sayfa açılışı bir görüntülenme; ekran içi yenilemeler (JS) sayılmaz. Host'un bakışı sayılmaz.
        await _funnel.RecordTenantViewAsync(Id);
        BannerVariant = (await _bannerSettings.GetAsync()).Variant;
        return Page();
    }

    /// <summary>
    /// Son başvuru tarihini tek etkinlikli .ics olarak verir ("Takvime ekle"). UID, takvim
    /// ekranındaki aynı son tarihinkiyle aynıdır: iki kez eklenirse istemci kopya açmaz.
    /// Çağrı okuması detay ekranınınkiyle aynı servisten (kiracının görebildiği çağrı).
    /// </summary>
    public async Task<IActionResult> OnGetIcsAsync(
        [FromServices] IGrantRecommendationAppService recommendations,
        [FromServices] IcalWriter writer)
    {
        var call = await recommendations.GetCallDetailAsync(Id);
        if (call.Deadline == null)
        {
            return NotFound();
        }

        var item = new CalendarItemDto
        {
            Key = $"{(int)CalendarSourceType.Grant}:{call.GrantCallId}",
            Source = CalendarSourceType.Grant,
            SourceId = call.GrantCallId,
            Title = $"{call.GrantName} · {L["Calendar:Grant:CallDeadline"]}",
            Date = call.Deadline.Value.Date,
            IsAllDay = true,
            Subtitle = $"{call.Issuer} · {call.Period} · {Request.Scheme}://{Request.Host}/Grants/Detail?id={call.GrantCallId}"
        };

        var body = writer.Build([item], call.GrantName, Clock.Now);
        return File(Encoding.UTF8.GetBytes(body), "text/calendar; charset=utf-8", $"{L["Grants:Ics:FileName"]}.ics");
    }
}
