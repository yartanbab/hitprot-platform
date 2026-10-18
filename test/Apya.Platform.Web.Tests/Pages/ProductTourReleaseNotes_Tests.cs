using System;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.ReleaseNotes;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Mvc.Testing;
using Shouldly;
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// K-12 · Yeni kullanıcı ilk girişte tanıtım turunu, tur biter bitmez de o anki sürümün
/// "Yenilikler" penceresini alıyordu: hiç görmediği eski davranışların düzeltmelerini okuyordu.
/// Turu ilk kez bitiren (hiç sürüm notu görmemiş) kullanıcı için o anki notlar görülmüş sayılır;
/// sonraki sürümler yine açılır.
/// </summary>
public class ProductTourReleaseNotes_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Turu_ilk_kez_bitiren_kullanici_o_anki_surum_notunu_gormus_sayilir()
    {
        var userId = Guid.NewGuid();

        await PostAsUserAsync(userId, "/product-tour/mark-seen");

        var seen = await GetRequiredService<ISettingManager>()
            .GetOrNullForUserAsync(PlatformSettings.ReleaseNotes.LastSeenVersion, userId);
        seen.ShouldNotBeNull();
        seen.ShouldStartWith(ReleaseNoteCatalog.Latest.Version + "|");
    }

    [Fact]
    public async Task Daha_once_surum_notu_gormus_kullanicinin_damgasina_dokunulmaz()
    {
        var userId = Guid.NewGuid();
        var settings = GetRequiredService<ISettingManager>();
        await settings.SetForUserAsync(userId, PlatformSettings.ReleaseNotes.LastSeenVersion, "2026.01.01|abcd1234");

        await PostAsUserAsync(userId, "/product-tour/mark-seen");

        (await settings.GetOrNullForUserAsync(PlatformSettings.ReleaseNotes.LastSeenVersion, userId))
            .ShouldBe("2026.01.01|abcd1234");
    }

    private async Task PostAsUserAsync(Guid userId, string url)
    {
        Server.PreserveExecutionContext = true;

        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, userId.ToString()),
            new Claim(AbpClaimTypes.UserName, "tur-" + userId.ToString("N")[..8])
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        {
            using var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
            var response = await client.PostAsync(url, content: null);
            response.StatusCode.ShouldBe(HttpStatusCode.NoContent);
        }
    }
}
