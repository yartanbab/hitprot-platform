using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Takvim ekranındaki ".ics indir": görünen aralık ve açık kaynaklar, ekranın kendi beslemesinden
/// (izin süzgeci orada) tek dosyaya yazılır. UID'ler takvim anahtarlarıdır (görev = 1).
/// </summary>
public class CalendarRangeIcs_Tests : PlatformWebTestBase
{
    private async Task<TaskDto> SeedTaskAsync(string title, DateTime due)
        => await GetRequiredService<ITaskAppService>().CreateAsync(new CreateUpdateTaskDto
        {
            Title = title,
            StartDate = due.AddDays(-3),
            DueDate = due
        });

    [Fact]
    public async Task Aralik_ve_acik_kaynaklar_tek_dosyaya_yazilir()
    {
        var title = "Takvim aktarımı " + Guid.NewGuid().ToString("N")[..6];
        var task = await SeedTaskAsync(title, new DateTime(2031, 5, 20));

        var response = await GetResponseAsync("/Calendars?handler=Ics&from=2031-05-01&to=2031-05-31&sources=1");
        response.Content.Headers.ContentType!.MediaType.ShouldBe("text/calendar");
        response.Content.Headers.ContentDisposition!.FileName!.ShouldContain("2031-05-01_2031-05-31.ics");
        var body = await response.Content.ReadAsStringAsync();

        body.ShouldStartWith("BEGIN:VCALENDAR\r\n");
        body.ShouldContain($"UID:1:{task.Id}@apya");
        body.ShouldContain("DTSTART;VALUE=DATE:20310520");
        body.ShouldContain(title);
    }

    [Fact]
    public async Task Kapali_kaynak_ve_aralik_disi_oge_dosyaya_girmez()
    {
        var title = "Takvim dışı " + Guid.NewGuid().ToString("N")[..6];
        await SeedTaskAsync(title, new DateTime(2031, 6, 10));

        // Yalnız fatura kaynağı açık: görev yazılmaz.
        var invoicesOnly = await GetResponseAsStringAsync("/Calendars?handler=Ics&from=2031-06-01&to=2031-06-30&sources=2");
        invoicesOnly.ShouldNotContain(title);

        // Aralık dışı: görev yazılmaz.
        var otherMonth = await GetResponseAsStringAsync("/Calendars?handler=Ics&from=2031-07-01&to=2031-07-31&sources=1");
        otherMonth.ShouldNotContain(title);
    }
}
