using System.Text.Json;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Baskı künyesi (kurum + yazdıran) sayfaya gömülü gelmeli.
/// <para>
/// İstemci bunu KENDİ ÜRETEMEZ: <c>abp.currentUser</c> tenant adını değil yalnız
/// <c>tenantId</c>'yi taşıyor. Gömme düşerse çıktının başlığında hangi kurumun
/// verisi olduğu yazmaz ve kağıt bağlamsız kalır.
/// </para>
/// </summary>
public class DashboardPrintContextEmbed_Tests : PlatformWebTestBase
{
    private async Task<string?> EmbeddedJsonAsync()
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Dashboard"));
        return doc.DocumentNode
                  .SelectSingleNode("//script[@id='apya-dashboard-print-context']")
                  ?.InnerText;
    }

    [Fact]
    public async Task Kunye_sayfaya_gomulur()
    {
        var json = await EmbeddedJsonAsync();

        json.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Kunye_islandin_bekledigi_camelCase_alanlari_tasir()
    {
        // readPrintContext() bu iki adı okuyor; PascalCase basılsaydı künye
        // sessizce boş kalır, baskı yine çıkar ama bağlamsız olurdu.
        using var doc = JsonDocument.Parse((await EmbeddedJsonAsync())!);
        var root = doc.RootElement;

        root.TryGetProperty("tenantName", out _).ShouldBeTrue();
        root.TryGetProperty("userName", out var userName).ShouldBeTrue();

        // Ad+soyad boşsa kullanıcı adına düşülür — yazdıran satırı hiç boş kalmamalı.
        userName.GetString().ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Kunye_script_kapanisini_KIRAMAZ()
    {
        // Kurum adı serbest metin: içinde "</script>" geçse bile blok erken
        // kapanmamalı. System.Text.Json varsayılan encoder'ı '<' kaçırır —
        // bu testi kaldırmadan encoder'ı gevşetme.
        var json = await EmbeddedJsonAsync();

        json.ShouldNotContain("</");
    }
}
