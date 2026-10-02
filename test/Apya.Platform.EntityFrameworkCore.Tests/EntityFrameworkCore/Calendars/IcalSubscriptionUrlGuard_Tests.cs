using System;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Calendars;

/// <summary>
/// CAL-15 · iCal adresi reddedilince "Bağlantıyı dene" satırında .NET'in İngilizce varsayılanı
/// ("Exception of type 'Volo.Abp.BusinessException' was thrown."), "Takvimi ekle"de ise webhook'un metni
/// ("Geçersiz webhook adresi…") çıkıyordu. SSRF denetimi webhook'larla ortak kalır; kullanıcıya dönen kod
/// ve metin takvimindir.
///
/// <para>Hiçbir vaka ağ isteği atmaz: adres denetimi HTTP çağrısından önce düşer.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class IcalSubscriptionUrlGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IIcalSubscriptionAppService _ical;
    private readonly IRepository<IcalSubscription, Guid> _repository;
    private readonly IExceptionToErrorInfoConverter _converter;
    private readonly IStringLocalizer<PlatformResource> _l;

    public IcalSubscriptionUrlGuard_Tests()
    {
        _ical = GetRequiredService<IIcalSubscriptionAppService>();
        _repository = GetRequiredService<IRepository<IcalSubscription, Guid>>();
        _converter = GetRequiredService<IExceptionToErrorInfoConverter>();
        _l = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    [Theory]
    [InlineData("bu-bir-url-degil")]
    [InlineData("ftp://ornek.com/a.ics")]
    [InlineData("http://127.0.0.1/a.ics")]
    public async Task Probe_gecersiz_adreste_takvim_metni_doner(string url)
    {
        using (CultureHelper.Use("tr"))
        {
            var result = await _ical.ProbeAsync(url);

            result.IsValid.ShouldBeFalse();
            result.Error.ShouldBe(_l[PlatformDomainErrorCodes.CalendarIcalUrlNotAllowed].Value);
            result.Error.ShouldStartWith("Geçerli bir takvim adresi girin.");
            result.Error.ShouldNotContain("Exception of type");
            result.Error.ShouldNotContain("webhook"); // Shouldly: harf duyarsız
        }
    }

    [Fact]
    public async Task Ekleme_gecersiz_adreste_takvim_koduyla_reddedilir()
    {
        const string url = "http://127.0.0.1/qa-ux-cal15.ics";

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _ical.AddAsync(new AddIcalSubscriptionInput { Url = url, DisplayName = "QA-UX" }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.CalendarIcalUrlNotAllowed);
        ex.Code.ShouldNotBe(PlatformDomainErrorCodes.WebhookTargetUrlNotAllowed);
        (await _repository.GetListAsync(x => x.Url == url)).ShouldBeEmpty();
    }

    [Fact]
    public void UserText_kodlu_istisnada_yer_tutucuyu_doldurur()
    {
        using (CultureHelper.Use("tr"))
        {
            var text = _converter.UserText(
                new BusinessException(PlatformDomainErrorCodes.TaskShareUploadLimitExceeded).WithData("Limit", 5),
                "yedek");

            text.ShouldContain("5");
            text.ShouldNotContain("{Limit}");
            text.ShouldNotContain("Exception of type");
            text.ShouldNotBe("yedek");
        }
    }

    [Fact]
    public void UserText_kodsuz_istisnada_kendi_mesajini_doner()
    {
        _converter.UserText(new BusinessException(message: "Adres bir takvim dosyası değil."), "yedek")
            .ShouldBe("Adres bir takvim dosyası değil.");
    }
}
