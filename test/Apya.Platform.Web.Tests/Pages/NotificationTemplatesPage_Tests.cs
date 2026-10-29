using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>Faz 4 · Host: Görev / Proje bildirim metinleri ekranı.</summary>
public class NotificationTemplatesPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Notifications/Templates");

        html.ShouldContain("apya-nt-layout");
        html.ShouldContain("Değişkenler");
        html.ShouldContain("/Grants/NotificationTemplates", customMessage: "hibe şablonlarına bağlantı verir");
        // Paketleyici yolu noktayla birleştirebilir (Pages.Notifications.Templates.<sürüm>.js).
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Notifications[./]Templates[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Templates.js içermeli");
    }
}
