using System.Threading.Tasks;
using Apya.Platform.Telemetry;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// N-10 · Sistem Sağlığı bildirim kanallarını gösterir: push yapılandırması boşsa (test ortamı) "Kapalı" ve
/// sayfa üstünde uyarı. Web test sunucusunda e-posta göndericisi yerel dosya göndericisidir (DEBUG).
/// </summary>
public class NotificationChannelsHealth_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Kanal_durumu_servisten_gelir()
    {
        var channels = (await GetRequiredService<ISystemHealthAppService>().GetAsync()).NotificationChannels;

        channels.WebPushEnabled.ShouldBeFalse("test yapılandırmasında VAPID anahtarı yok");
        channels.EmailSender.ShouldBe("FileDrop", "Web modülü DEBUG'da dosyaya yazan göndericiyi kaydeder");
        channels.HasProblem.ShouldBeTrue();
        channels.PendingJobCount.ShouldBeGreaterThanOrEqualTo(0);
    }

    [Fact]
    public async Task Sayfa_kanal_kartini_ve_uyariyi_gosterir()
    {
        var html = await GetResponseAsStringAsync("/Admin/SystemHealth");

        html.ShouldContain("id=\"notification-channels\"");
        html.ShouldContain("Bildirim Kanalları");
        html.ShouldContain("Bildirimler bazı kullanıcılara ulaşmıyor olabilir.");
        html.ShouldContain("VAPID anahtarları tanımlı değil");
    }
}
