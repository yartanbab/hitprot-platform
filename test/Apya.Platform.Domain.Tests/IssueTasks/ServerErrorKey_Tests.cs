using Apya.Platform.Telemetry;
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
        var first  = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/project", "Volo.Abp.BusinessException");
        var second = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/project", "Volo.Abp.BusinessException");

        second.ShouldBe(first);
    }

    [Fact]
    public void Ayni_uctaki_farkli_ariza_farkli_anahtar_uretir()
    {
        var business = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/project", "Volo.Abp.BusinessException");
        var nullRef  = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/project", "System.NullReferenceException");

        nullRef.ShouldNotBe(business);
    }

    [Fact]
    public void Url_buyuk_kucuk_harf_farki_ayni_ariza_sayilir()
    {
        var lower = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/project", "System.Exception");
        var upper = IssueTaskManager.BuildServerErrorKey("POST", "/API/App/Project", "System.Exception");

        upper.ShouldBe(lower);
    }

    [Fact]
    public void Ayni_yolda_farkli_metot_farkli_ariza_sayilir()
    {
        // GET /api/app/task ile POST /api/app/task ayrı uçlardır; tek anahtara
        // düşerlerse ikinci arıza için hiç görev açılmaz.
        var get  = IssueTaskManager.BuildServerErrorKey("GET", "/api/app/task", "System.Exception");
        var post = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/task", "System.Exception");

        post.ShouldNotBe(get);
    }

    [Fact]
    public void Metot_buyuk_kucuk_harf_farki_ayni_ucu_gosterir()
    {
        var upper = IssueTaskManager.BuildServerErrorKey("POST", "/api/app/task", "System.Exception");
        var lower = IssueTaskManager.BuildServerErrorKey("post", "/api/app/task", "System.Exception");

        lower.ShouldBe(upper);
    }

    [Fact]
    public void Normalize_yol_tek_ariza_uretir()
    {
        // Aynı rotanın farklı kimlikli kayıtları normalize edildikten sonra tek
        // anahtara düşer — 200 proje 200 görev açmaz.
        var first = IssueTaskManager.BuildServerErrorKey(
            "GET",
            EndpointUrlNormalizer.Normalize("/Projects/ProjectDetails/3a233119-da82-38d8-5988-1d55d7d0dbb2"),
            "System.Exception");

        var second = IssueTaskManager.BuildServerErrorKey(
            "GET",
            EndpointUrlNormalizer.Normalize("/Projects/ProjectDetails/7c9e6679-7425-40de-944b-e07fc1f90ae7"),
            "System.Exception");

        second.ShouldBe(first);
    }

    [Fact]
    public void Anahtar_kolon_sinirina_sigar()
    {
        var key = IssueTaskManager.BuildServerErrorKey("POST", new string('x', 4000), "System.Exception");

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
