using System;
using Apya.Platform.Web.Middleware;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp.Auditing;
using Xunit;

namespace Apya.Platform.Middleware;

/// <summary>
/// ABP hatasız GET'leri kaydetmez. Seçici yalnız eşiği aşan GET/HEAD'i kayda zorlar;
/// hub bağlantısı (HTTP/1.1 WebSocket = uzun ömürlü GET) yavaş istek sayılmaz.
/// </summary>
public class SlowGetRequestAuditSelector_Tests
{
    private const int Threshold = 1000;
    private static readonly DateTime Now = new(2026, 11, 9, 3, 0, 0, DateTimeKind.Local);

    private static AuditLogInfo Request(string method, string url, int elapsedMs) => new()
    {
        HttpMethod = method,
        Url = url,
        ExecutionTime = Now.AddMilliseconds(-elapsedMs)
    };

    [Theory]
    [InlineData("GET", 1500, true)]
    [InlineData("get", 1000, true)]
    [InlineData("HEAD", 2000, true)]
    [InlineData("GET", 999, false)]
    // GET dışı istekler ABP tarafından zaten kaydediliyor; seçici karışmaz.
    [InlineData("POST", 5000, false)]
    public void Yalniz_esigi_asan_GET_ve_HEAD_kayda_zorlanir(string method, int elapsedMs, bool expected)
    {
        SlowGetRequestAuditSelector
            .IsSlowGetRequest(Request(method, "/Projects", elapsedMs), Now, Threshold)
            .ShouldBe(expected);
    }

    [Theory]
    [InlineData("/notification-hub?id=abc")]
    [InlineData("/task-hub")]
    [InlineData("/ai-hub")]
    [InlineData("/grant-application-hub")]
    public void Hub_baglantisi_yavas_istek_sayilmaz(string url)
    {
        SlowGetRequestAuditSelector
            .IsSlowGetRequest(Request("GET", url, 120_000), Now, Threshold)
            .ShouldBeFalse();
    }

    [Fact]
    public void Url_bos_olsa_da_patlamaz()
    {
        SlowGetRequestAuditSelector
            .IsSlowGetRequest(new AuditLogInfo { HttpMethod = "GET", ExecutionTime = Now.AddSeconds(-5) }, Now, Threshold)
            .ShouldBeTrue();
    }

    public class Registration : PlatformWebTestBase
    {
        [Fact]
        public void Secici_denetim_ayarlarina_kayitli()
        {
            GetRequiredService<IOptions<AbpAuditingOptions>>().Value.AlwaysLogSelectors
                .ShouldContain(s => s.Method.Name == nameof(SlowGetRequestAuditSelector.ShouldAlwaysLogAsync));
        }
    }
}
