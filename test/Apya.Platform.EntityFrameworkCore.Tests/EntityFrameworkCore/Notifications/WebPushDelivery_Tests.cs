using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;
using Apya.Platform.Settings;
using Volo.Abp.Timing;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// NTF-08 Faz 2 · Gönderim zinciri üç yarıda ölçülür: OLAY → kuyruk (kime, ne), İŞ → cihaz durumu
/// (başarı / ölü abonelik / geçici hata) ve GÖNDERİCİ → şifreli istek. Gerçek bildirim servisine
/// hiçbir istek gitmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class WebPushDelivery_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string SecretBody = "Personel kalemi %112 kullanıldı, 48.000 TL plan dışı";

    private readonly IRepository<NotificationDevice, Guid> _deviceRepository;
    private readonly IRepository<NotificationPreference, Guid> _preferenceRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;
    private readonly IUnitOfWorkManager _uowManager;

    public WebPushDelivery_Tests()
    {
        _deviceRepository = GetRequiredService<IRepository<NotificationDevice, Guid>>();
        _preferenceRepository = GetRequiredService<IRepository<NotificationPreference, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private static WebPushOptions Enabled() => new()
    {
        PublicKey = "test-public-key", PrivateKey = "test-private-key", Subject = "mailto:test@example.com"
    };

    private async Task<NotificationDevice> DeviceAsync(Guid userId, bool active = true)
    {
        var device = new NotificationDevice(
            Guid.NewGuid(), null, userId, NotificationDevicePlatform.WebPush,
            "https://fcm.googleapis.com/fcm/send/" + Guid.NewGuid().ToString("N"), "p256dh", "auth", "Chrome/140 Windows", _clock.Now);
        if (!active) { device.Deactivate("test"); }
        await _deviceRepository.InsertAsync(device, autoSave: true);
        return device;
    }

    private static NotificationCreatedEto Event(Guid userId, Guid projectId) => new()
    {
        Id = Guid.NewGuid(),
        TenantId = null,
        UserId = userId,
        Title = "Bütçe uyarısı · Yeşil Enerji Projesi",
        Body = SecretBody,
        EntityType = "Project",
        EntityId = projectId,
        Type = NotificationType.ProjectEndingSoon,
        Severity = NotificationSeverity.High
    };

    /* ─── Olay → kuyruk ───────────────────────────────────────────────── */

    private sealed class CapturingJobManager : IBackgroundJobManager
    {
        public List<WebPushJobArgs> Jobs { get; } = new();
        public List<BackgroundJobPriority> Priorities { get; } = new();
        public List<TimeSpan?> Delays { get; } = new();

        public Task<string> EnqueueAsync<TArgs>(
            TArgs args, BackgroundJobPriority priority = BackgroundJobPriority.Normal, TimeSpan? delay = null)
        {
            Jobs.Add((WebPushJobArgs)(object)args!);
            Priorities.Add(priority);
            Delays.Add(delay);
            return Task.FromResult(Guid.NewGuid().ToString());
        }
    }

    private WebPushNotificationHandler Handler(IBackgroundJobManager jobs, WebPushOptions? options = null)
        => new(_deviceRepository, _preferenceRepository, jobs, _currentTenant,
            Options.Create(options ?? Enabled()), GetRequiredService<ISettingManager>(), _clock,
            NullLogger<WebPushNotificationHandler>.Instance);

    private async Task<CapturingJobManager> QueueAsync(NotificationCreatedEto eto, WebPushOptions? options = null)
    {
        var jobs = new CapturingJobManager();
        await WithUnitOfWorkAsync(() => Handler(jobs, options).HandleEventAsync(eto));
        return jobs;
    }

    private async Task<List<WebPushJobArgs>> HandleAsync(NotificationCreatedEto eto, WebPushOptions? options = null)
        => (await QueueAsync(eto, options)).Jobs;

    [Fact]
    public async Task Bildirim_kullanicinin_her_etkin_cihazina_kuyruklanir_baskasinin_cihazina_gitmez()
    {
        var user = Guid.NewGuid();
        var first = await DeviceAsync(user);
        var second = await DeviceAsync(user);
        await DeviceAsync(user, active: false);
        await DeviceAsync(Guid.NewGuid());

        var jobs = await HandleAsync(Event(user, Guid.NewGuid()));

        jobs.Select(j => j.DeviceId).ShouldBe(new[] { first.Id, second.Id }, ignoreOrder: true);
        jobs.ShouldAllBe(j => j.Urgent, "yüksek önemli bildirim acil gönderilir");
    }

    /// <summary>N-02 · Yüksek/Kritik push kuyrukta öne geçer (geniş dağıtımda sıradanların arkasında beklemez).</summary>
    [Fact]
    public async Task Acil_push_yuksek_oncelikle_kuyruga_girer()
    {
        var user = Guid.NewGuid();
        await DeviceAsync(user);
        var jobs = await QueueAsync(Event(user, Guid.NewGuid()));

        jobs.Priorities.ShouldBe(new[] { BackgroundJobPriority.High });
    }

    /// <summary>
    /// Sessiz saatler (kullanıcı kararı 2026-10-19, varsayılan kapalı): kullanıcı açtıysa pencere içindeki Normal
    /// push pencere sonuna ertelenir (okunduysa gitmesin diye bildirim kimliğini taşır); Yüksek/Kritik anında gider.
    /// </summary>
    [Fact]
    public async Task Sessiz_saatlerde_normal_push_pencere_sonuna_ertelenir_yuksek_aninda_gider()
    {
        var user = Guid.NewGuid();
        await DeviceAsync(user);
        var normal = Event(user, Guid.NewGuid());
        normal.Severity = NotificationSeverity.Normal;

        (await QueueAsync(normal)).Delays.Single().ShouldBeNull("varsayılan: kapalı");

        // Şu anı her zaman içine alan pencere: bir saat önce → bir saat sonra.
        var now = _clock.Now;
        await WithUnitOfWorkAsync(async () =>
        {
            var settings = GetRequiredService<ISettingManager>();
            await settings.SetForUserAsync(user, PlatformSettings.NotificationQuietHours.Enabled, "true");
            await settings.SetForUserAsync(user, PlatformSettings.NotificationQuietHours.Window,
                now.AddHours(-1).ToString("HH:mm") + "-" + now.AddHours(1).ToString("HH:mm"));
        });

        var quiet = await QueueAsync(normal);
        quiet.Delays.Single()!.Value.ShouldBeInRange(TimeSpan.FromMinutes(58), TimeSpan.FromMinutes(61));
        quiet.Jobs.Single().NotificationId.ShouldBe(normal.Id);
        quiet.Priorities.Single().ShouldBe(BackgroundJobPriority.Normal);

        var urgent = await QueueAsync(Event(user, Guid.NewGuid()));
        urgent.Delays.Single().ShouldBeNull("Yüksek önem sessiz saati dinlemez");
        urgent.Jobs.Single().NotificationId.ShouldBeNull();
    }

    /// <summary>
    /// 🔴 K2 · VARSAYILAN: push gövdesi yalnız BAŞLIK taşır — işletim sistemi bildirimi kilit ekranında görünür,
    /// tutar ve ayrıntı uygulama içinde kalır (kullanıcı kararı 2026-10-19: varsayılan korunur).
    /// </summary>
    [Fact]
    public async Task Push_govdesi_yalniz_basligi_tasir_bildirimin_metni_gitmez()
    {
        var user = Guid.NewGuid();
        var projectId = Guid.NewGuid();
        await DeviceAsync(user);
        var eto = Event(user, projectId);

        var payload = (await HandleAsync(eto)).Single().PayloadJson;

        payload.ShouldNotContain("48.000", Case.Sensitive);
        payload.ShouldNotContain("Personel", Case.Sensitive);

        var json = JsonDocument.Parse(payload).RootElement;
        json.GetProperty("title").GetString().ShouldBe("Bütçe uyarısı · Yeşil Enerji Projesi");
        json.GetProperty("notificationId").GetGuid().ShouldBe(eto.Id);
        json.GetProperty("severity").GetInt32().ShouldBe((int)NotificationSeverity.High);
        json.GetProperty("url").GetString().ShouldBe("/Projects/ProjectDetails/" + projectId);
        json.TryGetProperty("body", out _).ShouldBeFalse("gövde alanı hiç yazılmaz");
    }

    /// <summary>Kullanıcı "yalnız başlık"ı kapattıysa kısa özet (en çok 120 karakter) gelir.</summary>
    [Fact]
    public async Task Kisa_ozet_tercihini_acan_kiside_govde_kisaltilarak_gelir()
    {
        var user = Guid.NewGuid();
        await DeviceAsync(user);
        await WithUnitOfWorkAsync(() => GetRequiredService<ISettingManager>()
            .SetForUserAsync(user, PlatformSettings.NotificationLockScreen.TitleOnly, "false"));

        var json = JsonDocument.Parse((await HandleAsync(Event(user, Guid.NewGuid()))).Single().PayloadJson).RootElement;

        json.GetProperty("body").GetString().ShouldBe(SecretBody);
    }

    [Fact]
    public void Kisa_ozet_bosluklari_tekler_uzunu_keser_bosu_yazmaz()
    {
        WebPushPayload.Short(null).ShouldBeNull();
        WebPushPayload.Short("  \n ").ShouldBeNull();
        WebPushPayload.Short("Ali\n\n  yorum   yazdı").ShouldBe("Ali yorum yazdı");

        var cut = WebPushPayload.Short(new string('a', 300))!;
        cut.Length.ShouldBe(WebPushPayload.MaxBodyLength);
        cut.ShouldEndWith("…");
    }

    [Fact]
    public async Task Push_tercihi_kapaliysa_ya_da_kanal_kapaliysa_kuyruga_bir_sey_girmez()
    {
        var user = Guid.NewGuid();
        await DeviceAsync(user);

        (await HandleAsync(Event(user, Guid.NewGuid()), new WebPushOptions())).ShouldBeEmpty("anahtarlar tanımlı değil");

        await _preferenceRepository.InsertAsync(
            new NotificationPreference(Guid.NewGuid(), null, user, NotificationCategory.Projects, inApp: true, email: false, push: false),
            autoSave: true);

        (await HandleAsync(Event(user, Guid.NewGuid()))).ShouldBeEmpty("kullanıcı bu kategoride push istemiyor");
    }

    /// <summary>İşleyici elle kurulup ölçüldü; olay yoluna GERÇEKTEN kayıtlı olduğu ayrıca doğrulanır.</summary>
    [Fact]
    public void Isleyici_bildirim_olayina_kayitlidir()
        => GetRequiredService<IOptions<Volo.Abp.EventBus.Local.AbpLocalEventBusOptions>>().Value.Handlers
            .ShouldContain(typeof(WebPushNotificationHandler));

    /* ─── İş → cihaz durumu ───────────────────────────────────────────── */

    private sealed class FakeSender : IWebPushSender
    {
        private readonly WebPushSendResult _result;
        public int Calls { get; private set; }

        public FakeSender(WebPushSendResult result) { _result = result; }

        public Task<WebPushSendResult> SendAsync(NotificationDevice device, string payloadJson, string? topic, bool urgent)
        {
            Calls++;
            return Task.FromResult(_result);
        }
    }

    private WebPushJob Job(IWebPushSender sender)
        => new(_deviceRepository, GetRequiredService<IRepository<Notification, Guid>>(), sender, _currentTenant, _clock, _uowManager);

    private static WebPushJobArgs Args(Guid deviceId) => new() { DeviceId = deviceId, PayloadJson = "{}" };

    [Fact]
    public async Task Basarili_gonderim_cihaza_islenir()
    {
        var device = await DeviceAsync(Guid.NewGuid());

        await Job(new FakeSender(WebPushSendResult.Sent)).ExecuteAsync(Args(device.Id));

        var row = await _deviceRepository.GetAsync(device.Id);
        row.LastSuccessAt.ShouldNotBeNull();
        row.IsActive.ShouldBeTrue();
        row.FailureCount.ShouldBe(0);
    }

    /// <summary>404 / 410: abonelik öldü. Cihaz pasifleşir, iş yeniden denenmez (istisna atılmaz).</summary>
    [Fact]
    public async Task Olu_abonelik_cihazi_pasiflestirir_ve_is_yeniden_denenmez()
    {
        var device = await DeviceAsync(Guid.NewGuid());

        await Job(new FakeSender(WebPushSendResult.SubscriptionGone)).ExecuteAsync(Args(device.Id));

        var row = await _deviceRepository.GetAsync(device.Id);
        row.IsActive.ShouldBeFalse();
        row.DeactivationReason.ShouldBe("410 Gone");

        // Pasif cihaza bir daha gönderilmez.
        var sender = new FakeSender(WebPushSendResult.Sent);
        await Job(sender).ExecuteAsync(Args(device.Id));
        sender.Calls.ShouldBe(0);
    }

    /// <summary>Geçici hata: iş istisna atar (ABP yeniden dener) ama hata sayacı KALICI yazılır.</summary>
    [Fact]
    public async Task Gecici_hata_isi_yeniden_denetir_hata_sayaci_yazilir_cihaz_etkin_kalir()
    {
        var device = await DeviceAsync(Guid.NewGuid());

        await Should.ThrowAsync<WebPushTransientException>(
            () => Job(new FakeSender(WebPushSendResult.TransientFailure)).ExecuteAsync(Args(device.Id)));

        var row = await _deviceRepository.GetAsync(device.Id);
        row.IsActive.ShouldBeTrue();
        row.FailureCount.ShouldBe(1);
        row.LastFailureAt.ShouldNotBeNull();
    }

    /// <summary>Sessiz saatler yüzünden ertelenen push, bildirim o arada uygulamada okunduysa sabah ekrana düşmez.</summary>
    [Fact]
    public async Task Ertelenen_push_bu_arada_okunduysa_gonderilmez()
    {
        var user = Guid.NewGuid();
        var device = await DeviceAsync(user);
        var notifications = GetRequiredService<IRepository<Notification, Guid>>();
        var unread = new Notification(Guid.NewGuid(), null, user, NotificationType.TaskAssigned, "Yeni görev", "Gövde");
        var read = new Notification(Guid.NewGuid(), null, user, NotificationType.TaskAssigned, "Yeni görev", "Gövde");
        read.MarkAsRead();
        await notifications.InsertAsync(unread, autoSave: true);
        await notifications.InsertAsync(read, autoSave: true);

        var skipped = new FakeSender(WebPushSendResult.Sent);
        await Job(skipped).ExecuteAsync(new WebPushJobArgs { DeviceId = device.Id, PayloadJson = "{}", NotificationId = read.Id });
        skipped.Calls.ShouldBe(0);

        var sent = new FakeSender(WebPushSendResult.Sent);
        await Job(sent).ExecuteAsync(new WebPushJobArgs { DeviceId = device.Id, PayloadJson = "{}", NotificationId = unread.Id });
        sent.Calls.ShouldBe(1);
    }

    [Fact]
    public async Task Kuyruktayken_silinen_cihaza_gonderilmez()
    {
        var sender = new FakeSender(WebPushSendResult.Sent);

        await Job(sender).ExecuteAsync(Args(Guid.NewGuid()));

        sender.Calls.ShouldBe(0);
    }

    /* ─── Gönderici → şifreli istek (.NET 10'da paket çalışıyor mu) ───── */

    private sealed class StubHandler : HttpMessageHandler
    {
        private readonly HttpStatusCode _status;
        public HttpRequestMessage? Request { get; private set; }
        public byte[] Body { get; private set; } = Array.Empty<byte>();

        public StubHandler(HttpStatusCode status) { _status = status; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Request = request;
            Body = request.Content == null ? Array.Empty<byte>() : await request.Content.ReadAsByteArrayAsync(cancellationToken);
            return new HttpResponseMessage(_status);
        }
    }

    private sealed class StubFactory : IHttpClientFactory
    {
        private readonly HttpMessageHandler _handler;
        public StubFactory(HttpMessageHandler handler) { _handler = handler; }
        public HttpClient CreateClient(string name) => new(_handler, disposeHandler: false);
    }

    private static string Base64Url(byte[] bytes)
        => Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    /// <summary>Gerçek biçimde (P-256) ama yalnız bu test için üretilen anahtar çifti.</summary>
    private static (string Public, string Private) NewP256KeyPair()
    {
        using var ec = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var p = ec.ExportParameters(includePrivateParameters: true);
        var publicKey = new byte[65];
        publicKey[0] = 0x04;
        p.Q.X!.CopyTo(publicKey, 1);
        p.Q.Y!.CopyTo(publicKey, 33);
        return (Base64Url(publicKey), Base64Url(p.D!));
    }

    private async Task<(WebPushSendResult Result, StubHandler Http)> SendAsync(HttpStatusCode status)
    {
        var vapid = NewP256KeyPair();
        var browser = NewP256KeyPair();
        var auth = RandomNumberGenerator.GetBytes(16);

        var device = new NotificationDevice(
            Guid.NewGuid(), null, Guid.NewGuid(), NotificationDevicePlatform.WebPush,
            "https://fcm.googleapis.com/fcm/send/abc123", browser.Public, Base64Url(auth), "Chrome/140 Windows", _clock.Now);

        var http = new StubHandler(status);
        var sender = new WebPushSender(
            new StubFactory(http),
            Options.Create(new WebPushOptions { PublicKey = vapid.Public, PrivateKey = vapid.Private, Subject = "mailto:test@example.com" }),
            NullLogger<WebPushSender>.Instance);

        var payload = WebPushPayload.Build(Guid.NewGuid(), "Bütçe uyarısı", null, null, NotificationSeverity.High, "/Projects");
        var result = await sender.SendAsync(device, payload, WebPushPayload.Topic(Guid.NewGuid()), urgent: true);
        return (result, http);
    }

    [Fact]
    public async Task Gonderici_abonelik_adresine_sifreli_ve_VAPID_imzali_istek_atar()
    {
        var (result, http) = await SendAsync(HttpStatusCode.Created);

        result.ShouldBe(WebPushSendResult.Sent);
        http.Request.ShouldNotBeNull();
        http.Request!.Method.ShouldBe(HttpMethod.Post);
        http.Request.RequestUri!.ToString().ShouldBe("https://fcm.googleapis.com/fcm/send/abc123");
        http.Request.Headers.Authorization.ShouldNotBeNull("VAPID kimliği gönderilmeli");
        http.Request.Headers.Contains("TTL").ShouldBeTrue();
        http.Request.Headers.GetValues("Urgency").Single().ShouldBe("high");
        http.Request.Content!.Headers.ContentEncoding.ShouldContain("aes128gcm");

        // Gövde şifreli: başlık düz metin olarak görünmez.
        http.Body.Length.ShouldBeGreaterThan(0);
        Encoding.UTF8.GetString(http.Body).ShouldNotContain("Bütçe uyarısı", Case.Sensitive);
    }

    [Theory]
    [InlineData(HttpStatusCode.Gone, WebPushSendResult.SubscriptionGone)]
    [InlineData(HttpStatusCode.NotFound, WebPushSendResult.SubscriptionGone)]
    [InlineData(HttpStatusCode.TooManyRequests, WebPushSendResult.TransientFailure)]
    [InlineData(HttpStatusCode.InternalServerError, WebPushSendResult.TransientFailure)]
    public async Task Gonderici_servis_yanitini_kalici_ve_gecici_hata_olarak_ayirir(HttpStatusCode status, WebPushSendResult expected)
        => (await SendAsync(status)).Result.ShouldBe(expected);
}
