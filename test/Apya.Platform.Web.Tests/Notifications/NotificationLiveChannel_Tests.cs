using System.IO;
using System.Linq;
using Shouldly;
using Xunit;

namespace Apya.Platform.Notifications;

/// <summary>
/// N-01 · Anlık bildirim kanalı her sayfada: SignalR istemcisi global demette zilden ve AI
/// istemcisinden ÖNCE; kopukken zil sayacı yedek tazelemeyle güncel; sunucu yayını commit'ten sonra.
/// </summary>
public class NotificationLiveChannel_Tests
{
    private static string Src(params string[] parts) =>
        File.ReadAllText(Path.Combine(new[] { WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web" }.Concat(parts).ToArray()));

    [Fact]
    public void SignalR_istemcisi_global_demette_tuketicilerden_once()
    {
        var module = Src("PlatformWebModule.cs");
        var signalr = module.IndexOf("\"/libs/signalr/signalr.min.js\"");
        signalr.ShouldBeGreaterThan(0);
        signalr.ShouldBeLessThan(module.IndexOf("\"/Pages/Notifications/notification-bell.js\""));
        signalr.ShouldBeLessThan(module.IndexOf("\"/js/ai-hub-client.js\""));

        Src("Pages", "Grants", "Wizard.cshtml").ShouldNotContain("signalr.min.js", customMessage: "global demet zaten yüklüyor");
    }

    [Fact]
    public void Zil_kopukken_yedek_tazelemeyle_guncel_kalir()
    {
        var bell = Src("wwwroot", "Pages", "Notifications", "notification-bell.js");
        bell.ShouldContain("if (!live && document.visibilityState === 'visible') { refreshBadge(); }");
        bell.ShouldContain("document.addEventListener('visibilitychange'");
        bell.ShouldNotContain("l('Connection:Lost'), l('Connection:ErrorTitle'), { sticky: true }", customMessage: "geçici kopma her sayfada kalıcı uyarı üretmesin");
    }

    /// <summary>Balon kim/ne söyler (gövde), kullanıcı metni kaçışlanır, tıklayınca kayda gider.</summary>
    [Fact]
    public void Balon_govdeyi_kacislanmis_gosterir_ve_kayda_goturur()
    {
        var bell = Src("wwwroot", "Pages", "Notifications", "notification-bell.js");
        bell.ShouldContain("var message = esc(body || dto.title || '');");
        bell.ShouldContain("onclick: function () { window.location.href = dto.deepLinkUrl; }");
    }

    [Fact]
    public void Sunucu_yayini_committen_sonra_ve_hata_yutularak()
    {
        var handler = Src("Notifications", "SignalRNotificationEventHandler.cs");
        handler.ShouldContain("uow.OnCompleted(() => SafeSendAsync(send));");
        handler.ShouldContain("catch (Exception ex)");
    }
}
