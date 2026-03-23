using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;

namespace Apya.Platform.Tenants;

[Authorize(TenantManagementPermissions.Tenants.Default)]
public class TenantProfileAppService : ApplicationService, ITenantProfileAppService
{
    private readonly ITenantAppService _tenantAppService;
    private readonly TenantProfileManager _tenantProfileManager;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;

    public TenantProfileAppService(
        ITenantAppService tenantAppService,
        TenantProfileManager tenantProfileManager,
        IRepository<TenantProfile, Guid> tenantProfileRepository)
    {
        _tenantAppService = tenantAppService;
        _tenantProfileManager = tenantProfileManager;
        _tenantProfileRepository = tenantProfileRepository;
    }

    [UnitOfWork]
    [Authorize(TenantManagementPermissions.Tenants.Create)]
    public async Task<TenantProfileDto> CreateTenantWithProfileAsync(CreateTenantExtendedDto input)
    {
        // 1. Önce ABP altyapısında asıl Tenant'ı (ve host adminini) oluştur.
        var tenantCreateDto = new TenantCreateDto
        {
            Name = input.Name,
            AdminEmailAddress = input.AdminEmailAddress,
            AdminPassword = input.AdminPassword
        };
        
        var createdTenant = await _tenantAppService.CreateAsync(tenantCreateDto);

        // 2. Ardından bizim B2B / Kurumsal özellikleri taşıyan Profile katmanını oluştur.
        var newProfile = await _tenantProfileManager.CreateProfileAsync(
            tenantId: createdTenant.Id,
            companyType: input.CompanyType,
            taxNumber: input.TaxNumber,
            corporateEmail: input.CorporateEmail
        );
        newProfile.TaxOffice = input.TaxOffice;

        await _tenantProfileRepository.InsertAsync(newProfile);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(newProfile);
    }

    public async Task<TenantProfileDto> GetProfileAsync(Guid tenantId)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        if (profile == null)
        {
            return null!; // Veya Throw UserFriendlyException
        }

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }

    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> UpdateProfileAsync(Guid tenantId, UpdateTenantProfileDto input)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        if (profile == null)
        {
            // Eğer profile daha önce açılmamışsa, "Update" isteğiyle yeni oluşturabiliriz veya hata döneriz.
            profile = await _tenantProfileManager.CreateProfileAsync(
                tenantId: tenantId,
                companyType: input.CompanyType,
                taxNumber: input.TaxNumber,
                corporateEmail: input.CorporateEmail
            );
            await _tenantProfileRepository.InsertAsync(profile);
        }
        else
        {
            // Tax Number değiştiyse (Domain Service içinden uniqueness check)
            if (profile.TaxNumber != input.TaxNumber)
            {
                await _tenantProfileManager.CheckTaxNumberUniqueAsync(input.TaxNumber, profile.Id);
                profile.TaxNumber = input.TaxNumber;
            }

            profile.CompanyType = input.CompanyType;
            profile.TaxOffice = input.TaxOffice;
            profile.Address = input.Address;
            profile.CorporateEmail = input.CorporateEmail;
            profile.LegalRepresentativeName = input.LegalRepresentativeName;
            profile.OperationalContactName = input.OperationalContactName;
            profile.OperationalContactPhone = input.OperationalContactPhone;
            
            await _tenantProfileRepository.UpdateAsync(profile);
        }

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }
}
