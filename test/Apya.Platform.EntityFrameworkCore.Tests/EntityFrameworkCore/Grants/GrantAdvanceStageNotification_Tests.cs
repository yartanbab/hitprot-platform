using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// GRH-V01 · "Aşama İlerlet" penceresi satırın MEVCUT aşaması ve tutarıyla açılır; danışman yalnız onaylanan
/// tutarı girip kaydedince aşama aynı gidiyordu ama firmaya yine "başvurunuz … aşamasına geçti" bildirimi
/// (şablonda açıksa e-postası) çıkıyordu. Bildirim ve süreç akışındaki "aşamasına taşıdı" izi yalnız aşama
/// GERÇEKTEN değiştiyse yazılır; tutar izi (H-07) bundan bağımsız sürer.
///
/// <para>Firma KULLANICILI kurulur: kullanıcısız kiracıda alıcı listesi boş kalır ve "bildirim gitmedi"
/// iddiası düzeltme olmadan da yeşil verirdi.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantAdvanceStageNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantApplicationHostAppService _host;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _applicationRepository;
    private readonly IRepository<GrantApplicationActivity, Guid> _activityRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantAdvanceStageNotification_Tests()
    {
        _host = GetRequiredService<IGrantApplicationHostAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _applicationRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _activityRepository = GetRequiredService<IRepository<GrantApplicationActivity, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Kullanıcılı firmada, Değerlendirme aşamasında bir başvuru.</summary>
    private async Task<(Guid TenantId, Guid ApplicationId, string GrantName)> ArrangeAsync()
    {
        var grantName = "Aşama Bildirimi Programı " + Guid.NewGuid().ToString("N")[..6];
        var grant = new Grant(Guid.NewGuid(), grantName, "Kurum", maxAmount: 2_000_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = await _callRepository.InsertAsync(
            new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);

        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("asama-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        using (_currentTenant.Change(tenant.Id))
        {
            var suffix = Guid.NewGuid().ToString("N")[..6];
            (await GetRequiredService<IdentityUserManager>()
                .CreateAsync(new IdentityUser(Guid.NewGuid(), "firma-" + suffix, $"firma-{suffix}@apya.test", tenant.Id)))
                .Succeeded.ShouldBeTrue();

            var application = new GrantApplication(Guid.NewGuid(), tenant.Id, call.Id);
            application.AdvanceStage(GrantApplicationStage.Degerlendirme);
            await _applicationRepository.InsertAsync(application, autoSave: true);

            return (tenant.Id, application.Id, grantName);
        }
    }

    private async Task<List<Notification>> StageNotificationsAsync(Guid tenantId, Guid applicationId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _notificationRepository.GetListAsync(n =>
                n.Type == NotificationType.GrantApplicationStageChanged && n.EntityId == applicationId);
        }
    }

    private async Task<List<GrantApplicationActivity>> ActivitiesAsync(Guid tenantId, Guid applicationId, GrantActivityKind kind)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _activityRepository.GetListAsync(a => a.GrantApplicationId == applicationId && a.Kind == kind);
        }
    }

    [Fact]
    public async Task Yalniz_onayli_tutar_girilince_firmaya_asama_bildirimi_gitmez()
    {
        var (tenantId, applicationId, _) = await ArrangeAsync();

        await _host.AdvanceStageAsync(new AdvanceApplicationStageInput
        {
            ApplicationId = applicationId, Stage = GrantApplicationStage.Degerlendirme, ApprovedAmount = 750_000m
        });

        (await StageNotificationsAsync(tenantId, applicationId))
            .ShouldBeEmpty("aşama değişmedi; firmaya 'aşama değişti' bildirimi gitmemeli");

        // Tutar yine kaydedildi ve izi sürüyor (H-07).
        using (_currentTenant.Change(tenantId))
        {
            var application = await _applicationRepository.GetAsync(applicationId);
            application.ApprovedAmount.ShouldBe(750_000m);
            application.Stage.ShouldBe(GrantApplicationStage.Degerlendirme);
        }
        (await ActivitiesAsync(tenantId, applicationId, GrantActivityKind.ApprovedAmountChanged)).Count.ShouldBe(1);
    }

    [Fact]
    public async Task Asama_gercekten_degisince_firmaya_bildirim_gider()
    {
        var (tenantId, applicationId, grantName) = await ArrangeAsync();

        await _host.AdvanceStageAsync(new AdvanceApplicationStageInput
        {
            ApplicationId = applicationId, Stage = GrantApplicationStage.Onay
        });

        var notification = (await StageNotificationsAsync(tenantId, applicationId)).ShouldHaveSingleItem();
        notification.OccurrenceCount.ShouldBe(1);
        notification.Body.ShouldContain(grantName);
    }

    /// <summary>
    /// Tür <c>GroupSimilar</c>: okunmamış aynı bildirim varken yenisi satır açmaz, sayacı artırır —
    /// satır sayısı tek başına yetmez, <c>OccurrenceCount</c> da sabit kalmalı.
    /// </summary>
    [Fact]
    public async Task Ayni_istek_ikinci_kez_gelince_ikinci_bildirim_gitmez()
    {
        var (tenantId, applicationId, _) = await ArrangeAsync();
        var input = new AdvanceApplicationStageInput
        {
            ApplicationId = applicationId, Stage = GrantApplicationStage.Onay, ApprovedAmount = 500_000m
        };

        await _host.AdvanceStageAsync(input);
        await _host.AdvanceStageAsync(input);

        var notification = (await StageNotificationsAsync(tenantId, applicationId)).ShouldHaveSingleItem();
        notification.OccurrenceCount.ShouldBe(1);
    }

    [Fact]
    public async Task Asama_degisince_akisa_iz_duser_degismeyince_dusmez()
    {
        var (tenantId, applicationId, _) = await ArrangeAsync();

        using (CultureHelper.Use("tr"))
        {
            // Aynı aşama + tutar: aşama izi yok.
            await _host.AdvanceStageAsync(new AdvanceApplicationStageInput
            {
                ApplicationId = applicationId, Stage = GrantApplicationStage.Degerlendirme, ApprovedAmount = 250_000m
            });
            (await ActivitiesAsync(tenantId, applicationId, GrantActivityKind.StageMoved)).ShouldBeEmpty();

            // Gerçek değişim: panodan sürüklemeyle aynı iz, aşamanın ekrandaki adıyla.
            await _host.AdvanceStageAsync(new AdvanceApplicationStageInput
            {
                ApplicationId = applicationId, Stage = GrantApplicationStage.Onay
            });
        }

        var moved = (await ActivitiesAsync(tenantId, applicationId, GrantActivityKind.StageMoved)).ShouldHaveSingleItem();
        moved.Context.ShouldBe("Onay");
        moved.ActorRole.ShouldBe(GrantPartyRole.Danisman);
    }
}
