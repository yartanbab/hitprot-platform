using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.Components.ProductTour;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using NSubstitute;
using Shouldly;
using Volo.Abp.Settings;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.Tour;

/// <summary>
/// Turun "ne zaman görünür" kararı. İki yönü de kırılırsa kimse fark etmez:
/// hiç açılmazsa özellik ölü kalır, hep açılırsa her sayfada kullanıcının
/// yüzüne çarpar. Görsel/JS tarafı canlı QA ile doğrulanır; burada yalnız karar
/// mantığı bağlanır (oturum gerektirmez).
/// </summary>
public class ProductTourViewComponent_Tests
{
    private static ProductTourViewComponent Build(bool authenticated, bool completed, string? tur = null)
    {
        var settings = Substitute.For<ISettingProvider>();
        // IsTrueAsync ABP'de bir UZANTI metodudur (arayüz üyesi değil) — taklit
        // edilemez; altında çağırdığı GetOrNullAsync kurulur.
        settings.GetOrNullAsync(PlatformSettings.Tour.Completed)
                .Returns(completed ? "true" : "false");

        var user = Substitute.For<ICurrentUser>();
        user.IsAuthenticated.Returns(authenticated);

        var http = new DefaultHttpContext();
        if (tur != null)
        {
            http.Request.QueryString = new QueryString($"?tur={tur}");
        }

        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());

        return new ProductTourViewComponent(settings, user)
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

    private static async Task<bool> RendersAsync(ProductTourViewComponent component)
    {
        var result = await component.InvokeAsync();
        return result is not ContentViewComponentResult;
    }

    [Fact]
    public async Task Turu_gormemis_kullaniciya_gosterilir()
    {
        (await RendersAsync(Build(authenticated: true, completed: false))).ShouldBeTrue();
    }

    [Fact]
    public async Task Turu_bitirmis_kullaniciya_gosterilmez()
    {
        (await RendersAsync(Build(authenticated: true, completed: true))).ShouldBeFalse();
    }

    [Fact]
    public async Task Oturumsuz_istekte_gosterilmez()
    {
        (await RendersAsync(Build(authenticated: false, completed: false))).ShouldBeFalse();
    }

    /// <summary>
    /// Kullanıcı menüsündeki "Tanıtım turu" bağlantısı ?tur=1 ile gelir; turu
    /// bitirmiş kullanıcı için pencerenin yeniden açılmasını sağlayan tek yol budur.
    /// </summary>
    [Fact]
    public async Task Tur_1_ile_bitirmis_kullaniciya_da_gosterilir()
    {
        (await RendersAsync(Build(authenticated: true, completed: true, tur: "1"))).ShouldBeTrue();
    }

    [Fact]
    public async Task Tur_1_oturumsuz_istegi_acmaz()
    {
        (await RendersAsync(Build(authenticated: false, completed: true, tur: "1"))).ShouldBeFalse();
    }

    /// <summary>Rastgele bir ?tur değeri pencereyi açmaz — yalnız "1" kabul edilir.</summary>
    [Fact]
    public async Task Tur_baska_deger_ise_gosterilmez()
    {
        (await RendersAsync(Build(authenticated: true, completed: true, tur: "0"))).ShouldBeFalse();
    }
}
