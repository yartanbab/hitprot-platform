using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kurum profilinin tek yazma yolu.
///
/// <para><b>Neden AppService DEĞİL:</b> iki kapıdan çağrılır — host'un müşteri düzenleme
/// modalı (<see cref="TenantProfileAppService"/>, izin: Tenants.Update) ve kurumun kendi profil
/// ekranı (<see cref="MyCompanyProfileAppService"/>, izin: TenantSettings). Yetki kapıda kalır,
/// alan eşlemesi ve vergi numarası tekilliği burada TEK yerde durur: iki kopya olsaydı yeni
/// bir alan birinde unutulur ve o ekrandan kaydetmek alanı sessizce boşaltırdı.</para>
///
/// <para>🔴 Profil host kaydıdır (<c>IMultiTenant</c> DEĞİL); kiracı bağlamından çağıran
/// <c>CurrentTenant.Change(null)</c> içinde çağırmalı.</para>
/// </summary>
public class TenantProfileUpdater : ITransientDependency
{
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantProfileManager _tenantProfileManager;

    public TenantProfileUpdater(
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantProfileManager tenantProfileManager)
    {
        _tenantProfileRepository = tenantProfileRepository;
        _tenantProfileManager = tenantProfileManager;
    }

    /// <summary>Profili günceller; yoksa oluşturur (profil kaydı olmadan kurulmuş eski kiracılar).</summary>
    public async Task<TenantProfile> UpdateAsync(Guid tenantId, UpdateTenantProfileDto input)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            var newProfile = await _tenantProfileManager.CreateProfileAsync(
                tenantId,
                input.CompanyType,
                input.TaxNumber ?? string.Empty,
                input.CorporateEmail ?? string.Empty);

            Apply(newProfile, input);

            return await _tenantProfileRepository.InsertAsync(newProfile);
        }

        await _tenantProfileManager.CheckTaxNumberUniqueAsync(input.TaxNumber, profile.Id);

        Apply(profile, input);

        return await _tenantProfileRepository.UpdateAsync(profile);
    }

    /// <summary>
    /// Formdan boş gelen metin <c>null</c> bağlanır; kolonlar NOT NULL olduğu için boş dizeye
    /// çevrilir.
    /// </summary>
    private static void Apply(TenantProfile profile, UpdateTenantProfileDto input)
    {
        profile.CompanyType = input.CompanyType;
        profile.LegalName = input.LegalName ?? string.Empty;
        profile.TaxNumber = input.TaxNumber ?? string.Empty;
        profile.TaxOffice = input.TaxOffice ?? string.Empty;
        profile.Address = input.Address ?? string.Empty;
        profile.CorporateEmail = input.CorporateEmail ?? string.Empty;
        profile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
        profile.LegalRepresentativeTitle = input.LegalRepresentativeTitle ?? string.Empty;
        profile.LegalRepresentativeEmail = input.LegalRepresentativeEmail ?? string.Empty;
        profile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
        profile.OperationalContactName = input.OperationalContactName ?? string.Empty;
        profile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;
        profile.EmployeeCount = input.EmployeeCount;
    }
}
