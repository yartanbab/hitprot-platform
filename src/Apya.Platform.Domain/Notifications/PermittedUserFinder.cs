using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;

namespace Apya.Platform.Notifications;

/// <summary>
/// N-04 / N-05 · Duyurunun muhatabı: GEÇERLİ kiracı bağlamındaki etkin kullanıcılardan izni (kullanıcıya
/// ya da rolüne verilmiş) olanlar. Yetkisi olmayan kullanıcıya giden bildirim tıklanınca erişim hatasına
/// götürür; bu yüzden geniş dağıtımlar buradan süzülür. Çağıran kiracı bağlamını kendisi ayarlar.
/// </summary>
public class PermittedUserFinder : DomainService
{
    private readonly IIdentityUserRepository _userRepo;
    private readonly IPermissionStore _permissionStore;

    public PermittedUserFinder(IIdentityUserRepository userRepo, IPermissionStore permissionStore)
    {
        _userRepo = userRepo;
        _permissionStore = permissionStore;
    }

    public async Task<List<Guid>> ActiveUserIdsAsync()
        => (await _userRepo.GetListAsync()).Where(u => u.IsActive).Select(u => u.Id).ToList();

    public async Task<List<Guid>> WithPermissionAsync(IEnumerable<Guid> userIds, string permissionName)
    {
        var allowed = new List<Guid>();
        foreach (var userId in userIds)
        {
            if (await IsGrantedAsync(userId, permissionName))
            {
                allowed.Add(userId);
            }
        }

        return allowed;
    }

    private async Task<bool> IsGrantedAsync(Guid userId, string permissionName)
    {
        if (await _permissionStore.IsGrantedAsync(
                permissionName, UserPermissionValueProvider.ProviderName, userId.ToString()))
        {
            return true;
        }

        foreach (var roleName in await _userRepo.GetRoleNamesAsync(userId))
        {
            if (await _permissionStore.IsGrantedAsync(
                    permissionName, RolePermissionValueProvider.ProviderName, roleName))
            {
                return true;
            }
        }

        return false;
    }
}
