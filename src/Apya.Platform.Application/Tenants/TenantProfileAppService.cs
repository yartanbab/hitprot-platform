using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using System.Linq.Dynamic.Core;
using Volo.Abp.Data;

namespace Apya.Platform.Tenants;

[Authorize(TenantManagementPermissions.Tenants.Default)]
public class TenantProfileAppService : PlatformAppService, ITenantProfileAppService
{
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantProfileManager _tenantProfileManager;
    private readonly IDataSeeder _dataSeeder;

    public TenantProfileAppService(
        ITenantRepository tenantRepository,
        ITenantManager tenantManager,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantProfileManager tenantProfileManager,
        IDataSeeder dataSeeder)
    {
        _tenantRepository = tenantRepository;
        _tenantManager = tenantManager;
        _tenantProfileRepository = tenantProfileRepository;
        _tenantProfileManager = tenantProfileManager;
        _dataSeeder = dataSeeder;
    }

    public async Task<PagedResultDto<TenantProfileDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        string sorting = input.Sorting;
        if (string.IsNullOrEmpty(sorting) || !sorting.StartsWith("name", StringComparison.OrdinalIgnoreCase))
        {
            sorting = "Name asc";
        }

        var tenants = await _tenantRepository.GetListAsync(sorting: sorting, maxResultCount: input.MaxResultCount, skipCount: input.SkipCount);
        var totalCount = await _tenantRepository.GetCountAsync();

        var tenantIds = tenants.Select(t => t.Id).ToList();
        var profiles = await _tenantProfileRepository.GetListAsync(p => tenantIds.Contains(p.TenantId));

        var dtos = new List<TenantProfileDto>();
        foreach (var tenant in tenants)
        {
            var profile = profiles.FirstOrDefault(p => p.TenantId == tenant.Id);
            dtos.Add(new TenantProfileDto
            {
                Id = profile?.Id ?? Guid.Empty,
                TenantId = tenant.Id,
                TenantName = tenant.Name,
                CompanyType = profile?.CompanyType ?? CompanyType.Company,
                TaxNumber = profile?.TaxNumber,
                Address = profile?.Address,
                LegalRepresentativeName = profile?.LegalRepresentativeName,
                LegalRepresentativePhone = profile?.LegalRepresentativePhone,
                OperationalContactName = profile?.OperationalContactName,
                OperationalContactPhone = profile?.OperationalContactPhone,
                IsActive = true
            });
        }

        return new PagedResultDto<TenantProfileDto>(totalCount, dtos);
    }

    [Authorize(TenantManagementPermissions.Tenants.Create)]
    [UnitOfWork]
    public async Task<TenantProfileDto> CreateTenantWithProfileAsync(CreateTenantExtendedDto input)
    {
        var tenant = await _tenantManager.CreateAsync(input.Name);
        await _tenantRepository.InsertAsync(tenant);
        
        using (CurrentTenant.Change(tenant.Id, tenant.Name))
        {
            await _dataSeeder.SeedAsync(new DataSeedContext(tenant.Id).WithProperty("AdminEmail", input.AdminEmailAddress).WithProperty("AdminPassword", input.AdminPassword));
        }

        var profile = await _tenantProfileManager.CreateProfileAsync(
            tenant.Id,
            input.CompanyType,
            input.TaxNumber,
            input.CorporateEmail
        );

        profile.TaxOffice = input.TaxOffice ?? string.Empty;
        profile.Address = input.Address ?? string.Empty;
        profile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
        profile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
        profile.OperationalContactName = input.OperationalContactName ?? string.Empty;
        profile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

        await _tenantProfileRepository.InsertAsync(profile);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }

    public async Task<TenantProfileDto> GetProfileAsync(Guid tenantId)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            var defaultTenant = await _tenantRepository.FindAsync(tenantId);
            return new TenantProfileDto
            {
                TenantId = tenantId,
                TenantName = defaultTenant?.Name ?? "",
                CompanyType = CompanyType.Company
            };
        }

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }

    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> UpdateProfileAsync(Guid tenantId, UpdateTenantProfileDto input)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            var newProfile = await _tenantProfileManager.CreateProfileAsync(
                tenantId,
                input.CompanyType,
                input.TaxNumber ?? string.Empty,
                input.CorporateEmail ?? string.Empty
            );

            newProfile.TaxOffice = input.TaxOffice ?? string.Empty;
            newProfile.Address = input.Address ?? string.Empty;
            newProfile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
            newProfile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
            newProfile.OperationalContactName = input.OperationalContactName ?? string.Empty;
            newProfile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

            await _tenantProfileRepository.InsertAsync(newProfile);

            return ObjectMapper.Map<TenantProfile, TenantProfileDto>(newProfile);
        }

        await _tenantProfileManager.CheckTaxNumberUniqueAsync(input.TaxNumber, profile.Id);

        profile.CompanyType = input.CompanyType;
        profile.TaxNumber = input.TaxNumber ?? string.Empty;
        profile.TaxOffice = input.TaxOffice ?? string.Empty;
        profile.Address = input.Address ?? string.Empty;
        profile.CorporateEmail = input.CorporateEmail ?? string.Empty;
        profile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
        profile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
        profile.OperationalContactName = input.OperationalContactName ?? string.Empty;
        profile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

        await _tenantProfileRepository.UpdateAsync(profile);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }
}
