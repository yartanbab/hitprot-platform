using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using Apya.Platform.Notifications;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// NTF-08 Faz 2 · İstemci ↔ sunucu sözleşmesi. Abonelik betiği, service worker ve tercih ekranı
/// tarayıcı API'lerine (PushManager, service worker) dayandığı için test kabuğunda koşturulamıyor;
/// sözleşme kaynaktan kilitlenir. Bozulma ekranda hata vermez: abonelik sessizce kurulmaz ya da
/// bildirim boş başlıkla çıkar.
/// </summary>
public class WebPushClientContract_Tests
{
    private static string ReadSource(params string[] parts)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynak depodan okunur.
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web");
        foreach (var part in parts)
        {
            path = Path.Combine(path, part);
        }

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    private static string Camel(string name) => char.ToLowerInvariant(name[0]) + name[1..];

    private static string ProxyName(string methodName)
        => Camel(methodName.EndsWith("Async", StringComparison.Ordinal) ? methodName[..^5] : methodName);

    /// <summary>Betiğin çağırdığı her uç serviste VAR ve servis nesnesi doğru adla aranıyor.</summary>
    [Fact]
    public void Abonelik_betigi_var_olan_uclari_cagirir()
    {
        var script = ReadSource("wwwroot", "Pages", "Notifications", "notification-bell.js");
        var methods = typeof(INotificationDeviceAppService).GetMethods().Select(m => ProxyName(m.Name)).ToList();

        script.ShouldContain("apya.platform.notifications.notificationDevice", Case.Sensitive);

        foreach (var call in new[] { "getWebPushConfig", "subscribeWebPush", "unsubscribeWebPush" })
        {
            methods.ShouldContain(call);
            script.ShouldContain("service." + call + "(", Case.Sensitive);
        }
    }

    /// <summary>Betiğin gönderdiği alanlar, uçların beklediği girdi alanlarıyla aynı.</summary>
    [Fact]
    public void Abonelik_betigi_girdi_alanlarini_dogru_adlarla_gonderir()
    {
        var script = ReadSource("wwwroot", "Pages", "Notifications", "notification-bell.js");

        foreach (var property in typeof(RegisterWebPushInput).GetProperties())
        {
            script.ShouldContain(Camel(property.Name) + ":", Case.Sensitive);
        }

        script.ShouldContain("unsubscribeWebPush({ endpoint: sub.endpoint }", Case.Sensitive);
        typeof(UnsubscribeWebPushInput).GetProperty("Endpoint").ShouldNotBeNull();

        // Yapılandırma yanıtı: betik bu iki alanı okur.
        script.ShouldContain("config.enabled", Case.Sensitive);
        script.ShouldContain("config.publicKey", Case.Sensitive);
        typeof(WebPushConfigDto).GetProperty("Enabled").ShouldNotBeNull();
        typeof(WebPushConfigDto).GetProperty("PublicKey").ShouldNotBeNull();
    }

    /// <summary>Sunucunun yazdığı gövde alanlarını service worker AYNI adlarla okur; gövde metni yoktur.</summary>
    [Fact]
    public void Service_worker_sunucunun_yazdigi_govde_alanlarini_okur()
    {
        var worker = ReadSource("wwwroot", "sw.js");
        var payload = JsonDocument.Parse(
            WebPushPayload.Build(Guid.NewGuid(), "Başlık", null, NotificationSeverity.High, "/Projects")).RootElement;

        var fields = payload.EnumerateObject().Select(p => p.Name).ToList();
        fields.ShouldBe(new[] { "notificationId", "title", "tag", "severity", "url" }, ignoreOrder: true);

        foreach (var field in fields)
        {
            worker.ShouldContain("payload." + field, Case.Sensitive);
        }

        // Service worker'ın kritik eşiği sunucudaki enum değeriyle aynı.
        worker.ShouldContain("const SEVERITY_CRITICAL = " + (int)NotificationSeverity.Critical + ";", Case.Sensitive);
    }

    [Fact]
    public void Cikis_baglantisi_abonelikten_cikarak_ilerler()
    {
        var script = ReadSource("wwwroot", "Pages", "Notifications", "notification-bell.js");

        script.ShouldContain("Account\\/Logout", Case.Sensitive);
        script.ShouldContain("PUSH.unsubscribe().then(function() {", Case.Sensitive);
        // Takılırsa çıkış engellenmez.
        script.ShouldContain("window.setTimeout(go, 1500)", Case.Sensitive);

        // Abonelik yoksa (kanal kapalı, izin yok) çıkışa hiç dokunulmaz; kapalı kanalda service worker
        // da kaydedilmez — anahtarlar tanımlanmadan yayına giren kod davranış değiştirmemeli.
        script.ShouldContain("!PUSH.hasSynced()) { return; }", Case.Sensitive);
        script.ShouldContain("if (knownOff()) { return Promise.resolve(false); }", Case.Sensitive);
        script.IndexOf("markOff();", StringComparison.Ordinal)
            .ShouldBeLessThan(script.IndexOf("return registration().then(function(reg) {", StringComparison.Ordinal),
                "yapılandırma, service worker kaydından ÖNCE sorulmalı");
    }

    /// <summary>Cihaz listesi: betiğin çağırdığı uçlar ve okuduğu alanlar serviste / DTO'da var.</summary>
    [Fact]
    public void Cihaz_listesi_var_olan_uclari_cagirir_ve_alanlari_okur()
    {
        var script = ReadSource("Pages", "Notifications", "Index.js");
        var methods = typeof(INotificationDeviceAppService).GetMethods().Select(m => ProxyName(m.Name)).ToList();

        script.ShouldContain("var deviceService = apya.platform.notifications.notificationDevice;", Case.Sensitive);
        foreach (var call in new[] { "getList", "delete" })
        {
            methods.ShouldContain(call);
            script.ShouldContain("deviceService." + call + "(", Case.Sensitive);
        }

        foreach (var field in new[] { "EndpointHash", "DeviceLabel", "IsActive", "LastSeenAt", "Id" })
        {
            typeof(NotificationDeviceDto).GetProperty(field).ShouldNotBeNull();
            script.ShouldContain("d." + Camel(field), Case.Sensitive);
        }

        // Bu cihazı kaldırmak, bu cihazda kapatmaktır (yoksa abonelik yeniden kurulurdu).
        script.ShouldContain("window.apyaDesktopNotifications.setEnabledHere(false)", Case.Sensitive);
    }

    [Fact]
    public void Tercih_ekrani_push_kanalini_gosterir_ve_gonderir()
    {
        var page = ReadSource("Pages", "Notifications", "Index.cshtml");
        var script = ReadSource("Pages", "Notifications", "Index.js");

        page.ShouldContain("colspan=\"5\"", Case.Sensitive);
        script.ShouldContain("['inApp', 'email', 'digest', 'push']", Case.Sensitive);
        script.ShouldContain("push: push })", Case.Sensitive);
        typeof(UpdateNotificationPreferenceInput).GetProperty("Push").ShouldNotBeNull();
        typeof(NotificationPreferenceDto).GetProperty("Push").ShouldNotBeNull();
    }
}
