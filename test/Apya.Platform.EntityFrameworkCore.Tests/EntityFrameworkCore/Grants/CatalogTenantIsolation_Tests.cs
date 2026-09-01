using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// KİLİT SÖZLEŞME: hibe kataloğu HOST verisidir. Kiracı yalnız <c>TenantId=null</c> çağrıları
/// görür ve yalnız onlara başvurabilir.
///
/// <para>
/// Regresyon kaynağı: katalog okumaları host satırlarına erişebilmek için
/// <c>IDataFilter&lt;IMultiTenant&gt;.Disable()</c> kullanıyor. Filtre kapalıyken sorguya
/// <c>TenantId == null</c> koşulu ELLE konmazsa kapsam host'a değil TÜM KİRACILARA açılır —
/// kiracı A, kiracı B'nin çağrılarını kendi ekranında görür.
/// </para>
///
/// <para>
/// Kiracıya ait çağrı satırları teoride olmamalı (yazma izinleri host-only), ama yerel
/// veritabanında 30 kiracının her birinde demo çağrılar duruyor; uyum eşiği kaldırılınca
/// (#292) bunlar kiracı ekranında görünür hale gelmişti.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CatalogTenantIsolation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("11110000-aaaa-4000-8000-000000000001");
    private static readonly Guid TenantB = Guid.Parse("22220000-bbbb-4000-8000-000000000002");

    private readonly IGrantRecommendationAppService _recommendationAppService;
    private readonly IGrantApplicationAppService _applicationAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly ICurrentTenant _currentTenant;

    public CatalogTenantIsolation_Tests()
    {
        _recommendationAppService = GetRequiredService<IGrantRecommendationAppService>();
        _applicationAppService = GetRequiredService<IGrantApplicationAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Kiracı B'ye ait, eşiği 0 olan (yani her firmaya uyan) açık bir çağrı kurar.</summary>
    private async Task<GrantCall> CreateTenantOwnedOpenCallAsync(Guid ownerTenantId, string name)
    {
        using (_currentTenant.Change(ownerTenantId))
        {
            var grant = new Grant(Guid.NewGuid(), name, "Kiracı Kurumu", maxAmount: 50_000m, minMatchScore: 0);
            await _grantRepository.InsertAsync(grant, autoSave: true);

            var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
            await _callRepository.InsertAsync(call, autoSave: true);

            call.TenantId.ShouldBe(ownerTenantId, "test ön koşulu: çağrı kiracıya ait olmalı");
            return call;
        }
    }

    [Fact]
    public async Task Kiraci_baska_kiracinin_acik_cagrisini_gormez()
    {
        var foreignCall = await CreateTenantOwnedOpenCallAsync(TenantB, "B Kiracısının Programı");

        using (_currentTenant.Change(TenantA))
        {
            var feed = await _recommendationAppService.GetOpenCallsAsync();

            feed.ShouldNotContain(x => x.GrantCallId == foreignCall.Id,
                "katalog host verisidir; başka kiracının çağrısı listeye giremez");
        }
    }

    [Fact]
    public async Task Kiraci_kendi_actigi_cagriyi_da_katalogda_gormez()
    {
        // Kendi satırı da katalog değildir: liste yalnız host'un yayınladığını gösterir.
        var ownCall = await CreateTenantOwnedOpenCallAsync(TenantA, "A Kiracısının Programı");

        using (_currentTenant.Change(TenantA))
        {
            var feed = await _recommendationAppService.GetOpenCallsAsync();

            feed.ShouldNotContain(x => x.GrantCallId == ownCall.Id);
        }
    }

    [Fact]
    public async Task Baska_kiracinin_cagrisina_basvurulamaz()
    {
        var foreignCall = await CreateTenantOwnedOpenCallAsync(TenantB, "B Kiracısının Başvuru Programı");

        using (_currentTenant.Change(TenantA))
        {
            await Should.ThrowAsync<EntityNotFoundException>(
                () => _applicationAppService.ApplyAsync(foreignCall.Id));
        }
    }

    [Fact]
    public async Task Host_cagrisina_basvurulabilir()
    {
        // Karşı kontrol: daraltma host kataloğunu bozmamalı.
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında kurulmalı");

        var grant = new Grant(Guid.NewGuid(), "Host Katalog Programı", "Kurum", maxAmount: 10_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);

        using (_currentTenant.Change(TenantA))
        {
            var feed = await _recommendationAppService.GetOpenCallsAsync();
            feed.ShouldContain(x => x.GrantCallId == call.Id);

            var application = await _applicationAppService.ApplyAsync(call.Id);
            application.GrantCallId.ShouldBe(call.Id);
        }
    }
}
