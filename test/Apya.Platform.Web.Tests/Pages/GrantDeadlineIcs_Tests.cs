using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Hibe detayındaki "Takvime ekle": son başvuru tarihi tek etkinlikli .ics olarak iner. UID takvim
/// ekranının aynı son tarih için kullandığı anahtarla aynıdır (Grant = 3), iki kez eklenince kopya olmaz.
/// </summary>
public class GrantDeadlineIcs_Tests : PlatformWebTestBase
{
    private async Task<Guid> SeedCallAsync(DateTime? deadline)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantId = (await repo.GetListAsync()).First().GrantId;
        var call = new GrantCall(Guid.NewGuid(), grantId, "ICS-" + Guid.NewGuid().ToString("N")[..6], GrantCallStatus.Acik);
        call.SetSchedule(null, deadline);
        await repo.InsertAsync(call, autoSave: true);
        await uow.CompleteAsync();
        return call.Id;
    }

    [Fact]
    public async Task Son_tarih_gunluk_etkinlik_olarak_iner_UID_takvimle_ayni()
    {
        var callId = await SeedCallAsync(new DateTime(2031, 3, 14));

        var response = await GetResponseAsync($"/Grants/Detail?id={callId}&handler=Ics");
        response.Content.Headers.ContentType!.MediaType.ShouldBe("text/calendar");
        response.Content.Headers.ContentDisposition!.FileName!.ShouldContain(".ics");
        var body = await response.Content.ReadAsStringAsync();

        body.ShouldStartWith("BEGIN:VCALENDAR\r\n");
        body.Split("BEGIN:VEVENT").Length.ShouldBe(2, "tek etkinlik");
        body.ShouldContain($"UID:3:{callId}@apya");
        body.ShouldContain("DTSTART;VALUE=DATE:20310314");
        body.ShouldContain("DTEND;VALUE=DATE:20310315");
        body.ShouldContain("Son başvuru");
    }

    [Fact]
    public async Task Son_tarihi_olmayan_cagrida_dosya_yok()
    {
        var callId = await SeedCallAsync(null);

        // Uygulama 404'ü hata sayfasına yönlendirir (302); önemli olan dosya inmemesi.
        var response = await Client.GetAsync($"/Grants/Detail?id={callId}&handler=Ics");
        response.IsSuccessStatusCode.ShouldBeFalse();
        response.Content.Headers.ContentType?.MediaType.ShouldNotBe("text/calendar");
    }

    [Fact]
    public async Task Detay_sayfasi_takvime_ekle_baglantisini_bu_cagri_icin_basar()
    {
        var callId = await SeedCallAsync(new DateTime(2031, 3, 14));

        var html = await GetResponseAsStringAsync($"/Grants/Detail?id={callId}");

        html.ShouldContain($"href=\"/Grants/Detail?id={callId}&handler=Ics\"");
    }
}
