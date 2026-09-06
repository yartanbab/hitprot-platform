using System;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// SÖZLEŞME: paket bedeli host ayarında tanımlanır ve onayda bedel boş bırakılırsa
/// kendiliğinden kullanılır — ama tanımlı bedel yoksa sistem RAKAM UYDURMAZ.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class SalesPlanPricing_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IPackageAppService _packages;
    private readonly IRegistrationRequestAppService _requests;
    private readonly IRepository<RegistrationRequest, Guid> _requestRepository;

    public SalesPlanPricing_Tests()
    {
        _packages = GetRequiredService<IPackageAppService>();
        _requests = GetRequiredService<IRegistrationRequestAppService>();
        _requestRepository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();
    }

    private async Task SetPricesAsync(decimal standard, decimal corporate, decimal joint)
    {
        var settings = await _packages.GetSubscriptionSettingsAsync();

        settings.StandardPlanPrice = standard;
        settings.CorporatePlanPrice = corporate;
        settings.JointPlanPrice = joint;

        await _packages.UpdateSubscriptionSettingsAsync(settings);
    }

    private Task<Guid> CreateRequestAsync(SalesPlan plan)
        => _requests.CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = plan,
            CompanyName = $"Bedel Testi {Guid.NewGuid():N}",
            CompanyType = CompanyType.Association,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
            Address = "Adres",
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Başkan",
            Email = $"bedel-{Guid.NewGuid():N}@ornek.com",
            Phone = "05551112233"
        });

    /// <summary>
    /// Bedel kesirli yazılıp kesirli okunmalı. Ayar INVARIANT kültürle saklanmazsa
    /// "12000.50" tr-TR ile ayrıştırılır, nokta binlik sayılır ve bedel BİN KAT sapar.
    /// </summary>
    [Fact]
    public async Task Bedel_kesirli_haliyle_geri_okunur()
    {
        await SetPricesAsync(12_000.50m, 24_000m, 36_000m);

        var settings = await _packages.GetSubscriptionSettingsAsync();

        settings.StandardPlanPrice.ShouldBe(12_000.50m);
        settings.CorporatePlanPrice.ShouldBe(24_000m);
        settings.JointPlanPrice.ShouldBe(36_000m);
    }

    /// <summary>Onayda bedel boş bırakılırsa paketin liste bedeli yazılır.</summary>
    [Fact]
    public async Task Onayda_bos_birakilan_bedel_liste_bedelinden_gelir()
    {
        await SetPricesAsync(12_000m, 24_000m, 36_000m);

        var id = await CreateRequestAsync(SalesPlan.Corporate);

        var updated = await _requests.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            OfferedAmount = null
        });

        updated.OfferedAmount.ShouldBe(24_000m);
    }

    /// <summary>Onayda paket değiştiyse ONAYLANAN paketin bedeli gelir.</summary>
    [Fact]
    public async Task Paket_degistiyse_yeni_paketin_bedeli_gelir()
    {
        await SetPricesAsync(12_000m, 24_000m, 36_000m);

        var id = await CreateRequestAsync(SalesPlan.Standard);

        var updated = await _requests.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            ApprovedPlan = SalesPlan.Joint,
            OfferedAmount = null
        });

        updated.OfferedAmount.ShouldBe(36_000m);
    }

    /// <summary>Host bir bedel yazdıysa liste bedeli onu EZMEZ — pazarlık kaybolmamalı.</summary>
    [Fact]
    public async Task Elle_girilen_bedel_liste_bedelini_ezer()
    {
        await SetPricesAsync(12_000m, 24_000m, 36_000m);

        var id = await CreateRequestAsync(SalesPlan.Corporate);

        var updated = await _requests.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            OfferedAmount = 19_500m
        });

        updated.OfferedAmount.ShouldBe(19_500m);
    }

    /// <summary>
    /// 🔑 Bedel tanımlı değilse sistem RAKAM UYDURMAZ. Alan boş kalır ve sözleşmede
    /// "Taraflarca ayrıca belirlenecektir" yazar.
    /// </summary>
    [Fact]
    public async Task Bedel_tanimli_degilse_alan_bos_kalir()
    {
        await SetPricesAsync(0m, 0m, 0m);

        var id = await CreateRequestAsync(SalesPlan.Standard);

        var updated = await _requests.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            OfferedAmount = null
        });

        updated.OfferedAmount.ShouldBeNull();

        var stored = await _requestRepository.GetAsync(id);
        stored.OfferedAmount.ShouldBeNull();
    }

    /// <summary>Negatif bedel sıfırlanır (= tanımsız), veritabanına negatif geçmez.</summary>
    [Fact]
    public async Task Negatif_bedel_tanimsiza_dusurulur()
    {
        await SetPricesAsync(-100m, 0m, 0m);

        var settings = await _packages.GetSubscriptionSettingsAsync();

        settings.StandardPlanPrice.ShouldBe(0m);
    }
}
