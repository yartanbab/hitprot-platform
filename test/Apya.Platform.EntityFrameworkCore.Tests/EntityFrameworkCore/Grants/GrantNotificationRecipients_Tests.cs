using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// N-04 · Kiracıya hibe duyurusu yalnız hibeleri görme yetkisi olan kullanıcılara gider; yetkili kimse
/// yoksa sessiz kalmaz (eski davranış: tüm etkin kullanıcılar).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantNotificationRecipients_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ICurrentTenant _currentTenant;

    public GrantNotificationRecipients_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public void Izin_adi_PlatformPermissions_ile_ayni()
        => GrantNotificationDispatcher.RecipientPermission.ShouldBe(PlatformPermissions.Grants.Default);

    private async Task<(Guid Tenant, Guid Allowed, Guid Other)> ArrangeAsync(bool grantOne)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("alici-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            var users = GetRequiredService<IdentityUserManager>();
            var allowed = new IdentityUser(Guid.NewGuid(), "hibeci-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            var other = new IdentityUser(Guid.NewGuid(), "muhasebe-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            (await users.CreateAsync(allowed)).Succeeded.ShouldBeTrue();
            (await users.CreateAsync(other)).Succeeded.ShouldBeTrue();
            if (grantOne)
            {
                await GetRequiredService<IPermissionGrantRepository>().InsertAsync(new PermissionGrant(
                    Guid.NewGuid(), PlatformPermissions.Grants.Default, UserPermissionValueProvider.ProviderName,
                    allowed.Id.ToString(), tenant.Id), autoSave: true);
            }
            return (tenant.Id, allowed.Id, other.Id);
        }
    }

    private async Task<List<Notification>> NotificationsAsync(Guid tenantId, Guid entityId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await GetRequiredService<IRepository<Notification, Guid>>().GetListAsync(n => n.EntityId == entityId);
        }
    }

    private Task DispatchAsync(Guid tenantId, Guid entityId)
        => WithUnitOfWorkAsync(() => GetRequiredService<GrantNotificationDispatcher>().DispatchToTenantAsync(
            GrantNotificationTrigger.ApplicationStageChanged, tenantId,
            new Dictionary<string, string?> { ["{çağrı_adı}"] = "Alıcı Programı", ["{aşama}"] = "Değerlendirme" },
            "GrantApplication", entityId));

    [Fact]
    public async Task Yalniz_hibe_yetkisi_olan_alir()
    {
        var (tenant, allowed, other) = await WithUnitOfWorkAsync(() => ArrangeAsync(grantOne: true));
        var entityId = Guid.NewGuid();

        await DispatchAsync(tenant, entityId);

        var rows = await WithUnitOfWorkAsync(() => NotificationsAsync(tenant, entityId));
        rows.ShouldContain(n => n.UserId == allowed);
        rows.ShouldNotContain(n => n.UserId == other);
    }

    [Fact]
    public async Task Yetkili_kimse_yoksa_duyuru_kaybolmaz()
    {
        var (tenant, first, second) = await WithUnitOfWorkAsync(() => ArrangeAsync(grantOne: false));
        var entityId = Guid.NewGuid();

        await DispatchAsync(tenant, entityId);

        var rows = await WithUnitOfWorkAsync(() => NotificationsAsync(tenant, entityId));
        rows.ShouldContain(n => n.UserId == first);
        rows.ShouldContain(n => n.UserId == second);
    }
}
