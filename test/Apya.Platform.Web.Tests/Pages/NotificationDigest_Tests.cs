using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NSubstitute;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.SettingManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// NTF-10 · Günlük özetin son gönderim zamanı kalıcıdır. Eskiden işçi "uygulama açıldıktan 24 saat
/// sonra, son 24 saate bak" diye çalışıyordu; yeniden başlatma sayacı sıfırlıyor, pencerenin
/// dışında kalan bildirimler hiçbir özete girmiyordu.
/// </summary>
public class NotificationDigest_Tests : PlatformWebTestBase
{
    private readonly IEmailSender _emails = Substitute.For<IEmailSender>();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder);
        builder.ConfigureServices(s => s.Replace(ServiceDescriptor.Singleton(_emails)));
    }

    /// <summary>Verilen adrese kuyruğa alınan özetlerin gövdeleri.</summary>
    private string[] DigestsTo(string email) => _emails.ReceivedCalls()
        .Where(c => c.GetMethodInfo().Name == nameof(IEmailSender.QueueAsync))
        .Select(c => c.GetArguments())
        .Where(a => (string?)a[0] == email)
        .Select(a => (string)a[2]!)
        .ToArray();

    private async Task<T> InUowAsync<T>(Func<Task<T>> action)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var result = await action();
        await uow.CompleteAsync();
        return result;
    }

    /// <summary>Her çağrı yeni bir servis örneğidir — "uygulama yeniden başladı" ile aynı: bellekte durum yok.</summary>
    private Task<int?> RunAsync(DateTime utcNow)
        => InUowAsync(() => GetRequiredService<NotificationDigestSender>().RunAsync(utcNow));

    private Task<bool> AddNotificationAsync(
        Guid userId, string title, DateTime occurredAtUtc, bool email = true, bool? digest = null)
        => InUowAsync(async () =>
        {
            var notification = new Notification(
                Guid.NewGuid(), tenantId: null, userId, NotificationType.TaskCommentAdded, title, "gövde")
            {
                LastOccurredAt = occurredAtUtc
            };
            await GetRequiredService<IRepository<Notification, Guid>>().InsertAsync(notification, autoSave: true);

            var preferences = GetRequiredService<IRepository<NotificationPreference, Guid>>();
            if (!await preferences.AnyAsync(p => p.UserId == userId && p.Category == notification.Category))
            {
                await preferences.InsertAsync(
                    new NotificationPreference(Guid.NewGuid(), null, userId, notification.Category, inApp: true, email, digest),
                    autoSave: true);
            }

            return true;
        });

    private async Task<(Guid UserId, string Email)> NewUserAsync()
    {
        var email = $"ozet-{Guid.NewGuid():N}@ornek.test";
        var userId = await InUowAsync(async () =>
        {
            var user = new IdentityUser(Guid.NewGuid(), "ozet" + Guid.NewGuid().ToString("N")[..8], email);
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
            return user.Id;
        });
        return (userId, email);
    }

    private Task ResetStampAsync() => InUowAsync(async () =>
    {
        await GetRequiredService<ISettingManager>()
            .SetGlobalAsync(PlatformSettings.Notifications.LastDigestAt, null);
        return true;
    });

    /// <summary>
    /// NTF-09: Özete kimin gireceğine ÖZET bayrağı karar verir. Yalnız anlık (kritik) e-postayı
    /// açan kullanıcı özet almaz; yalnız özeti açan alır.
    /// </summary>
    [Fact]
    public async Task Ozet_Yalniz_Ozet_Bayragi_Acik_Olana_Gider()
    {
        var onlyInstant = await NewUserAsync();
        var onlyDigest = await NewUserAsync();
        await ResetStampAsync();

        var t0 = new DateTime(2031, 3, 5, 6, 0, 0, DateTimeKind.Utc);
        await AddNotificationAsync(onlyInstant.UserId, "anlik-secenin-bildirimi", t0.AddHours(-2), email: true, digest: false);
        await AddNotificationAsync(onlyDigest.UserId, "ozet-secenin-bildirimi", t0.AddHours(-2), email: false, digest: true);

        (await RunAsync(t0)).ShouldNotBeNull();

        DigestsTo(onlyInstant.Email).ShouldBeEmpty();
        DigestsTo(onlyDigest.Email).Length.ShouldBe(1);
    }

    [Fact]
    public async Task Ozet_Son_Gonderimden_Bu_Yanayi_Kapsar_Ve_Vakti_Gelmeden_Yinelenmez()
    {
        var email = $"ozet-{Guid.NewGuid():N}@ornek.test";
        var userId = await InUowAsync(async () =>
        {
            var user = new IdentityUser(Guid.NewGuid(), "ozet" + Guid.NewGuid().ToString("N")[..8], email);
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
            return user.Id;
        });

        // Paylaşılan veritabanında başka bir testten damga kalmış olabilir: temiz başla.
        await InUowAsync(async () =>
        {
            await GetRequiredService<ISettingManager>()
                .SetGlobalAsync(PlatformSettings.Notifications.LastDigestAt, null);
            return true;
        });

        var t0 = new DateTime(2030, 1, 10, 6, 0, 0, DateTimeKind.Utc);

        // 1) İlk çalışma: geriye bir pencere bakar.
        await AddNotificationAsync(userId, "ilk-gun-bildirimi", t0.AddHours(-3));
        (await RunAsync(t0)).ShouldNotBeNull();
        DigestsTo(email).Length.ShouldBe(1);
        DigestsTo(email)[0].ShouldContain("ilk-gun-bildirimi");

        // 2) Bir saat sonra (yeniden başlatma dahil) vakti gelmemiştir: ikinci özet GİTMEZ.
        (await RunAsync(t0.AddHours(1))).ShouldBeNull("son özetin üzerinden 24 saat geçmeden yeniden gönderilmemeli");
        DigestsTo(email).Length.ShouldBe(1);

        // 3) Ertesi gün iki saat GEÇ çalıştı (uygulama kapalıydı). Eski kod yalnız son 24 saate
        //    bakardı ve t0+1 saatteki bildirim hiçbir özete girmezdi.
        await AddNotificationAsync(userId, "arada-kalan-bildirim", t0.AddHours(1));
        await AddNotificationAsync(userId, "dunku-bildirim", t0.AddHours(20));
        (await RunAsync(t0.AddHours(26))).ShouldNotBeNull();

        var digests = DigestsTo(email);
        digests.Length.ShouldBe(2);
        digests[1].ShouldContain("arada-kalan-bildirim");
        digests[1].ShouldContain("dunku-bildirim");
        // Önceki özette giden bildirim yinelenmez.
        digests[1].ShouldNotContain("ilk-gun-bildirimi");
    }
}
