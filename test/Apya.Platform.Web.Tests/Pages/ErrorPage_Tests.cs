using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages.Shared;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Http;
using Volo.Abp.Validation;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Genel hata sayfası (SHL-19): ABP'nin her kodda "sunucu tarafında beklenmedik hata" diyen, eylemsiz
/// görünümü yerine Views/Error/Default.cshtml durum koduna göre başlık/açıklama + eylem basar.
///
/// <para>Karar mantığı <see cref="ErrorStates.ForStatusCode"/>'da (saf; burada anahtar döndüren
/// yerelleştiriciyle ölçülür — hangi metnin seçildiği kesin görünür). Görünümün ABP'ninkini gerçekten
/// ezdiği ve kodla birlikte doğru basıldığı <see cref="Render"/>'da, /Error?httpStatusCode= ucuyla
/// (üretimdeki yönlendirme/yeniden yürütme hattı yerelde görünmez; ortak tanımı HtmlNavigation_Tests
/// kilitler).</para>
/// </summary>
public class ErrorPage_Tests
{
    /// <summary>Anahtarı (ve argümanları) döndürür: seçilen metin kültürden bağımsız okunur.</summary>
    internal sealed class KeyLocalizer : IStringLocalizer
    {
        public LocalizedString this[string name] => new(name, name);

        public LocalizedString this[string name, params object[] arguments]
            => new(name, name + "(" + string.Join(",", arguments) + ")");

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => Array.Empty<LocalizedString>();
    }

    private static readonly KeyLocalizer L = new();

    private static EmptyStateModel State(
        int statusCode,
        Exception? exception = null,
        RemoteServiceErrorInfo? errorInfo = null,
        bool isAuthenticated = true,
        bool canOpenDashboard = true,
        bool isGetRequest = true,
        string? originalPath = null)
        => ErrorStates.ForStatusCode(statusCode, exception, errorInfo, isAuthenticated, canOpenDashboard,
            isGetRequest, originalPath, L);

    [Theory]
    [InlineData(400, "error-400", "ErrorPage:BadRequest:Title")]
    [InlineData(401, "error-401", "ErrorPage:Unauthorized:Title")]
    [InlineData(403, "error-403", "ErrorPage:Forbidden:Title")]
    [InlineData(404, "error-404", "ErrorPage:NotFound:Title")]
    [InlineData(500, "error-500", "ErrorPage:ServerError:Title")]
    [InlineData(503, "error-503", "ErrorPage:ServerError:Title")]
    [InlineData(418, "error-generic", "ErrorPage:Generic:Title")]
    public void Durum_koduna_gore_baslik_ve_isaret(int statusCode, string kind, string titleKey)
    {
        var state = State(statusCode);

        state.Kind.ShouldBe(kind);
        state.Title.ShouldBe(titleKey);
        state.Description.ShouldBe(titleKey.Replace(":Title", ":Description"));
        state.Footnote.ShouldBe($"ErrorPage:StatusCode({statusCode})");
        state.Variant.ShouldBe(EmptyStateVariant.Page);
        state.IsPageHeading.ShouldBeTrue();
        state.Role.ShouldBeNull("sayfa yüklenişinde role=alert basılmaz; başlık sayfa başlığıdır");
    }

    [Fact]
    public void Yetki_istisnasi_ABP_teknik_mesajini_gostermez()
    {
        var errorInfo = new RemoteServiceErrorInfo("Authorization failed! Given policy has not granted.");

        var forbidden = State(403, new AbpAuthorizationException("Authorization failed! Given policy has not granted."), errorInfo);
        forbidden.Kind.ShouldBe("error-403");
        forbidden.Title.ShouldBe("ErrorPage:Forbidden:Title");
        forbidden.Description.ShouldBe("ErrorPage:Forbidden:Description");

        var unauthorized = State(401, new AbpAuthorizationException("x"), errorInfo);
        unauthorized.Kind.ShouldBe("error-401");
    }

    /// <summary>
    /// GERİLEME KİLİDİ: ABP iş kuralı istisnasını 403'e eşler. "Yetkiniz yok" metni yazılsaydı bugün
    /// ABP görünümünün gösterdiği kural mesajı yutulurdu.
    /// </summary>
    [Fact]
    public void Is_kurali_istisnasinin_mesaji_korunur()
    {
        var state = State(403, new BusinessException("Platform:Error:X"),
            new RemoteServiceErrorInfo("Özel kural", "Ayrıntı satırı", "Platform:Error:X"));

        state.Kind.ShouldBe("error-business");
        state.Title.ShouldBe("ErrorPage:Business:Title");
        state.Description.ShouldBe("Özel kural");
        state.Hint.ShouldBe("Ayrıntı satırı");
    }

    [Fact]
    public void Dogrulama_hatalari_madde_olarak_basilir()
    {
        var errorInfo = new RemoteServiceErrorInfo("İsteğiniz geçerli değil!")
        {
            ValidationErrors = new[]
            {
                new RemoteServiceValidationErrorInfo("Ad zorunludur."),
                new RemoteServiceValidationErrorInfo("Tutar sıfırdan büyük olmalı.")
            }
        };

        var state = State(400, new AbpValidationException("x"), errorInfo);

        state.Kind.ShouldBe("error-business");
        state.Details.ShouldBe(new[] { "Ad zorunludur.", "Tutar sıfırdan büyük olmalı." });
    }

    [Fact]
    public void Bulunamayan_kayit_sayfadan_ayrilir_ve_tur_adi_sizmaz()
    {
        var state = State(404, new EntityNotFoundException(typeof(Project), Guid.NewGuid()),
            new RemoteServiceErrorInfo("There is no such an entity. Entity type: Apya.Platform.Projects.Project"));

        state.Kind.ShouldBe("error-404-record");
        state.Title.ShouldBe("ErrorPage:RecordNotFound:Title");
        state.Description.ShouldBe("ErrorPage:RecordNotFound:Description");
        (state.Description + state.Hint).ShouldNotContain("Project");
    }

    /// <summary>
    /// "Tekrar dene" yalnız istisna yeniden yürütmesinde (tarayıcı adresi orijinal sayfa) ve GET'te:
    /// yönlendirmede yenileme hata sayfasını yeniler, POST'u yeniden göndermek mükerrer kayıt riski.
    /// </summary>
    [Fact]
    public void Tekrar_dene_yalniz_yeniden_yurutulen_GET_5xx_te()
    {
        static bool HasRetry(EmptyStateModel s)
            => s.SecondaryActions.Any(a => a.Attributes?.ContainsKey(EmptyStateAction.RetryHook) == true);

        HasRetry(State(500, new InvalidOperationException("boom"), isGetRequest: true)).ShouldBeTrue();
        HasRetry(State(500, new InvalidOperationException("boom"), isGetRequest: false)).ShouldBeFalse();
        HasRetry(State(500)).ShouldBeFalse("durum kodu yönlendirmesi / doğrudan /Error isteği");
        HasRetry(State(404, new InvalidOperationException("boom"))).ShouldBeFalse();

        var retry = State(500, new InvalidOperationException("boom")).BuildSecondaryActions()
            .Single(a => a.Attributes.ContainsKey(EmptyStateAction.RetryHook));
        retry.Attributes["class"].ShouldBe("btn btn-sm btn-outline-primary", "karar 10: kanonik Tekrar dene görünümü");
    }

    [Fact]
    public void Eylemler_oturum_ve_Genel_Bakis_iznine_gore()
    {
        var signedIn = State(404);
        signedIn.ActionUrl.ShouldBe(ErrorStates.DashboardUrl);
        signedIn.ActionText.ShouldBe("ErrorPage:BackToDashboard");

        var anonymous = State(404, isAuthenticated: false, canOpenDashboard: false);
        anonymous.ActionUrl.ShouldBe(ErrorStates.LoginUrl);
        anonymous.ActionText.ShouldBe("ErrorPage:SignIn");

        var noDashboard = State(404, canOpenDashboard: false);
        noDashboard.ActionText.ShouldBeNull("Genel Bakış'ın kendisi 403 verirdi — döngü");
        noDashboard.SecondaryActions.ShouldNotContain(a => a.Url == ErrorStates.DashboardUrl);

        // Her durumda geçmişe dönüş (başta gizli; betik geçmiş varsa açar).
        signedIn.SecondaryActions.Last().Attributes!.ShouldContainKey(EmptyStateAction.BackHook);
        signedIn.HasClientHooks.ShouldBeTrue();
    }

    /// <summary>
    /// "Genel Bakış'a dön"ün kapısı sayfanın GERÇEK kapısıyla (iç servis) aynı kalmalı: sayfa yalnız
    /// [Authorize], ama DashboardAppService sınıf düzeyinde izin ister — ayrışırsa düğme 403'e götürür.
    /// </summary>
    [Fact]
    public void Genel_Bakis_kapisi_DashboardAppService_iznine_bagli()
    {
        typeof(DashboardAppService).GetCustomAttribute<AuthorizeAttribute>()!.Policy
            .ShouldBe(ErrorStates.DashboardPermission);
    }

    [Fact]
    public void Oturum_dusunce_giris_donus_adresi_yalniz_yerel_yolsa_eklenir()
    {
        State(401, originalPath: "/Finance").ActionUrl.ShouldBe("/Account/Login?returnUrl=%2FFinance");
        State(401, originalPath: "//evil.example").ActionUrl.ShouldBe(ErrorStates.LoginUrl);
        State(401, originalPath: "/\\evil.example").ActionUrl.ShouldBe(ErrorStates.LoginUrl);
        State(401).ActionUrl.ShouldBe(ErrorStates.LoginUrl);
    }

    /// <summary>Görünüm ABP'ninkini ezer ve durum koduyla birlikte doğru basılır.</summary>
    public class Render : PlatformWebTestBase
    {
        [Theory]
        [InlineData(400, "error-400")]
        [InlineData(401, "error-401")]
        [InlineData(403, "error-403")]
        [InlineData(404, "error-404")]
        [InlineData(500, "error-500")]
        [InlineData(418, "error-generic")]
        public async Task Hata_sayfasi_durum_koduna_gore_basilir(int statusCode, string kind)
        {
            var html = await GetResponseAsStringAsync(
                $"/Error?httpStatusCode={statusCode}&culture=tr&ui-culture=tr", (HttpStatusCode)statusCode);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var state = doc.DocumentNode.SelectSingleNode("//div[@data-apya-state]");
            state.ShouldNotBeNull("özel hata görünümü ABP'nin Views/Error/Default.cshtml'ini ezmeli");
            state!.GetAttributeValue("data-apya-state", "").ShouldBe(kind);
            state.GetAttributeValue("class", "").ShouldContain("apya-console-state");
            state.GetAttributeValue("class", "").ShouldContain("is-denied");

            var decoded = WebUtility.HtmlDecode(html);
            decoded.ShouldNotContain("sunucu tarafında beklenmedik");
            decoded.ShouldContain("Hata kodu " + statusCode);

            var title = WebUtility.HtmlDecode(doc.DocumentNode.SelectSingleNode("//title")!.InnerText).Trim();
            title.ShouldNotBe("Apya", "sekme/üst çubuk başlığı artık yalnız uygulama adı değil");
            title.ShouldContain(WebUtility.HtmlDecode(state.SelectSingleNode("strong")!.InnerText).Trim());
            state.SelectSingleNode("strong")!.GetAttributeValue("role", "").ShouldBe("heading");

            var hrefs = state.SelectNodes(".//a")?.Select(a => a.GetAttributeValue("href", "")).ToList()
                        ?? new List<string>();
            if (statusCode == 401)
            {
                hrefs.ShouldContain("/Account/Login");
                hrefs.ShouldNotContain("/Dashboard");
            }
            else
            {
                // Test host'u oturumlu (sahte principal) ve her izni verir.
                hrefs.ShouldContain("/Dashboard");
            }

            // Doğrudan /Error isteğinde istisna yeniden yürütmesi yok → "Tekrar dene" YOK.
            state.SelectSingleNode(".//*[@data-apya-retry]").ShouldBeNull();
            state.SelectSingleNode(".//button[@data-apya-back]").ShouldNotBeNull();
        }
    }
}
