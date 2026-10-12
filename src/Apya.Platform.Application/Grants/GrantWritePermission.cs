using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Hibe YAZMA uçlarının ortak izin kapısı (ürün kararı, 2026-10-13).
///
/// <para>Bu servislerin sınıf izni <see cref="PlatformPermissions.Grants.Default"/> yalnız
/// GÖRÜNTÜLEME iznidir. Yazma uçları ona düşüyordu: hibeleri yalnız görsün diye yetkilendirilen
/// kişi host'ta kurum kararını yazabiliyor, itirazı sonuçlandırabiliyor, belgeyi onaylayabiliyor;
/// firmada ilgiyi geri çekebiliyor, profili değiştirebiliyor, başvuruyu kuruma gönderebiliyordu.</para>
///
/// <para>İki taraf iki ayrı izin kullanır, çünkü <see cref="PlatformPermissions.Grants.Edit"/>
/// host'a özeldir ve kiracıya atanamaz: host → <c>Grants.Edit</c>, firma →
/// <see cref="PlatformPermissions.Grants.ManageApplications"/>.</para>
/// </summary>
public static class GrantWritePermission
{
    public static string For(ICurrentTenant currentTenant)
        => currentTenant.Id == null
            ? PlatformPermissions.Grants.Edit
            : PlatformPermissions.Grants.ManageApplications;

    public static Task CheckAsync(IAuthorizationService authorizationService, ICurrentTenant currentTenant)
        => authorizationService.CheckAsync(For(currentTenant));

    public static Task<bool> IsGrantedAsync(IAuthorizationService authorizationService, ICurrentTenant currentTenant)
        => authorizationService.IsGrantedAsync(For(currentTenant));
}
