using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// FIN-15 · Bütçe yazma kapısı: <see cref="PlatformPermissions.Projects.ManageBudget"/> YA DA
/// <see cref="PlatformPermissions.Projects.Edit"/>.
///
/// <para>Eskiden bütçe kalemi, fon dilimi ve revizyon yazmak yalnız proje düzenleme izni
/// istiyordu; finans ekibine gider/gelir izni verip proje düzenleme vermeyen kurulum bütçe
/// kuramıyordu. Proje düzenleme izni yazma hakkını KORUR — mevcut hiçbir rolün yetkisi
/// daralmaz, yeni izin yalnız daha dar bir verme yolu açar.</para>
/// </summary>
public static class BudgetWritePermission
{
    public static async Task<bool> IsGrantedAsync(IAuthorizationService authorizationService)
        => await authorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageBudget)
           || await authorizationService.IsGrantedAsync(PlatformPermissions.Projects.Edit);

    public static async Task CheckAsync(IAuthorizationService authorizationService)
    {
        if (!await IsGrantedAsync(authorizationService))
        {
            throw new AbpAuthorizationException(code: AbpAuthorizationErrorCodes.GivenPolicyHasNotGrantedWithPolicyName)
                .WithData("PolicyName", PlatformPermissions.Projects.ManageBudget);
        }
    }
}
