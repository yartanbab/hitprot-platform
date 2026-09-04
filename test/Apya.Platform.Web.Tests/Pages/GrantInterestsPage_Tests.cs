using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// İlgi talebi yüzeyleri: kiracı "İlgileniyorum" der, host kutusu karar verir.
///
/// <para>Kilitlenen sözleşme: kiracı detayında BAŞVURU AÇAN düğme kalmadı. Düğme geri
/// gelirse başvuru host'un kararı olmadan doğar ve kutu boş kalır.</para>
/// </summary>
public class GrantInterestsPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Host_Ilgi_Talepleri_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Interests");

        html.ShouldContain("apya-int-kpis");
        html.ShouldContain("RejectModal");
        html.ShouldContain("Başvuru sürecini başlat");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Interests[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Interests.js içermeli");
    }

    [Fact]
    public async Task Kiraci_Detayinda_Basvuru_Acan_Dugme_Yok()
    {
        var html = await GetResponseAsStringAsync("/Grants/Detail?id=6f2f3a1e-0000-4000-8000-00000000ab01");

        html.ShouldContain("InterestBtn");
        html.ShouldContain("InterestModal");
        html.ShouldNotContain("ApplyBtn", Case.Sensitive);
    }

    [Fact]
    public async Task Basvurularim_Ilgi_Talepleri_Bolumunu_Tasiyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/MyApplications");

        html.ShouldContain("İlgi Taleplerim");
        html.ShouldContain("InterestRows");
    }
}
