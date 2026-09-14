using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Hibe "Kurum profiliniz" hiç kaydedilmemişse kurum profilinden ÖNERİLİR: kurum kayıt
/// talebinde yazdığını ikinci kez yazmaz. Öneri kaydedilmez, kayıtlı profil ezilmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmProfileSuggestion_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFirmProfileAppService _firmProfileAppService;
    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly ICurrentTenant _currentTenant;

    public FirmProfileSuggestion_Tests()
    {
        _firmProfileAppService = GetRequiredService<IFirmProfileAppService>();
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Dernek_icin_tur_vergi_numarasi_ve_dairesi_onerilir_kaydedilmez()
    {
        var taxNumber = UniqueTaxNumber();
        var tenantId = await CreateTenantAsync(CompanyType.Association, taxNumber, RegistrationRequestCompanySize.From11To50);

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _firmProfileAppService.GetMyProfileAsync();

            dto.IsSuggested.ShouldBeTrue();
            dto.Type.ShouldBe(OrganizationType.Dernek);
            dto.TaxNumber.ShouldBe(taxNumber);
            dto.TaxOffice.ShouldBe("Halkalı");
            // Doluluk kayıtsız hâli sayar: öneri eşleştirmeye girmediği için %0.
            dto.CompletionPercent.ShouldBe(0);

            // Kaydedilmedi: ikinci okuma da öneri döner.
            (await _firmProfileAppService.GetMyProfileAsync()).IsSuggested.ShouldBeTrue();
        }
    }

    /// <summary>DERBİS biçimli numara VKN değildir — kütük numarası alanına önerilir.</summary>
    [Fact]
    public async Task Kutuk_bicimli_numara_kutuk_alanina_onerilir()
    {
        var registry = "34-" + Random.Shared.Next(100, 999) + "-" + Random.Shared.Next(100, 999);
        var tenantId = await CreateTenantAsync(CompanyType.Association, registry, null);

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _firmProfileAppService.GetMyProfileAsync();

            dto.RegistryNumber.ShouldBe(registry);
            dto.TaxNumber.ShouldBeNull();
        }
    }

    [Theory]
    [InlineData(RegistrationRequestCompanySize.UpTo10, CompanySize.Mikro)]
    [InlineData(RegistrationRequestCompanySize.From11To50, CompanySize.Kucuk)]
    [InlineData(RegistrationRequestCompanySize.From51To200, CompanySize.Orta)]
    [InlineData(RegistrationRequestCompanySize.Over200, null)] // Orta da Büyük de olabilir
    public async Task Sirket_icin_calisan_araligi_olcege_cevrilir(RegistrationRequestCompanySize employees, CompanySize? expected)
    {
        var tenantId = await CreateTenantAsync(CompanyType.Company, UniqueTaxNumber(), employees);

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _firmProfileAppService.GetMyProfileAsync();

            dto.Type.ShouldBe(OrganizationType.Sirket);
            dto.Size.ShouldBe(expected);
            // Şirkette vergi bilgisi hibe profilinde tutulmaz (kurum profilinde durur).
            dto.TaxNumber.ShouldBeNull();
        }
    }

    [Fact]
    public async Task Kayitli_profil_oneriyle_ezilmez()
    {
        var tenantId = await CreateTenantAsync(CompanyType.Association, UniqueTaxNumber(), null);

        using (_currentTenant.Change(tenantId))
        {
            await _firmProfileAppService.UpdateMyProfileAsync(new UpdateFirmProfileDto
            {
                Type = OrganizationType.Vakif,
                TaxOffice = "Kadıköy"
            });

            var dto = await _firmProfileAppService.GetMyProfileAsync();

            dto.IsSuggested.ShouldBeFalse();
            dto.Type.ShouldBe(OrganizationType.Vakif);
            dto.TaxOffice.ShouldBe("Kadıköy");
        }
    }

    private async Task<Guid> CreateTenantAsync(CompanyType type, string taxNumber, RegistrationRequestCompanySize? employees)
    {
        var email = "hibe-oneri-" + Guid.NewGuid().ToString("N") + "@ornek.org";
        var created = await _tenantProfileAppService.CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "hibe-oneri-" + Guid.NewGuid().ToString("N")[..12],
            AdminEmailAddress = email,
            AdminPassword = "1q2w3E*asd",
            CompanyType = type,
            TaxNumber = taxNumber,
            TaxOffice = "Halkalı",
            CorporateEmail = email,
            EmployeeCount = employees
        });

        return created.TenantId;
    }

    private static string UniqueTaxNumber()
        => Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString();
}
