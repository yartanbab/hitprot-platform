using System;
using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// "Ana ekrana ekle" ve ikon rozeti. Kurulum isteği, standalone kipi ve rozet API'si test kabuğunda
/// yok; sözleşme kaynaktan kilitlenir. Bozulma ekranda hata vermez: satır hiç görünmez ya da rozet donar.
/// </summary>
public class PwaInstallContract_Tests
{
    private static string ReadSource(params string[] parts)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web");
        foreach (var part in parts)
        {
            path = Path.Combine(path, part);
        }

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    /// <summary>Her sayfada yüklenir ve zilden SONRA: bildirim şeridi window.apyaDesktopNotifications'a dayanır.</summary>
    [Fact]
    public void Betik_genel_demette_zilden_sonra_yuklenir()
    {
        var module = ReadSource("PlatformWebModule.cs");

        var bell = module.IndexOf("bundle.AddFiles(\"/Pages/Notifications/notification-bell.js\");", StringComparison.Ordinal);
        var pwa = module.IndexOf("bundle.AddFiles(\"/js/apya-pwa.js\");", StringComparison.Ordinal);

        bell.ShouldBeGreaterThan(0);
        pwa.ShouldBeGreaterThan(bell);
    }

    /// <summary>
    /// Kimlik sayfalarında hiç çalışmaz ve service worker yalnız oturumlu kullanıcıda kaydedilir
    /// (sw.js kimlik yollarını önbelleğe almıyor ama giriş ekranında kayıt gereksiz).
    /// </summary>
    [Fact]
    public void Kimlik_sayfalarinda_calismaz_kayit_oturumlu_kullanicida_yapilir()
    {
        var script = ReadSource("wwwroot", "js", "apya-pwa.js");

        script.ShouldContain("if (/^\\/Account\\//i.test(location.pathname)) { return; }", Case.Sensitive);
        script.IndexOf("abp.currentUser.isAuthenticated", StringComparison.Ordinal)
            .ShouldBeLessThan(script.IndexOf("navigator.serviceWorker.register('/sw.js'", StringComparison.Ordinal));
    }

    /// <summary>Kurulum isteği hemen yakalanır (sayfa yüklenmeden gelebilir); yüklü uygulamada giriş görünmez.</summary>
    [Fact]
    public void Kurulum_istegi_yakalanir_yuklu_uygulamada_giris_gizlenir()
    {
        var script = ReadSource("wwwroot", "js", "apya-pwa.js");

        script.ShouldContain("window.addEventListener('beforeinstallprompt'", Case.Sensitive);
        script.ShouldContain("e.preventDefault();", Case.Sensitive);
        script.ShouldContain("if (installed || isStandalone()) { return false; }", Case.Sensitive);
        // Menü satır sınıfları display:flex verir; [hidden] açıkça geri alınmazsa satır hiç kaybolmaz.
        ReadSource("wwwroot", "css", "apya-shell.css")
            .ShouldContain("#mobile-user-menu-group .apya-mshell-row--install[hidden] { display: none; }", Case.Sensitive);
    }

    /// <summary>İkon rozeti: uygulama açıkken zil sayacı, kapalıyken service worker push gövdesinden yazar.</summary>
    [Fact]
    public void Ikon_rozeti_zil_sayaci_ve_push_govdesinden_beslenir()
    {
        var bell = ReadSource("wwwroot", "Pages", "Notifications", "notification-bell.js");
        bell.ShouldContain("setIconBadge(count);", Case.Sensitive);
        bell.ShouldContain("navigator.setAppBadge(count)", Case.Sensitive);

        var worker = ReadSource("wwwroot", "sw.js");
        worker.ShouldContain("await setIconBadge(payload.unreadCount);", Case.Sensitive);
        worker.ShouldContain("self.navigator.clearAppBadge()", Case.Sensitive);
    }
}
