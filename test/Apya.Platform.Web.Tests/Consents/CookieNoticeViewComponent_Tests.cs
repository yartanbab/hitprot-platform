using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.Components.CookieNotice;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using NSubstitute;
using Shouldly;
using Volo.Abp.Settings;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.Consents;

/// <summary>
/// Çerez şeridinin "ne zaman görünür" kararı. Şerit yanlış tarafa kırılırsa
/// kullanıcı onayı sessizce kaybolur: "Anladım" denmiş olmasına rağmen her
/// sayfada geri gelir. Onayın İKİ dayanağı var (çerez, sonra kullanıcı ayarı);
/// ikisi de burada bağlanır.
/// </summary>
public class CookieNoticeViewComponent_Tests
{
    private readonly ISettingProvider _settings = Substitute.For<ISettingProvider>();

    private CookieNoticeViewComponent Build(bool hasCookie, bool authenticated, bool settingAcknowledged)
    {
        // IsTrueAsync ABP'de bir UZANTI metodudur (arayüz üyesi değil) — taklit
        // edilemez; altında çağırdığı GetOrNullAsync kurulur.
        _settings.GetOrNullAsync(PlatformSettings.CookieNotice.Acknowledged)
                 .Returns(settingAcknowledged ? "true" : "false");

        var user = Substitute.For<ICurrentUser>();
        user.IsAuthenticated.Returns(authenticated);

        var http = new DefaultHttpContext();
        if (hasCookie)
        {
            http.Request.Headers.Cookie =
                $"{ConsentConsts.CookieNoticeAckCookieName}={ConsentConsts.CookiePolicyVersion}";
        }

        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());

        return new CookieNoticeViewComponent(_settings, user)
        {
            ViewComponentContext = new ViewComponentContext
            {
                // ViewComponentContext.ViewData salt okunur; ViewContext'ten türetilir.
                ViewContext = new Microsoft.AspNetCore.Mvc.Rendering.ViewContext
                {
                    HttpContext = http,
                    ViewData = viewData
                }
            }
        };
    }

    /// <summary>View'ın modeli = "onaylandı mı?"; true ise şerit hiç basılmaz.</summary>
    private static async Task<bool> RendersAsync(CookieNoticeViewComponent component)
    {
        var viewData = ((ViewViewComponentResult)await component.InvokeAsync()).ViewData;
        return !(bool)viewData!.Model!;
    }

    [Fact]
    public async Task Onayi_olmayan_ziyaretciye_gosterilir()
    {
        (await RendersAsync(Build(hasCookie: false, authenticated: false, settingAcknowledged: false)))
            .ShouldBeTrue();
    }

    [Fact]
    public async Task Onay_cerezi_varsa_gosterilmez()
    {
        (await RendersAsync(Build(hasCookie: true, authenticated: false, settingAcknowledged: false)))
            .ShouldBeFalse();
    }

    /// <summary>
    /// Şerit HER sayfada çalışır; çerez varken ayar okumak her istek başına
    /// gereksiz bir sorgu demektir. Ucuz yolun ucuz kaldığını burası tutar.
    /// </summary>
    [Fact]
    public async Task Cerez_varken_ayar_hic_sorgulanmaz()
    {
        await RendersAsync(Build(hasCookie: true, authenticated: true, settingAcknowledged: false));

        await _settings.DidNotReceive().GetOrNullAsync(PlatformSettings.CookieNotice.Acknowledged);
    }

    /// <summary>
    /// Asıl kalıcılık iddiası: çerez silinmiş / başka tarayıcıya geçilmiş olsa da
    /// bir kez "Anladım" demiş kullanıcıya şerit bir daha gösterilmez.
    /// </summary>
    [Fact]
    public async Task Cerez_yoksa_bile_kullanici_ayari_onayliysa_gosterilmez()
    {
        (await RendersAsync(Build(hasCookie: false, authenticated: true, settingAcknowledged: true)))
            .ShouldBeFalse();
    }

    [Fact]
    public async Task Onaylamamis_kullaniciya_gosterilir()
    {
        (await RendersAsync(Build(hasCookie: false, authenticated: true, settingAcknowledged: false)))
            .ShouldBeTrue();
    }
}
