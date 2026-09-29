using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Pages.Shared;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp.Localization;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Erişim reddi (ROL-05, ACC-12, SHL-11, GRT-14): oturumlu kullanıcı yasaklı sayfada uygulama
/// kabuğundaki /AccessDenied'ı görür — reddin sebebi (paket / rol / host'a özel ekran / bilinmiyor) ve
/// gidebileceği yer ("Paketimi görüntüle" yalnız Paketim'i açabilene, "Genel Bakış'a dön" yalnız Genel
/// Bakış'ı açabilene, "Geri dön"). "Girişe dön" yalnız oturumsuza, eski hesap düzeninde.
///
/// <para>Sunum kararı <see cref="ErrorStates.ForAccessDenial"/>'da (saf, anahtar döndüren
/// yerelleştiriciyle); sebebin kendisi EFCore'da gerçek paket tavanıyla
/// (AccessDenialExplainer_Tests); sayfa ve yönlendirmeler <see cref="Render"/>'da.</para>
/// </summary>
public class AccessDeniedPage_Tests
{
    private static readonly ErrorPage_Tests.KeyLocalizer L = new();

    private static AccessDenialExplanation Explanation(
        AccessDenialReason reason, string? permissionDisplayName = null, string? module = null)
        => new(reason, "Platform.X", permissionDisplayName, module);

    private static bool Links(EmptyStateModel state, string url)
        => state.ActionUrl == url || state.SecondaryActions.Any(a => a.Url == url);

    [Fact]
    public void Paket_sebebi_Paketimi_birincil_Genel_Bakisi_ikincil_yapar()
    {
        var state = ErrorStates.ForAccessDenial(
            Explanation(AccessDenialReason.Package, module: "Hibe Yönetimi"), canOpenDashboard: true, canViewSubscription: true, L);

        state.Kind.ShouldBe("denied-package");
        state.Description.ShouldBe("AccessDenied:Package(Hibe Yönetimi)");
        state.Hint.ShouldBe("AccessDenied:Package:CanView");
        state.ActionUrl.ShouldBe(ErrorStates.SubscriptionUrl);
        state.SecondaryActions.ShouldContain(a => a.Url == ErrorStates.DashboardUrl);
        state.Title.ShouldBe("AccessDenied:Title");
        state.Variant.ShouldBe(EmptyStateVariant.Page);
    }

    [Fact]
    public void Paketimi_acamayana_Paketim_baglantisi_basilmaz()
    {
        var state = ErrorStates.ForAccessDenial(
            Explanation(AccessDenialReason.Package), canOpenDashboard: true, canViewSubscription: false, L);

        state.Description.ShouldBe("AccessDenied:Package:Generic");
        state.Hint.ShouldBe("AccessDenied:Package:AskAdmin");
        Links(state, ErrorStates.SubscriptionUrl).ShouldBeFalse("Paketim TenantSettings ister; izinsize 403'e götürürdü");
        state.ActionUrl.ShouldBe(ErrorStates.DashboardUrl);
    }

    [Fact]
    public void Rol_sebebi_eksik_yetkinin_gorunen_adini_soyler()
    {
        var state = ErrorStates.ForAccessDenial(
            Explanation(AccessDenialReason.NotGranted, "Faturalar"), canOpenDashboard: true, canViewSubscription: true, L);

        state.Kind.ShouldBe("denied-notgranted");
        state.Description.ShouldBe("AccessDenied:NotGranted");
        state.Hint.ShouldBe("AccessDenied:NotGranted:Permission(Faturalar) AccessDenied:AskAdmin");
        Links(state, ErrorStates.SubscriptionUrl).ShouldBeFalse("rol kısıtında paket yükseltmek bir şey açmaz");
    }

    [Theory]
    [InlineData(AccessDenialReason.HostOnly, "denied-hostonly", "AccessDenied:HostOnly")]
    [InlineData(AccessDenialReason.TenantOnly, "denied-tenantonly", "AccessDenied:TenantOnly")]
    public void Taraf_sebebinde_Paketim_basilmaz(AccessDenialReason reason, string kind, string description)
    {
        var state = ErrorStates.ForAccessDenial(Explanation(reason), canOpenDashboard: true, canViewSubscription: true, L);

        state.Kind.ShouldBe(kind);
        state.Description.ShouldBe(description);
        Links(state, ErrorStates.SubscriptionUrl).ShouldBeFalse("hiçbir paket host'a özel ekranı açmaz");
        state.ActionUrl.ShouldBe(ErrorStates.DashboardUrl);
    }

    [Fact]
    public void Bilinmeyen_sebepte_iki_olasilik_birlikte_Paketim_ikincil()
    {
        var withPackage = ErrorStates.ForAccessDenial(
            AccessDenialExplanation.Unknown, canOpenDashboard: true, canViewSubscription: true, L);
        withPackage.Kind.ShouldBe("denied-unknown");
        withPackage.Description.ShouldBe("AccessDenied:Unknown");
        withPackage.Hint.ShouldBe("AccessDenied:Unknown:CanView");
        withPackage.ActionUrl.ShouldBe(ErrorStates.DashboardUrl);
        withPackage.SecondaryActions.ShouldContain(a => a.Url == ErrorStates.SubscriptionUrl);

        var withoutPackage = ErrorStates.ForAccessDenial(
            AccessDenialExplanation.Unknown, canOpenDashboard: true, canViewSubscription: false, L);
        withoutPackage.Hint.ShouldBe("AccessDenied:AskAdmin");
        Links(withoutPackage, ErrorStates.SubscriptionUrl).ShouldBeFalse();
    }

    [Fact]
    public void Genel_Bakisi_acamayana_Genel_Bakis_basilmaz_Geri_don_hep_var()
    {
        foreach (var reason in Enum.GetValues<AccessDenialReason>())
        {
            var state = ErrorStates.ForAccessDenial(Explanation(reason), canOpenDashboard: false, canViewSubscription: true, L);

            Links(state, ErrorStates.DashboardUrl).ShouldBeFalse(reason + ": Genel Bakış'ın kendisi 403 verirdi");
            Links(state, ErrorStates.LoginUrl).ShouldBeFalse(reason + ": oturumlu kullanıcıya giriş bağlantısı yok");
            state.SecondaryActions.Last().Attributes!.ShouldContainKey(EmptyStateAction.BackHook);
        }
    }

    /// <summary>"Paketimi görüntüle" izin kapısı Paketim sayfasının kapısıyla aynı kalmalı (403'e götürmesin).</summary>
    [Fact]
    public void Paketim_kapisi_Subscription_sayfasinin_iznine_bagli()
    {
        typeof(Apya.Platform.Web.Pages.Subscription.IndexModel).GetCustomAttribute<AuthorizeAttribute>()!.Policy
            .ShouldBe(PlatformPermissions.TenantSettings.Default);
    }

    public class Render : PlatformWebTestBase
    {
        private static HtmlNode StateOf(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            return doc.DocumentNode.SelectSingleNode("//div[@data-apya-state]")!;
        }

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

        [Fact]
        public async Task Oturumlu_kullanici_uygulama_kabugunda_sebep_ve_eylem_gorur()
        {
            var html = await GetResponseAsStringAsync(
                "/AccessDenied?returnUrl=%2FInvoices&permission=Platform.Invoices&culture=tr&ui-culture=tr");

            html.ShouldContain("lpx-sidebar", customMessage: "uygulama düzeni (kabuk) basılmalı");
            html.ShouldNotContain("apya-auth__card", customMessage: "hesap (giriş) düzeni basılmamalı");

            // Host bağlamı: paket tavanından muaf → sebep rol.
            var state = StateOf(html);
            state.GetAttributeValue("data-apya-state", "").ShouldBe("denied-notgranted");
            WebUtility.HtmlDecode(state.InnerText).ShouldContain("Gereken yetki: Faturalar.");

            var hrefs = state.SelectNodes(".//a")!.Select(a => a.GetAttributeValue("href", "")).ToList();
            hrefs.ShouldContain("/Dashboard");
            hrefs.ShouldNotContain(h => h.StartsWith("/Account/Login", StringComparison.OrdinalIgnoreCase));
            state.SelectSingleNode(".//button[@data-apya-back]").ShouldNotBeNull();
        }

        /// <summary>X-Requested-With'li istek HTML almaz ("Unexpected token &lt;" kaynağı).</summary>
        [Fact]
        public async Task AJAX_istegi_govdesiz_403_alir()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/AccessDenied?returnUrl=%2FInvoices");
            request.Headers.Add("X-Requested-With", "XMLHttpRequest");

            var response = await Client.SendAsync(request);

            response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
            (await response.Content.ReadAsStringAsync()).ShouldNotContain("<html");
        }

        /// <summary>Açık Forbid() ve eski yer imleri çerez yolundan gelir: oturumluyu uygulama sayfasına aktarır.</summary>
        [Fact]
        public async Task Hesap_sayfasi_oturumluyu_uygulama_sayfasina_yonlendirir()
        {
            using var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

            var response = await client.GetAsync("/Account/AccessDenied?ReturnUrl=%2FGrants");

            response.StatusCode.ShouldBe(HttpStatusCode.Redirect);
            response.Headers.Location!.OriginalString.ShouldBe("/AccessDenied?returnUrl=%2FGrants");
        }

        /// <summary>Oturumsuz görünüm AYNEN: hesap düzeni + "Girişe dön"; iki sayfa arasında döngü yok.</summary>
        [Fact]
        public async Task Oturumsuz_kullanici_eski_hesap_sayfasini_gorur()
        {
            await AnonymousAsync(async client =>
            {
                var redirect = await client.GetAsync("/AccessDenied?returnUrl=%2FGrants");
                redirect.StatusCode.ShouldBe(HttpStatusCode.Redirect);
                redirect.Headers.Location!.OriginalString.ShouldBe("/Account/AccessDenied?ReturnUrl=%2FGrants");

                var page = await client.GetAsync("/Account/AccessDenied");
                page.StatusCode.ShouldBe(HttpStatusCode.OK);
                var html = await page.Content.ReadAsStringAsync();
                html.ShouldContain("apya-auth__card");
                html.ShouldContain("href=\"/Account/Login");
            });
        }

        /// <summary>ACC-12 (PD B): oturum açıkken giriş formu KALIR, üstünde durum şeridi; oturumsuzda şerit yok.</summary>
        [Fact]
        public async Task Giris_sayfasi_oturum_aciksa_bilgi_seridi_basar()
        {
            var signedIn = await GetResponseAsStringAsync("/Account/Login?culture=tr&ui-culture=tr");
            var decoded = WebUtility.HtmlDecode(signedIn);
            decoded.ShouldContain("olarak oturum açtınız.");
            signedIn.ShouldContain("href=\"/Account/Logout\"");
            signedIn.ShouldContain("name=\"LoginInput.UserNameOrEmailAddress\"", customMessage: "form kalır — yönlendirme yok");

            await AnonymousAsync(async client =>
            {
                var response = await client.GetAsync("/Account/Login?culture=tr&ui-culture=tr");
                response.StatusCode.ShouldBe(HttpStatusCode.OK);
                var html = WebUtility.HtmlDecode(await response.Content.ReadAsStringAsync());
                html.ShouldNotContain("olarak oturum açtınız.");
                html.ShouldNotContain("href=\"/Account/Logout\"");
            });
        }

        /// <summary>Yeni metinler Türkçede çözülür (anahtar ekranda görünmez).</summary>
        [Fact]
        public void Yeni_anahtarlar_Turkcede_cozulur()
        {
            var localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
            string[] keys =
            {
                "ErrorPage:BackToDashboard", "ErrorPage:GoBack", "ErrorPage:SignIn", "ErrorPage:StatusCode",
                "ErrorPage:BadRequest:Title", "ErrorPage:BadRequest:Description",
                "ErrorPage:Unauthorized:Title", "ErrorPage:Unauthorized:Description",
                "ErrorPage:Forbidden:Title", "ErrorPage:Forbidden:Description",
                "ErrorPage:NotFound:Title", "ErrorPage:NotFound:Description",
                "ErrorPage:RecordNotFound:Title", "ErrorPage:RecordNotFound:Description",
                "ErrorPage:ServerError:Title", "ErrorPage:ServerError:Description",
                "ErrorPage:Generic:Title", "ErrorPage:Generic:Description", "ErrorPage:Business:Title",
                "AccessDenied:Title", "AccessDenied:PageDescription", "AccessDenied:Package",
                "AccessDenied:Package:Generic", "AccessDenied:Package:CanView", "AccessDenied:Package:AskAdmin",
                "AccessDenied:HostOnly", "AccessDenied:TenantOnly", "AccessDenied:NotGranted",
                "AccessDenied:NotGranted:Permission", "AccessDenied:AskAdmin", "AccessDenied:Unknown",
                "AccessDenied:Unknown:CanView", "AccessDenied:ViewPackage",
                "Login:AlreadySignedIn", "Login:AlreadySignedIn:Hint", "Login:SignOut", "Common:Retry"
            };

            using (CultureHelper.Use("tr"))
            {
                var missing = keys.Where(k => localizer[k].ResourceNotFound || localizer[k].Value == k).ToList();
                missing.ShouldBeEmpty("çözülmeyen anahtar ekranda ham görünür: " + string.Join(", ", missing));
                localizer["ErrorPage:StatusCode", 404].Value.ShouldBe("Hata kodu 404");
            }
        }
    }
}
