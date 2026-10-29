using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Faz 3 · Yönetici özeti: iş günü 08:00'den (Türkiye) sonra günde bir kez; firma yöneticisine kendi firmasında
/// bekleyen işler, host yöneticisine danışman tarafı. Bekleyen iş yoksa özet gitmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantManagerDigest_Tests : PlatformEntityFrameworkCoreTestBase
{
    // Pazartesi 2026-11-02, 09:00 Türkiye = 06:00 UTC.
    private static readonly DateTime MondayUtc = new(2026, 11, 2, 6, 0, 0, DateTimeKind.Utc);
    private static readonly DateTime Now = new(2026, 11, 2, 9, 0, 0);

    private readonly ICurrentTenant _currentTenant;
    private readonly IGuidGenerator _guids;
    private readonly GrantManagerDigestSender _sender;

    public GrantManagerDigest_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _guids = GetRequiredService<IGuidGenerator>();
        _sender = GetRequiredService<GrantManagerDigestSender>();
    }

    /// <summary>Kiracı (yönetici + üye) ve 5 gündür revizyon bekleyen bir evrak.</summary>
    private async Task<(Guid Tenant, Guid Admin, Guid Member, Guid ApplicationId)> ArrangeAsync(bool submitted = false)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("ozet-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        var grant = new Grant(_guids.Create(), "Özet Programı", "Kurum", maxAmount: 100_000m, minMatchScore: 0);
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
            if (submitted)
            {
                app.Submit(Now.AddDays(-3));
            }
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(app, autoSave: true);

            var doc = new GrantApplicationDocument(_guids.Create(), tenant.Id, app.Id, null, "İmza sirküleri",
                GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, requiresESignature: false, order: 0);
            doc.RegisterUpload(Now.AddDays(-20));
            doc.RequestRevision("Tarih güncel değil.", Now.AddDays(-5));
            await GetRequiredService<IRepository<GrantApplicationDocument, Guid>>().InsertAsync(doc, autoSave: true);

            return (tenant.Id, admin.Id, member.Id, app.Id);
        }
    }

    private Task<int?> RunAsync(DateTime utc, DateTime now) => WithUnitOfWorkAsync(() => _sender.RunAsync(utc, now));

    private Task<List<Notification>> DigestsAsync(Guid? tenantId)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await GetRequiredService<IRepository<Notification, Guid>>()
                    .GetListAsync(n => n.Type == NotificationType.GrantManagerDigest);
            }
        });

    [Fact]
    public async Task Firma_yoneticisi_kendi_firmasinin_isini_gunde_bir_kez_alir()
    {
        var (tenant, admin, member, _) = await WithUnitOfWorkAsync(() => ArrangeAsync());

        (await RunAsync(MondayUtc, Now)).ShouldNotBeNull();
        (await RunAsync(MondayUtc.AddHours(3), Now.AddHours(3))).ShouldBeNull("aynı gün ikinci kez gitmez");

        var rows = await DigestsAsync(tenant);
        var digest = rows.Single(n => n.UserId == admin);
        digest.Title.ShouldBe("Ekibinizde 1 iş bekliyor");
        digest.Body.ShouldContain("Revizyon isteği: 1 (en eskisi 5 gün)");
        digest.Body.ShouldContain("Özet Programı / İmza sirküleri");
        rows.ShouldNotContain(n => n.UserId == member, "özet yöneticiye gider");
    }

    [Theory]
    [InlineData(2026, 10, 31, 9)]  // Cumartesi
    [InlineData(2026, 11, 2, 7)]   // Pazartesi 07:00 — saat gelmedi
    public async Task Hafta_sonu_ve_08_00_oncesi_gitmez(int year, int month, int day, int turkeyHour)
    {
        await WithUnitOfWorkAsync(() => ArrangeAsync());
        var utc = new DateTime(year, month, day, turkeyHour, 0, 0, DateTimeKind.Utc).AddHours(-3);

        (await RunAsync(utc, Now)).ShouldBeNull();
    }

    [Fact]
    public async Task Host_yoneticisine_danisman_tarafinda_bekleyenler_gider()
    {
        await WithUnitOfWorkAsync(() => ArrangeAsync(submitted: true));

        await RunAsync(MondayUtc, Now);

        var host = await DigestsAsync(null);
        host.ShouldNotBeEmpty("gönderilip ilerletilmeyen başvuru danışman tarafında bekler");
        // Test veritabanında başka bekleyen iş olabilir: sayı değil içerik ölçülür.
        host.First().Body.ShouldContain("Başvuru gönderildi · 3 gün");
        host.First().Body.ShouldContain("Atanmamış:");
    }
}
