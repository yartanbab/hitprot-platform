using System.Text.Json;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kart düzeni sayfaya gömülü gelmeli. Island, düzen yanıtı gelmeden HİÇBİR kart
/// render etmiyor (DashboardRoot: cards = layout?.cards ?? []) — yani 8 widget
/// isteği bu tek yanıtı bekliyordu. Gömme o turu tamamen kaldırır.
/// </summary>
public class DashboardLayoutEmbed_Tests : PlatformWebTestBase
{
    private async Task<string?> EmbeddedJsonAsync()
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Dashboard"));
        return doc.DocumentNode
                  .SelectSingleNode("//script[@id='apya-dashboard-layout']")
                  ?.InnerText;
    }

    [Fact]
    public async Task Duzen_sayfaya_gomulur()
    {
        var json = await EmbeddedJsonAsync();

        json.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Gomulu_JSON_islandin_bekledigi_camelCase_sekilde()
    {
        // Uçtan gelen yanıtla AYNI şekil olmalı; PascalCase basılsaydı island
        // "layout.cards" bulamaz, gömme sessizce ETKİSİZ kalırdı.
        using var doc = JsonDocument.Parse((await EmbeddedJsonAsync())!);
        var root = doc.RootElement;

        root.TryGetProperty("viewKey", out var viewKey).ShouldBeTrue();
        viewKey.GetString().ShouldNotBeNullOrWhiteSpace();

        root.TryGetProperty("cards", out var cards).ShouldBeTrue();
        cards.ValueKind.ShouldBe(JsonValueKind.Array);
        cards.GetArrayLength().ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task Gomulu_JSON_script_kapanisini_KIRAMAZ()
    {
        // <script> bloğunun içine ham JSON basıyoruz: kart adında "</script>"
        // geçse bile blok erken kapanmamalı. System.Text.Json varsayılan
        // encoder'ı '<' karakterini kaçırır — bu testi kaldırmadan encoder'ı
        // gevşetme.
        var json = await EmbeddedJsonAsync();

        json.ShouldNotContain("</");
    }
}
