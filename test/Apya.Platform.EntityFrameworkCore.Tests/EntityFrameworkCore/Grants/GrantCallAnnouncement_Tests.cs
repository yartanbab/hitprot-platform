using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Açık ama duyurulmamış çağrı taraması: veritabanına dışarıdan eklenen (AppService'ten geçmeyen)
/// açık çağrı firmaya ulaşır; ikinci tur mükerrer üretmez; eski çağrı duyurulmadan işaretlenir;
/// taslak çağrıya dokunulmaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantCallAnnouncement_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _profileTagRepo;
    private readonly IRepository<GrantNotificationLog, Guid> _logRepo;
    private readonly IRepository<Notification, Guid> _notificationRepo;
    private readonly ICurrentTenant _currentTenant;

    public GrantCallAnnouncement_Tests()
    {
        _grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        _criteriaRepo = GetRequiredService<IRepository<GrantCriteriaTag, Guid>>();
        _profileRepo = GetRequiredService<IRepository<FirmProfile, Guid>>();
        _profileTagRepo = GetRequiredService<IRepository<FirmProfileTag, Guid>>();
        _logRepo = GetRequiredService<IRepository<GrantNotificationLog, Guid>>();
        _notificationRepo = GetRequiredService<IRepository<Notification, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Doğrudan depoya yazılan çağrı = AppService'ten geçmeyen (SQL/tohum) kayıt.</summary>
    private async Task<GrantCall> InsertCallAsync(string sector, GrantCallStatus status, DateTime? createdAt = null)
    {
        var grant = new Grant(Guid.NewGuid(), "Dış Kayıt " + Guid.NewGuid().ToString("N")[..6], "Kurum", maxAmount: 0m, minMatchScore: 0);
        await _grantRepo.InsertAsync(grant, autoSave: true);
        await _criteriaRepo.InsertAsync(new GrantCriteriaTag(Guid.NewGuid(), grant.Id, GrantCriteriaKind.Sektor, sector), autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/2", status);
        call.SetSchedule(null, DateTime.Now.Date.AddDays(30));
        if (createdAt.HasValue)
        {
            // Denetim ayarlayıcısı yalnız boş CreationTime'ı doldurur; eski kayıt böyle taklit edilir.
            ObjectHelper.TrySetProperty(call, c => c.CreationTime, () => createdAt.Value);
        }
        await _callRepo.InsertAsync(call, autoSave: true);
        return call;
    }

    /// <summary>Sektör etiketi programla örtüşen (skor 100) ve bir kullanıcısı olan kiracı.</summary>
    private async Task<(Guid TenantId, Guid UserId)> CreateEligibleTenantAsync(string sector)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("duyuru-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            var profile = new FirmProfile(Guid.NewGuid(), tenant.Id);
            await _profileRepo.InsertAsync(profile, autoSave: true);
            await _profileTagRepo.InsertAsync(new FirmProfileTag(Guid.NewGuid(), profile.Id, GrantCriteriaKind.Sektor, sector), autoSave: true);

            var user = new IdentityUser(Guid.NewGuid(), "firma-" + Guid.NewGuid().ToString("N")[..6],
                Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            (await GetRequiredService<IdentityUserManager>().CreateAsync(user)).Succeeded.ShouldBeTrue();
            return (tenant.Id, user.Id);
        }
    }

    /// <summary>
    /// Test veritabanındaki katalog tohumu (yüzden fazla açık çağrı) tohumlama anında oluştuğu için pencere
    /// içindedir ve taramada sıraya girer; üretimdeki "katalog zaten işlenmiş" durumu burada kurulur.
    /// </summary>
    private Task BaselineAsync() => WithUnitOfWorkAsync(async () =>
    {
        var announcer = GetRequiredService<GrantCallAnnouncer>();
        List<GrantCall> open;
        using (GetRequiredService<IDataFilter<IMultiTenant>>().Disable())
        {
            open = await _callRepo.GetListAsync(c => c.TenantId == null && c.Status == GrantCallStatus.Acik);
        }
        foreach (var call in open)
        {
            await announcer.MarkProcessedAsync(call.Id, DateTime.Now);
        }
    });

    private Task<int> SweepAsync()
        => WithUnitOfWorkAsync(() => GetRequiredService<GrantCallAnnouncer>().AnnounceUnannouncedAsync(DateTime.Now));

    private async Task<List<Notification>> AnnouncementsAsync(Guid tenantId, Guid callId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _notificationRepo.GetListAsync(n => n.EntityId == callId && n.Type == NotificationType.GrantCallPublished);
        }
    }

    private Task<bool> IsProcessedAsync(Guid callId)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(null))
            {
                return await _logRepo.AnyAsync(x =>
                    x.Trigger == GrantNotificationTrigger.CallPublished && x.EntityId == callId && x.TenantId == null);
            }
        });

    [Fact]
    public async Task Disaridan_eklenen_acik_cagri_uygun_firmaya_duyurulur_ve_ikinci_tur_mukerrer_uretmez()
    {
        await BaselineAsync();
        var sector = "sektor-" + Guid.NewGuid().ToString("N")[..6];
        var (tenantId, userId) = await WithUnitOfWorkAsync(() => CreateEligibleTenantAsync(sector));
        var call = await WithUnitOfWorkAsync(() => InsertCallAsync(sector, GrantCallStatus.Acik));

        (await SweepAsync()).ShouldBe(1, "açık ve işlenmemiş tek çağrı duyurulmalı");

        var first = await WithUnitOfWorkAsync(() => AnnouncementsAsync(tenantId, call.Id));
        first.ShouldHaveSingleItem().UserId.ShouldBe(userId);
        (await IsProcessedAsync(call.Id)).ShouldBeTrue("çağrı host günlüğünde işlenmiş olarak işaretlenmeli");

        (await SweepAsync()).ShouldBe(0, "işlenmiş çağrı ikinci turda yeniden duyurulmamalı");
        (await WithUnitOfWorkAsync(() => AnnouncementsAsync(tenantId, call.Id))).Count.ShouldBe(1);
    }

    [Fact]
    public async Task Pencereden_eski_cagri_duyurulmaz_ama_islenmis_sayilir()
    {
        await BaselineAsync();
        var sector = "sektor-" + Guid.NewGuid().ToString("N")[..6];
        var (tenantId, _) = await WithUnitOfWorkAsync(() => CreateEligibleTenantAsync(sector));
        var call = await WithUnitOfWorkAsync(() => InsertCallAsync(
            sector, GrantCallStatus.Acik, createdAt: DateTime.Now.AddDays(-(GrantCallAnnouncer.AnnounceWindowDays + 1))));

        (await SweepAsync()).ShouldBe(0);

        (await WithUnitOfWorkAsync(() => AnnouncementsAsync(tenantId, call.Id))).ShouldBeEmpty(
            "birikmiş devirde eski çağrı firmaların kutusunu doldurmamalı");
        (await IsProcessedAsync(call.Id)).ShouldBeTrue("eski çağrı bir daha ele alınmasın diye işaretlenmeli");
    }

    [Fact]
    public async Task Taslak_cagri_taramaya_girmez()
    {
        await BaselineAsync();
        var sector = "sektor-" + Guid.NewGuid().ToString("N")[..6];
        var (tenantId, _) = await WithUnitOfWorkAsync(() => CreateEligibleTenantAsync(sector));
        var call = await WithUnitOfWorkAsync(() => InsertCallAsync(sector, GrantCallStatus.Taslak));

        await SweepAsync();

        (await WithUnitOfWorkAsync(() => AnnouncementsAsync(tenantId, call.Id))).ShouldBeEmpty();
        (await IsProcessedAsync(call.Id)).ShouldBeFalse("taslak yayımlanmadı; işaret de konmaz ki yayınlanınca duyurulsun");
    }

    [Fact]
    public async Task Uygun_olmayan_firma_duyuru_almaz()
    {
        await BaselineAsync();
        var sector = "sektor-" + Guid.NewGuid().ToString("N")[..6];
        var (tenantId, _) = await WithUnitOfWorkAsync(() => CreateEligibleTenantAsync("baska-" + sector));
        var call = await WithUnitOfWorkAsync(() => InsertCallAsync(sector, GrantCallStatus.Acik));

        await SweepAsync();

        (await WithUnitOfWorkAsync(() => AnnouncementsAsync(tenantId, call.Id))).ShouldBeEmpty(
            "duyuru yalnız uygunluk eşiğini geçen firmaya gider");
        (await IsProcessedAsync(call.Id)).ShouldBeTrue();
    }

    [Fact]
    public async Task Yayin_akisiyla_duyurulan_cagri_taramada_ikinci_kez_duyurulmaz()
    {
        await BaselineAsync();
        var sector = "sektor-" + Guid.NewGuid().ToString("N")[..6];
        var (tenantId, _) = await WithUnitOfWorkAsync(() => CreateEligibleTenantAsync(sector));
        var call = await WithUnitOfWorkAsync(() => InsertCallAsync(sector, GrantCallStatus.Acik));

        // Yayın akışı (GrantParameterAppService.PublishAsync) aynı girişi kullanır.
        await WithUnitOfWorkAsync(async () =>
        {
            var grant = await _grantRepo.GetAsync(call.GrantId);
            await GetRequiredService<GrantCallAnnouncer>().AnnounceAsync(grant, call, DateTime.Now);
        });

        (await SweepAsync()).ShouldBe(0);
        (await WithUnitOfWorkAsync(() => AnnouncementsAsync(tenantId, call.Id))).Count.ShouldBe(1);
    }
}
