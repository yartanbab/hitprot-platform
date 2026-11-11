using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Calendars;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Calendars;

[Authorize(PlatformPermissions.Calendars.Default)]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }

    /// <summary>
    /// Ekranda görünen aralığı ve açık kaynakları .ics olarak indirir. Öğeler takvim ekranının
    /// kendi beslemesinden gelir (izin süzgeci ve aralık sınırı orada). Abonelik bağlantısının
    /// aksine oturumla iner; bu yüzden fatura/gider gibi finans öğeleri de görme izni varsa girer.
    /// </summary>
    public async Task<IActionResult> OnGetIcsAsync(
        DateTime from, DateTime to, [FromQuery] List<CalendarSourceType>? sources,
        [FromServices] ICalendarAppService calendar, [FromServices] IcalWriter writer)
    {
        var feed = await calendar.GetFeedAsync(new GetCalendarFeedInput { From = from, To = to, Sources = sources });
        var body = writer.Build(feed.Items, L["Calendar:Ics:Name"], Clock.Now);
        var name = $"{L["Calendar:Ics:FileName"]}_{feed.From:yyyy-MM-dd}_{feed.To:yyyy-MM-dd}.ics";
        return File(Encoding.UTF8.GetBytes(body), "text/calendar; charset=utf-8", name);
    }
}
