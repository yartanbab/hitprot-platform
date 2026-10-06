using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Her sayfa modeli yetki kararını AÇIKÇA taşır.
///
/// <para>Uygulamada "oturum açmamışsa girişe gönder" diyen genel bir kural yok: korumayı her sayfa
/// kendi işaretiyle sağlar. İşaret unutulan sayfa oturumsuz açılır. 169 sayfa modelinin 44'ü
/// işaretsizdi; çoğu işini yetkili bir uygulama servisi üzerinden yaptığı için zararsızdı, ama biri
/// (görev taslağı içe aktarma) servis çağrısından ÖNCE diske dosya yazıyordu — oturumsuz ziyaretçi
/// sunucuya dosya bırakabiliyordu. Koruma "her işleyici önce yetkili bir servis çağırır" varsayımına
/// bırakılmaz.</para>
/// </summary>
public class PageModelAuthorization_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        SignedInOnlyAuthorization.Replace(services);
    }

    private static List<Type> PageModels() =>
        typeof(Apya.Platform.Web.Pages.PlatformPageModel).Assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(PageModel).IsAssignableFrom(t))
            .ToList();

    private static string Name(Type t) => t.FullName!.Replace("Apya.Platform.Web.Pages.", string.Empty);

    [Fact]
    public void Her_Sayfa_Modeli_Authorize_Ya_Da_AllowAnonymous_Tasir()
    {
        var models = PageModels();
        // Tarama bozulursa test SESSİZCE geçmemeli.
        models.Count.ShouldBeGreaterThan(150, "beklenenden az sayfa modeli bulundu");

        var undecided = models
            .Where(t => !t.IsDefined(typeof(AuthorizeAttribute), inherit: true)
                        && !t.IsDefined(typeof(AllowAnonymousAttribute), inherit: true))
            .Select(Name)
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToList();

        undecided.ShouldBeEmpty(
            "Şu sayfa modellerinde yetki işareti yok — oturumsuz açılırlar. [Authorize] ekleyin; sayfa " +
            "gerçekten herkese açıksa [AllowAnonymous] yazıp aşağıdaki listeye ekleyin:\n" + string.Join("\n", undecided));
    }

    /// <summary>
    /// Oturumsuz açılan sayfalar SAYILIDIR. Bir sayfayı herkese açmak bilinçli bir karardır: bu
    /// listeye dokunmadan yapılamaz.
    /// </summary>
    [Fact]
    public void Oturumsuz_Acilan_Sayfalar_Bilinen_Listeden_Ibaret()
    {
        var open = PageModels()
            .Where(t => t.IsDefined(typeof(AllowAnonymousAttribute), inherit: true))
            .Select(Name)
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToList();

        open.ShouldBe(KnownAnonymousPages.OrderBy(n => n, StringComparer.Ordinal).ToList(), ignoreOrder: false);
    }

    private static readonly string[] KnownAnonymousPages =
    {
        // Giriş ve hesap akışı (oturum açmadan önce görülür)
        "Account.ApyaLoginModel",
        "Account.ApyaRegisterModel",
        "Account.ApyaForgotPasswordModel",
        "Account.ApyaResetPasswordModel",
        "Account.ApyaAccessDeniedModel",
        "AccessDenied.IndexModel",
        // Kök: yalnız /Dashboard'a yönlendirir; girişe düşüren Dashboard'ın kendi kapısıdır
        "IndexModel",
        // Kayıt talebi ve protokol onayı (henüz hesabı olmayan kurum)
        "Account.RegistrationRequestModel",
        "Account.RegistrationRequestSentModel",
        "Account.ProtokolModel",
        "Account.ProtokolTamamModel",
        // Herkese açık vitrin ve yasal metinler
        "Hibeler.IndexModel",
        "Hibeler.DetayModel",
        "Hibeler.RandevuModel",
        "Legal.AydinlatmaModel",
        "Legal.GizlilikModel",
        // Bağlantıyla paylaşım (anahtar bağlantının kendisinde): form, görev, teslim paketi
        "F.IndexModel",
        "Paylasim.IndexModel",
        "Share.IndexModel"
    };

    /// <summary>İsteği OTURUMSUZ atar (sahte principal boş kimlikle değiştirilir).</summary>
    private async Task AnonymousAsync(Func<HttpClient, Task> action)
    {
        Server.PreserveExecutionContext = true;
        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(new ClaimsPrincipal(new ClaimsIdentity())))
        {
            using var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
            await action(client);
        }
    }

    /// <summary>
    /// Davranışın kendisi: bu iki pencerenin açılışı hiçbir servis çağırmaz, yani işaret olmadan
    /// oturumsuz ziyaretçiye 200 ile çiziliyorlardı. (İşaretsiz diğer sayfalar açılışta yetkili bir
    /// servis çağırdığı için zaten reddediliyordu; onları kilitleyen yukarıdaki sözleşme testidir.)
    /// </summary>
    [Theory]
    [InlineData("/AiCenter/Providers/CreateModal")]
    [InlineData("/AiCenter/PromptCategories/CreateModal")]
    public async Task Oturumsuz_Ziyaretci_Sayfayi_Alamaz(string url)
    {
        await AnonymousAsync(async client =>
        {
            var response = await client.GetAsync(url);

            response.StatusCode.ShouldNotBe(HttpStatusCode.OK, $"{url} oturumsuz açıldı");
        });
    }
}
