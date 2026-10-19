using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// H-03 · Sihirbazdaki mesaj ve sıra devri karşı tarafa ulaşır (zil; e-posta şablon varsayılanıyla
/// anında). Eskiden ikisi de sessizdi: karşı taraf ancak sihirbazı açık tutarsa görüyordu. Akış
/// kaydı da eylemi yapanın rolüyle yazılır (her şey "Danışman" yazılıyordu).
/// </summary>
public class GrantWizardNotify_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationWizardAppService _wizard;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uow;

    public GrantWizardNotify_Tests()
    {
        _wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uow = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<(Guid TenantId, Guid ApplicationId, Guid FirmUserId)> CreateFirmApplicationAsync()
    {
        using var uow = _uow.Begin(requiresNew: true);
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Mesajlasan-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null)).First();
        call.SetSchedule(call.OpenDate, DateTime.Now.Date.AddDays(30));
        await callRepo.UpdateAsync(call, autoSave: true);

        var application = new GrantApplication(Guid.NewGuid(), tenant.Id, call.Id);
        await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);

        Guid firmUserId;
        using (_currentTenant.Change(tenant.Id))
        {
            var user = new IdentityUser(Guid.NewGuid(), "firma-" + Guid.NewGuid().ToString("N")[..6],
                Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
            firmUserId = user.Id;
        }

        await uow.CompleteAsync();
        return (tenant.Id, application.Id, firmUserId);
    }

    private async Task<Notification[]> NotificationsAsync(Guid applicationId, NotificationType type)
    {
        using var uow = _uow.Begin(requiresNew: true);
        using (GetRequiredService<IDataFilter>().Disable<IMultiTenant>())
        {
            return (await GetRequiredService<IRepository<Notification, Guid>>()
                .GetListAsync(n => n.EntityId == applicationId && n.Type == type)).ToArray();
        }
    }

    [Fact]
    public async Task Firmanin_mesaji_danismana_bildirim_olarak_duser()
    {
        var (tenantId, id, _) = await CreateFirmApplicationAsync();

        using (_currentTenant.Change(tenantId))
        {
            await _wizard.SendMessageAsync(new SendWizardMessageInput { ApplicationId = id, Body = "Bütçe tablosunu güncelledim." });
        }

        var notes = await NotificationsAsync(id, NotificationType.GrantMessageReceived);
        notes.ShouldNotBeEmpty("atama yokken host ekibine gider");
        notes.ShouldAllBe(n => n.TenantId == null);
        notes.ShouldAllBe(n => n.Body.Contains("Bütçe tablosunu güncelledim."));
    }

    [Fact]
    public async Task Danismanin_mesaji_firmanin_kullanicisina_duser()
    {
        var (_, id, firmUserId) = await CreateFirmApplicationAsync();

        await _wizard.SendMessageAsync(new SendWizardMessageInput { ApplicationId = id, Body = "Faaliyet belgesini yükleyebilir misiniz?" });

        var notes = await NotificationsAsync(id, NotificationType.GrantMessageReceived);
        notes.ShouldContain(n => n.UserId == firmUserId);
    }

    [Fact]
    public async Task Firma_devredince_danisman_haberdar_olur_ve_akis_firma_rolunu_yazar()
    {
        var (tenantId, id, _) = await CreateFirmApplicationAsync();

        using (_currentTenant.Change(tenantId))
        {
            await _wizard.HandOverAsync(id);
        }

        (await NotificationsAsync(id, NotificationType.GrantHandedOver)).ShouldNotBeEmpty();

        using var uow = _uow.Begin(requiresNew: true);
        using (GetRequiredService<IDataFilter>().Disable<IMultiTenant>())
        {
            var activity = (await GetRequiredService<IRepository<GrantApplicationActivity, Guid>>()
                .GetListAsync(a => a.GrantApplicationId == id && a.Kind == GrantActivityKind.HandedOver)).Single();
            activity.ActorRole.ShouldBe(GrantPartyRole.Firma, "firma devretti; eskiden her eylem Danışman yazılıyordu");
        }
    }
}
