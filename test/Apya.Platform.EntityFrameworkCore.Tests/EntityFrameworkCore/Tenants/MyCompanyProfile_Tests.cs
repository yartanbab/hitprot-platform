using System;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// "KURUM PROFİLİ" SÖZLEŞMESİ: kurum, kayıt talebinden taşınan kendi bilgisini görür ve
/// düzeltir; düzeltme paketine dokunmaz, başka kurumun vergi numarasını alamaz. Host'un
/// kurum profili yoktur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class MyCompanyProfile_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IMyCompanyProfileAppService _myCompanyProfileAppService;
    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly IRegistrationRequestAppService _requestAppService;
    private readonly IProtocolApprovalAppService _protocolAppService;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;

    public MyCompanyProfile_Tests()
    {
        _myCompanyProfileAppService = GetRequiredService<IMyCompanyProfileAppService>();
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _requestAppService = GetRequiredService<IRegistrationRequestAppService>();
        _protocolAppService = GetRequiredService<IProtocolApprovalAppService>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Host_baglaminda_kurum_profili_yoktur()
    {
        using (_currentTenant.Change(null))
        {
            var exception = await Should.ThrowAsync<BusinessException>(
                () => _myCompanyProfileAppService.GetAsync());

            exception.Code.ShouldBe("Platform:Error:CompanyProfileHostContext");
        }
    }

    /// <summary>
    /// Uçtan uca: protokolle açılan hesabın profili talepteki bilgilerle DOLU gelir ve
    /// hesabın özeti (sözleşme, kullanıcı) basılır — kurum hiçbir şeyi yeniden yazmaz.
    /// </summary>
    [Fact]
    public async Task Protokolle_acilan_hesabin_profili_talepteki_bilgilerle_gelir()
    {
        var requestId = await _requestAppService.CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = SalesPlan.Corporate,
            CompanyName = "Profil Testi Gençlik Derneği",
            CompanyType = CompanyType.Association,
            TaxNumber = UniqueTaxNumber(),
            TaxOffice = "Halkalı",
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul",
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Yönetim Kurulu Başkanı",
            Email = UniqueEmail(),
            Phone = "05551112233",
            CompanySize = RegistrationRequestCompanySize.UpTo10
        });
        await _requestAppService.UpdateAsync(requestId, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved
        });
        var invite = await _requestAppService.IssueInviteAsync(requestId);
        await _protocolAppService.ApproveAsync(new ApproveProtocolInput
        {
            Token = invite.Token,
            AcceptAgreement = true,
            AcceptKvkk = true,
            Password = "1q2w3E*asd",
            PasswordConfirm = "1q2w3E*asd"
        });

        var tenantId = (await _requestAppService.GetAsync(requestId)).TenantId!.Value;

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _myCompanyProfileAppService.GetAsync();

            dto.LegalName.ShouldBe("Profil Testi Gençlik Derneği");
            dto.TenantName.ShouldBe("profil-testi-genclik-dernegi");
            dto.CompanyType.ShouldBe(CompanyType.Association);
            dto.TaxOffice.ShouldBe("Halkalı");
            dto.EmployeeCount.ShouldBe(RegistrationRequestCompanySize.UpTo10);
            dto.LegalRepresentativeTitle.ShouldBe("Yönetim Kurulu Başkanı");
            dto.AgreementNumber.ShouldStartWith(ServiceAgreementConsts.NumberPrefix);
            dto.AgreementApprovedAt.ShouldNotBeNull();
            dto.SubscriptionEndDate.ShouldNotBeNull(); // Protokol Madde 8: 1 yıl
            dto.UserCount.ShouldBe(1);
            dto.PackageName.ShouldNotBeNullOrWhiteSpace();
        }
    }

    /// <summary>
    /// Kurum TÜM alanları düzeltebilir (kullanıcı kararı, 2026-09-14); paket bu yoldan
    /// DEĞİŞMEZ — form paket alanı taşımaz, taşısaydı kurum kendini üst pakete yazardı.
    /// </summary>
    [Fact]
    public async Task Kurum_bilgilerini_duzeltir_paketine_dokunmaz()
    {
        var tenantId = await CreateTenantAsync(PackageCode.Standard);
        var newTaxNumber = UniqueTaxNumber();

        using (_currentTenant.Change(tenantId))
        {
            await _myCompanyProfileAppService.UpdateAsync(new UpdateTenantProfileDto
            {
                LegalName = "Yeni Unvan A.Ş.",
                CompanyType = CompanyType.Company,
                TaxNumber = newTaxNumber,
                TaxOffice = "Kadıköy",
                EmployeeCount = RegistrationRequestCompanySize.From51To200,
                Address = "Yeni adres",
                CorporateEmail = "info@yeni.com",
                LegalRepresentativeName = "Mehmet Kaya",
                LegalRepresentativeTitle = "Genel Müdür",
                LegalRepresentativeEmail = "mehmet@yeni.com",
                LegalRepresentativePhone = "05320000000"
            });
        }

        var profile = await _profileRepository.GetAsync(p => p.TenantId == tenantId);

        profile.LegalName.ShouldBe("Yeni Unvan A.Ş.");
        profile.CompanyType.ShouldBe(CompanyType.Company);
        profile.TaxNumber.ShouldBe(newTaxNumber);
        profile.EmployeeCount.ShouldBe(RegistrationRequestCompanySize.From51To200);
        profile.LegalRepresentativeTitle.ShouldBe("Genel Müdür");
        profile.LegalRepresentativeEmail.ShouldBe("mehmet@yeni.com");
        // Formdan boş gelen alan null değil boş dize yazılır (kolon NOT NULL).
        profile.OperationalContactName.ShouldBe(string.Empty);
        profile.PackageCode.ShouldBe(PackageCode.Standard);
    }

    /// <summary>Vergi numarası kiracılar arasında tekil — kendi ekranından da aşılamaz.</summary>
    [Fact]
    public async Task Baska_kurumun_vergi_numarasi_alinamaz()
    {
        var takenTaxNumber = UniqueTaxNumber();
        await CreateTenantAsync(PackageCode.Basic, takenTaxNumber);
        var tenantId = await CreateTenantAsync(PackageCode.Basic);

        using (_currentTenant.Change(tenantId))
        {
            var exception = await Should.ThrowAsync<BusinessException>(
                () => _myCompanyProfileAppService.UpdateAsync(new UpdateTenantProfileDto
                {
                    CompanyType = CompanyType.Company,
                    TaxNumber = takenTaxNumber,
                    // [EmailAddress] boş dizeyi geçersiz sayar; formdan boş alan null gelir.
                    CorporateEmail = "info@ornek.com",
                    LegalRepresentativeEmail = "yetkili@ornek.com"
                }));

            exception.Code.ShouldBe("Platform:Error:TaxNumberAlreadyExists");
        }
    }

    // --- Yardımcılar ---

    /// <summary>Host'un "Yeni Müşteri" modalının yolu: kiracı + profil + yönetici.</summary>
    private async Task<Guid> CreateTenantAsync(PackageCode packageCode, string? taxNumber = null)
    {
        var email = UniqueEmail();
        var created = await _tenantProfileAppService.CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "profil-" + Guid.NewGuid().ToString("N"),
            AdminEmailAddress = email,
            AdminPassword = "1q2w3E*asd",
            PackageCode = packageCode,
            CompanyType = CompanyType.Association,
            TaxNumber = taxNumber ?? UniqueTaxNumber(),
            CorporateEmail = email,
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul"
        });

        return created.TenantId;
    }

    private static string UniqueTaxNumber()
        => Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString();

    private static string UniqueEmail()
        => "profil-" + Guid.NewGuid().ToString("N") + "@ornek.com";
}
