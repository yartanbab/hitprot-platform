using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Web.Tour;
using Microsoft.Extensions.Localization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tour;

/// <summary>
/// Tanıtım turunun iki sessiz kırılma noktasını bağlar:
///
///   1. <b>Görsel ↔ katalog ayrışması.</b> Slayt görselleri kodda değil,
///      <c>docs/sunum/build/render.sh</c> ile üretilip <c>wwwroot/tanitim/</c>'e
///      kopyalanıyor. Kataloğa slayt eklenip render.sh'in dosya listesi
///      güncellenmezse turda kırık görsel çıkar — istisna atmaz, sessizce bozulur.
///
///   2. <b>Eksik çeviri.</b> Anahtar çözülmezse ABP anahtarın kendisini döndürür
///      ve pencerede "Tour:Slide:Flow:Title" yazar. Tur smoke testlerinde
///      görünmediği (yalnız turu görmemiş oturumlu kullanıcıya render edildiği)
///      için bu, kimseye görünmeden yayına çıkabilirdi.
/// </summary>
public class ProductTour_Tests : PlatformWebTestBase
{
    private readonly IStringLocalizer<PlatformResource> _localizer;

    public ProductTour_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    public static IEnumerable<object[]> Slides =>
        TourSlideCatalog.All.Select(s => new object[] { s.Image, s.TitleKey, s.BodyKey });

    [Theory]
    [MemberData(nameof(Slides))]
    public async Task Katalogdaki_gorsel_sunuluyor(string image, string titleKey, string bodyKey)
    {
        _ = titleKey;
        _ = bodyKey;

        var response = await Client.GetAsync($"{TourSlideCatalog.AssetPath}/{image}");

        ((int)response.StatusCode).ShouldBe(200,
            $"'{image}' wwwroot/tanitim altında yok. docs/sunum/build/render.sh all çalıştır; " +
            "kataloğa yeni slayt eklendiyse render.sh'teki dosya numarası listesini de güncelle.");
    }

    [Fact]
    public async Task Tam_sunum_pdf_indirilebilir()
    {
        var response = await Client.GetAsync(TourSlideCatalog.PdfPath);

        ((int)response.StatusCode).ShouldBe(200,
            "Turdaki 'PDF indir' düğmesi 404 verir. docs/sunum/build/render.sh all çalıştır.");
        response.Content.Headers.ContentType?.MediaType.ShouldBe("application/pdf");
    }

    [Theory]
    [MemberData(nameof(Slides))]
    public void Katalog_metinleri_cozulur(string image, string titleKey, string bodyKey)
    {
        _ = image;

        foreach (var key in new[] { titleKey, bodyKey })
        {
            var value = _localizer[key];
            value.ResourceNotFound.ShouldBeFalse($"'{key}' localization'da yok — turda anahtarın kendisi görünür.");
            value.Value.ShouldNotBe(key);
        }
    }

    [Theory]
    [InlineData("Menu:ProductTour")]
    [InlineData("Tour:Kicker")]
    [InlineData("Tour:Close")]
    [InlineData("Tour:DownloadPdf")]
    [InlineData("Tour:GoToSlide")]
    [InlineData("Tour:Skip")]
    [InlineData("Tour:Prev")]
    [InlineData("Tour:Next")]
    [InlineData("Tour:Done")]
    public void Arayuz_metinleri_cozulur(string key)
    {
        var value = _localizer[key];

        value.ResourceNotFound.ShouldBeFalse($"'{key}' localization'da yok.");
        value.Value.ShouldNotBe(key);
    }

    /// <summary>
    /// Yukarıdaki çeviri testlerinin BOŞ OLMADIĞINI kanıtlar: eksik bir anahtar
    /// gerçekten ResourceNotFound ile işaretleniyor mu?
    /// </summary>
    [Fact]
    public void Olmayan_anahtar_ResourceNotFound_ile_isaretlenir()
    {
        _localizer["Tour:Slide:BoyleBirSeyYok"].ResourceNotFound.ShouldBeTrue();
    }

    /// <summary>
    /// Tur ilk giriş penceresidir: uzunluğu kasten kısa tutuldu. Katalog büyürse
    /// bu test hatırlatır — 16 slaytın tamamı PDF ile sunulur, turda değil.
    /// </summary>
    [Fact]
    public void Tur_kisa_kalir()
    {
        TourSlideCatalog.All.Count.ShouldBeInRange(4, 8);
        TourSlideCatalog.All.Select(s => s.Image).Distinct().Count()
            .ShouldBe(TourSlideCatalog.All.Count, "Aynı slayt iki kez listelenmiş.");
    }
}
