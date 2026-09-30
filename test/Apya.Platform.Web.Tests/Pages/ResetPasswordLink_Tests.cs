using System;
using System.Net;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kırık şifre sıfırlama bağlantısı (ACC-04).
///
/// <para>Stok ABP sayfası yalnız "geçerli kullanıcı + bozuk jeton"u tanıyordu: e-posta istemcisinde
/// kesilmiş (parametresiz) bağlantı AbpValidationException, silinmiş kullanıcıya ait bağlantı
/// EntityNotFoundException ile hata sayfasına düşüyordu. ApyaResetPasswordModel üçünü de aynı
/// "bağlantı geçersiz → yeni bağlantı iste" durumuna çevirir; form basılmaz.</para>
/// </summary>
public class ResetPasswordLink_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData("/Account/ResetPassword")]
    [InlineData("/Account/ResetPassword?userId={0}&resetToken=x")]
    public async Task Kirik_baglanti_hata_sayfasi_degil_gecersiz_baglanti_durumu(string pattern)
    {
        var html = await GetResponseAsStringAsync(string.Format(pattern, Guid.NewGuid()));

        WebUtility.HtmlDecode(html).ShouldContain("Şifre sıfırlama bağlantısı geçersiz ya da süresi dolmuş");

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        doc.DocumentNode.SelectSingleNode("//a[contains(@href, 'ForgotPassword')]")
            .ShouldNotBeNull("yeni bağlantı isteme yolu (Şifremi unuttum) gösterilmeli");
        doc.DocumentNode.SelectSingleNode("//input[@name='Password']")
            .ShouldBeNull("geçersiz bağlantıda parola formu basılmamalı");
    }
}
