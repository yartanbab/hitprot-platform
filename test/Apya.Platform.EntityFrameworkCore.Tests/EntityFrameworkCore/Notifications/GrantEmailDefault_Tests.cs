using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// B-12 · Kullanıcı kararı (2026-10-19): tercih kaydı olmayan kullanıcıda Hibe e-postası AÇIK, diğer kategoriler
/// kapalı; kaydedilmiş tercih varsayılanı ezer.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantEmailDefault_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Tercihi_olmayan_kullanicida_yalniz_hibe_epostasi_acik()
    {
        var userId = Guid.NewGuid();
        var manager = GetRequiredService<NotificationManager>();

        (await WithUnitOfWorkAsync(() => manager.IsEmailEnabledAsync(userId, NotificationCategory.Grants))).ShouldBeTrue();
        (await WithUnitOfWorkAsync(() => manager.IsEmailEnabledAsync(userId, NotificationCategory.Tasks))).ShouldBeFalse();
        (await WithUnitOfWorkAsync(() => manager.IsEmailEnabledAsync(userId, NotificationCategory.Finance))).ShouldBeFalse();
    }

    [Fact]
    public async Task Kaydedilen_tercih_varsayilani_ezer()
    {
        var userId = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<NotificationPreference, Guid>>().InsertAsync(
            new NotificationPreference(Guid.NewGuid(), null, userId, NotificationCategory.Grants,
                inApp: true, email: false, digest: false), autoSave: true));

        (await WithUnitOfWorkAsync(() => GetRequiredService<NotificationManager>()
            .IsEmailEnabledAsync(userId, NotificationCategory.Grants))).ShouldBeFalse();
    }

    [Fact]
    public void Tercih_ekrani_ayni_varsayilani_gosterir()
    {
        NotificationPreferenceDefaults.EmailFor(NotificationCategory.Grants).ShouldBeTrue();
        Enum.GetValues<NotificationCategory>().Where(c => c != NotificationCategory.Grants)
            .ShouldAllBe(c => !NotificationPreferenceDefaults.EmailFor(c));
    }
}
