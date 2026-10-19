using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Notifications;

/// <summary>
/// N-02 · Kilit ekranı / telefon davranışı: push yalnız uygulama ODAKTAYKEN bastırılır, önemli bildirim
/// kalıcı ve titreşimli, gruplanan tekrar yeniden uyarır; kuyruk 1 sn'de yoklanır, acil push öne geçer.
/// </summary>
public class PushDeliveryBehaviour_Tests
{
    private static string Src(params string[] parts) =>
        File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(), Path.Combine(parts)));

    [Fact]
    public void Service_worker_odakta_bastirir_onemliyi_kalici_ve_titresimli_gosterir()
    {
        var sw = Src("src", "Apya.Platform.Web", "wwwroot", "sw.js");
        sw.ShouldContain("const isFocused = clientList.some((client) => client.focused);");
        sw.ShouldNotContain("client.visibilityState === 'visible'");
        sw.ShouldContain("renotify: Boolean(tag),");
        sw.ShouldContain("requireInteraction: important,");
        sw.ShouldContain("vibrate: important ? [200, 100, 200] : undefined,");
        sw.ShouldContain("const moved = await c.navigate(url);");
    }

    [Fact]
    public void Kuyruk_hizli_yoklanir_acil_push_one_gecer()
    {
        Src("src", "Apya.Platform.Domain", "PlatformDomainModule.cs")
            .ShouldContain("options.JobPollPeriod = 1000");
        var handler = Src("src", "Apya.Platform.Application", "Notifications", "WebPushNotificationHandler.cs");
        handler.ShouldContain("urgent ? BackgroundJobPriority.High : BackgroundJobPriority.Normal");
        Src("src", "Apya.Platform.Application", "Notifications", "WebPushSender.cs")
            .ShouldContain("TimeToLive = urgent ? UrgentTimeToLiveSeconds : TimeToLiveSeconds,");
    }
}
