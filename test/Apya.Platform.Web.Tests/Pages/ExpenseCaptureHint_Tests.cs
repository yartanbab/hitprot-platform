using System.Net;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// X-05 · Masraf Yakala fişi okumuyor (F-01a): fotoğraf formun üstünde durur, değerleri kullanıcı
/// girer. Giderler sayfasındaki giriş ipucu "otomatik okut" demeye devam ediyordu.
/// </summary>
public class ExpenseCaptureHint_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Giderler_sayfasi_Masraf_Yakala_icin_otomatik_okuma_vaat_etmez()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Expenses"));

        html.ShouldContain("href=\"/Expenses/Capture\"");
        html.ShouldNotContain("otomatik okut");
        html.ShouldContain("ona bakarak masraf girmek");
    }
}
