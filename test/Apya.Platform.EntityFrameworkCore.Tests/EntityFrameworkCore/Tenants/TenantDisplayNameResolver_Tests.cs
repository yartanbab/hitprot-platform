using System;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// Kurumun gösterilen adı: resmî unvan; boşsa kiracı adı. Bildirimde ve yazdırılan
/// başlıkta "hudayim-dernegi" gibi kısa anahtar görünmesin.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TenantDisplayNameResolver_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly TenantDisplayNameResolver _resolver;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;

    public TenantDisplayNameResolver_Tests()
    {
        _resolver = GetRequiredService<TenantDisplayNameResolver>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Resmi_unvan_varsa_o_yoksa_kiraci_adi_doner()
    {
        var withLegalName = await CreateTenantAsync("unvanli-" + Suffix(), "Unvanlı Kurum Derneği");
        var withoutLegalName = await CreateTenantAsync("unvansiz-" + Suffix(), legalName: string.Empty);
        var withoutProfile = await CreateTenantAsync("profilsiz-" + Suffix(), legalName: null);

        // Domain servisi kendi iş birimini açmaz; üretimde çağıran AppService'in UoW'undadır.
        await WithUnitOfWorkAsync(async () =>
        {
            (await _resolver.GetAsync(withLegalName.Id)).ShouldBe("Unvanlı Kurum Derneği");
            (await _resolver.GetAsync(withoutLegalName.Id)).ShouldBe(withoutLegalName.Name);
            (await _resolver.GetAsync(withoutProfile.Id)).ShouldBe(withoutProfile.Name);
            (await _resolver.GetAsync(Guid.NewGuid())).ShouldBeNull();

            var many = await _resolver.GetManyAsync(new[] { withLegalName.Id, withoutLegalName.Id, withoutProfile.Id, Guid.NewGuid() });

            many.Count.ShouldBe(3);
            many[withLegalName.Id].ShouldBe("Unvanlı Kurum Derneği");
            many[withoutLegalName.Id].ShouldBe(withoutLegalName.Name);
            many[withoutProfile.Id].ShouldBe(withoutProfile.Name);
        });
    }

    /// <summary>Kiracı bağlamından çağrılsa da host kayıtlarını okur (bildirim kiracı isteğinde üretilir).</summary>
    [Fact]
    public async Task Kiraci_baglamindan_da_unvani_okur()
    {
        var tenant = await CreateTenantAsync("baglam-" + Suffix(), "Bağlam Testi Vakfı");

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenant.Id))
            {
                (await _resolver.GetAsync(tenant.Id)).ShouldBe("Bağlam Testi Vakfı");
            }
        });
    }

    private async Task<Tenant> CreateTenantAsync(string name, string? legalName)
    {
        var tenant = await _tenantManager.CreateAsync(name);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);

        if (legalName != null)
        {
            var profile = new TenantProfile(Guid.NewGuid(), tenant.Id, CompanyType.Association, string.Empty, string.Empty)
            {
                LegalName = legalName
            };
            await _profileRepository.InsertAsync(profile, autoSave: true);
        }

        return tenant;
    }

    private static string Suffix() => Guid.NewGuid().ToString("N")[..8];
}
