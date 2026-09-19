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
/// Giriş ekranının kendisinden geçen kanıt: şifrenin sonundaki boşluk girişi ENGELLEMEZ,
/// şifrenin İÇİNDEKİ boşluk ise anlamlıdır.
///
/// <para>
/// Kırpma <see cref="Apya.Platform.Identity.ApyaIdentityUserManager"/> içinde yapılıyor;
/// birim testleri onu doğrudan sınıyor. Buradaki test ayrı bir soruyu yanıtlar: giriş
/// akışı (SignInManager → UserManager) gerçekten o sınıfa iniyor mu? Kayıt yanlış servis
/// tipine yapılsaydı birim testleri yine geçer, GİRİŞ yine kırpmazdı.
/// </para>
/// </summary>
public class LoginPasswordWhitespace_Tests : PlatformWebTestBase
{
    private const string Password = "Apya 1!x";

    [Fact]
    public async Task Trailing_Space_Should_Not_Block_Login()
    {
        var userName = await CreateUserAsync();

        var response = await PostLoginAsync(userName, Password + "  ");

        response.StatusCode.ShouldBe(
            HttpStatusCode.Redirect,
            "Sondaki boşluk kırpılmalıydı; sayfanın yeniden basılması giriş başarısız demektir.");
    }

    [Fact]
    public async Task Inner_Space_Should_Stay_Significant()
    {
        var userName = await CreateUserAsync();

        var response = await PostLoginAsync(userName, Password.Replace(" ", ""));

        // Başarısız girişte ABP sayfayı hata mesajıyla yeniden basar (200).
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    private async Task<string> CreateUserAsync()
    {
        var id = Guid.NewGuid();
        var userName = $"bosluk-{id:N}";

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var userManager = GetRequiredService<IdentityUserManager>();
            var user = new IdentityUser(id, userName, $"{id:N}@test.local");

            (await userManager.CreateAsync(user, Password)).Succeeded.ShouldBeTrue();

            await uow.CompleteAsync();
        }

        return userName;
    }

    private async Task<HttpResponseMessage> PostLoginAsync(string userName, string password)
    {
        var page = await Client.GetStringAsync("/Account/Login");

        var doc = new HtmlDocument();
        doc.LoadHtml(page);
        var tokenInput = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        tokenInput.ShouldNotBeNull("Giriş sayfasında antiforgery jetonu yok — POST kurulamaz.");

        return await Client.PostAsync(
            "/Account/Login",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["__RequestVerificationToken"] = tokenInput.GetAttributeValue("value", ""),
                ["LoginInput.UserNameOrEmailAddress"] = userName,
                ["LoginInput.Password"] = password,
                ["LoginInput.RememberMe"] = "false",
                ["Action"] = "Login"
            }));
    }
}
