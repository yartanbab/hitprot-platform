using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Eksik veri asistanının servis sözleşmesi: sayım HOST kataloğundaki açık çağrılardan yapılır,
/// başka kurumun satırı sayıma girmez ve bilgi girilince öneri listeden düşer.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmDataGaps_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.IdOf(26);

    private readonly IFirmDataAppService _service;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly ICurrentTenant _currentTenant;

    public FirmDataGaps_Tests()
    {
        _service = GetRequiredService<IFirmDataAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>%75 destekli (yani %25 eş finansman isteyen) açık bir çağrı kurar; sahibi geçerli bağlamdır.</summary>
    private Task CreateCofinancedOpenCallAsync()
        => WithUnitOfWorkAsync(async () =>
        {
            var grant = new Grant(Guid.NewGuid(), "Eş finansmanlı program", "Kurum", 100_000m, 0) { SupportRatePercent = 75 };
            await _grantRepository.InsertAsync(grant, autoSave: true);
            await _callRepository.InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);
        });

    private async Task<FirmDataGapDto?> CofinancingGapAsync()
        => (await _service.GetMyGapsAsync()).FirstOrDefault(g => g.Code == FirmParameterCatalog.CofinancingCapacityCode);

    [Fact]
    public async Task Es_finansman_isteyen_acik_cagri_kapasite_bilgisini_one_cikarir_girilince_dusurur()
    {
        var tenantId = Guid.NewGuid();
        int before;
        using (_currentTenant.Change(tenantId))
        {
            before = (await CofinancingGapAsync())!.UnlockCount;
        }

        await CreateCofinancedOpenCallAsync(); // host kataloğuna

        using (_currentTenant.Change(tenantId))
        {
            var gap = await CofinancingGapAsync();
            gap.ShouldNotBeNull();
            gap.UnlockCount.ShouldBe(before + 1);
            gap.Url.ShouldBe("/CompanyProfile/Data#firm-data-cofinancing_capacity");
            gap.Description.ShouldNotBeNullOrWhiteSpace();

            await _service.SaveMineAsync(new SaveFirmDataDto
            {
                Items = { new SaveFirmDataItemDto { DefinitionId = Cofinancing, RawValue = "0" } }
            });

            (await CofinancingGapAsync()).ShouldBeNull("sıfır da olsa bilgi girildi; artık eksik değil");
        }
    }

    [Fact]
    public async Task Baska_kurumun_cagrisi_sayima_girmez()
    {
        var tenantId = Guid.NewGuid();
        int before;
        using (_currentTenant.Change(tenantId))
        {
            before = (await CofinancingGapAsync())!.UnlockCount;
        }

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await CreateCofinancedOpenCallAsync(); // başka kuruma ait satır
        }

        using (_currentTenant.Change(tenantId))
        {
            (await CofinancingGapAsync())!.UnlockCount.ShouldBe(before, "kiracı süzgeci kapalı okunurken yalnız host satırları sayılır");
        }
    }

    [Fact]
    public async Task Hibe_profilindeki_eksik_bilgi_profil_duzenleyicisine_yonlendirir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var gaps = await _service.GetMyGapsAsync();

            gaps.Single(g => g.Code == "regions").Url.ShouldBe("/Grants#profil");
            gaps.Select(g => g.UnlockCount).ShouldBe(gaps.Select(g => g.UnlockCount).OrderByDescending(c => c));
        }
    }
}
