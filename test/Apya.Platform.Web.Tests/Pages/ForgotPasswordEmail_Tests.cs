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
/// SÖZLEŞME: "Şifremi unuttum" gönderimi e-posta şablonunu hatasız render edip bağlantı-gönderildi
/// sayfasına yönlenmeli.
///
/// <para>ABP 10.0.2'nin Scriban motoru Scriban 7 ile ilk render'da <c>TypeLoadException</c> verir ve bu
/// sayfa 500 döner; derleme ve diğer testler bunu görmez. Motor <c>ApyaScribanTemplateRenderingEngine</c>
/// ile değiştirildi — şablonun kendisi EntityFrameworkCore.Tests'teki
/// <c>ApyaScribanTemplateRenderingEngine_Tests</c> ile sınanır, burada sayfanın tüm zinciri
/// (AccountEmailer → ITemplateRenderer → motor) uçtan uca denenir. Bkz. Directory.Build.props.</para>
/// </summary>
public class ForgotPasswordEmail_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Sifremi_unuttum_gonderimi_e_posta_sablonunu_hatasiz_render_eder()
    {
        var id = Guid.NewGuid();
        var email = $"{id:N}@test.local";

        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var user = new IdentityUser(id, $"qa-sifremi-unuttum-{id:N}", email);
            (await GetRequiredService<IdentityUserManager>().CreateAsync(user, "Eski 1!x")).Succeeded.ShouldBeTrue();
            await uow.CompleteAsync();
        }

        var doc = new HtmlDocument();
        doc.LoadHtml(await Client.GetStringAsync("/Account/ForgotPassword"));
        var antiforgery = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        antiforgery.ShouldNotBeNull("Şifremi unuttum sayfasında antiforgery jetonu yok — POST kurulamaz.");

        var response = await Client.PostAsync("/Account/ForgotPassword", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["__RequestVerificationToken"] = antiforgery!.GetAttributeValue("value", ""),
            ["Email"] = email
        }));

        // Şablon render'ı patlasa istek 500 döner; başarıda "bağlantı gönderildi" sayfasına yönlenir.
        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);
        (response.Headers.Location?.ToString() ?? string.Empty).ShouldContain("PasswordResetLinkSent");
    }
}
