using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Görünüm sekmesi etiketleri (Liste / Kanban / Zaman Çizelgesi) HEM Görevler
/// sayfasında HEM proje konsolunda AYNI anahtarlardan gelir. Konsol bir süre
/// bunları koda gömülü tutuyordu ve iki ekran ayrışmıştı ("Tablo/Gantt" ↔
/// "Liste/Zaman Çizelgesi").
///
/// Bu test iki şeyi bağlar:
///   1. Anahtarlar GERÇEKTEN çözülüyor — çözülmezse ABP anahtarın kendisini
///      döndürür ve ekranda "Tasks:View:List" yazar (istisna atmaz, sessizce bozulur).
///      Konsol sayfası id parametresi istediği için smoke testlerinde YOK; bu
///      yüzden orada yanlış anahtar kimseye görünmeden geçebilirdi.
///   2. Türkçe değerler beklenen sözcükler — ikisi tek kaynaktan beslendiği için
///      artık ayrışamazlar.
/// </summary>
public class ViewTabLocalization_Tests : PlatformWebTestBase
{
    private readonly IStringLocalizer<PlatformResource> _localizer;

    public ViewTabLocalization_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    [Theory]
    [InlineData("Tasks:View:List")]
    [InlineData("Tasks:View:Kanban")]
    [InlineData("Tasks:View:Gantt")]
    public void Sekme_anahtarlari_cozulur(string key)
    {
        var value = _localizer[key];

        value.ResourceNotFound.ShouldBeFalse($"'{key}' localization'da yok — ekranda anahtarın kendisi görünür.");
        value.Value.ShouldNotBe(key);
    }

    /// <summary>
    /// Yukarıdaki testin BOŞ OLMADIĞINI kanıtlar: eksik bir anahtar gerçekten
    /// ResourceNotFound ile işaretleniyor mu? İşaretlenmeseydi "anahtarlar
    /// çözülüyor" iddiası hiçbir şey ölçmüyor olurdu.
    /// </summary>
    [Fact]
    public void Olmayan_anahtar_ResourceNotFound_ile_isaretlenir()
    {
        var value = _localizer["Tasks:View:BoyleBirAnahtarYok"];

        value.ResourceNotFound.ShouldBeTrue();
        value.Value.ShouldBe("Tasks:View:BoyleBirAnahtarYok");
    }

    [Fact]
    public void Sekme_etiketleri_konsoldaki_sozcuklerle_ayni()
    {
        _localizer["Tasks:View:List"].Value.ShouldBe("Liste");
        _localizer["Tasks:View:Kanban"].Value.ShouldBe("Kanban");
        _localizer["Tasks:View:Gantt"].Value.ShouldBe("Zaman Çizelgesi");
    }
}
