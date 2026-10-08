using System;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.Shell;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// Kenar çubuğundaki "webhook hatası" rozeti yalnız KENDİ aboneliklerinin hatalarını sayar.
///
/// <para>Teslim kaydı kiracı sütunu taşımaz (aboneliğe bağlıdır); rozet kayıtları aboneliğe
/// bakmadan sayıyordu ve her kiracı, platformdaki BÜTÜN kiracıların son 24 saatteki başarısız
/// teslim sayısını kendi rozetinde görüyordu — kendi hiç webhook'u olmasa bile.</para>
/// </summary>
public class ShellWebhookErrorBadge_Tests : PlatformWebTestBase
{
    private static readonly Guid TenantA = Guid.Parse("7c1f0000-cccc-4000-8000-00000000cca3");
    private static readonly Guid TenantB = Guid.Parse("7c1f0000-cccc-4000-8000-00000000ccb3");

    private readonly IShellAppService _shell;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public ShellWebhookErrorBadge_Tests()
    {
        _shell = GetRequiredService<IShellAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<int> BadgeAsync(Guid? tenantId)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        using (_currentTenant.Change(tenantId))
        {
            var state = await _shell.GetStateAsync();
            await uow.CompleteAsync();
            return state.Badges.WebhookErrors;
        }
    }

    private async Task FailDeliveryAsync(Guid tenantId)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        using (_currentTenant.Change(tenantId))
        {
            // Abonelik kiracı kapsamında KURULUR: TenantId nesne oluşurken atanır.
            var subscription = new WebhookSubscription(
                Guid.NewGuid(), Guid.NewGuid(), "https://alici.example/webhook", "gizli-anahtar");
            await GetRequiredService<IRepository<WebhookSubscription, Guid>>().InsertAsync(subscription, autoSave: true);
            subscription.TenantId.ShouldBe(tenantId);

            await GetRequiredService<IRepository<WebhookDeliveryLog, Guid>>().InsertAsync(
                new WebhookDeliveryLog(Guid.NewGuid(), subscription.Id, "{}", 500, "hata", tryCount: 3, isSuccess: false),
                autoSave: true);
        }

        await uow.CompleteAsync();
    }

    [Fact]
    public async Task Rozet_Baska_Kiracinin_Hatalarini_Saymaz()
    {
        var ownBefore = await BadgeAsync(TenantA);
        var otherBefore = await BadgeAsync(TenantB);

        await FailDeliveryAsync(TenantA);

        (await BadgeAsync(TenantA)).ShouldBe(ownBefore + 1, "kiracı kendi aboneliğinin hatasını görmeli");
        (await BadgeAsync(TenantB)).ShouldBe(otherBefore, "başka kiracının hatası bu kiracının rozetine yansıdı");
    }
}
