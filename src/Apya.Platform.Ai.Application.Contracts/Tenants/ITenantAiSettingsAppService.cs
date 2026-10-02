using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Tenants;

public interface ITenantAiSettingsAppService : IApplicationService
{
    Task<TenantAiSettingsDto> GetAsync(Guid? tenantId);

    /// <summary>
    /// Seçilebilir (çalıştırılabilir) sağlayıcı adları, kayıt sırasıyla. <see cref="UpdateAsync"/> yalnız
    /// bunlardan birini kabul eder.
    /// </summary>
    Task<List<string>> GetProviderNamesAsync();

    Task<TenantAiSettingsDto> UpdateAsync(Guid? tenantId, UpdateTenantAiSettingsDto input);

    Task ResetQuotaAsync(Guid? tenantId);
}
