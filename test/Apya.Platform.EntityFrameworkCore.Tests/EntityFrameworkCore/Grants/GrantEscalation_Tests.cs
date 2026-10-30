using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Faz 2 · Kademeli yükseltme. Beklenen iş varsayılan sürelerde yapılmazsa önce işi bekleyen tarafa
/// hatırlatma, sonra o tarafın yöneticisine gider; aynı kademe aynı bekleme için bir kez gider, iş yapılınca
/// durur, iş yeniden beklemeye girince baştan sayılır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantEscalation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly DateTime Now = new(2026, 10, 29, 12, 0, 0);

    private readonly ICurrentTenant _currentTenant;
    private readonly IGuidGenerator _guids;
    private readonly GrantEscalationManager _manager;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;

    public GrantEscalation_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _guids = GetRequiredService<IGuidGenerator>();
        _manager = GetRequiredService<GrantEscalationManager>();
        _docRepo = GetRequiredService<IRepository<GrantApplicationDocument, Guid>>();
        _appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
    }

    private record Arranged(Guid Tenant, Guid Admin, Guid Member, Guid ApplicationId, Guid DocumentId);

    /// <summary>Kiracı (yönetici + üye), program, açık çağrı, başvuru ve yüklenmiş bir evrak.</summary>
    private async Task<Arranged> ArrangeAsync()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("yuk-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        var grant = new Grant(_guids.Create(), "Yükseltme Programı", "Kurum", maxAmount: 100_000m, minMatchScore: 0);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        var call = new GrantCall(_guids.Create(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await GetRequiredService<IRepository<GrantCall, Guid>>().InsertAsync(call, autoSave: true);

        using (_currentTenant.Change(tenant.Id))
        {
            (await GetRequiredService<IdentityRoleManager>()
                .CreateAsync(new IdentityRole(_guids.Create(), GrantNotificationDispatcher.AdminRoleName, tenant.Id)))
                .Succeeded.ShouldBeTrue();

            var users = GetRequiredService<IdentityUserManager>();
            var admin = new IdentityUser(_guids.Create(), "yon-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            var member = new IdentityUser(_guids.Create(), "uye-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            (await users.CreateAsync(admin)).Succeeded.ShouldBeTrue();
            (await users.CreateAsync(member)).Succeeded.ShouldBeTrue();
            (await users.AddToRoleAsync(admin, GrantNotificationDispatcher.AdminRoleName)).Succeeded.ShouldBeTrue();

            var app = new GrantApplication(_guids.Create(), tenant.Id, call.Id);
            await _appRepo.InsertAsync(app, autoSave: true);

            var doc = new GrantApplicationDocument(_guids.Create(), tenant.Id, app.Id, null, "İmza sirküleri",
                GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, requiresESignature: false, order: 0);
            doc.RegisterUpload(Now.AddDays(-20));
            await _docRepo.InsertAsync(doc, autoSave: true);

            return new Arranged(tenant.Id, admin.Id, member.Id, app.Id, doc.Id);
        }
    }

    private Task RequestRevisionAsync(Arranged a, DateTime at)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(a.Tenant))
            {
                var doc = await _docRepo.GetAsync(a.DocumentId);
                doc.RequestRevision("Tarih güncel değil.", at);
                await _docRepo.UpdateAsync(doc, autoSave: true);
            }
        });

    private Task<int> RunAsync(DateTime now) => WithUnitOfWorkAsync(() => _manager.RunAsync(now));

    private Task<List<Notification>> NotificationsAsync(Guid? tenantId, Guid entityId)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await GetRequiredService<IRepository<Notification, Guid>>().GetListAsync(n => n.EntityId == entityId);
            }
        });

    [Fact]
    public async Task Revizyon_3_gun_bekleyince_firmaya_hatirlatma_bir_kez_gider()
    {
        var a = await WithUnitOfWorkAsync(ArrangeAsync);
        await RequestRevisionAsync(a, Now.AddDays(-4));

        await RunAsync(Now);
        await RunAsync(Now.AddHours(1));

        // Okunmamış aynı tür bildirim tek satırda sayaçla birleşir: gönderim sayısı sayaçtır.
        var rows = await NotificationsAsync(a.Tenant, a.ApplicationId);
        rows.Where(n => n.UserId == a.Member).Sum(n => n.OccurrenceCount).ShouldBe(1, "aynı kademe aynı bekleme için bir kez gider");
        rows.Single(n => n.UserId == a.Member).Title.ShouldStartWith("Hatırlatma");
        rows.ShouldNotContain(n => n.Title.StartsWith("Ekibinizde"), "7 gün dolmadı, yöneticiye gitmez");
    }

    [Fact]
    public async Task Yedi_gun_bekleyince_firma_yoneticisine_yukselir()
    {
        var a = await WithUnitOfWorkAsync(ArrangeAsync);
        await RequestRevisionAsync(a, Now.AddDays(-8));

        await RunAsync(Now);

        var rows = await NotificationsAsync(a.Tenant, a.ApplicationId);
        rows.ShouldContain(n => n.UserId == a.Admin && n.Title.StartsWith("Ekibinizde"));
        rows.ShouldNotContain(n => n.UserId == a.Member && n.Title.StartsWith("Ekibinizde"), "üye yönetici metnini almaz");
    }

    [Fact]
    public async Task Is_yapilinca_yukseltme_durur()
    {
        var a = await WithUnitOfWorkAsync(ArrangeAsync);
        await RequestRevisionAsync(a, Now.AddDays(-4));
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(a.Tenant))
            {
                var doc = await _docRepo.GetAsync(a.DocumentId);
                doc.RegisterUpload(Now.AddDays(-1));
                await _docRepo.UpdateAsync(doc, autoSave: true);
            }
        });

        await RunAsync(Now);

        (await NotificationsAsync(a.Tenant, a.ApplicationId)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Is_yeniden_beklemeye_girince_kademeler_bastan_sayilir()
    {
        var a = await WithUnitOfWorkAsync(ArrangeAsync);
        await RequestRevisionAsync(a, Now.AddDays(-4));
        await RunAsync(Now);

        // Firma yükledi, danışman yine revizyon istedi: yeni bekleme.
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(a.Tenant))
            {
                var doc = await _docRepo.GetAsync(a.DocumentId);
                doc.RegisterUpload(Now.AddDays(1));
                await _docRepo.UpdateAsync(doc, autoSave: true);
            }
        });
        await RequestRevisionAsync(a, Now.AddDays(2));
        await RunAsync(Now.AddDays(6));

        (await NotificationsAsync(a.Tenant, a.ApplicationId))
            .Where(n => n.UserId == a.Member).Sum(n => n.OccurrenceCount).ShouldBe(2);
    }

    [Fact]
    public async Task Gonderilip_ilerletilmeyen_basvuru_danisman_tarafina_hatirlatilir()
    {
        var a = await WithUnitOfWorkAsync(ArrangeAsync);
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(a.Tenant))
            {
                var app = await _appRepo.GetAsync(a.ApplicationId);
                app.Submit(Now.AddDays(-3));
                await _appRepo.UpdateAsync(app, autoSave: true);
            }
        });

        var pending = await WithUnitOfWorkAsync(() => _manager.FindPendingAsync(
            new Dictionary<GrantNotificationTrigger, int> { [GrantNotificationTrigger.ApplicationSubmitted] = 2 }, Now));

        var action = pending.Single(p => p.EntityId == a.ApplicationId);
        action.ActingSide.ShouldBe(GrantPartyRole.Danisman);
        action.Since.ShouldBe(Now.AddDays(-3));
        action.Values["{çağrı_adı}"].ShouldBe("Yükseltme Programı");
    }
}
