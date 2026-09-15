using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 21a/22 · Host Çağrılar ekranı. Test host'u host bağlamında koşar: /Grants host dalını çizer.
/// </summary>
public class GrantCallsPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Cagrilar_Uc_Sekme_Suzgec_Ve_Kart_Izgarasiyla_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants");

        html.ShouldContain("apya-call-tabs");
        html.ShouldContain("Yayında");
        html.ShouldContain("Taslak");
        html.ShouldContain("href=\"/Grants/Sources\"");
        html.ShouldContain("IssuerFilter");
        html.ShouldContain("StateFilter");
        html.ShouldContain("SortFilter");
        html.ShouldContain("CallGrid");
        html.ShouldContain("CallList");
        html.ShouldContain("href=\"/Grants/Import\"");
        html.ShouldContain("ScrapeAllBtn");
        Regex.IsMatch(html, @"Index[^""]*\.js").ShouldBeTrue("sayfa demeti Index.js içermeli");
        Regex.IsMatch(html, @"Calls[^""]*\.css").ShouldBeTrue("sayfa demeti Calls.css içermeli");
    }

    /// <summary>Kullanıcı kararı: KPI satırı ve program penceresi kaldırıldı; çağrı penceresi kalır.</summary>
    [Fact]
    public async Task Eski_KPI_Satiri_Ve_Program_Penceresi_Yok_Cagri_Penceresi_Var()
    {
        var html = await GetResponseAsStringAsync("/Grants");

        html.ShouldNotContain("KpiTotalPrograms");
        html.ShouldNotContain("GrantModal");
        html.ShouldNotContain("NewGrantButton");
        html.ShouldContain("CallModal");
    }

    /// <summary>
    /// Çağrı penceresinde Taslak seçeneği olmalı: yoksa taslak çağrı düzenlenince select ilk seçeneğe
    /// düşer ve çağrı sessizce başka durumla kaydedilir.
    /// </summary>
    [Fact]
    public async Task Cagri_Penceresi_Taslak_Durumunu_Tasir()
    {
        var html = await GetResponseAsStringAsync("/Grants");

        Regex.IsMatch(html, @"<option value=""3"">\s*Taslak\s*</option>").ShouldBeTrue();
    }

    [Fact]
    public async Task Taslak_Sekmesi_Adresle_Acilir()
    {
        var html = await GetResponseAsStringAsync("/Grants?tab=draft");

        html.ShouldContain("data-call-tab=\"draft\"");
        Regex.IsMatch(html, @"class=""apya-grant-tab is-active""\s+href=""/Grants\?tab=draft""").ShouldBeTrue("Taslak sekmesi etkin basılmalı");
    }

    [Fact]
    public async Task Kaynaklar_Cagrilarin_Sekme_Basligini_Tasir()
    {
        var html = await GetResponseAsStringAsync("/Grants/Sources");

        html.ShouldContain("apya-call-tabs");
        html.ShouldContain("href=\"/Grants?tab=draft\"");
        Regex.IsMatch(html, @"class=""apya-grant-tab is-active""\s+href=""/Grants/Sources""").ShouldBeTrue("Kaynaklar sekmesi etkin basılmalı");
    }
}
