using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

public interface ITenantProfileAppService : IApplicationService
{
    /// <summary>
    /// Hem AbpTenant hem de TenantProfile tablosuna tek seferde (Transactional) yazarak Müşteri oluşturur.
    /// </summary>
    Task<TenantProfileDto> CreateTenantWithProfileAsync(CreateTenantExtendedDto input);

    /// <summary>
    /// İlgili Müşterinin profil detayını getirir.
    /// </summary>
    Task<TenantProfileDto> GetProfileAsync(Guid tenantId);

    /// <summary>
    /// Müşteri profilini günceller.
    /// </summary>
    Task<TenantProfileDto> UpdateProfileAsync(Guid tenantId, UpdateTenantProfileDto input);
}
