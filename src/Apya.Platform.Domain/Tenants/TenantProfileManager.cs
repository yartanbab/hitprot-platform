using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Tenants;

public class TenantProfileManager : DomainService
{
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;

    public TenantProfileManager(IRepository<TenantProfile, Guid> tenantProfileRepository)
    {
        _tenantProfileRepository = tenantProfileRepository;
    }

    /// <summary>
    /// Creates a new TenantProfile with the necessary business rule checks.
    /// </summary>
    public async Task<TenantProfile> CreateProfileAsync(
        Guid tenantId,
        CompanyType companyType,
        string taxNumber,
        string corporateEmail)
    {
        await CheckTaxNumberUniqueAsync(taxNumber);

        return new TenantProfile(
            GuidGenerator.Create(),
            tenantId,
            companyType,
            taxNumber,
            corporateEmail
        );
    }

    /// <summary>
    /// Checks if the given tax number is unique across all tenant profiles.
    /// </summary>
    public async Task CheckTaxNumberUniqueAsync(string taxNumber, Guid? excludeProfileId = null)
    {
        if (string.IsNullOrWhiteSpace(taxNumber))
        {
            return; // Or throw BusinessException depending on requirements
        }

        var existingProfile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TaxNumber == taxNumber);
        
        if (existingProfile != null && existingProfile.Id != excludeProfileId)
        {
            throw new Volo.Abp.BusinessException("Platform:Error:TaxNumberAlreadyExists")
                .WithData("TaxNumber", taxNumber);
        }
    }
}
