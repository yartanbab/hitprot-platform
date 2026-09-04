using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// KİLİT SÖZLEŞME: başvuruyu HOST açar. Kiracı çağrıya ilgi bildirir; başvuru ancak
/// host talebi olumlu karara bağlayınca ve TALEBİ BIRAKAN KİRACIDA doğar.
///
/// <para>Regresyon kaynağı: host kutusu kiracılar arası çalışıyor. Başvuru host
/// bağlamında açılsaydı <c>TenantId=null</c> ile doğar ve firma kendi başvurusunu
/// hiç göremezdi; talep okuması kiracı bağlamına geçmeseydi kutu hep boş kalırdı.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantInterestFlow_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantInterestAppService _interestAppService;
    private readonly IGrantInterestHostAppService _hostAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _applicationRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantInterestFlow_Tests()
    {
        _interestAppService = GetRequiredService<IGrantInterestAppService>();
        _hostAppService = GetRequiredService<IGrantInterestHostAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _applicationRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Host kataloğunda açık bir çağrı.</summary>
    private async Task<GrantCall> CreateHostCallAsync(string name)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");

        var grant = new Grant(Guid.NewGuid(), name, "Kurum", maxAmount: 100_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    /// <summary>Host kutusu kiracıları <c>ITenantRepository</c>'den gezdiği için gerçek kiracı gerekir.</summary>
    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    [Fact]
    public async Task Host_sureci_baslatinca_basvuru_talebi_birakan_kiracida_dogar()
    {
        var call = await CreateHostCallAsync("Süreç Başlatma Programı");
        var tenantId = await CreateTenantAsync("İlgi Talebi A.Ş. " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "12 aylık Ar-Ge projesi" });
            interestId = interest.Id;

            // Talep tek başına başvuru DEĞİLDİR: bu aşamada ortada başvuru yoktur.
            (await _applicationRepository.GetListAsync()).ShouldNotContain(a => a.GrantCallId == call.Id);
        }

        var console = await _hostAppService.StartApplicationAsync(interestId);

        // Karara bağlanan talep bekleyenler listesinden düşer, sayaçta "başvuruya dönen" olur.
        console.Items.ShouldNotContain(i => i.Id == interestId);
        console.StartedCount.ShouldBeGreaterThanOrEqualTo(1);

        using (_currentTenant.Change(tenantId))
        {
            var application = (await _applicationRepository.GetListAsync())
                .SingleOrDefault(a => a.GrantCallId == call.Id);

            application.ShouldNotBeNull("başvuru talebi bırakan kiracıda açılmalı");
            application!.TenantId.ShouldBe(tenantId);

            var mine = await _interestAppService.GetMineAsync();
            var row = mine.Single(i => i.Id == interestId);
            row.Status.ShouldBe(GrantInterestStatus.BasvuruAcildi);
            row.GrantApplicationId.ShouldBe(application.Id);
        }
    }

    [Fact]
    public async Task Kiracinin_talebi_baska_kiraciya_sizmaz()
    {
        var call = await CreateHostCallAsync("Sızıntı Kontrolü Programı");
        var tenantA = await CreateTenantAsync("Talep Bırakan " + Guid.NewGuid().ToString("N")[..6]);
        var tenantB = await CreateTenantAsync("Diğer Firma " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantA))
        {
            interestId = (await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id })).Id;
        }

        using (_currentTenant.Change(tenantB))
        {
            (await _interestAppService.GetMineAsync()).ShouldNotContain(i => i.Id == interestId);
        }
    }

    [Fact]
    public async Task Ayni_cagriya_ikinci_kez_ilgi_bildirilemez()
    {
        var call = await CreateHostCallAsync("Mükerrer Talep Programı");
        var tenantId = await CreateTenantAsync("Israrcı Firma " + Guid.NewGuid().ToString("N")[..6]);

        using (_currentTenant.Change(tenantId))
        {
            await _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id });

            (await Should.ThrowAsync<BusinessException>(
                    () => _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id })))
                .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyOpen);
        }
    }

    [Fact]
    public async Task Uygun_bulunmayan_talepten_sonra_yeniden_ilgi_bildirilebilir()
    {
        var call = await CreateHostCallAsync("Yeniden Bildirim Programı");
        var tenantId = await CreateTenantAsync("Düzelen Firma " + Guid.NewGuid().ToString("N")[..6]);

        Guid firstId;
        using (_currentTenant.Change(tenantId))
        {
            firstId = (await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id })).Id;
        }

        await _hostAppService.RejectAsync(new RejectGrantInterestInput
        {
            InterestId = firstId,
            Reason = "Konsorsiyum ortağınız yok."
        });

        using (_currentTenant.Change(tenantId))
        {
            // Red kapıyı kapatmaz: YENİ kayıt açılır, eski gerekçe geçmişte kalır.
            var second = await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id });
            second.Id.ShouldNotBe(firstId);

            var mine = await _interestAppService.GetMineAsync();
            mine.Single(i => i.Id == firstId).HostFeedback.ShouldBe("Konsorsiyum ortağınız yok.");
            mine.Single(i => i.Id == second.Id).Status.ShouldBe(GrantInterestStatus.Yeni);
        }
    }
}
