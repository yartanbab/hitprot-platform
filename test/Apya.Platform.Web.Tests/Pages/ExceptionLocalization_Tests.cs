using System;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// ABP'nin "Id değeri {1} olan {0} türünden bir nesne bulunamadı!" metni iç tür adını (TaskItem,
/// AppDocument, Project…) ve kimliği kullanıcıya basıyordu — API zarfı, ABP penceresi, adalar
/// (DOC-15, TSK-23). Metin tüm uygulamada dostane (Domain.Shared/Localization/ExceptionHandling,
/// yapılandırma PlatformWebModule); ayrıntı log ve denetim kaydında kalır.
/// <para>en-GB ayrı dosya ister: ABP'nin kendi en-GB metni var ve yerelleştirici önce TAM kültürü arar —
/// yalnız "en" ezilirse dil seçicideki English (UK) ham metni görür.</para>
/// </summary>
public class ExceptionLocalization_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData("tr", "bulunamadı")]
    [InlineData("en", "could not be found")]
    [InlineData("en-GB", "could not be found")]
    public void Bulunamayan_kayit_metni_tur_adi_ve_kimlik_tasimaz(string culture, string expected)
    {
        var converter = GetRequiredService<IExceptionToErrorInfoConverter>();
        var id = Guid.NewGuid();

        using (CultureHelper.Use(culture))
        {
            var withId = converter.Convert(new EntityNotFoundException(typeof(Project), id)).Message;
            var withoutId = converter.Convert(new EntityNotFoundException(typeof(Project))).Message;

            foreach (var message in new[] { withId, withoutId })
            {
                message.ShouldNotBeNull();
                message.ShouldContain(expected);
                message.ShouldNotContain("Project", Case.Sensitive);
                message.ShouldNotContain(id.ToString());
            }
        }
    }
}
