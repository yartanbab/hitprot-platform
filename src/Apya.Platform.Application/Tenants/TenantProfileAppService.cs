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
                OperationalContactName = profile?.OperationalContactName,
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

        profile.TaxOffice = input.TaxOffice;
        profile.Address = input.Address;
        profile.LegalRepresentativeName = input.LegalRepresentativeName;
        profile.OperationalContactName = input.OperationalContactName;

        await _tenantProfileRepository.InsertAsync(profile);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }

    public async Task<TenantProfileDto> GetProfileAsync(Guid tenantId)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            throw new UserFriendlyException(L["ProfileNotFound", tenantId]);
        }

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }

    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> UpdateProfileAsync(Guid tenantId, UpdateTenantProfileDto input)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            throw new UserFriendlyException(L["ProfileNotFound", tenantId]);
        }

        await _tenantProfileManager.CheckTaxNumberUniqueAsync(input.TaxNumber, profile.Id);

        profile.CompanyType = input.CompanyType;
        profile.TaxNumber = input.TaxNumber;
        profile.TaxOffice = input.TaxOffice;
        profile.Address = input.Address;
        profile.CorporateEmail = input.CorporateEmail;
        profile.LegalRepresentativeName = input.LegalRepresentativeName;
        profile.OperationalContactName = input.OperationalContactName;
        profile.OperationalContactPhone = input.OperationalContactPhone;

        await _tenantProfileRepository.UpdateAsync(profile);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }
}
