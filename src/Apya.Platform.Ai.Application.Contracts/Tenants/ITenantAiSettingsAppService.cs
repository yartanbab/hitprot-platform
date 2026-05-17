using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Tenants;

public interface ITenantAiSettingsAppService : IApplicationService
{
    Task<TenantAiSettingsDto> GetAsync(Guid? tenantId);

    Task<TenantAiSettingsDto> UpdateAsync(Guid? tenantId, UpdateTenantAiSettingsDto input);

    Task ResetQuotaAsync(Guid? tenantId);
}
