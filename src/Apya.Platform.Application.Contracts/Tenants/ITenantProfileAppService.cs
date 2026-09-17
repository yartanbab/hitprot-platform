using System;
using System.Collections.Generic;
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

    /// <summary>
    /// Müşteriye paket atar ve o paket için yeni bir abonelik dönemi başlatır. Yürürlükteki
    /// dönem kapanır (kalan süre YANAR) — kalan süreyi korumak için <see cref="RenewPackageAsync"/>.
    /// </summary>
    Task<TenantProfileDto> AssignPackageAsync(Guid tenantId, PackageCode packageCode, SubscriptionPeriod period);

    /// <summary>
    /// Yürürlükteki paketi bir dönem daha uzatır; paket değişmez ve kalan süre korunur
    /// (yeni dönem mevcut bitişin üstüne biner). Ödeme altyapısı da aynı kapıyı kullanır.
    /// </summary>
    Task<TenantProfileDto> RenewPackageAsync(Guid tenantId, SubscriptionPeriod period);

    /// <summary>
    /// Kiracının kullanıcıları — host'un şifre belirleyeceği kişiyi seçmesi için.
    /// </summary>
    Task<List<TenantUserDto>> GetTenantUsersAsync(Guid tenantId);

    /// <summary>
    /// Kiracı kullanıcısına ESKİ ŞİFRE SORULMADAN yeni şifre yazar.
    /// Müşteri şifresini unuttuğunda ve posta kanalı çalışmadığında tek kurtarma yolu budur.
    /// </summary>
    Task SetTenantUserPasswordAsync(Guid tenantId, Guid userId, string newPassword);
}
