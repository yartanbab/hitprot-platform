using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;

namespace Apya.Platform.Grants;

/// <summary>Mevcut tenant'ın (firma) eşleştirme profili — tekil, upsert.</summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class FirmProfileAppService : ApplicationService, IFirmProfileAppService
{
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _tagRepo;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepo;
    private readonly FirmProfileCompletenessReader _completeness;

    public FirmProfileAppService(
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<FirmProfileTag, Guid> tagRepo,
        IRepository<TenantProfile, Guid> tenantProfileRepo,
        FirmProfileCompletenessReader completeness)
    {
        _profileRepo = profileRepo;
        _tagRepo = tagRepo;
        _tenantProfileRepo = tenantProfileRepo;
        _completeness = completeness;
    }

    public async Task<FirmProfileDto> GetMyProfileAsync()
    {
        var profile = await _profileRepo.FirstOrDefaultAsync();
        if (profile == null)
        {
            return await SuggestFromTenantProfileAsync();
        }
        var tags = await _tagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
        return await WithCompletenessAsync(Map(profile, tags
            .Select(t => new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value })
            .ToList()), profile);
    }

    public async Task<FirmProfileDto> UpdateMyProfileAsync(UpdateFirmProfileDto input)
    {
        await GrantWritePermission.CheckAsync(AuthorizationService, CurrentTenant);
        ProvinceTagGuard.EnsureKnown(input.Tags.Select(t => (t.Kind, t.Value)));
        var profile = await _profileRepo.FirstOrDefaultAsync();
        if (profile == null)
        {
            profile = new FirmProfile(GuidGenerator.Create(), CurrentTenant.Id);
            Apply(profile, input);
            await _profileRepo.InsertAsync(profile, autoSave: true);
        }
        else
        {
            Apply(profile, input);
            await _profileRepo.UpdateAsync(profile, autoSave: true);
        }

        var existing = await _tagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
        await _tagRepo.DeleteManyAsync(existing);

        var saved = new List<GrantCriteriaTagDto>();
        var allowedKinds = AllowedTagKinds(input.Type);
        foreach (var t in input.Tags.Where(x => !string.IsNullOrWhiteSpace(x.Value) && allowedKinds.Contains(x.Kind)))
        {
            var tag = await _tagRepo.InsertAsync(new FirmProfileTag(GuidGenerator.Create(), profile.Id, t.Kind, t.Value));
            saved.Add(new GrantCriteriaTagDto { Kind = tag.Kind, Value = tag.Value }); // il adı resmi yazımıyla döner
        }

        // Dönüş, kaydedilen girdiden kurulur — aynı UoW içinde henüz flush edilmemiş
        // tag'leri GetMyProfileAsync yeniden okuyamayacağı için (boş dönerdi).
        return await WithCompletenessAsync(Map(profile, saved), profile);
    }

    /// <summary>
    /// Hiç kaydedilmemiş profil, hesap açılışında kayıt talebinden taşınan kurum profilinden
    /// ÖNERİLİR — kurum aynı bilgiyi ikinci kez yazmasın. Öneri KAYDEDİLMEZ: ölçek uygunluk
    /// şartına girer ve bant eşlemesi sınırlarda yaklaşıktır; kurum görüp kaydedince geçerli
    /// olur. Doluluk yüzdesi bu yüzden öneri uygulanmadan hesaplanır.
    /// </summary>
    private async Task<FirmProfileDto> SuggestFromTenantProfileAsync()
    {
        var tenantId = CurrentTenant.Id;
        TenantProfile? tenantProfile = null;
        if (tenantId != null)
        {
            // Kurum profili host kaydıdır (IMultiTenant DEĞİL); eşleştirme ELLE.
            using (CurrentTenant.Change(null))
            {
                tenantProfile = await _tenantProfileRepo.FirstOrDefaultAsync(p => p.TenantId == tenantId);
            }
        }

        var type = tenantProfile == null ? OrganizationType.Sirket : tenantProfile.CompanyType.ToOrganizationType();
        var dto = await WithCompletenessAsync(new FirmProfileDto { Type = type }, null);
        if (tenantProfile == null)
        {
            return dto;
        }

        dto.IsSuggested = true;

        if (type.IsNgo())
        {
            // Talepteki tek kutu "vergi / kütük numarası": 10 haneli sayı VKN'dir, gerisi
            // (DERBİS "06-123-045", vakıf sicil) kütük numarasıdır.
            var number = tenantProfile.TaxNumber.Trim();
            if (number.Length == 10 && number.All(char.IsAsciiDigit))
            {
                dto.TaxNumber = number;
            }
            else if (number.Length > 0)
            {
                dto.RegistryNumber = number;
            }

            dto.TaxOffice = tenantProfile.TaxOffice.IsNullOrWhiteSpace() ? null : tenantProfile.TaxOffice;
            // Ücretli ekip bandı (1-3/4-10/11-25/25+) talepteki çalışan aralığıyla örtüşmez — önerilmez.
        }
        else
        {
            dto.Size = ToCompanySize(tenantProfile.EmployeeCount);
        }

        return dto;
    }

    /// <summary>
    /// KOBİ ölçeği: Mikro &lt;10, Küçük &lt;50, Orta &lt;250 çalışan. Talep aralıkları sınırda
    /// yaklaşıktır (10 kişi Küçük, 50 kişi Orta sayılır) — öneri olmasının sebebi bu.
    /// "200+" hem Orta (200-249) hem Büyük olabilir; tahmin edilmez.
    /// </summary>
    private static CompanySize? ToCompanySize(RegistrationRequestCompanySize? employees) => employees switch
    {
        RegistrationRequestCompanySize.UpTo10 => CompanySize.Mikro,
        RegistrationRequestCompanySize.From11To50 => CompanySize.Kucuk,
        RegistrationRequestCompanySize.From51To200 => CompanySize.Orta,
        _ => null
    };

    /// <summary>
    /// Kurum türüne göre anlamlı etiket türleri. Karşı türün etiketleri kayıtta ELENİR:
    /// STK'ya geçen bir profilde eski NACE kodu kalsaydı program hâlâ o kodla eşleşirdi.
    /// Bölge ve anahtar kelime her iki türde de ortaktır.
    /// </summary>
    private static HashSet<GrantCriteriaKind> AllowedTagKinds(OrganizationType type) => type.IsNgo()
        ? new HashSet<GrantCriteriaKind>
        {
            GrantCriteriaKind.TematikAlan,
            GrantCriteriaKind.Bolge,
            GrantCriteriaKind.AnahtarKelime
        }
        : new HashSet<GrantCriteriaKind>
        {
            GrantCriteriaKind.NaceKodu,
            GrantCriteriaKind.Sektor,
            GrantCriteriaKind.Bolge,
            GrantCriteriaKind.AnahtarKelime
        };

    /// <summary>
    /// Form yalnız seçili türün alanlarını gönderir; karşı grubun alanları burada
    /// AÇIKÇA null'lanır. Aksi halde şirketten STK'ya geçen profil eski TRL/ciro
    /// beyanını taşımayı sürdürür ve eşleştirme olmayan bir veriyle ölçüm yapardı.
    /// </summary>
    private static void Apply(FirmProfile profile, UpdateFirmProfileDto input)
    {
        profile.Type = input.Type;
        profile.FoundedOn = input.FoundedOn;
        // Proje deneyimi iki türde de ortak: tür değişince korunur.
        profile.ProjectExperience = input.ProjectExperience;

        if (input.Type.IsNgo())
        {
            profile.Size = null;
            profile.StaffCount = null;
            profile.RdStaffCount = null;
            profile.AnnualRevenue = null;
            profile.Trl = null;
            profile.HasConsortiumPartner = null;

            profile.RegistryNumber = input.RegistryNumber?.Trim();
            profile.TaxNumber = input.TaxNumber?.Trim();
            profile.TaxOffice = input.TaxOffice?.Trim();
            profile.ProfessionalStaffBand = input.ProfessionalStaffBand;
        }
        else
        {
            profile.Size = input.Size;
            profile.StaffCount = input.StaffCount;
            profile.RdStaffCount = input.RdStaffCount;
            profile.AnnualRevenue = input.AnnualRevenue;
            profile.Trl = input.Trl;
            profile.HasConsortiumPartner = input.HasConsortiumPartner;

            profile.RegistryNumber = null;
            profile.TaxNumber = null;
            profile.TaxOffice = null;
            profile.ProfessionalStaffBand = null;
        }
    }

    private static FirmProfileDto Map(FirmProfile p, List<GrantCriteriaTagDto> tags) => new()
    {
        Type = p.Type,
        Size = p.Size,
        FoundedOn = p.FoundedOn,
        StaffCount = p.StaffCount,
        RdStaffCount = p.RdStaffCount,
        AnnualRevenue = p.AnnualRevenue,
        Trl = p.Trl,
        HasConsortiumPartner = p.HasConsortiumPartner,
        RegistryNumber = p.RegistryNumber,
        TaxNumber = p.TaxNumber,
        TaxOffice = p.TaxOffice,
        ProfessionalStaffBand = p.ProfessionalStaffBand,
        ProjectExperience = p.ProjectExperience,
        Tags = tags
    };

    /// <summary>
    /// Doluluk kataloğa göre sayılır (kullanıcı kararı 2026-11-17): yalnız açık çağrıların gerçekten
    /// ölçtüğü profil bilgileri — 1d'deki "N alan eksik" ile "Hangi bilgiyi girmeliyim?" paneli
    /// aynı kaynaktan gelir. Hiçbir programın istemediği bilgi yüzdeyi düşürmez. Bedeli: katalog
    /// değişince yüzde kurum bir şey yapmadan oynayabilir. Kimlik verileri (kütük no, VKN, vergi
    /// dairesi) eşleştirmeye girmediği için yüzdeye de girmez.
    /// </summary>
    private async Task<FirmProfileDto> WithCompletenessAsync(FirmProfileDto dto, FirmProfile? profile)
    {
        var completeness = await _completeness.CalculateAsync(profile, dto.Tags.Select(t => t.Kind), dto.Type);
        dto.MissingFieldCount = completeness.MissingCount;
        dto.CompletionPercent = completeness.Percent;
        return dto;
    }
}
