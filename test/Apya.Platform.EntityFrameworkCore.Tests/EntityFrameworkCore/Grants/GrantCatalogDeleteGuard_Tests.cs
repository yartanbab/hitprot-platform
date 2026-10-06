using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Hibe kataloğunda silme koruması.
///
/// <para>Host bir çağrıyı silince üzerindeki başvurular yetim kalıyordu: firma kendi başvurusunun
/// ayrıntısını, evrakını ve uygulama ekranını açamıyor ("kayıt bulunamadı"), danışmanın
/// listesinde satır adsız görünüyordu. Program silme ise onay metninde "ve bütün çağrılarını"
/// dediği hâlde yalnız programı siliyor, çağrıları programsız bırakıyordu.</para>
///
/// <para>Kural, aşama şablonundaki emsalle aynı (<c>GrantStageTemplateInUse</c>): sessizce bağı
/// koparmak yerine reddet.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantCatalogDeleteGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantAppService _grantAppService;
    private readonly IGrantCallAppService _callAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantCatalogDeleteGuard_Tests()
    {
        _grantAppService = GetRequiredService<IGrantAppService>();
        _callAppService = GetRequiredService<IGrantCallAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Grant Grant, GrantCall First, GrantCall Second)> CreateHostProgramAsync()
    {
        _currentTenant.Id.ShouldBeNull();
        var grant = new Grant(
            Guid.NewGuid(), "Silme Koruması " + Guid.NewGuid().ToString("N")[..6], "Kurum", 1_000_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var first = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        var second = new GrantCall(Guid.NewGuid(), grant.Id, "2026/2", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(first, autoSave: true);
        await _callRepository.InsertAsync(second, autoSave: true);
        return (grant, first, second);
    }

    /// <summary>Başvuru kiracıda durur; çağrı ise host kataloğunda.</summary>
    private async Task ApplyFromNewTenantAsync(GrantCall call)
    {
        var tenant = await _tenantManager.CreateAsync("Başvuran " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            await _appRepository.InsertAsync(new GrantApplication(Guid.NewGuid(), tenant.Id, call.Id), autoSave: true);
        }
    }

    [Fact]
    public async Task Basvurusu_olan_cagri_silinemez()
    {
        var (_, call, _) = await CreateHostProgramAsync();
        await ApplyFromNewTenantAsync(call);
        await ApplyFromNewTenantAsync(call);

        var ex = await Should.ThrowAsync<BusinessException>(() => _callAppService.DeleteAsync(call.Id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantCallInUse);
        ex.Data["ApplicationCount"].ShouldBe(2);
        (await _callRepository.FindAsync(call.Id)).ShouldNotBeNull("reddedilen silme çağrıya dokunmamalı");
    }

    [Fact]
    public async Task Basvurusu_olmayan_cagri_silinir()
    {
        var (_, call, other) = await CreateHostProgramAsync();
        // Başvuru KOMŞU çağrıda: silinen çağrıyı engellememeli.
        await ApplyFromNewTenantAsync(other);

        await _callAppService.DeleteAsync(call.Id);

        (await _callRepository.FindAsync(call.Id)).ShouldBeNull();
        (await _callRepository.FindAsync(other.Id)).ShouldNotBeNull();
    }

    /// <summary>
    /// Onay metni "programını ve bütün çağrılarını silmek istiyor musunuz?" diyor; yalnız program
    /// siliniyor, çağrılar programsız kalıyordu.
    /// </summary>
    [Fact]
    public async Task Program_silinince_cagrilari_da_silinir()
    {
        var (grant, first, second) = await CreateHostProgramAsync();

        await _grantAppService.DeleteAsync(grant.Id);

        (await _grantRepository.FindAsync(grant.Id)).ShouldBeNull();
        (await _callRepository.FindAsync(first.Id)).ShouldBeNull("program gidince çağrısı programsız kalmamalı");
        (await _callRepository.FindAsync(second.Id)).ShouldBeNull("program gidince çağrısı programsız kalmamalı");
    }

    [Fact]
    public async Task Cagrisina_basvuru_yapilmis_program_silinemez()
    {
        var (grant, first, second) = await CreateHostProgramAsync();
        await ApplyFromNewTenantAsync(second);

        var ex = await Should.ThrowAsync<BusinessException>(() => _grantAppService.DeleteAsync(grant.Id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantProgramInUse);
        ex.Data["ApplicationCount"].ShouldBe(1);
        (await _grantRepository.FindAsync(grant.Id)).ShouldNotBeNull();
        // Hiçbiri: başvurusuz çağrı da yerinde kalır, yarım silme olmaz.
        (await _callRepository.FindAsync(first.Id)).ShouldNotBeNull();
        (await _callRepository.FindAsync(second.Id)).ShouldNotBeNull();
    }
}
