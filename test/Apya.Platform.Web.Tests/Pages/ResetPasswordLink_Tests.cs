using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Identity;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kırık şifre sıfırlama bağlantısı (ACC-04).
///
/// <para>Stok ABP sayfası yalnız "geçerli kullanıcı + bozuk jeton"u tanıyordu: e-posta istemcisinde
/// kesilmiş (parametresiz) bağlantı AbpValidationException, silinmiş kullanıcıya ait bağlantı
/// EntityNotFoundException ile hata sayfasına düşüyordu. ApyaResetPasswordModel üçünü de aynı
/// "bağlantı geçersiz → yeni bağlantı iste" durumuna çevirir; form basılmaz.</para>
///
/// <para>Gönderimde (POST) de aynı durum: var olan kullanıcı + bozuk jeton ile olmayan kullanıcı AYNI
/// yanıtı alır — formdaki gizli UserId değiştirilerek bir kimliğin kullanıcıya ait olup olmadığı
/// öğrenilemez.</para>
/// </summary>
public class ResetPasswordLink_Tests : PlatformWebTestBase
{
    private const string NewPassword = "Apya 1!x";

    [Theory]
    [InlineData("/Account/ResetPassword", false)]
    [InlineData("/Account/ResetPassword?userId={0}&resetToken=x", false)]
    [InlineData("/Account/ResetPassword?userId={0}&resetToken=x", true)]
    public async Task Kirik_baglanti_hata_sayfasi_degil_gecersiz_baglanti_durumu(string pattern, bool existingUser)
    {
        var userId = existingUser ? await CreateUserAsync() : Guid.NewGuid();

        var html = await GetResponseAsStringAsync(string.Format(pattern, userId));

        ShouldBeLinkInvalid(html);
    }

    /// <summary>
    /// Düzeltme öncesi var olan kullanıcı + bozuk jeton formu "Geçersiz token." uyarısıyla yeniden basıyor,
    /// olmayan kullanıcı "bağlantı geçersiz" alıyordu. Jeton artık parola alanlarından ÖNCE denetlenir.
    /// </summary>
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Gecersiz_jetonla_gonderim_ayni_durumu_alir_kullanici_varligi_sizmaz(bool existingUser)
    {
        var userId = existingUser ? await CreateUserAsync() : Guid.NewGuid();

        var response = await PostResetAsync(userId, "x");

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var html = await response.Content.ReadAsStringAsync();
        ShouldBeLinkInvalid(html);
        WebUtility.HtmlDecode(html).ShouldNotContain("Geçersiz token");
    }

    /// <summary>Ön denetim geçerli bağlantıyı bozmaz: parola değişir, onay sayfasına gidilir.</summary>
    [Fact]
    public async Task Gecerli_jetonla_gonderim_parolayi_degistirir()
    {
        var userId = await CreateUserAsync();
        string token;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var userManager = GetRequiredService<IdentityUserManager>();
            token = await userManager.GeneratePasswordResetTokenAsync(await userManager.GetByIdAsync(userId));
            await uow.CompleteAsync();
        }

        var response = await PostResetAsync(userId, token);

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);
        (response.Headers.Location?.ToString() ?? string.Empty).ShouldContain("ResetPasswordConfirmation");
    }

    private static void ShouldBeLinkInvalid(string html)
    {
        WebUtility.HtmlDecode(html).ShouldContain("Şifre sıfırlama bağlantısı geçersiz ya da süresi dolmuş");

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        doc.DocumentNode.SelectSingleNode("//a[contains(@href, 'ForgotPassword')]")
            .ShouldNotBeNull("yeni bağlantı isteme yolu (Şifremi unuttum) gösterilmeli");
        doc.DocumentNode.SelectSingleNode("//input[@name='Password']")
            .ShouldBeNull("geçersiz bağlantıda parola formu basılmamalı");
    }

    private async Task<Guid> CreateUserAsync()
    {
        var id = Guid.NewGuid();

        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var user = new IdentityUser(id, $"qa-ux-sifirlama-{id:N}", $"{id:N}@test.local");
            (await GetRequiredService<IdentityUserManager>().CreateAsync(user, "Eski 1!x")).Succeeded.ShouldBeTrue();
            await uow.CompleteAsync();
        }

        return id;
    }

    private async Task<HttpResponseMessage> PostResetAsync(Guid userId, string resetToken)
    {
        // Geçersiz bağlantıda form (ve jetonu) basılmaz; antiforgery jetonu giriş sayfasından alınır.
        var doc = new HtmlDocument();
        doc.LoadHtml(await Client.GetStringAsync("/Account/Login"));
        var antiforgery = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        antiforgery.ShouldNotBeNull("Giriş sayfasında antiforgery jetonu yok — POST kurulamaz.");

        return await Client.PostAsync("/Account/ResetPassword", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["__RequestVerificationToken"] = antiforgery!.GetAttributeValue("value", ""),
            ["UserId"] = userId.ToString(),
            ["ResetToken"] = resetToken,
            ["Password"] = NewPassword,
            ["ConfirmPassword"] = NewPassword
        }));
    }
}
