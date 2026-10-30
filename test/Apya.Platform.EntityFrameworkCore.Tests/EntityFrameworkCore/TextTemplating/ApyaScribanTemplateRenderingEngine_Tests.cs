using System.Threading.Tasks;
using Apya.Platform.TextTemplating;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp.Account.Emailing.Templates;
using Volo.Abp.Emailing.Templates;
using Volo.Abp.TextTemplating;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.TextTemplating;

/// <summary>
/// SÖZLEŞME: ABP'nin metin şablonları Scriban 7 ile render edilebilmeli.
///
/// <para>ABP 10.0.2'nin kendi Scriban motoru Scriban 6.x'e derlenmiştir; Scriban 7 ile ilk render'da
/// <c>TypeLoadException</c> verir ve şifre sıfırlama / e-posta doğrulama gibi her ABP e-postası
/// çalışmaz. <see cref="ApyaScribanTemplateRenderingEngine"/> bunu aşar ve <c>PlatformDomainModule</c>
/// "Scriban" motor adını ona yönlendirir. Derleme bu kaydın doğru olup olmadığını göstermez — kayıt
/// silinirse ya da ABP motoru geri gelirse yalnız bu testler düşer. Bkz. Directory.Build.props.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ApyaScribanTemplateRenderingEngine_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public void Scriban_motor_adi_kendi_motorumuza_yonlenir()
    {
        var engines = GetRequiredService<IOptions<AbpTextTemplatingOptions>>().Value.RenderingEngines;

        engines[ApyaScribanTemplateRenderingEngine.EngineName]
            .ShouldBe(typeof(ApyaScribanTemplateRenderingEngine));
    }

    [Fact]
    public async Task Standart_e_posta_sablonu_modeli_basar_ve_layout_icine_sarilir()
    {
        var html = await GetRequiredService<ITemplateRenderer>().RenderAsync(
            StandardEmailTemplates.Message,
            new { message = "Merhaba dünya" });

        html.ShouldContain("Merhaba dünya");
        html.ShouldContain("<body>");   // Layout.tpl: Message şablonu layout'a {{content}} olarak girer
        html.ShouldNotContain("{{");    // çözülmemiş ifade kalmamalı
    }

    [Fact]
    public async Task Sifre_sifirlama_sablonu_baglantiyi_ve_Turkce_metni_basar()
    {
        const string link = "https://apya.test/Account/ResetPassword?userId=1&resetToken=abc";

        var html = await GetRequiredService<ITemplateRenderer>().RenderAsync(
            AccountEmailTemplates.PasswordResetLink, new { link }, "tr");

        html.ShouldContain($"href=\"{link}\"");
        html.ShouldContain("Şifre Sıfırlama"); // {{ L "PasswordReset" }} — yerelleştirici çalışıyor
        html.ShouldNotContain("{{");
    }
}
