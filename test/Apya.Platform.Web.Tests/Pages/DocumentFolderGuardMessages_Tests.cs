using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Klasör silme ve taşıma reddi kullanıcıya ham hata koduyla değil, ne yapacağını söyleyen Türkçe
/// metinle ulaşır (kodun <c>tr.json</c> karşılığı yoksa ABP kodu olduğu gibi basar).
/// </summary>
public class DocumentFolderGuardMessages_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData(PlatformDomainErrorCodes.DocumentFolderNotEmpty, "Önce içindekileri taşıyın")]
    [InlineData(PlatformDomainErrorCodes.DocumentFolderParentInvalid, "kendi içine")]
    public void Klasor_Reddi_Kullaniciya_Turkce_Metinle_Ulasir(string code, string expected)
    {
        using (CultureHelper.Use("tr"))
        {
            var info = GetRequiredService<IExceptionToErrorInfoConverter>().Convert(
                new BusinessException(code), _ => { });

            info.Message.ShouldNotBeNull();
            info.Message.ShouldNotContain("Platform:Documents", Case.Sensitive);
            info.Message.ShouldContain(expected);
        }
    }
}
