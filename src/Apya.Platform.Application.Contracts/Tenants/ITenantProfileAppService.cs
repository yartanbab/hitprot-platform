using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

public interface ITenantProfileAppService : IApplicationService
{
    Task<PagedResultDto<TenantProfileDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    
    Task<TenantProfileDto> CreateTenantWithProfileAsync(CreateTenantExtendedDto input);

    Task<TenantProfileDto> GetProfileAsync(Guid tenantId);

    Task<TenantProfileDto> UpdateProfileAsync(Guid tenantId, UpdateTenantProfileDto input);
}
