using Apya.Platform.IssueTasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.IssueTasks;

/// <summary>
/// Sunucu hatasının kalıcı bir Id'si yoktur (kaynak AbpAuditLogs). Tekilleştirme
/// anahtarı yanlış üretilirse ya aynı arıza için her turda yeni görev açılır ya da
/// farklı arızalar tek göreve düşer.
/// </summary>
public class ServerErrorKey_Tests
{
    [Fact]
    public void Ayni_url_ve_exception_turu_ayni_anahtari_uretir()
    {
        var first  = IssueTaskManager.BuildServerErrorKey("/api/app/project", "Volo.Abp.BusinessException");
        var second = IssueTaskManager.BuildServerErrorKey("/api/app/project", "Volo.Abp.BusinessException");

        second.ShouldBe(first);
    }

    [Fact]
    public void Ayni_uctaki_farkli_ariza_farkli_anahtar_uretir()
    {
        var business = IssueTaskManager.BuildServerErrorKey("/api/app/project", "Volo.Abp.BusinessException");
        var nullRef  = IssueTaskManager.BuildServerErrorKey("/api/app/project", "System.NullReferenceException");

        nullRef.ShouldNotBe(business);
    }

    [Fact]
    public void Url_buyuk_kucuk_harf_farki_ayni_ariza_sayilir()
    {
        var lower = IssueTaskManager.BuildServerErrorKey("/api/app/project", "System.Exception");
        var upper = IssueTaskManager.BuildServerErrorKey("/API/App/Project", "System.Exception");

        upper.ShouldBe(lower);
    }

    [Fact]
    public void Anahtar_kolon_sinirina_sigar()
    {
        var key = IssueTaskManager.BuildServerErrorKey(new string('x', 4000), "System.Exception");

        key.Length.ShouldBe(32);
        key.Length.ShouldBeLessThanOrEqualTo(IssueTaskConsts.MaxSourceKeyLength);
    }

    [Theory]
    [InlineData("Volo.Abp.BusinessException: Proje bulunamadı\n   at Foo()", "Volo.Abp.BusinessException")]
    [InlineData("System.NullReferenceException", "System.NullReferenceException")]
    [InlineData("", null)]
    [InlineData(null, null)]
    public void Exception_turu_ilk_satirdan_cozulur(string? exceptions, string? expected)
    {
        ServerErrorSignalBuilder.ExtractExceptionType(exceptions).ShouldBe(expected);
    }
}
