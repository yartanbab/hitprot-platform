using System;
using System.Linq;
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
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Süresi dolan kurum bilgisi kurum yöneticisine değer + son teyit başına BİR KEZ bildirilir;
/// "hâlâ güncel" teyidi süreyi değeri değiştirmeden yeniden başlatır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmDataStale_Tests : PlatformEntityFrameworkCoreTestBase
{
    // Eş finansman kapasitesi 6 ay, stratejik hedefler 24 ay geçerli (başlangıç kataloğu).
    private static readonly Guid Cofinancing = FirmParameterCatalog.CofinancingCapacityId;
    private static readonly Guid StrategicGoals = FirmParameterCatalog.IdOf(19);

    private readonly ICurrentTenant _currentTenant;

    public FirmDataStale_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public void Izin_adi_PlatformPermissions_ile_ayni()
        => FirmDataStaleNotifier.RecipientPermission.ShouldBe(PlatformPermissions.TenantSettings.Default);

    private async Task<Guid> UserAsync(Guid tenantId, bool canManage)
    {
        var id = Guid.NewGuid();
        var suffix = id.ToString("N")[..8];
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                    new IdentityUser(id, "kurum-" + suffix, $"kurum-{suffix}@apya.test", tenantId), autoSave: true);
                if (canManage)
                {
                    await GetRequiredService<IPermissionGrantRepository>().InsertAsync(new PermissionGrant(
                        Guid.NewGuid(), PlatformPermissions.TenantSettings.Default,
                        UserPermissionValueProvider.ProviderName, id.ToString(), tenantId), autoSave: true);
                }
            }
        });
        return id;
    }

    /// <summary>Değeri, verilen günde girilmiş gibi yazar (güncellik o günden sayılır).</summary>
    private Task ValueAsync(Guid tenantId, Guid definitionId, FirmParameterInput input, DateTime confirmedAt)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var definition = await GetRequiredService<IRepository<FirmParameterDefinition, Guid>>().GetAsync(definitionId);
                await GetRequiredService<IRepository<FirmParameterValue, Guid>>().InsertAsync(
                    new FirmParameterValue(Guid.NewGuid(), tenantId, definition, input, FirmParameterOrigin.UserEntry, confirmedAt),
                    autoSave: true);
            }
        });

    private Task<int> CountAsync(Guid tenantId, Guid userId, Guid definitionId)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return (await GetRequiredService<IRepository<Notification, Guid>>().GetListAsync(n =>
                    n.UserId == userId && n.EntityId == definitionId && n.Type == NotificationType.FirmDataStale)).Count;
            }
        });

    private Task<int> RunAsync(DateTime now)
        => WithUnitOfWorkAsync(() => GetRequiredService<FirmDataStaleNotifier>().RunAsync(now));

    [Fact]
    public async Task Suresi_dolan_bilgi_yetkili_kullaniciya_bir_kez_bildirilir()
    {
        var tenantId = Guid.NewGuid();
        var admin = await UserAsync(tenantId, canManage: true);
        var member = await UserAsync(tenantId, canManage: false);
        var today = DateTime.Today;

        // 6 ay + 5 gün önce girilmiş kapasite: 5 gün önce süresi doldu.
        await ValueAsync(tenantId, Cofinancing, new FirmParameterInput(Number: 100_000m), today.AddMonths(-6).AddDays(-5));
        // 24 ay geçerli hedef, 1 ay önce girildi: taze.
        await ValueAsync(tenantId, StrategicGoals, new FirmParameterInput(Text: "Büyüme"), today.AddMonths(-1));

        await RunAsync(DateTime.Now);
        await RunAsync(DateTime.Now); // işçi günde birkaç kez koşar

        (await CountAsync(tenantId, admin, Cofinancing)).ShouldBe(1);
        (await CountAsync(tenantId, member, Cofinancing)).ShouldBe(0, "kurum verisini değiştiremeyen kullanıcıya gitmez");
        (await CountAsync(tenantId, admin, StrategicGoals)).ShouldBe(0, "süresi dolmamış bilgi bildirilmez");
    }

    [Fact]
    public async Task Cok_once_suresi_dolan_bilgi_toplu_bildirilmez()
    {
        var tenantId = Guid.NewGuid();
        var admin = await UserAsync(tenantId, canManage: true);

        // Süresi 60 gün önce dolmuş: özellik yayına girdiğinde biriken eski durumlar duyurulmaz.
        await ValueAsync(tenantId, Cofinancing, new FirmParameterInput(Number: 1m), DateTime.Today.AddMonths(-6).AddDays(-60));

        await RunAsync(DateTime.Now);

        (await CountAsync(tenantId, admin, Cofinancing)).ShouldBe(0);
    }

    [Fact]
    public async Task Hala_guncel_teyidi_sureyi_yeniden_baslatir_ve_suresi_dolunca_yeniden_bildirilir()
    {
        var tenantId = Guid.NewGuid();
        var admin = await UserAsync(tenantId, canManage: true);
        await ValueAsync(tenantId, Cofinancing, new FirmParameterInput(Number: 250_000m), DateTime.Today.AddMonths(-6).AddDays(-3));

        await RunAsync(DateTime.Now);
        (await CountAsync(tenantId, admin, Cofinancing)).ShouldBe(1);

        using (_currentTenant.Change(tenantId))
        {
            var data = await GetRequiredService<IFirmDataAppService>().ConfirmMineAsync(Cofinancing);
            var item = data.Groups.SelectMany(g => g.Items).Single(i => i.DefinitionId == Cofinancing);
            item.IsStale.ShouldBeFalse();
            item.RawValue.ShouldBe("250000", "teyit değeri değiştirmez");
            item.Source.ShouldBe(FirmParameterSource.Kullanici);
            item.ConfirmedAt!.Value.Date.ShouldBe(DateTime.Today);
        }

        await RunAsync(DateTime.Now);
        (await CountAsync(tenantId, admin, Cofinancing)).ShouldBe(1, "teyit edilen bilgi yeniden bildirilmez");

        // Yeni süre de dolunca: yeni teyit tarihi yeni bir bildirim anahtarıdır.
        await RunAsync(DateTime.Now.AddMonths(6).AddDays(2));
        (await CountAsync(tenantId, admin, Cofinancing)).ShouldBe(2);
    }

    [Fact]
    public async Task Degeri_olmayan_bilgi_teyit_edilemez()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var error = await Should.ThrowAsync<Volo.Abp.BusinessException>(
                () => GetRequiredService<IFirmDataAppService>().ConfirmMineAsync(Cofinancing));

            error.Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterValueRequired);
        }
    }
}
